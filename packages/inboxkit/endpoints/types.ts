import type { z } from 'zod';
import { AccountInputSchemas, AccountOutputSchemas } from './schemas/account';
import { BillingInputSchemas, BillingOutputSchemas } from './schemas/billing';
import {
	ClientIdRequestsInputSchemas,
	ClientIdRequestsOutputSchemas,
} from './schemas/client-id-requests';
import {
	CloudflareInputSchemas,
	CloudflareOutputSchemas,
} from './schemas/cloudflare';
import {
	ConsentRequestsInputSchemas,
	ConsentRequestsOutputSchemas,
} from './schemas/consent-requests';
import { DnsInputSchemas, DnsOutputSchemas } from './schemas/dns';
import { DomainsInputSchemas, DomainsOutputSchemas } from './schemas/domains';
import {
	EmailInsightsInputSchemas,
	EmailInsightsOutputSchemas,
} from './schemas/email-insights';
import {
	ForwardingInputSchemas,
	ForwardingOutputSchemas,
} from './schemas/forwarding';
import {
	InboxPlacementInputSchemas,
	InboxPlacementOutputSchemas,
} from './schemas/inbox-placement';
import {
	InfraGuardInputSchemas,
	InfraGuardOutputSchemas,
} from './schemas/infra-guard';
import {
	MailboxesInputSchemas,
	MailboxesOutputSchemas,
} from './schemas/mailboxes';
import { OrdersInputSchemas, OrdersOutputSchemas } from './schemas/orders';
import { PrewarmInputSchemas, PrewarmOutputSchemas } from './schemas/prewarm';
import {
	SequencersInputSchemas,
	SequencersOutputSchemas,
} from './schemas/sequencers';
import { TagsInputSchemas, TagsOutputSchemas } from './schemas/tags';
import {
	VerifiedDomainsInputSchemas,
	VerifiedDomainsOutputSchemas,
} from './schemas/verified-domains';
import { WarmupInputSchemas, WarmupOutputSchemas } from './schemas/warmup';
import {
	WorkspacesInputSchemas,
	WorkspacesOutputSchemas,
} from './schemas/workspaces';

export const InboxkitEndpointInputSchemas = {
	...AccountInputSchemas,
	...BillingInputSchemas,
	...WorkspacesInputSchemas,
	...DomainsInputSchemas,
	...CloudflareInputSchemas,
	...DnsInputSchemas,
	...MailboxesInputSchemas,
	...ForwardingInputSchemas,
	...SequencersInputSchemas,
	...WarmupInputSchemas,
	...ConsentRequestsInputSchemas,
	...ClientIdRequestsInputSchemas,
	...TagsInputSchemas,
	...PrewarmInputSchemas,
	...OrdersInputSchemas,
	...InboxPlacementInputSchemas,
	...InfraGuardInputSchemas,
	...EmailInsightsInputSchemas,
	...VerifiedDomainsInputSchemas,
} as const;

export const InboxkitEndpointOutputSchemas = {
	...AccountOutputSchemas,
	...BillingOutputSchemas,
	...WorkspacesOutputSchemas,
	...DomainsOutputSchemas,
	...CloudflareOutputSchemas,
	...DnsOutputSchemas,
	...MailboxesOutputSchemas,
	...ForwardingOutputSchemas,
	...SequencersOutputSchemas,
	...WarmupOutputSchemas,
	...ConsentRequestsOutputSchemas,
	...ClientIdRequestsOutputSchemas,
	...TagsOutputSchemas,
	...PrewarmOutputSchemas,
	...OrdersOutputSchemas,
	...InboxPlacementOutputSchemas,
	...InfraGuardOutputSchemas,
	...EmailInsightsOutputSchemas,
	...VerifiedDomainsOutputSchemas,
} as const;

export type InboxkitOperation = keyof typeof InboxkitEndpointInputSchemas;

/** What callers pass. */
export type InboxkitEndpointInputs = {
	[K in InboxkitOperation]: z.input<(typeof InboxkitEndpointInputSchemas)[K]>;
};

/** Inputs after their schema ran. */
export type InboxkitParsedInputs = {
	[K in InboxkitOperation]: z.output<(typeof InboxkitEndpointInputSchemas)[K]>;
};

export type InboxkitEndpointOutputs = {
	[K in InboxkitOperation]: z.infer<(typeof InboxkitEndpointOutputSchemas)[K]>;
};

