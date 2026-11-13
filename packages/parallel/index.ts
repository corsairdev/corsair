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
import {
	ChatInput,
	ChatOutput,
	DecisionInput,
	DecisionOutput,
	EmptyInput,
	ExtractInput,
	ExtractOutput,
	FindAllCreateInput,
	FindAllEnrichInput,
	FindAllEntityInput,
	FindAllEntityOutput,
	FindAllExtendInput,
	FindAllIdInput,
	FindAllIngestInput,
	FindAllResultOutput,
	FindAllRunOutput,
	FindAllSchemaOutput,
	ImageSearchInput,
	ImageSearchOutput,
	MemoryClearInput,
	MemoryEvictInput,
	MemoryRetrieveInput,
	MemoryRetrieveOutput,
	MonitorCreateInput,
	MonitorEventsInput,
	MonitorEventsOutput,
	MonitorIdInput,
	MonitorListInput,
	MonitorListOutput,
	MonitorOutput,
	MonitorStatsOutput,
	MonitorUpdateInput,
	NoContent,
	PlaceSearchInput,
	PlaceSearchOutput,
	ResponseInput,
	ResponseOutput,
	SearchInput,
	SearchOutput,
	TaskGroupCreateInput,
	TaskGroupIdInput,
	TaskGroupOutput,
	TaskGroupRunIdInput,
	TaskGroupRunsInput,
	TaskGroupRunsOutput,
	TaskResultInput,
	TaskResultOutput,
	TaskRunCreateInput,
	TaskRunIdInput,
	TaskRunInput,
	TaskRunOutput,
} from './endpoints/types';
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
	'monitors.create': { input: MonitorCreateInput, output: MonitorOutput },
	'monitors.list': { input: MonitorListInput, output: MonitorListOutput },
	'monitors.stats': { input: EmptyInput, output: MonitorStatsOutput },
	'monitors.get': { input: MonitorIdInput, output: MonitorOutput },
	'monitors.cancel': { input: MonitorIdInput, output: MonitorOutput },
	'monitors.trigger': { input: MonitorIdInput, output: NoContent },
	'monitors.events': { input: MonitorEventsInput, output: MonitorEventsOutput },
	'monitors.update': { input: MonitorUpdateInput, output: MonitorOutput },
	'tasks.createGroup': { input: TaskGroupCreateInput, output: TaskGroupOutput },
	'tasks.getGroup': { input: TaskGroupIdInput, output: TaskGroupOutput },
	'tasks.addGroupRuns': {
		input: TaskGroupRunsInput,
		output: TaskGroupRunsOutput,
	},
	'tasks.getGroupRun': { input: TaskGroupRunIdInput, output: TaskRunOutput },
	'tasks.createRun': { input: TaskRunCreateInput, output: TaskRunOutput },
	'tasks.getRun': { input: TaskRunIdInput, output: TaskRunOutput },
	'tasks.getRunInput': { input: TaskRunIdInput, output: TaskRunInput },
	'tasks.getResult': { input: TaskResultInput, output: TaskResultOutput },
	'findall.entitySearch': {
		input: FindAllEntityInput,
		output: FindAllEntityOutput,
	},
	'findall.ingest': { input: FindAllIngestInput, output: FindAllSchemaOutput },
	'findall.createRun': { input: FindAllCreateInput, output: FindAllRunOutput },
	'findall.getRun': { input: FindAllIdInput, output: FindAllRunOutput },
	'findall.cancel': { input: FindAllIdInput, output: NoContent },
	'findall.enrich': { input: FindAllEnrichInput, output: FindAllSchemaOutput },
	'findall.extend': { input: FindAllExtendInput, output: FindAllSchemaOutput },
	'findall.result': { input: FindAllIdInput, output: FindAllResultOutput },
	'findall.schema': { input: FindAllIdInput, output: FindAllSchemaOutput },
	'chat.create': { input: ChatInput, output: ChatOutput },
	'responses.create': { input: ResponseInput, output: ResponseOutput },
	'search.search': { input: SearchInput, output: SearchOutput },
	'images.search': { input: ImageSearchInput, output: ImageSearchOutput },
	'places.search': { input: PlaceSearchInput, output: PlaceSearchOutput },
	'decisions.create': { input: DecisionInput, output: DecisionOutput },
	'memory.clear': { input: MemoryClearInput, output: NoContent },
	'memory.evict': { input: MemoryEvictInput, output: NoContent },
	'memory.retrieve': {
		input: MemoryRetrieveInput,
		output: MemoryRetrieveOutput,
	},
	'extract.extract': { input: ExtractInput, output: ExtractOutput },
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
		riskLevel: 'read',
		description: 'Create a non-streaming chat completion',
	},
	'responses.create': {
		riskLevel: 'read',
		description: 'Create a non-streaming response',
	},
	'findall.entitySearch': {
		riskLevel: 'read',
		description: 'Search for entities',
	},
	'findall.ingest': {
		riskLevel: 'read',
		description: 'Create an entity search specification',
	},
	'findall.createRun': {
		riskLevel: 'write',
		description: 'Create a FindAll run',
	},
	'findall.getRun': { riskLevel: 'read', description: 'Get a FindAll run' },
	'findall.cancel': { riskLevel: 'write', description: 'Cancel a FindAll run' },
	'findall.enrich': { riskLevel: 'write', description: 'Enrich a FindAll run' },
	'findall.extend': { riskLevel: 'write', description: 'Extend a FindAll run' },
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
		riskLevel: 'write',
		description: 'Add runs to a task group',
	},
	'tasks.getGroupRun': {
		riskLevel: 'read',
		description: 'Get a run in a task group',
	},
	'tasks.createRun': { riskLevel: 'write', description: 'Create a task run' },
	'tasks.getRun': { riskLevel: 'read', description: 'Get a task run' },
	'tasks.getRunInput': { riskLevel: 'read', description: 'Get task run input' },
	'tasks.getResult': { riskLevel: 'read', description: 'Get task run result' },
	'monitors.create': { riskLevel: 'write', description: 'Create a monitor' },
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
		riskLevel: 'write',
		description: 'Trigger a monitor run',
	},
	'monitors.events': { riskLevel: 'read', description: 'List monitor events' },
	'monitors.update': { riskLevel: 'write', description: 'Update a monitor' },
	'memory.clear': {
		riskLevel: 'destructive',
		description: 'Clear a memory scope',
	},
	'memory.evict': {
		riskLevel: 'destructive',
		description: 'Evict a memory source',
	},
	'memory.retrieve': { riskLevel: 'read', description: 'Retrieve memories' },
	'images.search': { riskLevel: 'read', description: 'Search for images' },
	'places.search': {
		riskLevel: 'read',
		description: 'Search for places by location',
	},
	'decisions.create': {
		riskLevel: 'read',
		description: 'Answer grounded decision questions',
	},
	'search.search': {
		riskLevel: 'read',
		description: 'Search the web for relevant sources and excerpts',
	},
	'extract.extract': {
		riskLevel: 'read',
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
