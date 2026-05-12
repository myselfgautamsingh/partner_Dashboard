// API Client for 1Care Backend Integration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://internal.1carehealth.co/api';

// Get auth token from Firebase user
const getAuthToken = async () => {
  const user = window.currentUser;
  if (!user) throw new Error('Not authenticated');
  return await user.getIdToken();
};

// Generic API request handler
const apiRequest = async (endpoint, options = {}) => {
  const token = await getAuthToken();
  
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      'X-Amzn-Oidc-Accesstoken': token,
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `API Error: ${response.status}`);
  }

  return response.json();
};

// File Upload API
export const uploadFileToS3 = async (file, metadata) => {
  const token = await getAuthToken();
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await fetch(`${API_BASE_URL}/FileUpload/UploadFileData`, {
    method: 'POST',
    headers: {
      'TalendFileUploadData': JSON.stringify(metadata),
      'X-Amzn-Oidc-Accesstoken': token,
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Upload failed');
  }

  return response.json();
};

// Get Upload History
export const getUploadLog = async (dispartnerCode, condition = '') => {
  return apiRequest('/FileUpload/GetFileUploadLog', {
    method: 'POST',
    body: JSON.stringify({
      DispartnerCode: dispartnerCode,
      Condition: condition,
    }),
  });
};

// Get Partner Template
export const getPartnerTemplate = async (dispartnerName) => {
  return apiRequest('/FileUpload/GetDispartnerTemplate', {
    method: 'POST',
    body: JSON.stringify({ Dispartner: dispartnerName }),
  });
};

// Trigger Talend Job
export const invokeTalendJob = async (dispartnerName, batchPath) => {
  return apiRequest('/FileUpload/InvokeTalendJob', {
    method: 'POST',
    body: JSON.stringify({
      DispartnerName: dispartnerName,
      BatchPath: batchPath,
    }),
  });
};

// Members API
export const getMembers = async (partnerCode, filters = {}) => {
  return apiRequest('/customer/searchCustomer', {
    method: 'POST',
    body: JSON.stringify({
      partnerCode,
      ...filters,
    }),
  });
};

// Claims API
export const getClaims = async (partnerCode, filters = {}) => {
  return apiRequest('/claims/GetClaims', {
    method: 'POST',
    body: JSON.stringify({
      partnerCode,
      ...filters,
    }),
  });
};

// Enrollment API
export const getEnrollmentStats = async (partnerCode) => {
  return apiRequest('/partner/GetEnrollmentStats', {
    method: 'POST',
    body: JSON.stringify({ partnerCode }),
  });
};

// Payments API
export const getPaymentStats = async (partnerCode) => {
  return apiRequest('/partner/GetPaymentStats', {
    method: 'POST',
    body: JSON.stringify({ partnerCode }),
  });
};

// Commission API
export const getCommissionData = async (partnerCode) => {
  return apiRequest('/partner/GetCommission', {
    method: 'POST',
    body: JSON.stringify({ partnerCode }),
  });
};

export default {
  uploadFileToS3,
  getUploadLog,
  getPartnerTemplate,
  invokeTalendJob,
  getMembers,
  getClaims,
  getEnrollmentStats,
  getPaymentStats,
  getCommissionData,
};
