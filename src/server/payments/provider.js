import crypto from 'crypto';
import { query, getMemoryStore } from '../db/client.js';

export class PaymentProvider {
  /**
   * Create an order in the payment gateway
   */
  async createGatewayOrder({ orderId, amount, currency = 'INR', customer }) {
    throw new Error('createGatewayOrder must be implemented by provider.');
  }

  /**
   * Verify server-side payment signature
   */
  async verifyPaymentSignature({ orderId, paymentId, signature }) {
    throw new Error('verifyPaymentSignature must be implemented by provider.');
  }

  /**
   * Process refund
   */
  async processRefund({ paymentId, amount, reason }) {
    throw new Error('processRefund must be implemented by provider.');
  }
}

/**
 * Razorpay Gateway Implementation (Test Mode & Production)
 */
export class RazorpayPaymentProvider extends PaymentProvider {
  constructor(keyId, keySecret) {
    super();
    this.keyId = keyId;
    this.keySecret = keySecret;
  }

  async createGatewayOrder({ orderId, amount, currency = 'INR' }) {
    const amountInPaise = Math.round(amount * 100);

    // Call Razorpay API
    const authHeader = Buffer.from(`${this.keyId}:${this.keySecret}`).toString('base64');
    const response = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        Authorization: `Basic ${authHeader}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: amountInPaise,
        currency,
        receipt: orderId,
        payment_capture: 1,
      }),
    });

    if (!response.ok) {
      const errData = await response.json();
      throw new Error(errData.error?.description || 'Failed to create Razorpay order');
    }

    const data = await response.json();
    return {
      provider: 'razorpay',
      gatewayOrderId: data.id,
      amount: amountInPaise,
      currency,
      keyId: this.keyId,
    };
  }

  async verifyPaymentSignature({ orderId, paymentId, signature }) {
    const body = `${orderId}|${paymentId}`;
    const expectedSignature = crypto
      .createHmac('sha256', this.keySecret)
      .update(body)
      .digest('hex');

    const isValid = expectedSignature === signature;
    return {
      isValid,
      reason: isValid ? 'Signature verified' : 'Invalid payment signature mismatch',
    };
  }

  async processRefund({ paymentId, amount, reason }) {
    const amountInPaise = Math.round(amount * 100);
    const authHeader = Buffer.from(`${this.keyId}:${this.keySecret}`).toString('base64');

    const response = await fetch(`https://api.razorpay.com/v1/payments/${paymentId}/refund`, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${authHeader}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: amountInPaise,
        notes: { reason: reason || 'Customer cancellation in Virajpete' },
      }),
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error?.description || 'Refund request failed');
    }

    const data = await response.json();
    return {
      success: true,
      refundId: data.id,
      amount: data.amount / 100,
      status: data.status,
    };
  }
}

/**
 * Sandboxed Local Test Provider
 * Used when Razorpay API credentials are not yet added to .env.local
 */
export class SandboxPaymentProvider extends PaymentProvider {
  async createGatewayOrder({ orderId, amount, currency = 'INR' }) {
    const mockGatewayOrderId = `order_test_${orderId}_${Date.now()}`;
    return {
      provider: 'beego_sandbox',
      gatewayOrderId: mockGatewayOrderId,
      amount: Math.round(amount * 100),
      currency,
      isSandbox: true,
      message: 'BeeGo Sandbox Test Mode Active (Razorpay keys not configured)',
    };
  }

  async verifyPaymentSignature({ orderId, paymentId, signature }) {
    // In sandbox test mode, verify that paymentId starts with test_
    const isValid = !!paymentId && (paymentId.startsWith('pay_test_') || paymentId.startsWith('mock_'));
    return {
      isValid,
      reason: isValid ? 'Sandbox signature verified' : 'Invalid sandbox test payment reference',
    };
  }

  async processRefund({ paymentId, amount, reason }) {
    return {
      success: true,
      refundId: `rfnd_test_${Date.now()}`,
      amount,
      status: 'processed',
      message: 'Simulated sandbox refund recorded.',
    };
  }
}

/**
 * Factory helper to get active payment provider
 */
export function getPaymentProvider() {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (keyId && keySecret) {
    return new RazorpayPaymentProvider(keyId, keySecret);
  }

  return new SandboxPaymentProvider();
}

