import { z } from 'zod';

// Moosend wraps every answer in `{Code, Error, Context}` and serves the
// Context fields in snake_case (verified against the response models in
// Moosend's official PHP wrapper, moosend/api-wrappers-php, generated from
// the V3 API blueprint). Objects are `.loose()` with documented fields
// nullish, so a field Moosend adds or omits cannot fail a call that has
// already happened.

// unknown: Moosend accepts plus-addressing and international domains, so the
// format check stays at the RFC level rather than a strict pattern.
const EmailSchema = z.email().describe('The subscriber email address.');

// ── mailing lists ─────────────────────────────────────────────────────────

// unknown: a custom field definition mirrors what the account configured;
// options only exist for dropdown fields.
const CustomFieldsDefinitionSchema = z
	.object({
		custom_field_id: z.string().nullish(),
		name: z.string().nullish(),
		type: z.string().nullish(),
		is_required: z.boolean().nullish(),
		options: z.array(z.string()).nullish(),
	})
	.loose();

const MailingListSchema = z
	.object({
		id: z.string().nullish(),
		name: z.string().nullish(),
		created_on: z.string().nullish(),
		updated_on: z.string().nullish(),
		created_by: z.string().nullish(),
		updated_by: z.string().nullish(),
		status: z.number().nullish(),
		active_member_count: z.number().nullish(),
		bounced_member_count: z.number().nullish(),
		removed_member_count: z.number().nullish(),
		unsubscribed_member_count: z.number().nullish(),
		custom_fields_definition: z.array(CustomFieldsDefinitionSchema).nullish(),
		import_operation: z.record(z.string(), z.unknown()).nullish(),
	})
	.loose();

export type MailingList = z.infer<typeof MailingListSchema>;

const PagingSchema = z
	.object({
		current_page: z.number().nullish(),
		page_size: z.number().nullish(),
		sort_expression: z.string().nullish(),
		sort_is_ascending: z.boolean().nullish(),
		total_page_count: z.number().nullish(),
		total_results: z.number().nullish(),
	})
	.loose();

export type Paging = z.infer<typeof PagingSchema>;

const ListsUpsertInputSchema = z.object({
	name: z.string().min(1).describe('The name of the mailing list.'),
	confirmationPage: z
		.string()
		.url()
		.optional()
		.describe('Shown at the end of the subscription process.'),
	redirectAfterUnsubscribePage: z
		.string()
		.url()
		.optional()
		.describe('Where subscribers land after unsubscribing.'),
});

export type ListsUpsertInput = z.input<typeof ListsUpsertInputSchema>;

const ListsListInputSchema = z.object({
	withStatistics: z
		.boolean()
		.optional()
		.describe('Omit to receive statistics by default.'),
	shortBy: z
		.string()
		.optional()
		.describe('The property to sort by; defaults to CreatedOn.'),
	sortMethod: z.enum(['ASC', 'DESC']).optional(),
});

export type ListsListInput = z.input<typeof ListsListInputSchema>;

const ListsListPagedInputSchema = z.object({
	page: z.number().int().positive(),
	pageSize: z.number().int().positive().describe('Lists per page.'),
	shortBy: z.string().optional(),
	sortMethod: z.enum(['ASC', 'DESC']).optional(),
});

export type ListsListPagedInput = z.input<typeof ListsListPagedInputSchema>;

const ListsListResponseSchema = z.object({
	mailingLists: z.array(MailingListSchema),
});

export type ListsListResponse = z.infer<typeof ListsListResponseSchema>;

const ListsListPagedResponseSchema = z.object({
	mailingLists: z.array(MailingListSchema),
	paging: PagingSchema,
});

export type ListsListPagedResponse = z.infer<
	typeof ListsListPagedResponseSchema
>;

const MailingListGetInputSchema = z.object({
	mailingListId: z.string().min(1),
	withStatistics: z.boolean().optional(),
});

export type MailingListGetInput = z.input<typeof MailingListGetInputSchema>;

const MailingListResponseSchema = z.object({
	mailingList: MailingListSchema,
});

