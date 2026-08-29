import { z } from 'zod';

// A single field/component inside a ByteForms form definition. Components vary
// widely (input, textarea, select, checkbox, …), so we capture the common
// discriminator fields and allow providers to attach extra attributes.
const FormFieldSchema = z
	.object({
		component: z.string(),
		type: z.string().optional(),
		label: z.string().optional(),
		id: z.string().optional(),
		required: z.boolean().optional(),
		placeholder: z.string().optional(),
	})
	.loose();

export type FormField = z.infer<typeof FormFieldSchema>;

const FormOptionsSchema = z
	.object({
		one_submission_per_email: z.boolean().optional(),
		thank_you_message: z.string().optional(),
		max_submissions: z.number().int().optional(),
		stop_submissions_after: z.string().nullable().optional(),
		submit_button_text: z.string().optional(),
		form_width: z.string().optional(),
		redirect_url: z.string().optional(),
		password: z.string().optional(),
		theme: z.string().optional(),
		visibility: z.string().optional(),
		page_behaviour: z.string().optional(),
		custom_code: z.string().optional(),
		draft_submissions: z.boolean().optional(),
		remove_branding: z.boolean().optional(),
		email_notifications: z.boolean().optional(),
	})
	.loose();

export type FormOptions = z.infer<typeof FormOptionsSchema>;

const FormItemSchema = z
	.object({
		id: z.number(),
		public_id: z.string(),
		name: z.string(),
		body: z.array(FormFieldSchema),
		pages: z.nullable(z.unknown()).optional(),
		is_custom: z.boolean(),
		options: FormOptionsSchema,
		user_id: z.number(),
		created_at: z.string(),
		updated_at: z.string(),
		deleted_at: z.nullable(z.string()).optional(),
	})
	.loose();

export type FormItem = z.infer<typeof FormItemSchema>;

const FormResponseItemSchema = z
	.object({
		id: z.number(),
		form_id: z.number(),
		response: z.record(z.string(), z.unknown()),
		options: z.object({ ip: z.string().optional() }).loose().optional(),
		created_at: z.string(),
		updated_at: z.string(),
		deleted_at: z.nullable(z.string()).optional(),
	})
	.loose();

export type FormResponseItem = z.infer<typeof FormResponseItemSchema>;

const CreateFormInputSchema = z.object({
	name: z.string(),
	body: z.array(FormFieldSchema).optional(),
	options: FormOptionsSchema.optional(),
});

export type CreateFormInput = z.infer<typeof CreateFormInputSchema>;

const DeleteFormInputSchema = z.object({
	formId: z.string(),
});

export type DeleteFormInput = z.infer<typeof DeleteFormInputSchema>;

const GetAllFormsInputSchema = z.object({});

export type GetAllFormsInput = z.infer<typeof GetAllFormsInputSchema>;

const GetFormByIdInputSchema = z.object({
	formId: z.string(),
});

export type GetFormByIdInput = z.infer<typeof GetFormByIdInputSchema>;

const GetFormResponsesInputSchema = z.object({
	formId: z.string(),
	limit: z.coerce.number().int().optional(),
	order: z.enum(['asc', 'desc']).optional(),
	query: z.string().optional(),
	after: z.string().optional(),
	before: z.string().optional(),
});

export type GetFormResponsesInput = z.infer<typeof GetFormResponsesInputSchema>;

const GetAllFormsResponseSchema = z.object({
	data: z.array(FormItemSchema),
	status: z.string(),
});

const GetFormByIdResponseSchema = z.object({
	data: FormItemSchema,
	status: z.string(),
});

const GetFormResponsesResponseSchema = z.object({
	count: z.number(),
	cursor: z.object({
		after: z.nullable(z.string()),
		before: z.nullable(z.string()),
	}),
	data: z.array(FormResponseItemSchema),
	status: z.string(),
});

// The Create and Delete endpoints return a lightweight envelope. We keep them
// permissive because the provider's exact envelope shape can vary by account.
const CreateFormResponseSchema = z
	.object({
		data: FormItemSchema.optional(),
		status: z.string(),
	})
	.loose();

const DeleteFormResponseSchema = z
	.object({
		data: z.boolean().optional(),
		status: z.string(),
	})
	.loose();

export type CreateFormResponse = z.infer<typeof CreateFormResponseSchema>;
export type DeleteFormResponse = z.infer<typeof DeleteFormResponseSchema>;
export type GetAllFormsResponse = z.infer<typeof GetAllFormsResponseSchema>;
export type GetFormByIdResponse = z.infer<typeof GetFormByIdResponseSchema>;
export type GetFormResponsesResponse = z.infer<
	typeof GetFormResponsesResponseSchema
>;

export type ByteFormsEndpointInputs = {
	formsCreate: CreateFormInput;
	formsDelete: DeleteFormInput;
	formsGet: GetFormByIdInput;
	formsList: GetAllFormsInput;
	formsResponses: GetFormResponsesInput;
};

export type ByteFormsEndpointOutputs = {
	formsCreate: CreateFormResponse;
	formsDelete: DeleteFormResponse;
	formsGet: GetFormByIdResponse;
	formsList: GetAllFormsResponse;
	formsResponses: GetFormResponsesResponse;
};

export const ByteFormsEndpointInputSchemas = {
	formsCreate: CreateFormInputSchema,
	formsDelete: DeleteFormInputSchema,
	formsGet: GetFormByIdInputSchema,
	formsList: GetAllFormsInputSchema,
	formsResponses: GetFormResponsesInputSchema,
} as const;

export const ByteFormsEndpointOutputSchemas = {
	formsCreate: CreateFormResponseSchema,
	formsDelete: DeleteFormResponseSchema,
	formsGet: GetFormByIdResponseSchema,
	formsList: GetAllFormsResponseSchema,
	formsResponses: GetFormResponsesResponseSchema,
} as const;
