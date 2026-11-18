import { z } from 'zod';

// Inputs use eSignatures' own parameter names. Outputs are `.loose()` and
// their documented fields nullish, so a field eSignatures adds or omits
// cannot fail a call that has already happened. Field reference:
// https://esignatures.com/docs/api

const ContractIdSchema = z.string().min(1).describe('The contract ID.');

const TemplateIdSchema = z.string().min(1).describe('The template ID.');

export const ESIGNATURES_LOCALES = [
	'cz',
	'da',
	'de',
	'el',
	'en',
	'en-GB',
	'es',
	'fi',
	'fr',
	'hr',
	'hu',
	'id',
	'it',
	'ja',
	'nl',
	'no',
	'pl',
	'pt',
	'ro',
	'rs',
	'sk',
	'sl',
	'sv',
	'vi',
	'zh-CN',
	'zh-TW',
] as const;

const LocaleSchema = z.enum(ESIGNATURES_LOCALES);

export const ESIGNATURES_MULTI_FACTOR_AUTHENTICATIONS = [
	'sms_verification_code',
	'email_verification_code',
	'photo_id',
] as const;

export const ESIGNATURES_CONTRACT_STATUSES = [
	'draft',
	'sent',
	'signed',
	'withdrawn',
] as const;

// ── Shared pieces ─────────────────────────────────────────────────────────

const PlaceholderFieldInputSchema = z.object({
	placeholder_key: z
		.string()
		.min(1)
		.describe('The `{{placeholder_key}}` in the template.'),
	replace_with_text: z
		.string()
		.optional()
		.describe('Replaces the placeholder with plain text.'),
	replace_with_markdown: z
		.string()
		.optional()
		.describe('Replaces the placeholder with markdown.'),
	replace_with_template: z
		.string()
		.optional()
		.describe('Replaces the placeholder with sub-template markdown.'),
});

const SignerFieldsSchema = {
	name: z.string().min(1).describe('The full name of the signer.'),
	email: z
		.string()
		.optional()
		.describe(
			'The email address of the signer. Required when the sign request or multi-factor authentication uses email.',
		),
	mobile: z
		.string()
		.optional()
		.describe(
			'The mobile number of the signer. Required when the sign request or multi-factor authentication uses SMS.',
		),
	company_name: z
		.string()
		.optional()
		.describe('The company name of the signer.'),
	signing_order: z
		.string()
		.optional()
		.describe(
			'Signers are asked to sign in ascending order; the contract goes to the next signer once the previous one has signed.',
		),
	auto_sign: z
		.enum(['yes', 'no'])
		.optional()
		.describe('When yes, eSignatures signs on behalf of this signer.'),
	signature_request_delivery_methods: z
		.array(z.enum(['email', 'sms']))
		.optional()
		.describe(
			'How the sign request is delivered. An empty array sends no request message, for signing through the `sign_page_url`.',
		),
	signed_document_delivery_method: z
		.enum(['email', 'sms', ''])
		.optional()
		.describe(
			'How the signed PDF is delivered. An empty string lets eSignatures pick, which is the default.',
		),
	multi_factor_authentications: z
		.array(z.enum(ESIGNATURES_MULTI_FACTOR_AUTHENTICATIONS))
		.optional()
		.describe('Checks the signer must pass before the sign page opens.'),
	redirect_url: z
		.string()
		.optional()
		.describe('Where the browser lands after this signer signs.'),
};

const SignerInputSchema = z.object({ ...SignerFieldsSchema });

const SignerUpdateInputSchema = z.object({
	...SignerFieldsSchema,
	name: z.string().min(1).optional(),
});

// The docs' signer response rows, plus `signer_field_values` on a query.
const SignerSchema = z
	.object({
		id: z.string().nullish(),
		name: z.string().nullish(),
		email: z.string().nullish(),
		mobile: z.string().nullish(),
		company_name: z.string().nullish(),
		sign_page_url: z.string().nullish(),
		signing_order: z.string().nullish(),
		auto_sign: z.string().nullish(),
		// unknown: signer field id to the value the signer entered.
		signer_field_values: z.record(z.string(), z.unknown()).nullish(),
	})
	.loose();

