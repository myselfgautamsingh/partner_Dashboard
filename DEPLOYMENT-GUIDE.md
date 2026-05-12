# Partner Dashboard - Production Deployment Guide

## Overview

This dashboard is now **production-ready** and connects directly to the 1Care backend infrastructure:

- **File Upload**: CSV → S3 (`1carehealth.talend`) → Talend → Enrollment → Policy Email
- **Real-time Data**: Live polling for upload status, members, claims, payments
- **Authentication**: Firebase Auth with 1Care Cognito integration

---

## S3 Upload Flow (Same as 1Care DP Portal)

```
Partner Dashboard
       ↓
   Select CSV
       ↓
   Call /api/FileUpload/UploadFileData
       ↓
   Upload to S3: 1carehealth.talend/{partner_infilepath}/{partnername}_{timestamp}.csv
       ↓
   Log to tb_dp_prod_stats table
       ↓
   Trigger Talend (via HTTP GET to batch path)
       ↓
   Talend processes → Enrollment → Policy mail
```

---

## Environment Variables

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | 1Care BFF API URL | `https://internal.1carehealth.co/api` |
| `VITE_FIREBASE_API_KEY` | Firebase API key | `AIzaSyB...` |
| `VITE_FIREBASE_AUTH_DOMAIN` | Firebase Auth domain | `partner-dashboard.firebaseapp.com` |
| `VITE_FIREBASE_PROJECT_ID` | Firebase project ID | `partner-dashboard-prod` |
| `VITE_PARTNER_CODE` | Partner code in 1Care | `BHARATCARE001` |
| `VITE_PARTNER_NAME` | Partner name in 1Care | `BharatCare Finance Ltd` |

### Setup Steps

1. **Copy template**:
   ```bash
   cp env.template .env.local
   ```

2. **Fill in your values** from Firebase console and 1Care admin

3. **For Vercel deployment**, add env vars in Vercel Dashboard → Settings → Environment Variables

---

## API Integration Details

### Upload API

**Endpoint**: `POST /api/FileUpload/UploadFileData`

**Headers**:
```
X-Amzn-Oidc-Accesstoken: {firebase_token}
TalendFileUploadData: {"DispartnerName":"BharatCare Finance Ltd","uploadedfilename":"members.csv","filetype":"enrollment"}
```

**Body**: `multipart/form-data` with `file` field

### Upload History API

**Endpoint**: `POST /api/FileUpload/GetFileUploadLog`

**Response**: Returns records from `tb_dp_prod_stats` table with:
- Total Records, Uploaded, Rejected, Duplicate, Pending
- Total Premium
- Processing Status (FileUploaded → Processing → Completed)

---

## File Structure

### S3 Path Structure

Each DP gets their **own folder** under `dispartnerfiles/`:

```
s3://1carehealth.talend/
└── dispartnerfiles/
    ├── XL-01/                    ← Existing DP
    │   ├── Upload Format/        ← Templates
    │   └── {filename}.csv        ← Uploaded files
    ├── LETSHEGO/                 ← Another DP
    │   ├── Upload Format/
    │   └── {filename}.csv
    └── BharatCare/               ← New DP (example)
        ├── Upload Format/        ← Templates
        └── BharatCare Finance Ltd_{timestamp}.csv  ← Uploaded files
```

**File naming:** `{DispartnerName}_{yyyy-MM-dd HH-mm-ss}.csv`

**Full path example:**
```
s3://1carehealth.talend/dispartnerfiles/BharatCare/BharatCare Finance Ltd_2025-05-11 14-30-22.csv
```

The `infilePath` is configured in `tb_dp_dispartner_details` table per partner.

### CSV Format

Use the template download feature or match this format:
```csv
srno,totalpremium,constructtype,tenuremonths,bitlycoipdf,customerlanguage,minsureproductcode,plancode,loanaccountno,proposalno,polstartdate,name,gender,dateofbirth,aadharpanvoterid,address,addressline2,city,region,country,pincode,occupation,mobilenumber,emailid,selfnomineename,selfnomineegender,selfnomineedateofbirth,selfnomineerelationship,spouseuniqueid,spousename,spousegender,spousedateofbirth,spouseaadharpanvoterid,spouserelationship,spouseoccupation,spousemobilenumber,spouseemailid,nomineespousename,nomineespousegender,nomineespousedateofbirth,nomineespouserelationship,dependentname1,dependentgender1,dependentdob1,dependentrelation1,dependentuniqueid1,dependentname2,dependentgender2,dependentdob2,dependentrelation2,dependentuniqueid2,dependentname3,dependentgender3,dependentdob3,dependentrelation3,dependentuniqueid3,dependentname4,dependentgender4,dependentdob4,dependentrelation4,dependentuniqueid4,dependentname5,dependentgender5,dependentdob5,dependentrelation5,dependentuniqueid5,dispartnercode,dispartnername,policynumber,dateprocessed,riskinsurercode,branchname,branchcode,memberid
```

---

## Deployment Checklist

### Before First Deploy

- [ ] Set all environment variables in Vercel
- [ ] Configure CORS in 1Care BFF to allow dashboard domain
- [ ] Verify partner code exists in `tb_dp_dist_partner`
- [ ] Verify partner details exist in `tb_dp_dispartner_details`
- [ ] Test upload with small CSV (5-10 records)
- [ ] Verify Talend job triggers correctly
- [ ] Check policy emails are sent

### Vercel Build Settings

- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

---

## Testing from DP POV

### 1. Login
- Use Firebase auth (email/password or Google)
- Partner sees their own data only

### 2. Download Template
- Click "Download Template" in Uploads page
- Gets CSV with correct columns for their product

### 3. Upload File
- Drag & drop CSV (max 10MB)
- File uploads to S3
- Appears in upload history with "FileUploaded" status

### 4. Monitor Processing
- Upload history auto-refreshes every 30 seconds
- Status changes: FileUploaded → Processing → Completed/Error
- Can see: Total, Uploaded, Rejected, Duplicate, Pending counts

### 5. View Results
- Members page shows newly enrolled members
- Claims page shows claims for those members
- Commission page updates with new earnings

---

## Troubleshooting

### Upload Fails
- Check browser console for API errors
- Verify file is CSV format
- Check file size < 10MB
- Verify Firebase token is valid

### Talend Not Triggering
- Check `batchpath` in `tb_dp_dispartner_details`
- Verify Talend server is running
- Check API logs for InvokeTalendJob call

### Data Not Showing
- Check upload status in history table
- Verify partner code matches logged-in user
- Check browser network tab for API responses

---

## Architecture

```
┌─────────────────┐      ┌──────────────┐      ┌─────────────┐
│ Partner         │      │ 1Care BFF    │      │ Talend      │
│ Dashboard       │─────→│ (ECS)        │─────→│ (EC2)       │
│ (Vercel)        │      │              │      │             │
└─────────────────┘      └──────────────┘      └─────────────┘
                                │                      │
                                ↓                      ↓
                         ┌──────────────┐      ┌─────────────┐
                         │ S3 Bucket    │      │ MySQL RDS   │
                         │ 1carehealth  │      │ (etluat/    │
                         │ .talend      │      │ etlprod)    │
                         └──────────────┘      └─────────────┘
```

---

## Support

For issues contact:
- **1Care Tech Team**: tech@1carehealth.co
- **Talend Issues**: Check Talend logs at `C:/Talend/logs/`
