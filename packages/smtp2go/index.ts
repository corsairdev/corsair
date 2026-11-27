import type {
	BindEndpoints,
	CorsairEndpoint,
	CorsairErrorHandler,
	CorsairPlugin,
	CorsairPluginContext,
	KeyBuilderContext,
	PickAuth,
	PluginPermissionsConfig,
	RequiredPluginEndpointMeta,
	RequiredPluginEndpointSchemas,
} from 'corsair/core';
import { AuthMissingError } from 'corsair/core';
import {
	Activity,
	Domains,
	Email,
	Stats,
	Suppressions,
	Templates,
	Webhooks,
} from './endpoints';
import type {
	Smtp2goEndpointInputs,
	Smtp2goEndpointOutputs,
} from './endpoints/types';
import {
	Smtp2goEndpointInputSchemas,
	Smtp2goEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';
import { Smtp2goSchema } from './schema';

// Deferred endpoint families, all POST routes under /v3 with the same auth:
// apiKeys (add returns a credential), subaccounts (add returns credentials),
// smtpUsers, singleSenders, sms (paid feature), ipAuth, dedicatedIps (paid),
// archive (paid), allowedSenders/allowedRecipients, and the rarely used
// domain/tracking, domain/returnpath and domain/subaccount_access editors.
// Add them as separate groups when needed; each is documented on
// developers.smtp2go.com.

export type Smtp2goPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalSmtp2goPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof smtp2goEndpointsNested>;
};

export type Smtp2goContext = CorsairPluginContext<
	typeof Smtp2goSchema,
	Smtp2goPluginOptions
>;

export type Smtp2goKeyBuilderContext = KeyBuilderContext<Smtp2goPluginOptions>;

export type Smtp2goBoundEndpoints = BindEndpoints<
	typeof smtp2goEndpointsNested
>;

type Smtp2goEndpoint<K extends keyof Smtp2goEndpointOutputs> = CorsairEndpoint<
	Smtp2goContext,
	Smtp2goEndpointInputs[K],
	Smtp2goEndpointOutputs[K]
>;

export type Smtp2goEndpoints = {
	emailSend: Smtp2goEndpoint<'emailSend'>;
	emailSendMime: Smtp2goEndpoint<'emailSendMime'>;
	emailSendBatch: Smtp2goEndpoint<'emailSendBatch'>;
	emailSearchSent: Smtp2goEndpoint<'emailSearchSent'>;
	emailSearchScheduled: Smtp2goEndpoint<'emailSearchScheduled'>;
	emailCancelScheduled: Smtp2goEndpoint<'emailCancelScheduled'>;
	activitySearch: Smtp2goEndpoint<'activitySearch'>;
	suppressionsList: Smtp2goEndpoint<'suppressionsList'>;
	suppressionsAdd: Smtp2goEndpoint<'suppressionsAdd'>;
	suppressionsRemove: Smtp2goEndpoint<'suppressionsRemove'>;
	domainsList: Smtp2goEndpoint<'domainsList'>;
	domainsAdd: Smtp2goEndpoint<'domainsAdd'>;
	domainsVerify: Smtp2goEndpoint<'domainsVerify'>;
	domainsRemove: Smtp2goEndpoint<'domainsRemove'>;
	statsBounces: Smtp2goEndpoint<'statsBounces'>;
	statsCycle: Smtp2goEndpoint<'statsCycle'>;
	statsSpam: Smtp2goEndpoint<'statsSpam'>;
	statsUnsubscribes: Smtp2goEndpoint<'statsUnsubscribes'>;
	statsHistory: Smtp2goEndpoint<'statsHistory'>;
	statsSummary: Smtp2goEndpoint<'statsSummary'>;
	templatesList: Smtp2goEndpoint<'templatesList'>;
	templatesView: Smtp2goEndpoint<'templatesView'>;
	templatesAdd: Smtp2goEndpoint<'templatesAdd'>;
	templatesEdit: Smtp2goEndpoint<'templatesEdit'>;
	templatesDelete: Smtp2goEndpoint<'templatesDelete'>;
	webhooksList: Smtp2goEndpoint<'webhooksList'>;
	webhooksAdd: Smtp2goEndpoint<'webhooksAdd'>;
	webhooksEdit: Smtp2goEndpoint<'webhooksEdit'>;
	webhooksRemove: Smtp2goEndpoint<'webhooksRemove'>;
};

