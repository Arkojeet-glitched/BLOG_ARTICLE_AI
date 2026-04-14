# Project Error Log

This document tracks the main roadblocks we encountered while building and automating the AI Blog, along with the simple solutions we used to overcome them.

### 1. The Site Refused to Deploy (Build Failure)
**What happened:** When trying to launch the site on Vercel, the system crashed with a "dependency conflict" error. 
**The cause:** The project's files were confused about which version of React to use (it was caught between an older version and a brand-new version).
**How we fixed it:** We threw away the corrupted lockfile (`package-lock.json`) and the installed packages folder, then told the system to reinstall everything from scratch. This forced all the files to agree on the correct, stable version of React.

### 2. The Custom Mouse Cursor Felt "Laggy"
**What happened:** The glowing circle cursor was trailing slightly behind the actual physical mouse movements, making the site feel sluggish.
**The cause:** The animation system was waiting for the entire webpage to update its state before moving the circle.
**How we fixed it:** We initially bypassed the heavy webpage updates by directly connecting the cursor to the raw mouse coordinates for "zero-latency" movement. Eventually, to maximize performance and user comfort, we completely removed the custom circle and restored the computer's natural, native cursor.

### 3. The Automated Daily Update Crashed (GitHub Actions Push Rejected)
**What happened:** The midnight automation script successfully wrote the new news, but failed at the very last step when trying to save (push) the changes to GitHub.
**The cause:** Two things were trying to update the website at the exact same time. We had made manual changes to the code while the robot was simultaneously trying to publish its news. GitHub panicked and blocked the robot to prevent it from overwriting our manual work.
**How we fixed it:** We taught the robot a new rule: *“Before you publish, always check if humans made recent changes. If they did, download their changes first, add your news on top, and then publish.”* (Technically: `git pull --rebase`).

### 4. The AI "Brain" Could Not Be Found (404 API Error)
**What happened:** The daily update script failed with a "404 Not Found" error, meaning it couldn't connect to the Google Gemini AI to write the news.
**The cause:** The script was asking for a specific, older version of the Gemini AI brain that was either retired or unavailable in our region.
**How we fixed it:** We updated the script to use `gemini-2.5-flash`. We also added a "safety net" (retry mechanism) so that if the AI brain is asleep or busy (503 error), it automatically waits an hour and tries again instead of crashing.

### 5. GitHub Rejected the Secret Key Names
**What happened:** When trying to securely store the API passwords in GitHub, the system threw an error and wouldn't save them.
**The cause:** We accidentally tried to use dashes (`-`) in the *name/label* of the secret. GitHub is very strict and only allows uppercase letters and underscores for the labels.
**How we fixed it:** We renamed the labels to use underscores (e.g., changing it to `SENDGRID_API_KEY`) while pasting the actual complex password into the "Value" box, which happily accepts dashes.