import { z } from 'zod';
import { SEGMENT_DEFAULT_PAGE_SIZE } from '../client';

// Shapes come from the official spec (v74.1.0) and its examples; routing was
// not verifiable live (Segment checks auth before routing, so every path with
// an invalid token answers the same 403). Outputs are `.loose()` with their
// fields nullish, so a field Segment adds or omits cannot fail a call that
// has already happened. Success bodies are wrapped: `{ data: ... }`.

export { SEGMENT_DEFAULT_PAGE_SIZE };

const PaginationInputSchema = z
	.object({
		count: z
			.number()
			.int()
			.min(1)
			.max(1000)
			.optional()
			.describe(
				`Page size between 1 and 1000. Defaults to ${SEGMENT_DEFAULT_PAGE_SIZE} when omitted.`,
			),
		cursor: z
			.string()
			.optional()
			.describe(
				'Opaque cursor from a previous response (`pagination.next`); omit for the first page.',
			),
	})
	.describe('Cursor paging. Sent as dot-style query params.');

type PaginationInput = z.input<typeof PaginationInputSchema>;

export type SegmentPagination = PaginationInput;

const PaginationOutputSchema = z
	.object({
		current: z.string(),
		// Absent on the last page.
		next: z
			.string()
			.nullish()
			.describe('Cursor for the next page, when there is one.'),
		previous: z.string().nullish(),
		totalEntries: z.number().nullish(),
	})
	.loose();

export type SegmentPaginationOutput = z.infer<typeof PaginationOutputSchema>;

/** Wraps a response body: every success here answers `{ data: ... }`. */
const envelope = <T extends z.ZodType>(inner: T) =>
	z.object({ data: inner }).loose();

// ── Entities ──────────────────────────────────────────────────────────────

const WorkspaceSchema = z
	.object({
		id: z.string().nullish(),
		name: z.string().nullish(),
		slug: z.string().nullish(),
	})
	.loose();

export type SegmentWorkspace = z.infer<typeof WorkspaceSchema>;

const LogosSchema = z
	.object({
		default: z.string().nullish(),
		alt: z.string().nullish(),
		mark: z.string().nullish(),
	})
	.loose();

const LabelSchema = z
	.object({
		key: z.string().nullish(),
		value: z.string().nullish(),
	})
	.loose();

const MetadataOptionSchema = z
	.object({
		name: z.string().nullish(),
		type: z.string().nullish(),
		required: z.boolean().nullish(),
		description: z.string().nullish(),
		// unknown: the default value is typed by the options own type field.
		defaultValue: z.unknown().nullish(),
	})
	.loose();

const SourceMetadataSchema = z
	.object({
		id: z.string().nullish(),
		name: z.string().nullish(),
		slug: z.string().nullish(),
		description: z.string().nullish(),
		logos: LogosSchema.nullish(),
		// unknown: option entries vary by integration; passed through.
		options: z.array(MetadataOptionSchema).nullish(),
		categories: z.array(z.string()).nullish(),
		isCloudEventSource: z.boolean().nullish(),
		status: z.string().nullish(),
		partnerOwned: z.boolean().nullish(),
	})
	.loose();

export type SegmentSourceMetadata = z.infer<typeof SourceMetadataSchema>;

/**
 * `writeKeys` are live credentials (Segment docs: treat them like passwords).
 * They are part of the account's own data, so they stay in the output; the
 * client never copies response bodies into errors, which keeps them out of
 * thrown values and logs.
 */
const SourceSchema = z
	.object({
		id: z.string().nullish(),
		slug: z.string().nullish(),
		name: z.string().nullish(),
		metadata: SourceMetadataSchema.nullish(),
		workspaceId: z.string().nullish(),
		enabled: z.boolean().nullish(),
		writeKeys: z.array(z.string()).nullish(),
		// unknown: instance settings vary per source type.
		settings: z.record(z.string(), z.unknown()).nullish(),
		labels: z.array(LabelSchema).nullish(),
	})
	.loose();

export type SegmentSource = z.infer<typeof SourceSchema>;

const DestinationMetadataSchema = z
	.object({
		id: z.string().nullish(),
		name: z.string().nullish(),
		slug: z.string().nullish(),
		description: z.string().nullish(),
		logos: LogosSchema.nullish(),
		// unknown: the remaining catalog fields (options, actions, presets, ...)
		// are large and integration-specific; passed through.
		// unknown: entries vary per integration.
		options: z.array(z.record(z.string(), z.unknown())).nullish(),
		status: z.string().nullish(),
		categories: z.array(z.string()).nullish(),
		website: z.string().nullish(),
	})
	.loose();

export type SegmentDestinationMetadata = z.infer<
	typeof DestinationMetadataSchema
>;

const DestinationSchema = z
	.object({
		id: z.string().nullish(),
		name: z.string().nullish(),
		enabled: z.boolean().nullish(),
		metadata: DestinationMetadataSchema.nullish(),
		sourceId: z.string().nullish(),
		// unknown: instance settings vary per destination type.
		settings: z.record(z.string(), z.unknown()).nullish(),
	})
	.loose();

export type SegmentDestination = z.infer<typeof DestinationSchema>;

const WarehouseSettingsSchema = z
	.object({
		database: z.string().nullish(),
		host: z.string().nullish(),
		port: z.number().nullish(),
		username: z.string().nullish(),
		password: z.string().nullish(),
	})
	.loose();

const WarehouseMetadataSchema = z
	.object({
		id: z.string().nullish(),
		name: z.string().nullish(),
		slug: z.string().nullish(),
		description: z.string().nullish(),
		logos: LogosSchema.nullish(),
		// unknown: warehouse connection options vary per warehouse type.
		options: z.array(z.record(z.string(), z.unknown())).nullish(),
	})
	.loose();

const WarehouseSchema = z
	.object({
		id: z.string().nullish(),
		metadata: WarehouseMetadataSchema.nullish(),
		workspaceId: z.string().nullish(),
		enabled: z.boolean().nullish(),
		settings: WarehouseSettingsSchema.nullish(),
	})
	.loose();

