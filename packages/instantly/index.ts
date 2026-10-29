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
	ApiKeys,
	AuditLogs,
	BackgroundJobs,
	Billing,
	Blocklist,
	Campaigns,
	CrmActions,
	CustomTags,
	DomainForwarding,
	Emails,
	EmailVerification,
	EngageItems,
	InboxPlacement,
	LeadLabels,
	LeadLists,
	Leads,
	Subsequences,
	Templates,
	WebhookEvents,
	Webhooks,
	Workspace,
	WorkspaceMembers,
} from './endpoints';
import type {
	InstantlyEndpointInputs,
	InstantlyEndpointOutputs,
} from './endpoints/types';
import {
	InstantlyEndpointInputSchemas,
	InstantlyEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';
import { InstantlySchema } from './schema';
import {
	AccountWebhooks,
	CampaignWebhooks,
	EmailWebhooks,
	LeadWebhooks,
	OtherWebhooks,
	resolveWebhookSecret,
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
		create: Accounts.create,
		update: Accounts.update,
		delete: Accounts.remove,
		getDailyAnalytics: Accounts.getDailyAnalytics,
		pauseMany: Accounts.pauseMany,
		markFixed: Accounts.markFixed,
		getTrackingDomainStatus: Accounts.getTrackingDomainStatus,
		testVitals: Accounts.testVitals,
		moveToWorkspace: Accounts.moveToWorkspace,
		listCampaigns: Accounts.listCampaigns,
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
		delete: Campaigns.remove,
		searchByLead: Campaigns.searchByLead,
		getDailyAnalytics: Campaigns.getDailyAnalytics,
		share: Campaigns.share,
		createFromShared: Campaigns.createFromShared,
		export: Campaigns.exportCampaign,
		duplicate: Campaigns.duplicate,
		countLaunched: Campaigns.countLaunched,
		addVariables: Campaigns.addVariables,
		getSendingStatus: Campaigns.getSendingStatus,
	},
	leads: {
		list: Leads.list,
		get: Leads.get,
		create: Leads.create,
		addBulk: Leads.addBulk,
		update: Leads.update,
		updateInterestStatus: Leads.updateInterestStatus,
		delete: Leads.remove,
		deleteMany: Leads.deleteMany,
		merge: Leads.merge,
		removeFromSubsequence: Leads.removeFromSubsequence,
		assign: Leads.assign,
		move: Leads.move,
		moveToSubsequence: Leads.moveToSubsequence,
	},
	leadLists: {
		list: LeadLists.list,
		create: LeadLists.create,
		get: LeadLists.get,
		update: LeadLists.update,
		delete: LeadLists.remove,
		getVerificationStats: LeadLists.getVerificationStats,
	},
	emails: {
		list: Emails.list,
		get: Emails.get,
		reply: Emails.reply,
		markThreadRead: Emails.markThreadRead,
		countUnread: Emails.countUnread,
		sendTest: Emails.sendTest,
		forward: Emails.forward,
		update: Emails.update,
		delete: Emails.remove,
	},
	blocklist: {
		list: Blocklist.list,
		add: Blocklist.add,
		remove: Blocklist.remove,
		get: Blocklist.get,
		update: Blocklist.update,
		deleteAll: Blocklist.deleteAll,
		addMany: Blocklist.addMany,
		removeMany: Blocklist.removeMany,
		downloadCsv: Blocklist.downloadCsv,
	},
	webhooks: {
		list: Webhooks.list,
		create: Webhooks.create,
		delete: Webhooks.remove,
		listEventTypes: Webhooks.listEventTypes,
		get: Webhooks.get,
		update: Webhooks.update,
		test: Webhooks.test,
		resume: Webhooks.resume,
	},
	workspace: {
		get: Workspace.get,
		update: Workspace.update,
		scheduleRemoval: Workspace.scheduleRemoval,
		cancelRemoval: Workspace.cancelRemoval,
		setWhitelabelDomain: Workspace.setWhitelabelDomain,
		getWhitelabelDomain: Workspace.getWhitelabelDomain,
		deleteWhitelabelDomain: Workspace.deleteWhitelabelDomain,
		changeOwner: Workspace.changeOwner,
	},
	subsequences: {
		create: Subsequences.create,
		list: Subsequences.list,
		get: Subsequences.get,
		update: Subsequences.update,
		delete: Subsequences.remove,
		duplicate: Subsequences.duplicate,
		pause: Subsequences.pause,
		resume: Subsequences.resume,
		getAnalytics: Subsequences.getAnalytics,
		getStepAnalytics: Subsequences.getStepAnalytics,
		getSendingStatus: Subsequences.getSendingStatus,
	},
	leadLabels: {
		create: LeadLabels.create,
		list: LeadLabels.list,
		get: LeadLabels.get,
		update: LeadLabels.update,
		delete: LeadLabels.remove,
		testAiReplyLabel: LeadLabels.testAiReplyLabel,
	},
	customTags: {
		create: CustomTags.create,
		list: CustomTags.list,
		get: CustomTags.get,
		update: CustomTags.update,
		delete: CustomTags.remove,
		toggleResource: CustomTags.toggleResource,
	},
	customTagMappings: {
		list: CustomTags.listMappings,
	},
	emailVerification: {
		verify: EmailVerification.verify,
		getStatus: EmailVerification.getStatus,
	},
	webhookEvents: {
		list: WebhookEvents.list,
		get: WebhookEvents.get,
		getSummary: WebhookEvents.getSummary,
		getSummaryByDate: WebhookEvents.getSummaryByDate,
	},
	inboxPlacementTests: {
		create: InboxPlacement.createTest,
		list: InboxPlacement.listTests,
		get: InboxPlacement.getTest,
		update: InboxPlacement.updateTest,
		delete: InboxPlacement.deleteTest,
		listEspOptions: InboxPlacement.listEspOptions,
	},
	inboxPlacementAnalytics: {
		list: InboxPlacement.listAnalytics,
		get: InboxPlacement.getAnalytics,
		getStatsByTest: InboxPlacement.getStatsByTest,
		getDeliverabilityInsights: InboxPlacement.getDeliverabilityInsights,
		getStatsByDate: InboxPlacement.getStatsByDate,
	},
	inboxPlacementReports: {
		list: InboxPlacement.listReports,
		get: InboxPlacement.getReport,
	},
	workspaceMembers: {
		create: WorkspaceMembers.createMember,
		list: WorkspaceMembers.listMembers,
		get: WorkspaceMembers.getMember,
		update: WorkspaceMembers.updateMember,
		delete: WorkspaceMembers.deleteMember,
	},
	workspaceGroupMembers: {
		create: WorkspaceMembers.createGroupMember,
		list: WorkspaceMembers.listGroupMembers,
		get: WorkspaceMembers.getGroupMember,
		delete: WorkspaceMembers.deleteGroupMember,
		getAdmin: WorkspaceMembers.getGroupAdmin,
	},
	billing: {
		getPlanDetails: Billing.getPlanDetails,
		getSubscriptionDetails: Billing.getSubscriptionDetails,
	},
	auditLogs: {
		list: AuditLogs.list,
	},
	backgroundJobs: {
		list: BackgroundJobs.list,
		get: BackgroundJobs.get,
	},
	apiKeys: {
		create: ApiKeys.create,
		list: ApiKeys.list,
		delete: ApiKeys.remove,
	},
	emailTemplates: {
		list: Templates.listEmailTemplates,
		create: Templates.createEmailTemplate,
		delete: Templates.deleteEmailTemplate,
	},
	customPromptTemplates: {
		list: Templates.listPromptTemplates,
		get: Templates.getPromptTemplate,
		create: Templates.createPromptTemplate,
		update: Templates.updatePromptTemplate,
		delete: Templates.deletePromptTemplate,
	},
	crmActions: {
		listPhoneNumbers: CrmActions.listPhoneNumbers,
		deletePhoneNumber: CrmActions.deletePhoneNumber,
	},
	engageItems: {
		list: EngageItems.list,
		deleteMany: EngageItems.deleteMany,
	},
	domainForwarding: {
		get: DomainForwarding.get,
		set: DomainForwarding.set,
		remove: DomainForwarding.remove,
	},
} as const;

