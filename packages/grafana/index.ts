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
import {
	Dashboards,
	Health,
	Jwks,
	Logs,
	Ring,
	Saml,
	Status,
	StoreGateway,
} from './endpoints';
import type {
	GrafanaEndpointInputs,
	GrafanaEndpointOutputs,
} from './endpoints/types';
import {
	GrafanaEndpointInputSchemas,
	GrafanaEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { GrafanaSchema } from './schema';

export type GrafanaPluginOptions = {
	authType?: PickAuth<'api_key'>;
	/** Grafana Service Account Token (bearer token) */
	key?: string;
	/** Grafana instance base URL, e.g. https://example.grafana.net */
	grafanaUrl?: string;
	hooks?: InternalGrafanaPlugin['hooks'];
	webhookHooks?: InternalGrafanaPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	/**
	 * Permission configuration for the Grafana plugin.
	 * Controls what the AI agent is allowed to do.
	 * Overrides use dot-notation paths from the Grafana endpoint tree — invalid paths are type errors.
	 */
	permissions?: PluginPermissionsConfig<typeof grafanaEndpointsNested>;
};

/**
 * Extends the base api_key auth config with a `grafana_url` account field.
 * This allows the Grafana instance URL to be stored via `corsair auth` rather than hard-coded.
 */
export const grafanaAuthConfig = {
	api_key: {
		account: ['grafana_url'] as const,
	},
} as const satisfies PluginAuthConfig;

export type GrafanaContext = CorsairPluginContext<
	typeof GrafanaSchema,
	GrafanaPluginOptions,
	undefined,
	typeof grafanaAuthConfig
>;

export type GrafanaKeyBuilderContext = KeyBuilderContext<
	GrafanaPluginOptions,
	typeof grafanaAuthConfig
>;

export type GrafanaBoundEndpoints = BindEndpoints<
	typeof grafanaEndpointsNested
>;

type GrafanaEndpoint<K extends keyof GrafanaEndpointOutputs> = CorsairEndpoint<
	GrafanaContext,
	GrafanaEndpointInputs[K],
	GrafanaEndpointOutputs[K]
>;

export type GrafanaEndpoints = {
	logsCreateOtlp: GrafanaEndpoint<'logsCreateOtlp'>;
	healthGet: GrafanaEndpoint<'healthGet'>;
	statusGet: GrafanaEndpoint<'statusGet'>;
	ringGetDistributorHaTracker: GrafanaEndpoint<'ringGetDistributorHaTracker'>;
	ringGetIndexGateway: GrafanaEndpoint<'ringGetIndexGateway'>;
	ringGetOverridesExporter: GrafanaEndpoint<'ringGetOverridesExporter'>;
	ringGetRuler: GrafanaEndpoint<'ringGetRuler'>;
	storeGatewayGetTenants: GrafanaEndpoint<'storeGatewayGetTenants'>;
	samlPostAcs: GrafanaEndpoint<'samlPostAcs'>;
	dashboardsQueryPublic: GrafanaEndpoint<'dashboardsQueryPublic'>;
	jwksRetrieve: GrafanaEndpoint<'jwksRetrieve'>;
};

const grafanaEndpointsNested = {
	logs: {
		createOtlp: Logs.createOtlp,
	},
	health: {
		get: Health.get,
	},
	status: {
		get: Status.get,
	},
	ring: {
		getDistributorHaTracker: Ring.getDistributorHaTracker,
		getIndexGateway: Ring.getIndexGateway,
		getOverridesExporter: Ring.getOverridesExporter,
		getRuler: Ring.getRuler,
	},
	storeGateway: {
		getTenants: StoreGateway.getTenants,
	},
	saml: {
		postAcs: Saml.postAcs,
	},
	dashboards: {
		queryPublic: Dashboards.queryPublic,
	},
	jwks: {
		retrieve: Jwks.retrieve,
	},
} as const;

// Grafana has no webhook triggers (triggers: [] in API spec)
const grafanaWebhooksNested = {} as const;

export const grafanaEndpointSchemas = {
	'logs.createOtlp': {
		input: GrafanaEndpointInputSchemas.logsCreateOtlp,
		output: GrafanaEndpointOutputSchemas.logsCreateOtlp,
	},
	'health.get': {
		input: GrafanaEndpointInputSchemas.healthGet,
		output: GrafanaEndpointOutputSchemas.healthGet,
	},
	'status.get': {
		input: GrafanaEndpointInputSchemas.statusGet,
		output: GrafanaEndpointOutputSchemas.statusGet,
	},
	'ring.getDistributorHaTracker': {
		input: GrafanaEndpointInputSchemas.ringGetDistributorHaTracker,
		output: GrafanaEndpointOutputSchemas.ringGetDistributorHaTracker,
	},
	'ring.getIndexGateway': {
		input: GrafanaEndpointInputSchemas.ringGetIndexGateway,
		output: GrafanaEndpointOutputSchemas.ringGetIndexGateway,
	},
	'ring.getOverridesExporter': {
		input: GrafanaEndpointInputSchemas.ringGetOverridesExporter,
		output: GrafanaEndpointOutputSchemas.ringGetOverridesExporter,
	},
	'ring.getRuler': {
		input: GrafanaEndpointInputSchemas.ringGetRuler,
		output: GrafanaEndpointOutputSchemas.ringGetRuler,
	},
	'storeGateway.getTenants': {
		input: GrafanaEndpointInputSchemas.storeGatewayGetTenants,
		output: GrafanaEndpointOutputSchemas.storeGatewayGetTenants,
	},
	'saml.postAcs': {
		input: GrafanaEndpointInputSchemas.samlPostAcs,
		output: GrafanaEndpointOutputSchemas.samlPostAcs,
	},
	'dashboards.queryPublic': {
		input: GrafanaEndpointInputSchemas.dashboardsQueryPublic,
		output: GrafanaEndpointOutputSchemas.dashboardsQueryPublic,
	},
	'jwks.retrieve': {
		input: GrafanaEndpointInputSchemas.jwksRetrieve,
		output: GrafanaEndpointOutputSchemas.jwksRetrieve,
	},
} satisfies RequiredPluginEndpointSchemas<typeof grafanaEndpointsNested>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const grafanaEndpointMeta = {
	'logs.createOtlp': {
		riskLevel: 'write',
		description: 'Send OTLP v1 logs to Grafana Loki for ingestion',
	},
	'health.get': {
		riskLevel: 'read',
		description: 'Check Grafana server health and database connectivity',
	},
	'status.get': {
		riskLevel: 'read',
		description: 'Check Grafana Enterprise license availability',
	},
	'ring.getDistributorHaTracker': {
		riskLevel: 'read',
		description: 'Get distributor HA tracker ring status',
	},
	'ring.getIndexGateway': {
		riskLevel: 'read',
		description: 'Get index gateway hash ring status',
	},
	'ring.getOverridesExporter': {
		riskLevel: 'read',
		description: 'Get overrides-exporter hash ring status',
	},
	'ring.getRuler': {
		riskLevel: 'read',
		description: 'Get ruler ring status from Grafana Mimir',
	},
	'storeGateway.getTenants': {
		riskLevel: 'read',
		description: 'List tenants with blocks in the store-gateway storage',
	},
	'saml.postAcs': {
		riskLevel: 'write',
		description:
			'Process a SAML Assertion Consumer Service authentication response',
	},
	'dashboards.queryPublic': {
		riskLevel: 'read',
		description: 'Query a panel on a public Grafana dashboard',
	},
	'jwks.retrieve': {
		riskLevel: 'read',
		description: 'Retrieve JWKS public keys for token verification',
	},
} satisfies RequiredPluginEndpointMeta<typeof grafanaEndpointsNested>;

export type BaseGrafanaPlugin<T extends GrafanaPluginOptions> = CorsairPlugin<
	'grafana',
	typeof GrafanaSchema,
	typeof grafanaEndpointsNested,
	typeof grafanaWebhooksNested,
	T,
	typeof defaultAuthType,
	typeof grafanaAuthConfig
>;

export type InternalGrafanaPlugin = BaseGrafanaPlugin<GrafanaPluginOptions>;

export type ExternalGrafanaPlugin<T extends GrafanaPluginOptions> =
	BaseGrafanaPlugin<T>;

export function grafana<const T extends GrafanaPluginOptions>(
	incomingOptions: GrafanaPluginOptions & T = {} as GrafanaPluginOptions & T,
): ExternalGrafanaPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'grafana',
		schema: GrafanaSchema,
		options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: grafanaEndpointsNested,
		webhooks: grafanaWebhooksNested,
		authConfig: grafanaAuthConfig,
		endpointMeta: grafanaEndpointMeta,
		endpointSchemas: grafanaEndpointSchemas,
		// Grafana has no webhooks — no incoming webhook requests to match
		pluginWebhookMatcher: (_request) => false,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: GrafanaKeyBuilderContext, source) => {
			// Webhook source is not used for Grafana (no webhooks defined)
			if (source === 'webhook') {
				return '';
			}

			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (!res) {
					return '';
				}
				return res;
			}

			return '';
		},
	} satisfies InternalGrafanaPlugin;
}

// ─────────────────────────────────────────────────────────────────────────────
// Endpoint Type Exports
// ─────────────────────────────────────────────────────────────────────────────

export type {
	DashboardsQueryPublicInput,
	DashboardsQueryPublicResponse,
	GrafanaEndpointInputs,
	GrafanaEndpointOutputs,
	HealthGetInput,
	HealthGetResponse,
	JwksRetrieveInput,
	JwksRetrieveResponse,
	LogsCreateOtlpInput,
	LogsCreateOtlpResponse,
	RingGetDistributorHaTrackerInput,
	RingGetDistributorHaTrackerResponse,
	RingGetIndexGatewayInput,
	RingGetIndexGatewayResponse,
	RingGetOverridesExporterInput,
	RingGetOverridesExporterResponse,
	RingGetRulerInput,
	RingGetRulerResponse,
	SamlPostAcsInput,
	SamlPostAcsResponse,
	StatusGetInput,
	StatusGetResponse,
	StoreGatewayGetTenantsInput,
	StoreGatewayGetTenantsResponse,
} from './endpoints/types';

export type { GrafanaWebhookOutputs } from './webhooks/types';
