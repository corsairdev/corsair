import { z } from 'zod';
import {
	DnsRecordDetailsSchema,
	PullZoneAddDetailsSchema,
	PullZoneSettingsDetailsSchema,
	RateLimitRuleConfigDetailsSchema,
	ShieldZoneRequestDetailsSchema,
	StorageZoneAddDetailsSchema,
	StorageZoneSettingsDetailsSchema,
} from './detail-schemas';

// ---------------------------------------------------------------------------
// Shared
// ---------------------------------------------------------------------------

/** Returned by endpoints whose API responds with 204 No Content. */
export const SuccessSchema = z.object({
	success: z.literal(true),
});

export type Success = z.infer<typeof SuccessSchema>;

// ---------------------------------------------------------------------------
// Pull Zone
// Docs: https://bunny.net/docs/api-reference/core/pull-zone/list-pull-zones
// ---------------------------------------------------------------------------

const PullZoneHostnameSchema = z.looseObject({
	Id: z.number().optional(),
	Value: z.string().nullable().optional(),
	ForceSSL: z.boolean().optional(),
	HasCertificate: z.boolean().optional(),
});

const PullZoneSchema = z.looseObject({
	Id: z.number(),
	Name: z.string().nullable().optional(),
	OriginUrl: z.string().nullable().optional(),
	Enabled: z.boolean().optional(),
	Suspended: z.boolean().optional(),
	Hostnames: z.array(PullZoneHostnameSchema).nullable().optional(),
	StorageZoneId: z.number().optional(),
	MonthlyBandwidthUsed: z.number().optional(),
	MonthlyCharges: z.number().optional(),
});

export type PullZone = z.infer<typeof PullZoneSchema>;

const PullZoneListInputSchema = z.object({
	page: z.number().int().min(0).optional(),
	perPage: z.number().int().min(5).max(1000).optional(),
	search: z.string().optional(),
	includeCertificate: z.boolean().optional(),
});

export type PullZoneListInput = z.infer<typeof PullZoneListInputSchema>;

const PaginatedPullZoneListSchema = z.looseObject({
	Items: z.array(PullZoneSchema),
	CurrentPage: z.number().optional(),
	TotalItems: z.number().optional(),
	HasMoreItems: z.boolean().optional(),
});

const PullZoneListOutputSchema = z.union([
	z.array(PullZoneSchema),
	PaginatedPullZoneListSchema,
]);

const PullZoneGetInputSchema = z.object({
	id: z.number(),
	includeCertificate: z.boolean().optional(),
});

export type PullZoneGetInput = z.infer<typeof PullZoneGetInputSchema>;

const PullZoneCreateInputSchema = z.object({
	name: z.string().min(1),
	originUrl: z.string().optional(),
	type: z.number().int().optional(),
	settings: PullZoneAddDetailsSchema.optional(),
});

export type PullZoneCreateInput = z.infer<typeof PullZoneCreateInputSchema>;

const PullZoneUpdateInputSchema = z.object({
	id: z.number(),
	settings: PullZoneSettingsDetailsSchema,
});

export type PullZoneUpdateInput = z.infer<typeof PullZoneUpdateInputSchema>;

const PullZoneDeleteInputSchema = z.object({
	id: z.number(),
});

export type PullZoneDeleteInput = z.infer<typeof PullZoneDeleteInputSchema>;

const PullZonePurgeInputSchema = z.object({
	id: z.number(),
	cacheTag: z.string().optional(),
});

export type PullZonePurgeInput = z.infer<typeof PullZonePurgeInputSchema>;

const PullZoneAvailabilityInputSchema = z.object({
	name: z.string().optional(),
});

export type PullZoneAvailabilityInput = z.infer<
	typeof PullZoneAvailabilityInputSchema
>;

const PullZoneReferrerInputSchema = z.object({
	id: z.number(),
	hostname: z.string().min(1),
});

export type PullZoneReferrerInput = z.infer<typeof PullZoneReferrerInputSchema>;

const PullZoneBlockedIpInputSchema = z.object({
	id: z.number(),
	blockedIp: z.string().min(1),
});

export type PullZoneBlockedIpInput = z.infer<
	typeof PullZoneBlockedIpInputSchema
>;

const PullZoneResetSecurityKeyInputSchema = z.object({
	id: z.number(),
	securityKey: z.string().optional(),
});

export type PullZoneResetSecurityKeyInput = z.infer<
	typeof PullZoneResetSecurityKeyInputSchema
>;

const PullZoneSetForceSSLInputSchema = z.object({
	id: z.number(),
	hostname: z.string().min(1),
	forceSSL: z.boolean(),
});

export type PullZoneSetForceSSLInput = z.infer<
	typeof PullZoneSetForceSSLInputSchema
>;

const EdgeRuleSchema = z.looseObject({
	Guid: z.string().optional(),
	ActionType: z.number().int().optional(),
	ActionParameter1: z.string().optional(),
	ActionParameter2: z.string().optional(),
	Description: z.string().optional(),
	Enabled: z.boolean().optional(),
});

const EdgeRuleUpsertInputSchema = z.object({
	pullZoneId: z.number(),
	rule: EdgeRuleSchema,
});

export type EdgeRuleUpsertInput = z.infer<typeof EdgeRuleUpsertInputSchema>;

