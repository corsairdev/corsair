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

import { BrowserTool } from './endpoints';

import type {
	BrowserToolEndpointInputs,
	BrowserToolEndpointOutputs,
} from './endpoints/types';

import {
	BrowserToolEndpointInputSchemas,
	BrowserToolEndpointOutputSchemas,
} from './endpoints/types';

import { errorHandlers } from './error-handlers';
import { BrowserToolSchema } from './schema';

import { ExampleWebhooks } from './webhooks';

import { resolveBrowserToolOAuthWebhookTenantLink } from './webhooks/oauth-tenant-link';

import { matchBrowserToolTenantWebhook } from './webhooks/tenant-matcher';

import type { BrowserToolWebhookOutputs, ExampleEvent } from './webhooks/types';

import { ExampleEventSchema } from './webhooks/types';

export type BrowserToolPluginOptions = {
	authType?: PickAuth<'api_key' | 'oauth_2'>;
	key?: string;
	webhookSecret?: string;
	hooks?: InternalBrowserToolPlugin['hooks'];
	webhookHooks?: InternalBrowserToolPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof browserToolEndpointsNested>;
};

export type BrowserToolContext = CorsairPluginContext<
	typeof BrowserToolSchema,
	BrowserToolPluginOptions
>;

export type BrowserToolKeyBuilderContext =
	KeyBuilderContext<BrowserToolPluginOptions>;

export type BrowserToolBoundEndpoints = BindEndpoints<
	typeof browserToolEndpointsNested
>;

type BrowserToolEndpoint<K extends keyof BrowserToolEndpointOutputs> =
	CorsairEndpoint<
		BrowserToolContext,
		BrowserToolEndpointInputs[K],
		BrowserToolEndpointOutputs[K]
	>;

export type BrowserToolEndpoints = {
	runBrowserTask: BrowserToolEndpoint<'runBrowserTask'>;
	downloadTaskFile: BrowserToolEndpoint<'downloadTaskFile'>;
	getSessionLiveUrl: BrowserToolEndpoint<'getSessionLiveUrl'>;
	stopBrowserTask: BrowserToolEndpoint<'stopBrowserTask'>;
	watchBrowserTask: BrowserToolEndpoint<'watchBrowserTask'>;
};

type BrowserToolWebhook<
	K extends keyof BrowserToolWebhookOutputs,
	TEvent,
> = CorsairWebhook<BrowserToolContext, TEvent, BrowserToolWebhookOutputs[K]>;

export type BrowserToolWebhooks = {
	example: BrowserToolWebhook<'example', ExampleEvent>;
};

export type BrowserToolBoundWebhooks = BindWebhooks<BrowserToolWebhooks>;

/* =========================
   ENDPOINTS
   ========================= */

const browserToolEndpointsNested = {
	runBrowserTask: BrowserTool.runBrowserTask,
	downloadTaskFile: BrowserTool.downloadTaskFile,
	getSessionLiveUrl: BrowserTool.getSessionLiveUrl,
	stopBrowserTask: BrowserTool.stopBrowserTask,
	watchBrowserTask: BrowserTool.watchBrowserTask,
} as const;

/* =========================
   ENDPOINT SCHEMAS
   ========================= */

