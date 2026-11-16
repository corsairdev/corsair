import { z } from 'zod';

// Inputs use TextCortex's own field names, which follow OpenAI's conventions on
// the chat and image routes. Outputs are `.loose()` and their optional fields
// nullish, because a choice can omit a field it did not produce.
// Field reference: https://docs.textcortex.com/api

export const ModelIdSchema = z
	.string()
	.min(1)
	.describe(
		'A model ID from `models.list`. Use the base ID and set `reasoning_effort` rather than a `-thinking` variant, which is deprecated.',
	);

// ── models ────────────────────────────────────────────────────────────────

export const ModelsListInputSchema = z.object({});

export type ModelsListInput = z.infer<typeof ModelsListInputSchema>;

export const ModelSchema = z
	.object({
		id: z.string(),
		created: z.number().nullish(),
		object: z.string().nullish(),
		owned_by: z.string().nullish(),
	})
	.loose();

export type TextCortexModel = z.infer<typeof ModelSchema>;

export const ModelsListResponseSchema = z
	.object({
		object: z.string(),
		data: z.array(ModelSchema),
	})
	.loose();

export type ModelsListResponse = z.infer<typeof ModelsListResponseSchema>;

// ── balance ───────────────────────────────────────────────────────────────

export const BalanceInputSchema = z.object({});

export type BalanceInput = z.infer<typeof BalanceInputSchema>;

export const BalanceResponseSchema = z
	.object({
		object: z.string().nullish(),
		currency: z.string().nullish(),
		remaining_credits: z.number().nullish(),
		api_credit_purchases_allowed: z.boolean().nullish(),
		billing_source: z
			.object({
				available: z.boolean().nullish(),
				// `api_credits` or `organization_payg_wallet`.
				type: z.string().nullish(),
			})
			.loose()
			.nullish(),
		wallet: z
			.object({
				currency: z.string().nullish(),
				remaining_amount: z.number().nullish(),
				seat_id: z.string().nullish(),
				wallet_id: z.string().nullish(),
			})
			.loose()
			.nullish(),
	})
	.loose();

export type BalanceResponse = z.infer<typeof BalanceResponseSchema>;

// ── capabilities ──────────────────────────────────────────────────────────

export const CapabilitiesInputSchema = z.object({});

export type CapabilitiesInput = z.infer<typeof CapabilitiesInputSchema>;

/**
 * The features enabled for the key, grouped by API family: `openai_compatible`
 * (e.g. `chat_completions.create`, `images.generations`) and `textcortex`
 * (e.g. `api_platform.image_generation`). Each group holds nested objects of
 * flags and settings, so the groups stay open records.
 */
// unknown: nested feature objects of booleans, strings and nulls whose keys
// TextCortex adds to over time.
const CapabilityGroupSchema = z.record(z.string(), z.unknown());

export const CapabilitiesResponseSchema = z
	.object({
		object: z.string().nullish(),
		api_version: z.string().nullish(),
		openai_compatible: CapabilityGroupSchema.nullish(),
		textcortex: CapabilityGroupSchema.nullish(),
	})
	.loose();

export type CapabilitiesResponse = z.infer<typeof CapabilitiesResponseSchema>;

// ── chat completions ──────────────────────────────────────────────────────

export const ChatMessageSchema = z
	.object({
		role: z
			.enum(['system', 'user', 'assistant', 'tool'])
			.describe('Who wrote the message.'),
		content: z
			.string()
			.describe('The message text. The plugin sends plain text only.'),
		name: z.string().optional().describe('An optional name for the speaker.'),
	})
	.loose();

export type ChatMessageInput = z.input<typeof ChatMessageSchema>;

