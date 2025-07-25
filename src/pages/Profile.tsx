// src/pages/Profile.tsx
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebase";
import { Navigate } from "react-router-dom";

const Profile = () => {
  const [user, loading] = useAuthState(auth);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" />;
  }

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-semibold mb-6">My Profile</h1>
      <div className="bg-white dark:bg-muted rounded-xl p-6 shadow-md">
        <div className="flex items-center gap-4 mb-6">
          {user.photoURL ? (
            <img
              src={user.photoURL}
              alt="Profile"
              className="w-16 h-16 rounded-full object-cover"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-gray-300 text-black flex items-center justify-center font-bold uppercase text-xl">
              {user.email?.charAt(0)}
            </div>
          )}
          <div>
            <p className="text-lg font-medium">{user.displayName || "No Name"}</p>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
        </div>
        <p className="text-muted-foreground text-sm">
          UID: <code className="text-xs">{user.uid}</code>
        </p>
      </div>
    </div>
  );
};

export default Profile;
