import { z } from 'zod';
import { PathSegmentSchema } from './types';

// Run control, run data and customer-database contracts. Shapes follow the
// Deepline SDK (client-core.ts, types.ts, runs/receipts.ts, db/query.ts) and
// the live API as observed on 2026-11-17. Outputs check the key fields and
// keep any extra fields the server adds.

const RunIdSchema = PathSegmentSchema.describe(
	'The run id returned by plays.run, runs.list or runs.history.',
);
const nullableString = z.union([z.string(), z.null()]).nullish();
const nullableNumber = z.union([z.number(), z.null()]).nullish();
const confirmed = <T extends z.ZodType>(value: T) =>
	z.looseObject({ value: z.union([value, z.null()]), confirmed: z.boolean() });

// ── runs.list ──────────────────────────────────────────────────────────────
export const ListRunsInputSchema = z
	.strictObject({
		play: z
			.string()
			.trim()
			.min(1)
			.optional()
			.describe('Saved Play name to list runs for.'),
		status: z
			.string()
			.trim()
			.min(1)
			.optional()
			.describe(
				'Run status to filter by, such as running, queued, waiting, completed, failed or cancelled.',
			),
		runId: z
			.string()
			.trim()
			.min(1)
			.optional()
			.describe('Return only this run id. Unknown ids return HTTP 404.'),
		node: z
			.string()
			.trim()
			.min(1)
			.max(300)
			.optional()
			.describe(
				"Mermaid node id; adds that node's latest settled input and output to each run. Requires play.",
			),
		limit: z
			.number()
			.int()
			.min(1)
			.optional()
			.describe('Maximum runs to return in this page.'),
		offset: z
			.number()
			.int()
			.min(0)
			.optional()
			.describe(
				'Zero-based page offset. A non-zero offset requires play; status-only lists are not paginated.',
			),
	})
	.refine((v) => Boolean(v.play || v.status || v.runId), {
		message: 'runs.list requires play, status or runId',
	})
	.refine((v) => v.node === undefined || Boolean(v.play), {
		message: 'node requires play',
	})
	.refine((v) => !v.offset || Boolean(v.play), {
		message: 'A non-zero offset requires play',
	});
export const RunListItemSchema = z.looseObject({
	runId: z.string(),
	workflowId: z.string().nullish(),
	playName: nullableString,
	parentRunId: nullableString,
	rootRunId: nullableString,
	status: z.string(),
	startedAt: z.union([z.number(), z.string(), z.null()]).nullish(),
	createdAt: z.union([z.number(), z.string(), z.null()]).nullish(),
	finishedAt: z.union([z.number(), z.string(), z.null()]).nullish(),
	billingTotalCredits: z.number().nullish(),
	billingMaxCreditsPerRun: nullableNumber,
});
// Every live response carried `runs`, including empty pages.
export const ListRunsOutputSchema = z.looseObject({
	runs: z.array(RunListItemSchema),
	playName: nullableString,
	total: z.number().optional(),
	offset: z.number().optional(),
	limit: z.number().optional(),
	hasMore: z.boolean().optional(),
});

// ── runs.status ────────────────────────────────────────────────────────────
export const GetRunStatusInputSchema = z.strictObject({ runId: RunIdSchema });
export const GetRunStatusOutputSchema = z.union([
	z.looseObject({ available: z.literal(false), runId: z.string() }),
	z.looseObject({
		available: z.literal(true),
		runId: z.string(),
		lifecycle: z.looseObject({
			status: z.string(),
			updatedAt: z.number(),
			startedAt: nullableNumber,
			finishedAt: nullableNumber,
		}),
		activity: z.record(z.string(), z.unknown()).nullish(),
		calls: z
			.looseObject({
				logicalCalls: confirmed(z.number()),
				providerRequests: confirmed(z.number()),
				provider429s: confirmed(z.number()),
			})
			.optional(),
		steps: z
			.looseObject({
				observed: z.number(),
				running: z.number(),
				completed: z.number(),
				failed: z.number(),
				skipped: z.number(),
				confirmed: z.boolean(),
			})
			.optional(),
		mapStepWork: z.record(z.string(), z.unknown()).optional(),
		datasets: z.record(z.string(), z.unknown()).optional(),
		wait: z.record(z.string(), z.unknown()).optional(),
	}),
]);

// ── runs.input ─────────────────────────────────────────────────────────────
export const GetRunInputDataInputSchema = z.strictObject({
	runId: RunIdSchema,
});
export const GetRunInputDataOutputSchema = z.looseObject({
	runId: z.string(),
	input: z.union([z.record(z.string(), z.unknown()), z.array(z.unknown())]),
	bytes: z.number(),
	sha256: nullableString,
	replayedFromRunId: nullableString,
});

