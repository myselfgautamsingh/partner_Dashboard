import { useState } from "react";
import { Building2, Mail, Phone, MapPin, FileText, Shield, Headphones, Lock, Eye, EyeOff } from "lucide-react";

const card = { background: "white", borderRadius: "0", padding: "22px", boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 4px 20px rgba(0,0,0,0.03)", border: "1px solid rgba(0,0,0,0.05)" };

function InfoRow({ label, value }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", padding: "10px 0", borderBottom: "1px solid #f1f5f9" }}>
      <span style={{ fontSize: "12px", color: "#94a3b8", fontWeight: "500", minWidth: "160px" }}>{label}</span>
      <span style={{ fontSize: "13px", color: "#0f172a", fontWeight: "600", textAlign: "right" }}>{value}</span>
    </div>
  );
}

export default function Account() {
  const [showPass, setShowPass] = useState({ current: false, new: false, confirm: false });
  const [passwords, setPasswords] = useState({ current: "", new: "", confirm: "" });
  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "22px" }}>

      {/* Header */}
      <div>
        <h2 style={{ fontSize: "20px", fontWeight: "800", color: "#0f172a", margin: 0 }}>Account Details</h2>
        <p style={{ fontSize: "13px", color: "#94a3b8", marginTop: "3px" }}>Manage your company profile, contract information and security settings</p>
      </div>

      {/* Profile header card */}
      <div style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%)", borderRadius: "0", padding: "28px", display: "flex", alignItems: "center", gap: "22px", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "18px" }}>
          <div style={{ width: "64px", height: "64px", borderRadius: "0", background: "linear-gradient(135deg, #3b82f6, #6366f1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px", fontWeight: "800", color: "white", flexShrink: 0 }}>
            AF
          </div>
          <div>
            <h3 style={{ fontSize: "18px", fontWeight: "800", color: "white", margin: "0 0 4px" }}>Anand Finance Ltd</h3>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ fontSize: "12px", color: "#94a3b8" }}>DP-2024-0042</span>
              <span style={{ fontSize: "10px", fontWeight: "700", padding: "2px 10px", borderRadius: "20px", background: "#10b98133", color: "#34d399" }}>Active</span>
            </div>
          </div>
        </div>
        <button style={{ padding: "9px 20px", border: "1px solid rgba(255,255,255,0.2)", borderRadius: "8px", background: "transparent", color: "white", fontSize: "13px", fontWeight: "600", cursor: "pointer" }}>
          Edit Profile
        </button>
      </div>

      {/* 4 info cards grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>

        {/* Company Information */}
        <div style={card}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
            <div style={{ width: "32px", height: "32px", borderRadius: "9px", background: "#eff6ff", display: "flex", alignItems: "center", justifyContent: "center", color: "#3b82f6" }}><Building2 size={15} /></div>
            <h3 style={{ fontSize: "14px", fontWeight: "700", color: "#0f172a", margin: 0 }}>Company Information</h3>
          </div>
          <InfoRow label="Company Name"      value="Anand Finance Ltd" />
          <InfoRow label="Registration No."  value="CIN-U65100MH2018" />
          <InfoRow label="Industry"          value="Financial Services" />
          <InfoRow label="Company Size"      value="500-1000 employees" />
          <InfoRow label="Website"           value="www.anandfinance.in" />
        </div>

        {/* Contact Information */}
        <div style={card}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
            <div style={{ width: "32px", height: "32px", borderRadius: "9px", background: "#f0fdf4", display: "flex", alignItems: "center", justifyContent: "center", color: "#10b981" }}><Phone size={15} /></div>
            <h3 style={{ fontSize: "14px", fontWeight: "700", color: "#0f172a", margin: 0 }}>Contact Information</h3>
          </div>
          <InfoRow label="Primary Contact"   value="Rajesh Kumar" />
          <InfoRow label="Email"             value="rajesh@anandfinance.in" />
          <InfoRow label="Phone"             value="+91 98200 11234" />
          <InfoRow label="Alternate Phone"   value="+91 98200 56789" />
          <InfoRow label="Address"           value="Mumbai, Maharashtra" />
        </div>

        {/* Contract & Plan */}
        <div style={card}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
            <div style={{ width: "32px", height: "32px", borderRadius: "9px", background: "#f5f3ff", display: "flex", alignItems: "center", justifyContent: "center", color: "#8b5cf6" }}><FileText size={15} /></div>
            <h3 style={{ fontSize: "14px", fontWeight: "700", color: "#0f172a", margin: 0 }}>Contract and Plan</h3>
          </div>
          <InfoRow label="Contract Start"    value="01 Jan 2024" />
          <InfoRow label="Contract Renewal"  value="31 Dec 2026" />
          <div style={{ padding: "10px 0", borderBottom: "1px solid #f1f5f9" }}>
            <span style={{ fontSize: "12px", color: "#94a3b8", fontWeight: "500", display: "block", marginBottom: "8px" }}>Enrolled Plans</span>
            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
              {["GSSK", "GSJS", "Term Life"].map(plan => (
                <span key={plan} style={{ fontSize: "11px", fontWeight: "600", padding: "3px 10px", borderRadius: "20px", background: "#eff6ff", color: "#3b82f6" }}>{plan}</span>
              ))}
            </div>
          </div>
          <InfoRow label="SLA Tier"          value="Premium" />
          <InfoRow label="Account Manager"   value="Priya Sharma" />
        </div>

        {/* Support */}
        <div style={card}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
            <div style={{ width: "32px", height: "32px", borderRadius: "9px", background: "#fff7ed", display: "flex", alignItems: "center", justifyContent: "center", color: "#f59e0b" }}><Headphones size={15} /></div>
            <h3 style={{ fontSize: "14px", fontWeight: "700", color: "#0f172a", margin: 0 }}>Support</h3>
          </div>
          <InfoRow label="Support Email"     value="support@bharatbima.com" />
          <InfoRow label="Support Phone"     value="1800-200-0042" />
          <InfoRow label="Dedicated Manager" value="Priya Sharma" />
          <InfoRow label="Escalation Email"  value="escalations@bharatbima.com" />
          <div style={{ marginTop: "16px" }}>
            <button style={{ width: "100%", padding: "10px", background: "#3b82f6", color: "white", border: "none", borderRadius: "8px", fontSize: "13px", fontWeight: "600", cursor: "pointer" }}>
              Raise Support Ticket
            </button>
          </div>
        </div>
      </div>

      {/* Change Password */}
      <div style={card}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "20px" }}>
          <div style={{ width: "32px", height: "32px", borderRadius: "9px", background: "#fef2f2", display: "flex", alignItems: "center", justifyContent: "center", color: "#ef4444" }}><Lock size={15} /></div>
          <h3 style={{ fontSize: "14px", fontWeight: "700", color: "#0f172a", margin: 0 }}>Change Password</h3>
        </div>
        <form onSubmit={handleSave} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px", alignItems: "end" }}>
          {[
            { key: "current", label: "Current Password" },
            { key: "new",     label: "New Password" },
            { key: "confirm", label: "Confirm Password" },
          ].map(({ key, label }) => (
            <div key={key}>
              <label style={{ fontSize: "12px", fontWeight: "600", color: "#475569", display: "block", marginBottom: "6px" }}>{label}</label>
              <div style={{ position: "relative" }}>
                <input
                  type={showPass[key] ? "text" : "password"}
                  value={passwords[key]}
                  onChange={e => setPasswords(prev => ({ ...prev, [key]: e.target.value }))}
                  placeholder="••••••••"
                  style={{ width: "100%", padding: "9px 40px 9px 12px", border: "1px solid #e2e8f0", borderRadius: "8px", fontSize: "13px", color: "#0f172a", outline: "none", boxSizing: "border-box", background: "white" }}
                />
                <button type="button" onClick={() => setShowPass(p => ({ ...p, [key]: !p[key] }))}
                  style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#94a3b8", padding: "2px" }}>
                  {showPass[key] ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>
          ))}
          <div style={{ gridColumn: "1 / -1", display: "flex", gap: "10px", marginTop: "4px" }}>
            <button type="submit" style={{ padding: "10px 24px", background: "#3b82f6", color: "white", border: "none", borderRadius: "8px", fontSize: "13px", fontWeight: "600", cursor: "pointer" }}>
              Update Password
            </button>
            {saved && <span style={{ fontSize: "13px", color: "#10b981", alignSelf: "center", fontWeight: "600" }}>Password updated successfully</span>}
          </div>
        </form>
      </div>

    </div>
  );
}
