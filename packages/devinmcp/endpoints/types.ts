import { z } from 'zod';

const CreateSessionInputSchema = z.object({
	prompt: z.string(),
	idempotent: z.boolean().optional(),
	playbook_id: z.string().optional(),
	title: z.string().optional(),
	tags: z.array(z.string()).optional(),
});
export type CreateSessionInput = z.infer<typeof CreateSessionInputSchema>;

const CreateSessionResponseSchema = z.object({
	session_id: z.string(),
	url: z.string(),
	is_new_session: z.boolean(),
});
export type CreateSessionResponse = z.infer<typeof CreateSessionResponseSchema>;

const GetSessionInputSchema = z.object({
	session_id: z.string(),
});
export type GetSessionInput = z.infer<typeof GetSessionInputSchema>;

const GetSessionResponseSchema = z.object({
	session_id: z.string(),
	status_enum: z.string(),
	title: z.string().optional(),
	structured_output: z.unknown().optional(),
});
export type GetSessionResponse = z.infer<typeof GetSessionResponseSchema>;

const ListSessionsInputSchema = z.object({
	limit: z.number().optional(),
	offset: z.number().optional(),
});
export type ListSessionsInput = z.infer<typeof ListSessionsInputSchema>;

const ListSessionsResponseSchema = z.object({
	sessions: z.array(
		z.object({
			session_id: z.string(),
			status_enum: z.string(),
			title: z.string().optional(),
		}),
	),
});
export type ListSessionsResponse = z.infer<typeof ListSessionsResponseSchema>;

const SendMessageInputSchema = z.object({
	session_id: z.string(),
	message: z.string(),
});
export type SendMessageInput = z.infer<typeof SendMessageInputSchema>;

const SendMessageResponseSchema = z
	.object({
		detail: z.string(),
	})
	.nullable();
export type SendMessageResponse = z.infer<typeof SendMessageResponseSchema>;

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
	createSession: CreateSessionResponseSchema,
	getSession: GetSessionResponseSchema,
	listSessions: ListSessionsResponseSchema,
	sendMessage: SendMessageResponseSchema,
} as const;
