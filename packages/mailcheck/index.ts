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
import type { MailcheckEndpointInputs, MailcheckEndpointOutputs } from './endpoints/types';
import { MailcheckEndpointInputSchemas, MailcheckEndpointOutputSchemas } from './endpoints/types';
import type {
	MailcheckWebhookOutputs,
	ExampleEvent,
} from './webhooks/types';
import { ExampleEventSchema } from './webhooks/types';
import { Mailcheck } from './endpoints';
import { MailcheckSchema } from './schema';
import { ExampleWebhooks } from './webhooks';
import { errorHandlers } from './error-handlers';
import { matchMailcheckTenantWebhook } from './webhooks/tenant-matcher';
import { resolveMailcheckOAuthWebhookTenantLink } from './webhooks/oauth-tenant-link';

export type MailcheckPluginOptions = {
	authType?: PickAuth<'api_key' | 'oauth_2'>;
	key?: string;
	webhookSecret?: string;
	hooks?: InternalMailcheckPlugin['hooks'];
	webhookHooks?: InternalMailcheckPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof mailcheckEndpointsNested>;
};

export type MailcheckContext = CorsairPluginContext
	typeof MailcheckSchema,
	MailcheckPluginOptions
>;

export type MailcheckKeyBuilderContext = KeyBuilderContext<MailcheckPluginOptions>;

export type MailcheckBoundEndpoints = BindEndpoints<typeof mailcheckEndpointsNested>;

type MailcheckEndpoint
	K extends keyof MailcheckEndpointOutputs,
> = CorsairEndpoint
	MailcheckContext,
	MailcheckEndpointInputs[K],
	MailcheckEndpointOutputs[K]
>;

export type MailcheckEndpoints = {
	verifyEmail: MailcheckEndpoint<'verifyEmail'>;
	validateDomain: MailcheckEndpoint<'validateDomain'>;
};

type MailcheckWebhook
	K extends keyof MailcheckWebhookOutputs,
	TEvent,
> = CorsairWebhook<MailcheckContext, TEvent, MailcheckWebhookOutputs[K]>;

export type MailcheckWebhooks = {
	example: MailcheckWebhook<'example', ExampleEvent>;
};

export type MailcheckBoundWebhooks = BindWebhooks<MailcheckWebhooks>;

const mailcheckEndpointsNested = {
	email: {
		verify: Mailcheck.verifyEmail,
	},
	domain: {
		validate: Mailcheck.validateDomain,
	},
} as const;

const mailcheckWebhooksNested = {
	example: {
		example: ExampleWebhooks.example,
	},
} as const;

export const mailcheckEndpointSchemas = {
	'email.verify': {
		input: MailcheckEndpointInputSchemas.verifyEmail,
		output: MailcheckEndpointOutputSchemas.verifyEmail,
	},
	'domain.validate': {
		input: MailcheckEndpointInputSchemas.validateDomain,
		output: MailcheckEndpointOutputSchemas.validateDomain,
	},
} as const satisfies RequiredPluginEndpointSchemas<typeof mailcheckEndpointsNested>;

const mailcheckWebhookSchemas = {
	'example.example': {
		description: 'An example webhook event',
		payload: ExampleEventSchema,
		response: ExampleEventSchema,
	},
} as const satisfies RequiredPluginWebhookSchemas<typeof mailcheckWebhooksNested>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const mailcheckEndpointMeta = {
	'email.verify': {
		riskLevel: 'read',
		description: 'Verify an email address for syntax, MX, SMTP validity, and optional breach check',
	},
	'domain.validate': {
		riskLevel: 'read',
		description: 'Validate a domain for disposability, MX records, domain age, and spam indicators',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof mailcheckEndpointsNested>;

export const mailcheckAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
	oauth_2: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseMailcheckPlugin<T extends MailcheckPluginOptions> = CorsairPlugin
	'mailcheck',
	typeof MailcheckSchema,
	typeof mailcheckEndpointsNested,
	typeof mailcheckWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalMailcheckPlugin = BaseMailcheckPlugin<MailcheckPluginOptions>;

export type ExternalMailcheckPlugin<T extends MailcheckPluginOptions> =
	BaseMailcheckPlugin<T>;

export function mailcheck<const T extends MailcheckPluginOptions>(
	incomingOptions: MailcheckPluginOptions & T = {} as MailcheckPluginOptions & T,
): ExternalMailcheckPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'mailcheck',
		authConfig: mailcheckAuthConfig,
		schema: MailcheckSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: mailcheckEndpointsNested,
		webhooks: mailcheckWebhooksNested,
		endpointMeta: mailcheckEndpointMeta,
		endpointSchemas: mailcheckEndpointSchemas,
		webhookSchemas: mailcheckWebhookSchemas,
		pluginWebhookMatcher: (request) => {
			const headers = request.headers;
			return 'x-mailcheck-signature' in headers;
		},
		pluginTenantWebhookMatcher: matchMailcheckTenantWebhook,
		oauthWebhookTenantLinkResolver: resolveMailcheckOAuthWebhookTenantLink,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: MailcheckKeyBuilderContext, source) => {
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
	} satisfies InternalMailcheckPlugin;
}

export type {
	ExampleEvent,
	MailcheckWebhookOutputs,
} from './webhooks/types';

export type {
	MailcheckEndpointInputs,
	MailcheckEndpointOutputs,
	VerifyEmailInput,
	VerifyEmailResponse,
	ValidateDomainInput,
	ValidateDomainResponse,
} from './endpoints/types';