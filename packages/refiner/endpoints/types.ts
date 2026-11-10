import { z } from 'zod';

// Inputs use Refiner's own parameter names. Outputs are `.loose()` and the
// documented optionals nullish, so a field Refiner adds or omits cannot fail a
// call that has already happened. Shapes come from
// https://refiner.io/docs/api/.
//
// Every list route answers the same envelope, `{ items, pagination }`, with
// `pagination` carrying `next_page_cursor`; the single-resource routes answer the
// object itself.

const UuidSchema = z.string().min(1).describe('A Refiner UUID.');

/**
 * A JSON value. Used where a field's shape belongs to the data rather than the
 * API - a survey version snapshot or a survey's config - so it is described as
 * JSON rather than as `unknown`, which would reach the docs as `any`.
 */
export type RefinerJsonValue =
	| string
	| number
	| boolean
	| null
	| RefinerJsonValue[]
	| { [key: string]: RefinerJsonValue };

const JsonValueSchema: z.ZodType<RefinerJsonValue> = z.lazy(() =>
	z.union([
		z.string(),
		z.number(),
		z.boolean(),
		z.null(),
		z.array(JsonValueSchema),
		z.record(z.string(), JsonValueSchema),
	]),
);

const JsonObjectSchema = z.record(z.string(), JsonValueSchema);

const PageSchema = z
	.object({
		items_count: z.number().nullish(),
		current_page: z.number().nullish(),
		last_page: z.number().nullish(),
		page_length: z.number().nullish(),
		next_page_cursor: z
			.string()
			.nullish()
			.describe(
				'Pass as page_cursor for the next page. Preferred over numeric paging above 10,000 entries.',
			),
	})
	.loose();

export type RefinerPage = z.infer<typeof PageSchema>;

/** The paging and filtering every list route shares. */
const ListQuerySchema = z.object({
	page: z.number().int().min(1).optional().describe('1-based. Defaults to 1.'),
	page_cursor: z
		.string()
		.optional()
		.describe(
			'The next_page_cursor from the previous page. Faster than numeric paging on a large set.',
		),
	page_length: z
		.number()
		.int()
		.min(1)
		.max(1000)
		.optional()
		.describe('Defaults to 100, maximum 1,000.'),
});

/**
 * A trait value on a contact or account: Refiner stores whatever was sent, and a
 * survey answer arrives as its string form, so a numeric-looking trait is still a
 * string here.
 */
const TraitValueSchema = z
	.union([z.string(), z.number(), z.boolean(), z.null()])
	.describe('A string, number or boolean, as Refiner stored it.');

const TraitsSchema = z.record(z.string(), TraitValueSchema);

const SegmentSchema = z
	.object({
		uuid: z.string().nullish(),
		name: z.string().nullish(),
		is_manual: z
			.boolean()
			.nullish()
			.describe(
				'True for a hand-curated segment, which sync-segment can change.',
			),
	})
	.loose();

export type RefinerSegment = z.infer<typeof SegmentSchema>;

/**
 * A trait map, or an empty array.
 *
 * `/contacts` sends a map, but the response samples show `attributes: []` on the
 * contact and account embedded in a survey view, so both shapes are accepted.
 */
const TraitsOrEmptyListSchema = z.union([TraitsSchema, z.array(z.never())]);

const AccountSchema = z
	.object({
		uuid: z.string().nullish(),
		remote_id: z.string().nullish().describe('Your own account ID.'),
		domain: z.string().nullish(),
		display_name: z.string().nullish(),
		first_seen_at: z.string().nullish(),
		last_seen_at: z.string().nullish(),
		attributes: TraitsOrEmptyListSchema.nullish(),
	})
	.loose();

export type RefinerAccount = z.infer<typeof AccountSchema>;

export const ContactSchema = z
	.object({
		uuid: z.string().nullish(),
		remote_id: z.string().nullish().describe('Your own user ID.'),
		email: z.string().nullish(),
		display_name: z.string().nullish(),
		first_seen_at: z.string().nullish(),
		last_seen_at: z.string().nullish(),
		attributes: TraitsSchema.nullish().describe(
			"Every trait on record: the ones you sent, merged with this contact's survey answers.",
		),
		segments: z.array(SegmentSchema).nullish(),
		account: AccountSchema.nullish(),
	})
	.loose();

export type RefinerContact = z.infer<typeof ContactSchema>;

// ── account ───────────────────────────────────────────────────────────────

const AccountGetInputSchema = z.object({});

