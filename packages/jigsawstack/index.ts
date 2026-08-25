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
import { Example } from './endpoints';
// ─── ADDED: import summarize endpoint ─────────────────────────
import { summarize } from './endpoints/summarize'; // ← ADDED
import type {
	JigsawstackEndpointInputs,
	JigsawstackEndpointOutputs,
} from './endpoints/types';
import {
	JigsawstackEndpointInputSchemas,
	JigsawstackEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { JigsawstackSchema } from './schema';
import { ExampleWebhooks } from './webhooks';
import { resolveJigsawstackOAuthWebhookTenantLink } from './webhooks/oauth-tenant-link';
import { matchJigsawstackTenantWebhook } from './webhooks/tenant-matcher';
import type { ExampleEvent, JigsawstackWebhookOutputs } from './webhooks/types';
import { ExampleEventSchema } from './webhooks/types';

export type JigsawstackPluginOptions = {
	authType?: PickAuth<'api_key' | 'oauth_2'>;
	key?: string;
	webhookSecret?: string;
	hooks?: InternalJigsawstackPlugin['hooks'];
	webhookHooks?: InternalJigsawstackPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof jigsawstackEndpointsNested>;
};

export type JigsawstackContext = CorsairPluginContext<
	typeof JigsawstackSchema,
	JigsawstackPluginOptions
>;

export type JigsawstackKeyBuilderContext =
	KeyBuilderContext<JigsawstackPluginOptions>;

export type JigsawstackBoundEndpoints = BindEndpoints<
	typeof jigsawstackEndpointsNested
>;

type JigsawstackEndpoint<K extends keyof JigsawstackEndpointOutputs> =
	CorsairEndpoint<
		JigsawstackContext,
		JigsawstackEndpointInputs[K],
		JigsawstackEndpointOutputs[K]
	>;

// ─── UPDATED: added summarizePost to export type ──────────────
export type JigsawstackEndpoints = {
	exampleGet: JigsawstackEndpoint<'exampleGet'>;
	summarizePost: JigsawstackEndpoint<'summarizeText'>; // ← ADDED
};

type JigsawstackWebhook<
	K extends keyof JigsawstackWebhookOutputs,
	TEvent,
> = CorsairWebhook<JigsawstackContext, TEvent, JigsawstackWebhookOutputs[K]>;

export type JigsawstackWebhooks = {
	example: JigsawstackWebhook<'example', ExampleEvent>;
};

export type JigsawstackBoundWebhooks = BindWebhooks<JigsawstackWebhooks>;

// ─── UPDATED: added summarize.post ─────────────────────────────
const jigsawstackEndpointsNested = {
	example: {
		get: Example.get,
	},
	summarize: {
		// ← ADDED
		post: summarize,
	},
} as const;

const jigsawstackWebhooksNested = {
	example: {
		example: ExampleWebhooks.example,
	},
} as const;

// ─── UPDATED: added 'summarize.post' schema ────────────────────
export const jigsawstackEndpointSchemas = {
	'example.get': {
		input: JigsawstackEndpointInputSchemas.exampleGet,
		output: JigsawstackEndpointOutputSchemas.exampleGet,
	},
	'summarize.post': {
		// ← ADDED
		input: JigsawstackEndpointInputSchemas.summarizeText,
		output: JigsawstackEndpointOutputSchemas.summarizeText,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof jigsawstackEndpointsNested
>;

const jigsawstackWebhookSchemas = {
	'example.example': {
		description: 'An example webhook event',
		payload: ExampleEventSchema,
		response: ExampleEventSchema,
	},
} as const satisfies RequiredPluginWebhookSchemas<
	typeof jigsawstackWebhooksNested
>;

const defaultAuthType: AuthTypes = 'api_key' as const;

// ─── UPDATED: added 'summarize.post' meta ──────────────────────
const jigsawstackEndpointMeta = {
	'example.get': {
		riskLevel: 'read',
		description: 'Get an example resource by ID',
	},
	'summarize.post': {
		// ← ADDED
		riskLevel: 'read',
		description: 'Summarize text using JigsawStack AI',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof jigsawstackEndpointsNested
>;

export const jigsawstackAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
	oauth_2: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseJigsawstackPlugin<T extends JigsawstackPluginOptions> =
	CorsairPlugin<
		'jigsawstack',
		typeof JigsawstackSchema,
		typeof jigsawstackEndpointsNested,
		typeof jigsawstackWebhooksNested,
		T,
		typeof defaultAuthType
	>;

export type InternalJigsawstackPlugin =
	BaseJigsawstackPlugin<JigsawstackPluginOptions>;

export type ExternalJigsawstackPlugin<T extends JigsawstackPluginOptions> =
	BaseJigsawstackPlugin<T>;

export function jigsawstack<const T extends JigsawstackPluginOptions>(
	incomingOptions: JigsawstackPluginOptions &
		T = {} as JigsawstackPluginOptions & T,
): ExternalJigsawstackPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'jigsawstack',
		authConfig: jigsawstackAuthConfig,
		schema: JigsawstackSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: jigsawstackEndpointsNested,
		webhooks: jigsawstackWebhooksNested,
		endpointMeta: jigsawstackEndpointMeta,
		endpointSchemas: jigsawstackEndpointSchemas,
		webhookSchemas: jigsawstackWebhookSchemas,
		pluginWebhookMatcher: (request) => {
			const headers = request.headers;
			// TODO: Update to match your webhook signature headers
			return 'x-jigsawstack-signature' in headers;
		},
		pluginTenantWebhookMatcher: matchJigsawstackTenantWebhook,
		oauthWebhookTenantLinkResolver: resolveJigsawstackOAuthWebhookTenantLink,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: JigsawstackKeyBuilderContext, source) => {
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
	} satisfies InternalJigsawstackPlugin;
}

export type {
	ExampleGetInput,
	ExampleGetResponse,
	JigsawstackEndpointInputs,
	JigsawstackEndpointOutputs,
} from './endpoints/types';
export type {
	ExampleEvent,
	JigsawstackWebhookOutputs,
} from './webhooks/types';
