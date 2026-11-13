import type {
	BindEndpoints,
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
import type { z } from 'zod';
import { endpoints } from './endpoints';
import { EndpointInputSchemas, EndpointOutputSchemas } from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { ParallelSchema } from './schema';

export type ParallelPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalParallelPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof endpoints>;
};
export type ParallelContext = CorsairPluginContext<
	typeof ParallelSchema,
	ParallelPluginOptions
>;
export type ParallelBoundEndpoints = BindEndpoints<typeof endpoints>;
export const parallelEndpointSchemas = {
	'monitors.create': {
		input: EndpointInputSchemas['monitors.create'],
		output: EndpointOutputSchemas['monitors.create'],
	},
	'monitors.list': {
		input: EndpointInputSchemas['monitors.list'],
		output: EndpointOutputSchemas['monitors.list'],
	},
	'monitors.stats': {
		input: EndpointInputSchemas['monitors.stats'],
		output: EndpointOutputSchemas['monitors.stats'],
	},
	'monitors.get': {
		input: EndpointInputSchemas['monitors.get'],
		output: EndpointOutputSchemas['monitors.get'],
	},
	'monitors.cancel': {
		input: EndpointInputSchemas['monitors.cancel'],
		output: EndpointOutputSchemas['monitors.cancel'],
	},
	'monitors.trigger': {
		input: EndpointInputSchemas['monitors.trigger'],
		output: EndpointOutputSchemas['monitors.trigger'],
	},
	'monitors.events': {
		input: EndpointInputSchemas['monitors.events'],
		output: EndpointOutputSchemas['monitors.events'],
	},
	'monitors.update': {
		input: EndpointInputSchemas['monitors.update'],
		output: EndpointOutputSchemas['monitors.update'],
	},
	'tasks.createGroup': {
		input: EndpointInputSchemas['tasks.createGroup'],
		output: EndpointOutputSchemas['tasks.createGroup'],
	},
	'tasks.getGroup': {
		input: EndpointInputSchemas['tasks.getGroup'],
		output: EndpointOutputSchemas['tasks.getGroup'],
	},
	'tasks.addGroupRuns': {
		input: EndpointInputSchemas['tasks.addGroupRuns'],
		output: EndpointOutputSchemas['tasks.addGroupRuns'],
	},
	'tasks.getGroupRun': {
		input: EndpointInputSchemas['tasks.getGroupRun'],
		output: EndpointOutputSchemas['tasks.getGroupRun'],
	},
	'tasks.createRun': {
		input: EndpointInputSchemas['tasks.createRun'],
		output: EndpointOutputSchemas['tasks.createRun'],
	},
	'tasks.getRun': {
		input: EndpointInputSchemas['tasks.getRun'],
		output: EndpointOutputSchemas['tasks.getRun'],
	},
	'tasks.getRunInput': {
		input: EndpointInputSchemas['tasks.getRunInput'],
		output: EndpointOutputSchemas['tasks.getRunInput'],
	},
	'tasks.getResult': {
		input: EndpointInputSchemas['tasks.getResult'],
		output: EndpointOutputSchemas['tasks.getResult'],
	},
	'findall.entitySearch': {
		input: EndpointInputSchemas['findall.entitySearch'],
		output: EndpointOutputSchemas['findall.entitySearch'],
	},
	'findall.ingest': {
		input: EndpointInputSchemas['findall.ingest'],
		output: EndpointOutputSchemas['findall.ingest'],
	},
	'findall.createRun': {
		input: EndpointInputSchemas['findall.createRun'],
		output: EndpointOutputSchemas['findall.createRun'],
	},
	'findall.getRun': {
		input: EndpointInputSchemas['findall.getRun'],
		output: EndpointOutputSchemas['findall.getRun'],
	},
	'findall.cancel': {
		input: EndpointInputSchemas['findall.cancel'],
		output: EndpointOutputSchemas['findall.cancel'],
	},
	'findall.enrich': {
		input: EndpointInputSchemas['findall.enrich'],
		output: EndpointOutputSchemas['findall.enrich'],
	},
	'findall.extend': {
		input: EndpointInputSchemas['findall.extend'],
		output: EndpointOutputSchemas['findall.extend'],
	},
	'findall.result': {
		input: EndpointInputSchemas['findall.result'],
		output: EndpointOutputSchemas['findall.result'],
	},
	'findall.schema': {
		input: EndpointInputSchemas['findall.schema'],
		output: EndpointOutputSchemas['findall.schema'],
	},
	'chat.create': {
		input: EndpointInputSchemas['chat.create'],
		output: EndpointOutputSchemas['chat.create'],
	},
	'responses.create': {
		input: EndpointInputSchemas['responses.create'],
		output: EndpointOutputSchemas['responses.create'],
	},
	'search.search': {
		input: EndpointInputSchemas['search.search'],
		output: EndpointOutputSchemas['search.search'],
	},
	'images.search': {
		input: EndpointInputSchemas['images.search'],
		output: EndpointOutputSchemas['images.search'],
	},
	'places.search': {
		input: EndpointInputSchemas['places.search'],
		output: EndpointOutputSchemas['places.search'],
	},
	'decisions.create': {
		input: EndpointInputSchemas['decisions.create'],
		output: EndpointOutputSchemas['decisions.create'],
	},
	'memory.clear': {
		input: EndpointInputSchemas['memory.clear'],
		output: EndpointOutputSchemas['memory.clear'],
	},
	'memory.evict': {
		input: EndpointInputSchemas['memory.evict'],
		output: EndpointOutputSchemas['memory.evict'],
	},
	'memory.retrieve': {
		input: EndpointInputSchemas['memory.retrieve'],
		output: EndpointOutputSchemas['memory.retrieve'],
	},
	'extract.extract': {
		input: EndpointInputSchemas['extract.extract'],
		output: EndpointOutputSchemas['extract.extract'],
	},
} satisfies RequiredPluginEndpointSchemas<typeof endpoints>;
export type ParallelEndpointInputs = {
	[K in keyof typeof parallelEndpointSchemas]: z.input<
		(typeof parallelEndpointSchemas)[K]['input']
	>;
};
export type ParallelEndpointOutputs = {
	[K in keyof typeof parallelEndpointSchemas]: z.output<
		(typeof parallelEndpointSchemas)[K]['output']
	>;
};
const meta = {
	'chat.create': {
		riskLevel: 'destructive',
		description: 'Create a non-streaming chat completion',
	},
	'responses.create': {
		riskLevel: 'destructive',
		description: 'Create a non-streaming response',
	},
	'findall.entitySearch': {
		riskLevel: 'destructive',
		description: 'Search for entities',
	},
	'findall.ingest': {
		riskLevel: 'destructive',
		description: 'Create an entity search specification',
	},
	'findall.createRun': {
		riskLevel: 'destructive',
		description: 'Create a FindAll run',
	},
	'findall.getRun': { riskLevel: 'read', description: 'Get a FindAll run' },
	'findall.cancel': { riskLevel: 'write', description: 'Cancel a FindAll run' },
	'findall.enrich': {
		riskLevel: 'destructive',
		description: 'Enrich a FindAll run',
	},
	'findall.extend': {
		riskLevel: 'destructive',
		description: 'Extend a FindAll run',
	},
	'findall.result': { riskLevel: 'read', description: 'Get FindAll results' },
	'findall.schema': {
		riskLevel: 'read',
		description: 'Get the FindAll schema',
	},
	'tasks.createGroup': {
		riskLevel: 'write',
		description: 'Create a task group',
	},
	'tasks.getGroup': { riskLevel: 'read', description: 'Get a task group' },
	'tasks.addGroupRuns': {
		riskLevel: 'destructive',
		description: 'Add runs to a task group',
	},
	'tasks.getGroupRun': {
		riskLevel: 'read',
		description: 'Get a run in a task group',
	},
	'tasks.createRun': {
		riskLevel: 'destructive',
		description: 'Create a task run',
	},
	'tasks.getRun': { riskLevel: 'read', description: 'Get a task run' },
	'tasks.getRunInput': { riskLevel: 'read', description: 'Get task run input' },
	'tasks.getResult': { riskLevel: 'read', description: 'Get task run result' },
	'monitors.create': {
		riskLevel: 'destructive',
		description: 'Create a monitor',
	},
	'monitors.list': { riskLevel: 'read', description: 'List monitors' },
	'monitors.stats': {
		riskLevel: 'read',
		description: 'Get monitor statistics',
	},
	'monitors.get': { riskLevel: 'read', description: 'Get a monitor' },
	'monitors.cancel': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Permanently cancel a monitor',
	},
	'monitors.trigger': {
		riskLevel: 'destructive',
		description: 'Trigger a monitor run',
	},
	'monitors.events': { riskLevel: 'read', description: 'List monitor events' },
	'monitors.update': {
		riskLevel: 'destructive',
		description: 'Update a monitor',
	},
	'memory.clear': {
		riskLevel: 'destructive',
		description: 'Clear a memory scope',
	},
	'memory.evict': {
		riskLevel: 'destructive',
		description: 'Evict a memory source',
	},
	'memory.retrieve': { riskLevel: 'read', description: 'Retrieve memories' },
	'images.search': {
		riskLevel: 'destructive',
		description: 'Search for images',
	},
	'places.search': {
		riskLevel: 'destructive',
		description: 'Search for places by location',
	},
	'decisions.create': {
		riskLevel: 'destructive',
		description: 'Answer grounded decision questions',
	},
	'search.search': {
		riskLevel: 'destructive',
		description: 'Search the web for relevant sources and excerpts',
	},
	'extract.extract': {
		riskLevel: 'destructive',
		description: 'Extract content from web URLs',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof endpoints>;
export const parallelAuthConfig = {
	api_key: { account: [] as const },
} as const satisfies PluginAuthConfig;
const defaultAuthType = 'api_key' as const;
export type BaseParallelPlugin<T extends ParallelPluginOptions> = CorsairPlugin<
	'parallel',
	typeof ParallelSchema,
	typeof endpoints,
	Record<string, never>,
	T,
	typeof defaultAuthType
>;
export type InternalParallelPlugin = BaseParallelPlugin<ParallelPluginOptions>;
export type ExternalParallelPlugin<T extends ParallelPluginOptions> =
	BaseParallelPlugin<T>;

export function parallel(): ExternalParallelPlugin<{}>;
export function parallel<const T extends ParallelPluginOptions>(
	options: ParallelPluginOptions & T,
): ExternalParallelPlugin<T>;
export function parallel(
	incomingOptions: ParallelPluginOptions = {},
): InternalParallelPlugin {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'parallel',
		authConfig: parallelAuthConfig,
		schema: ParallelSchema,
		options,
		hooks: options.hooks,
		endpoints,
		webhooks: {},
		endpointMeta: meta,
		endpointSchemas: parallelEndpointSchemas,
		pluginWebhookMatcher: () => false,
		pluginTenantWebhookMatcher: () => null,
		oauthWebhookTenantLinkResolver: () => null,
		errorHandlers: { ...errorHandlers, ...options.errorHandlers },
		keyBuilder: async (
			ctx: KeyBuilderContext<ParallelPluginOptions>,
			source,
		) => {
			if (source !== 'endpoint') return '';
			if (options.key?.trim()) return options.key;
			const key = await ctx.keys?.get_api_key();
			if (key?.trim()) return key;
			throw new AuthMissingError('parallel', 'api_key');
		},
	};
}
export {
	DecisionInput,
	DecisionOutput,
	ExtractInput,
	ExtractOutput,
	ImageSearchInput,
	ImageSearchOutput,
	MemoryClearInput,
	MemoryEvictInput,
	MemoryRetrieveInput,
	MemoryRetrieveOutput,
	PlaceSearchInput,
	PlaceSearchOutput,
	SearchInput,
	SearchOutput,
} from './endpoints/types';