export const ContractSchema = z
	.object({
		id: z.string().nullish(),
		// A string rather than the enum: an unknown status must not fail a read.
		status: z.string().nullish(),
		title: z.string().nullish(),
		metadata: z.string().nullish(),
		source: z.string().nullish(),
		test: z.string().nullish(),
		labels: z.array(z.string()).nullish(),
		contract_pdf_url: z
			.string()
			.nullish()
			.describe(
				'Expiring URL of the signed PDF; eSignatures keeps it for 3 days after each request.',
			),
		signers: z.array(SignerSchema).nullish(),
	})
	.loose();

export type ESignaturesContract = z.infer<typeof ContractSchema>;

const TemplateSchema = z
	.object({
		template_id: z.string().nullish(),
		title: z.string().nullish(),
		created_at: z.string().nullish(),
		labels: z.array(z.string()).nullish(),
		last_contract_created_at: z.string().nullish(),
		placeholder_keys: z
			.array(z.string())
			.nullish()
			.describe(
				'The `{{placeholder_key}}` names in the template, without braces.',
			),
		// The docs name the same list `placeholder_fields`; the live API
		// sends `placeholder_keys`. Both are plain key strings.
		placeholder_fields: z.array(z.string()).nullish(),
		signer_field_ids: z.array(z.string()).nullish(),
	})
	.loose();

// ── contracts.create ──────────────────────────────────────────────────────

const ContractsCreateInputSchema = z.object({
	template_id: TemplateIdSchema,
	signers: z.array(SignerInputSchema).min(1),
	title: z.string().optional(),
	locale: LocaleSchema.optional().describe(
		'Language of the sign request emails and sign page.',
	),
	metadata: z
		.string()
		.optional()
		.describe('Custom data attached to the contract, echoed by webhooks.'),
	expires_in_hours: z
		.string()
		.optional()
		.describe('Hours before the sign request expires, such as "48".'),
	custom_webhook_url: z.string().optional(),
	assigned_user_email: z.string().optional(),
	labels: z.array(z.string()).optional(),
	test: z
		.enum(['yes', 'no'])
		.optional()
		.describe(
			'When yes, the contract is a demo and no sending fees are charged.',
		),
	save_as_draft: z
		.enum(['yes', 'no'])
		.optional()
		.describe(
			'When yes, the contract is a draft until `contracts.sendDraft` sends it.',
		),
	placeholder_fields: z.array(PlaceholderFieldInputSchema).optional(),
	signer_fields: z
		.array(
			z.object({
				signer_field_id: z
					.string()
					.min(1)
					.describe('The Signer field ID set in the template editor.'),
				default_value: z
					.string()
					.optional()
					.describe(
						'Pre-filled value: 1 ticks a checkbox or radio button, dates are YYYY-mm-dd.',
					),
			}),
		)
		.optional()
		.describe('Pre-fills Signer fields the signer completes.'),
	emails: z
		.object({
			signature_request_subject: z.string().optional(),
			signature_request_text: z
				.string()
				.optional()
				.describe('Body of the sign request; __FULL_NAME__ is the signer.'),
			final_contract_subject: z.string().optional(),
			final_contract_text: z
				.string()
				.optional()
				.describe(
					'Body of the signed-contract email; __FULL_NAME__ is the signer.',
				),
			cc_email_addresses: z
				.array(z.string())
				.optional()
				.describe('Addresses copied on the signed PDF.'),
			reply_to: z.string().optional(),
		})
		.loose()
		.optional()
		.describe('Overrides for the sign request and signed-contract emails.'),
	custom_branding: z
		.object({
			company_name: z.string().optional(),
			logo_url: z.string().optional(),
		})
		.loose()
		.optional(),
});

export type ContractsCreateInput = z.infer<typeof ContractsCreateInputSchema>;

const ContractsCreateResponseSchema = z.object({
	status: z.string(),
	contract: ContractSchema,
});

export type ContractsCreateResponse = z.infer<
	typeof ContractsCreateResponseSchema
>;

// ── contracts.get ─────────────────────────────────────────────────────────

const ContractsGetInputSchema = z.object({ contract_id: ContractIdSchema });

export type ContractsGetInput = z.infer<typeof ContractsGetInputSchema>;

const ContractsGetResponseSchema = z.object({ contract: ContractSchema });

export type ContractsGetResponse = z.infer<typeof ContractsGetResponseSchema>;