const EdgeRuleDeleteInputSchema = z.object({
	pullZoneId: z.number(),
	edgeRuleId: z.union([z.string(), z.number()]),
});

export type EdgeRuleDeleteInput = z.infer<typeof EdgeRuleDeleteInputSchema>;

const EdgeRuleSetEnabledInputSchema = z.object({
	pullZoneId: z.number(),
	edgeRuleId: z.union([z.string(), z.number()]),
	value: z.boolean(),
});

export type EdgeRuleSetEnabledInput = z.infer<
	typeof EdgeRuleSetEnabledInputSchema
>;

const PullZoneDateRangeInputSchema = z.object({
	pullZoneId: z.number(),
	dateFrom: z.string().optional(),
	dateTo: z.string().optional(),
	hourly: z.boolean().optional(),
});

export type PullZoneDateRangeInput = z.infer<
	typeof PullZoneDateRangeInputSchema
>;

const ZoneStatisticsOutputSchema = z.looseObject({});

// ---------------------------------------------------------------------------
// Purge URL
// Docs: https://bunny.net/docs/api-reference/core/purge/purge-url
// ---------------------------------------------------------------------------

const PurgeUrlInputSchema = z.object({
	url: z.string().url(),
	async: z.boolean().optional(),
	exactPath: z.boolean().optional(),
});

export type PurgeUrlInput = z.infer<typeof PurgeUrlInputSchema>;

// ---------------------------------------------------------------------------
// Storage Zone
// ---------------------------------------------------------------------------

const StorageZoneSchema = z.looseObject({
	Id: z.number(),
	Name: z.string().optional(),
	Region: z.string().optional(),
	ZoneTier: z.number().int().optional(),
	StorageZoneType: z.number().int().optional(),
	Deleted: z.boolean().optional(),
});

export type StorageZone = z.infer<typeof StorageZoneSchema>;

const StorageZoneListInputSchema = z.object({
	page: z.number().int().min(0).optional(),
	perPage: z.number().int().min(5).max(1000).optional(),
	includeDeleted: z.boolean().optional(),
	search: z.string().optional(),
});

export type StorageZoneListInput = z.infer<typeof StorageZoneListInputSchema>;

const StorageZoneGetInputSchema = z.object({
	id: z.number(),
});

export type StorageZoneGetInput = z.infer<typeof StorageZoneGetInputSchema>;

const StorageZoneCreateInputSchema = z.object({
	name: z.string().min(1),
	region: z.string().min(1),
	details: StorageZoneAddDetailsSchema.optional(),
});

export type StorageZoneCreateInput = z.infer<
	typeof StorageZoneCreateInputSchema
>;

const StorageZoneUpdateInputSchema = z.object({
	id: z.number(),
	settings: StorageZoneSettingsDetailsSchema,
});

export type StorageZoneUpdateInput = z.infer<
	typeof StorageZoneUpdateInputSchema
>;

const StorageZoneDeleteInputSchema = z.object({
	id: z.number(),
	deleteLinkedPullZones: z.boolean().optional(),
});

export type StorageZoneDeleteInput = z.infer<
	typeof StorageZoneDeleteInputSchema
>;

const StorageZoneAvailabilityInputSchema = z.object({
	name: z.string().optional(),
});

export type StorageZoneAvailabilityInput = z.infer<
	typeof StorageZoneAvailabilityInputSchema
>;

// ---------------------------------------------------------------------------
// DNS Zone
// ---------------------------------------------------------------------------

const DnsZoneSchema = z.looseObject({
	Id: z.number(),
	Domain: z.string().optional(),
});

export type DnsZone = z.infer<typeof DnsZoneSchema>;

const DnsZoneListInputSchema = z.object({
	page: z.number().int().min(1).optional(),
	perPage: z.number().int().min(5).max(1000).optional(),
	search: z.string().optional(),
});

export type DnsZoneListInput = z.infer<typeof DnsZoneListInputSchema>;

const DnsZoneGetInputSchema = z.object({
	id: z.number(),
});

export type DnsZoneGetInput = z.infer<typeof DnsZoneGetInputSchema>;

const DnsRecordSchema = z.looseObject({
	Id: z.number().optional(),
	Type: z.number().int().optional(),
	Value: z.string().optional(),
	Name: z.string().optional(),
	Ttl: z.number().optional(),
});

export type DnsRecord = z.infer<typeof DnsRecordSchema>;

const DnsRecordCreateInputSchema = z.object({
	zoneId: z.number(),
	record: DnsRecordDetailsSchema,
});

export type DnsRecordCreateInput = z.infer<typeof DnsRecordCreateInputSchema>;

const DnsRecordUpdateInputSchema = z.object({
	zoneId: z.number(),
	id: z.number(),
	record: DnsRecordDetailsSchema,
});

export type DnsRecordUpdateInput = z.infer<typeof DnsRecordUpdateInputSchema>;

const DnsRecordDeleteInputSchema = z.object({
	zoneId: z.number(),
	id: z.number(),
});

export type DnsRecordDeleteInput = z.infer<typeof DnsRecordDeleteInputSchema>;

const DnsZoneAvailabilityInputSchema = z.object({
	name: z.string().optional(),
});

export type DnsZoneAvailabilityInput = z.infer<
	typeof DnsZoneAvailabilityInputSchema
>;

// ---------------------------------------------------------------------------
// Billing / Statistics / Platform
// ---------------------------------------------------------------------------

