# @corsair-dev/fathomai

Fathom AI Notetaker plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/fathomai
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `meetings.list` | `fathomai.api.meetings.list` | `read` | List recorded meetings with filters, optionally including transcript, summary, action items, highlights and CRM matches |
| `meetingTypes.list` | `fathomai.api.meetingTypes.list` | `read` | List the org meeting types; their names filter meetings.list |
| `recordings.getDownload` | `fathomai.api.recordings.getDownload` | `read` | Poll a recording download; a completed one carries a signed file URL valid for about 24 hours |
| `recordings.getSummary` | `fathomai.api.recordings.getSummary` | `read` | Get the AI summary of a recording, or have Fathom POST it to a destination_url |
| `recordings.getTranscript` | `fathomai.api.recordings.getTranscript` | `read` | Get the speaker-labelled transcript of a recording, or have Fathom POST it to a destination_url |
| `recordings.requestDownload` | `fathomai.api.recordings.requestDownload` | `write` | Start generating a downloadable video or audio file for a recording |
| `teamMembers.list` | `fathomai.api.teamMembers.list` | `read` | List team members, optionally filtered by team name |
| `teams.list` | `fathomai.api.teams.list` | `read` | List the teams in the Fathom account |
| `users.list` | `fathomai.api.users.list` | `read` | List account users with their status and permissions. Needs an account admin key |
| `webhooks.create` | `fathomai.api.webhooks.create` | `write` | Register a webhook that fires when new meeting content is ready; returns its signing secret once |
| `webhooks.delete` | `fathomai.api.webhooks.delete` | `destructive` | Delete a webhook so it stops receiving meeting content |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

Handles 1 webhook event. See the reference for payloads and `webhookHooks`.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/fathomai

## License

Apache-2.0
