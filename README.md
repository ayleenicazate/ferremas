
# 🛠️ Ferremas Web

Proyecto académico de integración de plataformas orientado a la digitalización de una distribuidora de productos de ferretería y construcción en Chile. Este sistema permite visualizar productos, realizar compras en línea, gestionar pedidos, procesar pagos vía PayPal y administrar datos mediante una base de datos MySQL.

---

## 🚀 Tecnologías Utilizadas

- 🐍 Python 3.13
- 🧱 Flask 3.1 (backend)
- 💳 Uvicorn + FastAPI (para integración PayPal)
- 🐬 MySQL (usando XAMPP)
- 🧩 SQLAlchemy (ORM)
- 🖥️ HTML + JS (frontend)
- 🌐 API REST

---

## 📁 Estructura del Proyecto

```
ferremas/
├── api_ferramas_clean/
│   ├── api/
│   │   ├── db/
│   │   │   ├── database.py
│   │   │   └── paypal_api.py   👈 backend para pagos
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   └── app.py              👈 backend principal
│   └── ferremas_datos_iniciales.sql
├── ferramas-web/
│   ├── index.html
│   ├── carrito.html
│   ├── pago.html
│   ├── assets/images/
│   └── src/css | js/
```

---

## 🧾 Requisitos

- [x] Python 3.13 instalado
- [x] XAMPP con **Apache y MySQL** activados
- [x] Navegador para abrir los HTML
- [x] Instalar dependencias con `pip`

---

## ⚙️ Instalación

1. Clona el repositorio:
   ```bash
   git clone https://github.com/ayleenicazate/ferremas.git
   cd ferremas/api_ferramas_clean
   ```

2. Instala las dependencias necesarias:
   ```bash
   pip install -r requirements.txt
   ```

3. Crea el archivo `.env` con los datos de conexión (basado en `.env.example` si existe).

4. Importa la base de datos en XAMPP:

   - Abre **XAMPP Control Panel**
   - Inicia **MySQL**
   - Haz clic en **Admin** (phpMyAdmin)
   - Crea una base de datos llamada `ferremas_db`
   - Importa el archivo `ferremas_datos_iniciales.sql`

---

## 🧠 ¿Cómo ejecutar el proyecto?

### 🔵 1. Backend principal (Flask)

Este backend se encarga de exponer la API REST de usuarios y productos.

```bash
python api/app.py
```

Por defecto corre en: `http://127.0.0.1:5000`

---

### 🟢 2. Backend de pagos (FastAPI + PayPal)

Este backend se ejecuta con `uvicorn`:

```bash
uvicorn api.db.paypal_api:app --reload
```

Por defecto corre en: `http://127.0.0.1:8000`

---

### 🔵 3. Frontend

Abre los archivos HTML directamente desde el navegador:

- `index.html` → Página principal
- `carrito.html` → Carrito de compras
- `pago.html` → Proceso de pago

⚠️ Para pruebas completas, asegúrate de que ambos backends estén corriendo y que XAMPP esté activo.

---

## 🧪 Pruebas

- Puedes usar Postman para testear los endpoints desde `http://127.0.0.1:5000`.
- Para pagos, asegúrate de tener acceso a las credenciales de sandbox de PayPal.

---

## 🧑‍💻 Autores

Desarrollado como parte del ramo **ASY5131 - Integración de Plataformas** por estudiantes de Ingeniería en Informática de Duoc UC.

---

## 📄 Licencia

Proyecto académico - No se permite el uso comercial.
