import { get as accountGet } from './account';
import {
	addCredits as billingAddCredits,
	cancelSubscription as billingCancelSubscription,
	changeSubscription as billingChangeSubscription,
	getPaymentStatus as billingGetPaymentStatus,
	getPortalLink as billingGetPortalLink,
	getPricingPlans as billingGetPricingPlans,
	getSubscription as billingGetSubscription,
	getWallet as billingGetWallet,
	getWalletLogs as billingGetWalletLogs,
	listTransactions as billingListTransactions,
	updateAutoTopup as billingUpdateAutoTopup,
} from './billing';
import {
	getStatus as clientIdRequestsGetStatus,
	initiate as clientIdRequestsInitiate,
	list as clientIdRequestsList,
} from './client-id-requests';
import {
	connect as cloudflareConnect,
	disconnect as cloudflareDisconnect,
	get as cloudflareGet,
	list as cloudflareList,
	listZones as cloudflareListZones,
} from './cloudflare';
import {
	getStatus as consentRequestsGetStatus,
	initiate as consentRequestsInitiate,
	list as consentRequestsList,
} from './consent-requests';
import {
	add as dnsAdd,
	deleteRecords as dnsDeleteRecords,
	list as dnsList,
	repair as dnsRepair,
	update as dnsUpdate,
	verify as dnsVerify,
} from './dns';
import {
	checkAvailability as domainsCheckAvailability,
	checkBanned as domainsCheckBanned,
	checkPropagation as domainsCheckPropagation,
	checkWorkspaceAvailability as domainsCheckWorkspaceAvailability,
	connect as domainsConnect,
	getMoveStatus as domainsGetMoveStatus,
	getRenewalStatus as domainsGetRenewalStatus,
	getRotationStatus as domainsGetRotationStatus,
	list as domainsList,
	listAssignable as domainsListAssignable,
	moveWorkspace as domainsMoveWorkspace,
	previewMove as domainsPreviewMove,
	previewRotation as domainsPreviewRotation,
	regenerateNameservers as domainsRegenerateNameservers,
	register as domainsRegister,
	remove as domainsRemove,
	removeCatchAll as domainsRemoveCatchAll,
	removeDmarc as domainsRemoveDmarc,
	requestRenewal as domainsRequestRenewal,
	rotate as domainsRotate,
	search as domainsSearch,
	setCatchAll as domainsSetCatchAll,
	setDmarc as domainsSetDmarc,
	setForwarding as domainsSetForwarding,
	updateContacts as domainsUpdateContacts,
	updatePrivacy as domainsUpdatePrivacy,
} from './domains';
import {
	getCampaignReplyRate as emailInsightsGetCampaignReplyRate,
	getDailyStats as emailInsightsGetDailyStats,
	getHighBounceMailboxes as emailInsightsGetHighBounceMailboxes,
	getMailboxActivity as emailInsightsGetMailboxActivity,
	getMailboxAuthFailures as emailInsightsGetMailboxAuthFailures,
	getMailboxBodyTemplates as emailInsightsGetMailboxBodyTemplates,
	getMailboxBounceEvents as emailInsightsGetMailboxBounceEvents,
	getMailboxDeliverability as emailInsightsGetMailboxDeliverability,
	getMailboxesHealth as emailInsightsGetMailboxesHealth,
	getMailboxFirstTouchFunnel as emailInsightsGetMailboxFirstTouchFunnel,
	getMailboxHealth as emailInsightsGetMailboxHealth,
	getMailboxMessageBreakdown as emailInsightsGetMailboxMessageBreakdown,
	getMailboxRecipientEspBreakdown as emailInsightsGetMailboxRecipientEspBreakdown,
	getMailboxReplyRateByDomain as emailInsightsGetMailboxReplyRateByDomain,
	getMailboxReplyTimeHeatmap as emailInsightsGetMailboxReplyTimeHeatmap,
	getMailboxSendingIpBreakdown as emailInsightsGetMailboxSendingIpBreakdown,
	getMailboxStats as emailInsightsGetMailboxStats,
	getMailboxSubjectAnalysis as emailInsightsGetMailboxSubjectAnalysis,
	getMailboxTopRecipientDomains as emailInsightsGetMailboxTopRecipientDomains,
	getMailboxTopRecipients as emailInsightsGetMailboxTopRecipients,
	getMailboxTrends as emailInsightsGetMailboxTrends,
	getMailboxVelocityOverlay as emailInsightsGetMailboxVelocityOverlay,
	getMailboxWarmupStats as emailInsightsGetMailboxWarmupStats,
	getOverview as emailInsightsGetOverview,
	getWorkspaceActivity as emailInsightsGetWorkspaceActivity,
} from './email-insights';
import {
	deleteRule as forwardingDeleteRule,
	getCapabilities as forwardingGetCapabilities,
	getRule as forwardingGetRule,
	listJobs as forwardingListJobs,
	listRules as forwardingListRules,
	remove as forwardingRemove,
	setup as forwardingSetup,
	setupAdvanced as forwardingSetupAdvanced,
	update as forwardingUpdate,
	updateRule as forwardingUpdateRule,
} from './forwarding';
import {
	createTest as inboxPlacementCreateTest,
	deleteScheduled as inboxPlacementDeleteScheduled,
	getScheduled as inboxPlacementGetScheduled,
	getTest as inboxPlacementGetTest,
	listScheduled as inboxPlacementListScheduled,
	listTests as inboxPlacementListTests,
	pauseScheduled as inboxPlacementPauseScheduled,
	resumeScheduled as inboxPlacementResumeScheduled,
} from './inbox-placement';
import {
	acknowledgeAlert as infraGuardAcknowledgeAlert,
	cancel as infraGuardCancel,
	dismissActionItem as infraGuardDismissActionItem,
	enable as infraGuardEnable,
	get as infraGuardGet,
	getActionItemStats as infraGuardGetActionItemStats,
	getBlacklistHistory as infraGuardGetBlacklistHistory,
	getBounceHistory as infraGuardGetBounceHistory,
	getBounceMetrics as infraGuardGetBounceMetrics,
	getDnsHistory as infraGuardGetDnsHistory,
	getPricing as infraGuardGetPricing,
	getStats as infraGuardGetStats,
	list as infraGuardList,
	listActionItems as infraGuardListActionItems,
	listAlerts as infraGuardListAlerts,
	resolveActionItem as infraGuardResolveActionItem,
	resolveAlert as infraGuardResolveAlert,
	triggerCheck as infraGuardTriggerCheck,
	updateSettings as infraGuardUpdateSettings,
} from './infra-guard';
import {
	addSignature as mailboxesAddSignature,
	buy as mailboxesBuy,
	cancel as mailboxesCancel,
	changePassword as mailboxesChangePassword,
	changeUsername as mailboxesChangeUsername,
	checkAvailability as mailboxesCheckAvailability,
	deleteSignature as mailboxesDeleteSignature,
	generateTotp as mailboxesGenerateTotp,
	get as mailboxesGet,
	getFailureReason as mailboxesGetFailureReason,
	getResetupStatus as mailboxesGetResetupStatus,
	getStatus as mailboxesGetStatus,
	list as mailboxesList,
	reactivate as mailboxesReactivate,
	reactivateRebuy as mailboxesReactivateRebuy,
	resetup as mailboxesResetup,
	showCredentials as mailboxesShowCredentials,
	uncancel as mailboxesUncancel,
	update as mailboxesUpdate,
	updateProfilePicture as mailboxesUpdateProfilePicture,
} from './mailboxes';
import { place as ordersPlace } from './orders';
import {
	buy as prewarmBuy,
	checkAvailability as prewarmCheckAvailability,
	getOrderStatus as prewarmGetOrderStatus,
	searchDomains as prewarmSearchDomains,
	searchMailboxes as prewarmSearchMailboxes,
} from './prewarm';
import {
	add as sequencersAdd,
	deleteOp as sequencersDelete,
	exportMailboxes as sequencersExportMailboxes,
	getExportStatus as sequencersGetExportStatus,
	getTags as sequencersGetTags,
	list as sequencersList,
	listPlatforms as sequencersListPlatforms,
	update as sequencersUpdate,
	verifyLemlistOtp as sequencersVerifyLemlistOtp,
} from './sequencers';
import {
	assign as tagsAssign,
	create as tagsCreate,
	deleteOp as tagsDelete,
	list as tagsList,
} from './tags';
import {
	add as verifiedDomainsAdd,
	list as verifiedDomainsList,
	remove as verifiedDomainsRemove,
	verify as verifiedDomainsVerify,
} from './verified-domains';
import {
	add as warmupAdd,
	addSmtpMailboxes as warmupAddSmtpMailboxes,
	cancel as warmupCancel,
	createConnectLink as warmupCreateConnectLink,
	disconnectMailbox as warmupDisconnectMailbox,
	get as warmupGet,
	getConnectLink as warmupGetConnectLink,
	getPricing as warmupGetPricing,
	getStats as warmupGetStats,
	list as warmupList,
	listConnectedMailboxes as warmupListConnectedMailboxes,
	pause as warmupPause,
	resume as warmupResume,
	updateSettings as warmupUpdateSettings,
} from './warmup';
import {
	create as workspacesCreate,
	deleteOp as workspacesDelete,
	get as workspacesGet,
	inviteMember as workspacesInviteMember,
	list as workspacesList,
	update as workspacesUpdate,
	updateWebhook as workspacesUpdateWebhook,
} from './workspaces';

