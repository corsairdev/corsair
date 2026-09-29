# @corsair-dev/zoom

Zoom plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/zoom
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `archiveFiles.list` | `zoom.api.archiveFiles.list` | `read` | List all archived meeting or webinar files |
| `devices.list` | `zoom.api.devices.list` | `read` | List all Zoom devices |
| `meetings.addRegistrant` | `zoom.api.meetings.addRegistrant` | `write` | Add a registrant to a meeting |
| `meetings.create` | `zoom.api.meetings.create` | `write` | Create a new meeting for the authenticated user |
| `meetings.get` | `zoom.api.meetings.get` | `read` | Get details of a specific meeting |
| `meetings.getSummary` | `zoom.api.meetings.getSummary` | `read` | Get the AI-generated summary of a meeting |
| `meetings.list` | `zoom.api.meetings.list` | `read` | List all meetings for the authenticated user |
| `meetings.update` | `zoom.api.meetings.update` | `write` | Update a meeting |
| `participants.getPastMeeting` | `zoom.api.participants.getPastMeeting` | `read` | Get participants of a past meeting |
| `recordings.deleteMeeting` | `zoom.api.recordings.deleteMeeting` | `destructive` | Delete cloud recordings for a meeting [DESTRUCTIVE] |
| `recordings.getMeeting` | `zoom.api.recordings.getMeeting` | `read` | Get cloud recordings for a specific meeting |
| `recordings.listAll` | `zoom.api.recordings.listAll` | `read` | List all cloud recordings for the authenticated user |
| `reports.dailyUsage` | `zoom.api.reports.dailyUsage` | `read` | Get the daily usage report for a given month |
| `webinars.addRegistrant` | `zoom.api.webinars.addRegistrant` | `write` | Add a registrant to a webinar |
| `webinars.get` | `zoom.api.webinars.get` | `read` | Get details of a specific webinar |
| `webinars.list` | `zoom.api.webinars.list` | `read` | List all webinars for the authenticated user |
| `webinars.listParticipants` | `zoom.api.webinars.listParticipants` | `read` | List participants of a past webinar |

## Auth

Auth: OAuth 2.0. Corsair prompts your tenant for credentials on first use.

## Webhooks

Handles 8 webhook events. See the reference for payloads and `webhookHooks`.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/zoom

## License

Apache-2.0
