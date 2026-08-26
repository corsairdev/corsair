import { logEventFromContext } from 'corsair/core';
import { makeAutomRequest } from './client';
import { Google } from './endpoints';

jest.mock('corsair/core', () => ({
	logEventFromContext: jest.fn().mockResolvedValue(undefined),
}));

jest.mock('./client', () => {
	class AutomAPIError extends Error {
		constructor(
			message: string,
			public code?: string,
		) {
			super(message);
			this.name = 'AutomAPIError';
		}
	}
	return {
		makeAutomRequest: jest.fn(),
		AutomAPIError,
	};
});

const mockRequest = jest.mocked(makeAutomRequest);
const mockLog = jest.mocked(logEventFromContext);

function createContext() {
	return {
		key: 'test-api-key',
		options: {
			authType: 'api_key' as const,
		},
	} as never;
}

describe('Autom endpoint behavior', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('googleCountries queries /v1/finder/google-countries', async () => {
		const mockResponse = [
			{ country_code: 'US', country_name: 'United States' },
		];
		mockRequest.mockResolvedValueOnce(mockResponse);

		const ctx = createContext();
		const result = await Google.countries(ctx, { query: 'united' });

		expect(mockRequest).toHaveBeenCalledWith(
			'/v1/finder/google-countries',
			'test-api-key',
			{
				method: 'GET',
				query: { query: 'united' },
			},
		);
		expect(mockLog).toHaveBeenCalledWith(
			ctx,
			'autom.google.countries',
			{ query: 'united' },
			'completed',
		);
		expect(result).toEqual(mockResponse);
	});

	it('googleLanguages queries /v1/finder/google-languages', async () => {
		const mockResponse = [{ language_code: 'en', language_name: 'English' }];
		mockRequest.mockResolvedValueOnce(mockResponse);

		const ctx = createContext();
		const result = await Google.languages(ctx, { query: 'eng' });

		expect(mockRequest).toHaveBeenCalledWith(
			'/v1/finder/google-languages',
			'test-api-key',
			{
				method: 'GET',
				query: { query: 'eng' },
			},
		);
		expect(mockLog).toHaveBeenCalledWith(
			ctx,
			'autom.google.languages',
			{ query: 'eng' },
			'completed',
		);
		expect(result).toEqual(mockResponse);
	});

	it('googleLocations queries /v1/finder/google-locations', async () => {
		const mockResponse = [
			{
				id: 'loc-1',
				gps: [-122.4194, 37.7749],
				name: 'San Francisco',
				reach: 800000,
				google_id: 1234,
				target_type: 'city',
				country_code: 'US',
				canonical_name: 'San Francisco,California,United States',
			},
		];
		mockRequest.mockResolvedValueOnce(mockResponse);

		const ctx = createContext();
		const result = await Google.locations(ctx, { query: 'san francisco' });

		expect(mockRequest).toHaveBeenCalledWith(
			'/v1/finder/google-locations',
			'test-api-key',
			{
				method: 'GET',
				query: { query: 'san francisco' },
			},
		);
		expect(mockLog).toHaveBeenCalledWith(
			ctx,
			'autom.google.locations',
			{ query: 'san francisco' },
			'completed',
		);
		expect(result).toEqual(mockResponse);
	});

	it('googleImages queries /v1/google/images', async () => {
		const mockResponse = {
			images: [
				{
					url: 'https://example.com/lion.jpg',
					link: 'https://example.com/lion',
					title: 'Lion',
					domain: 'example.com',
					source: 'Example',
					position: 1,
					image_width: 800,
					image_height: 600,
				},
			],
			search_parameters: {
				q: 'lion',
				gl: 'us',
				hl: 'en',
				page: 1,
				engine: 'google',
			},
		};
		mockRequest.mockResolvedValueOnce(mockResponse);

		const ctx = createContext();
		const result = await Google.images(ctx, {
			query: 'lion',
			page: 1,
			gl: 'us',
			hl: 'en',
		});

		expect(mockRequest).toHaveBeenCalledWith(
			'/v1/google/images',
			'test-api-key',
			{
				method: 'GET',
				query: {
					query: 'lion',
					page: 1,
					gl: 'us',
					hl: 'en',
				},
			},
		);
		expect(mockLog).toHaveBeenCalledWith(
			ctx,
			'autom.google.images',
			{ query: 'lion' },
			'completed',
		);
		expect(result).toEqual(mockResponse);
	});

	it('rejects an empty or whitespace query before calling the API', async () => {
		const ctx = createContext();

		await expect(Google.countries(ctx, { query: '' })).rejects.toThrow();
		await expect(Google.countries(ctx, { query: '   ' })).rejects.toThrow();
		await expect(Google.images(ctx, { query: '', page: 1 })).rejects.toThrow();
		expect(mockRequest).not.toHaveBeenCalled();
		expect(mockLog).not.toHaveBeenCalled();
	});

	it('rejects a non-positive page before calling the API', async () => {
		const ctx = createContext();

		await expect(
			Google.images(ctx, { query: 'lion', page: 0 }),
		).rejects.toThrow();
		await expect(
			Google.images(ctx, { query: 'lion', page: -1 }),
		).rejects.toThrow();
		expect(mockRequest).not.toHaveBeenCalled();
	});

	it('does not log completed when the response fails output validation', async () => {
		mockRequest.mockResolvedValueOnce({ not: 'an image payload' });
		const ctx = createContext();

		await expect(Google.images(ctx, { query: 'lion' })).rejects.toThrow();
		expect(mockLog).not.toHaveBeenCalled();
	});
});
