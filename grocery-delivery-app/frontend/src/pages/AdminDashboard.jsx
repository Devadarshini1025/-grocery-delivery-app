import { useState, useEffect } from 'react';
import api from '../api/axios';

const CATEGORIES = [
  'fruits', 'vegetables', 'dairy', 'bakery', 'meat', 'beverages', 'snacks',
  'rice_atta_dals', 'masalas_spices', 'oils_ghee', 'frozen_food',
  'cleaning', 'personal_care', 'baby_care', 'household', 'other',
];
const STATUSES = ['pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'];

const emptyForm = {
  name: '',
  description: '',
  category: 'fruits',
  price: '',
  unit: 'kg',
  stock: '',
  image: '',
  rating: '',
};

export default function AdminDashboard() {
  const [tab, setTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState('');

  const loadProducts = async () => {
    const { data } = await api.get('/products?limit=100');
    setProducts(data.products);
  };

  const loadOrders = async () => {
    const { data } = await api.get('/orders');
    setOrders(data.orders);
  };

  useEffect(() => {
    setLoading(true);
    Promise.all([loadProducts(), loadOrders()]).finally(() => setLoading(false));
  }, []);

  const handleFormChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    const payload = {
      ...form,
      price: Number(form.price),
      stock: Number(form.stock),
      rating: form.rating === '' ? 0 : Number(form.rating),
    };
    try {
      if (editingId) {
        await api.put(`/products/${editingId}`, payload);
        setMessage('Product updated.');
      } else {
        await api.post('/products', payload);
        setMessage('Product added.');
      }
      resetForm();
      loadProducts();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Something went wrong.');
    }
  };

  const startEdit = (product) => {
    setEditingId(product._id);
    setForm({
      name: product.name,
      description: product.description,
      category: product.category,
      price: product.price,
      unit: product.unit,
      stock: product.stock,
      image: product.image || '',
      rating: product.rating ?? '',
    });
    setTab('products');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this product?')) return;
    await api.delete(`/products/${id}`);
    loadProducts();
  };

  const handleStatusChange = async (orderId, status) => {
    await api.put(`/orders/${orderId}/status`, { status });
    loadOrders();
  };

  if (loading) {
    return <div className="max-w-6xl mx-auto px-6 py-20 text-center text-ink-600">Loading admin panel...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <h1 className="font-display text-4xl text-leaf-700 mb-8">Admin Dashboard</h1>

      <div className="flex gap-6 border-b border-kraft-300 mb-8">
        <button
          onClick={() => setTab('products')}
          className={`pb-3 px-1 font-medium ${tab === 'products' ? 'border-b-2 border-tomato-600 text-leaf-700' : 'text-ink-600'}`}
        >
          Products
        </button>
        <button
          onClick={() => setTab('orders')}
          className={`pb-3 px-1 font-medium ${tab === 'orders' ? 'border-b-2 border-tomato-600 text-leaf-700' : 'text-ink-600'}`}
        >
          Orders
        </button>
      </div>

      {tab === 'products' && (
        <div className="grid md:grid-cols-3 gap-8">
          <form onSubmit={handleSubmit} className="md:col-span-1 bg-white rounded-lg p-5 space-y-3 h-fit">
            <h2 className="font-display text-xl text-leaf-700">{editingId ? 'Edit product' : 'Add product'}</h2>
            <input
              name="name" placeholder="Name" required value={form.name} onChange={handleFormChange}
              className="w-full border border-kraft-300 rounded px-3 py-2 text-sm"
            />
            <textarea
              name="description" placeholder="Description" required value={form.description} onChange={handleFormChange}
              className="w-full border border-kraft-300 rounded px-3 py-2 text-sm" rows={2}
            />
            <input
              name="image" placeholder="Image URL" value={form.image} onChange={handleFormChange}
              className="w-full border border-kraft-300 rounded px-3 py-2 text-sm"
            />
            {form.image && (
              <img
                src={form.image}
                alt="Preview"
                className="w-full h-32 object-cover rounded border border-kraft-300"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
            )}
            <select name="category" value={form.category} onChange={handleFormChange} className="w-full border border-kraft-300 rounded px-3 py-2 text-sm">
              {CATEGORIES.map((c) => <option key={c} value={c}>{c.replace(/_/g, ' ')}</option>)}
            </select>
            <div className="flex gap-2">
              <input
                name="price" type="number" step="0.01" placeholder="Price" required value={form.price} onChange={handleFormChange}
                className="w-full border border-kraft-300 rounded px-3 py-2 text-sm"
              />
              <input
                name="unit" placeholder="Unit (kg, pack...)" required value={form.unit} onChange={handleFormChange}
                className="w-full border border-kraft-300 rounded px-3 py-2 text-sm"
              />
            </div>
            <div className="flex gap-2">
              <input
                name="stock" type="number" placeholder="Stock" required value={form.stock} onChange={handleFormChange}
                className="w-full border border-kraft-300 rounded px-3 py-2 text-sm"
              />
              <input
                name="rating" type="number" step="0.1" min="0" max="5" placeholder="Rating (0-5)" value={form.rating} onChange={handleFormChange}
                className="w-full border border-kraft-300 rounded px-3 py-2 text-sm"
              />
            </div>
            {message && <p className="text-sm text-leaf-700">{message}</p>}
            <div className="flex gap-2">
              <button type="submit" className="flex-1 bg-tomato-600 hover:bg-tomato-500 text-white py-2 rounded text-sm font-medium">
                {editingId ? 'Save changes' : 'Add product'}
              </button>
              {editingId && (
                <button type="button" onClick={resetForm} className="px-3 py-2 border border-kraft-300 rounded text-sm">
                  Cancel
                </button>
              )}
            </div>
          </form>

          <div className="md:col-span-2 space-y-2">
            {products.map((p) => (
              <div key={p._id} className="bg-white rounded-lg p-4 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img
                    src={p.image || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=100'}
                    alt={p.name}
                    className="w-12 h-12 object-cover rounded border border-kraft-200"
                  />
                  <div>
                    <p className="font-medium">{p.name}</p>
                    <p className="text-sm text-ink-600">
                      ₹{p.price} / {p.unit} &middot; {p.stock} in stock &middot; {p.category} &middot; ⭐ {p.rating || 0}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2 text-sm">
                  <button onClick={() => startEdit(p)} className="px-3 py-1.5 border border-kraft-300 rounded">Edit</button>
                  <button onClick={() => handleDelete(p._id)} className="px-3 py-1.5 border border-tomato-600 text-tomato-600 rounded">Delete</button>
                </div>
              </div>
            ))}
            {products.length === 0 && <p className="text-ink-600 text-sm">No products yet.</p>}
          </div>
        </div>
      )}

      {tab === 'orders' && (
        <div className="space-y-4">
          {orders.map((o) => (
            <div key={o._id} className="bg-white rounded-lg p-5">
              <div className="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-kraft-200">
                <div>
                  <p className="font-medium">Order #{o._id.slice(-6)} &mdash; {o.user?.name}</p>
                  <p className="text-sm text-ink-600">
                    ₹{o.totalPrice.toFixed(2)} &middot; {o.paymentMethod.toUpperCase()}
                  </p>
                </div>
                <select
                  value={o.status}
                  onChange={(e) => handleStatusChange(o._id, e.target.value)}
                  className="border border-kraft-300 rounded px-3 py-1.5 text-sm"
                >
                  {STATUSES.map((s) => <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>)}
                </select>
              </div>

              <div className="py-3 divide-y divide-kraft-100">
                {o.items?.map((item, idx) => (
                  <div key={idx} className="py-2 flex items-center justify-between text-sm">
                    <div className="flex items-center gap-3">
                      {item.image && (
                        <img src={item.image} alt={item.name} className="w-10 h-10 object-cover rounded border border-kraft-200" />
                      )}
                      <span className="font-medium">{item.name}</span>
                      <span className="text-ink-600">× {item.quantity}</span>
                    </div>
                    <span className="font-semibold">₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>

              {o.shippingAddress && (
                <div className="pt-2 border-t border-kraft-200 text-xs text-ink-600">
                  <span className="font-semibold text-ink-900">Deliver to: </span>
                  {o.shippingAddress.street}, {o.shippingAddress.city}, {o.shippingAddress.zipCode}
                </div>
              )}
            </div>
          ))}
          {orders.length === 0 && <p className="text-ink-600 text-sm">No orders yet.</p>}
        </div>
      )}
    </div>
  );
}