const BillingSummaryItemSchema = z.looseObject({
	PullZoneId: z.number().optional(),
	MonthlyUsage: z.number().optional(),
	MonthlyBandwidthUsed: z.number().optional(),
});

const BillingSummaryOutputSchema = z.array(BillingSummaryItemSchema);

const AvailabilitySchema = z.looseObject({
	Available: z.boolean(),
});

const StatisticsInputSchema = z
	.object({
		dateFrom: z.string().optional(),
		dateTo: z.string().optional(),
		pullZone: z.number().optional(),
		serverZoneId: z.number().optional(),
		hourly: z.boolean().optional(),
		exactRange: z.boolean().optional(),
		loadErrors: z.boolean().optional(),
		loadOriginResponseTimes: z.boolean().optional(),
		loadOriginTraffic: z.boolean().optional(),
		loadRequestsServed: z.boolean().optional(),
		loadBandwidthUsed: z.boolean().optional(),
		loadOriginShieldBandwidth: z.boolean().optional(),
		loadGeographicTrafficDistribution: z.boolean().optional(),
		loadUserBalanceHistory: z.boolean().optional(),
	})
	.optional();

export type StatisticsInput = z.infer<typeof StatisticsInputSchema>;

const StatisticsOutputSchema = z.looseObject({});

const CountrySchema = z.looseObject({
	Id: z.number().optional(),
	Name: z.string().optional(),
	IsoCode: z.string().optional(),
});

const RegionInfoSchema = z.looseObject({
	Id: z.number().optional(),
	Name: z.string().optional(),
	RegionCode: z.string().optional(),
});

const GlobalSearchInputSchema = z.object({
	search: z.string().optional(),
	from: z.number().int().min(0).optional(),
	size: z.number().int().min(1).optional(),
});

export type GlobalSearchInput = z.infer<typeof GlobalSearchInputSchema>;

const ApiKeyItemSchema = z.looseObject({
	Id: z.string().optional(),
	Key: z.string().optional(),
	DateCreated: z.string().optional(),
});

const ApiKeysListInputSchema = z.object({
	page: z.number().int().min(1).optional(),
	perPage: z.number().int().min(5).max(1000).optional(),
});

export type ApiKeysListInput = z.infer<typeof ApiKeysListInputSchema>;

const UserAuditLogInputSchema = z.object({
	date: z.string(),
	product: z.array(z.string()).optional(),
	resourceType: z.array(z.string()).optional(),
	resourceId: z.array(z.string()).optional(),
	actorId: z.array(z.string()).optional(),
	order: z.string().optional(),
	continuationToken: z.string().optional(),
	limit: z.number().int().min(1).optional(),
});

export type UserAuditLogInput = z.infer<typeof UserAuditLogInputSchema>;

const VideoLibrarySchema = z.looseObject({
	Id: z.number(),
	Name: z.string().optional(),
});

const VideoLibrariesListInputSchema = z.object({
	page: z.number().int().min(0).optional(),
	perPage: z.number().int().min(5).max(1000).optional(),
	search: z.string().optional(),
});

export type VideoLibrariesListInput = z.infer<
	typeof VideoLibrariesListInputSchema
>;

const EdgeScriptsListInputSchema = z.object({
	page: z.number().int().min(1).optional(),
	perPage: z.number().int().min(1).max(1000).optional(),
	search: z.string().optional(),
	includeLinkedPullzones: z.boolean().optional(),
	integrationId: z.number().optional(),
});

export type EdgeScriptsListInput = z.infer<typeof EdgeScriptsListInputSchema>;

const OembedInputSchema = z.object({
	url: z.string().url(),
	maxWidth: z.number().int().min(1).optional(),
	maxHeight: z.number().int().min(1).optional(),
	token: z.string().optional(),
	expires: z.number().optional(),
});

export type OembedInput = z.infer<typeof OembedInputSchema>;

// ---------------------------------------------------------------------------
// Shield (base https://api.bunny.net/shield)
// Spec: https://api.bunny.net/shield/docs/v1/swagger.json
// ---------------------------------------------------------------------------

const ShieldZoneSchema = z.looseObject({
	shieldZoneId: z.number(),
	pullZoneId: z.number().optional(),
	learningMode: z.boolean().optional(),
	wafEnabled: z.boolean().optional(),
	planType: z.number().int().optional(),
});

export type ShieldZone = z.infer<typeof ShieldZoneSchema>;

const ShieldPageInputSchema = z.object({
	page: z.number().int().min(1).optional(),
	perPage: z.number().int().min(1).optional(),
});

export type ShieldPageInput = z.infer<typeof ShieldPageInputSchema>;

const ShieldZoneIdInputSchema = z.object({
	shieldZoneId: z.number(),
});

export type ShieldZoneIdInput = z.infer<typeof ShieldZoneIdInputSchema>;

const ShieldZoneByPullZoneInputSchema = z.object({
	pullZoneId: z.number(),
});

export type ShieldZoneByPullZoneInput = z.infer<
	typeof ShieldZoneByPullZoneInputSchema
>;

const ShieldZoneUpdateInputSchema = z.object({
	shieldZoneId: z.number(),
	shieldZone: ShieldZoneRequestDetailsSchema.optional(),
});

export type ShieldZoneUpdateInput = z.infer<typeof ShieldZoneUpdateInputSchema>;

