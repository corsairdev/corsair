import { z } from 'zod';

// Types follow Square's OpenAPI spec (square/connect-api-specification, api.json,
// sha256 8f65460732e1…, Square-Version 2026-09-16).
// Request side: field names, requiredness, bounds and enums are Square's. A body
// goes out as written, so names stay snake_case. `idempotency_key` is required
// exactly where the spec requires it and is never defaulted or generated.

// unknown: Square types this object as free-form (no properties in the spec).
const FreeForm = z.record(z.string(), z.unknown());

// unknown: the spec points at these types but never defines them.
const UnspecifiedObject = z.record(z.string(), z.unknown());

// unknown: objects nested more than 3 levels below a request stay open, and so does the edge
// that closes a cycle (a catalog item holds catalog objects). The levels above
// are fully typed; Square checks what is inside.
const OpenObject = z.record(z.string(), z.unknown());

export const CustomAttributeDefinitionVisibilitySchema = z.enum([
	'VISIBILITY_HIDDEN',
	'VISIBILITY_READ_ONLY',
	'VISIBILITY_READ_WRITE_VALUES',
]);

export const CustomAttributeDefinitionSchema = z.object({
	key: z
		.string()
		.min(1)
		.nullable()
		.describe(
			'The identifier of the custom attribute definition and its corresponding custom attributes.',
		)
		.optional(),
	schema: FreeForm.nullable()
		.describe(
			'The JSON schema for the custom attribute definition, which determines the data type of the corresponding custom attributes. For more information, see Custom Attributes Overview.',
		)
		.optional(),
	name: z
		.string()
		.max(255)
		.nullable()
		.describe(
			'The name of the custom attribute definition for API and seller-facing UI purposes. The name must be unique within the seller and application pair.',
		)
		.optional(),
	description: z
		.string()
		.max(255)
		.nullable()
		.describe(
			'Seller-oriented description of the custom attribute definition, including any constraints that the seller should observe. May be displayed as a tooltip in Square UIs.',
		)
		.optional(),
	visibility: CustomAttributeDefinitionVisibilitySchema.describe(
		'Specifies how the custom attribute definition and its values should be shared with the seller and other applications.',
	).optional(),
	version: z
		.number()
		.int()
		.describe(
			'Read only. The current version of the custom attribute definition. The value is incremented each time the custom attribute definition is updated.',
		)
		.optional(),
	updated_at: z
		.string()
		.describe(
			'The timestamp that indicates when the custom attribute definition was created or most recently updated, in RFC 3339 format.',
		)
		.optional(),
	created_at: z
		.string()
		.describe(
			'The timestamp that indicates when the custom attribute definition was created, in RFC 3339 format.',
		)
		.optional(),
});

export const CustomAttributeSchema = z.object({
	key: z
		.string()
		.min(1)
		.nullable()
		.describe(
			'The identifier of the custom attribute definition and its corresponding custom attributes.',
		)
		.optional(),
	value: FreeForm.nullable()
		.describe(
			"The value assigned to the custom attribute. It is validated against the custom attribute definition's schema on write operations.",
		)
		.optional(),
	version: z
		.number()
		.int()
		.describe(
			'Read only. The current version of the custom attribute. This field is incremented when the custom attribute is changed.',
		)
		.optional(),
	visibility: CustomAttributeDefinitionVisibilitySchema.describe(
		'A copy of the `visibility` field value for the associated custom attribute definition. See CustomAttributeDefinitionVisibility for possible values',
	).optional(),
	definition: CustomAttributeDefinitionSchema.describe(
		'A copy of the associated custom attribute definition object. This field is only set when the optional field is specified on the request.',
	).optional(),
	updated_at: z
		.string()
		.describe(
			'The timestamp that indicates when the custom attribute was created or was most recently updated, in RFC 3339 format.',
		)
		.optional(),
	created_at: z
		.string()
		.describe(
			'The timestamp that indicates when the custom attribute was created, in RFC 3339 format.',
		)
		.optional(),
});

export const BulkUpsertCustomerCustomAttributesRequestCustomerCustomAttributeUpsertRequestSchema =
	z.object({
		customer_id: z
			.string()
			.min(1)
			.describe('The ID of the target customer profile.'),
		custom_attribute: CustomAttributeSchema.describe(
			'The custom attribute to create or update, with following fields:',
		),
		idempotency_key: z
			.string()
			.max(45)
			.nullable()
			.describe(
				'A unique identifier for this individual upsert request, used to ensure idempotency. For more information, see Idempotency.',
			)
			.optional(),
	});

export const BulkUpsertCustomerCustomAttributesRequestSchema = z.object({
	values: z
		.record(
			z.string(),
			BulkUpsertCustomerCustomAttributesRequestCustomerCustomAttributeUpsertRequestSchema,
		)
		.describe('A map containing 1 to 25 individual upsert requests.'),
});

export const BulkUpsertLocationCustomAttributesRequestLocationCustomAttributeUpsertRequestSchema =
	z.object({
		location_id: z.string().min(1).describe('The ID of the target location.'),
		custom_attribute: CustomAttributeSchema.describe(
			'The custom attribute to create or update, with following fields: - `key`. This key must match the `key` of a custom attribute definition in the Square seller account.',
		),
		idempotency_key: z
			.string()
			.max(45)
			.nullable()
			.describe(
				'A unique identifier for this individual upsert request, used to ensure idempotency. For more information, see Idempotency.',
			)
			.optional(),
	});

export const BulkUpsertLocationCustomAttributesRequestSchema = z.object({
	values: z
		.record(
			z.string(),
			BulkUpsertLocationCustomAttributesRequestLocationCustomAttributeUpsertRequestSchema,
		)
		.describe('A map containing 1 to 25 individual upsert requests.'),
});

export const BulkUpsertMerchantCustomAttributesRequestMerchantCustomAttributeUpsertRequestSchema =
	z.object({
		merchant_id: z.string().min(1).describe('The ID of the target merchant.'),
		custom_attribute: CustomAttributeSchema.describe(
			'The custom attribute to create or update, with following fields: - `key`. This key must match the `key` of a custom attribute definition in the Square seller account.',
		),
		idempotency_key: z
			.string()
			.max(45)
			.nullable()
			.describe(
				'A unique identifier for this individual upsert request, used to ensure idempotency. For more information, see Idempotency.',
			)
			.optional(),
	});

export const BulkUpsertMerchantCustomAttributesRequestSchema = z.object({
	values: z
		.record(
			z.string(),
			BulkUpsertMerchantCustomAttributesRequestMerchantCustomAttributeUpsertRequestSchema,
		)
		.describe('A map containing 1 to 25 individual upsert requests.'),
});

export const BulkDeleteCustomersRequestSchema = z.object({
	customer_ids: z
		.array(z.string())
		.describe('The IDs of the customer profiles to delete.'),
});

export const BulkRetrieveChannelsRequestSchema = z.object({
	channel_ids: z.array(z.string()),
});

export const CountrySchema = z.enum([
	'ZZ',
	'AD',
	'AE',
	'AF',
	'AG',
	'AI',
	'AL',
	'AM',
	'AO',
	'AQ',
	'AR',
	'AS',
	'AT',
	'AU',
	'AW',
	'AX',
	'AZ',
	'BA',
	'BB',
	'BD',
	'BE',
	'BF',
	'BG',
	'BH',
	'BI',
	'BJ',
	'BL',
	'BM',
	'BN',
	'BO',
	'BQ',
	'BR',
	'BS',
	'BT',
	'BV',
	'BW',
	'BY',
	'BZ',
	'CA',
	'CC',
	'CD',
	'CF',
	'CG',
	'CH',
	'CI',
	'CK',
	'CL',
	'CM',
	'CN',
	'CO',
	'CR',
	'CU',
	'CV',
	'CW',
	'CX',
	'CY',
	'CZ',
	'DE',
	'DJ',
	'DK',
	'DM',
	'DO',
	'DZ',
	'EC',
	'EE',
	'EG',
	'EH',
	'ER',
	'ES',
	'ET',
	'FI',
	'FJ',
	'FK',
	'FM',
	'FO',
	'FR',
	'GA',
	'GB',
	'GD',
	'GE',
	'GF',
	'GG',
	'GH',
	'GI',
	'GL',
	'GM',
	'GN',
	'GP',
	'GQ',
	'GR',
	'GS',
	'GT',
	'GU',
	'GW',
	'GY',
	'HK',
	'HM',
	'HN',
	'HR',
	'HT',
	'HU',
	'ID',
	'IE',
	'IL',
	'IM',
	'IN',
	'IO',
	'IQ',
	'IR',
	'IS',
	'IT',
	'JE',
	'JM',
	'JO',
	'JP',
	'KE',
	'KG',
	'KH',
	'KI',
	'KM',
	'KN',
	'KP',
	'KR',
	'KW',
	'KY',
	'KZ',
	'LA',
	'LB',
	'LC',
	'LI',
	'LK',
	'LR',
	'LS',
	'LT',
	'LU',
	'LV',
	'LY',
	'MA',
	'MC',
	'MD',
	'ME',
	'MF',
	'MG',
	'MH',
	'MK',
	'ML',
	'MM',
	'MN',
	'MO',
	'MP',
	'MQ',
	'MR',
	'MS',
	'MT',
	'MU',
	'MV',
	'MW',
	'MX',
	'MY',
	'MZ',
	'NA',
	'NC',
	'NE',
	'NF',
	'NG',
	'NI',
	'NL',
	'NO',
	'NP',
	'NR',
	'NU',
	'NZ',
	'OM',
	'PA',
	'PE',
	'PF',
	'PG',
	'PH',
	'PK',
	'PL',
	'PM',
	'PN',
	'PR',
	'PS',
	'PT',
	'PW',
	'PY',
	'QA',
	'RE',
	'RO',
	'RS',
	'RU',
	'RW',
	'SA',
	'SB',
	'SC',
	'SD',
	'SE',
	'SG',
	'SH',
	'SI',
	'SJ',
	'SK',
	'SL',
	'SM',
	'SN',
	'SO',
	'SR',
	'SS',
	'ST',
	'SV',
	'SX',
	'SY',
	'SZ',
	'TC',
	'TD',
	'TF',
	'TG',
	'TH',
	'TJ',
	'TK',
	'TL',
	'TM',
	'TN',
	'TO',
	'TR',
	'TT',
	'TV',
	'TW',
	'TZ',
	'UA',
	'UG',
	'UM',
	'US',
	'UY',
	'UZ',
	'VA',
	'VC',
	'VE',
	'VG',
	'VI',
	'VN',
	'VU',
	'WF',
	'WS',
	'YE',
	'YT',
	'ZA',
	'ZM',
	'ZW',
]);

export const AddressSchema = z.object({
	address_line_1: z
		.string()
		.nullable()
		.describe('The first line of the address.')
		.optional(),
	address_line_2: z
		.string()
		.nullable()
		.describe('The second line of the address, if any.')
		.optional(),
	address_line_3: z
		.string()
		.nullable()
		.describe('The third line of the address, if any.')
		.optional(),
	locality: z
		.string()
		.nullable()
		.describe(
			'The city or town of the address. For a full list of field meanings by country, see Working with Addresses.',
		)
		.optional(),
	sublocality: z
		.string()
		.nullable()
		.describe("A civil region within the address's `locality`, if any.")
		.optional(),
	sublocality_2: z
		.string()
		.nullable()
		.describe("A civil region within the address's `sublocality`, if any.")
		.optional(),
	sublocality_3: z
		.string()
		.nullable()
		.describe("A civil region within the address's `sublocality_2`, if any.")
		.optional(),
	administrative_district_level_1: z
		.string()
		.nullable()
		.describe(
			"A civil entity within the address's country. In the US, this is the state. For a full list of field meanings by country, see Working with Addresses.",
		)
		.optional(),
	administrative_district_level_2: z
		.string()
		.nullable()
		.describe(
			"A civil entity within the address's `administrative_district_level_1`. In the US, this is the county.",
		)
		.optional(),
	administrative_district_level_3: z
		.string()
		.nullable()
		.describe(
			"A civil entity within the address's `administrative_district_level_2`, if any.",
		)
		.optional(),
	postal_code: z
		.string()
		.nullable()
		.describe(
			"The address's postal code. For a full list of field meanings by country, see Working with Addresses.",
		)
		.optional(),
	country: CountrySchema.describe(
		"The address's country, in the two-letter format of ISO 3166. For example, `US` or `FR`. See Country for possible values",
	).optional(),
	first_name: z
		.string()
		.nullable()
		.describe("Optional first name when it's representing recipient.")
		.optional(),
	last_name: z
		.string()
		.nullable()
		.describe("Optional last name when it's representing recipient.")
		.optional(),
});

export const CustomerTaxIdsSchema = z.object({
	eu_vat: z
		.string()
		.max(20)
		.nullable()
		.describe(
			'The EU VAT identification number for the customer. For example, `IE3426675K`. The ID can contain alphanumeric characters only.',
		)
		.optional(),
});

export const BulkUpdateCustomerDataSchema = z.object({
	given_name: z
		.string()
		.max(300)
		.nullable()
		.describe(
			'The given name (that is, the first name) associated with the customer profile.',
		)
		.optional(),
	family_name: z
		.string()
		.max(300)
		.nullable()
		.describe(
			'The family name (that is, the last name) associated with the customer profile.',
		)
		.optional(),
	company_name: z
		.string()
		.max(500)
		.nullable()
		.describe('A business name associated with the customer profile.')
		.optional(),
	nickname: z
		.string()
		.max(100)
		.nullable()
		.describe('A nickname for the customer profile.')
		.optional(),
	email_address: z
		.string()
		.max(254)
		.nullable()
		.describe('The email address associated with the customer profile.')
		.optional(),
	address: AddressSchema.describe(
		'The physical address associated with the customer profile. For maximum length constraints, see Customer addresses.',
	).optional(),
	phone_number: z
		.string()
		.nullable()
		.describe(
			'The phone number associated with the customer profile. The phone number must be valid and can contain 9–16 digits, with an optional `+` prefix and country code.',
		)
		.optional(),
	reference_id: z
		.string()
		.max(100)
		.nullable()
		.describe(
			'An optional second ID used to associate the customer profile with an entity in another system.',
		)
		.optional(),
	note: z
		.string()
		.nullable()
		.describe('An custom note associates with the customer profile.')
		.optional(),
	birthday: z
		.string()
		.nullable()
		.describe(
			'The birthday associated with the customer profile, in `YYYY-MM-DD` or `MM-DD` format. For example, specify `1998-09-21` for September 21, 1998, or `09-21` for September 21.',
		)
		.optional(),
	tax_ids: CustomerTaxIdsSchema.describe(
		'The tax ID associated with the customer profile. This field is available only for customers of sellers in EU countries or the United Kingdom.',
	).optional(),
	version: z
		.number()
		.int()
		.describe('The current version of the customer profile.')
		.optional(),
});

export const BulkUpdateCustomersRequestSchema = z.object({
	customers: z
		.record(z.string(), BulkUpdateCustomerDataSchema)
		.describe(
			'A map of 1 to 100 individual update requests, represented by `customer ID: { customer data }` key-value pairs.',
		),
});

export const OrderSourceSchema = z.object({
	name: z
		.string()
		.nullable()
		.describe(
			'The name used to identify the place (physical or digital) that an order originates. If unset, the name defaults to the name of the application that created the order.',
		)
		.optional(),
});

export const MeasurementUnitAreaSchema = z.enum([
	'IMPERIAL_ACRE',
	'IMPERIAL_SQUARE_INCH',
	'IMPERIAL_SQUARE_FOOT',
	'IMPERIAL_SQUARE_YARD',
	'IMPERIAL_SQUARE_MILE',
	'METRIC_SQUARE_CENTIMETER',
	'METRIC_SQUARE_METER',
	'METRIC_SQUARE_KILOMETER',
]);

export const MeasurementUnitLengthSchema = z.enum([
	'IMPERIAL_INCH',
	'IMPERIAL_FOOT',
	'IMPERIAL_YARD',
	'IMPERIAL_MILE',
	'METRIC_MILLIMETER',
	'METRIC_CENTIMETER',
	'METRIC_METER',
	'METRIC_KILOMETER',
]);

export const MeasurementUnitVolumeSchema = z.enum([
	'GENERIC_FLUID_OUNCE',
	'GENERIC_SHOT',
	'GENERIC_CUP',
	'GENERIC_PINT',
	'GENERIC_QUART',
	'GENERIC_GALLON',
	'IMPERIAL_CUBIC_INCH',
	'IMPERIAL_CUBIC_FOOT',
	'IMPERIAL_CUBIC_YARD',
	'METRIC_MILLILITER',
	'METRIC_LITER',
]);

export const MeasurementUnitWeightSchema = z.enum([
	'IMPERIAL_WEIGHT_OUNCE',
	'IMPERIAL_POUND',
	'IMPERIAL_STONE',
	'METRIC_MILLIGRAM',
	'METRIC_GRAM',
	'METRIC_KILOGRAM',
]);

export const MeasurementUnitGenericSchema = z.enum(['UNIT']);

export const MeasurementUnitTimeSchema = z.enum([
	'GENERIC_MILLISECOND',
	'GENERIC_SECOND',
	'GENERIC_MINUTE',
	'GENERIC_HOUR',
	'GENERIC_DAY',
]);

export const MeasurementUnitUnitTypeSchema = z.enum([
	'TYPE_CUSTOM',
	'TYPE_AREA',
	'TYPE_LENGTH',
	'TYPE_VOLUME',
	'TYPE_WEIGHT',
	'TYPE_GENERIC',
]);

export const MeasurementUnitSchema = z.object({
	custom_unit: OpenObject.describe(
		'A custom unit of measurement defined by the seller using the Point of Sale app or ad-hoc as an order line item.',
	).optional(),
	area_unit: MeasurementUnitAreaSchema.describe(
		'Represents a standard area unit. See MeasurementUnitArea for possible values',
	).optional(),
	length_unit: MeasurementUnitLengthSchema.describe(
		'Represents a standard length unit. See MeasurementUnitLength for possible values',
	).optional(),
	volume_unit: MeasurementUnitVolumeSchema.describe(
		'Represents a standard volume unit. See MeasurementUnitVolume for possible values',
	).optional(),
	weight_unit: MeasurementUnitWeightSchema.describe(
		'Represents a standard unit of weight or mass. See MeasurementUnitWeight for possible values',
	).optional(),
	generic_unit: MeasurementUnitGenericSchema.describe(
		'Reserved for API integrations that lack the ability to specify a real measurement unit See MeasurementUnitGeneric for possible values',
	).optional(),
	time_unit: MeasurementUnitTimeSchema.describe(
		'Represents a standard unit of time. See MeasurementUnitTime for possible values',
	).optional(),
	type: MeasurementUnitUnitTypeSchema.describe(
		'Represents the type of the measurement unit. See MeasurementUnitUnitType for possible values',
	).optional(),
});

export const OrderQuantityUnitSchema = z.object({
	measurement_unit: MeasurementUnitSchema.describe(
		'A MeasurementUnit that represents the unit of measure for the quantity.',
	).optional(),
	precision: z
		.number()
		.int()
		.nullable()
		.describe(
			'For non-integer quantities, represents the number of digits after the decimal point that are recorded for this quantity.',
		)
		.optional(),
	catalog_object_id: z
		.string()
		.nullable()
		.describe('The catalog object ID referencing the CatalogMeasurementUnit.')
		.optional(),
	catalog_version: z
		.number()
		.int()
		.nullable()
		.describe(
			'The version of the catalog object that this measurement unit references.',
		)
		.optional(),
});

export const OrderLineItemItemTypeSchema = z.enum([
	'ITEM',
	'CUSTOM_AMOUNT',
	'GIFT_CARD',
]);

export const CurrencySchema = z.enum([
	'UNKNOWN_CURRENCY',
	'AED',
	'AFN',
	'ALL',
	'AMD',
	'ANG',
	'AOA',
	'ARS',
	'AUD',
	'AWG',
	'AZN',
	'BAM',
	'BBD',
	'BDT',
	'BGN',
	'BHD',
	'BIF',
	'BMD',
	'BND',
	'BOB',
	'BOV',
	'BRL',
	'BSD',
	'BTN',
	'BWP',
	'BYR',
	'BZD',
	'CAD',
	'CDF',
	'CHE',
	'CHF',
	'CHW',
	'CLF',
	'CLP',
	'CNY',
	'COP',
	'COU',
	'CRC',
	'CUC',
	'CUP',
	'CVE',
	'CZK',
	'DJF',
	'DKK',
	'DOP',
	'DZD',
	'EGP',
	'ERN',
	'ETB',
	'EUR',
	'FJD',
	'FKP',
	'GBP',
	'GEL',
	'GHS',
	'GIP',
	'GMD',
	'GNF',
	'GTQ',
	'GYD',
	'HKD',
	'HNL',
	'HRK',
	'HTG',
	'HUF',
	'IDR',
	'ILS',
	'INR',
	'IQD',
	'IRR',
	'ISK',
	'JMD',
	'JOD',
	'JPY',
	'KES',
	'KGS',
	'KHR',
	'KMF',
	'KPW',
	'KRW',
	'KWD',
	'KYD',
	'KZT',
	'LAK',
	'LBP',
	'LKR',
	'LRD',
	'LSL',
	'LTL',
	'LVL',
	'LYD',
	'MAD',
	'MDL',
	'MGA',
	'MKD',
	'MMK',
	'MNT',
	'MOP',
	'MRO',
	'MUR',
	'MVR',
	'MWK',
	'MXN',
	'MXV',
	'MYR',
	'MZN',
	'NAD',
	'NGN',
	'NIO',
	'NOK',
	'NPR',
	'NZD',
	'OMR',
	'PAB',
	'PEN',
	'PGK',
	'PHP',
	'PKR',
	'PLN',
	'PYG',
	'QAR',
	'RON',
	'RSD',
	'RUB',
	'RWF',
	'SAR',
	'SBD',
	'SCR',
	'SDG',
	'SEK',
	'SGD',
	'SHP',
	'SLL',
	'SLE',
	'SOS',
	'SRD',
	'SSP',
	'STD',
	'SVC',
	'SYP',
	'SZL',
	'THB',
	'TJS',
	'TMT',
	'TND',
	'TOP',
	'TRY',
	'TTD',
	'TWD',
	'TZS',
	'UAH',
	'UGX',
	'USD',
	'USN',
	'USS',
	'UYI',
	'UYU',
	'UZS',
	'VEF',
	'VND',
	'VUV',
	'WST',
	'XAF',
	'XAG',
	'XAU',
	'XBA',
	'XBB',
	'XBC',
	'XBD',
	'XCD',
	'XDR',
	'XOF',
	'XPD',
	'XPF',
	'XPT',
	'XTS',
	'XXX',
	'YER',
	'ZAR',
	'ZMK',
	'ZMW',
	'BTC',
	'XUS',
]);

export const MoneySchema = z.object({
	amount: z
		.number()
		.int()
		.nullable()
		.describe(
			'The amount of money, in the smallest denomination of the currency indicated by `currency`. For example, when `currency` is `USD`, `amount` is in cents.',
		)
		.optional(),
	currency: CurrencySchema.describe(
		'The type of currency, in __ISO 4217 format__. For example, the currency code for US dollars is `USD`.',
	).optional(),
});

export const OrderLineItemModifierSchema = z.object({
	uid: z
		.string()
		.max(60)
		.nullable()
		.describe(
			'A unique ID that identifies the modifier only within this order.',
		)
		.optional(),
	catalog_object_id: z
		.string()
		.max(192)
		.nullable()
		.describe('The catalog object ID referencing CatalogModifier.')
		.optional(),
	catalog_version: z
		.number()
		.int()
		.nullable()
		.describe(
			'The version of the catalog object that this modifier references.',
		)
		.optional(),
	name: z
		.string()
		.max(255)
		.nullable()
		.describe('The name of the item modifier.')
		.optional(),
	quantity: z
		.string()
		.nullable()
		.describe(
			'The quantity of the line item modifier. The modifier quantity can be 0 or more. For example, suppose a restaurant offers a cheeseburger on the menu.',
		)
		.optional(),
	base_price_money: MoneySchema.describe(
		'The base price for the modifier.',
	).optional(),
	total_price_money: MoneySchema.describe(
		"The total price of the item modifier for its line item. This is the modifier's `base_price_money` multiplied by the line item's quantity.",
	).optional(),
	metadata: z
		.record(z.string(), z.string())
		.nullable()
		.describe('Application-defined data attached to this order.')
		.optional(),
	parent_modifier_uid: z
		.string()
		.max(60)
		.nullable()
		.describe(
			'The `uid` of the parent modifier, if this modifier is nested under another modifier.',
		)
		.optional(),
});

export const OrderLineItemAppliedTaxSchema = z.object({
	uid: z
		.string()
		.max(60)
		.nullable()
		.describe(
			'A unique ID that identifies the applied tax only within this order.',
		)
		.optional(),
	tax_uid: z
		.string()
		.min(1)
		.max(60)
		.describe(
			'The `uid` of the tax for which this applied tax represents. It must reference a tax present in the `order.taxes` field.',
		),
	applied_money: MoneySchema.describe(
		'The amount of money applied by the tax to the line item.',
	).optional(),
	auto_applied: z
		.boolean()
		.describe(
			'Indicates whether the tax was automatically applied to the order based on the catalog configuration. For an example, see Automatically Apply Taxes to an Order.',
		)
		.optional(),
});

export const OrderLineItemAppliedDiscountSchema = z.object({
	uid: z
		.string()
		.max(60)
		.nullable()
		.describe(
			'A unique ID that identifies the applied discount only within this order.',
		)
		.optional(),
	discount_uid: z
		.string()
		.min(1)
		.max(60)
		.describe(
			'The `uid` of the discount that the applied discount represents. It must reference a discount present in the `order.discounts` field.',
		),
	applied_money: MoneySchema.describe(
		'The amount of money applied by the discount to the line item.',
	).optional(),
});

export const OrderLineItemAppliedServiceChargeSchema = z.object({
	uid: z
		.string()
		.max(60)
		.nullable()
		.describe(
			'A unique ID that identifies the applied service charge only within this order.',
		)
		.optional(),
	service_charge_uid: z
		.string()
		.min(1)
		.max(60)
		.describe(
			'The `uid` of the service charge that the applied service charge represents. It must reference a service charge present in the `order.service_charges` field.',
		),
	applied_money: MoneySchema.describe(
		'The amount of money applied by the service charge to the line item.',
	).optional(),
});

export const OrderLineItemPricingBlocklistsSchema = z.object({
	blocked_discounts: z
		.array(OpenObject)
		.nullable()
		.describe('A list of discounts blocked from applying to the line item.')
		.optional(),
	blocked_taxes: z
		.array(OpenObject)
		.nullable()
		.describe(
			'A list of taxes blocked from applying to the line item. Taxes can be blocked by the `tax_uid` (for ad hoc taxes) or the `tax_catalog_object_id` (for catalog taxes).',
		)
		.optional(),
	blocked_service_charges: z
		.array(OpenObject)
		.nullable()
		.describe(
			'A list of service charges blocked from applying to the line item.',
		)
		.optional(),
});

export const OrderLineItemSchema = z.object({
	uid: z
		.string()
		.max(60)
		.nullable()
		.describe(
			'A unique ID that identifies the line item only within this order.',
		)
		.optional(),
	name: z
		.string()
		.max(512)
		.nullable()
		.describe('The name of the line item.')
		.optional(),
	quantity: z
		.string()
		.min(1)
		.max(12)
		.describe('The count, or measurement, of a line item being purchased:'),
	quantity_unit: OrderQuantityUnitSchema.describe(
		"The measurement unit and decimal precision that this line item's quantity is measured in.",
	).optional(),
	note: z
		.string()
		.max(2000)
		.nullable()
		.describe('An optional note associated with the line item.')
		.optional(),
	catalog_object_id: z
		.string()
		.max(192)
		.nullable()
		.describe('The CatalogItemVariation ID applied to this line item.')
		.optional(),
	catalog_version: z
		.number()
		.int()
		.nullable()
		.describe(
			'The version of the catalog object that this line item references.',
		)
		.optional(),
	variation_name: z
		.string()
		.max(400)
		.nullable()
		.describe('The name of the variation applied to this line item.')
		.optional(),
	item_type: OrderLineItemItemTypeSchema.describe(
		'The type of line item: an itemized sale, a non-itemized sale (custom amount), or the activation or reloading of a gift card. See OrderLineItemItemType for possible values',
	).optional(),
	metadata: z
		.record(z.string(), z.string())
		.nullable()
		.describe('Application-defined data attached to this line item.')
		.optional(),
	modifiers: z
		.array(OrderLineItemModifierSchema)
		.nullable()
		.describe('The CatalogModifiers applied to this line item.')
		.optional(),
	applied_taxes: z
		.array(OrderLineItemAppliedTaxSchema)
		.nullable()
		.describe('The list of references to taxes applied to this line item.')
		.optional(),
	applied_discounts: z
		.array(OrderLineItemAppliedDiscountSchema)
		.nullable()
		.describe('The list of references to discounts applied to this line item.')
		.optional(),
	applied_service_charges: z
		.array(OrderLineItemAppliedServiceChargeSchema)
		.nullable()
		.describe(
			'The list of references to service charges applied to this line item.',
		)
		.optional(),
	base_price_money: MoneySchema.describe(
		'The base price for a single unit of the line item. Note - If inclusive tax is set on this item it will be included in this value.',
	).optional(),
	variation_total_price_money: MoneySchema.describe(
		'The total price of all item variations sold in this line item. The price is calculated as `base_price_money` multiplied by `quantity`. It does not include modifiers.',
	).optional(),
	gross_sales_money: MoneySchema.describe(
		"The amount of money made in gross sales for this line item. The amount is calculated as the sum of the variation's total price and each modifier's total price.",
	).optional(),
	total_tax_money: MoneySchema.describe(
		'The total amount of tax money to collect for the line item.',
	).optional(),
	total_discount_money: MoneySchema.describe(
		'The total amount of discount money to collect for the line item.',
	).optional(),
	total_money: MoneySchema.describe(
		'The total amount of money to collect for this line item.',
	).optional(),
	pricing_blocklists: OrderLineItemPricingBlocklistsSchema.describe(
		'Describes pricing adjustments that are blocked from automatic application to a line item. For more information, see Apply Taxes and Discounts.',
	).optional(),
	total_service_charge_money: MoneySchema.describe(
		'The total amount of apportioned service charge money to collect for the line item.',
	).optional(),
});

export const OrderLineItemTaxTypeSchema = z.enum([
	'UNKNOWN_TAX',
	'ADDITIVE',
	'INCLUSIVE',
]);

export const OrderLineItemTaxScopeSchema = z.enum([
	'OTHER_TAX_SCOPE',
	'LINE_ITEM',
	'ORDER',
]);

