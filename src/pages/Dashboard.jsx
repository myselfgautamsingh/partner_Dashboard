import {
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, PieChart, Pie, Cell
} from "recharts";
import { Users, Shield, DollarSign, Activity, Upload, CheckCircle, XCircle, Clock, ArrowUpRight } from "lucide-react";
import KPICard from "../components/KPICard";
import { mockDashboardData as d } from "../firebase/mockData";

const PIE_COLORS = ["#6366f1", "#10b981", "#f59e0b", "#ef4444"];

const activityDot = {
  upload:     { bg: "#eff6ff", color: "#3b82f6" },
  claim:      { bg: "#f5f3ff", color: "#8b5cf6" },
  enrollment: { bg: "#f0fdf4", color: "#10b981" },
  payment:    { bg: "#fff7ed", color: "#f59e0b" },
};
const activityIcons = {
  upload: <Upload size={13} />, claim: <Shield size={13} />,
  enrollment: <Users size={13} />, payment: <DollarSign size={13} />,
};

const card = {
  background: "white", borderRadius: "8px", padding: "16px 18px",
  boxShadow: "0 1px 2px rgba(16,24,40,0.06)",
  border: "1px solid #e2e8f0",
};

const tooltipStyle = {
  contentStyle: { borderRadius: "6px", border: "1px solid #e2e8f0", boxShadow: "0 4px 12px rgba(0,0,0,0.08)", fontSize: "12px", padding: "8px 12px" },
  cursor: { fill: "rgba(99,102,241,0.04)" },
};

