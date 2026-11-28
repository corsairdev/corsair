import type {
	AuthTypes,
	BindEndpoints,
	BindWebhooks,
	CorsairErrorHandler,
	CorsairPlugin,
	KeyBuilderContext,
	PickAuth,
	PluginAuthConfig,
	PluginPermissionsConfig,
	RequiredPluginEndpointMeta,
	RequiredPluginEndpointSchemas,
	RequiredPluginWebhookSchemas,
} from 'corsair/core';
import type { VpndetectionContext } from './context';
import {
	Account,
	ApiKeys,
	Databases,
	Entitlement,
	Ip,
	Organization,
} from './endpoints';
import {
	VpndetectionEndpointInputSchemas,
	VpndetectionEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { VpndetectionSchema } from './schema';
import {
	isVpndetectionDelivery,
	vpndetectionWebhookSchemas,
	vpndetectionWebhooksNested,
} from './webhooks';

export type { VpndetectionContext };

export type VpndetectionPluginOptions = {
	authType?: PickAuth<'api_key'>;
	/** Optional. The API answers without a key; a key adds its plan's fields. */
	key?: string;
	/**
	 * The webhook destination's signing secret (`whsec_...`, console:
	 * Database > Delivery). Checks database.* deliveries; falls back to the
	 * stored webhook signature.
	 */
	webhookSecret?: string;
	hooks?: InternalVpndetectionPlugin['hooks'];
	webhookHooks?: InternalVpndetectionPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof vpndetectionEndpointsNested>;
};

export type VpndetectionKeyBuilderContext =
	KeyBuilderContext<VpndetectionPluginOptions>;

const vpndetectionEndpointsNested = {
	ip: Ip,
	databases: Databases,
	entitlement: Entitlement,
	account: Account,
	organization: Organization,
	apiKeys: ApiKeys,
} as const;

export type VpndetectionBoundEndpoints = BindEndpoints<
	typeof vpndetectionEndpointsNested
>;

export type VpndetectionBoundWebhooks = BindWebhooks<
	typeof vpndetectionWebhooksNested
>;

export const vpndetectionEndpointSchemas = {
	'ip.lookup': {
		input: VpndetectionEndpointInputSchemas.lookup,
		output: VpndetectionEndpointOutputSchemas.lookup,
	},
	'ip.batch': {
		input: VpndetectionEndpointInputSchemas.batch,
		output: VpndetectionEndpointOutputSchemas.batch,
	},
	'databases.list': {
		input: VpndetectionEndpointInputSchemas.databasesList,
		output: VpndetectionEndpointOutputSchemas.databasesList,
	},
	'databases.download': {
		input: VpndetectionEndpointInputSchemas.databasesDownload,
		output: VpndetectionEndpointOutputSchemas.databasesDownload,
	},
	'databases.metadata': {
		input: VpndetectionEndpointInputSchemas.databasesMetadata,
		output: VpndetectionEndpointOutputSchemas.databasesMetadata,
	},
	'databases.checksum': {
		input: VpndetectionEndpointInputSchemas.databasesChecksum,
		output: VpndetectionEndpointOutputSchemas.databasesChecksum,
	},
	'databases.downloads': {
		input: VpndetectionEndpointInputSchemas.databasesDownloads,
		output: VpndetectionEndpointOutputSchemas.databasesDownloads,
	},
	'entitlement.get': {
		input: VpndetectionEndpointInputSchemas.entitlementGet,
		output: VpndetectionEndpointOutputSchemas.entitlementGet,
	},
	'account.identity': {
		input: VpndetectionEndpointInputSchemas.accountIdentity,
		output: VpndetectionEndpointOutputSchemas.accountIdentity,
	},
	'organization.get': {
		input: VpndetectionEndpointInputSchemas.organizationGet,
		output: VpndetectionEndpointOutputSchemas.organizationGet,
	},
	'organization.listMembers': {
		input: VpndetectionEndpointInputSchemas.organizationListMembers,
		output: VpndetectionEndpointOutputSchemas.organizationListMembers,
	},
	'apiKeys.list': {
		input: VpndetectionEndpointInputSchemas.apiKeysList,
		output: VpndetectionEndpointOutputSchemas.apiKeysList,
	},
	'apiKeys.create': {
		input: VpndetectionEndpointInputSchemas.apiKeysCreate,
		output: VpndetectionEndpointOutputSchemas.apiKeysCreate,
	},
	'apiKeys.rotate': {
		input: VpndetectionEndpointInputSchemas.apiKeysRotate,
		output: VpndetectionEndpointOutputSchemas.apiKeysRotate,
	},
	'apiKeys.revoke': {
		input: VpndetectionEndpointInputSchemas.apiKeysRevoke,
		output: VpndetectionEndpointOutputSchemas.apiKeysRevoke,
	},
	'apiKeys.reveal': {
		input: VpndetectionEndpointInputSchemas.apiKeysReveal,
		output: VpndetectionEndpointOutputSchemas.apiKeysReveal,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof vpndetectionEndpointsNested
>;

const vpndetectionEndpointMeta = {
	'ip.lookup': {
		riskLevel: 'read',
		description:
			"Check whether an IP address is a VPN, a Tor node or a privacy relay, with its country and ASN; omit ip for the caller's own address.",
	},
	'ip.batch': {
		riskLevel: 'read',
		description:
			'Classify up to 1000 IP addresses in one call (a paid plan; a free key answers a batch of one); per-address failures come back in errors.',
	},
	'databases.list': {
		riskLevel: 'read',
		description:
			'List every database the organization can see with its license standing, versions and formats (needs a key with db.download).',
	},
	'databases.download': {
		riskLevel: 'read',
		description:
			'Get a time-limited download link for one database version and format, or one build by name; the file itself is not fetched.',
	},
	'databases.metadata': {
		riskLevel: 'read',
		description:
			"Read a database version's last update, entry count and column schema without downloading it.",
	},
	'databases.checksum': {
		riskLevel: 'read',
		description:
			'Read the MD5, SHA-1, SHA-256 and SHA-512 checksums of one published database file.',
	},
	'databases.downloads': {
		riskLevel: 'read',
		description:
			"List the organization's recent database download attempts, newest first, refusals included.",
	},
	'entitlement.get': {
		riskLevel: 'read',
		description:
			'Read the plan behind the key and the requests used against its quota in the current window.',
	},
	'account.identity': {
		riskLevel: 'read',
		description:
			'Read the identity behind the credential: user, organization and current scopes (needs an OAuth token with account.read).',
	},
	'organization.get': {
		riskLevel: 'read',
		description:
			"Read the credential's organization (needs an OAuth token with org.read).",
	},
	'organization.listMembers': {
		riskLevel: 'read',
		description:
			"List the organization's members (needs an OAuth token with org.read).",
	},
	'apiKeys.list': {
		riskLevel: 'read',
		description:
			"List the organization's API keys without their secrets (needs an OAuth token with apikeys.read).",
	},
	'apiKeys.create': {
		riskLevel: 'write',
		description:
			'Create an API key and return its secret once (needs an OAuth token with apikeys.manage).',
	},
	'apiKeys.rotate': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Replace the secret behind an API key; the old secret stops working at once (needs apikeys.manage and apikeys.reveal).',
	},
	'apiKeys.revoke': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Revoke an API key so it stops working; it stays listed with revoked_at (needs apikeys.manage).',
	},
	'apiKeys.reveal': {
		riskLevel: 'destructive',
		description:
			"Read back an existing API key's secret (needs an OAuth token with apikeys.reveal).",
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof vpndetectionEndpointsNested
>;

const vpndetectionWebhookSchemasChecked =
	vpndetectionWebhookSchemas satisfies RequiredPluginWebhookSchemas<
		typeof vpndetectionWebhooksNested
	>;

const defaultAuthType = 'api_key' as const satisfies AuthTypes;

export const vpndetectionAuthConfig = {
	api_key: {},
} as const satisfies PluginAuthConfig;

export type BaseVpndetectionPlugin<T extends VpndetectionPluginOptions> =
	CorsairPlugin<
		'vpndetection',
		typeof VpndetectionSchema,
		typeof vpndetectionEndpointsNested,
		typeof vpndetectionWebhooksNested,
		T,
		typeof defaultAuthType
	>;

export type InternalVpndetectionPlugin =
	BaseVpndetectionPlugin<VpndetectionPluginOptions>;

export type ExternalVpndetectionPlugin<T extends VpndetectionPluginOptions> =
	BaseVpndetectionPlugin<T>;

export function vpndetection<const T extends VpndetectionPluginOptions>(
	incomingOptions: VpndetectionPluginOptions &
		T = {} as VpndetectionPluginOptions & T,
): ExternalVpndetectionPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};

	return {
		id: 'vpndetection',
		authConfig: vpndetectionAuthConfig,
		schema: VpndetectionSchema,
		options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: vpndetectionEndpointsNested,
		webhooks: vpndetectionWebhooksNested,
		endpointMeta: vpndetectionEndpointMeta,
		endpointSchemas: vpndetectionEndpointSchemas,
		webhookSchemas: vpndetectionWebhookSchemasChecked,
		pluginWebhookMatcher: isVpndetectionDelivery,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		// The key is optional: with none stored, the lookup goes out keyless.
		keyBuilder: async (ctx: VpndetectionKeyBuilderContext, source) => {
			if (source === 'webhook') {
				if (options.webhookSecret) return options.webhookSecret;
				try {
					return (await ctx.keys.get_webhook_signature()) ?? '';
				} catch {
					return '';
				}
			}

			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const key = await ctx.keys.get_api_key();
				return key ?? '';
			}

			return '';
		},
	} satisfies InternalVpndetectionPlugin;
}

export type {
	VpndetectionWebhookId,
	VpndetectionWebhookPayloads,
} from './webhooks';
export {
	isVpndetectionDelivery,
	verifyVpndetectionWebhook,
} from './webhooks';
