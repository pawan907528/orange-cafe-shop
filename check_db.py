import sys

sys.path.insert(0, "backend")

from database import get_connection

connection = get_connection()
cursor = connection.cursor()

print("\n===== ORDERS TABLE =====")

orders = cursor.execute("""
    SELECT
        id,
        customer,
        email,
        items,
        payment,
        subtotal,
        delivery,
        gst,
        total,
        status,
        date
    FROM orders
    ORDER BY id
""").fetchall()

if not orders:
    print("No orders found.")

for order in orders:
    print(dict(order))

connection.close()