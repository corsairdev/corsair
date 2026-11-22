import type {
	AuthTypes,
	BindEndpoints,
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
import { AuthMissingError } from 'corsair/core';
import {
	Accounts,
	AdSets,
	Ads,
	AsyncCreatives,
	AsyncRequestSets,
	AsyncRequests,
	Audiences,
	Campaigns,
	Creatives,
	CustomConversions,
	HighDemandPeriods,
	Images,
	Insights,
	Labels,
	Pixels,
	PublisherBlockLists,
	ReachFrequencyPredictions,
	Studies,
	Videos,
} from './endpoints';
import type {
	MetaAdsEndpointInputs,
	MetaAdsEndpointOutputs,
} from './endpoints/types';
import {
	MetaAdsEndpointInputSchemas,
	MetaAdsEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { MetaAdsSchema } from './schema';

export type MetaAdsPluginOptions = {
	authType?: PickAuth<'oauth_2'>;
	key?: string;
	hooks?: InternalMetaAdsPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof metaAdsEndpointsNested>;
};

export type MetaAdsContext = CorsairPluginContext<
	typeof MetaAdsSchema,
	MetaAdsPluginOptions
>;
export type MetaAdsKeyBuilderContext = KeyBuilderContext<MetaAdsPluginOptions>;
export type MetaAdsBoundEndpoints = BindEndpoints<
	typeof metaAdsEndpointsNested
>;

type Endpoint<K extends keyof MetaAdsEndpointOutputs> = CorsairEndpoint<
	MetaAdsContext,
	MetaAdsEndpointInputs[K],
	MetaAdsEndpointOutputs[K]
>;

export type MetaAdsEndpoints = {
	[K in keyof MetaAdsEndpointOutputs]: Endpoint<K>;
};

const metaAdsEndpointsNested = {
	accounts: {
		list: Accounts.list,
		get: Accounts.get,
		usersList: Accounts.usersList,
		assignedUsersList: Accounts.assignedUsersList,
		assignUser: Accounts.assignUser,
		removeUser: Accounts.removeUser,
		controlsCreate: Accounts.controlsCreate,
		agenciesList: Accounts.agenciesList,
		agencyRemove: Accounts.agencyRemove,
		subscribedAppUpdate: Accounts.subscribedAppUpdate,
		subscribedAppRemove: Accounts.subscribedAppRemove,
		trackingCreate: Accounts.trackingCreate,
		pixelsList: Accounts.pixelsList,
		activitiesList: Accounts.activitiesList,
		impactingAdStudiesList: Accounts.impactingAdStudiesList,
		adRulesLibraryList: Accounts.adRulesLibraryList,
		adRulesLibraryCreate: Accounts.adRulesLibraryCreate,
		activeAdRulesList: Accounts.activeAdRulesList,
		generatePreviews: Accounts.generatePreviews,
		broadTargetingCategoriesList: Accounts.broadTargetingCategoriesList,
		smartSuggestedAdsList: Accounts.smartSuggestedAdsList,
		suggestedAdsList: Accounts.suggestedAdsList,
		placePageSetsCreate: Accounts.placePageSetsCreate,
		reachEstimate: Accounts.reachEstimate,
	},
	labels: {
		list: Labels.list,
		get: Labels.get,
		create: Labels.create,
		update: Labels.update,
		delete: Labels.delete,
		adsList: Labels.adsList,
		adSetsList: Labels.adSetsList,
		campaignsList: Labels.campaignsList,
		creativesList: Labels.creativesList,
	},
	pixels: { create: Pixels.create, get: Pixels.get, update: Pixels.update },
	publisherBlockLists: { create: PublisherBlockLists.create },
	highDemandPeriods: { get: HighDemandPeriods.get },
	images: { list: Images.list, upload: Images.upload, delete: Images.delete },
	campaigns: {
		list: Campaigns.list,
		adSetsList: Campaigns.adSetsList,
		adsList: Campaigns.adsList,
		copiesList: Campaigns.copiesList,
		copy: Campaigns.copy,
		labelsAdd: Campaigns.labelsAdd,
		budgetSchedulesList: Campaigns.budgetSchedulesList,
		budgetScheduleCreate: Campaigns.budgetScheduleCreate,
		adStudiesList: Campaigns.adStudiesList,
		adRulesGovernedList: Campaigns.adRulesGovernedList,
		get: Campaigns.get,
		create: Campaigns.create,
		update: Campaigns.update,
		delete: Campaigns.delete,
	},
	adSets: {
		list: AdSets.list,
		adsList: AdSets.adsList,
		adCreativesList: AdSets.adCreativesList,
		copiesList: AdSets.copiesList,
		copy: AdSets.copy,
		budgetSchedulesList: AdSets.budgetSchedulesList,
		budgetScheduleCreate: AdSets.budgetScheduleCreate,
		activitiesList: AdSets.activitiesList,
		adStudiesList: AdSets.adStudiesList,
		adRulesGovernedList: AdSets.adRulesGovernedList,
		get: AdSets.get,
		create: AdSets.create,
		update: AdSets.update,
		delete: AdSets.delete,
	},
	ads: {
		list: Ads.list,
		adCreativesList: Ads.adCreativesList,
		adStudiesList: Ads.adStudiesList,
		adRulesGovernedList: Ads.adRulesGovernedList,
		previewsList: Ads.previewsList,
		copiesList: Ads.copiesList,
		copy: Ads.copy,
		labelsAdd: Ads.labelsAdd,
		get: Ads.get,
		create: Ads.create,
		update: Ads.update,
		delete: Ads.delete,
	},
	creatives: {
		list: Creatives.list,
		get: Creatives.get,
		create: Creatives.create,
		update: Creatives.update,
		delete: Creatives.delete,
		labelsAdd: Creatives.labelsAdd,
		insightsList: Creatives.insightsList,
		previewsList: Creatives.previewsList,
	},
	customConversions: { create: CustomConversions.create },
	audiences: {
		list: Audiences.list,
		adsList: Audiences.adsList,
		adAccountsList: Audiences.adAccountsList,
		get: Audiences.get,
		create: Audiences.create,
		acceptTerms: Audiences.acceptTerms,
		update: Audiences.update,
		delete: Audiences.delete,
		sessionsList: Audiences.sessionsList,
		usersAdd: Audiences.usersAdd,
		usersRemove: Audiences.usersRemove,
		usersReplace: Audiences.usersReplace,
		adAccountsShare: Audiences.adAccountsShare,
		adAccountsUnshare: Audiences.adAccountsUnshare,
	},
	studies: {
		get: Studies.get,
		create: Studies.create,
		update: Studies.update,
		relatedAccountsList: Studies.relatedAccountsList,
		viewersList: Studies.viewersList,
	},
	videos: { delete: Videos.delete },
	asyncCreatives: {
		list: AsyncCreatives.list,
		create: AsyncCreatives.create,
	},
	asyncRequestSets: {
		list: AsyncRequestSets.list,
		create: AsyncRequestSets.create,
		get: AsyncRequestSets.get,
		update: AsyncRequestSets.update,
		cancel: AsyncRequestSets.cancel,
	},
	asyncRequests: {
		listForSet: AsyncRequests.listForSet,
		listForAdSet: AsyncRequests.listForAdSet,
		cancel: AsyncRequests.cancel,
	},
	reachFrequencyPredictions: {
		get: ReachFrequencyPredictions.get,
		list: ReachFrequencyPredictions.list,
		create: ReachFrequencyPredictions.create,
	},
	insights: {
		list: Insights.list,
		listForCampaign: Insights.listForCampaign,
		listForAdSet: Insights.listForAdSet,
		listForAd: Insights.listForAd,
		createAsync: Insights.createAsync,
		getAsyncReport: Insights.getAsyncReport,
		getAsyncResults: Insights.getAsyncResults,
		listFeatures: Insights.listFeatures,
		listEnabledFeatures: Insights.listEnabledFeatures,
		enableFeature: Insights.enableFeature,
	},
} as const;

export const metaAdsEndpointSchemas: RequiredPluginEndpointSchemas<
	typeof metaAdsEndpointsNested
> = {
	'accounts.list': {
		input: MetaAdsEndpointInputSchemas.accountsList,
		output: MetaAdsEndpointOutputSchemas.accountsList,
	},
	'accounts.get': {
		input: MetaAdsEndpointInputSchemas.accountsGet,
		output: MetaAdsEndpointOutputSchemas.accountsGet,
	},
	'accounts.usersList': {
		input: MetaAdsEndpointInputSchemas.accountsUsersList,
		output: MetaAdsEndpointOutputSchemas.accountsUsersList,
	},
	'accounts.activitiesList': {
		input: MetaAdsEndpointInputSchemas.accountsActivitiesList,
		output: MetaAdsEndpointOutputSchemas.accountsActivitiesList,
	},
	'accounts.assignedUsersList': {
		input: MetaAdsEndpointInputSchemas.accountsAssignedUsersList,
		output: MetaAdsEndpointOutputSchemas.accountsAssignedUsersList,
	},
	'accounts.assignUser': {
		input: MetaAdsEndpointInputSchemas.accountsAssignUser,
		output: MetaAdsEndpointOutputSchemas.accountsAssignUser,
	},
	'accounts.removeUser': {
		input: MetaAdsEndpointInputSchemas.accountsRemoveUser,
		output: MetaAdsEndpointOutputSchemas.accountsRemoveUser,
	},
	'accounts.controlsCreate': {
		input: MetaAdsEndpointInputSchemas.accountsControlsCreate,
		output: MetaAdsEndpointOutputSchemas.accountsControlsCreate,
	},
	'accounts.agenciesList': {
		input: MetaAdsEndpointInputSchemas.accountsAgenciesList,
		output: MetaAdsEndpointOutputSchemas.accountsAgenciesList,
	},
	'accounts.agencyRemove': {
		input: MetaAdsEndpointInputSchemas.accountsAgencyRemove,
		output: MetaAdsEndpointOutputSchemas.accountsAgencyRemove,
	},
	'accounts.subscribedAppUpdate': {
		input: MetaAdsEndpointInputSchemas.accountsSubscribedAppUpdate,
		output: MetaAdsEndpointOutputSchemas.accountsSubscribedAppUpdate,
	},
	'accounts.subscribedAppRemove': {
		input: MetaAdsEndpointInputSchemas.accountsSubscribedAppRemove,
		output: MetaAdsEndpointOutputSchemas.accountsSubscribedAppRemove,
	},
	'accounts.trackingCreate': {
		input: MetaAdsEndpointInputSchemas.accountsTrackingCreate,
		output: MetaAdsEndpointOutputSchemas.accountsTrackingCreate,
	},
	'accounts.pixelsList': {
		input: MetaAdsEndpointInputSchemas.accountsPixelsList,
		output: MetaAdsEndpointOutputSchemas.accountsPixelsList,
	},
	'pixels.create': {
		input: MetaAdsEndpointInputSchemas.pixelsCreate,
		output: MetaAdsEndpointOutputSchemas.pixelsCreate,
	},
	'pixels.get': {
		input: MetaAdsEndpointInputSchemas.pixelsGet,
		output: MetaAdsEndpointOutputSchemas.pixelsGet,
	},
	'pixels.update': {
		input: MetaAdsEndpointInputSchemas.pixelsUpdate,
		output: MetaAdsEndpointOutputSchemas.pixelsUpdate,
	},
	'publisherBlockLists.create': {
		input: MetaAdsEndpointInputSchemas.publisherBlockListsCreate,
		output: MetaAdsEndpointOutputSchemas.publisherBlockListsCreate,
	},
	'accounts.impactingAdStudiesList': {
		input: MetaAdsEndpointInputSchemas.accountsImpactingAdStudiesList,
		output: MetaAdsEndpointOutputSchemas.accountsImpactingAdStudiesList,
	},
	'accounts.adRulesLibraryList': {
		input: MetaAdsEndpointInputSchemas.accountsAdRulesLibraryList,
		output: MetaAdsEndpointOutputSchemas.accountsAdRulesLibraryList,
	},
	'accounts.adRulesLibraryCreate': {
		input: MetaAdsEndpointInputSchemas.accountsAdRulesLibraryCreate,
		output: MetaAdsEndpointOutputSchemas.accountsAdRulesLibraryCreate,
	},
	'accounts.activeAdRulesList': {
		input: MetaAdsEndpointInputSchemas.accountsActiveAdRulesList,
		output: MetaAdsEndpointOutputSchemas.accountsActiveAdRulesList,
	},
	'accounts.generatePreviews': {
		input: MetaAdsEndpointInputSchemas.accountsGeneratePreviews,
		output: MetaAdsEndpointOutputSchemas.accountsGeneratePreviews,
	},
	'accounts.broadTargetingCategoriesList': {
		input: MetaAdsEndpointInputSchemas.accountsBroadTargetingCategoriesList,
		output: MetaAdsEndpointOutputSchemas.accountsBroadTargetingCategoriesList,
	},
	'accounts.smartSuggestedAdsList': {
		input: MetaAdsEndpointInputSchemas.accountsSmartSuggestedAdsList,
		output: MetaAdsEndpointOutputSchemas.accountsSmartSuggestedAdsList,
	},
	'accounts.suggestedAdsList': {
		input: MetaAdsEndpointInputSchemas.accountsSuggestedAdsList,
		output: MetaAdsEndpointOutputSchemas.accountsSuggestedAdsList,
	},
	'accounts.placePageSetsCreate': {
		input: MetaAdsEndpointInputSchemas.accountsPlacePageSetsCreate,
		output: MetaAdsEndpointOutputSchemas.accountsPlacePageSetsCreate,
	},
	'accounts.reachEstimate': {
		input: MetaAdsEndpointInputSchemas.accountsReachEstimate,
		output: MetaAdsEndpointOutputSchemas.accountsReachEstimate,
	},
	'reachFrequencyPredictions.get': {
		input: MetaAdsEndpointInputSchemas.reachFrequencyPredictionsGet,
		output: MetaAdsEndpointOutputSchemas.reachFrequencyPredictionsGet,
	},
	'reachFrequencyPredictions.list': {
		input: MetaAdsEndpointInputSchemas.reachFrequencyPredictionsList,
		output: MetaAdsEndpointOutputSchemas.reachFrequencyPredictionsList,
	},
	'reachFrequencyPredictions.create': {
		input: MetaAdsEndpointInputSchemas.reachFrequencyPredictionsCreate,
		output: MetaAdsEndpointOutputSchemas.reachFrequencyPredictionsCreate,
	},
	'customConversions.create': {
		input: MetaAdsEndpointInputSchemas.customConversionsCreate,
		output: MetaAdsEndpointOutputSchemas.customConversionsCreate,
	},
	'labels.list': {
		input: MetaAdsEndpointInputSchemas.labelsList,
		output: MetaAdsEndpointOutputSchemas.labelsList,
	},
	'labels.get': {
		input: MetaAdsEndpointInputSchemas.labelsGet,
		output: MetaAdsEndpointOutputSchemas.labelsGet,
	},
	'labels.create': {
		input: MetaAdsEndpointInputSchemas.labelsCreate,
		output: MetaAdsEndpointOutputSchemas.labelsCreate,
	},
	'labels.update': {
		input: MetaAdsEndpointInputSchemas.labelsUpdate,
		output: MetaAdsEndpointOutputSchemas.labelsUpdate,
	},
	'labels.delete': {
		input: MetaAdsEndpointInputSchemas.labelsDelete,
		output: MetaAdsEndpointOutputSchemas.labelsDelete,
	},
	'labels.adsList': {
		input: MetaAdsEndpointInputSchemas.labelsAdsList,
		output: MetaAdsEndpointOutputSchemas.labelsAdsList,
	},
	'labels.adSetsList': {
		input: MetaAdsEndpointInputSchemas.labelsAdSetsList,
		output: MetaAdsEndpointOutputSchemas.labelsAdSetsList,
	},
	'labels.campaignsList': {
		input: MetaAdsEndpointInputSchemas.labelsCampaignsList,
		output: MetaAdsEndpointOutputSchemas.labelsCampaignsList,
	},
	'labels.creativesList': {
		input: MetaAdsEndpointInputSchemas.labelsCreativesList,
		output: MetaAdsEndpointOutputSchemas.labelsCreativesList,
	},
	'images.list': {
		input: MetaAdsEndpointInputSchemas.imagesList,
		output: MetaAdsEndpointOutputSchemas.imagesList,
	},
	'images.upload': {
		input: MetaAdsEndpointInputSchemas.imagesUpload,
		output: MetaAdsEndpointOutputSchemas.imagesUpload,
	},
	'images.delete': {
		input: MetaAdsEndpointInputSchemas.imagesDelete,
		output: MetaAdsEndpointOutputSchemas.imagesDelete,
	},
	'campaigns.list': {
		input: MetaAdsEndpointInputSchemas.campaignsList,
		output: MetaAdsEndpointOutputSchemas.campaignsList,
	},
	'campaigns.adSetsList': {
		input: MetaAdsEndpointInputSchemas.campaignsAdSetsList,
		output: MetaAdsEndpointOutputSchemas.campaignsAdSetsList,
	},
	'campaigns.adsList': {
		input: MetaAdsEndpointInputSchemas.campaignsAdsList,
		output: MetaAdsEndpointOutputSchemas.campaignsAdsList,
	},
	'campaigns.copiesList': {
		input: MetaAdsEndpointInputSchemas.campaignsCopiesList,
		output: MetaAdsEndpointOutputSchemas.campaignsCopiesList,
	},
	'campaigns.copy': {
		input: MetaAdsEndpointInputSchemas.campaignsCopy,
		output: MetaAdsEndpointOutputSchemas.campaignsCopy,
	},
	'campaigns.labelsAdd': {
		input: MetaAdsEndpointInputSchemas.campaignsLabelsAdd,
		output: MetaAdsEndpointOutputSchemas.campaignsLabelsAdd,
	},
	'campaigns.budgetSchedulesList': {
		input: MetaAdsEndpointInputSchemas.campaignsBudgetSchedulesList,
		output: MetaAdsEndpointOutputSchemas.campaignsBudgetSchedulesList,
	},
	'campaigns.budgetScheduleCreate': {
		input: MetaAdsEndpointInputSchemas.campaignsBudgetScheduleCreate,
		output: MetaAdsEndpointOutputSchemas.campaignsBudgetScheduleCreate,
	},
	'campaigns.adStudiesList': {
		input: MetaAdsEndpointInputSchemas.campaignsAdStudiesList,
		output: MetaAdsEndpointOutputSchemas.campaignsAdStudiesList,
	},
	'campaigns.adRulesGovernedList': {
		input: MetaAdsEndpointInputSchemas.campaignsAdRulesGovernedList,
		output: MetaAdsEndpointOutputSchemas.campaignsAdRulesGovernedList,
	},
	'highDemandPeriods.get': {
		input: MetaAdsEndpointInputSchemas.highDemandPeriodsGet,
		output: MetaAdsEndpointOutputSchemas.highDemandPeriodsGet,
	},
	'campaigns.get': {
		input: MetaAdsEndpointInputSchemas.campaignsGet,
		output: MetaAdsEndpointOutputSchemas.campaignsGet,
	},
	'campaigns.create': {
		input: MetaAdsEndpointInputSchemas.campaignsCreate,
		output: MetaAdsEndpointOutputSchemas.campaignsCreate,
	},
	'campaigns.update': {
		input: MetaAdsEndpointInputSchemas.campaignsUpdate,
		output: MetaAdsEndpointOutputSchemas.campaignsUpdate,
	},
	'campaigns.delete': {
		input: MetaAdsEndpointInputSchemas.campaignsDelete,
		output: MetaAdsEndpointOutputSchemas.campaignsDelete,
	},
	'adSets.list': {
		input: MetaAdsEndpointInputSchemas.adSetsList,
		output: MetaAdsEndpointOutputSchemas.adSetsList,
	},
	'adSets.adsList': {
		input: MetaAdsEndpointInputSchemas.adSetsAdsList,
		output: MetaAdsEndpointOutputSchemas.adSetsAdsList,
	},
	'adSets.adCreativesList': {
		input: MetaAdsEndpointInputSchemas.adSetsAdCreativesList,
		output: MetaAdsEndpointOutputSchemas.adSetsAdCreativesList,
	},
	'adSets.copiesList': {
		input: MetaAdsEndpointInputSchemas.adSetsCopiesList,
		output: MetaAdsEndpointOutputSchemas.adSetsCopiesList,
	},
	'adSets.copy': {
		input: MetaAdsEndpointInputSchemas.adSetsCopy,
		output: MetaAdsEndpointOutputSchemas.adSetsCopy,
	},
	'adSets.budgetSchedulesList': {
		input: MetaAdsEndpointInputSchemas.adSetsBudgetSchedulesList,
		output: MetaAdsEndpointOutputSchemas.adSetsBudgetSchedulesList,
	},
	'adSets.budgetScheduleCreate': {
		input: MetaAdsEndpointInputSchemas.adSetsBudgetScheduleCreate,
		output: MetaAdsEndpointOutputSchemas.adSetsBudgetScheduleCreate,
	},
	'adSets.activitiesList': {
		input: MetaAdsEndpointInputSchemas.adSetsActivitiesList,
		output: MetaAdsEndpointOutputSchemas.adSetsActivitiesList,
	},
	'adSets.adStudiesList': {
		input: MetaAdsEndpointInputSchemas.adSetsAdStudiesList,
		output: MetaAdsEndpointOutputSchemas.adSetsAdStudiesList,
	},
	'adSets.adRulesGovernedList': {
		input: MetaAdsEndpointInputSchemas.adSetsAdRulesGovernedList,
		output: MetaAdsEndpointOutputSchemas.adSetsAdRulesGovernedList,
	},
	'adSets.get': {
		input: MetaAdsEndpointInputSchemas.adSetsGet,
		output: MetaAdsEndpointOutputSchemas.adSetsGet,
	},
	'adSets.create': {
		input: MetaAdsEndpointInputSchemas.adSetsCreate,
		output: MetaAdsEndpointOutputSchemas.adSetsCreate,
	},
	'adSets.update': {
		input: MetaAdsEndpointInputSchemas.adSetsUpdate,
		output: MetaAdsEndpointOutputSchemas.adSetsUpdate,
	},
	'adSets.delete': {
		input: MetaAdsEndpointInputSchemas.adSetsDelete,
		output: MetaAdsEndpointOutputSchemas.adSetsDelete,
	},
	'ads.list': {
		input: MetaAdsEndpointInputSchemas.adsList,
		output: MetaAdsEndpointOutputSchemas.adsList,
	},
	'ads.adCreativesList': {
		input: MetaAdsEndpointInputSchemas.adsAdCreativesList,
		output: MetaAdsEndpointOutputSchemas.adsAdCreativesList,
	},
	'ads.adStudiesList': {
		input: MetaAdsEndpointInputSchemas.adsAdStudiesList,
		output: MetaAdsEndpointOutputSchemas.adsAdStudiesList,
	},
	'ads.adRulesGovernedList': {
		input: MetaAdsEndpointInputSchemas.adsAdRulesGovernedList,
		output: MetaAdsEndpointOutputSchemas.adsAdRulesGovernedList,
	},
	'ads.previewsList': {
		input: MetaAdsEndpointInputSchemas.adsPreviewsList,
		output: MetaAdsEndpointOutputSchemas.adsPreviewsList,
	},
	'ads.copiesList': {
		input: MetaAdsEndpointInputSchemas.adsCopiesList,
		output: MetaAdsEndpointOutputSchemas.adsCopiesList,
	},
	'ads.copy': {
		input: MetaAdsEndpointInputSchemas.adsCopy,
		output: MetaAdsEndpointOutputSchemas.adsCopy,
	},
	'ads.labelsAdd': {
		input: MetaAdsEndpointInputSchemas.adsLabelsAdd,
		output: MetaAdsEndpointOutputSchemas.adsLabelsAdd,
	},
	'ads.get': {
		input: MetaAdsEndpointInputSchemas.adsGet,
		output: MetaAdsEndpointOutputSchemas.adsGet,
	},
	'ads.create': {
		input: MetaAdsEndpointInputSchemas.adsCreate,
		output: MetaAdsEndpointOutputSchemas.adsCreate,
	},
	'ads.update': {
		input: MetaAdsEndpointInputSchemas.adsUpdate,
		output: MetaAdsEndpointOutputSchemas.adsUpdate,
	},
	'ads.delete': {
		input: MetaAdsEndpointInputSchemas.adsDelete,
		output: MetaAdsEndpointOutputSchemas.adsDelete,
	},
	'creatives.list': {
		input: MetaAdsEndpointInputSchemas.creativesList,
		output: MetaAdsEndpointOutputSchemas.creativesList,
	},
	'creatives.get': {
		input: MetaAdsEndpointInputSchemas.creativesGet,
		output: MetaAdsEndpointOutputSchemas.creativesGet,
	},
	'creatives.create': {
		input: MetaAdsEndpointInputSchemas.creativesCreate,
		output: MetaAdsEndpointOutputSchemas.creativesCreate,
	},
	'creatives.update': {
		input: MetaAdsEndpointInputSchemas.creativesUpdate,
		output: MetaAdsEndpointOutputSchemas.creativesUpdate,
	},
	'creatives.delete': {
		input: MetaAdsEndpointInputSchemas.creativesDelete,
		output: MetaAdsEndpointOutputSchemas.creativesDelete,
	},
	'creatives.labelsAdd': {
		input: MetaAdsEndpointInputSchemas.creativesLabelsAdd,
		output: MetaAdsEndpointOutputSchemas.creativesLabelsAdd,
	},
	'creatives.insightsList': {
		input: MetaAdsEndpointInputSchemas.creativesInsightsList,
		output: MetaAdsEndpointOutputSchemas.creativesInsightsList,
	},
	'creatives.previewsList': {
		input: MetaAdsEndpointInputSchemas.creativesPreviewsList,
		output: MetaAdsEndpointOutputSchemas.creativesPreviewsList,
	},
	'audiences.list': {
		input: MetaAdsEndpointInputSchemas.audiencesList,
		output: MetaAdsEndpointOutputSchemas.audiencesList,
	},
	'audiences.adsList': {
		input: MetaAdsEndpointInputSchemas.audiencesAdsList,
		output: MetaAdsEndpointOutputSchemas.audiencesAdsList,
	},
	'audiences.adAccountsList': {
		input: MetaAdsEndpointInputSchemas.audiencesAdAccountsList,
		output: MetaAdsEndpointOutputSchemas.audiencesAdAccountsList,
	},
	'audiences.get': {
		input: MetaAdsEndpointInputSchemas.audiencesGet,
		output: MetaAdsEndpointOutputSchemas.audiencesGet,
	},
	'audiences.create': {
		input: MetaAdsEndpointInputSchemas.audiencesCreate,
		output: MetaAdsEndpointOutputSchemas.audiencesCreate,
	},
	'audiences.acceptTerms': {
		input: MetaAdsEndpointInputSchemas.audiencesAcceptTerms,
		output: MetaAdsEndpointOutputSchemas.audiencesAcceptTerms,
	},
	'audiences.update': {
		input: MetaAdsEndpointInputSchemas.audiencesUpdate,
		output: MetaAdsEndpointOutputSchemas.audiencesUpdate,
	},
	'audiences.delete': {
		input: MetaAdsEndpointInputSchemas.audiencesDelete,
		output: MetaAdsEndpointOutputSchemas.audiencesDelete,
	},
	'audiences.sessionsList': {
		input: MetaAdsEndpointInputSchemas.audiencesSessionsList,
		output: MetaAdsEndpointOutputSchemas.audiencesSessionsList,
	},
	'audiences.usersAdd': {
		input: MetaAdsEndpointInputSchemas.audiencesUsersAdd,
		output: MetaAdsEndpointOutputSchemas.audiencesUsersAdd,
	},
	'audiences.usersRemove': {
		input: MetaAdsEndpointInputSchemas.audiencesUsersRemove,
		output: MetaAdsEndpointOutputSchemas.audiencesUsersRemove,
	},
	'audiences.usersReplace': {
		input: MetaAdsEndpointInputSchemas.audiencesUsersReplace,
		output: MetaAdsEndpointOutputSchemas.audiencesUsersReplace,
	},
	'audiences.adAccountsShare': {
		input: MetaAdsEndpointInputSchemas.audiencesAdAccountsShare,
		output: MetaAdsEndpointOutputSchemas.audiencesAdAccountsShare,
	},
	'audiences.adAccountsUnshare': {
		input: MetaAdsEndpointInputSchemas.audiencesAdAccountsUnshare,
		output: MetaAdsEndpointOutputSchemas.audiencesAdAccountsUnshare,
	},
	'studies.get': {
		input: MetaAdsEndpointInputSchemas.studiesGet,
		output: MetaAdsEndpointOutputSchemas.studiesGet,
	},
	'studies.create': {
		input: MetaAdsEndpointInputSchemas.studiesCreate,
		output: MetaAdsEndpointOutputSchemas.studiesCreate,
	},
	'studies.update': {
		input: MetaAdsEndpointInputSchemas.studiesUpdate,
		output: MetaAdsEndpointOutputSchemas.studiesUpdate,
	},
	'studies.relatedAccountsList': {
		input: MetaAdsEndpointInputSchemas.studiesRelatedAccountsList,
		output: MetaAdsEndpointOutputSchemas.studiesRelatedAccountsList,
	},
	'studies.viewersList': {
		input: MetaAdsEndpointInputSchemas.studiesViewersList,
		output: MetaAdsEndpointOutputSchemas.studiesViewersList,
	},
	'videos.delete': {
		input: MetaAdsEndpointInputSchemas.videosDelete,
		output: MetaAdsEndpointOutputSchemas.videosDelete,
	},
	'asyncCreatives.list': {
		input: MetaAdsEndpointInputSchemas.asyncCreativesList,
		output: MetaAdsEndpointOutputSchemas.asyncCreativesList,
	},
	'asyncCreatives.create': {
		input: MetaAdsEndpointInputSchemas.asyncCreativesCreate,
		output: MetaAdsEndpointOutputSchemas.asyncCreativesCreate,
	},
	'asyncRequestSets.list': {
		input: MetaAdsEndpointInputSchemas.asyncRequestSetsList,
		output: MetaAdsEndpointOutputSchemas.asyncRequestSetsList,
	},
	'asyncRequestSets.create': {
		input: MetaAdsEndpointInputSchemas.asyncRequestSetsCreate,
		output: MetaAdsEndpointOutputSchemas.asyncRequestSetsCreate,
	},
	'asyncRequestSets.get': {
		input: MetaAdsEndpointInputSchemas.asyncRequestSetsGet,
		output: MetaAdsEndpointOutputSchemas.asyncRequestSetsGet,
	},
	'asyncRequestSets.update': {
		input: MetaAdsEndpointInputSchemas.asyncRequestSetsUpdate,
		output: MetaAdsEndpointOutputSchemas.asyncRequestSetsUpdate,
	},
	'asyncRequestSets.cancel': {
		input: MetaAdsEndpointInputSchemas.asyncRequestSetsCancel,
		output: MetaAdsEndpointOutputSchemas.asyncRequestSetsCancel,
	},
	'asyncRequests.listForSet': {
		input: MetaAdsEndpointInputSchemas.asyncRequestsListForSet,
		output: MetaAdsEndpointOutputSchemas.asyncRequestsListForSet,
	},
	'asyncRequests.listForAdSet': {
		input: MetaAdsEndpointInputSchemas.asyncRequestsListForAdSet,
		output: MetaAdsEndpointOutputSchemas.asyncRequestsListForAdSet,
	},
	'asyncRequests.cancel': {
		input: MetaAdsEndpointInputSchemas.asyncRequestsCancel,
		output: MetaAdsEndpointOutputSchemas.asyncRequestsCancel,
	},
	'insights.list': {
		input: MetaAdsEndpointInputSchemas.insightsList,
		output: MetaAdsEndpointOutputSchemas.insightsList,
	},
	'insights.listForCampaign': {
		input: MetaAdsEndpointInputSchemas.insightsListForCampaign,
		output: MetaAdsEndpointOutputSchemas.insightsListForCampaign,
	},
	'insights.listForAdSet': {
		input: MetaAdsEndpointInputSchemas.insightsListForAdSet,
		output: MetaAdsEndpointOutputSchemas.insightsListForAdSet,
	},
	'insights.listForAd': {
		input: MetaAdsEndpointInputSchemas.insightsListForAd,
		output: MetaAdsEndpointOutputSchemas.insightsListForAd,
	},
	'insights.createAsync': {
		input: MetaAdsEndpointInputSchemas.insightsCreateAsync,
		output: MetaAdsEndpointOutputSchemas.insightsCreateAsync,
	},
	'insights.getAsyncReport': {
		input: MetaAdsEndpointInputSchemas.insightsGetAsyncReport,
		output: MetaAdsEndpointOutputSchemas.insightsGetAsyncReport,
	},
	'insights.getAsyncResults': {
		input: MetaAdsEndpointInputSchemas.insightsGetAsyncResults,
		output: MetaAdsEndpointOutputSchemas.insightsGetAsyncResults,
	},
	'insights.listFeatures': {
		input: MetaAdsEndpointInputSchemas.insightsListFeatures,
		output: MetaAdsEndpointOutputSchemas.insightsListFeatures,
	},
	'insights.listEnabledFeatures': {
		input: MetaAdsEndpointInputSchemas.insightsListEnabledFeatures,
		output: MetaAdsEndpointOutputSchemas.insightsListEnabledFeatures,
	},
	'insights.enableFeature': {
		input: MetaAdsEndpointInputSchemas.insightsEnableFeature,
		output: MetaAdsEndpointOutputSchemas.insightsEnableFeature,
	},
};

const defaultAuthType: AuthTypes = 'oauth_2';
const metaAdsEndpointMeta = {
	'accounts.list': {
		riskLevel: 'read',
		description: 'List ad accounts available to the access token',
	},
	'accounts.get': {
		riskLevel: 'read',
		description: 'Retrieve an ad account by ID',
	},
	'accounts.usersList': {
		riskLevel: 'read',
		description: 'List app-scoped users and task grants on an ad account',
	},
	'accounts.activitiesList': {
		riskLevel: 'read',
		description: 'Read recent account and ad object activity events',
	},
	'accounts.assignedUsersList': {
		riskLevel: 'read',
		description: 'List business and system users assigned to an ad account',
	},
	'accounts.assignUser': {
		riskLevel: 'destructive',
		description: 'Grant ad-account tasks to a business or system user',
	},
	'accounts.removeUser': {
		riskLevel: 'destructive',
		description: 'Revoke a business or system user assignment from an account',
	},
	'accounts.controlsCreate': {
		riskLevel: 'destructive',
		description: 'Set account-wide audience and placement controls',
	},
	'accounts.agenciesList': {
		riskLevel: 'read',
		description: 'List businesses associated with an ad account',
	},
	'accounts.agencyRemove': {
		riskLevel: 'destructive',
		description: 'Remove a business association from an ad account',
	},
	'accounts.subscribedAppUpdate': {
		riskLevel: 'write',
		description: 'Subscribe an application to an ad account',
	},
	'accounts.subscribedAppRemove': {
		riskLevel: 'write',
		description: 'Unsubscribe an application from an ad account',
	},
	'accounts.trackingCreate': {
		riskLevel: 'write',
		description: 'Add account-level tracking specifications',
	},
	'accounts.pixelsList': {
		riskLevel: 'read',
		description: 'List pixels accessible from an ad account',
	},
	'pixels.create': {
		riskLevel: 'destructive',
		description: 'Create a pixel measurement asset for an ad account',
	},
	'pixels.get': {
		riskLevel: 'read',
		description: 'Read documented scalar fields from an ads pixel',
	},
	'pixels.update': {
		riskLevel: 'destructive',
		description: 'Change pixel data-use, matching, or business-access settings',
	},
	'publisherBlockLists.create': {
		riskLevel: 'write',
		description:
			'Create a publisher block list without applying it to delivery',
	},
	'accounts.impactingAdStudiesList': {
		riskLevel: 'read',
		description: 'List ad studies affecting an account or its child objects',
	},
	'accounts.adRulesLibraryList': {
		riskLevel: 'read',
		description: 'List account ad rules without creating or changing rules',
	},
	'accounts.adRulesLibraryCreate': {
		riskLevel: 'destructive',
		description: 'Create a rule that can change ad delivery, budgets, or bids',
	},
	'accounts.activeAdRulesList': {
		riskLevel: 'read',
		description: 'List active rules for explicitly selected ad objects',
	},
	'accounts.generatePreviews': {
		riskLevel: 'read',
		description:
			'Generate an ad preview from a supported link-story creative spec',
	},
	'accounts.broadTargetingCategoriesList': {
		riskLevel: 'read',
		description: 'List documented broad-targeting categories for the account',
	},
	'accounts.smartSuggestedAdsList': {
		riskLevel: 'read',
		description: 'List smart ad suggestions for an account',
	},
	'accounts.suggestedAdsList': {
		riskLevel: 'read',
		description: 'List ad suggestions using documented account filters',
	},
	'accounts.placePageSetsCreate': {
		riskLevel: 'destructive',
		description: 'Create a place-page set from a published parent Page',
	},
	'accounts.reachEstimate': {
		riskLevel: 'read',
		description: 'Estimate an ad-account audience range for a targeting spec',
	},
	'reachFrequencyPredictions.get': {
		riskLevel: 'read',
		description:
			'Read documented scalar fields from a reach/frequency prediction',
	},
	'reachFrequencyPredictions.list': {
		riskLevel: 'read',
		description: 'List reach/frequency predictions with safe documented fields',
	},
	'reachFrequencyPredictions.create': {
		riskLevel: 'destructive',
		description:
			'Create a non-idempotent reach/frequency forecast or reservation',
	},
	'customConversions.create': {
		riskLevel: 'destructive',
		description: 'Create a measurement conversion definition for an ad account',
	},
	'labels.list': {
		riskLevel: 'read',
		description: 'List ad labels defined for an ad account',
	},
	'labels.get': {
		riskLevel: 'read',
		description: 'Read one ad label and its documented fields',
	},
	'labels.create': {
		riskLevel: 'write',
		description: 'Create a reusable label for ad objects',
	},
	'labels.update': {
		riskLevel: 'write',
		description: 'Rename a label shared by ad objects',
	},
	'labels.delete': {
		riskLevel: 'destructive',
		description: 'Delete an ad label from an account',
	},
	'labels.adsList': {
		riskLevel: 'read',
		description: 'List ads associated with an ad label',
	},
	'labels.adSetsList': {
		riskLevel: 'read',
		description: 'List ad sets associated with an ad label',
	},
	'labels.campaignsList': {
		riskLevel: 'read',
		description: 'List campaigns associated with an ad label',
	},
	'labels.creativesList': {
		riskLevel: 'read',
		description: 'List creatives associated with an ad label',
	},
	'images.list': {
		riskLevel: 'read',
		description: 'List images stored in an ad account library',
	},
	'images.upload': {
		riskLevel: 'destructive',
		description:
			'Upload a base64 image or copy an image into an ad account library',
	},
	'images.delete': {
		riskLevel: 'destructive',
		description: 'Dissociate an unused image from an ad account library',
	},
	'campaigns.list': {
		riskLevel: 'read',
		description: 'List campaigns for an ad account',
	},
	'campaigns.adSetsList': {
		riskLevel: 'read',
		description: 'List ad sets belonging to a campaign',
	},
	'campaigns.adsList': {
		riskLevel: 'read',
		description: 'List ads belonging to a campaign',
	},
	'campaigns.copiesList': {
		riskLevel: 'read',
		description: 'List copies of a campaign',
	},
	'campaigns.copy': {
		riskLevel: 'destructive',
		description: 'Create a paused, shallow copy of a campaign',
	},
	'campaigns.labelsAdd': {
		riskLevel: 'write',
		description: 'Associate documented ad labels with a campaign',
	},
	'campaigns.budgetSchedulesList': {
		riskLevel: 'read',
		description: 'List scheduled high-demand budget periods on a campaign',
	},
	'campaigns.budgetScheduleCreate': {
		riskLevel: 'destructive',
		description: 'Schedule a temporary campaign budget increase',
	},
	'campaigns.adStudiesList': {
		riskLevel: 'read',
		description: 'List ad studies associated with a campaign',
	},
	'campaigns.adRulesGovernedList': {
		riskLevel: 'read',
		description: 'List rules that govern a campaign',
	},
	'highDemandPeriods.get': {
		riskLevel: 'read',
		description: 'Read one documented high-demand budget period',
	},
	'campaigns.get': {
		riskLevel: 'read',
		description: 'Retrieve a campaign by ID',
	},
	'campaigns.create': {
		riskLevel: 'destructive',
		description: 'Create a campaign that can spend an ad account budget',
	},
	'campaigns.update': {
		riskLevel: 'destructive',
		description: 'Change campaign status or its budget and spend cap',
	},
	'campaigns.delete': {
		riskLevel: 'destructive',
		description: 'Delete a campaign and affect its delivery',
	},
	'adSets.list': {
		riskLevel: 'read',
		description: 'List ad sets in an ad account',
	},
	'adSets.adsList': {
		riskLevel: 'read',
		description: 'List ads belonging to an ad set',
	},
	'adSets.adCreativesList': {
		riskLevel: 'read',
		description: 'List creatives associated with an ad set',
	},
	'adSets.copiesList': {
		riskLevel: 'read',
		description: 'List copies of an ad set',
	},
	'adSets.copy': {
		riskLevel: 'destructive',
		description: 'Create a paused copy of an ad set',
	},
	'adSets.budgetSchedulesList': {
		riskLevel: 'read',
		description: 'List scheduled high-demand budget periods on an ad set',
	},
	'adSets.budgetScheduleCreate': {
		riskLevel: 'destructive',
		description: 'Schedule a temporary ad-set budget increase',
	},
	'adSets.activitiesList': {
		riskLevel: 'read',
		description: 'Read activity history for an ad set',
	},
	'adSets.adStudiesList': {
		riskLevel: 'read',
		description: 'List ad studies associated with an ad set',
	},
	'adSets.adRulesGovernedList': {
		riskLevel: 'read',
		description: 'List rules that govern an ad set',
	},
	'adSets.get': { riskLevel: 'read', description: 'Retrieve an ad set by ID' },
	'adSets.create': {
		riskLevel: 'destructive',
		description: 'Create a targeted ad set with a budget and schedule',
	},
	'adSets.update': {
		riskLevel: 'destructive',
		description: 'Change an ad set status, budget, or end time',
	},
	'adSets.delete': {
		riskLevel: 'destructive',
		description: 'Delete an ad set and affect ad delivery',
	},
	'ads.list': { riskLevel: 'read', description: 'List ads in an ad account' },
	'ads.adCreativesList': {
		riskLevel: 'read',
		description: 'List creatives attached to an ad',
	},
	'ads.adStudiesList': {
		riskLevel: 'read',
		description: 'List ad studies associated with an ad',
	},
	'ads.adRulesGovernedList': {
		riskLevel: 'read',
		description: 'List rules that govern an ad',
	},
	'ads.previewsList': {
		riskLevel: 'read',
		description: 'Generate an ad preview in a supported placement format',
	},
	'ads.copiesList': {
		riskLevel: 'read',
		description: 'List copies of an ad',
	},
	'ads.copy': {
		riskLevel: 'destructive',
		description: 'Create a paused copy of an ad',
	},
	'ads.labelsAdd': {
		riskLevel: 'write',
		description: 'Associate documented ad labels with an ad',
	},
	'ads.get': { riskLevel: 'read', description: 'Retrieve an ad by ID' },
	'ads.create': {
		riskLevel: 'destructive',
		description: 'Create an ad that may be delivered after review',
	},
	'ads.update': {
		riskLevel: 'destructive',
		description: 'Change an ad name or delivery status',
	},
	'ads.delete': { riskLevel: 'destructive', description: 'Delete an ad' },
	'creatives.list': {
		riskLevel: 'read',
		description: 'List ad creatives stored in an ad account',
	},
	'creatives.get': {
		riskLevel: 'read',
		description: 'Retrieve an ad creative by ID',
	},
	'creatives.create': {
		riskLevel: 'destructive',
		description:
			'Create a creative from an existing Page post or an inline object_story_spec',
	},
	'creatives.update': {
		riskLevel: 'destructive',
		description: 'Change an ad creative name',
	},
	'creatives.delete': {
		riskLevel: 'destructive',
		description: 'Delete an ad creative',
	},
	'creatives.labelsAdd': {
		riskLevel: 'write',
		description: 'Associate documented ad labels with a creative',
	},
	'creatives.insightsList': {
		riskLevel: 'read',
		description: 'Read the documented quality insight for a creative',
	},
	'creatives.previewsList': {
		riskLevel: 'read',
		description: 'Generate a preview for a creative in a supported placement',
	},
	'audiences.list': {
		riskLevel: 'read',
		description: 'List custom audiences for an ad account',
	},
	'audiences.adsList': {
		riskLevel: 'read',
		description: 'List ads using a custom audience',
	},
	'audiences.adAccountsList': {
		riskLevel: 'read',
		description: 'List ad accounts with access to a custom audience',
	},
	'audiences.get': {
		riskLevel: 'read',
		description: 'Retrieve a custom audience by ID',
	},
	'audiences.create': {
		riskLevel: 'destructive',
		description: 'Create a custom audience object',
	},
	'audiences.acceptTerms': {
		riskLevel: 'destructive',
		description: 'Accept custom-audience terms for an account or business',
	},
	'audiences.update': {
		riskLevel: 'destructive',
		description: 'Change custom audience metadata',
	},
	'audiences.delete': {
		riskLevel: 'destructive',
		description: 'Permanently delete a custom audience',
	},
	'audiences.sessionsList': {
		riskLevel: 'read',
		description: 'List upload sessions for a custom audience',
	},
	'audiences.usersAdd': {
		riskLevel: 'destructive',
		description:
			'Upload a batch of SHA-256 customer hashes to a custom audience',
	},
	'audiences.usersRemove': {
		riskLevel: 'destructive',
		description:
			'Remove a batch of SHA-256 customer hashes from a custom audience',
	},
	'audiences.usersReplace': {
		riskLevel: 'destructive',
		description:
			'Replace a custom audience membership batch with hashed records',
	},
	'audiences.adAccountsShare': {
		riskLevel: 'destructive',
		description: 'Share a custom audience with specified ad accounts',
	},
	'audiences.adAccountsUnshare': {
		riskLevel: 'destructive',
		description: 'Revoke ad account access to a shared custom audience',
	},
	'studies.get': {
		riskLevel: 'read',
		description: 'Retrieve a documented ad study by ID',
	},
	'studies.create': {
		riskLevel: 'destructive',
		description:
			'Create a split test with ad-set cells and specified treatment percentages',
	},
	'studies.update': {
		riskLevel: 'destructive',
		description: 'Change documented ad study metadata or extend its end time',
	},
	'studies.relatedAccountsList': {
		riskLevel: 'read',
		description: 'List ad accounts related to an ad study',
	},
	'studies.viewersList': {
		riskLevel: 'read',
		description: 'List users who can view an ad study',
	},
	'videos.delete': {
		riskLevel: 'destructive',
		description: 'Dissociate a video from an ad account library',
	},
	'asyncCreatives.list': {
		riskLevel: 'read',
		description: 'List asynchronous ad creative jobs for an account',
	},
	'asyncCreatives.create': {
		riskLevel: 'write',
		description: 'Start a non-idempotent asynchronous creative creation job',
	},
	'asyncRequestSets.list': {
		riskLevel: 'read',
		description: 'List asynchronous ad request sets for an account',
	},
	'asyncRequestSets.create': {
		riskLevel: 'destructive',
		description:
			'Start ad creation requests that may lead to delivery and spend',
	},
	'asyncRequestSets.get': {
		riskLevel: 'read',
		description: 'Read safe status and count fields for an async request set',
	},
	'asyncRequestSets.update': {
		riskLevel: 'write',
		description: 'Rename an asynchronous ad request set',
	},
	'asyncRequestSets.cancel': {
		riskLevel: 'destructive',
		description: 'Cancel an asynchronous request set before processing',
	},
	'asyncRequests.listForSet': {
		riskLevel: 'read',
		description: 'List safe status fields for requests in a set',
	},
	'asyncRequests.listForAdSet': {
		riskLevel: 'read',
		description:
			'List safe status fields for requests associated with an ad set',
	},
	'asyncRequests.cancel': {
		riskLevel: 'destructive',
		description: 'Cancel one asynchronous request before processing',
	},
	'insights.list': {
		riskLevel: 'read',
		description:
			'Read paginated, filtered and broken-down ad reporting metrics',
	},
	'insights.listForCampaign': {
		riskLevel: 'read',
		description: 'Read paginated reporting metrics for one campaign',
	},
	'insights.listForAdSet': {
		riskLevel: 'read',
		description: 'Read paginated reporting metrics for one ad set',
	},
	'insights.listForAd': {
		riskLevel: 'read',
		description: 'Read paginated reporting metrics for one ad',
	},
	'insights.createAsync': {
		riskLevel: 'write',
		description: 'Start a non-idempotent asynchronous Ads Insights report job',
	},
	'insights.getAsyncReport': {
		riskLevel: 'read',
		description:
			'Read the status and completion details of an Insights report job',
	},
	'insights.getAsyncResults': {
		riskLevel: 'read',
		description: 'Read paginated results for a completed Insights report job',
	},
	'insights.listFeatures': {
		riskLevel: 'read',
		description: 'List breakdown features available to an ad account',
	},
	'insights.listEnabledFeatures': {
		riskLevel: 'read',
		description: 'List breakdown features enabled for an ad account',
	},
	'insights.enableFeature': {
		riskLevel: 'destructive',
		description: 'Permanently enable an Insights feature for an ad account',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof metaAdsEndpointsNested>;

export const metaAdsAuthConfig = {
	oauth_2: { account: ['tenant_external_id'] as const },
} as const satisfies PluginAuthConfig;

export type BaseMetaAdsPlugin<T extends MetaAdsPluginOptions> = CorsairPlugin<
	'metaads',
	typeof MetaAdsSchema,
	typeof metaAdsEndpointsNested,
	Record<string, never>,
	T,
	typeof defaultAuthType
>;
export type InternalMetaAdsPlugin = BaseMetaAdsPlugin<MetaAdsPluginOptions>;
export type ExternalMetaAdsPlugin<T extends MetaAdsPluginOptions> =
	BaseMetaAdsPlugin<T>;

export function metaads<const T extends MetaAdsPluginOptions>(
	incomingOptions: MetaAdsPluginOptions & T = {} as MetaAdsPluginOptions & T,
): ExternalMetaAdsPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'metaads',
		authConfig: metaAdsAuthConfig,
		oauthConfig: {
			providerName: 'Meta Ads',
			authUrl: 'https://www.facebook.com/v27.0/dialog/oauth',
			tokenUrl: 'https://graph.facebook.com/v27.0/oauth/access_token',
			scopes: ['ads_read', 'ads_management'],
		},
		schema: MetaAdsSchema,
		options,
		hooks: options.hooks,
		endpoints: metaAdsEndpointsNested,
		webhooks: {},
		endpointMeta: metaAdsEndpointMeta,
		endpointSchemas: metaAdsEndpointSchemas,
		errorHandlers: { ...errorHandlers, ...options.errorHandlers },
		keyBuilder: async (ctx: MetaAdsKeyBuilderContext, source) => {
			if (source !== 'endpoint') return '';
			if (options.key) return options.key;
			if (ctx.authType !== 'oauth_2') {
				throw new AuthMissingError('metaads', 'oauth_2');
			}
			const token = await ctx.keys.get_access_token();
			if (!token) throw new AuthMissingError('metaads', 'oauth_2');
			return token;
		},
	} satisfies InternalMetaAdsPlugin;
}

export type {
	MetaAdsEndpointInputs,
	MetaAdsEndpointOutputs,
} from './endpoints/types';
