import { z } from 'zod';

// Inputs keep Eventbrite's own snake_case names so a caller can copy a value
// straight from the API reference. Outputs type the fields callers use and
// pass everything else through (`.loose()`), with every field nullish:
// Eventbrite returns `null` for unset fields and omits some entirely, and a
// read that already happened must not fail its own parse.
//
// Reference: https://www.eventbrite.com/platform/new/api (the API Blueprint at
// /platform/new/docs/eventbrite-api-v3-public.apib is the machine-readable
// source these shapes were taken from).

// ── Shared primitives ─────────────────────────────────────────────────────

/**
 * A composite id like `1234567890`. Eventbrite types every id as a string in
 * responses but accepts numbers in paths, and the docs' own samples use bare
 * integers, so both are accepted on input and always echoed as strings.
 */
const Id = z.union([z.string().min(1), z.number().int().positive()]);

/** ISO 8601 timestamp such as `2026-05-25T11:46:51Z`. */
const IsoDate = z.string().min(1);

/**
 * Eventbrite's paging parameters. `page_size` is 50 when omitted; the server
 * caps it at 300 (a larger value is silently answered with 300), and 0 or a
 * negative value is a 500, so the schema rejects those before sending.
 */
const PagingShape = {
	page_size: z
		.number()
		.int()
		.min(1)
		.max(300)
		.optional()
		.describe(
			'Results per page. Eventbrite defaults to 50 and caps the value at 300.',
		),
	continuation: z
		.string()
		.min(1)
		.optional()
		.describe(
			'Cursor from the previous response’s `pagination.continuation`. Pass it instead of `page` to walk the list.',
		),
	page: z
		.number()
		.int()
		.min(1)
		.optional()
		.describe(
			'Page number, starting at 1. Ignored when `continuation` is set.',
		),
};

const PaginationSchema = z
	.object({
		object_count: z.number().nullish(),
		page_number: z.number().nullish(),
		page_size: z.number().nullish(),
		page_count: z.number().nullish(),
		has_more_items: z.boolean().nullish(),
		continuation: z.string().nullish(),
	})
	.loose();

/** `{ text, html }`, used for names, descriptions and question labels. */
const MultipartTextSchema = z
	.object({
		text: z.string().nullish(),
		html: z.string().nullish(),
	})
	.loose();

const HtmlTextSchema = z
	.object({
		html: z.string().nullish(),
	})
	.loose();

/**
 * `start`/`end` on an event: `utc` is the instant and `local` the event's own
 * wall clock. Responses carry all three; requests accept `utc` + `timezone`
 * and Eventbrite fills `local` in.
 */
const DateTimeTzSchema = z
	.object({
		timezone: z.string().nullish(),
		utc: z.string().nullish(),
		local: z.string().nullish(),
	})
	.loose();

/** Request-side `datetime-tz-utc`: a timezone plus the UTC instant. */
const DateTimeTzUtcInputSchema = z.object({
	timezone: z
		.string()
		.min(1)
		.describe('Olson timezone, e.g. `America/New_York`.'),
	utc: z
		.string()
		.min(1)
		.describe('UTC instant in ISO 8601 form, e.g. `2027-06-01T14:00:00Z`.'),
});

const CurrencyCostSchema = z
	.object({
		currency: z.string().nullish(),
		/** Minor units: 432 is 4.32 USD. */
		value: z.number().nullish(),
		major_value: z.string().nullish(),
		display: z.string().nullish(),
	})
	.loose();

const AddressSchema = z
	.object({
		address_1: z.string().nullish(),
		address_2: z.string().nullish(),
		city: z.string().nullish(),
		region: z.string().nullish(),
		postal_code: z.string().nullish(),
		country: z.string().nullish(),
		latitude: z.string().nullish(),
		longitude: z.string().nullish(),
		localized_address_display: z.string().nullish(),
		localized_area_display: z.string().nullish(),
		localized_multi_line_address_display: z.array(z.string()).nullish(),
	})
	.loose();

/** Request-side address; `country` is a 2-letter ISO 3166-1 code. */
const AddressInputSchema = z.object({
	address_1: z.string().optional().describe('Street address, part 1.'),
	address_2: z.string().optional().describe('Street address, part 2.'),
	city: z.string().optional(),
	region: z
		.string()
		.optional()
		.describe('ISO 3166-2 state, province or region code.'),
	postal_code: z.string().optional(),
	country: z
		.string()
		.length(2)
		.optional()
		.describe('ISO 3166-1 two-letter country code.'),
	latitude: z.string().optional(),
	longitude: z.string().optional(),
});

const CategorySchema = z
	.object({
		id: z.string().nullish(),
		resource_uri: z.string().nullish(),
		name: z.string().nullish(),
		name_localized: z.string().nullish(),
		short_name: z.string().nullish(),
		short_name_localized: z.string().nullish(),
	})
	.loose();

const SubcategorySchema = z
	.object({
		id: z.string().nullish(),
		resource_uri: z.string().nullish(),
		name: z.string().nullish(),
		name_localized: z.string().nullish(),
		parent_category: CategorySchema.nullish(),
	})
	.loose();

const FormatSchema = z
	.object({
		id: z.string().nullish(),
		resource_uri: z.string().nullish(),
		name: z.string().nullish(),
		name_localized: z.string().nullish(),
		short_name: z.string().nullish(),
		short_name_localized: z.string().nullish(),
	})
	.loose();

const OrganizerSchema = z
	.object({
		id: z.string().nullish(),
		resource_uri: z.string().nullish(),
		name: z.string().nullish(),
		description: MultipartTextSchema.nullish(),
		long_description: MultipartTextSchema.nullish(),
		url: z.string().nullish(),
		vanity_url: z.string().nullish(),
		website: z.string().nullish(),
		twitter: z.string().nullish(),
		facebook: z.string().nullish(),
		organization_id: z.string().nullish(),
		num_past_events: z.number().nullish(),
		num_future_events: z.number().nullish(),
		logo_id: z.string().nullish(),
		disable_marketing_opt_in: z.boolean().nullish(),
		follow_status: z
			.object({
				followed_by_you: z.boolean().nullish(),
				followed_at: z.string().nullish(),
				num_followers: z.number().nullish(),
			})
			.loose()
			.nullish(),
	})
	.loose();

const VenueSchema = z
	.object({
		id: z.string().nullish(),
		resource_uri: z.string().nullish(),
		name: z.string().nullish(),
		age_restriction: z.string().nullish(),
		capacity: z.number().nullish(),
		latitude: z.string().nullish(),
		longitude: z.string().nullish(),
		address: AddressSchema.nullish(),
	})
	.loose();

const TicketAvailabilitySchema = z
	.object({
		has_available_tickets: z.boolean().nullish(),
		is_sold_out: z.boolean().nullish(),
		waitlist_available: z.boolean().nullish(),
		minimum_ticket_price: CurrencyCostSchema.nullish(),
		maximum_ticket_price: CurrencyCostSchema.nullish(),
		start_sales_date: DateTimeTzSchema.nullish(),
	})
	.loose();

const LogoImageSchema = z
	.object({
		id: z.string().nullish(),
		url: z.string().nullish(),
		aspect_ratio: z.string().nullish(),
		edge_color: z.string().nullish(),
		edge_color_set: z.boolean().nullish(),
		original: z
			.object({
				url: z.string().nullish(),
				width: z.number().nullish(),
				height: z.number().nullish(),
			})
			.loose()
			.nullish(),
	})
	.loose();

// ── events ────────────────────────────────────────────────────────────────

export const EVENTBRITE_EVENT_STATUSES = [
	'draft',
	'live',
	'started',
	'ended',
	'completed',
	'canceled',
] as const;

export const EVENTBRITE_EVENT_STATUS_FILTERS = [
	...EVENTBRITE_EVENT_STATUSES,
	'all',
] as const;

const EventStatusFilterSchema = z
	.array(z.enum(EVENTBRITE_EVENT_STATUS_FILTERS))
	.min(1)
	.describe(
		'Only events in these statuses, sent as one comma-separated value. `all` includes every status.',
	);

const EventOrderBySchema = z.enum([
	'start_asc',
	'start_desc',
	'created_asc',
	'created_desc',
	'name_asc',
	'name_desc',
]);

