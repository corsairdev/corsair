// Generated with endpoints/operation-types.ts from Supermemory's OpenAPI spec:
// one entry per operation in supermemory-manifest.json. Risk levels follow
// .github/PLUGIN_PR_RULES.md (R8).
import type {
	RequiredPluginEndpointMeta,
	RequiredPluginEndpointSchemas,
} from 'corsair/core';
import { supermemorySchemaEntry } from './openapi-schema';
import { createSupermemoryOperation as op } from './operations';

export const supermemoryEndpointsNested = {
	connectors: {
		create: op('connectors.create'),
		delete: op('connectors.delete'),
		get: op('connectors.get'),
		list: op('connectors.list'),
		listAll: op('connectors.listAll'),
		sync: op('connectors.sync'),
		update: op('connectors.update'),
	},
	documents: {
		add: op('documents.add'),
		batchAdd: op('documents.batchAdd'),
		delete: op('documents.delete'),
		get: op('documents.get'),
		memoryCounts: op('documents.memoryCounts'),
		replaceWithFile: op('documents.replaceWithFile'),
		update: op('documents.update'),
		updateFile: op('documents.updateFile'),
		uploadFile: op('documents.uploadFile'),
	},
	feedback: {
		send: op('feedback.send'),
	},
	graph: {
		get: op('graph.get'),
	},
	legacy: {
		connections: {
			configure: op('legacy.connections.configure'),
			create: op('legacy.connections.create'),
			delete: op('legacy.connections.delete'),
			deleteByProvider: op('legacy.connections.deleteByProvider'),
			documents: op('legacy.connections.documents'),
			get: op('legacy.connections.get'),
			getByProvider: op('legacy.connections.getByProvider'),
			list: op('legacy.connections.list'),
			resources: op('legacy.connections.resources'),
			sync: op('legacy.connections.sync'),
		},
		containerTags: {
			delete: op('legacy.containerTags.delete'),
			get: op('legacy.containerTags.get'),
			list: op('legacy.containerTags.list'),
			merge: op('legacy.containerTags.merge'),
			mergeStatus: op('legacy.containerTags.mergeStatus'),
			update: op('legacy.containerTags.update'),
		},
		conversations: {
			ingest: op('legacy.conversations.ingest'),
		},
		documents: {
			add: op('legacy.documents.add'),
			batchAdd: op('legacy.documents.batchAdd'),
			bulkDelete: op('legacy.documents.bulkDelete'),
			chunks: op('legacy.documents.chunks'),
			delete: op('legacy.documents.delete'),
			fileUrl: op('legacy.documents.fileUrl'),
			get: op('legacy.documents.get'),
			list: op('legacy.documents.list'),
			listProcessing: op('legacy.documents.listProcessing'),
			search: op('legacy.documents.search'),
			update: op('legacy.documents.update'),
			uploadFile: op('legacy.documents.uploadFile'),
		},
		memories: {
			create: op('legacy.memories.create'),
			forget: op('legacy.memories.forget'),
			forgetMatching: op('legacy.memories.forgetMatching'),
			list: op('legacy.memories.list'),
			search: op('legacy.memories.search'),
			update: op('legacy.memories.update'),
		},
		profile: {
			buckets: op('legacy.profile.buckets'),
			get: op('legacy.profile.get'),
		},
		settings: {
			get: op('legacy.settings.get'),
			reset: op('legacy.settings.reset'),
			suggestBuckets: op('legacy.settings.suggestBuckets'),
			update: op('legacy.settings.update'),
		},
	},
	memories: {
		forget: op('memories.forget'),
		forgetMatching: op('memories.forgetMatching'),
		get: op('memories.get'),
	},
	namespaces: {
		delete: op('namespaces.delete'),
		get: op('namespaces.get'),
		list: op('namespaces.list'),
		update: op('namespaces.update'),
	},
	organization: {
		get: op('organization.get'),
		update: op('organization.update'),
	},
	profiles: {
		buckets: {
			delete: op('profiles.buckets.delete'),
			get: op('profiles.buckets.get'),
			set: op('profiles.buckets.set'),
		},
		get: op('profiles.get'),
	},
	resources: {
		list: op('resources.list'),
	},
	search: {
		query: op('search.query'),
	},
} as const;

