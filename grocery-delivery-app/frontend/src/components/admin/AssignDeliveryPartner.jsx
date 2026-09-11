import { useEffect, useState } from "react";

export default function AssignDeliveryPartner({ orderId, currentPartnerId, onAssigned }) {
  const [partners, setPartners] = useState([]);
  const [selectedPartner, setSelectedPartner] = useState(currentPartnerId || "");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("adminToken") || localStorage.getItem("token");
    fetch(`${import.meta.env.VITE_API_URL}/admin/delivery-partners`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setPartners(data))
      .catch((err) => console.error("Error fetching partners:", err));
  }, []);

  const handleAssign = async () => {
    if (!selectedPartner) return;
    setLoading(true);

    const token = localStorage.getItem("adminToken") || localStorage.getItem("token");
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/admin/orders/${orderId}/assign`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ deliveryPartnerId: selectedPartner }),
      });

      if (res.ok) {
        if (onAssigned) onAssigned(); // Refetches orders in AdminDashboard
      }
    } catch (err) {
      alert("Failed to assign partner.");
    } font-medium disabled:opacity-50 finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-2 my-2">
      <select
        value={selectedPartner}
        onChange={(e) => setSelectedPartner(e.target.value)}
        className="border rounded p-1 text-xs bg-white"
      >
        <option value="">Select Delivery Partner</option>
        {partners.map((partner) => (
          <option key={partner._id} value={partner._id}>
            {partner.name} ({partner.email})
          </option>
        ))}
      </select>
      <button
        onClick={handleAssign}
        disabled={loading || !selectedPartner}
        className="bg-blue-600 text-white px-3 py-1 rounded text-xs"
      >
        {loading ? "Assigning..." : "Assign"}
      </button>
    </div>
  );
}