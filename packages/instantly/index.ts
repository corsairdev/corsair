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
import { AuthMissingError } from 'corsair/core';
import {
	Accounts,
	Blocklist,
	Campaigns,
	Emails,
	LeadLists,
	Leads,
	Webhooks,
	Workspace,
} from './endpoints';
import type {
	InstantlyEndpointInputs,
	InstantlyEndpointOutputs,
} from './endpoints/types';
import {
	InstantlyEndpointInputSchemas,
	InstantlyEndpointOutputSchemas,
} from './endpoints/types';
import { createErrorHandlers, mergeErrorHandlers } from './error-handlers';
import { InstantlySchema } from './schema';
import {
	AccountWebhooks,
	CampaignWebhooks,
	EmailWebhooks,
	LeadWebhooks,
} from './webhooks';
import { matchInstantlyTenantWebhook } from './webhooks/tenant-matcher';
import type {
	InstantlyWebhookEvent,
	InstantlyWebhookOutputs,
	InstantlyWebhookPayload,
} from './webhooks/types';
import {
	InstantlyWebhookEventSchemas,
	matchInstantlyWebhook,
} from './webhooks/types';

export type InstantlyPluginOptions = {
	authType?: PickAuth<'api_key'>;
	/** Instantly API v2 key (Settings → Integrations → API keys). */
	key?: string;
	/**
	 * Secret Instantly sends in the x-corsair-webhook-secret header on each
	 * delivery. Overrides the one stored with keys.set_webhook_signature.
	 */
	webhookSecret?: string;
	hooks?: InternalInstantlyPlugin['hooks'];
	webhookHooks?: InternalInstantlyPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof instantlyEndpointsNested>;
};

export type InstantlyContext = CorsairPluginContext<
	typeof InstantlySchema,
	InstantlyPluginOptions
>;

export type InstantlyKeyBuilderContext =
	KeyBuilderContext<InstantlyPluginOptions>;

export type InstantlyBoundEndpoints = BindEndpoints<
	typeof instantlyEndpointsNested
>;

type InstantlyEndpoint<K extends keyof InstantlyEndpointOutputs> =
	CorsairEndpoint<
		InstantlyContext,
		InstantlyEndpointInputs[K],
		InstantlyEndpointOutputs[K]
	>;

export type InstantlyEndpoints = {
	[K in keyof InstantlyEndpointOutputs]: InstantlyEndpoint<K>;
};

type InstantlyWebhook<K extends InstantlyWebhookEvent> = CorsairWebhook<
	InstantlyContext,
	InstantlyWebhookPayload,
	InstantlyWebhookOutputs[K]
>;

export type InstantlyWebhooks = {
	[K in InstantlyWebhookEvent]: InstantlyWebhook<K>;
};

export type InstantlyBoundWebhooks = BindWebhooks<InstantlyWebhooks>;

const instantlyEndpointsNested = {
	accounts: {
		list: Accounts.list,
		get: Accounts.get,
		getWarmupAnalytics: Accounts.getWarmupAnalytics,
		pause: Accounts.pause,
		resume: Accounts.resume,
		enableWarmup: Accounts.enableWarmup,
		disableWarmup: Accounts.disableWarmup,
	},
	campaigns: {
		list: Campaigns.list,
		get: Campaigns.get,
		create: Campaigns.create,
		update: Campaigns.update,
		activate: Campaigns.activate,
		pause: Campaigns.pause,
		getAnalytics: Campaigns.getAnalytics,
		getAnalyticsOverview: Campaigns.getAnalyticsOverview,
		getStepAnalytics: Campaigns.getStepAnalytics,
	},
	leads: {
		list: Leads.list,
		get: Leads.get,
		create: Leads.create,
		addBulk: Leads.addBulk,
		update: Leads.update,
		updateInterestStatus: Leads.updateInterestStatus,
		delete: Leads.remove,
	},
	leadLists: {
		list: LeadLists.list,
		create: LeadLists.create,
	},
	emails: {
		list: Emails.list,
		get: Emails.get,
		reply: Emails.reply,
		markThreadRead: Emails.markThreadRead,
		countUnread: Emails.countUnread,
	},
	blocklist: {
		list: Blocklist.list,
		add: Blocklist.add,
		remove: Blocklist.remove,
	},
	webhooks: {
		list: Webhooks.list,
		create: Webhooks.create,
		delete: Webhooks.remove,
		listEventTypes: Webhooks.listEventTypes,
	},
	workspace: {
		get: Workspace.get,
	},
} as const;

