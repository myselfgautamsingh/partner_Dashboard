import { BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { mockDashboardData as d } from "../firebase/mockData";

const card = { background: "white", borderRadius: "0", padding: "22px", boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 4px 20px rgba(0,0,0,0.03)", border: "1px solid rgba(0,0,0,0.05)" };
const tip = { contentStyle: { borderRadius: "10px", border: "none", boxShadow: "0 8px 30px rgba(0,0,0,0.12)", fontSize: "12px", padding: "10px 14px" } };
const PIE_COLORS = ["#6366f1", "#f59e0b", "#ef4444"];

export default function Payments() {
  const { paymentsStats, paymentsMonthly } = d;
  const pieData = [
    { name: "Collected", value: paymentsStats.totalCollected },
    { name: "Pending",   value: paymentsStats.pendingPayment },
    { name: "Rejected",  value: paymentsStats.rejectedPayments },
  ];
  const total = pieData.reduce((s, i) => s + i.value, 0);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "22px" }}>

      {/* Header */}
      <div>
        <h2 style={{ fontSize: "20px", fontWeight: "800", color: "#0f172a", margin: 0 }}>Payments</h2>
        <p style={{ fontSize: "13px", color: "#94a3b8", marginTop: "3px" }}>Premium collection and payment tracking</p>
      </div>

      {/* Top 3 summary cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}>
        {[
          { label: "Total Collected",   value: paymentsStats.totalCollected,   grad: "linear-gradient(135deg,#3b82f6,#6366f1)", glow: "rgba(99,102,241,0.25)"  },
          { label: "Pending Payment",   value: paymentsStats.pendingPayment,   grad: "linear-gradient(135deg,#f59e0b,#fbbf24)", glow: "rgba(245,158,11,0.25)"  },
          { label: "Rejected Payments", value: paymentsStats.rejectedPayments, grad: "linear-gradient(135deg,#ef4444,#f87171)", glow: "rgba(239,68,68,0.25)"   },
        ].map(({ label, value, grad, glow }) => (
          <div key={label} style={{ ...card, background: "linear-gradient(140deg,#1e293b,#0f172a)", padding: "24px", boxShadow: `0 8px 30px ${glow}, 0 1px 3px rgba(0,0,0,0.06)` }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
              <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: grad, display: "inline-block" }}></span>
              <p style={{ fontSize: "11px", fontWeight: "600", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em", margin: 0 }}>{label}</p>
            </div>
            <p style={{ fontSize: "30px", fontWeight: "800", color: "white", margin: 0, letterSpacing: "-1px" }}>${value.toLocaleString()}</p>
          </div>
        ))}
      </div>

      {/* Area chart + Pie */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: "16px" }}>

        <div style={card}>
          <h3 style={{ fontSize: "14px", fontWeight: "700", color: "#0f172a", margin: "0 0 4px" }}>Monthly Payment Trend</h3>
          <p style={{ fontSize: "12px", color: "#94a3b8", margin: "0 0 20px" }}>Collected vs pending over the year</p>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={paymentsMonthly} margin={{ top: 5, right: 5, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="pG1" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366f1" stopOpacity={0.2} /><stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="pG2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.2} /><stop offset="100%" stopColor="#f59e0b" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <Tooltip {...tip} />
              <Legend iconType="circle" iconSize={7} wrapperStyle={{ fontSize: "11px", paddingTop: "10px" }} />
              <Area type="monotone" dataKey="collected" stroke="#6366f1" strokeWidth={2.5} fill="url(#pG1)" dot={false} name="Collected" />
              <Area type="monotone" dataKey="pending" stroke="#f59e0b" strokeWidth={2.5} fill="url(#pG2)" dot={false} name="Pending" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div style={{ ...card, display: "flex", flexDirection: "column" }}>
          <h3 style={{ fontSize: "14px", fontWeight: "700", color: "#0f172a", margin: "0 0 16px" }}>Payment Split</h3>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={48} outerRadius={72} dataKey="value" strokeWidth={2} stroke="white" paddingAngle={3}>
                {pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
              </Pie>
              <Tooltip {...tip} />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "16px" }}>
            {pieData.map((item, i) => {
              const pct = Math.round((item.value / total) * 100);
              return (
                <div key={i}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "7px" }}>
                      <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: PIE_COLORS[i], display: "inline-block" }}></span>
                      <span style={{ fontSize: "12px", color: "#64748b" }}>{item.name}</span>
                    </div>
                    <span style={{ fontSize: "12px", fontWeight: "700", color: "#0f172a" }}>${item.value.toLocaleString()}</span>
                  </div>
                  <div style={{ height: "4px", background: "#f1f5f9", borderRadius: "4px", overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${pct}%`, background: PIE_COLORS[i], borderRadius: "4px" }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bar chart */}
      <div style={card}>
        <h3 style={{ fontSize: "14px", fontWeight: "700", color: "#0f172a", margin: "0 0 4px" }}>Monthly Collected vs Rejected</h3>
        <p style={{ fontSize: "12px", color: "#94a3b8", margin: "0 0 20px" }}>Side-by-side monthly comparison</p>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={paymentsMonthly} margin={{ top: 0, right: 5, left: -10, bottom: 0 }} barSize={9} barGap={3}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
            <Tooltip {...tip} />
            <Legend iconType="circle" iconSize={7} wrapperStyle={{ fontSize: "11px", paddingTop: "10px" }} />
            <Bar dataKey="collected" fill="#6366f1" radius={[4, 4, 0, 0]} name="Collected" />
            <Bar dataKey="rejected"  fill="#ef4444" radius={[4, 4, 0, 0]} name="Rejected" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
