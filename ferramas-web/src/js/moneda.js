let monedaSeleccionada = localStorage.getItem("monedaSeleccionada") || "CLP";
let tipoCambio = 1;

const urls = {
  URL: "https://mindicador.cl/api",
  USD: "/dolar",
  EUR: "/euro",
  CLP: null
};

async function obtenerTipoCambio(moneda) {
  if (moneda === "CLP") return 1;

  try {
    const response = await fetch(`${urls.URL}${urls[moneda]}`);
    const data = await response.json();
    return data.serie[0].valor;
  } catch (error) {
    console.error("Error al obtener tipo de cambio:", error);
    return 1;
  }
}

function formatearPrecio(precioCLP) {
  const convertido = precioCLP / tipoCambio;
  const simbolo = monedaSeleccionada === "USD" ? "US$" :
                  monedaSeleccionada === "EUR" ? "€" : "$";
  return `${simbolo}${convertido.toFixed(2).toLocaleString("es-CL")} ${monedaSeleccionada}`;
}

async function cambiarMoneda(nuevaMoneda, callbackRender) {
  monedaSeleccionada = nuevaMoneda;
  localStorage.setItem("monedaSeleccionada", nuevaMoneda);
  tipoCambio = await obtenerTipoCambio(nuevaMoneda);
  callbackRender?.(); // Vuelve a renderizar los productos si se especifica
}

async function configurarSelectorMoneda(callbackRender) {
  const selector = document.getElementById("selector-moneda");
  if (!selector) return;

  selector.value = monedaSeleccionada;
  
  selector.addEventListener("change", async (e) => {
    const loader = document.getElementById("moneda-loader");
    if (loader) loader.style.display = "flex";
  
    await cambiarMoneda(e.target.value, callbackRender);
  
    if (loader) loader.style.display = "none";
  });

  tipoCambio = await obtenerTipoCambio(monedaSeleccionada);
  callbackRender?.();
}

window.monedaConfig = {
  formatearPrecio,
  configurarSelectorMoneda,
  cambiarMoneda
};
async function convertirCLPaUSD(montoCLP) {
  try {
    const response = await fetch("https://mindicador.cl/api/dolar");
    const data = await response.json();
    const valorUSD = data.serie[0].valor;
    const montoUSD = montoCLP / valorUSD;
    return montoUSD.toFixed(2); // Redondeado a 2 decimales
  } catch (error) {
    console.error("Error al convertir CLP a USD:", error);
    return (montoCLP / 900).toFixed(2); // Valor por defecto estimado si falla
  }
}

window.monedaConfig = {
  ...window.monedaConfig,
  convertirCLPaUSD
};

