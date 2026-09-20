import { verifyHmacSignatureWithPrefix } from 'corsair/http';
import {
	verifyWhatsappWebhookChallenge,
	verifyWhatsappWebhookSignature,
} from './webhooks/types';

jest.mock('corsair/http', () => ({
	verifyHmacSignatureWithPrefix: jest.fn(),
}));

const mockedVerify = verifyHmacSignatureWithPrefix as jest.Mock;

describe('WhatsApp Webhooks', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	describe('Signature Verification', () => {
		it('should verify correct signature via HMAC SHA256', async () => {
			mockedVerify.mockReturnValue(true);

			const mockRequest: any = {
				rawBody: 'mock-body-string',
				headers: {
					'x-hub-signature-256': 'sha256=valid-signature',
				},
			};

			const result = verifyWhatsappWebhookSignature(
				mockRequest,
				'my-app-secret',
			);

			expect(mockedVerify).toHaveBeenCalledWith(
				'mock-body-string',
				'my-app-secret',
				'sha256=valid-signature',
				'sha256=',
				'sha256',
			);
			expect(result.valid).toBe(true);
		});

		it('should reject when verification fails', async () => {
			mockedVerify.mockReturnValue(false);

			const mockRequest: any = {
				rawBody: 'mock-body-string',
				headers: {
					'x-hub-signature-256': 'sha256=invalid-signature',
				},
			};

			const result = verifyWhatsappWebhookSignature(
				mockRequest,
				'my-app-secret',
			);

			expect(result.valid).toBe(false);
		});
	});

	describe('Challenge Verification', () => {
		// Mirrors the query param type verifyWhatsappWebhookChallenge accepts, so
		// overrides can drop a param (undefined) or repeat one (string[]).
		type ChallengeQuery = Record<string, string | string[] | undefined>;
		const challengeQuery = (
			overrides: ChallengeQuery = {},
		): ChallengeQuery => ({
			'hub.mode': 'subscribe',
			'hub.verify_token': 'my-verify-token',
			'hub.challenge': '1234567890',
			...overrides,
		});

		it('should accept a matching verify token and echo the challenge', () => {
			const result = verifyWhatsappWebhookChallenge(
				challengeQuery(),
				'my-verify-token',
			);

			expect(result).toEqual({ valid: true, challenge: '1234567890' });
		});

		it('should reject a same-length token mismatch with 403', () => {
			const result = verifyWhatsappWebhookChallenge(
				challengeQuery({ 'hub.verify_token': 'my-verify-tokeX' }),
				'my-verify-token',
			);

			expect(result).toEqual({ valid: false, statusCode: 403 });
		});

		it('should reject a length mismatch with 403 rather than throwing', () => {
			// timingSafeEqual throws on unequal lengths — the length check has to
			// short-circuit before it, or a wrong-length token becomes a 500.
			expect(() =>
				verifyWhatsappWebhookChallenge(
					challengeQuery({ 'hub.verify_token': 'short' }),
					'my-verify-token',
				),
			).not.toThrow();

			expect(
				verifyWhatsappWebhookChallenge(
					challengeQuery({ 'hub.verify_token': 'short' }),
					'my-verify-token',
				),
			).toEqual({ valid: false, statusCode: 403 });
		});

		it('should reject a missing verify token with 403', () => {
			expect(
				verifyWhatsappWebhookChallenge(
					challengeQuery({ 'hub.verify_token': undefined }),
					'my-verify-token',
				),
			).toEqual({ valid: false, statusCode: 403 });

			expect(verifyWhatsappWebhookChallenge(challengeQuery(), '')).toEqual({
				valid: false,
				statusCode: 403,
			});

			expect(
				verifyWhatsappWebhookChallenge(
					challengeQuery({ 'hub.verify_token': '   ' }),
					'my-verify-token',
				),
			).toEqual({ valid: false, statusCode: 403 });

			expect(verifyWhatsappWebhookChallenge(challengeQuery(), '   ')).toEqual({
				valid: false,
				statusCode: 403,
			});
		});

		it('should still reject a non-subscribe mode or missing challenge', () => {
			expect(
				verifyWhatsappWebhookChallenge(
					challengeQuery({ 'hub.mode': 'unsubscribe' }),
					'my-verify-token',
				),
			).toEqual({ valid: false, statusCode: 403 });

			expect(
				verifyWhatsappWebhookChallenge(
					challengeQuery({ 'hub.challenge': undefined }),
					'my-verify-token',
				),
			).toEqual({ valid: false, statusCode: 403 });
		});

		it('should read the first value when a query param repeats', () => {
			const result = verifyWhatsappWebhookChallenge(
				challengeQuery({ 'hub.verify_token': ['my-verify-token', 'other'] }),
				'my-verify-token',
			);

			expect(result).toEqual({ valid: true, challenge: '1234567890' });
		});

		it('should reject when a repeated verify token matches only after the first value', () => {
			// Parameter-pollution guard: reading anything but index 0 — switching
			// value() to raw.find()/includes(), say — would let an appended query
			// param smuggle a valid token past verification. Both entries are the
			// same length, so this exercises timingSafeEqual, not the length check.
			const result = verifyWhatsappWebhookChallenge(
				challengeQuery({
					'hub.verify_token': ['wrong-token-val', 'my-verify-token'],
				}),
				'my-verify-token',
			);

			expect(result).toEqual({ valid: false, statusCode: 403 });
		});
	});

	describe('Message Handler', () => {
		it('should extract text from an inbound image message with caption', async () => {
			mockedVerify.mockReturnValue({ valid: true });

			const mockCtx: any = {
				key: 'test-token',
				db: {
					contacts: { upsertByEntityId: jest.fn() },
					messages: {
						findByEntityId: jest.fn().mockResolvedValue(null),
						upsertByEntityId: jest
							.fn()
							.mockImplementation((id: string, data: any) =>
								Promise.resolve({ id, ...data }),
							),
					},
				},
				$getAccountId: jest.fn(),
				options: {},
			};

			const mockRequest: any = {
				rawBody: 'mock-body',
				headers: { 'x-hub-signature-256': 'sha256=valid-sig' },
				payload: {
					object: 'whatsapp_business_account',
					entry: [
						{
							id: 'business-123',
							changes: [
								{
									field: 'messages',
									value: {
										messaging_product: 'whatsapp',
										metadata: {
											phone_number_id: 'phone-123',
											display_phone_number: '123',
										},
										contacts: [],
										messages: [
											{
												id: 'msg-img',
												from: 'user-123',
												timestamp: '1234567890',
												type: 'image',
												image: { caption: 'Beautiful sunset' },
											},
										],
									},
								},
							],
						},
					],
				},
			};

			// We need to import 'messages' hook handler inside the file, so we do it dynamically or statically.
			const { messages } = await import('./webhooks/messages');

			// Mock logEventFromContext using jest
			const core = await import('corsair/core');
			jest.spyOn(core, 'logEventFromContext').mockResolvedValue(null as any);

			const result = await messages.handler(mockCtx, mockRequest);

			expect(result.success).toBe(true);
			expect(mockCtx.db.messages.upsertByEntityId).toHaveBeenCalledWith(
				'msg-img',
				expect.objectContaining({
					text: 'Beautiful sunset',
					type: 'image',
				}),
			);
		});
	});
});
