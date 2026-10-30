'use client';

import React, { useState } from 'react';
import { X, CheckCircle2, AlertCircle, ShoppingCart, Truck, User, Mail, MapPin, FileText } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { api } from '@/lib/api';
import { OrderResponse } from '@/lib/types';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CheckoutModal({ isOpen, onClose }: CheckoutModalProps) {
  const { cart, subtotal, clearCart, setIsCartOpen } = useCart();

  const [formData, setFormData] = useState({
    customerName: 'Alex Johnson',
    customerEmail: 'alex.johnson@groceryfresh.com',
    customerPhone: '+1-555-019-2834',
    deliveryAddress: '452 Silicon Orchard Avenue, Tech City, CA 94016',
    deliveryNotes: 'Please leave at front door next to the planter.',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [orderResult, setOrderResult] = useState<OrderResponse | null>(null);

  if (!isOpen) return null;

  const deliveryFee = subtotal > 35 ? 0 : 4.99;
  const estimatedTax = subtotal * 0.0825;
  const finalTotal = subtotal + deliveryFee + estimatedTax;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const orderReq = {
        ...formData,
        items: cart.map((item) => ({
          productId: item.product.id,
          quantity: item.quantity,
        })),
      };

      const result = await api.placeOrder(orderReq);
      setOrderResult(result);
      clearCart();
    } catch (err: any) {
      setError(err.message || 'Failed to place order. Check your input validation.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDone = () => {
    setOrderResult(null);
    onClose();
    setIsCartOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-gray-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gray-50/50">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                {orderResult ? 'Order Confirmed!' : 'Checkout & Delivery'}
              </h2>
              <p className="text-xs text-gray-500">
                {orderResult ? 'Receipt & Tracking Info' : 'Jakarta Validation & MS SQL ACID Transaction'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-200/60 text-gray-400 hover:text-gray-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {orderResult ? (
            <div className="text-center py-4 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Thank you for your order!</h3>
                <p className="text-sm text-gray-500 mt-1">
                  Order Number:{' '}
                  <span className="font-mono font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                    {orderResult.orderNumber}
                  </span>
                </p>
              </div>

              <div className="bg-gray-50 rounded-2xl p-4 text-left space-y-2 text-sm border border-gray-100">
                <div className="flex justify-between">
                  <span className="text-gray-500">Total Paid:</span>
                  <span className="font-bold text-gray-900">
                    ${orderResult.totalAmount.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Status:</span>
                  <span className="font-semibold text-emerald-600 uppercase text-xs tracking-wider">
                    {orderResult.status}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Recipient:</span>
                  <span className="text-gray-800">{orderResult.customerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Delivery Address:</span>
                  <span className="text-gray-800 text-right truncate max-w-[200px]">
                    {orderResult.deliveryAddress}
                  </span>
                </div>
              </div>

              <p className="text-xs text-gray-400">
                * Inventory was locked using Jakarta Persistence pessimistic lock and deducted atomically in MS SQL Server.
              </p>

              <button
                onClick={handleDone}
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold transition-all shadow-md shadow-emerald-600/20"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm flex items-start space-x-2">
                  <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              {/* Customer Name */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={formData.customerName}
                    onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                    className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="Jane Doe"
                  />
                </div>
              </div>

              {/* Email & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Email Address <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                    <input
                      type="email"
                      required
                      value={formData.customerEmail}
                      onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                      className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      placeholder="jane@example.com"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={formData.customerPhone}
                    onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="+1-555-019-2834"
                  />
                </div>
              </div>

              {/* Delivery Address */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Delivery Address <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={formData.deliveryAddress}
                    onChange={(e) => setFormData({ ...formData, deliveryAddress: e.target.value })}
                    className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="123 Orchard Lane, Apt 4B"
                  />
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Special Delivery Instructions
                </label>
                <div className="relative">
                  <FileText className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={formData.deliveryNotes}
                    onChange={(e) => setFormData({ ...formData, deliveryNotes: e.target.value })}
                    className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="Ring bell twice or leave at porch"
                  />
                </div>
              </div>

              {/* Order Summary box */}
              <div className="bg-gray-50 rounded-2xl p-4 text-xs space-y-1.5 border border-gray-100">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({cart.length} items):</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Delivery:</span>
                  <span>{deliveryFee === 0 ? 'FREE' : `$${deliveryFee.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Est. Taxes (8.25%):</span>
                  <span>${estimatedTax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-gray-900 pt-2 border-t border-gray-200">
                  <span>Total Due:</span>
                  <span className="text-emerald-700">${finalTotal.toFixed(2)}</span>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting || cart.length === 0}
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-300 text-white font-semibold transition-all shadow-md shadow-emerald-600/20 active:scale-98"
              >
                {isSubmitting ? 'Placing Order...' : `Confirm & Pay $${finalTotal.toFixed(2)}`}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

