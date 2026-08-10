import { z } from 'zod';

// Fortnite Data API responses are partially documented (openapi at
// https://api.fortnite.com/ecosystem/v1/docs/openapi.yaml). Remote Control
// UObject payloads remain free-form per UE version — loose records are intentional.

const LooseObjectSchema = z.record(z.string(), z.unknown());
const LooseListSchema = z.union([
	z.array(LooseObjectSchema),
	z
		.object({
			// Fortnite list wrapper: { data, links, meta }
			data: z.array(LooseObjectSchema).optional(),
			items: z.array(LooseObjectSchema).optional(),
			results: z.array(LooseObjectSchema).optional(),
			islands: z.array(LooseObjectSchema).optional(),
			links: LooseObjectSchema.optional(),
			meta: LooseObjectSchema.optional(),
		})
		.catchall(z.unknown()),
]);

/** Interval path segment for Fortnite metrics (OpenAPI IntervalPath). */
const IntervalEnum = z.enum(['day', 'hour', 'minute']);

const MetricRangeInput = z.object({
	code: z.string(),
	/** Bucket size: day | hour | minute (default day). */
	interval: IntervalEnum.optional(),
	/** Inclusive range start (ISO date-time), OpenAPI `from`. */
	from: z.string().optional(),
	/** Exclusive range end (ISO date-time), OpenAPI `to`. */
	to: z.string().optional(),
});

// ---------------------------------------------------------------------------
// Islands (11) — Fortnite Data API
// https://api.fortnite.com/ecosystem/v1/docs
// ---------------------------------------------------------------------------

const ListIslandsInputSchema = z.object({
	/** Max results (OpenAPI `size`). */
	size: z.number().optional(),
	/** Cursor for next page (OpenAPI `after`). */
	after: z.string().optional(),
	/** Cursor for previous page (OpenAPI `before`). */
	before: z.string().optional(),
});
export type ListIslandsInput = z.infer<typeof ListIslandsInputSchema>;

const GetIslandInputSchema = z.object({
	code: z.string(),
});
export type GetIslandInput = z.infer<typeof GetIslandInputSchema>;

/** OpenAPI MetricsListQuery enum (camelCase; path segments use kebab-case). */
const IslandMetricsFilterEnum = z.enum([
	'averageMinutesPerPlayer',
	'peakCCU',
	'favorites',
	'minutesPlayed',
	'recommendations',
	'plays',
	'uniquePlayers',
	'retention',
]);

const GetIslandMetricsByIntervalInputSchema = MetricRangeInput.extend({
	// OpenAPI MetricsListQuery — form+explode; only valid on /metrics/{interval}
	metrics: z
		.union([IslandMetricsFilterEnum, z.array(IslandMetricsFilterEnum)])
		.optional(),
});
export type GetIslandMetricsByIntervalInput = z.infer<
	typeof GetIslandMetricsByIntervalInputSchema
>;

const IslandMetricInputSchema = MetricRangeInput;
export type IslandMetricInput = z.infer<typeof IslandMetricInputSchema>;

/** Retention is day-only per OpenAPI (hour/minute → 404). */
const IslandRetentionInputSchema = MetricRangeInput.extend({
	interval: z.literal('day').optional(),
});
export type IslandRetentionInput = z.infer<typeof IslandRetentionInputSchema>;

// ---------------------------------------------------------------------------
// Remote Control (17) — Unreal Engine Web Remote Control HTTP API
// ---------------------------------------------------------------------------

const RemoteSessionInputSchema = z
	.object({
		// session body fields vary by UE Remote Control version
	})
	.catchall(z.unknown());
export type RemoteSessionInput = z.infer<typeof RemoteSessionInputSchema>;

// UE Web Remote Control batch items require RequestId, URL, and Verb per the
// official HTTP reference; allow extra passthrough keys (Body, Headers, etc.).
const RemoteBatchItemSchema = z
	.object({
		RequestId: z.number(),
		URL: z.string(),
		Verb: z.enum(['PUT', 'POST', 'GET', 'DELETE']),
	})
	.passthrough();

const RemoteBatchInputSchema = z.object({
	// batch is an ordered list of remote calls; each item must identify itself
	// (RequestId), target a route (URL), and pick an HTTP verb (Verb).
	requests: z.array(RemoteBatchItemSchema).refine(
		(items) => {
			const ids = items.map((item) => item.RequestId);
			return new Set(ids).size === ids.length;
		},
		{ message: 'Duplicate RequestId values are not allowed' },
	),
});
export type RemoteBatchInput = z.infer<typeof RemoteBatchInputSchema>;

const RemoteCorsInputSchema = z.object({});
export type RemoteCorsInput = z.infer<typeof RemoteCorsInputSchema>;

const GetPresetInputSchema = z.object({
	presetName: z.string(),
});
export type GetPresetInput = z.infer<typeof GetPresetInputSchema>;