export const EventSchema = z
	.object({
		id: z.string().nullish(),
		resource_uri: z.string().nullish(),
		name: MultipartTextSchema.nullish(),
		summary: z.string().nullish(),
		description: MultipartTextSchema.nullish(),
		url: z.string().nullish(),
		vanity_url: z.string().nullish(),
		start: DateTimeTzSchema.nullish(),
		end: DateTimeTzSchema.nullish(),
		created: IsoDate.nullish(),
		changed: IsoDate.nullish(),
		published: z.string().nullish(),
		/** `draft`, `live`, `started`, `ended`, `completed` or `canceled`. */
		status: z.string().nullish(),
		currency: z.string().nullish(),
		online_event: z.boolean().nullish(),
		organization_id: z.string().nullish(),
		organizer_id: z.string().nullish(),
		venue_id: z.string().nullish(),
		format_id: z.string().nullish(),
		category_id: z.string().nullish(),
		subcategory_id: z.string().nullish(),
		logo_id: z.string().nullish(),
		logo: LogoImageSchema.nullish(),
		organizer: OrganizerSchema.nullish(),
		venue: VenueSchema.nullish(),
		format: FormatSchema.nullish(),
		category: CategorySchema.nullish(),
		subcategory: SubcategorySchema.nullish(),
		ticket_availability: TicketAvailabilitySchema.nullish(),
		listed: z.boolean().nullish(),
		shareable: z.boolean().nullish(),
		invite_only: z.boolean().nullish(),
		show_remaining: z.boolean().nullish(),
		password: z.string().nullish(),
		capacity: z.number().nullish(),
		capacity_is_custom: z.boolean().nullish(),
		tx_time_limit: z.number().nullish(),
		hide_start_date: z.boolean().nullish(),
		hide_end_date: z.boolean().nullish(),
		locale: z.string().nullish(),
		is_locked: z.boolean().nullish(),
		privacy_setting: z.string().nullish(),
		is_series: z.boolean().nullish(),
		is_series_parent: z.boolean().nullish(),
		series_id: z.string().nullish(),
		is_reserved_seating: z.boolean().nullish(),
		show_pick_a_seat: z.boolean().nullish(),
		show_seatmap_thumbnail: z.boolean().nullish(),
		show_colors_in_seatmap_thumbnail: z.boolean().nullish(),
		is_free: z.boolean().nullish(),
		is_externally_ticketed: z.boolean().nullish(),
		inventory_type: z.string().nullish(),
		source: z.string().nullish(),
		version: z.string().nullish(),
		facebook_event_id: z.string().nullish(),
	})
	.loose();

export type EventbriteEvent = z.infer<typeof EventSchema>;

/**
 * Every event read takes the same `expand` list. Eventbrite's event expansions
 * are `logo`, `venue`, `organizer`, `format`, `category`, `subcategory`,
 * `ticket_availability`, `bookmark_info`, `refund_policy` and
 * `has_digital_content`.
 */
const EventExpandSchema = z
	.array(
		z.enum([
			'logo',
			'venue',
			'organizer',
			'format',
			'category',
			'subcategory',
			'ticket_availability',
			'bookmark_info',
			'refund_policy',
			'has_digital_content',
		]),
	)
	.min(1)
	.optional()
	.describe(
		'Related objects to inline, sent as one comma-separated `expand` value. Each one slows the request slightly.',
	);

// ── events.get ────────────────────────────────────────────────────────────

const EventsGetInputSchema = z.object({
	event_id: Id.describe('The event to read.'),
	expand: EventExpandSchema,
});

export type EventsGetInput = z.input<typeof EventsGetInputSchema>;

const EventsGetResponseSchema = EventSchema;

export type EventsGetResponse = z.infer<typeof EventsGetResponseSchema>;

// ── events.listByOrganization ─────────────────────────────────────────────

const EventsListByOrganizationInputSchema = z.object({
	organization_id: Id.describe('The organization whose events to list.'),
	status: EventStatusFilterSchema.optional(),
	name_filter: z
		.string()
		.optional()
		.describe('Only events whose name matches.'),
	currency_filter: z
		.string()
		.length(3)
		.optional()
		.describe('Only events in this ISO 4217 currency.'),
	order_by: EventOrderBySchema.optional(),
	time_filter: z
		.enum(['all', 'past', 'current_future'])
		.optional()
		.describe(
			'Restrict to past or to current and future events. Defaults to `all`.',
		),
	series_filter: z
		.array(
			z.enum(['allevents', 'children', 'parents', 'nonseries', 'allseries']),
		)
		.min(1)
		.optional()
		.describe(
			'Filter on series membership; takes precedence over `show_series_parent`.',
		),
	show_series_parent: z
		.boolean()
		.optional()
		.describe(
			'True lists the series parent instead of its occurrences. Defaults to false.',
		),
	venue_filter: z
		.array(Id)
		.min(1)
		.optional()
		.describe('Only events at these venue IDs.'),
	organizer_filter: z
		.array(Id)
		.min(1)
		.optional()
		.describe('Only events by these organizer IDs.'),
	inventory_type_filter: z
		.array(z.enum(['limited', 'reserved', 'externally_ticketed']))
		.min(1)
		.optional()
		.describe('Only events with this inventory type.'),
	event_ids: z.array(Id).min(1).optional().describe('Only these event IDs.'),
	event_ids_to_exclude: z
		.array(Id)
		.min(1)
		.optional()
		.describe('Exclude these event IDs.'),
	event_group_id: z.string().optional(),
	collection_id: z.string().optional(),
	collection_ids_to_exclude: z
		.array(Id)
		.min(1)
		.optional()
		.describe(
			'Collections to exclude; wins over `event_group_id` and `collection_id`.',
		),
	...PagingShape,
});

export type EventsListByOrganizationInput = z.input<
	typeof EventsListByOrganizationInputSchema
>;

const EventsListResponseSchema = z
	.object({
		pagination: PaginationSchema.nullish(),
		events: z.array(EventSchema),
	})
	.loose();

export type EventsListResponse = z.infer<typeof EventsListResponseSchema>;

// ── events.listByVenue ────────────────────────────────────────────────────

const EventsListByVenueInputSchema = z.object({
	venue_id: Id.describe('The venue whose events to list.'),
	status: EventStatusFilterSchema.optional(),
	order_by: z
		.enum(['start_asc', 'start_desc', 'created_asc', 'created_desc'])
		.optional(),
	only_public: z
		.boolean()
		.optional()
		.describe('True lists only publicly listed events.'),
	'start_date.range_start': z
		.string()
		.optional()
		.describe(
			'Only events starting at or after this instant, e.g. `2027-01-01T00:00:00Z`.',
		),
	'start_date.range_end': z
		.string()
		.optional()
		.describe('Only events starting at or before this instant.'),
	...PagingShape,
});

export type EventsListByVenueInput = z.input<
	typeof EventsListByVenueInputSchema
>;

// ── events.listBySeries ───────────────────────────────────────────────────

const EventsListBySeriesInputSchema = z.object({
	event_series_id: Id.describe(
		'The series parent’s event ID (`series_id` on an occurrence, or the ID returned with `is_series: true`).',
	),
	time_filter: z.enum(['all', 'past', 'current_future']).optional(),
	order_by: z
		.enum(['start_asc', 'start_desc', 'created_asc', 'created_desc'])
		.optional(),
	'start_date.range_start': z.string().optional(),
	'start_date.range_end': z.string().optional(),
	...PagingShape,
});

export type EventsListBySeriesInput = z.input<
	typeof EventsListBySeriesInputSchema
>;

// ── events.create ─────────────────────────────────────────────────────────