const SubscriptionSchema = z
	.object({
		plan: z.string().nullish(),
		mtu_count: z.number().nullish().describe('Monthly tracked users.'),
		mtu_limit: z.number().nullish(),
		mte_count: z.number().nullish().describe('Monthly tracked events.'),
		mpv_count: z.number().nullish().describe('Monthly page views.'),
		mpv_limit: z.number().nullish(),
		msr_count: z.number().nullish().describe('Monthly survey responses.'),
		msr_limit: z.number().nullish(),
	})
	.loose();

const EnvironmentSchema = z
	.object({
		uuid: z.string().nullish(),
		name: z.string().nullish(),
		mtu: z.number().nullish(),
		mte: z.number().nullish(),
		mpv: z.number().nullish(),
		msr: z.number().nullish(),
	})
	.loose();

const AccountGetResponseSchema = z
	.object({
		subscription: SubscriptionSchema.nullish(),
		environments: z.array(EnvironmentSchema).nullish(),
	})
	.loose();

export type AccountGetResponse = z.infer<typeof AccountGetResponseSchema>;

// ── identifyUser ──────────────────────────────────────────────────────────

/**
 * The identify-user payload.
 *
 * Any key beyond the reserved ones becomes a trait. Refiner infers a trait's type
 * from the value: a key ending in `_at` is parsed as a date, an unquoted integer
 * is a number, an unquoted true/false a boolean, and anything else a string. The
 * object is `.loose()` so those traits pass through, and `account` is the one
 * nested object with a meaning.
 */
const IdentifyInputSchema = z
	.object({
		id: z
			.string()
			.min(1)
			.optional()
			.describe('Your user ID. One of id, email is required.'),
		email: z.string().min(1).optional().describe('Instead of an id.'),
		account: z
			.record(z.string(), z.union([z.string(), z.number(), z.boolean()]))
			.optional()
			.describe(
				'A nested account object, with at least an id, to group users under one account.',
			),
	})
	.loose()
	.superRefine((value, ctx) => {
		if (value.id === undefined && value.email === undefined) {
			ctx.addIssue({
				code: 'custom',
				path: ['id'],
				message:
					'Give either an id or an email; Refiner cannot identify a user without one.',
			});
		}
	});

export type IdentifyInput = z.infer<typeof IdentifyInputSchema>;

const IdentifyResponseSchema = z
	.object({
		message: z.string().nullish(),
		contact_uuid: z.string().nullish(),
	})
	.loose();

export type IdentifyResponse = z.infer<typeof IdentifyResponseSchema>;

// ── trackEvent ────────────────────────────────────────────────────────────

const TrackEventInputSchema = z
	.object({
		id: z.string().min(1).optional().describe('Your user ID.'),
		email: z.string().min(1).optional().describe('Instead of an id.'),
		event: z.string().min(1).describe('The event name.'),
	})
	.superRefine((value, ctx) => {
		if (value.id === undefined && value.email === undefined) {
			ctx.addIssue({
				code: 'custom',
				path: ['id'],
				message:
					'Give either an id or an email; without one Refiner cannot tell which user the event belongs to.',
			});
		}
	});

export type TrackEventInput = z.infer<typeof TrackEventInputSchema>;

const MessageResponseSchema = z
	.object({
		message: z.string().nullish(),
	})
	.loose();

export type MessageResponse = z.infer<typeof MessageResponseSchema>;

// ── responses ─────────────────────────────────────────────────────────────

const ResponseFilterSchema = {
	response_data: z
		.record(z.string(), z.union([z.string(), z.number(), z.boolean()]))
		.optional()
		.describe(
			'Survey answers to match, keyed by question identifier. Every key must match.',
		),
	contact_data: z
		.record(z.string(), z.union([z.string(), z.number(), z.boolean()]))
		.optional()
		.describe('Contact traits to match, keyed by trait slug.'),
	account_data: z
		.record(z.string(), z.union([z.string(), z.number(), z.boolean()]))
		.optional()
		.describe('Account traits to match, keyed by trait slug.'),
} as const;

