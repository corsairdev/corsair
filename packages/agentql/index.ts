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
import type { AgentQLEndpointInputs, AgentQLEndpointOutputs } from './endpoints/types';
import { AgentQLEndpointInputSchemas, AgentQLEndpointOutputSchemas } from './endpoints/types';
import type {
	AgentQLWebhookOutputs,
	ExampleEvent,
} from './webhooks/types';
import { ExampleEventSchema } from './webhooks/types';
import { Example } from './endpoints';
import { AgentQLSchema } from './schema';
import { ExampleWebhooks } from './webhooks';
import { errorHandlers } from './error-handlers';

export type AgentQLPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	webhookSecret?: string;
	hooks?: InternalAgentQLPlugin['hooks'];
	webhookHooks?: InternalAgentQLPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof agentQLEndpointsNested>;
};

export type AgentQLContext = CorsairPluginContext<
	typeof AgentQLSchema,
	AgentQLPluginOptions
>;

export type AgentQLKeyBuilderContext = KeyBuilderContext<AgentQLPluginOptions>;

export type AgentQLBoundEndpoints = BindEndpoints<typeof agentQLEndpointsNested>;

type AgentQLEndpoint<
	K extends keyof AgentQLEndpointOutputs,
> = CorsairEndpoint<
	AgentQLContext,
	AgentQLEndpointInputs[K],
	AgentQLEndpointOutputs[K]
>;

export type AgentQLEndpoints = {
	exampleGet: AgentQLEndpoint<'exampleGet'>;
};

type AgentQLWebhook<
	K extends keyof AgentQLWebhookOutputs,
	TEvent,
> = CorsairWebhook<AgentQLContext, TEvent, AgentQLWebhookOutputs[K]>;

export type AgentQLWebhooks = {
	example: AgentQLWebhook<'example', ExampleEvent>;
};

export type AgentQLBoundWebhooks = BindWebhooks<AgentQLWebhooks>;

const agentQLEndpointsNested = {
	example: {
		get: Example.get,
	},
} as const;

const agentQLWebhooksNested = {
	example: {
		example: ExampleWebhooks.example,
	},
} as const;

export const agentQLEndpointSchemas = {
	'example.get': {
		input: AgentQLEndpointInputSchemas.exampleGet,
		output: AgentQLEndpointOutputSchemas.exampleGet,
	},
} as const satisfies RequiredPluginEndpointSchemas<typeof agentQLEndpointsNested>;

const agentQLWebhookSchemas = {
	'example.example': {
		description: 'An example webhook event',
		payload: ExampleEventSchema,
		response: ExampleEventSchema,
	},
} as const satisfies RequiredPluginWebhookSchemas<typeof agentQLWebhooksNested>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const agentQLEndpointMeta = {
	'example.get': {
		riskLevel: 'read',
		description: 'Get an example resource by ID',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof agentQLEndpointsNested>;

export const agentQLAuthConfig = {
	api_key: {
		account: ['one'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseAgentQLPlugin<T extends AgentQLPluginOptions> = CorsairPlugin<
	'agentql',
	typeof AgentQLSchema,
	typeof agentQLEndpointsNested,
	typeof agentQLWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalAgentQLPlugin = BaseAgentQLPlugin<AgentQLPluginOptions>;

export type ExternalAgentQLPlugin<T extends AgentQLPluginOptions> =
	BaseAgentQLPlugin<T>;

export function agentql<const T extends AgentQLPluginOptions>(
	incomingOptions: AgentQLPluginOptions & T = {} as AgentQLPluginOptions & T,
): ExternalAgentQLPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'agentql',
		schema: AgentQLSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: agentQLEndpointsNested,
		webhooks: agentQLWebhooksNested,
		endpointMeta: agentQLEndpointMeta,
		endpointSchemas: agentQLEndpointSchemas,
		webhookSchemas: agentQLWebhookSchemas,
		pluginWebhookMatcher: (request) => {
			const headers = request.headers;
			// TODO: Update to match your webhook signature headers
			return 'x-agentql-signature' in headers;
		},
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: AgentQLKeyBuilderContext, source) => {
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
	} satisfies InternalAgentQLPlugin;
}

export type {
	ExampleEvent,
	AgentQLWebhookOutputs,
} from './webhooks/types';

export type {
	AgentQLEndpointInputs,
	AgentQLEndpointOutputs,
	ExampleGetInput,
	ExampleGetResponse,
} from './endpoints/types';
