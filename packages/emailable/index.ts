import type {
	AuthTypes,
	CorsairErrorHandler,
	CorsairPlugin,
	KeyBuilderContext,
	PickAuth,
	PluginAuthConfig,
	PluginPermissionsConfig,
	RequiredPluginEndpointMeta,
	RequiredPluginEndpointSchemas,
} from 'corsair/core';
import type { EmailableContext } from './context';
import {
	authorize,
	createBatch,
	getAccount,
	getBatch,
	verifyEmail,
} from './endpoints';
import {
	AccountResponseSchema,
	AuthorizeInputSchema,
	AuthorizeResponseSchema,
	BatchCreateInputSchema,
	BatchIdInputSchema,
	BatchResponseSchema,
	EmptyInputSchema,
	VerificationResponseSchema,
	VerifyInputSchema,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { EmailableSchema } from './schema';

export type { EmailableContext };

export type EmailablePluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalEmailablePlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof emailableEndpointsNested>;
};

export type EmailableKeyBuilderContext =
	KeyBuilderContext<EmailablePluginOptions>;

const emailableEndpointsNested = {
	account: { get: getAccount },
	verifications: { verify: verifyEmail },
	batches: { create: createBatch, get: getBatch },
	oauth: { authorize },
} as const;

const emailableWebhooksNested = {} as const;

export const emailableEndpointSchemas = {
	'account.get': { input: EmptyInputSchema, output: AccountResponseSchema },
	'verifications.verify': {
		input: VerifyInputSchema,
		output: VerificationResponseSchema,
	},
	'batches.create': {
		input: BatchCreateInputSchema,
		output: BatchResponseSchema,
	},
	'batches.get': { input: BatchIdInputSchema, output: BatchResponseSchema },
	'oauth.authorize': {
		input: AuthorizeInputSchema,
		output: AuthorizeResponseSchema,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof emailableEndpointsNested
>;

const read = (description: string) =>
	({ riskLevel: 'read', description }) as const;
const write = (description: string) =>
	({ riskLevel: 'write', description }) as const;

const emailableEndpointMeta = {
	'account.get': read('Read remaining credits. The owner email is not stored.'),
	'verifications.verify': write(
		'Verify one address. This spends a credit. Names are not stored.',
	),
	'batches.create': write(
		'Start a batch verification. This spends credits. Addresses are not stored.',
	),
	'batches.get': read('Read a batch. Addresses are not stored.'),
	'oauth.authorize': read(
		'Build the OAuth authorize URL. The client id is not stored.',
	),
} as const satisfies RequiredPluginEndpointMeta<
	typeof emailableEndpointsNested
>;

const defaultAuthType = 'api_key' as const satisfies AuthTypes;

export const emailableAuthConfig = {
	api_key: { account: [] as const },
} as const satisfies PluginAuthConfig;

export type BaseEmailablePlugin<T extends EmailablePluginOptions> =
	CorsairPlugin<
		'emailable',
		typeof EmailableSchema,
		typeof emailableEndpointsNested,
		typeof emailableWebhooksNested,
		T,
		typeof defaultAuthType
	>;

export type InternalEmailablePlugin =
	BaseEmailablePlugin<EmailablePluginOptions>;
export type ExternalEmailablePlugin<T extends EmailablePluginOptions> =
	BaseEmailablePlugin<T>;

export function emailable<const T extends EmailablePluginOptions>(
	incomingOptions: EmailablePluginOptions & T = {} as EmailablePluginOptions &
		T,
): ExternalEmailablePlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'emailable',
		authConfig: emailableAuthConfig,
		schema: EmailableSchema,
		options,
		hooks: options.hooks,
		endpoints: emailableEndpointsNested,
		webhooks: emailableWebhooksNested,
		endpointMeta: emailableEndpointMeta,
		endpointSchemas: emailableEndpointSchemas,
		errorHandlers: { ...errorHandlers, ...options.errorHandlers },
		keyBuilder: async (ctx: EmailableKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) return options.key;
			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const key = await ctx.keys.get_api_key();
				return key ?? '';
			}
			return '';
		},
	} satisfies InternalEmailablePlugin;
}
