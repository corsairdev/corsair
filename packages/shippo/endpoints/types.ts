import { z } from 'zod';

// Inputs and outputs keep Shippo's own snake_case names so a caller can copy a
// value straight from the API reference. Outputs type the fields callers use
// and pass everything else through (`.loose()`, `.nullish()`): Shippo omits
// fields freely and a read that already happened must not fail its own parse.
//
// Source of truth: https://docs.goshippo.com/spec/shippoapi/public-api.yaml
// (OpenAPI 3.1, version 2018-02-08). Paths and field names come from it rather
// than from the prose docs, which disagree with it in two places noted below.

const Id = z.string().min(1);
const IsoDate = z.string().min(1);

/**
 * `page`/`results` paging. `results` is capped at 100 by the API, so the schema
 * rejects a larger value instead of letting Shippo clamp it silently.
 */
const PagingShape = {
	page: z
		.number()
		.int()
		.min(1)
		.optional()
		.describe('Page number, starting at 1. Defaults to 1.'),
	results: z
		.number()
		.int()
		.min(1)
		.max(100)
		.optional()
		.describe(
			'Results per page. Defaults to 25, except addresses which default to 5. Maximum 100.',
		),
};

/**
 * Every list answers `{ next, previous, results }`. `next` is a whole URL, not
 * a cursor, so it is exposed as sent; a caller reads its `page` value.
 */
const pagedResults = <T extends z.ZodTypeAny>(item: T) =>
	z
		.object({
			next: z.string().nullish().describe('URL of the next page, or null.'),
			previous: z.string().nullish(),
			results: z.array(item),
		})
		.loose();

/**
 * `SHIPPO-ACCOUNT-ID` makes a platform account act on behalf of a managed one.
 * It is not auth: the platform's own token still authenticates the call.
 */
const accountIdHeader = {
	shippo_account_id: Id.optional().describe(
		'Sent as `SHIPPO-ACCOUNT-ID`: the managed Shippo account to act on behalf of. Platform accounts only.',
	),
};

// Weights and dimensions are strings in the API, not numbers: the spec types
// them `string` and Shippo accepts up to four decimal places verbatim. Typing
// them as numbers would round-trip values differently than sent.
const WeightSchema = z
	.string()
	.min(1)
	.describe(
		'Weight as a decimal string, e.g. `1` or `0.5`. Up to four decimals.',
	);

const DimensionSchema = z
	.string()
	.min(1)
	.describe('Dimension as a decimal string, e.g. `5.5`.');

export const WEIGHT_UNITS = ['g', 'kg', 'lb', 'oz'] as const;
export const DISTANCE_UNITS = ['cm', 'in', 'ft', 'm', 'mm', 'yd'] as const;
export const LABEL_FILE_TYPES = [
	'PNG',
	'PNG_2.3x7.5',
	'PDF',
	'PDF_2.3x7.5',
	'PDF_4x6',
	'PDF_4x8',
	'PDF_A4',
	'PDF_A5',
	'PDF_A6',
	'ZPLII',
] as const;

const WeightUnitSchema = z.enum(WEIGHT_UNITS).describe('Unit of the weight.');
const DistanceUnitSchema = z
	.enum(DISTANCE_UNITS)
	.describe('Unit of length, width and height.');

export const ResponseMessageSchema = z
	.object({
		source: z.string().nullish().describe('Origin, e.g. `UPS`.'),
		code: z
			.string()
			.nullish()
			.describe('Classification, e.g. `carrier_timeout`.'),
		text: z.string().nullish().describe('Human-readable message.'),
	})
	.loose();

export type ShippoResponseMessage = z.infer<typeof ResponseMessageSchema>;

/**
 * Address validation is not a boolean: `is_valid` says whether the address can
 * be used, and `messages` carries the corrections Shippo applied or the parts
 * it could not match.
 */
const AddressValidationResultsSchema = z
	.object({
		is_valid: z.boolean().nullish(),
		messages: z
			.array(
				z
					.object({
						source: z.string().nullish(),
						code: z.string().nullish(),
						text: z.string().nullish(),
						type: z
							.string()
							.nullish()
							.describe('`address_warning` or `address_error`.'),
					})
					.loose(),
			)
			.nullish(),
	})
	.loose();

export type ShippoAddressValidation = z.infer<
	typeof AddressValidationResultsSchema
>;

// ── addresses ─────────────────────────────────────────────────────────────

export const AddressSchema = z
	.object({
		object_id: z.string().nullish(),
		object_owner: z.string().nullish(),
		object_created: IsoDate.nullish(),
		object_updated: IsoDate.nullish(),
		name: z.string().nullish(),
		company: z.string().nullish(),
		street_no: z.string().nullish(),
		street1: z.string().nullish(),
		street2: z.string().nullish(),
		street3: z.string().nullish(),
		city: z.string().nullish(),
		state: z.string().nullish(),
		zip: z.string().nullish(),
		country: z
			.string()
			.nullish()
			.describe('ISO 3166-1 alpha-2 code, e.g. `US`.'),
		phone: z.string().nullish(),
		email: z.string().nullish(),
		is_residential: z.boolean().nullish(),
		is_complete: z
			.boolean()
			.nullish()
			.describe(
				'False when a required value failed validation. Such an address still gets rates but cannot buy a label.',
			),
		metadata: z.string().nullish(),
		latitude: z.union([z.number(), z.string()]).nullish(),
		longitude: z.union([z.number(), z.string()]).nullish(),
		validation_results: AddressValidationResultsSchema.nullish(),
		test: z.boolean().nullish(),
	})
	.loose();

export type ShippoAddress = z.infer<typeof AddressSchema>;

/**
 * `country` is the only field the API requires, but buying a label needs a name
 * and one street line. That gap is documented rather than enforced: creating an
 * incomplete address is a legitimate way to get rates before you have them.
 */
const AddressFieldsSchema = z.object({
	name: z
		.string()
		.max(100)
		.optional()
		.describe('Required to buy a label, not to create the address.'),
	company: z.string().max(100).optional(),
	street1: z.string().max(121).optional().describe('Required to buy a label.'),
	street2: z.string().max(100).optional(),
	street3: z
		.string()
		.max(100)
		.optional()
		.describe('USPS international, UPS domestic and UPS international only.'),
	street_no: z
		.string()
		.optional()
		.describe('Separate street number, for DHL Germany only.'),
	city: z.string().optional(),
	state: z.string().optional().describe('State or province code or name.'),
	zip: z.string().optional(),
	country: z.string().length(2).describe('ISO 3166-1 alpha-2 code.'),
	phone: z.string().optional(),
	email: z.string().optional(),
	is_residential: z.boolean().optional(),
	metadata: z.string().optional(),
});

const AddressesListInputSchema = z.object({
	...PagingShape,
	...accountIdHeader,
});

export type AddressesListInput = z.input<typeof AddressesListInputSchema>;

const AddressGetInputSchema = z.object({
	address_id: Id.describe('The address `object_id`.'),
	...accountIdHeader,
});

export type AddressGetInput = z.input<typeof AddressGetInputSchema>;

const AddressCreateInputSchema = AddressFieldsSchema.extend({
	validate: z
		.boolean()
		.optional()
		.describe('Validate the address as part of the create call.'),
	...accountIdHeader,
});

export type AddressCreateInput = z.input<typeof AddressCreateInputSchema>;

const AddressesListResponseSchema = pagedResults(AddressSchema);

export type AddressesListResponse = z.infer<typeof AddressesListResponseSchema>;

// ── parcels ───────────────────────────────────────────────────────────────

/**
 * Insurance on one parcel. `provider` chooses the carrier's own cover instead
 * of Shippo's (XCover), and only these three carriers offer one.
 */
const ParcelInsuranceSchema = z
	.object({
		amount: z
			.string()
			.nullish()
			.describe('Declared value, as a decimal string.'),
		content: z.string().nullish().describe('Description of the contents.'),
		currency: z.string().nullish(),
		provider: z
			.enum(['FEDEX', 'UPS', 'ONTRAC'])
			.nullish()
			.describe('Carrier-provided cover instead of Shippo’s XCover.'),
	})
	.loose();

/**
 * Per-parcel extras. `COD` is a nested collect-on-delivery object whose shape
 * varies by carrier; the two reference lines and insurance are the rest and are
 * typed here so a caller can read them without a cast.
 */
