import React, { useState } from "react";
import "./App.css";

/**
 * PUBLIC_INTERFACE
 * Main container for RestroFlow - provides navigation, layout, and loads feature views.
 */
function App() {
  // Current main page selection: "orders", "tables", "dashboard", "menu", "users"
  const [view, setView] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Simple navbar actions
  const navItems = [
    { key: "dashboard", label: "Live Orders" },
    { key: "orders", label: "Order Taking" },
    { key: "tables", label: "Tables" },
    { key: "menu", label: "Menu" },
    { key: "users", label: "Users" },
  ];

  return (
    <div className="app restroflow">
      <nav className="navbar" style={{ background: "var(--primary, #4CAF50)" }}>
        <div className="container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div className="logo" style={{ fontWeight: "bold", color: "#fff", letterSpacing: "2px" }}>
            <span className="logo-symbol" style={{ color: "#FFC107", fontWeight: "bold"}}>🍽️</span>{" "}
            RestroFlow
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <button
              className="btn"
              style={{
                backgroundColor: "#2196F3",
                color: "#fff",
                border: "none",
                borderRadius: 3,
                fontWeight: 500,
                cursor: "pointer",
                display: "none",
              }}
              onClick={() => setSidebarOpen(!sidebarOpen)}
              aria-label="Open Sidebar"
            >
              ☰
            </button>
            <span className="nav-role" style={{ fontSize: "1rem", color: "#fff" }}>
              {/* dummy role, would come from user context */}
              <strong>Waiter</strong>
            </span>
          </div>
        </div>
      </nav>

      <div style={{ display: "flex", marginTop: 64, minHeight: "calc(100vh - 64px)" }}>
        {/* Sidebar */}
        <aside
          className="sidebar"
          style={{
            minWidth: 180,
            maxWidth: 200,
            background: "#fff",
            borderRight: "1px solid #eee",
            boxShadow: "0px 1px 6px rgba(0,0,0,0.03)",
            display: "flex",
            flexDirection: "column",
            gap: "2px",
            paddingTop: "1.5rem",
            paddingLeft: 12,
            paddingRight: 6,
          }}
        >
          {navItems.map((item) => (
            <button
              key={item.key}
              onClick={() => setView(item.key)}
              className="btn"
              style={{
                justifyContent: "flex-start",
                background: view === item.key ? "#4CAF50" : "#f5f5f5",
                color: view === item.key ? "#fff" : "#222",
                margin: "2px 0",
                padding: "10px 18px",
                border: "none",
                borderRadius: 4,
                width: "100%",
                fontWeight: view === item.key ? "bold" : 500,
                transition: "background 0.13s",
                cursor: "pointer",
              }}
            >
              {item.label}
            </button>
          ))}
        </aside>

        {/* Main content area */}
        <main
          className="main-content"
          style={{
            flex: 1,
            background: "#f7fafb",
            padding: "2rem",
            minHeight: "90vh",
            width: 0,
            overflowX: "auto",
          }}
        >
          {view === "dashboard" && <LiveDashboard />}
          {view === "orders" && <OrderTaking />}
          {view === "tables" && <TableManagement />}
          {view === "menu" && <MenuManagement />}
          {view === "users" && <UserManagement />}
        </main>
      </div>
    </div>
  );
}

// -------- Feature stubs (for demo) ----------

/**
 * PUBLIC_INTERFACE
 * Live dashboard showing real-time orders for kitchen and staff.
 */
function LiveDashboard() {
  return (
    <section>
      <h2 style={{ color: "#2196F3" }}>Live Order Dashboard</h2>
      <div>See all running orders below (realtime coming soon)...</div>
      {/* TODO: Connect to backend websocket or polling for live orders */}
    </section>
  );
}

/**
 * PUBLIC_INTERFACE
 * Waiter UI for new Dine-in / Parcel order.
 */
function OrderTaking() {
  return (
    <section>
      <h2 style={{ color: "#4CAF50" }}>Order Taking</h2>
      <div>
        <b>Take new Dine-in or Parcel order</b>
        <br />
        {/* TODO: UI for order entry, fetch menu, submit order */}
      </div>
    </section>
  );
}

import { useEffect } from "react";

