import { z } from 'zod';

const FontSchema = z.object({
	family: z
		.enum(['architects_daughter', 'reenie_beanie', 'special_elite'])
		.optional(),
	size: z.number().int().optional(),
	color: z.string().optional(),
});

const InlineRecipientSchema = z.object({
	last_name: z.string(),
	first_name: z.string().optional(),
	street: z.string(),
	zip: z.string(),
	city: z.string(),
	country_code: z.string(),
	greeting_style: z.enum(['formal', 'informal']).optional(),
	custom_salutation: z.string().optional(),
	external_id: z.string().optional(),
});

const TemplateSchema = z.object({
	id: z.number(),
	motive_id: z.number().optional(),
	name: z.string().optional(),
	description: z.string().optional(),
	preview_url: z.string().optional(),
	type: z.string().optional(),
	created_at: z.string().optional(),
	source: z.string().optional(),
});

const CardResponseSchema = z.object({
	id: z.string(),
	status: z.enum(['pending', 'scheduled', 'sent', 'canceled']),
	type: z.string().optional(),
	motive_id: z.number().optional(),
	content: z.string().optional(),
	font: FontSchema.optional(),
	contacts_count: z.number().optional(),
	deliver_at: z.string().optional(),
	cancelable: z.boolean().optional(),
	created_at: z.string().optional(),
	warnings: z.array(z.string()).optional(),
});

const ListTemplatesInputSchema = z.object({
	source: z.string().optional(),
	page: z.number().int().optional(),
	per_page: z.number().int().min(1).max(200).optional(),
});
export type ListTemplatesInput = z.infer<typeof ListTemplatesInputSchema>;
const ListTemplatesResponseSchema = z.array(TemplateSchema);
export type ListTemplatesResponse = z.infer<typeof ListTemplatesResponseSchema>;

const CreateCardInputSchema = z.object({
	motive_id: z.number(),
	content: z.string(),
	font: FontSchema.optional(),
	deliver_at: z.string().optional(),
	recipient_ids: z.array(z.number()).optional(),
	group_ids: z.array(z.number()).optional(),
	recipients: z.array(InlineRecipientSchema).optional(),
	content_ps: z.string().max(40).optional(),
	deduplicate_recipients: z.boolean().optional(),
});
export type CreateCardInput = z.infer<typeof CreateCardInputSchema>;
const CreateCardResponseSchema = CardResponseSchema;
export type CreateCardResponse = z.infer<typeof CreateCardResponseSchema>;

const CreateCardFromTemplateInputSchema = z.object({
	template_id: z.number(),
	deliver_at: z.string().optional(),
	recipient_ids: z.array(z.number()).optional(),
	group_ids: z.array(z.number()).optional(),
	recipients: z.array(InlineRecipientSchema).optional(),
	deduplicate_recipients: z.boolean().optional(),
});
export type CreateCardFromTemplateInput = z.infer<
	typeof CreateCardFromTemplateInputSchema
>;
const CreateCardFromTemplateResponseSchema = CardResponseSchema;
export type CreateCardFromTemplateResponse = z.infer<
	typeof CreateCardFromTemplateResponseSchema
>;

const PreviewFitInputSchema = z.object({
	content: z.string(),
	font: FontSchema.optional(),
	sample_greeting: z.string().optional(),
});
export type PreviewFitInput = z.infer<typeof PreviewFitInputSchema>;
const PreviewFitResponseSchema = z.object({
	fits: z.boolean(),
	lines_used: z.number(),
	max_lines: z.number(),
	overflow_line: z.number().optional(),
	suggested_font_size: z.number().optional(),
});
export type PreviewFitResponse = z.infer<typeof PreviewFitResponseSchema>;

export type EchtpostEndpointInputs = {
	listTemplates: ListTemplatesInput;
	createCard: CreateCardInput;
	createCardFromTemplate: CreateCardFromTemplateInput;
	previewFit: PreviewFitInput;
};

export type EchtpostEndpointOutputs = {
	listTemplates: ListTemplatesResponse;
	createCard: CreateCardResponse;
	createCardFromTemplate: CreateCardFromTemplateResponse;
	previewFit: PreviewFitResponse;
};

export const EchtpostEndpointInputSchemas = {
	listTemplates: ListTemplatesInputSchema,
	createCard: CreateCardInputSchema,
	createCardFromTemplate: CreateCardFromTemplateInputSchema,
	previewFit: PreviewFitInputSchema,
} as const;

export const EchtpostEndpointOutputSchemas = {
	listTemplates: ListTemplatesResponseSchema,
	createCard: CreateCardResponseSchema,
	createCardFromTemplate: CreateCardFromTemplateResponseSchema,
	previewFit: PreviewFitResponseSchema,
} as const;
