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
import type { CodeInterpreterEndpointInputs, CodeInterpreterEndpointOutputs } from './endpoints/types';
import { CodeInterpreterEndpointInputSchemas, CodeInterpreterEndpointOutputSchemas } from './endpoints/types';
import type {
	CodeInterpreterWebhookOutputs,
	ExampleEvent,
} from './webhooks/types';
import { ExampleEventSchema } from './webhooks/types';
import { Example } from './endpoints';
import { CodeInterpreterSchema } from './schema';
import { ExampleWebhooks } from './webhooks';
import { errorHandlers } from './error-handlers';
import { matchCodeInterpreterTenantWebhook } from './webhooks/tenant-matcher';
import { resolveCodeInterpreterOAuthWebhookTenantLink } from './webhooks/oauth-tenant-link';

export type CodeInterpreterPluginOptions = {
	authType?: PickAuth<'api_key' | 'oauth_2'>;
	key?: string;
	webhookSecret?: string;
	hooks?: InternalCodeInterpreterPlugin['hooks'];
	webhookHooks?: InternalCodeInterpreterPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof codeInterpreterEndpointsNested>;
};

export type CodeInterpreterContext = CorsairPluginContext<
	typeof CodeInterpreterSchema,
	CodeInterpreterPluginOptions
>;

export type CodeInterpreterKeyBuilderContext = KeyBuilderContext<CodeInterpreterPluginOptions>;

export type CodeInterpreterBoundEndpoints = BindEndpoints<typeof codeInterpreterEndpointsNested>;

type CodeInterpreterEndpoint<
	K extends keyof CodeInterpreterEndpointOutputs,
> = CorsairEndpoint<
	CodeInterpreterContext,
	CodeInterpreterEndpointInputs[K],
	CodeInterpreterEndpointOutputs[K]
>;

export type CodeInterpreterEndpoints = {
	exampleGet: CodeInterpreterEndpoint<'exampleGet'>;
};

type CodeInterpreterWebhook<
	K extends keyof CodeInterpreterWebhookOutputs,
	TEvent,
> = CorsairWebhook<CodeInterpreterContext, TEvent, CodeInterpreterWebhookOutputs[K]>;

export type CodeInterpreterWebhooks = {
	example: CodeInterpreterWebhook<'example', ExampleEvent>;
};

export type CodeInterpreterBoundWebhooks = BindWebhooks<CodeInterpreterWebhooks>;

const codeInterpreterEndpointsNested = {
	example: {
		get: Example.get,
	},
} as const;

const codeInterpreterWebhooksNested = {
	example: {
		example: ExampleWebhooks.example,
	},
} as const;

export const codeInterpreterEndpointSchemas = {
	'example.get': {
		input: CodeInterpreterEndpointInputSchemas.exampleGet,
		output: CodeInterpreterEndpointOutputSchemas.exampleGet,
	},
} as const satisfies RequiredPluginEndpointSchemas<typeof codeInterpreterEndpointsNested>;

const codeInterpreterWebhookSchemas = {
	'example.example': {
		description: 'An example webhook event',
		payload: ExampleEventSchema,
		response: ExampleEventSchema,
	},
} as const satisfies RequiredPluginWebhookSchemas<typeof codeInterpreterWebhooksNested>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const codeInterpreterEndpointMeta = {
	'example.get': {
		riskLevel: 'read',
		description: 'Get an example resource by ID',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof codeInterpreterEndpointsNested>;

export const codeInterpreterAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
	oauth_2: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseCodeInterpreterPlugin<T extends CodeInterpreterPluginOptions> = CorsairPlugin<
	'codeinterpreter',
	typeof CodeInterpreterSchema,
	typeof codeInterpreterEndpointsNested,
	typeof codeInterpreterWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalCodeInterpreterPlugin = BaseCodeInterpreterPlugin<CodeInterpreterPluginOptions>;

export type ExternalCodeInterpreterPlugin<T extends CodeInterpreterPluginOptions> =
	BaseCodeInterpreterPlugin<T>;

export function codeinterpreter<const T extends CodeInterpreterPluginOptions>(
	incomingOptions: CodeInterpreterPluginOptions & T = {} as CodeInterpreterPluginOptions & T,
): ExternalCodeInterpreterPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'codeinterpreter',
		authConfig: codeInterpreterAuthConfig,
		schema: CodeInterpreterSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: codeInterpreterEndpointsNested,
		webhooks: codeInterpreterWebhooksNested,
		endpointMeta: codeInterpreterEndpointMeta,
		endpointSchemas: codeInterpreterEndpointSchemas,
		webhookSchemas: codeInterpreterWebhookSchemas,
		pluginWebhookMatcher: (request) => {
			const headers = request.headers;
			// TODO: Update to match your webhook signature headers
			return 'x-codeinterpreter-signature' in headers;
		},
		pluginTenantWebhookMatcher: matchCodeInterpreterTenantWebhook,
		oauthWebhookTenantLinkResolver: resolveCodeInterpreterOAuthWebhookTenantLink,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: CodeInterpreterKeyBuilderContext, source) => {
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
	} satisfies InternalCodeInterpreterPlugin;
}

export type {
	ExampleEvent,
	CodeInterpreterWebhookOutputs,
} from './webhooks/types';

export type {
	CodeInterpreterEndpointInputs,
	CodeInterpreterEndpointOutputs,
	ExampleGetInput,
	ExampleGetResponse,
} from './endpoints/types';
