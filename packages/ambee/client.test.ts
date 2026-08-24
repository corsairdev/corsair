import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';
import {
	AMBEE_API_BASE,
	AmbeeAPIError,
	makeAmbeeRequest,
	toAmbeeTimestamp,
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
		{ method: 'GET', url: 'latest/by-lat-lng' },
		{
			url: `${AMBEE_API_BASE}/latest/by-lat-lng`,
			ok: false,
			status,
			statusText: 'Error',
			body: { message: 'failed' },
		},
		'Ambee request failed',
		{ retryAfter },
	);
}

beforeEach(() => {
	mockRequest.mockReset();
});

describe('makeAmbeeRequest', () => {
	it('sends the API key in the x-api-key header and never as a bearer token', async () => {
		mockRequest.mockResolvedValue({ message: 'success' });

		await makeAmbeeRequest('latest/by-lat-lng', 'secret-key', {
			query: { lat: 12.99, lng: 77.57 },
		});

		const [config] = lastCall();
		expect(config.BASE).toBe(AMBEE_API_BASE);
		expect(config.HEADERS).toMatchObject({ 'x-api-key': 'secret-key' });
		// Setting TOKEN would make the request layer add an Authorization
		// header, which Ambee does not accept.
		expect(config.TOKEN).toBeUndefined();
	});

	it('issues a GET with the endpoint path and query parameters', async () => {
		mockRequest.mockResolvedValue({ message: 'success' });

		await makeAmbeeRequest('v3/pollen/forecast/48hrs', 'k', {
			query: { place: 'Barcelona', speciesRisk: true },
		});

		const [, options] = lastCall();
		expect(options.method).toBe('GET');
		expect(options.url).toBe('v3/pollen/forecast/48hrs');
		expect(options.query).toEqual({ place: 'Barcelona', speciesRisk: true });
	});

	it('returns the parsed body on success', async () => {
		mockRequest.mockResolvedValue({ message: 'success', stations: [] });

		const result = await makeAmbeeRequest('latest/by-city', 'k', {
			query: { city: 'Bengaluru' },
		});

		expect(result).toEqual({ message: 'success', stations: [] });
	});

	it('wraps an ApiError in AmbeeAPIError, preserving status and cause', async () => {
		expect.assertions(5);
		const original = apiError(429, 1500);
		mockRequest.mockRejectedValue(original);

		await expect(makeAmbeeRequest('latest/by-city', 'k')).rejects.toThrow(
			AmbeeAPIError,
		);

		try {
			await makeAmbeeRequest('latest/by-city', 'k');
		} catch (error) {
			const ambeeError = error as AmbeeAPIError;
			expect(ambeeError.status).toBe(429);
			expect(ambeeError.code).toBe(429);
			expect(ambeeError.retryAfter).toBe(1500);
			expect(ambeeError.cause).toBe(original);
		}
	});

	it('wraps a non-ApiError failure without inventing a status', async () => {
		mockRequest.mockRejectedValue(new Error('socket hang up'));

		try {
			await makeAmbeeRequest('latest/by-city', 'k');
			throw new Error('expected makeAmbeeRequest to throw');
		} catch (error) {
			const ambeeError = error as AmbeeAPIError;
			expect(ambeeError).toBeInstanceOf(AmbeeAPIError);
			expect(ambeeError.message).toBe('socket hang up');
			expect(ambeeError.status).toBeUndefined();
		}
	});
});

describe('toAmbeeTimestamp', () => {
	it('passes an already-formatted Ambee timestamp through unchanged', () => {
		expect(toAmbeeTimestamp('2026-07-13 12:16:44')).toBe('2026-07-13 12:16:44');
	});

	it('converts an ISO 8601 timestamp to Ambee’s space-separated UTC format', () => {
		expect(toAmbeeTimestamp('2026-07-13T12:16:44.000Z')).toBe(
			'2026-07-13 12:16:44',
		);
	});

	it('normalises an offset timestamp to UTC', () => {
		expect(toAmbeeTimestamp('2026-07-13T12:16:44+02:00')).toBe(
			'2026-07-13 10:16:44',
		);
	});

	it('throws AmbeeAPIError on an unparseable value', () => {
		expect(() => toAmbeeTimestamp('yesterday')).toThrow(AmbeeAPIError);
	});
});
