import { SignIn } from "@clerk/clerk-react";
import { Link } from "react-router-dom";
//import { ArrowLeft } from "lucide-react";

const SignInPage = () => {
  return (
    <div className="min-h-dvh bg-[#14181C] text-white flex flex-col items-center justify-center p-4">
      {/* Logo in top left corner */}
      <Link to="/">
        <img 
          src="/favicon-top4.png" 
          alt="Top 4 Arena Logo" 
          className="absolute top-4 left-4 w-16 h-16 z-10"
        />
      </Link>

      {/* Back button */}
      {/* <Link 
        to="/"
        className="absolute top-6 left-20 flex items-center gap-2 text-white/80 hover:text-white transition-colors z-10"
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="hidden md:inline">Back</span>
      </Link> */}

      {/* Clerk Sign In Component */}
      <div className="w-full max-w-md">
        <SignIn 
          routing="path"
          path="/sign-in"
          signUpUrl="/sign-up"
          forceRedirectUrl="/"
          appearance={{
            elements: {
              rootBox: "mx-auto",
              card: "bg-white/10 backdrop-blur-sm border border-white/20"
            }
          }}
        />
      </div>
    </div>
  );
};

export default SignInPage;
