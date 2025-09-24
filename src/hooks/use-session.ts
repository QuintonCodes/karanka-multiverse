import { useQuery } from "@tanstack/react-query";
import axios from "axios";

import { UserType } from "@/context/auth-provider";

type SessionResponse = {
  user: UserType | null;
  isAuthenticated: boolean;
};

export function useSessionQuery() {
  return useQuery<SessionResponse>({
    queryKey: ["session"],
    queryFn: async () => {
      const { data } = await axios.get<SessionResponse>("/api/auth/session");
      return data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: false,
  });
}
