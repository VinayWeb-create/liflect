import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { UserProvider } from "./contexts/UserContext.jsx";
import Home from "./components/Home.jsx"; 
import Sidebar from "./components/Sidebar.jsx";
import Header from "./components/Header.jsx";
import UserInputForm from "./components/UserInputForm.jsx";
import LifeStoryGenerator from "./components/LifeStoryGenerator.jsx";
import SimulationSnapshot from "./components/simulationSnapshot.jsx";
import AuthPage from "./components/AuthPage.jsx";
import "./App.css";

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <UserProvider>
      <Router>
        <div className="app-container">
          <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
          <div
            className={
              sidebarOpen
                ? "main-content-container"
                : "main-content-container main-content-collapsed"
            }
          >
            <main className="main-content">
              <Routes>
  <Route path="/" element={<Home />} />
  <Route path="/userdetails" element={<UserInputForm />} />
  <Route path="/simulate" element={<LifeStoryGenerator />} />
  <Route path="/snapshot" element={<SimulationSnapshot />} />
  <Route path="/auth" element={<AuthPage />} />  {/* <-- Move this up */}
  <Route path="*" element={<div style={{ padding: "2rem" }}>404: Page not found</div>} />
</Routes>


            </main>
          </div>
        </div>
      </Router>
    </UserProvider>
  );
}

export default App;
