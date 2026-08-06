import type { RawWebhookRequest } from 'corsair/core';
import { challenge } from './challenge';

type ChallengeContext = Parameters<typeof challenge.handler>[0];
type ChallengeRequest = Parameters<typeof challenge.handler>[1];

function createContext(storedSecret: string | null) {
	const keys = {
		get_webhook_signature: jest.fn().mockResolvedValue(storedSecret),
		set_webhook_signature: jest.fn().mockResolvedValue(undefined),
	};

	return { ctx: { keys } as unknown as ChallengeContext, keys };
}

function createRequest(headers: Record<string, string>) {
	return { headers, body: {} } as unknown as ChallengeRequest;
}

function createRawRequest(headers: Record<string, string>): RawWebhookRequest {
	return { headers, body: {} };
}

describe('asana challenge webhook', () => {
	describe('match', () => {
		it('matches requests carrying an x-hook-secret header', () => {
			expect(
				challenge.match(createRawRequest({ 'x-hook-secret': 'abc' })),
			).toBe(true);
		});

		it('does not match requests without the header', () => {
			expect(challenge.match(createRawRequest({}))).toBe(false);
		});
	});

	describe('first-time registration', () => {
		it('persists and echoes the secret when none is stored', async () => {
			const { ctx, keys } = createContext(null);

			const result = await challenge.handler(
				ctx,
				createRequest({ 'x-hook-secret': 'asana-secret' }),
			);

			expect(keys.set_webhook_signature).toHaveBeenCalledWith('asana-secret');
			expect(result.success).toBe(true);
			expect(result.responseHeaders).toEqual({
				'X-Hook-Secret': 'asana-secret',
			});
			expect(result.data).toEqual({ hookSecret: 'asana-secret' });
		});
	});

	describe('overwrite protection', () => {
		it('rejects a different secret when one is already configured', async () => {
			const { ctx, keys } = createContext('real-asana-secret');
			const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});

			const result = await challenge.handler(
				ctx,
				createRequest({ 'x-hook-secret': 'attacker-secret' }),
			);

			expect(keys.set_webhook_signature).not.toHaveBeenCalled();
			expect(result.success).toBe(false);
			expect(result.statusCode).toBe(401);
			// The sender's value must not be echoed back.
			expect(result.responseHeaders).toBeUndefined();
			expect(result.data).toBeUndefined();
			// Operators need a signal; the rejection is otherwise invisible.
			expect(warn).toHaveBeenCalledTimes(1);

			warn.mockRestore();
		});

		it('rejects an attacker secret that is the same length as the stored one', async () => {
			const { ctx, keys } = createContext('aaaaaaaa');
			const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});

			const result = await challenge.handler(
				ctx,
				createRequest({ 'x-hook-secret': 'bbbbbbbb' }),
			);

			expect(keys.set_webhook_signature).not.toHaveBeenCalled();
			expect(result.success).toBe(false);
			expect(result.statusCode).toBe(401);

			warn.mockRestore();
		});

		it('accepts a retried handshake carrying the stored secret without rewriting it', async () => {
			const { ctx, keys } = createContext('asana-secret');

			const result = await challenge.handler(
				ctx,
				createRequest({ 'x-hook-secret': 'asana-secret' }),
			);

			expect(keys.set_webhook_signature).not.toHaveBeenCalled();
			expect(result.success).toBe(true);
			expect(result.responseHeaders).toEqual({
				'X-Hook-Secret': 'asana-secret',
			});
		});
	});

	describe('failure handling', () => {
		it('returns 400 when the header is missing', async () => {
			const { ctx, keys } = createContext(null);

			const result = await challenge.handler(ctx, createRequest({}));

			expect(result.success).toBe(false);
			expect(result.statusCode).toBe(400);
			expect(keys.set_webhook_signature).not.toHaveBeenCalled();
			expect(keys.get_webhook_signature).not.toHaveBeenCalled();
		});

		it('does not echo a secret it failed to persist', async () => {
			const { ctx, keys } = createContext(null);
			keys.set_webhook_signature.mockRejectedValue(new Error('db down'));
			const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});

			const result = await challenge.handler(
				ctx,
				createRequest({ 'x-hook-secret': 'asana-secret' }),
			);

			expect(result.success).toBe(false);
			expect(result.statusCode).toBe(500);
			expect(result.responseHeaders).toBeUndefined();

			warn.mockRestore();
		});
	});
});
