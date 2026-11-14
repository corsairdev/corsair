import { z } from 'zod';

// Inputs use Kit's own names. Outputs are `.loose()` with their documented
// fields nullish, so a field Kit adds or omits cannot fail a call that has
// already happened. Reference: https://developers.kit.com/api-reference/v4.json

/** The states a subscriber can be in, as Kit documents them. */
export const KIT_SUBSCRIBER_STATES = [
	'active',
	'cancelled',
	'bounced',
	'complained',
	'inactive',
] as const;

/** What `subscribers.list` accepts for `status`, which adds `all` to the states. */
export const KIT_SUBSCRIBER_STATUS_FILTERS = [
	...KIT_SUBSCRIBER_STATES,
	'all',
] as const;

const SubscriberIdSchema = z
	.number()
	.int()
	.positive()
	.describe('The subscriber ID, from `subscribers.list`.');

const TagIdSchema = z.number().int().positive().describe('The tag ID.');

const CustomFieldIdSchema = z
	.number()
	.int()
	.positive()
	.describe('The custom field ID.');

const FormIdSchema = z.number().int().positive().describe('The form ID.');

const EmailSchema = z
	.string()
	.min(3)
	.describe(
		'An email address. Kit normalizes its case, and returns an existing subscriber rather than creating a duplicate.',
	);

// ── pagination ────────────────────────────────────────────────────────────

// Kit pages by cursor: `end_cursor` names the next page and `start_cursor` the
// previous one. `has_next_page` is what says whether to follow it at all.
const PaginationSchema = z
	.object({
		has_previous_page: z.boolean().nullish(),
		has_next_page: z.boolean().nullish(),
		start_cursor: z.string().nullish(),
		end_cursor: z.string().nullish(),
		per_page: z.number().nullish(),
	})
	.loose();

export type KitPagination = z.infer<typeof PaginationSchema>;

const PaginationInputSchema = z.object({
	after: z
		.string()
		.min(1)
		.optional()
		.describe('The `end_cursor` of the page before, for the next page.'),
	before: z
		.string()
		.min(1)
		.optional()
		.describe('The `start_cursor` of the page after, for the previous page.'),
	per_page: z
		.number()
		.int()
		.min(1)
		.max(1000)
		.optional()
		.describe('Items per page, up to 1000. Kit’s default is 500.'),
});

// ── account ───────────────────────────────────────────────────────────────

const AccountGetInputSchema = z.object({});

export type AccountGetInput = z.input<typeof AccountGetInputSchema>;

const SendingAddressSchema = z
	.object({
		email_address: z.string().nullish(),
		from_name: z.string().nullish(),
		status: z.string().nullish(),
		is_default: z.boolean().nullish(),
		is_verified: z.boolean().nullish(),
		is_dmarc_configured: z.boolean().nullish(),
	})
	.loose();

const AccountResponseSchema = z
	.object({
		user: z
			.object({
				id: z.number().nullish(),
				email: z.string().nullish(),
			})
			.loose()
			.nullish(),
		// Kit always answers an account on this route, so a body without one is a
		// failure rather than a sparse read. `user` stays optional because a
		// personal key and an OAuth token describe the caller differently.
		account: z
			.object({
				id: z.number().nullish(),
				name: z.string().nullish(),
				plan_type: z.string().nullish(),
				primary_email_address: z.string().nullish(),
				created_at: z.string().nullish(),
				timezone: z
					.object({
						name: z.string().nullish(),
						friendly_name: z.string().nullish(),
						utc_offset: z.string().nullish(),
					})
					.loose()
					.nullish(),
				sending_addresses: z.array(SendingAddressSchema).nullish(),
				plan: z
					.object({
						plan_type: z.string().nullish(),
						interval: z.string().nullish(),
						subscriber_limit: z.number().nullish(),
						on_trial: z.boolean().nullish(),
						trial_lapse_date: z.string().nullish(),
						renews_at: z.string().nullish(),
						cancels_at: z.string().nullish(),
					})
					.loose()
					.nullish(),
			})
			.loose(),
	})
	.loose();

export type AccountResponse = z.infer<typeof AccountResponseSchema>;

// ── subscribers ───────────────────────────────────────────────────────────

