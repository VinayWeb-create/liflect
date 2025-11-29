import express from 'express';
import dotenv from 'dotenv';
import fetch from 'node-fetch';
import multer from 'multer';

dotenv.config();

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// 🔁 Utility: Age calculator
const calculateAgeFromDob = (dobString) => {
  const dob = new Date(dobString);
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const m = today.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
    age--;
  }
  return age;
};

// 📝 Fallback life story generator
const generateMockStory = (userData) => {
  return `
${userData.name || "This person"} grew up in ${userData.location || "an unknown place"} with a curious and adventurous spirit.
From early childhood, they enjoyed activities like ${userData.hobbies || "varied hobbies"} and showed interest in learning.
They pursued their education in ${userData.education || "an unspecified field"} and later ventured into a career as a ${userData.career || "professional"}.
Life brought many turning points—such as ${userData.majorEvents || "key life events"}—that shaped their path.
Financially, they navigated a ${userData.financialStatus || "stable"} lifestyle, supported by a ${userData.family || "tight-knit or evolving"} family environment.
Known for being ${userData.personality || "resilient and thoughtful"}, they embraced each experience with purpose.
Now at age ${userData.age || "an adult"}, they continue aiming for personal growth, meaningful relationships, and a fulfilling life ahead.
`;
};

// 🔮 Generate a set of images using DeepAI
const generateDeepAiImages = async (userData) => {
  const prompts = [
    `A child growing up in ${userData.location || "a small town"}`,
    `A student studying ${userData.education || "in school"}`,
    `A professional working as a ${userData.career || "worker"}`,
    `Visualizing future dreams and goals with hope and ambition`,
  ];

  const images = [];

  for (let prompt of prompts) {
    try {
      const response = await fetch("https://api.deepai.org/api/text2img", {
        method: "POST",
        headers: {
          "Api-Key": process.env.DEEPAI_API_KEY,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({ text: prompt }),
      });

      const data = await response.json();
      images.push({
        keyword: prompt,
        url: data.output_url || "https://dummyimage.com/512x512/333/fff.png?text=Image+Error",
      });
    } catch (err) {
      console.error(`❌ DeepAI failed for prompt: "${prompt}"`, err.message);
      images.push({
        keyword: prompt,
        url: "https://dummyimage.com/512x512/ff0000/ffffff.png?text=Image+Error",
      });
    }
  }

  return images;
};

// ✅ Health check
router.get("/story", (req, res) => {
  res.send("✅ API is running. Use POST /api/story with userData.");
});

// 🎯 POST /api/story → Full life story + images
router.post("/story", upload.single("image"), async (req, res) => {
  let userData;

  try {
    userData = JSON.parse(req.body.userData);
  } catch (err) {
    return res.status(400).json({ error: "❌ Invalid userData JSON format" });
  }

  if (!userData) {
    return res.status(400).json({ error: "❌ No userData provided" });
  }

  if (userData.dob && !userData.age) {
    userData.age = calculateAgeFromDob(userData.dob);
  }

  const prompt = `
Write a detailed, realistic, and engaging life story based on the following information:

- Name: ${userData.name}
- Age: ${userData.age}
- Location: ${userData.location}
- Education: ${userData.education}
- Career: ${userData.career}
- Family: ${userData.family}
- Major Life Events: ${userData.majorEvents}
- Hobbies: ${userData.hobbies}
- Financial Status: ${userData.financialStatus}
- Personality Traits: ${userData.personality}

Narrate the story from childhood to present and include aspirations for the future.
`;

  try {
    const images = await generateDeepAiImages(userData);

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "openai/gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 500,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`OpenRouter error ${response.status}: ${errorText}`);
    }

    const result = await response.json();
    const story = result.choices?.[0]?.message?.content || "⚠️ Story not available.";

    return res.json({
      story,
      images,
      ratings: {
        happiness: 8,
        success: 7,
        growth: 9,
      },
    });
  } catch (error) {
    console.error("🔥 Fallback triggered:", error.message);
    const fallbackStory = generateMockStory(userData);
    const fallbackImages = await generateDeepAiImages(userData);

    return res.status(200).json({
      story: fallbackStory,
      images: fallbackImages,
      ratings: {
        happiness: 7,
        success: 6,
        growth: 8,
      },
      source: "fallback",
    });
  }
});

// 🧠 POST /api/generate-image → One image based on free-form prompt
router.post("/generate-image", async (req, res) => {
  const { prompt } = req.body;

  if (!prompt || prompt.length < 5) {
    return res.status(400).json({ error: "❌ Prompt too short or missing" });
  }

  try {
    const response = await fetch("https://api.deepai.org/api/text2img", {
      method: "POST",
      headers: {
        "Api-Key": process.env.DEEPAI_API_KEY,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({ text: prompt }),
    });

    const data = await response.json();

    return res.json({
      images: [
        {
          keyword: prompt,
          url: data.output_url || "https://dummyimage.com/512x512/ff0000/ffffff.png?text=Image+Error",
        },
      ],
    });
  } catch (err) {
    console.error("❌ DeepAI avatar generation failed:", err.message);
    return res.status(500).json({
      error: "❌ Image generation failed",
      images: [
        {
          keyword: prompt,
          url: "https://dummyimage.com/512x512/333333/ffffff.png?text=Fallback+Image",
        },
      ],
    });
  }
});

export default router;
