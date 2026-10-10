import 'dotenv/config';
import { makeWriterRequest } from './client';
import type {
	ChatInput,
	CompletionInput,
	WriterEndpointOutputs,
} from './endpoints/types';
import { WriterEndpointOutputSchemas } from './endpoints/types';

const TEST_API_KEY = process.env.WRITER_API_KEY;

const describeLive = TEST_API_KEY ? describe : describe.skip;

describeLive('Writer API Live Tests', () => {
	const apiKey = TEST_API_KEY ?? '';

	describe('models', () => {
		it('listModels returns available models', async () => {
			const response = await makeWriterRequest<
				WriterEndpointOutputs['listModels']
			>('/models', apiKey, 'GET');

			const parsed = WriterEndpointOutputSchemas.listModels.parse(response);
			expect(parsed.models).toBeDefined();
			expect(Array.isArray(parsed.models)).toBe(true);
			expect(parsed.models.length).toBeGreaterThan(0);
			expect(parsed.models[0]?.id).toBeDefined();
		});
	});

	describe('completions', () => {
		it('createCompletion generates text completion', async () => {
			const input: CompletionInput = {
				model: 'palmyra-creative',
				prompt: 'Once upon a time in a galaxy',
				max_tokens: 15,
				stream: false,
			};

			const response = await makeWriterRequest<
				WriterEndpointOutputs['createCompletion']
			>('/completions', apiKey, 'POST', input);

			const parsed =
				WriterEndpointOutputSchemas.createCompletion.parse(response);
			expect(parsed.choices).toBeDefined();
			expect(parsed.choices.length).toBeGreaterThan(0);
			expect(typeof parsed.choices[0]?.text).toBe('string');
			expect(parsed.model).toBeDefined();
		});
	});

	describe('chat', () => {
		it('createChat generates chat completion', async () => {
			const input: ChatInput = {
				model: 'palmyra-x5',
				messages: [
					{
						role: 'user',
						content: 'Say hello in exactly one word.',
					},
				],
				stream: false,
			};

			const response = await makeWriterRequest<
				WriterEndpointOutputs['createChat']
			>('/chat', apiKey, 'POST', input);

			const parsed = WriterEndpointOutputSchemas.createChat.parse(response);
			expect(parsed.id).toBeDefined();
			expect(parsed.choices.length).toBeGreaterThan(0);
			expect(parsed.choices[0]?.message.role).toBe('assistant');
			expect(typeof parsed.choices[0]?.message.content).toBe('string');
		});
	});

	describe('files', () => {
		it('listFiles returns file list with pagination metadata', async () => {
			const response = await makeWriterRequest<
				WriterEndpointOutputs['listFiles']
			>('/files', apiKey, 'GET');

			const parsed = WriterEndpointOutputSchemas.listFiles.parse(response);
			expect(Array.isArray(parsed.data)).toBe(true);
			expect(
				typeof parsed.has_more === 'boolean' || parsed.has_more === undefined,
			).toBe(true);
		});
	});

	describe('knowledgeGraphs', () => {
		it('listKnowledgeGraphs returns graphs list', async () => {
			const response = await makeWriterRequest<
				WriterEndpointOutputs['listKnowledgeGraphs']
			>('/graphs', apiKey, 'GET');

			const parsed =
				WriterEndpointOutputSchemas.listKnowledgeGraphs.parse(response);
			expect(Array.isArray(parsed.data)).toBe(true);
			expect(
				typeof parsed.has_more === 'boolean' || parsed.has_more === undefined,
			).toBe(true);
		});
	});

	describe('applications', () => {
		it('listApplications returns application list', async () => {
			const response = await makeWriterRequest<
				WriterEndpointOutputs['listApplications']
			>('/applications', apiKey, 'GET');

			const parsed =
				WriterEndpointOutputSchemas.listApplications.parse(response);
			expect(Array.isArray(parsed.data)).toBe(true);
			expect(
				typeof parsed.has_more === 'boolean' || parsed.has_more === undefined,
			).toBe(true);
		});
	});
});
