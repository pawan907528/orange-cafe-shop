import sqlite3

conn = sqlite3.connect("cafe.db")
cursor = conn.cursor()

# Delete old orders table
cursor.execute("DROP TABLE IF EXISTS orders")

# Create new orders table
cursor.execute("""
CREATE TABLE orders(

    id INTEGER PRIMARY KEY AUTOINCREMENT,

    customer TEXT,

    email TEXT,

    items TEXT,

    payment TEXT,

    subtotal REAL,

    delivery REAL,

    gst REAL,

    total REAL,

    status TEXT DEFAULT 'Confirmed',

    date TEXT DEFAULT CURRENT_TIMESTAMP

)
""")

conn.commit()
conn.close()

print("✅ Orders table recreated successfully.")