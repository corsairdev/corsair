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
	CacheEndpoints,
	DNSEndpoints,
	DnssecEndpoints,
	IpsEndpoints,
	LockdownsEndpoints,
	RulesetsEndpoints,
	S3Endpoints,
	ZonesEndpoints,
} from './endpoints';
import type {
	CloudflareApiKeyEndpointInputs,
	CloudflareApiKeyEndpointOutputs,
} from './endpoints/types';
import {
	CloudflareApiKeyEndpointInputSchemas,
	CloudflareApiKeyEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { CloudflareApiKeySchema } from './schema';

export type CloudflareApiKeyPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalCloudflareApiKeyPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof cloudflareApiKeyEndpointsNested>;
};

export type CloudflareApiKeyContext = CorsairPluginContext<
	typeof CloudflareApiKeySchema,
	CloudflareApiKeyPluginOptions
>;

export type CloudflareApiKeyKeyBuilderContext =
	KeyBuilderContext<CloudflareApiKeyPluginOptions>;

export type CloudflareApiKeyBoundEndpoints = BindEndpoints<
	typeof cloudflareApiKeyEndpointsNested
>;

type CloudflareApiKeyEndpoint<K extends keyof CloudflareApiKeyEndpointOutputs> =
	CorsairEndpoint<
		CloudflareApiKeyContext,
		CloudflareApiKeyEndpointInputs[K],
		CloudflareApiKeyEndpointOutputs[K]
	>;

export type CloudflareApiKeyEndpoints = {
	[K in keyof CloudflareApiKeyEndpointOutputs]: CloudflareApiKeyEndpoint<K>;
};

const cloudflareApiKeyEndpointsNested = {
	zones: ZonesEndpoints,
	dns: DNSEndpoints,
	dnssec: DnssecEndpoints,
	lockdowns: LockdownsEndpoints,
	rulesets: RulesetsEndpoints,
	cache: CacheEndpoints,
	ips: IpsEndpoints,
	s3: S3Endpoints,
} as const;

