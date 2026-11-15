// Fixtures built from TextCortex's published schemas
// (https://docs.textcortex.com/api/schemas). The chat route follows the OpenAI
// shape; its own routes answer `{ detail }` or a service error.

export const modelsResponse = {
	object: 'list',
	data: [
		{
			id: 'gpt-6-luna',
			object: 'model',
			created: 1700000000,
			owned_by: 'textcortex',
		},
	],
};

export const balanceResponse = {
	object: 'balance',
	currency: 'credits',
	remaining_credits: 12345,
	api_credit_purchases_allowed: true,
	billing_source: { available: true, type: 'api_credits' },
	wallet: null,
};

export const capabilitiesResponse = {
	capabilities: { chat: true, images: true, web_search: false },
};

export const chatResponse = {
	id: 'chatcmpl-1',
	object: 'chat.completion',
	created: 1700000000,
	model: 'gpt-6-luna',
	choices: [
		{
			index: 0,
			finish_reason: 'stop',
			message: { role: 'assistant', content: 'Hello from TextCortex' },
		},
	],
	usage: {
		prompt_tokens: 12,
		completion_tokens: 8,
		total_tokens: 20,
		prompt_tokens_details: { cached_tokens: 0 },
	},
};

export const responsesResponse = {
	id: 'resp-1',
	object: 'response',
	created_at: 1700000000,
	model: 'gpt-6-luna',
	status: 'completed',
	output: [{ type: 'message', role: 'assistant', text: 'Hello' }],
	output_text: 'Hello',
	usage: { input_tokens: 10, output_tokens: 5, total_tokens: 15 },
};

export const imagesResponse = {
	created: 1700000000,
	data: [
		{
			url: 'https://cdn.textcortex.com/img/1.png',
			revised_prompt: 'A red bicycle on a white background',
		},
	],
};

export const webSearchResponse = {
	results: [
		{
			title: 'Example',
			url: 'https://example.com',
			snippet: 'An example result.',
		},
	],
};

// A missing key: TextCortex's own route answers a service error shape.
export const unauthorizedResponse = {
	message: 'Missing Authorization header',
	status: 'fail',
};

// The chat route answers the OpenAI error envelope.
export const openAiErrorResponse = {
	error: {
		message: 'Invalid request body',
		type: 'invalid_request_error',
		param: null,
		code: null,
	},
};

// A validation failure puts an array in detail.
export const validationErrorResponse = {
	detail: [{ loc: ['body', 'model'], msg: 'Field required', type: 'missing' }],
};

// Out of credits.
export const insufficientCreditsResponse = {
	message: 'Insufficient credits',
	status: 'fail',
};
