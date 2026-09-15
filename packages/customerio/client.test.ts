import { ApiError, request } from 'corsair/http';
import {
	CUSTOMERIO_APP_BASE,
	CUSTOMERIO_APP_BASE_EU,
	CUSTOMERIO_CDP_BASE,
	CUSTOMERIO_CDP_BASE_EU,
	CUSTOMERIO_TRACK_BASE,
	CUSTOMERIO_TRACK_BASE_EU,
	CustomerioAPIError,
	makeAppRequest,
	makeCdpRequest,
	makeTrackRequest,
} from './client';

jest.mock('corsair/http', () => ({
	...jest.requireActual('corsair/http'),
	request: jest.fn(),
}));

const mockRequest = jest.mocked(request);

beforeEach(() => {
	mockRequest.mockReset();
});

describe('makeAppRequest', () => {
	it('sends Bearer auth against the App API base URL', async () => {
		mockRequest.mockResolvedValue({ segments: [] });
		await makeAppRequest('/v1/segments', 'app-key-123', { method: 'GET' });
		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({
				BASE: CUSTOMERIO_APP_BASE,
				HEADERS: expect.objectContaining({
					Authorization: 'Bearer app-key-123',
				}),
			}),
			expect.objectContaining({ method: 'GET', url: '/v1/segments' }),
			expect.anything(),
		);
	});

	it('forwards pagination query params on GET and bodies on POST', async () => {
		mockRequest.mockResolvedValue({ messages: [] });
		await makeAppRequest('/v1/messages', 'k', {
			method: 'GET',
			query: { limit: 10, start: 'cursor' },
		});
		expect(mockRequest).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({
				method: 'GET',
				query: { limit: 10, start: 'cursor' },
			}),
			expect.anything(),
		);

		mockRequest.mockClear();
		mockRequest.mockResolvedValue({ id: 1 });
		await makeAppRequest('/v1/campaigns/1/triggers', 'k', {
			method: 'POST',
			body: { data: { plan: 'pro' } },
		});
		expect(mockRequest).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({
				method: 'POST',
				url: '/v1/campaigns/1/triggers',
				body: { data: { plan: 'pro' } },
			}),
			expect.anything(),
		);
	});
});

describe('makeTrackRequest', () => {
	it('sends Basic auth with base64 siteId:apiKey credentials', async () => {
		mockRequest.mockResolvedValue({});
		await makeTrackRequest('/api/v1/customers/u_1', 'site_1:key_1', {
			method: 'PUT',
			body: { email: 'a@example.com' },
		});
		const expected = Buffer.from('site_1:key_1', 'utf-8').toString('base64');
		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({
				BASE: CUSTOMERIO_TRACK_BASE,
				HEADERS: expect.objectContaining({
					Authorization: `Basic ${expected}`,
				}),
			}),
			expect.objectContaining({
				method: 'PUT',
				url: '/api/v1/customers/u_1',
			}),
			expect.anything(),
		);
	});

	it('supports host-root paths such as unsubscribe', async () => {
		mockRequest.mockResolvedValue({});
		await makeTrackRequest('/unsubscribe/delivery_1', 'site:key', {
			method: 'POST',
			body: { unsubscribe: true },
		});
		expect(mockRequest).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({
				method: 'POST',
				url: '/unsubscribe/delivery_1',
			}),
			expect.anything(),
		);
	});
});

describe('makeCdpRequest', () => {
	it('sends Basic auth and strict-mode validation against the CDP base URL', async () => {
		mockRequest.mockResolvedValue({});
		await makeCdpRequest('/v1/page', 'write-key-9', {
			method: 'POST',
			body: { anonymousId: 'a_1', name: 'Home' },
		});
		const expected = Buffer.from('write-key-9:', 'utf-8').toString('base64');
		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({
				BASE: CUSTOMERIO_CDP_BASE,
				HEADERS: expect.objectContaining({
					Authorization: `Basic ${expected}`,
					// Strict mode turns silent server-side logging into real
					// 400/401 responses; without it failures look like success.
					'X-Strict-Mode': '1',
				}),
			}),
			expect.objectContaining({ method: 'POST', url: '/v1/page' }),
			expect.anything(),
		);
	});
});

