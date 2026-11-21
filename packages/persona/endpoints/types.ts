import { z } from 'zod';

// Shapes follow Persona's API reference for version 2023-01-05
// (https://docs.withpersona.com/2023-01-05/api-reference). Persona answers
// JSON:API: `{ data, included?, meta?, links? }`, with kebab-case attribute
// keys (the default Key-Inflection). Responses stay loose and nullish so a
// field Persona adds or drops does not break a read; inputs stay strict
// where the reference is specific.

// ── Shared building blocks ─────────────────────────────────────────────────

// unknown: related resources and relationships vary by object and by the
// include parameter, so they stay open.
const included = z
	.array(z.unknown())
	.nullish()
	.describe('Related resources requested via include');
const relationships = z
	.record(z.string(), z.unknown())
	.nullish()
	.describe('Links to related resources');

/** `{ data: <object>, included?, meta? }`. */
const DataWrapper = <T extends z.ZodTypeAny>(resource: T) =>
	z
		.object({
			data: resource,
			included,
			// unknown: some routes add route-specific meta (one-time links).
			meta: z.record(z.string(), z.unknown()).nullish(),
		})
		.loose();

/** Cursor links on list answers. */
const LinksSchema = z
	.object({
		prev: z.string().nullish().describe('URL of the previous page, or null'),
		next: z
			.string()
			.nullish()
			.describe(
				'URL of the next page, or null on the last page; its page[after] is the next cursor',
			),
	})
	.loose()
	.describe('Pagination links');

/** `{ data: [...], links, included? }`. */
const DataListWrapper = <T extends z.ZodTypeAny>(resource: T) =>
	z
		.object({
			data: z.array(resource),
			links: LinksSchema.nullish(),
			included,
		})
		.loose();

/** Builds one JSON:API resource object with typed, loose attributes. */
const resource = <A extends z.ZodRawShape>(what: string, attributes: A) =>
	z
		.object({
			id: z.string().min(1).describe(`${what} id`),
			type: z.string().nullish().describe('JSON:API resource type'),
			attributes: z
				.object(attributes)
				.loose()
				.nullish()
				.describe(`${what} attributes`),
			relationships,
		})
		.loose()
		.describe(`A Persona ${what.toLowerCase()}`);

const text = (description: string) =>
	z.string().nullish().describe(description);
const tags = z.array(z.string()).nullish().describe('Tag names');
// unknown: field values follow the account type or inquiry template.
const fields = z
	.record(z.string(), z.unknown())
	.nullish()
	.describe('Field values keyed by field name, as the template defines them');

/** A Persona account (an end user being verified). */
export const AccountSchema = resource('Account', {
	'reference-id': text('Your reference for the end user'),
	'account-type-name': text('Account type'),
	'account-status': text('Account status'),
	'created-at': text('Creation timestamp'),
	'updated-at': text('Last update timestamp'),
	'redacted-at': text('When the account was redacted'),
	tags,
	fields,
	'name-first': text('Given name'),
	'name-last': text('Family name'),
	'email-address': text('Email address'),
	'phone-number': text('Phone number'),
	'country-code': text('ISO 3166-1 alpha-2 country code'),
});
export type Account = z.infer<typeof AccountSchema>;

/** A Persona inquiry (one verification run). */
export const InquirySchema = resource('Inquiry', {
	status: text(
		'Inquiry status: created, pending, completed, failed, expired, needs_review, approved or declined',
	),
	'reference-id': text('Your reference for the end user'),
	note: text('Unstructured note'),
	tags,
	fields,
	'created-at': text('Creation timestamp'),
	'updated-at': text('Last update timestamp'),
	'completed-at': text('When the inquiry completed'),
	'decisioned-at': text('When the inquiry was approved or declined'),
	'expires-at': text('When the inquiry expires'),
	'redacted-at': text('When the inquiry was redacted'),
	'reviewer-comment': text('Comment from the reviewer'),
});
export type Inquiry = z.infer<typeof InquirySchema>;

/** An inquiry session (one device working through an inquiry). */
export const InquirySessionSchema = resource('Inquiry session', {
	status: text('Session status: new, active or expired'),
	'created-at': text('Creation timestamp'),
	'started-at': text('When the session started'),
	'expired-at': text('When the session expired'),
});
export type InquirySession = z.infer<typeof InquirySessionSchema>;

/** An inquiry template. */
export const InquiryTemplateSchema = resource('Inquiry template', {
	name: text('Template name'),
	status: text('Template status: active or inactive'),
});
export type InquiryTemplate = z.infer<typeof InquiryTemplateSchema>;