const ResponsesListInputSchema = ListQuerySchema.extend({
	form_uuid: z.string().optional().describe('Only this survey.'),
	form_uuids: z
		.array(z.string())
		.min(1)
		.optional()
		.describe('Only these surveys.'),
	segment_uuid: z.string().optional(),
	segment_uuids: z.array(z.string()).min(1).optional(),
	tag_uuid: z.string().optional(),
	tag_uuids: z.array(z.string()).min(1).optional(),
	date_range_start: z
		.string()
		.optional()
		.describe('ISO 8601, such as 2024-01-01 or 2024-01-01 00:00:00.'),
	date_range_end: z.string().optional().describe('ISO 8601.'),
	include: z
		.enum(['completed', 'partials', 'all'])
		.optional()
		.describe(
			'completed is the default; partials adds incomplete ones; all adds dismissed survey views.',
		),
	search: z
		.string()
		.optional()
		.describe('Match the contact ID, Refiner UUID, email or name.'),
	with_attributes: z
		.boolean()
		.optional()
		.describe('Include every attribute on record for each contact.'),
	...ResponseFilterSchema,
});

export type ResponsesListInput = z.infer<typeof ResponsesListInputSchema>;

const FormRefSchema = z
	.object({
		uuid: z.string().nullish(),
		name: z.string().nullish(),
	})
	.loose();

/**
 * The contact embedded in a response.
 *
 * `attributes` is a traits map on `/contacts`, but the response samples show it as
 * an empty array on a survey view, so both shapes are accepted here.
 */
const ResponseContactSchema = z
	.object({
		uuid: z.string().nullish(),
		remote_id: z.string().nullish(),
		email: z.string().nullish(),
		display_name: z.string().nullish(),
		attributes: TraitsOrEmptyListSchema.nullish(),
		account: AccountSchema.nullish(),
	})
	.loose();

/**
 * One survey response, which is also a survey *view* when `include` is all: the
 * `data` values are null until the user actually answered.
 *
 * Every timestamp is `YYYY-MM-DD HH:MM:SS`, not ISO 8601, which is worth knowing
 * before parsing one.
 */
export const ResponseSchema = z
	.object({
		uuid: z.string().nullish(),
		first_shown_at: z.string().nullish(),
		last_shown_at: z.string().nullish(),
		show_counter: z.number().nullish(),
		first_data_reception_at: z.string().nullish(),
		last_data_reception_at: z.string().nullish(),
		completed_at: z.string().nullish(),
		received_at: z.string().nullish(),
		dismissed_at: z.string().nullish(),
		form: FormRefSchema.nullish(),
		data: TraitsSchema.nullish().describe(
			'Answers keyed by question identifier.',
		),
		contact: ResponseContactSchema.nullish(),
	})
	.loose();

export type RefinerResponse = z.infer<typeof ResponseSchema>;

const ResponsesListResponseSchema = z
	.object({
		items: z.array(ResponseSchema).nullish(),
		pagination: PageSchema.nullish(),
	})
	.loose();

export type ResponsesListResponse = z.infer<typeof ResponsesListResponseSchema>;

const ResponsesStoreInputSchema = z
	.object({
		id: z.string().min(1).optional().describe('Your user ID.'),
		email: z.string().min(1).optional().describe('Instead of an id.'),
		uuid: z.string().min(1).optional().describe('A Refiner contact UUID.'),
		form_uuid: UuidSchema.describe(
			'The survey the response belongs to. It may be empty and unpublished, as long as it exists.',
		),
		date: z
			.string()
			.optional()
			.describe(
				'ISO 8601, when the response was recorded. Defaults to now, so set it on a historical import.',
			),
		prevent_duplicates: z
			.boolean()
			.optional()
			.describe('Refiner detects duplicates by default; false turns that off.'),
		tags: z
			.array(z.string())
			.max(20)
			.optional()
			.describe('Up to 20 tags for the response.'),
		account: z
			.record(z.string(), z.union([z.string(), z.number(), z.boolean()]))
			.optional(),
	})
	.loose()
	.superRefine((value, ctx) => {
		if (
			value.id === undefined &&
			value.email === undefined &&
			value.uuid === undefined
		) {
			ctx.addIssue({
				code: 'custom',
				path: ['id'],
				message:
					'Give an id, an email or a Refiner uuid; Refiner cannot attach a response without one.',
			});
		}
	});

export type ResponsesStoreInput = z.infer<typeof ResponsesStoreInputSchema>;

const ResponsesStoreResponseSchema = z
	.object({
		message: z.string().nullish(),
		uuid: z.string().nullish().describe('The new response UUID.'),
	})
	.loose();

export type ResponsesStoreResponse = z.infer<
	typeof ResponsesStoreResponseSchema
>;

const ResponsesTagInputSchema = z.object({
	uuid: UuidSchema.describe('The survey response to tag.'),
	tags: z
		.array(z.string().min(1))
		.min(1)
		.max(20)
		.describe('Up to 20 tags. Tags already on the response are kept.'),
});

