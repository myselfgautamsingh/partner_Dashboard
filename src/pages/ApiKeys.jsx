import { useState } from "react";
import { Eye, EyeOff, Copy, Check, RefreshCw, Zap, Activity, BarChart2, Shield, X } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const card = { background: "white", borderRadius: "16px", padding: "22px", boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 4px 20px rgba(0,0,0,0.03)", border: "1px solid rgba(0,0,0,0.05)" };
const tip = { contentStyle: { borderRadius: "10px", border: "none", boxShadow: "0 8px 30px rgba(0,0,0,0.12)", fontSize: "12px", padding: "10px 14px" } };

const FULL_KEY = "bb_live_xK9mP3tR8zQw2vLnYjFdC6sU1aOp4hBe";
const MASKED_KEY = "bb_live_" + "x".repeat(24) + "xK9mP";

const usageData = Array.from({ length: 14 }, (_, i) => ({
  day: `May ${i + 1}`,
  requests: Math.floor(Math.random() * 90) + 30,
}));

const testEndpoints = [
  "GET /api/v1/enrollment/members",
  "GET /api/v1/claims",
  "GET /api/v1/payments",
  "GET /api/v1/payments/pending",
];

const mockResponses = {
  "GET /api/v1/enrollment/members": `{\n  "total": 3240,\n  "page": 1,\n  "members": [\n    { "id": "MBR-1001", "name": "Ravi Sharma", "status": "active" }\n  ]\n}`,
  "GET /api/v1/claims": `{\n  "total": 128,\n  "claims": [\n    { "id": "CLM-2024-0892", "status": "approved", "amount": 45000 }\n  ]\n}`,
  "GET /api/v1/payments": `{\n  "total": 18,\n  "payments": [\n    { "id": "PAY-2024-0041", "amount": 124500, "status": "completed" }\n  ]\n}`,
  "GET /api/v1/payments/pending": `{\n  "total_pending": 2,\n  "amount_due": 67200\n}`,
};

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);
  return (
    <button onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
      style={{ display: "flex", alignItems: "center", gap: "4px", padding: "5px 12px", background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "6px", color: "#94a3b8", fontSize: "12px", fontWeight: "600", cursor: "pointer" }}>
      {copied ? <Check size={12} color="#10b981" /> : <Copy size={12} />}
      {copied ? "Copied!" : "Copy"}
    </button>
  );
}

