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
import {
	UNIONE_EVENT_NAMES,
	UnioneWebhookPayloadSchema,
} from './webhooks/types';

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
		send: UnioneEndpoint<'emailSend'>;
		schedule: UnioneEndpoint<'emailSchedule'>;
		list: UnioneEndpoint<'emailList'>;
		statistics: UnioneEndpoint<'emailStatistics'>;
		subscribe: UnioneEndpoint<'emailSubscribe'>;
		unsubscribe: UnioneEndpoint<'emailUnsubscribe'>;
	};
	emailValidation: {
		batch: UnioneEndpoint<'emailValidateBatch'>;
	};
	eventDump: {
		create: UnioneEndpoint<'eventDumpCreate'>;
		createForJob: UnioneEndpoint<'eventDumpCreateForJob'>;
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
		list: UnioneEndpoint<'webhookList'>;
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
		delete: UnioneEndpoint<'domainDelete'>;
	};
	system: {
		info: UnioneEndpoint<'systemInfo'>;
		ping: UnioneEndpoint<'systemPing'>;
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
		send: Email.send,
		schedule: Email.schedule,
		list: Email.list,
		statistics: Email.statistics,
		subscribe: Email.subscribe,
		unsubscribe: Email.unsubscribe,
	},
	emailValidation: {
		batch: EmailValidation.batch,
	},
	eventDump: {
		create: EventDump.create,
		createForJob: EventDump.createForJob,
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
		list: Webhook.list,
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
		delete: Domain.delete,
	},
	system: {
		info: System.info,
		ping: System.ping,
	},
} as const;

const unioneWebhooksNested = {
	emailStatus: UnioneInboundWebhooks.emailStatus,
	spamBlock: UnioneInboundWebhooks.spamBlock,
} as const;

export const unioneEndpointSchemas = {
	'email.send': {
		input: UnioneEndpointInputSchemas.emailSend,
		output: UnioneEndpointOutputSchemas.emailSend,
	},
	'email.schedule': {
		input: UnioneEndpointInputSchemas.emailSchedule,
		output: UnioneEndpointOutputSchemas.emailSchedule,
	},
	'email.list': {
		input: UnioneEndpointInputSchemas.emailList,
		output: UnioneEndpointOutputSchemas.emailList,
	},
	'email.statistics': {
		input: UnioneEndpointInputSchemas.emailStatistics,
		output: UnioneEndpointOutputSchemas.emailStatistics,
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
	'eventDump.create': {
		input: UnioneEndpointInputSchemas.eventDumpCreate,
		output: UnioneEndpointOutputSchemas.eventDumpCreate,
	},
	'eventDump.createForJob': {
		input: UnioneEndpointInputSchemas.eventDumpCreateForJob,
		output: UnioneEndpointOutputSchemas.eventDumpCreateForJob,
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
	'webhook.list': {
		input: UnioneEndpointInputSchemas.webhookList,
		output: UnioneEndpointOutputSchemas.webhookList,
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
	'domain.delete': {
		input: UnioneEndpointInputSchemas.domainDelete,
		output: UnioneEndpointOutputSchemas.domainDelete,
	},
	'system.info': {
		input: UnioneEndpointInputSchemas.systemInfo,
		output: UnioneEndpointOutputSchemas.systemInfo,
	},
	'system.ping': {
		input: UnioneEndpointInputSchemas.systemPing,
		output: UnioneEndpointOutputSchemas.systemPing,
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
	'email.send': {
		riskLevel: 'write',
		description:
			'Tool to send a transactional email immediately. Requires recipients, from_email, subject, and either a body or a template_id.',
	},
	'email.schedule': {
		riskLevel: 'write',
		description:
			'Tool to send a transactional email at a future time, at most 24 hours ahead. Same as email.send plus a send_at timestamp.',
	},
	'email.list': {
		riskLevel: 'write',
		description:
			'Tool to start an export of email events in a time range. Creates an asynchronous event dump and returns a dump_id; poll eventDump.get for the download URLs. It does not return events directly.',
	},
	'email.statistics': {
		riskLevel: 'write',
		description:
			'Tool to start a per-day aggregate export of send statistics. Creates an asynchronous event dump and returns a dump_id; poll eventDump.get for the result. It does not return statistics directly.',
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
			'Tool to validate a list of email addresses. UniOne has no bulk method, so each address costs one validation from the account quota. Addresses that fail are returned with status "error" rather than failing the whole batch.',
	},
	'eventDump.create': {
		riskLevel: 'write',
		description:
			'Tool to create an asynchronous CSV event dump. Use when you need to export transactional email events for a specified time window.',
	},
	'eventDump.createForJob': {
		riskLevel: 'write',
		description:
			'Tool to export the delivery events of one send job. UniOne has no method that reads a job directly, so this creates an event dump filtered by job_id and returns a dump_id to poll with eventDump.get.',
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
	'webhook.list': {
		riskLevel: 'read',
		description:
			'Tool to list every webhook configured on the account. Use when you need to see all event notification handlers and their settings.',
	},
	'webhook.delete': {
		riskLevel: 'destructive',
		description:
			'Tool to delete a webhook event notification handler by its URL. Use when you need to stop receiving callback notifications for a specific webhook.',
	},
	'webhook.types': {
		riskLevel: 'read',
		description:
			'Tool to list the event names accepted by webhook.set. Returns a static list published in the UniOne callback docs; it makes no API call.',
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
			'Tool to inspect and verify sender domains: fetch DNS records, trigger a verification or DKIM check, or list domains. Deleting a domain is a separate tool.',
	},
	'domain.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Tool to delete a sender domain from the account. Use only when you are certain: the domain must be re-added and re-verified to send from it again.',
	},
	'system.info': {
		riskLevel: 'read',
		description:
			'Tool to retrieve account details and the current billing period: emails included and sent, validations included and used. Use before sending large campaigns.',
	},
	'system.ping': {
		riskLevel: 'read',
		description:
			'Tool to check API connectivity and that the API key is accepted. Use as a health check before a batch of operations.',
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

/**
 * A bare `auth` field is far too generic to claim a request by - other
 * providers send one too, and claiming it here would swallow their traffic
 * before their own plugin sees it. Match only on the UniOne envelope:
 * `events_by_user` carrying one of the documented event names.
 */
export function matchUnioneWebhook(request: RawWebhookRequest): boolean {
	// No header shortcut: `x-unione-auth` is trivially set by any caller, so
	// treating it as sufficient would let unrelated traffic be claimed here and
	// never reach the plugin it belongs to. The body shape is the only signal.
	const body = request.body;
	const parsed =
		typeof body === 'string'
			? (() => {
					try {
						return JSON.parse(body) as unknown;
					} catch {
						return null;
					}
				})()
			: body;

	if (parsed === null || typeof parsed !== 'object' || Array.isArray(parsed)) {
		return false;
	}
	const users = (parsed as { events_by_user?: unknown }).events_by_user;
	if (!Array.isArray(users)) return false;

	return users.some(
		(user) =>
			user !== null &&
			typeof user === 'object' &&
			Array.isArray((user as { events?: unknown }).events) &&
			(user as { events: unknown[] }).events.some(
				(event) =>
					event !== null &&
					typeof event === 'object' &&
					(UNIONE_EVENT_NAMES as readonly string[]).includes(
						(event as { event_name?: string }).event_name ?? '',
					),
			),
	);
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
