import { RefreshCw, AlertTriangle, Clock, CheckCircle, Download } from "lucide-react";
import { mockDashboardData as d } from "../firebase/mockData";

const card = { background: "white", borderRadius: "12px", padding: "18px 20px", boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 4px 20px rgba(0,0,0,0.03)", border: "1px solid rgba(0,0,0,0.05)" };

const statusConfig = {
  Critical:  { bg: "#fef2f2",  color: "#dc2626", border: "#fca5a5", icon: <AlertTriangle size={13}/> },
  "Due Soon":{ bg: "#fff7ed",  color: "#d97706", border: "#fcd34d", icon: <Clock size={13}/> },
  Upcoming:  { bg: "#f0fdf4",  color: "#059669", border: "#86efac", icon: <CheckCircle size={13}/> },
  Expired:   { bg: "#f8fafc",  color: "#64748b", border: "#cbd5e1", icon: <RefreshCw size={13}/> },
};

export default function Renewals() {
  const critical  = d.renewals.filter(r => r.status === "Critical").length;
  const dueSoon   = d.renewals.filter(r => r.status === "Due Soon").length;
  const expired   = d.renewals.filter(r => r.status === "Expired").length;
  const upcoming  = d.renewals.filter(r => r.status === "Upcoming").length;

  const sorted = [...d.renewals].sort((a, b) => a.daysLeft - b.daysLeft);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "22px" }}>

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <h2 style={{ fontSize: "20px", fontWeight: "800", color: "#0f172a", margin: 0 }}>Policy Renewals</h2>
          <p style={{ fontSize: "13px", color: "#94a3b8", marginTop: "3px" }}>Track expiring and renewing member policies</p>
        </div>
        <button style={{ display: "flex", alignItems: "center", gap: "7px", padding: "10px 18px", borderRadius: "10px", background: "#0f172a", color: "white", border: "none", fontSize: "13px", fontWeight: "600", cursor: "pointer" }}>
          <Download size={14} /> Export List
        </button>
      </div>

      {/* Alert banner if critical */}
      {critical > 0 && (
        <div style={{ background: "linear-gradient(135deg,#fef2f2,#fff5f5)", border: "1px solid #fca5a5", borderRadius: "14px", padding: "16px 20px", display: "flex", alignItems: "center", gap: "14px" }}>
          <div style={{ width: "40px", height: "40px", borderRadius: "12px", background: "#ef4444", color: "white", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <AlertTriangle size={18} />
          </div>
          <div>
            <p style={{ margin: 0, fontWeight: "700", color: "#dc2626", fontSize: "14px" }}>{critical} policies expire within 5 days — action required</p>
            <p style={{ margin: "3px 0 0", fontSize: "12px", color: "#ef4444" }}>Contact these members immediately to avoid lapse in coverage.</p>
          </div>
        </div>
      )}

      {/* Summary tiles */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "14px" }}>
        {[
          { label: "Critical (0-7 days)",  value: critical, color: "#ef4444", bg: "#fef2f2", icon: <AlertTriangle size={16}/> },
          { label: "Due Soon (8-30 days)", value: dueSoon,  color: "#f59e0b", bg: "#fff7ed", icon: <Clock size={16}/> },
          { label: "Upcoming (31+ days)",  value: upcoming, color: "#10b981", bg: "#f0fdf4", icon: <CheckCircle size={16}/> },
          { label: "Expired",              value: expired,  color: "#64748b", bg: "#f8fafc", icon: <RefreshCw size={16}/> },
        ].map(({ label, value, color, bg, icon }) => (
          <div key={label} style={{ ...card, padding: "18px", position: "relative", overflow: "hidden" }}>
            <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: bg, color, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "10px" }}>{icon}</div>
            <div style={{ fontSize: "28px", fontWeight: "800", color: "#0f172a", letterSpacing: "-0.5px" }}>{value}</div>
            <div style={{ fontSize: "11px", color: "#94a3b8", marginTop: "4px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.04em" }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Renewals table */}
      <div style={card}>
        <h3 style={{ fontSize: "14px", fontWeight: "700", color: "#0f172a", margin: "0 0 18px" }}>All Policies — Sorted by Urgency</h3>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #f1f5f9" }}>
                {["Policy ID", "Member", "Plan", "Branch", "Start Date", "Expiry Date", "Days Left", "Premium/yr", "Status", "Action"].map((h, i) => (
                  <th key={i} style={{ textAlign: "left", padding: "0 14px 12px", fontSize: "11px", fontWeight: "600", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em", whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sorted.map((r, i) => {
                const st = statusConfig[r.status] || statusConfig.Upcoming;
                const daysText = r.daysLeft < 0 ? `${Math.abs(r.daysLeft)} days ago` : r.daysLeft === 0 ? "Today" : `${r.daysLeft} days`;
                const daysColor = r.daysLeft < 0 ? "#64748b" : r.daysLeft <= 7 ? "#dc2626" : r.daysLeft <= 30 ? "#d97706" : "#059669";
                return (
                  <tr key={i} style={{ borderBottom: "1px solid #f8fafc", transition: "background 0.1s", cursor: "default" }}
                    onMouseEnter={e => e.currentTarget.style.background = "#f8fafc"}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                  >
                    <td style={{ padding: "13px 14px", color: "#64748b", fontFamily: "monospace", fontSize: "12px" }}>{r.id}</td>
                    <td style={{ padding: "13px 14px", fontWeight: "600", color: "#1e293b" }}>{r.member}</td>
                    <td style={{ padding: "13px 14px" }}>
                      <span style={{ fontSize: "11px", padding: "3px 9px", borderRadius: "20px", background: "#eff6ff", color: "#3b82f6", fontWeight: "600" }}>{r.plan}</span>
                    </td>
                    <td style={{ padding: "13px 14px", color: "#475569" }}>{r.branch}</td>
                    <td style={{ padding: "13px 14px", color: "#475569", whiteSpace: "nowrap" }}>{r.startDate}</td>
                    <td style={{ padding: "13px 14px", color: "#475569", whiteSpace: "nowrap" }}>{r.expiryDate}</td>
                    <td style={{ padding: "13px 14px" }}>
                      <span style={{ fontWeight: "700", color: daysColor, fontSize: "13px" }}>{daysText}</span>
                    </td>
                    <td style={{ padding: "13px 14px", color: "#475569", fontWeight: "600" }}>${r.premium.toLocaleString()}</td>
                    <td style={{ padding: "13px 14px" }}>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: "5px", fontSize: "11px", fontWeight: "700", padding: "4px 10px", borderRadius: "20px", background: st.bg, color: st.color, border: `1px solid ${st.border}` }}>
                        {st.icon} {r.status}
                      </span>
                    </td>
                    <td style={{ padding: "13px 14px" }}>
                      <button style={{
                        padding: "6px 14px", borderRadius: "8px", fontSize: "11px", fontWeight: "600", cursor: "pointer", border: "none",
                        background: r.status === "Expired" ? "#f1f5f9" : r.status === "Critical" ? "#ef4444" : "#3b82f6",
                        color: r.status === "Expired" ? "#64748b" : "white",
                      }}>
                        {r.status === "Expired" ? "Re-enroll" : "Renew Now"}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Info card */}
      <div style={{ ...card, background: "linear-gradient(140deg,#1e293b,#0f172a)", padding: "20px 24px" }}>
        <p style={{ fontSize: "13px", fontWeight: "700", color: "white", margin: "0 0 6px" }}>Why renewals matter</p>
        <p style={{ fontSize: "12px", color: "#64748b", margin: 0, lineHeight: "1.6" }}>
          When a member policy lapses, they lose coverage immediately. Any claims filed after expiry will be rejected by the insurer. 
          Renewing on time ensures continuous protection for your members and avoids re-enrollment paperwork.
        </p>
      </div>
    </div>
  );
}
