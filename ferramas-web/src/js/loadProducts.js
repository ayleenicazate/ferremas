let productos = [];
let productosMostrados = 0;
const productosPorPagina = 9;

const categoriasMapeadas = {
  "herramientas manuales": ["martillos", "llaves", "destornilladores"],
  "herramientas eléctricas": ["taladros", "sierras", "lijadoras"],
  "materiales de construcción": ["materiales construcción", "acabados"],
  "materiales básicos": ["cemento", "arena", "ladrillos", "pinturas", "barnices", "cerámico"],
  "equipos de seguridad": ["cascos", "guantes", "lentes de seguridad", "accesorios varios"],
  "tornillos y anclajes": ["tornillos", "anclajes"],
  "fijaciones y adhesivos": ["fijaciones", "adhesivos"],
  "equipos de medición": ["equipos de medición"]
};


function crearLoaderInline() {
  const loader = document.createElement("div");
  loader.id = "loader-inline";
  loader.className = "text-center my-4 w-100";
  loader.innerHTML = `
    <div class="spinner-border text-primary" role="status" style="width: 3rem; height: 3rem;">
      <span class="visually-hidden">Cargando más productos...</span>
    </div>
  `;
  return loader;
}

function normalizar(texto) {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}

function aplicarDescuentoSiUsuarioLogeado(productos) {
  const user = JSON.parse(localStorage.getItem("user"));
  const DESCUENTO = 0.1;

  if (!user) return productos;

  return productos.map((prod) => {
    const precioOriginal = prod.precio;
    const precioConDescuento = Math.round(precioOriginal * (1 - DESCUENTO));
    return { ...prod, precioOriginal, precioConDescuento };
  });
}

function renderProductos() {
  const container = document.getElementById("productos-container");
  const fin = productosMostrados + productosPorPagina;

  for (let i = productosMostrados; i < fin && i < productos.length; i++) {
    const producto = productos[i];
    const card = document.createElement("div");
    card.className = "col-md-4 mb-4";
    card.innerHTML = `
      <div class="card">
        <img src="${producto.imagen}" class="card-img-top img-ajustada" alt="${producto.nombre}">
        <div class="card-body">
          <h5 class="card-title">${producto.nombre}</h5>
          <p class="card-text">${producto.descripcion}</p>
          ${
            producto.precioConDescuento
              ? `<p class="fw-bold text-danger">
                   <del>${window.monedaConfig.formatearPrecio(producto.precioOriginal)}</del><br>
                   ${window.monedaConfig.formatearPrecio(producto.precioConDescuento)}
                 </p>`
              : `<p class="fw-bold">
                   ${window.monedaConfig.formatearPrecio(producto.precio)}
                 </p>`
          }
          <button class="btn btn-primary w-100" onclick='agregarAlCarrito(${JSON.stringify(producto)})'>Agregar al carro de compras</button>
        </div>
      </div>
    `;
    container.appendChild(card);
  }

  productosMostrados = fin;

  const btn = document.getElementById("ver-mas-btn");
  if (productosMostrados >= productos.length && btn) {
    btn.style.display = "none";
  }
}

function renderProductosFiltrados(filtro) {
  const container = document.getElementById("productos-container");
  container.innerHTML = "";

  const palabras = normalizar(filtro).split(/\s+/);

  const resultados = productos.filter((p) => {
    const nombre = normalizar(p.nombre || "");
    const descripcion = normalizar(p.descripcion || "");
    const categoria = normalizar(p.categoria || "");
    return palabras.some((palabra) =>
      nombre.includes(palabra) ||
      descripcion.includes(palabra) ||
      categoria.includes(palabra)
    );
  });

  if (resultados.length === 0) {
    const modal = new bootstrap.Modal(document.getElementById("modalNoResultados"));
    modal.show();
    return;
  }
  
  resultados.slice(0, productosPorPagina).forEach((producto) => {
    const card = document.createElement("div");
    card.className = "col-md-4 mb-4";
    card.innerHTML = `
      <div class="card">
        <img src="${producto.imagen}" class="card-img-top img-ajustada" alt="${producto.nombre}">
        <div class="card-body">
          <h5 class="card-title">${producto.nombre}</h5>
          <p class="card-text">${producto.descripcion}</p>
          ${
            producto.precioConDescuento
              ? `<p class="fw-bold text-danger">
                   <del>${window.monedaConfig.formatearPrecio(producto.precioOriginal)}</del><br>
                   ${window.monedaConfig.formatearPrecio(producto.precioConDescuento)}
                 </p>`
              : `<p class="fw-bold">
                   ${window.monedaConfig.formatearPrecio(producto.precio)}
                 </p>`
          }
          <button class="btn btn-primary w-100">Agregar al carro de compras</button>
        </div>
      </div>
    `;
    const botonAgregar = card.querySelector("button");
    botonAgregar.addEventListener("click", () => {
      agregarAlCarrito(producto);
    });
    container.appendChild(card);
  });

  const verMasBtn = document.getElementById("ver-mas-btn");
  if (verMasBtn) verMasBtn.style.display = "none";
}

