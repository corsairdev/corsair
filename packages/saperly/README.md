# @corsair-dev/saperly

Saperly plugin for Corsair. Saperly is the phone carrier for AI agents: provision a number, attach a connection, place calls, and send SMS. Audio stays in Saperly's network.

## Install

```bash
pnpm add @corsair-dev/saperly
```

## Endpoints

Token-scoped data plane on `https://api.saperly.com`. The workspace is read from the API key.

| Operation | Method | Path | Notes |
|-----------|--------|------|-------|
| `health.check` | GET | `/health` | Unauthenticated liveness |
| `numbers.list` | GET | `/numbers` | |
| `numbers.provision` | POST | `/numbers` | Reserves prepaid balance |
| `numbers.get` | GET | `/numbers/{id}` | 404 is `NumberNotFound` |
| `numbers.release` | POST | `/numbers/{id}/release` | |
| `numbers.assignConnection` | POST | `/numbers/{id}/connection` | |
| `numbers.setWebhook` | POST | `/numbers/{id}/webhook` | Manual-mode brain URL, not event delivery |
| `numbers.setSmsSender` | POST | `/numbers/{id}/sms-sender` | 1-11 alphanumeric characters, or null |
| `numbers.setCallerId` | POST | `/numbers/{id}/caller-id` | 1-15 letters, digits, or spaces, or null |
| `connections.list` | GET | `/connections` | |
| `connections.create` | POST | `/connections` | |
| `connections.get` | GET | `/connections/{id}` | |
| `connections.update` | PATCH | `/connections/{id}` | |
| `connections.delete` | DELETE | `/connections/{id}` | |
| `messages.send` | POST | `/messages` | Body 1-1600 characters, billed per segment |
| `messages.list` | GET | `/messages` | Optional `numberId` |
| `calls.place` | POST | `/calls` | Reserves balance, settles on hangup |
| `calls.list` | GET | `/calls` | |
| `calls.get` | GET | `/calls/{id}` | |
| `calls.end` | POST | `/calls/{id}/end` | No body |
| `calls.transfer` | POST | `/calls/{id}/transfer` | E.164 or `sip:` URI |
| `calls.recording` | GET | `/calls/{id}/recording` | Returns the redirect URL |
| `calls.transcript` | GET | `/calls/{id}/transcript` | |
| `voices.list` | GET | `/voices` | Optional BCP-47 `language` prefix |
| `customVoices.list` | GET | `/custom-voices` | |
| `customVoices.create` | POST | `/custom-voices` | Multipart. Idempotency-Key required |
| `customVoices.get` | GET | `/custom-voices/{id}` | |
| `customVoices.delete` | DELETE | `/custom-voices/{id}` | |
| `languages.list` | GET | `/languages` | |
| `usage.summary` | GET | `/usage` | Optional `since` |
| `consent.list` | GET | `/consent` | |
| `consent.record` | POST | `/consent` | |
| `consent.revoke` | POST | `/consent/revoke` | |
| `consent.check` | GET | `/consent/check` | |
| `pricing.quote` | GET | `/pricing/quote` | |
| `keys.list` | GET | `/api-tokens` | Admin scope |
| `keys.mint` | POST | `/api-tokens` | Plaintext token returned once |
| `keys.revoke` | POST | `/api-tokens/{id}/revoke` | |
| `assistant.answer` | POST | `/assistant/answer` | |

List endpoints return a bare array. The spec has no cursor.

## Auth

Send `Authorization: Bearer sap_sk_live_...`. Scopes are `read`, `write`, and `admin` (1 to 3). A key may also carry a number allow-list and a spend cap.

Mutating calls accept an `Idempotency-Key` header (`idempotencyKey` on the input). Custom voice upload requires it. The same key and body replay the original result. The same key and a different body is `IdempotencyKeyMismatch` (422).

## Rate limits and errors

Errors are `{_tag, ...fields}` with a matching HTTP status. 429 carries `Retry-After` (integer seconds). This plugin makes one transport attempt, then:

- 400, 401, 402, 403, 404, 409, 422: no retry. 402 is out of funds or a spend cap. 404 is a missing resource, not an empty result.
- 429 on GET, DELETE, or a write that included `idempotencyKey`: up to 3 attempts. `Retry-After` is capped at 60 seconds.
- 429 on a write with no idempotency key: no retry.
- 5xx on GET or DELETE: 2 attempts (the initial call plus one retry). POST and PATCH are not retried. 5xx responses do not carry a usable Retry-After through the shared client.

## Billing

Prepaid balance. Calls and messages reserve funds up front and settle when they finish. A call that never connects settles at zero. Number rent is swept per billing period. New accounts get $5 of credit and the first number free for 30 days. Provision, send, and place can return 402.

## Webhooks

Saperly signs event deliveries with HMAC-SHA256 over `` `${timestamp}.${rawBody}` ``. Headers are `x-saperly-timestamp`, `x-saperly-signature` (`v1=<hex>`), and `x-saperly-delivery-id`. Set `webhookSecret` to the `whsec_` secret from workspace webhook registration.

The handler rejects a missing secret with 409 when it must verify the signature itself. A hub-verified delivery has no local signing key and is accepted without one. A bad signature is 401. `call.*` is confirmed with `GET /calls/{id}` and `message.received` with `GET /messages?numberId=` before success. The API snapshot is what comes back. The delivery body only supplies the event name and the id. Anything else is 409 so Saperly can redeliver it.

`before` hooks run for every delivery, including rejected ones. `after` hooks run only when the handler returns success, which is the first confirmed delivery. The framework passes the before hook's `passToAfter` value into `after`. A repeat of an accepted delivery returns success false, so `after` does not run again. Nothing is written to the Corsair database. Dedup is in-memory for five minutes and only when an account id is available.

## Not implemented

Slug-keyed dashboard routes (`/workspaces/{slug}/members`, invitations, audit events, workspace token admin, and workspace webhook registration) are omitted. The agent data plane resolves the workspace from the token and the same key management exists at `/api-tokens`. Webhook endpoints are registered in the dashboard or at `POST /workspaces/{slug}/webhooks`, which needs the slug.

`docs.saperly.com` describes an older `/api/v1` lines API. This plugin follows `https://saperly.com/openapi.json`.

The MCP server at `/mcp` is a separate JSON-RPC surface.

No database entities. A cached number would stay active after release, because release does not return the number row.

## Reference

Full docs: https://docs.corsair.dev/plugins/saperly

Provider docs: https://saperly.com/docs

## License

Apache-2.0
