// Generated with endpoints/operation-types.ts from Letta's OpenAPI spec:
// one entry per operation in letta-manifest.json. Risk levels follow
// .github/PLUGIN_PR_RULES.md (R8).
import type {
	RequiredPluginEndpointMeta,
	RequiredPluginEndpointSchemas,
} from 'corsair/core';
import { lettaSchemaEntry } from './openapi-schema';
import { createLettaOperation as op } from './operations';

export const lettaEndpointsNested = {
	accessTokens: {
		create: op('accessTokens.create'),
		delete: op('accessTokens.delete'),
		list: op('accessTokens.list'),
	},
	agents: {
		archives: {
			attach: op('agents.archives.attach'),
			detach: op('agents.archives.detach'),
		},
		blocks: {
			attach: op('agents.blocks.attach'),
			detach: op('agents.blocks.detach'),
			get: op('agents.blocks.get'),
			list: op('agents.blocks.list'),
			update: op('agents.blocks.update'),
		},
		create: op('agents.create'),
		delete: op('agents.delete'),
		exportFile: op('agents.exportFile'),
		files: {
			close: op('agents.files.close'),
			closeAll: op('agents.files.closeAll'),
			list: op('agents.files.list'),
			open: op('agents.files.open'),
		},
		folders: {
			attach: op('agents.folders.attach'),
			detach: op('agents.folders.detach'),
			list: op('agents.folders.list'),
		},
		get: op('agents.get'),
		identities: {
			attach: op('agents.identities.attach'),
			detach: op('agents.identities.detach'),
		},
		importFile: op('agents.importFile'),
		list: op('agents.list'),
		messages: {
			cancel: op('agents.messages.cancel'),
			compact: op('agents.messages.compact'),
			create: op('agents.messages.create'),
			createAsync: op('agents.messages.createAsync'),
			list: op('agents.messages.list'),
			reset: op('agents.messages.reset'),
			stream: op('agents.messages.stream'),
		},
		passages: {
			create: op('agents.passages.create'),
			delete: op('agents.passages.delete'),
			list: op('agents.passages.list'),
			search: op('agents.passages.search'),
		},
		recompile: op('agents.recompile'),
		schedule: {
			create: op('agents.schedule.create'),
			delete: op('agents.schedule.delete'),
			get: op('agents.schedule.get'),
			list: op('agents.schedule.list'),
		},
		tools: {
			attach: op('agents.tools.attach'),
			detach: op('agents.tools.detach'),
			list: op('agents.tools.list'),
			run: op('agents.tools.run'),
			updateApproval: op('agents.tools.updateApproval'),
		},
		update: op('agents.update'),
	},
	archives: {
		create: op('archives.create'),
		delete: op('archives.delete'),
		get: op('archives.get'),
		list: op('archives.list'),
		passages: {
			create: op('archives.passages.create'),
			createMany: op('archives.passages.createMany'),
			delete: op('archives.passages.delete'),
		},
		update: op('archives.update'),
	},
	blocks: {
		agents: {
			list: op('blocks.agents.list'),
		},
		create: op('blocks.create'),
		delete: op('blocks.delete'),
		get: op('blocks.get'),
		list: op('blocks.list'),
		update: op('blocks.update'),
	},
	client: {
		health: op('client.health'),
	},
	conversations: {
		cancel: op('conversations.cancel'),
		create: op('conversations.create'),
		delete: op('conversations.delete'),
		fork: op('conversations.fork'),
		get: op('conversations.get'),
		list: op('conversations.list'),
		messages: {
			compact: op('conversations.messages.compact'),
			create: op('conversations.messages.create'),
			list: op('conversations.messages.list'),
			stream: op('conversations.messages.stream'),
		},
		recompile: op('conversations.recompile'),
		update: op('conversations.update'),
	},
	environments: {
		get: op('environments.get'),
		list: op('environments.list'),
		sendMessage: op('environments.sendMessage'),
	},
	folders: {
		agents: {
			list: op('folders.agents.list'),
		},
		create: op('folders.create'),
		delete: op('folders.delete'),
		files: {
			delete: op('folders.files.delete'),
			get: op('folders.files.get'),
			list: op('folders.files.list'),
			upload: op('folders.files.upload'),
		},
		get: op('folders.get'),
		list: op('folders.list'),
		update: op('folders.update'),
	},
	mcpServers: {
		create: op('mcpServers.create'),
		delete: op('mcpServers.delete'),
		get: op('mcpServers.get'),
		list: op('mcpServers.list'),
		refresh: op('mcpServers.refresh'),
		tools: {
			get: op('mcpServers.tools.get'),
			list: op('mcpServers.tools.list'),
			run: op('mcpServers.tools.run'),
		},
		update: op('mcpServers.update'),
	},
	messages: {
		get: op('messages.get'),
		list: op('messages.list'),
		search: op('messages.search'),
	},
	models: {
		embeddings: {
			list: op('models.embeddings.list'),
		},
		list: op('models.list'),
	},
	passages: {
		search: op('passages.search'),
	},
	runs: {
		get: op('runs.get'),
		list: op('runs.list'),
		messages: {
			list: op('runs.messages.list'),
			stream: op('runs.messages.stream'),
		},
		steps: {
			list: op('runs.steps.list'),
		},
		trace: {
			get: op('runs.trace.get'),
		},
		usage: {
			get: op('runs.usage.get'),
		},
	},
	steps: {
		feedback: {
			create: op('steps.feedback.create'),
		},
		get: op('steps.get'),
		list: op('steps.list'),
		messages: {
			list: op('steps.messages.list'),
		},
		metrics: {
			get: op('steps.metrics.get'),
		},
		trace: {
			get: op('steps.trace.get'),
		},
	},
	tags: {
		list: op('tags.list'),
	},
	templates: {
		agents: {
			create: op('templates.agents.create'),
		},
		create: op('templates.create'),
		delete: op('templates.delete'),
		rollback: op('templates.rollback'),
		save: op('templates.save'),
		update: op('templates.update'),
	},
	tools: {
		create: op('tools.create'),
		delete: op('tools.delete'),
		get: op('tools.get'),
		list: op('tools.list'),
		search: op('tools.search'),
		update: op('tools.update'),
		upsert: op('tools.upsert'),
	},
} as const;

