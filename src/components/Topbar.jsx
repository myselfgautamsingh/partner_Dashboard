import { Bell, Search } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { mockDashboardData } from "../firebase/mockData";

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good Morning";
  if (h < 17) return "Good Afternoon";
  return "Good Evening";
}

export default function Topbar() {
  const { user } = useAuth();
  const today = new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
  const displayName = user?.displayName || user?.email?.split("@")[0] || "Partner";
  const initials = displayName.slice(0, 2).toUpperCase();

  return (
    <header style={{
      background: "white", borderBottom: "1px solid #f1f5f9",
      padding: "0 28px", height: "64px",
      display: "flex", alignItems: "center", justifyContent: "space-between",
      boxShadow: "0 1px 0 #f1f5f9",
      position: "sticky", top: 0, zIndex: 10,
    }}>

      {/* Left: greeting */}
      <div>
        <div style={{ display: "flex", alignItems: "baseline", gap: "6px" }}>
          <span style={{ fontSize: "17px", fontWeight: "700", color: "#0f172a" }}>{getGreeting()},</span>
          <span style={{ fontSize: "17px", fontWeight: "700", background: "linear-gradient(135deg, #3b82f6, #6366f1)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            {displayName}
          </span>
        </div>
        <div style={{ fontSize: "12px", color: "#94a3b8", marginTop: "1px" }}>
          {mockDashboardData.partnerName} | {today}
        </div>
      </div>

      {/* Right: actions */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>

        {/* Search pill */}
        <div style={{
          display: "flex", alignItems: "center", gap: "8px",
          background: "#f8fafc", border: "1px solid #e2e8f0",
          borderRadius: "24px", padding: "7px 16px", cursor: "text",
        }}>
          <Search size={14} color="#94a3b8" />
          <span style={{ fontSize: "13px", color: "#cbd5e1" }}>Search...</span>
        </div>

        {/* Bell */}
        <button style={{
          width: "38px", height: "38px", borderRadius: "50%", border: "1px solid #e2e8f0",
          background: "#f8fafc", display: "flex", alignItems: "center", justifyContent: "center",
          cursor: "pointer", position: "relative",
        }}>
          <Bell size={16} color="#64748b" />
          <span style={{
            position: "absolute", top: "8px", right: "8px",
            width: "7px", height: "7px", borderRadius: "50%",
            background: "#ef4444", border: "1.5px solid white",
          }}></span>
        </button>

        {/* Avatar */}
        <div style={{
          width: "38px", height: "38px", borderRadius: "50%", cursor: "pointer",
          background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "13px", fontWeight: "700", color: "white",
          boxShadow: "0 0 0 3px #eff6ff",
        }}>{initials}</div>
      </div>
    </header>
  );
}
