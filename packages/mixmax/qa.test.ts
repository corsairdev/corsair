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

// Times on a Q&A form are Unix milliseconds.
const QA_FORM = {
	_id: 'qa-1',
	creatorId: 'user-1',
	creationDate: 1728311746000,
	title: 'Kickoff questions',
	questions: [
		{
			type: 'textarea',
			content: 'What are your goals?',
			answers: [
				{
					recipientEmail: 'ada@example.com',
					recipientName: 'Ada',
					answer: 'Grow the team.',
				},
			],
		},
	],
};

// The factory always builds the validated endpoint tree, so the endpoints
// accessor is defined on every plugin instance.
const endpoints = mixmax({ key: 'mixmax_test_key' }).endpoints!;

describe('Mixmax qa endpoints', () => {
	beforeEach(() => {
		request.mockReset();
		request.mockResolvedValue(undefined);
	});

	it('qa.list sends GET /v1/qa with documented query params', async () => {
		const page = { results: [QA_FORM], hasNext: false, next: 'cursor-1' };
		request.mockResolvedValue(page);
		const result = await endpoints.qa.list(ctx, {
			limit: 10,
			next: 'cursor-1',
		});

		expect(request).toHaveBeenCalledWith(ctx, '/v1/qa', {
			method: 'GET',
			query: {
				limit: 10,
				next: 'cursor-1',
				previous: undefined,
			},
		});
		expect(result).toEqual(page);
	});

	it('qa.get sends GET /v1/qa/:id', async () => {
		request.mockResolvedValue(QA_FORM);
		const result = await endpoints.qa.get(ctx, { id: 'qa-1' });

		expect(request).toHaveBeenCalledWith(ctx, '/v1/qa/qa-1', {
			method: 'GET',
		});
		expect(result).toEqual(QA_FORM);
	});

	it('qa.get rejects a missing id before any request', async () => {
		await expect(
			// unknown: deliberately invalid input shape to prove the schema
			// boundary rejects it before transport.
			endpoints.qa.get(ctx, {} as never),
		).rejects.toThrow();
		expect(request).not.toHaveBeenCalled();
	});
});
