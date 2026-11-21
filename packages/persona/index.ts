import type {
	AuthTypes,
	BindEndpoints,
	BindWebhooks,
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
	RequiredPluginWebhookSchemas,
} from 'corsair/core';
import { AuthMissingError } from 'corsair/core';
import {
	Accounts,
	Inquiries,
	InquirySessions,
	InquiryTemplates,
	Webhooks,
} from './endpoints';
import type {
	PersonaEndpointInputs,
	PersonaEndpointOutputs,
} from './endpoints/types';
import {
	PersonaEndpointInputSchemas,
	PersonaEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';
import { PersonaSchema } from './schema';
import { event } from './webhooks';
import { matchPersonaWebhook, PersonaEventSchema } from './webhooks/types';

export type PersonaPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	/**
	 * Persona-Version header value. Defaults to 2023-01-05, the version the
	 * schemas follow; another version may change the response shapes.
	 */
	apiVersion?: string;
	webhookSecret?: string;
	hooks?: InternalPersonaPlugin['hooks'];
	webhookHooks?: InternalPersonaPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof personaEndpointsNested>;
};

export type PersonaContext = CorsairPluginContext<
	typeof PersonaSchema,
	PersonaPluginOptions,
	undefined,
	typeof personaAuthConfig
>;

export type PersonaKeyBuilderContext = KeyBuilderContext<
	PersonaPluginOptions,
	typeof personaAuthConfig
>;

export type PersonaBoundEndpoints = BindEndpoints<
	typeof personaEndpointsNested
>;

type PersonaEndpoint<K extends keyof PersonaEndpointOutputs> = CorsairEndpoint<
	PersonaContext,
	PersonaEndpointInputs[K],
	PersonaEndpointOutputs[K]
>;

export type PersonaEndpoints = {
	[K in keyof PersonaEndpointOutputs]: PersonaEndpoint<K>;
};

export type PersonaBoundWebhooks = BindWebhooks<typeof personaWebhooksNested>;

const personaEndpointsNested = {
	accounts: {
		list: Accounts.list,
		get: Accounts.get,
		create: Accounts.create,
		update: Accounts.update,
		redact: Accounts.redact,
		search: Accounts.search,
		addTag: Accounts.addTag,
		removeTag: Accounts.removeTag,
	},
	inquiries: {
		list: Inquiries.list,
		get: Inquiries.get,
		create: Inquiries.create,
		update: Inquiries.update,
		redact: Inquiries.redact,
		approve: Inquiries.approve,
		decline: Inquiries.decline,
		markForReview: Inquiries.markForReview,
		generateOneTimeLink: Inquiries.generateOneTimeLink,
		addTag: Inquiries.addTag,
		removeTag: Inquiries.removeTag,
	},
	inquirySessions: {
		create: InquirySessions.create,
		get: InquirySessions.get,
		expire: InquirySessions.expire,
		expireAll: InquirySessions.expireAll,
		generateOneTimeLink: InquirySessions.generateOneTimeLink,
	},
	inquiryTemplates: {
		list: InquiryTemplates.list,
		get: InquiryTemplates.get,
		listVersions: InquiryTemplates.listVersions,
	},
	webhooks: {
		list: Webhooks.list,
		create: Webhooks.create,
		get: Webhooks.get,
		update: Webhooks.update,
		enable: Webhooks.enable,
		disable: Webhooks.disable,
		archive: Webhooks.archive,
		rotateSecret: Webhooks.rotateSecret,
		searchEvents: Webhooks.searchEvents,
	},
} as const;

export const personaWebhooksNested = {
	persona: {
		event,
	},
} as const;

