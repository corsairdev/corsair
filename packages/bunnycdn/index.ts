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
import {
	ApiKeysEndpoints,
	BillingEndpoints,
	ContainersEndpoints,
	DnsZoneEndpoints,
	EdgeScriptsEndpoints,
	PullZoneEndpoints,
	PurgeEndpoints,
	SearchEndpoints,
	ShieldEndpoints,
	StatisticsEndpoints,
	StorageZoneEndpoints,
	StreamEndpoints,
	UserEndpoints,
	VideoLibraryEndpoints,
} from './endpoints';
import type {
	BunnycdnEndpointInputs,
	BunnycdnEndpointOutputs,
} from './endpoints/types';
import {
	BunnycdnEndpointInputSchemas,
	BunnycdnEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { BunnycdnSchema } from './schema';

export type BunnycdnPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalBunnycdnPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof bunnycdnEndpointsNested>;
};

export type BunnycdnContext = CorsairPluginContext<
	typeof BunnycdnSchema,
	BunnycdnPluginOptions
>;

export type BunnycdnKeyBuilderContext =
	KeyBuilderContext<BunnycdnPluginOptions>;

export type BunnycdnBoundEndpoints = BindEndpoints<
	typeof bunnycdnEndpointsNested
>;

type BunnycdnEndpoint<K extends keyof BunnycdnEndpointOutputs> =
	CorsairEndpoint<
		BunnycdnContext,
		BunnycdnEndpointInputs[K],
		BunnycdnEndpointOutputs[K]
	>;

export type BunnycdnEndpoints = {
	pullZoneList: BunnycdnEndpoint<'pullZoneList'>;
	pullZoneGet: BunnycdnEndpoint<'pullZoneGet'>;
	pullZoneCreate: BunnycdnEndpoint<'pullZoneCreate'>;
	pullZoneUpdate: BunnycdnEndpoint<'pullZoneUpdate'>;
	pullZoneDelete: BunnycdnEndpoint<'pullZoneDelete'>;
	pullZonePurge: BunnycdnEndpoint<'pullZonePurge'>;
	pullZoneAvailability: BunnycdnEndpoint<'pullZoneAvailability'>;
	pullZoneReferrer: BunnycdnEndpoint<'pullZoneReferrer'>;
	pullZoneBlockedIp: BunnycdnEndpoint<'pullZoneBlockedIp'>;
	pullZoneSecurityKey: BunnycdnEndpoint<'pullZoneSecurityKey'>;
	pullZoneForceSSL: BunnycdnEndpoint<'pullZoneForceSSL'>;
	edgeRuleUpsert: BunnycdnEndpoint<'edgeRuleUpsert'>;
	edgeRuleDelete: BunnycdnEndpoint<'edgeRuleDelete'>;
	edgeRuleSetEnabled: BunnycdnEndpoint<'edgeRuleSetEnabled'>;
	pullZoneDateRange: BunnycdnEndpoint<'pullZoneDateRange'>;
	purgeUrl: BunnycdnEndpoint<'purgeUrl'>;
	storageZoneList: BunnycdnEndpoint<'storageZoneList'>;
	storageZoneGet: BunnycdnEndpoint<'storageZoneGet'>;
	storageZoneCreate: BunnycdnEndpoint<'storageZoneCreate'>;
	storageZoneUpdate: BunnycdnEndpoint<'storageZoneUpdate'>;
	storageZoneDelete: BunnycdnEndpoint<'storageZoneDelete'>;
	storageZoneAvailability: BunnycdnEndpoint<'storageZoneAvailability'>;
	dnsZoneList: BunnycdnEndpoint<'dnsZoneList'>;
	dnsZoneGet: BunnycdnEndpoint<'dnsZoneGet'>;
	dnsRecordCreate: BunnycdnEndpoint<'dnsRecordCreate'>;
	dnsRecordUpdate: BunnycdnEndpoint<'dnsRecordUpdate'>;
	dnsRecordDelete: BunnycdnEndpoint<'dnsRecordDelete'>;
	dnsZoneAvailability: BunnycdnEndpoint<'dnsZoneAvailability'>;
	billingSummary: BunnycdnEndpoint<'billingSummary'>;
	statistics: BunnycdnEndpoint<'statistics'>;
	countryList: BunnycdnEndpoint<'countryList'>;
	regionList: BunnycdnEndpoint<'regionList'>;
	globalSearch: BunnycdnEndpoint<'globalSearch'>;
	apiKeysList: BunnycdnEndpoint<'apiKeysList'>;
	userAuditLog: BunnycdnEndpoint<'userAuditLog'>;
	videoLibrariesList: BunnycdnEndpoint<'videoLibrariesList'>;
	languages: BunnycdnEndpoint<'languages'>;
	edgeScriptsList: BunnycdnEndpoint<'edgeScriptsList'>;
	oembed: BunnycdnEndpoint<'oembed'>;
	shieldPage: BunnycdnEndpoint<'shieldPage'>;
	shieldZoneId: BunnycdnEndpoint<'shieldZoneId'>;
	shieldZoneByPullZone: BunnycdnEndpoint<'shieldZoneByPullZone'>;
	shieldZoneUpdate: BunnycdnEndpoint<'shieldZoneUpdate'>;
	shieldRateLimitsList: BunnycdnEndpoint<'shieldRateLimitsList'>;
	shieldRateLimitId: BunnycdnEndpoint<'shieldRateLimitId'>;
	shieldRateLimitDelete: BunnycdnEndpoint<'shieldRateLimitDelete'>;
	shieldRateLimitCreate: BunnycdnEndpoint<'shieldRateLimitCreate'>;
	shieldRateLimitUpdate: BunnycdnEndpoint<'shieldRateLimitUpdate'>;
	shieldMetricsDetailed: BunnycdnEndpoint<'shieldMetricsDetailed'>;
	shieldWafRuleMetrics: BunnycdnEndpoint<'shieldWafRuleMetrics'>;
	shieldEventLogs: BunnycdnEndpoint<'shieldEventLogs'>;
	shieldBotDetectionUpdate: BunnycdnEndpoint<'shieldBotDetectionUpdate'>;
	shieldUploadScanningUpdate: BunnycdnEndpoint<'shieldUploadScanningUpdate'>;
	shieldAccessListId: BunnycdnEndpoint<'shieldAccessListId'>;
	shieldAccessListCreate: BunnycdnEndpoint<'shieldAccessListCreate'>;
	shieldAccessListUpdate: BunnycdnEndpoint<'shieldAccessListUpdate'>;
	shieldAccessListConfigUpdate: BunnycdnEndpoint<'shieldAccessListConfigUpdate'>;
	shieldWafCustomRulesList: BunnycdnEndpoint<'shieldWafCustomRulesList'>;
	shieldWafCustomRuleId: BunnycdnEndpoint<'shieldWafCustomRuleId'>;
	shieldWafRuleReview: BunnycdnEndpoint<'shieldWafRuleReview'>;
	containersCursor: BunnycdnEndpoint<'containersCursor'>;
	containerImageRef: BunnycdnEndpoint<'containerImageRef'>;
	containerImageTags: BunnycdnEndpoint<'containerImageTags'>;
	containerPublicImagesSearch: BunnycdnEndpoint<'containerPublicImagesSearch'>;
	containerRegistryDelete: BunnycdnEndpoint<'containerRegistryDelete'>;
	containerVolumesList: BunnycdnEndpoint<'containerVolumesList'>;
	optimalBaseRegion: BunnycdnEndpoint<'optimalBaseRegion'>;
	emptyInput: BunnycdnEndpoint<'emptyInput'>;
};

