import { z } from 'zod';

const MetadataSchema = z.record(z.string(), z.string()).nullable().optional();

// --- Shared objects ---

const EvalObjectSchema = z.object({
	id: z.string(),
	object: z.literal('eval'),
	name: z.string().nullable().optional(),
	created_at: z.number(),
	// data_source_config/testing_criteria shape varies by eval type (custom, logs, stored_completions, etc.); kept loose.
	data_source_config: z.record(z.string(), z.unknown()),
	testing_criteria: z.array(z.record(z.string(), z.unknown())),
	metadata: z.record(z.string(), z.string()).nullable().optional(),
});
export type EvalObject = z.infer<typeof EvalObjectSchema>;

const EvalRunObjectSchema = z.object({
	id: z.string(),
	object: z.literal('eval.run'),
	eval_id: z.string(),
	name: z.string().nullable().optional(),
	created_at: z.number(),
	status: z.string(),
	model: z.string().optional(),
	// data_source shape varies by run type (completions, responses, jsonl, stored_completions); kept loose.
	data_source: z.record(z.string(), z.unknown()).optional(),
	metadata: z.record(z.string(), z.string()).nullable().optional(),
	result_counts: z.record(z.string(), z.number()).optional(),
});
export type EvalRunObject = z.infer<typeof EvalRunObjectSchema>;

// Output item fields (sample, results, datasource_item, etc.) vary by eval/grader type; using catchall to accept them.
const EvalRunOutputItemObjectSchema = z
	.object({
		id: z.string(),
		object: z.literal('eval.run.output_item'),
	})
	.catchall(z.unknown());
export type EvalRunOutputItemObject = z.infer<
	typeof EvalRunOutputItemObjectSchema
>;

// --- Evals ---

export const EvalsCreateInputSchema = z.object({
	name: z.string().optional(),
	// See EvalObjectSchema above: shape varies by eval type, kept loose.
	dataSourceConfig: z.record(z.string(), z.unknown()),
	testingCriteria: z.array(z.record(z.string(), z.unknown())),
	metadata: z.record(z.string(), z.string()).optional(),
});
export type EvalsCreateInput = z.infer<typeof EvalsCreateInputSchema>;
export const EvalsCreateResponseSchema = EvalObjectSchema;
export type EvalsCreateResponse = z.infer<typeof EvalsCreateResponseSchema>;

export const EvalsListInputSchema = z.object({
	after: z.string().optional(),
	limit: z.number().optional(),
	order: z.enum(['asc', 'desc']).optional(),
	orderBy: z.string().optional(),
});
export type EvalsListInput = z.infer<typeof EvalsListInputSchema>;
export const EvalsListResponseSchema = z.object({
	object: z.literal('list'),
	data: z.array(EvalObjectSchema),
	has_more: z.boolean(),
});
export type EvalsListResponse = z.infer<typeof EvalsListResponseSchema>;

export const EvalsGetInputSchema = z.object({ evalId: z.string() });
export type EvalsGetInput = z.infer<typeof EvalsGetInputSchema>;
export const EvalsGetResponseSchema = EvalObjectSchema;
export type EvalsGetResponse = z.infer<typeof EvalsGetResponseSchema>;

export const EvalsUpdateInputSchema = z.object({
	evalId: z.string(),
	name: z.string().optional(),
	metadata: z.record(z.string(), z.string()).optional(),
});
export type EvalsUpdateInput = z.infer<typeof EvalsUpdateInputSchema>;
export const EvalsUpdateResponseSchema = EvalObjectSchema;
export type EvalsUpdateResponse = z.infer<typeof EvalsUpdateResponseSchema>;

export const EvalsDeleteInputSchema = z.object({ evalId: z.string() });
export type EvalsDeleteInput = z.infer<typeof EvalsDeleteInputSchema>;
export const EvalsDeleteResponseSchema = z.object({
	object: z.literal('eval.deleted'),
	deleted: z.boolean(),
	eval_id: z.string(),
});
export type EvalsDeleteResponse = z.infer<typeof EvalsDeleteResponseSchema>;

// --- Eval Runs ---

export const EvalRunsCreateInputSchema = z.object({
	evalId: z.string(),
	name: z.string().optional(),
	// See EvalRunObjectSchema above: data_source shape varies by run type, kept loose.
	dataSource: z.record(z.string(), z.unknown()),
	metadata: z.record(z.string(), z.string()).optional(),
});
export type EvalRunsCreateInput = z.infer<typeof EvalRunsCreateInputSchema>;
export const EvalRunsCreateResponseSchema = EvalRunObjectSchema;
export type EvalRunsCreateResponse = z.infer<
	typeof EvalRunsCreateResponseSchema