export const personaEndpointSchemas = {
	'accounts.list': {
		input: PersonaEndpointInputSchemas.accountsList,
		output: PersonaEndpointOutputSchemas.accountsList,
	},
	'accounts.get': {
		input: PersonaEndpointInputSchemas.accountsGet,
		output: PersonaEndpointOutputSchemas.accountsGet,
	},
	'accounts.create': {
		input: PersonaEndpointInputSchemas.accountsCreate,
		output: PersonaEndpointOutputSchemas.accountsCreate,
	},
	'accounts.update': {
		input: PersonaEndpointInputSchemas.accountsUpdate,
		output: PersonaEndpointOutputSchemas.accountsUpdate,
	},
	'accounts.redact': {
		input: PersonaEndpointInputSchemas.accountsRedact,
		output: PersonaEndpointOutputSchemas.accountsRedact,
	},
	'accounts.search': {
		input: PersonaEndpointInputSchemas.accountsSearch,
		output: PersonaEndpointOutputSchemas.accountsSearch,
	},
	'accounts.addTag': {
		input: PersonaEndpointInputSchemas.accountsAddTag,
		output: PersonaEndpointOutputSchemas.accountsAddTag,
	},
	'accounts.removeTag': {
		input: PersonaEndpointInputSchemas.accountsRemoveTag,
		output: PersonaEndpointOutputSchemas.accountsRemoveTag,
	},
	'inquiries.list': {
		input: PersonaEndpointInputSchemas.inquiriesList,
		output: PersonaEndpointOutputSchemas.inquiriesList,
	},
	'inquiries.get': {
		input: PersonaEndpointInputSchemas.inquiriesGet,
		output: PersonaEndpointOutputSchemas.inquiriesGet,
	},
	'inquiries.create': {
		input: PersonaEndpointInputSchemas.inquiriesCreate,
		output: PersonaEndpointOutputSchemas.inquiriesCreate,
	},
	'inquiries.update': {
		input: PersonaEndpointInputSchemas.inquiriesUpdate,
		output: PersonaEndpointOutputSchemas.inquiriesUpdate,
	},
	'inquiries.redact': {
		input: PersonaEndpointInputSchemas.inquiriesRedact,
		output: PersonaEndpointOutputSchemas.inquiriesRedact,
	},
	'inquiries.approve': {
		input: PersonaEndpointInputSchemas.inquiriesApprove,
		output: PersonaEndpointOutputSchemas.inquiriesApprove,
	},
	'inquiries.decline': {
		input: PersonaEndpointInputSchemas.inquiriesDecline,
		output: PersonaEndpointOutputSchemas.inquiriesDecline,
	},
	'inquiries.markForReview': {
		input: PersonaEndpointInputSchemas.inquiriesMarkForReview,
		output: PersonaEndpointOutputSchemas.inquiriesMarkForReview,
	},
	'inquiries.generateOneTimeLink': {
		input: PersonaEndpointInputSchemas.inquiriesGenerateOneTimeLink,
		output: PersonaEndpointOutputSchemas.inquiriesGenerateOneTimeLink,
	},
	'inquiries.addTag': {
		input: PersonaEndpointInputSchemas.inquiriesAddTag,
		output: PersonaEndpointOutputSchemas.inquiriesAddTag,
	},
	'inquiries.removeTag': {
		input: PersonaEndpointInputSchemas.inquiriesRemoveTag,
		output: PersonaEndpointOutputSchemas.inquiriesRemoveTag,
	},
	'inquirySessions.create': {
		input: PersonaEndpointInputSchemas.inquirySessionsCreate,
		output: PersonaEndpointOutputSchemas.inquirySessionsCreate,
	},
	'inquirySessions.get': {
		input: PersonaEndpointInputSchemas.inquirySessionsGet,
		output: PersonaEndpointOutputSchemas.inquirySessionsGet,
	},
	'inquirySessions.expire': {
		input: PersonaEndpointInputSchemas.inquirySessionsExpire,
		output: PersonaEndpointOutputSchemas.inquirySessionsExpire,
	},
	'inquirySessions.expireAll': {
		input: PersonaEndpointInputSchemas.inquirySessionsExpireAll,
		output: PersonaEndpointOutputSchemas.inquirySessionsExpireAll,
	},
	'inquirySessions.generateOneTimeLink': {
		input: PersonaEndpointInputSchemas.inquirySessionsGenerateOneTimeLink,
		output: PersonaEndpointOutputSchemas.inquirySessionsGenerateOneTimeLink,
	},
	'inquiryTemplates.list': {
		input: PersonaEndpointInputSchemas.inquiryTemplatesList,
		output: PersonaEndpointOutputSchemas.inquiryTemplatesList,
	},
	'inquiryTemplates.get': {
		input: PersonaEndpointInputSchemas.inquiryTemplatesGet,
		output: PersonaEndpointOutputSchemas.inquiryTemplatesGet,
	},
	'inquiryTemplates.listVersions': {
		input: PersonaEndpointInputSchemas.inquiryTemplateVersionsList,
		output: PersonaEndpointOutputSchemas.inquiryTemplateVersionsList,
	},
	'webhooks.list': {
		input: PersonaEndpointInputSchemas.webhooksList,
		output: PersonaEndpointOutputSchemas.webhooksList,
	},
	'webhooks.create': {
		input: PersonaEndpointInputSchemas.webhooksCreate,
		output: PersonaEndpointOutputSchemas.webhooksCreate,
	},
	'webhooks.get': {
		input: PersonaEndpointInputSchemas.webhooksGet,
		output: PersonaEndpointOutputSchemas.webhooksGet,
	},
	'webhooks.update': {
		input: PersonaEndpointInputSchemas.webhooksUpdate,
		output: PersonaEndpointOutputSchemas.webhooksUpdate,
	},
	'webhooks.enable': {
		input: PersonaEndpointInputSchemas.webhooksEnable,
		output: PersonaEndpointOutputSchemas.webhooksEnable,
	},
	'webhooks.disable': {
		input: PersonaEndpointInputSchemas.webhooksDisable,
		output: PersonaEndpointOutputSchemas.webhooksDisable,
	},
	'webhooks.archive': {
		input: PersonaEndpointInputSchemas.webhooksArchive,
		output: PersonaEndpointOutputSchemas.webhooksArchive,
	},
	'webhooks.rotateSecret': {
		input: PersonaEndpointInputSchemas.webhooksRotateSecret,
		output: PersonaEndpointOutputSchemas.webhooksRotateSecret,
	},
	'webhooks.searchEvents': {
		input: PersonaEndpointInputSchemas.webhookEventsSearch,
		output: PersonaEndpointOutputSchemas.webhookEventsSearch,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof personaEndpointsNested
>;

const personaWebhookSchemas = {
	'persona.event': {
		description: 'A Persona webhook delivery: an inquiry or verification event',
		payload: PersonaEventSchema,
		response: PersonaEventSchema,
	},
} as const satisfies RequiredPluginWebhookSchemas<typeof personaWebhooksNested>;

const personaEndpointMeta = {
	'accounts.list': {
		riskLevel: 'read',
		description: 'List accounts, filtered by reference id, page by page',
	},
	'accounts.get': {
		riskLevel: 'read',
		description: 'Read one account by id',
	},
	'accounts.create': {
		riskLevel: 'write',
		description: 'Create an account',
	},
	'accounts.update': {
		riskLevel: 'write',
		description: "Update an account's attributes, status or tags",
	},
	'accounts.redact': {
		riskLevel: 'destructive',
		description: 'Redact an account; the data is permanently removed',
		irreversible: true,
	},
	'accounts.search': {
		riskLevel: 'read',
		description: 'Search accounts with a predicate query',
	},
	'accounts.addTag': {
		riskLevel: 'write',
		description: 'Add a tag to an account',
	},
	'accounts.removeTag': {
		riskLevel: 'write',
		description: 'Remove a tag from an account',
	},
	'inquiries.list': {
		riskLevel: 'read',
		description:
			'List inquiries filtered by status, account, reference or template',
	},
	'inquiries.get': {
		riskLevel: 'read',
		description: 'Read one inquiry by id',
	},
	'inquiries.create': {
		riskLevel: 'write',
		description: 'Create an inquiry from a template',
	},
	'inquiries.update': {
		riskLevel: 'write',
		description: 'Update inquiry attributes',
	},
	'inquiries.redact': {
		riskLevel: 'destructive',
		description: 'Redact an inquiry; the data is permanently removed',
		irreversible: true,
	},
	'inquiries.approve': {
		riskLevel: 'destructive',
		description:
			'Approve an inquiry; the decision is final and runs any approval workflow',
		irreversible: true,
	},
	'inquiries.decline': {
		riskLevel: 'destructive',
		description: 'Decline an inquiry; the decision is final',
		irreversible: true,
	},
	'inquiries.markForReview': {
		riskLevel: 'write',
		description: 'Mark an inquiry for manual review',
	},
	'inquiries.generateOneTimeLink': {
		riskLevel: 'write',
		description:
			'Generate a one-time link for an inquiry; anyone with the link can resume it',
	},
	'inquiries.addTag': {
		riskLevel: 'write',
		description: 'Add a tag to an inquiry',
	},
	'inquiries.removeTag': {
		riskLevel: 'write',
		description: 'Remove a tag from an inquiry',
	},
	'inquirySessions.create': {
		riskLevel: 'write',
		description: 'Create a session for an inquiry',
	},
	'inquirySessions.get': {
		riskLevel: 'read',
		description: 'Read one inquiry session',
	},
	'inquirySessions.expire': {
		riskLevel: 'write',
		description: 'Expire one inquiry session',
	},
	'inquirySessions.expireAll': {
		riskLevel: 'destructive',
		description: 'Expire every session of the given inquiries',
		irreversible: true,
	},
	'inquirySessions.generateOneTimeLink': {
		riskLevel: 'write',
		description: 'Generate a one-time link for an inquiry session',
	},
	'inquiryTemplates.list': {
		riskLevel: 'read',
		description: 'List the inquiry templates',
	},
	'inquiryTemplates.get': {
		riskLevel: 'read',
		description: 'Read one inquiry template',
	},
	'inquiryTemplates.listVersions': {
		riskLevel: 'read',
		description: 'List the versions of one inquiry template',
	},
	'webhooks.list': {
		riskLevel: 'read',
		description: 'List the webhooks',
	},
	'webhooks.create': {
		riskLevel: 'write',
		description: 'Create a webhook; the answer carries its signing secret',
	},
	'webhooks.get': {
		riskLevel: 'read',
		description: 'Read one webhook',
	},
	'webhooks.update': {
		riskLevel: 'write',
		description: 'Update a webhook URL, name or subscribed events',
	},
	'webhooks.enable': {
		riskLevel: 'write',
		description: 'Enable a webhook',
	},
	'webhooks.disable': {
		riskLevel: 'write',
		description: 'Disable a webhook; deliveries stop until it is enabled again',
	},
	'webhooks.archive': {
		riskLevel: 'destructive',
		description: 'Archive a webhook; archived webhooks cannot be re-enabled',
		irreversible: true,
	},
	'webhooks.rotateSecret': {
		riskLevel: 'destructive',
		description:
			'Rotate the webhook signing secret; the old one stops signing once its window ends',
		irreversible: true,
	},
	'webhooks.searchEvents': {
		riskLevel: 'read',
		description: 'Search recorded webhook events',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof personaEndpointsNested>;

const defaultAuthType: AuthTypes = 'api_key' as const;

export const personaAuthConfig = {
	api_key: {
		// Persona issues one API key per environment (sandbox/production); no
		// account-level field is needed beside it.
		account: [] as const,
	},
} as const satisfies PluginAuthConfig;

export type BasePersonaPlugin<T extends PersonaPluginOptions> = CorsairPlugin<
	'persona',
	typeof PersonaSchema,
	typeof personaEndpointsNested,
	typeof personaWebhooksNested,
	T,
	typeof defaultAuthType,
	typeof personaAuthConfig
>;

export type InternalPersonaPlugin = BasePersonaPlugin<PersonaPluginOptions>;

export type ExternalPersonaPlugin<T extends PersonaPluginOptions> =
	BasePersonaPlugin<T>;

export function persona<const T extends PersonaPluginOptions>(
	incomingOptions: PersonaPluginOptions & T = {} as PersonaPluginOptions & T,
): ExternalPersonaPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'persona',
		authConfig: personaAuthConfig,
		schema: PersonaSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: personaEndpointsNested,
		webhooks: personaWebhooksNested,
		endpointMeta: personaEndpointMeta,
		endpointSchemas: personaEndpointSchemas,
		webhookSchemas: personaWebhookSchemas,
		pluginWebhookMatcher: matchPersonaWebhook,
		errorHandlers: mergeErrorHandlers(errorHandlers, options.errorHandlers),
		keyBuilder: async (ctx: PersonaKeyBuilderContext, source) => {
			if (source === 'webhook') {
				// Deliveries are HMAC-signed with the per-webhook secret; an
				// empty secret makes the handler reject deliveries with 401
				// rather than accept them unverified.
				if (options.webhookSecret) return options.webhookSecret;
				const stored = await ctx.keys.get_webhook_signature();
				return stored ?? '';
			}

			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (res) return res;
			}

			throw new AuthMissingError('persona', ctx.authType ?? 'api_key');
		},
	} satisfies InternalPersonaPlugin;
}

export { DEFAULT_API_VERSION } from './client';

export type {
	Account,
	Inquiry,
	InquirySession,
	InquiryTemplate,
	PersonaEndpointInputs,
	PersonaEndpointOutputs,
	WebhookConfig,
} from './endpoints/types';
export type { PersonaWebhookPayload } from './webhooks/types';
export { matchPersonaWebhook, verifyPersonaWebhook } from './webhooks/types';
