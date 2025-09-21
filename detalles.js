const detallesContainer = document.getElementById('detalles-container');
const API_URL = 'https://dummyjson.com/products';

async function cargarDetallesProducto() {
  if (!detallesContainer) {
    console.error('El elemento con id="detalles-container" no se encontró en la página.');
    return;
  }
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get('id');
  if (!id) {
    detallesContainer.innerHTML = '<p>ID de producto no proporcionado. <a href="index.html">Volver</a></p>';
    return;
  }
  detallesContainer.innerHTML = '<p>Cargando producto...</p>';
  try {
    const response = await fetch(`${API_URL}/${encodeURIComponent(id)}`);
    if (!response.ok) {
      detallesContainer.innerHTML = `<p>Error ${response.status} al cargar el producto.</p>`;
      return;
    }
    const product = await response.json();
    detallesContainer.innerHTML = `
      <div class="detalle-card">
        <img src="${product.images?.[0] ?? product.thumbnail ?? ''}" alt="${product.title}" class="detalle-img">
        <div class="detalle-body">
          <h2>${product.title}</h2>
          <p class="detalle-cat">Categoría: ${product.category ?? ''}</p>
          <p class="detalle-price">Precio: $${Number(product.price).toFixed(2)}</p>
          <p class="detalle-desc">${product.description ?? ''}</p>
        </div>
      </div>
    `;
  } catch (error) {
    console.error('Error al cargar detalles:', error);
    detallesContainer.innerHTML = '<p>Error al cargar los detalles del producto. <button id="reintentar">Reintentar</button></p>';
    document.getElementById('reintentar')?.addEventListener('click', cargarDetallesProducto);
  }
}
document.addEventListener('DOMContentLoaded', cargarDetallesProducto);