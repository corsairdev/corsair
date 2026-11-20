import { z } from 'zod';

// Inputs use the API's own query names. Outputs are `.loose()` with the
// documented fields nullish, so a field the API adds or omits cannot fail a
// call that already happened.
//
// Every path, parameter, field and type below comes from the published Swagger
// file, https://www.hotspotsystem.com/apidocs/src/hss_v2_swagger.json, and the
// notes at https://www.hotspotsystem.com/apidocs/api/notes/index.html.

/**
 * The four query parameters every list shares:
 *
 * - `fields` is a comma separated list of property names.
 * - `sort` is a property name, with a leading `-` for descending.
 * - `limit` and `offset` page the result; the API returns the next offset in
 *   the `Link` response header.
 *
 * The Swagger declares all four as strings, so a number is accepted here and
 * sent as its decimal form rather than being refused.
 */
const ListQueryShape = {
	fields: z
		.array(z.string().min(1))
		.optional()
		.describe(
			'Response properties to return, such as `["id", "name"]`. Omitted returns every property.',
		),
	sort: z
		.string()
		.min(1)
		.optional()
		.describe(
			'A response property to sort by. Prefix it with `-` for descending order, such as `-registered_at`.',
		),
	limit: z
		.number()
		.int()
		.min(1)
		.optional()
		.describe('How many items to return per page.'),
	offset: z
		.number()
		.int()
		.min(0)
		.optional()
		.describe(
			'Zero-based index of the first item to return. Take the next value from `next_offset` on the previous page.',
		),
} as const;

/** Joins the array form of `fields` into the comma separated query value. */
export function fieldsQuery(fields: string[] | undefined): string | undefined {
	return fields && fields.length > 0 ? fields.join(',') : undefined;
}

/**
 * The paging envelope every list returns: an `items` array and a `metadata`
 * object whose `total_count` is the length of the full result.
 */
function pageSchema<Item extends z.ZodType>(item: Item) {
	return z
		.object({
			items: z.array(item),
			metadata: z
				.object({ total_count: z.number().nullish() })
				.loose()
				.nullish(),
		})
		.loose();
}

// ── shared resource schemas ────────────────────────────────────────────────

export const LocationSchema = z
	.object({
		id: z.string().nullish(),
		name: z.string().nullish(),
	})
	.loose();
export type HotspotSystemLocation = z.infer<typeof LocationSchema>;

/**
 * A Customer and a Subscriber have the same documented properties, with the
 * same descriptions, so one schema describes both.
 */
const PersonShape = {
	id: z.string().nullish(),
	user_name: z.string().nullish(),
	name: z.string().nullish(),
	email: z.string().nullish(),
	company_name: z.string().nullish(),
	address: z.string().nullish(),
	city: z.string().nullish(),
	state: z.string().nullish(),
	zip: z.string().nullish(),
	country_code: z.string().nullish(),
	phone: z.string().nullish(),
	social_network: z.string().nullish(),
	social_id: z.string().nullish(),
	social_username: z.string().nullish(),
	social_link: z.string().nullish(),
	social_gender: z.string().nullish(),
	social_age_range: z.string().nullish(),
	social_followers_count: z.string().nullish(),
	registered_at: z
		.string()
		.nullish()
		.describe('When the user was created, as `2016-01-15 08:00:00`.'),
} as const;

export const PersonSchema = z.object(PersonShape).loose();
export type HotspotSystemPerson = z.infer<typeof PersonSchema>;

export const VoucherSchema = z
	.object({
		serial: z.string().nullish().describe('Unique identifier of the voucher.'),
		voucher_code: z.string().nullish(),
		limit_tl: z
			.number()
			.nullish()
			.describe('Traffic limit in bytes. -1 when no location context is set.'),
		simultaneous_use: z.number().nullish(),
		limit_dl: z
			.number()
			.nullish()
			.describe('Download limit in bytes. -1 when no location context is set.'),
		limit_ul: z
			.number()
			.nullish()
			.describe('Upload limit in bytes. -1 when no location context is set.'),
		usage_exp: z
			.string()
			.nullish()
			.describe('Expiration time left from today.'),
		validity: z
			.number()
			.nullish()
			.describe('Minutes the voucher can be used for.'),
		price_enduser: z.number().nullish().describe('The price it was sold for.'),
		currency: z.string().nullish(),
	})
	.loose();
