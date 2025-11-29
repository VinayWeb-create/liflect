import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

// Create context
export const UserContext = createContext();

// Provider component
export const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState({});
  const [selectedAge, setSelectedAge] = useState(25);
  const [lifeStory, setLifeStory] = useState("");
  const [lifeRatings, setLifeRatings] = useState({
    assessment: 0,
    development: 0,
    fulfillment: 0,
  });
  const [images, setImages] = useState([]);

  // Fetch user on mount
  useEffect(() => {
    const token = localStorage.getItem("loginToken");
    if (token) {
      axios
        .get("/api/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          setUserData(res.data);
        })
        .catch((err) => {
          console.error("Failed to fetch user:", err.message);
          logOut();
        });
    }
  }, []);

  // Logout with confirmation
  const logOut = () => {
    const confirmLogout = window.confirm("Are you sure you want to log out?");
    if (!confirmLogout) return;

    localStorage.removeItem("loginToken");
    setUserData({});
    setSelectedAge(25);
    setLifeStory("");
    setLifeRatings({ assessment: 0, development: 0, fulfillment: 0 });
    setImages([]);
  };

  return (
    <UserContext.Provider
      value={{
        userData,
        setUserData,
        selectedAge,
        setSelectedAge,
        lifeStory,
        setLifeStory,
        lifeRatings,
        setLifeRatings,
        images,
        setImages,
        logOut,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

// Helpful for Vite HMR
UserProvider.displayName = "UserProvider";
