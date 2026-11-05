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
import { Connections, MetaTools, Sessions, Toolkits, Tools } from './endpoints';
import type {
	ComposioEndpointInputs,
	ComposioEndpointOutputs,
} from './endpoints/types';
import {
	ComposioEndpointInputSchemas,
	ComposioEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { ComposioSchema } from './schema';

export type ComposioPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalComposioPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof composioEndpointsNested>;
};

export type ComposioContext = CorsairPluginContext<
	typeof ComposioSchema,
	ComposioPluginOptions
>;

export type ComposioKeyBuilderContext =
	KeyBuilderContext<ComposioPluginOptions>;

export type ComposioBoundEndpoints = BindEndpoints<
	typeof composioEndpointsNested
>;

export type ComposioEndpoints = {
	[K in keyof ComposioEndpointOutputs]: CorsairEndpoint<
		ComposioContext,
		ComposioEndpointInputs[K],
		ComposioEndpointOutputs[K]
	>;
};

const composioEndpointsNested = {
	sessions: {
		create: Sessions.create,
	},
	tools: {
		list: Tools.list,
		get: Tools.get,
		execute: Tools.execute,
	},
	toolkits: {
		list: Toolkits.list,
	},
	connections: {
		list: Connections.list,
		create: Connections.create,
		delete: Connections.remove,
	},
	meta: {
		checkActiveConnection: MetaTools.checkActiveConnection,
		checkActiveConnections: MetaTools.checkActiveConnections,
		createPlan: MetaTools.createPlan,
		enableTrigger: MetaTools.enableTrigger,
		executeTool: MetaTools.executeTool,
		getDependencyGraph: MetaTools.getDependencyGraph,
		getRequiredParameters: MetaTools.getRequiredParameters,
		getResponseSchema: MetaTools.getResponseSchema,
		initiateConnection: MetaTools.initiateConnection,
		listToolkits: MetaTools.listToolkits,
		listTriggers: MetaTools.listTriggers,
		waitForConnection: MetaTools.waitForConnection,
		getToolSchemas: MetaTools.getToolSchemas,
		manageConnections: MetaTools.manageConnections,
		multiExecuteTool: MetaTools.multiExecuteTool,
		remoteBashTool: MetaTools.remoteBashTool,
		remoteWorkbench: MetaTools.remoteWorkbench,
		searchTools: MetaTools.searchTools,
		waitForConnections: MetaTools.waitForConnections,
	},
} as const;

const inputs = ComposioEndpointInputSchemas;
const outputs = ComposioEndpointOutputSchemas;

