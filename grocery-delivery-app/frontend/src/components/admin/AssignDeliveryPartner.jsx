import { useEffect, useState } from 'react';

export default function AssignDeliveryPartner({ orderId, onAssigned }) {
  const [partners, setPartners] = useState([]);
  const [selected, setSelected] = useState('');
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/admin/delivery-partners`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setPartners(Array.isArray(data) ? data : []))
      .catch((err) => console.error(err));
  }, [token]);

  async function handleAssign() {
    if (!selected) return;
    setLoading(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/admin/orders/${orderId}/assign`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ deliveryPartnerId: selected }),
        }
      );
      if (res.ok) {
        if (onAssigned) onAssigned();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center gap-2 mt-2">
      <select
        value={selected}
        onChange={(e) => setSelected(e.target.value)}
        className="text-xs border border-kraft-300 rounded px-2 py-1 bg-white text-ink-900"
      >
        <option value="">Select Delivery Partner</option>
        {partners.map((p) => (
          <option key={p._id} value={p._id}>
            {p.name} ({p.email})
          </option>
        ))}
      </select>
      <button
        onClick={handleAssign}
        disabled={!selected || loading}
        className="bg-leaf-700 text-white text-xs px-2.5 py-1 rounded hover:bg-leaf-600 font-medium disabled:opacity-50"
      >
        {loading ? 'Assigning...' : 'Assign Driver'}
      </button>
    </div>
  );
}