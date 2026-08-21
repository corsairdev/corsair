import { z } from 'zod';

const messageSchema = z
	.object({
		role: z.enum(['system', 'user', 'assistant', 'tool']),
		content: z.string().or(z.array(z.any())),
		name: z.string().optional(),
		tool_call_id: z.string().optional(),
	})
	.passthrough();

export const chatSchemas = {
	chatCreateCompletion: {
		input: z
			.object({
				model: z.string().describe('The ID of the model to use'),
				messages: z
					.array(messageSchema)
					.describe('A list of messages comprising the conversation so far'),
				temperature: z.number().optional().describe('Sampling temperature'),
				max_completion_tokens: z
					.number()
					.optional()
					.describe('The maximum number of tokens to generate'),
				top_p: z.number().optional().describe('Nucleus sampling parameter'),
				stop: z
					.union([z.string(), z.array(z.string())])
					.optional()
					.describe(
						'Up to 4 sequences where the API will stop generating further tokens',
					),
				stream: z
					.literal(false)
					.optional()
					.describe(
						'Streaming is not supported by this plugin. The shared transport buffers text/event-stream as plain text, so a streamed call would return a raw SSE string rather than the completion object this operation promises.',
					),
				response_format: z
					.object({ type: z.string() })
					.passthrough()
					.optional()
					.describe('Response format object'),
				tools: z
					.array(z.any())
					.optional()
					.describe('A list of tools the model may call'),
				tool_choice: z
					.any()
					.optional()
					.describe('Controls which tool is called by the model'),
			})
			.passthrough(),
		output: z
			.object({
				id: z.string(),
				object: z.string(),
				created: z.number(),
				model: z.string(),
				choices: z.array(
					z
						.object({
							index: z.number(),
							message: messageSchema,
							finish_reason: z.string().nullable(),
						})
						.passthrough(),
				),
				usage: z.any().optional(),
			})
			.passthrough(),
	},

	chatCreateResponse: {
		input: z
			.object({
				model: z.string().describe('The ID of the model to use'),
				input: z
					.union([z.string(), z.array(z.any())])
					.describe('The input for the model response'),
				instructions: z
					.string()
					.optional()
					.describe('Optional instructions to guide the response'),
				max_output_tokens: z
					.number()
					.optional()
					.describe('Maximum number of output tokens'),
				tools: z.array(z.any()).optional().describe('A list of tools'),
			})
			.passthrough(),
		/**
		 * Shape of `POST /openai/v1/responses` (beta).
		 *
		 * Note `text` is the *format configuration* echoed back
		 * (`{ format: { type: 'text' } }`) — not the generated text. The model's
		 * reply lives in `output[]`, as a `message` item whose `content[]`
		 * carries `output_text` parts.
		 */
		output: z
			.object({
				id: z.string(),
				object: z.string(),
				model: z.string(),
				status: z.string().optional(),
				created_at: z.number().optional(),
				output: z
					.array(
						z
							.object({
								type: z.string(),
								id: z.string().optional(),
								status: z.string().optional(),
								role: z.string().optional(),
								content: z
									.array(
										z
											.object({
												type: z.string(),
												text: z.string().optional(),
											})
											.passthrough(),
									)
									.optional(),
							})
							.passthrough(),
					)
					.describe('Ordered output items; the reply is the `message` item'),
				text: z
					.object({ format: z.object({ type: z.string() }).passthrough() })
					.passthrough()
					.optional()
					.describe('Requested output format, echoed back — not the reply'),
				usage: z
					.object({
						input_tokens: z.number().optional(),
						output_tokens: z.number().optional(),
						total_tokens: z.number().optional(),
					})
					.passthrough()
					.optional(),
				error: z.unknown().nullable().optional(),
				incomplete_details: z.unknown().nullable().optional(),
			})
			.passthrough(),
	},
};

export type ChatCreateCompletionInput = z.infer<
	typeof chatSchemas.chatCreateCompletion.input
>;
export type ChatCreateCompletionResponse = z.infer<
	typeof chatSchemas.chatCreateCompletion.output
>;

export type ChatCreateResponseInput = z.infer<
	typeof chatSchemas.chatCreateResponse.input
>;
export type ChatCreateResponseOutput = z.infer<
	typeof chatSchemas.chatCreateResponse.output
>;
