import { z } from 'zod';

export const DynapicturesParamSchema = z
	.object({
		name: z.string().min(1),
		text: z.string().optional(),
		imageUrl: z.string().optional(),
		color: z.string().optional(),
		backgroundColor: z.string().optional(),
	})
	.passthrough();

export type DynapicturesParam = z.infer<typeof DynapicturesParamSchema>;

// Generate Design / Image
const GenerateDesignInputSchema = z.object({
	designId: z.string().min(1),
	params: z.array(DynapicturesParamSchema).optional(),
	format: z.enum(['png', 'jpeg', 'webp', 'pdf']).optional(),
	metadata: z.union([z.string(), z.record(z.string(), z.unknown())]).optional(),
});
export type GenerateDesignInput = z.infer<typeof GenerateDesignInputSchema>;

const GenerateDesignResponseSchema = z
	.object({
		id: z.string(),
		templateId: z.string().optional(),
		imageUrl: z.string().optional(),
		thumbnailUrl: z.string().optional(),
		width: z.number().optional(),
		height: z.number().optional(),
	})
	.passthrough();
export type GenerateDesignResponse = z.infer<
	typeof GenerateDesignResponseSchema
>;

// Get Design
const GetDesignInputSchema = z.object({
	id: z.string().min(1),
});
export type GetDesignInput = z.infer<typeof GetDesignInputSchema>;

const GetDesignResponseSchema = z
	.object({
		id: z.string(),
		templateId: z.string().optional(),
		imageUrl: z.string().optional(),
		thumbnailUrl: z.string().optional(),
		width: z.number().optional(),
		height: z.number().optional(),
	})
	.passthrough();
export type GetDesignResponse = z.infer<typeof GetDesignResponseSchema>;

// List Designs
const ListDesignsInputSchema = z.object({
	limit: z.number().int().min(1).max(100).optional(),
	offset: z.number().int().min(0).optional(),
});
export type ListDesignsInput = z.infer<typeof ListDesignsInputSchema>;

const ListDesignsResponseSchema = z.array(
	z
		.object({
			id: z.string(),
			templateId: z.string().optional(),
			imageUrl: z.string().optional(),
			thumbnailUrl: z.string().optional(),
		})
		.passthrough(),
);
export type ListDesignsResponse = z.infer<typeof ListDesignsResponseSchema>;

// Delete Design
const DeleteDesignInputSchema = z.object({
	id: z.string().min(1),
});
export type DeleteDesignInput = z.infer<typeof DeleteDesignInputSchema>;

const DeleteDesignResponseSchema = z.object({
	success: z.boolean(),
});
export type DeleteDesignResponse = z.infer<typeof DeleteDesignResponseSchema>;

// List Templates
const ListTemplatesInputSchema = z.object({
	limit: z.number().int().min(1).max(100).optional(),
	offset: z.number().int().min(0).optional(),
});
export type ListTemplatesInput = z.infer<typeof ListTemplatesInputSchema>;

const ListTemplatesResponseSchema = z.array(
	z
		.object({
			id: z.string(),
			name: z.string(),
			width: z.number().optional(),
			height: z.number().optional(),
			thumbnailUrl: z.string().optional(),
		})
		.passthrough(),
);
export type ListTemplatesResponse = z.infer<typeof ListTemplatesResponseSchema>;

export type DynapicturesEndpointInputs = {
	generateDesign: GenerateDesignInput;
	getDesign: GetDesignInput;
	listDesigns: ListDesignsInput;
	deleteDesign: DeleteDesignInput;
	listTemplates: ListTemplatesInput;
};

export type DynapicturesEndpointOutputs = {
	generateDesign: GenerateDesignResponse;
	getDesign: GetDesignResponse;
	listDesigns: ListDesignsResponse;
	deleteDesign: DeleteDesignResponse;
	listTemplates: ListTemplatesResponse;
};

export const DynapicturesEndpointInputSchemas = {
	generateDesign: GenerateDesignInputSchema,
	getDesign: GetDesignInputSchema,
	listDesigns: ListDesignsInputSchema,
	deleteDesign: DeleteDesignInputSchema,
	listTemplates: ListTemplatesInputSchema,
} as const;

export const DynapicturesEndpointOutputSchemas = {
	generateDesign: GenerateDesignResponseSchema,
	getDesign: GetDesignResponseSchema,
	listDesigns: ListDesignsResponseSchema,
	deleteDesign: DeleteDesignResponseSchema,
	listTemplates: ListTemplatesResponseSchema,
} as const;
