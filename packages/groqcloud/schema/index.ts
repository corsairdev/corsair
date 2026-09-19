import { modelSchema } from './models';

/**
 * GroqCloud is a stateless inference API — completions and transcriptions are
 * not resources to mirror. Model metadata is the one listable resource, so it
 * is cached by model ID for fast lookup between `listModels` calls.
 */
export const GroqcloudSchema = {
	version: '1.0.0',
	entities: {
		models: modelSchema,
	},
} as const;
