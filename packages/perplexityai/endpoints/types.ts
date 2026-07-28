import { z } from 'zod';

const ChatCompletionsInputSchema = z
	.object({
		model: z.string(),
		messages: z.array(
			z.object({
				role: z.enum(['system', 'user', 'assistant']),
				content: z.string(),
			}),
		),
		max_tokens: z.number().optional(),
		temperature: z.number().optional(),
		top_p: z.number().optional(),
		top_k: z.number().optional(),
		return_citations: z.boolean().optional(),
		return_images: z.boolean().optional(),
		stream: z.boolean().optional(),
		presence_penalty: z.number().optional(),
		frequency_penalty: z.number().optional(),
	})
	.refine(
		(data) => {
			if (
				data.presence_penalty !== undefined &&
				data.frequency_penalty !== undefined
			) {
				return false;
			}
			return true;
		},
		{
			message: 'presence_penalty and frequency_penalty are mutually exclusive',
			path: ['presence_penalty'],
		},
	);

export type ChatCompletionsInput = z.infer<typeof ChatCompletionsInputSchema>;

const ChatCompletionsResponseSchema = z.object({
	id: z.string(),
	model: z.string(),
	object: z.string().optional(),
	created: z.number().optional(),
	choices: z.array(
		z.object({
			index: z.number(),
			finish_reason: z.string().nullable().optional(),
			message: z
				.object({
					role: z.string(),
					content: z.string(),
				})
				.optional(),
			delta: z
				.object({
					role: z.string().optional(),
					content: z.string().optional(),
				})
				.optional(),
		}),
	),
	usage: z
		.object({
			prompt_tokens: z.number(),
			completion_tokens: z.number(),
			total_tokens: z.number(),
		})
		.optional(),
	citations: z.array(z.string()).optional(),
	images: z.array(z.string()).optional(),
});

export type ChatCompletionsResponse = z.infer<
	typeof ChatCompletionsResponseSchema
>;

export type PerplexityAiEndpointInputs = {
	chatCompletions: ChatCompletionsInput;
};

export type PerplexityAiEndpointOutputs = {
	chatCompletions: ChatCompletionsResponse;
};

export const PerplexityAiEndpointInputSchemas = {
	chatCompletions: ChatCompletionsInputSchema,
} as const;

export const PerplexityAiEndpointOutputSchemas = {
	chatCompletions: ChatCompletionsResponseSchema,
} as const;
