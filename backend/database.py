import sqlite3
import os

DATABASE_NAME = "cafe.db"

def get_connection():
    print("Database Path:", os.path.abspath(DATABASE_NAME))

    connection = sqlite3.connect(DATABASE_NAME)
    connection.row_factory = sqlite3.Row

    return connection