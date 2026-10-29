import { jest } from '@jest/globals';
import { logEventFromContext } from 'corsair/core';
import { ApiError, request } from 'corsair/http';
import {
	AiEndpoints,
	AudioEndpoints,
	ClassificationEndpoints,
	EmbeddingEndpoints,
	PromptEngineEndpoints,
	ValidateEndpoints,
	VisionEndpoints,
	WebEndpoints,
} from './endpoints';
import { JigsawstackEndpointOutputSchemas } from './endpoints/types';

jest.mock('corsair/core', () => ({
	logEventFromContext: jest.fn(),
}));

jest.mock('corsair/http', () => {
	class MockApiError extends Error {
		status: number;
		statusText: string;
		body: unknown;
		retryAfter: number | undefined;

		constructor(
			status: number,
			message: string,
			statusText = '',
			body: unknown = undefined,
			retryAfter: number | undefined = undefined,
		) {
			super(message);
			this.name = 'ApiError';
			this.status = status;
			this.statusText = statusText;
			this.body = body;
			this.retryAfter = retryAfter;
		}
	}

	return { ApiError: MockApiError, request: jest.fn() };
});

const requestMock = request as unknown as jest.Mock<
	(config: unknown, options: unknown) => Promise<unknown>
>;

function call(fn: unknown, ctx: unknown, input?: unknown): Promise<unknown> {
	return (fn as (c: unknown, i: unknown) => Promise<unknown>)(ctx, input);
}

const ctx = { key: 'test-key', db: {} };

const ok = { success: true as const };

