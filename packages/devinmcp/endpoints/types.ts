import { z } from 'zod';

const nullableString = z.string().nullable().optional();

const SessionPullRequestSchema = z
	.object({
		url: z.string().optional(),
	})
	.loose();

export const SessionResponseSchema = z
	.object({
		session_id: z.string(),
		url: z.string(),
		status: z.string(),
		tags: z.array(z.string()),
		org_id: z.string(),
		created_at: z.number(),
		updated_at: z.number(),
		acus_consumed: z.number(),
		pull_requests: z.array(SessionPullRequestSchema),
		title: nullableString,
		user_id: nullableString,
		status_detail: nullableString,
		structured_output: z.record(z.string(), z.unknown()).nullable().optional(),
		playbook_id: nullableString,
		parent_session_id: nullableString,
	})
	.loose();

export type SessionResponse = z.infer<typeof SessionResponseSchema>;

const PaginatedSessionsSchema = z
	.object({
		items: z.array(SessionResponseSchema),
		end_cursor: nullableString,
		has_next_page: z.boolean().optional(),
		total: z.number().nullable().optional(),
	})
	.loose();

const CreateSessionInputSchema = z.object({
	org_id: z.string(),
	prompt: z.string(),
	create_as_user_id: z.string().optional(),
	playbook_id: z.string().optional(),
	title: z.string().optional(),
	tags: z.array(z.string()).optional(),
	knowledge_ids: z.array(z.string()).optional(),
	max_acu_limit: z.number().optional(),
	snapshot_id: z.string().optional(),
	idempotent: z.boolean().optional(),
	unlisted: z.boolean().optional(),
	structured_output_schema: z.record(z.string(), z.unknown()).optional(),
});
export type CreateSessionInput = z.infer<typeof CreateSessionInputSchema>;
export type CreateSessionResponse = SessionResponse;

const GetSessionInputSchema = z.object({
	org_id: z.string(),
	session_id: z.string(),
});
export type GetSessionInput = z.infer<typeof GetSessionInputSchema>;
export type GetSessionResponse = SessionResponse;

const ListSessionsInputSchema = z.object({
	org_id: z.string(),
	first: z.number().optional(),
	after: z.string().optional(),
	tags: z.array(z.string()).optional(),
	user_ids: z.array(z.string()).optional(),
	session_ids: z.array(z.string()).optional(),
});
export type ListSessionsInput = z.infer<typeof ListSessionsInputSchema>;
export type ListSessionsResponse = z.infer<typeof PaginatedSessionsSchema>;

const SendMessageInputSchema = z.object({
	org_id: z.string(),
	session_id: z.string(),
	message: z.string(),
});
export type SendMessageInput = z.infer<typeof SendMessageInputSchema>;
export type SendMessageResponse = SessionResponse;

export type DevinMcpEndpointInputs = {
	createSession: CreateSessionInput;
	getSession: GetSessionInput;
	listSessions: ListSessionsInput;
	sendMessage: SendMessageInput;
};

export type DevinMcpEndpointOutputs = {
	createSession: CreateSessionResponse;
	getSession: GetSessionResponse;
	listSessions: ListSessionsResponse;
	sendMessage: SendMessageResponse;
};

export const DevinMcpEndpointInputSchemas = {
	createSession: CreateSessionInputSchema,
	getSession: GetSessionInputSchema,
	listSessions: ListSessionsInputSchema,
	sendMessage: SendMessageInputSchema,
} as const;

export const DevinMcpEndpointOutputSchemas = {
	createSession: SessionResponseSchema,
	getSession: SessionResponseSchema,
	listSessions: PaginatedSessionsSchema,
	sendMessage: SessionResponseSchema,
} as const;
