import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

// Default store location coordinates (e.g., Chennai center)
const STORE_LOCATION = { lat: 13.0827, lng: 80.2707 };

// Helper to calculate distance using Haversine formula
function calculateDistanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Helper to estimate delivery time based on distance
function estimateDeliveryTime(distanceKm) {
  const baseMinutes = 15;
  const minutesPerKm = 5;
  const totalMinutes = Math.round(baseMinutes + distanceKm * minutesPerKm);

  const now = new Date();
  const startTime = new Date(now.getTime() + (totalMinutes - 5) * 60000);
  const endTime = new Date(now.getTime() + (totalMinutes + 10) * 60000);

  const formatTime = (date) =>
    date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return `Today, ${formatTime(startTime)} - ${formatTime(endTime)}`;
}

export default function Cart() {
  const { items, updateQuantity, removeFromCart, clearCart, subtotal } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [fetchingLocation, setFetchingLocation] = useState(false);
  const [estimatedTime, setEstimatedTime] = useState('');
  const [coords, setCoords] = useState(null);

  const [address, setAddress] = useState({
    street: '',
    city: 'Chennai',
    postalCode: '',
    phone: '',
  });

  const deliveryFee = subtotal > 300 || items.length === 0 ? 0 : 30;
  const discount = subtotal > 0 ? 5 : 0;
  const totalAmount = Math.max(0, subtotal + deliveryFee - discount);

  // Restore saved location & ETA on mount if present
  useEffect(() => {
    const savedCoords = localStorage.getItem('deliveryCoords');
    const savedEta = localStorage.getItem('estimatedDeliveryTime');
    if (savedCoords) setCoords(JSON.parse(savedCoords));
    if (savedEta) setEstimatedTime(savedEta);
  }, []);

  const handleInputChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const handleUseLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    setFetchingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const userLat = position.coords.latitude;
        const userLng = position.coords.longitude;
        const userCoords = { lat: userLat, lng: userLng };

        const distance = calculateDistanceKm(
          STORE_LOCATION.lat,
          STORE_LOCATION.lng,
          userLat,
          userLng
        );
        const eta = estimateDeliveryTime(distance);

        setCoords(userCoords);
        setEstimatedTime(eta);

        // Store location & ETA in localStorage
        localStorage.setItem('deliveryCoords', JSON.stringify(userCoords));
        localStorage.setItem('estimatedDeliveryTime', eta);

        // Reverse geocode via OpenStreetMap Nominatim
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${userLat}&lon=${userLng}&format=json`
          );
          const data = await res.json();
          if (data && data.address) {
            setAddress((prev) => ({
              ...prev,
              street: data.display_name.split(',')[0] || prev.street,
              city: data.address.city || data.address.town || data.address.suburb || prev.city,
              postalCode: data.address.postcode || prev.postalCode,
            }));
          }
        } catch (err) {
          console.error('Reverse geocoding failed:', err);
        } finally {
          setFetchingLocation(false);
        }
      },
      (error) => {
        setFetchingLocation(false);
        alert('Could not retrieve location. Please grant location permission in your browser.');
      }
    );
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (!user) {
      navigate('/login');
      return;
    }

    if (!address.street || !address.city || !address.phone) {
      alert('Please fill in street address, city, and phone number.');
      return;
    }

    try {
      setLoading(true);

      const savedCoords = coords || JSON.parse(localStorage.getItem('deliveryCoords') || 'null');
      const savedEta = estimatedTime || localStorage.getItem('estimatedDeliveryTime');

      const orderData = {
        items: items.map((item) => ({
          product: item._id,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          image: item.image,
        })),
        shippingAddress: address,
        itemsPrice: subtotal,
        deliveryFee: deliveryFee,
        discount: discount,
        totalPrice: totalAmount,
        deliveryCoords: savedCoords || null,
        estimatedDeliveryTime: savedEta || '',
      };

      const res = await api.post('/orders', orderData);

      if (res.data && res.data.success) {
        clearCart();
        localStorage.removeItem('deliveryCoords');
        localStorage.removeItem('estimatedDeliveryTime');

        const orderId = res.data.order._id;
        navigate(`/order-tracking/${orderId}`);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center py-16">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Shopping Cart is Empty</h2>
        <p className="text-gray-600 mb-6">Looks like you haven't added any fresh groceries yet.</p>
        <Link
          to="/"
          className="bg-emerald-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-emerald-700 transition"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart & Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-semibold mb-4">Items in Cart ({items.length})</h2>
            <div className="divide-y divide-gray-100">
              {items.map((item) => (
                <div key={item._id} className="py-4 flex items-center justify-between gap-4">
                  <img
                    src={item.image || 'https://via.placeholder.com/80'}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800">{item.name}</h3>
                    <p className="text-sm text-gray-500">₹{item.price} / unit</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => updateQuantity(item._id, item.quantity - 1)}
                      className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 font-bold"
                    >
                      -
                    </button>
                    <span className="w-8 text-center font-semibold">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item._id, item.quantity + 1)}
                      className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 font-bold"
                    >
                      +
                    </button>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">₹{item.price * item.quantity}</p>
                    <button
                      onClick={() => removeFromCart(item._id)}
                      className="text-xs text-red-500 hover:underline mt-1"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Checkout Summary & Delivery Address */}
        <div className="space-y-6">
          {/* Estimated Delivery Badge */}
          {estimatedTime && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center space-x-3">
              <span className="text-2xl">🚴</span>
              <div>
                <p className="text-xs font-semibold text-emerald-800 uppercase tracking-wide">
                  Estimated Delivery
                </p>
                <p className="text-sm font-bold text-emerald-950">{estimatedTime}</p>
              </div>
            </div>
          )}

          {/* Order Summary */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

            {subtotal < 300 && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-800 mb-4">
                Add <strong>₹{300 - subtotal}</strong> more for <strong>FREE delivery!</strong>
              </div>
            )}

            <div className="space-y-2 text-sm text-gray-600 mb-4">
              <div className="flex justify-between">
                <span>Items Subtotal</span>
                <span>₹{subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Fee</span>
                <span>{deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}</span>
              </div>
              <div className="flex justify-between text-emerald-600">
                <span>Discount</span>
                <span>-₹{discount}</span>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-3 flex justify-between font-bold text-lg text-gray-900">
              <span>Total Amount</span>
              <span>₹{totalAmount}</span>
            </div>
          </div>

          {/* Delivery Address Form */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Delivery Address</h2>
              <button
                type="button"
                onClick={handleUseLocation}
                disabled={fetchingLocation}
                className="text-xs bg-emerald-100 text-emerald-700 font-semibold px-2.5 py-1.5 rounded-lg hover:bg-emerald-200 transition"
              >
                {fetchingLocation ? 'Fetching...' : '📍 Use my current location'}
              </button>
            </div>

            <form onSubmit={handlePlaceOrder} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Street Address
                </label>
                <input
                  type="text"
                  name="street"
                  required
                  value={address.street}
                  onChange={handleInputChange}
                  placeholder="Flat 4B, Green Valley Apts"
                  className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">City</label>
                  <input
                    type="text"
                    name="city"
                    required
                    value={address.city}
                    onChange={handleInputChange}
                    placeholder="Chennai"
                    className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">PIN Code</label>
                  <input
                    type="text"
                    name="postalCode"
                    value={address.postalCode}
                    onChange={handleInputChange}
                    placeholder="600001"
                    className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Contact Phone
                </label>
                <input
                  type="tel"
                  name="phone"
                  required
                  value={address.phone}
                  onChange={handleInputChange}
                  placeholder="9876543210"
                  className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-4 bg-red-600 text-white font-bold py-3 rounded-lg hover:bg-red-700 transition disabled:opacity-50"
              >
                {loading ? 'Processing Order...' : `Place Order (COD) • ₹${totalAmount}`}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}