export const OrderLineItemTaxSchema = z.object({
	uid: z
		.string()
		.max(60)
		.nullable()
		.describe('A unique ID that identifies the tax only within this order.')
		.optional(),
	catalog_object_id: z
		.string()
		.max(192)
		.nullable()
		.describe('The catalog object ID referencing CatalogTax.')
		.optional(),
	catalog_version: z
		.number()
		.int()
		.nullable()
		.describe('The version of the catalog object that this tax references.')
		.optional(),
	name: z.string().max(255).nullable().describe("The tax's name.").optional(),
	type: OrderLineItemTaxTypeSchema.describe(
		'Indicates the calculation method used to apply the tax. See OrderLineItemTaxType for possible values',
	).optional(),
	percentage: z
		.string()
		.max(10)
		.nullable()
		.describe(
			'The percentage of the tax, as a string representation of a decimal number. For example, a value of `"7.25"` corresponds to a percentage of 7.25%.',
		)
		.optional(),
	metadata: z
		.record(z.string(), z.string())
		.nullable()
		.describe('Application-defined data attached to this tax.')
		.optional(),
	applied_money: MoneySchema.describe(
		'The amount of money applied to the order by the tax.',
	).optional(),
	scope: OrderLineItemTaxScopeSchema.describe(
		'Indicates the level at which the tax applies. For `ORDER` scoped taxes, Square generates references in `applied_taxes` on all order line items that do not have them.',
	).optional(),
	auto_applied: z
		.boolean()
		.describe(
			'Determines whether the tax was automatically applied to the order based on the catalog configuration. For an example, see Automatically Apply Taxes to an Order.',
		)
		.optional(),
});

export const OrderLineItemDiscountTypeSchema = z.enum([
	'UNKNOWN_DISCOUNT',
	'FIXED_PERCENTAGE',
	'FIXED_AMOUNT',
	'VARIABLE_PERCENTAGE',
	'VARIABLE_AMOUNT',
]);

export const OrderLineItemDiscountScopeSchema = z.enum([
	'OTHER_DISCOUNT_SCOPE',
	'LINE_ITEM',
	'ORDER',
]);

export const OrderLineItemDiscountSchema = z.object({
	uid: z
		.string()
		.max(60)
		.nullable()
		.describe(
			'A unique ID that identifies the discount only within this order.',
		)
		.optional(),
	catalog_object_id: z
		.string()
		.max(192)
		.nullable()
		.describe('The catalog object ID referencing CatalogDiscount.')
		.optional(),
	catalog_version: z
		.number()
		.int()
		.nullable()
		.describe(
			'The version of the catalog object that this discount references.',
		)
		.optional(),
	name: z
		.string()
		.max(255)
		.nullable()
		.describe("The discount's name.")
		.optional(),
	type: OrderLineItemDiscountTypeSchema.describe(
		'The type of the discount.',
	).optional(),
	percentage: z
		.string()
		.max(10)
		.nullable()
		.describe(
			'The percentage of the discount, as a string representation of a decimal number. A value of `7.25` corresponds to a percentage of 7.25%.',
		)
		.optional(),
	amount_money: MoneySchema.describe(
		'The total declared monetary amount of the discount.',
	).optional(),
	applied_money: MoneySchema.describe(
		'The amount of discount actually applied to the line item.',
	).optional(),
	metadata: z
		.record(z.string(), z.string())
		.nullable()
		.describe('Application-defined data attached to this discount.')
		.optional(),
	scope: OrderLineItemDiscountScopeSchema.describe(
		'Indicates the level at which the discount applies. For `ORDER` scoped discounts, Square generates references in `applied_discounts` on all order line items that do not have them.',
	).optional(),
	reward_ids: z
		.array(z.string())
		.describe('The reward IDs corresponding to this discount.')
		.optional(),
	pricing_rule_id: z
		.string()
		.describe(
			'The object ID of a pricing rule to be applied automatically to this discount.',
		)
		.optional(),
});

export const OrderServiceChargeCalculationPhaseSchema = z.enum([
	'SUBTOTAL_PHASE',
	'TOTAL_PHASE',
	'APPORTIONED_PERCENTAGE_PHASE',
	'APPORTIONED_AMOUNT_PHASE',
]);

export const OrderServiceChargeTypeSchema = z.enum(['AUTO_GRATUITY', 'CUSTOM']);

export const OrderServiceChargeTreatmentTypeSchema = z.enum([
	'LINE_ITEM_TREATMENT',
	'APPORTIONED_TREATMENT',
]);

export const OrderServiceChargeScopeSchema = z.enum([
	'OTHER_SERVICE_CHARGE_SCOPE',
	'LINE_ITEM',
	'ORDER',
]);

export const OrderServiceChargeSchema = z.object({
	uid: z
		.string()
		.max(60)
		.nullable()
		.describe(
			'A unique ID that identifies the service charge only within this order.',
		)
		.optional(),
	name: z
		.string()
		.max(512)
		.nullable()
		.describe(
			'The name of the service charge. This is unused and null for AUTO_GRATUITY to match the behavior on Bills.',
		)
		.optional(),
	catalog_object_id: z
		.string()
		.max(192)
		.nullable()
		.describe(
			'The catalog object ID referencing the service charge CatalogObject.',
		)
		.optional(),
	catalog_version: z
		.number()
		.int()
		.nullable()
		.describe(
			'The version of the catalog object that this service charge references.',
		)
		.optional(),
	percentage: z
		.string()
		.max(10)
		.nullable()
		.describe(
			'The service charge percentage as a string representation of a decimal number. For example, `"7.25"` indicates a service charge of 7.25%.',
		)
		.optional(),
	amount_money: MoneySchema.describe(
		'The amount of a non-percentage-based service charge.',
	).optional(),
	applied_money: MoneySchema.describe(
		'The amount of money applied to the order by the service charge, including any inclusive tax amounts, as calculated by Square.',
	).optional(),
	total_money: MoneySchema.describe(
		'The total amount of money to collect for the service charge.',
	).optional(),
	total_tax_money: MoneySchema.describe(
		'The total amount of tax money to collect for the service charge.',
	).optional(),
	calculation_phase: OrderServiceChargeCalculationPhaseSchema.describe(
		'The calculation phase at which to apply the service charge. See OrderServiceChargeCalculationPhase for possible values',
	).optional(),
	taxable: z
		.boolean()
		.nullable()
		.describe(
			'Indicates whether the service charge can be taxed. If set to `true`, order-level taxes automatically apply to the service charge.',
		)
		.optional(),
	applied_taxes: z
		.array(OrderLineItemAppliedTaxSchema)
		.nullable()
		.describe(
			'The list of references to the taxes applied to this service charge.',
		)
		.optional(),
	metadata: z
		.record(z.string(), z.string())
		.nullable()
		.describe('Application-defined data attached to this service charge.')
		.optional(),
	type: OrderServiceChargeTypeSchema.describe(
		'The type of the service charge. See OrderServiceChargeType for possible values',
	).optional(),
	treatment_type: OrderServiceChargeTreatmentTypeSchema.describe(
		'Indicates whether the service charge will be treated as a value-holding line item or apportioned toward a line item. See OrderServiceChargeTreatmentType for possible values',
	).optional(),
	scope: OrderServiceChargeScopeSchema.describe(
		'Indicates the level at which the apportioned service charge applies.',
	).optional(),
});

export const FulfillmentTypeSchema = z.enum([
	'PICKUP',
	'SHIPMENT',
	'DELIVERY',
	'IN_STORE',
]);

export const FulfillmentStateSchema = z.enum([
	'PROPOSED',
	'RESERVED',
	'PREPARED',
	'COMPLETED',
	'CANCELED',
	'FAILED',
]);

export const FulfillmentFulfillmentLineItemApplicationSchema = z.enum([
	'ALL',
	'ENTRY_LIST',
]);

export const FulfillmentFulfillmentEntrySchema = z.object({
	uid: z
		.string()
		.max(60)
		.nullable()
		.describe(
			'A unique ID that identifies the fulfillment entry only within this order.',
		)
		.optional(),
	line_item_uid: z
		.string()
		.min(1)
		.describe('The `uid` from the order line item.'),
	quantity: z
		.string()
		.min(1)
		.max(12)
		.describe(
			'The quantity of the line item being fulfilled, formatted as a decimal number. For example, `"3"`.',
		),
	metadata: z
		.record(z.string(), z.string())
		.nullable()
		.describe('Application-defined data attached to this fulfillment entry.')
		.optional(),
});

export const FulfillmentPickupDetailsScheduleTypeSchema = z.enum([
	'SCHEDULED',
	'ASAP',
]);

export const FulfillmentPickupDetailsSchema = z.object({
	recipient: OpenObject.describe(
		'Information about the person to pick up this fulfillment from a physical location.',
	).optional(),
	expires_at: z
		.string()
		.nullable()
		.describe(
			'The timestamp indicating when this fulfillment expires if it is not marked in progress. The timestamp must be in RFC 3339 format (for example, "2016-09-04T23:59:33.123Z").',
		)
		.optional(),
	auto_complete_duration: z
		.string()
		.nullable()
		.describe(
			'The duration after which an in-progress pickup fulfillment is automatically moved to the `COMPLETED` state.',
		)
		.optional(),
	schedule_type: FulfillmentPickupDetailsScheduleTypeSchema.describe(
		'The schedule type of the pickup fulfillment. Defaults to `SCHEDULED`. See FulfillmentPickupDetailsScheduleType for possible values',
	).optional(),
	pickup_at: z
		.string()
		.nullable()
		.describe(
			'The timestamp that represents the start of the pickup window. Must be in RFC 3339 timestamp format, e.g., "2016-09-04T23:59:33.123Z".',
		)
		.optional(),
	pickup_window_duration: z
		.string()
		.nullable()
		.describe(
			'The duration in which the order should be picked up after the `pickup_at` timestamp. The duration must be in RFC 3339 format (for example, "PT30M" for 30 minutes).',
		)
		.optional(),
	prep_time_duration: z
		.string()
		.nullable()
		.describe(
			'The duration needed to prepare this fulfillment. The duration must be in RFC 3339 format (for example, "PT30M" for 30 minutes). Don\'t confuse "M" for months with "M" for minutes.',
		)
		.optional(),
	note: z
		.string()
		.max(500)
		.nullable()
		.describe(
			'A note to provide additional instructions about the pickup fulfillment displayed in the Square Point of Sale application and set by the API.',
		)
		.optional(),
	placed_at: z
		.string()
		.describe(
			'The timestamp indicating when the fulfillment was placed. The timestamp must be in RFC 3339 format (for example, "2016-09-04T23:59:33.123Z").',
		)
		.optional(),
	accepted_at: z
		.string()
		.describe(
			'The timestamp indicating when the fulfillment was marked in progress. The timestamp must be in RFC 3339 format (for example, "2016-09-04T23:59:33.123Z").',
		)
		.optional(),
	rejected_at: z
		.string()
		.describe(
			'The timestamp indicating when the fulfillment was rejected. The timestamp must be in RFC 3339 format (for example, "2016-09-04T23:59:33.123Z").',
		)
		.optional(),
	ready_at: z
		.string()
		.describe(
			'The timestamp indicating when the fulfillment is marked as ready for pickup. The timestamp must be in RFC 3339 format (for example, "2016-09-04T23:59:33.123Z").',
		)
		.optional(),
	expired_at: z
		.string()
		.describe(
			'The timestamp indicating when the fulfillment expired. The timestamp must be in RFC 3339 format (for example, "2016-09-04T23:59:33.123Z").',
		)
		.optional(),
	picked_up_at: z
		.string()
		.describe(
			'The timestamp indicating when the fulfillment was picked up by the recipient. The timestamp must be in RFC 3339 format (for example, "2016-09-04T23:59:33.123Z").',
		)
		.optional(),
	canceled_at: z
		.string()
		.describe(
			'The timestamp indicating when the fulfillment was canceled. The timestamp must be in RFC 3339 format (for example, "2016-09-04T23:59:33.123Z").',
		)
		.optional(),
	cancel_reason: z
		.string()
		.max(100)
		.nullable()
		.describe(
			'A description of why the pickup was canceled. The maximum length: 100 characters.',
		)
		.optional(),
	is_curbside_pickup: z
		.boolean()
		.nullable()
		.describe(
			'If set to `true`, indicates that this pickup order is for curbside pickup, not in-store pickup.',
		)
		.optional(),
	curbside_pickup_details: OpenObject.describe(
		'Specific details for curbside pickup. These details can only be populated if `is_curbside_pickup` is set to `true`.',
	).optional(),
});

export const FulfillmentShipmentDetailsSchema = z.object({
	recipient: OpenObject.describe(
		'Information about the person to receive this shipment fulfillment.',
	).optional(),
	carrier: z
		.string()
		.max(50)
		.nullable()
		.describe(
			'The shipping carrier being used to ship this fulfillment (such as UPS, FedEx, or USPS).',
		)
		.optional(),
	shipping_note: z
		.string()
		.max(500)
		.nullable()
		.describe('A note with additional information for the shipping carrier.')
		.optional(),
	shipping_type: z
		.string()
		.max(255)
		.nullable()
		.describe(
			'A description of the type of shipping product purchased from the carrier (such as First Class, Priority, or Express).',
		)
		.optional(),
	tracking_number: z
		.string()
		.max(100)
		.nullable()
		.describe(
			"The reference number provided by the carrier to track the shipment's progress.",
		)
		.optional(),
	tracking_url: z
		.string()
		.max(2000)
		.nullable()
		.describe("A link to the tracking webpage on the carrier's website.")
		.optional(),
	placed_at: z
		.string()
		.describe(
			'The timestamp indicating when the shipment was requested. The timestamp must be in RFC 3339 format (for example, "2016-09-04T23:59:33.123Z").',
		)
		.optional(),
	in_progress_at: z
		.string()
		.describe(
			'The timestamp indicating when this fulfillment was moved to the `RESERVED` state, which indicates that preparation of this shipment has begun.',
		)
		.optional(),
	packaged_at: z
		.string()
		.describe(
			'The timestamp indicating when this fulfillment was moved to the `PREPARED` state, which indicates that the fulfillment is packaged.',
		)
		.optional(),
	expected_shipped_at: z
		.string()
		.nullable()
		.describe(
			'The timestamp indicating when the shipment is expected to be delivered to the shipping carrier. The timestamp must be in RFC 3339 format (for example, "2016-09-04T23:59:33.123Z").',
		)
		.optional(),
	shipped_at: z
		.string()
		.describe(
			'The timestamp indicating when this fulfillment was moved to the `COMPLETED` state, which indicates that the fulfillment has been given to the shipping carrier.',
		)
		.optional(),
	canceled_at: z
		.string()
		.nullable()
		.describe(
			'The timestamp indicating the shipment was canceled. The timestamp must be in RFC 3339 format (for example, "2016-09-04T23:59:33.123Z").',
		)
		.optional(),
	cancel_reason: z
		.string()
		.max(100)
		.nullable()
		.describe('A description of why the shipment was canceled.')
		.optional(),
	failed_at: z
		.string()
		.describe(
			'The timestamp indicating when the shipment failed to be completed. The timestamp must be in RFC 3339 format (for example, "2016-09-04T23:59:33.123Z").',
		)
		.optional(),
	failure_reason: z
		.string()
		.max(100)
		.nullable()
		.describe('A description of why the shipment failed to be completed.')
		.optional(),
});

export const FulfillmentDeliveryDetailsOrderFulfillmentDeliveryDetailsScheduleTypeSchema =
	z.enum(['SCHEDULED', 'ASAP']);

export const FulfillmentDeliveryDetailsSchema = z.object({
	recipient: OpenObject.describe(
		'The contact information for the person to receive the fulfillment.',
	).optional(),
	schedule_type:
		FulfillmentDeliveryDetailsOrderFulfillmentDeliveryDetailsScheduleTypeSchema.describe(
			'Indicates the fulfillment delivery schedule type. If `SCHEDULED`, then `deliver_at` is required. The default is `SCHEDULED`.',
		).optional(),
	placed_at: z
		.string()
		.describe(
			'The timestamp indicating when the fulfillment was placed. The timestamp must be in RFC 3339 format (for example, "2016-09-04T23:59:33.123Z").',
		)
		.optional(),
	deliver_at: z
		.string()
		.nullable()
		.describe('The timestamp that represents the start of the delivery period.')
		.optional(),
	prep_time_duration: z
		.string()
		.nullable()
		.describe(
			'The duration needed to prepare and deliver this fulfillment. The duration must be in RFC 3339 format (for example, "PT30M" for 30 minutes).',
		)
		.optional(),
	delivery_window_duration: z
		.string()
		.nullable()
		.describe('The duration after `deliver_at` in which to deliver the order.')
		.optional(),
	note: z
		.string()
		.max(550)
		.nullable()
		.describe(
			'Provides additional instructions about the delivery fulfillment. It is displayed in the Square Point of Sale application and set by the API.',
		)
		.optional(),
	completed_at: z
		.string()
		.nullable()
		.describe(
			'The timestamp indicates when the seller completed the fulfillment. This field is automatically set when fulfillment `state` changes to `COMPLETED`.',
		)
		.optional(),
	in_progress_at: z
		.string()
		.describe(
			'The timestamp indicates when the seller started processing the fulfillment. This field is automatically set when the fulfillment `state` changes to `RESERVED`.',
		)
		.optional(),
	rejected_at: z
		.string()
		.describe(
			'The timestamp indicating when the fulfillment was rejected. This field is automatically set when the fulfillment `state` changes to `FAILED`.',
		)
		.optional(),
	ready_at: z
		.string()
		.describe(
			'The timestamp indicating when the seller marked the fulfillment as ready for courier pickup. This field is automatically set when the fulfillment `state` changes to PREPARED.',
		)
		.optional(),
	delivered_at: z
		.string()
		.describe(
			'The timestamp indicating when the fulfillment was delivered to the recipient. The timestamp must be in RFC 3339 format (for example, "2016-09-04T23:59:33.123Z").',
		)
		.optional(),
	canceled_at: z
		.string()
		.describe(
			'The timestamp indicating when the fulfillment was canceled. This field is automatically set when the fulfillment `state` changes to `CANCELED`.',
		)
		.optional(),
	cancel_reason: z
		.string()
		.max(100)
		.nullable()
		.describe('The delivery cancellation reason. Max length: 100 characters.')
		.optional(),
	courier_pickup_at: z
		.string()
		.nullable()
		.describe(
			'The timestamp indicating when an order can be picked up by the courier for delivery. The timestamp must be in RFC 3339 format (for example, "2016-09-04T23:59:33.123Z").',
		)
		.optional(),
	courier_pickup_window_duration: z
		.string()
		.nullable()
		.describe(
			'The duration after `courier_pickup_at` in which the courier should pick up the order. The duration must be in RFC 3339 format (for example, "PT30M" for 30 minutes).',
		)
		.optional(),
	is_no_contact_delivery: z
		.boolean()
		.nullable()
		.describe('Whether the delivery is preferred to be no contact.')
		.optional(),
	dropoff_notes: z
		.string()
		.max(550)
		.nullable()
		.describe(
			'A note to provide additional instructions about how to deliver the order.',
		)
		.optional(),
	courier_provider_name: z
		.string()
		.max(255)
		.nullable()
		.describe('The name of the courier provider.')
		.optional(),
	courier_support_phone_number: z
		.string()
		.max(17)
		.nullable()
		.describe('The support phone number of the courier.')
		.optional(),
	square_delivery_id: z
		.string()
		.max(50)
		.nullable()
		.describe('The identifier for the delivery created by Square.')
		.optional(),
	external_delivery_id: z
		.string()
		.max(50)
		.nullable()
		.describe(
			'The identifier for the delivery created by the third-party courier service.',
		)
		.optional(),
	managed_delivery: z
		.boolean()
		.nullable()
		.describe(
			'The flag to indicate the delivery is managed by a third party (ie DoorDash), which means we may not receive all recipient information for PII purposes.',
		)
		.optional(),
});

export const FulfillmentInStoreDetailsSchema = z.object({
	note: z
		.string()
		.max(550)
		.nullable()
		.describe(
			'A note to provide additional instructions about the in-store fulfillment displayed in the Square Point of Sale application and set by the API.',
		)
		.optional(),
	recipient: OpenObject.describe(
		'Information about the person to receive this in-store fulfillment.',
	).optional(),
	placed_at: z
		.string()
		.nullable()
		.describe(
			'The timestamp indicating when the fulfillment was placed. The timestamp must be in RFC 3339 format (for example, "2016-09-04T23:59:33.123Z").',
		)
		.optional(),
	completed_at: z
		.string()
		.describe(
			'The timestamp indicating when the fulfillment was completed. This field is automatically set when the fulfillment `state` changes to `COMPLETED`.',
		)
		.optional(),
	in_progress_at: z
		.string()
		.describe(
			'The timestamp indicates when the seller started processing the fulfillment. This field is automatically set when the fulfillment `state` changes to `RESERVED`.',
		)
		.optional(),
	prepared_at: z
		.string()
		.describe(
			'The timestamp indicating when the fulfillment was moved to the `PREPARED` state, which indicates that the fulfillment is ready.',
		)
		.optional(),
	canceled_at: z
		.string()
		.describe(
			'The timestamp indicating when the fulfillment was canceled. This field is automatically set when the fulfillment `state` changes to `CANCELED`.',
		)
		.optional(),
});

export const FulfillmentSchema = z.object({
	uid: z
		.string()
		.max(60)
		.nullable()
		.describe(
			'A unique ID that identifies the fulfillment only within this order.',
		)
		.optional(),
	type: FulfillmentTypeSchema.describe(
		'The type of the fulfillment. See FulfillmentType for possible values',
	).optional(),
	state: FulfillmentStateSchema.describe(
		'The state of the fulfillment. See FulfillmentState for possible values',
	).optional(),
	line_item_application:
		FulfillmentFulfillmentLineItemApplicationSchema.describe(
			'Describes what order line items this fulfillment applies to. It can be `ALL` or `ENTRY_LIST` with a supplied list of fulfillment entries.',
		).optional(),
	entries: z
		.array(FulfillmentFulfillmentEntrySchema)
		.describe('A list of entries pertaining to the fulfillment of an order.')
		.optional(),
	metadata: z
		.record(z.string(), z.string())
		.nullable()
		.describe('Application-defined data attached to this fulfillment.')
		.optional(),
	pickup_details: FulfillmentPickupDetailsSchema.describe(
		'Contains details for a pickup fulfillment. These details are required when the fulfillment type is `PICKUP`.',
	).optional(),
	shipment_details: FulfillmentShipmentDetailsSchema.describe(
		'Contains details for a shipment fulfillment. These details are required when the fulfillment type is `SHIPMENT`.',
	).optional(),
	delivery_details: FulfillmentDeliveryDetailsSchema.describe(
		'Describes delivery details of an order fulfillment.',
	).optional(),
	in_store_details: FulfillmentInStoreDetailsSchema.describe(
		'Contains details for an in-store fulfillment. These details are required when the fulfillment type is `IN_STORE`.',
	).optional(),
});

export const OrderReturnLineItemSchema = z.object({
	uid: z
		.string()
		.max(60)
		.nullable()
		.describe('A unique ID for this return line-item entry.')
		.optional(),
	source_line_item_uid: z
		.string()
		.max(60)
		.nullable()
		.describe('The `uid` of the line item in the original sale order.')
		.optional(),
	name: z
		.string()
		.max(512)
		.nullable()
		.describe('The name of the line item.')
		.optional(),
	quantity: z
		.string()
		.min(1)
		.max(12)
		.describe(
			'The quantity returned, formatted as a decimal number. For example, `"3"`.',
		),
	quantity_unit: OrderQuantityUnitSchema.describe(
		"The unit and precision that this return line item's quantity is measured in.",
	).optional(),
	note: z
		.string()
		.max(2000)
		.nullable()
		.describe('The note of the return line item.')
		.optional(),
	catalog_object_id: z
		.string()
		.max(192)
		.nullable()
		.describe('The CatalogItemVariation ID applied to this return line item.')
		.optional(),
	catalog_version: z
		.number()
		.int()
		.nullable()
		.describe(
			'The version of the catalog object that this line item references.',
		)
		.optional(),
	variation_name: z
		.string()
		.max(400)
		.nullable()
		.describe('The name of the variation applied to this return line item.')
		.optional(),
	item_type: OrderLineItemItemTypeSchema.describe(
		'The type of line item: an itemized return, a non-itemized return (custom amount), or the return of an unactivated gift card sale. See OrderLineItemItemType for possible values',
	).optional(),
	return_modifiers: z
		.array(OpenObject)
		.nullable()
		.describe('The CatalogModifiers applied to this line item.')
		.optional(),
	applied_taxes: z
		.array(OrderLineItemAppliedTaxSchema)
		.nullable()
		.describe(
			'The list of references to `OrderReturnTax` entities applied to the return line item.',
		)
		.optional(),
	applied_discounts: z
		.array(OrderLineItemAppliedDiscountSchema)
		.nullable()
		.describe(
			'The list of references to `OrderReturnDiscount` entities applied to the return line item.',
		)
		.optional(),
	base_price_money: MoneySchema.describe(
		'The base price for a single unit of the line item.',
	).optional(),
	variation_total_price_money: MoneySchema.describe(
		'The total price of all item variations returned in this line item. The price is calculated as `base_price_money` multiplied by `quantity` and does not include modifiers.',
	).optional(),
	gross_return_money: MoneySchema.describe(
		'The gross return amount of money calculated as (item base price + modifiers price) * quantity.',
	).optional(),
	total_tax_money: MoneySchema.describe(
		'The total amount of tax money to return for the line item.',
	).optional(),
	total_discount_money: MoneySchema.describe(
		'The total amount of discount money to return for the line item.',
	).optional(),
	total_money: MoneySchema.describe(
		'The total amount of money to return for this line item.',
	).optional(),
	applied_service_charges: z
		.array(OrderLineItemAppliedServiceChargeSchema)
		.nullable()
		.describe(
			'The list of references to `OrderReturnServiceCharge` entities applied to the return line item.',
		)
		.optional(),
	total_service_charge_money: MoneySchema.describe(
		'The total amount of apportioned service charge money to return for the line item.',
	).optional(),
});

export const OrderReturnServiceChargeSchema = z.object({
	uid: z
		.string()
		.max(60)
		.nullable()
		.describe(
			'A unique ID that identifies the return service charge only within this order.',
		)
		.optional(),
	source_service_charge_uid: z
		.string()
		.max(60)
		.nullable()
		.describe(
			'The service charge `uid` from the order containing the original service charge. `source_service_charge_uid` is `null` for unlinked returns.',
		)
		.optional(),
	name: z
		.string()
		.max(255)
		.nullable()
		.describe('The name of the service charge.')
		.optional(),
	catalog_object_id: z
		.string()
		.max(192)
		.nullable()
		.describe('The catalog object ID of the associated OrderServiceCharge.')
		.optional(),
	catalog_version: z
		.number()
		.int()
		.nullable()
		.describe(
			'The version of the catalog object that this service charge references.',
		)
		.optional(),
	percentage: z
		.string()
		.max(10)
		.nullable()
		.describe(
			'The percentage of the service charge, as a string representation of a decimal number. For example, a value of `"7.25"` corresponds to a percentage of 7.25%.',
		)
		.optional(),
	amount_money: MoneySchema.describe(
		'The amount of a non-percentage-based service charge.',
	).optional(),
	applied_money: MoneySchema.describe(
		'The amount of money applied to the order by the service charge, including any inclusive tax amounts, as calculated by Square.',
	).optional(),
	total_money: MoneySchema.describe(
		'The total amount of money to collect for the service charge.',
	).optional(),
	total_tax_money: MoneySchema.describe(
		'The total amount of tax money to collect for the service charge.',
	).optional(),
	calculation_phase: OrderServiceChargeCalculationPhaseSchema.describe(
		'The calculation phase after which to apply the service charge. See OrderServiceChargeCalculationPhase for possible values',
	).optional(),
	taxable: z
		.boolean()
		.nullable()
		.describe(
			'Indicates whether the surcharge can be taxed. Service charges calculated in the `TOTAL_PHASE` cannot be marked as taxable.',
		)
		.optional(),
	applied_taxes: z
		.array(OrderLineItemAppliedTaxSchema)
		.nullable()
		.describe(
			'The list of references to `OrderReturnTax` entities applied to the `OrderReturnServiceCharge`.',
		)
		.optional(),
	treatment_type: OrderServiceChargeTreatmentTypeSchema.describe(
		'Indicates whether the service charge will be treated as a value-holding line item or apportioned toward a line item. See OrderServiceChargeTreatmentType for possible values',
	).optional(),
	scope: OrderServiceChargeScopeSchema.describe(
		'Indicates the level at which the apportioned service charge applies.',
	).optional(),
	type: OrderServiceChargeTypeSchema.describe(
		'The type of the service charge. See OrderServiceChargeType for possible values',
	).optional(),
});

export const OrderReturnTaxSchema = z.object({
	uid: z
		.string()
		.max(60)
		.nullable()
		.describe(
			'A unique ID that identifies the returned tax only within this order.',
		)
		.optional(),
	source_tax_uid: z
		.string()
		.max(60)
		.nullable()
		.describe(
			'The tax `uid` from the order that contains the original tax charge.',
		)
		.optional(),
	catalog_object_id: z
		.string()
		.max(192)
		.nullable()
		.describe('The catalog object ID referencing CatalogTax.')
		.optional(),
	catalog_version: z
		.number()
		.int()
		.nullable()
		.describe('The version of the catalog object that this tax references.')
		.optional(),
	name: z.string().max(255).nullable().describe("The tax's name.").optional(),
	type: OrderLineItemTaxTypeSchema.describe(
		'Indicates the calculation method used to apply the tax. See OrderLineItemTaxType for possible values',
	).optional(),
	percentage: z
		.string()
		.max(10)
		.nullable()
		.describe(
			'The percentage of the tax, as a string representation of a decimal number. For example, a value of `"7.25"` corresponds to a percentage of 7.25%.',
		)
		.optional(),
	applied_money: MoneySchema.describe(
		'The amount of money applied by the tax in an order.',
	).optional(),
	scope: OrderLineItemTaxScopeSchema.describe(
		'Indicates the level at which the `OrderReturnTax` applies. For `ORDER` scoped taxes, Square generates references in `applied_taxes` on all `OrderReturnLineItem`s.',
	).optional(),
});

export const OrderReturnDiscountSchema = z.object({
	uid: z
		.string()
		.max(60)
		.nullable()
		.describe(
			'A unique ID that identifies the returned discount only within this order.',
		)
		.optional(),
	source_discount_uid: z
		.string()
		.max(60)
		.nullable()
		.describe(
			'The discount `uid` from the order that contains the original application of this discount.',
		)
		.optional(),
	catalog_object_id: z
		.string()
		.max(192)
		.nullable()
		.describe('The catalog object ID referencing CatalogDiscount.')
		.optional(),
	catalog_version: z
		.number()
		.int()
		.nullable()
		.describe(
			'The version of the catalog object that this discount references.',
		)
		.optional(),
	name: z
		.string()
		.max(255)
		.nullable()
		.describe("The discount's name.")
		.optional(),
	type: OrderLineItemDiscountTypeSchema.describe(
		'The type of the discount. If it is created by the API, it is `FIXED_PERCENTAGE` or `FIXED_AMOUNT`.',
	).optional(),
	percentage: z
		.string()
		.max(10)
		.nullable()
		.describe(
			'The percentage of the tax, as a string representation of a decimal number. A value of `"7.25"` corresponds to a percentage of 7.25%.',
		)
		.optional(),
	amount_money: MoneySchema.describe(
		'The total declared monetary amount of the discount.',
	).optional(),
	applied_money: MoneySchema.describe(
		'The amount of discount actually applied to this line item.',
	).optional(),
	scope: OrderLineItemDiscountScopeSchema.describe(
		'Indicates the level at which the `OrderReturnDiscount` applies. For `ORDER` scoped discounts, the server generates references in `applied_discounts` on all `OrderReturnLineItem`s.',
	).optional(),
});