const GetPresetMetadataInputSchema = z.object({
	presetName: z.string(),
});
export type GetPresetMetadataInput = z.infer<
	typeof GetPresetMetadataInputSchema
>;

const GetPresetMetadataKeyInputSchema = z.object({
	presetName: z.string(),
	key: z.string(),
});
export type GetPresetMetadataKeyInput = z.infer<
	typeof GetPresetMetadataKeyInputSchema
>;

const PutPresetMetadataKeyInputSchema = z.object({
	presetName: z.string(),
	key: z.string(),
	// metadata values are free-form strings/objects depending on preset tooling
	value: z.unknown(),
});
export type PutPresetMetadataKeyInput = z.infer<
	typeof PutPresetMetadataKeyInputSchema
>;

const DeletePresetMetadataKeyInputSchema = z.object({
	presetName: z.string(),
	key: z.string(),
});
export type DeletePresetMetadataKeyInput = z.infer<
	typeof DeletePresetMetadataKeyInputSchema
>;

const GetPresetPropertyInputSchema = z.object({
	presetName: z.string(),
	propertyName: z.string(),
});
export type GetPresetPropertyInput = z.infer<
	typeof GetPresetPropertyInputSchema
>;

const UpdatePresetPropertyInputSchema = z.object({
	presetName: z.string(),
	propertyName: z.string(),
	// property payload is free-form (typed by the exposed property in UE)
	// unknown: Remote Control property values are dynamic per preset
	value: z.unknown(),
});
export type UpdatePresetPropertyInput = z.infer<
	typeof UpdatePresetPropertyInputSchema
>;

const InvokePresetFunctionInputSchema = z.object({
	presetName: z.string(),
	functionName: z.string(),
	// function parameters are free-form per exposed Remote Control function signature
	parameters: LooseObjectSchema.optional(),
});
export type InvokePresetFunctionInput = z.infer<
	typeof InvokePresetFunctionInputSchema
>;

const DescribeObjectInputSchema = z.object({
	objectPath: z.string(),
});
export type DescribeObjectInput = z.infer<typeof DescribeObjectInputSchema>;

const CallObjectFunctionInputSchema = z.object({
	objectPath: z.string(),
	functionName: z.string(),
	// Blueprint function args are free-form per UFunction signature
	parameters: LooseObjectSchema.optional(),
	generateTransaction: z.boolean().optional(),
});
export type CallObjectFunctionInput = z.infer<
	typeof CallObjectFunctionInputSchema
>;

const PutObjectPropertyInputSchema = z.object({
	objectPath: z.string(),
	/** Optional single property name (UE `propertyName`). */
	propertyName: z.string().optional(),
	access: z
		.enum(['READ_ACCESS', 'WRITE_ACCESS', 'WRITE_TRANSACTION_ACCESS'])
		.optional(),
	// property map is free-form; keys are property names, values are UE JSON values
	propertyValue: LooseObjectSchema.optional(),
});
export type PutObjectPropertyInput = z.infer<
	typeof PutObjectPropertyInputSchema
>;

const GetObjectThumbnailInputSchema = z.object({
	objectPath: z.string(),
});
export type GetObjectThumbnailInput = z.infer<
	typeof GetObjectThumbnailInputSchema
>;

const ListBlueprintCallableFunctionsInputSchema = z.object({
	objectPath: z.string(),
});
export type ListBlueprintCallableFunctionsInput = z.infer<
	typeof ListBlueprintCallableFunctionsInputSchema
>;

const WaitForObjectEventInputSchema = z.object({
	objectPath: z.string(),
	/** UE EventType (default ObjectPropertyChanged). */
	eventType: z
		.enum(['ObjectPropertyChanged', 'PreObjectPropertyChanged'])
		.optional(),
	/** UE PropertyName to watch. */
	propertyName: z.string().optional(),
});
export type WaitForObjectEventInput = z.infer<
	typeof WaitForObjectEventInputSchema
>;

// ---------------------------------------------------------------------------
// Aggregate maps
// ---------------------------------------------------------------------------

export type EpicGamesEndpointInputs = {
	islandsList: ListIslandsInput;
	islandsGet: GetIslandInput;
	islandsGetMetricsByInterval: GetIslandMetricsByIntervalInput;
	islandsGetPlays: IslandMetricInput;
	islandsGetUniquePlayers: IslandMetricInput;
	islandsGetMinutesPlayed: IslandMetricInput;
	islandsGetAvgMinutesPerPlayer: IslandMetricInput;
	islandsGetPeakCcu: IslandMetricInput;
	islandsGetFavorites: IslandMetricInput;
	islandsGetRecommendations: IslandMetricInput;
	islandsGetRetention: IslandRetentionInput;

	remoteInitiateSession: RemoteSessionInput;
	remoteBatch: RemoteBatchInput;
	remoteCorsPreflight: RemoteCorsInput;
	remoteGetPreset: GetPresetInput;
	remoteGetPresetMetadata: GetPresetMetadataInput;
	remoteGetPresetMetadataKey: GetPresetMetadataKeyInput;
	remotePutPresetMetadataKey: PutPresetMetadataKeyInput;
	remoteDeletePresetMetadataKey: DeletePresetMetadataKeyInput;
	remoteGetPresetProperty: GetPresetPropertyInput;
	remoteUpdatePresetProperty: UpdatePresetPropertyInput;
	remoteInvokePresetFunction: InvokePresetFunctionInput;
	remoteDescribeObject: DescribeObjectInput;
	remoteCallObjectFunction: CallObjectFunctionInput;
	remotePutObjectProperty: PutObjectPropertyInput;
	remoteGetObjectThumbnail: GetObjectThumbnailInput;
	remoteListBlueprintCallableFunctions: ListBlueprintCallableFunctionsInput;
	remoteWaitForObjectEvent: WaitForObjectEventInput;
};

