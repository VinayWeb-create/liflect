import React, { useContext, useState } from "react";
import { UserContext } from "../contexts/UserContext.jsx";
import { useNavigate } from "react-router-dom";
import "./UserInputForm.css";

const UserInputForm = () => {
  const { setUserData, setLifeStory, setLifeRatings } = useContext(UserContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    dob: "", // Replacing age
    location: "",
    education: "",
    career: "",
    family: "",
    majorEvents: "",
    hobbies: "",
    financialStatus: "",
    personality: "",
    image: null, // New field
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setFormData({ ...formData, image: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  const formToSend = new FormData();

  const { image, ...rest } = formData;

  // Attach JSON string of userData
  formToSend.append("userData", JSON.stringify(rest));

  // Attach image separately
  if (image) {
    formToSend.append("image", image);
  }

  setUserData(rest);
  console.log("🚀 User Data Submitted:", rest);

  try {
    const response = await fetch("http://localhost:5000/api/story", {
      method: "POST",
      body: formToSend,
    });

    if (!response.ok) throw new Error("Failed to generate story");

    const data = await response.json();
    setLifeStory(data.story);
    setLifeRatings(data.ratings);
    navigate("/simulate");
  } catch (err) {
    console.error("❌ Error generating story:", err.message);
    alert("Failed to generate story. Please try again later.");
  }
};


  return (
    <div className="user-input-wrapper">
      <h2 className="form-title">🧬 Simulate Your Life</h2>
      <form onSubmit={handleSubmit} className="form-container" encType="multipart/form-data">
        {Object.entries(formData).map(([field, value]) => {
          if (field === "image") {
            return (
              <div key={field} className="form-group">
                <label>Upload Profile Image</label>
                <input
                  name="image"
                  type="file"
                  accept="image/*"
                  onChange={handleChange}
                />
              </div>
            );
          }

          if (field === "dob") {
            return (
              <div key={field} className="form-group">
                <label>Date of Birth</label>
                <input
                  name="dob"
                  type="date"
                  value={formData.dob}
                  onChange={handleChange}
                  required
                />
              </div>
            );
          }

          return (
            <div key={field} className="form-group">
              <label>
                {field
                  .replace(/([A-Z])/g, " $1")
                  .replace(/^./, (str) => str.toUpperCase())}
              </label>
              <input
                name={field}
                type="text"
                value={formData[field]}
                onChange={handleChange}
                required={["name", "dob", "location", "education", "career"].includes(field)}
              />
            </div>
          );
        })}

        <button type="submit" className="submit-btn">🚀 Simulate</button>
      </form>
    </div>
  );
};

export default UserInputForm;
