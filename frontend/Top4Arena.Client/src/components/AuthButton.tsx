import { SignedIn, SignedOut, SignInButton, UserButton, useUser } from "@clerk/clerk-react";

const AuthButton = () => {
  const { user, isLoaded } = useUser();

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
          <span className="text-white font-semibold hidden md:block">
            {user?.username || user?.firstName || "User"}
          </span>
          <UserButton 
            appearance={{
              elements: {
                avatarBox: "w-10 h-10"
              }
            }}
          />
        </div>
      </SignedIn>
    </div>
  );
};

export default AuthButton;