import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard, Users, FileUp, FileBarChart2, CreditCard,
  Building2, LogOut, ChevronLeft, ChevronRight,
  Package, User, BookOpen, Key, ChevronDown, ChevronUp,
  Bell, RefreshCw, UserCheck, FileText, IndianRupee, MessageCircle, Settings
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const mainNavItems = [
  { to: "/", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/members", icon: UserCheck, label: "Members" },
  { to: "/enrollment", icon: Users, label: "Enrollment" },
  { to: "/renewals", icon: RefreshCw, label: "Renewals" },
  { to: "/uploads", icon: FileUp, label: "Data Uploads" },
  { to: "/claims", icon: FileBarChart2, label: "Claims" },
  { to: "/payments", icon: CreditCard, label: "Payments" },
  { to: "/branches", icon: Building2, label: "Branch Performance" },
  { to: "/notifications", icon: Bell, label: "Notifications" },
  { to: "/reports", icon: FileText, label: "Reports" },
  { to: "/commission", icon: IndianRupee, label: "Commission" },
  { to: "/support", icon: MessageCircle, label: "Support" },
];

const secondaryNavItems = [
  { to: "/claim-details", icon: FileBarChart2, label: "Claim Tracker" },
  { to: "/products", icon: Package,  label: "Plans & Schemes" },
  { to: "/account",  icon: User,     label: "Account" },
  { to: "/api-docs", icon: BookOpen, label: "API Docs" },
  { to: "/api-keys", icon: Key,      label: "API Keys" },
];

export default function Sidebar({ collapsed, onToggle }) {
  const { user, logout } = useAuth();
  const initials = user?.email?.[0]?.toUpperCase() || "P";
  const [developerExpanded, setDeveloperExpanded] = useState(false);

  const navItem = (isActive, col) => ({
    display: "flex", alignItems: "center",
    gap: "9px", padding: col ? "8px" : "7px 10px",
    borderRadius: "6px", textDecoration: "none",
    fontSize: "13px", fontWeight: isActive ? "600" : "400",
    color: isActive ? "#e2e8f0" : "#64748b",
    background: isActive ? "rgba(59,130,246,0.18)" : "transparent",
    borderLeft: isActive ? "2px solid #3b82f6" : "2px solid transparent",
    transition: "all 0.12s",
    justifyContent: col ? "center" : "flex-start",
    flexShrink: 0,
    letterSpacing: "0.01em",
  });

  return (
    <aside style={{
      width: collapsed ? "60px" : "220px",
      height: "100vh",
      backgroundColor: "#0f172a",
      display: "flex", flexDirection: "column",
      transition: "width 0.2s ease",
      flexShrink: 0, position: "sticky", top: 0, zIndex: 20, overflow: "hidden",
      borderRight: "1px solid rgba(255,255,255,0.05)",
    }}>

      {/* Logo */}
      <div style={{ padding: "14px 12px", display: "flex", alignItems: "center", gap: "9px", borderBottom: "1px solid rgba(255,255,255,0.06)", flexShrink: 0 }}>
        <div style={{ width: "34px", height: "34px", borderRadius: "6px", flexShrink: 0, background: "white", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
          <img src="/bb-logo.png" alt="Bharat Bima" style={{ width: "100%", height: "100%", objectFit: "contain", transform: "scale(1.3)", transformOrigin: "center" }}
            onError={e => { e.currentTarget.style.display = "none"; e.currentTarget.nextSibling.style.display = "flex"; }} />
          <span style={{ display: "none", width: "100%", height: "100%", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: "800", color: "#3b82f6" }}>BB</span>
        </div>
        {!collapsed && (
          <div style={{ overflow: "hidden", flex: 1 }}>
            <div style={{ fontSize: "13px", fontWeight: "700", color: "#f1f5f9", lineHeight: "1.2", whiteSpace: "nowrap" }}>Bharat Bima</div>
            <div style={{ fontSize: "10px", color: "#475569", marginTop: "1px", whiteSpace: "nowrap", letterSpacing: "0.03em" }}>PARTNER PORTAL</div>
          </div>
        )}
        <button onClick={onToggle} style={{ marginLeft: "auto", background: "none", border: "none", cursor: "pointer", color: "#475569", display: "flex", padding: "3px", borderRadius: "4px", flexShrink: 0 }}
          onMouseEnter={e => e.currentTarget.style.color = "#94a3b8"}
          onMouseLeave={e => e.currentTarget.style.color = "#475569"}
        >
          {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      </div>

      {/* Scrollable nav */}
      <nav className="sidebar-nav" style={{ flex: 1, overflowY: "auto", overflowX: "hidden", padding: "8px 8px 4px", display: "flex", flexDirection: "column", gap: "1px" }}>

        {!collapsed && <div style={{ padding: "8px 8px 3px", fontSize: "10px", fontWeight: "600", color: "#334155", letterSpacing: "0.1em", textTransform: "uppercase" }}>Main</div>}

        {mainNavItems.map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to} end={to === "/"}
            style={({ isActive }) => navItem(isActive, collapsed)}
            onMouseEnter={e => { if (!e.currentTarget.style.background.includes("rgba(59")) { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.color = "#cbd5e1"; }}}
            onMouseLeave={e => { if (!e.currentTarget.style.background.includes("rgba(59")) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#64748b"; }}}
          >
            <Icon size={15} style={{ flexShrink: 0 }} />
            {!collapsed && <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{label}</span>}
          </NavLink>
        ))}

        {/* Developer section */}
        <div style={{ margin: "8px 0 3px", borderTop: "1px solid rgba(255,255,255,0.05)" }} />
        {!collapsed ? (
          <button onClick={() => setDeveloperExpanded(e => !e)} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", padding: "5px 8px", background: "none", border: "none", cursor: "pointer" }}>
            <span style={{ fontSize: "10px", fontWeight: "600", color: "#334155", letterSpacing: "0.1em", textTransform: "uppercase" }}>Settings</span>
            {developerExpanded ? <ChevronUp size={10} color="#475569" /> : <ChevronDown size={10} color="#475569" />}
          </button>
        ) : <div style={{ height: "6px" }} />}

        {(developerExpanded || collapsed) && secondaryNavItems.map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to}
            style={({ isActive }) => navItem(isActive, collapsed)}
            onMouseEnter={e => { if (!e.currentTarget.style.background.includes("rgba(59")) { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.color = "#cbd5e1"; }}}
            onMouseLeave={e => { if (!e.currentTarget.style.background.includes("rgba(59")) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#64748b"; }}}
          >
            <Icon size={15} style={{ flexShrink: 0 }} />
            {!collapsed && <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Footer — always pinned */}
      <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)", padding: "8px", flexShrink: 0 }}>
        {!collapsed && user && (
          <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "6px 8px", marginBottom: "2px", borderRadius: "6px", background: "rgba(255,255,255,0.03)" }}>
            <div style={{ width: "26px", height: "26px", borderRadius: "50%", flexShrink: 0, background: "linear-gradient(135deg, #3b82f6, #6366f1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "10px", fontWeight: "700", color: "white" }}>{initials}</div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: "12px", fontWeight: "600", color: "#cbd5e1", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user.displayName || "Partner User"}</div>
              <div style={{ fontSize: "10px", color: "#475569", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user.email}</div>
            </div>
          </div>
        )}
        <button onClick={logout} style={{ display: "flex", alignItems: "center", gap: "9px", width: "100%", padding: collapsed ? "8px" : "7px 8px", borderRadius: "6px", border: "none", cursor: "pointer", background: "none", color: "#64748b", fontSize: "13px", fontWeight: "400", justifyContent: collapsed ? "center" : "flex-start", transition: "all 0.12s", boxSizing: "border-box" }}
          onMouseEnter={e => { e.currentTarget.style.background = "rgba(239,68,68,0.08)"; e.currentTarget.style.color = "#ef4444"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "none"; e.currentTarget.style.color = "#64748b"; }}
        >
          <LogOut size={14} style={{ flexShrink: 0 }} />
          {!collapsed && <span>Sign Out</span>}
        </button>
      </div>
    </aside>
  );
}