const smtp2goEndpointsNested = {
	email: {
		send: Email.send,
		sendMime: Email.sendMime,
		sendBatch: Email.sendBatch,
		searchSent: Email.searchSent,
		searchScheduled: Email.searchScheduled,
		cancelScheduled: Email.cancelScheduled,
	},
	activity: {
		search: Activity.search,
	},
	suppressions: {
		list: Suppressions.list,
		add: Suppressions.add,
		remove: Suppressions.remove,
	},
	domains: {
		list: Domains.list,
		add: Domains.add,
		verify: Domains.verify,
		remove: Domains.remove,
	},
	stats: {
		bounces: Stats.bounces,
		cycle: Stats.cycle,
		spam: Stats.spam,
		unsubscribes: Stats.unsubscribes,
		history: Stats.history,
		summary: Stats.summary,
	},
	templates: {
		list: Templates.list,
		view: Templates.view,
		add: Templates.add,
		edit: Templates.edit,
		delete: Templates.remove,
	},
	webhooks: {
		list: Webhooks.list,
		add: Webhooks.add,
		edit: Webhooks.edit,
		remove: Webhooks.remove,
	},
} as const;

const registryEntry = (key: keyof Smtp2goEndpointInputs) => ({
	input: Smtp2goEndpointInputSchemas[key],
	output: Smtp2goEndpointOutputSchemas[key],
});

export const smtp2goEndpointSchemas = {
	'email.send': registryEntry('emailSend'),
	'email.sendMime': registryEntry('emailSendMime'),
	'email.sendBatch': registryEntry('emailSendBatch'),
	'email.searchSent': registryEntry('emailSearchSent'),
	'email.searchScheduled': registryEntry('emailSearchScheduled'),
	'email.cancelScheduled': registryEntry('emailCancelScheduled'),
	'activity.search': registryEntry('activitySearch'),
	'suppressions.list': registryEntry('suppressionsList'),
	'suppressions.add': registryEntry('suppressionsAdd'),
	'suppressions.remove': registryEntry('suppressionsRemove'),
	'domains.list': registryEntry('domainsList'),
	'domains.add': registryEntry('domainsAdd'),
	'domains.verify': registryEntry('domainsVerify'),
	'domains.remove': registryEntry('domainsRemove'),
	'stats.bounces': registryEntry('statsBounces'),
	'stats.cycle': registryEntry('statsCycle'),
	'stats.spam': registryEntry('statsSpam'),
	'stats.unsubscribes': registryEntry('statsUnsubscribes'),
	'stats.history': registryEntry('statsHistory'),
	'stats.summary': registryEntry('statsSummary'),
	'templates.list': registryEntry('templatesList'),
	'templates.view': registryEntry('templatesView'),
	'templates.add': registryEntry('templatesAdd'),
	'templates.edit': registryEntry('templatesEdit'),
	'templates.delete': registryEntry('templatesDelete'),
	'webhooks.list': registryEntry('webhooksList'),
	'webhooks.add': registryEntry('webhooksAdd'),
	'webhooks.edit': registryEntry('webhooksEdit'),
	'webhooks.remove': registryEntry('webhooksRemove'),
} as const satisfies RequiredPluginEndpointSchemas<
	typeof smtp2goEndpointsNested
>;

const defaultAuthType = 'api_key' as const;