export const OrderReturnTipSchema = z.object({
	uid: z
		.string()
		.max(60)
		.nullable()
		.describe('A unique ID that identifies the tip only within this order.')
		.optional(),
	applied_money: MoneySchema.describe(
		'The amount of tip being returned --',
	).optional(),
	source_tender_uid: z
		.string()
		.max(192)
		.nullable()
		.describe(
			'The tender `uid` from the order that contains the original application of this tip.',
		)
		.optional(),
	source_tender_id: z
		.string()
		.max(192)
		.nullable()
		.describe(
			'The tender `id` from the order that contains the original application of this tip.',
		)
		.optional(),
});

export const OrderRoundingAdjustmentSchema = z.object({
	uid: z
		.string()
		.max(60)
		.nullable()
		.describe(
			'A unique ID that identifies the rounding adjustment only within this order.',
		)
		.optional(),
	name: z
		.string()
		.nullable()
		.describe(
			'The name of the rounding adjustment from the original sale order.',
		)
		.optional(),
	amount_money: MoneySchema.describe(
		'The actual rounding adjustment amount.',
	).optional(),
});

export const OrderMoneyAmountsSchema = z.object({
	total_money: MoneySchema.describe('The total money.').optional(),
	tax_money: MoneySchema.describe(
		'The money associated with taxes.',
	).optional(),
	discount_money: MoneySchema.describe(
		'The money associated with discounts.',
	).optional(),
	tip_money: MoneySchema.describe('The money associated with tips.').optional(),
	service_charge_money: MoneySchema.describe(
		'The money associated with service charges.',
	).optional(),
});

export const OrderReturnSchema = z.object({
	uid: z
		.string()
		.max(60)
		.nullable()
		.describe('A unique ID that identifies the return only within this order.')
		.optional(),
	source_order_id: z
		.string()
		.nullable()
		.describe(
			'An order that contains the original sale of these return line items. This is unset for unlinked returns.',
		)
		.optional(),
	return_line_items: z
		.array(OrderReturnLineItemSchema)
		.nullable()
		.describe('A collection of line items that are being returned.')
		.optional(),
	return_service_charges: z
		.array(OrderReturnServiceChargeSchema)
		.nullable()
		.describe('A collection of service charges that are being returned.')
		.optional(),
	return_taxes: z
		.array(OrderReturnTaxSchema)
		.nullable()
		.describe(
			'A collection of references to taxes being returned for an order, including the total applied tax amount to be returned.',
		)
		.optional(),
	return_discounts: z
		.array(OrderReturnDiscountSchema)
		.nullable()
		.describe(
			'A collection of references to discounts being returned for an order, including the total applied discount amount to be returned.',
		)
		.optional(),
	return_tips: z
		.array(OrderReturnTipSchema)
		.nullable()
		.describe('A collection of references to tips being returned for an order.')
		.optional(),
	rounding_adjustment: OrderRoundingAdjustmentSchema.describe(
		'A positive or negative rounding adjustment to the total value being returned.',
	).optional(),
	return_amounts: OrderMoneyAmountsSchema.describe(
		'An aggregate monetary value being returned by this return entry.',
	).optional(),
});

export const TenderTypeSchema = z.enum([
	'CARD',
	'CASH',
	'THIRD_PARTY_CARD',
	'SQUARE_GIFT_CARD',
	'NO_SALE',
	'BANK_ACCOUNT',
	'WALLET',
	'BUY_NOW_PAY_LATER',
	'SQUARE_ACCOUNT',
	'OTHER',
]);

export const TenderCardDetailsStatusSchema = z.enum([
	'AUTHORIZED',
	'CAPTURED',
	'VOIDED',
	'FAILED',
]);

export const CardBrandSchema = z.enum([
	'OTHER_BRAND',
	'VISA',
	'MASTERCARD',
	'AMERICAN_EXPRESS',
	'DISCOVER',
	'DISCOVER_DINERS',
	'JCB',
	'CHINA_UNIONPAY',
	'SQUARE_GIFT_CARD',
	'SQUARE_CAPITAL_CARD',
	'INTERAC',
	'EFTPOS',
	'FELICA',
	'EBT',
	'QUICPAY',
	'ID',
	'TRANSPORTATION_IC',
	'CARNET',
]);

export const CardTypeSchema = z.enum(['UNKNOWN_CARD_TYPE', 'CREDIT', 'DEBIT']);

export const CardPrepaidTypeSchema = z.enum([
	'UNKNOWN_PREPAID_TYPE',
	'NOT_PREPAID',
	'PREPAID',
]);

export const CardCoBrandSchema = z.enum(['UNKNOWN', 'AFTERPAY', 'CLEARPAY']);

export const CardIssuerAlertSchema = z.enum(['ISSUER_ALERT_CARD_CLOSED']);

export const CardSchema = z.object({
	id: z
		.string()
		.max(64)
		.describe('Unique ID for this card. Generated by Square.')
		.optional(),
	card_brand: CardBrandSchema.describe(
		"The card's brand. See CardBrand for possible values",
	).optional(),
	last_4: z
		.string()
		.max(4)
		.describe('The last 4 digits of the card number.')
		.optional(),
	exp_month: z
		.number()
		.int()
		.nullable()
		.describe(
			'The expiration month of the associated card as an integer between 1 and 12.',
		)
		.optional(),
	exp_year: z
		.number()
		.int()
		.nullable()
		.describe("The four-digit year of the card's expiration date.")
		.optional(),
	cardholder_name: z
		.string()
		.max(96)
		.nullable()
		.describe('The name of the cardholder.')
		.optional(),
	billing_address: AddressSchema.describe(
		'The billing address for this card. `US` postal codes can be provided as a 5-digit zip code or 9-digit ZIP+4 (example: `12345-6789`).',
	).optional(),
	fingerprint: z
		.string()
		.max(255)
		.describe(
			'Intended as a Square-assigned identifier, based on the card number, to identify the card across multiple locations within a single application.',
		)
		.optional(),
	customer_id: z
		.string()
		.nullable()
		.describe(
			'**Required** The ID of a customer to be associated with the card.',
		)
		.optional(),
	merchant_id: z
		.string()
		.describe('The ID of the merchant associated with the card.')
		.optional(),
	reference_id: z
		.string()
		.max(128)
		.nullable()
		.describe(
			'An optional user-defined reference ID that associates this card with another entity in an external system. For example, a customer ID from an external customer management system.',
		)
		.optional(),
	enabled: z
		.boolean()
		.describe('Indicates whether or not a card can be used for payments.')
		.optional(),
	card_type: CardTypeSchema.describe(
		'The type of the card. The Card object includes this field only in response to Payments API calls. See CardType for possible values',
	).optional(),
	prepaid_type: CardPrepaidTypeSchema.describe(
		'Indicates whether the card is prepaid or not. See CardPrepaidType for possible values',
	).optional(),
	bin: z
		.string()
		.max(6)
		.describe(
			'The first six digits of the card number, known as the Bank Identification Number (BIN). Only the Payments API returns this field.',
		)
		.optional(),
	created_at: z
		.string()
		.describe(
			'Timestamp for when the card object was created on Square’s servers. In RFC 3339 format, e.g., "2016-09-04T23:59:33.123Z".',
		)
		.optional(),
	disabled_at: z
		.string()
		.describe(
			'Timestamp for when the card object was disabled on Square’s servers. In RFC 3339 format, e.g., "2016-09-04T23:59:33.123Z".',
		)
		.optional(),
	version: z
		.number()
		.int()
		.describe(
			'Current version number of the card. Increments with each card update.',
		)
		.optional(),
	card_co_brand: CardCoBrandSchema.describe(
		"The card's co-brand if available. For example, an Afterpay virtual card would have a co-brand of AFTERPAY. See CardCoBrand for possible values",
	).optional(),
	issuer_alert: CardIssuerAlertSchema.describe(
		'An alert from the issuing bank about the card status. Alerts can indicate whether future charges to the card are likely to fail.',
	).optional(),
	issuer_alert_at: z
		.string()
		.describe(
			'The timestamp of when the current issuer alert was received and processed, in RFC 3339 format.',
		)
		.optional(),
	hsa_fsa: z
		.boolean()
		.describe(
			'Indicates whether the card is linked to a Health Savings Account (HSA) or Flexible Spending Account (FSA), based on the card BIN.',
		)
		.optional(),
});

export const TenderCardDetailsEntryMethodSchema = z.enum([
	'SWIPED',
	'KEYED',
	'EMV',
	'ON_FILE',
	'CONTACTLESS',
]);

export const TenderCardDetailsSchema = z.object({
	status: TenderCardDetailsStatusSchema.describe(
		"The credit card payment's current state (such as `AUTHORIZED` or `CAPTURED`). See TenderCardDetailsStatus for possible values. See TenderCardDetailsStatus for possible values",
	).optional(),
	card: CardSchema.describe(
		"The credit card's non-confidential details.",
	).optional(),
	entry_method: TenderCardDetailsEntryMethodSchema.describe(
		"The method used to enter the card's details for the transaction. See TenderCardDetailsEntryMethod for possible values",
	).optional(),
});

export const TenderCashDetailsSchema = z.object({
	buyer_tendered_money: MoneySchema.describe(
		'The total amount of cash provided by the buyer, before change is given.',
	).optional(),
	change_back_money: MoneySchema.describe(
		'The amount of change returned to the buyer.',
	).optional(),
});

export const TenderBankAccountDetailsStatusSchema = z.enum([
	'PENDING',
	'COMPLETED',
	'FAILED',
]);

export const TenderBankAccountDetailsSchema = z.object({
	status: TenderBankAccountDetailsStatusSchema.describe(
		"The bank account payment's current state.",
	).optional(),
});

export const TenderBuyNowPayLaterDetailsBrandSchema = z.enum([
	'OTHER_BRAND',
	'AFTERPAY',
]);

export const TenderBuyNowPayLaterDetailsStatusSchema = z.enum([
	'AUTHORIZED',
	'CAPTURED',
	'VOIDED',
	'FAILED',
]);

export const TenderBuyNowPayLaterDetailsSchema = z.object({
	buy_now_pay_later_brand: TenderBuyNowPayLaterDetailsBrandSchema.describe(
		'The Buy Now Pay Later brand. See Brand for possible values',
	).optional(),
	status: TenderBuyNowPayLaterDetailsStatusSchema.describe(
		"The buy now pay later payment's current state (such as `AUTHORIZED` or `CAPTURED`). See TenderBuyNowPayLaterDetailsStatus for possible values. See Status for possible values",
	).optional(),
});

export const TenderSquareAccountDetailsStatusSchema = z.enum([
	'AUTHORIZED',
	'CAPTURED',
	'VOIDED',
	'FAILED',
]);

export const TenderSquareAccountDetailsSchema = z.object({
	status: TenderSquareAccountDetailsStatusSchema.describe(
		"The Square Account payment's current state (such as `AUTHORIZED` or `CAPTURED`). See TenderSquareAccountDetailsStatus for possible values. See Status for possible values",
	).optional(),
});

export const AdditionalRecipientSchema = z.object({
	location_id: z
		.string()
		.min(1)
		.max(50)
		.describe(
			'The location ID for a recipient (other than the merchant) receiving a portion of this tender.',
		),
	description: z
		.string()
		.max(100)
		.nullable()
		.describe('The description of the additional recipient.')
		.optional(),
	amount_money: MoneySchema.describe(
		'The amount of money distributed to the recipient.',
	),
	receivable_id: z
		.string()
		.max(192)
		.nullable()
		.describe(
			'The unique ID for the RETIRED `AdditionalRecipientReceivable` object. This field should be empty for any `AdditionalRecipient` objects created after the retirement.',
		)
		.optional(),
});

export const TenderSchema = z.object({
	id: z
		.string()
		.max(192)
		.describe("The tender's unique ID. It is the associated payment ID.")
		.optional(),
	location_id: z
		.string()
		.max(50)
		.nullable()
		.describe("The ID of the transaction's associated location.")
		.optional(),
	transaction_id: z
		.string()
		.max(192)
		.nullable()
		.describe("The ID of the tender's associated transaction.")
		.optional(),
	created_at: z
		.string()
		.max(32)
		.describe(
			'The timestamp for when the tender was created, in RFC 3339 format.',
		)
		.optional(),
	note: z
		.string()
		.max(500)
		.nullable()
		.describe(
			'An optional note associated with the tender at the time of payment.',
		)
		.optional(),
	amount_money: MoneySchema.describe(
		'The total amount of the tender, including `tip_money`.',
	).optional(),
	tip_money: MoneySchema.describe("The tip's amount of the tender.").optional(),
	processing_fee_money: MoneySchema.describe(
		'The amount of any Square processing fees applied to the tender.',
	).optional(),
	customer_id: z
		.string()
		.max(191)
		.nullable()
		.describe(
			"If the tender is associated with a customer or represents a customer's card on file, this is the ID of the associated customer.",
		)
		.optional(),
	type: TenderTypeSchema.describe(
		'The type of tender, such as `CARD` or `CASH`. See TenderType for possible values',
	),
	card_details: TenderCardDetailsSchema.describe(
		'The details of the card tender.',
	).optional(),
	cash_details: TenderCashDetailsSchema.describe(
		'The details of the cash tender.',
	).optional(),
	bank_account_details: TenderBankAccountDetailsSchema.describe(
		'The details of the bank account tender.',
	).optional(),
	buy_now_pay_later_details: TenderBuyNowPayLaterDetailsSchema.describe(
		'The details of a Buy Now Pay Later tender.',
	).optional(),
	square_account_details: TenderSquareAccountDetailsSchema.describe(
		'The details of a Square Account tender.',
	).optional(),
	additional_recipients: z
		.array(AdditionalRecipientSchema)
		.nullable()
		.describe(
			'Additional recipients (other than the merchant) receiving a portion of this tender. For example, fees assessed on the purchase by a third party integration.',
		)
		.optional(),
	payment_id: z
		.string()
		.max(192)
		.nullable()
		.describe(
			'The ID of the Payment that corresponds to this tender. This value is only present for payments created with the v2 Payments API.',
		)
		.optional(),
});

export const RefundStatusSchema = z.enum([
	'PENDING',
	'APPROVED',
	'REJECTED',
	'FAILED',
]);

export const RefundSchema = z.object({
	id: z.string().max(255).describe("The refund's unique ID."),
	location_id: z
		.string()
		.max(50)
		.describe("The ID of the refund's associated location."),
	transaction_id: z
		.string()
		.max(192)
		.nullable()
		.describe('The ID of the transaction that the refunded tender is part of.')
		.optional(),
	tender_id: z
		.string()
		.max(192)
		.nullable()
		.describe('The ID of the refunded tender.')
		.optional(),
	created_at: z
		.string()
		.max(32)
		.describe(
			'The timestamp for when the refund was created, in RFC 3339 format.',
		)
		.optional(),
	reason: z
		.string()
		.max(192)
		.describe('The reason for the refund being issued.'),
	amount_money: MoneySchema.describe(
		'The amount of money refunded to the buyer.',
	),
	status: RefundStatusSchema.describe(
		'The current status of the refund (`PENDING`, `APPROVED`, `REJECTED`, or `FAILED`). See RefundStatus for possible values',
	),
	processing_fee_money: MoneySchema.describe(
		'The amount of Square processing fee money refunded to the *merchant*.',
	).optional(),
	additional_recipients: z
		.array(AdditionalRecipientSchema)
		.nullable()
		.describe(
			'Additional recipients (other than the merchant) receiving a portion of this refund. For example, fees assessed on a refund of a purchase by a third party integration.',
		)
		.optional(),
});

export const OrderStateSchema = z.enum([
	'OPEN',
	'COMPLETED',
	'CANCELED',
	'DRAFT',
]);

export const OrderPricingOptionsSchema = z.object({
	auto_apply_discounts: z
		.boolean()
		.nullable()
		.describe(
			'The option to determine whether pricing rule-based discounts are automatically applied to an order.',
		)
		.optional(),
	auto_apply_taxes: z
		.boolean()
		.nullable()
		.describe(
			'The option to determine whether rule-based taxes are automatically applied to an order when the criteria of the corresponding rules are met.',
		)
		.optional(),
});

export const OrderRewardSchema = z.object({
	id: z.string().min(1).describe('The identifier of the reward.'),
	reward_tier_id: z
		.string()
		.min(1)
		.describe(
			'The identifier of the reward tier corresponding to this reward.',
		),
});

export const OrderSchema = z.object({
	id: z.string().describe("The order's unique ID.").optional(),
	location_id: z
		.string()
		.min(1)
		.describe(
			'The ID of the seller location that this order is associated with.',
		),
	reference_id: z
		.string()
		.max(40)
		.nullable()
		.describe(
			'A client-specified ID to associate an entity in another system with this order.',
		)
		.optional(),
	source: OrderSourceSchema.describe(
		'The latest source details of the order.',
	).optional(),
	customer_id: z
		.string()
		.max(191)
		.nullable()
		.describe('The ID of the customer associated with the order.')
		.optional(),
	line_items: z
		.array(OrderLineItemSchema)
		.nullable()
		.describe('The line items included in the order.')
		.optional(),
	taxes: z
		.array(OrderLineItemTaxSchema)
		.nullable()
		.describe('The list of all taxes associated with the order.')
		.optional(),
	discounts: z
		.array(OrderLineItemDiscountSchema)
		.nullable()
		.describe('The list of all discounts associated with the order.')
		.optional(),
	service_charges: z
		.array(OrderServiceChargeSchema)
		.nullable()
		.describe('A list of service charges applied to the order.')
		.optional(),
	fulfillments: z
		.array(FulfillmentSchema)
		.nullable()
		.describe('Details about order fulfillment.')
		.optional(),
	returns: z
		.array(OrderReturnSchema)
		.describe(
			'A collection of items from sale orders being returned in this one. Normally part of an itemized return or exchange.',
		)
		.optional(),
	return_amounts: OrderMoneyAmountsSchema.describe(
		'The rollup of the returned money amounts.',
	).optional(),
	net_amounts: OrderMoneyAmountsSchema.describe(
		'The net money amounts (sale money - return money).',
	).optional(),
	rounding_adjustment: OrderRoundingAdjustmentSchema.describe(
		'A positive rounding adjustment to the total of the order.',
	).optional(),
	tenders: z
		.array(TenderSchema)
		.describe('The tenders that were used to pay for the order.')
		.optional(),
	refunds: z
		.array(RefundSchema)
		.describe('The refunds that are part of this order.')
		.optional(),
	metadata: z
		.record(z.string(), z.string())
		.nullable()
		.describe('Application-defined data attached to this order.')
		.optional(),
	created_at: z
		.string()
		.describe(
			'The timestamp for when the order was created, at server side, in RFC 3339 format (for example, "2016-09-04T23:59:33.123Z").',
		)
		.optional(),
	updated_at: z
		.string()
		.describe(
			'The timestamp for when the order was last updated, at server side, in RFC 3339 format (for example, "2016-09-04T23:59:33.123Z").',
		)
		.optional(),
	closed_at: z
		.string()
		.describe(
			'The timestamp for when the order reached a terminal state, in RFC 3339 format (for example "2016-09-04T23:59:33.123Z").',
		)
		.optional(),
	state: OrderStateSchema.describe(
		'The current state of the order. See OrderState for possible values',
	).optional(),
	version: z
		.number()
		.int()
		.describe(
			'The version number, which is incremented each time an update is committed to the order.',
		)
		.optional(),
	total_money: MoneySchema.describe(
		'The total amount of money to collect for the order.',
	).optional(),
	total_tax_money: MoneySchema.describe(
		'The total amount of tax money to collect for the order.',
	).optional(),
	total_discount_money: MoneySchema.describe(
		'The total amount of discount money to collect for the order.',
	).optional(),
	total_tip_money: MoneySchema.describe(
		'The total amount of tip money to collect for the order.',
	).optional(),
	total_service_charge_money: MoneySchema.describe(
		'The total amount of money collected in service charges for the order.',
	).optional(),
	ticket_name: z
		.string()
		.max(255)
		.nullable()
		.describe(
			'A short-term identifier for the order (such as a customer first name, table number, or auto-generated order number that resets daily).',
		)
		.optional(),
	pricing_options: OrderPricingOptionsSchema.describe(
		"Pricing options for an order. The options affect how the order's price is calculated.",
	).optional(),
	rewards: z
		.array(OrderRewardSchema)
		.describe('A set-like list of Rewards that have been added to the Order.')
		.optional(),
	net_amount_due_money: MoneySchema.describe(
		'The net amount of money due on the order.',
	).optional(),
});

export const CalculateOrderRequestSchema = z.object({
	order: OrderSchema.describe(
		'The order to be calculated. Expects the entire order, not a sparse update.',
	),
	proposed_rewards: z
		.array(OrderRewardSchema)
		.nullable()
		.describe(
			'Identifies one or more loyalty reward tiers to apply during the order calculation.',
		)
		.optional(),
});

export const CancelInvoiceRequestSchema = z.object({
	version: z
		.number()
		.int()
		.describe(
			'The version of the invoice to cancel. If you do not know the version, you can call GetInvoice or ListInvoices.',
		),
});

export const BulkCreateCustomerDataSchema = z.object({
	given_name: z
		.string()
		.max(300)
		.nullable()
		.describe(
			'The given name (that is, the first name) associated with the customer profile.',
		)
		.optional(),
	family_name: z
		.string()
		.max(300)
		.nullable()
		.describe(
			'The family name (that is, the last name) associated with the customer profile.',
		)
		.optional(),
	company_name: z
		.string()
		.max(500)
		.nullable()
		.describe('A business name associated with the customer profile.')
		.optional(),
	nickname: z
		.string()
		.max(100)
		.nullable()
		.describe('A nickname for the customer profile.')
		.optional(),
	email_address: z
		.string()
		.max(254)
		.nullable()
		.describe('The email address associated with the customer profile.')
		.optional(),
	address: AddressSchema.describe(
		'The physical address associated with the customer profile. For maximum length constraints, see Customer addresses.',
	).optional(),
	phone_number: z
		.string()
		.nullable()
		.describe(
			'The phone number associated with the customer profile. The phone number must be valid and can contain 9–16 digits, with an optional `+` prefix and country code.',
		)
		.optional(),
	reference_id: z
		.string()
		.max(100)
		.nullable()
		.describe(
			'An optional second ID used to associate the customer profile with an entity in another system.',
		)
		.optional(),
	note: z
		.string()
		.nullable()
		.describe('A custom note associated with the customer profile.')
		.optional(),
	birthday: z
		.string()
		.nullable()
		.describe(
			'The birthday associated with the customer profile, in `YYYY-MM-DD` or `MM-DD` format. For example, specify `1998-09-21` for September 21, 1998, or `09-21` for September 21.',
		)
		.optional(),
	tax_ids: CustomerTaxIdsSchema.describe(
		'The tax ID associated with the customer profile. This field is available only for customers of sellers in EU countries or the United Kingdom.',
	).optional(),
});

export const BulkCreateCustomersRequestSchema = z.object({
	customers: z
		.record(z.string(), BulkCreateCustomerDataSchema)
		.describe(
			'A map of 1 to 100 individual create requests, represented by `idempotency key: { customer data }` key-value pairs.',
		),
});

export const CreateCardRequestSchema = z.object({
	idempotency_key: z
		.string()
		.min(1)
		.describe(
			'A unique string that identifies this CreateCard request. Keys can be any valid string and must be unique for every request.',
		),
	source_id: z
		.string()
		.min(1)
		.max(16384)
		.describe(
			'The ID of the source which represents the card information to be stored. This can be a card nonce or a payment id.',
		),
	verification_token: z
		.string()
		.describe('An identifying token generated by Payments.verifyBuyer().')
		.optional(),
	card: CardSchema.describe(
		'Payment details associated with the card to be stored.',
	),
});

export const CreateCustomerRequestSchema = z.object({
	idempotency_key: z
		.string()
		.describe(
			'The idempotency key for the request. For more information, see Idempotency.',
		)
		.optional(),
	given_name: z
		.string()
		.describe(
			'The given name (that is, the first name) associated with the customer profile.',
		)
		.optional(),
	family_name: z
		.string()
		.describe(
			'The family name (that is, the last name) associated with the customer profile.',
		)
		.optional(),
	company_name: z
		.string()
		.describe('A business name associated with the customer profile.')
		.optional(),
	nickname: z
		.string()
		.describe('A nickname for the customer profile.')
		.optional(),
	email_address: z
		.string()
		.describe('The email address associated with the customer profile.')
		.optional(),
	address: AddressSchema.describe(
		'The physical address associated with the customer profile. For maximum length constraints, see Customer addresses.',
	).optional(),
	phone_number: z
		.string()
		.describe(
			'The phone number associated with the customer profile. The phone number must be valid and can contain 9–16 digits, with an optional `+` prefix and country code.',
		)
		.optional(),
	reference_id: z
		.string()
		.describe(
			'An optional second ID used to associate the customer profile with an entity in another system.',
		)
		.optional(),
	note: z
		.string()
		.describe('A custom note associated with the customer profile.')
		.optional(),
	birthday: z
		.string()
		.describe(
			'The birthday associated with the customer profile, in `YYYY-MM-DD` or `MM-DD` format. For example, specify `1998-09-21` for September 21, 1998, or `09-21` for September 21.',
		)
		.optional(),
	tax_ids: CustomerTaxIdsSchema.describe(
		'The tax ID associated with the customer profile. This field is available only for customers of sellers in EU countries or the United Kingdom.',
	).optional(),
});

export const CreateCustomerCustomAttributeDefinitionRequestSchema = z.object({
	custom_attribute_definition: CustomAttributeDefinitionSchema.describe(
		'The custom attribute definition to create.',
	),
	idempotency_key: z
		.string()
		.max(45)
		.describe(
			'A unique identifier for this request, used to ensure idempotency. For more information, see Idempotency.',
		)
		.optional(),
});

export const CustomerGroupSchema = z.object({
	id: z
		.string()
		.max(255)
		.describe('A unique Square-generated ID for the customer group.')
		.optional(),
	name: z.string().describe('The name of the customer group.'),
	created_at: z
		.string()
		.describe(
			'The timestamp when the customer group was created, in RFC 3339 format.',
		)
		.optional(),
	updated_at: z
		.string()
		.describe(
			'The timestamp when the customer group was last updated, in RFC 3339 format.',
		)
		.optional(),
});

export const CreateCustomerGroupRequestSchema = z.object({
	idempotency_key: z
		.string()
		.describe(
			'The idempotency key for the request. For more information, see Idempotency.',
		)
		.optional(),
	group: CustomerGroupSchema.describe('The customer group to create.'),
});

export const DisputeEvidenceTypeSchema = z.enum([
	'GENERIC_EVIDENCE',
	'ONLINE_OR_APP_ACCESS_LOG',
	'AUTHORIZATION_DOCUMENTATION',
	'CANCELLATION_OR_REFUND_DOCUMENTATION',
	'CARDHOLDER_COMMUNICATION',
	'CARDHOLDER_INFORMATION',
	'PURCHASE_ACKNOWLEDGEMENT',
	'DUPLICATE_CHARGE_DOCUMENTATION',
	'PRODUCT_OR_SERVICE_DESCRIPTION',
	'RECEIPT',
	'SERVICE_RECEIVED_DOCUMENTATION',
	'PROOF_OF_DELIVERY_DOCUMENTATION',
	'RELATED_TRANSACTION_DOCUMENTATION',
	'REBUTTAL_EXPLANATION',
	'TRACKING_NUMBER',
]);

export const CreateDisputeEvidenceFileRequestSchema = z.object({
	idempotency_key: z
		.string()
		.min(1)
		.max(45)
		.describe(
			'A unique key identifying the request. For more information, see Idempotency.',
		),
	evidence_type: DisputeEvidenceTypeSchema.describe(
		'The type of evidence you are uploading. See DisputeEvidenceType for possible values',
	).optional(),
	content_type: z
		.string()
		.min(1)
		.max(40)
		.describe(
			'The MIME type of the uploaded file. The type can be image/heic, image/heif, image/jpeg, application/pdf, image/png, or image/tiff.',
		)
		.optional(),
});

export const CreateDisputeEvidenceTextRequestSchema = z.object({
	idempotency_key: z
		.string()
		.min(1)
		.max(45)
		.describe(
			'A unique key identifying the request. For more information, see Idempotency.',
		),
	evidence_type: DisputeEvidenceTypeSchema.describe(
		'The type of evidence you are uploading. See DisputeEvidenceType for possible values',
	).optional(),
	evidence_text: z.string().min(1).max(500).describe('The evidence string.'),
});

export const CreateInvoiceAttachmentRequestSchema = z.object({
	idempotency_key: z
		.string()
		.max(128)
		.describe(
			'A unique string that identifies the `CreateInvoiceAttachment` request. For more information, see Idempotency.',
		)
		.optional(),
	description: z
		.string()
		.max(128)
		.describe('The description of the attachment to display on the invoice.')
		.optional(),
});

export const LocationCapabilitySchema = z.enum([
	'CREDIT_CARD_PROCESSING',
	'AUTOMATIC_TRANSFERS',
	'UNLINKED_REFUNDS',
]);

export const LocationStatusSchema = z.enum(['ACTIVE', 'INACTIVE']);

export const LocationTypeSchema = z.enum(['PHYSICAL', 'MOBILE']);

export const DayOfWeekSchema = z.enum([
	'SUN',
	'MON',
	'TUE',
	'WED',
	'THU',
	'FRI',
	'SAT',
]);

export const BusinessHoursPeriodSchema = z.object({
	day_of_week: DayOfWeekSchema.describe(
		'The day of the week for this time period. See DayOfWeek for possible values',
	).optional(),
	start_local_time: z
		.string()
		.nullable()
		.describe(
			'The start time of a business hours period, specified in local time using partial-time RFC 3339 format. For example, `8:30:00` for a period starting at 8:30 in the morning.',
		)
		.optional(),
	end_local_time: z
		.string()
		.nullable()
		.describe(
			'The end time of a business hours period, specified in local time using partial-time RFC 3339 format. For example, `21:00:00` for a period ending at 9:00 in the evening.',
		)
		.optional(),
});

export const BusinessHoursSchema = z.object({
	periods: z
		.array(BusinessHoursPeriodSchema)
		.nullable()
		.describe(
			'The list of time periods during which the business is open. There can be at most 10 periods per day.',
		)
		.optional(),
});

export const CoordinatesSchema = z.object({
	latitude: z
		.number()
		.nullable()
		.describe('The latitude of the coordinate expressed in degrees.')
		.optional(),
	longitude: z
		.number()
		.nullable()
		.describe('The longitude of the coordinate expressed in degrees.')
		.optional(),
});

export const TaxIdsSchema = z.object({
	eu_vat: z
		.string()
		.describe('The EU VAT number for this location. For example, `IE3426675K`.')
		.optional(),
	fr_siret: z
		.string()
		.describe(
			"The SIRET (Système d'Identification du Répertoire des Entreprises et de leurs Etablissements) number is a 14-digit code issued by the French INSEE. For example, `39922799000021`.",
		)
		.optional(),
	fr_naf: z
		.string()
		.describe(
			'The French government uses the NAF (Nomenclature des Activités Françaises) to display and track economic statistical data.',
		)
		.optional(),
	es_nif: z
		.string()
		.describe(
			'The NIF (Numero de Identificacion Fiscal) number is a nine-character tax identifier used in Spain. If it is present, it has been validated. For example, `73628495A`.',
		)
		.optional(),
	jp_qii: z
		.string()
		.describe(
			'The QII (Qualified Invoice Issuer) number is a 14-character tax identifier used in Japan. For example, `T1234567890123`.',
		)
		.optional(),
});

