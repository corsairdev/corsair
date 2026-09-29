import { AuthMissingError } from 'corsair/core';
import { makeGiphyAnalyticsRequest, makeGiphyRequest } from './client';
import { Analytics } from './endpoints/analytics';
import { Categories } from './endpoints/categories';
import { Channels } from './endpoints/channels';
import { Emoji } from './endpoints/emoji';
import { Gifs } from './endpoints/gifs';
import { RandomId } from './endpoints/randomid';
import { Stickers } from './endpoints/stickers';
import { Tags } from './endpoints/tags';
import type {
	GiphyContext,
	GiphyKeyBuilderContext,
	GiphyPluginOptions,
} from './index';
import { giphy, giphyAuthConfig, giphyEndpointSchemas } from './index';

jest.mock('./client', () => ({
	makeGiphyRequest: jest.fn(),
	makeGiphyAnalyticsRequest: jest.fn(),
}));

const mockRequest = jest.mocked(makeGiphyRequest);
const mockAnalyticsRequest = jest.mocked(makeGiphyAnalyticsRequest);

type Ctx = GiphyContext;

// Inert entity-client stubs: endpoints under test only call
// `upsertByEntityId` for best-effort caching, so reads resolve empty and
// writes reject if ever awaited without a mock. One factory per entity so
// each literal is contextually typed — no assertion needed.
function stubGifsClient(): Ctx['db']['gifs'] {
	return {
		findByEntityId: () => Promise.resolve(null),
		existsByEntityId: () => Promise.resolve(false),
		findIdByEntityId: () => Promise.resolve(null),
		findById: () => Promise.resolve(null),
		findManyByEntityIds: () => Promise.resolve([]),
		list: () => Promise.resolve([]),
		search: () => Promise.resolve([]),
		upsertByEntityId: () =>
			Promise.reject(new Error('db stub: unused in endpoint tests')),
		deleteById: () => Promise.resolve(false),
		deleteByEntityId: () => Promise.resolve(false),
		count: () => Promise.resolve(0),
	};
}

function stubCategoriesClient(): Ctx['db']['categories'] {
	return {
		findByEntityId: () => Promise.resolve(null),
		existsByEntityId: () => Promise.resolve(false),
		findIdByEntityId: () => Promise.resolve(null),
		findById: () => Promise.resolve(null),
		findManyByEntityIds: () => Promise.resolve([]),
		list: () => Promise.resolve([]),
		search: () => Promise.resolve([]),
		upsertByEntityId: () =>
			Promise.reject(new Error('db stub: unused in endpoint tests')),
		deleteById: () => Promise.resolve(false),
		deleteByEntityId: () => Promise.resolve(false),
		count: () => Promise.resolve(0),
	};
}

function stubDb(): Ctx['db'] {
	return { gifs: stubGifsClient(), categories: stubCategoriesClient() };
}

function baseCtx(): Ctx {
	return {
		endpoints: {},
		$getAccountId: () => Promise.resolve('test-account'),
		key: '',
		options: {},
		keys: {
			get_dek: () => Promise.resolve('test-dek'),
			issue_new_dek: () => Promise.resolve('test-dek'),
			get_api_key: () => Promise.resolve(null),
			set_api_key: () => Promise.resolve(),
			get_webhook_signature: () => Promise.resolve(null),
			set_webhook_signature: () => Promise.resolve(),
			get_tenant_external_id: () => Promise.resolve(null),
			set_tenant_external_id: () => Promise.resolve(),
		},
		db: stubDb(),
	};
}

function makeCtx(key = 'test-api-key'): Ctx {
	return { ...baseCtx(), options: { key } };
}

function makeKeylessCtx(): Ctx {
	return baseCtx();
}

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

const listResponse = {
	data: [mockGif],
	pagination: { total_count: 100, count: 1, offset: 0 },
	meta: { status: 200, msg: 'OK', response_id: 'resp_456' },
};

