"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { authService } from "@/app/sercices/user/auth.service";

export default function ActivateAccount() {
  const { activationToken } = useParams();
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [message, setMessage] = useState("");

  useEffect(() => {
    const activate = async () => {
      try {
        const response = await authService.activateAccount(activationToken);
        if (response.status == 201) {
          setStatus("success");
          setMessage("Account activated successfully! Redirecting...");
          // ✅ cookies with tokens are already set by backend
          setTimeout(() => router.push("/"), 2000);
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
  }, [activationToken, router]);

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
