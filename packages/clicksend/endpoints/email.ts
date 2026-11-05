import type { CorsairEndpoint } from 'corsair/core';
import { logEventFromContext } from 'corsair/core';
import { z } from 'zod';
import { getClickSendCredentials, makeClickSendRequest } from '../client';
import type { ClickSendContext } from '../index';

// ── Empty result ──────────────────────────────────────────────────────────────

export const EmptyResultSchema = z.union([
	z.array(z.never()),
	z.record(z.string(), z.string()),
	z.boolean(),
	z.null(),
]);
export type EmptyResult = z.infer<typeof EmptyResultSchema>;

// ── Email addresses ───────────────────────────────────────────────────────────

export const EmailAddressSchema = z.object({
	email_address_id: z.number().optional(),
	email_address: z.string().optional(),
	verified: z.union([z.boolean(), z.number()]).optional(),
	date_added: z.string().optional(),
});
export type EmailAddress = z.infer<typeof EmailAddressSchema>;

export const EmailAddressCreateInputSchema = z
	.object({
		email_address: z.string().min(1),
	})
	.strict();
export type EmailAddressCreateInput = z.infer<
	typeof EmailAddressCreateInputSchema
>;

export const EmailAddressCreateResponseSchema = EmailAddressSchema;
export type EmailAddressCreateResponse = z.infer<
	typeof EmailAddressCreateResponseSchema
>;

export const EmailAddressListInputSchema = z
	.object({
		page: z.number().int().min(1).optional(),
		limit: z.number().int().min(1).max(100).optional(),
	})
	.strict();
export type EmailAddressListInput = z.infer<typeof EmailAddressListInputSchema>;

export const EmailAddressListResponseSchema = z.object({
	total: z.number().optional(),
	per_page: z.number().optional(),
	current_page: z.number().optional(),
	last_page: z.number().optional(),
	data: z.array(EmailAddressSchema).optional(),
});
export type EmailAddressListResponse = z.infer<
	typeof EmailAddressListResponseSchema
>;

export const EmailAddressGetInputSchema = z
	.object({
		email_address_id: z.number().int().positive(),
	})
	.strict();
export type EmailAddressGetInput = z.infer<typeof EmailAddressGetInputSchema>;

export const EmailAddressGetResponseSchema = EmailAddressSchema;
export type EmailAddressGetResponse = z.infer<
	typeof EmailAddressGetResponseSchema
>;

export const EmailAddressDeleteInputSchema = z
	.object({
		email_address_id: z.number().int().positive(),
	})
	.strict();
export type EmailAddressDeleteInput = z.infer<
	typeof EmailAddressDeleteInputSchema
>;

export const EmailAddressDeleteResponseSchema = EmptyResultSchema;
export type EmailAddressDeleteResponse = z.infer<
	typeof EmailAddressDeleteResponseSchema
>;

export const EmailVerificationTokenSendInputSchema = z
	.object({
		email_address_id: z.number().int().positive(),
	})
	.strict();
export type EmailVerificationTokenSendInput = z.infer<
	typeof EmailVerificationTokenSendInputSchema
>;

export const EmailVerificationTokenSendResponseSchema = EmptyResultSchema;
export type EmailVerificationTokenSendResponse = z.infer<
	typeof EmailVerificationTokenSendResponseSchema
>;

export const EmailAddressVerifyInputSchema = z
	.object({
		email_address_id: z.number().int().positive(),
		activation_token: z.string().min(1),
	})
	.strict();
export type EmailAddressVerifyInput = z.infer<
	typeof EmailAddressVerifyInputSchema
>;

export const EmailAddressVerifyResponseSchema = EmailAddressSchema;
export type EmailAddressVerifyResponse = z.infer<
	typeof EmailAddressVerifyResponseSchema
>;

// ── Email templates (user templates) ──────────────────────────────────────────

