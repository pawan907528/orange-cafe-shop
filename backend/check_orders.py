import sqlite3

connection = sqlite3.connect("cafe.db")
cursor = connection.cursor()

cursor.execute(
    "SELECT id, customer, email, total FROM orders ORDER BY id DESC"
)

rows = cursor.fetchall()

for row in rows:
    print(row)

connection.close()