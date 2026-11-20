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
import { Passes, Templates, Webhooks } from './endpoints';
import type {
	PasscreatorEndpointInputs,
	PasscreatorEndpointOutputs,
} from './endpoints/types';
import {
	PasscreatorEndpointInputSchemas,
	PasscreatorEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';
import { PasscreatorSchema } from './schema';
import { event } from './webhooks';
import {
	matchPasscreatorWebhook,
	PasscreatorEventSchema,
} from './webhooks/types';

export type PasscreatorPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	/** PEM public key used to verify webhook delivery signatures. */
	webhookSecret?: string;
	hooks?: InternalPasscreatorPlugin['hooks'];
	webhookHooks?: InternalPasscreatorPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof passcreatorEndpointsNested>;
};

export type PasscreatorContext = CorsairPluginContext<
	typeof PasscreatorSchema,
	PasscreatorPluginOptions,
	undefined,
	typeof passcreatorAuthConfig
>;

export type PasscreatorKeyBuilderContext = KeyBuilderContext<
	PasscreatorPluginOptions,
	typeof passcreatorAuthConfig
>;

export type PasscreatorBoundEndpoints = BindEndpoints<
	typeof passcreatorEndpointsNested
>;

type PasscreatorEndpoint<K extends keyof PasscreatorEndpointOutputs> =
	CorsairEndpoint<
		PasscreatorContext,
		PasscreatorEndpointInputs[K],
		PasscreatorEndpointOutputs[K]
	>;

export type PasscreatorEndpoints = {
	[K in keyof PasscreatorEndpointOutputs]: PasscreatorEndpoint<K>;
};

export type PasscreatorBoundWebhooks = BindWebhooks<
	typeof passcreatorWebhooksNested
>;

const passcreatorEndpointsNested = {
	passes: {
		create: Passes.create,
		list: Passes.list,
		get: Passes.get,
		update: Passes.update,
		delete: Passes.remove,
		search: Passes.search,
		uris: Passes.uris,
		statistics: Passes.statistics,
		activeHistory: Passes.activeHistory,
		enableDownload: Passes.enableDownload,
		pushNotification: Passes.pushNotification,
		sendEmail: Passes.sendEmail,
	},
	templates: {
		list: Templates.list,
		fields: Templates.fields,
		copy: Templates.copy,
		delete: Templates.remove,
		movePass: Templates.movePass,
	},
	webhooks: {
		subscribe: Webhooks.subscribe,
		unsubscribe: Webhooks.unsubscribe,
		list: Webhooks.list,
		getPublicKey: Webhooks.getPublicKey,
	},
} as const;

export const passcreatorWebhooksNested = {
	passcreator: {
		event,
	},
} as const;

