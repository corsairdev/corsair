import type {
	AuthTypes,
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
import { AuthMissingError } from 'corsair/core';
import {
	Attachments,
	Columns,
	Docs,
	Orgs,
	Profile,
	Records,
	ServiceAccounts,
	Session,
	Sql,
	Tables,
	Templates,
	Users,
	Widgets,
	Workspaces,
} from './endpoints';
import type {
	GristEndpointInputs,
	GristEndpointOutputs,
} from './endpoints/types';
import {
	GristEndpointInputSchemas,
	GristEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { GristSchema } from './schema';

export type GristPluginOptions = {
	authType?: PickAuth<'api_key'>;
	apiKey?: string;
	key?: string;
	baseUrl?: string;
	hooks?: InternalGristPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof gristEndpointsNested>;
};

export type GristContext = CorsairPluginContext<
	typeof GristSchema,
	GristPluginOptions
>;

export type GristKeyBuilderContext = KeyBuilderContext<GristPluginOptions>;

export type GristBoundEndpoints = BindEndpoints<typeof gristEndpointsNested>;

export type GristEndpoint<K extends keyof GristEndpointOutputs> =
	CorsairEndpoint<
		GristContext,
		GristEndpointInputs[K],
		GristEndpointOutputs[K]
	>;

export type GristEndpoints = {
	[K in keyof GristEndpointOutputs]: GristEndpoint<K>;
};

const gristEndpointsNested = {
	orgs: {
		list: Orgs.list,
		get: Orgs.get,
		update: Orgs.update,
		delete: Orgs.deleteOrg,
		listAccess: Orgs.listAccess,
		modifyAccess: Orgs.modifyAccess,
		getUsage: Orgs.getUsage,
	},
	workspaces: {
		list: Workspaces.list,
		create: Workspaces.create,
		get: Workspaces.get,
		update: Workspaces.update,
		delete: Workspaces.deleteWorkspace,
		remove: Workspaces.remove,
		unremove: Workspaces.unremove,
		listAccess: Workspaces.listAccess,
		modifyAccess: Workspaces.modifyAccess,
	},
	docs: {
		create: Docs.create,
		createInWorkspace: Docs.createInWorkspace,
		get: Docs.get,
		update: Docs.update,
		delete: Docs.deleteDoc,
		remove: Docs.remove,
		unremove: Docs.unremove,
		move: Docs.move,
		pin: Docs.pin,
		unpin: Docs.unpin,
		copy: Docs.copy,
		fork: Docs.fork,
		listAccess: Docs.listAccess,
		modifyAccess: Docs.modifyAccess,
		listSnapshots: Docs.listSnapshots,
		removeSnapshots: Docs.removeSnapshots,
	},
	tables: {
		list: Tables.list,
		create: Tables.create,
		update: Tables.update,
	},
	records: {
		list: Records.list,
		add: Records.add,
		update: Records.update,
		replace: Records.replace,
		delete: Records.deleteRecords,
	},
	columns: {
		list: Columns.list,
		add: Columns.add,
		update: Columns.update,
		replace: Columns.replace,
		delete: Columns.deleteColumn,
	},
	sql: {
		query: Sql.query,
		queryGet: Sql.queryGet,
	},
	attachments: {
		list: Attachments.list,
		get: Attachments.get,
		removeUnused: Attachments.removeUnused,
		updateUsed: Attachments.updateUsed,
		verifyFiles: Attachments.verifyFiles,
		getTransferStatus: Attachments.getTransferStatus,
	},
	profile: {
		get: Profile.get,
		updateName: Profile.updateName,
		updateLocale: Profile.updateLocale,
		getApiKey: Profile.getApiKey,
		createApiKey: Profile.createApiKey,
		deleteApiKey: Profile.deleteApiKey,
	},
	serviceAccounts: {
		list: ServiceAccounts.list,
		create: ServiceAccounts.create,
		get: ServiceAccounts.get,
		update: ServiceAccounts.update,
		delete: ServiceAccounts.deleteServiceAccount,
		regenerateApiKey: ServiceAccounts.regenerateApiKey,
		deleteApiKey: ServiceAccounts.deleteApiKey,
	},
	templates: {
		list: Templates.list,
		get: Templates.get,
	},
	widgets: {
		list: Widgets.list,
	},
	users: {
		disable: Users.disable,
		enable: Users.enable,
		delete: Users.deleteUser,
	},
	session: {
		getActive: Session.getActive,
		getAll: Session.getAll,
		setActive: Session.setActive,
	},
} as const;

export const gristEndpointSchemas = {
	'orgs.list': {
		input: GristEndpointInputSchemas['orgs.list'],
		output: GristEndpointOutputSchemas['orgs.list'],
	},
	'orgs.get': {
		input: GristEndpointInputSchemas['orgs.get'],
		output: GristEndpointOutputSchemas['orgs.get'],
	},
	'orgs.update': {
		input: GristEndpointInputSchemas['orgs.update'],
		output: GristEndpointOutputSchemas['orgs.update'],
	},
	'orgs.delete': {
		input: GristEndpointInputSchemas['orgs.delete'],
		output: GristEndpointOutputSchemas['orgs.delete'],
	},
	'orgs.listAccess': {
		input: GristEndpointInputSchemas['orgs.listAccess'],
		output: GristEndpointOutputSchemas['orgs.listAccess'],
	},
	'orgs.modifyAccess': {
		input: GristEndpointInputSchemas['orgs.modifyAccess'],
		output: GristEndpointOutputSchemas['orgs.modifyAccess'],
	},
	'orgs.getUsage': {
		input: GristEndpointInputSchemas['orgs.getUsage'],
		output: GristEndpointOutputSchemas['orgs.getUsage'],
	},

	'workspaces.list': {
		input: GristEndpointInputSchemas['workspaces.list'],
		output: GristEndpointOutputSchemas['workspaces.list'],
	},
	'workspaces.create': {
		input: GristEndpointInputSchemas['workspaces.create'],
		output: GristEndpointOutputSchemas['workspaces.create'],
	},
	'workspaces.get': {
		input: GristEndpointInputSchemas['workspaces.get'],
		output: GristEndpointOutputSchemas['workspaces.get'],
	},
	'workspaces.update': {
		input: GristEndpointInputSchemas['workspaces.update'],
		output: GristEndpointOutputSchemas['workspaces.update'],
	},
	'workspaces.delete': {
		input: GristEndpointInputSchemas['workspaces.delete'],
		output: GristEndpointOutputSchemas['workspaces.delete'],
	},
	'workspaces.remove': {
		input: GristEndpointInputSchemas['workspaces.remove'],
		output: GristEndpointOutputSchemas['workspaces.remove'],
	},
	'workspaces.unremove': {
		input: GristEndpointInputSchemas['workspaces.unremove'],
		output: GristEndpointOutputSchemas['workspaces.unremove'],
	},
	'workspaces.listAccess': {
		input: GristEndpointInputSchemas['workspaces.listAccess'],
		output: GristEndpointOutputSchemas['workspaces.listAccess'],
	},
	'workspaces.modifyAccess': {
		input: GristEndpointInputSchemas['workspaces.modifyAccess'],
		output: GristEndpointOutputSchemas['workspaces.modifyAccess'],
	},

	'docs.create': {
		input: GristEndpointInputSchemas['docs.create'],
		output: GristEndpointOutputSchemas['docs.create'],
	},
	'docs.createInWorkspace': {
		input: GristEndpointInputSchemas['docs.createInWorkspace'],
		output: GristEndpointOutputSchemas['docs.createInWorkspace'],
	},
	'docs.get': {
		input: GristEndpointInputSchemas['docs.get'],
		output: GristEndpointOutputSchemas['docs.get'],
	},
	'docs.update': {
		input: GristEndpointInputSchemas['docs.update'],
		output: GristEndpointOutputSchemas['docs.update'],
	},
	'docs.delete': {
		input: GristEndpointInputSchemas['docs.delete'],
		output: GristEndpointOutputSchemas['docs.delete'],
	},
	'docs.remove': {
		input: GristEndpointInputSchemas['docs.remove'],
		output: GristEndpointOutputSchemas['docs.remove'],
	},
	'docs.unremove': {
		input: GristEndpointInputSchemas['docs.unremove'],
		output: GristEndpointOutputSchemas['docs.unremove'],
	},
	'docs.move': {
		input: GristEndpointInputSchemas['docs.move'],
		output: GristEndpointOutputSchemas['docs.move'],
	},
	'docs.pin': {
		input: GristEndpointInputSchemas['docs.pin'],
		output: GristEndpointOutputSchemas['docs.pin'],
	},
	'docs.unpin': {
		input: GristEndpointInputSchemas['docs.unpin'],
		output: GristEndpointOutputSchemas['docs.unpin'],
	},
	'docs.copy': {
		input: GristEndpointInputSchemas['docs.copy'],
		output: GristEndpointOutputSchemas['docs.copy'],
	},
	'docs.fork': {
		input: GristEndpointInputSchemas['docs.fork'],
		output: GristEndpointOutputSchemas['docs.fork'],
	},
	'docs.listAccess': {
		input: GristEndpointInputSchemas['docs.listAccess'],
		output: GristEndpointOutputSchemas['docs.listAccess'],
	},
	'docs.modifyAccess': {
		input: GristEndpointInputSchemas['docs.modifyAccess'],
		output: GristEndpointOutputSchemas['docs.modifyAccess'],
	},
	'docs.listSnapshots': {
		input: GristEndpointInputSchemas['docs.listSnapshots'],
		output: GristEndpointOutputSchemas['docs.listSnapshots'],
	},
	'docs.removeSnapshots': {
		input: GristEndpointInputSchemas['docs.removeSnapshots'],
		output: GristEndpointOutputSchemas['docs.removeSnapshots'],
	},

	'tables.list': {
		input: GristEndpointInputSchemas['tables.list'],
		output: GristEndpointOutputSchemas['tables.list'],
	},
	'tables.create': {
		input: GristEndpointInputSchemas['tables.create'],
		output: GristEndpointOutputSchemas['tables.create'],
	},
	'tables.update': {
		input: GristEndpointInputSchemas['tables.update'],
		output: GristEndpointOutputSchemas['tables.update'],
	},

	'records.list': {
		input: GristEndpointInputSchemas['records.list'],
		output: GristEndpointOutputSchemas['records.list'],
	},
	'records.add': {
		input: GristEndpointInputSchemas['records.add'],
		output: GristEndpointOutputSchemas['records.add'],
	},
	'records.update': {
		input: GristEndpointInputSchemas['records.update'],
		output: GristEndpointOutputSchemas['records.update'],
	},
	'records.replace': {
		input: GristEndpointInputSchemas['records.replace'],
		output: GristEndpointOutputSchemas['records.replace'],
	},
	'records.delete': {
		input: GristEndpointInputSchemas['records.delete'],
		output: GristEndpointOutputSchemas['records.delete'],
	},

	'columns.list': {
		input: GristEndpointInputSchemas['columns.list'],
		output: GristEndpointOutputSchemas['columns.list'],
	},
	'columns.add': {
		input: GristEndpointInputSchemas['columns.add'],
		output: GristEndpointOutputSchemas['columns.add'],
	},
	'columns.update': {
		input: GristEndpointInputSchemas['columns.update'],
		output: GristEndpointOutputSchemas['columns.update'],
	},
	'columns.replace': {
		input: GristEndpointInputSchemas['columns.replace'],
		output: GristEndpointOutputSchemas['columns.replace'],
	},
	'columns.delete': {
		input: GristEndpointInputSchemas['columns.delete'],
		output: GristEndpointOutputSchemas['columns.delete'],
	},

	'sql.query': {
		input: GristEndpointInputSchemas['sql.query'],
		output: GristEndpointOutputSchemas['sql.query'],
	},
	'sql.queryGet': {
		input: GristEndpointInputSchemas['sql.queryGet'],
		output: GristEndpointOutputSchemas['sql.queryGet'],
	},

	'attachments.list': {
		input: GristEndpointInputSchemas['attachments.list'],
		output: GristEndpointOutputSchemas['attachments.list'],
	},
	'attachments.get': {
		input: GristEndpointInputSchemas['attachments.get'],
		output: GristEndpointOutputSchemas['attachments.get'],
	},
	'attachments.removeUnused': {
		input: GristEndpointInputSchemas['attachments.removeUnused'],
		output: GristEndpointOutputSchemas['attachments.removeUnused'],
	},
	'attachments.updateUsed': {
		input: GristEndpointInputSchemas['attachments.updateUsed'],
		output: GristEndpointOutputSchemas['attachments.updateUsed'],
	},
	'attachments.verifyFiles': {
		input: GristEndpointInputSchemas['attachments.verifyFiles'],
		output: GristEndpointOutputSchemas['attachments.verifyFiles'],
	},
	'attachments.getTransferStatus': {
		input: GristEndpointInputSchemas['attachments.getTransferStatus'],
		output: GristEndpointOutputSchemas['attachments.getTransferStatus'],
	},

	'profile.get': {
		input: GristEndpointInputSchemas['profile.get'],
		output: GristEndpointOutputSchemas['profile.get'],
	},
	'profile.updateName': {
		input: GristEndpointInputSchemas['profile.updateName'],
		output: GristEndpointOutputSchemas['profile.updateName'],
	},
	'profile.updateLocale': {
		input: GristEndpointInputSchemas['profile.updateLocale'],
		output: GristEndpointOutputSchemas['profile.updateLocale'],
	},
	'profile.getApiKey': {
		input: GristEndpointInputSchemas['profile.getApiKey'],
		output: GristEndpointOutputSchemas['profile.getApiKey'],
	},
	'profile.createApiKey': {
		input: GristEndpointInputSchemas['profile.createApiKey'],
		output: GristEndpointOutputSchemas['profile.createApiKey'],
	},
	'profile.deleteApiKey': {
		input: GristEndpointInputSchemas['profile.deleteApiKey'],
		output: GristEndpointOutputSchemas['profile.deleteApiKey'],
	},

	'serviceAccounts.list': {
		input: GristEndpointInputSchemas['serviceAccounts.list'],
		output: GristEndpointOutputSchemas['serviceAccounts.list'],
	},
	'serviceAccounts.create': {
		input: GristEndpointInputSchemas['serviceAccounts.create'],
		output: GristEndpointOutputSchemas['serviceAccounts.create'],
	},
	'serviceAccounts.get': {
		input: GristEndpointInputSchemas['serviceAccounts.get'],
		output: GristEndpointOutputSchemas['serviceAccounts.get'],
	},
	'serviceAccounts.update': {
		input: GristEndpointInputSchemas['serviceAccounts.update'],
		output: GristEndpointOutputSchemas['serviceAccounts.update'],
	},
	'serviceAccounts.delete': {
		input: GristEndpointInputSchemas['serviceAccounts.delete'],
		output: GristEndpointOutputSchemas['serviceAccounts.delete'],
	},
	'serviceAccounts.regenerateApiKey': {
		input: GristEndpointInputSchemas['serviceAccounts.regenerateApiKey'],
		output: GristEndpointOutputSchemas['serviceAccounts.regenerateApiKey'],
	},
	'serviceAccounts.deleteApiKey': {
		input: GristEndpointInputSchemas['serviceAccounts.deleteApiKey'],
		output: GristEndpointOutputSchemas['serviceAccounts.deleteApiKey'],
	},

	'templates.list': {
		input: GristEndpointInputSchemas['templates.list'],
		output: GristEndpointOutputSchemas['templates.list'],
	},
	'templates.get': {
		input: GristEndpointInputSchemas['templates.get'],
		output: GristEndpointOutputSchemas['templates.get'],
	},

	'widgets.list': {
		input: GristEndpointInputSchemas['widgets.list'],
		output: GristEndpointOutputSchemas['widgets.list'],
	},

	'users.disable': {
		input: GristEndpointInputSchemas['users.disable'],
		output: GristEndpointOutputSchemas['users.disable'],
	},
	'users.enable': {
		input: GristEndpointInputSchemas['users.enable'],
		output: GristEndpointOutputSchemas['users.enable'],
	},
	'users.delete': {
		input: GristEndpointInputSchemas['users.delete'],
		output: GristEndpointOutputSchemas['users.delete'],
	},

	'session.getActive': {
		input: GristEndpointInputSchemas['session.getActive'],
		output: GristEndpointOutputSchemas['session.getActive'],
	},
	'session.getAll': {
		input: GristEndpointInputSchemas['session.getAll'],
		output: GristEndpointOutputSchemas['session.getAll'],
	},
	'session.setActive': {
		input: GristEndpointInputSchemas['session.setActive'],
		output: GristEndpointOutputSchemas['session.setActive'],
	},
} as const satisfies RequiredPluginEndpointSchemas<typeof gristEndpointsNested>;

const gristEndpointMeta = {
	'orgs.list': {
		riskLevel: 'read',
		description: 'List organizations accessible to the authenticated user',
	},
	'orgs.get': {
		riskLevel: 'read',
		description: 'Describe details of a specific organization',
	},
	'orgs.update': {
		riskLevel: 'write',
		description: 'Modify organization metadata such as its name',
	},
	'orgs.delete': {
		riskLevel: 'destructive',
		description: 'Delete an organization by ID and confirmed name',
	},
	'orgs.listAccess': {
		riskLevel: 'read',
		description: 'List users with access permissions to an organization',
	},
	'orgs.modifyAccess': {
		riskLevel: 'write',
		description: 'Change user access roles for an organization',
	},
	'orgs.getUsage': {
		riskLevel: 'read',
		description: 'Get organization resource and storage usage summary',
	},

	'workspaces.list': {
		riskLevel: 'read',
		description: 'List workspaces and their documents within an organization',
	},
	'workspaces.create': {
		riskLevel: 'write',
		description: 'Create a new empty workspace in an organization',
	},
	'workspaces.get': {
		riskLevel: 'read',
		description: 'Describe a workspace and its documents',
	},
	'workspaces.update': {
		riskLevel: 'write',
		description: 'Modify workspace name or settings',
	},
	'workspaces.delete': {
		riskLevel: 'destructive',
		description: 'Permanently delete a workspace',
	},
	'workspaces.remove': {
		riskLevel: 'destructive',
		description: 'Move a workspace to the trash',
	},
	'workspaces.unremove': {
		riskLevel: 'write',
		description: 'Restore a workspace from the trash',
	},
	'workspaces.listAccess': {
		riskLevel: 'read',
		description: 'List users with access permissions to a workspace',
	},
	'workspaces.modifyAccess': {
		riskLevel: 'write',
		description: 'Change user access permissions for a workspace',
	},

	'docs.create': {
		riskLevel: 'write',
		description: 'Create a new Grist document or copy from a template',
	},
	'docs.createInWorkspace': {
		riskLevel: 'write',
		description: 'Create an empty document inside a specific workspace',
	},
	'docs.get': {
		riskLevel: 'read',
		description: 'Describe document metadata and containing workspace',
	},
	'docs.update': {
		riskLevel: 'write',
		description: 'Modify document metadata such as name or pin status',
	},
	'docs.delete': {
		riskLevel: 'destructive',
		description: 'Permanently delete a document',
	},
	'docs.remove': {
		riskLevel: 'destructive',
		description: 'Move a document to the trash',
	},
	'docs.unremove': {
		riskLevel: 'write',
		description: 'Restore a document from the trash',
	},
	'docs.move': {
		riskLevel: 'write',
		description: 'Move a document to a different workspace',
	},
	'docs.pin': {
		riskLevel: 'write',
		description: 'Pin a document for quick access',
	},
	'docs.unpin': {
		riskLevel: 'write',
		description: 'Unpin a document',
	},
	'docs.copy': {
		riskLevel: 'write',
		description: 'Copy a document to a workspace',
	},
	'docs.fork': {
		riskLevel: 'write',
		description: 'Fork a document into a new unsaved document',
	},
	'docs.listAccess': {
		riskLevel: 'read',
		description: 'List users with access permissions to a document',
	},
	'docs.modifyAccess': {
		riskLevel: 'write',
		description: 'Change user access permissions for a document',
	},
	'docs.listSnapshots': {
		riskLevel: 'read',
		description: 'List historical snapshots of a document',
	},
	'docs.removeSnapshots': {
		riskLevel: 'destructive',
		description: 'Remove historical snapshots of a document',
	},

	'tables.list': {
		riskLevel: 'read',
		description: 'List tables within a Grist document',
	},
	'tables.create': {
		riskLevel: 'write',
		description: 'Add new tables and their column definitions to a document',
	},
	'tables.update': {
		riskLevel: 'write',
		description: 'Modify table identifiers or on-demand loading settings',
	},

	'records.list': {
		riskLevel: 'read',
		description: 'Fetch records from a table with filtering and sorting',
	},
	'records.add': {
		riskLevel: 'write',
		description: 'Add new records with field values to a table',
	},
	'records.update': {
		riskLevel: 'write',
		description: 'Modify existing records by record ID in a table',
	},
	'records.replace': {
		riskLevel: 'write',
		description: 'Add or update records matching require criteria (upsert)',
	},
	'records.delete': {
		riskLevel: 'destructive',
		description: 'Delete records by record IDs from a table',
	},

	'columns.list': {
		riskLevel: 'read',
		description: 'List columns and metadata for a table',
	},
	'columns.add': {
		riskLevel: 'write',
		description: 'Add new columns to a table in a document',
	},
	'columns.update': {
		riskLevel: 'write',
		description: 'Modify column configurations or labels in a table',
	},
	'columns.replace': {
		riskLevel: 'write',
		description: 'Add or update column definitions in a table',
	},
	'columns.delete': {
		riskLevel: 'destructive',
		description: 'Delete a column from a table',
	},

	'sql.query': {
		riskLevel: 'read',
		description:
			'Execute a read-only SQL query with parameters against a document',
	},
	'sql.queryGet': {
		riskLevel: 'read',
		description:
			'Execute a simple read-only SQL query via GET against a document',
	},

	'attachments.list': {
		riskLevel: 'read',
		description: 'List metadata for attachments stored in a document',
	},
	'attachments.get': {
		riskLevel: 'read',
		description: 'Get metadata for a specific attachment in a document',
	},
	'attachments.removeUnused': {
		riskLevel: 'destructive',
		description: 'Delete unused attachments from a document',
	},
	'attachments.updateUsed': {
		riskLevel: 'write',
		description: 'Update attachment usage tracking in a document',
	},
	'attachments.verifyFiles': {
		riskLevel: 'read',
		description: 'Verify attachment file integrity for a document',
	},
	'attachments.getTransferStatus': {
		riskLevel: 'read',
		description: 'Get current attachment transfer status for an external store',
	},

	'profile.get': {
		riskLevel: 'read',
		description: 'Get current authenticated user profile',
	},
	'profile.updateName': {
		riskLevel: 'write',
		description: 'Update user display name',
	},
	'profile.updateLocale': {
		riskLevel: 'write',
		description: 'Update user locale preference',
	},
	'profile.getApiKey': {
		riskLevel: 'read',
		description: 'Get the current user API key',
	},
	'profile.createApiKey': {
		riskLevel: 'write',
		description: 'Create or regenerate user API key',
	},
	'profile.deleteApiKey': {
		riskLevel: 'destructive',
		description: 'Delete user API key',
	},

	'serviceAccounts.list': {
		riskLevel: 'read',
		description: 'List all service accounts owned by the user',
	},
	'serviceAccounts.create': {
		riskLevel: 'write',
		description: 'Create a new service account with an API key',
	},
	'serviceAccounts.get': {
		riskLevel: 'read',
		description: 'Get service account details by ID',
	},
	'serviceAccounts.update': {
		riskLevel: 'write',
		description: 'Modify service account name or label',
	},
	'serviceAccounts.delete': {
		riskLevel: 'destructive',
		description: 'Delete a service account',
	},
	'serviceAccounts.regenerateApiKey': {
		riskLevel: 'write',
		description: 'Generate a new API key for a service account',
	},
	'serviceAccounts.deleteApiKey': {
		riskLevel: 'destructive',
		description: 'Delete a service account API key',
	},

	'templates.list': {
		riskLevel: 'read',
		description: 'List available document templates from the catalog',
	},
	'templates.get': {
		riskLevel: 'read',
		description: 'Get details of a specific document template',
	},

	'widgets.list': {
		riskLevel: 'read',
		description: 'List available custom widgets from the gallery',
	},

	'users.disable': {
		riskLevel: 'write',
		description: 'Disable a user account in Grist',
	},
	'users.enable': {
		riskLevel: 'write',
		description: 'Enable a previously disabled user account',
	},
	'users.delete': {
		riskLevel: 'destructive',
		description: 'Delete a user from Grist',
	},

	'session.getActive': {
		riskLevel: 'read',
		description: 'Get active session details and current organization',
	},
	'session.getAll': {
		riskLevel: 'read',
		description: 'Get all logged-in session accounts and organizations',
	},
	'session.setActive': {
		riskLevel: 'write',
		description: 'Switch active user account for an organization',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof gristEndpointsNested>;

const defaultAuthType: AuthTypes = 'api_key' as const;

export const gristAuthConfig = {
	api_key: {},
} as const satisfies PluginAuthConfig;

export type BaseGristPlugin<T extends GristPluginOptions> = CorsairPlugin<
	'grist',
	typeof GristSchema,
	typeof gristEndpointsNested,
	Record<string, never>,
	T,
	typeof defaultAuthType
>;

export type InternalGristPlugin = BaseGristPlugin<GristPluginOptions>;

export type ExternalGristPlugin<T extends GristPluginOptions> =
	BaseGristPlugin<T>;

export function grist<const T extends GristPluginOptions>(
	incomingOptions: GristPluginOptions & T = {} as GristPluginOptions & T,
): ExternalGristPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};

	const { DEFAULT: builtInDefault, ...builtIns } = errorHandlers;
	const { DEFAULT: callerDefault, ...callers } = options.errorHandlers ?? {};

	return {
		id: 'grist',
		authConfig: gristAuthConfig,
		schema: GristSchema,
		options,
		hooks: options.hooks,
		endpoints: gristEndpointsNested,
		webhooks: {},
		endpointMeta: gristEndpointMeta,
		endpointSchemas: gristEndpointSchemas,
		errorHandlers: {
			...callers,
			...builtIns,
			...callers,
			DEFAULT: callerDefault ?? builtInDefault,
		},
		keyBuilder: async (ctx: GristKeyBuilderContext, source) => {
			if (source !== 'endpoint') return '';
			if (options.apiKey) return options.apiKey;
			if (options.key) return options.key;
			if (!ctx.keys) throw new AuthMissingError('grist', 'api_key');
			const apiKey = await ctx.keys.get_api_key();
			if (!apiKey) throw new AuthMissingError('grist', 'api_key');
			return apiKey;
		},
	} satisfies InternalGristPlugin;
}

export type {
	Access,
	Doc,
	GristEndpointInputs,
	GristEndpointOutputs,
	Org,
	User,
	Workspace,
	WorkspaceWithDocs,
} from './endpoints/types';
