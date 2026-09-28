import { ApiError, request } from 'corsair/http';
import {
	GIPHY_ANALYTICS_HOST,
	GIPHY_API_BASE,
	GIPHY_API_V2_BASE,
	GIPHY_UPLOAD_BASE,
	GiphyAPIError,
	makeGiphyAnalyticsRequest,
	makeGiphyRequest,
} from './client';

jest.mock('corsair/http', () => {
	const original = jest.requireActual('corsair/http');
	return {
		...original,
		request: jest.fn(),
	};
});

const mockRequest = jest.mocked(request);

function apiError(status: number, message: string): ApiError {
	return new ApiError(
		{ method: 'GET', url: '/gifs/search' },
		{
			url: 'https://api.giphy.com/v1/gifs/search',
			ok: false,
			status,
			statusText: message,
			body: { message },
		},
		message,
	);
}

describe('Giphy API client', () => {
	beforeEach(() => {
		jest.clearAllMocks();
		mockRequest.mockResolvedValue({ ok: true });
	});

	it('injects the api key into the query string', async () => {
		await makeGiphyRequest('/gifs/search', 'secret-key', {
			query: { q: 'cats' },
		});

		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({ BASE: GIPHY_API_BASE }),
			expect.objectContaining({
				method: 'GET',
				url: '/gifs/search',
				query: { q: 'cats', api_key: 'secret-key' },
			}),
		);
	});

	it('targets the v2 base when requested (emoji surface)', async () => {
		await makeGiphyRequest('/emoji', 'secret-key', { base: 'v2' });

		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({ BASE: GIPHY_API_V2_BASE }),
			expect.objectContaining({ url: '/emoji' }),
		);
	});

	it('targets the upload host when requested', async () => {
		await makeGiphyRequest('/gifs', 'secret-key', {
			method: 'POST',
			base: 'upload',
			query: { source_image_url: 'https://example.com/a.gif' },
		});

		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({ BASE: GIPHY_UPLOAD_BASE }),
			expect.objectContaining({ method: 'POST', url: '/gifs' }),
		);
	});

	it('sends JSON bodies with a JSON media type', async () => {
		await makeGiphyRequest('/gifs', 'secret-key', {
			method: 'POST',
			body: { username: 'joe' },
		});

		expect(mockRequest).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({
				body: { username: 'joe' },
				mediaType: 'application/json; charset=utf-8',
			}),
		);
	});

	it('sends multipart uploads without a JSON body or media type', async () => {
		const file = new File(['gif-bytes'], 'upload.gif');
		await makeGiphyRequest('/gifs', 'secret-key', {
			method: 'POST',
			base: 'upload',
			formData: { file },
		});

		expect(mockRequest).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({
				method: 'POST',
				url: '/gifs',
				formData: { file },
			}),
		);
		const sentOptions = mockRequest.mock.calls[0]?.[1];
		expect(sentOptions).not.toHaveProperty('body');
		expect(sentOptions).not.toHaveProperty('mediaType');
	});

	it('wraps transport errors preserving status metadata', async () => {
		mockRequest.mockRejectedValue(apiError(429, 'Rate limit'));
		const caught = await makeGiphyRequest('/gifs/search', 'k').then(
			() => null,
			// `unknown`: promise rejections carry no static type; narrowed
			// with `instanceof` in the assertion below, never cast.
			(error: unknown) => error,
		);
		expect(caught).toBeInstanceOf(GiphyAPIError);
		if (caught instanceof GiphyAPIError) {
			expect(caught.status).toBe(429);
			expect(caught.message).toBe('Rate limit');
		}
	});

	it('wraps plain errors by message', async () => {
		mockRequest.mockRejectedValue(new Error('socket hang up'));
		await expect(makeGiphyRequest('/gifs/search', 'k')).rejects.toThrow(
			'socket hang up',
		);
	});

	it('wraps non-error rejections as an unknown error', async () => {
		mockRequest.mockRejectedValue('boom');
		await expect(makeGiphyRequest('/gifs/search', 'k')).rejects.toThrow(
			'Unknown error',
		);
	});

	it('splits an analytics pingback into origin, path, and merged query', async () => {
		const pingback =
			`https://${GIPHY_ANALYTICS_HOST}/v2/pingback_simple` +
			'?analytics_response_payload=abc&action_type=SEEN';
		await makeGiphyAnalyticsRequest(pingback, {
			customer_id: 'user-1',
			ts: 1700000000000,
		});

		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({ BASE: `https://${GIPHY_ANALYTICS_HOST}` }),
			expect.objectContaining({
				method: 'GET',
				url: '/v2/pingback_simple',
				query: {
					analytics_response_payload: 'abc',
					action_type: 'SEEN',
					ts: 1700000000000,
					customer_id: 'user-1',
				},
			}),
		);
	});

	it('rejects analytics URLs outside the GIPHY analytics host', async () => {
		await expect(
			makeGiphyAnalyticsRequest('https://example.com/ping', {
				customer_id: 'user-1',
				ts: 1700000000000,
			}),
		).rejects.toThrow(GiphyAPIError);
		expect(mockRequest).not.toHaveBeenCalled();
	});

	it('rejects plaintext HTTP analytics URLs on the allow-listed host', async () => {
		await expect(
			makeGiphyAnalyticsRequest(
				`http://${GIPHY_ANALYTICS_HOST}/v2/pingback_simple?analytics_response_payload=abc&action_type=SEEN`,
				{
					customer_id: 'user-1',
					ts: 1700000000000,
				},
			),
		).rejects.toThrow(GiphyAPIError);
		expect(mockRequest).not.toHaveBeenCalled();
	});

	it('rejects malformed analytics URLs without a network call', async () => {
		await expect(
			makeGiphyAnalyticsRequest('not a url', {
				customer_id: 'user-1',
				ts: 1700000000000,
			}),
		).rejects.toThrow('Invalid analytics pingback URL');
		expect(mockRequest).not.toHaveBeenCalled();
	});
});
