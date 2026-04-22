import { useState } from "react";
import API from "../api/axios";

export default function ProductCard({ product, refresh, isAdmin }) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: product.name,
    description: product.description,
    price: product.price,
    stock: product.stock,
  });
  const [image, setImage] = useState(null);

  const imageUrl = product.image_url || product.image;

  const handleDelete = async () => {
    try {
      await API.delete(`products/${product.id}/`);
      refresh();
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const handleUpdate = async () => {
    try {
      const data = new FormData();

      data.append("name", form.name);
      data.append("description", form.description);
      data.append("price", form.price);
      data.append("stock", form.stock);

      if (image) {
        data.append("image", image);
      }

      await API.put(`products/${product.id}/`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setEditing(false);
      refresh();
    } catch (err) {
      console.error("Update error:", err);
    }
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow hover:shadow-lg transition">

      {/* 🖼️ Image Section (PRO LEVEL) */}
      <div className="w-full h-48 bg-gray-100 flex items-center justify-center rounded mb-3 overflow-hidden">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={product.name}
            className="max-h-full max-w-full object-contain transition-transform duration-300 hover:scale-105"
            onError={(e) => {
              e.target.style.display = "none";
            }}
          />
        ) : (
          <span className="text-gray-500">No Image</span>
        )}
      </div>

      {editing ? (
        <>
          <input
            className="border p-2 w-full mb-2 rounded"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />

          <input
            className="border p-2 w-full mb-2 rounded"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />

          <input
            type="number"
            className="border p-2 w-full mb-2 rounded"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
          />

          <input
            type="number"
            className="border p-2 w-full mb-2 rounded"
            value={form.stock}
            onChange={(e) => setForm({ ...form, stock: e.target.value })}
          />

          <input
            type="file"
            className="border p-2 w-full mb-2 rounded"
            onChange={(e) => setImage(e.target.files[0])}
          />

          <div className="flex gap-2">
            <button
              onClick={handleUpdate}
              className="bg-green-500 text-white px-3 py-1 rounded"
            >
              Save
            </button>

            <button
              onClick={() => setEditing(false)}
              className="bg-gray-400 text-white px-3 py-1 rounded"
            >
              Cancel
            </button>
          </div>
        </>
      ) : (
        <>
          <h2 className="font-bold text-lg">{product.name}</h2>
          <p className="text-gray-500 text-sm">{product.description}</p>

          <div className="mt-3 flex justify-between">
            <span className="font-bold">₹ {product.price}</span>
            <span className="text-gray-400">Stock: {product.stock}</span>
          </div>

          {isAdmin && (
            <div className="mt-4 flex gap-2">
              <button
                onClick={() => setEditing(true)}
                className="bg-blue-500 text-white px-3 py-1 rounded"
              >
                Edit
              </button>

              <button
                onClick={handleDelete}
                className="bg-red-500 text-white px-3 py-1 rounded"
              >
                Delete
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}