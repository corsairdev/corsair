import { z } from 'zod';

// Inputs use Stannp's own parameter names (snake_case, plus the PHP-style
// recipient[...] brackets, flattened here). Outputs are `.loose()` and their
// documented fields nullish, so a field Stannp adds or omits cannot fail a
// call that has already happened. Field reference:
// https://www.stannp.com/stannp-api-llm.md and the pages under
// https://www.stannp.com/us/direct-mail-api/

const positiveInt = z.number().int().positive();

// A two-letter code where the docs ask for one (country, US state, CA
// province). Not a closed enum: the docs name examples, not the full list.
const countryCode = z.string().length(2);

const isoDate = z
	.string()
	.regex(/^\d{4}-\d{2}-\d{2}$/, 'Expected YYYY-MM-DD')
	.describe('A date in YYYY-MM-DD format.');

// The docs show list ids as strings ("1943") and mailpiece ids as numbers,
// but the live API mixes them: recipients.get and campaigns.get/list answer
// numbers where the examples show strings, and recipientEvents/create
// answers "0". Response fields accept either form and keep the documented
// type: numbers become strings for `str`, numeric strings numbers for `num`.
const str = z.union([z.string(), z.number().transform(String)]).nullish();
const num = z
	.union([
		z.number(),
		z
			.string()
			.regex(/^-?\d+(\.\d+)?$/)
			.transform(Number),
	])
	.nullish();

// Shared by the write operations the docs' idempotency section covers.
function idempotencyKeyField() {
	return z
		.string()
		.min(1)
		.optional()
		.describe(
			'Sent as the X-Idempotency-Key header. A repeat call with the same key and body returns the original response with HTTP 409 instead of running again.',
		);
}

// ── Shared object shapes ──────────────────────────────────────────────────

export const RecipientSchema = z
	.object({
		id: str,
		account_id: str,
		title: str,
		firstname: str,
		lastname: str,
		company: str,
		job_title: str,
		address1: str,
		address2: str,
		address3: str,
		city: str,
		county: str,
		country: str,
		postcode: str,
		zipcode: str,
		dps: str,
		email: str,
		phone_number: str,
		ref_id: str,
		// The object reference calls this boolean; the list example shows "0".
		blacklist: z.union([z.string(), z.boolean()]).nullish(),
		created: str,
		updated: str,
	})
	.loose();

export type StannpRecipient = z.infer<typeof RecipientSchema>;

/**
 * A mailpiece: any postcard, letter or greeting card. `dispatched` stays
 * null until marked dispatched, `cost` is a number in the get examples and a
 * string in the reporting rows, and US accounts also carry `zipcode`.
 */
export const MailpieceSchema = z
	.object({
		id: num,
		account_id: num,
		timestamp: str,
		status: str,
		type: str,
		format: str,
		pdf_file: str,
		dispatched: str,
		country: str,
		cost: z.union([z.number(), z.string()]).nullish(),
		addons: str,
		tags: str,
		template_id: num,
		campaign_id: num,
		recipient_id: num,
		firstname: str,
		lastname: str,
		address1: str,
		address2: str,
		address3: str,
		city: str,
		county: str,
		postcode: str,
		zipcode: str,
		transactional: num,
		class: num,
		updated: str,
		mailpiece_id: num,
		tracking_ref: str,
		// unknown: tracking entries, passed through as Stannp sends them.
		tracking: z.array(z.record(z.string(), z.unknown())).nullish(),
	})
	.loose();

export type StannpMailpiece = z.infer<typeof MailpieceSchema>;

const MailpieceCreateSchema = z
	.object({
		pdf: str.describe('URL of the merged PDF proof.'),
		id: num.describe('The new mailpiece id; 0 in test mode.'),
		created: str,
		format: str,
		cost: str,
		status: str.describe('"test" when test is set.'),
	})
	.loose();

export type StannpMailpieceCreate = z.infer<typeof MailpieceCreateSchema>;

export const CampaignSchema = z
	.object({
		id: str,
		account_id: str,
		name: str,
		template_id: str,
		type: str,
		trigger_date: str,
		send_date: str,
		trigger_offset: str,
		created: str,
		updated: str,
		status: str,
		recipients_group: str,
		recipients_filter: str,
		recipients_validated: str,
		recipients: str,
		recipients_not_valid: str,
		dispatched: str,
		cost: str,
		voucher_code: str,
		image: str,
		size: str,
	})
	.loose();

export type StannpCampaign = z.infer<typeof CampaignSchema>;

const GroupSchema = z
	.object({
		id: str,
		account_id: str,
		name: str,
		created: str,
		recipients: str.describe('Recipient count, as a string.'),
		valid: str.describe('Validated recipient count, as a string.'),
		international: str,
		skipped: str,
		status: str,
		import_progress: str,
		is_seeds: str,
	})
	.loose();

export type StannpGroup = z.infer<typeof GroupSchema>;

const TemplateSchema = z
	.object({
		id: str,
		account_id: str,
		template_name: str,
		image: str,
		created: str,
		updated: str,
		size: str,
		page_count: str,
		duplex: str,
		back_image: str,
		template: str,
		is_public: str,
		is_template: str,
		version: str,
		is_hidden: str,
		shared: str,
		user_id: str,
		tags: str,
		versions: str,
	})
	.loose();

export type StannpTemplate = z.infer<typeof TemplateSchema>;

const SmsSchema = z
	.object({
		id: num,
		recipient_id: num,
		phone_number: str,
		from: str,
		profile_id: num,
		usage_campaign_id: num,
		profile_type: str,
		message: str,
		message_parts: num,
		cost: num,
		destination_country: str,
		status: str.describe('"test" when test is set.'),
		campaign_id: num,
		created: str,
		updated: str,
	})
	.loose();

