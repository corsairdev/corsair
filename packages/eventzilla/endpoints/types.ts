import { asRecord } from 'corsair/core';
import { z } from 'zod';
import { emptyListMessage } from '../client';

// Inputs use Eventzilla's own parameter names. Outputs are `.loose()` with
// every documented field nullish, because the reference marks no response
// field required and providers send JSON `null` for an unset one. Nothing here
// renames a field: the API mixes conventions (`transaction_ref`,
// `ticket_type_id`, `bar_code`, `is_attended`), and a "tidied" name would be a
// silent wrong result for anyone reading the API's own docs.
//
// Reference: https://developer.eventzilla.net/

// ── Shared ────────────────────────────────────────────────────────────────

/**
 * Eventzilla's numbers arrive as either a number or a string depending on the
 * route: `transaction_amount: 198` on a list, `"USD 99.00"` on checkout
 * prepare. Both are accepted and passed through as sent rather than coerced,
 * because `"USD 99.00"` does not survive Number().
 */
export const FlexibleNumberSchema = z.union([z.number(), z.string()]);

/**
 * `true`/`false` as booleans, or the strings the API sometimes sends. The
 * reference lists eight spellings (`true`, `False`, `yes`, `No`, …); this is an
 * output-only schema, so any string is accepted rather than that list. A ninth
 * spelling would otherwise fail a whole ticket list, or throw away the answer
 * to a create that had already gone through.
 */
export const FlexibleBooleanSchema = z.union([z.boolean(), z.string()]);

/** Both list routes default to 20 and the reference documents no maximum. */
export const EVENTZILLA_DEFAULT_LIMIT = 20;

const OffsetSchema = z
	.number()
	.int()
	.min(0)
	.optional()
	.describe(`Records to skip. Defaults to 0.`);

const LimitSchema = z
	.number()
	.int()
	.min(1)
	.optional()
	.describe(`Records to return. Defaults to ${EVENTZILLA_DEFAULT_LIMIT}.`);

const EventIdSchema = z.number().int().positive();

const PaginationItemSchema = z
	.object({
		offset: z.number().nullish(),
		limit: z.number().nullish(),
		total: z.number().nullish(),
	})
	.loose();

/**
 * How an empty list is answered: **HTTP 200 with only a message**, no resource
 * array at all. Verified live (`{"message":"No events found"}`). This is the
 * one 200-plus-message body that is not an error, so the paged endpoints turn
 * it into an empty page rather than letting it fail the parse. Done in the
 * endpoint's `shape` hook, not with `.transform()`, which the docs generator
 * cannot see.
 */
export const EmptyListSchema = z.object({ message: z.string() }).loose();

/**
 * A **one-element array**, not an object: every paged route sends
 * `"pagination": [{ offset, limit, total }]`. Typing it as an object would fail
 * the parse on every list call.
 */
export const PaginationSchema = z.array(PaginationItemSchema);

export type EventzillaPagination = z.infer<typeof PaginationSchema>;

/** The next page, derived from `pagination[0]` rather than added by a transform. */
export function nextOffset(
	pagination: EventzillaPagination | undefined,
	itemCount: number,
): number | null {
	const page = pagination?.[0];
	const offset = page?.offset ?? 0;
	const limit = page?.limit ?? EVENTZILLA_DEFAULT_LIMIT;
	const returned = itemCount;
	if (returned === 0) return null;
	const consumed = offset + returned;
	if (typeof page?.total === 'number' && consumed >= page.total) return null;
	// No total: a short page is the last one. A full last page costs one extra
	// empty call, which is the only safe reading without a total.
	if (returned < limit) return null;
	return consumed;
}

// ── Events ────────────────────────────────────────────────────────────────

/**
 * **Only `live` is accepted.** Verified live against the real API: `status=live`
 * answers a result, while `draft`, `unpublished`, `completed`, their capitalised
 * forms (which the reference's own examples use), and any other value answer
 * HTTP 200 with `{"message":"Invalid URL / Format exception"}`. That message
 * reads like a URL problem, so it is worth failing before the call rather than
 * surfacing it. The event *payload* still returns `"status": "Live"` — the
 * filter value and the field value differ in case.
 */
export const EVENTZILLA_EVENT_STATUS_FILTERS = ['live'] as const;

export const EventSchema = z
	.object({
		id: z.number().nullish(),
		title: z.string().nullish(),
		description: z.string().nullish(),
		currency: z.string().nullish(),
		start_date: z.string().nullish(),
		start_time: z.string().nullish(),
		end_date: z.string().nullish(),
		end_time: z.string().nullish(),
		dateid: z.number().nullish(),
		time_zone: z.string().nullish(),
		tickets_sold: z.number().nullish(),
		tickets_total: z.number().nullish(),
		// A string rather than the enum, so an unknown status cannot fail a read.
		status: z.string().nullish(),
		show_remaining: z.boolean().nullish(),
		twitter_hashtag: z.string().nullish(),
		utc_offset: z.string().nullish(),
		invite_code: z.string().nullish(),
		url: z.string().nullish(),
		logo_url: z.string().nullish(),
		bgimage_url: z.string().nullish(),
		venue: z.string().nullish(),
		categories: z.string().nullish(),
		language: z.string().nullish(),
		description_html: z.string().nullish(),
		timezone_code: z.string().nullish(),
	})
	.loose();

