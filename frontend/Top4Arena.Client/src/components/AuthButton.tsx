import { SignedIn, SignedOut, UserButton, useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { FaUserAstronaut } from "react-icons/fa";

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
    <div className="absolute top-6 right-6 z-10">
      <SignedOut>
        <button 
          onClick={() => navigate('/sign-in')}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-full transition-all duration-200 cursor-pointer"
        >
          Sign In
        </button>
      </SignedOut>
      
      <SignedIn>
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/profile')}
            className="text-white pb-2 pr-2 font-semibold hidden md:block hover:text-gray-400 transition-colors cursor-pointer"
          >
            {user?.username || user?.firstName || "User"}
          </button>
          <div className="scale-150 origin-center">
            <UserButton 
              afterSignOutUrl="/"
            >
            <UserButton.MenuItems>
              <UserButton.Action
                label="View Profile"
                labelIcon={<span><FaUserAstronaut /></span>}
                onClick={() => navigate('/profile')}
              />
            </UserButton.MenuItems>
            </UserButton>
          </div>
        </div>
      </SignedIn>
    </div>
  );
};

export default AuthButton;