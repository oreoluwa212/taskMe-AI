import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import LandingPage from "./pages/website/LandingPage";
import AboutPage from "./pages/website/AboutPage";
import FeaturesPage from "./pages/website/FeaturesPage";
import LoginPage from "./pages/website/LoginPage";
import SignUpPage from "./pages/website/SignUpPage";
import ResetPasswordPage from "./pages/website/ResetPasswordPage";
import NewPasswordPage from "./pages/website/NewPasswordPage";
import SignupVerifyEmailPage from "./pages/website/SignupVerifyEmailPage";
import ResetPwConfirm from "./pages/website/ResetPwConfirm";
import Dashboard from "./pages/webApp/Dashboard";
import Projects from "./pages/webApp/Projects";
import Settings from "./pages/webApp/Settings";

function App() {
  return (
    <Router>
      <Routes>
        {/* ========================== Website Routes ========================== */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/features" element={<FeaturesPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route
          path="/signup/verify-email"
          element={<SignupVerifyEmailPage />}
        />
        <Route path="/verify-otp" element={<SignUpPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/new-password" element={<NewPasswordPage />} />
        <Route path="/new-password/login" element={<ResetPwConfirm />} />

        {/* ========================== Dashboard Routes ========================== */}
        <Route path="/overview" element={<Dashboard />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </Router>
  );
}

export default App;
