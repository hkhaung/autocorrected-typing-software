import os


class Config:
    SQLALCHEMY_TRACK_MODIFICATIONS = False


class DevelopmentConfig(Config):
    path = os.path.abspath('server/data/dev.db')
    SQLALCHEMY_DATABASE_URI = f"sqlite:///{path}"


class ProductionConfig(Config):
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL')