export type EventzillaEvent = z.infer<typeof EventSchema>;

const EventsListInputSchema = z.object({
	status: z
		.enum(EVENTZILLA_EVENT_STATUS_FILTERS)
		.optional()
		.describe(
			'Only `live` is accepted. Every other value, including the capitalised spellings, is rejected by the API.',
		),
	category: z.string().min(1).optional().describe('Only this category name.'),
	offset: OffsetSchema,
	limit: LimitSchema,
});

export type EventsListInput = z.input<typeof EventsListInputSchema>;

const EventsListResponseSchema = z
	.object({
		pagination: PaginationSchema.nullish(),
		events: z.array(EventSchema),
		next_offset: z
			.number()
			.nullable()
			.describe(
				'Offset of the next page, or null when this is the last one. Pass it back as `offset`.',
			),
		// Present only when the API answered the empty-list message.
		message: z.string().optional(),
	})
	.loose();

export type EventsListResponse = z.infer<typeof EventsListResponseSchema>;

const EventsGetInputSchema = z.object({
	eventid: EventIdSchema.describe('The event to read.'),
});

export type EventsGetInput = z.input<typeof EventsGetInputSchema>;

/**
 * An array under `events` even for one event id, and the array is required:
 * `?? []` here would turn "the id does not exist" into an empty result.
 */
const EventsGetResponseSchema = z
	.object({
		events: z.array(EventSchema),
	})
	.loose();

export type EventsGetResponse = z.infer<typeof EventsGetResponseSchema>;

// ── Event transactions and attendees ──────────────────────────────────────

export const TransactionSchema = z
	.object({
		transaction_ref: z.string().nullish(),
		checkout_id: z.number().nullish(),
		transaction_date: z.string().nullish(),
		transaction_amount: FlexibleNumberSchema.nullish(),
		tickets_in_transaction: z.number().nullish(),
		event_date: z.string().nullish(),
		transaction_status: z.string().nullish(),
		user_id: z.number().nullish(),
		buyer_id: z.number().nullish(),
		event_id: z.number().nullish(),
		title: z.string().nullish(),
		email: z.string().nullish(),
		buyer_first_name: z.string().nullish(),
		buyer_last_name: z.string().nullish(),
		promo_code: z.string().nullish(),
		payment_type: z.string().nullish(),
		// The reference types this as an object; the samples send "" and the
		// schema marks nothing required, so both are accepted.
		comments: z
			.union([z.string(), z.record(z.string(), z.unknown())])
			.nullish(),
		transaction_tax: FlexibleNumberSchema.nullish(),
		transaction_discount: FlexibleNumberSchema.nullish(),
		eventzilla_fee: FlexibleNumberSchema.nullish(),
		refno: z.string().nullish(),
	})
	.loose();

export type EventzillaTransaction = z.infer<typeof TransactionSchema>;

const EventsTransactionsInputSchema = z.object({
	eventid: EventIdSchema.describe('The event whose transactions to list.'),
	offset: OffsetSchema,
	limit: LimitSchema,
});

export type EventsTransactionsInput = z.input<
	typeof EventsTransactionsInputSchema
>;

const EventsTransactionsResponseSchema = z
	.object({
		pagination: PaginationSchema.nullish(),
		transactions: z.array(TransactionSchema),
		next_offset: z.number().nullable(),
		// Present only when the API answered the empty-list message.
		message: z.string().optional(),
	})
	.loose();

export type EventsTransactionsResponse = z.infer<
	typeof EventsTransactionsResponseSchema
>;

export const QuestionAnswerSchema = z
	.object({
		questionid: z.number().nullish(),
		// Eventzilla's own names, plural and all.
		questions: z.string().nullish(),
		answer: z.string().nullish(),
	})
	.loose();

/**
 * `is_attended` is documented as a **string** (`"Yes"`/`"No"`), not a boolean.
 * A real attendee row sends `"No"`, so typing it as a boolean fails the parse.
 * It is kept as sent and `attended` is derived beside it.
 */
export const AttendeeSchema = z
	.object({
		first_name: z.string().nullish(),
		last_name: z.string().nullish(),
		ticket_type: z.string().nullish(),
		bar_code: z.string().nullish(),
		is_attended: z.string().nullish(),
		transaction_ref: z.string().nullish(),
		refno: z.string().nullish(),
		questions: z.array(QuestionAnswerSchema).nullish(),
		id: z.number().nullish(),
		transaction_date: z.string().nullish(),
		transaction_amount: FlexibleNumberSchema.nullish(),
		event_date: z.string().nullish(),
		transaction_status: z.string().nullish(),
		user_id: z.number().nullish(),
		event_id: z.number().nullish(),
		title: z.string().nullish(),
		email: z.string().nullish(),
		buyer_first_name: z.string().nullish(),
		buyer_last_name: z.string().nullish(),
		promo_code: z.string().nullish(),
		payment_type: z.string().nullish(),
	})
	.loose();

