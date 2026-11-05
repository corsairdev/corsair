import { z } from 'zod';

/** @see https://jigsawstack.com/docs/api-reference/ai/summary */
export const JigsawstackUsage = z
	.object({
		input_tokens: z.number().optional(),
		output_tokens: z.number().optional(),
		inference_time_tokens: z.number().optional(),
		total_tokens: z.number().optional(),
	})
	.loose();

/**
 * Prompt Engine template.
 * @see https://jigsawstack.com/docs/api-reference/prompt-engine/create
 */
export const JigsawstackPrompt = z.object({
	id: z.string(),
	prompt: z.string().optional(),
	name: z.string().optional(),
	return_prompt: z.unknown().optional(),
	inputs: z
		.array(
			z
				.object({
					key: z.string(),
					optional: z.boolean().optional(),
					initial_value: z.string().optional(),
				})
				.loose(),
		)
		.optional(),
	created_at: z.string().optional(),
	updatedAt: z.coerce.date().nullable().optional(),
});

/**
 * Cached summary row (entity id = `log_id` when present).
 * @see https://jigsawstack.com/docs/api-reference/ai/summary
 */
export const JigsawstackSummary = z.object({
	id: z.string(),
	summary: z.union([z.string(), z.array(z.string())]).optional(),
	usage: JigsawstackUsage.optional(),
	fetchedAt: z.coerce.date().nullable().optional(),
});

/**
 * Speech-to-text job or result (entity id = webhook `id` or `log_id`).
 * @see https://jigsawstack.com/docs/api-reference/ai/speech-to-text
 */
export const JigsawstackTranscription = z.object({
	id: z.string(),
	status: z.string().optional(),
	text: z.string().optional(),
	chunks: z.array(z.unknown()).optional(),
	fetchedAt: z.coerce.date().nullable().optional(),
});

export type JigsawstackUsage = z.infer<typeof JigsawstackUsage>;
export type JigsawstackPrompt = z.infer<typeof JigsawstackPrompt>;
export type JigsawstackSummary = z.infer<typeof JigsawstackSummary>;
export type JigsawstackTranscription = z.infer<typeof JigsawstackTranscription>;
