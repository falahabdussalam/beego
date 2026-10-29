/**
 * WhatsApp Ordering and Message Formatting Utilities for BeeGo Delivery (Virajpete)
 */

export const DEFAULT_WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '918277000000';
export const DISPLAY_WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_DISPLAY || '+91 82770 00000';

/**
 * Format a complete order into a readable, structured WhatsApp message
 */
export function formatWhatsAppOrderMessage({
  orderId,
  customerName,
  customerPhone,
  address,
  items = [],
  storeName,
  subtotal = 0,
  deliveryFee = 0,
  tax = 0,
  discount = 0,
  couponCode = null,
  total = 0,
  notes = '',
}) {
  const lines = [
    `🐝 *BEEGO DELIVERY - NEW ORDER*`,
    `📍 *Virajpete, Kodagu, Karnataka*`,
    `----------------------------------------`,
  ];

  if (orderId) {
    lines.push(`📋 *Order ID:* ${orderId}`);
  }

  if (storeName) {
    lines.push(`🏪 *Store:* ${storeName}`);
  }

  lines.push(
    `----------------------------------------`,
    `👤 *Customer Name:* ${customerName || 'Customer'}`,
    `📞 *Customer Phone:* ${customerPhone || 'Not provided'}`,
    `🏠 *Delivery Address:* ${[address?.house, address?.street, address?.area || 'Virajpete Town'].filter(Boolean).join(', ')}`
  );

  if (address?.landmark) {
    lines.push(`📌 *Landmark:* ${address.landmark}`);
  }

  if (address?.lat && address?.lng) {
    lines.push(`🗺️ *Google Maps Pin:* https://maps.google.com/?q=${address.lat},${address.lng}`);
  }

  lines.push(
    `----------------------------------------`,
    `🛒 *ITEMS ORDERED:*`
  );

  items.forEach((item, index) => {
    const itemTotal = (Number(item.price) * Number(item.quantity)).toFixed(0);
    const unitText = item.unit ? ` (${item.unit})` : '';
    const rxTag = item.isPrescriptionRequired ? ' [Rx Required]' : '';
    lines.push(`${index + 1}. *${item.quantity}x* ${item.name}${unitText}${rxTag} - ₹${itemTotal}`);
  });

  lines.push(
    `----------------------------------------`,
    `💰 *Items Subtotal:* ₹${Number(subtotal).toFixed(0)}`,
    `🚚 *Delivery Fee:* ${deliveryFee === 0 ? 'FREE' : `₹${Number(deliveryFee).toFixed(0)}`}`
  );

  if (discount > 0) {
    lines.push(`🏷️ *Promo Discount${couponCode ? ` (${couponCode})` : ''}:* -₹${Number(discount).toFixed(0)}`);
  }

  if (tax > 0) {
    lines.push(`🧾 *Taxes (GST):* ₹${Number(tax).toFixed(0)}`);
  }

  lines.push(
    `💵 *TOTAL PAYABLE:* ₹${Number(total).toFixed(0)}`,
    `----------------------------------------`
  );

  if (notes && notes.trim()) {
    lines.push(`📝 *Delivery Instructions:* ${notes.trim()}`, `----------------------------------------`);
  }

  lines.push(
    `_Order placed via BeeGo Delivery Virajpete Web_`,
    `_Please reply to confirm delivery time._`
  );

  return lines.join('\n');
}

/**
 * Generate a wa.me URL for the order message
 */
export function getWhatsAppUrl(message, phoneNumber) {
  const targetNumber = phoneNumber || DEFAULT_WHATSAPP_NUMBER;
  const cleanPhone = targetNumber.replace(/[^0-9]/g, '');
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}

/**
 * Format a single product direct inquiry / quick order message
 */
export function formatSingleProductWhatsAppMessage(product, quantity = 1, address = null) {
  const total = (Number(product.price) * quantity).toFixed(0);
  const lines = [
    `🐝 *BEEGO DELIVERY - QUICK ORDER*`,
    `📍 *Virajpete, Kodagu*`,
    `----------------------------------------`,
    `🛒 *Product:* ${product.name}`,
    `📦 *Quantity:* ${quantity} ${product.unit || 'unit'}`,
    `💵 *Estimated Price:* ₹${total}`,
    `🏪 *Merchant:* ${product.storeName || 'Local Virajpete Store'}`,
  ];

  if (address) {
    lines.push(`🏠 *Delivery Location:* ${address}`);
  }

  lines.push(
    `----------------------------------------`,
    `Please confirm availability and delivery to Virajpete.`
  );

  return lines.join('\n');
}

