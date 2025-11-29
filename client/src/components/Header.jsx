// components/Header.jsx
import React, { useContext } from "react";
import { UserContext } from "../contexts/UserContext";

const Header = () => {
  const { userData } = useContext(UserContext);

  if (!userData?.name) return null; // don't show if not logged in

  return (
    <header style={styles.header}>
      <h1>Welcome, {userData.name}</h1>
    </header>
  );
};

const styles = {
  header: {
    position: "sticky",
    top: 0,
    backgroundColor: "#4caf50",
    color: "white",
    padding: "1rem 0",
    textAlign: "center",
    zIndex: 1000,
    fontWeight: "bold",
    fontSize: "2rem",
  },
};

export default Header;
