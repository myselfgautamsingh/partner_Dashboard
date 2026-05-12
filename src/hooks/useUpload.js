import { useState, useEffect, useCallback } from 'react';
import { uploadFileToS3, getUploadLog, invokeTalendJob } from '../api/client';

export const useUpload = (partnerCode, partnerName) => {
  const [uploads, setUploads] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState(null);
  const [pollingInterval, setPollingInterval] = useState(null);

  // Fetch upload history
  const fetchUploadHistory = useCallback(async () => {
    try {
      const response = await getUploadLog(partnerCode);
      if (response.Status && response.Details) {
        setUploads(response.Details);
      }
    } catch (err) {
      console.error('Failed to fetch upload log:', err);
    }
  }, [partnerCode]);

  // Start polling for status updates
  const startPolling = useCallback(() => {
    if (pollingInterval) clearInterval(pollingInterval);
    
    const interval = setInterval(() => {
      fetchUploadHistory();
    }, 10000); // Poll every 10 seconds
    
    setPollingInterval(interval);
    return () => clearInterval(interval);
  }, [fetchUploadHistory, pollingInterval]);

  // Upload file
  const uploadFile = useCallback(async (file, onProgress) => {
    setIsUploading(true);
    setUploadProgress(0);
    setError(null);

    try {
      // Validate file type
      if (!file.name.endsWith('.csv')) {
        throw new Error('Only CSV files are allowed');
      }

      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        throw new Error('File size must be less than 10MB');
      }

      // Prepare metadata matching 1Care format
      const metadata = {
        DispartnerName: partnerName,
        uploadedfilename: file.name,
        filetype: 'enrollment',
      };

      // Upload to S3 via 1Care API
      const result = await uploadFileToS3(file, metadata);
      
      setUploadProgress(100);
      
      // Refresh upload history
      await fetchUploadHistory();
      
      // Start polling for status
      startPolling();

      return result;
    } catch (err) {
      setError(err.message || 'Upload failed');
      throw err;
    } finally {
      setIsUploading(false);
    }
  }, [partnerCode, partnerName, fetchUploadHistory, startPolling]);

  // Trigger Talend processing
  const triggerProcessing = useCallback(async (batchPath) => {
    try {
      return await invokeTalendJob(partnerName, batchPath);
    } catch (err) {
      console.error('Failed to trigger Talend:', err);
      throw err;
    }
  }, [partnerName]);

  // Download CSV template
  const downloadTemplate = useCallback(async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/FileUpload/GetDispartnerTemplate`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ Dispartner: partnerName }),
        }
      );
      
      const data = await response.json();
      if (data.CsvString) {
        const blob = new Blob([data.CsvString], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${partnerName}_template.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
    } catch (err) {
      console.error('Failed to download template:', err);
      setError('Failed to download template');
    }
  }, [partnerName]);

  // Cleanup polling on unmount
  useEffect(() => {
    return () => {
      if (pollingInterval) clearInterval(pollingInterval);
    };
  }, [pollingInterval]);

  // Initial fetch
  useEffect(() => {
    if (partnerCode) {
      fetchUploadHistory();
      startPolling();
    }
  }, [partnerCode, fetchUploadHistory, startPolling]);

  return {
    uploads,
    isUploading,
    uploadProgress,
    error,
    uploadFile,
    triggerProcessing,
    downloadTemplate,
    refreshHistory: fetchUploadHistory,
  };
};

export default useUpload;
