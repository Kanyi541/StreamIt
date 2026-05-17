import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  applyActionCode,
  confirmPasswordReset,
  verifyPasswordResetCode,
} from "firebase/auth";
import { auth } from "@/firebase";
import {
  ShieldCheck,
  ShieldAlert,
  Loader2,
  Lock,
  Tv,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
} from "lucide-react";

const AuthAction = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const mode = searchParams.get("mode");
  const oobCode = searchParams.get("oobCode");

  const [status, setStatus] = useState<"loading" | "success" | "error" | "ready">("loading");
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Password criteria checks
  const hasMinLength = newPassword.length >= 8;
  const hasUpperLower = /[A-Z]/.test(newPassword) && /[a-z]/.test(newPassword);
  const hasNumSpecial = /[0-9]/.test(newPassword) && /[!@#$%^&*(),.?":{}|<>]/.test(newPassword);
  const isPasswordStrong = hasMinLength && hasUpperLower && hasNumSpecial;

  useEffect(() => {
    if (!mode || !oobCode) {
      setStatus("error");
      setMessage("Invalid action link. The security code or mode is missing.");
      return;
    }

    if (mode === "verifyEmail") {
      // Automatical email verification on page load
      applyActionCode(auth, oobCode)
        .then(() => {
          setStatus("success");
          setMessage("Your email has been verified successfully! You can now start streaming.");
        })
        .catch((err: any) => {
          setStatus("error");
          let errMsg = err.message || "Failed to verify email.";
          if (err.code === "auth/invalid-action-code") {
            errMsg = "This link is invalid or has already been used. Please request a new verification email.";
          } else if (err.code === "auth/expired-action-code") {
            errMsg = "This verification link has expired. Please log in and request a new one.";
          }
          setMessage(errMsg);
        });
    } else if (mode === "resetPassword") {
      // First verify the code is valid for resetting password
      verifyPasswordResetCode(auth, oobCode)
        .then((emailAddress) => {
          setEmail(emailAddress);
          setStatus("ready");
        })
        .catch((err: any) => {
          setStatus("error");
          let errMsg = err.message || "Failed to verify password reset code.";
          if (err.code === "auth/invalid-action-code" || err.code === "auth/expired-action-code") {
            errMsg = "This password reset link is invalid or has expired. Please request a new reset link.";
          }
          setMessage(errMsg);
        });
    } else {
      setStatus("error");
      setMessage(`Unsupported action mode: ${mode}`);
    }
  }, [mode, oobCode]);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isPasswordStrong || !oobCode) return;
    setSubmitting(true);

    try {
      await confirmPasswordReset(auth, oobCode, newPassword);
      setStatus("success");
      setMessage("Your password has been reset successfully! You can now sign in with your new password.");
    } catch (err: any) {
      setStatus("error");
      setMessage(err.message || "Failed to reset password. Please request a new reset link.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-slate-950 via-zinc-950 to-black flex items-center justify-center p-4 relative overflow-hidden text-white">
      {/* Background Glow effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md bg-zinc-950/40 backdrop-blur-xl border border-zinc-800/80 rounded-2xl p-8 shadow-2xl relative z-10 hover:border-zinc-700/80 transition-all duration-500">
        
        {/* Logo/Branding Header */}
        <div className="flex flex-col items-center mb-8 text-center">
          <div className="h-12 w-12 rounded-xl bg-gradient-primary flex items-center justify-center shadow-lg shadow-primary/20 mb-3 cursor-pointer" onClick={() => navigate("/")}>
            <Tv className="h-6 w-6 text-white" />
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight bg-gradient-primary bg-clip-text text-transparent">
            stream-it-mocha
          </h2>
          <p className="text-zinc-500 text-xs uppercase tracking-widest font-semibold mt-1">
            Secure Authentication
          </p>
        </div>

        {/* Loading State */}
        {status === "loading" && (
          <div className="flex flex-col items-center py-8 text-center">
            <Loader2 className="h-10 w-10 text-primary animate-spin mb-4" />
            <p className="text-zinc-400 text-sm font-medium animate-pulse">
              Securing connection & verifying link status...
            </p>
          </div>
        )}

        {/* Success State */}
        {status === "success" && (
          <div className="text-center animate-fade-in">
            <div className="h-16 w-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-4 mx-auto">
              <ShieldCheck className="h-8 w-8 text-emerald-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Success!</h3>
            <p className="text-zinc-400 text-sm leading-relaxed mb-6 px-2">{message}</p>
            <button
              onClick={() => navigate("/")}
              className="w-full bg-gradient-primary text-white py-3 rounded-xl font-semibold shadow-lg shadow-primary/25 hover:shadow-primary/35 hover:opacity-95 transition-all duration-300 text-sm cursor-pointer"
            >
              Go to Dashboard
            </button>
          </div>
        )}

        {/* Error State */}
        {status === "error" && (
          <div className="text-center animate-shake">
            <div className="h-16 w-16 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-4 mx-auto">
              <ShieldAlert className="h-8 w-8 text-red-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Link Invalid or Expired</h3>
            <p className="text-zinc-400 text-sm leading-relaxed mb-6 px-2">{message}</p>
            <button
              onClick={() => navigate("/")}
              className="w-full bg-zinc-900 border border-zinc-800 text-zinc-300 py-3 rounded-xl font-semibold hover:bg-zinc-800 transition-all duration-300 text-sm cursor-pointer"
            >
              Back to Home / Login
            </button>
          </div>
        )}

        {/* Password Reset Form State (ready) */}
        {status === "ready" && (
          <div className="animate-fade-in">
            <div className="bg-zinc-900/60 border border-zinc-800 p-4 rounded-xl mb-6 text-sm text-zinc-300">
              Resetting password for: <br />
              <strong className="text-white break-all font-mono text-sm">{email}</strong>
            </div>

            <form onSubmit={handleResetPassword} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block">
                  New Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-500 h-5 w-5" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-3 bg-zinc-900/60 border border-zinc-800 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300 text-sm"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-zinc-500 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Real-time Password Strength Criteria Panel */}
              <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-xl p-3.5 space-y-2 text-xs">
                <p className="font-semibold text-zinc-400 uppercase tracking-wider text-[10px] mb-1.5">
                  Password Requirements:
                </p>
                <div className="flex items-center gap-2">
                  <div className={`h-1.5 w-1.5 rounded-full ${hasMinLength ? "bg-emerald-500" : "bg-zinc-600"}`} />
                  <span className={hasMinLength ? "text-emerald-400 font-medium" : "text-zinc-500"}>
                    At least 8 characters
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`h-1.5 w-1.5 rounded-full ${hasUpperLower ? "bg-emerald-500" : "bg-zinc-600"}`} />
                  <span className={hasUpperLower ? "text-emerald-400 font-medium" : "text-zinc-500"}>
                    Uppercase & lowercase letters
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`h-1.5 w-1.5 rounded-full ${hasNumSpecial ? "bg-emerald-500" : "bg-zinc-600"}`} />
                  <span className={hasNumSpecial ? "text-emerald-400 font-medium" : "text-zinc-500"}>
                    Numbers & special characters (!@#$ etc.)
                  </span>
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting || !isPasswordStrong}
                className="w-full bg-gradient-primary text-white py-3 rounded-xl font-semibold shadow-lg shadow-primary/25 hover:shadow-primary/35 hover:opacity-95 transition-all duration-300 flex items-center justify-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Resetting Password...
                  </>
                ) : (
                  "Confirm New Password"
                )}
              </button>
            </form>
          </div>
        )}

      </div>
    </div>
  );
};

export default AuthAction;
