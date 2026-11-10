import { z } from 'zod';

// Inputs use Taggun's own field names, including the `image` field on the
// encoded endpoints, which holds base64 for any accepted file type. Outputs
// are `.loose()` and their documented fields nullish: Taggun omits a property
// when it produced no value for the document, and it adds others as an account
// enables features. Spec: https://api.taggun.io/docs/swagger.json

/**
 * Pixel coordinates of a value on the document. The shape is doubly nested:
 * an array of shapes, each shape an array of corner points. Reading it as a
 * flat array of objects rejects every response that carries a region.
 */
const PointSchema = z.object({ x: z.number(), y: z.number() }).loose();

const RegionsSchema = z.array(z.array(PointSchema)).optional();

/**
 * A field Taggun returns as `{ data, confidenceLevel }`, plus verbose-only
 * helpers. `data` can be absent while the object is present, so nothing here
 * is required: the docs say optional properties are omitted, not nulled.
 */
const ConfidenceSchema = z
	.object({
		data: z.union([z.string(), z.number()]).optional(),
		confidenceLevel: z.number().optional(),
		text: z.string().optional(),
		index: z.number().optional(),
		keyword: z.string().optional(),
		currencyCode: z.string().optional(),
		regions: RegionsSchema,
	})
	.loose();

const TextValueSchema = ConfidenceSchema.extend({
	data: z.string().optional(),
});

const AmountValueSchema = ConfidenceSchema.extend({
	data: z.number().optional(),
});

const RegionTextSchema = z
	.object({
		data: z.number().optional(),
		text: z.string().optional(),
		index: z.number().optional(),
		classifyResult: z.string().optional(),
		regions: RegionsSchema,
	})
	.loose();

// ── shared request fields ─────────────────────────────────────────────────

// Taggun accepts any two-letter code and ignores one it does not act on, so
// this is a shape check, not an allowlist of the fifteen documented languages.
const LanguageSchema = z
	.string()
	.length(2)
	.describe(
		'Two-letter language hint; leave empty for auto-detection. Taggun documents en, es, fr, jp, he/iw, et, lv, lt, fi, el, zh, th, ar and kh, recommends it for ar, kh, th and he, and ignores a code it does not act on.',
	);

const TagSchema = z
	.string()
	.max(50)
	.describe('Caller-supplied identifier, maximum 50 characters.');

/** Fields every scan request accepts, whatever the document is sent as. */
const CommonScanFields = {
	language: LanguageSchema.optional(),
	near: z
		.string()
		.optional()
		.describe(
			'A location to help merchant search, typically city, state, country.',
		),
	ipAddress: z
		.string()
		.max(100)
		.optional()
		.describe('End user IP address, used for a GeoIP lookup.'),
	ignoreMerchantName: z
		.string()
		.optional()
		.describe(
			'Ignore this merchant name if detected, e.g. a customer name mistaken for the merchant.',
		),
	refresh: z
		.boolean()
		.optional()
		.describe(
			'Force reprocessing when the receipt is already stored. Costs a scan either way.',
		),
	incognito: z
		.boolean()
		.optional()
		.describe(
			"Do not store the receipt: Taggun's per-request storage opt-out.",
		),
	userId: TagSchema.optional().describe(
		'End-user identifier; duplicate checks compare across users with this.',
	),
	containerId: TagSchema.optional().describe(
		'Scope duplicate and similarity checks to scans with the same value; omit to compare account-wide.',
	),
	subAccountId: TagSchema.optional().describe(
		'Attribute usage to a subdivision of your account for reporting.',
	),
	referenceId: TagSchema.optional().describe(
		'Your own identifier for this submission, used by similarity checks and feedback.',
	),
	extractTime: z
		.boolean()
		.optional()
		.describe(
			'Return the receipt time when found; otherwise Taggun sets it to 12:00:00.000.',
		),
};

const HeadersSchema = z
	.record(z.string(), z.string())
	.optional()
	.describe(
		'Headers to forward when fetching a protected HTTPS URL the document is hosted at.',
	);

// The documented URL rule, enforced before the request: only HTTPS is
// accepted, and localhost, loopback, link-local and private-network targets
// are rejected.
const DocumentUrlSchema = z
	.string()
	.describe(
		'HTTPS URL of the receipt or invoice, reachable by Taggun. Only https is accepted; localhost, loopback, link-local and private-network targets are rejected.',
	)
	.superRefine((value, issue) => {
		let parsed: URL;
		try {
			parsed = new URL(value);
		} catch {
			issue.addIssue({ code: 'custom', message: 'not a valid absolute URL' });
			return;
		}
		if (parsed.protocol !== 'https:') {
			issue.addIssue({ code: 'custom', message: 'only https: is accepted' });
			return;
		}
		if (isPrivateTarget(parsed.hostname)) {
			issue.addIssue({
				code: 'custom',
				message:
					'localhost, loopback, link-local and private-network hosts are rejected by Taggun',
			});
		}
	});

/**
 * Taggun fetches the URL server-side, so a target only reachable from the
 * caller's network fails there with a 400. Rejecting it here keeps the failure
 * off the provider and out of the billing.
 */
