import type { EventLoggingContext } from 'corsair/core';
import * as core from 'corsair/core';
import { AuthMissingError } from 'corsair/core';
import * as client from '../client';
import {
	addFileToGraph,
	analyzeImages,
	askQuestionToKnowledgeGraph,
	createChat,
	createCompletion,
	createKnowledgeGraph,
	deleteFile,
	deleteKnowledgeGraph,
	detectAiContent,
	downloadFile,
	getFile,
	listApplications,
	listFiles,
	listKnowledgeGraphs,
	listModels,
	medicalComprehend,
	parsePdf,
	removeFileFromGraph,
	retrieveKnowledgeGraph,
	translateText,
	updateKnowledgeGraph,
	uploadFile,
	webSearch,
} from './writer';

jest.mock('../client', () => ({
	makeWriterRequest: jest.fn(),
}));

jest.mock('corsair/core', () => {
	const actual = jest.requireActual('corsair/core');
	return {
		...actual,
		logEventFromContext: jest.fn().mockResolvedValue('event-id'),
	};
});

const mockedRequest = jest.mocked(client.makeWriterRequest);
const mockedLogEvent = jest.mocked(core.logEventFromContext);

type TestContext = EventLoggingContext & {
	key?: string;
	$getAccountId: jest.Mock<Promise<string>, []>;
	database?: unknown;
};

function createContext(key = 'writer-test-api-key'): TestContext {
	return {
		key,
		database: undefined,
		$getAccountId: jest.fn().mockResolvedValue('acct_123'),
	};
}