const ShieldRateLimitSchema = z.looseObject({
	id: z.number().optional(),
	shieldZoneId: z.number().optional(),
	ruleName: z.string().optional(),
	ruleDescription: z.string().optional(),
});

export type ShieldRateLimit = z.infer<typeof ShieldRateLimitSchema>;

const ShieldRateLimitsListInputSchema = z.object({
	shieldZoneId: z.number(),
	page: z.number().int().min(1).optional(),
	perPage: z.number().int().min(1).optional(),
});

export type ShieldRateLimitsListInput = z.infer<
	typeof ShieldRateLimitsListInputSchema
>;

const ShieldRateLimitIdInputSchema = z.object({
	id: z.number(),
});

export type ShieldRateLimitIdInput = z.infer<
	typeof ShieldRateLimitIdInputSchema
>;

const ShieldRateLimitCreateInputSchema = z.object({
	shieldZoneId: z.number(),
	ruleName: z.string().optional(),
	ruleDescription: z.string().optional(),
	ruleConfiguration: RateLimitRuleConfigDetailsSchema.optional(),
});

export type ShieldRateLimitCreateInput = z.infer<
	typeof ShieldRateLimitCreateInputSchema
>;

const ShieldRateLimitUpdateInputSchema = z.object({
	id: z.number(),
	ruleName: z.string().optional(),
	ruleDescription: z.string().optional(),
	ruleConfiguration: RateLimitRuleConfigDetailsSchema.optional(),
});

export type ShieldRateLimitUpdateInput = z.infer<
	typeof ShieldRateLimitUpdateInputSchema
>;

const ShieldMetricsDetailedInputSchema = z.object({
	shieldZoneId: z.number(),
	startDate: z.string().optional(),
	endDate: z.string().optional(),
	resolution: z.union([z.string(), z.number()]).optional(),
});

export type ShieldMetricsDetailedInput = z.infer<
	typeof ShieldMetricsDetailedInputSchema
>;

const ShieldWafRuleMetricsInputSchema = z.object({
	shieldZoneId: z.number(),
	ruleId: z.union([z.string(), z.number()]),
});

export type ShieldWafRuleMetricsInput = z.infer<
	typeof ShieldWafRuleMetricsInputSchema
>;

const ShieldEventLogsInputSchema = z.object({
	shieldZoneId: z.number(),
	date: z.string(),
	continuationToken: z.string(),
});

export type ShieldEventLogsInput = z.infer<typeof ShieldEventLogsInputSchema>;

const ShieldBotDetectionUpdateInputSchema = z.object({
	shieldZoneId: z.number(),
	executionMode: z.number().int().min(0).max(1).optional(),
});

export type ShieldBotDetectionUpdateInput = z.infer<
	typeof ShieldBotDetectionUpdateInputSchema
>;

const ShieldUploadScanningUpdateInputSchema = z.object({
	shieldZoneId: z.number(),
	isEnabled: z.boolean().optional(),
	csamScanningMode: z.number().int().min(0).max(2).optional(),
	antivirusScanningMode: z.number().int().min(0).max(2).optional(),
});

export type ShieldUploadScanningUpdateInput = z.infer<
	typeof ShieldUploadScanningUpdateInputSchema
>;

const ShieldAccessListSchema = z.looseObject({
	id: z.number().optional(),
	name: z.string().optional(),
	type: z.unknown().optional(),
});

export type ShieldAccessList = z.infer<typeof ShieldAccessListSchema>;

const ShieldAccessListIdInputSchema = z.object({
	shieldZoneId: z.number(),
	id: z.number(),
});

export type ShieldAccessListIdInput = z.infer<
	typeof ShieldAccessListIdInputSchema
>;

const ShieldAccessListCreateInputSchema = z.object({
	shieldZoneId: z.number(),
	name: z.string().min(1),
	type: z.union([z.string(), z.number()]),
	content: z.string().min(1),
	description: z.string().optional(),
	checksum: z.string().optional(),
});

export type ShieldAccessListCreateInput = z.infer<
	typeof ShieldAccessListCreateInputSchema
>;

const ShieldAccessListUpdateInputSchema = z.object({
	shieldZoneId: z.number(),
	id: z.number(),
	name: z.string().optional(),
	content: z.string().optional(),
	checksum: z.string().optional(),
});

export type ShieldAccessListUpdateInput = z.infer<
	typeof ShieldAccessListUpdateInputSchema
>;

const ShieldAccessListConfigUpdateInputSchema = z.object({
	shieldZoneId: z.number(),
	id: z.number(),
	isEnabled: z.boolean().optional(),
	action: z.number().int().min(0).max(5).optional(),
});

export type ShieldAccessListConfigUpdateInput = z.infer<
	typeof ShieldAccessListConfigUpdateInputSchema
>;

const ShieldWafCustomRulesListInputSchema = z.object({
	shieldZoneId: z.number(),
	page: z.number().int().min(1).optional(),
	perPage: z.number().int().min(1).optional(),
});

export type ShieldWafCustomRulesListInput = z.infer<
	typeof ShieldWafCustomRulesListInputSchema
>;

const ShieldWafCustomRuleIdInputSchema = z.object({
	id: z.union([z.string(), z.number()]),
});

export type ShieldWafCustomRuleIdInput = z.infer<
	typeof ShieldWafCustomRuleIdInputSchema