function isPrivateTarget(hostname: string): boolean {
	const host = hostname.toLowerCase().replace(/^\[|\]$/g, '');
	if (
		host === 'localhost' ||
		host.endsWith('.localhost') ||
		host === '0.0.0.0' ||
		host === '::'
	) {
		return true;
	}
	if (host === '::1' || /^127\./.test(host) || /^10\./.test(host)) {
		return true;
	}
	if (/^192\.168\./.test(host)) return true;
	if (/^172\.(1[6-9]|2\d|3[01])\./.test(host)) return true;
	if (/^169\.254\./.test(host)) return true;
	if (/^fe80:/i.test(host) || /^fc[0-9a-f]{2}:/i.test(host)) return true;
	return false;
}

const Base64FileFields = {
	image: z
		.string()
		.min(1)
		.describe(
			'Base64-encoded file content. The field is named `image` for legacy reasons but accepts any supported type, including PDF.',
		),
	filename: z
		.string()
		.min(1)
		.describe('File name, used to tell Taggun the document type.'),
	contentType: z
		.string()
		.min(1)
		.describe(
			'File content type, for example `image/jpeg` or `application/pdf`.',
		),
};

const UploadedFileSchema = z
	.instanceof(Blob)
	.describe(
		'The receipt or invoice, under 20 MB: PDF, JPG, PNG, GIF or HEIC. A `File` carries its own name and type, so prefer it over a bare `Blob`.',
	);

// ── extraction responses ──────────────────────────────────────────────────

const LineItemDataSchema = z
	.object({
		quantity: ConfidenceSchema.optional(),
		unitPrice: AmountValueSchema.optional(),
		totalPrice: AmountValueSchema.optional(),
		name: TextValueSchema.optional(),
		sku: TextValueSchema.optional(),
		itemNumber: TextValueSchema.optional(),
		discountAmount: AmountValueSchema.optional(),
		category: TextValueSchema.optional(),
	})
	.loose();

const ProductLineItemSchema = z
	.object({
		data: LineItemDataSchema.optional(),
		confidenceLevel: z.number().optional(),
		text: z.string().optional(),
		index: z.number().optional(),
		regions: RegionsSchema,
	})
	.loose();

const TaxLineItemSchema = z
	.object({
		data: z
			.object({
				taxAmount: AmountValueSchema.optional(),
				netAmount: AmountValueSchema.optional(),
				grossAmount: AmountValueSchema.optional(),
				taxRate: AmountValueSchema.optional(),
				taxType: TextValueSchema.optional(),
			})
			.loose()
			.optional(),
		confidenceLevel: z.number().optional(),
		text: z.string().optional(),
		index: z.number().optional(),
	})
	.loose();

const GeoPlaceSchema = z
	.object({
		geoname_id: z.number().optional(),
		iso_code: z.string().optional(),
		code: z.string().optional(),
		// Keyed by language tag, so the keys are open but the values are names.
		names: z.record(z.string(), z.string()).optional(),
	})
	.loose();

/**
 * A GeoIP answer for `ipAddress`. Every sub-object is optional: Taggun returns
 * whichever parts of the lookup resolved.
 */
const GeoLocationSchema = z
	.object({
		city: GeoPlaceSchema.optional(),
		continent: GeoPlaceSchema.optional(),
		country: GeoPlaceSchema.optional(),
		registered_country: GeoPlaceSchema.optional(),
		subdivisions: z.array(GeoPlaceSchema).optional(),
		postal: z.object({ code: z.string().optional() }).loose().optional(),
		location: z
			.object({
				accuracy_radius: z.number().optional(),
				latitude: z.number().optional(),
				longitude: z.number().optional(),
				time_zone: z.string().optional(),
			})
			.loose()
			.optional(),
	})
	.loose();

/** Present when the account verifies merchant tax IDs against a registry. */
const MerchantVerificationSchema = z
	.object({
		verificationId: z.string().optional(),
		countryCode: z.string().optional(),
		vatNo: z.string().optional(),
		vies: z
			.object({
				valid: z.boolean().optional(),
				name: z.string().optional(),
				address: z.string().optional(),
			})
			.loose()
			.optional(),
	})
	.loose();

/** The compact answer from `simple/*`: the four core fields plus location. */
export const SimpleReceiptSchema = z
	.object({
		totalAmount: AmountValueSchema.optional(),
		taxAmount: AmountValueSchema.optional(),
		confidenceLevel: z.number().optional(),
		date: TextValueSchema.optional(),
		merchantName: TextValueSchema.optional(),
		merchantAddress: TextValueSchema.optional(),
		merchantCity: TextValueSchema.optional(),
		merchantState: TextValueSchema.optional(),
		merchantCountryCode: TextValueSchema.optional(),
		merchantPostalCode: TextValueSchema.optional(),
		// The published example returns this with only a confidenceLevel.
		merchantTypes: z
			.object({
				data: z.array(z.string()).optional(),
				confidenceLevel: z.number().optional(),
			})
			.loose()
			.optional(),
	})
	.loose();