export type ResponsesTagInput = z.infer<typeof ResponsesTagInputSchema>;

// ── reporting ─────────────────────────────────────────────────────────────

export const REFINER_REPORT_TYPES = [
	'nps',
	'csat',
	'ratings',
	'distribution',
	'count',
] as const;

const ReportingInputSchema = z.object({
	type: z.enum(REFINER_REPORT_TYPES).describe('Which report to compute.'),
	question_identifiers: z
		.array(z.string())
		.min(1)
		.optional()
		.describe(
			'Only count data points for these questions. Omitted means every question matching the type.',
		),
	tag_uuids: z.array(z.string()).min(1).optional(),
	form_uuids: z.array(z.string()).min(1).optional(),
	segment_uuids: z.array(z.string()).min(1).optional(),
	date_range_start: z
		.string()
		.optional()
		.describe('ISO 8601. Defaults to seven days ago.'),
	date_range_end: z
		.string()
		.optional()
		.describe('ISO 8601. Defaults to the end of today.'),
	...ResponseFilterSchema,
});

export type ReportingInput = z.infer<typeof ReportingInputSchema>;

const ReportDistributionSchema = z
	.record(z.string(), z.number())
	.describe(
		'A bucket label to count, such as {"detractors": 5, "promoters": 40}.',
	);

/**
 * One model covers all five report types, because each returns a different set of
 * top-level numbers with a shared `date_range_start` and `date_range_end`. `data`
 * holds the buckets, and the scalar fields that appear depend on `type`: `nps`
 * adds `nps`, `csat` adds `csat`, `ratings` adds `sum`, `average` and `count`,
 * `distribution` adds `responses` and `datapoints`, and `count` adds `views` and
 * `responses`.
 */
const ReportingResponseSchema = z
	.object({
		data: ReportDistributionSchema.nullish(),
		count: z.number().nullish(),
		nps: z.number().nullish(),
		csat: z.number().nullish(),
		sum: z.number().nullish(),
		average: z.number().nullish(),
		responses: z.number().nullish(),
		datapoints: z.number().nullish(),
		views: z.number().nullish(),
		date_range_start: z.string().nullish(),
		date_range_end: z.string().nullish(),
	})
	.loose();

export type ReportingResponse = z.infer<typeof ReportingResponseSchema>;

// ── contacts ──────────────────────────────────────────────────────────────

const ContactsListInputSchema = ListQuerySchema.extend({
	order_by: z
		.enum([
			'display_name',
			'email',
			'first_seen_at',
			'last_seen_at',
			'last_form_submission_at',
		])
		.optional()
		.describe('Defaults to first_seen_at.'),
	form_uuid: z
		.string()
		.optional()
		.describe('Only contacts linked to this survey.'),
	segment_uuid: z.string().optional(),
	search: z.string().optional().describe('Match email, ID or name.'),
});

export type ContactsListInput = z.infer<typeof ContactsListInputSchema>;

const ContactsListResponseSchema = z
	.object({
		items: z.array(ContactSchema).nullish(),
		pagination: PageSchema.nullish(),
	})
	.loose();

export type ContactsListResponse = z.infer<typeof ContactsListResponseSchema>;

const ContactsGetInputSchema = z
	.object({
		id: z
			.string()
			.min(1)
			.optional()
			.describe('Your user ID, or an email address.'),
		email: z.string().min(1).optional(),
		uuid: z.string().min(1).optional().describe('A Refiner contact UUID.'),
	})
	.superRefine((value, ctx) => {
		if (
			value.id === undefined &&
			value.email === undefined &&
			value.uuid === undefined
		) {
			ctx.addIssue({
				code: 'custom',
				path: ['id'],
				message: 'Give an id, an email or a uuid to identify the contact.',
			});
		}
	});

export type ContactsGetInput = z.infer<typeof ContactsGetInputSchema>;

const ContactsGetResponseSchema = ContactSchema;

export type ContactsGetResponse = z.infer<typeof ContactsGetResponseSchema>;

const ContactsDeleteInputSchema = ContactsGetInputSchema;

export type ContactsDeleteInput = z.infer<typeof ContactsDeleteInputSchema>;

// ── forms ─────────────────────────────────────────────────────────────────

export const REFINER_FORM_LISTS = [
	'all',
	'published',
	'drafts',
	'archived',
	'all_with_archived',
] as const;

