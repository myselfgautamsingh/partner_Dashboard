import { useState } from "react";
import { Package, Users, FileText, IndianRupee, TrendingUp } from "lucide-react";

const card = { background: "white", borderRadius: "0", padding: "22px", boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 4px 20px rgba(0,0,0,0.03)", border: "1px solid rgba(0,0,0,0.05)" };

const products = [
  {
    id: 1, name: "Group Health Shield", code: "GSSK", insurer: "Bajaj Allianz", type: "Group Health",
    status: "Active", members: 3240, policies: 3180, premium: 124500, claimsRatio: 4.2, accent: "#3b82f6",
  },
  {
    id: 2, name: "Individual Health Plus", code: "GSJS", insurer: "Bajaj Allianz", type: "Individual Health",
    status: "Active", members: 890, policies: 856, premium: 67200, claimsRatio: 3.8, accent: "#10b981",
  },
  {
    id: 3, name: "Group Term Life", code: "GTL-01", insurer: "SBI Life", type: "Term Life",
    status: "Active", members: 1200, policies: 1200, premium: 45000, claimsRatio: 1.2, accent: "#8b5cf6",
  },
  {
    id: 4, name: "Senior Health Care", code: "SHC-22", insurer: "LIC", type: "Individual Health",
    status: "Inactive", members: 0, policies: 0, premium: 0, claimsRatio: 0, accent: "#94a3b8",
  },
];

const typeColors = {
  "Group Health":      { bg: "#eff6ff", color: "#3b82f6" },
  "Individual Health": { bg: "#f0fdf4", color: "#10b981" },
  "Term Life":         { bg: "#f5f3ff", color: "#8b5cf6" },
};

export default function Products() {
  const [search, setSearch] = useState("");
  const [insurer, setInsurer] = useState("All");
  const [status, setStatus] = useState("All");

  const filtered = products.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.code.toLowerCase().includes(search.toLowerCase());
    const matchInsurer = insurer === "All" || p.insurer === insurer;
    const matchStatus = status === "All" || p.status === status;
    return matchSearch && matchInsurer && matchStatus;
  });

  const totalMembers = products.reduce((s, p) => s + p.members, 0);
  const totalPremium = products.reduce((s, p) => s + p.premium, 0);
  const activeCount = products.filter(p => p.status === "Active").length;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "22px" }}>

      {/* Header */}
      <div>
        <h2 style={{ fontSize: "20px", fontWeight: "800", color: "#0f172a", margin: 0 }}>My Products</h2>
        <p style={{ fontSize: "13px", color: "#94a3b8", marginTop: "3px" }}>Insurance plans available under your distribution partnership</p>
      </div>

      {/* Summary stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "14px" }}>
        {[
          { label: "Total Products",       value: products.length,                       icon: <Package size={17} />,    bg: "#eff6ff", color: "#3b82f6" },
          { label: "Active Products",       value: activeCount,                           icon: <TrendingUp size={17} />, bg: "#f0fdf4", color: "#10b981" },
          { label: "Total Members Enrolled",value: totalMembers.toLocaleString("en-IN"), icon: <Users size={17} />,      bg: "#f5f3ff", color: "#8b5cf6" },
          { label: "Total Premium Collected",value: `Rs. ${(totalPremium / 100000).toFixed(1)}L`, icon: <IndianRupee size={17} />, bg: "#fff7ed", color: "#f59e0b" },
        ].map(({ label, value, icon, bg, color }) => (
          <div key={label} style={{ ...card, padding: "18px", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "3px", background: color, borderRadius: "16px 16px 0 0" }}></div>
            <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: bg, color, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "10px" }}>{icon}</div>
            <div style={{ fontSize: "22px", fontWeight: "800", color: "#0f172a", letterSpacing: "-0.5px" }}>{value}</div>
            <div style={{ fontSize: "11px", color: "#94a3b8", marginTop: "4px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.04em" }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Filter bar */}
      <div style={{ display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap" }}>
        <input
          value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search by product name or code..."
          style={{ flex: 1, minWidth: "200px", padding: "9px 14px", border: "1px solid #e2e8f0", borderRadius: "8px", fontSize: "13px", color: "#0f172a", outline: "none", background: "white" }}
        />
        <select value={insurer} onChange={e => setInsurer(e.target.value)}
          style={{ padding: "9px 14px", border: "1px solid #e2e8f0", borderRadius: "8px", fontSize: "13px", color: "#0f172a", background: "white", cursor: "pointer", outline: "none" }}>
          {["All", "Bajaj Allianz", "SBI Life", "LIC"].map(i => <option key={i}>{i}</option>)}
        </select>
        <select value={status} onChange={e => setStatus(e.target.value)}
          style={{ padding: "9px 14px", border: "1px solid #e2e8f0", borderRadius: "8px", fontSize: "13px", color: "#0f172a", background: "white", cursor: "pointer", outline: "none" }}>
          {["All", "Active", "Inactive"].map(s => <option key={s}>{s}</option>)}
        </select>
      </div>

      {/* Product cards grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
        {filtered.map(p => (
          <div key={p.id} style={{ ...card, padding: 0, overflow: "hidden" }}>
            {/* Accent bar */}
            <div style={{ height: "4px", background: p.accent }}></div>
            <div style={{ padding: "20px 22px" }}>
              {/* Top row */}
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "14px" }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                    <h3 style={{ fontSize: "15px", fontWeight: "700", color: "#0f172a", margin: 0 }}>{p.name}</h3>
                    <span style={{ fontSize: "10px", fontWeight: "700", color: p.accent, background: `${p.accent}18`, padding: "2px 8px", borderRadius: "20px" }}>{p.code}</span>
                  </div>
                  <p style={{ fontSize: "12px", color: "#64748b", margin: 0 }}>{p.insurer}</p>
                </div>
                <div style={{ display: "flex", gap: "6px" }}>
                  <span style={{ fontSize: "10px", fontWeight: "600", padding: "3px 10px", borderRadius: "20px", background: typeColors[p.type]?.bg || "#f1f5f9", color: typeColors[p.type]?.color || "#64748b" }}>{p.type}</span>
                  <span style={{ fontSize: "10px", fontWeight: "700", padding: "3px 10px", borderRadius: "20px", background: p.status === "Active" ? "#f0fdf4" : "#f8fafc", color: p.status === "Active" ? "#10b981" : "#94a3b8" }}>{p.status}</span>
                </div>
              </div>

              {/* Stats grid */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "10px", marginBottom: "16px" }}>
                {[
                  { label: "Members",       value: p.members.toLocaleString("en-IN"),            icon: <Users size={13} /> },
                  { label: "Policies",      value: p.policies.toLocaleString("en-IN"),           icon: <FileText size={13} /> },
                  { label: "Premium",       value: p.premium > 0 ? `Rs.${(p.premium/1000).toFixed(0)}K` : "Rs.0", icon: <IndianRupee size={13} /> },
                  { label: "Claims Ratio",  value: `${p.claimsRatio}%`,                          icon: <TrendingUp size={13} /> },
                ].map(({ label, value, icon }) => (
                  <div key={label} style={{ background: "#f8fafc", borderRadius: "10px", padding: "10px 12px" }}>
                    <div style={{ color: "#94a3b8", marginBottom: "4px" }}>{icon}</div>
                    <div style={{ fontSize: "14px", fontWeight: "700", color: "#0f172a" }}>{value}</div>
                    <div style={{ fontSize: "10px", color: "#94a3b8", fontWeight: "600", marginTop: "1px" }}>{label}</div>
                  </div>
                ))}
              </div>

              <button style={{ width: "100%", padding: "9px", border: `1px solid ${p.accent}`, borderRadius: "8px", background: "none", color: p.accent, fontSize: "13px", fontWeight: "600", cursor: "pointer" }}>
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
