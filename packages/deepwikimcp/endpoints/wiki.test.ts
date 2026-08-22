import { logEventFromContext } from 'corsair/core';
import { makeDeepwikiMcpRequest } from '../client';
import { askQuestion, readWikiContents, readWikiStructure } from './wiki';

jest.mock('corsair/core', () => ({
	logEventFromContext: jest.fn(),
}));
jest.mock('../client', () => ({
	makeDeepwikiMcpRequest: jest.fn(),
}));

const requestMock = jest.mocked(makeDeepwikiMcpRequest);
const logMock = jest.mocked(logEventFromContext);
const context = { key: 'test-key' } as Parameters<typeof askQuestion>[0];

beforeEach(() => {
	requestMock.mockResolvedValue({
		content: [{ type: 'text', text: 'result' }],
	});
});

afterEach(() => {
	jest.clearAllMocks();
});

describe('DeepWiki endpoints', () => {
	it('calls ask_question with repository and question', async () => {
		const input = { repoName: 'facebook/react', question: 'What is React?' };
		await askQuestion(context, input);

		expect(requestMock).toHaveBeenCalledWith(
			'mcp',
			'test-key',
			expect.objectContaining({
				method: 'POST',
				body: expect.objectContaining({
					method: 'tools/call',
					params: { name: 'ask_question', arguments: input },
				}),
			}),
		);
		expect(logMock).toHaveBeenCalledWith(
			context,
			'deepwikimcp.ask_question',
			input,
			'completed',
		);
	});

	it('calls read_wiki_contents with repository', async () => {
		const input = { repoName: 'facebook/react' };
		await readWikiContents(context, input);

		expect(requestMock).toHaveBeenCalledWith(
			'mcp',
			'test-key',
			expect.objectContaining({
				body: expect.objectContaining({
					params: { name: 'read_wiki_contents', arguments: input },
				}),
			}),
		);
		expect(logMock).toHaveBeenCalledWith(
			context,
			'deepwikimcp.read_wiki_contents',
			input,
			'completed',
		);
	});

	it('calls read_wiki_structure with repository', async () => {
		const input = { repoName: 'facebook/react' };
		await readWikiStructure(context, input);

		expect(requestMock).toHaveBeenCalledWith(
			'mcp',
			'test-key',
			expect.objectContaining({
				body: expect.objectContaining({
					params: { name: 'read_wiki_structure', arguments: input },
				}),
			}),
		);
		expect(logMock).toHaveBeenCalledWith(
			context,
			'deepwikimcp.read_wiki_structure',
			input,
			'completed',
		);
	});
});