export const supermemoryEndpointSchemas = {
	'connectors.create': supermemorySchemaEntry('connectors.create'),
	'connectors.delete': supermemorySchemaEntry('connectors.delete'),
	'connectors.get': supermemorySchemaEntry('connectors.get'),
	'connectors.list': supermemorySchemaEntry('connectors.list'),
	'connectors.listAll': supermemorySchemaEntry('connectors.listAll'),
	'connectors.sync': supermemorySchemaEntry('connectors.sync'),
	'connectors.update': supermemorySchemaEntry('connectors.update'),
	'documents.add': supermemorySchemaEntry('documents.add'),
	'documents.batchAdd': supermemorySchemaEntry('documents.batchAdd'),
	'documents.delete': supermemorySchemaEntry('documents.delete'),
	'documents.get': supermemorySchemaEntry('documents.get'),
	'documents.memoryCounts': supermemorySchemaEntry('documents.memoryCounts'),
	'documents.replaceWithFile': supermemorySchemaEntry(
		'documents.replaceWithFile',
	),
	'documents.update': supermemorySchemaEntry('documents.update'),
	'documents.updateFile': supermemorySchemaEntry('documents.updateFile'),
	'documents.uploadFile': supermemorySchemaEntry('documents.uploadFile'),
	'feedback.send': supermemorySchemaEntry('feedback.send'),
	'graph.get': supermemorySchemaEntry('graph.get'),
	'legacy.connections.configure': supermemorySchemaEntry(
		'legacy.connections.configure',
	),
	'legacy.connections.create': supermemorySchemaEntry(
		'legacy.connections.create',
	),
	'legacy.connections.delete': supermemorySchemaEntry(
		'legacy.connections.delete',
	),
	'legacy.connections.deleteByProvider': supermemorySchemaEntry(
		'legacy.connections.deleteByProvider',
	),
	'legacy.connections.documents': supermemorySchemaEntry(
		'legacy.connections.documents',
	),
	'legacy.connections.get': supermemorySchemaEntry('legacy.connections.get'),
	'legacy.connections.getByProvider': supermemorySchemaEntry(
		'legacy.connections.getByProvider',
	),
	'legacy.connections.list': supermemorySchemaEntry('legacy.connections.list'),
	'legacy.connections.resources': supermemorySchemaEntry(
		'legacy.connections.resources',
	),
	'legacy.connections.sync': supermemorySchemaEntry('legacy.connections.sync'),
	'legacy.containerTags.delete': supermemorySchemaEntry(
		'legacy.containerTags.delete',
	),
	'legacy.containerTags.get': supermemorySchemaEntry(
		'legacy.containerTags.get',
	),
	'legacy.containerTags.list': supermemorySchemaEntry(
		'legacy.containerTags.list',
	),
	'legacy.containerTags.merge': supermemorySchemaEntry(
		'legacy.containerTags.merge',
	),
	'legacy.containerTags.mergeStatus': supermemorySchemaEntry(
		'legacy.containerTags.mergeStatus',
	),
	'legacy.containerTags.update': supermemorySchemaEntry(
		'legacy.containerTags.update',
	),
	'legacy.conversations.ingest': supermemorySchemaEntry(
		'legacy.conversations.ingest',
	),
	'legacy.documents.add': supermemorySchemaEntry('legacy.documents.add'),
	'legacy.documents.batchAdd': supermemorySchemaEntry(
		'legacy.documents.batchAdd',
	),
	'legacy.documents.bulkDelete': supermemorySchemaEntry(
		'legacy.documents.bulkDelete',
	),
	'legacy.documents.chunks': supermemorySchemaEntry('legacy.documents.chunks'),
	'legacy.documents.delete': supermemorySchemaEntry('legacy.documents.delete'),
	'legacy.documents.fileUrl': supermemorySchemaEntry(
		'legacy.documents.fileUrl',
	),
	'legacy.documents.get': supermemorySchemaEntry('legacy.documents.get'),
	'legacy.documents.list': supermemorySchemaEntry('legacy.documents.list'),
	'legacy.documents.listProcessing': supermemorySchemaEntry(
		'legacy.documents.listProcessing',
	),
	'legacy.documents.search': supermemorySchemaEntry('legacy.documents.search'),
	'legacy.documents.update': supermemorySchemaEntry('legacy.documents.update'),
	'legacy.documents.uploadFile': supermemorySchemaEntry(
		'legacy.documents.uploadFile',
	),
	'legacy.memories.create': supermemorySchemaEntry('legacy.memories.create'),
	'legacy.memories.forget': supermemorySchemaEntry('legacy.memories.forget'),
	'legacy.memories.forgetMatching': supermemorySchemaEntry(
		'legacy.memories.forgetMatching',
	),
	'legacy.memories.list': supermemorySchemaEntry('legacy.memories.list'),
	'legacy.memories.search': supermemorySchemaEntry('legacy.memories.search'),
	'legacy.memories.update': supermemorySchemaEntry('legacy.memories.update'),
	'legacy.profile.buckets': supermemorySchemaEntry('legacy.profile.buckets'),
	'legacy.profile.get': supermemorySchemaEntry('legacy.profile.get'),
	'legacy.settings.get': supermemorySchemaEntry('legacy.settings.get'),
	'legacy.settings.reset': supermemorySchemaEntry('legacy.settings.reset'),
	'legacy.settings.suggestBuckets': supermemorySchemaEntry(
		'legacy.settings.suggestBuckets',
	),
	'legacy.settings.update': supermemorySchemaEntry('legacy.settings.update'),
	'memories.forget': supermemorySchemaEntry('memories.forget'),
	'memories.forgetMatching': supermemorySchemaEntry('memories.forgetMatching'),
	'memories.get': supermemorySchemaEntry('memories.get'),
	'namespaces.delete': supermemorySchemaEntry('namespaces.delete'),
	'namespaces.get': supermemorySchemaEntry('namespaces.get'),
	'namespaces.list': supermemorySchemaEntry('namespaces.list'),
	'namespaces.update': supermemorySchemaEntry('namespaces.update'),
	'organization.get': supermemorySchemaEntry('organization.get'),
	'organization.update': supermemorySchemaEntry('organization.update'),
	'profiles.buckets.delete': supermemorySchemaEntry('profiles.buckets.delete'),
	'profiles.buckets.get': supermemorySchemaEntry('profiles.buckets.get'),
	'profiles.buckets.set': supermemorySchemaEntry('profiles.buckets.set'),
	'profiles.get': supermemorySchemaEntry('profiles.get'),
	'resources.list': supermemorySchemaEntry('resources.list'),
	'search.query': supermemorySchemaEntry('search.query'),
} satisfies RequiredPluginEndpointSchemas<typeof supermemoryEndpointsNested>;

