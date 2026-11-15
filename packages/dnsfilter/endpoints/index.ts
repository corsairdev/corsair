import {
	agentLocalUserBulkDeletesCounts,
	agentLocalUserBulkDeletesCreate,
	agentLocalUserBulkDeletesGet,
} from './agent-local-users';
export const AgentLocalUserBulkDeletes = {
	agentLocalUserBulkDeletesCreate,
	agentLocalUserBulkDeletesGet,
	agentLocalUserBulkDeletesCounts,
};

import {
	agentLocalUsersDelete,
	agentLocalUsersGet,
	agentLocalUsersList,
	agentLocalUsersListAll,
	agentLocalUsersUpdate,
} from './agent-local-users';
export const AgentLocalUsers = {
	agentLocalUsersList,
	agentLocalUsersListAll,
	agentLocalUsersGet,
	agentLocalUsersUpdate,
	agentLocalUsersDelete,
};

import {
	apiKeysCreate,
	apiKeysDelete,
	apiKeysGet,
	apiKeysList,
	apiKeysRevoke,
} from './api-keys';
export const ApiKeys = {
	apiKeysCreate,
	apiKeysList,
	apiKeysGet,
	apiKeysDelete,
	apiKeysRevoke,
};

import {
	applicationCategoriesGet,
	applicationCategoriesList,
} from './applications';
export const ApplicationCategories = {
	applicationCategoriesList,
	applicationCategoriesGet,
};

import {
	applicationsGet,
	applicationsList,
	applicationsListAll,
} from './applications';
export const Applications = {
	applicationsList,
	applicationsListAll,
	applicationsGet,
};

import {
	billingsAddressShow,
	billingsAddressUpdate,
	billingsCreate,
	billingsGet,
} from './billings';
export const Billings = {
	billingsGet,
	billingsCreate,
	billingsAddressShow,
	billingsAddressUpdate,
};

import {
	blockPagesCreate,
	blockPagesDelete,
	blockPagesGet,
	blockPagesList,
	blockPagesListAll,
	blockPagesUpdate,
} from './block-pages';
export const BlockPages = {
	blockPagesList,
	blockPagesCreate,
	blockPagesListAll,
	blockPagesGet,
	blockPagesUpdate,
	blockPagesDelete,
};

import { categoriesGet, categoriesList, categoriesListAll } from './categories';
export const Categories = { categoriesList, categoriesListAll, categoriesGet };

import {
	collectionUsersCreate,
	collectionUsersDelete,
	collectionUsersGet,
	collectionUsersList,
} from './users';
export const CollectionUsers = {
	collectionUsersList,
	collectionUsersCreate,
	collectionUsersGet,
	collectionUsersDelete,
};

import { currentUsersGet, currentUsersUpdate } from './users';
export const CurrentUsers = { currentUsersGet, currentUsersUpdate };

import { dictionaryQpMethods } from './dictionary';
export const Dictionary = { dictionaryQpMethods };

import {
	domainNotesBatchDestroy,
	domainNotesBatchUpdate,
	domainNotesDelete,
	domainNotesGet,
	domainNotesUpdate,
} from './domains';
export const DomainNotes = {
	domainNotesGet,
	domainNotesUpdate,
	domainNotesBatchUpdate,
	domainNotesDelete,
	domainNotesBatchDestroy,
};

import {
	domainsBulkLookup,
	domainsSuggestThreat,
	domainsUserLookup,
} from './domains';
export const Domains = {
	domainsUserLookup,
	domainsBulkLookup,
	domainsSuggestThreat,
};

import {
	enterpriseConnectionsCreate,
	enterpriseConnectionsDelete,
	enterpriseConnectionsGet,
	enterpriseConnectionsList,
	enterpriseConnectionsUpdate,
} from './enterprise-connections';
export const EnterpriseConnections = {
	enterpriseConnectionsList,
	enterpriseConnectionsCreate,
	enterpriseConnectionsGet,
	enterpriseConnectionsUpdate,
	enterpriseConnectionsDelete,
};

import { invoicesCurrent, invoicesGet, invoicesList } from './billings';
export const Invoices = { invoicesCurrent, invoicesList, invoicesGet };