export const LocationSchema = z.object({
	id: z
		.string()
		.max(32)
		.describe(
			'A short generated string of letters and numbers that uniquely identifies this location instance.',
		)
		.optional(),
	name: z
		.string()
		.max(255)
		.nullable()
		.describe(
			'The name of the location. This information appears in the Seller Dashboard as the nickname. A location name must be unique within a seller account.',
		)
		.optional(),
	address: AddressSchema.describe(
		'The physical address of the location.',
	).optional(),
	timezone: z
		.string()
		.max(30)
		.nullable()
		.describe(
			'The IANA time zone identifier for the time zone of the location. For example, `America/Los_Angeles`.',
		)
		.optional(),
	capabilities: z
		.array(LocationCapabilitySchema)
		.describe(
			'The Square features that are enabled for the location. See LocationCapability for possible values. See LocationCapability for possible values',
		)
		.optional(),
	status: LocationStatusSchema.describe(
		'The status of the location. See LocationStatus for possible values',
	).optional(),
	created_at: z
		.string()
		.min(20)
		.max(25)
		.describe(
			'The time when the location was created, in RFC 3339 format. For more information, see Working with Dates.',
		)
		.optional(),
	merchant_id: z
		.string()
		.max(32)
		.describe('The ID of the merchant that owns the location.')
		.optional(),
	country: CountrySchema.describe(
		'The country of the location, in the two-letter format of ISO 3166. For example, `US` or `JP`.',
	).optional(),
	language_code: z
		.string()
		.min(2)
		.max(5)
		.nullable()
		.describe(
			'The language associated with the location, in BCP 47 format. For more information, see Language Preferences.',
		)
		.optional(),
	currency: CurrencySchema.describe(
		'The currency used for all transactions at this location, in ISO 4217 format. For example, the currency code for US dollars is `USD`. See Currency for possible values.',
	).optional(),
	phone_number: z
		.string()
		.max(17)
		.nullable()
		.describe(
			'The phone number of the location. For example, `+1 855-700-6000`.',
		)
		.optional(),
	business_name: z
		.string()
		.max(255)
		.nullable()
		.describe("The name of the location's overall business.")
		.optional(),
	type: LocationTypeSchema.describe(
		'The type of the location. See LocationType for possible values',
	).optional(),
	website_url: z
		.string()
		.max(255)
		.nullable()
		.describe(
			'The website URL of the location. For example, `https://squareup.com`.',
		)
		.optional(),
	business_hours: BusinessHoursSchema.describe(
		'The hours of operation for the location.',
	).optional(),
	business_email: z
		.string()
		.max(255)
		.nullable()
		.describe(
			'The email address of the location. This can be unique to the location and is not always the email address for the business owner or administrator.',
		)
		.optional(),
	description: z
		.string()
		.max(1024)
		.nullable()
		.describe(
			'The description of the location. For example, `Main Street location`.',
		)
		.optional(),
	twitter_username: z
		.string()
		.min(1)
		.max(15)
		.nullable()
		.describe(
			"The Twitter username of the location without the '@' symbol. For example, `Square`.",
		)
		.optional(),
	instagram_username: z
		.string()
		.min(1)
		.max(30)
		.nullable()
		.describe(
			"The Instagram username of the location without the '@' symbol. For example, `square`.",
		)
		.optional(),
	facebook_url: z
		.string()
		.max(255)
		.nullable()
		.describe(
			"The Facebook profile URL of the location. The URL should begin with 'facebook.com/'. For example, `https://www.facebook.com/square`.",
		)
		.optional(),
	coordinates: CoordinatesSchema.describe(
		'The physical coordinates (latitude and longitude) of the location.',
	).optional(),
	logo_url: z
		.string()
		.max(255)
		.describe('The URL of the logo image for the location.')
		.optional(),
	pos_background_url: z
		.string()
		.max(255)
		.describe('The URL of the Point of Sale background image for the location.')
		.optional(),
	mcc: z
		.string()
		.min(4)
		.max(4)
		.nullable()
		.describe(
			'A four-digit number that describes the kind of goods or services sold at the location. The merchant category code (MCC) of the location as standardized by ISO 18245.',
		)
		.optional(),
	full_format_logo_url: z
		.string()
		.describe('The URL of a full-format logo image for the location.')
		.optional(),
	tax_ids: TaxIdsSchema.describe('The tax IDs for this location.').optional(),
	custom_receipt_text: z
		.string()
		.max(1000)
		.nullable()
		.describe(
			'The custom text that appears on receipts issued for this location. This text can also be configured in the Seller Dashboard (Receipts section).',
		)
		.optional(),
	return_policy: z
		.string()
		.max(1000)
		.nullable()
		.describe(
			'The return policy that appears on receipts issued for this location. This text can also be configured in the Seller Dashboard (Receipts section).',
		)
		.optional(),
});

export const CreateLocationRequestSchema = z.object({
	location: LocationSchema.describe(
		'The initial values of the location being created. The `name` field is required and must be unique within a seller account.',
	).optional(),
});

export const CreateLocationCustomAttributeDefinitionRequestSchema = z.object({
	custom_attribute_definition: CustomAttributeDefinitionSchema.describe(
		'The custom attribute definition to create.',
	),
	idempotency_key: z
		.string()
		.max(45)
		.describe(
			'A unique identifier for this request, used to ensure idempotency. For more information, see Idempotency.',
		)
		.optional(),
});

export const BulkDeleteLocationCustomAttributesRequestLocationCustomAttributeDeleteRequestSchema =
	z.object({
		key: z
			.string()
			.describe(
				'The key of the associated custom attribute definition. Represented as a qualified key if the requesting app is not the definition owner.',
			)
			.optional(),
	});

export const BulkDeleteLocationCustomAttributesRequestSchema = z.object({
	values: z
		.record(
			z.string(),
			BulkDeleteLocationCustomAttributesRequestLocationCustomAttributeDeleteRequestSchema,
		)
		.describe(
			'The data used to update the `CustomAttribute` objects. The keys must be unique and are used to map to the corresponding response.',
		),
});

export const BulkDeleteMerchantCustomAttributesRequestMerchantCustomAttributeDeleteRequestSchema =
	z.object({
		key: z
			.string()
			.describe(
				'The key of the associated custom attribute definition. Represented as a qualified key if the requesting app is not the definition owner.',
			)
			.optional(),
	});

export const BulkDeleteMerchantCustomAttributesRequestSchema = z.object({
	values: z
		.record(
			z.string(),
			BulkDeleteMerchantCustomAttributesRequestMerchantCustomAttributeDeleteRequestSchema,
		)
		.describe(
			'The data used to update the `CustomAttribute` objects. The keys must be unique and are used to map to the corresponding response.',
		),
});

export const ReferenceTypeSchema = z.enum([
	'UNKNOWN_TYPE',
	'LOCATION',
	'FIRST_PARTY_INTEGRATION',
	'OAUTH_APPLICATION',
	'ONLINE_SITE',
	'ONLINE_CHECKOUT',
	'INVOICE',
	'GIFT_CARD',
	'GIFT_CARD_MARKETPLACE',
	'RECURRING_SUBSCRIPTION',
	'ONLINE_BOOKING_FLOW',
	'SQUARE_ASSISTANT',
	'CASH_LOCAL',
	'POINT_OF_SALE',
	'KIOSK',
]);

export const ChannelStatusSchema = z.enum(['ACTIVE', 'INACTIVE']);

export const CustomerSortFieldSchema = z.enum(['DEFAULT', 'CREATED_AT']);

export const SortOrderSchema = z.enum(['DESC', 'ASC']);

export const VisibilityFilterSchema = z.enum(['ALL', 'READ', 'READ_WRITE']);

export const ListPaymentsRequestSortFieldSchema = z.enum([
	'CREATED_AT',
	'OFFLINE_CREATED_AT',
	'UPDATED_AT',
]);

export const BulkRetrieveCustomersRequestSchema = z.object({
	customer_ids: z
		.array(z.string())
		.describe('The IDs of the customer profiles to retrieve.'),
});

export const CustomerCreationSourceSchema = z.enum([
	'OTHER',
	'APPOINTMENTS',
	'COUPON',
	'DELETION_RECOVERY',
	'DIRECTORY',
	'EGIFTING',
	'EMAIL_COLLECTION',
	'FEEDBACK',
	'IMPORT',
	'INVOICES',
	'LOYALTY',
	'MARKETING',
	'MERGE',
	'ONLINE_STORE',
	'INSTANT_PROFILE',
	'TERMINAL',
	'THIRD_PARTY',
	'THIRD_PARTY_IMPORT',
	'UNMERGE_RECOVERY',
]);

export const CustomerInclusionExclusionSchema = z.enum(['INCLUDE', 'EXCLUDE']);

export const CustomerCreationSourceFilterSchema = z.object({
	values: z
		.array(CustomerCreationSourceSchema)
		.nullable()
		.describe(
			'The list of creation sources used as filtering criteria. See CustomerCreationSource for possible values',
		)
		.optional(),
	rule: CustomerInclusionExclusionSchema.describe(
		'Indicates whether a customer profile matching the filter criteria should be included in the result or excluded from the result.',
	).optional(),
});

export const TimeRangeSchema = z.object({
	start_at: z
		.string()
		.nullable()
		.describe(
			'A datetime value in RFC 3339 format indicating when the time range starts.',
		)
		.optional(),
	end_at: z
		.string()
		.nullable()
		.describe(
			'A datetime value in RFC 3339 format indicating when the time range ends.',
		)
		.optional(),
});

export const CustomerTextFilterSchema = z.object({
	exact: z
		.string()
		.nullable()
		.describe(
			'Use the exact filter to select customers whose attributes match exactly the specified query.',
		)
		.optional(),
	fuzzy: z
		.string()
		.nullable()
		.describe(
			'Use the fuzzy filter to select customers whose attributes match the specified query in a fuzzy manner.',
		)
		.optional(),
});

export const FilterValueSchema = z.object({
	all: z
		.array(z.string())
		.nullable()
		.describe(
			'A list of terms that must be present on the field of the resource.',
		)
		.optional(),
	any: z
		.array(z.string())
		.nullable()
		.describe(
			'A list of terms where at least one of them must be present on the field of the resource.',
		)
		.optional(),
	none: z
		.array(z.string())
		.nullable()
		.describe(
			'A list of terms that must not be present on the field the resource',
		)
		.optional(),
});

export const CustomerCustomAttributeFiltersSchema = z.object({
	filters: z
		.array(OpenObject)
		.nullable()
		.describe(
			'The custom attribute filters. Each filter must specify `key` and include the `filter` field with a type-specific filter, the `updated_at` field, or both.',
		)
		.optional(),
});

export const CustomerFilterSchema = z.object({
	creation_source: CustomerCreationSourceFilterSchema.describe(
		'A filter to select customers based on their creation source.',
	).optional(),
	created_at: TimeRangeSchema.describe(
		'A filter to select customers based on when they were created.',
	).optional(),
	updated_at: TimeRangeSchema.describe(
		'A filter to select customers based on when they were last updated.',
	).optional(),
	email_address: CustomerTextFilterSchema.describe(
		'A filter to select customers by their email address visible to the seller. This filter is case-insensitive.',
	).optional(),
	phone_number: CustomerTextFilterSchema.describe(
		'A filter to select customers by their phone numbers visible to the seller.',
	).optional(),
	reference_id: CustomerTextFilterSchema.describe(
		'A filter to select customers by their reference IDs. This filter is case-insensitive.',
	).optional(),
	group_ids: FilterValueSchema.describe(
		'A filter to select customers based on the groups they belong to. Group membership is controlled by sellers and developers.',
	).optional(),
	custom_attribute: CustomerCustomAttributeFiltersSchema.describe(
		'A filter to select customers based on one or more custom attributes. This filter can contain up to 10 custom attribute filters.',
	).optional(),
	segment_ids: FilterValueSchema.describe(
		'A filter to select customers based on the segments they belong to. Segment membership is dynamic and adjusts automatically based on whether customers meet the segment criteria.',
	).optional(),
});

export const CustomerSortSchema = z.object({
	field: CustomerSortFieldSchema.describe(
		'Indicates the fields to use as the sort key, which is either the default set of fields or `created_at`.',
	).optional(),
	order: SortOrderSchema.describe(
		'Indicates the order in which results should be sorted based on the sort field value. Strings use standard alphabetic comparison to determine order.',
	).optional(),
});

export const CustomerQuerySchema = z.object({
	filter: CustomerFilterSchema.describe(
		'The filtering criteria for the search query. A query can contain multiple filters in any combination. Multiple filters are combined as `AND` statements.',
	).optional(),
	sort: CustomerSortSchema.describe(
		'Sorting criteria for query results. The default behavior is to sort customers alphabetically by `given_name` and `family_name`.',
	).optional(),
});

export const SearchCustomersRequestSchema = z.object({
	cursor: z
		.string()
		.describe(
			'Include the pagination cursor in subsequent calls to this endpoint to retrieve the next set of results associated with the original query.',
		)
		.optional(),
	limit: z
		.number()
		.int()
		.min(1)
		.max(100)
		.describe(
			'The maximum number of results to return in a single page. This limit is advisory. The response might contain more or fewer results.',
		)
		.optional(),
	query: CustomerQuerySchema.describe(
		'The filtering and sorting criteria for the search request.',
	).optional(),
	count: z
		.boolean()
		.describe(
			'Indicates whether to return the total count of matching customers in the `count` field of the response.',
		)
		.optional(),
});

export const SearchOrdersStateFilterSchema = z.object({
	states: z
		.array(OrderStateSchema)
		.describe('States to filter for. See OrderState for possible values'),
});

export const SearchOrdersDateTimeFilterSchema = z.object({
	created_at: TimeRangeSchema.describe(
		'The time range for filtering on the `created_at` timestamp. If you use this value, you must set the `sort_field` in the `OrdersSearchSort` object to `CREATED_AT`.',
	).optional(),
	updated_at: TimeRangeSchema.describe(
		'The time range for filtering on the `updated_at` timestamp. If you use this value, you must set the `sort_field` in the `OrdersSearchSort` object to `UPDATED_AT`.',
	).optional(),
	closed_at: TimeRangeSchema.describe(
		'The time range for filtering on the `closed_at` timestamp. If you use this value, you must set the `sort_field` in the `OrdersSearchSort` object to `CLOSED_AT`.',
	).optional(),
});

export const SearchOrdersFulfillmentFilterSchema = z.object({
	fulfillment_types: z
		.array(FulfillmentTypeSchema)
		.nullable()
		.describe(
			'A list of fulfillment types to filter for. The list returns orders if any of its fulfillments match any of the fulfillment types listed in this field.',
		)
		.optional(),
	fulfillment_states: z
		.array(FulfillmentStateSchema)
		.nullable()
		.describe(
			'A list of fulfillment states to filter for. The list returns orders if any of its fulfillments match any of the fulfillment states listed in this field.',
		)
		.optional(),
});

export const SearchOrdersSourceFilterSchema = z.object({
	source_names: z
		.array(z.string())
		.nullable()
		.describe(
			'Filters by the Source `name`. The filter returns any orders with a `source.name` that matches any of the listed source names.',
		)
		.optional(),
});

export const SearchOrdersCustomerFilterSchema = z.object({
	customer_ids: z
		.array(z.string())
		.nullable()
		.describe('A list of customer IDs to filter by.')
		.optional(),
});

export const SearchOrdersFilterSchema = z.object({
	state_filter: SearchOrdersStateFilterSchema.describe(
		'Filter by OrderState.',
	).optional(),
	date_time_filter: SearchOrdersDateTimeFilterSchema.describe(
		'Filter for results within a time range.',
	).optional(),
	fulfillment_filter: SearchOrdersFulfillmentFilterSchema.describe(
		'Filter by the fulfillment type or state.',
	).optional(),
	source_filter: SearchOrdersSourceFilterSchema.describe(
		'Filter by the source of the order.',
	).optional(),
	customer_filter: SearchOrdersCustomerFilterSchema.describe(
		'Filter by customers associated with the order.',
	).optional(),
});

export const SearchOrdersSortFieldSchema = z.enum([
	'CREATED_AT',
	'UPDATED_AT',
	'CLOSED_AT',
]);

export const SearchOrdersSortSchema = z.object({
	sort_field: SearchOrdersSortFieldSchema.describe('The field to sort by.'),
	sort_order: SortOrderSchema.describe(
		'The chronological order in which results are returned. Defaults to `DESC`. See SortOrder for possible values',
	).optional(),
});

export const SearchOrdersQuerySchema = z.object({
	filter: SearchOrdersFilterSchema.describe(
		'Criteria to filter results by.',
	).optional(),
	sort: SearchOrdersSortSchema.describe(
		'Criteria to sort results by.',
	).optional(),
});

export const SearchOrdersRequestSchema = z.object({
	location_ids: z
		.array(z.string())
		.describe(
			'The location IDs for the orders to query. All locations must belong to the same merchant.',
		)
		.optional(),
	cursor: z
		.string()
		.describe(
			'A pagination cursor returned by a previous call to this endpoint. Provide this cursor to retrieve the next set of results for your original query.',
		)
		.optional(),
	query: SearchOrdersQuerySchema.describe(
		'Query conditions used to filter or sort the results. Note that when retrieving additional pages using a cursor, you must use the original query.',
	).optional(),
	limit: z
		.number()
		.int()
		.describe('The maximum number of results to be returned in a single page.')
		.optional(),
	return_entries: z
		.boolean()
		.describe(
			'A Boolean that controls the format of the search results. If `true`, `SearchOrders` returns OrderEntry objects. If `false`, `SearchOrders` returns complete order objects.',
		)
		.optional(),
});

export const TestWebhookSubscriptionRequestSchema = z.object({
	event_type: z
		.string()
		.nullable()
		.describe(
			'The event type that will be used to test the Subscription. The event type must be contained in the list of event types in the Subscription.',
		)
		.optional(),
});

export const UpdateCustomerRequestSchema = z.object({
	given_name: z
		.string()
		.nullable()
		.describe(
			'The given name (that is, the first name) associated with the customer profile.',
		)
		.optional(),
	family_name: z
		.string()
		.nullable()
		.describe(
			'The family name (that is, the last name) associated with the customer profile.',
		)
		.optional(),
	company_name: z
		.string()
		.nullable()
		.describe('A business name associated with the customer profile.')
		.optional(),
	nickname: z
		.string()
		.nullable()
		.describe('A nickname for the customer profile.')
		.optional(),
	email_address: z
		.string()
		.nullable()
		.describe('The email address associated with the customer profile.')
		.optional(),
	address: AddressSchema.describe(
		'The physical address associated with the customer profile. Only new or changed fields are required in the request.',
	).optional(),
	phone_number: z
		.string()
		.nullable()
		.describe(
			'The phone number associated with the customer profile. The phone number must be valid and can contain 9–16 digits, with an optional `+` prefix and country code.',
		)
		.optional(),
	reference_id: z
		.string()
		.nullable()
		.describe(
			'An optional second ID used to associate the customer profile with an entity in another system.',
		)
		.optional(),
	note: z
		.string()
		.nullable()
		.describe('A custom note associated with the customer profile.')
		.optional(),
	birthday: z
		.string()
		.nullable()
		.describe(
			'The birthday associated with the customer profile, in `YYYY-MM-DD` or `MM-DD` format. For example, specify `1998-09-21` for September 21, 1998, or `09-21` for September 21.',
		)
		.optional(),
	version: z
		.number()
		.int()
		.describe('The current version of the customer profile.')
		.optional(),
	tax_ids: CustomerTaxIdsSchema.describe(
		'The tax ID associated with the customer profile. This field is available only for customers of sellers in EU countries or the United Kingdom.',
	).optional(),
});

export const UpdateCustomerCustomAttributeDefinitionRequestSchema = z.object({
	custom_attribute_definition: CustomAttributeDefinitionSchema.describe(
		'The custom attribute definition that contains the fields to update. This endpoint supports sparse updates, so only new or changed fields need to be included in the request.',
	),
	idempotency_key: z
		.string()
		.max(45)
		.nullable()
		.describe(
			'A unique identifier for this request, used to ensure idempotency. For more information, see Idempotency.',
		)
		.optional(),
});

export const UpdateCustomerGroupRequestSchema = z.object({
	group: CustomerGroupSchema.describe(
		'The `CustomerGroup` object including all the updates you want to make.',
	),
});

export const UpdateLocationRequestSchema = z.object({
	location: LocationSchema.describe(
		'The `Location` object with only the fields to update.',
	).optional(),
});

export const UpdateLocationCustomAttributeDefinitionRequestSchema = z.object({
	custom_attribute_definition: CustomAttributeDefinitionSchema.describe(
		'The custom attribute definition that contains the fields to update. This endpoint supports sparse updates, so only new or changed fields need to be included in the request.',
	),
	idempotency_key: z
		.string()
		.max(45)
		.nullable()
		.describe(
			'A unique identifier for this request, used to ensure idempotency. For more information, see Idempotency.',
		)
		.optional(),
});

export const UpdateMerchantCustomAttributeDefinitionRequestSchema = z.object({
	custom_attribute_definition: CustomAttributeDefinitionSchema.describe(
		'The custom attribute definition that contains the fields to update. This endpoint supports sparse updates, so only new or changed fields need to be included in the request.',
	),
	idempotency_key: z
		.string()
		.max(45)
		.nullable()
		.describe(
			'A unique identifier for this request, used to ensure idempotency. For more information, see Idempotency.',
		)
		.optional(),
});

export const CheckoutLocationSettingsPolicySchema = z.object({
	uid: z
		.string()
		.nullable()
		.describe(
			'A unique ID to identify the policy when making changes. You must set the UID for policy updates, but it’s optional when setting new policies.',
		)
		.optional(),
	title: z
		.string()
		.max(50)
		.nullable()
		.describe(
			'The title of the policy. This is required when setting the description, though you can update it in a different request.',
		)
		.optional(),
	description: z
		.string()
		.max(4096)
		.nullable()
		.describe('The description of the policy.')
		.optional(),
});

export const CheckoutLocationSettingsBrandingHeaderTypeSchema = z.enum([
	'BUSINESS_NAME',
	'FRAMED_LOGO',
	'FULL_WIDTH_LOGO',
]);

export const CheckoutLocationSettingsBrandingButtonShapeSchema = z.enum([
	'SQUARED',
	'ROUNDED',
	'PILL',
]);

export const CheckoutLocationSettingsBrandingSchema = z.object({
	header_type: CheckoutLocationSettingsBrandingHeaderTypeSchema.describe(
		'Show the location logo on the checkout page. See HeaderType for possible values',
	).optional(),
	button_color: z
		.string()
		.min(7)
		.max(7)
		.nullable()
		.describe(
			'The HTML-supported hex color for the button on the checkout page (for example, "#FFFFFF").',
		)
		.optional(),
	button_shape: CheckoutLocationSettingsBrandingButtonShapeSchema.describe(
		'The shape of the button on the checkout page. See ButtonShape for possible values',
	).optional(),
});

export const CheckoutLocationSettingsTippingSchema = z.object({
	percentages: z
		.array(z.number().int())
		.nullable()
		.describe(
			'Set three custom percentage amounts that buyers can select at checkout. If Smart Tip is enabled, this only applies to transactions totaling $10 or more.',
		)
		.optional(),
	smart_tipping_enabled: z
		.boolean()
		.nullable()
		.describe(
			'Enables Smart Tip Amounts. If Smart Tip Amounts is enabled, tipping works as follows: If a transaction is less than $10, the available tipping options include No Tip, $1, $2, or $…',
		)
		.optional(),
	default_percent: z
		.number()
		.int()
		.nullable()
		.describe(
			'Set the pre-selected percentage amounts that appear at checkout. If Smart Tip is enabled, this only applies to transactions totaling $10 or more.',
		)
		.optional(),
	smart_tips: z
		.array(MoneySchema)
		.nullable()
		.describe('Show the Smart Tip Amounts for this location.')
		.optional(),
	default_smart_tip: MoneySchema.describe(
		'Set the pre-selected whole amount that appears at checkout when Smart Tip is enabled and the transaction amount is less than $10.',
	).optional(),
});

export const CheckoutLocationSettingsCouponsSchema = z.object({
	enabled: z
		.boolean()
		.nullable()
		.describe('Indicates whether coupons are enabled for this location.')
		.optional(),
});

export const CheckoutLocationSettingsSchema = z.object({
	location_id: z
		.string()
		.nullable()
		.describe('The ID of the location that these settings apply to.')
		.optional(),
	customer_notes_enabled: z
		.boolean()
		.nullable()
		.describe(
			'Indicates whether customers are allowed to leave notes at checkout.',
		)
		.optional(),
	policies: z
		.array(CheckoutLocationSettingsPolicySchema)
		.nullable()
		.describe(
			'Policy information is displayed at the bottom of the checkout pages. You can set a maximum of two policies.',
		)
		.optional(),
	branding: CheckoutLocationSettingsBrandingSchema.describe(
		'The branding settings for this location.',
	).optional(),
	tipping: CheckoutLocationSettingsTippingSchema.describe(
		'The tip settings for this location.',
	).optional(),
	coupons: CheckoutLocationSettingsCouponsSchema.describe(
		'The coupon settings for this location.',
	).optional(),
	updated_at: z
		.string()
		.describe(
			'The timestamp when the settings were last updated, in RFC 3339 format.',
		)
		.optional(),
});

export const UpdateLocationSettingsRequestSchema = z.object({
	location_settings: CheckoutLocationSettingsSchema.describe(
		'Describe your updates using the `location_settings` object. Make sure it contains only the fields that have changed.',
	),
});

export const UpdateOrderRequestSchema = z.object({
	order: OrderSchema.describe(
		'The sparse order containing only the fields to update and the version to which the update is being applied.',
	).optional(),
	fields_to_clear: z
		.array(z.string())
		.nullable()
		.describe(
			'The dot notation paths fields to clear. For example, `line_items[uid].note`. For more information, see Deleting fields.',
		)
		.optional(),
	idempotency_key: z
		.string()
		.max(192)
		.nullable()
		.describe(
			'A value you specify that uniquely identifies this update request.',
		)
		.optional(),
});

export const WebhookSubscriptionSchema = z.object({
	id: z
		.string()
		.max(64)
		.describe('A Square-generated unique ID for the subscription.')
		.optional(),
	name: z
		.string()
		.max(64)
		.nullable()
		.describe('The name of this subscription.')
		.optional(),
	enabled: z
		.boolean()
		.nullable()
		.describe(
			'Indicates whether the subscription is enabled (`true`) or not (`false`).',
		)
		.optional(),
	event_types: z
		.array(z.string())
		.nullable()
		.describe('The event types associated with this subscription.')
		.optional(),
	notification_url: z
		.string()
		.nullable()
		.describe('The URL to which webhooks are sent.')
		.optional(),
	api_version: z
		.string()
		.nullable()
		.describe(
			'The API version of the subscription. This field is optional for `CreateWebhookSubscription`. The value defaults to the API version used by the application.',
		)
		.optional(),
	signature_key: z
		.string()
		.describe(
			'The Square-generated signature key used to validate the origin of the webhook event.',
		)
		.optional(),
	created_at: z
		.string()
		.describe(
			'The timestamp of when the subscription was created, in RFC 3339 format. For example, "2016-09-04T23:59:33.123Z".',
		)
		.optional(),
	updated_at: z
		.string()
		.describe(
			'The timestamp of when the subscription was last updated, in RFC 3339 format. For example, "2016-09-04T23:59:33.123Z".',
		)
		.optional(),
});

export const UpdateWebhookSubscriptionRequestSchema = z.object({
	subscription: WebhookSubscriptionSchema.describe(
		'The Subscription to update.',
	).optional(),
});

export const UpdateWebhookSubscriptionSignatureKeyRequestSchema = z.object({
	idempotency_key: z
		.string()
		.max(45)
		.nullable()
		.describe(
			'A unique string that identifies the UpdateWebhookSubscriptionSignatureKey request.',
		)
		.optional(),
});

export const UpsertCustomerCustomAttributeRequestSchema = z.object({
	custom_attribute: CustomAttributeSchema.describe(
		'The custom attribute to create or update, with the following fields:',
	),
	idempotency_key: z
		.string()
		.max(45)
		.nullable()
		.describe(
			'A unique identifier for this request, used to ensure idempotency. For more information, see Idempotency.',
		)
		.optional(),
});

export const UpsertLocationCustomAttributeRequestSchema = z.object({
	custom_attribute: CustomAttributeSchema.describe(
		'The custom attribute to create or update, with the following fields: - `value`. This value must conform to the `schema` specified by the definition.',
	),
	idempotency_key: z
		.string()
		.max(45)
		.nullable()
		.describe(
			'A unique identifier for this request, used to ensure idempotency. For more information, see Idempotency.',
		)
		.optional(),
});

export const UpsertMerchantCustomAttributeRequestSchema = z.object({
	custom_attribute: CustomAttributeSchema.describe(
		'The custom attribute to create or update, with the following fields: - `value`. This value must conform to the `schema` specified by the definition.',
	),
	idempotency_key: z
		.string()
		.max(45)
		.nullable()
		.describe(
			'A unique identifier for this request, used to ensure idempotency. For more information, see Idempotency.',
		)
		.optional(),
});

export const CashPaymentDetailsSchema = z.object({
	buyer_supplied_money: MoneySchema.describe(
		'The amount and currency of the money supplied by the buyer.',
	),
	change_back_money: MoneySchema.describe(
		'The amount of change due back to the buyer. This read-only field is calculated from the `amount_money` and `buyer_supplied_money` fields.',
	).optional(),
});

export const ExternalPaymentDetailsSchema = z.object({
	type: z
		.string()
		.max(50)
		.describe(
			'The type of external payment the seller received. It can be one of the following: - CHECK - Paid using a physical check. - BANK_TRANSFER - Paid using external bank transfer.',
		),
	source: z
		.string()
		.max(255)
		.describe(
			'A description of the external payment source. For example, "Food Delivery Service".',
		),
	source_id: z
		.string()
		.max(255)
		.nullable()
		.describe('An ID to associate the payment to its originating source.')
		.optional(),
	source_fee_money: MoneySchema.describe(
		'The fees paid to the source. The `amount_money` minus this field is the net amount seller receives.',
	).optional(),
});

export const CustomerDetailsSchema = z.object({
	customer_initiated: z
		.boolean()
		.nullable()
		.describe('Indicates whether the customer initiated the payment.')
		.optional(),
	seller_keyed_in: z
		.boolean()
		.nullable()
		.describe(
			'Indicates that the seller keyed in payment details on behalf of the customer. This is used to flag a payment as Mail Order / Telephone Order (MOTO).',
		)
		.optional(),
});

export const OfflinePaymentDetailsSchema = z.object({
	client_created_at: z
		.string()
		.max(32)
		.describe(
			'The client-side timestamp of when the offline payment was created, in RFC 3339 format.',
		)
		.optional(),
});