export const EmailTemplateSchema = z.object({
	template_id: z.number().optional(),
	template_id_master: z.number().optional(),
	template_name: z.string().optional(),
	body: z.string().optional(),
});
export type EmailTemplate = z.infer<typeof EmailTemplateSchema>;

export const EmailTemplateListInputSchema = z
	.object({
		page: z.number().int().min(1).optional(),
		limit: z.number().int().min(1).max(100).optional(),
	})
	.strict();
export type EmailTemplateListInput = z.infer<
	typeof EmailTemplateListInputSchema
>;

export const EmailTemplateListResponseSchema = z.object({
	total: z.number().optional(),
	per_page: z.number().optional(),
	current_page: z.number().optional(),
	last_page: z.number().optional(),
	data: z.array(EmailTemplateSchema).optional(),
});
export type EmailTemplateListResponse = z.infer<
	typeof EmailTemplateListResponseSchema
>;

export const EmailTemplateGetInputSchema = z
	.object({
		template_id: z.number().int().positive(),
	})
	.strict();
export type EmailTemplateGetInput = z.infer<typeof EmailTemplateGetInputSchema>;

export const EmailTemplateGetResponseSchema = EmailTemplateSchema;
export type EmailTemplateGetResponse = z.infer<
	typeof EmailTemplateGetResponseSchema
>;

export const EmailTemplateCreateInputSchema = z
	.object({
		template_id_master: z.number().int().positive(),
		template_name: z.string().min(1),
	})
	.strict();
export type EmailTemplateCreateInput = z.infer<
	typeof EmailTemplateCreateInputSchema
>;

export const EmailTemplateCreateResponseSchema = EmailTemplateSchema;
export type EmailTemplateCreateResponse = z.infer<
	typeof EmailTemplateCreateResponseSchema
>;

export const EmailTemplateUpdateInputSchema = z
	.object({
		template_id: z.number().int().positive(),
		body: z.string().min(1),
		template_name: z.string().min(1).optional(),
	})
	.strict();
export type EmailTemplateUpdateInput = z.infer<
	typeof EmailTemplateUpdateInputSchema
>;

export const EmailTemplateUpdateResponseSchema = EmailTemplateSchema;
export type EmailTemplateUpdateResponse = z.infer<
	typeof EmailTemplateUpdateResponseSchema
>;

export const EmailTemplateDeleteInputSchema = z
	.object({
		template_id: z.number().int().positive(),
	})
	.strict();
export type EmailTemplateDeleteInput = z.infer<
	typeof EmailTemplateDeleteInputSchema
>;

export const EmailTemplateDeleteResponseSchema = EmptyResultSchema;
export type EmailTemplateDeleteResponse = z.infer<
	typeof EmailTemplateDeleteResponseSchema
>;

// ── Email master templates ────────────────────────────────────────────────────

export const EmailMasterTemplateThumbnailSchema = z.object({
	small: z.string().optional(),
	large: z.string().optional(),
});
export type EmailMasterTemplateThumbnail = z.infer<
	typeof EmailMasterTemplateThumbnailSchema
>;

export const EmailMasterTemplateSchema = z.object({
	template_id_master: z.number().optional(),
	template_name: z.string().optional(),
	date_added: z.string().optional(),
	body: z.string().optional(),
	category_id: z.number().optional(),
	thumbnail: EmailMasterTemplateThumbnailSchema.optional(),
});
export type EmailMasterTemplate = z.infer<typeof EmailMasterTemplateSchema>;

export const EmailMasterTemplateListInputSchema = z
	.object({
		page: z.number().int().min(1).optional(),
		limit: z.number().int().min(1).max(100).optional(),
	})
	.strict();
export type EmailMasterTemplateListInput = z.infer<
	typeof EmailMasterTemplateListInputSchema
>;

export const EmailMasterTemplateListResponseSchema = z.object({
	total: z.number().optional(),
	per_page: z.number().optional(),
	current_page: z.number().optional(),
	last_page: z.number().optional(),
	data: z.array(EmailMasterTemplateSchema).optional(),
});
export type EmailMasterTemplateListResponse = z.infer<
	typeof EmailMasterTemplateListResponseSchema
