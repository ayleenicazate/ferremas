from api.models.user import User
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class UserService:
    def __init__(self, mysql):
        self.mysql = mysql

    def get_all_users(self):
        cursor = self.mysql.connection.cursor()
        cursor.execute("SELECT id, rut, nombres, apellidos, correo, domicilio, password, rol, creado_en FROM usuario")
        results = cursor.fetchall()
        users = [User(*row).to_dict() for row in results]
        return users

    def get_user_by_email(self, email):
        cursor = self.mysql.connection.cursor()
        cursor.execute("SELECT * FROM usuario WHERE correo = %s", (email,))
        result = cursor.fetchone()
        return User(*result) if result else None

    def create_user(self, rut, nombres, apellidos, correo, domicilio, password, rol="cliente"):
        # Validar correo duplicado
        if self.get_user_by_email(correo):
            raise ValueError("El correo ya está registrado")

        hashed_password = pwd_context.hash(password)

        cursor = self.mysql.connection.cursor()
        cursor.execute("""
            INSERT INTO usuario (rut, nombres, apellidos, correo, domicilio, password, rol)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
        """, (rut, nombres, apellidos, correo, domicilio, hashed_password, rol))
        
        self.mysql.connection.commit()
        
        new_user_id = cursor.lastrowid
        cursor.execute("SELECT * FROM usuario WHERE id = %s", (new_user_id,))
        new_user = cursor.fetchone()

        return User(*new_user).to_dict()

    def authenticate_user(self, correo, password, rol):
        cursor = self.mysql.connection.cursor()
        query = "SELECT * FROM usuario WHERE correo = %s AND rol = %s"
        cursor.execute(query, (correo, rol))
        row = cursor.fetchone()
        cursor.close()

        if row:
            user = {
                "id": row[0],
                "rut": row[1],
                "nombres": row[2],
                "apellidos": row[3],
                "correo": row[4],
                "domicilio": row[5],
                "password": row[6],
                "rol": row[7],
                "creado_en": row[8]
            }

            if pwd_context.verify(password, user["password"]):
                return {
                    "id": user["id"],
                    "nombres": user["nombres"],
                    "apellidos": user["apellidos"],
                    "correo": user["correo"],
                    "rol": user["rol"]
                }

        return None

