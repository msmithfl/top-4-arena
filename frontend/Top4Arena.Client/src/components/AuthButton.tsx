import { SignedIn, SignedOut, SignInButton, UserButton, useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";

const AuthButton = () => {
  const { user, isLoaded } = useUser();
  const navigate = useNavigate();

  if (!isLoaded) {
    return (
      <div className="absolute top-4 right-4 z-10">
        <div className="bg-gray-600 text-transparent font-semibold py-2 px-6 rounded-full animate-pulse">
          Sign In
        </div>
      </div>
    );
  }

  return (
    <div className="absolute top-4 right-4 z-10">
      <SignedOut>
        <SignInButton mode="modal">
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-full transition-all duration-200 cursor-pointer">
            Sign In
          </button>
        </SignInButton>
      </SignedOut>
      
      <SignedIn>
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/profile')}
            className="text-white font-semibold hidden md:block hover:text-blue-400 transition-colors cursor-pointer"
          >
            {user?.username || user?.firstName || "User"}
          </button>
          <UserButton 
            afterSignOutUrl="/"
            appearance={{
              elements: {
                avatarBox: "w-10 h-10 cursor-pointer"
              }
            }}
          >
            <UserButton.MenuItems>
              <UserButton.Action
                label="View Profile"
                labelIcon={<span>👤</span>}
                onClick={() => navigate('/profile')}
              />
            </UserButton.MenuItems>
          </UserButton>
        </div>
      </SignedIn>
    </div>
  );
};

export default AuthButton;