export type SegmentWarehouse = z.infer<typeof WarehouseSchema>;

export const SEGMENT_TRACKING_PLAN_TYPES = [
	'ENGAGE',
	'LIVE',
	'PROPERTY_LIBRARY',
	'RULE_LIBRARY',
	'TEMPLATE',
] as const;

const TrackingPlanSchema = z
	.object({
		id: z.string().nullish(),
		name: z.string().nullish(),
		slug: z.string().nullish(),
		description: z.string().nullish(),
		type: z.enum(SEGMENT_TRACKING_PLAN_TYPES).nullish(),
		createdAt: z.string().nullish(),
		updatedAt: z.string().nullish(),
	})
	.loose();

export type SegmentTrackingPlan = z.infer<typeof TrackingPlanSchema>;

const RuleSchema = z
	.object({
		id: z.string().nullish(),
		type: z
			.enum(['COMMON', 'GROUP', 'IDENTIFY', 'PAGE', 'SCREEN', 'TRACK'])
			.nullish(),
		key: z.string().nullish(),
		name: z.string().nullish(),
		description: z.string().nullish(),
		version: z.number().nullish(),
		// unknown: a JSON Schema draft object.
		jsonSchema: z.record(z.string(), z.unknown()).nullish(),
	})
	.loose();

export type SegmentRule = z.infer<typeof RuleSchema>;

export const SEGMENT_FUNCTION_RESOURCE_TYPES = [
	'DESTINATION',
	'INSERT_DESTINATION',
	'INSERT_SOURCE',
	'INSERT_TRANSFORMATION',
	'SOURCE',
] as const;

const FunctionSettingSchema = z
	.object({
		name: z.string().nullish(),
		label: z.string().nullish(),
		description: z.string().nullish(),
		type: z.enum(['ARRAY', 'BOOLEAN', 'STRING', 'TEXT_MAP']).nullish(),
		required: z.boolean().nullish(),
		// unknown: the default value is typed by the settings own type field.
		defaultValue: z.unknown().nullish(),
	})
	.loose();

const FunctionItemSchema = z
	.object({
		id: z.string().nullish(),
		resourceType: z.enum(SEGMENT_FUNCTION_RESOURCE_TYPES).nullish(),
		createdAt: z.string().nullish(),
		createdBy: z.string().nullish(),
		displayName: z.string().nullish(),
		description: z.string().nullish(),
		logoUrl: z.string().nullish(),
		catalogId: z.string().nullish(),
	})
	.loose();

const FunctionSchema = z
	.object({
		id: z.string().nullish(),
		resourceType: z.enum(SEGMENT_FUNCTION_RESOURCE_TYPES).nullish(),
		createdAt: z.string().nullish(),
		createdBy: z.string().nullish(),
		code: z.string().nullish(),
		deployedAt: z.string().nullish(),
		settings: z.array(FunctionSettingSchema).nullish(),
		displayName: z.string().nullish(),
		description: z.string().nullish(),
		logoUrl: z.string().nullish(),
		previewWebhookUrl: z.string().nullish(),
		batchMaxCount: z.number().nullish(),
		catalogId: z.string().nullish(),
		isLatestVersion: z.boolean().nullish(),
	})
	.loose();

export type SegmentFunction = z.infer<typeof FunctionSchema>;

const FunctionVersionSchema = z
	.object({
		id: z.string().nullish(),
		author: z.string().nullish(),
		code: z.string().nullish(),
		isDeployed: z.boolean().nullish(),
		createdAt: z.string().nullish(),
		updatedAt: z.string().nullish(),
		deployedAt: z.string().nullish(),
	})
	.loose();

/** Every documented regulation status, on the poll endpoint and list rows. */
export const SEGMENT_REGULATION_STATUSES = [
	'FAILED',
	'FINISHED',
	'INITIALIZED',
	'INVALID',
	'NOT_SUPPORTED',
	'PARTIAL_SUCCESS',
	'RUNNING',
] as const;

const RegulationSchema = z
	.object({
		id: z.string().nullish(),
		workspaceId: z.string().nullish(),
		overallStatus: z.enum(SEGMENT_REGULATION_STATUSES).nullish(),
		createdAt: z.string().nullish(),
		finishedAt: z.string().nullish(),
		// unknown: per-stream rows with their own destination statuses.
		streamStatus: z.array(z.record(z.string(), z.unknown())).nullish(),
	})
	.loose();

export type SegmentRegulation = z.infer<typeof RegulationSchema>;

const RegulationListEntrySchema = z
	.object({
		id: z.string().nullish(),
		subjectType: z.string().nullish(),
		subjects: z.array(z.string()).nullish(),
		// List rows name this field `status`; the poll endpoint uses
		// `overallStatus` on the regulation object.
		status: z.enum(SEGMENT_REGULATION_STATUSES).nullish(),
		createdAt: z.string().nullish(),
		finishedAt: z.string().nullish(),
		regulationType: z
			.enum([
				'DELETE_ARCHIVE_ONLY',
				'DELETE_INTERNAL',
				'DELETE_ONLY',
				'SUPPRESS_ONLY',
				'SUPPRESS_WITH_DELETE',
				'SUPPRESS_WITH_DELETE_INTERNAL',
				'UNSUPPRESS',
			])
			.nullish(),
	})
	.loose();

const DeleteStatusSchema = z.object({
	status: z.literal('SUCCESS'),
});

// ── Shared inputs ─────────────────────────────────────────────────────────

const PaginationArgs = {
	count: PaginationInputSchema.shape.count,
	cursor: PaginationInputSchema.shape.cursor,
};

const IdSchema = z.string().min(1).describe('The resource id.');

// ── workspaces ────────────────────────────────────────────────────────────

const WorkspacesGetInputSchema = z.object({});

const WorkspacesGetResponseSchema = envelope(
	z.object({ workspace: WorkspaceSchema }),
);

// ── sources ───────────────────────────────────────────────────────────────

const SourcesListInputSchema = z.object(PaginationArgs);

const SourcesListResponseSchema = envelope(
	z
		.object({
			sources: z.array(SourceSchema),
			pagination: PaginationOutputSchema,
		})
		.loose(),
);

