import { TrendingUp, TrendingDown } from "lucide-react";

const accents = {
  blue:   { grad: "linear-gradient(135deg, #3b82f6, #6366f1)", light: "#eff6ff", text: "#3b82f6", glow: "rgba(99,102,241,0.25)" },
  green:  { grad: "linear-gradient(135deg, #10b981, #059669)", light: "#f0fdf4", text: "#10b981", glow: "rgba(16,185,129,0.25)" },
  purple: { grad: "linear-gradient(135deg, #8b5cf6, #7c3aed)", light: "#f5f3ff", text: "#8b5cf6", glow: "rgba(139,92,246,0.25)" },
  orange: { grad: "linear-gradient(135deg, #f59e0b, #ef4444)", light: "#fff7ed", text: "#f59e0b", glow: "rgba(245,158,11,0.25)" },
};

export default function KPICard({ label, value, trend, prefix = "", suffix = "", icon: Icon, color = "blue" }) {
  const isPositive = trend >= 0;
  const a = accents[color];

  return (
    <div style={{
      background: "white", borderRadius: "16px", padding: "22px 22px 18px",
      boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 4px 20px rgba(0,0,0,0.04)",
      border: "1px solid rgba(0,0,0,0.05)",
      position: "relative", overflow: "hidden",
      transition: "transform 0.15s, box-shadow 0.15s",
      cursor: "default",
    }}
      onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = `0 8px 30px ${a.glow}, 0 1px 3px rgba(0,0,0,0.06)`; }}
      onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.06), 0 4px 20px rgba(0,0,0,0.04)"; }}
    >
      {/* Top accent bar */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "3px", background: a.grad, borderRadius: "16px 16px 0 0" }}></div>

      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <div>
          <p style={{ fontSize: "12px", fontWeight: "600", color: "#94a3b8", marginBottom: "8px", letterSpacing: "0.03em", textTransform: "uppercase" }}>{label}</p>
          <p style={{ fontSize: "28px", fontWeight: "800", color: "#0f172a", lineHeight: 1.1, letterSpacing: "-0.5px" }}>
            {prefix}
            {typeof value === "number" && value > 999 ? value.toLocaleString() : value}
            {suffix}
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: "4px", marginTop: "8px" }}>
            <span style={{
              display: "inline-flex", alignItems: "center", gap: "3px",
              fontSize: "12px", fontWeight: "600",
              color: isPositive ? "#10b981" : "#ef4444",
              background: isPositive ? "#f0fdf4" : "#fef2f2",
              padding: "2px 8px", borderRadius: "20px",
            }}>
              {isPositive ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
              {isPositive ? "+" : ""}{trend}%
            </span>
            <span style={{ fontSize: "11px", color: "#94a3b8" }}>vs last month</span>
          </div>
        </div>
        <div style={{
          width: "48px", height: "48px", borderRadius: "14px", flexShrink: 0,
          background: a.grad, display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: `0 6px 16px ${a.glow}`,
        }}>
          <Icon size={22} color="white" />
        </div>
      </div>
    </div>
  );
}
