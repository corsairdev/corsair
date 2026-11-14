import { z } from 'zod';

// PostGrid's Print & Mail API. Every list route answers the same envelope,
// `{ object: "list", limit, skip, totalCount, data }`, and every order carries a
// `status` from one lifecycle vocabulary. Outputs are `.loose()` with documented
// fields nullish, so a field PostGrid adds or omits cannot fail a call that has
// already happened. Reference: https://docs.postgrid.com

/**
 * Any JSON value. PostGrid accepts arbitrary `metadata` on every object and
 * arbitrarily nested `mergeVariables` on an order, so this describes both
 * exactly rather than leaving their values untyped.
 */
export type PostgridJsonValue =
	| string
	| number
	| boolean
	| null
	| PostgridJsonValue[]
	| { [key: string]: PostgridJsonValue };

export const PostgridJsonValueSchema: z.ZodType<PostgridJsonValue> = z.lazy(
	() =>
		z.union([
			z.string(),
			z.number(),
			z.boolean(),
			z.null(),
			z.array(PostgridJsonValueSchema),
			z.record(z.string(), PostgridJsonValueSchema),
		]),
);

/** The mailing classes PostGrid documents, across its carriers. */
export const POSTGRID_MAILING_CLASSES = [
	'first_class',
	'standard_class',
	'express',
	'certified',
	'certified_return_receipt',
	'registered',
	'usps_first_class',
	'usps_standard_class',
	'usps_express_3_day',
	'usps_first_class_certified',
	'usps_first_class_certified_return_receipt',
	'ca_post_lettermail',
	'ca_post_personalized',
	'ca_post_registered',
	'ca_post_expedited_with_signature',
	'ca_post_expedited',
	'ca_post_xpresspost_with_signature',
	'ca_post_xpresspost',
	'royal_mail_first_class',
	'royal_mail_standard_class',
	'au_post_regular',
	'ups_express_overnight',
	'ups_express_2_day',
	'ups_express_3_day',
	'ups_express_3_day_signature_confirmation',
	'ups_express_3_day_adult_signature_confirmation',
] as const;

const MailingClassSchema = z
	.enum(POSTGRID_MAILING_CLASSES)
	.optional()
	.describe(
		'The carrier and service level. Defaults to first class or the fastest non-express postage in the destination country.',
	);

/** The order lifecycle, which every order shares. */
export const POSTGRID_ORDER_STATUSES = [
	'ready',
	'printing',
	'processed_for_delivery',
	'completed',
	'cancelled',
] as const;

/** The USPS intelligent-mail stages, present only on live US mail. */
export const POSTGRID_IMB_STATUSES = [
	'entered_mail_stream',
	'out_for_delivery',
	'returned_to_sender',
] as const;

export const POSTGRID_COUNTRY_CODES = ['US', 'CA', 'GB', 'AU'] as const;

const IdSchema = z
	.string()
	.min(1)
	.describe('The resource id, such as `contact_…` or `letter_…`.');

const pageFields = {
	skip: z
		.number()
		.int()
		.min(0)
		.optional()
		.describe('How many documents to skip. Increment it by `limit` to page.'),
	limit: z
		.number()
		.int()
		.min(1)
		.optional()
		.describe('How many documents to return.'),
	search: z
		.string()
		.min(1)
		.optional()
		.describe(
			'A plain string, or a JSON object of structured queries such as {"metadata.campaignID": "ABC"}.',
		),
};

/** The envelope every list route returns. `data` is required on a real page. */
const listEnvelopeFields = {
	object: z.string().nullish().describe('Always `list`.'),
	limit: z.number().nullish(),
	skip: z.number().nullish(),
	totalCount: z
		.number()
		.describe(
			'Total documents including the skipped ones; page while skip < totalCount.',
		),
};

/** A contact, as both an address and a resource. */
export const ContactSchema = z
	.object({
		id: IdSchema.nullish(),
		object: z.string().nullish().describe('Always `contact`.'),
		live: z.boolean().nullish(),
		description: z.string().nullish(),
		firstName: z.string().nullish(),
		lastName: z.string().nullish(),
		companyName: z.string().nullish(),
		jobTitle: z.string().nullish(),
		addressLine1: z.string().nullish(),
		addressLine2: z.string().nullish(),
		city: z.string().nullish(),
		provinceOrState: z.string().nullish(),
		postalOrZip: z.string().nullish(),
		countryCode: z.string().nullish(),
		email: z.string().nullish(),
		phoneNumber: z.string().nullish(),
		addressStatus: z
			.string()
			.nullish()
			.describe('`verified`, `corrected` or `failed`.'),
		skipVerification: z.boolean().nullish(),
		forceVerifiedStatus: z.boolean().nullish(),
		secret: z.boolean().nullish(),
		metadata: z.record(z.string(), PostgridJsonValueSchema).nullish(),
	})
	.loose();

