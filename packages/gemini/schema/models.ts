import { z } from 'zod';

export const ModelSchema = z
	.object({
		name: z.string(),
		baseModelId: z.string().optional(),
		version: z.string().optional(),
		displayName: z.string().optional(),
		description: z.string().optional(),
		inputTokenLimit: z.number().optional(),
		outputTokenLimit: z.number().optional(),
		supportedGenerationMethods: z.array(z.string()).optional(),
		temperature: z.number().optional(),
		topP: z.number().optional(),
		topK: z.number().optional(),
	})
	// Google adds new model capability fields independently of this plugin.
	.catchall(z.unknown());
export type Model = z.infer<typeof ModelSchema>;
