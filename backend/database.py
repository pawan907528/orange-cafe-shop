import os
import sqlite3

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATABASE_NAME = os.environ.get("DATABASE_PATH", os.path.join(BASE_DIR, "cafe.db"))


def get_connection():
    connection = sqlite3.connect(DATABASE_NAME)
    connection.row_factory = sqlite3.Row

    return connection