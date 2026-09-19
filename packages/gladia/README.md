# @corsair-dev/gladia

Gladia plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/gladia
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `live.deleteSession` | `gladia.api.live.deleteSession` | `destructive` | Permanently delete a live transcription session |
| `live.getTranscriptionResult` | `gladia.api.live.getTranscriptionResult` | `read` | Retrieve a live transcription session result |
| `live.initiateTranscriptionSession` | `gladia.api.live.initiateTranscriptionSession` | `write` | Create a live transcription session and return its WebSocket URL |
| `live.listTranscriptionJobs` | `gladia.api.live.listTranscriptionJobs` | `read` | List live transcription jobs with pagination and filters |
| `preRecorded.deleteJob` | `gladia.api.preRecorded.deleteJob` | `destructive` | Permanently delete a pre-recorded transcription job |
| `preRecorded.getJob` | `gladia.api.preRecorded.getJob` | `read` | Retrieve a pre-recorded transcription job and result |
| `preRecorded.initiateTranscription` | `gladia.api.preRecorded.initiateTranscription` | `write` | Start a pre-recorded transcription job |
| `preRecorded.listJobs` | `gladia.api.preRecorded.listJobs` | `read` | List pre-recorded transcription jobs with pagination and filters |
| `upload.audioVideoFile` | `gladia.api.upload.audioVideoFile` | `write` | Upload an audio or video file for a pre-recorded job |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/gladia

## License

Apache-2.0
