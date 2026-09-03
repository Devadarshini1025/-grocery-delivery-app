import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const STATUS_OPTIONS = [
  { value: 'pending', label: 'Order Placed (Pending)', badge: 'bg-yellow-100 text-yellow-800 border-yellow-300' },
  { value: 'confirmed', label: 'Order Confirmed', badge: 'bg-blue-100 text-blue-800 border-blue-300' },
  { value: 'preparing', label: 'Packing Items', badge: 'bg-orange-100 text-orange-800 border-orange-300' },
  { value: 'out_for_delivery', label: 'Out for Delivery', badge: 'bg-purple-100 text-purple-800 border-purple-300' },
  { value: 'delivered', label: 'Delivered (Cash Collected)', badge: 'bg-green-100 text-green-800 border-green-300' },
  { value: 'cancelled', label: 'Cancelled', badge: 'bg-red-100 text-red-800 border-red-300' },
];

export default function AdminOrders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingId, setUpdatingId] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/orders');
      setOrders(data.orders || []);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch customer orders.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      setUpdatingId(orderId);
      const { data } = await api.put(`/orders/${orderId}/status`, { status: newStatus });
      setOrders((prev) => prev.map((o) => (o._id === orderId ? data.order : o)));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update order status');
    } finally {
      setUpdatingId(null);
    }
  };

  // Metrics calculation
  const totalRevenue = orders.reduce((sum, o) => sum + (o.totalPrice || 0), 0);
  const cashCollected = orders.filter((o) => o.isPaid).reduce((sum, o) => sum + (o.totalPrice || 0), 0);
  const pendingOrdersCount = orders.filter((o) => o.status === 'pending').length;

  const filteredOrders = statusFilter === 'all'
    ? orders
    : orders.filter((o) => o.status === statusFilter);

  if (user && user.role !== 'admin') {
    return (
      <div className="max-w-md mx-auto px-6 py-20 text-center">
        <h2 className="font-display text-2xl font-bold text-tomato-600">Access Denied</h2>
        <p className="text-sm text-ink-600 mt-2">You need administrator privileges to view customer orders.</p>
        <Link to="/" className="inline-block mt-4 bg-leaf-700 text-white px-5 py-2 rounded-lg text-sm font-medium">
          Back to Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-display text-3xl font-bold text-leaf-900">Customer Orders Dashboard</h1>
            <span className="bg-leaf-700 text-white text-xs font-semibold px-2.5 py-0.5 rounded-full">Admin</span>
          </div>
          <p className="text-sm text-ink-600 mt-1">Manage incoming Cash on Delivery orders, delivery status, and payments</p>
        </div>

        <button
          onClick={fetchOrders}
          className="bg-white border border-kraft-300 hover:border-leaf-500 text-ink-900 px-4 py-2 rounded-xl text-sm font-medium transition-colors cursor-pointer flex items-center gap-2"
        >
          <span>🔄</span> Refresh Orders
        </button>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-5 rounded-2xl border border-kraft-300 shadow-xs">
          <p className="text-xs font-semibold text-ink-600 uppercase tracking-wider">Total Orders</p>
          <p className="text-3xl font-bold text-leaf-900 mt-2">{orders.length}</p>
          <p className="text-xs text-turmeric-500 mt-1">{pendingOrdersCount} pending delivery</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-kraft-300 shadow-xs">
          <p className="text-xs font-semibold text-ink-600 uppercase tracking-wider">Cash Collected (Delivered)</p>
          <p className="text-3xl font-bold text-leaf-700 mt-2">₹{cashCollected}</p>
          <p className="text-xs text-ink-600 mt-1">Offline cash received</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-kraft-300 shadow-xs">
          <p className="text-xs font-semibold text-ink-600 uppercase tracking-wider">Total Pipeline Value</p>
          <p className="text-3xl font-bold text-ink-900 mt-2">₹{totalRevenue}</p>
          <p className="text-xs text-ink-600 mt-1">From all customer orders</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2 scrollbar-none">
        <span className="text-xs font-semibold text-ink-600 uppercase mr-2">Filter:</span>
        <button
          onClick={() => setStatusFilter('all')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
            statusFilter === 'all'
              ? 'bg-leaf-700 text-white'
              : 'bg-white border border-kraft-300 text-ink-600 hover:text-ink-900'
          }`}
        >
          All ({orders.length})
        </button>
        {STATUS_OPTIONS.map((opt) => {
          const count = orders.filter((o) => o.status === opt.value).length;
          return (
            <button
              key={opt.value}
              onClick={() => setStatusFilter(opt.value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap cursor-pointer transition-colors ${
                statusFilter === opt.value
                  ? 'bg-leaf-700 text-white'
                  : 'bg-white border border-kraft-300 text-ink-600 hover:text-ink-900'
              }`}
            >
              {opt.label.split(' ')[0]} ({count})
            </button>
          );
        })}
      </div>

      {error && (
        <div className="bg-tomato-600/10 border border-tomato-600 text-tomato-600 px-4 py-3 rounded-xl mb-6 text-sm">
          {error}
        </div>
      )}

      {/* Orders List */}
      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-kraft-200 p-6 h-40 animate-pulse" />
          ))}
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-kraft-300">
          <span className="text-5xl">📋</span>
          <h3 className="font-display font-semibold text-xl text-ink-900 mt-4">No orders in this category</h3>
          <p className="text-sm text-ink-600 mt-1">When customers place orders, they will appear here.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredOrders.map((order) => {
            const currentStatus = STATUS_OPTIONS.find((s) => s.value === order.status) || STATUS_OPTIONS[0];
            const orderDate = new Date(order.createdAt).toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            });

            return (
              <div key={order._id} className="bg-white rounded-2xl border border-kraft-300 p-6 shadow-xs">
                {/* Header */}
                <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-kraft-200">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-ink-900">
                        #{order._id.slice(-8).toUpperCase()}
                      </span>
                      <span className="text-xs text-ink-600">• {orderDate}</span>
                    </div>
                    <div className="mt-1 flex items-center gap-3 text-xs text-ink-600">
                      <span>👤 <strong className="text-ink-900">{order.user?.name || 'Customer'}</strong></span>
                      <span>✉️ {order.user?.email || 'N/A'}</span>
                      {order.user?.phone && <span>📞 {order.user.phone}</span>}
                    </div>
                  </div>

                  {/* Status Dropdown & Payment Badge */}
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-2">
                      <label className="text-xs font-semibold text-ink-600">Status:</label>
                      <select
                        value={order.status}
                        disabled={updatingId === order._id}
                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                        className={`text-xs font-semibold px-3 py-1.5 rounded-lg border focus:ring-2 focus:ring-leaf-500 cursor-pointer ${currentStatus.badge}`}
                      >
                        {STATUS_OPTIONS.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-kraft-200 text-ink-900">
                      💵 {order.paymentMethod || 'Cash on Delivery'}
                    </span>
                  </div>
                </div>

                {/* Items and Address Grid */}
                <div className="py-4 grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Items Ordered (2 Cols) */}
                  <div className="md:col-span-2 divide-y divide-kraft-100">
                    <p className="text-xs font-semibold text-ink-600 uppercase mb-2">Ordered Items ({order.items?.length})</p>
                    {order.items?.map((item, idx) => (
                      <div key={idx} className="py-2 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2.5">
                          {item.image && (
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-10 h-10 object-cover rounded-md border border-kraft-200"
                            />
                          )}
                          <div>
                            <p className="font-semibold text-ink-900">{item.name}</p>
                            <p className="text-ink-600">₹{item.price} × {item.quantity}</p>
                          </div>
                        </div>
                        <span className="font-bold text-ink-900">₹{item.price * item.quantity}</span>
                      </div>
                    ))}
                  </div>

                  {/* Delivery Address & Payment Summary (1 Col) */}
                  <div className="bg-kraft-100 p-4 rounded-xl text-xs space-y-2.5 flex flex-col justify-between">
                    <div>
                      <p className="font-semibold text-ink-900 uppercase tracking-wider mb-1">Delivery Destination</p>
                      <p className="text-ink-900 font-medium">{order.shippingAddress?.street}</p>
                      <p className="text-ink-600">
                        {order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.zipCode}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-kraft-300">
                      <div className="flex justify-between text-ink-600 mb-1">
                        <span>Items: ₹{order.itemsPrice}</span>
                        <span>Delivery: ₹{order.deliveryFee}</span>
                      </div>
                      <div className="flex justify-between font-bold text-sm text-ink-900">
                        <span>Total:</span>
                        <span className="text-leaf-700">₹{order.totalPrice}</span>
                      </div>
                      <p className="mt-1 font-semibold">
                        {order.isPaid ? (
                          <span className="text-green-700">✅ Paid in Cash</span>
                        ) : (
                          <span className="text-turmeric-500">⏳ Collect ₹{order.totalPrice} Cash upon delivery</span>
                        )}
                      </p>
                    </div>
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