const EventCreateFieldsSchema = z.object({
	name: z
		.object({ html: z.string().min(1) })
		.describe(
			'Event name. Eventbrite requires the `html` wrapper, not a bare string.',
		),
	start: DateTimeTzUtcInputSchema,
	end: DateTimeTzUtcInputSchema,
	currency: z
		.string()
		.length(3)
		.describe(
			'ISO 4217 currency code; it cannot be changed once tickets are sold.',
		),
	summary: z
		.string()
		.max(140)
		.optional()
		.describe(
			'Plain-text summary, at most 140 characters. Mutually exclusive with `description`.',
		),
	description: z
		.object({ html: z.string() })
		.optional()
		.describe(
			'Deprecated rich description. Mutually exclusive with `summary`.',
		),
	organizer_id: Id.optional().describe(
		'Defaults to the organization’s organizer.',
	),
	venue_id: Id.optional().describe(
		'Cannot be combined with `online_event: true`.',
	),
	online_event: z
		.boolean()
		.optional()
		.describe(
			'True for an online-only event. Cannot be combined with `venue_id`.',
		),
	format_id: Id.optional(),
	category_id: Id.optional(),
	subcategory_id: Id.optional().describe('US listings only.'),
	logo_id: Id.optional(),
	listed: z
		.boolean()
		.optional()
		.describe(
			'Publicly searchable on Eventbrite. Defaults to true; mutually exclusive with `invite_only`.',
		),
	shareable: z.boolean().optional(),
	invite_only: z
		.boolean()
		.optional()
		.describe('Mutually exclusive with `listed` and with `shareable: true`.'),
	show_remaining: z.boolean().optional(),
	password: z
		.string()
		.optional()
		.describe(
			'Password for an unlisted event. Mutually exclusive with `listed`.',
		),
	capacity: z
		.number()
		.int()
		.positive()
		.optional()
		.describe('Custom capacity. Omit to sum the ticket classes’ capacity.'),
	hide_start_date: z.boolean().optional(),
	hide_end_date: z.boolean().optional(),
	is_series: z
		.boolean()
		.optional()
		.describe(
			'True creates a series parent; occurrences come from `schedules.create`.',
		),
	source: z.string().optional().describe('Free-form source label.'),
	locale: z
		.string()
		.optional()
		.describe('Language of the listing page. Defaults to `en_US`.'),
});

/**
 * Rejections Eventbrite raises as a 400 ARGUMENTS_ERROR. Failing here saves a
 * request and names the field that conflicts. The fields live in their own
 * object schema because Zod 4 cannot call `.partial()` on a refined schema,
 * and the update route needs every field optional.
 */
const EventCreateBodySchema = EventCreateFieldsSchema.superRefine(
	(value, ctx) => {
		if (value.summary !== undefined && value.description !== undefined) {
			ctx.addIssue({
				code: 'custom',
				path: ['description'],
				message:
					'`summary` and `description` are mutually exclusive; send one of them.',
			});
		}
		if (value.online_event === true && value.venue_id !== undefined) {
			ctx.addIssue({
				code: 'custom',
				path: ['venue_id'],
				message: 'An event is either online or at a venue, not both.',
			});
		}
		if (value.invite_only === true && value.listed === true) {
			ctx.addIssue({
				code: 'custom',
				path: ['listed'],
				message: '`listed` and `invite_only` are mutually exclusive.',
			});
		}
		if (value.invite_only === true && value.shareable === true) {
			ctx.addIssue({
				code: 'custom',
				path: ['shareable'],
				message: '`shareable` and `invite_only` are mutually exclusive.',
			});
		}
		if (value.password !== undefined && value.listed === true) {
			ctx.addIssue({
				code: 'custom',
				path: ['password'],
				message: '`password` and `listed` are mutually exclusive.',
			});
		}
		if (value.start.utc !== undefined && value.end.utc !== undefined) {
			const start = Date.parse(value.start.utc);
			const end = Date.parse(value.end.utc);
			if (Number.isFinite(start) && Number.isFinite(end) && end <= start) {
				ctx.addIssue({
					code: 'custom',
					path: ['end', 'utc'],
					message: 'The end must be after the start.',
				});
			}
		}
	},
);

const EventsCreateInputSchema = z.object({
	organization_id: Id.describe('The organization that will own the event.'),
	event: EventCreateBodySchema,
});

export type EventsCreateInput = z.input<typeof EventsCreateInputSchema>;

// ── events.update ─────────────────────────────────────────────────────────

const EventUpdateBodySchema = EventCreateFieldsSchema.partial();

const EventsUpdateInputSchema = z
	.object({
		event_id: Id.describe('The event to change.'),
		event: EventUpdateBodySchema,
	})
	.superRefine((value, ctx) => {
		if (Object.keys(value.event).length === 0) {
			ctx.addIssue({
				code: 'custom',
				path: ['event'],
				message: 'Send at least one field to change.',
			});
		}
	});

export type EventsUpdateInput = z.input<typeof EventsUpdateInputSchema>;

// ── events.publish / unpublish / cancel / delete ──────────────────────────

const EventIdInputSchema = z.object({
	event_id: Id.describe('The event to act on.'),
});

export type EventIdInput = z.input<typeof EventIdInputSchema>;

const EventPublishResponseSchema = z
	.object({ published: z.literal(true) })
	.loose();

export type EventsPublishResponse = z.infer<typeof EventPublishResponseSchema>;

const EventUnpublishResponseSchema = z
	.object({ unpublished: z.literal(true) })
	.loose();

export type EventsUnpublishResponse = z.infer<
	typeof EventUnpublishResponseSchema
>;

const EventCancelResponseSchema = z
	.object({ canceled: z.literal(true) })
	.loose();

export type EventsCancelResponse = z.infer<typeof EventCancelResponseSchema>;

const EventDeleteResponseSchema = z
	.object({ deleted: z.literal(true) })
	.loose();

export type EventsDeleteResponse = z.infer<typeof EventDeleteResponseSchema>;

// ── events.copy ───────────────────────────────────────────────────────────

const EventsCopyInputSchema = z.object({
	event_id: Id.describe('The event to duplicate.'),
	name: z.string().min(1).optional().describe('Name for the copy.'),
	start_date: z
		.string()
		.optional()
		.describe('Start of the copy, e.g. `2027-06-01T14:00:00Z`.'),
	end_date: z.string().optional().describe('End of the copy.'),
	timezone: z
		.string()
		.optional()
		.describe('Olson timezone for the copy, e.g. `America/New_York`.'),
	summary: z.string().optional(),
});

export type EventsCopyInput = z.input<typeof EventsCopyInputSchema>;

// ── events.description ────────────────────────────────────────────────────

const EventsDescriptionInputSchema = EventIdInputSchema;

export type EventsDescriptionInput = z.input<
	typeof EventsDescriptionInputSchema
>;

/** The full rendered HTML description, which the event object no longer holds. */
const EventsDescriptionResponseSchema = z
	.object({ description: z.string().nullish() })
	.loose();

export type EventsDescriptionResponse = z.infer<
	typeof EventsDescriptionResponseSchema
>;

// ── events.displaySettings / updateDisplaySettings ────────────────────────

const DisplaySettingsSchema = z
	.object({
		resource_uri: z.string().nullish(),
		show_start_date: z.boolean().nullish(),
		show_end_date: z.boolean().nullish(),
		show_start_end_time: z.boolean().nullish(),
		show_timezone: z.boolean().nullish(),
		show_map: z.boolean().nullish(),
		show_remaining: z.boolean().nullish(),
		show_organizer_facebook: z.boolean().nullish(),
		show_organizer_twitter: z.boolean().nullish(),
		show_facebook_friends_going: z.boolean().nullish(),
		terminology: z.string().nullish(),
	})
	.loose();

export type EventbriteDisplaySettings = z.infer<typeof DisplaySettingsSchema>;

const UpdateDisplaySettingsBodySchema = DisplaySettingsSchema.omit({
	resource_uri: true,
	terminology: true,
}).extend({
	terminology: z
		.enum(['tickets_vertical', 'endurance_vertical'])
		.optional()
		.describe('Wording used on the listing page.'),
});

const EventsUpdateDisplaySettingsInputSchema = z.object({
	event_id: Id.describe('The event whose listing settings to change.'),
	display_settings: UpdateDisplaySettingsBodySchema,
});

export type EventsUpdateDisplaySettingsInput = z.input<
	typeof EventsUpdateDisplaySettingsInputSchema
>;

// ── events.ticketClasses / ticketClass / createTicketClass /
//    updateTicketClass / deleteTicketClass ────────────────────────────────

const DeliveryMethodSchema = z.enum([
	'electronic',
	'will_call',
	'standard_shipping',
	'third_party_shipping',
]);