/** A version of an inquiry template. */
export const TemplateVersionSchema = resource('Inquiry template version', {
	'name-display': text('Display name'),
	description: text('What changed in this version'),
	status: text('Version status: published or draft'),
	live: z.boolean().nullish().describe('Whether the version is deployed'),
});
export type TemplateVersion = z.infer<typeof TemplateVersionSchema>;

const webhookAttributes = {
	status: text('Webhook status: enabled, disabled or archived'),
	url: text('Endpoint deliveries are posted to'),
	name: text('Webhook name'),
	description: text('Webhook description'),
	'enabled-events': z
		.array(z.string())
		.nullish()
		.describe('Events the webhook delivers'),
	'api-version': text('API version deliveries use'),
	'api-key-inflection': text('Key casing deliveries use'),
};

/** A webhook. */
export const WebhookConfigSchema = resource('Webhook', webhookAttributes);
export type WebhookConfig = z.infer<typeof WebhookConfigSchema>;

/** A webhook answer that carries its signing secret (create, rotate). */
export const WebhookWithSecretSchema = resource('Webhook', {
	...webhookAttributes,
	secret: text('Signing secret (deprecated by Persona in favour of secrets)'),
	secrets: z
		// unknown: each secret entry carries the value and its expiry.
		.array(z.unknown())
		.nullish()
		.describe('Active signing secrets'),
});

/** A recorded webhook event. */
export const WebhookEventSchema = resource('Webhook event', {
	status: text('Delivery status'),
	'created-at': text('Creation timestamp'),
});
export type WebhookEvent = z.infer<typeof WebhookEventSchema>;

/** List paging inputs, sent as page[after], page[before] and page[size]. */
const paging = {
	pageAfter: z
		.string()
		.min(1)
		.optional()
		.describe('Cursor: the id after which the page starts (from links.next)'),
	pageBefore: z
		.string()
		.min(1)
		.optional()
		.describe('Cursor: the id before which the page ends (from links.prev)'),
	pageSize: z
		.number()
		.int()
		.min(1)
		.optional()
		.describe('How many records per page'),
};

/** The search routes' body: a predicate tree, a sort and a page. */
const searchBody = {
	// unknown: Persona's search query is a tree of and/or/not clauses and
	// leaf predicates (eq, gt, gte, lt, lte, in, ...), so it stays an open record.
	query: z
		.record(z.string(), z.unknown())
		.optional()
		.describe(
			'Search predicate tree, e.g. { attribute: "reference-id", operator: "eq", value: "user_1" } or { and: [...] }',
		),
	sort: z
		.object({
			attribute: z.string().min(1).describe('Attribute to sort by'),
			direction: z.enum(['asc', 'desc']).describe('Sort direction'),
		})
		.optional()
		.describe('Sort order'),
	page: z
		.object({
			after: z.string().min(1).optional().describe('Cursor from links.next'),
			before: z.string().min(1).optional().describe('Cursor from links.prev'),
			size: z.number().int().min(1).optional().describe('Results per page'),
		})
		.optional()
		.describe('Paging'),
};

/** The tag routes take a tag name or a tag id. */
const tagFields = {
	tagName: z.string().min(1).optional().describe('Tag name'),
	tagId: z.string().min(1).optional().describe('Tag id'),
};
const hasTag = (input: { tagName?: string; tagId?: string }) =>
	input.tagName !== undefined || input.tagId !== undefined;
const tagMessage = { message: 'Give tagName or tagId' };

/** Attributes accounts.create and accounts.update take. */
const accountAttributes = {
	'reference-id': z
		.string()
		.min(1)
		.optional()
		.describe('Your reference for the end user'),
	'account-status': z.string().min(1).optional().describe('Status name to set'),
	tags: z.array(z.string()).optional().describe('Tag names'),
	// unknown: field values follow the account type.
	fields: z
		.record(z.string(), z.unknown())
		.optional()
		.describe('Field values, as the account type defines them'),
	'name-first': z.string().optional().describe('Given name'),
	'name-middle': z.string().optional().describe('Middle name'),
	'name-last': z.string().optional().describe('Family name'),
	birthdate: z.string().optional().describe('Birthdate, YYYY-MM-DD'),
	'email-address': z.string().optional().describe('Email address'),
	'phone-number': z.string().optional().describe('Phone number'),
	'country-code': z
		.string()
		.optional()
		.describe('ISO 3166-1 alpha-2 country code'),
	'address-street-1': z.string().optional().describe('Street address'),
	'address-street-2': z.string().optional().describe('Apartment or suite'),
	'address-city': z.string().optional().describe('City'),
	'address-subdivision': z.string().optional().describe('State or region'),
	'address-postal-code': z.string().optional().describe('Postal code'),
};

