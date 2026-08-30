import { z } from 'zod';
import { BubbleListResponse, BubbleThingEntity } from '../schema/database';

/**
 * A Bubble thing's editable fields. Bubble field names are set in the
 * app's Data Type editor and often contain spaces ("Unit name"), so the
 * keys are free-form. Values must match the field's type (string, number,
 * boolean, list, ...) - Bubble does the validation server-side.
 */
const ThingFieldsSchema = z.record(z.string(), z.unknown());

/**
 * A single Data API list constraint - the same object a "Do a search for"
 * step uses in the editor. Serialized as JSON into the `constraints` query
 * parameter by the list endpoint.
 * https://manual.bubble.io/core-resources/api/the-bubble-api/the-data-api/data-api-requests.md
 */
const BubbleConstraintSchema = z.object({
	/** Field key to test. */
	key: z.string(),
	/** e.g. `equals`, `greater than`, `text contains`, `is_empty`. */
	constraint_type: z.string(),
	/** Compare value. */
	value: z.union([z.string(), z.number(), z.boolean()]),
});

/**
 * The list request accepted by the Data API. `cursor`/`limit` paginate;
 * `constraints`, `sortField`, `descending`, `excludeRemaining`, and
 * `additionalSortFields` narrow/order the result. Both `constraints` and
 * `additionalSortFields` are arrays that Bubble expects JSON-encoded in the
 * URL query string - the endpoint serializes them.
 */
const ThingsListInputSchema = z.object({
	typeName: z.string(),
	/** Rank of the first item to return (Bubble's `cursor`). */
	cursor: z.number().int().min(0).optional(),
	/** Number of items to return per request. */
	limit: z.number().int().min(1).max(100).optional(),
	constraints: z.array(BubbleConstraintSchema).optional(),
	/** Field key to sort by. Defaults to creation date. */
	sortField: z.string().optional(),
	/** Sort descending (Bubble generally requires this set for text field sorts). */
	descending: z.boolean().optional(),
	/** Skip counting the remaining records (saves capacity on large apps). */
	excludeRemaining: z.boolean().optional(),
	/** Extra sort fields, each `{ sortField, descending }`. */
	additionalSortFields: z
		.array(
			z.object({
				sortField: z.string(),
				descending: z.boolean().optional(),
			}),
		)
		.optional(),
});
export type ThingsListInput = z.infer<typeof ThingsListInputSchema>;

const ThingsGetInputSchema = z.object({
	typeName: z.string(),
	/** The record's unique ID. */
	thingId: z.string(),
});
export type ThingsGetInput = z.infer<typeof ThingsGetInputSchema>;

const ThingsCreateInputSchema = z.object({
	typeName: z.string(),
	/** Field values for the new thing. */
	fields: ThingFieldsSchema,
});
export type ThingsCreateInput = z.infer<typeof ThingsCreateInputSchema>;

const ThingsBulkCreateInputSchema = z.object({
	typeName: z.string(),
	/** Records to create; each is sent as one JSON line. Max 1,000. */
	records: z.array(ThingFieldsSchema).min(1).max(1000),
});
export type ThingsBulkCreateInput = z.infer<typeof ThingsBulkCreateInputSchema>;

const ThingsUpdateInputSchema = z.object({
	typeName: z.string(),
	thingId: z.string(),
	/** Partial field values (unchanged fields keep their values). */
	fields: ThingFieldsSchema,
});
export type ThingsUpdateInput = z.infer<typeof ThingsUpdateInputSchema>;

const ThingsReplaceInputSchema = z.object({
	typeName: z.string(),
	thingId: z.string(),
	/**
	 * Full field values - PUT overwrites every editable field, and anything
	 * omitted is reset to empty/default. Prefer `things.update` for partial
	 * writes.
	 */
	fields: ThingFieldsSchema,
});
export type ThingsReplaceInput = z.infer<typeof ThingsReplaceInputSchema>;

