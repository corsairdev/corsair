import { verifyHmacSignatureWithPrefix } from 'corsair/http';
import { verifyWhatsappWebhookSignature } from './webhooks/types';

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
