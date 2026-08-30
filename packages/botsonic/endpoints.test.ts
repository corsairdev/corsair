import { logEventFromContext } from 'corsair/core';
import { makeBotsonicRequest } from './client';
import { GenerateResponse, GetAllFaqs } from './endpoints';

jest.mock('corsair/core', () => {
	const actual = jest.requireActual('corsair/core');
	return { ...actual, logEventFromContext: jest.fn() };
});

jest.mock('./client', () => ({
	makeBotsonicRequest: jest.fn(),
}));

const mockRequest = makeBotsonicRequest as jest.MockedFunction<
	typeof makeBotsonicRequest
>;

const mockContext = { key: 'test-key' } as never;
const chatId = '550e8400-e29b-41d4-a716-446655440000';

beforeEach(() => {
	mockRequest.mockReset();
	(jest.mocked(logEventFromContext) as jest.Mock).mockReset();
});

describe('generateResponse', () => {
	it('posts parsed input with token auth and returns the answer envelope', async () => {
		mockRequest.mockResolvedValue({ answer: 'hello' });

		await expect(
			GenerateResponse.post(mockContext, {
				input_text: 'hi',
				chat_id: chatId,
			}),
		).resolves.toEqual({ answer: 'hello' });

		expect(mockRequest).toHaveBeenCalledWith(
			'/v1/botsonic/generate',
			'test-key',
			{
				method: 'POST',
				body: { input_text: 'hi', chat_id: chatId },
			},
		);
		expect(logEventFromContext).toHaveBeenCalled();
	});

	it('rejects invalid generate input before calling the API', async () => {
		await expect(
			GenerateResponse.post(mockContext, {
				input_text: '',
				chat_id: 'not-a-uuid',
			} as never),
		).rejects.toThrow();
		expect(mockRequest).not.toHaveBeenCalled();
	});

	it('rejects a generate payload that is missing answer', async () => {
		mockRequest.mockResolvedValue({ message_id: chatId });

		await expect(
			GenerateResponse.post(mockContext, {
				input_text: 'hi',
				chat_id: chatId,
			}),
		).rejects.toThrow();
		expect(logEventFromContext).not.toHaveBeenCalled();
	});
});

describe('getAllFaqs', () => {
	it('gets FAQs with X-BOT-KEY auth and returns the page envelope', async () => {
		mockRequest.mockResolvedValue({
			items: [{ id: '1', question: 'Q', answer: 'A' }],
			total: 1,
			page: 1,
			size: 10,
		});

		await expect(
			GetAllFaqs.get(mockContext, { page: 1, size: 10, sort_by: 'question' }),
		).resolves.toMatchObject({ total: 1, page: 1 });

		expect(mockRequest).toHaveBeenCalledWith(
			'/v1/business/bot-faq/all',
			'test-key',
			{
				method: 'GET',
				query: { page: 1, size: 10, sort_by: 'question' },
				authType: 'bot-key',
			},
		);
	});

	it('rejects an invalid FAQ sort_by before calling the API', async () => {
		await expect(
			GetAllFaqs.get(mockContext, { sort_by: 'not-a-field' } as never),
		).rejects.toThrow();
		expect(mockRequest).not.toHaveBeenCalled();
	});
});