export const CreatePaymentRequestSchema = z.object({
	source_id: z
		.string()
		.min(1)
		.describe('The ID for the source of funds for this payment.'),
	idempotency_key: z
		.string()
		.min(1)
		.max(45)
		.describe(
			'A unique string that identifies this `CreatePayment` request. Keys can be any valid string but must be unique for every `CreatePayment` request.',
		),
	amount_money: MoneySchema.describe(
		'The amount of money to accept for this payment, not including `tip_money`.',
	).optional(),
	tip_money: MoneySchema.describe(
		'The amount designated as a tip, in addition to `amount_money`.',
	).optional(),
	app_fee_money: MoneySchema.describe(
		'The amount of money that the developer is taking as a fee for facilitating the payment on behalf of the seller.',
	).optional(),
	app_fee_allocations: z
		.array(UnspecifiedObject)
		.describe(
			'Details pertaining to recipients of the application fee. The sum of the amounts in the app_fee_allocations must equal the app_fee_money amount, if present.',
		)
		.optional(),
	delay_duration: z
		.string()
		.describe(
			"The duration of time after the payment's creation when Square automatically either completes or cancels the payment depending on the `delay_action` field value.",
		)
		.optional(),
	delay_action: z
		.string()
		.describe(
			'The action to be applied to the payment when the `delay_duration` has elapsed. The action must be CANCEL or COMPLETE. For more information, see Time Threshold.',
		)
		.optional(),
	autocomplete: z
		.boolean()
		.describe('If set to `true`, this payment will be completed when possible.')
		.optional(),
	order_id: z
		.string()
		.describe('Associates a previously created order with this payment.')
		.optional(),
	customer_id: z
		.string()
		.describe('The Customer ID of the customer associated with the payment.')
		.optional(),
	location_id: z
		.string()
		.describe(
			'The location ID to associate with the payment. If not specified, the main location is used.',
		)
		.optional(),
	team_member_id: z
		.string()
		.describe('An optional TeamMember ID to associate with this payment.')
		.optional(),
	reference_id: z
		.string()
		.max(40)
		.describe('A user-defined ID to associate with the payment.')
		.optional(),
	verification_token: z
		.string()
		.describe('An identifying token generated by payments.verifyBuyer().')
		.optional(),
	accept_partial_authorization: z
		.boolean()
		.describe(
			'If set to `true` and charging a Square Gift Card, a payment might be returned with `amount_money` equal to less than what was requested.',
		)
		.optional(),
	buyer_email_address: z
		.string()
		.max(255)
		.describe("The buyer's email address.")
		.optional(),
	buyer_phone_number: z
		.string()
		.describe(
			"The buyer's phone number. Must follow the following format: 1. A leading + symbol (followed by a country code) 2.",
		)
		.optional(),
	billing_address: AddressSchema.describe(
		"The buyer's billing address.",
	).optional(),
	shipping_address: AddressSchema.describe(
		"The buyer's shipping address.",
	).optional(),
	note: z
		.string()
		.max(500)
		.describe(
			'An optional note to be entered by the developer when creating a payment.',
		)
		.optional(),
	statement_description_identifier: z
		.string()
		.max(20)
		.describe(
			"Optional additional payment information to include on the customer's card statement as part of the statement description.",
		)
		.optional(),
	cash_details: CashPaymentDetailsSchema.describe(
		'Additional details required when recording a cash payment (`source_id` is CASH).',
	).optional(),
	external_details: ExternalPaymentDetailsSchema.describe(
		'Additional details required when recording an external payment (`source_id` is EXTERNAL).',
	).optional(),
	customer_details: CustomerDetailsSchema.describe(
		'Details about the customer making the payment.',
	).optional(),
	offline_payment_details: OfflinePaymentDetailsSchema.describe(
		'An optional field for specifying the offline payment details. This is intended for internal 1st-party callers only.',
	).optional(),
});

export const ProcessingFeeSchema = z.object({
	effective_at: z
		.string()
		.nullable()
		.describe('The timestamp of when the fee takes effect, in RFC 3339 format.')
		.optional(),
	type: z
		.string()
		.nullable()
		.describe(
			'The type of fee assessed or adjusted. The fee type can be `INITIAL` or `ADJUSTMENT`.',
		)
		.optional(),
	amount_money: MoneySchema.describe(
		'The fee amount, which might be negative, that is assessed or adjusted by Square.',
	).optional(),
});

export const DeviceDetailsSchema = z.object({
	device_id: z
		.string()
		.max(255)
		.nullable()
		.describe('The Square-issued ID of the device.')
		.optional(),
	device_installation_id: z
		.string()
		.max(255)
		.nullable()
		.describe('The Square-issued installation ID for the device.')
		.optional(),
	device_name: z
		.string()
		.max(255)
		.nullable()
		.describe('The name of the device set by the seller.')
		.optional(),
});

export const CardPaymentTimelineSchema = z.object({
	authorized_at: z
		.string()
		.nullable()
		.describe(
			'The timestamp when the payment was authorized, in RFC 3339 format.',
		)
		.optional(),
	captured_at: z
		.string()
		.nullable()
		.describe(
			'The timestamp when the payment was captured, in RFC 3339 format.',
		)
		.optional(),
	voided_at: z
		.string()
		.nullable()
		.describe('The timestamp when the payment was voided, in RFC 3339 format.')
		.optional(),
});

export const ErrorCategorySchema = z.enum([
	'API_ERROR',
	'AUTHENTICATION_ERROR',
	'INVALID_REQUEST_ERROR',
	'RATE_LIMIT_ERROR',
	'PAYMENT_METHOD_ERROR',
	'REFUND_ERROR',
	'MERCHANT_SUBSCRIPTION_ERROR',
	'EXTERNAL_VENDOR_ERROR',
]);

export const ErrorCodeSchema = z.enum([
	'INTERNAL_SERVER_ERROR',
	'UNAUTHORIZED',
	'ACCESS_TOKEN_EXPIRED',
	'ACCESS_TOKEN_REVOKED',
	'CLIENT_DISABLED',
	'FORBIDDEN',
	'INSUFFICIENT_SCOPES',
	'APPLICATION_DISABLED',
	'V1_APPLICATION',
	'V1_ACCESS_TOKEN',
	'CARD_PROCESSING_NOT_ENABLED',
	'MERCHANT_SUBSCRIPTION_NOT_FOUND',
	'BAD_REQUEST',
	'MISSING_REQUIRED_PARAMETER',
	'INCORRECT_TYPE',
	'INVALID_TIME',
	'INVALID_TIME_RANGE',
	'INVALID_VALUE',
	'INVALID_CURSOR',
	'UNKNOWN_QUERY_PARAMETER',
	'CONFLICTING_PARAMETERS',
	'EXPECTED_JSON_BODY',
	'INVALID_SORT_ORDER',
	'VALUE_REGEX_MISMATCH',
	'VALUE_TOO_SHORT',
	'VALUE_TOO_LONG',
	'VALUE_TOO_LOW',
	'VALUE_TOO_HIGH',
	'VALUE_EMPTY',
	'ARRAY_LENGTH_TOO_LONG',
	'ARRAY_LENGTH_TOO_SHORT',
	'ARRAY_EMPTY',
	'EXPECTED_BOOLEAN',
	'EXPECTED_INTEGER',
	'EXPECTED_FLOAT',
	'EXPECTED_STRING',
	'EXPECTED_OBJECT',
	'EXPECTED_ARRAY',
	'EXPECTED_MAP',
	'EXPECTED_BASE64_ENCODED_BYTE_ARRAY',
	'INVALID_ARRAY_VALUE',
	'INVALID_ENUM_VALUE',
	'INVALID_CONTENT_TYPE',
	'INVALID_FORM_VALUE',
	'CUSTOMER_NOT_FOUND',
	'ONE_INSTRUMENT_EXPECTED',
	'NO_FIELDS_SET',
	'TOO_MANY_MAP_ENTRIES',
	'MAP_KEY_LENGTH_TOO_SHORT',
	'MAP_KEY_LENGTH_TOO_LONG',
	'CUSTOMER_MISSING_NAME',
	'CUSTOMER_MISSING_EMAIL',
	'INVALID_PAUSE_LENGTH',
	'INVALID_DATE',
	'UNSUPPORTED_COUNTRY',
	'UNSUPPORTED_CURRENCY',
	'APPLE_TTP_PIN_TOKEN',
	'CARD_EXPIRED',
	'INVALID_EXPIRATION',
	'INVALID_EXPIRATION_YEAR',
	'INVALID_EXPIRATION_DATE',
	'UNSUPPORTED_CARD_BRAND',
	'UNSUPPORTED_ENTRY_METHOD',
	'INVALID_ENCRYPTED_CARD',
	'INVALID_CARD',
	'PAYMENT_AMOUNT_MISMATCH',
	'GENERIC_DECLINE',
	'CVV_FAILURE',
	'ADDRESS_VERIFICATION_FAILURE',
	'INVALID_ACCOUNT',
	'CURRENCY_MISMATCH',
	'INSUFFICIENT_FUNDS',
	'INSUFFICIENT_PERMISSIONS',
	'CARDHOLDER_INSUFFICIENT_PERMISSIONS',
	'INVALID_LOCATION',
	'TRANSACTION_LIMIT',
	'VOICE_FAILURE',
	'PAN_FAILURE',
	'EXPIRATION_FAILURE',
	'CARD_NOT_SUPPORTED',
	'READER_DECLINED',
	'INVALID_PIN',
	'MISSING_PIN',
	'MISSING_ACCOUNT_TYPE',
	'INVALID_POSTAL_CODE',
	'INVALID_FEES',
	'MANUALLY_ENTERED_PAYMENT_NOT_SUPPORTED',
	'PAYMENT_LIMIT_EXCEEDED',
	'GIFT_CARD_AVAILABLE_AMOUNT',
	'ACCOUNT_UNUSABLE',
	'BUYER_REFUSED_PAYMENT',
	'DELAYED_TRANSACTION_EXPIRED',
	'DELAYED_TRANSACTION_CANCELED',
	'DELAYED_TRANSACTION_CAPTURED',
	'DELAYED_TRANSACTION_FAILED',
	'CARD_TOKEN_EXPIRED',
	'CARD_TOKEN_USED',
	'AMOUNT_TOO_HIGH',
	'AMOUNT_TOO_LOW',
	'UNSUPPORTED_INSTRUMENT_TYPE',
	'REFUND_AMOUNT_INVALID',
	'REFUND_ALREADY_PENDING',
	'PAYMENT_NOT_REFUNDABLE',
	'PAYMENT_NOT_REFUNDABLE_DUE_TO_DISPUTE',
	'REFUND_ERROR_PAYMENT_NEEDS_COMPLETION',
	'REFUND_DECLINED',
	'INSUFFICIENT_PERMISSIONS_FOR_REFUND',
	'INVALID_CARD_DATA',
	'SOURCE_USED',
	'SOURCE_EXPIRED',
	'UNSUPPORTED_LOYALTY_REWARD_TIER',
	'LOCATION_MISMATCH',
	'ORDER_UNPAID_NOT_RETURNABLE',
	'PARTIAL_PAYMENT_DELAY_CAPTURE_NOT_SUPPORTED',
	'IDEMPOTENCY_KEY_REUSED',
	'UNEXPECTED_VALUE',
	'SANDBOX_NOT_SUPPORTED',
	'INVALID_EMAIL_ADDRESS',
	'INVALID_PHONE_NUMBER',
	'CHECKOUT_EXPIRED',
	'BAD_CERTIFICATE',
	'INVALID_SQUARE_VERSION_FORMAT',
	'API_VERSION_INCOMPATIBLE',
	'CARD_PRESENCE_REQUIRED',
	'UNSUPPORTED_SOURCE_TYPE',
	'CARD_MISMATCH',
	'PLAID_ERROR',
	'PLAID_ERROR_ITEM_LOGIN_REQUIRED',
	'PLAID_ERROR_RATE_LIMIT',
	'PLAID_ERROR_INVALID_ACCESS_TOKEN',
	'PLAID_ERROR_INVALID_ACCOUNT_ID',
	'PLAID_ERROR_NO_ACCOUNTS',
	'PLAID_ERROR_ITEM_NOT_FOUND',
	'PLAID_ERROR_INSUFFICIENT_CREDENTIALS',
	'PLAID_ERROR_ITEM_NOT_SUPPORTED',
	'PLAID_ERROR_PRODUCT_NOT_READY',
	'PAYMENT_SOURCE_NOT_ENABLED_FOR_TARGET',
	'CARD_DECLINED',
	'VERIFY_CVV_FAILURE',
	'VERIFY_AVS_FAILURE',
	'CARD_DECLINED_CALL_ISSUER',
	'CARD_DECLINED_VERIFICATION_REQUIRED',
	'BAD_EXPIRATION',
	'CHIP_INSERTION_REQUIRED',
	'ALLOWABLE_PIN_TRIES_EXCEEDED',
	'RESERVATION_DECLINED',
	'UNKNOWN_BODY_PARAMETER',
	'CART_INELIGIBLE_FOR_EBT',
	'NOT_FOUND',
	'APPLE_PAYMENT_PROCESSING_CERTIFICATE_HASH_NOT_FOUND',
	'METHOD_NOT_ALLOWED',
	'NOT_ACCEPTABLE',
	'REQUEST_TIMEOUT',
	'CONFLICT',
	'GONE',
	'REQUEST_ENTITY_TOO_LARGE',
	'UNSUPPORTED_MEDIA_TYPE',
	'UNPROCESSABLE_ENTITY',
	'RATE_LIMITED',
	'NOT_IMPLEMENTED',
	'BAD_GATEWAY',
	'SERVICE_UNAVAILABLE',
	'TEMPORARY_ERROR',
	'GATEWAY_TIMEOUT',
]);

export const ErrorSchema = z.object({
	category: ErrorCategorySchema.describe(
		'The high-level category for the error. See ErrorCategory for possible values',
	),
	code: ErrorCodeSchema.describe(
		'The specific code of the error. See ErrorCode for possible values',
	),
	detail: z
		.string()
		.describe(
			'A human-readable description of the error for debugging purposes.',
		)
		.optional(),
	field: z
		.string()
		.describe(
			'The name of the field provided in the original request (if any) that the error pertains to.',
		)
		.optional(),
});

export const CardSurchargeDetailsSchema = z.object({
	card_surcharge_money: MoneySchema.describe(
		'A specific surcharge levied by the merchant, if a card payment is used, instead of cash or some other payment type. Should only include the base surcharge amount.',
	).optional(),
});

export const CardPaymentDetailsSchema = z.object({
	status: z
		.string()
		.max(50)
		.describe(
			"The card payment's current state. The state can be AUTHORIZED, CAPTURED, VOIDED, or FAILED.",
		)
		.optional(),
	card: CardSchema.describe(
		"The credit card's non-confidential details.",
	).optional(),
	entry_method: z
		.string()
		.max(50)
		.describe(
			"The method used to enter the card's details for the payment. The method can be `KEYED`, `SWIPED`, `EMV`, `ON_FILE`, or `CONTACTLESS`.",
		)
		.optional(),
	cvv_status: z
		.string()
		.max(50)
		.describe(
			'The status code returned from the Card Verification Value (CVV) check. The code can be `CVV_ACCEPTED`, `CVV_REJECTED`, or `CVV_NOT_CHECKED`.',
		)
		.optional(),
	avs_status: z
		.string()
		.max(50)
		.describe(
			'The status code returned from the Address Verification System (AVS) check. The code can be `AVS_ACCEPTED`, `AVS_REJECTED`, or `AVS_NOT_CHECKED`.',
		)
		.optional(),
	auth_result_code: z
		.string()
		.max(10)
		.describe(
			"The status code returned by the card issuer that describes the payment's authorization status.",
		)
		.optional(),
	application_identifier: z
		.string()
		.max(32)
		.describe(
			'For EMV payments, the application ID identifies the EMV application used for the payment.',
		)
		.optional(),
	application_name: z
		.string()
		.max(16)
		.describe(
			'For EMV payments, the human-readable name of the EMV application used for the payment.',
		)
		.optional(),
	application_cryptogram: z
		.string()
		.max(16)
		.describe('For EMV payments, the cryptogram generated for the payment.')
		.optional(),
	verification_method: z
		.string()
		.max(50)
		.describe(
			"For EMV payments, the method used to verify the cardholder's identity. The method can be `PIN`, `SIGNATURE`, `PIN_AND_SIGNATURE`, `ON_DEVICE`, or `NONE`.",
		)
		.optional(),
	verification_results: z
		.string()
		.max(50)
		.describe(
			'For EMV payments, the results of the cardholder verification. The result can be `SUCCESS`, `FAILURE`, or `UNKNOWN`.',
		)
		.optional(),
	statement_description: z
		.string()
		.max(50)
		.describe('The statement description sent to the card networks.')
		.optional(),
	device_details: DeviceDetailsSchema.describe(
		'__Deprecated__: Use `Payment.device_details` instead.',
	).optional(),
	card_payment_timeline: CardPaymentTimelineSchema.describe(
		'The timeline for card payments.',
	).optional(),
	refund_requires_card_presence: z
		.boolean()
		.describe(
			'Whether the card must be physically present for the payment to be refunded. If set to `true`, the card must be present.',
		)
		.optional(),
	errors: z
		.array(ErrorSchema)
		.describe('Information about errors encountered during the request.')
		.optional(),
	applied_card_surcharge_details: CardSurchargeDetailsSchema.describe(
		'Additional information about a card_surcharge on the payment.',
	).optional(),
	wallet_type: z
		.string()
		.max(50)
		.describe(
			'The type of digital wallet used for this card payment, if applicable. Currently only populated for in-person Apple Pay payments.',
		)
		.optional(),
});

export const ACHDetailsSchema = z.object({
	routing_number: z
		.string()
		.max(50)
		.nullable()
		.describe('The routing number for the bank account.')
		.optional(),
	account_number_suffix: z
		.string()
		.min(1)
		.max(4)
		.nullable()
		.describe('The last few digits of the bank account number.')
		.optional(),
	account_type: z
		.string()
		.max(50)
		.nullable()
		.describe(
			'The type of the bank account performing the transfer. The account type can be `CHECKING`, `SAVINGS`, or `UNKNOWN`.',
		)
		.optional(),
});

export const BankAccountPaymentDetailsSchema = z.object({
	bank_name: z
		.string()
		.max(100)
		.nullable()
		.describe('The name of the bank associated with the bank account.')
		.optional(),
	transfer_type: z
		.string()
		.max(50)
		.nullable()
		.describe(
			'The type of the bank transfer. The type can be `ACH` or `UNKNOWN`.',
		)
		.optional(),
	account_ownership_type: z
		.string()
		.max(50)
		.nullable()
		.describe(
			'The ownership type of the bank account performing the transfer. The type can be `INDIVIDUAL`, `COMPANY`, or `ACCOUNT_TYPE_UNKNOWN`.',
		)
		.optional(),
	fingerprint: z
		.string()
		.max(255)
		.nullable()
		.describe(
			'Uniquely identifies the bank account for this seller and can be used to determine if payments are from the same bank account.',
		)
		.optional(),
	country: z
		.string()
		.min(2)
		.max(2)
		.nullable()
		.describe(
			'The two-letter ISO code representing the country the bank account is located in.',
		)
		.optional(),
	statement_description: z
		.string()
		.max(1000)
		.nullable()
		.describe('The statement description as sent to the bank.')
		.optional(),
	ach_details: ACHDetailsSchema.describe(
		'ACH-specific information about the transfer. The information is only populated if the `transfer_type` is `ACH`.',
	).optional(),
	errors: z
		.array(ErrorSchema)
		.nullable()
		.describe('Information about errors encountered during the request.')
		.optional(),
});

export const FelicaDetailsFelicaBrandSchema = z.enum([
	'UNKNOWN',
	'FELICA_ID',
	'FELICA_TRANSPORTATION',
	'FELICA_QP',
]);

export const FelicaDetailsSchema = z.object({
	terminal_id: z
		.string()
		.max(255)
		.nullable()
		.describe('The terminal id for a Felica payment.')
		.optional(),
	felica_masked_card_number: z
		.string()
		.nullable()
		.describe('The masked card number for a Felica payment.')
		.optional(),
	felica_brand: FelicaDetailsFelicaBrandSchema.describe(
		'The Felica sub-brand of the payment. See FelicaBrand for possible values',
	).optional(),
});

export const ElectronicMoneyDetailsSchema = z.object({
	felica_details: FelicaDetailsSchema.describe(
		'Details specific to FeliCa payments.',
	).optional(),
});

export const CashAppDetailsSchema = z.object({
	buyer_full_name: z
		.string()
		.max(255)
		.nullable()
		.describe('The name of the Cash App account holder.')
		.optional(),
	buyer_country_code: z
		.string()
		.min(2)
		.max(2)
		.nullable()
		.describe(
			'The country of the Cash App account holder, in ISO 3166-1-alpha-2 format.',
		)
		.optional(),
	buyer_cashtag: z
		.string()
		.min(1)
		.max(21)
		.describe('$Cashtag of the Cash App account holder.')
		.optional(),
});

export const LightningDetailsSchema = z.object({
	payment_url: z
		.string()
		.nullable()
		.describe('Payment URL for the lightning payment, a.k.a. the invoice.')
		.optional(),
});

export const DigitalWalletDetailsSchema = z.object({
	status: z
		.string()
		.max(50)
		.nullable()
		.describe(
			'The status of the `WALLET` payment. The status can be `AUTHORIZED`, `CAPTURED`, `VOIDED`, or `FAILED`.',
		)
		.optional(),
	brand: z
		.string()
		.max(50)
		.nullable()
		.describe(
			'The brand used for the `WALLET` payment. The brand can be `CASH_APP`, `PAYPAY`, `ALIPAY`, `RAKUTEN_PAY`, `AU_PAY`, `D_BARAI`, `MERPAY`, `WECHAT_PAY`, `LIGHTNING` or `UNKNOWN`.',
		)
		.optional(),
	cash_app_details: CashAppDetailsSchema.describe(
		'Brand-specific details for payments with the `brand` of `CASH_APP`.',
	).optional(),
	lightning_details: LightningDetailsSchema.describe(
		'Brand-specific details for payments with the `brand` of `LIGHTNING`.',
	).optional(),
	errors: z
		.array(ErrorSchema)
		.describe('Information about errors encountered during the payment.')
		.optional(),
});

export const AfterpayDetailsSchema = z.object({
	email_address: z
		.string()
		.max(255)
		.nullable()
		.describe("Email address on the buyer's Afterpay account.")
		.optional(),
});

export const ClearpayDetailsSchema = z.object({
	email_address: z
		.string()
		.max(255)
		.nullable()
		.describe("Email address on the buyer's Clearpay account.")
		.optional(),
});

export const BuyNowPayLaterDetailsSchema = z.object({
	brand: z
		.string()
		.max(50)
		.nullable()
		.describe(
			'The brand used for the Buy Now Pay Later payment. The brand can be `AFTERPAY`, `CLEARPAY` or `UNKNOWN`.',
		)
		.optional(),
	afterpay_details: AfterpayDetailsSchema.describe(
		'Details about an Afterpay payment. These details are only populated if the `brand` is `AFTERPAY`.',
	).optional(),
	clearpay_details: ClearpayDetailsSchema.describe(
		'Details about a Clearpay payment. These details are only populated if the `brand` is `CLEARPAY`.',
	).optional(),
	errors: z
		.array(ErrorSchema)
		.describe('Information about errors encountered during the payment.')
		.optional(),
});

export const SquareAccountDetailsSchema = z.object({
	payment_source_token: z
		.string()
		.max(255)
		.nullable()
		.describe('Unique identifier for the payment source used for this payment.')
		.optional(),
	errors: z
		.array(ErrorSchema)
		.nullable()
		.describe('Information about errors encountered during the request.')
		.optional(),
});

export const RiskEvaluationRiskLevelSchema = z.enum([
	'PENDING',
	'NORMAL',
	'MODERATE',
	'HIGH',
]);

export const RiskEvaluationSchema = z.object({
	created_at: z
		.string()
		.describe(
			'The timestamp when payment risk was evaluated, in RFC 3339 format.',
		)
		.optional(),
	risk_level: RiskEvaluationRiskLevelSchema.describe(
		'The risk level associated with the payment See RiskEvaluationRiskLevel for possible values',
	).optional(),
});

export const ApplicationDetailsExternalSquareProductSchema = z.enum([
	'APPOINTMENTS',
	'ECOMMERCE_API',
	'INVOICES',
	'ONLINE_STORE',
	'OTHER',
	'RESTAURANTS',
	'RETAIL',
	'SQUARE_POS',
	'TERMINAL_API',
	'VIRTUAL_TERMINAL',
]);

export const ApplicationDetailsSchema = z.object({
	square_product: ApplicationDetailsExternalSquareProductSchema.describe(
		'The Square product, such as Square Point of Sale (POS), Square Invoices, or Square Virtual Terminal. See ExternalSquareProduct for possible values',
	).optional(),
	application_id: z
		.string()
		.nullable()
		.describe(
			'The Square ID assigned to the application used to take the payment. Application developers can use this information to identify payments that their application processed.',
		)
		.optional(),
});

export const PaymentSchema = z.object({
	id: z.string().max(192).describe('A unique ID for the payment.').optional(),
	created_at: z
		.string()
		.max(32)
		.describe(
			'The timestamp of when the payment was created, in RFC 3339 format.',
		)
		.optional(),
	updated_at: z
		.string()
		.max(32)
		.describe(
			'The timestamp of when the payment was last updated, in RFC 3339 format.',
		)
		.optional(),
	amount_money: MoneySchema.describe(
		'The amount processed for this payment, not including `tip_money`.',
	).optional(),
	tip_money: MoneySchema.describe(
		"The amount designated as a tip for the seller's staff.",
	).optional(),
	total_money: MoneySchema.describe(
		'The total amount for the payment, including `amount_money` and `tip_money`.',
	).optional(),
	app_fee_money: MoneySchema.describe(
		'The amount the developer is taking as a fee for facilitating the payment on behalf of the seller.',
	).optional(),
	app_fee_allocations: z
		.array(UnspecifiedObject)
		.nullable()
		.describe('Details pertaining to recipients of the application fee.')
		.optional(),
	approved_money: MoneySchema.describe(
		'The amount of money approved for this payment. This value may change if Square chooses to obtain reauthorization as part of a call to UpdatePayment.',
	).optional(),
	processing_fee: z
		.array(ProcessingFeeSchema)
		.describe(
			'The processing fees and fee adjustments assessed by Square for this payment.',
		)
		.optional(),
	refunded_money: MoneySchema.describe(
		'The total amount of the payment refunded to date.',
	).optional(),
	status: z
		.string()
		.max(50)
		.describe(
			'Indicates whether the payment is APPROVED, PENDING, COMPLETED, CANCELED, or FAILED.',
		)
		.optional(),
	delay_duration: z
		.string()
		.describe(
			"The duration of time after the payment's creation when Square automatically applies the `delay_action` to the payment.",
		)
		.optional(),
	delay_action: z
		.string()
		.nullable()
		.describe(
			'The action to be applied to the payment when the `delay_duration` has elapsed.',
		)
		.optional(),
	delayed_until: z
		.string()
		.describe(
			'The read-only timestamp of when the `delay_action` is automatically applied, in RFC 3339 format.',
		)
		.optional(),
	source_type: z
		.string()
		.max(50)
		.describe('The source type for this payment.')
		.optional(),
	card_details: CardPaymentDetailsSchema.describe(
		'Details about a card payment. These details are only populated if the source_type is `CARD`.',
	).optional(),
	cash_details: CashPaymentDetailsSchema.describe(
		'Details about a cash payment. These details are only populated if the source_type is `CASH`.',
	).optional(),
	bank_account_details: BankAccountPaymentDetailsSchema.describe(
		'Details about a bank account payment. These details are only populated if the source_type is `BANK_ACCOUNT`.',
	).optional(),
	electronic_money_details: ElectronicMoneyDetailsSchema.describe(
		'Details specific to electronic money payments.',
	).optional(),
	external_details: ExternalPaymentDetailsSchema.describe(
		'Details about an external payment. The details are only populated if the `source_type` is `EXTERNAL`.',
	).optional(),
	wallet_details: DigitalWalletDetailsSchema.describe(
		'Details about an wallet payment. The details are only populated if the `source_type` is `WALLET`.',
	).optional(),
	buy_now_pay_later_details: BuyNowPayLaterDetailsSchema.describe(
		'Details about a Buy Now Pay Later payment. The details are only populated if the `source_type` is `BUY_NOW_PAY_LATER`. For more information, see Afterpay Payments.',
	).optional(),
	square_account_details: SquareAccountDetailsSchema.describe(
		'Details about a Square Account payment. The details are only populated if the `source_type` is `SQUARE_ACCOUNT`.',
	).optional(),
	location_id: z
		.string()
		.max(50)
		.describe('The ID of the location associated with the payment.')
		.optional(),
	order_id: z
		.string()
		.max(192)
		.describe('The ID of the order associated with the payment.')
		.optional(),
	reference_id: z
		.string()
		.max(40)
		.describe(
			'An optional ID that associates the payment with an entity in another system.',
		)
		.optional(),
	customer_id: z
		.string()
		.max(191)
		.describe('The ID of the customer associated with the payment.')
		.optional(),
	employee_id: z
		.string()
		.max(192)
		.describe('__Deprecated__: Use `Payment.team_member_id` instead.')
		.optional(),
	team_member_id: z
		.string()
		.max(192)
		.nullable()
		.describe(
			'An optional ID of the TeamMember associated with taking the payment.',
		)
		.optional(),
	refund_ids: z
		.array(z.string())
		.describe('A list of `refund_id`s identifying refunds for the payment.')
		.optional(),
	risk_evaluation: RiskEvaluationSchema.describe(
		'Provides information about the risk associated with the payment, as determined by Square.',
	).optional(),
	terminal_checkout_id: z
		.string()
		.describe(
			'An optional ID for a Terminal checkout that is associated with the payment.',
		)
		.optional(),
	buyer_email_address: z
		.string()
		.max(255)
		.describe("The buyer's email address.")
		.optional(),
	billing_address: AddressSchema.describe(
		"The buyer's billing address.",
	).optional(),
	shipping_address: AddressSchema.describe(
		"The buyer's shipping address.",
	).optional(),
	note: z
		.string()
		.max(500)
		.describe('An optional note to include when creating a payment.')
		.optional(),
	statement_description_identifier: z
		.string()
		.describe(
			"Additional payment information that gets added to the customer's card statement as part of the statement description.",
		)
		.optional(),
	capabilities: z
		.array(z.string())
		.describe(
			'Actions that can be performed on this payment: - `EDIT_AMOUNT_UP` - The payment amount can be edited up. - `EDIT_AMOUNT_DOWN` - The payment amount can be edited down.',
		)
		.optional(),
	receipt_number: z
		.string()
		.max(4)
		.describe(
			"The payment's receipt number. The field is missing if a payment is canceled.",
		)
		.optional(),
	receipt_url: z
		.string()
		.max(255)
		.describe(
			"The URL for the payment's receipt. The field is only populated for COMPLETED payments.",
		)
		.optional(),
	device_details: DeviceDetailsSchema.describe(
		'Details about the device that took the payment.',
	).optional(),
	application_details: ApplicationDetailsSchema.describe(
		'Details about the application that took the payment.',
	).optional(),
	buyer_currency_exchange: UnspecifiedObject.describe(
		'Details about the currency exchange for payments where the currency the buyer paid with differs from the currency the merchant received (e.g., bitcoin lightning payments).',
	).optional(),
	is_offline_payment: z
		.boolean()
		.describe('Whether or not this payment was taken offline.')
		.optional(),
	offline_payment_details: OfflinePaymentDetailsSchema.describe(
		'Additional information about the payment if it was taken offline.',
	).optional(),
	version_token: z
		.string()
		.nullable()
		.describe(
			'Used for optimistic concurrency. This opaque token identifies a specific version of the `Payment` object.',
		)
		.optional(),
});

