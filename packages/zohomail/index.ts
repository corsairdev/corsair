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
	RawWebhookRequest,
	RequiredPluginEndpointMeta,
} from 'corsair/core';
import type { ZohoRegion } from './client';
import {
	getValidAccessToken,
	zohoOAuthAuthUrl,
	zohoOAuthTokenUrl,
} from './client';
import { FoldersEndpoints, MessagesEndpoints } from './endpoints';
import type {
	ZohoMailEndpointInputs,
	ZohoMailEndpointOutputs,
} from './endpoints/types';
import {
	ZohoMailEndpointInputSchemas,
	ZohoMailEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import type { ZohoMailCredentials } from './schema';
import { ZohoMailSchema } from './schema';
import { ChallengeWebhooks, MessageWebhooks } from './webhooks';
import { matchZohoMailTenantWebhook } from './webhooks/tenant-matcher';
import type {
	ZohoMailChallengePayload,
	ZohoMailWebhookEvent,
	ZohoMailWebhookOutputs,
} from './webhooks/types';
import {
	getZohoWebhookSecretFromRequest,
	getZohoWebhookSignature,
	ZohoMailChallengePayloadSchema,
	ZohoMailChallengeResponseSchema,
	ZohoMailWebhookEventSchema,
} from './webhooks/types';

/** Zoho Mail uses standard OAuth2; no plugin-specific integration fields. */
export const zohoMailAuthConfig = {} as const satisfies PluginAuthConfig;

export type ZohoMailContext = CorsairPluginContext<
	typeof ZohoMailSchema,
	ZohoMailPluginOptions,
	undefined,
	typeof zohoMailAuthConfig
>;

type ZohoMailEndpoint<K extends keyof ZohoMailEndpointOutputs> =
	CorsairEndpoint<
		ZohoMailContext,
		ZohoMailEndpointInputs[K],
		ZohoMailEndpointOutputs[K]
	>;

export type ZohoMailEndpoints = {
	messagesList: ZohoMailEndpoint<'messagesList'>;
	messagesGet: ZohoMailEndpoint<'messagesGet'>;
	messagesSend: ZohoMailEndpoint<'messagesSend'>;
	messagesDelete: ZohoMailEndpoint<'messagesDelete'>;
	messagesMove: ZohoMailEndpoint<'messagesMove'>;
	messagesMarkRead: ZohoMailEndpoint<'messagesMarkRead'>;
	messagesMarkUnread: ZohoMailEndpoint<'messagesMarkUnread'>;
	foldersList: ZohoMailEndpoint<'foldersList'>;
	foldersGet: ZohoMailEndpoint<'foldersGet'>;
	foldersCreate: ZohoMailEndpoint<'foldersCreate'>;
	foldersUpdate: ZohoMailEndpoint<'foldersUpdate'>;
	foldersDelete: ZohoMailEndpoint<'foldersDelete'>;
};

export type ZohoMailBoundEndpoints = BindEndpoints<
	typeof zohoMailEndpointsNested
>;

type ZohoMailWebhook<
	K extends keyof ZohoMailWebhookOutputs,
	TEvent,
> = CorsairWebhook<ZohoMailContext, TEvent, ZohoMailWebhookOutputs[K]>;

export type ZohoMailWebhooks = {
	handshake: ZohoMailWebhook<'handshake', ZohoMailChallengePayload>;
	messageReceived: ZohoMailWebhook<'messageReceived', ZohoMailWebhookEvent>;
};

export type ZohoMailBoundWebhooks = BindWebhooks<typeof zohoMailWebhooksNested>;

export const zohoMailEndpointsNested = {
	messages: {
		list: MessagesEndpoints.list,
		get: MessagesEndpoints.get,
		send: MessagesEndpoints.send,
		delete: MessagesEndpoints.delete,
		move: MessagesEndpoints.move,
		markRead: MessagesEndpoints.markRead,
		markUnread: MessagesEndpoints.markUnread,
	},
	folders: {
		list: FoldersEndpoints.list,
		get: FoldersEndpoints.get,
		create: FoldersEndpoints.create,
		update: FoldersEndpoints.update,
		delete: FoldersEndpoints.delete,
	},
} as const;

export const zohoMailEndpointSchemas = {
	'messages.list': {
		input: ZohoMailEndpointInputSchemas.messagesList,
		output: ZohoMailEndpointOutputSchemas.messagesList,
	},
	'messages.get': {
		input: ZohoMailEndpointInputSchemas.messagesGet,
		output: ZohoMailEndpointOutputSchemas.messagesGet,
	},
	'messages.send': {
		input: ZohoMailEndpointInputSchemas.messagesSend,
		output: ZohoMailEndpointOutputSchemas.messagesSend,
	},
	'messages.delete': {
		input: ZohoMailEndpointInputSchemas.messagesDelete,
		output: ZohoMailEndpointOutputSchemas.messagesDelete,
	},
	'messages.move': {
		input: ZohoMailEndpointInputSchemas.messagesMove,
		output: ZohoMailEndpointOutputSchemas.messagesMove,
	},
	'messages.markRead': {
		input: ZohoMailEndpointInputSchemas.messagesMarkRead,
		output: ZohoMailEndpointOutputSchemas.messagesMarkRead,
	},
	'messages.markUnread': {
		input: ZohoMailEndpointInputSchemas.messagesMarkUnread,
		output: ZohoMailEndpointOutputSchemas.messagesMarkUnread,
	},
	'folders.list': {
		input: ZohoMailEndpointInputSchemas.foldersList,
		output: ZohoMailEndpointOutputSchemas.foldersList,
	},
	'folders.get': {
		input: ZohoMailEndpointInputSchemas.foldersGet,
		output: ZohoMailEndpointOutputSchemas.foldersGet,
	},
	'folders.create': {
		input: ZohoMailEndpointInputSchemas.foldersCreate,
		output: ZohoMailEndpointOutputSchemas.foldersCreate,
	},
	'folders.update': {
		input: ZohoMailEndpointInputSchemas.foldersUpdate,
		output: ZohoMailEndpointOutputSchemas.foldersUpdate,
	},
	'folders.delete': {
		input: ZohoMailEndpointInputSchemas.foldersDelete,
		output: ZohoMailEndpointOutputSchemas.foldersDelete,
	},
} as const;

export const zohoMailWebhooksNested = {
	challenge: {
		handshake: ChallengeWebhooks.handshake,
	},
	messages: {
		received: MessageWebhooks.messageReceived,
	},
} as const;

const zohoMailWebhookSchemas = {
	'challenge.handshake': {
		description: 'Zoho Mail initial webhook handshake via x-hook-secret header',
		payload: ZohoMailChallengePayloadSchema,
		response: ZohoMailChallengeResponseSchema,
	},
	'messages.received': {
		description: 'A new email was received in the mailbox',
		payload: ZohoMailWebhookEventSchema,
		response: ZohoMailWebhookEventSchema,
	},
} as const;

export type ZohoMailPluginOptions = {
	authType?: PickAuth<'oauth_2'>;
	/** Zoho datacenter region. Selects the accounts.zoho.* and mail.zoho.* hosts. Default 'us'. */
	region?: ZohoRegion;
	key?: string;
	credentials?: ZohoMailCredentials;
	/**
	 * Secret used to verify incoming webhook signatures (`x-hook-signature`).
	 * Zoho delivers this as `x-hook-secret` on the first webhook request; store it
	 * here or via the `webhook_signature` key.
	 */
	webhookSecret?: string;
	hooks?: InternalZohoMailPlugin['hooks'];
	webhookHooks?: InternalZohoMailPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	/**
	 * Permission configuration for the Zoho Mail plugin.
	 * Overrides use dot-notation paths from the endpoint tree — invalid paths are type errors.
	 */
	permissions?: PluginPermissionsConfig<typeof zohoMailEndpointsNested>;
};

export type ZohoMailKeyBuilderContext = KeyBuilderContext<
	ZohoMailPluginOptions,
	typeof zohoMailAuthConfig
>;

const defaultAuthType = 'oauth_2' as const;

/**
 * Risk-level metadata for each endpoint.
 * Used by the MCP server permission system to decide allow / deny / require_approval.
 */
const zohoMailEndpointMeta = {
	'messages.list': {
		riskLevel: 'read',
		description: 'List emails in a folder',
	},
	'messages.get': {
		riskLevel: 'read',
		description: 'Get a specific email with its content',
	},
	'messages.send': {
		riskLevel: 'write',
		description: 'Send an email to one or more recipients',
	},
	'messages.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Permanently delete an email [DESTRUCTIVE · IRREVERSIBLE]',
	},
	'messages.move': {
		riskLevel: 'write',
		description: 'Move emails to another folder',
	},
	'messages.markRead': {
		riskLevel: 'write',
		description: 'Mark emails as read',
	},
	'messages.markUnread': {
		riskLevel: 'write',
		description: 'Mark emails as unread',
	},
	'folders.list': {
		riskLevel: 'read',
		description: 'List all mail folders',
	},
	'folders.get': { riskLevel: 'read', description: 'Get a specific folder' },
	'folders.create': { riskLevel: 'write', description: 'Create a new folder' },
	'folders.update': {
		riskLevel: 'write',
		description: 'Rename, mark all emails read, or empty a folder',
	},
	'folders.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete a folder along with its emails and sub-folders [DESTRUCTIVE · IRREVERSIBLE]',
	},
} satisfies RequiredPluginEndpointMeta<typeof zohoMailEndpointsNested>;

