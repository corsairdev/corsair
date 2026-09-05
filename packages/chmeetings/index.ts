import type {
	AuthTypes,
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
import { Person } from './endpoints';
import type {
	ChMeetingsEndpointInputs,
	ChMeetingsEndpointOutputs,
} from './endpoints/types';
import {
	ChMeetingsEndpointInputSchemas,
	ChMeetingsEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { ChMeetingsSchema } from './schema';
import { ExampleWebhooks } from './webhooks';
import { resolveChMeetingsOAuthWebhookTenantLink } from './webhooks/oauth-tenant-link';
import { matchChMeetingsTenantWebhook } from './webhooks/tenant-matcher';
import type { ChMeetingsWebhookOutputs, ExampleEvent } from './webhooks/types';
import { ExampleEventSchema } from './webhooks/types';

export type ChMeetingsPluginOptions = {
	authType?: PickAuth<'api_key' | 'oauth_2'>;
	key?: string;
	webhookSecret?: string;
	hooks?: InternalChMeetingsPlugin['hooks'];
	webhookHooks?: InternalChMeetingsPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof chMeetingsEndpointsNested>;
};

export type ChMeetingsContext = CorsairPluginContext<
	typeof ChMeetingsSchema,
	ChMeetingsPluginOptions
>;

export type ChMeetingsKeyBuilderContext =
	KeyBuilderContext<ChMeetingsPluginOptions>;

export type ChMeetingsBoundEndpoints = BindEndpoints<
	typeof chMeetingsEndpointsNested
>;

type ChMeetingsEndpoint<K extends keyof ChMeetingsEndpointOutputs> =
	CorsairEndpoint<
		ChMeetingsContext,
		ChMeetingsEndpointInputs[K],
		ChMeetingsEndpointOutputs[K]
	>;

export type ChMeetingsEndpoints = {
	personGet: ChMeetingsEndpoint<'personGet'>;
};

type ChMeetingsWebhook<
	K extends keyof ChMeetingsWebhookOutputs,
	TEvent,
> = CorsairWebhook<ChMeetingsContext, TEvent, ChMeetingsWebhookOutputs[K]>;

export type ChMeetingsWebhooks = {
	example: ChMeetingsWebhook<'example', ExampleEvent>;
};

export type ChMeetingsBoundWebhooks = BindWebhooks<ChMeetingsWebhooks>;

const chMeetingsEndpointsNested = {
	person: {
		get: Person.get,
	},
} as const;

const chMeetingsWebhooksNested = {
	example: {
		example: ExampleWebhooks.example,
	},
} as const;

export const chMeetingsEndpointSchemas = {
	'person.get': {
		input: ChMeetingsEndpointInputSchemas.personGet,
		output: ChMeetingsEndpointOutputSchemas.personGet,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof chMeetingsEndpointsNested
>;

const chMeetingsWebhookSchemas = {
	'example.example': {
		description: 'An example webhook event',
		payload: ExampleEventSchema,
		response: ExampleEventSchema,
	},
} as const satisfies RequiredPluginWebhookSchemas<
	typeof chMeetingsWebhooksNested
>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const chMeetingsEndpointMeta = {
	'person.get': {
		riskLevel: 'read',
		description: 'Get a ChMeetings person by ID',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof chMeetingsEndpointsNested
>;

export const chMeetingsAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
	oauth_2: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseChMeetingsPlugin<T extends ChMeetingsPluginOptions> =
	CorsairPlugin<
		'chmeetings',
		typeof ChMeetingsSchema,
		typeof chMeetingsEndpointsNested,
		typeof chMeetingsWebhooksNested,
		T,
		typeof defaultAuthType
	>;

export type InternalChMeetingsPlugin =
	BaseChMeetingsPlugin<ChMeetingsPluginOptions>;

export type ExternalChMeetingsPlugin<T extends ChMeetingsPluginOptions> =
	BaseChMeetingsPlugin<T>;

export function chmeetings<const T extends ChMeetingsPluginOptions>(
	incomingOptions: ChMeetingsPluginOptions & T = {} as ChMeetingsPluginOptions &
		T,
): ExternalChMeetingsPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'chmeetings',
		authConfig: chMeetingsAuthConfig,
		schema: ChMeetingsSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: chMeetingsEndpointsNested,
		webhooks: chMeetingsWebhooksNested,
		endpointMeta: chMeetingsEndpointMeta,
		endpointSchemas: chMeetingsEndpointSchemas,
		webhookSchemas: chMeetingsWebhookSchemas,
		pluginWebhookMatcher: (request) => {
			const headers = request.headers;
			// TODO: Update to match your webhook signature headers
			return 'x-chmeetings-signature' in headers;
		},
		pluginTenantWebhookMatcher: matchChMeetingsTenantWebhook,
		oauthWebhookTenantLinkResolver: resolveChMeetingsOAuthWebhookTenantLink,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: ChMeetingsKeyBuilderContext, source) => {
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
	} satisfies InternalChMeetingsPlugin;
}

export type {
	ChMeetingsEndpointInputs,
	ChMeetingsEndpointOutputs,
	Person,
	PersonGetInput,
	PersonGetResponse,
} from './endpoints/types';
export type {
	ChMeetingsWebhookOutputs,
	ExampleEvent,
} from './webhooks/types';
