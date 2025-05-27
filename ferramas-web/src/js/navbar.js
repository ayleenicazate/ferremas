// src/js/navbar.js
document.addEventListener("DOMContentLoaded", () => {
  
  document.body.addEventListener("click", (e) => {
    if (e.target.matches("#open-login")) {
      e.preventDefault();
      
      const user = JSON.parse(localStorage.getItem("user"));
  
      if (!user) {
        const loginModal = new bootstrap.Modal(
          document.getElementById("loginModal")
        );
        loginModal.show();
      } else {
        // Si está logueado y quieres evitar que lo abra o mostrar un mensaje:
        console.log("Ya has iniciado sesión.");
      }
    }
  });
  
  const navbarHTML = `
      <nav class="navbar navbar-expand-lg navbar-light bg-light fixed-top">
        <div class="container-fluid">
          <a class="navbar-brand" href="index.html">
            <img src="assets/images/Ferre+.png" alt="Ferremas Banner" class="img-fluid" style="width: 100px; height: 100px; object-fit: contain;">
          </a>
  
          <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown">
            <span class="navbar-toggler-icon"></span>
          </button>
  
          <div class="collapse navbar-collapse" id="navbarNavDropdown">
            <ul class="navbar-nav me-auto">
              <li class="nav-item"><a class="nav-link categoria-boton" href="#" data-id-categoria="1">Herramientas Manuales</a></li>
              <li class="nav-item"><a class="nav-link categoria-boton" href="#" data-id-categoria="2">Herramientas Eléctricas</a></li>
              <li class="nav-item"><a class="nav-link categoria-boton" href="#" data-id-categoria="3">Materiales de Construcción</a></li>
              <li class="nav-item"><a class="nav-link categoria-boton" href="#" data-id-categoria="4">Equipos de Seguridad</a></li>
              <li class="nav-item"><a class="nav-link categoria-boton" href="#" data-id-categoria="19">Tornillos y Anclajes</a></li>
              <li class="nav-item"><a class="nav-link categoria-boton" href="#" data-id-categoria="17">Accesorios Varios</a></li>
              <li class="nav-item"><a class="nav-link categoria-boton" href="#" data-id-categoria="18">Equipos de Medición</a></li>
            </ul>

  
              <select id="selector-moneda" class="form-select form-select-sm w-auto ms-2">
                <option value="CLP">CLP</option>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
              </select>
            
            <ul class="navbar-nav">
              <li class="nav-item">
                <a class="nav-link position-relative" href="#" data-bs-toggle="offcanvas" data-bs-target="#offcanvasCarrito">
                  <i class="bi bi-cart-fill"></i>
                  <span id="contador-carrito" class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                    0
                  </span>
                </a>
              </li>


              


              <li class="nav-item dropdown" id="user-info-container">
                <a class="nav-link dropdown-toggle" href="#" id="user-info" role="button" data-bs-toggle="dropdown">
                  <i class="bi bi-person"></i>
                </a>
                <ul class="dropdown-menu dropdown-menu-end">
                  <li><span class="dropdown-item-text" id="user-name">Hola, Invitado</span></li>
                  <li><hr class="dropdown-divider"></li>
                  <li><a class="dropdown-item" href="#" id="logout">Cerrar sesión</a></li>
                </ul>
              </li>



            </ul>
          </div>
        </div>
      </nav>
    `;

  // Insertar navbar al inicio del body
  const container = document.createElement("div");
  container.innerHTML = navbarHTML;
  document.body.insertBefore(container, document.body.firstChild);

  actualizarContadorCarrito();

  // Función para actualizar la vista del usuario
  window.updateNavbarWithUser = (user) => {
    const container = document.getElementById("user-info-container");
    if (!container) return;

    if (user) {
      container.innerHTML = `
        <a class="nav-link dropdown-toggle" href="#" id="user-info" role="button" data-bs-toggle="dropdown">
          <i class="bi bi-person"></i>
        </a>
        <ul class="dropdown-menu dropdown-menu-end">
          <li><span class="dropdown-item-text" id="user-name">Hola, ${user.nombres}</span></li>
          <li><hr class="dropdown-divider"></li>
          <li><a class="dropdown-item logout-link" href="#">Cerrar sesión</a></li>
        </ul>
      `;
    } else {
      container.innerHTML = `
        <a class="nav-link" href="#" id="open-login">
          <i class="bi bi-person"></i>
        </a>
      `;
    }
  };

  if (typeof renderizarCarritoEnNavbar === "function") {
    renderizarCarritoEnNavbar();
  }

  // Mostrar usuario si está logueado
  const storedUser = JSON.parse(localStorage.getItem("user"));
  if (storedUser) {
    window.updateNavbarWithUser(storedUser);
  } else {
    window.updateNavbarWithUser(null);
  }

  // Evento general para logout/login
  document.body.addEventListener("click", (e) => {
    if (e.target.closest("#open-login")) {
      e.preventDefault();
      const user = JSON.parse(localStorage.getItem("user"));
    
      if (!user) {
        const loginModal = new bootstrap.Modal(document.getElementById("loginModal"));
        loginModal.show();
      } else {
        console.log("Ya estás logueado.");
      }
    }

    if (e.target.matches(".logout-link")) {
      e.preventDefault();
      const user = JSON.parse(localStorage.getItem("user"));
      if (user) {
        localStorage.removeItem(`carrito_${user.correo}`);
      }
    
      localStorage.removeItem("user");
      window.updateNavbarWithUser(null);
      location.reload(); // 👈 esto recarga la página
    

      // O recargar si prefieres limpiar la sesión completamente:
      // location.reload();
    }
  });

  function actualizarContadorCarrito() {
    const contador = document.getElementById("contador-carrito");
    const user = JSON.parse(localStorage.getItem("user"));
    let carrito = [];
  
    if (user) {
      carrito = JSON.parse(localStorage.getItem(`carrito_${user.correo}`)) || [];
    } else {
      carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    }
  
    contador.textContent = carrito.length;
  }

  
});
