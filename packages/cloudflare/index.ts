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
} from 'corsair/core';
import {
	DNSEndpoints,
	RulesetsEndpoints,
	WorkerRoutesEndpoints,
	WorkersEndpoints,
	ZonesEndpoints,
} from './endpoints';
import type {
	CloudflareEndpointInputs,
	CloudflareEndpointOutputs,
} from './endpoints/types';
import {
	CloudflareEndpointInputSchemas,
	CloudflareEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { CloudflareSchema } from './schema';

export type CloudflarePluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalCloudflarePlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof cloudflareEndpointsNested>;
};

export type CloudflareContext = CorsairPluginContext<
	typeof CloudflareSchema,
	CloudflarePluginOptions
>;

export type CloudflareKeyBuilderContext =
	KeyBuilderContext<CloudflarePluginOptions>;

export type CloudflareBoundEndpoints = BindEndpoints<
	typeof cloudflareEndpointsNested
>;

type CloudflareEndpoint<K extends keyof CloudflareEndpointOutputs> =
	CorsairEndpoint<
		CloudflareContext,
		CloudflareEndpointInputs[K],
		CloudflareEndpointOutputs[K]
	>;

export type CloudflareEndpoints = {
	zonesList: CloudflareEndpoint<'zonesList'>;
	zonesGet: CloudflareEndpoint<'zonesGet'>;
	zonesCreate: CloudflareEndpoint<'zonesCreate'>;
	zonesEdit: CloudflareEndpoint<'zonesEdit'>;
	zonesDelete: CloudflareEndpoint<'zonesDelete'>;
	dnsList: CloudflareEndpoint<'dnsList'>;
	dnsGet: CloudflareEndpoint<'dnsGet'>;
	dnsCreate: CloudflareEndpoint<'dnsCreate'>;
	dnsEdit: CloudflareEndpoint<'dnsEdit'>;
	dnsDelete: CloudflareEndpoint<'dnsDelete'>;
	workersList: CloudflareEndpoint<'workersList'>;
	workersGet: CloudflareEndpoint<'workersGet'>;
	workersUpload: CloudflareEndpoint<'workersUpload'>;
	workersDelete: CloudflareEndpoint<'workersDelete'>;
	workerRoutesList: CloudflareEndpoint<'workerRoutesList'>;
	workerRoutesGet: CloudflareEndpoint<'workerRoutesGet'>;
	workerRoutesCreate: CloudflareEndpoint<'workerRoutesCreate'>;
	workerRoutesEdit: CloudflareEndpoint<'workerRoutesEdit'>;
	workerRoutesDelete: CloudflareEndpoint<'workerRoutesDelete'>;
	rulesetsList: CloudflareEndpoint<'rulesetsList'>;
	rulesetsGet: CloudflareEndpoint<'rulesetsGet'>;
	rulesetsCreate: CloudflareEndpoint<'rulesetsCreate'>;
	rulesetsUpdate: CloudflareEndpoint<'rulesetsUpdate'>;
	rulesetsDelete: CloudflareEndpoint<'rulesetsDelete'>;
};

const cloudflareEndpointsNested = {
	zones: ZonesEndpoints,
	dns: DNSEndpoints,
	workers: {
		scripts: WorkersEndpoints,
		routes: WorkerRoutesEndpoints,
	},
	rulesets: RulesetsEndpoints,
} as const;

