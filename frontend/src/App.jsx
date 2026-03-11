import { Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import InterviewPage from "./pages/InterviewPage";
import InterviewDetailsPage from "./pages/InterviewDetailsPage";
import StartInterviewPage from "./pages/StartInterviewPage";


function App() {
  return (
    <Routes>

      <Route path="/login" element={<LoginPage />} />

      <Route path="/register" element={<RegisterPage />} />

      <Route path="/dashboard" element={<DashboardPage/>} />
      
      <Route path="/interview" element={<InterviewPage />} />
      
      <Route path="/interview/:id" element={<InterviewDetailsPage />} />

      <Route path="/start-interview" element={<StartInterviewPage />} />

    </Routes>
  );
}

export default App;