const bunnycdnEndpointsNested = {
	pullZone: {
		list: PullZoneEndpoints.list,
		get: PullZoneEndpoints.get,
		create: PullZoneEndpoints.create,
		update: PullZoneEndpoints.update,
		remove: PullZoneEndpoints.remove,
		purgeCache: PullZoneEndpoints.purgeCache,
		checkAvailability: PullZoneEndpoints.checkAvailability,
		addAllowedReferrer: PullZoneEndpoints.addAllowedReferrer,
		removeAllowedReferrer: PullZoneEndpoints.removeAllowedReferrer,
		addBlockedIp: PullZoneEndpoints.addBlockedIp,
		removeBlockedIp: PullZoneEndpoints.removeBlockedIp,
		addBlockedReferrer: PullZoneEndpoints.addBlockedReferrer,
		removeBlockedReferrer: PullZoneEndpoints.removeBlockedReferrer,
		resetSecurityKey: PullZoneEndpoints.resetSecurityKey,
		setForceSSL: PullZoneEndpoints.setForceSSL,
		edgeRuleUpsert: PullZoneEndpoints.edgeRuleUpsert,
		edgeRuleDelete: PullZoneEndpoints.edgeRuleDelete,
		edgeRuleSetEnabled: PullZoneEndpoints.edgeRuleSetEnabled,
		optimizerStatistics: PullZoneEndpoints.optimizerStatistics,
		originShieldQueueStatistics: PullZoneEndpoints.originShieldQueueStatistics,
		safeHopStatistics: PullZoneEndpoints.safeHopStatistics,
	},
	purge: {
		url: PurgeEndpoints.url,
	},
	storageZone: {
		list: StorageZoneEndpoints.list,
		get: StorageZoneEndpoints.get,
		create: StorageZoneEndpoints.create,
		update: StorageZoneEndpoints.update,
		remove: StorageZoneEndpoints.remove,
		checkAvailability: StorageZoneEndpoints.checkAvailability,
	},
	dnsZone: {
		list: DnsZoneEndpoints.list,
		get: DnsZoneEndpoints.get,
		createRecord: DnsZoneEndpoints.createRecord,
		updateRecord: DnsZoneEndpoints.updateRecord,
		deleteRecord: DnsZoneEndpoints.deleteRecord,
		checkAvailability: DnsZoneEndpoints.checkAvailability,
	},
	billing: {
		summary: BillingEndpoints.summary,
	},
	statistics: {
		get: StatisticsEndpoints.get,
		countries: StatisticsEndpoints.countries,
		regions: StatisticsEndpoints.regions,
	},
	search: {
		global: SearchEndpoints.global,
	},
	apiKeys: {
		list: ApiKeysEndpoints.list,
	},
	user: {
		auditLog: UserEndpoints.auditLog,
	},
	videoLibrary: {
		list: VideoLibraryEndpoints.list,
		languages: VideoLibraryEndpoints.languages,
	},
	edgeScripts: {
		list: EdgeScriptsEndpoints.list,
	},
	stream: {
		oembed: StreamEndpoints.oembed,
	},
	shield: {
		zonesList: ShieldEndpoints.zonesList,
		zoneGet: ShieldEndpoints.zoneGet,
		zoneGetByPullZone: ShieldEndpoints.zoneGetByPullZone,
		zonesPullZoneMapping: ShieldEndpoints.zonesPullZoneMapping,
		zoneUpdate: ShieldEndpoints.zoneUpdate,
		rateLimitsList: ShieldEndpoints.rateLimitsList,
		rateLimitGet: ShieldEndpoints.rateLimitGet,
		rateLimitCreate: ShieldEndpoints.rateLimitCreate,
		rateLimitUpdate: ShieldEndpoints.rateLimitUpdate,
		rateLimitDelete: ShieldEndpoints.rateLimitDelete,
		metricsOverview: ShieldEndpoints.metricsOverview,
		metricsOverviewDetailed: ShieldEndpoints.metricsOverviewDetailed,
		metricsRateLimit: ShieldEndpoints.metricsRateLimit,
		metricsRateLimits: ShieldEndpoints.metricsRateLimits,
		metricsBotDetection: ShieldEndpoints.metricsBotDetection,
		metricsUploadScanning: ShieldEndpoints.metricsUploadScanning,
		metricsWafRule: ShieldEndpoints.metricsWafRule,
		eventLogs: ShieldEndpoints.eventLogs,
		promoState: ShieldEndpoints.promoState,
		ddosEnums: ShieldEndpoints.ddosEnums,
		botDetectionGet: ShieldEndpoints.botDetectionGet,
		botDetectionUpdate: ShieldEndpoints.botDetectionUpdate,
		uploadScanningGet: ShieldEndpoints.uploadScanningGet,
		uploadScanningUpdate: ShieldEndpoints.uploadScanningUpdate,
		accessListsList: ShieldEndpoints.accessListsList,
		accessListGet: ShieldEndpoints.accessListGet,
		accessListCreate: ShieldEndpoints.accessListCreate,
		accessListUpdate: ShieldEndpoints.accessListUpdate,
		accessListConfigUpdate: ShieldEndpoints.accessListConfigUpdate,
		accessListEnums: ShieldEndpoints.accessListEnums,
		wafCustomRulesList: ShieldEndpoints.wafCustomRulesList,
		wafCustomRuleGet: ShieldEndpoints.wafCustomRuleGet,
		wafEngineConfig: ShieldEndpoints.wafEngineConfig,
		wafEnums: ShieldEndpoints.wafEnums,
		wafProfiles: ShieldEndpoints.wafProfiles,
		wafRulesPlanSegmentation: ShieldEndpoints.wafRulesPlanSegmentation,
		wafRulesReviewTriggered: ShieldEndpoints.wafRulesReviewTriggered,
		wafRulesByZone: ShieldEndpoints.wafRulesByZone,
		wafRulesReviewTriggeredPost: ShieldEndpoints.wafRulesReviewTriggeredPost,
	},
	containers: {
		applicationsList: ContainersEndpoints.applicationsList,
		nodesList: ContainersEndpoints.nodesList,
		regionsList: ContainersEndpoints.regionsList,
		optimalBaseRegion: ContainersEndpoints.optimalBaseRegion,
		userLimits: ContainersEndpoints.userLimits,
		registriesList: ContainersEndpoints.registriesList,
		registryDelete: ContainersEndpoints.registryDelete,
		imageTags: ContainersEndpoints.imageTags,
		imageDigest: ContainersEndpoints.imageDigest,
		configSuggestions: ContainersEndpoints.configSuggestions,
		publicImagesSearch: ContainersEndpoints.publicImagesSearch,
		volumesList: ContainersEndpoints.volumesList,
	},
} as const;