const ParcelExtraSchema = z
	.object({
		insurance: ParcelInsuranceSchema.nullish(),
		reference_1: z
			.string()
			.max(50)
			.nullish()
			.describe('Text printed on the label where the carrier supports it.'),
		reference_2: z.string().max(50).nullish(),
		COD: z
			.object({
				amount: z
					.string()
					.nullish()
					.describe('Amount to collect, as a decimal string.'),
				currency: z.string().nullish(),
				payment_method: z
					.enum(['SECURED_FUNDS', 'CASH', 'ANY'])
					.nullish()
					.describe('Defaults to `ANY` when omitted.'),
			})
			.loose()
			.nullish()
			.describe('Collect on delivery details. UPS only.'),
	})
	.loose();

export const ParcelSchema = z
	.object({
		object_id: z.string().nullish(),
		object_owner: z.string().nullish(),
		object_created: IsoDate.nullish(),
		object_updated: IsoDate.nullish(),
		object_state: z
			.string()
			.nullish()
			.describe('`VALID` once every required value has been accepted.'),
		length: z.string().nullish(),
		width: z.string().nullish(),
		height: z.string().nullish(),
		distance_unit: z.string().nullish(),
		weight: z.string().nullish(),
		mass_unit: z.string().nullish(),
		template: z
			.string()
			.nullish()
			.describe(
				'Carrier template token this parcel was created from, e.g. `USPS_FlatRateGiftBox`.',
			),
		extra: ParcelExtraSchema.nullish(),
		metadata: z.string().nullish(),
		test: z.boolean().nullish(),
	})
	.loose();

export type ShippoParcel = z.infer<typeof ParcelSchema>;

const ParcelFieldsSchema = z.object({
	length: DimensionSchema,
	width: DimensionSchema,
	height: DimensionSchema,
	distance_unit: DistanceUnitSchema,
	weight: WeightSchema,
	mass_unit: WeightUnitSchema,
	metadata: z.string().optional(),
	extra: z
		.object({
			insurance: z
				.object({
					amount: z
						.string()
						.optional()
						.describe('Declared value, as a decimal string.'),
					content: z.string().optional(),
					currency: z.string().optional(),
					provider: z
						.enum(['FEDEX', 'UPS', 'ONTRAC'])
						.optional()
						.describe('Carrier-provided cover instead of Shippo’s XCover.'),
				})
				.loose()
				.optional(),
			reference_1: z.string().max(50).optional(),
			reference_2: z.string().max(50).optional(),
			COD: z
				.object({
					amount: z.string().optional(),
					currency: z.string().optional(),
					payment_method: z.enum(['SECURED_FUNDS', 'CASH', 'ANY']).optional(),
				})
				.loose()
				.optional()
				.describe('Collect on delivery. UPS only.'),
		})
		.loose()
		.optional(),
});

const ParcelsListInputSchema = z.object({
	...PagingShape,
	...accountIdHeader,
});

export type ParcelsListInput = z.input<typeof ParcelsListInputSchema>;

const ParcelGetInputSchema = z.object({
	parcel_id: Id.describe('The parcel `object_id`.'),
	...accountIdHeader,
});

export type ParcelGetInput = z.input<typeof ParcelGetInputSchema>;

const ParcelCreateInputSchema = ParcelFieldsSchema.extend({
	...accountIdHeader,
});

export type ParcelCreateInput = z.input<typeof ParcelCreateInputSchema>;

const ParcelsListResponseSchema = pagedResults(ParcelSchema);

export type ParcelsListResponse = z.infer<typeof ParcelsListResponseSchema>;

// ── shipments and rates ───────────────────────────────────────────────────

const ServiceLevelSchema = z
	.object({
		name: z.string().nullish(),
		token: z
			.string()
			.nullish()
			.describe('e.g. `usps_priority_express`; a batch sends this token.'),
		terms: z.string().nullish(),
		extended_token: z.string().nullish(),
		parent_servicelevel: z
			.object({
				name: z.string().nullish(),
				token: z.string().nullish(),
				terms: z.string().nullish(),
				extended_token: z.string().nullish(),
			})
			.loose()
			.nullish(),
	})
	.loose();

export const RateSchema = z
	.object({
		object_id: z.string().nullish(),
		object_owner: z.string().nullish(),
		object_created: IsoDate.nullish(),
		amount: z
			.string()
			.nullish()
			.describe('Price in the sender’s currency, as a decimal string.'),
		amount_local: z
			.string()
			.nullish()
			.describe('Price in the recipient’s currency.'),
		currency: z.string().nullish(),
		currency_local: z.string().nullish(),
		provider: z.string().nullish().describe('Carrier slug, e.g. `USPS`.'),
		provider_image_75: z.string().nullish(),
		provider_image_200: z.string().nullish(),
		arrives_by: z
			.string()
			.nullish()
			.describe('`HH:MM:SS` in the destination’s timezone.'),
		attributes: z
			.array(z.string())
			.nullish()
			.describe('Any of `CHEAPEST`, `FASTEST`, `BESTVALUE` for this shipment.'),
		estimated_days: z.number().nullish(),
		duration_terms: z.string().nullish(),
		included_insurance_price: z.string().nullish(),
		servicelevel: ServiceLevelSchema.nullish(),
		carrier_account: z.string().nullish(),
		shipment: z.string().nullish(),
		zone: z.string().nullish(),
		messages: z.array(ResponseMessageSchema).nullish(),
		test: z.boolean().nullish(),
	})
	.loose();

export type ShippoRate = z.infer<typeof RateSchema>;

export const ShipmentSchema = z
	.object({
		object_id: z.string().nullish(),
		object_owner: z.string().nullish(),
		object_created: IsoDate.nullish(),
		object_updated: IsoDate.nullish(),
		status: z
			.string()
			.nullish()
			.describe(
				'`WAITING`, `QUEUED`, `SUCCESS` or `ERROR`. Under the async default, rates arrive while this is still `QUEUED`.',
			),
		address_from: AddressSchema.nullish(),
		address_to: AddressSchema.nullish(),
		address_return: AddressSchema.nullish(),
		parcels: z.array(ParcelSchema).nullish(),
		rates: z.array(RateSchema).nullish(),
		carrier_accounts: z.array(z.string()).nullish(),
		messages: z.array(ResponseMessageSchema).nullish(),
		metadata: z.string().nullish(),
		shipment_date: z.string().nullish(),
		test: z.boolean().nullish(),
	})
	.loose();

export type ShippoShipment = z.infer<typeof ShipmentSchema>;

/**
 * Sender and recipient take either a nested address or the `object_id` of one
 * created earlier, which is what the addresses API exists for.
 */
const AddressOrIdSchema = z.union([AddressFieldsSchema, Id]);

/**
 * Optional services requested for a shipment. Shippo documents around sixty
 * carrier-specific fields here; the ones that change what a caller must supply
 * are typed, and the rest pass through so a carrier option added later still
 * works.
 */
const ShipmentExtraSchema = z
	.object({
		insurance: z
			.object({
				amount: z.string().optional(),
				currency: z.string().optional(),
				content: z.string().optional(),
				provider: z.string().optional(),
			})
			.loose()
			.describe('Shipment-level insurance, distinct from per-parcel cover.')
			.optional(),
		signature_confirmation: z
			.enum([
				'STANDARD',
				'ADULT',
				'INDIRECT',
				'CARRIER_CONFIRMATION',
				'NO_SIGNATURE',
			])
			.optional()
			.describe(
				'Who must sign on delivery. `NO_SIGNATURE` may add a surcharge.',
			),
		authority_to_leave: z
			.boolean()
			.optional()
			.describe('Allow the carrier to leave the parcel somewhere safe.'),
		bypass_address_validation: z.boolean().optional(),
		saturday_delivery: z.boolean().optional(),
		use_insured_shipping: z.boolean().optional(),
		alcohol: z
			// unknown: alcohol shipping needs per-carrier licence fields, and only
			// some carriers accept it at all.
			// unknown: carrier credential sets differ per carrier; typed as an open record.
			.record(z.string(), z.unknown())
			.optional(),
	})
	.loose();