export const TicketClassSchema = z
	.object({
		id: z.string().nullish(),
		resource_uri: z.string().nullish(),
		event_id: z.string().nullish(),
		name: z.string().nullish(),
		display_name: z.string().nullish(),
		description: z.string().nullish(),
		sorting: z.number().nullish(),
		capacity: z.number().nullish(),
		quantity_total: z.number().nullish(),
		quantity_sold: z.number().nullish(),
		donation: z.boolean().nullish(),
		free: z.boolean().nullish(),
		include_fee: z.boolean().nullish(),
		hide_description: z.boolean().nullish(),
		hidden: z.boolean().nullish(),
		hidden_currently: z.boolean().nullish(),
		on_sale_status: z
			.string()
			.nullish()
			.describe(
				'One of `AVAILABLE`, `NOT_YET_ON_SALE`, `SOLD_OUT`, `HIDDEN`, `UNAVAILABLE` or `UNKNOWN`.',
			),
		sales_start: z.string().nullish(),
		sales_end: z.string().nullish(),
		sales_channels: z.array(z.string()).nullish(),
		delivery_methods: z.array(z.string()).nullish(),
		minimum_quantity: z.number().nullish(),
		maximum_quantity: z.number().nullish(),
		maximum_quantity_per_order: z.number().nullish(),
		has_pdf_ticket: z.boolean().nullish(),
		order_confirmation_message: z.string().nullish(),
		category: z.string().nullish(),
		image_id: z.string().nullish(),
		inventory_tier_id: z.string().nullish(),
		cost: z
			.object({
				actual_cost: CurrencyCostSchema.nullish(),
				actual_fee: CurrencyCostSchema.nullish(),
				cost: CurrencyCostSchema.nullish(),
				fee: CurrencyCostSchema.nullish(),
				tax: CurrencyCostSchema.nullish(),
			})
			.loose()
			.nullish(),
	})
	.loose();

export type EventbriteTicketClass = z.infer<typeof TicketClassSchema>;

const TicketClassesListInputSchema = z.object({
	event_id: Id.describe('The event whose ticket classes to list.'),
	pos: z
		.enum(['online', 'at_the_door'])
		.optional()
		.describe('Only classes valid for this point of sale.'),
	category: z
		.array(z.enum(['all', 'admission', 'add_on', 'donation']))
		.min(1)
		.optional()
		.describe('Only classes in these categories, comma separated.'),
	include_holds: z
		.boolean()
		.optional()
		.describe('Include hold ticket classes.'),
	...PagingShape,
});

export type TicketClassesListInput = z.input<
	typeof TicketClassesListInputSchema
>;

const TicketClassesListResponseSchema = z
	.object({
		pagination: PaginationSchema.nullish(),
		ticket_classes: z.array(TicketClassSchema),
	})
	.loose();

export type TicketClassesListResponse = z.infer<
	typeof TicketClassesListResponseSchema
>;

const TicketClassesListForSaleInputSchema = z.object({
	event_id: Id.describe('The event whose purchasable ticket classes to list.'),
	pos: z
		.enum(['online', 'at_the_door'])
		.optional()
		.describe('Point of sale. Defaults to `online`.'),
	code: z.string().optional().describe('Promo code the classes must accept.'),
	hold_id: z.string().optional(),
	...PagingShape,
});

export type TicketClassesListForSaleInput = z.input<
	typeof TicketClassesListForSaleInputSchema
>;

const TicketClassGetInputSchema = z.object({
	event_id: Id.describe('The event that owns the ticket class.'),
	ticket_class_id: Id.describe('The ticket class to read.'),
});

export type TicketClassGetInput = z.input<typeof TicketClassGetInputSchema>;

const TicketClassCostInputSchema = z
	.string()
	.regex(
		/^[A-Z]{3},\d+$/,
		'Cost is `<CURRENCY>,<minor units>`, e.g. `USD,4500` for 45.00 USD.',
	);

const TicketClassCreateFieldsSchema = z.object({
	name: z.string().min(1).describe('Name shown on the event page.'),
	cost: TicketClassCostInputSchema.optional().describe(
		'Price as `<CURRENCY>,<minor units>`, matching the event currency. Required unless `free` or `donation` is true.',
	),
	free: z
		.boolean()
		.optional()
		.describe('A free ticket cannot also have a cost.'),
	donation: z
		.boolean()
		.optional()
		.describe('A donation ticket cannot also have a cost or be free.'),
	capacity: z
		.number()
		.int()
		.positive()
		.optional()
		.describe(
			'Total tickets available. Required for a normal ticket class; for a donation 0 or null means unlimited.',
		),
	description: z.string().optional(),
	sorting: z
		.number()
		.int()
		.nonnegative()
		.optional()
		.describe('Display order; ascending. Defaults to 0.'),
	hide_description: z.boolean().optional(),
	hidden: z
		.boolean()
		.optional()
		.describe('Hide the ticket from the event page.'),
	include_fee: z.boolean().optional(),
	split_fee: z
		.boolean()
		.optional()
		.describe(
			'Absorb the payment fee but show the Eventbrite fee. Cannot be combined with `include_fee`.',
		),
	auto_hide: z
		.boolean()
		.optional()
		.describe(
			'Hide the ticket while it is not on sale. Eventbrite requires this to be set explicitly.',
		),
	auto_hide_before: z.string().optional(),
	auto_hide_after: z.string().optional(),
	sales_start: z
		.string()
		.optional()
		.describe('Omit for "when the event is published".'),
	sales_end: z
		.string()
		.optional()
		.describe('Omit for "one hour before the event starts".'),
	sales_start_after: Id.optional().describe(
		'Another ticket class that puts this one on sale when it sells out.',
	),
	sales_channels: z
		.array(z.enum(['online', 'atd']))
		.min(1)
		.optional()
		.describe('Where the ticket can be sold.'),
	minimum_quantity: z.number().int().positive().optional(),
	maximum_quantity: z.number().int().positive().optional(),
	has_pdf_ticket: z.boolean().optional(),
	order_confirmation_message: z.string().optional(),
	delivery_methods: z.array(DeliveryMethodSchema).min(1).optional(),
	inventory_tier_id: Id.optional().describe(
		'Required for a tiered-inventory event; create the tier first with `inventoryTiers.create`.',
	),
});

const TicketClassCreateBodySchema = TicketClassCreateFieldsSchema.superRefine(
	(value, ctx) => {
		if (value.cost !== undefined && value.free === true) {
			ctx.addIssue({
				code: 'custom',
				path: ['cost'],
				message: 'A ticket is either free or charged, not both.',
			});
		}
		if (value.donation === true && value.cost !== undefined) {
			ctx.addIssue({
				code: 'custom',
				path: ['cost'],
				message: 'A donation ticket has no cost.',
			});
		}
		if (value.donation === true && value.free === true) {
			ctx.addIssue({
				code: 'custom',
				path: ['free'],
				message: 'A donation ticket cannot be a free ticket.',
			});
		}
		if (
			value.donation !== true &&
			value.free !== true &&
			value.cost === undefined
		) {
			ctx.addIssue({
				code: 'custom',
				path: ['cost'],
				message:
					'A charged ticket needs `cost`; set `free: true` or `donation: true` for the other two kinds.',
			});
		}
		if (
			value.donation !== true &&
			value.inventory_tier_id === undefined &&
			value.capacity === undefined
		) {
			ctx.addIssue({
				code: 'custom',
				path: ['capacity'],
				message:
					'A non-donation ticket needs `capacity`, unless a tiered inventory limits it.',
			});
		}
		if (value.include_fee === true && value.split_fee === true) {
			ctx.addIssue({
				code: 'custom',
				path: ['split_fee'],
				message: '`include_fee` and `split_fee` cannot both be true.',
			});
		}
		if (
			value.sales_start !== undefined &&
			value.sales_end !== undefined &&
			Date.parse(value.sales_end) <= Date.parse(value.sales_start)
		) {
			ctx.addIssue({
				code: 'custom',
				path: ['sales_end'],
				message: 'Sales must end after they start.',
			});
		}
	},
);

const TicketClassCreateInputSchema = z.object({
	event_id: Id.describe('The event the ticket class belongs to.'),
	ticket_class: TicketClassCreateBodySchema,
});

export type TicketClassCreateInput = z.input<
	typeof TicketClassCreateInputSchema
>;