export type MailingListResponse = z.infer<typeof MailingListResponseSchema>;

/** Deleting a list returns a success envelope with no documented context. */
const ListsDeleteResponseSchema = z.object({}).loose().nullish();

export type ListsDeleteResponse = z.infer<typeof ListsDeleteResponseSchema>;

// ── subscribers ───────────────────────────────────────────────────────────

export const MOOSEND_SUBSCRIBER_STATUSES = [
	'subscribed',
	'unsubscribed',
	'cleaned',
] as const;

// unknown: a subscriber's custom field carries the value the contact set.
const SubscriberCustomFieldSchema = z
	.object({
		custom_field_id: z.string().nullish(),
		name: z.string().nullish(),
		value: z.string().nullish(),
	})
	.loose();

const SubscriberSchema = z
	.object({
		id: z.string().nullish(),
		name: z.string().nullish(),
		email: EmailSchema.nullish(),
		created_on: z.string().nullish(),
		updated_on: z.string().nullish(),
		unsubscribed_on: z.string().nullish(),
		removed_on: z.string().nullish(),
		subscribe_type: z.number().nullish(),
		subscribe_method: z.number().nullish(),
		custom_fields: z.array(SubscriberCustomFieldSchema).nullish(),
	})
	.loose();

export type Subscriber = z.infer<typeof SubscriberSchema>;

const SubscribersListInputSchema = z.object({
	mailingListId: z.string().min(1),
	status: z.enum(MOOSEND_SUBSCRIBER_STATUSES),
	page: z.number().int().positive().optional(),
	pageSize: z.number().int().positive().optional(),
});

export type SubscribersListInput = z.input<typeof SubscribersListInputSchema>;

const SubscribersListResponseSchema = z.object({
	subscribers: z.array(SubscriberSchema),
	paging: PagingSchema,
});

export type SubscribersListResponse = z.infer<
	typeof SubscribersListResponseSchema
>;

const SubscriberGetInputSchema = z.object({
	mailingListId: z.string().min(1),
	email: EmailSchema,
});

export type SubscriberGetInput = z.input<typeof SubscriberGetInputSchema>;

const SubscriberByIdInputSchema = z.object({
	mailingListId: z.string().min(1),
	subscriberId: z.string().min(1),
});

export type SubscriberByIdInput = z.input<typeof SubscriberByIdInputSchema>;

const SubscriberResponseSchema = z.object({
	subscriber: SubscriberSchema,
});

export type SubscriberResponse = z.infer<typeof SubscriberResponseSchema>;

const SubscriberUpsertInputSchema = z.object({
	mailingListId: z.string().min(1),
	email: EmailSchema,
	name: z.string().optional(),
	// unknown: custom field values are name-keyed strings Moosend matches
	// against the list's field definitions.
	customFields: z.record(z.string(), z.unknown()).optional(),
});

export type SubscriberUpsertInput = z.input<typeof SubscriberUpsertInputSchema>;

const SubscriberUpdateInputSchema = z.object({
	mailingListId: z.string().min(1),
	subscriberId: z.string().min(1),
	email: EmailSchema,
	name: z.string().optional(),
	// unknown: custom field values are name-keyed strings Moosend matches
	// against the list's field definitions.
	customFields: z.record(z.string(), z.unknown()).optional(),
});

export type SubscriberUpdateInput = z.input<typeof SubscriberUpdateInputSchema>;

const SubscribersUpsertManyInputSchema = z.object({
	mailingListId: z.string().min(1),
	subscribers: z
		.array(
			z.object({
				email: EmailSchema,
				name: z.string().optional(),
				customFields: z.record(z.string(), z.unknown()).optional(),
			}),
		)
		.min(1)
		.describe(
			'Invalid email addresses are skipped silently by Moosend, per its docs.',
		),
});

export type SubscribersUpsertManyInput = z.input<
	typeof SubscribersUpsertManyInputSchema
>;

const SubscribersUpsertManyResponseSchema = z
	.object({})
	.loose()
	.nullish()
	.describe(
		"Moosend's success envelope for bulk subscribe carries no documented context; invalid emails are skipped silently.",
	);

