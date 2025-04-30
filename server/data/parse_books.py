import random
from sqlalchemy import select
from server.extensions import db
from server.data.models import Books, Paragraphs

MIN_LINE_LENGTH = 106


def read_text_file(path, encoding='utf-8'):
    try:
        with open(path, 'r', encoding=encoding) as f:
            return f.read()
    except Exception as e:
        print('Error reading file:', e)
        return ''


def parse_paragraphs(data):
    paragraphs = []
    current_paragraph = ''
    lines = data.splitlines()
    for line in lines:
        if line.strip() == '':
            if current_paragraph:
                paragraphs.append(current_paragraph.strip())
                current_paragraph = ''
        else:
            current_paragraph += line + ' '
    if current_paragraph:
        paragraphs.append(current_paragraph.strip())
    return paragraphs


def get_title_author_name(paragraphs):
    title = next((s for s in paragraphs if 'Title:' in s), None)
    title = title.replace('Title:', '').strip() if title else 'Unknown'

    author = next((s for s in paragraphs if 'Author:' in s), None)
    author = author.replace('Author:', '').strip() if author else 'Unknown'

    return title, author


def get_random_paragraphs_from_book(paragraphs):
    eligible = [p for p in paragraphs if len(p) >= MIN_LINE_LENGTH]
    return random.sample(eligible, min(10, len(eligible)))


def save_paragraphs(file_path):
    data = read_text_file(file_path)
    if not data:
        return

    paragraphs = parse_paragraphs(data)
    title, author = get_title_author_name(paragraphs)
    selected_paragraphs = get_random_paragraphs_from_book(paragraphs)

    with db.session.begin():
        stmt = select(Books).where(Books.title == title, Books.author == author)
        book = db.session.execute(stmt).scalars().first()

        if not book:
            book = Books(title=title, author=author)
            db.session.add(book)
            db.session.flush()  # get book id after adding book row

        for text in selected_paragraphs:
            parag = Paragraphs(book_id=book.id, paragraph=text)
            db.session.add(parag)

        # print(f"Inserted {len(selected_paragraphs)} paragraphs for book -> {title} by {author}")
