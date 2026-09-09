# @corsair-dev/fade-agent-ui

PhantomBuster plugin that connects **Fade** (AI video editor) with **Corsair** to automatically produce and publish videos from PhantomBuster leads.

## Overview

When PhantomBuster finishes a scrape run, this plugin:
1. Receives the lead data via webhook (or polls on demand)
2. Queues a video creation job for the Fade AI agent
3. The agent finds relevant clips, assembles a timeline, exports, and posts back

## Installation

```bash
pnpm install
pnpm --filter @corsair-dev/fade-agent-ui dev
```

Server starts at `http://localhost:3099`.

## Configuration

All settings are editable at runtime via the **⚙ Settings** panel (no restart needed).  
They persist to `.settings.json` across restarts.

| Key | Description |
|-----|-------------|
| `provider` | LLM provider: `google`, `openai`, `anthropic`, `groq`, `tabi` |
| `model` | Model name e.g. `gemini-1.5-flash`, `gpt-4o`, `claude-opus-4-5` |
| `googleApiKey` | Google Gemini API key |
| `openaiApiKey` | OpenAI API key |
| `anthropicApiKey` | Anthropic API key |
| `groqApiKey` | Groq API key |
| `tabiApiKey` | Tabi proxy API key |
| `tabiBaseUrl` | Tabi base URL e.g. `https://tabitoken.com/v1` |
| `stabilityApiKey` | Stability AI key (image generation) |
| `phantomBusterApiKey` | PhantomBuster API key (for polling) |
| `youtubeClientId` | YouTube OAuth client ID |
| `youtubeClientSecret` | YouTube OAuth client secret |

You can also set initial values via `.env` at the workspace root — the settings panel overrides them at runtime.

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/api/chat` | Send a message to the Fade agent (SSE stream) |
| `GET` | `/api/assets` | List all assets in the Fade library |
| `POST` | `/api/assets/upload` | Upload a file to the Fade library |
| `GET` | `/api/settings` | Read current config (keys masked) |
| `POST` | `/api/settings` | Update config at runtime + persist |
| `POST` | `/api/webhook` | Receive PhantomBuster lead payload → queue job |
| `POST` | `/api/poll` | Manually pull phantom results `{ phantomId }` |
| `GET` | `/api/jobs` | Job queue status |
| `GET` | `/api/health` | Health check → `{ ok: true }` |

## PhantomBuster Webhook Setup

1. Run `pnpm --filter @corsair-dev/fade-agent-ui tunnel` to get a public URL
2. In PhantomBuster → your Phantom → **Output** → enable **Webhook**
3. Set webhook URL to `https://<your-tunnel>/api/webhook`
4. Optionally add `X-Webhook-Secret` header and set `WEBHOOK_SECRET` in `.env`

## Architecture

```
PhantomBuster → POST /api/webhook
                  ↓
              jobQueue (serial)
                  ↓
         LangGraph agent (Fade tools)
                  ↓
       Fade backend (port 8000) — clips, timeline, export
```

## Requirements

- Node.js 20+
- Fade backend running on port 8000 (`E:\Editor_SIH\Fade`)
- A valid LLM API key (configure in Settings panel)
