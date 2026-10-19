import { AuthMissingError, logEventFromContext } from 'corsair/core';
import { ApiError } from 'corsair/http';
import * as client from './client';
import {
	Answer,
	BroadSearch,
	BusinessSearch,
	Embedding,
	Extract,
	GroundedGeneration,
	ImageSearch,
	NewsSearch,
	Search,
	VideoGeneration,
	VideoSearch,
	VlEmbedding,
} from './endpoints';
import type {
	OctenContext,
	OctenKeyBuilderContext,
	OctenPluginOptions,
} from './index';
import { octen, octenEndpointSchemas } from './index';

jest.mock('corsair/core', () => {
	const actual = jest.requireActual('corsair/core');
	return { ...actual, logEventFromContext: jest.fn() };
});

jest.mock('./client', () => {
	const actual = jest.requireActual('./client');
	return { ...actual, makeOctenRequest: jest.fn() };
});

const mockedRequest = jest.mocked(client.makeOctenRequest);
const mockedLogEvent = jest.mocked(logEventFromContext);

type Ctx = Parameters<typeof Search.post>[0];

function buildCtx(): Ctx {
	const ctx: OctenContext = {
		endpoints: {},
		$getAccountId: () => Promise.resolve('test-account'),
		key: 'test-api-key',
		options: {},
		keys: {
			get_dek: () => Promise.resolve('test-dek'),
			issue_new_dek: () => Promise.resolve('test-dek'),
			get_api_key: () => Promise.resolve('test-api-key'),
			set_api_key: () => Promise.resolve(),
			get_webhook_signature: () => Promise.resolve(null),
			set_webhook_signature: () => Promise.resolve(),
		},
		db: {},
	};
	return ctx;
}

const ctx = buildCtx();

beforeEach(() => {
	mockedRequest.mockReset();
	mockedLogEvent.mockReset();
});

// Fixtures mirror the Octen OpenAPI document
// (https://docs.octen.ai/api-reference/openapi.json). Because `./client` is
// mocked here, these outputs are the already-unwrapped `data` payloads the real
// client returns; envelope-code handling is covered in client.test.ts.

describe('search.post', () => {
	it('sends the query and returns parsed results', async () => {
		const mockResponse = {
			query: 'openai',
			results: [{ title: 'Octen', url: 'https://octen.ai', highlight: 'api' }],
		};
		mockedRequest.mockResolvedValue(mockResponse);

		const result = await Search.post(ctx, { query: 'openai', count: 10 });

		expect(result).toEqual(mockResponse);
		expect(mockedRequest).toHaveBeenCalledWith('/search', 'test-api-key', {
			method: 'POST',
			body: { query: 'openai', count: 10 },
		});
		expect(mockedLogEvent).toHaveBeenCalledWith(
			ctx,
			'octen.search.post',
			{ query: 'openai', resultCount: 1 },
			'completed',
		);
	});

	it('rejects an empty query before calling the API', async () => {
		await expect(Search.post(ctx, { query: '' })).rejects.toThrow();

		expect(mockedRequest).not.toHaveBeenCalled();
		expect(mockedLogEvent).not.toHaveBeenCalled();
	});
});

describe('broadSearch.post', () => {
	it('sends the query and returns expanded result groups', async () => {
		const mockResponse = {
			query: 'ai agents',
			queries: ['ai agents', 'ai agent frameworks'],
			search_results: [{ query: 'ai agents', results: [], latency: 12 }],
		};
		mockedRequest.mockResolvedValue(mockResponse);

		const result = await BroadSearch.post(ctx, {
			query: 'ai agents',
			max_queries: 5,
			search_options: { count: 3 },
		});

		expect(result).toEqual(mockResponse);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/broad-search',
			'test-api-key',
			{
				method: 'POST',
				body: {
					query: 'ai agents',
					max_queries: 5,
					search_options: { count: 3 },
				},
			},
		);
		expect(mockedLogEvent).toHaveBeenCalledWith(
			ctx,
			'octen.broadSearch.post',
			{ query: 'ai agents', queryCount: 2 },
			'completed',
		);
	});

	it('rejects max_queries below one', async () => {
		await expect(
			BroadSearch.post(ctx, { query: 'ai', max_queries: 0 }),
		).rejects.toThrow();

		expect(mockedRequest).not.toHaveBeenCalled();
	});
});

