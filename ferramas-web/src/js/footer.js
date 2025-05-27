// src/js/footer.js
document.addEventListener("DOMContentLoaded", () => {
    const footerHTML = `
      <footer class="bg-dark text-white text-center py-4 mt-5">
        <div class="container">
          <p class="mb-1">&copy; 2025 Ferremas. Todos los derechos reservados.</p>
        </div>
      </footer>
    `;
  
    const footerContainer = document.createElement("div");
    footerContainer.innerHTML = footerHTML;
    document.body.appendChild(footerContainer);
  });
  