import { useState } from "react";
import API from "../api/axios";

export default function CreateProduct({ refresh }) {
  const [form, setForm] = useState({
    name: "", description: "", price: "", stock: ""
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await API.post("products/", form);
    refresh();
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow mb-6">
      <h2 className="font-bold mb-2">Add Product</h2>

      <input placeholder="Name" className="border p-2 w-full mb-2"
        onChange={(e)=>setForm({...form,name:e.target.value})}/>

      <input placeholder="Description" className="border p-2 w-full mb-2"
        onChange={(e)=>setForm({...form,description:e.target.value})}/>

      <input placeholder="Price" className="border p-2 w-full mb-2"
        onChange={(e)=>setForm({...form,price:e.target.value})}/>

      <input placeholder="Stock" className="border p-2 w-full mb-2"
        onChange={(e)=>setForm({...form,stock:e.target.value})}/>

      <button className="bg-black text-white px-4 py-2 rounded">
        Add
      </button>
    </form>
  );
}