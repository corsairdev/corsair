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
import type { AeroLeadsEndpointInputs, AeroLeadsEndpointOutputs } from './endpoints/types';
import { AeroLeadsEndpointInputSchemas, AeroLeadsEndpointOutputSchemas } from './endpoints/types';
import type { AeroLeadsWebhookOutputs } from './webhooks/types';
import { LinkedIn, Email } from './endpoints';
import { AeroLeadsSchema } from './schema';
import { errorHandlers } from './error-handlers';
import { matchAeroLeadsTenantWebhook } from './webhooks/tenant-matcher';
import { resolveAeroLeadsOAuthWebhookTenantLink } from './webhooks/oauth-tenant-link';

export type AeroLeadsPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	webhookSecret?: string;
	hooks?: InternalAeroLeadsPlugin['hooks'];
	webhookHooks?: InternalAeroLeadsPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof aeroLeadsEndpointsNested>;
};

export type AeroLeadsContext = CorsairPluginContext<
	typeof AeroLeadsSchema,
	AeroLeadsPluginOptions
>;

export type AeroLeadsKeyBuilderContext = KeyBuilderContext<AeroLeadsPluginOptions>;

export type AeroLeadsBoundEndpoints = BindEndpoints<typeof aeroLeadsEndpointsNested>;

type AeroLeadsEndpoint<
	K extends keyof AeroLeadsEndpointOutputs,
> = CorsairEndpoint<
	AeroLeadsContext,
	AeroLeadsEndpointInputs[K],
	AeroLeadsEndpointOutputs[K]
>;

export type AeroLeadsEndpoints = {
	linkedinGetDetails: AeroLeadsEndpoint<'linkedinGetDetails'>;
	emailGetCompanyEmail: AeroLeadsEndpoint<'emailGetCompanyEmail'>;
};

type AeroLeadsWebhook<
	K extends keyof AeroLeadsWebhookOutputs,
	TEvent,
> = CorsairWebhook<AeroLeadsContext, TEvent, AeroLeadsWebhookOutputs[K]>;

export type AeroLeadsWebhooks = Record<string, never>;

export type AeroLeadsBoundWebhooks = BindWebhooks<AeroLeadsWebhooks>;

const aeroLeadsEndpointsNested = {
	linkedin: {
		getDetails: LinkedIn.getDetails,
	},
	email: {
		getCompanyEmail: Email.getCompanyEmail,
	},
} as const;

const aeroLeadsWebhooksNested = {} as const;

export const aeroLeadsEndpointSchemas = {
	'linkedin.getDetails': {
		input: AeroLeadsEndpointInputSchemas.linkedinGetDetails,
		output: AeroLeadsEndpointOutputSchemas.linkedinGetDetails,
	},
	'email.getCompanyEmail': {
		input: AeroLeadsEndpointInputSchemas.emailGetCompanyEmail,
		output: AeroLeadsEndpointOutputSchemas.emailGetCompanyEmail,
	},
} as const satisfies RequiredPluginEndpointSchemas<typeof aeroLeadsEndpointsNested>;

const aeroLeadsWebhookSchemas = {} as const satisfies RequiredPluginWebhookSchemas<typeof aeroLeadsWebhooksNested>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const aeroLeadsEndpointMeta = {
	'linkedin.getDetails': {
		riskLevel: 'read',
		description: 'Get LinkedIn profile details including name, job, company, education, skills, and contact info',
	},
	'email.getCompanyEmail': {
		riskLevel: 'read',
		description: 'Verify an email address and get deliverability status',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof aeroLeadsEndpointsNested>;

export const aeroLeadsAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseAeroLeadsPlugin<T extends AeroLeadsPluginOptions> = CorsairPlugin<
	'aeroleads',
	typeof AeroLeadsSchema,
	typeof aeroLeadsEndpointsNested,
	typeof aeroLeadsWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalAeroLeadsPlugin = BaseAeroLeadsPlugin<AeroLeadsPluginOptions>;

export type ExternalAeroLeadsPlugin<T extends AeroLeadsPluginOptions> =
	BaseAeroLeadsPlugin<T>;

export function aeroleads<const T extends AeroLeadsPluginOptions>(
	incomingOptions: AeroLeadsPluginOptions & T = {} as AeroLeadsPluginOptions & T,
): ExternalAeroLeadsPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'aeroleads',
		authConfig: aeroLeadsAuthConfig,
		schema: AeroLeadsSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: aeroLeadsEndpointsNested,
		webhooks: aeroLeadsWebhooksNested,
		endpointMeta: aeroLeadsEndpointMeta,
		endpointSchemas: aeroLeadsEndpointSchemas,
		webhookSchemas: aeroLeadsWebhookSchemas,
		pluginWebhookMatcher: () => false,
		pluginTenantWebhookMatcher: matchAeroLeadsTenantWebhook,
		oauthWebhookTenantLinkResolver: resolveAeroLeadsOAuthWebhookTenantLink,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: AeroLeadsKeyBuilderContext, source) => {
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
	} satisfies InternalAeroLeadsPlugin;
}

export type {
	AeroLeadsEndpointInputs,
	AeroLeadsEndpointOutputs,
	LinkedInGetDetailsInput,
	LinkedInGetDetailsResponse,
	EmailGetCompanyEmailInput,
	EmailGetCompanyEmailResponse,
} from './endpoints/types';
