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

/**
 * PUBLIC_INTERFACE
 * Table status management interface for hosts.
 */
function TableManagement() {
  return (
    <section>
      <h2 style={{ color: "#FFC107" }}>Table Management</h2>
      {/* TODO: Table status grid + assign/release functionalities */}
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