const ShipmentFieldsSchema = z.object({
	address_from: AddressOrIdSchema.describe(
		'Sender address, or the `object_id` of an existing one.',
	),
	address_to: AddressOrIdSchema.describe(
		'Recipient address, or the `object_id` of an existing one.',
	),
	address_return: AddressOrIdSchema.optional(),
	parcels: z
		.array(z.union([ParcelFieldsSchema, Id]))
		.min(1)
		.describe('One or more parcels, or the `object_id`s of existing ones.'),
	async: z
		.boolean()
		.optional()
		.describe(
			'Shippo defaults to true, which returns the shipment before any rate exists. Pass false to get `rates` back in the response.',
		),
	carrier_accounts: z
		.array(Id)
		.min(1)
		.optional()
		.describe(
			'Only ask these carrier accounts for rates. Defaults to every active one.',
		),
	customs_declaration: z
		// unknown: a customs declaration is either an id or a carrier-shaped object.
		.union([Id, z.record(z.string(), z.unknown())])
		.optional(),
	shipment_date: z
		.string()
		.optional()
		.describe(
			'ISO 8601. Defaults to now; some carriers require a future working day.',
		),
	metadata: z.string().max(100).optional(),
	extra: ShipmentExtraSchema.optional(),
});

const ShipmentsListInputSchema = z.object({
	...PagingShape,
	page_token: z
		.string()
		.optional()
		.describe('Paging token, as an alternative to `page`.'),
	object_created_gt: z.string().optional(),
	object_created_gte: z.string().optional(),
	object_created_lt: z.string().optional(),
	object_created_lte: z.string().optional(),
	...accountIdHeader,
});

export type ShipmentsListInput = z.input<typeof ShipmentsListInputSchema>;

const ShipmentGetInputSchema = z.object({
	shipment_id: Id.describe('The shipment `object_id`.'),
	...accountIdHeader,
});

export type ShipmentGetInput = z.input<typeof ShipmentGetInputSchema>;

const ShipmentCreateInputSchema = ShipmentFieldsSchema.extend({
	...accountIdHeader,
});

export type ShipmentCreateInput = z.input<typeof ShipmentCreateInputSchema>;

const ShipmentRatesInputSchema = ShipmentGetInputSchema;

export type ShipmentRatesInput = z.input<typeof ShipmentRatesInputSchema>;

const ShipmentRatesInCurrencyInputSchema = z.object({
	shipment_id: Id.describe('The shipment `object_id`.'),
	currency_code: z
		.string()
		.length(3)
		.describe('ISO 4217 code to express the amounts in, e.g. `EUR`.'),
	...accountIdHeader,
});

export type ShipmentRatesInCurrencyInput = z.input<
	typeof ShipmentRatesInCurrencyInputSchema
>;

const RateGetInputSchema = z.object({
	rate_id: Id.describe('The rate `object_id`.'),
	...accountIdHeader,
});

export type RateGetInput = z.input<typeof RateGetInputSchema>;

const ShipmentsListResponseSchema = pagedResults(ShipmentSchema);

export type ShipmentsListResponse = z.infer<typeof ShipmentsListResponseSchema>;

const RatesListResponseSchema = pagedResults(RateSchema);

export type RatesListResponse = z.infer<typeof RatesListResponseSchema>;

// ── transactions (labels) ─────────────────────────────────────────────────

export const TRANSACTION_STATUSES = [
	'WAITING',
	'QUEUED',
	'SUCCESS',
	'ERROR',
	'REFUNDED',
	'REFUNDPENDING',
	'REFUNDREJECTED',
] as const;

export const TRACKING_STATUSES = [
	'UNKNOWN',
	'PRE_TRANSIT',
	'TRANSIT',
	'DELIVERED',
	'RETURNED',
	'FAILURE',
] as const;

const TrackingStatusSchema = z
	.object({
		object_id: z.string().nullish(),
		object_created: IsoDate.nullish(),
		object_updated: IsoDate.nullish(),
		status: z.string().nullish(),
		status_date: z.string().nullish(),
		status_details: z.string().nullish(),
		substatus: z
			.object({
				code: z.string().nullish(),
				text: z.string().nullish(),
				action_required: z.boolean().nullish(),
			})
			.loose()
			.nullish(),
		location: z
			.object({
				city: z.string().nullish(),
				state: z.string().nullish(),
				zip: z.string().nullish(),
				country: z.string().nullish(),
			})
			.loose()
			.nullish(),
	})
	.loose();

export type ShippoTrackingStatus = z.infer<typeof TrackingStatusSchema>;

export const TransactionSchema = z
	.object({
		object_id: z.string().nullish(),
		object_owner: z.string().nullish(),
		object_created: IsoDate.nullish(),
		object_updated: IsoDate.nullish(),
		object_state: z.string().nullish(),
		status: z
			.string()
			.nullish()
			.describe(
				'`WAITING`, `QUEUED`, `SUCCESS`, `ERROR`, or a refund state. Only `SUCCESS` carries a `label_url`.',
			),
		rate: z
			.string()
			.nullish()
			.describe(
				'The rate `object_id` this label was bought from, not the rate object. Read it with `rates.get`.',
			),
		parcel: z.string().nullish(),
		label_url: z
			.string()
			.nullish()
			.describe(
				'A signed URL that expires; its `Expires` query parameter is a Unix timestamp. Re-read the transaction rather than retrying an expired link.',
			),
		commercial_invoice_url: z.string().nullish(),
		qr_code_url: z.string().nullish(),
		label_file_type: z.string().nullish(),
		tracking_number: z.string().nullish(),
		tracking_status: z
			.string()
			.nullish()
			.describe(
				'The latest high-level status of the label as a string — `UNKNOWN`, `PRE_TRANSIT`, `TRANSIT`, `DELIVERED`, `RETURNED` or `FAILURE`. Shippo sends the bare value here, not the tracking-status object that `tracks.get` returns.',
			),
		tracking_url_provider: z.string().nullish(),
		eta: z.string().nullish(),
		messages: z.array(ResponseMessageSchema).nullish(),
		metadata: z.string().nullish(),
		test: z.boolean().nullish(),
	})
	.loose();

export type ShippoTransaction = z.infer<typeof TransactionSchema>;

const TransactionCreateInputSchema = z.object({
	rate: Id.describe(
		'The rate `object_id` to buy. This spends money on the account’s carrier.',
	),
	async: z
		.boolean()
		.optional()
		.describe(
			'Defaults to true, which returns before the label exists; pass false to wait for `label_url`.',
		),
	label_file_type: z.enum(LABEL_FILE_TYPES).optional(),
	metadata: z.string().max(100).optional(),
	order: Id.optional(),
	...accountIdHeader,
});

export type TransactionCreateInput = z.input<
	typeof TransactionCreateInputSchema
>;

const TransactionsListInputSchema = z.object({
	...PagingShape,
	rate: Id.optional().describe('Only transactions bought from this rate.'),
	object_status: z.enum(TRANSACTION_STATUSES).optional(),
	tracking_status: z.enum(TRACKING_STATUSES).optional(),
	object_created_gt: z.string().optional(),
	object_created_gte: z.string().optional(),
	object_created_lt: z.string().optional(),
	object_created_lte: z.string().optional(),
	...accountIdHeader,
});

export type TransactionsListInput = z.input<typeof TransactionsListInputSchema>;

const TransactionGetInputSchema = z.object({
	transaction_id: Id.describe('The transaction `object_id`.'),
	...accountIdHeader,
});

export type TransactionGetInput = z.input<typeof TransactionGetInputSchema>;

const TransactionsListResponseSchema = pagedResults(TransactionSchema);

export type TransactionsListResponse = z.infer<
	typeof TransactionsListResponseSchema
>;

// ── refunds ───────────────────────────────────────────────────────────────

export const REFUND_STATUSES = [
	'QUEUED',
	'PENDING',
	'SUCCESS',
	'ERROR',
] as const;

export const RefundSchema = z
	.object({
		object_id: z.string().nullish(),
		object_owner: z.string().nullish(),
		object_created: IsoDate.nullish(),
		object_updated: IsoDate.nullish(),
		status: z
			.string()
			.nullish()
			.describe('`QUEUED`, `PENDING`, `SUCCESS` or `ERROR`.'),
		transaction: z.string().nullish(),
		test: z.boolean().nullish(),
	})
	.loose();

export type ShippoRefund = z.infer<typeof RefundSchema>;

const RefundCreateInputSchema = z.object({
	transaction: Id.describe('The transaction `object_id` to refund.'),
	async: z
		.boolean()
		.optional()
		.describe('Defaults to true; pass false to wait for the outcome.'),
	...accountIdHeader,
});