export type EpicGamesEndpointOutputs = {
	[K in keyof EpicGamesEndpointInputs]:
		| z.infer<typeof LooseObjectSchema>
		| z.infer<typeof LooseListSchema>;
};

export const EpicGamesEndpointInputSchemas = {
	islandsList: ListIslandsInputSchema,
	islandsGet: GetIslandInputSchema,
	islandsGetMetricsByInterval: GetIslandMetricsByIntervalInputSchema,
	islandsGetPlays: IslandMetricInputSchema,
	islandsGetUniquePlayers: IslandMetricInputSchema,
	islandsGetMinutesPlayed: IslandMetricInputSchema,
	islandsGetAvgMinutesPerPlayer: IslandMetricInputSchema,
	islandsGetPeakCcu: IslandMetricInputSchema,
	islandsGetFavorites: IslandMetricInputSchema,
	islandsGetRecommendations: IslandMetricInputSchema,
	islandsGetRetention: IslandRetentionInputSchema,

	remoteInitiateSession: RemoteSessionInputSchema,
	remoteBatch: RemoteBatchInputSchema,
	remoteCorsPreflight: RemoteCorsInputSchema,
	remoteGetPreset: GetPresetInputSchema,
	remoteGetPresetMetadata: GetPresetMetadataInputSchema,
	remoteGetPresetMetadataKey: GetPresetMetadataKeyInputSchema,
	remotePutPresetMetadataKey: PutPresetMetadataKeyInputSchema,
	remoteDeletePresetMetadataKey: DeletePresetMetadataKeyInputSchema,
	remoteGetPresetProperty: GetPresetPropertyInputSchema,
	remoteUpdatePresetProperty: UpdatePresetPropertyInputSchema,
	remoteInvokePresetFunction: InvokePresetFunctionInputSchema,
	remoteDescribeObject: DescribeObjectInputSchema,
	remoteCallObjectFunction: CallObjectFunctionInputSchema,
	remotePutObjectProperty: PutObjectPropertyInputSchema,
	remoteGetObjectThumbnail: GetObjectThumbnailInputSchema,
	remoteListBlueprintCallableFunctions:
		ListBlueprintCallableFunctionsInputSchema,
	remoteWaitForObjectEvent: WaitForObjectEventInputSchema,
} as const;

export const EpicGamesEndpointOutputSchemas = {
	islandsList: LooseListSchema,
	islandsGet: LooseObjectSchema,
	islandsGetMetricsByInterval: LooseObjectSchema,
	islandsGetPlays: LooseObjectSchema,
	islandsGetUniquePlayers: LooseObjectSchema,
	islandsGetMinutesPlayed: LooseObjectSchema,
	islandsGetAvgMinutesPerPlayer: LooseObjectSchema,
	islandsGetPeakCcu: LooseObjectSchema,
	islandsGetFavorites: LooseObjectSchema,
	islandsGetRecommendations: LooseObjectSchema,
	islandsGetRetention: LooseObjectSchema,

	remoteInitiateSession: LooseObjectSchema,
	remoteBatch: LooseObjectSchema,
	remoteCorsPreflight: LooseObjectSchema,
	remoteGetPreset: LooseObjectSchema,
	remoteGetPresetMetadata: LooseObjectSchema,
	remoteGetPresetMetadataKey: LooseObjectSchema,
	remotePutPresetMetadataKey: LooseObjectSchema,
	remoteDeletePresetMetadataKey: LooseObjectSchema,
	remoteGetPresetProperty: LooseObjectSchema,
	remoteUpdatePresetProperty: LooseObjectSchema,
	remoteInvokePresetFunction: LooseObjectSchema,
	remoteDescribeObject: LooseObjectSchema,
	remoteCallObjectFunction: LooseObjectSchema,
	remotePutObjectProperty: LooseObjectSchema,
	remoteGetObjectThumbnail: LooseObjectSchema,
	// Filtered list op returns { objectPath, functions, count } — not a raw array
	remoteListBlueprintCallableFunctions: LooseObjectSchema,
	remoteWaitForObjectEvent: LooseObjectSchema,
} as const;
