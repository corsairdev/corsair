import { ApiError } from 'corsair/http';
import {
	CategoriesListInputSchema,
	EmojiGetInputSchema,
	EmojiVariationsInputSchema,
	GifsGetByIdInputSchema,
	GifsGetByIdsInputSchema,
	GifsRandomInputSchema,
	GifsSearchInputSchema,
	GifsTranslateInputSchema,
	GifsTrendingInputSchema,
	GiphyCategoriesResponseSchema,
	GiphyListResponseSchema,
	GiphySingleResponseSchema,
	StickersRandomInputSchema,
	StickersSearchInputSchema,
	StickersTranslateInputSchema,
	StickersTrendingInputSchema,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { giphy, giphyAuthConfig, giphyEndpointSchemas } from './index';

describe('Giphy Plugin Configuration', () => {
	it('creates a valid plugin instance with default options', () => {
		const plugin = giphy();
		expect(plugin.id).toBe('giphy');
		expect(plugin.authConfig).toBe(giphyAuthConfig);
		expect(plugin.options?.authType).toBe('api_key');
		expect(plugin.endpoints).toBeDefined();
		expect(plugin.endpointMeta).toBeDefined();
		expect(plugin.endpointSchemas).toBe(giphyEndpointSchemas);
	});

	it('accepts custom key option', () => {
		const plugin = giphy({ key: 'test-api-key' });
		expect(plugin.options?.key).toBe('test-api-key');
	});

	it('configures keyBuilder correctly with options.key', async () => {
		const plugin = giphy({ key: 'configured-key' });
		const key = await plugin.keyBuilder?.({} as never, 'endpoint');
		expect(key).toBe('configured-key');
	});
});

describe('Giphy Error Handlers', () => {
	it('matches 429 rate limit error', () => {
		const err429 = new ApiError(
			{ url: 'https://api.giphy.com/v1/gifs/search', method: 'GET' },
			{
				status: 429,
				statusText: 'Too Many Requests',
				ok: false,
				url: '',
			} as any,
			'Rate limit exceeded',
		);
		expect(errorHandlers.RATE_LIMIT_ERROR.match(err429)).toBe(true);
	});

	it('matches 401 unauthorized error', () => {
		const err401 = new ApiError(
			{ url: 'https://api.giphy.com/v1/gifs/search', method: 'GET' },
			{ status: 401, statusText: 'Unauthorized', ok: false, url: '' } as any,
			'Invalid API Key',
		);
		expect(errorHandlers.AUTH_ERROR.match(err401)).toBe(true);
	});

	it('handles rate limit retry options', async () => {
		const err = new Error('Rate limit exceeded 429');
		const result = await errorHandlers.RATE_LIMIT_ERROR.handler(err);
		expect(result.maxRetries).toBe(5);
	});
});

describe('Giphy Endpoint Input Schemas', () => {
	it('validates gifs.search inputs', () => {
		const valid = { q: 'cats', limit: 10, offset: 0, rating: 'pg' as const };
		expect(() => GifsSearchInputSchema.parse(valid)).not.toThrow();
		expect(() => GifsSearchInputSchema.parse({})).toThrow();
	});

	it('validates gifs.trending inputs', () => {
		expect(() => GifsTrendingInputSchema.parse({ limit: 5 })).not.toThrow();
		expect(() => GifsTrendingInputSchema.parse({})).not.toThrow();
	});

	it('validates gifs.translate inputs', () => {
		expect(() =>
			GifsTranslateInputSchema.parse({ s: 'cheeseburger', weirdness: 5 }),
		).not.toThrow();
		expect(() =>
			GifsTranslateInputSchema.parse({ s: 'cheeseburger', weirdness: 15 }),
		).toThrow();
		expect(() => GifsTranslateInputSchema.parse({})).toThrow();
	});

	it('validates gifs.random inputs', () => {
		expect(() => GifsRandomInputSchema.parse({ tag: 'funny' })).not.toThrow();
		expect(() => GifsRandomInputSchema.parse({})).not.toThrow();
	});

	it('validates gifs.getById inputs', () => {
		expect(() =>
			GifsGetByIdInputSchema.parse({ gif_id: 'xT4uQul82sUtQUJFq8' }),
		).not.toThrow();
		expect(() => GifsGetByIdInputSchema.parse({})).toThrow();
	});

	it('validates gifs.getByIds inputs', () => {
		expect(() =>
			GifsGetByIdsInputSchema.parse({ ids: ['id1', 'id2'] }),
		).not.toThrow();
		expect(() =>
			GifsGetByIdsInputSchema.parse({ ids: 'id1,id2' }),
		).not.toThrow();
	});

	it('validates stickers inputs', () => {
		expect(() => StickersSearchInputSchema.parse({ q: 'dog' })).not.toThrow();
		expect(() => StickersTrendingInputSchema.parse({})).not.toThrow();
		expect(() =>
			StickersTranslateInputSchema.parse({ s: 'party' }),
		).not.toThrow();
		expect(() =>
			StickersRandomInputSchema.parse({ tag: 'dance' }),
		).not.toThrow();
	});

	it('validates emoji inputs', () => {
		expect(() => EmojiGetInputSchema.parse({ limit: 10 })).not.toThrow();
		expect(() =>
			EmojiVariationsInputSchema.parse({ gif_id: 'emoji_123' }),
		).not.toThrow();
	});

	it('validates categories.list inputs', () => {
		expect(() => CategoriesListInputSchema.parse({})).not.toThrow();
	});
});

describe('Giphy Endpoint Output Schemas', () => {
	const mockGif = {
		type: 'gif',
		id: '3oEjI6SIIHBdRxXI40',
		url: 'https://giphy.com/gifs/3oEjI6SIIHBdRxXI40',
		slug: 'funny-cat-3oEjI6SIIHBdRxXI40',
		title: 'Funny Cat GIF',
		rating: 'g',
		username: 'catlover',
		images: {
			original: {
				url: 'https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.gif',
				width: '480',
				height: '270',
			},
		},
	};

	it('parses single GIF response', () => {
		const singleResponse = {
			data: mockGif,
			meta: { status: 200, msg: 'OK', response_id: 'resp_123' },
		};
		const parsed = GiphySingleResponseSchema.parse(singleResponse);
		expect(parsed.data.id).toBe('3oEjI6SIIHBdRxXI40');
		expect(parsed.data.title).toBe('Funny Cat GIF');
	});

	it('parses list GIF response with pagination', () => {
		const listResponse = {
			data: [mockGif],
			pagination: { total_count: 100, count: 1, offset: 0 },
			meta: { status: 200, msg: 'OK', response_id: 'resp_456' },
		};
		const parsed = GiphyListResponseSchema.parse(listResponse);
		expect(parsed.data).toHaveLength(1);
		expect(parsed.pagination?.total_count).toBe(100);
	});

	it('parses categories response', () => {
		const categoriesResponse = {
			data: [
				{
					name: 'actions',
					name_encoded: 'actions',
					subcategories: [{ name: 'applause', name_encoded: 'applause' }],
				},
			],
			meta: { status: 200, msg: 'OK' },
		};
		const parsed = GiphyCategoriesResponseSchema.parse(categoriesResponse);
		expect(parsed.data).toHaveLength(1);
		expect(parsed.data[0]?.name).toBe('actions');
	});
});
