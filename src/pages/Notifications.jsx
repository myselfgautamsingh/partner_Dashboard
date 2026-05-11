import { useState } from "react";
import { Bell, AlertTriangle, CheckCircle, Clock, Upload, RefreshCw, CreditCard, UserPlus } from "lucide-react";
import { mockDashboardData as d } from "../firebase/mockData";

const card = { background: "white", borderRadius: "16px", padding: "22px", boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 4px 20px rgba(0,0,0,0.03)", border: "1px solid rgba(0,0,0,0.05)" };

const typeConfig = {
  renewal:    { icon: <RefreshCw size={16} />,  bg: "#eff6ff",  color: "#3b82f6",  label: "Renewal"   },
  claim:      { icon: <AlertTriangle size={16}/>, bg: "#fef2f2", color: "#ef4444",  label: "Claim"     },
  payment:    { icon: <CreditCard size={16} />,  bg: "#fff7ed",  color: "#f59e0b",  label: "Payment"   },
  upload:     { icon: <Upload size={16} />,      bg: "#f5f3ff",  color: "#8b5cf6",  label: "Upload"    },
  enrollment: { icon: <UserPlus size={16} />,    bg: "#f0fdf4",  color: "#10b981",  label: "Enrollment"},
};

const priorityStyle = {
  high:   { bg: "#fef2f2",  color: "#dc2626", label: "High"   },
  medium: { bg: "#fff7ed",  color: "#d97706", label: "Medium" },
  low:    { bg: "#f0fdf4",  color: "#059669", label: "Low"    },
};

export default function Notifications() {
  const [filter, setFilter] = useState("All");
  const [notifications, setNotifications] = useState(d.notifications);

  const types = ["All", "renewal", "claim", "payment", "upload", "enrollment"];
  const unread = notifications.filter(n => !n.read).length;

  const filtered = filter === "All" ? notifications : notifications.filter(n => n.type === filter);

  const markAllRead = () => setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  const markRead = (id) => setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "22px" }}>

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <h2 style={{ fontSize: "20px", fontWeight: "800", color: "#0f172a", margin: 0 }}>Notifications</h2>
            {unread > 0 && (
              <span style={{ fontSize: "11px", fontWeight: "700", padding: "3px 10px", borderRadius: "20px", background: "#ef4444", color: "white" }}>{unread} new</span>
            )}
          </div>
          <p style={{ fontSize: "13px", color: "#94a3b8", marginTop: "3px" }}>Alerts for renewals, claims, payments and uploads</p>
        </div>
        {unread > 0 && (
          <button onClick={markAllRead} style={{ padding: "10px 18px", borderRadius: "10px", border: "1px solid #e2e8f0", background: "white", color: "#475569", fontSize: "13px", fontWeight: "600", cursor: "pointer" }}>
            Mark all as read
          </button>
        )}
      </div>

      {/* Summary tiles */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "14px" }}>
        {[
          { label: "Unread",          value: unread,                                                   color: "#ef4444", bg: "#fef2f2" },
          { label: "High Priority",   value: notifications.filter(n => n.priority === "high").length,  color: "#f59e0b", bg: "#fff7ed" },
          { label: "Renewals Due",    value: notifications.filter(n => n.type === "renewal").length,   color: "#3b82f6", bg: "#eff6ff" },
          { label: "Claims Alerts",   value: notifications.filter(n => n.type === "claim").length,     color: "#8b5cf6", bg: "#f5f3ff" },
        ].map(({ label, value, color, bg }) => (
          <div key={label} style={{ ...card, padding: "18px", position: "relative", overflow: "hidden", textAlign: "center" }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "3px", background: color, borderRadius: "16px 16px 0 0" }} />
            <div style={{ fontSize: "28px", fontWeight: "800", color: "#0f172a", letterSpacing: "-0.5px" }}>{value}</div>
            <div style={{ fontSize: "11px", color: "#94a3b8", marginTop: "4px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.04em" }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
        {types.map(t => {
          const active = filter === t;
          const cfg = typeConfig[t];
          return (
            <button key={t} onClick={() => setFilter(t)} style={{
              padding: "7px 16px", borderRadius: "20px", fontSize: "12px", fontWeight: "600", cursor: "pointer", border: "none",
              background: active ? "#0f172a" : "white",
              color: active ? "white" : "#64748b",
              boxShadow: active ? "none" : "0 1px 3px rgba(0,0,0,0.06)",
              border: active ? "none" : "1px solid #e2e8f0",
            }}>
              {t === "All" ? "All Notifications" : (cfg?.label || t)}
              {t !== "All" && (
                <span style={{ marginLeft: "6px", fontSize: "10px", padding: "1px 6px", borderRadius: "10px", background: active ? "rgba(255,255,255,0.2)" : "#f1f5f9" }}>
                  {notifications.filter(n => n.type === t).length}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Notifications list */}
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {filtered.map(n => {
          const cfg = typeConfig[n.type] || typeConfig.enrollment;
          const pri = priorityStyle[n.priority];
          return (
            <div key={n.id} onClick={() => markRead(n.id)} style={{
              ...card, padding: "16px 20px", cursor: "pointer",
              borderLeft: n.read ? "3px solid transparent" : "3px solid #3b82f6",
              background: n.read ? "white" : "#fafbff",
              opacity: n.read ? 0.85 : 1,
              transition: "all 0.15s",
            }}
              onMouseEnter={e => e.currentTarget.style.boxShadow = "0 4px 24px rgba(0,0,0,0.08)"}
              onMouseLeave={e => e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.06), 0 4px 20px rgba(0,0,0,0.03)"}
            >
              <div style={{ display: "flex", alignItems: "flex-start", gap: "14px" }}>
                <div style={{ width: "40px", height: "40px", borderRadius: "12px", background: cfg.bg, color: cfg.color, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  {cfg.icon}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "10px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <span style={{ fontSize: "14px", fontWeight: "700", color: "#0f172a" }}>{n.title}</span>
                      {!n.read && <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#3b82f6", display: "inline-block", flexShrink: 0 }} />}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", flexShrink: 0 }}>
                      <span style={{ fontSize: "10px", fontWeight: "700", padding: "2px 8px", borderRadius: "10px", background: pri.bg, color: pri.color }}>{pri.label}</span>
                      <span style={{ fontSize: "11px", color: "#94a3b8", whiteSpace: "nowrap" }}>{n.time}</span>
                    </div>
                  </div>
                  <p style={{ fontSize: "13px", color: "#64748b", margin: "5px 0 0", lineHeight: "1.5" }}>{n.message}</p>
                </div>
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div style={{ ...card, textAlign: "center", padding: "48px", color: "#94a3b8" }}>
            <Bell size={32} style={{ margin: "0 auto 12px", display: "block", opacity: 0.4 }} />
            <p style={{ margin: 0, fontWeight: "600" }}>No notifications in this category</p>
          </div>
        )}
      </div>
    </div>
  );
}
