class User:
    def __init__(self, id, rut, nombres, apellidos, correo, domicilio, password, rol, creado_en):
        self.id = id
        self.rut = rut
        self.nombres = nombres
        self.apellidos = apellidos
        self.correo = correo
        self.domicilio = domicilio
        self.password = password
        self.rol = rol
        self.creado_en = creado_en

    def to_dict(self):
        return {
            'id': self.id,
            'rut': self.rut,
            'nombres': self.nombres,
            'apellidos': self.apellidos,
            'correo': self.correo,
            'domicilio': self.domicilio,
            'rol': self.rol,
            'creado_en': self.creado_en
        }
