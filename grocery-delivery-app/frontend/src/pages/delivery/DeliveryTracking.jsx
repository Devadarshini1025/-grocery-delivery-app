import { useEffect } from "react";
import { io } from "socket.io-client";

const socket = io(import.meta.env.VITE_API_URL.replace("/api", ""));

export default function DeliveryTracking({ orderId }) {
  useEffect(() => {
    socket.emit("join-order-room", orderId);

    const interval = setInterval(() => {
      navigator.geolocation.getCurrentPosition((position) => {
        socket.emit("send-location", {
          orderId,
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [orderId]);

  return <div className="p-3 bg-blue-100 text-blue-900 rounded font-medium">Sharing live location for order delivery...</div>;
}