const SubscriberAttributionSchema = z
	.object({
		referrer: z.string().nullish(),
		utm_source: z.string().nullish(),
		utm_medium: z.string().nullish(),
		utm_campaign: z.string().nullish(),
		utm_term: z.string().nullish(),
		utm_content: z.string().nullish(),
		source_type: z.string().nullish(),
		source_name: z.string().nullish(),
		source_mechanism: z.string().nullish(),
		source_mechanism_id: z.number().nullish(),
	})
	.loose();

const SubscriberLocationSchema = z
	.object({
		city: z.string().nullish(),
		state: z.string().nullish(),
		country: z.string().nullish(),
		latitude: z.number().nullish(),
		longitude: z.number().nullish(),
		timezone: z.string().nullish(),
	})
	.loose();

export type KitSubscriberLocation = z.infer<typeof SubscriberLocationSchema>;

// `fields` holds the custom field values, keyed by the field's `key`, so it is
// an open record rather than a fixed shape.
// unknown: the keys are the account's own custom field keys, which the caller
// defines, so no static type can describe them.
const SubscriberFieldsSchema = z.record(z.string(), z.string().nullish());

export const KitSubscriberSchema = z
	.object({
		id: z.number(),
		first_name: z.string().nullish(),
		email_address: z.string(),
		state: z.string().nullish(),
		created_at: z.string().nullish(),
		canceled_at: z.string().nullish(),
		fields: SubscriberFieldsSchema.nullish(),
		attribution: SubscriberAttributionSchema.nullish(),
		location: SubscriberLocationSchema.nullish(),
		tags: z
			.array(
				z
					.object({ id: z.number().nullish(), name: z.string().nullish() })
					.loose(),
			)
			.nullish(),
	})
	.loose();

export type KitSubscriber = z.infer<typeof KitSubscriberSchema>;

const SubscribersListInputSchema = PaginationInputSchema.extend({
	status: z
		.enum(KIT_SUBSCRIBER_STATUS_FILTERS)
		.optional()
		.describe('Defaults to `active`. `all` widens it to every state.'),
	email_address: z
		.string()
		.optional()
		.describe('Only the subscriber with this exact address.'),
	include: z
		.array(z.enum(['attribution', 'tags', 'location', 'canceled_at']))
		.min(1)
		.optional()
		.describe(
			'Embed these extra fields on each subscriber. `canceled_at` needs `status: "cancelled"`.',
		),
	include_total_count: z
		.boolean()
		.optional()
		.describe('Also return the total number of matching subscribers.'),
	slim: z
		.boolean()
		.optional()
		.describe('Omit the `fields` object for a smaller, faster response.'),
	sort_field: z
		.enum([
			'id',
			'created_at',
			'updated_at',
			'cancelled_at',
			'canceled_at',
			'engagement__sent',
			'engagement__opens',
			'engagement__clicks',
			'engagement__open_rate',
			'engagement__click_rate',
		])
		.optional()
		.describe(
			'Field to order by. `cancelled_at` needs `status: "cancelled"`. An `engagement__<metric>` sort orders by the trailing 90 days and cannot be combined with `email_address`.',
		),
	sort_order: z.enum(['asc', 'desc']).optional(),
	created_after: z.string().optional().describe('A date, `yyyy-mm-dd`.'),
	created_before: z.string().optional().describe('A date, `yyyy-mm-dd`.'),
	updated_after: z.string().optional().describe('A date, `yyyy-mm-dd`.'),
	updated_before: z.string().optional().describe('A date, `yyyy-mm-dd`.'),
}).superRefine((value, ctx) => {
	// Kit documents that an engagement sort cannot be combined with an address
	// lookup, so the pairing is refused before the call.
	if (
		value.sort_field?.startsWith('engagement__') === true &&
		value.email_address !== undefined
	) {
		ctx.addIssue({
			code: 'custom',
			path: ['sort_field'],
			message:
				'An `engagement__` sort cannot be combined with `email_address`.',
		});
	}
	// Kit answers 422 for `canceled_at` beside any status but `cancelled`, so the
	// pairing is refused before the call rather than after it.
	if (
		value.include?.includes('canceled_at') === true &&
		value.status !== 'cancelled'
	) {
		ctx.addIssue({
			code: 'custom',
			path: ['include'],
			message: '`canceled_at` can only be included with `status: "cancelled"`.',
		});
	}
});