export type RefundCreateInput = z.input<typeof RefundCreateInputSchema>;

const RefundGetInputSchema = z.object({
	refund_id: Id.describe('The refund `object_id`.'),
	...accountIdHeader,
});

export type RefundGetInput = z.input<typeof RefundGetInputSchema>;

// Verified live: `?results=1` returns one refund and a `next` URL, so this
// route paginates even though the spec omits the parameters.
const RefundsListInputSchema = z.object({
	...PagingShape,
	...accountIdHeader,
});

export type RefundsListInput = z.input<typeof RefundsListInputSchema>;

const RefundsListResponseSchema = pagedResults(RefundSchema);

export type RefundsListResponse = z.infer<typeof RefundsListResponseSchema>;

// ── tracking ──────────────────────────────────────────────────────────────

const TrackingLocationSchema = z
	.object({
		city: z.string().nullish(),
		state: z.string().nullish(),
		zip: z.string().nullish(),
		country: z.string().nullish(),
	})
	.loose();

export const TrackSchema = z
	.object({
		carrier: z.string().nullish(),
		tracking_number: z.string().nullish(),
		address_from: TrackingLocationSchema.nullish(),
		address_to: TrackingLocationSchema.nullish(),
		eta: z.string().nullish(),
		original_eta: z.string().nullish(),
		servicelevel: ServiceLevelSchema.nullish(),
		messages: z.array(z.string()).nullish(),
		metadata: z.string().nullish(),
		tracking_status: TrackingStatusSchema.nullish(),
		tracking_history: z.array(TrackingStatusSchema).nullish(),
	})
	.loose();

export type ShippoTrack = z.infer<typeof TrackSchema>;

const TrackGetInputSchema = z.object({
	carrier: z
		.string()
		.min(1)
		.describe('Carrier slug, e.g. `usps`, `fedex`, `ups`, `dhl_express`.'),
	tracking_number: z.string().min(1).describe('The carrier’s tracking number.'),
	...accountIdHeader,
});

export type TrackGetInput = z.input<typeof TrackGetInputSchema>;

const TrackRegisterInputSchema = z.object({
	carrier: z.string().min(1).describe('Carrier slug, e.g. `usps`.'),
	tracking_number: z.string().min(1),
	metadata: z.string().optional(),
	...accountIdHeader,
});

export type TrackRegisterInput = z.input<typeof TrackRegisterInputSchema>;

// ── customs ───────────────────────────────────────────────────────────────

export const CustomsItemSchema = z
	.object({
		object_id: z.string().nullish(),
		object_owner: z.string().nullish(),
		object_created: IsoDate.nullish(),
		object_updated: IsoDate.nullish(),
		object_state: z.string().nullish(),
		description: z.string().nullish(),
		quantity: z.number().nullish(),
		net_weight: z.string().nullish(),
		mass_unit: z.string().nullish(),
		value_amount: z.string().nullish(),
		value_currency: z.string().nullish(),
		origin_country: z.string().nullish(),
		tariff_number: z.string().nullish(),
		hs_code: z.string().nullish(),
		sku_code: z.string().nullish(),
		eccn_ear99: z.string().nullish(),
		manufacturer_code: z.string().nullish(),
		manufacturer_standard_code: z.string().nullish(),
		metadata: z.string().nullish(),
		test: z.boolean().nullish(),
	})
	.loose();

export type ShippoCustomsItem = z.infer<typeof CustomsItemSchema>;

const CustomsItemFieldsSchema = z.object({
	description: z.string().min(1).describe('What the item is, e.g. `T-Shirt`.'),
	quantity: z.number().int().positive(),
	net_weight: WeightSchema,
	mass_unit: WeightUnitSchema,
	value_amount: z
		.string()
		.min(1)
		.describe('Declared value as a decimal string, e.g. `20`.'),
	value_currency: z.string().length(3).describe('ISO 4217 code.'),
	origin_country: z.string().length(2).describe('ISO 3166-1 alpha-2 code.'),
	tariff_number: z.string().optional(),
	hs_code: z.string().optional(),
	sku_code: z.string().optional(),
	eccn_ear99: z.string().optional(),
	manufacturer_code: z.string().optional(),
	manufacturer_standard_code: z.string().optional(),
	metadata: z.string().optional(),
});

const CustomsItemCreateInputSchema = CustomsItemFieldsSchema.extend({
	...accountIdHeader,
});

export type CustomsItemCreateInput = z.input<
	typeof CustomsItemCreateInputSchema
>;

const CustomsItemsListInputSchema = z.object({
	...PagingShape,
	...accountIdHeader,
});

export type CustomsItemsListInput = z.input<typeof CustomsItemsListInputSchema>;

const CustomsItemGetInputSchema = z.object({
	customs_item_id: Id.describe('The customs item `object_id`.'),
	...accountIdHeader,
});

export type CustomsItemGetInput = z.input<typeof CustomsItemGetInputSchema>;

const CustomsItemsListResponseSchema = pagedResults(CustomsItemSchema);

export type CustomsItemsListResponse = z.infer<
	typeof CustomsItemsListResponseSchema
>;

export const CONTENTS_TYPES = [
	'DOCUMENTS',
	'GIFT',
	'SAMPLE',
	'PACKET',
	'PARCEL',
	'MERCHANDISE',
	'HUMANITARIAN_DONATION',
	'RETURN_MERCHANDISE',
	'OTHER',
] as const;

export const NON_DELIVERY_OPTIONS = ['ABANDON', 'RETURN'] as const;

export const CustomsDeclarationSchema = z
	.object({
		object_id: z.string().nullish(),
		object_owner: z.string().nullish(),
		object_created: IsoDate.nullish(),
		object_updated: IsoDate.nullish(),
		object_state: z.string().nullish(),
		contents_type: z.string().nullish(),
		contents_explanation: z.string().nullish(),
		non_delivery_option: z.string().nullish(),
		certify: z.boolean().nullish(),
		certify_signer: z.string().nullish(),
		incoterm: z.string().nullish(),
		eel_pfc: z.string().nullish(),
		items: z.array(CustomsItemSchema).nullish(),
		address_importer: z.string().nullish(),
		metadata: z.string().nullish(),
		test: z.boolean().nullish(),
	})
	.loose();

export type ShippoCustomsDeclaration = z.infer<typeof CustomsDeclarationSchema>;

const CustomsDeclarationCreateInputSchema = z.object({
	contents_type: z.enum(CONTENTS_TYPES),
	contents_explanation: z
		.string()
		.optional()
		.describe('Required by some carriers for `OTHER` contents.'),
	non_delivery_option: z.enum(NON_DELIVERY_OPTIONS),
	certify: z
		.literal(true)
		.describe(
			'Must be true: the signer certifies the declaration is accurate. Shippo rejects false.',
		),
	certify_signer: z.string().min(1),
	items: z
		.array(z.union([CustomsItemFieldsSchema, Id]))
		.min(1)
		.describe(
			'Items to declare, or the `object_id`s of existing customs items.',
		),
	incoterm: z
		.enum(['DDP', 'DDU'])
		.optional()
		.describe('Delivered duty paid or unpaid.'),
	eel_pfc: z.enum(['NOEEI_30_37_a', 'NOEEI_30_36', 'AES_ITN']).optional(),
	address_importer: z.string().optional(),
	metadata: z.string().optional(),
	...accountIdHeader,
});

export type CustomsDeclarationCreateInput = z.input<
	typeof CustomsDeclarationCreateInputSchema
>;

const CustomsDeclarationsListInputSchema = z.object({
	...PagingShape,
	...accountIdHeader,
});

export type CustomsDeclarationsListInput = z.input<
	typeof CustomsDeclarationsListInputSchema
>;

const CustomsDeclarationGetInputSchema = z.object({
	customs_declaration_id: Id.describe('The customs declaration `object_id`.'),
	...accountIdHeader,
});

export type CustomsDeclarationGetInput = z.input<
	typeof CustomsDeclarationGetInputSchema
>;

const CustomsDeclarationsListResponseSchema = pagedResults(
	CustomsDeclarationSchema,
);

export type CustomsDeclarationsListResponse = z.infer<
	typeof CustomsDeclarationsListResponseSchema
>;

// ── batches ───────────────────────────────────────────────────────────────