export type PostgridContact = z.infer<typeof ContactSchema>;

/**
 * A contact supplied inline on an order. It accepts either a contact id or the
 * address fields, so both are optional and the provider validates the pair.
 */
const contactInputFields = {
	id: z
		.string()
		.min(1)
		.optional()
		.describe('An existing contact id. Use this or the address fields.'),
	firstName: z.string().min(1).optional(),
	lastName: z.string().min(1).optional(),
	companyName: z.string().min(1).optional(),
	addressLine1: z.string().min(1).optional(),
	addressLine2: z.string().min(1).optional(),
	city: z.string().min(1).optional(),
	provinceOrState: z.string().min(1).optional(),
	postalOrZip: z.string().min(1).optional(),
	countryCode: z.string().min(1).optional().describe('ISO 3166-1 alpha-2.'),
	email: z.string().min(1).optional(),
	phoneNumber: z.string().min(1).optional(),
	jobTitle: z.string().min(1).optional(),
	metadata: z.record(z.string(), PostgridJsonValueSchema).optional(),
};

const contactInput = z.object(contactInputFields);

export const ContactsCreateInputSchema = z
	.object({
		addressLine1: z.string().min(1).describe('First line of the address.'),
		addressLine2: z.string().min(1).optional(),
		city: z.string().min(1).optional(),
		provinceOrState: z.string().min(1).optional(),
		postalOrZip: z.string().min(1).optional(),
		countryCode: z
			.string()
			.length(2)
			.optional()
			.describe('ISO 3166-1 alpha-2, such as `US`.'),
		firstName: z.string().min(1).optional(),
		lastName: z.string().min(1).optional(),
		companyName: z.string().min(1).optional(),
		jobTitle: z.string().min(1).optional(),
		email: z.string().min(1).optional(),
		phoneNumber: z.string().min(1).optional(),
		description: z.string().min(1).optional(),
		skipVerification: z
			.boolean()
			.optional()
			.describe('Skip address correction and verification.'),
		forceVerifiedStatus: z
			.boolean()
			.optional()
			.describe('Override the address verification status.'),
		secret: z
			.boolean()
			.optional()
			.describe('Hide the details apart from the final print.'),
		// unknown: the caller's own arbitrary key-value data, stored as sent.
		metadata: z.record(z.string(), PostgridJsonValueSchema).optional(),
	})
	.loose();

export type ContactsCreateInput = z.infer<typeof ContactsCreateInputSchema>;

const contactsListInputSchema = z.object(pageFields);

export type ContactsListInput = z.infer<typeof contactsListInputSchema>;

const contactsListOutputSchema = z
	.object({ ...listEnvelopeFields, data: z.array(ContactSchema) })
	.loose();

export type ContactsListOutput = z.infer<typeof contactsListOutputSchema>;

const contactsGetInputSchema = z.object({
	id: IdSchema.describe('The `contact_` id.'),
});

export type ContactsGetInput = z.infer<typeof contactsGetInputSchema>;

const contactsDeleteInputSchema = z.object({
	id: IdSchema.describe('The `contact_` id.'),
});

export type ContactsDeleteInput = z.infer<typeof contactsDeleteInputSchema>;

const DeletedOutputSchema = z
	.object({
		id: IdSchema.nullish(),
		object: z.string().nullish(),
		// PostGrid answers a delete with the deleted resource, so the id is the
		// confirmation; there is no separate success flag to trust.
		live: z.boolean().nullish(),
	})
	.loose();

export type PostgridDeletedOutput = z.infer<typeof DeletedOutputSchema>;

// ── templates ─────────────────────────────────────────────────────────────

export const TemplateSchema = z
	.object({
		id: IdSchema.nullish(),
		object: z.string().nullish(),
		live: z.boolean().nullish(),
		description: z.string().nullish(),
		html: z.string().nullish(),
		metadata: z.record(z.string(), PostgridJsonValueSchema).nullish(),
	})
	.loose();

export type PostgridTemplate = z.infer<typeof TemplateSchema>;