// ── accounts ───────────────────────────────────────────────────────────────

export const ListAccountsInputSchema = z
	.object({
		...paging,
		referenceId: z
			.string()
			.min(1)
			.optional()
			.describe('Only accounts with this reference id'),
	})
	.describe('Query parameters for listing accounts');
export type ListAccountsInput = z.infer<typeof ListAccountsInputSchema>;

export const ListAccountsOutputSchema =
	DataListWrapper(AccountSchema).describe('A page of accounts');
export type ListAccountsOutput = z.infer<typeof ListAccountsOutputSchema>;

export const GetAccountInputSchema = z
	.object({ accountId: z.string().min(1).describe('Account id (act_...)') })
	.describe('Input for reading one account');
export type GetAccountInput = z.infer<typeof GetAccountInputSchema>;

export const GetAccountOutputSchema =
	DataWrapper(AccountSchema).describe('The account');
export type GetAccountOutput = z.infer<typeof GetAccountOutputSchema>;

export const CreateAccountInputSchema = z
	.object({
		attributes: z
			.object({
				'account-type-id': z
					.string()
					.min(1)
					.optional()
					.describe(
						'Account type id (acttp_...); the default type when omitted',
					),
				...accountAttributes,
			})
			.loose()
			.describe('Account attributes'),
	})
	.describe('Create an account');
export type CreateAccountInput = z.infer<typeof CreateAccountInputSchema>;

export const CreateAccountOutputSchema = DataWrapper(AccountSchema).describe(
	'The account as created',
);
export type CreateAccountOutput = z.infer<typeof CreateAccountOutputSchema>;

export const UpdateAccountInputSchema = z
	.object({
		accountId: z.string().min(1).describe('Account id'),
		attributes: z
			.object(accountAttributes)
			.loose()
			.describe('Account attributes to change'),
	})
	.describe('Update an account');
export type UpdateAccountInput = z.infer<typeof UpdateAccountInputSchema>;

export const UpdateAccountOutputSchema = DataWrapper(AccountSchema).describe(
	'The account as updated',
);
export type UpdateAccountOutput = z.infer<typeof UpdateAccountOutputSchema>;

export const RedactAccountInputSchema = z
	.object({ accountId: z.string().min(1).describe('Account id') })
	.describe('Redact an account');
export type RedactAccountInput = z.infer<typeof RedactAccountInputSchema>;

export const RedactAccountOutputSchema = DataWrapper(AccountSchema).describe(
	'The redacted account',
);
export type RedactAccountOutput = z.infer<typeof RedactAccountOutputSchema>;

export const SearchAccountsInputSchema = z
	.object(searchBody)
	.describe('Search accounts');
export type SearchAccountsInput = z.infer<typeof SearchAccountsInputSchema>;

export const SearchAccountsOutputSchema = DataListWrapper(
	AccountSchema,
).describe('The matching accounts');
export type SearchAccountsOutput = z.infer<typeof SearchAccountsOutputSchema>;

export const AddTagInputSchema = z
	.object({
		accountId: z.string().min(1).describe('Account id'),
		...tagFields,
	})
	.refine(hasTag, tagMessage)
	.describe('Add a tag to an account');
export type AddTagInput = z.infer<typeof AddTagInputSchema>;

export const RemoveTagInputSchema = z
	.object({
		accountId: z.string().min(1).describe('Account id'),
		...tagFields,
	})
	.refine(hasTag, tagMessage)
	.describe('Remove a tag from an account');
export type RemoveTagInput = z.infer<typeof RemoveTagInputSchema>;

export const AccountTagOutputSchema = DataWrapper(AccountSchema).describe(
	'The account with its tags',
);

// ── inquiries ──────────────────────────────────────────────────────────────

export const ListInquiriesInputSchema = z
	.object({
		...paging,
		status: z
			.string()
			.min(1)
			.optional()
			.describe('Comma-separated statuses, e.g. completed,needs_review'),
		accountId: z
			.string()
			.min(1)
			.optional()
			.describe('Comma-separated account ids'),
		referenceId: z
			.string()
			.min(1)
			.optional()
			.describe('Only inquiries with this reference id'),
		inquiryTemplateId: z
			.string()
			.min(1)
			.optional()
			.describe('Comma-separated inquiry template ids (itmpl_...)'),
		templateId: z
			.string()
			.min(1)
			.optional()
			.describe('Comma-separated legacy template ids (tmpl_...)'),
	})
	.describe('Query parameters for listing inquiries');