>;

export const EmailMasterTemplateGetInputSchema = z
	.object({
		template_id: z.number().int().positive(),
	})
	.strict();
export type EmailMasterTemplateGetInput = z.infer<
	typeof EmailMasterTemplateGetInputSchema
>;

export const EmailMasterTemplateGetResponseSchema = EmailMasterTemplateSchema;
export type EmailMasterTemplateGetResponse = z.infer<
	typeof EmailMasterTemplateGetResponseSchema
>;

export const EmailMasterTemplatesInCategoryListInputSchema = z
	.object({
		category_id: z.number().int().positive(),
		page: z.number().int().min(1).optional(),
		limit: z.number().int().min(1).max(100).optional(),
	})
	.strict();
export type EmailMasterTemplatesInCategoryListInput = z.infer<
	typeof EmailMasterTemplatesInCategoryListInputSchema
>;

export const EmailMasterTemplatesInCategoryListResponseSchema = z.object({
	total: z.number().optional(),
	per_page: z.number().optional(),
	current_page: z.number().optional(),
	last_page: z.number().optional(),
	data: z.array(EmailMasterTemplateSchema).optional(),
});
export type EmailMasterTemplatesInCategoryListResponse = z.infer<
	typeof EmailMasterTemplatesInCategoryListResponseSchema
>;

// ── Email master categories ───────────────────────────────────────────────────

export const EmailMasterCategorySchema = z.object({
	category_id: z.number().optional(),
	category_name: z.string().optional(),
});
export type EmailMasterCategory = z.infer<typeof EmailMasterCategorySchema>;

export const EmailMasterCategoryDetailSchema = z.object({
	category_id: z.number().optional(),
	name: z.string().optional(),
});
export type EmailMasterCategoryDetail = z.infer<
	typeof EmailMasterCategoryDetailSchema
>;

export const EmailMasterCategoryListInputSchema = z
	.object({
		page: z.number().int().min(1).optional(),
		limit: z.number().int().min(1).max(100).optional(),
	})
	.strict();
export type EmailMasterCategoryListInput = z.infer<
	typeof EmailMasterCategoryListInputSchema
>;

export const EmailMasterCategoryListResponseSchema = z.array(
	EmailMasterCategorySchema,
);
export type EmailMasterCategoryListResponse = z.infer<
	typeof EmailMasterCategoryListResponseSchema
>;

export const EmailMasterCategoryGetInputSchema = z
	.object({
		category_id: z.number().int().positive(),
	})
	.strict();
export type EmailMasterCategoryGetInput = z.infer<
	typeof EmailMasterCategoryGetInputSchema
>;

export const EmailMasterCategoryGetResponseSchema =
	EmailMasterCategoryDetailSchema;
export type EmailMasterCategoryGetResponse = z.infer<
	typeof EmailMasterCategoryGetResponseSchema
>;

// ── Email receipt rules ───────────────────────────────────────────────────────

export const EmailReceiptRuleSchema = z.object({
	receipt_rule_id: z.number().optional(),
	rule_name: z.string().optional(),
	match_type: z.number().int().optional(),
	action: z.string().optional(),
	action_address: z.string().optional(),
	enabled: z.number().int().min(0).max(1).optional(),
});
export type EmailReceiptRule = z.infer<typeof EmailReceiptRuleSchema>;

export const EmailReceiptRuleListInputSchema = z
	.object({
		q: z.string().optional(),
		page: z.number().int().min(1).optional(),
		limit: z.number().int().min(1).max(100).optional(),
	})
	.strict();
export type EmailReceiptRuleListInput = z.infer<
	typeof EmailReceiptRuleListInputSchema
>;

