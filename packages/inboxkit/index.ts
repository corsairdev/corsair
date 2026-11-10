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
	Account,
	Billing,
	ClientIdRequests,
	Cloudflare,
	ConsentRequests,
	Dns,
	Domains,
	EmailInsights,
	Forwarding,
	InboxPlacement,
	InfraGuard,
	Mailboxes,
	Orders,
	Prewarm,
	Sequencers,
	Tags,
	VerifiedDomains,
	Warmup,
	Workspaces,
} from './endpoints';
import type {
	InboxkitEndpointInputs,
	InboxkitEndpointOutputs,
} from './endpoints/types';
import {
	InboxkitEndpointInputSchemas,
	InboxkitEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';
import { InboxkitSchema } from './schema';
import { StatusWebhooks } from './webhooks';
import { matchInboxkitTenantWebhook } from './webhooks/tenant-matcher';
import type {
	ClientIdRequestStatusChangedPayload,
	ConsentRequestStatusChangedPayload,
	DomainStatusChangedPayload,
	InboxkitWebhookOutputs,
	MailboxStatusChangedPayload,
} from './webhooks/types';
import {
	ClientIdRequestStatusChangedEventSchema,
	ClientIdRequestStatusChangedPayloadSchema,
	ConsentRequestStatusChangedEventSchema,
	ConsentRequestStatusChangedPayloadSchema,
	DomainStatusChangedEventSchema,
	DomainStatusChangedPayloadSchema,
	isInboxkitWebhook,
	MailboxStatusChangedEventSchema,
	MailboxStatusChangedPayloadSchema,
} from './webhooks/types';

export type InboxkitPluginOptions = {
	authType?: PickAuth<'api_key'>;
	/** A team API key from Settings → API in InboxKit. Overrides the stored key. */
	key?: string;
	/**
	 * The workspace uid to use when a call names none. Without it, a team with
	 * one workspace uses that one, and a team with several has to name one.
	 */
	workspaceId?: string;
	hooks?: InternalInboxkitPlugin['hooks'];
	webhookHooks?: InternalInboxkitPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof inboxkitEndpointsNested>;
};

export type InboxkitContext = CorsairPluginContext<
	typeof InboxkitSchema,
	InboxkitPluginOptions
>;

export type InboxkitKeyBuilderContext =
	KeyBuilderContext<InboxkitPluginOptions>;

export type InboxkitBoundEndpoints = BindEndpoints<
	typeof inboxkitEndpointsNested
>;

type InboxkitEndpoint<K extends keyof InboxkitEndpointOutputs> =
	CorsairEndpoint<
		InboxkitContext,
		InboxkitEndpointInputs[K],
		InboxkitEndpointOutputs[K]
	>;

export type InboxkitEndpoints = {
	accountGet: InboxkitEndpoint<'accountGet'>;
	billingGetWallet: InboxkitEndpoint<'billingGetWallet'>;
	billingAddCredits: InboxkitEndpoint<'billingAddCredits'>;
	billingGetWalletLogs: InboxkitEndpoint<'billingGetWalletLogs'>;
	billingGetPaymentStatus: InboxkitEndpoint<'billingGetPaymentStatus'>;
	billingListTransactions: InboxkitEndpoint<'billingListTransactions'>;
	billingUpdateAutoTopup: InboxkitEndpoint<'billingUpdateAutoTopup'>;
	billingGetPortalLink: InboxkitEndpoint<'billingGetPortalLink'>;
	billingGetPricingPlans: InboxkitEndpoint<'billingGetPricingPlans'>;
	billingGetSubscription: InboxkitEndpoint<'billingGetSubscription'>;
	billingChangeSubscription: InboxkitEndpoint<'billingChangeSubscription'>;
	billingCancelSubscription: InboxkitEndpoint<'billingCancelSubscription'>;
	workspacesList: InboxkitEndpoint<'workspacesList'>;
	workspacesGet: InboxkitEndpoint<'workspacesGet'>;
	workspacesCreate: InboxkitEndpoint<'workspacesCreate'>;
	workspacesUpdate: InboxkitEndpoint<'workspacesUpdate'>;
	workspacesDelete: InboxkitEndpoint<'workspacesDelete'>;
	workspacesUpdateWebhook: InboxkitEndpoint<'workspacesUpdateWebhook'>;
	workspacesInviteMember: InboxkitEndpoint<'workspacesInviteMember'>;
	domainsList: InboxkitEndpoint<'domainsList'>;
	domainsListAssignable: InboxkitEndpoint<'domainsListAssignable'>;
	domainsCheckAvailability: InboxkitEndpoint<'domainsCheckAvailability'>;
	domainsCheckBanned: InboxkitEndpoint<'domainsCheckBanned'>;
	domainsSearch: InboxkitEndpoint<'domainsSearch'>;
	domainsCheckWorkspaceAvailability: InboxkitEndpoint<'domainsCheckWorkspaceAvailability'>;
	domainsRegister: InboxkitEndpoint<'domainsRegister'>;
	domainsRemove: InboxkitEndpoint<'domainsRemove'>;
	domainsSetForwarding: InboxkitEndpoint<'domainsSetForwarding'>;
	domainsSetCatchAll: InboxkitEndpoint<'domainsSetCatchAll'>;
	domainsRemoveCatchAll: InboxkitEndpoint<'domainsRemoveCatchAll'>;
	domainsSetDmarc: InboxkitEndpoint<'domainsSetDmarc'>;
	domainsRemoveDmarc: InboxkitEndpoint<'domainsRemoveDmarc'>;
	domainsConnect: InboxkitEndpoint<'domainsConnect'>;
	domainsCheckPropagation: InboxkitEndpoint<'domainsCheckPropagation'>;
	domainsRegenerateNameservers: InboxkitEndpoint<'domainsRegenerateNameservers'>;
	domainsUpdatePrivacy: InboxkitEndpoint<'domainsUpdatePrivacy'>;
	domainsUpdateContacts: InboxkitEndpoint<'domainsUpdateContacts'>;
	domainsRequestRenewal: InboxkitEndpoint<'domainsRequestRenewal'>;
	domainsGetRenewalStatus: InboxkitEndpoint<'domainsGetRenewalStatus'>;
	domainsMoveWorkspace: InboxkitEndpoint<'domainsMoveWorkspace'>;
	domainsPreviewMove: InboxkitEndpoint<'domainsPreviewMove'>;
	domainsGetMoveStatus: InboxkitEndpoint<'domainsGetMoveStatus'>;
	domainsRotate: InboxkitEndpoint<'domainsRotate'>;
	domainsPreviewRotation: InboxkitEndpoint<'domainsPreviewRotation'>;
	domainsGetRotationStatus: InboxkitEndpoint<'domainsGetRotationStatus'>;
	cloudflareConnect: InboxkitEndpoint<'cloudflareConnect'>;
	cloudflareList: InboxkitEndpoint<'cloudflareList'>;
	cloudflareGet: InboxkitEndpoint<'cloudflareGet'>;
	cloudflareDisconnect: InboxkitEndpoint<'cloudflareDisconnect'>;
	cloudflareListZones: InboxkitEndpoint<'cloudflareListZones'>;
	dnsList: InboxkitEndpoint<'dnsList'>;
	dnsAdd: InboxkitEndpoint<'dnsAdd'>;
	dnsUpdate: InboxkitEndpoint<'dnsUpdate'>;
	dnsDeleteRecords: InboxkitEndpoint<'dnsDeleteRecords'>;
	dnsVerify: InboxkitEndpoint<'dnsVerify'>;
	dnsRepair: InboxkitEndpoint<'dnsRepair'>;
	mailboxesList: InboxkitEndpoint<'mailboxesList'>;
	mailboxesGet: InboxkitEndpoint<'mailboxesGet'>;
	mailboxesCheckAvailability: InboxkitEndpoint<'mailboxesCheckAvailability'>;
	mailboxesGetStatus: InboxkitEndpoint<'mailboxesGetStatus'>;
	mailboxesGetFailureReason: InboxkitEndpoint<'mailboxesGetFailureReason'>;
	mailboxesBuy: InboxkitEndpoint<'mailboxesBuy'>;
	mailboxesCancel: InboxkitEndpoint<'mailboxesCancel'>;
	mailboxesUncancel: InboxkitEndpoint<'mailboxesUncancel'>;
	mailboxesReactivate: InboxkitEndpoint<'mailboxesReactivate'>;
	mailboxesReactivateRebuy: InboxkitEndpoint<'mailboxesReactivateRebuy'>;
	mailboxesUpdate: InboxkitEndpoint<'mailboxesUpdate'>;
	mailboxesUpdateProfilePicture: InboxkitEndpoint<'mailboxesUpdateProfilePicture'>;
	mailboxesChangeUsername: InboxkitEndpoint<'mailboxesChangeUsername'>;
	mailboxesChangePassword: InboxkitEndpoint<'mailboxesChangePassword'>;
	mailboxesShowCredentials: InboxkitEndpoint<'mailboxesShowCredentials'>;
	mailboxesGenerateTotp: InboxkitEndpoint<'mailboxesGenerateTotp'>;
	mailboxesAddSignature: InboxkitEndpoint<'mailboxesAddSignature'>;
	mailboxesDeleteSignature: InboxkitEndpoint<'mailboxesDeleteSignature'>;
	mailboxesResetup: InboxkitEndpoint<'mailboxesResetup'>;
	mailboxesGetResetupStatus: InboxkitEndpoint<'mailboxesGetResetupStatus'>;
	forwardingGetCapabilities: InboxkitEndpoint<'forwardingGetCapabilities'>;
	forwardingSetup: InboxkitEndpoint<'forwardingSetup'>;
	forwardingSetupAdvanced: InboxkitEndpoint<'forwardingSetupAdvanced'>;
	forwardingUpdate: InboxkitEndpoint<'forwardingUpdate'>;
	forwardingRemove: InboxkitEndpoint<'forwardingRemove'>;
	forwardingListJobs: InboxkitEndpoint<'forwardingListJobs'>;
	forwardingListRules: InboxkitEndpoint<'forwardingListRules'>;
	forwardingGetRule: InboxkitEndpoint<'forwardingGetRule'>;
	forwardingUpdateRule: InboxkitEndpoint<'forwardingUpdateRule'>;
	forwardingDeleteRule: InboxkitEndpoint<'forwardingDeleteRule'>;
	sequencersListPlatforms: InboxkitEndpoint<'sequencersListPlatforms'>;
	sequencersList: InboxkitEndpoint<'sequencersList'>;
	sequencersGetTags: InboxkitEndpoint<'sequencersGetTags'>;
	sequencersAdd: InboxkitEndpoint<'sequencersAdd'>;
	sequencersUpdate: InboxkitEndpoint<'sequencersUpdate'>;
	sequencersDelete: InboxkitEndpoint<'sequencersDelete'>;
	sequencersExportMailboxes: InboxkitEndpoint<'sequencersExportMailboxes'>;
	sequencersGetExportStatus: InboxkitEndpoint<'sequencersGetExportStatus'>;
	sequencersVerifyLemlistOtp: InboxkitEndpoint<'sequencersVerifyLemlistOtp'>;
	warmupList: InboxkitEndpoint<'warmupList'>;
	warmupGet: InboxkitEndpoint<'warmupGet'>;
	warmupGetStats: InboxkitEndpoint<'warmupGetStats'>;
	warmupGetPricing: InboxkitEndpoint<'warmupGetPricing'>;
	warmupAdd: InboxkitEndpoint<'warmupAdd'>;
	warmupPause: InboxkitEndpoint<'warmupPause'>;
	warmupResume: InboxkitEndpoint<'warmupResume'>;
	warmupCancel: InboxkitEndpoint<'warmupCancel'>;
	warmupUpdateSettings: InboxkitEndpoint<'warmupUpdateSettings'>;
	warmupCreateConnectLink: InboxkitEndpoint<'warmupCreateConnectLink'>;
	warmupGetConnectLink: InboxkitEndpoint<'warmupGetConnectLink'>;
	warmupAddSmtpMailboxes: InboxkitEndpoint<'warmupAddSmtpMailboxes'>;
	warmupListConnectedMailboxes: InboxkitEndpoint<'warmupListConnectedMailboxes'>;
	warmupDisconnectMailbox: InboxkitEndpoint<'warmupDisconnectMailbox'>;
	consentRequestsInitiate: InboxkitEndpoint<'consentRequestsInitiate'>;
	consentRequestsGetStatus: InboxkitEndpoint<'consentRequestsGetStatus'>;
	consentRequestsList: InboxkitEndpoint<'consentRequestsList'>;
	clientIdRequestsInitiate: InboxkitEndpoint<'clientIdRequestsInitiate'>;
	clientIdRequestsGetStatus: InboxkitEndpoint<'clientIdRequestsGetStatus'>;
	clientIdRequestsList: InboxkitEndpoint<'clientIdRequestsList'>;
	tagsList: InboxkitEndpoint<'tagsList'>;
	tagsCreate: InboxkitEndpoint<'tagsCreate'>;
	tagsAssign: InboxkitEndpoint<'tagsAssign'>;
	tagsDelete: InboxkitEndpoint<'tagsDelete'>;
	prewarmSearchDomains: InboxkitEndpoint<'prewarmSearchDomains'>;
	prewarmSearchMailboxes: InboxkitEndpoint<'prewarmSearchMailboxes'>;
	prewarmCheckAvailability: InboxkitEndpoint<'prewarmCheckAvailability'>;
	prewarmBuy: InboxkitEndpoint<'prewarmBuy'>;
	prewarmGetOrderStatus: InboxkitEndpoint<'prewarmGetOrderStatus'>;
	ordersPlace: InboxkitEndpoint<'ordersPlace'>;
	inboxPlacementCreateTest: InboxkitEndpoint<'inboxPlacementCreateTest'>;
	inboxPlacementListTests: InboxkitEndpoint<'inboxPlacementListTests'>;
	inboxPlacementGetTest: InboxkitEndpoint<'inboxPlacementGetTest'>;
	inboxPlacementListScheduled: InboxkitEndpoint<'inboxPlacementListScheduled'>;
	inboxPlacementGetScheduled: InboxkitEndpoint<'inboxPlacementGetScheduled'>;
	inboxPlacementPauseScheduled: InboxkitEndpoint<'inboxPlacementPauseScheduled'>;
	inboxPlacementResumeScheduled: InboxkitEndpoint<'inboxPlacementResumeScheduled'>;
	inboxPlacementDeleteScheduled: InboxkitEndpoint<'inboxPlacementDeleteScheduled'>;
	infraGuardList: InboxkitEndpoint<'infraGuardList'>;
	infraGuardGet: InboxkitEndpoint<'infraGuardGet'>;
	infraGuardEnable: InboxkitEndpoint<'infraGuardEnable'>;
	infraGuardCancel: InboxkitEndpoint<'infraGuardCancel'>;
	infraGuardGetStats: InboxkitEndpoint<'infraGuardGetStats'>;
	infraGuardGetPricing: InboxkitEndpoint<'infraGuardGetPricing'>;
	infraGuardGetBlacklistHistory: InboxkitEndpoint<'infraGuardGetBlacklistHistory'>;
	infraGuardGetDnsHistory: InboxkitEndpoint<'infraGuardGetDnsHistory'>;
	infraGuardGetBounceMetrics: InboxkitEndpoint<'infraGuardGetBounceMetrics'>;
	infraGuardGetBounceHistory: InboxkitEndpoint<'infraGuardGetBounceHistory'>;
	infraGuardUpdateSettings: InboxkitEndpoint<'infraGuardUpdateSettings'>;
	infraGuardTriggerCheck: InboxkitEndpoint<'infraGuardTriggerCheck'>;
	infraGuardListAlerts: InboxkitEndpoint<'infraGuardListAlerts'>;
	infraGuardAcknowledgeAlert: InboxkitEndpoint<'infraGuardAcknowledgeAlert'>;
	infraGuardResolveAlert: InboxkitEndpoint<'infraGuardResolveAlert'>;
	infraGuardListActionItems: InboxkitEndpoint<'infraGuardListActionItems'>;
	infraGuardGetActionItemStats: InboxkitEndpoint<'infraGuardGetActionItemStats'>;
	infraGuardResolveActionItem: InboxkitEndpoint<'infraGuardResolveActionItem'>;
	infraGuardDismissActionItem: InboxkitEndpoint<'infraGuardDismissActionItem'>;
	emailInsightsGetOverview: InboxkitEndpoint<'emailInsightsGetOverview'>;
	emailInsightsGetMailboxesHealth: InboxkitEndpoint<'emailInsightsGetMailboxesHealth'>;
	emailInsightsGetDailyStats: InboxkitEndpoint<'emailInsightsGetDailyStats'>;
	emailInsightsGetHighBounceMailboxes: InboxkitEndpoint<'emailInsightsGetHighBounceMailboxes'>;
	emailInsightsGetCampaignReplyRate: InboxkitEndpoint<'emailInsightsGetCampaignReplyRate'>;
	emailInsightsGetWorkspaceActivity: InboxkitEndpoint<'emailInsightsGetWorkspaceActivity'>;
	emailInsightsGetMailboxStats: InboxkitEndpoint<'emailInsightsGetMailboxStats'>;
	emailInsightsGetMailboxDeliverability: InboxkitEndpoint<'emailInsightsGetMailboxDeliverability'>;
	emailInsightsGetMailboxHealth: InboxkitEndpoint<'emailInsightsGetMailboxHealth'>;
	emailInsightsGetMailboxTrends: InboxkitEndpoint<'emailInsightsGetMailboxTrends'>;
	emailInsightsGetMailboxBounceEvents: InboxkitEndpoint<'emailInsightsGetMailboxBounceEvents'>;
	emailInsightsGetMailboxActivity: InboxkitEndpoint<'emailInsightsGetMailboxActivity'>;
	emailInsightsGetMailboxTopRecipients: InboxkitEndpoint<'emailInsightsGetMailboxTopRecipients'>;
	emailInsightsGetMailboxTopRecipientDomains: InboxkitEndpoint<'emailInsightsGetMailboxTopRecipientDomains'>;
	emailInsightsGetMailboxMessageBreakdown: InboxkitEndpoint<'emailInsightsGetMailboxMessageBreakdown'>;
	emailInsightsGetMailboxSubjectAnalysis: InboxkitEndpoint<'emailInsightsGetMailboxSubjectAnalysis'>;
	emailInsightsGetMailboxReplyTimeHeatmap: InboxkitEndpoint<'emailInsightsGetMailboxReplyTimeHeatmap'>;
	emailInsightsGetMailboxReplyRateByDomain: InboxkitEndpoint<'emailInsightsGetMailboxReplyRateByDomain'>;
	emailInsightsGetMailboxVelocityOverlay: InboxkitEndpoint<'emailInsightsGetMailboxVelocityOverlay'>;
	emailInsightsGetMailboxWarmupStats: InboxkitEndpoint<'emailInsightsGetMailboxWarmupStats'>;
	emailInsightsGetMailboxAuthFailures: InboxkitEndpoint<'emailInsightsGetMailboxAuthFailures'>;
	emailInsightsGetMailboxFirstTouchFunnel: InboxkitEndpoint<'emailInsightsGetMailboxFirstTouchFunnel'>;
	emailInsightsGetMailboxSendingIpBreakdown: InboxkitEndpoint<'emailInsightsGetMailboxSendingIpBreakdown'>;
	emailInsightsGetMailboxRecipientEspBreakdown: InboxkitEndpoint<'emailInsightsGetMailboxRecipientEspBreakdown'>;
	emailInsightsGetMailboxBodyTemplates: InboxkitEndpoint<'emailInsightsGetMailboxBodyTemplates'>;
	verifiedDomainsList: InboxkitEndpoint<'verifiedDomainsList'>;
	verifiedDomainsAdd: InboxkitEndpoint<'verifiedDomainsAdd'>;
	verifiedDomainsVerify: InboxkitEndpoint<'verifiedDomainsVerify'>;
	verifiedDomainsRemove: InboxkitEndpoint<'verifiedDomainsRemove'>;
};

type InboxkitWebhook<
	K extends keyof InboxkitWebhookOutputs,
	TEvent,
> = CorsairWebhook<InboxkitContext, TEvent, InboxkitWebhookOutputs[K]>;

export type InboxkitWebhooks = {
	domainStatusChanged: InboxkitWebhook<
		'domainStatusChanged',
		DomainStatusChangedPayload
	>;
	mailboxStatusChanged: InboxkitWebhook<
		'mailboxStatusChanged',
		MailboxStatusChangedPayload
	>;
	consentRequestStatusChanged: InboxkitWebhook<
		'consentRequestStatusChanged',
		ConsentRequestStatusChangedPayload
	>;
	clientIdRequestStatusChanged: InboxkitWebhook<
		'clientIdRequestStatusChanged',
		ClientIdRequestStatusChangedPayload
	>;
};

export type InboxkitBoundWebhooks = BindWebhooks<typeof inboxkitWebhooksNested>;

const inboxkitEndpointsNested = {
	account: {
		get: Account.get,
	},
	billing: {
		getWallet: Billing.getWallet,
		addCredits: Billing.addCredits,
		getWalletLogs: Billing.getWalletLogs,
		getPaymentStatus: Billing.getPaymentStatus,
		listTransactions: Billing.listTransactions,
		updateAutoTopup: Billing.updateAutoTopup,
		getPortalLink: Billing.getPortalLink,
		getPricingPlans: Billing.getPricingPlans,
		getSubscription: Billing.getSubscription,
		changeSubscription: Billing.changeSubscription,
		cancelSubscription: Billing.cancelSubscription,
	},
	workspaces: {
		list: Workspaces.list,
		get: Workspaces.get,
		create: Workspaces.create,
		update: Workspaces.update,
		delete: Workspaces.delete,
		updateWebhook: Workspaces.updateWebhook,
		inviteMember: Workspaces.inviteMember,
	},
	domains: {
		list: Domains.list,
		listAssignable: Domains.listAssignable,
		checkAvailability: Domains.checkAvailability,
		checkBanned: Domains.checkBanned,
		search: Domains.search,
		checkWorkspaceAvailability: Domains.checkWorkspaceAvailability,
		register: Domains.register,
		remove: Domains.remove,
		setForwarding: Domains.setForwarding,
		setCatchAll: Domains.setCatchAll,
		removeCatchAll: Domains.removeCatchAll,
		setDmarc: Domains.setDmarc,
		removeDmarc: Domains.removeDmarc,
		connect: Domains.connect,
		checkPropagation: Domains.checkPropagation,
		regenerateNameservers: Domains.regenerateNameservers,
		updatePrivacy: Domains.updatePrivacy,
		updateContacts: Domains.updateContacts,
		requestRenewal: Domains.requestRenewal,
		getRenewalStatus: Domains.getRenewalStatus,
		moveWorkspace: Domains.moveWorkspace,
		previewMove: Domains.previewMove,
		getMoveStatus: Domains.getMoveStatus,
		rotate: Domains.rotate,
		previewRotation: Domains.previewRotation,
		getRotationStatus: Domains.getRotationStatus,
	},
	cloudflare: {
		connect: Cloudflare.connect,
		list: Cloudflare.list,
		get: Cloudflare.get,
		disconnect: Cloudflare.disconnect,
		listZones: Cloudflare.listZones,
	},
	dns: {
		list: Dns.list,
		add: Dns.add,
		update: Dns.update,
		deleteRecords: Dns.deleteRecords,
		verify: Dns.verify,
		repair: Dns.repair,
	},
	mailboxes: {
		list: Mailboxes.list,
		get: Mailboxes.get,
		checkAvailability: Mailboxes.checkAvailability,
		getStatus: Mailboxes.getStatus,
		getFailureReason: Mailboxes.getFailureReason,
		buy: Mailboxes.buy,
		cancel: Mailboxes.cancel,
		uncancel: Mailboxes.uncancel,
		reactivate: Mailboxes.reactivate,
		reactivateRebuy: Mailboxes.reactivateRebuy,
		update: Mailboxes.update,
		updateProfilePicture: Mailboxes.updateProfilePicture,
		changeUsername: Mailboxes.changeUsername,
		changePassword: Mailboxes.changePassword,
		showCredentials: Mailboxes.showCredentials,
		generateTotp: Mailboxes.generateTotp,
		addSignature: Mailboxes.addSignature,
		deleteSignature: Mailboxes.deleteSignature,
		resetup: Mailboxes.resetup,
		getResetupStatus: Mailboxes.getResetupStatus,
	},
	forwarding: {
		getCapabilities: Forwarding.getCapabilities,
		setup: Forwarding.setup,
		setupAdvanced: Forwarding.setupAdvanced,
		update: Forwarding.update,
		remove: Forwarding.remove,
		listJobs: Forwarding.listJobs,
		listRules: Forwarding.listRules,
		getRule: Forwarding.getRule,
		updateRule: Forwarding.updateRule,
		deleteRule: Forwarding.deleteRule,
	},
	sequencers: {
		listPlatforms: Sequencers.listPlatforms,
		list: Sequencers.list,
		getTags: Sequencers.getTags,
		add: Sequencers.add,
		update: Sequencers.update,
		delete: Sequencers.delete,
		exportMailboxes: Sequencers.exportMailboxes,
		getExportStatus: Sequencers.getExportStatus,
		verifyLemlistOtp: Sequencers.verifyLemlistOtp,
	},
	warmup: {
		list: Warmup.list,
		get: Warmup.get,
		getStats: Warmup.getStats,
		getPricing: Warmup.getPricing,
		add: Warmup.add,
		pause: Warmup.pause,
		resume: Warmup.resume,
		cancel: Warmup.cancel,
		updateSettings: Warmup.updateSettings,
		createConnectLink: Warmup.createConnectLink,
		getConnectLink: Warmup.getConnectLink,
		addSmtpMailboxes: Warmup.addSmtpMailboxes,
		listConnectedMailboxes: Warmup.listConnectedMailboxes,
		disconnectMailbox: Warmup.disconnectMailbox,
	},
	consentRequests: {
		initiate: ConsentRequests.initiate,
		getStatus: ConsentRequests.getStatus,
		list: ConsentRequests.list,
	},
	clientIdRequests: {
		initiate: ClientIdRequests.initiate,
		getStatus: ClientIdRequests.getStatus,
		list: ClientIdRequests.list,
	},
	tags: {
		list: Tags.list,
		create: Tags.create,
		assign: Tags.assign,
		delete: Tags.delete,
	},
	prewarm: {
		searchDomains: Prewarm.searchDomains,
		searchMailboxes: Prewarm.searchMailboxes,
		checkAvailability: Prewarm.checkAvailability,
		buy: Prewarm.buy,
		getOrderStatus: Prewarm.getOrderStatus,
	},
	orders: {
		place: Orders.place,
	},
	inboxPlacement: {
		createTest: InboxPlacement.createTest,
		listTests: InboxPlacement.listTests,
		getTest: InboxPlacement.getTest,
		listScheduled: InboxPlacement.listScheduled,
		getScheduled: InboxPlacement.getScheduled,
		pauseScheduled: InboxPlacement.pauseScheduled,
		resumeScheduled: InboxPlacement.resumeScheduled,
		deleteScheduled: InboxPlacement.deleteScheduled,
	},
	infraGuard: {
		list: InfraGuard.list,
		get: InfraGuard.get,
		enable: InfraGuard.enable,
		cancel: InfraGuard.cancel,
		getStats: InfraGuard.getStats,
		getPricing: InfraGuard.getPricing,
		getBlacklistHistory: InfraGuard.getBlacklistHistory,
		getDnsHistory: InfraGuard.getDnsHistory,
		getBounceMetrics: InfraGuard.getBounceMetrics,
		getBounceHistory: InfraGuard.getBounceHistory,
		updateSettings: InfraGuard.updateSettings,
		triggerCheck: InfraGuard.triggerCheck,
		listAlerts: InfraGuard.listAlerts,
		acknowledgeAlert: InfraGuard.acknowledgeAlert,
		resolveAlert: InfraGuard.resolveAlert,
		listActionItems: InfraGuard.listActionItems,
		getActionItemStats: InfraGuard.getActionItemStats,
		resolveActionItem: InfraGuard.resolveActionItem,
		dismissActionItem: InfraGuard.dismissActionItem,
	},
	emailInsights: {
		getOverview: EmailInsights.getOverview,
		getMailboxesHealth: EmailInsights.getMailboxesHealth,
		getDailyStats: EmailInsights.getDailyStats,
		getHighBounceMailboxes: EmailInsights.getHighBounceMailboxes,
		getCampaignReplyRate: EmailInsights.getCampaignReplyRate,
		getWorkspaceActivity: EmailInsights.getWorkspaceActivity,
		getMailboxStats: EmailInsights.getMailboxStats,
		getMailboxDeliverability: EmailInsights.getMailboxDeliverability,
		getMailboxHealth: EmailInsights.getMailboxHealth,
		getMailboxTrends: EmailInsights.getMailboxTrends,
		getMailboxBounceEvents: EmailInsights.getMailboxBounceEvents,
		getMailboxActivity: EmailInsights.getMailboxActivity,
		getMailboxTopRecipients: EmailInsights.getMailboxTopRecipients,
		getMailboxTopRecipientDomains: EmailInsights.getMailboxTopRecipientDomains,
		getMailboxMessageBreakdown: EmailInsights.getMailboxMessageBreakdown,
		getMailboxSubjectAnalysis: EmailInsights.getMailboxSubjectAnalysis,
		getMailboxReplyTimeHeatmap: EmailInsights.getMailboxReplyTimeHeatmap,
		getMailboxReplyRateByDomain: EmailInsights.getMailboxReplyRateByDomain,
		getMailboxVelocityOverlay: EmailInsights.getMailboxVelocityOverlay,
		getMailboxWarmupStats: EmailInsights.getMailboxWarmupStats,
		getMailboxAuthFailures: EmailInsights.getMailboxAuthFailures,
		getMailboxFirstTouchFunnel: EmailInsights.getMailboxFirstTouchFunnel,
		getMailboxSendingIpBreakdown: EmailInsights.getMailboxSendingIpBreakdown,
		getMailboxRecipientEspBreakdown:
			EmailInsights.getMailboxRecipientEspBreakdown,
		getMailboxBodyTemplates: EmailInsights.getMailboxBodyTemplates,
	},
	verifiedDomains: {
		list: VerifiedDomains.list,
		add: VerifiedDomains.add,
		verify: VerifiedDomains.verify,
		remove: VerifiedDomains.remove,
	},
} as const;

const inboxkitWebhooksNested = {
	domains: { statusChanged: StatusWebhooks.domainStatusChanged },
	mailboxes: { statusChanged: StatusWebhooks.mailboxStatusChanged },
	consentRequests: {
		statusChanged: StatusWebhooks.consentRequestStatusChanged,
	},
	clientIdRequests: {
		statusChanged: StatusWebhooks.clientIdRequestStatusChanged,
	},
} as const;

export const inboxkitEndpointSchemas = {
	'account.get': {
		input: InboxkitEndpointInputSchemas.accountGet,
		output: InboxkitEndpointOutputSchemas.accountGet,
	},
	'billing.getWallet': {
		input: InboxkitEndpointInputSchemas.billingGetWallet,
		output: InboxkitEndpointOutputSchemas.billingGetWallet,
	},
	'billing.addCredits': {
		input: InboxkitEndpointInputSchemas.billingAddCredits,
		output: InboxkitEndpointOutputSchemas.billingAddCredits,
	},
	'billing.getWalletLogs': {
		input: InboxkitEndpointInputSchemas.billingGetWalletLogs,
		output: InboxkitEndpointOutputSchemas.billingGetWalletLogs,
	},
	'billing.getPaymentStatus': {
		input: InboxkitEndpointInputSchemas.billingGetPaymentStatus,
		output: InboxkitEndpointOutputSchemas.billingGetPaymentStatus,
	},
	'billing.listTransactions': {
		input: InboxkitEndpointInputSchemas.billingListTransactions,
		output: InboxkitEndpointOutputSchemas.billingListTransactions,
	},
	'billing.updateAutoTopup': {
		input: InboxkitEndpointInputSchemas.billingUpdateAutoTopup,
		output: InboxkitEndpointOutputSchemas.billingUpdateAutoTopup,
	},
	'billing.getPortalLink': {
		input: InboxkitEndpointInputSchemas.billingGetPortalLink,
		output: InboxkitEndpointOutputSchemas.billingGetPortalLink,
	},
	'billing.getPricingPlans': {
		input: InboxkitEndpointInputSchemas.billingGetPricingPlans,
		output: InboxkitEndpointOutputSchemas.billingGetPricingPlans,
	},
	'billing.getSubscription': {
		input: InboxkitEndpointInputSchemas.billingGetSubscription,
		output: InboxkitEndpointOutputSchemas.billingGetSubscription,
	},
	'billing.changeSubscription': {
		input: InboxkitEndpointInputSchemas.billingChangeSubscription,
		output: InboxkitEndpointOutputSchemas.billingChangeSubscription,
	},
	'billing.cancelSubscription': {
		input: InboxkitEndpointInputSchemas.billingCancelSubscription,
		output: InboxkitEndpointOutputSchemas.billingCancelSubscription,
	},
	'workspaces.list': {
		input: InboxkitEndpointInputSchemas.workspacesList,
		output: InboxkitEndpointOutputSchemas.workspacesList,
	},
	'workspaces.get': {
		input: InboxkitEndpointInputSchemas.workspacesGet,
		output: InboxkitEndpointOutputSchemas.workspacesGet,
	},
	'workspaces.create': {
		input: InboxkitEndpointInputSchemas.workspacesCreate,
		output: InboxkitEndpointOutputSchemas.workspacesCreate,
	},
	'workspaces.update': {
		input: InboxkitEndpointInputSchemas.workspacesUpdate,
		output: InboxkitEndpointOutputSchemas.workspacesUpdate,
	},
	'workspaces.delete': {
		input: InboxkitEndpointInputSchemas.workspacesDelete,
		output: InboxkitEndpointOutputSchemas.workspacesDelete,
	},
	'workspaces.updateWebhook': {
		input: InboxkitEndpointInputSchemas.workspacesUpdateWebhook,
		output: InboxkitEndpointOutputSchemas.workspacesUpdateWebhook,
	},
	'workspaces.inviteMember': {
		input: InboxkitEndpointInputSchemas.workspacesInviteMember,
		output: InboxkitEndpointOutputSchemas.workspacesInviteMember,
	},
	'domains.list': {
		input: InboxkitEndpointInputSchemas.domainsList,
		output: InboxkitEndpointOutputSchemas.domainsList,
	},
	'domains.listAssignable': {
		input: InboxkitEndpointInputSchemas.domainsListAssignable,
		output: InboxkitEndpointOutputSchemas.domainsListAssignable,
	},
	'domains.checkAvailability': {
		input: InboxkitEndpointInputSchemas.domainsCheckAvailability,
		output: InboxkitEndpointOutputSchemas.domainsCheckAvailability,
	},
	'domains.checkBanned': {
		input: InboxkitEndpointInputSchemas.domainsCheckBanned,
		output: InboxkitEndpointOutputSchemas.domainsCheckBanned,
	},
	'domains.search': {
		input: InboxkitEndpointInputSchemas.domainsSearch,
		output: InboxkitEndpointOutputSchemas.domainsSearch,
	},
	'domains.checkWorkspaceAvailability': {
		input: InboxkitEndpointInputSchemas.domainsCheckWorkspaceAvailability,
		output: InboxkitEndpointOutputSchemas.domainsCheckWorkspaceAvailability,
	},
	'domains.register': {
		input: InboxkitEndpointInputSchemas.domainsRegister,
		output: InboxkitEndpointOutputSchemas.domainsRegister,
	},
	'domains.remove': {
		input: InboxkitEndpointInputSchemas.domainsRemove,
		output: InboxkitEndpointOutputSchemas.domainsRemove,
	},
	'domains.setForwarding': {
		input: InboxkitEndpointInputSchemas.domainsSetForwarding,
		output: InboxkitEndpointOutputSchemas.domainsSetForwarding,
	},
	'domains.setCatchAll': {
		input: InboxkitEndpointInputSchemas.domainsSetCatchAll,
		output: InboxkitEndpointOutputSchemas.domainsSetCatchAll,
	},
	'domains.removeCatchAll': {
		input: InboxkitEndpointInputSchemas.domainsRemoveCatchAll,
		output: InboxkitEndpointOutputSchemas.domainsRemoveCatchAll,
	},
	'domains.setDmarc': {
		input: InboxkitEndpointInputSchemas.domainsSetDmarc,
		output: InboxkitEndpointOutputSchemas.domainsSetDmarc,
	},
	'domains.removeDmarc': {
		input: InboxkitEndpointInputSchemas.domainsRemoveDmarc,
		output: InboxkitEndpointOutputSchemas.domainsRemoveDmarc,
	},
	'domains.connect': {
		input: InboxkitEndpointInputSchemas.domainsConnect,
		output: InboxkitEndpointOutputSchemas.domainsConnect,
	},
	'domains.checkPropagation': {
		input: InboxkitEndpointInputSchemas.domainsCheckPropagation,
		output: InboxkitEndpointOutputSchemas.domainsCheckPropagation,
	},
	'domains.regenerateNameservers': {
		input: InboxkitEndpointInputSchemas.domainsRegenerateNameservers,
		output: InboxkitEndpointOutputSchemas.domainsRegenerateNameservers,
	},
	'domains.updatePrivacy': {
		input: InboxkitEndpointInputSchemas.domainsUpdatePrivacy,
		output: InboxkitEndpointOutputSchemas.domainsUpdatePrivacy,
	},
	'domains.updateContacts': {
		input: InboxkitEndpointInputSchemas.domainsUpdateContacts,
		output: InboxkitEndpointOutputSchemas.domainsUpdateContacts,
	},
	'domains.requestRenewal': {
		input: InboxkitEndpointInputSchemas.domainsRequestRenewal,
		output: InboxkitEndpointOutputSchemas.domainsRequestRenewal,
	},
	'domains.getRenewalStatus': {
		input: InboxkitEndpointInputSchemas.domainsGetRenewalStatus,
		output: InboxkitEndpointOutputSchemas.domainsGetRenewalStatus,
	},
	'domains.moveWorkspace': {
		input: InboxkitEndpointInputSchemas.domainsMoveWorkspace,
		output: InboxkitEndpointOutputSchemas.domainsMoveWorkspace,
	},
	'domains.previewMove': {
		input: InboxkitEndpointInputSchemas.domainsPreviewMove,
		output: InboxkitEndpointOutputSchemas.domainsPreviewMove,
	},
	'domains.getMoveStatus': {
		input: InboxkitEndpointInputSchemas.domainsGetMoveStatus,
		output: InboxkitEndpointOutputSchemas.domainsGetMoveStatus,
	},
	'domains.rotate': {
		input: InboxkitEndpointInputSchemas.domainsRotate,
		output: InboxkitEndpointOutputSchemas.domainsRotate,
	},
	'domains.previewRotation': {
		input: InboxkitEndpointInputSchemas.domainsPreviewRotation,
		output: InboxkitEndpointOutputSchemas.domainsPreviewRotation,
	},
	'domains.getRotationStatus': {
		input: InboxkitEndpointInputSchemas.domainsGetRotationStatus,
		output: InboxkitEndpointOutputSchemas.domainsGetRotationStatus,
	},
	'cloudflare.connect': {
		input: InboxkitEndpointInputSchemas.cloudflareConnect,
		output: InboxkitEndpointOutputSchemas.cloudflareConnect,
	},
	'cloudflare.list': {
		input: InboxkitEndpointInputSchemas.cloudflareList,
		output: InboxkitEndpointOutputSchemas.cloudflareList,
	},
	'cloudflare.get': {
		input: InboxkitEndpointInputSchemas.cloudflareGet,
		output: InboxkitEndpointOutputSchemas.cloudflareGet,
	},
	'cloudflare.disconnect': {
		input: InboxkitEndpointInputSchemas.cloudflareDisconnect,
		output: InboxkitEndpointOutputSchemas.cloudflareDisconnect,
	},
	'cloudflare.listZones': {
		input: InboxkitEndpointInputSchemas.cloudflareListZones,
		output: InboxkitEndpointOutputSchemas.cloudflareListZones,
	},
	'dns.list': {
		input: InboxkitEndpointInputSchemas.dnsList,
		output: InboxkitEndpointOutputSchemas.dnsList,
	},
	'dns.add': {
		input: InboxkitEndpointInputSchemas.dnsAdd,
		output: InboxkitEndpointOutputSchemas.dnsAdd,
	},
	'dns.update': {
		input: InboxkitEndpointInputSchemas.dnsUpdate,
		output: InboxkitEndpointOutputSchemas.dnsUpdate,
	},
	'dns.deleteRecords': {
		input: InboxkitEndpointInputSchemas.dnsDeleteRecords,
		output: InboxkitEndpointOutputSchemas.dnsDeleteRecords,
	},
	'dns.verify': {
		input: InboxkitEndpointInputSchemas.dnsVerify,
		output: InboxkitEndpointOutputSchemas.dnsVerify,
	},
	'dns.repair': {
		input: InboxkitEndpointInputSchemas.dnsRepair,
		output: InboxkitEndpointOutputSchemas.dnsRepair,
	},
	'mailboxes.list': {
		input: InboxkitEndpointInputSchemas.mailboxesList,
		output: InboxkitEndpointOutputSchemas.mailboxesList,
	},
	'mailboxes.get': {
		input: InboxkitEndpointInputSchemas.mailboxesGet,
		output: InboxkitEndpointOutputSchemas.mailboxesGet,
	},
	'mailboxes.checkAvailability': {
		input: InboxkitEndpointInputSchemas.mailboxesCheckAvailability,
		output: InboxkitEndpointOutputSchemas.mailboxesCheckAvailability,
	},
	'mailboxes.getStatus': {
		input: InboxkitEndpointInputSchemas.mailboxesGetStatus,
		output: InboxkitEndpointOutputSchemas.mailboxesGetStatus,
	},
	'mailboxes.getFailureReason': {
		input: InboxkitEndpointInputSchemas.mailboxesGetFailureReason,
		output: InboxkitEndpointOutputSchemas.mailboxesGetFailureReason,
	},
	'mailboxes.buy': {
		input: InboxkitEndpointInputSchemas.mailboxesBuy,
		output: InboxkitEndpointOutputSchemas.mailboxesBuy,
	},
	'mailboxes.cancel': {
		input: InboxkitEndpointInputSchemas.mailboxesCancel,
		output: InboxkitEndpointOutputSchemas.mailboxesCancel,
	},
	'mailboxes.uncancel': {
		input: InboxkitEndpointInputSchemas.mailboxesUncancel,
		output: InboxkitEndpointOutputSchemas.mailboxesUncancel,
	},
	'mailboxes.reactivate': {
		input: InboxkitEndpointInputSchemas.mailboxesReactivate,
		output: InboxkitEndpointOutputSchemas.mailboxesReactivate,
	},
	'mailboxes.reactivateRebuy': {
		input: InboxkitEndpointInputSchemas.mailboxesReactivateRebuy,
		output: InboxkitEndpointOutputSchemas.mailboxesReactivateRebuy,
	},
	'mailboxes.update': {
		input: InboxkitEndpointInputSchemas.mailboxesUpdate,
		output: InboxkitEndpointOutputSchemas.mailboxesUpdate,
	},
	'mailboxes.updateProfilePicture': {
		input: InboxkitEndpointInputSchemas.mailboxesUpdateProfilePicture,
		output: InboxkitEndpointOutputSchemas.mailboxesUpdateProfilePicture,
	},
	'mailboxes.changeUsername': {
		input: InboxkitEndpointInputSchemas.mailboxesChangeUsername,
		output: InboxkitEndpointOutputSchemas.mailboxesChangeUsername,
	},
	'mailboxes.changePassword': {
		input: InboxkitEndpointInputSchemas.mailboxesChangePassword,
		output: InboxkitEndpointOutputSchemas.mailboxesChangePassword,
	},
	'mailboxes.showCredentials': {
		input: InboxkitEndpointInputSchemas.mailboxesShowCredentials,
		output: InboxkitEndpointOutputSchemas.mailboxesShowCredentials,
	},
	'mailboxes.generateTotp': {
		input: InboxkitEndpointInputSchemas.mailboxesGenerateTotp,
		output: InboxkitEndpointOutputSchemas.mailboxesGenerateTotp,
	},
	'mailboxes.addSignature': {
		input: InboxkitEndpointInputSchemas.mailboxesAddSignature,
		output: InboxkitEndpointOutputSchemas.mailboxesAddSignature,
	},
	'mailboxes.deleteSignature': {
		input: InboxkitEndpointInputSchemas.mailboxesDeleteSignature,
		output: InboxkitEndpointOutputSchemas.mailboxesDeleteSignature,
	},
	'mailboxes.resetup': {
		input: InboxkitEndpointInputSchemas.mailboxesResetup,
		output: InboxkitEndpointOutputSchemas.mailboxesResetup,
	},
	'mailboxes.getResetupStatus': {
		input: InboxkitEndpointInputSchemas.mailboxesGetResetupStatus,
		output: InboxkitEndpointOutputSchemas.mailboxesGetResetupStatus,
	},
	'forwarding.getCapabilities': {
		input: InboxkitEndpointInputSchemas.forwardingGetCapabilities,
		output: InboxkitEndpointOutputSchemas.forwardingGetCapabilities,
	},
	'forwarding.setup': {
		input: InboxkitEndpointInputSchemas.forwardingSetup,
		output: InboxkitEndpointOutputSchemas.forwardingSetup,
	},
	'forwarding.setupAdvanced': {
		input: InboxkitEndpointInputSchemas.forwardingSetupAdvanced,
		output: InboxkitEndpointOutputSchemas.forwardingSetupAdvanced,
	},
	'forwarding.update': {
		input: InboxkitEndpointInputSchemas.forwardingUpdate,
		output: InboxkitEndpointOutputSchemas.forwardingUpdate,
	},
	'forwarding.remove': {
		input: InboxkitEndpointInputSchemas.forwardingRemove,
		output: InboxkitEndpointOutputSchemas.forwardingRemove,
	},
	'forwarding.listJobs': {
		input: InboxkitEndpointInputSchemas.forwardingListJobs,
		output: InboxkitEndpointOutputSchemas.forwardingListJobs,
	},
	'forwarding.listRules': {
		input: InboxkitEndpointInputSchemas.forwardingListRules,
		output: InboxkitEndpointOutputSchemas.forwardingListRules,
	},
	'forwarding.getRule': {
		input: InboxkitEndpointInputSchemas.forwardingGetRule,
		output: InboxkitEndpointOutputSchemas.forwardingGetRule,
	},
	'forwarding.updateRule': {
		input: InboxkitEndpointInputSchemas.forwardingUpdateRule,
		output: InboxkitEndpointOutputSchemas.forwardingUpdateRule,
	},
	'forwarding.deleteRule': {
		input: InboxkitEndpointInputSchemas.forwardingDeleteRule,
		output: InboxkitEndpointOutputSchemas.forwardingDeleteRule,
	},
	'sequencers.listPlatforms': {
		input: InboxkitEndpointInputSchemas.sequencersListPlatforms,
		output: InboxkitEndpointOutputSchemas.sequencersListPlatforms,
	},
	'sequencers.list': {
		input: InboxkitEndpointInputSchemas.sequencersList,
		output: InboxkitEndpointOutputSchemas.sequencersList,
	},
	'sequencers.getTags': {
		input: InboxkitEndpointInputSchemas.sequencersGetTags,
		output: InboxkitEndpointOutputSchemas.sequencersGetTags,
	},
	'sequencers.add': {
		input: InboxkitEndpointInputSchemas.sequencersAdd,
		output: InboxkitEndpointOutputSchemas.sequencersAdd,
	},
	'sequencers.update': {
		input: InboxkitEndpointInputSchemas.sequencersUpdate,
		output: InboxkitEndpointOutputSchemas.sequencersUpdate,
	},
	'sequencers.delete': {
		input: InboxkitEndpointInputSchemas.sequencersDelete,
		output: InboxkitEndpointOutputSchemas.sequencersDelete,
	},
	'sequencers.exportMailboxes': {
		input: InboxkitEndpointInputSchemas.sequencersExportMailboxes,
		output: InboxkitEndpointOutputSchemas.sequencersExportMailboxes,
	},
	'sequencers.getExportStatus': {
		input: InboxkitEndpointInputSchemas.sequencersGetExportStatus,
		output: InboxkitEndpointOutputSchemas.sequencersGetExportStatus,
	},
	'sequencers.verifyLemlistOtp': {
		input: InboxkitEndpointInputSchemas.sequencersVerifyLemlistOtp,
		output: InboxkitEndpointOutputSchemas.sequencersVerifyLemlistOtp,
	},
	'warmup.list': {
		input: InboxkitEndpointInputSchemas.warmupList,
		output: InboxkitEndpointOutputSchemas.warmupList,
	},
	'warmup.get': {
		input: InboxkitEndpointInputSchemas.warmupGet,
		output: InboxkitEndpointOutputSchemas.warmupGet,
	},
	'warmup.getStats': {
		input: InboxkitEndpointInputSchemas.warmupGetStats,
		output: InboxkitEndpointOutputSchemas.warmupGetStats,
	},
	'warmup.getPricing': {
		input: InboxkitEndpointInputSchemas.warmupGetPricing,
		output: InboxkitEndpointOutputSchemas.warmupGetPricing,
	},
	'warmup.add': {
		input: InboxkitEndpointInputSchemas.warmupAdd,
		output: InboxkitEndpointOutputSchemas.warmupAdd,
	},
	'warmup.pause': {
		input: InboxkitEndpointInputSchemas.warmupPause,
		output: InboxkitEndpointOutputSchemas.warmupPause,
	},
	'warmup.resume': {
		input: InboxkitEndpointInputSchemas.warmupResume,
		output: InboxkitEndpointOutputSchemas.warmupResume,
	},
	'warmup.cancel': {
		input: InboxkitEndpointInputSchemas.warmupCancel,
		output: InboxkitEndpointOutputSchemas.warmupCancel,
	},
	'warmup.updateSettings': {
		input: InboxkitEndpointInputSchemas.warmupUpdateSettings,
		output: InboxkitEndpointOutputSchemas.warmupUpdateSettings,
	},
	'warmup.createConnectLink': {
		input: InboxkitEndpointInputSchemas.warmupCreateConnectLink,
		output: InboxkitEndpointOutputSchemas.warmupCreateConnectLink,
	},
	'warmup.getConnectLink': {
		input: InboxkitEndpointInputSchemas.warmupGetConnectLink,
		output: InboxkitEndpointOutputSchemas.warmupGetConnectLink,
	},
	'warmup.addSmtpMailboxes': {
		input: InboxkitEndpointInputSchemas.warmupAddSmtpMailboxes,
		output: InboxkitEndpointOutputSchemas.warmupAddSmtpMailboxes,
	},
	'warmup.listConnectedMailboxes': {
		input: InboxkitEndpointInputSchemas.warmupListConnectedMailboxes,
		output: InboxkitEndpointOutputSchemas.warmupListConnectedMailboxes,
	},
	'warmup.disconnectMailbox': {
		input: InboxkitEndpointInputSchemas.warmupDisconnectMailbox,
		output: InboxkitEndpointOutputSchemas.warmupDisconnectMailbox,
	},
	'consentRequests.initiate': {
		input: InboxkitEndpointInputSchemas.consentRequestsInitiate,
		output: InboxkitEndpointOutputSchemas.consentRequestsInitiate,
	},
	'consentRequests.getStatus': {
		input: InboxkitEndpointInputSchemas.consentRequestsGetStatus,
		output: InboxkitEndpointOutputSchemas.consentRequestsGetStatus,
	},
	'consentRequests.list': {
		input: InboxkitEndpointInputSchemas.consentRequestsList,
		output: InboxkitEndpointOutputSchemas.consentRequestsList,
	},
	'clientIdRequests.initiate': {
		input: InboxkitEndpointInputSchemas.clientIdRequestsInitiate,
		output: InboxkitEndpointOutputSchemas.clientIdRequestsInitiate,
	},
	'clientIdRequests.getStatus': {
		input: InboxkitEndpointInputSchemas.clientIdRequestsGetStatus,
		output: InboxkitEndpointOutputSchemas.clientIdRequestsGetStatus,
	},
	'clientIdRequests.list': {
		input: InboxkitEndpointInputSchemas.clientIdRequestsList,
		output: InboxkitEndpointOutputSchemas.clientIdRequestsList,
	},
	'tags.list': {
		input: InboxkitEndpointInputSchemas.tagsList,
		output: InboxkitEndpointOutputSchemas.tagsList,
	},
	'tags.create': {
		input: InboxkitEndpointInputSchemas.tagsCreate,
		output: InboxkitEndpointOutputSchemas.tagsCreate,
	},
	'tags.assign': {
		input: InboxkitEndpointInputSchemas.tagsAssign,
		output: InboxkitEndpointOutputSchemas.tagsAssign,
	},
	'tags.delete': {
		input: InboxkitEndpointInputSchemas.tagsDelete,
		output: InboxkitEndpointOutputSchemas.tagsDelete,
	},
	'prewarm.searchDomains': {
		input: InboxkitEndpointInputSchemas.prewarmSearchDomains,
		output: InboxkitEndpointOutputSchemas.prewarmSearchDomains,
	},
	'prewarm.searchMailboxes': {
		input: InboxkitEndpointInputSchemas.prewarmSearchMailboxes,
		output: InboxkitEndpointOutputSchemas.prewarmSearchMailboxes,
	},
	'prewarm.checkAvailability': {
		input: InboxkitEndpointInputSchemas.prewarmCheckAvailability,
		output: InboxkitEndpointOutputSchemas.prewarmCheckAvailability,
	},
	'prewarm.buy': {
		input: InboxkitEndpointInputSchemas.prewarmBuy,
		output: InboxkitEndpointOutputSchemas.prewarmBuy,
	},
	'prewarm.getOrderStatus': {
		input: InboxkitEndpointInputSchemas.prewarmGetOrderStatus,
		output: InboxkitEndpointOutputSchemas.prewarmGetOrderStatus,
	},
	'orders.place': {
		input: InboxkitEndpointInputSchemas.ordersPlace,
		output: InboxkitEndpointOutputSchemas.ordersPlace,
	},
	'inboxPlacement.createTest': {
		input: InboxkitEndpointInputSchemas.inboxPlacementCreateTest,
		output: InboxkitEndpointOutputSchemas.inboxPlacementCreateTest,
	},
	'inboxPlacement.listTests': {
		input: InboxkitEndpointInputSchemas.inboxPlacementListTests,
		output: InboxkitEndpointOutputSchemas.inboxPlacementListTests,
	},
	'inboxPlacement.getTest': {
		input: InboxkitEndpointInputSchemas.inboxPlacementGetTest,
		output: InboxkitEndpointOutputSchemas.inboxPlacementGetTest,
	},
	'inboxPlacement.listScheduled': {
		input: InboxkitEndpointInputSchemas.inboxPlacementListScheduled,
		output: InboxkitEndpointOutputSchemas.inboxPlacementListScheduled,
	},
	'inboxPlacement.getScheduled': {
		input: InboxkitEndpointInputSchemas.inboxPlacementGetScheduled,
		output: InboxkitEndpointOutputSchemas.inboxPlacementGetScheduled,
	},
	'inboxPlacement.pauseScheduled': {
		input: InboxkitEndpointInputSchemas.inboxPlacementPauseScheduled,
		output: InboxkitEndpointOutputSchemas.inboxPlacementPauseScheduled,
	},
	'inboxPlacement.resumeScheduled': {
		input: InboxkitEndpointInputSchemas.inboxPlacementResumeScheduled,
		output: InboxkitEndpointOutputSchemas.inboxPlacementResumeScheduled,
	},
	'inboxPlacement.deleteScheduled': {
		input: InboxkitEndpointInputSchemas.inboxPlacementDeleteScheduled,
		output: InboxkitEndpointOutputSchemas.inboxPlacementDeleteScheduled,
	},
	'infraGuard.list': {
		input: InboxkitEndpointInputSchemas.infraGuardList,
		output: InboxkitEndpointOutputSchemas.infraGuardList,
	},
	'infraGuard.get': {
		input: InboxkitEndpointInputSchemas.infraGuardGet,
		output: InboxkitEndpointOutputSchemas.infraGuardGet,
	},
	'infraGuard.enable': {
		input: InboxkitEndpointInputSchemas.infraGuardEnable,
		output: InboxkitEndpointOutputSchemas.infraGuardEnable,
	},
	'infraGuard.cancel': {
		input: InboxkitEndpointInputSchemas.infraGuardCancel,
		output: InboxkitEndpointOutputSchemas.infraGuardCancel,
	},
	'infraGuard.getStats': {
		input: InboxkitEndpointInputSchemas.infraGuardGetStats,
		output: InboxkitEndpointOutputSchemas.infraGuardGetStats,
	},
	'infraGuard.getPricing': {
		input: InboxkitEndpointInputSchemas.infraGuardGetPricing,
		output: InboxkitEndpointOutputSchemas.infraGuardGetPricing,
	},
	'infraGuard.getBlacklistHistory': {
		input: InboxkitEndpointInputSchemas.infraGuardGetBlacklistHistory,
		output: InboxkitEndpointOutputSchemas.infraGuardGetBlacklistHistory,
	},
	'infraGuard.getDnsHistory': {
		input: InboxkitEndpointInputSchemas.infraGuardGetDnsHistory,
		output: InboxkitEndpointOutputSchemas.infraGuardGetDnsHistory,
	},
	'infraGuard.getBounceMetrics': {
		input: InboxkitEndpointInputSchemas.infraGuardGetBounceMetrics,
		output: InboxkitEndpointOutputSchemas.infraGuardGetBounceMetrics,
	},
	'infraGuard.getBounceHistory': {
		input: InboxkitEndpointInputSchemas.infraGuardGetBounceHistory,
		output: InboxkitEndpointOutputSchemas.infraGuardGetBounceHistory,
	},
	'infraGuard.updateSettings': {
		input: InboxkitEndpointInputSchemas.infraGuardUpdateSettings,
		output: InboxkitEndpointOutputSchemas.infraGuardUpdateSettings,
	},
	'infraGuard.triggerCheck': {
		input: InboxkitEndpointInputSchemas.infraGuardTriggerCheck,
		output: InboxkitEndpointOutputSchemas.infraGuardTriggerCheck,
	},
	'infraGuard.listAlerts': {
		input: InboxkitEndpointInputSchemas.infraGuardListAlerts,
		output: InboxkitEndpointOutputSchemas.infraGuardListAlerts,
	},
	'infraGuard.acknowledgeAlert': {
		input: InboxkitEndpointInputSchemas.infraGuardAcknowledgeAlert,
		output: InboxkitEndpointOutputSchemas.infraGuardAcknowledgeAlert,
	},
	'infraGuard.resolveAlert': {
		input: InboxkitEndpointInputSchemas.infraGuardResolveAlert,
		output: InboxkitEndpointOutputSchemas.infraGuardResolveAlert,
	},
	'infraGuard.listActionItems': {
		input: InboxkitEndpointInputSchemas.infraGuardListActionItems,
		output: InboxkitEndpointOutputSchemas.infraGuardListActionItems,
	},
	'infraGuard.getActionItemStats': {
		input: InboxkitEndpointInputSchemas.infraGuardGetActionItemStats,
		output: InboxkitEndpointOutputSchemas.infraGuardGetActionItemStats,
	},
	'infraGuard.resolveActionItem': {
		input: InboxkitEndpointInputSchemas.infraGuardResolveActionItem,
		output: InboxkitEndpointOutputSchemas.infraGuardResolveActionItem,
	},
	'infraGuard.dismissActionItem': {
		input: InboxkitEndpointInputSchemas.infraGuardDismissActionItem,
		output: InboxkitEndpointOutputSchemas.infraGuardDismissActionItem,
	},
	'emailInsights.getOverview': {
		input: InboxkitEndpointInputSchemas.emailInsightsGetOverview,
		output: InboxkitEndpointOutputSchemas.emailInsightsGetOverview,
	},
	'emailInsights.getMailboxesHealth': {
		input: InboxkitEndpointInputSchemas.emailInsightsGetMailboxesHealth,
		output: InboxkitEndpointOutputSchemas.emailInsightsGetMailboxesHealth,
	},
	'emailInsights.getDailyStats': {
		input: InboxkitEndpointInputSchemas.emailInsightsGetDailyStats,
		output: InboxkitEndpointOutputSchemas.emailInsightsGetDailyStats,
	},
	'emailInsights.getHighBounceMailboxes': {
		input: InboxkitEndpointInputSchemas.emailInsightsGetHighBounceMailboxes,
		output: InboxkitEndpointOutputSchemas.emailInsightsGetHighBounceMailboxes,
	},
	'emailInsights.getCampaignReplyRate': {
		input: InboxkitEndpointInputSchemas.emailInsightsGetCampaignReplyRate,
		output: InboxkitEndpointOutputSchemas.emailInsightsGetCampaignReplyRate,
	},
	'emailInsights.getWorkspaceActivity': {
		input: InboxkitEndpointInputSchemas.emailInsightsGetWorkspaceActivity,
		output: InboxkitEndpointOutputSchemas.emailInsightsGetWorkspaceActivity,
	},
	'emailInsights.getMailboxStats': {
		input: InboxkitEndpointInputSchemas.emailInsightsGetMailboxStats,
		output: InboxkitEndpointOutputSchemas.emailInsightsGetMailboxStats,
	},
	'emailInsights.getMailboxDeliverability': {
		input: InboxkitEndpointInputSchemas.emailInsightsGetMailboxDeliverability,
		output: InboxkitEndpointOutputSchemas.emailInsightsGetMailboxDeliverability,
	},
	'emailInsights.getMailboxHealth': {
		input: InboxkitEndpointInputSchemas.emailInsightsGetMailboxHealth,
		output: InboxkitEndpointOutputSchemas.emailInsightsGetMailboxHealth,
	},
	'emailInsights.getMailboxTrends': {
		input: InboxkitEndpointInputSchemas.emailInsightsGetMailboxTrends,
		output: InboxkitEndpointOutputSchemas.emailInsightsGetMailboxTrends,
	},
	'emailInsights.getMailboxBounceEvents': {
		input: InboxkitEndpointInputSchemas.emailInsightsGetMailboxBounceEvents,
		output: InboxkitEndpointOutputSchemas.emailInsightsGetMailboxBounceEvents,
	},
	'emailInsights.getMailboxActivity': {
		input: InboxkitEndpointInputSchemas.emailInsightsGetMailboxActivity,
		output: InboxkitEndpointOutputSchemas.emailInsightsGetMailboxActivity,
	},
	'emailInsights.getMailboxTopRecipients': {
		input: InboxkitEndpointInputSchemas.emailInsightsGetMailboxTopRecipients,
		output: InboxkitEndpointOutputSchemas.emailInsightsGetMailboxTopRecipients,
	},
	'emailInsights.getMailboxTopRecipientDomains': {
		input:
			InboxkitEndpointInputSchemas.emailInsightsGetMailboxTopRecipientDomains,
		output:
			InboxkitEndpointOutputSchemas.emailInsightsGetMailboxTopRecipientDomains,
	},
	'emailInsights.getMailboxMessageBreakdown': {
		input: InboxkitEndpointInputSchemas.emailInsightsGetMailboxMessageBreakdown,
		output:
			InboxkitEndpointOutputSchemas.emailInsightsGetMailboxMessageBreakdown,
	},
	'emailInsights.getMailboxSubjectAnalysis': {
		input: InboxkitEndpointInputSchemas.emailInsightsGetMailboxSubjectAnalysis,
		output:
			InboxkitEndpointOutputSchemas.emailInsightsGetMailboxSubjectAnalysis,
	},
	'emailInsights.getMailboxReplyTimeHeatmap': {
		input: InboxkitEndpointInputSchemas.emailInsightsGetMailboxReplyTimeHeatmap,
		output:
			InboxkitEndpointOutputSchemas.emailInsightsGetMailboxReplyTimeHeatmap,
	},
	'emailInsights.getMailboxReplyRateByDomain': {
		input:
			InboxkitEndpointInputSchemas.emailInsightsGetMailboxReplyRateByDomain,
		output:
			InboxkitEndpointOutputSchemas.emailInsightsGetMailboxReplyRateByDomain,
	},
	'emailInsights.getMailboxVelocityOverlay': {
		input: InboxkitEndpointInputSchemas.emailInsightsGetMailboxVelocityOverlay,
		output:
			InboxkitEndpointOutputSchemas.emailInsightsGetMailboxVelocityOverlay,
	},
	'emailInsights.getMailboxWarmupStats': {
		input: InboxkitEndpointInputSchemas.emailInsightsGetMailboxWarmupStats,
		output: InboxkitEndpointOutputSchemas.emailInsightsGetMailboxWarmupStats,
	},
	'emailInsights.getMailboxAuthFailures': {
		input: InboxkitEndpointInputSchemas.emailInsightsGetMailboxAuthFailures,
		output: InboxkitEndpointOutputSchemas.emailInsightsGetMailboxAuthFailures,
	},
	'emailInsights.getMailboxFirstTouchFunnel': {
		input: InboxkitEndpointInputSchemas.emailInsightsGetMailboxFirstTouchFunnel,
		output:
			InboxkitEndpointOutputSchemas.emailInsightsGetMailboxFirstTouchFunnel,
	},
	'emailInsights.getMailboxSendingIpBreakdown': {
		input:
			InboxkitEndpointInputSchemas.emailInsightsGetMailboxSendingIpBreakdown,
		output:
			InboxkitEndpointOutputSchemas.emailInsightsGetMailboxSendingIpBreakdown,
	},
	'emailInsights.getMailboxRecipientEspBreakdown': {
		input:
			InboxkitEndpointInputSchemas.emailInsightsGetMailboxRecipientEspBreakdown,
		output:
			InboxkitEndpointOutputSchemas.emailInsightsGetMailboxRecipientEspBreakdown,
	},
	'emailInsights.getMailboxBodyTemplates': {
		input: InboxkitEndpointInputSchemas.emailInsightsGetMailboxBodyTemplates,
		output: InboxkitEndpointOutputSchemas.emailInsightsGetMailboxBodyTemplates,
	},
	'verifiedDomains.list': {
		input: InboxkitEndpointInputSchemas.verifiedDomainsList,
		output: InboxkitEndpointOutputSchemas.verifiedDomainsList,
	},
	'verifiedDomains.add': {
		input: InboxkitEndpointInputSchemas.verifiedDomainsAdd,
		output: InboxkitEndpointOutputSchemas.verifiedDomainsAdd,
	},
	'verifiedDomains.verify': {
		input: InboxkitEndpointInputSchemas.verifiedDomainsVerify,
		output: InboxkitEndpointOutputSchemas.verifiedDomainsVerify,
	},
	'verifiedDomains.remove': {
		input: InboxkitEndpointInputSchemas.verifiedDomainsRemove,
		output: InboxkitEndpointOutputSchemas.verifiedDomainsRemove,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof inboxkitEndpointsNested
>;

const inboxkitWebhookSchemas = {
	'domains.statusChanged': {
		description: "A domain's status changed.",
		payload: DomainStatusChangedPayloadSchema,
		response: DomainStatusChangedEventSchema,
	},
	'mailboxes.statusChanged': {
		description:
			"A mailbox's status changed. Unless the team has turned it off, InboxKit sends the mailbox's passwords in this delivery; the plugin removes them before a handler returns. Use mailboxes.showCredentials if you need them.",
		payload: MailboxStatusChangedPayloadSchema,
		response: MailboxStatusChangedEventSchema,
	},
	'consentRequests.statusChanged': {
		description: "An OAuth consent request's status changed.",
		payload: ConsentRequestStatusChangedPayloadSchema,
		response: ConsentRequestStatusChangedEventSchema,
	},
	'clientIdRequests.statusChanged': {
		description: "A client ID request's status changed.",
		payload: ClientIdRequestStatusChangedPayloadSchema,
		response: ClientIdRequestStatusChangedEventSchema,
	},
} as const satisfies RequiredPluginWebhookSchemas<
	typeof inboxkitWebhooksNested
>;

const defaultAuthType = 'api_key' as const;

// Anything that can charge money, return a credential, send a team's mail or
// webhooks elsewhere, grant access or take a sending mailbox offline is
// destructive, so cautious mode asks first. test-routes.ts lists them and
// plugin.test.ts holds this file to that list.
const inboxkitEndpointMeta = {
	'account.get': {
		riskLevel: 'read',
		description:
			"The team's wallet balance, mailbox slots, current plan, auto top-up settings and price per mailbox.",
	},
	'billing.getWallet': {
		riskLevel: 'read',
		description: 'Wallet balance, credits used and auto top-up settings.',
	},
	'billing.addCredits': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'SPENDS MONEY. Buy wallet credits. With direct_charge the saved card is charged at once; otherwise this returns a hosted checkout link.',
	},
	'billing.getWalletLogs': {
		riskLevel: 'read',
		description:
			'Wallet activity log, with filters by type, kind, status, workspace and date.',
	},
	'billing.getPaymentStatus': {
		riskLevel: 'read',
		description:
			'Whether a hosted-checkout or guest-mode payment has finished and its credits were applied.',
	},
	'billing.listTransactions': {
		riskLevel: 'read',
		description:
			'Wallet transactions, newest first, with the balance after each one. Send next_cursor back as cursor for the next page.',
	},
	'billing.updateAutoTopup': {
		riskLevel: 'destructive',
		description:
			'CAN SPEND MONEY. Turn automatic wallet top-ups on or off and set the threshold and amount. While on, InboxKit charges the saved card with no further call.',
	},
	'billing.getPortalLink': {
		riskLevel: 'destructive',
		description:
			'A Stripe billing portal link for this team. Whoever holds the link can manage payment methods and invoices, so keep it private.',
	},
	'billing.getPricingPlans': {
		riskLevel: 'read',
		description:
			'Available pricing plans, with upgrade and downgrade options from the current plan.',
	},
	'billing.getSubscription': {
		riskLevel: 'read',
		description: 'The current subscription and the available plans.',
	},
	'billing.changeSubscription': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'SPENDS MONEY. Switch to another plan or start one. May charge the saved card at once or return a payment link.',
	},
	'billing.cancelSubscription': {
		riskLevel: 'destructive',
		description: 'Cancel the active subscription.',
	},
	'workspaces.list': {
		riskLevel: 'read',
		description:
			'Every workspace in the team, with its uid. Pass a uid as workspaceId to the operations that act on one workspace.',
	},
	'workspaces.get': { riskLevel: 'read', description: 'One workspace by uid.' },
	'workspaces.create': {
		riskLevel: 'write',
		description:
			'Create a workspace. All team members are copied into it unless admins_only is set. Set a webhook URL afterwards with workspaces.updateWebhook.',
	},
	'workspaces.update': {
		riskLevel: 'destructive',
		description:
			'Rename a workspace and set its webhook URL. That URL can receive mailbox passwords in plaintext, so only point it at an endpoint you control.',
	},
	'workspaces.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a workspace permanently.',
	},
	'workspaces.updateWebhook': {
		riskLevel: 'destructive',
		description:
			"Set a workspace's webhook URL. That URL can receive mailbox passwords in plaintext, so only point it at an endpoint you control.",
	},
	'workspaces.inviteMember': {
		riskLevel: 'destructive',
		description:
			'Invite someone to a workspace, or resend an invite. Sends them an email and gives them access to its domains and mailboxes.',
	},
	'domains.list': {
		riskLevel: 'read',
		description:
			"The workspace's domains with status, nameservers and DNS records. Paginated, with filters by keyword, status and uid.",
	},
	'domains.listAssignable': {
		riskLevel: 'read',
		description: 'Domains that can take more mailboxes.',
	},
	'domains.checkAvailability': {
		riskLevel: 'read',
		description:
			'Whether one domain can be registered, with its price and ban status. Takes no workspace.',
	},
	'domains.checkBanned': {
		riskLevel: 'read',
		description:
			'Whether one domain is banned from registration. Takes no workspace.',
	},
	'domains.search': {
		riskLevel: 'read',
		description:
			'Search for domains to register by keyword or name, with prices and Google or Microsoft availability. Limited to 50 requests a minute.',
	},
	'domains.checkWorkspaceAvailability': {
		riskLevel: 'read',
		description:
			'Whether domains can be used with Google Workspace or Microsoft 365.',
	},
	'domains.register': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'SPENDS MONEY. Register domains with contact details and configuration, paid from the wallet or a checkout. Never repeat after a timeout without checking domains.list first.',
	},
	'domains.remove': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Remove domains from the workspace.',
	},
	'domains.setForwarding': {
		riskLevel: 'write',
		description:
			'Set or remove the website URL domains redirect to. An empty forwarding_url removes it.',
	},
	'domains.setCatchAll': {
		riskLevel: 'destructive',
		description:
			'Send mail for unknown addresses on these domains to one email address.',
	},
	'domains.removeCatchAll': {
		riskLevel: 'write',
		description: 'Remove the catch-all address from these domains.',
	},
	'domains.setDmarc': {
		riskLevel: 'write',
		description: 'Set a custom DMARC record on these domains.',
	},
	'domains.removeDmarc': {
		riskLevel: 'write',
		description: 'Reset these domains to the default DMARC record.',
	},
	'domains.connect': {
		riskLevel: 'write',
		description:
			'Connect domains you already own to the workspace and get the nameservers to set at your registrar.',
	},
	'domains.checkPropagation': {
		riskLevel: 'read',
		description: 'Whether the nameservers of these domains have propagated.',
	},
	'domains.regenerateNameservers': {
		riskLevel: 'destructive',
		description:
			'Create new Cloudflare zones and nameservers for domains that need reconfiguring. The registrar then has to be pointed at the new nameservers.',
	},
	'domains.updatePrivacy': {
		riskLevel: 'write',
		description:
			'Turn WHOIS privacy on or off for a domain registered through InboxKit.',
	},
	'domains.updateContacts': {
		riskLevel: 'write',
		description:
			'Update the WHOIS contact details of a domain registered through InboxKit, for all four contact roles.',
	},
	'domains.requestRenewal': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'SPENDS MONEY. Renew purchased domains from the wallet, up to 50 at once. If the wallet cannot cover the whole batch, none are queued.',
	},
	'domains.getRenewalStatus': {
		riskLevel: 'read',
		description:
			'Renewal status of purchased domains, filtered by name, uid or status.',
	},
	'domains.moveWorkspace': {
		riskLevel: 'write',
		description:
			'Move domains to another workspace in the team, with their mailboxes and DNS records. Run domains.previewMove first.',
	},
	'domains.previewMove': {
		riskLevel: 'read',
		description:
			'What moving domains to another workspace would do, and why any cannot move. Nothing changes.',
	},
	'domains.getMoveStatus': {
		riskLevel: 'read',
		description:
			'Whether a move started with domains.moveWorkspace has finished.',
	},
	'domains.rotate': {
		riskLevel: 'destructive',
		description:
			'Start moving every mailbox on a domain to a replacement domain in the same workspace. Mailbox addresses change. Run domains.previewRotation first.',
	},
	'domains.previewRotation': {
		riskLevel: 'read',
		description:
			'Whether a domain can rotate onto a replacement, which mailboxes would move and their new addresses. Nothing changes.',
	},
	'domains.getRotationStatus': {
		riskLevel: 'read',
		description:
			'Progress of a rotation. Poll every 30 to 60 seconds until completed, partially_completed or failed.',
	},
	'cloudflare.connect': {
		riskLevel: 'write',
		description:
			'Connect domains from a Cloudflare account, using an API token or global API key. Limited to 10 requests per 5 minutes.',
	},
	'cloudflare.list': {
		riskLevel: 'read',
		description: 'Domains connected through Cloudflare.',
	},
	'cloudflare.get': {
		riskLevel: 'read',
		description: 'One Cloudflare-connected domain, by uid or name.',
	},
	'cloudflare.disconnect': {
		riskLevel: 'destructive',
		description: 'Disconnect Cloudflare domains from the workspace.',
	},
	'cloudflare.listZones': {
		riskLevel: 'read',
		description: 'Zones in the connected Cloudflare account.',
	},
	'dns.list': {
		riskLevel: 'read',
		description: 'DNS records of one domain, by name or uid.',
	},
	'dns.add': {
		riskLevel: 'write',
		description: 'Add DNS records to a domain.',
	},
	'dns.update': {
		riskLevel: 'write',
		description: 'Update DNS records on a domain.',
	},
	'dns.deleteRecords': {
		riskLevel: 'destructive',
		description:
			'Delete DNS records from a domain, by id or all of them. Removing MX, SPF, DKIM or DMARC records stops mail from working.',
	},
	'dns.verify': {
		riskLevel: 'read',
		description:
			'Check the health of the email DNS records of one or more domains. Nothing changes.',
	},
	'dns.repair': {
		riskLevel: 'destructive',
		description:
			'Fix missing or broken email DNS records on one or more domains. Run dns.verify first to see what would change.',
	},
	'mailboxes.list': {
		riskLevel: 'read',
		description:
			"The workspace's mailboxes. Paginated, with filters by keyword, domain, platform, status and uid. Never includes passwords.",
	},
	'mailboxes.get': { riskLevel: 'read', description: 'One mailbox by uid.' },
	'mailboxes.checkAvailability': {
		riskLevel: 'read',
		description: 'Whether a username is free on a domain. Takes no workspace.',
	},
	'mailboxes.getStatus': {
		riskLevel: 'read',
		description: 'Status of mailboxes by uid or domain.',
	},
	'mailboxes.getFailureReason': {
		riskLevel: 'read',
		description: 'Why a mailbox failed to set up.',
	},
	'mailboxes.buy': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'SPENDS MONEY. Buy mailboxes on domains already in the workspace, from subscription slots, the wallet, or (Azure) always the wallet. Never repeat after a timeout without checking mailboxes.list first.',
	},
	'mailboxes.cancel': {
		riskLevel: 'destructive',
		description:
			'Schedule mailboxes for cancellation. Billing stops at the next renewal.',
	},
	'mailboxes.uncancel': {
		riskLevel: 'destructive',
		description:
			'CAN SPEND MONEY. Undo a scheduled cancellation for Google Workspace mailboxes within the 10-day recovery window, so billing continues.',
	},
	'mailboxes.reactivate': {
		riskLevel: 'destructive',
		description:
			'CAN SPEND MONEY. Reactivate Microsoft 365 and Azure mailboxes scheduled for cancellation or whose renewal failed. With allow_charge a re-purchase may be charged to the wallet.',
	},
	'mailboxes.reactivateRebuy': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'SPENDS MONEY. Approve the charge for Microsoft 365 and Azure mailboxes paused at needs_rebuy.',
	},
	'mailboxes.update': {
		riskLevel: 'write',
		description:
			"Update a mailbox's first or last name, profile picture or tags. To change its address, use mailboxes.changeUsername.",
	},
	'mailboxes.updateProfilePicture': {
		riskLevel: 'write',
		description: "Set a mailbox's profile picture from a URL.",
	},
	'mailboxes.changeUsername': {
		riskLevel: 'destructive',
		description:
			"Change a mailbox's username, which changes its email address.",
	},
	'mailboxes.changePassword': {
		riskLevel: 'destructive',
		description:
			"Change a mailbox's password. Anything signed in with the old password, such as a sequencer, stops working.",
	},
	'mailboxes.showCredentials': {
		riskLevel: 'destructive',
		description:
			"A mailbox's plaintext password, secret and app password, by uid or email. Keep the result out of logs and shared chats.",
	},
	'mailboxes.generateTotp': {
		riskLevel: 'destructive',
		description:
			'A current two-factor code for a mailbox. Keep the result out of logs and shared chats.',
	},
	'mailboxes.addSignature': {
		riskLevel: 'write',
		description: 'Add or replace the signature on several mailboxes.',
	},
	'mailboxes.deleteSignature': {
		riskLevel: 'write',
		description: 'Delete the signature from several mailboxes.',
	},
	'mailboxes.resetup': {
		riskLevel: 'destructive',
		description:
			'Schedule a renewal-resetup for Google Workspace mailboxes. Mail delivery on the domain is paused for up to 24 hours while it runs.',
	},
	'mailboxes.getResetupStatus': {
		riskLevel: 'read',
		description: 'The most recent resetup job for a domain.',
	},
	'forwarding.getCapabilities': {
		riskLevel: 'read',
		description:
			'What advanced forwarding can filter on for Google and Microsoft mailboxes, and the limits.',
	},
	'forwarding.setup': {
		riskLevel: 'destructive',
		description:
			'Forward all mail from these mailboxes to one address. Setup takes a few minutes; follow it with forwarding.listJobs.',
	},
	'forwarding.setupAdvanced': {
		riskLevel: 'destructive',
		description:
			'Forward only the messages that match your conditions. A rule is created per Google domain or Microsoft account, and replaces any forwarding the mailbox had.',
	},
	'forwarding.update': {
		riskLevel: 'destructive',
		description:
			'Change the forwarding address of mailboxes that already forward.',
	},
	'forwarding.remove': {
		riskLevel: 'write',
		description: 'Turn off forwarding for mailboxes.',
	},
	'forwarding.listJobs': {
		riskLevel: 'read',
		description: 'Status of forwarding jobs.',
	},
	'forwarding.listRules': {
		riskLevel: 'read',
		description:
			'Advanced forwarding rules, newest first, with conditions, mailboxes and status.',
	},
	'forwarding.getRule': {
		riskLevel: 'read',
		description: 'One advanced forwarding rule.',
	},
	'forwarding.updateRule': {
		riskLevel: 'destructive',
		description:
			"Change a rule's conditions, match, forwarding address or mailboxes.",
	},
	'forwarding.deleteRule': {
		riskLevel: 'destructive',
		description: 'Delete a rule. Its mailboxes stop forwarding.',
	},
	'sequencers.listPlatforms': {
		riskLevel: 'read',
		description:
			'Every sequencer platform InboxKit supports, with the fields each one needs to connect.',
	},
	'sequencers.list': {
		riskLevel: 'read',
		description:
			'Sequencers connected to the workspace, filtered by platform, status, keyword or uid.',
	},
	'sequencers.getTags': {
		riskLevel: 'read',
		description:
			'Tags on a sequencer account, using its platform and API key. Only Instantly has them today.',
	},
	'sequencers.add': {
		riskLevel: 'write',
		description:
			'Connect a sequencer account such as Instantly, Smartlead or Lemlist, with the fields sequencers.listPlatforms names for that platform. Most take a login and password, and a few take only an API key. No mailboxes go to it until sequencers.exportMailboxes, unless Auto Export is on for it in the InboxKit dashboard.',
	},
	'sequencers.update': {
		riskLevel: 'write',
		description:
			'Rename a sequencer, rotate its credentials or change its auto-reconnect setting.',
	},
	'sequencers.delete': {
		riskLevel: 'destructive',
		description:
			'Remove sequencers from the workspace. Mailboxes can no longer be exported to them.',
	},
	'sequencers.exportMailboxes': {
		riskLevel: 'destructive',
		description:
			'Send mailboxes into a sequencer, which receives their credentials. Runs in the background; follow it with sequencers.getExportStatus.',
	},
	'sequencers.getExportStatus': {
		riskLevel: 'read',
		description:
			'Status of mailbox exports, with the error if a connection failed.',
	},
	'sequencers.verifyLemlistOtp': {
		riskLevel: 'write',
		description:
			'Resume a Lemlist connection paused with verification_required, using the link and code from its email.',
	},
	'warmup.list': {
		riskLevel: 'read',
		description: 'Warmup subscriptions in the workspace.',
	},
	'warmup.get': {
		riskLevel: 'read',
		description:
			'The warmup subscription of one mailbox, with its current settings.',
	},
	'warmup.getStats': {
		riskLevel: 'read',
		description: 'Warmup counts for the workspace.',
	},
	'warmup.getPricing': {
		riskLevel: 'read',
		description: 'The monthly warmup price per mailbox.',
	},
	'warmup.add': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'SPENDS MONEY. Add warmup to mailboxes, billed monthly. Mailboxes that are not ready start once they are; activate_immediately charges the first month to the wallet now.',
	},
	'warmup.pause': {
		riskLevel: 'write',
		description: 'Pause warmup for mailboxes.',
	},
	'warmup.resume': {
		riskLevel: 'write',
		description: 'Resume warmup for mailboxes.',
	},
	'warmup.cancel': {
		riskLevel: 'destructive',
		description:
			'Stop warmup and its billing for mailboxes. The mailboxes stay connected.',
	},
	'warmup.updateSettings': {
		riskLevel: 'write',
		description:
			'Change warmup settings for mailboxes. Only the settings you send change.',
	},
	'warmup.createConnectLink': {
		riskLevel: 'destructive',
		description:
			'CAN SPEND MONEY. A one-time sign-in link to connect a Google Workspace or Microsoft 365 mailbox you own. Anyone with the link can use it; with start_warmup the first month is charged when it connects.',
	},
	'warmup.getConnectLink': {
		riskLevel: 'read',
		description: 'What happened to a link from warmup.createConnectLink.',
	},
	'warmup.addSmtpMailboxes': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'SPENDS MONEY. Connect up to 10 SMTP mailboxes you own and start their warmup. The first month is charged to the wallet for each one that signs in.',
	},
	'warmup.listConnectedMailboxes': {
		riskLevel: 'read',
		description: 'Mailboxes you connected yourself, newest first.',
	},
	'warmup.disconnectMailbox': {
		riskLevel: 'destructive',
		description:
			'Disconnect a mailbox you connected yourself and cancel its warmup. Connecting it again charges a new first month.',
	},
	'consentRequests.initiate': {
		riskLevel: 'destructive',
		description:
			'Process an OAuth consent URL for a mailbox, by uid or username and domain, which can give that app access to the mailbox.',
	},
	'consentRequests.getStatus': {
		riskLevel: 'read',
		description: 'Current status of a consent request.',
	},
	'consentRequests.list': {
		riskLevel: 'read',
		description: 'Consent requests, filtered by mailbox or status.',
	},
	'clientIdRequests.initiate': {
		riskLevel: 'destructive',
		description:
			"Authorize an app's client ID on a domain, as a trusted app or with domain-wide delegation on Google, or tenant-wide consent on Microsoft. This can give the app access to every mailbox on the domain. The domain needs an admin mailbox.",
	},
	'clientIdRequests.getStatus': {
		riskLevel: 'read',
		description:
			'Current status of a client ID request. Microsoft stays processing for minutes, so poll.',
	},
	'clientIdRequests.list': {
		riskLevel: 'read',
		description: 'Client ID requests, filtered by status or domain.',
	},
	'tags.list': { riskLevel: 'read', description: 'All tags in the workspace.' },
	'tags.create': {
		riskLevel: 'write',
		description: 'Create a tag in the workspace.',
	},
	'tags.assign': {
		riskLevel: 'write',
		description: 'Add, remove or replace tags on domains or mailboxes in bulk.',
	},
	'tags.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a tag and remove it from everything it is on.',
	},
	'prewarm.searchDomains': {
		riskLevel: 'read',
		description: 'Search prewarmed domains for sale.',
	},
	'prewarm.searchMailboxes': {
		riskLevel: 'read',
		description: 'Search prewarmed mailboxes for sale.',
	},
	'prewarm.checkAvailability': {
		riskLevel: 'read',
		description: 'Whether prewarmed domains are still for sale.',
	},
	'prewarm.buy': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'SPENDS MONEY. Buy prewarmed domains with every active mailbox on them, charged to the wallet when the order is placed. Never repeat after a timeout without checking first.',
	},
	'prewarm.getOrderStatus': {
		riskLevel: 'read',
		description: 'Status of a prewarmed domain order.',
	},
	'orders.place': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'SPENDS MONEY. Order new domains and their mailboxes in one request, charged to the wallet. Never repeat after a timeout without checking domains.list first.',
	},
	'inboxPlacement.createTest': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'SPENDS MONEY. Run an inbox placement test from your mailboxes, once or on a schedule.',
	},
	'inboxPlacement.listTests': {
		riskLevel: 'read',
		description: 'Inbox placement tests.',
	},
	'inboxPlacement.getTest': {
		riskLevel: 'read',
		description: 'Results of one inbox placement test.',
	},
	'inboxPlacement.listScheduled': {
		riskLevel: 'read',
		description: 'Scheduled inbox placement tests.',
	},
	'inboxPlacement.getScheduled': {
		riskLevel: 'read',
		description: 'One scheduled inbox placement test.',
	},
	'inboxPlacement.pauseScheduled': {
		riskLevel: 'write',
		description: 'Pause a scheduled inbox placement test.',
	},
	'inboxPlacement.resumeScheduled': {
		riskLevel: 'destructive',
		description:
			'CAN SPEND MONEY. Resume a scheduled inbox placement test, so its later runs are charged.',
	},
	'inboxPlacement.deleteScheduled': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a scheduled inbox placement test.',
	},
	'infraGuard.list': {
		riskLevel: 'read',
		description: 'Domains protected by InfraGuard, with their health.',
	},
	'infraGuard.get': {
		riskLevel: 'read',
		description: 'The InfraGuard subscription of one domain.',
	},
	'infraGuard.enable': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'SPENDS MONEY. Turn on InfraGuard monitoring for domains, billed per domain.',
	},
	'infraGuard.cancel': {
		riskLevel: 'destructive',
		description: 'Stop InfraGuard monitoring and billing for domains.',
	},
	'infraGuard.getStats': {
		riskLevel: 'read',
		description: 'InfraGuard statistics for the workspace.',
	},
	'infraGuard.getPricing': {
		riskLevel: 'read',
		description: 'InfraGuard pricing.',
	},
	'infraGuard.getBlacklistHistory': {
		riskLevel: 'read',
		description: 'Blacklist checks of one domain over time.',
	},
	'infraGuard.getDnsHistory': {
		riskLevel: 'read',
		description: 'DNS checks of one domain over time.',
	},
	'infraGuard.getBounceMetrics': {
		riskLevel: 'read',
		description: 'Current bounce metrics of one domain.',
	},
	'infraGuard.getBounceHistory': {
		riskLevel: 'read',
		description: 'Bounce checks of one domain over time.',
	},
	'infraGuard.updateSettings': {
		riskLevel: 'write',
		description:
			"Change a domain's alert preferences, bounce thresholds and scheduled placement tests.",
	},
	'infraGuard.triggerCheck': {
		riskLevel: 'write',
		description: 'Run an InfraGuard check on a domain now.',
	},
	'infraGuard.listAlerts': {
		riskLevel: 'read',
		description:
			'InfraGuard alerts, filtered by domain, status, severity or type.',
	},
	'infraGuard.acknowledgeAlert': {
		riskLevel: 'write',
		description: 'Mark an alert as acknowledged.',
	},
	'infraGuard.resolveAlert': {
		riskLevel: 'write',
		description: 'Mark an alert as resolved, with an optional note.',
	},
	'infraGuard.listActionItems': {
		riskLevel: 'read',
		description:
			'InfraGuard action items, filtered by domain, category, severity or status.',
	},
	'infraGuard.getActionItemStats': {
		riskLevel: 'read',
		description: 'Action item counts for the workspace.',
	},
	'infraGuard.resolveActionItem': {
		riskLevel: 'write',
		description: 'Mark an action item as resolved.',
	},
	'infraGuard.dismissActionItem': {
		riskLevel: 'write',
		description: 'Dismiss an action item.',
	},
	'emailInsights.getOverview': {
		riskLevel: 'read',
		description:
			'Totals and rates across every mailbox in the workspace for a period.',
	},
	'emailInsights.getMailboxesHealth': {
		riskLevel: 'read',
		description:
			'Seven-day activity summary for each mailbox in the workspace.',
	},
	'emailInsights.getDailyStats': {
		riskLevel: 'read',
		description: 'Daily email volume across the workspace.',
	},
	'emailInsights.getHighBounceMailboxes': {
		riskLevel: 'read',
		description: 'Mailboxes whose bounce rate is above a threshold.',
	},
	'emailInsights.getCampaignReplyRate': {
		riskLevel: 'read',
		description: 'Reply rate for each campaign and sequence step.',
	},
	'emailInsights.getWorkspaceActivity': {
		riskLevel: 'read',
		description: 'Most recent email events across the workspace, newest first.',
	},
	'emailInsights.getMailboxStats': {
		riskLevel: 'read',
		description: 'Event totals and rates for one mailbox over a period.',
	},
	'emailInsights.getMailboxDeliverability': {
		riskLevel: 'read',
		description: 'Bounce and authentication detail for one mailbox.',
	},
	'emailInsights.getMailboxHealth': {
		riskLevel: 'read',
		description: 'Activity status for one mailbox.',
	},
	'emailInsights.getMailboxTrends': {
		riskLevel: 'read',
		description: 'Daily event counts for one mailbox, oldest first.',
	},
	'emailInsights.getMailboxBounceEvents': {
		riskLevel: 'read',
		description:
			'Delivery failures for one mailbox, with the reason the receiving server gave.',
	},
	'emailInsights.getMailboxActivity': {
		riskLevel: 'read',
		description: 'Most recent email events for one mailbox, newest first.',
	},
	'emailInsights.getMailboxTopRecipients': {
		riskLevel: 'read',
		description: 'Addresses one mailbox sent to most often.',
	},
	'emailInsights.getMailboxTopRecipientDomains': {
		riskLevel: 'read',
		description: 'Domains one mailbox sent to most often.',
	},
	'emailInsights.getMailboxMessageBreakdown': {
		riskLevel: 'read',
		description:
			'Sent and received messages for one mailbox, by type and by day.',
	},
	'emailInsights.getMailboxSubjectAnalysis': {
		riskLevel: 'read',
		description:
			'Most common subject line keywords for one mailbox, with length statistics.',
	},
	'emailInsights.getMailboxReplyTimeHeatmap': {
		riskLevel: 'read',
		description:
			'How quickly replies arrive at one mailbox, by day of week and hour.',
	},
	'emailInsights.getMailboxReplyRateByDomain': {
		riskLevel: 'read',
		description:
			'Emails sent and replies received for one mailbox, by recipient domain.',
	},
	'emailInsights.getMailboxVelocityOverlay': {
		riskLevel: 'read',
		description: 'Hourly sending and reply volume for one mailbox.',
	},
	'emailInsights.getMailboxWarmupStats': {
		riskLevel: 'read',
		description:
			'Warmup volume for one mailbox compared with real sending, with SPF, DKIM and DMARC pass rates.',
	},
	'emailInsights.getMailboxAuthFailures': {
		riskLevel: 'read',
		description:
			'Inbound messages to one mailbox that did not pass SPF, DKIM or DMARC.',
	},
	'emailInsights.getMailboxFirstTouchFunnel': {
		riskLevel: 'read',
		description: 'Recipients one mailbox contacted for the first time, by day.',
	},
	'emailInsights.getMailboxSendingIpBreakdown': {
		riskLevel: 'read',
		description:
			'Sending IPs one mailbox used, with Gmail placement and blacklist status.',
	},
	'emailInsights.getMailboxRecipientEspBreakdown': {
		riskLevel: 'read',
		description:
			"Sending volume and reply rate for one mailbox, by the recipient's email provider.",
	},
	'emailInsights.getMailboxBodyTemplates': {
		riskLevel: 'read',
		description:
			'Groups of outbound emails from one mailbox that share a body structure.',
	},
	'verifiedDomains.list': {
		riskLevel: 'read',
		description:
			"Websites the team has added for URL masking, with each one's status and TXT record.",
	},
	'verifiedDomains.add': {
		riskLevel: 'write',
		description:
			'Add a website to mask domains to. It must then be verified with a TXT record.',
	},
	'verifiedDomains.verify': {
		riskLevel: 'write',
		description:
			'Check whether the TXT record for a destination is published, and mark it verified if so.',
	},
	'verifiedDomains.remove': {
		riskLevel: 'destructive',
		description: 'Remove a website from the verified destinations.',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof inboxkitEndpointsNested>;

export const inboxkitAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseInboxkitPlugin<T extends InboxkitPluginOptions> = CorsairPlugin<
	'inboxkit',
	typeof InboxkitSchema,
	typeof inboxkitEndpointsNested,
	typeof inboxkitWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalInboxkitPlugin = BaseInboxkitPlugin<InboxkitPluginOptions>;

export type ExternalInboxkitPlugin<T extends InboxkitPluginOptions> =
	BaseInboxkitPlugin<T>;

export function inboxkit<const T extends InboxkitPluginOptions>(
	incomingOptions: InboxkitPluginOptions & T = {} as InboxkitPluginOptions & T,
): ExternalInboxkitPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'inboxkit',
		authConfig: inboxkitAuthConfig,
		schema: InboxkitSchema,
		options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: inboxkitEndpointsNested,
		webhooks: inboxkitWebhooksNested,
		endpointMeta: inboxkitEndpointMeta,
		endpointSchemas: inboxkitEndpointSchemas,
		webhookSchemas: inboxkitWebhookSchemas,
		pluginWebhookMatcher: isInboxkitWebhook,
		pluginTenantWebhookMatcher: matchInboxkitTenantWebhook,
		errorHandlers: mergeErrorHandlers(errorHandlers, options.errorHandlers),
		// InboxKit has no separate webhook secret: its signature is the SHA-256 of
		// the team API key, so webhooks are checked with the same key.
		keyBuilder: async (ctx: InboxkitKeyBuilderContext, source) => {
			if (options.key) return options.key;

			if (ctx.authType === 'api_key') {
				const key = await ctx.keys.get_api_key();
				if (key) return key;
			}

			// An empty key makes webhook verification refuse the delivery with a
			// clear error, instead of failing the lookup.
			if (source === 'webhook') return '';
			throw new AuthMissingError('inboxkit', ctx.authType ?? 'api_key');
		},
	} satisfies InternalInboxkitPlugin;
}

export { InboxkitAPIError, InboxkitError } from './client';

export type {
	InboxkitEndpointInputs,
	InboxkitEndpointOutputs,
	InboxkitOperation,
} from './endpoints/types';

export type {
	ClientIdRequestStatusChangedEvent,
	ConsentRequestStatusChangedEvent,
	DomainStatusChangedEvent,
	InboxkitWebhookOutputs,
	MailboxStatusChangedEvent,
} from './webhooks/types';
export { verifyInboxkitSignature } from './webhooks/types';
