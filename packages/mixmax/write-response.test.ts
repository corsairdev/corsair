import { ZodError } from 'zod';
import { mixmax } from './index';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn(),
}));

jest.mock('./client', () => ({
	...jest.requireActual('./client'),
	makeMixmaxRequest: jest.fn(),
}));

import { logEventFromContext } from 'corsair/core';
import { makeMixmaxRequest } from './client';

const logEvent = jest.mocked(logEventFromContext);
const request = jest.mocked(makeMixmaxRequest);

// A partial runtime context. `as never` stands in for MixmaxContext, whose
// database, key store and event services these handlers never touch: they
// read only `key` and call $getAccountId when logging, and both the request
// and the logger are mocked. A full context would need core's runtime.
const ctx = {
	key: 'mixmax_test_key',
	$getAccountId: async () => 'account-1',
} as never;

const endpoints = mixmax({ key: 'mixmax_test_key' }).endpoints!;

describe('Mixmax responses that do not match the output schema', () => {
	beforeEach(() => {
		logEvent.mockReset().mockResolvedValue(null);
		request.mockReset();
	});

	it('returns a write response as received, sends one request and records the mismatch', async () => {
		// POST /v1/unsubscribes is documented as 204 with no body; a body here
		// does not match the schema, but the address is already added.
		const raw = { unexpected: 'shape' };
		request.mockResolvedValue(raw);

		const result = await endpoints.unsubscribes.create(ctx, {
			email: 'someone@example.com',
		});

		expect(result).toBe(raw);
		expect(request).toHaveBeenCalledTimes(1);
		const events = logEvent.mock.calls.map((call) => ({
			type: call[1],
			// logEventFromContext types its payload as `unknown`; every
			// handler here passes a plain object, which the cast states.
			payload: call[2] as Record<string, unknown>,
			status: call[3],
		}));
		expect(events.map((event) => event.status)).toEqual([
			'completed',
			'completed',
		]);
		expect(events[1]).toEqual({
			type: 'mixmax.unsubscribes.create.outputMismatch',
			payload: {
				operation: 'unsubscribes.create',
				outputMismatch: true,
				issues: [{ path: '', code: 'invalid_type' }],
			},
			status: 'completed',
		});
		// The mismatch record carries schema paths only, never values.
		expect(JSON.stringify(events)).not.toContain('shape');
		expect(JSON.stringify(events)).not.toContain('example.com');
	});

	it('returns a send response as received instead of throwing after the email went out', async () => {
		// The send output is an object; an array does not match it.
		const raw = ['unexpected'];
		request.mockResolvedValue(raw);

		await expect(endpoints.messages.send(ctx, { id: 'msg-1' })).resolves.toBe(
			raw,
		);
		expect(request).toHaveBeenCalledTimes(1);
	});

	it('still throws when a read response does not match', async () => {
		request.mockResolvedValue({ results: 'not-an-array' });

		await expect(endpoints.snippets.list(ctx, {})).rejects.toBeInstanceOf(
			ZodError,
		);
		expect(request).toHaveBeenCalledTimes(1);
		expect(
			logEvent.mock.calls.some((call) =>
				String(call[1]).endsWith('.outputMismatch'),
			),
		).toBe(false);
	});

	it('does not fail the write when recording the mismatch fails', async () => {
		request.mockResolvedValue({ unexpected: true });
		logEvent
			.mockResolvedValueOnce(null)
			.mockRejectedValueOnce(new Error('database down'));

		await expect(
			endpoints.unsubscribes.create(ctx, { email: 'someone@example.com' }),
		).resolves.toEqual({ unexpected: true });
	});
});
