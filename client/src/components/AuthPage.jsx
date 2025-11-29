import React, { useState } from "react";
import Login from "./Login";
import Signup from "./Signup";
import Home from "./Home"; // Import Home if you want to show it after login
import "./AuthPage.css";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleAuthSuccess = () => {
    setIsAuthenticated(true);
  };

  if (isAuthenticated) return <Home />;

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>{isLogin ? "Login" : "Signup"}</h2>
        {isLogin ? (
          <Login onAuthSuccess={handleAuthSuccess} />
        ) : (
          <Signup onAuthSuccess={handleAuthSuccess} />
        )}
        <button onClick={() => setIsLogin(!isLogin)} className="toggle-btn">
          {isLogin ? "Need an account? Sign Up" : "Already have an account? Log In"}
        </button>
      </div>
    </div>
  );
};
const logOut = () => {
    const confirmLogout = window.confirm("Are you sure you want to log out?");
    if (!confirmLogout) return;
}

export default AuthPage;
