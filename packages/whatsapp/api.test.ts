import { makeWhatsappRequest } from './client';
import { Messages } from './endpoints/index';

jest.mock('./client', () => ({
	makeWhatsappRequest: jest.fn(),
}));

const mockedMakeWhatsappRequest = makeWhatsappRequest as jest.MockedFunction<
	typeof makeWhatsappRequest
>;

describe('WhatsApp API Endpoints', () => {
	const mockCtx: any = {
		key: 'test-token',
		$getAccountId: jest.fn().mockResolvedValue('test-account'),
		db: {
			messages: {
				upsertByEntityId: jest.fn().mockResolvedValue(undefined),
			},
		},
	};

	beforeEach(() => {
		jest.clearAllMocks();
	});

	describe('Messages', () => {
		it('should send a text message and upsert to database', async () => {
			mockedMakeWhatsappRequest.mockResolvedValueOnce({
				messaging_product: 'whatsapp',
				contacts: [{ input: '1234567890', wa_id: '1234567890' }],
				messages: [{ id: 'wamid.HBgLMTU1NT...' }],
			});

			const result = await Messages.send(mockCtx, {
				phoneNumberId: '100100',
				messaging_product: 'whatsapp',
				to: '1234567890',
				type: 'text',
				text: { body: 'Hello world' },
			});

			expect(mockedMakeWhatsappRequest).toHaveBeenCalledWith(
				'100100/messages',
				'test-token',
				{
					method: 'POST',
					body: {
						messaging_product: 'whatsapp',
						to: '1234567890',
						type: 'text',
						text: { body: 'Hello world' },
					},
				},
			);

			expect(mockCtx.db.messages.upsertByEntityId).toHaveBeenCalledWith(
				'wamid.HBgLMTU1NT...',
				expect.objectContaining({
					id: 'wamid.HBgLMTU1NT...',
					phoneNumberId: '100100',
					to: '1234567890',
					type: 'text',
					text: 'Hello world',
					status: 'accepted',
				}),
			);

			expect(result).toBeDefined();
			expect(result.messages?.[0]?.id).toBe('wamid.HBgLMTU1NT...');
		});

		it('should send an image message and upsert to database with caption as text', async () => {
			mockedMakeWhatsappRequest.mockResolvedValueOnce({
				messaging_product: 'whatsapp',
				contacts: [{ input: '1234567890', wa_id: '1234567890' }],
				messages: [{ id: 'wamid.IMAGE123' }],
			});

			const result = await Messages.send(mockCtx, {
				phoneNumberId: '100100',
				messaging_product: 'whatsapp',
				to: '1234567890',
				type: 'image',
				image: {
					link: 'https://example.com/image.png',
					caption: 'Look at this!',
				},
			});

			expect(mockedMakeWhatsappRequest).toHaveBeenCalledWith(
				'100100/messages',
				'test-token',
				{
					method: 'POST',
					body: {
						messaging_product: 'whatsapp',
						to: '1234567890',
						type: 'image',
						image: {
							link: 'https://example.com/image.png',
							caption: 'Look at this!',
						},
					},
				},
			);

			expect(mockCtx.db.messages.upsertByEntityId).toHaveBeenCalledWith(
				'wamid.IMAGE123',
				expect.objectContaining({
					id: 'wamid.IMAGE123',
					to: '1234567890',
					type: 'image',
					text: 'Look at this!',
				}),
			);
		});
	});
});
