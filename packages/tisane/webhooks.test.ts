import { createHmac } from 'crypto';
import { analysisCompleted } from './webhooks/analysis';
import { verifyTisaneWebhookSignature } from './webhooks/types';

describe('Tisane Webhook Handler & Verifier', () => {
	const secret = 'my-webhook-secret-123';

	it('rejects verification if secret is missing', () => {
		const result = verifyTisaneWebhookSignature(
			{ headers: {}, payload: {} } as any,
			'',
		);
		expect(result.valid).toBe(false);
		expect(result.error).toContain('secret not configured');
	});

	it('rejects verification if signature header is missing', () => {
		const result = verifyTisaneWebhookSignature(
			{ headers: {}, payload: {} } as any,
			secret,
		);
		expect(result.valid).toBe(false);
		expect(result.error).toContain('Missing x-tisane-signature header');
	});

	it('verifies valid HMAC SHA256 signature', () => {
		const payload = { event: 'analysis.completed', analysis_id: '123' };
		const bodyString = JSON.stringify(payload);
		const signature = createHmac('sha256', secret)
			.update(bodyString)
			.digest('hex');

		const result = verifyTisaneWebhookSignature(
			{
				headers: { 'x-tisane-signature': signature },
				rawBody: bodyString,
				payload: payload as any,
			} as any,
			secret,
		);
		expect(result.valid).toBe(true);
	});

	it('matches analysis.completed event and invokes handler', async () => {
		const payload = {
			event: 'analysis.completed',
			analysis_id: '456',
			data: {},
		};
		const bodyString = JSON.stringify(payload);
		const signature = createHmac('sha256', secret)
			.update(bodyString)
			.digest('hex');

		const mockCtx = {
			key: secret,
			$getAccountId: async () => 'acc-1',
		} as any;

		const result = await analysisCompleted.handler(mockCtx, {
			headers: { 'x-tisane-signature': signature },
			rawBody: bodyString,
			payload: payload as any,
		});

		expect(result.success).toBe(true);
		expect(result.data).toEqual(payload);
	});
});
