import { useEffect, useState } from "react";
import { getCustomers, createCustomer, deleteCustomer } from "../api";

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const load = () => getCustomers().then((r) => setCustomers(r.data));
  useEffect(() => { load(); }, []);

  const handleSubmit = async () => {
    setError(""); setMessage("");
    try {
      await createCustomer(form);
      setMessage("Customer added!");
      setForm({ name: "", email: "", phone: "" });
      load();
    } catch (e) {
      setError(e.response?.data?.detail || "Something went wrong");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this customer?")) return;
    await deleteCustomer(id);
    load();
  };

  return (
    <div>
      <h1 className="page-title">👥 Customers</h1>
      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-error">{error}</div>}
      <div className="card">
        <h2 style={{marginBottom:"1rem"}}>Add Customer</h2>
        <div className="form-group"><label>Full Name</label><input value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} /></div>
        <div className="form-group"><label>Email</label><input type="email" value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} /></div>
        <div className="form-group"><label>Phone</label><input value={form.phone} onChange={(e) => setForm({...form, phone: e.target.value})} /></div>
        <button className="btn btn-primary" onClick={handleSubmit}>Add Customer</button>
      </div>
      <div className="card">
        <table>
          <thead><tr><th>ID</th><th>Name</th><th>Email</th><th>Phone</th><th>Actions</th></tr></thead>
          <tbody>
            {customers.map((c) => (
              <tr key={c.id}>
                <td>{c.id}</td><td>{c.name}</td><td>{c.email}</td><td>{c.phone}</td>
                <td><button className="btn btn-danger" onClick={() => handleDelete(c.id)}>Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}