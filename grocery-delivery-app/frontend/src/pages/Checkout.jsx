import { useState } from "react";
import { getCurrentLocation, reverseGeocode, calculateDistanceKm, estimateDeliveryTime } from "../utils/location";

const STORE_LOCATION = { lat: 13.0827, lng: 80.2707 };

export default function LocationCheckout() {
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [deliveryCoords, setDeliveryCoords] = useState(null);
  const [estimatedTime, setEstimatedTime] = useState("");
  const [loading, setLoading] = useState(false);

  const handleUseCurrentLocation = async () => {
    try {
      setLoading(true);
      const { lat, lng } = await getCurrentLocation();
      const address = await reverseGeocode(lat, lng);
      const distance = calculateDistanceKm(STORE_LOCATION.lat, STORE_LOCATION.lng, lat, lng);
      const eta = estimateDeliveryTime(distance);

      setDeliveryAddress(address);
      setDeliveryCoords({ lat, lng });
      setEstimatedTime(eta);
    } catch (err) {
      alert("Couldn't get your location. Please enter manually.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded max-w-md my-4">
      <button
        type="button"
        onClick={handleUseCurrentLocation}
        className="bg-green-600 text-white px-3 py-2 rounded text-sm font-semibold"
      >
        {loading ? "Fetching location..." : "📍 Use my current location"}
      </button>

      {deliveryAddress && (
        <div className="mt-3 text-sm space-y-1">
          <p><strong>Address:</strong> {deliveryAddress}</p>
          <p className="text-green-700 font-bold"><strong>ETA:</strong> {estimatedTime}</p>
        </div>
      )}
    </div>
  );
}