import {
	ipAddressesCreate,
	ipAddressesDelete,
	ipAddressesGet,
	ipAddressesList,
	ipAddressesListAll,
	ipAddressesMyip,
	ipAddressesUpdate,
	ipAddressesVerify,
} from './ip-addresses';
export const IpAddresses = {
	ipAddressesList,
	ipAddressesCreate,
	ipAddressesListAll,
	ipAddressesGet,
	ipAddressesUpdate,
	ipAddressesDelete,
	ipAddressesVerify,
	ipAddressesMyip,
};

import {
	macAddressesCreate,
	macAddressesDelete,
	macAddressesGet,
	macAddressesList,
	macAddressesListAll,
	macAddressesUpdate,
} from './mac-addresses';
export const MacAddresses = {
	macAddressesList,
	macAddressesCreate,
	macAddressesListAll,
	macAddressesGet,
	macAddressesUpdate,
	macAddressesDelete,
};

import {
	metricsOrganizationUsage,
	metricsOrganizationUsageDetailed,
} from './metrics';
export const Metrics = {
	metricsOrganizationUsage,
	metricsOrganizationUsageDetailed,
};

import {
	networkLanIpsGet,
	networkLanIpsList,
	networkLanIpsUpdate,
} from './networks';
export const NetworkLanIps = {
	networkLanIpsList,
	networkLanIpsGet,
	networkLanIpsUpdate,
};

import {
	networkSubnetsCreate,
	networkSubnetsDelete,
	networkSubnetsGet,
	networkSubnetsList,
	networkSubnetsListAll,
	networkSubnetsUpdate,
} from './networks';
export const NetworkSubnets = {
	networkSubnetsListAll,
	networkSubnetsList,
	networkSubnetsCreate,
	networkSubnetsGet,
	networkSubnetsUpdate,
	networkSubnetsDelete,
};

import {
	networksBulkCreate,
	networksBulkCreateStatus,
	networksBulkDestroy,
	networksBulkDestroyStatus,
	networksBulkUpdate,
	networksBulkUpdateStatus,
	networksCounts,
	networksCreate,
	networksDelete,
	networksGenerateSecretKey,
	networksGeo,
	networksGet,
	networksList,
	networksListAll,
	networksLookup,
	networksMsp,
	networksMspAll,
	networksRevokeSecretKey,
	networksRotateSecretKey,
	networksUpdate,
} from './networks';
export const Networks = {
	networksList,
	networksCreate,
	networksListAll,
	networksCounts,
	networksMsp,
	networksMspAll,
	networksGeo,
	networksLookup,
	networksGet,
	networksUpdate,
	networksDelete,
	networksBulkCreate,
	networksBulkCreateStatus,
	networksBulkUpdate,
	networksBulkUpdateStatus,
	networksBulkDestroy,
	networksBulkDestroyStatus,
	networksGenerateSecretKey,
	networksRevokeSecretKey,
	networksRotateSecretKey,
};

import {
	organizationUsersCreate,
	organizationUsersDelete,
	organizationUsersGet,
	organizationUsersList,
	organizationUsersResendInvite,
	organizationUsersUpdate,
} from './users';
export const OrganizationUsers = {
	organizationUsersList,
	organizationUsersCreate,
	organizationUsersGet,
	organizationUsersUpdate,
	organizationUsersDelete,
	organizationUsersResendInvite,
};

import {
	organizationsBulkUpdate,
	organizationsCancel,
	organizationsCreate,
	organizationsDelete,
	organizationsGet,
	organizationsList,
	organizationsListAll,
	organizationsPromoteToMsp,
	organizationsSettings,
	organizationsUpdate,
} from './organizations';
export const Organizations = {
	organizationsList,
	organizationsCreate,
	organizationsListAll,
	organizationsGet,
	organizationsUpdate,
	organizationsDelete,
	organizationsSettings,
	organizationsBulkUpdate,
	organizationsCancel,
	organizationsPromoteToMsp,
};