export const bunnycdnEndpointSchemas = {
	'pullZone.list': {
		input: BunnycdnEndpointInputSchemas.pullZoneList,
		output: BunnycdnEndpointOutputSchemas.pullZoneList,
	},
	'pullZone.get': {
		input: BunnycdnEndpointInputSchemas.pullZoneGet,
		output: BunnycdnEndpointOutputSchemas.pullZoneGet,
	},
	'pullZone.create': {
		input: BunnycdnEndpointInputSchemas.pullZoneCreate,
		output: BunnycdnEndpointOutputSchemas.pullZoneCreate,
	},
	'pullZone.update': {
		input: BunnycdnEndpointInputSchemas.pullZoneUpdate,
		output: BunnycdnEndpointOutputSchemas.pullZoneUpdate,
	},
	'pullZone.remove': {
		input: BunnycdnEndpointInputSchemas.pullZoneDelete,
		output: BunnycdnEndpointOutputSchemas.pullZoneDelete,
	},
	'pullZone.purgeCache': {
		input: BunnycdnEndpointInputSchemas.pullZonePurge,
		output: BunnycdnEndpointOutputSchemas.pullZonePurge,
	},
	'pullZone.checkAvailability': {
		input: BunnycdnEndpointInputSchemas.pullZoneAvailability,
		output: BunnycdnEndpointOutputSchemas.pullZoneAvailability,
	},
	'pullZone.addAllowedReferrer': {
		input: BunnycdnEndpointInputSchemas.pullZoneReferrer,
		output: BunnycdnEndpointOutputSchemas.pullZoneReferrer,
	},
	'pullZone.removeAllowedReferrer': {
		input: BunnycdnEndpointInputSchemas.pullZoneReferrer,
		output: BunnycdnEndpointOutputSchemas.pullZoneReferrer,
	},
	'pullZone.addBlockedIp': {
		input: BunnycdnEndpointInputSchemas.pullZoneBlockedIp,
		output: BunnycdnEndpointOutputSchemas.pullZoneBlockedIp,
	},
	'pullZone.removeBlockedIp': {
		input: BunnycdnEndpointInputSchemas.pullZoneBlockedIp,
		output: BunnycdnEndpointOutputSchemas.pullZoneBlockedIp,
	},
	'pullZone.addBlockedReferrer': {
		input: BunnycdnEndpointInputSchemas.pullZoneReferrer,
		output: BunnycdnEndpointOutputSchemas.pullZoneReferrer,
	},
	'pullZone.removeBlockedReferrer': {
		input: BunnycdnEndpointInputSchemas.pullZoneReferrer,
		output: BunnycdnEndpointOutputSchemas.pullZoneReferrer,
	},
	'pullZone.resetSecurityKey': {
		input: BunnycdnEndpointInputSchemas.pullZoneSecurityKey,
		output: BunnycdnEndpointOutputSchemas.pullZoneSecurityKey,
	},
	'pullZone.setForceSSL': {
		input: BunnycdnEndpointInputSchemas.pullZoneForceSSL,
		output: BunnycdnEndpointOutputSchemas.pullZoneForceSSL,
	},
	'pullZone.edgeRuleUpsert': {
		input: BunnycdnEndpointInputSchemas.edgeRuleUpsert,
		output: BunnycdnEndpointOutputSchemas.edgeRuleUpsert,
	},
	'pullZone.edgeRuleDelete': {
		input: BunnycdnEndpointInputSchemas.edgeRuleDelete,
		output: BunnycdnEndpointOutputSchemas.edgeRuleDelete,
	},
	'pullZone.edgeRuleSetEnabled': {
		input: BunnycdnEndpointInputSchemas.edgeRuleSetEnabled,
		output: BunnycdnEndpointOutputSchemas.edgeRuleSetEnabled,
	},
	'pullZone.optimizerStatistics': {
		input: BunnycdnEndpointInputSchemas.pullZoneDateRange,
		output: BunnycdnEndpointOutputSchemas.pullZoneDateRange,
	},
	'pullZone.originShieldQueueStatistics': {
		input: BunnycdnEndpointInputSchemas.pullZoneDateRange,
		output: BunnycdnEndpointOutputSchemas.pullZoneDateRange,
	},
	'pullZone.safeHopStatistics': {
		input: BunnycdnEndpointInputSchemas.pullZoneDateRange,
		output: BunnycdnEndpointOutputSchemas.pullZoneDateRange,
	},
	'purge.url': {
		input: BunnycdnEndpointInputSchemas.purgeUrl,
		output: BunnycdnEndpointOutputSchemas.purgeUrl,
	},
	'storageZone.list': {
		input: BunnycdnEndpointInputSchemas.storageZoneList,
		output: BunnycdnEndpointOutputSchemas.storageZoneList,
	},
	'storageZone.get': {
		input: BunnycdnEndpointInputSchemas.storageZoneGet,
		output: BunnycdnEndpointOutputSchemas.storageZoneGet,
	},
	'storageZone.create': {
		input: BunnycdnEndpointInputSchemas.storageZoneCreate,
		output: BunnycdnEndpointOutputSchemas.storageZoneCreate,
	},
	'storageZone.update': {
		input: BunnycdnEndpointInputSchemas.storageZoneUpdate,
		output: BunnycdnEndpointOutputSchemas.storageZoneUpdate,
	},
	'storageZone.remove': {
		input: BunnycdnEndpointInputSchemas.storageZoneDelete,
		output: BunnycdnEndpointOutputSchemas.storageZoneDelete,
	},
	'storageZone.checkAvailability': {
		input: BunnycdnEndpointInputSchemas.storageZoneAvailability,
		output: BunnycdnEndpointOutputSchemas.storageZoneAvailability,
	},
	'dnsZone.list': {
		input: BunnycdnEndpointInputSchemas.dnsZoneList,
		output: BunnycdnEndpointOutputSchemas.dnsZoneList,
	},
	'dnsZone.get': {
		input: BunnycdnEndpointInputSchemas.dnsZoneGet,
		output: BunnycdnEndpointOutputSchemas.dnsZoneGet,
	},
	'dnsZone.createRecord': {
		input: BunnycdnEndpointInputSchemas.dnsRecordCreate,
		output: BunnycdnEndpointOutputSchemas.dnsRecordCreate,
	},
	'dnsZone.updateRecord': {
		input: BunnycdnEndpointInputSchemas.dnsRecordUpdate,
		output: BunnycdnEndpointOutputSchemas.dnsRecordUpdate,
	},
	'dnsZone.deleteRecord': {
		input: BunnycdnEndpointInputSchemas.dnsRecordDelete,
		output: BunnycdnEndpointOutputSchemas.dnsRecordDelete,
	},
	'dnsZone.checkAvailability': {
		input: BunnycdnEndpointInputSchemas.dnsZoneAvailability,
		output: BunnycdnEndpointOutputSchemas.dnsZoneAvailability,
	},
	'billing.summary': {
		input: BunnycdnEndpointInputSchemas.billingSummary,
		output: BunnycdnEndpointOutputSchemas.billingSummary,
	},
	'statistics.get': {
		input: BunnycdnEndpointInputSchemas.statistics,
		output: BunnycdnEndpointOutputSchemas.statistics,
	},
	'statistics.countries': {
		input: BunnycdnEndpointInputSchemas.countryList,
		output: BunnycdnEndpointOutputSchemas.countryList,
	},
	'statistics.regions': {
		input: BunnycdnEndpointInputSchemas.regionList,
		output: BunnycdnEndpointOutputSchemas.regionList,
	},
	'search.global': {
		input: BunnycdnEndpointInputSchemas.globalSearch,
		output: BunnycdnEndpointOutputSchemas.globalSearch,
	},
	'apiKeys.list': {
		input: BunnycdnEndpointInputSchemas.apiKeysList,
		output: BunnycdnEndpointOutputSchemas.apiKeysList,
	},
	'user.auditLog': {
		input: BunnycdnEndpointInputSchemas.userAuditLog,
		output: BunnycdnEndpointOutputSchemas.userAuditLog,
	},
	'videoLibrary.list': {
		input: BunnycdnEndpointInputSchemas.videoLibrariesList,
		output: BunnycdnEndpointOutputSchemas.videoLibrariesList,
	},
	'videoLibrary.languages': {
		input: BunnycdnEndpointInputSchemas.languages,
		output: BunnycdnEndpointOutputSchemas.languages,
	},
	'edgeScripts.list': {
		input: BunnycdnEndpointInputSchemas.edgeScriptsList,
		output: BunnycdnEndpointOutputSchemas.edgeScriptsList,
	},
	'stream.oembed': {
		input: BunnycdnEndpointInputSchemas.oembed,
		output: BunnycdnEndpointOutputSchemas.oembed,
	},
	'shield.zonesList': {
		input: BunnycdnEndpointInputSchemas.shieldPage,
		output: BunnycdnEndpointOutputSchemas.shieldPage,
	},
	'shield.zoneGet': {
		input: BunnycdnEndpointInputSchemas.shieldZoneId,
		output: BunnycdnEndpointOutputSchemas.shieldZoneId,
	},
	'shield.zoneGetByPullZone': {
		input: BunnycdnEndpointInputSchemas.shieldZoneByPullZone,
		output: BunnycdnEndpointOutputSchemas.shieldZoneByPullZone,
	},
	'shield.zonesPullZoneMapping': {
		input: BunnycdnEndpointInputSchemas.emptyInput,
		output: BunnycdnEndpointOutputSchemas.emptyInput,
	},
	'shield.zoneUpdate': {
		input: BunnycdnEndpointInputSchemas.shieldZoneUpdate,
		output: BunnycdnEndpointOutputSchemas.shieldZoneUpdate,
	},
	'shield.rateLimitsList': {
		input: BunnycdnEndpointInputSchemas.shieldRateLimitsList,
		output: BunnycdnEndpointOutputSchemas.shieldRateLimitsList,
	},
	'shield.rateLimitGet': {
		input: BunnycdnEndpointInputSchemas.shieldRateLimitId,
		output: BunnycdnEndpointOutputSchemas.shieldRateLimitId,
	},
	'shield.rateLimitCreate': {
		input: BunnycdnEndpointInputSchemas.shieldRateLimitCreate,
		output: BunnycdnEndpointOutputSchemas.shieldRateLimitCreate,
	},
	'shield.rateLimitUpdate': {
		input: BunnycdnEndpointInputSchemas.shieldRateLimitUpdate,
		output: BunnycdnEndpointOutputSchemas.shieldRateLimitUpdate,
	},
	'shield.rateLimitDelete': {
		input: BunnycdnEndpointInputSchemas.shieldRateLimitDelete,
		output: BunnycdnEndpointOutputSchemas.shieldRateLimitDelete,
	},
	'shield.metricsOverview': {
		input: BunnycdnEndpointInputSchemas.shieldZoneId,
		output: BunnycdnEndpointOutputSchemas.shieldMetricsDetailed,
	},
	'shield.metricsOverviewDetailed': {
		input: BunnycdnEndpointInputSchemas.shieldMetricsDetailed,
		output: BunnycdnEndpointOutputSchemas.shieldMetricsDetailed,
	},
	'shield.metricsRateLimit': {
		input: BunnycdnEndpointInputSchemas.shieldRateLimitId,
		output: BunnycdnEndpointOutputSchemas.shieldMetricsDetailed,
	},
	'shield.metricsRateLimits': {
		input: BunnycdnEndpointInputSchemas.shieldZoneId,
		output: BunnycdnEndpointOutputSchemas.shieldMetricsDetailed,
	},
	'shield.metricsBotDetection': {
		input: BunnycdnEndpointInputSchemas.shieldZoneId,
		output: BunnycdnEndpointOutputSchemas.shieldMetricsDetailed,
	},
	'shield.metricsUploadScanning': {
		input: BunnycdnEndpointInputSchemas.shieldZoneId,
		output: BunnycdnEndpointOutputSchemas.shieldMetricsDetailed,
	},
	'shield.metricsWafRule': {
		input: BunnycdnEndpointInputSchemas.shieldWafRuleMetrics,
		output: BunnycdnEndpointOutputSchemas.shieldWafRuleMetrics,
	},
	'shield.eventLogs': {
		input: BunnycdnEndpointInputSchemas.shieldEventLogs,
		output: BunnycdnEndpointOutputSchemas.shieldEventLogs,
	},
	'shield.promoState': {
		input: BunnycdnEndpointInputSchemas.emptyInput,
		output: BunnycdnEndpointOutputSchemas.emptyInput,
	},
	'shield.ddosEnums': {
		input: BunnycdnEndpointInputSchemas.emptyInput,
		output: BunnycdnEndpointOutputSchemas.emptyInput,
	},
	'shield.botDetectionGet': {
		input: BunnycdnEndpointInputSchemas.shieldZoneId,
		output: BunnycdnEndpointOutputSchemas.shieldMetricsDetailed,
	},
	'shield.botDetectionUpdate': {
		input: BunnycdnEndpointInputSchemas.shieldBotDetectionUpdate,
		output: BunnycdnEndpointOutputSchemas.shieldBotDetectionUpdate,
	},
	'shield.uploadScanningGet': {
		input: BunnycdnEndpointInputSchemas.shieldZoneId,
		output: BunnycdnEndpointOutputSchemas.shieldMetricsDetailed,
	},
	'shield.uploadScanningUpdate': {
		input: BunnycdnEndpointInputSchemas.shieldUploadScanningUpdate,
		output: BunnycdnEndpointOutputSchemas.shieldUploadScanningUpdate,
	},
	'shield.accessListsList': {
		input: BunnycdnEndpointInputSchemas.shieldZoneId,
		output: BunnycdnEndpointOutputSchemas.shieldMetricsDetailed,
	},
	'shield.accessListGet': {
		input: BunnycdnEndpointInputSchemas.shieldAccessListId,
		output: BunnycdnEndpointOutputSchemas.shieldAccessListId,
	},
	'shield.accessListCreate': {
		input: BunnycdnEndpointInputSchemas.shieldAccessListCreate,
		output: BunnycdnEndpointOutputSchemas.shieldAccessListCreate,
	},
	'shield.accessListUpdate': {
		input: BunnycdnEndpointInputSchemas.shieldAccessListUpdate,
		output: BunnycdnEndpointOutputSchemas.shieldAccessListUpdate,
	},
	'shield.accessListConfigUpdate': {
		input: BunnycdnEndpointInputSchemas.shieldAccessListConfigUpdate,
		output: BunnycdnEndpointOutputSchemas.shieldAccessListConfigUpdate,
	},
	'shield.accessListEnums': {
		input: BunnycdnEndpointInputSchemas.shieldZoneId,
		output: BunnycdnEndpointOutputSchemas.shieldMetricsDetailed,
	},
	'shield.wafCustomRulesList': {
		input: BunnycdnEndpointInputSchemas.shieldWafCustomRulesList,
		output: BunnycdnEndpointOutputSchemas.shieldWafCustomRulesList,
	},
	'shield.wafCustomRuleGet': {
		input: BunnycdnEndpointInputSchemas.shieldWafCustomRuleId,
		output: BunnycdnEndpointOutputSchemas.shieldWafCustomRuleId,
	},
	'shield.wafEngineConfig': {
		input: BunnycdnEndpointInputSchemas.emptyInput,
		output: BunnycdnEndpointOutputSchemas.emptyInput,
	},
	'shield.wafEnums': {
		input: BunnycdnEndpointInputSchemas.emptyInput,
		output: BunnycdnEndpointOutputSchemas.emptyInput,
	},
	'shield.wafProfiles': {
		input: BunnycdnEndpointInputSchemas.emptyInput,
		output: BunnycdnEndpointOutputSchemas.emptyInput,
	},
	'shield.wafRulesPlanSegmentation': {
		input: BunnycdnEndpointInputSchemas.emptyInput,
		output: BunnycdnEndpointOutputSchemas.emptyInput,
	},
	'shield.wafRulesReviewTriggered': {
		input: BunnycdnEndpointInputSchemas.shieldZoneId,
		output: BunnycdnEndpointOutputSchemas.shieldWafRuleReview,
	},
	'shield.wafRulesByZone': {
		input: BunnycdnEndpointInputSchemas.shieldZoneId,
		output: BunnycdnEndpointOutputSchemas.shieldWafRuleReview,
	},
	'shield.wafRulesReviewTriggeredPost': {
		input: BunnycdnEndpointInputSchemas.shieldWafRuleReview,
		output: BunnycdnEndpointOutputSchemas.shieldWafRuleReview,
	},
	'containers.applicationsList': {
		input: BunnycdnEndpointInputSchemas.containersCursor,
		output: BunnycdnEndpointOutputSchemas.containersCursor,
	},
	'containers.nodesList': {
		input: BunnycdnEndpointInputSchemas.containersCursor,
		output: BunnycdnEndpointOutputSchemas.containersCursor,
	},
	'containers.regionsList': {
		input: BunnycdnEndpointInputSchemas.containersCursor,
		output: BunnycdnEndpointOutputSchemas.containersCursor,
	},
	'containers.optimalBaseRegion': {
		input: BunnycdnEndpointInputSchemas.optimalBaseRegion,
		output: BunnycdnEndpointOutputSchemas.optimalBaseRegion,
	},
	'containers.userLimits': {
		input: BunnycdnEndpointInputSchemas.emptyInput,
		output: BunnycdnEndpointOutputSchemas.emptyInput,
	},
	'containers.registriesList': {
		input: BunnycdnEndpointInputSchemas.emptyInput,
		output: BunnycdnEndpointOutputSchemas.emptyInput,
	},
	'containers.registryDelete': {
		input: BunnycdnEndpointInputSchemas.containerRegistryDelete,
		output: BunnycdnEndpointOutputSchemas.containerRegistryDelete,
	},
	'containers.imageTags': {
		input: BunnycdnEndpointInputSchemas.containerImageTags,
		output: BunnycdnEndpointOutputSchemas.containerImageTags,
	},
	'containers.imageDigest': {
		input: BunnycdnEndpointInputSchemas.containerImageRef,
		output: BunnycdnEndpointOutputSchemas.containerImageRef,
	},
	'containers.configSuggestions': {
		input: BunnycdnEndpointInputSchemas.containerImageRef,
		output: BunnycdnEndpointOutputSchemas.containerImageRef,
	},
	'containers.publicImagesSearch': {
		input: BunnycdnEndpointInputSchemas.containerPublicImagesSearch,
		output: BunnycdnEndpointOutputSchemas.containerPublicImagesSearch,
	},
	'containers.volumesList': {
		input: BunnycdnEndpointInputSchemas.containerVolumesList,
		output: BunnycdnEndpointOutputSchemas.containerVolumesList,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof bunnycdnEndpointsNested
>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const bunnycdnEndpointMeta = {
	'pullZone.list': {
		riskLevel: 'read',
		description: 'List pull zones with pagination and search',
	},
	'pullZone.get': {
		riskLevel: 'read',
		description: 'Get details of a specific pull zone by ID',
	},
	'pullZone.create': {
		riskLevel: 'write',
		description: 'Create a new pull zone',
	},
	'pullZone.update': {
		riskLevel: 'write',
		description: 'Update settings for a specific pull zone',
	},
	'pullZone.remove': {
		riskLevel: 'destructive',
		description: 'Delete a specific pull zone by ID',
	},
	'pullZone.purgeCache': {
		riskLevel: 'write',
		description:
			'Purge cached content for a pull zone, optionally by cache tag',
	},
	'pullZone.checkAvailability': {
		riskLevel: 'read',
		description: 'Check whether a pull zone name is available',
	},
	'pullZone.addAllowedReferrer': {
		riskLevel: 'write',
		description: 'Add a hostname to the allowed referer list',
	},
	'pullZone.removeAllowedReferrer': {
		riskLevel: 'write',
		description: 'Remove a hostname from the allowed referer list',
	},
	'pullZone.addBlockedIp': {
		riskLevel: 'write',
		description: 'Add an IP address to the blocked list',
	},
	'pullZone.removeBlockedIp': {
		riskLevel: 'write',
		description: 'Remove an IP address from the blocked list',
	},
	'pullZone.addBlockedReferrer': {
		riskLevel: 'write',
		description: 'Add a blocked referer to a pull zone',
	},
	'pullZone.removeBlockedReferrer': {
		riskLevel: 'write',
		description: 'Remove a blocked referer from a pull zone',
	},
	'pullZone.resetSecurityKey': {
		riskLevel: 'write',
		description: 'Reset the URL token security key for a pull zone',
	},
	'pullZone.setForceSSL': {
		riskLevel: 'write',
		description: 'Enable or disable Force SSL on a pull zone hostname',
	},
	'pullZone.edgeRuleUpsert': {
		riskLevel: 'write',
		description: 'Add or update an edge rule on a pull zone',
	},
	'pullZone.edgeRuleDelete': {
		riskLevel: 'destructive',
		description: 'Delete an edge rule from a pull zone',
	},
	'pullZone.edgeRuleSetEnabled': {
		riskLevel: 'write',
		description: 'Enable or disable an edge rule without deleting it',
	},
	'pullZone.optimizerStatistics': {
		riskLevel: 'read',
		description: 'Retrieve optimizer statistics for a pull zone',
	},
	'pullZone.originShieldQueueStatistics': {
		riskLevel: 'read',
		description: 'Retrieve origin shield queue statistics for a pull zone',
	},
	'pullZone.safeHopStatistics': {
		riskLevel: 'read',
		description: 'Retrieve SafeHop statistics for a pull zone',
	},
	'purge.url': {
		riskLevel: 'write',
		description: 'Purge a single URL from cache across pull zones',
	},
	'storageZone.list': {
		riskLevel: 'read',
		description: 'List all storage zones',
	},
	'storageZone.get': {
		riskLevel: 'read',
		description: 'Get details of a specific storage zone',
	},
	'storageZone.create': {
		riskLevel: 'write',
		description: 'Create a new storage zone',
	},
	'storageZone.update': {
		riskLevel: 'write',
		description: 'Update settings for a specific storage zone',
	},
	'storageZone.remove': {
		riskLevel: 'destructive',
		description: 'Delete a storage zone and all of its data',
		irreversible: true,
	},
	'storageZone.checkAvailability': {
		riskLevel: 'read',
		description: 'Check whether a storage zone name is available',
	},
	'dnsZone.list': {
		riskLevel: 'read',
		description: 'List all DNS zones',
	},
	'dnsZone.get': {
		riskLevel: 'read',
		description: 'Get details of a specific DNS zone',
	},
	'dnsZone.createRecord': {
		riskLevel: 'write',
		description: 'Create a new DNS record in a DNS zone',
	},
	'dnsZone.updateRecord': {
		riskLevel: 'write',
		description: 'Update an existing DNS record',
	},
	'dnsZone.deleteRecord': {
		riskLevel: 'destructive',
		description: 'Delete a DNS record',
	},
	'dnsZone.checkAvailability': {
		riskLevel: 'read',
		description: 'Check whether a DNS zone name is available',
	},
	'billing.summary': {
		riskLevel: 'read',
		description: 'Retrieve the billing summary for the account',
	},
	'statistics.get': {
		riskLevel: 'read',
		description: 'Retrieve CDN bandwidth and request statistics',
	},
	'statistics.countries': {
		riskLevel: 'read',
		description: 'List countries supported by BunnyCDN',
	},
	'statistics.regions': {
		riskLevel: 'read',
		description: 'List BunnyCDN regions with pricing info',
	},
	'search.global': {
		riskLevel: 'read',
		description:
			'Global search across pull zones, storage zones, DNS zones and more',
	},
	'apiKeys.list': {
		riskLevel: 'read',
		description: 'List API keys on the account',
	},
	'user.auditLog': {
		riskLevel: 'read',
		description: 'Retrieve user audit log entries for a date',
	},
	'videoLibrary.list': {
		riskLevel: 'read',
		description: 'List all video libraries',
	},
	'videoLibrary.languages': {
		riskLevel: 'read',
		description: 'List languages supported by video libraries',
	},
	'edgeScripts.list': {
		riskLevel: 'read',
		description: 'List all edge scripts',
	},
	'stream.oembed': {
		riskLevel: 'read',
		description: 'Retrieve oEmbed metadata for a video embed',
	},
	'shield.zonesList': {
		riskLevel: 'read',
		description: 'List all shield zones',
	},
	'shield.zoneGet': {
		riskLevel: 'read',
		description: 'Get a shield zone configuration by ID',
	},
	'shield.zoneGetByPullZone': {
		riskLevel: 'read',
		description: 'Get the shield zone configuration for a pull zone',
	},
	'shield.zonesPullZoneMapping': {
		riskLevel: 'read',
		description: 'Get the mapping between shield zones and pull zones',
	},
	'shield.zoneUpdate': {
		riskLevel: 'write',
		description: 'Update a shield zone configuration',
	},
	'shield.rateLimitsList': {
		riskLevel: 'read',
		description: 'List rate limit rules for a shield zone',
	},
	'shield.rateLimitGet': {
		riskLevel: 'read',
		description: 'Get a shield rate limit rule by ID',
	},
	'shield.rateLimitCreate': {
		riskLevel: 'write',
		description: 'Create a shield rate limit rule',
	},
	'shield.rateLimitUpdate': {
		riskLevel: 'write',
		description: 'Update a shield rate limit rule',
	},
	'shield.rateLimitDelete': {
		riskLevel: 'destructive',
		description: 'Delete a shield rate limit rule',
	},
	'shield.metricsOverview': {
		riskLevel: 'read',
		description: 'Get the security metrics overview for a shield zone',
	},
	'shield.metricsOverviewDetailed': {
		riskLevel: 'read',
		description:
			'Get detailed security metrics for a shield zone over a time range',
	},
	'shield.metricsRateLimit': {
		riskLevel: 'read',
		description: 'Get metrics for a specific shield rate limit',
	},
	'shield.metricsRateLimits': {
		riskLevel: 'read',
		description: 'Get aggregated rate limit metrics for a shield zone',
	},
	'shield.metricsBotDetection': {
		riskLevel: 'read',
		description: 'Get bot detection metrics for a shield zone',
	},
	'shield.metricsUploadScanning': {
		riskLevel: 'read',
		description: 'Get upload scanning metrics for a shield zone',
	},
	'shield.metricsWafRule': {
		riskLevel: 'read',
		description: 'Get metrics for a specific WAF rule',
	},
	'shield.eventLogs': {
		riskLevel: 'read',
		description:
			'Get shield event logs for a zone and date with continuation token',
	},
	'shield.promoState': {
		riskLevel: 'read',
		description: 'Get the shield promotional state for the account',
	},
	'shield.ddosEnums': {
		riskLevel: 'read',
		description: 'List available Shield DDoS configuration values',
	},
	'shield.botDetectionGet': {
		riskLevel: 'read',
		description: 'Get the bot detection configuration for a shield zone',
	},
	'shield.botDetectionUpdate': {
		riskLevel: 'write',
		description: 'Update the bot detection configuration for a shield zone',
	},
	'shield.uploadScanningGet': {
		riskLevel: 'read',
		description: 'Get the upload scanning configuration for a shield zone',
	},
	'shield.uploadScanningUpdate': {
		riskLevel: 'write',
		description: 'Update the upload scanning configuration for a shield zone',
	},
	'shield.accessListsList': {
		riskLevel: 'read',
		description: 'List access lists for a shield zone',
	},
	'shield.accessListGet': {
		riskLevel: 'read',
		description: 'Get a custom access list by ID',
	},
	'shield.accessListCreate': {
		riskLevel: 'write',
		description: 'Create a custom access list in a shield zone',
	},
	'shield.accessListUpdate': {
		riskLevel: 'write',
		description: 'Update a custom access list in a shield zone',
	},
	'shield.accessListConfigUpdate': {
		riskLevel: 'write',
		description: 'Update an access list configuration action or enabled state',
	},
	'shield.accessListEnums': {
		riskLevel: 'read',
		description: 'List available access list configuration values',
	},
	'shield.wafCustomRulesList': {
		riskLevel: 'read',
		description: 'List custom WAF rules for a shield zone',
	},
	'shield.wafCustomRuleGet': {
		riskLevel: 'read',
		description: 'Get a custom WAF rule by ID',
	},
	'shield.wafEngineConfig': {
		riskLevel: 'read',
		description: 'Get the Shield WAF engine configuration',
	},
	'shield.wafEnums': {
		riskLevel: 'read',
		description: 'List available Shield WAF configuration values',
	},
	'shield.wafProfiles': {
		riskLevel: 'read',
		description: 'List available WAF security profiles',
	},
	'shield.wafRulesPlanSegmentation': {
		riskLevel: 'read',
		description: 'List WAF rules segmented by subscription plan',
	},
	'shield.wafRulesReviewTriggered': {
		riskLevel: 'read',
		description: 'List triggered WAF rules awaiting review',
	},
	'shield.wafRulesByZone': {
		riskLevel: 'read',
		description: 'List WAF rules for a shield zone',
	},
	'shield.wafRulesReviewTriggeredPost': {
		riskLevel: 'write',
		description: 'Apply an action to a triggered WAF rule',
	},
	'containers.applicationsList': {
		riskLevel: 'read',
		description: 'List Magic Container applications',
	},
	'containers.nodesList': {
		riskLevel: 'read',
		description: 'List Magic Container nodes',
	},
	'containers.regionsList': {
		riskLevel: 'read',
		description: 'List Magic Container regions',
	},
	'containers.optimalBaseRegion': {
		riskLevel: 'read',
		description: 'Get the optimal base region for Magic Containers',
	},
	'containers.userLimits': {
		riskLevel: 'read',
		description: 'Get Magic Container limits for the account',
	},
	'containers.registriesList': {
		riskLevel: 'read',
		description: 'List container registries',
	},
	'containers.registryDelete': {
		riskLevel: 'destructive',
		description: 'Delete a container registry',
	},
	'containers.imageTags': {
		riskLevel: 'read',
		description: 'List tags for a container image',
	},
	'containers.imageDigest': {
		riskLevel: 'read',
		description: 'Get the digest of a container image',
	},
	'containers.configSuggestions': {
		riskLevel: 'read',
		description:
			'Get deployment configuration suggestions for a container image',
	},
	'containers.publicImagesSearch': {
		riskLevel: 'read',
		description: 'Search public container images by prefix',
	},
	'containers.volumesList': {
		riskLevel: 'read',
		description: 'List volumes for a Magic Container application',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof bunnycdnEndpointsNested>;

export const bunnycdnAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseBunnycdnPlugin<T extends BunnycdnPluginOptions> = CorsairPlugin<
	'bunnycdn',
	typeof BunnycdnSchema,
	typeof bunnycdnEndpointsNested,
	{},
	T,
	typeof defaultAuthType
>;

export type InternalBunnycdnPlugin = BaseBunnycdnPlugin<BunnycdnPluginOptions>;

export type ExternalBunnycdnPlugin<T extends BunnycdnPluginOptions> =
	BaseBunnycdnPlugin<T>;

export function bunnycdn<const T extends BunnycdnPluginOptions>(
	incomingOptions: BunnycdnPluginOptions & T = {} as BunnycdnPluginOptions & T,
): ExternalBunnycdnPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'bunnycdn',
		authConfig: bunnycdnAuthConfig,
		schema: BunnycdnSchema,
		options: options,
		hooks: options.hooks,
		endpoints: bunnycdnEndpointsNested,
		webhooks: {},
		endpointMeta: bunnycdnEndpointMeta,
		endpointSchemas: bunnycdnEndpointSchemas,
		pluginWebhookMatcher: undefined,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: BunnycdnKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				return res ?? '';
			}

			return '';
		},
	} satisfies InternalBunnycdnPlugin;
}

export type {
	BunnycdnEndpointInputs,
	BunnycdnEndpointOutputs,
	PullZone,
	PullZoneGetInput,
	PullZoneListInput,
} from './endpoints/types';
