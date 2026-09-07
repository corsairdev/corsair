import { z } from 'zod';

const GetAccountInputSchema = z.object({});

const ImagiorAccountUsageSchema = z.object({
	remainingCredits: z.number().int().nonnegative(),
});

const GetAccountResponseSchema = z
	.object({
		status: z.literal('success'),
		name: z.string(),
		email: z.string().email(),
		statusCode: z.number().int(),
		usage: ImagiorAccountUsageSchema,
		requestCompletionTime: z.string().min(1),
		timestamp: z.string().min(1),
	})
	.passthrough();

const ListTemplatesInputSchema = z.object({
	sort: z.enum(['createdAt', 'updatedAt']).optional(),
	order: z.enum(['asc', 'desc']).optional(),
});

const ImagiorTemplateSchema = z
	.object({
		id: z.string().min(1),
		name: z.string(),
		createdAt: z.string().min(1),
		updatedAt: z.string().min(1),
	})
	.passthrough();

const ListTemplatesResponseSchema = z.array(ImagiorTemplateSchema);

export type GetAccountInput = z.infer<typeof GetAccountInputSchema>;
export type GetAccountResponse = z.infer<typeof GetAccountResponseSchema>;
export type ListTemplatesInput = z.infer<typeof ListTemplatesInputSchema>;
export type ListTemplatesResponse = z.infer<typeof ListTemplatesResponseSchema>;

export type ImagiorEndpointInputs = {
	getAccount: GetAccountInput;
	listTemplates: ListTemplatesInput;
};

export type ImagiorEndpointOutputs = {
	getAccount: GetAccountResponse;
	listTemplates: ListTemplatesResponse;
};

export const ImagiorEndpointInputSchemas = {
	getAccount: GetAccountInputSchema,
	listTemplates: ListTemplatesInputSchema,
} as const;

export const ImagiorEndpointOutputSchemas = {
	getAccount: GetAccountResponseSchema,
	listTemplates: ListTemplatesResponseSchema,
} as const;
