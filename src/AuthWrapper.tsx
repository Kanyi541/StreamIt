import React, { useState } from "react";
import {
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, provider } from "./firebase";
import { Button } from "@/components/ui/button";
import { User as UserIcon } from "lucide-react";

const AuthWrapper = ({ children }: { children: React.ReactNode }) => {
  const [user, loading] = useAuthState(auth);
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");

    try {
      if (isRegister) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (err: any) {
      setAuthError(err.message);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithPopup(auth, provider);
    } catch (err: any) {
      setAuthError(err.message);
    }
  };

  if (loading) return <div className="p-4 text-center">Loading...</div>;

  if (!user) {
    return (
      <div className="h-screen flex flex-col justify-center items-center px-4">
        <div
          className="shadow-lg rounded-lg p-6 w-full max-w-sm"
          style={{ backgroundColor: "#646cffaa" }}
        >
          <h2 className="text-xl font-bold text-white text-center mb-4">
            {isRegister ? "Register" : "Sign In"}
          </h2>

          {authError && (
            <p className="text-red-200 text-sm mb-2 text-center">{authError}</p>
          )}

          <form onSubmit={handleEmailAuth} className="space-y-4">
            <input
              type="email"
              placeholder="Email"
              className="w-full px-3 py-2 border border-gray-300 rounded text-black"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full px-3 py-2 border border-gray-300 rounded text-black"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
            >
              {isRegister ? "Register" : "Sign In"}
            </button>
          </form>

          <div className="text-center my-4 text-sm text-white">or</div>

          <button
  onClick={handleGoogleSignIn}
  className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-700 py-2 rounded hover:bg-gray-100 transition"
>
  <img
    src="https://www.svgrepo.com/show/355037/google.svg"
    alt="Google"
    className="h-5 w-5"
  />
  Sign in with Google
</button>


          <p className="mt-4 text-center text-sm text-white">
            {isRegister ? "Already have an account?" : "Don't have an account?"}{" "}
            <button
              onClick={() => setIsRegister(!isRegister)}
              className="text-yellow-300 hover:underline"
            >
              {isRegister ? "Sign In" : "Register"}
            </button>
          </p>
        </div>
      </div>
    );
  }

  // ✅ This part renders the profile button
  return (
    <>
      <div className="absolute top-4 right-4 z-50">
        <Button size="icon" variant="ghost" className="relative">
          {user.photoURL ? (
            <img
              src={user.photoURL}
              alt="User"
              className="w-8 h-8 rounded-full object-cover"
            />
          ) : user.email ? (
            <span className="w-8 h-8 rounded-full bg-gray-300 text-black flex items-center justify-center font-semibold uppercase text-sm">
              {user.email.charAt(0)}
            </span>
          ) : (
            <UserIcon className="h-5 w-5" />
          )}
        </Button>
      </div>

      {children}
    </>
  );
};

export default AuthWrapper;