const SourceIdSchema = IdSchema;

const SourcesGetInputSchema = z.object({ sourceId: SourceIdSchema });

const SourcesGetResponseSchema = envelope(
	z
		.object({
			source: SourceSchema,
			trackingPlanId: z.string().nullish(),
		})
		.loose(),
);

// unknown: instance settings vary per source type; the spec names websiteUrl
// and apiHost as examples but leaves the shape open.
// unknown: a stricter shape would reject settings the API accepts.
const SourceSettingsInputSchema = z.record(z.string(), z.unknown());

const SourcesCreateInputSchema = z.object({
	slug: z.string().min(1).describe('Identifies the Source in the Segment app.'),
	metadataId: z
		.string()
		.min(1)
		.describe('Id of the Source metadata, from `catalog.listSources`.'),
	enabled: z
		.boolean()
		.describe('Whether the Source can send data. Defaults to true.'),
	settings: SourceSettingsInputSchema.optional().describe(
		'Instance-specific settings; required fields come from the metadata options.',
	),
	disconnectAllWarehouses: z
		.boolean()
		.optional()
		.describe(
			'Detach warehouses currently connected to this slug. Destructive to those mappings.',
		),
});

const SourcesCreateResponseSchema = envelope(
	z.object({ source: SourceSchema }),
);

const SourcesUpdateInputSchema = z.object({
	sourceId: SourceIdSchema,
	name: z.string().optional(),
	enabled: z.boolean().optional(),
	slug: z.string().optional(),
	settings: SourceSettingsInputSchema.optional(),
});

const SourcesUpdateResponseSchema = envelope(
	z.object({ source: SourceSchema }),
);

const SourcesDeleteInputSchema = z.object({ sourceId: SourceIdSchema });

const SourcesDeleteResponseSchema = envelope(DeleteStatusSchema);

const SourcesListConnectedDestinationsInputSchema = z.object({
	sourceId: SourceIdSchema,
	...PaginationArgs,
});

const SourcesListConnectedDestinationsResponseSchema = envelope(
	z
		.object({
			destinations: z.array(DestinationSchema),
			pagination: PaginationOutputSchema,
		})
		.loose(),
);

const SourcesListConnectedWarehousesInputSchema = z.object({
	sourceId: SourceIdSchema,
	...PaginationArgs,
});

const SourcesListConnectedWarehousesResponseSchema = envelope(
	z
		.object({
			warehouses: z.array(WarehouseSchema),
			pagination: PaginationOutputSchema,
		})
		.loose(),
);

const SchemaSettingsSchema = z
	.object({
		track: z
			.object({
				allowUnplannedEvents: z.boolean().optional(),
				allowUnplannedEventProperties: z.boolean().optional(),
				allowEventOnViolations: z.boolean().optional(),
				allowPropertiesOnViolations: z.boolean().optional(),
				commonEventOnViolations: z
					.enum(['ALLOW', 'BLOCK', 'OMIT_PROPERTIES'])
					.optional(),
			})
			.optional(),
		identify: z
			.object({
				allowUnplannedTraits: z.boolean().optional(),
				allowTraitsOnViolations: z.boolean().optional(),
				commonEventOnViolations: z
					.enum(['ALLOW', 'BLOCK', 'OMIT_PROPERTIES'])
					.optional(),
			})
			.optional(),
		group: z
			.object({
				allowUnplannedTraits: z.boolean().optional(),
				allowTraitsOnViolations: z.boolean().optional(),
				commonEventOnViolations: z
					.enum(['ALLOW', 'BLOCK', 'OMIT_PROPERTIES'])
					.optional(),
			})
			.optional(),
		forwardingViolationsTo: z.string().optional(),
		forwardingBlockedEventsTo: z.string().optional(),
	})
	.loose();

const SourcesUpdateSchemaSettingsInputSchema = z.object({
	sourceId: SourceIdSchema,
	settings: SchemaSettingsSchema.describe(
		'The schema settings to change; unset keys stay as they are.',
	),
});

const SourcesUpdateSchemaSettingsResponseSchema = envelope(
	z
		.object({
			sourceId: z.string().nullish(),
			// unknown: settings output varies per source type.
			settings: z.record(z.string(), z.unknown()).nullish(),
		})
		.loose(),
);

// POST /sources/{sourceId}/writekey takes no body and returns the updated
// Source, whose `writeKeys` now includes the new key.
const SourcesCreateWriteKeyInputSchema = z.object({
	sourceId: SourceIdSchema,
});

const SourcesCreateWriteKeyResponseSchema = envelope(
	z.object({ source: SourceSchema }),
);

const SourcesRemoveWriteKeyInputSchema = z.object({
	sourceId: SourceIdSchema,
	writeKey: z
		.string()
		.min(1)
		.describe(
			'The write key value itself to delete, from the Source object or `sources.createWriteKey`.',
		),
});

const SourcesRemoveWriteKeyResponseSchema = envelope(DeleteStatusSchema);

// ── destinations ──────────────────────────────────────────────────────────

const DestinationsListInputSchema = z.object(PaginationArgs);

const DestinationsListResponseSchema = envelope(
	z
		.object({
			destinations: z.array(DestinationSchema),
			pagination: PaginationOutputSchema,
		})
		.loose(),
);

const DestinationIdSchema = IdSchema;

const DestinationsGetInputSchema = z.object({
	destinationId: DestinationIdSchema,
});

const DestinationsGetResponseSchema = envelope(
	z.object({ destination: DestinationSchema }),
);

const DestinationsCreateInputSchema = z.object({
	sourceId: IdSchema.describe('The Source to connect this Destination to.'),
	metadataId: z
		.string()
		.min(1)
		.describe(
			'Id of the Destination metadata, from `catalog.listDestinations`.',
		),
	enabled: z.boolean().optional().describe('Defaults to true.'),
	name: z.string().optional().describe('Display name.'),
	settings: z
		// unknown: instance settings vary per destination type.
		.record(z.string(), z.unknown())
		.describe('Required and advanced settings from the metadata options.'),
});

