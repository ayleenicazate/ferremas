from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
import requests
from requests.auth import HTTPBasicAuth

app = FastAPI()

# Permitir CORS si el frontend está en otro origen
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Tus credenciales de sandbox (no usar en producción)
CLIENT_ID = "AbUA3XTDkIjElKABNJsjvUQB77WiKsi7L8S4w-A_f1jpfSMVs0yacsjOKVWzbFZVh_GUH6eiSqnM-ZAW"
CLIENT_SECRET = "2EMQY3HuE3pGAyK2TkPpfmMASpNqbCdgnrAzGgh5dSZqwVjlpuTVK1TJXirLaQyo9jxnXLSLlS0MHuW9p"
PAYPAL_API = "https://api-m.sandbox.paypal.com"

@app.post("/validar-pago")
async def validar_pago(request: Request):
    data = await request.json()
    order_id = data.get("orderID")

    # Paso 1: Obtener token
    auth_response = requests.post(
        f"{PAYPAL_API}/v1/oauth2/token",
        auth=HTTPBasicAuth(CLIENT_ID, CLIENT_SECRET),
        data={"grant_type": "client_credentials"}
    )
    token = auth_response.json().get("access_token")

    # Paso 2: Consultar la orden
    headers = {"Authorization": f"Bearer {token}"}
    order_response = requests.get(f"{PAYPAL_API}/v2/checkout/orders/{order_id}", headers=headers)
    order_info = order_response.json()

    return {
        "status": order_info.get("status"),
        "payer": order_info.get("payer", {}),
        "purchase_units": order_info.get("purchase_units", []),
        "id": order_info.get("id")
    }
