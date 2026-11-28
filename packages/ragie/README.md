# @corsair-dev/ragie

Ragie RAG plugin for Corsair. Uploads documents, runs retrieval and deep-search responses, and manages connections and webhook endpoint registrations; webhook deliveries are not handled.

## Install

```bash
pnpm add @corsair-dev/ragie
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `authenticators.create` | `ragie.api.authenticators.create` | `write` | Register your own OAuth app (client id and secret) for a provider's connections |
| `authenticators.createConnection` | `ragie.api.authenticators.createConnection` | `destructive` | Create a connection through your own OAuth app; it starts syncing and processing pages, which is billed |
| `authenticators.delete` | `ragie.api.authenticators.delete` | `destructive` | Delete an OAuth app registration |
| `authenticators.list` | `ragie.api.authenticators.list` | `read` | List your own OAuth apps registered for connections, paged by cursor |
| `connections.create` | `ragie.api.connections.create` | `destructive` | Create a non-OAuth connector such as S3, GCS, Freshdesk, Zendesk, Intercom or a web crawler, with its settings and credentials |
| `connections.createOAuthRedirectUrl` | `ragie.api.connections.createOAuthRedirectUrl` | `write` | Start an OAuth connector flow (Google Drive, Notion and the like) and get the short-lived redirect URL to send the user to |
| `connections.delete` | `ragie.api.connections.delete` | `destructive` | Delete a connection. With keep_files false its documents are deleted too and cannot be recovered; with true the documents survive unlinked |
| `connections.get` | `ragie.api.connections.get` | `read` | Read one connection, including its sync state and limits |
| `connections.getStats` | `ragie.api.connections.getStats` | `read` | Read a connection's document and page counts |
| `connections.list` | `ragie.api.connections.list` | `read` | List managed data connectors, paged by cursor |
| `connections.listSourceTypes` | `ragie.api.connections.listSourceTypes` | `read` | List the connector types Ragie supports, with the metadata each needs |
| `connections.setEnabled` | `ragie.api.connections.setEnabled` | `write` | Enable or disable a connection syncing |
| `connections.setLimits` | `ragie.api.connections.setLimits` | `write` | Set the monthly page limit on a connection; null removes the limit |
| `connections.sync` | `ragie.api.connections.sync` | `destructive` | Schedule a connector to sync as soon as possible; the sync itself runs in the background |
| `connections.update` | `ragie.api.connections.update` | `write` | Update a connection metadata, mode, partition strategy or page limit |
| `documents.create` | `ragie.api.documents.create` | `destructive` | Upload a file for ingestion. Processing runs in the background: poll documents.get until status is ready or failed |
| `documents.createFromUrl` | `ragie.api.documents.createFromUrl` | `destructive` | Fetch a URL and ingest its content. Processing runs in the background: poll documents.get until status is ready or failed |
| `documents.createRaw` | `ragie.api.documents.createRaw` | `destructive` | Ingest raw text. Processing runs in the background: poll documents.get until status is ready or failed |
| `documents.delete` | `ragie.api.documents.delete` | `destructive` | Delete a document and its chunks. There is no restore call |
| `documents.get` | `ragie.api.documents.get` | `read` | Read one document, including its processing status: pending, partitioning, partitioned, refined, chunked, indexed, summary_indexed, keyword_indexed, ready or failed |
| `documents.getChunk` | `ragie.api.documents.getChunk` | `read` | Read one chunk of a document: its text, metadata and links |
| `documents.getChunkContent` | `ragie.api.documents.getChunkContent` | `read` | Download one chunk as text, audio, video or image (media_type), returned as a file |
| `documents.getChunks` | `ragie.api.documents.getChunks` | `read` | List the chunks a document was split into, paged by cursor |
| `documents.getContent` | `ragie.api.documents.getContent` | `read` | Read a document processed content as JSON. Audio and video media-type streaming is not wrapped |
| `documents.getSource` | `ragie.api.documents.getSource` | `read` | Download the original file a document was made from |
| `documents.getSummary` | `ragie.api.documents.getSummary` | `read` | Read the LLM summary of a document; unavailable for spreadsheets, JSON and documents over a million tokens |
| `documents.list` | `ragie.api.documents.list` | `read` | List documents with their processing status, paged by cursor; filter by a JSON metadata filter or partition |
| `documents.listElements` | `ragie.api.documents.listElements` | `read` | List the structural elements Ragie parsed from a document (titles, text, tables, images), paged by cursor |
| `documents.listEntities` | `ragie.api.documents.listEntities` | `read` | List the entities instructions extracted from one document, paged by cursor |
| `documents.patchMetadata` | `ragie.api.documents.patchMetadata` | `write` | Merge metadata onto a document; a null value deletes that key |
| `documents.updateFile` | `ragie.api.documents.updateFile` | `destructive` | Replace a document with a new file. Reprocessing runs in the background: poll documents.get until status is ready or failed |
| `documents.updateFromUrl` | `ragie.api.documents.updateFromUrl` | `destructive` | Replace a document with content fetched from a URL. Reprocessing runs in the background: poll documents.get until status is ready or failed |
| `documents.updateRaw` | `ragie.api.documents.updateRaw` | `destructive` | Replace a document with new raw text. Reprocessing runs in the background: poll documents.get until status is ready or failed |
| `elements.get` | `ragie.api.elements.get` | `read` | Read one parsed document element |
| `instructions.create` | `ragie.api.instructions.create` | `destructive` | Create an entity extraction instruction; it runs on matching documents and their extraction is billed |
| `instructions.delete` | `ragie.api.instructions.delete` | `destructive` | Delete an instruction and the entities it extracted |
| `instructions.list` | `ragie.api.instructions.list` | `read` | List entity extraction instructions |
| `instructions.listEntities` | `ragie.api.instructions.listEntities` | `read` | List the entities one instruction extracted, paged by cursor |
| `instructions.listExtractionLogs` | `ragie.api.instructions.listExtractionLogs` | `read` | List extraction attempts for an instruction with status and reasons, filterable by document, status and date |
| `instructions.update` | `ragie.api.instructions.update` | `write` | Change an instruction's prompt, schema, filter or active flag |
| `partitions.create` | `ragie.api.partitions.create` | `write` | Create a partition with optional page and media limits and a metadata schema |
| `partitions.delete` | `ragie.api.partitions.delete` | `destructive` | Delete a partition and every document in it |
| `partitions.get` | `ragie.api.partitions.get` | `read` | Read a partition with its limits and usage stats |
| `partitions.list` | `ragie.api.partitions.list` | `read` | List partitions with their limits, paged by cursor |
| `partitions.setLimits` | `ragie.api.partitions.setLimits` | `write` | Set a partition's monthly and maximum page and media limits |
| `partitions.update` | `ragie.api.partitions.update` | `write` | Change a partition's description, context awareness or metadata schema |
| `responses.create` | `ragie.api.responses.create` | `destructive` | Generate a grounded answer with the deep-search model. Bills LLM usage; poll responses.get until status is completed or failed |
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

Handles 8 webhook events. See the reference for payloads and `webhookHooks`.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/ragie

## License

Apache-2.0