export type StannpSms = z.infer<typeof SmsSchema>;

// ── Recipient address block ───────────────────────────────────────────────
//
// postcards.create and letters.create take `recipient` either as an existing
// recipient id or as a new recipient array (recipient[title]=... in the
// curl examples). Custom fields ride along as recipient[<name>].

export const RecipientAddressSchema = z
	.object({
		title: z.string().optional(),
		firstname: z.string().optional(),
		lastname: z.string().optional(),
		company: z.string().optional(),
		address1: z
			.string()
			.optional()
			.describe('Required by the API for a new address.'),
		address2: z.string().optional(),
		address3: z.string().optional(),
		city: z
			.string()
			.optional()
			.describe('Required by the API for a new address.'),
		county: z.string().optional().describe('Also accepts state.'),
		postcode: z.string().optional().describe('Also accepts zipcode.'),
		zipcode: z.string().optional(),
		country: countryCode
			.optional()
			.describe('ISO 3166-1 alpha-2. Required by the API for a new address.'),
		email: z.string().optional(),
		url: z.string().optional().describe('Landing page stored with the send.'),
	})
	.loose()
	.describe(
		'A new recipient, created on the fly and merged into the mailpiece.',
	);

export type StannpRecipientAddress = z.input<typeof RecipientAddressSchema>;

// ── account ───────────────────────────────────────────────────────────────

const AccountBalanceInputSchema = z.object({});
const AccountBalanceResponseSchema = z
	.object({
		balance: str.describe('Account balance, such as "214.4200".'),
	})
	.loose();

const AccountTopupInputSchema = z.object({
	net: z
		.string()
		.min(1)
		.describe('Amount to top up, such as "10.00". Tax may be added.'),
	idempotencyKey: idempotencyKeyField(),
});
const AccountTopupResponseSchema = z
	.object({
		receipt_pdf: str.describe('URL of the receipt.'),
	})
	.loose();

// ── addresses ─────────────────────────────────────────────────────────────

const AddressesValidateInputSchema = z
	.object({
		company: z.string().optional(),
		address1: z.string().min(1).describe('Address line 1.'),
		address2: z.string().optional(),
		address3: z.string().optional(),
		city: z
			.string()
			.optional()
			.describe('Required for US/CA addresses when zipcode is not provided.'),
		postcode: z
			.string()
			.optional()
			.describe('UK postcode; enough without a city for UK addresses.'),
		state: z.string().optional().describe('Two-letter US state abbreviation.'),
		province: z
			.string()
			.optional()
			.describe('Two-letter CA province abbreviation (ON, BC, QC).'),
		zipcode: z
			.string()
			.optional()
			.describe('US/CA. Required when city is not provided.'),
		country: countryCode
			.optional()
			.describe('ISO 3166-1 alpha-2. UK and US addresses only.'),
	})
	.superRefine((value, ctx) => {
		// UK addresses validate on address1 + postcode; US/CA ones need a city
		// or a zipcode.
		if (!value.city && !value.zipcode && !value.postcode) {
			ctx.addIssue({
				code: 'custom',
				message:
					'Provide city, postcode (UK) or zipcode (US/CA); the API needs one of them.',
				path: ['city'],
			});
		}
	});

const AddressesValidateResponseSchema = z
	.object({
		address1: str,
		address2: str,
		address3: str,
		city: str,
		county: str,
		postcode: str,
		country: str,
		reference_id: num,
		dps: str.describe('Delivery point suffix.'),
		udprn: str,
		is_valid: z.boolean().nullish(),
	})
	.loose();

// ── postcards ─────────────────────────────────────────────────────────────

// EU/UK sizes and US sizes, from the LLM spec's size row. Defaults to A6 or
// 4x6 by region.
const PostcardSizeSchema = z.enum([
	'A6',
	'A5',
	'A5-ENV',
	'A5-PORT',
	'4x6',
	'6x9',
	'6x11',
]);

const PostcardsCreateInputSchema = z
	.object({
		size: PostcardSizeSchema.optional().describe(
			'EU/UK: A6 (default), A5, A5-ENV, A5-PORT. US: 4x6 (default), 6x9, 6x11.',
		),
		test: z
			.boolean()
			.optional()
			.describe(
				'True produces a sample PDF without dispatching or charging. Defaults to false: the card is posted for real.',
			),
		template: positiveInt
			.optional()
			.describe(
				'A template set up on the platform. Leave out to use front and back.',
			),
		recipient: z
			.union([positiveInt, RecipientAddressSchema])
			.describe('An existing recipient id, or a new recipient object.'),
		message: z
			.string()
			.optional()
			.describe('A message on the back of the card, overlaid on a back image.'),
		signature: z
			.string()
			.optional()
			.describe(
				'URL or base64 JPG (768 x 118 pixels) placed in the signature location.',
			),
		front: z
			.string()
			.optional()
			.describe(
				'URL or base64 JPG, PNG or PDF for the front. Required when no template is used.',
			),
		back: z
			.string()
			.optional()
			.describe('URL or base64 JPG, PNG or PDF for the back.'),
		padding: z
			.number()
			.int()
			.optional()
			.describe('Set 0 to remove the default white border on the front.'),
		post_unverified: z
			.boolean()
			.optional()
			.describe(
				'Defaults to true. If false, the card is not posted when the address could not be verified.',
			),
		clearzone: z
			.boolean()
			.optional()
			.describe(
				'Defaults to false. True overlays clear zones with white to keep the card machine-readable.',
			),
		return_address: z
			.string()
			.optional()
			.describe('Custom return address printed on the card.'),
		tags: z.string().optional().describe('Comma-separated tags for reporting.'),
		addons: z
			.string()
			.optional()
			.describe(
				'Comma-separated addon codes such as FIRST_CLASS, STOCK_350_SILK, STOCK_350_UNCOATED.',
			),
		idempotencyKey: idempotencyKeyField(),
	})
	.superRefine((value, ctx) => {
		if (value.template === undefined && !value.front) {
			ctx.addIssue({
				code: 'custom',
				message:
					'Provide a template id or a front image; the API requires one.',
				path: ['front'],
			});
		}
	});

