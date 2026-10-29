import { test } from 'node:test';
import assert from 'node:assert/strict';
import { 
  saveProduct, 
  getProductById, 
  deleteProduct, 
  toggleProductStock,
  getAllProducts
} from '../src/server/data/catalog.js';
import { 
  getStoreById, 
  saveStore, 
  toggleStoreStatus 
} from '../src/server/data/stores.js';
import { 
  getSettings, 
  updateSettings 
} from '../src/server/data/settings.js';

test('Admin can add a product and it immediately reflects in the customer catalog', async () => {
  const testId = `test_prod_${Date.now()}`;
  const newProduct = await saveProduct({
    id: testId,
    name: 'Coorg Special Roasted Coffee Powder (250g)',
    price: 180,
    originalPrice: 220,
    unit: '250g Pouch',
    stock: 30,
    storeId: 'store_royal_bakery',
    storeName: 'Royal Bakery & Coorg Coffee Bar',
    categoryId: 'beverages-snacks',
    categoryName: 'Beverages & Snacks',
    isPrescriptionRequired: false,
    description: 'Freshly roasted plantation coffee from Virajpete estates.',
  });

  assert.equal(newProduct.id, testId);
  assert.equal(newProduct.price, 180);
  assert.equal(newProduct.discountPercent, 18);

  // Customer fetches product
  const fetched = await getProductById(testId);
  assert.ok(fetched);
  assert.equal(fetched.name, 'Coorg Special Roasted Coffee Powder (250g)');
  assert.equal(fetched.stock, 30);

  // Clean up
  await deleteProduct(testId);
  const deleted = await getProductById(testId);
  assert.equal(deleted, null);
});

test('Admin can edit a product and changes immediately update on customer site', async () => {
  const testId = `test_prod_edit_${Date.now()}`;
  await saveProduct({
    id: testId,
    name: 'Fresh Kodava Passion Fruit Squash',
    price: 160,
    originalPrice: 160,
    unit: '750ml Bottle',
    stock: 20,
    storeId: 'store_maletirike_greens',
    categoryId: 'beverages-snacks',
  });

  // Admin edits price to ₹140 and updates stock to 50
  const updated = await saveProduct({
    id: testId,
    name: 'Fresh Kodava Passion Fruit Squash (Estate Special)',
    price: 140,
    originalPrice: 160,
    unit: '750ml Bottle',
    stock: 50,
    storeId: 'store_maletirike_greens',
    categoryId: 'beverages-snacks',
  });

  assert.equal(updated.price, 140);
  assert.equal(updated.stock, 50);

  // Customer site checks item
  const fetched = await getProductById(testId);
  assert.equal(fetched.name, 'Fresh Kodava Passion Fruit Squash (Estate Special)');
  assert.equal(fetched.price, 140);
  assert.equal(fetched.discountPercent, 13); // (160 - 140)/160 = 12.5% -> 13%
  assert.equal(fetched.stock, 50);

  // Clean up
  await deleteProduct(testId);
});

test('Admin 1-click stock toggle switches item in-stock and out-of-stock live', async () => {
  const testId = `test_prod_stock_${Date.now()}`;
  await saveProduct({
    id: testId,
    name: 'Organic Coorg Honey Dipper Jar',
    price: 250,
    unit: '500g Jar',
    stock: 15,
    storeId: 'store_viraj_provisions',
    categoryId: 'groceries',
  });

  // 1. Toggle to out of stock
  const outOfStock = await toggleProductStock(testId);
  assert.equal(outOfStock.stock, 0);

  let customerProduct = await getProductById(testId);
  assert.equal(customerProduct.stock, 0);

  // 2. Toggle back to in stock
  const inStock = await toggleProductStock(testId);
  assert.equal(inStock.stock, 25);

  customerProduct = await getProductById(testId);
  assert.equal(customerProduct.stock, 25);

  // Clean up
  await deleteProduct(testId);
});

test('Admin store open/closed toggle updates customer merchant availability', async () => {
  const store = await getStoreById('store_royal_bakery');
  assert.ok(store);
  const initialStatus = store.isOpen;

  // Toggle status
  const toggled = await toggleStoreStatus('store_royal_bakery');
  assert.equal(toggled.isOpen, !initialStatus);

  const customerView = await getStoreById('store_royal_bakery');
  assert.equal(customerView.isOpen, !initialStatus);

  // Restore initial status
  await toggleStoreStatus('store_royal_bakery');
  const restored = await getStoreById('store_royal_bakery');
  assert.equal(restored.isOpen, initialStatus);
});

test('Admin platform settings and customer announcement banner sync live', async () => {
  const originalSettings = await getSettings();

  const updated = await updateSettings({
    baseDeliveryFee: 40.00,
    announcement: {
      enabled: true,
      text: '🌧️ Monsoon rain alert: Deliveries across Virajpete may take 10-15 mins extra.',
      type: 'warning',
    },
  });

  assert.equal(updated.baseDeliveryFee, 40.00);
  assert.equal(updated.announcement.enabled, true);
  assert.equal(updated.announcement.type, 'warning');

  // Customer fetches settings
  const liveSettings = await getSettings();
  assert.equal(liveSettings.baseDeliveryFee, 40.00);
  assert.equal(liveSettings.announcement.text, '🌧️ Monsoon rain alert: Deliveries across Virajpete may take 10-15 mins extra.');

  // Restore original
  await updateSettings(originalSettings);
});