export const supermemoryEndpointMeta = {
	'connectors.create': {
		riskLevel: 'write',
		description:
			'Create connector. Connect an external source to this namespace. OAuth providers return an authorization url to send the user to; providers that authenticate with config start syncing right away. Needs the Pro plan (the free plan answers 403).',
	},
	'connectors.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete connector. Disconnect a connector and stop its webhooks. Its imported documents are deleted too unless deleteDocuments is false.',
	},
	'connectors.get': {
		riskLevel: 'read',
		description:
			'Get connector. Read one connector. Add include=syncs to include its recent sync runs and the items that failed. include=picker needs an admin with write access, since the link changes what syncs.',
	},
	'connectors.list': {
		riskLevel: 'read',
		description:
			'List connectors. List the connectors that sync into this namespace.',
	},
	'connectors.listAll': {
		riskLevel: 'read',
		description:
			'List all connectors. List connectors across every namespace this key can read. Use it for admin views that span users or projects.',
	},
	'connectors.sync': {
		riskLevel: 'write',
		description:
			'Sync connector. Start a sync now. Returns 409 while a sync for this connector is already running.',
	},
	'connectors.update': {
		riskLevel: 'write',
		description:
			'Update connector. Change what a connector syncs. A new selection replaces the old one and starts a sync.',
	},
	'documents.add': {
		riskLevel: 'write',
		description:
			'Add document. Turn text or a supported URL into searchable, evolving memory. Supply a new ID to create a document, or reuse an existing ID to append new information while preserving its history.',
	},
	'documents.batchAdd': {
		riskLevel: 'write',
		description:
			'Batch add documents. Build a knowledge base efficiently by ingesting up to 600 text or URL documents at once. Existing caller-defined IDs append new information using the same semantics as single-document ingestion.',
	},
	'documents.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete documents. Permanently remove documents and their derived knowledge by document ID or caller-defined ID. Each requested ID is handled independently so successful deletions are preserved when another ID fails. Deletes the documents and the memories extracted from them; cannot be undone.',
	},
	'documents.get': {
		riskLevel: 'read',
		description:
			"Get document. Retrieve a document's canonical content, metadata, and processing state by document ID or caller-defined ID. Optionally include its source chunks, derived memories, or both in the same response.",
	},
	'documents.memoryCounts': {
		riskLevel: 'read',
		description:
			'Count document memories. Count live memories in this namespace for up to 100 public document IDs. Missing or inaccessible documents are omitted, not reported as zero.',
	},
	'documents.replaceWithFile': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Replace document with file. Replace an existing document with a new file while keeping its stable document ID. Content and caller metadata are overwritten, then the document is reprocessed asynchronously.',
	},
	'documents.update': {
		riskLevel: 'write',
		description:
			'Update document. Refresh an existing document without changing its stable ID. Supplied content replaces the canonical content and is reprocessed; omitted fields remain unchanged.',
	},
	'documents.updateFile': {
		riskLevel: 'write',
		description:
			'Partially update document file. Refresh only the file-backed fields you provide. Supplying a file replaces the canonical content; omitted metadata and processing context remain unchanged.',
	},
	'documents.uploadFile': {
		riskLevel: 'write',
		description:
			'Upload file. Transform an uploaded file into searchable knowledge and learned memory. The response returns as soon as ingestion is safely queued while extraction and memory formation continue asynchronously.',
	},
	'feedback.send': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Send feedback. Report a bug, request a feature or flag a docs problem to the Supermemory team. Built for AI agents: send structured JSON and an engineer picks it up. Authentication is optional for requests with a usable client IP. Cross-zone Cloudflare Worker requests and requests without a client IP must provide an API key. Sends a message to Supermemory; it is not undone.',
	},
	'graph.get': {
		riskLevel: 'read',
		description:
			"Get memory graph. Page through a namespace's documents with their memories as graph nodes and edges, for example to render @supermemory/memory-graph. Pass nextCursor back as cursor until it is null.",
	},
	'legacy.connections.configure': {
		riskLevel: 'write',
		description:
			'Legacy v3/v4 route. Configure connection. Configure resources for a connection (supported providers: GitHub for now)',
	},
	'legacy.connections.create': {
		riskLevel: 'write',
		description:
			'Legacy v3/v4 route. Create connection. Initialize connection and get authorization URL. Returns an authorization link the account owner opens to connect the app. Needs the Pro plan (the free plan answers 403).',
	},
	'legacy.connections.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Legacy v3/v4 route. Delete connection by ID. Delete a specific connection by ID.',
	},
	'legacy.connections.deleteByProvider': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Legacy v3/v4 route. Delete connection for a specific provider and container tags.',
	},
	'legacy.connections.documents': {
		riskLevel: 'read',
		description:
			'Legacy v3/v4 route. List documents indexed for a provider and container tags.',
	},
	'legacy.connections.get': {
		riskLevel: 'read',
		description: 'Legacy v3/v4 route. Get connection details with id.',
	},
	'legacy.connections.getByProvider': {
		riskLevel: 'read',
		description:
			'Legacy v3/v4 route. Get connection details with provider and container tags.',
	},
	'legacy.connections.list': {
		riskLevel: 'read',
		description: 'Legacy v3/v4 route. List connections. List all connections.',
	},
	'legacy.connections.resources': {
		riskLevel: 'read',
		description:
			'Legacy v3/v4 route. Fetch resources for a connection (supported providers: GitHub for now)',
	},
	'legacy.connections.sync': {
		riskLevel: 'write',
		description:
			'Legacy v3/v4 route. Sync connection. Initiate a manual sync of connections.',
	},
	'legacy.containerTags.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Legacy v3/v4 route. Delete container tag. Delete a container tag and all its documents and memories. Only organization owners and admins can perform this action.',
	},
	'legacy.containerTags.get': {
		riskLevel: 'read',
		description:
			'Legacy v3/v4 route. Get container tag settings. Get settings for a container tag.',
	},
	'legacy.containerTags.list': {
		riskLevel: 'read',
		description:
			'Legacy v3/v4 route. List all container tags with isNova flag.',
	},
	'legacy.containerTags.merge': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Legacy v3/v4 route. Merge container tags. Merge multiple container tags into a target tag. All documents from the source tags will be updated to reference the target tag, and the source tags will be deleted after successful merge.',
	},
	'legacy.containerTags.mergeStatus': {
		riskLevel: 'read',
		description:
			'Legacy v3/v4 route. Get container tag merge status. Get queued container tag merge status.',
	},
	'legacy.containerTags.update': {
		riskLevel: 'write',
		description:
			'Legacy v3/v4 route. Update container tag settings. Update settings for a container tag.',
	},
	'legacy.conversations.ingest': {
		riskLevel: 'write',
		description: 'Legacy v3/v4 route. Ingest or update a conversation.',
	},
	'legacy.documents.add': {
		riskLevel: 'write',
		description:
			'Legacy v3/v4 route. Add document. Add a document with any content type (text, url, file, etc.) and metadata.',
	},
	'legacy.documents.batchAdd': {
		riskLevel: 'write',
		description:
			'Legacy v3/v4 route. Batch add documents. Add multiple documents in a single request. Each document can have any content type (text, url, file, etc.) and metadata.',
	},
	'legacy.documents.bulkDelete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Legacy v3/v4 route. Bulk delete documents by IDs or container tags.',
	},
	'legacy.documents.chunks': {
		riskLevel: 'read',
		description:
			'Legacy v3/v4 route. Get document chunks. Get all chunks for a document, ordered by position.',
	},
	'legacy.documents.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Legacy v3/v4 route. Delete document by ID or customId. Delete a document by ID or customId.',
	},
	'legacy.documents.fileUrl': {
		riskLevel: 'read',
		description:
			"Legacy v3/v4 route. Get presigned file URL. Get a fresh presigned URL for a document's file. Returns a time-limited URL (24h) that can be used to download the file.",
	},
	'legacy.documents.get': {
		riskLevel: 'read',
		description: 'Legacy v3/v4 route. Get document. Get a document by ID.',
	},
	'legacy.documents.list': {
		riskLevel: 'read',
		description:
			'Legacy v3/v4 route. List documents. Retrieves a paginated list of documents with their metadata and workflow status.',
	},
	'legacy.documents.listProcessing': {
		riskLevel: 'read',
		description:
			'Legacy v3/v4 route. Get processing documents. Get documents that are currently being processed. Default view=active is the live in-flight queue. view=pending is every unfinished document with no time cutoff. view=all also includes failed documents, paginated.',
	},
	'legacy.documents.search': {
		riskLevel: 'read',
		description:
			'Legacy v3/v4 route. Search documents. Search memories with advanced filtering.',
	},
	'legacy.documents.update': {
		riskLevel: 'write',
		description:
			'Legacy v3/v4 route. Update document. Update a document with any content type (text, url, file, etc.) and metadata.',
	},
	'legacy.documents.uploadFile': {
		riskLevel: 'write',
		description: 'Legacy v3/v4 route. Upload a file to be processed.',
	},
	'legacy.memories.create': {
		riskLevel: 'write',
		description:
			'Legacy v3/v4 route. Create memories directly, bypassing the document ingestion workflow. Generates embeddings and makes them immediately searchable.',
	},
	'legacy.memories.forget': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Legacy v3/v4 route. Forget a memory. Forget (soft delete) a memory entry. The memory is marked as forgotten but not permanently deleted.',
	},
	'legacy.memories.forgetMatching': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			"Legacy v3/v4 route. Forget memories matching a prompt/query. Agentic mass-forget. Given a prompt or query, a tool-calling agent searches the container's memories and soft-deletes everything matching the target. Use dryRun to preview first.",
	},
	'legacy.memories.list': {
		riskLevel: 'read',
		description:
			'Legacy v3/v4 route. List memory entries with history. List all latest memory entries from specified container tags with their update history and source documents.',
	},
	'legacy.memories.search': {
		riskLevel: 'read',
		description:
			'Legacy v3/v4 route. Search memory entries - Low latency for conversational.',
	},
	'legacy.memories.update': {
		riskLevel: 'write',
		description:
			'Legacy v3/v4 route. Update a memory by creating a new version. The original memory is preserved with isLatest=false.',
	},
	'legacy.profile.buckets': {
		riskLevel: 'read',
		description:
			'Legacy v3/v4 route. Get profile buckets. Returns the effective profile bucket definitions for a given container tag — org-level buckets merged with any container-tag-level additions.',
	},
	'legacy.profile.get': {
		riskLevel: 'read',
		description:
			'Legacy v3/v4 route. Get user profile with optional search results.',
	},
	'legacy.settings.get': {
		riskLevel: 'read',
		description: 'Legacy v3/v4 route. Get settings for an organization.',
	},
	'legacy.settings.reset': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Legacy v3/v4 route. Reset organization content: removes documents, memories, spaces (except default project), connections, and org settings. Preserves the org, members, and billing. Deletes every document and memory in the organization; cannot be undone.',
	},
	'legacy.settings.suggestBuckets': {
		riskLevel: 'read',
		description:
			'Legacy v3/v4 route. Suggest profile bucket definitions based on the organization context prompt. Returns 3–6 bucket suggestions tailored to the use-case described in the prompt.',
	},
	'legacy.settings.update': {
		riskLevel: 'write',
		description: 'Legacy v3/v4 route. Update settings for an organization.',
	},
	'memories.forget': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Forget memories by ID. Remove exact memories from normal recall while preserving their audit history. Each ID is handled independently and any missing or ineligible memory is reported without rolling back successful changes. Forgets the memories with these ids; cannot be undone.',
	},
	'memories.forgetMatching': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Forget memories semantically. Describe what should be forgotten in natural language, then preview or apply the matching set. Use dry-run results with the exact-ID endpoint when you need a reviewable, drift-free workflow. Forgets every memory the query matches; cannot be undone.',
	},
	'memories.get': {
		riskLevel: 'read',
		description:
			'Get memory. Retrieve one memory by ID. Optionally include its versions (up to three steps away, nearest first), its direct extends and derives links, up to relatedLimit each, and its source document.',
	},
	'namespaces.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete namespace. Retire a namespace by permanently deleting its content, or preserve that knowledge by moving everything into another namespace first. Moves are queued and complete asynchronously. Deletes the namespace and everything in it unless moveTo names a namespace to move the content into; cannot be undone.',
	},
	'namespaces.get': {
		riskLevel: 'read',
		description:
			'Get namespace settings. Read the supporting context that helps Supermemory understand content and form better memories inside this namespace.',
	},
	'namespaces.list': {
		riskLevel: 'read',
		description:
			'List namespaces. Discover every namespace available to the caller, including its purpose, document volume, memory count, and lifecycle timestamps.',
	},
	'namespaces.update': {
		riskLevel: 'write',
		description:
			'Update namespace settings. Shape how Supermemory understands an existing namespace by updating the background context used during ingestion and memory formation.',
	},
	'organization.get': {
		riskLevel: 'read',
		description:
			'Get organization settings. Read the shared background that guides memory formation across the organization, together with the number of active namespaces.',
	},
	'organization.update': {
		riskLevel: 'write',
		description:
			'Update organization settings. Give Supermemory organization-wide background that improves how content is interpreted across every namespace. Send null to remove the existing context.',
	},
	'profiles.buckets.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete profile buckets. Remove profile categories created specifically for this namespace. Unknown names are safely ignored, while organization-wide buckets remain protected.',
	},
	'profiles.buckets.get': {
		riskLevel: 'read',
		description:
			'Get profile buckets. Inspect the profile taxonomy active in this namespace. The response combines organization-wide buckets with namespace-owned additions as a concise name-to-description map.',
	},
	'profiles.buckets.set': {
		riskLevel: 'write',
		description:
			"Add or update profile buckets. Teach Supermemory new ways to organize this namespace's profile, or refine how existing namespace-owned buckets are classified. Omitted buckets remain unchanged and organization-wide buckets stay protected.",
	},
	'profiles.get': {
		riskLevel: 'read',
		description:
			'Get profile. Read a continuously maintained understanding of the subject represented by this namespace. Stable facts, evolving context, and selected custom buckets are returned together without requiring a search query.',
	},
	'resources.list': {
		riskLevel: 'read',
		description:
			'List resources. Browse documents, source chunks, or learned memories through one predictable paginated contract. Choose the collection in the path; the other collection arrays remain empty for a stable response shape. When listing documents, set include.content to include the last published extracted text.',
	},
	'search.query': {
		riskLevel: 'read',
		description:
			'Search memories. Recall the most relevant learned context and source passages from a namespace. Hybrid search combines memories with document chunks by default, with optional query rewriting, reranking, and supporting context attachments.',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof supermemoryEndpointsNested
>;
