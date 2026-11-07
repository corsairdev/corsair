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

const UNSUBSCRIBE = {
	_id: 'u-1',
	email: 'a@b.com',
	createdAt: '2026-10-14T22:29:49.417Z',
};

const PAGE = { results: [UNSUBSCRIBE], hasNext: false };

// The factory always builds the validated endpoint tree, so the endpoints
// accessor is defined on every plugin instance.
const endpoints = mixmax({ key: 'mixmax_test_key' }).endpoints!;

describe('Mixmax unsubscribes endpoints', () => {
	beforeEach(() => {
		request.mockReset();
		request.mockResolvedValue(undefined);
	});

	it('unsubscribes.list sends GET /v1/unsubscribes with documented query params', async () => {
		request.mockResolvedValue(PAGE);
		const result = await endpoints.unsubscribes.list(ctx, {
			email: 'a@b.com',
			sortAscending: true,
			limit: 100,
			expand: 'sequence',
		});

		expect(request).toHaveBeenCalledWith(ctx, '/v1/unsubscribes', {
			method: 'GET',
			query: {
				email: 'a@b.com',
				sort: undefined,
				sortAscending: true,
				limit: 100,
				next: undefined,
				previous: undefined,
				expand: 'sequence',
			},
		});
		expect(result).toEqual(PAGE);
	});

	it('unsubscribes.create posts one address with its name as the body', async () => {
		await endpoints.unsubscribes.create(ctx, {
			email: 'alice@example.com',
			name: 'Alice Example',
		});

		expect(request).toHaveBeenCalledWith(ctx, '/v1/unsubscribes', {
			method: 'POST',
			body: {
				email: 'alice@example.com',
				name: 'Alice Example',
				emails: undefined,
			},
		});
	});

	it('unsubscribes.create posts the bulk emails array as the body', async () => {
		await endpoints.unsubscribes.create(ctx, {
			emails: ['alice@example.com', 'bob@example.com'],
		});

		expect(request).toHaveBeenCalledWith(ctx, '/v1/unsubscribes', {
			method: 'POST',
			body: {
				email: undefined,
				name: undefined,
				emails: ['alice@example.com', 'bob@example.com'],
			},
		});
	});

	it('unsubscribes.remove sends DELETE /v1/unsubscribes with the email body', async () => {
		await endpoints.unsubscribes.remove(ctx, { email: 'a@b.com' });

		// The documented contract for DELETE /v1/unsubscribes carries the
		// address in a JSON body rather than the query string.
		expect(request).toHaveBeenCalledWith(ctx, '/v1/unsubscribes', {
			method: 'DELETE',
			body: { email: 'a@b.com' },
		});
	});

	it('unsubscribes.remove requires the email before any request', async () => {
		await expect(
			// unknown: deliberately invalid input shape to prove the schema
			// boundary rejects it before transport.
			endpoints.unsubscribes.remove(ctx, {} as never),
		).rejects.toThrow();
		expect(request).not.toHaveBeenCalled();
	});
});
