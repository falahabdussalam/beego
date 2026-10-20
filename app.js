/**
 * ============================================================================
 * BEEGO + | METROPOLITAN WHITE-GLOVE ON-DEMAND PLATFORM
 * Client-Side Application Logic, WhatsApp Bag & Concierge Dispatch
 * ============================================================================
 */

// Global Dispatch Configuration
const DISPATCH_CONFIG = {
  conciergePhone: '919845123456', // BeeGo WhatsApp Concierge Hotline
  defaultAddress: 'Flat 402, Prestige Palms, Indiranagar 100ft Rd, Bengaluru - 560038',
  defaultETA: '15 mins',
  currency: '₹'
};

// Complete Product Registry (Matched with HTML & Reference Mockup)
const PRODUCT_CATALOG = {
  'gf_1': {
    id: 'gf_1',
    name: 'Truffle Wild Mushroom Risotto',
    shortName: 'Truffle Risotto',
    price: 680,
    category: 'Gourmet Food',
    icon: '🍽️',
    prepTime: '18–22 mins prep'
  },
  'gf_2': {
    id: 'gf_2',
    name: 'Wagyu Smash Burger',
    shortName: 'Wagyu Smash Burger',
    price: 520,
    category: 'Gourmet Food',
    icon: '🍔',
    prepTime: '15–18 mins prep'
  },
  'gf_3': {
    id: 'gf_3',
    name: 'Woodfired Burrata Pizza',
    shortName: 'Woodfired Burrata Pizza',
    price: 650,
    category: 'Gourmet Food',
    icon: '🍕',
    prepTime: '16–20 mins prep'
  },
  'gr_1': {
    id: 'gr_1',
    name: 'Organic Hass Avocados',
    shortName: 'Organic Avocados',
    price: 240,
    category: 'Fresh Grocery',
    icon: '🥑',
    prepTime: 'Ready-to-eat'
  },
  'gr_2': {
    id: 'gr_2',
    name: 'A2 Whole Farm Milk',
    shortName: 'A2 Whole Farm Milk',
    price: 110,
    category: 'Fresh Grocery',
    icon: '🥛',
    prepTime: 'Cold-Chain < 3°C'
  },
  'gr_3': {
    id: 'gr_3',
    name: 'Sourdough Artisan Loaf',
    shortName: 'Sourdough Artisan Loaf',
    price: 180,
    category: 'Fresh Grocery',
    icon: '🍞',
    prepTime: 'Baked 6:00 AM'
  },
  'ds_1': {
    id: 'ds_1',
    name: 'Pistachio Raspberry Tart',
    shortName: 'Pistachio Raspberry Tart',
    price: 320,
    category: 'Desserts',
    icon: '🧁',
    prepTime: 'Chilled Dispatch'
  },
  'ds_2': {
    id: 'ds_2',
    name: 'Dark Chocolate Lava Soufflé',
    shortName: 'Dark Chocolate Soufflé',
    price: 350,
    category: 'Desserts',
    icon: '🍫',
    prepTime: 'Thermal Pouch'
  },
  'ds_3': {
    id: 'ds_3',
    name: 'Matcha Mille Crepe',
    shortName: 'Matcha Mille Crepe',
    price: 380,
    category: 'Desserts',
    icon: '🍵',
    prepTime: '20 Layers Chilled'
  },
  'bv_1': {
    id: 'bv_1',
    name: 'Immunity Citrus Juice',
    shortName: 'Immunity Citrus Juice',
    price: 180,
    category: 'Beverages',
    icon: '🍊',
    prepTime: 'Raw Cold-Pressed'
  },
  'bv_2': {
    id: 'bv_2',
    name: 'Nitro Cold Brew Can',
    shortName: 'Nitro Cold Brew Can',
    price: 220,
    category: 'Beverages',
    icon: '☕',
    prepTime: 'Zero Fluid Bitterness'
  },
  'bv_3': {
    id: 'bv_3',
    name: 'Sparkling Botanical Tonic',
    shortName: 'Sparkling Botanical Tonic',
    price: 150,
    category: 'Beverages',
    icon: '🍾',
    prepTime: 'Low Calorie'
  },
  'ph_1': {
    id: 'ph_1',
    name: 'Paracetamol 500mg',
    shortName: 'Paracetamol 500mg',
    price: 45,
    category: 'Pharmacy',
    icon: '💊',
    prepTime: '20 Fast Caplets'
  },
  'ph_2': {
    id: 'ph_2',
    name: 'Vitamin C 1000mg + Zinc',
    shortName: 'Vitamin C 1000mg + Zinc',
    price: 95,
    category: 'Pharmacy',
    icon: '🍋',
    prepTime: '20 Tabs'
  },
  'ph_3': {
    id: 'ph_3',
    name: 'First-Aid Sterile Kit',
    shortName: 'First-Aid Sterile Kit',
    price: 499,
    category: 'Pharmacy',
    icon: '🩹',
    prepTime: '32 Pieces'
  }
};

