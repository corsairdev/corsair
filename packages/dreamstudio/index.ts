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
import { User } from './endpoints';
import type {
	DreamStudioEndpointInputs,
	DreamStudioEndpointOutputs,
} from './endpoints/types';
import {
	DreamStudioEndpointInputSchemas,
	DreamStudioEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { DreamStudioSchema } from './schema';
import { ExampleWebhooks } from './webhooks';
import { resolveDreamStudioOAuthWebhookTenantLink } from './webhooks/oauth-tenant-link';
import { matchDreamStudioTenantWebhook } from './webhooks/tenant-matcher';
import type { DreamStudioWebhookOutputs, ExampleEvent } from './webhooks/types';
import { ExampleEventSchema } from './webhooks/types';

export type DreamStudioPluginOptions = {
	authType?: PickAuth<'api_key' | 'oauth_2'>;
	key?: string;
	webhookSecret?: string;
	hooks?: InternalDreamStudioPlugin['hooks'];
	webhookHooks?: InternalDreamStudioPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof dreamStudioEndpointsNested>;
};

export type DreamStudioContext = CorsairPluginContext<
	typeof DreamStudioSchema,
	DreamStudioPluginOptions
>;

export type DreamStudioKeyBuilderContext =
	KeyBuilderContext<DreamStudioPluginOptions>;

export type DreamStudioBoundEndpoints = BindEndpoints<
	typeof dreamStudioEndpointsNested
>;

type DreamStudioEndpoint<K extends keyof DreamStudioEndpointOutputs> =
	CorsairEndpoint<
		DreamStudioContext,
		DreamStudioEndpointInputs[K],
		DreamStudioEndpointOutputs[K]
	>;

export type DreamStudioEndpoints = {
	getBalance: DreamStudioEndpoint<'getBalance'>;
	getAccount: DreamStudioEndpoint<'getAccount'>;
	listEngines: DreamStudioEndpoint<'listEngines'>;
};

type DreamStudioWebhook<
	K extends keyof DreamStudioWebhookOutputs,
	TEvent,
> = CorsairWebhook<DreamStudioContext, TEvent, DreamStudioWebhookOutputs[K]>;

export type DreamStudioWebhooks = {
	example: DreamStudioWebhook<'example', ExampleEvent>;
};

export type DreamStudioBoundWebhooks = BindWebhooks<DreamStudioWebhooks>;

const dreamStudioEndpointsNested = {
	user: {
		getBalance: User.getBalance,
		getAccount: User.getAccount,
	},
	engines: {
		list: User.listEngines,
	},
} as const;

const dreamStudioWebhooksNested = {
	example: {
		example: ExampleWebhooks.example,
	},
} as const;

export const dreamStudioEndpointSchemas = {
	'user.getBalance': {
		input: DreamStudioEndpointInputSchemas.getBalance,
		output: DreamStudioEndpointOutputSchemas.getBalance,
	},
	'user.getAccount': {
		input: DreamStudioEndpointInputSchemas.getAccount,
		output: DreamStudioEndpointOutputSchemas.getAccount,
	},
	'engines.list': {
		input: DreamStudioEndpointInputSchemas.listEngines,
		output: DreamStudioEndpointOutputSchemas.listEngines,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof dreamStudioEndpointsNested
>;

const dreamStudioWebhookSchemas = {
	'example.example': {
		description: 'An example webhook event',
		payload: ExampleEventSchema,
		response: ExampleEventSchema,
	},
} as const satisfies RequiredPluginWebhookSchemas<
	typeof dreamStudioWebhooksNested
>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const dreamStudioEndpointMeta = {
	'user.getBalance': {
		riskLevel: 'read',
		description: 'Get the current Stability AI credit balance',
	},
	'user.getAccount': {
		riskLevel: 'read',
		description: 'Get Stability AI account information',
	},
	'engines.list': {
		riskLevel: 'read',
		description: 'List available Stability AI engines',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof dreamStudioEndpointsNested
>;

export const dreamStudioAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
	oauth_2: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseDreamStudioPlugin<T extends DreamStudioPluginOptions> =
	CorsairPlugin<
		'dreamstudio',
		typeof DreamStudioSchema,
		typeof dreamStudioEndpointsNested,
		typeof dreamStudioWebhooksNested,
		T,
		typeof defaultAuthType
	>;

export type InternalDreamStudioPlugin =
	BaseDreamStudioPlugin<DreamStudioPluginOptions>;

export type ExternalDreamStudioPlugin<T extends DreamStudioPluginOptions> =
	BaseDreamStudioPlugin<T>;

export function dreamstudio<const T extends DreamStudioPluginOptions>(
	incomingOptions: DreamStudioPluginOptions &
		T = {} as DreamStudioPluginOptions & T,
): ExternalDreamStudioPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};

	return {
		id: 'dreamstudio',
		authConfig: dreamStudioAuthConfig,
		schema: DreamStudioSchema,
		options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: dreamStudioEndpointsNested,
		webhooks: dreamStudioWebhooksNested,
		endpointMeta: dreamStudioEndpointMeta,
		endpointSchemas: dreamStudioEndpointSchemas,
		webhookSchemas: dreamStudioWebhookSchemas,

		pluginWebhookMatcher: (request) => {
			const headers = request.headers;

			// TODO: Update to match your webhook signature headers.
			return 'x-dreamstudio-signature' in headers;
		},

		pluginTenantWebhookMatcher: matchDreamStudioTenantWebhook,

		oauthWebhookTenantLinkResolver: resolveDreamStudioOAuthWebhookTenantLink,

		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},

		keyBuilder: async (ctx: DreamStudioKeyBuilderContext, source) => {
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
	} satisfies InternalDreamStudioPlugin;
}

export type {
	DreamStudioEndpointInputs,
	DreamStudioEndpointOutputs,
	GetAccountInput,
	GetAccountResponse,
	GetBalanceInput,
	GetBalanceResponse,
	ListEnginesInput,
	ListEnginesResponse,
} from './endpoints/types';
export type {
	DreamStudioWebhookOutputs,
	ExampleEvent,
} from './webhooks/types';
