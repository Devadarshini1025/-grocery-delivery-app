import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const STATUS_BADGES = {
  pending: { label: 'Order Placed', color: 'bg-yellow-100 text-yellow-800 border-yellow-300' },
  confirmed: { label: 'Confirmed', color: 'bg-blue-100 text-blue-800 border-blue-300' },
  preparing: { label: 'Packing Items', color: 'bg-orange-100 text-orange-800 border-orange-300' },
  out_for_delivery: { label: 'Out for Delivery', color: 'bg-purple-100 text-purple-800 border-purple-300' },
  delivered: { label: 'Delivered (Paid in Cash)', color: 'bg-green-100 text-green-800 border-green-300' },
  cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-800 border-red-300' },
};

export default function Orders() {
  const { user } = useAuth();
  const location = useLocation();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const newOrderId = location.state?.newOrderId;

  useEffect(() => {
    if (user) {
      fetchMyOrders();
    }
  }, [user]);

  const fetchMyOrders = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/orders/myorders');
      setOrders(data.orders || []);
      setError('');
    } catch (err) {
      setError('Failed to fetch your orders. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-6 py-20 text-center">
        <h2 className="font-display text-2xl font-bold text-ink-900">Please log in</h2>
        <p className="text-sm text-ink-600 mt-2">You must be logged in to view your orders.</p>
        <Link
          to="/login"
          className="inline-block mt-4 bg-leaf-700 hover:bg-leaf-600 text-white px-5 py-2 rounded-lg text-sm font-medium"
        >
          Log in
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold text-leaf-900">My Orders</h1>
          <p className="text-sm text-ink-600 mt-1">Track your deliveries and payment status</p>
        </div>
        <Link
          to="/"
          className="bg-white border border-kraft-300 hover:border-leaf-500 text-ink-900 px-4 py-2 rounded-xl text-sm font-medium transition-colors"
        >
          + Continue Shopping
        </Link>
      </div>

      {newOrderId && (
        <div className="mb-6 p-4 bg-leaf-100 border border-leaf-700/30 text-leaf-900 rounded-xl flex items-center gap-3">
          <span className="text-2xl">🎉</span>
          <div>
            <p className="font-bold">Order placed successfully with Cash on Delivery!</p>
            <p className="text-xs text-leaf-800">
              Our team is preparing your fresh groceries. Please keep cash ready when the delivery partner arrives.
            </p>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-tomato-600/10 border border-tomato-600 text-tomato-600 px-4 py-3 rounded-xl mb-6 text-sm">
          {error}
        </div>
      )}

      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-kraft-200 p-6 h-36 animate-pulse" />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-kraft-300">
          <span className="text-5xl">📦</span>
          <h3 className="font-display font-semibold text-xl text-ink-900 mt-4">No orders placed yet</h3>
          <p className="text-sm text-ink-600 mt-1">When you place Cash on Delivery orders, they will appear here.</p>
          <Link
            to="/"
            className="inline-block mt-4 bg-leaf-700 text-white px-5 py-2 rounded-xl text-sm font-medium hover:bg-leaf-600"
          >
            Explore Groceries
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => {
            const statusInfo = STATUS_BADGES[order.status] || STATUS_BADGES.pending;
            const orderDate = new Date(order.createdAt).toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            });

            return (
              <div key={order._id} className="bg-white rounded-2xl border border-kraft-300 p-6 shadow-xs">
                {/* Order Header */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-kraft-200">
                  <div>
                    <span className="text-xs font-mono text-ink-600">ORDER ID: #{order._id.slice(-8).toUpperCase()}</span>
                    <p className="text-xs text-ink-600 mt-0.5">Placed on {orderDate}</p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${statusInfo.color}`}>
                      ● {statusInfo.label}
                    </span>
                    <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-kraft-200 text-ink-900">
                      💵 {order.paymentMethod || 'Cash on Delivery'}
                    </span>
                  </div>
                </div>

                {/* Items List */}
                <div className="py-4 divide-y divide-kraft-100">
                  {order.items?.map((item, idx) => (
                    <div key={idx} className="py-2.5 flex items-center justify-between text-sm">
                      <div className="flex items-center gap-3">
                        {item.image && (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-12 h-12 object-cover rounded-lg border border-kraft-200"
                          />
                        )}
                        <div>
                          <span className="font-medium text-ink-900">{item.name}</span>
                          <span className="text-ink-600 text-xs ml-2">× {item.quantity}</span>
                        </div>
                      </div>
                      <span className="font-semibold text-ink-900">₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>

                {/* Order Footer & Delivery Address */}
                <div className="pt-4 border-t border-kraft-200 flex flex-wrap items-center justify-between text-xs text-ink-600 gap-3">
                  <div>
                    <span className="font-semibold text-ink-900">Delivery Address: </span>
                    <span>
                      {order.shippingAddress?.street}, {order.shippingAddress?.city}, {order.shippingAddress?.zipCode}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-sm font-bold text-ink-900">
                      Total: <span className="text-leaf-700 text-base">₹{order.totalPrice}</span>
                    </span>
                    <p className="text-2xs text-ink-600">
                      {order.isPaid ? '✅ Paid in cash' : '⏳ To be paid in cash upon delivery'}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