describe('newsSearch.post', () => {
	it('sends the query and returns articles and subject clusters', async () => {
		const mockResponse = {
			query: 'fusion energy',
			results: [{ title: 'Breakthrough', summary: 'A summary' }],
			subjects: [{ name: 'Fusion', sub_news: [] }],
		};
		mockedRequest.mockResolvedValue(mockResponse);

		const result = await NewsSearch.post(ctx, {
			query: 'fusion energy',
			count: 20,
			subjects: { enable: true, count: 3, max_sub_news: 5 },
		});

		expect(result).toEqual(mockResponse);
		expect(mockedRequest).toHaveBeenCalledWith('/news-search', 'test-api-key', {
			method: 'POST',
			body: {
				query: 'fusion energy',
				count: 20,
				subjects: { enable: true, count: 3, max_sub_news: 5 },
			},
		});
		expect(mockedLogEvent).toHaveBeenCalledWith(
			ctx,
			'octen.newsSearch.post',
			{ query: 'fusion energy', resultCount: 1 },
			'completed',
		);
	});

	it('rejects a count above the documented maximum', async () => {
		await expect(
			NewsSearch.post(ctx, { query: 'x', count: 101 }),
		).rejects.toThrow();

		expect(mockedRequest).not.toHaveBeenCalled();
	});
});

describe('businessSearch.post', () => {
	it('sends the query and returns entity cards', async () => {
		const mockResponse = {
			query: 'acme',
			results: [],
			entities: [{ type: 'company', name: 'Acme Corp' }],
		};
		mockedRequest.mockResolvedValue(mockResponse);

		const result = await BusinessSearch.post(ctx, {
			query: 'acme',
			entities: { enable: true, count: 10, max_news: 5 },
		});

		expect(result).toEqual(mockResponse);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/business-search',
			'test-api-key',
			{
				method: 'POST',
				body: {
					query: 'acme',
					entities: { enable: true, count: 10, max_news: 5 },
				},
			},
		);
		expect(mockedLogEvent).toHaveBeenCalledWith(
			ctx,
			'octen.businessSearch.post',
			{ query: 'acme', resultCount: 0 },
			'completed',
		);
	});

	it('rejects an empty query', async () => {
		await expect(BusinessSearch.post(ctx, { query: '' })).rejects.toThrow();

		expect(mockedRequest).not.toHaveBeenCalled();
	});
});

describe('imageSearch.post', () => {
	it('sends a single text input and returns image results', async () => {
		const mockResponse = {
			results: [{ title: 'Panda', width: 800, height: 600 }],
		};
		mockedRequest.mockResolvedValue(mockResponse);

		const result = await ImageSearch.post(ctx, {
			inputs: [{ type: 'text', data: 'red panda' }],
			count: 5,
			safesearch: 'strict',
		});

		expect(result).toEqual(mockResponse);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/image-search',
			'test-api-key',
			{
				method: 'POST',
				body: {
					inputs: [{ type: 'text', data: 'red panda' }],
					count: 5,
					safesearch: 'strict',
				},
			},
		);
		expect(mockedLogEvent).toHaveBeenCalledWith(
			ctx,
			'octen.imageSearch.post',
			{ resultCount: 1 },
			'completed',
		);
	});

	it('rejects more than one input', async () => {
		await expect(
			ImageSearch.post(ctx, {
				inputs: [
					{ type: 'text', data: 'a' },
					{ type: 'text', data: 'b' },
				],
			}),
		).rejects.toThrow();

		expect(mockedRequest).not.toHaveBeenCalled();
	});
});

describe('videoSearch.post', () => {
	it('sends a text input and returns video results', async () => {
		const mockResponse = {
			results: [{ title: 'Solo', duration_seconds: 120 }],
		};
		mockedRequest.mockResolvedValue(mockResponse);

		const result = await VideoSearch.post(ctx, {
			inputs: [{ type: 'text', data: 'guitar solo' }],
			time_range: 'month',
		});

		expect(result).toEqual(mockResponse);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/video-search',
			'test-api-key',
			{
				method: 'POST',
				body: {
					inputs: [{ type: 'text', data: 'guitar solo' }],
					time_range: 'month',
				},
			},
		);
		expect(mockedLogEvent).toHaveBeenCalledWith(
			ctx,
			'octen.videoSearch.post',
			{ resultCount: 1 },
			'completed',
		);
	});

	it('rejects more than one input', async () => {
		await expect(
			VideoSearch.post(ctx, {
				inputs: [
					{ type: 'text', data: 'a' },
					{ type: 'text', data: 'b' },
				],
			}),
		).rejects.toThrow();

		expect(mockedRequest).not.toHaveBeenCalled();
	});
});

