import type {
	BindEndpoints,
	CorsairEndpoint,
	CorsairErrorHandler,
	CorsairPlugin,
	CorsairPluginContext,
	KeyBuilderContext,
	PickAuth,
	PluginAuthConfig,
	PluginPermissionsConfig,
	RequiredPluginEndpointMeta,
	RequiredPluginEndpointSchemas,
} from 'corsair/core';
import type { AuthTypes } from 'corsair/core';
import { AuthMissingError } from 'corsair/core';
import type {
	MondayMcpEndpointInputs,
	MondayMcpEndpointOutputs,
} from './endpoints/types';
import {
	MondayMcpEndpointInputSchemas,
	MondayMcpEndpointOutputSchemas,
} from './endpoints/types';
import { mondayMcpEndpointsNested } from './endpoints';
import { MondayMcpSchema } from './schema';
import { errorHandlers } from './error-handlers';

export type MondayMcpPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalMondayMcpPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof mondayMcpEndpointsNested>;
};

export type MondayMcpContext = CorsairPluginContext<
	typeof MondayMcpSchema,
	MondayMcpPluginOptions
>;

export type MondayMcpKeyBuilderContext =
	KeyBuilderContext<MondayMcpPluginOptions>;

export type MondayMcpBoundEndpoints = BindEndpoints<
	typeof mondayMcpEndpointsNested
>;

type MondayMcpEndpoint<K extends keyof MondayMcpEndpointOutputs> =
	CorsairEndpoint<
		MondayMcpContext,
		MondayMcpEndpointInputs[K],
		MondayMcpEndpointOutputs[K]
	>;

