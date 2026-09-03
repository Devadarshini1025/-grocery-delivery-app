import { useState, useEffect } from 'react';
import api from '../api/axios';

const CATEGORIES = ['fruits', 'vegetables', 'dairy', 'bakery', 'meat', 'beverages', 'snacks', 'household', 'other'];
const STATUSES = ['pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'];

export default function AdminDashboard() {
  const [tab, setTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: '', description: '', category: 'fruits', price: '', unit: 'kg', stock: '' });
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
    setForm({ name: '', description: '', category: 'fruits', price: '', unit: 'kg', stock: '' });
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    const payload = { ...form, price: Number(form.price), stock: Number(form.stock) };
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
            <select name="category" value={form.category} onChange={handleFormChange} className="w-full border border-kraft-300 rounded px-3 py-2 text-sm">
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
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
            <input
              name="stock" type="number" placeholder="Stock" required value={form.stock} onChange={handleFormChange}
              className="w-full border border-kraft-300 rounded px-3 py-2 text-sm"
            />
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
              <div key={p._id} className="bg-white rounded-lg p-4 flex items-center justify-between">
                <div>
                  <p className="font-medium">{p.name}</p>
                  <p className="text-sm text-ink-600">${p.price} / {p.unit} &middot; {p.stock} in stock &middot; {p.category}</p>
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
        <div className="space-y-3">
          {orders.map((o) => (
            <div key={o._id} className="bg-white rounded-lg p-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <p className="font-medium">Order #{o._id.slice(-6)} &mdash; {o.user?.name}</p>
                  <p className="text-sm text-ink-600">
                    {o.items.length} item(s) &middot; ${o.totalPrice.toFixed(2)} &middot; {o.paymentMethod.toUpperCase()}
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
            </div>
          ))}
          {orders.length === 0 && <p className="text-ink-600 text-sm">No orders yet.</p>}
        </div>
      )}
    </div>
  );
}