describe('extract.post', () => {
	it('sends URLs and returns page content', async () => {
		const mockResponse = {
			results: [
				{
					url: 'https://octen.ai/pricing',
					status: 'success',
					title: 'Pricing',
					links: [{ url: 'https://octen.ai/docs', is_external: false }],
				},
			],
		};
		mockedRequest.mockResolvedValue(mockResponse);

		const result = await Extract.post(ctx, {
			urls: ['https://octen.ai/pricing'],
			mode: 'auto',
			include_links: { scope: 'prefer_internal', max_links: 10 },
		});

		expect(result).toEqual(mockResponse);
		expect(mockedRequest).toHaveBeenCalledWith('/extract', 'test-api-key', {
			method: 'POST',
			body: {
				urls: ['https://octen.ai/pricing'],
				mode: 'auto',
				include_links: { scope: 'prefer_internal', max_links: 10 },
			},
		});
		expect(mockedLogEvent).toHaveBeenCalledWith(
			ctx,
			'octen.extract.post',
			{ urlCount: 1 },
			'completed',
		);
	});

	it('rejects an empty URL list', async () => {
		await expect(Extract.post(ctx, { urls: [] })).rejects.toThrow();

		expect(mockedRequest).not.toHaveBeenCalled();
	});
});

describe('embedding.create', () => {
	it('sends text inputs and returns vectors', async () => {
		const mockResponse = {
			results: [{ index: 0, embedding: [0.1, 0.2] }],
			model: 'octen-embedding-4b',
		};
		mockedRequest.mockResolvedValue(mockResponse);

		const result = await Embedding.create(ctx, {
			input: ['hello world', 'second document'],
			model: 'octen-embedding-4b',
		});

		expect(result).toEqual(mockResponse);
		expect(mockedRequest).toHaveBeenCalledWith('/embedding', 'test-api-key', {
			method: 'POST',
			body: {
				input: ['hello world', 'second document'],
				model: 'octen-embedding-4b',
			},
		});
		expect(mockedLogEvent).toHaveBeenCalledWith(
			ctx,
			'octen.embedding.create',
			{ inputCount: 2 },
			'completed',
		);
	});

	it('rejects a non-positive dimension', async () => {
		await expect(
			Embedding.create(ctx, { input: ['x'], dimension: 0 }),
		).rejects.toThrow();

		expect(mockedRequest).not.toHaveBeenCalled();
	});
});

describe('vlEmbedding.create', () => {
	it('sends multimodal content and returns vectors', async () => {
		const mockResponse = {
			results: [{ index: 0, embedding: [0.5], type: 'vl' }],
		};
		mockedRequest.mockResolvedValue(mockResponse);

		const result = await VlEmbedding.create(ctx, {
			model: 'octen-vl-embedding-large',
			input: {
				contents: [{ text: 'a cat' }, { image: 'https://octen.ai/c.png' }],
			},
			enable_fusion: true,
		});

		expect(result).toEqual(mockResponse);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/vl-embedding',
			'test-api-key',
			{
				method: 'POST',
				body: {
					model: 'octen-vl-embedding-large',
					input: {
						contents: [{ text: 'a cat' }, { image: 'https://octen.ai/c.png' }],
					},
					enable_fusion: true,
				},
			},
		);
		expect(mockedLogEvent).toHaveBeenCalledWith(
			ctx,
			'octen.vlEmbedding.create',
			{ contentCount: 2 },
			'completed',
		);
	});

	it('rejects an out-of-range fps value', async () => {
		await expect(
			VlEmbedding.create(ctx, {
				model: 'octen-vl-embedding',
				input: { contents: [{ text: 'a cat' }] },
				fps: 5,
			}),
		).rejects.toThrow();

		expect(mockedRequest).not.toHaveBeenCalled();
	});
});

