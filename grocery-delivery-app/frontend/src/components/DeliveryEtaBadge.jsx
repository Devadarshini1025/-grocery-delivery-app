import { calculateDistanceKm, estimateDeliveryTime, STORE_LOCATION } from "../utils/location";

export default function DeliveryEtaBadge({ customerCoords }) {
  if (!customerCoords) return null;

  const distance = calculateDistanceKm(
    STORE_LOCATION.lat,
    STORE_LOCATION.lng,
    customerCoords.lat,
    customerCoords.lng
  );
  const eta = estimateDeliveryTime(distance);

  return (
    <div className="inline-flex items-center gap-2 rounded-full bg-orange-50 px-4 py-2 text-sm text-orange-700 font-medium">
      🕒 Estimated delivery: {eta}
    </div>
  );
}