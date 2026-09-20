import { z } from 'zod';
import type { SnapchatOperationName } from '../operations';
import { SNAPCHAT_OPERATIONS } from '../operations';

type RequiredFieldsByOperation = Record<
	SnapchatOperationName,
	readonly string[]
>;

export const SNAPCHAT_REQUIRED_INPUT_FIELDS = {
	addSegmentUsers: ['users', 'segment_id'],
	copyMedia: ['media_copy', 'destination_ad_account_id'],
	createAccountRole: ['roles', 'ad_account_id'],
	createAdAccount: ['adaccounts', 'organization_id'],
	createAdSquad: ['adsquads', 'campaign_id'],
	createAdaccountsAudienceSizeV2: ['targeting', 'ad_account_id'],
	createAdaccountsCreativeElements: ['id', 'creative_elements'],
	createAdaccountsDynamicTemplates: ['adaccount_id', 'dynamic_templates'],
	createAdaccountsEventDetails: ['ad_account_id', 'event_details'],
	createAdaccountsInteractionZones: ['ad_account_id', 'interaction_zones'],
	createAdaccountsOfferDisclaimers: ['id', 'offer_disclaimers'],
	createAdaccountsReservedForecasting: [
		'id',
		'end_time',
		'targeting',
		'start_time',
		'placement_v2',
		'optimization_goal',
		'delivery_constraint',
		'cap_and_exclusion_config',
	],
	createAdaccountsTargetingInsights: ['id', 'base_spec', 'targeting_spec'],
	createBillingCenter: ['billingcenters', 'organization_id'],
	createCampaign: ['name', 'start_time', 'ad_account_id'],
	createCatalogRole: ['roles', 'catalog_id'],
	createCatalogsFacets: ['facets', 'catalog_id'],
	createCatalogsFlightsSearch: ['catalog_id'],
	createCatalogsProductFeeds: ['name', 'catalog_id', 'default_currency'],
	createCatalogsProductSets: ['name', 'catalog_id'],
	createMedia: ['media', 'ad_account_id'],
	createOrgRole: ['roles', 'organization_id'],
	createOrganizationsCatalogs: ['catalogs', 'organization_id'],
	createSegment: ['segments', 'ad_account_id'],
	deleteAdaccountsOfferDisclaimers: ['ad_account_id', 'offer_disclaimer_id'],
	deleteAdsquads: ['id'],
	deleteAllSegmentUsers: ['segment_id'],
	deleteCampaign: ['campaign_id'],
	deleteCatalogs: ['catalog_id'],
	deleteEventDetails: ['event_details_id'],
	deleteMember: ['member_id'],
	deleteProductFeeds: ['product_feed_id'],
	deleteRole: ['role_id'],
	deleteSegment: ['segment_id'],
	deleteSegmentUsers: ['users', 'segment_id'],
	getAdAccount: ['ad_account_id'],
	getAdAccountsLeadGenerationForms: ['ad_account_id'],
	getAdAccountsStats: ['ad_account_id'],
	getAdSquad: ['ad_squad_id'],
	getAdSquadRestrictions: ['ad_squad_id'],
	getAdSquadStats: ['ad_squad_id'],
	getAdSquadTargeting: ['ad_squad_id'],
	getAdStats: ['ad_id'],
	getAdaccountsAdSquadUiRenderData: ['ad_account_id'],
	getAdaccountsAdsquads: ['ad_account_id'],
	getAdaccountsDynamicTemplates: ['ad_account_id'],
	getAdaccountsEventDetails: ['ad_account_id'],
	getAdaccountsInteractionZones: ['ad_account_id'],
	getAdaccountsLeadsReport: ['id', 'report_run_id'],
	getAdaccountsMobileApps: ['ad_account_id'],
	getAdaccountsOfferDisclaimers: ['ad_account_id'],
	getAdaccountsSpendGuidance: ['ad_account_id'],
	getAdaccountsStatsReport: ['ad_account_id', 'report_run_id'],
	getAdsquadsAudienceSizeV2: ['ad_squad_id'],
	getAdsquadsStatsReport: ['ad_squad_id', 'report_run_id'],
	getAuthenticatedUser: ['billing_center_id'],
	getBillingCenter: ['billing_center_id'],
	getCampaign: ['campaign_id'],
	getCampaignChangelog: ['campaign_id'],
	getCampaignStats: ['campaign_id'],
	getCampaignsByIds: ['entity_ids', 'ad_account_id'],
	getCatalogs: ['catalog_id'],
	getCatalogsProductSets: ['catalog_id'],
	getDynamicTemplate: ['id'],
	getDynamicTemplatesExternalChangelogs: ['dynamic_template_id'],
	getEventDetails: ['event_details_id'],
	getFundingSource: ['funding_source_id'],
	getInteractionZone: ['interaction_zone_id'],
	getInvoice: ['invoice_id', 'ad_account_id'],
	getMedia: ['media_id'],
	getMediaByIds: ['entity_ids', 'ad_account_id'],
	getMediaStats: ['media_id'],
	getMember: ['member_id'],
	getOrganization: ['organization_id'],
	getOrganizationsCatalogs: ['organization_id'],
	getOrganizationsMobileApps: ['organization_id'],
	getOrganizationsPublicProfiles: ['organization_id'],
	getPixels: ['ad_account_id'],
	getProductFeeds: ['product_feed_id'],
	getProductFeedsFeedUploads: ['product_feed_id'],
	getProductSets: ['id'],
	getSegment: ['segment_id'],
	getTargetingCarriers: ['country_code'],
	getTargetingConnectionTypes: ['country_code'],
	getTargetingDemographicsAdvancedDemographics: ['country_code'],
	getTargetingDemographicsAgeGroup: ['country_code'],
	getTargetingDemographicsGender: ['country_code'],
	getTargetingDemographicsLanguages: ['country_code'],
	getTargetingDeviceIosOsVersion: ['country_code'],
	getTargetingDeviceMarketingNames: ['country_code'],
	getTargetingGeoPostalCode: ['country_code'],
	getTargetingGeoRegion: ['country_code'],
	getTargetingGeoUsPostalCode: [],
	getTargetingGeoUsRegion: [],
	getTargetingInterestsDlxc: [],
	getTargetingInterestsDlxp: [],
	getTargetingInterestsDlxs: [],
	getTargetingInterestsNln: [],
	getTargetingInterestsPlc: ['country_code'],
	getTargetingLocationCategoriesLoi: ['country_code'],
	getTargetingMetros: ['country_code'],
	getTargetingOsTypes: [],
	getTargetingOsVersions: [],
	getTargetingV1InterestsScLs: ['country_code'],
	getTargetingV1InterestsShp: ['country_code'],
	getTargetingV1InterestsVac: [],
	getTargetingV1Options: [],
	listAccountRoles: ['ad_account_id'],
	listAdAccounts: ['organization_id'],
	listAdSquads: ['campaign_id'],
	listAdsByAccount: ['ad_account_id'],
	listAdsByAdSquad: ['ad_squad_id'],
	listAdsByCampaign: ['campaign_id'],
	listBillingCenters: ['organization_id'],
	listCampaigns: ['ad_account_id'],
	listCatalogRoles: ['catalog_id'],
	listCreatives: ['ad_account_id'],
	listFundingSources: ['organization_id'],
	listInvoices: ['ad_account_id'],
	listMedia: ['ad_account_id'],
	listMemberRoles: ['member_id'],
	listMembers: ['organization_id'],
	listOrgPixels: ['organization_id'],
	listOrgRoles: ['organization_id'],
	listOrganizations: [],
	listPhoneNumbers: ['ad_account_id'],
	listSegments: ['ad_account_id'],
	listSponsoredContent: [],
	listTransactions: ['organization_id'],
	searchAdsLibrarySponsoredContent: ['creator_name'],
	searchCatalogProducts: ['catalog_id'],
	searchCatalogsHotels: ['catalog_id'],
	updateAdAccount: ['adaccounts', 'organization_id'],
	updateAdSquad: ['adsquads', 'campaign_id'],
	updateBillingCenter: ['billingcenters', 'organization_id'],
	updateCampaign: ['campaign_id', 'ad_account_id'],
	updateSegment: ['segments', 'ad_account_id'],
	uploadMediaMultipart: ['media_id'],
	validateConversionEvent: ['events', 'pixel_id'],
} as const satisfies RequiredFieldsByOperation;