export const browserToolEndpointSchemas = {
	runBrowserTask: {
		input: BrowserToolEndpointInputSchemas.runBrowserTask,
		output: BrowserToolEndpointOutputSchemas.runBrowserTask,
	},

	downloadTaskFile: {
		input: BrowserToolEndpointInputSchemas.downloadTaskFile,
		output: BrowserToolEndpointOutputSchemas.downloadTaskFile,
	},

	getSessionLiveUrl: {
		input: BrowserToolEndpointInputSchemas.getSessionLiveUrl,
		output: BrowserToolEndpointOutputSchemas.getSessionLiveUrl,
	},

	stopBrowserTask: {
		input: BrowserToolEndpointInputSchemas.stopBrowserTask,
		output: BrowserToolEndpointOutputSchemas.stopBrowserTask,
	},

	watchBrowserTask: {
		input: BrowserToolEndpointInputSchemas.watchBrowserTask,
		output: BrowserToolEndpointOutputSchemas.watchBrowserTask,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof browserToolEndpointsNested
>;

/* =========================
   WEBHOOKS
   ========================= */

const browserToolWebhooksNested = {
	example: ExampleWebhooks.example,
} as const;

/* =========================
   WEBHOOK SCHEMAS
   ========================= */
const browserToolWebhookSchemas = {
	example: {
		description: 'An example webhook event',
		payload: ExampleEventSchema,
		response: ExampleEventSchema,
	},
} as const satisfies RequiredPluginWebhookSchemas<
	typeof browserToolWebhooksNested
>;

/* =========================
   AUTH
   ========================= */

const defaultAuthType: AuthTypes = 'api_key' as const;

/* =========================
   ENDPOINT META
   ========================= */

const browserToolEndpointMeta = {
	runBrowserTask: {
		riskLevel: 'write',
		description: 'Run an AI-powered browser automation task',
	},

	downloadTaskFile: {
		riskLevel: 'read',
		description: 'Get download URL for a task output file',
	},

	getSessionLiveUrl: {
		riskLevel: 'read',
		description: 'Get live URL of a browser session',
	},

	stopBrowserTask: {
		riskLevel: 'write',
		description: 'Stop a running browser task',
	},

	watchBrowserTask: {
		riskLevel: 'read',
		description: 'Watch progress of a browser task',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof browserToolEndpointsNested
>;

/* =========================
   AUTH CONFIG
   ========================= */

export const browserToolAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},

	oauth_2: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

/* =========================
   PLUGIN TYPES
   ========================= */

export type BaseBrowserToolPlugin<T extends BrowserToolPluginOptions> =
	CorsairPlugin<
		'browsertool',
		typeof BrowserToolSchema,
		typeof browserToolEndpointsNested,
		typeof browserToolWebhooksNested,
		T,
		typeof defaultAuthType
	>;

export type InternalBrowserToolPlugin =
	BaseBrowserToolPlugin<BrowserToolPluginOptions>;

export type ExternalBrowserToolPlugin<T extends BrowserToolPluginOptions> =
	BaseBrowserToolPlugin<T>;

/* =========================
   PLUGIN
   ========================= */

export function browsertool<const T extends BrowserToolPluginOptions>(
	incomingOptions: BrowserToolPluginOptions &
		T = {} as BrowserToolPluginOptions & T,
): ExternalBrowserToolPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};

	return {
		id: 'browsertool',

		authConfig: browserToolAuthConfig,

		schema: BrowserToolSchema,

		options,

		hooks: options.hooks,

		webhookHooks: options.webhookHooks,

		endpoints: browserToolEndpointsNested,

		webhooks: browserToolWebhooksNested,

		endpointMeta: browserToolEndpointMeta,

		endpointSchemas: browserToolEndpointSchemas,

		webhookSchemas: browserToolWebhookSchemas,

		pluginWebhookMatcher: (request) => {
			const headers = request.headers;

			// TODO: Update to match your webhook signature headers
			return 'x-browsertool-signature' in headers;
		},

		pluginTenantWebhookMatcher: matchBrowserToolTenantWebhook,

		oauthWebhookTenantLinkResolver: resolveBrowserToolOAuthWebhookTenantLink,

		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},

		keyBuilder: async (ctx: BrowserToolKeyBuilderContext, source) => {
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
	} satisfies InternalBrowserToolPlugin;
}

/* =========================
   EXPORTS
   ========================= */

export type {
	BrowserToolEndpointInputs,
	BrowserToolEndpointOutputs,
} from './endpoints/types';

export type {
	BrowserToolWebhookOutputs,
	ExampleEvent,
} from './webhooks/types';