const FormsListInputSchema = z.object({
	list: z
		.enum(REFINER_FORM_LISTS)
		.optional()
		.describe('Which surveys to include. Defaults to all.'),
	page: z.number().int().min(1).optional(),
	page_length: z.number().int().min(1).max(1000).optional(),
	include_config: z
		.boolean()
		.optional()
		.describe(
			"The survey configuration and each element's. Its format may change as features are added.",
		),
	include_info: z
		.boolean()
		.optional()
		.describe(
			'Creation and publishing dates, response and view counts, and the folder.',
		),
});

export type FormsListInput = z.infer<typeof FormsListInputSchema>;

const FormSchema = z
	.object({
		uuid: z.string().nullish(),
		name: z.string().nullish(),
		channels: z.array(z.string()).nullish(),
		published_at: z.string().nullish(),
		archived_at: z.string().nullish(),
		created_at: z.string().nullish(),
		updated_at: z.string().nullish(),
		responses_count: z.number().nullish(),
		views_count: z.number().nullish(),
		first_form_view_at: z.string().nullish(),
		last_form_view_at: z.string().nullish(),
		folder: z
			.union([z.string(), z.record(z.string(), z.never())])
			.nullish()
			.describe('A folder name, or {} when the survey is not in one.'),
		page_url: z.string().nullish(),
		config: JsonObjectSchema.nullish().describe('Present with include_config.'),
	})
	.loose();

export type RefinerForm = z.infer<typeof FormSchema>;

const FormsListResponseSchema = z
	.object({
		items: z.array(FormSchema).nullish(),
		pagination: PageSchema.nullish(),
	})
	.loose();

export type FormsListResponse = z.infer<typeof FormsListResponseSchema>;

const FormsPublishInputSchema = z.object({
	form_uuid: UuidSchema.describe('The survey to publish or unpublish.'),
	published: z
		.boolean()
		.optional()
		.describe('False unpublishes the survey. Defaults to true.'),
});

export type FormsPublishInput = z.infer<typeof FormsPublishInputSchema>;

const FormsDeleteInputSchema = z.object({
	form_uuid: UuidSchema.describe(
		'The survey to archive. Refiner archives rather than deletes.',
	),
});

export type FormsDeleteInput = z.infer<typeof FormsDeleteInputSchema>;

const FormsDuplicateInputSchema = z.object({
	form_uuid: UuidSchema.describe('The survey to duplicate.'),
	name: z
		.string()
		.min(1)
		.describe("The new survey's name. The copy is created as a draft."),
});

export type FormsDuplicateInput = z.infer<typeof FormsDuplicateInputSchema>;

const FormsDuplicateResponseSchema = z
	.object({
		message: z.string().nullish(),
		source_form_uuid: z.string().nullish(),
		new_form_uuid: z.string().nullish(),
	})
	.loose();

export type FormsDuplicateResponse = z.infer<
	typeof FormsDuplicateResponseSchema
>;

const FormsHistoryInputSchema = z.object({
	form_uuid: UuidSchema.describe('The survey whose history to read.'),
	page: z.number().int().min(1).optional(),
	page_length: z.number().int().min(1).max(1000).optional(),
});

export type FormsHistoryInput = z.infer<typeof FormsHistoryInputSchema>;

const FormVersionSchema = z
	.object({
		uuid: z.string().nullish(),
		action: z.string().nullish().describe('What changed, such as update.'),
		snapshot: JsonObjectSchema.nullish().describe(
			'The full configuration and question set at that point.',
		),
		created_at: z.string().nullish(),
	})
	.loose();

const FormsHistoryResponseSchema = z
	.object({
		items: z.array(FormVersionSchema).nullish(),
		pagination: PageSchema.nullish(),
	})
	.loose();

export type FormsHistoryResponse = z.infer<typeof FormsHistoryResponseSchema>;

// ── segments ──────────────────────────────────────────────────────────────

const SegmentsListInputSchema = z.object({
	page: z.number().int().min(1).optional(),
	page_length: z.number().int().min(1).max(1000).optional(),
});

export type SegmentsListInput = z.infer<typeof SegmentsListInputSchema>;

const SegmentsListResponseSchema = z
	.object({
		items: z.array(SegmentSchema).nullish(),
		pagination: PageSchema.nullish(),
	})
	.loose();

export type SegmentsListResponse = z.infer<typeof SegmentsListResponseSchema>;

