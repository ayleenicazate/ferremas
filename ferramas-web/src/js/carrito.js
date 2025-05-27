let user = JSON.parse(localStorage.getItem("user"));
let carritoKey = user ? `carrito_${user.correo}` : "carrito_temp";
let carrito = JSON.parse(localStorage.getItem(carritoKey)) || [];

function guardarCarrito() {
  localStorage.setItem(carritoKey, JSON.stringify(carrito));
}

function agregarAlCarrito(producto) {
  const existente = carrito.find((p) => p.id === producto.id);
  if (existente) {
    existente.cantidad += 1;
  } else {
    carrito.push({
      ...producto,
      cantidad: 1,
      moneda: localStorage.getItem("monedaSeleccionada") || "CLP",
      tipoCambio: window.tipoCambio || 1
    });
  }

  guardarCarrito();
  renderizarCarritoEnNavbar();
  renderizarCarrito?.();
  const carritoOffcanvas = document.getElementById("offcanvasCarrito");
  if (carritoOffcanvas) {
    setTimeout(() => {
      const instance = bootstrap.Offcanvas.getOrCreateInstance(carritoOffcanvas);
      instance.show();
    }, 50);
  }
  const icono = document.querySelector(".bi-cart");
  if (icono) {
    icono.classList.add("shake-cart");
    setTimeout(() => icono.classList.remove("shake-cart"), 500);
  }
}

function eliminarDelCarrito(id) {
  carrito = carrito.filter((p) => p.id !== id);
  guardarCarrito();
  renderizarCarrito();
}

function renderizarCarrito() {
  const contenedor = document.getElementById("productos-carrito");
  contenedor.innerHTML = "";

  let total = 0;

  carrito.forEach((p) => {
    const precioBase = p.precioConDescuento || p.precio;
    const subtotal = p.cantidad * precioBase;
    total += subtotal;

    const div = document.createElement("div");
    div.className = "producto";
    const precioConvertido = precioBase / (p.tipoCambio || 1);
    const simbolo = p.moneda === "USD" ? "US$" : p.moneda === "EUR" ? "€" : "$";

    div.innerHTML = `
      <div class="d-flex justify-content-between align-items-center">
        <div>
          <p><strong>${p.nombre}</strong></p>
          <p>Precio: ${simbolo}${precioConvertido.toFixed(2)}</p>
          <p>Cantidad: ${p.cantidad}</p>
        </div>
        <button class="btn btn-danger btn-sm" onclick="eliminarDelCarrito(${p.id})">
          <i class="bi bi-x-lg"></i>
        </button>
      </div>
      <hr>
    `;
    contenedor.appendChild(div);
  });

  const valorNeto = Math.round(total / 1.19);
  const iva = total - valorNeto;
  localStorage.setItem("totalCarrito", total);

  // Se toma la moneda del primer producto como referencia
  const refProducto = carrito[0];
  const simbolo = refProducto?.moneda === "USD" ? "US$" : refProducto?.moneda === "EUR" ? "€" : "$";
  const refTipoCambio = refProducto?.tipoCambio || 1;

  const resumen = document.querySelector("aside");
  resumen.innerHTML = `
    <h2>Resumen</h2>
    <p>Valor Neto: ${simbolo}${(valorNeto / refTipoCambio).toFixed(2)}</p>
    <p>IVA (19%): ${simbolo}${(iva / refTipoCambio).toFixed(2)}</p>
    <p><strong>Total: ${simbolo}${(total / refTipoCambio).toFixed(2)}</strong></p>
    <div class="d-grid gap-2">
      <button class="btn btn-primary" onclick="window.location.href='index.html'">Seguir Comprando</button>
      <button class="btn btn-success" onclick="window.location.href='pago.html'">Iniciar Pago</button>
    </div>
  `;
}

function renderizarCarritoEnNavbar() {
  const contenedor = document.getElementById("offcanvas-body-carrito");
  const ahorroTexto = document.getElementById("ahorroTexto");
  const totalTexto = document.getElementById("totalTexto");
  const contador = document.getElementById("contador-carrito");

  if (!contenedor) return;
  contenedor.innerHTML = "";

  if (carrito.length === 0) {
    contenedor.innerHTML = "<p class='text-muted'>Tu carrito está vacío.</p>";
    ahorroTexto.innerText = "";
    totalTexto.innerText = "";
    if (contador) contador.innerText = "0";
    return;
  }

  let total = 0;
  let ahorro = 0;
  let totalItems = 0;

  carrito.forEach((p) => {
    const precioBase = p.precio;
    const precioFinal = p.precioConDescuento || precioBase;
    const subtotal = p.cantidad * precioFinal;
    total += subtotal;
    ahorro += (precioBase - precioFinal) * p.cantidad;
    totalItems += p.cantidad;

    const simbolo = p.moneda === "USD" ? "US$" : p.moneda === "EUR" ? "€" : "$";
    const precioMostrado = (precioFinal / (p.tipoCambio || 1)).toFixed(2);
    const subtotalMostrado = (subtotal / (p.tipoCambio || 1)).toFixed(2);

    const item = document.createElement("div");
    item.className = "mb-3 border-bottom pb-2";
    item.innerHTML = `
      <div class="d-flex align-items-start">
        <img src="${p.imagen}" alt="${p.nombre}" 
             style="width: 70px; height: 70px; object-fit: cover; border-radius: 6px; margin-right: 10px; border: 1px solid #ccc;">
        <div class="flex-grow-1">
          <strong>${p.nombre}</strong>
          <p>Precio: ${simbolo}${precioMostrado}</p>
          <p class="mb-1">Subtotal: ${simbolo}${subtotalMostrado}</p>
          <div class="btn-group btn-group-sm" role="group">
            <button class="btn btn-outline-secondary" onclick="cambiarCantidad(${p.id}, -1)">-</button>
            <button class="btn btn-light" disabled>${p.cantidad}</button>
            <button class="btn btn-outline-secondary" onclick="cambiarCantidad(${p.id}, 1)">+</button>
          </div>
          <br><a href="#" class="text-danger small" onclick="eliminarDelCarrito(${p.id})">Quitar</a>
        </div>
      </div>
    `;
    contenedor.appendChild(item);
  });

  const refProducto = carrito[0];
  const simbolo = refProducto?.moneda === "USD" ? "US$" : refProducto?.moneda === "EUR" ? "€" : "$";
  const refTipoCambio = refProducto?.tipoCambio || 1;

  ahorroTexto.innerText = ahorro > 0 ? `¡Has ahorrado ${simbolo}${(ahorro / refTipoCambio).toFixed(2)}!` : "";
  totalTexto.innerText = `Total: ${simbolo}${(total / refTipoCambio).toFixed(2)}`;
  if (contador) contador.innerText = totalItems;
}

function cambiarCantidad(id, delta) {
  const producto = carrito.find((p) => p.id === id);
  if (!producto) return;

  producto.cantidad += delta;
  if (producto.cantidad <= 0) {
    carrito = carrito.filter((p) => p.id !== id);
  }
  guardarCarrito();
  renderizarCarritoEnNavbar();
}

document.addEventListener("DOMContentLoaded", () => {
  renderizarCarritoEnNavbar();
  if (typeof renderizarCarrito === "function") {
    renderizarCarrito();
  }
});
