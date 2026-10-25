from flask import Blueprint, request, jsonify
from database import get_connection
from security import create_token
from werkzeug.security import generate_password_hash, check_password_hash
 
 
# ==================================================
# AUTH BLUEPRINT
# ==================================================
 
auth = Blueprint("auth", __name__)
 
 
# ==================================================
# REGISTER
# ==================================================
 
@auth.route("/register", methods=["POST"])
def register():
 
    try:
 
        data = request.get_json()
 
        name = data.get("name")
        email = data.get("email")
        password = data.get("password")
 
        # --------------------------
        # Validate fields
        # --------------------------
 
        if not name or not email or not password:
 
            return jsonify({
                "message": "Please fill all fields."
            }), 400
 
        name = name.strip()
        email = email.strip().lower()
 
        # --------------------------
        # Password length
        # --------------------------
 
        if len(password) < 6:
 
            return jsonify({
                "message":
                    "Password must be at least 6 characters."
            }), 400
 
        # --------------------------
        # Database connection
        # --------------------------
 
        connection = get_connection()
        cursor = connection.cursor()
 
        # --------------------------
        # Check existing user
        # --------------------------
 
        cursor.execute(
            """
            SELECT *
            FROM users
            WHERE email=?
            """,
            (email,)
        )
 
        existing = cursor.fetchone()
 
        if existing:
 
            connection.close()
 
            return jsonify({
                "message":
                    "Email already exists."
            }), 400
 
        # ==================================================
        # HASH PASSWORD
        # ==================================================
 
        hashed_password = generate_password_hash(
            password
        )
 
        # --------------------------
        # Insert user
        # --------------------------
 
        cursor.execute(
            """
            INSERT INTO users(
                name,
                email,
                password
            )
            VALUES(?,?,?)
            """,
            (
                name,
                email,
                hashed_password
            )
        )
 
        connection.commit()
        connection.close()
 
        return jsonify({
 
            "message":
                "Registration Successful"
 
        }), 201
 
    except Exception as e:
 
        print(
            "REGISTER ERROR:",
            e
        )
 
        return jsonify({
 
            "message":
                "Registration failed."
 
        }), 500
 
 
# ==================================================
# LOGIN
# ==================================================
 
@auth.route("/login", methods=["POST"])
def login():
 
    try:
 
        data = request.get_json()
 
        email = data.get("email")
        password = data.get("password")
 
        # --------------------------
        # Validate fields
        # --------------------------
 
        if not email or not password:
 
            return jsonify({
 
                "message":
                    "Please enter Email and Password."
 
            }), 400
 
        email = email.strip().lower()
 
        # --------------------------
        # Database connection
        # --------------------------
 
        connection = get_connection()
        cursor = connection.cursor()
 
        # --------------------------
        # Find user by email
        # --------------------------
 
        cursor.execute(
            """
            SELECT *
            FROM users
            WHERE email=?
            """,
            (email,)
        )
 
        user = cursor.fetchone()
 
        connection.close()
 
        # --------------------------
        # User doesn't exist
        # --------------------------
 
        if not user:
 
            return jsonify({
 
                "message":
                    "Invalid Email or Password"
 
            }), 401
 
        # ==================================================
        # VERIFY HASHED PASSWORD
        # ==================================================
 
        password_correct = check_password_hash(
            user["password"],
            password
        )
 
        if not password_correct:
 
            return jsonify({
 
                "message":
                    "Invalid Email or Password"
 
            }), 401
 
        # ==================================================
        # LOGIN SUCCESSFUL
        # ==================================================
 
        return jsonify({
 
            "id":
                user["id"],
 
            "name":
                user["name"],
 
            "email":
                user["email"],
 
            "role":
                user["role"],
 
            "token":
                create_token(user["id"])
 
        }), 200
 
    except Exception as e:
 
        print(
            "LOGIN ERROR:",
            e
        )
 
        return jsonify({
 
            "message":
                "Login failed."
 
        }), 500