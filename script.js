let products = [];
let cart = [];
const loader = document.getElementById("loader");
const categoryFilter = document.getElementById("categoryFilter");
const searchInput = document.getElementById("search");
const priceSort = document.getElementById("priceSort");
const productList = document.getElementById("productList");
const cartList = document.getElementById("cartList");
const totalPrice = document.getElementById("totalPrice");

async function fetchProducts() {
    loader.style.display = "block";
    try {
        const res = await fetch('https://fakestoreapi.com/products');
        products = await res.json();
        loadCategories();
        renderProducts();
    } catch (error) {
        console.error("Ошибка!", error);
    } finally {
        loader.style.display = "none";
    }
}

function loadCategories() {
    const categories = [...new Set(products.map(p => p.category))];
    categories.forEach(category => {
        const option = document.createElement("option");
        option.value = category;
        option.textContent = category;
        categoryFilter.appendChild(option);
    });
}

function renderProducts() {
    const search = searchInput.value.toLowerCase();
    const filter = categoryFilter.value;
    const sort = priceSort.value;
    
    let filtered = products.filter(p => p.title.toLowerCase().includes(search));
    if (filter) filtered = filtered.filter(p => p.category === filter);
    if (sort === "asc") filtered.sort((a, b) => a.price - b.price);
    if (sort === "desc") filtered.sort((a, b) => b.price - a.price);
    
    productList.innerHTML = filtered.map(p => 
        `<div class="product-card">
            <img src="${p.image}" alt="${p.title}">
            <h3>${p.title}</h3>
            <p>Kategoriya: ${p.category}</p>
            <p><strong>$${p.price}</strong></p>
            <button onclick="addToCart('${p.id}')">Add to cart</button>
        </div>`
    ).join("");
}

function addToCart(productId) {
    const product = products.find(p => p.id == productId);
    const existingItem = cart.find(item => item.id === productId);
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({...product, quantity: 1});
    }
    renderCart();
}

function renderCart() {
    cartList.innerHTML = cart.map(item => 
        `<div class="cart-item">
            <p>${item.title} - $${item.price} x ${item.quantity}</p>
            <button onclick="removeFromCart('${item.id}')">Delete</button>
        </div>`
    ).join("");
    
    totalPrice.textContent = "$" + cart.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2);
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id != productId);
    renderCart();
}

searchInput.addEventListener("input", renderProducts);
categoryFilter.addEventListener("change", renderProducts);
priceSort.addEventListener("change", renderProducts);

fetchProducts();