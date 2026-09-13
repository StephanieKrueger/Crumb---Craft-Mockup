// Database
const categories = [
  { id: 'all', name: 'All Breads', icon: '🍞' },
  { id: 'classic', name: 'Classics', icon: '🥖' },
  { id: 'seeded', name: 'Seeded', icon: '🌾' },
  { id: 'sweet', name: 'Sweet', icon: '🥐' },
  { id: 'specialty', name: 'Specialty', icon: '✨' }
];

const products = [
  { 
    id: 1, 
    name: 'Classic Country Loaf', 
    price: 8.50, 
    category: 'classic', 
    description: 'Our signature 24-hour fermented sourdough with a crackling crust.', 
    weight: '800g', 
    image: 'images/classic-country.jpg', // Swap emoji for image path
    color: 'from-amber-100 to-orange-50' 
  },
  { 
    id: 2, 
    name: 'Seeded Multigrain', 
    price: 10.00, 
    category: 'seeded', 
    description: 'Packed with sunflower, flax, and sesame seeds.', 
    weight: '750g', 
    image: 'images/seeded-multigrain.jpg', 
    color: 'from-yellow-100 to-amber-50' 
  },
  { 
    id: 3, 
    name: 'Olive & Rosemary', 
    price: 11.00, 
    category: 'specialty', 
    description: 'Kalamata olives and fresh rosemary folded into a tangy loaf.', 
    weight: '700g', 
    image: 'images/olive-rosemary.webp', 
    color: 'from-green-100 to-emerald-50' 
  },
  { 
    id: 4, 
    name: 'Cinnamon Raisin Swirl', 
    price: 9.50, 
    category: 'sweet', 
    description: 'Naturally leavened with plump raisins and cinnamon.', 
    weight: '700g', 
    image: 'images/cinnamon-raisin.webp', 
    color: 'from-rose-100 to-pink-50' 
  }
];
// App State
let cart = [];
let currentCategory = 'all';

// Render Categories
function renderCategories() {
  const container = document.getElementById('category-filters');
  container.innerHTML = categories.map(cat => `
    <button onclick="setCategory('${cat.id}')" class="px-6 py-3 rounded-2xl text-sm font-bold transition-all border-2 border-rose-100 ${
      currentCategory === cat.id 
        ? 'bg-rose-400 text-white shadow-lg shadow-rose-200 rotate-1' 
        : 'bg-white text-rose-500 hover:bg-rose-50'
    }">
      <span class="mr-2">${cat.icon}</span>${cat.name}
    </button>
  `).join('');
}

// Render Products
function renderProducts() {
  const container = document.getElementById('product-grid');
  const filtered = currentCategory === 'all' ? products : products.filter(p => p.category === currentCategory);
  
  container.innerHTML = filtered.map(product => `
    <div class="bg-white rounded-3xl shadow-sm border-2 border-rose-50 overflow-hidden hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
      <!-- Full-bleed image taking up the entire colored block -->
      <div class="h-52 bg-gradient-to-br ${product.color} relative overflow-hidden">
        <img src="${product.image}" alt="${product.name}" class="h-full w-full object-cover">
      </div>
      
      <div class="p-5 flex flex-col flex-grow justify-between">
        <div>
          <!-- Title and Price Layout -->
          <div class="mb-2 flex justify-between items-start">
            <h3 class="font-extrabold text-stone-700 text-base leading-snug pr-2">${product.name}</h3>
            <span class="text-rose-500 font-extrabold text-lg whitespace-nowrap">$${product.price.toFixed(2)}</span>
          </div>
          <p class="text-stone-400 text-xs mb-4 line-clamp-2">${product.description}</p>
        </div>

        <div class="flex items-center justify-between pt-2 border-t border-rose-50">
          <span class="text-[10px] text-stone-400 font-bold uppercase tracking-wider bg-stone-50 px-2.5 py-1 rounded-lg">${product.weight}</span>
          <button onclick="addToCart(${product.id})" class="text-sm font-bold px-5 py-2.5 rounded-2xl bg-rose-400 hover:bg-rose-500 text-white transition-all shadow-md">
            + Add
          </button>
        </div>
      </div>
    </div>
  `).join('');
}

// Cart Interactions
function addToCart(id) {
  const product = products.find(p => p.id === id);
  const existingItem = cart.find(item => item.id === id);
  
  if (existingItem) existingItem.quantity++;
  else cart.push({ ...product, quantity: 1 });
  
  updateCartUI();
  
  // Briefly open cart to show it was added
  if(document.getElementById('cart-drawer').classList.contains('opacity-0')) {
      toggleCart();
  }
}

function updateQuantity(id, delta) {
  const item = cart.find(i => i.id === id);
  if (item) {
    item.quantity = Math.max(1, item.quantity + delta);
    updateCartUI();
  }
}