export type EventzillaAttendee = z.infer<typeof AttendeeSchema>;

/**
 * `"Yes"`/`"No"`, and anything else the provider sends, read as the boolean a
 * caller wants. Exported so the test can pin it; declared on the schema rather
 * than added with `.transform()`, which the docs generator cannot see.
 */
export function isAttendedFlag(isAttended: string | null | undefined) {
	if (isAttended === null || isAttended === undefined) return null;
	const value = isAttended.trim().toLowerCase();
	if (value === 'yes' || value === 'true' || value === '1') return true;
	if (value === 'no' || value === 'false' || value === '0') return false;
	return null;
}

const AttendeeWithFlagSchema = AttendeeSchema.extend({
	attended: z
		.boolean()
		.nullable()
		.describe(
			'`is_attended` read as a boolean; null when the provider sent neither Yes nor No.',
		),
});

export type EventzillaAttendeeWithFlag = z.infer<typeof AttendeeWithFlagSchema>;

/**
 * Adds the derived `attended` flag to each attendee row and leaves everything
 * else exactly as the provider sent it. A missing or non-array `attendees` value
 * is passed through untouched so the output schema rejects it: turning a
 * malformed successful response into an empty list would report "no attendees"
 * when the truth is "this payload was wrong". Shared by `events.attendees` and
 * `attendees.get`, which receive the same rows.
 *
 * The one body read as empty is the provider's own empty-list answer, a 200
 * with only `{"message":"No … found"}` (captured live on /events). The client
 * already lets that body through as "not an error", so it has to become an
 * empty list here or an event with no registrations fails the parse.
 */
export function shapeAttendees(
	// unknown: the response body, validated by the output schema after this.
	raw: unknown,
): Record<string, unknown> {
	const empty = emptyListMessage(raw);
	if (empty !== undefined) return { attendees: [], message: empty };
	const body = asRecord(raw);
	if (!body) return {};
	if (!Array.isArray(body.attendees)) return body;
	return {
		...body,
		attendees: body.attendees.map((row: unknown) => {
			if (!row || typeof row !== 'object' || Array.isArray(row)) return row;
			const record = row as Record<string, unknown>;
			const flag = record.is_attended;
			return {
				...record,
				attended: isAttendedFlag(typeof flag === 'string' ? flag : undefined),
			};
		}),
	};
}

const EventsAttendeesInputSchema = z.object({
	eventid: EventIdSchema.describe('The event whose attendees to list.'),
});

export type EventsAttendeesInput = z.input<typeof EventsAttendeesInputSchema>;

// No pagination: the route takes eventid only and the example sends no page
// fields, so there is no cursor to wrap.
const EventsAttendeesResponseSchema = z
	.object({
		attendees: z.array(AttendeeWithFlagSchema),
		// Present only when the API answered the empty-list message.
		message: z.string().optional(),
	})
	.loose();

export type EventsAttendeesResponse = z.infer<
	typeof EventsAttendeesResponseSchema
>;

// ── Ticket types ──────────────────────────────────────────────────────────

export const TicketTypeSchema = z
	.object({
		id: z.number().nullish(),
		title: z.string().nullish(),
		quantity_total: z.number().nullish(),
		price: FlexibleNumberSchema.nullish(),
		description: z.string().nullish(),
		sales_start_date: z.string().nullish(),
		sales_start_time: z.string().nullish(),
		sales_end_date: z.string().nullish(),
		sales_end_time: z.string().nullish(),
		group_discount: FlexibleNumberSchema.nullish(),
		group_percentage: FlexibleNumberSchema.nullish(),
		group_price: FlexibleNumberSchema.nullish(),
		additional_instructions: z.string().nullish(),
		unlock_code: z.string().nullish(),
		ticket_type: z.string().nullish(),
		// Deprecated, and still sent: both are output fields only.
		tickets: z.string().nullish(),
		is_visible: FlexibleBooleanSchema.nullish(),
		isvisible: FlexibleBooleanSchema.nullish(),
		boxoffice_only: FlexibleBooleanSchema.nullish(),
		allow_partial_payment: FlexibleBooleanSchema.nullish(),
		limit_minimum: z.number().nullish(),
		limit_maximum: z.number().nullish(),
		partial_payment_installments: z.number().nullish(),
		partial_payment_frequency: z.string().nullish(),
		partial_payment_amount: FlexibleNumberSchema.nullish(),
	})
	.loose();

export type EventzillaTicketType = z.infer<typeof TicketTypeSchema>;

export const DonationSchema = z
	.object({
		donationid: z.number().nullish(),
		title: z.string().nullish(),
		description: z.string().nullish(),
		quantity_total: z.number().nullish(),
		donation_minimum: FlexibleNumberSchema.nullish(),
		donation_start_date: z.string().nullish(),
		donation_end_date: z.string().nullish(),
	})
	.loose();

