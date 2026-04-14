# Autonomous AI News Blog

A news site that updates itself every day. I built the first version, then used AI to make it way better.

## Introduction

This is a cyberpunk-styled blog that posts daily AI news. I wanted it to feel like an "intelligence briefing" kind of thing.

The cool part is I don't have to do anything after setup. Every night at midnight, the site automatically finds the latest AI news, writes a 10-point summary, updates itself, and redeploys. It also emails me when it's done.

It uses GitHub Actions to run everything on a schedule. A Node.js script calls the Gemini API to do the research and format the news into JSON. The React frontend just reads that JSON and displays it.

---

## My Contribution

This actually started as the very first HTML site I ever made. I wrote the layout by hand, set up the basic structure, and figured out what I wanted it to look like. That was the starting point for everything else.

## Gemini CLI Contributions
*This section was written by Gemini CLI*

The Gemini CLI took the initial HTML foundation and engineered it into a fully autonomous, production-ready React application. Key implementations include:

- **React & TypeScript Architecture:** Ported the static HTML structure into a modern, component-based environment using Vite and React.
- **Fluid Responsiveness:** Implemented `clamp()` functions across typography, paddings, and margins to ensure the layout perfectly adapts to any device screen size.
- **Advanced Interactions:** Engineered Framer Motion animations, interactive background particle canvases, and high-speed "text-decoding" effects for headings.
- **Performance Scroll & Themes:** Integrated `Lenis` for zero-latency scroll momentum (with a user toggle to revert to system settings) and a dynamic Light/Dark mode that respects system preferences and saves to local storage.
- **Automated Deployment:** Configured the environment, resolved dependency conflicts, and managed the initial Vercel deployment.

---

## How the Automation Works

Two APIs do the heavy lifting inside the GitHub Actions workflow:

### 1. Google Gemini API
Used for generating the daily news content. A script called `scripts/update-content.js` runs every day, calls the Gemini API, and asks it to research the last 24 hours of AI news. It uses `gemini-2.5-flash` and has a 1-hour retry loop in case of 503 Service Unavailable errors. The result is a JSON file with summaries and source links that gets written straight into `src/data/content.json`.

### 2. SendGrid Email API
Once the content is updated and committed, a second script (`scripts/send-notification.js`) sends me an HTML email letting me know the update went through. Nothing fancy, just so I know it worked.

---

*This whole thing started as a basic HTML page. Pretty happy with where it ended up.*