export type BaseZohoMailPlugin<T extends ZohoMailPluginOptions> = CorsairPlugin<
	'zohomail',
	typeof ZohoMailSchema,
	typeof zohoMailEndpointsNested,
	typeof zohoMailWebhooksNested,
	T,
	typeof defaultAuthType,
	typeof zohoMailAuthConfig
>;

export type InternalZohoMailPlugin = BaseZohoMailPlugin<ZohoMailPluginOptions>;

export type ExternalZohoMailPlugin<T extends ZohoMailPluginOptions> =
	BaseZohoMailPlugin<T>;

export function zohomail<const T extends ZohoMailPluginOptions>(
	incomingOptions: ZohoMailPluginOptions & T = {} as ZohoMailPluginOptions & T,
): ExternalZohoMailPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	const region = options.region;

	return {
		id: 'zohomail',
		schema: ZohoMailSchema,
		options: options,
		authConfig: zohoMailAuthConfig,
		oauthConfig: {
			providerName: 'Zoho',
			authUrl: zohoOAuthAuthUrl(region),
			tokenUrl: zohoOAuthTokenUrl(region),
			scopes: [
				'ZohoMail.messages.ALL',
				'ZohoMail.folders.ALL',
				'ZohoMail.accounts.READ',
			],
			authParams: { access_type: 'offline', prompt: 'consent' },
			tokenAuthMethod: 'body',
		},
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: zohoMailEndpointsNested,
		webhooks: zohoMailWebhooksNested,
		endpointMeta: zohoMailEndpointMeta,
		endpointSchemas: zohoMailEndpointSchemas,
		webhookSchemas: zohoMailWebhookSchemas,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		pluginWebhookMatcher: (request: RawWebhookRequest) => {
			const headers = request.headers ?? {};
			return (
				getZohoWebhookSignature(headers) !== undefined ||
				getZohoWebhookSecretFromRequest(headers) !== undefined
			);
		},
		pluginTenantWebhookMatcher: matchZohoMailTenantWebhook,
		keyBuilder: async (ctx: ZohoMailKeyBuilderContext, source) => {
			const authType = ctx.authType;

			if (source === 'webhook' && options.webhookSecret) {
				return options.webhookSecret;
			}

			if (source === 'webhook') {
				const res = await ctx.keys.get_webhook_signature();
				return res ?? '';
			}

			if (options.key) {
				return options.key;
			}

			if (ctx.authType === 'oauth_2') {
				const creds = options.credentials;

				const [storedAccessToken, expiresAt, storedRefreshToken] =
					await Promise.all([
						ctx.keys.get_access_token(),
						ctx.keys.get_expires_at(),
						ctx.keys.get_refresh_token(),
					]);

				const accessToken = storedAccessToken ?? creds?.accessToken ?? null;
				const refreshToken = storedRefreshToken ?? creds?.refreshToken ?? null;

				if (!refreshToken) {
					throw new Error(
						'[auth-missing:zohomail:refresh_token]: Zoho Mail refresh token is missing',
					);
				}

				const integrationCreds = await ctx.keys.get_integration_credentials();
				const clientId =
					integrationCreds.client_id ?? creds?.clientId ?? undefined;
				const clientSecret =
					integrationCreds.client_secret ?? creds?.clientSecret ?? undefined;

				if (!clientId || !clientSecret) {
					throw new Error(
						'[auth-missing:zohomail:client_credentials]: Zoho Mail client credentials are missing',
					);
				}

				const tokenUrl = zohoOAuthTokenUrl(region);

				let result: Awaited<ReturnType<typeof getValidAccessToken>>;
				try {
					result = await getValidAccessToken({
						tokenUrl,
						accessToken,
						expiresAt,
						refreshToken,
						clientId,
						clientSecret,
					});
				} catch (error) {
					throw new Error(
						`[corsair:zohomail] Failed to obtain valid access token: ${error instanceof Error ? error.message : String(error)}`,
					);
				}

				if (result.refreshed) {
					try {
						await ctx.keys.set_access_token(result.accessToken);
						await ctx.keys.set_expires_at(String(result.expiresAt));
					} catch (error) {
						throw new Error(
							`[corsair:zohomail] Token was refreshed but failed to persist new credentials: ${error instanceof Error ? error.message : String(error)}`,
						);
					}
				}

				// Expose a force-refresh function so endpoints can retry on 401
				// without waiting for `expires_at` to lapse.
				(ctx as Record<string, unknown>)._refreshAuth = async () => {
					const freshResult = await getValidAccessToken({
						tokenUrl,
						accessToken: null,
						expiresAt: null,
						refreshToken,
						clientId,
						clientSecret,
						forceRefresh: true,
					});
					await ctx.keys.set_access_token(freshResult.accessToken);
					await ctx.keys.set_expires_at(String(freshResult.expiresAt));
					return freshResult.accessToken;
				};

				return result.accessToken;
			}

			throw new Error(
				`[auth-missing:zohomail:${authType}]: Zoho Mail key is missing`,
			);
		},
	} satisfies InternalZohoMailPlugin;
}

// ─────────────────────────────────────────────────────────────────────────────
// Type Exports
// ─────────────────────────────────────────────────────────────────────────────

export type { ZohoRegion } from './client';
export type {
	ZohoMailEndpointInputs,
	ZohoMailEndpointOutputs,
} from './endpoints/types';
export type { ZohoMailCredentials } from './schema';
export { ZohoMailSchema } from './schema';
export type * from './types';
export type {
	ZohoMailChallengePayload,
	ZohoMailEventName,
	ZohoMailWebhookEvent,
	ZohoMailWebhookOutputs,
} from './webhooks/types';
export {
	createZohoMailMatch,
	verifyZohoWebhookSignature,
} from './webhooks/types';
