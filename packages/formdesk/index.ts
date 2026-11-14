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
import { Connect, Files, Forms, Results, Users, Visitors } from './endpoints';
import type {
	FormdeskEndpointInputs,
	FormdeskEndpointOutputs,
} from './endpoints/types';
import {
	FormdeskEndpointInputSchemas,
	FormdeskEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { FormdeskSchema } from './schema';

export type FormdeskPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalFormdeskPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof formdeskEndpointsNested>;
};

export type FormdeskContext = CorsairPluginContext<
	typeof FormdeskSchema,
	FormdeskPluginOptions
>;

export type FormdeskKeyBuilderContext =
	KeyBuilderContext<FormdeskPluginOptions>;
export type FormdeskBoundEndpoints = BindEndpoints<
	typeof formdeskEndpointsNested
>;

export type FormdeskEndpoint<K extends keyof FormdeskEndpointOutputs> =
	CorsairEndpoint<
		FormdeskContext,
		FormdeskEndpointInputs[K],
		FormdeskEndpointOutputs[K]
	>;

export type FormdeskEndpoints = {
	connectByApiKey: FormdeskEndpoint<'connectByApiKey'>;
	connectWithCredentials: FormdeskEndpoint<'connectWithCredentials'>;
	formsList: FormdeskEndpoint<'formsList'>;
	formsPark: FormdeskEndpoint<'formsPark'>;
	formsItems: FormdeskEndpoint<'formsItems'>;
	formsFilters: FormdeskEndpoint<'formsFilters'>;
	resultsExport: FormdeskEndpoint<'resultsExport'>;
	resultsList: FormdeskEndpoint<'resultsList'>;
	resultsGet: FormdeskEndpoint<'resultsGet'>;
	resultsAdd: FormdeskEndpoint<'resultsAdd'>;
	resultsUpdate: FormdeskEndpoint<'resultsUpdate'>;
	resultsRemove: FormdeskEndpoint<'resultsRemove'>;
	resultsIncrement: FormdeskEndpoint<'resultsIncrement'>;
	resultsMarkProcessed: FormdeskEndpoint<'resultsMarkProcessed'>;
	resultsPdf: FormdeskEndpoint<'resultsPdf'>;
	resultsWorkflows: FormdeskEndpoint<'resultsWorkflows'>;
	resultsFiles: FormdeskEndpoint<'resultsFiles'>;
	resultsAllFiles: FormdeskEndpoint<'resultsAllFiles'>;
	resultsDeleteFiles: FormdeskEndpoint<'resultsDeleteFiles'>;
	resultsDeleteAllFiles: FormdeskEndpoint<'resultsDeleteAllFiles'>;
	usersList: FormdeskEndpoint<'usersList'>;
	usersGet: FormdeskEndpoint<'usersGet'>;
	usersGetExternal: FormdeskEndpoint<'usersGetExternal'>;
	usersAdd: FormdeskEndpoint<'usersAdd'>;
	usersUpdate: FormdeskEndpoint<'usersUpdate'>;
	usersRemove: FormdeskEndpoint<'usersRemove'>;
	usersSignOn: FormdeskEndpoint<'usersSignOn'>;
	visitorsList: FormdeskEndpoint<'visitorsList'>;
	visitorsGet: FormdeskEndpoint<'visitorsGet'>;
	visitorsGetExternal: FormdeskEndpoint<'visitorsGetExternal'>;
	visitorsResults: FormdeskEndpoint<'visitorsResults'>;
	visitorsAdd: FormdeskEndpoint<'visitorsAdd'>;
	visitorsUpdate: FormdeskEndpoint<'visitorsUpdate'>;
	visitorsRemove: FormdeskEndpoint<'visitorsRemove'>;
	visitorsSignOn: FormdeskEndpoint<'visitorsSignOn'>;
	filesList: FormdeskEndpoint<'filesList'>;
	filesGet: FormdeskEndpoint<'filesGet'>;
	filesContent: FormdeskEndpoint<'filesContent'>;
	filesRemove: FormdeskEndpoint<'filesRemove'>;
};