const PostcardsGetInputSchema = z.object({
	id: positiveInt.describe('The postcard id.'),
});

const MailpieceGetResponseSchema = MailpieceSchema;

const PostcardsCancelInputSchema = z.object({
	id: positiveInt.describe('The id of the mailpiece item.'),
});

const CancelResponseSchema = z
	.number()
	.describe('1 when the mailpiece was cancelled.');

// ── letters ───────────────────────────────────────────────────────────────

// The LLM spec lists A4 and US-LETTER; the US page adds US-LETTER-XL-WINDOW.
const LetterSizeSchema = z.enum(['A4', 'US-LETTER', 'US-LETTER-XL-WINDOW']);

const LETTER_ADDONS = 'FIRST_CLASS, C4_ENVELOPE, CONFIDENTIAL, STOCK_120';

const LettersCreateInputSchema = z
	.object({
		test: z
			.boolean()
			.optional()
			.describe(
				'True produces a sample PDF without dispatching or charging. Defaults to false: the letter is posted for real.',
			),
		recipient: z
			.union([positiveInt, RecipientAddressSchema])
			.describe('An existing recipient id, or a new recipient object.'),
		template: positiveInt
			.optional()
			.describe('A template set up on the platform.'),
		file: z
			.string()
			.optional()
			.describe(
				'URL of a PDF or DOC file to mail merge, instead of a template. Page limits apply per the docs.',
			),
		size: LetterSizeSchema.optional().describe(
			'Defaults to A4 for EU/UK accounts, US-LETTER for US accounts.',
		),
		duplex: z
			.boolean()
			.optional()
			.describe('Defaults to true. False prints front sides only.'),
		clearzone: z
			.boolean()
			.optional()
			.describe('Defaults to true. True overlays clear zones with white.'),
		post_unverified: z
			.boolean()
			.optional()
			.describe(
				'Defaults to true. If false, the letter is not posted when the address could not be verified.',
			),
		tags: z.string().optional().describe('Comma-separated tags for reporting.'),
		addons: z
			.string()
			.optional()
			.describe(`Comma-separated addon codes: ${LETTER_ADDONS}.`),
		idempotencyKey: idempotencyKeyField(),
	})
	.superRefine((value, ctx) => {
		if (value.template === undefined && !value.file) {
			ctx.addIssue({
				code: 'custom',
				message:
					'Provide a template id or a file; the letter needs one of them.',
				path: ['file'],
			});
		}
	});

const LettersPostInputSchema = z.object({
	test: z
		.boolean()
		.optional()
		.describe(
			'True produces a sample PDF without dispatching or charging. Defaults to false: the letter is posted for real.',
		),
	country: countryCode.describe(
		'ISO alpha-2 country code, such as US, CA, GB, FR.',
	),
	pdf: z
		.string()
		.optional()
		.describe(
			'URL of the already mail-merged PDF. The address must be on the document in machine-readable form; the API reads it with OCR. The API also accepts this under the name "file".',
		),
	size: LetterSizeSchema.optional().describe(
		'Defaults to A4 for EU/UK accounts, US-LETTER for US accounts.',
	),
	duplex: z.boolean().optional().describe('Defaults to true.'),
	transactional: z
		.boolean()
		.optional()
		.describe('Use for sensitive data. Defaults to false.'),
	tags: z.string().optional().describe('Comma-separated tags for reporting.'),
	addons: z
		.string()
		.optional()
		.describe(`Comma-separated addon codes: ${LETTER_ADDONS}.`),
	idempotencyKey: idempotencyKeyField(),
});

const LettersGetInputSchema = z.object({
	id: positiveInt.describe('The letter id.'),
});

const LettersCancelInputSchema = z.object({
	id: positiveInt.describe('The id of the mailpiece item.'),
});

// ── recipients ────────────────────────────────────────────────────────────

export const STANNP_DEFAULT_RECIPIENTS_LIMIT = 100;

const RecipientsListInputSchema = z.object({
	group_id: positiveInt.optional().describe('Only recipients in this group.'),
	offset: z
		.number()
		.int()
		.nonnegative()
		.optional()
		.describe('Offset for pagination.'),
	limit: z
		.number()
		.int()
		.positive()
		.optional()
		.describe(
			`Limit for pagination. Defaults to ${STANNP_DEFAULT_RECIPIENTS_LIMIT} when omitted.`,
		),
});

const RecipientsGetInputSchema = z.object({
	id: positiveInt.describe('The recipient id.'),
});

