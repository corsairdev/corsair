import type {
	AuthTypes,
	BindEndpoints,
	BindWebhooks,
	CorsairEndpoint,
	CorsairErrorHandler,
	CorsairPlugin,
	CorsairPluginContext,
	CorsairWebhook,
	KeyBuilderContext,
	PickAuth,
	PluginAuthConfig,
	PluginPermissionsConfig,
	RequiredPluginEndpointMeta,
	RequiredPluginEndpointSchemas,
	RequiredPluginWebhookSchemas,
} from 'corsair/core';
import { AuthMissingError } from 'corsair/core';
import { z } from 'zod';
import {
	Bulk,
	Enrich,
	Faces,
	Search,
	Watchers,
	WebhooksApi,
} from './endpoints';
import type {
	OrbitEndpointInputs,
	OrbitEndpointOutputs,
} from './endpoints/types';
import {
	OrbitEndpointInputSchemas,
	OrbitEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { OrbitSchema } from './schema';
import { OrbitWebhooks } from './webhooks';

const DeliverySchema = z.looseObject({
	id: z.string().optional(),
	type: z.string().optional(),
	created: z.string().optional(),
	test: z.boolean().optional(),
	data: z.looseObject({}).optional(),
});

export type OrbitPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	baseUrl?: string;
	webhookSecret?: string;
	hooks?: InternalOrbitPlugin['hooks'];
	webhookHooks?: InternalOrbitPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof orbitEndpointsNested>;
};

export const orbitAuthConfig = {
	api_key: { account: [] as const },
} as const satisfies PluginAuthConfig;

export type OrbitContext = CorsairPluginContext<
	typeof OrbitSchema,
	OrbitPluginOptions,
	undefined,
	typeof orbitAuthConfig
>;

export type OrbitKeyBuilderContext = KeyBuilderContext<
	OrbitPluginOptions,
	typeof orbitAuthConfig
>;

export type OrbitBoundEndpoints = BindEndpoints<typeof orbitEndpointsNested>;

type OrbitEndpoint<K extends keyof OrbitEndpointOutputs> = CorsairEndpoint<
	OrbitContext,
	OrbitEndpointInputs[K],
	OrbitEndpointOutputs[K]
>;

export type OrbitEndpoints = {
	[K in keyof OrbitEndpointOutputs]: OrbitEndpoint<K>;
};

const orbitEndpointsNested = {
	search: {
		start: Search.start,
		get: Search.get,
		quotePopulation: Search.quotePopulation,
		startPopulation: Search.startPopulation,
	},
	enrich: {
		read: Enrich.read,
		start: Enrich.start,
		get: Enrich.get,
		batch: Enrich.batch,
	},
	bulk: {
		submit: Bulk.submit,
		get: Bulk.get,
		results: Bulk.results,
		cancel: Bulk.cancel,
	},
	faces: {
		detect: Faces.detect,
		index: Faces.index,
	},
	watchers: {
		create: Watchers.create,
		list: Watchers.list,
		get: Watchers.get,
		update: Watchers.update,
		delete: Watchers.delete,
		runs: Watchers.runs,
	},
	webhooks: {
		create: WebhooksApi.create,
		list: WebhooksApi.list,
		delete: WebhooksApi.delete,
		test: WebhooksApi.test,
	},
} as const;

const orbitWebhooksNested = {
	events: {
		delivery: OrbitWebhooks.delivery,
	},
} as const;