export const cloudflareEndpointSchemas = {
	'zones.list': {
		input: CloudflareEndpointInputSchemas.zonesList,
		output: CloudflareEndpointOutputSchemas.zonesList,
	},
	'zones.get': {
		input: CloudflareEndpointInputSchemas.zonesGet,
		output: CloudflareEndpointOutputSchemas.zonesGet,
	},
	'zones.create': {
		input: CloudflareEndpointInputSchemas.zonesCreate,
		output: CloudflareEndpointOutputSchemas.zonesCreate,
	},
	'zones.edit': {
		input: CloudflareEndpointInputSchemas.zonesEdit,
		output: CloudflareEndpointOutputSchemas.zonesEdit,
	},
	'zones.delete': {
		input: CloudflareEndpointInputSchemas.zonesDelete,
		output: CloudflareEndpointOutputSchemas.zonesDelete,
	},
	'dns.list': {
		input: CloudflareEndpointInputSchemas.dnsList,
		output: CloudflareEndpointOutputSchemas.dnsList,
	},
	'dns.get': {
		input: CloudflareEndpointInputSchemas.dnsGet,
		output: CloudflareEndpointOutputSchemas.dnsGet,
	},
	'dns.create': {
		input: CloudflareEndpointInputSchemas.dnsCreate,
		output: CloudflareEndpointOutputSchemas.dnsCreate,
	},
	'dns.edit': {
		input: CloudflareEndpointInputSchemas.dnsEdit,
		output: CloudflareEndpointOutputSchemas.dnsEdit,
	},
	'dns.delete': {
		input: CloudflareEndpointInputSchemas.dnsDelete,
		output: CloudflareEndpointOutputSchemas.dnsDelete,
	},
	'workers.scripts.list': {
		input: CloudflareEndpointInputSchemas.workersList,
		output: CloudflareEndpointOutputSchemas.workersList,
	},
	'workers.scripts.get': {
		input: CloudflareEndpointInputSchemas.workersGet,
		output: CloudflareEndpointOutputSchemas.workersGet,
	},
	'workers.scripts.upload': {
		input: CloudflareEndpointInputSchemas.workersUpload,
		output: CloudflareEndpointOutputSchemas.workersUpload,
	},
	'workers.scripts.delete': {
		input: CloudflareEndpointInputSchemas.workersDelete,
		output: CloudflareEndpointOutputSchemas.workersDelete,
	},
	'workers.routes.list': {
		input: CloudflareEndpointInputSchemas.workerRoutesList,
		output: CloudflareEndpointOutputSchemas.workerRoutesList,
	},
	'workers.routes.get': {
		input: CloudflareEndpointInputSchemas.workerRoutesGet,
		output: CloudflareEndpointOutputSchemas.workerRoutesGet,
	},
	'workers.routes.create': {
		input: CloudflareEndpointInputSchemas.workerRoutesCreate,
		output: CloudflareEndpointOutputSchemas.workerRoutesCreate,
	},
	'workers.routes.edit': {
		input: CloudflareEndpointInputSchemas.workerRoutesEdit,
		output: CloudflareEndpointOutputSchemas.workerRoutesEdit,
	},
	'workers.routes.delete': {
		input: CloudflareEndpointInputSchemas.workerRoutesDelete,
		output: CloudflareEndpointOutputSchemas.workerRoutesDelete,
	},
	'rulesets.list': {
		input: CloudflareEndpointInputSchemas.rulesetsList,
		output: CloudflareEndpointOutputSchemas.rulesetsList,
	},
	'rulesets.get': {
		input: CloudflareEndpointInputSchemas.rulesetsGet,
		output: CloudflareEndpointOutputSchemas.rulesetsGet,
	},
	'rulesets.create': {
		input: CloudflareEndpointInputSchemas.rulesetsCreate,
		output: CloudflareEndpointOutputSchemas.rulesetsCreate,
	},
	'rulesets.update': {
		input: CloudflareEndpointInputSchemas.rulesetsUpdate,
		output: CloudflareEndpointOutputSchemas.rulesetsUpdate,
	},
	'rulesets.delete': {
		input: CloudflareEndpointInputSchemas.rulesetsDelete,
		output: CloudflareEndpointOutputSchemas.rulesetsDelete,
	},
} as const;

const defaultAuthType: AuthTypes = 'api_key' as const;

