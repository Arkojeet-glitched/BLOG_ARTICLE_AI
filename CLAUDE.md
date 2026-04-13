# CLAUDE.md — Project Context for Claude Code

## What This Project Is

An autonomous, cyberpunk-noir styled AI news blog called **"Intelligence Briefing"**. It researches, writes, and deploys daily AI news with zero human intervention after setup. Started as the user's first-ever hand-coded HTML page; rebuilt into a full React app with AI assistance.

**Live site:** Hosted on Vercel. Auto-redeploys on every push to `main`.

---

## Tech Stack

- **Frontend:** React 18, TypeScript, Vite
- **Animations:** Framer Motion
- **Scroll:** Lenis (smooth scroll with user toggle)
- **Icons:** Lucide React
- **Automation:** GitHub Actions + Node.js scripts
- **Content AI:** Google Gemini API (`@google/generative-ai`)
- **Notifications:** SendGrid (`@sendgrid/mail`)

---

## Project Structure

```
src/
  App.tsx          # Entire UI — components, theme, animations
  index.css        # CSS variables for dark/light themes, Lenis setup
  data/
    content.json   # Auto-generated daily — DO NOT manually edit

scripts/
  update-content.js    # Calls Gemini API, writes content.json
  send-notification.js # Sends HTML email via SendGrid after update

.github/workflows/
  daily-update.yml     # Runs at midnight UTC daily
```

---

## Key UI Components (all in `src/App.tsx`)

- **`DecodeText`** — Hacker-style shuffling text reveal for headings. Accepts a `speed` multiplier.
- **`BackgroundCanvas`** — HTML5 Canvas particle system. Colors shift with active theme.
- **`Controls`** — Fixed top-right UI with:
  - Theme toggle: Dark (neon cyberpunk) / Light (high-contrast white/blue). Saves to `localStorage`.
  - Smooth scroll toggle: Enables/destroys Lenis instance. Saves to `localStorage`.
- **Responsive layout:** CSS `clamp()` used throughout for typography, padding, margins — scales from 4K to mobile.
- **Dynamic content:** Imported from `src/data/content.json`, never hardcoded. Section headings are `<a>` tags linking to `sourceUrl`.

---

## Automation Pipeline

**Trigger:** `0 0 * * *` (midnight UTC) or manual `workflow_dispatch`

**Flow:**
1. Checkout + Node.js 20 setup
2. Run `scripts/update-content.js` → writes `src/data/content.json`
3. Commit updated JSON
4. `git pull --rebase origin main` (prevents push rejection if code was manually edited)
5. Push to GitHub → Vercel auto-redeploys
6. Run `scripts/send-notification.js` → email confirmation

**Gemini model fallback:** tries `gemini-3.1-flash-lite` first, falls back to `gemini-2.5-flash` on error.

---

## Required Secrets

| Secret | Purpose |
|---|---|
| `GEMINI_API_KEY` | Content generation |
| `SENDGRID_API_KEY` | Email dispatch (format: `SG....`) |
| `SENDER_EMAIL` | Verified SendGrid sender address |
| `RECIPIENT_EMAIL` | Destination for daily briefing emails |

Set in **GitHub Repository Secrets** for CI. Use a local `.env` file for local testing.

---

## Known Issues & Fixes (Historical)

1. **React dependency conflict** — Wiped `package-lock.json` and reinstalled to resolve React 18 vs 19 peer dep conflict.
2. **Custom cursor lag** — Removed Framer Motion custom cursor entirely; restored native cursor for zero latency.
3. **GitHub Actions push rejected** — Fixed by adding `git pull --rebase` before push in the workflow.
4. **Gemini 404 errors** — Fixed by upgrading to `gemini-3.1-flash-lite` + `gemini-2.5-flash` fallback.
5. **GitHub secret name rejection** — Secret *names* must use uppercase letters and underscores only (no dashes).

---

## Content JSON Shape

```json
{
  "date": "APRIL 12, 2026",
  "title": "...",
  "intro": "...",
  "sections": [
    {
      "heading": "...",
      "body": "...",
      "sourceUrl": "https://..."
    }
  ]
}
```

Minimum 7 sections, target 10. All `sourceUrl` values must be real links.
