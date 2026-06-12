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
import type { AgentMailEndpointInputs, AgentMailEndpointOutputs } from './endpoints/types';
import { AgentMailEndpointInputSchemas, AgentMailEndpointOutputSchemas } from './endpoints/types';
import type {
	AgentMailWebhookOutputs,
	ExampleEvent,
} from './webhooks/types';
import { ExampleEventSchema } from './webhooks/types';
import { Example } from './endpoints';
import { AgentMailSchema } from './schema';
import { ExampleWebhooks } from './webhooks';
import { errorHandlers } from './error-handlers';

export type AgentMailPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	webhookSecret?: string;
	hooks?: InternalAgentMailPlugin['hooks'];
	webhookHooks?: InternalAgentMailPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof agentMailEndpointsNested>;
};

export type AgentMailContext = CorsairPluginContext<
	typeof AgentMailSchema,
	AgentMailPluginOptions
>;

export type AgentMailKeyBuilderContext = KeyBuilderContext<AgentMailPluginOptions>;

export type AgentMailBoundEndpoints = BindEndpoints<typeof agentMailEndpointsNested>;

type AgentMailEndpoint<
	K extends keyof AgentMailEndpointOutputs,
> = CorsairEndpoint<
	AgentMailContext,
	AgentMailEndpointInputs[K],
	AgentMailEndpointOutputs[K]
>;

export type AgentMailEndpoints = {
	exampleGet: AgentMailEndpoint<'exampleGet'>;
};

type AgentMailWebhook<
	K extends keyof AgentMailWebhookOutputs,
	TEvent,
> = CorsairWebhook<AgentMailContext, TEvent, AgentMailWebhookOutputs[K]>;

export type AgentMailWebhooks = {
	example: AgentMailWebhook<'example', ExampleEvent>;
};

export type AgentMailBoundWebhooks = BindWebhooks<AgentMailWebhooks>;

const agentMailEndpointsNested = {
	example: {
		get: Example.get,
	},
} as const;

const agentMailWebhooksNested = {
	example: {
		example: ExampleWebhooks.example,
	},
} as const;

export const agentMailEndpointSchemas = {
	'example.get': {
		input: AgentMailEndpointInputSchemas.exampleGet,
		output: AgentMailEndpointOutputSchemas.exampleGet,
	},
} as const satisfies RequiredPluginEndpointSchemas<typeof agentMailEndpointsNested>;

const agentMailWebhookSchemas = {
	'example.example': {
		description: 'An example webhook event',
		payload: ExampleEventSchema,
		response: ExampleEventSchema,
	},
} as const satisfies RequiredPluginWebhookSchemas<typeof agentMailWebhooksNested>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const agentMailEndpointMeta = {
	'example.get': {
		riskLevel: 'read',
		description: 'Get an example resource by ID',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof agentMailEndpointsNested>;

export const agentMailAuthConfig = {
	api_key: {
		account: ['one'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseAgentMailPlugin<T extends AgentMailPluginOptions> = CorsairPlugin<
	'agentmail',
	typeof AgentMailSchema,
	typeof agentMailEndpointsNested,
	typeof agentMailWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalAgentMailPlugin = BaseAgentMailPlugin<AgentMailPluginOptions>;

export type ExternalAgentMailPlugin<T extends AgentMailPluginOptions> =
	BaseAgentMailPlugin<T>;

export function agentmail<const T extends AgentMailPluginOptions>(
	incomingOptions: AgentMailPluginOptions & T = {} as AgentMailPluginOptions & T,
): ExternalAgentMailPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'agentmail',
		schema: AgentMailSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: agentMailEndpointsNested,
		webhooks: agentMailWebhooksNested,
		endpointMeta: agentMailEndpointMeta,
		endpointSchemas: agentMailEndpointSchemas,
		webhookSchemas: agentMailWebhookSchemas,
		pluginWebhookMatcher: (request) => {
			const headers = request.headers;
			// TODO: Update to match your webhook signature headers
			return 'x-agentmail-signature' in headers;
		},
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: AgentMailKeyBuilderContext, source) => {
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

			return '';
		},
	} satisfies InternalAgentMailPlugin;
}

export type {
	ExampleEvent,
	AgentMailWebhookOutputs,
} from './webhooks/types';

export type {
	AgentMailEndpointInputs,
	AgentMailEndpointOutputs,
	ExampleGetInput,
	ExampleGetResponse,
} from './endpoints/types';
