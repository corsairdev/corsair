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

// `createdAt` and `respondedAt` are Unix milliseconds, and `respondents`
// lists the people who picked the option, in the order they voted.
const POLL = {
	_id: 'poll-1',
	userId: 'user-1',
	createdAt: 1728311746000,
	question: 'Which day works best for the team offsite?',
	livePoll: true,
	options: [
		{
			text: 'Tuesday',
			respondents: [
				{
					email: 'jane@example.com',
					name: 'Jane Doe',
					respondedAt: 1728315346000,
					messageId: 'msg-1',
					sequenceId: 'seq-1',
				},
			],
		},
		{ text: 'Wednesday' },
	],
};

// The factory always builds the validated endpoint tree, so the endpoints
// accessor is defined on every plugin instance.
const endpoints = mixmax({ key: 'mixmax_test_key' }).endpoints!;

describe('Mixmax polls endpoints', () => {
	beforeEach(() => {
		request.mockReset();
		request.mockResolvedValue(undefined);
	});

	it('polls.list sends GET /v1/polls with documented query params', async () => {
		const page = { results: [POLL], hasNext: false, next: 'cursor-1' };
		request.mockResolvedValue(page);
		const result = await endpoints.polls.list(ctx, {
			limit: 10,
			next: 'cursor-1',
		});

		expect(request).toHaveBeenCalledWith(ctx, '/v1/polls', {
			method: 'GET',
			query: {
				limit: 10,
				next: 'cursor-1',
				previous: undefined,
				fields: undefined,
			},
		});
		expect(result).toEqual(page);
	});

	it('polls.get sends GET /v1/polls/:id', async () => {
		request.mockResolvedValue(POLL);
		const result = await endpoints.polls.get(ctx, { id: 'poll-1' });

		expect(request).toHaveBeenCalledWith(ctx, '/v1/polls/poll-1', {
			method: 'GET',
		});
		expect(result).toEqual(POLL);
	});

	it('polls.get rejects a missing id before any request', async () => {
		await expect(
			// unknown: deliberately invalid input shape to prove the schema
			// boundary rejects it before transport.
			endpoints.polls.get(ctx, {} as never),
		).rejects.toThrow();
		expect(request).not.toHaveBeenCalled();
	});
});
