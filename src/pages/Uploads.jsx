import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Upload, CheckCircle, XCircle, Clock, CreditCard, FileUp } from "lucide-react";
import { mockDashboardData as d } from "../firebase/mockData";

const card = { background: "white", borderRadius: "16px", padding: "22px", boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 4px 20px rgba(0,0,0,0.03)", border: "1px solid rgba(0,0,0,0.05)" };
const tip = { contentStyle: { borderRadius: "10px", border: "none", boxShadow: "0 8px 30px rgba(0,0,0,0.12)", fontSize: "12px", padding: "10px 14px" } };

const weeklyData = [
  { week: "Week 1", processed: 3820, rejected: 142 },
  { week: "Week 2", processed: 4210, rejected: 168 },
  { week: "Week 3", processed: 3650, rejected: 120 },
  { week: "Week 4", processed: 3140, rejected: 202 },
];

const tiles = [
  { label: "Files Uploaded",   value: d.uploadStats.filesUploaded,               bg: "#eff6ff", color: "#3b82f6", icon: <FileUp size={18} /> },
  { label: "Total Records",    value: d.uploadStats.uploadedRecords.toLocaleString(), bg: "#f0fdf4", color: "#10b981", icon: <CheckCircle size={18} /> },
  { label: "Rejected Records", value: d.uploadStats.rejectedRecords,              bg: "#fef2f2", color: "#ef4444", icon: <XCircle size={18} /> },
  { label: "Payments Done",    value: d.uploadStats.paymentsDone,                 bg: "#f5f3ff", color: "#8b5cf6", icon: <CreditCard size={18} /> },
  { label: "Pending Payment",  value: d.uploadStats.pendingPayment,               bg: "#fff7ed", color: "#f59e0b", icon: <Clock size={18} /> },
];

const progressBars = [
  { label: "Successfully Processed", value: d.uploadStats.uploadedRecords - d.uploadStats.rejectedRecords, total: d.uploadStats.uploadedRecords, color: "#10b981", bg: "#f0fdf4", textColor: "#059669" },
  { label: "Rejected Records",        value: d.uploadStats.rejectedRecords, total: d.uploadStats.uploadedRecords, color: "#ef4444", bg: "#fef2f2", textColor: "#dc2626" },
  { label: "Payments Done",           value: d.uploadStats.paymentsDone,    total: d.uploadStats.uploadedRecords, color: "#6366f1", bg: "#eff6ff", textColor: "#4f46e5" },
  { label: "Pending Payment",         value: d.uploadStats.pendingPayment,  total: d.uploadStats.uploadedRecords, color: "#f59e0b", bg: "#fff7ed", textColor: "#d97706" },
];

export default function Uploads() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "22px" }}>

      {/* Header */}
      <div>
        <h2 style={{ fontSize: "20px", fontWeight: "800", color: "#0f172a", margin: 0 }}>Data Uploads</h2>
        <p style={{ fontSize: "13px", color: "#94a3b8", marginTop: "3px" }}>Batch file upload tracking and processing status</p>
      </div>

      {/* KPI tiles */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "14px" }}>
        {tiles.map(({ label, value, bg, color, icon }) => (
          <div key={label} style={{ ...card, padding: "18px", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "3px", background: color, borderRadius: "16px 16px 0 0" }}></div>
            <div style={{ width: "38px", height: "38px", borderRadius: "11px", background: bg, color, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "10px" }}>{icon}</div>
            <div style={{ fontSize: "24px", fontWeight: "800", color: "#0f172a", letterSpacing: "-0.5px" }}>{value}</div>
            <div style={{ fontSize: "11px", color: "#94a3b8", marginTop: "4px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.04em" }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Progress summary + Weekly bar side by side */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>

        {/* Progress bars */}
        <div style={card}>
          <h3 style={{ fontSize: "14px", fontWeight: "700", color: "#0f172a", margin: "0 0 20px" }}>Processing Summary</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
            {progressBars.map(({ label, value, total, color, bg, textColor }) => {
              const pct = Math.round((value / total) * 100);
              return (
                <div key={label}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                    <span style={{ fontSize: "12px", fontWeight: "600", color: "#475569" }}>{label}</span>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <span style={{ fontSize: "12px", fontWeight: "700", color: "#0f172a" }}>{value.toLocaleString()}</span>
                      <span style={{ fontSize: "11px", padding: "1px 8px", borderRadius: "20px", background: bg, color: textColor, fontWeight: "600" }}>{pct}%</span>
                    </div>
                  </div>
                  <div style={{ height: "7px", background: "#f1f5f9", borderRadius: "4px", overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${pct}%`, background: color, borderRadius: "4px", transition: "width 0.8s ease" }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Weekly bar chart */}
        <div style={card}>
          <h3 style={{ fontSize: "14px", fontWeight: "700", color: "#0f172a", margin: "0 0 4px" }}>Weekly Upload Volume</h3>
          <p style={{ fontSize: "12px", color: "#94a3b8", margin: "0 0 20px" }}>Processed vs rejected this month</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={weeklyData} margin={{ top: 0, right: 5, left: -20, bottom: 0 }} barSize={18} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="week" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <Tooltip {...tip} />
              <Legend iconType="circle" iconSize={7} wrapperStyle={{ fontSize: "11px", paddingTop: "10px" }} />
              <Bar dataKey="processed" fill="#6366f1" radius={[4, 4, 0, 0]} name="Processed" />
              <Bar dataKey="rejected"  fill="#ef4444" radius={[4, 4, 0, 0]} name="Rejected" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent upload activity */}
      <div style={card}>
        <h3 style={{ fontSize: "14px", fontWeight: "700", color: "#0f172a", margin: "0 0 18px" }}>Recent Upload Activity</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {d.recentActivity.filter(a => a.type === "upload" || a.type === "enrollment").map((item, i) => {
            const colors = { success: { bg: "#f0fdf4", color: "#10b981", pill: "#dcfce7", pillText: "#059669" }, warning: { bg: "#fff7ed", color: "#f59e0b", pill: "#fef3c7", pillText: "#d97706" }, pending: { bg: "#eff6ff", color: "#3b82f6", pill: "#dbeafe", pillText: "#2563eb" } };
            const c = colors[item.status] || colors.pending;
            return (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px 14px", borderRadius: "12px", background: "#f8fafc", border: "1px solid #f1f5f9" }}>
                <span style={{ width: "34px", height: "34px", borderRadius: "10px", background: c.bg, color: c.color, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Upload size={14} />
                </span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: "13px", color: "#334155", margin: 0, fontWeight: "500" }}>{item.message}</p>
                  <p style={{ fontSize: "11px", color: "#94a3b8", margin: "2px 0 0" }}>{item.time}</p>
                </div>
                <span style={{ fontSize: "10px", fontWeight: "700", padding: "3px 10px", borderRadius: "20px", background: c.pill, color: c.pillText, flexShrink: 0, textTransform: "capitalize" }}>{item.status}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