const TicketClassUpdateInputSchema = z.object({
	event_id: Id.describe('The event that owns the ticket class.'),
	ticket_class_id: Id.describe('The ticket class to change.'),
	ticket_class: TicketClassCreateFieldsSchema.partial(),
});

export type TicketClassUpdateInput = z.input<
	typeof TicketClassUpdateInputSchema
>;

const TicketClassDeleteInputSchema = TicketClassGetInputSchema;

export type TicketClassDeleteInput = z.input<
	typeof TicketClassDeleteInputSchema
>;

const TicketClassDeleteResponseSchema = z
	.object({ deleted: z.boolean().nullish() })
	.loose();

export type TicketClassDeleteResponse = z.infer<
	typeof TicketClassDeleteResponseSchema
>;

// ── events.questions / question / createQuestion / deleteQuestion ────────

const QuestionTextSchema = z
	.object({ text: z.string().nullish(), html: z.string().nullish() })
	.loose();

export const EVENTBRITE_QUESTION_TYPES = [
	'checkbox',
	'dropdown',
	'text',
	'paragraph',
	'radio',
	'waiver',
] as const;

const QuestionSchema = z
	.object({
		id: z.string().nullish(),
		resource_uri: z.string().nullish(),
		question: QuestionTextSchema.nullish(),
		type: z.string().nullish(),
		required: z.boolean().nullish(),
		display_answer_on_order: z.boolean().nullish(),
		respondent: z.string().nullish(),
		waiver: z.string().nullish(),
		sorting: z.number().nullish(),
		parent_id: z.string().nullish(),
		parent_choice_id: z.string().nullish(),
		include: z.boolean().nullish(),
		choices: z
			.array(
				z
					.object({
						id: z.string().nullish(),
						answer: QuestionTextSchema.nullish(),
					})
					.loose(),
			)
			.nullish(),
		ticket_classes: z
			.array(
				z
					.object({ id: z.string().nullish(), name: z.string().nullish() })
					.loose(),
			)
			.nullish(),
	})
	.loose();

export type EventbriteQuestion = z.infer<typeof QuestionSchema>;

const QuestionsListInputSchema = z.object({
	event_id: Id.describe('The event whose custom questions to list.'),
	as_owner: z
		.boolean()
		.optional()
		.describe('Return private events and fields.'),
	...PagingShape,
});

export type QuestionsListInput = z.input<typeof QuestionsListInputSchema>;

const QuestionsListResponseSchema = z
	.object({
		pagination: PaginationSchema.nullish(),
		questions: z.array(QuestionSchema),
	})
	.loose();

export type QuestionsListResponse = z.infer<typeof QuestionsListResponseSchema>;

const QuestionGetInputSchema = z.object({
	event_id: Id.describe('The event that owns the question.'),
	question_id: Id.describe('The custom question to read.'),
});

export type QuestionGetInput = z.input<typeof QuestionGetInputSchema>;

const QuestionChoiceInputSchema = z.object({
	answer: z
		.object({ html: z.string().min(1) })
		.describe('The choice’s label; Eventbrite requires the `html` wrapper.'),
});

const QuestionCreateBodySchema = z
	.object({
		question: z
			.object({ html: z.string().min(1) })
			.describe('The question text; Eventbrite requires the `html` wrapper.'),
		type: z
			.enum(EVENTBRITE_QUESTION_TYPES)
			.describe(
				'Question type. `checkbox`, `dropdown` and `radio` need `choices`; `waiver` needs `waiver`.',
			),
		required: z.boolean().optional(),
		display_answer_on_order: z.boolean().optional(),
		respondent: z
			.enum(['ticket_buyer', 'attendee'])
			.optional()
			.describe('Who answers: the buyer once, or each attendee.'),
		waiver: z.string().optional().describe('Required when `type` is `waiver`.'),
		choices: z
			.array(QuestionChoiceInputSchema)
			.min(1)
			.optional()
			.describe('Required for the multiple-choice types.'),
		ticket_classes: z
			.array(z.object({ id: Id }))
			.min(1)
			.optional()
			.describe('Limit the question to these ticket classes.'),
		parent_id: Id.optional().describe('Parent question, for a subquestion.'),
		parent_choice_id: Id.optional(),
		sorting: z.number().int().nonnegative().optional(),
	})
	.superRefine((value, ctx) => {
		const multipleChoice =
			value.type === 'checkbox' ||
			value.type === 'dropdown' ||
			value.type === 'radio';
		if (multipleChoice && value.choices === undefined) {
			ctx.addIssue({
				code: 'custom',
				path: ['choices'],
				message: `A \`${value.type}\` question needs at least one choice.`,
			});
		}
		if (value.type === 'waiver' && value.waiver === undefined) {
			ctx.addIssue({
				code: 'custom',
				path: ['waiver'],
				message: 'A `waiver` question needs the waiver text.',
			});
		}
	});

const QuestionCreateInputSchema = z.object({
	event_id: Id.describe('The event the question belongs to.'),
	question: QuestionCreateBodySchema,
});

export type QuestionCreateInput = z.input<typeof QuestionCreateInputSchema>;

const QuestionDeleteInputSchema = QuestionGetInputSchema;

export type QuestionDeleteInput = z.input<typeof QuestionDeleteInputSchema>;

const QuestionDeleteResponseSchema = z
	.object({ deleted: z.boolean().nullish() })
	.loose();

export type QuestionDeleteResponse = z.infer<
	typeof QuestionDeleteResponseSchema
>;

// ── events.cannedQuestions ────────────────────────────────────────────────

const CannedQuestionsListInputSchema = z.object({
	event_id: Id.describe('The event whose default questions to list.'),
	include_all: z
		.boolean()
		.optional()
		.describe('Return every default question, included or not.'),
});

export type CannedQuestionsListInput = z.input<
	typeof CannedQuestionsListInputSchema
>;

const CannedQuestionsListResponseSchema = z
	.object({
		pagination: PaginationSchema.nullish(),
		questions: z.array(QuestionSchema),
	})
	.loose();

export type CannedQuestionsListResponse = z.infer<
	typeof CannedQuestionsListResponseSchema
>;

// ── attendees ─────────────────────────────────────────────────────────────

const AttendeeSchema = z
	.object({
		id: z.string().nullish(),
		resource_uri: z.string().nullish(),
		event_id: z.string().nullish(),
		order_id: z.string().nullish(),
		ticket_class_id: z.string().nullish(),
		ticket_class_name: z.string().nullish(),
		variant_id: z.string().nullish(),
		quantity: z.number().nullish(),
		created: IsoDate.nullish(),
		changed: IsoDate.nullish(),
		checked_in: z.boolean().nullish(),
		cancelled: z.boolean().nullish(),
		refunded: z.boolean().nullish(),
		status: z.string().nullish(),
		delivery_method: z.string().nullish(),
		guestlist_id: z.string().nullish(),
		invited_by: z.string().nullish(),
		affiliate: z.string().nullish(),
		profile: z
			.object({
				name: z.string().nullish(),
				email: z.string().nullish(),
				first_name: z.string().nullish(),
				last_name: z.string().nullish(),
				prefix: z.string().nullish(),
				suffix: z.string().nullish(),
				age: z.number().nullish(),
				job_title: z.string().nullish(),
				company: z.string().nullish(),
				website: z.string().nullish(),
				blog: z.string().nullish(),
				gender: z.string().nullish(),
				birth_date: z.string().nullish(),
				cell_phone: z.string().nullish(),
				work_phone: z.string().nullish(),
			})
			.loose()
			.nullish(),
		barcodes: z
			.array(
				z
					.object({
						barcode: z.string().nullish(),
						status: z.string().nullish(),
						created: z.string().nullish(),
						changed: z.string().nullish(),
						checkin_type: z.number().nullish(),
						is_printed: z.boolean().nullish(),
					})
					.loose(),
			)
			.nullish(),
		costs: z
			.object({
				base_price: CurrencyCostSchema.nullish(),
				gross: CurrencyCostSchema.nullish(),
				eventbrite_fee: CurrencyCostSchema.nullish(),
				payment_fee: CurrencyCostSchema.nullish(),
				tax: CurrencyCostSchema.nullish(),
			})
			.loose()
			.nullish(),
		answers: z
			.array(
				z
					.object({
						question_id: z.string().nullish(),
						question: z.string().nullish(),
						type: z.string().nullish(),
						// A string for most question types, an `Address` object for an
						// address question, and a number for a number question.
						answer: z
							.union([z.string(), z.number(), z.boolean(), AddressSchema])
							.nullish(),
					})
					.loose(),
			)
			.nullish(),
	})
	.loose();