/**
 * PUBLIC_INTERFACE
 * Table status management interface for hosts.
 */
function TableManagement() {
  // Local state for tables, form, and loading/error states
  const [tables, setTables] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const [form, setForm] = React.useState({
    name: "",
    seats: 2,
    status: "available",
    note: "",
  });
  const [editingId, setEditingId] = React.useState(null);
  const statusOptions = [
    "available",
    "occupied",
    "reserved",
    "needs_cleaning",
    "maintenance",
  ];

  // Backend API base URL (adapt for prod as needed)
  const API_BASE = "http://localhost:5000/api/tables";

  // Fetch tables from backend
  const fetchTables = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(API_BASE + "/");
      if (!res.ok) throw new Error("Failed to load tables.");
      const data = await res.json();
      setTables(data);
    } catch (e) {
      setError("Could not fetch tables.");
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => { fetchTables(); }, []);

  // Handle form input
  const onFormChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Reset form fields
  function resetForm() {
    setForm({ name: "", seats: 2, status: "available", note: "" });
    setEditingId(null);
  }

  // Submit add or update table
  const onFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const method = editingId ? "PUT" : "POST";
      const url = editingId ? `${API_BASE}/${editingId}` : API_BASE + "/";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          seats: Number(form.seats),
          status: form.status,
          note: form.note,
        }),
      });
      if (!res.ok) {
        const errResp = await res.json();
        throw new Error(errResp.error || "Failed to " + (editingId ? "update" : "create") + " table.");
      }
      await fetchTables();
      resetForm();
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  // Click edit: fill form
  const onEditTable = (tbl) => {
    setForm({
      name: tbl.name,
      seats: tbl.seats,
      status: tbl.status,
      note: tbl.note || "",
    });
    setEditingId(tbl.id);
  };

  // Delete table
  const onDeleteTable = async (tableId) => {
    if (!window.confirm("Delete this table?"))
      return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_BASE}/${tableId}`, { method: "DELETE" });
      if (res.status !== 204) throw new Error("Failed to delete.");
      await fetchTables();
    } catch (e) {
      setError("Could not delete table.");
    } finally {
      setLoading(false);
    }
  };

  // Quick status update
  const onStatusChange = async (tableId, newStatus) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_BASE}/${tableId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error("Failed to update status");
      await fetchTables();
    } catch (e) {
      setError("Could not update status.");
    } finally {
      setLoading(false);
    }
  };

  // Table status color helper
  function getStatusColor(status) {
    switch (status) {
      case "available": return "#4CAF50";
      case "occupied": return "#F44336";
      case "reserved": return "#FFC107";
      case "needs_cleaning": return "#00BCD4";
      case "maintenance": return "#757575";
      default: return "#eee";
    }
  }

  return (
    <section style={{ maxWidth: 800 }}>
      <h2 style={{ color: "#FFC107" }}>Table Management</h2>
      <div style={{ margin: "8px 0 20px 0", fontSize: "1.08rem" }}>
        <b>Manage tables and their statuses.</b> <br />
        Add new tables, set/modify status and capacity, or remove tables as needed.
      </div>
      {error && (
        <div style={{ color: "#ff1620", marginBottom: 12, background: "#fff1f1", padding: "6px 12px", borderRadius: 4 }}>
          {error}
        </div>
      )}

      {/* Table Form */}
      <form
        onSubmit={onFormSubmit}
        style={{
          background: "#fff",
          borderRadius: 6,
          padding: "12px 18px 10px 18px",
          boxShadow: "0 1.5px 6px 0 rgba(25,40,60,.07)",
          marginBottom: "26px",
          display: "flex",
          gap: 10,
          alignItems: "end",
          flexWrap: "wrap"
        }}
      >
        <div>
          <label>
            Table Name <br />
            <input
              name="name"
              value={form.name}
              onChange={onFormChange}
              required
              style={{ padding: 6, borderRadius: 4, border: "1px solid #aaa" }}
              placeholder="A1, B2, VIP-1"
              disabled={loading}
            />
          </label>
        </div>
        <div>
          <label>
            Seats <br />
            <input
              name="seats"
              type="number"
              min={1}
              value={form.seats}
              onChange={onFormChange}
              required
              style={{ padding: 6, borderRadius: 4, border: "1px solid #aaa", width: 60 }}
              disabled={loading}
            />
          </label>
        </div>
        <div>
          <label>
            Status <br />
            <select
              name="status"
              value={form.status}
              onChange={onFormChange}
              required
              style={{ padding: 6, borderRadius: 4, border: "1px solid #aaa", minWidth: 100 }}
              disabled={loading}
            >
              {statusOptions.map((opt) => (
                <option key={opt} value={opt}>{opt.charAt(0).toUpperCase() + opt.slice(1).replace('_',' ')}</option>
              ))}
            </select>
          </label>
        </div>
        <div>
          <label>
            Note/Area <br />
            <input
              name="note"
              value={form.note}
              onChange={onFormChange}
              style={{ padding: 6, borderRadius: 4, border: "1px solid #aaa", minWidth: 80 }}
              disabled={loading}
              placeholder="e.g. Window, Balcony"
            />
          </label>
        </div>
        <div>
          <button type="submit" className="btn btn-large" disabled={loading} style={{ marginRight: 8, background: "#4CAF50" }}>
            {editingId ? "Update Table" : "Add Table"}
          </button>
          {editingId && (
            <button type="button" className="btn" disabled={loading} onClick={resetForm} style={{ background: "#eee", color: "#222" }}>
              Cancel Edit
            </button>
          )}
        </div>
      </form>

      {/* Table grid */}
      <div>
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 100px 140px 80px 130px",
          gap: "8px",
          fontWeight: 600,
          color: "#1A1A1A",
          background: "#ededed",
          borderRadius: 4,
          padding: "7px 9px"
        }}>
          <div>Name</div>
          <div>Seats</div>
          <div>Status</div>
          <div>Note</div>
          <div>Actions</div>
        </div>
        <div>
          {loading && <div style={{ margin: 12 }}>Loading...</div>}
          {tables.map(tbl => (
            <div key={tbl.id}
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 100px 140px 80px 130px",
                gap: "8px",
                background: "#fff",
                borderBottom: "1px solid #eee",
                padding: "8px 9px",
                alignItems: "center"
              }}
            >
              <div><b>{tbl.name}</b></div>
              <div>{tbl.seats}</div>
              <div>
                <select
                  style={{
                    background: getStatusColor(tbl.status),
                    color: "#fff",
                    padding: "4px 7px",
                    border: "none",
                    borderRadius: 4,
                    transition: "background 0.1s"
                  }}
                  value={tbl.status}
                  onChange={(e) => onStatusChange(tbl.id, e.target.value)}
                  disabled={loading}
                >
                  {statusOptions.map(opt =>
                    <option key={opt} value={opt}>{opt.charAt(0).toUpperCase() + opt.slice(1).replace('_',' ')}</option>
                  )}
                </select>
              </div>
              <div style={{ color: "#333", fontSize: "1rem" }}>{tbl.note}</div>
              <div>
                <button className="btn" style={{ marginRight: 6, background: "#2196F3", color: "#fff" }} disabled={loading} onClick={() => onEditTable(tbl)}>
                  Edit
                </button>
                <button className="btn" style={{ background: "#F44336", color: "#fff" }} disabled={loading} onClick={() => onDeleteTable(tbl.id)}>
                  Delete
                </button>
              </div>
            </div>
          ))}
          {!tables.length && !loading && <div style={{ padding: 12, color: "#555" }}>No tables found.</div>}
        </div>
      </div>
    </section>
  );
}

/**
 * PUBLIC_INTERFACE
 * Admin-only menu manager panel.
 */
function MenuManagement() {
  return (
    <section>
      <h2 style={{ color: "#2196F3" }}>Menu Management</h2>
      <div>
        {/* TODO: CRUD on categories/items, fetch/save via backend */}
      </div>
    </section>
  );
}

/**
 * PUBLIC_INTERFACE
 * User management for assigning staff/admin roles.
 */
function UserManagement() {
  return (
    <section>
      <h2 style={{ color: "#795548" }}>User & Role Management</h2>
      {/* TODO: add/list/edit/delete roles. */}
    </section>
  );
}

export default App;