export type SubscribersListInput = z.input<typeof SubscribersListInputSchema>;

const SubscribersListResponseSchema = z
	.object({
		subscribers: z.array(KitSubscriberSchema),
		pagination: PaginationSchema.nullish(),
	})
	.loose();

export type SubscribersListResponse = z.infer<
	typeof SubscribersListResponseSchema
>;

const SubscriberGetInputSchema = z.object({ subscriberId: SubscriberIdSchema });

export type SubscriberGetInput = z.input<typeof SubscriberGetInputSchema>;

const SubscriberResponseSchema = z
	.object({ subscriber: KitSubscriberSchema })
	.loose();

export type SubscriberResponse = z.infer<typeof SubscriberResponseSchema>;

// A create answers `{ subscriber, warnings? }`, where a warning names a custom
// field key Kit did not recognise.
const SubscriberWriteResponseSchema = z
	.object({
		subscriber: KitSubscriberSchema,
		warnings: z
			.array(z.string())
			.nullish()
			.describe(
				'Custom field keys Kit ignored because it did not recognise them.',
			),
	})
	.loose();

export type SubscriberWriteResponse = z.infer<
	typeof SubscriberWriteResponseSchema
>;

const SubscribersCreateInputSchema = z.object({
	email_address: EmailSchema,
	first_name: z.string().optional(),
	state: z
		.enum(KIT_SUBSCRIBER_STATES)
		.optional()
		.describe('Defaults to `active`.'),
	fields: z
		.record(z.string(), z.string())
		.optional()
		.describe(
			'Custom field values keyed by the field’s `key`, such as `last_name`. An unknown key is ignored and named in `warnings`.',
		),
});

export type SubscribersCreateInput = z.input<
	typeof SubscribersCreateInputSchema
>;

const SubscribersUpdateInputSchema = z.object({
	subscriberId: SubscriberIdSchema,
	email_address: EmailSchema,
	first_name: z.string().nullable().optional(),
	fields: z.record(z.string(), z.string()).optional(),
});

export type SubscribersUpdateInput = z.input<
	typeof SubscribersUpdateInputSchema
>;

// An unsubscribe answers 204 with no body, so the result states what happened.
const UnsubscribedResponseSchema = z.object({
	success: z.literal(true),
	subscriber_id: z.number(),
});

export type UnsubscribedResponse = z.infer<typeof UnsubscribedResponseSchema>;

const SubscribersUnsubscribeInputSchema = z.object({
	subscriberId: SubscriberIdSchema,
});

export type SubscribersUnsubscribeInput = z.input<
	typeof SubscribersUnsubscribeInputSchema
>;

// ── tags ──────────────────────────────────────────────────────────────────

export const KitTagSchema = z
	.object({
		id: z.number(),
		name: z.string(),
		created_at: z.string().nullish(),
		subscriber_count: z
			.number()
			.nullish()
			.describe('Present when `include` asks for `subscriber_count`.'),
	})
	.loose();

export type KitTag = z.infer<typeof KitTagSchema>;

const TagsListInputSchema = PaginationInputSchema.extend({
	include: z
		.array(z.enum(['subscriber_count']))
		.min(1)
		.optional()
		.describe('Also return each tag’s active subscriber count.'),
});

export type TagsListInput = z.input<typeof TagsListInputSchema>;

const TagsListResponseSchema = z
	.object({
		tags: z.array(KitTagSchema),
		pagination: PaginationSchema.nullish(),
	})
	.loose();

export type TagsListResponse = z.infer<typeof TagsListResponseSchema>;

const TagResponseSchema = z.object({ tag: KitTagSchema }).loose();

export type TagResponse = z.infer<typeof TagResponseSchema>;

const TagsCreateInputSchema = z.object({
	name: z
		.string()
		.min(1)
		.describe(
			'The tag name. Kit returns the existing tag if the name is taken.',
		),
});

export type TagsCreateInput = z.input<typeof TagsCreateInputSchema>;

