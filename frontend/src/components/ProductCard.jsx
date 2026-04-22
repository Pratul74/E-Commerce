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

  const handleDelete = async () => {
    await API.delete(`products/${product.id}/`);
    refresh();
  };

  const handleUpdate = async () => {
    await API.put(`products/${product.id}/`, form);
    setEditing(false);
    refresh();
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow hover:shadow-lg">

      {editing ? (
        <>
          <input
            className="border p-2 w-full mb-2"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />

          <input
            className="border p-2 w-full mb-2"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />

          <input
            className="border p-2 w-full mb-2"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
          />

          <input
            className="border p-2 w-full mb-2"
            value={form.stock}
            onChange={(e) => setForm({ ...form, stock: e.target.value })}
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
          <h2 className="font-bold">{product.name}</h2>
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