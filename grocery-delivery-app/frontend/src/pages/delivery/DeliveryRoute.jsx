import { Navigate } from "react-router-dom";

export default function DeliveryRoute({ children }) {
  const deliveryToken = localStorage.getItem("deliveryToken");

  if (!deliveryToken) {
    return <Navigate to="/delivery/login" replace />;
  }

  return children;
}