/** The broader answer from `verbose/*`, including helper arrays and entities. */
export const VerboseReceiptSchema = SimpleReceiptSchema.extend({
	discountAmount: AmountValueSchema.optional(),
	paidAmount: AmountValueSchema.optional(),
	dueDate: TextValueSchema.optional(),
	paymentType: TextValueSchema.optional(),
	merchantTaxId: TextValueSchema.optional(),
	text: z
		.object({
			text: z.string().optional(),
			regions: RegionsSchema,
		})
		.loose()
		.optional(),
	amounts: z.array(RegionTextSchema).optional(),
	lineAmounts: z.array(RegionTextSchema).optional(),
	numbers: z.array(RegionTextSchema).optional(),
	entities: z
		.object({
			productLineItems: z.array(ProductLineItemSchema).optional(),
			multiTaxLineItems: z.array(TaxLineItemSchema).optional(),
			invoiceNumber: TextValueSchema.optional(),
			receiptNumber: TextValueSchema.optional(),
			purchaseOrderNumber: TextValueSchema.optional(),
			last4: TextValueSchema.optional(),
			category: TextValueSchema.optional(),
			masterCategory: TextValueSchema.optional(),
			expenseType: TextValueSchema.optional(),
			merchantVerification: MerchantVerificationSchema.optional(),
			qrCodeData: TextValueSchema.optional(),
		})
		.loose()
		.optional(),
	itemsCount: ConfidenceSchema.optional(),
	trackingId: z
		.string()
		.optional()
		.describe('Taggun tracking ID; quote it in support requests.'),
	targetRotation: z.number().optional(),
	elapsed: z.number().optional(),
	// Present only when `ipAddress` resolved: a GeoIP lookup of the end user,
	// separate from the extracted merchant address.
	location: GeoLocationSchema.optional(),
});

// ── simple.url ────────────────────────────────────────────────────────────

const SimpleUrlInputSchema = z
	.object({
		url: DocumentUrlSchema,
		headers: HeadersSchema,
		...CommonScanFields,
	})
	.loose();

export type SimpleUrlInput = z.input<typeof SimpleUrlInputSchema>;

export const SimpleUrlOutputSchema = SimpleReceiptSchema;

export type SimpleUrlResponse = z.output<typeof SimpleUrlOutputSchema>;

// ── simple.encoded ────────────────────────────────────────────────────────

const SimpleEncodedInputSchema = z
	.object({
		...Base64FileFields,
		...CommonScanFields,
	})
	.loose();

export type SimpleEncodedInput = z.input<typeof SimpleEncodedInputSchema>;

export const SimpleEncodedOutputSchema = SimpleReceiptSchema;

export type SimpleEncodedResponse = z.output<typeof SimpleEncodedOutputSchema>;

// ── simple.file ───────────────────────────────────────────────────────────

const SimpleFileInputSchema = z
	.object({
		file: UploadedFileSchema,
		...CommonScanFields,
	})
	.loose();

export type SimpleFileInput = z.input<typeof SimpleFileInputSchema>;

export const SimpleFileOutputSchema = SimpleReceiptSchema;

export type SimpleFileResponse = z.output<typeof SimpleFileOutputSchema>;

// ── verbose.url ───────────────────────────────────────────────────────────

const VerboseUrlInputSchema = z
	.object({
		url: DocumentUrlSchema,
		headers: HeadersSchema,
		extractLineItems: z
			.boolean()
			.optional()
			.describe(
				'Extract product line items. Taggun defaults this to true; false is faster and omits `entities.productLineItems`.',
			),
		...CommonScanFields,
	})
	.loose();

export type VerboseUrlInput = z.input<typeof VerboseUrlInputSchema>;

export const VerboseUrlOutputSchema = VerboseReceiptSchema;

export type VerboseUrlResponse = z.output<typeof VerboseUrlOutputSchema>;

// ── verbose.encoded ───────────────────────────────────────────────────────

const VerboseEncodedInputSchema = z
	.object({
		...Base64FileFields,
		extractLineItems: z
			.boolean()
			.optional()
			.describe('Extract product line items; Taggun defaults this to true.'),
		...CommonScanFields,
	})
	.loose();

export type VerboseEncodedInput = z.input<typeof VerboseEncodedInputSchema>;

export const VerboseEncodedOutputSchema = VerboseReceiptSchema;

export type VerboseEncodedResponse = z.output<
	typeof VerboseEncodedOutputSchema
>;

// ── verbose.file ──────────────────────────────────────────────────────────

const VerboseFileInputSchema = z
	.object({
		file: UploadedFileSchema,
		extractLineItems: z
			.boolean()
			.optional()
			.describe('Extract product line items; Taggun defaults this to true.'),
		...CommonScanFields,
	})
	.loose();

export type VerboseFileInput = z.input<typeof VerboseFileInputSchema>;

export const VerboseFileOutputSchema = VerboseReceiptSchema;

export type VerboseFileResponse = z.output<typeof VerboseFileOutputSchema>;

// ── campaign settings ─────────────────────────────────────────────────────

const CampaignIdSchema = z
	.string()
	.min(1)
	.max(50)
	.describe('Campaign ID, your choice, maximum 50 characters.');

const RangeSchema = z
	.object({
		min: z.number().optional(),
		max: z.number().optional(),
	})
	.loose();

