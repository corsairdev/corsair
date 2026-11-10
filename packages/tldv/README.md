# @corsair-dev/tldv

Tldv plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/tldv
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `folders.list` | `tldv.api.folders.list` | `read` | Search the folders a user can see, with their meeting ids |
| `meetings.get` | `tldv.api.meetings.get` | `read` | Get one meeting by id, including the phone number and metadata an import attached |
| `meetings.import` | `tldv.api.meetings.import` | `write` | Import a meeting from a public media URL, which starts a processing job and spends recording minutes |
| `meetings.list` | `tldv.api.meetings.list` | `read` | List meetings with paging, date bounds and folder or type filters |
| `meetings.notes` | `tldv.api.meetings.notes` | `read` | Get the AI notes and topics generated for one meeting |
| `meetings.transcript` | `tldv.api.meetings.transcript` | `read` | Get the transcript of one meeting, sentence by sentence |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

Handles 2 webhook events. See the reference for payloads and `webhookHooks`.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/tldv

## License

Apache-2.0