const DestinationsCreateResponseSchema = envelope(
	z.object({ destination: DestinationSchema }),
);

const DestinationsUpdateInputSchema = z.object({
	destinationId: DestinationIdSchema,
	name: z.string().nullish(),
	enabled: z.boolean().optional(),
	// unknown: instance settings vary per destination type.
	settings: z.record(z.string(), z.unknown()).optional(),
});

const DestinationsUpdateResponseSchema = envelope(
	z.object({ destination: DestinationSchema }),
);

const DestinationsDeleteInputSchema = z.object({
	destinationId: DestinationIdSchema,
});

const DestinationsDeleteResponseSchema = envelope(DeleteStatusSchema);

// ── warehouses ────────────────────────────────────────────────────────────

const WarehousesListInputSchema = z.object(PaginationArgs);

const WarehousesListResponseSchema = envelope(
	z
		.object({
			warehouses: z.array(WarehouseSchema),
			pagination: PaginationOutputSchema,
		})
		.loose(),
);

const WarehouseIdSchema = IdSchema;

const WarehousesGetInputSchema = z.object({ warehouseId: WarehouseIdSchema });

const WarehousesGetResponseSchema = envelope(
	z.object({ warehouse: WarehouseSchema }),
);

const WarehousesGetConnectionStateInputSchema = z.object({
	warehouseId: WarehouseIdSchema,
});

const ConnectionStateSchema = z.object({
	connectionState: z.enum(['CONNECTED', 'FAILED']),
});

const WarehousesGetConnectionStateResponseSchema = envelope(
	ConnectionStateSchema,
);

const WarehousesListConnectedSourcesInputSchema = z.object({
	warehouseId: WarehouseIdSchema,
	...PaginationArgs,
});

const WarehousesListConnectedSourcesResponseSchema = envelope(
	z
		.object({
			sources: z.array(SourceSchema),
			pagination: PaginationOutputSchema,
		})
		.loose(),
);

const WarehousesValidateInputSchema = z.object({
	metadataId: z
		.string()
		.min(1)
		.describe('Id of the Warehouse metadata, from a `catalog` lookup.'),
	settings: WarehouseSettingsSchema.describe('The credentials to check.'),
});

const WarehousesValidateResponseSchema = envelope(
	z.object({
		status: z.enum(['CONNECTED', 'FAILED']),
	}),
);

const WarehousesCreateInputSchema = z.object({
	metadataId: z.string().min(1).describe('Id of the Warehouse metadata.'),
	name: z.string().optional(),
	enabled: z.boolean().optional().describe('Defaults to true.'),
	settings: WarehouseSettingsSchema.describe(
		'Credentials and connection settings from the metadata options.',
	),
	disconnectAllSources: z
		.boolean()
		.optional()
		.describe(
			'Detach sources currently connected to this warehouse settings id.',
		),
});

const WarehousesCreateResponseSchema = envelope(
	z.object({ warehouse: WarehouseSchema }),
);

const WarehousesUpdateInputSchema = z.object({
	warehouseId: WarehouseIdSchema,
	name: z.string().optional(),
	enabled: z.boolean().optional(),
	settings: WarehouseSettingsSchema.describe(
		'Required by the API even when only renaming.',
	),
});

const WarehousesUpdateResponseSchema = envelope(
	z.object({ warehouse: WarehouseSchema }),
);

const WarehousesAddSourceConnectionInputSchema = z.object({
	warehouseId: WarehouseIdSchema,
	sourceId: IdSchema,
});

// 201 with `{ data: { status: 'SUCCESS' } }`.
const WarehousesAddSourceConnectionResponseSchema =
	envelope(DeleteStatusSchema);

const WarehousesDeleteInputSchema = z.object({
	warehouseId: WarehouseIdSchema,
});

const WarehousesDeleteResponseSchema = envelope(DeleteStatusSchema);

const WarehousesRemoveSourceConnectionInputSchema = z.object({
	warehouseId: WarehouseIdSchema,
	sourceId: IdSchema,
});

const WarehousesRemoveSourceConnectionResponseSchema =
	envelope(DeleteStatusSchema);

// ── trackingPlans ─────────────────────────────────────────────────────────

const TrackingPlansListInputSchema = z.object({
	type: z.enum(SEGMENT_TRACKING_PLAN_TYPES).optional(),
	...PaginationArgs,
});

const TrackingPlansListResponseSchema = envelope(
	z
		.object({
			trackingPlans: z.array(TrackingPlanSchema),
			pagination: PaginationOutputSchema,
		})
		.loose(),
);

const TrackingPlanIdSchema = IdSchema;

const TrackingPlansGetInputSchema = z.object({
	trackingPlanId: TrackingPlanIdSchema,
});

const TrackingPlansGetResponseSchema = envelope(
	z.object({ trackingPlan: TrackingPlanSchema }),
);

const TrackingPlansListRulesInputSchema = z.object({
	trackingPlanId: TrackingPlanIdSchema,
	...PaginationArgs,
});

const TrackingPlansListRulesResponseSchema = envelope(
	z
		.object({
			rules: z.array(RuleSchema),
			pagination: PaginationOutputSchema,
		})
		.loose(),
);

const TrackingPlansListSourcesInputSchema = z.object({
	trackingPlanId: TrackingPlanIdSchema,
	...PaginationArgs,
});

const TrackingPlansListSourcesResponseSchema = envelope(
	z
		.object({
			sources: z.array(SourceSchema),
			pagination: PaginationOutputSchema,
		})
		.loose(),
);

const TrackingPlansCreateInputSchema = z.object({
	name: z.string().min(1),
	description: z.string().optional(),
	type: z
		.enum(SEGMENT_TRACKING_PLAN_TYPES)
		.describe(
			'The plan type. Most product tracking plans are TEMPLATE; the others serve Segments advanced products.',
		),
});

const TrackingPlansCreateResponseSchema = envelope(
	z.object({ trackingPlan: TrackingPlanSchema }),
);

const TrackingPlansUpdateInputSchema = z.object({
	trackingPlanId: TrackingPlanIdSchema,
	name: z.string().optional(),
	description: z.string().optional(),
});

