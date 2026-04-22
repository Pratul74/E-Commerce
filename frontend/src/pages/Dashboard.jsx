import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import API from "../api/axios";
import ProductCard from "../components/ProductCard";

export default function Dashboard({ setIsAuth }) {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [ordering, setOrdering] = useState("");
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
  });

  const [image, setImage] = useState(null);

  const token = localStorage.getItem("token");
  let isAdmin = false;

  if (token) {
    try {
      const decoded = jwtDecode(token);
      isAdmin = decoded.role === "ADMIN"; // make sure backend sends role
    } catch (err) {
      console.error("Invalid token");
    }
  }

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, []);


  const fetchProducts = async () => {
    try {
      setLoading(true);

      const res = await API.get(`products/?search=${search}&page=${page}&ordering=${ordering}`);

      setProducts(res.data.results);

      const pageSize = res.data.results.length || 1;
      setTotalPages(Math.ceil(res.data.count / pageSize));
    } catch (err) {
      setError("Something went wrong");
    }
     finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [search, page, ordering]);

  
  const handleAdd = async () => {
    try {
      const data = new FormData();

      data.append("name", form.name);
      data.append("description", form.description);
      data.append("price", form.price);
      data.append("stock", form.stock);

      if (image) {
        data.append("image", image);
      }

      await API.post("products/", data);

      setForm({ name: "", description: "", price: "", stock: "" });
      setImage(null);
      setPage(1);

      fetchProducts();
    } catch (err) {
      console.error("Add error:", err);
    }
  };


  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuth(false);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">

      
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>

        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>

      <div className="flex gap-4 mb-6">
        <input
          type="text"
          placeholder="Search products..."
          className="border p-2 rounded w-full"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />

        <select
          className="border p-2 rounded"
          value={ordering}
          onChange={(e) => setOrdering(e.target.value)}
        >
          <option value="">Sort</option>
          <option value="price">Price ↑</option>
          <option value="-price">Price ↓</option>
          <option value="-created_at">Newest</option>
        </select>
      </div>

      {isAdmin && (
        <div className="bg-white p-4 rounded shadow mb-6">
          <h2 className="font-bold mb-3">Add Product</h2>

          <input
            placeholder="Name"
            className="border p-2 w-full mb-2"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />

          <input
            placeholder="Description"
            className="border p-2 w-full mb-2"
            value={form.description}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
          />

          <input
            type="number"
            placeholder="Price"
            className="border p-2 w-full mb-2"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
          />

          <input
            type="number"
            placeholder="Stock"
            className="border p-2 w-full mb-2"
            value={form.stock}
            onChange={(e) => setForm({ ...form, stock: e.target.value })}
          />

          <input
            type="file"
            className="border p-2 w-full mb-2"
            onChange={(e) => setImage(e.target.files[0])}
          />

          <button
            onClick={handleAdd}
            className="bg-black text-white px-4 py-2 rounded"
          >
            Add Product
          </button>
        </div>
      )}

      {loading && <p className="text-center">Loading...</p>}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            refresh={fetchProducts}
            isAdmin={isAdmin}
          />
        ))}
      </div>

      <div className="flex justify-center mt-8 gap-2">
        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          className="px-3 py-1 bg-gray-200 rounded"
        >
          Prev
        </button>

        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i}
            onClick={() => setPage(i + 1)}
            className={`px-3 py-1 rounded ${
              page === i + 1 ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
          >
            {i + 1}
          </button>
        ))}

        <button
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
          className="px-3 py-1 bg-gray-200 rounded"
        >
          Next
        </button>
      </div>
    </div>
  );
}