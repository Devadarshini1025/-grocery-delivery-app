import { useEffect, useState } from "react";
import { getCurrentLocation, reverseGeocode } from "../utils/location";

// Mount this ONCE near the top of App.jsx (outside <Routes>, alongside Navbar).
// It checks localStorage first — if we already have a saved location, it does
// nothing. Otherwise it asks for permission once per browser (not every page load).
export default function LocationPrompt() {
  const [status, setStatus] = useState("idle"); // idle | asking | done | denied

  useEffect(() => {
    const saved = localStorage.getItem("savedDeliveryLocation");
    if (saved) return; // already have it, don't ask again

    async function requestLocation() {
      setStatus("asking");
      try {
        const { lat, lng } = await getCurrentLocation();
        const address = await reverseGeocode(lat, lng);
        localStorage.setItem(
          "savedDeliveryLocation",
          JSON.stringify({ lat, lng, address })
        );
        setStatus("done");
      } catch (err) {
        setStatus("denied");
      }
    }

    requestLocation();
  }, []);

  // This component renders nothing visible — it just silently captures location
  // in the background and saves it for checkout to reuse.
  return null;
}