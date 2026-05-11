import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Users, Shield, FileUp, XCircle, CreditCard, Clock } from "lucide-react";
import { mockDashboardData as d } from "../firebase/mockData";

const card = { background: "white", borderRadius: "8px", padding: "16px 18px", boxShadow: "0 1px 2px rgba(16,24,40,0.06)", border: "1px solid #e2e8f0" };
const tip = { contentStyle: { borderRadius: "6px", border: "1px solid #e2e8f0", boxShadow: "0 4px 12px rgba(0,0,0,0.08)", fontSize: "12px", padding: "8px 12px" } };

const kpis = [
  { label: "Total Customers", value: d.summary.totalCustomers.value, bg: "#eff6ff", color: "#3b82f6", icon: <Users size={15} /> },
  { label: "Active Policies",  value: d.summary.activePolicies.value,  bg: "#f0fdf4", color: "#10b981", icon: <Shield size={15} /> },
  { label: "Files Uploaded",   value: d.uploadStats.filesUploaded,     bg: "#f5f3ff", color: "#8b5cf6", icon: <FileUp size={15} /> },
  { label: "Rejected Records", value: d.uploadStats.rejectedRecords,   bg: "#fef2f2", color: "#ef4444", icon: <XCircle size={15} /> },
  { label: "Payments Done",    value: d.uploadStats.paymentsDone,      bg: "#f0fdf4", color: "#059669", icon: <CreditCard size={15} /> },
  { label: "Pending Payment",  value: d.uploadStats.pendingPayment,    bg: "#fff7ed", color: "#f59e0b", icon: <Clock size={15} /> },
];

export default function Enrollment() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>

      {/* Header */}
      <div>
        <h2 style={{ fontSize: "18px", fontWeight: "700", color: "#0f172a", margin: 0 }}>Enrollment</h2>
        <p style={{ fontSize: "12px", color: "#94a3b8", marginTop: "2px" }}>Customer enrollment statistics and trends</p>
      </div>

      {/* KPI tiles */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: "10px" }}>
        {kpis.map(({ label, value, bg, color, icon }) => (
          <div key={label} style={{ ...card, padding: "14px 16px", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "2px", background: color }} />
            <div style={{ width: "30px", height: "30px", borderRadius: "6px", background: bg, color, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "8px" }}>{icon}</div>
            <div style={{ fontSize: "20px", fontWeight: "700", color: "#0f172a", letterSpacing: "-0.5px", fontVariantNumeric: "tabular-nums" }}>{typeof value === "number" ? value.toLocaleString() : value}</div>
            <div style={{ fontSize: "10px", color: "#64748b", marginTop: "3px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Area chart */}
      <div style={card}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
          <div>
            <h3 style={{ fontSize: "13px", fontWeight: "600", color: "#0f172a", margin: 0 }}>Monthly Enrollment Trend</h3>
            <p style={{ fontSize: "11px", color: "#94a3b8", marginTop: "2px" }}>New customers enrolled each month</p>
          </div>
          <div style={{ display: "flex", gap: "12px" }}>
            {[{ label: "New", color: "#6366f1" }, { label: "Amendments", color: "#10b981" }].map(l => (
              <span key={l.label} style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "11px", color: "#64748b" }}>
                <span style={{ width: "16px", height: "2px", background: l.color, display: "inline-block" }} />{l.label}
              </span>
            ))}
          </div>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={d.enrollmentMonthly} margin={{ top: 2, right: 4, left: -22, bottom: 0 }}>
            <defs>
              <linearGradient id="eG1" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6366f1" stopOpacity={0.15} /><stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="eG2" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity={0.15} /><stop offset="100%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="2 4" stroke="#f1f5f9" vertical={false} />
            <XAxis dataKey="month" tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
            <Tooltip {...tip} />
            <Area type="monotone" dataKey="newCustomers" stroke="#6366f1" strokeWidth={1.5} fill="url(#eG1)" dot={false} name="New Customers" />
            <Area type="monotone" dataKey="amendments" stroke="#10b981" strokeWidth={1.5} fill="url(#eG2)" dot={false} name="Amendments" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Bar chart */}
      <div style={card}>
        <h3 style={{ fontSize: "13px", fontWeight: "600", color: "#0f172a", margin: "0 0 2px" }}>Enrollment by Month</h3>
        <p style={{ fontSize: "11px", color: "#94a3b8", margin: "0 0 12px" }}>Grouped comparison — new vs amendments</p>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={d.enrollmentMonthly} margin={{ top: 0, right: 4, left: -22, bottom: 0 }} barSize={7} barGap={2}>
            <CartesianGrid strokeDasharray="2 4" stroke="#f1f5f9" vertical={false} />
            <XAxis dataKey="month" tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
            <Tooltip {...tip} />
            <Legend iconType="square" iconSize={6} wrapperStyle={{ fontSize: "11px", paddingTop: "8px" }} />
            <Bar dataKey="newCustomers" fill="#6366f1" radius={[2, 2, 0, 0]} name="New Customers" />
            <Bar dataKey="amendments" fill="#10b981" radius={[2, 2, 0, 0]} name="Amendments" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