const formdeskEndpointsNested = {
	connect: { apiKey: Connect.apiKey, credentials: Connect.credentials },
	forms: {
		list: Forms.list,
		park: Forms.park,
		items: Forms.items,
		filters: Forms.filters,
	},
	results: {
		export: Results.export,
		list: Results.list,
		get: Results.get,
		add: Results.add,
		update: Results.update,
		remove: Results.remove,
		increment: Results.increment,
		markProcessed: Results.markProcessed,
		pdf: Results.pdf,
		workflows: Results.workflows,
		files: Results.files,
		allFiles: Results.allFiles,
		deleteFiles: Results.deleteFiles,
		deleteAllFiles: Results.deleteAllFiles,
	},
	users: {
		list: Users.list,
		get: Users.get,
		getExternal: Users.getExternal,
		add: Users.add,
		update: Users.update,
		remove: Users.remove,
		signOn: Users.signOn,
	},
	visitors: {
		list: Visitors.list,
		get: Visitors.get,
		getExternal: Visitors.getExternal,
		results: Visitors.results,
		add: Visitors.add,
		update: Visitors.update,
		remove: Visitors.remove,
		signOn: Visitors.signOn,
	},
	files: {
		list: Files.list,
		get: Files.get,
		content: Files.content,
		remove: Files.remove,
	},
} as const;