export const BATCH_STATUSES = [
	'VALIDATING',
	'VALID',
	'INVALID',
	'PURCHASING',
	'PURCHASED',
	'PURCHASE_FAILED',
] as const;

const BatchShipmentSchema = z
	.object({
		object_id: z.string().nullish(),
		shipment: z.string().nullish().describe('The shipment `object_id`.'),
		transaction: z
			.string()
			.nullish()
			.describe('The transaction, once purchased.'),
		status: z.string().nullish(),
		carrier_account: z.string().nullish(),
		servicelevel_token: z.string().nullish(),
		messages: z.array(ResponseMessageSchema).nullish(),
		metadata: z.string().nullish(),
	})
	.loose();

export type ShippoBatchShipment = z.infer<typeof BatchShipmentSchema>;

export const BatchSchema = z
	.object({
		object_id: z.string().nullish(),
		object_owner: z.string().nullish(),
		object_created: IsoDate.nullish(),
		object_updated: IsoDate.nullish(),
		status: z
			.string()
			.nullish()
			.describe(
				'`VALIDATING`, `VALID`, `INVALID`, `PURCHASING`, `PURCHASED` or `PURCHASE_FAILED`. Creation and purchase are both asynchronous.',
			),
		default_carrier_account: z.string().nullish(),
		default_servicelevel_token: z.string().nullish(),
		label_filetype: z.string().nullish(),
		metadata: z.string().nullish(),
		label_url: z
			.array(z.string())
			.nullish()
			.describe(
				'One merged PDF per 100 labels once the purchase finishes. The URLs expire.',
			),
		batch_shipments: z
			.object({
				next: z.string().nullish(),
				previous: z.string().nullish(),
				results: z.array(BatchShipmentSchema).nullish(),
			})
			.loose()
			.nullish(),
		object_results: z
			.object({
				purchase_failed: z.number().nullish(),
				purchase_succeeded: z.number().nullish(),
			})
			.loose()
			.nullish(),
		test: z.boolean().nullish(),
	})
	.loose();

export type ShippoBatch = z.infer<typeof BatchSchema>;

const BatchShipmentInputSchema = z.object({
	shipment: Id.describe(
		'An existing shipment `object_id`; the rate comes from the carrier and servicelevel on this entry or the batch default.',
	),
	carrier_account: Id.optional(),
	servicelevel_token: z.string().optional(),
	metadata: z.string().optional(),
});

const BatchCreateInputSchema = z
	.object({
		default_carrier_account: Id.optional(),
		default_servicelevel_token: z.string().optional(),
		label_filetype: z.enum(LABEL_FILE_TYPES).optional(),
		metadata: z.string().optional(),
		batch_shipments: z.array(BatchShipmentInputSchema).min(1),
		...accountIdHeader,
	})
	.superRefine((value, ctx) => {
		// Each shipment needs a carrier and a servicelevel, and the batch
		// defaults fill in for whichever field an entry omits. The two resolve
		// independently, so a default carrier plus a per-shipment servicelevel
		// token is valid.
		value.batch_shipments.forEach((shipment, index) => {
			if (
				shipment.carrier_account === undefined &&
				value.default_carrier_account === undefined
			) {
				ctx.addIssue({
					code: 'custom',
					path: ['batch_shipments', index, 'carrier_account'],
					message:
						'Set this, or `default_carrier_account` on the batch, so a rate can be chosen.',
				});
			}
			if (
				shipment.servicelevel_token === undefined &&
				value.default_servicelevel_token === undefined
			) {
				ctx.addIssue({
					code: 'custom',
					path: ['batch_shipments', index, 'servicelevel_token'],
					message:
						'Set this, or `default_servicelevel_token` on the batch, so a rate can be chosen.',
				});
			}
		});
	});

export type BatchCreateInput = z.input<typeof BatchCreateInputSchema>;

const BatchGetInputSchema = z.object({
	batch_id: Id.describe('The batch `object_id`.'),
	...accountIdHeader,
});

export type BatchGetInput = z.input<typeof BatchGetInputSchema>;

const BatchAddShipmentsInputSchema = z.object({
	batch_id: Id.describe(
		'The batch to add to. Must still be `VALIDATING` or `VALID`.',
	),
	shipments: z.array(BatchShipmentInputSchema).min(1),
	...accountIdHeader,
});

export type BatchAddShipmentsInput = z.input<
	typeof BatchAddShipmentsInputSchema
>;

const BatchRemoveShipmentsInputSchema = z.object({
	batch_id: Id.describe('The batch to remove from.'),
	shipments: z.array(Id).min(1).describe('Shipment `object_id`s to remove.'),
	...accountIdHeader,
});

export type BatchRemoveShipmentsInput = z.input<
	typeof BatchRemoveShipmentsInputSchema
>;

const BatchPurchaseInputSchema = BatchGetInputSchema;

export type BatchPurchaseInput = z.input<typeof BatchPurchaseInputSchema>;

// ── orders ────────────────────────────────────────────────────────────────

export const ORDER_STATUSES = [
	'UNKNOWN',
	'AWAITPAY',
	'PAID',
	'REFUNDED',
	'CANCELLED',
	'PARTIALLY_FULFILLED',
	'SHIPPED',
] as const;

const LineItemSchema = z
	.object({
		object_id: z.string().nullish(),
		title: z.string().nullish(),
		quantity: z.number().nullish(),
		sku: z.string().nullish(),
		total_price: z.string().nullish(),
		currency: z.string().nullish(),
		weight: z.string().nullish(),
		weight_unit: z.string().nullish(),
		max_dimensions: z
			.object({
				length: z.string().nullish(),
				width: z.string().nullish(),
				height: z.string().nullish(),
				distance_unit: z.string().nullish(),
			})
			.loose()
			.nullish(),
	})
	.loose();

export type ShippoLineItem = z.infer<typeof LineItemSchema>;

export const OrderSchema = z
	.object({
		object_id: z.string().nullish(),
		object_owner: z.string().nullish(),
		object_created: IsoDate.nullish(),
		object_updated: IsoDate.nullish(),
		order_number: z.string().nullish(),
		order_status: z.string().nullish(),
		placed_at: z.string().nullish(),
		currency: z.string().nullish(),
		subtotal_price: z.string().nullish(),
		total_price: z.string().nullish(),
		total_tax: z.string().nullish(),
		shipping_cost: z.string().nullish(),
		shipping_cost_currency: z.string().nullish(),
		shipping_method: z.string().nullish(),
		notes: z.string().nullish(),
		weight: z.string().nullish(),
		weight_unit: z.string().nullish(),
		from_address: AddressSchema.nullish(),
		to_address: AddressSchema.nullish(),
		line_items: z.array(LineItemSchema).nullish(),
		transactions: z.array(TransactionSchema).nullish(),
		shop_app: z.string().nullish(),
	})
	.loose();

export type ShippoOrder = z.infer<typeof OrderSchema>;

const OrderAddressSchema = z.object({
	name: z.string().optional(),
	company: z.string().optional(),
	street1: z.string().optional(),
	street2: z.string().optional(),
	city: z.string().optional(),
	state: z.string().optional(),
	zip: z.string().optional(),
	country: z.string().length(2),
	phone: z.string().optional(),
	email: z.string().optional(),
});

const OrderCreateInputSchema = z.object({
	order_number: z.string().min(1),
	order_status: z
		.enum(ORDER_STATUSES)
		.optional()
		.describe('Defaults to `AWAITPAY`.'),
	placed_at: z.string().min(1).describe('ISO 8601 timestamp.'),
	currency: z
		.string()
		.length(3)
		.describe('ISO 4217 code for the order totals.'),
	subtotal_price: z.string().optional(),
	total_price: z.string().optional(),
	total_tax: z.string().optional(),
	shipping_cost: z.string().optional(),
	shipping_cost_currency: z.string().length(3).optional(),
	shipping_method: z.string().optional(),
	notes: z.string().optional(),
	weight: z.string().optional(),
	weight_unit: z.enum(WEIGHT_UNITS).optional(),
	to_address: z.union([OrderAddressSchema, Id]),
	from_address: z.union([OrderAddressSchema, Id]).optional(),
	line_items: z
		.array(
			z.object({
				title: z.string().min(1),
				quantity: z.number().int().positive(),
				sku: z.string().optional(),
				total_price: z
					.string()
					.min(1)
					.describe('Decimal string, e.g. `12.50`.'),
				currency: z.string().length(3),
				weight: z.string().optional(),
				weight_unit: z.enum(WEIGHT_UNITS).optional(),
			}),
		)
		.min(1),
	...accountIdHeader,
});