import {
	policiesBulkActionsAddAllowlistDomains,
	policiesBulkActionsAddBlocklistDomains,
	policiesBulkActionsRemoveAllowlistDomains,
	policiesBulkActionsRemoveBlocklistDomains,
} from './policies';
export const PoliciesBulkActions = {
	policiesBulkActionsAddAllowlistDomains,
	policiesBulkActionsRemoveAllowlistDomains,
	policiesBulkActionsAddBlocklistDomains,
	policiesBulkActionsRemoveBlocklistDomains,
};

import {
	policiesAddAllowedApplication,
	policiesAddBlacklistCategory,
	policiesAddBlacklistDomain,
	policiesAddBlockedApplication,
	policiesAddWhitelistDomain,
	policiesApplication,
	policiesApplicationUpdate,
	policiesCreate,
	policiesDelete,
	policiesGet,
	policiesGetPermissiveMode,
	policiesList,
	policiesListAll,
	policiesRemoveAllowedApplication,
	policiesRemoveBlacklistCategory,
	policiesRemoveBlacklistDomain,
	policiesRemoveBlockedApplication,
	policiesRemoveWhitelistDomain,
	policiesUpdate,
	policiesUpdatePermissiveMode,
} from './policies';
export const Policies = {
	policiesList,
	policiesCreate,
	policiesListAll,
	policiesGet,
	policiesUpdate,
	policiesDelete,
	policiesApplication,
	policiesApplicationUpdate,
	policiesAddBlacklistDomain,
	policiesRemoveBlacklistDomain,
	policiesAddWhitelistDomain,
	policiesRemoveWhitelistDomain,
	policiesAddBlacklistCategory,
	policiesRemoveBlacklistCategory,
	policiesAddAllowedApplication,
	policiesRemoveAllowedApplication,
	policiesAddBlockedApplication,
	policiesRemoveBlockedApplication,
	policiesGetPermissiveMode,
	policiesUpdatePermissiveMode,
};

import { policyIpsGet, policyIpsList } from './policies';
export const PolicyIps = { policyIpsList, policyIpsGet };

import { psaIntegrationsRedirectLink } from './psa-integrations';
export const PsaIntegrations = { psaIntegrationsRedirectLink };

import {
	scheduledPoliciesCreate,
	scheduledPoliciesDelete,
	scheduledPoliciesGet,
	scheduledPoliciesList,
	scheduledPoliciesListAll,
	scheduledPoliciesUpdate,
} from './scheduled-policies';
export const ScheduledPolicies = {
	scheduledPoliciesList,
	scheduledPoliciesCreate,
	scheduledPoliciesListAll,
	scheduledPoliciesGet,
	scheduledPoliciesUpdate,
	scheduledPoliciesDelete,
};

import {
	scheduledReportPreviewsCreate,
	scheduledReportPreviewsGet,
} from './scheduled-reports';
export const ScheduledReportPreviews = {
	scheduledReportPreviewsGet,
	scheduledReportPreviewsCreate,
};

import {
	scheduledReportsCreate,
	scheduledReportsDelete,
	scheduledReportsGet,
	scheduledReportsList,
	scheduledReportsUpdate,
} from './scheduled-reports';
export const ScheduledReports = {
	scheduledReportsList,
	scheduledReportsCreate,
	scheduledReportsGet,
	scheduledReportsUpdate,
	scheduledReportsDelete,
};

