'use client';

import React, { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { OrderResponse } from '@/lib/types';
import { ClipboardList, Package, Clock, CheckCircle, Truck, AlertTriangle } from 'lucide-react';

export default function OrdersPage() {
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const data = await api.getOrders();
      setOrders(data);
    } catch (err) {
      console.error('Failed to load orders', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle className="w-3.5 h-3.5" />
            <span>Confirmed</span>
          </span>
        );
      case 'PROCESSING':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-sky-50 text-sky-700 border border-sky-200">
            <Clock className="w-3.5 h-3.5" />
            <span>Processing</span>
          </span>
        );
      case 'DELIVERED':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-teal-50 text-teal-800 border border-teal-200">
            <Truck className="w-3.5 h-3.5" />
            <span>Delivered</span>
          </span>
        );
      case 'CANCELLED':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Cancelled</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700">
            <span>{status}</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gray-200 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
            <ClipboardList className="w-6 h-6 text-emerald-600" />
            <span>Customer Orders &amp; Audit Log</span>
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Persisted in Microsoft SQL Server table <code className="bg-gray-100 px-1 py-0.5 rounded text-xs text-gray-800">orders</code> with foreign key references to <code className="bg-gray-100 px-1 py-0.5 rounded text-xs text-gray-800">customers</code>.
          </p>
        </div>

        <button
          onClick={fetchOrders}
          className="px-4 py-2 rounded-xl bg-white border border-gray-200 text-xs font-semibold hover:bg-gray-50 transition-colors shadow-sm"
        >
          Refresh Orders
        </button>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-40 bg-white rounded-2xl border border-gray-100 p-6 animate-pulse space-y-3">
              <div className="h-5 bg-gray-200 rounded w-1/3" />
              <div className="h-4 bg-gray-200 rounded w-1/2" />
              <div className="h-8 bg-gray-200 rounded w-full" />
            </div>
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white rounded-3xl border border-gray-100 p-12 text-center space-y-3">
          <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
            <Package className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-gray-800">No orders placed yet</h3>
          <p className="text-xs text-gray-500 max-w-sm mx-auto">
            Add items to your cart from the storefront and checkout to see order transactions generated here.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-gray-100 gap-3">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono font-bold text-sm text-gray-900">
                      {order.orderNumber}
                    </span>
                    {getStatusBadge(order.status)}
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    Placed: {new Date(order.createdAt).toLocaleString()}
                  </p>
                </div>

                <div className="text-right">
                  <div className="text-lg font-bold text-emerald-700">
                    ${order.totalAmount.toFixed(2)}
                  </div>
                  <div className="text-xs text-gray-500">
                    Recipient: <strong className="text-gray-800">{order.customerName}</strong>
                  </div>
                </div>
              </div>

              {/* Items List */}
              <div className="mt-4 pt-2">
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  Ordered Items ({order.items?.length || 0})
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                  {order.items?.map((item, idx) => (
                    <div
                      key={idx}
                      className="bg-gray-50 rounded-xl p-2.5 text-xs flex justify-between items-center border border-gray-100"
                    >
                      <span className="font-medium text-gray-800 truncate mr-2">
                        {item.quantity}x {item.productName}
                      </span>
                      <span className="font-semibold text-gray-900 whitespace-nowrap">
                        ${item.subtotal.toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Delivery Address */}
              <div className="mt-4 pt-3 border-t border-gray-50 text-xs text-gray-500 flex flex-col sm:flex-row justify-between gap-1">
                <span>
                  <strong>Delivery to:</strong> {order.deliveryAddress}
                </span>
                {order.deliveryNotes && (
                  <span>
                    <strong>Instructions:</strong> {order.deliveryNotes}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

