import { useState } from "react";
import { Users, Search, Filter, Download, Eye } from "lucide-react";
import { mockDashboardData as d } from "../firebase/mockData";

const card = { background: "white", borderRadius: "16px", padding: "22px", boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 4px 20px rgba(0,0,0,0.03)", border: "1px solid rgba(0,0,0,0.05)" };

const statusStyle = {
  Active:    { bg: "#f0fdf4", color: "#059669" },
  Suspended: { bg: "#fff7ed", color: "#d97706" },
  Lapsed:    { bg: "#fef2f2", color: "#dc2626" },
};

export default function Members() {
  const [search, setSearch] = useState("");
  const [filterPlan, setFilterPlan] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterBranch, setFilterBranch] = useState("All");

  const plans    = ["All", ...new Set(d.members.map(m => m.plan))];
  const statuses = ["All", "Active", "Suspended", "Lapsed"];
  const branches = ["All", ...new Set(d.members.map(m => m.branch))];

  const filtered = d.members.filter(m => {
    const q = search.toLowerCase();
    const matchSearch = m.name.toLowerCase().includes(q) || m.id.toLowerCase().includes(q);
    const matchPlan   = filterPlan   === "All" || m.plan   === filterPlan;
    const matchStatus = filterStatus === "All" || m.status === filterStatus;
    const matchBranch = filterBranch === "All" || m.branch === filterBranch;
    return matchSearch && matchPlan && matchStatus && matchBranch;
  });

  const active    = d.members.filter(m => m.status === "Active").length;
  const suspended = d.members.filter(m => m.status === "Suspended").length;
  const lapsed    = d.members.filter(m => m.status === "Lapsed").length;
  const totalPremium = d.members.reduce((s, m) => s + m.premium, 0);

  const inputStyle = { height: "38px", border: "1px solid #e2e8f0", borderRadius: "10px", padding: "0 12px", fontSize: "13px", color: "#334155", background: "white", outline: "none", cursor: "pointer" };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "22px" }}>

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <h2 style={{ fontSize: "20px", fontWeight: "800", color: "#0f172a", margin: 0 }}>Members</h2>
          <p style={{ fontSize: "13px", color: "#94a3b8", marginTop: "3px" }}>All enrolled members across your branches and plans</p>
        </div>
        <button style={{ display: "flex", alignItems: "center", gap: "7px", padding: "10px 18px", borderRadius: "10px", background: "#0f172a", color: "white", border: "none", fontSize: "13px", fontWeight: "600", cursor: "pointer" }}>
          <Download size={14} /> Export CSV
        </button>
      </div>

      {/* Summary tiles */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "14px" }}>
        {[
          { label: "Total Members",   value: d.members.length, color: "#3b82f6", bg: "#eff6ff" },
          { label: "Active",          value: active,           color: "#10b981", bg: "#f0fdf4" },
          { label: "Suspended/Lapsed",value: suspended + lapsed, color: "#f59e0b", bg: "#fff7ed" },
          { label: "Total Premium",   value: "₹" + totalPremium.toLocaleString(), color: "#8b5cf6", bg: "#f5f3ff" },
        ].map(({ label, value, color, bg }) => (
          <div key={label} style={{ ...card, padding: "18px", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "3px", background: color, borderRadius: "16px 16px 0 0" }} />
            <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: bg, color, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "10px" }}>
              <Users size={16} />
            </div>
            <div style={{ fontSize: "22px", fontWeight: "800", color: "#0f172a", letterSpacing: "-0.5px" }}>{value}</div>
            <div style={{ fontSize: "11px", color: "#94a3b8", marginTop: "4px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.04em" }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ ...card, padding: "16px 22px" }}>
        <div style={{ display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap" }}>
          <div style={{ position: "relative", flex: 1, minWidth: "200px" }}>
            <Search size={14} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or member ID..." style={{ ...inputStyle, width: "100%", paddingLeft: "34px", boxSizing: "border-box" }} />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "7px" }}>
            <Filter size={14} style={{ color: "#94a3b8" }} />
            <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} style={inputStyle}>
              {statuses.map(s => <option key={s}>{s}</option>)}
            </select>
            <select value={filterPlan} onChange={e => setFilterPlan(e.target.value)} style={inputStyle}>
              {plans.map(p => <option key={p}>{p}</option>)}
            </select>
            <select value={filterBranch} onChange={e => setFilterBranch(e.target.value)} style={inputStyle}>
              {branches.map(b => <option key={b}>{b}</option>)}
            </select>
          </div>
          <span style={{ fontSize: "12px", color: "#94a3b8" }}>{filtered.length} of {d.members.length} members</span>
        </div>
      </div>

      {/* Members table */}
      <div style={card}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #f1f5f9" }}>
                {["Member ID", "Name", "Branch", "Plan", "Enrolled", "Premium/yr", "Claims", "Last Claim", "Status", ""].map((h, i) => (
                  <th key={i} style={{ textAlign: "left", padding: "0 14px 12px", fontSize: "11px", fontWeight: "600", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em", whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((m, i) => {
                const st = statusStyle[m.status] || statusStyle.Active;
                const initials = m.name.split(" ").map(w => w[0]).join("").slice(0, 2);
                return (
                  <tr key={i} style={{ borderBottom: "1px solid #f8fafc", cursor: "default", transition: "background 0.1s" }}
                    onMouseEnter={e => e.currentTarget.style.background = "#f8fafc"}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                  >
                    <td style={{ padding: "13px 14px", color: "#64748b", fontFamily: "monospace", fontSize: "12px" }}>{m.id}</td>
                    <td style={{ padding: "13px 14px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "linear-gradient(135deg,#3b82f6,#6366f1)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: "700", flexShrink: 0 }}>{initials}</div>
                        <div>
                          <div style={{ fontWeight: "600", color: "#1e293b" }}>{m.name}</div>
                          <div style={{ fontSize: "11px", color: "#94a3b8" }}>DOB: {m.dob}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: "13px 14px", color: "#475569" }}>{m.branch}</td>
                    <td style={{ padding: "13px 14px" }}>
                      <span style={{ fontSize: "11px", padding: "3px 9px", borderRadius: "20px", background: "#eff6ff", color: "#3b82f6", fontWeight: "600" }}>{m.plan}</span>
                    </td>
                    <td style={{ padding: "13px 14px", color: "#475569", whiteSpace: "nowrap" }}>{m.enrolledDate}</td>
                    <td style={{ padding: "13px 14px", color: "#475569", fontWeight: "600" }}>₹{m.premium.toLocaleString()}</td>
                    <td style={{ padding: "13px 14px", textAlign: "center" }}>
                      <span style={{ fontWeight: "700", color: m.claims > 3 ? "#ef4444" : m.claims > 0 ? "#f59e0b" : "#10b981" }}>{m.claims}</span>
                    </td>
                    <td style={{ padding: "13px 14px", color: "#94a3b8", fontSize: "12px" }}>{m.lastClaim}</td>
                    <td style={{ padding: "13px 14px" }}>
                      <span style={{ fontSize: "11px", fontWeight: "700", padding: "3px 10px", borderRadius: "20px", background: st.bg, color: st.color }}>{m.status}</span>
                    </td>
                    <td style={{ padding: "13px 14px" }}>
                      <button style={{ background: "none", border: "1px solid #e2e8f0", borderRadius: "8px", padding: "5px 10px", cursor: "pointer", color: "#64748b", display: "flex", alignItems: "center", gap: "5px", fontSize: "11px" }}>
                        <Eye size={12} /> View
                      </button>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr><td colSpan={10} style={{ padding: "40px", textAlign: "center", color: "#94a3b8" }}>No members match your filters.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