const MerchantNamesSectionSchema = z
	.object({
		skip: z
			.boolean()
			.optional()
			.describe(
				'Return merchant data without adding merchant name validation to the result keys.',
			),
		allowList: z
			.array(z.string())
			.optional()
			.describe('Merchant names accepted for the campaign.'),
		blockList: z
			.array(z.string())
			.optional()
			.describe('Merchant names rejected for the campaign.'),
		list: z
			.array(z.string())
			.optional()
			.describe(
				'Accepted merchant names. Do not send this beside allowList or blockList: the docs do not define how the lists interact.',
			),
		returnFromTheList: z
			.boolean()
			.optional()
			.describe(
				'Return the matched name from the list rather than the detected text.',
			),
	})
	.loose()
	.superRefine((value, issue) => {
		const lists = [value.allowList, value.blockList, value.list].filter(
			(candidate) => candidate !== undefined,
		);
		if (lists.length > 1) {
			issue.addIssue({
				code: 'custom',
				message:
					'Send only one of allowList, blockList or list: Taggun documents one list per campaign.',
			});
		}
	});

const ProductCodesSectionSchema = z
	.object({
		skip: z.boolean().optional(),
		description: z
			.string()
			.nullable()
			.optional()
			.describe(
				'Natural-language instruction for finding codes. The public contract does not define its order against `list`, so send one or the other.',
			),
		list: z
			.array(z.string())
			.optional()
			.describe('Exact product codes accepted.'),
	})
	.loose()
	.superRefine((value, issue) => {
		if (value.description != null && value.list !== undefined) {
			issue.addIssue({
				code: 'custom',
				message:
					'Send either `description` or `list`: Taggun does not define how the two are evaluated together.',
			});
		}
	});

const ProductLineItemsSectionSchema = z
	.object({
		skip: z.boolean().optional(),
		names: z
			.array(z.string())
			.optional()
			.describe('Product names to match against the receipt line items.'),
		totalPrice: RangeSchema.optional().describe(
			'Accepted line total range. Both min and max are required when this is supplied.',
		),
		quantity: RangeSchema.optional().describe(
			'Accepted quantity range. Both min and max are required when this is supplied.',
		),
		shouldMatchAbbreviations: z
			.boolean()
			.optional()
			.describe('Also match abbreviations of the product names.'),
	})
	.loose()
	.superRefine((value, issue) => {
		requireBoth(value.totalPrice, 'totalPrice', issue);
		requireBoth(value.quantity, 'quantity', issue);
	});

/** The fields of `balanceOwing`, before any write-time rule is applied. */
const BalanceOwingShape = {
	skip: z
		.boolean()
		.optional()
		.describe(
			'Extract and return `balanceAmount` without adding `balance_amount_validated` to the result keys. Does not replace `max`.',
		),
	max: z
		.number()
		.describe(
			'Maximum accepted amount owing. Required whenever this section is sent, even with `skip`. Use a value above zero: Taggun does not compare when this is 0.',
		),
};

/**
 * The write shape. `max` must be above zero, because Taggun skips the
 * comparison when it is 0: sending that would look like a rule and behave like
 * no rule.
 */
const BalanceOwingInputSchema = z
	.object(BalanceOwingShape)
	.loose()
	.refine((value) => value.max > 0, {
		message:
			'`max` must be greater than zero: Taggun skips the comparison entirely when it is 0.',
		path: ['max'],
	});

/**
 * The stored shape, read back by `campaigns.get`. It accepts `max: 0`, because a
 * campaign created outside this plugin can hold that value; rejecting it here
 * would make those settings unreadable and so unreparable through the documented
 * get-then-update flow.
 */
const BalanceOwingStoredSchema = z.object(BalanceOwingShape).loose();

const FraudDetectionSectionSchema = z
	.object({
		skip: z.boolean().optional(),
		allowSimilarityCheck: z
			.boolean()
			.optional()
			.describe('Detect duplicate and near-duplicate stored receipts.'),
		allowTamperDetection: z
			.boolean()
			.optional()
			.describe('Run digital tampering analysis.'),
		allowDigitalDetection: z
			.boolean()
			.optional()
			.describe('Report whether the document is a digital receipt.'),
		allowHandwritingDetection: z
			.boolean()
			.optional()
			.describe(
				'Reject handwritten receipts. Requires the account feature: an unavailable detector fails unless `skip` is set.',
			),
	})
	.loose();

const SmartValidateExampleSchema = z
	.record(z.string(), z.boolean())
	.describe(
		'Expected boolean output object with exactly one clearly named key, for example `{ "is_credit_card": true }`.',
	);

const SmartValidatePromptSchema = z
	.object({
		question: z
			.string()
			.min(1)
			.describe(
				'One natural-language yes/no question answerable from the receipt itself.',
			),
		example: SmartValidateExampleSchema,
		skip: z
			.boolean()
			.optional()
			.describe('Return the answer without adding it to the validation keys.'),
	})
	.loose()
	.refine((value) => Object.keys(value.example).length === 1, {
		message: 'The example object must hold exactly one boolean key.',
		path: ['example'],
	});

const SmartValidateSectionSchema = z
	.object({
		prompts: z
			.array(SmartValidatePromptSchema)
			.min(1)
			.max(3)
			.describe('One to three prompt-based rules.'),
	})
	.loose();

/**
 * Rules that decide whether a receipt is valid. Every section is optional, and
 * empty sections may be omitted from what Taggun returns.
 *
 * The parameter carries the section's own schema type, so the built object keeps
 * a real `balanceOwing` type rather than widening it: only the write-time rule
 * differs between the two directions.
 */