/**
 * Whether an operation only reads, and whether it acts on one workspace. A read
 * can be retried; anything else is sent once. index.ts keeps the risk levels
 * and plugin.test.ts checks the two agree.
 */
export const INBOXKIT_OPERATIONS = {
	accountGet: { path: 'account.get', read: true, workspace: false },
	billingGetWallet: { path: 'billing.getWallet', read: true, workspace: false },
	billingAddCredits: {
		path: 'billing.addCredits',
		read: false,
		workspace: false,
	},
	billingGetWalletLogs: {
		path: 'billing.getWalletLogs',
		read: true,
		workspace: false,
	},
	billingGetPaymentStatus: {
		path: 'billing.getPaymentStatus',
		read: true,
		workspace: false,
	},
	billingListTransactions: {
		path: 'billing.listTransactions',
		read: true,
		workspace: false,
	},
	billingUpdateAutoTopup: {
		path: 'billing.updateAutoTopup',
		read: false,
		workspace: false,
	},
	billingGetPortalLink: {
		path: 'billing.getPortalLink',
		read: false,
		workspace: false,
	},
	billingGetPricingPlans: {
		path: 'billing.getPricingPlans',
		read: true,
		workspace: false,
	},
	billingGetSubscription: {
		path: 'billing.getSubscription',
		read: true,
		workspace: false,
	},
	billingChangeSubscription: {
		path: 'billing.changeSubscription',
		read: false,
		workspace: false,
	},
	billingCancelSubscription: {
		path: 'billing.cancelSubscription',
		read: false,
		workspace: false,
	},
	workspacesList: { path: 'workspaces.list', read: true, workspace: false },
	workspacesGet: { path: 'workspaces.get', read: true, workspace: false },
	workspacesCreate: {
		path: 'workspaces.create',
		read: false,
		workspace: false,
	},
	workspacesUpdate: {
		path: 'workspaces.update',
		read: false,
		workspace: false,
	},
	workspacesDelete: {
		path: 'workspaces.delete',
		read: false,
		workspace: false,
	},
	workspacesUpdateWebhook: {
		path: 'workspaces.updateWebhook',
		read: false,
		workspace: false,
	},
	workspacesInviteMember: {
		path: 'workspaces.inviteMember',
		read: false,
		workspace: false,
	},
	domainsList: { path: 'domains.list', read: true, workspace: true },
	domainsListAssignable: {
		path: 'domains.listAssignable',
		read: true,
		workspace: true,
	},
	domainsCheckAvailability: {
		path: 'domains.checkAvailability',
		read: true,
		workspace: false,
	},
	domainsCheckBanned: {
		path: 'domains.checkBanned',
		read: true,
		workspace: false,
	},
	domainsSearch: { path: 'domains.search', read: true, workspace: false },
	domainsCheckWorkspaceAvailability: {
		path: 'domains.checkWorkspaceAvailability',
		read: true,
		workspace: false,
	},
	domainsRegister: { path: 'domains.register', read: false, workspace: true },
	domainsRemove: { path: 'domains.remove', read: false, workspace: true },
	domainsSetForwarding: {
		path: 'domains.setForwarding',
		read: false,
		workspace: true,
	},
	domainsSetCatchAll: {
		path: 'domains.setCatchAll',
		read: false,
		workspace: true,
	},
	domainsRemoveCatchAll: {
		path: 'domains.removeCatchAll',
		read: false,
		workspace: true,
	},
	domainsSetDmarc: { path: 'domains.setDmarc', read: false, workspace: true },
	domainsRemoveDmarc: {
		path: 'domains.removeDmarc',
		read: false,
		workspace: true,
	},
	domainsConnect: { path: 'domains.connect', read: false, workspace: true },
	domainsCheckPropagation: {
		path: 'domains.checkPropagation',
		read: true,
		workspace: true,
	},
	domainsRegenerateNameservers: {
		path: 'domains.regenerateNameservers',
		read: false,
		workspace: true,
	},
	domainsUpdatePrivacy: {
		path: 'domains.updatePrivacy',
		read: false,
		workspace: true,
	},
	domainsUpdateContacts: {
		path: 'domains.updateContacts',
		read: false,
		workspace: true,
	},
	domainsRequestRenewal: {
		path: 'domains.requestRenewal',
		read: false,
		workspace: true,
	},
	domainsGetRenewalStatus: {
		path: 'domains.getRenewalStatus',
		read: true,
		workspace: true,
	},
	domainsMoveWorkspace: {
		path: 'domains.moveWorkspace',
		read: false,
		workspace: true,
	},
	domainsPreviewMove: {
		path: 'domains.previewMove',
		read: true,
		workspace: true,
	},
	domainsGetMoveStatus: {
		path: 'domains.getMoveStatus',
		read: true,
		workspace: false,
	},
	domainsRotate: { path: 'domains.rotate', read: false, workspace: true },
	domainsPreviewRotation: {
		path: 'domains.previewRotation',
		read: true,
		workspace: true,
	},
	domainsGetRotationStatus: {
		path: 'domains.getRotationStatus',
		read: true,
		workspace: false,
	},
	cloudflareConnect: {
		path: 'cloudflare.connect',
		read: false,
		workspace: true,
	},
	cloudflareList: { path: 'cloudflare.list', read: true, workspace: true },
	cloudflareGet: { path: 'cloudflare.get', read: true, workspace: true },
	cloudflareDisconnect: {
		path: 'cloudflare.disconnect',
		read: false,
		workspace: true,
	},
	cloudflareListZones: {
		path: 'cloudflare.listZones',
		read: true,
		workspace: true,
	},
	dnsList: { path: 'dns.list', read: true, workspace: true },
	dnsAdd: { path: 'dns.add', read: false, workspace: true },
	dnsUpdate: { path: 'dns.update', read: false, workspace: true },
	dnsDeleteRecords: { path: 'dns.deleteRecords', read: false, workspace: true },
	dnsVerify: { path: 'dns.verify', read: true, workspace: true },
	dnsRepair: { path: 'dns.repair', read: false, workspace: true },
	mailboxesList: { path: 'mailboxes.list', read: true, workspace: true },
	mailboxesGet: { path: 'mailboxes.get', read: true, workspace: true },
	mailboxesCheckAvailability: {
		path: 'mailboxes.checkAvailability',
		read: true,
		workspace: false,
	},
	mailboxesGetStatus: {
		path: 'mailboxes.getStatus',
		read: true,
		workspace: true,
	},
	mailboxesGetFailureReason: {
		path: 'mailboxes.getFailureReason',
		read: true,
		workspace: true,
	},
	mailboxesBuy: { path: 'mailboxes.buy', read: false, workspace: true },
	mailboxesCancel: { path: 'mailboxes.cancel', read: false, workspace: true },
	mailboxesUncancel: {
		path: 'mailboxes.uncancel',
		read: false,
		workspace: true,
	},
	mailboxesReactivate: {
		path: 'mailboxes.reactivate',
		read: false,
		workspace: true,
	},
	mailboxesReactivateRebuy: {
		path: 'mailboxes.reactivateRebuy',
		read: false,
		workspace: true,
	},
	mailboxesUpdate: { path: 'mailboxes.update', read: false, workspace: true },
	mailboxesUpdateProfilePicture: {
		path: 'mailboxes.updateProfilePicture',
		read: false,
		workspace: true,
	},
	mailboxesChangeUsername: {
		path: 'mailboxes.changeUsername',
		read: false,
		workspace: true,
	},
	mailboxesChangePassword: {
		path: 'mailboxes.changePassword',
		read: false,
		workspace: true,
	},
	mailboxesShowCredentials: {
		path: 'mailboxes.showCredentials',
		read: false,
		workspace: true,
	},
	mailboxesGenerateTotp: {
		path: 'mailboxes.generateTotp',
		read: false,
		workspace: true,
	},
	mailboxesAddSignature: {
		path: 'mailboxes.addSignature',
		read: false,
		workspace: true,
	},
	mailboxesDeleteSignature: {
		path: 'mailboxes.deleteSignature',
		read: false,
		workspace: true,
	},
	mailboxesResetup: { path: 'mailboxes.resetup', read: false, workspace: true },
	mailboxesGetResetupStatus: {
		path: 'mailboxes.getResetupStatus',
		read: true,
		workspace: true,
	},
	forwardingGetCapabilities: {
		path: 'forwarding.getCapabilities',
		read: true,
		workspace: true,
	},
	forwardingSetup: { path: 'forwarding.setup', read: false, workspace: true },
	forwardingSetupAdvanced: {
		path: 'forwarding.setupAdvanced',
		read: false,
		workspace: true,
	},
	forwardingUpdate: { path: 'forwarding.update', read: false, workspace: true },
	forwardingRemove: { path: 'forwarding.remove', read: false, workspace: true },
	forwardingListJobs: {
		path: 'forwarding.listJobs',
		read: true,
		workspace: true,
	},
	forwardingListRules: {
		path: 'forwarding.listRules',
		read: true,
		workspace: true,
	},
	forwardingGetRule: {
		path: 'forwarding.getRule',
		read: true,
		workspace: true,
	},
	forwardingUpdateRule: {
		path: 'forwarding.updateRule',
		read: false,
		workspace: true,
	},
	forwardingDeleteRule: {
		path: 'forwarding.deleteRule',
		read: false,
		workspace: true,
	},
	sequencersListPlatforms: {
		path: 'sequencers.listPlatforms',
		read: true,
		workspace: true,
	},
	sequencersList: { path: 'sequencers.list', read: true, workspace: true },
	sequencersGetTags: {
		path: 'sequencers.getTags',
		read: true,
		workspace: true,
	},
	sequencersAdd: { path: 'sequencers.add', read: false, workspace: true },
	sequencersUpdate: { path: 'sequencers.update', read: false, workspace: true },
	sequencersDelete: { path: 'sequencers.delete', read: false, workspace: true },
	sequencersExportMailboxes: {
		path: 'sequencers.exportMailboxes',
		read: false,
		workspace: true,
	},
	sequencersGetExportStatus: {
		path: 'sequencers.getExportStatus',
		read: true,
		workspace: true,
	},
	sequencersVerifyLemlistOtp: {
		path: 'sequencers.verifyLemlistOtp',
		read: false,
		workspace: true,
	},
	warmupList: { path: 'warmup.list', read: true, workspace: true },
	warmupGet: { path: 'warmup.get', read: true, workspace: true },
	warmupGetStats: { path: 'warmup.getStats', read: true, workspace: true },
	warmupGetPricing: { path: 'warmup.getPricing', read: true, workspace: true },
	warmupAdd: { path: 'warmup.add', read: false, workspace: true },
	warmupPause: { path: 'warmup.pause', read: false, workspace: true },
	warmupResume: { path: 'warmup.resume', read: false, workspace: true },
	warmupCancel: { path: 'warmup.cancel', read: false, workspace: true },
	warmupUpdateSettings: {
		path: 'warmup.updateSettings',
		read: false,
		workspace: true,
	},
	warmupCreateConnectLink: {
		path: 'warmup.createConnectLink',
		read: false,
		workspace: true,
	},
	warmupGetConnectLink: {
		path: 'warmup.getConnectLink',
		read: true,
		workspace: true,
	},
	warmupAddSmtpMailboxes: {
		path: 'warmup.addSmtpMailboxes',
		read: false,
		workspace: true,
	},
	warmupListConnectedMailboxes: {
		path: 'warmup.listConnectedMailboxes',
		read: true,
		workspace: true,
	},
	warmupDisconnectMailbox: {
		path: 'warmup.disconnectMailbox',
		read: false,
		workspace: true,
	},
	consentRequestsInitiate: {
		path: 'consentRequests.initiate',
		read: false,
		workspace: true,
	},
	consentRequestsGetStatus: {
		path: 'consentRequests.getStatus',
		read: true,
		workspace: true,
	},
	consentRequestsList: {
		path: 'consentRequests.list',
		read: true,
		workspace: true,
	},
	clientIdRequestsInitiate: {
		path: 'clientIdRequests.initiate',
		read: false,
		workspace: true,
	},
	clientIdRequestsGetStatus: {
		path: 'clientIdRequests.getStatus',
		read: true,
		workspace: true,
	},
	clientIdRequestsList: {
		path: 'clientIdRequests.list',
		read: true,
		workspace: true,
	},
	tagsList: { path: 'tags.list', read: true, workspace: true },
	tagsCreate: { path: 'tags.create', read: false, workspace: true },
	tagsAssign: { path: 'tags.assign', read: false, workspace: true },
	tagsDelete: { path: 'tags.delete', read: false, workspace: true },
	prewarmSearchDomains: {
		path: 'prewarm.searchDomains',
		read: true,
		workspace: true,
	},
	prewarmSearchMailboxes: {
		path: 'prewarm.searchMailboxes',
		read: true,
		workspace: true,
	},
	prewarmCheckAvailability: {
		path: 'prewarm.checkAvailability',
		read: true,
		workspace: true,
	},
	prewarmBuy: { path: 'prewarm.buy', read: false, workspace: true },
	prewarmGetOrderStatus: {
		path: 'prewarm.getOrderStatus',
		read: true,
		workspace: true,
	},
	ordersPlace: { path: 'orders.place', read: false, workspace: true },
	inboxPlacementCreateTest: {
		path: 'inboxPlacement.createTest',
		read: false,
		workspace: true,
	},
	inboxPlacementListTests: {
		path: 'inboxPlacement.listTests',
		read: true,
		workspace: false,
	},
	inboxPlacementGetTest: {
		path: 'inboxPlacement.getTest',
		read: true,
		workspace: false,
	},
	inboxPlacementListScheduled: {
		path: 'inboxPlacement.listScheduled',
		read: true,
		workspace: true,
	},
	inboxPlacementGetScheduled: {
		path: 'inboxPlacement.getScheduled',
		read: true,
		workspace: false,
	},
	inboxPlacementPauseScheduled: {
		path: 'inboxPlacement.pauseScheduled',
		read: false,
		workspace: false,
	},
	inboxPlacementResumeScheduled: {
		path: 'inboxPlacement.resumeScheduled',
		read: false,
		workspace: false,
	},
	inboxPlacementDeleteScheduled: {
		path: 'inboxPlacement.deleteScheduled',
		read: false,
		workspace: false,
	},
	infraGuardList: { path: 'infraGuard.list', read: true, workspace: true },
	infraGuardGet: { path: 'infraGuard.get', read: true, workspace: true },
	infraGuardEnable: { path: 'infraGuard.enable', read: false, workspace: true },
	infraGuardCancel: { path: 'infraGuard.cancel', read: false, workspace: true },
	infraGuardGetStats: {
		path: 'infraGuard.getStats',
		read: true,
		workspace: true,
	},
	infraGuardGetPricing: {
		path: 'infraGuard.getPricing',
		read: true,
		workspace: true,
	},
	infraGuardGetBlacklistHistory: {
		path: 'infraGuard.getBlacklistHistory',
		read: true,
		workspace: true,
	},
	infraGuardGetDnsHistory: {
		path: 'infraGuard.getDnsHistory',
		read: true,
		workspace: true,
	},
	infraGuardGetBounceMetrics: {
		path: 'infraGuard.getBounceMetrics',
		read: true,
		workspace: true,
	},
	infraGuardGetBounceHistory: {
		path: 'infraGuard.getBounceHistory',
		read: true,
		workspace: true,
	},
	infraGuardUpdateSettings: {
		path: 'infraGuard.updateSettings',
		read: false,
		workspace: true,
	},
	infraGuardTriggerCheck: {
		path: 'infraGuard.triggerCheck',
		read: false,
		workspace: true,
	},
	infraGuardListAlerts: {
		path: 'infraGuard.listAlerts',
		read: true,
		workspace: true,
	},
	infraGuardAcknowledgeAlert: {
		path: 'infraGuard.acknowledgeAlert',
		read: false,
		workspace: true,
	},
	infraGuardResolveAlert: {
		path: 'infraGuard.resolveAlert',
		read: false,
		workspace: true,
	},
	infraGuardListActionItems: {
		path: 'infraGuard.listActionItems',
		read: true,
		workspace: true,
	},
	infraGuardGetActionItemStats: {
		path: 'infraGuard.getActionItemStats',
		read: true,
		workspace: true,
	},
	infraGuardResolveActionItem: {
		path: 'infraGuard.resolveActionItem',
		read: false,
		workspace: true,
	},
	infraGuardDismissActionItem: {
		path: 'infraGuard.dismissActionItem',
		read: false,
		workspace: true,
	},
	emailInsightsGetOverview: {
		path: 'emailInsights.getOverview',
		read: true,
		workspace: true,
	},
	emailInsightsGetMailboxesHealth: {
		path: 'emailInsights.getMailboxesHealth',
		read: true,
		workspace: true,
	},
	emailInsightsGetDailyStats: {
		path: 'emailInsights.getDailyStats',
		read: true,
		workspace: true,
	},
	emailInsightsGetHighBounceMailboxes: {
		path: 'emailInsights.getHighBounceMailboxes',
		read: true,
		workspace: true,
	},
	emailInsightsGetCampaignReplyRate: {
		path: 'emailInsights.getCampaignReplyRate',
		read: true,
		workspace: true,
	},
	emailInsightsGetWorkspaceActivity: {
		path: 'emailInsights.getWorkspaceActivity',
		read: true,
		workspace: true,
	},
	emailInsightsGetMailboxStats: {
		path: 'emailInsights.getMailboxStats',
		read: true,
		workspace: true,
	},
	emailInsightsGetMailboxDeliverability: {
		path: 'emailInsights.getMailboxDeliverability',
		read: true,
		workspace: true,
	},
	emailInsightsGetMailboxHealth: {
		path: 'emailInsights.getMailboxHealth',
		read: true,
		workspace: true,
	},
	emailInsightsGetMailboxTrends: {
		path: 'emailInsights.getMailboxTrends',
		read: true,
		workspace: true,
	},
	emailInsightsGetMailboxBounceEvents: {
		path: 'emailInsights.getMailboxBounceEvents',
		read: true,
		workspace: true,
	},
	emailInsightsGetMailboxActivity: {
		path: 'emailInsights.getMailboxActivity',
		read: true,
		workspace: true,
	},
	emailInsightsGetMailboxTopRecipients: {
		path: 'emailInsights.getMailboxTopRecipients',
		read: true,
		workspace: true,
	},
	emailInsightsGetMailboxTopRecipientDomains: {
		path: 'emailInsights.getMailboxTopRecipientDomains',
		read: true,
		workspace: true,
	},
	emailInsightsGetMailboxMessageBreakdown: {
		path: 'emailInsights.getMailboxMessageBreakdown',
		read: true,
		workspace: true,
	},
	emailInsightsGetMailboxSubjectAnalysis: {
		path: 'emailInsights.getMailboxSubjectAnalysis',
		read: true,
		workspace: true,
	},
	emailInsightsGetMailboxReplyTimeHeatmap: {
		path: 'emailInsights.getMailboxReplyTimeHeatmap',
		read: true,
		workspace: true,
	},
	emailInsightsGetMailboxReplyRateByDomain: {
		path: 'emailInsights.getMailboxReplyRateByDomain',
		read: true,
		workspace: true,
	},
	emailInsightsGetMailboxVelocityOverlay: {
		path: 'emailInsights.getMailboxVelocityOverlay',
		read: true,
		workspace: true,
	},
	emailInsightsGetMailboxWarmupStats: {
		path: 'emailInsights.getMailboxWarmupStats',
		read: true,
		workspace: true,
	},
	emailInsightsGetMailboxAuthFailures: {
		path: 'emailInsights.getMailboxAuthFailures',
		read: true,
		workspace: true,
	},
	emailInsightsGetMailboxFirstTouchFunnel: {
		path: 'emailInsights.getMailboxFirstTouchFunnel',
		read: true,
		workspace: true,
	},
	emailInsightsGetMailboxSendingIpBreakdown: {
		path: 'emailInsights.getMailboxSendingIpBreakdown',
		read: true,
		workspace: true,
	},
	emailInsightsGetMailboxRecipientEspBreakdown: {
		path: 'emailInsights.getMailboxRecipientEspBreakdown',
		read: true,
		workspace: true,
	},
	emailInsightsGetMailboxBodyTemplates: {
		path: 'emailInsights.getMailboxBodyTemplates',
		read: true,
		workspace: true,
	},
	verifiedDomainsList: {
		path: 'verifiedDomains.list',
		read: true,
		workspace: false,
	},
	verifiedDomainsAdd: {
		path: 'verifiedDomains.add',
		read: false,
		workspace: false,
	},
	verifiedDomainsVerify: {
		path: 'verifiedDomains.verify',
		read: false,
		workspace: false,
	},
	verifiedDomainsRemove: {
		path: 'verifiedDomains.remove',
		read: false,
		workspace: false,
	},
} as const satisfies Record<
	InboxkitOperation,
	{ path: string; read: boolean; workspace: boolean }
>;
