from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_mail import Mail, Message
from werkzeug.security import generate_password_hash

import random
import time

from database import get_connection

from models import (
    create_tables,
    insert_default_menu,

    # Menu
    get_menu_items,
    add_menu_item,
    update_menu_item,
    delete_menu_item,

    # Orders
    get_orders,
    get_orders_by_email,
    add_order,
    update_order_status,

    # Reward Points
    get_reward_points,
    add_reward_points,
    redeem_reward_points,

    # Personalized Offers
    get_personalized_offer
)

from auth import auth


# ==================================================
# CREATE FLASK APP
# ==================================================

app = Flask(__name__)

CORS(app)


# ==================================================
# EMAIL / OTP CONFIGURATION
# ==================================================

app.config["MAIL_SERVER"] = "smtp.gmail.com"
app.config["MAIL_PORT"] = 587
app.config["MAIL_USE_TLS"] = True

app.config["MAIL_USERNAME"] = "cafeorange670@gmail.com"

app.config["MAIL_PASSWORD"] = ""

app.config["MAIL_DEFAULT_SENDER"] = "cafeorange670@gmail.com"

mail = Mail(app)


# ==================================================
# OTP STORAGE
# ==================================================

otp_storage = {}


# ==================================================
# REGISTER AUTHENTICATION
# ==================================================

app.register_blueprint(auth)


# ==================================================
# CREATE DATABASE
# ==================================================

create_tables()

insert_default_menu()


# ==================================================
# HOME ROUTE
# ==================================================

@app.route("/", methods=["GET"])
def home():

    return jsonify({
        "message":
            "Cafe Shop Backend Running Successfully!"
    })


# ==================================================
# MENU ROUTES
# ==================================================


# --------------------------
# Get Menu
# --------------------------

@app.route("/menu", methods=["GET"])
def menu():

    return jsonify(
        get_menu_items()
    )


# --------------------------
# Add Menu Item
# --------------------------

@app.route("/menu", methods=["POST"])
def add_menu():

    data = request.get_json()

    add_menu_item(
        data["name"],
        data["category"],
        data["price"]
    )

    return jsonify({
        "message":
            "Menu Item Added Successfully"
    })


# --------------------------
# Update Menu Item
# --------------------------

@app.route(
    "/menu/<int:item_id>",
    methods=["PUT"]
)
def update_menu(item_id):

    data = request.get_json()

    update_menu_item(
        item_id,
        data["name"],
        data["category"],
        data["price"]
    )

    return jsonify({
        "message":
            "Menu Item Updated Successfully"
    })


# --------------------------
# Delete Menu Item
# --------------------------

@app.route(
    "/menu/<int:item_id>",
    methods=["DELETE"]
)
def delete_menu(item_id):

    delete_menu_item(item_id)

    return jsonify({
        "message":
            "Menu Item Deleted Successfully"
    })


# ==================================================
# AI MOOD RECOMMENDATION
# ==================================================

@app.route(
    "/recommend/<mood>",
    methods=["GET"]
)
def recommend(mood):

    mood = mood.lower()

    recommendations = {

        "happy": [
            {
                "name": "Cappuccino",
                "category": "Coffee"
            },
            {
                "name": "Chocolate Brownie",
                "category": "Dessert"
            }
        ],

        "sad": [
            {
                "name": "Hot Chocolate",
                "category": "Beverage"
            },
            {
                "name": "Blueberry Cheesecake",
                "category": "Dessert"
            }
        ],

        "sleepy": [
            {
                "name": "Espresso",
                "category": "Coffee"
            },
            {
                "name": "Garlic Bread",
                "category": "Snacks"
            }
        ],

        "energetic": [
            {
                "name": "Cold Coffee",
                "category": "Coffee"
            },
            {
                "name": "Veg Burger",
                "category": "Snacks"
            }
        ],

        "romantic": [
            {
                "name": "Latte",
                "category": "Coffee"
            },
            {
                "name": "Chocolate Brownie",
                "category": "Dessert"
            }
        ]
    }

    return jsonify(
        recommendations.get(mood, [])
    )


# ==================================================
# ORDER ROUTES
# ==================================================


# --------------------------
# Get All Orders
# --------------------------

# ==================================================
# GET ORDERS
# ==================================================