const TicketsListInputSchema = z.object({
	eventid: EventIdSchema.describe('The event whose ticket types to list.'),
});

export type TicketsListInput = z.input<typeof TicketsListInputSchema>;

const TicketsListResponseSchema = z
	.object({
		tickets: z.array(TicketTypeSchema),
		donation: z.array(DonationSchema).nullish(),
		// Present only when the API answered the empty-list message.
		message: z.string().optional(),
	})
	.loose();

export type TicketsListResponse = z.infer<typeof TicketsListResponseSchema>;

/**
 * The free-ticket-type body. Every field the reference marks required is
 * required here, and `limit_maximum` is checked against `limit_minimum`: the
 * API accepts the pair without complaining in some cases and then refuses
 * every order, which is worth one call saved.
 */
const ticketTypeWriteShape = {
	ticket_type_name: z
		.string()
		.min(1)
		.describe('Name shown for this ticket type.'),
	quantity_total: z
		.number()
		.int()
		.min(0)
		.describe('How many of this ticket type exist.'),
	ticket_type_description: z
		.string()
		.describe('Description shown to attendees.'),
	sales_start_date: z
		.string()
		.min(1)
		.describe('Date sales open. ISO 8601 (`2026-02-05`) is preferred.'),
	sales_start_time: z
		.string()
		.min(1)
		.describe('Time sales open, such as `09:00`.'),
	sales_end_date: z
		.string()
		.min(1)
		.describe('Date sales close. ISO 8601 (`2026-04-20`) is preferred.'),
	sales_end_time: z
		.string()
		.min(1)
		.describe('Time sales close, such as `23:00`.'),
	limit_minimum: z
		.number()
		.int()
		.min(1)
		.describe('Fewest tickets one order may take.'),
	limit_maximum: z
		.number()
		.int()
		.min(1)
		.describe('Most tickets one order may take.'),
	is_visible: z
		.boolean()
		.describe('Whether the ticket type shows on the registration page.'),
	boxoffice_only: z
		.boolean()
		.describe('Whether this ticket type is sold only at the box office.'),
	additional_instructions: z
		.string()
		.optional()
		.describe('Notes shown to attendees after registering.'),
	unlock_code: z
		.string()
		.optional()
		.describe('Code needed to reveal a restricted ticket type.'),
} as const;

const TicketTypeWriteInputSchema = z.object(ticketTypeWriteShape);

export type TicketTypeWriteInput = z.input<typeof TicketTypeWriteInputSchema>;

/** The limits the API accepts and then silently cannot sell against. */
function checkTicketTypeLimits(
	value: {
		quantity_total: number;
		limit_minimum: number;
		limit_maximum: number;
	},
	ctx: z.RefinementCtx,
) {
	if (value.limit_maximum < value.limit_minimum) {
		ctx.addIssue({
			code: 'custom',
			path: ['limit_maximum'],
			message:
				'`limit_maximum` must be at least `limit_minimum`, or no order can be placed.',
		});
	}
	if (value.quantity_total < value.limit_minimum) {
		ctx.addIssue({
			code: 'custom',
			path: ['quantity_total'],
			message:
				'`quantity_total` is below `limit_minimum`, so the first order could not be filled.',
		});
	}
}

const TicketTypesCreateInputSchema = z
	.object({
		eventid: EventIdSchema.describe('The event to add the ticket type to.'),
		...ticketTypeWriteShape,
	})
	.superRefine(checkTicketTypeLimits);

export type TicketTypesCreateInput = z.input<
	typeof TicketTypesCreateInputSchema
>;

/**
 * The path id and the body are separate fields even though both name the ticket
 * type. A shared name would make it impossible to change one without the other.
 */
const TicketTypesUpdateInputSchema = z
	.object({
		eventid: EventIdSchema.describe('The event the ticket type belongs to.'),
		ticket_type_id: z
			.number()
			.int()
			.positive()
			.describe('The ticket type to update.'),
		...ticketTypeWriteShape,
	})
	.superRefine(checkTicketTypeLimits);

export type TicketTypesUpdateInput = z.input<
	typeof TicketTypesUpdateInputSchema
>;

const TicketTypeResponseSchema = z
	.object({
		ticket_type_id: z.number().nullish(),
		ticket_type_name: z.string().nullish(),
		quantity_total: z.number().nullish(),
		ticket_type_description: z.string().nullish(),
		sales_start_date: z.string().nullish(),
		sales_start_time: z.string().nullish(),
		sales_end_date: z.string().nullish(),
		sales_end_time: z.string().nullish(),
		additional_instructions: z.string().nullish(),
		unlock_code: z.string().nullish(),
		boxoffice_only: FlexibleBooleanSchema.nullish(),
		is_visible: FlexibleBooleanSchema.nullish(),
		limit_minimum: z.number().nullish(),
		limit_maximum: z.number().nullish(),
	})
	.loose();

export type TicketTypeResponse = z.infer<typeof TicketTypeResponseSchema>;

// ── Categories ────────────────────────────────────────────────────────────

