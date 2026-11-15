import type { MixmaxContext } from './index';
import { mixmax } from './index';

jest.mock('./client', () => ({
	...jest.requireActual('./client'),
	makeMixmaxRequest: jest.fn(),
}));

import { makeMixmaxRequest } from './client';

const request = jest.mocked(makeMixmaxRequest);

// The handlers under test read only `key` from the runtime context and log
// through logEventFromContext, which needs $getAccountId; every other
// context service is untouched by these code paths.
const ctx = {
	key: 'mixmax_test_key',
	$getAccountId: async () => 'account-1',
} as unknown as MixmaxContext;

// The factory always builds the validated endpoint tree, so the endpoints
// accessor is defined on every plugin instance.
const endpoints = mixmax({ key: 'mixmax_test_key' }).endpoints!;

const FILE_REQUEST = {
	_id: 'qCWnCJ5XkGZ7MJS3x',
	userId: 'user-1',
	timestamp: '2026-10-14T15:00:00.000Z',
	uploads: [
		{
			timestamp: '2026-10-14T16:00:00.000Z',
			email: 'ada@example.com',
			name: 'Ada Lovelace',
			ipAddress: '203.0.113.7',
			downloadUrl: 'https://example.com/uploads/abc/contract.pdf',
		},
	],
};

describe('Mixmax file request endpoints', () => {
	beforeEach(() => {
		request.mockReset();
		request.mockResolvedValue(undefined);
	});

	it('fileRequests.list sends GET /v1/filerequests with documented query params', async () => {
		const page = {
			results: [FILE_REQUEST],
			hasNext: false,
			hasPrevious: false,
		};
		request.mockResolvedValue(page);
		const result = await endpoints.fileRequests.list(ctx, { limit: 50 });

		expect(request).toHaveBeenCalledWith(ctx, '/v1/filerequests', {
			method: 'GET',
			query: {
				limit: 50,
				next: undefined,
				previous: undefined,
			},
		});
		expect(result).toEqual(page);
	});

	it('fileRequests.get sends GET /v1/filerequests/:id and rejects unsafe ids', async () => {
		request.mockResolvedValue(FILE_REQUEST);
		const result = await endpoints.fileRequests.get(ctx, {
			id: 'qCWnCJ5XkGZ7MJS3x',
		});

		expect(request).toHaveBeenCalledWith(
			ctx,
			'/v1/filerequests/qCWnCJ5XkGZ7MJS3x',
			{
				method: 'GET',
			},
		);
		expect(result).toEqual(FILE_REQUEST);

		await expect(
			endpoints.fileRequests.get(ctx, { id: '../admin' }),
		).rejects.toThrow('Invalid Mixmax id');
		expect(request).toHaveBeenCalledTimes(1);
	});

	it('fileRequests.get rejects a missing id before any request', async () => {
		await expect(
			// unknown: deliberately invalid input shape to prove the schema
			// boundary rejects it before transport.
			endpoints.fileRequests.get(ctx, {} as never),
		).rejects.toThrow();
		expect(request).not.toHaveBeenCalled();
	});
});