@app.route(
    "/orders",
    methods=["GET"]
)
def orders():

    email = request.args.get("email")

    # ------------------------------------------
    # Customer request
    # ------------------------------------------

    if email:

        email = email.strip().lower()

        return jsonify(
            get_orders_by_email(email)
        )

    # ------------------------------------------
    # Admin request
    # ------------------------------------------

    return jsonify(
        get_orders()
    )


# ==================================================
# PLACE ORDER + REWARD POINTS
# ==================================================

@app.route(
    "/place-order",
    methods=["POST"]
)
def place_order():

    try:

        data = request.get_json()

        # --------------------------
        # Save Order
        # --------------------------

        add_order(

            data["customer"],
            data["email"],
            data["items"],
            data["payment"],
            data["subtotal"],
            data["delivery"],
            data["gst"],
            data["total"]

        )

        # --------------------------
        # Reward Points
        # ₹100 = 1 Point
        # --------------------------

        reward_points = int(
            data["total"] // 100
        )

        print(
            "EMAIL FROM PAYMENT:",
            data["email"]
        )

        print(
            "POINTS TO ADD:",
            reward_points
        )

        add_reward_points(
            data["email"],
            reward_points
        )

        print(
            "REWARD UPDATE COMPLETED"
        )

        return jsonify({

            "message":
                "Order Placed Successfully",

            "earned_points":
                reward_points

        })

    except Exception as e:

        print(
            "ORDER ERROR:",
            e
        )

        return jsonify({

            "message":
                str(e)

        }), 500


# ==================================================
# UPDATE ORDER STATUS
# ==================================================

@app.route(
    "/orders/<int:order_id>/status",
    methods=["PUT"]
)
def change_order_status(order_id):

    try:

        data = request.get_json()

        # --------------------------
        # Validate Request
        # --------------------------

        if not data:

            return jsonify({
                "message": "Request data is missing."
            }), 400

        status = data.get("status")

        if not status:

            return jsonify({
                "message": "Order status is required."
            }), 400

        # --------------------------
        # Allowed Statuses
        # --------------------------

        allowed_statuses = [
            "Confirmed",
            "Preparing",
            "Out for Delivery",
            "Delivered"
        ]

        if status not in allowed_statuses:

            return jsonify({
                "message": "Invalid order status."
            }), 400

        # --------------------------
        # Update Database
        # --------------------------

        update_order_status(
            order_id,
            status
        )

        # --------------------------
        # Success
        # --------------------------

        return jsonify({

            "message":
                "Order Status Updated Successfully",

            "order_id":
                order_id,

            "status":
                status

        }), 200

    except ValueError as error:

        return jsonify({

            "message":
                str(error)

        }), 400

    except Exception as error:

        print(
            "ORDER STATUS ERROR:",
            error
        )

        return jsonify({

            "message":
                "Failed to update order status."

        }), 500

# Get Reward Points

@app.route(
    "/reward/<email>",
    methods=["GET"]
)
def reward_points(email):

    points = get_reward_points(
        email
    )

    return jsonify({

        "reward_points":
            points

    })


# --------------------------
# Add Reward Points
# --------------------------

@app.route(
    "/reward/add",
    methods=["POST"]
)
def reward_add():

    data = request.get_json()

    email = data["email"]
    points = data["points"]

    add_reward_points(
        email,
        points
    )

    return jsonify({

        "message":
            "Reward Points Added Successfully"

    })


# --------------------------
# Redeem Reward Points
# --------------------------

@app.route(
    "/reward/redeem",
    methods=["POST"]
)
def reward_redeem():

    data = request.get_json()

    email = data["email"]
    points = data["points"]

    success = redeem_reward_points(
        email,
        points
    )

    if success:

        return jsonify({

            "message":
                "Reward Redeemed Successfully"

        })

    return jsonify({

        "message":
            "Not Enough Reward Points"

    }), 400


# ==================================================
# PERSONALIZED OFFER API
# ==================================================

@app.route(
    "/personalized-offer/<email>",
    methods=["GET"]
)
def personalized_offer(email):

    try:

        offer = get_personalized_offer(
            email
        )

        return jsonify(
            offer
        )

    except Exception as e:

        print(
            "PERSONALIZED OFFER ERROR:",
            e
        )

        return jsonify({

            "message":
                str(e)

        }), 500


