# @corsair-dev/leexi

Leexi plugin for Corsair. Leexi is an AI notetaker — transcribe, analyse,
and summarize your calls and meetings. This plugin exposes meeting events,
calls (with transcripts and topics), teams, and users from your Leexi
workspace.

## Auth setup

Leexi uses API key auth over HTTP Basic: an API Key ID plus a Key Secret,
sent as `Authorization: Basic base64(KEY_ID:KEY_SECRET)`. Generate a pair
in [Leexi → Settings → Company Settings → API
Keys](https://app.leexi.ai/settings/api_keys) (requires a Leexi admin
account), then pass both halves, or store them per tenant via Corsair's key
management (`get_api_key` / `get_key_secret`).

```ts
import { leexi } from '@corsair-dev/leexi'

const plugin = leexi({ key: process.env.LEEXI_KEY_ID, keySecret: process.env.LEEXI_KEY_SECRET })
```

Each endpoint needs a permission scope on the key (`read_calls`,
`write_calls`, `read_meeting_events`, `write_meeting_events`,
`read_teams`, `read_users`). New keys only get `read_calls` — grant the
rest explicitly in Leexi, otherwise the API returns `403`. Call listing is
also limited by the key's call access scope (whole company, a user's
access, or access rules).

## Endpoints

| Endpoint                     | Risk        | Description                                                              |
| ---------------------------- | ----------- | ------------------------------------------------------------------------ |
| `meetingEvents.list`         | read        | List meeting events with pagination and filters                          |
| `meetingEvents.get`          | read        | Get a meeting event by UUID, including its integration user and calls    |
| `meetingEvents.create`       | write       | Schedule a meeting event with timing, participants, recording preference |
| `meetingEvents.delete`       | destructive | Permanently delete a meeting event by UUID (irreversible)                |
| `calls.list`                 | read        | List calls with pagination and filters                                   |
| `calls.get`                  | read        | Get a call by UUID, including topics and word-level transcript           |
| `calls.requestPresignedUrl`  | write       | Presigned S3 URL for uploading a recording (expires after 3 days)        |
| `teams.list`                 | read        | List teams with pagination                                               |
| `users.list`                 | read        | List users with pagination                                               |

Upload flow: call `calls.requestPresignedUrl` (default extension `.mp4`),
`PUT` the recording to the returned URL with the returned headers
(single-part upload), then create the call from the uploaded file. List
responses are paginated (`page`, `items` 1–100, `count`, `pages`).
AI-generated content (summaries, chapters) may lag behind newly created
calls. The API rate limit is 50 requests/minute (10/minute for call
creation).

## Entities

Nothing is persisted locally — meeting events, calls, teams, and users are
always queried live from the Leexi API.

## Privacy

Audit logs never carry secrets or PII: meeting URLs are logged as hostname
only (`meetingEvents.create`), and customer email/phone search filters are
logged as counts only (`calls.list`).

## API reference

[docs.public-api.leexi.ai](https://docs.public-api.leexi.ai/reference/public-api) —
base URL `https://public-api.leexi.ai/v1`, HTTP Basic auth.