describe('regional base URLs', () => {
	it('routes App requests to the EU base when region is eu', async () => {
		mockRequest.mockResolvedValue({ segments: [] });
		await makeAppRequest('/v1/segments', 'app-key-123', {
			method: 'GET',
			region: 'eu',
		});
		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({ BASE: CUSTOMERIO_APP_BASE_EU }),
			expect.anything(),
			expect.anything(),
		);
	});

	it('routes Track requests to the EU base when region is eu', async () => {
		mockRequest.mockResolvedValue({});
		await makeTrackRequest('/api/v1/customers/u_1', 'site:key', {
			method: 'PUT',
			body: {},
			region: 'eu',
		});
		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({ BASE: CUSTOMERIO_TRACK_BASE_EU }),
			expect.anything(),
			expect.anything(),
		);
	});

	it('routes CDP requests to the EU base when region is eu', async () => {
		mockRequest.mockResolvedValue({});
		await makeCdpRequest('/v1/page', 'write-key', {
			method: 'POST',
			body: {},
			region: 'eu',
		});
		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({
				BASE: CUSTOMERIO_CDP_BASE_EU,
				HEADERS: expect.objectContaining({ 'X-Strict-Mode': '1' }),
			}),
			expect.anything(),
			expect.anything(),
		);
	});

	it('defaults to the US bases when region is omitted', async () => {
		mockRequest.mockResolvedValue({});
		await makeAppRequest('/v1/segments', 'k', { method: 'GET' });
		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({ BASE: CUSTOMERIO_APP_BASE }),
			expect.anything(),
			expect.anything(),
		);
	});
});

describe('family-scoped compound keys', () => {
	const COMPOUND = 'app=APPK-1;track=SITE-9:TKEY-2;cdp=CDPW-3';

	it('sends the app segment as the App Bearer credential', async () => {
		mockRequest.mockResolvedValue({ segments: [] });
		await makeAppRequest('/v1/segments', COMPOUND, { method: 'GET' });
		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({
				HEADERS: expect.objectContaining({
					Authorization: 'Bearer APPK-1',
				}),
			}),
			expect.anything(),
			expect.anything(),
		);
	});

	it('sends the track segment as Basic siteId:apiKey credentials', async () => {
		mockRequest.mockResolvedValue({});
		await makeTrackRequest('/api/v1/customers/u_1', COMPOUND, {
			method: 'PUT',
			body: {},
		});
		const expected = Buffer.from('SITE-9:TKEY-2', 'utf-8').toString('base64');
		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({
				HEADERS: expect.objectContaining({
					Authorization: `Basic ${expected}`,
				}),
			}),
			expect.anything(),
			expect.anything(),
		);
	});

	it('sends a lone cdp segment as Basic write-key credentials', async () => {
		mockRequest.mockResolvedValue({});
		await makeCdpRequest('/v1/page', 'cdp=CDPW-3', {
			method: 'POST',
			body: {},
		});
		const expected = Buffer.from('CDPW-3:', 'utf-8').toString('base64');
		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({
				HEADERS: expect.objectContaining({
					Authorization: `Basic ${expected}`,
					'X-Strict-Mode': '1',
				}),
			}),
			expect.anything(),
			expect.anything(),
		);
	});

	it('fails fast without a request when the family segment is missing', async () => {
		await expect(
			makeTrackRequest('/api/v1/customers/u_1', 'app=APPK-1', {
				method: 'PUT',
				body: {},
			}),
		).rejects.toMatchObject({ name: 'CustomerioAPIError' });
		expect(mockRequest).not.toHaveBeenCalled();
		await expect(
			makeCdpRequest('/v1/page', 'app=APPK-1;track=S:T', {
				method: 'POST',
				body: {},
			}),
		).rejects.toMatchObject({ name: 'CustomerioAPIError' });
		expect(mockRequest).not.toHaveBeenCalled();
	});

	it('keeps legacy single keys working for every family', async () => {
		mockRequest.mockResolvedValue({});
		await makeAppRequest('/v1/segments', 'app-key-123', { method: 'GET' });
		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({
				HEADERS: expect.objectContaining({
					Authorization: 'Bearer app-key-123',
				}),
			}),
			expect.anything(),
			expect.anything(),
		);
	});
});

describe('client error mapping', () => {
	it('rethrows ApiError unwrapped so error handlers see the status code', async () => {
		const apiError = new ApiError(
			{ method: 'GET', url: '/v1/segments' },
			{
				url: '/v1/segments',
				ok: false,
				status: 429,
				statusText: 'Too Many Requests',
				body: { message: 'slow down' },
			},
			'Too Many Requests',
		);
		mockRequest.mockRejectedValue(apiError);
		await expect(makeAppRequest('/v1/segments', 'k')).rejects.toBe(apiError);
	});

	it('wraps Error instances in CustomerioAPIError', async () => {
		mockRequest.mockRejectedValue(new Error('boom'));
		await expect(makeAppRequest('/v1/segments', 'k')).rejects.toMatchObject({
			name: 'CustomerioAPIError',
			message: 'boom',
		});
	});

	it('wraps non-Error rejections in CustomerioAPIError', async () => {
		mockRequest.mockRejectedValue('plain-string-failure');
		const failure: CustomerioAPIError = await makeAppRequest(
			'/v1/segments',
			'k',
		).then(
			() => {
				throw new Error('expected request to reject');
			},
			(err: CustomerioAPIError) => err,
		);
		expect(failure).toBeInstanceOf(CustomerioAPIError);
		expect(failure.message).toBe('Unknown Customer.io request failure');
	});
});
