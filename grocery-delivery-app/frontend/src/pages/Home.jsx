import { useState, useEffect } from 'react';
import api from '../api/axios';
import ProductCard from '../components/ProductCard';

const CATEGORIES = [
  { id: 'all', label: 'All Items' },
  { id: 'fruits', label: '🍎 Fruits' },
  { id: 'vegetables', label: '🥦 Vegetables' },
  { id: 'dairy', label: '🥛 Dairy & Eggs' },
  { id: 'bakery', label: '🍞 Bakery' },
  { id: 'beverages', label: '🧃 Beverages' },
  { id: 'snacks', label: '🥜 Snacks' },
];

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, searchTerm]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = {};
      if (selectedCategory !== 'all') {
        params.category = selectedCategory;
      }
      if (searchTerm.trim()) {
        params.keyword = searchTerm.trim();
      }

      const { data } = await api.get('/products', { params });
      const items = Array.isArray(data) ? data : data?.products || [];
      setProducts(items);
      setError('');
    } catch (err) {
      setError('Failed to load groceries. Please ensure the backend is running.');
      setProducts([]);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      {/* Hero Banner */}
      <div className="bg-linear-to-r from-leaf-700 to-leaf-900 text-white rounded-2xl p-8 md:p-12 mb-10 shadow-sm relative overflow-hidden">
        <div className="max-w-xl relative z-10">
          <span className="bg-leaf-500/40 text-leaf-100 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
            Fast Local Delivery • Cash on Delivery
          </span>
          <h1 className="font-display text-4xl md:text-5xl font-bold mt-4 leading-tight">
            Fresh groceries from farm to your door
          </h1>
          <p className="mt-3 text-leaf-100 text-base">
            Hand-picked organic fruits, farm-fresh vegetables, artisan bakery, and daily essentials. Pay conveniently in cash upon delivery!
          </p>
        </div>
      </div>

      {/* Search & Category Filter Section */}
      <div className="space-y-6 mb-8">
        {/* Search Bar */}
        <div className="relative max-w-md">
          <input
            type="text"
            placeholder="Search groceries (e.g., Bananas, Milk, Bread)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-kraft-300 rounded-xl text-sm text-ink-900 focus:outline-none focus:ring-2 focus:ring-leaf-500"
          />
          <span className="absolute left-3.5 top-3 text-ink-600 text-sm">🔍</span>
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-2.5 text-xs text-ink-600 hover:text-ink-900 bg-kraft-200 px-1.5 py-0.5 rounded cursor-pointer"
            >
              ✕
            </button>
          )}
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-leaf-700 text-white shadow-xs'
                  : 'bg-white text-ink-600 border border-kraft-300 hover:border-leaf-500 hover:text-leaf-700'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="bg-tomato-600/10 border border-tomato-600 text-tomato-600 px-4 py-3 rounded-xl mb-6 text-sm">
          {error}
        </div>
      )}

      {/* Products Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, idx) => (
            <div key={idx} className="bg-white rounded-xl border border-kraft-200 p-4 h-72 animate-pulse flex flex-col justify-between">
              <div className="h-40 bg-kraft-200 rounded-lg w-full mb-3" />
              <div className="h-4 bg-kraft-200 rounded w-3/4 mb-2" />
              <div className="h-4 bg-kraft-200 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : (!products || products.length === 0) ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-kraft-300">
          <span className="text-5xl">🧺</span>
          <h3 className="font-display font-semibold text-xl text-ink-900 mt-4">No products found</h3>
          <p className="text-sm text-ink-600 mt-1">Try selecting another category or clearing your search term.</p>
          <button
            onClick={() => {
              setSelectedCategory('all');
              setSearchTerm('');
            }}
            className="mt-4 bg-leaf-700 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-leaf-600 cursor-pointer"
          >
            Show All Groceries
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products?.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}