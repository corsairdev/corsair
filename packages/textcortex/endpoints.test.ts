import { logEventFromContext } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { textCortexErrorDetails } from './client';
import { Account, Ai } from './endpoints';
import {
	balanceResponse,
	capabilitiesResponse,
	chatResponse,
	imagesResponse,
	insufficientCreditsResponse,
	modelsResponse,
	openAiErrorResponse,
	responsesResponse,
	unauthorizedResponse,
	validationErrorResponse,
	webSearchResponse,
} from './test-fixtures';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn().mockResolvedValue(null),
}));

const mockLog = jest.mocked(logEventFromContext);
const API_KEY = 'tc-test-key';

// The fake context only carries what the endpoints read (ctx.key). Typing the
// endpoint generically keeps each call's own output type.
function invoke<E extends (ctx: never, input: never) => Promise<unknown>>(
	endpoint: E,
	// unknown: negative cases pass values no schema accepts.
	input: unknown,
): ReturnType<E> {
	return endpoint({ key: API_KEY } as never, input as never) as ReturnType<E>;
}

let fetchMock: jest.SpyInstance;

// unknown: response bodies are arbitrary JSON.
function respond(body: unknown, status = 200) {
	fetchMock.mockResolvedValueOnce(
		new Response(JSON.stringify(body), {
			status,
			headers: { 'Content-Type': 'application/json' },
		}),
	);
}

function lastRequest() {
	const [url, init] = fetchMock.mock.calls.at(-1) as [string, RequestInit];
	const parsed = new URL(url);
	return {
		origin: parsed.origin,
		path: parsed.pathname,
		query: Object.fromEntries(parsed.searchParams),
		method: init.method,
		headers: new Headers(init.headers),
		// unknown: the request body is whatever the endpoint serialized.
		body: init.body ? (JSON.parse(String(init.body)) as unknown) : undefined,
	};
}

function expectAuthenticated() {
	const sent = lastRequest();
	expect(sent.origin).toBe('https://api.textcortex.com');
	expect(sent.headers.get('authorization')).toBe(`Bearer ${API_KEY}`);
}

/**
 * Resolves to the rejection reason, narrowed to the plugin's own error type.
 * A promise can reject with any value, so this is the one place the reason is
 * treated as untyped before it is narrowed.
 */
async function rejection(promise: Promise<unknown>): Promise<ApiError> {
	const caught = await promise.then(
		() => undefined,
		// unknown: a rejection reason has no static type.
		(caught: unknown) => caught,
	);
	// Core's ApiError goes through as an ApiError (plugin rules R8).
	expect(caught).toBeInstanceOf(ApiError);
	return caught as ApiError;
}

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
	mockLog.mockClear();
});

afterEach(() => {
	fetchMock.mockRestore();
});

describe('models, balance and capabilities', () => {
	it('lists models', async () => {
		respond(modelsResponse);

		const result = await invoke(Account.modelsList, {});

		expectAuthenticated();
		expect(lastRequest()).toMatchObject({
			path: '/v1/models',
			method: 'GET',
		});
		expect(result.data[0]?.id).toBe('gpt-6-luna');
	});

	it('reads the balance and keeps the credit count', async () => {
		respond(balanceResponse);

		const result = await invoke(Account.balanceGet, {});

		expect(lastRequest().path).toBe('/v1/balance');
		expect(result.remaining_credits).toBe(12345);
		expect(result.billing_source?.type).toBe('api_credits');
	});

	it('reads the key capabilities', async () => {
		respond(capabilitiesResponse);

		const result = await invoke(Account.capabilitiesGet, {});

		expect(lastRequest().path).toBe('/v1/capabilities');
		expect(result.openai_compatible?.balance).toEqual({ retrieve: true });
	});
});

