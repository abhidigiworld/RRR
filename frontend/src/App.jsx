import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import WelcomePage from "./component/WelcomePage";
import AboutPage from "./component/AboutPage";
import Contact from "./component/Contact";
import Login from "./component/Login/Login";
import RegistrationPage from "./component/Registration/RegistrationPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<h1>404 Not Found</h1>} />
        <Route path="/contact" element={<Contact/>} />
        <Route path="/registration" element={<RegistrationPage/>} />
      </Routes>
    </Router>
  );
}

export default App;