export const Account = {
	get: accountGet,
};

export const Billing = {
	getWallet: billingGetWallet,
	addCredits: billingAddCredits,
	getWalletLogs: billingGetWalletLogs,
	getPaymentStatus: billingGetPaymentStatus,
	listTransactions: billingListTransactions,
	updateAutoTopup: billingUpdateAutoTopup,
	getPortalLink: billingGetPortalLink,
	getPricingPlans: billingGetPricingPlans,
	getSubscription: billingGetSubscription,
	changeSubscription: billingChangeSubscription,
	cancelSubscription: billingCancelSubscription,
};

export const Workspaces = {
	list: workspacesList,
	get: workspacesGet,
	create: workspacesCreate,
	update: workspacesUpdate,
	delete: workspacesDelete,
	updateWebhook: workspacesUpdateWebhook,
	inviteMember: workspacesInviteMember,
};

export const Domains = {
	list: domainsList,
	listAssignable: domainsListAssignable,
	checkAvailability: domainsCheckAvailability,
	checkBanned: domainsCheckBanned,
	search: domainsSearch,
	checkWorkspaceAvailability: domainsCheckWorkspaceAvailability,
	register: domainsRegister,
	remove: domainsRemove,
	setForwarding: domainsSetForwarding,
	setCatchAll: domainsSetCatchAll,
	removeCatchAll: domainsRemoveCatchAll,
	setDmarc: domainsSetDmarc,
	removeDmarc: domainsRemoveDmarc,
	connect: domainsConnect,
	checkPropagation: domainsCheckPropagation,
	regenerateNameservers: domainsRegenerateNameservers,
	updatePrivacy: domainsUpdatePrivacy,
	updateContacts: domainsUpdateContacts,
	requestRenewal: domainsRequestRenewal,
	getRenewalStatus: domainsGetRenewalStatus,
	moveWorkspace: domainsMoveWorkspace,
	previewMove: domainsPreviewMove,
	getMoveStatus: domainsGetMoveStatus,
	rotate: domainsRotate,
	previewRotation: domainsPreviewRotation,
	getRotationStatus: domainsGetRotationStatus,
};