export type HotspotSystemVoucher = z.infer<typeof VoucherSchema>;

/**
 * A MAC transaction records a device that connected. Its fields are documented
 * only as `TODO` in the Swagger, so each is a union where the example shows a
 * different type from the schema, and nothing is required.
 */
export const MacTransactionSchema = z
	.object({
		id: z.number().nullish(),
		operator: z.string().nullish(),
		location_id: z.number().nullish(),
		user_name: z.string().nullish(),
		action_date_gmt: z.string().nullish(),
		package_id: z.string().nullish(),
		user_agent: z.string().nullish(),
		customer: z.string().nullish(),
		newsletter: z.number().nullish(),
		company_name: z.string().nullish(),
		email: z.string().nullish(),
		address: z.string().nullish(),
		city: z.string().nullish(),
		state: z.string().nullish(),
		zip: z.string().nullish(),
		country_code: z.string().nullish(),
		phone: z.string().nullish(),
		q1: z.string().nullish(),
		a1: z.string().nullish(),
		q2: z.string().nullish(),
		a2: z.string().nullish(),
		q3: z.string().nullish(),
		a3: z.string().nullish(),
		q4: z.string().nullish(),
		a4: z.string().nullish(),
		q5: z.string().nullish(),
		a5: z.string().nullish(),
	})
	.loose();
export type HotspotSystemMacTransaction = z.infer<typeof MacTransactionSchema>;

/** The fields a paid and a voucher transaction share. */
const PaymentShape = {
	id: z.number().nullish(),
	operator: z.string().nullish(),
	location_id: z.number().nullish(),
	user_name: z.string().nullish(),
	customer: z.string().nullish(),
	action_date_gmt: z.string().nullish(),
	amount: z.number().nullish(),
	currency: z.string().nullish(),
	user_agent: z.string().nullish(),
	newsletter: z.number().nullish(),
	company_name: z.string().nullish(),
	email: z.string().nullish(),
	address: z.string().nullish(),
	city: z.string().nullish(),
	state: z.string().nullish(),
	zip: z.string().nullish(),
	country_code: z.string().nullish(),
	phone: z.string().nullish(),
	language: z.string().nullish(),
} as const;

export const PaidTransactionSchema = z
	.object({
		...PaymentShape,
		// Spelled `smscountry` in both the schema and the published example, so
		// it is kept exactly as sent rather than normalised.
		smscountry: z.string().nullish(),
	})
	.loose();
export type HotspotSystemPaidTransaction = z.infer<
	typeof PaidTransactionSchema
>;

export const VoucherTransactionSchema = z
	.object({
		...PaymentShape,
		smscountry: z.string().nullish(),
	})
	.loose();
export type HotspotSystemVoucherTransaction = z.infer<
	typeof VoucherTransactionSchema
>;

export const SocialTransactionSchema = z
	.object({
		id: z.number().nullish(),
		operator: z.string().nullish(),
		location_id: z.number().nullish(),
		user_name: z.string().nullish(),
		action_date_gmt: z.string().nullish(),
		package_id: z.string().nullish(),
		user_agent: z.string().nullish(),
		customer: z.string().nullish(),
		newsletter: z.number().nullish(),
		company_name: z.string().nullish(),
		email: z.string().nullish(),
		address: z.string().nullish(),
		city: z.string().nullish(),
		state: z.string().nullish(),
		zip: z.string().nullish(),
		country_code: z.string().nullish(),
		phone: z.string().nullish(),
		social_id: z.string().nullish(),
		social_username: z.string().nullish(),
		social_link: z.string().nullish(),
		social_gender: z.string().nullish(),
		social_age_range: z.string().nullish(),
		social_followers_count: z.string().nullish(),
		social_network: z.string().nullish(),
	})
	.loose();