>;

const ShieldWafRuleReviewInputSchema = z.object({
	shieldZoneId: z.number(),
	ruleId: z.union([z.string(), z.number()]).optional(),
	action: z.union([z.string(), z.number()]).optional(),
});

export type ShieldWafRuleReviewInput = z.infer<
	typeof ShieldWafRuleReviewInputSchema
>;

const ShieldLooseOutputSchema = z.looseObject({});

// ---------------------------------------------------------------------------
// Magic Containers (base https://api.bunny.net/mc)
// ---------------------------------------------------------------------------

const ContainersCursorInputSchema = z.object({
	nextCursor: z.string().optional(),
	limit: z.number().int().min(1).optional(),
});

export type ContainersCursorInput = z.infer<typeof ContainersCursorInputSchema>;

const ContainerAppSchema = z.looseObject({
	id: z.string().optional(),
	name: z.string().optional(),
	status: z.unknown().optional(),
});

const ContainerRegistrySchema = z.looseObject({
	id: z.number().optional(),
	displayName: z.string().optional(),
	hostName: z.string().optional(),
	isPublic: z.boolean().optional(),
});

const ContainerRegionSchema = z.looseObject({
	id: z.string().optional(),
	name: z.string().optional(),
	hasAnycastSupport: z.boolean().optional(),
	hasCapacity: z.boolean().optional(),
});

const ContainerImageRefInputSchema = z.object({
	registryId: z.union([z.string(), z.number()]),
	imageName: z.string().min(1),
	imageNamespace: z.string().min(1),
	tag: z.string().min(1),
});

export type ContainerImageRefInput = z.infer<
	typeof ContainerImageRefInputSchema
>;

const ContainerImageTagsInputSchema = z.object({
	registryId: z.union([z.string(), z.number()]),
	imageName: z.string().min(1),
	imageNamespace: z.string().min(1),
});

export type ContainerImageTagsInput = z.infer<
	typeof ContainerImageTagsInputSchema
>;

const ContainerPublicImagesSearchInputSchema = z.object({
	registryId: z.union([z.string(), z.number()]),
	prefix: z.string().min(1),
	size: z.number().int().min(1).optional(),
	page: z.number().int().min(1).optional(),
});

export type ContainerPublicImagesSearchInput = z.infer<
	typeof ContainerPublicImagesSearchInputSchema
>;

const ContainerRegistryDeleteInputSchema = z.object({
	registryId: z.union([z.string(), z.number()]),
});

export type ContainerRegistryDeleteInput = z.infer<
	typeof ContainerRegistryDeleteInputSchema
>;

const ContainerVolumesListInputSchema = z.object({
	appId: z.string().min(1),
});

export type ContainerVolumesListInput = z.infer<
	typeof ContainerVolumesListInputSchema
>;

const OptimalBaseRegionInputSchema = z.object({
	cdnServerToken: z.string().optional(),
});

export type OptimalBaseRegionInput = z.infer<
	typeof OptimalBaseRegionInputSchema
>;

// ---------------------------------------------------------------------------
// Endpoint input/output maps
// ---------------------------------------------------------------------------

export type BunnycdnEndpointInputs = {
	pullZoneList: PullZoneListInput;
	pullZoneGet: PullZoneGetInput;
	pullZoneCreate: PullZoneCreateInput;
	pullZoneUpdate: PullZoneUpdateInput;
	pullZoneDelete: PullZoneDeleteInput;
	pullZonePurge: PullZonePurgeInput;
	pullZoneAvailability: PullZoneAvailabilityInput;
	pullZoneReferrer: PullZoneReferrerInput;
	pullZoneBlockedIp: PullZoneBlockedIpInput;
	pullZoneSecurityKey: PullZoneResetSecurityKeyInput;
	pullZoneForceSSL: PullZoneSetForceSSLInput;
	edgeRuleUpsert: EdgeRuleUpsertInput;
	edgeRuleDelete: EdgeRuleDeleteInput;
	edgeRuleSetEnabled: EdgeRuleSetEnabledInput;
	pullZoneDateRange: PullZoneDateRangeInput;
	purgeUrl: PurgeUrlInput;
	storageZoneList: StorageZoneListInput;
	storageZoneGet: StorageZoneGetInput;
	storageZoneCreate: StorageZoneCreateInput;
	storageZoneUpdate: StorageZoneUpdateInput;
	storageZoneDelete: StorageZoneDeleteInput;
	storageZoneAvailability: StorageZoneAvailabilityInput;
	dnsZoneList: DnsZoneListInput;
	dnsZoneGet: DnsZoneGetInput;
	dnsRecordCreate: DnsRecordCreateInput;
	dnsRecordUpdate: DnsRecordUpdateInput;
	dnsRecordDelete: DnsRecordDeleteInput;
	dnsZoneAvailability: DnsZoneAvailabilityInput;
	billingSummary: Record<string, never>;
	statistics: StatisticsInput;
	globalSearch: GlobalSearchInput;
	apiKeysList: ApiKeysListInput;
	userAuditLog: UserAuditLogInput;
	videoLibrariesList: VideoLibrariesListInput;
	languages: Record<string, never>;
	countryList: Record<string, never>;
	regionList: Record<string, never>;
	edgeScriptsList: EdgeScriptsListInput;
	oembed: OembedInput;
	shieldPage: ShieldPageInput;
	shieldZoneId: ShieldZoneIdInput;
	shieldZoneByPullZone: ShieldZoneByPullZoneInput;
	shieldZoneUpdate: ShieldZoneUpdateInput;
	shieldRateLimitsList: ShieldRateLimitsListInput;
	shieldRateLimitId: ShieldRateLimitIdInput;
	shieldRateLimitDelete: ShieldRateLimitIdInput;
	shieldRateLimitCreate: ShieldRateLimitCreateInput;
	shieldRateLimitUpdate: ShieldRateLimitUpdateInput;
	shieldMetricsDetailed: ShieldMetricsDetailedInput;
	shieldWafRuleMetrics: ShieldWafRuleMetricsInput;
	shieldEventLogs: ShieldEventLogsInput;
	shieldBotDetectionUpdate: ShieldBotDetectionUpdateInput;
	shieldUploadScanningUpdate: ShieldUploadScanningUpdateInput;
	shieldAccessListId: ShieldAccessListIdInput;
	shieldAccessListCreate: ShieldAccessListCreateInput;
	shieldAccessListUpdate: ShieldAccessListUpdateInput;
	shieldAccessListConfigUpdate: ShieldAccessListConfigUpdateInput;
	shieldWafCustomRulesList: ShieldWafCustomRulesListInput;
	shieldWafCustomRuleId: ShieldWafCustomRuleIdInput;
	shieldWafRuleReview: ShieldWafRuleReviewInput;
	containersCursor: ContainersCursorInput;
	containerImageRef: ContainerImageRefInput;
	containerImageTags: ContainerImageTagsInput;
	containerPublicImagesSearch: ContainerPublicImagesSearchInput;
	containerRegistryDelete: ContainerRegistryDeleteInput;
	containerVolumesList: ContainerVolumesListInput;
	optimalBaseRegion: OptimalBaseRegionInput;
	emptyInput: Record<string, never>;
};