export type ListInquiriesInput = z.infer<typeof ListInquiriesInputSchema>;

export const ListInquiriesOutputSchema = DataListWrapper(
	InquirySchema,
).describe('A page of inquiries');
export type ListInquiriesOutput = z.infer<typeof ListInquiriesOutputSchema>;

export const GetInquiryInputSchema = z
	.object({ inquiryId: z.string().min(1).describe('Inquiry id (inq_...)') })
	.describe('Input for reading one inquiry');
export type GetInquiryInput = z.infer<typeof GetInquiryInputSchema>;

export const GetInquiryOutputSchema =
	DataWrapper(InquirySchema).describe('The inquiry');
export type GetInquiryOutput = z.infer<typeof GetInquiryOutputSchema>;

export const CreateInquiryInputSchema = z
	.object({
		attributes: z
			.object({
				'inquiry-template-id': z
					.string()
					.min(1)
					.optional()
					.describe('Template the inquiry runs, for ids starting itmpl_'),
				'template-id': z
					.string()
					.min(1)
					.optional()
					.describe('Legacy template, for ids starting tmpl_'),
				'inquiry-template-version-id': z
					.string()
					.min(1)
					.optional()
					.describe('A specific template version (itmplv_...)'),
				'account-id': z
					.string()
					.min(1)
					.optional()
					.describe('Account to attach the inquiry to'),
				'reference-id': z
					.string()
					.min(1)
					.optional()
					.describe('Your reference for the end user (deprecated by Persona)'),
				'redirect-uri': z
					.url()
					.optional()
					.describe('Where the hosted flow redirects after completion'),
				note: z.string().optional().describe('Unstructured note'),
				// unknown: field values follow the inquiry template.
				fields: z
					.record(z.string(), z.unknown())
					.optional()
					.describe('Prefilled field values, as the template defines them'),
				tags: z.array(z.string()).optional().describe('Tag names to associate'),
			})
			.loose()
			.refine(
				(attributes) =>
					attributes['inquiry-template-id'] !== undefined ||
					attributes['template-id'] !== undefined ||
					attributes['inquiry-template-version-id'] !== undefined,
				{
					message:
						'Give inquiry-template-id, template-id or inquiry-template-version-id',
				},
			)
			.describe('Inquiry attributes'),
		meta: z
			.object({
				'auto-create-account': z
					.boolean()
					.optional()
					.describe(
						'Create an account when none exists (Persona default true)',
					),
				'auto-create-account-reference-id': z
					.string()
					.min(1)
					.optional()
					.describe('Attach to the account with this reference id'),
				'auto-create-one-time-link': z
					.boolean()
					.optional()
					.describe('Also create a one-time link'),
				'expiration-after-create-interval-seconds': z
					.number()
					.int()
					.min(1)
					.optional()
					.describe('Expire the inquiry this many seconds after creation'),
			})
			.loose()
			.optional()
			.describe('Creation options'),
	})
	.describe('Create an inquiry from a template');
export type CreateInquiryInput = z.infer<typeof CreateInquiryInputSchema>;

export const CreateInquiryOutputSchema = DataWrapper(InquirySchema).describe(
	'The inquiry as created',
);
export type CreateInquiryOutput = z.infer<typeof CreateInquiryOutputSchema>;

export const UpdateInquiryInputSchema = z
	.object({
		inquiryId: z.string().min(1).describe('Inquiry id'),
		attributes: z
			.object({
				note: z.string().nullable().optional().describe('Unstructured note'),
				// unknown: field values follow the inquiry template.
				fields: z
					.record(z.string(), z.unknown())
					.optional()
					.describe('Field values, as the template defines them'),
				tags: z.array(z.string()).optional().describe('Tag names'),
				'redirect-uri': z
					.url()
					.nullable()
					.optional()
					.describe('Where the hosted flow redirects after completion'),
			})
			.loose()
			.describe('Inquiry attributes to change'),
	})
	.describe('Update an inquiry');
export type UpdateInquiryInput = z.infer<typeof UpdateInquiryInputSchema>;

export const UpdateInquiryOutputSchema = DataWrapper(InquirySchema).describe(
	'The inquiry as updated',
);
export type UpdateInquiryOutput = z.infer<typeof UpdateInquiryOutputSchema>;