describe('answer.create', () => {
	it('forces stream false and returns a chat completion', async () => {
		const mockResponse = {
			request_id: 'req_1',
			object: 'chat.completion',
			created: 1,
			model: 'anthropic/claude-sonnet-4.6',
			choices: [
				{
					index: 0,
					finish_reason: 'stop',
					message: { role: 'assistant', content: 'Octen is a search API.' },
				},
			],
		};
		mockedRequest.mockResolvedValue(mockResponse);

		const result = await Answer.create(ctx, {
			messages: [{ role: 'user', content: 'What is Octen?' }],
			mode: 'full',
			max_queries: 3,
		});

		expect(result).toEqual(mockResponse);
		expect(mockedRequest).toHaveBeenCalledWith('/answer', 'test-api-key', {
			method: 'POST',
			body: {
				messages: [{ role: 'user', content: 'What is Octen?' }],
				mode: 'full',
				max_queries: 3,
				stream: false,
			},
			envelope: false,
		});
		expect(mockedLogEvent).toHaveBeenCalledWith(
			ctx,
			'octen.answer.create',
			{ messageCount: 1 },
			'completed',
		);
	});

	it('rejects an empty message list', async () => {
		await expect(Answer.create(ctx, { messages: [] })).rejects.toThrow();

		expect(mockedRequest).not.toHaveBeenCalled();
	});
});

describe('videoGeneration.create', () => {
	it('queues a video task without the envelope', async () => {
		const mockResponse = {
			id: 'vid_1',
			model: 'google/veo-3.1',
			status: 'queued',
			created: 1,
		};
		mockedRequest.mockResolvedValue(mockResponse);

		const result = await VideoGeneration.create(ctx, {
			model: 'google/veo-3.1',
			prompt: 'a drone shot over a canyon',
			resolution: '1080p',
			extra_params: { seed_mode: 'random' },
		});

		expect(result).toEqual(mockResponse);
		expect(mockedRequest).toHaveBeenCalledWith('/v1/videos', 'test-api-key', {
			method: 'POST',
			body: {
				model: 'google/veo-3.1',
				prompt: 'a drone shot over a canyon',
				resolution: '1080p',
				extra_params: { seed_mode: 'random' },
			},
			envelope: false,
		});
		expect(mockedLogEvent).toHaveBeenCalledWith(
			ctx,
			'octen.videoGeneration.create',
			{ model: 'google/veo-3.1' },
			'completed',
		);
	});

	it('rejects an empty prompt', async () => {
		await expect(
			VideoGeneration.create(ctx, { model: 'google/veo-3.1', prompt: '' }),
		).rejects.toThrow();

		expect(mockedRequest).not.toHaveBeenCalled();
	});
});

describe('videoGeneration.get', () => {
	it('fetches a task by id from the templated path', async () => {
		const mockResponse = {
			id: 'vid_1',
			model: 'google/veo-3.1',
			status: 'completed',
			created: 1,
			video_url: 'https://octen.ai/videos/vid_1.mp4',
		};
		mockedRequest.mockResolvedValue(mockResponse);

		const result = await VideoGeneration.get(ctx, { id: 'vid_1' });

		expect(result).toEqual(mockResponse);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/v1/videos/{id}',
			'test-api-key',
			{
				method: 'GET',
				path: { id: 'vid_1' },
				envelope: false,
			},
		);
		expect(mockedLogEvent).toHaveBeenCalledWith(
			ctx,
			'octen.videoGeneration.get',
			{ id: 'vid_1' },
			'completed',
		);
	});

	it('rejects an empty task id', async () => {
		await expect(VideoGeneration.get(ctx, { id: '' })).rejects.toThrow();

		expect(mockedRequest).not.toHaveBeenCalled();
	});
});

