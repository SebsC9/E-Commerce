const API_URL = 'https://dummyjson.com/products';

const productosContainer = document.getElementById('productos-container');
const carritoContainer = document.getElementById('carrito-container');
const total = document.getElementById('precio-total');
const vaciarCarritoBtn = document.getElementById('vaciar-carrito');
const finalizarCompraBtn = document.getElementById('finalizar-compra');

let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
let productos = [];

//Comprobar y cargar productos
fetch(API_URL)
    .then(response => response.json())
    .then(data => {
        if (data && data.products) {
            productos = data.products;
            productos.forEach(product => {
                const div = document.createElement('div');
                div.classList.add('producto');
                div.innerHTML = `
                    <h3>${product.title}</h3>
                    <img src="${product.thumbnail}" alt="${product.title}">
                    <p>Precio: $${product.price}</p>
                    <div class="opciones">
                    <button class="agregar-carrito-btn"  data-id="${product.id}">Agregar al carrito</button>
                    <a href="detalles.html?id=${product.id}" class="ver-detalles-btn">Ver detalles</a>
                    </div>
                `;
                productosContainer.appendChild(div);
            });
            mostrarCarrito();
        } else {
            console.error('No se encontraron productos');
        }
    })
    .catch(error => {
        console.error('Error al cargar los productos:', error);
    });

//Agregar productos al carrito

productosContainer.addEventListener('click', (e) => {
    if (e.target.classList.contains('agregar-carrito-btn')) {
        const productId = Number(e.target.getAttribute('data-id'));
        const product = productos.find(p => p.id === productId);
        if (product) {
            const item = carrito.find(item => item.id === productId);
            if (item) {
                item.cantidad++;
            } else {
                carrito.push({ id: productId, cantidad: 1 });
            }
            localStorage.setItem('carrito', JSON.stringify(carrito));
            mostrarCarrito();
        }
    }
});

//Mostrar carrito
function mostrarCarrito() {
    carritoContainer.innerHTML = '';
    let totalPrecio = 0;
    carrito.forEach(item => {
        const product = productos.find(p => p.id === item.id);
        const div = document.createElement('div');
        div.classList.add('carrito-item');
        if (product) {
            div.innerHTML = `
                <h4>${product.title}</h4>
                <p>Precio: $${product.price}</p>
                <p>Cantidad: ${item.cantidad}</p>
                <button class="eliminar-item-btn" data-id="${product.id}">Eliminar</button>
            `;
            totalPrecio += Number(product.price) * Number(item.cantidad);
        } else {
            div.innerHTML = `
                <h4>Producto (id: ${item.id})</h4>
                <p>Precio: cargando...</p>
                <p>Cantidad: ${item.cantidad}</p>
            `;
        }

carritoContainer.appendChild(div);
    });
    total.textContent = `Total: $${totalPrecio.toFixed(2)}`;
}

//Eliminar productos del carrito
carritoContainer.addEventListener('click', (e) => {
    if (e.target.classList.contains('eliminar-item-btn')) {
        const productId = Number(e.target.getAttribute('data-id'));
        carrito = carrito.filter(item => item.id !== productId);
        localStorage.setItem('carrito', JSON.stringify(carrito));
        mostrarCarrito();
    }
});

//Vaciar carrito
vaciarCarritoBtn.addEventListener('click', () => {
    carrito = [];
    localStorage.removeItem('carrito');
    mostrarCarrito();
});

//Finalizar compra
finalizarCompraBtn.addEventListener('click', () => {
    if (carrito.length === 0) {
        alert('El carrito está vacío');
        return;
    }
    alert('Compra finalizada. Gracias por su compra.');
    carrito = [];
    localStorage.removeItem('carrito');
    mostrarCarrito();
    finalizarCompraBtn.disabled = true;
});

//Toggle carrito en móvil
(function controlCarrito(){
  const aside = document.getElementById('Carrito');
  const abrirBtn = document.getElementById('carrito-btn') || document.getElementById('carrito-btn-toggle');
  const cerrarBtn = document.getElementById('cerrar-carrito');

  if (!aside || !abrirBtn) return;

  // función que abre el carrito
  function abrirCarrito() {
    aside.classList.add('abierto');
    document.body.classList.add('carrito-abierto');
    aside.setAttribute('aria-hidden','false');
    abrirBtn.setAttribute('aria-expanded','true');
    
    if (typeof mostrarCarrito === 'function') mostrarCarrito();
    setTimeout(() => {
      const primero = aside.querySelector('button, input, a');
      if (primero) primero.focus();
    }, 120);
  }

  function cerrarCarrito() {
    aside.classList.remove('abierto');
    document.body.classList.remove('carrito-abierto');
    aside.setAttribute('aria-hidden','true');
    abrirBtn.setAttribute('aria-expanded','false');
    // devolver foco al botón que abrió
    setTimeout(() => abrirBtn.focus(), 0);
  }

  abrirBtn.addEventListener('click', (e) => {
    e.preventDefault();
    aside.classList.contains('abierto') ? cerrarCarrito() : abrirCarrito();
  });

  if (cerrarBtn) cerrarBtn.addEventListener('click', cerrarCarrito);

  document.addEventListener('click', (e) => {
    if (!aside.classList.contains('abierto')) return;
    if (aside.contains(e.target) || abrirBtn.contains(e.target)) return;
    cerrarCarrito();
  });
})();