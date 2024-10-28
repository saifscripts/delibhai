import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  login,
  registerRider,
  resendOTP,
  verifyOTP,
} from "../services/auth.service";
import { setAuthToken } from "../utils/authToken";

export const useRegisterRider = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationKey: ["REGISTER_RIDER"],
    mutationFn: registerRider,
    onSuccess: (data) => {
      if (data?.success) {
        navigate("/otp-verification", {
          state: {
            _id: data?.data?._id,
            otp: data?.data?.otp,
          },
        });
      } else {
        toast.error(data?.message);
      }
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};

export const useLogin = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationKey: ["LOGIN"],
    mutationFn: login,
    onSuccess: (data) => {
      if (data?.success) {
        navigate(`/profile/${data?.data?.user?._id}`);
        setAuthToken(data?.data?.accessToken);
      } else {
        toast.error(data?.message);
      }
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};

export const useVerifyOTP = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["VERIFY_OTP"],
    mutationFn: verifyOTP,
    onSuccess: (data) => {
      if (data?.success) {
        queryClient.invalidateQueries({ queryKey: ["ME"] });
        setAuthToken(data?.data?.accessToken);
      } else {
        toast.error(data?.message);
      }
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};

export const useResendOTP = () => {
  return useMutation({
    mutationKey: ["RESEND_OTP"],
    mutationFn: resendOTP,
    onSuccess: (data) => {
      if (!data?.success) {
        toast.error(data?.message);
      }
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};