# @corsair-dev/happyscribe

Happy Scribe plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/happyscribe
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `companies.get` | `happyscribe.api.companies.get` | `read` | Read one discovered company with its enriched firmographics (Intelligence API) |
| `companies.list` | `happyscribe.api.companies.list` | `read` | List companies discovered from meeting transcripts (Intelligence API; 404 when the organization is not enrolled) |
| `exports.create` | `happyscribe.api.exports.create` | `write` | Start exporting one or more transcriptions to a format (txt, srt, vtt, docx, pdf, json). Follow with exports.get until state is ready |
| `exports.get` | `happyscribe.api.exports.get` | `read` | Where an export stands; once state is ready the answer carries its download_link |
| `glossaries.list` | `happyscribe.api.glossaries.list` | `read` | List the glossaries an organization can attach to human orders |
| `meetings.create` | `happyscribe.api.meetings.create` | `write` | Send the HappyScribe notetaker bot to a meeting URL at join_at; it records and transcribes. Follow with meetings.get until status is completed |
| `meetings.get` | `happyscribe.api.meetings.get` | `read` | Read one meeting: notetaker status (queued, joining, in_call, processing, completed, failed) and settings |
| `memberships.add` | `happyscribe.api.memberships.add` | `write` | Add a user to an organization as admin or member, by email |
| `memberships.list` | `happyscribe.api.memberships.list` | `read` | List the members of an organization with their roles |
| `memberships.remove` | `happyscribe.api.memberships.remove` | `destructive` | Remove a user from the organization; their existing transcripts stay |
| `memberships.updateRole` | `happyscribe.api.memberships.updateRole` | `write` | Change a member's role between admin and member |
| `orders.confirm` | `happyscribe.api.orders.confirm` | `write` | Confirm an incomplete order, which charges the organization and starts the human work; irreversible |
| `orders.create` | `happyscribe.api.orders.create` | `write` | Create a human transcription or subtitling order for media at a URL. It stays incomplete and unpaid until orders.confirm or an explicit confirm flag |
| `orders.createTranslation` | `happyscribe.api.orders.createTranslation` | `write` | Create a human translation order for an existing transcription; incomplete and unpaid until confirmed |
| `orders.get` | `happyscribe.api.orders.get` | `read` | Read one human-service order: state, operations, languages and pricing |
| `organizations.list` | `happyscribe.api.organizations.list` | `read` | List the organizations the API token belongs to, with the caller role and human-service availability |
| `people.get` | `happyscribe.api.people.get` | `read` | Read one discovered contact with company linkage (Intelligence API) |
| `people.list` | `happyscribe.api.people.list` | `read` | List contacts discovered from meeting transcripts (Intelligence API; 404 when not enrolled) |
| `styleGuides.list` | `happyscribe.api.styleGuides.list` | `read` | List the style guides an organization can attach to human orders |
| `transcriptions.create` | `happyscribe.api.transcriptions.create` | `write` | Start transcribing media from a public URL; spends transcription credits. Follow with transcriptions.getDetails until state is automatic_done |
| `transcriptions.delete` | `happyscribe.api.transcriptions.delete` | `destructive` | Permanently delete a transcription and its media; there is no restore |
| `transcriptions.getDetails` | `happyscribe.api.transcriptions.getDetails` | `read` | Read one transcription: processing state, language, duration, cost, media URLs and download links |
| `transcriptions.getSummary` | `happyscribe.api.transcriptions.getSummary` | `read` | Read the AI-generated meeting summary of a notetaker recording |
| `transcriptions.list` | `happyscribe.api.transcriptions.list` | `read` | List transcriptions in an organization with paging, folder filter and, for Intelligence-enrolled organizations, person and company filters |
| `transcriptions.updateDetails` | `happyscribe.api.transcriptions.updateDetails` | `write` | Change a transcription: move it between organizations or toggle its public sharing link |
| `translations.createTask` | `happyscribe.api.translations.createTask` | `write` | Start machine-translating a transcript into a target language; spends credits. Follow with translations.getTask until state is done |
| `translations.getTask` | `happyscribe.api.translations.getTask` | `read` | Where a translation task stands: progress percent, failure reason and the translated transcription id once done |
| `uploads.getSignedUrl` | `happyscribe.api.uploads.getSignedUrl` | `read` | Get a pre-signed S3 URL for a filename; upload the file bytes there yourself, then create a transcription from it |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

Handles 7 webhook events. See the reference for payloads and `webhookHooks`.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/happyscribe

## License

Apache-2.0