export type HotspotSystemSocialTransaction = z.infer<
	typeof SocialTransactionSchema
>;

// ── owner and health ───────────────────────────────────────────────────────

export const MeInputSchema = z.object({}).strict();
export type HotspotSystemMeInput = z.input<typeof MeInputSchema>;

/** A single object, not a page: `/me` is the one read that is not a list. */
const MeResponseSchema = z
	.object({
		userId: z.number().nullish(),
		operator: z.string().nullish(),
	})
	.loose();
export type HotspotSystemMeResponse = z.infer<typeof MeResponseSchema>;

export const PingInputSchema = z.object({}).strict();
export type HotspotSystemPingInput = z.input<typeof PingInputSchema>;

const PingResponseSchema = z.object({ ping: z.string().nullish() }).loose();
export type HotspotSystemPingResponse = z.infer<typeof PingResponseSchema>;

// ── locations ──────────────────────────────────────────────────────────────

export const LocationsListInputSchema = z
	.object({ ...ListQueryShape })
	.strict();
export type LocationsListInput = z.input<typeof LocationsListInputSchema>;

/**
 * The `options` variant is documented as `{ items: [{ id, name }] }` with no
 * `metadata`, so it gets its own schema rather than the page envelope.
 */
const LocationsOptionsResponseSchema = z
	.object({ items: z.array(LocationSchema) })
	.loose();
export type LocationsOptionsResponse = z.infer<
	typeof LocationsOptionsResponseSchema
>;

export const LocationsOptionsInputSchema = z.object({}).strict();
export type LocationsOptionsInput = z.input<typeof LocationsOptionsInputSchema>;

/** A paged read returns its next offset alongside the page. */
function pagedOutput<Item extends z.ZodType>(item: Item) {
	return pageSchema(item).extend({
		/** The `offset` of the next page, from the `Link` header. Absent on the last page. */
		next_offset: z.number().optional(),
	});
}

const LocationsPageSchema = pagedOutput(LocationSchema);
export type LocationsListResponse = z.infer<typeof LocationsPageSchema>;

// ── people and transactions, per owner and per location ─────────────────────

export const CustomersListInputSchema = z
	.object({ ...ListQueryShape })
	.strict();
export type CustomersListInput = z.input<typeof CustomersListInputSchema>;

export const SubscribersListInputSchema = z
	.object({ ...ListQueryShape })
	.strict();
export type SubscribersListInput = z.input<typeof SubscribersListInputSchema>;

export const VouchersListInputSchema = z.object({ ...ListQueryShape }).strict();
export type VouchersListInput = z.input<typeof VouchersListInputSchema>;

export const TransactionsListInputSchema = z
	.object({ ...ListQueryShape })
	.strict();
export type TransactionsListInput = z.input<typeof TransactionsListInputSchema>;

/** The per-location variants take the location in the path as well. */
const LocationScopedShape = {
	/**
	 * The Swagger declares `locationId` as a string, but every transaction
	 * record returns `location_id` as a number, so a caller usually has the
	 * number in hand. Both are accepted and the path is built from either.
	 */
	location_id: z
		.union([
			// `.` and `..` survive encodeURIComponent and the URL parser resolves
			// them, so `..` would turn a per-location read into the account-wide one.
			z
				.string()
				.min(1)
				.refine((value) => value !== '.' && value !== '..', {
					message: 'location_id cannot be `.` or `..`',
				}),
			z.number().int(),
		])
		.describe('The ID of a location, as `locations.list` returns it.'),
	...ListQueryShape,
} as const;

export const LocationCustomersListInputSchema = z
	.object({ ...LocationScopedShape })
	.strict();
export type LocationCustomersListInput = z.input<
	typeof LocationCustomersListInputSchema
>;

export const LocationSubscribersListInputSchema = z
	.object({ ...LocationScopedShape })
	.strict();
export type LocationSubscribersListInput = z.input<
	typeof LocationSubscribersListInputSchema
>;

export const LocationVouchersListInputSchema = z
	.object({ ...LocationScopedShape })
	.strict();