function buildCampaignSettings<B extends z.ZodType>(balanceOwing: B) {
	return z
		.object({
			date: z
				.object({
					start: z
						.string()
						.describe(
							'Campaign start, UTC ISO 8601, e.g. 2026-06-01T00:00:00.000Z.',
						),
					end: z
						.string()
						.describe(
							'Campaign end, UTC ISO 8601, e.g. 2026-06-30T23:59:59.999Z.',
						),
				})
				.loose()
				.optional()
				.describe(
					'Receipt date window; both bounds are required when supplied.',
				),
			merchantNames: MerchantNamesSectionSchema.optional(),
			productCodes: ProductCodesSectionSchema.optional(),
			productLineItems: ProductLineItemsSectionSchema.optional(),
			balanceOwing: balanceOwing.optional(),
			fraudDetection: FraudDetectionSectionSchema.optional(),
			smartValidate: SmartValidateSectionSchema.optional(),
		})
		.loose();
}

/** What `campaigns.create` and `campaigns.update` accept. */
export const CampaignSettingsSchema = buildCampaignSettings(
	BalanceOwingInputSchema,
);

/**
 * What `campaigns.get` returns. A stored campaign can hold values this plugin
 * would refuse to write, so the read side must not apply write rules.
 */
export const StoredCampaignSettingsSchema = buildCampaignSettings(
	BalanceOwingStoredSchema,
);

function requireBoth(
	range: { min?: number | undefined; max?: number | undefined } | undefined,
	field: string,
	issue: z.RefinementCtx,
): void {
	if (!range) return;
	if (range.min === undefined || range.max === undefined) {
		issue.addIssue({
			code: 'custom',
			message: `${field} needs both min and max when supplied.`,
			path: [field],
		});
		return;
	}
	if (range.min > range.max) {
		issue.addIssue({
			code: 'custom',
			message: `${field}.min must not exceed ${field}.max.`,
			path: [field],
		});
	}
}

// ── campaigns.list ────────────────────────────────────────────────────────

const CampaignsListInputSchema = z.object({}).loose();

export type CampaignsListInput = z.input<typeof CampaignsListInputSchema>;

export const CampaignsListOutputSchema = z
	.array(z.string())
	.describe('Campaign IDs that have settings stored on the account.');

export type CampaignsListResponse = z.output<typeof CampaignsListOutputSchema>;

// ── campaigns.get ─────────────────────────────────────────────────────────

const CampaignsGetInputSchema = z.object({ campaignId: CampaignIdSchema });

export type CampaignsGetInput = z.input<typeof CampaignsGetInputSchema>;

export const CampaignsGetOutputSchema = StoredCampaignSettingsSchema;

export type CampaignsGetResponse = z.output<typeof CampaignsGetOutputSchema>;

// ── campaigns.create ──────────────────────────────────────────────────────

const CampaignsCreateInputSchema = z
	.object({
		campaignId: CampaignIdSchema,
		settings: CampaignSettingsSchema.describe(
			'Validation rules for the campaign. At least one section should be present: a campaign with no sections checks nothing.',
		),
	})
	.refine(
		(value) => Object.keys(value.settings).length > 0,
		'Send at least one settings section: a campaign with no rules validates nothing.',
	);

export type CampaignsCreateInput = z.input<typeof CampaignsCreateInputSchema>;

export const CampaignSettingsAckSchema = z
	.object({
		// Update and Delete put the acknowledgement in `result`; Create answers
		// the same shape.
		result: z.string().optional(),
		statusCode: z.number().optional(),
	})
	.loose();

export const CampaignsCreateOutputSchema = CampaignSettingsAckSchema;

export type CampaignsCreateResponse = z.output<
	typeof CampaignsCreateOutputSchema
>;

// ── campaigns.update ──────────────────────────────────────────────────────

const CampaignsUpdateInputSchema = z
	.object({
		campaignId: CampaignIdSchema,
		settings: CampaignSettingsSchema.describe(
			'Replaces the stored settings wholesale: every section left out is removed from the campaign.',
		),
	})
	.refine(
		(value) => Object.keys(value.settings).length > 0,
		'Send at least one settings section: an update with none of them clears every rule.',
	);

export type CampaignsUpdateInput = z.input<typeof CampaignsUpdateInputSchema>;

export const CampaignsUpdateOutputSchema = CampaignSettingsAckSchema;

export type CampaignsUpdateResponse = z.output<
	typeof CampaignsUpdateOutputSchema
>;

// ── campaigns.delete ──────────────────────────────────────────────────────

const CampaignsDeleteInputSchema = z.object({ campaignId: CampaignIdSchema });

export type CampaignsDeleteInput = z.input<typeof CampaignsDeleteInputSchema>;

export const CampaignsDeleteOutputSchema = CampaignSettingsAckSchema;

export type CampaignsDeleteResponse = z.output<
	typeof CampaignsDeleteOutputSchema
>;

// ── validation response ───────────────────────────────────────────────────

const ValidationLineItemSchema = z
	.object({
		name: z.string().optional(),
		unitPrice: z.number().optional(),
		totalPrice: z.number().optional(),
		quantity: z.number().optional(),
	})
	.loose();