export const orbitEndpointSchemas = {
	'search.start': {
		input: OrbitEndpointInputSchemas.startSearch,
		output: OrbitEndpointOutputSchemas.startSearch,
	},
	'search.get': {
		input: OrbitEndpointInputSchemas.getSearch,
		output: OrbitEndpointOutputSchemas.getSearch,
	},
	'search.quotePopulation': {
		input: OrbitEndpointInputSchemas.quotePopulation,
		output: OrbitEndpointOutputSchemas.quotePopulation,
	},
	'search.startPopulation': {
		input: OrbitEndpointInputSchemas.startPopulation,
		output: OrbitEndpointOutputSchemas.startPopulation,
	},
	'enrich.read': {
		input: OrbitEndpointInputSchemas.readProfile,
		output: OrbitEndpointOutputSchemas.readProfile,
	},
	'enrich.start': {
		input: OrbitEndpointInputSchemas.enrichProfile,
		output: OrbitEndpointOutputSchemas.enrichProfile,
	},
	'enrich.get': {
		input: OrbitEndpointInputSchemas.getEnrichment,
		output: OrbitEndpointOutputSchemas.getEnrichment,
	},
	'enrich.batch': {
		input: OrbitEndpointInputSchemas.batchEnrich,
		output: OrbitEndpointOutputSchemas.batchEnrich,
	},
	'bulk.submit': {
		input: OrbitEndpointInputSchemas.submitBulk,
		output: OrbitEndpointOutputSchemas.submitBulk,
	},
	'bulk.get': {
		input: OrbitEndpointInputSchemas.getBulk,
		output: OrbitEndpointOutputSchemas.getBulk,
	},
	'bulk.results': {
		input: OrbitEndpointInputSchemas.getBulkResults,
		output: OrbitEndpointOutputSchemas.getBulkResults,
	},
	'bulk.cancel': {
		input: OrbitEndpointInputSchemas.cancelBulk,
		output: OrbitEndpointOutputSchemas.cancelBulk,
	},
	'faces.detect': {
		input: OrbitEndpointInputSchemas.detectFaces,
		output: OrbitEndpointOutputSchemas.detectFaces,
	},
	'faces.index': {
		input: OrbitEndpointInputSchemas.searchFaceIndex,
		output: OrbitEndpointOutputSchemas.searchFaceIndex,
	},
	'watchers.create': {
		input: OrbitEndpointInputSchemas.createWatcher,
		output: OrbitEndpointOutputSchemas.createWatcher,
	},
	'watchers.list': {
		input: OrbitEndpointInputSchemas.listWatchers,
		output: OrbitEndpointOutputSchemas.listWatchers,
	},
	'watchers.get': {
		input: OrbitEndpointInputSchemas.getWatcher,
		output: OrbitEndpointOutputSchemas.getWatcher,
	},
	'watchers.update': {
		input: OrbitEndpointInputSchemas.updateWatcher,
		output: OrbitEndpointOutputSchemas.updateWatcher,
	},
	'watchers.delete': {
		input: OrbitEndpointInputSchemas.deleteWatcher,
		output: OrbitEndpointOutputSchemas.deleteWatcher,
	},
	'watchers.runs': {
		input: OrbitEndpointInputSchemas.listWatcherRuns,
		output: OrbitEndpointOutputSchemas.listWatcherRuns,
	},
	'webhooks.create': {
		input: OrbitEndpointInputSchemas.createWebhook,
		output: OrbitEndpointOutputSchemas.createWebhook,
	},
	'webhooks.list': {
		input: OrbitEndpointInputSchemas.listWebhooks,
		output: OrbitEndpointOutputSchemas.listWebhooks,
	},
	'webhooks.delete': {
		input: OrbitEndpointInputSchemas.deleteWebhook,
		output: OrbitEndpointOutputSchemas.deleteWebhook,
	},
	'webhooks.test': {
		input: OrbitEndpointInputSchemas.testWebhook,
		output: OrbitEndpointOutputSchemas.testWebhook,
	},
} as const satisfies RequiredPluginEndpointSchemas<typeof orbitEndpointsNested>;

