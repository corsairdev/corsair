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
import { Chats, Devices, Files, Pushes, Users } from './endpoints';
import type {
	PushbulletEndpointInputs,
	PushbulletEndpointOutputs,
} from './endpoints/types';
import {
	PushbulletEndpointInputSchemas,
	PushbulletEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { PushbulletSchema } from './schema';

export type PushbulletPluginOptions = {
	/**
	 * Authentication method: an access token copied from Account Settings
	 * (`api_key`) or one minted by a registered Pushbullet OAuth2 client
	 * (`oauth_2`).
	 */
	authType?: PickAuth<'api_key' | 'oauth_2'>;
	/**
	 * Pushbullet access token from Account Settings. Account-level, and sent in
	 * the `Access-Token` header rather than as a bearer token.
	 */
	key?: string;
	hooks?: InternalPushbulletPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof pushbulletEndpointsNested>;
};

export type PushbulletContext = CorsairPluginContext<
	typeof PushbulletSchema,
	PushbulletPluginOptions,
	undefined,
	typeof pushbulletAuthConfig
>;

export type PushbulletKeyBuilderContext = KeyBuilderContext<
	PushbulletPluginOptions,
	typeof pushbulletAuthConfig
>;

export type PushbulletBoundEndpoints = BindEndpoints<
	typeof pushbulletEndpointsNested
>;

type PushbulletEndpoint<K extends keyof PushbulletEndpointOutputs> =
	CorsairEndpoint<
		PushbulletContext,
		PushbulletEndpointInputs[K],
		PushbulletEndpointOutputs[K]
	>;

export type PushbulletEndpoints = {
	[K in keyof PushbulletEndpointOutputs]: PushbulletEndpoint<K>;
};

const pushbulletEndpointsNested = {
	pushes: Pushes,
	devices: Devices,
	chats: Chats,
	users: Users,
	files: Files,
} as const;

// No webhooks — Pushbullet pushes events over a realtime websocket stream
// rather than HTTP callbacks, which the plugin webhook model does not cover.
const pushbulletWebhooksNested = {} as const;

export const pushbulletEndpointSchemas = {
	'pushes.create': {
		input: PushbulletEndpointInputSchemas.pushesCreate,
		output: PushbulletEndpointOutputSchemas.pushesCreate,
	},
	'pushes.list': {
		input: PushbulletEndpointInputSchemas.pushesList,
		output: PushbulletEndpointOutputSchemas.pushesList,
	},
	'pushes.update': {
		input: PushbulletEndpointInputSchemas.pushesUpdate,
		output: PushbulletEndpointOutputSchemas.pushesUpdate,
	},
	'pushes.delete': {
		input: PushbulletEndpointInputSchemas.pushesDelete,
		output: PushbulletEndpointOutputSchemas.pushesDelete,
	},
	'pushes.deleteAll': {
		input: PushbulletEndpointInputSchemas.pushesDeleteAll,
		output: PushbulletEndpointOutputSchemas.pushesDeleteAll,
	},
	'devices.register': {
		input: PushbulletEndpointInputSchemas.devicesRegister,
		output: PushbulletEndpointOutputSchemas.devicesRegister,
	},
	'devices.list': {
		input: PushbulletEndpointInputSchemas.devicesList,
		output: PushbulletEndpointOutputSchemas.devicesList,
	},
	'devices.update': {
		input: PushbulletEndpointInputSchemas.devicesUpdate,
		output: PushbulletEndpointOutputSchemas.devicesUpdate,
	},
	'devices.delete': {
		input: PushbulletEndpointInputSchemas.devicesDelete,
		output: PushbulletEndpointOutputSchemas.devicesDelete,
	},
	'chats.create': {
		input: PushbulletEndpointInputSchemas.chatsCreate,
		output: PushbulletEndpointOutputSchemas.chatsCreate,
	},
	'chats.list': {
		input: PushbulletEndpointInputSchemas.chatsList,
		output: PushbulletEndpointOutputSchemas.chatsList,
	},
	'chats.setMuted': {
		input: PushbulletEndpointInputSchemas.chatsSetMuted,
		output: PushbulletEndpointOutputSchemas.chatsSetMuted,
	},
	'chats.delete': {
		input: PushbulletEndpointInputSchemas.chatsDelete,
		output: PushbulletEndpointOutputSchemas.chatsDelete,
	},
	'users.me': {
		input: PushbulletEndpointInputSchemas.usersMe,
		output: PushbulletEndpointOutputSchemas.usersMe,
	},
	'files.uploadRequest': {
		input: PushbulletEndpointInputSchemas.filesUploadRequest,
		output: PushbulletEndpointOutputSchemas.filesUploadRequest,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof pushbulletEndpointsNested
>;

const pushbulletEndpointMeta = {
	'pushes.create': {
		riskLevel: 'write',
		description:
			'Send a note, link or file push to a device, person or channel',
	},
	'pushes.list': {
		riskLevel: 'read',
		description: 'List pushes on the account, optionally modified after a time',
	},
	'pushes.update': {
		riskLevel: 'write',
		description: 'Mark a push dismissed or undismissed',
	},
	'pushes.delete': {
		riskLevel: 'destructive',
		description: 'Delete a single push',
	},
	'pushes.deleteAll': {
		riskLevel: 'destructive',
		description: 'Delete every push on the account',
	},
	'devices.register': {
		riskLevel: 'write',
		description: 'Register a new device on the account',
	},
	'devices.list': {
		riskLevel: 'read',
		description: 'List devices registered to the account',
	},
	'devices.update': {
		riskLevel: 'write',
		description: 'Update a device nickname, model or push token',
	},
	'devices.delete': {
		riskLevel: 'destructive',
		description: 'Delete a device from the account',
	},
	'chats.create': {
		riskLevel: 'write',
		description: 'Start a chat with another Pushbullet user by email',
	},
	'chats.list': {
		riskLevel: 'read',
		description: 'List the chats on the account',
	},
	'chats.setMuted': {
		riskLevel: 'write',
		description: 'Mute or unmute a chat',
	},
	'chats.delete': {
		riskLevel: 'destructive',
		description: 'Delete a chat',
	},
	'users.me': {
		riskLevel: 'read',
		description: 'Retrieve the account the access token belongs to',
	},
	'files.uploadRequest': {
		riskLevel: 'write',
		description:
			'Reserve an upload slot, returning the upload URL and the file URL to use in a file push',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof pushbulletEndpointsNested
>;

const defaultAuthType = 'api_key' as const satisfies AuthTypes;

export const pushbulletAuthConfig = {
	api_key: {
		account: [] as const,
	},
	// No extension fields: the base oauth_2 manager already stores the access
	// token, and Pushbullet issues no refresh tokens or scopes.
	oauth_2: {
		account: [] as const,
	},
} as const satisfies PluginAuthConfig;

export type BasePushbulletPlugin<T extends PushbulletPluginOptions> =
	CorsairPlugin<
		'pushbullet',
		typeof PushbulletSchema,
		typeof pushbulletEndpointsNested,
		typeof pushbulletWebhooksNested,
		T,
		typeof defaultAuthType,
		typeof pushbulletAuthConfig
	>;

export type InternalPushbulletPlugin =
	BasePushbulletPlugin<PushbulletPluginOptions>;

export type ExternalPushbulletPlugin<T extends PushbulletPluginOptions> =
	BasePushbulletPlugin<T>;

export function pushbullet<const T extends PushbulletPluginOptions>(
	// Safe: T extends PushbulletPluginOptions, so an empty object is a valid
	// no-op default. TypeScript cannot verify T = {} on its own.
	incomingOptions: PushbulletPluginOptions & T = {} as PushbulletPluginOptions &
		T,
): ExternalPushbulletPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};

	return {
		id: 'pushbullet',
		authConfig: pushbulletAuthConfig,
		// https://docs.pushbullet.com/#oauth — server-side
		// `response_type=code` flow. Pushbullet has no scopes, and OAuth
		// clients are registered with a fixed redirect_uri, so the caller must
		// supply that pre-registered URL instead of an auto-generated
		// localhost callback.
		oauthConfig: {
			providerName: 'Pushbullet',
			authUrl: 'https://www.pushbullet.com/authorize',
			tokenUrl: 'https://api.pushbullet.com/oauth2/token',
			scopes: [],
			requiresRegisteredRedirect: true,
		},
		schema: PushbulletSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: undefined,
		endpoints: pushbulletEndpointsNested,
		webhooks: pushbulletWebhooksNested,
		endpointMeta: pushbulletEndpointMeta,
		endpointSchemas: pushbulletEndpointSchemas,
		// No webhooks — nothing to match against.
		pluginWebhookMatcher: undefined,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: PushbulletKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint') {
				// Pushbullet's OAuth access tokens carry no expiry and the
				// provider has no refresh flow (docs: "The access_token does
				// not have a set expiration time"), so the stored token is
				// returned as-is — a revoked one can only be fixed by
				// reconnecting, never by refreshing.
				if (ctx.authType === 'oauth_2') {
					const token = await tryGetStoredKey(() =>
						ctx.keys?.get_access_token(),
					);
					if (!token) {
						throw new AuthMissingError('pushbullet', 'oauth_2');
					}
					return token;
				}

				const stored = await tryGetStoredKey(() => ctx.keys?.get_api_key());
				if (!stored) {
					throw new AuthMissingError('pushbullet', 'api_key');
				}
				return stored;
			}

			return '';
		},
	} satisfies InternalPushbulletPlugin;
}

export { PUSHBULLET_API_BASE, PushbulletAPIError } from './client';
export { Chats, Devices, Files, Pushes, Users } from './endpoints';
export type {
	PushbulletChat,
	PushbulletDevice,
	PushbulletEndpointInputs,
	PushbulletEndpointOutputs,
	PushbulletPush,
	PushbulletUser,
} from './endpoints/types';
export { PushbulletSchema } from './schema';