export const SNAPCHAT_REQUIRED_OUTPUT_FIELDS = SNAPCHAT_OPERATIONS.reduce(
	(acc, operation) => {
		acc[operation.name] = [];
		return acc;
	},
	{} as RequiredFieldsByOperation,
);

function createEndpointSchema(
	requiredFields: readonly string[],
	isOutput = false,
) {
	const shape: Record<string, z.ZodTypeAny> = {};

	for (const field of requiredFields) {
		shape[field] = z
			.unknown()
			.describe(`Required ${field} parameter`)
			.refine((value) => value !== undefined, {
				message: `${field} is required`,
			});
	}

	return z
		.object(shape)
		.catchall(
			z
				.unknown()
				.describe(
					isOutput
						? 'Response envelope or payload property'
						: 'Additional operation argument',
				),
		)
		.describe(
			isOutput
				? 'Snapchat API response envelope and payload'
				: 'Snapchat API operation arguments',
		);
}

const inputEntries = SNAPCHAT_OPERATIONS.map((operation) => [
	operation.name,
	createEndpointSchema(SNAPCHAT_REQUIRED_INPUT_FIELDS[operation.name], false),
]);

const outputEntries = SNAPCHAT_OPERATIONS.map((operation) => [
	operation.name,
	createEndpointSchema(SNAPCHAT_REQUIRED_OUTPUT_FIELDS[operation.name], true),
]);

export const SnapchatEndpointInputSchemas = Object.fromEntries(
	inputEntries,
) as {
	[K in (typeof SNAPCHAT_OPERATIONS)[number]['name']]: ReturnType<
		typeof createEndpointSchema
	>;
};

export const SnapchatEndpointOutputSchemas = Object.fromEntries(
	outputEntries,
) as {
	[K in (typeof SNAPCHAT_OPERATIONS)[number]['name']]: ReturnType<
		typeof createEndpointSchema
	>;
};

export type SnapchatEndpointInputs = {
	[K in keyof typeof SnapchatEndpointInputSchemas]: z.input<
		(typeof SnapchatEndpointInputSchemas)[K]
	>;
};

export type SnapchatEndpointOutputs = {
	[K in keyof typeof SnapchatEndpointOutputSchemas]: z.infer<
		(typeof SnapchatEndpointOutputSchemas)[K]
	>;
};