export const UpdatePaymentRequestSchema = z.object({
	payment: PaymentSchema.describe('The updated `Payment` object.').optional(),
	idempotency_key: z
		.string()
		.min(1)
		.max(45)
		.describe(
			'A unique string that identifies this `UpdatePayment` request. Keys can be any valid string but must be unique for every `UpdatePayment` request.',
		),
});

export const CompletePaymentRequestSchema = z.object({
	version_token: z
		.string()
		.nullable()
		.describe(
			'Used for optimistic concurrency. This opaque token identifies the current `Payment` version that the caller expects.',
		)
		.optional(),
});

export const DestinationDetailsCashRefundDetailsSchema = z.object({
	seller_supplied_money: MoneySchema.describe(
		'The amount and currency of the money supplied by the seller.',
	),
	change_back_money: MoneySchema.describe(
		'The amount of change due back to the seller. This read-only field is calculated from the `amount_money` and `seller_supplied_money` fields.',
	).optional(),
});

export const DestinationDetailsExternalRefundDetailsSchema = z.object({
	type: z
		.string()
		.max(50)
		.describe(
			'The type of external refund the seller paid to the buyer. It can be one of the following: - CHECK - Refunded using a physical check.',
		),
	source: z
		.string()
		.max(255)
		.describe(
			'A description of the external refund source. For example, "Food Delivery Service".',
		),
	source_id: z
		.string()
		.max(255)
		.nullable()
		.describe('An ID to associate the refund to its originating source.')
		.optional(),
});

export const RefundPaymentRequestSchema = z.object({
	idempotency_key: z
		.string()
		.min(1)
		.describe(
			'A unique string that identifies this `RefundPayment` request. The key can be any valid string but must be unique for every `RefundPayment` request.',
		),
	amount_money: MoneySchema.describe('The amount of money to refund.'),
	app_fee_money: MoneySchema.describe(
		'The amount of money the developer contributes to help cover the refunded amount.',
	).optional(),
	app_fee_allocations: z
		.array(UnspecifiedObject)
		.nullable()
		.describe(
			'Details pertaining to contributors to the refund of the application fee. The sum of the amounts in the app_fee_allocations must equal the app_fee_money amount, if present.',
		)
		.optional(),
	payment_id: z
		.string()
		.nullable()
		.describe(
			'The unique ID of the payment being refunded. Required when unlinked=false, otherwise must not be set.',
		)
		.optional(),
	destination_id: z
		.string()
		.nullable()
		.describe(
			'The ID indicating where funds will be refunded to. Required for unlinked refunds. For more information, see Process an Unlinked Refund.',
		)
		.optional(),
	unlinked: z
		.boolean()
		.nullable()
		.describe(
			'Indicates that the refund is not linked to a Square payment. If set to true, `destination_id` and `location_id` must be supplied while `payment_id` must not be provided.',
		)
		.optional(),
	location_id: z
		.string()
		.max(50)
		.nullable()
		.describe(
			'The location ID associated with the unlinked refund. Required for requests specifying `unlinked=true`. Otherwise, if included when `unlinked=false`, will throw an error.',
		)
		.optional(),
	customer_id: z
		.string()
		.nullable()
		.describe(
			'The Customer ID of the customer associated with the refund. This is required if the `destination_id` refers to a card on file created using the Cards API.',
		)
		.optional(),
	reason: z
		.string()
		.max(192)
		.nullable()
		.describe('A description of the reason for the refund.')
		.optional(),
	payment_version_token: z
		.string()
		.nullable()
		.describe(
			'Used for optimistic concurrency. This opaque token identifies the current `Payment` version that the caller expects.',
		)
		.optional(),
	team_member_id: z
		.string()
		.max(192)
		.nullable()
		.describe('An optional TeamMember ID to associate with this refund.')
		.optional(),
	cash_details: DestinationDetailsCashRefundDetailsSchema.describe(
		'Additional details required when recording an unlinked cash refund (`destination_id` is CASH).',
	).optional(),
	external_details: DestinationDetailsExternalRefundDetailsSchema.describe(
		'Additional details required when recording an unlinked external refund (`destination_id` is EXTERNAL).',
	).optional(),
});

export const ListPaymentRefundsRequestSortFieldSchema = z.enum([
	'CREATED_AT',
	'UPDATED_AT',
]);

export const CreateOrderRequestSchema = z.object({
	order: OrderSchema.describe(
		'The order to create. If this field is set, the only other top-level field that can be set is the `idempotency_key`.',
	).optional(),
	idempotency_key: z
		.string()
		.max(192)
		.describe(
			'A value you specify that uniquely identifies this order among orders you have created.',
		)
		.optional(),
});

export const PayOrderRequestSchema = z.object({
	idempotency_key: z
		.string()
		.min(1)
		.max(192)
		.describe(
			'A value you specify that uniquely identifies this request among requests you have sent.',
		),
	order_version: z
		.number()
		.int()
		.nullable()
		.describe(
			'The version of the order being paid. If not supplied, the latest version will be paid.',
		)
		.optional(),
	payment_ids: z
		.array(z.string())
		.nullable()
		.describe(
			'The IDs of the payments to collect. The payment total must match the order total.',
		)
		.optional(),
});

export const QuickPaySchema = z.object({
	name: z
		.string()
		.min(1)
		.max(255)
		.describe(
			'The ad hoc item name. In the resulting `Order`, this name appears as the line item name.',
		),
	price_money: MoneySchema.describe('The price of the item.'),
	location_id: z
		.string()
		.describe(
			'The ID of the business location the checkout is associated with.',
		),
});

export const CustomFieldSchema = z.object({
	title: z.string().min(1).max(50).describe('The title of the custom field.'),
});

export const AcceptedPaymentMethodsSchema = z.object({
	apple_pay: z
		.boolean()
		.nullable()
		.describe('Whether Apple Pay is accepted at checkout.')
		.optional(),
	google_pay: z
		.boolean()
		.nullable()
		.describe('Whether Google Pay is accepted at checkout.')
		.optional(),
	cash_app_pay: z
		.boolean()
		.nullable()
		.describe('Whether Cash App Pay is accepted at checkout.')
		.optional(),
	afterpay_clearpay: z
		.boolean()
		.nullable()
		.describe('Whether Afterpay/Clearpay is accepted at checkout.')
		.optional(),
});

export const ShippingFeeSchema = z.object({
	name: z
		.string()
		.nullable()
		.describe('The name for the shipping fee.')
		.optional(),
	charge: MoneySchema.describe('The amount and currency for the shipping fee.'),
});

export const CheckoutOptionsSchema = z.object({
	allow_tipping: z
		.boolean()
		.nullable()
		.describe('Indicates whether the payment allows tipping.')
		.optional(),
	custom_fields: z
		.array(CustomFieldSchema)
		.nullable()
		.describe('The custom fields requesting information from the buyer.')
		.optional(),
	subscription_plan_id: z
		.string()
		.max(255)
		.nullable()
		.describe(
			'The ID of the subscription plan for the buyer to pay and subscribe. For more information, see Subscription Plan Checkout.',
		)
		.optional(),
	redirect_url: z
		.string()
		.max(2048)
		.nullable()
		.describe(
			'The confirmation page URL to redirect the buyer to after Square processes the payment.',
		)
		.optional(),
	merchant_support_email: z
		.string()
		.max(256)
		.nullable()
		.describe('The email address that buyers can use to contact the seller.')
		.optional(),
	ask_for_shipping_address: z
		.boolean()
		.nullable()
		.describe(
			'Indicates whether to include the address fields in the payment form.',
		)
		.optional(),
	accepted_payment_methods: AcceptedPaymentMethodsSchema.describe(
		'The methods allowed for buyers during checkout.',
	).optional(),
	app_fee_money: MoneySchema.describe(
		'The amount of money that the developer is taking as a fee for facilitating the payment on behalf of the seller.',
	).optional(),
	shipping_fee: ShippingFeeSchema.describe(
		'The fee associated with shipping to be applied to the `Order` as a service charge.',
	).optional(),
	enable_coupon: z
		.boolean()
		.nullable()
		.describe(
			'Indicates whether to include the `Add coupon` section for the buyer to provide a Square marketing coupon in the payment form.',
		)
		.optional(),
	enable_loyalty: z
		.boolean()
		.nullable()
		.describe(
			'Indicates whether to include the `REWARDS` section for the buyer to opt in to loyalty, redeem rewards in the payment form, or both.',
		)
		.optional(),
});

export const PrePopulatedDataSchema = z.object({
	buyer_email: z
		.string()
		.max(256)
		.nullable()
		.describe('The buyer email to prepopulate in the payment form.')
		.optional(),
	buyer_phone_number: z
		.string()
		.max(17)
		.nullable()
		.describe('The buyer phone number to prepopulate in the payment form.')
		.optional(),
	buyer_address: AddressSchema.describe(
		'The buyer address to prepopulate in the payment form.',
	).optional(),
});

export const CreatePaymentLinkRequestSchema = z.object({
	idempotency_key: z
		.string()
		.max(192)
		.describe(
			'A unique string that identifies this `CreatePaymentLinkRequest` request.',
		)
		.optional(),
	description: z
		.string()
		.max(4096)
		.describe(
			'A description of the payment link. You provide this optional description that is useful in your application context. It is not used anywhere.',
		)
		.optional(),
	quick_pay: QuickPaySchema.describe(
		'Describes an ad hoc item and price for which to generate a quick pay checkout link. For more information, see Quick Pay Checkout.',
	).optional(),
	order: OrderSchema.describe(
		'Describes the `Order` for which to create a checkout link. For more information, see Square Order Checkout.',
	).optional(),
	checkout_options: CheckoutOptionsSchema.describe(
		'Describes optional fields to add to the resulting checkout page. For more information, see Optional Checkout Configurations.',
	).optional(),
	pre_populated_data: PrePopulatedDataSchema.describe(
		'Describes fields to prepopulate in the resulting checkout page. For more information, see Prepopulate the shipping address.',
	).optional(),
	payment_note: z
		.string()
		.max(500)
		.describe(
			'A note for the payment. After processing the payment, Square adds this note to the resulting `Payment`.',
		)
		.optional(),
});

export const InvoiceRecipientTaxIdsSchema = z.object({
	eu_vat: z
		.string()
		.describe(
			'The EU VAT identification number for the invoice recipient. For example, `IE3426675K`.',
		)
		.optional(),
});

export const InvoiceRecipientSchema = z.object({
	customer_id: z
		.string()
		.min(1)
		.max(255)
		.nullable()
		.describe(
			'The ID of the customer. This is the customer profile ID that you provide when creating a draft invoice.',
		)
		.optional(),
	given_name: z
		.string()
		.describe("The recipient's given (that is, first) name.")
		.optional(),
	family_name: z
		.string()
		.describe("The recipient's family (that is, last) name.")
		.optional(),
	email_address: z
		.string()
		.describe("The recipient's email address.")
		.optional(),
	address: AddressSchema.describe(
		"The recipient's physical address.",
	).optional(),
	phone_number: z.string().describe("The recipient's phone number.").optional(),
	company_name: z
		.string()
		.describe("The name of the recipient's company.")
		.optional(),
	tax_ids: InvoiceRecipientTaxIdsSchema.describe(
		"The recipient's tax IDs. The country of the seller account determines whether this field is available for the customer. For more information, see Invoice recipient tax IDs.",
	).optional(),
});

export const InvoiceRequestMethodSchema = z.enum([
	'EMAIL',
	'CHARGE_CARD_ON_FILE',
	'SHARE_MANUALLY',
	'CHARGE_BANK_ON_FILE',
	'SMS',
	'SMS_CHARGE_CARD_ON_FILE',
	'SMS_CHARGE_BANK_ON_FILE',
]);

export const InvoiceRequestTypeSchema = z.enum([
	'BALANCE',
	'DEPOSIT',
	'INSTALLMENT',
]);

export const InvoiceAutomaticPaymentSourceSchema = z.enum([
	'NONE',
	'CARD_ON_FILE',
	'BANK_ON_FILE',
]);

export const InvoicePaymentReminderStatusSchema = z.enum([
	'PENDING',
	'NOT_APPLICABLE',
	'SENT',
]);

export const InvoicePaymentReminderSchema = z.object({
	uid: z
		.string()
		.describe(
			'A Square-assigned ID that uniquely identifies the reminder within the `InvoicePaymentRequest`.',
		)
		.optional(),
	relative_scheduled_days: z
		.number()
		.int()
		.min(-32767)
		.max(32767)
		.nullable()
		.describe(
			'The number of days before (a negative number) or after (a positive number) the payment request `due_date` when the reminder is sent.',
		)
		.optional(),
	message: z
		.string()
		.min(1)
		.max(1000)
		.nullable()
		.describe('The reminder message.')
		.optional(),
	status: InvoicePaymentReminderStatusSchema.describe(
		'The status of the reminder. See InvoicePaymentReminderStatus for possible values',
	).optional(),
	sent_at: z
		.string()
		.describe(
			'If sent, the timestamp when the reminder was sent, in RFC 3339 format.',
		)
		.optional(),
});

export const InvoicePaymentRequestSchema = z.object({
	uid: z
		.string()
		.min(1)
		.max(255)
		.nullable()
		.describe('The Square-generated ID of the payment request in an invoice.')
		.optional(),
	request_method: InvoiceRequestMethodSchema.describe(
		'Indicates how Square processes the payment request. DEPRECATED at version 2021-01-21. Replaced by the `Invoice.delivery_method` and `InvoicePaymentRequest.',
	).optional(),
	request_type: InvoiceRequestTypeSchema.describe(
		'Identifies the payment request type. This type defines how the payment request amount is determined. This field is required to create a payment request.',
	).optional(),
	due_date: z
		.string()
		.nullable()
		.describe(
			"The due date (in the invoice's time zone) for the payment request, in `YYYY-MM-DD` format. This field is required to create a payment request.",
		)
		.optional(),
	fixed_amount_requested_money: MoneySchema.describe(
		'If the payment request specifies `DEPOSIT` or `INSTALLMENT` as the `request_type`, this indicates the request amount.',
	).optional(),
	percentage_requested: z
		.string()
		.nullable()
		.describe('Specifies the amount for the payment request in percentage:')
		.optional(),
	tipping_enabled: z
		.boolean()
		.nullable()
		.describe(
			'If set to true, the Square-hosted invoice page (the `public_url` field of the invoice) provides a place for the customer to pay a tip.',
		)
		.optional(),
	automatic_payment_source: InvoiceAutomaticPaymentSourceSchema.describe(
		'The payment method for an automatic payment.',
	).optional(),
	card_id: z
		.string()
		.min(1)
		.max(255)
		.nullable()
		.describe(
			'The ID of the credit or debit card on file to charge for the payment request.',
		)
		.optional(),
	reminders: z
		.array(InvoicePaymentReminderSchema)
		.nullable()
		.describe(
			'A list of one or more reminders to send for the payment request.',
		)
		.optional(),
	computed_amount_money: MoneySchema.describe(
		'The amount of the payment request, computed using the order amount and information from the various payment request fields (`request_type`, `fixed_amount_requested_money`, and `pe…',
	).optional(),
	total_completed_amount_money: MoneySchema.describe(
		'The amount of money already paid for the specific payment request.',
	).optional(),
	rounding_adjustment_included_money: MoneySchema.describe(
		'If the most recent payment was a cash payment in a currency that rounds cash payments (such as, `CAD` or `AUD`) and the payment is rounded from `computed_amount_money` in the paym…',
	).optional(),
});

export const InvoiceDeliveryMethodSchema = z.enum([
	'EMAIL',
	'SHARE_MANUALLY',
	'SMS',
]);

export const InvoiceStatusSchema = z.enum([
	'DRAFT',
	'UNPAID',
	'SCHEDULED',
	'PARTIALLY_PAID',
	'PAID',
	'PARTIALLY_REFUNDED',
	'REFUNDED',
	'CANCELED',
	'FAILED',
	'PAYMENT_PENDING',
]);

export const InvoiceAcceptedPaymentMethodsSchema = z.object({
	card: z
		.boolean()
		.nullable()
		.describe(
			'Indicates whether credit card or debit card payments are accepted. The default value is `false`.',
		)
		.optional(),
	square_gift_card: z
		.boolean()
		.nullable()
		.describe(
			'Indicates whether Square gift card payments are accepted. The default value is `false`.',
		)
		.optional(),
	bank_account: z
		.boolean()
		.nullable()
		.describe(
			'Indicates whether ACH bank transfer payments are accepted. The default value is `false`.',
		)
		.optional(),
	buy_now_pay_later: z
		.boolean()
		.nullable()
		.describe(
			'Indicates whether Afterpay (also known as Clearpay) payments are accepted. The default value is `false`.',
		)
		.optional(),
	cash_app_pay: z
		.boolean()
		.nullable()
		.describe(
			'Indicates whether Cash App payments are accepted. The default value is `false`.',
		)
		.optional(),
});

export const InvoiceCustomFieldPlacementSchema = z.enum([
	'ABOVE_LINE_ITEMS',
	'BELOW_LINE_ITEMS',
]);

export const InvoiceCustomFieldSchema = z.object({
	label: z
		.string()
		.max(30)
		.nullable()
		.describe(
			'The label or title of the custom field. This field is required for a custom field.',
		)
		.optional(),
	value: z
		.string()
		.max(2000)
		.nullable()
		.describe(
			'The text of the custom field. If omitted, only the label is rendered.',
		)
		.optional(),
	placement: InvoiceCustomFieldPlacementSchema.describe(
		'The location of the custom field on the invoice. This field is required for a custom field. See InvoiceCustomFieldPlacement for possible values',
	).optional(),
});

export const InvoiceAttachmentSchema = z.object({
	id: z
		.string()
		.describe('The Square-assigned ID of the attachment.')
		.optional(),
	filename: z
		.string()
		.describe(
			'The file name of the attachment, which is displayed on the invoice.',
		)
		.optional(),
	description: z
		.string()
		.describe(
			'The description of the attachment, which is displayed on the invoice. This field maps to the seller-defined **Message** field.',
		)
		.optional(),
	filesize: z
		.number()
		.int()
		.describe('The file size of the attachment in bytes.')
		.optional(),
	hash: z
		.string()
		.describe('The MD5 hash that was generated from the file contents.')
		.optional(),
	mime_type: z
		.string()
		.describe(
			'The mime type of the attachment. The following mime types are supported: image/gif, image/jpeg, image/png, image/tiff, image/bmp, application/pdf.',
		)
		.optional(),
	uploaded_at: z
		.string()
		.describe(
			'The timestamp when the attachment was uploaded, in RFC 3339 format.',
		)
		.optional(),
});

export const InvoiceSchema = z.object({
	id: z.string().describe('The Square-assigned ID of the invoice.').optional(),
	version: z
		.number()
		.int()
		.describe(
			'The Square-assigned version number, which is incremented each time an update is committed to the invoice.',
		)
		.optional(),
	location_id: z
		.string()
		.min(1)
		.max(255)
		.nullable()
		.describe('The ID of the location that this invoice is associated with.')
		.optional(),
	order_id: z
		.string()
		.min(1)
		.max(255)
		.nullable()
		.describe(
			'The ID of the order for which the invoice is created. This field is required when creating an invoice, and the order must be in the `OPEN` state.',
		)
		.optional(),
	primary_recipient: InvoiceRecipientSchema.describe(
		'The customer who receives the invoice. This customer data is displayed on the invoice and used by Square to deliver the invoice.',
	).optional(),
	payment_requests: z
		.array(InvoicePaymentRequestSchema)
		.nullable()
		.describe(
			'The payment schedule for the invoice, represented by one or more payment requests that define payment settings, such as amount due and due date.',
		)
		.optional(),
	delivery_method: InvoiceDeliveryMethodSchema.describe(
		'The delivery method that Square uses to send the invoice, reminders, and receipts to the customer.',
	).optional(),
	invoice_number: z
		.string()
		.min(1)
		.max(191)
		.nullable()
		.describe(
			'A user-friendly invoice number that is displayed on the invoice. The value is unique within a location. If not provided when creating an invoice, Square assigns a value.',
		)
		.optional(),
	title: z
		.string()
		.min(1)
		.max(255)
		.nullable()
		.describe('The title of the invoice, which is displayed on the invoice.')
		.optional(),
	description: z
		.string()
		.min(1)
		.max(65536)
		.nullable()
		.describe(
			'The description of the invoice, which is displayed on the invoice.',
		)
		.optional(),
	scheduled_at: z
		.string()
		.nullable()
		.describe(
			'The timestamp when the invoice is scheduled for processing, in RFC 3339 format.',
		)
		.optional(),
	public_url: z
		.string()
		.describe(
			'A temporary link to the Square-hosted payment page where the customer can pay the invoice.',
		)
		.optional(),
	next_payment_amount_money: MoneySchema.describe(
		'The current amount due for the invoice. In addition to the amount due on the next payment request, this includes any overdue payment amounts.',
	).optional(),
	status: InvoiceStatusSchema.describe(
		'The status of the invoice. See InvoiceStatus for possible values',
	).optional(),
	timezone: z
		.string()
		.describe(
			'The time zone used to interpret calendar dates on the invoice, such as `due_date`.',
		)
		.optional(),
	created_at: z
		.string()
		.describe('The timestamp when the invoice was created, in RFC 3339 format.')
		.optional(),
	updated_at: z
		.string()
		.describe(
			'The timestamp when the invoice was last updated, in RFC 3339 format.',
		)
		.optional(),
	accepted_payment_methods: InvoiceAcceptedPaymentMethodsSchema.describe(
		'The payment methods that customers can use to pay the invoice on the Square-hosted invoice page. This setting is independent of any automatic payment requests for the invoice.',
	).optional(),
	custom_fields: z
		.array(InvoiceCustomFieldSchema)
		.nullable()
		.describe(
			'Additional seller-defined fields that are displayed on the invoice. For more information, see Custom fields.',
		)
		.optional(),
	subscription_id: z
		.string()
		.describe(
			'The ID of the subscription associated with the invoice. This field is present only on subscription billing invoices.',
		)
		.optional(),
	sale_or_service_date: z
		.string()
		.nullable()
		.describe(
			'The date of the sale or the date that the service is rendered, in `YYYY-MM-DD` format. This field can be used to specify a past or future date which is displayed on the invoice.',
		)
		.optional(),
	payment_conditions: z
		.string()
		.min(1)
		.max(2000)
		.nullable()
		.describe(
			'**France only.** The payment terms and conditions that are displayed on the invoice. For more information, see Payment conditions.',
		)
		.optional(),
	store_payment_method_enabled: z
		.boolean()
		.nullable()
		.describe(
			'Indicates whether to allow a customer to save a credit or debit card as a card on file or a bank transfer as a bank account on file.',
		)
		.optional(),
	attachments: z
		.array(InvoiceAttachmentSchema)
		.describe(
			'Metadata about the attachments on the invoice. Invoice attachments are managed using the CreateInvoiceAttachment and DeleteInvoiceAttachment endpoints.',
		)
		.optional(),
	creator_team_member_id: z
		.string()
		.describe(
			'The ID of the team member who created the invoice. This field is present only on invoices created in the Square Dashboard or Square Invoices app by a logged-in team member.',
		)
		.optional(),
});

export const CreateInvoiceRequestSchema = z.object({
	invoice: InvoiceSchema.describe('The invoice to create.'),
	idempotency_key: z
		.string()
		.max(128)
		.describe('A unique string that identifies the `CreateInvoice` request.')
		.optional(),
});

export const PublishInvoiceRequestSchema = z.object({
	version: z
		.number()
		.int()
		.describe(
			'The version of the invoice to publish. This must match the current version of the invoice; otherwise, the request is rejected.',
		),
	idempotency_key: z
		.string()
		.max(128)
		.nullable()
		.describe('A unique string that identifies the `PublishInvoice` request.')
		.optional(),
});

export const UpdateInvoiceRequestSchema = z.object({
	invoice: InvoiceSchema.describe(
		'The invoice fields to add, change, or clear. Fields can be cleared using null values or the `remove` field (for individual payment requests or reminders).',
	),
	idempotency_key: z
		.string()
		.max(128)
		.nullable()
		.describe('A unique string that identifies the `UpdateInvoice` request.')
		.optional(),
	fields_to_clear: z
		.array(z.string())
		.nullable()
		.describe(
			'The list of fields to clear. Although this field is currently supported, we recommend using null values or the `remove` field when possible. For examples, see Update an Invoice.',
		)
		.optional(),
});

export const InvoiceFilterSchema = z.object({
	location_ids: z
		.array(z.string())
		.describe(
			'Limits the search to the specified locations. A location is required. In the current implementation, only one location can be specified.',
		),
	customer_ids: z
		.array(z.string())
		.nullable()
		.describe(
			'Limits the search to the specified customers, within the specified locations. Specifying a customer is optional.',
		)
		.optional(),
});

export const InvoiceSortFieldSchema = z.enum(['INVOICE_SORT_DATE']);

export const InvoiceSortSchema = z.object({
	field: InvoiceSortFieldSchema.describe(
		'The field to use for sorting. See InvoiceSortField for possible values',
	),
	order: SortOrderSchema.describe(
		'The order to use for sorting the results. See SortOrder for possible values',
	).optional(),
});

export const InvoiceQuerySchema = z.object({
	filter: InvoiceFilterSchema.describe(
		'Query filters to apply in searching invoices. For more information, see Search for invoices.',
	),
	sort: InvoiceSortSchema.describe(
		'Describes the sort order for the search result.',
	).optional(),
});

export const SearchInvoicesRequestSchema = z.object({
	query: InvoiceQuerySchema.describe(
		'Describes the query criteria for searching invoices.',
	),
	limit: z
		.number()
		.int()
		.describe(
			'The maximum number of invoices to return (200 is the maximum `limit`). If not provided, the server uses a default limit of 100 invoices.',
		)
		.optional(),
	cursor: z
		.string()
		.describe(
			'A pagination cursor returned by a previous call to this endpoint. Provide this cursor to retrieve the next set of results for your original query.',
		)
		.optional(),
});

export const DisputeStateSchema = z.enum([
	'INQUIRY_EVIDENCE_REQUIRED',
	'INQUIRY_PROCESSING',
	'INQUIRY_CLOSED',
	'EVIDENCE_REQUIRED',
	'PROCESSING',
	'WON',
	'LOST',
	'ACCEPTED',
]);

export const CreateWebhookSubscriptionRequestSchema = z.object({
	idempotency_key: z
		.string()
		.max(45)
		.describe(
			'A unique string that identifies the CreateWebhookSubscription request.',
		)
		.optional(),
	subscription: WebhookSubscriptionSchema.describe(
		'The Subscription to create.',
	),
});

export const CatalogObjectTypeSchema = z.enum([
	'ITEM',
	'IMAGE',
	'CATEGORY',
	'ITEM_VARIATION',
	'TAX',
	'DISCOUNT',
	'MODIFIER_LIST',
	'MODIFIER',
	'PRICING_RULE',
	'PRODUCT_SET',
	'TIME_PERIOD',
	'MEASUREMENT_UNIT',
	'SUBSCRIPTION_PLAN_VARIATION',
	'ITEM_OPTION',
	'ITEM_OPTION_VAL',
	'CUSTOM_ATTRIBUTE_DEFINITION',
	'QUICK_AMOUNTS_SETTINGS',
	'SUBSCRIPTION_PLAN',
	'AVAILABILITY_PERIOD',
]);

export const CatalogQuerySortedAttributeSchema = z.object({
	attribute_name: z
		.string()
		.min(1)
		.describe('The attribute whose value is used as the sort key.'),
	initial_attribute_value: z
		.string()
		.nullable()
		.describe('The first attribute value to be returned by the query.')
		.optional(),
	sort_order: SortOrderSchema.describe(
		'The desired sort order, `"ASC"` (ascending) or `"DESC"` (descending). See SortOrder for possible values',
	).optional(),
});

export const CatalogQueryExactSchema = z.object({
	attribute_name: z
		.string()
		.min(1)
		.describe(
			'The name of the attribute to be searched. Matching of the attribute name is exact.',
		),
	attribute_value: z
		.string()
		.describe(
			'The desired value of the search attribute. Matching of the attribute value is case insensitive and can be partial.',
		),
});

export const CatalogQuerySetSchema = z.object({
	attribute_name: z
		.string()
		.min(1)
		.describe(
			'The name of the attribute to be searched. Matching of the attribute name is exact.',
		),
	attribute_values: z
		.array(z.string())
		.describe(
			'The desired values of the search attribute. Matching of the attribute values is exact and case insensitive. A maximum of 250 values may be searched in a request.',
		),
});

export const CatalogQueryPrefixSchema = z.object({
	attribute_name: z
		.string()
		.min(1)
		.describe('The name of the attribute to be searched.'),
	attribute_prefix: z
		.string()
		.min(1)
		.describe('The desired prefix of the search attribute value.'),
});

export const CatalogQueryRangeSchema = z.object({
	attribute_name: z
		.string()
		.min(1)
		.describe('The name of the attribute to be searched.'),
	attribute_min_value: z
		.number()
		.int()
		.nullable()
		.describe('The desired minimum value for the search attribute (inclusive).')
		.optional(),
	attribute_max_value: z
		.number()
		.int()
		.nullable()
		.describe('The desired maximum value for the search attribute (inclusive).')
		.optional(),
});

export const CatalogQueryTextSchema = z.object({
	keywords: z
		.array(z.string())
		.describe(
			'A list of 1, 2, or 3 search keywords. Keywords with fewer than 3 alphanumeric characters are ignored.',
		),
});

export const CatalogQueryItemsForTaxSchema = z.object({
	tax_ids: z
		.array(z.string())
		.describe(
			'A set of `CatalogTax` IDs to be used to find associated `CatalogItem`s.',
		),
});

export const CatalogQueryItemsForModifierListSchema = z.object({
	modifier_list_ids: z
		.array(z.string())
		.describe(
			'A set of `CatalogModifierList` IDs to be used to find associated `CatalogItem`s.',
		),
});

export const CatalogQueryItemsForItemOptionsSchema = z.object({
	item_option_ids: z
		.array(z.string())
		.nullable()
		.describe(
			'A set of `CatalogItemOption` IDs to be used to find associated `CatalogItem`s. All Items that contain all of the given Item Options (in any order) will be returned.',
		)
		.optional(),
});

export const CatalogQueryItemVariationsForItemOptionValuesSchema = z.object({
	item_option_value_ids: z
		.array(z.string())
		.nullable()
		.describe(
			'A set of `CatalogItemOptionValue` IDs to be used to find associated `CatalogItemVariation`s.',
		)
		.optional(),
});

export const CatalogQueryModifiersForChildListSchema = z.object({
	child_modifier_list_ids: z
		.array(z.string())
		.describe(
			'The `CatalogModifierList` IDs to find parent `CatalogModifier`s for. Returns `CatalogModifier` objects where `child_modifier_list_ids` contains any of these IDs.',
		),
});