export type SubscribersUpsertManyResponse = z.infer<
	typeof SubscribersUpsertManyResponseSchema
>;

const SubscriberUnsubscribeInputSchema = z.object({
	mailingListId: z.string().min(1),
	email: EmailSchema,
});

export type SubscriberUnsubscribeInput = z.input<
	typeof SubscriberUnsubscribeInputSchema
>;

const SubscriberActionResponseSchema = z.object({}).loose().nullish();

export type SubscriberActionResponse = z.infer<
	typeof SubscriberActionResponseSchema
>;

// ── Registry ──────────────────────────────────────────────────────────────

export type MoosendEndpointInputs = {
	listsList: ListsListInput;
	listsListPaged: ListsListPagedInput;
	listsGet: MailingListGetInput;
	listsCreate: ListsUpsertInput;
	listsUpdate: ListsUpsertInput & { mailingListId: string };
	listsDelete: { mailingListId: string };
	subscribersList: SubscribersListInput;
	subscribersGetByEmail: SubscriberGetInput;
	subscribersGetById: SubscriberByIdInput;
	subscribersSubscribe: SubscriberUpsertInput;
	subscribersSubscribeMany: SubscribersUpsertManyInput;
	subscribersUpdate: SubscriberUpdateInput;
	subscribersUnsubscribe: SubscriberUnsubscribeInput;
	subscribersRemove: SubscriberUnsubscribeInput;
};

export type MoosendEndpointOutputs = {
	listsList: ListsListResponse;
	listsListPaged: ListsListPagedResponse;
	listsGet: MailingListResponse;
	listsCreate: MailingListResponse;
	listsUpdate: MailingListResponse;
	listsDelete: ListsDeleteResponse;
	subscribersList: SubscribersListResponse;
	subscribersGetByEmail: SubscriberResponse;
	subscribersGetById: SubscriberResponse;
	subscribersSubscribe: SubscriberResponse;
	subscribersSubscribeMany: SubscribersUpsertManyResponse;
	subscribersUpdate: SubscriberResponse;
	subscribersUnsubscribe: SubscriberActionResponse;
	subscribersRemove: SubscriberActionResponse;
};

export const MoosendEndpointInputSchemas = {
	listsList: ListsListInputSchema,
	listsListPaged: ListsListPagedInputSchema,
	listsGet: MailingListGetInputSchema,
	listsCreate: ListsUpsertInputSchema,
	listsUpdate: ListsUpsertInputSchema.and(
		z.object({ mailingListId: z.string().min(1) }),
	),
	listsDelete: z.object({ mailingListId: z.string().min(1) }),
	subscribersList: SubscribersListInputSchema,
	subscribersGetByEmail: SubscriberGetInputSchema,
	subscribersGetById: SubscriberByIdInputSchema,
	subscribersSubscribe: SubscriberUpsertInputSchema,
	subscribersSubscribeMany: SubscribersUpsertManyInputSchema,
	subscribersUpdate: SubscriberUpdateInputSchema,
	subscribersUnsubscribe: SubscriberUnsubscribeInputSchema,
	subscribersRemove: SubscriberUnsubscribeInputSchema,
} as const;

export const MoosendEndpointOutputSchemas = {
	listsList: ListsListResponseSchema,
	listsListPaged: ListsListPagedResponseSchema,
	listsGet: MailingListResponseSchema,
	listsCreate: MailingListResponseSchema,
	listsUpdate: MailingListResponseSchema,
	listsDelete: ListsDeleteResponseSchema,
	subscribersList: SubscribersListResponseSchema,
	subscribersGetByEmail: SubscriberResponseSchema,
	subscribersGetById: SubscriberResponseSchema,
	subscribersSubscribe: SubscriberResponseSchema,
	subscribersSubscribeMany: SubscribersUpsertManyResponseSchema,
	subscribersUpdate: SubscriberResponseSchema,
	subscribersUnsubscribe: SubscriberActionResponseSchema,
	subscribersRemove: SubscriberActionResponseSchema,
} as const;