describe('groundedGeneration.create', () => {
	it('queues a grounded generation without the envelope', async () => {
		const mockResponse = {
			request_id: 'req_1',
			generation_id: 'gen_1',
			modality: 'image',
			status: 'queued',
			created_at: 1,
		};
		mockedRequest.mockResolvedValue(mockResponse);

		const result = await GroundedGeneration.create(ctx, {
			modality: 'image',
			prompt: 'a red panda in space',
			model: 'google/gemini-3-pro-image',
			aspect_ratio: '16:9',
		});

		expect(result).toEqual(mockResponse);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/v1/grounded-generation',
			'test-api-key',
			{
				method: 'POST',
				body: {
					modality: 'image',
					prompt: 'a red panda in space',
					model: 'google/gemini-3-pro-image',
					aspect_ratio: '16:9',
				},
				envelope: false,
			},
		);
		expect(mockedLogEvent).toHaveBeenCalledWith(
			ctx,
			'octen.groundedGeneration.create',
			{ modality: 'image' },
			'completed',
		);
	});

	it('rejects an empty prompt', async () => {
		await expect(
			GroundedGeneration.create(ctx, { modality: 'image', prompt: '' }),
		).rejects.toThrow();

		expect(mockedRequest).not.toHaveBeenCalled();
	});
});

describe('groundedGeneration.get', () => {
	it('fetches a generation by id from the templated path', async () => {
		const mockResponse = {
			generation_id: 'gen_1',
			modality: 'image',
			status: 'succeeded',
			output_url: 'https://octen.ai/out/gen_1.png',
			created_at: 1,
			updated_at: 2,
		};
		mockedRequest.mockResolvedValue(mockResponse);

		const result = await GroundedGeneration.get(ctx, {
			generation_id: 'gen_1',
		});

		expect(result).toEqual(mockResponse);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/v1/grounded-generation/{generation_id}',
			'test-api-key',
			{
				method: 'GET',
				path: { generation_id: 'gen_1' },
				envelope: false,
			},
		);
		expect(mockedLogEvent).toHaveBeenCalledWith(
			ctx,
			'octen.groundedGeneration.get',
			{ generation_id: 'gen_1' },
			'completed',
		);
	});

	it('rejects an empty generation id', async () => {
		await expect(
			GroundedGeneration.get(ctx, { generation_id: '' }),
		).rejects.toThrow();

		expect(mockedRequest).not.toHaveBeenCalled();
	});
});

describe('client failures', () => {
	it('propagates an API error without logging completion', async () => {
		const apiError = new ApiError(
			{ method: 'POST', url: '/search' },
			{
				url: 'https://api.octen.ai/search',
				ok: false,
				status: 429,
				statusText: 'Too Many Requests',
				body: { code: 429, msg: 'Too many requests' },
			},
			'Too many requests',
			{ retryAfter: 1000 },
		);
		mockedRequest.mockRejectedValue(apiError);

		await expect(Search.post(ctx, { query: 'openai' })).rejects.toBe(apiError);

		expect(mockedLogEvent).not.toHaveBeenCalled();
	});

	it('rejects a malformed response that fails output validation', async () => {
		mockedRequest.mockResolvedValue({ results: 'not-an-array' });

		await expect(Search.post(ctx, { query: 'openai' })).rejects.toThrow();

		expect(mockedLogEvent).not.toHaveBeenCalled();
	});
});

describe('octen plugin shape', () => {
	it('exposes a resource group for every implemented endpoint', () => {
		const plugin = octen({});

		expect(plugin.endpoints?.search.post).toBeDefined();
		expect(plugin.endpoints?.broadSearch.post).toBeDefined();
		expect(plugin.endpoints?.newsSearch.post).toBeDefined();
		expect(plugin.endpoints?.businessSearch.post).toBeDefined();
		expect(plugin.endpoints?.imageSearch.post).toBeDefined();
		expect(plugin.endpoints?.videoSearch.post).toBeDefined();
		expect(plugin.endpoints?.extract.post).toBeDefined();
		expect(plugin.endpoints?.embedding.create).toBeDefined();
		expect(plugin.endpoints?.vlEmbedding.create).toBeDefined();
		expect(plugin.endpoints?.answer.create).toBeDefined();
		expect(plugin.endpoints?.videoGeneration.create).toBeDefined();
		expect(plugin.endpoints?.videoGeneration.get).toBeDefined();
		expect(plugin.endpoints?.groundedGeneration.create).toBeDefined();
		expect(plugin.endpoints?.groundedGeneration.get).toBeDefined();
	});

	it('uses api_key auth and declares no webhooks', () => {
		const plugin = octen({ authType: 'api_key' });

		expect(plugin.options?.authType).toBe('api_key');
		expect(plugin.authConfig).toEqual({ api_key: {} });
		expect(plugin.webhooks).toEqual({});
	});

	it('wires zod input and output schemas for every endpoint', () => {
		const paths = [
			'search.post',
			'broadSearch.post',
			'newsSearch.post',
			'businessSearch.post',
			'imageSearch.post',
			'videoSearch.post',
			'extract.post',
			'embedding.create',
			'vlEmbedding.create',
			'answer.create',
			'videoGeneration.create',
			'videoGeneration.get',
			'groundedGeneration.create',
			'groundedGeneration.get',
		] as const;

		for (const path of paths) {
			expect(octenEndpointSchemas[path].input).toBeDefined();
			expect(octenEndpointSchemas[path].output).toBeDefined();
		}
	});
});