const CategoriesListInputSchema = z.object({});

export type CategoriesListInput = z.input<typeof CategoriesListInputSchema>;

export const CategorySchema = z
	.object({ category: z.string().nullish() })
	.loose();

const CategoriesListResponseSchema = z
	.object({ categories: z.array(CategorySchema) })
	.loose();

export type CategoriesListResponse = z.infer<
	typeof CategoriesListResponseSchema
>;

// ── Users ─────────────────────────────────────────────────────────────────

export const UserSchema = z
	.object({
		id: z.number().nullish(),
		username: z.string().nullish(),
		first_name: z.string().nullish(),
		last_name: z.string().nullish(),
		company: z.string().nullish(),
		address_line1: z.string().nullish(),
		address_line2: z.string().nullish(),
		address_locality: z.string().nullish(),
		address_region: z.string().nullish(),
		address_country: z.string().nullish(),
		zip_code: z.string().nullish(),
		email: z.string().nullish(),
		timezone: z.string().nullish(),
		website: z.string().nullish(),
		phone_primary: z.string().nullish(),
		avatar_url: z.string().nullish(),
		facebook_id: z.string().nullish(),
		twitter_id: z.string().nullish(),
		last_seen: z.string().nullish(),
		user_type: z.string().nullish(),
	})
	.loose();

export type EventzillaUser = z.infer<typeof UserSchema>;

const UsersListInputSchema = z.object({
	offset: OffsetSchema,
	limit: LimitSchema,
});

export type UsersListInput = z.input<typeof UsersListInputSchema>;

const UsersListResponseSchema = z
	.object({
		pagination: PaginationSchema.nullish(),
		users: z.array(UserSchema),
		next_offset: z.number().nullable(),
		// Present only when the API answered the empty-list message.
		message: z.string().optional(),
	})
	.loose();

export type UsersListResponse = z.infer<typeof UsersListResponseSchema>;

const UsersGetInputSchema = z.object({
	userid: z.number().int().positive().describe('The organizer to read.'),
});

export type UsersGetInput = z.input<typeof UsersGetInputSchema>;

/**
 * **`user`, singular**, and an array: verified against the live API, where
 * `GET /users/{id}` answers `{"user":[{…}]}` while the list answers
 * `{"users":[…]}`. The reference documents both under one schema, which is why
 * this is easy to get wrong.
 */
const UsersGetResponseSchema = z
	.object({
		user: z.array(UserSchema),
	})
	.loose();

export type UsersGetResponse = z.infer<typeof UsersGetResponseSchema>;

// ── Transactions ──────────────────────────────────────────────────────────

const TransactionsGetInputSchema = z.object({
	identifier: z
		.string()
		.min(1)
		.describe(
			'A checkout id (`2138868785`) or an order reference (`20260520145-178028`). Both go in the same path segment.',
		),
});

export type TransactionsGetInput = z.input<typeof TransactionsGetInputSchema>;

const TransactionsGetResponseSchema = z
	.object({ transaction: z.array(TransactionSchema) })
	.loose();

export type TransactionsGetResponse = z.infer<
	typeof TransactionsGetResponseSchema
>;

// ── Checkout ──────────────────────────────────────────────────────────────

const CheckoutPrepareInputSchema = z.object({
	eventid: EventIdSchema.describe('The event being registered for.'),
	dateid: z
		.number()
		.int()
		.positive()
		.describe("The event's `dateid`, not its `id`."),
});

export type CheckoutPrepareInput = z.input<typeof CheckoutPrepareInputSchema>;

const PaymentOptionSchema = z
	.object({
		payment_id: z.number().nullish(),
		paymentoption_name: z.string().nullish(),
	})
	.loose();

const CheckoutTicketTypeSchema = z
	.object({
		ticket_type_id: z.number().nullish(),
		ticket_type_name: z.string().nullish(),
		ticket_type_price: FlexibleNumberSchema.nullish(),
		ticket_type_min_limit: z.number().nullish(),
		ticket_type_max_limit: z.number().nullish(),
		ticket_type_avail_quantity: z.number().nullish(),
		ticket_type_onsale: z.boolean().nullish(),
		ticket_type_description: z.string().nullish(),
	})
	.loose();

export const SubquestionRuleSchema = z
	.object({
		question_id: z.number().nullish(),
		mapped_choice: z.array(z.string()).nullish(),
	})
	.loose();

const CheckoutQuestionSchema = z
	.object({
		question_id: z.number().nullish(),
		question_type: z.string().nullish(),
		question_text: z.string().nullish(),
		question_choices: z.array(z.string()).nullish(),
		question_choice: z.array(z.string()).nullish(),
		question_waiver: z.string().nullish(),
		has_subquestion: z.boolean().nullish(),
		subquestion_rules: z.array(SubquestionRuleSchema).nullish(),
	})
	.loose();

const TaxSchema = z
	.object({
		tax_type: z.string().nullish(),
		tax_name: z.string().nullish(),
		tax_value: z.string().nullish(),
	})
	.loose();

