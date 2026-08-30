import { z } from 'zod';

/** Schema for individual element parameter overrides in a Dynapictures design layer */
export const DynapicturesParamSchema = z
	.object({
		/** Identifier of the layer in the template design */
		name: z.string().min(1),
		/** Optional replacement text for text layers */
		text: z.string().optional(),
		/** Optional replacement image URL for image layers */
		imageUrl: z.string().optional(),
		/** Optional text or foreground color */
		color: z.string().optional(),
		/** Optional background color */
		backgroundColor: z.string().optional(),
	})
	.passthrough();

/** Type definition for dynamic element layer parameters */
export type DynapicturesParam = z.infer<typeof DynapicturesParamSchema>;

/** Zod schema for design generation request input */
const GenerateDesignInputSchema = z.object({
	/** Unique design template ID */
	designId: z.string().min(1),
	/** Array of layer parameter overrides */
	params: z.array(DynapicturesParamSchema).optional(),
	/** Target output format */
	format: z.enum(['png', 'jpeg', 'webp', 'pdf']).optional(),
	/** Custom metadata associated with the render */
	metadata: z.union([z.string(), z.record(z.string(), z.unknown())]).optional(),
});

/** Input parameters for generating a design image */
export type GenerateDesignInput = z.infer<typeof GenerateDesignInputSchema>;

/** Zod schema for design generation response output */
const GenerateDesignResponseSchema = z
	.object({
		/** Unique generated design identifier */
		id: z.string(),
		/** Template ID used for rendering */
		templateId: z.string().optional(),
		/** URL of the generated image */
		imageUrl: z.string().optional(),
		/** URL of the image thumbnail */
		thumbnailUrl: z.string().optional(),
		/** Image width in pixels */
		width: z.number().optional(),
		/** Image height in pixels */
		height: z.number().optional(),
	})
	.passthrough();

/** Response payload returned after design image generation */
export type GenerateDesignResponse = z.infer<
	typeof GenerateDesignResponseSchema
>;

/** Zod schema for retrieving a single design */
const GetDesignInputSchema = z.object({
	/** Unique design identifier */
	id: z.string().min(1),
});

/** Input parameters for retrieving design details */
export type GetDesignInput = z.infer<typeof GetDesignInputSchema>;

/** Zod schema for get design response output */
const GetDesignResponseSchema = z
	.object({
		/** Unique design identifier */
		id: z.string(),
		/** Template ID associated with the design */
		templateId: z.string().optional(),
		/** Direct image URL */
		imageUrl: z.string().optional(),
		/** Thumbnail URL */
		thumbnailUrl: z.string().optional(),
		/** Image width in pixels */
		width: z.number().optional(),
		/** Image height in pixels */
		height: z.number().optional(),
	})
	.passthrough();

/** Response payload for a get design query */
export type GetDesignResponse = z.infer<typeof GetDesignResponseSchema>;

/** Zod schema for listing generated designs input */
const ListDesignsInputSchema = z.object({
	/** Maximum number of records to return (1-100) */
	limit: z.number().int().min(1).max(100).optional(),
	/** Number of records to skip */
	offset: z.number().int().min(0).optional(),
});

/** Input parameters for listing generated designs */
export type ListDesignsInput = z.infer<typeof ListDesignsInputSchema>;

/** Zod schema for listing generated designs response */
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

/** Response payload containing array of generated designs */
export type ListDesignsResponse = z.infer<typeof ListDesignsResponseSchema>;

/** Zod schema for listing templates input */
const ListTemplatesInputSchema = z.object({
	/** Maximum number of templates to return (1-100) */
	limit: z.number().int().min(1).max(100).optional(),
	/** Number of templates to skip */
	offset: z.number().int().min(0).optional(),
});

/** Input parameters for listing available design templates */
export type ListTemplatesInput = z.infer<typeof ListTemplatesInputSchema>;

/** Zod schema for listing templates response */
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

/** Response payload containing array of templates */
export type ListTemplatesResponse = z.infer<typeof ListTemplatesResponseSchema>;

/** Map of all endpoint input parameter types */
export type DynapicturesEndpointInputs = {
	generateDesign: GenerateDesignInput;
	getDesign: GetDesignInput;
	listDesigns: ListDesignsInput;
	listTemplates: ListTemplatesInput;
};

/** Map of all endpoint output response types */
export type DynapicturesEndpointOutputs = {
	generateDesign: GenerateDesignResponse;
	getDesign: GetDesignResponse;
	listDesigns: ListDesignsResponse;
	listTemplates: ListTemplatesResponse;
};

/** Exported input validation schemas for all Dynapictures endpoints */
export const DynapicturesEndpointInputSchemas = {
	generateDesign: GenerateDesignInputSchema,
	getDesign: GetDesignInputSchema,
	listDesigns: ListDesignsInputSchema,
	listTemplates: ListTemplatesInputSchema,
} as const;

/** Exported output validation schemas for all Dynapictures endpoints */
export const DynapicturesEndpointOutputSchemas = {
	generateDesign: GenerateDesignResponseSchema,
	getDesign: GetDesignResponseSchema,
	listDesigns: ListDesignsResponseSchema,
	listTemplates: ListTemplatesResponseSchema,
} as const;
