import sqlite3

connection = sqlite3.connect("cafe.db")
cursor = connection.cursor()

try:
    cursor.execute("""
        ALTER TABLE users
        ADD COLUMN reward_points INTEGER DEFAULT 0
    """)
    print("✅ reward_points column added successfully.")
except sqlite3.OperationalError as e:
    print("⚠️", e)

connection.commit()
connection.close()