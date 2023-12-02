from flask import Flask
from flask_cors import CORS
from flask_talisman import Talisman
from flask_jwt_extended import JWTManager
from firebase_functions import https_fn
from db import db, db_init
from common.bcrypt import bcrypt
from auth.apis import auth_blueprint
from todo.apis import todo_blueprint

app = Flask(__name__)
CORS(app)
Talisman(app)

app.config['SQLALCHEMY_DATABASE_URI'] = "postgresql://postgres:Halodatabase123!@db.cchsvdfztowpbpicvnrq.supabase.co:5432/postgres"
app.config['JWT_SECRET_KEY'] = "hoehoehoe123"

jwt = JWTManager(app)
db.init_app(app)
bcrypt.init_app(app)

@app.route('/')
def hello_world():
    return 'Week 22 Alyuza Satrio Prayogo Server'

@https_fn.on_request(max_instances=1)
def alyuzabe(req: https_fn.Request) -> https_fn.Response:
    with app.request_context(req.environ):
        return app.full_dispatch_request()

app.register_blueprint(auth_blueprint, url_prefix="/api/users")
app.register_blueprint(todo_blueprint, url_prefix="/api")

with app.app_context():
    db_init()