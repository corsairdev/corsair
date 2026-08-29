import type {
	AuthTypes,
	BindEndpoints,
	CorsairEndpoint,
	CorsairErrorHandler,
	CorsairPlugin,
	CorsairPluginContext,
	KeyBuilderContext,
	PickAuth,
	PluginAuthConfig,
	PluginPermissionsConfig,
	RequiredPluginEndpointMeta,
	RequiredPluginEndpointSchemas,
} from 'corsair/core';
import { Mailcheck } from './endpoints';
import type {
	MailcheckEndpointInputs,
	MailcheckEndpointOutputs,
} from './endpoints/types';
import {
	MailcheckEndpointInputSchemas,
	MailcheckEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { MailcheckSchema } from './schema';

export type MailcheckPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalMailcheckPlugin['hooks'];
	webhookHooks?: InternalMailcheckPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof mailcheckEndpointsNested>;
};

export type MailcheckContext = CorsairPluginContext<
	typeof MailcheckSchema,
	MailcheckPluginOptions
>;

export type MailcheckKeyBuilderContext =
	KeyBuilderContext<MailcheckPluginOptions>;

export type MailcheckBoundEndpoints = BindEndpoints<
	typeof mailcheckEndpointsNested
>;

type MailcheckEndpoint<K extends keyof MailcheckEndpointOutputs> =
	CorsairEndpoint<
		MailcheckContext,
		MailcheckEndpointInputs[K],
		MailcheckEndpointOutputs[K]
	>;

export type MailcheckEndpoints = {
	verifyEmail: MailcheckEndpoint<'verifyEmail'>;
	validateDomain: MailcheckEndpoint<'validateDomain'>;
};

const mailcheckEndpointsNested = {
	email: {
		verify: Mailcheck.verifyEmail,
	},
	domain: {
		validate: Mailcheck.validateDomain,
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
} as const satisfies RequiredPluginEndpointSchemas<
	typeof mailcheckEndpointsNested
>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const mailcheckEndpointMeta = {
	'email.verify': {
		riskLevel: 'read',
		description:
			'Verify an email address for syntax, MX, SMTP validity, and optional breach check',
	},
	'domain.validate': {
		riskLevel: 'read',
		description:
			'Validate a domain for disposability, MX records, domain age, and spam indicators',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof mailcheckEndpointsNested
>;

export const mailcheckAuthConfig = {
	api_key: {
		// Mailcheck is api_key-only with no tenant concept, so no extra
		// account-level fields beyond the base api_key/webhook_signature.
		account: [] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseMailcheckPlugin<T extends MailcheckPluginOptions> =
	CorsairPlugin<
		'mailcheck',
		typeof MailcheckSchema,
		typeof mailcheckEndpointsNested,
		{},
		T,
		typeof defaultAuthType
	>;

export type InternalMailcheckPlugin =
	BaseMailcheckPlugin<MailcheckPluginOptions>;

export type ExternalMailcheckPlugin<T extends MailcheckPluginOptions> =
	BaseMailcheckPlugin<T>;

export function mailcheck<const T extends MailcheckPluginOptions>(
	incomingOptions: MailcheckPluginOptions & T = {} as MailcheckPluginOptions &
		T,
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
		endpointMeta: mailcheckEndpointMeta,
		endpointSchemas: mailcheckEndpointSchemas,
		pluginWebhookMatcher: () => false,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: MailcheckKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				return res ?? '';
			}

			return '';
		},
	} satisfies InternalMailcheckPlugin;
}

export type {
	MailcheckEndpointInputs,
	MailcheckEndpointOutputs,
	ValidateDomainInput,
	ValidateDomainResponse,
	VerifyEmailInput,
	VerifyEmailResponse,
} from './endpoints/types';