// ── runs.receipts ──────────────────────────────────────────────────────────
export const RECEIPT_BATCH_SIZE = 100;
export const ReceiptKeySchema = z
	.string()
	.max(2048)
	.refine((key) => key.trim().length > 0, {
		message: 'Receipt keys must not be blank',
	})
	.refine((key) => !/[\r\n\0]/.test(key), {
		message: 'Receipt keys must not contain CR, LF or NUL',
	});
export const GetRunReceiptsInputSchema = z.strictObject({
	runId: RunIdSchema,
	keys: z
		.array(ReceiptKeySchema)
		.min(1)
		.max(1000)
		.describe(
			'Receipt keys from exported evidence or execution metadata, at most 2048 characters each. Sent in batches of 100; results keep this order.',
		),
});
export const RunReceiptSchema = z.looseObject({
	receiptKey: z.string(),
	status: z.string().optional(),
	result: z
		.looseObject({
			status: z.string(),
			job_id: z.string().optional(),
			toolResponse: z.record(z.string(), z.unknown()),
		})
		.optional(),
	error: z.looseObject({ code: z.string(), message: z.string() }).optional(),
});
export const GetRunReceiptsOutputSchema = z.looseObject({
	runId: z.string(),
	receipts: z.array(RunReceiptSchema),
});

// ── runs.events ────────────────────────────────────────────────────────────
const isoTimestamp = z.string().refine((v) => !Number.isNaN(Date.parse(v)), {
	message: 'Expected an ISO 8601 timestamp',
});
export const SearchRunEventsInputSchema = z
	.strictObject({
		since: isoTimestamp
			.optional()
			.describe(
				'Inclusive UTC timestamp. Defaults to one hour before the request. A window spans at most seven days; events are kept seven days.',
			),
		until: isoTimestamp
			.optional()
			.describe('Exclusive UTC timestamp. Defaults to the request time.'),
		runId: z
			.string()
			.trim()
			.min(1)
			.optional()
			.describe(
				'Only events for this run. Omit to search the whole workspace.',
			),
		playName: z.string().trim().min(1).optional().describe('Exact Play name.'),
		kind: z
			.string()
			.trim()
			.min(1)
			.optional()
			.describe('Exact dotted event kind, such as step.failed.'),
		jsonpath: z
			.string()
			.min(1)
			.refine((v) => new TextEncoder().encode(v).length <= 512, {
				message: 'jsonpath must be at most 512 bytes',
			})
			.optional()
			.describe(
				'JSONPath equality predicates joined with &&, at most eight and 512 bytes, e.g. $.level == "error".',
			),
		includePayloads: z
			.boolean()
			.optional()
			.describe(
				'Include saved event details and receipt results. Limits the page to ten events.',
			),
		limit: z
			.number()
			.int()
			.min(1)
			.max(200)
			.optional()
			.describe(
				'Page size: default 100, maximum 200; at most 10 with payloads.',
			),
		cursor: z
			.string()
			.min(1)
			.optional()
			.describe(
				'nextCursor from the previous page. Reuse that page’s since, until and filters.',
			),
	})
	.refine((v) => !v.includePayloads || v.limit === undefined || v.limit <= 10, {
		message: 'limit is at most 10 when includePayloads is set',
	});
export const RunEventSchema = z.looseObject({
	eventId: z.string(),
	occurredAt: z.string(),
	ingestedAt: z.string().optional(),
	runId: z.string(),
	playName: z.string().nullish(),
	kind: z.string(),
	level: nullableString,
	message: nullableString,
	searchDoc: z.record(z.string(), z.unknown()).optional(),
	eventPayload: z.record(z.string(), z.unknown()).optional(),
	payload: z.unknown().optional(),
});
export const SearchRunEventsOutputSchema = z.looseObject({
	events: z.array(RunEventSchema),
	nextCursor: z.union([z.string(), z.null()]),
	since: z.string(),
	until: z.string(),
});

// ── runs.billing ───────────────────────────────────────────────────────────
export const GetRunBillingInputSchema = z.strictObject({
	runIds: z
		.array(z.string().trim().min(1))
		.min(1)
		.max(100)
		.describe('One to 100 run ids to read billed credits for.'),
});
export const GetRunBillingOutputSchema = z.looseObject({
	runs: z.array(
		z.looseObject({
			runId: z.string(),
			credits: z.number().optional(),
			settling: z.boolean(),
		}),
	),
});