export const CatalogQuerySchema = z.object({
	sorted_attribute_query: CatalogQuerySortedAttributeSchema.describe(
		'A query expression to sort returned query result by the given attribute.',
	).optional(),
	exact_query: CatalogQueryExactSchema.describe(
		'An exact query expression to return objects with attribute name and value matching the specified attribute name and value exactly. Value matching is case insensitive.',
	).optional(),
	set_query: CatalogQuerySetSchema.describe(
		'A set query expression to return objects with attribute name and value matching the specified attribute name and any of the specified attribute values exactly.',
	).optional(),
	prefix_query: CatalogQueryPrefixSchema.describe(
		'A prefix query expression to return objects with attribute values that have a prefix matching the specified string value. Value matching is case insensitive.',
	).optional(),
	range_query: CatalogQueryRangeSchema.describe(
		'A range query expression to return objects with numeric values that lie in the specified range.',
	).optional(),
	text_query: CatalogQueryTextSchema.describe(
		'A text query expression to return objects whose searchable attributes contain all of the given keywords, irrespective of their order.',
	).optional(),
	items_for_tax_query: CatalogQueryItemsForTaxSchema.describe(
		'A query expression to return items that have any of the specified taxes (as identified by the corresponding `CatalogTax` object IDs) enabled.',
	).optional(),
	items_for_modifier_list_query:
		CatalogQueryItemsForModifierListSchema.describe(
			'A query expression to return items that have any of the given modifier list (as identified by the corresponding `CatalogModifierList`s IDs) enabled.',
		).optional(),
	items_for_item_options_query: CatalogQueryItemsForItemOptionsSchema.describe(
		'A query expression to return items that contains the specified item options (as identified the corresponding `CatalogItemOption` IDs).',
	).optional(),
	item_variations_for_item_option_values_query:
		CatalogQueryItemVariationsForItemOptionValuesSchema.describe(
			'A query expression to return item variations (of the CatalogItemVariation type) that contain all of the specified `CatalogItemOption` IDs.',
		).optional(),
	modifiers_for_child_list_query:
		CatalogQueryModifiersForChildListSchema.describe(
			'A query expression to return `CatalogModifier` objects that nest the specified modifier lists (via `child_modifier_list_ids`)',
		).optional(),
});

export const IncludeTypeSchema = z.enum([
	'INCLUDE_NESTED_MODIFIERS',
	'INCLUDE_ANCESTOR_MODIFIERS',
]);

export const IncludeOptionsSchema = z.object({
	include: z
		.array(IncludeTypeSchema)
		.nullable()
		.describe(
			'Resources to include in the response. See IncludeType for possible values',
		)
		.optional(),
});

export const SearchCatalogObjectsRequestSchema = z.object({
	cursor: z
		.string()
		.describe(
			'The pagination cursor returned in the previous response. Leave unset for an initial request. See Pagination for more information.',
		)
		.optional(),
	object_types: z
		.array(CatalogObjectTypeSchema)
		.describe(
			'The desired set of object types to appear in the search results.',
		)
		.optional(),
	include_deleted_objects: z
		.boolean()
		.describe(
			'If `true`, deleted objects will be included in the results. Defaults to `false`. Deleted objects will have their `is_deleted` field set to `true`.',
		)
		.optional(),
	include_related_objects: z
		.boolean()
		.describe(
			'If `true`, the response will include additional objects that are related to the requested objects.',
		)
		.optional(),
	begin_time: z
		.string()
		.describe(
			'Return objects modified after this timestamp, in RFC 3339 format, e.g., `2016-09-04T23:59:33.123Z`.',
		)
		.optional(),
	query: CatalogQuerySchema.describe(
		'A query to be used to filter or sort the results. If no query is specified, the entire catalog will be returned.',
	).optional(),
	limit: z
		.number()
		.int()
		.describe(
			'A limit on the number of results to be returned in a single page. The limit is advisory - the implementation may return more or fewer results.',
		)
		.optional(),
	include_category_path_to_root: z
		.boolean()
		.describe(
			'Specifies whether or not to include the `path_to_root` list for each returned category instance.',
		)
		.optional(),
	include_options: IncludeOptionsSchema.describe(
		'Options to include related resources in the response.',
	).optional(),
});

export const CatalogCustomAttributeDefinitionTypeSchema = z.enum([
	'STRING',
	'BOOLEAN',
	'NUMBER',
	'SELECTION',
]);

export const CatalogCustomAttributeValueSchema = z.object({
	name: z
		.string()
		.nullable()
		.describe('The name of the custom attribute.')
		.optional(),
	string_value: z
		.string()
		.nullable()
		.describe(
			'The string value of the custom attribute. Populated if `type` = `STRING`.',
		)
		.optional(),
	custom_attribute_definition_id: z
		.string()
		.describe(
			'The id of the CatalogCustomAttributeDefinition this value belongs to.',
		)
		.optional(),
	type: CatalogCustomAttributeDefinitionTypeSchema.describe(
		'A copy of type from the associated `CatalogCustomAttributeDefinition`. See CatalogCustomAttributeDefinitionType for possible values',
	).optional(),
	number_value: z
		.string()
		.nullable()
		.describe(
			'Populated if `type` = `NUMBER`. Contains a string representation of a decimal number, using a `.` as the decimal separator.',
		)
		.optional(),
	boolean_value: z
		.boolean()
		.nullable()
		.describe('A `true` or `false` value. Populated if `type` = `BOOLEAN`.')
		.optional(),
	selection_uid_values: z
		.array(z.string())
		.nullable()
		.describe(
			'One or more choices from `allowed_selections`. Populated if `type` = `SELECTION`.',
		)
		.optional(),
	key: z
		.string()
		.describe(
			'If the associated `CatalogCustomAttributeDefinition` object is defined by another application, this key is prefixed by the defining application ID.',
		)
		.optional(),
});

export const CatalogV1IdSchema = z.object({
	catalog_v1_id: z
		.string()
		.nullable()
		.describe(
			'The ID for an object used in the Square API V1, if the object ID differs from the Square API V2 object ID.',
		)
		.optional(),
	location_id: z
		.string()
		.nullable()
		.describe('The ID of the `Location` this Connect V1 ID is associated with.')
		.optional(),
});

export const CatalogModifierToggleOverrideTypeSchema = z.enum([
	'NO',
	'YES',
	'NOT_SET',
]);

export const CatalogItemModifierListInfoSchema = z.object({
	modifier_list_id: z
		.string()
		.min(1)
		.describe(
			'The ID of the `CatalogModifierList` controlled by this `CatalogModifierListInfo`.',
		),
	modifier_overrides: z
		.array(OpenObject)
		.nullable()
		.describe(
			'A set of `CatalogModifierOverride` objects that override default modifier settings for this item.',
		)
		.optional(),
	min_selected_modifiers: z
		.number()
		.int()
		.nullable()
		.describe(
			'The minimum number of modifiers that must be selected from this modifier list. Values:',
		)
		.optional(),
	max_selected_modifiers: z
		.number()
		.int()
		.nullable()
		.describe('The maximum number of modifiers that can be selected. Values:')
		.optional(),
	enabled: z
		.boolean()
		.nullable()
		.describe(
			'If `true`, enable this `CatalogModifierList`. The default value is `true`.',
		)
		.optional(),
	ordinal: z
		.number()
		.int()
		.nullable()
		.describe(
			'The position of this `CatalogItemModifierListInfo` object within the `modifier_list_info` list applied to a `CatalogItem` instance.',
		)
		.optional(),
	allow_quantities: CatalogModifierToggleOverrideTypeSchema.describe(
		'Controls whether multiple quantities of the same modifier can be selected for this item.',
	).optional(),
	is_conversational: CatalogModifierToggleOverrideTypeSchema.describe(
		'Controls whether conversational mode is enabled for modifiers on this item.',
	).optional(),
	hidden_from_customer_override:
		CatalogModifierToggleOverrideTypeSchema.describe(
			'Controls whether all modifiers for this item are hidden from customer receipts.',
		).optional(),
});

export const CatalogItemProductTypeSchema = z.enum([
	'REGULAR',
	'GIFT_CARD',
	'APPOINTMENTS_SERVICE',
	'FOOD_AND_BEV',
	'EVENT',
	'DIGITAL',
	'DONATION',
	'LEGACY_SQUARE_ONLINE_SERVICE',
	'LEGACY_SQUARE_ONLINE_MEMBERSHIP',
]);

export const CatalogItemOptionForItemSchema = z.object({
	item_option_id: z
		.string()
		.nullable()
		.describe(
			'The unique id of the item option, used to form the dimensions of the item option matrix in a specified order.',
		)
		.optional(),
});

export const CatalogObjectCategorySchema = z.object({
	id: z.string().describe("The ID of the object's category.").optional(),
	ordinal: z
		.number()
		.int()
		.nullable()
		.describe('The position of this object within the specified category.')
		.optional(),
});

export const CatalogEcomSeoDataSchema = z.object({
	page_title: z
		.string()
		.nullable()
		.describe('The SEO title used for the Square Online store.')
		.optional(),
	page_description: z
		.string()
		.nullable()
		.describe('The SEO description used for the Square Online store.')
		.optional(),
	permalink: z
		.string()
		.nullable()
		.describe('The SEO permalink used for the Square Online store.')
		.optional(),
});

export const CatalogItemFoodAndBeverageDetailsSchema = z.object({
	calorie_count: z
		.number()
		.int()
		.nullable()
		.describe(
			'The calorie count (in the unit of kcal) for the `FOOD_AND_BEV` type of items.',
		)
		.optional(),
	dietary_preferences: z
		.array(OpenObject)
		.nullable()
		.describe('The dietary preferences for the `FOOD_AND_BEV` item.')
		.optional(),
	ingredients: z
		.array(OpenObject)
		.nullable()
		.describe('The ingredients for the `FOOD_AND_BEV` type item.')
		.optional(),
});

export const CatalogItemSchema = z.object({
	name: z
		.string()
		.max(512)
		.nullable()
		.describe(
			"The item's name. This is a searchable attribute for use in applicable query filters, its value must not be empty, and the length is of Unicode code points.",
		)
		.optional(),
	description: z
		.string()
		.max(4096)
		.nullable()
		.describe(
			"The item's description. This is a searchable attribute for use in applicable query filters, and its value length is of Unicode code points.",
		)
		.optional(),
	abbreviation: z
		.string()
		.max(24)
		.nullable()
		.describe(
			"The text of the item's display label in the Square Point of Sale app. Only up to the first five characters of the string are used.",
		)
		.optional(),
	label_color: z
		.string()
		.nullable()
		.describe(
			"The color of the item's display label in the Square Point of Sale app. This must be a valid hex color code.",
		)
		.optional(),
	is_taxable: z
		.boolean()
		.nullable()
		.describe(
			'Indicates whether the item is taxable (`true`) or non-taxable (`false`). Default is `true`.',
		)
		.optional(),
	category_id: z
		.string()
		.nullable()
		.describe(
			"The ID of the item's category, if any. Deprecated since 2023-12-13. Use `CatalogItem.categories`, instead.",
		)
		.optional(),
	buyer_facing_name: z
		.string()
		.max(512)
		.nullable()
		.describe('The override to a product name to display to users')
		.optional(),
	tax_ids: z
		.array(z.string())
		.nullable()
		.describe(
			'A set of IDs indicating the taxes enabled for this item. When updating an item, any taxes listed here will be added to the item.',
		)
		.optional(),
	modifier_list_info: z
		.array(CatalogItemModifierListInfoSchema)
		.nullable()
		.describe(
			'A set of `CatalogItemModifierListInfo` objects representing the modifier lists that apply to this item, along with the overrides and min and max limits that are specific to this i…',
		)
		.optional(),
	variations: z
		.array(OpenObject)
		.nullable()
		.describe(
			'A list of CatalogItemVariation objects for this item. An item must have at least one variation.',
		)
		.optional(),
	product_type: CatalogItemProductTypeSchema.describe(
		'The product type of the item. Once set, the `product_type` value cannot be modified.',
	).optional(),
	skip_modifier_screen: z
		.boolean()
		.nullable()
		.describe(
			"If `false`, the Square Point of Sale app will present the `CatalogItem`'s details screen immediately, allowing the merchant to choose `CatalogModifier`s before adding the item to…",
		)
		.optional(),
	item_options: z
		.array(CatalogItemOptionForItemSchema)
		.nullable()
		.describe(
			'List of item options IDs for this item. Used to manage and group item variations in a specified order.',
		)
		.optional(),
	ecom_uri: z
		.string()
		.nullable()
		.describe(
			'Deprecated. A URI pointing to a published e-commerce product page for the Item.',
		)
		.optional(),
	ecom_image_uris: z
		.array(z.string())
		.nullable()
		.describe(
			'Deprecated. A comma-separated list of encoded URIs pointing to a set of published e-commerce images for the Item.',
		)
		.optional(),
	image_ids: z
		.array(z.string())
		.nullable()
		.describe(
			'The IDs of images associated with this `CatalogItem` instance. These images will be shown to customers in Square Online Store.',
		)
		.optional(),
	sort_name: z
		.string()
		.nullable()
		.describe(
			'A name to sort the item by. If this name is unspecified, namely, the `sort_name` field is absent, the regular `name` field is used for sorting. Its value must not be empty.',
		)
		.optional(),
	categories: z
		.array(CatalogObjectCategorySchema)
		.nullable()
		.describe(
			"The list of categories to which this item belongs. Each entry includes the category ID and an ordinal value that determines the item's relative position within that category.",
		)
		.optional(),
	description_html: z
		.string()
		.max(65535)
		.nullable()
		.describe(
			"The item's description as expressed in valid HTML elements. The length of this field value, including those of HTML tags, is of Unicode points.",
		)
		.optional(),
	description_plaintext: z
		.string()
		.max(65535)
		.describe(
			'A server-generated plaintext version of the `description_html` field, without formatting tags.',
		)
		.optional(),
	kitchen_name: z
		.string()
		.nullable()
		.describe(
			'(Optional) Name that the restaurant wants to display to their kitchen workers instead of the customer-facing name. e.g.',
		)
		.optional(),
	channels: z
		.array(z.string())
		.nullable()
		.describe(
			'A list of IDs representing channels, such as a Square Online site, where the item can be made visible or available. This field is read only and cannot be edited.',
		)
		.optional(),
	is_archived: z
		.boolean()
		.nullable()
		.describe(
			'Indicates whether this item is archived (`true`) or not (`false`).',
		)
		.optional(),
	ecom_seo_data: CatalogEcomSeoDataSchema.describe(
		"The SEO data for a seller's Square Online store.",
	).optional(),
	food_and_beverage_details: CatalogItemFoodAndBeverageDetailsSchema.describe(
		'The food and beverage-specific details for the `FOOD_AND_BEV` item.',
	).optional(),
	reporting_category: CatalogObjectCategorySchema.describe(
		"The item's reporting category.",
	).optional(),
	is_alcoholic: z
		.boolean()
		.nullable()
		.describe(
			'Indicates whether this item is alcoholic (`true`) or not (`false`).',
		)
		.optional(),
});

export const CatalogCategoryTypeSchema = z.enum([
	'REGULAR_CATEGORY',
	'MENU_CATEGORY',
	'KITCHEN_CATEGORY',
]);

export const CategoryPathToRootNodeSchema = z.object({
	category_id: z.string().nullable().describe("The category's ID.").optional(),
	category_name: z
		.string()
		.nullable()
		.describe("The category's name.")
		.optional(),
});

export const CatalogCategorySchema = z.object({
	name: z
		.string()
		.max(255)
		.nullable()
		.describe(
			'The category name. This is a searchable attribute for use in applicable query filters, and its value length is of Unicode code points.',
		)
		.optional(),
	image_ids: z
		.array(z.string())
		.nullable()
		.describe(
			'The IDs of images associated with this `CatalogCategory` instance. Currently these images are not displayed by Square, but are free to be displayed in 3rd party applications.',
		)
		.optional(),
	category_type: CatalogCategoryTypeSchema.describe(
		'The type of the category. See CatalogCategoryType for possible values',
	).optional(),
	parent_category: CatalogObjectCategorySchema.describe(
		'The parent category of this category instance.',
	).optional(),
	is_top_level: z
		.boolean()
		.nullable()
		.describe(
			'Indicates whether a category is a top level category, which does not have any parent_category.',
		)
		.optional(),
	channels: z
		.array(z.string())
		.nullable()
		.describe(
			'A list of IDs representing channels, such as a Square Online site, where the category can be made visible.',
		)
		.optional(),
	availability_period_ids: z
		.array(z.string())
		.nullable()
		.describe(
			'The IDs of the `CatalogAvailabilityPeriod` objects associated with the category.',
		)
		.optional(),
	online_visibility: z
		.boolean()
		.nullable()
		.describe(
			"Indicates whether the category is visible (`true`) or hidden (`false`) on all of the seller's Square Online sites.",
		)
		.optional(),
	root_category: z
		.string()
		.describe('The top-level category in a category hierarchy.')
		.optional(),
	ecom_seo_data: CatalogEcomSeoDataSchema.describe(
		"The SEO data for a seller's Square Online store.",
	).optional(),
	path_to_root: z
		.array(CategoryPathToRootNodeSchema)
		.nullable()
		.describe(
			'The path from the category to its root category. The first node of the path is the parent of the category and the last is the root category.',
		)
		.optional(),
});

export const CatalogPricingTypeSchema = z.enum([
	'FIXED_PRICING',
	'VARIABLE_PRICING',
]);

export const InventoryAlertTypeSchema = z.enum(['NONE', 'LOW_QUANTITY']);

export const ItemVariationLocationOverridesSchema = z.object({
	location_id: z
		.string()
		.nullable()
		.describe(
			'The ID of the `Location`. This can include locations that are deactivated.',
		)
		.optional(),
	price_money: MoneySchema.describe(
		'The price of the `CatalogItemVariation` at the given `Location`, or blank for variable pricing.',
	).optional(),
	pricing_type: CatalogPricingTypeSchema.describe(
		'The pricing type (fixed or variable) for the `CatalogItemVariation` at the given `Location`. See CatalogPricingType for possible values',
	).optional(),
	track_inventory: z
		.boolean()
		.nullable()
		.describe(
			'Indicates whether inventory tracking is active for the `CatalogItemVariation` at this `Location`. When set, this value explicitly overrides the global `track_inventory` setting.',
		)
		.optional(),
	inventory_alert_type: InventoryAlertTypeSchema.describe(
		'Indicates whether the `CatalogItemVariation` displays an alert when its inventory quantity is less than or equal to its `inventory_alert_threshold`.',
	).optional(),
	inventory_alert_threshold: z
		.number()
		.int()
		.nullable()
		.describe(
			'If the inventory quantity for the variation is less than or equal to this value and `inventory_alert_type` is `LOW_QUANTITY`, the variation displays an alert in the merchant dashb…',
		)
		.optional(),
	sold_out: z
		.boolean()
		.describe(
			'Indicates whether the overridden item variation is sold out at the specified location.',
		)
		.optional(),
	sold_out_valid_until: z
		.string()
		.describe(
			'The seller-assigned timestamp, of the RFC 3339 format, to indicate when this sold-out variation becomes available again at the specified location.',
		)
		.optional(),
});

export const CatalogItemOptionValueForItemVariationSchema = z.object({
	item_option_id: z
		.string()
		.nullable()
		.describe('The unique id of an item option.')
		.optional(),
	item_option_value_id: z
		.string()
		.nullable()
		.describe('The unique id of the selected value for the item option.')
		.optional(),
});

export const CatalogStockConversionSchema = z.object({
	stockable_item_variation_id: z
		.string()
		.min(1)
		.describe(
			'References to the stockable CatalogItemVariation for this stock conversion.',
		),
	stockable_quantity: z
		.string()
		.min(1)
		.max(16)
		.describe(
			'The quantity of the stockable item variation (as identified by `stockable_item_variation_id`) equivalent to the non-stockable item variation quantity (as specified in `nonstockabl…',
		),
	nonstockable_quantity: z
		.string()
		.min(1)
		.max(16)
		.describe(
			'The converted equivalent quantity of the non-stockable CatalogItemVariation in its measurement unit.',
		),
});

export const CatalogItemVariationVendorInformationSchema = z.object({
	vendor_id: z
		.string()
		.nullable()
		.describe(
			'ID of the Vendor linked to a default cost of this product. When the product is added to a purchase order, the default cost is pre-filled. This field is not validated.',
		)
		.optional(),
	vendor_code: z
		.string()
		.nullable()
		.describe(
			"Unique identifier of this product in the specified vendor's' inventory system.",
		)
		.optional(),
	unit_cost_money: MoneySchema.describe(
		'The unit cost of the linked product, when purchased from the linked vendor.',
	).optional(),
});

export const CatalogItemVariationSchema = z.object({
	item_id: z
		.string()
		.nullable()
		.describe(
			'The ID of the `CatalogItem` associated with this item variation.',
		)
		.optional(),
	name: z
		.string()
		.nullable()
		.describe(
			"The item variation's name. This is a searchable attribute for use in applicable query filters.",
		)
		.optional(),
	sku: z
		.string()
		.nullable()
		.describe(
			"The item variation's SKU, if any. This is a searchable attribute for use in applicable query filters.",
		)
		.optional(),
	upc: z
		.string()
		.nullable()
		.describe(
			'The universal product code (UPC) of the item variation, if any. This is a searchable attribute for use in applicable query filters.',
		)
		.optional(),
	ordinal: z
		.number()
		.int()
		.describe(
			'The order in which this item variation should be displayed. This value is read-only.',
		)
		.optional(),
	pricing_type: CatalogPricingTypeSchema.describe(
		"Indicates whether the item variation's price is fixed or determined at the time of sale. See CatalogPricingType for possible values",
	).optional(),
	price_money: MoneySchema.describe(
		"The item variation's price, if fixed pricing is used.",
	).optional(),
	location_overrides: z
		.array(ItemVariationLocationOverridesSchema)
		.nullable()
		.describe('Per-location price and inventory overrides.')
		.optional(),
	track_inventory: z
		.boolean()
		.nullable()
		.describe(
			'If `true`, inventory tracking is active for the variation at all locations by default. This value can be overridden for specific locations using `ItemVariationLocationOverrides.',
		)
		.optional(),
	inventory_alert_type: InventoryAlertTypeSchema.describe(
		'Indicates whether the item variation displays an alert when its inventory quantity is less than or equal to its `inventory_alert_threshold`.',
	).optional(),
	inventory_alert_threshold: z
		.number()
		.int()
		.nullable()
		.describe(
			'If the inventory quantity for the variation is less than or equal to this value and `inventory_alert_type` is `LOW_QUANTITY`, the variation displays an alert in the merchant dashb…',
		)
		.optional(),
	user_data: z
		.string()
		.max(255)
		.nullable()
		.describe(
			'Arbitrary user metadata to associate with the item variation. This attribute value length is of Unicode code points.',
		)
		.optional(),
	service_duration: z
		.number()
		.int()
		.nullable()
		.describe(
			'If the `CatalogItem` that owns this item variation is of type `APPOINTMENTS_SERVICE`, then this is the duration of the service in milliseconds.',
		)
		.optional(),
	available_for_booking: z
		.boolean()
		.nullable()
		.describe(
			'If the `CatalogItem` that owns this item variation is of type `APPOINTMENTS_SERVICE`, a bool representing whether this service is available for booking.',
		)
		.optional(),
	item_option_values: z
		.array(CatalogItemOptionValueForItemVariationSchema)
		.nullable()
		.describe(
			'List of item option values associated with this item variation. Listed in the same order as the item options of the parent item.',
		)
		.optional(),
	measurement_unit_id: z
		.string()
		.nullable()
		.describe(
			'ID of the ‘CatalogMeasurementUnit’ that is used to measure the quantity sold of this item variation. If left unset, the item will be sold in whole quantities.',
		)
		.optional(),
	sellable: z
		.boolean()
		.nullable()
		.describe(
			'Whether this variation can be sold. The inventory count of a sellable variation indicates the number of units available for sale.',
		)
		.optional(),
	stockable: z
		.boolean()
		.nullable()
		.describe(
			'Whether stock is counted directly on this variation (TRUE) or only on its components (FALSE).',
		)
		.optional(),
	image_ids: z
		.array(z.string())
		.nullable()
		.describe(
			'The IDs of images associated with this `CatalogItemVariation` instance. These images will be shown to customers in Square Online Store.',
		)
		.optional(),
	team_member_ids: z
		.array(z.string())
		.nullable()
		.describe(
			'Tokens of employees that can perform the service represented by this variation. Only valid for variations of type `APPOINTMENTS_SERVICE`.',
		)
		.optional(),
	stockable_conversion: CatalogStockConversionSchema.describe(
		'The unit conversion rule, as prescribed by the CatalogStockConversion type, that describes how this non-stockable (i.e.',
	).optional(),
	kitchen_name: z
		.string()
		.nullable()
		.describe(
			'(Optional) Name that the restaurant wants to display to their kitchen workers instead of the customer-facing name. e.g.',
		)
		.optional(),
	vendor_information: z
		.array(CatalogItemVariationVendorInformationSchema)
		.nullable()
		.describe('Details of the vendor this product is purchased from.')
		.optional(),
});

export const TaxCalculationPhaseSchema = z.enum([
	'TAX_SUBTOTAL_PHASE',
	'TAX_TOTAL_PHASE',
]);

export const TaxInclusionTypeSchema = z.enum(['ADDITIVE', 'INCLUSIVE']);

export const CatalogTaxSchema = z.object({
	name: z
		.string()
		.max(255)
		.nullable()
		.describe(
			"The tax's name. This is a searchable attribute for use in applicable query filters, and its value length is of Unicode code points.",
		)
		.optional(),
	calculation_phase: TaxCalculationPhaseSchema.describe(
		"Whether the tax is calculated based on a payment's subtotal or total. See TaxCalculationPhase for possible values",
	).optional(),
	inclusion_type: TaxInclusionTypeSchema.describe(
		'Whether the tax is `ADDITIVE` or `INCLUSIVE`. See TaxInclusionType for possible values',
	).optional(),
	percentage: z
		.string()
		.nullable()
		.describe(
			"The percentage of the tax in decimal form, using a `'.'` as the decimal separator and without a `'%'` sign. A value of `7.5` corresponds to 7.5%.",
		)
		.optional(),
	applies_to_custom_amounts: z
		.boolean()
		.nullable()
		.describe(
			'If `true`, the fee applies to custom amounts entered into the Square Point of Sale app that are not associated with a particular `CatalogItem`.',
		)
		.optional(),
	enabled: z
		.boolean()
		.nullable()
		.describe(
			'A Boolean flag to indicate whether the tax is displayed as enabled (`true`) in the Square Point of Sale app or not (`false`).',
		)
		.optional(),
	applies_to_product_set_id: z
		.string()
		.nullable()
		.describe(
			'The ID of a `CatalogProductSet` object. If set, the tax is applicable to all products in the product set.',
		)
		.optional(),
});

export const CatalogDiscountTypeSchema = z.enum([
	'FIXED_PERCENTAGE',
	'FIXED_AMOUNT',
	'VARIABLE_PERCENTAGE',
	'VARIABLE_AMOUNT',
]);

export const CatalogDiscountModifyTaxBasisSchema = z.enum([
	'MODIFY_TAX_BASIS',
	'DO_NOT_MODIFY_TAX_BASIS',
]);

export const CatalogDiscountSchema = z.object({
	name: z
		.string()
		.max(255)
		.nullable()
		.describe(
			'The discount name. This is a searchable attribute for use in applicable query filters, and its value length is of Unicode code points.',
		)
		.optional(),
	discount_type: CatalogDiscountTypeSchema.describe(
		'Indicates whether the discount is a fixed amount or percentage, or entered at the time of sale. See CatalogDiscountType for possible values',
	).optional(),
	percentage: z
		.string()
		.nullable()
		.describe(
			'The percentage of the discount as a string representation of a decimal number, using a `.` as the decimal separator and without a `%` sign. A value of `7.5` corresponds to `7.5%`.',
		)
		.optional(),
	amount_money: MoneySchema.describe(
		'The amount of the discount. Specify an amount of `0` if `discount_type` is `VARIABLE_AMOUNT`.',
	).optional(),
	pin_required: z
		.boolean()
		.nullable()
		.describe(
			'Indicates whether a mobile staff member needs to enter their PIN to apply the discount to a payment in the Square Point of Sale app.',
		)
		.optional(),
	label_color: z
		.string()
		.nullable()
		.describe(
			'The color of the discount display label in the Square Point of Sale app. This must be a valid hex color code.',
		)
		.optional(),
	modify_tax_basis: CatalogDiscountModifyTaxBasisSchema.describe(
		'Indicates whether this discount should reduce the price used to calculate tax.',
	).optional(),
	maximum_amount_money: MoneySchema.describe(
		'For a percentage discount, the maximum absolute value of the discount.',
	).optional(),
});

export const CatalogModifierListSelectionTypeSchema = z.enum([
	'SINGLE',
	'MULTIPLE',
]);

export const CatalogModifierListModifierTypeSchema = z.enum(['LIST', 'TEXT']);

export const CatalogModifierListSchema = z.object({
	name: z
		.string()
		.max(255)
		.nullable()
		.describe(
			'The name of the `CatalogModifierList` instance. This is a searchable attribute for use in applicable query filters, and its value length is of Unicode code points.',
		)
		.optional(),
	ordinal: z
		.number()
		.int()
		.nullable()
		.describe(
			'The position of this `CatalogModifierList` within a list of `CatalogModifierList` instances.',
		)
		.optional(),
	selection_type: CatalogModifierListSelectionTypeSchema.describe(
		'__Deprecated__: Indicates whether a single (`SINGLE`) modifier or multiple (`MULTIPLE`) modifiers can be selected.',
	).optional(),
	modifiers: z
		.array(OpenObject)
		.nullable()
		.describe(
			'A non-empty list of `CatalogModifier` objects to be included in the `CatalogModifierList`, for non text-based modifiers when the `modifier_type` attribute is `LIST`.',
		)
		.optional(),
	image_ids: z
		.array(z.string())
		.nullable()
		.describe(
			'The IDs of images associated with this `CatalogModifierList` instance. Currently these images are not displayed on Square products, but may be displayed in 3rd-party applications.',
		)
		.optional(),
	allow_quantities: z
		.boolean()
		.nullable()
		.describe(
			'When `true`, allows multiple quantities of the same modifier to be selected.',
		)
		.optional(),
	is_conversational: z
		.boolean()
		.nullable()
		.describe(
			'True if modifiers belonging to this list can be used conversationally.',
		)
		.optional(),
	modifier_type: CatalogModifierListModifierTypeSchema.describe(
		'The type of the modifier.',
	).optional(),
	max_length: z
		.number()
		.int()
		.nullable()
		.describe(
			'The maximum length, in Unicode points, of the text string of the text-based modifier as represented by this `CatalogModifierList` object with the `modifier_type` set to `TEXT`.',
		)
		.optional(),
	text_required: z
		.boolean()
		.nullable()
		.describe(
			'Whether the text string must be a non-empty string (`true`) or not (`false`) for a text-based modifier as represented by this `CatalogModifierList` object with the `modifier_type`…',
		)
		.optional(),
	internal_name: z
		.string()
		.max(512)
		.nullable()
		.describe('A note for internal use by the business.')
		.optional(),
	min_selected_modifiers: z
		.number()
		.int()
		.nullable()
		.describe(
			'The minimum number of modifiers that must be selected from this list. The value can be overridden with `CatalogItemModifierListInfo`.',
		)
		.optional(),
	max_selected_modifiers: z
		.number()
		.int()
		.nullable()
		.describe(
			'The maximum number of modifiers that must be selected from this list. The value can be overridden with `CatalogItemModifierListInfo`.',
		)
		.optional(),
	hidden_from_customer: z
		.boolean()
		.nullable()
		.describe(
			'If `true`, modifiers from this list are hidden from customer receipts. The default value is `false`. This setting can be overridden with `CatalogItemModifierListInfo.',
		)
		.optional(),
});