export const passcreatorEndpointSchemas = {
	'passes.create': {
		input: PasscreatorEndpointInputSchemas.passesCreate,
		output: PasscreatorEndpointOutputSchemas.passesCreate,
	},
	'passes.list': {
		input: PasscreatorEndpointInputSchemas.passesList,
		output: PasscreatorEndpointOutputSchemas.passesList,
	},
	'passes.get': {
		input: PasscreatorEndpointInputSchemas.passesGet,
		output: PasscreatorEndpointOutputSchemas.passesGet,
	},
	'passes.update': {
		input: PasscreatorEndpointInputSchemas.passesUpdate,
		output: PasscreatorEndpointOutputSchemas.passesUpdate,
	},
	'passes.delete': {
		input: PasscreatorEndpointInputSchemas.passesDelete,
		output: PasscreatorEndpointOutputSchemas.passesDelete,
	},
	'passes.search': {
		input: PasscreatorEndpointInputSchemas.passesSearch,
		output: PasscreatorEndpointOutputSchemas.passesSearch,
	},
	'passes.uris': {
		input: PasscreatorEndpointInputSchemas.passesUris,
		output: PasscreatorEndpointOutputSchemas.passesUris,
	},
	'passes.statistics': {
		input: PasscreatorEndpointInputSchemas.passesStatistics,
		output: PasscreatorEndpointOutputSchemas.passesStatistics,
	},
	'passes.activeHistory': {
		input: PasscreatorEndpointInputSchemas.passesActiveHistory,
		output: PasscreatorEndpointOutputSchemas.passesActiveHistory,
	},
	'passes.enableDownload': {
		input: PasscreatorEndpointInputSchemas.passesEnableDownload,
		output: PasscreatorEndpointOutputSchemas.passesEnableDownload,
	},
	'passes.pushNotification': {
		input: PasscreatorEndpointInputSchemas.passesPushNotification,
		output: PasscreatorEndpointOutputSchemas.passesPushNotification,
	},
	'passes.sendEmail': {
		input: PasscreatorEndpointInputSchemas.passesSendEmail,
		output: PasscreatorEndpointOutputSchemas.passesSendEmail,
	},
	'templates.list': {
		input: PasscreatorEndpointInputSchemas.templatesList,
		output: PasscreatorEndpointOutputSchemas.templatesList,
	},
	'templates.fields': {
		input: PasscreatorEndpointInputSchemas.templatesFields,
		output: PasscreatorEndpointOutputSchemas.templatesFields,
	},
	'templates.copy': {
		input: PasscreatorEndpointInputSchemas.templatesCopy,
		output: PasscreatorEndpointOutputSchemas.templatesCopy,
	},
	'templates.delete': {
		input: PasscreatorEndpointInputSchemas.templatesDelete,
		output: PasscreatorEndpointOutputSchemas.templatesDelete,
	},
	'templates.movePass': {
		input: PasscreatorEndpointInputSchemas.templatesMovePass,
		output: PasscreatorEndpointOutputSchemas.templatesMovePass,
	},
	'webhooks.subscribe': {
		input: PasscreatorEndpointInputSchemas.webhooksSubscribe,
		output: PasscreatorEndpointOutputSchemas.webhooksSubscribe,
	},
	'webhooks.unsubscribe': {
		input: PasscreatorEndpointInputSchemas.webhooksUnsubscribe,
		output: PasscreatorEndpointOutputSchemas.webhooksUnsubscribe,
	},
	'webhooks.list': {
		input: PasscreatorEndpointInputSchemas.webhooksList,
		output: PasscreatorEndpointOutputSchemas.webhooksList,
	},
	'webhooks.getPublicKey': {
		input: PasscreatorEndpointInputSchemas.webhooksGetPublicKey,
		output: PasscreatorEndpointOutputSchemas.webhooksGetPublicKey,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof passcreatorEndpointsNested
>;

const passcreatorWebhookSchemas = {
	'passcreator.event': {
		description:
			'A Passcreator event delivery: a pass object with its signature',
		payload: PasscreatorEventSchema,
		response: PasscreatorEventSchema,
	},
} as const satisfies RequiredPluginWebhookSchemas<
	typeof passcreatorWebhooksNested
>;

const passcreatorEndpointMeta = {
	'passes.create': {
		riskLevel: 'write',
		description:
			'Create a pass from a pass template with personalised properties',
	},
	'passes.list': {
		riskLevel: 'read',
		description: 'List the passes of a pass template, paged by cursor and date',
	},
	'passes.get': {
		riskLevel: 'read',
		description: 'Read one pass by UID, barcode value or user-provided ID',
	},
	'passes.update': {
		riskLevel: 'write',
		description: 'Update pass properties or mark the pass voided or not voided',
	},
	'passes.delete': {
		riskLevel: 'destructive',
		description: 'Delete a pass',
		irreversible: true,
	},
	'passes.search': {
		riskLevel: 'read',
		description: 'Search the passes of a template by content',
	},
	'passes.uris': {
		riskLevel: 'read',
		description: 'Read the resource URIs of a pass',
	},
	'passes.statistics': {
		riskLevel: 'read',
		description:
			'Read pass usage statistics of a template by day, week or month',
	},
	'passes.activeHistory': {
		riskLevel: 'read',
		description: 'Read the history of active and inactive passes of a template',
	},
	'passes.enableDownload': {
		riskLevel: 'write',
		description: 'Enable the download of a pass',
	},
	'passes.pushNotification': {
		riskLevel: 'destructive',
		description:
			'Push a notification message to one pass holder; the message goes out and cannot be recalled',
		irreversible: true,
	},
	'passes.sendEmail': {
		riskLevel: 'destructive',
		description:
			'Send the pass to an email address; the email goes out and cannot be recalled',
		irreversible: true,
	},
	'templates.list': {
		riskLevel: 'read',
		description: 'List all pass templates of the account',
	},
	'templates.fields': {
		riskLevel: 'read',
		description: 'Read the required and optional fields of a pass template',
	},
	'templates.copy': {
		riskLevel: 'write',
		description: 'Copy a pass template',
	},
	'templates.delete': {
		riskLevel: 'destructive',
		description:
			'Delete a pass template; the API refuses when scheduled tasks exist',
		irreversible: true,
	},
	'templates.movePass': {
		riskLevel: 'write',
		description:
			'Move a pass to a different template of the same project (API v2)',
	},
	'webhooks.subscribe': {
		riskLevel: 'write',
		description:
			'Subscribe a URL to a webhook event, optionally scoped to one template',
	},
	'webhooks.unsubscribe': {
		riskLevel: 'destructive',
		description:
			'Unsubscribe a webhook; deliveries stop until it is subscribed again',
		irreversible: true,
	},
	'webhooks.list': {
		riskLevel: 'read',
		description:
			'List the active webhook subscriptions, including pull-mode entries',
	},
	'webhooks.getPublicKey': {
		riskLevel: 'read',
		description:
			'Read the PEM public key that verifies webhook payload signatures',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof passcreatorEndpointsNested
>;

const defaultAuthType: AuthTypes = 'api_key' as const;

export const passcreatorAuthConfig = {
	api_key: {
		// Passcreator issues one API key per account; no account-level field
		// is needed beside it.
		account: [] as const,
	},
} as const satisfies PluginAuthConfig;

export type BasePasscreatorPlugin<T extends PasscreatorPluginOptions> =
	CorsairPlugin<
		'passcreator',
		typeof PasscreatorSchema,
		typeof passcreatorEndpointsNested,
		typeof passcreatorWebhooksNested,
		T,
		typeof defaultAuthType,
		typeof passcreatorAuthConfig
	>;

export type InternalPasscreatorPlugin =
	BasePasscreatorPlugin<PasscreatorPluginOptions>;

export type ExternalPasscreatorPlugin<T extends PasscreatorPluginOptions> =
	BasePasscreatorPlugin<T>;

export function passcreator<const T extends PasscreatorPluginOptions>(
	incomingOptions: PasscreatorPluginOptions &
		T = {} as PasscreatorPluginOptions & T,
): ExternalPasscreatorPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'passcreator',
		authConfig: passcreatorAuthConfig,
		schema: PasscreatorSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: passcreatorEndpointsNested,
		webhooks: passcreatorWebhooksNested,
		endpointMeta: passcreatorEndpointMeta,
		endpointSchemas: passcreatorEndpointSchemas,
		webhookSchemas: passcreatorWebhookSchemas,
		pluginWebhookMatcher: matchPasscreatorWebhook,
		errorHandlers: mergeErrorHandlers(errorHandlers, options.errorHandlers),
		keyBuilder: async (ctx: PasscreatorKeyBuilderContext, source) => {
			if (source === 'webhook') {
				// Deliveries carry the PEM public key used to verify them; an
				// empty stored key makes the handler reject deliveries with 401
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

			throw new AuthMissingError('passcreator', ctx.authType ?? 'api_key');
		},
	} satisfies InternalPasscreatorPlugin;
}

export { PasscreatorAPIError } from './client';

export type {
	Pass,
	PasscreatorEndpointInputs,
	PasscreatorEndpointOutputs,
	Template,
	WebhookSubscription,
} from './endpoints/types';
export type { PasscreatorWebhookPayload } from './webhooks/types';
export {
	matchPasscreatorWebhook,
	verifyPasscreatorSignature,
} from './webhooks/types';
