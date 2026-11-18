import { logEventFromContext } from 'corsair/core';
import { makeGeminiRequest } from '../client';
import type { GeminiContext } from '../index';
import { generateContent } from './content';

jest.mock('corsair/core', () => ({
	logEventFromContext: jest.fn().mockResolvedValue(null),
}));
jest.mock('../client', () => ({
	makeGeminiRequest: jest.fn(),
}));

const mockRequest = jest.mocked(makeGeminiRequest);
const mockLog = jest.mocked(logEventFromContext);

const context = {
	key: 'test-key',
	$getAccountId: async () => 'test-account-id',
} as unknown as GeminiContext;

describe('Gemini content endpoints', () => {
	afterEach(() => {
		jest.clearAllMocks();
	});

	it('concatenates non-thought parts and keeps stripFences out of the request', async () => {
		mockRequest.mockResolvedValue({
			candidates: [
				{
					content: {
						parts: [
							{ text: 'hidden reasoning', thought: true },
							{ text: '```ts\nconst value = 1;\n```' },
							{ text: '\nfinished' },
						],
					},
				},
			],
		});

		const input = {
			model: 'gemini-2.5-flash',
			contents: [{ role: 'user' as const, parts: [{ text: 'write code' }] }],
			stripFences: false,
		};

		const response = await generateContent(context, input);

		expect(response.text).toBe('```ts\nconst value = 1;\n```\nfinished');
		expect(mockRequest).toHaveBeenCalledWith(
			'/models/gemini-2.5-flash:generateContent',
			'test-key',
			{
				method: 'POST',
				body: { contents: input.contents },
			},
		);
		expect(mockLog).toHaveBeenCalled();
	});

	it('strips one outer fence when stripFences is enabled', async () => {
		mockRequest.mockResolvedValue({
			candidates: [
				{
					content: {
						parts: [{ text: '```ts\nconst value = 1;\n```' }],
					},
				},
			],
		});

		const response = await generateContent(context, {
			model: 'gemini-2.5-flash',
			contents: [{ role: 'user', parts: [{ text: 'write code' }] }],
			stripFences: true,
		});

		expect(response.text).toBe('const value = 1;');
	});
});
