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
	PluginPermissionsConfig,
} from 'corsair/core';
import { AuthMissingError } from 'corsair/core';
import { getValidBitwardenAccessToken } from './client';
import { Collections, Members, Organizations } from './endpoints';
import type {
	BitwardenEndpointInputs,
	BitwardenEndpointOutputs,
} from './endpoints/types';
import {
	BitwardenEndpointInputSchemas,
	BitwardenEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { BitwardenSchema } from './schema';
import type { BitwardenWebhookOutputs } from './webhooks/types';

export type BitwardenPluginOptions = {
	authType?: PickAuth<'oauth_2'>;
	/** Identity API base URL. Defaults to https://identity.bitwarden.com */
	identityBaseUrl?: string;
	/** Pre-resolved Bitwarden bearer token override. */
	key?: string;
	webhookSecret?: string;
	hooks?: InternalBitwardenPlugin['hooks'];
	webhookHooks?: InternalBitwardenPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof bitwardenEndpointsNested>;
};

export type BitwardenContext = CorsairPluginContext<
	typeof BitwardenSchema,
	BitwardenPluginOptions
>;

export type BitwardenKeyBuilderContext =
	KeyBuilderContext<BitwardenPluginOptions>;

export type BitwardenBoundEndpoints = BindEndpoints<
	typeof bitwardenEndpointsNested
>;

type BitwardenEndpoint<
	K extends keyof BitwardenEndpointOutputs,
	Input,
> = CorsairEndpoint<BitwardenContext, Input, BitwardenEndpointOutputs[K]>;

export type BitwardenEndpoints = {
	organizationsList: BitwardenEndpoint<
		'organizationsList',
		BitwardenEndpointInputs['organizationsList']
	>;
	organizationsGet: BitwardenEndpoint<
		'organizationsGet',
		BitwardenEndpointInputs['organizationsGet']
	>;
	collectionsList: BitwardenEndpoint<
		'collectionsList',
		BitwardenEndpointInputs['collectionsList']
	>;
	collectionsGet: BitwardenEndpoint<
		'collectionsGet',
		BitwardenEndpointInputs['collectionsGet']
	>;
	membersList: BitwardenEndpoint<
		'membersList',
		BitwardenEndpointInputs['membersList']
	>;
	membersGet: BitwardenEndpoint<
		'membersGet',
		BitwardenEndpointInputs['membersGet']
	>;
};

type BitwardenWebhook<
	K extends keyof BitwardenWebhookOutputs,
	TEvent,
> = CorsairWebhook<BitwardenContext, TEvent, BitwardenWebhookOutputs[K]>;

export type BitwardenWebhooks = Record<string, never>;

export type BitwardenBoundWebhooks = BindWebhooks<BitwardenWebhooks>;

const bitwardenEndpointsNested = {
	organizations: {
		list: Organizations.list,
		get: Organizations.get,
	},
	collections: {
		list: Collections.list,
		get: Collections.get,
	},
	members: {
		list: Members.list,
		get: Members.get,
	},
} as const;

const bitwardenWebhooksNested = {} as const;

export const bitwardenEndpointSchemas = {
	'organizations.list': {
		input: BitwardenEndpointInputSchemas.organizationsList,
		output: BitwardenEndpointOutputSchemas.organizationsList,
	},
	'organizations.get': {
		input: BitwardenEndpointInputSchemas.organizationsGet,
		output: BitwardenEndpointOutputSchemas.organizationsGet,
	},
	'collections.list': {
		input: BitwardenEndpointInputSchemas.collectionsList,
		output: BitwardenEndpointOutputSchemas.collectionsList,
	},
	'collections.get': {
		input: BitwardenEndpointInputSchemas.collectionsGet,
		output: BitwardenEndpointOutputSchemas.collectionsGet,
	},
	'members.list': {
		input: BitwardenEndpointInputSchemas.membersList,
		output: BitwardenEndpointOutputSchemas.membersList,
	},
	'members.get': {
		input: BitwardenEndpointInputSchemas.membersGet,
		output: BitwardenEndpointOutputSchemas.membersGet,
	},
} as const;

const defaultAuthType = 'oauth_2' as const;

const bitwardenEndpointMeta = {
	'organizations.list': {
		riskLevel: 'read',
		description: 'List all organizations the authenticated account can access',
	},
	'organizations.get': {
		riskLevel: 'read',
		description: 'Get details for a specific organization',
	},
	'collections.list': {
		riskLevel: 'read',
		description: 'List all collections in an organization',
	},
	'collections.get': {
		riskLevel: 'read',
		description: 'Get details for a specific collection',
	},
	'members.list': {
		riskLevel: 'read',
		description: 'List all members in an organization',
	},
	'members.get': {
		riskLevel: 'read',
		description: 'Get details for a specific organization member',
	},
} as const;

export type BaseBitwardenPlugin<T extends BitwardenPluginOptions> =
	CorsairPlugin<
		'bitwarden',
		typeof BitwardenSchema,
		typeof bitwardenEndpointsNested,
		typeof bitwardenWebhooksNested,
		T,
		typeof defaultAuthType
	>;

export type InternalBitwardenPlugin =
	BaseBitwardenPlugin<BitwardenPluginOptions>;

export type ExternalBitwardenPlugin<T extends BitwardenPluginOptions> =
	BaseBitwardenPlugin<T>;

export function bitwarden<const T extends BitwardenPluginOptions>(
	incomingOptions: BitwardenPluginOptions & T = {} as BitwardenPluginOptions &
		T,
): ExternalBitwardenPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'bitwarden',
		schema: BitwardenSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: bitwardenEndpointsNested,
		webhooks: bitwardenWebhooksNested,
		endpointMeta: bitwardenEndpointMeta,
		endpointSchemas: bitwardenEndpointSchemas,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: BitwardenKeyBuilderContext, source) => {
			const authType = ctx.authType;

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

			if (source === 'endpoint' && ctx.authType === 'oauth_2') {
				const [accessToken, expiresAt, credentials] = await Promise.all([
					ctx.keys.get_access_token(),
					ctx.keys.get_expires_at(),
					ctx.keys.get_integration_credentials(),
				]);

				if (!credentials.client_id || !credentials.client_secret) {
					throw new Error(
						'[auth-missing:bitwarden:client_credentials]: Bitwarden client credentials are missing',
					);
				}

				let result: Awaited<ReturnType<typeof getValidBitwardenAccessToken>>;
				try {
					result = await getValidBitwardenAccessToken({
						accessToken,
						expiresAt,
						clientId: credentials.client_id,
						clientSecret: credentials.client_secret,
						identityBaseUrl: options.identityBaseUrl,
					});
				} catch (error) {
					throw new Error(
						`[corsair:bitwarden] Failed to obtain valid access token: ${error instanceof Error ? error.message : String(error)}`,
					);
				}

				if (result.refreshed) {
					try {
						await Promise.all([
							ctx.keys.set_access_token(result.accessToken),
							ctx.keys.set_expires_at(String(result.expiresAt)),
						]);
					} catch (error) {
						console.warn(
							`[corsair:bitwarden] Token was refreshed but failed to persist new credentials: ${error instanceof Error ? error.message : String(error)}`,
						);
					}
				}

				return result.accessToken;
			}

			throw new AuthMissingError('bitwarden', 'oauth_2');
		},
	} satisfies InternalBitwardenPlugin;
}

export type {
	BitwardenEndpointInputs,
	BitwardenEndpointOutputs,
} from './endpoints/types';
