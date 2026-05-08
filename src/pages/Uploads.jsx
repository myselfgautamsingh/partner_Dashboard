import { useState, useRef, useCallback } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Upload, CheckCircle, XCircle, Clock, CreditCard, FileUp, X, AlertCircle, Download, RefreshCw } from "lucide-react";
import { mockDashboardData as d } from "../firebase/mockData";

const card = { background: "white", borderRadius: "16px", padding: "22px", boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 4px 20px rgba(0,0,0,0.03)", border: "1px solid rgba(0,0,0,0.05)" };
const tip = { contentStyle: { borderRadius: "10px", border: "none", boxShadow: "0 8px 30px rgba(0,0,0,0.12)", fontSize: "12px", padding: "10px 14px" } };

const mockErrors = [
  { row: 4,  memberId: "MBR-1042", name: "Priya Sharma",    reason: "Invalid email format",            status: "Rejected" },
  { row: 9,  memberId: "MBR-1051", name: "Arjun Mehta",     reason: "Duplicate member ID",             status: "Duplicate" },
  { row: 15, memberId: "MBR-1063", name: "Kavya Reddy",     reason: "Missing required field: DOB",     status: "Rejected" },
  { row: 22, memberId: "MBR-1078", name: "Rohan Verma",     reason: "Invalid plan code",               status: "Warning" },
  { row: 31, memberId: "MBR-1091", name: "Sneha Iyer",      reason: "Duplicate member ID",             status: "Duplicate" },
  { row: 38, memberId: "MBR-1104", name: "Vikram Nair",     reason: "Missing required field: Gender",  status: "Warning" },
];

const statusColors = {
  Rejected:  { bg: "#fef2f2", color: "#dc2626" },
  Duplicate: { bg: "#fff7ed", color: "#ea580c" },
  Warning:   { bg: "#fefce8", color: "#ca8a04" },
};

function UploadSection({ onReset }) {
  const [dragOver, setDragOver] = useState(false);
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("idle"); // idle | uploading | processing | completed | failed
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState("");
  const inputRef = useRef();

  const acceptFile = (f) => {
    if (!f) return;
    const ext = f.name.split(".").pop().toLowerCase();
    if (!["csv", "xlsx"].includes(ext)) { alert("Only .csv and .xlsx files are accepted."); return; }
    setFile(f);
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault(); setDragOver(false);
    acceptFile(e.dataTransfer.files[0]);
  }, []);

  const handleUpload = () => {
    if (!file) return;
    setStatus("uploading"); setProgress(0); setPhase("Uploading");
    let p = 0;
    const interval = setInterval(() => {
      p += 5;
      setProgress(p);
      if (p >= 100) {
        clearInterval(interval);
        setPhase("Processing"); setStatus("processing"); setProgress(0);
        let p2 = 0;
        const interval2 = setInterval(() => {
          p2 += 8;
          setProgress(p2);
          if (p2 >= 60) { setPhase("Validating"); }
          if (p2 >= 100) {
            clearInterval(interval2);
            setStatus("completed"); setProgress(100);
          }
        }, 80);
      }
    }, 100);
  };

  const handleClear = () => { setFile(null); setStatus("idle"); setProgress(0); setPhase(""); if (onReset) onReset(); };

  const handleDownloadRejected = () => {
    const rows = ["Row,MemberID,Name,Reason,Status", ...mockErrors.map(e => `${e.row},${e.memberId},${e.name},"${e.reason}",${e.status}`)];
    const blob = new Blob([rows.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "rejected_records.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  const phases = ["Uploading", "Processing", "Validating", "Completed"];
  const phaseIndex = status === "completed" ? 3 : phases.indexOf(phase);

  return (
    <>
      {/* Drag & Drop Zone */}
      <div style={card}>
        <h3 style={{ fontSize: "14px", fontWeight: "700", color: "#0f172a", margin: "0 0 16px" }}>Upload Member Data File</h3>
        <div
          onDragOver={e => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => !file && inputRef.current.click()}
          style={{
            border: `2px dashed ${dragOver ? "#3b82f6" : "#cbd5e1"}`,
            borderRadius: "12px",
            background: dragOver ? "#eff6ff" : "#f8fafc",
            padding: "40px 24px",
            display: "flex", flexDirection: "column", alignItems: "center", gap: "10px",
            cursor: file ? "default" : "pointer",
            transition: "all 0.2s ease",
          }}
        >
          <input ref={inputRef} type="file" accept=".csv,.xlsx" style={{ display: "none" }} onChange={e => acceptFile(e.target.files[0])} />
          {!file ? (
            <>
              <div style={{ width: "52px", height: "52px", borderRadius: "14px", background: "#eff6ff", display: "flex", alignItems: "center", justifyContent: "center", color: "#3b82f6" }}>
                <Upload size={24} />
              </div>
              <p style={{ fontSize: "14px", fontWeight: "600", color: "#0f172a", margin: 0 }}>Drag and drop your CSV or Excel file here</p>
              <p style={{ fontSize: "13px", color: "#94a3b8", margin: 0 }}>or click to browse</p>
              <p style={{ fontSize: "11px", color: "#cbd5e1", margin: 0 }}>Accepted formats: .csv, .xlsx</p>
            </>
          ) : (
            <div style={{ display: "flex", alignItems: "center", gap: "14px", width: "100%", maxWidth: "480px" }}>
              <div style={{ width: "44px", height: "44px", borderRadius: "12px", background: "#eff6ff", display: "flex", alignItems: "center", justifyContent: "center", color: "#3b82f6", flexShrink: 0 }}>
                <FileUp size={20} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: "13px", fontWeight: "600", color: "#0f172a", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{file.name}</p>
                <p style={{ fontSize: "11px", color: "#94a3b8", margin: "2px 0 0" }}>
                  {(file.size / 1024).toFixed(1)} KB &nbsp;|&nbsp; {file.name.split(".").pop().toUpperCase()}
                </p>
              </div>
              <button onClick={e => { e.stopPropagation(); handleClear(); }} style={{ background: "none", border: "none", cursor: "pointer", color: "#94a3b8", padding: "4px" }}>
                <X size={16} />
              </button>
            </div>
          )}
        </div>

        {/* Action buttons */}
        {status === "idle" && (
          <div style={{ display: "flex", gap: "10px", marginTop: "16px" }}>
            <button
              onClick={handleUpload}
              disabled={!file}
              style={{ padding: "10px 22px", background: file ? "#3b82f6" : "#e2e8f0", color: file ? "white" : "#94a3b8", border: "none", borderRadius: "8px", fontSize: "13px", fontWeight: "600", cursor: file ? "pointer" : "not-allowed", transition: "background 0.2s" }}
            >
              Upload File
            </button>
            {file && (
              <button onClick={handleClear} style={{ padding: "10px 18px", background: "none", color: "#64748b", border: "1px solid #e2e8f0", borderRadius: "8px", fontSize: "13px", fontWeight: "500", cursor: "pointer" }}>
                Clear
              </button>
            )}
          </div>
        )}
      </div>

      {/* Processing Status */}
      {(status === "uploading" || status === "processing" || status === "completed") && (
        <div style={card}>
          <h3 style={{ fontSize: "14px", fontWeight: "700", color: "#0f172a", margin: "0 0 20px" }}>Upload Progress</h3>

          {/* Phase steps */}
          <div style={{ display: "flex", alignItems: "center", gap: "0", marginBottom: "24px" }}>
            {phases.map((p, i) => (
              <div key={p} style={{ display: "flex", alignItems: "center", flex: i < phases.length - 1 ? 1 : "none" }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" }}>
                  <div style={{
                    width: "28px", height: "28px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: "700",
                    background: i <= phaseIndex ? "#3b82f6" : "#f1f5f9",
                    color: i <= phaseIndex ? "white" : "#94a3b8",
                    transition: "all 0.3s",
                  }}>
                    {i < phaseIndex || status === "completed" && i <= phaseIndex ? <CheckCircle size={14} /> : i + 1}
                  </div>
                  <span style={{ fontSize: "10px", fontWeight: "600", color: i <= phaseIndex ? "#3b82f6" : "#94a3b8", whiteSpace: "nowrap" }}>{p}</span>
                </div>
                {i < phases.length - 1 && (
                  <div style={{ flex: 1, height: "2px", background: i < phaseIndex ? "#3b82f6" : "#f1f5f9", margin: "0 4px 18px", transition: "background 0.3s" }}></div>
                )}
              </div>
            ))}
          </div>

          {/* Progress bar */}
          <div style={{ height: "8px", background: "#f1f5f9", borderRadius: "4px", overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${progress}%`, background: status === "completed" ? "#10b981" : "#3b82f6", borderRadius: "4px", transition: "width 0.1s linear" }}></div>
          </div>
          <p style={{ fontSize: "12px", color: "#64748b", marginTop: "8px" }}>
            {status === "completed" ? "Processing complete" : `${phase}... ${progress}%`}
          </p>
        </div>
      )}

      {/* Results */}
      {status === "completed" && (
        <div style={card}>
          <h3 style={{ fontSize: "14px", fontWeight: "700", color: "#0f172a", margin: "0 0 16px" }}>Upload Results</h3>

          {/* Summary pills */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px", marginBottom: "24px" }}>
            {[
              { label: "Total Records", value: 248, bg: "#eff6ff", color: "#3b82f6" },
              { label: "Successful",    value: 242, bg: "#f0fdf4", color: "#10b981" },
              { label: "Rejected",      value: 4,   bg: "#fef2f2", color: "#ef4444" },
              { label: "Duplicate",     value: 2,   bg: "#fff7ed", color: "#ea580c" },
            ].map(({ label, value, bg, color }) => (
              <div key={label} style={{ background: bg, borderRadius: "10px", padding: "14px 16px", textAlign: "center" }}>
                <div style={{ fontSize: "22px", fontWeight: "800", color }}>{value}</div>
                <div style={{ fontSize: "11px", fontWeight: "600", color: "#64748b", marginTop: "2px" }}>{label}</div>
              </div>
            ))}
          </div>

          {/* Error table */}
          <h4 style={{ fontSize: "13px", fontWeight: "700", color: "#0f172a", margin: "0 0 12px", display: "flex", alignItems: "center", gap: "6px" }}>
            <AlertCircle size={14} color="#ef4444" /> Error Report
          </h4>
          <div style={{ overflowX: "auto", borderRadius: "10px", border: "1px solid #f1f5f9" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px" }}>
              <thead>
                <tr style={{ background: "#f8fafc" }}>
                  {["Row #", "Member ID", "Name", "Error Reason", "Status"].map(h => (
                    <th key={h} style={{ padding: "10px 14px", textAlign: "left", fontWeight: "600", color: "#64748b", whiteSpace: "nowrap", borderBottom: "1px solid #f1f5f9" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {mockErrors.map((row, i) => (
                  <tr key={i} style={{ borderBottom: i < mockErrors.length - 1 ? "1px solid #f8fafc" : "none" }}>
                    <td style={{ padding: "10px 14px", color: "#94a3b8", fontWeight: "600" }}>{row.row}</td>
                    <td style={{ padding: "10px 14px", color: "#475569", fontFamily: "monospace", fontSize: "11px" }}>{row.memberId}</td>
                    <td style={{ padding: "10px 14px", color: "#0f172a", fontWeight: "500" }}>{row.name}</td>
                    <td style={{ padding: "10px 14px", color: "#64748b" }}>{row.reason}</td>
                    <td style={{ padding: "10px 14px" }}>
                      <span style={{ fontSize: "10px", fontWeight: "700", padding: "3px 10px", borderRadius: "20px", background: statusColors[row.status].bg, color: statusColors[row.status].color }}>
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Action buttons */}
          <div style={{ display: "flex", gap: "10px", marginTop: "16px" }}>
            <button onClick={handleDownloadRejected} style={{ display: "flex", alignItems: "center", gap: "6px", padding: "10px 18px", background: "#0f172a", color: "white", border: "none", borderRadius: "8px", fontSize: "13px", fontWeight: "600", cursor: "pointer" }}>
              <Download size={14} /> Download Rejected Records
            </button>
            <button onClick={handleClear} style={{ display: "flex", alignItems: "center", gap: "6px", padding: "10px 18px", background: "none", color: "#3b82f6", border: "1px solid #3b82f6", borderRadius: "8px", fontSize: "13px", fontWeight: "600", cursor: "pointer" }}>
              <RefreshCw size={14} /> Re-upload Fixed File
            </button>
          </div>
        </div>
      )}
    </>
  );
}

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

      {/* Upload Zone */}
      <UploadSection />

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