const TrackingPlansUpdateResponseSchema = envelope(DeleteStatusSchema);

const RuleInputSchema = z
	.object({
		type: z.enum(['COMMON', 'GROUP', 'IDENTIFY', 'PAGE', 'SCREEN', 'TRACK']),
		key: z.string().optional(),
		// unknown: a JSON Schema draft object for the event or trait.
		jsonSchema: z.record(z.string(), z.unknown()),
		version: z.number(),
	})
	.loose();

const TrackingPlansReplaceRulesInputSchema = z.object({
	trackingPlanId: TrackingPlanIdSchema,
	rules: z
		.array(RuleInputSchema)
		.min(1)
		.describe(
			'The complete new rule set: rules absent from this array are removed from the plan.',
		),
});

const TrackingPlansReplaceRulesResponseSchema = envelope(DeleteStatusSchema);

const TrackingPlansAddSourceInputSchema = z.object({
	trackingPlanId: TrackingPlanIdSchema,
	sourceId: IdSchema,
});

const TrackingPlansAddSourceResponseSchema = envelope(DeleteStatusSchema);

const TrackingPlansDeleteInputSchema = z.object({
	trackingPlanId: TrackingPlanIdSchema,
});

const TrackingPlansDeleteResponseSchema = envelope(DeleteStatusSchema);

// The source id travels as a query parameter on this DELETE, not a path id.
const TrackingPlansRemoveSourceInputSchema = z.object({
	trackingPlanId: TrackingPlanIdSchema,
	sourceId: IdSchema,
});

const TrackingPlansRemoveSourceResponseSchema = envelope(DeleteStatusSchema);

// ── functions ─────────────────────────────────────────────────────────────

const FunctionsListInputSchema = z.object({
	resourceType: z
		.enum(SEGMENT_FUNCTION_RESOURCE_TYPES)
		.describe('Only functions of this type are returned.'),
	...PaginationArgs,
});

const FunctionsListResponseSchema = envelope(
	z
		.object({
			functions: z.array(FunctionItemSchema),
			pagination: PaginationOutputSchema,
		})
		.loose(),
);

const FunctionIdSchema = IdSchema;

const FunctionsGetInputSchema = z.object({ functionId: FunctionIdSchema });

// The spec marks this field nullable.
const FunctionsGetResponseSchema = envelope(
	z.object({ function: FunctionSchema.nullish() }),
);

const FunctionsListVersionsInputSchema = z.object({
	functionId: FunctionIdSchema,
	...PaginationArgs,
});

const FunctionsListVersionsResponseSchema = envelope(
	z
		.object({
			versions: z.array(FunctionVersionSchema),
			pagination: PaginationOutputSchema,
		})
		.loose(),
);

const FunctionsGetVersionInputSchema = z.object({
	functionId: FunctionIdSchema,
	versionId: IdSchema,
});

const FunctionsGetVersionResponseSchema = envelope(
	z.object({ version: FunctionVersionSchema }),
);

const FunctionsCreateInputSchema = z.object({
	code: z.string().min(1).describe('The JavaScript function source.'),
	displayName: z.string().min(1),
	resourceType: z.enum(SEGMENT_FUNCTION_RESOURCE_TYPES),
	settings: z
		.array(FunctionSettingSchema)
		.optional()
		.describe(
			'Settings the function reads, such as API keys for the service it calls.',
		),
	logoUrl: z.string().optional(),
	description: z.string().optional(),
});

const FunctionsCreateResponseSchema = envelope(
	z.object({ function: FunctionSchema }),
);

const FunctionsUpdateInputSchema = z.object({
	functionId: FunctionIdSchema,
	code: z.string().optional(),
	displayName: z.string().optional(),
	settings: z.array(FunctionSettingSchema).optional(),
	logoUrl: z.string().optional(),
	description: z.string().optional(),
});

const FunctionsUpdateResponseSchema = envelope(
	z.object({ function: FunctionSchema }),
);

const FunctionsDeployInputSchema = z.object({
	functionId: FunctionIdSchema,
});

const FunctionsDeployResponseSchema = envelope(
	z.object({
		functionDeployment: z.object({
			status: z.literal('SUCCESS'),
		}),
	}),
);

const FunctionsRestoreVersionInputSchema = z.object({
	functionId: FunctionIdSchema,
	versionId: IdSchema,
});

const FunctionsRestoreVersionResponseSchema = envelope(
	z.object({ version: FunctionVersionSchema }),
);

const FunctionsDeleteInputSchema = z.object({ functionId: FunctionIdSchema });

const FunctionsDeleteResponseSchema = envelope(DeleteStatusSchema);

// ── catalog ───────────────────────────────────────────────────────────────

const CatalogListDestinationsInputSchema = z.object(PaginationArgs);

const CatalogListDestinationsResponseSchema = envelope(
	z
		.object({
			destinationsCatalog: z.array(DestinationMetadataSchema),
			pagination: PaginationOutputSchema,
		})
		.loose(),
);

const CatalogGetDestinationInputSchema = z.object({
	destinationMetadataId: IdSchema,
});

const CatalogGetDestinationResponseSchema = envelope(
	z.object({ destinationMetadata: DestinationMetadataSchema }),
);

const CatalogListSourcesInputSchema = z.object(PaginationArgs);

const CatalogListSourcesResponseSchema = envelope(
	z
		.object({
			sourcesCatalog: z.array(SourceMetadataSchema),
			pagination: PaginationOutputSchema,
		})
		.loose(),
);

const CatalogGetSourceInputSchema = z.object({
	sourceMetadataId: IdSchema,
});

const CatalogGetSourceResponseSchema = envelope(
	z.object({ sourceMetadata: SourceMetadataSchema }),
);

// ── regulations ───────────────────────────────────────────────────────────

export const SEGMENT_REGULATION_TYPES = [
	'DELETE_INTERNAL',
	'DELETE_ONLY',
	'SUPPRESS_ONLY',
	'SUPPRESS_WITH_DELETE',
	'SUPPRESS_WITH_DELETE_INTERNAL',
	'UNSUPPRESS',
] as const;

