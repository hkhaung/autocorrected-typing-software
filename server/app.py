from flask import Flask, send_from_directory
from server.data.parse_books import save_paragraphs
from server.extensions import db

from server.routes import api_bp

from sqlalchemy import inspect, select, func
from server.data import models
from server.data.parse_books import save_paragraphs

from server.extensions import socketio

import os
from dotenv import load_dotenv


load_dotenv()


def create_app():
    from server.config import ProductionConfig

    app = Flask(__name__, static_folder='build', static_url_path='/')
    app.config.from_object(ProductionConfig)

    # Route for serving React frontend
    @app.route('/', defaults={'path': ''})
    @app.route('/<path:path>')
    def static_proxy(path):
        if path != "" and os.path.exists(os.path.join(app.static_folder, path)):
            return send_from_directory(app.static_folder, path)
        else:
            return send_from_directory(app.static_folder, 'index.html')
    
    app.register_blueprint(api_bp)

    db.init_app(app)
    with app.app_context():
        db.create_all()
        seed_data()
        
    socketio.init_app(app)
        
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

