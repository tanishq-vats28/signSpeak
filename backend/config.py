import os

config = {
    'SECRET_KEY': os.environ.get('SECRET_KEY', 'your_secret_key_here'),
    'SQLALCHEMY_DATABASE_URI': os.environ.get('DATABASE_URL', 'sqlite:///users.db'),
    'SQLALCHEMY_TRACK_MODIFICATIONS': False
}
