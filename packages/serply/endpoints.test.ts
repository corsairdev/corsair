import { AuthMissingError, logEventFromContext } from 'corsair/core';
import { ApiError, request } from 'corsair/http';
import type { SerplyContext } from './context';
import { searchArticles, searchImages, searchPlaces } from './endpoints/search';

jest.mock('corsair/core', () => {
	const actual = jest.requireActual('corsair/core');
	return {
		...actual,
		logEventFromContext: jest.fn().mockResolvedValue(undefined),
	};
});
jest.mock('corsair/http', () => {
	const actual = jest.requireActual('corsair/http');
	return { ...actual, request: jest.fn() };
});

const mockRequest = jest.mocked(request);
const mockLog = jest.mocked(logEventFromContext);

function context(key: string, db?: SerplyContext['db']): SerplyContext {
	return { key, db } as unknown as SerplyContext;
}

describe('serply searches', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('stores an image by its original URL and omits the query from the event', async () => {
		const upsert = jest.fn().mockResolvedValue(undefined);
		mockRequest.mockResolvedValue({
			image_results: [
				{
					image: { src: 'https://img.example/t.png', alt: 'Bike' },
					link: {
						href: 'https://shop.example/bike',
						title: 'Bike',
						domain: 'shop.example',
					},
					original_image: {
						src: 'https://shop.example/bike.png',
						width: '100',
						height: '80',
					},
				},
				{ image: { src: 'https://img.example/no-link.png' } },
			],
			query: 'q=secret-query',
		});
		const result = await searchImages(
			context('sekrit', {
				images: { upsertByEntityId: upsert },
			} as unknown as SerplyContext['db']),
			{ q: 'secret-query', num: 5 },
		);
		expect(result.images).toEqual([
			{
				id: 'https://shop.example/bike.png',
				src: 'https://img.example/t.png',
				alt: 'Bike',
				title: 'Bike',
				domain: 'shop.example',
				originalSrc: 'https://shop.example/bike.png',
				width: '100',
				height: '80',
			},
			// No page link: keyed by the thumbnail instead of being dropped.
			{
				id: 'https://img.example/no-link.png',
				src: 'https://img.example/no-link.png',
			},
		]);
		expect(upsert).toHaveBeenCalledWith(
			'https://shop.example/bike.png',
			result.images[0],
		);
		expect(mockLog.mock.calls[0]?.[2]).toEqual({ count: 2 });
		expect(JSON.stringify(mockLog.mock.calls[0]?.[2])).not.toContain(
			'secret-query',
		);
		expect(JSON.stringify(mockLog.mock.calls[0]?.[2])).not.toContain('sekrit');
		const config = mockRequest.mock.calls[0]?.[0];
		expect(config?.BASE).toBe('https://api.serply.io');
		expect(config?.TOKEN).toBeUndefined();
		expect(config?.HEADERS).toEqual(
			expect.objectContaining({ 'X-Api-Key': 'sekrit' }),
		);
		expect(mockRequest.mock.calls[0]?.[1]).toMatchObject({
			method: 'GET',
			url: '/v1/image?q=secret-query&num=5',
		});
	});

	it('stores a place by place_id and drops the phone', async () => {
		const upsert = jest.fn().mockResolvedValue(undefined);
		mockRequest.mockResolvedValue({
			places: [
				{
					place_id: 'pid',
					data_id: 'did',
					name: 'Shop',
					latitude: 1.5,
					longitude: 2.5,
					rating: 4.2,
					address: '1 Main',
					phone: '+1-555-0100',
				},
				{ name: 'No id' },
			],
		});
		const result = await searchPlaces(
			context('sekrit', {
				places: { upsertByEntityId: upsert },
			} as unknown as SerplyContext['db']),
			{ q: 'cafe' },
		);
		expect(result.places).toEqual([
			{
				id: 'pid',
				name: 'Shop',
				latitude: 1.5,
				longitude: 2.5,
				rating: 4.2,
				address: '1 Main',
			},
		]);
		expect(JSON.stringify(upsert.mock.calls)).not.toContain('555');
		expect(mockRequest.mock.calls[0]?.[1]).toMatchObject({
			url: '/v1/maps/search/cafe',
		});
	});

	it('stores a scholar article without the author byline', async () => {
		mockRequest.mockResolvedValue({
			articles: [
				{
					id: 'W1',
					title: 'Paper',
					link: 'https://example.edu/paper',
					description: 'Ada Lovelace, 1843',
					author: { names: 'Ada Lovelace' },
				},
			],
		});
		const result = await searchArticles(context('sekrit'), { q: 'engines' });
		expect(result.articles).toEqual([
			{ id: 'W1', title: 'Paper', link: 'https://example.edu/paper' },
		]);
		expect(JSON.stringify(result.articles)).not.toContain('Lovelace');
		expect(mockLog.mock.calls[0]?.[2]).toEqual({ count: 1 });
	});

	it('rejects an empty query before calling the API', async () => {
		await expect(searchImages(context('sekrit'), { q: '' })).rejects.toThrow();
		expect(mockRequest).not.toHaveBeenCalled();
	});

	it('throws when the key is missing', async () => {
		await expect(
			searchPlaces(context(''), { q: 'cafe' }),
		).rejects.toBeInstanceOf(AuthMissingError);
		expect(mockRequest).not.toHaveBeenCalled();
	});

	it('lets an HTTP 401 through unchanged', async () => {
		const error = new ApiError(
			{ method: 'GET', url: '/v1/scholar' },
			{
				url: 'https://api.serply.io/v1/scholar',
				ok: false,
				status: 401,
				statusText: 'Unauthorized',
				body: { detail: 'API key missing' },
			},
			'API key missing',
		);
		mockRequest.mockRejectedValue(error);
		await expect(searchArticles(context('sekrit'), { q: 'test' })).rejects.toBe(
			error,
		);
	});

	it('returns images when the database write fails', async () => {
		mockRequest.mockResolvedValue({
			image_results: [{ link: { href: 'https://shop.example/bike' } }],
		});
		const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
		const result = await searchImages(
			context('sekrit', {
				images: {
					upsertByEntityId: jest.fn().mockRejectedValue(new Error('db')),
				},
			} as unknown as SerplyContext['db']),
			{ q: 'bike' },
		);
		expect(result.images).toHaveLength(1);
		expect(warn).toHaveBeenCalledWith('Failed to save Serply image');
		warn.mockRestore();
	});
});
