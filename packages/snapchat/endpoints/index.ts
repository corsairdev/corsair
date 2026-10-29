import type { SnapchatEndpoints } from '../index';
import { SNAPCHAT_OPERATIONS } from '../operations';
import * as adaccounts from './adaccounts';
import * as adsquads from './adsquads';
import * as campaigns from './campaigns';
import * as catalogs from './catalogs';
import * as misc from './misc';
import * as organizations from './organizations';
import * as segments from './segments';
import * as targeting from './targeting';

export * from './types';

const endpointMap: SnapchatEndpoints = {
	// ─── Misc / Top-level ──────────────────────────────────────────────────────
	getAuthenticatedUser: misc.getAuthenticatedUserEndpoint,
	listSponsoredContent: misc.listSponsoredContentEndpoint,
	searchAdsLibrarySponsoredContent:
		misc.searchAdsLibrarySponsoredContentEndpoint,
	validateConversionEvent: misc.validateConversionEventEndpoint,
	getEventDetails: misc.getEventDetailsEndpoint,
	deleteEventDetails: misc.deleteEventDetailsEndpoint,

	// ─── Organizations ─────────────────────────────────────────────────────────
	listOrganizations: organizations.listOrganizationsEndpoint,
	getOrganization: organizations.getOrganizationEndpoint,
	listMembers: organizations.listMembersEndpoint,
	getMember: organizations.getMemberEndpoint,
	deleteMember: organizations.deleteMemberEndpoint,
	createOrgRole: organizations.createOrgRoleEndpoint,
	listOrgRoles: organizations.listOrgRolesEndpoint,
	deleteRole: organizations.deleteRoleEndpoint,
	listOrgPixels: organizations.listOrgPixelsEndpoint,
	listBillingCenters: organizations.listBillingCentersEndpoint,
	createBillingCenter: organizations.createBillingCenterEndpoint,
	getBillingCenter: organizations.getBillingCenterEndpoint,
	updateBillingCenter: organizations.updateBillingCenterEndpoint,
	listFundingSources: organizations.listFundingSourcesEndpoint,
	getFundingSource: organizations.getFundingSourceEndpoint,
	listTransactions: organizations.listTransactionsEndpoint,
	getOrganizationsMobileApps: organizations.getOrganizationsMobileAppsEndpoint,
	getOrganizationsPublicProfiles:
		organizations.getOrganizationsPublicProfilesEndpoint,
	listMemberRoles: organizations.listMemberRolesEndpoint,
	listPhoneNumbers: organizations.listPhoneNumbersEndpoint,

	// ─── Ad Accounts ───────────────────────────────────────────────────────────
	listAdAccounts: adaccounts.listAdAccountsEndpoint,
	getAdAccount: adaccounts.getAdAccountEndpoint,
	createAdAccount: adaccounts.createAdAccountEndpoint,
	updateAdAccount: adaccounts.updateAdAccountEndpoint,
	createAccountRole: adaccounts.createAccountRoleEndpoint,
	listAccountRoles: adaccounts.listAccountRolesEndpoint,
	getAdaccountsAdsquads: adaccounts.getAdaccountsAdsquadsEndpoint,
	getAdaccountsAdSquadUiRenderData:
		adaccounts.getAdaccountsAdSquadUiRenderDataEndpoint,
	getAdaccountsDynamicTemplates:
		adaccounts.getAdaccountsDynamicTemplatesEndpoint,
	createAdaccountsDynamicTemplates:
		adaccounts.createAdaccountsDynamicTemplatesEndpoint,
	getAdaccountsEventDetails: adaccounts.getAdaccountsEventDetailsEndpoint,
	createAdaccountsEventDetails: adaccounts.createAdaccountsEventDetailsEndpoint,
	getAdaccountsInteractionZones:
		adaccounts.getAdaccountsInteractionZonesEndpoint,
	createAdaccountsInteractionZones:
		adaccounts.createAdaccountsInteractionZonesEndpoint,
	getInteractionZone: adaccounts.getInteractionZoneEndpoint,
	getAdaccountsLeadsReport: adaccounts.getAdaccountsLeadsReportEndpoint,
	getAdaccountsMobileApps: adaccounts.getAdaccountsMobileAppsEndpoint,
	getAdaccountsOfferDisclaimers:
		adaccounts.getAdaccountsOfferDisclaimersEndpoint,
	createAdaccountsOfferDisclaimers:
		adaccounts.createAdaccountsOfferDisclaimersEndpoint,
	deleteAdaccountsOfferDisclaimers:
		adaccounts.deleteAdaccountsOfferDisclaimersEndpoint,
	getAdaccountsSpendGuidance: adaccounts.getAdaccountsSpendGuidanceEndpoint,
	getAdaccountsStatsReport: adaccounts.getAdaccountsStatsReportEndpoint,
	createAdaccountsTargetingInsights:
		adaccounts.createAdaccountsTargetingInsightsEndpoint,
	createAdaccountsAudienceSizeV2:
		adaccounts.createAdaccountsAudienceSizeV2Endpoint,
	createAdaccountsReservedForecasting:
		adaccounts.createAdaccountsReservedForecastingEndpoint,
	createAdaccountsCreativeElements:
		adaccounts.createAdaccountsCreativeElementsEndpoint,
	getAdAccountsLeadGenerationForms:
		adaccounts.getAdAccountsLeadGenerationFormsEndpoint,
	getAdAccountsStats: adaccounts.getAdAccountsStatsEndpoint,
	getPixels: adaccounts.getPixelsEndpoint,
	listInvoices: adaccounts.listInvoicesEndpoint,
	getInvoice: adaccounts.getInvoiceEndpoint,
	listCreatives: adaccounts.listCreativesEndpoint,
	listMedia: adaccounts.listMediaEndpoint,
	getMedia: adaccounts.getMediaEndpoint,
	getMediaByIds: adaccounts.getMediaByIdsEndpoint,
	createMedia: adaccounts.createMediaEndpoint,
	copyMedia: adaccounts.copyMediaEndpoint,
	getMediaStats: adaccounts.getMediaStatsEndpoint,
	uploadMediaMultipart: adaccounts.uploadMediaMultipartEndpoint,

	// ─── Campaigns ─────────────────────────────────────────────────────────────
	listCampaigns: campaigns.listCampaignsEndpoint,
	getCampaign: campaigns.getCampaignEndpoint,
	createCampaign: campaigns.createCampaignEndpoint,
	updateCampaign: campaigns.updateCampaignEndpoint,
	deleteCampaign: campaigns.deleteCampaignEndpoint,
	getCampaignStats: campaigns.getCampaignStatsEndpoint,
	getCampaignChangelog: campaigns.getCampaignChangelogEndpoint,
	getCampaignsByIds: campaigns.getCampaignsByIdsEndpoint,
	listAdsByCampaign: campaigns.listAdsByCampaignEndpoint,

	// ─── Ad Squads & Ads ────────────────────────────────────────────────────────
	listAdSquads: adsquads.listAdSquadsEndpoint,
	getAdSquad: adsquads.getAdSquadEndpoint,
	createAdSquad: adsquads.createAdSquadEndpoint,
	updateAdSquad: adsquads.updateAdSquadEndpoint,
	deleteAdsquads: adsquads.deleteAdsquadsEndpoint,
	getAdSquadStats: adsquads.getAdSquadStatsEndpoint,
	getAdSquadRestrictions: adsquads.getAdSquadRestrictionsEndpoint,
	getAdSquadTargeting: adsquads.getAdSquadTargetingEndpoint,
	getAdsquadsAudienceSizeV2: adsquads.getAdsquadsAudienceSizeV2Endpoint,
	getAdsquadsStatsReport: adsquads.getAdsquadsStatsReportEndpoint,
	listAdsByAdSquad: adsquads.listAdsByAdSquadEndpoint,
	listAdsByAccount: adsquads.listAdsByAccountEndpoint,
	getAdStats: adsquads.getAdStatsEndpoint,

	// ─── Segments ──────────────────────────────────────────────────────────────
	listSegments: segments.listSegmentsEndpoint,
	getSegment: segments.getSegmentEndpoint,
	createSegment: segments.createSegmentEndpoint,
	updateSegment: segments.updateSegmentEndpoint,
	deleteSegment: segments.deleteSegmentEndpoint,
	addSegmentUsers: segments.addSegmentUsersEndpoint,
	deleteSegmentUsers: segments.deleteSegmentUsersEndpoint,
	deleteAllSegmentUsers: segments.deleteAllSegmentUsersEndpoint,

	// ─── Catalogs ──────────────────────────────────────────────────────────────
	getOrganizationsCatalogs: catalogs.getOrganizationsCatalogsEndpoint,
	createOrganizationsCatalogs: catalogs.createOrganizationsCatalogsEndpoint,
	getCatalogs: catalogs.getCatalogsEndpoint,
	deleteCatalogs: catalogs.deleteCatalogsEndpoint,
	getCatalogsProductSets: catalogs.getCatalogsProductSetsEndpoint,
	createCatalogsProductSets: catalogs.createCatalogsProductSetsEndpoint,
	getProductSets: catalogs.getProductSetsEndpoint,
	listCatalogRoles: catalogs.listCatalogRolesEndpoint,
	createCatalogRole: catalogs.createCatalogRoleEndpoint,
	createCatalogsFacets: catalogs.createCatalogsFacetsEndpoint,
	createCatalogsProductFeeds: catalogs.createCatalogsProductFeedsEndpoint,
	getProductFeeds: catalogs.getProductFeedsEndpoint,
	deleteProductFeeds: catalogs.deleteProductFeedsEndpoint,
	getProductFeedsFeedUploads: catalogs.getProductFeedsFeedUploadsEndpoint,
	createCatalogsFlightsSearch: catalogs.createCatalogsFlightsSearchEndpoint,
	searchCatalogProducts: catalogs.searchCatalogProductsEndpoint,
	searchCatalogsHotels: catalogs.searchCatalogsHotelsEndpoint,
	getDynamicTemplate: catalogs.getDynamicTemplateEndpoint,
	getDynamicTemplatesExternalChangelogs:
		catalogs.getDynamicTemplatesExternalChangelogsEndpoint,

	// ─── Targeting ─────────────────────────────────────────────────────────────
	getTargetingCarriers: targeting.getTargetingCarriersEndpoint,
	getTargetingConnectionTypes: targeting.getTargetingConnectionTypesEndpoint,
	getTargetingDemographicsAdvancedDemographics:
		targeting.getTargetingDemographicsAdvancedDemographicsEndpoint,
	getTargetingDemographicsAgeGroup:
		targeting.getTargetingDemographicsAgeGroupEndpoint,
	getTargetingDemographicsGender:
		targeting.getTargetingDemographicsGenderEndpoint,
	getTargetingDemographicsLanguages:
		targeting.getTargetingDemographicsLanguagesEndpoint,
	getTargetingDeviceIosOsVersion:
		targeting.getTargetingDeviceIosOsVersionEndpoint,
	getTargetingDeviceMarketingNames:
		targeting.getTargetingDeviceMarketingNamesEndpoint,
	getTargetingGeoPostalCode: targeting.getTargetingGeoPostalCodeEndpoint,
	getTargetingGeoRegion: targeting.getTargetingGeoRegionEndpoint,
	getTargetingGeoUsPostalCode: targeting.getTargetingGeoUsPostalCodeEndpoint,
	getTargetingGeoUsRegion: targeting.getTargetingGeoUsRegionEndpoint,
	getTargetingInterestsDlxc: targeting.getTargetingInterestsDlxcEndpoint,
	getTargetingInterestsDlxp: targeting.getTargetingInterestsDlxpEndpoint,
	getTargetingInterestsDlxs: targeting.getTargetingInterestsDlxsEndpoint,
	getTargetingInterestsNln: targeting.getTargetingInterestsNlnEndpoint,
	getTargetingInterestsPlc: targeting.getTargetingInterestsPlcEndpoint,
	getTargetingLocationCategoriesLoi:
		targeting.getTargetingLocationCategoriesLoiEndpoint,
	getTargetingMetros: targeting.getTargetingMetrosEndpoint,
	getTargetingOsTypes: targeting.getTargetingOsTypesEndpoint,
	getTargetingOsVersions: targeting.getTargetingOsVersionsEndpoint,
	getTargetingV1InterestsScLs: targeting.getTargetingV1InterestsScLsEndpoint,
	getTargetingV1InterestsShp: targeting.getTargetingV1InterestsShpEndpoint,
	getTargetingV1InterestsVac: targeting.getTargetingV1InterestsVacEndpoint,
	getTargetingV1Options: targeting.getTargetingV1OptionsEndpoint,
};

export const Actions = Object.fromEntries(
	SNAPCHAT_OPERATIONS.map((op) => [op.name, endpointMap[op.name]]),
) as {
	[K in (typeof SNAPCHAT_OPERATIONS)[number]['name']]: SnapchatEndpoints[K];
};