export const cloudflareApiKeyEndpointSchemas = {
	'zones.list': {
		input: CloudflareApiKeyEndpointInputSchemas.zonesList,
		output: CloudflareApiKeyEndpointOutputSchemas.zonesList,
	},
	'zones.get': {
		input: CloudflareApiKeyEndpointInputSchemas.zonesGet,
		output: CloudflareApiKeyEndpointOutputSchemas.zonesGet,
	},
	'zones.update': {
		input: CloudflareApiKeyEndpointInputSchemas.zonesUpdate,
		output: CloudflareApiKeyEndpointOutputSchemas.zonesUpdate,
	},
	'zones.delete': {
		input: CloudflareApiKeyEndpointInputSchemas.zonesDelete,
		output: CloudflareApiKeyEndpointOutputSchemas.zonesDelete,
	},
	'zones.rerunActivationCheck': {
		input: CloudflareApiKeyEndpointInputSchemas.zonesRerunActivationCheck,
		output: CloudflareApiKeyEndpointOutputSchemas.zonesRerunActivationCheck,
	},
	'dns.list': {
		input: CloudflareApiKeyEndpointInputSchemas.dnsList,
		output: CloudflareApiKeyEndpointOutputSchemas.dnsList,
	},
	'dns.create': {
		input: CloudflareApiKeyEndpointInputSchemas.dnsCreate,
		output: CloudflareApiKeyEndpointOutputSchemas.dnsCreate,
	},
	'dns.overwrite': {
		input: CloudflareApiKeyEndpointInputSchemas.dnsOverwrite,
		output: CloudflareApiKeyEndpointOutputSchemas.dnsOverwrite,
	},
	'dns.delete': {
		input: CloudflareApiKeyEndpointInputSchemas.dnsDelete,
		output: CloudflareApiKeyEndpointOutputSchemas.dnsDelete,
	},
	'dnssec.update': {
		input: CloudflareApiKeyEndpointInputSchemas.dnssecUpdate,
		output: CloudflareApiKeyEndpointOutputSchemas.dnssecUpdate,
	},
	'dnssec.delete': {
		input: CloudflareApiKeyEndpointInputSchemas.dnssecDelete,
		output: CloudflareApiKeyEndpointOutputSchemas.dnssecDelete,
	},
	'lockdowns.create': {
		input: CloudflareApiKeyEndpointInputSchemas.lockdownsCreate,
		output: CloudflareApiKeyEndpointOutputSchemas.lockdownsCreate,
	},
	'lockdowns.get': {
		input: CloudflareApiKeyEndpointInputSchemas.lockdownsGet,
		output: CloudflareApiKeyEndpointOutputSchemas.lockdownsGet,
	},
	'lockdowns.update': {
		input: CloudflareApiKeyEndpointInputSchemas.lockdownsUpdate,
		output: CloudflareApiKeyEndpointOutputSchemas.lockdownsUpdate,
	},
	'rulesets.get': {
		input: CloudflareApiKeyEndpointInputSchemas.rulesetsGet,
		output: CloudflareApiKeyEndpointOutputSchemas.rulesetsGet,
	},
	'rulesets.create': {
		input: CloudflareApiKeyEndpointInputSchemas.rulesetsCreate,
		output: CloudflareApiKeyEndpointOutputSchemas.rulesetsCreate,
	},
	'rulesets.update': {
		input: CloudflareApiKeyEndpointInputSchemas.rulesetsUpdate,
		output: CloudflareApiKeyEndpointOutputSchemas.rulesetsUpdate,
	},
	'rulesets.delete': {
		input: CloudflareApiKeyEndpointInputSchemas.rulesetsDelete,
		output: CloudflareApiKeyEndpointOutputSchemas.rulesetsDelete,
	},
	'rulesets.createRule': {
		input: CloudflareApiKeyEndpointInputSchemas.rulesetsCreateRule,
		output: CloudflareApiKeyEndpointOutputSchemas.rulesetsCreateRule,
	},
	'rulesets.updateRule': {
		input: CloudflareApiKeyEndpointInputSchemas.rulesetsUpdateRule,
		output: CloudflareApiKeyEndpointOutputSchemas.rulesetsUpdateRule,
	},
	'rulesets.deleteRule': {
		input: CloudflareApiKeyEndpointInputSchemas.rulesetsDeleteRule,
		output: CloudflareApiKeyEndpointOutputSchemas.rulesetsDeleteRule,
	},
	'rulesets.getEntrypointVersion': {
		input: CloudflareApiKeyEndpointInputSchemas.rulesetsGetEntrypointVersion,
		output: CloudflareApiKeyEndpointOutputSchemas.rulesetsGetEntrypointVersion,
	},
	'cache.getRegionalTieredCache': {
		input: CloudflareApiKeyEndpointInputSchemas.cacheGetRegionalTieredCache,
		output: CloudflareApiKeyEndpointOutputSchemas.cacheGetRegionalTieredCache,
	},
	'ips.get': {
		input: CloudflareApiKeyEndpointInputSchemas.ipsGet,
		output: CloudflareApiKeyEndpointOutputSchemas.ipsGet,
	},
	's3.upload': {
		input: CloudflareApiKeyEndpointInputSchemas.s3Upload,
		output: CloudflareApiKeyEndpointOutputSchemas.s3Upload,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof cloudflareApiKeyEndpointsNested
>;

const cloudflareApiKeyEndpointMeta = {
	'zones.list': {
		riskLevel: 'read',
		description: 'List, search, sort, and filter Cloudflare zones',
	},
	'zones.get': {
		riskLevel: 'read',
		description: 'Get details for a specific zone',
	},
	'zones.update': {
		riskLevel: 'write',
		description:
			'Edit a Cloudflare zone (one of paused, type, or vanity_name_servers)',
	},
	'zones.delete': {
		riskLevel: 'destructive',
		description: 'Delete an existing zone [DESTRUCTIVE]',
	},
	'zones.rerunActivationCheck': {
		riskLevel: 'write',
		description: 'Trigger a new activation check for a pending zone',
	},
	'dns.list': {
		riskLevel: 'read',
		description: 'List, search, sort, and filter DNS records for a zone',
	},
	'dns.create': {
		riskLevel: 'write',
		description: 'Create a DNS record in a zone',
	},
	'dns.overwrite': {
		riskLevel: 'write',
		description: 'Completely overwrite a DNS record',
	},
	'dns.delete': {
		riskLevel: 'destructive',
		description: 'Delete a DNS record [DESTRUCTIVE]',
	},
	'dnssec.update': {
		riskLevel: 'write',
		description: 'Enable or disable DNSSEC for a zone',
	},
	'dnssec.delete': {
		riskLevel: 'destructive',
		description: 'Delete DNSSEC configuration for a zone [DESTRUCTIVE]',
	},
	'lockdowns.create': {
		riskLevel: 'write',
		description: 'Create a Zone Lockdown rule',
	},
	'lockdowns.get': {
		riskLevel: 'read',
		description: 'Get a Zone Lockdown rule by ID',
	},
	'lockdowns.update': {
		riskLevel: 'write',
		description: 'Update a Zone Lockdown rule',
	},
	'rulesets.get': {
		riskLevel: 'read',
		description: 'Fetch the latest version of a ruleset by ID',
	},
	'rulesets.create': {
		riskLevel: 'write',
		description: 'Create a ruleset at account or zone scope',
	},
	'rulesets.update': {
		riskLevel: 'write',
		description: 'Update a ruleset (include every rule you want to keep)',
	},
	'rulesets.delete': {
		riskLevel: 'destructive',
		description: 'Delete all versions of a ruleset [DESTRUCTIVE]',
	},
	'rulesets.createRule': {
		riskLevel: 'write',
		description: 'Add a rule to an existing ruleset',
	},
	'rulesets.updateRule': {
		riskLevel: 'write',
		description: 'Update a specific rule in a ruleset',
	},
	'rulesets.deleteRule': {
		riskLevel: 'destructive',
		description: 'Delete a rule from a ruleset [DESTRUCTIVE]',
	},
	'rulesets.getEntrypointVersion': {
		riskLevel: 'read',
		description: 'Get a historical entrypoint ruleset version',
	},
	'cache.getRegionalTieredCache': {
		riskLevel: 'read',
		description: 'Get the regional tiered cache setting for a zone',
	},
	'ips.get': {
		riskLevel: 'read',
		description: 'Retrieve Cloudflare or JD Cloud IP CIDR blocks',
	},
	's3.upload': {
		riskLevel: 'write',
		description:
			'Upload file content to an R2 bucket (S3-compatible object storage)',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof cloudflareApiKeyEndpointsNested
>;

const defaultAuthType: AuthTypes = 'api_key' as const;

export const cloudflareApiKeyAuthConfig = {
	api_key: {
		account: ['account_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseCloudflareApiKeyPlugin<
	T extends CloudflareApiKeyPluginOptions,
> = CorsairPlugin<
	'cloudflareapikey',
	typeof CloudflareApiKeySchema,
	typeof cloudflareApiKeyEndpointsNested,
	{},
	T,
	typeof defaultAuthType
>;

export type InternalCloudflareApiKeyPlugin =
	BaseCloudflareApiKeyPlugin<CloudflareApiKeyPluginOptions>;

export type ExternalCloudflareApiKeyPlugin<
	T extends CloudflareApiKeyPluginOptions,
> = BaseCloudflareApiKeyPlugin<T>;

export function cloudflareapikey<const T extends CloudflareApiKeyPluginOptions>(
	incomingOptions: CloudflareApiKeyPluginOptions &
		T = {} as CloudflareApiKeyPluginOptions & T,
): ExternalCloudflareApiKeyPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'cloudflareapikey',
		authConfig: cloudflareApiKeyAuthConfig,
		schema: CloudflareApiKeySchema,
		options,
		hooks: options.hooks,
		endpoints: cloudflareApiKeyEndpointsNested,
		webhooks: {},
		endpointMeta: cloudflareApiKeyEndpointMeta,
		endpointSchemas: cloudflareApiKeyEndpointSchemas,
		pluginWebhookMatcher: () => false,
		pluginTenantWebhookMatcher: () => null,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: CloudflareApiKeyKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				return res ?? '';
			}

			return '';
		},
	} satisfies InternalCloudflareApiKeyPlugin;
}

export type {
	CloudflareApiKeyEndpointInputs,
	CloudflareApiKeyEndpointOutputs,
} from './endpoints/types';
