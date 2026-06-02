import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Customers from "./pages/Customers";
import Orders from "./pages/Orders";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <nav className="navbar">
          <div className="nav-brand">
            <div className="nav-brand-logo">⚡ InvenTrack</div>
            <div className="nav-brand-sub">Management System</div>
          </div>
          <div className="nav-links">
            <NavLink to="/" end>🏠 &nbsp;Dashboard</NavLink>
            <NavLink to="/products">📦 &nbsp;Products</NavLink>
            <NavLink to="/customers">👥 &nbsp;Customers</NavLink>
            <NavLink to="/orders">🛒 &nbsp;Orders</NavLink>
          </div>
          <div className="nav-footer">v1.0.0 • All systems operational</div>
        </nav>
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/products" element={<Products />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/orders" element={<Orders />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;