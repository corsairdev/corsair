import { ApiError, request } from 'corsair/http';
import {
	BUNNYCDN_API_BASES,
	BunnycdnAPIError,
	makeBunnycdnRequest,
} from './client';
import type {
	BunnycdnKeyBuilderContext,
	InternalBunnycdnPlugin,
} from './index';
import { bunnycdn } from './index';

jest.mock('corsair/http', () => {
	const original = jest.requireActual('corsair/http');
	return {
		...original,
		request: jest.fn(),
	};
});

const mockRequest = request as jest.Mock;

beforeEach(() => {
	mockRequest.mockReset();
	mockRequest.mockResolvedValue({ ok: true });
});

describe('makeBunnycdnRequest', () => {
	it('sends the API key as an AccessKey header on the core base by default', async () => {
		await makeBunnycdnRequest('/pullzone', 'secret-key', { method: 'GET' });

		expect(mockRequest).toHaveBeenCalledTimes(1);
		const [config, options] = mockRequest.mock.calls[0] as [
			{ BASE: string; HEADERS: Record<string, string> },
			{ method: string; url: string; mediaType: string },
		];
		expect(config.BASE).toBe('https://api.bunny.net');
		expect(config.BASE).toBe(BUNNYCDN_API_BASES.core);
		// BunnyCDN authenticates via AccessKey only: no Bearer TOKEN allowed.
		expect(config).not.toHaveProperty('TOKEN');
		expect(config.HEADERS.AccessKey).toBe('secret-key');
		expect(config.HEADERS['Content-Type']).toBe('application/json');
		expect(options.method).toBe('GET');
		expect(options.url).toBe('/pullzone');
		expect(options.mediaType).toBe('application/json; charset=utf-8');
	});

	it('selects the documented base URL per API family', async () => {
		const cases = [
			['core', 'https://api.bunny.net'],
			['shield', 'https://api.bunny.net/shield'],
			['compute', 'https://api.bunny.net/compute'],
			['mc', 'https://api.bunny.net/mc'],
			['stream', 'https://video.bunnycdn.com'],
		] as const;
		for (const [index, [base, url]] of cases.entries()) {
			await makeBunnycdnRequest('/ping', 'k', { base });
			expect(mockRequest.mock.calls[index]?.[0].BASE).toBe(url);
		}
		expect(mockRequest).toHaveBeenCalledTimes(cases.length);
	});

	it('forwards query params on GET and body on POST', async () => {
		await makeBunnycdnRequest('/pullzone', 'k', {
			method: 'GET',
			query: { page: 2, perPage: 50 },
		});
		expect(mockRequest).toHaveBeenLastCalledWith(
			expect.anything(),
			expect.objectContaining({
				query: { page: 2, perPage: 50 },
				body: undefined,
			}),
		);

		await makeBunnycdnRequest('/pullzone', 'k', {
			method: 'POST',
			body: { Name: 'my-zone' },
		});
		expect(mockRequest).toHaveBeenLastCalledWith(
			expect.anything(),
			expect.objectContaining({
				method: 'POST',
				body: { Name: 'my-zone' },
			}),
		);
	});

	it('forwards query params on POST for endpoints like purge-by-url', async () => {
		await makeBunnycdnRequest('/purge', 'k', {
			method: 'POST',
			query: { url: 'https://cdn.example.com/app.js' },
		});
		expect(mockRequest).toHaveBeenLastCalledWith(
			expect.anything(),
			expect.objectContaining({
				query: { url: 'https://cdn.example.com/app.js' },
			}),
		);
	});

	it('resolves undefined for 204 No Content responses', async () => {
		mockRequest.mockResolvedValue(undefined);
		const result = await makeBunnycdnRequest('/pullzone/1', 'k', {
			method: 'DELETE',
		});
		expect(result).toBeUndefined();
	});

	it('rethrows errors carrying a status unchanged', async () => {
		const apiError = new ApiError(
			{ method: 'GET', url: '/pullzone' },
			{
				url: 'https://api.bunny.net/pullzone',
				ok: false,
				status: 401,
				statusText: 'Unauthorized',
				body: {},
			},
			'Unauthorized',
		);
		mockRequest.mockRejectedValue(apiError);
		await expect(makeBunnycdnRequest('/pullzone', 'k')).rejects.toBe(apiError);
	});

	it('wraps generic errors in BunnycdnAPIError', async () => {
		mockRequest.mockRejectedValue(new Error('socket hang up'));
		const error = await makeBunnycdnRequest('/pullzone', 'k').catch(
			(error: unknown) => error,
		);
		expect(error).toBeInstanceOf(BunnycdnAPIError);
		expect((error as Error).message).toContain('socket hang up');
	});

	it('wraps unknown rejections in BunnycdnAPIError', async () => {
		mockRequest.mockRejectedValue('plain-string-failure');
		const error = await makeBunnycdnRequest('/pullzone', 'k').catch(
			(error: unknown) => error,
		);
		expect(error).toBeInstanceOf(BunnycdnAPIError);
		expect((error as Error).message).toBe('Unknown error');
	});
});

describe('bunnycdn keyBuilder', () => {
	const plugin: InternalBunnycdnPlugin = bunnycdn({});

	it('prefers the key passed in plugin options', async () => {
		const withKey: InternalBunnycdnPlugin = bunnycdn({ key: 'option-key' });
		const ctx = {
			authType: 'api_key',
			keys: { get_api_key: async () => 'stored-key' },
		} as unknown as BunnycdnKeyBuilderContext;
		await expect(withKey.keyBuilder!(ctx, 'endpoint')).resolves.toBe(
			'option-key',
		);
	});

	it('falls back to the stored api key', async () => {
		const ctx = {
			authType: 'api_key',
			keys: { get_api_key: async () => 'stored-key' },
		} as unknown as BunnycdnKeyBuilderContext;
		await expect(plugin.keyBuilder!(ctx, 'endpoint')).resolves.toBe(
			'stored-key',
		);
	});

	it('returns an empty string when no key is available', async () => {
		const ctx = {
			authType: 'api_key',
			keys: { get_api_key: async () => null },
		} as unknown as BunnycdnKeyBuilderContext;
		await expect(plugin.keyBuilder!(ctx, 'endpoint')).resolves.toBe('');
	});

	it('returns an empty string for non-endpoint sources', async () => {
		const ctx = {
			authType: 'api_key',
			keys: { get_api_key: async () => 'stored-key' },
		} as unknown as BunnycdnKeyBuilderContext;
		await expect(plugin.keyBuilder!(ctx, 'webhook')).resolves.toBe('');
	});
});