const templatesCreateInputSchema = z.object({
	html: z
		.string()
		.min(1)
		.describe('The template body. `{{variableName}}` marks a merge variable.'),
	description: z.string().min(1).optional(),
	metadata: z.record(z.string(), PostgridJsonValueSchema).optional(),
});

export type TemplatesCreateInput = z.infer<typeof templatesCreateInputSchema>;

const templatesListInputSchema = z.object(pageFields);

export type TemplatesListInput = z.infer<typeof templatesListInputSchema>;

const templatesListOutputSchema = z
	.object({ ...listEnvelopeFields, data: z.array(TemplateSchema) })
	.loose();

export type TemplatesListOutput = z.infer<typeof templatesListOutputSchema>;

const templatesGetInputSchema = z.object({
	id: IdSchema.describe('The `template_` id.'),
});

export type TemplatesGetInput = z.infer<typeof templatesGetInputSchema>;

export const TemplatesUpdateInputSchema = z
	.object({
		id: IdSchema.describe('The `template_` id.'),
		html: z.string().min(1).optional(),
		description: z.string().min(1).optional(),
		// unknown: the caller's own arbitrary key-value data, stored as sent.
		metadata: z.record(z.string(), PostgridJsonValueSchema).optional(),
	})
	.superRefine((value, ctx) => {
		const { id: _ignored, ...changes } = value;
		if (Object.values(changes).every((field) => field === undefined)) {
			ctx.addIssue({
				code: 'custom',
				message: 'Supply at least one field to change.',
				path: ['id'],
			});
		}
	});

export type TemplatesUpdateInput = z.infer<typeof TemplatesUpdateInputSchema>;

const templatesDeleteInputSchema = z.object({
	id: IdSchema.describe('The `template_` id.'),
});

export type TemplatesDeleteInput = z.infer<typeof templatesDeleteInputSchema>;

// ── orders, shared shape ──────────────────────────────────────────────────

/** The fields every order carries, which the per-type schema extends. */
const orderOutputFields = {
	id: IdSchema.nullish(),
	object: z.string().nullish(),
	status: z
		.string()
		.nullish()
		.describe(
			'`ready`, `printing`, `processed_for_delivery`, `completed` or `cancelled`.',
		),
	imbStatus: z
		.string()
		.nullish()
		.describe('USPS intelligent-mail stage, only on live US mail.'),
	imbDate: z.string().nullish(),
	imbZIPCode: z.string().nullish(),
	live: z.boolean().nullish(),
	description: z.string().nullish(),
	sendDate: z.string().nullish(),
	to: ContactSchema.nullish(),
	from: ContactSchema.nullish(),
	mergeVariables: z.record(z.string(), PostgridJsonValueSchema).nullish(),
	metadata: z.record(z.string(), PostgridJsonValueSchema).nullish(),
	url: z.string().nullish().describe('A signed link to preview this order.'),
	pageCount: z.number().nullish(),
};

const orderInputFields = {
	to: contactInput.describe(
		'The recipient: a contact id or the address fields.',
	),
	from: contactInput.describe(
		'The sender: a contact id or the address fields.',
	),
	sendDate: z
		.string()
		.min(1)
		.optional()
		.describe('When to send it. Omit to send as soon as possible.'),
	mailingClass: MailingClassSchema,
	description: z.string().min(1).optional(),
	/** Sent as `Idempotency-Key`; reuse it to retry one order rather than place two. */
	idempotencyKey: z
		.string()
		.min(1)
		.max(256)
		.optional()
		.describe(
			'Reuse the same value to retry this order within 24 hours without creating a second one.',
		),
	mergeVariables: z.record(z.string(), PostgridJsonValueSchema).optional(),
	metadata: z.record(z.string(), PostgridJsonValueSchema).optional(),
};

const orderPageFields = {
	...pageFields,
	// Expansions are not allowed on a list, so they are declared per read.
};

// ── letters ───────────────────────────────────────────────────────────────

export const POSTGRID_LETTER_SIZES = ['us_letter', 'us_legal', 'a4'] as const;
export const POSTGRID_ADDRESS_PLACEMENTS = [
	'top_first_page',
	'insert_blank_page',
] as const;
export const POSTGRID_ENVELOPE_TYPES = [
	'standard_double_window',
	'flat',
] as const;

