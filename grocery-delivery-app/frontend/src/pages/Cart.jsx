import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

export default function Cart() {
  const {
    items,
    updateQuantity,
    removeItem,
    clearCart,
    itemsPrice,
    deliveryFee,
    discount,
    totalPrice,
    freeDeliveryThreshold,
    estimatedDeliveryMinutes,
  } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [address, setAddress] = useState({
    street: '',
    city: '',
    state: 'Tamil Nadu',
    zipCode: '',
    phone: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleAddressChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const getEstimatedDeliveryWindow = () => {
    const now = new Date();
    const from = new Date(now.getTime() + estimatedDeliveryMinutes * 60000);
    const to = new Date(now.getTime() + (estimatedDeliveryMinutes + 15) * 60000);
    const fmt = (d) => d.toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit' });
    return `${fmt(from)} - ${fmt(to)}`;
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }

    if (!items || items.length === 0) {
      setError('Your cart is empty.');
      return;
    }

    if (!address.street.trim() || !address.city.trim() || !address.zipCode.trim()) {
      setError('Please fill in all address fields.');
      return;
    }

    try {
      setSubmitting(true);
      setError('');

      const orderPayload = {
        items: items.map((i) => ({
          product: i.productId,
          name: i.name,
          quantity: i.quantity,
          price: i.price,
          image: i.image,
        })),
        shippingAddress: {
          street: address.street,
          city: address.city,
          state: address.state,
          zipCode: address.zipCode,
        },
        paymentMethod: 'Cash on Delivery (COD)',
        itemsPrice,
        deliveryFee,
        discount,
        totalPrice,
      };

      const { data } = await api.post('/orders', orderPayload);
      clearCart();
      navigate('/orders', { state: { newOrderId: data.order?._id } });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to place order. Please try again.');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (!items || items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-20 text-center">
        <span className="text-6xl">🛒</span>
        <h2 className="font-display text-3xl font-bold text-ink-900 mt-4">Your cart is empty</h2>
        <p className="text-ink-600 mt-2">Looks like you haven't added any fresh groceries yet.</p>
        <Link
          to="/"
          className="inline-block mt-6 bg-leaf-700 hover:bg-leaf-600 text-white font-medium px-6 py-2.5 rounded-xl transition-colors"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  const amountLeftForFreeDelivery = Math.max(freeDeliveryThreshold - itemsPrice, 0);
  const progressPercent = Math.min((itemsPrice / freeDeliveryThreshold) * 100, 100);

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <h1 className="font-display text-3xl font-bold text-leaf-900 mb-8">Shopping Cart & Checkout</h1>

      {error && (
        <div className="bg-tomato-600/10 border border-tomato-600 text-tomato-600 px-4 py-3 rounded-xl mb-6 text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Cart Items View */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-2xl border border-kraft-300 p-6 shadow-xs">
            <h2 className="font-display font-semibold text-lg text-ink-900 mb-4">
              Items in Cart ({items.length})
            </h2>

            <div className="divide-y divide-kraft-200">
              {items.map((item) => (
                <div key={item.productId} className="py-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <img
                      src={item.image || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=200'}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg border border-kraft-200"
                    />
                    <div>
                      <h3 className="font-semibold text-ink-900 text-base">{item.name}</h3>
                      <p className="text-xs text-ink-600">₹{item.price} / {item.unit || 'each'}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="flex items-center border border-kraft-300 rounded-lg overflow-hidden bg-kraft-100">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                        className="px-2.5 py-1 text-ink-900 hover:bg-kraft-200 font-bold transition-colors cursor-pointer"
                      >
                        −
                      </button>
                      <span className="px-3 py-1 font-semibold text-sm bg-white min-w-8 text-center">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                        className="px-2.5 py-1 text-ink-900 hover:bg-kraft-200 font-bold transition-colors cursor-pointer"
                      >
                        +
                      </button>
                    </div>

                    <div className="text-right min-w-20">
                      <p className="font-bold text-ink-900">₹{item.price * item.quantity}</p>
                      <button
                        type="button"
                        onClick={() => removeItem(item.productId)}
                        className="text-xs text-tomato-600 hover:underline cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Address and Checkout Summary */}
        <div className="space-y-6">
          {/* Delivery Time Estimate */}
          <div className="bg-leaf-100 border border-leaf-700/30 rounded-2xl p-4 flex items-center gap-3">
            <span className="text-2xl">🚴</span>
            <div>
              <p className="text-sm font-bold text-leaf-900">Estimated Delivery</p>
              <p className="text-xs text-leaf-800">Today, {getEstimatedDeliveryWindow()}</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-kraft-300 p-6 shadow-xs">
            <h2 className="font-display font-semibold text-lg text-ink-900 mb-4">Order Summary</h2>

            {/* Free Delivery Progress Banner */}
            {amountLeftForFreeDelivery > 0 ? (
              <div className="mb-4 p-3 bg-turmeric-100 border border-turmeric-300 rounded-lg text-sm text-ink-900">
                🚚 Add <strong>₹{amountLeftForFreeDelivery}</strong> more for <strong>FREE delivery!</strong>
                <div className="mt-2 h-2 bg-white rounded-full overflow-hidden">
                  <div
                    className="h-full bg-leaf-700 transition-all"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            ) : (
              <div className="mb-4 p-3 bg-leaf-100 border border-leaf-700/30 rounded-lg text-sm text-leaf-900 font-semibold">
                🎉 You've unlocked FREE delivery!
              </div>
            )}

            <div className="space-y-2.5 text-sm text-ink-600">
              <div className="flex justify-between">
                <span>Items Subtotal</span>
                <span className="font-medium text-ink-900">₹{itemsPrice}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Fee</span>
                <span className="font-medium text-ink-900">
                  {deliveryFee === 0 ? <span className="text-leaf-700 font-semibold">FREE</span> : `₹${deliveryFee}`}
                </span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between">
                  <span>Discount</span>
                  <span className="font-medium text-leaf-700">− ₹{discount}</span>
                </div>
              )}
              <div className="border-t border-kraft-200 pt-3 flex justify-between text-base font-bold text-ink-900">
                <span>Total Amount</span>
                <span className="text-leaf-700 text-xl">₹{totalPrice}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-kraft-300 p-6 shadow-xs">
            <h2 className="font-display font-semibold text-lg text-ink-900 mb-4">Delivery Address</h2>

            <form onSubmit={handlePlaceOrder} className="space-y-3 text-sm">
              <div>
                <label className="block text-xs font-medium text-ink-600 mb-1">Street Address</label>
                <input
                  type="text"
                  name="street"
                  required
                  placeholder="Flat 4B, Green Valley Apts"
                  value={address.street}
                  onChange={handleAddressChange}
                  className="w-full px-3 py-2 border border-kraft-300 rounded-lg focus:ring-2 focus:ring-leaf-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-ink-600 mb-1">City</label>
                  <input
                    type="text"
                    name="city"
                    required
                    placeholder="Chennai"
                    value={address.city}
                    onChange={handleAddressChange}
                    className="w-full px-3 py-2 border border-kraft-300 rounded-lg focus:ring-2 focus:ring-leaf-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-ink-600 mb-1">PIN Code</label>
                  <input
                    type="text"
                    name="zipCode"
                    required
                    placeholder="600001"
                    value={address.zipCode}
                    onChange={handleAddressChange}
                    className="w-full px-3 py-2 border border-kraft-300 rounded-lg focus:ring-2 focus:ring-leaf-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-ink-600 mb-1">Contact Phone</label>
                <input
                  type="tel"
                  name="phone"
                  placeholder="9876543210"
                  value={address.phone}
                  onChange={handleAddressChange}
                  className="w-full px-3 py-2 border border-kraft-300 rounded-lg focus:ring-2 focus:ring-leaf-500 focus:outline-none"
                />
              </div>

              {user ? (
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full mt-4 bg-tomato-600 hover:bg-tomato-500 text-white font-bold py-3 rounded-xl transition-colors shadow-sm disabled:opacity-50 cursor-pointer text-base"
                >
                  {submitting ? 'Placing Order...' : `Place Order (COD) • ₹${totalPrice}`}
                </button>
              ) : (
                <Link
                  to="/login"
                  className="block w-full text-center mt-4 bg-leaf-700 hover:bg-leaf-600 text-white font-bold py-3 rounded-xl transition-colors"
                >
                  Log In to Place Order
                </Link>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}