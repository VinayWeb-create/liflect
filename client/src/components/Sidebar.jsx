import React, { useState, useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { UserContext } from "../contexts/UserContext.jsx";
import "./Sidebar.css";  // make sure to create this file or add styles globally

function Sidebar() {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const { userData, setUserData } = useContext(UserContext);

  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

  const handleLogout = () => {
    setUserData({}); // Clear user data on logout
    navigate("/");   // Redirect to home page
  };

  const navLinks = [
    { to: "/", label: "Home", icon: "🏠" },
    { to: "/userdetails", label: "User Details", icon: "👤" },
    { to: "/lifesimulate", label: "Life Simulate", icon: "🧬" },
    { to: "/snapshot", label: "Snapshot", icon: "📸" },
  ];

  return (
    <>
      {/* Hamburger button */}
      <button
        className="fixed-hamburger"
        onClick={toggleSidebar}
        aria-label="Toggle sidebar"
      >
        &#9776;
      </button>

      <aside className={`sidebar ${isSidebarOpen ? "open" : "closed"}`}>
        {/* User greeting */}
        {isSidebarOpen && userData?.name && (
          <div className="user-greeting">
            <h3>Welcome, {userData.name}</h3>
          </div>
        )}

        {/* Auth buttons */}
        <div className="auth-buttons">
          {userData?.name ? (
            <button onClick={handleLogout} className="btn-auth">
              Logout
            </button>
          ) : (
            <Link to="/auth" className="btn-auth">
              Login / Signup
            </Link>
          )}
        </div>

        {isSidebarOpen && (
          <div className="sidebar-header">
            <h2>Liflect</h2>
          </div>
        )}

        <nav>
          {navLinks.map(({ to, label, icon }) => (
            <Link
              key={to}
              to={to}
              className={location.pathname === to ? "active" : ""}
            >
              <span className="icon">{icon}</span>
              <span className="label">{label}</span>
            </Link>
          ))}
        </nav>
      </aside>
    </>
  );
}

export default Sidebar;