const RecipientsCreateInputSchema = z
	.object({
		group_id: positiveInt
			.optional()
			.describe('The group to add the recipient to.'),
		title: z.string().optional().describe('Such as Mr, Mrs, Dr.'),
		firstname: z.string().optional(),
		lastname: z.string().optional(),
		company: z.string().optional(),
		job_title: z.string().optional(),
		address1: z.string().optional(),
		address2: z.string().optional(),
		address3: z.string().optional(),
		city: z.string().optional(),
		county: z
			.string()
			.optional()
			.describe('County or state; the API also accepts "state".'),
		postcode: z.string().optional().describe('The API also accepts "zipcode".'),
		zipcode: z
			.string()
			.optional()
			.describe('US zip code; the documented request example sends this name.'),
		country: countryCode
			.optional()
			.describe('ISO 3166-1 alpha-2. Defaults to the account region.'),
		email: z.string().optional(),
		phone_number: z.string().optional(),
		ref_id: z
			.string()
			.optional()
			.describe(
				'An id from another system, for matching the recipient across services.',
			),
		on_duplicate: z
			.enum(['update', 'ignore', 'duplicate'])
			.optional()
			.describe('What to do when a duplicate is found.'),
		test_level: z
			.enum(['email', 'fullname', 'initial', 'ref_id'])
			.optional()
			.describe('How duplicates are matched. Defaults to fullname.'),
		customFields: z
			.record(z.string(), z.union([z.string(), z.number(), z.boolean()]))
			.optional()
			.describe(
				'Custom recipient fields set up on your account, sent as extra parameters.',
			),
		idempotencyKey: idempotencyKeyField(),
	})
	.superRefine((value, ctx) => {
		const reserved = new Set([
			'group_id',
			'title',
			'firstname',
			'lastname',
			'company',
			'job_title',
			'address1',
			'address2',
			'address3',
			'city',
			'county',
			'state',
			'postcode',
			'zipcode',
			'country',
			'email',
			'phone_number',
			'ref_id',
			'on_duplicate',
			'test_level',
		]);
		for (const key of Object.keys(value.customFields ?? {})) {
			if (reserved.has(key)) {
				ctx.addIssue({
					code: 'custom',
					message: `"${key}" is a built-in recipient field; set it directly instead of in customFields.`,
					path: ['customFields', key],
				});
			}
		}
	});

const RecipientsCreateResponseSchema = z
	.object({
		id: str.describe('The new recipient id, as a string.'),
		valid: z.boolean().nullish().describe('Whether the address validated.'),
		created: str,
	})
	.loose();

const RecipientsDeleteInputSchema = z.object({
	id: positiveInt.describe('The recipient to delete.'),
});

const RecipientsDeleteResponseSchema = z
	.union([z.number(), z.string().transform(Number)])
	.describe('1 when the recipient was deleted.');

const RecipientsImportInputSchema = z.object({
	file: z
		.string()
		.min(1)
		.describe('URL of a CSV or XLS file, or a base64 encoded CSV string.'),
	group_id: positiveInt.describe('The group to import into.'),
	duplicates: z
		.enum(['update', 'ignore', 'duplicate'])
		.optional()
		.describe(
			'What to do with duplicates. Defaults to update: the existing record gets the newest data.',
		),
	no_headings: z
		.boolean()
		.optional()
		.describe(
			'True when the CSV has no heading row; mappings must then be supplied.',
		),
	mappings: z
		.string()
		.optional()
		.describe(
			'Comma-separated headings remapping the CSV columns, such as title,firstname,lastname,company,address1,address2,city,postcode,country,custom,custom,skip.',
		),
	idempotencyKey: idempotencyKeyField(),
});

const RecipientsImportResponseSchema = z
	.string()
	.describe('The import batch id, such as "1".');

// ── groups ────────────────────────────────────────────────────────────────

const GroupsListInputSchema = z.object({
	offset: z
		.number()
		.int()
		.nonnegative()
		.optional()
		.describe('Offset for pagination.'),
	limit: z
		.number()
		.int()
		.positive()
		.optional()
		.describe('Limit for pagination.'),
});

const GroupsCreateInputSchema = z.object({
	name: z.string().min(1).describe('Name of the new group.'),
	idempotencyKey: idempotencyKeyField(),
});

const GroupsCreateResponseSchema = z
	.union([z.string(), z.number().transform(String)])
	.describe('The new group id, as a string.');

const GroupRecipientsInputSchema = z.object({
	group_id: positiveInt.describe('The group to change.'),
	recipients: z
		.array(positiveInt)
		.min(1)
		.describe('Recipient ids, sent comma-separated.'),
});

const GroupMembersChangedResponseSchema = z
	.number()
	.describe('How many recipients were added or removed.');

const GroupsPurgeInputSchema = z.object({
	id: positiveInt.describe('The group to purge.'),
	delete_recipients: z
		.boolean()
		.optional()
		.describe(
			'Defaults to false. True also deletes the recipients everywhere, including other groups. Cannot be undone.',
		),
	idempotencyKey: idempotencyKeyField(),
});

const GroupsCalculateInputSchema = z.object({
	group_id: positiveInt.describe('The group to recalculate.'),
});

const GroupsDeleteInputSchema = z.object({
	id: positiveInt.describe('The group to delete.'),
	delete_recipients: z
		.boolean()
		.optional()
		.describe(
			'Defaults to false. True also deletes the recipients everywhere, including other groups. Cannot be undone.',
		),
	idempotencyKey: idempotencyKeyField(),
});

// Live: groups.delete answers `true` with delete_recipients and `1` without.
// 1/0 map to true/false.
const SuccessResponseSchema = z
	.union([z.boolean(), z.number().transform((value) => value === 1)])
	.describe('true when the change was applied.');

// ── campaigns ─────────────────────────────────────────────────────────────

