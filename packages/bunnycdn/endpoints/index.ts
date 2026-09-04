import * as Containers from './containers';
import * as DnsZone from './dns-zone';
import * as Platform from './platform';
import * as PullZone from './pull-zone';
import * as Purge from './purge';
import * as Shield from './shield';
import * as StorageZone from './storage-zone';

export const PullZoneEndpoints = {
	list: PullZone.list,
	get: PullZone.get,
	create: PullZone.create,
	update: PullZone.update,
	remove: PullZone.remove,
	purgeCache: PullZone.purgeCache,
	checkAvailability: PullZone.checkAvailability,
	addAllowedReferrer: PullZone.addAllowedReferrer,
	removeAllowedReferrer: PullZone.removeAllowedReferrer,
	addBlockedIp: PullZone.addBlockedIp,
	removeBlockedIp: PullZone.removeBlockedIp,
	addBlockedReferrer: PullZone.addBlockedReferrer,
	removeBlockedReferrer: PullZone.removeBlockedReferrer,
	resetSecurityKey: PullZone.resetSecurityKey,
	setForceSSL: PullZone.setForceSSL,
	edgeRuleUpsert: PullZone.edgeRuleUpsert,
	edgeRuleDelete: PullZone.edgeRuleDelete,
	edgeRuleSetEnabled: PullZone.edgeRuleSetEnabled,
	optimizerStatistics: PullZone.optimizerStatistics,
	originShieldQueueStatistics: PullZone.originShieldQueueStatistics,
	safeHopStatistics: PullZone.safeHopStatistics,
};

export const PurgeEndpoints = {
	url: Purge.url,
};

export const StorageZoneEndpoints = {
	list: StorageZone.list,
	get: StorageZone.get,
	create: StorageZone.create,
	update: StorageZone.update,
	remove: StorageZone.remove,
	checkAvailability: StorageZone.checkAvailability,
};

export const DnsZoneEndpoints = {
	list: DnsZone.list,
	get: DnsZone.get,
	createRecord: DnsZone.createRecord,
	updateRecord: DnsZone.updateRecord,
	deleteRecord: DnsZone.deleteRecord,
	checkAvailability: DnsZone.checkAvailability,
};

export const BillingEndpoints = {
	summary: Platform.billingSummary,
};

export const StatisticsEndpoints = {
	get: Platform.statistics,
	countries: Platform.countries,
	regions: Platform.regions,
};

export const SearchEndpoints = {
	global: Platform.globalSearch,
};

export const ApiKeysEndpoints = {
	list: Platform.apiKeysList,
};

export const UserEndpoints = {
	auditLog: Platform.userAuditLog,
};

export const VideoLibraryEndpoints = {
	list: Platform.videoLibrariesList,
	languages: Platform.languages,
};

export const EdgeScriptsEndpoints = {
	list: Platform.edgeScriptsList,
};

export const StreamEndpoints = {
	oembed: Platform.oembed,
};

export const ShieldEndpoints = {
	zonesList: Shield.zonesList,
	zoneGet: Shield.zoneGet,
	zoneGetByPullZone: Shield.zoneGetByPullZone,
	zonesPullZoneMapping: Shield.zonesPullZoneMapping,
	zoneUpdate: Shield.zoneUpdate,
	rateLimitsList: Shield.rateLimitsList,
	rateLimitGet: Shield.rateLimitGet,
	rateLimitCreate: Shield.rateLimitCreate,
	rateLimitUpdate: Shield.rateLimitUpdate,
	rateLimitDelete: Shield.rateLimitDelete,
	metricsOverview: Shield.metricsOverview,
	metricsOverviewDetailed: Shield.metricsOverviewDetailed,
	metricsRateLimit: Shield.metricsRateLimit,
	metricsRateLimits: Shield.metricsRateLimits,
	metricsBotDetection: Shield.metricsBotDetection,
	metricsUploadScanning: Shield.metricsUploadScanning,
	metricsWafRule: Shield.metricsWafRule,
	eventLogs: Shield.eventLogs,
	promoState: Shield.promoState,
	ddosEnums: Shield.ddosEnums,
	botDetectionGet: Shield.botDetectionGet,
	botDetectionUpdate: Shield.botDetectionUpdate,
	uploadScanningGet: Shield.uploadScanningGet,
	uploadScanningUpdate: Shield.uploadScanningUpdate,
	accessListsList: Shield.accessListsList,
	accessListGet: Shield.accessListGet,
	accessListCreate: Shield.accessListCreate,
	accessListUpdate: Shield.accessListUpdate,
	accessListConfigUpdate: Shield.accessListConfigUpdate,
	accessListEnums: Shield.accessListEnums,
	wafCustomRulesList: Shield.wafCustomRulesList,
	wafCustomRuleGet: Shield.wafCustomRuleGet,
	wafEngineConfig: Shield.wafEngineConfig,
	wafEnums: Shield.wafEnums,
	wafProfiles: Shield.wafProfiles,
	wafRulesPlanSegmentation: Shield.wafRulesPlanSegmentation,
	wafRulesReviewTriggered: Shield.wafRulesReviewTriggered,
	wafRulesByZone: Shield.wafRulesByZone,
	wafRulesReviewTriggeredPost: Shield.wafRulesReviewTriggeredPost,
};

export const ContainersEndpoints = {
	applicationsList: Containers.applicationsList,
	nodesList: Containers.nodesList,
	regionsList: Containers.regionsList,
	optimalBaseRegion: Containers.optimalBaseRegion,
	userLimits: Containers.userLimits,
	registriesList: Containers.registriesList,
	registryDelete: Containers.registryDelete,
	imageTags: Containers.imageTags,
	imageDigest: Containers.imageDigest,
	configSuggestions: Containers.configSuggestions,
	publicImagesSearch: Containers.publicImagesSearch,
	volumesList: Containers.volumesList,
};

export * from './types';
