import { TrendingUp, TrendingDown } from "lucide-react";

const accents = {
  blue:   { bar: "#3b82f6", light: "#eff6ff", text: "#2563eb" },
  green:  { bar: "#10b981", light: "#f0fdf4", text: "#059669" },
  purple: { bar: "#8b5cf6", light: "#f5f3ff", text: "#7c3aed" },
  orange: { bar: "#f59e0b", light: "#fff7ed", text: "#d97706" },
};

export default function KPICard({ label, value, trend, prefix = "", suffix = "", icon: Icon, color = "blue" }) {
  const isPositive = trend >= 0;
  const a = accents[color];

  return (
    <div style={{
      background: "white", borderRadius: "8px", padding: "16px 18px 14px",
      boxShadow: "0 1px 2px rgba(16,24,40,0.06)",
      border: "1px solid #e2e8f0",
      position: "relative", overflow: "hidden", cursor: "default",
    }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "2px", background: a.bar }} />

      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "12px" }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontSize: "11px", fontWeight: "600", color: "#64748b", marginBottom: "6px", letterSpacing: "0.05em", textTransform: "uppercase" }}>{label}</p>
          <p style={{ fontSize: "26px", fontWeight: "700", color: "#0f172a", lineHeight: 1, letterSpacing: "-0.5px", fontVariantNumeric: "tabular-nums" }}>
            {prefix}{typeof value === "number" && value > 999 ? value.toLocaleString() : value}{suffix}
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: "5px", marginTop: "6px" }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: "2px", fontSize: "11px", fontWeight: "600", color: isPositive ? "#059669" : "#dc2626" }}>
              {isPositive ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
              {isPositive ? "+" : ""}{trend}%
            </span>
            <span style={{ fontSize: "11px", color: "#94a3b8" }}>vs prev. month</span>
          </div>
        </div>
        <div style={{ width: "36px", height: "36px", borderRadius: "8px", flexShrink: 0, background: a.light, color: a.text, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon size={17} />
        </div>
      </div>
    </div>
  );
}
