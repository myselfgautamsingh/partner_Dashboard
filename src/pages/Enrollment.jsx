import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Users, Shield, FileUp, XCircle, CreditCard, Clock } from "lucide-react";
import { mockDashboardData as d } from "../firebase/mockData";

const card = { background: "white", borderRadius: "16px", padding: "22px", boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 4px 20px rgba(0,0,0,0.03)", border: "1px solid rgba(0,0,0,0.05)" };
const tip = { contentStyle: { borderRadius: "10px", border: "none", boxShadow: "0 8px 30px rgba(0,0,0,0.12)", fontSize: "12px", padding: "10px 14px" } };

const kpis = [
  { label: "Total Customers", value: d.summary.totalCustomers.value, bg: "#eff6ff", color: "#3b82f6", icon: <Users size={18} /> },
  { label: "Active Policies",  value: d.summary.activePolicies.value,  bg: "#f0fdf4", color: "#10b981", icon: <Shield size={18} /> },
  { label: "Files Uploaded",   value: d.uploadStats.filesUploaded,     bg: "#f5f3ff", color: "#8b5cf6", icon: <FileUp size={18} /> },
  { label: "Rejected Records", value: d.uploadStats.rejectedRecords,   bg: "#fef2f2", color: "#ef4444", icon: <XCircle size={18} /> },
  { label: "Payments Done",    value: d.uploadStats.paymentsDone,      bg: "#f0fdf4", color: "#059669", icon: <CreditCard size={18} /> },
  { label: "Pending Payment",  value: d.uploadStats.pendingPayment,    bg: "#fff7ed", color: "#f59e0b", icon: <Clock size={18} /> },
];

export default function Enrollment() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "22px" }}>

      {/* Header */}
      <div>
        <h2 style={{ fontSize: "20px", fontWeight: "800", color: "#0f172a", margin: 0 }}>Enrollment</h2>
        <p style={{ fontSize: "13px", color: "#94a3b8", marginTop: "3px" }}>Customer enrollment statistics and trends</p>
      </div>

      {/* KPI tiles */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: "14px" }}>
        {kpis.map(({ label, value, bg, color, icon }) => (
          <div key={label} style={{ ...card, padding: "18px", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "3px", background: color, borderRadius: "16px 16px 0 0" }}></div>
            <div style={{ width: "38px", height: "38px", borderRadius: "11px", background: bg, color, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "10px" }}>{icon}</div>
            <div style={{ fontSize: "22px", fontWeight: "800", color: "#0f172a", letterSpacing: "-0.5px" }}>{typeof value === "number" ? value.toLocaleString() : value}</div>
            <div style={{ fontSize: "11px", color: "#94a3b8", marginTop: "4px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.04em" }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Area chart */}
      <div style={card}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px" }}>
          <div>
            <h3 style={{ fontSize: "14px", fontWeight: "700", color: "#0f172a", margin: 0 }}>Monthly Enrollment Trend</h3>
            <p style={{ fontSize: "12px", color: "#94a3b8", marginTop: "3px" }}>New customers enrolled each month</p>
          </div>
          <div style={{ display: "flex", gap: "14px", fontSize: "11px", color: "#64748b" }}>
            <span style={{ display: "flex", alignItems: "center", gap: "5px" }}><span style={{ width: "10px", height: "3px", background: "#6366f1", borderRadius: "2px", display: "inline-block" }}></span> New</span>
            <span style={{ display: "flex", alignItems: "center", gap: "5px" }}><span style={{ width: "10px", height: "3px", background: "#10b981", borderRadius: "2px", display: "inline-block" }}></span> Amendments</span>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={d.enrollmentMonthly} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="eG1" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6366f1" stopOpacity={0.2} /><stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="eG2" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity={0.2} /><stop offset="100%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
            <Tooltip {...tip} />
            <Area type="monotone" dataKey="newCustomers" stroke="#6366f1" strokeWidth={2.5} fill="url(#eG1)" dot={false} name="New Customers" />
            <Area type="monotone" dataKey="amendments" stroke="#10b981" strokeWidth={2.5} fill="url(#eG2)" dot={false} name="Amendments" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Bar chart */}
      <div style={card}>
        <h3 style={{ fontSize: "14px", fontWeight: "700", color: "#0f172a", margin: "0 0 4px" }}>Enrollment by Month</h3>
        <p style={{ fontSize: "12px", color: "#94a3b8", margin: "0 0 20px" }}>Grouped comparison of new vs amendment records</p>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={d.enrollmentMonthly} margin={{ top: 0, right: 5, left: -20, bottom: 0 }} barSize={9} barGap={3}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
            <Tooltip {...tip} />
            <Legend iconType="circle" iconSize={7} wrapperStyle={{ fontSize: "11px", paddingTop: "10px" }} />
            <Bar dataKey="newCustomers" fill="#6366f1" radius={[4, 4, 0, 0]} name="New Customers" />
            <Bar dataKey="amendments" fill="#10b981" radius={[4, 4, 0, 0]} name="Amendments" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
