import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const { totalCount } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-kraft-100 border-b border-kraft-300 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="font-display text-2xl text-leaf-700 font-bold flex items-center gap-2">
          <span>🌿</span> FreshCart
        </Link>

        <nav className="flex items-center space-x-5">
          <Link to="/" className="text-ink-600 hover:text-leaf-700 transition-colors text-sm font-medium">
            Shop
          </Link>

          {user && (
            <Link to="/orders" className="text-ink-600 hover:text-leaf-700 transition-colors text-sm font-medium">
              My Orders
            </Link>
          )}

          {isAdmin && (
            <Link
              to="/admin"
              className="text-tomato-600 hover:text-tomato-500 transition-colors text-sm font-semibold"
            >
              🛠️ Admin Panel
            </Link>
          )}

          {/* Cart Button with Count Badge */}
          <Link
            to="/cart"
            className="relative flex items-center gap-1.5 bg-white border border-kraft-300 hover:border-leaf-500 px-3 py-1.5 rounded-lg text-ink-900 transition-colors text-sm font-medium"
          >
            <span>🛒 Cart</span>
            {totalCount > 0 && (
              <span className="bg-tomato-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {totalCount}
              </span>
            )}
          </Link>

          {user ? (
            <div className="flex items-center space-x-3 pl-2 border-l border-kraft-300">
              <span className="text-sm font-medium text-leaf-900">Hi, {user.name}</span>
              <button
                onClick={handleLogout}
                className="bg-tomato-600 hover:bg-tomato-500 text-white px-3 py-1 rounded transition-colors text-xs font-medium cursor-pointer"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-3 pl-2 border-l border-kraft-300">
              <Link
                to="/login"
                className="text-ink-600 hover:text-leaf-700 transition-colors text-sm font-medium"
              >
                Log in
              </Link>
              <Link
                to="/register"
                className="bg-leaf-700 hover:bg-leaf-600 text-white px-3.5 py-1.5 rounded transition-colors text-sm font-medium"
              >
                Sign up
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}