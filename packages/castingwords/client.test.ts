import { request } from 'corsair/http';
import { CASTINGWORDS_API_BASE, makeCastingwordsRequest, toFormBody } from './client';

jest.mock('corsair/http', () => ({
	ApiError: class ApiError extends Error {},
	request: jest.fn(),
}));

const requestMock = request as unknown as jest.Mock;

describe('CastingWords client', () => {
	beforeEach(() => requestMock.mockReset());

	it('uses the documented API v4 base URL', () => {
		expect(CASTINGWORDS_API_BASE).toBe('https://castingwords.com/store/API4');
	});

	it('encodes repeatable form fields', () => {
		expect(toFormBody({ api_key: 'key', sku: ['TRANS14', 'TSTMP1'], test: '1' })).toBe(
			'api_key=key&sku=TRANS14&sku=TSTMP1&test=1',
		);
	});

	it('adds the API key to GET query parameters', async () => {
		requestMock.mockResolvedValue({ balance: 10 });
		await makeCastingwordsRequest('prepay_balance', 'secret');
		expect(requestMock).toHaveBeenCalledWith(
			expect.objectContaining({ BASE: CASTINGWORDS_API_BASE }),
			expect.objectContaining({ method: 'GET', query: { api_key: 'secret' } }),
		);
	});

	it('sends POST fields as URL-encoded data', async () => {
		requestMock.mockResolvedValue({ message: 'ok' });
		await makeCastingwordsRequest('order_url', 'secret', {
			method: 'POST',
			form: { url: 'https://example.com/a.mp3', sku: ['TRANS14', 'TSTMP1'] },
		});
		expect(requestMock).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({
				method: 'POST',
				body: 'api_key=secret&url=https%3A%2F%2Fexample.com%2Fa.mp3&sku=TRANS14&sku=TSTMP1',
				mediaType: 'application/x-www-form-urlencoded',
			}),
		);
	});

	it('preserves provider errors as CastingwordsAPIError', async () => {
		requestMock.mockRejectedValue(new Error('provider failed'));
		await expect(makeCastingwordsRequest('prepay_balance', 'secret')).rejects.toThrow('provider failed');
	});
});
