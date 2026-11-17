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
import { AuthMissingError } from 'corsair/core';
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
	BatchStatusResponseSchema,
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
	'batches.get': {
		input: BatchIdInputSchema,
		output: BatchStatusResponseSchema,
	},
	'oauth.authorize': {
		input: AuthorizeInputSchema,
		output: AuthorizeResponseSchema,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof emailableEndpointsNested
>;

const read = (description: string) =>
	({ riskLevel: 'read', description }) as const;
// A batch verifies up to 50,000 addresses in one call and bills a credit for
// each, so it is a paid bulk job (R8: destructive). Verifying one address is a
// metered lookup and stays read, as in the Ahrefs plugin.
const destructive = (description: string) =>
	({ riskLevel: 'destructive', description }) as const;

const emailableEndpointMeta = {
	'account.get': read(
		'Get the credits left on the account. The owner email is not stored.',
	),
	'verifications.verify': read(
		'Verify one email address: state (deliverable, undeliverable, risky, unknown), reason, score, and flags such as disposable, free, role and accept-all, plus a did-you-mean suggestion. Uses one credit. If `pending` is true, call again within 5 minutes at no extra cost.',
	),
	'batches.create': destructive(
		'Start verifying a list of up to 50,000 addresses. Uses one credit per address. Poll batches.get for the results.',
	),
	'batches.get': read(
		"Get a batch: progress, counts per state and reason, and each address's result (up to 1,000 addresses) or a download link (larger batches).",
	),
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
				if (!key) throw new AuthMissingError('emailable', 'api_key');
				return key;
			}
			// No stored key and no key manager: ask for a connection instead of
			// sending an unauthenticated request.
			if (source === 'endpoint')
				throw new AuthMissingError('emailable', 'api_key');
			return '';
		},
	} satisfies InternalEmailablePlugin;
}
