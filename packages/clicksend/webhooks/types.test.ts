import {
	createClickSendInboundMatcher,
	createClickSendReceiptMatcher,
	verifyClickSendWebhookSignature,
} from './types';

describe('ClickSend webhook verification and matchers', () => {
	describe('verifyClickSendWebhookSignature', () => {
		it('returns valid: true when no secret is configured', () => {
			const res = verifyClickSendWebhookSignature({
				headers: {},
				payload: {},
			} as any);
			expect(res.valid).toBe(true);
		});

		it('returns error when auth header is missing', () => {
			const res = verifyClickSendWebhookSignature(
				{
					headers: {},
					payload: {},
				} as any,
				'my-secret',
			);
			expect(res.valid).toBe(false);
			expect(res.error).toBe('Missing webhook authorization header');
		});

		it('validates Bearer token format', () => {
			const res = verifyClickSendWebhookSignature(
				{
					headers: { authorization: 'Bearer my-secret' },
					payload: {},
				} as any,
				'my-secret',
			);
			expect(res.valid).toBe(true);
		});

		it('validates Basic auth encoded format', () => {
			const basic = Buffer.from('clicksend:my-secret').toString('base64');
			const res = verifyClickSendWebhookSignature(
				{
					headers: { authorization: `Basic ${basic}` },
					payload: {},
				} as any,
				'my-secret',
			);
			expect(res.valid).toBe(true);
		});

		it('validates x-clicksend-token header', () => {
			const res = verifyClickSendWebhookSignature(
				{
					headers: { 'x-clicksend-token': 'my-secret' },
					payload: {},
				} as any,
				'my-secret',
			);
			expect(res.valid).toBe(true);
		});

		it('validates query token parameter', () => {
			const res = verifyClickSendWebhookSignature(
				{
					headers: {},
					query: { token: 'my-secret' },
					payload: {},
				} as any,
				'my-secret',
			);
			expect(res.valid).toBe(true);
		});

		it('returns invalid on incorrect secret (timing safe check)', () => {
			const res = verifyClickSendWebhookSignature(
				{
					headers: { authorization: 'Bearer wrong-secret' },
					payload: {},
				} as any,
				'my-secret',
			);
			expect(res.valid).toBe(false);
			expect(res.error).toBe('Invalid webhook secret');
		});
	});

	describe('createClickSendInboundMatcher', () => {
		const matcher = createClickSendInboundMatcher();

		it('matches inbound message body', () => {
			expect(
				matcher({
					body: { from: '+1234567890', to: '+1098765432', body: 'Hello!' },
					headers: {},
					query: {},
				} as any),
			).toBe(true);
		});

		it('does not match receipt payload', () => {
			expect(
				matcher({
					body: { message_id: 'm1', status: 'delivered' },
					headers: {},
					query: {},
				} as any),
			).toBe(false);
		});
	});

	describe('createClickSendReceiptMatcher', () => {
		const matcher = createClickSendReceiptMatcher();

		it('matches receipt payload', () => {
			expect(
				matcher({
					body: { message_id: 'm1', status: 'delivered' },
					headers: {},
					query: {},
				} as any),
			).toBe(true);
		});
	});
});
