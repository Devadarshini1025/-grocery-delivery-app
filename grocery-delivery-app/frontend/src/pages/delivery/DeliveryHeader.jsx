import { useNavigate } from "react-router-dom";

export default function DeliveryHeader() {
  const navigate = useNavigate();
  const deliveryUser = JSON.parse(localStorage.getItem("deliveryUser") || "null");

  function handleLogout() {
    localStorage.removeItem("deliveryToken");
    localStorage.removeItem("deliveryUser");
    navigate("/delivery/login");
  }

  return (
    <div className="bg-green-700 text-white px-4 py-3 flex justify-between items-center">
      <span className="font-semibold">🚴 FreshCart Delivery</span>
      <div className="flex items-center gap-3 text-sm">
        {deliveryUser && <span>{deliveryUser.name}</span>}
        <button
          onClick={handleLogout}
          className="bg-white/20 hover:bg-white/30 px-3 py-1 rounded-md text-xs"
        >
          Logout
        </button>
      </div>
    </div>
  );
}