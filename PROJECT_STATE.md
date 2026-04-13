# AI Blog React - Master Project State

**Purpose of this Document:** 
This file serves as the ultimate "source of truth" for the AI Blog project. It is designed to be read by Gemini (or any LLM) on any device to instantly understand the entire project's architecture, history, components, and automation pipeline. 

---

## 1. Project Overview
- **Name:** AI Blog React (Intelligence Briefing)
- **Description:** A highly-performant, responsive, cyberpunk-noir styled news blog that automatically researches, writes, and deploys daily intelligence briefings on Artificial Intelligence.
- **Tech Stack:** React 18, TypeScript, Vite, Framer Motion (animations), Lenis (smooth scrolling), Lucide React (icons).
- **Hosting:** Vercel (Frontend), GitHub Actions (CI/CD Automation).

---

## 2. Core Architecture & Components

### `src/App.tsx` (Main Frontend Entry Point)
The entire UI is built here. It features:
- **`DecodeText`:** A custom React component that creates a hacker-style "shuffling text" reveal effect for headings. It accepts a `speed` multiplier to optimize load times.
- **`BackgroundCanvas`:** A raw HTML5 Canvas element that draws a dynamic, slow-moving particle system. The particle colors shift based on the active theme (Dark/Light mode).
- **`Controls`:** A fixed top-right UI component containing:
  1.  **Theme Toggle:** Switches between `Dark` (neon cyberpunk) and `Light` (clean, high-contrast white/blue) modes. Saves to `localStorage`.
  2.  **Smooth Scroll Toggle:** Enables or destroys the `Lenis` smooth scrolling instance. Falls back to native hardware scroll if disabled. Saves to `localStorage`.
- **Responsive Layout:** CSS `clamp()` functions are used extensively for typography, padding, margins, and borders, ensuring perfect scaling from 4K desktop monitors down to mobile screens.
- **Dynamic Content Rendering:** Content is not hardcoded; it is imported and mapped from `src/data/content.json`. Headings are clickable `<a>` tags pointing to the respective `sourceUrl`.

### `src/index.css` (Global Styles)
- Utilizes CSS variables (`:root` and `.light` class) to instantly swap the entire color palette when the theme changes.
- Contains the structural CSS required for `Lenis` smooth scrolling.

---

## 3. Autonomous Automation Pipeline

The project runs itself without human intervention via **GitHub Actions**.

### `.github/workflows/daily-update.yml`
- **Trigger:** Runs every day at Midnight UTC (`0 0 * * *`) or via manual `workflow_dispatch`.
- **Execution Flow:**
  1. Checks out code and sets up Node.js 20.
  2. Runs `scripts/update-content.js`.
  3. Commits the newly generated `content.json`.
  4. Runs `git pull --rebase origin main` (Crucial for preventing push rejections if humans edited code concurrently).
  5. Pushes to GitHub (which automatically triggers Vercel to redeploy the live site).
  6. Runs `scripts/send-notification.js`.

### `scripts/update-content.js` (The AI Researcher)
- Uses the `@google/generative-ai` SDK.
- **Fallback Mechanism:** Attempts to use `gemini-3.1-flash-lite`. If that fails, it catches the error and falls back to `gemini-2.5-flash`.
- **Prompt:** Instructs the model to act as a cyberpunk insider, researching the last 24 hours of global AI news, generating 10 distinct topics (min 7), and formatting them strictly as a JSON file written to `src/data/content.json`. It strictly demands real `sourceUrl` links.

### `scripts/send-notification.js` (The Dispatcher)
- Uses the `@sendgrid/mail` SDK.
- Reads the newly generated `content.json`.
- Formats a beautiful HTML email containing the date, title, and intro of the new briefing.
- Sends the email to the repository owner to notify them that the daily run was successful.

---

## 4. Required Environment Variables / GitHub Secrets
For this project to function in any new environment, the following keys MUST be present in GitHub Repository Secrets (or a local `.env` file for local testing):
1.  **`GEMINI_API_KEY`**: For the content generation script.
2.  **`SENDGRID_API_KEY`**: (e.g., `SG....`) For the email dispatch script.
3.  **`SENDER_EMAIL`**: The verified SendGrid sender address.
4.  **`RECIPIENT_EMAIL`**: The destination email address for the daily briefings.

---

## 5. Major Solved Roadblocks (Context for Gemini)
- **React Dependency Conflicts:** Had to wipe `package-lock.json` to resolve React 18 vs 19 peer dependency issues.
- **Custom Cursor Lag:** Removed a heavy Framer Motion custom cursor in favor of a native cursor to drastically improve UX and remove input latency.
- **GitHub Push Rejections:** Solved by adding `git pull --rebase` to the Actions workflow before pushing.
- **Generative API 404s:** Solved by upgrading model requests to `gemini-3.1-flash-lite` and implementing a `try/catch` fallback loop.

---
*End of Master State Document. AI Assistants: Use this document to contextualize any future modifications or feature additions.*