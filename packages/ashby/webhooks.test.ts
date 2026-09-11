import { createHmac } from 'node:crypto';
import { ashby } from './index';
import {
	ApplicationWebhooks,
	CandidateWebhooks,
	createAshbyMatch,
	matchAshbyTenantWebhook,
	OfferWebhooks,
	verifyAshbyWebhookSignature,
} from './webhooks';

describe('Ashby Webhooks Subsystem', () => {
	const secret = 'whsec_test_secret_12345';
	const payloadObj = {
		webhookActionId: 'wh_act_123',
		action: 'candidateStageChange',
		data: {
			candidateId: 'cand_123',
			applicationId: 'app_123',
			currentInterviewStageId: 'stage_456',
		},
	};
	const rawPayload = JSON.stringify(payloadObj);
	const validHmac = createHmac('sha256', secret)
		.update(rawPayload)
		.digest('hex');
	const validSignatureHeader = `sha256=${validHmac}`;

	describe('verifyAshbyWebhookSignature', () => {
		it('verifies valid HMAC-SHA256 signature from Ashby-Signature header', () => {
			const req = {
				headers: {
					'ashby-signature': validSignatureHeader,
				},
				body: rawPayload,
			} as any;

			const result = verifyAshbyWebhookSignature(req, secret);
			expect(result.valid).toBe(true);
		});

		it('verifies valid signature regardless of header case', () => {
			const req = {
				headers: {
					'Ashby-Signature': validSignatureHeader,
				},
				body: rawPayload,
			} as any;

			const result = verifyAshbyWebhookSignature(req, secret);
			expect(result.valid).toBe(true);
		});

		it('rejects tampered or mismatched payload', () => {
			const tamperedPayload = JSON.stringify({
				...payloadObj,
				action: 'tampered',
			});
			const req = {
				headers: {
					'ashby-signature': validSignatureHeader,
				},
				body: tamperedPayload,
			} as any;

			const result = verifyAshbyWebhookSignature(req, secret);
			expect(result.valid).toBe(false);
			expect(result.error).toBe('Signature mismatch');
		});

		it('rejects missing header or missing secret', () => {
			const reqWithoutHeader = {
				headers: {},
				body: rawPayload,
			} as any;
			expect(verifyAshbyWebhookSignature(reqWithoutHeader, secret).valid).toBe(
				false,
			);

			const reqWithHeader = {
				headers: { 'ashby-signature': validSignatureHeader },
				body: rawPayload,
			} as any;
			expect(verifyAshbyWebhookSignature(reqWithHeader, '').valid).toBe(false);
		});

		it('verifies HMAC against a Buffer body without re-serializing JSON', () => {
			const req = {
				headers: {
					'ashby-signature': validSignatureHeader,
				},
				body: Buffer.from(rawPayload),
			} as any;

			expect(verifyAshbyWebhookSignature(req, secret).valid).toBe(true);
		});

		it('rejects a parsed body when no raw string body is present', () => {
			const req = {
				headers: {
					'ashby-signature': validSignatureHeader,
				},
				body: payloadObj,
			} as any;

			const result = verifyAshbyWebhookSignature(req, secret);
			expect(result.valid).toBe(false);
			expect(result.error).toBe(
				'Raw webhook body unavailable for signature verification',
			);
		});

		it('rejects malformed signature length', () => {
			const req = {
				headers: {
					'ashby-signature': 'sha256=tooshort',
				},
				body: rawPayload,
			} as any;

			const result = verifyAshbyWebhookSignature(req, secret);
			expect(result.valid).toBe(false);
			expect(result.error).toBe('Signature length mismatch');
		});
	});

	describe('createAshbyMatch', () => {
		it('matches webhook events by action field', () => {
			const matcher = createAshbyMatch('candidateStageChange');
			expect(
				matcher({
					body: rawPayload,
					headers: {},
					url: '',
					method: 'POST',
				} as any),
			).toBe(true);

			expect(
				matcher({
					body: JSON.stringify({ action: 'applicationSubmit' }),
					headers: {},
					url: '',
					method: 'POST',
				} as any),
			).toBe(false);
		});
	});

	describe('matchAshbyTenantWebhook', () => {
		it('returns null as Ashby uses per-endpoint signing secret routing', () => {
			const result = matchAshbyTenantWebhook({
				body: rawPayload,
				headers: {},
				url: '',
				method: 'POST',
			} as any);
			expect(result).toBeNull();
		});
	});

	describe('Webhook Handlers', () => {
		const ctx = {
			key: secret,
			options: { webhookSecret: secret },
			$getAccountId: async () => 'test_account',
			db: {
				candidates: {
					findById: jest.fn(async (id) => ({ id })),
				},
				applications: {
					findById: jest.fn(async (id) => ({ id })),
				},
				offers: {
					findById: jest.fn(async (id) => ({ id })),
					deleteById: jest.fn(async () => true),
				},
			},
		} as any;

		it('handles candidateStageChange successfully', async () => {
			const res = await CandidateWebhooks.stageChange.handler(ctx, {
				headers: { 'ashby-signature': validSignatureHeader },
				body: rawPayload,
				payload: payloadObj as any,
			} as any);

			expect(res.success).toBe(true);
			expect(res.corsairEntityId).toBe('cand_123');
		});

		it('rejects candidateStageChange on invalid signature', async () => {
			const res = await CandidateWebhooks.stageChange.handler(ctx, {
				headers: { 'ashby-signature': 'sha256=' + '0'.repeat(64) },
				body: rawPayload,
				payload: payloadObj as any,
			} as any);

			expect(res.success).toBe(false);
			expect(res.statusCode).toBe(401);
		});

		it('handles candidateHire and applicationSubmit', async () => {
			const hirePayload = {
				webhookActionId: 'wh_2',
				action: 'candidateHire',
				data: { candidateId: 'cand_123', offerId: 'off_123' },
			};
			const hireRaw = JSON.stringify(hirePayload);
			const hireSig = `sha256=${createHmac('sha256', secret).update(hireRaw).digest('hex')}`;

			const hireRes = await CandidateWebhooks.hire.handler(ctx, {
				headers: { 'ashby-signature': hireSig },
				body: hireRaw,
				payload: hirePayload as any,
			} as any);
			expect(hireRes.success).toBe(true);

			const submitPayload = {
				webhookActionId: 'wh_3',
				action: 'applicationSubmit',
				data: { applicationId: 'app_123' },
			};
			const submitRaw = JSON.stringify(submitPayload);
			const submitSig = `sha256=${createHmac('sha256', secret).update(submitRaw).digest('hex')}`;

			const submitRes = await ApplicationWebhooks.submit.handler(ctx, {
				headers: { 'ashby-signature': submitSig },
				body: submitRaw,
				payload: submitPayload as any,
			} as any);
			expect(submitRes.success).toBe(true);
		});

		it('returns 500 when offer delete cache write fails', async () => {
			const deletePayload = {
				webhookActionId: 'wh_4',
				action: 'offerDelete',
				data: { offerId: 'off_123', applicationId: 'app_123' },
			};
			const deleteRaw = JSON.stringify(deletePayload);
			const deleteSig = `sha256=${createHmac('sha256', secret).update(deleteRaw).digest('hex')}`;
			ctx.db.offers.deleteById.mockRejectedValueOnce(new Error('db down'));

			const res = await OfferWebhooks.delete.handler(ctx, {
				headers: { 'ashby-signature': deleteSig },
				body: deleteRaw,
				rawBody: deleteRaw,
				payload: deletePayload as any,
			} as any);

			expect(res.success).toBe(false);
			expect(res.statusCode).toBe(500);
		});
	});

	describe('Plugin Instance Integration', () => {
		it('identifies Ashby webhooks by ashby-signature header', () => {
			const plugin = ashby({ key: 'test-key', webhookSecret: secret });
			expect(
				plugin.pluginWebhookMatcher?.({
					headers: { 'ashby-signature': 'sha256=123' },
				} as any),
			).toBe(true);

			expect(
				plugin.pluginWebhookMatcher?.({
					headers: { 'x-other-signature': '123' },
				} as any),
			).toBe(false);
		});
	});
});
