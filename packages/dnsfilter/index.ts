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
} from 'corsair/core';
import {
	AgentLocalUserBulkDeletes,
	AgentLocalUsers,
	AgentLocalUsersV2,
	ApiKeys,
	ApplicationCategories,
	Applications,
	Billings,
	BlockPages,
	Categories,
	CollectionUsers,
	CurrentUserOrgUiSettings,
	CurrentUsers,
	CurrentUserUiSettings,
	Dashboards,
	Dictionary,
	DictionaryV2,
	DomainNotes,
	Domains,
	EnterpriseConnections,
	Invoices,
	IpAddresses,
	MacAddresses,
	Metrics,
	NetworkLanIps,
	NetworkSubnets,
	Networks,
	Organizations,
	OrganizationUsers,
	Policies,
	PoliciesBulkActions,
	PolicyIps,
	PsaIntegrations,
	ScheduledPolicies,
	ScheduledReportPreviews,
	ScheduledReports,
	ScheduledReportsV2,
	TrafficReports,
	Trials,
	UnblockRequests,
	UserAgentBulkDeletes,
	UserAgentBulkUpdates,
	UserAgentCleanups,
	UserAgentReleases,
	UserAgents,
	UserAgentsV2,
	Users,
} from './endpoints';
import type {
	DnsfilterEndpointInputs,
	DnsfilterEndpointOutputs,
} from './endpoints/types';
import {
	DnsfilterEndpointInputSchemas,
	DnsfilterEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { DnsfilterSchema } from './schema';

export type DnsfilterPluginOptions = {
	/** DNSFilter API key, created in Account Settings in the DNSFilter dashboard. */
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalDnsfilterPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof dnsfilterEndpointsNested>;
};

export type DnsfilterContext = CorsairPluginContext<
	typeof DnsfilterSchema,
	DnsfilterPluginOptions
>;

export type DnsfilterKeyBuilderContext =
	KeyBuilderContext<DnsfilterPluginOptions>;

export type DnsfilterBoundEndpoints = BindEndpoints<
	typeof dnsfilterEndpointsNested
>;

type DnsfilterEndpoint<K extends keyof DnsfilterEndpointOutputs> =
	CorsairEndpoint<
		DnsfilterContext,
		DnsfilterEndpointInputs[K],
		DnsfilterEndpointOutputs[K]
	>;

export type DnsfilterEndpoints = {
	agentLocalUserBulkDeletesCreate: DnsfilterEndpoint<'agentLocalUserBulkDeletesCreate'>;
	agentLocalUserBulkDeletesGet: DnsfilterEndpoint<'agentLocalUserBulkDeletesGet'>;
	agentLocalUserBulkDeletesCounts: DnsfilterEndpoint<'agentLocalUserBulkDeletesCounts'>;
	agentLocalUsersList: DnsfilterEndpoint<'agentLocalUsersList'>;
	agentLocalUsersListAll: DnsfilterEndpoint<'agentLocalUsersListAll'>;
	agentLocalUsersGet: DnsfilterEndpoint<'agentLocalUsersGet'>;
	agentLocalUsersUpdate: DnsfilterEndpoint<'agentLocalUsersUpdate'>;
	agentLocalUsersDelete: DnsfilterEndpoint<'agentLocalUsersDelete'>;
	apiKeysCreate: DnsfilterEndpoint<'apiKeysCreate'>;
	apiKeysList: DnsfilterEndpoint<'apiKeysList'>;
	apiKeysGet: DnsfilterEndpoint<'apiKeysGet'>;
	apiKeysDelete: DnsfilterEndpoint<'apiKeysDelete'>;
	apiKeysRevoke: DnsfilterEndpoint<'apiKeysRevoke'>;
	applicationCategoriesList: DnsfilterEndpoint<'applicationCategoriesList'>;
	applicationCategoriesGet: DnsfilterEndpoint<'applicationCategoriesGet'>;
	applicationsList: DnsfilterEndpoint<'applicationsList'>;
	applicationsListAll: DnsfilterEndpoint<'applicationsListAll'>;
	applicationsGet: DnsfilterEndpoint<'applicationsGet'>;
	billingsGet: DnsfilterEndpoint<'billingsGet'>;
	billingsCreate: DnsfilterEndpoint<'billingsCreate'>;
	billingsAddressShow: DnsfilterEndpoint<'billingsAddressShow'>;
	billingsAddressUpdate: DnsfilterEndpoint<'billingsAddressUpdate'>;
	blockPagesList: DnsfilterEndpoint<'blockPagesList'>;
	blockPagesCreate: DnsfilterEndpoint<'blockPagesCreate'>;
	blockPagesListAll: DnsfilterEndpoint<'blockPagesListAll'>;
	blockPagesGet: DnsfilterEndpoint<'blockPagesGet'>;
	blockPagesUpdate: DnsfilterEndpoint<'blockPagesUpdate'>;
	blockPagesDelete: DnsfilterEndpoint<'blockPagesDelete'>;
	categoriesList: DnsfilterEndpoint<'categoriesList'>;
	categoriesListAll: DnsfilterEndpoint<'categoriesListAll'>;
	categoriesGet: DnsfilterEndpoint<'categoriesGet'>;
	collectionUsersList: DnsfilterEndpoint<'collectionUsersList'>;
	collectionUsersCreate: DnsfilterEndpoint<'collectionUsersCreate'>;
	collectionUsersGet: DnsfilterEndpoint<'collectionUsersGet'>;
	collectionUsersDelete: DnsfilterEndpoint<'collectionUsersDelete'>;
	currentUsersGet: DnsfilterEndpoint<'currentUsersGet'>;
	currentUsersUpdate: DnsfilterEndpoint<'currentUsersUpdate'>;
	dictionaryQpMethods: DnsfilterEndpoint<'dictionaryQpMethods'>;
	domainNotesGet: DnsfilterEndpoint<'domainNotesGet'>;
	domainNotesUpdate: DnsfilterEndpoint<'domainNotesUpdate'>;
	domainNotesBatchUpdate: DnsfilterEndpoint<'domainNotesBatchUpdate'>;
	domainNotesDelete: DnsfilterEndpoint<'domainNotesDelete'>;
	domainNotesBatchDestroy: DnsfilterEndpoint<'domainNotesBatchDestroy'>;
	domainsUserLookup: DnsfilterEndpoint<'domainsUserLookup'>;
	domainsBulkLookup: DnsfilterEndpoint<'domainsBulkLookup'>;
	domainsSuggestThreat: DnsfilterEndpoint<'domainsSuggestThreat'>;
	enterpriseConnectionsList: DnsfilterEndpoint<'enterpriseConnectionsList'>;
	enterpriseConnectionsCreate: DnsfilterEndpoint<'enterpriseConnectionsCreate'>;
	enterpriseConnectionsGet: DnsfilterEndpoint<'enterpriseConnectionsGet'>;
	enterpriseConnectionsUpdate: DnsfilterEndpoint<'enterpriseConnectionsUpdate'>;
	enterpriseConnectionsDelete: DnsfilterEndpoint<'enterpriseConnectionsDelete'>;
	invoicesCurrent: DnsfilterEndpoint<'invoicesCurrent'>;
	invoicesList: DnsfilterEndpoint<'invoicesList'>;
	invoicesGet: DnsfilterEndpoint<'invoicesGet'>;
	ipAddressesList: DnsfilterEndpoint<'ipAddressesList'>;
	ipAddressesCreate: DnsfilterEndpoint<'ipAddressesCreate'>;
	ipAddressesListAll: DnsfilterEndpoint<'ipAddressesListAll'>;
	ipAddressesGet: DnsfilterEndpoint<'ipAddressesGet'>;
	ipAddressesUpdate: DnsfilterEndpoint<'ipAddressesUpdate'>;
	ipAddressesDelete: DnsfilterEndpoint<'ipAddressesDelete'>;
	ipAddressesVerify: DnsfilterEndpoint<'ipAddressesVerify'>;
	ipAddressesMyip: DnsfilterEndpoint<'ipAddressesMyip'>;
	macAddressesList: DnsfilterEndpoint<'macAddressesList'>;
	macAddressesCreate: DnsfilterEndpoint<'macAddressesCreate'>;
	macAddressesListAll: DnsfilterEndpoint<'macAddressesListAll'>;
	macAddressesGet: DnsfilterEndpoint<'macAddressesGet'>;
	macAddressesUpdate: DnsfilterEndpoint<'macAddressesUpdate'>;
	macAddressesDelete: DnsfilterEndpoint<'macAddressesDelete'>;
	metricsOrganizationUsage: DnsfilterEndpoint<'metricsOrganizationUsage'>;
	metricsOrganizationUsageDetailed: DnsfilterEndpoint<'metricsOrganizationUsageDetailed'>;
	networkLanIpsList: DnsfilterEndpoint<'networkLanIpsList'>;
	networkLanIpsGet: DnsfilterEndpoint<'networkLanIpsGet'>;
	networkLanIpsUpdate: DnsfilterEndpoint<'networkLanIpsUpdate'>;
	networkSubnetsListAll: DnsfilterEndpoint<'networkSubnetsListAll'>;
	networkSubnetsList: DnsfilterEndpoint<'networkSubnetsList'>;
	networkSubnetsCreate: DnsfilterEndpoint<'networkSubnetsCreate'>;
	networkSubnetsGet: DnsfilterEndpoint<'networkSubnetsGet'>;
	networkSubnetsUpdate: DnsfilterEndpoint<'networkSubnetsUpdate'>;
	networkSubnetsDelete: DnsfilterEndpoint<'networkSubnetsDelete'>;
	networksList: DnsfilterEndpoint<'networksList'>;
	networksCreate: DnsfilterEndpoint<'networksCreate'>;
	networksListAll: DnsfilterEndpoint<'networksListAll'>;
	networksCounts: DnsfilterEndpoint<'networksCounts'>;
	networksMsp: DnsfilterEndpoint<'networksMsp'>;
	networksMspAll: DnsfilterEndpoint<'networksMspAll'>;
	networksGeo: DnsfilterEndpoint<'networksGeo'>;
	networksLookup: DnsfilterEndpoint<'networksLookup'>;
	networksGet: DnsfilterEndpoint<'networksGet'>;
	networksUpdate: DnsfilterEndpoint<'networksUpdate'>;
	networksDelete: DnsfilterEndpoint<'networksDelete'>;
	networksBulkCreate: DnsfilterEndpoint<'networksBulkCreate'>;
	networksBulkCreateStatus: DnsfilterEndpoint<'networksBulkCreateStatus'>;
	networksBulkUpdate: DnsfilterEndpoint<'networksBulkUpdate'>;
	networksBulkUpdateStatus: DnsfilterEndpoint<'networksBulkUpdateStatus'>;
	networksBulkDestroy: DnsfilterEndpoint<'networksBulkDestroy'>;
	networksBulkDestroyStatus: DnsfilterEndpoint<'networksBulkDestroyStatus'>;
	networksGenerateSecretKey: DnsfilterEndpoint<'networksGenerateSecretKey'>;
	networksRevokeSecretKey: DnsfilterEndpoint<'networksRevokeSecretKey'>;
	networksRotateSecretKey: DnsfilterEndpoint<'networksRotateSecretKey'>;
	organizationUsersList: DnsfilterEndpoint<'organizationUsersList'>;
	organizationUsersCreate: DnsfilterEndpoint<'organizationUsersCreate'>;
	organizationUsersGet: DnsfilterEndpoint<'organizationUsersGet'>;
	organizationUsersUpdate: DnsfilterEndpoint<'organizationUsersUpdate'>;
	organizationUsersDelete: DnsfilterEndpoint<'organizationUsersDelete'>;
	organizationUsersResendInvite: DnsfilterEndpoint<'organizationUsersResendInvite'>;
	organizationsList: DnsfilterEndpoint<'organizationsList'>;
	organizationsCreate: DnsfilterEndpoint<'organizationsCreate'>;
	organizationsListAll: DnsfilterEndpoint<'organizationsListAll'>;
	organizationsGet: DnsfilterEndpoint<'organizationsGet'>;
	organizationsUpdate: DnsfilterEndpoint<'organizationsUpdate'>;
	organizationsDelete: DnsfilterEndpoint<'organizationsDelete'>;
	organizationsSettings: DnsfilterEndpoint<'organizationsSettings'>;
	organizationsBulkUpdate: DnsfilterEndpoint<'organizationsBulkUpdate'>;
	organizationsCancel: DnsfilterEndpoint<'organizationsCancel'>;
	organizationsPromoteToMsp: DnsfilterEndpoint<'organizationsPromoteToMsp'>;
	policiesBulkActionsAddAllowlistDomains: DnsfilterEndpoint<'policiesBulkActionsAddAllowlistDomains'>;
	policiesBulkActionsRemoveAllowlistDomains: DnsfilterEndpoint<'policiesBulkActionsRemoveAllowlistDomains'>;
	policiesBulkActionsAddBlocklistDomains: DnsfilterEndpoint<'policiesBulkActionsAddBlocklistDomains'>;
	policiesBulkActionsRemoveBlocklistDomains: DnsfilterEndpoint<'policiesBulkActionsRemoveBlocklistDomains'>;
	policiesList: DnsfilterEndpoint<'policiesList'>;
	policiesCreate: DnsfilterEndpoint<'policiesCreate'>;
	policiesListAll: DnsfilterEndpoint<'policiesListAll'>;
	policiesGet: DnsfilterEndpoint<'policiesGet'>;
	policiesUpdate: DnsfilterEndpoint<'policiesUpdate'>;
	policiesDelete: DnsfilterEndpoint<'policiesDelete'>;
	policiesApplication: DnsfilterEndpoint<'policiesApplication'>;
	policiesApplicationUpdate: DnsfilterEndpoint<'policiesApplicationUpdate'>;
	policiesAddBlacklistDomain: DnsfilterEndpoint<'policiesAddBlacklistDomain'>;
	policiesRemoveBlacklistDomain: DnsfilterEndpoint<'policiesRemoveBlacklistDomain'>;
	policiesAddWhitelistDomain: DnsfilterEndpoint<'policiesAddWhitelistDomain'>;
	policiesRemoveWhitelistDomain: DnsfilterEndpoint<'policiesRemoveWhitelistDomain'>;
	policiesAddBlacklistCategory: DnsfilterEndpoint<'policiesAddBlacklistCategory'>;
	policiesRemoveBlacklistCategory: DnsfilterEndpoint<'policiesRemoveBlacklistCategory'>;
	policiesAddAllowedApplication: DnsfilterEndpoint<'policiesAddAllowedApplication'>;
	policiesRemoveAllowedApplication: DnsfilterEndpoint<'policiesRemoveAllowedApplication'>;
	policiesAddBlockedApplication: DnsfilterEndpoint<'policiesAddBlockedApplication'>;
	policiesRemoveBlockedApplication: DnsfilterEndpoint<'policiesRemoveBlockedApplication'>;
	policiesGetPermissiveMode: DnsfilterEndpoint<'policiesGetPermissiveMode'>;
	policiesUpdatePermissiveMode: DnsfilterEndpoint<'policiesUpdatePermissiveMode'>;
	policyIpsList: DnsfilterEndpoint<'policyIpsList'>;
	policyIpsGet: DnsfilterEndpoint<'policyIpsGet'>;
	psaIntegrationsRedirectLink: DnsfilterEndpoint<'psaIntegrationsRedirectLink'>;
	scheduledPoliciesList: DnsfilterEndpoint<'scheduledPoliciesList'>;
	scheduledPoliciesCreate: DnsfilterEndpoint<'scheduledPoliciesCreate'>;
	scheduledPoliciesListAll: DnsfilterEndpoint<'scheduledPoliciesListAll'>;
	scheduledPoliciesGet: DnsfilterEndpoint<'scheduledPoliciesGet'>;
	scheduledPoliciesUpdate: DnsfilterEndpoint<'scheduledPoliciesUpdate'>;
	scheduledPoliciesDelete: DnsfilterEndpoint<'scheduledPoliciesDelete'>;
	scheduledReportPreviewsGet: DnsfilterEndpoint<'scheduledReportPreviewsGet'>;
	scheduledReportPreviewsCreate: DnsfilterEndpoint<'scheduledReportPreviewsCreate'>;
	scheduledReportsList: DnsfilterEndpoint<'scheduledReportsList'>;
	scheduledReportsCreate: DnsfilterEndpoint<'scheduledReportsCreate'>;
	scheduledReportsGet: DnsfilterEndpoint<'scheduledReportsGet'>;
	scheduledReportsUpdate: DnsfilterEndpoint<'scheduledReportsUpdate'>;
	scheduledReportsDelete: DnsfilterEndpoint<'scheduledReportsDelete'>;
	trafficReportsTotalRequests: DnsfilterEndpoint<'trafficReportsTotalRequests'>;
	trafficReportsTotalRequestsGeo: DnsfilterEndpoint<'trafficReportsTotalRequestsGeo'>;
	trafficReportsTotalRequestsOrganizations: DnsfilterEndpoint<'trafficReportsTotalRequestsOrganizations'>;
	trafficReportsTotalRequestsAgents: DnsfilterEndpoint<'trafficReportsTotalRequestsAgents'>;
	trafficReportsTotalRequestsUsers: DnsfilterEndpoint<'trafficReportsTotalRequestsUsers'>;
	trafficReportsTotalRequestsCollections: DnsfilterEndpoint<'trafficReportsTotalRequestsCollections'>;
	trafficReportsTotalThreats: DnsfilterEndpoint<'trafficReportsTotalThreats'>;
	trafficReportsTotalThreatsOrganizations: DnsfilterEndpoint<'trafficReportsTotalThreatsOrganizations'>;
	trafficReportsTotalThreatsUsers: DnsfilterEndpoint<'trafficReportsTotalThreatsUsers'>;
	trafficReportsTotalCategories: DnsfilterEndpoint<'trafficReportsTotalCategories'>;
	trafficReportsTotalCategoriesOrganizations: DnsfilterEndpoint<'trafficReportsTotalCategoriesOrganizations'>;
	trafficReportsTotalDomains: DnsfilterEndpoint<'trafficReportsTotalDomains'>;
	trafficReportsTotalDomainsOrganizations: DnsfilterEndpoint<'trafficReportsTotalDomainsOrganizations'>;
	trafficReportsTotalDomainsUsers: DnsfilterEndpoint<'trafficReportsTotalDomainsUsers'>;
	trafficReportsQps: DnsfilterEndpoint<'trafficReportsQps'>;
	trafficReportsQpsActiveOrganizations: DnsfilterEndpoint<'trafficReportsQpsActiveOrganizations'>;
	trafficReportsQpsActiveAgents: DnsfilterEndpoint<'trafficReportsQpsActiveAgents'>;
	trafficReportsTopDomains: DnsfilterEndpoint<'trafficReportsTopDomains'>;
	trafficReportsTopCategories: DnsfilterEndpoint<'trafficReportsTopCategories'>;
	trafficReportsTopApplicationCategories: DnsfilterEndpoint<'trafficReportsTopApplicationCategories'>;
	trafficReportsTopNetworks: DnsfilterEndpoint<'trafficReportsTopNetworks'>;
	trafficReportsTopAgents: DnsfilterEndpoint<'trafficReportsTopAgents'>;
	trafficReportsTopUsers: DnsfilterEndpoint<'trafficReportsTopUsers'>;
	trafficReportsTopCollections: DnsfilterEndpoint<'trafficReportsTopCollections'>;
	trafficReportsQueryLogs: DnsfilterEndpoint<'trafficReportsQueryLogs'>;
	trafficReportsTotalOrganizationsStats: DnsfilterEndpoint<'trafficReportsTotalOrganizationsStats'>;
	trafficReportsTotalDomainStats: DnsfilterEndpoint<'trafficReportsTotalDomainStats'>;
	trafficReportsTotalCategoryStats: DnsfilterEndpoint<'trafficReportsTotalCategoryStats'>;
	trafficReportsTotalOrganizationsRequests: DnsfilterEndpoint<'trafficReportsTotalOrganizationsRequests'>;
	trafficReportsTopOrganizationsRequests: DnsfilterEndpoint<'trafficReportsTopOrganizationsRequests'>;
	trafficReportsTotalClientStats: DnsfilterEndpoint<'trafficReportsTotalClientStats'>;
	trafficReportsTotalDeployments: DnsfilterEndpoint<'trafficReportsTotalDeployments'>;
	trafficReportsTotalRoamingClients: DnsfilterEndpoint<'trafficReportsTotalRoamingClients'>;
	trafficReportsTotalApplicationsStats: DnsfilterEndpoint<'trafficReportsTotalApplicationsStats'>;
	trafficReportsTotalApplicationsNetworksStats: DnsfilterEndpoint<'trafficReportsTotalApplicationsNetworksStats'>;
	trafficReportsTotalApplicationsAgentsStats: DnsfilterEndpoint<'trafficReportsTotalApplicationsAgentsStats'>;
	trafficReportsTotalApplicationsUsersStats: DnsfilterEndpoint<'trafficReportsTotalApplicationsUsersStats'>;
	trafficReportsTotalApplicationsCollectionsStats: DnsfilterEndpoint<'trafficReportsTotalApplicationsCollectionsStats'>;
	trialsCreate: DnsfilterEndpoint<'trialsCreate'>;
	userAgentBulkDeletesCreate: DnsfilterEndpoint<'userAgentBulkDeletesCreate'>;
	userAgentBulkDeletesGet: DnsfilterEndpoint<'userAgentBulkDeletesGet'>;
	userAgentBulkDeletesCounts: DnsfilterEndpoint<'userAgentBulkDeletesCounts'>;
	userAgentBulkUpdatesCreate: DnsfilterEndpoint<'userAgentBulkUpdatesCreate'>;
	userAgentBulkUpdatesGet: DnsfilterEndpoint<'userAgentBulkUpdatesGet'>;
	userAgentBulkUpdatesHasMixed: DnsfilterEndpoint<'userAgentBulkUpdatesHasMixed'>;
	userAgentBulkUpdatesCounts: DnsfilterEndpoint<'userAgentBulkUpdatesCounts'>;
	userAgentCleanupsCreate: DnsfilterEndpoint<'userAgentCleanupsCreate'>;
	userAgentCleanupsGet: DnsfilterEndpoint<'userAgentCleanupsGet'>;
	userAgentCleanupsUpdate: DnsfilterEndpoint<'userAgentCleanupsUpdate'>;
	userAgentReleasesList: DnsfilterEndpoint<'userAgentReleasesList'>;
	userAgentReleasesRelay: DnsfilterEndpoint<'userAgentReleasesRelay'>;
	userAgentsList: DnsfilterEndpoint<'userAgentsList'>;
	userAgentsListAll: DnsfilterEndpoint<'userAgentsListAll'>;
	userAgentsCounts: DnsfilterEndpoint<'userAgentsCounts'>;
	userAgentsGet: DnsfilterEndpoint<'userAgentsGet'>;
	userAgentsUpdate: DnsfilterEndpoint<'userAgentsUpdate'>;
	userAgentsDelete: DnsfilterEndpoint<'userAgentsDelete'>;
	userAgentsTags: DnsfilterEndpoint<'userAgentsTags'>;
	userAgentsDequeueUninstall: DnsfilterEndpoint<'userAgentsDequeueUninstall'>;
	userAgentsCsv: DnsfilterEndpoint<'userAgentsCsv'>;
	userAgentsUninstallPin: DnsfilterEndpoint<'userAgentsUninstallPin'>;
	usersList: DnsfilterEndpoint<'usersList'>;
	usersListAll: DnsfilterEndpoint<'usersListAll'>;
	usersGet: DnsfilterEndpoint<'usersGet'>;
	usersChangePassword: DnsfilterEndpoint<'usersChangePassword'>;
	agentLocalUsersV2Counts: DnsfilterEndpoint<'agentLocalUsersV2Counts'>;
	currentUserOrgUiSettingsSuppressLicenseWarning: DnsfilterEndpoint<'currentUserOrgUiSettingsSuppressLicenseWarning'>;
	currentUserUiSettingsGet: DnsfilterEndpoint<'currentUserUiSettingsGet'>;
	currentUserUiSettingsUpdate: DnsfilterEndpoint<'currentUserUiSettingsUpdate'>;
	dashboardsList: DnsfilterEndpoint<'dashboardsList'>;
	dashboardsCreate: DnsfilterEndpoint<'dashboardsCreate'>;
	dashboardsAvailable: DnsfilterEndpoint<'dashboardsAvailable'>;
	dashboardsOwned: DnsfilterEndpoint<'dashboardsOwned'>;
	dashboardsUpdate: DnsfilterEndpoint<'dashboardsUpdate'>;
	dashboardsDelete: DnsfilterEndpoint<'dashboardsDelete'>;
	dashboardsMakePublic: DnsfilterEndpoint<'dashboardsMakePublic'>;
	dashboardsMakePrivate: DnsfilterEndpoint<'dashboardsMakePrivate'>;
	dashboardsLink: DnsfilterEndpoint<'dashboardsLink'>;
	dashboardsUnlink: DnsfilterEndpoint<'dashboardsUnlink'>;
	dictionaryV2AiApplications: DnsfilterEndpoint<'dictionaryV2AiApplications'>;
	dictionaryV2CyberSightActivityTypes: DnsfilterEndpoint<'dictionaryV2CyberSightActivityTypes'>;
	dictionaryV2VpnSettingsStateTypes: DnsfilterEndpoint<'dictionaryV2VpnSettingsStateTypes'>;
	scheduledReportsV2List: DnsfilterEndpoint<'scheduledReportsV2List'>;
	scheduledReportsV2Create: DnsfilterEndpoint<'scheduledReportsV2Create'>;
	scheduledReportsV2Get: DnsfilterEndpoint<'scheduledReportsV2Get'>;
	scheduledReportsV2Update: DnsfilterEndpoint<'scheduledReportsV2Update'>;
	scheduledReportsV2Delete: DnsfilterEndpoint<'scheduledReportsV2Delete'>;
	scheduledReportsV2BulkUpdate: DnsfilterEndpoint<'scheduledReportsV2BulkUpdate'>;
	unblockRequestsList: DnsfilterEndpoint<'unblockRequestsList'>;
	unblockRequestsCounts: DnsfilterEndpoint<'unblockRequestsCounts'>;
	unblockRequestsPendingCount: DnsfilterEndpoint<'unblockRequestsPendingCount'>;
	unblockRequestsGet: DnsfilterEndpoint<'unblockRequestsGet'>;
	unblockRequestsDecision: DnsfilterEndpoint<'unblockRequestsDecision'>;
	userAgentsV2UpdateSettings: DnsfilterEndpoint<'userAgentsV2UpdateSettings'>;
};

export type DnsfilterBoundWebhooks = BindWebhooks<Record<string, never>>;

const dnsfilterEndpointsNested = {
	agentLocalUserBulkDeletes: {
		create: AgentLocalUserBulkDeletes.agentLocalUserBulkDeletesCreate,
		get: AgentLocalUserBulkDeletes.agentLocalUserBulkDeletesGet,
		counts: AgentLocalUserBulkDeletes.agentLocalUserBulkDeletesCounts,
	},
	agentLocalUsers: {
		list: AgentLocalUsers.agentLocalUsersList,
		listAll: AgentLocalUsers.agentLocalUsersListAll,
		get: AgentLocalUsers.agentLocalUsersGet,
		update: AgentLocalUsers.agentLocalUsersUpdate,
		delete: AgentLocalUsers.agentLocalUsersDelete,
	},
	apiKeys: {
		create: ApiKeys.apiKeysCreate,
		list: ApiKeys.apiKeysList,
		get: ApiKeys.apiKeysGet,
		delete: ApiKeys.apiKeysDelete,
		revoke: ApiKeys.apiKeysRevoke,
	},
	applicationCategories: {
		list: ApplicationCategories.applicationCategoriesList,
		get: ApplicationCategories.applicationCategoriesGet,
	},
	applications: {
		list: Applications.applicationsList,
		listAll: Applications.applicationsListAll,
		get: Applications.applicationsGet,
	},
	billings: {
		get: Billings.billingsGet,
		create: Billings.billingsCreate,
		addressShow: Billings.billingsAddressShow,
		addressUpdate: Billings.billingsAddressUpdate,
	},
	blockPages: {
		list: BlockPages.blockPagesList,
		create: BlockPages.blockPagesCreate,
		listAll: BlockPages.blockPagesListAll,
		get: BlockPages.blockPagesGet,
		update: BlockPages.blockPagesUpdate,
		delete: BlockPages.blockPagesDelete,
	},
	categories: {
		list: Categories.categoriesList,
		listAll: Categories.categoriesListAll,
		get: Categories.categoriesGet,
	},
	collectionUsers: {
		list: CollectionUsers.collectionUsersList,
		create: CollectionUsers.collectionUsersCreate,
		get: CollectionUsers.collectionUsersGet,
		delete: CollectionUsers.collectionUsersDelete,
	},
	currentUsers: {
		get: CurrentUsers.currentUsersGet,
		update: CurrentUsers.currentUsersUpdate,
	},
	dictionary: {
		qpMethods: Dictionary.dictionaryQpMethods,
	},
	domainNotes: {
		get: DomainNotes.domainNotesGet,
		update: DomainNotes.domainNotesUpdate,
		batchUpdate: DomainNotes.domainNotesBatchUpdate,
		delete: DomainNotes.domainNotesDelete,
		batchDestroy: DomainNotes.domainNotesBatchDestroy,
	},
	domains: {
		userLookup: Domains.domainsUserLookup,
		bulkLookup: Domains.domainsBulkLookup,
		suggestThreat: Domains.domainsSuggestThreat,
	},
	enterpriseConnections: {
		list: EnterpriseConnections.enterpriseConnectionsList,
		create: EnterpriseConnections.enterpriseConnectionsCreate,
		get: EnterpriseConnections.enterpriseConnectionsGet,
		update: EnterpriseConnections.enterpriseConnectionsUpdate,
		delete: EnterpriseConnections.enterpriseConnectionsDelete,
	},
	invoices: {
		current: Invoices.invoicesCurrent,
		list: Invoices.invoicesList,
		get: Invoices.invoicesGet,
	},
	ipAddresses: {
		list: IpAddresses.ipAddressesList,
		create: IpAddresses.ipAddressesCreate,
		listAll: IpAddresses.ipAddressesListAll,
		get: IpAddresses.ipAddressesGet,
		update: IpAddresses.ipAddressesUpdate,
		delete: IpAddresses.ipAddressesDelete,
		verify: IpAddresses.ipAddressesVerify,
		myip: IpAddresses.ipAddressesMyip,
	},
	macAddresses: {
		list: MacAddresses.macAddressesList,
		create: MacAddresses.macAddressesCreate,
		listAll: MacAddresses.macAddressesListAll,
		get: MacAddresses.macAddressesGet,
		update: MacAddresses.macAddressesUpdate,
		delete: MacAddresses.macAddressesDelete,
	},
	metrics: {
		organizationUsage: Metrics.metricsOrganizationUsage,
		organizationUsageDetailed: Metrics.metricsOrganizationUsageDetailed,
	},
	networkLanIps: {
		list: NetworkLanIps.networkLanIpsList,
		get: NetworkLanIps.networkLanIpsGet,
		update: NetworkLanIps.networkLanIpsUpdate,
	},
	networkSubnets: {
		listAll: NetworkSubnets.networkSubnetsListAll,
		list: NetworkSubnets.networkSubnetsList,
		create: NetworkSubnets.networkSubnetsCreate,
		get: NetworkSubnets.networkSubnetsGet,
		update: NetworkSubnets.networkSubnetsUpdate,
		delete: NetworkSubnets.networkSubnetsDelete,
	},
	networks: {
		list: Networks.networksList,
		create: Networks.networksCreate,
		listAll: Networks.networksListAll,
		counts: Networks.networksCounts,
		msp: Networks.networksMsp,
		mspAll: Networks.networksMspAll,
		geo: Networks.networksGeo,
		lookup: Networks.networksLookup,
		get: Networks.networksGet,
		update: Networks.networksUpdate,
		delete: Networks.networksDelete,
		bulkCreate: Networks.networksBulkCreate,
		bulkCreateStatus: Networks.networksBulkCreateStatus,
		bulkUpdate: Networks.networksBulkUpdate,
		bulkUpdateStatus: Networks.networksBulkUpdateStatus,
		bulkDestroy: Networks.networksBulkDestroy,
		bulkDestroyStatus: Networks.networksBulkDestroyStatus,
		generateSecretKey: Networks.networksGenerateSecretKey,
		revokeSecretKey: Networks.networksRevokeSecretKey,
		rotateSecretKey: Networks.networksRotateSecretKey,
	},
	organizationUsers: {
		list: OrganizationUsers.organizationUsersList,
		create: OrganizationUsers.organizationUsersCreate,
		get: OrganizationUsers.organizationUsersGet,
		update: OrganizationUsers.organizationUsersUpdate,
		delete: OrganizationUsers.organizationUsersDelete,
		resendInvite: OrganizationUsers.organizationUsersResendInvite,
	},
	organizations: {
		list: Organizations.organizationsList,
		create: Organizations.organizationsCreate,
		listAll: Organizations.organizationsListAll,
		get: Organizations.organizationsGet,
		update: Organizations.organizationsUpdate,
		delete: Organizations.organizationsDelete,
		settings: Organizations.organizationsSettings,
		bulkUpdate: Organizations.organizationsBulkUpdate,
		cancel: Organizations.organizationsCancel,
		promoteToMsp: Organizations.organizationsPromoteToMsp,
	},
	policiesBulkActions: {
		addAllowlistDomains:
			PoliciesBulkActions.policiesBulkActionsAddAllowlistDomains,
		removeAllowlistDomains:
			PoliciesBulkActions.policiesBulkActionsRemoveAllowlistDomains,
		addBlocklistDomains:
			PoliciesBulkActions.policiesBulkActionsAddBlocklistDomains,
		removeBlocklistDomains:
			PoliciesBulkActions.policiesBulkActionsRemoveBlocklistDomains,
	},
	policies: {
		list: Policies.policiesList,
		create: Policies.policiesCreate,
		listAll: Policies.policiesListAll,
		get: Policies.policiesGet,
		update: Policies.policiesUpdate,
		delete: Policies.policiesDelete,
		application: Policies.policiesApplication,
		applicationUpdate: Policies.policiesApplicationUpdate,
		addBlacklistDomain: Policies.policiesAddBlacklistDomain,
		removeBlacklistDomain: Policies.policiesRemoveBlacklistDomain,
		addWhitelistDomain: Policies.policiesAddWhitelistDomain,
		removeWhitelistDomain: Policies.policiesRemoveWhitelistDomain,
		addBlacklistCategory: Policies.policiesAddBlacklistCategory,
		removeBlacklistCategory: Policies.policiesRemoveBlacklistCategory,
		addAllowedApplication: Policies.policiesAddAllowedApplication,
		removeAllowedApplication: Policies.policiesRemoveAllowedApplication,
		addBlockedApplication: Policies.policiesAddBlockedApplication,
		removeBlockedApplication: Policies.policiesRemoveBlockedApplication,
		getPermissiveMode: Policies.policiesGetPermissiveMode,
		updatePermissiveMode: Policies.policiesUpdatePermissiveMode,
	},
	policyIps: {
		list: PolicyIps.policyIpsList,
		get: PolicyIps.policyIpsGet,
	},
	psaIntegrations: {
		redirectLink: PsaIntegrations.psaIntegrationsRedirectLink,
	},
	scheduledPolicies: {
		list: ScheduledPolicies.scheduledPoliciesList,
		create: ScheduledPolicies.scheduledPoliciesCreate,
		listAll: ScheduledPolicies.scheduledPoliciesListAll,
		get: ScheduledPolicies.scheduledPoliciesGet,
		update: ScheduledPolicies.scheduledPoliciesUpdate,
		delete: ScheduledPolicies.scheduledPoliciesDelete,
	},
	scheduledReportPreviews: {
		get: ScheduledReportPreviews.scheduledReportPreviewsGet,
		create: ScheduledReportPreviews.scheduledReportPreviewsCreate,
	},
	scheduledReports: {
		list: ScheduledReports.scheduledReportsList,
		create: ScheduledReports.scheduledReportsCreate,
		get: ScheduledReports.scheduledReportsGet,
		update: ScheduledReports.scheduledReportsUpdate,
		delete: ScheduledReports.scheduledReportsDelete,
	},
	trafficReports: {
		totalRequests: TrafficReports.trafficReportsTotalRequests,
		totalRequestsGeo: TrafficReports.trafficReportsTotalRequestsGeo,
		totalRequestsOrganizations:
			TrafficReports.trafficReportsTotalRequestsOrganizations,
		totalRequestsAgents: TrafficReports.trafficReportsTotalRequestsAgents,
		totalRequestsUsers: TrafficReports.trafficReportsTotalRequestsUsers,
		totalRequestsCollections:
			TrafficReports.trafficReportsTotalRequestsCollections,
		totalThreats: TrafficReports.trafficReportsTotalThreats,
		totalThreatsOrganizations:
			TrafficReports.trafficReportsTotalThreatsOrganizations,
		totalThreatsUsers: TrafficReports.trafficReportsTotalThreatsUsers,
		totalCategories: TrafficReports.trafficReportsTotalCategories,
		totalCategoriesOrganizations:
			TrafficReports.trafficReportsTotalCategoriesOrganizations,
		totalDomains: TrafficReports.trafficReportsTotalDomains,
		totalDomainsOrganizations:
			TrafficReports.trafficReportsTotalDomainsOrganizations,
		totalDomainsUsers: TrafficReports.trafficReportsTotalDomainsUsers,
		qps: TrafficReports.trafficReportsQps,
		qpsActiveOrganizations: TrafficReports.trafficReportsQpsActiveOrganizations,
		qpsActiveAgents: TrafficReports.trafficReportsQpsActiveAgents,
		topDomains: TrafficReports.trafficReportsTopDomains,
		topCategories: TrafficReports.trafficReportsTopCategories,
		topApplicationCategories:
			TrafficReports.trafficReportsTopApplicationCategories,
		topNetworks: TrafficReports.trafficReportsTopNetworks,
		topAgents: TrafficReports.trafficReportsTopAgents,
		topUsers: TrafficReports.trafficReportsTopUsers,
		topCollections: TrafficReports.trafficReportsTopCollections,
		queryLogs: TrafficReports.trafficReportsQueryLogs,
		totalOrganizationsStats:
			TrafficReports.trafficReportsTotalOrganizationsStats,
		totalDomainStats: TrafficReports.trafficReportsTotalDomainStats,
		totalCategoryStats: TrafficReports.trafficReportsTotalCategoryStats,
		totalOrganizationsRequests:
			TrafficReports.trafficReportsTotalOrganizationsRequests,
		topOrganizationsRequests:
			TrafficReports.trafficReportsTopOrganizationsRequests,
		totalClientStats: TrafficReports.trafficReportsTotalClientStats,
		totalDeployments: TrafficReports.trafficReportsTotalDeployments,
		totalRoamingClients: TrafficReports.trafficReportsTotalRoamingClients,
		totalApplicationsStats: TrafficReports.trafficReportsTotalApplicationsStats,
		totalApplicationsNetworksStats:
			TrafficReports.trafficReportsTotalApplicationsNetworksStats,
		totalApplicationsAgentsStats:
			TrafficReports.trafficReportsTotalApplicationsAgentsStats,
		totalApplicationsUsersStats:
			TrafficReports.trafficReportsTotalApplicationsUsersStats,
		totalApplicationsCollectionsStats:
			TrafficReports.trafficReportsTotalApplicationsCollectionsStats,
	},
	trials: {
		create: Trials.trialsCreate,
	},
	userAgentBulkDeletes: {
		create: UserAgentBulkDeletes.userAgentBulkDeletesCreate,
		get: UserAgentBulkDeletes.userAgentBulkDeletesGet,
		counts: UserAgentBulkDeletes.userAgentBulkDeletesCounts,
	},
	userAgentBulkUpdates: {
		create: UserAgentBulkUpdates.userAgentBulkUpdatesCreate,
		get: UserAgentBulkUpdates.userAgentBulkUpdatesGet,
		hasMixed: UserAgentBulkUpdates.userAgentBulkUpdatesHasMixed,
		counts: UserAgentBulkUpdates.userAgentBulkUpdatesCounts,
	},
	userAgentCleanups: {
		create: UserAgentCleanups.userAgentCleanupsCreate,
		get: UserAgentCleanups.userAgentCleanupsGet,
		update: UserAgentCleanups.userAgentCleanupsUpdate,
	},
	userAgentReleases: {
		list: UserAgentReleases.userAgentReleasesList,
		relay: UserAgentReleases.userAgentReleasesRelay,
	},
	userAgents: {
		list: UserAgents.userAgentsList,
		listAll: UserAgents.userAgentsListAll,
		counts: UserAgents.userAgentsCounts,
		get: UserAgents.userAgentsGet,
		update: UserAgents.userAgentsUpdate,
		delete: UserAgents.userAgentsDelete,
		tags: UserAgents.userAgentsTags,
		dequeueUninstall: UserAgents.userAgentsDequeueUninstall,
		csv: UserAgents.userAgentsCsv,
		uninstallPin: UserAgents.userAgentsUninstallPin,
	},
	users: {
		list: Users.usersList,
		listAll: Users.usersListAll,
		get: Users.usersGet,
		changePassword: Users.usersChangePassword,
	},
	agentLocalUsersV2: {
		counts: AgentLocalUsersV2.agentLocalUsersV2Counts,
	},
	currentUserOrgUiSettings: {
		suppressLicenseWarning:
			CurrentUserOrgUiSettings.currentUserOrgUiSettingsSuppressLicenseWarning,
	},
	currentUserUiSettings: {
		get: CurrentUserUiSettings.currentUserUiSettingsGet,
		update: CurrentUserUiSettings.currentUserUiSettingsUpdate,
	},
	dashboards: {
		list: Dashboards.dashboardsList,
		create: Dashboards.dashboardsCreate,
		available: Dashboards.dashboardsAvailable,
		owned: Dashboards.dashboardsOwned,
		update: Dashboards.dashboardsUpdate,
		delete: Dashboards.dashboardsDelete,
		makePublic: Dashboards.dashboardsMakePublic,
		makePrivate: Dashboards.dashboardsMakePrivate,
		link: Dashboards.dashboardsLink,
		unlink: Dashboards.dashboardsUnlink,
	},
	dictionaryV2: {
		aiApplications: DictionaryV2.dictionaryV2AiApplications,
		cyberSightActivityTypes: DictionaryV2.dictionaryV2CyberSightActivityTypes,
		vpnSettingsStateTypes: DictionaryV2.dictionaryV2VpnSettingsStateTypes,
	},
	scheduledReportsV2: {
		list: ScheduledReportsV2.scheduledReportsV2List,
		create: ScheduledReportsV2.scheduledReportsV2Create,
		get: ScheduledReportsV2.scheduledReportsV2Get,
		update: ScheduledReportsV2.scheduledReportsV2Update,
		delete: ScheduledReportsV2.scheduledReportsV2Delete,
		bulkUpdate: ScheduledReportsV2.scheduledReportsV2BulkUpdate,
	},
	unblockRequests: {
		list: UnblockRequests.unblockRequestsList,
		counts: UnblockRequests.unblockRequestsCounts,
		pendingCount: UnblockRequests.unblockRequestsPendingCount,
		get: UnblockRequests.unblockRequestsGet,
		decision: UnblockRequests.unblockRequestsDecision,
	},
	userAgentsV2: {
		updateSettings: UserAgentsV2.userAgentsV2UpdateSettings,
	},
} as const;

const dnsfilterWebhooksNested = {} as const;

export const dnsfilterEndpointSchemas = {
	'agentLocalUserBulkDeletes.create': {
		input: DnsfilterEndpointInputSchemas.agentLocalUserBulkDeletesCreate,
		output: DnsfilterEndpointOutputSchemas.agentLocalUserBulkDeletesCreate,
	},
	'agentLocalUserBulkDeletes.get': {
		input: DnsfilterEndpointInputSchemas.agentLocalUserBulkDeletesGet,
		output: DnsfilterEndpointOutputSchemas.agentLocalUserBulkDeletesGet,
	},
	'agentLocalUserBulkDeletes.counts': {
		input: DnsfilterEndpointInputSchemas.agentLocalUserBulkDeletesCounts,
		output: DnsfilterEndpointOutputSchemas.agentLocalUserBulkDeletesCounts,
	},
	'agentLocalUsers.list': {
		input: DnsfilterEndpointInputSchemas.agentLocalUsersList,
		output: DnsfilterEndpointOutputSchemas.agentLocalUsersList,
	},
	'agentLocalUsers.listAll': {
		input: DnsfilterEndpointInputSchemas.agentLocalUsersListAll,
		output: DnsfilterEndpointOutputSchemas.agentLocalUsersListAll,
	},
	'agentLocalUsers.get': {
		input: DnsfilterEndpointInputSchemas.agentLocalUsersGet,
		output: DnsfilterEndpointOutputSchemas.agentLocalUsersGet,
	},
	'agentLocalUsers.update': {
		input: DnsfilterEndpointInputSchemas.agentLocalUsersUpdate,
		output: DnsfilterEndpointOutputSchemas.agentLocalUsersUpdate,
	},
	'agentLocalUsers.delete': {
		input: DnsfilterEndpointInputSchemas.agentLocalUsersDelete,
		output: DnsfilterEndpointOutputSchemas.agentLocalUsersDelete,
	},
	'apiKeys.create': {
		input: DnsfilterEndpointInputSchemas.apiKeysCreate,
		output: DnsfilterEndpointOutputSchemas.apiKeysCreate,
	},
	'apiKeys.list': {
		input: DnsfilterEndpointInputSchemas.apiKeysList,
		output: DnsfilterEndpointOutputSchemas.apiKeysList,
	},
	'apiKeys.get': {
		input: DnsfilterEndpointInputSchemas.apiKeysGet,
		output: DnsfilterEndpointOutputSchemas.apiKeysGet,
	},
	'apiKeys.delete': {
		input: DnsfilterEndpointInputSchemas.apiKeysDelete,
		output: DnsfilterEndpointOutputSchemas.apiKeysDelete,
	},
	'apiKeys.revoke': {
		input: DnsfilterEndpointInputSchemas.apiKeysRevoke,
		output: DnsfilterEndpointOutputSchemas.apiKeysRevoke,
	},
	'applicationCategories.list': {
		input: DnsfilterEndpointInputSchemas.applicationCategoriesList,
		output: DnsfilterEndpointOutputSchemas.applicationCategoriesList,
	},
	'applicationCategories.get': {
		input: DnsfilterEndpointInputSchemas.applicationCategoriesGet,
		output: DnsfilterEndpointOutputSchemas.applicationCategoriesGet,
	},
	'applications.list': {
		input: DnsfilterEndpointInputSchemas.applicationsList,
		output: DnsfilterEndpointOutputSchemas.applicationsList,
	},
	'applications.listAll': {
		input: DnsfilterEndpointInputSchemas.applicationsListAll,
		output: DnsfilterEndpointOutputSchemas.applicationsListAll,
	},
	'applications.get': {
		input: DnsfilterEndpointInputSchemas.applicationsGet,
		output: DnsfilterEndpointOutputSchemas.applicationsGet,
	},
	'billings.get': {
		input: DnsfilterEndpointInputSchemas.billingsGet,
		output: DnsfilterEndpointOutputSchemas.billingsGet,
	},
	'billings.create': {
		input: DnsfilterEndpointInputSchemas.billingsCreate,
		output: DnsfilterEndpointOutputSchemas.billingsCreate,
	},
	'billings.addressShow': {
		input: DnsfilterEndpointInputSchemas.billingsAddressShow,
		output: DnsfilterEndpointOutputSchemas.billingsAddressShow,
	},
	'billings.addressUpdate': {
		input: DnsfilterEndpointInputSchemas.billingsAddressUpdate,
		output: DnsfilterEndpointOutputSchemas.billingsAddressUpdate,
	},
	'blockPages.list': {
		input: DnsfilterEndpointInputSchemas.blockPagesList,
		output: DnsfilterEndpointOutputSchemas.blockPagesList,
	},
	'blockPages.create': {
		input: DnsfilterEndpointInputSchemas.blockPagesCreate,
		output: DnsfilterEndpointOutputSchemas.blockPagesCreate,
	},
	'blockPages.listAll': {
		input: DnsfilterEndpointInputSchemas.blockPagesListAll,
		output: DnsfilterEndpointOutputSchemas.blockPagesListAll,
	},
	'blockPages.get': {
		input: DnsfilterEndpointInputSchemas.blockPagesGet,
		output: DnsfilterEndpointOutputSchemas.blockPagesGet,
	},
	'blockPages.update': {
		input: DnsfilterEndpointInputSchemas.blockPagesUpdate,
		output: DnsfilterEndpointOutputSchemas.blockPagesUpdate,
	},
	'blockPages.delete': {
		input: DnsfilterEndpointInputSchemas.blockPagesDelete,
		output: DnsfilterEndpointOutputSchemas.blockPagesDelete,
	},
	'categories.list': {
		input: DnsfilterEndpointInputSchemas.categoriesList,
		output: DnsfilterEndpointOutputSchemas.categoriesList,
	},
	'categories.listAll': {
		input: DnsfilterEndpointInputSchemas.categoriesListAll,
		output: DnsfilterEndpointOutputSchemas.categoriesListAll,
	},
	'categories.get': {
		input: DnsfilterEndpointInputSchemas.categoriesGet,
		output: DnsfilterEndpointOutputSchemas.categoriesGet,
	},
	'collectionUsers.list': {
		input: DnsfilterEndpointInputSchemas.collectionUsersList,
		output: DnsfilterEndpointOutputSchemas.collectionUsersList,
	},
	'collectionUsers.create': {
		input: DnsfilterEndpointInputSchemas.collectionUsersCreate,
		output: DnsfilterEndpointOutputSchemas.collectionUsersCreate,
	},
	'collectionUsers.get': {
		input: DnsfilterEndpointInputSchemas.collectionUsersGet,
		output: DnsfilterEndpointOutputSchemas.collectionUsersGet,
	},
	'collectionUsers.delete': {
		input: DnsfilterEndpointInputSchemas.collectionUsersDelete,
		output: DnsfilterEndpointOutputSchemas.collectionUsersDelete,
	},
	'currentUsers.get': {
		input: DnsfilterEndpointInputSchemas.currentUsersGet,
		output: DnsfilterEndpointOutputSchemas.currentUsersGet,
	},
	'currentUsers.update': {
		input: DnsfilterEndpointInputSchemas.currentUsersUpdate,
		output: DnsfilterEndpointOutputSchemas.currentUsersUpdate,
	},
	'dictionary.qpMethods': {
		input: DnsfilterEndpointInputSchemas.dictionaryQpMethods,
		output: DnsfilterEndpointOutputSchemas.dictionaryQpMethods,
	},
	'domainNotes.get': {
		input: DnsfilterEndpointInputSchemas.domainNotesGet,
		output: DnsfilterEndpointOutputSchemas.domainNotesGet,
	},
	'domainNotes.update': {
		input: DnsfilterEndpointInputSchemas.domainNotesUpdate,
		output: DnsfilterEndpointOutputSchemas.domainNotesUpdate,
	},
	'domainNotes.batchUpdate': {
		input: DnsfilterEndpointInputSchemas.domainNotesBatchUpdate,
		output: DnsfilterEndpointOutputSchemas.domainNotesBatchUpdate,
	},
	'domainNotes.delete': {
		input: DnsfilterEndpointInputSchemas.domainNotesDelete,
		output: DnsfilterEndpointOutputSchemas.domainNotesDelete,
	},
	'domainNotes.batchDestroy': {
		input: DnsfilterEndpointInputSchemas.domainNotesBatchDestroy,
		output: DnsfilterEndpointOutputSchemas.domainNotesBatchDestroy,
	},
	'domains.userLookup': {
		input: DnsfilterEndpointInputSchemas.domainsUserLookup,
		output: DnsfilterEndpointOutputSchemas.domainsUserLookup,
	},
	'domains.bulkLookup': {
		input: DnsfilterEndpointInputSchemas.domainsBulkLookup,
		output: DnsfilterEndpointOutputSchemas.domainsBulkLookup,
	},
	'domains.suggestThreat': {
		input: DnsfilterEndpointInputSchemas.domainsSuggestThreat,
		output: DnsfilterEndpointOutputSchemas.domainsSuggestThreat,
	},
	'enterpriseConnections.list': {
		input: DnsfilterEndpointInputSchemas.enterpriseConnectionsList,
		output: DnsfilterEndpointOutputSchemas.enterpriseConnectionsList,
	},
	'enterpriseConnections.create': {
		input: DnsfilterEndpointInputSchemas.enterpriseConnectionsCreate,
		output: DnsfilterEndpointOutputSchemas.enterpriseConnectionsCreate,
	},
	'enterpriseConnections.get': {
		input: DnsfilterEndpointInputSchemas.enterpriseConnectionsGet,
		output: DnsfilterEndpointOutputSchemas.enterpriseConnectionsGet,
	},
	'enterpriseConnections.update': {
		input: DnsfilterEndpointInputSchemas.enterpriseConnectionsUpdate,
		output: DnsfilterEndpointOutputSchemas.enterpriseConnectionsUpdate,
	},
	'enterpriseConnections.delete': {
		input: DnsfilterEndpointInputSchemas.enterpriseConnectionsDelete,
		output: DnsfilterEndpointOutputSchemas.enterpriseConnectionsDelete,
	},
	'invoices.current': {
		input: DnsfilterEndpointInputSchemas.invoicesCurrent,
		output: DnsfilterEndpointOutputSchemas.invoicesCurrent,
	},
	'invoices.list': {
		input: DnsfilterEndpointInputSchemas.invoicesList,
		output: DnsfilterEndpointOutputSchemas.invoicesList,
	},
	'invoices.get': {
		input: DnsfilterEndpointInputSchemas.invoicesGet,
		output: DnsfilterEndpointOutputSchemas.invoicesGet,
	},
	'ipAddresses.list': {
		input: DnsfilterEndpointInputSchemas.ipAddressesList,
		output: DnsfilterEndpointOutputSchemas.ipAddressesList,
	},
	'ipAddresses.create': {
		input: DnsfilterEndpointInputSchemas.ipAddressesCreate,
		output: DnsfilterEndpointOutputSchemas.ipAddressesCreate,
	},
	'ipAddresses.listAll': {
		input: DnsfilterEndpointInputSchemas.ipAddressesListAll,
		output: DnsfilterEndpointOutputSchemas.ipAddressesListAll,
	},
	'ipAddresses.get': {
		input: DnsfilterEndpointInputSchemas.ipAddressesGet,
		output: DnsfilterEndpointOutputSchemas.ipAddressesGet,
	},
	'ipAddresses.update': {
		input: DnsfilterEndpointInputSchemas.ipAddressesUpdate,
		output: DnsfilterEndpointOutputSchemas.ipAddressesUpdate,
	},
	'ipAddresses.delete': {
		input: DnsfilterEndpointInputSchemas.ipAddressesDelete,
		output: DnsfilterEndpointOutputSchemas.ipAddressesDelete,
	},
	'ipAddresses.verify': {
		input: DnsfilterEndpointInputSchemas.ipAddressesVerify,
		output: DnsfilterEndpointOutputSchemas.ipAddressesVerify,
	},
	'ipAddresses.myip': {
		input: DnsfilterEndpointInputSchemas.ipAddressesMyip,
		output: DnsfilterEndpointOutputSchemas.ipAddressesMyip,
	},
	'macAddresses.list': {
		input: DnsfilterEndpointInputSchemas.macAddressesList,
		output: DnsfilterEndpointOutputSchemas.macAddressesList,
	},
	'macAddresses.create': {
		input: DnsfilterEndpointInputSchemas.macAddressesCreate,
		output: DnsfilterEndpointOutputSchemas.macAddressesCreate,
	},
	'macAddresses.listAll': {
		input: DnsfilterEndpointInputSchemas.macAddressesListAll,
		output: DnsfilterEndpointOutputSchemas.macAddressesListAll,
	},
	'macAddresses.get': {
		input: DnsfilterEndpointInputSchemas.macAddressesGet,
		output: DnsfilterEndpointOutputSchemas.macAddressesGet,
	},
	'macAddresses.update': {
		input: DnsfilterEndpointInputSchemas.macAddressesUpdate,
		output: DnsfilterEndpointOutputSchemas.macAddressesUpdate,
	},
	'macAddresses.delete': {
		input: DnsfilterEndpointInputSchemas.macAddressesDelete,
		output: DnsfilterEndpointOutputSchemas.macAddressesDelete,
	},
	'metrics.organizationUsage': {
		input: DnsfilterEndpointInputSchemas.metricsOrganizationUsage,
		output: DnsfilterEndpointOutputSchemas.metricsOrganizationUsage,
	},
	'metrics.organizationUsageDetailed': {
		input: DnsfilterEndpointInputSchemas.metricsOrganizationUsageDetailed,
		output: DnsfilterEndpointOutputSchemas.metricsOrganizationUsageDetailed,
	},
	'networkLanIps.list': {
		input: DnsfilterEndpointInputSchemas.networkLanIpsList,
		output: DnsfilterEndpointOutputSchemas.networkLanIpsList,
	},
	'networkLanIps.get': {
		input: DnsfilterEndpointInputSchemas.networkLanIpsGet,
		output: DnsfilterEndpointOutputSchemas.networkLanIpsGet,
	},
	'networkLanIps.update': {
		input: DnsfilterEndpointInputSchemas.networkLanIpsUpdate,
		output: DnsfilterEndpointOutputSchemas.networkLanIpsUpdate,
	},
	'networkSubnets.listAll': {
		input: DnsfilterEndpointInputSchemas.networkSubnetsListAll,
		output: DnsfilterEndpointOutputSchemas.networkSubnetsListAll,
	},
	'networkSubnets.list': {
		input: DnsfilterEndpointInputSchemas.networkSubnetsList,
		output: DnsfilterEndpointOutputSchemas.networkSubnetsList,
	},
	'networkSubnets.create': {
		input: DnsfilterEndpointInputSchemas.networkSubnetsCreate,
		output: DnsfilterEndpointOutputSchemas.networkSubnetsCreate,
	},
	'networkSubnets.get': {
		input: DnsfilterEndpointInputSchemas.networkSubnetsGet,
		output: DnsfilterEndpointOutputSchemas.networkSubnetsGet,
	},
	'networkSubnets.update': {
		input: DnsfilterEndpointInputSchemas.networkSubnetsUpdate,
		output: DnsfilterEndpointOutputSchemas.networkSubnetsUpdate,
	},
	'networkSubnets.delete': {
		input: DnsfilterEndpointInputSchemas.networkSubnetsDelete,
		output: DnsfilterEndpointOutputSchemas.networkSubnetsDelete,
	},
	'networks.list': {
		input: DnsfilterEndpointInputSchemas.networksList,
		output: DnsfilterEndpointOutputSchemas.networksList,
	},
	'networks.create': {
		input: DnsfilterEndpointInputSchemas.networksCreate,
		output: DnsfilterEndpointOutputSchemas.networksCreate,
	},
	'networks.listAll': {
		input: DnsfilterEndpointInputSchemas.networksListAll,
		output: DnsfilterEndpointOutputSchemas.networksListAll,
	},
	'networks.counts': {
		input: DnsfilterEndpointInputSchemas.networksCounts,
		output: DnsfilterEndpointOutputSchemas.networksCounts,
	},
	'networks.msp': {
		input: DnsfilterEndpointInputSchemas.networksMsp,
		output: DnsfilterEndpointOutputSchemas.networksMsp,
	},
	'networks.mspAll': {
		input: DnsfilterEndpointInputSchemas.networksMspAll,
		output: DnsfilterEndpointOutputSchemas.networksMspAll,
	},
	'networks.geo': {
		input: DnsfilterEndpointInputSchemas.networksGeo,
		output: DnsfilterEndpointOutputSchemas.networksGeo,
	},
	'networks.lookup': {
		input: DnsfilterEndpointInputSchemas.networksLookup,
		output: DnsfilterEndpointOutputSchemas.networksLookup,
	},
	'networks.get': {
		input: DnsfilterEndpointInputSchemas.networksGet,
		output: DnsfilterEndpointOutputSchemas.networksGet,
	},
	'networks.update': {
		input: DnsfilterEndpointInputSchemas.networksUpdate,
		output: DnsfilterEndpointOutputSchemas.networksUpdate,
	},
	'networks.delete': {
		input: DnsfilterEndpointInputSchemas.networksDelete,
		output: DnsfilterEndpointOutputSchemas.networksDelete,
	},
	'networks.bulkCreate': {
		input: DnsfilterEndpointInputSchemas.networksBulkCreate,
		output: DnsfilterEndpointOutputSchemas.networksBulkCreate,
	},
	'networks.bulkCreateStatus': {
		input: DnsfilterEndpointInputSchemas.networksBulkCreateStatus,
		output: DnsfilterEndpointOutputSchemas.networksBulkCreateStatus,
	},
	'networks.bulkUpdate': {
		input: DnsfilterEndpointInputSchemas.networksBulkUpdate,
		output: DnsfilterEndpointOutputSchemas.networksBulkUpdate,
	},
	'networks.bulkUpdateStatus': {
		input: DnsfilterEndpointInputSchemas.networksBulkUpdateStatus,
		output: DnsfilterEndpointOutputSchemas.networksBulkUpdateStatus,
	},
	'networks.bulkDestroy': {
		input: DnsfilterEndpointInputSchemas.networksBulkDestroy,
		output: DnsfilterEndpointOutputSchemas.networksBulkDestroy,
	},
	'networks.bulkDestroyStatus': {
		input: DnsfilterEndpointInputSchemas.networksBulkDestroyStatus,
		output: DnsfilterEndpointOutputSchemas.networksBulkDestroyStatus,
	},
	'networks.generateSecretKey': {
		input: DnsfilterEndpointInputSchemas.networksGenerateSecretKey,
		output: DnsfilterEndpointOutputSchemas.networksGenerateSecretKey,
	},
	'networks.revokeSecretKey': {
		input: DnsfilterEndpointInputSchemas.networksRevokeSecretKey,
		output: DnsfilterEndpointOutputSchemas.networksRevokeSecretKey,
	},
	'networks.rotateSecretKey': {
		input: DnsfilterEndpointInputSchemas.networksRotateSecretKey,
		output: DnsfilterEndpointOutputSchemas.networksRotateSecretKey,
	},
	'organizationUsers.list': {
		input: DnsfilterEndpointInputSchemas.organizationUsersList,
		output: DnsfilterEndpointOutputSchemas.organizationUsersList,
	},
	'organizationUsers.create': {
		input: DnsfilterEndpointInputSchemas.organizationUsersCreate,
		output: DnsfilterEndpointOutputSchemas.organizationUsersCreate,
	},
	'organizationUsers.get': {
		input: DnsfilterEndpointInputSchemas.organizationUsersGet,
		output: DnsfilterEndpointOutputSchemas.organizationUsersGet,
	},
	'organizationUsers.update': {
		input: DnsfilterEndpointInputSchemas.organizationUsersUpdate,
		output: DnsfilterEndpointOutputSchemas.organizationUsersUpdate,
	},
	'organizationUsers.delete': {
		input: DnsfilterEndpointInputSchemas.organizationUsersDelete,
		output: DnsfilterEndpointOutputSchemas.organizationUsersDelete,
	},
	'organizationUsers.resendInvite': {
		input: DnsfilterEndpointInputSchemas.organizationUsersResendInvite,
		output: DnsfilterEndpointOutputSchemas.organizationUsersResendInvite,
	},
	'organizations.list': {
		input: DnsfilterEndpointInputSchemas.organizationsList,
		output: DnsfilterEndpointOutputSchemas.organizationsList,
	},
	'organizations.create': {
		input: DnsfilterEndpointInputSchemas.organizationsCreate,
		output: DnsfilterEndpointOutputSchemas.organizationsCreate,
	},
	'organizations.listAll': {
		input: DnsfilterEndpointInputSchemas.organizationsListAll,
		output: DnsfilterEndpointOutputSchemas.organizationsListAll,
	},
	'organizations.get': {
		input: DnsfilterEndpointInputSchemas.organizationsGet,
		output: DnsfilterEndpointOutputSchemas.organizationsGet,
	},
	'organizations.update': {
		input: DnsfilterEndpointInputSchemas.organizationsUpdate,
		output: DnsfilterEndpointOutputSchemas.organizationsUpdate,
	},
	'organizations.delete': {
		input: DnsfilterEndpointInputSchemas.organizationsDelete,
		output: DnsfilterEndpointOutputSchemas.organizationsDelete,
	},
	'organizations.settings': {
		input: DnsfilterEndpointInputSchemas.organizationsSettings,
		output: DnsfilterEndpointOutputSchemas.organizationsSettings,
	},
	'organizations.bulkUpdate': {
		input: DnsfilterEndpointInputSchemas.organizationsBulkUpdate,
		output: DnsfilterEndpointOutputSchemas.organizationsBulkUpdate,
	},
	'organizations.cancel': {
		input: DnsfilterEndpointInputSchemas.organizationsCancel,
		output: DnsfilterEndpointOutputSchemas.organizationsCancel,
	},
	'organizations.promoteToMsp': {
		input: DnsfilterEndpointInputSchemas.organizationsPromoteToMsp,
		output: DnsfilterEndpointOutputSchemas.organizationsPromoteToMsp,
	},
	'policiesBulkActions.addAllowlistDomains': {
		input: DnsfilterEndpointInputSchemas.policiesBulkActionsAddAllowlistDomains,
		output:
			DnsfilterEndpointOutputSchemas.policiesBulkActionsAddAllowlistDomains,
	},
	'policiesBulkActions.removeAllowlistDomains': {
		input:
			DnsfilterEndpointInputSchemas.policiesBulkActionsRemoveAllowlistDomains,
		output:
			DnsfilterEndpointOutputSchemas.policiesBulkActionsRemoveAllowlistDomains,
	},
	'policiesBulkActions.addBlocklistDomains': {
		input: DnsfilterEndpointInputSchemas.policiesBulkActionsAddBlocklistDomains,
		output:
			DnsfilterEndpointOutputSchemas.policiesBulkActionsAddBlocklistDomains,
	},
	'policiesBulkActions.removeBlocklistDomains': {
		input:
			DnsfilterEndpointInputSchemas.policiesBulkActionsRemoveBlocklistDomains,
		output:
			DnsfilterEndpointOutputSchemas.policiesBulkActionsRemoveBlocklistDomains,
	},
	'policies.list': {
		input: DnsfilterEndpointInputSchemas.policiesList,
		output: DnsfilterEndpointOutputSchemas.policiesList,
	},
	'policies.create': {
		input: DnsfilterEndpointInputSchemas.policiesCreate,
		output: DnsfilterEndpointOutputSchemas.policiesCreate,
	},
	'policies.listAll': {
		input: DnsfilterEndpointInputSchemas.policiesListAll,
		output: DnsfilterEndpointOutputSchemas.policiesListAll,
	},
	'policies.get': {
		input: DnsfilterEndpointInputSchemas.policiesGet,
		output: DnsfilterEndpointOutputSchemas.policiesGet,
	},
	'policies.update': {
		input: DnsfilterEndpointInputSchemas.policiesUpdate,
		output: DnsfilterEndpointOutputSchemas.policiesUpdate,
	},
	'policies.delete': {
		input: DnsfilterEndpointInputSchemas.policiesDelete,
		output: DnsfilterEndpointOutputSchemas.policiesDelete,
	},
	'policies.application': {
		input: DnsfilterEndpointInputSchemas.policiesApplication,
		output: DnsfilterEndpointOutputSchemas.policiesApplication,
	},
	'policies.applicationUpdate': {
		input: DnsfilterEndpointInputSchemas.policiesApplicationUpdate,
		output: DnsfilterEndpointOutputSchemas.policiesApplicationUpdate,
	},
	'policies.addBlacklistDomain': {
		input: DnsfilterEndpointInputSchemas.policiesAddBlacklistDomain,
		output: DnsfilterEndpointOutputSchemas.policiesAddBlacklistDomain,
	},
	'policies.removeBlacklistDomain': {
		input: DnsfilterEndpointInputSchemas.policiesRemoveBlacklistDomain,
		output: DnsfilterEndpointOutputSchemas.policiesRemoveBlacklistDomain,
	},
	'policies.addWhitelistDomain': {
		input: DnsfilterEndpointInputSchemas.policiesAddWhitelistDomain,
		output: DnsfilterEndpointOutputSchemas.policiesAddWhitelistDomain,
	},
	'policies.removeWhitelistDomain': {
		input: DnsfilterEndpointInputSchemas.policiesRemoveWhitelistDomain,
		output: DnsfilterEndpointOutputSchemas.policiesRemoveWhitelistDomain,
	},
	'policies.addBlacklistCategory': {
		input: DnsfilterEndpointInputSchemas.policiesAddBlacklistCategory,
		output: DnsfilterEndpointOutputSchemas.policiesAddBlacklistCategory,
	},
	'policies.removeBlacklistCategory': {
		input: DnsfilterEndpointInputSchemas.policiesRemoveBlacklistCategory,
		output: DnsfilterEndpointOutputSchemas.policiesRemoveBlacklistCategory,
	},
	'policies.addAllowedApplication': {
		input: DnsfilterEndpointInputSchemas.policiesAddAllowedApplication,
		output: DnsfilterEndpointOutputSchemas.policiesAddAllowedApplication,
	},
	'policies.removeAllowedApplication': {
		input: DnsfilterEndpointInputSchemas.policiesRemoveAllowedApplication,
		output: DnsfilterEndpointOutputSchemas.policiesRemoveAllowedApplication,
	},
	'policies.addBlockedApplication': {
		input: DnsfilterEndpointInputSchemas.policiesAddBlockedApplication,
		output: DnsfilterEndpointOutputSchemas.policiesAddBlockedApplication,
	},
	'policies.removeBlockedApplication': {
		input: DnsfilterEndpointInputSchemas.policiesRemoveBlockedApplication,
		output: DnsfilterEndpointOutputSchemas.policiesRemoveBlockedApplication,
	},
	'policies.getPermissiveMode': {
		input: DnsfilterEndpointInputSchemas.policiesGetPermissiveMode,
		output: DnsfilterEndpointOutputSchemas.policiesGetPermissiveMode,
	},
	'policies.updatePermissiveMode': {
		input: DnsfilterEndpointInputSchemas.policiesUpdatePermissiveMode,
		output: DnsfilterEndpointOutputSchemas.policiesUpdatePermissiveMode,
	},
	'policyIps.list': {
		input: DnsfilterEndpointInputSchemas.policyIpsList,
		output: DnsfilterEndpointOutputSchemas.policyIpsList,
	},
	'policyIps.get': {
		input: DnsfilterEndpointInputSchemas.policyIpsGet,
		output: DnsfilterEndpointOutputSchemas.policyIpsGet,
	},
	'psaIntegrations.redirectLink': {
		input: DnsfilterEndpointInputSchemas.psaIntegrationsRedirectLink,
		output: DnsfilterEndpointOutputSchemas.psaIntegrationsRedirectLink,
	},
	'scheduledPolicies.list': {
		input: DnsfilterEndpointInputSchemas.scheduledPoliciesList,
		output: DnsfilterEndpointOutputSchemas.scheduledPoliciesList,
	},
	'scheduledPolicies.create': {
		input: DnsfilterEndpointInputSchemas.scheduledPoliciesCreate,
		output: DnsfilterEndpointOutputSchemas.scheduledPoliciesCreate,
	},
	'scheduledPolicies.listAll': {
		input: DnsfilterEndpointInputSchemas.scheduledPoliciesListAll,
		output: DnsfilterEndpointOutputSchemas.scheduledPoliciesListAll,
	},
	'scheduledPolicies.get': {
		input: DnsfilterEndpointInputSchemas.scheduledPoliciesGet,
		output: DnsfilterEndpointOutputSchemas.scheduledPoliciesGet,
	},
	'scheduledPolicies.update': {
		input: DnsfilterEndpointInputSchemas.scheduledPoliciesUpdate,
		output: DnsfilterEndpointOutputSchemas.scheduledPoliciesUpdate,
	},
	'scheduledPolicies.delete': {
		input: DnsfilterEndpointInputSchemas.scheduledPoliciesDelete,
		output: DnsfilterEndpointOutputSchemas.scheduledPoliciesDelete,
	},
	'scheduledReportPreviews.get': {
		input: DnsfilterEndpointInputSchemas.scheduledReportPreviewsGet,
		output: DnsfilterEndpointOutputSchemas.scheduledReportPreviewsGet,
	},
	'scheduledReportPreviews.create': {
		input: DnsfilterEndpointInputSchemas.scheduledReportPreviewsCreate,
		output: DnsfilterEndpointOutputSchemas.scheduledReportPreviewsCreate,
	},
	'scheduledReports.list': {
		input: DnsfilterEndpointInputSchemas.scheduledReportsList,
		output: DnsfilterEndpointOutputSchemas.scheduledReportsList,
	},
	'scheduledReports.create': {
		input: DnsfilterEndpointInputSchemas.scheduledReportsCreate,
		output: DnsfilterEndpointOutputSchemas.scheduledReportsCreate,
	},
	'scheduledReports.get': {
		input: DnsfilterEndpointInputSchemas.scheduledReportsGet,
		output: DnsfilterEndpointOutputSchemas.scheduledReportsGet,
	},
	'scheduledReports.update': {
		input: DnsfilterEndpointInputSchemas.scheduledReportsUpdate,
		output: DnsfilterEndpointOutputSchemas.scheduledReportsUpdate,
	},
	'scheduledReports.delete': {
		input: DnsfilterEndpointInputSchemas.scheduledReportsDelete,
		output: DnsfilterEndpointOutputSchemas.scheduledReportsDelete,
	},
	'trafficReports.totalRequests': {
		input: DnsfilterEndpointInputSchemas.trafficReportsTotalRequests,
		output: DnsfilterEndpointOutputSchemas.trafficReportsTotalRequests,
	},
	'trafficReports.totalRequestsGeo': {
		input: DnsfilterEndpointInputSchemas.trafficReportsTotalRequestsGeo,
		output: DnsfilterEndpointOutputSchemas.trafficReportsTotalRequestsGeo,
	},
	'trafficReports.totalRequestsOrganizations': {
		input:
			DnsfilterEndpointInputSchemas.trafficReportsTotalRequestsOrganizations,
		output:
			DnsfilterEndpointOutputSchemas.trafficReportsTotalRequestsOrganizations,
	},
	'trafficReports.totalRequestsAgents': {
		input: DnsfilterEndpointInputSchemas.trafficReportsTotalRequestsAgents,
		output: DnsfilterEndpointOutputSchemas.trafficReportsTotalRequestsAgents,
	},
	'trafficReports.totalRequestsUsers': {
		input: DnsfilterEndpointInputSchemas.trafficReportsTotalRequestsUsers,
		output: DnsfilterEndpointOutputSchemas.trafficReportsTotalRequestsUsers,
	},
	'trafficReports.totalRequestsCollections': {
		input: DnsfilterEndpointInputSchemas.trafficReportsTotalRequestsCollections,
		output:
			DnsfilterEndpointOutputSchemas.trafficReportsTotalRequestsCollections,
	},
	'trafficReports.totalThreats': {
		input: DnsfilterEndpointInputSchemas.trafficReportsTotalThreats,
		output: DnsfilterEndpointOutputSchemas.trafficReportsTotalThreats,
	},
	'trafficReports.totalThreatsOrganizations': {
		input:
			DnsfilterEndpointInputSchemas.trafficReportsTotalThreatsOrganizations,
		output:
			DnsfilterEndpointOutputSchemas.trafficReportsTotalThreatsOrganizations,
	},
	'trafficReports.totalThreatsUsers': {
		input: DnsfilterEndpointInputSchemas.trafficReportsTotalThreatsUsers,
		output: DnsfilterEndpointOutputSchemas.trafficReportsTotalThreatsUsers,
	},
	'trafficReports.totalCategories': {
		input: DnsfilterEndpointInputSchemas.trafficReportsTotalCategories,
		output: DnsfilterEndpointOutputSchemas.trafficReportsTotalCategories,
	},
	'trafficReports.totalCategoriesOrganizations': {
		input:
			DnsfilterEndpointInputSchemas.trafficReportsTotalCategoriesOrganizations,
		output:
			DnsfilterEndpointOutputSchemas.trafficReportsTotalCategoriesOrganizations,
	},
	'trafficReports.totalDomains': {
		input: DnsfilterEndpointInputSchemas.trafficReportsTotalDomains,
		output: DnsfilterEndpointOutputSchemas.trafficReportsTotalDomains,
	},
	'trafficReports.totalDomainsOrganizations': {
		input:
			DnsfilterEndpointInputSchemas.trafficReportsTotalDomainsOrganizations,
		output:
			DnsfilterEndpointOutputSchemas.trafficReportsTotalDomainsOrganizations,
	},
	'trafficReports.totalDomainsUsers': {
		input: DnsfilterEndpointInputSchemas.trafficReportsTotalDomainsUsers,
		output: DnsfilterEndpointOutputSchemas.trafficReportsTotalDomainsUsers,
	},
	'trafficReports.qps': {
		input: DnsfilterEndpointInputSchemas.trafficReportsQps,
		output: DnsfilterEndpointOutputSchemas.trafficReportsQps,
	},
	'trafficReports.qpsActiveOrganizations': {
		input: DnsfilterEndpointInputSchemas.trafficReportsQpsActiveOrganizations,
		output: DnsfilterEndpointOutputSchemas.trafficReportsQpsActiveOrganizations,
	},
	'trafficReports.qpsActiveAgents': {
		input: DnsfilterEndpointInputSchemas.trafficReportsQpsActiveAgents,
		output: DnsfilterEndpointOutputSchemas.trafficReportsQpsActiveAgents,
	},
	'trafficReports.topDomains': {
		input: DnsfilterEndpointInputSchemas.trafficReportsTopDomains,
		output: DnsfilterEndpointOutputSchemas.trafficReportsTopDomains,
	},
	'trafficReports.topCategories': {
		input: DnsfilterEndpointInputSchemas.trafficReportsTopCategories,
		output: DnsfilterEndpointOutputSchemas.trafficReportsTopCategories,
	},
	'trafficReports.topApplicationCategories': {
		input: DnsfilterEndpointInputSchemas.trafficReportsTopApplicationCategories,
		output:
			DnsfilterEndpointOutputSchemas.trafficReportsTopApplicationCategories,
	},
	'trafficReports.topNetworks': {
		input: DnsfilterEndpointInputSchemas.trafficReportsTopNetworks,
		output: DnsfilterEndpointOutputSchemas.trafficReportsTopNetworks,
	},
	'trafficReports.topAgents': {
		input: DnsfilterEndpointInputSchemas.trafficReportsTopAgents,
		output: DnsfilterEndpointOutputSchemas.trafficReportsTopAgents,
	},
	'trafficReports.topUsers': {
		input: DnsfilterEndpointInputSchemas.trafficReportsTopUsers,
		output: DnsfilterEndpointOutputSchemas.trafficReportsTopUsers,
	},
	'trafficReports.topCollections': {
		input: DnsfilterEndpointInputSchemas.trafficReportsTopCollections,
		output: DnsfilterEndpointOutputSchemas.trafficReportsTopCollections,
	},
	'trafficReports.queryLogs': {
		input: DnsfilterEndpointInputSchemas.trafficReportsQueryLogs,
		output: DnsfilterEndpointOutputSchemas.trafficReportsQueryLogs,
	},
	'trafficReports.totalOrganizationsStats': {
		input: DnsfilterEndpointInputSchemas.trafficReportsTotalOrganizationsStats,
		output:
			DnsfilterEndpointOutputSchemas.trafficReportsTotalOrganizationsStats,
	},
	'trafficReports.totalDomainStats': {
		input: DnsfilterEndpointInputSchemas.trafficReportsTotalDomainStats,
		output: DnsfilterEndpointOutputSchemas.trafficReportsTotalDomainStats,
	},
	'trafficReports.totalCategoryStats': {
		input: DnsfilterEndpointInputSchemas.trafficReportsTotalCategoryStats,
		output: DnsfilterEndpointOutputSchemas.trafficReportsTotalCategoryStats,
	},
	'trafficReports.totalOrganizationsRequests': {
		input:
			DnsfilterEndpointInputSchemas.trafficReportsTotalOrganizationsRequests,
		output:
			DnsfilterEndpointOutputSchemas.trafficReportsTotalOrganizationsRequests,
	},
	'trafficReports.topOrganizationsRequests': {
		input: DnsfilterEndpointInputSchemas.trafficReportsTopOrganizationsRequests,
		output:
			DnsfilterEndpointOutputSchemas.trafficReportsTopOrganizationsRequests,
	},
	'trafficReports.totalClientStats': {
		input: DnsfilterEndpointInputSchemas.trafficReportsTotalClientStats,
		output: DnsfilterEndpointOutputSchemas.trafficReportsTotalClientStats,
	},
	'trafficReports.totalDeployments': {
		input: DnsfilterEndpointInputSchemas.trafficReportsTotalDeployments,
		output: DnsfilterEndpointOutputSchemas.trafficReportsTotalDeployments,
	},
	'trafficReports.totalRoamingClients': {
		input: DnsfilterEndpointInputSchemas.trafficReportsTotalRoamingClients,
		output: DnsfilterEndpointOutputSchemas.trafficReportsTotalRoamingClients,
	},
	'trafficReports.totalApplicationsStats': {
		input: DnsfilterEndpointInputSchemas.trafficReportsTotalApplicationsStats,
		output: DnsfilterEndpointOutputSchemas.trafficReportsTotalApplicationsStats,
	},
	'trafficReports.totalApplicationsNetworksStats': {
		input:
			DnsfilterEndpointInputSchemas.trafficReportsTotalApplicationsNetworksStats,
		output:
			DnsfilterEndpointOutputSchemas.trafficReportsTotalApplicationsNetworksStats,
	},
	'trafficReports.totalApplicationsAgentsStats': {
		input:
			DnsfilterEndpointInputSchemas.trafficReportsTotalApplicationsAgentsStats,
		output:
			DnsfilterEndpointOutputSchemas.trafficReportsTotalApplicationsAgentsStats,
	},
	'trafficReports.totalApplicationsUsersStats': {
		input:
			DnsfilterEndpointInputSchemas.trafficReportsTotalApplicationsUsersStats,
		output:
			DnsfilterEndpointOutputSchemas.trafficReportsTotalApplicationsUsersStats,
	},
	'trafficReports.totalApplicationsCollectionsStats': {
		input:
			DnsfilterEndpointInputSchemas.trafficReportsTotalApplicationsCollectionsStats,
		output:
			DnsfilterEndpointOutputSchemas.trafficReportsTotalApplicationsCollectionsStats,
	},
	'trials.create': {
		input: DnsfilterEndpointInputSchemas.trialsCreate,
		output: DnsfilterEndpointOutputSchemas.trialsCreate,
	},
	'userAgentBulkDeletes.create': {
		input: DnsfilterEndpointInputSchemas.userAgentBulkDeletesCreate,
		output: DnsfilterEndpointOutputSchemas.userAgentBulkDeletesCreate,
	},
	'userAgentBulkDeletes.get': {
		input: DnsfilterEndpointInputSchemas.userAgentBulkDeletesGet,
		output: DnsfilterEndpointOutputSchemas.userAgentBulkDeletesGet,
	},
	'userAgentBulkDeletes.counts': {
		input: DnsfilterEndpointInputSchemas.userAgentBulkDeletesCounts,
		output: DnsfilterEndpointOutputSchemas.userAgentBulkDeletesCounts,
	},
	'userAgentBulkUpdates.create': {
		input: DnsfilterEndpointInputSchemas.userAgentBulkUpdatesCreate,
		output: DnsfilterEndpointOutputSchemas.userAgentBulkUpdatesCreate,
	},
	'userAgentBulkUpdates.get': {
		input: DnsfilterEndpointInputSchemas.userAgentBulkUpdatesGet,
		output: DnsfilterEndpointOutputSchemas.userAgentBulkUpdatesGet,
	},
	'userAgentBulkUpdates.hasMixed': {
		input: DnsfilterEndpointInputSchemas.userAgentBulkUpdatesHasMixed,
		output: DnsfilterEndpointOutputSchemas.userAgentBulkUpdatesHasMixed,
	},
	'userAgentBulkUpdates.counts': {
		input: DnsfilterEndpointInputSchemas.userAgentBulkUpdatesCounts,
		output: DnsfilterEndpointOutputSchemas.userAgentBulkUpdatesCounts,
	},
	'userAgentCleanups.create': {
		input: DnsfilterEndpointInputSchemas.userAgentCleanupsCreate,
		output: DnsfilterEndpointOutputSchemas.userAgentCleanupsCreate,
	},
	'userAgentCleanups.get': {
		input: DnsfilterEndpointInputSchemas.userAgentCleanupsGet,
		output: DnsfilterEndpointOutputSchemas.userAgentCleanupsGet,
	},
	'userAgentCleanups.update': {
		input: DnsfilterEndpointInputSchemas.userAgentCleanupsUpdate,
		output: DnsfilterEndpointOutputSchemas.userAgentCleanupsUpdate,
	},
	'userAgentReleases.list': {
		input: DnsfilterEndpointInputSchemas.userAgentReleasesList,
		output: DnsfilterEndpointOutputSchemas.userAgentReleasesList,
	},
	'userAgentReleases.relay': {
		input: DnsfilterEndpointInputSchemas.userAgentReleasesRelay,
		output: DnsfilterEndpointOutputSchemas.userAgentReleasesRelay,
	},
	'userAgents.list': {
		input: DnsfilterEndpointInputSchemas.userAgentsList,
		output: DnsfilterEndpointOutputSchemas.userAgentsList,
	},
	'userAgents.listAll': {
		input: DnsfilterEndpointInputSchemas.userAgentsListAll,
		output: DnsfilterEndpointOutputSchemas.userAgentsListAll,
	},
	'userAgents.counts': {
		input: DnsfilterEndpointInputSchemas.userAgentsCounts,
		output: DnsfilterEndpointOutputSchemas.userAgentsCounts,
	},
	'userAgents.get': {
		input: DnsfilterEndpointInputSchemas.userAgentsGet,
		output: DnsfilterEndpointOutputSchemas.userAgentsGet,
	},
	'userAgents.update': {
		input: DnsfilterEndpointInputSchemas.userAgentsUpdate,
		output: DnsfilterEndpointOutputSchemas.userAgentsUpdate,
	},
	'userAgents.delete': {
		input: DnsfilterEndpointInputSchemas.userAgentsDelete,
		output: DnsfilterEndpointOutputSchemas.userAgentsDelete,
	},
	'userAgents.tags': {
		input: DnsfilterEndpointInputSchemas.userAgentsTags,
		output: DnsfilterEndpointOutputSchemas.userAgentsTags,
	},
	'userAgents.dequeueUninstall': {
		input: DnsfilterEndpointInputSchemas.userAgentsDequeueUninstall,
		output: DnsfilterEndpointOutputSchemas.userAgentsDequeueUninstall,
	},
	'userAgents.csv': {
		input: DnsfilterEndpointInputSchemas.userAgentsCsv,
		output: DnsfilterEndpointOutputSchemas.userAgentsCsv,
	},
	'userAgents.uninstallPin': {
		input: DnsfilterEndpointInputSchemas.userAgentsUninstallPin,
		output: DnsfilterEndpointOutputSchemas.userAgentsUninstallPin,
	},
	'users.list': {
		input: DnsfilterEndpointInputSchemas.usersList,
		output: DnsfilterEndpointOutputSchemas.usersList,
	},
	'users.listAll': {
		input: DnsfilterEndpointInputSchemas.usersListAll,
		output: DnsfilterEndpointOutputSchemas.usersListAll,
	},
	'users.get': {
		input: DnsfilterEndpointInputSchemas.usersGet,
		output: DnsfilterEndpointOutputSchemas.usersGet,
	},
	'users.changePassword': {
		input: DnsfilterEndpointInputSchemas.usersChangePassword,
		output: DnsfilterEndpointOutputSchemas.usersChangePassword,
	},
	'agentLocalUsersV2.counts': {
		input: DnsfilterEndpointInputSchemas.agentLocalUsersV2Counts,
		output: DnsfilterEndpointOutputSchemas.agentLocalUsersV2Counts,
	},
	'currentUserOrgUiSettings.suppressLicenseWarning': {
		input:
			DnsfilterEndpointInputSchemas.currentUserOrgUiSettingsSuppressLicenseWarning,
		output:
			DnsfilterEndpointOutputSchemas.currentUserOrgUiSettingsSuppressLicenseWarning,
	},
	'currentUserUiSettings.get': {
		input: DnsfilterEndpointInputSchemas.currentUserUiSettingsGet,
		output: DnsfilterEndpointOutputSchemas.currentUserUiSettingsGet,
	},
	'currentUserUiSettings.update': {
		input: DnsfilterEndpointInputSchemas.currentUserUiSettingsUpdate,
		output: DnsfilterEndpointOutputSchemas.currentUserUiSettingsUpdate,
	},
	'dashboards.list': {
		input: DnsfilterEndpointInputSchemas.dashboardsList,
		output: DnsfilterEndpointOutputSchemas.dashboardsList,
	},
	'dashboards.create': {
		input: DnsfilterEndpointInputSchemas.dashboardsCreate,
		output: DnsfilterEndpointOutputSchemas.dashboardsCreate,
	},
	'dashboards.available': {
		input: DnsfilterEndpointInputSchemas.dashboardsAvailable,
		output: DnsfilterEndpointOutputSchemas.dashboardsAvailable,
	},
	'dashboards.owned': {
		input: DnsfilterEndpointInputSchemas.dashboardsOwned,
		output: DnsfilterEndpointOutputSchemas.dashboardsOwned,
	},
	'dashboards.update': {
		input: DnsfilterEndpointInputSchemas.dashboardsUpdate,
		output: DnsfilterEndpointOutputSchemas.dashboardsUpdate,
	},
	'dashboards.delete': {
		input: DnsfilterEndpointInputSchemas.dashboardsDelete,
		output: DnsfilterEndpointOutputSchemas.dashboardsDelete,
	},
	'dashboards.makePublic': {
		input: DnsfilterEndpointInputSchemas.dashboardsMakePublic,
		output: DnsfilterEndpointOutputSchemas.dashboardsMakePublic,
	},
	'dashboards.makePrivate': {
		input: DnsfilterEndpointInputSchemas.dashboardsMakePrivate,
		output: DnsfilterEndpointOutputSchemas.dashboardsMakePrivate,
	},
	'dashboards.link': {
		input: DnsfilterEndpointInputSchemas.dashboardsLink,
		output: DnsfilterEndpointOutputSchemas.dashboardsLink,
	},
	'dashboards.unlink': {
		input: DnsfilterEndpointInputSchemas.dashboardsUnlink,
		output: DnsfilterEndpointOutputSchemas.dashboardsUnlink,
	},
	'dictionaryV2.aiApplications': {
		input: DnsfilterEndpointInputSchemas.dictionaryV2AiApplications,
		output: DnsfilterEndpointOutputSchemas.dictionaryV2AiApplications,
	},
	'dictionaryV2.cyberSightActivityTypes': {
		input: DnsfilterEndpointInputSchemas.dictionaryV2CyberSightActivityTypes,
		output: DnsfilterEndpointOutputSchemas.dictionaryV2CyberSightActivityTypes,
	},
	'dictionaryV2.vpnSettingsStateTypes': {
		input: DnsfilterEndpointInputSchemas.dictionaryV2VpnSettingsStateTypes,
		output: DnsfilterEndpointOutputSchemas.dictionaryV2VpnSettingsStateTypes,
	},
	'scheduledReportsV2.list': {
		input: DnsfilterEndpointInputSchemas.scheduledReportsV2List,
		output: DnsfilterEndpointOutputSchemas.scheduledReportsV2List,
	},
	'scheduledReportsV2.create': {
		input: DnsfilterEndpointInputSchemas.scheduledReportsV2Create,
		output: DnsfilterEndpointOutputSchemas.scheduledReportsV2Create,
	},
	'scheduledReportsV2.get': {
		input: DnsfilterEndpointInputSchemas.scheduledReportsV2Get,
		output: DnsfilterEndpointOutputSchemas.scheduledReportsV2Get,
	},
	'scheduledReportsV2.update': {
		input: DnsfilterEndpointInputSchemas.scheduledReportsV2Update,
		output: DnsfilterEndpointOutputSchemas.scheduledReportsV2Update,
	},
	'scheduledReportsV2.delete': {
		input: DnsfilterEndpointInputSchemas.scheduledReportsV2Delete,
		output: DnsfilterEndpointOutputSchemas.scheduledReportsV2Delete,
	},
	'scheduledReportsV2.bulkUpdate': {
		input: DnsfilterEndpointInputSchemas.scheduledReportsV2BulkUpdate,
		output: DnsfilterEndpointOutputSchemas.scheduledReportsV2BulkUpdate,
	},
	'unblockRequests.list': {
		input: DnsfilterEndpointInputSchemas.unblockRequestsList,
		output: DnsfilterEndpointOutputSchemas.unblockRequestsList,
	},
	'unblockRequests.counts': {
		input: DnsfilterEndpointInputSchemas.unblockRequestsCounts,
		output: DnsfilterEndpointOutputSchemas.unblockRequestsCounts,
	},
	'unblockRequests.pendingCount': {
		input: DnsfilterEndpointInputSchemas.unblockRequestsPendingCount,
		output: DnsfilterEndpointOutputSchemas.unblockRequestsPendingCount,
	},
	'unblockRequests.get': {
		input: DnsfilterEndpointInputSchemas.unblockRequestsGet,
		output: DnsfilterEndpointOutputSchemas.unblockRequestsGet,
	},
	'unblockRequests.decision': {
		input: DnsfilterEndpointInputSchemas.unblockRequestsDecision,
		output: DnsfilterEndpointOutputSchemas.unblockRequestsDecision,
	},
	'userAgentsV2.updateSettings': {
		input: DnsfilterEndpointInputSchemas.userAgentsV2UpdateSettings,
		output: DnsfilterEndpointOutputSchemas.userAgentsV2UpdateSettings,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof dnsfilterEndpointsNested
>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const dnsfilterEndpointMeta = {
	'agentLocalUserBulkDeletes.create': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Bulk delete agent local user',
	},
	'agentLocalUserBulkDeletes.get': {
		riskLevel: 'read',
		description: 'Get an agent local user bulk delete',
	},
	'agentLocalUserBulkDeletes.counts': {
		riskLevel: 'read',
		description: 'Counts for agent local user bulk deletes',
	},
	'agentLocalUsers.list': {
		riskLevel: 'read',
		description: 'List agent local users',
	},
	'agentLocalUsers.listAll': {
		riskLevel: 'read',
		description: 'List all agent local users',
	},
	'agentLocalUsers.get': {
		riskLevel: 'read',
		description: 'Get an agent local user',
	},
	'agentLocalUsers.update': {
		riskLevel: 'write',
		description: 'Update an agent local user',
	},
	'agentLocalUsers.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete an agent local user',
	},
	'apiKeys.create': {
		riskLevel: 'write',
		description: 'Create an API key',
	},
	'apiKeys.list': {
		riskLevel: 'read',
		description: 'List API keys',
	},
	'apiKeys.get': {
		riskLevel: 'read',
		description: 'Get an API key',
	},
	'apiKeys.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete an API key',
	},
	'apiKeys.revoke': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Revoke for API keys',
	},
	'applicationCategories.list': {
		riskLevel: 'read',
		description: 'List application categories',
	},
	'applicationCategories.get': {
		riskLevel: 'read',
		description: 'Get an application category',
	},
	'applications.list': {
		riskLevel: 'read',
		description: 'List applications',
	},
	'applications.listAll': {
		riskLevel: 'read',
		description: 'List all applications',
	},
	'applications.get': {
		riskLevel: 'read',
		description: 'Get an application',
	},
	'billings.get': {
		riskLevel: 'read',
		description: 'Get a billing',
	},
	'billings.create': {
		riskLevel: 'write',
		description: 'Create a billing',
	},
	'billings.addressShow': {
		riskLevel: 'read',
		description: 'Address show for billings',
	},
	'billings.addressUpdate': {
		riskLevel: 'write',
		description: 'Address update for billings',
	},
	'blockPages.list': {
		riskLevel: 'read',
		description: 'List block pages',
	},
	'blockPages.create': {
		riskLevel: 'write',
		description: 'Create a block page',
	},
	'blockPages.listAll': {
		riskLevel: 'read',
		description: 'List all block pages',
	},
	'blockPages.get': {
		riskLevel: 'read',
		description: 'Get a block page',
	},
	'blockPages.update': {
		riskLevel: 'write',
		description: 'Update a block page',
	},
	'blockPages.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a block page',
	},
	'categories.list': {
		riskLevel: 'read',
		description: 'List categories',
	},
	'categories.listAll': {
		riskLevel: 'read',
		description: 'List all categories',
	},
	'categories.get': {
		riskLevel: 'read',
		description: 'Get a category',
	},
	'collectionUsers.list': {
		riskLevel: 'read',
		description: 'List collection users',
	},
	'collectionUsers.create': {
		riskLevel: 'write',
		description: 'Create a collection user',
	},
	'collectionUsers.get': {
		riskLevel: 'read',
		description: 'Get a collection user',
	},
	'collectionUsers.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a collection user',
	},
	'currentUsers.get': {
		riskLevel: 'read',
		description: 'Get a current user',
	},
	'currentUsers.update': {
		riskLevel: 'write',
		description: 'Update a current user',
	},
	'dictionary.qpMethods': {
		riskLevel: 'read',
		description: 'Qp methods for dictionary',
	},
	'domainNotes.get': {
		riskLevel: 'read',
		description: 'Get a domain note',
	},
	'domainNotes.update': {
		riskLevel: 'write',
		description: 'Update a domain note',
	},
	'domainNotes.batchUpdate': {
		riskLevel: 'write',
		description: 'Batch update for domain notes',
	},
	'domainNotes.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a domain note',
	},
	'domainNotes.batchDestroy': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Batch destroy for domain notes',
	},
	'domains.userLookup': {
		riskLevel: 'read',
		description: 'User lookup for domains',
	},
	'domains.bulkLookup': {
		riskLevel: 'read',
		description: 'Bulk lookup for domains',
	},
	'domains.suggestThreat': {
		riskLevel: 'write',
		description: 'Suggest threat for domains',
	},
	'enterpriseConnections.list': {
		riskLevel: 'read',
		description: 'List enterprise connections',
	},
	'enterpriseConnections.create': {
		riskLevel: 'write',
		description: 'Create an enterprise connection',
	},
	'enterpriseConnections.get': {
		riskLevel: 'read',
		description: 'Get an enterprise connection',
	},
	'enterpriseConnections.update': {
		riskLevel: 'write',
		description: 'Update an enterprise connection',
	},
	'enterpriseConnections.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete an enterprise connection',
	},
	'invoices.current': {
		riskLevel: 'read',
		description: 'Current for invoices',
	},
	'invoices.list': {
		riskLevel: 'read',
		description: 'List invoices',
	},
	'invoices.get': {
		riskLevel: 'read',
		description: 'Get an invoice',
	},
	'ipAddresses.list': {
		riskLevel: 'read',
		description: 'List IP addresses',
	},
	'ipAddresses.create': {
		riskLevel: 'write',
		description: 'Create an IP address',
	},
	'ipAddresses.listAll': {
		riskLevel: 'read',
		description: 'List all IP addresses',
	},
	'ipAddresses.get': {
		riskLevel: 'read',
		description: 'Get an IP address',
	},
	'ipAddresses.update': {
		riskLevel: 'write',
		description: 'Update an IP address',
	},
	'ipAddresses.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete an IP address',
	},
	'ipAddresses.verify': {
		riskLevel: 'read',
		description: 'Verify for IP addresses',
	},
	'ipAddresses.myip': {
		riskLevel: 'read',
		description: 'Myip for IP addresses',
	},
	'macAddresses.list': {
		riskLevel: 'read',
		description: 'List MAC addresses',
	},
	'macAddresses.create': {
		riskLevel: 'write',
		description: 'Create a MAC address',
	},
	'macAddresses.listAll': {
		riskLevel: 'read',
		description: 'List all MAC addresses',
	},
	'macAddresses.get': {
		riskLevel: 'read',
		description: 'Get a MAC address',
	},
	'macAddresses.update': {
		riskLevel: 'write',
		description: 'Update a MAC address',
	},
	'macAddresses.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a MAC address',
	},
	'metrics.organizationUsage': {
		riskLevel: 'read',
		description: 'Organization usage for metrics',
	},
	'metrics.organizationUsageDetailed': {
		riskLevel: 'read',
		description: 'Organization usage detailed for metrics',
	},
	'networkLanIps.list': {
		riskLevel: 'read',
		description: 'List network LAN IPS',
	},
	'networkLanIps.get': {
		riskLevel: 'read',
		description: 'Get a network LAN IPS',
	},
	'networkLanIps.update': {
		riskLevel: 'write',
		description: 'Update a network LAN IPS',
	},
	'networkSubnets.listAll': {
		riskLevel: 'read',
		description: 'List all network subnets',
	},
	'networkSubnets.list': {
		riskLevel: 'read',
		description: 'List network subnets',
	},
	'networkSubnets.create': {
		riskLevel: 'write',
		description: 'Create a network subnet',
	},
	'networkSubnets.get': {
		riskLevel: 'read',
		description: 'Get a network subnet',
	},
	'networkSubnets.update': {
		riskLevel: 'write',
		description: 'Update a network subnet',
	},
	'networkSubnets.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a network subnet',
	},
	'networks.list': {
		riskLevel: 'read',
		description: 'List networks',
	},
	'networks.create': {
		riskLevel: 'write',
		description: 'Create a network',
	},
	'networks.listAll': {
		riskLevel: 'read',
		description: 'List all networks',
	},
	'networks.counts': {
		riskLevel: 'read',
		description: 'Counts for networks',
	},
	'networks.msp': {
		riskLevel: 'read',
		description: 'List MSP networks',
	},
	'networks.mspAll': {
		riskLevel: 'read',
		description: 'List all MSP networks',
	},
	'networks.geo': {
		riskLevel: 'read',
		description: 'Geo for networks',
	},
	'networks.lookup': {
		riskLevel: 'read',
		description: 'Lookup for networks',
	},
	'networks.get': {
		riskLevel: 'read',
		description: 'Get a network',
	},
	'networks.update': {
		riskLevel: 'write',
		description: 'Update a network',
	},
	'networks.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a network',
	},
	'networks.bulkCreate': {
		riskLevel: 'write',
		description: 'Bulk create for networks',
	},
	'networks.bulkCreateStatus': {
		riskLevel: 'read',
		description: 'Bulk create status for networks',
	},
	'networks.bulkUpdate': {
		riskLevel: 'write',
		description: 'Bulk update for networks',
	},
	'networks.bulkUpdateStatus': {
		riskLevel: 'read',
		description: 'Bulk update status for networks',
	},
	'networks.bulkDestroy': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Bulk destroy for networks',
	},
	'networks.bulkDestroyStatus': {
		riskLevel: 'read',
		description: 'Bulk destroy status for networks',
	},
	'networks.generateSecretKey': {
		riskLevel: 'write',
		description: 'Generate secret key for networks',
	},
	'networks.revokeSecretKey': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Revoke secret key for networks',
	},
	'networks.rotateSecretKey': {
		riskLevel: 'write',
		description: 'Rotate secret key for networks',
	},
	'organizationUsers.list': {
		riskLevel: 'read',
		description: 'List organization users',
	},
	'organizationUsers.create': {
		riskLevel: 'write',
		description: 'Create an organization user',
	},
	'organizationUsers.get': {
		riskLevel: 'read',
		description: 'Get an organization user',
	},
	'organizationUsers.update': {
		riskLevel: 'write',
		description: 'Update an organization user',
	},
	'organizationUsers.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete an organization user',
	},
	'organizationUsers.resendInvite': {
		riskLevel: 'write',
		description: 'Resend invite for organization users',
	},
	'organizations.list': {
		riskLevel: 'read',
		description: 'List organizations',
	},
	'organizations.create': {
		riskLevel: 'write',
		description: 'Create an organization',
	},
	'organizations.listAll': {
		riskLevel: 'read',
		description: 'List all organizations',
	},
	'organizations.get': {
		riskLevel: 'read',
		description: 'Get an organization',
	},
	'organizations.update': {
		riskLevel: 'write',
		description: 'Update an organization',
	},
	'organizations.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete an organization',
	},
	'organizations.settings': {
		riskLevel: 'read',
		description: 'Settings for organizations',
	},
	'organizations.bulkUpdate': {
		riskLevel: 'write',
		description: 'Bulk update for organizations',
	},
	'organizations.cancel': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Cancel for organizations',
	},
	'organizations.promoteToMsp': {
		riskLevel: 'write',
		description: 'Promote to MSP for organizations',
	},
	'policiesBulkActions.addAllowlistDomains': {
		riskLevel: 'write',
		description: 'Add allowlist domains for policies bulk actions',
	},
	'policiesBulkActions.removeAllowlistDomains': {
		riskLevel: 'write',
		description: 'Remove allowlist domains for policies bulk actions',
	},
	'policiesBulkActions.addBlocklistDomains': {
		riskLevel: 'write',
		description: 'Add blocklist domains for policies bulk actions',
	},
	'policiesBulkActions.removeBlocklistDomains': {
		riskLevel: 'write',
		description: 'Remove blocklist domains for policies bulk actions',
	},
	'policies.list': {
		riskLevel: 'read',
		description: 'List policies',
	},
	'policies.create': {
		riskLevel: 'write',
		description: 'Create a policy',
	},
	'policies.listAll': {
		riskLevel: 'read',
		description: 'List all policies',
	},
	'policies.get': {
		riskLevel: 'read',
		description: 'Get a policy',
	},
	'policies.update': {
		riskLevel: 'write',
		description: 'Update a policy',
	},
	'policies.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a policy',
	},
	'policies.application': {
		riskLevel: 'read',
		description: 'Application for policies',
	},
	'policies.applicationUpdate': {
		riskLevel: 'write',
		description: 'Application update for policies',
	},
	'policies.addBlacklistDomain': {
		riskLevel: 'write',
		description: 'Add blacklist domain for policies',
	},
	'policies.removeBlacklistDomain': {
		riskLevel: 'write',
		description: 'Remove blacklist domain for policies',
	},
	'policies.addWhitelistDomain': {
		riskLevel: 'write',
		description: 'Add whitelist domain for policies',
	},
	'policies.removeWhitelistDomain': {
		riskLevel: 'write',
		description: 'Remove whitelist domain for policies',
	},
	'policies.addBlacklistCategory': {
		riskLevel: 'write',
		description: 'Add blacklist category for policies',
	},
	'policies.removeBlacklistCategory': {
		riskLevel: 'write',
		description: 'Remove blacklist category for policies',
	},
	'policies.addAllowedApplication': {
		riskLevel: 'write',
		description: 'Add allowed application for policies',
	},
	'policies.removeAllowedApplication': {
		riskLevel: 'write',
		description: 'Remove allowed application for policies',
	},
	'policies.addBlockedApplication': {
		riskLevel: 'write',
		description: 'Add blocked application for policies',
	},
	'policies.removeBlockedApplication': {
		riskLevel: 'write',
		description: 'Remove blocked application for policies',
	},
	'policies.getPermissiveMode': {
		riskLevel: 'read',
		description: 'Get permissive mode for policies',
	},
	'policies.updatePermissiveMode': {
		riskLevel: 'write',
		description: 'Update permissive mode for policies',
	},
	'policyIps.list': {
		riskLevel: 'read',
		description: 'List policy IPS',
	},
	'policyIps.get': {
		riskLevel: 'read',
		description: 'Get a policy IPS',
	},
	'psaIntegrations.redirectLink': {
		riskLevel: 'read',
		description: 'Redirect link for PSA integrations',
	},
	'scheduledPolicies.list': {
		riskLevel: 'read',
		description: 'List scheduled policies',
	},
	'scheduledPolicies.create': {
		riskLevel: 'write',
		description: 'Create a scheduled policy',
	},
	'scheduledPolicies.listAll': {
		riskLevel: 'read',
		description: 'List all scheduled policies',
	},
	'scheduledPolicies.get': {
		riskLevel: 'read',
		description: 'Get a scheduled policy',
	},
	'scheduledPolicies.update': {
		riskLevel: 'write',
		description: 'Update a scheduled policy',
	},
	'scheduledPolicies.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a scheduled policy',
	},
	'scheduledReportPreviews.get': {
		riskLevel: 'read',
		description: 'Get a scheduled report preview',
	},
	'scheduledReportPreviews.create': {
		riskLevel: 'write',
		description: 'Create a scheduled report preview',
	},
	'scheduledReports.list': {
		riskLevel: 'read',
		description: 'List scheduled reports',
	},
	'scheduledReports.create': {
		riskLevel: 'write',
		description: 'Create a scheduled report',
	},
	'scheduledReports.get': {
		riskLevel: 'read',
		description: 'Get a scheduled report',
	},
	'scheduledReports.update': {
		riskLevel: 'write',
		description: 'Update a scheduled report',
	},
	'scheduledReports.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a scheduled report',
	},
	'trafficReports.totalRequests': {
		riskLevel: 'read',
		description: 'Total requests for traffic reports',
	},
	'trafficReports.totalRequestsGeo': {
		riskLevel: 'read',
		description: 'Total requests geo for traffic reports',
	},
	'trafficReports.totalRequestsOrganizations': {
		riskLevel: 'read',
		description: 'Total requests organizations for traffic reports',
	},
	'trafficReports.totalRequestsAgents': {
		riskLevel: 'read',
		description: 'Total requests agents for traffic reports',
	},
	'trafficReports.totalRequestsUsers': {
		riskLevel: 'read',
		description: 'Total requests users for traffic reports',
	},
	'trafficReports.totalRequestsCollections': {
		riskLevel: 'read',
		description: 'Total requests collections for traffic reports',
	},
	'trafficReports.totalThreats': {
		riskLevel: 'read',
		description: 'Total threats for traffic reports',
	},
	'trafficReports.totalThreatsOrganizations': {
		riskLevel: 'read',
		description: 'Total threats organizations for traffic reports',
	},
	'trafficReports.totalThreatsUsers': {
		riskLevel: 'read',
		description: 'Total threats users for traffic reports',
	},
	'trafficReports.totalCategories': {
		riskLevel: 'read',
		description: 'Total categories for traffic reports',
	},
	'trafficReports.totalCategoriesOrganizations': {
		riskLevel: 'read',
		description: 'Total categories organizations for traffic reports',
	},
	'trafficReports.totalDomains': {
		riskLevel: 'read',
		description: 'Total domains for traffic reports',
	},
	'trafficReports.totalDomainsOrganizations': {
		riskLevel: 'read',
		description: 'Total domains organizations for traffic reports',
	},
	'trafficReports.totalDomainsUsers': {
		riskLevel: 'read',
		description: 'Total domains users for traffic reports',
	},
	'trafficReports.qps': {
		riskLevel: 'read',
		description: 'QPS for traffic reports',
	},
	'trafficReports.qpsActiveOrganizations': {
		riskLevel: 'read',
		description: 'QPS active organizations for traffic reports',
	},
	'trafficReports.qpsActiveAgents': {
		riskLevel: 'read',
		description: 'QPS active agents for traffic reports',
	},
	'trafficReports.topDomains': {
		riskLevel: 'read',
		description: 'Top domains for traffic reports',
	},
	'trafficReports.topCategories': {
		riskLevel: 'read',
		description: 'Top categories for traffic reports',
	},
	'trafficReports.topApplicationCategories': {
		riskLevel: 'read',
		description: 'Top application categories for traffic reports',
	},
	'trafficReports.topNetworks': {
		riskLevel: 'read',
		description: 'Top networks for traffic reports',
	},
	'trafficReports.topAgents': {
		riskLevel: 'read',
		description: 'Top agents for traffic reports',
	},
	'trafficReports.topUsers': {
		riskLevel: 'read',
		description: 'Top users for traffic reports',
	},
	'trafficReports.topCollections': {
		riskLevel: 'read',
		description: 'Top collections for traffic reports',
	},
	'trafficReports.queryLogs': {
		riskLevel: 'read',
		description: 'Query logs for traffic reports',
	},
	'trafficReports.totalOrganizationsStats': {
		riskLevel: 'read',
		description: 'Total organizations stats for traffic reports',
	},
	'trafficReports.totalDomainStats': {
		riskLevel: 'read',
		description: 'Total domain stats for traffic reports',
	},
	'trafficReports.totalCategoryStats': {
		riskLevel: 'read',
		description: 'Total category stats for traffic reports',
	},
	'trafficReports.totalOrganizationsRequests': {
		riskLevel: 'read',
		description: 'Total organizations requests for traffic reports',
	},
	'trafficReports.topOrganizationsRequests': {
		riskLevel: 'read',
		description: 'Top organizations requests for traffic reports',
	},
	'trafficReports.totalClientStats': {
		riskLevel: 'read',
		description: 'Total client stats for traffic reports',
	},
	'trafficReports.totalDeployments': {
		riskLevel: 'read',
		description: 'Total deployments for traffic reports',
	},
	'trafficReports.totalRoamingClients': {
		riskLevel: 'read',
		description: 'Total roaming clients for traffic reports',
	},
	'trafficReports.totalApplicationsStats': {
		riskLevel: 'read',
		description: 'Total applications stats for traffic reports',
	},
	'trafficReports.totalApplicationsNetworksStats': {
		riskLevel: 'read',
		description: 'Total applications networks stats for traffic reports',
	},
	'trafficReports.totalApplicationsAgentsStats': {
		riskLevel: 'read',
		description: 'Total applications agents stats for traffic reports',
	},
	'trafficReports.totalApplicationsUsersStats': {
		riskLevel: 'read',
		description: 'Total applications users stats for traffic reports',
	},
	'trafficReports.totalApplicationsCollectionsStats': {
		riskLevel: 'read',
		description: 'Total applications collections stats for traffic reports',
	},
	'trials.create': {
		riskLevel: 'write',
		description: 'Create a trial',
	},
	'userAgentBulkDeletes.create': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Bulk delete user agent',
	},
	'userAgentBulkDeletes.get': {
		riskLevel: 'read',
		description: 'Get an user agent bulk delete',
	},
	'userAgentBulkDeletes.counts': {
		riskLevel: 'read',
		description: 'Counts for user agent bulk deletes',
	},
	'userAgentBulkUpdates.create': {
		riskLevel: 'write',
		description: 'Bulk update user agent',
	},
	'userAgentBulkUpdates.get': {
		riskLevel: 'read',
		description: 'Get an user agent bulk update',
	},
	'userAgentBulkUpdates.hasMixed': {
		riskLevel: 'write',
		description: 'Has mixed for user agent bulk updates',
	},
	'userAgentBulkUpdates.counts': {
		riskLevel: 'read',
		description: 'Counts for user agent bulk updates',
	},
	'userAgentCleanups.create': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Clean up user agent',
	},
	'userAgentCleanups.get': {
		riskLevel: 'read',
		description: 'Get an user agent cleanup',
	},
	'userAgentCleanups.update': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Update an user agent cleanup',
	},
	'userAgentReleases.list': {
		riskLevel: 'read',
		description: 'List user agent releases',
	},
	'userAgentReleases.relay': {
		riskLevel: 'read',
		description: 'Relay for user agent releases',
	},
	'userAgents.list': {
		riskLevel: 'read',
		description: 'List user agents',
	},
	'userAgents.listAll': {
		riskLevel: 'read',
		description: 'List all user agents',
	},
	'userAgents.counts': {
		riskLevel: 'read',
		description: 'Counts for user agents',
	},
	'userAgents.get': {
		riskLevel: 'read',
		description: 'Get an user agent',
	},
	'userAgents.update': {
		riskLevel: 'write',
		description: 'Update an user agent',
	},
	'userAgents.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete an user agent',
	},
	'userAgents.tags': {
		riskLevel: 'read',
		description: 'Tags for user agents',
	},
	'userAgents.dequeueUninstall': {
		riskLevel: 'write',
		description: 'Dequeue uninstall for user agents',
	},
	'userAgents.csv': {
		riskLevel: 'read',
		description: 'CSV for user agents',
	},
	'userAgents.uninstallPin': {
		riskLevel: 'read',
		description: 'Uninstall pin for user agents',
	},
	'users.list': {
		riskLevel: 'read',
		description: 'List users',
	},
	'users.listAll': {
		riskLevel: 'read',
		description: 'List all users',
	},
	'users.get': {
		riskLevel: 'read',
		description: 'Get an user',
	},
	'users.changePassword': {
		riskLevel: 'write',
		description: 'Change password for users',
	},
	'agentLocalUsersV2.counts': {
		riskLevel: 'read',
		description: 'Counts for agent local users V2',
	},
	'currentUserOrgUiSettings.suppressLicenseWarning': {
		riskLevel: 'write',
		description: 'Suppress license warning for current user org UI settings',
	},
	'currentUserUiSettings.get': {
		riskLevel: 'read',
		description: 'Get a current user UI setting',
	},
	'currentUserUiSettings.update': {
		riskLevel: 'write',
		description: 'Update a current user UI setting',
	},
	'dashboards.list': {
		riskLevel: 'read',
		description: 'List dashboards',
	},
	'dashboards.create': {
		riskLevel: 'write',
		description: 'Create a dashboard',
	},
	'dashboards.available': {
		riskLevel: 'read',
		description: 'Available for dashboards',
	},
	'dashboards.owned': {
		riskLevel: 'read',
		description: 'Owned for dashboards',
	},
	'dashboards.update': {
		riskLevel: 'write',
		description: 'Update a dashboard',
	},
	'dashboards.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a dashboard',
	},
	'dashboards.makePublic': {
		riskLevel: 'write',
		description: 'Make public for dashboards',
	},
	'dashboards.makePrivate': {
		riskLevel: 'write',
		description: 'Make private for dashboards',
	},
	'dashboards.link': {
		riskLevel: 'write',
		description: 'Link for dashboards',
	},
	'dashboards.unlink': {
		riskLevel: 'write',
		description: 'Unlink for dashboards',
	},
	'dictionaryV2.aiApplications': {
		riskLevel: 'read',
		description: 'Ai applications for dictionary V2',
	},
	'dictionaryV2.cyberSightActivityTypes': {
		riskLevel: 'read',
		description: 'Cyber sight activity types for dictionary V2',
	},
	'dictionaryV2.vpnSettingsStateTypes': {
		riskLevel: 'read',
		description: 'Vpn settings state types for dictionary V2',
	},
	'scheduledReportsV2.list': {
		riskLevel: 'read',
		description: 'List scheduled reports V2',
	},
	'scheduledReportsV2.create': {
		riskLevel: 'write',
		description: 'Create a scheduled reports V2',
	},
	'scheduledReportsV2.get': {
		riskLevel: 'read',
		description: 'Get a scheduled reports V2',
	},
	'scheduledReportsV2.update': {
		riskLevel: 'write',
		description: 'Update a scheduled reports V2',
	},
	'scheduledReportsV2.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a scheduled reports V2',
	},
	'scheduledReportsV2.bulkUpdate': {
		riskLevel: 'write',
		description: 'Bulk update for scheduled reports V2',
	},
	'unblockRequests.list': {
		riskLevel: 'read',
		description: 'List unblock requests',
	},
	'unblockRequests.counts': {
		riskLevel: 'read',
		description: 'Counts for unblock requests',
	},
	'unblockRequests.pendingCount': {
		riskLevel: 'read',
		description: 'Pending count for unblock requests',
	},
	'unblockRequests.get': {
		riskLevel: 'read',
		description: 'Get an unblock request',
	},
	'unblockRequests.decision': {
		riskLevel: 'write',
		description: 'Decision for unblock requests',
	},
	'userAgentsV2.updateSettings': {
		riskLevel: 'write',
		description: 'Update settings for user agents V2',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof dnsfilterEndpointsNested
>;

export const dnsfilterAuthConfig = {
	api_key: {
		account: ['organization_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseDnsfilterPlugin<T extends DnsfilterPluginOptions> =
	CorsairPlugin<
		'dnsfilter',
		typeof DnsfilterSchema,
		typeof dnsfilterEndpointsNested,
		typeof dnsfilterWebhooksNested,
		T,
		typeof defaultAuthType
	>;

export type InternalDnsfilterPlugin =
	BaseDnsfilterPlugin<DnsfilterPluginOptions>;

export type ExternalDnsfilterPlugin<T extends DnsfilterPluginOptions> =
	BaseDnsfilterPlugin<T>;

export function dnsfilter<const T extends DnsfilterPluginOptions>(
	incomingOptions: DnsfilterPluginOptions & T = {} as DnsfilterPluginOptions &
		T,
): ExternalDnsfilterPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'dnsfilter',
		authConfig: dnsfilterAuthConfig,
		schema: DnsfilterSchema,
		options,
		hooks: options.hooks,
		endpoints: dnsfilterEndpointsNested,
		webhooks: dnsfilterWebhooksNested,
		endpointMeta: dnsfilterEndpointMeta,
		endpointSchemas: dnsfilterEndpointSchemas,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: DnsfilterKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}
			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				return res ?? '';
			}
			return '';
		},
	} satisfies InternalDnsfilterPlugin;
}

export type {
	DnsfilterEndpointInputs,
	DnsfilterEndpointOutputs,
} from './endpoints/types';