export const lettaEndpointSchemas = {
	'accessTokens.create': lettaSchemaEntry('accessTokens.create'),
	'accessTokens.delete': lettaSchemaEntry('accessTokens.delete'),
	'accessTokens.list': lettaSchemaEntry('accessTokens.list'),
	'agents.archives.attach': lettaSchemaEntry('agents.archives.attach'),
	'agents.archives.detach': lettaSchemaEntry('agents.archives.detach'),
	'agents.blocks.attach': lettaSchemaEntry('agents.blocks.attach'),
	'agents.blocks.detach': lettaSchemaEntry('agents.blocks.detach'),
	'agents.blocks.get': lettaSchemaEntry('agents.blocks.get'),
	'agents.blocks.list': lettaSchemaEntry('agents.blocks.list'),
	'agents.blocks.update': lettaSchemaEntry('agents.blocks.update'),
	'agents.create': lettaSchemaEntry('agents.create'),
	'agents.delete': lettaSchemaEntry('agents.delete'),
	'agents.exportFile': lettaSchemaEntry('agents.exportFile'),
	'agents.files.close': lettaSchemaEntry('agents.files.close'),
	'agents.files.closeAll': lettaSchemaEntry('agents.files.closeAll'),
	'agents.files.list': lettaSchemaEntry('agents.files.list'),
	'agents.files.open': lettaSchemaEntry('agents.files.open'),
	'agents.folders.attach': lettaSchemaEntry('agents.folders.attach'),
	'agents.folders.detach': lettaSchemaEntry('agents.folders.detach'),
	'agents.folders.list': lettaSchemaEntry('agents.folders.list'),
	'agents.get': lettaSchemaEntry('agents.get'),
	'agents.identities.attach': lettaSchemaEntry('agents.identities.attach'),
	'agents.identities.detach': lettaSchemaEntry('agents.identities.detach'),
	'agents.importFile': lettaSchemaEntry('agents.importFile'),
	'agents.list': lettaSchemaEntry('agents.list'),
	'agents.messages.cancel': lettaSchemaEntry('agents.messages.cancel'),
	'agents.messages.compact': lettaSchemaEntry('agents.messages.compact'),
	'agents.messages.create': lettaSchemaEntry('agents.messages.create'),
	'agents.messages.createAsync': lettaSchemaEntry(
		'agents.messages.createAsync',
	),
	'agents.messages.list': lettaSchemaEntry('agents.messages.list'),
	'agents.messages.reset': lettaSchemaEntry('agents.messages.reset'),
	'agents.messages.stream': lettaSchemaEntry('agents.messages.stream'),
	'agents.passages.create': lettaSchemaEntry('agents.passages.create'),
	'agents.passages.delete': lettaSchemaEntry('agents.passages.delete'),
	'agents.passages.list': lettaSchemaEntry('agents.passages.list'),
	'agents.passages.search': lettaSchemaEntry('agents.passages.search'),
	'agents.recompile': lettaSchemaEntry('agents.recompile'),
	'agents.schedule.create': lettaSchemaEntry('agents.schedule.create'),
	'agents.schedule.delete': lettaSchemaEntry('agents.schedule.delete'),
	'agents.schedule.get': lettaSchemaEntry('agents.schedule.get'),
	'agents.schedule.list': lettaSchemaEntry('agents.schedule.list'),
	'agents.tools.attach': lettaSchemaEntry('agents.tools.attach'),
	'agents.tools.detach': lettaSchemaEntry('agents.tools.detach'),
	'agents.tools.list': lettaSchemaEntry('agents.tools.list'),
	'agents.tools.run': lettaSchemaEntry('agents.tools.run'),
	'agents.tools.updateApproval': lettaSchemaEntry(
		'agents.tools.updateApproval',
	),
	'agents.update': lettaSchemaEntry('agents.update'),
	'archives.create': lettaSchemaEntry('archives.create'),
	'archives.delete': lettaSchemaEntry('archives.delete'),
	'archives.get': lettaSchemaEntry('archives.get'),
	'archives.list': lettaSchemaEntry('archives.list'),
	'archives.passages.create': lettaSchemaEntry('archives.passages.create'),
	'archives.passages.createMany': lettaSchemaEntry(
		'archives.passages.createMany',
	),
	'archives.passages.delete': lettaSchemaEntry('archives.passages.delete'),
	'archives.update': lettaSchemaEntry('archives.update'),
	'blocks.agents.list': lettaSchemaEntry('blocks.agents.list'),
	'blocks.create': lettaSchemaEntry('blocks.create'),
	'blocks.delete': lettaSchemaEntry('blocks.delete'),
	'blocks.get': lettaSchemaEntry('blocks.get'),
	'blocks.list': lettaSchemaEntry('blocks.list'),
	'blocks.update': lettaSchemaEntry('blocks.update'),
	'client.health': lettaSchemaEntry('client.health'),
	'conversations.cancel': lettaSchemaEntry('conversations.cancel'),
	'conversations.create': lettaSchemaEntry('conversations.create'),
	'conversations.delete': lettaSchemaEntry('conversations.delete'),
	'conversations.fork': lettaSchemaEntry('conversations.fork'),
	'conversations.get': lettaSchemaEntry('conversations.get'),
	'conversations.list': lettaSchemaEntry('conversations.list'),
	'conversations.messages.compact': lettaSchemaEntry(
		'conversations.messages.compact',
	),
	'conversations.messages.create': lettaSchemaEntry(
		'conversations.messages.create',
	),
	'conversations.messages.list': lettaSchemaEntry(
		'conversations.messages.list',
	),
	'conversations.messages.stream': lettaSchemaEntry(
		'conversations.messages.stream',
	),
	'conversations.recompile': lettaSchemaEntry('conversations.recompile'),
	'conversations.update': lettaSchemaEntry('conversations.update'),
	'environments.get': lettaSchemaEntry('environments.get'),
	'environments.list': lettaSchemaEntry('environments.list'),
	'environments.sendMessage': lettaSchemaEntry('environments.sendMessage'),
	'folders.agents.list': lettaSchemaEntry('folders.agents.list'),
	'folders.create': lettaSchemaEntry('folders.create'),
	'folders.delete': lettaSchemaEntry('folders.delete'),
	'folders.files.delete': lettaSchemaEntry('folders.files.delete'),
	'folders.files.get': lettaSchemaEntry('folders.files.get'),
	'folders.files.list': lettaSchemaEntry('folders.files.list'),
	'folders.files.upload': lettaSchemaEntry('folders.files.upload'),
	'folders.get': lettaSchemaEntry('folders.get'),
	'folders.list': lettaSchemaEntry('folders.list'),
	'folders.update': lettaSchemaEntry('folders.update'),
	'mcpServers.create': lettaSchemaEntry('mcpServers.create'),
	'mcpServers.delete': lettaSchemaEntry('mcpServers.delete'),
	'mcpServers.get': lettaSchemaEntry('mcpServers.get'),
	'mcpServers.list': lettaSchemaEntry('mcpServers.list'),
	'mcpServers.refresh': lettaSchemaEntry('mcpServers.refresh'),
	'mcpServers.tools.get': lettaSchemaEntry('mcpServers.tools.get'),
	'mcpServers.tools.list': lettaSchemaEntry('mcpServers.tools.list'),
	'mcpServers.tools.run': lettaSchemaEntry('mcpServers.tools.run'),
	'mcpServers.update': lettaSchemaEntry('mcpServers.update'),
	'messages.get': lettaSchemaEntry('messages.get'),
	'messages.list': lettaSchemaEntry('messages.list'),
	'messages.search': lettaSchemaEntry('messages.search'),
	'models.embeddings.list': lettaSchemaEntry('models.embeddings.list'),
	'models.list': lettaSchemaEntry('models.list'),
	'passages.search': lettaSchemaEntry('passages.search'),
	'runs.get': lettaSchemaEntry('runs.get'),
	'runs.list': lettaSchemaEntry('runs.list'),
	'runs.messages.list': lettaSchemaEntry('runs.messages.list'),
	'runs.messages.stream': lettaSchemaEntry('runs.messages.stream'),
	'runs.steps.list': lettaSchemaEntry('runs.steps.list'),
	'runs.trace.get': lettaSchemaEntry('runs.trace.get'),
	'runs.usage.get': lettaSchemaEntry('runs.usage.get'),
	'steps.feedback.create': lettaSchemaEntry('steps.feedback.create'),
	'steps.get': lettaSchemaEntry('steps.get'),
	'steps.list': lettaSchemaEntry('steps.list'),
	'steps.messages.list': lettaSchemaEntry('steps.messages.list'),
	'steps.metrics.get': lettaSchemaEntry('steps.metrics.get'),
	'steps.trace.get': lettaSchemaEntry('steps.trace.get'),
	'tags.list': lettaSchemaEntry('tags.list'),
	'templates.agents.create': lettaSchemaEntry('templates.agents.create'),
	'templates.create': lettaSchemaEntry('templates.create'),
	'templates.delete': lettaSchemaEntry('templates.delete'),
	'templates.rollback': lettaSchemaEntry('templates.rollback'),
	'templates.save': lettaSchemaEntry('templates.save'),
	'templates.update': lettaSchemaEntry('templates.update'),
	'tools.create': lettaSchemaEntry('tools.create'),
	'tools.delete': lettaSchemaEntry('tools.delete'),
	'tools.get': lettaSchemaEntry('tools.get'),
	'tools.list': lettaSchemaEntry('tools.list'),
	'tools.search': lettaSchemaEntry('tools.search'),
	'tools.update': lettaSchemaEntry('tools.update'),
	'tools.upsert': lettaSchemaEntry('tools.upsert'),
} satisfies RequiredPluginEndpointSchemas<typeof lettaEndpointsNested>;