export const ChatCompletionsInputSchema = z.strictObject({
	model: ModelIdSchema,
	messages: z
		.array(ChatMessageSchema)
		.min(1)
		.describe('The conversation, oldest first.'),
	max_tokens: z
		.number()
		.int()
		.min(1)
		.optional()
		.describe('Cap the tokens generated.'),
	temperature: z
		.number()
		.min(0)
		.max(2)
		.optional()
		.describe('Sampling temperature, 0 to 2.'),
	top_p: z
		.number()
		.min(0)
		.max(1)
		.optional()
		.describe('Nucleus sampling probability, 0 to 1.'),
	n: z
		.number()
		.int()
		.min(1)
		.optional()
		.describe('How many completions to generate.'),
	stop: z
		.union([z.string(), z.array(z.string())])
		.optional()
		.describe('A stop sequence, or a list of them.'),
	presence_penalty: z.number().min(-2).max(2).optional(),
	frequency_penalty: z.number().min(-2).max(2).optional(),
	seed: z.number().int().optional().describe('A seed for reproducible output.'),
	user: z
		.string()
		.optional()
		.describe('A caller-side user identifier for abuse tracking.'),
	reasoning_effort: z
		.enum(['none', 'low', 'medium', 'high'])
		.optional()
		.describe(
			'How much reasoning the model should spend, for models that grade it.',
		),
	response_format: z
		.object({ type: z.string() })
		.loose()
		.optional()
		.describe('Ask for a structured answer, e.g. `{ type: "json_object" }`.'),
});

export type ChatCompletionsInput = z.input<typeof ChatCompletionsInputSchema>;

export const ChatMessageOutputSchema = z
	.object({
		role: z.string().nullish(),
		// The spec allows a string or an array of content parts.
		// unknown: content parts are open objects (text, refusal, audio, ...).
		content: z.union([z.string(), z.array(z.unknown())]).nullish(),
	})
	.loose();

export const ChatCompletionChoiceSchema = z
	.object({
		index: z.number().nullish(),
		finish_reason: z.string().nullish(),
		message: ChatMessageOutputSchema.nullish(),
	})
	.loose();

export const ChatCompletionUsageSchema = z
	.object({
		completion_tokens: z.number().nullish(),
		prompt_tokens: z.number().nullish(),
		total_tokens: z.number().nullish(),
		prompt_tokens_details: z
			.object({ cached_tokens: z.number().nullish() })
			.loose()
			.nullish(),
	})
	.loose();

export const ChatCompletionsResponseSchema = z
	.object({
		id: z.string(),
		object: z.string().nullish(),
		created: z.number().nullish(),
		model: z.string().nullish(),
		choices: z.array(ChatCompletionChoiceSchema),
		usage: ChatCompletionUsageSchema.nullish(),
	})
	.loose();

export type ChatCompletionsResponse = z.infer<
	typeof ChatCompletionsResponseSchema
>;

// ── responses ─────────────────────────────────────────────────────────────

export const ResponsesInputSchema = z.strictObject({
	model: ModelIdSchema,
	input: z.string().min(1).describe('The prompt or conversation text.'),
	instructions: z
		.string()
		.optional()
		.describe('A system instruction that applies to the whole response.'),
	max_output_tokens: z.number().int().min(1).optional(),
	temperature: z.number().min(0).max(2).optional(),
	top_p: z.number().min(0).max(1).optional(),
	store: z
		.literal(false)
		.optional()
		.describe(
			'TextCortex requires this to be false, since it stores no conversation.',
		),
});

export type ResponsesInput = z.input<typeof ResponsesInputSchema>;

export const ResponsesResponseSchema = z
	.object({
		id: z.string(),
		object: z.string().nullish(),
		created_at: z.number().nullish(),
		model: z.string().nullish(),
		status: z.string().nullish(),
		// An output item is a message whose `content` holds `output_text` parts
		// (live, 11-16); other keys are metadata the docs leave open.
		output: z
			.array(
				z
					.object({
						type: z.string().nullish(),
						text: z.string().nullish(),
						id: z.string().nullish(),
						role: z.string().nullish(),
						status: z.string().nullish(),
						content: z
							.array(
								z
									.object({
										type: z.string().nullish(),
										text: z.string().nullish(),
									})
									.loose(),
							)
							.nullish(),
					})
					.loose(),
			)
			.nullish(),
		incomplete_details: z
			.object({ reason: z.string().nullish() })
			.loose()
			.nullish(),
		output_text: z.string().nullish(),
		usage: z
			.object({
				input_tokens: z.number().nullish(),
				output_tokens: z.number().nullish(),
				total_tokens: z.number().nullish(),
			})
			.loose()
			.nullish(),
	})
	.loose();

export type ResponsesResponse = z.infer<typeof ResponsesResponseSchema>;

// ── images ────────────────────────────────────────────────────────────────