const smtp2goEndpointMeta = {
	'email.send': {
		riskLevel: 'write',
		irreversible: true,
		description:
			'Send one email to up to 100 recipients, with HTML or plain text, a template, attachments, custom headers, or a schedule up to 3 days out; the result counts succeeded and failed recipients at HTTP 200, so check failed, not the status',
	},
	'email.sendMime': {
		riskLevel: 'write',
		irreversible: true,
		description:
			'Send one pre-encoded MIME message, with the same per-recipient succeeded/failed accounting as email.send',
	},
	'email.sendBatch': {
		riskLevel: 'write',
		irreversible: true,
		description:
			'Send up to 1000 independent messages in one call; the answer carries one email_id or schedule_id entry per message',
	},
	'email.searchSent': {
		riskLevel: 'read',
		description:
			'Search sent emails by date, recipient, sender, subject or email_id, with opens, clicks, delivery status and a continue_token for the next page',
	},
	'email.searchScheduled': {
		riskLevel: 'read',
		description:
			'List emails queued by a schedule, filtered by schedule_id, subject, sender or recipient',
	},
	'email.cancelScheduled': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Cancel one queued scheduled email by schedule_id; the message will not be sent and must be scheduled again to go out',
	},
	'activity.search': {
		riskLevel: 'read',
		description:
			'Search delivery activity events (processed, delivered, bounced, opened, clicked and more) by date, address and event type; limited to 100 returned items per call',
	},
	'suppressions.list': {
		riskLevel: 'read',
		description:
			'List suppressed addresses with their block reasons, filtered by address, block type or date, with a continue_token for the next page',
	},
	'suppressions.add': {
		riskLevel: 'write',
		description:
			'Block future sends to one email address, optionally scoped to a subaccount',
	},
	'suppressions.remove': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Lift the given block types for one email address, reporting per reason whether it was removed',
	},
	'domains.list': {
		riskLevel: 'read',
		description:
			'List sender domains with DKIM and return-path verification state and tracking subdomains',
	},
	'domains.add': {
		riskLevel: 'write',
		description:
			'Add a sender domain and get the DNS records to publish; verification starts right away unless auto_verify is false',
	},
	'domains.verify': {
		riskLevel: 'write',
		description:
			'Run verification for one sender domain now instead of waiting for the periodic re-check',
	},
	'domains.remove': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Remove a sender domain; mail from it stops being accepted and it must be added and verified again',
	},
	'stats.bounces': {
		riskLevel: 'read',
		description:
			'Read bounce counts (hard, soft, rejects) over the last 30 days or a given window, per SMTP user or account-wide',
	},
	'stats.cycle': {
		riskLevel: 'read',
		description:
			'Read the current billing cycle: emails sent, remaining and the plan cap',
	},
	'stats.spam': {
		riskLevel: 'read',
		description:
			'Read spam-complaint counts over the last 30 days or a given window',
	},
	'stats.unsubscribes': {
		riskLevel: 'read',
		description:
			'Read unsubscribe counts over the last 30 days or a given window',
	},
	'stats.history': {
		riskLevel: 'read',
		description:
			'Read per-recipient sending history rows with volumes, bounces, opens, clicks and spam reports for a date range',
	},
	'stats.summary': {
		riskLevel: 'read',
		description:
			'Read one combined report: billing cycle usage, bounces, spam, unsubscribes, opens and clicks',
	},
	'templates.list': {
		riskLevel: 'read',
		description:
			'List email templates by name or tag, one page of 100 at a time with a continue_token',
	},
	'templates.view': {
		riskLevel: 'read',
		description:
			'Read one template with its subject, HTML and text bodies, tags and variables',
	},
	'templates.add': {
		riskLevel: 'write',
		description:
			'Create a template; the caller picks the template id, subject and both HTML and text bodies are required',
	},
	'templates.edit': {
		riskLevel: 'write',
		description: 'Change a template by id, optionally moving it to a new id',
	},
	'templates.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			"Delete a template by id; the answer's data carries a confirmation string",
	},
	'webhooks.list': {
		riskLevel: 'read',
		description:
			'Read the account webhook registration with its events, output format and auth header settings',
	},
	'webhooks.add': {
		riskLevel: 'write',
		description:
			'Register a webhook URL for chosen email (or SMS) events, in form or JSON output, with optional auth headers',
	},
	'webhooks.edit': {
		riskLevel: 'write',
		description:
			'Change a webhook registration by id, including its event list, URL or disabled state',
	},
	'webhooks.remove': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Remove a webhook registration by id; deliveries to that URL stop',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof smtp2goEndpointsNested>;