// The parameter table lists a6-postcard, a5-postcard and letter; the curl
// example sends A6-postcard. Both spellings are accepted.
const CampaignTypeSchema = z.enum([
	'a6-postcard',
	'a5-postcard',
	'letter',
	'A6-postcard',
	'A5-postcard',
]);

const CampaignsListInputSchema = z.object({});

const CampaignsGetInputSchema = z.object({
	id: positiveInt.describe('The campaign id.'),
});

const CampaignsCreateInputSchema = z
	.object({
		name: z.string().min(1).describe('Name of the campaign, for reference.'),
		type: CampaignTypeSchema.describe('The mailpiece this campaign sends.'),
		template_id: z
			.number()
			.int()
			.nonnegative()
			.optional()
			.describe(
				'A template to copy. 0 or omitted uses a blank template of the format.',
			),
		file: z
			.string()
			.optional()
			.describe('URL of a PDF to use as the design artwork.'),
		front: z
			.string()
			.optional()
			.describe('URL of a PDF or JPG for the front image.'),
		back: z
			.string()
			.optional()
			.describe('URL of a PDF or JPG for the back image.'),
		size: z
			.string()
			.optional()
			.describe(
				'Required with file or front/back images, such as A4, A5 or A6.',
			),
		save: z
			.boolean()
			.optional()
			.describe('Save the uploaded artwork as a new design template.'),
		group_id: positiveInt.describe('The group this campaign sends to.'),
		what_recipients: z
			.enum(['all', 'valid', 'not_valid', 'int'])
			.optional()
			.describe(
				'all is every recipient in the group, valid and not_valid are UK validated and non-validated addresses, int is international addresses.',
			),
		addons: z.string().optional().describe('Addon code for the campaign.'),
		idempotencyKey: idempotencyKeyField(),
	})
	.superRefine((value, ctx) => {
		// Live: front/back without size answers 400 "format  is invalid".
		if ((value.file || value.front || value.back) && !value.size) {
			ctx.addIssue({
				code: 'custom',
				message:
					'Set size (A6, A5 or A4) when sending file or front/back artwork.',
				path: ['size'],
			});
		}
	});

// The docs show { id: "266" }; the live API answers the bare id ("587001").
// Both forms parse to { id }.
const CampaignsCreateResponseSchema = z.preprocess(
	(value) =>
		typeof value === 'string' || typeof value === 'number'
			? { id: value }
			: value,
	z
		.object({
			id: str.describe('The new campaign id, as a string.'),
		})
		.loose(),
);

const CampaignsSampleInputSchema = z.object({
	id: positiveInt.describe('The campaign to sample.'),
});

const CampaignsSampleResponseSchema = z
	.string()
	.describe('URL of the PDF sample, valid for 30 minutes.');

const CampaignsApproveInputSchema = z.object({
	id: positiveInt.describe('The campaign to approve.'),
});

const CampaignsCostInputSchema = z.object({
	id: positiveInt.describe('The campaign to price.'),
});

const CampaignsCostResponseSchema = z
	.object({
		rate: str.describe('Per-piece rate for validated addresses.'),
		non_valid_rate: str,
		delivery_rate: str,
		international_rate: str,
		valid: str.describe('Total for validated recipients.'),
		not_valid: str.describe('Total for non-validated recipients.'),
		international: str,
		delivery_charge: str,
		net: str,
		vat: str,
		total: str,
	})
	.loose();

const CampaignsAvailableDatesInputSchema = z.object({
	start: isoDate.optional().describe('Defaults to today.'),
	end: isoDate.optional().describe('Defaults to 30 days out.'),
});

const CampaignsAvailableDatesResponseSchema = z
	.array(isoDate)
	.describe('Bookable dates.');

const CampaignsBookInputSchema = z.object({
	id: positiveInt.describe('The campaign to book.'),
	send_date: isoDate.describe('The dispatch date.'),
	next_available_date: z
		.boolean()
		.optional()
		.describe(
			'Defaults to true: books on the next available date when yours is taken. False returns an error instead.',
		),
	use_balance: z
		.boolean()
		.optional()
		.describe(
			'Defaults to true: pays from the balance. False schedules the campaign but nothing posts until payment.',
		),
	idempotencyKey: idempotencyKeyField(),
});

const CampaignsDeleteInputSchema = z.object({
	id: positiveInt.describe(
		'The campaign to delete. Only unbooked campaigns can be deleted.',
	),
});

// The US page's example answers 1; the LLM spec answers true.
const CampaignsDeleteResponseSchema = z.union([z.boolean(), z.number()]);

// ── events ────────────────────────────────────────────────────────────────

const EventsCreateInputSchema = z.object({
	recipient_id: z
		.string()
		.min(1)
		.describe('The recipient id, or the ref_id stored on the recipient.'),
	name: z
		.string()
		.min(1)
		.describe(
			'Event name, such as PURCHASE, SIGNUP, PAGE_VIEW, PRODUCT_VIEW, PRODUCT_TO_BASKET.',
		),
	value: z
		.string()
		.optional()
		.describe(
			'Value information, such as the purchase amount or product name.',
		),
	conversion: z
		.boolean()
		.optional()
		.describe('True for a conversion event. Defaults to false.'),
	data: z
		.string()
		.optional()
		.describe('Extended data for automation or dynamic templating.'),
	ref: z
		.string()
		.optional()
		.describe(
			'A campaign or mailpiece reference. Empty uses the most recent communication.',
		),
	idempotencyKey: idempotencyKeyField(),
});

// Documented as a number (266); the live API answers a string ("0").
const EventsCreateResponseSchema = z
	.union([z.number(), z.string()])
	.describe('The id of the recorded event.');