const LooseRecordSchema = z.looseObject({});

const StorageZoneListOutputSchema = z.union([
	z.array(StorageZoneSchema),
	LooseRecordSchema,
]);

const DnsZoneListOutputSchema = z.union([
	z.array(DnsZoneSchema),
	LooseRecordSchema,
]);

const VideoLibraryListOutputSchema = z.union([
	z.array(VideoLibrarySchema),
	LooseRecordSchema,
]);

const EdgeScriptListOutputSchema = z.union([
	z.array(StatisticsOutputSchema),
	LooseRecordSchema,
]);

const ApiKeyListOutputSchema = z.union([
	z.array(ApiKeyItemSchema),
	LooseRecordSchema,
]);

const CountryListOutputSchema = z.array(CountrySchema);

const RegionListOutputSchema = z.array(RegionInfoSchema);

const LanguagesOutputSchema = z.array(z.unknown());

export type BunnycdnEndpointOutputs = {
	pullZoneList: z.infer<typeof PullZoneListOutputSchema>;
	pullZoneGet: PullZone;
	pullZoneCreate: PullZone;
	pullZoneUpdate: PullZone;
	pullZoneDelete: Success;
	pullZonePurge: Success;
	pullZoneAvailability: z.infer<typeof AvailabilitySchema>;
	pullZoneReferrer: Success;
	pullZoneBlockedIp: Success;
	pullZoneSecurityKey: Success;
	pullZoneForceSSL: Success;
	edgeRuleUpsert: z.infer<typeof EdgeRuleSchema>;
	edgeRuleDelete: Success;
	edgeRuleSetEnabled: Success;
	pullZoneDateRange: z.infer<typeof ZoneStatisticsOutputSchema>;
	purgeUrl: unknown;
	storageZoneList: z.infer<typeof StorageZoneListOutputSchema>;
	storageZoneGet: StorageZone;
	storageZoneCreate: StorageZone;
	storageZoneUpdate: Success;
	storageZoneDelete: Success;
	storageZoneAvailability: z.infer<typeof AvailabilitySchema>;
	dnsZoneList: z.infer<typeof DnsZoneListOutputSchema>;
	dnsZoneGet: DnsZone;
	dnsRecordCreate: DnsRecord;
	dnsRecordUpdate: Success;
	dnsRecordDelete: Success;
	dnsZoneAvailability: z.infer<typeof AvailabilitySchema>;
	billingSummary: z.infer<typeof BillingSummaryOutputSchema>;
	statistics: z.infer<typeof StatisticsOutputSchema>;
	globalSearch: z.infer<typeof StatisticsOutputSchema>;
	apiKeysList: z.infer<typeof ApiKeyListOutputSchema>;
	userAuditLog: z.infer<typeof StatisticsOutputSchema>;
	videoLibrariesList: z.infer<typeof VideoLibraryListOutputSchema>;
	languages: z.infer<typeof LanguagesOutputSchema>;
	countryList: z.infer<typeof CountryListOutputSchema>;
	regionList: z.infer<typeof RegionListOutputSchema>;
	edgeScriptsList: z.infer<typeof EdgeScriptListOutputSchema>;
	oembed: z.infer<typeof StatisticsOutputSchema>;
	shieldPage: z.infer<typeof ShieldLooseOutputSchema>;
	shieldZoneId: ShieldZone;
	shieldZoneByPullZone: ShieldZone;
	shieldZoneUpdate: z.infer<typeof ShieldLooseOutputSchema>;
	shieldRateLimitsList: z.infer<typeof ShieldLooseOutputSchema>;
	shieldRateLimitId: ShieldRateLimit;
	shieldRateLimitDelete: Success;
	shieldRateLimitCreate: ShieldRateLimit;
	shieldRateLimitUpdate: ShieldRateLimit;
	shieldMetricsDetailed: z.infer<typeof ShieldLooseOutputSchema>;
	shieldWafRuleMetrics: z.infer<typeof ShieldLooseOutputSchema>;
	shieldEventLogs: z.infer<typeof ShieldLooseOutputSchema>;
	shieldBotDetectionUpdate: z.infer<typeof ShieldLooseOutputSchema>;
	shieldUploadScanningUpdate: z.infer<typeof ShieldLooseOutputSchema>;
	shieldAccessListId: ShieldAccessList;
	shieldAccessListCreate: ShieldAccessList;
	shieldAccessListUpdate: ShieldAccessList;
	shieldAccessListConfigUpdate: z.infer<typeof ShieldLooseOutputSchema>;
	shieldWafCustomRulesList: z.infer<typeof ShieldLooseOutputSchema>;
	shieldWafCustomRuleId: z.infer<typeof ShieldLooseOutputSchema>;
	shieldWafRuleReview: z.infer<typeof ShieldLooseOutputSchema>;
	containersCursor: z.infer<typeof ShieldLooseOutputSchema>;
	containerImageRef: z.infer<typeof ShieldLooseOutputSchema>;
	containerImageTags: z.infer<typeof ShieldLooseOutputSchema>;
	containerPublicImagesSearch: z.infer<typeof ShieldLooseOutputSchema>;
	containerRegistryDelete: z.infer<typeof ShieldLooseOutputSchema>;
	containerVolumesList: z.infer<typeof ShieldLooseOutputSchema>;
	optimalBaseRegion: z.infer<typeof ShieldLooseOutputSchema>;
	emptyInput: z.infer<typeof ShieldLooseOutputSchema>;
};