// ── runs.stop / runs.stopAll ───────────────────────────────────────────────
const stopReason = z
	.string()
	.trim()
	.min(1)
	.max(500)
	.optional()
	.describe('Reason recorded with the stop request.');
export const StopRunInputSchema = z.strictObject({
	runId: RunIdSchema,
	reason: stopReason,
});
export const StopRunOutputSchema = z.looseObject({
	runId: z.string(),
	state: z.string().optional(),
	stopped: z.boolean(),
	cancelling: z.boolean().optional(),
	hitlCancelledCount: z.number().optional(),
	hitlCancellationPending: z.boolean().optional(),
	staleSchedulerState: z.boolean().optional(),
	error: z.string().optional(),
});
export const StopAllRunsInputSchema = z.strictObject({
	dryRun: z
		.boolean()
		.optional()
		.describe(
			'true lists the active runs a stop-all would target without stopping any.',
		),
	reason: stopReason,
});
export const StopAllDryRunOutputSchema = z.looseObject({
	dryRun: z.literal(true),
	scope: z.string(),
	includesChildren: z.boolean(),
	candidateCount: z.number(),
	truncated: z.boolean(),
	runs: z.array(
		z.looseObject({
			runId: z.string(),
			playName: nullableString,
			status: nullableString,
			parentRunId: nullableString,
		}),
	),
});
export const StopAllResultOutputSchema = z.looseObject({
	stopped: z.number(),
	cancelling: z.number().optional(),
	failed: z.number(),
	skipped: z.number(),
	partial: z.boolean().optional(),
	runs: z.array(StopRunOutputSchema.extend({ status: nullableString })),
});
export const StopAllRunsOutputSchema = z.union([
	StopAllDryRunOutputSchema,
	StopAllResultOutputSchema,
]);

// ── runs.rerun / runs.resume ───────────────────────────────────────────────
export const RerunInputSchema = z.strictObject({
	runId: RunIdSchema,
	idempotencyKey: z
		.string()
		.min(1)
		.max(200)
		.regex(/^[\x21-\x7E]+$/)
		.optional()
		.describe(
			'Sent as Idempotency-Key. The same run and key always resolve to the same rerun; reuse it to retry an uncertain call. Omitted: a fresh key is generated for this call.',
		),
	inputOverrides: z
		.record(
			z.string(),
			z.union([z.string(), z.number(), z.boolean(), z.null()]),
		)
		.optional()
		.describe(
			'Scalar edits to fields present in the original input. They apply only to the new run.',
		),
});
export const RerunOutputSchema = z.looseObject({
	runId: z.string(),
	replayedFromRunId: z.string(),
	revisionId: nullableString,
	status: z.string(),
	deduplicated: z.boolean().optional(),
	rateLimited: z.record(z.string(), z.unknown()).nullish(),
	next: z.record(z.string(), z.unknown()).optional(),
});
export const ResumeRunInputSchema = z.strictObject({ runId: RunIdSchema });
export const ResumeRunOutputSchema = z.looseObject({
	runId: z.string(),
	resumed: z.literal(true),
	epoch: z.number(),
});

// ── db.query ───────────────────────────────────────────────────────────────
export const QueryCustomerDbInputSchema = z.strictObject({
	sql: z
		.string()
		.refine((v) => v.trim().length > 0, { message: 'sql must not be empty' })
		.describe(
			'One SQL statement for the workspace customer database. SELECT, EXPLAIN and read-only WITH read permitted schemas; CREATE TABLE, INSERT, UPDATE, DELETE, ALTER, DROP, TRUNCATE and CREATE INDEX change schema-qualified storage tables such as storage.agent_notes.',
		),
	maxRows: z
		.number()
		.int()
		.min(1)
		.max(1000)
		.optional()
		.describe(
			'Maximum rows to return, 1 to 1000. The server also bounds results.',
		),
	operationKey: z
		.string()
		.min(1)
		.max(512)
		.refine((v) => v.trim().length > 0, {
			message: 'operationKey must not be blank',
		})
		.optional()
		.describe(
			'Recovery key for a write. Resend the same SQL, options and key to recover an uncertain result; a new key starts a new operation.',
		),
});
export const QueryCustomerDbOutputSchema = z.looseObject({
	command: z.string(),
	row_count: z.union([z.number().int().min(0), z.null()]),
	row_count_returned: z.number().int().min(0),
	truncated: z.boolean(),
	columns: z.array(z.looseObject({ name: z.string() })),
	rows: z.array(z.unknown()),
	operation: z
		.looseObject({
			operation_key: z.string(),
			completed_at_ms: z.number(),
			source: z.string(),
		})
		.optional(),
	scope: z.looseObject({ kind: z.string() }).optional(),
});
