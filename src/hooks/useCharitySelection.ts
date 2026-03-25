import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useApi } from "@/lib/api";
import { User } from "@/context/AuthContext";

export function useCharitySelection() {
  const { user, login, token } = useAuth();
  const api = useApi();
  const [selecting, setSelecting] = useState(false);
  const [error, setError] = useState("");

  const selectCharity = async (charityId: string) => {
    if (!user) return false;
    
    setSelecting(true);
    setError("");
    
    try {
      const updatedUser = await api.post<User>("/charity/select", { charityId });
      
      // Update local user state via login
      if (token && updatedUser) {
        login(token, updatedUser);
      }
      
      return true;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to select charity";
      setError(message);
      console.error(err);
      return false;
    } finally {
      setSelecting(false);
    }
  };

  return { selectCharity, selecting, error };
}