export default function ApiKeys() {
  const [revealed, setRevealed] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [regenerated, setRegenerated] = useState(false);
  const [selectedEndpoint, setSelectedEndpoint] = useState(testEndpoints[0]);
  const [testResult, setTestResult] = useState(null);
  const [testing, setTesting] = useState(false);
  const [webhookUrl, setWebhookUrl] = useState("");
  const [webhookEvents, setWebhookEvents] = useState({ enrollment: false, claim: false, payment: false, upload: false });
  const [webhookSaved, setWebhookSaved] = useState(false);

  const handleRegenerate = () => {
    setShowConfirm(false);
    setRegenerated(true);
    setTimeout(() => setRegenerated(false), 3000);
  };

  const handleTest = () => {
    setTesting(true);
    setTestResult(null);
    setTimeout(() => {
      setTestResult(mockResponses[selectedEndpoint]);
      setTesting(false);
    }, 1200);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "22px" }}>

      {/* Header */}
      <div>
        <h2 style={{ fontSize: "20px", fontWeight: "800", color: "#0f172a", margin: 0 }}>API Keys and Integration</h2>
        <p style={{ fontSize: "13px", color: "#94a3b8", marginTop: "3px" }}>Manage your API credentials, monitor usage, and configure webhooks</p>
      </div>

      {/* API Key card */}
      <div style={{ ...card, background: "#0f172a" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
          <div>
            <p style={{ fontSize: "11px", fontWeight: "600", color: "#475569", textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 4px" }}>Live API Key</p>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <code style={{ fontSize: "14px", fontFamily: "monospace", color: "#e2e8f0", letterSpacing: "0.03em" }}>
                {revealed ? FULL_KEY : MASKED_KEY}
              </code>
              <button onClick={() => setRevealed(r => !r)} style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "6px", padding: "4px 10px", color: "#94a3b8", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px", fontSize: "12px" }}>
                {revealed ? <EyeOff size={13} /> : <Eye size={13} />}
                {revealed ? "Hide" : "Reveal"}
              </button>
              <CopyButton text={revealed ? FULL_KEY : MASKED_KEY} />
            </div>
          </div>
          <span style={{ fontSize: "10px", fontWeight: "700", padding: "3px 12px", borderRadius: "20px", background: "#10b98133", color: "#34d399" }}>Active</span>
        </div>
        <div style={{ display: "flex", gap: "24px", borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "14px" }}>
          <div><p style={{ fontSize: "11px", color: "#475569", margin: "0 0 2px" }}>Created</p><p style={{ fontSize: "12px", color: "#94a3b8", margin: 0 }}>01 Mar 2024</p></div>
          <div><p style={{ fontSize: "11px", color: "#475569", margin: "0 0 2px" }}>Last Used</p><p style={{ fontSize: "12px", color: "#94a3b8", margin: 0 }}>Today, 2:34 PM</p></div>
        </div>
        {regenerated && <p style={{ fontSize: "12px", color: "#34d399", marginTop: "10px" }}>API key regenerated successfully. Update your integrations.</p>}
      </div>

      {/* Key stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "14px" }}>
        {[
          { label: "Requests Today",       value: "47",    icon: <Zap size={17} />,      bg: "#eff6ff", color: "#3b82f6" },
          { label: "Requests This Month",  value: "1,284", icon: <Activity size={17} />, bg: "#f0fdf4", color: "#10b981" },
          { label: "Rate Limit",           value: "1,000/day", icon: <BarChart2 size={17} />, bg: "#f5f3ff", color: "#8b5cf6" },
          { label: "Success Rate",         value: "98.2%", icon: <Shield size={17} />,   bg: "#f0fdf4", color: "#10b981" },
        ].map(({ label, value, icon, bg, color }) => (
          <div key={label} style={{ ...card, padding: "18px", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "3px", background: color, borderRadius: "16px 16px 0 0" }}></div>
            <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: bg, color, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "10px" }}>{icon}</div>
            <div style={{ fontSize: "22px", fontWeight: "800", color: "#0f172a" }}>{value}</div>
            <div style={{ fontSize: "11px", color: "#94a3b8", marginTop: "4px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.04em" }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Usage chart */}
      <div style={card}>
        <h3 style={{ fontSize: "14px", fontWeight: "700", color: "#0f172a", margin: "0 0 4px" }}>API Usage (Last 14 Days)</h3>
        <p style={{ fontSize: "12px", color: "#94a3b8", margin: "0 0 20px" }}>Daily request volume</p>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={usageData} margin={{ top: 0, right: 5, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis dataKey="day" tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} interval={2} />
            <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
            <Tooltip {...tip} />
            <Line type="monotone" dataKey="requests" stroke="#3b82f6" strokeWidth={2} dot={false} name="Requests" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Test API section */}
      <div style={card}>
        <h3 style={{ fontSize: "14px", fontWeight: "700", color: "#0f172a", margin: "0 0 16px" }}>Test API</h3>
        <div style={{ display: "flex", gap: "10px", marginBottom: "16px" }}>
          <select value={selectedEndpoint} onChange={e => { setSelectedEndpoint(e.target.value); setTestResult(null); }}
            style={{ flex: 1, padding: "9px 14px", border: "1px solid #e2e8f0", borderRadius: "8px", fontSize: "13px", color: "#0f172a", background: "white", outline: "none", cursor: "pointer" }}>
            {testEndpoints.map(ep => <option key={ep}>{ep}</option>)}
          </select>
          <button onClick={handleTest} disabled={testing}
            style={{ padding: "9px 22px", background: testing ? "#e2e8f0" : "#3b82f6", color: testing ? "#94a3b8" : "white", border: "none", borderRadius: "8px", fontSize: "13px", fontWeight: "600", cursor: testing ? "not-allowed" : "pointer" }}>
            {testing ? "Sending..." : "Send Test Request"}
          </button>
        </div>
        {testResult && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#1e293b", padding: "8px 14px", borderRadius: "8px 8px 0 0" }}>
              <span style={{ fontSize: "11px", color: "#64748b", fontWeight: "600" }}>Response</span>
              <span style={{ fontSize: "10px", fontWeight: "700", padding: "2px 8px", borderRadius: "4px", background: "#10b98133", color: "#34d399" }}>200 OK</span>
            </div>
            <pre style={{ margin: 0, background: "#0f172a", padding: "14px", borderRadius: "0 0 8px 8px", fontSize: "11px", color: "#e2e8f0", fontFamily: "monospace", lineHeight: "1.6", overflowX: "auto" }}>
              {testResult}
            </pre>
          </div>
        )}
      </div>

      {/* Webhook section */}
      <div style={card}>
        <h3 style={{ fontSize: "14px", fontWeight: "700", color: "#0f172a", margin: "0 0 16px" }}>Webhook Configuration</h3>
        <div style={{ marginBottom: "16px" }}>
          <label style={{ fontSize: "12px", fontWeight: "600", color: "#475569", display: "block", marginBottom: "6px" }}>Webhook URL</label>
          <input value={webhookUrl} onChange={e => setWebhookUrl(e.target.value)}
            placeholder="https://your-app.com/webhooks/bharatbima"
            style={{ width: "100%", padding: "9px 14px", border: "1px solid #e2e8f0", borderRadius: "8px", fontSize: "13px", color: "#0f172a", outline: "none", boxSizing: "border-box", background: "white" }} />
        </div>
        <label style={{ fontSize: "12px", fontWeight: "600", color: "#475569", display: "block", marginBottom: "10px" }}>Events to Subscribe</label>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginBottom: "18px" }}>
          {[
            { key: "enrollment", label: "Enrollment Processed" },
            { key: "claim",      label: "Claim Filed" },
            { key: "payment",    label: "Payment Received" },
            { key: "upload",     label: "Upload Failed" },
          ].map(({ key, label }) => (
            <label key={key} style={{ display: "flex", alignItems: "center", gap: "7px", fontSize: "13px", color: "#374151", cursor: "pointer", padding: "7px 14px", border: `1px solid ${webhookEvents[key] ? "#3b82f6" : "#e2e8f0"}`, borderRadius: "8px", background: webhookEvents[key] ? "#eff6ff" : "white", transition: "all 0.15s" }}>
              <input type="checkbox" checked={webhookEvents[key]} onChange={e => setWebhookEvents(p => ({ ...p, [key]: e.target.checked }))} style={{ width: "14px", height: "14px", accentColor: "#3b82f6" }} />
              {label}
            </label>
          ))}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <button onClick={() => { setWebhookSaved(true); setTimeout(() => setWebhookSaved(false), 2500); }}
            style={{ padding: "10px 22px", background: "#3b82f6", color: "white", border: "none", borderRadius: "8px", fontSize: "13px", fontWeight: "600", cursor: "pointer" }}>
            Save Webhook
          </button>
          {webhookSaved && <span style={{ fontSize: "13px", color: "#10b981", fontWeight: "600" }}>Webhook saved successfully</span>}
        </div>
      </div>

      {/* Danger Zone */}
      <div style={{ ...card, border: "1px solid #fee2e2" }}>
        <h3 style={{ fontSize: "14px", fontWeight: "700", color: "#ef4444", margin: "0 0 8px" }}>Danger Zone</h3>
        <p style={{ fontSize: "13px", color: "#64748b", margin: "0 0 14px" }}>Regenerating will invalidate your current key immediately. All existing integrations will stop working until updated.</p>
        <button onClick={() => setShowConfirm(true)}
          style={{ padding: "9px 20px", background: "none", color: "#ef4444", border: "1px solid #ef4444", borderRadius: "8px", fontSize: "13px", fontWeight: "600", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}>
          <RefreshCw size={14} /> Regenerate API Key
        </button>
      </div>

      {/* Confirmation modal */}
      {showConfirm && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
          <div style={{ background: "white", borderRadius: "16px", padding: "28px", width: "420px", boxShadow: "0 20px 60px rgba(0,0,0,0.3)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
              <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#0f172a", margin: 0 }}>Regenerate API Key?</h3>
              <button onClick={() => setShowConfirm(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#94a3b8" }}><X size={18} /></button>
            </div>
            <p style={{ fontSize: "14px", color: "#64748b", margin: "0 0 22px", lineHeight: "1.6" }}>
              This will immediately invalidate your current key. All existing integrations will break until you update them with the new key.
            </p>
            <div style={{ display: "flex", gap: "10px" }}>
              <button onClick={handleRegenerate} style={{ flex: 1, padding: "10px", background: "#ef4444", color: "white", border: "none", borderRadius: "8px", fontSize: "13px", fontWeight: "600", cursor: "pointer" }}>
                Yes, Regenerate
              </button>
              <button onClick={() => setShowConfirm(false)} style={{ flex: 1, padding: "10px", background: "#f1f5f9", color: "#475569", border: "none", borderRadius: "8px", fontSize: "13px", fontWeight: "600", cursor: "pointer" }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
