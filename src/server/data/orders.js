import fs from 'fs';
import path from 'path';

const ORDERS_FILE_PATH = path.join(process.cwd(), 'src', 'server', 'data', 'orders.json');

const INITIAL_ORDERS = [
  {
    id: 'BG-WA-260101',
    customerName: 'Kaveri Muthappa',
    customerPhone: '9480112233',
    storeId: 'store_coorg_heritage',
    storeName: 'Coorg Heritage Kitchen',
    status: 'delivered',
    items: [
      { id: 'item_1', name: 'Traditional Kodava Pandi Curry with Akki Roti (2 pcs)', quantity: 2, price: 260 },
      { id: 'item_2', name: 'Kadambuttu (Steamed Rice Dumplings - 4 pcs)', quantity: 1, price: 120 },
    ],
    itemSubtotal: 640,
    deliveryFee: 0,
    taxAmount: 32,
    totalAmount: 672,
    paymentMethod: 'whatsapp',
    paymentStatus: 'paid',
    deliveryAddress: {
      house: 'Hill View Cottage',
      street: 'Clock Tower Road',
      area: 'Virajpete Town',
      landmark: 'Near St. Anne\'s Church',
    },
    deliveryInstructions: 'Ring bell at the gate, please handle with care.',
    createdAt: new Date(Date.now() - 3 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
  },
  {
    id: 'BG-WA-260102',
    customerName: 'Rohan Bopanna',
    customerPhone: '9480445566',
    storeId: 'store_viraj_provisions',
    storeName: 'Virajpet Central Super Store',
    status: 'out_for_delivery',
    items: [
      { id: 'item_3', name: 'Coorg Estate Whole Black Pepper (200g)', quantity: 2, price: 195 },
      { id: 'item_4', name: 'Pure Coorg Forest Honey (500g)', quantity: 1, price: 340 },
    ],
    itemSubtotal: 730,
    deliveryFee: 0,
    taxAmount: 36.5,
    totalAmount: 766.5,
    paymentMethod: 'cod',
    paymentStatus: 'pending',
    deliveryAddress: {
      house: 'Flat 302, Coffee Blossom Enclave',
      street: 'Telugubedha Main Road',
      area: 'Telugubedha, Virajpete',
      landmark: 'Opposite State Bank',
    },
    deliveryInstructions: 'Call upon arrival.',
    createdAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
  },
  {
    id: 'BG-WA-260103',
    customerName: 'Ananya Somanna',
    customerPhone: '9845778899',
    storeId: 'store_city_pharmacy',
    storeName: 'City Care Licensed Pharmacy',
    status: 'confirmed',
    items: [
      { id: 'item_5', name: 'First Aid Antiseptic Liquid (100ml)', quantity: 1, price: 65 },
      { id: 'item_6', name: 'Digital Infrared Thermometer', quantity: 1, price: 450 },
    ],
    itemSubtotal: 515,
    deliveryFee: 0,
    taxAmount: 25.75,
    totalAmount: 540.75,
    paymentMethod: 'whatsapp',
    paymentStatus: 'pending',
    deliveryAddress: {
      house: 'Devi Nilaya',
      street: 'Hospital Road',
      area: 'Govt Hospital Circle, Virajpete',
      landmark: 'Near Dental Clinic',
    },
    deliveryInstructions: 'Urgent medical delivery needed.',
    createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
  },
];

let inMemoryOrdersCache = null;

export function readStoredOrders() {
  try {
    if (fs.existsSync(ORDERS_FILE_PATH)) {
      const data = fs.readFileSync(ORDERS_FILE_PATH, 'utf-8');
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) {
        inMemoryOrdersCache = parsed;
        return parsed;
      }
    }
  } catch (err) {
    console.warn('readStoredOrders fallback to memory:', err.message);
  }

  if (!inMemoryOrdersCache) {
    inMemoryOrdersCache = [...INITIAL_ORDERS];
    try {
      fs.writeFileSync(ORDERS_FILE_PATH, JSON.stringify(INITIAL_ORDERS, null, 2), 'utf-8');
    } catch (e) {
      // Ignored
    }
  }
  return inMemoryOrdersCache;
}

export function writeStoredOrders(orders) {
  try {
    inMemoryOrdersCache = orders;
    fs.writeFileSync(ORDERS_FILE_PATH, JSON.stringify(orders, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('writeStoredOrders error:', err.message);
    return false;
  }
}

export async function getAllOrders() {
  return readStoredOrders();
}

export async function getOrderById(id) {
  const orders = readStoredOrders();
  return orders.find((o) => o.id === id) || null;
}

export async function updateOrderStatus(id, newStatus) {
  const orders = readStoredOrders();
  const order = orders.find((o) => o.id === id);
  if (!order) return null;

  order.status = newStatus;
  order.updatedAt = new Date().toISOString();
  writeStoredOrders(orders);
  return order;
}

export async function saveOrder(orderData) {
  const orders = readStoredOrders();
  const id = orderData.id || `BG-WA-${Date.now().toString().slice(-6)}`;

  const newOrder = {
    ...orderData,
    id,
    createdAt: orderData.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const existingIndex = orders.findIndex((o) => o.id === id);
  if (existingIndex >= 0) {
    orders[existingIndex] = { ...orders[existingIndex], ...newOrder };
  } else {
    orders.unshift(newOrder);
  }

  writeStoredOrders(orders);
  return newOrder;
}

