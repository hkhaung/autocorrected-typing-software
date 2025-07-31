from flask import Flask, send_from_directory
from server.data.parse_books import save_paragraphs
from server.extensions import db

from server.routes import api_bp

from sqlalchemy import inspect, select, func
from server.data import models
from server.data.parse_books import save_paragraphs

from server.extensions import socketio


def create_app():
    from server.config import DevelopmentConfig
    from flask_cors import CORS

    app = Flask(__name__)
    CORS(app)
    app.config.from_object(DevelopmentConfig)
    
    app.register_blueprint(api_bp)

    db.init_app(app)
    with app.app_context():
        db.create_all()
        seed_data()
        
    socketio.init_app(app, cors_allowed_origins='*')

    return app


def seed_data():
    def tables_exist_and_have_data():
        inspector = inspect(db.engine)
        tables = inspector.get_table_names()

        if 'books' not in tables or 'paragraphs' not in tables:
            return False

        with db.session.begin():
            books_count = db.session.execute(select(func.count()).select_from(models.Books)).scalar_one()
            paragraphs_count = db.session.execute(select(func.count()).select_from(models.Paragraphs)).scalar_one()

        return books_count > 0 and paragraphs_count > 0

    
    if not tables_exist_and_have_data():
        save_paragraphs("server/data/advofhuckfinn.txt")
        save_paragraphs("server/data/mobydick.txt")
        save_paragraphs("server/data/greatgatsby.txt")
    else:
        print("Database already seeded")


if __name__ == '__main__':
    try:
        app = create_app()
        socketio.run(app, debug=True)
        
    except Exception as e:
        print(f"Error starting the app: {e}")
