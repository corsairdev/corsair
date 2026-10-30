import * as client from './client';
import { Endpoints } from './endpoints';
import type { GroqcloudContext } from './index';
import { groqcloud } from './index';

// Mock the client
jest.mock('./client', () => ({
	makeGroqcloudRequest: jest.fn(),
	multipartGroqcloudRequest: jest.fn(),
}));

describe('groqcloud plugin', () => {
	const mockCtx = {
		key: 'test_key',
		logEvent: jest.fn(),
	} as unknown as GroqcloudContext;

	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('should create the plugin successfully', () => {
		const plugin = groqcloud({ key: 'test_key' });
		expect(plugin.id).toBe('groqcloud');
		expect(plugin.authConfig!.api_key!.account).toEqual(['one']);
	});

	describe('Endpoints', () => {
		it('audio.createTranscription', async () => {
			(client.multipartGroqcloudRequest as jest.Mock).mockResolvedValueOnce({
				text: 'transcription',
			});
			const result = await Endpoints.audio.createTranscription(mockCtx, {
				file: new Blob(['dummy_file_content']),
				fileName: 'test.wav',
				model: 'whisper-large-v3',
			});
			expect(result).toEqual({ text: 'transcription' });
			expect(client.multipartGroqcloudRequest).toHaveBeenCalledWith(
				'audio/transcriptions',
				'test_key',
				expect.objectContaining({
					files: expect.arrayContaining([
						expect.objectContaining({ fileName: 'test.wav' }),
					]),
					fields: expect.objectContaining({ model: 'whisper-large-v3' }),
				}),
			);
		});

		it('audio.createTranslation', async () => {
			(client.multipartGroqcloudRequest as jest.Mock).mockResolvedValueOnce({
				text: 'translation',
			});
			const result = await Endpoints.audio.createTranslation(mockCtx, {
				file: new Blob(['dummy_file_content']),
				fileName: 'test.wav',
				model: 'whisper-large-v3',
			});
			expect(result).toEqual({ text: 'translation' });
			expect(client.multipartGroqcloudRequest).toHaveBeenCalledWith(
				'audio/translations',
				'test_key',
				expect.any(Object),
			);
		});

		it('audio.listVoices', async () => {
			const result = await Endpoints.audio.listVoices(mockCtx, {} as any);
			expect(result.english).toContain('Arista-PlayAI');
			expect(result.arabic).toContain('Nasser-PlayAI');
		});

		it('chat.createCompletion', async () => {
			(client.makeGroqcloudRequest as jest.Mock).mockResolvedValueOnce({
				choices: [],
			});
			const result = await Endpoints.chat.createCompletion(mockCtx, {
				model: 'llama3-8b-8192',
				messages: [],
			});
			expect(result).toEqual({ choices: [] });
			expect(client.makeGroqcloudRequest).toHaveBeenCalledWith(
				'chat/completions',
				'test_key',
				expect.objectContaining({ method: 'POST' }),
			);
		});

		it('chat.createResponse', async () => {
			// Shape captured from POST /openai/v1/responses: the reply is in
			// output[], and `text` is the echoed format config.
			const response = {
				id: 'resp_1',
				object: 'response',
				model: 'openai/gpt-oss-120b',
				status: 'completed',
				output: [
					{
						type: 'message',
						id: 'msg_1',
						role: 'assistant',
						content: [{ type: 'output_text', text: 'ok' }],
					},
				],
				text: { format: { type: 'text' } },
			};
			(client.makeGroqcloudRequest as jest.Mock).mockResolvedValueOnce(
				response,
			);
			const result = await Endpoints.chat.createResponse(mockCtx, {
				model: 'openai/gpt-oss-120b',
				input: 'say ok',
			});
			expect(result).toEqual(response);
			expect(client.makeGroqcloudRequest).toHaveBeenCalledWith(
				'responses',
				'test_key',
				expect.objectContaining({ method: 'POST' }),
			);
		});

		it('models.listModels', async () => {
			(client.makeGroqcloudRequest as jest.Mock).mockResolvedValueOnce({
				data: [],
			});
			const result = await Endpoints.models.listModels(mockCtx, {} as any);
			expect(result).toEqual({ data: [] });
			expect(client.makeGroqcloudRequest).toHaveBeenCalledWith(
				'models',
				'test_key',
				expect.objectContaining({ method: 'GET' }),
			);
		});

		it('models.retrieveModel', async () => {
			(client.makeGroqcloudRequest as jest.Mock).mockResolvedValueOnce({
				id: 'llama3-8b-8192',
			});
			const result = await Endpoints.models.retrieveModel(mockCtx, {
				model: 'llama3-8b-8192',
			});
			expect(result).toEqual({ id: 'llama3-8b-8192' });
			expect(client.makeGroqcloudRequest).toHaveBeenCalledWith(
				'models/llama3-8b-8192',
				'test_key',
				expect.objectContaining({ method: 'GET' }),
			);
		});
	});
});