>;

export const EvalRunsGetInputSchema = z.object({
	evalId: z.string(),
	runId: z.string(),
});
export type EvalRunsGetInput = z.infer<typeof EvalRunsGetInputSchema>;
export const EvalRunsGetResponseSchema = EvalRunObjectSchema;
export type EvalRunsGetResponse = z.infer<typeof EvalRunsGetResponseSchema>;

export const EvalRunsListInputSchema = z.object({
	evalId: z.string(),
	after: z.string().optional(),
	limit: z.number().optional(),
	order: z.enum(['asc', 'desc']).optional(),
	status: z.string().optional(),
});
export type EvalRunsListInput = z.infer<typeof EvalRunsListInputSchema>;
export const EvalRunsListResponseSchema = z.object({
	object: z.literal('list'),
	data: z.array(EvalRunObjectSchema),
	has_more: z.boolean(),
});
export type EvalRunsListResponse = z.infer<typeof EvalRunsListResponseSchema>;

export const EvalRunsCancelInputSchema = z.object({
	evalId: z.string(),
	runId: z.string(),
});
export type EvalRunsCancelInput = z.infer<typeof EvalRunsCancelInputSchema>;
export const EvalRunsCancelResponseSchema = EvalRunObjectSchema;
export type EvalRunsCancelResponse = z.infer<
	typeof EvalRunsCancelResponseSchema
>;

export const EvalRunsDeleteInputSchema = z.object({
	evalId: z.string(),
	runId: z.string(),
});
export type EvalRunsDeleteInput = z.infer<typeof EvalRunsDeleteInputSchema>;
export const EvalRunsDeleteResponseSchema = z.object({
	object: z.literal('eval.run.deleted'),
	deleted: z.boolean(),
	run_id: z.string(),
});
export type EvalRunsDeleteResponse = z.infer<
	typeof EvalRunsDeleteResponseSchema
>;

export const EvalRunsGetOutputItemInputSchema = z.object({
	evalId: z.string(),
	runId: z.string(),
	outputItemId: z.string(),
});
export type EvalRunsGetOutputItemInput = z.infer<
	typeof EvalRunsGetOutputItemInputSchema
>;
export const EvalRunsGetOutputItemResponseSchema =
	EvalRunOutputItemObjectSchema;
export type EvalRunsGetOutputItemResponse = z.infer<
	typeof EvalRunsGetOutputItemResponseSchema
>;

export const EvalRunsListOutputItemsInputSchema = z.object({
	evalId: z.string(),
	runId: z.string(),
	after: z.string().optional(),
	limit: z.number().optional(),
	status: z.string().optional(),
});
export type EvalRunsListOutputItemsInput = z.infer<
	typeof EvalRunsListOutputItemsInputSchema
>;
export const EvalRunsListOutputItemsResponseSchema = z.object({
	object: z.literal('list'),
	// See EvalRunOutputItemObjectSchema above: fields beyond id vary by eval/grader type, kept loose.
	data: z.array(z.object({ id: z.string() }).catchall(z.unknown())),
	has_more: z.boolean(),
});
export type EvalRunsListOutputItemsResponse = z.infer<
	typeof EvalRunsListOutputItemsResponseSchema
>;

// --- Graders ---

export const GradersRunInputSchema = z.object({
	// Grader config shape varies by grader type (string_check, score_model, python, etc.); kept loose.
	grader: z.record(z.string(), z.unknown()),
	// item is an arbitrary sample record the grader is evaluated against; shape is caller-defined.
	item: z.record(z.string(), z.unknown()).optional(),
	modelSample: z.string(),
});
export type GradersRunInput = z.infer<typeof GradersRunInputSchema>;
// Response fields beyond reward vary by grader type; using catchall to accept whatever the API returns.
export const GradersRunResponseSchema = z
	.object({ reward: z.number().optional() })
	.catchall(z.unknown());
export type GradersRunResponse = z.infer<typeof GradersRunResponseSchema>;

export const GradersValidateInputSchema = z.object({
	// See GradersRunInputSchema above: grader config shape varies by grader type, kept loose.
	grader: z.record(z.string(), z.unknown()),
});
export type GradersValidateInput = z.infer<typeof GradersValidateInputSchema>;
// Echoed grader config (shape varies by grader type) plus any other validation fields; using catchall to accept them.
export const GradersValidateResponseSchema = z
	.object({ grader: z.record(z.string(), z.unknown()).optional() })
	.catchall(z.unknown());
export type GradersValidateResponse = z.infer<
	typeof GradersValidateResponseSchema
>;

// unused re-export kept for symmetry with other schema modules that expose a shared MetadataSchema
export { MetadataSchema as EvalsMetadataSchema };
