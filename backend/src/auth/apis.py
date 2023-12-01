from flask import Blueprint, jsonify, request
from flask_jwt_extended import create_access_token
from common.bcrypt import bcrypt
from auth.models import User
from db import db
from datetime import timedelta

auth_blueprint = Blueprint("auth", __name__)

@auth_blueprint.route("/register", methods=["POST"])
def register():
    data = request.get_json()

    username = data.get("username")
    password = data.get("password")

    if not username or not password:
        return jsonify({"error": "Incomplete registration data"}), 400

    # Check if the username is already taken
    existing_user = User.query.filter_by(username=username).first()
    if existing_user:
        return jsonify({"error": "Username sudah digunakan"}), 409

    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
    new_user = User(username=username, password=hashed_password)

    db.session.add(new_user)
    db.session.commit()

    return {
        'id': new_user.id,
        'username': new_user.username
    }

@auth_blueprint.route("/login", methods=["POST"])
def login():
    data = request.get_json()

    username = data["username"]
    password = data["password"]

    user = User.query.filter_by(username=username).first()
    if not user:
        return {"error": "Username atau password tidak tepat"}, 400

    valid_password = bcrypt.check_password_hash(user.password, password)
    if not valid_password:
        return {"error": "Username atau password tidak tepat"}, 400

    # Create an access token with a 24-hour expiration time
    access_token = create_access_token(identity=user.id, expires_delta=timedelta(days=1))

    return {
        'id': user.id,
        'username': user.username,
        'token': access_token
    }