import { useState } from "react";
import { Search, Filter, Eye, FileText, Clock, CheckCircle, XCircle, AlertCircle, ChevronRight, Download, Calendar, User, Shield, IndianRupee, Building2 } from "lucide-react";

const card = { background: "white", borderRadius: "12px", padding: "18px 20px", boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 4px 20px rgba(0,0,0,0.03)", border: "1px solid rgba(0,0,0,0.05)" };

const claimsData = [
  { id: "CLM-2025-1842", member: "Rahul Sharma", memberId: "MBR-001", branch: "Mumbai Central", policy: "Group Health - GSSK", filedDate: "May 5, 2025", amount: 1200, status: "Paid", stage: "Closed", paidDate: "May 10, 2025", verifier: "Dr. A. Patel", daysInStage: 0, documents: 3, notes: "Hospitalization for fever. All docs verified." },
  { id: "CLM-2025-1845", member: "Arun Nair", memberId: "MBR-003", branch: "Delhi Branch", policy: "Individual Health - GSJS", filedDate: "May 4, 2025", amount: 2500, status: "Pending", stage: "Verification", paidDate: null, verifier: "Pending assignment", daysInStage: 6, documents: 2, notes: "Awaiting discharge summary from hospital." },
  { id: "CLM-2025-1841", member: "Priya Mehta", memberId: "MBR-002", branch: "Mumbai Central", policy: "Group Health - GSSK", filedDate: "May 3, 2025", amount: 800, status: "Approved", stage: "Payment", paidDate: null, verifier: "Dr. S. Kumar", daysInStage: 2, documents: 3, notes: "Day care procedure. Approved, payment processing." },
  { id: "CLM-2025-1839", member: "Sunita Rao", memberId: "MBR-004", branch: "Bengaluru Branch", policy: "Group Health - GSSK", filedDate: "May 2, 2025", amount: 3500, status: "Pending", stage: "Verdict", paidDate: null, verifier: "Under review", daysInStage: 4, documents: 4, notes: "Pre-existing condition query raised." },
  { id: "CLM-2025-1835", member: "Vikram Patel", memberId: "MBR-005", branch: "Chennai Branch", policy: "Group Term Life", filedDate: "Apr 28, 2025", amount: 50000, status: "Rejected", stage: "Closed", paidDate: null, verifier: "Dr. R. Iyer", daysInStage: 0, documents: 2, notes: "Claim outside policy coverage period." },
  { id: "CLM-2025-1830", member: "Anjali Singh", memberId: "MBR-006", branch: "Mumbai Central", policy: "Group Health - GSSK", filedDate: "Apr 25, 2025", amount: 1800, status: "Paid", stage: "Closed", paidDate: "Apr 30, 2025", verifier: "Dr. A. Patel", daysInStage: 0, documents: 3, notes: "Maternity claim. Processed successfully." },
  { id: "CLM-2025-1825", member: "Deepak Verma", memberId: "MBR-007", branch: "Hyderabad Branch", policy: "Individual Health - GSJS", filedDate: "Apr 22, 2025", amount: 2200, status: "Pending", stage: "Payment", paidDate: null, verifier: "Dr. M. Shah", daysInStage: 1, documents: 3, notes: "Approved, scheduled for payment on May 12." },
  { id: "CLM-2025-1818", member: "Kavita Joshi", memberId: "MBR-008", branch: "Pune Branch", policy: "Group Health - GSSK", filedDate: "Apr 18, 2025", amount: 950, status: "Paid", stage: "Closed", paidDate: "Apr 23, 2025", verifier: "Dr. S. Kumar", daysInStage: 0, documents: 2, notes: "OPD consultation. Quick settlement." },
];

const statusConfig = {
  Paid: { icon: CheckCircle, color: "#10b981", bg: "#f0fdf4", label: "Paid" },
  Approved: { icon: CheckCircle, color: "#3b82f6", bg: "#eff6ff", label: "Approved" },
  Pending: { icon: Clock, color: "#f59e0b", bg: "#fff7ed", label: "Pending" },
  Rejected: { icon: XCircle, color: "#ef4444", bg: "#fef2f2", label: "Rejected" },
};

const stageOrder = ["Verification", "Verdict", "Payment", "Closed"];

export default function ClaimDetails() {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [expanded, setExpanded] = useState(null);

  const filtered = claimsData.filter(c => {
    const matchSearch = c.id.toLowerCase().includes(search.toLowerCase()) || 
                       c.member.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "All" || c.status === filterStatus;
    return matchSearch && matchStatus;
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h2 style={{ fontSize: "18px", fontWeight: "700", color: "#0f172a", margin: 0 }}>Claim Details</h2>
          <p style={{ fontSize: "12px", color: "#94a3b8", marginTop: "2px" }}>Case-by-case claim tracking and status</p>
        </div>
        <button style={{ display: "flex", alignItems: "center", gap: "5px", padding: "6px 14px", background: "#0f172a", color: "white", border: "none", borderRadius: "6px", fontSize: "12px", fontWeight: "500", cursor: "pointer" }}>
          <Download size={13} /> Export CSV
        </button>
      </div>

      {/* Filters */}
      <div style={{ ...card, padding: "12px 16px" }}>
        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          <div style={{ position: "relative", flex: 1 }}>
            <Search size={14} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} />
            <input 
              value={search} 
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by claim ID or member name..." 
              style={{ width: "100%", padding: "8px 12px 8px 36px", borderRadius: "6px", border: "1px solid #e2e8f0", fontSize: "13px", color: "#475569", boxSizing: "border-box" }} 
            />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Filter size={14} color="#94a3b8" />
            <select 
              value={filterStatus} 
              onChange={e => setFilterStatus(e.target.value)}
              style={{ padding: "8px 12px", borderRadius: "6px", border: "1px solid #e2e8f0", fontSize: "13px", color: "#475569" }}
            >
              <option>All</option>
              <option>Paid</option>
              <option>Approved</option>
              <option>Pending</option>
              <option>Rejected</option>
            </select>
          </div>
          <span style={{ fontSize: "12px", color: "#94a3b8" }}>{filtered.length} claims</span>
        </div>
      </div>

      {/* Claims list */}
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {filtered.map((c) => {
          const status = statusConfig[c.status];
          const StatusIcon = status.icon;
          const isExpanded = expanded === c.id;
          
          return (
            <div key={c.id} style={{ ...card, padding: isExpanded ? "16px 18px" : "14px 18px" }}>
              {/* Summary row */}
              <div 
                onClick={() => setExpanded(isExpanded ? null : c.id)}
                style={{ display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer" }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "16px", flex: 1 }}>
                  <div style={{ display: "flex", flexDirection: "column", minWidth: "110px" }}>
                    <span style={{ fontSize: "11px", color: "#94a3b8", fontFamily: "monospace" }}>{c.id}</span>
                    <span style={{ fontSize: "12px", fontWeight: "600", color: "#0f172a" }}>{c.member}</span>
                  </div>
                  
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", minWidth: "90px" }}>
                    <div style={{ width: "24px", height: "24px", borderRadius: "6px", background: status.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <StatusIcon size={14} color={status.color} />
                    </div>
                    <span style={{ fontSize: "11px", fontWeight: "600", color: status.color }}>{status.label}</span>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", minWidth: "80px" }}>
                    <span style={{ fontSize: "11px", color: "#94a3b8" }}>Amount</span>
                    <span style={{ fontSize: "13px", fontWeight: "600", color: "#0f172a" }}>₹{c.amount.toLocaleString()}</span>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", minWidth: "100px" }}>
                    <span style={{ fontSize: "11px", color: "#94a3b8" }}>Filed</span>
                    <span style={{ fontSize: "12px", color: "#475569" }}>{c.filedDate}</span>
                  </div>

                  {c.paidDate && (
                    <div style={{ display: "flex", flexDirection: "column", minWidth: "100px" }}>
                      <span style={{ fontSize: "11px", color: "#94a3b8" }}>Paid</span>
                      <span style={{ fontSize: "12px", color: "#10b981", fontWeight: "500" }}>{c.paidDate}</span>
                    </div>
                  )}

                  {c.status === "Pending" && (
                    <div style={{ display: "flex", flexDirection: "column", minWidth: "100px" }}>
                      <span style={{ fontSize: "11px", color: "#94a3b8" }}>In Stage</span>
                      <span style={{ fontSize: "12px", color: "#f59e0b", fontWeight: "500" }}>{c.stage} ({c.daysInStage}d)</span>
                    </div>
                  )}
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <button style={{ display: "flex", alignItems: "center", gap: "4px", padding: "4px 10px", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "4px", fontSize: "11px", color: "#475569", cursor: "pointer" }}>
                    <Eye size={12} /> View
                  </button>
                  <ChevronRight size={16} color="#64748b" style={{ transform: isExpanded ? "rotate(90deg)" : "rotate(0deg)", transition: "transform 0.2s" }} />
                </div>
              </div>

              {/* Expanded details */}
              {isExpanded && (
                <div style={{ marginTop: "16px", paddingTop: "16px", borderTop: "1px solid #f1f5f9" }}>
                  {/* Progress pipeline */}
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "20px" }}>
                    {stageOrder.map((stage, i) => {
                      const isCompleted = stageOrder.indexOf(stage) < stageOrder.indexOf(c.stage) || c.stage === "Closed" && stage !== "Closed";
                      const isCurrent = stage === c.stage;
                      
                      return (
                        <div key={stage} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <div style={{ 
                            padding: "6px 14px", 
                            borderRadius: "20px", 
                            fontSize: "11px", 
                            fontWeight: "600",
                            background: isCompleted ? "#f0fdf4" : isCurrent ? "#eff6ff" : "#f8fafc",
                            color: isCompleted ? "#059669" : isCurrent ? "#3b82f6" : "#94a3b8",
                            border: isCurrent ? "1px solid #3b82f6" : "1px solid transparent",
                          }}>
                            {stage}
                          </div>
                          {i < stageOrder.length - 1 && (
                            <div style={{ width: "16px", height: "2px", background: isCompleted ? "#10b981" : "#e2e8f0" }} />
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Detail grid */}
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "16px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <div style={{ width: "28px", height: "28px", borderRadius: "6px", background: "#f0fdf4", display: "flex", alignItems: "center", justifyContent: "center", color: "#10b981" }}>
                        <User size={14} />
                      </div>
                      <div>
                        <div style={{ fontSize: "10px", color: "#94a3b8" }}>Member ID</div>
                        <div style={{ fontSize: "12px", fontWeight: "500", color: "#0f172a" }}>{c.memberId}</div>
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <div style={{ width: "28px", height: "28px", borderRadius: "6px", background: "#eff6ff", display: "flex", alignItems: "center", justifyContent: "center", color: "#3b82f6" }}>
                        <Building2 size={14} />
                      </div>
                      <div>
                        <div style={{ fontSize: "10px", color: "#94a3b8" }}>Branch</div>
                        <div style={{ fontSize: "12px", fontWeight: "500", color: "#0f172a" }}>{c.branch}</div>
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <div style={{ width: "28px", height: "28px", borderRadius: "6px", background: "#f5f3ff", display: "flex", alignItems: "center", justifyContent: "center", color: "#8b5cf6" }}>
                        <Shield size={14} />
                      </div>
                      <div>
                        <div style={{ fontSize: "10px", color: "#94a3b8" }}>Policy</div>
                        <div style={{ fontSize: "12px", fontWeight: "500", color: "#0f172a" }}>{c.policy}</div>
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <div style={{ width: "28px", height: "28px", borderRadius: "6px", background: "#fff7ed", display: "flex", alignItems: "center", justifyContent: "center", color: "#f59e0b" }}>
                        <User size={14} />
                      </div>
                      <div>
                        <div style={{ fontSize: "10px", color: "#94a3b8" }}>Verifier</div>
                        <div style={{ fontSize: "12px", fontWeight: "500", color: "#0f172a" }}>{c.verifier}</div>
                      </div>
                    </div>
                  </div>

                  {/* Notes and docs */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: "16px", alignItems: "flex-start" }}>
                    <div style={{ background: "#f8fafc", padding: "12px", borderRadius: "6px" }}>
                      <div style={{ fontSize: "11px", fontWeight: "600", color: "#64748b", marginBottom: "4px" }}>Notes</div>
                      <div style={{ fontSize: "12px", color: "#475569" }}>{c.notes}</div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "8px 12px", background: "#eff6ff", borderRadius: "6px" }}>
                      <FileText size={14} color="#3b82f6" />
                      <span style={{ fontSize: "12px", fontWeight: "500", color: "#3b82f6" }}>{c.documents} Documents</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
