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

// `created` is Unix milliseconds and `respondents` lists who picked the
// answer; it is missing when nobody has.
const QUESTION = {
	_id: 'yesno-1',
	userId: 'user-1',
	created: 1728311746000,
	text: 'Can we ship on Friday?',
	answers: [{ text: 'Yes', respondents: ['ada@example.com'] }, { text: 'No' }],
};

// The factory always builds the validated endpoint tree, so the endpoints
// accessor is defined on every plugin instance.
const endpoints = mixmax({ key: 'mixmax_test_key' }).endpoints!;

describe('Mixmax yesno endpoints', () => {
	beforeEach(() => {
		request.mockReset();
		request.mockResolvedValue(undefined);
	});

	it('yesno.list sends GET /v1/yesno with documented query params', async () => {
		const page = { results: [QUESTION], hasNext: false };
		request.mockResolvedValue(page);
		const result = await endpoints.yesno.list(ctx, {
			limit: 10,
			fields: 'text,answers',
		});

		expect(request).toHaveBeenCalledWith(ctx, '/v1/yesno', {
			method: 'GET',
			query: {
				limit: 10,
				next: undefined,
				previous: undefined,
				fields: 'text,answers',
			},
		});
		expect(result).toEqual(page);
	});

	it('yesno.get sends GET /v1/yesno/:id', async () => {
		request.mockResolvedValue(QUESTION);
		const result = await endpoints.yesno.get(ctx, { id: 'yesno-1' });

		expect(request).toHaveBeenCalledWith(ctx, '/v1/yesno/yesno-1', {
			method: 'GET',
		});
		expect(result).toEqual(QUESTION);
	});

	it('yesno.get rejects a missing id before any request', async () => {
		await expect(
			// unknown: deliberately invalid input shape to prove the schema
			// boundary rejects it before transport.
			endpoints.yesno.get(ctx, {} as never),
		).rejects.toThrow();
		expect(request).not.toHaveBeenCalled();
	});
});