export const LettersCreateInputSchema = z
	.object({
		...orderInputFields,
		html: z
			.string()
			.min(1)
			.optional()
			.describe('The letter body. Supply this or a template.'),
		template: z
			.string()
			.min(1)
			.optional()
			.describe('A `template_` id to render instead of raw html.'),
		size: z.enum(POSTGRID_LETTER_SIZES).optional(),
		color: z.boolean().optional().describe('Print in colour.'),
		doubleSided: z.boolean().optional(),
		addressPlacement: z.enum(POSTGRID_ADDRESS_PLACEMENTS).optional(),
		envelopeType: z.enum(POSTGRID_ENVELOPE_TYPES).optional(),
		express: z.boolean().optional().describe('Send by express postage.'),
		perforatedPage: z
			.string()
			.min(1)
			.optional()
			.describe('The id of a page to perforate, for a tear-off return slip.'),
		returnEnvelope: z
			.string()
			.min(1)
			.optional()
			.describe('A `return_envelope_` id to include.'),
	})
	.superRefine((value, ctx) => {
		if (value.html === undefined && value.template === undefined) {
			ctx.addIssue({
				code: 'custom',
				message: 'Supply html or a template to print.',
				path: ['html'],
			});
		}
		if (value.html !== undefined && value.template !== undefined) {
			ctx.addIssue({
				code: 'custom',
				message: 'Supply html or a template, not both.',
				path: ['template'],
			});
		}
	});

export type LettersCreateInput = z.infer<typeof LettersCreateInputSchema>;

const LetterSchema = z
	.object({
		...orderOutputFields,
		html: z.string().nullish(),
		template: z.string().nullish(),
		uploadedPDF: z.string().nullish(),
		addressPlacement: z.string().nullish(),
		color: z.boolean().nullish(),
		doubleSided: z.boolean().nullish(),
		envelopeType: z.string().nullish(),
		mailingClass: z.string().nullish(),
	})
	.loose();

export type PostgridLetter = z.infer<typeof LetterSchema>;

const LettersListInputSchema = z.object(orderPageFields);

export type LettersListInput = z.infer<typeof LettersListInputSchema>;

const LettersListOutputSchema = z
	.object({ ...listEnvelopeFields, data: z.array(LetterSchema) })
	.loose();

export type LettersListOutput = z.infer<typeof LettersListOutputSchema>;

const LettersGetInputSchema = z.object({
	id: IdSchema.describe('The `letter_` id.'),
	expand: z
		.array(z.enum(['template']))
		.optional()
		.describe('Read the nested template inline. Not supported on a list.'),
});

export type LettersGetInput = z.infer<typeof LettersGetInputSchema>;

const LettersCancelInputSchema = z.object({
	id: IdSchema.describe(
		'The `letter_` id. A letter can be cancelled while `ready`.',
	),
});

export type LettersCancelInput = z.infer<typeof LettersCancelInputSchema>;

// ── postcards ─────────────────────────────────────────────────────────────

export const POSTGRID_POSTCARD_SIZES = ['6x4', '9x6', '11x6'] as const;

export const PostcardsCreateInputSchema = z
	.object({
		...orderInputFields,
		size: z
			.enum(POSTGRID_POSTCARD_SIZES)
			.describe('Which postcard stock to print.'),
		// The two faces are required: a card with one side blank is not a card.
		frontHTML: z
			.string()
			.min(1)
			.optional()
			.describe('The front face. Supply this or `frontTemplate`.'),
		backHTML: z
			.string()
			.min(1)
			.optional()
			.describe('The back face. Supply this or `backTemplate`.'),
		frontTemplate: z.string().min(1).optional(),
		backTemplate: z.string().min(1).optional(),
	})
	.superRefine((value, ctx) => {
		for (const side of ['front', 'back'] as const) {
			const html = side === 'front' ? value.frontHTML : value.backHTML;
			const template =
				side === 'front' ? value.frontTemplate : value.backTemplate;
			if (html === undefined && template === undefined) {
				ctx.addIssue({
					code: 'custom',
					message: `Supply ${side}HTML or ${side}Template.`,
					path: [`${side}HTML`],
				});
			}
			if (html !== undefined && template !== undefined) {
				ctx.addIssue({
					code: 'custom',
					message: `Supply ${side}HTML or ${side}Template, not both.`,
					path: [`${side}Template`],
				});
			}
		}
	});

export type PostcardsCreateInput = z.infer<typeof PostcardsCreateInputSchema>;

const PostcardSchema = z
	.object({
		...orderOutputFields,
		size: z.string().nullish(),
		frontHTML: z.string().nullish(),
		backHTML: z.string().nullish(),
		frontTemplate: z.string().nullish(),
		backTemplate: z.string().nullish(),
		mailingClass: z.string().nullish(),
	})
	.loose();

