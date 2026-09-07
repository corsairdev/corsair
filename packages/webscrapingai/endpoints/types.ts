import { z } from 'zod';

const NonEmptyString = z.string().trim().min(1);
const HttpUrl = z
	.string()
	.url()
	.refine((value) => ['http:', 'https:'].includes(new URL(value).protocol));
const CommonPageOptions = {
	url: HttpUrl,
	js: z.boolean().optional(),
	js_timeout: z.number().int().min(0).max(30000).optional(),
	timeout: z.number().int().min(1000).max(30000).optional(),
	wait_for: NonEmptyString.optional(),
	proxy: z.enum(['datacenter', 'residential']).optional(),
	country: z.string().length(2).optional(),
	device: z.enum(['desktop', 'mobile', 'tablet']).optional(),
	headers: z.record(z.string(), z.string()).optional(),
	js_script: NonEmptyString.optional(),
	custom_proxy: NonEmptyString.optional(),
	error_on_404: z.boolean().optional(),
	error_on_redirect: z.boolean().optional(),
};

export const AskQuestionInputSchema = z.object({
	...CommonPageOptions,
	question: NonEmptyString,
});
export const ExtractFieldsInputSchema = z.object({
	...CommonPageOptions,
	fields: z
		.record(z.string(), NonEmptyString)
		.refine(
			(fields) => Object.keys(fields).length > 0,
			'At least one field is required',
		),
});
export const GetHtmlInputSchema = z.object(CommonPageOptions);
export const GetSelectedHtmlInputSchema = z.object({
	...CommonPageOptions,
	selector: NonEmptyString,
});
export const GetSelectedMultipleInputSchema = z.object({
	...CommonPageOptions,
	selectors: z.array(NonEmptyString).min(1),
});
export const GetTextInputSchema = z.object({
	...CommonPageOptions,
	text_format: z.enum(['plain', 'json', 'xml']).optional(),
	return_links: z.boolean().optional(),
});
export const GetAccountInfoInputSchema = z.object({}).strict();

export const QuestionResponseSchema = z.string();
export const ExtractFieldsResponseSchema = z.record(z.string(), z.unknown());
export const HtmlResponseSchema = z.string();
export const SelectedHtmlResponseSchema = z.string();
export const SelectedMultipleResponseSchema = z.union([
	z.string(),
	z.array(z.string()),
	z.record(z.string(), z.string()),
]);
export const TextResponseSchema = z.union([
	z.string(),
	z
		.object({
			title: z.string().optional(),
			description: z.string().optional(),
			content: z.string(),
		})
		.loose(),
]);
export const AccountInfoResponseSchema = z
	.object({
		email: z.string().email(),
		remaining_api_calls: z.number().int().min(0).optional(),
		remaining_monthly_credits: z.number().int().min(0).optional(),
		remaining_payg_credits: z.number().int().min(0).optional(),
		remaining_total_credits: z.number().int().min(0).optional(),
		resets_at: z.number().int().optional(),
	})
	.loose();

export type WebScrapingAIEndpointInputs = {
	aiAskQuestion: z.infer<typeof AskQuestionInputSchema>;
	aiExtractFields: z.infer<typeof ExtractFieldsInputSchema>;
	scrapingGetHtml: z.infer<typeof GetHtmlInputSchema>;
	scrapingGetSelectedHtml: z.infer<typeof GetSelectedHtmlInputSchema>;
	scrapingGetSelectedMultiple: z.infer<typeof GetSelectedMultipleInputSchema>;
	scrapingGetText: z.infer<typeof GetTextInputSchema>;
	accountGetInfo: z.infer<typeof GetAccountInfoInputSchema>;
};
export type WebScrapingAIEndpointOutputs = {
	aiAskQuestion: z.infer<typeof QuestionResponseSchema>;
	aiExtractFields: z.infer<typeof ExtractFieldsResponseSchema>;
	scrapingGetHtml: z.infer<typeof HtmlResponseSchema>;
	scrapingGetSelectedHtml: z.infer<typeof SelectedHtmlResponseSchema>;
	scrapingGetSelectedMultiple: z.infer<typeof SelectedMultipleResponseSchema>;
	scrapingGetText: z.infer<typeof TextResponseSchema>;
	accountGetInfo: z.infer<typeof AccountInfoResponseSchema>;
};

export const WebScrapingAIEndpointInputSchemas = {
	aiAskQuestion: AskQuestionInputSchema,
	aiExtractFields: ExtractFieldsInputSchema,
	scrapingGetHtml: GetHtmlInputSchema,
	scrapingGetSelectedHtml: GetSelectedHtmlInputSchema,
	scrapingGetSelectedMultiple: GetSelectedMultipleInputSchema,
	scrapingGetText: GetTextInputSchema,
	accountGetInfo: GetAccountInfoInputSchema,
} as const;
export const WebScrapingAIEndpointOutputSchemas = {
	aiAskQuestion: QuestionResponseSchema,
	aiExtractFields: ExtractFieldsResponseSchema,
	scrapingGetHtml: HtmlResponseSchema,
	scrapingGetSelectedHtml: SelectedHtmlResponseSchema,
	scrapingGetSelectedMultiple: SelectedMultipleResponseSchema,
	scrapingGetText: TextResponseSchema,
	accountGetInfo: AccountInfoResponseSchema,
} as const;
