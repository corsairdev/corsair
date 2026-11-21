import type {
	BindEndpoints,
	BindWebhooks,
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
	createManagedPricingCredentialCache,
	resolveManagedPricingApiKey,
} from 'corsair/hub';
import type { z } from 'zod';
import { endpoints } from './endpoints';
import { EndpointInputSchemas, EndpointOutputSchemas } from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { ParallelSchema } from './schema';
import {
	matchParallelWebhook,
	ParallelWebhooks,
	parallelWebhookSchemas,
} from './webhooks';

export type ParallelPluginOptions = {
	/** `managed_pricing` runs on Corsair's Parallel account, billed in Corsair credits. */
	authType?: PickAuth<'api_key' | 'managed_pricing'>;
	key?: string;
	/** The account webhook secret (`whsec_…`) from Parallel's Settings → Webhooks.
	 * Without it, the stored webhook signature is used. */
	webhookSecret?: string;
	hooks?: InternalParallelPlugin['hooks'];
	webhookHooks?: InternalParallelPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof endpoints>;
};
export type ParallelContext = CorsairPluginContext<
	typeof ParallelSchema,
	ParallelPluginOptions
>;
export type ParallelBoundEndpoints = BindEndpoints<typeof endpoints>;
export type ParallelBoundWebhooks = BindWebhooks<typeof ParallelWebhooks>;
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
	'flights.search': {
		input: EndpointInputSchemas['flights.search'],
		output: EndpointOutputSchemas['flights.search'],
	},
	'hotels.search': {
		input: EndpointInputSchemas['hotels.search'],
		output: EndpointOutputSchemas['hotels.search'],
	},
	'shopping.search': {
		input: EndpointInputSchemas['shopping.search'],
		output: EndpointOutputSchemas['shopping.search'],
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
		riskLevel: 'read',
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
	'findall.cancel': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Cancel a FindAll run',
	},
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
		riskLevel: 'read',
		description: 'Search for images',
	},
	'places.search': {
		riskLevel: 'read',
		description: 'Search for places by location',
	},
	'flights.search': {
		riskLevel: 'read',
		description: 'Search one-way or round-trip flights with where to book them',
	},
	'hotels.search': {
		riskLevel: 'read',
		description: 'Search hotels and vacation rentals for a stay',
	},
	'shopping.search': {
		riskLevel: 'read',
		description: 'Search products to buy, linked to store product pages',
	},
	'decisions.create': {
		riskLevel: 'destructive',
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

// Short-lived keys Hub mints for Corsair's own Parallel account, one per
// metered operation, cached until they expire.
const parallelManagedPricingCache = createManagedPricingCredentialCache();

export type BaseParallelPlugin<T extends ParallelPluginOptions> = CorsairPlugin<
	'parallel',
	typeof ParallelSchema,
	typeof endpoints,
	typeof ParallelWebhooks,
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
	// managed_pricing runs on Corsair's key, which core gets from Hub without
	// asking the keyBuilder, so an explicit key would be dropped silently and
	// the call billed to Corsair credits. The two can't both apply.
	if (options.authType === 'managed_pricing' && options.key) {
		throw new Error(
			"parallel: `key` can't be used with authType 'managed_pricing', which runs on Corsair's Parallel key. Drop `key`, or use authType 'api_key' to call Parallel with your own key.",
		);
	}
	return {
		id: 'parallel',
		authConfig: parallelAuthConfig,
		schema: ParallelSchema,
		options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints,
		webhooks: ParallelWebhooks,
		endpointMeta: meta,
		endpointSchemas: parallelEndpointSchemas,
		webhookSchemas: parallelWebhookSchemas,
		pluginWebhookMatcher: matchParallelWebhook,
		pluginTenantWebhookMatcher: () => null,
		oauthWebhookTenantLinkResolver: () => null,
		errorHandlers: { ...errorHandlers, ...options.errorHandlers },
		// Endpoints: the explicit key, a key Hub mints on Corsair's account
		// (managed_pricing), or the stored key. Webhooks: the webhook secret.
		keyBuilder: async (
			ctx: KeyBuilderContext<ParallelPluginOptions>,
			source,
		) => {
			if (source === 'webhook') {
				if (options.webhookSecret?.trim()) return options.webhookSecret;
				if (ctx.authType !== 'api_key') return '';
				return (await ctx.keys?.get_webhook_signature()) ?? '';
			}
			if (source !== 'endpoint') return '';
			if (options.key?.trim()) return options.key;
			if (ctx.authType === 'managed_pricing') {
				return resolveManagedPricingApiKey(ctx, {
					plugin: 'parallel',
					cache: parallelManagedPricingCache,
					operation: ctx.meteredOperationId,
				});
			}
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
	FlightSearchInput,
	FlightSearchOutput,
	HotelSearchInput,
	HotelSearchOutput,
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
	ShoppingSearchInput,
	ShoppingSearchOutput,
} from './endpoints/types';
export type { ParallelWebhookOutputs } from './webhooks';
