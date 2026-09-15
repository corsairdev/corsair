import { ApiError, request } from 'corsair/http';
import {
	CUSTOMERIO_APP_BASE,
	CUSTOMERIO_CDP_BASE,
	CUSTOMERIO_TRACK_BASE,
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
	it('sends Basic auth against the CDP base URL', async () => {
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
				}),
			}),
			expect.objectContaining({ method: 'POST', url: '/v1/page' }),
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
