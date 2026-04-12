import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CONTENT_PATH = path.join(__dirname, "../src/data/content.json");

async function updateContent() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("GEMINI_API_KEY not found in environment.");
    process.exit(1);
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const date = new Date();
  const dateString = date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).toUpperCase();

  const prompt = `
    Search for the latest global AI news and developments from the last 24 hours (today is ${dateString}).
    Create a highly detailed, "character-driven" intelligence briefing in the style of a high-tech, cyberpunk-noir news blog.
    
    The output must be a JSON object with the following structure:
    {
      "date": "${dateString}",
      "title": "A short, punchy, high-stakes title",
      "intro": "A 2-3 sentence introductory paragraph that sets a dark, futuristic tone.",
      "sections": [
        { "id": "01", "heading": "Heading for topic 1", "content": "Detailed summary (4-5 sentences) with a strong 'insider intelligence' persona." },
        { "id": "02", "heading": "Heading for topic 2", "content": "..." },
        { "id": "03", "heading": "Heading for topic 3", "content": "..." },
        { "id": "04", "heading": "Heading for topic 4", "content": "..." },
        { "id": "05", "heading": "Heading for topic 5", "content": "..." }
      ],
      "conclusion": "A final, ominous or inspiring closing statement."
    }
    
    Requirements:
    - Use technical, punchy language.
    - Mention real companies, models, or global policy moves if they happened.
    - If no specific news is found for today, extrapolate from current major trends in 2026.
    - DO NOT include any markdown formatting in the JSON string itself. Just the raw JSON object.
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();
    
    // Clean up response if it contains markdown code blocks
    text = text.replace(/```json/g, "").replace(/```/g, "").trim();
    
    const content = JSON.parse(text);
    await fs.writeFile(CONTENT_PATH, JSON.stringify(content, null, 2));
    console.log("Content successfully updated for", dateString);
  } catch (error) {
    console.error("Failed to update content:", error);
    process.exit(1);
  }
}

updateContent();