const instantlyWebhooksNested = {
	emails: EmailWebhooks,
	leads: LeadWebhooks,
	campaigns: CampaignWebhooks,
	accounts: AccountWebhooks,
	events: OtherWebhooks,
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
	'accounts.create': schemas('accountsCreate'),
	'accounts.update': schemas('accountsUpdate'),
	'accounts.delete': schemas('accountsDelete'),
	'accounts.getDailyAnalytics': schemas('accountsGetDailyAnalytics'),
	'accounts.pauseMany': schemas('accountsPauseMany'),
	'accounts.markFixed': schemas('accountsMarkFixed'),
	'accounts.getTrackingDomainStatus': schemas(
		'accountsGetTrackingDomainStatus',
	),
	'accounts.testVitals': schemas('accountsTestVitals'),
	'accounts.moveToWorkspace': schemas('accountsMoveToWorkspace'),
	'accounts.listCampaigns': schemas('accountsListCampaigns'),
	'campaigns.delete': schemas('campaignsDelete'),
	'campaigns.searchByLead': schemas('campaignsSearchByLead'),
	'campaigns.getDailyAnalytics': schemas('campaignsGetDailyAnalytics'),
	'campaigns.share': schemas('campaignsShare'),
	'campaigns.createFromShared': schemas('campaignsCreateFromShared'),
	'campaigns.export': schemas('campaignsExport'),
	'campaigns.duplicate': schemas('campaignsDuplicate'),
	'campaigns.countLaunched': schemas('campaignsCountLaunched'),
	'campaigns.addVariables': schemas('campaignsAddVariables'),
	'campaigns.getSendingStatus': schemas('campaignsGetSendingStatus'),
	'subsequences.create': schemas('subsequencesCreate'),
	'subsequences.list': schemas('subsequencesList'),
	'subsequences.get': schemas('subsequencesGet'),
	'subsequences.update': schemas('subsequencesUpdate'),
	'subsequences.delete': schemas('subsequencesDelete'),
	'subsequences.duplicate': schemas('subsequencesDuplicate'),
	'subsequences.pause': schemas('subsequencesPause'),
	'subsequences.resume': schemas('subsequencesResume'),
	'subsequences.getAnalytics': schemas('subsequencesGetAnalytics'),
	'subsequences.getStepAnalytics': schemas('subsequencesGetStepAnalytics'),
	'subsequences.getSendingStatus': schemas('subsequencesGetSendingStatus'),
	'leads.deleteMany': schemas('leadsDeleteMany'),
	'leads.merge': schemas('leadsMerge'),
	'leads.removeFromSubsequence': schemas('leadsRemoveFromSubsequence'),
	'leads.assign': schemas('leadsAssign'),
	'leads.move': schemas('leadsMove'),
	'leads.moveToSubsequence': schemas('leadsMoveToSubsequence'),
	'leadLists.get': schemas('leadListsGet'),
	'leadLists.update': schemas('leadListsUpdate'),
	'leadLists.delete': schemas('leadListsDelete'),
	'leadLists.getVerificationStats': schemas('leadListsGetVerificationStats'),
	'leadLabels.create': schemas('leadLabelsCreate'),
	'leadLabels.list': schemas('leadLabelsList'),
	'leadLabels.get': schemas('leadLabelsGet'),
	'leadLabels.update': schemas('leadLabelsUpdate'),
	'leadLabels.delete': schemas('leadLabelsDelete'),
	'leadLabels.testAiReplyLabel': schemas('leadLabelsTestAiReplyLabel'),
	'customTags.create': schemas('customTagsCreate'),
	'customTags.list': schemas('customTagsList'),
	'customTags.get': schemas('customTagsGet'),
	'customTags.update': schemas('customTagsUpdate'),
	'customTags.delete': schemas('customTagsDelete'),
	'customTags.toggleResource': schemas('customTagsToggleResource'),
	'customTagMappings.list': schemas('customTagMappingsList'),
	'emails.sendTest': schemas('emailsSendTest'),
	'emails.forward': schemas('emailsForward'),
	'emails.update': schemas('emailsUpdate'),
	'emails.delete': schemas('emailsDelete'),
	'emailVerification.verify': schemas('emailVerificationVerify'),
	'emailVerification.getStatus': schemas('emailVerificationGetStatus'),
	'blocklist.get': schemas('blocklistGet'),
	'blocklist.update': schemas('blocklistUpdate'),
	'blocklist.deleteAll': schemas('blocklistDeleteAll'),
	'blocklist.addMany': schemas('blocklistAddMany'),
	'blocklist.removeMany': schemas('blocklistRemoveMany'),
	'blocklist.downloadCsv': schemas('blocklistDownloadCsv'),
	'webhooks.get': schemas('webhooksGet'),
	'webhooks.update': schemas('webhooksUpdate'),
	'webhooks.test': schemas('webhooksTest'),
	'webhooks.resume': schemas('webhooksResume'),
	'webhookEvents.list': schemas('webhookEventsList'),
	'webhookEvents.get': schemas('webhookEventsGet'),
	'webhookEvents.getSummary': schemas('webhookEventsGetSummary'),
	'webhookEvents.getSummaryByDate': schemas('webhookEventsGetSummaryByDate'),
	'inboxPlacementTests.create': schemas('inboxPlacementTestsCreate'),
	'inboxPlacementTests.list': schemas('inboxPlacementTestsList'),
	'inboxPlacementTests.get': schemas('inboxPlacementTestsGet'),
	'inboxPlacementTests.update': schemas('inboxPlacementTestsUpdate'),
	'inboxPlacementTests.delete': schemas('inboxPlacementTestsDelete'),
	'inboxPlacementTests.listEspOptions': schemas(
		'inboxPlacementTestsListEspOptions',
	),
	'inboxPlacementAnalytics.list': schemas('inboxPlacementAnalyticsList'),
	'inboxPlacementAnalytics.get': schemas('inboxPlacementAnalyticsGet'),
	'inboxPlacementAnalytics.getStatsByTest': schemas(
		'inboxPlacementAnalyticsGetStatsByTest',
	),
	'inboxPlacementAnalytics.getDeliverabilityInsights': schemas(
		'inboxPlacementAnalyticsGetDeliverabilityInsights',
	),
	'inboxPlacementAnalytics.getStatsByDate': schemas(
		'inboxPlacementAnalyticsGetStatsByDate',
	),
	'inboxPlacementReports.list': schemas('inboxPlacementReportsList'),
	'inboxPlacementReports.get': schemas('inboxPlacementReportsGet'),
	'workspace.update': schemas('workspaceUpdate'),
	'workspace.scheduleRemoval': schemas('workspaceScheduleRemoval'),
	'workspace.cancelRemoval': schemas('workspaceCancelRemoval'),
	'workspace.setWhitelabelDomain': schemas('workspaceSetWhitelabelDomain'),
	'workspace.getWhitelabelDomain': schemas('workspaceGetWhitelabelDomain'),
	'workspace.deleteWhitelabelDomain': schemas(
		'workspaceDeleteWhitelabelDomain',
	),
	'workspace.changeOwner': schemas('workspaceChangeOwner'),
	'workspaceMembers.create': schemas('workspaceMembersCreate'),
	'workspaceMembers.list': schemas('workspaceMembersList'),
	'workspaceMembers.get': schemas('workspaceMembersGet'),
	'workspaceMembers.update': schemas('workspaceMembersUpdate'),
	'workspaceMembers.delete': schemas('workspaceMembersDelete'),
	'workspaceGroupMembers.create': schemas('workspaceGroupMembersCreate'),
	'workspaceGroupMembers.list': schemas('workspaceGroupMembersList'),
	'workspaceGroupMembers.get': schemas('workspaceGroupMembersGet'),
	'workspaceGroupMembers.delete': schemas('workspaceGroupMembersDelete'),
	'workspaceGroupMembers.getAdmin': schemas('workspaceGroupMembersGetAdmin'),
	'billing.getPlanDetails': schemas('billingGetPlanDetails'),
	'billing.getSubscriptionDetails': schemas('billingGetSubscriptionDetails'),
	'auditLogs.list': schemas('auditLogsList'),
	'backgroundJobs.list': schemas('backgroundJobsList'),
	'backgroundJobs.get': schemas('backgroundJobsGet'),
	'apiKeys.create': schemas('apiKeysCreate'),
	'apiKeys.list': schemas('apiKeysList'),
	'apiKeys.delete': schemas('apiKeysDelete'),
	'emailTemplates.list': schemas('emailTemplatesList'),
	'emailTemplates.create': schemas('emailTemplatesCreate'),
	'emailTemplates.delete': schemas('emailTemplatesDelete'),
	'customPromptTemplates.list': schemas('customPromptTemplatesList'),
	'customPromptTemplates.get': schemas('customPromptTemplatesGet'),
	'customPromptTemplates.create': schemas('customPromptTemplatesCreate'),
	'customPromptTemplates.update': schemas('customPromptTemplatesUpdate'),
	'customPromptTemplates.delete': schemas('customPromptTemplatesDelete'),
	'crmActions.listPhoneNumbers': schemas('crmActionsListPhoneNumbers'),
	'crmActions.deletePhoneNumber': schemas('crmActionsDeletePhoneNumber'),
	'engageItems.list': schemas('engageItemsList'),
	'engageItems.deleteMany': schemas('engageItemsDeleteMany'),
	'domainForwarding.get': schemas('domainForwardingGet'),
	'domainForwarding.set': schemas('domainForwardingSet'),
	'domainForwarding.remove': schemas('domainForwardingRemove'),
} as const satisfies RequiredPluginEndpointSchemas<
	typeof instantlyEndpointsNested
