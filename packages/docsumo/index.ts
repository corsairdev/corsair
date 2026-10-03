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
	AgentsEndpoints,
	AnalyticsEndpoints,
	DocumentsEndpoints,
	DocumentTypesEndpoints,
	FoldersEndpoints,
	TablesEndpoints,
	UserEndpoints,
} from './endpoints';
import type {
	DocsumoEndpointInputs,
	DocsumoEndpointOutputs,
} from './endpoints/types';
import {
	DocsumoEndpointInputSchemas,
	DocsumoEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { DocsumoSchema } from './schema';

export type DocsumoPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalDocsumoPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof docsumoEndpointsNested>;
};

export type DocsumoContext = CorsairPluginContext<
	typeof DocsumoSchema,
	DocsumoPluginOptions
>;

export type DocsumoKeyBuilderContext = KeyBuilderContext<DocsumoPluginOptions>;

export type DocsumoBoundEndpoints = BindEndpoints<
	typeof docsumoEndpointsNested
>;

type DocsumoEndpoint<K extends keyof DocsumoEndpointOutputs> = CorsairEndpoint<
	DocsumoContext,
	DocsumoEndpointInputs[K],
	DocsumoEndpointOutputs[K]
>;

export type DocsumoEndpoints = {
	tablesAddRow: DocsumoEndpoint<'tablesAddRow'>;
	tablesDelete: DocsumoEndpoint<'tablesDelete'>;
	tablesGetData: DocsumoEndpoint<'tablesGetData'>;
	foldersCreate: DocsumoEndpoint<'foldersCreate'>;
	documentTypesGetEnabled: DocsumoEndpoint<'documentTypesGetEnabled'>;
	documentTypesListEnabled: DocsumoEndpoint<'documentTypesListEnabled'>;
	documentsListAll: DocsumoEndpoint<'documentsListAll'>;
	userGetDocumentTypes: DocsumoEndpoint<'userGetDocumentTypes'>;
	agentsListExternal: DocsumoEndpoint<'agentsListExternal'>;
	agentsListCases: DocsumoEndpoint<'agentsListCases'>;
	analyticsMcaAnalysis: DocsumoEndpoint<'analyticsMcaAnalysis'>;
};

const docsumoEndpointsNested = {
	tables: {
		addRow: TablesEndpoints.addRow,
		delete: TablesEndpoints.delete,
		getData: TablesEndpoints.getData,
	},
	folders: {
		create: FoldersEndpoints.create,
	},
	documentTypes: {
		getEnabled: DocumentTypesEndpoints.getEnabled,
		listEnabled: DocumentTypesEndpoints.listEnabled,
	},
	documents: {
		listAll: DocumentsEndpoints.listAll,
	},
	user: {
		getDocumentTypes: UserEndpoints.getDocumentTypes,
	},
	agents: {
		listExternal: AgentsEndpoints.listExternal,
		listCases: AgentsEndpoints.listCases,
	},
	analytics: {
		mcaAnalysis: AnalyticsEndpoints.mcaAnalysis,
	},
} as const;

const docsumoWebhooksNested = {} as const;

