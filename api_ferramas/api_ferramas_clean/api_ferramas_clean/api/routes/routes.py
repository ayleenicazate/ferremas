from flask import Blueprint, jsonify, request
from api.services.user_service import UserService
from api.services.product_service import ProductService
from api.services.product_service_by_id import ProductServiceById

def register_routes(app, mysql):
    api_bp = Blueprint('api', __name__)

    user_service = UserService(mysql)
    product_service = ProductService(mysql)
    product_service_by_id = ProductServiceById(mysql)

    @api_bp.route('/users', methods=['GET'])
    def get_users():
        return jsonify(user_service.get_all_users())

    @api_bp.route('/products', methods=['GET'])
    def get_products():
        return jsonify(product_service.get_all_products())

    @api_bp.route('/products_by_id/<int:product_id>', methods=['GET'])
    def get_products_by_id(product_id):
        return jsonify(product_service_by_id.get_product_by_id(product_id))

    @api_bp.route('/register', methods=['POST'])
    def register_user():
        data = request.json

        required_fields = ['rut', 'nombres', 'apellidos', 'correo', 'domicilio', 'password']
        missing_fields = [field for field in required_fields if field not in data]

        if missing_fields:
            return jsonify({"error": f"Faltan campos obligatorios: {', '.join(missing_fields)}"}), 400

        try:
            new_user = user_service.create_user(
                rut=data['rut'],
                nombres=data['nombres'],
                apellidos=data['apellidos'],
                correo=data['correo'],
                domicilio=data['domicilio'],
                password=data['password'],
            )
            return jsonify({
                "message": "Usuario creado exitosamente",
                "user": new_user
            }), 201
        except ValueError as e:
            return jsonify({"error": str(e)}), 400
        except Exception as e:
            return jsonify({"error": f"Error interno del servidor: {str(e)}"}), 500

    @api_bp.route('/login', methods=['POST'])
    def login_user():
        data = request.json
        correo = data.get("correo")
        password = data.get("password")
        rol = data.get("rol", "cliente")

        if not correo or not password or not rol:
            return jsonify({"error": "Faltan datos para iniciar sesión"}), 400

        try:
            user = user_service.authenticate_user(correo, password, rol)
            if user:
                return jsonify({
                    "message": "Inicio de sesión exitoso",
                    "user": user
                }), 200
            else:
                return jsonify({"error": "Credenciales inválidas"}), 401
        except Exception as e:
            return jsonify({"error": f"Error interno: {str(e)}"}), 500

    @api_bp.route('/products/category/<categoria>', methods=['GET'])
    def get_products_by_category(categoria):
        return jsonify(product_service.get_products_by_category(categoria))


    # 👇 este sí debe ir dentro de register_routes
    app.register_blueprint(api_bp)
