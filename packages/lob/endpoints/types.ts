import { z } from 'zod';

// Inputs use Lob's own parameter names. Outputs are `.loose()` and their
// documented fields nullish, so a field Lob adds or omits cannot fail a call
// that has already happened. Field reference: the official OpenAPI 3.0.3
// spec, version 1.22.0 (github.com/lob/lob-openapi).

// ── shared pieces ─────────────────────────────────────────────────────────

// The spec pins metadata with maxLength 500 and a pattern banning double
// quotes and backslashes, applied to the serialized form.
export const MetadataInputSchema = z
	.record(z.string(), z.string())
	.superRefine((value, ctx) => {
		for (const [key, val] of Object.entries(value)) {
			if (val.includes('"') || val.includes('\\')) {
				ctx.addIssue({
					code: 'custom',
					message: `metadata.${key} must not contain double quotes or backslashes`,
				});
			}
		}
		if (JSON.stringify(value).length > 500) {
			ctx.addIssue({
				code: 'custom',
				message: 'metadata serializes to more than 500 characters',
			});
		}
	})
	.optional();

export const MetadataOutputSchema = z.record(z.string(), z.string()).nullish();

// unknown: Lob object fields of documented but loose shape (address
// expansions, thumbnails, tracking events, failure details), passed through
// as Lob sends them rather than re-validated field by field.
export const LooseRecord = z.record(z.string(), z.unknown());

// merge_variables rides in the mailpiece body; the spec caps its serialized
// form at 25,000 characters.
// unknown: template variables are an arbitrary JSON map by design.
export const MergeVariablesSchema = z
	.record(z.string(), z.unknown())
	.superRefine((value, ctx) => {
		if (JSON.stringify(value).length > 25_000) {
			ctx.addIssue({
				code: 'custom',
				message: 'merge_variables serializes to more than 25000 characters',
			});
		}
	})
	.nullish()
	.describe('Per-mailpiece template variables, keyed by merge variable name.');

const UsZipInputSchema = z
	.string()
	.regex(/^\d{5}$/, 'Must be a 5-digit US ZIP code.')
	.describe('A 5-digit US ZIP code, such as 94107.');

export const StateCodeSchema = z
	.string()
	.regex(/^[a-zA-Z]{2}$/, 'Must be a two-letter state code.')
	.describe('Two-letter USPS state code, such as CA.');

export const LOB_US_DELIVERABILITIES = [
	'deliverable',
	'deliverable_unnecessary_unit',
	'deliverable_incorrect_unit',
	'deliverable_missing_unit',
	'undeliverable',
] as const;

export const LOB_INTL_DELIVERABILITIES = [
	'deliverable',
	'deliverable_missing_info',
	'undeliverable',
	'no_match',
] as const;

export const LOB_INTL_COVERAGES = [
	'SUBBUILDING',
	'HOUSENUMBER/BUILDING',
	'STREET',
	'LOCALITY',
	'SPARSE',
] as const;

// The spec's country_extended enum: every ISO code Lob verifies internationally
// (US territories included, the US itself excluded).
export const LOB_INTL_COUNTRIES = [
	'AD',
	'AE',
	'AF',
	'AG',
	'AI',
	'AL',
	'AN',
	'AO',
	'AQ',
	'AR',
	'AT',
	'AU',
	'AW',
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
	'BM',
	'BN',
	'BO',
	'BQ',
	'BR',
	'BS',
	'BT',
	'BW',
	'BY',
	'BZ',
	'CA',
	'CD',
	'CG',
	'CH',
	'CI',
	'CK',
	'CL',
	'CM',
	'CN',
	'CO',
	'CR',
	'CS',
	'CU',
	'CV',
	'CW',
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
	'FO',
	'FR',
	'GA',
	'GB',
	'GD',
	'GE',
	'GH',
	'GI',
	'GL',
	'GM',
	'GN',
	'GQ',
	'GR',
	'GS',
	'GT',
	'GW',
	'GY',
	'HK',
	'HN',
	'HR',
	'HT',
	'HU',
	'ID',
	'IE',
	'IL',
	'IN',
	'IO',
	'IQ',
	'IR',
	'IS',
	'IT',
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
	'MG',
	'MK',
	'ML',
	'MM',
	'MN',
	'MO',
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
	'PG',
	'PH',
	'PK',
	'PL',
	'PN',
	'PT',
	'PY',
	'QA',
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
	'UY',
	'UZ',
	'VA',
	'VC',
	'VE',
	'VG',
	'VN',
	'VU',
	'WS',
	'YE',
	'ZA',
	'ZM',
	'ZW',
] as const;