export type LocationVouchersListInput = z.input<
	typeof LocationVouchersListInputSchema
>;

export const LocationTransactionsListInputSchema = z
	.object({ ...LocationScopedShape })
	.strict();
export type LocationTransactionsListInput = z.input<
	typeof LocationTransactionsListInputSchema
>;

const PeoplePageSchema = pagedOutput(PersonSchema);
export type PeopleListResponse = z.infer<typeof PeoplePageSchema>;

const VouchersPageSchema = pagedOutput(VoucherSchema);
export type VouchersListResponse = z.infer<typeof VouchersPageSchema>;

const PaidTransactionsPageSchema = pagedOutput(PaidTransactionSchema);
export type PaidTransactionsListResponse = z.infer<
	typeof PaidTransactionsPageSchema
>;

const VoucherTransactionsPageSchema = pagedOutput(VoucherTransactionSchema);
export type VoucherTransactionsListResponse = z.infer<
	typeof VoucherTransactionsPageSchema
>;

const SocialTransactionsPageSchema = pagedOutput(SocialTransactionSchema);
export type SocialTransactionsListResponse = z.infer<
	typeof SocialTransactionsPageSchema
>;

const MacTransactionsPageSchema = pagedOutput(MacTransactionSchema);
export type MacTransactionsListResponse = z.infer<
	typeof MacTransactionsPageSchema
>;

// ── registry ───────────────────────────────────────────────────────────────

export const HotspotSystemEndpointInputSchemas = {
	'ping.check': PingInputSchema,
	'me.get': MeInputSchema,
	'locations.list': LocationsListInputSchema,
	'locations.options': LocationsOptionsInputSchema,
	'customers.list': CustomersListInputSchema,
	'subscribers.list': SubscribersListInputSchema,
	'vouchers.list': VouchersListInputSchema,
	'transactions.paid': TransactionsListInputSchema,
	'transactions.voucher': TransactionsListInputSchema,
	'transactions.social': TransactionsListInputSchema,
	'transactions.mac': TransactionsListInputSchema,
	'locations.customers': LocationCustomersListInputSchema,
	'locations.subscribers': LocationSubscribersListInputSchema,
	'locations.vouchers': LocationVouchersListInputSchema,
	'locations.paidTransactions': LocationTransactionsListInputSchema,
	'locations.voucherTransactions': LocationTransactionsListInputSchema,
	'locations.socialTransactions': LocationTransactionsListInputSchema,
	'locations.macTransactions': LocationTransactionsListInputSchema,
} as const;

export const HotspotSystemEndpointOutputSchemas = {
	'ping.check': PingResponseSchema,
	'me.get': MeResponseSchema,
	'locations.list': LocationsPageSchema,
	'locations.options': LocationsOptionsResponseSchema,
	'customers.list': PeoplePageSchema,
	'subscribers.list': PeoplePageSchema,
	'vouchers.list': VouchersPageSchema,
	'transactions.paid': PaidTransactionsPageSchema,
	'transactions.voucher': VoucherTransactionsPageSchema,
	'transactions.social': SocialTransactionsPageSchema,
	'transactions.mac': MacTransactionsPageSchema,
	'locations.customers': PeoplePageSchema,
	'locations.subscribers': PeoplePageSchema,
	'locations.vouchers': VouchersPageSchema,
	'locations.paidTransactions': PaidTransactionsPageSchema,
	'locations.voucherTransactions': VoucherTransactionsPageSchema,
	'locations.socialTransactions': SocialTransactionsPageSchema,
	'locations.macTransactions': MacTransactionsPageSchema,
} as const;

export type HotspotSystemEndpointInputs = {
	[K in keyof typeof HotspotSystemEndpointInputSchemas]: z.input<
		(typeof HotspotSystemEndpointInputSchemas)[K]
	>;
};

export type HotspotSystemEndpointOutputs = {
	[K in keyof typeof HotspotSystemEndpointOutputSchemas]: z.output<
		(typeof HotspotSystemEndpointOutputSchemas)[K]
	>;
};
