import { useEffect, useState } from "react";
import { getDashboard } from "../api";

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    getDashboard()
      .then((res) => setData(res.data))
      .catch(() => setError("Cannot connect to backend."));
  }, []);

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
        <p className="page-subtitle">Welcome back! Here's your business at a glance.</p>
      </div>

      {error && <div className="alert alert-error">⚠️ {error} — Make sure Docker is running.</div>}

      {data && (
        <>
          <div className="stats-grid">
            <div className="stat-card blue">
              <div className="stat-icon">📦</div>
              <div className="stat-number">{data.total_products}</div>
              <div className="stat-label">Total Products</div>
            </div>
            <div className="stat-card purple">
              <div className="stat-icon">👥</div>
              <div className="stat-number">{data.total_customers}</div>
              <div className="stat-label">Total Customers</div>
            </div>
            <div className="stat-card pink">
              <div className="stat-icon">🛒</div>
              <div className="stat-number">{data.total_orders}</div>
              <div className="stat-label">Total Orders</div>
            </div>
            <div className="stat-card orange">
              <div className="stat-icon">⚠️</div>
              <div className="stat-number">{data.low_stock_products.length}</div>
              <div className="stat-label">Low Stock Alerts</div>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <span className="card-title">⚠️ Low Stock Alerts</span>
              <span className="badge badge-warning">{data.low_stock_products.length} items</span>
            </div>
            {data.low_stock_products.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">✅</div>
                <div className="empty-state-text">All products are well stocked!</div>
              </div>
            ) : (
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr><th>ID</th><th>Product Name</th><th>Stock Remaining</th></tr>
                  </thead>
                  <tbody>
                    {data.low_stock_products.map((p) => (
                      <tr key={p.id}>
                        <td><span className="badge badge-blue">#{p.id}</span></td>
                        <td style={{fontWeight:600, color:"#e2e8f0"}}>{p.name}</td>
                        <td><span className="badge badge-warning">⚠️ {p.quantity} left</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}