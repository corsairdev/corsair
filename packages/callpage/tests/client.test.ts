import { request } from 'corsair/http';
import { z } from 'zod';
import { makeCallPageRequest } from '../client';

jest.mock('corsair/http', () => ({
	ApiError: class ApiError extends Error {
		status: number;
		retryAfter?: number;
		constructor(message: string, status: number, retryAfter?: number) {
			super(message);
			this.status = status;
			this.retryAfter = retryAfter;
		}
	},
	request: jest.fn(),
}));

const mockedRequest = jest.mocked(request);

describe('makeCallPageRequest', () => {
	beforeEach(() => {
		mockedRequest.mockReset();
	});

	it('unwraps explicit null data payloads from delete responses', async () => {
		mockedRequest.mockResolvedValueOnce({
			hasError: false,
			errorCode: 0,
			message: '',
			data: null,
		});

		const result = await makeCallPageRequest(
			'/api/v1/external/users/delete',
			'key',
			{
				schema: z.null(),
			},
		);

		expect(result).toBeNull();
	});

	it('preserves ApiError metadata for rate-limit handling', async () => {
		const { ApiError } = jest.requireMock('corsair/http') as {
			ApiError: new (
				message: string,
				status: number,
				retryAfter?: number,
			) => Error & {
				status: number;
				retryAfter?: number;
			};
		};
		mockedRequest.mockRejectedValueOnce(
			new ApiError('Too many requests', 429, 5000),
		);

		await expect(
			makeCallPageRequest('/api/v1/external/users/all', 'key'),
		).rejects.toMatchObject({ status: 429, retryAfter: 5000 });
	});
});
