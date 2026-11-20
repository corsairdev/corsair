import { z } from 'zod';

// ── Shared building blocks ─────────────────────────────────────────────────

/** JSON:API resource identifier. */
const ResourceIdSchema = z.object({ id: z.string() }).loose();

/** The JSON:API data wrapper every answer carries. */
const DataWrapper = <T extends z.ZodTypeAny>(attributes: T) =>
	z
		.object({
			data: attributes,
			included: z
				// unknown: included resources vary by the include param, so the
				// array stays open.
				.array(z.unknown())
				.nullish()
				.describe('Related resources requested via include'),
		})
		.loose();

/** The JSON:API data wrapper for lists. */
const DataListWrapper = <T extends z.ZodTypeAny>(attributes: T) =>
	z
		.object({
			data: z.array(attributes),
			included: z
				// unknown: included resources vary by the include param, so the
				// array stays open.
				.array(z.unknown())
				.nullish()
				.describe('Related resources requested via include'),
			meta: z
				.object({
					totalEntries: z.number().nullish().describe('Total matching records'),
					page: z
						.object({
							number: z.number().nullish(),
							size: z.number().nullish(),
						})
						.loose()
						.nullish()
						.describe('Page info'),
				})
				.loose()
				.nullish()
				.describe('List metadata'),
		})
		.loose();

/** A Persona account (an end user being verified). */
export const AccountSchema = z
	.object({
		id: z.string().min(1).describe('Account id'),
		type: z.literal('account').nullish(),
		attributes: z
			.object({
				name: z.string().nullish().describe('Account name'),
				email: z.string().nullish().describe('Account email address'),
			})
			.loose()
			.nullish()
			.describe('Account attributes'),
	})
	.loose()
	.describe('A Persona account');
export type Account = z.infer<typeof AccountSchema>;

/** A Persona inquiry (one verification run). */
export const InquirySchema = z
	.object({
		id: z.string().min(1).describe('Inquiry id'),
		type: z.literal('inquiry').nullish(),
		attributes: z
			.object({
				status: z
					.string()
					.nullish()
					.describe('Inquiry status, e.g. completed, pending, declined'),
				inquiryTemplateId: z
					.string()
					.nullish()
					.describe('Template the inquiry runs'),
				referenceId: z
					.string()
					.nullish()
					.describe('Your reference for the end user'),
				createdAt: z.string().nullish().describe('Creation timestamp'),
			})
			.loose()
			.nullish()
			.describe('Inquiry attributes'),
	})
	.loose()
	.describe('A Persona inquiry');
export type Inquiry = z.infer<typeof InquirySchema>;

/** An inquiry session (a started but unfinished flow). */
export const InquirySessionSchema = z
	.object({
		id: z.string().min(1).describe('Session id'),
		type: z.literal('inquiry-session').nullish(),
		attributes: z
			.object({
				sessionStatus: z
					.string()
					.nullish()
					.describe('Session status, e.g. created, expired'),
			})
			.loose()
			.nullish()
			.describe('Session attributes'),
	})
	.loose()
	.describe('A Persona inquiry session');
export type InquirySession = z.infer<typeof InquirySessionSchema>;

/** An inquiry template. */
export const InquiryTemplateSchema = z
	.object({
		id: z.string().min(1).describe('Template id'),
		type: z.literal('inquiry-template').nullish(),
		attributes: z
			.object({
				name: z.string().nullish().describe('Template name'),
			})
			.loose()
			.nullish()
			.describe('Template attributes'),
	})
	.loose()
	.describe('A Persona inquiry template');
export type InquiryTemplate = z.infer<typeof InquiryTemplateSchema>;

/** A webhook configuration. */
export const WebhookConfigSchema = z
	.object({
		id: z.string().min(1).describe('Webhook id'),
		type: z.literal('webhook-configuration').nullish(),
		attributes: z
			.object({
				url: z.string().nullish().describe('Endpoint deliveries are posted to'),
				enabled: z
					.boolean()
					.nullish()
					.describe('Whether deliveries are active'),
				name: z.string().nullish().describe('Webhook name'),
				description: z.string().nullish().describe('Webhook description'),
			})
			.loose()
			.nullish()
			.describe('Webhook attributes'),
	})
	.loose()
	.describe('A Persona webhook configuration');
export type WebhookConfig = z.infer<typeof WebhookConfigSchema>;

/** The tag body the add-tag and remove-tag routes take. */
const TagBodySchema = z.object({ tag: z.string().min(1).describe('Tag name') });