const CheckoutPrepareResponseSchema = z
	.object({
		payment_options: z.array(PaymentOptionSchema),
		tickettypes: z.array(CheckoutTicketTypeSchema),
		questions: z.array(CheckoutQuestionSchema),
		discount_enabled: z.boolean().nullish(),
		tax_enabled: z.boolean().nullish(),
		tax: z.array(TaxSchema).nullish(),
	})
	.loose();

export type CheckoutPrepareResponse = z.infer<
	typeof CheckoutPrepareResponseSchema
>;

const CheckoutTicketRequestSchema = z.object({
	ticket_type_id: z.number().int().positive(),
	quantity: z.number().int().min(1),
});

const CheckoutCreateInputSchema = z.object({
	eventid: EventIdSchema,
	eventdateid: z.number().int().positive().describe("The event's `dateid`."),
	ticket_types: z
		.array(CheckoutTicketRequestSchema)
		.min(1)
		.describe('Ticket types and how many of each to reserve.'),
	discount_code: z.string().optional().describe('A discount code, if any.'),
});

export type CheckoutCreateInput = z.input<typeof CheckoutCreateInputSchema>;

const CheckoutCreatedTicketSchema = z
	.object({
		ticket_price_id: z.number().nullish(),
		ticket_type_id: z.number().nullish(),
		ticket_type_name: z.string().nullish(),
	})
	.loose();

const CheckoutCreateResponseSchema = z
	.object({
		checkout_id: z.number().nullish(),
		transaction_ref: z.string().nullish(),
		transaction_total: z.number().nullish(),
		transaction_tax: z.number().nullish(),
		transaction_discount: z.number().nullish(),
		transaction_status: z.string().nullish(),
		eventzilla_fee: z.number().nullish(),
		currency: z.string().nullish(),
		tickets: z.array(CheckoutCreatedTicketSchema).nullish(),
	})
	.loose();

export type CheckoutCreateResponse = z.infer<
	typeof CheckoutCreateResponseSchema
>;

const BuyerDetailsSchema = z.object({
	buyer_firstname: z.string().min(1),
	buyer_lastname: z.string().min(1),
	buyer_email: z.string().min(1),
});

const TicketAnswerSchema = z.object({
	question_id: z.number().int().positive(),
	answer_text: z.string(),
});

const CheckoutFillTicketSchema = z.object({
	ticket_price_id: z
		.number()
		.int()
		.positive()
		.describe('A `ticket_price_id` from checkout.create.'),
	first_name: z.string().min(1),
	last_name: z.string().min(1),
	email: z.string().min(1),
	answers: z.array(TicketAnswerSchema).optional(),
});

const CheckoutFillOrderInputSchema = z
	.object({
		eventid: EventIdSchema,
		eventdateid: z.number().int().positive(),
		checkout_id: z
			.number()
			.int()
			.positive()
			.describe('The `checkout_id` checkout.create returned.'),
		buyerdetails: z.array(BuyerDetailsSchema).min(1),
		tickets: z
			.array(CheckoutFillTicketSchema)
			.min(1)
			.describe(
				'One entry per ticket bought, in the order they were reserved.',
			),
		payment_id: z
			.number()
			.int()
			.positive()
			.describe('A `payment_id` from checkout.prepare.'),
	})
	.superRefine((value, ctx) => {
		// Checkout reserves one `ticket_price_id` per ticket and the fill pairs
		// them positionally; the reference says nothing about a duplicate, so it
		// is caught here rather than silently filling the same seat twice.
		const uniquePrices = new Set(
			value.tickets.map((ticket) => ticket.ticket_price_id),
		);
		if (uniquePrices.size !== value.tickets.length) {
			ctx.addIssue({
				code: 'custom',
				path: ['tickets'],
				message:
					'Two entries share a `ticket_price_id`. Checkout reserves one id per ticket, so each must appear once.',
			});
		}
	});

export type CheckoutFillOrderInput = z.input<
	typeof CheckoutFillOrderInputSchema
>;

const CheckoutConfirmInputSchema = z.object({
	eventid: EventIdSchema,
	eventdateid: z.number().int().positive(),
	checkout_id: z.number().int().positive(),
	payment_status: z
		.string()
		.min(1)
		.describe(
			'The payment result to record, such as `success`. Eventzilla documents no enum here.',
		),
	comments: z.string().optional().describe('Notes recorded on the order.'),
	sendemail: z
		.boolean()
		.optional()
		.describe('Whether to email the buyer. The API defaults this to true.'),
});

export type CheckoutConfirmInput = z.input<typeof CheckoutConfirmInputSchema>;

const CheckoutConfirmResponseSchema = z
	.object({
		checkout_id: z.number().nullish(),
		transaction_ref: z.string().nullish(),
		transaction_total: z.number().nullish(),
		transaction_tax: z.number().nullish(),
		transaction_discount: z.number().nullish(),
		eventzilla_fee: z.number().nullish(),
		transaction_status: z.string().nullish(),
		confirmation_email_sent: z.boolean().nullish(),
		currency: z.string().nullish(),
	})
	.loose();