export type BaseSmtp2goPlugin<T extends Smtp2goPluginOptions> = CorsairPlugin<
	'smtp2go',
	typeof Smtp2goSchema,
	typeof smtp2goEndpointsNested,
	{},
	T,
	typeof defaultAuthType
>;

export type InternalSmtp2goPlugin = BaseSmtp2goPlugin<Smtp2goPluginOptions>;

export type ExternalSmtp2goPlugin<T extends Smtp2goPluginOptions> =
	BaseSmtp2goPlugin<T>;

export function smtp2go<const T extends Smtp2goPluginOptions>(
	incomingOptions: Smtp2goPluginOptions & T = {} as Smtp2goPluginOptions & T,
): ExternalSmtp2goPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'smtp2go',
		schema: Smtp2goSchema,
		options: options,
		hooks: options.hooks,
		endpoints: smtp2goEndpointsNested,
		// SMTP2GO sends webhook deliveries to URLs registered over its API, but
		// their payload shapes and signature scheme are unverified, so this
		// plugin does not handle inbound deliveries.
		webhooks: {},
		endpointMeta: smtp2goEndpointMeta,
		endpointSchemas: smtp2goEndpointSchemas,
		pluginWebhookMatcher: () => false,
		errorHandlers: mergeErrorHandlers(errorHandlers, options.errorHandlers),
		keyBuilder: async (ctx: Smtp2goKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (res) return res;
			}

			throw new AuthMissingError('smtp2go', ctx.authType ?? 'api_key');
		},
	} satisfies InternalSmtp2goPlugin;
}

export { Smtp2goAPIError } from './client';

export type {
	ActivitySearchInput,
	ActivitySearchResponse,
	DomainsAddInput,
	DomainsAddResponse,
	DomainsListInput,
	DomainsListResponse,
	DomainsRemoveInput,
	DomainsRemoveResponse,
	DomainsVerifyInput,
	DomainsVerifyResponse,
	EmailCancelScheduledInput,
	EmailCancelScheduledResponse,
	EmailSearchScheduledInput,
	EmailSearchScheduledResponse,
	EmailSearchSentInput,
	EmailSearchSentResponse,
	EmailSendBatchInput,
	EmailSendBatchResponse,
	EmailSendInput,
	EmailSendMimeInput,
	EmailSendMimeResponse,
	EmailSendResponse,
	Smtp2goEndpointInputs,
	Smtp2goEndpointOutputs,
	StatsBouncesInput,
	StatsBouncesResponse,
	StatsCycleInput,
	StatsCycleResponse,
	StatsHistoryInput,
	StatsHistoryResponse,
	StatsSpamInput,
	StatsSpamResponse,
	StatsSummaryInput,
	StatsSummaryResponse,
	StatsUnsubscribesInput,
	StatsUnsubscribesResponse,
	SuppressionsAddInput,
	SuppressionsAddResponse,
	SuppressionsListInput,
	SuppressionsListResponse,
	SuppressionsRemoveInput,
	SuppressionsRemoveResponse,
	TemplatesAddInput,
	TemplatesAddResponse,
	TemplatesDeleteInput,
	TemplatesDeleteResponse,
	TemplatesEditInput,
	TemplatesEditResponse,
	TemplatesListInput,
	TemplatesListResponse,
	TemplatesViewInput,
	TemplatesViewResponse,
	WebhooksAddInput,
	WebhooksAddResponse,
	WebhooksEditInput,
	WebhooksEditResponse,
	WebhooksListInput,
	WebhooksListResponse,
	WebhooksRemoveInput,
	WebhooksRemoveResponse,
} from './endpoints/types';
