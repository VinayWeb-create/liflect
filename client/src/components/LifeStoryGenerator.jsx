import React, { useState, useContext, useEffect, useRef } from "react";
import { UserContext } from "../contexts/UserContext.jsx";
import { jsPDF } from "jspdf";
import "./LifeStoryGenerator.css";

const LifeStoryGenerator = () => {
  const { userData } = useContext(UserContext);
  const [loading, setLoading] = useState(false);
  const [lifeStory, setLifeStory] = useState("");
  const [editableStory, setEditableStory] = useState("");
  const [images, setImages] = useState([]);
  const [error, setError] = useState(false);
  const storyRef = useRef(null);

  useEffect(() => {
    if (userData && Object.keys(userData).length > 0) {
      generateStory();
    }
  }, [userData]);

  useEffect(() => {
    if (!loading && storyRef.current) {
      storyRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [loading]);

  const generateStory = async () => {
    setLoading(true);
    setLifeStory("");
    setEditableStory("");
    setImages([]);
    setError(false);

    try {
      const formData = new FormData();
      formData.append("userData", JSON.stringify(userData));

      const response = await fetch("http://localhost:5000/api/story", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("API request failed");

      const data = await response.json();
      setLifeStory(data.story);
      setEditableStory(data.story);
      if (data.images) setImages(data.images);
    } catch (err) {
      console.error("Error generating story:", err);
      setError(true);
      setLifeStory("🚫 Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    const doc = new jsPDF();
    const lines = doc.splitTextToSize(editableStory, 180);
    doc.text(lines, 15, 20);
    doc.save("Life_Story.pdf");
  };

  const generateAIImage = async () => {
    if (!editableStory) return;

    try {
      const prompt = `Create a portrait based on this simulated life story: ${editableStory.slice(0, 300)}...`;
      const response = await fetch("http://localhost:5000/api/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) throw new Error("Image generation failed");

      const data = await response.json();
      if (data.images) {
        setImages((prev) => [...prev, ...data.images]);
      } else {
        throw new Error("No images returned");
      }
    } catch (err) {
      console.error("AI image generation failed:", err);
      alert("⚠️ Failed to generate avatar. Check backend or try again.");
    }
  };

  return (
    <div className="story-container" ref={storyRef}>
      <h2 className="story-title">🔮 Life Simulation Result</h2>

      {loading ? (
        <p className="loading-text">🌀 Crafting your simulated life...</p>
      ) : error ? (
        <div>
          <p className="error-text">{lifeStory}</p>
          <button onClick={generateStory} className="retry-btn">🔁 Retry</button>
        </div>
      ) : (
        <>
          <textarea
            className="story-textarea"
            value={editableStory}
            onChange={(e) => setEditableStory(e.target.value)}
          />
          <div className="story-actions">
            <button onClick={handleDownload} className="download-btn">⬇️ Download PDF</button>
            <button onClick={generateStory} className="retry-btn">🔁 Regenerate</button>
            <button onClick={generateAIImage} className="generate-img-btn">🧠 Generate Avatar</button>
          </div>

          {images.length > 0 && (
            <div className="image-gallery">
              <h3 className="gallery-title">📸 Visual Life Journey</h3>
              <div className="gallery-grid">
                {images.map((img, idx) => (
                  <div key={idx} className="image-card">
                    <img
                      src={img.url}
                      alt={img.keyword || `Image ${idx + 1}`}
                      crossOrigin="anonymous"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src =
                          "https://dummyimage.com/800x600/1f2833/ffffff.png?text=Image+Unavailable";
                      }}
                    />
                    <p>{img.keyword || "Unnamed Image"}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default LifeStoryGenerator;
