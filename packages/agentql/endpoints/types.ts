import { z } from 'zod';

export const AGENTQL_QUERY_MODE = ['fast', 'standard'] as const;
export const AGENTQL_BROWSER_PROFILE = [
	'light',
	'stealth',
	'tf-browser',
] as const;
export const AGENTQL_BROWSER_UA_PRESET = [
	'windows',
	'macos',
	'linux',
] as const;
export const AGENTQL_SHUTDOWN_MODE = [
	'on_disconnect',
	'on_inactivity_timeout',
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

const AgentQLCreateRemoteBrowserSessionInputSchema = z
	.object({
		browser_ua_preset: z.enum(AGENTQL_BROWSER_UA_PRESET).optional(),
		browser_profile: z.enum(AGENTQL_BROWSER_PROFILE).optional(),
		inactivity_timeout_seconds: z
			.number()
			.int()
			.min(5)
			.max(86400)
			.optional(),
		proxy: z
			.union([AgentQLTetraProxySchema, AgentQLCustomProxySchema])
			.nullable()
			.optional(),
		shutdown_mode: z.enum(AGENTQL_SHUTDOWN_MODE).optional(),
		sub_user_id: z.string().nullable().optional(),
		branding: z.boolean().optional(),
		browser_startup_url: z
			.union([z.string().url(), z.literal('about:blank')])
			.nullable()
			.optional(),
	})
	.strict()
	.optional();

export type AgentQLCreateRemoteBrowserSessionInput = z.infer<
	typeof AgentQLCreateRemoteBrowserSessionInputSchema
>;

const AgentQLCreateRemoteBrowserSessionResponseSchema = z.object({
	session_id: z.string(),
	cdp_url: z.string(),
	base_url: z.string(),
});

export type AgentQLCreateRemoteBrowserSessionResponse = z.infer<
	typeof AgentQLCreateRemoteBrowserSessionResponseSchema
>;

const AgentQLGetUsageInputSchema = z.object({});

export type AgentQLGetUsageInput = z.infer<typeof AgentQLGetUsageInputSchema>;

const AgentQLUsageInfoSchema = z
	.object({
		current_cycle: z.number().int().nullable().optional(),
		lifetime: z.number().int().optional(),
	})
	.loose();

const AgentQLSubscriptionStatusSchema = z
	.object({
		lifetime_usage_limit: z.number().int().nullable().optional(),
		current_cycle_free_usage_limit: z
			.number()
			.int()
			.nullable()
			.optional(),
		current_cycle_start: z.string().optional(),
		current_cycle_end: z.string().optional(),
	})
	.loose();

const AgentQLGetUsageResponseSchema = z.object({
	data: z
		.object({
			current_subscription:
				AgentQLSubscriptionStatusSchema.nullable().optional(),
			api_key_usage: AgentQLUsageInfoSchema,
			total_account_usage: AgentQLUsageInfoSchema,
		})
		.loose(),
	metadata: z
		.object({
			request_id: z.string().optional(),
		})
		.loose()
		.optional(),
});

export type AgentQLGetUsageResponse = z.infer<
	typeof AgentQLGetUsageResponseSchema
>;

export type AgentQLEndpointInputs = {
	queryData: AgentQLQueryDataInput;
	createRemoteBrowserSession: AgentQLCreateRemoteBrowserSessionInput;
	getUsage: AgentQLGetUsageInput;
};

export type AgentQLEndpointOutputs = {
	queryData: AgentQLQueryDataResponse;
	createRemoteBrowserSession: AgentQLCreateRemoteBrowserSessionResponse;
	getUsage: AgentQLGetUsageResponse;
};

export const AgentQLEndpointInputSchemas = {
	queryData: AgentQLQueryDataInputSchema,
	createRemoteBrowserSession: AgentQLCreateRemoteBrowserSessionInputSchema,
	getUsage: AgentQLGetUsageInputSchema,
} as const;

export const AgentQLEndpointOutputSchemas = {
	queryData: AgentQLQueryDataResponseSchema,
	createRemoteBrowserSession:
		AgentQLCreateRemoteBrowserSessionResponseSchema,
	getUsage: AgentQLGetUsageResponseSchema,
} as const;
