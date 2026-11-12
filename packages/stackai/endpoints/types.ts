import { z } from 'zod';

// Workflow input/output and API metadata are provider-defined JSON objects.
const jsonObject = z.record(z.string(), z.unknown());
const pathId = z
	.string()
	.min(1)
	.refine(
		(id) => id !== '.' && id !== '..' && !/[\\/"']/.test(id),
		'Invalid path segment',
	);
// OpenAPI's UUID format accepts all UUID versions, including nil UUIDs.
const runId = pathId.pipe(z.string().guid());
const status = z.enum([
	'queued',
	'running',
	'paused',
	'succeeded',
	'failed',
	'cancelled',
]);
const runType = z.enum([
	'workflow_builder',
	'form',
	'batch',
	'chat_assistant',
	'agent_assistant',
	'trigger',
	'scheduled',
	'sub_workflow',
	'api',
	'eval',
	'unknown',
]);
const envelope = {
	response_code: z.string().nullable().optional(),
	meta: jsonObject.optional(),
};
const runSummary = z
	.object({
		run_id: z.string().guid(),
		project_id: z.string().nullable(),
		project_version: z.number().int().nullable().optional(),
		status,
		error: z.string().nullable(),
		created_at: z.string(),
		started_at: z.string().nullable(),
		completed_at: z.string().nullable(),
		run_type: runType.nullable(),
		created_by: z
			.object({
				type: z.enum([
					'user',
					'personal_api_key',
					'org_api_key',
					'system',
					'end_user',
					'unknown',
				]),
				id: z.string().nullable(),
			})
			.nullable(),
		usage: z.object({
			total_tokens: z.number().int(),
			details: z.array(
				z.object({
					provider: z.string(),
					model_id: z.string(),
					connection_id: z.string().nullable(),
					input_tokens: z.number().int().nullable(),
					output_tokens: z.number().int().nullable(),
				}),
			),
		}),
		parent_run_id: z.string().nullable(),
		parent_project_id: z.string().nullable(),
	})
	.passthrough();
const run = runSummary.extend({
	input: jsonObject.nullable(),
	output: jsonObject.nullable(),
	citations: z
		.array(
			z.object({
				knowledge_base_id: z.string().nullable(),
				resource_id: z.string().nullable(),
				source_url: z.string().nullable(),
				source_type: z.enum(['knowledge_base', 'website', 'document', 'other']),
				position: z
					.object({
						page_index: z.number().int().nullable(),
						chunk_index: z.number().int().nullable(),
						page_number: z.number().int().nullable(),
					})
					.nullable(),
			}),
		)
		.nullable(),
	pending_input: z
		.object({
			question: z.string(),
			context: z.string().nullable(),
			response_type: z.enum(['text', 'approval', 'choice', 'unknown']),
			choices: z.array(z.string()).nullable(),
			resume_token: z.string(),
			resume_token_expires_at: z.string().nullable(),
		})
		.nullable(),
});
const runResponse = z.object({ ...envelope, data: run }).passthrough();
const acknowledgement = z.object(envelope).passthrough();
// Async write operations return their JSON envelope and the actual Location header.
const asyncResult = <T extends z.ZodType>(body: T) =>
	z.object({ body, location: z.string().nullable() });

export const schemas = {
	'projects.ioSchema': {
		input: z
			.object({
				project_id: pathId,
				version: z
					.union([z.enum(['latest', 'draft']), z.number().int().min(0)])
					.optional(),
			})
			.strict(),
		output: z
			.object({
				...envelope,
				data: z.object({
					input_kind: z.enum(['start_node', 'legacy_input_nodes']),
					inputs: z.array(z.object({ id: z.string(), name: z.string() })),
					outputs: z.array(z.object({ id: z.string(), name: z.string() })),
				}),
			})
			.passthrough(),
	},
	'runs.start': {
		input: z
			.object({
				project_id: z.string(),
				input: jsonObject,
				project_version: z.number().int().min(-1).nullable().optional(),
			})
			.strict(),
		output: asyncResult(runResponse),
	},
	'runs.list': {
		input: z
			.object({
				project_id: z.string().nullable().optional(),
				status: status.nullable().optional(),
				run_type: runType.exclude(['unknown']).nullable().optional(),
				created_by_id: z.string().nullable().optional(),
				created_at__gte: z.string().nullable().optional(),
				created_at__lte: z.string().nullable().optional(),
				cursor: z.string().nullable().optional(),
				page_size: z.number().int().min(1).max(1000).optional(),
			})
			.strict(),
		output: z
			.object({
				...envelope,
				data: z.array(runSummary).optional(),
				next_cursor: z.string().nullable().optional(),
				prev_cursor: z.string().nullable().optional(),
				current_cursor: z.string().nullable().optional(),
			})
			.passthrough(),
	},
	'runs.get': {
		input: z.object({ run_id: runId }).strict(),
		output: runResponse,
	},
	'runs.cancel': {
		input: z.object({ run_id: runId }).strict(),
		output: asyncResult(acknowledgement),
	},
	'runs.resume': {
		input: z
			.object({
				run_id: runId,
				resume_token: z.string(),
				response: z.string(),
				response_type: z
					.enum(['text', 'approval', 'choice'])
					.nullable()
					.optional(),
			})
			.strict(),
		output: asyncResult(acknowledgement),
	},
} as const;

export const EndpointInputSchemas = {
	'projects.ioSchema': schemas['projects.ioSchema'].input,
	'runs.start': schemas['runs.start'].input,
	'runs.list': schemas['runs.list'].input,
	'runs.get': schemas['runs.get'].input,
	'runs.cancel': schemas['runs.cancel'].input,
	'runs.resume': schemas['runs.resume'].input,
} satisfies { [K in keyof typeof schemas]: (typeof schemas)[K]['input'] };

export const EndpointOutputSchemas = {
	'projects.ioSchema': schemas['projects.ioSchema'].output,
	'runs.start': schemas['runs.start'].output,
	'runs.list': schemas['runs.list'].output,
	'runs.get': schemas['runs.get'].output,
	'runs.cancel': schemas['runs.cancel'].output,
	'runs.resume': schemas['runs.resume'].output,
} satisfies { [K in keyof typeof schemas]: (typeof schemas)[K]['output'] };

export type StackAIEndpointInputs = {
	[K in keyof typeof schemas]: z.input<(typeof schemas)[K]['input']>;
};
export type StackAIEndpointOutputs = {
	[K in keyof typeof schemas]: z.output<(typeof schemas)[K]['output']>;
};
