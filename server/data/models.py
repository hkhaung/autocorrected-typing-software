from server.extensions import db
from sqlalchemy import func


class Players(db.Model):
    __tablename__ = 'players'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    player_name = db.Column(db.String(40), nullable=False, unique=True)
    # player_password = db.Column(db.Text, nullable=False)

    def __repr__(self):
        return f"<Players(id={self.id}, player_name={self.player_name})>"


class PlayerStats(db.Model):
    __tablename__ = 'player_stats'

    id = db.Column(db.Integer, db.ForeignKey('players.id'), primary_key=True)
    average_wpm = db.Column(db.Float)
    average_accuracy = db.Column(db.Float)

    def __repr__(self):
        return f"<PlayerStats(id={self.id}, average_wpm={self.average_wpm}, average_accuracy={self.average_accuracy})>"


class Leaderboard(db.Model):
    __tablename__ = 'leaderboard'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    created = db.Column(db.TIMESTAMP, nullable=False, server_default=func.current_timestamp())
    player_id = db.Column(db.Integer, db.ForeignKey('players.id'), nullable=False)
    player_name = db.Column(db.Text, nullable=False)
    player_wpm = db.Column(db.Integer, nullable=False)
    player_accuracy = db.Column(db.Float, nullable=False)

    def __repr__(self):
        return f"<Leaderboard(id={self.id}, player_id={self.player_id}, player_wpm={self.player_wpm})>"


class Books(db.Model):
    __tablename__ = 'books'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    title = db.Column(db.Text, nullable=False)
    author = db.Column(db.String(255), nullable=False, unique=True)

    def __repr__(self):
        return f"<Books(id={self.id}, title={self.title}, author={self.author})>"


class Paragraphs(db.Model):
    __tablename__ = 'paragraphs'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    book_id = db.Column(db.Integer, db.ForeignKey('books.id'), nullable=False)
    paragraph = db.Column(db.String(510), unique=True)

    def __repr__(self):
        return f"<Paragraphs(id={self.id}, book_id={self.book_id})>"
