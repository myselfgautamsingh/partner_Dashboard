import { useState, useEffect, useCallback } from 'react';
import {
  getMembers,
  getClaims,
  getEnrollmentStats,
  getPaymentStats,
  getCommissionData,
} from '../api/client';

// Hook for Members data
export const useMembers = (partnerCode) => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMembers = useCallback(async (filters = {}) => {
    if (!partnerCode) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await getMembers(partnerCode, filters);
      if (response.Status && response.Details) {
        setMembers(response.Details);
      } else {
        setMembers([]);
      }
    } catch (err) {
      setError(err.message);
      console.error('Failed to fetch members:', err);
    } finally {
      setLoading(false);
    }
  }, [partnerCode]);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  return { members, loading, error, refetch: fetchMembers };
};

// Hook for Claims data
export const useClaims = (partnerCode) => {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchClaims = useCallback(async (filters = {}) => {
    if (!partnerCode) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await getClaims(partnerCode, filters);
      if (response.Status && response.Details) {
        setClaims(response.Details);
      } else {
        setClaims([]);
      }
    } catch (err) {
      setError(err.message);
      console.error('Failed to fetch claims:', err);
    } finally {
      setLoading(false);
    }
  }, [partnerCode]);

  useEffect(() => {
    fetchClaims();
  }, [fetchClaims]);

  return { claims, loading, error, refetch: fetchClaims };
};

// Hook for Dashboard Stats
export const useDashboardStats = (partnerCode) => {
  const [stats, setStats] = useState({
    totalCustomers: 0,
    activePolicies: 0,
    premiumCollected: 0,
    claimsRatio: 0,
    monthlyEnrollment: [],
    claimsMonthly: [],
    paymentsMonthly: [],
    branchPerformance: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStats = useCallback(async () => {
    if (!partnerCode) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // Fetch all stats in parallel
      const [enrollmentRes, paymentRes] = await Promise.all([
        getEnrollmentStats(partnerCode),
        getPaymentStats(partnerCode),
      ]);

      // Transform data for dashboard
      setStats({
        totalCustomers: enrollmentRes.TotalCustomers || 0,
        activePolicies: enrollmentRes.ActivePolicies || 0,
        premiumCollected: paymentRes.TotalPremium || 0,
        claimsRatio: paymentRes.ClaimsRatio || 0,
        monthlyEnrollment: enrollmentRes.MonthlyData || [],
        claimsMonthly: enrollmentRes.ClaimsData || [],
        paymentsMonthly: paymentRes.MonthlyData || [],
        branchPerformance: enrollmentRes.BranchPerformance || [],
      });
    } catch (err) {
      setError(err.message);
      console.error('Failed to fetch dashboard stats:', err);
    } finally {
      setLoading(false);
    }
  }, [partnerCode]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return { stats, loading, error, refetch: fetchStats };
};

// Hook for Commission data
export const useCommission = (partnerCode) => {
  const [commission, setCommission] = useState({
    earnedThisMonth: 0,
    pendingPayout: 0,
    totalEarned: 0,
    ytdCommission: 0,
    transactions: [],
    rate: 12.5,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCommission = useCallback(async () => {
    if (!partnerCode) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await getCommissionData(partnerCode);
      if (response.Status && response.Details) {
        setCommission({
          earnedThisMonth: response.Details.EarnedThisMonth || 0,
          pendingPayout: response.Details.PendingPayout || 0,
          totalEarned: response.Details.TotalEarned || 0,
          ytdCommission: response.Details.YTDCommission || 0,
          transactions: response.Details.Transactions || [],
          rate: response.Details.CommissionRate || 12.5,
        });
      }
    } catch (err) {
      setError(err.message);
      console.error('Failed to fetch commission:', err);
    } finally {
      setLoading(false);
    }
  }, [partnerCode]);

  useEffect(() => {
    fetchCommission();
  }, [fetchCommission]);

  return { commission, loading, error, refetch: fetchCommission };
};

export default {
  useMembers,
  useClaims,
  useDashboardStats,
  useCommission,
};