export const RedactInquiryInputSchema = z
	.object({ inquiryId: z.string().min(1).describe('Inquiry id') })
	.describe('Redact an inquiry');
export type RedactInquiryInput = z.infer<typeof RedactInquiryInputSchema>;

export const RedactInquiryOutputSchema = DataWrapper(InquirySchema).describe(
	'The redacted inquiry',
);
export type RedactInquiryOutput = z.infer<typeof RedactInquiryOutputSchema>;

const decisionInput = (what: string) =>
	z
		.object({
			inquiryId: z.string().min(1).describe('Inquiry id'),
			comment: z
				.string()
				.min(1)
				.optional()
				.describe('Comment kept for auditing'),
		})
		.describe(what);

export const ApproveInquiryInputSchema = decisionInput('Approve an inquiry');
export type ApproveInquiryInput = z.infer<typeof ApproveInquiryInputSchema>;

export const ApproveInquiryOutputSchema = DataWrapper(InquirySchema).describe(
	'The approved inquiry',
);
export type ApproveInquiryOutput = z.infer<typeof ApproveInquiryOutputSchema>;

export const DeclineInquiryInputSchema = decisionInput('Decline an inquiry');
export type DeclineInquiryInput = z.infer<typeof DeclineInquiryInputSchema>;

export const DeclineInquiryOutputSchema = DataWrapper(InquirySchema).describe(
	'The declined inquiry',
);
export type DeclineInquiryOutput = z.infer<typeof DeclineInquiryOutputSchema>;

export const MarkForReviewInputSchema = z
	.object({ inquiryId: z.string().min(1).describe('Inquiry id') })
	.describe('Mark an inquiry for review');
export type MarkForReviewInput = z.infer<typeof MarkForReviewInputSchema>;

export const MarkForReviewOutputSchema = DataWrapper(InquirySchema).describe(
	'The inquiry marked for review',
);
export type MarkForReviewOutput = z.infer<typeof MarkForReviewOutputSchema>;

const expiresInSeconds = z
	.number()
	.int()
	.min(1)
	.optional()
	.describe(
		'Seconds until the link expires; the template default when omitted',
	);

export const GenerateOneTimeLinkInputSchema = z
	.object({
		inquiryId: z.string().min(1).describe('Inquiry id (inq_...)'),
		expiresInSeconds,
	})
	.describe('Generate a one-time link for an inquiry');
export type GenerateOneTimeLinkInput = z.infer<
	typeof GenerateOneTimeLinkInputSchema
>;

const OneTimeLinkMetaSchema = z
	.object({
		'one-time-link': z.string().nullish().describe('The one-time link URL'),
		'one-time-link-short': z
			.string()
			.nullish()
			.describe('A shortened one-time link URL'),
	})
	.loose()
	.describe('The generated link');
export type OneTimeLink = z.infer<typeof OneTimeLinkMetaSchema>;

export const GenerateOneTimeLinkOutputSchema = z
	.object({
		data: InquirySchema,
		meta: OneTimeLinkMetaSchema,
		included,
	})
	.loose()
	.describe('The inquiry and its one-time link');
export type GenerateOneTimeLinkOutput = z.infer<
	typeof GenerateOneTimeLinkOutputSchema
>;

export const InquiryTagInputSchema = z
	.object({
		inquiryId: z.string().min(1).describe('Inquiry id'),
		...tagFields,
	})
	.refine(hasTag, tagMessage)
	.describe('Add or remove an inquiry tag');
export type InquiryTagInput = z.infer<typeof InquiryTagInputSchema>;

export const InquiryTagOutputSchema = DataWrapper(InquirySchema).describe(
	'The inquiry with its tags',
);

// ── inquiry sessions ───────────────────────────────────────────────────────

export const CreateInquirySessionInputSchema = z
	.object({
		inquiryId: z
			.string()
			.min(1)
			.describe('Inquiry the session belongs to (inq_...)'),
	})
	.describe('Create an inquiry session');
export type CreateInquirySessionInput = z.infer<
	typeof CreateInquirySessionInputSchema
>;

export const CreateInquirySessionOutputSchema = DataWrapper(
	InquirySessionSchema,
).describe('The session as created');
export type CreateInquirySessionOutput = z.infer<
	typeof CreateInquirySessionOutputSchema
>;

export const GetInquirySessionInputSchema = z
	.object({ inquirySessionId: z.string().min(1).describe('Session id') })
	.describe('Input for reading one inquiry session');
export type GetInquirySessionInput = z.infer<
	typeof GetInquirySessionInputSchema
