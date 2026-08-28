from database import get_connection


# ==========================
# Create Tables
# ==========================

def create_tables():
    connection = get_connection()
    cursor = connection.cursor()

        # Reward Points Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS reward_points(
        email TEXT PRIMARY KEY,
        points INTEGER DEFAULT 0
    )
    """)

    # Users Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS users(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role TEXT DEFAULT 'customer'
    )
    """)

    # Menu Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS menu_items(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        category TEXT NOT NULL,
        price REAL NOT NULL
    )
    """)

    cursor.execute("""

CREATE TABLE IF NOT EXISTS orders(

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


    connection.commit()
    connection.close()



# ==========================
# Insert Default Menu
# ==========================

def insert_default_menu():

    connection = get_connection()
    cursor = connection.cursor()

    cursor.execute("SELECT COUNT(*) FROM menu_items")

    count = cursor.fetchone()[0]

    if count == 0:

        default_items = [

            ("Espresso", "Coffee", 120),
            ("Cappuccino", "Coffee", 180),
            ("Latte", "Coffee", 190),
            ("Mocha", "Coffee", 210),
            ("Cold Coffee", "Coffee", 170),

            ("Green Tea", "Tea", 90),
            ("Masala Tea", "Tea", 80),

            ("Hot Chocolate", "Beverage", 160),
            ("Mango Milkshake", "Beverage", 180),
            ("Chocolate Milkshake", "Beverage", 190),

            ("Veg Burger", "Snacks", 150),
            ("Cheese Burger", "Snacks", 190),
            ("French Fries", "Snacks", 120),
            ("Garlic Bread", "Snacks", 140),
            ("Veg Sandwich", "Snacks", 130),
            ("Grilled Sandwich", "Snacks", 170),

            ("Margherita Pizza", "Pizza", 260),
            ("Farmhouse Pizza", "Pizza", 320),

            ("Chocolate Brownie", "Dessert", 150),
            ("Blueberry Cheesecake", "Dessert", 220)

        ]

        cursor.executemany(
            """
            INSERT INTO menu_items(name, category, price)
            VALUES(?,?,?)
            """,
            default_items
        )

    connection.commit()
    connection.close()


# ==========================
# Get Menu Items
# ==========================

def get_menu_items():

    connection = get_connection()
    cursor = connection.cursor()

    cursor.execute("SELECT * FROM menu_items")

    rows = cursor.fetchall()

    connection.close()

    return [dict(row) for row in rows]


# ==========================
# Add Menu Item
# ==========================

def add_menu_item(name, category, price):

    connection = get_connection()
    cursor = connection.cursor()

    cursor.execute(
        """
        INSERT INTO menu_items(name, category, price)
        VALUES(?,?,?)
        """,
        (name, category, price)
    )

    connection.commit()
    connection.close()


# ==========================
# Update Menu Item
# ==========================

def update_menu_item(item_id, name, category, price):

    connection = get_connection()
    cursor = connection.cursor()

    cursor.execute(
        """
        UPDATE menu_items
        SET name=?, category=?, price=?
        WHERE id=?
        """,
        (name, category, price, item_id)
    )

    connection.commit()
    connection.close()


# ==========================
# Delete Menu Item
# ==========================

def delete_menu_item(item_id):

    connection = get_connection()
    cursor = connection.cursor()

    cursor.execute(
        "DELETE FROM menu_items WHERE id=?",
        (item_id,)
    )

    connection.commit()
    connection.close()


# ==========================
# Get All Orders
# ==========================

def get_orders():

    connection = get_connection()
    cursor = connection.cursor()

    cursor.execute("""
    SELECT * FROM orders
    ORDER BY id DESC
    """)

    rows = cursor.fetchall()

    connection.close()

    return [dict(row) for row in rows]

# ==========================================================
# GET ORDERS FOR ONE CUSTOMER
# ==========================================================

def get_orders_by_email(email):

    connection = get_connection()
    cursor = connection.cursor()

    cursor.execute("""
        SELECT *
        FROM orders
        WHERE email = ?
        ORDER BY id DESC
    """, (email,))

    rows = cursor.fetchall()

    connection.close()

    return [
        dict(row)
        for row in rows
    ]


# ==========================
# Add Order
# ==========================

def add_order(customer, email, items, payment, subtotal, delivery, gst, total):

    import json

    connection = get_connection()
    cursor = connection.cursor()

    cursor.execute(
        """
        INSERT INTO orders(

            customer,
            email,
            items,
            payment,
            subtotal,
            delivery,
            gst,
            total,
            status

        )

        VALUES(?,?,?,?,?,?,?,?,?)
        """,
        (
            customer,
            email,
            json.dumps(items),
            payment,
            subtotal,
            delivery,
            gst,
            total,
            "Confirmed"
        )
    )

    connection.commit()
    connection.close()


# ==========================
# Update Order Status
# ==========================

def update_order_status(order_id, status):

    connection = get_connection()
    cursor = connection.cursor()

    cursor.execute("""
    UPDATE orders
    SET status=?
    WHERE id=?
    """, (status, order_id))

    connection.commit()
    connection.close()

    # ==========================
# Reward Points Functions
# ==========================

def get_reward_points(email):

    connection = get_connection()
    cursor = connection.cursor()

    cursor.execute(
        """
        SELECT reward_points
        FROM users
        WHERE email=?
        """,
        (email,)
    )

    row = cursor.fetchone()

    connection.close()

    if row:
        return row["reward_points"]

    return 0


def add_reward_points(email, points):

    connection = get_connection()
    cursor = connection.cursor()

    cursor.execute(
        """
        UPDATE users
        SET reward_points = reward_points + ?
        WHERE email=?
        """,
        (points, email)
    )

    connection.commit()
    connection.close()


def redeem_reward_points(email, points):

    connection = get_connection()
    cursor = connection.cursor()

    cursor.execute(
        """
        SELECT reward_points
        FROM users
        WHERE email=?
        """,
        (email,)
    )

    user = cursor.fetchone()

    if not user:

        connection.close()

        return False

    current_points = user["reward_points"]

    if current_points < points:

        connection.close()

        return False

    cursor.execute(
        """
        UPDATE users
        SET reward_points = reward_points - ?
        WHERE email=?
        """,
        (points, email)
    )

    connection.commit()
    connection.close()

    return True

# ==========================
# Reward Points
# ==========================

def get_reward_points(email):

    connection = get_connection()
    cursor = connection.cursor()

    cursor.execute(
        """
        SELECT reward_points
        FROM users
        WHERE email=?
        """,
        (email,)
    )

    user = cursor.fetchone()

    connection.close()

    if user:
        return user["reward_points"]

    return 0


# ==========================
# Add Reward Points
# ==========================

def add_reward_points(email, points):

    connection = get_connection()
    cursor = connection.cursor()

    cursor.execute(
        """
        UPDATE users
        SET reward_points = reward_points + ?
        WHERE email=?
        """,
        (points, email)
    )

    connection.commit()
    connection.close()


# ==========================
# Redeem Reward Points
# ==========================

def redeem_reward_points(email, points):

    connection = get_connection()
    cursor = connection.cursor()

    cursor.execute(
        """
        SELECT reward_points
        FROM users
        WHERE email=?
        """,
        (email,)
    )

    user = cursor.fetchone()

    if not user:

        connection.close()

        return False

    current_points = user["reward_points"]

    if current_points < points:

        connection.close()

        return False

    cursor.execute(
        """
        UPDATE users
        SET reward_points = reward_points - ?
        WHERE email=?
        """,
        (points, email)
    )

    connection.commit()
    connection.close()

    return True

# ==========================================
# SMART PERSONALIZED OFFERS
# ==========================================

def get_personalized_offer(email):

    connection = get_connection()
    cursor = connection.cursor()

    # Get customer's orders
    cursor.execute(
        """
        SELECT *
        FROM orders
        WHERE email=?
        ORDER BY id DESC
        """,
        (email,)
    )

    orders = cursor.fetchall()

    # Get customer's reward points
    cursor.execute(
        """
        SELECT reward_points
        FROM users
        WHERE email=?
        """,
        (email,)
    )

    user = cursor.fetchone()

    connection.close()

    # Default values
    reward_points = 0

    if user:
        reward_points = user["reward_points"] or 0

    # ==========================================
    # New Customer
    # ==========================================

    if len(orders) == 0:

        return {
            "type": "welcome",
            "title": "🎉 Welcome Offer",
            "message": "Get 10% OFF on your first order!",
            "discount": 10,
            "category": "All"
        }

    # ==========================================
    # Calculate Total Spending
    # ==========================================

    total_spending = sum(
        order["total"] or 0
        for order in orders
    )

    # ==========================================
    # Premium Customer
    # ==========================================

    if total_spending >= 1000:

        return {
            "type": "premium",
            "title": "👑 Premium Customer Offer",
            "message": "Enjoy ₹150 OFF on your next order!",
            "discount": 150,
            "category": "All"
        }

    # ==========================================
    # Reward Points Offer
    # ==========================================

    if reward_points >= 10:

        return {
            "type": "reward",
            "title": "🎁 Loyalty Reward",
            "message": "You have enough points for a FREE Coffee!",
            "discount": 0,
            "category": "Coffee"
        }

    # ==========================================
    # Regular Customer
    # ==========================================

    return {
        "type": "special",
        "title": "☕ Special Offer",
        "message": "Get 10% OFF on your next order!",
        "discount": 10,
        "category": "All"
    }