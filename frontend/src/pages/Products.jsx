import { useEffect, useState } from "react";
import { getProducts, createProduct, updateProduct, deleteProduct } from "../api";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ name: "", sku: "", price: "", quantity: "" });
  const [editId, setEditId] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const load = () => getProducts().then((r) => setProducts(r.data));
  useEffect(() => { load(); }, []);

  const handleSubmit = async () => {
    setError(""); setMessage("");
    try {
      if (editId) {
        await updateProduct(editId, { ...form, price: parseFloat(form.price), quantity: parseInt(form.quantity) });
        setMessage("Product updated!");
        setEditId(null);
      } else {
        await createProduct({ ...form, price: parseFloat(form.price), quantity: parseInt(form.quantity) });
        setMessage("Product created!");
      }
      setForm({ name: "", sku: "", price: "", quantity: "" });
      load();
    } catch (e) {
      setError(e.response?.data?.detail || "Something went wrong");
    }
  };

  const handleEdit = (p) => {
    setEditId(p.id);
    setForm({ name: p.name, sku: p.sku, price: p.price, quantity: p.quantity });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    await deleteProduct(id);
    load();
  };

  return (
    <div>
      <h1 className="page-title">📦 Products</h1>
      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-error">{error}</div>}
      <div className="card">
        <h2 style={{marginBottom:"1rem"}}>{editId ? "Edit Product" : "Add Product"}</h2>
        <div className="form-group"><label>Name</label><input value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} /></div>
        <div className="form-group"><label>SKU</label><input value={form.sku} onChange={(e) => setForm({...form, sku: e.target.value})} /></div>
        <div className="form-group"><label>Price</label><input type="number" value={form.price} onChange={(e) => setForm({...form, price: e.target.value})} /></div>
        <div className="form-group"><label>Quantity</label><input type="number" value={form.quantity} onChange={(e) => setForm({...form, quantity: e.target.value})} /></div>
        <button className="btn btn-primary" onClick={handleSubmit}>{editId ? "Update" : "Add Product"}</button>
        {editId && <button className="btn" style={{marginLeft:"1rem"}} onClick={() => { setEditId(null); setForm({ name:"", sku:"", price:"", quantity:"" }); }}>Cancel</button>}
      </div>
      <div className="card">
        <table>
          <thead><tr><th>ID</th><th>Name</th><th>SKU</th><th>Price</th><th>Stock</th><th>Actions</th></tr></thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id}>
                <td>{p.id}</td><td>{p.name}</td><td>{p.sku}</td>
                <td>${p.price}</td>
                <td><span className={`badge ${p.quantity < 10 ? "badge-warning" : "badge-success"}`}>{p.quantity}</span></td>
                <td>
                  <button className="btn btn-primary" style={{marginRight:"0.5rem"}} onClick={() => handleEdit(p)}>Edit</button>
                  <button className="btn btn-danger" onClick={() => handleDelete(p.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}