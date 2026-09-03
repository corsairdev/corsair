# @corsair-dev/fireflies

Fireflies plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/fireflies
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `aiApp.getOutputs` | `fireflies.api.aiApp.getOutputs` | `read` | Get the outputs of an AI app for a transcript |
| `askFred.continueThread` | `fireflies.api.askFred.continueThread` | `write` | Continue an existing AskFred conversation thread |
| `askFred.createThread` | `fireflies.api.askFred.createThread` | `write` | Create a new AskFred conversation thread |
| `askFred.deleteThread` | `fireflies.api.askFred.deleteThread` | `destructive` | Delete an AskFred conversation thread [DESTRUCTIVE] |
| `askFred.getThread` | `fireflies.api.askFred.getThread` | `read` | Get a single AskFred conversation thread by ID |
| `askFred.getThreads` | `fireflies.api.askFred.getThreads` | `read` | Get all AskFred conversation threads for a transcript |
| `audio.upload` | `fireflies.api.audio.upload` | `write` | Upload an audio file for transcription |
| `transcripts.get` | `fireflies.api.transcripts.get` | `read` | Get a single transcript by ID with full details |
| `transcripts.getAnalytics` | `fireflies.api.transcripts.getAnalytics` | `read` | Get analytics data for a transcript |
| `transcripts.getAudioUrl` | `fireflies.api.transcripts.getAudioUrl` | `read` | Get the audio URL for a transcript |
| `transcripts.getSummary` | `fireflies.api.transcripts.getSummary` | `read` | Get the AI-generated summary for a transcript |
| `transcripts.getVideoUrl` | `fireflies.api.transcripts.getVideoUrl` | `read` | Get the video URL for a transcript |
| `transcripts.list` | `fireflies.api.transcripts.list` | `read` | List transcripts with optional filters |
| `users.getCurrent` | `fireflies.api.users.getCurrent` | `read` | Get the current authenticated user |
| `users.list` | `fireflies.api.users.list` | `read` | List all users in the workspace |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

Handles 5 webhook events. See the reference for payloads and `webhookHooks`.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/fireflies

## License

Apache-2.0
