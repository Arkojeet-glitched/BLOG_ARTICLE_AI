# Autonomous AI Intelligence Briefing

A dynamic, self-updating news platform born from a collaboration between human creativity and AI execution.

## 🌟 Introduction

This platform is a high-performance, cyberpunk-themed news blog that serves daily intelligence reports on global Artificial Intelligence developments.

**What it does:** Every day at midnight (UTC), the site autonomously researches the latest AI news, generates a curated 10-point intelligence briefing, updates its own codebase, redeploys to Vercel, and emails the site owner a summary of the update.

**How it functions:** The site operates on a fully automated CI/CD pipeline using GitHub Actions. A custom Node.js script leverages the Google Gemini API to conduct deep research and format the news into structured JSON. The React frontend then dynamically renders this JSON, ensuring the content is always fresh without any manual intervention.

---

## 👤 Human Contribution

This project began as the very first HTML website ever coded by the owner. The initial structure, static layout, and core conceptual content were manually prepared, serving as the foundational blueprint for the digital aesthetics of the blog.

## 🤖 Gemini CLI Contributions

The Gemini CLI took the initial HTML foundation and engineered it into a fully autonomous, production-ready React application. Key implementations include:

- **React & TypeScript Architecture:** Ported the static HTML structure into a modern, component-based environment using Vite and React.
- **Fluid Responsiveness:** Implemented `clamp()` functions across typography, paddings, and margins to ensure the layout perfectly adapts to any device screen size.
- **Advanced Interactions:** Engineered Framer Motion animations, interactive background particle canvases, and high-speed "text-decoding" effects for headings.
- **Performance Scroll & Themes:** Integrated `Lenis` for zero-latency scroll momentum (with a user toggle to revert to system settings) and a dynamic Light/Dark mode that respects system preferences and saves to local storage.
- **Automated Deployment:** Configured the environment, resolved dependency conflicts, and managed the initial Vercel deployment.

---

## ⚙️ Core API Integrations

The autonomy of this platform relies on two major API integrations executing within a GitHub Actions workflow:

### 1. Google Gemini API (`@google/generative-ai`)
- **Use Case:** Autonomous Content Generation.
- **Implementation:** A script (`scripts/update-content.js`) is triggered daily. It connects to the Gemini API (using a secure fallback loop between `gemini-3.1-flash` and `gemini-2.5-flash`) and uses a specialized prompt to research the last 24 hours of global AI news. 
- **Output:** The API returns a highly formatted JSON object containing punchy, character-driven summaries and verified source URLs, which is then written directly into the `src/data/content.json` file.

### 2. SendGrid Email API (`@sendgrid/mail`)
- **Use Case:** System Notifications.
- **Implementation:** Immediately after the Gemini API successfully updates the content and GitHub Actions commits the new data, a secondary script (`scripts/send-notification.js`) is triggered.
- **Output:** It parses the newly generated JSON file and dispatches a stylized HTML email to the repository owner, notifying them that the "Intelligence Report" has been successfully updated and deployed.

---
*Built with speed, precision, and complete autonomy.*