const orbitWebhookSchemas = {
	'events.delivery': {
		description: 'A signed Orbit event delivery',
		payload: DeliverySchema,
		response: z.object({}),
	},
} as const satisfies RequiredPluginWebhookSchemas<typeof orbitWebhooksNested>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const orbitEndpointMeta = {
	'search.start': { riskLevel: 'write', description: 'Start a people search' },
	'search.get': { riskLevel: 'read', description: 'Poll a people search' },
	'search.quotePopulation': {
		riskLevel: 'read',
		description: 'Price a population search',
	},
	'search.startPopulation': {
		riskLevel: 'write',
		description: 'Search everyone at a company or school',
	},
	'enrich.read': { riskLevel: 'read', description: 'Read an enriched profile' },
	'enrich.start': { riskLevel: 'write', description: 'Enrich one profile' },
	'enrich.get': { riskLevel: 'read', description: 'Poll an enrichment' },
	'enrich.batch': {
		riskLevel: 'write',
		description: 'Enrich up to 20 profiles',
	},
	'bulk.submit': { riskLevel: 'write', description: 'Submit a bulk search' },
	'bulk.get': { riskLevel: 'read', description: 'Read bulk search progress' },
	'bulk.results': {
		riskLevel: 'read',
		description: 'Read bulk search results',
	},
	'bulk.cancel': {
		riskLevel: 'write',
		description: 'Cancel undispatched bulk items',
	},
	'faces.detect': {
		riskLevel: 'write',
		description: 'Detect faces in a photo',
	},
	'faces.index': { riskLevel: 'write', description: 'Search the face index' },
	'watchers.create': { riskLevel: 'write', description: 'Watch a profile' },
	'watchers.list': { riskLevel: 'read', description: 'List watchers' },
	'watchers.get': { riskLevel: 'read', description: 'Get a watcher' },
	'watchers.update': { riskLevel: 'write', description: 'Update a watcher' },
	'watchers.delete': {
		riskLevel: 'destructive',
		description: 'Delete a watcher',
	},
	'watchers.runs': { riskLevel: 'read', description: 'List watcher runs' },
	'webhooks.create': {
		riskLevel: 'write',
		description: 'Register a webhook endpoint',
	},
	'webhooks.list': { riskLevel: 'read', description: 'List webhook endpoints' },
	'webhooks.delete': {
		riskLevel: 'destructive',
		description: 'Delete a webhook endpoint',
	},
	'webhooks.test': {
		riskLevel: 'write',
		description: 'Send a test webhook delivery',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof orbitEndpointsNested>;

type OrbitWebhookHandler = CorsairWebhook<
	OrbitContext,
	z.infer<typeof DeliverySchema>,
	Record<string, never>
>;

export type OrbitBoundWebhooks = BindWebhooks<{
	delivery: OrbitWebhookHandler;
}>;

export type BaseOrbitPlugin<T extends OrbitPluginOptions> = CorsairPlugin<
	'orbit',
	typeof OrbitSchema,
	typeof orbitEndpointsNested,
	typeof orbitWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalOrbitPlugin = BaseOrbitPlugin<OrbitPluginOptions>;
export type ExternalOrbitPlugin<T extends OrbitPluginOptions> =
	BaseOrbitPlugin<T>;

export function orbit<const T extends OrbitPluginOptions>(
	// The factory default is an empty options object. The generic T is the caller's options.
	incomingOptions: OrbitPluginOptions & T = {} as OrbitPluginOptions & T,
): ExternalOrbitPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'orbit',
		authConfig: orbitAuthConfig,
		schema: OrbitSchema,
		options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: orbitEndpointsNested,
		webhooks: orbitWebhooksNested,
		endpointMeta: orbitEndpointMeta,
		endpointSchemas: orbitEndpointSchemas,
		webhookSchemas: orbitWebhookSchemas,
		pluginWebhookMatcher: (request) =>
			'x-orbit-webhook-signature' in request.headers ||
			'X-Orbit-Webhook-Signature' in request.headers,
		oauthWebhookTenantLinkResolver: () => null,
		errorHandlers: { ...errorHandlers, ...options.errorHandlers },
		keyBuilder: async (ctx: OrbitKeyBuilderContext, source) => {
			if (source === 'webhook') {
				if (options.webhookSecret) return options.webhookSecret;
				const stored = await ctx.keys.get_webhook_signature();
				if (!stored) throw new AuthMissingError('orbit', 'webhook_secret');
				return stored;
			}
			if (options.key) return options.key;
			const stored = await ctx.keys.get_api_key();
			if (!stored) throw new AuthMissingError('orbit', 'api_key');
			return stored;
		},
	} satisfies InternalOrbitPlugin;
}

export type {
	OrbitEndpointInputs,
	OrbitEndpointOutputs,
} from './endpoints/types';
