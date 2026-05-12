import { useState } from "react";
import { Copy, Check, ChevronDown, ChevronUp } from "lucide-react";

const card = { background: "white", borderRadius: "12px", padding: "18px 20px", boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 4px 20px rgba(0,0,0,0.03)", border: "1px solid rgba(0,0,0,0.05)" };

const methodColors = {
  POST:   { bg: "#f0fdf4", color: "#10b981" },
  GET:    { bg: "#eff6ff", color: "#3b82f6" },
  DELETE: { bg: "#fef2f2", color: "#ef4444" },
};

const apiData = {
  "Enrollment APIs": [
    {
      method: "POST", url: "/api/v1/enrollment/upload", desc: "Upload member CSV for batch enrollment",
      headers: `Authorization: Bearer <your_token>\nContent-Type: multipart/form-data`,
      body: `{\n  "file": "<binary CSV/XLSX>",\n  "plan_code": "GSSK",\n  "dp_code": "DP-2024-0042"\n}`,
      response: `{\n  "batch_id": "BATCH-20240501-001",\n  "status": "queued",\n  "total_records": 248,\n  "message": "File uploaded successfully"\n}`,
      errors: [{ code: 400, meaning: "Invalid file format" }, { code: 401, meaning: "Unauthorized" }, { code: 413, meaning: "File size exceeds 10MB limit" }],
    },
    {
      method: "GET", url: "/api/v1/enrollment/status/{batch_id}", desc: "Check upload and processing status of a batch",
      headers: `Authorization: Bearer <your_token>`,
      body: null,
      response: `{\n  "batch_id": "BATCH-20240501-001",\n  "status": "completed",\n  "processed": 242,\n  "rejected": 4,\n  "duplicate": 2\n}`,
      errors: [{ code: 401, meaning: "Unauthorized" }, { code: 404, meaning: "Batch not found" }],
    },
    {
      method: "GET", url: "/api/v1/enrollment/members", desc: "List all enrolled members under this DP",
      headers: `Authorization: Bearer <your_token>`,
      body: null,
      response: `{\n  "total": 3240,\n  "page": 1,\n  "members": [\n    { "id": "MBR-1001", "name": "Ravi Sharma", "plan": "GSSK", "status": "active" }\n  ]\n}`,
      errors: [{ code: 401, meaning: "Unauthorized" }, { code: 403, meaning: "Access denied" }],
    },
    {
      method: "DELETE", url: "/api/v1/enrollment/member/{id}", desc: "Remove a member from the enrolled list",
      headers: `Authorization: Bearer <your_token>`,
      body: null,
      response: `{\n  "success": true,\n  "message": "Member MBR-1001 removed successfully"\n}`,
      errors: [{ code: 401, meaning: "Unauthorized" }, { code: 404, meaning: "Member not found" }],
    },
  ],
  "Claims APIs": [
    {
      method: "POST", url: "/api/v1/claims/file", desc: "File a new claim for an enrolled member",
      headers: `Authorization: Bearer <your_token>\nContent-Type: application/json`,
      body: `{\n  "member_id": "MBR-1001",\n  "claim_type": "hospitalization",\n  "amount": 45000,\n  "documents": ["bill.pdf", "discharge_summary.pdf"]\n}`,
      response: `{\n  "claim_id": "CLM-2024-0892",\n  "status": "filed",\n  "estimated_processing": "5-7 business days"\n}`,
      errors: [{ code: 400, meaning: "Missing required fields" }, { code: 404, meaning: "Member not found" }],
    },
    {
      method: "GET", url: "/api/v1/claims", desc: "Get all claims filed under this DP account",
      headers: `Authorization: Bearer <your_token>`,
      body: null,
      response: `{\n  "total": 128,\n  "claims": [\n    { "id": "CLM-2024-0892", "member": "Ravi Sharma", "amount": 45000, "status": "approved" }\n  ]\n}`,
      errors: [{ code: 401, meaning: "Unauthorized" }],
    },
    {
      method: "GET", url: "/api/v1/claims/{claim_id}", desc: "Get detailed information for a specific claim",
      headers: `Authorization: Bearer <your_token>`,
      body: null,
      response: `{\n  "claim_id": "CLM-2024-0892",\n  "member_id": "MBR-1001",\n  "status": "approved",\n  "approved_amount": 42000,\n  "settlement_date": "2024-05-10"\n}`,
      errors: [{ code: 401, meaning: "Unauthorized" }, { code: 404, meaning: "Claim not found" }],
    },
  ],
  "Payment APIs": [
    {
      method: "GET", url: "/api/v1/payments", desc: "Get full payment history for this DP account",
      headers: `Authorization: Bearer <your_token>`,
      body: null,
      response: `{\n  "total": 18,\n  "payments": [\n    { "id": "PAY-2024-0041", "amount": 124500, "date": "2024-04-01", "status": "completed" }\n  ]\n}`,
      errors: [{ code: 401, meaning: "Unauthorized" }],
    },
    {
      method: "GET", url: "/api/v1/payments/pending", desc: "Get list of pending and due payments",
      headers: `Authorization: Bearer <your_token>`,
      body: null,
      response: `{\n  "total_pending": 2,\n  "amount_due": 67200,\n  "payments": [\n    { "id": "PAY-2024-0042", "due_date": "2024-06-01", "amount": 67200 }\n  ]\n}`,
      errors: [{ code: 401, meaning: "Unauthorized" }],
    },
  ],
};

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button onClick={handleCopy} style={{ display: "flex", alignItems: "center", gap: "4px", padding: "4px 10px", background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "6px", color: "#94a3b8", fontSize: "11px", fontWeight: "600", cursor: "pointer" }}>
      {copied ? <Check size={12} color="#10b981" /> : <Copy size={12} />}
      {copied ? "Copied!" : "Copy"}
    </button>
  );
}