>;

export const GetInquirySessionOutputSchema =
	DataWrapper(InquirySessionSchema).describe('The session');
export type GetInquirySessionOutput = z.infer<
	typeof GetInquirySessionOutputSchema
>;

export const ExpireSessionInputSchema = z
	.object({ inquirySessionId: z.string().min(1).describe('Session id') })
	.describe('Expire one inquiry session');
export type ExpireSessionInput = z.infer<typeof ExpireSessionInputSchema>;

export const ExpireSessionOutputSchema = DataWrapper(
	InquirySessionSchema,
).describe('The expired session');
export type ExpireSessionOutput = z.infer<typeof ExpireSessionOutputSchema>;

export const ExpireAllSessionsInputSchema = z
	.object({
		inquiryIds: z
			.array(z.string().min(1))
			.min(1)
			.describe('Inquiries whose sessions all expire'),
	})
	.describe('Expire every session of the given inquiries');
export type ExpireAllSessionsInput = z.infer<
	typeof ExpireAllSessionsInputSchema
>;

export const ExpireAllSessionsOutputSchema = z
	.object({
		data: z.array(InquirySessionSchema).describe('The expired sessions'),
		included,
	})
	.loose()
	.describe('The expired sessions');
export type ExpireAllSessionsOutput = z.infer<
	typeof ExpireAllSessionsOutputSchema
>;

export const SessionOneTimeLinkInputSchema = z
	.object({ inquirySessionId: z.string().min(1).describe('Session id') })
	.describe('Generate a one-time link for an inquiry session');
export type SessionOneTimeLinkInput = z.infer<
	typeof SessionOneTimeLinkInputSchema
>;

export const SessionOneTimeLinkOutputSchema = z
	.object({
		data: InquirySessionSchema,
		meta: OneTimeLinkMetaSchema,
		included,
	})
	.loose()
	.describe('The session and its one-time link');
export type SessionOneTimeLinkOutput = z.infer<
	typeof SessionOneTimeLinkOutputSchema
>;

// ── inquiry templates ──────────────────────────────────────────────────────

export const ListTemplatesInputSchema = z
	.object(paging)
	.describe('Query parameters for listing inquiry templates');
export type ListTemplatesInput = z.infer<typeof ListTemplatesInputSchema>;

export const ListTemplatesOutputSchema = DataListWrapper(
	InquiryTemplateSchema,
).describe('The inquiry templates');
export type ListTemplatesOutput = z.infer<typeof ListTemplatesOutputSchema>;

export const GetTemplateInputSchema = z
	.object({
		inquiryTemplateId: z.string().min(1).describe('Template id (itmpl_...)'),
	})
	.describe('Input for reading one inquiry template');
export type GetTemplateInput = z.infer<typeof GetTemplateInputSchema>;

export const GetTemplateOutputSchema = DataWrapper(
	InquiryTemplateSchema,
).describe('The inquiry template');
export type GetTemplateOutput = z.infer<typeof GetTemplateOutputSchema>;

export const ListTemplateVersionsInputSchema = z
	.object({
		inquiryTemplateId: z
			.string()
			.min(1)
			.describe('Template whose versions to list (itmpl_...)'),
		...paging,
	})
	.describe('Query parameters for listing inquiry template versions');
export type ListTemplateVersionsInput = z.infer<
	typeof ListTemplateVersionsInputSchema
>;

export const ListTemplateVersionsOutputSchema = DataListWrapper(
	TemplateVersionSchema,
).describe('The inquiry template versions');
export type ListTemplateVersionsOutput = z.infer<
	typeof ListTemplateVersionsOutputSchema
>;

// ── webhooks ───────────────────────────────────────────────────────────────

export const ListWebhooksInputSchema = z
	.object(paging)
	.describe('Query parameters for listing webhooks');
export type ListWebhooksInput = z.infer<typeof ListWebhooksInputSchema>;

export const ListWebhooksOutputSchema =
	DataListWrapper(WebhookConfigSchema).describe('The webhooks');
export type ListWebhooksOutput = z.infer<typeof ListWebhooksOutputSchema>;

const webhookRequestAttributes = {
	name: z.string().min(1).optional().describe('Webhook name'),
	description: z.string().optional().describe('Webhook description'),
	'api-version': z
		.string()
		.min(1)
		.optional()
		.describe('API version deliveries use, e.g. 2023-01-05'),
	'api-key-inflection': z
		.enum(['kebab', 'camel', 'snake'])
		.optional()
		.describe('Key casing deliveries use (Persona default kebab)'),
};

