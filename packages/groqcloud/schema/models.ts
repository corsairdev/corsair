import { z } from 'zod';

/**
 * A model object from `GET /openai/v1/models`.
 *
 * Fields mirror what the API returns; `.passthrough()` keeps newer fields.
 * Model metadata changes as models are added and deprecated, so consumers
 * should list rather than hard-code IDs.
 */
export const modelSchema = z
	.object({
		id: z.string(),
		object: z.string(),
		created: z.number().optional(),
		owned_by: z.string().optional(),
		active: z.boolean().optional(),
		name: z.string().optional(),
		context_window: z.number().optional(),
		context_length: z.number().optional(),
		max_completion_tokens: z.number().optional(),
		max_output_length: z.number().optional(),
		hugging_face_id: z.string().nullable().optional(),
		input_modalities: z.array(z.string()).optional(),
		output_modalities: z.array(z.string()).optional(),
		supported_features: z.array(z.string()).optional(),
		supported_sampling_parameters: z.array(z.string()).optional(),
		public_apps: z.unknown().nullable().optional(),
		pricing: z.record(z.string(), z.unknown()).nullable().optional(),
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
