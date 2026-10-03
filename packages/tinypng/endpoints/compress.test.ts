import type { TinypngContext } from '..';
import * as client from '../client';
import { TinypngAPIError } from '../client';
import { compress } from './compress';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeContext(key = 'test-api-key'): TinypngContext {
	return {
		key,
		authType: 'api_key',
	} as unknown as TinypngContext;
}

// ---------------------------------------------------------------------------
// Unit tests — compress endpoint
// ---------------------------------------------------------------------------

describe('compress endpoint', () => {
	let spy: jest.SpyInstance;

	beforeEach(() => {
		spy = jest.spyOn(client, 'compressImageFromUrl');
	});

	afterEach(() => {
		spy.mockRestore();
	});

	it('returns originalUrl and optimizedUrl on success', async () => {
		spy.mockResolvedValueOnce({
			url: 'https://tinypng.com/output/abc.png',
			size: 12345,
			type: 'image/png',
			width: 800,
			height: 600,
		});

		const result = await compress(makeContext('my-key'), {
			url: 'https://example.com/image.png',
		});

		expect(result.originalUrl).toBe('https://example.com/image.png');
		expect(result.optimizedUrl).toBe('https://tinypng.com/output/abc.png');
	});

	it('passes the API key from context to the client', async () => {
		spy.mockResolvedValueOnce({
			url: 'https://tinypng.com/output/xyz.png',
			size: 500,
			type: 'image/jpeg',
			width: 100,
			height: 100,
		});

		await compress(makeContext('secret-key-456'), {
			url: 'https://example.com/photo.jpg',
		});

		expect(spy).toHaveBeenCalledWith(
			'https://example.com/photo.jpg',
			'secret-key-456',
		);
	});

	it('propagates TinypngAPIError thrown by the client', async () => {
		spy.mockRejectedValueOnce(new TinypngAPIError('Too Many Requests', 429));

		await expect(
			compress(makeContext(), { url: 'https://example.com/img.png' }),
		).rejects.toThrow('Too Many Requests');
	});

	it('propagates generic errors thrown by the client', async () => {
		spy.mockRejectedValueOnce(new Error('Network error'));

		await expect(
			compress(makeContext(), { url: 'https://example.com/img.png' }),
		).rejects.toThrow('Network error');
	});
});