export type OrderCreateInput = z.input<typeof OrderCreateInputSchema>;

const OrdersListInputSchema = z.object({
	...PagingShape,
	order_status: z
		.array(z.enum(ORDER_STATUSES))
		.min(1)
		.optional()
		.describe('Only orders in these statuses.'),
	shop_app: z.string().optional(),
	// The API's own names, from the spec: `start_date`/`end_date` filter on
	// `placed_at`, not on when the object was created. Shippo ignores an unknown
	// query parameter and answers 200, so a differently-named field would look
	// like it worked while filtering nothing.
	start_date: z
		.string()
		.optional()
		.describe(
			'Only orders placed at or after this instant, ISO 8601 UTC. Filtered on `placed_at`.',
		),
	end_date: z
		.string()
		.optional()
		.describe(
			'Only orders placed at or before this instant. Filtered on `placed_at`.',
		),
	...accountIdHeader,
});

export type OrdersListInput = z.input<typeof OrdersListInputSchema>;

const OrderGetInputSchema = z.object({
	order_id: Id.describe('The order `object_id`.'),
	...accountIdHeader,
});

export type OrderGetInput = z.input<typeof OrderGetInputSchema>;

const OrdersListResponseSchema = pagedResults(OrderSchema);

export type OrdersListResponse = z.infer<typeof OrdersListResponseSchema>;

// ── pickups ───────────────────────────────────────────────────────────────

export const PickupSchema = z
	.object({
		object_id: z.string().nullish(),
		object_created: IsoDate.nullish(),
		object_updated: IsoDate.nullish(),
		status: z.string().nullish().describe('`PENDING`, `CONFIRMED` or `ERROR`.'),
		carrier_account: z.string().nullish(),
		location: z
			.object({
				object_id: z.string().nullish(),
				city: z.string().nullish(),
				state: z.string().nullish(),
				zip: z.string().nullish(),
				country: z.string().nullish(),
				building_location_type: z.string().nullish(),
			})
			.loose()
			.nullish(),
		transactions: z.array(z.string()).nullish(),
		requested_start_time: z.string().nullish(),
		requested_end_time: z.string().nullish(),
		confirmed_start_time: z.string().nullish(),
		confirmed_end_time: z.string().nullish(),
		cancel_by_time: z.string().nullish(),
		confirmation_code: z.string().nullish(),
		timezone: z.string().nullish(),
		messages: z.array(ResponseMessageSchema).nullish(),
		metadata: z.string().nullish(),
		is_test: z.boolean().nullish(),
	})
	.loose();

export type ShippoPickup = z.infer<typeof PickupSchema>;

const PickupCreateInputSchema = z
	.object({
		carrier_account: Id.describe(
			'A carrier account allowed to collect; Shippo rejects one that cannot.',
		),
		location: z.object({
			object_id: Id.describe('The address `object_id` to collect from.'),
			building_location_type: z
				.enum(['apartment', 'building', 'floor', 'room', 'suite'])
				.optional(),
		}),
		transactions: z
			.array(Id)
			.min(1)
			.describe(
				'Transactions the pickup covers; Shippo groups them by carrier.',
			),
		requested_start_time: z
			.string()
			.min(1)
			.describe('ISO 8601; must fall inside the carrier’s pickup window.'),
		requested_end_time: z.string().min(1),
		timezone: z
			.string()
			.optional()
			.describe('Olson name for the requested times, e.g. `America/New_York`.'),
		metadata: z.string().optional(),
		...accountIdHeader,
	})
	.superRefine((value, ctx) => {
		if (
			Date.parse(value.requested_end_time) <=
			Date.parse(value.requested_start_time)
		) {
			ctx.addIssue({
				code: 'custom',
				path: ['requested_end_time'],
				message: 'The pickup window must end after it starts.',
			});
		}
	});

export type PickupCreateInput = z.input<typeof PickupCreateInputSchema>;

// ── manifests ─────────────────────────────────────────────────────────────

export const ManifestSchema = z
	.object({
		object_id: z.string().nullish(),
		object_owner: z.string().nullish(),
		object_created: IsoDate.nullish(),
		object_updated: IsoDate.nullish(),
		status: z.string().nullish().describe('`QUEUED`, `SUCCESS` or `ERROR`.'),
		carrier_account: z.string().nullish(),
		shipment_date: z.string().nullish(),
		transactions: z.array(z.string()).nullish(),
		address_from: z.string().nullish(),
		documents: z.array(z.string()).nullish(),
		errors: z.array(ResponseMessageSchema).nullish(),
	})
	.loose();

export type ShippoManifest = z.infer<typeof ManifestSchema>;

const ManifestCreateInputSchema = z.object({
	carrier_account: Id.describe('The carrier account the manifest is for.'),
	shipment_date: z
		.string()
		.min(1)
		.describe('Date the carrier collects, ISO 8601.'),
	transactions: z
		.array(Id)
		.min(1)
		.describe('Transactions covered; none may have been manifested already.'),
	address_from: Id.describe(
		'The address `object_id` the carrier collects from.',
	),
	...accountIdHeader,
});

export type ManifestCreateInput = z.input<typeof ManifestCreateInputSchema>;

const ManifestsListInputSchema = z.object({
	...PagingShape,
	...accountIdHeader,
});

export type ManifestsListInput = z.input<typeof ManifestsListInputSchema>;

const ManifestGetInputSchema = z.object({
	manifest_id: Id.describe('The manifest `object_id`.'),
	...accountIdHeader,
});

export type ManifestGetInput = z.input<typeof ManifestGetInputSchema>;

const ManifestsListResponseSchema = pagedResults(ManifestSchema);

export type ManifestsListResponse = z.infer<typeof ManifestsListResponseSchema>;

// ── carrier accounts ──────────────────────────────────────────────────────

export const CarrierAccountSchema = z
	.object({
		object_id: z.string().nullish(),
		object_owner: z.string().nullish(),
		carrier: z.string().nullish().describe('Carrier slug, e.g. `usps`.'),
		carrier_name: z.string().nullish(),
		account_id: z.string().nullish(),
		active: z.boolean().nullish(),
		is_shippo_account: z
			.boolean()
			.nullish()
			.describe(
				'True when Shippo supplies the credentials rather than the account owner.',
			),
		test: z.boolean().nullish(),
		parameters: z
			// Shippo documents 30+ carrier-specific credential sets; typed as an
			// open record so the fields a caller stored come back readable.
			.record(z.string(), z.unknown())
			.nullish()
			.describe('Carrier-specific credentials, as stored on the account.'),
		service_levels: z
			.array(
				z
					.object({
						name: z.string().nullish(),
						token: z.string().nullish(),
						terms: z.string().nullish(),
						extended_token: z.string().nullish(),
					})
					.loose(),
			)
			.nullish(),
		metadata: z.string().nullish(),
	})
	.loose();

export type ShippoCarrierAccount = z.infer<typeof CarrierAccountSchema>;

const CarrierAccountsListInputSchema = z.object({
	...accountIdHeader,
});

export type CarrierAccountsListInput = z.input<
	typeof CarrierAccountsListInputSchema
>;

const CarrierAccountGetInputSchema = z.object({
	carrier_account_id: Id.describe('The carrier account `object_id`.'),
	...accountIdHeader,
});

export type CarrierAccountGetInput = z.input<
	typeof CarrierAccountGetInputSchema
>;

const CarrierAccountCreateInputSchema = z.object({
	carrier: z
		.string()
		.min(1)
		.describe('Carrier slug, e.g. `usps`, `fedex`, `ups`, `dhl_express`.'),
	parameters: z
		// unknown: the credential set is carrier-specific, with its own documented
		// parameters object per carrier.
		.record(z.string(), z.unknown())
		.describe('Carrier-specific credentials, e.g. `{ account_number: … }`.'),
	active: z.boolean().optional().describe('Defaults to true.'),
	metadata: z.string().optional(),
	...accountIdHeader,
});

export type CarrierAccountCreateInput = z.input<
	typeof CarrierAccountCreateInputSchema
>;