// ── selections ────────────────────────────────────────────────────────────

const SelectionsCreateInputSchema = z.object({
	group_id: positiveInt.describe('The group this selection filters.'),
	name: z.string().optional().describe('Name of the filter.'),
	filters: z
		.string()
		.optional()
		.describe(
			'Filter string in [column]:::[operator]:::[value] form, chained with :::AND:::. Operators: matches, contains, begins, ends, before, after, less_than, more_than, is_not.',
		),
	idempotencyKey: idempotencyKeyField(),
});

// Documented as [{ id }]; the live API answered `true`.
const SelectionsCreateResponseSchema = z
	.union([z.array(z.object({ id: str }).loose()), z.boolean()])
	.describe(
		'The created selection as a list of id objects, or true (what the live API returns).',
	);

// ── reporting ─────────────────────────────────────────────────────────────

const ReportingSummaryInputSchema = z.object({
	startdate: isoDate.describe('Start of the reporting period.'),
	enddate: isoDate.describe('End of the period; the whole day is included.'),
});

const ReportingSummaryResponseSchema = z
	.object({
		total: num,
		received: num.describe('Requests received.'),
		printing: num.describe('Printing or finishing.'),
		handed_over: num.describe('Handed to the delivery service.'),
		local_delivery: num.describe('At the final delivery office.'),
		delivered: num.describe('Estimated as delivered.'),
		returned: num.describe('Returned to sender.'),
		cancelled: num.describe('Cancelled before production.'),
	})
	.loose();

const ReportingListInputSchema = z
	.object({
		startdate: isoDate.describe('Start of the reporting period.'),
		enddate: isoDate.describe('End of the reporting period.'),
		status: z
			.string()
			.optional()
			.describe(
				'Only mailpieces in this status, such as delivered or returned.',
			),
		tag: z
			.string()
			.optional()
			.describe(
				'Only mailpieces carrying this tag. The tag is the path segment after status, so it needs a status too.',
			),
	})
	.superRefine((value, ctx) => {
		// The route is /list/:start/:end/[:status]/[:tag]: a tag without a
		// status would land in the status slot, so it is refused rather than
		// sent as the wrong filter or dropped.
		if (value.tag !== undefined && value.status === undefined) {
			ctx.addIssue({
				code: 'custom',
				message:
					'Set status as well as tag; the API reads the tag only after a status.',
				path: ['status'],
			});
		}
	});

const ReportingMailpieceSchema = z
	.object({
		id: str,
		timestamp: str,
		status: str,
		type: str,
		format: str,
		pdf_file: str,
		dispatched: str,
		country: str,
		cost: str,
		addons: str,
		tags: str,
		zipcode: str,
		address: str.describe('One-line address, as printed.'),
	})
	.loose();

const ReportingListResponseSchema = z
	.object({
		singles: z.array(ReportingMailpieceSchema),
	})
	.loose();

// ── files ─────────────────────────────────────────────────────────────────

const FilesUploadInputSchema = z.object({
	file: z
		.string()
		.min(1)
		.describe('URL of the file to upload into the secure file transfer area.'),
	folder: positiveInt.optional().describe('Folder to place the file in.'),
	idempotencyKey: idempotencyKeyField(),
});

const FilesUploadResponseSchema = z
	.object({
		id: str.describe('The new file id, as a string.'),
	})
	.loose();

const FilesCreateFolderInputSchema = z.object({
	name: z.string().min(1).describe('Name of the folder to create.'),
	idempotencyKey: idempotencyKeyField(),
});

const FilesCreateFolderResponseSchema = z
	.string()
	.describe('The new folder id, as a string.');

const FilesListFoldersInputSchema = z.object({});

const FilesListFoldersResponseSchema = z.array(
	z
		.object({
			id: str,
			name: str,
			created: str,
		})
		.loose(),
);

// ── sms ───────────────────────────────────────────────────────────────────

const SmsCreateInputSchema = z
	.object({
		test: z
			.boolean()
			.optional()
			.describe(
				'True builds the message without sending it and without charging.',
			),
		phone_number: z
			.string()
			.optional()
			.describe(
				"The recipient's mobile number. Required when recipient_id is not provided.",
			),
		recipient_id: positiveInt
			.optional()
			.describe(
				'An existing recipient. Required when phone_number is not provided.',
			),
		message: z
			.string()
			.min(1)
			.describe(
				'The message. Supports template tags such as {firstname} with recipient_id.',
			),
		country: countryCode.optional().describe('Defaults to the account region.'),
		idempotencyKey: idempotencyKeyField(),
	})
	.superRefine((value, ctx) => {
		if (!value.phone_number && value.recipient_id === undefined) {
			ctx.addIssue({
				code: 'custom',
				message:
					'Provide phone_number or recipient_id; the API requires one of them.',
				path: ['phone_number'],
			});
		}
	});

// ── tools ─────────────────────────────────────────────────────────────────

const ToolsTemplatesInputSchema = z.object({});

const ToolsTemplatesResponseSchema = z.array(TemplateSchema);

const ToolsPdfMergeInputSchema = z.object({
	files: z
		.array(z.string().min(1))
		.min(1)
		.describe('URLs of the PDF files to merge, in order.'),
	idempotencyKey: idempotencyKeyField(),
});

const ToolsPdfMergeResponseSchema = z
	.string()
	.describe('URL of the merged PDF.');

// ── Registry ──────────────────────────────────────────────────────────────