export type EventbriteAttendee = z.infer<typeof AttendeeSchema>;

const AttendeesListInputSchema = z.object({
	event_id: Id.describe('The event whose attendees to list.'),
	status: z
		.enum(['attending', 'not_attending', 'unpaid'])
		.optional()
		.describe('Attendee status filter.'),
	changed_since: z
		.string()
		.optional()
		.describe('Only attendees changed at or after this instant.'),
	last_item_seen: z
		.number()
		.int()
		.optional()
		.describe('With `changed_since`, only attendees with a later ID.'),
	attendee_ids: z
		.array(Id)
		.min(1)
		.optional()
		.describe('Only these attendee IDs.'),
	...PagingShape,
});

export type AttendeesListInput = z.input<typeof AttendeesListInputSchema>;

const AttendeesListResponseSchema = z
	.object({
		pagination: PaginationSchema.nullish(),
		attendees: z.array(AttendeeSchema),
	})
	.loose();

export type AttendeesListResponse = z.infer<typeof AttendeesListResponseSchema>;

const AttendeeGetInputSchema = z.object({
	event_id: Id.describe('The event that owns the attendee.'),
	attendee_id: Id.describe('The attendee to read.'),
});

export type AttendeeGetInput = z.input<typeof AttendeeGetInputSchema>;

// ── orders ────────────────────────────────────────────────────────────────

const OrderSchema = z
	.object({
		id: z.string().nullish(),
		resource_uri: z.string().nullish(),
		created: IsoDate.nullish(),
		changed: IsoDate.nullish(),
		name: z.string().nullish(),
		first_name: z.string().nullish(),
		last_name: z.string().nullish(),
		email: z.string().nullish(),
		event_id: z.string().nullish(),
		status: z
			.string()
			.nullish()
			.describe('`started`, `pending`, `placed` or `abandoned`.'),
		time_remaining: z.number().nullish(),
		costs: z
			.object({
				base_price: CurrencyCostSchema.nullish(),
				display_price: CurrencyCostSchema.nullish(),
				display_fee: CurrencyCostSchema.nullish(),
				gross: CurrencyCostSchema.nullish(),
				eventbrite_fee: CurrencyCostSchema.nullish(),
				payment_fee: CurrencyCostSchema.nullish(),
				tax: CurrencyCostSchema.nullish(),
				discount_amount: CurrencyCostSchema.nullish(),
			})
			.loose()
			.nullish(),
		attendees: z.array(AttendeeSchema).nullish(),
		event: EventSchema.nullish(),
	})
	.loose();

export type EventbriteOrder = z.infer<typeof OrderSchema>;

/** The order-status filter the three list routes share. */
const OrderStatusSchema = z
	.enum(['active', 'inactive', 'both', 'all_not_deleted'])
	.optional()
	.describe(
		'`active` is attending orders; `inactive` not attending; `both` every order; `all_not_deleted` excludes deleted ones.',
	);

const OrderGetInputSchema = z.object({
	order_id: Id.describe('The order to read.'),
});

export type OrderGetInput = z.input<typeof OrderGetInputSchema>;

const OrdersListByOrganizationInputSchema = z.object({
	organization_id: Id.describe('The organization whose orders to list.'),
	status: OrderStatusSchema,
	changed_since: z
		.string()
		.optional()
		.describe('Only orders changed at or after this instant.'),
	only_emails: z
		.array(z.string())
		.min(1)
		.optional()
		.describe('Only orders placed by these email addresses.'),
	exclude_emails: z
		.array(z.string())
		.min(1)
		.optional()
		.describe('Skip orders placed by these email addresses.'),
	...PagingShape,
});

export type OrdersListByOrganizationInput = z.input<
	typeof OrdersListByOrganizationInputSchema
>;

const OrdersListResponseSchema = z
	.object({
		pagination: PaginationSchema.nullish(),
		orders: z.array(OrderSchema),
	})
	.loose();

export type OrdersListResponse = z.infer<typeof OrdersListResponseSchema>;

const OrdersListByEventInputSchema = z.object({
	event_id: Id.describe('The event whose orders to list.'),
	status: OrderStatusSchema,
	changed_since: z.string().optional(),
	last_item_seen: z
		.string()
		.optional()
		.describe('With `changed_since`, only orders with a larger ID.'),
	only_emails: z.array(z.string()).min(1).optional(),
	exclude_emails: z.array(z.string()).min(1).optional(),
	refund_request_statuses: z
		.array(
			z.enum(['completed', 'pending', 'outside_policy', 'disputed', 'denied']),
		)
		.min(1)
		.optional()
		.describe('Only orders whose refund request is in one of these states.'),
	...PagingShape,
});

export type OrdersListByEventInput = z.input<
	typeof OrdersListByEventInputSchema
>;

const OrdersListByUserInputSchema = z.object({
	user_id: Id.describe('The user whose purchases to list. `me` is accepted.'),
	...PagingShape,
});

export type OrdersListByUserInput = z.input<typeof OrdersListByUserInputSchema>;

// ── users.me / users.get ──────────────────────────────────────────────────

const UserSchema = z
	.object({
		id: z.string().nullish(),
		name: z.string().nullish(),
		first_name: z.string().nullish(),
		last_name: z.string().nullish(),
		is_public: z.boolean().nullish(),
		image_id: z.string().nullish(),
		emails: z
			.array(
				z
					.object({
						email: z.string().nullish(),
						verified: z.boolean().nullish(),
						primary: z.boolean().nullish(),
					})
					.loose(),
			)
			.nullish(),
	})
	.loose();

export type EventbriteUser = z.infer<typeof UserSchema>;

const EmptyInputSchema = z.object({}).optional();

export type EmptyInput = z.input<typeof EmptyInputSchema>;

const UserGetInputSchema = z.object({
	user_id: Id.describe('The user to read. `me` is accepted.'),
});

export type UserGetInput = z.input<typeof UserGetInputSchema>;

// ── organizations ─────────────────────────────────────────────────────────

const OrganizationSchema = z
	.object({
		id: z.string().nullish(),
		name: z.string().nullish(),
		vertical: z.string().nullish(),
		image_id: z.string().nullish(),
	})
	.loose();

export type EventbriteOrganization = z.infer<typeof OrganizationSchema>;

const OrganizationsListInputSchema = z.object({
	user_id: Id.optional().describe(
		'Whose organizations to list. Defaults to the authenticated user (`me`).',
	),
	...PagingShape,
});

export type OrganizationsListInput = z.input<
	typeof OrganizationsListInputSchema
>;

const OrganizationsListResponseSchema = z
	.object({
		pagination: PaginationSchema.nullish(),
		organizations: z.array(OrganizationSchema),
	})
	.loose();

export type OrganizationsListResponse = z.infer<
	typeof OrganizationsListResponseSchema
>;

// ── venues ────────────────────────────────────────────────────────────────

const VenueGetInputSchema = z.object({
	venue_id: Id.describe('The venue to read.'),
});

export type VenueGetInput = z.input<typeof VenueGetInputSchema>;

const VenuesListInputSchema = z.object({
	organization_id: Id.describe('The organization whose venues to list.'),
	...PagingShape,
});

export type VenuesListInput = z.input<typeof VenuesListInputSchema>;

const VenuesListResponseSchema = z
	.object({
		pagination: PaginationSchema.nullish(),
		venues: z.array(VenueSchema),
	})
	.loose();

export type VenuesListResponse = z.infer<typeof VenuesListResponseSchema>;

