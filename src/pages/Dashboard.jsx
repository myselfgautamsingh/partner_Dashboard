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
  background: "white", borderRadius: "16px", padding: "22px",
  boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 4px 20px rgba(0,0,0,0.03)",
  border: "1px solid rgba(0,0,0,0.05)",
};

const tooltipStyle = {
  contentStyle: { borderRadius: "10px", border: "none", boxShadow: "0 8px 30px rgba(0,0,0,0.12)", fontSize: "12px", padding: "10px 14px" },
  cursor: { fill: "rgba(99,102,241,0.05)" },
};

export default function Dashboard() {
  const pieData = [
    { name: "Paid", value: d.claimsStats.claimsPaid },
    { name: "Closed", value: d.claimsStats.closedClaims },
    { name: "Pending", value: d.claimsStats.pendingVerdict + d.claimsStats.pendingVerification },
    { name: "Rejected", value: d.claimsStats.rejectedClaims },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "22px" }}>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <h2 style={{ fontSize: "20px", fontWeight: "800", color: "#0f172a", margin: 0 }}>Overview</h2>
          <p style={{ fontSize: "13px", color: "#94a3b8", marginTop: "3px" }}>Your performance summary this period</p>
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          <button style={{ padding: "8px 16px", fontSize: "13px", fontWeight: "600", color: "#64748b", border: "1px solid #e2e8f0", borderRadius: "10px", background: "white", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}>
            <ArrowUpRight size={14} /> Share
          </button>
          <button style={{ padding: "8px 16px", fontSize: "13px", fontWeight: "600", color: "white", background: "linear-gradient(135deg, #3b82f6, #6366f1)", border: "none", borderRadius: "10px", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px", boxShadow: "0 4px 14px rgba(99,102,241,0.35)" }}>
            <Upload size={14} /> Export
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px" }}>
        <KPICard label="Total Customers" value={d.summary.totalCustomers.value} trend={d.summary.totalCustomers.trend} icon={Users} color="blue" />
        <KPICard label="Active Policies" value={d.summary.activePolicies.value} trend={d.summary.activePolicies.trend} icon={Shield} color="green" />
        <KPICard label="Premium Collected" value={d.summary.premiumCollected.value} trend={d.summary.premiumCollected.trend} prefix="$" icon={DollarSign} color="purple" />
        <KPICard label="Claims Ratio" value={d.summary.claimsRatio.value} trend={d.summary.claimsRatio.trend} suffix="%" icon={Activity} color="orange" />
      </div>

      {/* Row 2: Enrollment chart + Claims donut */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: "16px" }}>

        {/* Enrollment area chart */}
        <div style={card}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px" }}>
            <div>
              <h3 style={{ fontSize: "14px", fontWeight: "700", color: "#0f172a", margin: 0 }}>Enrollment Trend</h3>
              <p style={{ fontSize: "12px", color: "#94a3b8", marginTop: "3px" }}>Monthly new customers vs amendments</p>
            </div>
            <div style={{ display: "flex", gap: "14px", fontSize: "11px", color: "#64748b" }}>
              <span style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                <span style={{ width: "10px", height: "3px", background: "#6366f1", borderRadius: "2px", display: "inline-block" }}></span> New
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                <span style={{ width: "10px", height: "3px", background: "#10b981", borderRadius: "2px", display: "inline-block" }}></span> Amendments
              </span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={210}>
            <AreaChart data={d.enrollmentMonthly} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="gNew" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366f1" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gAmend" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <Tooltip {...tooltipStyle} />
              <Area type="monotone" dataKey="newCustomers" stroke="#6366f1" strokeWidth={2.5} fill="url(#gNew)" dot={false} name="New" />
              <Area type="monotone" dataKey="amendments" stroke="#10b981" strokeWidth={2.5} fill="url(#gAmend)" dot={false} name="Amendments" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Claims donut */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div style={{ ...card, background: "linear-gradient(140deg, #1e293b 0%, #0f172a 100%)", flex: 1 }}>
            <h3 style={{ fontSize: "13px", fontWeight: "600", color: "#94a3b8", margin: "0 0 16px" }}>Claims Summary</h3>
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <ResponsiveContainer width={100} height={100}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={30} outerRadius={46} dataKey="value" strokeWidth={2} stroke="#0f172a">
                    {pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "8px" }}>
                {pieData.map((item, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "7px" }}>
                      <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: PIE_COLORS[i], display: "inline-block", flexShrink: 0 }}></span>
                      <span style={{ fontSize: "12px", color: "#94a3b8" }}>{item.name}</span>
                    </div>
                    <span style={{ fontSize: "13px", fontWeight: "700", color: "white" }}>{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Upload stats */}
          <div style={card}>
            <h3 style={{ fontSize: "13px", fontWeight: "700", color: "#0f172a", margin: "0 0 14px" }}>Upload Stats</h3>
            {[
              { label: "Files Uploaded", value: d.uploadStats.filesUploaded, bg: "#eff6ff", color: "#3b82f6", icon: <Upload size={12} /> },
              { label: "Records Processed", value: d.uploadStats.uploadedRecords.toLocaleString(), bg: "#f0fdf4", color: "#10b981", icon: <CheckCircle size={12} /> },
              { label: "Rejected", value: d.uploadStats.rejectedRecords, bg: "#fef2f2", color: "#ef4444", icon: <XCircle size={12} /> },
              { label: "Pending Payment", value: d.uploadStats.pendingPayment, bg: "#fff7ed", color: "#f59e0b", icon: <Clock size={12} /> },
            ].map(({ label, value, bg, color, icon }) => (
              <div key={label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ width: "24px", height: "24px", borderRadius: "7px", background: bg, color, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{icon}</span>
                  <span style={{ fontSize: "12px", color: "#64748b" }}>{label}</span>
                </div>
                <span style={{ fontSize: "13px", fontWeight: "700", color: "#0f172a" }}>{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 3: Payments bar + Activity */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>

        {/* Payments bar chart */}
        <div style={card}>
          <h3 style={{ fontSize: "14px", fontWeight: "700", color: "#0f172a", margin: "0 0 4px" }}>Payments Overview</h3>
          <p style={{ fontSize: "12px", color: "#94a3b8", margin: "0 0 20px" }}>Monthly collected vs pending vs rejected</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={d.paymentsMonthly} margin={{ top: 0, right: 5, left: -20, bottom: 0 }} barSize={7} barGap={3}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <Tooltip {...tooltipStyle} />
              <Legend iconType="circle" iconSize={7} wrapperStyle={{ fontSize: "11px", paddingTop: "10px" }} />
              <Bar dataKey="collected" fill="#6366f1" radius={[4, 4, 0, 0]} name="Collected" />
              <Bar dataKey="pending" fill="#f59e0b" radius={[4, 4, 0, 0]} name="Pending" />
              <Bar dataKey="rejected" fill="#ef4444" radius={[4, 4, 0, 0]} name="Rejected" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Recent Activity */}
        <div style={card}>
          <h3 style={{ fontSize: "14px", fontWeight: "700", color: "#0f172a", margin: "0 0 18px" }}>Recent Activity</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            {d.recentActivity.map((item, i) => {
              const dot = activityDot[item.type] || activityDot.upload;
              return (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
                  <span style={{ width: "30px", height: "30px", borderRadius: "50%", background: dot.bg, color: dot.color, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: "1px" }}>
                    {activityIcons[item.type]}
                  </span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: "12.5px", color: "#334155", margin: 0, lineHeight: "1.5" }}>{item.message}</p>
                    <p style={{ fontSize: "11px", color: "#94a3b8", margin: "2px 0 0" }}>{item.time}</p>
                  </div>
                  <span style={{ fontSize: "10px", fontWeight: "600", padding: "2px 8px", borderRadius: "20px", flexShrink: 0, marginTop: "3px",
                    background: item.status === "success" ? "#f0fdf4" : item.status === "warning" ? "#fff7ed" : "#eff6ff",
                    color: item.status === "success" ? "#10b981" : item.status === "warning" ? "#f59e0b" : "#3b82f6",
                  }}>{item.status}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Branch Performance Table */}
      <div style={card}>
        <h3 style={{ fontSize: "14px", fontWeight: "700", color: "#0f172a", margin: "0 0 18px" }}>Branch Performance</h3>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #f1f5f9" }}>
                {["Branch", "Customers", "Premium", "Claims", "Claims Ratio"].map((h, i) => (
                  <th key={h} style={{ textAlign: i === 0 ? "left" : "right", padding: "0 12px 12px", fontSize: "11px", fontWeight: "600", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em", whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {d.branchPerformance.map((b, i) => (
                <tr key={i} style={{ borderBottom: "1px solid #f8fafc", transition: "background 0.1s" }}
                  onMouseEnter={e => e.currentTarget.style.background = "#f8fafc"}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                >
                  <td style={{ padding: "13px 12px", fontWeight: "600", color: "#1e293b" }}>{b.branch}</td>
                  <td style={{ padding: "13px 12px", textAlign: "right", color: "#475569" }}>{b.customers.toLocaleString()}</td>
                  <td style={{ padding: "13px 12px", textAlign: "right", color: "#475569" }}>${b.premium.toLocaleString()}</td>
                  <td style={{ padding: "13px 12px", textAlign: "right", color: "#475569" }}>{b.claims}</td>
                  <td style={{ padding: "13px 12px", textAlign: "right" }}>
                    <span style={{
                      padding: "3px 10px", borderRadius: "20px", fontSize: "11px", fontWeight: "700",
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