export const formdeskEndpointSchemas = {
	'connect.apiKey': {
		input: FormdeskEndpointInputSchemas.connectByApiKey,
		output: FormdeskEndpointOutputSchemas.connectByApiKey,
	},
	'connect.credentials': {
		input: FormdeskEndpointInputSchemas.connectWithCredentials,
		output: FormdeskEndpointOutputSchemas.connectWithCredentials,
	},
	'forms.list': {
		input: FormdeskEndpointInputSchemas.formsList,
		output: FormdeskEndpointOutputSchemas.formsList,
	},
	'forms.park': {
		input: FormdeskEndpointInputSchemas.formsPark,
		output: FormdeskEndpointOutputSchemas.formsPark,
	},
	'forms.items': {
		input: FormdeskEndpointInputSchemas.formsItems,
		output: FormdeskEndpointOutputSchemas.formsItems,
	},
	'forms.filters': {
		input: FormdeskEndpointInputSchemas.formsFilters,
		output: FormdeskEndpointOutputSchemas.formsFilters,
	},
	'results.export': {
		input: FormdeskEndpointInputSchemas.resultsExport,
		output: FormdeskEndpointOutputSchemas.resultsExport,
	},
	'results.list': {
		input: FormdeskEndpointInputSchemas.resultsList,
		output: FormdeskEndpointOutputSchemas.resultsList,
	},
	'results.get': {
		input: FormdeskEndpointInputSchemas.resultsGet,
		output: FormdeskEndpointOutputSchemas.resultsGet,
	},
	'results.add': {
		input: FormdeskEndpointInputSchemas.resultsAdd,
		output: FormdeskEndpointOutputSchemas.resultsAdd,
	},
	'results.update': {
		input: FormdeskEndpointInputSchemas.resultsUpdate,
		output: FormdeskEndpointOutputSchemas.resultsUpdate,
	},
	'results.remove': {
		input: FormdeskEndpointInputSchemas.resultsRemove,
		output: FormdeskEndpointOutputSchemas.resultsRemove,
	},
	'results.increment': {
		input: FormdeskEndpointInputSchemas.resultsIncrement,
		output: FormdeskEndpointOutputSchemas.resultsIncrement,
	},
	'results.markProcessed': {
		input: FormdeskEndpointInputSchemas.resultsMarkProcessed,
		output: FormdeskEndpointOutputSchemas.resultsMarkProcessed,
	},
	'results.pdf': {
		input: FormdeskEndpointInputSchemas.resultsPdf,
		output: FormdeskEndpointOutputSchemas.resultsPdf,
	},
	'results.workflows': {
		input: FormdeskEndpointInputSchemas.resultsWorkflows,
		output: FormdeskEndpointOutputSchemas.resultsWorkflows,
	},
	'results.files': {
		input: FormdeskEndpointInputSchemas.resultsFiles,
		output: FormdeskEndpointOutputSchemas.resultsFiles,
	},
	'results.allFiles': {
		input: FormdeskEndpointInputSchemas.resultsAllFiles,
		output: FormdeskEndpointOutputSchemas.resultsAllFiles,
	},
	'results.deleteFiles': {
		input: FormdeskEndpointInputSchemas.resultsDeleteFiles,
		output: FormdeskEndpointOutputSchemas.resultsDeleteFiles,
	},
	'results.deleteAllFiles': {
		input: FormdeskEndpointInputSchemas.resultsDeleteAllFiles,
		output: FormdeskEndpointOutputSchemas.resultsDeleteAllFiles,
	},
	'users.list': {
		input: FormdeskEndpointInputSchemas.usersList,
		output: FormdeskEndpointOutputSchemas.usersList,
	},
	'users.get': {
		input: FormdeskEndpointInputSchemas.usersGet,
		output: FormdeskEndpointOutputSchemas.usersGet,
	},
	'users.getExternal': {
		input: FormdeskEndpointInputSchemas.usersGetExternal,
		output: FormdeskEndpointOutputSchemas.usersGetExternal,
	},
	'users.add': {
		input: FormdeskEndpointInputSchemas.usersAdd,
		output: FormdeskEndpointOutputSchemas.usersAdd,
	},
	'users.update': {
		input: FormdeskEndpointInputSchemas.usersUpdate,
		output: FormdeskEndpointOutputSchemas.usersUpdate,
	},
	'users.remove': {
		input: FormdeskEndpointInputSchemas.usersRemove,
		output: FormdeskEndpointOutputSchemas.usersRemove,
	},
	'users.signOn': {
		input: FormdeskEndpointInputSchemas.usersSignOn,
		output: FormdeskEndpointOutputSchemas.usersSignOn,
	},
	'visitors.list': {
		input: FormdeskEndpointInputSchemas.visitorsList,
		output: FormdeskEndpointOutputSchemas.visitorsList,
	},
	'visitors.get': {
		input: FormdeskEndpointInputSchemas.visitorsGet,
		output: FormdeskEndpointOutputSchemas.visitorsGet,
	},
	'visitors.getExternal': {
		input: FormdeskEndpointInputSchemas.visitorsGetExternal,
		output: FormdeskEndpointOutputSchemas.visitorsGetExternal,
	},
	'visitors.results': {
		input: FormdeskEndpointInputSchemas.visitorsResults,
		output: FormdeskEndpointOutputSchemas.visitorsResults,
	},
	'visitors.add': {
		input: FormdeskEndpointInputSchemas.visitorsAdd,
		output: FormdeskEndpointOutputSchemas.visitorsAdd,
	},
	'visitors.update': {
		input: FormdeskEndpointInputSchemas.visitorsUpdate,
		output: FormdeskEndpointOutputSchemas.visitorsUpdate,
	},
	'visitors.remove': {
		input: FormdeskEndpointInputSchemas.visitorsRemove,
		output: FormdeskEndpointOutputSchemas.visitorsRemove,
	},
	'visitors.signOn': {
		input: FormdeskEndpointInputSchemas.visitorsSignOn,
		output: FormdeskEndpointOutputSchemas.visitorsSignOn,
	},
	'files.list': {
		input: FormdeskEndpointInputSchemas.filesList,
		output: FormdeskEndpointOutputSchemas.filesList,
	},
	'files.get': {
		input: FormdeskEndpointInputSchemas.filesGet,
		output: FormdeskEndpointOutputSchemas.filesGet,
	},
	'files.content': {
		input: FormdeskEndpointInputSchemas.filesContent,
		output: FormdeskEndpointOutputSchemas.filesContent,
	},
	'files.remove': {
		input: FormdeskEndpointInputSchemas.filesRemove,
		output: FormdeskEndpointOutputSchemas.filesRemove,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof formdeskEndpointsNested
>;

const defaultAuthType: AuthTypes = 'api_key';
const PUBLIC_ENDPOINTS = new Set(['connect.credentials']);

const formdeskEndpointMeta = {
	'connect.apiKey': {
		riskLevel: 'read',
		description:
			'Resolve the tenant host using the stored API key (Connect is free)',
	},
	'connect.credentials': {
		riskLevel: 'read',
		description:
			'Resolve the tenant host and API key from Formdesk credentials (free)',
	},
	'forms.list': {
		riskLevel: 'read',
		description: 'List forms (1 API credit per call)',
	},
	'forms.park': {
		riskLevel: 'write',
		description: 'Create a prefill parking ticket (1 API credit per call)',
	},
	'forms.items': {
		riskLevel: 'read',
		description: 'List input items on a form (1 API credit per call)',
	},
	'forms.filters': {
		riskLevel: 'read',
		description: 'List saved filter names (1 API credit per call)',
	},
	'results.export': {
		riskLevel: 'read',
		description:
			'Export form results; credits equal completed forms downloaded',
	},
	'results.list': {
		riskLevel: 'read',
		description: 'List form result IDs (1 API credit per call)',
	},
	'results.get': {
		riskLevel: 'read',
		description: 'Retrieve a form result (1 API credit per call)',
	},
	'results.add': {
		riskLevel: 'write',
		description: 'Add up to 10 form results (1 API credit per call)',
	},
	'results.update': {
		riskLevel: 'write',
		description: 'Update a form result (1 API credit per call)',
	},
	'results.remove': {
		riskLevel: 'destructive',
		description:
			'Remove a form result; deleted entries may remain retrievable for 30 days (1 API credit per call)',
	},
	'results.increment': {
		riskLevel: 'write',
		description: 'Atomically increment a numeric field (1 API credit per call)',
	},
	'results.markProcessed': {
		riskLevel: 'write',
		description:
			'Mark a result processed for synchronization (no credit charge)',
	},
	'results.pdf': {
		riskLevel: 'read',
		description: 'Generate a completed-form PDF (1 API credit per call)',
	},
	'results.workflows': {
		riskLevel: 'read',
		description: 'List result workflows (1 API credit per call)',
	},
	'results.files': {
		riskLevel: 'read',
		description: 'List files attached to a result (1 API credit per call)',
	},
	'results.allFiles': {
		riskLevel: 'read',
		description:
			'List files attached to a form’s results (1 API credit per call)',
	},
	'results.deleteFiles': {
		riskLevel: 'destructive',
		description: 'Delete files attached to a result (1 API credit per call)',
	},
	'results.deleteAllFiles': {
		riskLevel: 'destructive',
		description:
			'Delete all files attached to a form’s results (1 API credit per call)',
	},
	'users.list': {
		riskLevel: 'read',
		description: 'List Formdesk users (1 API credit per call)',
	},
	'users.get': {
		riskLevel: 'read',
		description: 'Retrieve a user by ID (1 API credit per call)',
	},
	'users.getExternal': {
		riskLevel: 'read',
		description:
			'Retrieve an external user by provider ID (1 API credit per call)',
	},
	'users.add': {
		riskLevel: 'write',
		description: 'Create a Formdesk user (1 API credit per call)',
	},
	'users.update': {
		riskLevel: 'write',
		description: 'Update a Formdesk user (1 API credit per call)',
	},
	'users.remove': {
		riskLevel: 'destructive',
		description: 'Permanently remove a Formdesk user (1 API credit per call)',
	},
	'users.signOn': {
		riskLevel: 'write',
		description: 'Create a user single sign-on link (1 API credit per call)',
	},
	'visitors.list': {
		riskLevel: 'read',
		description: 'List form visitors (1 API credit per call)',
	},
	'visitors.get': {
		riskLevel: 'read',
		description: 'Retrieve a visitor by ID (1 API credit per call)',
	},
	'visitors.getExternal': {
		riskLevel: 'read',
		description:
			'Retrieve an external visitor by provider ID (1 API credit per call)',
	},
	'visitors.results': {
		riskLevel: 'read',
		description: 'List a visitor’s form result IDs (1 API credit per call)',
	},
	'visitors.add': {
		riskLevel: 'write',
		description: 'Create a form visitor (1 API credit per call)',
	},
	'visitors.update': {
		riskLevel: 'write',
		description: 'Update a form visitor (1 API credit per call)',
	},
	'visitors.remove': {
		riskLevel: 'destructive',
		description: 'Permanently remove a form visitor (1 API credit per call)',
	},
	'visitors.signOn': {
		riskLevel: 'write',
		description: 'Create a visitor single sign-on link (1 API credit per call)',
	},
	'files.list': {
		riskLevel: 'read',
		description: 'List account and result files (1 API credit per call)',
	},
	'files.get': {
		riskLevel: 'read',
		description: 'Retrieve file metadata (1 API credit per call)',
	},
	'files.content': {
		riskLevel: 'read',
		description: 'Download file content (1 API credit per call)',
	},
	'files.remove': {
		riskLevel: 'destructive',
		description: 'Permanently remove a file (1 API credit per call)',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof formdeskEndpointsNested>;

export const formdeskAuthConfig = {
	api_key: {},
} as const satisfies PluginAuthConfig;

export type BaseFormdeskPlugin<T extends FormdeskPluginOptions> = CorsairPlugin<
	'formdesk',
	typeof FormdeskSchema,
	typeof formdeskEndpointsNested,
	Record<string, never>,
	T,
	typeof defaultAuthType
>;
export type InternalFormdeskPlugin = BaseFormdeskPlugin<FormdeskPluginOptions>;
export type ExternalFormdeskPlugin<T extends FormdeskPluginOptions> =
	BaseFormdeskPlugin<T>;

export function formdesk<const T extends FormdeskPluginOptions>(
	incomingOptions: FormdeskPluginOptions & T = {} as FormdeskPluginOptions & T,
): ExternalFormdeskPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'formdesk',
		authConfig: formdeskAuthConfig,
		schema: FormdeskSchema,
		options,
		hooks: options.hooks,
		endpoints: formdeskEndpointsNested,
		webhooks: {},
		endpointMeta: formdeskEndpointMeta,
		endpointSchemas: formdeskEndpointSchemas,
		errorHandlers: { ...errorHandlers, ...options.errorHandlers },
		keyBuilder: async (ctx: FormdeskKeyBuilderContext, source) => {
			if (source !== 'endpoint') return '';
			if (PUBLIC_ENDPOINTS.has(ctx.meteredOperationId ?? '')) return '';
			if (options.key !== undefined) {
				if (options.key.length === 0) {
					throw new AuthMissingError('formdesk', 'api_key');
				}
				return options.key;
			}
			if (!ctx.keys) throw new AuthMissingError('formdesk', 'api_key');
			const apiKey = await ctx.keys.get_api_key();
			if (!apiKey) throw new AuthMissingError('formdesk', 'api_key');
			return apiKey;
		},
	} satisfies InternalFormdeskPlugin;
}

export type {
	FormdeskEndpointInputs,
	FormdeskEndpointOutputs,
} from './endpoints/types';