const CarrierAccountUpdateInputSchema = z.object({
	carrier_account_id: Id.describe('The carrier account to change.'),
	parameters: z
		// unknown: see CarrierAccountCreateInputSchema.
		.record(z.string(), z.unknown())
		.optional(),
	active: z.boolean().optional(),
	metadata: z.string().optional(),
	...accountIdHeader,
});

export type CarrierAccountUpdateInput = z.input<
	typeof CarrierAccountUpdateInputSchema
>;

const CarrierAccountRegisterInputSchema = z.object({
	carrier: z
		.string()
		.min(1)
		.describe('A Shippo-supplied carrier slug, e.g. `usps`.'),
	parameters: z
		// unknown: see CarrierAccountCreateInputSchema.
		.record(z.string(), z.unknown())
		.describe('Credentials for the Shippo-supplied account.'),
	active: z.boolean().optional(),
	...accountIdHeader,
});

export type CarrierAccountRegisterInput = z.input<
	typeof CarrierAccountRegisterInputSchema
>;

const CarrierAccountRegistrationStatusSchema = z
	.object({
		carrier_account: z.string().nullish(),
		registration_status: z
			.string()
			.nullish()
			.describe('Whether the carrier has approved the account for live rates.'),
		registration_steps: z
			// unknown: the step list is carrier-specific and passed through.
			.unknown()
			.nullish(),
	})
	.loose();

export type CarrierAccountRegistrationStatus = z.infer<
	typeof CarrierAccountRegistrationStatusSchema
>;

const CarrierAccountRegistrationStatusInputSchema = z.object({
	carrier: z.string().min(1).describe('Carrier slug to check.'),
	...accountIdHeader,
});

export type CarrierAccountRegistrationStatusInput = z.input<
	typeof CarrierAccountRegistrationStatusInputSchema
>;

// ── parcel templates ──────────────────────────────────────────────────────

export const CarrierParcelTemplateSchema = z
	.object({
		object_id: z.string().nullish(),
		carrier: z.string().nullish(),
		name: z.string().nullish(),
		token: z
			.string()
			.nullish()
			.describe('Reusable token, e.g. `USPS_FlatRateGiftBox`.'),
		length: z.string().nullish(),
		width: z.string().nullish(),
		height: z.string().nullish(),
		distance_unit: z.string().nullish(),
		weight: z.string().nullish(),
		weight_unit: z.string().nullish(),
		template: z.string().nullish(),
	})
	.loose();

export type ShippoCarrierParcelTemplate = z.infer<
	typeof CarrierParcelTemplateSchema
>;

const CarrierParcelTemplatesListInputSchema = z.object({
	...accountIdHeader,
});

export type CarrierParcelTemplatesListInput = z.input<
	typeof CarrierParcelTemplatesListInputSchema
>;

const CarrierParcelTemplateGetInputSchema = z.object({
	carrier_parcel_template_token: z
		.string()
		.min(1)
		.describe('Template token, e.g. `USPS_FlatRateGiftBox`.'),
	...accountIdHeader,
});

export type CarrierParcelTemplateGetInput = z.input<
	typeof CarrierParcelTemplateGetInputSchema
>;

const CarrierParcelTemplatesListResponseSchema = z
	.object({ results: z.array(CarrierParcelTemplateSchema) })
	.loose();

export type CarrierParcelTemplatesListResponse = z.infer<
	typeof CarrierParcelTemplatesListResponseSchema
>;

export const UserParcelTemplateSchema = z
	.object({
		object_id: z.string().nullish(),
		object_owner: z.string().nullish(),
		object_created: IsoDate.nullish(),
		object_updated: IsoDate.nullish(),
		name: z.string().nullish(),
		length: z.string().nullish(),
		width: z.string().nullish(),
		height: z.string().nullish(),
		distance_unit: z.string().nullish(),
		weight: z.string().nullish(),
		weight_unit: z.string().nullish(),
		template: CarrierParcelTemplateSchema.nullish(),
	})
	.loose();

export type ShippoUserParcelTemplate = z.infer<typeof UserParcelTemplateSchema>;

/**
 * No paging parameters: this route answers `{ results }` with no `next`, ignores
 * `results` and `page` (verified live), and returns every template. Offering
 * paging here would be a field that silently does nothing.
 */
const UserParcelTemplatesListInputSchema = z.object({
	...accountIdHeader,
});

export type UserParcelTemplatesListInput = z.input<
	typeof UserParcelTemplatesListInputSchema
>;

const UserParcelTemplateGetInputSchema = z.object({
	user_parcel_template_id: Id.describe('The template `object_id`.'),
	...accountIdHeader,
});

export type UserParcelTemplateGetInput = z.input<
	typeof UserParcelTemplateGetInputSchema
>;

const UserParcelTemplateCreateInputSchema = z.object({
	name: z.string().min(1),
	length: DimensionSchema,
	width: DimensionSchema,
	height: DimensionSchema,
	distance_unit: DistanceUnitSchema,
	weight: WeightSchema,
	weight_unit: WeightUnitSchema,
	template: z
		.string()
		.optional()
		.describe(
			'Carrier template token to base this on, e.g. `USPS_FlatRateGiftBox`.',
		),
	...accountIdHeader,
});

export type UserParcelTemplateCreateInput = z.input<
	typeof UserParcelTemplateCreateInputSchema
>;

const UserParcelTemplateUpdateInputSchema = z.object({
	user_parcel_template_id: Id.describe('The template to change.'),
	name: z.string().optional(),
	length: z.string().optional(),
	width: z.string().optional(),
	height: z.string().optional(),
	distance_unit: z.enum(DISTANCE_UNITS).optional(),
	weight: z.string().optional(),
	weight_unit: z.enum(WEIGHT_UNITS).optional(),
	...accountIdHeader,
});

export type UserParcelTemplateUpdateInput = z.input<
	typeof UserParcelTemplateUpdateInputSchema
>;

const UserParcelTemplateDeleteInputSchema = UserParcelTemplateGetInputSchema;

export type UserParcelTemplateDeleteInput = z.input<
	typeof UserParcelTemplateDeleteInputSchema
>;

const UserParcelTemplatesListResponseSchema = pagedResults(
	UserParcelTemplateSchema,
);

export type UserParcelTemplatesListResponse = z.infer<
	typeof UserParcelTemplatesListResponseSchema
>;

// ── webhooks ──────────────────────────────────────────────────────────────

export const WEBHOOK_EVENTS = [
	'transaction_created',
	'transaction_updated',
	'track_updated',
	'batch_created',
	'batch_purchased',
	'all',
] as const;

export const WebhookSchema = z
	.object({
		object_id: z.string().nullish(),
		object_owner: z.string().nullish(),
		object_created: IsoDate.nullish(),
		object_updated: IsoDate.nullish(),
		url: z.string().nullish(),
		event: z.string().nullish(),
		active: z.boolean().nullish(),
		is_test: z.boolean().nullish(),
	})
	.loose();

export type ShippoWebhook = z.infer<typeof WebhookSchema>;

// Verified live: `?results=2` returns two webhooks and a `next` URL, so this
// route paginates even though the spec omits the parameters.
const WebhooksListInputSchema = z.object({
	...PagingShape,
	...accountIdHeader,
});

export type WebhooksListInput = z.input<typeof WebhooksListInputSchema>;

const WebhookGetInputSchema = z.object({
	webhook_id: Id.describe('The webhook `object_id`.'),
	...accountIdHeader,
});

export type WebhookGetInput = z.input<typeof WebhookGetInputSchema>;

/**
 * `z.url()` accepts any scheme, including `ftp://`, but Shippo POSTs to this
 * endpoint over HTTP, so only http(s) is usable.
 */
const WebhookUrlSchema = z
	.url()
	.max(200)
	.refine((value) => /^https?:\/\//i.test(value), {
		message: 'Must be an http or https URL; Shippo POSTs to it.',
	})
	.describe('HTTPS endpoint Shippo POSTs to. Must be under 200 characters.');

const WebhookCreateInputSchema = z.object({
	url: WebhookUrlSchema,
	event: z
		.enum(WEBHOOK_EVENTS)
		.describe('The event to subscribe to; `all` is the catch-all.'),
	is_test: z
		.boolean()
		.optional()
		.describe(
			'Defaults to false; true limits deliveries to test-mode objects.',
		),
	...accountIdHeader,
});

export type WebhookCreateInput = z.input<typeof WebhookCreateInputSchema>;

