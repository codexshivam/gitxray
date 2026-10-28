from app import create_app
from models import User

def test_app_creation():
    app = create_app()
    assert app is not None

def test_models():
    users = User.query_all()
    assert len(users) == 1