export type CheckoutConfirmResponse = z.infer<
	typeof CheckoutConfirmResponseSchema
>;

// ── Attendees and check-in ────────────────────────────────────────────────

const AttendeesGetInputSchema = z.object({
	attendeeid: z.number().int().positive().describe('The attendee to read.'),
});

export type AttendeesGetInput = z.input<typeof AttendeesGetInputSchema>;

const AttendeesGetResponseSchema = z
	.object({
		attendees: z.array(AttendeeWithFlagSchema),
		// Present only when the API answered the empty-list message.
		message: z.string().optional(),
	})
	.loose();

export type AttendeesGetResponse = z.infer<typeof AttendeesGetResponseSchema>;

/**
 * `eventcheckin` takes a boolean **or** a string. Sending the boolean is
 * correct; a `"false"` string would be truthy to a naive backend and check the
 * attendee in when reverting was intended, so only the boolean is offered.
 */
const AttendeesCheckinInputSchema = z.object({
	barcode: z
		.string()
		.min(1)
		.describe('The `bar_code` from the attendee or ticket record.'),
	eventcheckin: z
		.boolean()
		.describe('true to check in, false to revert a check-in.'),
});

export type AttendeesCheckinInput = z.input<typeof AttendeesCheckinInputSchema>;

/**
 * Wrapped in `checkinstatus`, whose fields are **snake-free and lowercased**
 * (`firstname`, not `first_name`) and can be `null`. Verified live:
 * `{"checkinstatus":{"firstname":null,"lastname":null,"eventtitle":null,`
 * `"orderref":null,"email":null,"status":null}}` for an unknown barcode. The
 * reference documents the flat shape, which is why this is easy to get wrong.
 */
const CheckInStatusSchema = z
	.object({
		firstname: z.string().nullish(),
		lastname: z.string().nullish(),
		eventtitle: z.string().nullish(),
		orderref: z.string().nullish(),
		email: z.string().nullish(),
		status: z.string().nullish(),
	})
	.loose();

const AttendeesCheckinResponseSchema = z
	.object({
		checkinstatus: CheckInStatusSchema,
		checkedIn: z
			.boolean()
			.nullable()
			.describe(
				'True only when `checkinstatus.status` confirms a check-in this call asked for. False when the status reports a failure, an "already" state or a revert; null when the status text does not say. A revert (`eventcheckin: false`) therefore never answers true: read `checkinstatus.status` for its outcome. Eventzilla answers HTTP 200 even for a failed check-in, so read this rather than the status code.',
			),
	})
	.loose();

export type AttendeesCheckinResponse = z.infer<
	typeof AttendeesCheckinResponseSchema
>;

/**
 * A check-in that failed still answers HTTP 200 with a `checkinstatus` whose
 * `status` is not a check-in (`"Already Reverted checked in"` was observed, and
 * every field `null` for an unknown barcode). The response is not an error at
 * the transport level, so `checkedIn` states plainly whether a check-in is
 * believed to have taken effect — null when the answer does not say.
 *
 * It is true only for a confirmed check-in. A revert answers false or null and
 * never true, because the status vocabulary for a successful revert is not
 * documented and was not observed; the output schema says so, so a caller
 * reverting a check-in reads `checkinstatus.status` instead.
 */
export function checkinSucceeded(
	status: string | null | undefined,
	eventcheckin: boolean,
): boolean | null {
	if (status === null || status === undefined || status === '') return null;
	// The API does not document its status vocabulary; "Checkin" was observed
	// for a real check-in. Anything mentioning an error or a revert is not this
	// call succeeding.
	if (/error|fail|invalid|not found|already/i.test(status)) return false;
	if (/checkin|checked in/i.test(status)) return eventcheckin;
	return null;
}

// ── Orders ────────────────────────────────────────────────────────────────

const OrdersCancelInputSchema = z.object({
	checkout_id: z.number().int().positive(),
	eventid: EventIdSchema,
	comments: z
		.string()
		.describe('Why the order was cancelled. Required by the API.'),
});

export type OrdersCancelInput = z.input<typeof OrdersCancelInputSchema>;

const OrdersCancelResponseSchema = z
	.object({
		ordercancel: z.string().nullish(),
		orderconfirm: z.string().nullish(),
	})
	.loose();

export type OrdersCancelResponse = z.infer<typeof OrdersCancelResponseSchema>;

const OrdersConfirmInputSchema = z.object({
	checkout_id: z.number().int().positive(),
	eventid: EventIdSchema,
	comments: z.string().describe('Organizer notes on the confirmation.'),
	sendemail: z
		.boolean()
		.optional()
		.describe('Whether to email the buyer. The API defaults this to true.'),
});

export type OrdersConfirmInput = z.input<typeof OrdersConfirmInputSchema>;

const OrdersConfirmResponseSchema = z
	.object({ orderconfirm: z.string().nullish() })
	.loose();

export type OrdersConfirmResponse = z.infer<typeof OrdersConfirmResponseSchema>;