const SimilarReceiptSchema = z
	.object({
		referenceId: z.string().nullish(),
		userId: z.string().nullish(),
		trackingId: z.string().optional(),
		similarityScore: z.number().optional(),
	})
	.loose();

const TamperDetectionSchema = z
	.object({
		isTampered: z.boolean().optional(),
		tamperedScore: z.number().optional(),
	})
	.loose();

const DigitalDetectionSchema = z
	.object({
		data: z
			.object({
				isDigital: z.boolean().optional(),
				digitalScore: z.number().optional(),
			})
			.loose()
			.optional(),
	})
	.loose();

/**
 * A checked field of a validation result. Taggun's generated spec
 * (api.taggun.io/docs/swagger.json, the 200 of `receipt-validation/*`) wraps
 * each value with its verdict, while the reference pages and the campaign
 * examples show the bare value. Both are accepted, so a billed scan is never
 * lost to a parse error over which form came back.
 */
function checked<T extends z.ZodType>(value: T) {
	return z
		.union([
			value,
			z
				.object({
					data: value.nullish(),
					valid: z.boolean().optional(),
					// unknown: the spec types `expected` as a string, but the
					// handwriting rule documents it as `{ "isHandwritten": false }`.
					expected: z.unknown().optional(),
					confidenceLevel: z.number().optional(),
				})
				.loose(),
		])
		.describe(
			'The value itself, or `{ data, valid, expected, confidenceLevel }` when Taggun returns it with its verdict.',
		);
}

/** Taggun lists string or number for the document numbers. */
const DocumentNumberSchema = z.union([z.string(), z.number()]).nullish();

/** Both validation families return this same pass/fail object. */
export const ValidationResultSchema = z
	.object({
		successful: z
			.boolean()
			.describe(
				'True only when every enabled check passed. A receipt that fails a rule is a successful call with `false` here, not an error.',
			),
		failedValidations: z
			.array(z.string())
			.optional()
			.describe('Validation keys that failed.'),
		passedValidations: z
			.array(z.string())
			.optional()
			.describe('Validation keys that passed.'),
		productLineItems: checked(z.array(ValidationLineItemSchema)).optional(),
		matchedProductLineItems: z
			.array(ValidationLineItemSchema)
			.optional()
			.describe('Items matched by the campaign rules.'),
		date: checked(z.string()).optional(),
		merchantName: checked(z.string()).optional(),
		merchantAddress: checked(z.string()).optional(),
		merchantCity: checked(z.string()).optional(),
		merchantState: checked(z.string()).optional(),
		merchantCountryCode: checked(z.string()).optional(),
		merchantPostalCode: checked(z.string()).optional(),
		productCodes: checked(z.array(z.string())).optional(),
		serialNumber: checked(z.string()).optional(),
		balanceAmount: checked(z.number()).nullish(),
		smartValidate: z
			.record(z.string(), checked(z.boolean()))
			.optional()
			.describe('Boolean answer per configured SmartValidate prompt.'),
		totalAmount: z.number().optional(),
		currencyCode: z.string().optional(),
		receiptNumber: DocumentNumberSchema,
		invoiceNumber: DocumentNumberSchema,
		purchaseOrderNumber: DocumentNumberSchema,
		trackingId: z.string().optional(),
		targetRotation: z.number().optional(),
		similarReceipts: z.array(SimilarReceiptSchema).optional(),
		tamperDetection: TamperDetectionSchema.optional(),
		digitalDetection: DigitalDetectionSchema.optional(),
		// unknown: each detector reports its own `data` (a score object, or null
		// when unavailable), and the inline routes nest them all here.
		fraudDetection: z
			.record(z.string(), checked(z.unknown()))
			.optional()
			.describe(
				'Inline validation only: one verdict per enabled detector, e.g. `handwritingDetection`.',
			),
	})
	.loose();

export type ValidationResult = z.output<typeof ValidationResultSchema>;

// ── campaigns.validateFile ────────────────────────────────────────────────

const CampaignValidateFileInputSchema = z
	.object({
		campaignId: CampaignIdSchema,
		file: UploadedFileSchema,
		language: LanguageSchema.optional(),
		near: z.string().optional(),
		ipAddress: z.string().optional(),
		incognito: z.boolean().optional(),
		userId: TagSchema.optional(),
		subAccountId: TagSchema.optional(),
		referenceId: TagSchema.optional(),
	})
	.loose();

export type CampaignValidateFileInput = z.input<
	typeof CampaignValidateFileInputSchema
>;

export const CampaignValidateFileOutputSchema = ValidationResultSchema;

export type CampaignValidateFileResponse = z.output<
	typeof CampaignValidateFileOutputSchema
>;

// ── campaigns.validateUrl ─────────────────────────────────────────────────

const CampaignValidateUrlInputSchema = z
	.object({
		campaignId: CampaignIdSchema,
		url: DocumentUrlSchema,
		headers: HeadersSchema,
		language: LanguageSchema.optional(),
		near: z.string().optional(),
		ipAddress: z.string().optional(),
		incognito: z.boolean().optional(),
		userId: TagSchema.optional(),
		subAccountId: TagSchema.optional(),
		referenceId: TagSchema.optional(),
	})
	.loose();

