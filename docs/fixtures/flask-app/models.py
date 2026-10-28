class User:
    @staticmethod
    def query_all():
        return [{"id": 1, "name": "Alice"}]

class Item:
    @staticmethod
    def query_all():
        return [{"id": 101, "title": "Widget"}]
