import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';
import {
	AMARA_API_BASE,
	AmaraAPIError,
	encodeAmaraPathSegment,
	makeAmaraRequest,
} from './client';

jest.mock('corsair/http', () => {
	const actual = jest.requireActual('corsair/http');
	return { ...actual, request: jest.fn() };
});

const mockRequest = request as jest.MockedFunction<typeof request>;

function lastCall(): [OpenAPIConfig, ApiRequestOptions] {
	const call = mockRequest.mock.calls.at(-1);
	if (!call) throw new Error('request() was never called');
	return call as unknown as [OpenAPIConfig, ApiRequestOptions];
}

function apiError(status: number, retryAfter?: number): ApiError {
	return new ApiError(
		{ method: 'GET', url: 'videos/' },
		{
			url: `${AMARA_API_BASE}/videos/`,
			ok: false,
			status,
			statusText: 'Error',
			body: { detail: 'failed' },
		},
		'Amara request failed',
		{ retryAfter },
	);
}

beforeEach(() => {
	mockRequest.mockReset();
});

describe('makeAmaraRequest', () => {
	it('sends the API key in the X-api-key header and never as a bearer token', async () => {
		mockRequest.mockResolvedValue({ objects: [] });

		await makeAmaraRequest('videos/', 'secret-key', {
			query: { limit: 5 },
		});

		const [config] = lastCall();
		expect(config.BASE).toBe(AMARA_API_BASE);
		expect(config.HEADERS).toMatchObject({ 'X-api-key': 'secret-key' });
		expect(config.TOKEN).toBeUndefined();
	});

	it('issues GET with path and query parameters', async () => {
		mockRequest.mockResolvedValue({ objects: [] });

		await makeAmaraRequest('videos/', 'k', {
			query: { team: 'ability', limit: 10 },
		});

		const [, options] = lastCall();
		expect(options.method).toBe('GET');
		expect(options.url).toBe('videos/');
		expect(options.query).toEqual({ team: 'ability', limit: 10 });
	});

	it('issues POST with a JSON body', async () => {
		mockRequest.mockResolvedValue({ id: 'abc' });

		await makeAmaraRequest('videos/', 'k', {
			method: 'POST',
			body: { video_url: 'https://example.com/v.mp4', title: 'Hi' },
		});

		const [, options] = lastCall();
		expect(options.method).toBe('POST');
		expect(options.body).toEqual({
			video_url: 'https://example.com/v.mp4',
			title: 'Hi',
		});
	});

	it('normalises an empty DELETE body to { ok: true }', async () => {
		mockRequest.mockResolvedValue(undefined);

		const result = await makeAmaraRequest('videos/x/urls/1/', 'k', {
			method: 'DELETE',
		});

		expect(result).toEqual({ ok: true });
	});

	it('wraps an ApiError in AmaraAPIError, preserving status and cause', async () => {
		expect.assertions(4);
		const original = apiError(429, 1500);
		mockRequest.mockRejectedValue(original);

		try {
			await makeAmaraRequest('videos/', 'k');
			throw new Error('expected makeAmaraRequest to throw');
		} catch (error) {
			const amaraError = error as AmaraAPIError;
			expect(amaraError.status).toBe(429);
			expect(amaraError.code).toBe(429);
			expect(amaraError.retryAfter).toBe(1500);
			expect(amaraError.cause).toBe(original);
		}
	});

	it('wraps a non-ApiError failure without inventing a status', async () => {
		mockRequest.mockRejectedValue(new Error('socket hang up'));

		try {
			await makeAmaraRequest('videos/', 'k');
			throw new Error('expected makeAmaraRequest to throw');
		} catch (error) {
			const amaraError = error as AmaraAPIError;
			expect(amaraError).toBeInstanceOf(AmaraAPIError);
			expect(amaraError.message).toBe('socket hang up');
			expect(amaraError.status).toBeUndefined();
		}
	});
});

describe('AMARA_API_BASE', () => {
	it('points at the official Amara API host', () => {
		expect(AMARA_API_BASE).toBe('https://amara.org/api');
	});
});

describe('encodeAmaraPathSegment', () => {
	it('keeps id$ user identifiers literal while encoding unsafe chars', () => {
		expect(encodeAmaraPathSegment('id$abc_123')).toBe('id$abc_123');
		expect(encodeAmaraPathSegment('a/b')).toBe('a%2Fb');
	});
});
