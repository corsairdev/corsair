# @corsair-dev/supermemory

Memory for AI agents with Supermemory: add documents, files and conversations, search memories and chunks, read user profiles and profile buckets, forget memories, manage namespaces, connectors (Google Drive, Notion, OneDrive, GitHub and more) and organization settings, plus the legacy v3/v4 routes (74 operations).

## Install

```bash
pnpm add @corsair-dev/supermemory
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `connectors.create` | `supermemory.api.connectors.create` | `write` | Create connector. Connect an external source to this namespace. OAuth providers return an authorization url to send the user to; providers that authenticate with config start syncing right away. Needs the Pro plan (the free plan answers 403). |
| `connectors.delete` | `supermemory.api.connectors.delete` | `destructive` | Delete connector. Disconnect a connector and stop its webhooks. Its imported documents are deleted too unless deleteDocuments is false. |
| `connectors.get` | `supermemory.api.connectors.get` | `read` | Get connector. Read one connector. Add include=syncs to include its recent sync runs and the items that failed. include=picker needs an admin with write access, since the link changes what syncs. |
| `connectors.list` | `supermemory.api.connectors.list` | `read` | List connectors. List the connectors that sync into this namespace. |
| `connectors.listAll` | `supermemory.api.connectors.listAll` | `read` | List all connectors. List connectors across every namespace this key can read. Use it for admin views that span users or projects. |
| `connectors.sync` | `supermemory.api.connectors.sync` | `write` | Sync connector. Start a sync now. Returns 409 while a sync for this connector is already running. |
| `connectors.update` | `supermemory.api.connectors.update` | `write` | Update connector. Change what a connector syncs. A new selection replaces the old one and starts a sync. |
| `documents.add` | `supermemory.api.documents.add` | `write` | Add document. Turn text or a supported URL into searchable, evolving memory. Supply a new ID to create a document, or reuse an existing ID to append new information while preserving its history. |
| `documents.batchAdd` | `supermemory.api.documents.batchAdd` | `write` | Batch add documents. Build a knowledge base efficiently by ingesting up to 600 text or URL documents at once. Existing caller-defined IDs append new information using the same semantics as single-document ingestion. |
| `documents.delete` | `supermemory.api.documents.delete` | `destructive` | Delete documents. Permanently remove documents and their derived knowledge by document ID or caller-defined ID. Each requested ID is handled independently so successful deletions are preserved when another ID fails. Deletes the documents and the memories extracted from them; cannot be undone. |
| `documents.get` | `supermemory.api.documents.get` | `read` | Get document. Retrieve a document's canonical content, metadata, and processing state by document ID or caller-defined ID. Optionally include its source chunks, derived memories, or both in the same response. |
| `documents.memoryCounts` | `supermemory.api.documents.memoryCounts` | `read` | Count document memories. Count live memories in this namespace for up to 100 public document IDs. Missing or inaccessible documents are omitted, not reported as zero. |
| `documents.replaceWithFile` | `supermemory.api.documents.replaceWithFile` | `destructive` | Replace document with file. Replace an existing document with a new file while keeping its stable document ID. Content and caller metadata are overwritten, then the document is reprocessed asynchronously. |
| `documents.update` | `supermemory.api.documents.update` | `write` | Update document. Refresh an existing document without changing its stable ID. Supplied content replaces the canonical content and is reprocessed; omitted fields remain unchanged. |
| `documents.updateFile` | `supermemory.api.documents.updateFile` | `write` | Partially update document file. Refresh only the file-backed fields you provide. Supplying a file replaces the canonical content; omitted metadata and processing context remain unchanged. |
| `documents.uploadFile` | `supermemory.api.documents.uploadFile` | `write` | Upload file. Transform an uploaded file into searchable knowledge and learned memory. The response returns as soon as ingestion is safely queued while extraction and memory formation continue asynchronously. |
| `feedback.send` | `supermemory.api.feedback.send` | `destructive` | Send feedback. Report a bug, request a feature or flag a docs problem to the Supermemory team. Built for AI agents: send structured JSON and an engineer picks it up. Authentication is optional for requests with a usable client IP. Cross-zone Cloudflare Worker requests and requests without a client IP must provide an API key. Sends a message to Supermemory; it is not undone. |
| `graph.get` | `supermemory.api.graph.get` | `read` | Get memory graph. Page through a namespace's documents with their memories as graph nodes and edges, for example to render @supermemory/memory-graph. Pass nextCursor back as cursor until it is null. |
| `legacy.connections.configure` | `supermemory.api.legacy.connections.configure` | `write` | Legacy v3/v4 route. Configure connection. Configure resources for a connection (supported providers: GitHub for now) |
| `legacy.connections.create` | `supermemory.api.legacy.connections.create` | `write` | Legacy v3/v4 route. Create connection. Initialize connection and get authorization URL. Returns an authorization link the account owner opens to connect the app. Needs the Pro plan (the free plan answers 403). |
| `legacy.connections.delete` | `supermemory.api.legacy.connections.delete` | `destructive` | Legacy v3/v4 route. Delete connection by ID. Delete a specific connection by ID. |
| `legacy.connections.deleteByProvider` | `supermemory.api.legacy.connections.deleteByProvider` | `destructive` | Legacy v3/v4 route. Delete connection for a specific provider and container tags. |
| `legacy.connections.documents` | `supermemory.api.legacy.connections.documents` | `read` | Legacy v3/v4 route. List documents indexed for a provider and container tags. |
| `legacy.connections.get` | `supermemory.api.legacy.connections.get` | `read` | Legacy v3/v4 route. Get connection details with id. |
| `legacy.connections.getByProvider` | `supermemory.api.legacy.connections.getByProvider` | `read` | Legacy v3/v4 route. Get connection details with provider and container tags. |
| `legacy.connections.list` | `supermemory.api.legacy.connections.list` | `read` | Legacy v3/v4 route. List connections. List all connections. |
| `legacy.connections.resources` | `supermemory.api.legacy.connections.resources` | `read` | Legacy v3/v4 route. Fetch resources for a connection (supported providers: GitHub for now) |
| `legacy.connections.sync` | `supermemory.api.legacy.connections.sync` | `write` | Legacy v3/v4 route. Sync connection. Initiate a manual sync of connections. |
| `legacy.containerTags.delete` | `supermemory.api.legacy.containerTags.delete` | `destructive` | Legacy v3/v4 route. Delete container tag. Delete a container tag and all its documents and memories. Only organization owners and admins can perform this action. |
| `legacy.containerTags.get` | `supermemory.api.legacy.containerTags.get` | `read` | Legacy v3/v4 route. Get container tag settings. Get settings for a container tag. |
| `legacy.containerTags.list` | `supermemory.api.legacy.containerTags.list` | `read` | Legacy v3/v4 route. List all container tags with isNova flag. |
| `legacy.containerTags.merge` | `supermemory.api.legacy.containerTags.merge` | `destructive` | Legacy v3/v4 route. Merge container tags. Merge multiple container tags into a target tag. All documents from the source tags will be updated to reference the target tag, and the source tags will be deleted after successful merge. |
| `legacy.containerTags.mergeStatus` | `supermemory.api.legacy.containerTags.mergeStatus` | `read` | Legacy v3/v4 route. Get container tag merge status. Get queued container tag merge status. |
| `legacy.containerTags.update` | `supermemory.api.legacy.containerTags.update` | `write` | Legacy v3/v4 route. Update container tag settings. Update settings for a container tag. |
| `legacy.conversations.ingest` | `supermemory.api.legacy.conversations.ingest` | `write` | Legacy v3/v4 route. Ingest or update a conversation. |
| `legacy.documents.add` | `supermemory.api.legacy.documents.add` | `write` | Legacy v3/v4 route. Add document. Add a document with any content type (text, url, file, etc.) and metadata. |
| `legacy.documents.batchAdd` | `supermemory.api.legacy.documents.batchAdd` | `write` | Legacy v3/v4 route. Batch add documents. Add multiple documents in a single request. Each document can have any content type (text, url, file, etc.) and metadata. |
| `legacy.documents.bulkDelete` | `supermemory.api.legacy.documents.bulkDelete` | `destructive` | Legacy v3/v4 route. Bulk delete documents by IDs or container tags. |
| `legacy.documents.chunks` | `supermemory.api.legacy.documents.chunks` | `read` | Legacy v3/v4 route. Get document chunks. Get all chunks for a document, ordered by position. |
| `legacy.documents.delete` | `supermemory.api.legacy.documents.delete` | `destructive` | Legacy v3/v4 route. Delete document by ID or customId. Delete a document by ID or customId. |
| `legacy.documents.fileUrl` | `supermemory.api.legacy.documents.fileUrl` | `read` | Legacy v3/v4 route. Get presigned file URL. Get a fresh presigned URL for a document's file. Returns a time-limited URL (24h) that can be used to download the file. |
| `legacy.documents.get` | `supermemory.api.legacy.documents.get` | `read` | Legacy v3/v4 route. Get document. Get a document by ID. |
| `legacy.documents.list` | `supermemory.api.legacy.documents.list` | `read` | Legacy v3/v4 route. List documents. Retrieves a paginated list of documents with their metadata and workflow status. |
| `legacy.documents.listProcessing` | `supermemory.api.legacy.documents.listProcessing` | `read` | Legacy v3/v4 route. Get processing documents. Get documents that are currently being processed. Default view=active is the live in-flight queue. view=pending is every unfinished document with no time cutoff. view=all also includes failed documents, paginated. |
| `legacy.documents.search` | `supermemory.api.legacy.documents.search` | `read` | Legacy v3/v4 route. Search documents. Search memories with advanced filtering. |
| `legacy.documents.update` | `supermemory.api.legacy.documents.update` | `write` | Legacy v3/v4 route. Update document. Update a document with any content type (text, url, file, etc.) and metadata. |
| `legacy.documents.uploadFile` | `supermemory.api.legacy.documents.uploadFile` | `write` | Legacy v3/v4 route. Upload a file to be processed. |
| `legacy.memories.create` | `supermemory.api.legacy.memories.create` | `write` | Legacy v3/v4 route. Create memories directly, bypassing the document ingestion workflow. Generates embeddings and makes them immediately searchable. |
| `legacy.memories.forget` | `supermemory.api.legacy.memories.forget` | `destructive` | Legacy v3/v4 route. Forget a memory. Forget (soft delete) a memory entry. The memory is marked as forgotten but not permanently deleted. |
| `legacy.memories.forgetMatching` | `supermemory.api.legacy.memories.forgetMatching` | `destructive` | Legacy v3/v4 route. Forget memories matching a prompt/query. Agentic mass-forget. Given a prompt or query, a tool-calling agent searches the container's memories and soft-deletes everything matching the target. Use dryRun to preview first. |
| `legacy.memories.list` | `supermemory.api.legacy.memories.list` | `read` | Legacy v3/v4 route. List memory entries with history. List all latest memory entries from specified container tags with their update history and source documents. |
| `legacy.memories.search` | `supermemory.api.legacy.memories.search` | `read` | Legacy v3/v4 route. Search memory entries - Low latency for conversational. |
| `legacy.memories.update` | `supermemory.api.legacy.memories.update` | `write` | Legacy v3/v4 route. Update a memory by creating a new version. The original memory is preserved with isLatest=false. |
| `legacy.profile.buckets` | `supermemory.api.legacy.profile.buckets` | `read` | Legacy v3/v4 route. Get profile buckets. Returns the effective profile bucket definitions for a given container tag — org-level buckets merged with any container-tag-level additions. |
| `legacy.profile.get` | `supermemory.api.legacy.profile.get` | `read` | Legacy v3/v4 route. Get user profile with optional search results. |
| `legacy.settings.get` | `supermemory.api.legacy.settings.get` | `read` | Legacy v3/v4 route. Get settings for an organization. |
| `legacy.settings.reset` | `supermemory.api.legacy.settings.reset` | `destructive` | Legacy v3/v4 route. Reset organization content: removes documents, memories, spaces (except default project), connections, and org settings. Preserves the org, members, and billing. Deletes every document and memory in the organization; cannot be undone. |
| `legacy.settings.suggestBuckets` | `supermemory.api.legacy.settings.suggestBuckets` | `read` | Legacy v3/v4 route. Suggest profile bucket definitions based on the organization context prompt. Returns 3–6 bucket suggestions tailored to the use-case described in the prompt. |
| `legacy.settings.update` | `supermemory.api.legacy.settings.update` | `write` | Legacy v3/v4 route. Update settings for an organization. |
| `memories.forget` | `supermemory.api.memories.forget` | `destructive` | Forget memories by ID. Remove exact memories from normal recall while preserving their audit history. Each ID is handled independently and any missing or ineligible memory is reported without rolling back successful changes. Forgets the memories with these ids; cannot be undone. |
| `memories.forgetMatching` | `supermemory.api.memories.forgetMatching` | `destructive` | Forget memories semantically. Describe what should be forgotten in natural language, then preview or apply the matching set. Use dry-run results with the exact-ID endpoint when you need a reviewable, drift-free workflow. Forgets every memory the query matches; cannot be undone. |
| `memories.get` | `supermemory.api.memories.get` | `read` | Get memory. Retrieve one memory by ID. Optionally include its versions (up to three steps away, nearest first), its direct extends and derives links, up to relatedLimit each, and its source document. |
| `namespaces.delete` | `supermemory.api.namespaces.delete` | `destructive` | Delete namespace. Retire a namespace by permanently deleting its content, or preserve that knowledge by moving everything into another namespace first. Moves are queued and complete asynchronously. Deletes the namespace and everything in it unless moveTo names a namespace to move the content into; cannot be undone. |
| `namespaces.get` | `supermemory.api.namespaces.get` | `read` | Get namespace settings. Read the supporting context that helps Supermemory understand content and form better memories inside this namespace. |
| `namespaces.list` | `supermemory.api.namespaces.list` | `read` | List namespaces. Discover every namespace available to the caller, including its purpose, document volume, memory count, and lifecycle timestamps. |
| `namespaces.update` | `supermemory.api.namespaces.update` | `write` | Update namespace settings. Shape how Supermemory understands an existing namespace by updating the background context used during ingestion and memory formation. |
| `organization.get` | `supermemory.api.organization.get` | `read` | Get organization settings. Read the shared background that guides memory formation across the organization, together with the number of active namespaces. |
| `organization.update` | `supermemory.api.organization.update` | `write` | Update organization settings. Give Supermemory organization-wide background that improves how content is interpreted across every namespace. Send null to remove the existing context. |
| `profiles.buckets.delete` | `supermemory.api.profiles.buckets.delete` | `destructive` | Delete profile buckets. Remove profile categories created specifically for this namespace. Unknown names are safely ignored, while organization-wide buckets remain protected. |
| `profiles.buckets.get` | `supermemory.api.profiles.buckets.get` | `read` | Get profile buckets. Inspect the profile taxonomy active in this namespace. The response combines organization-wide buckets with namespace-owned additions as a concise name-to-description map. |
| `profiles.buckets.set` | `supermemory.api.profiles.buckets.set` | `write` | Add or update profile buckets. Teach Supermemory new ways to organize this namespace's profile, or refine how existing namespace-owned buckets are classified. Omitted buckets remain unchanged and organization-wide buckets stay protected. |
| `profiles.get` | `supermemory.api.profiles.get` | `read` | Get profile. Read a continuously maintained understanding of the subject represented by this namespace. Stable facts, evolving context, and selected custom buckets are returned together without requiring a search query. |
| `resources.list` | `supermemory.api.resources.list` | `read` | List resources. Browse documents, source chunks, or learned memories through one predictable paginated contract. Choose the collection in the path; the other collection arrays remain empty for a stable response shape. When listing documents, set include.content to include the last published extracted text. |
| `search.query` | `supermemory.api.search.query` | `read` | Search memories. Recall the most relevant learned context and source passages from a namespace. Hybrid search combines memories with document chunks by default, with optional query rewriting, reranking, and supporting context attachments. |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/supermemory

## License

Apache-2.0
