import crypto from 'node:crypto';
import type { RawWebhookRequest } from 'corsair/core';
import { handshake } from './challenge';

type HandshakeContext = Parameters<typeof handshake.handler>[0];
type HandshakeRequest = Parameters<typeof handshake.handler>[1];

function sign(rawBody: string, secret: string): string {
	return crypto.createHmac('sha256', secret).update(rawBody).digest('base64');
}

function eventBody(): string {
	return JSON.stringify({
		messageId: '1450530000000099001',
		subject: 'Webhook test mail',
	});
}

function createContext(storedSecret: string | null) {
	let stored = storedSecret;
	const keys = {
		get_webhook_signature: jest.fn(async () => stored),
		set_webhook_signature: jest.fn(async (value: string) => {
			stored = value;
		}),
	};

	return { ctx: { keys } as unknown as HandshakeContext, keys };
}

function createRequest(
	headers: Record<string, string>,
	rawBody?: string,
): HandshakeRequest {
	return {
		headers,
		body: rawBody ? JSON.parse(rawBody) : {},
		rawBody,
	} as unknown as HandshakeRequest;
}

function createRawRequest(headers: Record<string, string>): RawWebhookRequest {
	return { headers, body: {} };
}

describe('zohomail handshake webhook', () => {
	describe('match', () => {
		it('matches requests carrying an x-hook-secret header', () => {
			expect(
				handshake.match(createRawRequest({ 'x-hook-secret': 'sek' })),
			).toBe(true);
		});

		it('does not match requests without the header', () => {
			expect(handshake.match(createRawRequest({}))).toBe(false);
		});
	});

	describe('first-time registration', () => {
		it('rejects an unsigned first-time handshake and does not persist', async () => {
			const { ctx, keys } = createContext(null);

			const result = await handshake.handler(
				ctx,
				createRequest({ 'x-hook-secret': 'zoho-secret' }),
			);

			expect(result.success).toBe(false);
			expect(result.statusCode).toBe(401);
			expect(keys.set_webhook_signature).not.toHaveBeenCalled();
		});

		it('persists when the first request is signed with the new secret', async () => {
			const { ctx, keys } = createContext(null);
			const hookSecret = 'first-request-hook-secret';
			const rawBody = eventBody();

			const result = await handshake.handler(
				ctx,
				createRequest(
					{
						'x-hook-secret': hookSecret,
						'x-hook-signature': sign(rawBody, hookSecret),
					},
					rawBody,
				),
			);

			expect(result.success).toBe(true);
			expect(keys.set_webhook_signature).toHaveBeenCalledWith(hookSecret);
		});

		it('does not persist when the first-request signature is invalid', async () => {
			const { ctx, keys } = createContext(null);
			const rawBody = eventBody();

			const result = await handshake.handler(
				ctx,
				createRequest(
					{
						'x-hook-secret': 'first-request-hook-secret',
						'x-hook-signature': sign(rawBody, 'wrong-secret'),
					},
					rawBody,
				),
			);

			expect(result.success).toBe(false);
			expect(result.statusCode).toBe(401);
			expect(keys.set_webhook_signature).not.toHaveBeenCalled();
		});

		it('does not persist a signed first request that is missing the raw body', async () => {
			const { ctx, keys } = createContext(null);

			const result = await handshake.handler(
				ctx,
				createRequest({
					'x-hook-secret': 'first-request-hook-secret',
					'x-hook-signature': 'abc',
				}),
			);

			expect(result.success).toBe(false);
			expect(result.statusCode).toBe(401);
			expect(keys.set_webhook_signature).not.toHaveBeenCalled();
		});
	});

	describe('overwrite protection', () => {
		it('rejects a bare x-hook-secret POST when a secret is already stored', async () => {
			const { ctx, keys } = createContext('initial-secret');

			const result = await handshake.handler(
				ctx,
				createRequest({ 'x-hook-secret': 'attacker-secret' }),
			);

			expect(result.success).toBe(false);
			expect(result.statusCode).toBe(401);
			expect(result.error).toMatch(/Cannot overwrite existing secret/i);
			expect(keys.set_webhook_signature).not.toHaveBeenCalled();
		});

		it('rejects an overwrite signed with an unrelated secret', async () => {
			const { ctx, keys } = createContext('initial-secret');
			const rawBody = eventBody();

			const result = await handshake.handler(
				ctx,
				createRequest(
					{
						'x-hook-secret': 'new-secret-attempt',
						'x-hook-signature': sign(rawBody, 'wrong-secret'),
					},
					rawBody,
				),
			);

			expect(result.success).toBe(false);
			expect(result.statusCode).toBe(401);
			expect(keys.set_webhook_signature).not.toHaveBeenCalled();
		});

		it('rejects an overwrite signed with the incoming new secret', async () => {
			const { ctx, keys } = createContext('initial-secret');
			const newSecret = 'new-secret-attempt';
			const rawBody = eventBody();

			const result = await handshake.handler(
				ctx,
				createRequest(
					{
						'x-hook-secret': newSecret,
						'x-hook-signature': sign(rawBody, newSecret),
					},
					rawBody,
				),
			);

			expect(result.success).toBe(false);
			expect(result.statusCode).toBe(401);
			expect(keys.set_webhook_signature).not.toHaveBeenCalled();
		});

		it('rejects an attacker secret that is the same length as the stored one', async () => {
			const { ctx, keys } = createContext('aaaaaaaa');

			const result = await handshake.handler(
				ctx,
				createRequest({ 'x-hook-secret': 'bbbbbbbb' }),
			);

			expect(result.success).toBe(false);
			expect(result.statusCode).toBe(401);
			expect(keys.set_webhook_signature).not.toHaveBeenCalled();
		});

		it('rotates when the request is signed with the stored secret', async () => {
			const { ctx, keys } = createContext('initial-secret');
			const rawBody = eventBody();

			const result = await handshake.handler(
				ctx,
				createRequest(
					{
						'x-hook-secret': 'rotated-secret',
						'x-hook-signature': sign(rawBody, 'initial-secret'),
					},
					rawBody,
				),
			);

			expect(result.success).toBe(true);
			expect(keys.set_webhook_signature).toHaveBeenCalledWith('rotated-secret');
		});

		it('ACKs a retried handshake with the stored secret without rewriting it', async () => {
			const { ctx, keys } = createContext('initial-secret');

			const result = await handshake.handler(
				ctx,
				createRequest({ 'x-hook-secret': 'initial-secret' }),
			);

			expect(keys.set_webhook_signature).not.toHaveBeenCalled();
			expect(result.success).toBe(true);
			expect(result.data).toEqual({ hookSecret: 'initial-secret' });
		});

		it('does not let an overlapping unsigned first-time replace a signed setup', async () => {
			let stored: string | null = null;
			let unlock!: () => void;
			const gate = new Promise<void>((resolve) => {
				unlock = resolve;
			});
			const keys = {
				get_webhook_signature: jest.fn(async () => {
					await gate;
					return stored;
				}),
				set_webhook_signature: jest.fn(async (value: string) => {
					stored = value;
				}),
			};
			const ctx = { keys } as unknown as HandshakeContext;
			const rawBody = eventBody();

			const signed = handshake.handler(
				ctx,
				createRequest(
					{
						'x-hook-secret': 'legit-secret',
						'x-hook-signature': sign(rawBody, 'legit-secret'),
					},
					rawBody,
				),
			);
			const unsigned = handshake.handler(
				ctx,
				createRequest({ 'x-hook-secret': 'attacker-secret' }),
			);
			unlock();
			const [signedRes, unsignedRes] = await Promise.all([signed, unsigned]);

			expect(unsignedRes.success).toBe(false);
			expect(signedRes.success).toBe(true);
			expect(stored).toBe('legit-secret');
			expect(keys.set_webhook_signature).not.toHaveBeenCalledWith(
				'attacker-secret',
			);
		});

		it('does not let a later overlapping first-time write take over the secret', async () => {
			let stored: string | null = null;
			let unlock!: () => void;
			const gate = new Promise<void>((resolve) => {
				unlock = resolve;
			});
			const keys = {
				get_webhook_signature: jest.fn(async () => {
					await gate;
					return stored;
				}),
				set_webhook_signature: jest.fn(async (value: string) => {
					stored = value;
				}),
			};
			const ctx = { keys } as unknown as HandshakeContext;
			const rawA = eventBody();
			const rawB = JSON.stringify({ messageId: '2', subject: 'other' });

			const first = handshake.handler(
				ctx,
				createRequest(
					{
						'x-hook-secret': 'secret-a',
						'x-hook-signature': sign(rawA, 'secret-a'),
					},
					rawA,
				),
			);
			const second = handshake.handler(
				ctx,
				createRequest(
					{
						'x-hook-secret': 'secret-b',
						'x-hook-signature': sign(rawB, 'secret-b'),
					},
					rawB,
				),
			);
			unlock();
			const results = await Promise.all([first, second]);
			const succeeded = results.filter((result) => result.success);
			const failed = results.filter((result) => !result.success);

			expect(succeeded).toHaveLength(1);
			expect(failed).toHaveLength(1);
			expect(failed[0]?.statusCode).toBe(401);
			expect(['secret-a', 'secret-b']).toContain(stored);
			expect(keys.set_webhook_signature).toHaveBeenCalledTimes(1);
		});
	});

	describe('failure handling', () => {
		it('returns 400 when the header is missing', async () => {
			const { ctx, keys } = createContext(null);

			const result = await handshake.handler(ctx, createRequest({}));

			expect(result.success).toBe(false);
			expect(result.statusCode).toBe(400);
			expect(keys.set_webhook_signature).not.toHaveBeenCalled();
			expect(keys.get_webhook_signature).not.toHaveBeenCalled();
		});

		it('returns 500 when the stored secret cannot be read', async () => {
			const { ctx, keys } = createContext(null);
			keys.get_webhook_signature.mockRejectedValue(new Error('db down'));
			const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});

			const result = await handshake.handler(
				ctx,
				createRequest({ 'x-hook-secret': 'zoho-secret' }),
			);

			expect(result.success).toBe(false);
			expect(result.statusCode).toBe(500);
			expect(keys.set_webhook_signature).not.toHaveBeenCalled();

			warn.mockRestore();
		});

		it('does not ACK a secret it failed to persist', async () => {
			const { ctx, keys } = createContext(null);
			keys.set_webhook_signature.mockRejectedValue(new Error('db down'));
			const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
			const rawBody = eventBody();

			const result = await handshake.handler(
				ctx,
				createRequest(
					{
						'x-hook-secret': 'zoho-secret',
						'x-hook-signature': sign(rawBody, 'zoho-secret'),
					},
					rawBody,
				),
			);

			expect(result.success).toBe(false);
			expect(result.statusCode).toBe(500);
			expect(result.data).toBeUndefined();

			warn.mockRestore();
		});
	});
});
