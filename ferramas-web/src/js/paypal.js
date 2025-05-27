async function mostrarPaypalModal() {
    const paypalContainer = document.getElementById("paypal-button-container");
    paypalContainer.innerHTML = "";
  
    // Leer total del localStorage
    const totalCLP = parseFloat(localStorage.getItem("carritoTotal") || "0");
  
    // Convertir a USD
    const totalUSD = await window.monedaConfig.convertirCLPaUSD(totalCLP);
  
    // Renderizar el botón
    paypal.Buttons({
      createOrder: function (data, actions) {
        return actions.order.create({
          purchase_units: [{
            amount: {
              value: totalUSD // Ahora dinámico en USD
            }
          }]
        });
      },
      onApprove: function (data, actions) {
        return actions.order.capture().then(function (details) {
          alert("✅ Pago realizado por: " + details.payer.name.given_name);
  
          // Cerrar el modal
          const modal = bootstrap.Modal.getInstance(document.getElementById("paypalModal"));
          modal.hide();
        });
      },
      onError: function (err) {
        console.error("❌ Error con PayPal:", err);
        alert("Hubo un error al procesar el pago.");
      }
    }).render("#paypal-button-container");
  }
  