const instantlyWebhooksNested = {
	emails: EmailWebhooks,
	leads: LeadWebhooks,
	campaigns: CampaignWebhooks,
	accounts: AccountWebhooks,
} as const;

function schemas<K extends keyof typeof InstantlyEndpointInputSchemas>(key: K) {
	return {
		input: InstantlyEndpointInputSchemas[key],
		output: InstantlyEndpointOutputSchemas[key],
	};
}

export const instantlyEndpointSchemas = {
	'accounts.list': schemas('accountsList'),
	'accounts.get': schemas('accountsGet'),
	'accounts.getWarmupAnalytics': schemas('accountsGetWarmupAnalytics'),
	'accounts.pause': schemas('accountsPause'),
	'accounts.resume': schemas('accountsResume'),
	'accounts.enableWarmup': schemas('accountsEnableWarmup'),
	'accounts.disableWarmup': schemas('accountsDisableWarmup'),
	'campaigns.list': schemas('campaignsList'),
	'campaigns.get': schemas('campaignsGet'),
	'campaigns.create': schemas('campaignsCreate'),
	'campaigns.update': schemas('campaignsUpdate'),
	'campaigns.activate': schemas('campaignsActivate'),
	'campaigns.pause': schemas('campaignsPause'),
	'campaigns.getAnalytics': schemas('campaignsGetAnalytics'),
	'campaigns.getAnalyticsOverview': schemas('campaignsGetAnalyticsOverview'),
	'campaigns.getStepAnalytics': schemas('campaignsGetStepAnalytics'),
	'leads.list': schemas('leadsList'),
	'leads.get': schemas('leadsGet'),
	'leads.create': schemas('leadsCreate'),
	'leads.addBulk': schemas('leadsAddBulk'),
	'leads.update': schemas('leadsUpdate'),
	'leads.updateInterestStatus': schemas('leadsUpdateInterestStatus'),
	'leads.delete': schemas('leadsDelete'),
	'leadLists.list': schemas('leadListsList'),
	'leadLists.create': schemas('leadListsCreate'),
	'emails.list': schemas('emailsList'),
	'emails.get': schemas('emailsGet'),
	'emails.reply': schemas('emailsReply'),
	'emails.markThreadRead': schemas('emailsMarkThreadRead'),
	'emails.countUnread': schemas('emailsCountUnread'),
	'blocklist.list': schemas('blocklistList'),
	'blocklist.add': schemas('blocklistAdd'),
	'blocklist.remove': schemas('blocklistRemove'),
	'webhooks.list': schemas('webhooksList'),
	'webhooks.create': schemas('webhooksCreate'),
	'webhooks.delete': schemas('webhooksDelete'),
	'webhooks.listEventTypes': schemas('webhooksListEventTypes'),
	'workspace.get': schemas('workspaceGet'),
} as const satisfies RequiredPluginEndpointSchemas<
	typeof instantlyEndpointsNested
>;

const WEBHOOK_PLAN_NOTE =
	'Webhooks need the Hypergrowth plan or higher; on Growth, poll emails.list with email_type received instead';

function webhookSchema<K extends InstantlyWebhookEvent>(
	event: K,
	description: string,
) {
	return {
		description: `${description}. ${WEBHOOK_PLAN_NOTE}`,
		payload: InstantlyWebhookEventSchemas[event],
		response: InstantlyWebhookEventSchemas[event],
	};
}

