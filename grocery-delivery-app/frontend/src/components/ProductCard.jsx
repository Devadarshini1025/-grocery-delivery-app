import { useCart } from '../context/CartContext';

export default function ProductCard({ product }) {
  const { items = [], addItem, updateQuantity } = useCart();

  if (!product) return null; // Prevent crashes if product prop is missing or undefined

  const cartItem = items?.find((i) => i.productId === product._id);
  const currentQuantity = cartItem ? cartItem.quantity : 0;

  return (
    <div className="bg-white rounded-xl border border-kraft-300 overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between">
      <div>
        <div className="relative h-48 w-full bg-kraft-100 overflow-hidden">
          <img
            src={product.image || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=500'}
            alt={product.name || 'Product'}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
          {product.category && (
            <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-xs text-leaf-700 text-xs font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider border border-kraft-200">
              {product.category}
            </span>
          )}
        </div>

        <div className="p-4">
          <h3 className="font-display font-semibold text-lg text-ink-900 line-clamp-1">
            {product.name || 'Unnamed Product'}
          </h3>
          <p className="text-xs text-ink-600 mt-1 line-clamp-2">
            {product.description || ''}
          </p>

          <div className="mt-3 flex items-center justify-between">
            <div>
              <span className="text-xl font-bold text-leaf-700">₹{product.price ?? 0}</span>
              <span className="text-xs text-ink-600 ml-1">/ {product.unit || 'each'}</span>
            </div>
            {typeof product.rating === 'number' && product.rating > 0 && (
              <div className="flex items-center text-xs text-turmeric-500 font-medium">
                <span>★ {product.rating.toFixed(1)}</span>
                <span className="text-ink-600 ml-1">({product.numReviews || 0})</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="p-4 pt-0">
        {currentQuantity === 0 ? (
          <button
            onClick={() => addItem && addItem(product, 1)}
            className="w-full bg-leaf-700 hover:bg-leaf-600 text-white py-2 rounded-lg font-medium text-sm transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>+ Add to Cart</span>
          </button>
        ) : (
          <div className="flex items-center justify-between border border-leaf-700 bg-leaf-100 rounded-lg p-1">
            <button
              onClick={() => updateQuantity && updateQuantity(product._id, currentQuantity - 1)}
              className="w-8 h-8 flex items-center justify-center bg-white text-leaf-700 rounded-md font-bold hover:bg-leaf-200 transition-colors cursor-pointer"
              aria-label="Decrease quantity"
            >
              −
            </button>
            <span className="font-semibold text-sm text-leaf-900">{currentQuantity} in cart</span>
            <button
              onClick={() => updateQuantity && updateQuantity(product._id, currentQuantity + 1)}
              className="w-8 h-8 flex items-center justify-center bg-leaf-700 text-white rounded-md font-bold hover:bg-leaf-600 transition-colors cursor-pointer"
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