const TagsUpdateInputSchema = z.object({
	tagId: TagIdSchema,
	name: z.string().min(1),
});

export type TagsUpdateInput = z.input<typeof TagsUpdateInputSchema>;

// Untagging answers 204 and tagging answers the subscriber, so both results
// state what happened; a tag also carries the subscriber's ID.
const TaggedResponseSchema = z.object({
	success: z.literal(true),
	tag_id: z.number(),
	email_address: z.string().optional(),
	subscriber_id: z.number().optional(),
});

export type TaggedResponse = z.infer<typeof TaggedResponseSchema>;

const TagsTagSubscriberInputSchema = z.object({
	tagId: TagIdSchema,
	email_address: EmailSchema,
});

export type TagsTagSubscriberInput = z.input<
	typeof TagsTagSubscriberInputSchema
>;

const TagsUntagSubscriberInputSchema = z.object({
	tagId: TagIdSchema,
	email_address: EmailSchema,
});

export type TagsUntagSubscriberInput = z.input<
	typeof TagsUntagSubscriberInputSchema
>;

// ── custom fields ─────────────────────────────────────────────────────────

export const KitCustomFieldSchema = z
	.object({
		id: z.number(),
		name: z.string().nullish(),
		key: z
			.string()
			.nullish()
			.describe('The key a subscriber `fields` map uses.'),
		label: z.string().nullish(),
	})
	.loose();

export type KitCustomField = z.infer<typeof KitCustomFieldSchema>;

const CustomFieldsListInputSchema = PaginationInputSchema.extend({
	include_total_count: z.boolean().optional(),
});

export type CustomFieldsListInput = z.input<typeof CustomFieldsListInputSchema>;

const CustomFieldsListResponseSchema = z
	.object({
		custom_fields: z.array(KitCustomFieldSchema),
		pagination: PaginationSchema.nullish(),
	})
	.loose();

export type CustomFieldsListResponse = z.infer<
	typeof CustomFieldsListResponseSchema
>;

const CustomFieldResponseSchema = z
	.object({ custom_field: KitCustomFieldSchema })
	.loose();

export type CustomFieldResponse = z.infer<typeof CustomFieldResponseSchema>;

const CustomFieldsCreateInputSchema = z.object({
	label: z
		.string()
		.min(1)
		.describe('The field label. Kit derives its `key` from this.'),
});

export type CustomFieldsCreateInput = z.input<
	typeof CustomFieldsCreateInputSchema
>;

const CustomFieldsUpdateInputSchema = z.object({
	customFieldId: CustomFieldIdSchema,
	label: z.string().min(1),
});

export type CustomFieldsUpdateInput = z.input<
	typeof CustomFieldsUpdateInputSchema
>;

// ── forms ─────────────────────────────────────────────────────────────────

export const KitFormSchema = z
	.object({
		id: z.number(),
		name: z.string().nullish(),
		created_at: z.string().nullish(),
		type: z.string().nullish(),
		format: z.string().nullish(),
		embed_js: z.string().nullish(),
		embed_url: z.string().nullish(),
		archived: z.boolean().nullish(),
		uid: z.string().nullish(),
		subscriber_count: z.number().nullish(),
	})
	.loose();

export type KitForm = z.infer<typeof KitFormSchema>;

const FormsListInputSchema = PaginationInputSchema.extend({
	include: z
		.array(z.enum(['subscriber_count']))
		.min(1)
		.optional()
		.describe('Also return each form’s active subscriber count.'),
	status: z
		.enum(['active', 'archived', 'trashed', 'all'])
		.optional()
		.describe('Defaults to `active`.'),
});

export type FormsListInput = z.input<typeof FormsListInputSchema>;

const FormsListResponseSchema = z
	.object({
		forms: z.array(KitFormSchema),
		pagination: PaginationSchema.nullish(),
	})
	.loose();

export type FormsListResponse = z.infer<typeof FormsListResponseSchema>;

const FormsSubscribeInputSchema = z.object({
	form_id: FormIdSchema,
	email_address: EmailSchema,
	referrer: z.string().optional().describe('Where the signup came from.'),
});

export type FormsSubscribeInput = z.input<typeof FormsSubscribeInputSchema>;