const cloudflareEndpointMeta = {
	'zones.list': {
		riskLevel: 'read',
		description: 'List Cloudflare zones',
	},
	'zones.get': {
		riskLevel: 'read',
		description: 'Retrieve a Cloudflare zone by ID',
	},
	'zones.create': {
		riskLevel: 'write',
		description: 'Create a new Cloudflare zone',
	},
	'zones.edit': {
		riskLevel: 'write',
		description: 'Update a Cloudflare zone',
	},
	'zones.delete': {
		riskLevel: 'destructive',
		description: 'Delete a Cloudflare zone [DESTRUCTIVE]',
	},
	'dns.list': {
		riskLevel: 'read',
		description: 'List DNS records for a zone',
	},
	'dns.get': {
		riskLevel: 'read',
		description: 'Retrieve a DNS record by ID',
	},
	'dns.create': {
		riskLevel: 'write',
		description: 'Create a DNS record in a zone',
	},
	'dns.edit': {
		riskLevel: 'write',
		description: 'Update a DNS record',
	},
	'dns.delete': {
		riskLevel: 'destructive',
		description: 'Delete a DNS record [DESTRUCTIVE]',
	},
	'workers.scripts.list': {
		riskLevel: 'read',
		description: 'List Workers scripts for an account',
	},
	'workers.scripts.get': {
		riskLevel: 'read',
		description: 'Download Workers script source code by name',
	},
	'workers.scripts.upload': {
		riskLevel: 'write',
		description: 'Upload or overwrite a Workers script',
	},
	'workers.scripts.delete': {
		riskLevel: 'destructive',
		description: 'Delete a Workers script [DESTRUCTIVE]',
	},
	'workers.routes.list': {
		riskLevel: 'read',
		description: 'List Workers routes for a zone',
	},
	'workers.routes.get': {
		riskLevel: 'read',
		description: 'Retrieve a Workers route by ID',
	},
	'workers.routes.create': {
		riskLevel: 'write',
		description: 'Create a Workers route',
	},
	'workers.routes.edit': {
		riskLevel: 'write',
		description: 'Update a Workers route',
	},
	'workers.routes.delete': {
		riskLevel: 'destructive',
		description: 'Delete a Workers route [DESTRUCTIVE]',
	},
	'rulesets.list': {
		riskLevel: 'read',
		description: 'List rulesets for a zone',
	},
	'rulesets.get': {
		riskLevel: 'read',
		description: 'Retrieve a ruleset by ID',
	},
	'rulesets.create': {
		riskLevel: 'write',
		description: 'Create a ruleset in a zone',
	},
	'rulesets.update': {
		riskLevel: 'write',
		description: 'Update a ruleset',
	},
	'rulesets.delete': {
		riskLevel: 'destructive',
		description: 'Delete a ruleset [DESTRUCTIVE]',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof cloudflareEndpointsNested
>;

export const cloudflareAuthConfig = {
	api_key: {
		account: ['one'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseCloudflarePlugin<T extends CloudflarePluginOptions> =
	CorsairPlugin<
		'cloudflare',
		typeof CloudflareSchema,
		typeof cloudflareEndpointsNested,
		{},
		T,
		typeof defaultAuthType
	>;

export type InternalCloudflarePlugin =
	BaseCloudflarePlugin<CloudflarePluginOptions>;

export type ExternalCloudflarePlugin<T extends CloudflarePluginOptions> =
	BaseCloudflarePlugin<T>;

export function cloudflare<const T extends CloudflarePluginOptions>(
	incomingOptions: CloudflarePluginOptions & T = {} as CloudflarePluginOptions &
		T,
): ExternalCloudflarePlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'cloudflare',
		schema: CloudflareSchema,
		options: options,
		hooks: options.hooks,
		endpoints: cloudflareEndpointsNested,
		webhooks: {},
		endpointMeta: cloudflareEndpointMeta,
		endpointSchemas: cloudflareEndpointSchemas,
		pluginWebhookMatcher: () => false,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: CloudflareKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				return res ?? '';
			}

			return '';
		},
	} satisfies InternalCloudflarePlugin;
}

export type {
	CloudflareEndpointInputs,
	CloudflareEndpointOutputs,
	DnsCreateInput,
	DnsCreateResponse,
	DnsDeleteInput,
	DnsDeleteResponse,
	DnsEditInput,
	DnsEditResponse,
	DnsGetInput,
	DnsGetResponse,
	DnsListInput,
	DnsListResponse,
	RulesetsCreateInput,
	RulesetsCreateResponse,
	RulesetsDeleteInput,
	RulesetsDeleteResponse,
	RulesetsGetInput,
	RulesetsGetResponse,
	RulesetsListInput,
	RulesetsListResponse,
	RulesetsUpdateInput,
	RulesetsUpdateResponse,
	WorkerRoutesCreateInput,
	WorkerRoutesCreateResponse,
	WorkerRoutesDeleteInput,
	WorkerRoutesDeleteResponse,
	WorkerRoutesEditInput,
	WorkerRoutesEditResponse,
	WorkerRoutesGetInput,
	WorkerRoutesGetResponse,
	WorkerRoutesListInput,
	WorkerRoutesListResponse,
	WorkersDeleteInput,
	WorkersDeleteResponse,
	WorkersGetInput,
	WorkersGetResponse,
	WorkersListInput,
	WorkersListResponse,
	WorkersUploadInput,
	WorkersUploadResponse,
	ZonesCreateInput,
	ZonesCreateResponse,
	ZonesDeleteInput,
	ZonesDeleteResponse,
	ZonesEditInput,
	ZonesEditResponse,
	ZonesGetInput,
	ZonesGetResponse,
	ZonesListInput,
	ZonesListResponse,
} from './endpoints/types';