const singleResponse = {
	data: mockGif,
	meta: { status: 200, msg: 'OK', response_id: 'resp_123' },
};

describe('Giphy plugin configuration', () => {
	it('creates a valid plugin instance with default options', () => {
		const plugin = giphy();
		expect(plugin.id).toBe('giphy');
		expect(plugin.authConfig).toBe(giphyAuthConfig);
		expect(plugin.options?.authType).toBe('api_key');
		expect(plugin.endpoints).toBeDefined();
		expect(plugin.endpointMeta).toBeDefined();
		expect(plugin.endpointSchemas).toBe(giphyEndpointSchemas);
	});

	it('accepts a custom key option', () => {
		const plugin = giphy({ key: 'test-api-key' });
		expect(plugin.options?.key).toBe('test-api-key');
	});

	// Pin the options type so keyBuilder's context stays fully typed: an
	// inferred narrow T would leave that context as never.
	it('exposes a keyBuilder for endpoint key resolution', async () => {
		jest.clearAllMocks();
		const plugin = giphy<GiphyPluginOptions>({ key: 'configured-key' });
		expect(plugin.keyBuilder).toBeDefined();

		const baseKeys = baseCtx().keys;
		const optionsCtx: GiphyKeyBuilderContext = {
			authType: 'api_key',
			tenantId: 'test-tenant',
			options: {},
			keys: { ...baseKeys, get_api_key: () => Promise.resolve(null) },
		};
		await expect(plugin.keyBuilder?.(optionsCtx, 'endpoint')).resolves.toBe(
			'configured-key',
		);

		const vaultPlugin = giphy<GiphyPluginOptions>();
		const vaultCtx: GiphyKeyBuilderContext = {
			authType: 'api_key',
			tenantId: 'test-tenant',
			options: {},
			keys: { ...baseKeys, get_api_key: () => Promise.resolve('vault-key') },
		};
		const vaultKey = await vaultPlugin.keyBuilder?.(vaultCtx, 'endpoint');
		expect(vaultKey).toBe('vault-key');

		mockRequest.mockResolvedValue(listResponse);
		const ctx: Ctx = { ...baseCtx(), key: vaultKey ?? '', options: {} };
		await Gifs.search(ctx, { q: 'cats' });
		expect(mockRequest).toHaveBeenCalledWith('/gifs/search', 'vault-key', {
			query: expect.objectContaining({ q: 'cats' }),
		});
	});

	it('registers every endpoint schema', () => {
		const paths = Object.keys(giphyEndpointSchemas);
		expect(paths).toEqual(
			expect.arrayContaining([
				'gifs.search',
				'gifs.trending',
				'gifs.translate',
				'gifs.random',
				'gifs.getById',
				'gifs.getByIds',
				'gifs.upload',
				'stickers.search',
				'stickers.trending',
				'stickers.translate',
				'stickers.random',
				'emoji.get',
				'emoji.variations',
				'categories.list',
				'categories.getById',
				'categories.gifs',
				'tags.autocomplete',
				'tags.trending',
				'tags.related',
				'channels.search',
				'randomId.get',
				'analytics.register',
			]),
		);
		expect(paths).toHaveLength(22);
	});
});