export const EmailReceiptRuleListResponseSchema = z.object({
	total: z.number().optional(),
	per_page: z.number().optional(),
	current_page: z.number().optional(),
	last_page: z.number().optional(),
	data: z.array(EmailReceiptRuleSchema).optional(),
});
export type EmailReceiptRuleListResponse = z.infer<
	typeof EmailReceiptRuleListResponseSchema
>;

export const EmailReceiptRuleCreateInputSchema = z
	.object({
		rule_name: z.string().min(1),
		match_type: z.number().int(),
		action: z.string().min(1),
		action_address: z.string().min(1),
		enabled: z.number().int().min(0).max(1),
	})
	.strict();
export type EmailReceiptRuleCreateInput = z.infer<
	typeof EmailReceiptRuleCreateInputSchema
>;

export const EmailReceiptRuleCreateResponseSchema = EmailReceiptRuleSchema;
export type EmailReceiptRuleCreateResponse = z.infer<
	typeof EmailReceiptRuleCreateResponseSchema
>;

export const EmailReceiptRuleGetInputSchema = z
	.object({
		receipt_rule_id: z.number().int().positive(),
	})
	.strict();
export type EmailReceiptRuleGetInput = z.infer<
	typeof EmailReceiptRuleGetInputSchema
>;

export const EmailReceiptRuleGetResponseSchema = EmailReceiptRuleSchema;
export type EmailReceiptRuleGetResponse = z.infer<
	typeof EmailReceiptRuleGetResponseSchema
>;

export const EmailReceiptRuleUpdateInputSchema = z
	.object({
		receipt_rule_id: z.number().int().positive(),
		rule_name: z.string().min(1),
		match_type: z.number().int(),
		action: z.string().min(1),
		action_address: z.string().min(1),
		enabled: z.number().int().min(0).max(1),
	})
	.strict();
export type EmailReceiptRuleUpdateInput = z.infer<
	typeof EmailReceiptRuleUpdateInputSchema
>;

export const EmailReceiptRuleUpdateResponseSchema = EmailReceiptRuleSchema;
export type EmailReceiptRuleUpdateResponse = z.infer<
	typeof EmailReceiptRuleUpdateResponseSchema
>;

export const EmailReceiptRuleDeleteInputSchema = z
	.object({
		receipt_rule_id: z.number().int().positive(),
	})
	.strict();
export type EmailReceiptRuleDeleteInput = z.infer<
	typeof EmailReceiptRuleDeleteInputSchema
>;

export const EmailReceiptRuleDeleteResponseSchema = EmptyResultSchema;
export type EmailReceiptRuleDeleteResponse = z.infer<
	typeof EmailReceiptRuleDeleteResponseSchema
>;

// ── Email campaigns ───────────────────────────────────────────────────────────

export const EmailCampaignGetInputSchema = z
	.object({
		email_campaign_id: z.number().int().positive(),
	})
	.strict();
export type EmailCampaignGetInput = z.infer<typeof EmailCampaignGetInputSchema>;

export const EmailCampaignGetResponseSchema = z
	.object({
		email_campaign_id: z.number().optional(),
		name: z.string().optional(),
		user_id: z.number().optional(),
		subaccount_id: z.number().optional(),
		subject: z.string().optional(),
		list_id: z.number().optional(),
		from_email_address_id: z.number().optional(),
		from_name: z.string().optional(),
		template_id: z.number().optional(),
		schedule: z.union([z.number(), z.string()]).optional(),
		status: z.string().optional(),
		date_added: z.string().optional(),
		custom_string: z.string().optional(),
		send_count: z.number().optional(),
	})
	.passthrough();
export type EmailCampaignGetResponse = z.infer<
	typeof EmailCampaignGetResponseSchema
>;

// ── Email address endpoints ───────────────────────────────────────────────────

export const createEmailAddress: CorsairEndpoint<
	ClickSendContext,
	EmailAddressCreateInput,
	EmailAddressCreateResponse
