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
import type { CustomerioEndpointInputs, CustomerioEndpointOutputs } from './endpoints/types';
import { CustomerioEndpointInputSchemas, CustomerioEndpointOutputSchemas } from './endpoints/types';
import type {
	CustomerioWebhookOutputs,
	ExampleEvent,
} from './webhooks/types';
import { ExampleEventSchema } from './webhooks/types';
import { Customer } from './endpoints';
import { CustomerioSchema } from './schema';
import { ExampleWebhooks } from './webhooks';
import { errorHandlers } from './error-handlers';
import { matchCustomerioTenantWebhook } from './webhooks/tenant-matcher';
import { resolveCustomerioOAuthWebhookTenantLink } from './webhooks/oauth-tenant-link';

export type CustomerioPluginOptions = {
	authType?: PickAuth<'api_key' | 'oauth_2'>;
	key?: string;
	webhookSecret?: string;
	hooks?: InternalCustomerioPlugin['hooks'];
	webhookHooks?: InternalCustomerioPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof customerioEndpointsNested>;
};

export type CustomerioContext = CorsairPluginContext<
	typeof CustomerioSchema,
	CustomerioPluginOptions
>;

export type CustomerioKeyBuilderContext = KeyBuilderContext<CustomerioPluginOptions>;

export type CustomerioBoundEndpoints = BindEndpoints<typeof customerioEndpointsNested>;

type CustomerioEndpoint<
	K extends keyof CustomerioEndpointOutputs,
> = CorsairEndpoint<
	CustomerioContext,
	CustomerioEndpointInputs[K],
	CustomerioEndpointOutputs[K]
>;

getCustomerAttributes: CustomerioEndpoint<'getCustomerAttributes'>;

type CustomerioWebhook<
	K extends keyof CustomerioWebhookOutputs,
	TEvent,
> = CorsairWebhook<CustomerioContext, TEvent, CustomerioWebhookOutputs[K]>;

export type CustomerioWebhooks = {
	example: CustomerioWebhook<'example', ExampleEvent>;
};

export type CustomerioBoundWebhooks = BindWebhooks<CustomerioWebhooks>;

const customerioEndpointsNested = {
    customer: {
        getAttributes: Customer.getAttributes,
    },
} as const;

const customerioWebhooksNested = {
	example: {
		example: ExampleWebhooks.example,
	},
} as const;

export const customerioEndpointSchemas = {
	'customer.getAttributes': {
    input: CustomerioEndpointInputSchemas.getCustomerAttributes,
    output: CustomerioEndpointOutputSchemas.getCustomerAttributes,
},
} as const satisfies RequiredPluginEndpointSchemas<typeof customerioEndpointsNested>;

const customerioWebhookSchemas = {
	'example.example': {
		description: 'An example webhook event',
		payload: ExampleEventSchema,
		response: ExampleEventSchema,
	},
} as const satisfies RequiredPluginWebhookSchemas<typeof customerioWebhooksNested>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const customerioEndpointMeta = {
	'customer.getAttributes': {
    riskLevel: 'read',
    description: 'Get customer attributes by ID',
},
} as const satisfies RequiredPluginEndpointMeta<typeof customerioEndpointsNested>;

export const customerioAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
	oauth_2: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseCustomerioPlugin<T extends CustomerioPluginOptions> = CorsairPlugin<
	'customerio',
	typeof CustomerioSchema,
	typeof customerioEndpointsNested,
	typeof customerioWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalCustomerioPlugin = BaseCustomerioPlugin<CustomerioPluginOptions>;

export type ExternalCustomerioPlugin<T extends CustomerioPluginOptions> =
	BaseCustomerioPlugin<T>;

export function customerio<const T extends CustomerioPluginOptions>(
	incomingOptions: CustomerioPluginOptions & T = {} as CustomerioPluginOptions & T,
): ExternalCustomerioPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'customerio',
		authConfig: customerioAuthConfig,
		schema: CustomerioSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: customerioEndpointsNested,
		webhooks: customerioWebhooksNested,
		endpointMeta: customerioEndpointMeta,
		endpointSchemas: customerioEndpointSchemas,
		webhookSchemas: customerioWebhookSchemas,
		pluginWebhookMatcher: (request) => {
			const headers = request.headers;
			// TODO: Update to match your webhook signature headers
			return 'x-customerio-signature' in headers;
		},
		pluginTenantWebhookMatcher: matchCustomerioTenantWebhook,
		oauthWebhookTenantLinkResolver: resolveCustomerioOAuthWebhookTenantLink,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: CustomerioKeyBuilderContext, source) => {
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
	} satisfies InternalCustomerioPlugin;
}

export type {
	ExampleEvent,
	CustomerioWebhookOutputs,
} from './webhooks/types';

export type {
	CustomerioEndpointInputs,
	CustomerioEndpointOutputs,
	ExampleGetInput,
	ExampleGetResponse,
} from './endpoints/types';
