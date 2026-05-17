import React, { useState, useEffect } from "react";
import {
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
  signOut,
} from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, provider } from "./firebase";
import {
  Mail,
  Lock,
  Tv,
  ShieldCheck,
  ShieldAlert,
  Loader2,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

const AuthWrapper = ({ children }: { children: React.ReactNode }) => {
  const [user, loading] = useAuthState(auth);
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [authSuccess, setAuthSuccess] = useState("");
  const [checkingVerification, setCheckingVerification] = useState(false);
  const [manuallyVerified, setManuallyVerified] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  // Handle resend email cooldown timer
  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    setAuthSuccess("");

    try {
      if (isRegister) {
        // Step 1 & 2: Create user and send verification email immediately
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await sendEmailVerification(userCredential.user);
        setAuthSuccess(
          "Account created successfully! A verification link has been sent to your email. Please verify it to log in."
        );
      } else {
        // Log in user
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (err: any) {
      // Map Firebase auth errors to readable terms
      let msg = err.message;
      if (err.code === "auth/invalid-credential") {
        msg = "Invalid email or password. Please try again.";
      } else if (err.code === "auth/email-already-in-use") {
        msg = "This email is already in use by another account.";
      } else if (err.code === "auth/weak-password") {
        msg = "Password should be at least 6 characters.";
      } else if (err.code === "auth/invalid-email") {
        msg = "Please enter a valid email address.";
      }
      setAuthError(msg);
    }
  };

  const handleGoogleSignIn = async () => {
    setAuthError("");
    setAuthSuccess("");
    try {
      await signInWithPopup(auth, provider);
    } catch (err: any) {
      setAuthError(err.message);
    }
  };

  const handleResendVerification = async () => {
    if (!user || cooldown > 0) return;
    setAuthError("");
    setAuthSuccess("");

    try {
      await sendEmailVerification(user);
      setAuthSuccess("Verification email has been resent successfully!");
      setCooldown(60); // 1 minute cooldown
    } catch (err: any) {
      setAuthError(err.message || "Failed to send verification email. Please try again later.");
    }
  };

  const handleCheckVerification = async () => {
    if (!user) return;
    setCheckingVerification(true);
    setAuthError("");
    setAuthSuccess("");

    try {
      await user.reload();
      if (auth.currentUser?.emailVerified) {
        setManuallyVerified(true);
        setAuthSuccess("Email verified successfully! Loading your dashboard...");
      } else {
        setAuthError("Email is not verified yet. Please check your inbox and click the link.");
      }
    } catch (err: any) {
      setAuthError("Error checking status: " + err.message);
    } finally {
      setCheckingVerification(false);
    }
  };

  const handleSignOut = async () => {
    setAuthError("");
    setAuthSuccess("");
    setManuallyVerified(false);
    await signOut(auth);
  };

  if (loading) {
    return (
      <div className="h-screen bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-slate-950 via-zinc-950 to-black flex flex-col justify-center items-center">
        <div className="relative flex items-center justify-center">
          <div className="h-16 w-16 rounded-full border-t-2 border-r-2 border-primary animate-spin" />
          <Tv className="h-6 w-6 text-primary absolute" />
        </div>
        <p className="text-zinc-400 text-sm font-medium mt-4 tracking-wider uppercase animate-pulse">
          Loading Stream Box...
        </p>
      </div>
    );
  }

  // If not logged in, render the Register / Sign In screen
  if (!user) {
    return (
      <div className="min-h-screen bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-slate-950 via-zinc-950 to-black flex items-center justify-center p-4 relative overflow-hidden">
        {/* Glow ambient effects */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="w-full max-w-md bg-zinc-950/40 backdrop-blur-xl border border-zinc-800/80 rounded-2xl p-8 shadow-2xl relative z-10 hover:border-zinc-700/80 transition-all duration-500">
          <div className="flex flex-col items-center mb-8">
            <div className="h-12 w-12 rounded-xl bg-gradient-primary flex items-center justify-center shadow-lg shadow-primary/20 mb-3 animate-pulse">
              <Tv className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight bg-gradient-primary bg-clip-text text-transparent">
              stream-it-mocha
            </h2>
            <p className="text-zinc-400 text-sm mt-1 text-center">
              {isRegister ? "Create your account to start streaming" : "Welcome back, cinephile!"}
            </p>
          </div>

          {authError && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-xl flex items-start gap-2.5 mb-4 text-sm animate-shake">
              <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
              <span>{authError}</span>
            </div>
          )}

          {authSuccess && (
            <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-3 rounded-xl flex items-start gap-2.5 mb-4 text-sm animate-fade-in">
              <CheckCircle2 className="h-5 w-5 shrink-0 mt-0.5" />
              <span>{authSuccess}</span>
            </div>
          )}

          <form onSubmit={handleEmailAuth} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-500 h-5 w-5" />
                <input
                  type="email"
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-4 py-3 bg-zinc-900/60 border border-zinc-800 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300 text-sm"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-500 h-5 w-5" />
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 bg-zinc-900/60 border border-zinc-800 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300 text-sm"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete={isRegister ? "new-password" : "current-password"}
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-primary text-white py-3 rounded-xl hover:opacity-90 font-semibold shadow-lg shadow-primary/25 hover:shadow-primary/35 transition-all duration-300 flex items-center justify-center gap-2 text-sm mt-6 cursor-pointer"
            >
              {isRegister ? "Create Free Account" : "Sign In"}
            </button>
          </form>

          <div className="relative flex py-4 items-center">
            <div className="flex-grow border-t border-zinc-800"></div>
            <span className="flex-shrink mx-4 text-zinc-500 text-xs font-semibold uppercase tracking-wider">
              or
            </span>
            <div className="flex-grow border-t border-zinc-800"></div>
          </div>

          <button
            onClick={handleGoogleSignIn}
            className="w-full flex items-center justify-center gap-3 bg-zinc-900/80 border border-zinc-800 hover:bg-zinc-800/80 text-zinc-200 py-3 rounded-xl transition-all duration-300 text-sm font-medium cursor-pointer"
          >
            <img
              src="https://www.svgrepo.com/show/355037/google.svg"
              alt="Google"
              className="h-5 w-5"
            />
            Continue with Google
          </button>

          <p className="mt-6 text-center text-sm text-zinc-400">
            {isRegister ? "Already have an account?" : "New to stream-it-mocha?"}{" "}
            <button
              onClick={() => {
                setIsRegister(!isRegister);
                setAuthError("");
                setAuthSuccess("");
              }}
              className="text-primary hover:text-purple-400 font-semibold hover:underline cursor-pointer"
            >
              {isRegister ? "Sign In" : "Register now"}
            </button>
          </p>
        </div>
      </div>
    );
  }

  // Check verification state: Google Auth provides pre-verified emails, Email Auth requires validation.
  const isGoogleUser = user.providerData.some((p) => p.providerId === "google.com");
  const isUserVerified = user.emailVerified || manuallyVerified || isGoogleUser;

  // Step 3: Block Unverified Users and show a beautiful Pending Screen
  if (!isUserVerified) {
    return (
      <div className="min-h-screen bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-slate-950 via-zinc-950 to-black flex items-center justify-center p-4 relative overflow-hidden">
        {/* Glow ambient effects */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="w-full max-w-md bg-zinc-950/40 backdrop-blur-xl border border-zinc-800/80 rounded-2xl p-8 shadow-2xl relative z-10 hover:border-zinc-700/80 transition-all duration-500">
          <div className="flex flex-col items-center mb-6 text-center">
            <div className="h-16 w-16 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-4 relative">
              <div className="absolute inset-0 rounded-full bg-amber-500/5 animate-ping opacity-75" />
              <ShieldAlert className="h-8 w-8 text-amber-500 relative z-10" />
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              Verify your email address
            </h2>
            <p className="text-zinc-400 text-sm mt-3 px-2">
              We've sent a verification link to:
              <strong className="text-zinc-200 text-sm block mt-1 break-all bg-zinc-900/80 px-3 py-1.5 rounded-lg border border-zinc-800 select-all font-mono">
                {user.email}
              </strong>
            </p>
            <p className="text-zinc-500 text-xs mt-4 leading-relaxed max-w-xs">
              Please click the link in your email to activate your account. If you don't see it, check your spam or promotions folder.
            </p>
          </div>

          {authError && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-xl flex items-start gap-2.5 mb-4 text-xs animate-shake">
              <AlertCircle className="h-4.5 w-4.5 shrink-0 mt-0.5" />
              <span>{authError}</span>
            </div>
          )}

          {authSuccess && (
            <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-3 rounded-xl flex items-start gap-2.5 mb-4 text-xs animate-fade-in">
              <CheckCircle2 className="h-4.5 w-4.5 shrink-0 mt-0.5" />
              <span>{authSuccess}</span>
            </div>
          )}

          <div className="space-y-3 mt-6">
            <button
              onClick={handleCheckVerification}
              disabled={checkingVerification}
              className="w-full bg-gradient-primary text-white py-3 rounded-xl font-semibold shadow-lg shadow-primary/25 hover:shadow-primary/35 hover:opacity-95 transition-all duration-300 flex items-center justify-center gap-2 text-sm cursor-pointer"
            >
              {checkingVerification ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Verifying Status...
                </>
              ) : (
                <>
                  <ShieldCheck className="h-4 w-4" />
                  I've Verified My Email
                </>
              )}
            </button>

            <button
              onClick={handleResendVerification}
              disabled={cooldown > 0 || checkingVerification}
              className="w-full bg-zinc-900/60 hover:bg-zinc-800/80 border border-zinc-800 text-zinc-300 py-3 rounded-xl font-medium transition-all duration-300 text-sm disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {cooldown > 0 ? `Resend email in ${cooldown}s` : "Resend verification email"}
            </button>
          </div>

          <div className="flex justify-center mt-6">
            <button
              onClick={handleSignOut}
              className="text-zinc-400 hover:text-white py-2 font-medium transition-all duration-300 text-xs underline underline-offset-4 cursor-pointer"
            >
              Sign out / Use a different account
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Once verified, grant full access
  return <>{children}</>;
};

export default AuthWrapper;
