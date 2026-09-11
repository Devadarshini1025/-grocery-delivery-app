import { useState } from "react";
import PhotoCapture from "../components/PhotoCapture";

export default function Support() {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [photoUrl, setPhotoUrl] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    const token = localStorage.getItem("token");

    await fetch(`${import.meta.env.VITE_API_URL}/support`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ subject, message, photoUrl }),
    });
    setSubmitted(true);
  }

  if (submitted) {
    return <div className="p-4 bg-green-100 text-green-800 rounded">Ticket submitted! Our support team will reach out soon.</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-3 p-4 border rounded shadow-sm">
      <h2 className="text-xl font-bold">Contact Support</h2>
      <input
        placeholder="Subject"
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
        required
        className="w-full border p-2 rounded text-sm"
      />
      <textarea
        placeholder="Describe your issue"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        required
        className="w-full border p-2 rounded text-sm h-24"
      />
      <PhotoCapture onUploaded={setPhotoUrl} label="📷 Attach Photo (optional)" />
      <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded font-semibold w-full">
        Submit Ticket
      </button>
    </form>
  );
}