// Initial State (Cart initialized with the 3 items shown in mockup)
let cartState = {
  items: {
    'gf_1': 1, // Truffle Risotto x 1 (₹680)
    'gr_1': 2, // Organic Avocados x 2 (₹480)
    'bv_1': 1  // Immunity Citrus Juice x 1 (₹180)
  },
  deliveryAddress: DISPATCH_CONFIG.defaultAddress,
  deliveryETA: DISPATCH_CONFIG.defaultETA
};

// Load saved address/state if stored
try {
  const savedAddress = localStorage.getItem('beego_delivery_address');
  if (savedAddress) cartState.deliveryAddress = savedAddress;
  const savedETA = localStorage.getItem('beego_delivery_eta');
  if (savedETA) cartState.deliveryETA = savedETA;
} catch (e) {
  console.warn('LocalStorage unavailable', e);
}

/**
 * Add or Increment item in bag
 */
function addItemToBag(productId) {
  const product = PRODUCT_CATALOG[productId];
  if (!product) return;

  if (cartState.items[productId]) {
    cartState.items[productId] += 1;
  } else {
    cartState.items[productId] = 1;
  }

  renderWhatsAppBag();
  showToast(`Added 1x ${product.shortName} to WhatsApp Bag`);
}

/**
 * Decrement item in bag
 */
function decrementItem(productId) {
  if (!cartState.items[productId]) return;

  cartState.items[productId] -= 1;
  if (cartState.items[productId] <= 0) {
    delete cartState.items[productId];
  }

  renderWhatsAppBag();
}

/**
 * Remove item completely
 */
function removeItem(productId) {
  if (cartState.items[productId]) {
    delete cartState.items[productId];
    renderWhatsAppBag();
  }
}

/**
 * Quick Send Single Item directly to WhatsApp
 */
function quickSendItem(productId) {
  const product = PRODUCT_CATALOG[productId];
  if (!product) return;

  const msg = `👋 Hi BeeGo Team! I would like to order:
• 1x ${product.name} (₹${product.price.toFixed(2)})

📍 Delivery Address: ${cartState.deliveryAddress}
Payment: UPI / WhatsApp Pay / COD`;

  const url = `https://wa.me/${DISPATCH_CONFIG.conciergePhone}?text=${encodeURIComponent(msg)}`;
  window.open(url, '_blank');
}

/**
 * Broadcast Complete Cart Order to WhatsApp
 */
function broadcastOrderToWhatsApp() {
  const itemKeys = Object.keys(cartState.items);
  if (itemKeys.length === 0) {
    showToast('Your WhatsApp Bag is empty. Add items first!');
    return;
  }

  const messageText = generateWhatsAppMessageText();
  const url = `https://wa.me/${DISPATCH_CONFIG.conciergePhone}?text=${encodeURIComponent(messageText)}`;
  window.open(url, '_blank');
}

/**
 * Generate formatted WhatsApp message text
 */
function generateWhatsAppMessageText() {
  const itemKeys = Object.keys(cartState.items);
  if (itemKeys.length === 0) {
    return '👋 Hi BeeGo Team! My bag is currently empty. Please share today’s chef specials!';
  }

  let lines = [];
  lines.push('👋 Hi BeeGo Team! I would like to place an order:');

  let subtotal = 0;
  itemKeys.forEach(id => {
    const prod = PRODUCT_CATALOG[id];
    if (!prod) return;
    const qty = cartState.items[id];
    const itemTotal = prod.price * qty;
    subtotal += itemTotal;
    lines.push(`• ${qty}x ${prod.shortName} (₹${itemTotal.toFixed(2)})`);
  });

  lines.push('');
  lines.push(`Subtotal: ₹${subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })} | Delivery: Free`);
  lines.push(`Total: ₹${subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`);
  lines.push(`📍 Delivery Address: ${cartState.deliveryAddress}`);
  lines.push('Payment: UPI (GPay / PhonePe / Paytm) / WhatsApp Pay / COD');

  return lines.join('\n');
}

/**
 * Render the WhatsApp Bag in the right sidebar
 */
