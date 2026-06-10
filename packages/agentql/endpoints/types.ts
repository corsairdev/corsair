import { z } from 'zod';

export const AGENTQL_QUERY_MODE = ['fast', 'standard'] as const;
export const AGENTQL_BROWSER_PROFILE = [
	'light',
	'stealth',
	'tf-browser',
] as const;

const AgentQLTetraProxySchema = z
	.object({
		type: z.literal('tetra').optional(),
		country_code: z.string().optional(),
	})
	.strict();

const AgentQLCustomProxySchema = z
	.object({
		type: z.literal('custom').optional(),
		url: z.string(),
		username: z.string().nullable().optional(),
		password: z.string().nullable().optional(),
	})
	.strict();

const AgentQLQueryDataParamsSchema = z
	.object({
		wait_for: z.number().optional(),
		is_scroll_to_bottom_enabled: z.boolean().optional(),
		mode: z.enum(AGENTQL_QUERY_MODE).optional(),
		is_screenshot_enabled: z.boolean().optional(),
		browser_profile: z.enum(AGENTQL_BROWSER_PROFILE).optional(),
		proxy: z
			.union([AgentQLTetraProxySchema, AgentQLCustomProxySchema])
			.nullable()
			.optional(),
	})
	.strict();

const AgentQLQueryDataInputSchema = z
	.object({
		query: z.string().min(1).optional(),
		prompt: z.string().min(1).optional(),
		url: z.string().min(1).optional(),
		html: z.string().min(1).optional(),
		params: AgentQLQueryDataParamsSchema.optional(),
	})
	.strict()
	.refine((input) => Boolean(input.query || input.prompt), {
		message: 'Either query or prompt is required',
		path: ['query'],
	})
	.refine((input) => Boolean(input.url || input.html), {
		message: 'Either url or html is required',
		path: ['url'],
	});

export type AgentQLQueryDataInput = z.infer<
	typeof AgentQLQueryDataInputSchema
>;

const AgentQLQueryDataMetadataSchema = z
	.object({
		request_id: z.string().optional(),
		generated_query: z.string().nullable().optional(),
		screenshot: z.string().nullable().optional(),
	})
	.loose();

const AgentQLQueryDataResponseSchema = z.object({
	data: z.record(z.string(), z.unknown()),
	metadata: AgentQLQueryDataMetadataSchema.nullable().optional(),
});

export type AgentQLQueryDataResponse = z.infer<
	typeof AgentQLQueryDataResponseSchema
>;

export type AgentQLEndpointInputs = {
	queryData: AgentQLQueryDataInput;
};

export type AgentQLEndpointOutputs = {
	queryData: AgentQLQueryDataResponse;
};

export const AgentQLEndpointInputSchemas = {
	queryData: AgentQLQueryDataInputSchema,
} as const;

export const AgentQLEndpointOutputSchemas = {
	queryData: AgentQLQueryDataResponseSchema,
} as const;