describe('Writer endpoints', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('lists models with query params', async () => {
		const ctx = createContext();
		const input = {};
		const response = { models: [{ id: 'palmyra-x5', name: 'Palmyra X5' }] };
		mockedRequest.mockResolvedValueOnce(response);

		const result = await listModels(ctx, input);

		expect(result).toEqual(response);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/models',
			ctx.key,
			'GET',
			input,
		);
		expect(mockedLogEvent).toHaveBeenCalledWith(
			ctx,
			'writer.models.list',
			{},
			'completed',
		);
	});

	it('creates completion and logs only model metadata', async () => {
		const ctx = createContext();
		const input = {
			model: 'palmyra-x5',
			prompt: 'secret prompt',
			stream: false as const,
		};
		const response = {
			choices: [{ text: 'result text' }],
			model: 'palmyra-x5',
		};
		mockedRequest.mockResolvedValueOnce(response);

		const result = await createCompletion(ctx, input);

		expect(result).toEqual(response);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/completions',
			ctx.key,
			'POST',
			input,
		);
		expect(mockedLogEvent).toHaveBeenCalledWith(
			ctx,
			'writer.completions.create',
			{ model: 'palmyra-x5' },
			'completed',
		);
		expect(mockedLogEvent).not.toHaveBeenCalledWith(
			ctx,
			'writer.completions.create',
			expect.objectContaining({ prompt: expect.any(String) }),
			expect.anything(),
		);
	});

	it('creates chat and logs only model metadata', async () => {
		const ctx = createContext();
		const input = {
			model: 'palmyra-x5',
			messages: [{ role: 'user' as const, content: 'secret message' }],
			stream: false as const,
		};
		const response = {
			id: 'chatcmpl-1',
			object: 'chat.completion' as const,
			choices: [
				{
					index: 0,
					finish_reason: 'stop',
					message: { role: 'assistant', content: 'hi' },
				},
			],
			created: 1,
			model: 'palmyra-x5',
		};
		mockedRequest.mockResolvedValueOnce(response);

		const result = await createChat(ctx, input);

		expect(result).toEqual(response);
		expect(mockedRequest).toHaveBeenCalledWith('/chat', ctx.key, 'POST', input);
		expect(mockedLogEvent).toHaveBeenCalledWith(
			ctx,
			'writer.chat.create',
			{ model: 'palmyra-x5' },
			'completed',
		);
		expect(mockedLogEvent).not.toHaveBeenCalledWith(
			ctx,
			'writer.chat.create',
			expect.objectContaining({ messages: expect.any(Array) }),
			expect.anything(),
		);
	});

	it('lists files with pagination filters', async () => {
		const ctx = createContext();
		const input = { limit: 5, after: 'f_1', status: 'completed' as const };
		const response = { data: [{ id: 'f_2' }], has_more: false };
		mockedRequest.mockResolvedValueOnce(response);

		await expect(listFiles(ctx, input)).resolves.toEqual(response);
		expect(mockedRequest).toHaveBeenCalledWith('/files', ctx.key, 'GET', input);
	});

	it('uploads file via multipart form-data', async () => {
		const ctx = createContext();
		const input = {
			content: Buffer.from('hello').toString('base64'),
			contentType: 'text/plain',
			filename: 'hello.txt',
			graphId: 'g_1',
		};
		const response = { id: 'f_123', name: 'hello.txt' };
		mockedRequest.mockResolvedValueOnce(response);

		await expect(uploadFile(ctx, input)).resolves.toEqual(response);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/files',
			ctx.key,
			'POST',
			expect.any(FormData),
			{ graphId: 'g_1' },
		);
	});

	it('retrieves, downloads, and deletes files', async () => {
		const ctx = createContext();
		mockedRequest
			.mockResolvedValueOnce({ id: 'f_1' })
			.mockResolvedValueOnce('BINARY')
			.mockResolvedValueOnce({ id: 'f_1', deleted: true });

		await expect(getFile(ctx, { file_id: 'f_1' })).resolves.toEqual({
			id: 'f_1',
		});
		await expect(downloadFile(ctx, { file_id: 'f_1' })).resolves.toEqual(
			'BINARY',
		);
		await expect(deleteFile(ctx, { file_id: 'f_1' })).resolves.toEqual({
			id: 'f_1',
			deleted: true,
		});

		expect(mockedRequest).toHaveBeenNthCalledWith(
			1,
			'/files/f_1',
			ctx.key,
			'GET',
		);
		expect(mockedRequest).toHaveBeenNthCalledWith(
			2,
			'/files/f_1/download',
			ctx.key,
			'GET',
			undefined,
			undefined,
			'application/octet-stream',
		);
		expect(mockedRequest).toHaveBeenNthCalledWith(
			3,
			'/files/f_1',
			ctx.key,
			'DELETE',
		);
	});

	it('handles knowledge graph lifecycle and graph-file operations', async () => {
		const ctx = createContext();
		mockedRequest
			.mockResolvedValueOnce({ data: [{ id: 'g_1' }], has_more: false })
			.mockResolvedValueOnce({ id: 'g_2', name: 'Graph 2' })
			.mockResolvedValueOnce({ id: 'g_2', name: 'Graph 2' })
			.mockResolvedValueOnce({ id: 'g_2', name: 'Graph 2 updated' })
			.mockResolvedValueOnce({ id: 'g_2', deleted: true })
			.mockResolvedValueOnce({ id: 'f_1', graph_ids: ['g_2'] })
			.mockResolvedValueOnce({ id: 'f_1', deleted: true })
			.mockResolvedValueOnce({ question: 'Q', answer: 'A', sources: [] });

		await listKnowledgeGraphs(ctx, { limit: 20, order: 'asc' });
		await createKnowledgeGraph(ctx, { name: 'Graph 2' });
		await retrieveKnowledgeGraph(ctx, { graph_id: 'g_2' });
		await updateKnowledgeGraph(ctx, {
			graph_id: 'g_2',
			name: 'Graph 2 updated',
		});
		await deleteKnowledgeGraph(ctx, { graph_id: 'g_2' });
		await addFileToGraph(ctx, { graph_id: 'g_2', file_id: 'f_1' });
		await removeFileFromGraph(ctx, { graph_id: 'g_2', file_id: 'f_1' });
		await askQuestionToKnowledgeGraph(ctx, {
			graph_ids: ['g_2'],
			question: 'Q',
			stream: false,
		});

		expect(mockedRequest).toHaveBeenNthCalledWith(
			1,
			'/graphs',
			ctx.key,
			'GET',
			{ limit: 20, order: 'asc' },
		);
		expect(mockedRequest).toHaveBeenNthCalledWith(
			2,
			'/graphs',
			ctx.key,
			'POST',
			{ name: 'Graph 2' },
		);
		expect(mockedRequest).toHaveBeenNthCalledWith(
			3,
			'/graphs/g_2',
			ctx.key,
			'GET',
		);
		expect(mockedRequest).toHaveBeenNthCalledWith(
			4,
			'/graphs/g_2',
			ctx.key,
			'PUT',
			{ name: 'Graph 2 updated' },
		);
		expect(mockedRequest).toHaveBeenNthCalledWith(
			5,
			'/graphs/g_2',
			ctx.key,
			'DELETE',
		);
		expect(mockedRequest).toHaveBeenNthCalledWith(
			6,
			'/graphs/g_2/file',
			ctx.key,
			'POST',
			{ file_id: 'f_1' },
		);
		expect(mockedRequest).toHaveBeenNthCalledWith(
			7,
			'/graphs/g_2/file/f_1',
			ctx.key,
			'DELETE',
		);
		expect(mockedRequest).toHaveBeenNthCalledWith(
			8,
			'/graphs/question',
			ctx.key,
			'POST',
			{ graph_ids: ['g_2'], question: 'Q', stream: false },
		);
	});

	it('lists applications with pagination', async () => {
		const ctx = createContext();
		const response = { data: [{ id: 'app_1' }], has_more: false };
		mockedRequest.mockResolvedValueOnce(response);

		await expect(
			listApplications(ctx, { limit: 3, search: 'test' }),
		).resolves.toEqual(response);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/applications',
			ctx.key,
			'GET',
			{
				limit: 3,
				search: 'test',
			},
		);
	});

	it('calls parsePdf and webSearch tool endpoints', async () => {
		const ctx = createContext();
		mockedRequest
			.mockResolvedValueOnce({ markdown: '# parsed' })
			.mockResolvedValueOnce({ results: [{ title: 'Result' }] });

		await expect(
			parsePdf(ctx, { file_id: 'f_1', format: 'markdown' }),
		).resolves.toEqual({ markdown: '# parsed' });
		await expect(
			webSearch(ctx, { query: 'corsair', count: 3 }),
		).resolves.toEqual({
			results: [{ title: 'Result' }],
		});

		expect(mockedRequest).toHaveBeenNthCalledWith(
			1,
			'/tools/pdf-parser/f_1',
			ctx.key,
			'POST',
			{ format: 'markdown' },
		);
		expect(mockedRequest).toHaveBeenNthCalledWith(
			2,
			'/tools/web-search',
			ctx.key,
			'POST',
			{ query: 'corsair', count: 3 },
		);
	});

	it('calls analyzeImages and translation via chat endpoint', async () => {
		const ctx = createContext();
		mockedRequest
			.mockResolvedValueOnce({ id: 'vision_1', choices: [] })
			.mockResolvedValueOnce({ choices: [{ message: { content: 'Hola' } }] });

		await expect(
			analyzeImages(ctx, {
				model: 'palmyra-x5',
				input: [{ type: 'input_text', text: 'describe' }],
				stream: false,
			}),
		).resolves.toEqual({ id: 'vision_1', choices: [] });

		await expect(
			translateText(ctx, {
				text: 'Hello',
				target_language: 'es',
			}),
		).resolves.toEqual({ translation: 'Hola' });

		expect(mockedRequest).toHaveBeenNthCalledWith(
			1,
			'/vision',
			ctx.key,
			'POST',
			{
				model: 'palmyra-x5',
				input: [{ type: 'input_text', text: 'describe' }],
				stream: false,
			},
		);
		expect(mockedRequest).toHaveBeenNthCalledWith(
			2,
			'/chat',
			ctx.key,
			'POST',
			expect.objectContaining({
				model: 'palmyra-x5',
				stream: false,
			}),
		);
	});

	it('calls detectAiContent against enterprise host and medicalComprehend', async () => {
		const ctx = createContext();
		mockedRequest.mockResolvedValueOnce([{ label: 'human', confidence: 0.9 }]);
		mockedRequest.mockResolvedValueOnce({
			choices: [{ message: { content: 'entity' } }],
		});

		await expect(
			detectAiContent(ctx, { organizationId: 42, text: 'sample text' }),
		).resolves.toEqual([{ label: 'human', confidence: 0.9 }]);

		await expect(
			medicalComprehend(ctx, { text: 'Patient has cough.' }),
		).resolves.toEqual({ choices: [{ message: { content: 'entity' } }] });

		expect(mockedRequest).toHaveBeenNthCalledWith(
			1,
			'/content/organization/42/detect',
			ctx.key,
			'POST',
			{ text: 'sample text' },
			undefined,
			'application/json; charset=utf-8',
			'https://enterprise-api.writer.com',
		);
		expect(mockedRequest).toHaveBeenNthCalledWith(
			2,
			'/chat',
			ctx.key,
			'POST',
			expect.objectContaining({ model: 'palmyra-med', stream: false }),
		);
	});

	it('throws AuthMissingError when key is missing', async () => {
		const ctx = createContext('');

		await expect(listModels(ctx, {})).rejects.toBeInstanceOf(AuthMissingError);
		expect(mockedRequest).not.toHaveBeenCalled();
	});
});
