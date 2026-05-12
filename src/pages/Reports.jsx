import { Download, FileText, Calendar, Filter } from "lucide-react";
import { mockDashboardData as d } from "../firebase/mockData";

const card = { background: "white", borderRadius: "12px", padding: "18px 20px", boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 4px 20px rgba(0,0,0,0.03)", border: "1px solid rgba(0,0,0,0.05)" };

export default function Reports() {
  const reports = [
    { name: "Premium Register", type: "Monthly", format: "Excel", desc: "All premium collections with member details", size: "245 KB" },
    { name: "Claims Register", type: "Monthly", format: "Excel", desc: "All claims filed, approved, rejected with amounts", size: "128 KB" },
    { name: "Enrollment Summary", type: "Monthly", format: "PDF", desc: "New enrollments, amendments, terminations", size: "89 KB" },
    { name: "Branch-wise MIS", type: "Monthly", format: "Excel", desc: "Performance metrics per branch", size: "156 KB" },
    { name: "Commission Statement", type: "Monthly", format: "PDF", desc: "Commission earned and payout status", size: "67 KB" },
    { name: "Policy Master", type: "On Demand", format: "Excel", desc: "Complete active policy list with coverage", size: "1.2 MB" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h2 style={{ fontSize: "18px", fontWeight: "700", color: "#0f172a", margin: 0 }}>Reports & MIS</h2>
          <p style={{ fontSize: "12px", color: "#94a3b8", marginTop: "2px" }}>Download monthly statements and registers</p>
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          <select style={{ padding: "6px 12px", borderRadius: "6px", border: "1px solid #e2e8f0", fontSize: "12px", color: "#475569" }}>
            <option>May 2025</option>
            <option>April 2025</option>
            <option>March 2025</option>
          </select>
          <button style={{ display: "flex", alignItems: "center", gap: "5px", padding: "6px 12px", background: "#0f172a", color: "white", border: "none", borderRadius: "6px", fontSize: "12px", fontWeight: "500", cursor: "pointer" }}>
            <Filter size={13} /> Filter
          </button>
        </div>
      </div>

      {/* Report cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px" }}>
        {reports.map((r, i) => (
          <div key={i} style={card}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
              <div style={{ width: "40px", height: "40px", borderRadius: "8px", background: r.format === "PDF" ? "#fef2f2" : "#f0fdf4", display: "flex", alignItems: "center", justifyContent: "center", color: r.format === "PDF" ? "#ef4444" : "#10b981", flexShrink: 0 }}>
                <FileText size={18} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "3px" }}>
                  <span style={{ fontSize: "10px", padding: "2px 6px", borderRadius: "4px", background: r.type === "Monthly" ? "#eff6ff" : "#f5f3ff", color: r.type === "Monthly" ? "#3b82f6" : "#8b5cf6", fontWeight: "600" }}>{r.type}</span>
                  <span style={{ fontSize: "10px", color: "#94a3b8" }}>{r.format}</span>
                </div>
                <h4 style={{ fontSize: "13px", fontWeight: "600", color: "#0f172a", margin: "0 0 3px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{r.name}</h4>
                <p style={{ fontSize: "11px", color: "#64748b", margin: "0 0 8px", lineHeight: "1.3" }}>{r.desc}</p>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ fontSize: "11px", color: "#94a3b8" }}>{r.size}</span>
                  <button style={{ display: "flex", alignItems: "center", gap: "4px", padding: "4px 10px", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "4px", fontSize: "11px", color: "#475569", fontWeight: "500", cursor: "pointer" }}>
                    <Download size={12} /> Download
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent downloads */}
      <div style={card}>
        <h3 style={{ fontSize: "13px", fontWeight: "600", color: "#0f172a", margin: "0 0 12px" }}>Recent Downloads</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {[
            { name: "Premium Register - April 2025", date: "May 5, 2025", status: "Downloaded" },
            { name: "Commission Statement - April 2025", date: "May 3, 2025", status: "Downloaded" },
            { name: "Claims Register - March 2025", date: "Apr 2, 2025", status: "Downloaded" },
          ].map((item, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0", borderBottom: i < 2 ? "1px solid #f1f5f9" : "none" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <FileText size={14} color="#64748b" />
                <span style={{ fontSize: "12px", color: "#475569" }}>{item.name}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                <span style={{ fontSize: "11px", color: "#94a3b8" }}>{item.date}</span>
                <span style={{ fontSize: "10px", padding: "2px 8px", borderRadius: "4px", background: "#f0fdf4", color: "#059669", fontWeight: "600" }}>{item.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