// ── Sales ─────────────────────────────────────────────────────────────────

const SalesToggleInputSchema = z.object({
	eventid: EventIdSchema,
	status: z.boolean().describe('true to open sales, false to close them.'),
});

export type SalesToggleInput = z.input<typeof SalesToggleInputSchema>;

const SalesToggleResponseSchema = z
	.object({ eventstatus: z.string().nullish() })
	.loose();

export type SalesToggleResponse = z.infer<typeof SalesToggleResponseSchema>;

// ── Registry ──────────────────────────────────────────────────────────────

export type EventzillaEndpointInputs = {
	eventsList: EventsListInput;
	eventsGet: EventsGetInput;
	eventsTransactions: EventsTransactionsInput;
	eventsAttendees: EventsAttendeesInput;
	ticketsList: TicketsListInput;
	ticketsCreate: TicketTypesCreateInput;
	ticketsUpdate: TicketTypesUpdateInput;
	categoriesList: CategoriesListInput;
	usersList: UsersListInput;
	usersGet: UsersGetInput;
	transactionsGet: TransactionsGetInput;
	checkoutPrepare: CheckoutPrepareInput;
	checkoutCreate: CheckoutCreateInput;
	checkoutFillOrder: CheckoutFillOrderInput;
	checkoutConfirm: CheckoutConfirmInput;
	attendeesGet: AttendeesGetInput;
	attendeesCheckin: AttendeesCheckinInput;
	ordersCancel: OrdersCancelInput;
	ordersConfirm: OrdersConfirmInput;
	salesToggle: SalesToggleInput;
};

export type EventzillaEndpointOutputs = {
	eventsList: EventsListResponse;
	eventsGet: EventsGetResponse;
	eventsTransactions: EventsTransactionsResponse;
	eventsAttendees: EventsAttendeesResponse;
	ticketsList: TicketsListResponse;
	ticketsCreate: TicketTypeResponse;
	ticketsUpdate: TicketTypeResponse;
	categoriesList: CategoriesListResponse;
	usersList: UsersListResponse;
	usersGet: UsersGetResponse;
	transactionsGet: TransactionsGetResponse;
	checkoutPrepare: CheckoutPrepareResponse;
	checkoutCreate: CheckoutCreateResponse;
	checkoutFillOrder: CheckoutCreateResponse;
	checkoutConfirm: CheckoutConfirmResponse;
	attendeesGet: AttendeesGetResponse;
	attendeesCheckin: AttendeesCheckinResponse;
	ordersCancel: OrdersCancelResponse;
	ordersConfirm: OrdersConfirmResponse;
	salesToggle: SalesToggleResponse;
};

export const EventzillaEndpointInputSchemas = {
	eventsList: EventsListInputSchema,
	eventsGet: EventsGetInputSchema,
	eventsTransactions: EventsTransactionsInputSchema,
	eventsAttendees: EventsAttendeesInputSchema,
	ticketsList: TicketsListInputSchema,
	ticketsCreate: TicketTypesCreateInputSchema,
	ticketsUpdate: TicketTypesUpdateInputSchema,
	categoriesList: CategoriesListInputSchema,
	usersList: UsersListInputSchema,
	usersGet: UsersGetInputSchema,
	transactionsGet: TransactionsGetInputSchema,
	checkoutPrepare: CheckoutPrepareInputSchema,
	checkoutCreate: CheckoutCreateInputSchema,
	checkoutFillOrder: CheckoutFillOrderInputSchema,
	checkoutConfirm: CheckoutConfirmInputSchema,
	attendeesGet: AttendeesGetInputSchema,
	attendeesCheckin: AttendeesCheckinInputSchema,
	ordersCancel: OrdersCancelInputSchema,
	ordersConfirm: OrdersConfirmInputSchema,
	salesToggle: SalesToggleInputSchema,
} as const;

export const EventzillaEndpointOutputSchemas = {
	eventsList: EventsListResponseSchema,
	eventsGet: EventsGetResponseSchema,
	eventsTransactions: EventsTransactionsResponseSchema,
	eventsAttendees: EventsAttendeesResponseSchema,
	ticketsList: TicketsListResponseSchema,
	ticketsCreate: TicketTypeResponseSchema,
	ticketsUpdate: TicketTypeResponseSchema,
	categoriesList: CategoriesListResponseSchema,
	usersList: UsersListResponseSchema,
	usersGet: UsersGetResponseSchema,
	transactionsGet: TransactionsGetResponseSchema,
	checkoutPrepare: CheckoutPrepareResponseSchema,
	checkoutCreate: CheckoutCreateResponseSchema,
	checkoutFillOrder: CheckoutCreateResponseSchema,
	checkoutConfirm: CheckoutConfirmResponseSchema,
	attendeesGet: AttendeesGetResponseSchema,
	attendeesCheckin: AttendeesCheckinResponseSchema,
	ordersCancel: OrdersCancelResponseSchema,
	ordersConfirm: OrdersConfirmResponseSchema,
	salesToggle: SalesToggleResponseSchema,
} as const;
