import React, { useState, useEffect } from "react";
import robot from "../assets/robot.png";               // <-- IMPORT
import simulation from "../assets/simulation.jpg";     // <-- IMPORT

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

        {/* FIXED IMAGE PATH */}
        <img src={robot} alt="AI Robot Icon" style={styles.robotImage} />

        <h1 style={styles.title}>
          Welcome to <span style={styles.brand}>Liflect</span> 🧠
        </h1>

        <p style={styles.subtitle}>
          Your <strong>AI-powered parallel self simulator</strong>.
        </p>
      </div>

      <div style={styles.contentBox}>

        {/* FIXED IMAGE PATH */}
        <img src={simulation} alt="AI Simulation" style={styles.inlineImage} />

        <div>
          {displayedText.map((line, idx) => (
            <p style={styles.text} key={idx}>{line}</p>
          ))}
        </div>
      </div>
    </div>
  );
}