// ── accounts ───────────────────────────────────────────────────────────────

export const ListAccountsInputSchema = z
	.object({
		pageAfter: z
			.string()
			.optional()
			.describe('Cursor of the next page (sent as page[after])'),
		pageSize: z
			.number()
			.int()
			.min(1)
			.optional()
			.describe('Results per page (sent as page[size])'),
	})
	.describe('Query parameters for listing accounts');
export type ListAccountsInput = z.infer<typeof ListAccountsInputSchema>;

export const ListAccountsOutputSchema =
	DataListWrapper(AccountSchema).describe('A page of accounts');
export type ListAccountsOutput = z.infer<typeof ListAccountsOutputSchema>;

export const GetAccountInputSchema = z
	.object({ accountId: z.string().min(1).describe('Account id') })
	.describe('Input for reading one account');
export type GetAccountInput = z.infer<typeof GetAccountInputSchema>;

export const GetAccountOutputSchema =
	DataWrapper(AccountSchema).describe('The account');
export type GetAccountOutput = z.infer<typeof GetAccountOutputSchema>;

export const CreateAccountInputSchema = z
	.object({
		attributes: z
			.object({
				name: z.string().optional().describe('Account name'),
				email: z.string().email().optional().describe('Account email address'),
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
			.object({
				name: z.string().optional().describe('Account name'),
				email: z.string().email().optional().describe('Account email address'),
			})
			.loose()
			.describe('Account attributes to update'),
	})
	.describe('Update an account');
export type UpdateAccountInput = z.infer<typeof UpdateAccountInputSchema>;

export const UpdateAccountOutputSchema = DataWrapper(AccountSchema).describe(
	'The account as updated',
);
export type UpdateAccountOutput = z.infer<typeof UpdateAccountOutputSchema>;

export const RedactAccountInputSchema = z
	.object({ accountId: z.string().min(1).describe('Account id') })
	.describe('Redact an account; redaction is permanent');
export type RedactAccountInput = z.infer<typeof RedactAccountInputSchema>;

export const RedactAccountOutputSchema = z
	.object({ success: z.boolean().describe('Whether the redaction succeeded') })
	.describe('The account was redacted');
export type RedactAccountOutput = z.infer<typeof RedactAccountOutputSchema>;

export const SearchAccountsInputSchema = z
	.object({
		query: z.string().min(1).describe('Search string across account fields'),
	})
	.describe('Search accounts');
export type SearchAccountsInput = z.infer<typeof SearchAccountsInputSchema>;

export const SearchAccountsOutputSchema = DataListWrapper(
	AccountSchema,
).describe('The matching accounts');
export type SearchAccountsOutput = z.infer<typeof SearchAccountsOutputSchema>;

export const AddTagInputSchema = z
	.object({
		accountId: z.string().min(1).describe('Account id'),
		...TagBodySchema.shape,
	})
	.describe('Add a tag to an account');
export type AddTagInput = z.infer<typeof AddTagInputSchema>;

export const RemoveTagInputSchema = z
	.object({
		accountId: z.string().min(1).describe('Account id'),
		...TagBodySchema.shape,
	})
	.describe('Remove a tag from an account');
export type RemoveTagInput = z.infer<typeof RemoveTagInputSchema>;

export const TagOutputSchema = z
	.object({ success: z.boolean().describe('Whether the tag change succeeded') })
	.describe('The tag change was applied');
export type TagOutput = z.infer<typeof TagOutputSchema>;

// ── inquiries ──────────────────────────────────────────────────────────────

export const ListInquiriesInputSchema = z
	.object({
		pageAfter: z
			.string()
			.optional()
			.describe('Cursor of the next page (sent as page[after])'),
		pageSize: z
			.number()
			.int()
			.min(1)
			.optional()
			.describe('Results per page (sent as page[size])'),
		status: z.string().optional().describe('Filter by inquiry status'),
	})
	.describe('Query parameters for listing inquiries');
export type ListInquiriesInput = z.infer<typeof ListInquiriesInputSchema>;

export const ListInquiriesOutputSchema = DataListWrapper(
	InquirySchema,
).describe('A page of inquiries');
export type ListInquiriesOutput = z.infer<typeof ListInquiriesOutputSchema>;

export const GetInquiryInputSchema = z
	.object({ inquiryId: z.string().uuid().describe('Inquiry id') })
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
					.describe(
						'Template the inquiry runs (itmpl_…); or template-id for tmpl_… flows',
					),
				'account-id': z
					.string()
					.optional()
					.describe('Account to associate with the inquiry'),
				'reference-id': z
					.string()
					.optional()
					.describe('Your reference for the end user'),
				'redirect-uri': z
					.string()
					.url()
					.optional()
					.describe('Redirect after hosted-flow completion'),
				note: z.string().optional().describe('Unstructured note'),
				fields: z
					// unknown: inquiry fields are template-defined, so the record
					// cannot be stricter.
					.record(z.string(), z.unknown())
					.optional()
					.describe('Field values the template expects'),
				tags: z.array(z.string()).optional().describe('Tag names to associate'),
			})
			.loose()
			.describe('Inquiry attributes'),
	})
	.describe('Create an inquiry');