export type PostgridPostcard = z.infer<typeof PostcardSchema>;

const PostcardsListInputSchema = z.object(orderPageFields);

export type PostcardsListInput = z.infer<typeof PostcardsListInputSchema>;

const PostcardsListOutputSchema = z
	.object({ ...listEnvelopeFields, data: z.array(PostcardSchema) })
	.loose();

export type PostcardsListOutput = z.infer<typeof PostcardsListOutputSchema>;

const PostcardsGetInputSchema = z.object({
	id: IdSchema.describe('The `postcard_` id.'),
	expand: z.array(z.enum(['template'])).optional(),
});

export type PostcardsGetInput = z.infer<typeof PostcardsGetInputSchema>;

const PostcardsCancelInputSchema = z.object({
	id: IdSchema.describe('The `postcard_` id. Cancellable while `ready`.'),
});

export type PostcardsCancelInput = z.infer<typeof PostcardsCancelInputSchema>;

// ── self mailers ──────────────────────────────────────────────────────────

export const POSTGRID_SELF_MAILER_SIZES = [
	'8.5x11_bifold',
	'8.5x11_trifold',
] as const;

export const SelfMailersCreateInputSchema = z
	.object({
		...orderInputFields,
		size: z
			.enum(POSTGRID_SELF_MAILER_SIZES)
			.describe('Which fold to print and finish.'),
		insideHTML: z
			.string()
			.min(1)
			.optional()
			.describe('The inside panel. Supply this or `insideTemplate`.'),
		outsideHTML: z
			.string()
			.min(1)
			.optional()
			.describe('The outside panel. Supply this or `outsideTemplate`.'),
		insideTemplate: z.string().min(1).optional(),
		outsideTemplate: z.string().min(1).optional(),
	})
	.superRefine((value, ctx) => {
		for (const side of ['inside', 'outside'] as const) {
			const html = side === 'inside' ? value.insideHTML : value.outsideHTML;
			const template =
				side === 'inside' ? value.insideTemplate : value.outsideTemplate;
			if (html === undefined && template === undefined) {
				ctx.addIssue({
					code: 'custom',
					message: `Supply ${side}HTML or ${side}Template.`,
					path: [`${side}HTML`],
				});
			}
			if (html !== undefined && template !== undefined) {
				ctx.addIssue({
					code: 'custom',
					message: `Supply ${side}HTML or ${side}Template, not both.`,
					path: [`${side}Template`],
				});
			}
		}
	});

export type SelfMailersCreateInput = z.infer<
	typeof SelfMailersCreateInputSchema
>;

const SelfMailerSchema = z
	.object({
		...orderOutputFields,
		size: z.string().nullish(),
		insideHTML: z.string().nullish(),
		outsideHTML: z.string().nullish(),
		insideTemplate: z.string().nullish(),
		outsideTemplate: z.string().nullish(),
		mailingClass: z.string().nullish(),
	})
	.loose();

export type PostgridSelfMailer = z.infer<typeof SelfMailerSchema>;

const SelfMailersListInputSchema = z.object(orderPageFields);

export type SelfMailersListInput = z.infer<typeof SelfMailersListInputSchema>;

const SelfMailersListOutputSchema = z
	.object({ ...listEnvelopeFields, data: z.array(SelfMailerSchema) })
	.loose();

export type SelfMailersListOutput = z.infer<typeof SelfMailersListOutputSchema>;

const SelfMailersGetInputSchema = z.object({
	id: IdSchema.describe('The `self_mailer_` id.'),
	expand: z.array(z.enum(['template'])).optional(),
});

export type SelfMailersGetInput = z.infer<typeof SelfMailersGetInputSchema>;

// ── trackers ──────────────────────────────────────────────────────────────

const TrackersGetInputSchema = z.object({
	id: IdSchema.describe(
		'The id PostGrid gave the order, such as `letter_…` or `postcard_…`.',
	),
});

export type TrackersGetInput = z.infer<typeof TrackersGetInputSchema>;

/**
 * The tracker route answers the order it tracks, with its `status` and, on live
 * US mail, the `imbStatus` stage, so the output accepts any order's fields.
 */
const TrackerOutputSchema = z
	.object({
		id: IdSchema.nullish(),
		object: z.string().nullish(),
		status: z.string().nullish(),
		imbStatus: z.string().nullish(),
		imbDate: z.string().nullish(),
		imbZIPCode: z.string().nullish(),
		sendDate: z.string().nullish(),
	})
	.loose();