describe('Giphy GIF endpoints', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('searches gifs with the query term', async () => {
		mockRequest.mockResolvedValue(listResponse);
		const result = await Gifs.search(makeCtx(), { q: 'cats' });
		expect(mockRequest).toHaveBeenCalledWith('/gifs/search', 'test-api-key', {
			query: expect.objectContaining({ q: 'cats' }),
		});
		expect(result.data).toHaveLength(1);
		expect(result.data[0]?.id).toBe('3oEjI6SIIHBdRxXI40');
	});

	it('rejects gif search without an api key', async () => {
		await expect(Gifs.search(makeKeylessCtx(), { q: 'cats' })).rejects.toThrow(
			AuthMissingError,
		);
		expect(mockRequest).not.toHaveBeenCalled();
	});

	it('fetches trending gifs with pagination', async () => {
		mockRequest.mockResolvedValue(listResponse);
		const result = await Gifs.trending(makeCtx(), { limit: 5, offset: 10 });
		expect(mockRequest).toHaveBeenCalledWith('/gifs/trending', 'test-api-key', {
			query: expect.objectContaining({ limit: 5, offset: 10 }),
		});
		expect(result.pagination?.total_count).toBe(100);
	});

	it('rejects trending gifs without an api key', async () => {
		await expect(Gifs.trending(makeKeylessCtx(), {})).rejects.toThrow(
			AuthMissingError,
		);
	});

	it('translates a phrase into a gif', async () => {
		mockRequest.mockResolvedValue(singleResponse);
		const result = await Gifs.translate(makeCtx(), { s: 'cheeseburger' });
		expect(mockRequest).toHaveBeenCalledWith(
			'/gifs/translate',
			'test-api-key',
			{ query: expect.objectContaining({ s: 'cheeseburger' }) },
		);
		expect(result.data.id).toBe('3oEjI6SIIHBdRxXI40');
	});

	it('rejects gif translate without an api key', async () => {
		await expect(
			Gifs.translate(makeKeylessCtx(), { s: 'cheeseburger' }),
		).rejects.toThrow(AuthMissingError);
	});

	it('fetches a random gif by tag', async () => {
		mockRequest.mockResolvedValue(singleResponse);
		const result = await Gifs.random(makeCtx(), { tag: 'funny' });
		expect(mockRequest).toHaveBeenCalledWith('/gifs/random', 'test-api-key', {
			query: expect.objectContaining({ tag: 'funny' }),
		});
		expect(result.data.title).toBe('Funny Cat GIF');
	});

	it('rejects random gif without an api key', async () => {
		await expect(Gifs.random(makeKeylessCtx(), {})).rejects.toThrow(
			AuthMissingError,
		);
	});

	it('fetches a gif by id from the id-scoped path', async () => {
		mockRequest.mockResolvedValue(singleResponse);
		const result = await Gifs.getById(makeCtx(), { gif_id: 'abc123' });
		expect(mockRequest).toHaveBeenCalledWith(
			'/gifs/abc123',
			'test-api-key',
			expect.anything(),
		);
		expect(result.data.id).toBe('3oEjI6SIIHBdRxXI40');
	});

	it('rejects get-by-id without an api key', async () => {
		await expect(
			Gifs.getById(makeKeylessCtx(), { gif_id: 'abc123' }),
		).rejects.toThrow(AuthMissingError);
	});

	it('joins id arrays for get-by-ids', async () => {
		mockRequest.mockResolvedValue(listResponse);
		await Gifs.getByIds(makeCtx(), { ids: ['id1', 'id2'] });
		expect(mockRequest).toHaveBeenCalledWith('/gifs', 'test-api-key', {
			query: expect.objectContaining({ ids: 'id1,id2' }),
		});
	});

	it('passes through comma-separated id strings for get-by-ids', async () => {
		mockRequest.mockResolvedValue(listResponse);
		await Gifs.getByIds(makeCtx(), { ids: 'id1,id2' });
		expect(mockRequest).toHaveBeenCalledWith('/gifs', 'test-api-key', {
			query: expect.objectContaining({ ids: 'id1,id2' }),
		});
	});

	it('uploads a gif from a public URL via the upload host', async () => {
		mockRequest.mockResolvedValue({
			data: { id: 'new-gif-id' },
			meta: { status: 200, msg: 'OK' },
		});
		const result = await Gifs.upload(makeCtx(), {
			source_image_url: 'https://example.com/a.gif',
			tags: 'cat, funny',
		});
		expect(mockRequest).toHaveBeenCalledWith(
			'/gifs',
			'test-api-key',
			expect.objectContaining({ method: 'POST', base: 'upload' }),
		);
		expect(result.data.id).toBe('new-gif-id');
	});

	it('uploads a gif file as multipart form data', async () => {
		mockRequest.mockResolvedValue({
			data: { id: 'new-gif-id' },
			meta: { status: 200, msg: 'OK' },
		});
		const fileBase64 = Buffer.from('gif-bytes').toString('base64');
		await Gifs.upload(makeCtx(), {
			file_base64: fileBase64,
			file_name: 'cat.gif',
		});
		expect(mockRequest).toHaveBeenCalledWith(
			'/gifs',
			'test-api-key',
			expect.objectContaining({
				method: 'POST',
				base: 'upload',
				formData: expect.anything(),
			}),
		);
		const sentOptions = mockRequest.mock.calls[0]?.[2];
		expect(sentOptions?.formData?.file).toBeInstanceOf(File);
	});

	it('rejects uploads without an api key', async () => {
		await expect(
			Gifs.upload(makeKeylessCtx(), {
				source_image_url: 'https://example.com/a.gif',
			}),
		).rejects.toThrow(AuthMissingError);
	});
});