export type CreateInquiryInput = z.infer<typeof CreateInquiryInputSchema>;

export const CreateInquiryOutputSchema = DataWrapper(InquirySchema).describe(
	'The inquiry as created',
);
export type CreateInquiryOutput = z.infer<typeof CreateInquiryOutputSchema>;

export const UpdateInquiryInputSchema = z
	.object({
		inquiryId: z.string().min(1).describe('Inquiry id'),
		attributes: z
			// unknown: updatable attributes are template-defined, so the record
			// cannot be stricter.
			.record(z.string(), z.unknown())
			.describe('Inquiry attributes to update'),
	})
	.describe('Update an inquiry');
export type UpdateInquiryInput = z.infer<typeof UpdateInquiryInputSchema>;

export const UpdateInquiryOutputSchema = DataWrapper(InquirySchema).describe(
	'The inquiry as updated',
);
export type UpdateInquiryOutput = z.infer<typeof UpdateInquiryOutputSchema>;

export const RedactInquiryInputSchema = z
	.object({ inquiryId: z.string().min(1).describe('Inquiry id') })
	.describe('Redact an inquiry; redaction is permanent');
export type RedactInquiryInput = z.infer<typeof RedactInquiryInputSchema>;

export const RedactInquiryOutputSchema = z
	.object({ success: z.boolean().describe('Whether the redaction succeeded') })
	.describe('The inquiry was redacted');
export type RedactInquiryOutput = z.infer<typeof RedactInquiryOutputSchema>;

/** Body of the decision routes (approve / decline). */
const DecisionBodySchema = z
	.object({
		attributes: z
			.object({
				declineReasons: z
					.array(z.string())
					.optional()
					.describe('Reasons for declining (decline only)'),
			})
			.loose()
			.optional(),
	})
	.loose();

export const ApproveInquiryInputSchema = DecisionBodySchema.extend({
	inquiryId: z.string().min(1).describe('Inquiry id'),
}).describe('Approve an inquiry');
export type ApproveInquiryInput = z.infer<typeof ApproveInquiryInputSchema>;

export const ApproveInquiryOutputSchema = DataWrapper(InquirySchema).describe(
	'The approved inquiry',
);
export type ApproveInquiryOutput = z.infer<typeof ApproveInquiryOutputSchema>;

export const DeclineInquiryInputSchema = DecisionBodySchema.extend({
	inquiryId: z.string().min(1).describe('Inquiry id'),
}).describe('Decline an inquiry');
export type DeclineInquiryInput = z.infer<typeof DeclineInquiryInputSchema>;

export const DeclineInquiryOutputSchema = DataWrapper(InquirySchema).describe(
	'The declined inquiry',
);
export type DeclineInquiryOutput = z.infer<typeof DeclineInquiryOutputSchema>;

export const MarkForReviewInputSchema = z
	.object({ inquiryId: z.string().min(1).describe('Inquiry id') })
	.describe('Mark an inquiry for manual review');
export type MarkForReviewInput = z.infer<typeof MarkForReviewInputSchema>;

export const MarkForReviewOutputSchema = DataWrapper(InquirySchema).describe(
	'The inquiry marked for review',
);
export type MarkForReviewOutput = z.infer<typeof MarkForReviewOutputSchema>;

export const GenerateOneTimeLinkInputSchema = z
	.object({ inquiryId: z.string().min(1).describe('Inquiry id') })
	.describe('Generate a one-time link for an inquiry');
export type GenerateOneTimeLinkInput = z.infer<
	typeof GenerateOneTimeLinkInputSchema
>;

export const OneTimeLinkSchema = z
	.object({
		id: z.string().nullish().describe('One-time link id'),
		reference: z.string().nullish().describe('The link URL'),
	})
	.loose()
	.describe('A one-time inquiry link');
