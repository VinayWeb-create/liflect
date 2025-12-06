import React, { useState } from "react";
import Login from "./Login.jsx";
import Signup from "./Signup.jsx";
import Home from "./Home";       // <-- FIXED
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

        <button 
          onClick={() => setIsLogin(!isLogin)} 
          className="toggle-btn"
        >
          {isLogin ? "Need an account? Sign Up" : "Already have an account? Log In"}
        </button>
      </div>
    </div>
  );
};

export default AuthPage;
