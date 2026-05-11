import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { mockDashboardData as d } from "../firebase/mockData";

const card = { background: "white", borderRadius: "0", padding: "22px", boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 4px 20px rgba(0,0,0,0.03)", border: "1px solid rgba(0,0,0,0.05)" };
const tip = { contentStyle: { borderRadius: "10px", border: "none", boxShadow: "0 8px 30px rgba(0,0,0,0.12)", fontSize: "12px", padding: "10px 14px" } };

const pipelineSteps = [
  { label: "Filed",        key: "newClaims",            grad: "linear-gradient(135deg,#3b82f6,#6366f1)", glow: "rgba(99,102,241,0.3)" },
  { label: "Verification", key: "pendingVerification",  grad: "linear-gradient(135deg,#8b5cf6,#a78bfa)", glow: "rgba(139,92,246,0.3)" },
  { label: "Verdict",      key: "pendingVerdict",       grad: "linear-gradient(135deg,#f59e0b,#fbbf24)", glow: "rgba(245,158,11,0.3)" },
  { label: "Payment",      key: "pendingPayment",       grad: "linear-gradient(135deg,#f97316,#fb923c)", glow: "rgba(249,115,22,0.3)" },
  { label: "Paid",         key: "claimsPaid",           grad: "linear-gradient(135deg,#10b981,#34d399)", glow: "rgba(16,185,129,0.3)" },
  { label: "Closed",       key: "closedClaims",         grad: "linear-gradient(135deg,#64748b,#94a3b8)", glow: "rgba(100,116,139,0.3)" },
];

const statTiles = [
  { label: "New Claims",       key: "newClaims",           bg: "#eff6ff", color: "#3b82f6" },
  { label: "Pending Verif.",   key: "pendingVerification", bg: "#f5f3ff", color: "#8b5cf6" },
  { label: "Pending Verdict",  key: "pendingVerdict",      bg: "#fff7ed", color: "#f59e0b" },
  { label: "Pending Payment",  key: "pendingPayment",      bg: "#fff7ed", color: "#f97316" },
  { label: "Claims Paid",      key: "claimsPaid",          bg: "#f0fdf4", color: "#10b981" },
  { label: "Rejected",         key: "rejectedClaims",      bg: "#fef2f2", color: "#ef4444" },
  { label: "Closed",           key: "closedClaims",        bg: "#f8fafc", color: "#64748b" },
  { label: "Re-Opened",        key: "claimsReOpened",      bg: "#fff7ed", color: "#f59e0b" },
];

export default function Claims() {
  const { claimsStats: c, claimsMonthly } = d;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "22px" }}>

      {/* Header */}
      <div>
        <h2 style={{ fontSize: "20px", fontWeight: "800", color: "#0f172a", margin: 0 }}>Claims</h2>
        <p style={{ fontSize: "13px", color: "#94a3b8", marginTop: "3px" }}>Full claims pipeline and statistics</p>
      </div>

      {/* Stat tiles */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(8, 1fr)", gap: "12px" }}>
        {statTiles.map(({ label, key, bg, color }) => (
          <div key={key} style={{ ...card, padding: "16px", position: "relative", overflow: "hidden", textAlign: "center" }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "3px", background: color, borderRadius: "16px 16px 0 0" }}></div>
            <div style={{ fontSize: "24px", fontWeight: "800", color: "#0f172a", letterSpacing: "-0.5px" }}>{c[key]}</div>
            <div style={{ fontSize: "10px", color: "#94a3b8", marginTop: "4px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.04em" }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Summary highlight cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "16px" }}>
        <div style={{ ...card, background: "linear-gradient(140deg,#1e293b,#0f172a)", padding: "24px" }}>
          <p style={{ fontSize: "12px", color: "#64748b", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.05em", margin: "0 0 6px" }}>Total Amount Paid</p>
          <p style={{ fontSize: "32px", fontWeight: "800", color: "white", margin: 0, letterSpacing: "-1px" }}>₹{c.amountPaid.toLocaleString()}</p>
          <p style={{ fontSize: "12px", color: "#10b981", marginTop: "6px" }}>+12.4% Claims settled this period</p>
        </div>
        <div style={{ ...card, background: "linear-gradient(140deg,#1e293b,#0f172a)", padding: "24px" }}>
          <p style={{ fontSize: "12px", color: "#64748b", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.05em", margin: "0 0 6px" }}>SLA Compliance</p>
          <div style={{ display: "flex", alignItems: "baseline", gap: "8px" }}>
            <p style={{ fontSize: "32px", fontWeight: "800", color: "white", margin: 0, letterSpacing: "-1px" }}>{c.slaMet}%</p>
            <span style={{ fontSize: "13px", color: c.slaMet >= 90 ? "#10b981" : c.slaMet >= 75 ? "#f59e0b" : "#ef4444", fontWeight: "600" }}>
              {c.slaMet >= 90 ? "Excellent" : c.slaMet >= 75 ? "Good" : "Needs Attention"}
            </span>
          </div>
          <div style={{ marginTop: "12px", height: "6px", background: "rgba(255,255,255,0.1)", borderRadius: "4px", overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${c.slaMet}%`, background: c.slaMet >= 90 ? "#10b981" : c.slaMet >= 75 ? "#f59e0b" : "#ef4444", borderRadius: "4px", transition: "width 0.8s ease" }}></div>
          </div>
        </div>
      </div>

      {/* Pipeline */}
      <div style={card}>
        <h3 style={{ fontSize: "14px", fontWeight: "700", color: "#0f172a", margin: "0 0 18px" }}>Claims Pipeline</h3>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", overflowX: "auto", paddingBottom: "4px" }}>
          {pipelineSteps.map((step, i, arr) => (
            <div key={step.label} style={{ display: "flex", alignItems: "center", gap: "8px", flexShrink: 0 }}>
              <div style={{ background: step.grad, borderRadius: "12px", padding: "14px 20px", textAlign: "center", minWidth: "90px", boxShadow: `0 6px 20px ${step.glow}` }}>
                <div style={{ fontSize: "22px", fontWeight: "800", color: "white", lineHeight: 1 }}>{c[step.key]}</div>
                <div style={{ fontSize: "10px", fontWeight: "600", color: "rgba(255,255,255,0.8)", marginTop: "4px", textTransform: "uppercase", letterSpacing: "0.05em" }}>{step.label}</div>
              </div>
              {i < arr.length - 1 && (<svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{flexShrink:0}}><path d="M5 3l4 4-4 4" stroke="#cbd5e1" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>)}
            </div>
          ))}
        </div>
      </div>

      {/* Monthly trend line chart */}
      <div style={card}>
        <h3 style={{ fontSize: "14px", fontWeight: "700", color: "#0f172a", margin: "0 0 4px" }}>Monthly Claims Trend</h3>
        <p style={{ fontSize: "12px", color: "#94a3b8", margin: "0 0 20px" }}>Filed, approved, paid and rejected over time</p>
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={claimsMonthly} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
            <Tooltip {...tip} />
            <Legend iconType="circle" iconSize={7} wrapperStyle={{ fontSize: "11px", paddingTop: "10px" }} />
            <Line type="monotone" dataKey="filed" stroke="#6366f1" strokeWidth={2.5} dot={false} name="Filed" />
            <Line type="monotone" dataKey="approved" stroke="#10b981" strokeWidth={2.5} dot={false} name="Approved" />
            <Line type="monotone" dataKey="rejected" stroke="#ef4444" strokeWidth={2.5} dot={false} name="Rejected" />
            <Line type="monotone" dataKey="paid" stroke="#8b5cf6" strokeWidth={2.5} dot={false} name="Paid" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Bar chart */}
      <div style={card}>
        <h3 style={{ fontSize: "14px", fontWeight: "700", color: "#0f172a", margin: "0 0 4px" }}>Claims Volume by Month</h3>
        <p style={{ fontSize: "12px", color: "#94a3b8", margin: "0 0 20px" }}>Grouped bar view of filed, paid, and rejected</p>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={claimsMonthly} margin={{ top: 0, right: 5, left: -20, bottom: 0 }} barSize={8} barGap={3}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
            <Tooltip {...tip} />
            <Legend iconType="circle" iconSize={7} wrapperStyle={{ fontSize: "11px", paddingTop: "10px" }} />
            <Bar dataKey="filed" fill="#6366f1" radius={[4, 4, 0, 0]} name="Filed" />
            <Bar dataKey="paid" fill="#10b981" radius={[4, 4, 0, 0]} name="Paid" />
            <Bar dataKey="rejected" fill="#ef4444" radius={[4, 4, 0, 0]} name="Rejected" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