describe('octen keyBuilder', () => {
	function keyBuilderContext(
		getApiKey: () => Promise<string | null>,
	): OctenKeyBuilderContext {
		return {
			authType: 'api_key',
			options: {},
			keys: {
				get_dek: () => Promise.resolve('test-dek'),
				issue_new_dek: () => Promise.resolve('test-dek'),
				get_api_key: getApiKey,
				set_api_key: () => Promise.resolve(),
				get_webhook_signature: () => Promise.resolve(null),
				set_webhook_signature: () => Promise.resolve(),
			},
			tenantId: 'test-tenant',
		};
	}

	it('prefers an explicitly configured key over the stored one', async () => {
		const plugin = octen<OctenPluginOptions>({ key: 'option-key' });

		const key = await plugin.keyBuilder?.(
			keyBuilderContext(() => Promise.resolve('stored-key')),
			'endpoint',
		);

		expect(key).toBe('option-key');
	});

	it('returns the stored key when no option key is set', async () => {
		const plugin = octen<OctenPluginOptions>({});

		const key = await plugin.keyBuilder?.(
			keyBuilderContext(() => Promise.resolve('stored-key')),
			'endpoint',
		);

		expect(key).toBe('stored-key');
	});

	it('throws AuthMissingError when no key is stored', async () => {
		const plugin = octen<OctenPluginOptions>({});

		await expect(
			plugin.keyBuilder?.(
				keyBuilderContext(() =>
					Promise.reject(
						new Error(
							'No DEK found for account (tenant: "test-tenant", integration: "octen"). Initialize the account first.',
						),
					),
				),
				'endpoint',
			),
		).rejects.toThrow(AuthMissingError);
	});

	it('propagates an unexpected key manager failure', async () => {
		const plugin = octen<OctenPluginOptions>({});
		const failure = new Error('decryption failed');

		await expect(
			plugin.keyBuilder?.(
				keyBuilderContext(() => Promise.reject(failure)),
				'endpoint',
			),
		).rejects.toBe(failure);
	});
});

describe('octen custom error handlers', () => {
	it('evaluates caller-provided handlers before the catch-all DEFAULT', () => {
		const plugin = octen<OctenPluginOptions>({
			authType: 'api_key',
			errorHandlers: {
				CUSTOM_ERROR: {
					match: () => true,
					handler: async () => ({ maxRetries: 0 }),
				},
			},
		});

		const names = Object.keys(plugin.errorHandlers ?? {});
		expect(names).toContain('CUSTOM_ERROR');
		// Core selects the first handler whose matcher accepts the error and
		// DEFAULT matches everything, so a custom handler is only reachable
		// when DEFAULT is evaluated last.
		expect(names[names.length - 1]).toBe('DEFAULT');
		expect(names.indexOf('CUSTOM_ERROR')).toBeLessThan(
			names.indexOf('DEFAULT'),
		);
	});

	it('keeps a caller override of DEFAULT in the last position', () => {
		const override = {
			match: () => true,
			handler: async () => ({ maxRetries: 7 }),
		};
		const plugin = octen<OctenPluginOptions>({
			authType: 'api_key',
			errorHandlers: { DEFAULT: override },
		});

		expect(plugin.errorHandlers?.DEFAULT).toBe(override);
		const names = Object.keys(plugin.errorHandlers ?? {});
		expect(names[names.length - 1]).toBe('DEFAULT');
	});
});