> = async (ctx, input) => {
	const { username, apiKey } = await getClickSendCredentials(ctx);

	const response = await makeClickSendRequest(
		'email/addresses',
		username,
		apiKey,
		{
			method: 'POST',
			body: { email_address: input.email_address },
			responseSchema: EmailAddressCreateResponseSchema,
		},
	);

	await logEventFromContext(
		ctx,
		'clicksend.emailAddresses.create',
		{ email_address: input.email_address },
		'completed',
	);

	return response;
};

export const listEmailAddresses: CorsairEndpoint<
	ClickSendContext,
	EmailAddressListInput,
	EmailAddressListResponse
> = async (ctx, input) => {
	const { username, apiKey } = await getClickSendCredentials(ctx);

	const response = await makeClickSendRequest(
		'email/addresses',
		username,
		apiKey,
		{
			method: 'GET',
			query: {
				page: input.page,
				limit: input.limit,
			},
			responseSchema: EmailAddressListResponseSchema,
		},
	);

	await logEventFromContext(
		ctx,
		'clicksend.emailAddresses.list',
		{ page: input.page, limit: input.limit },
		'completed',
	);

	return response;
};

export const getEmailAddress: CorsairEndpoint<
	ClickSendContext,
	EmailAddressGetInput,
	EmailAddressGetResponse
> = async (ctx, input) => {
	const { username, apiKey } = await getClickSendCredentials(ctx);

	const response = await makeClickSendRequest(
		`email/addresses/${input.email_address_id}`,
		username,
		apiKey,
		{
			method: 'GET',
			responseSchema: EmailAddressGetResponseSchema,
		},
	);

	await logEventFromContext(
		ctx,
		'clicksend.emailAddresses.get',
		{ email_address_id: input.email_address_id },
		'completed',
	);

	return response;
};

export const deleteEmailAddress: CorsairEndpoint<
	ClickSendContext,
	EmailAddressDeleteInput,
	EmailAddressDeleteResponse
> = async (ctx, input) => {
	const { username, apiKey } = await getClickSendCredentials(ctx);

	const response = await makeClickSendRequest(
		`email/addresses/${input.email_address_id}`,
		username,
		apiKey,
		{
			method: 'DELETE',
			responseSchema: EmailAddressDeleteResponseSchema,
		},
	);

	await logEventFromContext(
		ctx,
		'clicksend.emailAddresses.delete',
		{ email_address_id: input.email_address_id },
		'completed',
	);

	return response;
};

export const sendEmailVerificationToken: CorsairEndpoint<
	ClickSendContext,
	EmailVerificationTokenSendInput,
	EmailVerificationTokenSendResponse
> = async (ctx, input) => {
	const { username, apiKey } = await getClickSendCredentials(ctx);

	const response = await makeClickSendRequest(
		`email/address-verify/${input.email_address_id}/send`,
		username,
		apiKey,
		{
			method: 'PUT',
			responseSchema: EmailVerificationTokenSendResponseSchema,
		},
	);

	await logEventFromContext(
		ctx,
		'clicksend.emailAddresses.sendToken',
		{ email_address_id: input.email_address_id },
		'completed',
	);

	return response;
};

export const verifyEmailAddress: CorsairEndpoint<
	ClickSendContext,
	EmailAddressVerifyInput,
	EmailAddressVerifyResponse
> = async (ctx, input) => {
	const { username, apiKey } = await getClickSendCredentials(ctx);

	const response = await makeClickSendRequest(
		`email/address-verify/${input.email_address_id}/verify/${encodeURIComponent(input.activation_token)}`,
		username,
		apiKey,
		{
			method: 'PUT',
			responseSchema: EmailAddressVerifyResponseSchema,
		},
	);

	await logEventFromContext(
		ctx,
		'clicksend.emailAddresses.verify',
		{ email_address_id: input.email_address_id },
		'completed',
	);

	return response;
};

// ── Email template endpoints ──────────────────────────────────────────────────

export const listEmailTemplates: CorsairEndpoint<
	ClickSendContext,
	EmailTemplateListInput,
	EmailTemplateListResponse