describe('chat.completions', () => {
	it('POSTs a conversation and reads the first choice', async () => {
		respond(chatResponse);

		const result = await invoke(Ai.chatCompletions, {
			model: 'gpt-6-luna',
			messages: [{ role: 'user', content: 'Hello' }],
			temperature: 0.7,
		});

		expect(lastRequest()).toMatchObject({
			path: '/v1/chat/completions',
			method: 'POST',
		});
		expect(lastRequest().body).toMatchObject({
			model: 'gpt-6-luna',
			messages: [{ role: 'user', content: 'Hello' }],
			temperature: 0.7,
		});
		expect(result.choices[0]?.message?.content).toBe('Hello from TextCortex');
		expect(result.usage?.total_tokens).toBe(20);
	});

	it('rejects a conversation with no messages', async () => {
		await expect(
			invoke(Ai.chatCompletions, { model: 'gpt-6-luna', messages: [] }),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('rejects an unknown role', async () => {
		await expect(
			invoke(Ai.chatCompletions, {
				model: 'gpt-6-luna',
				messages: [{ role: 'critic', content: 'Hi' }],
			}),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('rejects a temperature outside the documented 0 to 2 range', async () => {
		await expect(
			invoke(Ai.chatCompletions, {
				model: 'gpt-6-luna',
				messages: [{ role: 'user', content: 'Hi' }],
				temperature: 3,
			}),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});
});

describe('responses.create', () => {
	it('POSTs a response and pins store to false', async () => {
		respond(responsesResponse);

		const result = await invoke(Ai.responsesCreate, {
			model: 'gpt-6-luna',
			input: 'Say hello',
		});

		expect(lastRequest()).toMatchObject({
			path: '/v1/responses',
			method: 'POST',
		});
		// TextCortex stores no conversation, so store is always false.
		expect(lastRequest().body).toMatchObject({ store: false });
		expect(result.output_text).toBe('Hello');
	});

	it('rejects store: true, which the route does not support', async () => {
		await expect(
			invoke(Ai.responsesCreate, {
				model: 'gpt-6-luna',
				input: 'Hi',
				store: true,
			}),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});
});

describe('images.create and web.search', () => {
	it('generates an image and reads its URL', async () => {
		respond(imagesResponse);

		const result = await invoke(Ai.imagesCreate, {
			prompt: 'A red bicycle',
			size: '1024x1024',
		});

		expect(lastRequest()).toMatchObject({
			path: '/v1/images/generations',
			method: 'POST',
		});
		expect(lastRequest().body).toMatchObject({
			prompt: 'A red bicycle',
			size: '1024x1024',
		});
		expect(result.data[0]?.url).toBe('https://cdn.textcortex.com/img/1.png');
	});

	it('rejects an unknown image response format', async () => {
		await expect(
			invoke(Ai.imagesCreate, { prompt: 'x', response_format: 'bytes' }),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('searches the web and returns its sources', async () => {
		respond(webSearchResponse);

		const result = await invoke(Ai.webSearch, {
			query: 'textcortex api',
			limit: 5,
		});

		expect(lastRequest()).toMatchObject({
			path: '/v1/web/search',
			method: 'POST',
			body: { query: 'textcortex api', limit: 5 },
		});
		expect(result.data[0]?.url).toBe('https://example.com');
		expect(result.usage?.cost).toBe(0.01);
	});

	it('rejects a search limit over 10 and the old max_results name', async () => {
		// The API caps limit at 10 and refuses unknown fields with a 422.
		await expect(
			invoke(Ai.webSearch, { query: 'x', limit: 11 }),
		).rejects.toThrow();
		await expect(
			invoke(Ai.webSearch, { query: 'x', max_results: 5 }),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('rejects base64 images and more than one image, which TextCortex refuses', async () => {
		await expect(
			invoke(Ai.imagesCreate, { prompt: 'x', response_format: 'b64_json' }),
		).rejects.toThrow();
		await expect(
			invoke(Ai.imagesCreate, { prompt: 'x', n: 2 }),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('rejects a field the plugin does not model instead of dropping it', async () => {
		await expect(
			invoke(Ai.chatCompletions, {
				model: 'gpt-6-luna',
				messages: [{ role: 'user', content: 'Hi' }],
				tools: [{ type: 'function' }],
			}),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('rejects an empty search query', async () => {
		await expect(invoke(Ai.webSearch, { query: '' })).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});
});

describe('error handling', () => {
	it('reads the service error shape for a missing key', async () => {
		respond(unauthorizedResponse, 401);

		const error = await rejection(invoke(Account.modelsList, {}));

		expect(error.status).toBe(401);
		expect(textCortexErrorDetails(error)?.message).toBe(
			'Missing Authorization header',
		);
	});

	it('reads the OpenAI error envelope on the chat route', async () => {
		respond(openAiErrorResponse, 400);

		const error = await rejection(
			invoke(Ai.chatCompletions, {
				model: 'gpt-6-luna',
				messages: [{ role: 'user', content: 'Hi' }],
			}),
		);

		expect(error.status).toBe(400);
		expect(textCortexErrorDetails(error)?.code).toBe('invalid_request_error');
		expect(textCortexErrorDetails(error)?.message).toContain(
			'Invalid request body',
		);
	});

	it('reads a validation detail array', async () => {
		respond(validationErrorResponse, 422);

		const error = await rejection(
			invoke(Ai.responsesCreate, { model: 'x', input: 'y' }),
		);

		const details = textCortexErrorDetails(error)?.details;
		expect(details).toHaveLength(1);
		expect(details?.[0]?.location).toBe('body.model');
	});

	it('flags an out-of-credits answer', async () => {
		respond(insufficientCreditsResponse, 402);

		const error = await rejection(invoke(Account.modelsList, {}));

		expect(error.status).toBe(402);
	});

	it('never leaks the key through the error', async () => {
		respond(unauthorizedResponse, 401);

		const error = await rejection(invoke(Account.modelsList, {}));

		expect(error.message).not.toContain(API_KEY);
		expect(JSON.stringify(error)).not.toContain(API_KEY);
		expect(require('node:util').inspect(error)).not.toContain(API_KEY);
	});

	it("keeps the prompt out of a failed request's error", async () => {
		respond(openAiErrorResponse, 400);

		const error = await rejection(
			invoke(Ai.chatCompletions, {
				model: 'gpt-6-luna',
				messages: [{ role: 'user', content: 'private-sentinel-4821' }],
			}),
		);

		expect(error.request.body).toBeUndefined();
		expect(error.request.method).toBe('POST');
		expect(require('node:util').inspect(error)).not.toContain(
			'private-sentinel-4821',
		);
	});

	it('fails loudly when the chat answer has no choices', async () => {
		respond({ id: 'x', object: 'chat.completion' });

		await expect(
			invoke(Ai.chatCompletions, {
				model: 'gpt-6-luna',
				messages: [{ role: 'user', content: 'Hi' }],
			}),
		).rejects.toThrow();
	});
});

describe('logging', () => {
	it('logs the operation without the prompt', async () => {
		respond(modelsResponse);

		await invoke(Account.modelsList, {});

		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'textcortex.models.list',
			{},
			'completed',
		);
	});
});
