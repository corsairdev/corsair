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

const endpoints = mixmax({ key: 'mixmax_test_key' }).endpoints!;

const SEND_AT = 1792560000000;

// A send time that is not a real millisecond timestamp must never reach
// Mixmax: a coerced `false`, `null` or `''` becomes 0, which Mixmax reads as
// "send now", so the email goes out when the caller meant the opposite.
const NOT_A_SEND_TIME = [
	['false', false],
	['null', null],
	['an empty string', ''],
	['true', true],
	['zero', 0],
	['a timestamp in seconds', 1792560000],
	['a date string', '2026-10-21T00:00:00Z'],
] as const;

describe('Mixmax send times', () => {
	beforeEach(() => {
		request.mockReset();
		request.mockResolvedValue(undefined);
	});

	it.each(NOT_A_SEND_TIME)(
		'sequences.recipients.add refuses %s as the top-level scheduledAt',
		async (_label, scheduledAt) => {
			await expect(
				endpoints.sequences.recipients.add(ctx, {
					id: 'seq-1',
					recipients: [{ email: 'ada@example.com' }],
					scheduledAt,
				} as never),
			).rejects.toThrow();
			expect(request).not.toHaveBeenCalled();
		},
	);

	it('sequences.recipients.add still keeps a recipient as a draft with scheduledAt false on the recipient', async () => {
		request.mockResolvedValue({ recipients: [] });
		await endpoints.sequences.recipients.add(ctx, {
			id: 'seq-1',
			recipients: [{ email: 'ada@example.com', scheduledAt: false }],
			scheduledAt: SEND_AT,
		});

		expect(request).toHaveBeenCalledWith(
			ctx,
			'/v1/sequences/seq-1/recipients/',
			expect.objectContaining({
				method: 'POST',
				body: expect.objectContaining({
					recipients: [{ email: 'ada@example.com', scheduledAt: false }],
					scheduledAt: SEND_AT,
				}),
			}),
		);
	});

	it.each(NOT_A_SEND_TIME)(
		'messages.schedule refuses %s as scheduledDate',
		async (_label, scheduledDate) => {
			await expect(
				endpoints.messages.schedule(ctx, {
					id: 'msg-1',
					options: { scheduledDate },
				} as never),
			).rejects.toThrow();
			expect(request).not.toHaveBeenCalled();
		},
	);

	it('messages.schedule accepts a millisecond timestamp as a number or a string of digits', async () => {
		request.mockResolvedValue('Message successfully scheduled.');
		await endpoints.messages.schedule(ctx, {
			id: 'msg-1',
			options: { scheduledDate: SEND_AT },
		});
		await endpoints.messages.schedule(ctx, {
			id: 'msg-1',
			options: { scheduledDate: String(SEND_AT) },
		} as never);

		expect(request).toHaveBeenCalledTimes(2);
		for (const call of request.mock.calls) {
			expect(call[2]?.body).toEqual({
				options: { scheduledDate: SEND_AT },
				data: undefined,
			});
		}
	});

	it.each(NOT_A_SEND_TIME)(
		'snippets.send refuses %s as scheduledAt',
		async (_label, scheduledAt) => {
			await expect(
				endpoints.snippets.send(ctx, {
					id: 'snippet-1',
					to: [{ email: 'ada@example.com' }],
					scheduledAt,
				} as never),
			).rejects.toThrow();
			expect(request).not.toHaveBeenCalled();
		},
	);
});