export const BunnycdnEndpointInputSchemas = {
	pullZoneList: PullZoneListInputSchema,
	pullZoneGet: PullZoneGetInputSchema,
	pullZoneCreate: PullZoneCreateInputSchema,
	pullZoneUpdate: PullZoneUpdateInputSchema,
	pullZoneDelete: PullZoneDeleteInputSchema,
	pullZonePurge: PullZonePurgeInputSchema,
	pullZoneAvailability: PullZoneAvailabilityInputSchema,
	pullZoneReferrer: PullZoneReferrerInputSchema,
	pullZoneBlockedIp: PullZoneBlockedIpInputSchema,
	pullZoneSecurityKey: PullZoneResetSecurityKeyInputSchema,
	pullZoneForceSSL: PullZoneSetForceSSLInputSchema,
	edgeRuleUpsert: EdgeRuleUpsertInputSchema,
	edgeRuleDelete: EdgeRuleDeleteInputSchema,
	edgeRuleSetEnabled: EdgeRuleSetEnabledInputSchema,
	pullZoneDateRange: PullZoneDateRangeInputSchema,
	purgeUrl: PurgeUrlInputSchema,
	storageZoneList: StorageZoneListInputSchema,
	storageZoneGet: StorageZoneGetInputSchema,
	storageZoneCreate: StorageZoneCreateInputSchema,
	storageZoneUpdate: StorageZoneUpdateInputSchema,
	storageZoneDelete: StorageZoneDeleteInputSchema,
	storageZoneAvailability: StorageZoneAvailabilityInputSchema,
	dnsZoneList: DnsZoneListInputSchema,
	dnsZoneGet: DnsZoneGetInputSchema,
	dnsRecordCreate: DnsRecordCreateInputSchema,
	dnsRecordUpdate: DnsRecordUpdateInputSchema,
	dnsRecordDelete: DnsRecordDeleteInputSchema,
	dnsZoneAvailability: DnsZoneAvailabilityInputSchema,
	billingSummary: z.object({}),
	statistics: StatisticsInputSchema,
	globalSearch: GlobalSearchInputSchema,
	apiKeysList: ApiKeysListInputSchema,
	userAuditLog: UserAuditLogInputSchema,
	videoLibrariesList: VideoLibrariesListInputSchema,
	languages: z.object({}),
	countryList: z.object({}),
	regionList: z.object({}),
	edgeScriptsList: EdgeScriptsListInputSchema,
	oembed: OembedInputSchema,
	shieldPage: ShieldPageInputSchema,
	shieldZoneId: ShieldZoneIdInputSchema,
	shieldZoneByPullZone: ShieldZoneByPullZoneInputSchema,
	shieldZoneUpdate: ShieldZoneUpdateInputSchema,
	shieldRateLimitsList: ShieldRateLimitsListInputSchema,
	shieldRateLimitId: ShieldRateLimitIdInputSchema,
	shieldRateLimitDelete: ShieldRateLimitIdInputSchema,
	shieldRateLimitCreate: ShieldRateLimitCreateInputSchema,
	shieldRateLimitUpdate: ShieldRateLimitUpdateInputSchema,
	shieldMetricsDetailed: ShieldMetricsDetailedInputSchema,
	shieldWafRuleMetrics: ShieldWafRuleMetricsInputSchema,
	shieldEventLogs: ShieldEventLogsInputSchema,
	shieldBotDetectionUpdate: ShieldBotDetectionUpdateInputSchema,
	shieldUploadScanningUpdate: ShieldUploadScanningUpdateInputSchema,
	shieldAccessListId: ShieldAccessListIdInputSchema,
	shieldAccessListCreate: ShieldAccessListCreateInputSchema,
	shieldAccessListUpdate: ShieldAccessListUpdateInputSchema,
	shieldAccessListConfigUpdate: ShieldAccessListConfigUpdateInputSchema,
	shieldWafCustomRulesList: ShieldWafCustomRulesListInputSchema,
	shieldWafCustomRuleId: ShieldWafCustomRuleIdInputSchema,
	shieldWafRuleReview: ShieldWafRuleReviewInputSchema,
	containersCursor: ContainersCursorInputSchema,
	containerImageRef: ContainerImageRefInputSchema,
	containerImageTags: ContainerImageTagsInputSchema,
	containerPublicImagesSearch: ContainerPublicImagesSearchInputSchema,
	containerRegistryDelete: ContainerRegistryDeleteInputSchema,
	containerVolumesList: ContainerVolumesListInputSchema,
	optimalBaseRegion: OptimalBaseRegionInputSchema,
	emptyInput: z.object({}),
} as const;