import {
	trafficReportsQps,
	trafficReportsQpsActiveAgents,
	trafficReportsQpsActiveOrganizations,
	trafficReportsQueryLogs,
	trafficReportsTopAgents,
	trafficReportsTopApplicationCategories,
	trafficReportsTopCategories,
	trafficReportsTopCollections,
	trafficReportsTopDomains,
	trafficReportsTopNetworks,
	trafficReportsTopOrganizationsRequests,
	trafficReportsTopUsers,
	trafficReportsTotalApplicationsAgentsStats,
	trafficReportsTotalApplicationsCollectionsStats,
	trafficReportsTotalApplicationsNetworksStats,
	trafficReportsTotalApplicationsStats,
	trafficReportsTotalApplicationsUsersStats,
	trafficReportsTotalCategories,
	trafficReportsTotalCategoriesOrganizations,
	trafficReportsTotalCategoryStats,
	trafficReportsTotalClientStats,
	trafficReportsTotalDeployments,
	trafficReportsTotalDomainStats,
	trafficReportsTotalDomains,
	trafficReportsTotalDomainsOrganizations,
	trafficReportsTotalDomainsUsers,
	trafficReportsTotalOrganizationsRequests,
	trafficReportsTotalOrganizationsStats,
	trafficReportsTotalRequests,
	trafficReportsTotalRequestsAgents,
	trafficReportsTotalRequestsCollections,
	trafficReportsTotalRequestsGeo,
	trafficReportsTotalRequestsOrganizations,
	trafficReportsTotalRequestsUsers,
	trafficReportsTotalRoamingClients,
	trafficReportsTotalThreats,
	trafficReportsTotalThreatsOrganizations,
	trafficReportsTotalThreatsUsers,
} from './traffic-reports';
export const TrafficReports = {
	trafficReportsTotalRequests,
	trafficReportsTotalRequestsGeo,
	trafficReportsTotalRequestsOrganizations,
	trafficReportsTotalRequestsAgents,
	trafficReportsTotalRequestsUsers,
	trafficReportsTotalRequestsCollections,
	trafficReportsTotalThreats,
	trafficReportsTotalThreatsOrganizations,
	trafficReportsTotalThreatsUsers,
	trafficReportsTotalCategories,
	trafficReportsTotalCategoriesOrganizations,
	trafficReportsTotalDomains,
	trafficReportsTotalDomainsOrganizations,
	trafficReportsTotalDomainsUsers,
	trafficReportsQps,
	trafficReportsQpsActiveOrganizations,
	trafficReportsQpsActiveAgents,
	trafficReportsTopDomains,
	trafficReportsTopCategories,
	trafficReportsTopApplicationCategories,
	trafficReportsTopNetworks,
	trafficReportsTopAgents,
	trafficReportsTopUsers,
	trafficReportsTopCollections,
	trafficReportsQueryLogs,
	trafficReportsTotalOrganizationsStats,
	trafficReportsTotalDomainStats,
	trafficReportsTotalCategoryStats,
	trafficReportsTotalOrganizationsRequests,
	trafficReportsTopOrganizationsRequests,
	trafficReportsTotalClientStats,
	trafficReportsTotalDeployments,
	trafficReportsTotalRoamingClients,
	trafficReportsTotalApplicationsStats,
	trafficReportsTotalApplicationsNetworksStats,
	trafficReportsTotalApplicationsAgentsStats,
	trafficReportsTotalApplicationsUsersStats,
	trafficReportsTotalApplicationsCollectionsStats,
};

import { trialsCreate } from './billings';
export const Trials = { trialsCreate };

import {
	userAgentBulkDeletesCounts,
	userAgentBulkDeletesCreate,
	userAgentBulkDeletesGet,
} from './user-agents';
export const UserAgentBulkDeletes = {
	userAgentBulkDeletesCreate,
	userAgentBulkDeletesGet,
	userAgentBulkDeletesCounts,
};

import {
	userAgentBulkUpdatesCounts,
	userAgentBulkUpdatesCreate,
	userAgentBulkUpdatesGet,
	userAgentBulkUpdatesHasMixed,
} from './user-agents';
export const UserAgentBulkUpdates = {
	userAgentBulkUpdatesCreate,
	userAgentBulkUpdatesGet,
	userAgentBulkUpdatesHasMixed,
	userAgentBulkUpdatesCounts,
};

import {
	userAgentCleanupsCreate,
	userAgentCleanupsGet,
	userAgentCleanupsUpdate,
} from './user-agents';
export const UserAgentCleanups = {
	userAgentCleanupsCreate,
	userAgentCleanupsGet,
	userAgentCleanupsUpdate,
};

import { userAgentReleasesList, userAgentReleasesRelay } from './user-agents';
export const UserAgentReleases = {
	userAgentReleasesList,
	userAgentReleasesRelay,
};

