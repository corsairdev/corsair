import { handshake } from './challenge';

type HandshakeContext = Parameters<typeof handshake.handler>[0];
type HandshakeRequest = Parameters<typeof handshake.handler>[1];

function createContext(storedSecret: string | null) {
	const keys = {
		get_webhook_signature: jest.fn().mockResolvedValue(storedSecret),
		set_webhook_signature_if_absent: jest
			.fn()
			.mockResolvedValue({ created: true }),
	};

	return { ctx: { keys } as unknown as HandshakeContext, keys };
}

function createRequest(headers: Record<string, string>): HandshakeRequest {
	return { headers } as unknown as HandshakeRequest;
}

describe('zohomail handshake webhook', () => {
	it('persists the secret on first handshake', async () => {
		const { ctx, keys } = createContext(null);

		const result = await handshake.handler(
			ctx,
			createRequest({ 'x-hook-secret': 'zoho-secret' }),
		);

		expect(keys.set_webhook_signature_if_absent).toHaveBeenCalledWith(
			'zoho-secret',
		);
		expect(result.success).toBe(true);
		expect(result.data).toEqual({ hookSecret: 'zoho-secret' });
	});

	it('is idempotent when the same secret is re-registered', async () => {
		const { ctx, keys } = createContext(null);
		keys.set_webhook_signature_if_absent.mockResolvedValue({ created: false });

		const result = await handshake.handler(
			ctx,
			createRequest({ 'x-hook-secret': 'zoho-secret' }),
		);

		expect(result.success).toBe(true);
		expect(result.data).toEqual({ hookSecret: 'zoho-secret' });
	});

	it('returns 401 for a different secret once one is configured', async () => {
		const { ctx, keys } = createContext('stored-secret');
		keys.set_webhook_signature_if_absent.mockRejectedValue(
			new Error('Webhook signature already configured'),
		);
		const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});

		const result = await handshake.handler(
			ctx,
			createRequest({ 'x-hook-secret': 'attacker-secret' }),
		);

		expect(result.success).toBe(false);
		expect(result.statusCode).toBe(401);
		expect(warn).toHaveBeenCalled();

		warn.mockRestore();
	});

	it('returns 400 when x-hook-secret is missing', async () => {
		const { ctx, keys } = createContext(null);

		const result = await handshake.handler(ctx, createRequest({}));

		expect(result.success).toBe(false);
		expect(result.statusCode).toBe(400);
		expect(keys.set_webhook_signature_if_absent).not.toHaveBeenCalled();
	});

	it('returns 500 when persistence fails and no secret is stored', async () => {
		const { ctx, keys } = createContext(null);
		keys.set_webhook_signature_if_absent.mockRejectedValue(
			new Error('db down'),
		);
		const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});

		const result = await handshake.handler(
			ctx,
			createRequest({ 'x-hook-secret': 'zoho-secret' }),
		);

		expect(result.success).toBe(false);
		expect(result.statusCode).toBe(500);
		expect(warn).toHaveBeenCalled();

		warn.mockRestore();
	});
});
