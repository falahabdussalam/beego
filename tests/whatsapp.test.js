import { test } from 'node:test';
import assert from 'node:assert/strict';
import { formatWhatsAppOrderMessage, getWhatsAppUrl, formatSingleProductWhatsAppMessage } from '../src/lib/whatsapp.js';

test('WhatsApp order message formatting includes all items, totals, and Virajpete address', () => {
  const sampleOrder = {
    orderId: 'BG-WA-1001',
    customerName: 'Kushal Bopanna',
    customerPhone: '9480112233',
    storeName: 'Coorg Heritage Kitchen',
    address: {
      house: 'No. 24, Coffee Estate View',
      street: 'Clock Tower Main Road',
      area: 'Virajpete Town',
      landmark: 'Near Govt Hospital',
    },
    items: [
      { name: 'Pandi Curry with Akki Roti', quantity: 2, price: 260, unit: 'Meal' },
      { name: 'Nandini Cow Ghee', quantity: 1, price: 340, unit: '500ml' },
    ],
    subtotal: 860,
    deliveryFee: 0,
    tax: 43,
    discount: 50,
    couponCode: 'BEEGO50',
    total: 853,
    notes: 'Please ring bell upon arrival',
  };

  const message = formatWhatsAppOrderMessage(sampleOrder);

  assert.ok(message.includes('BG-WA-1001'));
  assert.ok(message.includes('Kushal Bopanna'));
  assert.ok(message.includes('9480112233'));
  assert.ok(message.includes('Coorg Heritage Kitchen'));
  assert.ok(message.includes('2x'));
  assert.ok(message.includes('Pandi Curry with Akki Roti'));
  assert.ok(message.includes('TOTAL PAYABLE:* ₹853'));
  assert.ok(message.includes('Clock Tower Main Road'));
  assert.ok(message.includes('Virajpete'));
});

test('WhatsApp URL generation encodes message properly with country code', () => {
  const url = getWhatsAppUrl('Hello BeeGo Virajpete', '918277000000');
  assert.ok(url.startsWith('https://wa.me/918277000000?text=Hello%20BeeGo%20Virajpete'));
});

test('Single product WhatsApp message formatting generates clear text', () => {
  const product = {
    name: 'Coorg Estate Whole Black Pepper',
    price: 195,
    unit: '200g',
    storeName: 'Virajpet Central Super Store',
  };

  const msg = formatSingleProductWhatsAppMessage(product, 2, 'Main Road, Virajpete');
  assert.ok(msg.includes('Coorg Estate Whole Black Pepper'));
  assert.ok(msg.includes('Quantity:* 2'));
  assert.ok(msg.includes('₹390'));
});

