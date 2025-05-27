// loginModal.js

// Modal HTML
const loginModalHTML = `
  <div class="modal fade" id="loginModal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content shadow">
        <div class="modal-header">
          <h5 class="modal-title"><b>Bienvenido a FerreMas</b></h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
        </div>
        <div class="modal-body">
          <form id="login-form">
            <div class="mb-3">
              <label class="form-label fw-bold" for="email">Correo Electrónico</label>
              <input type="email" class="form-control" id="email" placeholder="Ingrese su correo" required>
            </div>
            <div class="mb-3">
              <label class="form-label fw-bold" for="password">Contraseña</label>
              <input type="password" class="form-control" id="password" placeholder="Ingrese su contraseña" required>
            </div>
            <div class="form-check mb-3">
              <input type="checkbox" class="form-check-input" id="newsletter">
              <label class="form-check-label fw-bold" for="newsletter">
                Deseo recibir noticias y descuentos.
              </label>
            </div>
            <div class="d-grid mb-3">
              <button type="submit" class="btn btn-primary">Iniciar Sesión</button>
            </div>
          </form>
          <div class="d-grid mb-3">
            <button class="btn btn-danger" id="google-login">
              <i class="bi bi-google"></i> Iniciar sesión con Google
            </button>
          </div>
          <div class="text-center">
            <small>¿No tienes una cuenta? <a href="#" id="show-register">Regístrate aquí</a></small>
          </div>
        </div>
      </div>
    </div>
  </div>
`;


document.body.addEventListener("click", function (e) {
  if (e.target.id === "show-register") {
    e.preventDefault();
    bootstrap.Modal.getInstance(document.getElementById("loginModal")).hide();
    const registerModal = new bootstrap.Modal(document.getElementById("registerModal"));
    registerModal.show();
  }
});


// Agregar modal al body
document.addEventListener("DOMContentLoaded", () => {
  document.body.insertAdjacentHTML('beforeend', loginModalHTML);

  const openLogin = document.getElementById("open-login");
  if (openLogin) {
    openLogin.addEventListener("click", function (e) {
      e.preventDefault();
      const loginModal = new bootstrap.Modal(document.getElementById('loginModal'));
      loginModal.show();
    });
  }

  const loginForm = document.getElementById("login-form");

  loginForm.addEventListener("submit", async function (e) {
    e.preventDefault();
  
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
  
    if (!emailInput || !passwordInput) {
      alert("Faltan campos obligatorios.");
      return;
    }
  
    const data = {
      correo: emailInput.value,
      password: passwordInput.value,
      rol: "cliente"  // Asigna un rol fijo ya que no lo pides en el formulario
    };
  
    try {
      const response = await fetch("http://127.0.0.1:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
  
      const result = await response.json();
  
      if (response.ok) {
        alert(result.message);
  
        localStorage.setItem("user", JSON.stringify(result.user));
        location.reload();
        if (typeof window.updateNavbarWithUser === "function") {
          window.updateNavbarWithUser(result.user);
        }
  
        bootstrap.Modal.getInstance(document.getElementById("loginModal")).hide();
        loginForm.reset();
      } else {
        alert(`Error: ${result.error}`);
      }
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      alert("Error de conexión con el servidor.");
    }
  });
  


});
