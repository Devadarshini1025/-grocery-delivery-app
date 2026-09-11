import { Routes, Route, useParams } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Cart from './pages/Cart';
import Orders from './pages/Orders';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';
import AdminLogin from './pages/AdminLogin';
import AdminRoute from './components/AdminRoute';

// New Feature Imports
import Support from "./pages/Support";
import DeliveryLogin from "./pages/delivery/DeliveryLogin";
import DeliveryDashboard from "./pages/delivery/DeliveryDashboard";
import DeliveryTracking from "./pages/delivery/DeliveryTracking";
import OrderTracking from "./pages/OrderTracking";

// ⬇️ PASTE THE WRAPPERS HERE (Above function App) ⬇️
function DeliveryTrackingWrapper() {
  const { orderId } = useParams();
  return <DeliveryTracking orderId={orderId} />;
}

function OrderTrackingWrapper() {
  const { orderId } = useParams();
  return <OrderTracking orderId={orderId} />;
}

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* New Feature Routes */}
          <Route path="/support" element={<Support />} />
          <Route path="/delivery/login" element={<DeliveryLogin />} />
          <Route path="/delivery/dashboard" element={<DeliveryDashboard />} />
          <Route path="/delivery/tracking/:orderId" element={<DeliveryTrackingWrapper />} />
          <Route path="/order-tracking/:orderId" element={<OrderTrackingWrapper />} />

          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;