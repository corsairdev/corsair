import type {
	AuthTypes,
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
	RawWebhookRequest,
	RequiredPluginEndpointMeta,
	RequiredPluginEndpointSchemas,
	RequiredPluginWebhookSchemas,
} from 'corsair/core';
import { AuthMissingError } from 'corsair/core';
import {
	Domain,
	Email,
	EmailValidation,
	EventDump,
	Suppression,
	System,
	Tag,
	Template,
	Webhook,
} from './endpoints';
import type {
	UnioneEndpointInputs,
	UnioneEndpointOutputs,
} from './endpoints/types';
import {
	UnioneEndpointInputSchemas,
	UnioneEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { UnioneSchema } from './schema';
import { UnioneInboundWebhooks } from './webhooks';
import { matchUnioneTenantWebhook } from './webhooks/tenant-matcher';
import type {
	UnioneWebhookOutputs,
	UnioneWebhookPayload,
} from './webhooks/types';
import { UnioneWebhookPayloadSchema } from './webhooks/types';

export type UnionePluginOptions = {
	/** Authentication method. Only api_key is supported. */
	authType?: PickAuth<'api_key'>;
	/** Optional: pass the API key directly (bypasses key manager) */
	key?: string;
	/** Optional: webhook auth token compared to UniOne payload `auth` field */
	webhookSecret?: string;
	hooks?: InternalUnionePlugin['hooks'];
	webhookHooks?: InternalUnionePlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof unioneEndpointsNested>;
};

export type UnioneContext = CorsairPluginContext<
	typeof UnioneSchema,
	UnionePluginOptions
>;

export type UnioneKeyBuilderContext = KeyBuilderContext<UnionePluginOptions>;

export type UnioneBoundEndpoints = BindEndpoints<typeof unioneEndpointsNested>;

type UnioneEndpoint<K extends keyof UnioneEndpointOutputs> = CorsairEndpoint<
	UnioneContext,
	UnioneEndpointInputs[K],
	UnioneEndpointOutputs[K]
>;

export type UnioneEndpoints = {
	email: {
		schedule: UnioneEndpoint<'emailSchedule'>;
		get: UnioneEndpoint<'emailGet'>;
		eventGet: UnioneEndpoint<'emailEventGet'>;
		cancel: UnioneEndpoint<'emailCancel'>;
		resume: UnioneEndpoint<'emailResume'>;
		resend: UnioneEndpoint<'emailResend'>;
		list: UnioneEndpoint<'emailList'>;
		statistics: UnioneEndpoint<'emailStatistics'>;
		smtp: UnioneEndpoint<'emailSmtp'>;
		subscribe: UnioneEndpoint<'emailSubscribe'>;
		unsubscribe: UnioneEndpoint<'emailUnsubscribe'>;
	};
	emailValidation: {
		batch: UnioneEndpoint<'emailValidateBatch'>;
		retry: UnioneEndpoint<'emailValidateRetry'>;
	};
	eventDump: {
		create: UnioneEndpoint<'eventDumpCreate'>;
		get: UnioneEndpoint<'eventDumpGet'>;
		list: UnioneEndpoint<'eventDumpList'>;
		delete: UnioneEndpoint<'eventDumpDelete'>;
	};
	tag: {
		list: UnioneEndpoint<'tagList'>;
		delete: UnioneEndpoint<'tagDelete'>;
	};
	template: {
		set: UnioneEndpoint<'templateSet'>;
		get: UnioneEndpoint<'templateGet'>;
		list: UnioneEndpoint<'templateList'>;
		delete: UnioneEndpoint<'templateDelete'>;
	};
	webhook: {
		set: UnioneEndpoint<'webhookSet'>;
		get: UnioneEndpoint<'webhookGet'>;
		delete: UnioneEndpoint<'webhookDelete'>;
		types: UnioneEndpoint<'webhookTypes'>;
	};
	suppression: {
		get: UnioneEndpoint<'suppressionGet'>;
		list: UnioneEndpoint<'suppressionList'>;
		delete: UnioneEndpoint<'suppressionDelete'>;
	};
	domain: {
		manage: UnioneEndpoint<'domainManage'>;
	};
	system: {
		info: UnioneEndpoint<'systemInfo'>;
	};
};

type UnioneWebhook<
	K extends keyof UnioneWebhookOutputs,
	TEvent,
> = CorsairWebhook<UnioneContext, TEvent, UnioneWebhookOutputs[K]>;

export type UnioneWebhooks = {
	emailStatus: UnioneWebhook<'emailStatus', UnioneWebhookPayload>;
	spamBlock: UnioneWebhook<'spamBlock', UnioneWebhookPayload>;
};

export type UnioneBoundWebhooks = BindWebhooks<UnioneWebhooks>;

const unioneEndpointsNested = {
	email: {
		schedule: Email.schedule,
		get: Email.get,
		eventGet: Email.eventGet,
		cancel: Email.cancel,
		resume: Email.resume,
		resend: Email.resend,
		list: Email.list,
		statistics: Email.statistics,
		smtp: Email.smtp,
		subscribe: Email.subscribe,
		unsubscribe: Email.unsubscribe,
	},
	emailValidation: {
		batch: EmailValidation.batch,
		retry: EmailValidation.retry,
	},
	eventDump: {
		create: EventDump.create,
		get: EventDump.get,
		list: EventDump.list,
		delete: EventDump.delete,
	},
	tag: {
		list: Tag.list,
		delete: Tag.delete,
	},
	template: {
		set: Template.set,
		get: Template.get,
		list: Template.list,
		delete: Template.delete,
	},
	webhook: {
		set: Webhook.set,
		get: Webhook.get,
		delete: Webhook.delete,
		types: Webhook.types,
	},
	suppression: {
		get: Suppression.get,
		list: Suppression.list,
		delete: Suppression.delete,
	},
	domain: {
		manage: Domain.manage,
	},
	system: {
		info: System.info,
	},
} as const;

const unioneWebhooksNested = {
	emailStatus: UnioneInboundWebhooks.emailStatus,
	spamBlock: UnioneInboundWebhooks.spamBlock,
} as const;

export const unioneEndpointSchemas = {
	'email.schedule': {
		input: UnioneEndpointInputSchemas.emailSchedule,
		output: UnioneEndpointOutputSchemas.emailSchedule,
	},
	'email.get': {
		input: UnioneEndpointInputSchemas.emailGet,
		output: UnioneEndpointOutputSchemas.emailGet,
	},
	'email.eventGet': {
		input: UnioneEndpointInputSchemas.emailEventGet,
		output: UnioneEndpointOutputSchemas.emailEventGet,
	},
	'email.cancel': {
		input: UnioneEndpointInputSchemas.emailCancel,
		output: UnioneEndpointOutputSchemas.emailCancel,
	},
	'email.resume': {
		input: UnioneEndpointInputSchemas.emailResume,
		output: UnioneEndpointOutputSchemas.emailResume,
	},
	'email.resend': {
		input: UnioneEndpointInputSchemas.emailResend,
		output: UnioneEndpointOutputSchemas.emailResend,
	},
	'email.list': {
		input: UnioneEndpointInputSchemas.emailList,
		output: UnioneEndpointOutputSchemas.emailList,
	},
	'email.statistics': {
		input: UnioneEndpointInputSchemas.emailStatistics,
		output: UnioneEndpointOutputSchemas.emailStatistics,
	},
	'email.smtp': {
		input: UnioneEndpointInputSchemas.emailSmtp,
		output: UnioneEndpointOutputSchemas.emailSmtp,
	},
	'email.subscribe': {
		input: UnioneEndpointInputSchemas.emailSubscribe,
		output: UnioneEndpointOutputSchemas.emailSubscribe,
	},
	'email.unsubscribe': {
		input: UnioneEndpointInputSchemas.emailUnsubscribe,
		output: UnioneEndpointOutputSchemas.emailUnsubscribe,
	},
	'emailValidation.batch': {
		input: UnioneEndpointInputSchemas.emailValidateBatch,
		output: UnioneEndpointOutputSchemas.emailValidateBatch,
	},
	'emailValidation.retry': {
		input: UnioneEndpointInputSchemas.emailValidateRetry,
		output: UnioneEndpointOutputSchemas.emailValidateRetry,
	},
	'eventDump.create': {
		input: UnioneEndpointInputSchemas.eventDumpCreate,
		output: UnioneEndpointOutputSchemas.eventDumpCreate,
	},
	'eventDump.get': {
		input: UnioneEndpointInputSchemas.eventDumpGet,
		output: UnioneEndpointOutputSchemas.eventDumpGet,
	},
	'eventDump.list': {
		input: UnioneEndpointInputSchemas.eventDumpList,
		output: UnioneEndpointOutputSchemas.eventDumpList,
	},
	'eventDump.delete': {
		input: UnioneEndpointInputSchemas.eventDumpDelete,
		output: UnioneEndpointOutputSchemas.eventDumpDelete,
	},
	'tag.list': {
		input: UnioneEndpointInputSchemas.tagList,
		output: UnioneEndpointOutputSchemas.tagList,
	},
	'tag.delete': {
		input: UnioneEndpointInputSchemas.tagDelete,
		output: UnioneEndpointOutputSchemas.tagDelete,
	},
	'template.set': {
		input: UnioneEndpointInputSchemas.templateSet,
		output: UnioneEndpointOutputSchemas.templateSet,
	},
	'template.get': {
		input: UnioneEndpointInputSchemas.templateGet,
		output: UnioneEndpointOutputSchemas.templateGet,
	},
	'template.list': {
		input: UnioneEndpointInputSchemas.templateList,
		output: UnioneEndpointOutputSchemas.templateList,
	},
	'template.delete': {
		input: UnioneEndpointInputSchemas.templateDelete,
		output: UnioneEndpointOutputSchemas.templateDelete,
	},
	'webhook.set': {
		input: UnioneEndpointInputSchemas.webhookSet,
		output: UnioneEndpointOutputSchemas.webhookSet,
	},
	'webhook.get': {
		input: UnioneEndpointInputSchemas.webhookGet,
		output: UnioneEndpointOutputSchemas.webhookGet,
	},
	'webhook.delete': {
		input: UnioneEndpointInputSchemas.webhookDelete,
		output: UnioneEndpointOutputSchemas.webhookDelete,
	},
	'webhook.types': {
		input: UnioneEndpointInputSchemas.webhookTypes,
		output: UnioneEndpointOutputSchemas.webhookTypes,
	},
	'suppression.get': {
		input: UnioneEndpointInputSchemas.suppressionGet,
		output: UnioneEndpointOutputSchemas.suppressionGet,
	},
	'suppression.list': {
		input: UnioneEndpointInputSchemas.suppressionList,
		output: UnioneEndpointOutputSchemas.suppressionList,
	},
	'suppression.delete': {
		input: UnioneEndpointInputSchemas.suppressionDelete,
		output: UnioneEndpointOutputSchemas.suppressionDelete,
	},
	'domain.manage': {
		input: UnioneEndpointInputSchemas.domainManage,
		output: UnioneEndpointOutputSchemas.domainManage,
	},
	'system.info': {
		input: UnioneEndpointInputSchemas.systemInfo,
		output: UnioneEndpointOutputSchemas.systemInfo,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof unioneEndpointsNested
>;

const unioneWebhookSchemas = {
	emailStatus: {
		description: 'Transactional email status events from UniOne',
		payload: UnioneWebhookPayloadSchema,
		response: UnioneWebhookPayloadSchema,
	},
	spamBlock: {
		description: 'SMTP spam-block events from UniOne',
		payload: UnioneWebhookPayloadSchema,
		response: UnioneWebhookPayloadSchema,
	},
} as const satisfies RequiredPluginWebhookSchemas<typeof unioneWebhooksNested>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const unioneEndpointMeta = {
	'email.schedule': {
		riskLevel: 'write',
		description:
			'Tool to schedule a transactional email up to 24 hours ahead. Use when you need to send an email at a specific future time.',
	},
	'email.get': {
		riskLevel: 'read',
		description:
			'Tool to retrieve detailed information about a specific email send job. Use when you need its delivery metrics and history.',
	},
	'email.eventGet': {
		riskLevel: 'read',
		description:
			'Tool to retrieve details of a specific email event by its ID. Use when you need event information for auditing or diagnostics.',
	},
	'email.cancel': {
		riskLevel: 'destructive',
		description:
			'Tool to cancel a scheduled transactional email by its job ID. Use when you need to stop a pending email send before it is dispatched.',
	},
	'email.resume': {
		riskLevel: 'write',
		description:
			'Tool to resume a paused transactional email by its job ID. Use when you need to restart a paused pending email send.',
	},
	'email.resend': {
		riskLevel: 'write',
		description:
			'Tool to resend a previously sent email by its job ID. Use when you need to trigger a resend of an email that has already been sent and you have the original job ID.',
	},
	'email.list': {
		riskLevel: 'read',
		description:
			'Tool to export email events within a specified time frame. It creates an asynchronous event dump which can later be downloaded and parsed using eventDump.get.',
	},
	'email.statistics': {
		riskLevel: 'read',
		description:
			'Tool to retrieve email sending statistics over a specified time range. This action uses UniOne event-dump aggregate API under the hood to compute daily statistics.',
	},
	'email.smtp': {
		riskLevel: 'read',
		description:
			'Tool to retrieve SMTP server details and credentials. Use when you need to configure your mail client or library for SMTP sending.',
	},
	'email.subscribe': {
		riskLevel: 'write',
		description:
			'Tool to resubscribe a recipient who previously unsubscribed. Use when you need to restore a user subscription status after they opt in again.',
	},
	'email.unsubscribe': {
		riskLevel: 'write',
		description:
			'Tool to unsubscribe an email from future emails. Use when you need to stop all further transactional emails.',
	},
	'emailValidation.batch': {
		riskLevel: 'read',
		description:
			'Tool to validate multiple email addresses in a batch. Use when you need to verify deliverability for a list of emails at once.',
	},
	'emailValidation.retry': {
		riskLevel: 'read',
		description:
			'Tool to retry an email validation request. Re-runs validation via the official single validation endpoint using the provided email address.',
	},
	'eventDump.create': {
		riskLevel: 'write',
		description:
			'Tool to create an asynchronous CSV event dump. Use when you need to export transactional email events for a specified time window.',
	},
	'eventDump.get': {
		riskLevel: 'read',
		description:
			'Tool to retrieve the status and download URLs of an event dump. Use when you need to check if a dump is ready and get its files.',
	},
	'eventDump.list': {
		riskLevel: 'read',
		description:
			'Tool to retrieve the full list of event dumps. Use when you need to view all existing event-dump tasks.',
	},
	'eventDump.delete': {
		riskLevel: 'destructive',
		description:
			'Tool to delete an event dump file and remove it from the queue or storage. Use when you need to clean up an existing event dump by its dump_id.',
	},
	'tag.list': {
		riskLevel: 'read',
		description:
			'Tool to retrieve all user-defined tags. Use when you need to fetch the full list of tags after authentication.',
	},
	'tag.delete': {
		riskLevel: 'destructive',
		description:
			'Tool to delete a specific tag. Use when you have confirmed the tag ID you wish to remove.',
	},
	'template.set': {
		riskLevel: 'write',
		description:
			'Tool to set or update an email template. Use when you need to create or modify transactional email templates before sending messages.',
	},
	'template.get': {
		riskLevel: 'read',
		description:
			'Tool to get template properties by ID. Use when you need to retrieve the full template configuration and content for a specific template.',
	},
	'template.list': {
		riskLevel: 'read',
		description:
			'Tool to list email templates. Use when you need to retrieve available templates for transactional emails.',
	},
	'template.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Tool to delete a template by ID. Use when you need to permanently remove a template from the account.',
	},
	'webhook.set': {
		riskLevel: 'write',
		description:
			'Tool to set or edit a webhook event notification handler. Use when you need to configure your webhook for event callbacks.',
	},
	'webhook.get': {
		riskLevel: 'read',
		description:
			'Tool to retrieve webhook configuration by its URL. Use when you need to check the current settings of an event notification handler.',
	},
	'webhook.delete': {
		riskLevel: 'destructive',
		description:
			'Tool to delete a webhook event notification handler by its URL. Use when you need to stop receiving callback notifications for a specific webhook.',
	},
	'webhook.types': {
		riskLevel: 'read',
		description:
			'Tool to retrieve supported email webhook event types. Use when configuring your webhook callbacks.',
	},
	'suppression.get': {
		riskLevel: 'read',
		description:
			'Tool to check if an email is suppressed and retrieve the reason and date. Use when verifying why an email cannot receive messages.',
	},
	'suppression.list': {
		riskLevel: 'read',
		description:
			'Tool to return the suppression list since a given date. Use when auditing bounced, unsubscribed, or blocked recipients.',
	},
	'suppression.delete': {
		riskLevel: 'write',
		description:
			'Tool to remove an email from the suppression list. Use when you need to re-enable sending emails to an address that was previously unsubscribed or suppressed.',
	},
	'domain.manage': {
		riskLevel: 'write',
		description:
			'Tool to manage sender domains in UniOne. Use when you need DNS records for verification, trigger verification or DKIM checks, list domains, or delete a domain.',
	},
	'system.info': {
		riskLevel: 'read',
		description:
			'Tool to retrieve current account balance. Use when you need to check your email usage and limits before sending large campaigns.',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof unioneEndpointsNested>;

export const unioneAuthConfig = {
	api_key: {
		account: ['user_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseUnionePlugin<T extends UnionePluginOptions> = CorsairPlugin<
	'unione',
	typeof UnioneSchema,
	typeof unioneEndpointsNested,
	typeof unioneWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalUnionePlugin = BaseUnionePlugin<UnionePluginOptions>;

export type ExternalUnionePlugin<T extends UnionePluginOptions> =
	BaseUnionePlugin<T>;

function matchUnioneWebhook(request: RawWebhookRequest): boolean {
	const headers = request.headers;
	if ('x-unione-auth' in headers) return true;
	const body = request.body;
	if (typeof body === 'string') {
		return body.includes('events_by_user') || body.includes('"auth"');
	}
	if (body !== null && typeof body === 'object' && !Array.isArray(body)) {
		return 'events_by_user' in body || 'auth' in body;
	}
	return false;
}

export function unione<const T extends UnionePluginOptions>(
	incomingOptions: UnionePluginOptions & T = {} as UnionePluginOptions & T,
): ExternalUnionePlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'unione',
		authConfig: unioneAuthConfig,
		schema: UnioneSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: unioneEndpointsNested,
		webhooks: unioneWebhooksNested,
		endpointMeta: unioneEndpointMeta,
		endpointSchemas: unioneEndpointSchemas,
		webhookSchemas: unioneWebhookSchemas,
		pluginWebhookMatcher: matchUnioneWebhook,
		pluginTenantWebhookMatcher: matchUnioneTenantWebhook,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: UnioneKeyBuilderContext, source) => {
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
				if (!res) {
					throw new AuthMissingError('unione', 'api_key');
				}
				return res;
			}

			throw new AuthMissingError('unione', 'api_key');
		},
	} satisfies InternalUnionePlugin;
}

export type {
	UnioneEndpointInputs,
	UnioneEndpointOutputs,
} from './endpoints/types';
export type {
	UnioneWebhookOutputs,
	UnioneWebhookPayload,
} from './webhooks/types';
