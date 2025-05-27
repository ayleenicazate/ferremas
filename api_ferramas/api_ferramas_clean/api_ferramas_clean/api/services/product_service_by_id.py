from api.models.product import Product

class ProductServiceById:
    def __init__(self, mysql):
        self.mysql = mysql

    def get_product_by_id(self, product_id):
        cursor = self.mysql.connection.cursor()
        cursor.execute("SELECT  id, nombre, descripcion, imagen, precio, stock FROM product WHERE id = %s", (product_id,))
        row = cursor.fetchone()
        cursor.close()
        
        if row:
            return Product(id=row[0], nombre=row[1], descripcion=row[2], imagen=row[3], precio=row[4], stock=row[5]).to_dict()
        else:
            return {"error": "Producto no encontrado"}
