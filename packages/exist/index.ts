import type {
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
import { AuthMissingError, getOAuthAccessToken } from 'corsair/core';
import { resolveManagedAccessToken } from 'corsair/hub';
import { EXIST_OAUTH_AUTHORIZE_URL, EXIST_OAUTH_TOKEN_URL } from './client';
import {
	Attributes,
	Averages,
	Correlations,
	Insights,
	Oauth,
	Users,
} from './endpoints';
import type {
	ExistEndpointInputs,
	ExistEndpointOutputs,
} from './endpoints/types';
import {
	ExistEndpointInputSchemas,
	ExistEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { resolveExistOAuthTenantLink } from './oauth-tenant-link';
import { ExistSchema } from './schema';

/**
 * Exist read scopes, one per attribute group.
 * @see https://developer.exist.io/reference/authentication/oauth2/
 */
export const EXIST_READ_SCOPES = [
	'activity_read',
	'productivity_read',
	'mood_read',
	'sleep_read',
	'workouts_read',
	'events_read',
	'finance_read',
	'food_read',
	'health_read',
	'location_read',
	'media_read',
	'social_read',
	'weather_read',
	'symptoms_read',
	'medication_read',
	'custom_read',
	'manual_read',
] as const;

/**
 * Exist write scopes, required to acquire, release or increment attributes in
 * the matching group.
 * @see https://developer.exist.io/reference/authentication/oauth2/
 */
export const EXIST_WRITE_SCOPES = [
	'activity_write',
	'productivity_write',
	'mood_write',
	'sleep_write',
	'workouts_write',
	'events_write',
	'finance_write',
	'food_write',
	'health_write',
	'location_write',
	'media_write',
	'social_write',
	'weather_write',
	'symptoms_write',
	'medication_write',
	'custom_write',
	'manual_write',
] as const;

export type ExistScope =
	| (typeof EXIST_READ_SCOPES)[number]
	| (typeof EXIST_WRITE_SCOPES)[number];

/**
 * Default scopes cover every operation this plugin exposes. Exist's own
 * guidance is to request only the scopes an integration needs, so narrow this
 * with the `scopes` option when the agent only reads, or only touches some
 * attribute groups.
 * @see https://developer.exist.io/guide/best_practices/
 */
export const EXIST_DEFAULT_SCOPES: ExistScope[] = [
	...EXIST_READ_SCOPES,
	...EXIST_WRITE_SCOPES,
];

export const existAuthConfig = {
	oauth_2: {
		account: ['tenant_external_id'] as const,
	},
	managed: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type ExistPluginOptions = {
	authType?: PickAuth<'oauth_2' | 'managed'>;
	/**
	 * OAuth2 scopes to request. Defaults to every read and write scope; narrow
	 * it to the groups the integration actually uses.
	 */
	scopes?: ExistScope[];
	/** A pre-obtained access token, bypassing Corsair's stored credentials. */
	key?: string;
	hooks?: InternalExistPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	/**
	 * Permission configuration for the Exist plugin.
	 * Controls what the AI agent is allowed to do.
	 * Overrides use dot-notation paths from the Exist endpoint tree — invalid paths are type errors.
	 */
	permissions?: PluginPermissionsConfig<typeof existEndpointsNested>;
};

export type ExistContext = CorsairPluginContext<
	typeof ExistSchema,
	ExistPluginOptions,
	undefined,
	typeof existAuthConfig
>;

export type ExistKeyBuilderContext = KeyBuilderContext<
	ExistPluginOptions,
	typeof existAuthConfig
>;

type ExistEndpoint<K extends keyof ExistEndpointOutputs> = CorsairEndpoint<
	ExistContext,
	ExistEndpointInputs[K],
	ExistEndpointOutputs[K]
>;

export type ExistEndpoints = {
	[K in keyof ExistEndpointOutputs]: ExistEndpoint<K>;
};

const existEndpointsNested = {
	users: {
		getProfile: Users.getProfile,
	},
	attributes: {
		list: Attributes.list,
		listTemplates: Attributes.listTemplates,
		listWithValues: Attributes.listWithValues,
		listOwned: Attributes.listOwned,
		acquire: Attributes.acquire,
		release: Attributes.release,
		increment: Attributes.increment,
		update: Attributes.update,
	},
	averages: {
		list: Averages.list,
	},
	correlations: {
		list: Correlations.list,
	},
	insights: {
		list: Insights.list,
	},
	oauth: {
		authorize: Oauth.authorize,
	},
} as const;

export type ExistBoundEndpoints = BindEndpoints<typeof existEndpointsNested>;

/** Exist has no webhook or callback mechanism, so the plugin exposes no triggers. */
const existWebhooksNested = {} as const;

const schema = <K extends keyof typeof ExistEndpointInputSchemas>(key: K) => ({
	input: ExistEndpointInputSchemas[key],
	output: ExistEndpointOutputSchemas[key],
});

export const existEndpointSchemas = {
	'users.getProfile': schema('usersGetProfile'),
	'attributes.list': schema('attributesList'),
	'attributes.listTemplates': schema('attributesListTemplates'),
	'attributes.listWithValues': schema('attributesListWithValues'),
	'attributes.listOwned': schema('attributesListOwned'),
	'attributes.acquire': schema('attributesAcquire'),
	'attributes.release': schema('attributesRelease'),
	'attributes.increment': schema('attributesIncrement'),
	'attributes.update': schema('attributesUpdate'),
	'averages.list': schema('averagesList'),
	'correlations.list': schema('correlationsList'),
	'insights.list': schema('insightsList'),
	'oauth.authorize': schema('oauthAuthorize'),
} as const satisfies RequiredPluginEndpointSchemas<typeof existEndpointsNested>;

const defaultAuthType = 'oauth_2' as const;

const existEndpointMeta = {
	'users.getProfile': {
		riskLevel: 'read',
		description:
			'Get the authenticated Exist user profile and unit preferences',
	},
	'attributes.list': {
		riskLevel: 'read',
		description: "List the user's attributes without their values",
	},
	'attributes.listTemplates': {
		riskLevel: 'read',
		description: 'List the attribute templates Exist supports',
	},
	'attributes.listWithValues': {
		riskLevel: 'read',
		description: "List the user's attributes along with recent day values",
	},
	'attributes.listOwned': {
		riskLevel: 'read',
		description: 'List the attributes currently owned by this client',
	},
	'attributes.acquire': {
		riskLevel: 'write',
		description:
			'Take ownership of attributes so this client can write their values, creating templated attributes the user does not have yet',
	},
	'attributes.release': {
		riskLevel: 'write',
		description:
			'Release ownership of attributes, passing them to another service or making them inactive',
	},
	'attributes.increment': {
		riskLevel: 'write',
		description: "Add a delta to owned attributes' values for a given day",
	},
	'attributes.update': {
		riskLevel: 'write',
		description:
			"Overwrite owned attributes' total values for a given day, in batches of up to 35",
	},
	'averages.list': {
		riskLevel: 'read',
		description: 'List weekly average values per attribute',
	},
	'correlations.list': {
		riskLevel: 'read',
		description:
			"List correlations Exist computed between the user's attributes",
	},
	'insights.list': {
		riskLevel: 'read',
		description: "List insights Exist generated about the user's data",
	},
	'oauth.authorize': {
		riskLevel: 'read',
		description:
			'Build the Exist OAuth2 authorisation URL a user visits to grant access, with a CSRF state value; makes no API call',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof existEndpointsNested>;

export type BaseExistPlugin<T extends ExistPluginOptions> = CorsairPlugin<
	'exist',
	typeof ExistSchema,
	typeof existEndpointsNested,
	typeof existWebhooksNested,
	T,
	typeof defaultAuthType,
	typeof existAuthConfig
>;

export type InternalExistPlugin = BaseExistPlugin<ExistPluginOptions>;

export type ExternalExistPlugin<T extends ExistPluginOptions> =
	BaseExistPlugin<T>;

export function exist<const T extends ExistPluginOptions>(
	incomingOptions: ExistPluginOptions & T = {} as ExistPluginOptions & T,
): ExternalExistPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};

	return {
		id: 'exist',
		authConfig: existAuthConfig,
		schema: ExistSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: undefined,
		oauthConfig: {
			providerName: 'Exist',
			authUrl: EXIST_OAUTH_AUTHORIZE_URL,
			tokenUrl: EXIST_OAUTH_TOKEN_URL,
			scopes: options.scopes ?? EXIST_DEFAULT_SCOPES,
			// Exist requires the redirect URI to be registered with the client and
			// to be HTTPS, so a generated localhost callback will not work.
			requiresRegisteredRedirect: true,
			tokenAuthMethod: 'body',
		},
		endpoints: existEndpointsNested,
		webhooks: existWebhooksNested,
		endpointMeta: existEndpointMeta,
		endpointSchemas: existEndpointSchemas,
		webhookSchemas: undefined,
		pluginWebhookMatcher: undefined,
		oauthWebhookTenantLinkResolver: resolveExistOAuthTenantLink,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: ExistKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (ctx.authType === 'oauth_2') {
				return getOAuthAccessToken(ctx, {
					plugin: 'exist',
					tokenUrl: EXIST_OAUTH_TOKEN_URL,
					tokenAuthMethod: 'body',
				});
			}

			if (ctx.authType === 'managed') {
				return resolveManagedAccessToken(ctx, 'exist');
			}

			throw new AuthMissingError('exist', 'oauth_2');
		},
	} satisfies InternalExistPlugin;
}

export {
	EXIST_API_BASE,
	EXIST_MAX_BATCH_SIZE,
	EXIST_OAUTH_AUTHORIZE_URL,
	EXIST_OAUTH_TOKEN_URL,
	EXIST_RATE_LIMIT_PER_HOUR,
	ExistAPIError,
} from './client';
export type {
	AttributesAcquireInput,
	AttributesAcquireResponse,
	AttributesIncrementInput,
	AttributesIncrementResponse,
	AttributesListInput,
	AttributesListOwnedInput,
	AttributesListOwnedResponse,
	AttributesListResponse,
	AttributesListTemplatesInput,
	AttributesListTemplatesResponse,
	AttributesListWithValuesInput,
	AttributesListWithValuesResponse,
	AttributesReleaseInput,
	AttributesReleaseResponse,
	AttributesUpdateInput,
	AttributesUpdateResponse,
	AveragesListInput,
	AveragesListResponse,
	CorrelationsListInput,
	CorrelationsListResponse,
	ExistEndpointInputs,
	ExistEndpointOutputs,
	InsightsListInput,
	InsightsListResponse,
	OauthAuthorizeInput,
	OauthAuthorizeResponse,
	UsersGetProfileInput,
	UsersGetProfileResponse,
} from './endpoints/types';
export { resolveExistOAuthTenantLink } from './oauth-tenant-link';
export { ExistSchema } from './schema';