function renderWhatsAppBag() {
  const listContainer = document.getElementById('bag-items-list');
  const countBadge = document.getElementById('sidebar-bag-count');
  const heroQtyBadge = document.getElementById('hero-bag-qty');
  const headerCartBadge = document.getElementById('header-cart-count');
  const previewTextElem = document.getElementById('wa-preview-text');
  const previewTimeElem = document.getElementById('wa-preview-time');

  const itemKeys = Object.keys(cartState.items);
  let totalCount = 0;
  let subtotal = 0;

  itemKeys.forEach(id => {
    totalCount += cartState.items[id];
  });

  // Update badges
  if (countBadge) countBadge.textContent = `${totalCount} item${totalCount === 1 ? '' : 's'}`;
  if (heroQtyBadge) heroQtyBadge.textContent = totalCount;
  if (headerCartBadge) {
    if (totalCount > 0) {
      headerCartBadge.textContent = totalCount;
      headerCartBadge.style.display = 'inline-block';
    } else {
      headerCartBadge.style.display = 'none';
    }
  }

  // Render items
  if (listContainer) {
    if (itemKeys.length === 0) {
      listContainer.innerHTML = `
        <div class="empty-bag-state">
          <p>🛍️ Your bag is empty.</p>
          <span style="font-size: 0.74rem; color: #94A3B8;">Click "+ Add" on any gourmet item to begin.</span>
        </div>
      `;
    } else {
      let html = '';
      itemKeys.forEach(id => {
        const prod = PRODUCT_CATALOG[id];
        if (!prod) return;
        const qty = cartState.items[id];
        const itemTotal = prod.price * qty;
        subtotal += itemTotal;

        html += `
          <div class="bag-item-row" data-id="${id}">
            <div class="bag-item-left">
              <div class="bag-item-icon-wrap">${prod.icon || '📦'}</div>
              <div class="bag-item-details">
                <span class="bag-item-name" title="${prod.name}">${prod.shortName}</span>
                <span class="bag-item-unit-price">₹${prod.price.toFixed(2)} each</span>
              </div>
            </div>
            <div class="bag-qty-stepper">
              <button type="button" class="qty-step-btn" onclick="decrementItem('${id}')" title="Decrease quantity">−</button>
              <span class="qty-count-val">${qty}</span>
              <button type="button" class="qty-step-btn" onclick="addItemToBag('${id}')" title="Increase quantity">+</button>
            </div>
            <div class="bag-item-total-price">₹${itemTotal.toFixed(2)}</div>
          </div>
        `;
      });
      listContainer.innerHTML = html;
    }
  }

  // Update WhatsApp Message Preview
  if (previewTextElem) {
    previewTextElem.textContent = generateWhatsAppMessageText();
  }

  // Update timestamp in WhatsApp bubble
  if (previewTimeElem) {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    previewTimeElem.textContent = `${hours}:${minutes}`;
  }
}

/**
 * Toast Notifications
 */
function showToast(message) {
  const stack = document.getElementById('toast-stack');
  if (!stack) return;

  const toast = document.createElement('div');
  toast.className = 'toast-item';
  toast.innerHTML = `
    <span style="color: #22C55E;">✓</span>
    <span>${message}</span>
  `;
  stack.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.25s ease';
    setTimeout(() => toast.remove(), 250);
  }, 2200);
}

/**
 * Category Navigation Filter
 */
function setupCategoryFilters() {
  const pills = document.querySelectorAll('.cat-pill');
  pills.forEach(pill => {
    pill.addEventListener('click', () => {
      pills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');

      const targetCat = pill.getAttribute('data-category');
      if (targetCat === 'all') {
        const firstSec = document.getElementById('sec-gourmet-food');
        if (firstSec) firstSec.scrollIntoView({ behavior: 'smooth' });
      } else {
        const targetSec = document.getElementById(`sec-${targetCat}`);
        if (targetSec) targetSec.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
}

/**
 * Global Product Search
 */
function setupGlobalSearch() {
  const searchInput = document.getElementById('global-search-input');
  if (!searchInput) return;

  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase().trim();
    const cards = document.querySelectorAll('.product-card');

    cards.forEach(card => {
      const name = (card.getAttribute('data-name') || '').toLowerCase();
      const cat = (card.getAttribute('data-cat') || '').toLowerCase();
      const desc = (card.querySelector('.card-description')?.textContent || '').toLowerCase();

      if (!query || name.includes(query) || cat.includes(query) || desc.includes(query)) {
        card.style.display = 'flex';
      } else {
        card.style.display = 'none';
      }
    });
  });

  // Keyboard shortcut: Cmd+K / Ctrl+K
  document.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      searchInput.focus();
    }
  });
}

