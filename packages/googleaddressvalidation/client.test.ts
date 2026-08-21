import { ApiError, request } from 'corsair/http';
import { makeGoogleAddressValidationRequest } from './client';

jest.mock('corsair/http', () => {
	const actual = jest.requireActual('corsair/http');
	return {
		...actual,
		request: jest.fn(),
	};
});

const mockRequest = jest.mocked(request);

describe('GoogleAddressValidation API client auth', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('sends the API key as X-Goog-Api-Key and omits the key query param', async () => {
		mockRequest.mockResolvedValueOnce({});

		await makeGoogleAddressValidationRequest(
			'v1:validateAddress',
			'secret-key',
			{
				method: 'POST',
				body: {},
			},
		);

		expect(mockRequest).toHaveBeenCalledTimes(1);
		const [config, requestOptions] = mockRequest.mock.calls[0] ?? [];
		expect(config?.HEADERS).toMatchObject({
			'X-Goog-Api-Key': 'secret-key',
		});
		expect(requestOptions?.query?.key).toBeUndefined();
	});
});

describe('GoogleAddressValidation API client error wrapping', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('preserves status/statusText/body/retryAfter for retry and auth routing', async () => {
		const apiError = new ApiError(
			{
				method: 'POST',
				url: 'v1:validateAddress',
				query: { key: 'secret-key' },
			},
			{
				url: 'https://addressvalidation.googleapis.com/v1:validateAddress?key=secret-key',
				ok: false,
				status: 429,
				statusText: 'Too Many Requests',
				body: { error: 'rate limited' },
			},
			'Too Many Requests',
			{ retryAfter: 1500 },
		);
		mockRequest.mockRejectedValueOnce(apiError);

		await expect(
			makeGoogleAddressValidationRequest('v1:validateAddress', 'secret-key', {
				method: 'POST',
				body: {},
			}),
		).rejects.toMatchObject({
			status: 429,
			statusText: 'Too Many Requests',
			body: { error: 'rate limited' },
			retryAfter: 1500,
		});
	});

	it('never attaches the raw ApiError (with the API key) as the thrown error cause', async () => {
		const apiError = new ApiError(
			{
				method: 'POST',
				url: 'v1:validateAddress',
				query: { key: 'secret-key' },
			},
			{
				url: 'https://addressvalidation.googleapis.com/v1:validateAddress?key=secret-key',
				ok: false,
				status: 403,
				statusText: 'Forbidden',
				body: { error: 'PERMISSION_DENIED' },
			},
			'Forbidden',
		);
		mockRequest.mockRejectedValueOnce(apiError);

		let caught: unknown;
		try {
			await makeGoogleAddressValidationRequest(
				'v1:validateAddress',
				'secret-key',
				{
					method: 'POST',
					body: {},
				},
			);
		} catch (error) {
			caught = error;
		}

		expect(caught).toBeInstanceOf(Error);
		expect((caught as Error).cause).toBeUndefined();
	});
});