> = async (ctx, input) => {
	const { username, apiKey } = await getClickSendCredentials(ctx);

	const response = await makeClickSendRequest(
		'email/templates',
		username,
		apiKey,
		{
			method: 'GET',
			query: {
				page: input.page,
				limit: input.limit,
			},
			responseSchema: EmailTemplateListResponseSchema,
		},
	);

	await logEventFromContext(
		ctx,
		'clicksend.emailTemplates.list',
		{ page: input.page, limit: input.limit },
		'completed',
	);

	return response;
};

export const getEmailTemplate: CorsairEndpoint<
	ClickSendContext,
	EmailTemplateGetInput,
	EmailTemplateGetResponse
> = async (ctx, input) => {
	const { username, apiKey } = await getClickSendCredentials(ctx);

	const response = await makeClickSendRequest(
		`email/templates/${input.template_id}`,
		username,
		apiKey,
		{
			method: 'GET',
			responseSchema: EmailTemplateGetResponseSchema,
		},
	);

	await logEventFromContext(
		ctx,
		'clicksend.emailTemplates.get',
		{ template_id: input.template_id },
		'completed',
	);

	return response;
};

export const createEmailTemplate: CorsairEndpoint<
	ClickSendContext,
	EmailTemplateCreateInput,
	EmailTemplateCreateResponse
> = async (ctx, input) => {
	const { username, apiKey } = await getClickSendCredentials(ctx);

	const response = await makeClickSendRequest(
		'email/templates',
		username,
		apiKey,
		{
			method: 'POST',
			body: {
				template_id_master: input.template_id_master,
				template_name: input.template_name,
			},
			responseSchema: EmailTemplateCreateResponseSchema,
		},
	);

	await logEventFromContext(
		ctx,
		'clicksend.emailTemplates.create',
		{
			template_id_master: input.template_id_master,
			template_name: input.template_name,
		},
		'completed',
	);

	return response;
};

export const updateEmailTemplate: CorsairEndpoint<
	ClickSendContext,
	EmailTemplateUpdateInput,
	EmailTemplateUpdateResponse
> = async (ctx, input) => {
	const { username, apiKey } = await getClickSendCredentials(ctx);

	const response = await makeClickSendRequest(
		`email/templates/${input.template_id}`,
		username,
		apiKey,
		{
			method: 'PUT',
			body: {
				body: input.body,
				template_name: input.template_name,
			},
			responseSchema: EmailTemplateUpdateResponseSchema,
		},
	);

	await logEventFromContext(
		ctx,
		'clicksend.emailTemplates.update',
		{ template_id: input.template_id },
		'completed',
	);

	return response;
};

export const deleteEmailTemplate: CorsairEndpoint<
	ClickSendContext,
	EmailTemplateDeleteInput,
	EmailTemplateDeleteResponse
> = async (ctx, input) => {
	const { username, apiKey } = await getClickSendCredentials(ctx);

	const response = await makeClickSendRequest(
		`email/templates/${input.template_id}`,
		username,
		apiKey,
		{
			method: 'DELETE',
			responseSchema: EmailTemplateDeleteResponseSchema,
		},
	);

	await logEventFromContext(
		ctx,
		'clicksend.emailTemplates.delete',
		{ template_id: input.template_id },
		'completed',
	);

	return response;
};

// ── Email master template endpoints ───────────────────────────────────────────

export const listEmailMasterTemplates: CorsairEndpoint<
	ClickSendContext,
	EmailMasterTemplateListInput,
	EmailMasterTemplateListResponse
> = async (ctx, input) => {
	const { username, apiKey } = await getClickSendCredentials(ctx);

	const response = await makeClickSendRequest(
		'email/master-templates',
		username,
		apiKey,
		{
			method: 'GET',
			query: {
				page: input.page,
				limit: input.limit,
			},
			responseSchema: EmailMasterTemplateListResponseSchema,
		},
	);

	await logEventFromContext(
		ctx,
		'clicksend.emailMasterTemplates.list',
		{ page: input.page, limit: input.limit },
		'completed',
	);

	return response;
};