export type PostgridTracker = z.infer<typeof TrackerOutputSchema>;

// ── Registry ──────────────────────────────────────────────────────────────

export type PostgridEndpointInputs = {
	contactsList: ContactsListInput;
	contactsGet: ContactsGetInput;
	contactsCreate: ContactsCreateInput;
	contactsDelete: ContactsDeleteInput;
	templatesList: TemplatesListInput;
	templatesGet: TemplatesGetInput;
	templatesCreate: TemplatesCreateInput;
	templatesUpdate: TemplatesUpdateInput;
	templatesDelete: TemplatesDeleteInput;
	lettersList: LettersListInput;
	lettersGet: LettersGetInput;
	lettersCreate: LettersCreateInput;
	lettersCancel: LettersCancelInput;
	postcardsList: PostcardsListInput;
	postcardsGet: PostcardsGetInput;
	postcardsCreate: PostcardsCreateInput;
	postcardsCancel: PostcardsCancelInput;
	selfMailersList: SelfMailersListInput;
	selfMailersGet: SelfMailersGetInput;
	selfMailersCreate: SelfMailersCreateInput;
	trackersGet: TrackersGetInput;
};

export type PostgridEndpointOutputs = {
	contactsList: ContactsListOutput;
	contactsGet: PostgridContact;
	contactsCreate: PostgridContact;
	contactsDelete: PostgridDeletedOutput;
	templatesList: TemplatesListOutput;
	templatesGet: PostgridTemplate;
	templatesCreate: PostgridTemplate;
	templatesUpdate: PostgridTemplate;
	templatesDelete: PostgridDeletedOutput;
	lettersList: LettersListOutput;
	lettersGet: PostgridLetter;
	lettersCreate: PostgridLetter;
	lettersCancel: PostgridLetter;
	postcardsList: PostcardsListOutput;
	postcardsGet: PostgridPostcard;
	postcardsCreate: PostgridPostcard;
	postcardsCancel: PostgridPostcard;
	selfMailersList: SelfMailersListOutput;
	selfMailersGet: PostgridSelfMailer;
	selfMailersCreate: PostgridSelfMailer;
	trackersGet: PostgridTracker;
};

export const PostgridEndpointInputSchemas = {
	contactsList: contactsListInputSchema,
	contactsGet: contactsGetInputSchema,
	contactsCreate: ContactsCreateInputSchema,
	contactsDelete: contactsDeleteInputSchema,
	templatesList: templatesListInputSchema,
	templatesGet: templatesGetInputSchema,
	templatesCreate: templatesCreateInputSchema,
	templatesUpdate: TemplatesUpdateInputSchema,
	templatesDelete: templatesDeleteInputSchema,
	lettersList: LettersListInputSchema,
	lettersGet: LettersGetInputSchema,
	lettersCreate: LettersCreateInputSchema,
	lettersCancel: LettersCancelInputSchema,
	postcardsList: PostcardsListInputSchema,
	postcardsGet: PostcardsGetInputSchema,
	postcardsCreate: PostcardsCreateInputSchema,
	postcardsCancel: PostcardsCancelInputSchema,
	selfMailersList: SelfMailersListInputSchema,
	selfMailersGet: SelfMailersGetInputSchema,
	selfMailersCreate: SelfMailersCreateInputSchema,
	trackersGet: TrackersGetInputSchema,
} as const;

export const PostgridEndpointOutputSchemas = {
	contactsList: contactsListOutputSchema,
	contactsGet: ContactSchema,
	contactsCreate: ContactSchema,
	contactsDelete: DeletedOutputSchema,
	templatesList: templatesListOutputSchema,
	templatesGet: TemplateSchema,
	templatesCreate: TemplateSchema,
	templatesUpdate: TemplateSchema,
	templatesDelete: DeletedOutputSchema,
	lettersList: LettersListOutputSchema,
	lettersGet: LetterSchema,
	lettersCreate: LetterSchema,
	lettersCancel: LetterSchema,
	postcardsList: PostcardsListOutputSchema,
	postcardsGet: PostcardSchema,
	postcardsCreate: PostcardSchema,
	postcardsCancel: PostcardSchema,
	selfMailersList: SelfMailersListOutputSchema,
	selfMailersGet: SelfMailerSchema,
	selfMailersCreate: SelfMailerSchema,
	trackersGet: TrackerOutputSchema,
} as const;
