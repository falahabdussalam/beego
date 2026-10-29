import { test } from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'crypto';
import { RazorpayPaymentProvider, SandboxPaymentProvider } from '../src/server/payments/provider.js';

test('Razorpay HMAC SHA256 payment signature verification', async () => {
  const dummyKeyId = 'rzp_test_sampleKey123';
  const dummyKeySecret = 'secret_test_xyz789';
  const provider = new RazorpayPaymentProvider(dummyKeyId, dummyKeySecret);

  const orderId = 'order_test_999';
  const paymentId = 'pay_test_888';

  // Compute valid signature
  const body = `${orderId}|${paymentId}`;
  const validSignature = crypto
    .createHmac('sha256', dummyKeySecret)
    .update(body)
    .digest('hex');

  // Verify valid signature passes
  const validCheck = await provider.verifyPaymentSignature({
    orderId,
    paymentId,
    signature: validSignature,
  });
  assert.equal(validCheck.isValid, true);

  // Verify forged signature fails
  const forgedCheck = await provider.verifyPaymentSignature({
    orderId,
    paymentId,
    signature: 'forged_fake_signature_hex_value',
  });
  assert.equal(forgedCheck.isValid, false);
});

test('Sandbox payment provider creates test orders and verifies test payment IDs', async () => {
  const sandbox = new SandboxPaymentProvider();
  const gatewayOrder = await sandbox.createGatewayOrder({
    orderId: 'BEE-202610-001',
    amount: 350.00,
  });

  assert.ok(gatewayOrder.gatewayOrderId.startsWith('order_test_'));
  assert.equal(gatewayOrder.currency, 'INR');

  const validTest = await sandbox.verifyPaymentSignature({
    orderId: gatewayOrder.gatewayOrderId,
    paymentId: 'pay_test_simulated_token',
    signature: 'any',
  });
  assert.equal(validTest.isValid, true);
});

