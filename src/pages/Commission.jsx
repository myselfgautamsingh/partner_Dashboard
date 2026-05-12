import { IndianRupee, TrendingUp, Wallet, ArrowUpRight, Clock, CheckCircle } from "lucide-react";
import { mockDashboardData as d } from "../firebase/mockData";

const card = { background: "white", borderRadius: "12px", padding: "18px 20px", boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 4px 20px rgba(0,0,0,0.03)", border: "1px solid rgba(0,0,0,0.05)" };

export default function Commission() {
  const stats = {
    earnedThisMonth: 45200,
    pendingPayout: 12800,
    totalEarned: 284500,
    ytdCommission: 156800,
  };

  const transactions = [
    { date: "May 2025", type: "Premium Commission", policies: 1240, amount: 45200, status: "Earned", paid: false },
    { date: "Apr 2025", type: "Premium Commission", policies: 1180, amount: 42800, status: "Paid", paid: true, paidDate: "May 5, 2025" },
    { date: "Mar 2025", type: "Premium Commission", policies: 1050, amount: 38100, status: "Paid", paid: true, paidDate: "Apr 5, 2025" },
    { date: "Feb 2025", type: "Premium Commission", policies: 980, amount: 35600, status: "Paid", paid: true, paidDate: "Mar 5, 2025" },
    { date: "Jan 2025", type: "Premium Commission", policies: 920, amount: 33400, status: "Paid", paid: true, paidDate: "Feb 5, 2025" },
  ];

  const btnBase = { display: "flex", alignItems: "center", gap: "5px", padding: "6px 14px", fontSize: "12px", fontWeight: "500", borderRadius: "6px", cursor: "pointer", border: "1px solid #e2e8f0" };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h2 style={{ fontSize: "18px", fontWeight: "700", color: "#0f172a", margin: 0 }}>Commission & Payouts</h2>
          <p style={{ fontSize: "12px", color: "#94a3b8", marginTop: "2px" }}>Track earnings and payout status</p>
        </div>
        <button style={{ ...btnBase, background: "#0f172a", color: "white", border: "none" }}>
          <ArrowUpRight size={13} /> Request Payout
        </button>
      </div>

      {/* Stats cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px" }}>
        {[
          { label: "This Month Earned", value: `₹${stats.earnedThisMonth.toLocaleString()}`, icon: IndianRupee, color: "#10b981", bg: "#f0fdf4" },
          { label: "Pending Payout", value: `₹${stats.pendingPayout.toLocaleString()}`, icon: Clock, color: "#f59e0b", bg: "#fff7ed" },
          { label: "Total Earned", value: `₹${stats.totalEarned.toLocaleString()}`, icon: Wallet, color: "#3b82f6", bg: "#eff6ff" },
          { label: "YTD Commission", value: `₹${stats.ytdCommission.toLocaleString()}`, icon: TrendingUp, color: "#8b5cf6", bg: "#f5f3ff" },
        ].map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} style={card}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
              <div style={{ width: "32px", height: "32px", borderRadius: "6px", background: bg, display: "flex", alignItems: "center", justifyContent: "center", color }}>
                <Icon size={16} />
              </div>
              <span style={{ fontSize: "11px", color: "#64748b", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</span>
            </div>
            <div style={{ fontSize: "24px", fontWeight: "700", color: "#0f172a", letterSpacing: "-0.5px" }}>{value}</div>
          </div>
        ))}
      </div>

      {/* Commission rate info */}
      <div style={{ ...card, background: "linear-gradient(140deg,#1e293b,#0f172a)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <p style={{ fontSize: "11px", color: "#64748b", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.05em", margin: "0 0 6px" }}>Current Commission Rate</p>
            <p style={{ fontSize: "28px", fontWeight: "800", color: "white", margin: 0 }}>12.5%</p>
            <p style={{ fontSize: "12px", color: "#94a3b8", marginTop: "4px" }}>per premium collected</p>
          </div>
          <div style={{ textAlign: "right" }}>
            <p style={{ fontSize: "11px", color: "#64748b", margin: "0 0 4px" }}>Next tier at</p>
            <p style={{ fontSize: "14px", fontWeight: "600", color: "#10b981" }}>15% (₹5L+ monthly)</p>
          </div>
        </div>
      </div>

      {/* Transaction history */}
      <div style={card}>
        <h3 style={{ fontSize: "13px", fontWeight: "600", color: "#0f172a", margin: "0 0 12px" }}>Commission History</h3>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #e2e8f0" }}>
                {["Period", "Type", "Policies", "Commission", "Status", "Paid Date"].map((h, i) => (
                  <th key={h} style={{ textAlign: i === 0 ? "left" : "center", padding: "0 12px 8px", fontSize: "10px", fontWeight: "600", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.06em" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {transactions.map((t, i) => (
                <tr key={i} style={{ borderBottom: "1px solid #f8fafc" }}>
                  <td style={{ padding: "10px 12px", fontWeight: "500", color: "#1e293b" }}>{t.date}</td>
                  <td style={{ padding: "10px 12px", textAlign: "center", color: "#475569" }}>{t.type}</td>
                  <td style={{ padding: "10px 12px", textAlign: "center", color: "#475569" }}>{t.policies}</td>
                  <td style={{ padding: "10px 12px", textAlign: "center", color: "#0f172a", fontWeight: "600" }}>₹{t.amount.toLocaleString()}</td>
                  <td style={{ padding: "10px 12px", textAlign: "center" }}>
                    <span style={{ fontSize: "11px", padding: "2px 8px", borderRadius: "4px", background: t.paid ? "#f0fdf4" : "#fff7ed", color: t.paid ? "#059669" : "#d97706", fontWeight: "600" }}>{t.status}</span>
                  </td>
                  <td style={{ padding: "10px 12px", textAlign: "center", color: "#94a3b8", fontSize: "12px" }}>{t.paidDate || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
