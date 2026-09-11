import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function DeliveryLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();

    if (!res.ok) {
      setError(data.message || "Login failed");
      return;
    }
    if (data.user.role !== "delivery") {
      setError("This login is for delivery partners only.");
      return;
    }

    localStorage.setItem("deliveryToken", data.token);
    localStorage.setItem("deliveryUser", JSON.stringify(data.user));
    navigate("/delivery/dashboard");
  }

  return (
    <div className="max-w-sm mx-auto mt-16 p-6 border rounded-lg space-y-4">
      <h1 className="text-xl font-semibold">Delivery Partner Login</h1>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="email" placeholder="Email" value={email}
          onChange={(e) => setEmail(e.target.value)} required
          className="w-full border rounded-md p-2 text-sm"
        />
        <input
          type="password" placeholder="Password" value={password}
          onChange={(e) => setPassword(e.target.value)} required
          className="w-full border rounded-md p-2 text-sm"
        />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button type="submit" className="w-full bg-green-600 text-white rounded-md p-2 text-sm font-medium">
          Log in
        </button>
      </form>
    </div>
  );
}