const instantlyWebhookSchemas = {
	'emails.sent': webhookSchema('emailSent', 'A campaign email was sent'),
	'emails.opened': webhookSchema('emailOpened', 'A lead opened an email'),
	'emails.linkClicked': webhookSchema(
		'emailLinkClicked',
		'A lead clicked a tracked link',
	),
	'emails.bounced': webhookSchema('emailBounced', 'An email bounced'),
	'emails.replyReceived': webhookSchema(
		'replyReceived',
		'A lead replied; carries reply_text, reply_html and email_id (pass it to emails.reply as reply_to_uuid)',
	),
	'emails.autoReplyReceived': webhookSchema(
		'autoReplyReceived',
		'An auto-reply (such as out of office) arrived',
	),
	'leads.unsubscribed': webhookSchema(
		'leadUnsubscribed',
		'A lead unsubscribed',
	),
	'leads.interested': webhookSchema(
		'leadInterested',
		'A lead was marked Interested',
	),
	'leads.notInterested': webhookSchema(
		'leadNotInterested',
		'A lead was marked Not interested',
	),
	'leads.neutral': webhookSchema('leadNeutral', 'A lead was marked Neutral'),
	'leads.meetingBooked': webhookSchema(
		'leadMeetingBooked',
		'A lead moved to Meeting booked',
	),
	'leads.meetingCompleted': webhookSchema(
		'leadMeetingCompleted',
		'A lead moved to Meeting completed',
	),
	'leads.closed': webhookSchema('leadClosed', 'A lead moved to Closed'),
	'leads.outOfOffice': webhookSchema(
		'leadOutOfOffice',
		'A lead moved to Out of office',
	),
	'leads.wrongPerson': webhookSchema(
		'leadWrongPerson',
		'A lead moved to Wrong person',
	),
	'leads.noShow': webhookSchema('leadNoShow', 'A lead moved to No show'),
	'leads.customLabel': webhookSchema(
		'customLabel',
		"A lead got one of the workspace's custom labels; event_type is the label's name",
	),
	'campaigns.completed': webhookSchema(
		'campaignCompleted',
		'A campaign finished every lead',
	),
	'accounts.error': webhookSchema(
		'accountError',
		'A sending account hit a connection or sending error',
	),
} as const satisfies RequiredPluginWebhookSchemas<
	typeof instantlyWebhooksNested
>;

const defaultAuthType = 'api_key' as const;

const CONTACT_LIMIT_NOTE =
	"Every lead uploaded counts toward the plan's lifetime contact limit, including re-uploads and the same person in a second campaign; re-adding or moving a lead who already replied restarts their sequence at step 1";

