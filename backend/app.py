from flask import Flask, request, jsonify, make_response
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from models import db, User
import bcrypt
from config import config
import json

app = Flask(__name__)
app.config.update(config)
db.init_app(app)
CORS(app, resources={r"/*": {"origins": "*"}})

@app.route('/signup', methods=['POST'])
def signup():
    try:
        data = request.get_json()
        if data is None:
            raise ValueError("Request body is not valid JSON.")

        username = data.get('username')
        email = data.get('email')
        password = data.get('password')

        if not username or not email or not password:
            return jsonify({"error": "All fields are required."}), 400

        if User.query.filter_by(email=email).first():
            return jsonify({"error": "User already exists."}), 400

        hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
        new_user = User(username=username, email=email, password=hashed_password.decode('utf-8'))
        db.session.add(new_user)
        db.session.commit()
        return jsonify({"message": "User registered successfully!"}), 200

    except ValueError as e:
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        app.logger.error(f"Error in signup: {e}")
        return jsonify({"error": "Something went wrong!"}), 500

@app.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')

        if not email or not password:
            return jsonify({"error": "Email and password are required."}), 400

        user = User.query.filter_by(email=email).first()
        if not user or not bcrypt.checkpw(password.encode('utf-8'), user.password.encode('utf-8')):
            return jsonify({"error": "Invalid credentials."}), 401

        response = make_response(jsonify({
            "message": "Login successful!",
            "user": {
                "username": user.username,
                "email": user.email
            }
        }))
        
        # Set a cookie with the user data
        response.set_cookie('user', value=json.dumps({
            "username": user.username,
            "email": user.email
        }), httponly=True, secure=True)

        return response

    except Exception as e:
        app.logger.error(f"Error in login: {e}")
        return jsonify({"error": "Something went wrong!"}), 500

if __name__ == '__main__':
    app.run(debug=True)