export type CampaignValidateUrlInput = z.input<
	typeof CampaignValidateUrlInputSchema
>;

export const CampaignValidateUrlOutputSchema = ValidationResultSchema;

export type CampaignValidateUrlResponse = z.output<
	typeof CampaignValidateUrlOutputSchema
>;

// ── receiptValidation rules (inline) ──────────────────────────────────────

/**
 * Inline rules differ from campaign settings: the sections use `allowed` and
 * `blocked` rather than `allowList`, and every section takes `required: false`
 * to report evidence without affecting `successful`.
 */
const InlineRuleBase = {
	required: z
		.boolean()
		.optional()
		.describe(
			"Set false to return this rule's output without letting a failure affect `successful`. Taggun defaults it to true.",
		),
};

const InlineDateRuleSchema = z
	.object({
		start: z.string().describe('Allowed purchase period start, UTC ISO 8601.'),
		end: z.string().describe('Allowed purchase period end, UTC ISO 8601.'),
		...InlineRuleBase,
	})
	.loose();

const InlineMerchantNameRuleSchema = z
	.object({
		allowed: z
			.array(z.string().min(1))
			.min(1)
			.optional()
			.describe('Merchant names allowed for this receipt.'),
		blocked: z
			.array(z.string().min(1))
			.min(1)
			.optional()
			.describe('Merchant names rejected for this receipt.'),
		returnFromTheList: z
			.boolean()
			.optional()
			.describe('Return the exact allowed name when it matches.'),
		...InlineRuleBase,
	})
	.loose();

const InlineMerchantAddressRuleSchema = z
	.object({
		value: z.string().min(1).describe('Merchant address to match.'),
		confidenceThreshold: z
			.number()
			.min(0)
			.max(0.99)
			.optional()
			.describe(
				'Minimum distance-weighted address confidence. Taggun defaults to 0.8.',
			),
		...InlineRuleBase,
	})
	.loose();

const InlineProductCodesRuleSchema = z
	.object({
		description: z.string().optional(),
		allowed: z
			.array(z.string().min(1))
			.min(1)
			.optional()
			.describe('Product codes to match.'),
		...InlineRuleBase,
	})
	.loose();

const InlineSerialNumberRuleSchema = z
	.object({
		value: z.string().min(1).describe('Serial number to find on the receipt.'),
		...InlineRuleBase,
	})
	.loose();

const InlineBalanceOwingRuleSchema = z
	.object({
		max: z.number().describe('Maximum allowed balance owing.'),
		...InlineRuleBase,
	})
	.loose();

const InlineProductRuleSchema = z
	.object({
		names: z.array(z.string().min(1)).min(1).optional(),
		sku: z
			.object({ allowed: z.array(z.string().min(1)).min(1) })
			.loose()
			.optional(),
		modelNumber: z
			.object({ allowed: z.array(z.string().min(1)).min(1) })
			.loose()
			.optional(),
		unitPrice: RangeSchema.optional(),
		totalPrice: RangeSchema.optional(),
		quantity: RangeSchema.optional(),
		shouldMatchAbbreviations: z.boolean().optional(),
	})
	.loose();

const InlineProductLineItemsRuleSchema = z
	.object({
		products: z
			.array(InlineProductRuleSchema)
			.min(1)
			.describe(
				'Alternative product matching rules; a receipt matching any one passes.',
			),
		...InlineRuleBase,
	})
	.loose();

const InlineDetectionRuleSchema = z
	.object({
		enabled: z.boolean(),
		...InlineRuleBase,
	})
	.loose();

const InlineFraudDetectionRuleSchema = z
	.object({
		similarityCheck: InlineDetectionRuleSchema.optional(),
		tamperDetection: InlineDetectionRuleSchema.optional(),
		handwritingDetection: InlineDetectionRuleSchema.optional(),
		digitalDetection: InlineDetectionRuleSchema.optional(),
	})
	.loose();

const InlineSmartValidateRuleSchema = z
	.object({
		prompts: z.array(SmartValidatePromptSchema).min(1),
	})
	.loose();

export const InlineValidationRulesSchema = z
	.object({
		date: InlineDateRuleSchema.optional(),
		merchantName: InlineMerchantNameRuleSchema.optional(),
		merchantAddress: InlineMerchantAddressRuleSchema.optional(),
		productCodes: InlineProductCodesRuleSchema.optional(),
		serialNumber: InlineSerialNumberRuleSchema.optional(),
		balanceOwing: InlineBalanceOwingRuleSchema.optional(),
		productLineItems: InlineProductLineItemsRuleSchema.optional(),
		fraudDetection: InlineFraudDetectionRuleSchema.optional(),
		smartValidate: InlineSmartValidateRuleSchema.optional(),
	})
	.loose();

export type InlineValidationRules = z.output<
	typeof InlineValidationRulesSchema
>;

