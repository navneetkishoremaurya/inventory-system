import { useEffect, useState } from "react";
import { getOrders, createOrder, deleteOrder, getProducts, getCustomers } from "../api";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [customerId, setCustomerId] = useState("");
  const [items, setItems] = useState([{ product_id: "", quantity: 1 }]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const load = () => getOrders().then((r) => setOrders(r.data));
  useEffect(() => {
    load();
    getProducts().then((r) => setProducts(r.data));
    getCustomers().then((r) => setCustomers(r.data));
  }, []);

  const handleAddItem = () => setItems([...items, { product_id: "", quantity: 1 }]);
  const handleItemChange = (i, field, value) => {
    const updated = [...items];
    updated[i][field] = value;
    setItems(updated);
  };

  const handleSubmit = async () => {
    setError(""); setMessage("");
    try {
      await createOrder({ customer_id: parseInt(customerId), items: items.map(i => ({ product_id: parseInt(i.product_id), quantity: parseInt(i.quantity) })) });
      setMessage("Order created!");
      setCustomerId("");
      setItems([{ product_id: "", quantity: 1 }]);
      load();
    } catch (e) {
      setError(e.response?.data?.detail || "Something went wrong");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Cancel this order?")) return;
    await deleteOrder(id);
    load();
  };

  return (
    <div>
      <h1 className="page-title">🛒 Orders</h1>
      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-error">{error}</div>}
      <div className="card">
        <h2 style={{marginBottom:"1rem"}}>Create Order</h2>
        <div className="form-group">
          <label>Customer</label>
          <select value={customerId} onChange={(e) => setCustomerId(e.target.value)}>
            <option value="">Select customer</option>
            {customers.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        {items.map((item, i) => (
          <div key={i} style={{display:"flex", gap:"1rem", marginBottom:"0.5rem"}}>
            <select value={item.product_id} onChange={(e) => handleItemChange(i, "product_id", e.target.value)} style={{flex:2, padding:"0.6rem", borderRadius:"8px", border:"1px solid #ddd"}}>
              <option value="">Select product</option>
              {products.map((p) => <option key={p.id} value={p.id}>{p.name} (Stock: {p.quantity})</option>)}
            </select>
            <input type="number" min="1" value={item.quantity} onChange={(e) => handleItemChange(i, "quantity", e.target.value)} style={{flex:1, padding:"0.6rem", borderRadius:"8px", border:"1px solid #ddd"}} />
          </div>
        ))}
        <button className="btn btn-success" style={{marginRight:"1rem"}} onClick={handleAddItem}>+ Add Item</button>
        <button className="btn btn-primary" onClick={handleSubmit}>Place Order</button>
      </div>
      <div className="card">
        <table>
          <thead><tr><th>ID</th><th>Customer ID</th><th>Total</th><th>Items</th><th>Actions</th></tr></thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id}>
                <td>{o.id}</td><td>{o.customer_id}</td>
                <td>${o.total_amount.toFixed(2)}</td>
                <td>{o.items.length} item(s)</td>
                <td><button className="btn btn-danger" onClick={() => handleDelete(o.id)}>Cancel</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}