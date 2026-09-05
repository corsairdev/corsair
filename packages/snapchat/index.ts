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
	RequiredPluginEndpointMeta,
	RequiredPluginEndpointSchemas,
	RequiredPluginWebhookSchemas,
} from 'corsair/core';
import type { AuthTypes } from 'corsair/core';

import type {
	SnapchatEndpointInputs,
	SnapchatEndpointOutputs,
	SnapchatDataInput,
	SnapchatDataResponse,
} from './endpoints/types';

import {
	SnapchatEndpointInputSchemas,
	SnapchatEndpointOutputSchemas,
} from './endpoints/types';

import type {
	SnapchatWebhookOutputs,
	ExampleEvent,
} from './webhooks/types';

import { ExampleEventSchema } from './webhooks/types';
import { PublicData } from './endpoints';

import { SnapchatSchema } from './schema';
import { ExampleWebhooks } from './webhooks';
import { errorHandlers } from './error-handlers';
import { matchSnapchatTenantWebhook } from './webhooks/tenant-matcher';
import { resolveSnapchatOAuthWebhookTenantLink } from './webhooks/oauth-tenant-link';

export type SnapchatPluginOptions = {
	authType?: PickAuth<'api_key' | 'oauth_2'>;
	key?: string;
	webhookSecret?: string;
	hooks?: InternalSnapchatPlugin['hooks'];
	webhookHooks?: InternalSnapchatPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof snapchatEndpointsNested>;
};

export type SnapchatContext = CorsairPluginContext<
	typeof SnapchatSchema,
	SnapchatPluginOptions
>;

export type SnapchatKeyBuilderContext =
	KeyBuilderContext<SnapchatPluginOptions>;

export type SnapchatBoundEndpoints =
	BindEndpoints<typeof snapchatEndpointsNested>;

type SnapchatEndpoint<
	K extends keyof SnapchatEndpointOutputs,
> = CorsairEndpoint<
	SnapchatContext,
	SnapchatEndpointInputs[K],
	SnapchatEndpointOutputs[K]
>;

export type SnapchatEndpoints = {
	getPublicData: SnapchatEndpoint<'getPublicData'>;
};

type SnapchatWebhook<
	K extends keyof SnapchatWebhookOutputs,
	TEvent,
> = CorsairWebhook<
	SnapchatContext,
	TEvent,
	SnapchatWebhookOutputs[K]
>;

export type SnapchatWebhooks = {
	example: SnapchatWebhook<'example', ExampleEvent>;
};

export type SnapchatBoundWebhooks = BindWebhooks<SnapchatWebhooks>;

const snapchatEndpointsNested = {
	publicData: {
		get: PublicData.get,
	},
} as const;

const snapchatWebhooksNested = {
	example: {
		example: ExampleWebhooks.example,
	},
} as const;

export const snapchatEndpointSchemas = {
	'publicData.get': {
		input: SnapchatEndpointInputSchemas.getPublicData,
		output: SnapchatEndpointOutputSchemas.getPublicData,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof snapchatEndpointsNested
>;

const snapchatWebhookSchemas = {
	'example.example': {
		description: 'An example webhook event',
		payload: ExampleEventSchema,
		response: ExampleEventSchema,
	},
} as const satisfies RequiredPluginWebhookSchemas<
	typeof snapchatWebhooksNested
>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const snapchatEndpointMeta = {
	'publicData.get': {
		riskLevel: 'read',
		description:
			'Get permitted public disaster-related Snapchat data',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof snapchatEndpointsNested
>;

export const snapchatAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
	oauth_2: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseSnapchatPlugin<
	T extends SnapchatPluginOptions,
> = CorsairPlugin<
	'snapchat',
	typeof SnapchatSchema,
	typeof snapchatEndpointsNested,
	typeof snapchatWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalSnapchatPlugin =
	BaseSnapchatPlugin<SnapchatPluginOptions>;

export type ExternalSnapchatPlugin<
	T extends SnapchatPluginOptions,
> = BaseSnapchatPlugin<T>;

export function snapchat<
	const T extends SnapchatPluginOptions,
>(
	incomingOptions: SnapchatPluginOptions & T =
		{} as SnapchatPluginOptions & T,
): ExternalSnapchatPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};

	return {
		id: 'snapchat',
		authConfig: snapchatAuthConfig,
		schema: SnapchatSchema,
		options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: snapchatEndpointsNested,
		webhooks: snapchatWebhooksNested,
		endpointMeta: snapchatEndpointMeta,
		endpointSchemas: snapchatEndpointSchemas,
		webhookSchemas: snapchatWebhookSchemas,

		pluginWebhookMatcher: (request) => {
			const headers = request.headers;

			// TODO: Update when Snapchat webhook
			// signature headers are confirmed.
			return 'x-snapchat-signature' in headers;
		},

		pluginTenantWebhookMatcher: matchSnapchatTenantWebhook,

		oauthWebhookTenantLinkResolver:
			resolveSnapchatOAuthWebhookTenantLink,

		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},

		keyBuilder: async (
			ctx: SnapchatKeyBuilderContext,
			source,
		) => {
			if (source === 'webhook' && options.webhookSecret) {
				return options.webhookSecret;
			}

			if (source === 'webhook') {
				const res =
					await ctx.keys.get_webhook_signature();

				return res ?? '';
			}

			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (
				source === 'endpoint' &&
				ctx.authType === 'api_key'
			) {
				const res =
					await ctx.keys.get_api_key();

				return res ?? '';
			}

			if (
				source === 'endpoint' &&
				ctx.authType === 'oauth_2'
			) {
				const res =
					await ctx.keys.get_access_token();

				return res ?? '';
			}

			return '';
		},
	} satisfies InternalSnapchatPlugin;
}

export type {
	ExampleEvent,
	SnapchatWebhookOutputs,
} from './webhooks/types';

export type {
	SnapchatEndpointInputs,
	SnapchatEndpointOutputs,
	SnapchatDataInput,
	SnapchatDataResponse,
} from './endpoints/types';