export const BunnycdnEndpointOutputSchemas = {
	pullZoneList: PullZoneListOutputSchema,
	pullZoneGet: PullZoneSchema,
	pullZoneCreate: PullZoneSchema,
	pullZoneUpdate: PullZoneSchema,
	pullZoneDelete: SuccessSchema,
	pullZonePurge: SuccessSchema,
	pullZoneAvailability: AvailabilitySchema,
	pullZoneReferrer: SuccessSchema,
	pullZoneBlockedIp: SuccessSchema,
	pullZoneSecurityKey: SuccessSchema,
	pullZoneForceSSL: SuccessSchema,
	edgeRuleUpsert: EdgeRuleSchema,
	edgeRuleDelete: SuccessSchema,
	edgeRuleSetEnabled: SuccessSchema,
	pullZoneDateRange: ZoneStatisticsOutputSchema,
	purgeUrl: z.unknown(),
	storageZoneList: StorageZoneListOutputSchema,
	storageZoneGet: StorageZoneSchema,
	storageZoneCreate: StorageZoneSchema,
	storageZoneUpdate: SuccessSchema,
	storageZoneDelete: SuccessSchema,
	storageZoneAvailability: AvailabilitySchema,
	dnsZoneList: DnsZoneListOutputSchema,
	dnsZoneGet: DnsZoneSchema,
	dnsRecordCreate: DnsRecordSchema,
	dnsRecordUpdate: SuccessSchema,
	dnsRecordDelete: SuccessSchema,
	dnsZoneAvailability: AvailabilitySchema,
	billingSummary: BillingSummaryOutputSchema,
	statistics: StatisticsOutputSchema,
	globalSearch: StatisticsOutputSchema,
	apiKeysList: ApiKeyListOutputSchema,
	userAuditLog: StatisticsOutputSchema,
	videoLibrariesList: VideoLibraryListOutputSchema,
	languages: LanguagesOutputSchema,
	countryList: CountryListOutputSchema,
	regionList: RegionListOutputSchema,
	edgeScriptsList: EdgeScriptListOutputSchema,
	oembed: StatisticsOutputSchema,
	shieldPage: ShieldLooseOutputSchema,
	shieldZoneId: ShieldZoneSchema,
	shieldZoneByPullZone: ShieldZoneSchema,
	shieldZoneUpdate: ShieldLooseOutputSchema,
	shieldRateLimitsList: ShieldLooseOutputSchema,
	shieldRateLimitId: ShieldRateLimitSchema,
	shieldRateLimitDelete: SuccessSchema,
	shieldRateLimitCreate: ShieldRateLimitSchema,
	shieldRateLimitUpdate: ShieldRateLimitSchema,
	shieldMetricsDetailed: ShieldLooseOutputSchema,
	shieldWafRuleMetrics: ShieldLooseOutputSchema,
	shieldEventLogs: ShieldLooseOutputSchema,
	shieldBotDetectionUpdate: ShieldLooseOutputSchema,
	shieldUploadScanningUpdate: ShieldLooseOutputSchema,
	shieldAccessListId: ShieldAccessListSchema,
	shieldAccessListCreate: ShieldAccessListSchema,
	shieldAccessListUpdate: ShieldAccessListSchema,
	shieldAccessListConfigUpdate: ShieldLooseOutputSchema,
	shieldWafCustomRulesList: ShieldLooseOutputSchema,
	shieldWafCustomRuleId: ShieldLooseOutputSchema,
	shieldWafRuleReview: ShieldLooseOutputSchema,
	containersCursor: ShieldLooseOutputSchema,
	containerImageRef: ShieldLooseOutputSchema,
	containerImageTags: ShieldLooseOutputSchema,
	containerPublicImagesSearch: ShieldLooseOutputSchema,
	containerRegistryDelete: ShieldLooseOutputSchema,
	containerVolumesList: ShieldLooseOutputSchema,
	optimalBaseRegion: ShieldLooseOutputSchema,
	emptyInput: ShieldLooseOutputSchema,
} as const;