describe('jigsawstack endpoint requests', () => {
	beforeEach(() => {
		requestMock.mockReset();
		requestMock.mockResolvedValue(ok);
		(logEventFromContext as unknown as jest.Mock).mockReset();
	});

	it('sends x-api-key and never a bearer token', async () => {
		requestMock.mockResolvedValue({ success: true, summary: 'ok' });
		await call(AiEndpoints.summary, ctx, { text: 'hello world' });

		const [config, options] = requestMock.mock.calls[0] as [
			{ BASE: string; TOKEN?: string; HEADERS: Record<string, string> },
			{ method: string; url: string; body: { text: string } },
		];
		expect(config.BASE).toBe('https://api.jigsawstack.com');
		expect(config.TOKEN).toBeUndefined();
		expect(config.HEADERS['x-api-key']).toBe('test-key');
		expect(options.method).toBe('POST');
		expect(options.url).toBe('v1/ai/summary');
		expect(options.body).toEqual({ text: 'hello world' });
	});

	it('validate.nsfw posts the image url', async () => {
		const body = {
			success: true,
			nsfw: false,
			nudity: false,
			gore: false,
			nsfw_score: 0.1,
			nudity_score: 0.1,
			gore_score: 0.1,
		};
		requestMock.mockResolvedValue(body);
		const result = await call(ValidateEndpoints.nsfw, ctx, {
			url: 'https://jigsawstack.com/preview/nsfw-example.jpg',
		});
		JigsawstackEndpointOutputSchemas.nsfw.parse(result);
		expect((requestMock.mock.calls[0] as [{}, { url: string }])[1].url).toBe(
			'v1/validate/nsfw',
		);
	});

	it('validate.profanity posts text', async () => {
		requestMock.mockResolvedValue({
			success: true,
			profanities_found: false,
			profanities: [],
			clean_text: 'hello',
		});
		const result = await call(ValidateEndpoints.profanity, ctx, {
			text: 'hello',
		});
		JigsawstackEndpointOutputSchemas.profanity.parse(result);
	});

	it('validate.spamCheck posts text', async () => {
		requestMock.mockResolvedValue({
			success: true,
			check: { is_spam: true, score: 0.9 },
		});
		const result = await call(ValidateEndpoints.spamCheck, ctx, {
			text: 'win a free phone',
		});
		JigsawstackEndpointOutputSchemas.spamCheck.parse(result);
	});

	it('validate.spellCheck posts text', async () => {
		requestMock.mockResolvedValue({
			success: true,
			misspellings_found: true,
			misspellings: [],
			auto_correct_text: 'sentence',
		});
		const result = await call(ValidateEndpoints.spellCheck, ctx, {
			text: 'sentense',
		});
		JigsawstackEndpointOutputSchemas.spellCheck.parse(result);
	});

	it('ai.sentiment posts text', async () => {
		requestMock.mockResolvedValue({
			success: true,
			sentiment: { emotion: 'love', sentiment: 'positive', score: 0.9 },
		});
		const result = await call(AiEndpoints.sentiment, ctx, {
			text: 'I love it',
		});
		JigsawstackEndpointOutputSchemas.sentiment.parse(result);
	});

	it('ai.translate posts target_language', async () => {
		requestMock.mockResolvedValue({
			success: true,
			translated_text: 'hola',
		});
		const result = await call(AiEndpoints.translate, ctx, {
			text: 'hello',
			target_language: 'es',
		});
		JigsawstackEndpointOutputSchemas.translate.parse(result);
	});

	it('ai.prediction posts dataset', async () => {
		requestMock.mockResolvedValue({
			success: true,
			prediction: [{ value: 2, date: '2024-01-02' }],
		});
		const result = await call(AiEndpoints.prediction, ctx, {
			dataset: [
				{ value: 1, date: '2024-01-01' },
				{ value: 2, date: '2024-01-02' },
				{ value: 3, date: '2024-01-03' },
				{ value: 4, date: '2024-01-04' },
				{ value: 5, date: '2024-01-05' },
			],
			steps: 1,
		});
		JigsawstackEndpointOutputSchemas.prediction.parse(result);
	});

	it('ai.imageGeneration defaults return_type to url', async () => {
		requestMock.mockResolvedValue({
			success: true,
			url: 'https://cdn.example/x.png',
		});
		const result = await call(AiEndpoints.imageGeneration, ctx, {
			prompt: 'a cat',
		});
		JigsawstackEndpointOutputSchemas.imageGeneration.parse(result);
		const body = (
			requestMock.mock.calls[0] as [{}, { body: { return_type: string } }]
		)[1].body;
		expect(body.return_type).toBe('url');
	});

	it('ai.imageGeneration fetches binary when return_type is binary', async () => {
		const fetchMock = jest.fn(async () => ({
			ok: true,
			headers: { get: () => 'image/png' },
			arrayBuffer: async () => new Uint8Array([1, 2, 3]).buffer,
		}));
		globalThis.fetch = fetchMock as unknown as typeof fetch;

		const result = await call(AiEndpoints.imageGeneration, ctx, {
			prompt: 'a cat',
			return_type: 'binary',
		});
		JigsawstackEndpointOutputSchemas.imageGeneration.parse(result);
		expect(requestMock).not.toHaveBeenCalled();
		expect(JSON.stringify(fetchMock.mock.calls[0])).toContain(
			'https://api.jigsawstack.com/v1/ai/image_generation',
		);
	});

	it('web.scrape posts url and prompts', async () => {
		requestMock.mockResolvedValue({ success: true, data: [] });
		const result = await call(WebEndpoints.scrape, ctx, {
			url: 'https://example.com',
			element_prompts: ['title'],
		});
		JigsawstackEndpointOutputSchemas.scrape.parse(result);
		expect((requestMock.mock.calls[0] as [{}, { url: string }])[1].url).toBe(
			'v1/ai/scrape',
		);
	});

	it('web.htmlToAny defaults return_type to url', async () => {
		requestMock.mockResolvedValue({
			success: true,
			url: 'https://cdn.example/x.png',
		});
		const result = await call(WebEndpoints.htmlToAny, ctx, {
			html: '<h1>hi</h1>',
			type: 'png',
		});
		JigsawstackEndpointOutputSchemas.htmlToAny.parse(result);
	});

	it('web.htmlToAny fetches binary when return_type is binary', async () => {
		const fetchMock = jest.fn(async () => ({
			ok: true,
			headers: { get: () => 'image/png' },
			arrayBuffer: async () => new Uint8Array([1, 2, 3]).buffer,
		}));
		globalThis.fetch = fetchMock as unknown as typeof fetch;

		const result = await call(WebEndpoints.htmlToAny, ctx, {
			html: '<h1>hi</h1>',
			return_type: 'binary',
		});
		JigsawstackEndpointOutputSchemas.htmlToAny.parse(result);
		expect(requestMock).not.toHaveBeenCalled();
		expect(JSON.stringify(fetchMock.mock.calls[0])).toContain(
			'https://api.jigsawstack.com/v1/web/html_to_any',
		);
	});

	it('web.search posts query', async () => {
		requestMock.mockResolvedValue({
			success: true,
			query: 'corsair',
			results: [],
			spell_fixed: false,
			is_safe: true,
		});
		const result = await call(WebEndpoints.search, ctx, { query: 'corsair' });
		JigsawstackEndpointOutputSchemas.search.parse(result);
	});

	it('web.searchSuggestions uses GET with query', async () => {
		requestMock.mockResolvedValue({
			success: true,
			suggestions: ['corsair plugin'],
		});
		const result = await call(WebEndpoints.searchSuggestions, ctx, {
			query: 'corsair',
		});
		JigsawstackEndpointOutputSchemas.searchSuggestions.parse(result);
		const first = requestMock.mock.calls[0];
		expect(first).toBeDefined();
		const options = first![1] as {
			method: string;
			url: string;
			query: { query: string };
		};
		expect(options.method).toBe('GET');
		expect(options.url).toBe('v1/web/search/suggest');
		expect(options.query.query).toBe('corsair');
	});

	it('vision.vocr posts prompt and url', async () => {
		requestMock.mockResolvedValue({
			success: true,
			width: 1,
			height: 1,
			tags: [],
			has_text: true,
			sections: [],
		});
		const result = await call(VisionEndpoints.vocr, ctx, {
			url: 'https://example.com/a.png',
			prompt: 'extract text',
		});
		JigsawstackEndpointOutputSchemas.vocr.parse(result);
		expect((requestMock.mock.calls[0] as [{}, { url: string }])[1].url).toBe(
			'v1/vocr',
		);
	});

	it('vision.detectObjects posts to /v1/object_detection', async () => {
		requestMock.mockResolvedValue({ success: true, objects: [] });
		const result = await call(VisionEndpoints.detectObjects, ctx, {
			url: 'https://example.com/a.png',
		});
		JigsawstackEndpointOutputSchemas.detectObjects.parse(result);
		expect((requestMock.mock.calls[0] as [{}, { url: string }])[1].url).toBe(
			'v1/object_detection',
		);
	});

	it('audio.speechToText posts to /v1/ai/transcribe', async () => {
		requestMock.mockResolvedValue({
			success: true,
			text: 'hello',
			chunks: [],
		});
		const result = await call(AudioEndpoints.speechToText, ctx, {
			url: 'https://jigsawstack.com/preview/stt-example.wav',
		});
		JigsawstackEndpointOutputSchemas.speechToText.parse(result);
	});

	it('embedding.createV2 posts to /v2/embedding', async () => {
		requestMock.mockResolvedValue({
			success: true,
			embeddings: [[0.1, 0.2]],
		});
		const result = await call(EmbeddingEndpoints.createV2, ctx, {
			text: 'hello',
			type: 'text',
		});
		JigsawstackEndpointOutputSchemas.createEmbeddingV2.parse(result);
		expect((requestMock.mock.calls[0] as [{}, { url: string }])[1].url).toBe(
			'v2/embedding',
		);
	});

	it('classification.classify posts dataset and labels', async () => {
		requestMock.mockResolvedValue({ success: true, predictions: ['ok'] });
		const result = await call(ClassificationEndpoints.classify, ctx, {
			dataset: [{ type: 'text', value: 'hi' }],
			labels: [
				{ type: 'text', value: 'ok' },
				{ type: 'text', value: 'not-ok' },
			],
		});
		JigsawstackEndpointOutputSchemas.classify.parse(result);
	});

	it('promptEngine.create posts the template', async () => {
		requestMock.mockResolvedValue({
			success: true,
			prompt_engine_id: 'pe_1',
		});
		const result = await call(PromptEngineEndpoints.create, ctx, {
			prompt: 'Say {x}',
			inputs: [{ key: 'x' }],
		});
		JigsawstackEndpointOutputSchemas.createPrompt.parse(result);
	});

	it('promptEngine.list uses GET pagination query', async () => {
		requestMock.mockResolvedValue({
			success: true,
			prompt_engines: [],
			page: 0,
			limit: 20,
			has_more: false,
		});
		const result = await call(PromptEngineEndpoints.list, ctx, {
			page: 0,
			limit: 20,
		});
		JigsawstackEndpointOutputSchemas.listPrompts.parse(result);
		const first = requestMock.mock.calls[0];
		expect(first).toBeDefined();
		const options = first![1] as {
			method: string;
			query: { page: number; limit: number };
		};
		expect(options.method).toBe('GET');
		expect(options.query).toEqual({ page: 0, limit: 20 });
	});

	it('promptEngine.run puts id in the path', async () => {
		requestMock.mockResolvedValue({ success: true, result: 'ok' });
		const result = await call(PromptEngineEndpoints.run, ctx, {
			id: 'pe_1',
			input_values: { x: 'hi' },
		});
		JigsawstackEndpointOutputSchemas.runPrompt.parse(result);
		const runCall = requestMock.mock.calls[0];
		expect(runCall).toBeDefined();
		const runOpts = runCall![1] as {
			url: string;
			body: { id?: string; input_values: unknown };
		};
		expect(runOpts.url).toBe('v1/prompt_engine/pe_1');
		expect(runOpts.body.id).toBeUndefined();
		expect(runOpts.body.input_values).toEqual({ x: 'hi' });
	});

	it('audio.textToSpeech posts to /v1/ai/tts as binary', async () => {
		const fetchMock = jest.fn(async () => ({
			ok: true,
			headers: { get: () => 'audio/wav' },
			arrayBuffer: async () => new Uint8Array([1, 2, 3]).buffer,
		}));
		globalThis.fetch = fetchMock as unknown as typeof fetch;

		const result = await call(AudioEndpoints.textToSpeech, ctx, {
			text: 'hello world',
		});
		JigsawstackEndpointOutputSchemas.textToSpeech.parse(result);
		expect(fetchMock).toHaveBeenCalled();
		expect(JSON.stringify(fetchMock.mock.calls[0])).toContain(
			'https://api.jigsawstack.com/v1/ai/tts',
		);
	});

	it('audio.createVoiceClone posts name and url', async () => {
		requestMock.mockResolvedValue({ success: true, voice_id: 'vc_1' });
		const result = await call(AudioEndpoints.createVoiceClone, ctx, {
			name: 'demo',
			url: 'https://jigsawstack.com/preview/tts-clone-example.mp3',
		});
		JigsawstackEndpointOutputSchemas.createVoiceClone.parse(result);
		expect((requestMock.mock.calls[0] as [{}, { url: string }])[1].url).toBe(
			'v1/ai/tts/clone',
		);
	});

	it('surfaces HTTP 429 as JigsawstackAPIError with status', async () => {
		const ApiErrorCtor = ApiError as unknown as new (
			status: number,
			message: string,
		) => Error;
		requestMock.mockRejectedValue(new ApiErrorCtor(429, 'rate limited'));
		await expect(
			call(AiEndpoints.summary, ctx, { text: 'x' }),
		).rejects.toMatchObject({ name: 'JigsawstackAPIError', status: 429 });
	});
});
