import { useState, useEffect } from 'react';
import api from '../api/axios';
import ProductCard from '../components/ProductCard';

const CATEGORIES = ['all', 'fruits', 'vegetables', 'dairy', 'bakery', 'meat', 'beverages', 'snacks', 'household', 'other'];

export default function Shop() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('all');
  const [keyword, setKeyword] = useState('');

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams({ limit: '24' });
    if (category !== 'all') params.set('category', category);
    if (keyword) params.set('keyword', keyword);

    api
      .get(`/products?${params.toString()}`)
      .then(({ data }) => setProducts(data.products))
      .finally(() => setLoading(false));
  }, [category, keyword]);

  return (
    <div>
      <section className="bg-leaf-700 text-kraft-100">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <h1 className="font-display text-5xl">Fresh groceries, delivered</h1>
          <p className="mt-3 text-kraft-200 max-w-md">
            Locally sourced produce and pantry staples, picked this morning.
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <input
            type="text"
            placeholder="Search for bananas, milk, bread..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="flex-1 border border-kraft-300 rounded px-4 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-leaf-500"
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="border border-kraft-300 rounded px-4 py-2 bg-white"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c === 'all' ? 'All categories' : c}
              </option>
            ))}
          </select>
        </div>

        {loading ? (
          <p className="text-ink-600 text-center py-16">Loading products...</p>
        ) : products.length === 0 ? (
          <p className="text-ink-600 text-center py-16">No products found. Try a different search or category.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {products.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}