const VenueCreateBodySchema = z.object({
	name: z.string().min(1).describe('Venue name.'),
	address: AddressInputSchema.optional(),
	age_restriction: z
		.enum([
			'AGE_RESTRICTION_ALL_AGES',
			'AGE_RESTRICTION_MIN_TWELVE',
			'AGE_RESTRICTION_MIN_THIRTEEN',
			'AGE_RESTRICTION_MIN_FOURTEEN',
			'AGE_RESTRICTION_MIN_FIFTEEN',
			'AGE_RESTRICTION_MIN_SIXTEEN',
			'AGE_RESTRICTION_MIN_SEVENTEEN',
			'AGE_RESTRICTION_MIN_EIGHTEEN',
			'AGE_RESTRICTION_MIN_NINETEEN',
			'AGE_RESTRICTION_MIN_TWENTY_ONE',
			'AGE_RESTRICTION_UNDER_TWENTY_ONE_WITH_GUARDIAN',
			'AGE_RESTRICTION_UNDER_EIGHTEEN_WITH_GUARDIAN',
		])
		.optional(),
	capacity: z.number().int().positive().optional(),
	organizer_id: Id.optional().describe(
		'The organizer the venue belongs to. Defaults to the organization’s default organizer.',
	),
	google_place_id: z.string().optional(),
});

const VenueCreateInputSchema = z.object({
	organization_id: Id.describe('The organization that will own the venue.'),
	venue: VenueCreateBodySchema,
});

export type VenueCreateInput = z.input<typeof VenueCreateInputSchema>;

const VenueUpdateInputSchema = z.object({
	venue_id: Id.describe('The venue to change.'),
	venue: VenueCreateBodySchema.partial(),
});

export type VenueUpdateInput = z.input<typeof VenueUpdateInputSchema>;

// ── discounts ─────────────────────────────────────────────────────────────

export const EVENTBRITE_DISCOUNT_TYPES = [
	'access',
	'coded',
	'hold',
	'public',
] as const;

const DiscountSchema = z
	.object({
		id: z.string().nullish(),
		code: z.string().nullish(),
		type: z.string().nullish(),
		amount_off: z.string().nullish(),
		percent_off: z.string().nullish(),
		event_id: z.string().nullish(),
		ticket_class_ids: z.array(z.string()).nullish(),
		quantity_available: z.number().nullish(),
		quantity_sold: z.number().nullish(),
		start_date: z.string().nullish(),
		end_date: z.string().nullish(),
		start_date_relative: z.number().nullish(),
		end_date_relative: z.number().nullish(),
		ticket_group_id: z.string().nullish(),
		hold_ids: z.array(z.string()).nullish(),
	})
	.loose();

export type EventbriteDiscount = z.infer<typeof DiscountSchema>;

const DiscountGetInputSchema = z.object({
	discount_id: Id.describe('The discount to read.'),
});

export type DiscountGetInput = z.input<typeof DiscountGetInputSchema>;

const DiscountCreateFieldsSchema = z.object({
	code: z.string().min(1).describe('The code attendees type at checkout.'),
	type: z
		.enum(EVENTBRITE_DISCOUNT_TYPES)
		.describe('`coded`, `access`, `public` or `hold`.'),
	amount_off: z
		.string()
		.regex(/^\d+(\.\d{1,2})?$/, 'A decimal amount, e.g. `10` or `10.50`.')
		.optional()
		.describe(
			'Fixed reduction. Eventbrite requires one of `amount_off` and `percent_off`.',
		),
	percent_off: z
		.string()
		.regex(/^\d+(\.\d{1,2})?$/, 'A percentage, e.g. `20`.')
		.optional()
		.describe('Percentage reduction.'),
	event_id: Id.optional().describe('Required for a single-event discount.'),
	ticket_class_ids: z.array(Id).min(1).optional(),
	quantity_available: z.number().int().positive().optional(),
	start_date: z
		.string()
		.optional()
		.describe('Local ISO 8601 date-time in the event’s timezone.'),
	end_date: z.string().optional(),
	start_date_relative: z
		.number()
		.int()
		.min(59)
		.optional()
		.describe(
			'Seconds before the event start; at least 60 and a multiple of 60.',
		),
	end_date_relative: z
		.number()
		.int()
		.min(59)
		.optional()
		.describe(
			'Seconds before the event start; at least 60 and a multiple of 60.',
		),
	ticket_group_id: Id.optional(),
	hold_ids: z.array(z.string()).min(1).optional(),
});

const DiscountCreateBodySchema = DiscountCreateFieldsSchema.superRefine(
	(value, ctx) => {
		if (value.amount_off === undefined && value.percent_off === undefined) {
			ctx.addIssue({
				code: 'custom',
				path: ['amount_off'],
				message:
					'Set `amount_off` or `percent_off`; Eventbrite rejects a discount with neither.',
			});
		}
		if (value.amount_off !== undefined && value.percent_off !== undefined) {
			ctx.addIssue({
				code: 'custom',
				path: ['percent_off'],
				message:
					'A discount is either a fixed amount or a percentage, not both.',
			});
		}
		if (
			value.start_date_relative !== undefined &&
			value.start_date_relative % 60 !== 0
		) {
			ctx.addIssue({
				code: 'custom',
				path: ['start_date_relative'],
				message: '`start_date_relative` must be a multiple of 60 seconds.',
			});
		}
		if (
			value.end_date_relative !== undefined &&
			value.end_date_relative % 60 !== 0
		) {
			ctx.addIssue({
				code: 'custom',
				path: ['end_date_relative'],
				message: '`end_date_relative` must be a multiple of 60 seconds.',
			});
		}
	},
);

const DiscountCreateInputSchema = z.object({
	organization_id: Id.describe('The organization the discount belongs to.'),
	discount: DiscountCreateBodySchema,
});

export type DiscountCreateInput = z.input<typeof DiscountCreateInputSchema>;

const DiscountUpdateInputSchema = z.object({
	discount_id: Id.describe('The discount to change.'),
	discount: DiscountCreateFieldsSchema.partial(),
});

export type DiscountUpdateInput = z.input<typeof DiscountUpdateInputSchema>;

const DiscountsListInputSchema = z
	.object({
		organization_id: Id.describe('The organization whose discounts to list.'),
		scope: z
			.enum(['event', 'multi_events', 'user'])
			.describe('Discount scope. Eventbrite requires it.'),
		event_id: Id.optional().describe(
			'Required when `scope` is `event`; rejected with `multi_events`.',
		),
		code_filter: z
			.string()
			.optional()
			.describe('Approximate code or name match.'),
		code: z.string().optional().describe('Exact code or name match.'),
		type: z.enum(EVENTBRITE_DISCOUNT_TYPES).optional(),
		ticket_group_id: Id.optional(),
		hold_ids: z.array(z.string()).min(1).optional(),
		order_by: z
			.enum([
				'code_asc',
				'code_desc',
				'discount_type_asc',
				'discount_type_desc',
				'start_asc',
				'start_desc',
			])
			.optional()
			.describe(
				'Sorting is only allowed together with exactly one of `code` and `code_filter`.',
			),
		...PagingShape,
	})
	.superRefine((value, ctx) => {
		if (value.scope === 'event' && value.event_id === undefined) {
			ctx.addIssue({
				code: 'custom',
				path: ['event_id'],
				message: "`scope: 'event'` requires `event_id`.",
			});
		}
		if (value.scope === 'multi_events' && value.event_id !== undefined) {
			ctx.addIssue({
				code: 'custom',
				path: ['event_id'],
				message: '`event_id` cannot be combined with `multi_events` scope.',
			});
		}
		if (value.code !== undefined && value.code_filter !== undefined) {
			ctx.addIssue({
				code: 'custom',
				path: ['code'],
				message: 'Pass `code` or `code_filter`, not both.',
			});
		}
		const hasCode = value.code !== undefined || value.code_filter !== undefined;
		if (value.order_by !== undefined && !hasCode) {
			ctx.addIssue({
				code: 'custom',
				path: ['order_by'],
				message:
					'Sorting needs exactly one of `code` and `code_filter`, since a code is the only sortable field.',
			});
		}
	});

export type DiscountsListInput = z.input<typeof DiscountsListInputSchema>;

const DiscountsListResponseSchema = z
	.object({ discounts: z.array(DiscountSchema) })
	.loose();

export type DiscountsListResponse = z.infer<typeof DiscountsListResponseSchema>;

const DiscountDeleteInputSchema = DiscountGetInputSchema;

export type DiscountDeleteInput = z.input<typeof DiscountDeleteInputSchema>;

/** This route answers with the deleted discount itself, not `{ deleted }`. */
const DiscountDeleteResponseSchema = z
	.object({
		deleted: z.boolean(),
		discount: DiscountSchema.nullish(),
	})
	.loose();