export const CreateWebhookInputSchema = z
	.object({
		attributes: z
			.object({
				url: z.url().describe('Endpoint deliveries are posted to'),
				'enabled-events': z
					.array(z.string().min(1))
					.min(1)
					.describe(
						'Events to deliver, e.g. inquiry.approved, inquiry.declined, or * for all',
					),
				...webhookRequestAttributes,
			})
			.loose()
			.describe('Webhook attributes'),
	})
	.describe('Create a webhook');
export type CreateWebhookInput = z.infer<typeof CreateWebhookInputSchema>;

export const CreateWebhookOutputSchema = DataWrapper(
	WebhookWithSecretSchema,
).describe('The webhook as created, with its signing secret');
export type CreateWebhookOutput = z.infer<typeof CreateWebhookOutputSchema>;

export const GetWebhookInputSchema = z
	.object({ webhookId: z.string().min(1).describe('Webhook id (wbh_...)') })
	.describe('Input for reading one webhook');
export type GetWebhookInput = z.infer<typeof GetWebhookInputSchema>;

export const GetWebhookOutputSchema =
	DataWrapper(WebhookConfigSchema).describe('The webhook');
export type GetWebhookOutput = z.infer<typeof GetWebhookOutputSchema>;

export const UpdateWebhookInputSchema = z
	.object({
		webhookId: z.string().min(1).describe('Webhook id'),
		attributes: z
			.object({
				url: z.url().optional().describe('Endpoint deliveries are posted to'),
				'enabled-events': z
					.array(z.string().min(1))
					.min(1)
					.optional()
					.describe('Events to deliver'),
				...webhookRequestAttributes,
			})
			.loose()
			.describe(
				'Webhook attributes to change; use enable/disable for the state',
			),
	})
	.describe('Update a webhook');
export type UpdateWebhookInput = z.infer<typeof UpdateWebhookInputSchema>;

export const UpdateWebhookOutputSchema = DataWrapper(
	WebhookConfigSchema,
).describe('The webhook as updated');
export type UpdateWebhookOutput = z.infer<typeof UpdateWebhookOutputSchema>;

export const SetWebhookStateInputSchema = z
	.object({ webhookId: z.string().min(1).describe('Webhook id') })
	.describe('Change a webhook state');
export type SetWebhookStateInput = z.infer<typeof SetWebhookStateInputSchema>;

export const WebhookStateOutputSchema = DataWrapper(
	WebhookConfigSchema,
).describe('The webhook in its new state');
export type WebhookStateOutput = z.infer<typeof WebhookStateOutputSchema>;

export const RotateWebhookSecretInputSchema = z
	.object({
		webhookId: z.string().min(1).describe('Webhook id'),
		expiresInSeconds: z
			.number()
			.int()
			.min(0)
			.optional()
			.describe(
				'Seconds the current secret keeps signing beside the new one; Persona default when omitted',
			),
	})
	.describe('Rotate a webhook signing secret');
export type RotateWebhookSecretInput = z.infer<
	typeof RotateWebhookSecretInputSchema
>;

export const RotateWebhookSecretOutputSchema = DataWrapper(
	WebhookWithSecretSchema,
).describe('The webhook with its new signing secret');
export type RotateWebhookSecretOutput = z.infer<
	typeof RotateWebhookSecretOutputSchema
>;

export const SearchWebhookEventsInputSchema = z
	.object(searchBody)
	.describe('Search recorded webhook events');
export type SearchWebhookEventsInput = z.infer<
	typeof SearchWebhookEventsInputSchema
>;

export const SearchWebhookEventsOutputSchema = DataListWrapper(
	WebhookEventSchema,
).describe('The matching webhook events');
export type SearchWebhookEventsOutput = z.infer<
	typeof SearchWebhookEventsOutputSchema
>;

// ── Operation registry ─────────────────────────────────────────────────────

