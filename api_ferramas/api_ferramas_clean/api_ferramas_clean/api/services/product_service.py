from api.models.product import Product

class ProductService:
    def __init__(self, mysql):
        self.mysql = mysql

    

    def get_all_products(self):
        cursor = self.mysql.connection.cursor()
        cursor.execute("SELECT id, nombre, descripcion, imagen, precio, stock FROM product")
        results = cursor.fetchall()
        cursor.close()

        products = [
            Product(
                id=row[0],
                nombre=row[1],
                descripcion=row[2],
                imagen=row[3],
                precio=row[4],
                stock=row[5]
            ).to_dict()
            for row in results
        ]

        return products

from api.models.product import Product

class ProductService:
    def __init__(self, mysql):
        self.mysql = mysql

    

    def get_all_products(self):
        cursor = self.mysql.connection.cursor()
        cursor.execute("SELECT id, nombre, descripcion, imagen, precio, stock, id_categoria FROM product")
        results = cursor.fetchall()
        cursor.close()

        products = [
            Product(
                id=row[0],
                nombre=row[1],
                descripcion=row[2],
                imagen=row[3],
                precio=row[4],
                stock=row[5],
                id_categoria=row[6] 
            ).to_dict()
            for row in results
        ]

        return products

def get_products_by_category(self, categoria):
    cursor = self.mysql.connection.cursor(dictionary=True)
    query = """
        SELECT p.id, p.nombre, p.descripcion, p.imagen, p.precio, p.stock, c.nombre as categoria
        FROM product p
        JOIN categoria c ON p.categoria_id = c.id
        WHERE LOWER(c.nombre) = %s
    """
    cursor.execute(query, (categoria.lower(),))
    productos = cursor.fetchall()
    cursor.close()
    return productos


