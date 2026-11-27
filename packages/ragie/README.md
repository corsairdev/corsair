# @corsair-dev/ragie

Ragie RAG plugin for Corsair. Uploads documents, runs retrieval and deep-search responses, and manages connections and webhook endpoint registrations; webhook deliveries are not handled.

## Install

```bash
pnpm add @corsair-dev/ragie
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `connections.create` | `ragie.api.connections.create` | `write` | Create a non-OAuth connector such as S3, GCS, Freshdesk, Zendesk, Intercom or a web crawler, with its settings and credentials |
| `connections.createOAuthRedirectUrl` | `ragie.api.connections.createOAuthRedirectUrl` | `write` | Start an OAuth connector flow (Google Drive, Notion and the like) and get the short-lived redirect URL to send the user to |
| `connections.delete` | `ragie.api.connections.delete` | `destructive` | Delete a connection. With keep_files false its documents are deleted too and cannot be recovered; with true the documents survive unlinked |
| `connections.get` | `ragie.api.connections.get` | `read` | Read one connection, including its sync state and limits |
| `connections.list` | `ragie.api.connections.list` | `read` | List managed data connectors, paged by cursor |
| `connections.listSourceTypes` | `ragie.api.connections.listSourceTypes` | `read` | List the connector types Ragie supports, with the metadata each needs |
| `connections.setEnabled` | `ragie.api.connections.setEnabled` | `write` | Enable or disable a connection syncing |
| `connections.setLimits` | `ragie.api.connections.setLimits` | `write` | Set the monthly page limit on a connection; null removes the limit |
| `connections.sync` | `ragie.api.connections.sync` | `write` | Schedule a connector to sync as soon as possible; the sync itself runs in the background |
| `connections.update` | `ragie.api.connections.update` | `write` | Update a connection metadata, mode, partition strategy or page limit |
| `documents.create` | `ragie.api.documents.create` | `write` | Upload a file for ingestion. Processing runs in the background: poll documents.get until status is ready or failed |
| `documents.createFromUrl` | `ragie.api.documents.createFromUrl` | `write` | Fetch a URL and ingest its content. Processing runs in the background: poll documents.get until status is ready or failed |
| `documents.createRaw` | `ragie.api.documents.createRaw` | `write` | Ingest raw text. Processing runs in the background: poll documents.get until status is ready or failed |
| `documents.delete` | `ragie.api.documents.delete` | `destructive` | Delete a document and its chunks. There is no restore call |
| `documents.get` | `ragie.api.documents.get` | `read` | Read one document, including its processing status: pending, partitioning, partitioned, refined, chunked, indexed, summary_indexed, keyword_indexed, ready or failed |
| `documents.getChunks` | `ragie.api.documents.getChunks` | `read` | List the chunks a document was split into, paged by cursor |
| `documents.getContent` | `ragie.api.documents.getContent` | `read` | Read a document processed content as JSON. Audio and video media-type streaming is not wrapped |
| `documents.getSummary` | `ragie.api.documents.getSummary` | `read` | Read the LLM summary of a document; unavailable for spreadsheets, JSON and documents over a million tokens |
| `documents.list` | `ragie.api.documents.list` | `read` | List documents with their processing status, paged by cursor; filter by a JSON metadata filter or partition |
| `documents.patchMetadata` | `ragie.api.documents.patchMetadata` | `write` | Merge metadata onto a document; a null value deletes that key |
| `documents.updateFile` | `ragie.api.documents.updateFile` | `write` | Replace a document with a new file. Reprocessing runs in the background: poll documents.get until status is ready or failed |
| `documents.updateFromUrl` | `ragie.api.documents.updateFromUrl` | `write` | Replace a document with content fetched from a URL. Reprocessing runs in the background: poll documents.get until status is ready or failed |
| `documents.updateRaw` | `ragie.api.documents.updateRaw` | `write` | Replace a document with new raw text. Reprocessing runs in the background: poll documents.get until status is ready or failed |
| `responses.create` | `ragie.api.responses.create` | `write` | Generate a grounded answer with the deep-search model. Bills LLM usage; poll responses.get until status is completed, failed or cancelled |
| `responses.get` | `ragie.api.responses.get` | `read` | Read a generated response, including its status and the final answer |
| `retrievals.retrieve` | `ragie.api.retrievals.retrieve` | `read` | Search ingested documents and return scored chunks, optionally reranked and filtered by metadata operators |
| `webhookEndpoints.create` | `ragie.api.webhookEndpoints.create` | `write` | Register a webhook endpoint. The answer carries its signing secret, which is shown only once per endpoint |
| `webhookEndpoints.delete` | `ragie.api.webhookEndpoints.delete` | `destructive` | Delete a webhook endpoint registration; its signing secret stops working |
| `webhookEndpoints.get` | `ragie.api.webhookEndpoints.get` | `read` | Read one webhook endpoint registration |
| `webhookEndpoints.list` | `ragie.api.webhookEndpoints.list` | `read` | List the webhook endpoints registered to receive tenant events, paged by cursor. Deliveries are not handled by this plugin |
| `webhookEndpoints.update` | `ragie.api.webhookEndpoints.update` | `write` | Update a webhook endpoint name, URL, partition pattern or active flag |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/ragie

## License

Apache-2.0