// ── contracts.withdraw / sendDraft ────────────────────────────────────────

const ContractActionInputSchema = z.object({
	contract_id: ContractIdSchema.describe(
		'The contract. `contracts.withdraw` refuses signed contracts; `contracts.sendDraft` needs a draft.',
	),
});

export type ContractActionInput = z.infer<typeof ContractActionInputSchema>;

const ContractsWithdrawResponseSchema = z.object({
	// Seen live as 'withdrawn'. Optional and any string: a completed write whose
	// body omits or renames the status must not throw after the request,
	// or a retry repeats the write.
	status: z.string().optional(),
});

export type ContractsWithdrawResponse = z.infer<
	typeof ContractsWithdrawResponseSchema
>;

const ContractsSendDraftResponseSchema = z.object({
	// Seen live as 'queued'. Optional and any string: a completed write whose
	// body omits or renames the status must not throw after the request,
	// or a retry repeats the write.
	status: z.string().optional(),
});

export type ContractsSendDraftResponse = z.infer<
	typeof ContractsSendDraftResponseSchema
>;

// ── contracts.addSigner ───────────────────────────────────────────────────

const ContractsAddSignerInputSchema = z.object({
	contract_id: ContractIdSchema,
	// All fields are optional here: the signer joins a contract that already
	// carries its own delivery settings, and no sign request is sent.
	signer: SignerUpdateInputSchema.describe(
		'The signer to add. No sign request email is sent; use `contracts.resendToSigner`.',
	),
});

export type ContractsAddSignerInput = z.infer<
	typeof ContractsAddSignerInputSchema
>;

const ContractsAddSignerResponseSchema = z.object({
	// Seen live as 'success'. Optional and any string: a completed write whose
	// body omits or renames the status must not throw after the request,
	// or a retry repeats the write.
	status: z.string().optional(),
});

export type ContractsAddSignerResponse = z.infer<
	typeof ContractsAddSignerResponseSchema
>;

// ── contracts.updateSigner ────────────────────────────────────────────────

const ContractsUpdateSignerInputSchema = z.object({
	contract_id: ContractIdSchema,
	signer_id: z
		.string()
		.min(1)
		.describe("The signer's `id` from the contract's `signers`."),
	signer: SignerUpdateInputSchema,
});

export type ContractsUpdateSignerInput = z.infer<
	typeof ContractsUpdateSignerInputSchema
>;

const ContractsUpdateSignerResponseSchema = z.object({
	// Seen live as 'updated'. Optional and any string: a completed write whose
	// body omits or renames the status must not throw after the request,
	// or a retry repeats the write.
	status: z.string().optional(),
});

export type ContractsUpdateSignerResponse = z.infer<
	typeof ContractsUpdateSignerResponseSchema
>;

// ── contracts.resendToSigner / deleteSigner ───────────────────────────────

const SignerActionInputSchema = z.object({
	contract_id: ContractIdSchema,
	signer_id: z
		.string()
		.min(1)
		.describe("The signer's `id` from the contract's `signers`."),
});

export type SignerActionInput = z.infer<typeof SignerActionInputSchema>;

const SignerActionResponseSchema = z.object({
	// Seen live as 'queued'. Optional and any string: a completed write whose
	// body omits or renames the status must not throw after the request,
	// or a retry repeats the write.
	status: z.string().optional(),
});

export type SignerActionResponse = z.infer<typeof SignerActionResponseSchema>;

// ── templates.list ────────────────────────────────────────────────────────

const TemplatesListInputSchema = z.object({});

export type TemplatesListInput = z.infer<typeof TemplatesListInputSchema>;

const TemplateRowSchema = z
	.object({
		template_id: z.string().nullish(),
		title: z.string().nullish(),
	})
	.loose();

const TemplatesListResponseSchema = z.object({
	templates: z.array(TemplateRowSchema),
});

export type TemplatesListResponse = z.infer<typeof TemplatesListResponseSchema>;

// ── templates.get ─────────────────────────────────────────────────────────

const TemplatesGetInputSchema = z.object({ template_id: TemplateIdSchema });

export type TemplatesGetInput = z.infer<typeof TemplatesGetInputSchema>;

const TemplatesGetResponseSchema = z.object({ template: TemplateSchema });

export type TemplatesGetResponse = z.infer<typeof TemplatesGetResponseSchema>;

