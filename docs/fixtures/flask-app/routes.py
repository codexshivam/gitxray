from models import User, Item
from config import Config

def register_routes(app):
    @app.route("/users")
    def get_users():
        users = User.query_all()
        return {"users": users}

    @app.route("/items")
    def get_items():
        items = Item.query_all()
        return {"items": items}