export const PersonaEndpointInputSchemas = {
	accountsList: ListAccountsInputSchema,
	accountsGet: GetAccountInputSchema,
	accountsCreate: CreateAccountInputSchema,
	accountsUpdate: UpdateAccountInputSchema,
	accountsRedact: RedactAccountInputSchema,
	accountsSearch: SearchAccountsInputSchema,
	accountsAddTag: AddTagInputSchema,
	accountsRemoveTag: RemoveTagInputSchema,
	inquiriesList: ListInquiriesInputSchema,
	inquiriesGet: GetInquiryInputSchema,
	inquiriesCreate: CreateInquiryInputSchema,
	inquiriesUpdate: UpdateInquiryInputSchema,
	inquiriesRedact: RedactInquiryInputSchema,
	inquiriesApprove: ApproveInquiryInputSchema,
	inquiriesDecline: DeclineInquiryInputSchema,
	inquiriesMarkForReview: MarkForReviewInputSchema,
	inquiriesGenerateOneTimeLink: GenerateOneTimeLinkInputSchema,
	inquiriesAddTag: InquiryTagInputSchema,
	inquiriesRemoveTag: InquiryTagInputSchema,
	inquirySessionsCreate: CreateInquirySessionInputSchema,
	inquirySessionsGet: GetInquirySessionInputSchema,
	inquirySessionsExpire: ExpireSessionInputSchema,
	inquirySessionsExpireAll: ExpireAllSessionsInputSchema,
	inquirySessionsGenerateOneTimeLink: SessionOneTimeLinkInputSchema,
	inquiryTemplatesList: ListTemplatesInputSchema,
	inquiryTemplatesGet: GetTemplateInputSchema,
	inquiryTemplateVersionsList: ListTemplateVersionsInputSchema,
	webhooksList: ListWebhooksInputSchema,
	webhooksCreate: CreateWebhookInputSchema,
	webhooksGet: GetWebhookInputSchema,
	webhooksUpdate: UpdateWebhookInputSchema,
	webhooksEnable: SetWebhookStateInputSchema,
	webhooksDisable: SetWebhookStateInputSchema,
	webhooksArchive: SetWebhookStateInputSchema,
	webhooksRotateSecret: RotateWebhookSecretInputSchema,
	webhookEventsSearch: SearchWebhookEventsInputSchema,
};

export const PersonaEndpointOutputSchemas = {
	accountsList: ListAccountsOutputSchema,
	accountsGet: GetAccountOutputSchema,
	accountsCreate: CreateAccountOutputSchema,
	accountsUpdate: UpdateAccountOutputSchema,
	accountsRedact: RedactAccountOutputSchema,
	accountsSearch: SearchAccountsOutputSchema,
	accountsAddTag: AccountTagOutputSchema,
	accountsRemoveTag: AccountTagOutputSchema,
	inquiriesList: ListInquiriesOutputSchema,
	inquiriesGet: GetInquiryOutputSchema,
	inquiriesCreate: CreateInquiryOutputSchema,
	inquiriesUpdate: UpdateInquiryOutputSchema,
	inquiriesRedact: RedactInquiryOutputSchema,
	inquiriesApprove: ApproveInquiryOutputSchema,
	inquiriesDecline: DeclineInquiryOutputSchema,
	inquiriesMarkForReview: MarkForReviewOutputSchema,
	inquiriesGenerateOneTimeLink: GenerateOneTimeLinkOutputSchema,
	inquiriesAddTag: InquiryTagOutputSchema,
	inquiriesRemoveTag: InquiryTagOutputSchema,
	inquirySessionsCreate: CreateInquirySessionOutputSchema,
	inquirySessionsGet: GetInquirySessionOutputSchema,
	inquirySessionsExpire: ExpireSessionOutputSchema,
	inquirySessionsExpireAll: ExpireAllSessionsOutputSchema,
	inquirySessionsGenerateOneTimeLink: SessionOneTimeLinkOutputSchema,
	inquiryTemplatesList: ListTemplatesOutputSchema,
	inquiryTemplatesGet: GetTemplateOutputSchema,
	inquiryTemplateVersionsList: ListTemplateVersionsOutputSchema,
	webhooksList: ListWebhooksOutputSchema,
	webhooksCreate: CreateWebhookOutputSchema,
	webhooksGet: GetWebhookOutputSchema,
	webhooksUpdate: UpdateWebhookOutputSchema,
	webhooksEnable: WebhookStateOutputSchema,
	webhooksDisable: WebhookStateOutputSchema,
	webhooksArchive: WebhookStateOutputSchema,
	webhooksRotateSecret: RotateWebhookSecretOutputSchema,
	webhookEventsSearch: SearchWebhookEventsOutputSchema,
};

export type PersonaEndpointInputs = {
	[K in keyof typeof PersonaEndpointInputSchemas]: z.input<
		(typeof PersonaEndpointInputSchemas)[K]
	>;
};

export type PersonaEndpointOutputs = {
	[K in keyof typeof PersonaEndpointOutputSchemas]: z.infer<
		(typeof PersonaEndpointOutputSchemas)[K]
	>;
};
