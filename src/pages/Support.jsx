import { useState } from "react";
import { MessageCircle, Clock, CheckCircle, AlertCircle, Plus, Search, ChevronDown, ChevronUp, Send } from "lucide-react";

const card = { background: "white", borderRadius: "12px", padding: "18px 20px", boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 4px 20px rgba(0,0,0,0.03)", border: "1px solid rgba(0,0,0,0.05)" };

export default function Support() {
  const [expanded, setExpanded] = useState(null);
  const [newTicket, setNewTicket] = useState(false);

  const tickets = [
    { id: "TKT-2025-0421", subject: "Claim payment not received", category: "Payments", status: "Open", priority: "High", created: "May 10, 2025", lastUpdate: "2 hours ago", messages: [
      { from: "Partner", text: "Claim CLM-2025-1842 was approved on May 5 but payment not received yet.", time: "May 10, 2:34 PM" },
      { from: "1Care Support", text: "Checking with finance team. Will update in 24 hours.", time: "May 10, 4:15 PM" },
    ]},
    { id: "TKT-2025-0418", subject: "Batch upload failed", category: "Uploads", status: "Resolved", priority: "Medium", created: "May 8, 2025", lastUpdate: "2 days ago", messages: [
      { from: "Partner", text: "Getting error code ERR-CSV-104 while uploading.", time: "May 8, 10:22 AM" },
      { from: "1Care Support", text: "Issue was due to missing DOB column. Please re-upload with corrected format.", time: "May 8, 11:45 AM" },
      { from: "Partner", text: "Re-uploaded successfully. Thanks!", time: "May 8, 1:30 PM" },
    ]},
    { id: "TKT-2025-0405", subject: "Commission rate query", category: "Commission", status: "Resolved", priority: "Low", created: "May 2, 2025", lastUpdate: "May 5, 2025", messages: [
      { from: "Partner", text: "Why is my commission rate showing 12.5% instead of 15%?", time: "May 2, 9:15 AM" },
      { from: "1Care Support", text: "15% applies only when monthly premium collection exceeds ₹5 lakhs. Your April collection was ₹4.2L. Current rate is correct at 12.5%.", time: "May 2, 11:30 AM" },
    ]},
  ];

  const statusColors = {
    Open: { bg: "#eff6ff", color: "#3b82f6" },
    "In Progress": { bg: "#fff7ed", color: "#f59e0b" },
    Resolved: { bg: "#f0fdf4", color: "#059669" },
  };

  const priorityColors = {
    High: "#ef4444",
    Medium: "#f59e0b",
    Low: "#64748b",
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h2 style={{ fontSize: "18px", fontWeight: "700", color: "#0f172a", margin: 0 }}>Support & Helpdesk</h2>
          <p style={{ fontSize: "12px", color: "#94a3b8", marginTop: "2px" }}>Raise queries and track resolution</p>
        </div>
        <button 
          onClick={() => setNewTicket(!newTicket)}
          style={{ display: "flex", alignItems: "center", gap: "5px", padding: "6px 14px", background: "#0f172a", color: "white", border: "none", borderRadius: "6px", fontSize: "12px", fontWeight: "500", cursor: "pointer" }}
        >
          <Plus size={13} /> New Ticket
        </button>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px" }}>
        {[
          { label: "Open Tickets", value: 1, icon: AlertCircle, color: "#ef4444", bg: "#fef2f2" },
          { label: "In Progress", value: 0, icon: Clock, color: "#f59e0b", bg: "#fff7ed" },
          { label: "Resolved", value: 2, icon: CheckCircle, color: "#10b981", bg: "#f0fdf4" },
          { label: "Avg Response", value: "4.2 hrs", icon: MessageCircle, color: "#3b82f6", bg: "#eff6ff" },
        ].map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} style={card}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div style={{ width: "28px", height: "28px", borderRadius: "6px", background: bg, display: "flex", alignItems: "center", justifyContent: "center", color }}>
                <Icon size={14} />
              </div>
              <span style={{ fontSize: "11px", color: "#64748b", fontWeight: "600" }}>{label}</span>
            </div>
            <div style={{ fontSize: "22px", fontWeight: "700", color: "#0f172a", marginTop: "8px" }}>{value}</div>
          </div>
        ))}
      </div>

      {/* New ticket form */}
      {newTicket && (
        <div style={card}>
          <h3 style={{ fontSize: "13px", fontWeight: "600", color: "#0f172a", margin: "0 0 12px" }}>Create New Ticket</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              <div>
                <label style={{ fontSize: "11px", color: "#64748b", fontWeight: "600", marginBottom: "4px", display: "block" }}>Category</label>
                <select style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", border: "1px solid #e2e8f0", fontSize: "13px", color: "#475569" }}>
                  <option>Payments</option>
                  <option>Claims</option>
                  <option>Uploads</option>
                  <option>Commission</option>
                  <option>Enrollment</option>
                  <option>Technical</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: "11px", color: "#64748b", fontWeight: "600", marginBottom: "4px", display: "block" }}>Priority</label>
                <select style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", border: "1px solid #e2e8f0", fontSize: "13px", color: "#475569" }}>
                  <option>High</option>
                  <option>Medium</option>
                  <option>Low</option>
                </select>
              </div>
            </div>
            <div>
              <label style={{ fontSize: "11px", color: "#64748b", fontWeight: "600", marginBottom: "4px", display: "block" }}>Subject</label>
              <input placeholder="Brief description of your query..." style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", border: "1px solid #e2e8f0", fontSize: "13px", color: "#475569", boxSizing: "border-box" }} />
            </div>
            <div>
              <label style={{ fontSize: "11px", color: "#64748b", fontWeight: "600", marginBottom: "4px", display: "block" }}>Description</label>
              <textarea placeholder="Provide details..." rows={3} style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", border: "1px solid #e2e8f0", fontSize: "13px", color: "#475569", resize: "vertical", boxSizing: "border-box" }} />
            </div>
            <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
              <button onClick={() => setNewTicket(false)} style={{ padding: "6px 14px", borderRadius: "6px", border: "1px solid #e2e8f0", background: "white", fontSize: "12px", color: "#475569", cursor: "pointer" }}>Cancel</button>
              <button style={{ padding: "6px 14px", borderRadius: "6px", border: "none", background: "#0f172a", fontSize: "12px", color: "white", cursor: "pointer" }}>Submit Ticket</button>
            </div>
          </div>
        </div>
      )}

      {/* Tickets list */}
      <div style={card}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
          <h3 style={{ fontSize: "13px", fontWeight: "600", color: "#0f172a", margin: 0 }}>Your Tickets</h3>
          <div style={{ display: "flex", gap: "8px" }}>
            <div style={{ position: "relative" }}>
              <Search size={14} style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} />
              <input placeholder="Search tickets..." style={{ padding: "6px 10px 6px 30px", borderRadius: "6px", border: "1px solid #e2e8f0", fontSize: "12px", width: "180px" }} />
            </div>
            <select style={{ padding: "6px 10px", borderRadius: "6px", border: "1px solid #e2e8f0", fontSize: "12px", color: "#475569" }}>
              <option>All Status</option>
              <option>Open</option>
              <option>Resolved</option>
            </select>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {tickets.map((t) => (
            <div key={t.id} style={{ border: "1px solid #e2e8f0", borderRadius: "8px", overflow: "hidden" }}>
              <div 
                onClick={() => setExpanded(expanded === t.id ? null : t.id)}
                style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", cursor: "pointer", background: expanded === t.id ? "#f8fafc" : "white" }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "12px", flex: 1 }}>
                  <span style={{ fontSize: "11px", fontWeight: "600", color: "#94a3b8", fontFamily: "monospace" }}>{t.id}</span>
                  <span style={{ fontSize: "13px", fontWeight: "500", color: "#0f172a" }}>{t.subject}</span>
                  <span style={{ fontSize: "10px", padding: "2px 8px", borderRadius: "4px", background: statusColors[t.status].bg, color: statusColors[t.status].color, fontWeight: "600" }}>{t.status}</span>
                  <span style={{ fontSize: "10px", color: priorityColors[t.priority] }}>● {t.priority}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <span style={{ fontSize: "11px", color: "#94a3b8" }}>{t.lastUpdate}</span>
                  {expanded === t.id ? <ChevronUp size={16} color="#64748b" /> : <ChevronDown size={16} color="#64748b" />}
                </div>
              </div>
              
              {expanded === t.id && (
                <div style={{ padding: "16px", borderTop: "1px solid #f1f5f9", background: "#fafafa" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    {t.messages.map((m, i) => (
                      <div key={i} style={{ display: "flex", gap: "10px" }}>
                        <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: m.from === "Partner" ? "linear-gradient(135deg,#3b82f6,#6366f1)" : "#e2e8f0", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "10px", fontWeight: "700", color: m.from === "Partner" ? "white" : "#64748b", flexShrink: 0 }}>
                          {m.from === "Partner" ? "P" : "1C"}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "2px" }}>
                            <span style={{ fontSize: "12px", fontWeight: "600", color: "#0f172a" }}>{m.from}</span>
                            <span style={{ fontSize: "11px", color: "#94a3b8" }}>{m.time}</span>
                          </div>
                          <p style={{ fontSize: "13px", color: "#475569", margin: 0, lineHeight: "1.4" }}>{m.text}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  {t.status === "Open" && (
                    <div style={{ marginTop: "16px", display: "flex", gap: "8px" }}>
                      <input placeholder="Type your reply..." style={{ flex: 1, padding: "8px 12px", borderRadius: "6px", border: "1px solid #e2e8f0", fontSize: "13px" }} />
                      <button style={{ display: "flex", alignItems: "center", gap: "5px", padding: "6px 12px", background: "#0f172a", color: "white", border: "none", borderRadius: "6px", fontSize: "12px", cursor: "pointer" }}>
                        <Send size={12} /> Reply
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
