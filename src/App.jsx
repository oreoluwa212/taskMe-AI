import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import LandingPage from "./pages/website/LandingPage";
import AboutPage from "./pages/website/AboutPage";
import FeaturesPage from "./pages/website/FeaturesPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/features" element={<FeaturesPage />} />
      </Routes>
    </Router>
  );
}

export default App;
