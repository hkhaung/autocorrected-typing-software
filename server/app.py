from flask import Flask, send_from_directory
from server.data.parse_books import save_paragraphs
from server.extensions import db

from server.routes import api_bp

from sqlalchemy import inspect
from server.data.models import Players, PlayerStats, Leaderboard
from server.data.parse_books import save_paragraphs

from server.extensions import socketio

import os
from dotenv import load_dotenv

load_dotenv()
print("Running in", os.environ.get("FLASK_ENV"))


def create_app():
    migrate = None
    if os.environ.get('FLASK_ENV') == 'production':
        from server.extensions import migrate

        app = Flask(__name__, static_folder='build', static_url_path='/')

        from server.config import ProductionConfig
        app.config.from_object(ProductionConfig)

        # Route for serving React frontend
        @app.route('/', defaults={'path': ''})
        @app.route('/<path:path>')
        def static_proxy(path):
            if path != "" and os.path.exists(os.path.join(app.static_folder, path)):
                return send_from_directory(app.static_folder, path)
            else:
                return send_from_directory(app.static_folder, 'index.html')
    else:
        from flask_cors import CORS

        app = Flask(__name__)
        CORS(app)

        from server.config import DevelopmentConfig
        app.config.from_object(DevelopmentConfig)
    
    
    app.register_blueprint(api_bp)

    db.init_app(app)    
    if os.environ.get('FLASK_ENV') == 'production':
        migrate.init_app(app, db)
        seed_data()

        socketio.init_app(app)
    else:
        with app.app_context():
            db.create_all()
            seed_data()
        
        socketio.init_app(app, cors_allowed_origins="*")
        
    return app


def seed_data():
    def tables_exist():
        inspector = inspect(db.engine)
        return 'books' in inspector.get_table_names() and 'paragraphs' in inspector.get_table_names()
    
    if not tables_exist():
        # print("Skipping seed -> tables not created yet.")
        return
    
    save_paragraphs("server/data/advofhuckfinn.txt")
    save_paragraphs("server/data/mobydick.txt")
    save_paragraphs("server/data/greatgatsby.txt")


if __name__ == '__main__':
    try:
        app = create_app()
        if os.environ.get('FLASK_ENV') == 'development':
            socketio.run(app, debug=True)
        else:
            socketio.run(app, host='0.0.0.0', port=5000)
        
    except Exception as e:
        print(f"Error starting the app: {e}")
