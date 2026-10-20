import { z } from 'zod';

// Schemas follow the Clay Public API OpenAPI description:
// https://developers.clay.com/openapi.json

const MeResponseSchema = z.object({
	user: z.object({
		id: z.string(),
		name: z.string().nullable(),
		email: z.string().nullable().optional(),
		cli_onboarded: z.boolean().optional(),
	}),
	workspace: z.object({
		id: z.string(),
		name: z.string().nullable().optional(),
	}),
});

const CreditsResponseSchema = z.object({
	balance: z.number(),
	// Omitted for workspaces on legacy billing plans.
	action_execution_balance: z.number().optional(),
});

const RoutineId = z
	.string()
	.min(1)
	.max(64)
	.describe('Routine id, for example function:t_abc123');

const RunRoutineInputSchema = z.object({
	routine_id: RoutineId,
	items: z
		.array(
			z.object({
				id: z.string().min(1).max(64),
				// unknown: input names and values are defined by each routine.
				inputs: z.record(z.string(), z.unknown()),
			}),
		)
		.min(1)
		.max(100),
	webhook_id: z.string().min(1).max(64).optional(),
});

const RunRoutineResponseSchema = z.object({
	routine_run_id: z.string(),
	status: z.literal('in_progress'),
});

const GetRunResultsInputSchema = z.object({
	routine_run_id: z.string().min(1).max(64),
	cursor: z.string().min(1).optional(),
	limit: z.number().int().min(1).max(100).optional(),
});

const RunResultItemSchema = z.object({
	id: z.string(),
	status: z.enum(['complete', 'failed']),
	// unknown: result keys are the routine's own outputs.
	result: z.record(z.string(), z.unknown()).optional(),
	error: z.object({ message: z.string() }).optional(),
});

const RunInProgressSchema = z.object({
	routine_run_id: z.string(),
	status: z.literal('in_progress'),
	total: z.number(),
	finished: z.number(),
});

// Clay documents the terminal status set as open, so any value other than
// in_progress is terminal: https://developers.clay.com/public-api/errors
const RunCompleteSchema = z.object({
	routine_run_id: z.string(),
	status: z.string().refine((status) => status !== 'in_progress'),
	total: z.number(),
	finished: z.number(),
	data: z.array(RunResultItemSchema),
	cursor: z.string().optional(),
});

const GetRunResultsResponseSchema = z.union([
	RunInProgressSchema,
	RunCompleteSchema,
]);

const SearchReferenceInputSchema = z.object({});

const SearchReferenceResponseSchema = z.object({ reference: z.string() });

const CreateSearchInputSchema = z.object({
	query: z
		.string()
		.min(1)
		.describe('Clay advanced search query; see search.reference'),
});

const SourceType = z.enum(['people', 'companies']);

const CreateSearchResponseSchema = z.object({
	search_id: z.string(),
	source_type: SourceType,
});

const RunSearchInputSchema = z.object({
	search_id: z.string().min(1),
	limit: z.number().int().min(1).max(500).optional(),
});

export const PersonSearchResultSchema = z.object({
	clay_profile_id: z.number(),
	name: z.string().nullable(),
	first_name: z.string().nullable(),
	last_name: z.string().nullable(),
	linkedin_url: z.string().nullable().optional(),
	location: z.object({
		name: z.string().nullable(),
		city: z.string().nullable(),
		state_or_province: z.string().nullable(),
	}),
	matched_experiences: z.array(
		z.object({
			company: z.string().nullable(),
			title: z.string().nullable(),
			location: z.string().nullable(),
			start_date: z.string().nullable(),
			end_date: z.string().nullable(),
		}),
	),
});

export const CompanySearchResultSchema = z.object({
	clay_company_id: z.number(),
	name: z.string().nullable(),
	domain: z.string().nullable(),
	size: z.string().nullable(),
	type: z.string().nullable(),
	country: z.string().nullable(),
	industry: z.string().nullable(),
	location: z.string().nullable(),
	description: z.string().nullable(),
	linkedin_url: z.string().nullable(),
	annual_revenue: z.string().nullable(),
	total_funding_amount_range_usd: z.number().nullable(),
});

const SearchPage = {
	has_more: z.boolean(),
	exhaustion_reason: z.enum(['query_limit', 'no_more_results']).optional(),
	period_quota: z
		.object({
			limit: z.number(),
			used: z.number(),
			remaining: z.number(),
			resets_at: z.string(),
		})
		.optional(),
};

const RunSearchResponseSchema = z.discriminatedUnion('source_type', [
	z.object({
		source_type: z.literal('people'),
		data: z.array(PersonSearchResultSchema),
		...SearchPage,
	}),
	z.object({
		source_type: z.literal('companies'),
		data: z.array(CompanySearchResultSchema),
		...SearchPage,
	}),
]);

const EmptyInputSchema = z.object({});

export type PersonSearchResult = z.infer<typeof PersonSearchResultSchema>;
export type CompanySearchResult = z.infer<typeof CompanySearchResultSchema>;
export type MeInput = z.infer<typeof EmptyInputSchema>;
export type MeResponse = z.infer<typeof MeResponseSchema>;
export type CreditsInput = z.infer<typeof EmptyInputSchema>;
export type CreditsResponse = z.infer<typeof CreditsResponseSchema>;
export type RunRoutineInput = z.infer<typeof RunRoutineInputSchema>;
export type RunRoutineResponse = z.infer<typeof RunRoutineResponseSchema>;
export type GetRunResultsInput = z.infer<typeof GetRunResultsInputSchema>;
export type GetRunResultsResponse = z.infer<typeof GetRunResultsResponseSchema>;
export type SearchReferenceInput = z.infer<typeof SearchReferenceInputSchema>;
export type SearchReferenceResponse = z.infer<
	typeof SearchReferenceResponseSchema
>;
export type CreateSearchInput = z.infer<typeof CreateSearchInputSchema>;
export type CreateSearchResponse = z.infer<typeof CreateSearchResponseSchema>;
export type RunSearchInput = z.infer<typeof RunSearchInputSchema>;
export type RunSearchResponse = z.infer<typeof RunSearchResponseSchema>;

export type ClayEndpointInputs = {
	accountMe: MeInput;
	accountCredits: CreditsInput;
	routinesRun: RunRoutineInput;
	routinesGetResults: GetRunResultsInput;
	searchReference: SearchReferenceInput;
	searchCreate: CreateSearchInput;
	searchRun: RunSearchInput;
};

export type ClayEndpointOutputs = {
	accountMe: MeResponse;
	accountCredits: CreditsResponse;
	routinesRun: RunRoutineResponse;
	routinesGetResults: GetRunResultsResponse;
	searchReference: SearchReferenceResponse;
	searchCreate: CreateSearchResponse;
	searchRun: RunSearchResponse;
};

export const ClayEndpointInputSchemas = {
	accountMe: EmptyInputSchema,
	accountCredits: EmptyInputSchema,
	routinesRun: RunRoutineInputSchema,
	routinesGetResults: GetRunResultsInputSchema,
	searchReference: SearchReferenceInputSchema,
	searchCreate: CreateSearchInputSchema,
	searchRun: RunSearchInputSchema,
} as const;

export const ClayEndpointOutputSchemas = {
	accountMe: MeResponseSchema,
	accountCredits: CreditsResponseSchema,
	routinesRun: RunRoutineResponseSchema,
	routinesGetResults: GetRunResultsResponseSchema,
	searchReference: SearchReferenceResponseSchema,
	searchCreate: CreateSearchResponseSchema,
	searchRun: RunSearchResponseSchema,
} as const;
