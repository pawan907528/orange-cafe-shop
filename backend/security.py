import os
from functools import wraps

from flask import request, jsonify
from itsdangerous import URLSafeTimedSerializer, BadSignature, SignatureExpired

from database import get_connection

SECRET_KEY = os.environ.get("SECRET_KEY", "dev-only-change-me")
serializer = URLSafeTimedSerializer(SECRET_KEY)

TOKEN_MAX_AGE = 60 * 60 * 24 * 7  # 7 days


def create_token(user_id):
    return serializer.dumps({"uid": user_id})


def get_current_user():
    header = request.headers.get("Authorization", "")

    if not header.startswith("Bearer "):
        return None

    token = header[7:]

    try:
        data = serializer.loads(token, max_age=TOKEN_MAX_AGE)
    except (BadSignature, SignatureExpired):
        return None

    connection = get_connection()
    cursor = connection.cursor()
    cursor.execute(
        "SELECT id, name, email, role FROM users WHERE id=?",
        (data["uid"],)
    )
    user = cursor.fetchone()
    connection.close()

    return user


def admin_required(f):
    @wraps(f)
    def wrapper(*args, **kwargs):
        user = get_current_user()

        if not user:
            return jsonify({"message": "Login required."}), 401

        if user["role"] != "admin":
            return jsonify({"message": "Admin access only."}), 403

        return f(*args, **kwargs)

    return wrapper
