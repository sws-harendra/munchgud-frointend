"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { authService } from "@/app/sercices/user/auth.service";
import { useAppDispatch } from "@/app/lib/store/store";
import { getUserDetails } from "@/app/lib/store/features/authSlice";

export default function ActivateAccount() {
  const { activationToken } = useParams();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [message, setMessage] = useState("");

  useEffect(() => {
    const activate = async () => {
      try {
        const response = await authService.activateAccount(activationToken);
        if (response && response.success) {
          setStatus("success");
          setMessage("Account activated successfully! Redirecting...");
          // Dispatch getUserDetails to populate Redux store with current authenticated user
          await dispatch(getUserDetails());
          // ✅ cookies with tokens are already set by backend
          setTimeout(() => router.push("/"), 2000);
        } else {
          setStatus("error");
          setMessage("Activation failed. Invalid response.");
        }
      } catch (error: any) {
        setStatus("error");
        setMessage(
          error.response?.data?.message || "Activation failed. Try again."
        );
      }
    };

    if (activationToken) {
      activate();
    }
  }, [activationToken, router, dispatch]);

  return (
    <div className="flex items-center justify-center h-screen">
      {status === "loading" && (
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <p>Verifying your account...</p>
        </div>
      )}

      {status === "success" && (
        <div className="text-green-600 font-semibold">{message}</div>
      )}

      {status === "error" && (
        <div className="text-green-700 font-semibold">{message}</div>
      )}
    </div>
  );
}