const WebhookUpdateInputSchema = z.object({
	webhook_id: Id.describe('The webhook to change.'),
	url: WebhookUrlSchema.optional(),
	event: z.enum(WEBHOOK_EVENTS).optional(),
	active: z.boolean().optional(),
	is_test: z.boolean().optional(),
	...accountIdHeader,
});

export type WebhookUpdateInput = z.input<typeof WebhookUpdateInputSchema>;

const WebhookDeleteInputSchema = WebhookGetInputSchema;

export type WebhookDeleteInput = z.input<typeof WebhookDeleteInputSchema>;

const WebhooksListResponseSchema = pagedResults(WebhookSchema);

export type WebhooksListResponse = z.infer<typeof WebhooksListResponseSchema>;

// ── Registry ──────────────────────────────────────────────────────────────

/**
 * Every operation, keyed by the path it is registered under. `delete` is
 * reserved in TypeScript, so the three delete functions are named `remove`
 * and registered here under their real key.
 */
export const ShippoEndpointInputSchemas = {
	addressesList: AddressesListInputSchema,
	addressesGet: AddressGetInputSchema,
	addressesCreate: AddressCreateInputSchema,
	addressesValidate: AddressGetInputSchema,
	parcelsList: ParcelsListInputSchema,
	parcelsGet: ParcelGetInputSchema,
	parcelsCreate: ParcelCreateInputSchema,
	shipmentsList: ShipmentsListInputSchema,
	shipmentsGet: ShipmentGetInputSchema,
	shipmentsCreate: ShipmentCreateInputSchema,
	shipmentsRates: ShipmentRatesInputSchema,
	shipmentsRatesInCurrency: ShipmentRatesInCurrencyInputSchema,
	ratesGet: RateGetInputSchema,
	transactionsList: TransactionsListInputSchema,
	transactionsGet: TransactionGetInputSchema,
	transactionsCreate: TransactionCreateInputSchema,
	refundsList: RefundsListInputSchema,
	refundsGet: RefundGetInputSchema,
	refundsCreate: RefundCreateInputSchema,
	tracksGet: TrackGetInputSchema,
	tracksRegister: TrackRegisterInputSchema,
	customsItemsList: CustomsItemsListInputSchema,
	customsItemsGet: CustomsItemGetInputSchema,
	customsItemsCreate: CustomsItemCreateInputSchema,
	customsDeclarationsList: CustomsDeclarationsListInputSchema,
	customsDeclarationsGet: CustomsDeclarationGetInputSchema,
	customsDeclarationsCreate: CustomsDeclarationCreateInputSchema,
	batchesCreate: BatchCreateInputSchema,
	batchesGet: BatchGetInputSchema,
	batchesAddShipments: BatchAddShipmentsInputSchema,
	batchesRemoveShipments: BatchRemoveShipmentsInputSchema,
	batchesPurchase: BatchPurchaseInputSchema,
	ordersList: OrdersListInputSchema,
	ordersGet: OrderGetInputSchema,
	ordersCreate: OrderCreateInputSchema,
	pickupsCreate: PickupCreateInputSchema,
	manifestsList: ManifestsListInputSchema,
	manifestsGet: ManifestGetInputSchema,
	manifestsCreate: ManifestCreateInputSchema,
	carrierAccountsList: CarrierAccountsListInputSchema,
	carrierAccountsGet: CarrierAccountGetInputSchema,
	carrierAccountsCreate: CarrierAccountCreateInputSchema,
	carrierAccountsUpdate: CarrierAccountUpdateInputSchema,
	carrierAccountsRegister: CarrierAccountRegisterInputSchema,
	carrierAccountsRegistrationStatus:
		CarrierAccountRegistrationStatusInputSchema,
	carrierParcelTemplatesList: CarrierParcelTemplatesListInputSchema,
	carrierParcelTemplatesGet: CarrierParcelTemplateGetInputSchema,
	userParcelTemplatesList: UserParcelTemplatesListInputSchema,
	userParcelTemplatesGet: UserParcelTemplateGetInputSchema,
	userParcelTemplatesCreate: UserParcelTemplateCreateInputSchema,
	userParcelTemplatesUpdate: UserParcelTemplateUpdateInputSchema,
	userParcelTemplatesDelete: UserParcelTemplateDeleteInputSchema,
	webhooksList: WebhooksListInputSchema,
	webhooksGet: WebhookGetInputSchema,
	webhooksCreate: WebhookCreateInputSchema,
	webhooksUpdate: WebhookUpdateInputSchema,
	webhooksDelete: WebhookDeleteInputSchema,
} as const;

/** `/webhooks/{id}` answers 204 with no body at all, so every field is optional and the flag is derived; `null` is passed in for an absent body. */
const DeletedResponseSchema = z
	.object({ object_id: z.string().nullish(), deleted: z.literal(true) })
	.passthrough();

export const ShippoEndpointOutputSchemas = {
	addressesList: AddressesListResponseSchema,
	addressesGet: AddressSchema,
	addressesCreate: AddressSchema,
	addressesValidate: AddressSchema,
	parcelsList: ParcelsListResponseSchema,
	parcelsGet: ParcelSchema,
	parcelsCreate: ParcelSchema,
	shipmentsList: ShipmentsListResponseSchema,
	shipmentsGet: ShipmentSchema,
	shipmentsCreate: ShipmentSchema,
	shipmentsRates: RatesListResponseSchema,
	shipmentsRatesInCurrency: RatesListResponseSchema,
	ratesGet: RateSchema,
	transactionsList: TransactionsListResponseSchema,
	transactionsGet: TransactionSchema,
	transactionsCreate: TransactionSchema,
	refundsList: RefundsListResponseSchema,
	refundsGet: RefundSchema,
	refundsCreate: RefundSchema,
	tracksGet: TrackSchema,
	tracksRegister: TrackSchema,
	customsItemsList: CustomsItemsListResponseSchema,
	customsItemsGet: CustomsItemSchema,
	customsItemsCreate: CustomsItemSchema,
	customsDeclarationsList: CustomsDeclarationsListResponseSchema,
	customsDeclarationsGet: CustomsDeclarationSchema,
	customsDeclarationsCreate: CustomsDeclarationSchema,
	batchesCreate: BatchSchema,
	batchesGet: BatchSchema,
	batchesAddShipments: BatchSchema,
	batchesRemoveShipments: BatchSchema,
	batchesPurchase: BatchSchema,
	ordersList: OrdersListResponseSchema,
	ordersGet: OrderSchema,
	ordersCreate: OrderSchema,
	pickupsCreate: PickupSchema,
	manifestsList: ManifestsListResponseSchema,
	manifestsGet: ManifestSchema,
	manifestsCreate: ManifestSchema,
	carrierAccountsList: pagedResults(CarrierAccountSchema),
	carrierAccountsGet: CarrierAccountSchema,
	carrierAccountsCreate: CarrierAccountSchema,
	carrierAccountsUpdate: CarrierAccountSchema,
	carrierAccountsRegister: CarrierAccountSchema,
	carrierAccountsRegistrationStatus: CarrierAccountRegistrationStatusSchema,
	carrierParcelTemplatesList: CarrierParcelTemplatesListResponseSchema,
	carrierParcelTemplatesGet: CarrierParcelTemplateSchema,
	userParcelTemplatesList: UserParcelTemplatesListResponseSchema,
	userParcelTemplatesGet: UserParcelTemplateSchema,
	userParcelTemplatesCreate: UserParcelTemplateSchema,
	userParcelTemplatesUpdate: UserParcelTemplateSchema,
	userParcelTemplatesDelete: DeletedResponseSchema,
	webhooksList: WebhooksListResponseSchema,
	webhooksGet: WebhookSchema,
	webhooksCreate: WebhookSchema,
	webhooksUpdate: WebhookSchema,
	webhooksDelete: DeletedResponseSchema,
} as const;

export type ShippoEndpointInputs = {
	[K in keyof typeof ShippoEndpointInputSchemas]: z.input<
		(typeof ShippoEndpointInputSchemas)[K]
	>;
};

export type ShippoEndpointOutputs = {
	[K in keyof typeof ShippoEndpointOutputSchemas]: z.infer<
		(typeof ShippoEndpointOutputSchemas)[K]
	>;
};

export type ShippoOperation = keyof typeof ShippoEndpointInputSchemas;
