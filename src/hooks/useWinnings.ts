import { useState, useCallback, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useApi } from "@/lib/api";

export interface WinningRecord {
    id: string;
    prize_amount: number;
    matches: number;
    verification_status: 'pending' | 'verified' | 'paid';
    proof_url: string | null;
    draws: {
        date: string;
        winning_numbers: number[];
    };
}

export function useWinnings() {
    const { user } = useAuth();
    const api = useApi();
    const [winnings, setWinnings] = useState<WinningRecord[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchWinnings = useCallback(async () => {
        if (!user) return;
        try {
            const data = await api.get<WinningRecord[]>("/dashboard/winnings");
            setWinnings(data);
        } catch (err) {
            console.error("Failed to fetch winnings", err);
        } finally {
            setLoading(false);
        }
    }, [user, api]);

    const submitProof = async (winId: string, proofUrl: string) => {
        try {
            await api.post(`/dashboard/winnings/${winId}/verify`, { proofUrl });
            await fetchWinnings();
            return true;
        } catch (err) {
            console.error("Failed to submit proof", err);
            return false;
        }
    };

    useEffect(() => {
        if (user) fetchWinnings();
    }, [user, fetchWinnings]);

    return { winnings, loading, fetchWinnings, submitProof };
}