export const IntCountrySchema = z
	.enum(LOB_INTL_COUNTRIES)
	.describe(
		'Two-letter ISO 3166-1 alpha-2 country code. Outside the US and US territories this selects international processing.',
	);

export const CaseQuerySchema = z
	.enum(['upper', 'proper'])
	.optional()
	.describe(
		"Casing of the returned address lines: 'upper' (default) or 'proper'.",
	);

// ── address books and inline mailpiece addresses ──────────────────────────

const AddressBookNameInputSchema = z
	.string()
	.max(40)
	.optional()
	.describe('Recipient name, up to 40 characters.');

const AddressBookCompanyInputSchema = z
	.string()
	.max(40)
	.optional()
	.describe('Company name, up to 40 characters.');

// One object covers Lob's US and international inline address forms. The
// country selects which: absent or 'US' means the US form (city, two-letter
// state and a US ZIP all required, line lengths capped at 64); any other
// country code means the international form (line lengths capped at 200, and
// a city with state or a ZIP required).
export const InlineAddressInputSchema = z
	.object({
		name: z.string().max(40).optional(),
		company: z.string().max(40).optional(),
		phone: z.string().max(40).optional(),
		email: z.string().max(100).optional(),
		address_line1: z
			.string()
			.max(200)
			.describe('Street address. Up to 64 characters for US addresses.'),
		address_line2: z.string().max(200).optional(),
		address_city: z.string().max(200).optional(),
		address_state: z.string().max(200).optional(),
		address_zip: z.string().max(40).optional(),
		address_country: z
			.string()
			.optional()
			.describe(
				"Two-letter ISO country code. Omit or pass 'US' for a US address.",
			),
	})
	.superRefine((value, ctx) => {
		const isUs = !value.address_country || value.address_country === 'US';
		if (isUs) {
			if (!value.address_line1 || value.address_line1.length > 64) {
				ctx.addIssue({
					code: 'custom',
					message:
						'US address_line1 is required and must be at most 64 characters',
				});
			}
			if (!value.address_city) {
				ctx.addIssue({
					code: 'custom',
					message: 'US inline addresses require address_city',
				});
			}
			if (!value.address_state || !/^[a-zA-Z]{2}$/.test(value.address_state)) {
				ctx.addIssue({
					code: 'custom',
					message: 'US inline addresses require a two-letter address_state',
				});
			}
			if (!/^\d{5}(-\d{4})?$/.test(value.address_zip ?? '')) {
				ctx.addIssue({
					code: 'custom',
					message:
						'US inline addresses require address_zip formatted as 12345 or 12345-6789',
				});
			}
			return;
		}
		if (
			value.address_country &&
			!LOB_INTL_COUNTRIES.includes(
				value.address_country as (typeof LOB_INTL_COUNTRIES)[number],
			)
		) {
			ctx.addIssue({
				code: 'custom',
				message: 'address_country must be a supported two-letter ISO code',
			});
		}
		const hasCityState =
			value.address_city !== undefined && value.address_state !== undefined;
		if (!hasCityState && value.address_zip === undefined) {
			ctx.addIssue({
				code: 'custom',
				message:
					'International inline addresses require address_city with address_state, or address_zip',
			});
		}
	});

const AdrIdSchema = z
	.string()
	.min(1)
	.describe("An existing address's ID, prefixed with adr_.");

// `to` on a mailpiece: a saved address ID or an inline address.
export const MailToSchema = z
	.union([AdrIdSchema, InlineAddressInputSchema])
	.describe('Recipient: an address ID (adr_...) or an inline address.');

// Postcards mail from a US address only.
export const MailFromUsSchema = z
	.union([AdrIdSchema, InlineAddressInputSchema])
	.describe('Return address: an address ID (adr_...) or an inline US address.');

export const MailFromAnySchema = z
	.union([AdrIdSchema, InlineAddressInputSchema])
	.describe('Return address: an address ID (adr_...) or an inline address.');

