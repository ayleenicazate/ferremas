from flask import Flask
from api.routes.routes import register_routes
from api.db.database import init_db
from flask_cors import CORS

app = Flask(__name__)

CORS(app, origins=["http://127.0.0.1:5500"])

# Configuración MySQL
app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = ''
app.config['MYSQL_DB'] = 'ferremas_db'

# Inicializar MySQL
mysql = init_db(app)

# Registrar rutas
register_routes(app, mysql)

if __name__ == '__main__':
    app.run(debug=True)