function CodeBlock({ label, content }) {
  return (
    <div style={{ marginBottom: "10px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#1e293b", padding: "8px 14px", borderRadius: "8px 8px 0 0" }}>
        <span style={{ fontSize: "11px", fontWeight: "600", color: "#64748b" }}>{label}</span>
        <CopyButton text={content} />
      </div>
      <pre style={{ margin: 0, background: "#0f172a", padding: "14px", borderRadius: "0 0 8px 8px", fontSize: "11px", color: "#e2e8f0", overflowX: "auto", lineHeight: "1.6", fontFamily: "monospace" }}>
        {content}
      </pre>
    </div>
  );
}

function EndpointBlock({ ep }) {
  const [open, setOpen] = useState(false);
  const mc = methodColors[ep.method];
  return (
    <div style={{ border: "1px solid #f1f5f9", borderRadius: "12px", overflow: "hidden", marginBottom: "12px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "14px 18px", background: "#f8fafc", cursor: "pointer" }} onClick={() => setOpen(o => !o)}>
        <span style={{ fontSize: "11px", fontWeight: "800", padding: "3px 10px", borderRadius: "6px", background: mc.bg, color: mc.color, letterSpacing: "0.05em", flexShrink: 0 }}>{ep.method}</span>
        <code style={{ fontSize: "13px", fontWeight: "600", color: "#0f172a", fontFamily: "monospace" }}>{ep.url}</code>
        <span style={{ fontSize: "12px", color: "#64748b", flex: 1 }}>{ep.desc}</span>
        <span style={{ color: "#94a3b8" }}>{open ? <ChevronUp size={15} /> : <ChevronDown size={15} />}</span>
      </div>
      {open && (
        <div style={{ padding: "16px 18px", borderTop: "1px solid #f1f5f9" }}>
          <p style={{ fontSize: "12px", color: "#64748b", margin: "0 0 14px", display: "flex", alignItems: "center", gap: "6px" }}>
            <span style={{ background: "#fff7ed", color: "#f59e0b", fontSize: "10px", fontWeight: "700", padding: "2px 8px", borderRadius: "4px" }}>AUTH</span>
            Requires Bearer token in Authorization header
          </p>
          <CodeBlock label="Request Headers" content={ep.headers} />
          {ep.body && <CodeBlock label="Request Body" content={ep.body} />}
          <CodeBlock label="Response Example" content={ep.response} />
          <div style={{ marginTop: "12px" }}>
            <p style={{ fontSize: "12px", fontWeight: "600", color: "#475569", margin: "0 0 8px" }}>Error Codes</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              {ep.errors.map(e => (
                <div key={e.code} style={{ display: "flex", gap: "12px", fontSize: "12px", padding: "6px 10px", background: "#f8fafc", borderRadius: "6px" }}>
                  <span style={{ fontWeight: "700", color: "#ef4444", fontFamily: "monospace", minWidth: "36px" }}>{e.code}</span>
                  <span style={{ color: "#64748b" }}>{e.meaning}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ApiDocs() {
  const [activeTab, setActiveTab] = useState("Enrollment APIs");
  const tabs = ["Enrollment APIs", "Claims APIs", "Payment APIs"];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "22px" }}>

      {/* Header */}
      <div>
        <h2 style={{ fontSize: "20px", fontWeight: "800", color: "#0f172a", margin: 0 }}>API Documentation</h2>
        <p style={{ fontSize: "13px", color: "#94a3b8", marginTop: "3px" }}>Integrate directly with Bharat Bima using our REST APIs</p>
      </div>

      {/* Getting Started card */}
      <div style={{ ...card, background: "#0f172a" }}>
        <h3 style={{ fontSize: "14px", fontWeight: "700", color: "white", margin: "0 0 16px" }}>Getting Started</h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px" }}>
          {[
            { label: "Base URL",    value: "https://api.bharatbima.com/partner/v1" },
            { label: "Auth",        value: "Bearer token in Authorization header" },
            { label: "Rate Limit",  value: "1,000 requests / day" },
          ].map(({ label, value }) => (
            <div key={label}>
              <p style={{ fontSize: "11px", fontWeight: "600", color: "#475569", margin: "0 0 4px", textTransform: "uppercase", letterSpacing: "0.06em" }}>{label}</p>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <code style={{ fontSize: "12px", color: "#e2e8f0", fontFamily: "monospace" }}>{value}</code>
                <CopyButton text={value} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: "4px", background: "#f1f5f9", padding: "4px", borderRadius: "10px", width: "fit-content" }}>
        {tabs.map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} style={{ padding: "8px 18px", borderRadius: "7px", border: "none", fontSize: "13px", fontWeight: "600", cursor: "pointer", background: activeTab === tab ? "white" : "transparent", color: activeTab === tab ? "#0f172a" : "#64748b", boxShadow: activeTab === tab ? "0 1px 4px rgba(0,0,0,0.08)" : "none", transition: "all 0.15s" }}>
            {tab}
          </button>
        ))}
      </div>

      {/* Endpoint list */}
      <div style={card}>
        <h3 style={{ fontSize: "14px", fontWeight: "700", color: "#0f172a", margin: "0 0 16px" }}>{activeTab}</h3>
        {apiData[activeTab].map((ep, i) => <EndpointBlock key={i} ep={ep} />)}
      </div>
    </div>
  );
}