export const Cloudflare = {
	connect: cloudflareConnect,
	list: cloudflareList,
	get: cloudflareGet,
	disconnect: cloudflareDisconnect,
	listZones: cloudflareListZones,
};

export const Dns = {
	list: dnsList,
	add: dnsAdd,
	update: dnsUpdate,
	deleteRecords: dnsDeleteRecords,
	verify: dnsVerify,
	repair: dnsRepair,
};

export const Mailboxes = {
	list: mailboxesList,
	get: mailboxesGet,
	checkAvailability: mailboxesCheckAvailability,
	getStatus: mailboxesGetStatus,
	getFailureReason: mailboxesGetFailureReason,
	buy: mailboxesBuy,
	cancel: mailboxesCancel,
	uncancel: mailboxesUncancel,
	reactivate: mailboxesReactivate,
	reactivateRebuy: mailboxesReactivateRebuy,
	update: mailboxesUpdate,
	updateProfilePicture: mailboxesUpdateProfilePicture,
	changeUsername: mailboxesChangeUsername,
	changePassword: mailboxesChangePassword,
	showCredentials: mailboxesShowCredentials,
	generateTotp: mailboxesGenerateTotp,
	addSignature: mailboxesAddSignature,
	deleteSignature: mailboxesDeleteSignature,
	resetup: mailboxesResetup,
	getResetupStatus: mailboxesGetResetupStatus,
};

export const Forwarding = {
	getCapabilities: forwardingGetCapabilities,
	setup: forwardingSetup,
	setupAdvanced: forwardingSetupAdvanced,
	update: forwardingUpdate,
	remove: forwardingRemove,
	listJobs: forwardingListJobs,
	listRules: forwardingListRules,
	getRule: forwardingGetRule,
	updateRule: forwardingUpdateRule,
	deleteRule: forwardingDeleteRule,
};

export const Sequencers = {
	listPlatforms: sequencersListPlatforms,
	list: sequencersList,
	getTags: sequencersGetTags,
	add: sequencersAdd,
	update: sequencersUpdate,
	delete: sequencersDelete,
	exportMailboxes: sequencersExportMailboxes,
	getExportStatus: sequencersGetExportStatus,
	verifyLemlistOtp: sequencersVerifyLemlistOtp,
};

export const Warmup = {
	list: warmupList,
	get: warmupGet,
	getStats: warmupGetStats,
	getPricing: warmupGetPricing,
	add: warmupAdd,
	pause: warmupPause,
	resume: warmupResume,
	cancel: warmupCancel,
	updateSettings: warmupUpdateSettings,
	createConnectLink: warmupCreateConnectLink,
	getConnectLink: warmupGetConnectLink,
	addSmtpMailboxes: warmupAddSmtpMailboxes,
	listConnectedMailboxes: warmupListConnectedMailboxes,
	disconnectMailbox: warmupDisconnectMailbox,
};