export const ImagesCreateInputSchema = z.strictObject({
	prompt: z.string().min(1).describe('What the image should show.'),
	model: z
		.string()
		.optional()
		.describe('An image model ID. The API picks its default when omitted.'),
	n: z
		.literal(1)
		.optional()
		.describe('How many images to generate. TextCortex accepts only 1.'),
	size: z
		.string()
		.optional()
		.describe('The output size as "WIDTHxHEIGHT", e.g. "1024x1024".'),
	response_format: z
		.literal('url')
		.optional()
		.describe('TextCortex returns a URL only; base64 is not offered.'),
});

export type ImagesCreateInput = z.input<typeof ImagesCreateInputSchema>;

export const GeneratedImageSchema = z
	.object({
		url: z.string().nullish(),
		image_id: z.string().nullish(),
		model: z.string().nullish(),
		file_type: z.string().nullish(),
		width: z.number().nullish(),
		height: z.number().nullish(),
		revised_prompt: z.string().nullish(),
	})
	.loose();

export const ImagesCreateResponseSchema = z
	.object({
		created: z.number().nullish(),
		data: z.array(GeneratedImageSchema),
	})
	.loose();

export type ImagesCreateResponse = z.infer<typeof ImagesCreateResponseSchema>;

// ── web search ────────────────────────────────────────────────────────────

export const WebSearchInputSchema = z.strictObject({
	query: z.string().min(1).max(1000).describe('What to search for.'),
	limit: z
		.number()
		.int()
		.min(1)
		.max(10)
		.optional()
		.describe('How many results to return, 1 to 10; TextCortex defaults to 5.'),
	website: z
		.string()
		.min(1)
		.max(512)
		.optional()
		.describe('Only return results from this website, e.g. "example.com".'),
});

export type WebSearchInput = z.infer<typeof WebSearchInputSchema>;

export const WebSearchResultSchema = z
	.object({
		object: z.string().nullish(),
		url: z.string().nullish(),
		snippet: z.string().nullish(),
		score: z.number().nullish(),
		published_at: z.string().nullish(),
	})
	.loose();

export const WebSearchResponseSchema = z
	.object({
		object: z.string().nullish(),
		query: z.string().nullish(),
		website: z.string().nullish(),
		limit: z.number().nullish(),
		data: z.array(WebSearchResultSchema),
		usage: z
			.object({
				billing: z.string().nullish(),
				cost: z.number().nullish(),
				currency: z.string().nullish(),
			})
			.loose()
			.nullish(),
		meta: z
			.object({ filtered_result_count: z.number().nullish() })
			.loose()
			.nullish(),
	})
	.loose();

export type WebSearchResponse = z.infer<typeof WebSearchResponseSchema>;

// ── registry ──────────────────────────────────────────────────────────────

export type TextCortexEndpointInputs = {
	modelsList: ModelsListInput;
	balanceGet: BalanceInput;
	capabilitiesGet: CapabilitiesInput;
	chatCompletions: ChatCompletionsInput;
	responsesCreate: ResponsesInput;
	imagesCreate: ImagesCreateInput;
	webSearch: WebSearchInput;
};

export type TextCortexEndpointOutputs = {
	modelsList: ModelsListResponse;
	balanceGet: BalanceResponse;
	capabilitiesGet: CapabilitiesResponse;
	chatCompletions: ChatCompletionsResponse;
	responsesCreate: ResponsesResponse;
	imagesCreate: ImagesCreateResponse;
	webSearch: WebSearchResponse;
};

export const TextCortexEndpointInputSchemas = {
	modelsList: ModelsListInputSchema,
	balanceGet: BalanceInputSchema,
	capabilitiesGet: CapabilitiesInputSchema,
	chatCompletions: ChatCompletionsInputSchema,
	responsesCreate: ResponsesInputSchema,
	imagesCreate: ImagesCreateInputSchema,
	webSearch: WebSearchInputSchema,
} as const;

export const TextCortexEndpointOutputSchemas = {
	modelsList: ModelsListResponseSchema,
	balanceGet: BalanceResponseSchema,
	capabilitiesGet: CapabilitiesResponseSchema,
	chatCompletions: ChatCompletionsResponseSchema,
	responsesCreate: ResponsesResponseSchema,
	imagesCreate: ImagesCreateResponseSchema,
	webSearch: WebSearchResponseSchema,
} as const;
