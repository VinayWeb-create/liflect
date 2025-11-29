import React, { useState, useEffect } from "react";

function Home() {
  const paragraphs = [
    "Curious what your life could’ve looked like if you made different choices?",
    "Feed in your details, explore life paths, simulate snapshots, and see alternate realities unfold 🔮.",
    "Start with User Details and let your imagination explore possibilities."
  ];

  const [displayedText, setDisplayedText] = useState(["", "", ""]);
  const [currentPara, setCurrentPara] = useState(0);
  const [charIndex, setCharIndex] = useState(0);

  useEffect(() => {
    if (currentPara < paragraphs.length) {
      if (charIndex < paragraphs[currentPara].length) {
        const timeout = setTimeout(() => {
          setDisplayedText((prev) => {
            const newText = [...prev];
            newText[currentPara] += paragraphs[currentPara][charIndex];
            return newText;
          });
          setCharIndex(charIndex + 1);
        }, 35);
        return () => clearTimeout(timeout);
      } else {
        setTimeout(() => {
          setCurrentPara(currentPara + 1);
          setCharIndex(0);
        }, 800);
      }
    }
  }, [charIndex, currentPara]);

  return (
    <div style={styles.container}>
      <div style={styles.heroSection}>
        <img
          src="https://cdn-icons-png.flaticon.com/512/4712/4712106.png"
          alt="AI Robot Icon"
          style={styles.robotImage}
        />
        <h1 style={styles.title}>Welcome to <span style={styles.brand}>Liflect</span> 🧠</h1>
        <p style={styles.subtitle}>
          Your <strong>AI-powered parallel self simulator</strong>.
        </p>
      </div>

      <div style={styles.contentBox}>
        <img
          src="WhatsApp Image 2025-05-28 at 21.04.50_7d8d2a03.jpg"
          alt="AI Simulation"
          style={styles.inlineImage}
        />
        <div>
          {displayedText.map((line, idx) => (
            <p style={styles.text} key={idx}>{line}</p>
          ))}
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: "2rem",
    fontFamily: "'Orbitron', sans-serif",
    backgroundColor: "#0b0c10",
    color: "#66fcf1",
    minHeight: "100vh",
    textAlign: "center",
  },
  heroSection: {
    marginBottom: "3rem",
  },
  robotImage: {
    width: "100px",
    marginBottom: "1rem",
  },
  title: {
    fontSize: "2.5rem",
    color: "#45a29e",
  },
  brand: {
    color: "#66fcf1",
  },
  subtitle: {
    fontSize: "1.2rem",
    color: "#c5c6c7",
  },
  contentBox: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: "2rem",
    justifyContent: "center",
    flexWrap: "wrap",
    backgroundColor: "#1f2833",
    padding: "2rem",
    borderRadius: "12px",
    boxShadow: "0 0 15px #66fcf180",
  },
  inlineImage: {
    width: "200px",
    borderRadius: "10px",
  },
  text: {
    maxWidth: "500px",
    fontSize: "1rem",
    marginBottom: "1rem",
    color: "#c5c6c7",
    whiteSpace: "pre-wrap",
  },
};

export default Home;
