import sqlite3

connection = sqlite3.connect("cafe.db")
cursor = connection.cursor()

cursor.execute("SELECT name, email, reward_points FROM users")

for row in cursor.fetchall():
    print(row)

connection.close()