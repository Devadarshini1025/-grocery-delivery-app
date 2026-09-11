import { useState } from "react";

export default function PhotoCapture({ onUploaded, label = "Take a photo" }) {
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);

  async function handleFileChange(e) {
    const file = e.target.files[0];
    if (!file) return;

    setPreview(URL.createObjectURL(file));
    setUploading(true);

    const formData = new FormData();
    formData.append("photo", file);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/upload`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      onUploaded(data.url);
    } catch (err) {
      alert("Photo upload failed. Try again.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="my-2">
      <label className="block cursor-pointer bg-gray-100 border border-dashed border-gray-400 p-3 text-center rounded">
        <span className="text-sm font-medium">{label}</span>
        <input
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleFileChange}
          className="hidden"
        />
      </label>
      {preview && <img src={preview} alt="preview" className="w-28 h-28 object-cover mt-2 rounded border" />}
      {uploading && <p className="text-xs text-amber-600 mt-1">Uploading...</p>}
    </div>
  );
}