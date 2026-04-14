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

  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  const newsDateString = yesterday.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).toUpperCase();

  // Removed "DEEP RESEARCH sweep" instruction to ensure compatibility with standard free tier APIs
  const prompt = `
    Search for the latest global AI news, technical breakthroughs, and policy developments from the last 24 hours (specifically focusing on ${newsDateString}). You must be exhaustive.
    Create a highly detailed, "character-driven" intelligence briefing in the style of a high-tech, cyberpunk-noir news blog.
    
    The output must be a JSON object with the following structure:
    {
      "date": "${newsDateString}",
      "title": "A short, punchy, high-stakes title",
      "intro": "A 2-3 sentence introductory paragraph that sets a dark, futuristic tone.",
      "sections": [
        { "id": "01", "heading": "Heading for topic 1", "content": "Detailed summary (4-5 sentences) with a strong 'insider intelligence' persona.", "sourceUrl": "REAL_URL_HERE" },
        { "id": "02", "heading": "Heading for topic 2", "content": "...", "sourceUrl": "REAL_URL_HERE" },
        ... provide exactly 10 sections if possible. If 10 distinct events are absolutely not available, provide a MINIMUM of 7 sections. Format id as "01", "02", etc. ...
        { "id": "10", "heading": "Heading for topic 10", "content": "...", "sourceUrl": "REAL_URL_HERE" }
      ],
      "conclusion": "A final, ominous or inspiring closing statement."
    }
    
    Requirements:
    - Use technical, punchy language.
    - Mention real companies, models, or global policy moves if they happened.
    - IMPORTANT: The 'sourceUrl' MUST be an actual, real, working URL to a legitimate news source (like Reuters, Bloomberg, TechCrunch, Wired, The Verge) or the company's official announcement page. DO NOT use example.com. If you cannot find a direct link, use a relevant Google News search URL (e.g., https://news.google.com/search?q=Topic+Name).
    - If no specific news is found for that date, extrapolate from current major trends in 2026.
    - DO NOT include any markdown formatting in the JSON string itself. Just the raw JSON object.
  `;

  let success = false;

  while (!success) {
    console.log(`Version: 1.8 - Attempting to use model: gemini-2.5-flash`);
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
      const result = await model.generateContent(prompt);
      const response = await result.response;
      let text = response.text();
      
      // Clean up response if it contains markdown code blocks
      text = text.replace(/```json/g, "").replace(/```/g, "").trim();
      
      const content = JSON.parse(text);
      await fs.writeFile(CONTENT_PATH, JSON.stringify(content, null, 2));
      console.log(`Content successfully updated for ${newsDateString} using gemini-2.5-flash`);
      success = true;
    } catch (error) {
      console.error(`Failed with model gemini-2.5-flash:`, error.message);
      if (error.status === 503 || error.message.includes("503")) {
        console.log("Encountered 503 error. Retrying in 1 hour...");
        await new Promise(resolve => setTimeout(resolve, 60 * 60 * 1000));
      } else {
        console.error("Error is not a 503, exiting.");
        process.exit(1);
      }
    }
  }
}

updateContent();