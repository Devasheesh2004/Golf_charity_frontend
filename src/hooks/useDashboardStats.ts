import { useState, useCallback, useEffect } from "react";
import { useApi } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

interface DashboardStats {
  subscription: {
    status: string;
    plan: string;
    renewal_date: string | null;
  };
  charity: {
    name: string;
    percentage: number;
    total_contributed: number;
  };
  participation: {
    total_draws_entered: number;
    next_draw_date: string | null;
  };
  winnings: {
    total_won: number;
  };
}

export function useDashboardStats() {
  const { user } = useAuth();
  const api = useApi();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const data = await api.get<DashboardStats>("/dashboard/stats");
      setStats(data);
    } catch (err) {
      console.error("Failed to fetch statistics", err);
    } finally {
      setLoading(false);
    }
  }, [user, api]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const updateContribution = async (percentage: number) => {
    try {
      await api.put("/dashboard/update-contribution", { percentage });
      fetchStats();
      return true;
    } catch (err) {
      console.error("Failed to update percentage", err);
    }
    return false;
  };

  return { stats, loading, updateContribution };
}