export const composioEndpointSchemas = {
	'sessions.create': {
		input: inputs.sessionCreate,
		output: outputs.sessionCreate,
	},
	'tools.list': { input: inputs.toolsList, output: outputs.toolsList },
	'tools.get': { input: inputs.toolGet, output: outputs.toolGet },
	'tools.execute': { input: inputs.toolExecute, output: outputs.toolExecute },
	'toolkits.list': { input: inputs.toolkitsList, output: outputs.toolkitsList },
	'connections.list': {
		input: inputs.connectionsList,
		output: outputs.connectionsList,
	},
	'connections.create': {
		input: inputs.connectionCreate,
		output: outputs.connectionCreate,
	},
	'connections.delete': {
		input: inputs.connectionDelete,
		output: outputs.connectionDelete,
	},
	'meta.checkActiveConnection': {
		input: inputs.checkActiveConnection,
		output: outputs.checkActiveConnection,
	},
	'meta.checkActiveConnections': {
		input: inputs.checkActiveConnections,
		output: outputs.checkActiveConnections,
	},
	'meta.createPlan': { input: inputs.createPlan, output: outputs.createPlan },
	'meta.enableTrigger': {
		input: inputs.enableTrigger,
		output: outputs.enableTrigger,
	},
	'meta.executeTool': {
		input: inputs.executeTool,
		output: outputs.executeTool,
	},
	'meta.getDependencyGraph': {
		input: inputs.getDependencyGraph,
		output: outputs.getDependencyGraph,
	},
	'meta.getRequiredParameters': {
		input: inputs.getRequiredParameters,
		output: outputs.getRequiredParameters,
	},
	'meta.getResponseSchema': {
		input: inputs.getResponseSchema,
		output: outputs.getResponseSchema,
	},
	'meta.initiateConnection': {
		input: inputs.initiateConnection,
		output: outputs.initiateConnection,
	},
	'meta.listToolkits': {
		input: inputs.listToolkits,
		output: outputs.listToolkits,
	},
	'meta.listTriggers': {
		input: inputs.listTriggers,
		output: outputs.listTriggers,
	},
	'meta.waitForConnection': {
		input: inputs.waitForConnection,
		output: outputs.waitForConnection,
	},
	'meta.getToolSchemas': {
		input: inputs.getToolSchemas,
		output: outputs.getToolSchemas,
	},
	'meta.manageConnections': {
		input: inputs.manageConnections,
		output: outputs.manageConnections,
	},
	'meta.multiExecuteTool': {
		input: inputs.multiExecuteTool,
		output: outputs.multiExecuteTool,
	},
	'meta.remoteBashTool': {
		input: inputs.remoteBashTool,
		output: outputs.remoteBashTool,
	},
	'meta.remoteWorkbench': {
		input: inputs.remoteWorkbench,
		output: outputs.remoteWorkbench,
	},
	'meta.searchTools': {
		input: inputs.searchTools,
		output: outputs.searchTools,
	},
	'meta.waitForConnections': {
		input: inputs.waitForConnections,
		output: outputs.waitForConnections,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof composioEndpointsNested
>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const composioEndpointMeta = {
	'sessions.create': {
		riskLevel: 'write',
		description: 'Create a tool router session for a user',
	},
	'tools.list': { riskLevel: 'read', description: 'List Composio tools' },
	'tools.get': { riskLevel: 'read', description: 'Get a tool by slug' },
	'tools.execute': {
		riskLevel: 'write',
		description: 'Execute a tool by slug',
	},
	'toolkits.list': { riskLevel: 'read', description: 'List toolkits' },
	'connections.list': {
		riskLevel: 'read',
		description: 'List connected accounts',
	},
	'connections.create': {
		riskLevel: 'write',
		description: 'Create a connected-account auth link',
	},
	'connections.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a connected account',
	},
	'meta.checkActiveConnection': {
		riskLevel: 'read',
		description: 'COMPOSIO_CHECK_ACTIVE_CONNECTION: check one connection',
	},
	'meta.checkActiveConnections': {
		riskLevel: 'read',
		description: 'COMPOSIO_CHECK_ACTIVE_CONNECTIONS: check many connections',
	},
	'meta.createPlan': {
		riskLevel: 'read',
		description: 'COMPOSIO_CREATE_PLAN: plan a multi-step workflow',
	},
	'meta.enableTrigger': {
		riskLevel: 'write',
		description: 'COMPOSIO_ENABLE_TRIGGER: enable a trigger on an account',
	},
	'meta.executeTool': {
		riskLevel: 'write',
		description: 'COMPOSIO_EXECUTE_TOOL: run one tool',
	},
	'meta.getDependencyGraph': {
		riskLevel: 'read',
		description: 'COMPOSIO_GET_DEPENDENCY_GRAPH: tools a tool depends on',
	},
	'meta.getRequiredParameters': {
		riskLevel: 'read',
		description: 'COMPOSIO_GET_REQUIRED_PARAMETERS: auth fields of a toolkit',
	},
	'meta.getResponseSchema': {
		riskLevel: 'read',
		description: 'COMPOSIO_GET_RESPONSE_SCHEMA: output schema of a tool',
	},
	'meta.initiateConnection': {
		riskLevel: 'write',
		description: 'COMPOSIO_INITIATE_CONNECTION: start connecting a toolkit',
	},
	'meta.listToolkits': {
		riskLevel: 'read',
		description: 'COMPOSIO_LIST_TOOLKITS: list toolkits',
	},
	'meta.listTriggers': {
		riskLevel: 'read',
		description: 'COMPOSIO_LIST_TRIGGERS: list trigger types',
	},
	'meta.waitForConnection': {
		riskLevel: 'read',
		description: 'COMPOSIO_WAIT_FOR_CONNECTION: wait until toolkits connect',
	},
	'meta.getToolSchemas': {
		riskLevel: 'read',
		description: 'COMPOSIO_GET_TOOL_SCHEMAS: input schemas by slug',
	},
	'meta.manageConnections': {
		riskLevel: 'write',
		description: 'COMPOSIO_MANAGE_CONNECTIONS: check or connect toolkits',
	},
	'meta.multiExecuteTool': {
		riskLevel: 'write',
		description: 'COMPOSIO_MULTI_EXECUTE_TOOL: run tools in parallel',
	},
	'meta.remoteBashTool': {
		riskLevel: 'write',
		description: 'COMPOSIO_REMOTE_BASH_TOOL: run bash in the sandbox',
	},
	'meta.remoteWorkbench': {
		riskLevel: 'write',
		description: 'COMPOSIO_REMOTE_WORKBENCH: run Python in the sandbox',
	},
	'meta.searchTools': {
		riskLevel: 'read',
		description: 'COMPOSIO_SEARCH_TOOLS: find tools for a use case',
	},
	'meta.waitForConnections': {
		riskLevel: 'read',
		description: 'COMPOSIO_WAIT_FOR_CONNECTIONS: wait inside a session',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof composioEndpointsNested>;

export const composioAuthConfig = {
	api_key: {
		account: ['one'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseComposioPlugin<T extends ComposioPluginOptions> = CorsairPlugin<
	'composio',
	typeof ComposioSchema,
	typeof composioEndpointsNested,
	{},
	T,
	typeof defaultAuthType,
	typeof composioAuthConfig
>;

export type InternalComposioPlugin = BaseComposioPlugin<ComposioPluginOptions>;

export type ExternalComposioPlugin<T extends ComposioPluginOptions> =
	BaseComposioPlugin<T>;

export function composio<const T extends ComposioPluginOptions>(
	// Safe: every field of ComposioPluginOptions is optional, so `{}` is a valid value for it.
	// A narrower type is not practical because no value is both `{}` and an arbitrary caller T.
	incomingOptions: ComposioPluginOptions & T = {} as ComposioPluginOptions & T,
): ExternalComposioPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'composio',
		schema: ComposioSchema,
		options,
		hooks: options.hooks,
		endpoints: composioEndpointsNested,
		webhooks: {},
		endpointMeta: composioEndpointMeta,
		endpointSchemas: composioEndpointSchemas,
		authConfig: composioAuthConfig,
		pluginWebhookMatcher: () => false,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: ComposioKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}
			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const key = await ctx.keys.get_api_key();
				if (!key) {
					throw new AuthMissingError('composio', 'api_key');
				}
				return key;
			}
			throw new AuthMissingError('composio', 'api_key');
		},
	} satisfies InternalComposioPlugin;
}

export { ComposioAPIError } from './client';
export type {
	ComposioEndpointInputs,
	ComposioEndpointOutputs,
	DirectToolResult,
	SessionToolResult,
} from './endpoints/types';
export {
	ComposioEndpointInputSchemas,
	ComposioEndpointOutputSchemas,
	META_TOOL_SLUGS,
} from './endpoints/types';
