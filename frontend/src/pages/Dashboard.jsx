import { useEffect, useState } from "react";
import API from "../api/axios";
import Navbar from "../components/Navbar";
import ProductCard from "../components/ProductCard";
import CreateProduct from "../components/CreateProduct";

export default function Dashboard() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const role = localStorage.getItem("role");
  const isAdmin = role === "ADMIN";

  // Fetch products
  const fetchProducts = async () => {
    try {
      setLoading(true);

      const res = await API.get(`products/?search=${search}`);
      setProducts(res.data.results || res.data);

      setLoading(false);
    } catch (err) {
      console.error("Error fetching products:", err);
      setLoading(false);
    }
  };

  // Trigger fetch on search change
  useEffect(() => {
    fetchProducts();
  }, [search]);

  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar />

      <div className="max-w-6xl mx-auto p-6">
        
        <input
          type="text"
          placeholder="🔍 Search products..."
          className="border p-3 mb-5 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
          onChange={(e) => setSearch(e.target.value)}
        />

        {isAdmin && <CreateProduct refresh={fetchProducts} />}

        {loading ? (
          <p className="text-center text-gray-500">Loading products...</p>
        ) : products.length === 0 ? (
          <p className="text-center text-gray-500">No products found</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                refresh={fetchProducts}
                isAdmin={isAdmin}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}