function removeFromCart(id) {
  cart = cart.filter(item => item.id !== id);
  updateCartUI();
}

// Update Cart UI
function updateCartUI() {
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  // Header Badge
  const badge = document.getElementById('cart-count');
  badge.textContent = cartCount;
  badge.style.display = cartCount > 0 ? 'flex' : 'none';

  // Cart Drawer Contents
  const container = document.getElementById('cart-items');
  const footer = document.getElementById('cart-footer');
  
if (cart.length === 0) {
    container.innerHTML = `
      <div class="text-center py-16">
        <span class="text-6xl mb-4 block opacity-50">🥖</span>
        <p class="text-stone-400 font-medium">Your cart is empty...</p>
      </div>`;
    footer.classList.add('hidden');
  } else {
container.innerHTML = cart.map(item => `
      <div class="flex gap-4 bg-rose-50/50 p-4 rounded-2xl items-center">
        <!-- FIXED: Wrapped item.image in an <img> tag with object-cover -->
        <div class="w-14 h-14 bg-gradient-to-br ${item.color} rounded-xl flex items-center justify-center overflow-hidden flex-shrink-0 shadow-sm relative">
          <img src="${item.image}" alt="${item.name}" class="h-full w-full object-cover">
        </div>
        
        <div class="flex-1 min-w-0">
          <div class="flex justify-between items-start mb-1">
            <h4 class="font-bold text-stone-700 text-sm truncate pr-2">${item.name}</h4>
            <span class="font-extrabold text-rose-500 text-sm">$${(item.price * item.quantity).toFixed(2)}</span>
          </div>
          <p class="text-xs text-stone-400 mb-2">$${item.price.toFixed(2)} each</p>
          <div class="flex items-center gap-2">
            <button onclick="updateQuantity(${item.id}, -1)" class="w-7 h-7 rounded-full bg-white border border-rose-100 flex items-center justify-center text-rose-500 text-xs font-bold">-</button>
            <span class="font-bold text-stone-700 w-5 text-center text-sm">${item.quantity}</span>
            <button onclick="updateQuantity(${item.id}, 1)" class="w-7 h-7 rounded-full bg-white border border-rose-100 flex items-center justify-center text-rose-500 text-xs font-bold">+</button>
            <button onclick="removeFromCart(${item.id})" class="ml-auto text-stone-300 hover:text-rose-400 text-xs font-medium">remove</button>
          </div>
        </div>
      </div>
    `).join('');
    
    document.getElementById('cart-subtotal').textContent = `$${cartTotal.toFixed(2)}`;
    footer.classList.remove('hidden');
  }
}

// UI State Toggles
function toggleCart() {
  const drawer = document.getElementById('cart-drawer');
  const sidebar = document.getElementById('cart-sidebar');
  
  if (drawer.classList.contains('opacity-0')) {
    drawer.classList.remove('opacity-0', 'pointer-events-none');
    sidebar.classList.remove('translate-x-full');
  } else {
    drawer.classList.add('opacity-0', 'pointer-events-none');
    sidebar.classList.add('translate-x-full');
  }
}

function setCategory(id) {
  currentCategory = id;
  renderCategories();
  renderProducts();
}

// Simulated Checkout
function handleCheckout() {
  const btn = document.getElementById('checkout-btn');
  btn.innerHTML = 'Baking your order... 👩‍🍳';
  btn.classList.add('opacity-75', 'pointer-events-none');
  
  setTimeout(() => {
    document.getElementById('cart-items').innerHTML = `
      <div class="text-center py-10 flex flex-col justify-center items-center">
        <div class="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center text-4xl mb-6">✨</div>
        <h3 class="text-2xl font-extrabold text-rose-800 mb-2">Order Confirmed!</h3>
        <p class="text-stone-500 mb-8 text-sm">Your lovely loaves are being prepared.</p>
        <button onclick="toggleCart()" class="text-rose-500 font-bold underline decoration-2 underline-offset-4">Back to Bakery</button>
      </div>
    `;
    document.getElementById('cart-footer').classList.add('hidden');
    cart = [];
    
    // Reset Header Badge only
    const badge = document.getElementById('cart-count');
    badge.textContent = '0';
    badge.style.display = 'none';

    // Reset button state for next time
    btn.innerHTML = 'Place Pre-Order ♡';
    btn.classList.remove('opacity-75', 'pointer-events-none');
  }, 2000);
}

// Initialize
renderCategories();
renderProducts();
updateCartUI();

// Toggle Mobile Navigation Menu
function toggleMobileMenu() {
  const menu = document.getElementById('mobile-menu');
  menu.classList.toggle('hidden');
}