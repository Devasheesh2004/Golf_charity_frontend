import { useState, useCallback, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useApi } from "@/lib/api";

export interface ScoreParams {
  id: number;
  value: number;
  date: string;
}

export function useScores() {
  const { user } = useAuth();
  const api = useApi();
  const [scores, setScores] = useState<ScoreParams[]>([]);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");

  const fetchScores = useCallback(async () => {
    if (!user) return;
    setFetching(true);
    try {
      const data = await api.get<ScoreParams[]>("/score");
      setScores(data);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "An error occurred";
      setError(message);
      console.error(err);
    } finally {
      setFetching(false);
    }
  }, [user, api]);

  useEffect(() => {
    if (user) fetchScores();
  }, [user, fetchScores]);

  const submitScore = async (scoreVal: number) => {
    if (user) {
      if (scoreVal < 1 || scoreVal > 45) {
        setError("Invalid Stableford format. Please enter a value between 1 and 45.");
        return false;
      }
      setError("");
      try {
        const updatedScores = await api.post<ScoreParams[]>("/score", { score: scoreVal });
        setScores(updatedScores);
        return true;
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Failed to submit score";
        setError(message);
        console.error("Failed to submit score", err);
      }
    }
    return false;
  };

  const deleteScore = async (id: number) => {
    if (!user) return false;
    try {
      const updatedScores = await api.del<ScoreParams[]>(`/score/${id}`);
      setScores(updatedScores);
      return true;
    } catch (err: unknown) {
      setError("Failed to delete score");
      console.error(err);
    }
    return false;
  };

  const updateScore = async (id: number, scoreVal: number) => {
    if (!user) return false;
    if (scoreVal < 1 || scoreVal > 45) {
      setError("Invalid Stableford format. Please enter a value between 1 and 45.");
      return false;
    }
    setError("");
    try {
      const updatedScores = await api.put<ScoreParams[]>(`/score/${id}`, { score: scoreVal });
      setScores(updatedScores);
      return true;
    } catch (err: unknown) {
      setError("Failed to update score");
      console.error(err);
    }
    return false;
  };

  return { scores, fetching, error, submitScore, deleteScore, updateScore, fetchScores };
}
