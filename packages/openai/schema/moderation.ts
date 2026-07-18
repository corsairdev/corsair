import { z } from 'zod';

export const ModerationCreateInputSchema = z.object({
	input: z.union([
		z.string(),
		z.array(z.string()),
		// Multi-modal input items (text/image_url parts) have a shape that varies by type; kept loose rather than modeling each variant.
		z.array(z.record(z.string(), z.unknown())),
	]),
	model: z.string().optional(),
});
export type ModerationCreateInput = z.infer<typeof ModerationCreateInputSchema>;

export const ModerationCreateResponseSchema = z.object({
	id: z.string(),
	model: z.string(),
	results: z.array(
		z.object({
			flagged: z.boolean(),
			categories: z.record(z.string(), z.boolean()),
			category_scores: z.record(z.string(), z.number()),
			category_applied_input_types: z
				.record(z.string(), z.array(z.string()))
				.optional(),
		}),
	),
});
export type ModerationCreateResponse = z.infer<
	typeof ModerationCreateResponseSchema
>;
