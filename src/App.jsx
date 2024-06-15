import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import LandingPage from "./pages/website/LandingPage";
import AboutPage from "./pages/website/AboutPage";
import FeaturesPage from "./pages/website/FeaturesPage";
import LoginPage from "./pages/website/LoginPage";
import SignUpPage from "./pages/website/SignUpPage";
import ResetPasswordPage from "./pages/website/ResetPasswordPage";
import NewPasswordPage from "./pages/website/NewPasswordPage";
import VerifyEmailPage from "./pages/website/VerifyEmailPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/features" element={<FeaturesPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/verify-email" element={<VerifyEmailPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/new-password" element={<NewPasswordPage />} />
      </Routes>
    </Router>
  );
}

export default App;
