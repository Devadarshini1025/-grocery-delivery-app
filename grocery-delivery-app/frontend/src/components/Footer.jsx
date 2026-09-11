import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-leaf-900 text-kraft-200 mt-20">
      <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col sm:flex-row justify-between gap-6 text-sm">
        <div>
          <p className="font-display text-xl text-white mb-2">🌿 FreshCart</p>
          <p className="text-kraft-300 max-w-xs">
            Fresh groceries from local stalls, delivered to your door same day.
          </p>
        </div>
        <div className="text-kraft-300 space-y-1">
          <p>Open 24/7</p>
          <p>support@freshcart.example</p>
          {/* Support and Delivery Partner Links */}
          <div className="pt-2 flex items-center gap-3 text-xs text-kraft-300">
            <Link to="/support" className="hover:text-white hover:underline transition-colors">
              Customer Support
            </Link>
            <span>&bull;</span>
            <Link to="/delivery/login" className="text-tomato-400 hover:text-tomato-300 hover:underline transition-colors font-medium">
              Delivery Partner Login
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}