import { z } from 'zod';

// Shared Zendesk API objects
export const ZendeskTicketResponseSchema = z.object({
	id: z.number(),
	url: z.string().optional().nullable(),
	external_id: z.string().optional().nullable(),
	created_at: z.string().optional().nullable(),
	updated_at: z.string().optional().nullable(),
	type: z.string().optional().nullable(),
	subject: z.string().optional().nullable(),
	raw_subject: z.string().optional().nullable(),
	description: z.string().optional().nullable(),
	priority: z.string().optional().nullable(),
	status: z.string().optional().nullable(),
	recipient: z.string().optional().nullable(),
	requester_id: z.number().optional().nullable(),
	submitter_id: z.number().optional().nullable(),
	assignee_id: z.number().optional().nullable(),
	organization_id: z.number().optional().nullable(),
	group_id: z.number().optional().nullable(),
	collaborator_ids: z.array(z.number()).optional().nullable(),
	follower_ids: z.array(z.number()).optional().nullable(),
	email_cc_ids: z.array(z.number()).optional().nullable(),
	forum_topic_id: z.number().optional().nullable(),
	problem_id: z.number().optional().nullable(),
	has_incidents: z.boolean().optional().nullable(),
	is_public: z.boolean().optional().nullable(),
	due_at: z.string().optional().nullable(),
	tags: z.array(z.string()).optional().nullable(),
});

export const ZendeskUserResponseSchema = z.object({
	id: z.number(),
	url: z.string().optional().nullable(),
	name: z.string(),
	email: z.string().optional().nullable(),
	created_at: z.string().optional().nullable(),
	updated_at: z.string().optional().nullable(),
	time_zone: z.string().optional().nullable(),
	iana_time_zone: z.string().optional().nullable(),
	phone: z.string().optional().nullable(),
	shared_phone: z.boolean().optional().nullable(),
	locale_id: z.number().optional().nullable(),
	locale: z.string().optional().nullable(),
	organization_id: z.number().optional().nullable(),
	role: z.string().optional().nullable(),
	verified: z.boolean().optional().nullable(),
	external_id: z.string().optional().nullable(),
	tags: z.array(z.string()).optional().nullable(),
	active: z.boolean().optional().nullable(),
});

export const ZendeskCommentResponseSchema = z.object({
	id: z.number(),
	type: z.string().optional().nullable(),
	body: z.string().optional().nullable(),
	html_body: z.string().optional().nullable(),
	plain_body: z.string().optional().nullable(),
	public: z.boolean().optional().nullable(),
	author_id: z.number().optional().nullable(),
	// z.unknown() is used because Zendesk attachment objects have a highly variable/dynamic structure and we only need to verify the array presence.
	attachments: z.array(z.unknown()).optional().nullable(),
	created_at: z.string().optional().nullable(),
});

// Tickets Endpoints Schemas
export const TicketsCreateInputSchema = z.object({
	subject: z.string().optional(),
	description: z.string().optional(),
	comment: z
		.object({
			body: z.string(),
			public: z.boolean().optional(),
			author_id: z.number().optional(),
		})
		.optional(),
	status: z.string().optional(),
	priority: z.string().optional(),
	requester_id: z.number().optional(),
	assignee_id: z.number().optional(),
	group_id: z.number().optional(),
	organization_id: z.number().optional(),
	tags: z.array(z.string()).optional(),
});

export const TicketsCreateResponseSchema = z.object({
	ticket: ZendeskTicketResponseSchema,
});

export const TicketsGetInputSchema = z.object({
	id: z.number(),
});

export const TicketsGetResponseSchema = z.object({
	ticket: ZendeskTicketResponseSchema,
});

export const TicketsUpdateInputSchema = z.object({
	id: z.number(),
	subject: z.string().optional(),
	status: z.string().optional(),
	priority: z.string().optional(),
	requester_id: z.number().optional(),
	assignee_id: z.number().optional(),
	comment: z
		.object({
			body: z.string(),
			public: z.boolean().optional(),
			author_id: z.number().optional(),
		})
		.optional(),
	tags: z.array(z.string()).optional(),
});

export const TicketsUpdateResponseSchema = z.object({
	ticket: ZendeskTicketResponseSchema,
});

export const TicketsDeleteInputSchema = z.object({
	id: z.number(),
});

export const TicketsDeleteResponseSchema = z.object({
	id: z.number().optional(),
});

export const TicketsListInputSchema = z.object({
	page: z.number().optional(),
	per_page: z.number().optional(),
	sort_by: z.string().optional(),
	sort_order: z.string().optional(),
});

export const TicketsListResponseSchema = z.object({
	tickets: z.array(ZendeskTicketResponseSchema),
	next_page: z.string().nullable().optional(),
	previous_page: z.string().nullable().optional(),
	count: z.number().optional(),
});

// Users Endpoints Schemas
export const UsersCreateInputSchema = z.object({
	name: z.string(),
	email: z.string(),
	role: z.string().optional(),
	external_id: z.string().optional(),
	active: z.boolean().optional(),
});

export const UsersCreateResponseSchema = z.object({
	user: ZendeskUserResponseSchema,
});

export const UsersGetInputSchema = z.object({
	id: z.number(),
});

export const UsersGetResponseSchema = z.object({
	user: ZendeskUserResponseSchema,
});

export const UsersUpdateInputSchema = z.object({
	id: z.number(),
	name: z.string().optional(),
	email: z.string().optional(),
	role: z.string().optional(),
	external_id: z.string().optional(),
	active: z.boolean().optional(),
});

