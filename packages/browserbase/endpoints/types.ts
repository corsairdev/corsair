import { z } from 'zod';

/**
 * Create Browserbase session
 */
const SessionsCreateInputSchema = z.object({
	projectId: z.string().optional(),
	browserSettings: z.record(z.string(), z.unknown()).optional(),
	timeout: z.number().optional(),
});

export type SessionsCreateInput = z.infer<typeof SessionsCreateInputSchema>;

const SessionsCreateResponseSchema = z
	.object({
		id: z.string(),
		status: z.string().optional(),
	})
	.passthrough();

export type SessionsCreateResponse = z.infer<
	typeof SessionsCreateResponseSchema
>;

/**
 * List Browserbase sessions
 */
const SessionsListInputSchema = z.object({
	projectId: z.string().optional(),
	limit: z.number().optional(),
	offset: z.number().optional(),
});

export type SessionsListInput = z.infer<typeof SessionsListInputSchema>;

const SessionsListResponseSchema = z
	.object({
		sessions: z.array(z.unknown()).optional(),
	})
	.passthrough();

export type SessionsListResponse = z.infer<typeof SessionsListResponseSchema>;

/**
 * Get Browserbase session
 */
const SessionsGetInputSchema = z.object({
	id: z.string(),
});

export type SessionsGetInput = z.infer<typeof SessionsGetInputSchema>;

const SessionsGetResponseSchema = z
	.object({
		id: z.string(),
		status: z.string().optional(),
	})
	.passthrough();

export type SessionsGetResponse = z.infer<typeof SessionsGetResponseSchema>;

/**
 * All endpoint inputs
 */
export type BrowserbaseEndpointInputs = {
	sessionsCreate: SessionsCreateInput;
	sessionsList: SessionsListInput;
	sessionsGet: SessionsGetInput;
};

/**
 * All endpoint outputs
 */
export type BrowserbaseEndpointOutputs = {
	sessionsCreate: SessionsCreateResponse;
	sessionsList: SessionsListResponse;
	sessionsGet: SessionsGetResponse;
};

/**
 * Input schemas
 */
export const BrowserbaseEndpointInputSchemas = {
	sessionsCreate: SessionsCreateInputSchema,
	sessionsList: SessionsListInputSchema,
	sessionsGet: SessionsGetInputSchema,
} as const;

/**
 * Output schemas
 */
export const BrowserbaseEndpointOutputSchemas = {
	sessionsCreate: SessionsCreateResponseSchema,
	sessionsList: SessionsListResponseSchema,
	sessionsGet: SessionsGetResponseSchema,
} as const;
