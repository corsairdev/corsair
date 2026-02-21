# Onboarding & Setup Improvements

Goal: Make getting started feel seamless (OpenClaw/nanoclaw level). User talks in chat; the agent guides them through setup without sending them to docs or a separate keys page unless necessary.

---

## What to Take from NanoClaw

- **Single entry point**: User says "set up" or "get started" or "add Slack" → agent drives the flow. No "go to /keys first."
- **Structured environment check**: One tool (e.g. `check_environment`) returns a simple summary: which plugins exist, which have credentials, env ok? Agent uses this once to decide next step instead of multiple ad-hoc calls.
- **One step at a time**: For each integration: give one setup URL, one short instruction ("Paste your Slack token here: [URL]. Reply 'done' when finished."). Wait for reply, verify with `check_plugin_status`, then continue or do next integration.
- **Fix it, don’t just say it**: When something is missing (e.g. no account for Slack), agent proactively runs the setup flow (get_setup_url → ask_human with URL). Don’t say "you need to add keys" without immediately providing the URL and pausing for confirmation.
- **Credentials never in chat**: User pastes in the /setup page (or future OAuth flow); agent only ever receives "done" or "ready." Already true today; keep it.

---

## Onboarding Improvements to Implement

1. **`check_environment` tool**  
   Returns one JSON blob: `{ plugins: [{ name, hasAccount, isReady }], envOk: boolean }` (and optionally master key set, DB reachable). Agent calls this at start of "setup" or when user says "what’s configured?" so it knows what to offer or fix.

2. **Proactive setup in system prompt**  
   Add an "Onboarding" section: when user says they want to set up, get started, or add an integration, OR when their request implies an integration that’s registered but not configured:
   - Call `check_environment`.
   - For each integration they need (or that’s unconfigured): `get_setup_url` → `ask_human` with one sentence + URL ("Add your Slack token here: [URL]. Reply 'done' when done.").
   - After reply, call `check_plugin_status` for that plugin; if ready, continue; else repeat or ask human to retry.

3. **First-run / "Get started" in UI**  
   If no integrations are ready, show a single CTA in chat (e.g. "Get started" or "Connect your first app") that sends a message like "Help me set up my first integration." Agent then runs the onboarding flow above.

4. **Per-integration "where to get credentials"**  
   Small registry (e.g. `integrationInstructions` in code or DB): for each plugin, 1–2 sentences + link (e.g. Slack: "Create an app at api.slack.com/apps, install to workspace, copy Bot Token."). Include in system prompt or tool so agent always gives correct instructions with the setup URL.

5. **No separate /keys step for first-time**  
   Default path is: user talks → agent detects need for setup → agent sends setup URL and waits. /keys (or /setup) remains the place credentials are entered, but the user gets there via the agent’s link, not by being told "go to the Keys page."

---

## Non-Corsair Tools (Direct Access)

These are too brittle or generic to put behind Corsair; the agent should have direct tools for them:

| Tool            | Purpose |
|-----------------|--------|
| **Web search**  | Find docs, current info, "where do I get X token." |
| **Web fetch**  | GET a URL and return text/summary (e.g. fetch a doc page to answer a setup question). |

Implement as normal agent tools (same pattern as existing tools). Optional later: write file to a single sandbox dir (e.g. drafts) if you want the agent to prepare snippets for the user.

---

## Success Criteria

- New user can open chat, say "I want to use Slack," and complete setup without leaving the conversation (agent sends setup URL, user goes to it, pastes token, returns to chat, says "done," agent confirms and continues).
- No requirement to read README or find /keys first.
- One integration at a time; clear, single-sentence instructions and one URL per step.