export const ModifierLocationOverridesSchema = z.object({
	location_id: z
		.string()
		.nullable()
		.describe(
			'The ID of the `Location` object representing the location. This can include a deactivated location.',
		)
		.optional(),
	price_money: MoneySchema.describe(
		'The overridden price at the specified location. If this is unspecified, the modifier price is not overridden.',
	).optional(),
	sold_out: z
		.boolean()
		.describe(
			'Indicates whether the modifier is sold out at the specified location or not.',
		)
		.optional(),
});

export const CatalogModifierSchema = z.object({
	name: z
		.string()
		.max(255)
		.nullable()
		.describe(
			'The modifier name. This is a searchable attribute for use in applicable query filters, and its value length is of Unicode code points.',
		)
		.optional(),
	price_money: MoneySchema.describe('The modifier price.').optional(),
	on_by_default: z
		.boolean()
		.nullable()
		.describe(
			'When `true`, this modifier is selected by default when displaying the modifier list. This setting can be overridden at the item level using `CatalogModifierListInfo.',
		)
		.optional(),
	ordinal: z
		.number()
		.int()
		.nullable()
		.describe(
			'Determines where this `CatalogModifier` appears in the `CatalogModifierList`.',
		)
		.optional(),
	modifier_list_id: z
		.string()
		.nullable()
		.describe(
			'The ID of the `CatalogModifierList` associated with this modifier.',
		)
		.optional(),
	location_overrides: z
		.array(ModifierLocationOverridesSchema)
		.nullable()
		.describe('Location-specific price overrides.')
		.optional(),
	kitchen_name: z
		.string()
		.nullable()
		.describe(
			'(Optional) Name that the restaurant wants to display to their kitchen workers instead of the customer-facing name. e.g.',
		)
		.optional(),
	image_id: z
		.string()
		.nullable()
		.describe(
			'The ID of the image associated with this `CatalogModifier` instance. Currently this image is not displayed by Square, but is free to be displayed in 3rd party applications.',
		)
		.optional(),
	hidden_online: z
		.boolean()
		.nullable()
		.describe(
			'When `true`, this modifier is hidden from online ordering channels. This setting can be overridden at the item level using `CatalogModifierListInfo.modifier_overrides`.',
		)
		.optional(),
	child_modifier_list_ids: z
		.array(z.string())
		.nullable()
		.describe(
			'Child `CatalogModifierList`s that this `CatalogModifier` nests for multi-step choices.',
		)
		.optional(),
});

export const CatalogTimePeriodSchema = z.object({
	event: z
		.string()
		.nullable()
		.describe(
			'An iCalendar (RFC 5545) event, which specifies the name, timing, duration and recurrence of this time period.',
		)
		.optional(),
});

export const CatalogProductSetSchema = z.object({
	name: z
		.string()
		.nullable()
		.describe(
			'User-defined name for the product set. For example, "Clearance Items" or "Winter Sale Items".',
		)
		.optional(),
	product_ids_any: z
		.array(z.string())
		.nullable()
		.describe(
			'Unique IDs for any `CatalogObject` included in this product set. Any number of these catalog objects can be in an order for a pricing rule to apply.',
		)
		.optional(),
	product_ids_all: z
		.array(z.string())
		.nullable()
		.describe(
			'Unique IDs for any `CatalogObject` included in this product set. All objects in this set must be included in an order for a pricing rule to apply.',
		)
		.optional(),
	quantity_exact: z
		.number()
		.int()
		.nullable()
		.describe(
			'If set, there must be exactly this many items from `products_any` or `products_all` in the cart for the discount to apply.',
		)
		.optional(),
	quantity_min: z
		.number()
		.int()
		.nullable()
		.describe(
			'If set, there must be at least this many items from `products_any` or `products_all` in a cart for the discount to apply. See `quantity_exact`.',
		)
		.optional(),
	quantity_max: z
		.number()
		.int()
		.nullable()
		.describe(
			'If set, the pricing rule will apply to a maximum of this many items from `products_any` or `products_all`.',
		)
		.optional(),
	all_products: z
		.boolean()
		.nullable()
		.describe(
			'If set to `true`, the product set will include every item in the catalog. Only one of `product_ids_all`, `product_ids_any`, or `all_products` can be set.',
		)
		.optional(),
});

export const ExcludeStrategySchema = z.enum([
	'LEAST_EXPENSIVE',
	'MOST_EXPENSIVE',
	'MOST_EXPENSIVE_LOWEST_VALUE',
]);

export const CatalogPricingRuleSchema = z.object({
	name: z
		.string()
		.nullable()
		.describe(
			'User-defined name for the pricing rule. For example, "Buy one get one free" or "10% off".',
		)
		.optional(),
	time_period_ids: z
		.array(z.string())
		.nullable()
		.describe(
			'A list of unique IDs for the catalog time periods when this pricing rule is in effect. If left unset, the pricing rule is always in effect.',
		)
		.optional(),
	discount_id: z
		.string()
		.nullable()
		.describe(
			'Unique ID for the `CatalogDiscount` to take off the price of all matched items.',
		)
		.optional(),
	match_products_id: z
		.string()
		.nullable()
		.describe(
			'Unique ID for the `CatalogProductSet` that will be matched by this rule. A match rule matches within the entire cart, and can match multiple times. This field will always be set.',
		)
		.optional(),
	apply_products_id: z
		.string()
		.nullable()
		.describe(
			'__Deprecated__: Please use the `exclude_products_id` field to apply an exclude set instead.',
		)
		.optional(),
	exclude_products_id: z
		.string()
		.nullable()
		.describe(
			'`CatalogProductSet` to exclude from the pricing rule. An exclude rule matches within the subset of the cart that fits the match rules (the match set).',
		)
		.optional(),
	valid_from_date: z
		.string()
		.nullable()
		.describe(
			'Represents the date the Pricing Rule is valid from. Represented in RFC 3339 full-date format (YYYY-MM-DD).',
		)
		.optional(),
	valid_from_local_time: z
		.string()
		.nullable()
		.describe(
			'Represents the local time the pricing rule should be valid from. Represented in RFC 3339 partial-time format (HH:MM:SS). Partial seconds will be truncated.',
		)
		.optional(),
	valid_until_date: z
		.string()
		.nullable()
		.describe(
			'Represents the date the Pricing Rule is valid until. Represented in RFC 3339 full-date format (YYYY-MM-DD).',
		)
		.optional(),
	valid_until_local_time: z
		.string()
		.nullable()
		.describe(
			'Represents the local time the pricing rule should be valid until. Represented in RFC 3339 partial-time format (HH:MM:SS). Partial seconds will be truncated.',
		)
		.optional(),
	exclude_strategy: ExcludeStrategySchema.describe(
		'If an `exclude_products_id` was given, controls which subset of matched products is excluded from any discounts.',
	).optional(),
	minimum_order_subtotal_money: MoneySchema.describe(
		'The minimum order subtotal (before discounts or taxes are applied) that must be met before this rule may be applied.',
	).optional(),
	customer_group_ids_any: z
		.array(z.string())
		.nullable()
		.describe(
			'A list of IDs of customer groups, the members of which are eligible for discounts specified in this pricing rule. Notice that a group ID is generated by the Customers API.',
		)
		.optional(),
});

export const CatalogImageSchema = z.object({
	name: z
		.string()
		.nullable()
		.describe(
			'The internal name to identify this image in calls to the Square API. This is a searchable attribute for use in applicable query filters using the SearchCatalogObjects.',
		)
		.optional(),
	url: z
		.string()
		.nullable()
		.describe(
			'The URL of this image, generated by Square after an image is uploaded using the CreateCatalogImage endpoint. To modify the image, use the UpdateCatalogImage endpoint.',
		)
		.optional(),
	caption: z
		.string()
		.nullable()
		.describe(
			'A caption that describes what is shown in the image. Displayed in the Square Online Store.',
		)
		.optional(),
	photo_studio_order_id: z
		.string()
		.nullable()
		.describe(
			'The immutable order ID for this image object created by the Photo Studio service in Square Online Store.',
		)
		.optional(),
});

export const CatalogMeasurementUnitSchema = z.object({
	measurement_unit: MeasurementUnitSchema.describe(
		'Indicates the unit used to measure the quantity of a catalog item variation.',
	).optional(),
	precision: z
		.number()
		.int()
		.nullable()
		.describe(
			'An integer between 0 and 5 that represents the maximum number of positions allowed after the decimal in quantities measured with this unit. For example:',
		)
		.optional(),
});

export const SubscriptionCadenceSchema = z.enum([
	'DAILY',
	'WEEKLY',
	'EVERY_TWO_WEEKS',
	'THIRTY_DAYS',
	'SIXTY_DAYS',
	'NINETY_DAYS',
	'MONTHLY',
	'EVERY_TWO_MONTHS',
	'QUARTERLY',
	'EVERY_FOUR_MONTHS',
	'EVERY_SIX_MONTHS',
	'ANNUAL',
	'EVERY_TWO_YEARS',
]);

export const SubscriptionPhaseSchema = z.object({
	uid: z
		.string()
		.nullable()
		.describe(
			'The Square-assigned ID of the subscription phase. This field cannot be changed after a `SubscriptionPhase` is created.',
		)
		.optional(),
	cadence: SubscriptionCadenceSchema.describe(
		'The billing cadence of the phase. For example, weekly or monthly. This field cannot be changed after a `SubscriptionPhase` is created. See SubscriptionCadence for possible values',
	),
	periods: z
		.number()
		.int()
		.nullable()
		.describe(
			'The number of `cadence`s the phase lasts. If not set, the phase never ends. Only the last phase can be indefinite.',
		)
		.optional(),
	recurring_price_money: MoneySchema.describe(
		'The amount to bill for each `cadence`. Failure to specify this field results in a `MISSING_REQUIRED_PARAMETER` error at runtime.',
	).optional(),
	ordinal: z
		.number()
		.int()
		.nullable()
		.describe(
			'The position this phase appears in the sequence of phases defined for the plan, indexed from 0. This field cannot be changed after a `SubscriptionPhase` is created.',
		)
		.optional(),
	pricing: OpenObject.describe('The subscription pricing.').optional(),
});

export const CatalogSubscriptionPlanSchema = z.object({
	name: z.string().describe('The name of the plan.'),
	phases: z
		.array(SubscriptionPhaseSchema)
		.nullable()
		.describe(
			'A list of SubscriptionPhase containing the SubscriptionPhase for this plan. This field it required. Not including this field will throw a REQUIRED_FIELD_MISSING error',
		)
		.optional(),
	subscription_plan_variations: z
		.array(OpenObject)
		.nullable()
		.describe(
			'The list of subscription plan variations available for this product',
		)
		.optional(),
	eligible_item_ids: z
		.array(z.string())
		.nullable()
		.describe(
			"The list of IDs of `CatalogItems` that are eligible for subscription by this SubscriptionPlan's variations.",
		)
		.optional(),
	eligible_category_ids: z
		.array(z.string())
		.nullable()
		.describe(
			"The list of IDs of `CatalogCategory` that are eligible for subscription by this SubscriptionPlan's variations.",
		)
		.optional(),
	all_items: z
		.boolean()
		.nullable()
		.describe(
			"If true, all items in the merchant's catalog are subscribable by this SubscriptionPlan.",
		)
		.optional(),
});

export const CatalogItemOptionSchema = z.object({
	name: z
		.string()
		.nullable()
		.describe(
			"The item option's display name for the seller. Must be unique across all item options. This is a searchable attribute for use in applicable query filters.",
		)
		.optional(),
	display_name: z
		.string()
		.nullable()
		.describe(
			"The item option's display name for the customer. This is a searchable attribute for use in applicable query filters.",
		)
		.optional(),
	description: z
		.string()
		.nullable()
		.describe(
			"The item option's human-readable description. Displayed in the Square Point of Sale app for the seller and in the Online Store or on receipts for the buyer.",
		)
		.optional(),
	show_colors: z
		.boolean()
		.nullable()
		.describe('If true, display colors for entries in `values` when present.')
		.optional(),
	values: z
		.array(OpenObject)
		.nullable()
		.describe(
			'A list of CatalogObjects containing the `CatalogItemOptionValue`s for this item.',
		)
		.optional(),
});

export const CatalogItemOptionValueSchema = z.object({
	item_option_id: z
		.string()
		.nullable()
		.describe('Unique ID of the associated item option.')
		.optional(),
	name: z
		.string()
		.nullable()
		.describe(
			'Name of this item option value. This is a searchable attribute for use in applicable query filters.',
		)
		.optional(),
	description: z
		.string()
		.nullable()
		.describe(
			'A human-readable description for the option value. This is a searchable attribute for use in applicable query filters.',
		)
		.optional(),
	color: z
		.string()
		.nullable()
		.describe(
			'The HTML-supported hex color for the item option (e.g., "#ff8d4e85"). Only displayed if `show_colors` is enabled on the parent `ItemOption`.',
		)
		.optional(),
	ordinal: z
		.number()
		.int()
		.nullable()
		.describe(
			'Determines where this option value appears in a list of option values.',
		)
		.optional(),
});

export const ProductSchema = z.enum([
	'SQUARE_POS',
	'EXTERNAL_API',
	'BILLING',
	'APPOINTMENTS',
	'INVOICES',
	'ONLINE_STORE',
	'PAYROLL',
	'DASHBOARD',
	'ITEM_LIBRARY_IMPORT',
	'OTHER',
]);

export const SourceApplicationSchema = z.object({
	product: ProductSchema.describe(
		'__Read only__ The product type of the application. See Product for possible values',
	).optional(),
	application_id: z
		.string()
		.nullable()
		.describe(
			'__Read only__ The Square-assigned ID of the application. This field is used only if the product type is `EXTERNAL_API`.',
		)
		.optional(),
	name: z
		.string()
		.nullable()
		.describe(
			'__Read only__ The display name of the application (for example, `"Custom Application"` or `"Square POS 4.74 for Android"`).',
		)
		.optional(),
});

export const CatalogCustomAttributeDefinitionSellerVisibilitySchema = z.enum([
	'SELLER_VISIBILITY_HIDDEN',
	'SELLER_VISIBILITY_READ_WRITE_VALUES',
]);

export const CatalogCustomAttributeDefinitionAppVisibilitySchema = z.enum([
	'APP_VISIBILITY_HIDDEN',
	'APP_VISIBILITY_READ_ONLY',
	'APP_VISIBILITY_READ_WRITE_VALUES',
]);

export const CatalogCustomAttributeDefinitionStringConfigSchema = z.object({
	enforce_uniqueness: z
		.boolean()
		.nullable()
		.describe(
			"If true, each Custom Attribute instance associated with this Custom Attribute Definition must have a unique value within the seller's catalog.",
		)
		.optional(),
});

export const CatalogCustomAttributeDefinitionNumberConfigSchema = z.object({
	precision: z
		.number()
		.int()
		.max(5)
		.nullable()
		.describe(
			'An integer between 0 and 5 that represents the maximum number of positions allowed after the decimal in number custom attribute values For example:',
		)
		.optional(),
});

export const CatalogCustomAttributeDefinitionSelectionConfigSchema = z.object({
	max_allowed_selections: z
		.number()
		.int()
		.max(100)
		.nullable()
		.describe(
			'The maximum number of selections that can be set. The maximum value for this attribute is 100. The default value is 1.',
		)
		.optional(),
	allowed_selections: z
		.array(OpenObject)
		.nullable()
		.describe(
			'The set of valid `CatalogCustomAttributeSelections`. Up to a maximum of 100 selections can be defined. Can be modified.',
		)
		.optional(),
});

export const CatalogCustomAttributeDefinitionSchema = z.object({
	type: CatalogCustomAttributeDefinitionTypeSchema.describe(
		'The type of this custom attribute. Cannot be modified after creation. Required. See CatalogCustomAttributeDefinitionType for possible values',
	),
	name: z
		.string()
		.min(1)
		.max(255)
		.describe(
			'The name of this definition for API and seller-facing UI purposes. The name must be unique within the (merchant, application) pair. Required.',
		),
	description: z
		.string()
		.max(255)
		.nullable()
		.describe(
			'Seller-oriented description of the meaning of this Custom Attribute, any constraints that the seller should observe, etc. May be displayed as a tooltip in Square UIs.',
		)
		.optional(),
	source_application: SourceApplicationSchema.describe(
		'__Read only.__ Contains information about the application that created this custom attribute definition.',
	).optional(),
	allowed_object_types: z
		.array(CatalogObjectTypeSchema)
		.describe(
			'The set of `CatalogObject` types that this custom atttribute may be applied to. Currently, only `ITEM`, `ITEM_VARIATION`, `MODIFIER`, `MODIFIER_LIST`, and `CATEGORY` are allowed.',
		),
	seller_visibility:
		CatalogCustomAttributeDefinitionSellerVisibilitySchema.describe(
			'The visibility of a custom attribute in seller-facing UIs (including Square Point of Sale applications and Square Dashboard). May be modified.',
		).optional(),
	app_visibility: CatalogCustomAttributeDefinitionAppVisibilitySchema.describe(
		'The visibility of a custom attribute to applications other than the application that created the attribute. See CatalogCustomAttributeDefinitionAppVisibility for possible values',
	).optional(),
	string_config: CatalogCustomAttributeDefinitionStringConfigSchema.describe(
		'Optionally, populated when `type` = `STRING`, unset otherwise.',
	).optional(),
	number_config: CatalogCustomAttributeDefinitionNumberConfigSchema.describe(
		'Optionally, populated when `type` = `NUMBER`, unset otherwise.',
	).optional(),
	selection_config:
		CatalogCustomAttributeDefinitionSelectionConfigSchema.describe(
			'Populated when `type` is set to `SELECTION`, unset otherwise.',
		).optional(),
	custom_attribute_usage_count: z
		.number()
		.int()
		.describe(
			'The number of custom attributes that reference this custom attribute definition. Set by the server in response to a ListCatalog request with `include_counts` set to `true`.',
		)
		.optional(),
	key: z
		.string()
		.min(1)
		.max(60)
		.nullable()
		.describe(
			'The name of the desired custom attribute key that can be used to access the custom attribute value on catalog objects.',
		)
		.optional(),
});

export const CatalogQuickAmountsSettingsOptionSchema = z.enum([
	'DISABLED',
	'MANUAL',
	'AUTO',
]);

export const CatalogQuickAmountTypeSchema = z.enum([
	'QUICK_AMOUNT_TYPE_MANUAL',
	'QUICK_AMOUNT_TYPE_AUTO',
]);

export const CatalogQuickAmountSchema = z.object({
	type: CatalogQuickAmountTypeSchema.describe(
		'Represents the type of the Quick Amount. See CatalogQuickAmountType for possible values',
	),
	amount: MoneySchema.describe(
		'Represents the actual amount of the Quick Amount with Money type.',
	),
	score: z
		.number()
		.int()
		.nullable()
		.describe(
			'Describes the ranking of the Quick Amount provided by machine learning model, in the range [0, 100]. MANUAL type amount will always have score = 100.',
		)
		.optional(),
	ordinal: z
		.number()
		.int()
		.nullable()
		.describe('The order in which this Quick Amount should be displayed.')
		.optional(),
});

export const CatalogQuickAmountsSettingsSchema = z.object({
	option: CatalogQuickAmountsSettingsOptionSchema.describe(
		'Represents the option seller currently uses on Quick Amounts. See CatalogQuickAmountsSettingsOption for possible values',
	),
	eligible_for_auto_amounts: z
		.boolean()
		.nullable()
		.describe(
			"Represents location's eligibility for auto amounts The boolean should be consistent with whether there are AUTO amounts in the `amounts`.",
		)
		.optional(),
	amounts: z
		.array(CatalogQuickAmountSchema)
		.nullable()
		.describe('Represents a set of Quick Amounts at this location.')
		.optional(),
});

export const CatalogSubscriptionPlanVariationSchema = z.object({
	name: z.string().describe('The name of the plan variation.'),
	phases: z
		.array(SubscriptionPhaseSchema)
		.describe(
			'A list containing each SubscriptionPhase for this plan variation.',
		),
	subscription_plan_id: z
		.string()
		.nullable()
		.describe('The id of the subscription plan, if there is one.')
		.optional(),
	monthly_billing_anchor_date: z
		.number()
		.int()
		.min(1)
		.max(31)
		.nullable()
		.describe('The day of the month the billing period starts.')
		.optional(),
	can_prorate: z
		.boolean()
		.nullable()
		.describe(
			'Whether bills for this plan variation can be split for proration.',
		)
		.optional(),
	successor_plan_variation_id: z
		.string()
		.nullable()
		.describe('The ID of a "successor" plan variation to this one.')
		.optional(),
});

export const CatalogAvailabilityPeriodSchema = z.object({
	start_local_time: z
		.string()
		.nullable()
		.describe(
			'The start time of an availability period, specified in local time using partial-time RFC 3339 format. For example, `8:30:00` for a period starting at 8:30 in the morning.',
		)
		.optional(),
	end_local_time: z
		.string()
		.nullable()
		.describe(
			'The end time of an availability period, specified in local time using partial-time RFC 3339 format. For example, `21:00:00` for a period ending at 9:00 in the evening.',
		)
		.optional(),
	day_of_week: DayOfWeekSchema.describe(
		'The day of the week for this availability period. See DayOfWeek for possible values',
	).optional(),
});

export const CatalogObjectSchema = z.object({
	type: CatalogObjectTypeSchema.describe(
		'The type of this object. Each object type has expected properties expressed in a structured format within its corresponding `*_data` field below.',
	),
	id: z
		.string()
		.min(1)
		.describe('An identifier to reference this object in the catalog.'),
	updated_at: z
		.string()
		.describe(
			'Last modification timestamp in RFC 3339 format, e.g., `"2016-08-15T23:59:33.123Z"` would indicate the UTC time (denoted by `Z`) of August 15, 2016 at 23:59:33 and 123 milliseconds.',
		)
		.optional(),
	version: z
		.number()
		.int()
		.describe(
			'The version of the object. When updating an object, the version supplied should match the version in the database. If it does not, the server attempts a three-way merge.',
		)
		.optional(),
	is_deleted: z
		.boolean()
		.nullable()
		.describe(
			'If `true`, the object has been deleted from the database. Must be `false` for new objects being inserted. When deleted, the `updated_at` field will equal the deletion time.',
		)
		.optional(),
	custom_attribute_values: z
		.record(z.string(), CatalogCustomAttributeValueSchema)
		.nullable()
		.describe(
			'A map (key-value pairs) of application-defined custom attribute values. The value of a key-value pair is a CatalogCustomAttributeValue object.',
		)
		.optional(),
	catalog_v1_ids: z
		.array(CatalogV1IdSchema)
		.nullable()
		.describe(
			"The Connect v1 IDs for this object at each location where it is present, where they differ from the object's Connect V2 ID.",
		)
		.optional(),
	present_at_all_locations: z
		.boolean()
		.nullable()
		.describe(
			'Controls whether this object is present at all locations, including future locations.',
		)
		.optional(),
	present_at_location_ids: z
		.array(z.string())
		.nullable()
		.describe(
			'Locations where the object is present, used when `present_at_all_locations` is false.',
		)
		.optional(),
	absent_at_location_ids: z
		.array(z.string())
		.nullable()
		.describe(
			'Locations where the object is not present, used when `present_at_all_locations` is true.',
		)
		.optional(),
	item_data: CatalogItemSchema.describe(
		'Structured data for a `CatalogItem`, set for CatalogObjects of type `ITEM`.',
	).optional(),
	category_data: CatalogCategorySchema.describe(
		'Structured data for a `CatalogCategory`, set for CatalogObjects of type `CATEGORY`.',
	).optional(),
	item_variation_data: CatalogItemVariationSchema.describe(
		'Structured data for a `CatalogItemVariation`, set for CatalogObjects of type `ITEM_VARIATION`.',
	).optional(),
	tax_data: CatalogTaxSchema.describe(
		'Structured data for a `CatalogTax`, set for CatalogObjects of type `TAX`.',
	).optional(),
	discount_data: CatalogDiscountSchema.describe(
		'Structured data for a `CatalogDiscount`, set for CatalogObjects of type `DISCOUNT`.',
	).optional(),
	modifier_list_data: CatalogModifierListSchema.describe(
		'Structured data for a `CatalogModifierList`, set for CatalogObjects of type `MODIFIER_LIST`.',
	).optional(),
	modifier_data: CatalogModifierSchema.describe(
		'Structured data for a `CatalogModifier`, set for CatalogObjects of type `MODIFIER`.',
	).optional(),
	time_period_data: CatalogTimePeriodSchema.describe(
		'Structured data for a `CatalogTimePeriod`, set for CatalogObjects of type `TIME_PERIOD`.',
	).optional(),
	product_set_data: CatalogProductSetSchema.describe(
		'Structured data for a `CatalogProductSet`, set for CatalogObjects of type `PRODUCT_SET`.',
	).optional(),
	pricing_rule_data: CatalogPricingRuleSchema.describe(
		'Structured data for a `CatalogPricingRule`, set for CatalogObjects of type `PRICING_RULE`.',
	).optional(),
	image_data: CatalogImageSchema.describe(
		'Structured data for a `CatalogImage`, set for CatalogObjects of type `IMAGE`.',
	).optional(),
	measurement_unit_data: CatalogMeasurementUnitSchema.describe(
		'Structured data for a `CatalogMeasurementUnit`, set for CatalogObjects of type `MEASUREMENT_UNIT`.',
	).optional(),
	subscription_plan_data: CatalogSubscriptionPlanSchema.describe(
		'Structured data for a `CatalogSubscriptionPlan`, set for CatalogObjects of type `SUBSCRIPTION_PLAN`.',
	).optional(),
	item_option_data: CatalogItemOptionSchema.describe(
		'Structured data for a `CatalogItemOption`, set for CatalogObjects of type `ITEM_OPTION`.',
	).optional(),
	item_option_value_data: CatalogItemOptionValueSchema.describe(
		'Structured data for a `CatalogItemOptionValue`, set for CatalogObjects of type `ITEM_OPTION_VAL`.',
	).optional(),
	custom_attribute_definition_data:
		CatalogCustomAttributeDefinitionSchema.describe(
			'Structured data for a `CatalogCustomAttributeDefinition`, set for CatalogObjects of type `CUSTOM_ATTRIBUTE_DEFINITION`.',
		).optional(),
	quick_amounts_settings_data: CatalogQuickAmountsSettingsSchema.describe(
		'Structured data for a `CatalogQuickAmountsSettings`, set for CatalogObjects of type `QUICK_AMOUNTS_SETTINGS`.',
	).optional(),
	subscription_plan_variation_data:
		CatalogSubscriptionPlanVariationSchema.describe(
			'Structured data for a `CatalogSubscriptionPlanVariation`, set for CatalogObjects of type `SUBSCRIPTION_PLAN_VARIATION`.',
		).optional(),
	availability_period_data: CatalogAvailabilityPeriodSchema.describe(
		'Structured data for a `CatalogAvailabilityPeriod`, set for CatalogObjects of type `AVAILABILITY_PERIOD`.',
	).optional(),
});

export const UpsertCatalogObjectRequestSchema = z.object({
	idempotency_key: z
		.string()
		.min(1)
		.max(128)
		.describe(
			'A value you specify that uniquely identifies this request among all your requests. A common way to create a valid idempotency key is to use a Universally unique identifier (UUID).',
		),
	object: CatalogObjectSchema.describe(
		'A CatalogObject to be created or updated.',
	),
});

export const InventoryStateSchema = z.enum([
	'CUSTOM',
	'IN_STOCK',
	'SOLD',
	'RETURNED_BY_CUSTOMER',
	'RESERVED_FOR_SALE',
	'SOLD_ONLINE',
	'ORDERED_FROM_VENDOR',
	'RECEIVED_FROM_VENDOR',
	'IN_TRANSIT_TO',
	'NONE',
	'WASTE',
	'UNLINKED_RETURN',
	'COMPOSED',
	'DECOMPOSED',
	'SUPPORTED_BY_NEWER_VERSION',
	'IN_TRANSIT',
	'UNTRACKED',
]);

export const BatchRetrieveInventoryCountsRequestSchema = z.object({
	catalog_object_ids: z
		.array(z.string())
		.nullable()
		.describe(
			'The filter to return results by `CatalogObject` ID. The filter is applicable only when set. The default is null.',
		)
		.optional(),
	location_ids: z
		.array(z.string())
		.nullable()
		.describe(
			'The filter to return results by `Location` ID. This filter is applicable only when set. The default is null.',
		)
		.optional(),
	updated_after: z
		.string()
		.nullable()
		.describe(
			'The filter to return results with their `calculated_at` value after the given time as specified in an RFC 3339 timestamp.',
		)
		.optional(),
	cursor: z
		.string()
		.nullable()
		.describe(
			'A pagination cursor returned by a previous call to this endpoint. Provide this to retrieve the next set of results for the original query.',
		)
		.optional(),
	states: z
		.array(InventoryStateSchema)
		.nullable()
		.describe(
			'The filter to return results by `InventoryState`. The filter is only applicable when set. Ignored are untracked states of `NONE`, `SOLD`, and `UNLINKED_RETURN`.',
		)
		.optional(),
	limit: z
		.number()
		.int()
		.min(1)
		.max(1000)
		.nullable()
		.describe('The number of records to return.')
		.optional(),
});

export const CancelPaymentByIdempotencyKeyRequestSchema = z.object({
	idempotency_key: z
		.string()
		.min(1)
		.max(45)
		.describe('The `idempotency_key` identifying the payment to be canceled.'),
});

export const PaymentLinkSchema = z.object({
	id: z
		.string()
		.describe('The Square-assigned ID of the payment link.')
		.optional(),
	version: z
		.number()
		.int()
		.max(65535)
		.describe(
			'The Square-assigned version number, which is incremented each time an update is committed to the payment link.',
		),
	description: z
		.string()
		.max(4096)
		.nullable()
		.describe(
			'The optional description of the `payment_link` object. It is primarily for use by your application and is not used anywhere.',
		)
		.optional(),
	order_id: z
		.string()
		.max(192)
		.describe('The ID of the order associated with the payment link.')
		.optional(),
	checkout_options: CheckoutOptionsSchema.describe(
		'The checkout options configured for the payment link. For more information, see Optional Checkout Configurations.',
	).optional(),
	pre_populated_data: PrePopulatedDataSchema.describe(
		'Describes buyer data to prepopulate on the checkout page.',
	).optional(),
	url: z
		.string()
		.max(255)
		.describe('The shortened URL of the payment link.')
		.optional(),
	long_url: z
		.string()
		.max(255)
		.describe('The long URL of the payment link.')
		.optional(),
	created_at: z
		.string()
		.describe(
			'The timestamp when the payment link was created, in RFC 3339 format.',
		)
		.optional(),
	updated_at: z
		.string()
		.describe(
			'The timestamp when the payment link was last updated, in RFC 3339 format.',
		)
		.optional(),
	payment_note: z
		.string()
		.max(500)
		.nullable()
		.describe(
			'An optional note. After Square processes the payment, this note is added to the resulting `Payment`.',
		)
		.optional(),
});

export const UpdatePaymentLinkRequestSchema = z.object({
	payment_link: PaymentLinkSchema.describe(
		'The `payment_link` object describing the updates to apply. For more information, see Update a payment link.',
	),
});

export const CreateMerchantCustomAttributeDefinitionRequestSchema = z.object({
	custom_attribute_definition: CustomAttributeDefinitionSchema.describe(
		'The custom attribute definition to create.',
	),
	idempotency_key: z
		.string()
		.max(45)
		.describe(
			'A unique identifier for this request, used to ensure idempotency. For more information, see Idempotency.',
		)
		.optional(),
});