const instantlyEndpointMeta = {
	'accounts.list': {
		riskLevel: 'read',
		description:
			'List sending accounts (mailboxes) with status, warmup status, daily limit and warmup score; filter by status, provider, tag or search',
	},
	'accounts.get': {
		riskLevel: 'read',
		description: 'Get one sending account by email address',
	},
	'accounts.getWarmupAnalytics': {
		riskLevel: 'read',
		description:
			'Get warmup results for up to 100 sending accounts: daily sent, received and landed-in-inbox counts and a 0-100 health score',
	},
	'accounts.pause': {
		riskLevel: 'write',
		description:
			'Pause a sending account: it stops sending campaign emails until resumed',
	},
	'accounts.resume': {
		riskLevel: 'write',
		description:
			'Resume a paused sending account so it sends campaign emails again',
	},
	'accounts.enableWarmup': {
		riskLevel: 'write',
		description:
			'Turn warmup on for up to 100 sending accounts (runs as a background job; returns the job)',
	},
	'accounts.disableWarmup': {
		riskLevel: 'write',
		description:
			'Turn warmup off for up to 100 sending accounts (runs as a background job; returns the job)',
	},
	'campaigns.list': {
		riskLevel: 'read',
		description:
			'List campaigns with status, schedule, sending accounts and daily limit; filter by name, status or tag',
	},
	'campaigns.get': {
		riskLevel: 'read',
		description:
			'Get one campaign with its schedule, sequence steps and settings',
	},
	'campaigns.create': {
		riskLevel: 'write',
		description:
			'Create a campaign as a draft: schedule, one sequence of email steps with A/B variants, sending accounts, daily limit and stop rules (stop_on_reply, stop_for_company). Sends nothing until campaigns.activate',
	},
	'campaigns.update': {
		riskLevel: 'write',
		description:
			"Change a campaign's name, schedule, sequence steps, sending accounts, daily limit or stop rules; only the fields passed change",
	},
	'campaigns.activate': {
		riskLevel: 'write',
		description:
			"Start or resume a campaign. This SENDS REAL EMAIL to the campaign's leads from the connected accounts, on its schedule",
	},
	'campaigns.pause': {
		riskLevel: 'write',
		description: 'Pause a campaign: it stops sending until activated again',
	},
	'campaigns.getAnalytics': {
		riskLevel: 'read',
		description:
			'Per-campaign totals: leads, contacted, sent, opens, replies, clicks, bounces, unsubscribes, completed and opportunities, for all campaigns or chosen ones, optionally in a date range',
	},
	'campaigns.getAnalyticsOverview': {
		riskLevel: 'read',
		description:
			'Combined totals across one, several or all campaigns: sent, opens, replies, clicks, bounces, interested, meetings booked and closed',
	},
	'campaigns.getStepAnalytics': {
		riskLevel: 'read',
		description:
			'Sent, opens, replies and clicks per sequence step and A/B variant, for one campaign or all',
	},
	'leads.list': {
		riskLevel: 'read',
		description:
			'List leads in a campaign or list, or across the workspace; filter by email, status (replied, interested, bounced and more) or search',
	},
	'leads.get': {
		riskLevel: 'read',
		description:
			'Get one lead with status, interest status, open/reply/click counts and custom variables',
	},
	'leads.create': {
		riskLevel: 'write',
		irreversible: true,
		description: `Add one lead to a campaign or list. Skips leads already in the workspace unless skip_if_in_workspace is false. ${CONTACT_LIMIT_NOTE}`,
	},
	'leads.addBulk': {
		riskLevel: 'write',
		irreversible: true,
		description: `Add up to 1,000 leads to one campaign or list, with custom variables. Skips leads already in the workspace unless skip_if_in_workspace is false, and is never retried automatically. ${CONTACT_LIMIT_NOTE}`,
	},
	'leads.update': {
		riskLevel: 'write',
		description:
			"Update a lead's name, company, job title, phone, website, personalization or custom variables. Its status is read-only: to stop follow-ups use leads.updateInterestStatus",
	},
	'leads.updateInterestStatus': {
		riskLevel: 'write',
		description:
			"Set a lead's interest status by email (Interested, Meeting booked, Not interested, Wrong person and so on, or null to reset). In a campaign this completes the lead, which stops its follow-ups: use it when a lead answered on another channel. Applied in the background",
	},
	'leads.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete a lead from the workspace. Its upload still counts toward the lifetime contact limit',
	},
	'leadLists.list': {
		riskLevel: 'read',
		description: 'List lead lists (leads stored outside any campaign)',
	},
	'leadLists.create': {
		riskLevel: 'write',
		description:
			'Create a lead list to hold leads outside any campaign (add to it with leads.addBulk list_id)',
	},
	'emails.list': {
		riskLevel: 'read',
		description:
			'List Unibox emails; email_type received lists replies from leads, the way to read replies on plans without webhooks. Filter by lead, campaign, sending account, unread or date. Limited to 20 requests a minute',
	},
	'emails.get': {
		riskLevel: 'read',
		description: 'Get one email with its full body and thread_id',
	},
	'emails.reply': {
		riskLevel: 'write',
		irreversible: true,
		description:
			'Reply to an email in its thread. This SENDS A REAL EMAIL from the chosen sending account to the lead, and is never retried automatically',
	},
	'emails.markThreadRead': {
		riskLevel: 'write',
		description: 'Mark every email in a thread as read',
	},
	'emails.countUnread': {
		riskLevel: 'read',
		description: 'Count unread emails in the Unibox',
	},
	'blocklist.list': {
		riskLevel: 'read',
		description: 'List blocked emails and domains',
	},
	'blocklist.add': {
		riskLevel: 'write',
		description:
			'Block an email (jane@acme.com) or a whole domain (acme.com) from every campaign',
	},
	'blocklist.remove': {
		riskLevel: 'destructive',
		description:
			'Remove a blocklist entry, so campaigns can email that address or domain again',
	},
	'webhooks.list': {
		riskLevel: 'read',
		description:
			'List webhook subscriptions with their URL, event type, campaign and status (header values redacted)',
	},
	'webhooks.create': {
		riskLevel: 'write',
		description: `Subscribe a URL to an event (reply_received, email_bounced, lead_interested...) or all_events, for one campaign or all. Attaches the plugin's webhook secret so Corsair can verify deliveries. ${WEBHOOK_PLAN_NOTE}`,
	},
	'webhooks.delete': {
		riskLevel: 'destructive',
		description:
			'Delete a webhook subscription; Instantly stops sending its events',
	},
	'webhooks.listEventTypes': {
		riskLevel: 'read',
		description:
			"List the event types a webhook can subscribe to, including the workspace's custom labels",
	},
	'workspace.get': {
		riskLevel: 'read',
		description: 'Get the workspace this API key belongs to: ID, name and plan',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof instantlyEndpointsNested
>;

/** Operation paths that only read, and so are safe to retry. */
const instantlyReadOperations: ReadonlySet<string> = new Set(
	Object.entries(instantlyEndpointMeta)
		.filter(([, meta]) => meta.riskLevel === 'read')
		.map(([path]) => path),
);

export const instantlyAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseInstantlyPlugin<T extends InstantlyPluginOptions> =
	CorsairPlugin<
		'instantly',
		typeof InstantlySchema,
		typeof instantlyEndpointsNested,
		typeof instantlyWebhooksNested,
		T,
		typeof defaultAuthType
	>;

export type InternalInstantlyPlugin =
	BaseInstantlyPlugin<InstantlyPluginOptions>;

export type ExternalInstantlyPlugin<T extends InstantlyPluginOptions> =
	BaseInstantlyPlugin<T>;

export function instantly<const T extends InstantlyPluginOptions>(
	incomingOptions: InstantlyPluginOptions & T = {} as InstantlyPluginOptions &
		T,
): ExternalInstantlyPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'instantly',
		authConfig: instantlyAuthConfig,
		schema: InstantlySchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: instantlyEndpointsNested,
		webhooks: instantlyWebhooksNested,
		endpointMeta: instantlyEndpointMeta,
		endpointSchemas: instantlyEndpointSchemas,
		webhookSchemas: instantlyWebhookSchemas,
		pluginWebhookMatcher: matchInstantlyWebhook,
		pluginTenantWebhookMatcher: matchInstantlyTenantWebhook,
		errorHandlers: mergeErrorHandlers(
			createErrorHandlers((operation) =>
				instantlyReadOperations.has(operation),
			),
			options.errorHandlers,
		),
		keyBuilder: async (ctx: InstantlyKeyBuilderContext, source) => {
			if (source === 'webhook') {
				if (options.webhookSecret) return options.webhookSecret;
				// An empty key makes verification fail closed with a clear error.
				return (await ctx.keys.get_webhook_signature()) ?? '';
			}

			if (options.key) return options.key;

			if (ctx.authType === 'api_key') {
				const key = await ctx.keys.get_api_key();
				if (key) return key;
			}

			throw new AuthMissingError('instantly', ctx.authType ?? 'api_key');
		},
	} satisfies InternalInstantlyPlugin;
}

export { InstantlyAPIError } from './client';
export type {
	CampaignsCreateInput,
	EmailsReplyInput,
	InstantlyAccount,
	InstantlyCampaign,
	InstantlyEmail,
	InstantlyEndpointInputs,
	InstantlyEndpointOutputs,
	InstantlyLead,
	InstantlyOperation,
	InstantlyWebhookSubscription,
	LeadsAddBulkInput,
	LeadsAddBulkResponse,
} from './endpoints/types';
export {
	INSTANTLY_WEBHOOK_SECRET_HEADER,
	type InstantlyWebhookEvent,
	type InstantlyWebhookOutputs,
	type InstantlyWebhookPayload,
} from './webhooks/types';
