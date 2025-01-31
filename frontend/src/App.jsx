import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import WelcomePage from "./component/WelcomePage";
import AboutPage from "./component/AboutPage";
import Contact from "./component/Contact";
import Login from "./component/Login/Login";
import RegistrationPage from "./component/Registration/RegistrationPage";
import ResumeBuilder from './component/ResumeBuilder/ResumeBuilder';
import MockInterview from './component/MockInterview/MockInterview';
import LearnMore from "./component/LearnMore/LearnMore";
import UserProfile from './component/UserProfile/UserProfile';

const AuthCheck = ({ children }) => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    useEffect(() => {
        if (!token) {
            navigate('/login');
        }
    }, [token, navigate]);

    return token ? children : null;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registration" element={<RegistrationPage />} />
        <Route path="/resume-builder" element={<ResumeBuilder />} />
        <Route path="/mock-interviews" element={
          <AuthCheck>
            <MockInterview />
          </AuthCheck>
        } />
        <Route path="/learn-more" element={<LearnMore />} />
        <Route path="/profile" element={
          <AuthCheck>
            <UserProfile />
          </AuthCheck>
        } />
        <Route path="*" element={<h1>404 Not Found</h1>} />
      </Routes>
    </Router>
  );
}

export default App;
