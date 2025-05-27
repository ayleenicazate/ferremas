class Product:
    def __init__(self, id, nombre, descripcion, imagen, precio, stock, id_categoria=None):
        self.id = id
        self.nombre = nombre
        self.descripcion = descripcion
        self.imagen = imagen
        self.precio = precio
        self.stock = stock
        self.id_categoria = id_categoria

    def to_dict(self):
        return {
            'id': self.id,
            'nombre': self.nombre,
            'descripcion': self.descripcion,
            'imagen': self.imagen,
            'precio': self.precio,
            'stock': self.stock,
            'id_categoria': self.id_categoria
        }