export type DiscountDeleteResponse = z.infer<
	typeof DiscountDeleteResponseSchema
>;

// ── webhooks ──────────────────────────────────────────────────────────────

export const EVENTBRITE_WEBHOOK_ACTIONS = [
	'attendee.checked_in',
	'attendee.checked_out',
	'attendee.updated',
	'event.created',
	'event.published',
	'event.updated',
	'event.unpublished',
	'order.placed',
	'order.refunded',
	'order.updated',
	'organizer.updated',
	'ticket_class.created',
	'ticket_class.deleted',
	'ticket_class.updated',
	'venue.updated',
] as const;

const WebhookSchema = z
	.object({
		id: z.string().nullish(),
		resource_uri: z.string().nullish(),
		endpoint_url: z.string().nullish(),
		actions: z.array(z.string()).nullish(),
		event_id: z.string().nullish(),
		user_id: z.string().nullish(),
		created: z.string().nullish(),
	})
	.loose();

export type EventbriteWebhook = z.infer<typeof WebhookSchema>;

const WebhooksListInputSchema = z.object({
	organization_id: Id.describe('The organization whose webhooks to list.'),
	...PagingShape,
});

export type WebhooksListInput = z.input<typeof WebhooksListInputSchema>;

const WebhooksListResponseSchema = z
	.object({
		pagination: PaginationSchema.nullish(),
		webhooks: z.array(WebhookSchema),
	})
	.loose();

export type WebhooksListResponse = z.infer<typeof WebhooksListResponseSchema>;

const WebhookCreateInputSchema = z.object({
	organization_id: Id.describe('The organization the webhook belongs to.'),
	endpoint_url: z
		.url()
		.describe(
			'HTTPS URL Eventbrite POSTs to. Use a private URL, not a public one.',
		),
	actions: z
		.array(z.enum(EVENTBRITE_WEBHOOK_ACTIONS))
		.min(1)
		.describe(
			'Actions that trigger the webhook. Eventbrite takes them as one comma-separated string.',
		),
	event_id: Id.optional().describe(
		'Only fire for this event. Omit for all events.',
	),
});

export type WebhookCreateInput = z.input<typeof WebhookCreateInputSchema>;

const WebhookDeleteInputSchema = z.object({
	webhook_id: Id.describe('The webhook to delete.'),
});

export type WebhookDeleteInput = z.input<typeof WebhookDeleteInputSchema>;

// ── Registry ──────────────────────────────────────────────────────────────

export const EventbriteEndpointInputSchemas = {
	eventsGet: EventsGetInputSchema,
	eventsListByOrganization: EventsListByOrganizationInputSchema,
	eventsListByVenue: EventsListByVenueInputSchema,
	eventsListBySeries: EventsListBySeriesInputSchema,
	eventsCreate: EventsCreateInputSchema,
	eventsUpdate: EventsUpdateInputSchema,
	eventsPublish: EventIdInputSchema,
	eventsUnpublish: EventIdInputSchema,
	eventsCancel: EventIdInputSchema,
	eventsDelete: EventIdInputSchema,
	eventsCopy: EventsCopyInputSchema,
	eventsDescription: EventsDescriptionInputSchema,
	eventsDisplaySettings: EventsDescriptionInputSchema,
	eventsUpdateDisplaySettings: EventsUpdateDisplaySettingsInputSchema,
	ticketClassesList: TicketClassesListInputSchema,
	ticketClassesListForSale: TicketClassesListForSaleInputSchema,
	ticketClassGet: TicketClassGetInputSchema,
	ticketClassCreate: TicketClassCreateInputSchema,
	ticketClassUpdate: TicketClassUpdateInputSchema,
	ticketClassDelete: TicketClassDeleteInputSchema,
	questionsList: QuestionsListInputSchema,
	questionGet: QuestionGetInputSchema,
	questionCreate: QuestionCreateInputSchema,
	questionDelete: QuestionDeleteInputSchema,
	cannedQuestionsList: CannedQuestionsListInputSchema,
	attendeesList: AttendeesListInputSchema,
	attendeeGet: AttendeeGetInputSchema,
	ordersGet: OrderGetInputSchema,
	ordersListByOrganization: OrdersListByOrganizationInputSchema,
	ordersListByEvent: OrdersListByEventInputSchema,
	ordersListByUser: OrdersListByUserInputSchema,
	usersMe: EmptyInputSchema,
	userGet: UserGetInputSchema,
	organizationsList: OrganizationsListInputSchema,
	venueGet: VenueGetInputSchema,
	venuesList: VenuesListInputSchema,
	venueCreate: VenueCreateInputSchema,
	venueUpdate: VenueUpdateInputSchema,
	discountGet: DiscountGetInputSchema,
	discountCreate: DiscountCreateInputSchema,
	discountUpdate: DiscountUpdateInputSchema,
	discountsList: DiscountsListInputSchema,
	discountDelete: DiscountDeleteInputSchema,
	webhooksList: WebhooksListInputSchema,
	webhookCreate: WebhookCreateInputSchema,
	webhookDelete: WebhookDeleteInputSchema,
} as const;

/** Bodyless 200s: the boolean the provider returns for a delete-type action. */
const DeletedResponseSchema = z
	.object({ deleted: z.boolean().nullish() })
	.loose();

export const EventbriteEndpointOutputSchemas = {
	eventsGet: EventsGetResponseSchema,
	eventsListByOrganization: EventsListResponseSchema,
	eventsListByVenue: EventsListResponseSchema,
	eventsListBySeries: EventsListResponseSchema,
	eventsCreate: EventsGetResponseSchema,
	eventsUpdate: EventsGetResponseSchema,
	eventsPublish: EventPublishResponseSchema,
	eventsUnpublish: EventUnpublishResponseSchema,
	eventsCancel: EventCancelResponseSchema,
	eventsDelete: EventDeleteResponseSchema,
	eventsCopy: EventsGetResponseSchema,
	eventsDescription: EventsDescriptionResponseSchema,
	eventsDisplaySettings: DisplaySettingsSchema,
	eventsUpdateDisplaySettings: DisplaySettingsSchema,
	ticketClassesList: TicketClassesListResponseSchema,
	ticketClassesListForSale: TicketClassesListResponseSchema,
	ticketClassGet: TicketClassSchema,
	ticketClassCreate: TicketClassSchema,
	ticketClassUpdate: TicketClassSchema,
	ticketClassDelete: TicketClassDeleteResponseSchema,
	questionsList: QuestionsListResponseSchema,
	questionGet: QuestionSchema,
	questionCreate: QuestionSchema,
	questionDelete: QuestionDeleteResponseSchema,
	cannedQuestionsList: CannedQuestionsListResponseSchema,
	attendeesList: AttendeesListResponseSchema,
	attendeeGet: AttendeeSchema,
	ordersGet: OrderSchema,
	ordersListByOrganization: OrdersListResponseSchema,
	ordersListByEvent: OrdersListResponseSchema,
	ordersListByUser: OrdersListResponseSchema,
	usersMe: UserSchema,
	userGet: UserSchema,
	organizationsList: OrganizationsListResponseSchema,
	venueGet: VenueSchema,
	venuesList: VenuesListResponseSchema,
	venueCreate: VenueSchema,
	venueUpdate: VenueSchema,
	discountGet: DiscountSchema,
	discountCreate: DiscountSchema,
	discountUpdate: DiscountSchema,
	discountsList: DiscountsListResponseSchema,
	discountDelete: DiscountDeleteResponseSchema,
	webhooksList: WebhooksListResponseSchema,
	webhookCreate: WebhookSchema,
	webhookDelete: DeletedResponseSchema,
} as const;

export type EventbriteEndpointInputs = {
	[K in keyof typeof EventbriteEndpointInputSchemas]: z.input<
		(typeof EventbriteEndpointInputSchemas)[K]
	>;
};

export type EventbriteEndpointOutputs = {
	[K in keyof typeof EventbriteEndpointOutputSchemas]: z.infer<
		(typeof EventbriteEndpointOutputSchemas)[K]
	>;
};

export type EventbriteOperation = keyof typeof EventbriteEndpointInputSchemas;

export type {
	CategorySchema,
	DateTimeTzUtcInputSchema,
	EventCreateBodySchema,
	EventUpdateBodySchema,
	PaginationSchema,
};
