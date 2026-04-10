import { Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import InterviewPage from "./pages/InterviewPage";
import InterviewDetailsPage from "./pages/InterviewDetailsPage";
import StartInterviewPage from "./pages/StartInterviewPage";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import ProfilePage from "./pages/ProfilePage";
import WelcomePage from "./pages/WelcomePage";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import { Navigate,useNavigate } from "react-router-dom";
function App() {
  const { i18n } = useTranslation();
  const navigate = useNavigate();

  useEffect(() => {
    if (i18n.language === "ar") {
      document.documentElement.dir = "rtl";
    } else {
      document.documentElement.dir = "ltr";
    }
  }, [i18n.language]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const fallback = token ? "/welcome" : "/login";

    if (!window.history.state?.app) {
      window.history.replaceState({ app: true }, "", window.location.href);
      window.history.pushState({ app: true }, "", window.location.href);
    }

    const handlePopState = () => {
      const path = window.location.pathname;

      if (path === "/dashboard") {
        navigate("/welcome", { replace: true });
        return;
      }

      if (path === "/welcome") {
        navigate(fallback, { replace: true });
        return;
      }

      if (path === "/" || path === "/login" || path === "/register") {
        navigate(fallback, { replace: true });
        return;
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [navigate]);
  return (
    <>
    <Navbar/>
      <div className="p-8">

    <Routes>

      <Route path="/login" element={<LoginPage />} />

      <Route path="/register" element={<RegisterPage />} />

      <Route path="/welcome" element={<WelcomePage />} />

      <Route
  path="/"
  element={
    localStorage.getItem("token") ? (
      <Navigate to="/dashboard" />
    ) : (
      <Navigate to="/login" />
    )
  }
/>

      <Route
  path="/dashboard"
  element={
    <ProtectedRoute>
      <DashboardPage />
    </ProtectedRoute>
  }
/>

<Route
  path="/interview"
  element={
    <ProtectedRoute>
      <InterviewPage />
    </ProtectedRoute>
  }
/>

<Route
  path="/interview/:id"
  element={
    <ProtectedRoute>
      <InterviewDetailsPage />
    </ProtectedRoute>
  }
/>

<Route
  path="/start-interview"
  element={
    <ProtectedRoute>
      <StartInterviewPage />
    </ProtectedRoute>
  }
/>

<Route
  path="/profile"
  element={
    <ProtectedRoute>
      <ProfilePage />
    </ProtectedRoute>
  }
/>

    </Routes>
      </div>
    </>
  );
}

export default App;


