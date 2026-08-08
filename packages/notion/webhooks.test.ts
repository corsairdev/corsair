import { verification } from './webhooks/verification';

describe('Notion Webhook Verification', () => {
	let webhookSignature: string | null = null;
	let mockCtx: {
		keys: {
			get_webhook_signature: jest.Mock;
			set_webhook_signature_if_absent: jest.Mock;
		};
	};

	beforeEach(() => {
		webhookSignature = null;
		mockCtx = {
			keys: {
				get_webhook_signature: jest
					.fn()
					.mockImplementation(async () => webhookSignature),
				set_webhook_signature_if_absent: jest
					.fn()
					.mockImplementation(async (value: string) => {
						if (webhookSignature && webhookSignature !== value) {
							throw new Error('Webhook signature already configured');
						}
						if (webhookSignature === value) {
							return { created: false };
						}
						webhookSignature = value;
						return { created: true };
					}),
			},
		};
	});

	it('returns success: false if verification_token is missing', async () => {
		const result = await verification.handler(
			mockCtx as any,
			{
				payload: {},
			} as any,
		);

		expect(result).toEqual({
			success: false,
			statusCode: 400,
			error: 'Missing verification_token',
			data: undefined,
		});
		expect(mockCtx.keys.set_webhook_signature_if_absent).not.toHaveBeenCalled();
	});

	it('persists verification_token on first handshake', async () => {
		const result = await verification.handler(
			mockCtx as any,
			{
				payload: { verification_token: 'new-token-123' },
			} as any,
		);

		expect(result).toMatchObject({
			success: true,
			returnToSender: { verification_token: 'new-token-123' },
		});
		expect(webhookSignature).toBe('new-token-123');
		expect(mockCtx.keys.set_webhook_signature_if_absent).toHaveBeenCalledWith(
			'new-token-123',
		);
	});

	it('succeeds on a matching retry without rewriting', async () => {
		webhookSignature = 'existing-secret-456';

		const result = await verification.handler(
			mockCtx as any,
			{
				payload: { verification_token: 'existing-secret-456' },
			} as any,
		);

		expect(result).toMatchObject({ success: true });
		expect(webhookSignature).toBe('existing-secret-456');
	});

	it('returns 401 when the token does not match a stored secret', async () => {
		webhookSignature = 'existing-secret-456';

		const result = await verification.handler(
			mockCtx as any,
			{
				payload: { verification_token: 'attacker-token-789' },
			} as any,
		);

		expect(result).toEqual({
			success: false,
			statusCode: 401,
			error: 'Invalid verification token',
		});
		expect(webhookSignature).toBe('existing-secret-456');
	});

	it('returns 500 when persistence fails and no secret is stored', async () => {
		mockCtx.keys.set_webhook_signature_if_absent.mockRejectedValue(
			new Error('db down'),
		);
		const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});

		const result = await verification.handler(
			mockCtx as any,
			{
				payload: { verification_token: 'new-token-123' },
			} as any,
		);

		expect(result).toEqual({
			success: false,
			statusCode: 500,
			error: 'Failed to persist verification token',
		});
		expect(warn).toHaveBeenCalled();

		warn.mockRestore();
	});
});
