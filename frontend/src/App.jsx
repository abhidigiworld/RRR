import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate, Navigate } from "react-router-dom";
import WelcomePage from "./component/WelcomePage";
import AboutPage from "./component/AboutPage";
import Contact from "./component/Contact";
import Login from "./component/Login/Login";
import RegistrationPage from "./component/Registration/RegistrationPage";
import ResumeBuilder from './component/ResumeBuilder/ResumeBuilder';
import MockInterview from './component/MockInterview/MockInterview';
import LearnMore from "./component/LearnMore/LearnMore";
import UserProfile from './component/UserProfile/UserProfile';
import ForgotPassword from './component/Login/ForgotPassword';

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

const PublicRoute = ({ children }) => {
    const token = localStorage.getItem('token');
    const navigate = useNavigate();

    useEffect(() => {
        if (token) {
            navigate('/profile');
        }
    }, [token, navigate]);

    return !token ? children : null;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        } />
        <Route path="/registration" element={
          <PublicRoute>
            <RegistrationPage />
          </PublicRoute>
        } />
        <Route path="/resume-builder" element={
          <AuthCheck>
            <ResumeBuilder />
          </AuthCheck>
        } />
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
        <Route path="/forgot-password" element={
          <PublicRoute>
            <ForgotPassword />
          </PublicRoute>
        } />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