// ── templates.create ──────────────────────────────────────────────────────

const TemplatesCreateInputSchema = z.object({
	title: z.string().min(1).describe('The template title.'),
	markdown: z
		.string()
		.min(1)
		.describe(
			'The contract markdown, with `{{placeholder_key}}` fields and signer fields.',
		),
	labels: z.array(z.string()).optional(),
});

export type TemplatesCreateInput = z.infer<typeof TemplatesCreateInputSchema>;

const TemplatesCreateResponseSchema = z.object({
	template_id: z.string(),
});

export type TemplatesCreateResponse = z.infer<
	typeof TemplatesCreateResponseSchema
>;

// ── templates.delete ──────────────────────────────────────────────────────

const TemplatesDeleteInputSchema = z.object({ template_id: TemplateIdSchema });

export type TemplatesDeleteInput = z.infer<typeof TemplatesDeleteInputSchema>;

const TemplatesDeleteResponseSchema = z.object({
	// Seen live as 'deleted'. Optional and any string: a completed write whose
	// body omits or renames the status must not throw after the request,
	// or a retry repeats the write.
	status: z.string().optional(),
});

export type TemplatesDeleteResponse = z.infer<
	typeof TemplatesDeleteResponseSchema
>;

// ── Registry ──────────────────────────────────────────────────────────────

export type ESignaturesEndpointInputs = {
	contractsCreate: ContractsCreateInput;
	contractsGet: ContractsGetInput;
	contractsWithdraw: ContractActionInput;
	contractsSendDraft: ContractActionInput;
	contractsAddSigner: ContractsAddSignerInput;
	contractsUpdateSigner: ContractsUpdateSignerInput;
	contractsResendToSigner: SignerActionInput;
	contractsDeleteSigner: SignerActionInput;
	templatesList: TemplatesListInput;
	templatesGet: TemplatesGetInput;
	templatesCreate: TemplatesCreateInput;
	templatesDelete: TemplatesDeleteInput;
};

export type ESignaturesEndpointOutputs = {
	contractsCreate: ContractsCreateResponse;
	contractsGet: ContractsGetResponse;
	contractsWithdraw: ContractsWithdrawResponse;
	contractsSendDraft: ContractsSendDraftResponse;
	contractsAddSigner: ContractsAddSignerResponse;
	contractsUpdateSigner: ContractsUpdateSignerResponse;
	contractsResendToSigner: SignerActionResponse;
	contractsDeleteSigner: SignerActionResponse;
	templatesList: TemplatesListResponse;
	templatesGet: TemplatesGetResponse;
	templatesCreate: TemplatesCreateResponse;
	templatesDelete: TemplatesDeleteResponse;
};

export const ESignaturesEndpointInputSchemas = {
	contractsCreate: ContractsCreateInputSchema,
	contractsGet: ContractsGetInputSchema,
	contractsWithdraw: ContractActionInputSchema,
	contractsSendDraft: ContractActionInputSchema,
	contractsAddSigner: ContractsAddSignerInputSchema,
	contractsUpdateSigner: ContractsUpdateSignerInputSchema,
	contractsResendToSigner: SignerActionInputSchema,
	contractsDeleteSigner: SignerActionInputSchema,
	templatesList: TemplatesListInputSchema,
	templatesGet: TemplatesGetInputSchema,
	templatesCreate: TemplatesCreateInputSchema,
	templatesDelete: TemplatesDeleteInputSchema,
} as const;

export const ESignaturesEndpointOutputSchemas = {
	contractsCreate: ContractsCreateResponseSchema,
	contractsGet: ContractsGetResponseSchema,
	contractsWithdraw: ContractsWithdrawResponseSchema,
	contractsSendDraft: ContractsSendDraftResponseSchema,
	contractsAddSigner: ContractsAddSignerResponseSchema,
	contractsUpdateSigner: ContractsUpdateSignerResponseSchema,
	contractsResendToSigner: SignerActionResponseSchema,
	contractsDeleteSigner: SignerActionResponseSchema,
	templatesList: TemplatesListResponseSchema,
	templatesGet: TemplatesGetResponseSchema,
	templatesCreate: TemplatesCreateResponseSchema,
	templatesDelete: TemplatesDeleteResponseSchema,
} as const;