document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("productos-container");
  const placeholder = document.getElementById("loader-placeholder");

  const user = JSON.parse(localStorage.getItem("user"));
  if (user) {
    const banner = document.getElementById("banner-descuento");
    if (banner) banner.innerText = "¡Tienes 10% de descuento aplicado!";
  }

  const loaderInicial = crearLoaderInline();
  placeholder.appendChild(loaderInicial);

  fetch("http://127.0.0.1:5000/products")
    .then((res) => res.json())
    .then((data) => {
      const productosConDescuento = aplicarDescuentoSiUsuarioLogeado(data);
      productos = productosConDescuento;

      const verMasBtn = document.getElementById("ver-mas-btn"); // 🔧 asegurado arriba
      const inputBusqueda = document.getElementById("input-busqueda");
      if (inputBusqueda) {
        inputBusqueda.addEventListener("input", (e) => {
          const valor = e.target.value.trim().toLowerCase();
          if (valor === "") {
            container.innerHTML = "";
            productosMostrados = 0;
            renderProductos();
            if (verMasBtn) verMasBtn.style.display = "block";
          } else {
            renderProductosFiltrados(valor);
          }
        });
      }

      setTimeout(async () => {
        placeholder.innerHTML = "";
        await window.monedaConfig.configurarSelectorMoneda(() => {
          container.innerHTML = "";
          productosMostrados = 0;
          renderProductos();
        });

        renderProductos();

        if (verMasBtn) {
          verMasBtn.addEventListener("click", () => {
            const inlineLoader = crearLoaderInline();
            placeholder.appendChild(inlineLoader);

            setTimeout(() => {
              placeholder.innerHTML = "";
              renderProductos();
            }, 300);
          });
        }

        document.querySelectorAll(".categoria-boton").forEach((btn) => {
          btn.addEventListener("click", (e) => {
            e.preventDefault();
            const idCategoria = parseInt(btn.getAttribute("data-id-categoria"));
            renderProductosPorIdCategoria(idCategoria);
          });
        });
        
      }, 300);
    })
    .catch((error) => {
      placeholder.innerHTML = "";
      console.error("Error al cargar productos:", error);
    });

    function renderProductosPorIdCategoria(idCategoria) {
      const container = document.getElementById("productos-container");
      container.innerHTML = "";
    
      const resultados = productos.filter(p => p.id_categoria === idCategoria);
    
      if (resultados.length === 0) {
        const modal = new bootstrap.Modal(document.getElementById("modalNoResultados"));
        modal.show();
        return;
      }
    
      resultados.forEach((producto) => {
        const card = document.createElement("div");
        card.className = "col-md-4 mb-4";
        card.innerHTML = `
          <div class="card">
            <img src="${producto.imagen}" class="card-img-top img-ajustada" alt="${producto.nombre}">
            <div class="card-body">
              <h5 class="card-title">${producto.nombre}</h5>
              <p class="card-text">${producto.descripcion}</p>
              ${
                producto.precioConDescuento
                  ? `<p class="fw-bold text-danger">
                       <del>${window.monedaConfig.formatearPrecio(producto.precioOriginal)}</del><br>
                       ${window.monedaConfig.formatearPrecio(producto.precioConDescuento)}
                     </p>`
                  : `<p class="fw-bold">${window.monedaConfig.formatearPrecio(producto.precio)}</p>`
              }
              <button class="btn btn-primary w-100">Agregar al carro de compras</button>
            </div>
          </div>
        `;
        const botonAgregar = card.querySelector("button");
        botonAgregar.addEventListener("click", () => agregarAlCarrito(producto));
        container.appendChild(card);
      });
    
      const verMasBtn = document.getElementById("ver-mas-btn");
      if (verMasBtn) verMasBtn.style.display = "none";
    }
    
    
    
});