# ==================================================
# FORGOT PASSWORD
# SEND OTP
# ==================================================

@app.route(
    "/forgot-password",
    methods=["POST"]
)
def forgot_password():

    try:

        data = request.get_json()

        email = data.get("email")

        # --------------------------
        # Validate Email
        # --------------------------

        if not email:

            return jsonify({

                "message":
                    "Please enter your email."

            }), 400

        email = email.strip().lower()

        # --------------------------
        # Find User
        # --------------------------

        connection = get_connection()
        cursor = connection.cursor()

        cursor.execute(
            """
            SELECT id, name, email
            FROM users
            WHERE email=?
            """,
            (email,)
        )

        user = cursor.fetchone()

        connection.close()

        # --------------------------
        # Email Not Found
        # --------------------------

        if not user:

            return jsonify({

                "message":
                    "Email is not registered."

            }), 404

        # --------------------------
        # Generate 6 Digit OTP
        # --------------------------

        otp = str(
            random.randint(
                100000,
                999999
            )
        )

        # --------------------------
        # OTP Valid For 5 Minutes
        # --------------------------

        expires = time.time() + 300

        otp_storage[email] = {

            "otp":
                otp,

            "expires":
                expires

        }

        print(
            "OTP GENERATED:",
            email,
            otp
        )

        # --------------------------
        # Create Email
        # --------------------------

        message = Message(

            subject=
                "Orange Cafe - Password Reset OTP",

            recipients=[
                email
            ],

            body=f"""
Hello {user["name"]},

We received a request to reset your
Orange Cafe Shop password.

Your OTP is:

{otp}

This OTP is valid for 5 minutes.

If you did not request a password reset,
please ignore this email.

Thank you,

Orange Cafe Shop
"""
        )

        # --------------------------
        # Send Email
        # --------------------------

        mail.send(message)

        print(
            "OTP EMAIL SENT TO:",
            email
        )

        return jsonify({

            "message":
                "OTP sent successfully to your email."

        }), 200

    except Exception as e:

        print(
            "FORGOT PASSWORD ERROR:",
            e
        )

        return jsonify({

            "message":
                "Unable to send OTP. Please try again."

        }), 500


# ==================================================
# VERIFY OTP
# ==================================================

@app.route(
    "/verify-otp",
    methods=["POST"]
)
def verify_otp():

    try:

        data = request.get_json()

        email = data.get("email")
        otp = data.get("otp")

        if not email or not otp:

            return jsonify({

                "message":
                    "Email and OTP are required."

            }), 400

        email = email.strip().lower()
        otp = otp.strip()

        # --------------------------
        # Find Saved OTP
        # --------------------------

        saved_otp = otp_storage.get(email)

        if not saved_otp:

            return jsonify({

                "message":
                    "OTP not found. Please request a new OTP."

            }), 400

        # --------------------------
        # Check Expiration
        # --------------------------

        if time.time() > saved_otp["expires"]:

            otp_storage.pop(
                email,
                None
            )

            return jsonify({

                "message":
                    "OTP has expired. Please request a new OTP."

            }), 400

        # --------------------------
        # Check OTP
        # --------------------------

        if saved_otp["otp"] != otp:

            return jsonify({

                "message":
                    "Invalid OTP."

            }), 400

        return jsonify({

            "message":
                "OTP verified successfully."

        }), 200

    except Exception as e:

        print(
            "VERIFY OTP ERROR:",
            e
        )

        return jsonify({

            "message":
                "Unable to verify OTP."

        }), 500


# ==================================================
# RESET PASSWORD
# SECURE PASSWORD HASHING
# ==================================================

