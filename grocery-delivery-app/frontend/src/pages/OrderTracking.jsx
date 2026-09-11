import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const socket = io(import.meta.env.VITE_API_URL.replace("/api", ""));

export default function OrderTracking({ orderId }) {
  const [driverLocation, setDriverLocation] = useState(null);

  useEffect(() => {
    socket.emit("join-order-room", orderId);

    socket.on("receive-location", ({ lat, lng }) => {
      setDriverLocation({ lat, lng });
    });

    return () => socket.off("receive-location");
  }, [orderId]);

  if (!driverLocation) {
    return <p className="p-4">Waiting for delivery partner location update...</p>;
  }

  return (
    <div className="w-full h-80 my-4 border rounded overflow-hidden">
      <MapContainer
        center={[driverLocation.lat, driverLocation.lng]}
        zoom={15}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <Marker position={[driverLocation.lat, driverLocation.lng]}>
          <Popup>Delivery Partner is here</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}