export type MondayMcpEndpoints = {
	'boards.create': MondayMcpEndpoint<'boards.create'>;
	'boards.getInfo': MondayMcpEndpoint<'boards.getInfo'>;
	'boards.getItemsPage': MondayMcpEndpoint<'boards.getItemsPage'>;
	'boards.getActivity': MondayMcpEndpoint<'boards.getActivity'>;
	'boards.insights': MondayMcpEndpoint<'boards.insights'>;
	'groups.create': MondayMcpEndpoint<'groups.create'>;
	'columns.create': MondayMcpEndpoint<'columns.create'>;
	'columns.getTypeInfo': MondayMcpEndpoint<'columns.getTypeInfo'>;
	'items.create': MondayMcpEndpoint<'items.create'>;
	'items.changeColumnValues': MondayMcpEndpoint<'items.changeColumnValues'>;
	'workspaces.create': MondayMcpEndpoint<'workspaces.create'>;
	'workspaces.update': MondayMcpEndpoint<'workspaces.update'>;
	'workspaces.list': MondayMcpEndpoint<'workspaces.list'>;
	'workspaces.getInfo': MondayMcpEndpoint<'workspaces.getInfo'>;
	'folders.create': MondayMcpEndpoint<'folders.create'>;
	'folders.update': MondayMcpEndpoint<'folders.update'>;
	'folders.moveObject': MondayMcpEndpoint<'folders.moveObject'>;
	'docs.create': MondayMcpEndpoint<'docs.create'>;
	'docs.update': MondayMcpEndpoint<'docs.update'>;
	'docs.read': MondayMcpEndpoint<'docs.read'>;
	'dashboards.create': MondayMcpEndpoint<'dashboards.create'>;
	'dashboards.createWidget': MondayMcpEndpoint<'dashboards.createWidget'>;
	'dashboards.allWidgetsSchema': MondayMcpEndpoint<'dashboards.allWidgetsSchema'>;
	'views.create': MondayMcpEndpoint<'views.create'>;
	'views.update': MondayMcpEndpoint<'views.update'>;
	'views.createTable': MondayMcpEndpoint<'views.createTable'>;
	'views.updateTable': MondayMcpEndpoint<'views.updateTable'>;
	'forms.create': MondayMcpEndpoint<'forms.create'>;
	'forms.get': MondayMcpEndpoint<'forms.get'>;
	'forms.update': MondayMcpEndpoint<'forms.update'>;
	'forms.editQuestions': MondayMcpEndpoint<'forms.editQuestions'>;
	'forms.createSubmission': MondayMcpEndpoint<'forms.createSubmission'>;
	'users.getContext': MondayMcpEndpoint<'users.getContext'>;
	'users.listAndTeams': MondayMcpEndpoint<'users.listAndTeams'>;
	'updates.create': MondayMcpEndpoint<'updates.create'>;
	'updates.list': MondayMcpEndpoint<'updates.list'>;
	'notifications.create': MondayMcpEndpoint<'notifications.create'>;
	'search.query': MondayMcpEndpoint<'search.query'>;
	'assets.get': MondayMcpEndpoint<'assets.get'>;
	'assets.getUploadUrl': MondayMcpEndpoint<'assets.getUploadUrl'>;
	'assets.finalizeUpload': MondayMcpEndpoint<'assets.finalizeUpload'>;
	'meetings.getNotetaker': MondayMcpEndpoint<'meetings.getNotetaker'>;
	'automations.list': MondayMcpEndpoint<'automations.list'>;
	'automations.manage': MondayMcpEndpoint<'automations.manage'>;
	'automations.create': MondayMcpEndpoint<'automations.create'>;
	'workflows.plan': MondayMcpEndpoint<'workflows.plan'>;
	'workflows.create': MondayMcpEndpoint<'workflows.create'>;
	'workflows.update': MondayMcpEndpoint<'workflows.update'>;
	'workflows.publish': MondayMcpEndpoint<'workflows.publish'>;
	'agents.manage': MondayMcpEndpoint<'agents.manage'>;
	'agents.manageTriggers': MondayMcpEndpoint<'agents.manageTriggers'>;
	'agents.manageSkills': MondayMcpEndpoint<'agents.manageSkills'>;
	'agents.manageKnowledge': MondayMcpEndpoint<'agents.manageKnowledge'>;
	'agents.catalog': MondayMcpEndpoint<'agents.catalog'>;
	'sprints.getBoards': MondayMcpEndpoint<'sprints.getBoards'>;
	'sprints.getMetadata': MondayMcpEndpoint<'sprints.getMetadata'>;
	'sprints.getSummary': MondayMcpEndpoint<'sprints.getSummary'>;
	'schema.executeQuery': MondayMcpEndpoint<'schema.executeQuery'>;
	'schema.getGraphqlSchema': MondayMcpEndpoint<'schema.getGraphqlSchema'>;
	'schema.getTypeDetails': MondayMcpEndpoint<'schema.getTypeDetails'>;
};

