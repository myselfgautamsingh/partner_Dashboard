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
      background: "white", borderBottom: "1px solid #e2e8f0",
      padding: "0 24px", height: "52px",
      display: "flex", alignItems: "center", justifyContent: "space-between",
      boxShadow: "0 1px 2px rgba(16,24,40,0.04)",
      position: "sticky", top: 0, zIndex: 10,
    }}>

      {/* Left: greeting */}
      <div>
        <div style={{ display: "flex", alignItems: "baseline", gap: "5px" }}>
          <span style={{ fontSize: "13px", fontWeight: "600", color: "#64748b" }}>{getGreeting()},</span>
          <span style={{ fontSize: "13px", fontWeight: "700", color: "#0f172a" }}>{displayName}</span>
        </div>
        <div style={{ fontSize: "11px", color: "#94a3b8", marginTop: "1px", letterSpacing: "0.01em" }}>
          {mockDashboardData.partnerName} &nbsp;&middot;&nbsp; {today}
        </div>
      </div>

      {/* Right: actions */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>

        {/* Search */}
        <div style={{ display: "flex", alignItems: "center", gap: "6px", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "6px", padding: "5px 12px", cursor: "text" }}>
          <Search size={13} color="#94a3b8" />
          <span style={{ fontSize: "12px", color: "#cbd5e1" }}>Search...</span>
        </div>

        {/* Bell */}
        <button style={{ width: "32px", height: "32px", borderRadius: "6px", border: "1px solid #e2e8f0", background: "#f8fafc", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", position: "relative" }}>
          <Bell size={14} color="#64748b" />
          <span style={{ position: "absolute", top: "6px", right: "6px", width: "6px", height: "6px", borderRadius: "50%", background: "#ef4444", border: "1.5px solid white" }} />
        </button>

        {/* Avatar */}
        <div style={{ width: "30px", height: "30px", borderRadius: "50%", cursor: "pointer", background: "linear-gradient(135deg, #3b82f6, #6366f1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: "700", color: "white" }}>{initials}</div>
      </div>
    </header>
  );
}
