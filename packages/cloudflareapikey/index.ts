import type {
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
import type { AuthTypes } from 'corsair/core';
import type { CloudflareApiKeyEndpointInputs, CloudflareApiKeyEndpointOutputs } from './endpoints/types';
import { CloudflareApiKeyEndpointInputSchemas, CloudflareApiKeyEndpointOutputSchemas } from './endpoints/types';
import type {
	CloudflareApiKeyWebhookOutputs,
	ExampleEvent,
} from './webhooks/types';
import { ExampleEventSchema } from './webhooks/types';
import { DNSEndpoints, RulesetsEndpoints, WorkerRoutesEndpoints, WorkersEndpoints, ZonesEndpoints } from './endpoints';
import { CloudflareApiKeySchema } from './schema';
import { ExampleWebhooks } from './webhooks';
import { errorHandlers } from './error-handlers';
import { matchCloudflareApiKeyTenantWebhook } from './webhooks/tenant-matcher';
import { resolveCloudflareApiKeyOAuthWebhookTenantLink } from './webhooks/oauth-tenant-link';

export type CloudflareApiKeyPluginOptions = {
	authType?: PickAuth<'api_key' | 'oauth_2'>;
	key?: string;
	webhookSecret?: string;
	hooks?: InternalCloudflareApiKeyPlugin['hooks'];
	webhookHooks?: InternalCloudflareApiKeyPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof cloudflareApiKeyEndpointsNested>;
};

export type CloudflareApiKeyContext = CorsairPluginContext<
	typeof CloudflareApiKeySchema,
	CloudflareApiKeyPluginOptions
>;

export type CloudflareApiKeyKeyBuilderContext = KeyBuilderContext<CloudflareApiKeyPluginOptions>;

export type CloudflareApiKeyBoundEndpoints = BindEndpoints<typeof cloudflareApiKeyEndpointsNested>;

type CloudflareApiKeyEndpoint<
	K extends keyof CloudflareApiKeyEndpointOutputs,
> = CorsairEndpoint<
	CloudflareApiKeyContext,
	CloudflareApiKeyEndpointInputs[K],
	CloudflareApiKeyEndpointOutputs[K]
>;

export type CloudflareApiKeyEndpoints = {
	zonesList: CloudflareApiKeyEndpoint<'zonesList'>; zonesGet: CloudflareApiKeyEndpoint<'zonesGet'>; zonesCreate: CloudflareApiKeyEndpoint<'zonesCreate'>; zonesEdit: CloudflareApiKeyEndpoint<'zonesEdit'>; zonesDelete: CloudflareApiKeyEndpoint<'zonesDelete'>;
	dnsList: CloudflareApiKeyEndpoint<'dnsList'>; dnsGet: CloudflareApiKeyEndpoint<'dnsGet'>; dnsCreate: CloudflareApiKeyEndpoint<'dnsCreate'>; dnsEdit: CloudflareApiKeyEndpoint<'dnsEdit'>; dnsDelete: CloudflareApiKeyEndpoint<'dnsDelete'>;
	workersList: CloudflareApiKeyEndpoint<'workersList'>; workersGet: CloudflareApiKeyEndpoint<'workersGet'>; workersUpload: CloudflareApiKeyEndpoint<'workersUpload'>; workersDelete: CloudflareApiKeyEndpoint<'workersDelete'>;
	workerRoutesList: CloudflareApiKeyEndpoint<'workerRoutesList'>; workerRoutesGet: CloudflareApiKeyEndpoint<'workerRoutesGet'>; workerRoutesCreate: CloudflareApiKeyEndpoint<'workerRoutesCreate'>; workerRoutesEdit: CloudflareApiKeyEndpoint<'workerRoutesEdit'>; workerRoutesDelete: CloudflareApiKeyEndpoint<'workerRoutesDelete'>;
	rulesetsList: CloudflareApiKeyEndpoint<'rulesetsList'>; rulesetsGet: CloudflareApiKeyEndpoint<'rulesetsGet'>; rulesetsCreate: CloudflareApiKeyEndpoint<'rulesetsCreate'>; rulesetsUpdate: CloudflareApiKeyEndpoint<'rulesetsUpdate'>; rulesetsDelete: CloudflareApiKeyEndpoint<'rulesetsDelete'>;
};

type CloudflareApiKeyWebhook<
	K extends keyof CloudflareApiKeyWebhookOutputs,
	TEvent,
> = CorsairWebhook<CloudflareApiKeyContext, TEvent, CloudflareApiKeyWebhookOutputs[K]>;

export type CloudflareApiKeyWebhooks = {
	example: CloudflareApiKeyWebhook<'example', ExampleEvent>;
};

export type CloudflareApiKeyBoundWebhooks = BindWebhooks<CloudflareApiKeyWebhooks>;

const cloudflareApiKeyEndpointsNested = {
	zones: ZonesEndpoints,
	dns: DNSEndpoints,
	workers: { scripts: WorkersEndpoints, routes: WorkerRoutesEndpoints },
	rulesets: RulesetsEndpoints,
} as const;

const cloudflareApiKeyWebhooksNested = {
	example: {
		example: ExampleWebhooks.example,
	},
} as const;

export const cloudflareApiKeyEndpointSchemas = {
	'zones.list': { input: CloudflareApiKeyEndpointInputSchemas.zonesList, output: CloudflareApiKeyEndpointOutputSchemas.zonesList },
	'zones.get': { input: CloudflareApiKeyEndpointInputSchemas.zonesGet, output: CloudflareApiKeyEndpointOutputSchemas.zonesGet },
	'zones.create': { input: CloudflareApiKeyEndpointInputSchemas.zonesCreate, output: CloudflareApiKeyEndpointOutputSchemas.zonesCreate },
	'zones.edit': { input: CloudflareApiKeyEndpointInputSchemas.zonesEdit, output: CloudflareApiKeyEndpointOutputSchemas.zonesEdit },
	'zones.delete': { input: CloudflareApiKeyEndpointInputSchemas.zonesDelete, output: CloudflareApiKeyEndpointOutputSchemas.zonesDelete },
	'dns.list': { input: CloudflareApiKeyEndpointInputSchemas.dnsList, output: CloudflareApiKeyEndpointOutputSchemas.dnsList },
	'dns.get': { input: CloudflareApiKeyEndpointInputSchemas.dnsGet, output: CloudflareApiKeyEndpointOutputSchemas.dnsGet },
	'dns.create': { input: CloudflareApiKeyEndpointInputSchemas.dnsCreate, output: CloudflareApiKeyEndpointOutputSchemas.dnsCreate },
	'dns.edit': { input: CloudflareApiKeyEndpointInputSchemas.dnsEdit, output: CloudflareApiKeyEndpointOutputSchemas.dnsEdit },
	'dns.delete': { input: CloudflareApiKeyEndpointInputSchemas.dnsDelete, output: CloudflareApiKeyEndpointOutputSchemas.dnsDelete },
	'workers.scripts.list': { input: CloudflareApiKeyEndpointInputSchemas.workersList, output: CloudflareApiKeyEndpointOutputSchemas.workersList },
	'workers.scripts.get': { input: CloudflareApiKeyEndpointInputSchemas.workersGet, output: CloudflareApiKeyEndpointOutputSchemas.workersGet },
	'workers.scripts.upload': { input: CloudflareApiKeyEndpointInputSchemas.workersUpload, output: CloudflareApiKeyEndpointOutputSchemas.workersUpload },
	'workers.scripts.delete': { input: CloudflareApiKeyEndpointInputSchemas.workersDelete, output: CloudflareApiKeyEndpointOutputSchemas.workersDelete },
	'workers.routes.list': { input: CloudflareApiKeyEndpointInputSchemas.workerRoutesList, output: CloudflareApiKeyEndpointOutputSchemas.workerRoutesList },
	'workers.routes.get': { input: CloudflareApiKeyEndpointInputSchemas.workerRoutesGet, output: CloudflareApiKeyEndpointOutputSchemas.workerRoutesGet },
	'workers.routes.create': { input: CloudflareApiKeyEndpointInputSchemas.workerRoutesCreate, output: CloudflareApiKeyEndpointOutputSchemas.workerRoutesCreate },
	'workers.routes.edit': { input: CloudflareApiKeyEndpointInputSchemas.workerRoutesEdit, output: CloudflareApiKeyEndpointOutputSchemas.workerRoutesEdit },
	'workers.routes.delete': { input: CloudflareApiKeyEndpointInputSchemas.workerRoutesDelete, output: CloudflareApiKeyEndpointOutputSchemas.workerRoutesDelete },
	'rulesets.list': { input: CloudflareApiKeyEndpointInputSchemas.rulesetsList, output: CloudflareApiKeyEndpointOutputSchemas.rulesetsList },
	'rulesets.get': { input: CloudflareApiKeyEndpointInputSchemas.rulesetsGet, output: CloudflareApiKeyEndpointOutputSchemas.rulesetsGet },
	'rulesets.create': { input: CloudflareApiKeyEndpointInputSchemas.rulesetsCreate, output: CloudflareApiKeyEndpointOutputSchemas.rulesetsCreate },
	'rulesets.update': { input: CloudflareApiKeyEndpointInputSchemas.rulesetsUpdate, output: CloudflareApiKeyEndpointOutputSchemas.rulesetsUpdate },
	'rulesets.delete': { input: CloudflareApiKeyEndpointInputSchemas.rulesetsDelete, output: CloudflareApiKeyEndpointOutputSchemas.rulesetsDelete },
} as const satisfies RequiredPluginEndpointSchemas<typeof cloudflareApiKeyEndpointsNested>;

const cloudflareApiKeyWebhookSchemas = {
	'example.example': {
		description: 'An example webhook event',
		payload: ExampleEventSchema,
		response: ExampleEventSchema,
	},
} as const satisfies RequiredPluginWebhookSchemas<typeof cloudflareApiKeyWebhooksNested>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const cloudflareApiKeyEndpointMeta = {
	'zones.list': { riskLevel: 'read', description: 'List zones' }, 'zones.get': { riskLevel: 'read', description: 'Get a zone' }, 'zones.create': { riskLevel: 'write', description: 'Create a zone' }, 'zones.edit': { riskLevel: 'write', description: 'Edit a zone' }, 'zones.delete': { riskLevel: 'write', description: 'Delete a zone' },
	'dns.list': { riskLevel: 'read', description: 'List DNS records' }, 'dns.get': { riskLevel: 'read', description: 'Get a DNS record' }, 'dns.create': { riskLevel: 'write', description: 'Create a DNS record' }, 'dns.edit': { riskLevel: 'write', description: 'Edit a DNS record' }, 'dns.delete': { riskLevel: 'write', description: 'Delete a DNS record' },
	'workers.scripts.list': { riskLevel: 'read', description: 'List Worker scripts' }, 'workers.scripts.get': { riskLevel: 'read', description: 'Get a Worker script' }, 'workers.scripts.upload': { riskLevel: 'write', description: 'Upload a Worker script' }, 'workers.scripts.delete': { riskLevel: 'write', description: 'Delete a Worker script' },
	'workers.routes.list': { riskLevel: 'read', description: 'List Worker routes' }, 'workers.routes.get': { riskLevel: 'read', description: 'Get a Worker route' }, 'workers.routes.create': { riskLevel: 'write', description: 'Create a Worker route' }, 'workers.routes.edit': { riskLevel: 'write', description: 'Edit a Worker route' }, 'workers.routes.delete': { riskLevel: 'write', description: 'Delete a Worker route' },
	'rulesets.list': { riskLevel: 'read', description: 'List rulesets' }, 'rulesets.get': { riskLevel: 'read', description: 'Get a ruleset' }, 'rulesets.create': { riskLevel: 'write', description: 'Create a ruleset' }, 'rulesets.update': { riskLevel: 'write', description: 'Update a ruleset' }, 'rulesets.delete': { riskLevel: 'write', description: 'Delete a ruleset' },
} as const satisfies RequiredPluginEndpointMeta<typeof cloudflareApiKeyEndpointsNested>;

export const cloudflareApiKeyAuthConfig = {
	api_key: {
		account: ['account_id'] as const,
	},
	oauth_2: {
		account: ['account_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseCloudflareApiKeyPlugin<T extends CloudflareApiKeyPluginOptions> = CorsairPlugin<
	'cloudflareapikey',
	typeof CloudflareApiKeySchema,
	typeof cloudflareApiKeyEndpointsNested,
	typeof cloudflareApiKeyWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalCloudflareApiKeyPlugin = BaseCloudflareApiKeyPlugin<CloudflareApiKeyPluginOptions>;

export type ExternalCloudflareApiKeyPlugin<T extends CloudflareApiKeyPluginOptions> =
	BaseCloudflareApiKeyPlugin<T>;

export function cloudflareapikey<const T extends CloudflareApiKeyPluginOptions>(
	incomingOptions: CloudflareApiKeyPluginOptions & T = {} as CloudflareApiKeyPluginOptions & T,
): ExternalCloudflareApiKeyPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'cloudflareapikey',
		authConfig: cloudflareApiKeyAuthConfig,
		schema: CloudflareApiKeySchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: cloudflareApiKeyEndpointsNested,
		webhooks: cloudflareApiKeyWebhooksNested,
		endpointMeta: cloudflareApiKeyEndpointMeta,
		endpointSchemas: cloudflareApiKeyEndpointSchemas,
		webhookSchemas: cloudflareApiKeyWebhookSchemas,
		pluginWebhookMatcher: (request) => {
			const headers = request.headers;
			// TODO: Update to match your webhook signature headers
			return 'x-cloudflareapikey-signature' in headers;
		},
		pluginTenantWebhookMatcher: matchCloudflareApiKeyTenantWebhook,
		oauthWebhookTenantLinkResolver: resolveCloudflareApiKeyOAuthWebhookTenantLink,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: CloudflareApiKeyKeyBuilderContext, source) => {
			if (source === 'webhook' && options.webhookSecret) {
				return options.webhookSecret;
			}

			if (source === 'webhook') {
				const res = await ctx.keys.get_webhook_signature();
				return res ?? '';
			}

			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				return res ?? '';
			}

			if (source === 'endpoint' && ctx.authType === 'oauth_2') {
				const res = await ctx.keys.get_access_token();
				return res ?? '';
			}

			return '';
		},
	} satisfies InternalCloudflareApiKeyPlugin;
}

export type {
	ExampleEvent,
	CloudflareApiKeyWebhookOutputs,
} from './webhooks/types';

export type {
	CloudflareApiKeyEndpointInputs,
	CloudflareApiKeyEndpointOutputs,
} from './endpoints/types';