export const mondayMcpEndpointSchemas = {
	'boards.create': {
		input: MondayMcpEndpointInputSchemas['boards.create'],
		output: MondayMcpEndpointOutputSchemas['boards.create'],
	},
	'boards.getInfo': {
		input: MondayMcpEndpointInputSchemas['boards.getInfo'],
		output: MondayMcpEndpointOutputSchemas['boards.getInfo'],
	},
	'boards.getItemsPage': {
		input: MondayMcpEndpointInputSchemas['boards.getItemsPage'],
		output: MondayMcpEndpointOutputSchemas['boards.getItemsPage'],
	},
	'boards.getActivity': {
		input: MondayMcpEndpointInputSchemas['boards.getActivity'],
		output: MondayMcpEndpointOutputSchemas['boards.getActivity'],
	},
	'boards.insights': {
		input: MondayMcpEndpointInputSchemas['boards.insights'],
		output: MondayMcpEndpointOutputSchemas['boards.insights'],
	},
	'groups.create': {
		input: MondayMcpEndpointInputSchemas['groups.create'],
		output: MondayMcpEndpointOutputSchemas['groups.create'],
	},
	'columns.create': {
		input: MondayMcpEndpointInputSchemas['columns.create'],
		output: MondayMcpEndpointOutputSchemas['columns.create'],
	},
	'columns.getTypeInfo': {
		input: MondayMcpEndpointInputSchemas['columns.getTypeInfo'],
		output: MondayMcpEndpointOutputSchemas['columns.getTypeInfo'],
	},
	'items.create': {
		input: MondayMcpEndpointInputSchemas['items.create'],
		output: MondayMcpEndpointOutputSchemas['items.create'],
	},
	'items.changeColumnValues': {
		input: MondayMcpEndpointInputSchemas['items.changeColumnValues'],
		output: MondayMcpEndpointOutputSchemas['items.changeColumnValues'],
	},
	'workspaces.create': {
		input: MondayMcpEndpointInputSchemas['workspaces.create'],
		output: MondayMcpEndpointOutputSchemas['workspaces.create'],
	},
	'workspaces.update': {
		input: MondayMcpEndpointInputSchemas['workspaces.update'],
		output: MondayMcpEndpointOutputSchemas['workspaces.update'],
	},
	'workspaces.list': {
		input: MondayMcpEndpointInputSchemas['workspaces.list'],
		output: MondayMcpEndpointOutputSchemas['workspaces.list'],
	},
	'workspaces.getInfo': {
		input: MondayMcpEndpointInputSchemas['workspaces.getInfo'],
		output: MondayMcpEndpointOutputSchemas['workspaces.getInfo'],
	},
	'folders.create': {
		input: MondayMcpEndpointInputSchemas['folders.create'],
		output: MondayMcpEndpointOutputSchemas['folders.create'],
	},
	'folders.update': {
		input: MondayMcpEndpointInputSchemas['folders.update'],
		output: MondayMcpEndpointOutputSchemas['folders.update'],
	},
	'folders.moveObject': {
		input: MondayMcpEndpointInputSchemas['folders.moveObject'],
		output: MondayMcpEndpointOutputSchemas['folders.moveObject'],
	},
	'docs.create': {
		input: MondayMcpEndpointInputSchemas['docs.create'],
		output: MondayMcpEndpointOutputSchemas['docs.create'],
	},
	'docs.update': {
		input: MondayMcpEndpointInputSchemas['docs.update'],
		output: MondayMcpEndpointOutputSchemas['docs.update'],
	},
	'docs.read': {
		input: MondayMcpEndpointInputSchemas['docs.read'],
		output: MondayMcpEndpointOutputSchemas['docs.read'],
	},
	'dashboards.create': {
		input: MondayMcpEndpointInputSchemas['dashboards.create'],
		output: MondayMcpEndpointOutputSchemas['dashboards.create'],
	},
	'dashboards.createWidget': {
		input: MondayMcpEndpointInputSchemas['dashboards.createWidget'],
		output: MondayMcpEndpointOutputSchemas['dashboards.createWidget'],
	},
	'dashboards.allWidgetsSchema': {
		input: MondayMcpEndpointInputSchemas['dashboards.allWidgetsSchema'],
		output: MondayMcpEndpointOutputSchemas['dashboards.allWidgetsSchema'],
	},
	'views.create': {
		input: MondayMcpEndpointInputSchemas['views.create'],
		output: MondayMcpEndpointOutputSchemas['views.create'],
	},
	'views.update': {
		input: MondayMcpEndpointInputSchemas['views.update'],
		output: MondayMcpEndpointOutputSchemas['views.update'],
	},
	'views.createTable': {
		input: MondayMcpEndpointInputSchemas['views.createTable'],
		output: MondayMcpEndpointOutputSchemas['views.createTable'],
	},
	'views.updateTable': {
		input: MondayMcpEndpointInputSchemas['views.updateTable'],
		output: MondayMcpEndpointOutputSchemas['views.updateTable'],
	},
	'forms.create': {
		input: MondayMcpEndpointInputSchemas['forms.create'],
		output: MondayMcpEndpointOutputSchemas['forms.create'],
	},
	'forms.get': {
		input: MondayMcpEndpointInputSchemas['forms.get'],
		output: MondayMcpEndpointOutputSchemas['forms.get'],
	},
	'forms.update': {
		input: MondayMcpEndpointInputSchemas['forms.update'],
		output: MondayMcpEndpointOutputSchemas['forms.update'],
	},
	'forms.editQuestions': {
		input: MondayMcpEndpointInputSchemas['forms.editQuestions'],
		output: MondayMcpEndpointOutputSchemas['forms.editQuestions'],
	},
	'forms.createSubmission': {
		input: MondayMcpEndpointInputSchemas['forms.createSubmission'],
		output: MondayMcpEndpointOutputSchemas['forms.createSubmission'],
	},
	'users.getContext': {
		input: MondayMcpEndpointInputSchemas['users.getContext'],
		output: MondayMcpEndpointOutputSchemas['users.getContext'],
	},
	'users.listAndTeams': {
		input: MondayMcpEndpointInputSchemas['users.listAndTeams'],
		output: MondayMcpEndpointOutputSchemas['users.listAndTeams'],
	},
	'updates.create': {
		input: MondayMcpEndpointInputSchemas['updates.create'],
		output: MondayMcpEndpointOutputSchemas['updates.create'],
	},
	'updates.list': {
		input: MondayMcpEndpointInputSchemas['updates.list'],
		output: MondayMcpEndpointOutputSchemas['updates.list'],
	},
	'notifications.create': {
		input: MondayMcpEndpointInputSchemas['notifications.create'],
		output: MondayMcpEndpointOutputSchemas['notifications.create'],
	},
	'search.query': {
		input: MondayMcpEndpointInputSchemas['search.query'],
		output: MondayMcpEndpointOutputSchemas['search.query'],
	},
	'assets.get': {
		input: MondayMcpEndpointInputSchemas['assets.get'],
		output: MondayMcpEndpointOutputSchemas['assets.get'],
	},
	'assets.getUploadUrl': {
		input: MondayMcpEndpointInputSchemas['assets.getUploadUrl'],
		output: MondayMcpEndpointOutputSchemas['assets.getUploadUrl'],
	},
	'assets.finalizeUpload': {
		input: MondayMcpEndpointInputSchemas['assets.finalizeUpload'],
		output: MondayMcpEndpointOutputSchemas['assets.finalizeUpload'],
	},
	'meetings.getNotetaker': {
		input: MondayMcpEndpointInputSchemas['meetings.getNotetaker'],
		output: MondayMcpEndpointOutputSchemas['meetings.getNotetaker'],
	},
	'automations.list': {
		input: MondayMcpEndpointInputSchemas['automations.list'],
		output: MondayMcpEndpointOutputSchemas['automations.list'],
	},
	'automations.manage': {
		input: MondayMcpEndpointInputSchemas['automations.manage'],
		output: MondayMcpEndpointOutputSchemas['automations.manage'],
	},
	'automations.create': {
		input: MondayMcpEndpointInputSchemas['automations.create'],
		output: MondayMcpEndpointOutputSchemas['automations.create'],
	},
	'workflows.plan': {
		input: MondayMcpEndpointInputSchemas['workflows.plan'],
		output: MondayMcpEndpointOutputSchemas['workflows.plan'],
	},
	'workflows.create': {
		input: MondayMcpEndpointInputSchemas['workflows.create'],
		output: MondayMcpEndpointOutputSchemas['workflows.create'],
	},
	'workflows.update': {
		input: MondayMcpEndpointInputSchemas['workflows.update'],
		output: MondayMcpEndpointOutputSchemas['workflows.update'],
	},
	'workflows.publish': {
		input: MondayMcpEndpointInputSchemas['workflows.publish'],
		output: MondayMcpEndpointOutputSchemas['workflows.publish'],
	},
	'agents.manage': {
		input: MondayMcpEndpointInputSchemas['agents.manage'],
		output: MondayMcpEndpointOutputSchemas['agents.manage'],
	},
	'agents.manageTriggers': {
		input: MondayMcpEndpointInputSchemas['agents.manageTriggers'],
		output: MondayMcpEndpointOutputSchemas['agents.manageTriggers'],
	},
	'agents.manageSkills': {
		input: MondayMcpEndpointInputSchemas['agents.manageSkills'],
		output: MondayMcpEndpointOutputSchemas['agents.manageSkills'],
	},
	'agents.manageKnowledge': {
		input: MondayMcpEndpointInputSchemas['agents.manageKnowledge'],
		output: MondayMcpEndpointOutputSchemas['agents.manageKnowledge'],
	},
	'agents.catalog': {
		input: MondayMcpEndpointInputSchemas['agents.catalog'],
		output: MondayMcpEndpointOutputSchemas['agents.catalog'],
	},
	'sprints.getBoards': {
		input: MondayMcpEndpointInputSchemas['sprints.getBoards'],
		output: MondayMcpEndpointOutputSchemas['sprints.getBoards'],
	},
	'sprints.getMetadata': {
		input: MondayMcpEndpointInputSchemas['sprints.getMetadata'],
		output: MondayMcpEndpointOutputSchemas['sprints.getMetadata'],
	},
	'sprints.getSummary': {
		input: MondayMcpEndpointInputSchemas['sprints.getSummary'],
		output: MondayMcpEndpointOutputSchemas['sprints.getSummary'],
	},
	'schema.executeQuery': {
		input: MondayMcpEndpointInputSchemas['schema.executeQuery'],
		output: MondayMcpEndpointOutputSchemas['schema.executeQuery'],
	},
	'schema.getGraphqlSchema': {
		input: MondayMcpEndpointInputSchemas['schema.getGraphqlSchema'],
		output: MondayMcpEndpointOutputSchemas['schema.getGraphqlSchema'],
	},
	'schema.getTypeDetails': {
		input: MondayMcpEndpointInputSchemas['schema.getTypeDetails'],
		output: MondayMcpEndpointOutputSchemas['schema.getTypeDetails'],
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof mondayMcpEndpointsNested
>;

const defaultAuthType: AuthTypes = 'api_key' as const;

export const mondayMcpEndpointMeta = {
	'boards.create': {
		riskLevel: 'write',
		description: 'Creates a new monday.com board in a specified workspace with configurable visibility, description, and ownership using the Platform MCP.',
	},
	'boards.getInfo': {
		riskLevel: 'read',
		description: 'Returns comprehensive metadata for a board, including its columns, groups, views, owners, and workspace details using the Platform MCP.',
	},
	'boards.getItemsPage': {
		riskLevel: 'read',
		description: 'Retrieves items from a board with pagination, optional column values, filters, sorting, and sub-item support using the Platform MCP.',
	},
	'boards.getActivity': {
		riskLevel: 'read',
		description: 'Returns the activity log for a board, showing what changed, when, and by whom, over a configurable time range using the Platform MCP.',
	},
	'boards.insights': {
		riskLevel: 'read',
		description: 'Calculates aggregated summaries of board data by filtering, grouping, and applying aggregation functions to columns using the Platform MCP.',
	},
	'groups.create': {
		riskLevel: 'write',
		description: 'Creates a new group (section) in a monday.com board with an optional color and position relative to existing groups using the Platform MCP.',
	},
	'columns.create': {
		riskLevel: 'write',
		description: 'Adds a new column of a specified type to a monday.com board, with an optional title, description, and type-specific settings using the Platform MCP.',
	},
	'columns.getTypeInfo': {
		riskLevel: 'read',
		description: 'Returns the JSON settings schema or filter/aggregation guidelines for a specific monday.com column type using the Platform MCP.',
	},
	'items.create': {
		riskLevel: 'write',
		description: 'Creates a new item on a board, optionally with column values, as a sub-item under a parent, or as a duplicate of an existing item using the Platform MCP.',
	},
	'items.changeColumnValues': {
		riskLevel: 'write',
		description: 'Updates one or more column values on an existing monday.com item in a single call using the Platform MCP.',
	},
	'workspaces.create': {
		riskLevel: 'write',
		description: 'Creates a new workspace in your monday.com account with a specified name, kind, and optional description using the Platform MCP.',
	},
	'workspaces.update': {
		riskLevel: 'write',
		description: 'Updates the name, description, kind, or account product association of an existing workspace using the Platform MCP.',
	},
	'workspaces.list': {
		riskLevel: 'read',
		description: 'Returns a paginated list of all workspaces available to the authenticated user, including their IDs, names, and descriptions using the Platform MCP.',
	},
	'workspaces.getInfo': {
		riskLevel: 'read',
		description: 'Returns the boards, docs, and folders inside a workspace, including which folder each item belongs to using the Platform MCP.',
	},
	'folders.create': {
		riskLevel: 'write',
		description: 'Creates a new folder inside a monday.com workspace, with optional color, icon, font weight, and parent folder settings using the Platform MCP.',
	},
	'folders.update': {
		riskLevel: 'write',
		description: 'Updates the name, color, icon, position, or parent of an existing folder in monday.com using the Platform MCP.',
	},
	'folders.moveObject': {
		riskLevel: 'write',
		description: 'Moves a board, folder, or overview to a different position, parent folder, or workspace in monday.com using the Platform MCP.',
	},
	'docs.create': {
		riskLevel: 'write',
		description: 'Creates a new monday.com document in a workspace or attached to a board item, then populates it with the provided markdown content using the Platform MCP.',
	},
	'docs.update': {
		riskLevel: 'write',
		description: 'Updates an existing monday.com document by executing an ordered list of operations such as appending content, renaming, editing blocks, or adding comments using the Platform MCP.',
	},
	'docs.read': {
		riskLevel: 'read',
		description: 'Retrieves monday.com documents with their full markdown content and block structure, or fetches the version history of a single document using the Platform MCP.',
	},
	'dashboards.create': {
		riskLevel: 'write',
		description: 'Creates a new monday.com dashboard that aggregates and visualizes data from one or more boards using the Platform MCP.',
	},
	'dashboards.createWidget': {
		riskLevel: 'write',
		description: 'Adds a new data visualization widget to a monday.com dashboard or board view with type-specific configuration settings using the Platform MCP.',
	},
	'dashboards.allWidgetsSchema': {
		riskLevel: 'read',
		description: 'Returns the complete JSON Schema definitions for all available widget types in monday.com, including required fields, data types, and configuration options using the Platform MCP.',
	},
	'views.create': {
		riskLevel: 'write',
		description: 'Creates a new board view (tab) with optional filters and sorting on a monday.com board using the Platform MCP.',
	},
	'views.update': {
		riskLevel: 'write',
		description: 'Updates an existing board view (tab) — its name, filters, or sort order — on a monday.com board using the Platform MCP.',
	},
	'views.createTable': {
		riskLevel: 'write',
		description: 'Creates a new table-type board view with filters, sort, tags, and table-specific settings (column visibility/order and group-by) using the Platform MCP.',
	},
	'views.updateTable': {
		riskLevel: 'write',
		description: 'Updates an existing table-type board view — name, filters, sort, tags, or table-specific settings (column visibility/order and group-by) using the Platform MCP.',
	},
	'forms.create': {
		riskLevel: 'write',
		description: 'Creates a new monday.com WorkForm and a backing board to store responses, returning a form token for subsequent form operations using the Platform MCP.',
	},
	'forms.get': {
		riskLevel: 'read',
		description: 'Retrieves the full structure of a monday.com WorkForm by its form token, including all questions, settings, appearance, and features using the Platform MCP.',
	},
	'forms.update': {
		riskLevel: 'write',
		description: 'Updates a monday.com WorkForm\'s settings, appearance, features, tags, or question order using a single action-based call using the Platform MCP.',
	},
	'forms.editQuestions': {
		riskLevel: 'write',
		description: 'Creates, updates, or deletes a single question on a monday.com WorkForm, with support for 23 question types and conditional visibility rules using the Platform MCP.',
	},
	'forms.createSubmission': {
		riskLevel: 'write',
		description: 'Submits a completed response to a monday.com WorkForm, creating a new item on the form\'s backing board with the provided answers using the Platform MCP.',
	},
	'users.getContext': {
		riskLevel: 'read',
		description: 'Returns information about the currently authenticated user, their account, and their most relevant boards, people, and workspaces using the Platform MCP.',
	},
	'users.listAndTeams': {
		riskLevel: 'read',
		description: 'Fetches user profiles and team data from the account, with several targeting modes for looking up specific users or teams efficiently using the Platform MCP.',
	},
	'updates.create': {
		riskLevel: 'write',
		description: 'Posts a new update (comment) on a monday.com item, with support for mentions and threaded replies using the Platform MCP.',
	},
	'updates.list': {
		riskLevel: 'read',
		description: 'Retrieves updates (comments and posts) from a monday.com item or board, with optional filtering by date range, replies, and file attachments using the Platform MCP.',
	},
	'notifications.create': {
		riskLevel: 'write',
		description: 'Sends a notification to a user via the monday.com bell icon, with an optional email, targeting an update/reply or an item/board using the Platform MCP.',
	},
	'search.query': {
		riskLevel: 'read',
		description: 'Searches across monday.com for boards, documents, or folders by keyword, with optional filtering by workspace using the Platform MCP.',
	},
	'assets.get': {
		riskLevel: 'read',
		description: 'Retrieves file metadata for one or more monday.com assets by their IDs, including download URL, thumbnail, size, and uploader information using the Platform MCP.',
	},
	'assets.getUploadUrl': {
		riskLevel: 'write',
		description: 'Returns a presigned URL to upload a file to monday.com, the first step in attaching a file to an item using the Platform MCP.',
	},
	'assets.finalizeUpload': {
		riskLevel: 'write',
		description: 'Completes a file upload started with get_asset_upload_url, creates the asset, and attaches it to an item\'s file column using the Platform MCP.',
	},
	'meetings.getNotetaker': {
		riskLevel: 'read',
		description: 'Retrieves notetaker meetings from the monday.com AI Notetaker, with optional filters for access level, summaries, topics, action items, and transcripts using the Platform MCP.',
	},
	'automations.list': {
		riskLevel: 'read',
		description: 'Lists all automations on a specific monday.com board, including their IDs, titles, active state, and configuration, using the Platform MCP.',
	},
	'automations.manage': {
		riskLevel: 'destructive',
		description: 'Activates, deactivates, or deletes an existing monday.com automation using the Platform MCP.',
	},
	'automations.create': {
		riskLevel: 'write',
		description: 'Creates an automation on a monday.com board from a structured natural-language description using the Platform MCP.',
	},
	'workflows.plan': {
		riskLevel: 'read',
		description: 'Plans one or more monday.com workflows for a described process using an AI agent, returning a structured implementation plan, via the Platform MCP.',
	},
	'workflows.create': {
		riskLevel: 'write',
		description: 'Creates a new empty workflow in a monday.com workspace using the Platform MCP, returning the workflow object ID and draft ID.',
	},
	'workflows.update': {
		riskLevel: 'write',
		description: 'Updates an existing workflow draft using an AI agent that interprets a natural-language prompt and applies structural changes, via the Platform MCP.',
	},
	'workflows.publish': {
		riskLevel: 'write',
		description: 'Publishes a workflow draft, promoting it to the live version so it starts running, using the Platform MCP.',
	},
	'agents.manage': {
		riskLevel: 'destructive',
		description: 'Full lifecycle management for monday platform agents — create, read, update, delete, change state, and run — using the Platform MCP.',
	},
	'agents.manageTriggers': {
		riskLevel: 'write',
		description: 'Lists, adds, or removes the triggers attached to a monday platform agent — triggers define when the agent runs automatically — using the Platform MCP.',
	},
	'agents.manageSkills': {
		riskLevel: 'write',
		description: 'Creates skills in the account catalog and attaches or detaches them from a monday platform agent using the Platform MCP.',
	},
	'agents.manageKnowledge': {
		riskLevel: 'write',
		description: 'Lists, grants, updates, or revokes a monday platform agent\'s access to boards and docs using the Platform MCP.',
	},
	'agents.catalog': {
		riskLevel: 'read',
		description: 'Browses the account-wide catalog of available trigger types and skills for monday platform agents using the Platform MCP.',
	},
	'sprints.getBoards': {
		riskLevel: 'read',
		description: 'Discovers monday Dev sprint boards and their paired tasks boards in your account using the Platform MCP.',
	},
	'sprints.getMetadata': {
		riskLevel: 'read',
		description: 'Returns a table of sprints from a monday Dev sprints board, including timeline, status, and completion data for each sprint using the Platform MCP.',
	},
	'sprints.getSummary': {
		riskLevel: 'read',
		description: 'Returns a complete AI-generated performance summary and analysis for a completed monday Dev sprint using the Platform MCP.',
	},
	'schema.executeQuery': {
		riskLevel: 'destructive',
		description: 'Executes any monday.com GraphQL query or mutation dynamically. The most flexible tool in the Platform MCP, giving direct access to the full monday.com API surface.',
	},
	'schema.getGraphqlSchema': {
		riskLevel: 'read',
		description: 'Fetches the monday.com GraphQL schema structure, including all available query fields, mutation fields, and a list of every type in the schema using the Platform MCP.',
	},
	'schema.getTypeDetails': {
		riskLevel: 'read',
		description: 'Returns the full field list and type information for a specific GraphQL type in the monday.com API schema using the Platform MCP.',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof mondayMcpEndpointsNested
>;

export const mondayMcpAuthConfig = {
	api_key: {
		account: [] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseMondayMcpPlugin<T extends MondayMcpPluginOptions> =
	CorsairPlugin<
		'mondaymcp',
		typeof MondayMcpSchema,
		typeof mondayMcpEndpointsNested,
		Record<string, never>,
		T,
		typeof defaultAuthType
	>;

export type InternalMondayMcpPlugin =
	BaseMondayMcpPlugin<MondayMcpPluginOptions>;

export type ExternalMondayMcpPlugin<T extends MondayMcpPluginOptions> =
	BaseMondayMcpPlugin<T>;

export function mondaymcp<const T extends MondayMcpPluginOptions>(
	incomingOptions: MondayMcpPluginOptions &
		T = {} as MondayMcpPluginOptions & T,
): ExternalMondayMcpPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'mondaymcp',
		authConfig: mondayMcpAuthConfig,
		schema: MondayMcpSchema,
		options,
		hooks: options.hooks,
		webhookHooks: undefined,
		endpoints: mondayMcpEndpointsNested,
		webhooks: {} as const,
		endpointMeta: mondayMcpEndpointMeta,
		endpointSchemas: mondayMcpEndpointSchemas,
		webhookSchemas: {} as const,
		pluginWebhookMatcher: undefined,
		errorHandlers: (() => {
			const { DEFAULT: defaultHandler, ...specificDefaults } = errorHandlers;
			return {
				...specificDefaults,
				...(options.errorHandlers || {}),
				DEFAULT: options.errorHandlers?.DEFAULT || defaultHandler,
			};
		})(),
		keyBuilder: async (ctx: MondayMcpKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const apiKey = await ctx.keys.get_api_key();
				if (!apiKey) {
					throw new AuthMissingError('mondaymcp', 'api_key');
				}
				return apiKey;
			}

			throw new AuthMissingError('mondaymcp', 'api_key');
		},
	} satisfies InternalMondayMcpPlugin;
}

export type {
	MondayMcpEndpointInputs,
	MondayMcpEndpointOutputs,
} from './endpoints/types';