export const ConsentRequests = {
	initiate: consentRequestsInitiate,
	getStatus: consentRequestsGetStatus,
	list: consentRequestsList,
};

export const ClientIdRequests = {
	initiate: clientIdRequestsInitiate,
	getStatus: clientIdRequestsGetStatus,
	list: clientIdRequestsList,
};

export const Tags = {
	list: tagsList,
	create: tagsCreate,
	assign: tagsAssign,
	delete: tagsDelete,
};

export const Prewarm = {
	searchDomains: prewarmSearchDomains,
	searchMailboxes: prewarmSearchMailboxes,
	checkAvailability: prewarmCheckAvailability,
	buy: prewarmBuy,
	getOrderStatus: prewarmGetOrderStatus,
};

export const Orders = {
	place: ordersPlace,
};

export const InboxPlacement = {
	createTest: inboxPlacementCreateTest,
	listTests: inboxPlacementListTests,
	getTest: inboxPlacementGetTest,
	listScheduled: inboxPlacementListScheduled,
	getScheduled: inboxPlacementGetScheduled,
	pauseScheduled: inboxPlacementPauseScheduled,
	resumeScheduled: inboxPlacementResumeScheduled,
	deleteScheduled: inboxPlacementDeleteScheduled,
};

export const InfraGuard = {
	list: infraGuardList,
	get: infraGuardGet,
	enable: infraGuardEnable,
	cancel: infraGuardCancel,
	getStats: infraGuardGetStats,
	getPricing: infraGuardGetPricing,
	getBlacklistHistory: infraGuardGetBlacklistHistory,
	getDnsHistory: infraGuardGetDnsHistory,
	getBounceMetrics: infraGuardGetBounceMetrics,
	getBounceHistory: infraGuardGetBounceHistory,
	updateSettings: infraGuardUpdateSettings,
	triggerCheck: infraGuardTriggerCheck,
	listAlerts: infraGuardListAlerts,
	acknowledgeAlert: infraGuardAcknowledgeAlert,
	resolveAlert: infraGuardResolveAlert,
	listActionItems: infraGuardListActionItems,
	getActionItemStats: infraGuardGetActionItemStats,
	resolveActionItem: infraGuardResolveActionItem,
	dismissActionItem: infraGuardDismissActionItem,
};

export const EmailInsights = {
	getOverview: emailInsightsGetOverview,
	getMailboxesHealth: emailInsightsGetMailboxesHealth,
	getDailyStats: emailInsightsGetDailyStats,
	getHighBounceMailboxes: emailInsightsGetHighBounceMailboxes,
	getCampaignReplyRate: emailInsightsGetCampaignReplyRate,
	getWorkspaceActivity: emailInsightsGetWorkspaceActivity,
	getMailboxStats: emailInsightsGetMailboxStats,
	getMailboxDeliverability: emailInsightsGetMailboxDeliverability,
	getMailboxHealth: emailInsightsGetMailboxHealth,
	getMailboxTrends: emailInsightsGetMailboxTrends,
	getMailboxBounceEvents: emailInsightsGetMailboxBounceEvents,
	getMailboxActivity: emailInsightsGetMailboxActivity,
	getMailboxTopRecipients: emailInsightsGetMailboxTopRecipients,
	getMailboxTopRecipientDomains: emailInsightsGetMailboxTopRecipientDomains,
	getMailboxMessageBreakdown: emailInsightsGetMailboxMessageBreakdown,
	getMailboxSubjectAnalysis: emailInsightsGetMailboxSubjectAnalysis,
	getMailboxReplyTimeHeatmap: emailInsightsGetMailboxReplyTimeHeatmap,
	getMailboxReplyRateByDomain: emailInsightsGetMailboxReplyRateByDomain,
	getMailboxVelocityOverlay: emailInsightsGetMailboxVelocityOverlay,
	getMailboxWarmupStats: emailInsightsGetMailboxWarmupStats,
	getMailboxAuthFailures: emailInsightsGetMailboxAuthFailures,
	getMailboxFirstTouchFunnel: emailInsightsGetMailboxFirstTouchFunnel,
	getMailboxSendingIpBreakdown: emailInsightsGetMailboxSendingIpBreakdown,
	getMailboxRecipientEspBreakdown: emailInsightsGetMailboxRecipientEspBreakdown,
	getMailboxBodyTemplates: emailInsightsGetMailboxBodyTemplates,
};

export const VerifiedDomains = {
	list: verifiedDomainsList,
	add: verifiedDomainsAdd,
	verify: verifiedDomainsVerify,
	remove: verifiedDomainsRemove,
};

export * from './types';
