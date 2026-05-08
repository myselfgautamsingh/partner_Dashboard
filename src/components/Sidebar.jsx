import { NavLink } from "react-router-dom";
import {
  LayoutDashboard, Users, FileUp, FileBarChart2, CreditCard,
  Building2, LogOut, ChevronLeft, ChevronRight
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const navItems = [
  { to: "/", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/enrollment", icon: Users, label: "Enrollment" },
  { to: "/uploads", icon: FileUp, label: "Data Uploads" },
  { to: "/claims", icon: FileBarChart2, label: "Claims" },
  { to: "/payments", icon: CreditCard, label: "Payments" },
  { to: "/branches", icon: Building2, label: "Branch Performance" },
];

export default function Sidebar({ collapsed, onToggle }) {
  const { user, logout } = useAuth();
  const initials = user?.email?.[0]?.toUpperCase() || "P";

  return (
    <aside style={{
      width: collapsed ? "70px" : "240px",
      minHeight: "100vh",
      backgroundColor: "#0f172a",
      display: "flex",
      flexDirection: "column",
      transition: "width 0.25s ease",
      flexShrink: 0,
      position: "relative",
      zIndex: 20,
    }}>

      {/* Logo */}
      <div style={{ padding: "22px 18px 18px", display: "flex", alignItems: "center", gap: "12px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{
          width: "42px", height: "42px", borderRadius: "10px", flexShrink: 0,
          background: "white",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontWeight: "800", fontSize: "14px", color: "#3b82f6", letterSpacing: "-0.5px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.3)", overflow: "hidden",
        }}>
          <img src="/bb-logo.png" alt="Bharat Bima" style={{ width: "100%", height: "100%", objectFit: "contain", transform: "scale(1.35)", transformOrigin: "center" }}
            onError={e => { e.currentTarget.style.display = "none"; e.currentTarget.nextSibling.style.display = "flex"; }} />
          <span style={{ display: "none", width: "100%", height: "100%", alignItems: "center", justifyContent: "center" }}>BB</span>
        </div>
        {!collapsed && (
          <div style={{ overflow: "hidden" }}>
            <div style={{ fontSize: "15px", fontWeight: "700", color: "white", lineHeight: "1.2", whiteSpace: "nowrap" }}>Bharat Bima</div>
            <div style={{ fontSize: "11px", color: "#64748b", marginTop: "1px", whiteSpace: "nowrap" }}>Partner Portal</div>
          </div>
        )}
        <button onClick={onToggle} style={{
          marginLeft: "auto", background: "none", border: "none", cursor: "pointer",
          color: "#475569", display: "flex", padding: "4px", borderRadius: "6px",
          flexShrink: 0,
        }}
          onMouseEnter={e => e.currentTarget.style.color = "#94a3b8"}
          onMouseLeave={e => e.currentTarget.style.color = "#475569"}
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {/* Nav label */}
      {!collapsed && (
        <div style={{ padding: "18px 18px 6px", fontSize: "10px", fontWeight: "600", color: "#334155", letterSpacing: "0.1em", textTransform: "uppercase" }}>
          Navigation
        </div>
      )}

      {/* Nav items */}
      <nav style={{ flex: 1, padding: "8px 10px", display: "flex", flexDirection: "column", gap: "2px" }}>
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/"}
            style={({ isActive }) => ({
              display: "flex", alignItems: "center",
              gap: "12px", padding: collapsed ? "10px" : "10px 12px",
              borderRadius: "10px", textDecoration: "none",
              fontSize: "13.5px", fontWeight: isActive ? "600" : "500",
              color: isActive ? "white" : "#64748b",
              background: isActive ? "linear-gradient(135deg, #3b82f6, #6366f1)" : "transparent",
              boxShadow: isActive ? "0 4px 14px rgba(99,102,241,0.35)" : "none",
              transition: "all 0.15s ease",
              justifyContent: collapsed ? "center" : "flex-start",
            })}
            onMouseEnter={e => { if (!e.currentTarget.style.background.includes("gradient")) { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; e.currentTarget.style.color = "#e2e8f0"; }}}
            onMouseLeave={e => { if (!e.currentTarget.style.background.includes("gradient")) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#64748b"; }}}
          >
            <Icon size={17} style={{ flexShrink: 0 }} />
            {!collapsed && <span style={{ whiteSpace: "nowrap", overflow: "hidden" }}>{label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* User + Logout */}
      <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", padding: "12px 10px" }}>
        {!collapsed && user && (
          <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "8px 12px", marginBottom: "4px", borderRadius: "10px", background: "rgba(255,255,255,0.04)" }}>
            <div style={{
              width: "32px", height: "32px", borderRadius: "50%", flexShrink: 0,
              background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "13px", fontWeight: "700", color: "white",
            }}>{initials}</div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: "12px", fontWeight: "600", color: "#e2e8f0", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {user.displayName || "Partner User"}
              </div>
              <div style={{ fontSize: "11px", color: "#475569", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {user.email}
              </div>
            </div>
          </div>
        )}
        <button onClick={logout} style={{
          display: "flex", alignItems: "center", gap: "12px",
          width: "100%", padding: collapsed ? "10px" : "10px 12px",
          borderRadius: "10px", border: "none", cursor: "pointer",
          background: "none", color: "#ef4444", fontSize: "13.5px", fontWeight: "500",
          justifyContent: collapsed ? "center" : "flex-start",
          transition: "background 0.15s",
        }}
          onMouseEnter={e => e.currentTarget.style.background = "rgba(239,68,68,0.1)"}
          onMouseLeave={e => e.currentTarget.style.background = "none"}
        >
          <LogOut size={17} style={{ flexShrink: 0 }} />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
}
