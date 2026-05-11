import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { mockDashboardData as d } from "../firebase/mockData";

const card = { background: "white", borderRadius: "0", padding: "22px", boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 4px 20px rgba(0,0,0,0.03)", border: "1px solid rgba(0,0,0,0.05)" };
const tip = { contentStyle: { borderRadius: "10px", border: "none", boxShadow: "0 8px 30px rgba(0,0,0,0.12)", fontSize: "12px", padding: "10px 14px" } };

export default function Branches() {
  const topBranch = [...d.branchPerformance].sort((a, b) => b.customers - a.customers)[0];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "22px" }}>

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <h2 style={{ fontSize: "20px", fontWeight: "800", color: "#0f172a", margin: 0 }}>Branch Performance</h2>
          <p style={{ fontSize: "13px", color: "#94a3b8", marginTop: "3px" }}>Per-branch breakdown of customers, premium, and claims</p>
        </div>
        <div style={{ ...card, padding: "16px 20px", background: "linear-gradient(140deg,#1e293b,#0f172a)" }}>
          <p style={{ fontSize: "10px", color: "#64748b", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.05em", margin: "0 0 4px" }}>Top Branch</p>
          <p style={{ fontSize: "15px", fontWeight: "700", color: "white", margin: 0 }}>{topBranch?.branch}</p>
          <p style={{ fontSize: "12px", color: "#10b981", margin: "2px 0 0" }}>{topBranch?.customers.toLocaleString()} customers</p>
        </div>
      </div>

      {/* Two horizontal bar charts side by side */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
        <div style={card}>
          <h3 style={{ fontSize: "14px", fontWeight: "700", color: "#0f172a", margin: "0 0 4px" }}>Customers by Branch</h3>
          <p style={{ fontSize: "12px", color: "#94a3b8", margin: "0 0 20px" }}>Total enrolled customers per branch</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={d.branchPerformance} layout="vertical" margin={{ top: 0, right: 20, left: 10, bottom: 0 }} barSize={14}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="branch" tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} width={110} />
              <Tooltip {...tip} />
              <Bar dataKey="customers" radius={[0, 6, 6, 0]} name="Customers">
                {d.branchPerformance.map((_, i) => (
                  <rect key={i} fill={`hsl(${230 + i * 15}, 80%, ${60 - i * 5}%)`} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div style={card}>
          <h3 style={{ fontSize: "14px", fontWeight: "700", color: "#0f172a", margin: "0 0 4px" }}>Premium by Branch</h3>
          <p style={{ fontSize: "12px", color: "#94a3b8", margin: "0 0 20px" }}>Total premium collected per branch (₹)</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={d.branchPerformance} layout="vertical" margin={{ top: 0, right: 20, left: 10, bottom: 0 }} barSize={14}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="branch" tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} width={110} />
              <Tooltip {...tip} formatter={(v) => [`₹${v.toLocaleString()}`, "Premium"]} />
              <Bar dataKey="premium" fill="#10b981" radius={[0, 6, 6, 0]} name="Premium (₹)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Detail table */}
      <div style={card}>
        <h3 style={{ fontSize: "14px", fontWeight: "700", color: "#0f172a", margin: "0 0 18px" }}>Branch Detail</h3>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #f1f5f9" }}>
                {["Branch", "Customers", "Premium", "Claims", "Claims Ratio"].map((h, i) => (
                  <th key={h} style={{ textAlign: i === 0 ? "left" : "right", padding: "0 14px 12px", fontSize: "11px", fontWeight: "600", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em", whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {d.branchPerformance.map((b, i) => {
                const ratio = parseFloat(b.ratio);
                const ratioColor = ratio < 4 ? "#059669" : ratio < 4.5 ? "#d97706" : "#dc2626";
                const ratioBg   = ratio < 4 ? "#f0fdf4"  : ratio < 4.5 ? "#fff7ed"  : "#fef2f2";
                return (
                  <tr key={i} style={{ borderBottom: "1px solid #f8fafc", transition: "background 0.1s", cursor: "default" }}
                    onMouseEnter={e => e.currentTarget.style.background = "#f8fafc"}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                  >
                    <td style={{ padding: "14px", fontWeight: "600", color: "#1e293b" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <div style={{ width: "28px", height: "28px", borderRadius: "8px", background: `hsl(${230 + i * 15},70%,94%)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "10px", fontWeight: "700", color: `hsl(${230 + i * 15},70%,40%)`, flexShrink: 0 }}>
                          {b.branch.slice(0, 2).toUpperCase()}
                        </div>
                        {b.branch}
                      </div>
                    </td>
                    <td style={{ padding: "14px", textAlign: "right", color: "#475569" }}>{b.customers.toLocaleString()}</td>
                    <td style={{ padding: "14px", textAlign: "right", color: "#475569" }}>₹{b.premium.toLocaleString()}</td>
                    <td style={{ padding: "14px", textAlign: "right", color: "#475569" }}>{b.claims}</td>
                    <td style={{ padding: "14px", textAlign: "right" }}>
                      <span style={{ padding: "3px 10px", borderRadius: "20px", fontSize: "11px", fontWeight: "700", background: ratioBg, color: ratioColor }}>{b.ratio}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
