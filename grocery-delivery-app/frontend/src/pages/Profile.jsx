import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) fetchOrders();
  }, [user]);

  const fetchOrders = async () => {
    try {
      const { data } = await api.get('/orders/myorders');
      setOrders(data.orders || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-6 py-20 text-center">
        <h2 className="font-display text-2xl font-bold text-ink-900">Please log in</h2>
        <Link to="/login" className="inline-block mt-4 bg-leaf-700 text-white px-5 py-2 rounded-lg text-sm font-medium">
          Log in
        </Link>
      </div>
    );
  }

  // Extract unique addresses from past orders
  const savedAddresses = [];
  const seen = new Set();
  orders.forEach((o) => {
    if (o.shippingAddress) {
      const key = `${o.shippingAddress.street}-${o.shippingAddress.zipCode}`;
      if (!seen.has(key)) {
        seen.add(key);
        savedAddresses.push(o.shippingAddress);
      }
    }
  });

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <h1 className="font-display text-3xl font-bold text-leaf-900 mb-8">My Account</h1>

      {/* Profile Info */}
      <div className="bg-white rounded-2xl border border-kraft-300 p-6 shadow-xs mb-6 flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-leaf-700 text-white flex items-center justify-center text-xl font-bold">
            {user.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-semibold text-lg text-ink-900">{user.name}</p>
            <p className="text-sm text-ink-600">{user.email}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="bg-tomato-600 hover:bg-tomato-500 text-white px-4 py-2 rounded-lg text-sm font-medium"
        >
          Logout
        </button>
      </div>

      {/* Saved Addresses (from past orders) */}
      <div className="bg-white rounded-2xl border border-kraft-300 p-6 shadow-xs mb-6">
        <h2 className="font-display font-semibold text-lg text-ink-900 mb-4">📍 Delivery Addresses</h2>
        {savedAddresses.length === 0 ? (
          <p className="text-sm text-ink-600">No saved addresses yet — they'll appear here after your first order.</p>
        ) : (
          <div className="space-y-3">
            {savedAddresses.map((addr, idx) => (
              <div key={idx} className="border border-kraft-200 rounded-lg p-3 text-sm text-ink-700">
                {addr.street}, {addr.city}, {addr.state} - {addr.zipCode}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Order History */}
      <div className="bg-white rounded-2xl border border-kraft-300 p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display font-semibold text-lg text-ink-900">📦 Order History</h2>
          <Link to="/orders" className="text-sm text-leaf-700 hover:underline font-medium">
            View all &rarr;
          </Link>
        </div>
        {loading ? (
          <p className="text-sm text-ink-600">Loading orders...</p>
        ) : orders.length === 0 ? (
          <p className="text-sm text-ink-600">No orders placed yet.</p>
        ) : (
          <div className="space-y-3">
            {orders.slice(0, 3).map((o) => (
              <div key={o._id} className="flex items-center justify-between border border-kraft-200 rounded-lg p-3 text-sm">
                <div>
                  <p className="font-medium text-ink-900">Order #{o._id.slice(-6)}</p>
                  <p className="text-ink-600 text-xs">{o.items?.length} item(s) &middot; ₹{o.totalPrice}</p>
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-kraft-200 text-ink-900">
                  {o.status?.replace(/_/g, ' ')}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}