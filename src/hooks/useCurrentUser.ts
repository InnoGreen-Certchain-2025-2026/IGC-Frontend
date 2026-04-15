import { useEffect, useState } from "react";
import { getMeApi } from "@/services/userService";

export const useCurrentUser = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchMe = async () => {
      try {
        setLoading(true);
        const res = await getMeApi();

        // 👇 QUAN TRỌNG: lấy đúng data
        setUser(res.data);
      } catch (err) {
        console.error("❌ getMe error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMe();
  }, []);

  return { user, loading };
};