export type StannpEndpointInputs = {
	accountBalance: z.input<typeof AccountBalanceInputSchema>;
	accountTopup: z.input<typeof AccountTopupInputSchema>;
	addressesValidate: z.input<typeof AddressesValidateInputSchema>;
	postcardsCreate: z.input<typeof PostcardsCreateInputSchema>;
	postcardsGet: z.input<typeof PostcardsGetInputSchema>;
	postcardsCancel: z.input<typeof PostcardsCancelInputSchema>;
	lettersCreate: z.input<typeof LettersCreateInputSchema>;
	lettersPost: z.input<typeof LettersPostInputSchema>;
	lettersGet: z.input<typeof LettersGetInputSchema>;
	lettersCancel: z.input<typeof LettersCancelInputSchema>;
	recipientsList: z.input<typeof RecipientsListInputSchema>;
	recipientsGet: z.input<typeof RecipientsGetInputSchema>;
	recipientsCreate: z.input<typeof RecipientsCreateInputSchema>;
	recipientsDelete: z.input<typeof RecipientsDeleteInputSchema>;
	recipientsImport: z.input<typeof RecipientsImportInputSchema>;
	groupsList: z.input<typeof GroupsListInputSchema>;
	groupsCreate: z.input<typeof GroupsCreateInputSchema>;
	groupsAddRecipients: z.input<typeof GroupRecipientsInputSchema>;
	groupsRemoveRecipients: z.input<typeof GroupRecipientsInputSchema>;
	groupsPurge: z.input<typeof GroupsPurgeInputSchema>;
	groupsCalculate: z.input<typeof GroupsCalculateInputSchema>;
	groupsDelete: z.input<typeof GroupsDeleteInputSchema>;
	campaignsList: z.input<typeof CampaignsListInputSchema>;
	campaignsGet: z.input<typeof CampaignsGetInputSchema>;
	campaignsCreate: z.input<typeof CampaignsCreateInputSchema>;
	campaignsSample: z.input<typeof CampaignsSampleInputSchema>;
	campaignsApprove: z.input<typeof CampaignsApproveInputSchema>;
	campaignsCost: z.input<typeof CampaignsCostInputSchema>;
	campaignsAvailableDates: z.input<typeof CampaignsAvailableDatesInputSchema>;
	campaignsBook: z.input<typeof CampaignsBookInputSchema>;
	campaignsDelete: z.input<typeof CampaignsDeleteInputSchema>;
	eventsCreate: z.input<typeof EventsCreateInputSchema>;
	selectionsCreate: z.input<typeof SelectionsCreateInputSchema>;
	reportingSummary: z.input<typeof ReportingSummaryInputSchema>;
	reportingList: z.input<typeof ReportingListInputSchema>;
	filesUpload: z.input<typeof FilesUploadInputSchema>;
	filesCreateFolder: z.input<typeof FilesCreateFolderInputSchema>;
	filesListFolders: z.input<typeof FilesListFoldersInputSchema>;
	smsCreate: z.input<typeof SmsCreateInputSchema>;
	toolsTemplates: z.input<typeof ToolsTemplatesInputSchema>;
	toolsPdfMerge: z.input<typeof ToolsPdfMergeInputSchema>;
};

export type StannpEndpointOutputs = {
	accountBalance: z.infer<typeof AccountBalanceResponseSchema>;
	accountTopup: z.infer<typeof AccountTopupResponseSchema>;
	addressesValidate: z.infer<typeof AddressesValidateResponseSchema>;
	postcardsCreate: z.infer<typeof MailpieceCreateSchema>;
	postcardsGet: z.infer<typeof MailpieceGetResponseSchema>;
	postcardsCancel: z.infer<typeof CancelResponseSchema>;
	lettersCreate: z.infer<typeof MailpieceCreateSchema>;
	lettersPost: z.infer<typeof MailpieceCreateSchema>;
	lettersGet: z.infer<typeof MailpieceGetResponseSchema>;
	lettersCancel: z.infer<typeof CancelResponseSchema>;
	recipientsList: z.infer<typeof RecipientSchema>[];
	recipientsGet: z.infer<typeof RecipientSchema>;
	recipientsCreate: z.infer<typeof RecipientsCreateResponseSchema>;
	recipientsDelete: z.infer<typeof RecipientsDeleteResponseSchema>;
	recipientsImport: z.infer<typeof RecipientsImportResponseSchema>;
	groupsList: z.infer<typeof GroupSchema>[];
	groupsCreate: z.infer<typeof GroupsCreateResponseSchema>;
	groupsAddRecipients: z.infer<typeof GroupMembersChangedResponseSchema>;
	groupsRemoveRecipients: z.infer<typeof GroupMembersChangedResponseSchema>;
	groupsPurge: z.infer<typeof SuccessResponseSchema>;
	groupsCalculate: z.infer<typeof SuccessResponseSchema>;
	groupsDelete: z.infer<typeof SuccessResponseSchema>;
	campaignsList: z.infer<typeof CampaignSchema>[];
	campaignsGet: z.infer<typeof CampaignSchema>;
	campaignsCreate: z.infer<typeof CampaignsCreateResponseSchema>;
	campaignsSample: z.infer<typeof CampaignsSampleResponseSchema>;
	campaignsApprove: z.infer<typeof SuccessResponseSchema>;
	campaignsCost: z.infer<typeof CampaignsCostResponseSchema>;
	campaignsAvailableDates: z.infer<
		typeof CampaignsAvailableDatesResponseSchema
	>;
	campaignsBook: z.infer<typeof SuccessResponseSchema>;
	campaignsDelete: z.infer<typeof CampaignsDeleteResponseSchema>;
	eventsCreate: z.infer<typeof EventsCreateResponseSchema>;
	selectionsCreate: z.infer<typeof SelectionsCreateResponseSchema>;
	reportingSummary: z.infer<typeof ReportingSummaryResponseSchema>;
	reportingList: z.infer<typeof ReportingListResponseSchema>;
	filesUpload: z.infer<typeof FilesUploadResponseSchema>;
	filesCreateFolder: z.infer<typeof FilesCreateFolderResponseSchema>;
	filesListFolders: z.infer<typeof FilesListFoldersResponseSchema>;
	smsCreate: z.infer<typeof SmsSchema>;
	toolsTemplates: z.infer<typeof ToolsTemplatesResponseSchema>;
	toolsPdfMerge: z.infer<typeof ToolsPdfMergeResponseSchema>;
};

