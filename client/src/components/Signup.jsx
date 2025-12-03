import React, { useState, useContext } from "react";
import { UserContext } from "../contexts/UserContext";

const Signup = ({ onAuthSuccess }) => {
  const { setUserData } = useContext(UserContext);
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();

    // Basic front-end validation
    if (!email.includes("@")) return alert("Invalid email format");
    if (password.length < 6) return alert("Password should be at least 6 characters");
    if (Number(age) <= 0) return alert("Age must be a positive number");

    setLoading(true);

    try {
      const res = await fetch("https://liflect-1.onrender.com/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          age: Number(age), // 👈 Ensure age is a Number
          email,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        console.error("❌ Server responded with error:", data);
        alert(data.error || "Signup failed");
        return;
      }

      setUserData(data); // Store user info
      alert(`Signup successful! Welcome ${data.name}`);
      onAuthSuccess(); // Go to home/dashboard
    } catch (err) {
      console.error("❌ Signup request failed:", err);
      alert("Something went wrong during signup");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSignup} style={{ maxWidth: 400, margin: "auto", display: "flex", flexDirection: "column" }}>
      <input
        type="text"
        placeholder="Full Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        style={{ marginBottom: 10, padding: 8 }}
      />
      <input
        type="number"
        placeholder="Age"
        value={age}
        onChange={(e) => setAge(e.target.value)}
        required
        style={{ marginBottom: 10, padding: 8 }}
      />
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
        style={{ padding: 10, backgroundColor: "#2196f3", color: "white", border: "none" }}
      >
        {loading ? "Signing up..." : "Sign Up"}
      </button>
    </form>
  );
};

export default Signup;