describe('Giphy sticker endpoints', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('searches stickers with the query term', async () => {
		mockRequest.mockResolvedValue(listResponse);
		const result = await Stickers.search(makeCtx(), { q: 'dog' });
		expect(mockRequest).toHaveBeenCalledWith(
			'/stickers/search',
			'test-api-key',
			{ query: expect.objectContaining({ q: 'dog' }) },
		);
		expect(result.data).toHaveLength(1);
	});

	it('rejects sticker search without an api key', async () => {
		await expect(
			Stickers.search(makeKeylessCtx(), { q: 'dog' }),
		).rejects.toThrow(AuthMissingError);
	});

	it('fetches trending stickers', async () => {
		mockRequest.mockResolvedValue(listResponse);
		const result = await Stickers.trending(makeCtx(), { limit: 3 });
		expect(mockRequest).toHaveBeenCalledWith(
			'/stickers/trending',
			'test-api-key',
			{ query: expect.objectContaining({ limit: 3 }) },
		);
		expect(result.data).toHaveLength(1);
	});

	it('translates a phrase into a sticker', async () => {
		mockRequest.mockResolvedValue(singleResponse);
		const result = await Stickers.translate(makeCtx(), { s: 'party' });
		expect(mockRequest).toHaveBeenCalledWith(
			'/stickers/translate',
			'test-api-key',
			{ query: expect.objectContaining({ s: 'party' }) },
		);
		expect(result.data.id).toBe('3oEjI6SIIHBdRxXI40');
	});

	it('fetches a random sticker by tag', async () => {
		mockRequest.mockResolvedValue(singleResponse);
		await Stickers.random(makeCtx(), { tag: 'dance' });
		expect(mockRequest).toHaveBeenCalledWith(
			'/stickers/random',
			'test-api-key',
			{ query: expect.objectContaining({ tag: 'dance' }) },
		);
	});

	it('rejects random sticker without an api key', async () => {
		await expect(Stickers.random(makeKeylessCtx(), {})).rejects.toThrow(
			AuthMissingError,
		);
	});
});

describe('Giphy emoji endpoints', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('fetches emoji from the v2 surface', async () => {
		mockRequest.mockResolvedValue(listResponse);
		const result = await Emoji.get(makeCtx(), { limit: 10 });
		expect(mockRequest).toHaveBeenCalledWith('/emoji', 'test-api-key', {
			query: expect.objectContaining({ limit: 10 }),
			base: 'v2',
		});
		expect(result.data).toHaveLength(1);
	});

	it('fetches emoji variations from the v2 surface', async () => {
		mockRequest.mockResolvedValue(listResponse);
		await Emoji.variations(makeCtx(), { gif_id: 'emoji_123' });
		expect(mockRequest).toHaveBeenCalledWith(
			'/emoji/emoji_123/variations',
			'test-api-key',
			expect.objectContaining({ base: 'v2' }),
		);
	});

	it('rejects emoji variations without an api key', async () => {
		await expect(
			Emoji.variations(makeKeylessCtx(), { gif_id: 'emoji_123' }),
		).rejects.toThrow(AuthMissingError);
	});
});