const ThingsDeleteInputSchema = z.object({
	typeName: z.string(),
	thingId: z.string(),
});
export type ThingsDeleteInput = z.infer<typeof ThingsDeleteInputSchema>;

const WorkflowsRunInputSchema = z.object({
	/** API workflow name - it has no spaces and is also the URL endpoint. */
	workflowName: z.string(),
	/** Parameters defined on the workflow, sent as JSON in the POST body. */
	params: z.record(z.string(), z.unknown()).optional(),
});
export type WorkflowsRunInput = z.infer<typeof WorkflowsRunInputSchema>;

/* -------------------------------------------------------------------------- */
/*                                   Outputs                                  */
/* -------------------------------------------------------------------------- */

const ThingsCreateOutputSchema = z
	.object({
		status: z.literal('success'),
		/** Unique ID of the created thing. */
		id: z.string(),
	})
	.loose();
export type ThingsCreateOutput = z.infer<typeof ThingsCreateOutputSchema>;

/**
 * One line of a bulk-create response. Capture of a real 200 body
 * (text/plain, one JSON object per line):
 * `{"status":"success","id":"..."}` or `{"status":"error","message":"..."}`.
 */
const BubbleBulkItemSchema = z
	.object({
		status: z.string(),
		id: z.string().optional(),
		message: z.string().optional(),
	})
	.loose();

const ThingsBulkCreateOutputSchema = z.object({
	/** Number of lines parsed from the response (one per input record). */
	count: z.number(),
	items: z.array(BubbleBulkItemSchema),
});
export type ThingsBulkCreateOutput = z.infer<
	typeof ThingsBulkCreateOutputSchema
>;

/**
 * The Workflow API answers with the data defined by the workflow's
 * "Return data from API" action (default a `{"status":"success"}` JSON
 * envelope); `.loose()` lets any configured custom payload pass through.
 */
const WorkflowsRunOutputSchema = z
	.object({ status: z.string().nullable().optional() })
	.loose();
export type WorkflowsRunOutput = z.infer<typeof WorkflowsRunOutputSchema>;

export type BubbleEndpointInputs = {
	thingsGet: ThingsGetInput;
	thingsList: ThingsListInput;
	thingsCreate: ThingsCreateInput;
	thingsBulkCreate: ThingsBulkCreateInput;
	thingsUpdate: ThingsUpdateInput;
	thingsReplace: ThingsReplaceInput;
	thingsDelete: ThingsDeleteInput;
	workflowsRun: WorkflowsRunInput;
};

export type BubbleEndpointOutputs = {
	thingsGet: z.infer<typeof BubbleThingEntity>;
	thingsList: z.infer<typeof BubbleListResponse>;
	thingsCreate: ThingsCreateOutput;
	thingsBulkCreate: ThingsBulkCreateOutput;
	thingsUpdate: void;
	thingsReplace: void;
	thingsDelete: void;
	workflowsRun: WorkflowsRunOutput;
};

export const BubbleEndpointInputSchemas = {
	thingsGet: ThingsGetInputSchema,
	thingsList: ThingsListInputSchema,
	thingsCreate: ThingsCreateInputSchema,
	thingsBulkCreate: ThingsBulkCreateInputSchema,
	thingsUpdate: ThingsUpdateInputSchema,
	thingsReplace: ThingsReplaceInputSchema,
	thingsDelete: ThingsDeleteInputSchema,
	workflowsRun: WorkflowsRunInputSchema,
} as const;

export const BubbleEndpointOutputSchemas = {
	thingsGet: BubbleThingEntity,
	thingsList: BubbleListResponse,
	thingsCreate: ThingsCreateOutputSchema,
	thingsBulkCreate: ThingsBulkCreateOutputSchema,
	thingsUpdate: z.void(),
	thingsReplace: z.void(),
	thingsDelete: z.void(),
	workflowsRun: WorkflowsRunOutputSchema,
} as const;
