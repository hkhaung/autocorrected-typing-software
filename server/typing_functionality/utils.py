import string


def lines_from_file(path):
    """Return a list of strings, one for each line in a file."""
    with open(path, 'r') as f:
        return [line.strip() for line in f.readlines()]


def remove_punctuation(s):
    """Return a string with the same contents as s, but with punctuation removed."""
    punctuation_remover = str.maketrans('', '', string.punctuation)
    return s.strip().translate(punctuation_remover)


def reformat(word, raw_word):
    """Reformat WORD to match the capitalization and punctuation of RAW_WORD."""
    # handle capitalization
    if raw_word != "" and raw_word[0].isupper():
        word = word.capitalize()

    # find the boundaries of the raw word
    first = 0
    while first < len(raw_word) and raw_word[first] in string.punctuation:
        first += 1
    last = len(raw_word) - 1
    while last > first and raw_word[last] in string.punctuation:
        last -= 1

    # add wrapping punctuation to the word
    if raw_word != word:
        word = raw_word[:first] + word
        word = word + raw_word[last + 1:]

    return word


def similar(w, v, n):
    """Determines how many letters are common between w and v.
    Returns true if the intersection is within n elements"""
    intersect = len(w.intersection(v))
    return intersect >= len(w) - n and intersect >= len(v) - n