describe('Giphy categories endpoint', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('lists categories with subcategories', async () => {
		mockRequest.mockResolvedValue({
			data: [
				{
					name: 'actions',
					name_encoded: 'actions',
					subcategories: [{ name: 'applause', name_encoded: 'applause' }],
				},
			],
			meta: { status: 200, msg: 'OK' },
		});
		const result = await Categories.list(makeCtx(), {});
		expect(mockRequest).toHaveBeenCalledWith(
			'/gifs/categories',
			'test-api-key',
			expect.anything(),
		);
		expect(result.data).toHaveLength(1);
		expect(result.data[0]?.name).toBe('actions');
	});

	it('rejects category listing without an api key', async () => {
		await expect(Categories.list(makeKeylessCtx(), {})).rejects.toThrow(
			AuthMissingError,
		);
	});

	it('fetches a category by id with its subcategories', async () => {
		mockRequest.mockResolvedValue({
			data: [
				{
					name: 'applause',
					name_encoded: 'applause',
				},
			],
			meta: { status: 200, msg: 'OK' },
		});
		const result = await Categories.getById(makeCtx(), {
			category_id: 'actions',
		});
		expect(mockRequest).toHaveBeenCalledWith(
			'/gifs/categories/actions',
			'test-api-key',
			expect.anything(),
		);
		expect(result.data[0]?.name).toBe('applause');
	});

	it('rejects category get-by-id without an api key', async () => {
		await expect(
			Categories.getById(makeKeylessCtx(), { category_id: 'actions' }),
		).rejects.toThrow(AuthMissingError);
	});

	it('fetches gifs for a category with pagination', async () => {
		mockRequest.mockResolvedValue(listResponse);
		const result = await Categories.gifs(makeCtx(), {
			category_id: 'actions',
			limit: 2,
		});
		expect(mockRequest).toHaveBeenCalledWith(
			'/gifs/categories/actions/gifs',
			'test-api-key',
			{ query: expect.objectContaining({ limit: 2 }) },
		);
		expect(result.data).toHaveLength(1);
	});

	it('rejects category gifs without an api key', async () => {
		await expect(
			Categories.gifs(makeKeylessCtx(), { category_id: 'actions' }),
		).rejects.toThrow(AuthMissingError);
	});
});

describe('Giphy tag endpoints', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('autocompletes a tag term', async () => {
		mockRequest.mockResolvedValue({
			data: [{ name: 'cats' }, { name: 'cat birthday' }],
			meta: { status: 200, msg: 'OK' },
		});
		const result = await Tags.autocomplete(makeCtx(), { q: 'cat' });
		expect(mockRequest).toHaveBeenCalledWith(
			'/gifs/search/tags',
			'test-api-key',
			{ query: expect.objectContaining({ q: 'cat' }) },
		);
		expect(result.data.map((t) => t.name)).toEqual(['cats', 'cat birthday']);
	});

	it('rejects tag autocomplete without an api key', async () => {
		await expect(
			Tags.autocomplete(makeKeylessCtx(), { q: 'cat' }),
		).rejects.toThrow(AuthMissingError);
	});

	it('fetches trending search terms as strings', async () => {
		mockRequest.mockResolvedValue({
			data: ['cats', 'dogs'],
			meta: { status: 200, msg: 'OK' },
		});
		const result = await Tags.trending(makeCtx(), {});
		expect(mockRequest).toHaveBeenCalledWith(
			'/trending/searches',
			'test-api-key',
			expect.anything(),
		);
		expect(result.data).toEqual(['cats', 'dogs']);
	});

	it('fetches tags related to a term', async () => {
		mockRequest.mockResolvedValue({
			data: [{ name: 'funny cats' }],
			meta: { status: 200, msg: 'OK' },
		});
		const result = await Tags.related(makeCtx(), { term: 'cat' });
		expect(mockRequest).toHaveBeenCalledWith(
			'/tags/related/cat',
			'test-api-key',
			expect.anything(),
		);
		expect(result.data[0]?.name).toBe('funny cats');
	});

	it('encodes reserved characters in the related-tag path', async () => {
		mockRequest.mockResolvedValue({
			data: [{ name: 'funny cats' }],
			meta: { status: 200, msg: 'OK' },
		});
		await Tags.related(makeCtx(), { term: 'funny cats' });
		expect(mockRequest).toHaveBeenCalledWith(
			'/tags/related/funny%20cats',
			'test-api-key',
			expect.anything(),
		);
	});

	it('rejects related tags without an api key', async () => {
		await expect(
			Tags.related(makeKeylessCtx(), { term: 'cat' }),
		).rejects.toThrow(AuthMissingError);
	});
});

