import { z } from 'zod';
// Deepline OpenAPI v2, fetched 2026-11-16. Provider-defined JSON uses unknown
// because its schema is discovered at runtime, not fixed by this plugin.
export const ToolExecutionLookupSchema = z.looseObject({
	toolId: z.string(),
	requestId: z.string().nullish(),
	executionRecovery: z.looseObject({
		idempotencyKey: z.string(),
		state: z.string(),
		replayed: z.boolean(),
		expiresAt: z.string().nullish(),
	}),
	response: z.record(z.string(), z.unknown()).nullish(),
	responseStatus: z.number().nullish(),
});
export const ErrorResponseSchema = z.looseObject({
	error: z.union([
		z.string(),
		z.looseObject({
			code: z.string().nullish(),
			message: z.string().nullish(),
			resolution: z.string().nullish(),
		}),
	]),
});
export const HealthSchema = z.looseObject({
	status: z.literal('ok'),
	version: z.literal('v2'),
	timestamp: z.string(),
});
export const ToolSchema = z.looseObject({
	toolId: z.string(),
	provider: z.string(),
	operationId: z.string(),
	description: z.string(),
	inputSchema: z.record(z.string(), z.unknown()).nullish(),
	outputSchema: z.record(z.string(), z.unknown()).nullish(),
});
export const ToolCatalogSchema = z.looseObject({ tools: z.array(ToolSchema) });
export const SearchToolSchema = z.looseObject({
	toolId: z.string(),
	provider: z.string(),
	operation: z.string(),
	description: z.string(),
	inputFields: z.array(z.string()).nullish(),
});
export const ToolSearchSchema = z.looseObject({
	tools: z.array(SearchToolSchema),
	count: z.number().optional(),
	total: z.number().optional(),
	offset: z.number().optional(),
	limit: z.number().optional(),
	next_offset: z.number().nullish(),
	truncated: z.boolean().optional(),
	total_is_exact: z.boolean().optional(),
	may_have_more: z.boolean().optional(),
});
export const MonitorToolSchema = z.looseObject({
	toolId: z.string(),
	provider: z.string(),
	description: z.string(),
	kind: z.string(),
	callable: z.literal(false),
	payload_schema: z.record(z.string(), z.unknown()).nullish(),
	streams: z.array(z.record(z.string(), z.unknown())).nullish(),
	variants: z.array(z.record(z.string(), z.unknown())).nullish(),
});
export const ToolDescriptionSchema = z.union([ToolSchema, MonitorToolSchema]);
export const PlaySchema = z.looseObject({
	name: z.string(),
	reference: z.string().nullish(),
	displayName: z.string().nullish(),
	description: z.union([z.string(), z.null()]).nullish(),
	origin: z.string().nullish(),
	ownerType: z.string().nullish(),
	scope: z.string().nullish(),
	inputSchema: z.union([z.record(z.string(), z.unknown()), z.null()]).nullish(),
	outputSchema: z
		.union([z.record(z.string(), z.unknown()), z.null()])
		.nullish(),
	currentRevision: z
		.union([z.record(z.string(), z.unknown()), z.null()])
		.nullish(),
	liveRevision: z
		.union([z.record(z.string(), z.unknown()), z.null()])
		.nullish(),
	canEdit: z.boolean().nullish(),
	canClone: z.boolean().nullish(),
});
export const PlayCatalogSchema = z.looseObject({
	plays: z.array(PlaySchema),
	cursor: z.string().nullish(),
	hasMore: z.boolean().optional(),
	pagination: z
		.looseObject({ cursor: z.string().nullable(), hasMore: z.boolean() })
		.optional(),
});
export const PlayRunPackageSchema = z.looseObject({
	schemaVersion: z.literal(1),
	kind: z.literal('play_run'),
	run: z.looseObject({
		id: z.string(),
		playName: z.string(),
		status: z.string(),
		dashboardUrl: z.string().nullish(),
		runUrl: z.string().nullish(),
	}),
	steps: z.array(z.record(z.string(), z.unknown())),
	outputs: z.record(z.string(), z.unknown()),
	datasets: z.array(z.record(z.string(), z.unknown())),
	next: z.record(z.string(), z.unknown()),
});
export const RunChildrenPageSchema = z.looseObject({
	children: z.array(
		z.looseObject({
			runId: z.string(),
			playName: z.union([z.string(), z.null()]).nullish(),
			launchKey: z.union([z.string(), z.null()]).nullish(),
			status: z.string(),
		}),
	),
	nextCursor: z.union([z.string(), z.null()]),
	hasMore: z.boolean(),
});
export const RunRowHistoryPageSchema = z.looseObject({
	entries: z.array(
		z.looseObject({
			runId: z.string(),
			datasetId: z.string(),
			rowKey: z.string(),
			phase: z.string(),
			generation: z.string(),
			attemptSeq: z.union([z.number(), z.null()]),
			rowVersion: z.union([z.number(), z.null()]),
			inputIndex: z.union([z.number(), z.null()]),
			inputDigest: z.string(),
			status: z.string(),
			data: z.record(z.string(), z.unknown()),
			source: z.record(z.string(), z.unknown()),
			recordedAt: z.string(),
		}),
	),
	nextCursor: z.union([z.string(), z.null()]),
	coverage: z.looseObject({
		complete: z.boolean(),
		expectedRows: z.union([z.number(), z.null()]),
		captureStartedAt: z.union([z.string(), z.null()]),
		captureCompletedAt: z.union([z.string(), z.null()]),
		reason: z.string(),
	}),
});
