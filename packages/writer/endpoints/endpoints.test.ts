import * as client from '../client';
import { createChat, createCompletion, listModels } from './writer';

jest.mock('../client', () => ({
	makeWriterRequest: jest.fn(),
}));

const mockedRequest = client.makeWriterRequest as jest.MockedFunction<
	typeof client.makeWriterRequest
>;

const createContext = (input: unknown = {}) =>
	({
		key: 'writer-test-api-key',
		db: {},
		input,
	}) as any;

describe('Writer endpoints', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	describe('models', () => {
		it('lists available Writer models', async () => {
			const response = {
				models: [
					{
						id: 'palmyra-x5',
						name: 'Palmyra X5',
					},
				],
			};

			mockedRequest.mockResolvedValueOnce(response);

			const result = await listModels(createContext());

			expect(mockedRequest).toHaveBeenCalledWith(
				'/models',
				'writer-test-api-key',
				'GET',
			);

			expect(result).toEqual(response);
		});
	});

	describe('completions', () => {
		it('creates a text completion with the supplied input', async () => {
			const input = {
				model: 'palmyra-x5',
				prompt: 'Explain open source in one sentence.',
				max_tokens: 100,
				temperature: 0.5,
			};

			const response = {
				choices: [
					{
						text: 'Open source software is software whose source code is available for use, modification, and distribution.',
					},
				],
				model: 'palmyra-x5',
			};

			mockedRequest.mockResolvedValueOnce(response);

			const result = await createCompletion(createContext(input));

			expect(mockedRequest).toHaveBeenCalledWith(
				'/completions',
				'writer-test-api-key',
				'POST',
				input,
			);

			expect(result).toEqual(response);
		});
	});

	describe('chat', () => {
		it('creates a chat completion with the supplied messages', async () => {
			const input = {
				model: 'palmyra-x5',
				messages: [
					{
						role: 'user' as const,
						content: 'What is Corsair?',
					},
				],
				temperature: 0.7,
			};

			const response = {
				id: 'chatcmpl-test',
				object: 'chat.completion' as const,
				choices: [
					{
						index: 0,
						finish_reason: 'stop',
						message: {
							role: 'assistant',
							content: 'Corsair is an open-source integration platform.',
						},
					},
				],
				created: 1710000000,
				model: 'palmyra-x5',
			};

			mockedRequest.mockResolvedValueOnce(response);

			const result = await createChat(createContext(input));

			expect(mockedRequest).toHaveBeenCalledWith(
				'/chat',
				'writer-test-api-key',
				'POST',
				input,
			);

			expect(result).toEqual(response);
		});
	});
});
