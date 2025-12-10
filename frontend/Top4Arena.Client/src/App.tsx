import { Routes, Route } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import LandingPage from "./components/LandingPage";
import GameScreen from "./components/GameScreen";
import MobileNotSupported from "./components/MobileNotSupported";
import ProfileDashboard from "./components/ProfileDashboard";
import SignInPage from "./components/SignInPage";
import SignUpPage from "./components/SignUpPage";
import "./App.css";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/game" element={<GameScreen />} />
        <Route path="/profile" element={<ProfileDashboard />} />
        <Route path="/sign-in/*" element={<SignInPage />} />
        <Route path="/sign-up/*" element={<SignUpPage />} />
        <Route path="/mobile-not-supported" element={<MobileNotSupported />} />
      </Routes>
      <Analytics />
    </>
  );
}

export default App;
