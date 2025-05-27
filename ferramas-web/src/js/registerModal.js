document.addEventListener("DOMContentLoaded", () => {
  const registerModalHTML = `
    <div class="modal fade" id="registerModal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content shadow">
          <div class="modal-header">
            <h5 class="modal-title">Crear Cuenta</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <form id="register-form">
              <input type="text" class="form-control mb-3" id="register-rut" placeholder="RUT" required />
              <input type="text" class="form-control mb-3" id="register-first-name" placeholder="Nombres" required />
              <input type="text" class="form-control mb-3" id="register-last-name" placeholder="Apellidos" required />
              <input type="email" class="form-control mb-3" id="register-email" placeholder="Correo" required />
              <input type="text" class="form-control mb-3" id="register-address" placeholder="Domicilio" required />
              <input type="password" class="form-control mb-3" id="register-password" placeholder="Contraseña" required />
              <div class="d-grid">
                <button type="submit" class="btn btn-primary">Registrar</button>
              </div>
            </form>
            <div class="text-center mt-3">
              <small>¿Ya tienes una cuenta? <a href="#" id="back-to-login">Inicia sesión aquí</a></small>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML("beforeend", registerModalHTML);

  document.getElementById("register-form").addEventListener("submit", async function (e) {
    e.preventDefault();

    const rut = document.getElementById("register-rut");
    const firstName = document.getElementById("register-first-name");
    const lastName = document.getElementById("register-last-name");
    const email = document.getElementById("register-email");
    const address = document.getElementById("register-address");
    const password = document.getElementById("register-password");

    if (!rut || !firstName || !lastName || !email || !address || !password) {
      alert("Faltan campos en el formulario.");
      return;
    }

    const data = {
      rut: rut.value,
      nombres: firstName.value,
      apellidos: lastName.value,
      correo: email.value,
      domicilio: address.value,
      password: password.value,
    };

    try {
      const response = await fetch("http://127.0.0.1:5000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });

      const result = await response.json();

      if (response.ok) {
        alert(result.message);
        localStorage.setItem("user", JSON.stringify(result.user));
        if (typeof window.updateNavbarWithUser === "function") {
          window.updateNavbarWithUser(result.user);
        }
        bootstrap.Modal.getInstance(document.getElementById("registerModal")).hide();
        document.getElementById("register-form").reset();
      } else {
        alert(`Error: ${result.error}`);
      }
    } catch (error) {
      console.error("Error al registrar usuario:", error);
      alert("Error de conexión con el servidor.");
    }
  });


  document.body.addEventListener("click", function (e) {
    if (e.target.id === "back-to-login") {
      e.preventDefault();
      bootstrap.Modal.getInstance(document.getElementById("registerModal")).hide();
      const loginModal = new bootstrap.Modal(document.getElementById("loginModal"));
      loginModal.show();
    }
  });


  
});