const RegulationsListInputSchema = z.object({
	status: z.enum(SEGMENT_REGULATION_STATUSES).optional(),
	regulationTypes: z
		.array(z.enum(SEGMENT_REGULATION_TYPES))
		.min(1)
		.optional()
		.describe('Only regulations of these types.'),
	...PaginationArgs,
});

const RegulationsListResponseSchema = envelope(
	z
		.object({
			regulations: z.array(RegulationListEntrySchema),
			pagination: PaginationOutputSchema,
		})
		.loose(),
);

const RegulationPayloadFields = {
	regulationType: z.enum(SEGMENT_REGULATION_TYPES),
	subjectType: z
		.enum(['OBJECT_ID', 'USER_ID'])
		.describe('Use `objectId` for cloud source regulations.'),
	subjectIds: z
		.array(z.string().min(1))
		.min(1)
		.describe('The `userId` or `objectId` values to regulate.'),
};

const RegulationsCreateInputSchema = z.object({
	...RegulationPayloadFields,
});

const RegulationsCreateResponseSchema = envelope(
	z.object({
		regulateId: z.string().describe('Poll `regulations.get` with this id.'),
	}),
);

const RegulationsGetInputSchema = z.object({
	regulateId: IdSchema,
});

const RegulationsGetResponseSchema = envelope(
	z.object({ regulation: RegulationSchema }),
);

// ── Registry ──────────────────────────────────────────────────────────────

export type SegmentEndpointInputs = {
	workspacesGet: {};
	sourcesList: z.input<typeof SourcesListInputSchema>;
	sourcesGet: z.input<typeof SourcesGetInputSchema>;
	sourcesCreate: z.input<typeof SourcesCreateInputSchema>;
	sourcesUpdate: z.input<typeof SourcesUpdateInputSchema>;
	sourcesDelete: z.input<typeof SourcesDeleteInputSchema>;
	sourcesListConnectedDestinations: z.input<
		typeof SourcesListConnectedDestinationsInputSchema
	>;
	sourcesListConnectedWarehouses: z.input<
		typeof SourcesListConnectedWarehousesInputSchema
	>;
	sourcesUpdateSchemaSettings: z.input<
		typeof SourcesUpdateSchemaSettingsInputSchema
	>;
	sourcesCreateWriteKey: z.input<typeof SourcesCreateWriteKeyInputSchema>;
	sourcesRemoveWriteKey: z.input<typeof SourcesRemoveWriteKeyInputSchema>;
	destinationsList: z.input<typeof DestinationsListInputSchema>;
	destinationsGet: z.input<typeof DestinationsGetInputSchema>;
	destinationsCreate: z.input<typeof DestinationsCreateInputSchema>;
	destinationsUpdate: z.input<typeof DestinationsUpdateInputSchema>;
	destinationsDelete: z.input<typeof DestinationsDeleteInputSchema>;
	warehousesList: z.input<typeof WarehousesListInputSchema>;
	warehousesGet: z.input<typeof WarehousesGetInputSchema>;
	warehousesGetConnectionState: z.input<
		typeof WarehousesGetConnectionStateInputSchema
	>;
	warehousesListConnectedSources: z.input<
		typeof WarehousesListConnectedSourcesInputSchema
	>;
	warehousesValidate: z.input<typeof WarehousesValidateInputSchema>;
	warehousesCreate: z.input<typeof WarehousesCreateInputSchema>;
	warehousesUpdate: z.input<typeof WarehousesUpdateInputSchema>;
	warehousesAddSourceConnection: z.input<
		typeof WarehousesAddSourceConnectionInputSchema
	>;
	warehousesDelete: z.input<typeof WarehousesDeleteInputSchema>;
	warehousesRemoveSourceConnection: z.input<
		typeof WarehousesRemoveSourceConnectionInputSchema
	>;
	trackingPlansList: z.input<typeof TrackingPlansListInputSchema>;
	trackingPlansGet: z.input<typeof TrackingPlansGetInputSchema>;
	trackingPlansListRules: z.input<typeof TrackingPlansListRulesInputSchema>;
	trackingPlansListSources: z.input<typeof TrackingPlansListSourcesInputSchema>;
	trackingPlansCreate: z.input<typeof TrackingPlansCreateInputSchema>;
	trackingPlansUpdate: z.input<typeof TrackingPlansUpdateInputSchema>;
	trackingPlansReplaceRules: z.input<
		typeof TrackingPlansReplaceRulesInputSchema
	>;
	trackingPlansAddSource: z.input<typeof TrackingPlansAddSourceInputSchema>;
	trackingPlansDelete: z.input<typeof TrackingPlansDeleteInputSchema>;
	trackingPlansRemoveSource: z.input<
		typeof TrackingPlansRemoveSourceInputSchema
	>;
	functionsList: z.input<typeof FunctionsListInputSchema>;
	functionsGet: z.input<typeof FunctionsGetInputSchema>;
	functionsListVersions: z.input<typeof FunctionsListVersionsInputSchema>;
	functionsGetVersion: z.input<typeof FunctionsGetVersionInputSchema>;
	functionsCreate: z.input<typeof FunctionsCreateInputSchema>;
	functionsUpdate: z.input<typeof FunctionsUpdateInputSchema>;
	functionsDeploy: z.input<typeof FunctionsDeployInputSchema>;
	functionsRestoreVersion: z.input<typeof FunctionsRestoreVersionInputSchema>;
	functionsDelete: z.input<typeof FunctionsDeleteInputSchema>;
	catalogListDestinations: z.input<typeof CatalogListDestinationsInputSchema>;
	catalogGetDestination: z.input<typeof CatalogGetDestinationInputSchema>;
	catalogListSources: z.input<typeof CatalogListSourcesInputSchema>;
	catalogGetSource: z.input<typeof CatalogGetSourceInputSchema>;
	regulationsList: z.input<typeof RegulationsListInputSchema>;
	regulationsCreate: z.input<typeof RegulationsCreateInputSchema>;
	regulationsGet: z.input<typeof RegulationsGetInputSchema>;
};