// Subscribing through a form answers the subscriber with `added_at` set.
const FormSubscriberResponseSchema = z
	.object({
		subscriber: KitSubscriberSchema.extend({
			added_at: z
				.string()
				.nullish()
				.describe('When the form recorded the signup.'),
		}),
	})
	.loose();

export type FormSubscriberResponse = z.infer<
	typeof FormSubscriberResponseSchema
>;

// ── Registry ──────────────────────────────────────────────────────────────

export type KitEndpointInputs = {
	accountGet: AccountGetInput;
	subscribersList: SubscribersListInput;
	subscribersGet: SubscriberGetInput;
	subscribersCreate: SubscribersCreateInput;
	subscribersUpdate: SubscribersUpdateInput;
	subscribersUnsubscribe: SubscribersUnsubscribeInput;
	tagsList: TagsListInput;
	tagsCreate: TagsCreateInput;
	tagsUpdate: TagsUpdateInput;
	tagsTagSubscriber: TagsTagSubscriberInput;
	tagsUntagSubscriber: TagsUntagSubscriberInput;
	customFieldsList: CustomFieldsListInput;
	customFieldsCreate: CustomFieldsCreateInput;
	customFieldsUpdate: CustomFieldsUpdateInput;
	formsList: FormsListInput;
	formsSubscribe: FormsSubscribeInput;
};

export type KitEndpointOutputs = {
	accountGet: AccountResponse;
	subscribersList: SubscribersListResponse;
	subscribersGet: SubscriberResponse;
	subscribersCreate: SubscriberWriteResponse;
	subscribersUpdate: SubscriberWriteResponse;
	subscribersUnsubscribe: UnsubscribedResponse;
	tagsList: TagsListResponse;
	tagsCreate: TagResponse;
	tagsUpdate: TagResponse;
	tagsTagSubscriber: TaggedResponse;
	tagsUntagSubscriber: TaggedResponse;
	customFieldsList: CustomFieldsListResponse;
	customFieldsCreate: CustomFieldResponse;
	customFieldsUpdate: CustomFieldResponse;
	formsList: FormsListResponse;
	formsSubscribe: FormSubscriberResponse;
};

export const KitEndpointInputSchemas = {
	accountGet: AccountGetInputSchema,
	subscribersList: SubscribersListInputSchema,
	subscribersGet: SubscriberGetInputSchema,
	subscribersCreate: SubscribersCreateInputSchema,
	subscribersUpdate: SubscribersUpdateInputSchema,
	subscribersUnsubscribe: SubscribersUnsubscribeInputSchema,
	tagsList: TagsListInputSchema,
	tagsCreate: TagsCreateInputSchema,
	tagsUpdate: TagsUpdateInputSchema,
	tagsTagSubscriber: TagsTagSubscriberInputSchema,
	tagsUntagSubscriber: TagsUntagSubscriberInputSchema,
	customFieldsList: CustomFieldsListInputSchema,
	customFieldsCreate: CustomFieldsCreateInputSchema,
	customFieldsUpdate: CustomFieldsUpdateInputSchema,
	formsList: FormsListInputSchema,
	formsSubscribe: FormsSubscribeInputSchema,
} as const;

export const KitEndpointOutputSchemas = {
	accountGet: AccountResponseSchema,
	subscribersList: SubscribersListResponseSchema,
	subscribersGet: SubscriberResponseSchema,
	subscribersCreate: SubscriberWriteResponseSchema,
	subscribersUpdate: SubscriberWriteResponseSchema,
	subscribersUnsubscribe: UnsubscribedResponseSchema,
	tagsList: TagsListResponseSchema,
	tagsCreate: TagResponseSchema,
	tagsUpdate: TagResponseSchema,
	tagsTagSubscriber: TaggedResponseSchema,
	tagsUntagSubscriber: TaggedResponseSchema,
	customFieldsList: CustomFieldsListResponseSchema,
	customFieldsCreate: CustomFieldResponseSchema,
	customFieldsUpdate: CustomFieldResponseSchema,
	formsList: FormsListResponseSchema,
	formsSubscribe: FormSubscriberResponseSchema,
} as const;