/**
 * Location Picker Modal
 */
function openLocationModal() {
  const modal = document.getElementById('location-modal');
  if (modal) modal.classList.add('active');
}

function closeLocationModal() {
  const modal = document.getElementById('location-modal');
  if (modal) modal.classList.remove('active');
}

function setPresetLocation(address, eta) {
  const input = document.getElementById('modal-address-input');
  if (input) input.value = address;

  const chips = document.querySelectorAll('.preset-chip');
  chips.forEach(chip => {
    if (chip.textContent.includes(address.split(',')[0])) {
      chip.classList.add('active');
    } else {
      chip.classList.remove('active');
    }
  });

  cartState.pendingETA = eta;
}

function saveLocationSelection() {
  const input = document.getElementById('modal-address-input');
  if (input && input.value.trim()) {
    cartState.deliveryAddress = input.value.trim();
    if (cartState.pendingETA) {
      cartState.deliveryETA = cartState.pendingETA;
    }

    try {
      localStorage.setItem('beego_delivery_address', cartState.deliveryAddress);
      localStorage.setItem('beego_delivery_eta', cartState.deliveryETA);
    } catch (e) {}

    // Update Header Displays
    const headerAddress = document.getElementById('header-address-display');
    const headerETA = document.getElementById('header-eta-display');
    if (headerAddress) {
      const parts = cartState.deliveryAddress.split(',');
      headerAddress.textContent = parts.length > 2 ? `${parts[1].trim()}, ${parts[2].trim()}` : cartState.deliveryAddress;
    }
    if (headerETA) headerETA.textContent = cartState.deliveryETA;

    renderWhatsAppBag();
    showToast('Delivery location updated');
  }
  closeLocationModal();
}

/**
 * Concierge / Sommelier Chat Modal
 */
function openConciergeChatModal() {
  const modal = document.getElementById('concierge-chat-modal');
  if (modal) modal.classList.add('active');
}

function closeConciergeModal() {
  const modal = document.getElementById('concierge-chat-modal');
  if (modal) modal.classList.remove('active');
}

function sendConciergeInquiry() {
  const textInput = document.getElementById('concierge-inquiry-text');
  const attachCart = document.getElementById('concierge-attach-cart')?.checked;

  let message = `🎧 Sommelier & Apothecary Desk Inquiry:\n`;
  message += textInput?.value?.trim() || 'Requesting pairing advice & cold-chain verification.';

  if (attachCart && Object.keys(cartState.items).length > 0) {
    message += `\n\n--- Current WhatsApp Bag ---\n` + generateWhatsAppMessageText();
  }

  const url = `https://wa.me/${DISPATCH_CONFIG.conciergePhone}?text=${encodeURIComponent(message)}`;
  window.open(url, '_blank');
  closeConciergeModal();
}

// Attach event listeners on DOM Ready
document.addEventListener('DOMContentLoaded', () => {
  // Initialize Bag
  renderWhatsAppBag();

  // Setup Category Navigation
  setupCategoryFilters();

  // Setup Global Search
  setupGlobalSearch();

  // Location button
  const locBtn = document.getElementById('btn-change-location');
  if (locBtn) locBtn.addEventListener('click', openLocationModal);

  // Header WhatsApp button
  const headerWaBtn = document.getElementById('btn-header-whatsapp');
  if (headerWaBtn) headerWaBtn.addEventListener('click', broadcastOrderToWhatsApp);

  // Hero WhatsApp Bag button
  const heroBagBtn = document.getElementById('btn-open-bag-hero');
  if (heroBagBtn) {
    heroBagBtn.addEventListener('click', () => {
      const bagSidebar = document.getElementById('whatsapp-bag-sidebar');
      if (bagSidebar) bagSidebar.scrollIntoView({ behavior: 'smooth' });
    });
  }

  // Close modals on background click
  window.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal-overlay')) {
      e.target.classList.remove('active');
    }
  });
});

// Export globally for inline onclick handlers
window.addItemToBag = addItemToBag;
window.decrementItem = decrementItem;
window.removeItem = removeItem;
window.quickSendItem = quickSendItem;
window.broadcastOrderToWhatsApp = broadcastOrderToWhatsApp;
window.openLocationModal = openLocationModal;
window.closeLocationModal = closeLocationModal;
window.setPresetLocation = setPresetLocation;
window.saveLocationSelection = saveLocationSelection;
window.openConciergeChatModal = openConciergeChatModal;
window.closeConciergeModal = closeConciergeModal;
window.sendConciergeInquiry = sendConciergeInquiry;
