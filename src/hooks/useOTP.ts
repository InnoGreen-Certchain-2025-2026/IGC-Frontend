import { useState } from "react";
import { sendOtp, verifyOtp } from "@/services/otpService";

export const useOtp = () => {
  const [loading, setLoading] = useState(false);

  const handleSendOtp = async (email: string) => {
    try {
      setLoading(true);
      return await sendOtp(email);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (email: string, otp: string) => {
    try {
      setLoading(true);
      return await verifyOtp(email, otp);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    handleSendOtp,
    handleVerifyOtp,
  };
};