export type SegmentEndpointOutputs = {
	workspacesGet: z.infer<typeof WorkspacesGetResponseSchema>;
	sourcesList: z.infer<typeof SourcesListResponseSchema>;
	sourcesGet: z.infer<typeof SourcesGetResponseSchema>;
	sourcesCreate: z.infer<typeof SourcesCreateResponseSchema>;
	sourcesUpdate: z.infer<typeof SourcesUpdateResponseSchema>;
	sourcesDelete: z.infer<typeof SourcesDeleteResponseSchema>;
	sourcesListConnectedDestinations: z.infer<
		typeof SourcesListConnectedDestinationsResponseSchema
	>;
	sourcesListConnectedWarehouses: z.infer<
		typeof SourcesListConnectedWarehousesResponseSchema
	>;
	sourcesUpdateSchemaSettings: z.infer<
		typeof SourcesUpdateSchemaSettingsResponseSchema
	>;
	sourcesCreateWriteKey: z.infer<typeof SourcesCreateWriteKeyResponseSchema>;
	sourcesRemoveWriteKey: z.infer<typeof SourcesRemoveWriteKeyResponseSchema>;
	destinationsList: z.infer<typeof DestinationsListResponseSchema>;
	destinationsGet: z.infer<typeof DestinationsGetResponseSchema>;
	destinationsCreate: z.infer<typeof DestinationsCreateResponseSchema>;
	destinationsUpdate: z.infer<typeof DestinationsUpdateResponseSchema>;
	destinationsDelete: z.infer<typeof DestinationsDeleteResponseSchema>;
	warehousesList: z.infer<typeof WarehousesListResponseSchema>;
	warehousesGet: z.infer<typeof WarehousesGetResponseSchema>;
	warehousesGetConnectionState: z.infer<
		typeof WarehousesGetConnectionStateResponseSchema
	>;
	warehousesListConnectedSources: z.infer<
		typeof WarehousesListConnectedSourcesResponseSchema
	>;
	warehousesValidate: z.infer<typeof WarehousesValidateResponseSchema>;
	warehousesCreate: z.infer<typeof WarehousesCreateResponseSchema>;
	warehousesUpdate: z.infer<typeof WarehousesUpdateResponseSchema>;
	warehousesAddSourceConnection: z.infer<
		typeof WarehousesAddSourceConnectionResponseSchema
	>;
	warehousesDelete: z.infer<typeof WarehousesDeleteResponseSchema>;
	warehousesRemoveSourceConnection: z.infer<
		typeof WarehousesRemoveSourceConnectionResponseSchema
	>;
	trackingPlansList: z.infer<typeof TrackingPlansListResponseSchema>;
	trackingPlansGet: z.infer<typeof TrackingPlansGetResponseSchema>;
	trackingPlansListRules: z.infer<typeof TrackingPlansListRulesResponseSchema>;
	trackingPlansListSources: z.infer<
		typeof TrackingPlansListSourcesResponseSchema
	>;
	trackingPlansCreate: z.infer<typeof TrackingPlansCreateResponseSchema>;
	trackingPlansUpdate: z.infer<typeof TrackingPlansUpdateResponseSchema>;
	trackingPlansReplaceRules: z.infer<
		typeof TrackingPlansReplaceRulesResponseSchema
	>;
	trackingPlansAddSource: z.infer<typeof TrackingPlansAddSourceResponseSchema>;
	trackingPlansDelete: z.infer<typeof TrackingPlansDeleteResponseSchema>;
	trackingPlansRemoveSource: z.infer<
		typeof TrackingPlansRemoveSourceResponseSchema
	>;
	functionsList: z.infer<typeof FunctionsListResponseSchema>;
	functionsGet: z.infer<typeof FunctionsGetResponseSchema>;
	functionsListVersions: z.infer<typeof FunctionsListVersionsResponseSchema>;
	functionsGetVersion: z.infer<typeof FunctionsGetVersionResponseSchema>;
	functionsCreate: z.infer<typeof FunctionsCreateResponseSchema>;
	functionsUpdate: z.infer<typeof FunctionsUpdateResponseSchema>;
	functionsDeploy: z.infer<typeof FunctionsDeployResponseSchema>;
	functionsRestoreVersion: z.infer<
		typeof FunctionsRestoreVersionResponseSchema
	>;
	functionsDelete: z.infer<typeof FunctionsDeleteResponseSchema>;
	catalogListDestinations: z.infer<
		typeof CatalogListDestinationsResponseSchema
	>;
	catalogGetDestination: z.infer<typeof CatalogGetDestinationResponseSchema>;
	catalogListSources: z.infer<typeof CatalogListSourcesResponseSchema>;
	catalogGetSource: z.infer<typeof CatalogGetSourceResponseSchema>;
	regulationsList: z.infer<typeof RegulationsListResponseSchema>;
	regulationsCreate: z.infer<typeof RegulationsCreateResponseSchema>;
	regulationsGet: z.infer<typeof RegulationsGetResponseSchema>;
};

