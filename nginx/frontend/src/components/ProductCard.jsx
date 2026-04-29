import { useState } from "react";
import API from "../api/axios";

export default function ProductCard({ product, refresh, isAdmin }) {
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: product.name,
    description: product.description,
    price: product.price,
    stock: product.stock,
  });

  const [image, setImage] = useState(null);

  const imageUrl = product.image_url;

  
  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    try {
      setLoading(true);
      setError("");

      await API.delete(`products/${product.id}/`);
      refresh();
    } catch (err) {
      console.error("Delete error:", err);
      setError("Failed to delete product");
    } finally {
      setLoading(false);
    }
  };

  
  const handleUpdate = async () => {
    try {
      setLoading(true);
      setError("");

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
      setError("Failed to update product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow hover:shadow-lg transition">

      
      <div className="w-full h-48 bg-gray-100 rounded overflow-hidden mb-3 flex items-center justify-center">
    <img
      src={imageUrl || "https://via.placeholder.com/300x200?text=No+Image"}
      alt={product.name}
      className="max-h-full max-w-full object-contain"
    />
    </div>

  
      {error && (
        <p className="text-red-500 text-sm mb-2">{error}</p>
      )}

      {editing ? (
        <>
          <input
            className="border p-2 w-full mb-2 rounded"
            value={form.name}
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
          />

          <input
            className="border p-2 w-full mb-2 rounded"
            value={form.description}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
          />

          <input
            type="number"
            className="border p-2 w-full mb-2 rounded"
            value={form.price}
            onChange={(e) =>
              setForm({ ...form, price: e.target.value })
            }
          />

          <input
            type="number"
            className="border p-2 w-full mb-2 rounded"
            value={form.stock}
            onChange={(e) =>
              setForm({ ...form, stock: e.target.value })
            }
          />

          <input
            type="file"
            className="border p-2 w-full mb-2 rounded"
            onChange={(e) => setImage(e.target.files[0])}
          />

          <div className="flex gap-2">
            <button
              onClick={handleUpdate}
              disabled={loading}
              className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save"}
            </button>

            <button
              onClick={() => setEditing(false)}
              disabled={loading}
              className="bg-gray-400 text-white px-3 py-1 rounded hover:bg-gray-500"
            >
              Cancel
            </button>
          </div>
        </>
      ) : (
        <>
          <h2 className="font-bold text-lg">{product.name}</h2>

          <p className="text-gray-500 text-sm line-clamp-2">
            {product.description}
          </p>

          <div className="mt-3 flex justify-between">
            <span className="font-bold text-green-600">
              ₹ {product.price}
            </span>
            <span className="text-gray-400">
              Stock: {product.stock}
            </span>
          </div>
          {isAdmin && (
            <div className="mt-4 flex gap-2">
              <button
                onClick={() => setEditing(true)}
                disabled={loading}
                className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
              >
                Edit
              </button>

              <button
                onClick={handleDelete}
                disabled={loading}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 disabled:opacity-50"
              >
                {loading ? "Deleting..." : "Delete"}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}