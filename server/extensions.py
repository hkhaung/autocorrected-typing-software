from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate

import os


db = SQLAlchemy()

if os.environ.get('FLASK_ENV') == 'production':
  migrate = Migrate()
