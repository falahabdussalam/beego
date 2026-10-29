import React from 'react';
import OrderTrackingClient from './OrderTrackingClient';

export const metadata = {
  title: 'Order Status & Tracking — BeeGo Delivery Virajpete',
  description: 'Live order timeline and fulfillment tracking for BeeGo Delivery in Virajpete, Kodagu.',
};

export default async function OrderPage({ params }) {
  const { id } = await params;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <OrderTrackingClient orderId={id} />
    </div>
  );
}