@app.route(
    "/reset-password",
    methods=["POST"]
)
def reset_password():

    try:

        data = request.get_json()

        email = data.get("email")
        otp = data.get("otp")
        new_password = data.get("new_password")

        # --------------------------
        # Validate Fields
        # --------------------------

        if not email or not otp or not new_password:

            return jsonify({

                "message":
                    "All fields are required."

            }), 400

        email = email.strip().lower()
        otp = otp.strip()

        # --------------------------
        # Check OTP
        # --------------------------

        saved_otp = otp_storage.get(email)

        if not saved_otp:

            return jsonify({

                "message":
                    "OTP not found. Please request a new OTP."

            }), 400

        # --------------------------
        # Check OTP Expiration
        # --------------------------

        if time.time() > saved_otp["expires"]:

            otp_storage.pop(
                email,
                None
            )

            return jsonify({

                "message":
                    "OTP has expired. Please request a new OTP."

            }), 400

        # --------------------------
        # Check OTP Value
        # --------------------------

        if saved_otp["otp"] != otp:

            return jsonify({

                "message":
                    "Invalid OTP."

            }), 400

        # --------------------------
        # Password Length
        # --------------------------

        if len(new_password) < 6:

            return jsonify({

                "message":
                    "Password must contain at least 6 characters."

            }), 400

        # ==================================================
        # HASH NEW PASSWORD
        # ==================================================

        hashed_password = generate_password_hash(
            new_password
        )

        print(
            "PASSWORD HASH GENERATED FOR:",
            email
        )

        # --------------------------
        # Update Database
        # --------------------------

        connection = get_connection()
        cursor = connection.cursor()

        cursor.execute(
            """
            UPDATE users
            SET password=?
            WHERE email=?
            """,
            (
                hashed_password,
                email
            )
        )

        updated_rows = cursor.rowcount

        connection.commit()
        connection.close()

        # --------------------------
        # User Not Found
        # --------------------------

        if updated_rows == 0:

            return jsonify({

                "message":
                    "User not found."

            }), 404

        # --------------------------
        # Remove OTP
        # --------------------------

        otp_storage.pop(
            email,
            None
        )

        return jsonify({

            "message":
                "Password reset successfully."

        }), 200

    except Exception as e:

        print(
            "RESET PASSWORD ERROR:",
            e
        )

        return jsonify({

            "message":
                "Unable to reset password."

        }), 500

# ==================================================
# CHANGE USER ROLE
# ==================================================

@app.route("/change-role", methods=["POST"])
def change_role():

    try:

        data = request.get_json()

        if not data:
            return jsonify({
                "message": "Request data is missing."
            }), 400

        email = data.get("email")
        role = data.get("role")

        if not email or not role:
            return jsonify({
                "message": "Email and role are required."
            }), 400

        email = email.strip().lower()
        role = role.strip().lower()

        # Allowed roles
        allowed_roles = [
            "admin",
            "customer"
        ]

        if role not in allowed_roles:
            return jsonify({
                "message": "Invalid role. Use admin or customer."
            }), 400

        connection = get_connection()
        cursor = connection.cursor()

        # Check user
        cursor.execute(
            """
            SELECT id, name, email, role
            FROM users
            WHERE LOWER(email)=?
            """,
            (email,)
        )

        user = cursor.fetchone()

        if not user:

            connection.close()

            return jsonify({
                "message": "User not found."
            }), 404

        # Update role
        cursor.execute(
            """
            UPDATE users
            SET role=?
            WHERE LOWER(email)=?
            """,
            (
                role,
                email
            )
        )

        connection.commit()

        cursor.execute(
            """
            SELECT id, name, email, role
            FROM users
            WHERE LOWER(email)=?
            """,
            (email,)
        )

        updated_user = cursor.fetchone()

        connection.close()

        return jsonify({

            "message": "User role updated successfully.",

            "user": dict(updated_user)

        }), 200

    except Exception as e:

        print(
            "CHANGE ROLE ERROR:",
            e
        )

        return jsonify({
            "message": str(e)
        }), 500

# ==================================================
# GET ALL USERS
# ==================================================

@app.route("/users", methods=["GET"])
def get_all_users():

    try:

        connection = get_connection()
        cursor = connection.cursor()

        cursor.execute("""
            SELECT
                id,
                name,
                email,
                role
            FROM users
            ORDER BY id
        """)

        users = cursor.fetchall()

        connection.close()

        return jsonify([
            dict(user)
            for user in users
        ])

    except Exception as e:

        print("GET USERS ERROR:", e)

        return jsonify({
            "message": str(e)
        }), 500

# ==================================================
# RUN FLASK SERVER
# ==================================================

if __name__ == "__main__":

    app.run(
        debug=True
    )