import {
	userAgentsCounts,
	userAgentsDelete,
	userAgentsDequeueUninstall,
	userAgentsGet,
	userAgentsList,
	userAgentsListAll,
	userAgentsTags,
	userAgentsUninstallPin,
	userAgentsUpdate,
} from './user-agents';
export const UserAgents = {
	userAgentsList,
	userAgentsListAll,
	userAgentsCounts,
	userAgentsGet,
	userAgentsUpdate,
	userAgentsDelete,
	userAgentsTags,
	userAgentsDequeueUninstall,
	userAgentsUninstallPin,
};

import {
	usersChangePassword,
	usersGet,
	usersList,
	usersListAll,
} from './users';
export const Users = { usersList, usersListAll, usersGet, usersChangePassword };

import { agentLocalUsersV2Counts } from './agent-local-users';
export const AgentLocalUsersV2 = { agentLocalUsersV2Counts };

import { currentUserOrgUiSettingsSuppressLicenseWarning } from './users';
export const CurrentUserOrgUiSettings = {
	currentUserOrgUiSettingsSuppressLicenseWarning,
};

import { currentUserUiSettingsGet, currentUserUiSettingsUpdate } from './users';
export const CurrentUserUiSettings = {
	currentUserUiSettingsGet,
	currentUserUiSettingsUpdate,
};

import {
	dashboardsAvailable,
	dashboardsCreate,
	dashboardsDelete,
	dashboardsLink,
	dashboardsList,
	dashboardsMakePrivate,
	dashboardsMakePublic,
	dashboardsOwned,
	dashboardsUnlink,
	dashboardsUpdate,
} from './dashboards';
export const Dashboards = {
	dashboardsList,
	dashboardsCreate,
	dashboardsAvailable,
	dashboardsOwned,
	dashboardsUpdate,
	dashboardsDelete,
	dashboardsMakePublic,
	dashboardsMakePrivate,
	dashboardsLink,
	dashboardsUnlink,
};

import {
	dictionaryV2AiApplications,
	dictionaryV2CyberSightActivityTypes,
	dictionaryV2VpnSettingsStateTypes,
} from './dictionary';
export const DictionaryV2 = {
	dictionaryV2AiApplications,
	dictionaryV2CyberSightActivityTypes,
	dictionaryV2VpnSettingsStateTypes,
};

import {
	scheduledReportsV2BulkUpdate,
	scheduledReportsV2Create,
	scheduledReportsV2Delete,
	scheduledReportsV2Get,
	scheduledReportsV2List,
	scheduledReportsV2Update,
} from './scheduled-reports';
export const ScheduledReportsV2 = {
	scheduledReportsV2List,
	scheduledReportsV2Create,
	scheduledReportsV2Get,
	scheduledReportsV2Update,
	scheduledReportsV2Delete,
	scheduledReportsV2BulkUpdate,
};

import {
	unblockRequestsCounts,
	unblockRequestsDecision,
	unblockRequestsGet,
	unblockRequestsList,
	unblockRequestsPendingCount,
} from './unblock-requests';
export const UnblockRequests = {
	unblockRequestsList,
	unblockRequestsCounts,
	unblockRequestsPendingCount,
	unblockRequestsGet,
	unblockRequestsDecision,
};

import { userAgentsV2UpdateSettings } from './user-agents';
export const UserAgentsV2 = { userAgentsV2UpdateSettings };

import {
	csvExportsAgentLocalUsersCreate,
	csvExportsAgentLocalUsersGet,
	csvExportsCyberSightCreate,
	csvExportsCyberSightGet,
	csvExportsNetworksCreate,
	csvExportsNetworksGet,
	csvExportsUnblockRequestsCreate,
	csvExportsUnblockRequestsGet,
	csvExportsUserAgentCreate,
	csvExportsUserAgentGet,
	csvExportsUserAgentsCsv,
} from './csv-exports';
export const CsvExports = {
	csvExportsUserAgentsCsv,
	csvExportsUserAgentCreate,
	csvExportsUserAgentGet,
	csvExportsAgentLocalUsersCreate,
	csvExportsAgentLocalUsersGet,
	csvExportsCyberSightCreate,
	csvExportsCyberSightGet,
	csvExportsNetworksCreate,
	csvExportsNetworksGet,
	csvExportsUnblockRequestsCreate,
	csvExportsUnblockRequestsGet,
};

export * from './types';