export const StannpEndpointInputSchemas = {
	accountBalance: AccountBalanceInputSchema,
	accountTopup: AccountTopupInputSchema,
	addressesValidate: AddressesValidateInputSchema,
	postcardsCreate: PostcardsCreateInputSchema,
	postcardsGet: PostcardsGetInputSchema,
	postcardsCancel: PostcardsCancelInputSchema,
	lettersCreate: LettersCreateInputSchema,
	lettersPost: LettersPostInputSchema,
	lettersGet: LettersGetInputSchema,
	lettersCancel: LettersCancelInputSchema,
	recipientsList: RecipientsListInputSchema,
	recipientsGet: RecipientsGetInputSchema,
	recipientsCreate: RecipientsCreateInputSchema,
	recipientsDelete: RecipientsDeleteInputSchema,
	recipientsImport: RecipientsImportInputSchema,
	groupsList: GroupsListInputSchema,
	groupsCreate: GroupsCreateInputSchema,
	groupsAddRecipients: GroupRecipientsInputSchema,
	groupsRemoveRecipients: GroupRecipientsInputSchema,
	groupsPurge: GroupsPurgeInputSchema,
	groupsCalculate: GroupsCalculateInputSchema,
	groupsDelete: GroupsDeleteInputSchema,
	campaignsList: CampaignsListInputSchema,
	campaignsGet: CampaignsGetInputSchema,
	campaignsCreate: CampaignsCreateInputSchema,
	campaignsSample: CampaignsSampleInputSchema,
	campaignsApprove: CampaignsApproveInputSchema,
	campaignsCost: CampaignsCostInputSchema,
	campaignsAvailableDates: CampaignsAvailableDatesInputSchema,
	campaignsBook: CampaignsBookInputSchema,
	campaignsDelete: CampaignsDeleteInputSchema,
	eventsCreate: EventsCreateInputSchema,
	selectionsCreate: SelectionsCreateInputSchema,
	reportingSummary: ReportingSummaryInputSchema,
	reportingList: ReportingListInputSchema,
	filesUpload: FilesUploadInputSchema,
	filesCreateFolder: FilesCreateFolderInputSchema,
	filesListFolders: FilesListFoldersInputSchema,
	smsCreate: SmsCreateInputSchema,
	toolsTemplates: ToolsTemplatesInputSchema,
	toolsPdfMerge: ToolsPdfMergeInputSchema,
} as const;

export const StannpEndpointOutputSchemas = {
	accountBalance: AccountBalanceResponseSchema,
	accountTopup: AccountTopupResponseSchema,
	addressesValidate: AddressesValidateResponseSchema,
	postcardsCreate: MailpieceCreateSchema,
	postcardsGet: MailpieceGetResponseSchema,
	postcardsCancel: CancelResponseSchema,
	lettersCreate: MailpieceCreateSchema,
	lettersPost: MailpieceCreateSchema,
	lettersGet: MailpieceGetResponseSchema,
	lettersCancel: CancelResponseSchema,
	recipientsList: z.array(RecipientSchema),
	recipientsGet: RecipientSchema,
	recipientsCreate: RecipientsCreateResponseSchema,
	recipientsDelete: RecipientsDeleteResponseSchema,
	recipientsImport: RecipientsImportResponseSchema,
	groupsList: z.array(GroupSchema),
	groupsCreate: GroupsCreateResponseSchema,
	groupsAddRecipients: GroupMembersChangedResponseSchema,
	groupsRemoveRecipients: GroupMembersChangedResponseSchema,
	groupsPurge: SuccessResponseSchema,
	groupsCalculate: SuccessResponseSchema,
	groupsDelete: SuccessResponseSchema,
	campaignsList: z.array(CampaignSchema),
	campaignsGet: CampaignSchema,
	campaignsCreate: CampaignsCreateResponseSchema,
	campaignsSample: CampaignsSampleResponseSchema,
	campaignsApprove: SuccessResponseSchema,
	campaignsCost: CampaignsCostResponseSchema,
	campaignsAvailableDates: CampaignsAvailableDatesResponseSchema,
	campaignsBook: SuccessResponseSchema,
	campaignsDelete: CampaignsDeleteResponseSchema,
	eventsCreate: EventsCreateResponseSchema,
	selectionsCreate: SelectionsCreateResponseSchema,
	reportingSummary: ReportingSummaryResponseSchema,
	reportingList: ReportingListResponseSchema,
	filesUpload: FilesUploadResponseSchema,
	filesCreateFolder: FilesCreateFolderResponseSchema,
	filesListFolders: FilesListFoldersResponseSchema,
	smsCreate: SmsSchema,
	toolsTemplates: ToolsTemplatesResponseSchema,
	toolsPdfMerge: ToolsPdfMergeResponseSchema,
} as const;
