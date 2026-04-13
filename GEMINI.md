# Project Transfer Protocol for Gemini CLI

**CRITICAL MANDATE:** 
Whenever Gemini CLI is operating within this repository (or any repository where a similar transfer file is designated), it MUST automatically maintain and update the designated "Project State" file (e.g., `PROJECT_STATE.md`). 

## Core Directives for the AI Assistant:
1. **Designated Transfer File:** The user will designate a specific file (currently `PROJECT_STATE.md`) as the master record of the project's architecture, components, API integrations, and history.
2. **Continuous Updates:** After implementing any significant changes, adding new features, resolving critical errors, or modifying the system architecture, Gemini CLI MUST update the designated transfer file to reflect these changes.
3. **Cross-Device Continuity:** The sole purpose of the transfer file is to ensure that if the user switches to a new device and spins up a new Gemini CLI session, the AI can instantly read the transfer file and be 100% up-to-date with the project's current state.
4. **Actionable Awareness:** Since Gemini CLI does not run continuously in the background to detect "quitting," it is your responsibility as the AI to proactively update the transfer file at the conclusion of any major task or milestone during the active session.

*By reading this file, you acknowledge and agree to abide by the Project Transfer Protocol.*