export type OneTimeLink = z.infer<typeof OneTimeLinkSchema>;

export const GenerateOneTimeLinkOutputSchema =
	DataWrapper(OneTimeLinkSchema).describe('The one-time link');
export type GenerateOneTimeLinkOutput = z.infer<
	typeof GenerateOneTimeLinkOutputSchema
>;

export const InquiryTagInputSchema = z
	.object({
		inquiryId: z.string().min(1).describe('Inquiry id'),
		...TagBodySchema.shape,
	})
	.describe('Input for changing the tags of an inquiry');
export type InquiryTagInput = z.infer<typeof InquiryTagInputSchema>;

// ── inquirySessions ────────────────────────────────────────────────────────

export const CreateInquirySessionInputSchema = z
	.object({})
	.describe('Input for creating an inquiry session (attributes optional)');
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
	.object({})
	.describe('Input for expiring all inquiry sessions (none)');
export type ExpireAllSessionsInput = z.infer<
	typeof ExpireAllSessionsInputSchema
>;

export const ExpireAllSessionsOutputSchema = z
	.object({ success: z.boolean().describe('Whether the expiry succeeded') })
	.describe('All inquiry sessions were expired');
export type ExpireAllSessionsOutput = z.infer<
	typeof ExpireAllSessionsOutputSchema
>;

export const SessionOneTimeLinkInputSchema = z
	.object({ inquirySessionId: z.string().min(1).describe('Session id') })
	.describe('Generate a one-time link for an inquiry session');
export type SessionOneTimeLinkInput = z.infer<
	typeof SessionOneTimeLinkInputSchema
>;

export const SessionOneTimeLinkOutputSchema = DataWrapper(
	OneTimeLinkSchema,
).describe('The one-time session link');
export type SessionOneTimeLinkOutput = z.infer<
	typeof SessionOneTimeLinkOutputSchema
>;

// ── inquiryTemplates ───────────────────────────────────────────────────────

export const ListTemplatesInputSchema = z
	.object({})
	.describe('Input for listing inquiry templates (none)');
export type ListTemplatesInput = z.infer<typeof ListTemplatesInputSchema>;

export const ListTemplatesOutputSchema = DataListWrapper(
	InquiryTemplateSchema,
).describe('The inquiry templates');
export type ListTemplatesOutput = z.infer<typeof ListTemplatesOutputSchema>;

export const GetTemplateInputSchema = z
	.object({ inquiryTemplateId: z.string().min(1).describe('Template id') })
	.describe('Input for reading one inquiry template');
export type GetTemplateInput = z.infer<typeof GetTemplateInputSchema>;

export const GetTemplateOutputSchema = DataWrapper(
	InquiryTemplateSchema,
).describe('The inquiry template');
export type GetTemplateOutput = z.infer<typeof GetTemplateOutputSchema>;

export const ListTemplateVersionsInputSchema = z
	.object({})
	.describe('Input for listing inquiry template versions (none)');
export type ListTemplateVersionsInput = z.infer<
	typeof ListTemplateVersionsInputSchema
>;

export const TemplateVersionSchema = z
	.object({
		id: z.string().min(1).describe('Template version id'),
	})
	.loose()
	.describe('An inquiry template version');
export type TemplateVersion = z.infer<typeof TemplateVersionSchema>;

export const ListTemplateVersionsOutputSchema = DataListWrapper(
	TemplateVersionSchema,
).describe('The inquiry template versions');
export type ListTemplateVersionsOutput = z.infer<
	typeof ListTemplateVersionsOutputSchema
>;

// ── webhooks ───────────────────────────────────────────────────────────────

export const ListWebhooksInputSchema = z
	.object({})
	.describe('Input for listing webhook configurations (none)');
export type ListWebhooksInput = z.infer<typeof ListWebhooksInputSchema>;

export const ListWebhooksOutputSchema = DataListWrapper(
	WebhookConfigSchema,
).describe('The webhook configurations');
export type ListWebhooksOutput = z.infer<typeof ListWebhooksOutputSchema>;

export const CreateWebhookInputSchema = z
	.object({
		attributes: z
			.object({
				name: z.string().min(1).describe('Webhook name'),
				url: z.string().url().describe('Endpoint deliveries are posted to'),
				'enabled-events': z
					.array(z.string())
					.min(1)
					.describe(
						'Event names to subscribe to, e.g. inquiry.approved, inquiry.declined',
					),
				description: z.string().optional().describe('Webhook description'),
			})
			.loose()
			.describe('Webhook attributes'),
	})
	.describe('Create a webhook configuration');
