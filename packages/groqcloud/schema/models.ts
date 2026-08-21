import { z } from 'zod';

const modelSchema = z
	.object({
		id: z.string(),
		object: z.string(),
		created: z.number().optional(),
		owned_by: z.string().optional(),
	})
	.passthrough();

export const modelsSchemas = {
	modelsListModels: {
		input: z.object({}),
		output: z
			.object({
				object: z.string(),
				data: z.array(modelSchema),
			})
			.passthrough(),
	},

	modelsRetrieveModel: {
		input: z.object({
			model: z.string().describe('The ID of the model to use for this request'),
		}),
		output: modelSchema,
	},
};

export type ModelsListModelsInput = z.infer<
	typeof modelsSchemas.modelsListModels.input
>;
export type ModelsListModelsResponse = z.infer<
	typeof modelsSchemas.modelsListModels.output
>;

export type ModelsRetrieveModelInput = z.infer<
	typeof modelsSchemas.modelsRetrieveModel.input
>;
export type ModelsRetrieveModelResponse = z.infer<
	typeof modelsSchemas.modelsRetrieveModel.output
>;