export const lettaEndpointMeta = {
	'accessTokens.create': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Create token (Cloud-only). Create a new client side access token with the specified configuration. Mints a client-side access token.',
	},
	'accessTokens.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete token (Cloud-only). Delete a client side access token. Cannot be undone.',
	},
	'accessTokens.list': {
		riskLevel: 'read',
		description:
			'List tokens (Cloud-only). List all client side access tokens for the current account. This is only available for cloud users.',
	},
	'agents.archives.attach': {
		riskLevel: 'write',
		description: 'Attach Archive To Agent. Attach an archive to an agent.',
	},
	'agents.archives.detach': {
		riskLevel: 'write',
		description: 'Detach Archive From Agent. Detach an archive from an agent.',
	},
	'agents.blocks.attach': {
		riskLevel: 'write',
		description:
			'Attach Block To Agent. Attach a core memory block to an agent.',
	},
	'agents.blocks.detach': {
		riskLevel: 'write',
		description:
			'Detach Block From Agent. Detach a core memory block from an agent.',
	},
	'agents.blocks.get': {
		riskLevel: 'read',
		description:
			'Retrieve Block For Agent. Retrieve a core memory block from an agent.',
	},
	'agents.blocks.list': {
		riskLevel: 'read',
		description:
			'List Blocks For Agent. Retrieve the core memory blocks of a specific agent.',
	},
	'agents.blocks.update': {
		riskLevel: 'write',
		description:
			'Update Block For Agent. Updates a core memory block of an agent.',
	},
	'agents.create': {
		riskLevel: 'write',
		description: 'Create Agent. Create an agent. (POST /v1/agents/)',
	},
	'agents.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete Agent. Delete an agent. Cannot be undone.',
	},
	'agents.exportFile': {
		riskLevel: 'read',
		description:
			'Export Agent. Export the serialized JSON representation of an agent, formatted with indentation.',
	},
	'agents.files.close': {
		riskLevel: 'write',
		description:
			"Close File For Agent. Closes a specific file for a given agent. This endpoint marks a specific file as closed in the agent's file state. The file will be removed from the agent's working memory view.",
	},
	'agents.files.closeAll': {
		riskLevel: 'write',
		description:
			'Close All Files For Agent. Closes all currently open files for a given agent. This endpoint updates the file state for the agent so that no files are marked as open. Typically used to reset the working memory view for the agent.',
	},
	'agents.files.list': {
		riskLevel: 'read',
		description:
			'List Files For Agent. Get the files attached to an agent with their open/closed status.',
	},
	'agents.files.open': {
		riskLevel: 'write',
		description:
			"Open File For Agent. Opens a specific file for a given agent. This endpoint marks a specific file as open in the agent's file state. The file will be included in the agent's working memory view. Returns a list of file names that were closed due to LRU eviction.",
	},
	'agents.folders.attach': {
		riskLevel: 'write',
		description: 'Attach Folder To Agent. Attach a folder to an agent.',
	},
	'agents.folders.detach': {
		riskLevel: 'write',
		description: 'Detach Folder From Agent. Detach a folder from an agent.',
	},
	'agents.folders.list': {
		riskLevel: 'read',
		description:
			'List Folders For Agent. Get the folders associated with an agent.',
	},
	'agents.get': {
		riskLevel: 'read',
		description: 'Retrieve Agent. Get the state of the agent.',
	},
	'agents.identities.attach': {
		riskLevel: 'write',
		description: 'Attach Identity To Agent. Attach an identity to an agent.',
	},
	'agents.identities.detach': {
		riskLevel: 'write',
		description:
			'Detach Identity From Agent. Detach an identity from an agent.',
	},
	'agents.importFile': {
		riskLevel: 'write',
		description:
			'Import Agent. Import a serialized agent file and recreate the agent(s) in the system. Returns the IDs of all imported agents.',
	},
	'agents.list': {
		riskLevel: 'read',
		description: 'List Agents. Get a list of all agents. (GET /v1/agents/)',
	},
	'agents.messages.cancel': {
		riskLevel: 'write',
		description:
			'Cancel Message. Cancel runs associated with an agent. If run_ids are passed in, cancel those in particular. Note to cancel active runs associated with an agent, redis is required.',
	},
	'agents.messages.compact': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			"Summarize Messages. Summarize an agent's conversation history.",
	},
	'agents.messages.create': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			"Create Message. Process a user message and return the agent's response. This endpoint accepts a message from a user and processes it through the agent. Note: Sending multiple concurrent requests to the same agent can lead to undefined behavior. Runs the agent: it calls its model (spending tokens) and may run tools.",
	},
	'agents.messages.createAsync': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Create Message Async. Asynchronously process a user message and return a run object. The actual processing happens in the background, and the status can be checked using the run ID. This is "asynchronous" in the sense that it\'s a background run and explicitly must be fetched by the run ID. Runs the agent in the background and returns a run to poll with runs.get.',
	},
	'agents.messages.list': {
		riskLevel: 'read',
		description: 'List Messages. Retrieve message history for an agent.',
	},
	'agents.messages.reset': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			"Reset Messages. Resets the messages for an agent. Clears the agent's message history.",
	},
	'agents.messages.stream': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			"Create Message Streaming. Process a user message and return the agent's response. Deprecated: Use the POST /{agent_id}/messages endpoint with streaming=true in the request body instead. Note: Sending multiple concurrent requests to the same agent can lead to undefined behavior. Runs the agent like agents.messages.create and returns the server-sent events as text.",
	},
	'agents.passages.create': {
		riskLevel: 'write',
		description:
			"Create Passage. Insert a memory into an agent's archival memory store.",
	},
	'agents.passages.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			"Delete Passage. Delete a memory from an agent's archival memory store. Cannot be undone.",
	},
	'agents.passages.list': {
		riskLevel: 'read',
		description:
			"List Passages. Retrieve the memories in an agent's archival memory store (paginated query).",
	},
	'agents.passages.search': {
		riskLevel: 'read',
		description:
			"Search Archival Memory. Search archival memory using semantic (embedding-based) search with optional temporal filtering. This endpoint allows manual triggering of archival memory searches, enabling users to query an agent's archival memory store directly via the API.",
	},
	'agents.recompile': {
		riskLevel: 'write',
		description:
			'Recompile Agent. Manually trigger system prompt recompilation for an agent.',
	},
	'agents.schedule.create': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Schedule Agent Message. Schedule a message to be sent by the agent at a specified time or on a recurring basis.',
	},
	'agents.schedule.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete Scheduled Agent Message. Delete a scheduled message by its ID for a specific agent. Cannot be undone.',
	},
	'agents.schedule.get': {
		riskLevel: 'read',
		description:
			'Retrieve Scheduled Agent Message. Retrieve a scheduled message by its ID for a specific agent.',
	},
	'agents.schedule.list': {
		riskLevel: 'read',
		description:
			'List Scheduled Agent Messages. List all scheduled messages for a specific agent.',
	},
	'agents.tools.attach': {
		riskLevel: 'write',
		description: 'Attach Tool To Agent. Attach a tool to an agent.',
	},
	'agents.tools.detach': {
		riskLevel: 'write',
		description: 'Detach Tool From Agent. Detach a tool from an agent.',
	},
	'agents.tools.list': {
		riskLevel: 'read',
		description: 'List Tools For Agent. Get tools from an existing agent.',
	},
	'agents.tools.run': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			"Run Tool For Agent. Trigger a tool by name on a specific agent, providing the necessary arguments. This endpoint executes a tool that is attached to the agent, using the agent's state and environment variables for execution context. Executes the tool with the arguments given; side effects are the tool’s own.",
	},
	'agents.tools.updateApproval': {
		riskLevel: 'write',
		description:
			'Update Approval For Tool. Modify the approval requirement for a tool attached to an agent. Accepts requires_approval via request body (preferred) or query parameter (deprecated).',
	},
	'agents.update': {
		riskLevel: 'write',
		description:
			'Update Agent. Update an existing agent. (PATCH /v1/agents/{agent_id})',
	},
	'archives.create': {
		riskLevel: 'write',
		description: 'Create Archive. Create a new archive. (POST /v1/archives/)',
	},
	'archives.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete Archive. Delete an archive by its ID. Cannot be undone.',
	},
	'archives.get': {
		riskLevel: 'read',
		description: 'Retrieve Archive. Get a single archive by its ID.',
	},
	'archives.list': {
		riskLevel: 'read',
		description:
			'List Archives. Get a list of all archives for the current organization with optional filters and pagination.',
	},
	'archives.passages.create': {
		riskLevel: 'write',
		description:
			'Create Passage In Archive. Create a new passage in an archive. This adds a passage to the archive and creates embeddings for vector storage.',
	},
	'archives.passages.createMany': {
		riskLevel: 'write',
		description:
			'Create Passages In Archive. Create multiple passages in an archive. This adds passages to the archive and creates embeddings for vector storage.',
	},
	'archives.passages.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete Passage From Archive. Delete a passage from an archive. This permanently removes the passage from both the database and vector storage (if applicable). Cannot be undone.',
	},
	'archives.update': {
		riskLevel: 'write',
		description:
			"Update Archive. Update an existing archive's name and/or description.",
	},
	'blocks.agents.list': {
		riskLevel: 'read',
		description:
			'List Agents For Block. Retrieves all agents associated with the specified block. Raises a 404 if the block does not exist.',
	},
	'blocks.create': {
		riskLevel: 'write',
		description: 'Create Block. (POST /v1/blocks/)',
	},
	'blocks.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete Block. Cannot be undone. (DELETE /v1/blocks/{block_id})',
	},
	'blocks.get': {
		riskLevel: 'read',
		description: 'Retrieve Block. (GET /v1/blocks/{block_id})',
	},
	'blocks.list': {
		riskLevel: 'read',
		description: 'List Blocks. (GET /v1/blocks/)',
	},
	'blocks.update': {
		riskLevel: 'write',
		description: 'Update Block. (PATCH /v1/blocks/{block_id})',
	},
	'client.health': {
		riskLevel: 'read',
		description:
			'Check Health. Liveness endpoint; returns 200 when process is responsive.',
	},
	'conversations.cancel': {
		riskLevel: 'write',
		description:
			'Cancel Conversation. Cancel runs associated with a conversation. Note: To cancel active runs, Redis is required. Agent-direct mode: Pass conversation_id="default" with agent_id query parameter to cancel runs for the agent\'s default conversation.',
	},
	'conversations.create': {
		riskLevel: 'write',
		description: 'Create Conversation. Create a new conversation for an agent.',
	},
	'conversations.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete Conversation. Delete a conversation. The conversation will no longer appear in list operations. Cannot be undone.',
	},
	'conversations.fork': {
		riskLevel: 'write',
		description:
			'Fork Conversation. Fork an existing conversation. Creates a new conversation that shares the same in-context messages as the source conversation, but with a newly compiled system message reflecting the latest memory block values. The forked conversation belongs to the same agent as the source.',
	},
	'conversations.get': {
		riskLevel: 'read',
		description: 'Retrieve Conversation. Retrieve a specific conversation.',
	},
	'conversations.list': {
		riskLevel: 'read',
		description:
			'List Conversations. List all conversations for an agent (or all conversations if agent_id not provided).',
	},
	'conversations.messages.compact': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			"Compact Conversation. Compact (summarize) a conversation's message history. This endpoint summarizes the in-context messages for a specific conversation, reducing the message count while preserving important context.",
	},
	'conversations.messages.create': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Send Conversation Message. Send a message to a conversation and get a response. This endpoint sends a message to an existing conversation. By default (streaming=true), returns a streaming response (Server-Sent Events). Set streaming=false to get a complete JSON response. Runs the agent in this conversation: it calls its model and may run tools.',
	},
	'conversations.messages.list': {
		riskLevel: 'read',
		description:
			'List Conversation Messages. List all messages in a conversation. Returns LettaMessage objects (UserMessage, AssistantMessage, etc.) for all messages in the conversation, with support for cursor-based pagination.',
	},
	'conversations.messages.stream': {
		riskLevel: 'read',
		description:
			'Retrieve Conversation Stream. Resume the stream for the most recent active run in a conversation. This endpoint allows you to reconnect to an active background stream for a conversation, enabling recovery from network interruptions.',
	},
	'conversations.recompile': {
		riskLevel: 'write',
		description:
			'Recompile Conversation. Manually trigger system prompt recompilation for a conversation.',
	},
	'conversations.update': {
		riskLevel: 'write',
		description: 'Update Conversation. Update a conversation.',
	},
	'environments.get': {
		riskLevel: 'read',
		description:
			'Get Environment Connection. Get a specific environment connection by deviceId.',
	},
	'environments.list': {
		riskLevel: 'read',
		description:
			'List Environment Connections. List all active environment connections for the organization.',
	},
	'environments.sendMessage': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Send Message to Environment. Send a message to a specific environment connection.',
	},
	'folders.agents.list': {
		riskLevel: 'read',
		description:
			'List Agents For Folder. Get all agent IDs that have the specified folder attached.',
	},
	'folders.create': {
		riskLevel: 'write',
		description: 'Create Folder. Create a new data folder.',
	},
	'folders.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete Folder. Delete a data folder. Cannot be undone.',
	},
	'folders.files.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete File From Folder. Delete a file from a folder. Cannot be undone.',
	},
	'folders.files.get': {
		riskLevel: 'read',
		description: 'Retrieve File. Retrieve a file from a folder by ID.',
	},
	'folders.files.list': {
		riskLevel: 'read',
		description:
			'List Files For Folder. List paginated files associated with a data folder.',
	},
	'folders.files.upload': {
		riskLevel: 'write',
		description: 'Upload File To Folder. Upload a file to a data folder.',
	},
	'folders.get': {
		riskLevel: 'read',
		description:
			'Retrieve Folder. Get a folder by ID. (GET /v1/folders/{folder_id})',
	},
	'folders.list': {
		riskLevel: 'read',
		description: 'List Folders. List all data folders created by a user.',
	},
	'folders.update': {
		riskLevel: 'write',
		description:
			'Update Folder. Update the name or documentation of an existing data folder.',
	},
	'mcpServers.create': {
		riskLevel: 'write',
		description:
			'Create Mcp Server. Add a new MCP server to the Letta MCP server config.',
	},
	'mcpServers.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete Mcp Server. Delete an MCP server by its ID. Cannot be undone.',
	},
	'mcpServers.get': {
		riskLevel: 'read',
		description: 'Retrieve Mcp Server. Get a specific MCP server.',
	},
	'mcpServers.list': {
		riskLevel: 'read',
		description: 'List Mcp Servers. Get a list of all configured MCP servers.',
	},
	'mcpServers.refresh': {
		riskLevel: 'write',
		description:
			'Refresh Mcp Server Tools. Refresh tools for an MCP server by: 1. Fetching current tools from the MCP server 1. Deleting tools that no longer exist on the server 1. Updating schemas for existing tools 1. Adding new tools from the server Returns a summary of changes made.',
	},
	'mcpServers.tools.get': {
		riskLevel: 'read',
		description: 'Retrieve Mcp Tool. Get a specific MCP tool by its ID.',
	},
	'mcpServers.tools.list': {
		riskLevel: 'read',
		description:
			'List Tools For Mcp Server. Get a list of all tools for a specific MCP server.',
	},
	'mcpServers.tools.run': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Run Mcp Tool. Execute a specific MCP tool The request body should contain the tool arguments in the ToolExecuteRequest format. Executes the MCP tool with the arguments given.',
	},
	'mcpServers.update': {
		riskLevel: 'write',
		description:
			'Update Mcp Server. Update an existing MCP server configuration.',
	},
	'messages.get': {
		riskLevel: 'read',
		description: 'Retrieve Message. Retrieve a message by ID.',
	},
	'messages.list': {
		riskLevel: 'read',
		description:
			'List All Messages. List messages across all agents for the current user.',
	},
	'messages.search': {
		riskLevel: 'read',
		description:
			'Search All Messages. Search messages across the organization with optional agent filtering. Returns messages with FTS/vector ranks and total RRF score. This is a cloud-only feature.',
	},
	'models.embeddings.list': {
		riskLevel: 'read',
		description:
			'List Embedding Models. List available embedding models using the asynchronous implementation for improved performance. Returns EmbeddingModel format which extends EmbeddingConfig with additional metadata fields. Legacy EmbeddingConfig fields are marked as deprecated but still available for backward compatibility.',
	},
	'models.list': {
		riskLevel: 'read',
		description:
			'List Llm Models. List available LLM models using the asynchronous implementation for improved performance. Returns Model format which extends LLMConfig with additional metadata fields. Legacy LLMConfig fields are marked as deprecated but still available for backward compatibility.',
	},
	'passages.search': {
		riskLevel: 'read',
		description:
			'Search Passages. Search passages across the organization with optional agent and archive filtering. Returns passages with relevance scores.',
	},
	'runs.get': {
		riskLevel: 'read',
		description:
			'Retrieve Run. Get the status of a run. (GET /v1/runs/{run_id})',
	},
	'runs.list': {
		riskLevel: 'read',
		description: 'List Runs. List all runs. (GET /v1/runs/)',
	},
	'runs.messages.list': {
		riskLevel: 'read',
		description:
			'List Messages For Run. Get response messages associated with a run.',
	},
	'runs.messages.stream': {
		riskLevel: 'read',
		description:
			'Retrieve Stream For Run. Reattaches to a background run’s stream; returns the server-sent events as text.',
	},
	'runs.steps.list': {
		riskLevel: 'read',
		description:
			'List Steps For Run. Get steps associated with a run with filtering options.',
	},
	'runs.trace.get': {
		riskLevel: 'read',
		description:
			'Retrieve Trace For Run. Retrieve OTEL trace spans for a run. Returns a filtered set of spans relevant for observability: - agent_step: Individual agent reasoning steps - tool executions: Tool call spans - Root span: The top-level request span - time_to_first_token: TTFT measurement span Requires ClickHouse to be…',
	},
	'runs.usage.get': {
		riskLevel: 'read',
		description: 'Retrieve Usage For Run. Get usage statistics for a run.',
	},
	'steps.feedback.create': {
		riskLevel: 'write',
		description: 'Modify Feedback For Step. Modify feedback for a given step.',
	},
	'steps.get': {
		riskLevel: 'read',
		description: 'Retrieve Step. Get a step by ID. (GET /v1/steps/{step_id})',
	},
	'steps.list': {
		riskLevel: 'read',
		description:
			'List Steps. List steps with optional pagination and date filters.',
	},
	'steps.messages.list': {
		riskLevel: 'read',
		description: 'List Messages For Step. List messages for a given step.',
	},
	'steps.metrics.get': {
		riskLevel: 'read',
		description: 'Retrieve Metrics For Step. Get step metrics by step ID.',
	},
	'steps.trace.get': {
		riskLevel: 'read',
		description: 'Retrieve Trace For Step. (GET /v1/steps/{step_id}/trace)',
	},
	'tags.list': {
		riskLevel: 'read',
		description:
			'List Tags. Get the list of all tags (from agents and blocks) that have been created.',
	},
	'templates.agents.create': {
		riskLevel: 'write',
		description:
			'Create Agents From Template. Creates an Agent or multiple Agents from a template.',
	},
	'templates.create': {
		riskLevel: 'write',
		description:
			'Create template (Cloud-only). Creates a new template from an existing agent or agent file.',
	},
	'templates.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete template (Cloud-only). Deletes all versions of a template with the specified name. Cannot be undone.',
	},
	'templates.rollback': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Rollback template to previous version (Cloud-only). Rollback the current working version of a template to a previous saved version. If the current version has unsaved changes, they will be automatically saved as a new version before rollback.',
	},
	'templates.save': {
		riskLevel: 'write',
		description:
			'Save template version (Cloud-only). Saves the current version of the template as a new version.',
	},
	'templates.update': {
		riskLevel: 'write',
		description:
			'Update current template from agent file (Cloud-only). Updates the current working version of a template from an agent file.',
	},
	'tools.create': {
		riskLevel: 'write',
		description: 'Create Tool. Create a new tool. (POST /v1/tools/)',
	},
	'tools.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete Tool. Delete a tool by name. Cannot be undone.',
	},
	'tools.get': {
		riskLevel: 'read',
		description: 'Retrieve Tool. Get a tool by ID. (GET /v1/tools/{tool_id})',
	},
	'tools.list': {
		riskLevel: 'read',
		description: 'List Tools. Get a list of all tools available to agents.',
	},
	'tools.search': {
		riskLevel: 'read',
		description:
			'Search Tools. Search tools using semantic search. Requires tool embedding to be enabled (embed_tools=True). Uses vector search, full-text search, or hybrid mode to find tools matching the query. Returns tools ranked by relevance with their search scores.',
	},
	'tools.update': {
		riskLevel: 'write',
		description:
			'Update Tool. Update an existing tool. (PATCH /v1/tools/{tool_id})',
	},
	'tools.upsert': {
		riskLevel: 'write',
		description: 'Upsert Tool. Create or update a tool. (PUT /v1/tools/)',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof lettaEndpointsNested>;