export const getEmailMasterTemplate: CorsairEndpoint<
	ClickSendContext,
	EmailMasterTemplateGetInput,
	EmailMasterTemplateGetResponse
> = async (ctx, input) => {
	const { username, apiKey } = await getClickSendCredentials(ctx);

	const response = await makeClickSendRequest(
		`email/master-templates/${input.template_id}`,
		username,
		apiKey,
		{
			method: 'GET',
			responseSchema: EmailMasterTemplateGetResponseSchema,
		},
	);

	await logEventFromContext(
		ctx,
		'clicksend.emailMasterTemplates.get',
		{ template_id: input.template_id },
		'completed',
	);

	return response;
};

export const listEmailMasterTemplatesInCategory: CorsairEndpoint<
	ClickSendContext,
	EmailMasterTemplatesInCategoryListInput,
	EmailMasterTemplatesInCategoryListResponse
> = async (ctx, input) => {
	const { username, apiKey } = await getClickSendCredentials(ctx);

	const response = await makeClickSendRequest(
		`email/master-templates-categories/${input.category_id}/master-templates`,
		username,
		apiKey,
		{
			method: 'GET',
			query: {
				page: input.page,
				limit: input.limit,
			},
			responseSchema: EmailMasterTemplatesInCategoryListResponseSchema,
		},
	);

	await logEventFromContext(
		ctx,
		'clicksend.emailMasterTemplates.listInCategory',
		{
			category_id: input.category_id,
			page: input.page,
			limit: input.limit,
		},
		'completed',
	);

	return response;
};

// ── Email master category endpoints ───────────────────────────────────────────

export const listEmailMasterCategories: CorsairEndpoint<
	ClickSendContext,
	EmailMasterCategoryListInput,
	EmailMasterCategoryListResponse
> = async (ctx, input) => {
	const { username, apiKey } = await getClickSendCredentials(ctx);

	const response = await makeClickSendRequest(
		'email/master-templates-categories',
		username,
		apiKey,
		{
			method: 'GET',
			query: {
				page: input.page,
				limit: input.limit,
			},
			responseSchema: EmailMasterCategoryListResponseSchema,
		},
	);

	await logEventFromContext(
		ctx,
		'clicksend.emailMasterCategories.list',
		{ page: input.page, limit: input.limit },
		'completed',
	);

	return response;
};

export const getEmailMasterCategory: CorsairEndpoint<
	ClickSendContext,
	EmailMasterCategoryGetInput,
	EmailMasterCategoryGetResponse
> = async (ctx, input) => {
	const { username, apiKey } = await getClickSendCredentials(ctx);

	const response = await makeClickSendRequest(
		`email/master-templates-categories/${input.category_id}`,
		username,
		apiKey,
		{
			method: 'GET',
			responseSchema: EmailMasterCategoryGetResponseSchema,
		},
	);

	await logEventFromContext(
		ctx,
		'clicksend.emailMasterCategories.get',
		{ category_id: input.category_id },
		'completed',
	);

	return response;
};

// ── Email receipt rule endpoints ──────────────────────────────────────────────

export const listEmailReceiptRules: CorsairEndpoint<
	ClickSendContext,
	EmailReceiptRuleListInput,
	EmailReceiptRuleListResponse
> = async (ctx, input) => {
	const { username, apiKey } = await getClickSendCredentials(ctx);

	const response = await makeClickSendRequest(
		'automations/email/receipts',
		username,
		apiKey,
		{
			method: 'GET',
			query: {
				q: input.q,
				page: input.page,
				limit: input.limit,
			},
			responseSchema: EmailReceiptRuleListResponseSchema,
		},
	);

	await logEventFromContext(
		ctx,
		'clicksend.emailReceiptRules.list',
		{ q: input.q, page: input.page, limit: input.limit },
		'completed',
	);

	return response;
};

