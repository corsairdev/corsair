import { verification } from './webhooks/verification';

describe('Notion Webhook Verification', () => {
	let webhookSignature: string | null = null;
	let mockCtx: any;

	beforeEach(() => {
		webhookSignature = null;
		mockCtx = {
			keys: {
				get_webhook_signature: jest
					.fn()
					.mockImplementation(async () => webhookSignature),
				set_webhook_signature: jest
					.fn()
					.mockImplementation(async (value: string | null) => {
						webhookSignature = value;
					}),
			},
		};
	});

	it('should return success: false if verification_token is missing', async () => {
		const result = await verification.handler(mockCtx, {
			payload: {},
		} as any);

		expect(result).toEqual({
			success: false,
			data: undefined,
		});
		expect(mockCtx.keys.set_webhook_signature).not.toHaveBeenCalled();
	});

	it('should persist verification_token if no secret is currently configured', async () => {
		const result = await verification.handler(mockCtx, {
			payload: {
				verification_token: 'new-token-123',
			},
		} as any);

		expect(result).toEqual({
			success: true,
			returnToSender: {
				verification_token: 'new-token-123',
			},
			data: {
				verification_token: 'new-token-123',
				type: 'url_verification',
			},
		});
		expect(webhookSignature).toBe('new-token-123');
		expect(mockCtx.keys.set_webhook_signature).toHaveBeenCalledWith(
			'new-token-123',
		);
	});

	it('should succeed if incoming token matches the existing secret, without rewriting', async () => {
		webhookSignature = 'existing-secret-456';

		const result = await verification.handler(mockCtx, {
			payload: {
				verification_token: 'existing-secret-456',
			},
		} as any);

		expect(result).toEqual({
			success: true,
			returnToSender: {
				verification_token: 'existing-secret-456',
			},
			data: {
				verification_token: 'existing-secret-456',
				type: 'url_verification',
			},
		});
		expect(webhookSignature).toBe('existing-secret-456');
		expect(mockCtx.keys.set_webhook_signature).not.toHaveBeenCalled();
	});

	it('should throw an error if incoming token does not match the existing secret', async () => {
		webhookSignature = 'existing-secret-456';

		const promise = verification.handler(mockCtx, {
			payload: {
				verification_token: 'attacker-token-789',
			},
		} as any);

		await expect(promise).rejects.toThrow('Invalid verification token');
		expect(webhookSignature).toBe('existing-secret-456');
		expect(mockCtx.keys.set_webhook_signature).not.toHaveBeenCalled();
	});

	it('serializes concurrent first-time registrations so the second waiter sees the stored secret', async () => {
		const first = verification.handler(mockCtx, {
			payload: { verification_token: 'first-token' },
		} as any);
		const second = verification.handler(mockCtx, {
			payload: { verification_token: 'second-token' },
		} as any);

		await expect(first).resolves.toMatchObject({ success: true });
		await expect(second).rejects.toThrow('Invalid verification token');
		expect(webhookSignature).toBe('first-token');
		expect(mockCtx.keys.set_webhook_signature).toHaveBeenCalledTimes(1);
	});

	it('rejects when a concurrent writer replaces the token after set', async () => {
		mockCtx.keys.set_webhook_signature = jest
			.fn()
			.mockImplementation(async () => {
				// Simulate another process winning the write.
				webhookSignature = 'foreign-token';
			});

		await expect(
			verification.handler(mockCtx, {
				payload: { verification_token: 'our-token' },
			} as any),
		).rejects.toThrow('Invalid verification token');
	});
});