const SegmentsSyncInputSchema = z
	.object({
		id: z.string().min(1).optional().describe('Your user ID.'),
		email: z.string().min(1).optional().describe('Instead of an id.'),
		segment_uuid: UuidSchema.describe(
			'The manual segment. A computed segment cannot be edited this way.',
		),
		remove: z
			.boolean()
			.optional()
			.describe(
				'True removes the user instead of adding them. Refiner exposes both through one route, so the plugin picks DELETE for removal.',
			),
	})
	.superRefine((value, ctx) => {
		if (value.id === undefined && value.email === undefined) {
			ctx.addIssue({
				code: 'custom',
				path: ['id'],
				message: 'Give either an id or an email to identify the user.',
			});
		}
	});

export type SegmentsSyncInput = z.infer<typeof SegmentsSyncInputSchema>;

const SegmentsSyncResponseSchema = z
	.object({
		message: z.string().nullish(),
		contact_uuid: z.string().nullish(),
		segment_uuid: z.string().nullish(),
	})
	.loose();

export type SegmentsSyncResponse = z.infer<typeof SegmentsSyncResponseSchema>;

// ── the maps ──────────────────────────────────────────────────────────────

export type RefinerEndpointInputs = {
	accountGet: z.infer<typeof AccountGetInputSchema>;
	identifyUser: IdentifyInput;
	trackEvent: TrackEventInput;
	responsesList: ResponsesListInput;
	responsesStore: ResponsesStoreInput;
	responsesTag: ResponsesTagInput;
	reportingGet: ReportingInput;
	contactsList: ContactsListInput;
	contactsGet: ContactsGetInput;
	contactsDelete: ContactsDeleteInput;
	formsList: FormsListInput;
	formsPublish: FormsPublishInput;
	formsDelete: FormsDeleteInput;
	formsDuplicate: FormsDuplicateInput;
	formsHistory: FormsHistoryInput;
	segmentsList: SegmentsListInput;
	segmentsSync: SegmentsSyncInput;
};

export type RefinerEndpointOutputs = {
	accountGet: AccountGetResponse;
	identifyUser: IdentifyResponse;
	trackEvent: MessageResponse;
	responsesList: ResponsesListResponse;
	responsesStore: ResponsesStoreResponse;
	responsesTag: MessageResponse;
	reportingGet: ReportingResponse;
	contactsList: ContactsListResponse;
	contactsGet: ContactsGetResponse;
	contactsDelete: MessageResponse;
	formsList: FormsListResponse;
	formsPublish: MessageResponse;
	formsDelete: MessageResponse;
	formsDuplicate: FormsDuplicateResponse;
	formsHistory: FormsHistoryResponse;
	segmentsList: SegmentsListResponse;
	segmentsSync: SegmentsSyncResponse;
};

export const RefinerEndpointInputSchemas = {
	accountGet: AccountGetInputSchema,
	identifyUser: IdentifyInputSchema,
	trackEvent: TrackEventInputSchema,
	responsesList: ResponsesListInputSchema,
	responsesStore: ResponsesStoreInputSchema,
	responsesTag: ResponsesTagInputSchema,
	reportingGet: ReportingInputSchema,
	contactsList: ContactsListInputSchema,
	contactsGet: ContactsGetInputSchema,
	contactsDelete: ContactsDeleteInputSchema,
	formsList: FormsListInputSchema,
	formsPublish: FormsPublishInputSchema,
	formsDelete: FormsDeleteInputSchema,
	formsDuplicate: FormsDuplicateInputSchema,
	formsHistory: FormsHistoryInputSchema,
	segmentsList: SegmentsListInputSchema,
	segmentsSync: SegmentsSyncInputSchema,
} as const;

export const RefinerEndpointOutputSchemas = {
	accountGet: AccountGetResponseSchema,
	identifyUser: IdentifyResponseSchema,
	trackEvent: MessageResponseSchema,
	responsesList: ResponsesListResponseSchema,
	responsesStore: ResponsesStoreResponseSchema,
	responsesTag: MessageResponseSchema,
	reportingGet: ReportingResponseSchema,
	contactsList: ContactsListResponseSchema,
	contactsGet: ContactsGetResponseSchema,
	contactsDelete: MessageResponseSchema,
	formsList: FormsListResponseSchema,
	formsPublish: MessageResponseSchema,
	formsDelete: MessageResponseSchema,
	formsDuplicate: FormsDuplicateResponseSchema,
	formsHistory: FormsHistoryResponseSchema,
	segmentsList: SegmentsListResponseSchema,
	segmentsSync: SegmentsSyncResponseSchema,
} as const;
