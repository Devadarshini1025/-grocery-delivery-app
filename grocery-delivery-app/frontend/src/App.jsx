import { Routes, Route, useParams, useLocation } from 'react-router-dom';
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

// Delivery & Feature Imports
import Support from "./pages/Support";
import DeliveryLogin from "./pages/delivery/DeliveryLogin";
import DeliveryDashboard from "./pages/delivery/DeliveryDashboard";
import DeliveryTracking from "./pages/delivery/DeliveryTracking";
import OrderTracking from "./pages/OrderTracking";
import DeliveryHeader from "./components/delivery/DeliveryHeader";
import DeliveryRoute from "./components/delivery/DeliveryRoute";
import LocationPrompt from "./components/LocationPrompt";

function DeliveryTrackingWrapper() {
  const { orderId } = useParams();
  return <DeliveryTracking orderId={orderId} />;
}

function OrderTrackingWrapper() {
  const { orderId } = useParams();
  return <OrderTracking orderId={orderId} />;
}

function App() {
  const location = useLocation();
  const isDeliveryRoute = location.pathname.startsWith("/delivery");

  return (
    <div className="min-h-screen flex flex-col">
      <LocationPrompt />
      {isDeliveryRoute ? <DeliveryHeader /> : <Navbar />}
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* Customer Support & Tracking Routes */}
          <Route path="/support" element={<Support />} />
          <Route path="/order-tracking/:orderId" element={<OrderTrackingWrapper />} />

          {/* Delivery Partner Routes */}
          <Route path="/delivery/login" element={<DeliveryLogin />} />
          <Route
            path="/delivery/dashboard"
            element={
              <DeliveryRoute>
                <DeliveryDashboard />
              </DeliveryRoute>
            }
          />
          <Route
            path="/delivery/tracking/:orderId"
            element={
              <DeliveryRoute>
                <DeliveryTrackingWrapper />
              </DeliveryRoute>
            }
          />

          {/* Admin Routes */}
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
      {!isDeliveryRoute && <Footer />}
    </div>
  );
}

export default App;