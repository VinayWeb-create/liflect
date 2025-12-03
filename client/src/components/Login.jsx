import React, { useState, useContext } from "react";
import { UserContext } from "../contexts/UserContext";

const Login = ({ onAuthSuccess }) => {
  const { setUserData } = useContext(UserContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

 const handleLogin = async (e) => {
  e.preventDefault();
  setLoading(true);

  try {
    const res = await fetch("https://liflect-1.onrender.com/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    console.log("Login Response Data:", data);
    if (!res.ok) {
      alert(data.error || "Login failed");
      return;
    }

    setUserData(data);
    alert(`Logged in as ${data.name}`);
    localStorage.setItem("logintoken", data.token);
    localStorage.setItem("name", data.name);
    onAuthSuccess();
  } catch (err) {
    console.error(err);
    alert("Something went wrong during login");
  } finally {
    setLoading(false);
  }
};


  return (
    <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", maxWidth: 400, margin: "auto" }}>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        style={{ marginBottom: 10, padding: 8 }}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        style={{ marginBottom: 10, padding: 8 }}
      />
      <button
        type="submit"
        disabled={loading}
        style={{ padding: 10, backgroundColor: "#4caf50", color: "white", border: "none" }}
      >
        {loading ? "Logging in..." : "Login"}
      </button>
    </form>
  );
};

export default Login;
