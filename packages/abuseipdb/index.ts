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
import { tryGetStoredKey } from './client';
import {
	Blacklist,
	CheckBlock,
	CheckIp,
	ClearAddress,
	ReportIp,
	Reports,
} from './endpoints';
import type {
	AbuseIPDBEndpointInputs,
	AbuseIPDBEndpointOutputs,
} from './endpoints/types';
import {
	AbuseIPDBEndpointInputSchemas,
	AbuseIPDBEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { AbuseIPDBSchema } from './schema';

// ─────────────────────────────────────────────────────────────────────────────
// Plugin Options
// ─────────────────────────────────────────────────────────────────────────────

export type AbuseIPDBPluginOptions = {
	/** Authentication method. Only api_key is supported. */
	authType?: PickAuth<'api_key'>;
	/**
	 * AbuseIPDB account API key (from the dashboard). Sent in the `Key`
	 * header on every request.
	 */
	key?: string;
	/** Optional: lifecycle hooks for endpoints */
	hooks?: InternalAbuseIPDBPlugin['hooks'];
	/** Optional: custom error handlers (merged with defaults) */
	errorHandlers?: CorsairErrorHandler;
	/**
	 * Permission configuration for the AbuseIPDB plugin. The read-only
	 * endpoints (check, reports, blacklist, check-block) default to 'open';
	 * the write endpoints (report, clear-address) default to 'allow'.
	 */
	permissions?: PluginPermissionsConfig<typeof abuseIPDBEndpointsNested>;
};

// ─────────────────────────────────────────────────────────────────────────────
// Context & Type Helpers
// ─────────────────────────────────────────────────────────────────────────────

export type AbuseIPDBContext = CorsairPluginContext<
	typeof AbuseIPDBSchema,
	AbuseIPDBPluginOptions,
	undefined,
	typeof abuseIPDBAuthConfig
>;

export type AbuseIPDBKeyBuilderContext = KeyBuilderContext<
	AbuseIPDBPluginOptions,
	typeof abuseIPDBAuthConfig
>;

export type AbuseIPDBBoundEndpoints = BindEndpoints<
	typeof abuseIPDBEndpointsNested
>;

type AbuseIPDBEndpoint<K extends keyof AbuseIPDBEndpointOutputs> =
	CorsairEndpoint<
		AbuseIPDBContext,
		AbuseIPDBEndpointInputs[K],
		AbuseIPDBEndpointOutputs[K]
	>;

export type AbuseIPDBEndpoints = {
	checkIp: AbuseIPDBEndpoint<'checkIp'>;
	getReports: AbuseIPDBEndpoint<'getReports'>;
	getBlacklist: AbuseIPDBEndpoint<'getBlacklist'>;
	reportIp: AbuseIPDBEndpoint<'reportIp'>;
	checkBlock: AbuseIPDBEndpoint<'checkBlock'>;
	clearAddress: AbuseIPDBEndpoint<'clearAddress'>;
};

// ─────────────────────────────────────────────────────────────────────────────
// Endpoint Tree
// ─────────────────────────────────────────────────────────────────────────────

const abuseIPDBEndpointsNested = {
	check: {
		ip: CheckIp.check,
	},
	reports: {
		list: Reports.list,
	},
	blacklist: {
		get: Blacklist.get,
	},
	report: {
		ip: ReportIp.report,
	},
	block: {
		check: CheckBlock.check,
	},
	address: {
		clear: ClearAddress.clear,
	},
} as const;

// No webhooks — AbuseIPDB is a pull-based API (no event delivery)
const abuseIPDBWebhooksNested = {} as const;

// ─────────────────────────────────────────────────────────────────────────────
// Endpoint Schemas (for get_schema / agent introspection)
// ─────────────────────────────────────────────────────────────────────────────

export const abuseIPDBEndpointSchemas = {
	'check.ip': {
		input: AbuseIPDBEndpointInputSchemas.checkIp,
		output: AbuseIPDBEndpointOutputSchemas.checkIp,
	},
	'reports.list': {
		input: AbuseIPDBEndpointInputSchemas.getReports,
		output: AbuseIPDBEndpointOutputSchemas.getReports,
	},
	'blacklist.get': {
		input: AbuseIPDBEndpointInputSchemas.getBlacklist,
		output: AbuseIPDBEndpointOutputSchemas.getBlacklist,
	},
	'report.ip': {
		input: AbuseIPDBEndpointInputSchemas.reportIp,
		output: AbuseIPDBEndpointOutputSchemas.reportIp,
	},
	'block.check': {
		input: AbuseIPDBEndpointInputSchemas.checkBlock,
		output: AbuseIPDBEndpointOutputSchemas.checkBlock,
	},
	'address.clear': {
		input: AbuseIPDBEndpointInputSchemas.clearAddress,
		output: AbuseIPDBEndpointOutputSchemas.clearAddress,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof abuseIPDBEndpointsNested
>;

// ─────────────────────────────────────────────────────────────────────────────
// Endpoint Meta (risk levels for permission system)
// ─────────────────────────────────────────────────────────────────────────────

const abuseIPDBEndpointMeta = {
	'check.ip': {
		riskLevel: 'read',
		description:
			'Look up an IP address and get its abuse confidence score, country, ISP, usage type, and optionally recent reports',
	},
	'reports.list': {
		riskLevel: 'read',
		description:
			'Get a paginated list of abuse reports filed against a single IP address',
	},
	'blacklist.get': {
		riskLevel: 'read',
		description:
			'Download the blacklist of most-reported IPs, optionally filtered by confidence minimum, country, and IP version',
	},
	'report.ip': {
		riskLevel: 'write',
		description:
			'Submit an abuse report for an IP address with one or more abuse category IDs',
	},
	'block.check': {
		riskLevel: 'read',
		description:
			'Check a CIDR network block and list the reported addresses within it',
	},
	'address.clear': {
		riskLevel: 'destructive',
		description:
			'Remove all reports for an IP address from your account and return the number deleted',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof abuseIPDBEndpointsNested
>;

// ─────────────────────────────────────────────────────────────────────────────
// Auth Configuration
// ─────────────────────────────────────────────────────────────────────────────

const defaultAuthType = 'api_key' as const satisfies AuthTypes;

export const abuseIPDBAuthConfig = {
	api_key: {
		account: [] as const,
	},
} as const satisfies PluginAuthConfig;

// ─────────────────────────────────────────────────────────────────────────────
// Plugin Types
// ─────────────────────────────────────────────────────────────────────────────

export type BaseAbuseIPDBPlugin<T extends AbuseIPDBPluginOptions> =
	CorsairPlugin<
		'abuseipdb',
		typeof AbuseIPDBSchema,
		typeof abuseIPDBEndpointsNested,
		typeof abuseIPDBWebhooksNested,
		T,
		typeof defaultAuthType,
		typeof abuseIPDBAuthConfig
	>;

export type InternalAbuseIPDBPlugin =
	BaseAbuseIPDBPlugin<AbuseIPDBPluginOptions>;

export type ExternalAbuseIPDBPlugin<T extends AbuseIPDBPluginOptions> =
	BaseAbuseIPDBPlugin<T>;

// ─────────────────────────────────────────────────────────────────────────────
// Plugin Factory
// ─────────────────────────────────────────────────────────────────────────────

export function abuseipdb<const T extends AbuseIPDBPluginOptions>(
	incomingOptions: AbuseIPDBPluginOptions &
		// Safe: T extends AbuseIPDBPluginOptions, so an empty object is a valid
		// no-op default when no options are passed. TypeScript requires the cast
		// because it cannot verify T = {}.
		T = {} as AbuseIPDBPluginOptions & T,
): ExternalAbuseIPDBPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'abuseipdb',
		authConfig: abuseIPDBAuthConfig,
		schema: AbuseIPDBSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: undefined,
		endpoints: abuseIPDBEndpointsNested,
		webhooks: abuseIPDBWebhooksNested,
		endpointMeta: abuseIPDBEndpointMeta,
		endpointSchemas: abuseIPDBEndpointSchemas,
		// No webhooks — AbuseIPDB is a pull-based API
		pluginWebhookMatcher: undefined,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: AbuseIPDBKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint') {
				const res = await tryGetStoredKey(() => ctx.keys?.get_api_key());
				if (!res) {
					throw new AuthMissingError('abuseipdb', 'api_key');
				}
				return res;
			}

			return '';
		},
	} satisfies InternalAbuseIPDBPlugin;
}

// ─────────────────────────────────────────────────────────────────────────────
// Type Exports
// ─────────────────────────────────────────────────────────────────────────────

export type {
	AbuseIPDBEndpointInputs,
	AbuseIPDBEndpointOutputs,
	CheckBlockInput,
	CheckBlockResponse,
	CheckIpInput,
	CheckIpResponse,
	ClearAddressInput,
	ClearAddressResponse,
	GetBlacklistInput,
	GetBlacklistResponse,
	GetReportsInput,
	GetReportsResponse,
	ReportIpInput,
	ReportIpResponse,
} from './endpoints/types';

export {
	CheckBlockInputSchema,
	CheckBlockResponseSchema,
	CheckIpInputSchema,
	CheckIpResponseSchema,
	ClearAddressInputSchema,
	ClearAddressResponseSchema,
	GetBlacklistInputSchema,
	GetBlacklistResponseSchema,
	GetReportsInputSchema,
	GetReportsResponseSchema,
	ReportIpInputSchema,
	ReportIpResponseSchema,
} from './endpoints/types';
