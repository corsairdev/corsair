# @corsair-dev/recallai

Recallai plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/recallai
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `botActions.deleteBotMedia` | `recallai.api.botActions.deleteBotMedia` | `destructive` | Delete stored media for a Recall.ai bot |
| `botActions.leaveBotCall` | `recallai.api.botActions.leaveBotCall` | `destructive` | Remove a Recall.ai bot from its meeting |
| `botActions.outputAudio` | `recallai.api.botActions.outputAudio` | `write` | Output audio from a Recall.ai bot |
| `botActions.outputMedia` | `recallai.api.botActions.outputMedia` | `write` | Start media output from a Recall.ai bot |
| `botActions.outputVideo` | `recallai.api.botActions.outputVideo` | `write` | Output video from a Recall.ai bot |
| `botActions.pauseRecording` | `recallai.api.botActions.pauseRecording` | `write` | Pause a Recall.ai bot recording |
| `botActions.pinParticipant` | `recallai.api.botActions.pinParticipant` | `write` | Pin a participant for a Recall.ai bot |
| `botActions.resumeRecording` | `recallai.api.botActions.resumeRecording` | `write` | Resume a Recall.ai bot recording |
| `botActions.sendChatMessage` | `recallai.api.botActions.sendChatMessage` | `write` | Send a chat message from a Recall.ai bot |
| `botActions.startRecording` | `recallai.api.botActions.startRecording` | `write` | Start a Recall.ai bot recording |
| `botActions.startScreenshare` | `recallai.api.botActions.startScreenshare` | `write` | Start bot screenshare in Recall.ai |
| `botActions.stopOutputAudio` | `recallai.api.botActions.stopOutputAudio` | `write` | Stop bot audio output in Recall.ai |
| `botActions.stopOutputMedia` | `recallai.api.botActions.stopOutputMedia` | `write` | Stop bot media output in Recall.ai |
| `botActions.stopOutputVideo` | `recallai.api.botActions.stopOutputVideo` | `write` | Stop bot video output in Recall.ai |
| `botActions.stopRecording` | `recallai.api.botActions.stopRecording` | `write` | Stop a Recall.ai bot recording |
| `botActions.stopScreenshare` | `recallai.api.botActions.stopScreenshare` | `write` | Stop bot screenshare in Recall.ai |
| `bots.create` | `recallai.api.bots.create` | `write` | Create a Recall.ai meeting bot |
| `bots.delete` | `recallai.api.bots.delete` | `destructive` | Delete a Recall.ai meeting bot |
| `bots.list` | `recallai.api.bots.list` | `read` | List Recall.ai meeting bots |
| `bots.retrieve` | `recallai.api.bots.retrieve` | `read` | Retrieve a Recall.ai meeting bot |
| `bots.update` | `recallai.api.bots.update` | `write` | Update a Recall.ai meeting bot |
| `meetingMetadata.list` | `recallai.api.meetingMetadata.list` | `read` | List Recall.ai meeting metadata artifacts |
| `meetingMetadata.retrieve` | `recallai.api.meetingMetadata.retrieve` | `read` | Retrieve a Recall.ai meeting metadata artifact |
| `participantEvents.list` | `recallai.api.participantEvents.list` | `read` | List Recall.ai participant event artifacts |
| `participantEvents.retrieve` | `recallai.api.participantEvents.retrieve` | `read` | Retrieve a Recall.ai participant event artifact |
| `participantEvents.update` | `recallai.api.participantEvents.update` | `write` | Update Recall.ai participant event metadata |
| `realtimeEndpoints.list` | `recallai.api.realtimeEndpoints.list` | `read` | List Recall.ai real-time endpoints |
| `realtimeEndpoints.retrieve` | `recallai.api.realtimeEndpoints.retrieve` | `read` | Retrieve a Recall.ai real-time endpoint |
| `realtimeEndpoints.update` | `recallai.api.realtimeEndpoints.update` | `write` | Update a Recall.ai real-time endpoint |
| `recordings.createTranscript` | `recallai.api.recordings.createTranscript` | `write` | Create an asynchronous Recall.ai transcript |
| `recordings.delete` | `recallai.api.recordings.delete` | `destructive` | Delete a Recall.ai recording artifact |
| `recordings.list` | `recallai.api.recordings.list` | `read` | List Recall.ai recording artifacts |
| `recordings.retrieve` | `recallai.api.recordings.retrieve` | `read` | Retrieve a Recall.ai recording artifact |
| `recordings.update` | `recallai.api.recordings.update` | `write` | Update Recall.ai recording metadata |
| `sdkUploads.list` | `recallai.api.sdkUploads.list` | `read` | List Recall.ai Desktop SDK uploads |
| `transcripts.list` | `recallai.api.transcripts.list` | `read` | List Recall.ai transcript artifacts |
| `transcripts.retrieve` | `recallai.api.transcripts.retrieve` | `read` | Retrieve a Recall.ai transcript artifact |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/recallai

## License

Apache-2.0