>;

function webhookSchema<K extends InstantlyWebhookEvent>(
	event: K,
	description: string,
) {
	return {
		description,
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
		'An auto-reply (such as out of office) arrived. Only all_events webhooks get it: Instantly has no auto_reply_received subscription',
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
	'campaigns.completed': webhookSchema(
		'campaignCompleted',
		'A campaign finished every lead',
	),
	'accounts.error': webhookSchema(
		'accountError',
		'A sending account hit a connection or sending error',
	),
	'events.other': webhookSchema(
		'other',
		"An event with no dedicated handler: a custom lead label (event_type is the label's name) or an event type Instantly added later. Instantly's payload does not say which, so check event_type before acting",
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
		description: `Subscribe a URL to an event (reply_received, email_bounced, lead_interested...) or all_events, for one campaign or all. Attaches the plugin's webhook secret so Corsair can verify deliveries. Webhooks need Instantly's Hypergrowth plan or higher`,
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
	'accounts.create': {
		riskLevel: 'write',
		description:
			'Connect a sending account with its IMAP and SMTP login (Google and Microsoft OAuth connections are not covered by this plugin). The passwords are sent to Instantly and never logged',
	},
	'accounts.update': {
		riskLevel: 'write',
		description:
			"Change a sending account's name, daily limit, sending gap, signature, reply-to, tracking domain or warmup settings",
	},
	'accounts.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Remove a sending account from the workspace; it stops sending and warming up',
	},
	'accounts.getDailyAnalytics': {
		riskLevel: 'read',
		description:
			'Emails sent per day by each sending account. Pass emails or a short date range: on a large workspace Instantly answers 413 otherwise',
	},
	'accounts.pauseMany': {
		riskLevel: 'write',
		description:
			'Pause up to 100 sending accounts at once; returns which were paused and which failed',
	},
	'accounts.markFixed': {
		riskLevel: 'write',
		description:
			'Set a sending account back to active and clear its error message, after fixing its connection',
	},
	'accounts.getTrackingDomainStatus': {
		riskLevel: 'read',
		description: "Check a custom tracking domain's DNS setup",
	},
	'accounts.testVitals': {
		riskLevel: 'read',
		description:
			'Check the health ("vitals") of sending accounts\' domains; changes nothing',
	},
	'accounts.moveToWorkspace': {
		riskLevel: 'write',
		description:
			"Move sending accounts to another workspace in the same workspace group. Needs the admin workspace's API key",
	},
	'accounts.listCampaigns': {
		riskLevel: 'read',
		description: 'List the campaigns a sending account sends for',
	},
	'campaigns.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a campaign permanently',
	},
	'campaigns.searchByLead': {
		riskLevel: 'read',
		description: 'Find the campaigns a lead is in, by their email address',
	},
	'campaigns.getDailyAnalytics': {
		riskLevel: 'read',
		description:
			'Per-day sent, opens, replies and clicks for one campaign or all, optionally in a date range',
	},
	'campaigns.share': {
		riskLevel: 'write',
		description:
			'Share a campaign for 7 days so other Instantly users can copy it with campaigns.createFromShared',
	},
	'campaigns.createFromShared': {
		riskLevel: 'write',
		description:
			'Create a campaign in this workspace from one shared with campaigns.share',
	},
	'campaigns.export': {
		riskLevel: 'read',
		description:
			"Export a campaign's settings and sequence as JSON; changes nothing",
	},
	'campaigns.duplicate': {
		riskLevel: 'write',
		description: 'Copy a campaign into a new one, optionally with a new name',
	},
	'campaigns.countLaunched': {
		riskLevel: 'read',
		description: 'Count the campaigns ever launched in the workspace',
	},
	'campaigns.addVariables': {
		riskLevel: 'write',
		description:
			'Add custom variable names to a campaign, for use as `{{variable}}` in its copy',
	},
	'campaigns.getSendingStatus': {
		riskLevel: 'read',
		description:
			'Explain why a campaign is not sending, or sending slower than expected',
	},
	'subsequences.create': {
		riskLevel: 'write',
		description:
			"Create a subsequence: follow-up emails for a campaign's leads who meet its conditions (a reply, a lead status, an email opened...). While the campaign runs, matching leads get its emails",
	},
	'subsequences.list': {
		riskLevel: 'read',
		description: 'List subsequences, by parent campaign or name',
	},
	'subsequences.get': {
		riskLevel: 'read',
		description: 'Get one subsequence with its conditions, schedule and steps',
	},
	'subsequences.update': {
		riskLevel: 'write',
		description:
			"Change a subsequence's name, conditions, schedule, steps or daily limit",
	},
	'subsequences.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a subsequence; its leads stop getting its emails',
	},
	'subsequences.duplicate': {
		riskLevel: 'write',
		description:
			'Copy a subsequence, with the same trigger conditions, into a campaign',
	},
	'subsequences.pause': {
		riskLevel: 'write',
		description: 'Pause a subsequence: it stops sending until resumed',
	},
	'subsequences.resume': {
		riskLevel: 'write',
		description:
			'Resume a paused subsequence. This SENDS REAL EMAIL to the leads that meet its conditions',
	},
	'subsequences.getAnalytics': {
		riskLevel: 'read',
		description:
			"Emails sent, unique opens and unique replies for each of a campaign's subsequences",
	},
	'subsequences.getStepAnalytics': {
		riskLevel: 'read',
		description:
			'Sent, opens, replies and clicks per step and A/B variant of one subsequence',
	},
	'subsequences.getSendingStatus': {
		riskLevel: 'read',
		description:
			'Explain why a subsequence is not sending, or sending slower than expected',
	},
	'leads.deleteMany': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete leads from one campaign or list, optionally only some IDs or a status. Their uploads still count toward the lifetime contact limit',
	},
	'leads.merge': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Merge one lead into another (destination_lead_id); the first lead is removed',
	},
	'leads.removeFromSubsequence': {
		riskLevel: 'destructive',
		description:
			"Take a lead out of the subsequence it is in; it stops getting that subsequence's emails",
	},
	'leads.assign': {
		riskLevel: 'write',
		description:
			'Assign leads (by IDs or filters) to workspace users. Runs in the background',
	},
	'leads.move': {
		riskLevel: 'write',
		description:
			'Move or copy leads (by IDs or filters) to another campaign or list, as a background job; returns the job. Moving a lead who already replied restarts their sequence at step 1',
	},
	'leads.moveToSubsequence': {
		riskLevel: 'write',
		description:
			'Put a lead into a subsequence. This SENDS REAL EMAIL: the subsequence starts emailing the lead',
	},
	'leadLists.get': {
		riskLevel: 'read',
		description: 'Get one lead list by ID: name, owner and enrichment setting',
	},
	'leadLists.update': {
		riskLevel: 'write',
		description:
			'Rename a lead list, change its owner or turn enrichment of new leads on or off',
	},
	'leadLists.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a lead list permanently',
	},
	'leadLists.getVerificationStats': {
		riskLevel: 'read',
		description: "Counts of a lead list's leads by email verification result",
	},
	'leadLabels.create': {
		riskLevel: 'write',
		description:
			'Create a custom lead label (a status such as "Demo requested") marked positive, negative or neutral',
	},
	'leadLabels.list': {
		riskLevel: 'read',
		description: "List the workspace's custom lead labels",
	},
	'leadLabels.get': {
		riskLevel: 'read',
		description: 'Get one custom lead label by ID',
	},
	'leadLabels.update': {
		riskLevel: 'write',
		description:
			'Rename a custom lead label or change its description, sentiment or AI use',
	},
	'leadLabels.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete a custom lead label; its leads move to reassigned_status',
	},
	'leadLabels.testAiReplyLabel': {
		riskLevel: 'read',
		description:
			"Ask which label Instantly's AI would give a reply text, to test custom labels. Changes nothing, but the workspace gets 500 of these tests per 30 days",
	},
	'customTags.create': {
		riskLevel: 'write',
		description: 'Create a tag for organizing sending accounts and campaigns',
	},
	'customTags.list': {
		riskLevel: 'read',
		description: "List the workspace's tags",
	},
	'customTags.get': { riskLevel: 'read', description: 'Get one tag by ID' },
	'customTags.update': {
		riskLevel: 'write',
		description: 'Rename a tag or change its description',
	},
	'customTags.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a tag; the accounts and campaigns that had it lose it',
	},
	'customTags.toggleResource': {
		riskLevel: 'write',
		description:
			'Assign tags to, or remove them from, sending accounts or campaigns (by IDs or all matching a filter)',
	},
	'customTagMappings.list': {
		riskLevel: 'read',
		description: 'List which tags are assigned to which accounts and campaigns',
	},
	'emails.sendTest': {
		riskLevel: 'write',
		description:
			'Send a test email from a sending account. This SENDS REAL EMAIL to the given addresses (it does not appear in the Unibox). Limited to 10 a minute',
	},
	'emails.forward': {
		riskLevel: 'write',
		description:
			'Forward an email from the Unibox to other recipients. This SENDS REAL EMAIL from the chosen sending account, and is never retried automatically',
	},
	'emails.update': {
		riskLevel: 'write',
		description: 'Mark an email read or unread, or set a Unibox reminder on it',
	},
	'emails.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete an email from the Unibox',
	},
	'emailVerification.verify': {
		riskLevel: 'write',
		description:
			'Verify one email address. SPENDS Instantly email-verification credits (the response reports credits and credits_used) and is never retried automatically. A slow check answers pending; read the result with emailVerification.getStatus',
	},
	'emailVerification.getStatus': {
		riskLevel: 'read',
		description:
			'Get the result of an email verification started with emailVerification.verify',
	},
	'blocklist.get': {
		riskLevel: 'read',
		description: 'Get one blocklist entry by ID',
	},
	'blocklist.update': {
		riskLevel: 'write',
		description: 'Change the email or domain a blocklist entry blocks',
	},
	'blocklist.deleteAll': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete EVERY blocklist entry (or every domain entry, or every entry matching search). Campaigns can then email those addresses again',
	},
	'blocklist.addMany': {
		riskLevel: 'write',
		description: 'Block many emails and domains at once',
	},
	'blocklist.removeMany': {
		riskLevel: 'destructive',
		description:
			'Remove blocklist entries by ID, so campaigns can email those addresses again',
	},
	'blocklist.downloadCsv': {
		riskLevel: 'read',
		description: 'Download the blocklist as CSV text',
	},
	'webhooks.get': {
		riskLevel: 'read',
		description: 'Get one webhook subscription (header values redacted)',
	},
	'webhooks.update': {
		riskLevel: 'write',
		description:
			"Change a webhook's URL, event type, campaign or headers. Passing headers replaces them all, including the x-corsair-webhook-secret Corsair verifies deliveries with",
	},
	'webhooks.test': {
		riskLevel: 'write',
		description: "Send a test payload to the webhook's URL",
	},
	'webhooks.resume': {
		riskLevel: 'write',
		description:
			'Turn a webhook back on after Instantly disabled it for failed deliveries',
	},
	'webhookEvents.list': {
		riskLevel: 'read',
		description:
			'List webhook deliveries with their payload, status code and retries; filter by success, date or search',
	},
	'webhookEvents.get': {
		riskLevel: 'read',
		description: 'Get one webhook delivery with its payload and response',
	},
	'webhookEvents.getSummary': {
		riskLevel: 'read',
		description:
			'Totals and success rate of webhook deliveries, optionally in a date range',
	},
	'webhookEvents.getSummaryByDate': {
		riskLevel: 'read',
		description: 'Webhook delivery totals and success rate per day',
	},
	'inboxPlacementTests.create': {
		riskLevel: 'write',
		description:
			'Create an inbox placement test: a test email sent to seed inboxes to see where it lands (inbox, spam or a category tab). With sending_method 1, Instantly SENDS REAL EMAIL from the given accounts; with 2, you send it from outside Instantly',
	},
	'inboxPlacementTests.list': {
		riskLevel: 'read',
		description: 'List inbox placement tests',
	},
	'inboxPlacementTests.get': {
		riskLevel: 'read',
		description: 'Get one inbox placement test',
	},
	'inboxPlacementTests.update': {
		riskLevel: 'write',
		description:
			'Rename an inbox placement test, change its schedule or automations, or pause or resume it',
	},
	'inboxPlacementTests.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete an inbox placement test',
	},
	'inboxPlacementTests.listEspOptions': {
		riskLevel: 'read',
		description:
			'List the email providers an inbox placement test can send to (for recipients_labels)',
	},
	'inboxPlacementAnalytics.list': {
		riskLevel: 'read',
		description:
			'Where each inbox placement test email landed, per recipient; filter by test, date, provider or sender',
	},
	'inboxPlacementAnalytics.get': {
		riskLevel: 'read',
		description: 'Get one inbox placement result',
	},
	'inboxPlacementAnalytics.getStatsByTest': {
		riskLevel: 'read',
		description:
			'Inbox, spam and category counts for inbox placement tests; changes nothing',
	},
	'inboxPlacementAnalytics.getDeliverabilityInsights': {
		riskLevel: 'read',
		description:
			'Deliverability insights for one inbox placement test, optionally against an earlier period; changes nothing',
	},
	'inboxPlacementAnalytics.getStatsByDate': {
		riskLevel: 'read',
		description:
			'Inbox, spam and category counts per day for a scheduled inbox placement test; changes nothing',
	},
	'inboxPlacementReports.list': {
		riskLevel: 'read',
		description:
			'List blacklist and SpamAssassin reports for inbox placement tests',
	},
	'inboxPlacementReports.get': {
		riskLevel: 'read',
		description: 'Get one blacklist and SpamAssassin report',
	},
	'workspace.update': {
		riskLevel: 'write',
		description: 'Rename the workspace or change its logo',
	},
	'workspace.scheduleRemoval': {
		riskLevel: 'destructive',
		description:
			'Schedule the WHOLE WORKSPACE for deletion in 24 hours. workspace.cancelRemoval stops it before then',
	},
	'workspace.cancelRemoval': {
		riskLevel: 'write',
		description: 'Cancel a scheduled workspace deletion',
	},
	'workspace.setWhitelabelDomain': {
		riskLevel: 'write',
		description: 'Set the agency (white-label) domain clients see',
	},
	'workspace.getWhitelabelDomain': {
		riskLevel: 'read',
		description:
			'Get the agency (white-label) domain and its verification state',
	},
	'workspace.deleteWhitelabelDomain': {
		riskLevel: 'destructive',
		description: 'Remove the agency (white-label) domain',
	},
	'workspace.changeOwner': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Make another user the owner of the workspace. The current owner loses ownership, so this cannot be undone from this API key',
	},
	'workspaceMembers.create': {
		riskLevel: 'write',
		description: 'Add a user to the workspace by email, with a role',
	},
	'workspaceMembers.list': {
		riskLevel: 'read',
		description: "List the workspace's members",
	},
	'workspaceMembers.get': {
		riskLevel: 'read',
		description: 'Get one workspace member by ID',
	},
	'workspaceMembers.update': {
		riskLevel: 'write',
		description: "Change a member's nickname or role",
	},
	'workspaceMembers.delete': {
		riskLevel: 'destructive',
		description: 'Remove a member from the workspace',
	},
	'workspaceGroupMembers.create': {
		riskLevel: 'write',
		description:
			"Invite another workspace into this admin workspace's group; it joins once its owner accepts",
	},
	'workspaceGroupMembers.list': {
		riskLevel: 'read',
		description: "List the workspaces in this admin workspace's group",
	},
	'workspaceGroupMembers.get': {
		riskLevel: 'read',
		description: 'Get one workspace group member',
	},
	'workspaceGroupMembers.delete': {
		riskLevel: 'destructive',
		description: "Remove a workspace from this admin workspace's group",
	},
	'workspaceGroupMembers.getAdmin': {
		riskLevel: 'read',
		description: 'Get the admin workspace this workspace belongs to',
	},
	'billing.getPlanDetails': {
		riskLevel: 'read',
		description: "Get the workspace's plans and their limits",
	},
	'billing.getSubscriptionDetails': {
		riskLevel: 'read',
		description: "Get the workspace's subscriptions and billing state",
	},
	'auditLogs.list': {
		riskLevel: 'read',
		description:
			'List audit log records (who did what, when); filter by activity type, search or date',
	},
	'backgroundJobs.list': {
		riskLevel: 'read',
		description:
			'List background jobs (lead moves, imports, warmup changes) with status and progress',
	},
	'backgroundJobs.get': {
		riskLevel: 'read',
		description:
			'Get one background job, e.g. the one leads.move or accounts.enableWarmup returned',
	},
	'apiKeys.create': {
		riskLevel: 'write',
		description:
			'Create an API key with the given scopes. The response holds the key itself, the only time it is returned in full',
	},
	'apiKeys.list': {
		riskLevel: 'read',
		description:
			"List the workspace's API keys with their scopes (key values redacted)",
	},
	'apiKeys.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Revoke an API key; anything using it stops working',
	},
	'emailTemplates.list': {
		riskLevel: 'read',
		description: 'List saved email templates',
	},
	'emailTemplates.create': {
		riskLevel: 'write',
		description: 'Save an email template (name and body)',
	},
	'emailTemplates.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a saved email template',
	},
	'customPromptTemplates.list': {
		riskLevel: 'read',
		description: 'List custom AI prompt templates, including public ones',
	},
	'customPromptTemplates.get': {
		riskLevel: 'read',
		description: 'Get one custom AI prompt template',
	},
	'customPromptTemplates.create': {
		riskLevel: 'write',
		description:
			'Create a custom AI prompt template; `{{property}}` placeholders take lead fields',
	},
	'customPromptTemplates.update': {
		riskLevel: 'write',
		description: 'Change a custom AI prompt template',
	},
	'customPromptTemplates.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a custom AI prompt template',
	},
	'crmActions.listPhoneNumbers': {
		riskLevel: 'read',
		description: "List the workspace's phone numbers",
	},
	'crmActions.deletePhoneNumber': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Release a phone number from the workspace and its provider',
	},
	'engageItems.list': {
		riskLevel: 'read',
		description:
			'List Engage items: campaigns, AI agents, automations, broadcasts and journeys in one list',
	},
	'engageItems.deleteMany': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete up to 100 AI agents or automations from Engage at once',
	},
	'domainForwarding.get': {
		riskLevel: 'read',
		description:
			'Get the web forwarding set on a domain ordered through Instantly',
	},
	'domainForwarding.set': {
		riskLevel: 'write',
		description:
			'Forward web visits to a domain ordered through Instantly to another domain',
	},
	'domainForwarding.remove': {
		riskLevel: 'destructive',
		description:
			"Remove a domain's web forwarding. Limited to 10 requests a minute",
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof instantlyEndpointsNested
>;

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
		errorHandlers: mergeErrorHandlers(errorHandlers, options.errorHandlers),
		keyBuilder: async (ctx: InstantlyKeyBuilderContext, source) => {
			if (source === 'webhook') {
				// An empty key makes verification fail closed with a clear error.
				return (await resolveWebhookSecret(options, ctx.keys)) ?? '';
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
