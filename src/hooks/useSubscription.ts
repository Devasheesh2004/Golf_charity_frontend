import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useApi } from "@/lib/api";

export function useSubscription() {
  const { user } = useAuth();
  const api = useApi();
  const [processing, setProcessing] = useState<string | null>(null);
  const [error, setError] = useState("");

  const initiateCheckout = async (planType: string) => {
    if (!user) return false;

    setProcessing(planType);
    setError("");

    try {
      const data = await api.post<{ url?: string; error?: string }>("/subscription/create-checkout-session", { plan: planType });
      if (data.url) {
        window.location.href = data.url;
        return true;
      } else {
        throw new Error(data.error || "Failed to initiate subscription");
      }
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "An unexpected error occurred";
      setError(message);
      console.error(e);
      return false;
    } finally {
      setProcessing(null);
    }
  };

  return { initiateCheckout, processing, error };
}