describe('Giphy channels endpoint', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('searches channels with the query term', async () => {
		mockRequest.mockResolvedValue({
			data: [
				{
					id: 1,
					slug: 'nba',
					display_name: 'NBA',
					content_type: 'gif',
				},
			],
			pagination: { total_count: 1, count: 1, offset: 0 },
			meta: { status: 200, msg: 'OK' },
		});
		const result = await Channels.search(makeCtx(), { q: 'nba' });
		expect(mockRequest).toHaveBeenCalledWith(
			'/channels/search',
			'test-api-key',
			{ query: expect.objectContaining({ q: 'nba' }) },
		);
		expect(result.data[0]?.display_name).toBe('NBA');
	});

	it('rejects channel search without an api key', async () => {
		await expect(
			Channels.search(makeKeylessCtx(), { q: 'nba' }),
		).rejects.toThrow(AuthMissingError);
	});
});

describe('Giphy random ID endpoint', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('generates a random id', async () => {
		mockRequest.mockResolvedValue({
			data: { random_id: 'e826c9fc5c929e0d6c6d423841a282aa' },
			meta: { status: 200, msg: 'OK' },
		});
		const result = await RandomId.get(makeCtx(), {});
		expect(mockRequest).toHaveBeenCalledWith('/randomid', 'test-api-key');
		expect(result.data.random_id).toBe('e826c9fc5c929e0d6c6d423841a282aa');
	});

	it('rejects random id without an api key', async () => {
		await expect(RandomId.get(makeKeylessCtx(), {})).rejects.toThrow(
			AuthMissingError,
		);
	});
});

describe('Giphy analytics endpoint', () => {
	beforeEach(() => {
		jest.clearAllMocks();
		mockAnalyticsRequest.mockResolvedValue(undefined);
	});

	it('registers an action against the pingback url', async () => {
		const result = await Analytics.register(makeCtx(), {
			pingback_url:
				'https://giphy-analytics.giphy.com/v2/pingback_simple?analytics_response_payload=abc&action_type=SEEN',
			customer_id: 'user-1',
			ts: 1700000000000,
		});
		expect(mockAnalyticsRequest).toHaveBeenCalledWith(
			expect.stringContaining('giphy-analytics.giphy.com'),
			{ customer_id: 'user-1', ts: 1700000000000 },
		);
		expect(result).toEqual({ success: true });
	});

	it('defaults the action timestamp to now', async () => {
		await Analytics.register(makeCtx(), {
			pingback_url:
				'https://giphy-analytics.giphy.com/v2/pingback_simple?analytics_response_payload=abc&action_type=CLICK',
			customer_id: 'user-1',
		});
		expect(mockAnalyticsRequest).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({
				customer_id: 'user-1',
				ts: expect.any(Number),
			}),
		);
	});
});