export default function Dashboard() {
  const pieData = [
    { name: "Paid", value: d.claimsStats.claimsPaid },
    { name: "Closed", value: d.claimsStats.closedClaims },
    { name: "Pending", value: d.claimsStats.pendingVerdict + d.claimsStats.pendingVerification },
    { name: "Rejected", value: d.claimsStats.rejectedClaims },
  ];

  const btnBase = { display: "flex", alignItems: "center", gap: "5px", padding: "6px 14px", fontSize: "12px", fontWeight: "500", borderRadius: "6px", cursor: "pointer", border: "1px solid #e2e8f0" };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <h2 style={{ fontSize: "18px", fontWeight: "700", color: "#0f172a", margin: 0 }}>Portfolio Overview</h2>
          <p style={{ fontSize: "12px", color: "#94a3b8", marginTop: "2px" }}>Performance summary — current period</p>
        </div>
        <div style={{ display: "flex", gap: "6px" }}>
          <button style={{ ...btnBase, background: "white", color: "#475569" }}>
            <ArrowUpRight size={13} /> Share
          </button>
          <button style={{ ...btnBase, background: "#0f172a", color: "white", border: "none" }}>
            <Upload size={13} /> Export
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px" }}>
        <KPICard label="Total Customers" value={d.summary.totalCustomers.value} trend={d.summary.totalCustomers.trend} icon={Users} color="blue" />
        <KPICard label="Active Policies" value={d.summary.activePolicies.value} trend={d.summary.activePolicies.trend} icon={Shield} color="green" />
        <KPICard label="Premium Collected" value={d.summary.premiumCollected.value} trend={d.summary.premiumCollected.trend} prefix="$" icon={DollarSign} color="purple" />
        <KPICard label="Claims Ratio" value={d.summary.claimsRatio.value} trend={d.summary.claimsRatio.trend} suffix="%" icon={Activity} color="orange" />
      </div>

      {/* Row 2: Enrollment chart + right panel */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: "12px" }}>

        {/* Enrollment area chart */}
        <div style={card}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
            <div>
              <h3 style={{ fontSize: "13px", fontWeight: "600", color: "#0f172a", margin: 0 }}>Enrollment Trend</h3>
              <p style={{ fontSize: "11px", color: "#94a3b8", marginTop: "2px" }}>New customers vs amendments — monthly</p>
            </div>
            <div style={{ display: "flex", gap: "12px" }}>
              {[{ label: "New", color: "#6366f1" }, { label: "Amendments", color: "#10b981" }].map(l => (
                <span key={l.label} style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "11px", color: "#64748b" }}>
                  <span style={{ width: "16px", height: "2px", background: l.color, display: "inline-block", borderRadius: "1px" }} />{l.label}
                </span>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={d.enrollmentMonthly} margin={{ top: 2, right: 4, left: -22, bottom: 0 }}>
              <defs>
                <linearGradient id="gNew" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366f1" stopOpacity={0.15} />
                  <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gAmend" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity={0.15} />
                  <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="2 4" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <Tooltip {...tooltipStyle} />
              <Area type="monotone" dataKey="newCustomers" stroke="#6366f1" strokeWidth={1.5} fill="url(#gNew)" dot={false} name="New" />
              <Area type="monotone" dataKey="amendments" stroke="#10b981" strokeWidth={1.5} fill="url(#gAmend)" dot={false} name="Amendments" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Right panel: Claims + Upload stats */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>

          {/* Claims donut */}
          <div style={{ ...card, background: "#0f172a", border: "1px solid rgba(255,255,255,0.06)" }}>
            <p style={{ fontSize: "11px", fontWeight: "600", color: "#475569", margin: "0 0 12px", letterSpacing: "0.05em", textTransform: "uppercase" }}>Claims Summary</p>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <ResponsiveContainer width={80} height={80}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={24} outerRadius={38} dataKey="value" strokeWidth={1} stroke="#0f172a">
                    {pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "6px" }}>
                {pieData.map((item, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: PIE_COLORS[i], display: "inline-block", flexShrink: 0 }} />
                      <span style={{ fontSize: "11px", color: "#64748b" }}>{item.name}</span>
                    </div>
                    <span style={{ fontSize: "12px", fontWeight: "600", color: "#e2e8f0", fontVariantNumeric: "tabular-nums" }}>{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Upload stats */}
          <div style={card}>
            <p style={{ fontSize: "11px", fontWeight: "600", color: "#64748b", margin: "0 0 10px", letterSpacing: "0.05em", textTransform: "uppercase" }}>Upload Stats</p>
            {[
              { label: "Files Uploaded",    value: d.uploadStats.filesUploaded,                    color: "#3b82f6" },
              { label: "Records Processed", value: d.uploadStats.uploadedRecords.toLocaleString(),  color: "#10b981" },
              { label: "Rejected",          value: d.uploadStats.rejectedRecords,                   color: "#ef4444" },
              { label: "Pending Payment",   value: d.uploadStats.pendingPayment,                    color: "#f59e0b" },
            ].map(({ label, value, color }) => (
              <div key={label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "5px 0", borderBottom: "1px solid #f8fafc" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "7px" }}>
                  <span style={{ width: "3px", height: "14px", borderRadius: "2px", background: color, display: "inline-block", flexShrink: 0 }} />
                  <span style={{ fontSize: "12px", color: "#475569" }}>{label}</span>
                </div>
                <span style={{ fontSize: "13px", fontWeight: "600", color: "#0f172a", fontVariantNumeric: "tabular-nums" }}>{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 3: Payments bar + Activity */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>

        {/* Payments bar chart */}
        <div style={card}>
          <div style={{ marginBottom: "12px" }}>
            <h3 style={{ fontSize: "13px", fontWeight: "600", color: "#0f172a", margin: 0 }}>Payments Overview</h3>
            <p style={{ fontSize: "11px", color: "#94a3b8", marginTop: "2px" }}>Monthly collected vs pending vs rejected</p>
          </div>
          <ResponsiveContainer width="100%" height={170}>
            <BarChart data={d.paymentsMonthly} margin={{ top: 0, right: 4, left: -22, bottom: 0 }} barSize={6} barGap={2}>
              <CartesianGrid strokeDasharray="2 4" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <Tooltip {...tooltipStyle} />
              <Legend iconType="square" iconSize={6} wrapperStyle={{ fontSize: "11px", paddingTop: "8px" }} />
              <Bar dataKey="collected" fill="#6366f1" radius={[2, 2, 0, 0]} name="Collected" />
              <Bar dataKey="pending" fill="#f59e0b" radius={[2, 2, 0, 0]} name="Pending" />
              <Bar dataKey="rejected" fill="#ef4444" radius={[2, 2, 0, 0]} name="Rejected" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Recent Activity */}
        <div style={card}>
          <h3 style={{ fontSize: "13px", fontWeight: "600", color: "#0f172a", margin: "0 0 12px" }}>Recent Activity</h3>
          <div style={{ display: "flex", flexDirection: "column" }}>
            {d.recentActivity.map((item, i) => {
              const dot = activityDot[item.type] || activityDot.upload;
              return (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "10px", padding: "8px 0", borderBottom: i < d.recentActivity.length - 1 ? "1px solid #f8fafc" : "none" }}>
                  <span style={{ width: "24px", height: "24px", borderRadius: "6px", background: dot.bg, color: dot.color, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: "1px" }}>
                    {activityIcons[item.type]}
                  </span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: "12px", color: "#334155", margin: 0, lineHeight: "1.4" }}>{item.message}</p>
                    <p style={{ fontSize: "11px", color: "#94a3b8", margin: "2px 0 0" }}>{item.time}</p>
                  </div>
                  <span style={{ fontSize: "10px", fontWeight: "600", padding: "2px 6px", borderRadius: "4px", flexShrink: 0,
                    background: item.status === "success" ? "#f0fdf4" : item.status === "warning" ? "#fff7ed" : "#eff6ff",
                    color: item.status === "success" ? "#059669" : item.status === "warning" ? "#d97706" : "#3b82f6",
                  }}>{item.status}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Branch Performance Table */}
      <div style={card}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
          <h3 style={{ fontSize: "13px", fontWeight: "600", color: "#0f172a", margin: 0 }}>Branch Performance</h3>
          <span style={{ fontSize: "11px", color: "#94a3b8" }}>{d.branchPerformance.length} branches</span>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #e2e8f0" }}>
                {["Branch", "Customers", "Premium (₹)", "Claims", "Ratio"].map((h, i) => (
                  <th key={h} style={{ textAlign: i === 0 ? "left" : "right", padding: "0 10px 8px", fontSize: "10px", fontWeight: "600", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.06em", whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {d.branchPerformance.map((b, i) => (
                <tr key={i} style={{ borderBottom: "1px solid #f8fafc", transition: "background 0.1s" }}
                  onMouseEnter={e => e.currentTarget.style.background = "#f8fafc"}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                >
                  <td style={{ padding: "8px 10px", fontWeight: "500", color: "#1e293b", fontSize: "13px" }}>{b.branch}</td>
                  <td style={{ padding: "8px 10px", textAlign: "right", color: "#475569", fontVariantNumeric: "tabular-nums" }}>{b.customers.toLocaleString()}</td>
                  <td style={{ padding: "8px 10px", textAlign: "right", color: "#475569", fontVariantNumeric: "tabular-nums" }}>{b.premium.toLocaleString()}</td>
                  <td style={{ padding: "8px 10px", textAlign: "right", color: "#475569", fontVariantNumeric: "tabular-nums" }}>{b.claims}</td>
                  <td style={{ padding: "8px 10px", textAlign: "right" }}>
                    <span style={{ fontSize: "11px", fontWeight: "600", padding: "2px 7px", borderRadius: "4px",
                      background: parseFloat(b.ratio) < 4 ? "#f0fdf4" : "#fff7ed",
                      color: parseFloat(b.ratio) < 4 ? "#059669" : "#d97706",
                    }}>{b.ratio}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