// Lob renders the artwork from an HTML string, a saved template ID, or a
// hosted file. The spec's fourth form, a local file path, belongs to the
// multipart upload this plugin does not use, so it is not offered.
export const ArtworkSchema = z
	.union([
		z
			.string()
			.max(10_000)
			.regex(/</, 'An HTML string must contain markup (start with "<").'),
		z.string().regex(/^tmpl_[a-zA-Z0-9]+$/, 'Template IDs start with tmpl_.'),
		z
			.string()
			.regex(
				/^https:\/\/[-a-zA-Z0-9@:%._+~#=/]{1,256}\.(html?|pdf|png|jpg)$/,
				'Remote files must be an https URL ending in html, htm, pdf, png or jpg.',
			),
	])
	.describe(
		'HTML string (up to 10000 characters), tmpl_... template ID, or an https URL to an html, pdf, png or jpg file.',
	);

export const MailTypeSchema = z
	.enum(['usps_first_class', 'usps_standard'])
	.optional()
	.describe("Postage class. Defaults to 'usps_first_class'.");

export const SendDateSchema = z
	.string()
	.optional()
	.describe(
		'ISO 8601 date (2026-01-01) or datetime; Lob schedules production after it, up to 180 days out.',
	);

export const UseTypeSchema = z
	.enum(['marketing', 'operational'])
	.nullable()
	.describe(
		"The send's purpose for Lob's mail-use tracking: 'marketing' or 'operational'. Pass null for personal correspondence.",
	);

export const IdempotencyKeySchema = z
	.string()
	.min(1)
	.max(256)
	.optional()
	.describe(
		'Deduplication key, at most 256 characters. Lob replays within 24 hours return the original mailpiece instead of creating a duplicate.',
	);

export const BillingGroupIdSchema = z
	.string()
	.optional()
	.describe('bg_ ID of the billing group to charge.');

export const PrintSpeedSchema = z
	.enum(['core'])
	.optional()
	.describe("Production speed. Only 'core' is offered.");

export const FscSchema = z
	.boolean()
	.optional()
	.describe('Print on FSC-certified paper.');

export const QrCodeInputSchema = z
	.object({
		position: z.literal('relative').describe('Placement mode; only relative.'),
		redirect_url: z.string().optional(),
		width: z.string().describe('Width in inches, such as "2".'),
		top: z.string().optional(),
		right: z.string().optional(),
		left: z.string().optional(),
		bottom: z.string().optional(),
		pages: z
			.string()
			.optional()
			.describe('Pages or sides to print on, such as "1,2" or "front".'),
	})
	.loose()
	.optional()
	.describe('Print a tracked QR code on the piece.');

// ── reusable output shapes ────────────────────────────────────────────────

const MetadataCapNote =
	'String-to-string map; Lob caps the serialized form at 500 characters.';

export const LobAddressSchema = z
	.object({
		id: z.string().nullish(),
		name: z.string().nullish(),
		company: z.string().nullish(),
		phone: z.string().nullish(),
		email: z.string().nullish(),
		address_line1: z.string().nullish(),
		address_line2: z.string().nullish(),
		address_city: z.string().nullish(),
		address_state: z.string().nullish(),
		address_zip: z.string().nullish(),
		address_country: z.string().nullish(),
		metadata: MetadataOutputSchema.describe(MetadataCapNote),
		recipient_moved: z.boolean().nullish(),
		date_created: z.string().nullish(),
		date_modified: z.string().nullish(),
		deleted: z.boolean().nullish(),
		object: z.string().nullish(),
	})
	.loose();

export type LobAddress = z.infer<typeof LobAddressSchema>;

// One address-book row per error inside a bulk verification response.
export const LobRowErrorSchema = z
	.object({
		error: z
			.object({
				message: z.string().nullish(),
				status_code: z.number().nullish(),
				code: z.string().nullish(),
			})
			.loose(),
	})
	.loose();

const LobCreditBalanceSchema = z
	.object({
		balance: z.number().describe("The account's Lob Credits balance."),
	})
	.loose();

// ── usVerifications.verify ────────────────────────────────────────────────

const UsVerificationInputSchema = z
	.object({
		recipient: z.string().max(500).optional(),
		primary_line: z
			.string()
			.max(200)
			.optional()
			.describe("Delivery line, such as '210 King Street'."),
		secondary_line: z.string().max(200).optional(),
		urbanization: z
			.string()
			.max(200)
			.optional()
			.describe('Puerto Rico urbanization name, when the address has one.'),
		city: z.string().max(200).optional(),
		state: z.string().max(50).optional(),
		zip_code: z
			.string()
			.regex(/^\d{5}(-\d{4})?$/, 'Must be formatted as 12345 or 12345-6789.')
			.optional(),
		address: z
			.string()
			.max(500)
			.optional()
			.describe(
				'Full address on one line. When set, it replaces the component fields.',
			),
		case: CaseQuerySchema,
	})
	.superRefine((value, ctx) => {
		if (value.address !== undefined) {
			const extras = Object.entries(value)
				.filter(
					([key, val]) =>
						key !== 'address' &&
						key !== 'case' &&
						val !== undefined &&
						val !== null,
				)
				.map(([key]) => key);
			if (extras.length > 0) {
				ctx.addIssue({
					code: 'custom',
					message: `Single-line verification takes only 'address'; remove ${extras.join(', ')}`,
				});
			}
			return;
		}
		if (!value.primary_line) {
			ctx.addIssue({
				code: 'custom',
				message:
					'Provide primary_line with the component fields, or the full single-line address',
			});
			return;
		}
		const hasCityState = value.city !== undefined && value.state !== undefined;
		if (!hasCityState && value.zip_code === undefined) {
			ctx.addIssue({
				code: 'custom',
				message: 'Provide city with state, or zip_code',
			});
		}
	});

export type UsVerificationInput = z.input<typeof UsVerificationInputSchema>;

export const UsVerificationSchema = z
	.object({
		id: z.string().nullish(),
		recipient: z.string().nullish(),
		primary_line: z.string().nullish(),
		secondary_line: z.string().nullish(),
		urbanization: z.string().nullish(),
		last_line: z.string().nullish(),
		// Known values: LOB_US_DELIVERABILITIES. A string, so a new value Lob
		// adds does not fail a verification that was already billed.
		deliverability: z.string().nullish(),
		valid_address: z.boolean().nullish(),
		// unknown: 25 documented component fields of mostly US-specific enums,
		// passed through as Lob sends them.
		components: LooseRecord.nullish(),
		// unknown: DPV flags, footnotes and lint codes, passed through.
		deliverability_analysis: LooseRecord.nullish(),
		lob_confidence_score: z
			.object({
				score: z.number().nullish(),
				level: z.string().nullish(),
			})
			.loose()
			.nullish(),
		object: z.string().nullish(),
	})
	.loose();

export type UsVerification = z.infer<typeof UsVerificationSchema>;

const UsVerificationResponseSchema = UsVerificationSchema;

// ── usVerifications.bulk ──────────────────────────────────────────────────

const BulkAddressComponentSchema = z
	.object({
		recipient: z.string().max(500).optional(),
		primary_line: z.string().max(200).optional(),
		secondary_line: z.string().max(200).optional(),
		urbanization: z.string().max(200).optional(),
		city: z.string().max(200).optional(),
		state: z.string().max(50).optional(),
		zip_code: z
			.string()
			.regex(/^\d{5}(-\d{4})?$/, 'Must be formatted as 12345 or 12345-6789.')
			.optional(),
	})
	.superRefine((value, ctx) => {
		if (!value.primary_line) {
			ctx.addIssue({
				code: 'custom',
				message: 'primary_line is required for each address',
			});
			return;
		}
		const hasCityState = value.city !== undefined && value.state !== undefined;
		if (!hasCityState && value.zip_code === undefined) {
			ctx.addIssue({
				code: 'custom',
				message: 'Each address needs city with state, or zip_code',
			});
		}
	});

const UsBulkVerificationInputSchema = z.object({
	addresses: z
		.array(BulkAddressComponentSchema)
		.min(1)
		.max(20)
		.describe('Up to 20 US addresses, verified synchronously in one call.'),
	case: CaseQuerySchema,
});

export type UsBulkVerificationInput = z.input<
	typeof UsBulkVerificationInputSchema
>;

export const UsBulkVerificationResponseSchema = z.object({
	addresses: z
		.array(z.union([UsVerificationSchema, LobRowErrorSchema]))
		.describe(
			"One result per input, in order: a verification, or a row error whose 'error' object carries message and code.",
		),
	errors: z.boolean().nullish().describe('True when at least one row failed.'),
});

export type UsBulkVerificationResponse = z.infer<
	typeof UsBulkVerificationResponseSchema
>;

// ── intlVerifications.verify ──────────────────────────────────────────────

const IntlVerificationInputSchema = z
	.object({
		recipient: z.string().max(500).optional(),
		primary_line: z
			.string()
			.max(200)
			.optional()
			.describe("Delivery line, such as 'Delancey Street 123'."),
		secondary_line: z.string().max(200).optional(),
		city: z.string().max(200).optional(),
		state: z.string().max(200).optional(),
		postal_code: z.string().max(12).optional(),
		country: IntCountrySchema,
		address: z
			.string()
			.max(500)
			.optional()
			.describe(
				'Full address on one line. When set, it replaces the component fields.',
			),
	})
	.superRefine((value, ctx) => {
		if (value.address !== undefined) {
			const extras = Object.entries(value)
				.filter(
					([key, val]) =>
						key !== 'address' &&
						key !== 'country' &&
						val !== undefined &&
						val !== null,
				)
				.map(([key]) => key);
			if (extras.length > 0) {
				ctx.addIssue({
					code: 'custom',
					message: `Single-line verification takes only 'address' and 'country'; remove ${extras.join(', ')}`,
				});
			}
			return;
		}
		if (!value.primary_line) {
			ctx.addIssue({
				code: 'custom',
				message:
					'Provide primary_line with the component fields, or the single-line address',
			});
		}
	});

export type IntlVerificationInput = z.input<typeof IntlVerificationInputSchema>;

export const IntlVerificationSchema = z
	.object({
		id: z.string().nullish(),
		recipient: z.string().nullish(),
		primary_line: z.string().nullish(),
		secondary_line: z.string().nullish(),
		last_line: z.string().nullish(),
		country: z.string().nullish(),
		// Known values: LOB_INTL_COVERAGES and LOB_INTL_DELIVERABILITIES.
		coverage: z.string().nullish(),
		deliverability: z.string().nullish(),
		status: z.string().nullish(),
		// unknown: parsed international components, passed through.
		components: LooseRecord.nullish(),
		object: z.string().nullish(),
	})
	.loose();

export type IntlVerification = z.infer<typeof IntlVerificationSchema>;

// ── autocomplete.usAutocomplete ───────────────────────────────────────────

const AutocompleteInputSchema = z.object({
	address_prefix: z
		.string()
		.min(1)
		.describe("Partial primary line to complete, such as '185 Industrial P'."),
	city: z.string().optional(),
	state: z.string().optional(),
	zip_code: z.string().optional(),
	geo_ip_sort: z
		.boolean()
		.optional()
		.describe(
			'True to rank suggestions by distance to the caller IP; needs the X-Forwarded-For header Lob documents, which this plugin does not send.',
		),
	case: CaseQuerySchema,
	valid_addresses: z
		.boolean()
		.optional()
		.describe('True to return only deliverable addresses.'),
});

export type AutocompleteInput = z.input<typeof AutocompleteInputSchema>;

export const AutocompleteResponseSchema = z.object({
	id: z.string().nullish(),
	suggestions: z
		.array(
			z
				.object({
					primary_line: z.string().nullish(),
					city: z.string().nullish(),
					state: z.string().nullish(),
					zip_code: z.string().nullish(),
					object: z.string().nullish(),
				})
				.loose(),
		)
		.describe('Up to 10 completed address lines.'),
	object: z.string().nullish(),
});

export type AutocompleteResponse = z.infer<typeof AutocompleteResponseSchema>;

// ── zip.usZipLookup ───────────────────────────────────────────────────────

const ZipLookupInputSchema = z.object({
	zip_code: UsZipInputSchema,
});

export type ZipLookupInput = z.input<typeof ZipLookupInputSchema>;

export const ZipLookupResponseSchema = z.object({
	id: z.string().nullish(),
	zip_code: z.string().nullish(),
	cities: z
		.array(
			z
				.object({
					city: z.string().nullish(),
					state: z.string().nullish(),
					county: z.string().nullish(),
					county_fips: z.string().nullish(),
					preferred: z.boolean().nullish(),
				})
				.loose(),
		)
		.describe(
			'Cities sharing the ZIP; the USPS default city is first with preferred: true.',
		),
	zip_code_type: z.string().nullish(),
	object: z.string().nullish(),
});

export type ZipLookupResponse = z.infer<typeof ZipLookupResponseSchema>;

// ── addresses.create ──────────────────────────────────────────────────────

const AddressCreateInputSchema = InlineAddressInputSchema.extend({
	description: z
		.string()
		.max(255)
		.optional()
		.describe('Internal note, up to 255 characters.'),
	metadata: MetadataInputSchema,
}).superRefine((value, ctx) => {
	if (!value.name && !value.company) {
		ctx.addIssue({
			code: 'custom',
			message: 'Provide name or company: Lob requires at least one of the two',
		});
	}
});

export type AddressCreateInput = z.input<typeof AddressCreateInputSchema>;

const AddressResponseSchema = LobAddressSchema;

// ── addresses.get / addresses.delete ──────────────────────────────────────

const AddressIdInputSchema = z
	.string()
	.min(1)
	.describe("The address's ID, prefixed with adr_.");

export type AddressIdInput = { id: string };

const AddressDeleteInputSchema = AddressIdInputSchema;

export const AddressDeleteResponseSchema = z.object({
	id: z.string().nullish(),
	deleted: z.boolean().nullish(),
});

export type AddressDeleteResponse = z.infer<typeof AddressDeleteResponseSchema>;

// ── addresses.list ────────────────────────────────────────────────────────

const AddressListInputSchema = z
	.object({
		limit: z
			.number()
			.int()
			.min(1)
			.max(100)
			.optional()
			.describe('Rows per page, 1-100. Defaults to 10.'),
		before: z
			.string()
			.optional()
			.describe('Cursor: rows created before this address ID.'),
		after: z
			.string()
			.optional()
			.describe('Cursor: rows created after this address ID.'),
		include: z
			.array(z.literal('total_count'))
			.max(1)
			.optional()
			.describe("Pass ['total_count'] to have total_count filled in."),
		date_created: z
			.object({
				gt: z.string().optional(),
				gte: z.string().optional(),
				lt: z.string().optional(),
				lte: z.string().optional(),
			})
			.loose()
			.optional()
			.describe('ISO 8601 bounds on the creation timestamp.'),
		metadata: z
			.record(z.string(), z.string())
			.optional()
			.describe('Only rows whose metadata carries every given key and value.'),
	})
	.superRefine((value, ctx) => {
		if (value.before !== undefined && value.after !== undefined) {
			ctx.addIssue({
				code: 'custom',
				message: 'Use before or after, not both',
			});
		}
	});

export type AddressListInput = z.input<typeof AddressListInputSchema>;

export const AddressListResponseSchema = z.object({
	object: z.string().nullish(),
	next_url: z
		.string()
		.nullish()
		.describe('Pre-built URL for the next page; null on the last page.'),
	previous_url: z.string().nullish(),
	count: z.number().nullish(),
	total_count: z
		.number()
		.nullish()
		.describe('Present only when the request passed include: [total_count].'),
	data: z.array(LobAddressSchema),
});

export type AddressListResponse = z.infer<typeof AddressListResponseSchema>;

// ── postcards.send / postcards.get ────────────────────────────────────────

const PostcardSendInputSchema = z.object({
	to: MailToSchema,
	from: MailFromUsSchema.optional().describe(
		'Return address. Lob falls back to a permanent return address on file when omitted.',
	),
	front: ArtworkSchema,
	back: ArtworkSchema,
	size: z
		.enum(['4x6', '6x9', '6x11'])
		.optional()
		.describe("Postcard size. Defaults to '4x6'."),
	use_type: UseTypeSchema,
	mail_type: MailTypeSchema,
	merge_variables: MergeVariablesSchema,
	send_date: SendDateSchema,
	description: z.string().max(255).optional(),
	metadata: MetadataInputSchema,
	billing_group_id: BillingGroupIdSchema,
	qr_code: QrCodeInputSchema,
	fsc: FscSchema,
	print_speed: PrintSpeedSchema,
	idempotency_key: IdempotencyKeySchema,
});

export type PostcardSendInput = z.input<typeof PostcardSendInputSchema>;

export const LobPostcardSchema = z
	.object({
		id: z.string().nullish(),
		description: z.string().nullish(),
		size: z.string().nullish(),
		// unknown: an expanded address object, one shape per US/international.
		to: LooseRecord.nullish(),
		from: LooseRecord.nullish(),
		carrier: z.string().nullish(),
		// unknown: an array of {small, medium, large} signed thumbnail URLs.
		thumbnails: z.array(LooseRecord).nullish(),
		expected_delivery_date: z.string().nullish(),
		url: z
			.string()
			.nullish()
			.describe('Signed PDF preview; expires after 30 days.'),
		front_template_id: z.string().nullish(),
		back_template_id: z.string().nullish(),
		front_template_version_id: z.string().nullish(),
		back_template_version_id: z.string().nullish(),
		tracking_events: z.array(LooseRecord).nullish(),
		campaign_id: z.string().nullish(),
		use_type: z.string().nullish(),
		fsc: z.boolean().nullish(),
		status: z.string().nullish(),
		failure_reason: LooseRecord.nullish(),
		mail_type: z.string().nullish(),
		merge_variables: LooseRecord.nullish(),
		send_date: z.string().nullish(),
		metadata: MetadataOutputSchema,
		date_created: z.string().nullish(),
		date_modified: z.string().nullish(),
		deleted: z.boolean().nullish(),
		object: z.string().nullish(),
	})
	.loose();

export type LobPostcard = z.infer<typeof LobPostcardSchema>;

const PostcardGetInputSchema = z.object({
	id: z.string().min(1).describe("The postcard's ID, prefixed with psc_."),
});

export type PostcardGetInput = z.input<typeof PostcardGetInputSchema>;

const PostcardGetResponseSchema = LobPostcardSchema;

// ── letters.send / letters.get ────────────────────────────────────────────

const LetterSendInputSchema = z.object({
	to: MailToSchema,
	from: MailFromAnySchema,
	file: ArtworkSchema,
	color: z
		.boolean()
		.describe(
			'Print in color. Lob requires this field; it defaults to false when omitted server-side.',
		),
	extra_service: z
		.enum(['certified', 'certified_return_receipt', 'registered'])
		.nullish()
		.describe('Adds USPS tracking; certified and registered add fees.'),
	double_sided: z
		.boolean()
		.optional()
		.describe('Print on both sides of the paper. Defaults to true.'),
	address_placement: z
		.enum([
			'top_first_page',
			'insert_blank_page',
			'bottom_first_page_center',
			'bottom_first_page',
		])
		.optional()
		.describe("Where the address window sits. Defaults to 'top_first_page'."),
	size: z
		.enum(['us_letter', 'us_legal'])
		.optional()
		.describe(
			"Paper size. Defaults to 'us_letter'; only accepted with Lob-Version 2024-01-01 or newer.",
		),
	use_type: UseTypeSchema,
	mail_type: MailTypeSchema,
	merge_variables: MergeVariablesSchema,
	send_date: SendDateSchema,
	description: z.string().max(255).optional(),
	metadata: MetadataInputSchema,
	return_envelope: z
		.union([z.boolean(), z.string()])
		.optional()
		.describe(
			'Include a return envelope: true for the standard one, or a custom envelope ID.',
		),
	perforated_page: z
		.number()
		.int()
		.min(1)
		.optional()
		.describe('Page to perforate for a tear-off; needs return_envelope.'),
	custom_envelope: z
		.string()
		.optional()
		.describe('env_ ID of a custom envelope.'),
	cards: z
		.array(z.string())
		.max(1)
		.optional()
		.describe('card_ IDs of cards to insert (one per letter).'),
	billing_group_id: BillingGroupIdSchema,
	qr_code: QrCodeInputSchema,
	fsc: FscSchema,
	print_speed: PrintSpeedSchema,
	lob_version: z
		.string()
		.optional()
		.describe(
			"Sent as the Lob-Version header, such as '2024-01-01'; letter size needs 2024-01-01 or newer.",
		),
	idempotency_key: IdempotencyKeySchema,
});

export type LetterSendInput = z.input<typeof LetterSendInputSchema>;

export const LobLetterSchema = z
	.object({
		id: z.string().nullish(),
		description: z.string().nullish(),
		// unknown: an expanded address object, one shape per US/international.
		to: LooseRecord.nullish(),
		from: LooseRecord.nullish(),
		carrier: z.string().nullish(),
		// unknown: an array of {small, medium, large} signed thumbnail URLs.
		thumbnails: z.array(LooseRecord).nullish(),
		expected_delivery_date: z.string().nullish(),
		url: z.string().nullish(),
		template_id: z.string().nullish(),
		template_version_id: z.string().nullish(),
		tracking_events: z.array(LooseRecord).nullish(),
		tracking_number: z
			.string()
			.nullish()
			.describe('Present on certified and registered mail.'),
		extra_service: z.string().nullish(),
		// unknown: an address ID or the expanded address object.
		return_address: z.unknown().optional(),
		campaign_id: z.string().nullish(),
		use_type: z.string().nullish(),
		fsc: z.boolean().nullish(),
		status: z.string().nullish(),
		failure_reason: LooseRecord.nullish(),
		color: z.boolean().nullish(),
		double_sided: z.boolean().nullish(),
		address_placement: z.string().nullish(),
		perforated_page: z.number().nullish(),
		// unknown: true/false, or the custom return envelope object.
		return_envelope: z.unknown().optional(),
		// unknown: the custom envelope object, when one was used.
		custom_envelope: z.unknown().optional(),
		// unknown: card and buckslip objects inserted with the letter.
		cards: z.unknown().optional(),
		buckslips: z.unknown().optional(),
		mail_type: z.string().nullish(),
		merge_variables: LooseRecord.nullish(),
		send_date: z.string().nullish(),
		metadata: MetadataOutputSchema,
		date_created: z.string().nullish(),
		date_modified: z.string().nullish(),
		deleted: z.boolean().nullish(),
		object: z.string().nullish(),
	})
	.loose();

export type LobLetter = z.infer<typeof LobLetterSchema>;

const LetterGetInputSchema = z.object({
	id: z.string().min(1).describe("The letter's ID, prefixed with ltr_."),
});

export type LetterGetInput = z.input<typeof LetterGetInputSchema>;

const LetterGetResponseSchema = LobLetterSchema;

// ── account.getBalance ────────────────────────────────────────────────────

const GetBalanceInputSchema = z.object({});

export type GetBalanceInput = z.input<typeof GetBalanceInputSchema>;

export const GetBalanceResponseSchema = LobCreditBalanceSchema;

export type GetBalanceResponse = z.infer<typeof GetBalanceResponseSchema>;

// ── Registry ──────────────────────────────────────────────────────────────

export type LobBaseEndpointInputs = {
	usVerificationsVerify: UsVerificationInput;
	usVerificationsBulk: UsBulkVerificationInput;
	intlVerificationsVerify: IntlVerificationInput;
	autocompleteUsAutocomplete: AutocompleteInput;
	zipUsZipLookup: ZipLookupInput;
	addressesCreate: AddressCreateInput;
	addressesGet: AddressIdInput;
	addressesList: AddressListInput;
	addressesDelete: AddressIdInput;
	postcardsSend: PostcardSendInput;
	postcardsGet: PostcardGetInput;
	lettersSend: LetterSendInput;
	lettersGet: LetterGetInput;
	accountGetBalance: GetBalanceInput;
};

export type LobBaseEndpointOutputs = {
	usVerificationsVerify: UsVerification;
	usVerificationsBulk: UsBulkVerificationResponse;
	intlVerificationsVerify: IntlVerification;
	autocompleteUsAutocomplete: AutocompleteResponse;
	zipUsZipLookup: ZipLookupResponse;
	addressesCreate: LobAddress;
	addressesGet: LobAddress;
	addressesList: AddressListResponse;
	addressesDelete: AddressDeleteResponse;
	postcardsSend: LobPostcard;
	postcardsGet: LobPostcard;
	lettersSend: LobLetter;
	lettersGet: LobLetter;
	accountGetBalance: GetBalanceResponse;
};

export const LobBaseInputSchemas = {
	usVerificationsVerify: UsVerificationInputSchema,
	usVerificationsBulk: UsBulkVerificationInputSchema,
	intlVerificationsVerify: IntlVerificationInputSchema,
	autocompleteUsAutocomplete: AutocompleteInputSchema,
	zipUsZipLookup: ZipLookupInputSchema,
	addressesCreate: AddressCreateInputSchema,
	addressesGet: z.object({ id: AddressIdInputSchema }),
	addressesList: AddressListInputSchema,
	addressesDelete: z.object({ id: AddressDeleteInputSchema }),
	postcardsSend: PostcardSendInputSchema,
	postcardsGet: PostcardGetInputSchema,
	lettersSend: LetterSendInputSchema,
	lettersGet: LetterGetInputSchema,
	accountGetBalance: GetBalanceInputSchema,
} as const;

export const LobBaseOutputSchemas = {
	usVerificationsVerify: UsVerificationResponseSchema,
	usVerificationsBulk: UsBulkVerificationResponseSchema,
	intlVerificationsVerify: IntlVerificationSchema,
	autocompleteUsAutocomplete: AutocompleteResponseSchema,
	zipUsZipLookup: ZipLookupResponseSchema,
	addressesCreate: AddressResponseSchema,
	addressesGet: AddressResponseSchema,
	addressesList: AddressListResponseSchema,
	addressesDelete: AddressDeleteResponseSchema,
	postcardsSend: PostcardGetResponseSchema,
	postcardsGet: PostcardGetResponseSchema,
	lettersSend: LetterGetResponseSchema,
	lettersGet: LetterGetResponseSchema,
	accountGetBalance: GetBalanceResponseSchema,
} as const;