export type CreateWebhookInput = z.infer<typeof CreateWebhookInputSchema>;

export const CreateWebhookOutputSchema = DataWrapper(
	WebhookConfigSchema,
).describe('The webhook as created');
export type CreateWebhookOutput = z.infer<typeof CreateWebhookOutputSchema>;

export const GetWebhookInputSchema = z
	.object({ webhookId: z.string().min(1).describe('Webhook id') })
	.describe('Input for reading one webhook configuration');
export type GetWebhookInput = z.infer<typeof GetWebhookInputSchema>;

export const GetWebhookOutputSchema = DataWrapper(WebhookConfigSchema).describe(
	'The webhook configuration',
);
export type GetWebhookOutput = z.infer<typeof GetWebhookOutputSchema>;

export const UpdateWebhookInputSchema = z
	.object({
		webhookId: z.string().min(1).describe('Webhook id'),
		attributes: z
			.object({
				name: z.string().optional().describe('Webhook name'),
				url: z
					.string()
					.url()
					.optional()
					.describe('Endpoint deliveries are posted to'),
				'enabled-events': z
					.array(z.string())
					.optional()
					.describe('Event names to subscribe to'),
				enabled: z
					.boolean()
					.optional()
					.describe('Whether deliveries are active'),
			})
			.loose()
			.describe('Webhook attributes to update'),
	})
	.describe('Update a webhook configuration');
export type UpdateWebhookInput = z.infer<typeof UpdateWebhookInputSchema>;

export const UpdateWebhookOutputSchema = DataWrapper(
	WebhookConfigSchema,
).describe('The webhook as updated');
export type UpdateWebhookOutput = z.infer<typeof UpdateWebhookOutputSchema>;

export const SetWebhookStateInputSchema = z
	.object({ webhookId: z.string().min(1).describe('Webhook id') })
	.describe('Input for enabling, disabling or archiving a webhook');
export type SetWebhookStateInput = z.infer<typeof SetWebhookStateInputSchema>;

export const WebhookStateOutputSchema = DataWrapper(
	WebhookConfigSchema,
).describe('The webhook in its new state');
export type WebhookStateOutput = z.infer<typeof WebhookStateOutputSchema>;

export const RotateWebhookSecretInputSchema = z
	.object({ webhookId: z.string().min(1).describe('Webhook id') })
	.describe('Rotate the signing secret of a webhook');
export type RotateWebhookSecretInput = z.infer<
	typeof RotateWebhookSecretInputSchema
>;

export const RotateWebhookSecretOutputSchema = DataWrapper(
	WebhookConfigSchema.extend({
		attributes: z
			.object({
				secret: z
					.string()
					.nullish()
					.describe('The new signing secret; shown once'),
			})
			.loose()
			.nullish(),
	}),
).describe('The webhook with its rotated secret');
export type RotateWebhookSecretOutput = z.infer<
	typeof RotateWebhookSecretOutputSchema
>;

export const SearchWebhookEventsInputSchema = z
	.object({
		query: z.string().optional().describe('Search across webhook events'),
	})
	.describe('Search webhook events');
export type SearchWebhookEventsInput = z.infer<
	typeof SearchWebhookEventsInputSchema
>;

export const WebhookEventSchema = z
	.object({
		id: z.string().min(1).describe('Webhook event id'),
	})
	.loose()
	.describe('A webhook event as recorded by Persona');
export type WebhookEvent = z.infer<typeof WebhookEventSchema>;

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
	accountsAddTag: TagOutputSchema,
	accountsRemoveTag: TagOutputSchema,
	inquiriesList: ListInquiriesOutputSchema,
	inquiriesGet: GetInquiryOutputSchema,
	inquiriesCreate: CreateInquiryOutputSchema,
	inquiriesUpdate: UpdateInquiryOutputSchema,
	inquiriesRedact: RedactInquiryOutputSchema,
	inquiriesApprove: ApproveInquiryOutputSchema,
	inquiriesDecline: DeclineInquiryOutputSchema,
	inquiriesMarkForReview: MarkForReviewOutputSchema,
	inquiriesGenerateOneTimeLink: GenerateOneTimeLinkOutputSchema,
	inquiriesAddTag: TagOutputSchema,
	inquiriesRemoveTag: TagOutputSchema,
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
