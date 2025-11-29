import React, { useContext, useState, useEffect } from "react";
import { UserContext } from "../contexts/UserContext";
import { jsPDF } from "jspdf";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from "recharts";
import "./SimulateSnapshot.css";

const SimulateSnapshot = () => {
  const { userData, lifeStory, lifeRatings, setLifeStory } = useContext(UserContext);
  const [editableStory, setEditableStory] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [currentAge, setCurrentAge] = useState(userData.age || 25);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("editableStory");
    setEditableStory(saved || lifeStory || "");
  }, [lifeStory]);

  useEffect(() => {
    localStorage.setItem("editableStory", editableStory);
  }, [editableStory]);

  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        setCurrentAge((age) => {
          const next = Number(age) + 1;
          if (next > userData.age) {
            setIsPlaying(false);
            return age;
          }
          return next;
        });
      }, 300);
      return () => clearInterval(interval);
    }
  }, [isPlaying]);

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    const lines = doc.splitTextToSize(editableStory, 180);
    doc.text(lines, 15, 20);
    doc.save("Life_Snapshot.pdf");
  };

  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
    document.body.classList.toggle("dark-mode");
  };

  const handleRegenerate = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/story", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      if (!response.ok) throw new Error("Failed to regenerate story");

      const data = await response.json();
      setLifeStory(data.story);
      setEditableStory(data.story);
    } catch (err) {
      alert("Regeneration failed.");
      console.error(err);
    }
  };

  const highlightKeyEvents = (text) => {
    const keywords = ["marriage", "graduation", "promotion", "death", "child", "move"];
    let result = text;
    keywords.forEach((word) => {
      const regex = new RegExp(`\b(${word})\b`, "gi");
      result = result.replace(regex, `🌟 $1`);
    });
    return result;
  };

  const ratingsData = lifeRatings
    ? Object.entries(lifeRatings).map(([key, val]) => ({
        subject: key,
        A: val,
        fullMark: 10,
      }))
    : [];

  return (
    <div className={`snapshot-container ${darkMode ? "dark" : ""}`}>
      <h2>🧬 Simulated Life Snapshot</h2>

      <div className="mode-toggle">
        <button onClick={toggleDarkMode} className="mode-btn">
          {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
        </button>
      </div>

      <div className="timeline-slider">
        <label>🕰️ Age: {currentAge}</label>
        <input
          type="range"
          min="1"
          max={userData.age || 80}
          value={currentAge}
          onChange={(e) => setCurrentAge(e.target.value)}
        />
        <button onClick={() => setIsPlaying(!isPlaying)} className="play-btn">
          {isPlaying ? "⏸ Pause Timeline" : "▶️ Play Timeline"}
        </button>
      </div>

      <textarea
        className="story-editor"
        value={editableStory}
        onChange={(e) => setEditableStory(e.target.value)}
        rows={20}
      />

      <div
        className="highlighted-story"
        dangerouslySetInnerHTML={{
          __html: highlightKeyEvents(editableStory).replace(/\n/g, "<br/>")
        }}
      />

      {lifeRatings && (
        <div className="ratings-chart">
          <h3>📈 Life Ratings</h3>
          <RadarChart outerRadius={90} width={400} height={250} data={ratingsData}>
            <PolarGrid />
            <PolarAngleAxis dataKey="subject" />
            <PolarRadiusAxis angle={30} domain={[0, 10]} />
            <Radar
              name="Life"
              dataKey="A"
              stroke="#66fcf1"
              fill="#66fcf1"
              fillOpacity={0.6}
            />
          </RadarChart>
        </div>
      )}

      <div className="snapshot-buttons">
        <button onClick={handleDownloadPDF} className="download-btn">⬇️ Download PDF</button>
        <button onClick={handleRegenerate} className="retry-btn">🔁 Regenerate</button>
      </div>
    </div>
  );
};

export default SimulateSnapshot;