const InlineValidationSharedFields = {
	validation: InlineValidationRulesSchema.describe(
		'Rules for this request; nothing is stored.',
	),
	additionalExtractionFields: z
		.array(z.literal('modelNumber'))
		.optional()
		.describe(
			'Extra fields to expose on extracted objects. Only `modelNumber` is supported.',
		),
	containerId: TagSchema.optional(),
	incognito: z.boolean().optional(),
	ipAddress: z.string().optional(),
	near: z.string().optional(),
	referenceId: TagSchema.optional(),
	userId: TagSchema.optional(),
	subAccountId: z
		.string()
		.max(100)
		.optional()
		.describe(
			'Attribute usage to a subdivision of the account. Up to 100 characters on receipt-validation requests.',
		),
	language: LanguageSchema.optional(),
};

// ── receiptValidation.file ────────────────────────────────────────────────

const ReceiptValidateFileInputSchema = z
	.object({
		file: UploadedFileSchema,
		...InlineValidationSharedFields,
	})
	.loose();

export type ReceiptValidateFileInput = z.input<
	typeof ReceiptValidateFileInputSchema
>;

export const ReceiptValidateFileOutputSchema = ValidationResultSchema;

export type ReceiptValidateFileResponse = z.output<
	typeof ReceiptValidateFileOutputSchema
>;

// ── receiptValidation.url ─────────────────────────────────────────────────

const ReceiptValidateUrlInputSchema = z
	.object({
		url: DocumentUrlSchema,
		headers: HeadersSchema,
		...InlineValidationSharedFields,
	})
	.loose();

export type ReceiptValidateUrlInput = z.input<
	typeof ReceiptValidateUrlInputSchema
>;

export const ReceiptValidateUrlOutputSchema = ValidationResultSchema;

export type ReceiptValidateUrlResponse = z.output<
	typeof ReceiptValidateUrlOutputSchema
>;

// ── endpoint maps ─────────────────────────────────────────────────────────

export const TaggunEndpointInputSchemas = {
	simpleUrl: SimpleUrlInputSchema,
	simpleEncoded: SimpleEncodedInputSchema,
	simpleFile: SimpleFileInputSchema,
	verboseUrl: VerboseUrlInputSchema,
	verboseEncoded: VerboseEncodedInputSchema,
	verboseFile: VerboseFileInputSchema,
	campaignsList: CampaignsListInputSchema,
	campaignsGet: CampaignsGetInputSchema,
	campaignsCreate: CampaignsCreateInputSchema,
	campaignsUpdate: CampaignsUpdateInputSchema,
	campaignsDelete: CampaignsDeleteInputSchema,
	campaignsValidateFile: CampaignValidateFileInputSchema,
	campaignsValidateUrl: CampaignValidateUrlInputSchema,
	receiptValidateFile: ReceiptValidateFileInputSchema,
	receiptValidateUrl: ReceiptValidateUrlInputSchema,
} as const;

export const TaggunEndpointOutputSchemas = {
	simpleUrl: SimpleUrlOutputSchema,
	simpleEncoded: SimpleEncodedOutputSchema,
	simpleFile: SimpleFileOutputSchema,
	verboseUrl: VerboseUrlOutputSchema,
	verboseEncoded: VerboseEncodedOutputSchema,
	verboseFile: VerboseFileOutputSchema,
	campaignsList: CampaignsListOutputSchema,
	campaignsGet: CampaignsGetOutputSchema,
	campaignsCreate: CampaignsCreateOutputSchema,
	campaignsUpdate: CampaignsUpdateOutputSchema,
	campaignsDelete: CampaignsDeleteOutputSchema,
	campaignsValidateFile: CampaignValidateFileOutputSchema,
	campaignsValidateUrl: CampaignValidateUrlOutputSchema,
	receiptValidateFile: ReceiptValidateFileOutputSchema,
	receiptValidateUrl: ReceiptValidateUrlOutputSchema,
} as const;

export type TaggunEndpointInputs = {
	simpleUrl: SimpleUrlInput;
	simpleEncoded: SimpleEncodedInput;
	simpleFile: SimpleFileInput;
	verboseUrl: VerboseUrlInput;
	verboseEncoded: VerboseEncodedInput;
	verboseFile: VerboseFileInput;
	campaignsList: CampaignsListInput;
	campaignsGet: CampaignsGetInput;
	campaignsCreate: CampaignsCreateInput;
	campaignsUpdate: CampaignsUpdateInput;
	campaignsDelete: CampaignsDeleteInput;
	campaignsValidateFile: CampaignValidateFileInput;
	campaignsValidateUrl: CampaignValidateUrlInput;
	receiptValidateFile: ReceiptValidateFileInput;
	receiptValidateUrl: ReceiptValidateUrlInput;
};

export type TaggunEndpointOutputs = {
	simpleUrl: SimpleUrlResponse;
	simpleEncoded: SimpleEncodedResponse;
	simpleFile: SimpleFileResponse;
	verboseUrl: VerboseUrlResponse;
	verboseEncoded: VerboseEncodedResponse;
	verboseFile: VerboseFileResponse;
	campaignsList: CampaignsListResponse;
	campaignsGet: CampaignsGetResponse;
	campaignsCreate: CampaignsCreateResponse;
	campaignsUpdate: CampaignsUpdateResponse;
	campaignsDelete: CampaignsDeleteResponse;
	campaignsValidateFile: CampaignValidateFileResponse;
	campaignsValidateUrl: CampaignValidateUrlResponse;
	receiptValidateFile: ReceiptValidateFileResponse;
	receiptValidateUrl: ReceiptValidateUrlResponse;
};
