import { useState, useRef, useCallback, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Upload, CheckCircle, XCircle, Clock, CreditCard, FileUp, X, AlertCircle, Download, RefreshCw, FileText } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { uploadFileToS3, getUploadLog, getPartnerTemplate } from "../api/client";

const card = { background: "white", borderRadius: "12px", padding: "18px 20px", boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 4px 20px rgba(0,0,0,0.03)", border: "1px solid rgba(0,0,0,0.05)" };
const tip = { contentStyle: { borderRadius: "10px", border: "none", boxShadow: "0 8px 30px rgba(0,0,0,0.12)", fontSize: "12px", padding: "10px 14px" } };

const partnerConfig = {
  code: import.meta.env.VITE_PARTNER_CODE || "BHARATCARE001",
  name: import.meta.env.VITE_PARTNER_NAME || "BharatCare Finance Ltd",
  // Each DP gets their own folder under dispartnerfiles/
  // Format: dispartnerfiles/{DP_NAME}/
  infilePath: import.meta.env.VITE_PARTNER_INFILE_PATH || "dispartnerfiles/BharatCare/",
  talendBatchPath: "/talend/enrollment/batch",
};

const statusColors = {
  Rejected:  { bg: "#fef2f2", color: "#dc2626" },
  Duplicate: { bg: "#fff7ed", color: "#ea580c" },
  Warning:   { bg: "#fefce8", color: "#ca8a04" },
};

function UploadSection({ onReset, onUploadSuccess }) {
  const { user } = useAuth();
  const [dragOver, setDragOver] = useState(false);
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("idle"); // idle | uploading | processing | completed | failed
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState("");
  const [error, setError] = useState(null);
  const [uploadResult, setUploadResult] = useState(null);
  const inputRef = useRef();

  const acceptFile = (f) => {
    if (!f) return;
    const ext = f.name.split(".").pop().toLowerCase();
    if (!["csv"].includes(ext)) { 
      setError("Only .csv files are accepted."); 
      return; 
    }
    if (f.size > 10 * 1024 * 1024) {
      setError("File size must be less than 10MB");
      return;
    }
    setFile(f);
    setError(null);
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault(); setDragOver(false);
    acceptFile(e.dataTransfer.files[0]);
  }, []);

  const handleUpload = async () => {
    if (!file) return;
    setStatus("uploading"); 
    setProgress(0); 
    setPhase("Uploading");
    setError(null);

    try {
      // Get Firebase auth token
      const token = await user.getIdToken();
      
      // Prepare metadata matching 1Care format
      const metadata = {
        DispartnerName: partnerConfig.name,
        uploadedfilename: file.name,
        filetype: "enrollment",
        infilePath: partnerConfig.infilePath,
      };

      // Upload via 1Care API
      const formData = new FormData();
      formData.append("file", file);

      const apiUrl = import.meta.env.VITE_API_BASE_URL || "https://internal.1carehealth.co/api";
      
      const response = await fetch(`${apiUrl}/FileUpload/UploadFileData`, {
        method: "POST",
        headers: {
          "TalendFileUploadData": JSON.stringify(metadata),
          "X-Amzn-Oidc-Accesstoken": token,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Upload failed");
      }

      const result = await response.json();
      setUploadResult(result);
      setStatus("completed");
      setProgress(100);
      setPhase("Completed");
      
      if (onUploadSuccess) onUploadSuccess();
    } catch (err) {
      setError(err.message || "Upload failed");
      setStatus("failed");
      setProgress(0);
    }
  };

  const handleClear = () => { 
    setFile(null); 
    setStatus("idle"); 
    setProgress(0); 
    setPhase(""); 
    setError(null);
    setUploadResult(null);
    if (onReset) onReset(); 
  };

  // Fallback template headers based on 1Care enrollment format
  const fallbackTemplate = `srno,totalpremium,constructtype,tenuremonths,bitlycoipdf,customerlanguage,minsureproductcode,plancode,loanaccountno,proposalno,polstartdate,name,gender,dateofbirth,aadharpanvoterid,address,addressline2,city,region,country,pincode,occupation,mobilenumber,emailid,selfnomineename,selfnomineegender,selfnomineedateofbirth,selfnomineerelationship,spouseuniqueid,spousename,spousegender,spousedateofbirth,spouseaadharpanvoterid,spouserelationship,spouseoccupation,spousemobilenumber,spouseemailid,nomineespousename,nomineespousegender,nomineespousedateofbirth,nomineespouserelationship,dependentname1,dependentgender1,dependentdob1,dependentrelation1,dependentuniqueid1,dependentname2,dependentgender2,dependentdob2,dependentrelation2,dependentuniqueid2,dependentname3,dependentgender3,dependentdob3,dependentrelation3,dependentuniqueid3,dependentname4,dependentgender4,dependentdob4,dependentrelation4,dependentuniqueid4,dependentname5,dependentgender5,dependentdob5,dependentrelation5,dependentuniqueid5,dispartnercode,dispartnername,policynumber,dateprocessed,riskinsurercode,branchname,branchcode,memberid
1,3500,Reducing,120,,English,GCLP,CLB,LN-001,PROP-001,2026-05-15,Rajesh Kumar,Male,1985-03-15,ABCDE1234F,123 Main St,Block A,Mumbai,Maharashtra,India,400001,Software Engineer,9876543210,rajesh@example.com,Priya Kumar,Female,1987-06-20,Spouse,,Priya Kumar,Female,1987-06-20,ABCDE5678G,Spouse,Teacher,9876543211,priya@example.com,Rajesh Kumar,Male,1985-03-15,Spouse,Rahul Kumar,Male,2012-08-10,Child,ABCDE9012H,,,,,,,,,,,,,,,,BHARATCARE001,BharatCare Finance Ltd,,,,Mumbai Main,BC-MUM,MBR-BC-0001`;

  const handleDownloadTemplate = async () => {
    try {
      // Try API first
      const apiUrl = import.meta.env.VITE_API_BASE_URL;
      if (apiUrl && apiUrl !== "https://internal.1carehealth.co/api") {
        const response = await fetch(`${apiUrl}/FileUpload/GetDispartnerTemplate`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ Dispartner: partnerConfig.name }),
        });
        const result = await response.json();
        
        if (result.CsvString) {
          downloadCsv(result.CsvString, `${partnerConfig.name}_template.csv`);
          return;
        }
      }
      
      // Fallback to local template
      downloadCsv(fallbackTemplate, `${partnerConfig.name}_enrollment_template.csv`);
    } catch (err) {
      console.error("Template download error:", err);
      // Use fallback on any error
      downloadCsv(fallbackTemplate, `${partnerConfig.name}_enrollment_template.csv`);
    }
  };

  const downloadCsv = (csvContent, filename) => {
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const phases = ["Uploading", "Processing", "Validating", "Completed"];
  const phaseIndex = status === "completed" ? 3 : phases.indexOf(phase);

  return (
    <>
      {/* Template download */}
      <div style={{ ...card, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <h3 style={{ fontSize: "14px", fontWeight: "700", color: "#0f172a", margin: 0 }}>Download Upload Template</h3>
          <p style={{ fontSize: "12px", color: "#64748b", margin: "4px 0 0" }}>Get the correct CSV format for your data</p>
          <p style={{ fontSize: "11px", color: "#94a3b8", margin: "6px 0 0", fontFamily: "monospace" }}>
            S3: 1carehealth.talend/{partnerConfig.infilePath}Upload Format/
          </p>
        </div>
        <button 
          onClick={handleDownloadTemplate}
          style={{ display: "flex", alignItems: "center", gap: "6px", padding: "10px 18px", background: "#0f172a", color: "white", border: "none", borderRadius: "8px", fontSize: "13px", fontWeight: "600", cursor: "pointer" }}
        >
          <FileText size={14} /> Download Template
        </button>
      </div>

      {/* Drag & Drop Zone */}
      <div style={card}>
        <h3 style={{ fontSize: "14px", fontWeight: "700", color: "#0f172a", margin: "0 0 16px" }}>Upload Member Data File</h3>
        {error && (
          <div style={{ padding: "12px 16px", background: "#fef2f2", borderRadius: "8px", marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
            <AlertCircle size={16} color="#ef4444" />
            <span style={{ fontSize: "13px", color: "#dc2626" }}>{error}</span>
          </div>
        )}
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
              <p style={{ fontSize: "14px", fontWeight: "600", color: "#0f172a", margin: 0 }}>Drag and drop your CSV file here</p>
              <p style={{ fontSize: "13px", color: "#94a3b8", margin: 0 }}>or click to browse</p>
              <p style={{ fontSize: "11px", color: "#cbd5e1", margin: 0 }}>Accepted format: .csv (max 10MB)</p>
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
      {status === "completed" && uploadResult && (
        <div style={card}>
          <h3 style={{ fontSize: "14px", fontWeight: "700", color: "#0f172a", margin: "0 0 16px" }}>Upload Successful</h3>
          
          <div style={{ padding: "16px", background: "#f0fdf4", borderRadius: "10px", marginBottom: "16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
              <CheckCircle size={20} color="#10b981" />
              <span style={{ fontSize: "14px", fontWeight: "600", color: "#059669" }}>File uploaded to S3 successfully</span>
            </div>
            <p style={{ fontSize: "13px", color: "#64748b", margin: 0 }}>
              Your file has been uploaded and will be processed by Talend shortly. 
              Check the upload history below for processing status.
            </p>
          </div>

          <div style={{ display: "flex", gap: "10px" }}>
            <button onClick={handleClear} style={{ display: "flex", alignItems: "center", gap: "6px", padding: "10px 18px", background: "#0f172a", color: "white", border: "none", borderRadius: "8px", fontSize: "13px", fontWeight: "600", cursor: "pointer" }}>
              <Upload size={14} /> Upload Another File
            </button>
          </div>
        </div>
      )}
    </>
  );
}

const formatDate = (dateString) => {
  if (!dateString) return "—";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
};

function UploadHistoryTable({ uploads, loading }) {
  if (loading) {
    return <div style={{ padding: "40px", textAlign: "center", color: "#94a3b8" }}>Loading upload history...</div>;
  }

  if (!uploads || uploads.length === 0) {
    return <div style={{ padding: "40px", textAlign: "center", color: "#94a3b8" }}>No uploads found</div>;
  }

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
      case "processed":
        return { bg: "#f0fdf4", color: "#059669" };
      case "processing":
      case "fileuploaded":
        return { bg: "#eff6ff", color: "#3b82f6" };
      case "failed":
      case "error":
        return { bg: "#fef2f2", color: "#dc2626" };
      default:
        return { bg: "#fff7ed", color: "#d97706" };
    }
  };

  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
        <thead>
          <tr style={{ background: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
            {["Date", "File Name", "Partner", "Total", "Uploaded", "Rejected", "Duplicate", "Pending", "Premium", "Status"].map(h => (
              <th key={h} style={{ padding: "12px 14px", textAlign: "left", fontWeight: "600", color: "#64748b", whiteSpace: "nowrap", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {uploads.map((upload, i) => {
            const statusColors = getStatusColor(upload.FileStatus);
            return (
              <tr key={i} style={{ borderBottom: "1px solid #f1f5f9" }}>
                <td style={{ padding: "12px 14px", color: "#475569" }}>{formatDate(upload.Date)}</td>
                <td style={{ padding: "12px 14px", color: "#0f172a", fontWeight: "500" }}>{upload.FileName || upload.IntialFileName}</td>
                <td style={{ padding: "12px 14px", color: "#64748b" }}>{upload.DispartnerName}</td>
                <td style={{ padding: "12px 14px", color: "#475569", textAlign: "right" }}>{upload.TotalRecords?.toLocaleString() || 0}</td>
                <td style={{ padding: "12px 14px", color: "#10b981", textAlign: "right", fontWeight: "500" }}>{upload.UploadedFileRecords?.toLocaleString() || 0}</td>
                <td style={{ padding: "12px 14px", color: "#ef4444", textAlign: "right" }}>{upload.RejectedFileRecords?.toLocaleString() || 0}</td>
                <td style={{ padding: "12px 14px", color: "#f59e0b", textAlign: "right" }}>{upload.DuplicateFileRecords?.toLocaleString() || 0}</td>
                <td style={{ padding: "12px 14px", color: "#64748b", textAlign: "right" }}>{upload.PendingRecords?.toLocaleString() || 0}</td>
                <td style={{ padding: "12px 14px", color: "#475569", textAlign: "right", fontWeight: "600" }}>₹{upload.TotalPremium || 0}</td>
                <td style={{ padding: "12px 14px" }}>
                  <span style={{ fontSize: "11px", fontWeight: "600", padding: "3px 10px", borderRadius: "20px", background: statusColors.bg, color: statusColors.color, textTransform: "capitalize" }}>
                    {upload.FileStatus || "Processing"}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default function Uploads() {
  const [uploads, setUploads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    filesUploaded: 0,
    totalRecords: 0,
    rejectedRecords: 0,
    paymentsDone: 0,
    pendingPayment: 0,
  });

  // Fetch upload history
  const fetchUploadHistory = async () => {
    try {
      const result = await getUploadLog(partnerConfig.code);
      if (result.Status && result.Details) {
        setUploads(result.Details);
        
        // Calculate stats
        const totals = result.Details.reduce((acc, upload) => ({
          filesUploaded: acc.filesUploaded + 1,
          totalRecords: acc.totalRecords + (upload.TotalRecords || 0),
          rejectedRecords: acc.rejectedRecords + (upload.RejectedFileRecords || 0),
          paymentsDone: acc.paymentsDone + (upload.UploadedFileRecords || 0),
          pendingPayment: acc.pendingPayment + (upload.PendingRecords || 0),
        }), { filesUploaded: 0, totalRecords: 0, rejectedRecords: 0, paymentsDone: 0, pendingPayment: 0 });
        
        setStats(totals);
      }
    } catch (err) {
      console.error("Failed to fetch upload history:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUploadHistory();
    // Poll for updates every 30 seconds
    const interval = setInterval(fetchUploadHistory, 30000);
    return () => clearInterval(interval);
  }, []);

  const tiles = [
    { label: "Files Uploaded",   value: stats.filesUploaded,               bg: "#eff6ff", color: "#3b82f6", icon: <FileUp size={18} /> },
    { label: "Total Records",    value: stats.totalRecords.toLocaleString(), bg: "#f0fdf4", color: "#10b981", icon: <CheckCircle size={18} /> },
    { label: "Rejected Records", value: stats.rejectedRecords,              bg: "#fef2f2", color: "#ef4444", icon: <XCircle size={18} /> },
    { label: "Payments Done",    value: stats.paymentsDone,                 bg: "#f5f3ff", color: "#8b5cf6", icon: <CreditCard size={18} /> },
    { label: "Pending Payment",  value: stats.pendingPayment,               bg: "#fff7ed", color: "#f59e0b", icon: <Clock size={18} /> },
  ];

  const progressBars = [
    { label: "Successfully Processed", value: stats.totalRecords - stats.rejectedRecords, total: stats.totalRecords || 1, color: "#10b981", bg: "#f0fdf4", textColor: "#059669" },
    { label: "Rejected Records",        value: stats.rejectedRecords, total: stats.totalRecords || 1, color: "#ef4444", bg: "#fef2f2", textColor: "#dc2626" },
    { label: "Payments Done",           value: stats.paymentsDone,    total: stats.totalRecords || 1, color: "#6366f1", bg: "#eff6ff", textColor: "#4f46e5" },
    { label: "Pending Payment",         value: stats.pendingPayment,  total: stats.totalRecords || 1, color: "#f59e0b", bg: "#fff7ed", textColor: "#d97706" },
  ];

  // Calculate weekly data from uploads
  const weeklyData = [
    { week: "Week 1", processed: uploads.slice(0, 7).reduce((sum, u) => sum + (u.UploadedFileRecords || 0), 0), rejected: uploads.slice(0, 7).reduce((sum, u) => sum + (u.RejectedFileRecords || 0), 0) },
    { week: "Week 2", processed: uploads.slice(7, 14).reduce((sum, u) => sum + (u.UploadedFileRecords || 0), 0), rejected: uploads.slice(7, 14).reduce((sum, u) => sum + (u.RejectedFileRecords || 0), 0) },
    { week: "Week 3", processed: uploads.slice(14, 21).reduce((sum, u) => sum + (u.UploadedFileRecords || 0), 0), rejected: uploads.slice(14, 21).reduce((sum, u) => sum + (u.RejectedFileRecords || 0), 0) },
    { week: "Week 4", processed: uploads.slice(21, 28).reduce((sum, u) => sum + (u.UploadedFileRecords || 0), 0), rejected: uploads.slice(21, 28).reduce((sum, u) => sum + (u.RejectedFileRecords || 0), 0) },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "22px" }}>

      {/* Header */}
      <div>
        <h2 style={{ fontSize: "20px", fontWeight: "800", color: "#0f172a", margin: 0 }}>Data Uploads</h2>
        <p style={{ fontSize: "13px", color: "#94a3b8", marginTop: "3px" }}>Batch file upload to S3 → Talend processing → Enrollment</p>
      </div>

      {/* Upload Zone */}
      <UploadSection onUploadSuccess={fetchUploadHistory} />

      {/* KPI tiles */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "14px" }}>
        {tiles.map(({ label, value, bg, color, icon }) => (
          <div key={label} style={{ ...card, padding: "18px" }}>
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

      {/* Upload History */}
      <div style={card}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "18px" }}>
          <h3 style={{ fontSize: "14px", fontWeight: "700", color: "#0f172a", margin: 0 }}>Upload History</h3>
          <button 
            onClick={fetchUploadHistory}
            style={{ display: "flex", alignItems: "center", gap: "5px", padding: "6px 12px", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "6px", fontSize: "12px", color: "#475569", cursor: "pointer" }}
          >
            <RefreshCw size={14} /> Refresh
          </button>
        </div>
        <UploadHistoryTable uploads={uploads} loading={loading} />
      </div>
    </div>
  );
}
