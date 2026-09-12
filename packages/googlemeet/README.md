# @corsair-dev/googlemeet

Google Meet plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/googlemeet
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `conferenceRecords.get` | `googlemeet.api.conferenceRecords.get` | `read` | Get a conference record |
| `conferenceRecords.list` | `googlemeet.api.conferenceRecords.list` | `read` | List conference records |
| `participants.get` | `googlemeet.api.participants.get` | `read` | Get a participant |
| `participants.list` | `googlemeet.api.participants.list` | `read` | List participants |
| `participantSessions.get` | `googlemeet.api.participantSessions.get` | `read` | Get a participant session |
| `participantSessions.list` | `googlemeet.api.participantSessions.list` | `read` | List participant sessions |
| `recordings.get` | `googlemeet.api.recordings.get` | `read` | Get a recording |
| `recordings.list` | `googlemeet.api.recordings.list` | `read` | List recordings |
| `smartNotes.get` | `googlemeet.api.smartNotes.get` | `read` | Get smart notes |
| `smartNotes.list` | `googlemeet.api.smartNotes.list` | `read` | List smart notes |
| `spaces.create` | `googlemeet.api.spaces.create` | `write` | Create a new meeting space |
| `spaces.endActiveConference` | `googlemeet.api.spaces.endActiveConference` | `destructive` | End an active conference [DESTRUCTIVE] |
| `spaces.get` | `googlemeet.api.spaces.get` | `read` | Get a meeting space |
| `spaces.patch` | `googlemeet.api.spaces.patch` | `write` | Update a meeting space |
| `transcriptEntries.get` | `googlemeet.api.transcriptEntries.get` | `read` | Get a transcript entry |
| `transcriptEntries.list` | `googlemeet.api.transcriptEntries.list` | `read` | List transcript entries |
| `transcripts.get` | `googlemeet.api.transcripts.get` | `read` | Get a transcript |
| `transcripts.list` | `googlemeet.api.transcripts.list` | `read` | List transcripts |

## Auth

Auth: OAuth 2.0. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/googlemeet

## License

Apache-2.0
