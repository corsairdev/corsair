import { OllamaAPIError } from './client';
import { ollama } from './index';

jest.mock('./client', () => {
	const actual = jest.requireActual('./client');
	return {
		...actual,
		makeOllamaRequest: jest.fn(
			async (endpoint: string, _keyOrCtx: any, options: any) => {
				if (endpoint === '/api/chat') {
					return {
						model: options.body?.model ?? 'llama3',
						created_at: '2026-07-22T10:00:00Z',
						message: {
							role: 'assistant',
							content: 'Hello from Ollama!',
						},
						done: true,
					};
				}
				if (endpoint === '/api/generate') {
					return {
						model: options.body?.model ?? 'llama3',
						created_at: '2026-07-22T10:00:00Z',
						response: 'Generated text response',
						done: true,
					};
				}
				if (endpoint === '/api/version') {
					return { version: '0.1.30' };
				}
				if (endpoint === '/api/tags') {
					return {
						models: [
							{
								name: 'llama3:latest',
								model: 'llama3:latest',
								size: 4700000000,
								digest: 'abc123digest',
								details: { format: 'gguf', family: 'llama' },
							},
						],
					};
				}
				if (endpoint === '/api/show') {
					return {
						modelfile: '# Modelfile for llama3',
						parameters: 'stop "\n"',
						template: '{{ .Prompt }}',
						details: { format: 'gguf', family: 'llama' },
					};
				}
				if (endpoint === '/v1/models') {
					return {
						object: 'list',
						data: [
							{
								id: 'llama3',
								object: 'model',
								created: 1700000000,
								owned_by: 'library',
							},
						],
					};
				}
				if (endpoint === '/v1/chat/completions') {
					return {
						id: 'chatcmpl-123',
						object: 'chat.completion',
						created: 1700000000,
						model: options.body?.model ?? 'llama3',
						choices: [
							{
								index: 0,
								message: {
									role: 'assistant',
									content: 'OpenAI-compatible chat response',
								},
								finish_reason: 'stop',
							},
						],
					};
				}
				if (endpoint === '/v1/completions') {
					return {
						id: 'cmpl-123',
						object: 'text_completion',
						created: 1700000000,
						model: options.body?.model ?? 'llama3',
						choices: [
							{
								index: 0,
								text: 'OpenAI-compatible text completion',
								finish_reason: 'stop',
							},
						],
					};
				}
				return { success: true };
			},
		),
	};
});

describe('Ollama Plugin API Tests', () => {
	const plugin = ollama({
		host: 'http://localhost:11434',
	});
	const endpoints = plugin.endpoints!;
	const ctx = {
		key: '',
		authType: 'api_key' as const,
		options: { host: 'http://localhost:11434' },
		$getAccountId: () => 'acc_test',
	} as any;

	describe('Error Metadata', () => {
		it('preserves status code on OllamaAPIError', () => {
			const err = new OllamaAPIError('Connection refused', 500);
			expect(err.status).toBe(500);
			expect(err.message).toBe('Connection refused');
		});
	});

	describe('Chat & Generation Actions', () => {
		it('sends chat message and gets completion', async () => {
			const res = await endpoints.chat.chat(ctx, {
				model: 'llama3',
				messages: [{ role: 'user', content: 'Hello' }],
			});
			expect(res.message.content).toBe('Hello from Ollama!');
			expect(res.done).toBe(true);
		});

		it('generates text with model', async () => {
			const res = await endpoints.chat.generate(ctx, {
				model: 'llama3',
				prompt: 'Once upon a time',
				raw: true,
			});
			expect(res.response).toBe('Generated text response');
			expect(res.done).toBe(true);
		});
	});

	describe('Model Actions', () => {
		it('fetches version', async () => {
			const res = await endpoints.models.version(ctx, {});
			expect(res.version).toBe('0.1.30');
		});

		it('lists available models', async () => {
			const res = await endpoints.models.listModels(ctx, {});
			expect(res.models.length).toBe(1);
			expect(res.models[0]?.name).toBe('llama3:latest');
		});

		it('shows model information', async () => {
			const res = await endpoints.models.showModel(ctx, { model: 'llama3' });
			expect(res.modelfile).toBe('# Modelfile for llama3');
		});
	});

	describe('OpenAI Compatibility Actions', () => {
		it('lists models in OpenAI format', async () => {
			const res = await endpoints.openai.listOpenAiModels(ctx, {});
			expect(res.object).toBe('list');
			expect(res.data[0]?.id).toBe('llama3');
		});

		it('creates OpenAI-compatible chat completion', async () => {
			const res = await endpoints.openai.createOpenAiChatCompletion(ctx, {
				model: 'llama3',
				messages: [{ role: 'user', content: 'Hi' }],
			});
			expect(res.id).toBe('chatcmpl-123');
			expect(res.choices[0]?.message.content).toBe(
				'OpenAI-compatible chat response',
			);
		});

		it('creates OpenAI-compatible text completion', async () => {
			const res = await endpoints.openai.createOpenAiCompletion(ctx, {
				model: 'llama3',
				prompt: 'Say hello',
			});
			expect(res.id).toBe('cmpl-123');
			expect(res.choices[0]?.text).toBe('OpenAI-compatible text completion');
		});
	});
});
