# @corsair-dev/svix

Svix webhook delivery integration for Corsair.

## Install

```bash
pnpm add @corsair-dev/svix
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `applications.create` | `svix.api.applications.create` | `write` | Create Application |
| `applications.delete` | `svix.api.applications.delete` | `destructive` | Delete Application |
| `applications.get` | `svix.api.applications.get` | `read` | Get Application |
| `applications.list` | `svix.api.applications.list` | `read` | List Applications |
| `applications.patch` | `svix.api.applications.patch` | `write` | Patch Application |
| `applications.upsert` | `svix.api.applications.upsert` | `write` | Upsert Application |
| `attempts.expungeContent` | `svix.api.attempts.expungeContent` | `destructive` | Delete attempt response body |
| `attempts.get` | `svix.api.attempts.get` | `read` | Get Attempt |
| `attempts.listAttemptedDestinations` | `svix.api.attempts.listAttemptedDestinations` | `read` | List Attempted Destinations |
| `attempts.listAttemptedMessages` | `svix.api.attempts.listAttemptedMessages` | `read` | List Attempted Messages |
| `attempts.listByEndpoint` | `svix.api.attempts.listByEndpoint` | `read` | List Attempts By Endpoint |
| `attempts.listByMsg` | `svix.api.attempts.listByMsg` | `read` | List Attempts By Msg |
| `attempts.resend` | `svix.api.attempts.resend` | `write` | Resend Webhook |
| `endpoints.bulkReplay` | `svix.api.endpoints.bulkReplay` | `write` | Bulk Replay Messages |
| `endpoints.create` | `svix.api.endpoints.create` | `write` | Create Endpoint |
| `endpoints.delete` | `svix.api.endpoints.delete` | `destructive` | Delete Endpoint |
| `endpoints.get` | `svix.api.endpoints.get` | `read` | Get Endpoint |
| `endpoints.getAttemptStats` | `svix.api.endpoints.getAttemptStats` | `read` | Endpoint Attempt Stats |
| `endpoints.getHeaders` | `svix.api.endpoints.getHeaders` | `read` | Get Endpoint Headers |
| `endpoints.getSecret` | `svix.api.endpoints.getSecret` | `read` | Get Endpoint Secret |
| `endpoints.getStats` | `svix.api.endpoints.getStats` | `read` | Endpoint Stats |
| `endpoints.list` | `svix.api.endpoints.list` | `read` | List Endpoints |
| `endpoints.mcpEventsSubscribe` | `svix.api.endpoints.mcpEventsSubscribe` | `write` | Subscribe to MCP Events |
| `endpoints.mcpEventsUnsubscribe` | `svix.api.endpoints.mcpEventsUnsubscribe` | `destructive` | Unsubscribe from MCP Events |
| `endpoints.patch` | `svix.api.endpoints.patch` | `write` | Patch Endpoint |
| `endpoints.patchHeaders` | `svix.api.endpoints.patchHeaders` | `write` | Patch Endpoint Headers |
| `endpoints.recover` | `svix.api.endpoints.recover` | `write` | Recover Failed Webhooks |
| `endpoints.replayMissing` | `svix.api.endpoints.replayMissing` | `write` | Replay Missing Webhooks |
| `endpoints.rotateSecret` | `svix.api.endpoints.rotateSecret` | `write` | Rotate Endpoint Secret |
| `endpoints.sendExample` | `svix.api.endpoints.sendExample` | `write` | Send Event Type Example Message |
| `endpoints.setHeaders` | `svix.api.endpoints.setHeaders` | `write` | Set Endpoint Headers |
| `endpoints.transformationGet` | `svix.api.endpoints.transformationGet` | `read` | Get Endpoint Transformation |
| `endpoints.transformationPatch` | `svix.api.endpoints.transformationPatch` | `write` | Patch Endpoint Transformation |
| `endpoints.upsert` | `svix.api.endpoints.upsert` | `write` | Upsert Endpoint |
| `eventTypes.create` | `svix.api.eventTypes.create` | `write` | Create Event Type |
| `eventTypes.delete` | `svix.api.eventTypes.delete` | `destructive` | Delete Event Type |
| `eventTypes.get` | `svix.api.eventTypes.get` | `read` | Get Event Type |
| `eventTypes.importOpenapi` | `svix.api.eventTypes.importOpenapi` | `write` | Event Type Import From Openapi |
| `eventTypes.list` | `svix.api.eventTypes.list` | `read` | List Event Types |
| `eventTypes.patch` | `svix.api.eventTypes.patch` | `write` | Patch Event Type |
| `eventTypes.upsert` | `svix.api.eventTypes.upsert` | `write` | Upsert Event Type |
| `messages.bulkExpungeContent` | `svix.api.messages.bulkExpungeContent` | `destructive` | Expunge a set of message payloads |
| `messages.create` | `svix.api.messages.create` | `write` | Create Message |
| `messages.createBatch` | `svix.api.messages.createBatch` | `write` | Quickly Create a Batch of Messages |
| `messages.expungeAllContents` | `svix.api.messages.expungeAllContents` | `destructive` | Expunge all message contents for an application |
| `messages.expungeContent` | `svix.api.messages.expungeContent` | `destructive` | Expunge one message payload |
| `messages.get` | `svix.api.messages.get` | `read` | Get Message |
| `messages.list` | `svix.api.messages.list` | `read` | List Messages |
| `messages.pollerConsumerPoll` | `svix.api.messages.pollerConsumerPoll` | `write` | Poller Consumer Poll |
| `messages.pollerConsumerSeek` | `svix.api.messages.pollerConsumerSeek` | `write` | Poller Consumer Seek |
| `messages.pollerPoll` | `svix.api.messages.pollerPoll` | `read` | Poller Poll |
| `messages.precheck` | `svix.api.messages.precheck` | `write` | Create Message Precheck |
| `operationalWebhooks.create` | `svix.api.operationalWebhooks.create` | `write` | Create Operational Webhook Endpoint |
| `operationalWebhooks.delete` | `svix.api.operationalWebhooks.delete` | `destructive` | Delete Operational Webhook Endpoint |
| `operationalWebhooks.get` | `svix.api.operationalWebhooks.get` | `read` | Get Operational Webhook Endpoint |
| `operationalWebhooks.getHeaders` | `svix.api.operationalWebhooks.getHeaders` | `read` | Get Operational Webhook Endpoint Headers |
| `operationalWebhooks.getSecret` | `svix.api.operationalWebhooks.getSecret` | `read` | Get Operational Webhook Endpoint Secret |
| `operationalWebhooks.list` | `svix.api.operationalWebhooks.list` | `read` | List Operational Webhook Endpoints |
| `operationalWebhooks.rotateSecret` | `svix.api.operationalWebhooks.rotateSecret` | `write` | Rotate Operational Webhook Endpoint Secret |
| `operationalWebhooks.setHeaders` | `svix.api.operationalWebhooks.setHeaders` | `write` | Set Operational Webhook Endpoint Headers |
| `operationalWebhooks.upsert` | `svix.api.operationalWebhooks.upsert` | `write` | Upsert Operational Webhook Endpoint |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

Choose the Svix region containing your environment with `svix({ region: 'eu' })`
(the default), or use `us`, `ca`, or `au`. Requests use bearer authentication
against `https://api.<region>.svix.com`.

The 61 operations cover applications (6), endpoints (21), event types (7),
messages and pollers (11), delivery attempts (7), and operational webhook
endpoints (9). Streaming, ingest, and other administration APIs are deferred.
JSON request bodies use `body`; pagination and idempotency keys are forwarded
where supported. Writes are not automatically retried.

## Webhooks

Inbound Corsair webhook receivers are not included. Outbound and operational
webhook endpoints can be managed using the operations above.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/svix

## License

Apache-2.0