export const UsersUpdateResponseSchema = z.object({
	user: ZendeskUserResponseSchema,
});

export const UsersDeleteInputSchema = z.object({
	id: z.number(),
});

export const UsersDeleteResponseSchema = z.object({
	id: z.number().optional(),
});

export const UsersListInputSchema = z.object({
	page: z.number().optional(),
	per_page: z.number().optional(),
	role: z.string().optional(),
});

export const UsersListResponseSchema = z.object({
	users: z.array(ZendeskUserResponseSchema),
	next_page: z.string().nullable().optional(),
	previous_page: z.string().nullable().optional(),
	count: z.number().optional(),
});

// Comments Endpoints Schemas
export const CommentsListInputSchema = z.object({
	ticket_id: z.number(),
	page: z.number().optional(),
	per_page: z.number().optional(),
});

export const CommentsListResponseSchema = z.object({
	comments: z.array(ZendeskCommentResponseSchema),
	next_page: z.string().nullable().optional(),
	previous_page: z.string().nullable().optional(),
	count: z.number().optional(),
});

// Combined Types for Corsair Plugin Configuration
export type TicketsCreateInput = z.infer<typeof TicketsCreateInputSchema>;
export type TicketsCreateResponse = z.infer<typeof TicketsCreateResponseSchema>;

export type TicketsGetInput = z.infer<typeof TicketsGetInputSchema>;
export type TicketsGetResponse = z.infer<typeof TicketsGetResponseSchema>;

export type TicketsUpdateInput = z.infer<typeof TicketsUpdateInputSchema>;
export type TicketsUpdateResponse = z.infer<typeof TicketsUpdateResponseSchema>;

export type TicketsDeleteInput = z.infer<typeof TicketsDeleteInputSchema>;
export type TicketsDeleteResponse = z.infer<typeof TicketsDeleteResponseSchema>;

export type TicketsListInput = z.infer<typeof TicketsListInputSchema>;
export type TicketsListResponse = z.infer<typeof TicketsListResponseSchema>;

export type UsersCreateInput = z.infer<typeof UsersCreateInputSchema>;
export type UsersCreateResponse = z.infer<typeof UsersCreateResponseSchema>;

export type UsersGetInput = z.infer<typeof UsersGetInputSchema>;
export type UsersGetResponse = z.infer<typeof UsersGetResponseSchema>;

export type UsersUpdateInput = z.infer<typeof UsersUpdateInputSchema>;
export type UsersUpdateResponse = z.infer<typeof UsersUpdateResponseSchema>;

export type UsersDeleteInput = z.infer<typeof UsersDeleteInputSchema>;
export type UsersDeleteResponse = z.infer<typeof UsersDeleteResponseSchema>;

export type UsersListInput = z.infer<typeof UsersListInputSchema>;
export type UsersListResponse = z.infer<typeof UsersListResponseSchema>;

export type CommentsListInput = z.infer<typeof CommentsListInputSchema>;
export type CommentsListResponse = z.infer<typeof CommentsListResponseSchema>;

export type ZendeskEndpointInputs = {
	ticketsCreate: TicketsCreateInput;
	ticketsGet: TicketsGetInput;
	ticketsUpdate: TicketsUpdateInput;
	ticketsDelete: TicketsDeleteInput;
	ticketsList: TicketsListInput;
	usersCreate: UsersCreateInput;
	usersGet: UsersGetInput;
	usersUpdate: UsersUpdateInput;
	usersDelete: UsersDeleteInput;
	usersList: UsersListInput;
	commentsList: CommentsListInput;
};

export type ZendeskEndpointOutputs = {
	ticketsCreate: TicketsCreateResponse;
	ticketsGet: TicketsGetResponse;
	ticketsUpdate: TicketsUpdateResponse;
	ticketsDelete: TicketsDeleteResponse;
	ticketsList: TicketsListResponse;
	usersCreate: UsersCreateResponse;
	usersGet: UsersGetResponse;
	usersUpdate: UsersUpdateResponse;
	usersDelete: UsersDeleteResponse;
	usersList: UsersListResponse;
	commentsList: CommentsListResponse;
};

export const ZendeskEndpointInputSchemas = {
	ticketsCreate: TicketsCreateInputSchema,
	ticketsGet: TicketsGetInputSchema,
	ticketsUpdate: TicketsUpdateInputSchema,
	ticketsDelete: TicketsDeleteInputSchema,
	ticketsList: TicketsListInputSchema,
	usersCreate: UsersCreateInputSchema,
	usersGet: UsersGetInputSchema,
	usersUpdate: UsersUpdateInputSchema,
	usersDelete: UsersDeleteInputSchema,
	usersList: UsersListInputSchema,
	commentsList: CommentsListInputSchema,
} as const;

export const ZendeskEndpointOutputSchemas = {
	ticketsCreate: TicketsCreateResponseSchema,
	ticketsGet: TicketsGetResponseSchema,
	ticketsUpdate: TicketsUpdateResponseSchema,
	ticketsDelete: TicketsDeleteResponseSchema,
	ticketsList: TicketsListResponseSchema,
	usersCreate: UsersCreateResponseSchema,
	usersGet: UsersGetResponseSchema,
	usersUpdate: UsersUpdateResponseSchema,
	usersDelete: UsersDeleteResponseSchema,
	usersList: UsersListResponseSchema,
	commentsList: CommentsListResponseSchema,
} as const;
