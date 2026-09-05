import { useState, useEffect, useRef } from 'react';
import api from '../api/axios';
import ProductCard from '../components/ProductCard';

const CATEGORIES = [
  { id: 'all', label: 'All Items', emoji: '🧺', image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=300' },
  { id: 'fruits', label: 'Fruits', emoji: '🍎', image: 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=300' },
  { id: 'vegetables', label: 'Vegetables', emoji: '🥦', image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=300' },
  { id: 'dairy', label: 'Dairy & Eggs', emoji: '🥛', image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=300' },
  { id: 'bakery', label: 'Bakery', emoji: '🍞', image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=300' },
  { id: 'meat', label: 'Meat & Fish', emoji: '🍗', image: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=300' },
  { id: 'beverages', label: 'Beverages', emoji: '🧃', image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=300' },
  { id: 'snacks', label: 'Snacks', emoji: '🥜', image: 'https://images.unsplash.com/photo-1600952841320-db92ec4047ca?w=300' },
  { id: 'rice_atta_dals', label: 'Rice, Atta & Dals', emoji: '🌾', image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=300' },
  { id: 'masalas_spices', label: 'Masalas & Spices', emoji: '🌶️', image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=300' },
  { id: 'oils_ghee', label: 'Oils & Ghee', emoji: '🫙', image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=300' },
  { id: 'frozen_food', label: 'Frozen Food', emoji: '🧊', image: 'https://images.unsplash.com/photo-1518843025966-a35d20f5c6d6?w=300' },
  { id: 'cleaning', label: 'Cleaning Essentials', emoji: '🧹', image: 'https://images.unsplash.com/photo-1563453392212-326f5e854473?w=300' },
  { id: 'personal_care', label: 'Personal Care', emoji: '🧴', image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=300' },
  { id: 'baby_care', label: 'Baby Care', emoji: '🍼', image: 'https://images.unsplash.com/photo-1522771930-78848d9293e8?w=300' },
  { id: 'household', label: 'Household', emoji: '🏠', image: 'https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=300' },
];

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const productsRef = useRef(null);

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

  const handleCategoryClick = (catId) => {
    setSelectedCategory(catId);
    productsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      {/* Hero Banner */}
      <div className="bg-linear-to-r from-leaf-700 to-leaf-900 text-white rounded-2xl p-8 md:p-12 mb-10 shadow-sm relative overflow-hidden">
        <div className="max-w-xl relative z-10">
          <span className="bg-leaf-500/40 text-leaf-100 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
            Fast Local Delivery • Cash on Delivery • Free Delivery above ₹299
          </span>
          <h1 className="font-display text-4xl md:text-5xl font-bold mt-4 leading-tight">
            Fresh groceries from farm to your door
          </h1>
          <p className="mt-3 text-leaf-100 text-base">
            Hand-picked organic fruits, farm-fresh vegetables, artisan bakery, and daily essentials. Pay conveniently in cash upon delivery!
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md mb-8">
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

      {/* Category Tiles Grid (BigBasket/Zepto style) */}
      <div className="mb-10">
        <h2 className="font-display text-2xl font-bold text-leaf-900 mb-4">Shop by Category</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategoryClick(cat.id)}
              className={`group bg-white rounded-xl border overflow-hidden text-left transition-all hover:shadow-md cursor-pointer ${
                selectedCategory === cat.id ? 'border-leaf-700 ring-2 ring-leaf-500' : 'border-kraft-300'
              }`}
            >
              <div className="h-24 overflow-hidden bg-kraft-100">
                <img
                  src={cat.image}
                  alt={cat.label}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              </div>
              <div className="p-3">
                <p className="text-sm font-semibold text-ink-900">{cat.emoji} {cat.label}</p>
              </div>
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
      <div ref={productsRef}>
        <h2 className="font-display text-2xl font-bold text-leaf-900 mb-4">
          {selectedCategory === 'all' ? 'All Products' : CATEGORIES.find((c) => c.id === selectedCategory)?.label}
        </h2>

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
    </div>
  );
}