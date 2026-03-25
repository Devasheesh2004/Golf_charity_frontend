import { useState, useEffect } from "react";
import { API_URL } from "@/lib/apiURL";

export interface Charity {
  id: string;
  name: string;
  description: string;
  featured: boolean;
  total_raised: number;
}

export function useCharities() {
  const [charities, setCharities] = useState<Charity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    const fetchCharities = async () => {
      try {
        const res = await fetch(`${API_URL}/charity`);
        if (!res.ok) throw new Error("Failed to fetch charities");
        const data = await res.json();
        if (mounted) {
          setCharities(data);
          setLoading(false);
        }
      } catch (err: unknown) {
        if (mounted) {
          const message = err instanceof Error ? err.message : "An error occurred";
          setError(message);
          setLoading(false);
        }
      }
    };

    fetchCharities();
    return () => { mounted = false; };
  }, []);

  return { charities, loading, error };
}