export const createEmailReceiptRule: CorsairEndpoint<
	ClickSendContext,
	EmailReceiptRuleCreateInput,
	EmailReceiptRuleCreateResponse
> = async (ctx, input) => {
	const { username, apiKey } = await getClickSendCredentials(ctx);

	const response = await makeClickSendRequest(
		'automations/email/receipts',
		username,
		apiKey,
		{
			method: 'POST',
			body: {
				rule_name: input.rule_name,
				match_type: input.match_type,
				action: input.action,
				action_address: input.action_address,
				enabled: input.enabled,
			},
			responseSchema: EmailReceiptRuleCreateResponseSchema,
		},
	);

	await logEventFromContext(
		ctx,
		'clicksend.emailReceiptRules.create',
		{ rule_name: input.rule_name },
		'completed',
	);

	return response;
};

export const getEmailReceiptRule: CorsairEndpoint<
	ClickSendContext,
	EmailReceiptRuleGetInput,
	EmailReceiptRuleGetResponse
> = async (ctx, input) => {
	const { username, apiKey } = await getClickSendCredentials(ctx);

	const response = await makeClickSendRequest(
		`automations/email/receipts/${input.receipt_rule_id}`,
		username,
		apiKey,
		{
			method: 'GET',
			responseSchema: EmailReceiptRuleGetResponseSchema,
		},
	);

	await logEventFromContext(
		ctx,
		'clicksend.emailReceiptRules.get',
		{ receipt_rule_id: input.receipt_rule_id },
		'completed',
	);

	return response;
};

export const updateEmailReceiptRule: CorsairEndpoint<
	ClickSendContext,
	EmailReceiptRuleUpdateInput,
	EmailReceiptRuleUpdateResponse
> = async (ctx, input) => {
	const { username, apiKey } = await getClickSendCredentials(ctx);

	const response = await makeClickSendRequest(
		`automations/email/receipts/${input.receipt_rule_id}`,
		username,
		apiKey,
		{
			method: 'PUT',
			body: {
				rule_name: input.rule_name,
				match_type: input.match_type,
				action: input.action,
				action_address: input.action_address,
				enabled: input.enabled,
			},
			responseSchema: EmailReceiptRuleUpdateResponseSchema,
		},
	);

	await logEventFromContext(
		ctx,
		'clicksend.emailReceiptRules.update',
		{ receipt_rule_id: input.receipt_rule_id },
		'completed',
	);

	return response;
};

export const deleteEmailReceiptRule: CorsairEndpoint<
	ClickSendContext,
	EmailReceiptRuleDeleteInput,
	EmailReceiptRuleDeleteResponse
> = async (ctx, input) => {
	const { username, apiKey } = await getClickSendCredentials(ctx);

	const response = await makeClickSendRequest(
		`automations/email/receipts/${input.receipt_rule_id}`,
		username,
		apiKey,
		{
			method: 'DELETE',
			responseSchema: EmailReceiptRuleDeleteResponseSchema,
		},
	);

	await logEventFromContext(
		ctx,
		'clicksend.emailReceiptRules.delete',
		{ receipt_rule_id: input.receipt_rule_id },
		'completed',
	);

	return response;
};

// ── Email campaign endpoints ──────────────────────────────────────────────────

export const getEmailCampaign: CorsairEndpoint<
	ClickSendContext,
	EmailCampaignGetInput,
	EmailCampaignGetResponse
> = async (ctx, input) => {
	const { username, apiKey } = await getClickSendCredentials(ctx);

	const response = await makeClickSendRequest(
		`email-campaigns/${input.email_campaign_id}`,
		username,
		apiKey,
		{
			method: 'GET',
			responseSchema: EmailCampaignGetResponseSchema,
		},
	);

	await logEventFromContext(
		ctx,
		'clicksend.emailCampaigns.get',
		{ email_campaign_id: input.email_campaign_id },
		'completed',
	);

	return response;
};
