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

function getFieldSchema(field: string): z.ZodTypeAny {
	if (field === 'users') {
		return z
			.array(z.string())
			.min(1)
			.or(z.string().min(1))
			.describe(
				'User identifiers (SHA-256 hashed email, phone, or mobile ad ID)',
			);
	}
	if (field === 'events') {
		return z
			.union([
				z.array(z.record(z.string(), z.unknown())),
				z.record(z.string(), z.unknown()),
				z.string().min(1),
			])
			.describe('Conversion events array, object, or string to validate');
	}
	if (
		field === 'base_spec' ||
		field === 'targeting_spec' ||
		field === 'targeting' ||
		field === 'placement_v2' ||
		field === 'delivery_constraint' ||
		field === 'cap_and_exclusion_config'
	) {
		return z
			.union([z.record(z.string(), z.unknown()), z.string().min(1)])
			.describe(`Targeting or delivery specification for ${field}`);
	}
	if (
		field.endsWith('_id') ||
		field === 'id' ||
		field === 'report_run_id' ||
		field === 'pixel_id'
	) {
		return z.string().min(1).describe(`Unique identifier for ${field}`);
	}
	if (
		field === 'name' ||
		field === 'creator_name' ||
		field === 'country_code' ||
		field === 'default_currency'
	) {
		return z.string().min(1).describe(`Value for ${field}`);
	}
	if (field === 'start_time' || field === 'end_time') {
		return z.string().min(1).or(z.date()).describe(`Timestamp for ${field}`);
	}
	if (field === 'entity_ids') {
		return z
			.array(z.string())
			.or(z.string())
			.describe('List of entity identifiers or single identifier');
	}
	return z
		.union([
			z.string().min(1),
			z.record(z.string(), z.unknown()),
			z.array(z.unknown()),
		])
		.describe(`Parameter ${field}`);
}

function createInputEndpointSchema(requiredFields: readonly string[]) {
	const shape: Record<string, z.ZodTypeAny> = {};

	for (const field of requiredFields) {
		shape[field] = getFieldSchema(field);
	}

	return z
		.object(shape)
		.catchall(z.unknown().describe('Additional operation argument'))
		.describe('Snapchat API operation arguments');
}

export const SnapchatToolOutputSchema = z
	.object({
		successful: z
			.boolean()
			.optional()
			.describe('Indicates whether operation was successful'),
		data: z
			.unknown()
			.optional()
			.describe('Response payload returned from tool execution'),
		error: z
			.unknown()
			.optional()
			.describe('Error details if tool execution failed'),
		log_id: z.string().optional().describe('Composio execution log id'),
		status: z.string().optional().describe('Execution status message'),
		request_id: z.string().optional().describe('Execution request id'),
	})
	.catchall(z.unknown().describe('Additional response property'))
	.describe('Snapchat API operation execution result');

const inputEntries = SNAPCHAT_OPERATIONS.map((operation) => [
	operation.name,
	createInputEndpointSchema(SNAPCHAT_REQUIRED_INPUT_FIELDS[operation.name]),
]);

const outputEntries = SNAPCHAT_OPERATIONS.map((operation) => [
	operation.name,
	SnapchatToolOutputSchema,
]);

export const SnapchatEndpointInputSchemas = Object.fromEntries(
	inputEntries,
) as {
	[K in (typeof SNAPCHAT_OPERATIONS)[number]['name']]: ReturnType<
		typeof createInputEndpointSchema
	>;
};

export const SnapchatEndpointOutputSchemas = Object.fromEntries(
	outputEntries,
) as {
	[K in (typeof SNAPCHAT_OPERATIONS)[number]['name']]: typeof SnapchatToolOutputSchema;
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
