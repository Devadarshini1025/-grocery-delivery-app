import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function DeliveryDashboard() {
  const [orders, setOrders] = useState([]);
  const token = localStorage.getItem("deliveryToken");
  const navigate = useNavigate();

  async function fetchOrders() {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/delivery/my-orders`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await res.json();
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load orders:", err);
      setOrders([]);
    }
  }

  useEffect(() => {
    fetchOrders();
  }, []);

  async function updateStatus(orderId, status) {
    await fetch(
      `${import.meta.env.VITE_API_URL}/delivery/orders/${orderId}/status`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      }
    );
    fetchOrders();
  }

  return (
    <div className="max-w-2xl mx-auto mt-8 space-y-4">
      <h1 className="text-xl font-semibold">Your Deliveries</h1>
      {orders.length === 0 && (
        <p className="text-sm text-gray-500">No assigned orders.</p>
      )}
      {orders.map((order) => (
        <div key={order._id} className="border rounded-lg p-4 space-y-2">
          <p className="text-sm font-medium">Order #{order._id.slice(-6)}</p>
          <p className="text-sm text-gray-600">
            Address: {order.deliveryAddress}
          </p>
          <p className="text-sm">
            Status: <span className="font-medium">{order.status}</span>
          </p>
          <div className="flex gap-2">
            {order.status === "confirmed" && (
              <button
                onClick={() => updateStatus(order._id, "out-for-delivery")}
                className="text-xs px-3 py-1 rounded-md bg-orange-500 text-white"
              >
                Start Delivery
              </button>
            )}
            {order.status === "out-for-delivery" && (
              <>
                <button
                  onClick={() => navigate(`/delivery/tracking/${order._id}`)}
                  className="text-xs px-3 py-1 rounded-md bg-blue-600 text-white"
                >
                  Share Live Location
                </button>
                <button
                  onClick={() => updateStatus(order._id, "delivered")}
                  className="text-xs px-3 py-1 rounded-md bg-green-600 text-white"
                >
                  Mark Delivered
                </button>
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}