export const SegmentEndpointInputSchemas = {
	workspacesGet: WorkspacesGetInputSchema,
	sourcesList: SourcesListInputSchema,
	sourcesGet: SourcesGetInputSchema,
	sourcesCreate: SourcesCreateInputSchema,
	sourcesUpdate: SourcesUpdateInputSchema,
	sourcesDelete: SourcesDeleteInputSchema,
	sourcesListConnectedDestinations: SourcesListConnectedDestinationsInputSchema,
	sourcesListConnectedWarehouses: SourcesListConnectedWarehousesInputSchema,
	sourcesUpdateSchemaSettings: SourcesUpdateSchemaSettingsInputSchema,
	sourcesCreateWriteKey: SourcesCreateWriteKeyInputSchema,
	sourcesRemoveWriteKey: SourcesRemoveWriteKeyInputSchema,
	destinationsList: DestinationsListInputSchema,
	destinationsGet: DestinationsGetInputSchema,
	destinationsCreate: DestinationsCreateInputSchema,
	destinationsUpdate: DestinationsUpdateInputSchema,
	destinationsDelete: DestinationsDeleteInputSchema,
	warehousesList: WarehousesListInputSchema,
	warehousesGet: WarehousesGetInputSchema,
	warehousesGetConnectionState: WarehousesGetConnectionStateInputSchema,
	warehousesListConnectedSources: WarehousesListConnectedSourcesInputSchema,
	warehousesValidate: WarehousesValidateInputSchema,
	warehousesCreate: WarehousesCreateInputSchema,
	warehousesUpdate: WarehousesUpdateInputSchema,
	warehousesAddSourceConnection: WarehousesAddSourceConnectionInputSchema,
	warehousesDelete: WarehousesDeleteInputSchema,
	warehousesRemoveSourceConnection: WarehousesRemoveSourceConnectionInputSchema,
	trackingPlansList: TrackingPlansListInputSchema,
	trackingPlansGet: TrackingPlansGetInputSchema,
	trackingPlansListRules: TrackingPlansListRulesInputSchema,
	trackingPlansListSources: TrackingPlansListSourcesInputSchema,
	trackingPlansCreate: TrackingPlansCreateInputSchema,
	trackingPlansUpdate: TrackingPlansUpdateInputSchema,
	trackingPlansReplaceRules: TrackingPlansReplaceRulesInputSchema,
	trackingPlansAddSource: TrackingPlansAddSourceInputSchema,
	trackingPlansDelete: TrackingPlansDeleteInputSchema,
	trackingPlansRemoveSource: TrackingPlansRemoveSourceInputSchema,
	functionsList: FunctionsListInputSchema,
	functionsGet: FunctionsGetInputSchema,
	functionsListVersions: FunctionsListVersionsInputSchema,
	functionsGetVersion: FunctionsGetVersionInputSchema,
	functionsCreate: FunctionsCreateInputSchema,
	functionsUpdate: FunctionsUpdateInputSchema,
	functionsDeploy: FunctionsDeployInputSchema,
	functionsRestoreVersion: FunctionsRestoreVersionInputSchema,
	functionsDelete: FunctionsDeleteInputSchema,
	catalogListDestinations: CatalogListDestinationsInputSchema,
	catalogGetDestination: CatalogGetDestinationInputSchema,
	catalogListSources: CatalogListSourcesInputSchema,
	catalogGetSource: CatalogGetSourceInputSchema,
	regulationsList: RegulationsListInputSchema,
	regulationsCreate: RegulationsCreateInputSchema,
	regulationsGet: RegulationsGetInputSchema,
} as const;

export const SegmentEndpointOutputSchemas = {
	workspacesGet: WorkspacesGetResponseSchema,
	sourcesList: SourcesListResponseSchema,
	sourcesGet: SourcesGetResponseSchema,
	sourcesCreate: SourcesCreateResponseSchema,
	sourcesUpdate: SourcesUpdateResponseSchema,
	sourcesDelete: SourcesDeleteResponseSchema,
	sourcesListConnectedDestinations:
		SourcesListConnectedDestinationsResponseSchema,
	sourcesListConnectedWarehouses: SourcesListConnectedWarehousesResponseSchema,
	sourcesUpdateSchemaSettings: SourcesUpdateSchemaSettingsResponseSchema,
	sourcesCreateWriteKey: SourcesCreateWriteKeyResponseSchema,
	sourcesRemoveWriteKey: SourcesRemoveWriteKeyResponseSchema,
	destinationsList: DestinationsListResponseSchema,
	destinationsGet: DestinationsGetResponseSchema,
	destinationsCreate: DestinationsCreateResponseSchema,
	destinationsUpdate: DestinationsUpdateResponseSchema,
	destinationsDelete: DestinationsDeleteResponseSchema,
	warehousesList: WarehousesListResponseSchema,
	warehousesGet: WarehousesGetResponseSchema,
	warehousesGetConnectionState: WarehousesGetConnectionStateResponseSchema,
	warehousesListConnectedSources: WarehousesListConnectedSourcesResponseSchema,
	warehousesValidate: WarehousesValidateResponseSchema,
	warehousesCreate: WarehousesCreateResponseSchema,
	warehousesUpdate: WarehousesUpdateResponseSchema,
	warehousesAddSourceConnection: WarehousesAddSourceConnectionResponseSchema,
	warehousesDelete: WarehousesDeleteResponseSchema,
	warehousesRemoveSourceConnection:
		WarehousesRemoveSourceConnectionResponseSchema,
	trackingPlansList: TrackingPlansListResponseSchema,
	trackingPlansGet: TrackingPlansGetResponseSchema,
	trackingPlansListRules: TrackingPlansListRulesResponseSchema,
	trackingPlansListSources: TrackingPlansListSourcesResponseSchema,
	trackingPlansCreate: TrackingPlansCreateResponseSchema,
	trackingPlansUpdate: TrackingPlansUpdateResponseSchema,
	trackingPlansReplaceRules: TrackingPlansReplaceRulesResponseSchema,
	trackingPlansAddSource: TrackingPlansAddSourceResponseSchema,
	trackingPlansDelete: TrackingPlansDeleteResponseSchema,
	trackingPlansRemoveSource: TrackingPlansRemoveSourceResponseSchema,
	functionsList: FunctionsListResponseSchema,
	functionsGet: FunctionsGetResponseSchema,
	functionsListVersions: FunctionsListVersionsResponseSchema,
	functionsGetVersion: FunctionsGetVersionResponseSchema,
	functionsCreate: FunctionsCreateResponseSchema,
	functionsUpdate: FunctionsUpdateResponseSchema,
	functionsDeploy: FunctionsDeployResponseSchema,
	functionsRestoreVersion: FunctionsRestoreVersionResponseSchema,
	functionsDelete: FunctionsDeleteResponseSchema,
	catalogListDestinations: CatalogListDestinationsResponseSchema,
	catalogGetDestination: CatalogGetDestinationResponseSchema,
	catalogListSources: CatalogListSourcesResponseSchema,
	catalogGetSource: CatalogGetSourceResponseSchema,
	regulationsList: RegulationsListResponseSchema,
	regulationsCreate: RegulationsCreateResponseSchema,
	regulationsGet: RegulationsGetResponseSchema,
} as const;