export const docsumoEndpointSchemas = {
	'tables.addRow': {
		input: DocsumoEndpointInputSchemas.tablesAddRow,
		output: DocsumoEndpointOutputSchemas.tablesAddRow,
	},
	'tables.delete': {
		input: DocsumoEndpointInputSchemas.tablesDelete,
		output: DocsumoEndpointOutputSchemas.tablesDelete,
	},
	'tables.getData': {
		input: DocsumoEndpointInputSchemas.tablesGetData,
		output: DocsumoEndpointOutputSchemas.tablesGetData,
	},
	'folders.create': {
		input: DocsumoEndpointInputSchemas.foldersCreate,
		output: DocsumoEndpointOutputSchemas.foldersCreate,
	},
	'documentTypes.getEnabled': {
		input: DocsumoEndpointInputSchemas.documentTypesGetEnabled,
		output: DocsumoEndpointOutputSchemas.documentTypesGetEnabled,
	},
	'documentTypes.listEnabled': {
		input: DocsumoEndpointInputSchemas.documentTypesListEnabled,
		output: DocsumoEndpointOutputSchemas.documentTypesListEnabled,
	},
	'documents.listAll': {
		input: DocsumoEndpointInputSchemas.documentsListAll,
		output: DocsumoEndpointOutputSchemas.documentsListAll,
	},
	'user.getDocumentTypes': {
		input: DocsumoEndpointInputSchemas.userGetDocumentTypes,
		output: DocsumoEndpointOutputSchemas.userGetDocumentTypes,
	},
	'agents.listExternal': {
		input: DocsumoEndpointInputSchemas.agentsListExternal,
		output: DocsumoEndpointOutputSchemas.agentsListExternal,
	},
	'agents.listCases': {
		input: DocsumoEndpointInputSchemas.agentsListCases,
		output: DocsumoEndpointOutputSchemas.agentsListCases,
	},
	'analytics.mcaAnalysis': {
		input: DocsumoEndpointInputSchemas.analyticsMcaAnalysis,
		output: DocsumoEndpointOutputSchemas.analyticsMcaAnalysis,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof docsumoEndpointsNested
>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const docsumoEndpointMeta = {
	'tables.addRow': {
		riskLevel: 'write',
		description: 'Add a new empty row to a Docsumo database table',
	},
	'tables.delete': {
		riskLevel: 'write',
		description: 'Delete one or more Docsumo database tables',
	},
	'tables.getData': {
		riskLevel: 'read',
		description: 'Retrieve all rows from a Docsumo database table',
	},
	'folders.create': {
		riskLevel: 'write',
		description: 'Create a folder for organizing Docsumo documents',
	},
	'documentTypes.getEnabled': {
		riskLevel: 'read',
		description:
			'Get a summary of enabled and disabled document types for the account',
	},
	'documentTypes.listEnabled': {
		riskLevel: 'read',
		description: 'List document types currently enabled for the account',
	},
	'documents.listAll': {
		riskLevel: 'read',
		description: 'List documents with optional filters and pagination',
	},
	'user.getDocumentTypes': {
		riskLevel: 'read',
		description: 'Get user account details and available document types',
	},
	'agents.listExternal': {
		riskLevel: 'read',
		description: 'List external agents configured in the Docsumo account',
	},
	'agents.listCases': {
		riskLevel: 'read',
		description: 'List cases for an external agent case type with pagination',
	},
	'analytics.mcaAnalysis': {
		riskLevel: 'read',
		description: 'Run MCA analysis on uploaded bank statement documents',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof docsumoEndpointsNested>;

export const docsumoAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseDocsumoPlugin<T extends DocsumoPluginOptions> = CorsairPlugin<
	'docsumo',
	typeof DocsumoSchema,
	typeof docsumoEndpointsNested,
	typeof docsumoWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalDocsumoPlugin = BaseDocsumoPlugin<DocsumoPluginOptions>;

export type ExternalDocsumoPlugin<T extends DocsumoPluginOptions> =
	BaseDocsumoPlugin<T>;

export function docsumo<const T extends DocsumoPluginOptions>(
	incomingOptions: DocsumoPluginOptions & T = {} as DocsumoPluginOptions & T,
): ExternalDocsumoPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'docsumo',
		authConfig: docsumoAuthConfig,
		schema: DocsumoSchema,
		options: options,
		hooks: options.hooks,
		endpoints: docsumoEndpointsNested,
		webhooks: docsumoWebhooksNested,
		endpointMeta: docsumoEndpointMeta,
		endpointSchemas: docsumoEndpointSchemas,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: DocsumoKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const key = await ctx.keys.get_api_key();
				if (!key) {
					throw new AuthMissingError('docsumo', 'api_key');
				}
				return key;
			}

			throw new AuthMissingError('docsumo', 'api_key');
		},
	} satisfies InternalDocsumoPlugin;
}

export type {
	AgentsListCasesInput,
	AgentsListCasesOutput,
	AgentsListExternalInput,
	AgentsListExternalOutput,
	AnalyticsMcaAnalysisInput,
	AnalyticsMcaAnalysisOutput,
	DocsumoEndpointInputs,
	DocsumoEndpointOutputs,
	DocumentsListAllInput,
	DocumentsListAllOutput,
	DocumentTypesGetEnabledInput,
	DocumentTypesGetEnabledOutput,
	DocumentTypesListEnabledInput,
	DocumentTypesListEnabledOutput,
	FoldersCreateInput,
	FoldersCreateOutput,
	TablesAddRowInput,
	TablesAddRowOutput,
	TablesDeleteInput,
	TablesDeleteOutput,
	TablesGetDataInput,
	TablesGetDataOutput,
	UserGetDocumentTypesInput,
	UserGetDocumentTypesOutput,
} from './endpoints/types';
