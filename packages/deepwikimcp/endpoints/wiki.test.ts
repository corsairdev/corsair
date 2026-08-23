import { logEventFromContext } from 'corsair/core';
import { callDeepwikiMcpTool } from '../client';
import { DeepwikiMcpEndpointOutputSchemas } from './types';
import { askQuestion, readWikiContents, readWikiStructure } from './wiki';

jest.mock('corsair/core', () => ({
	logEventFromContext: jest.fn(),
}));
jest.mock('../client', () => ({
	callDeepwikiMcpTool: jest.fn(),
}));

const callMock = jest.mocked(callDeepwikiMcpTool);
const logMock = jest.mocked(logEventFromContext);
const context = { key: 'test-key' } as Parameters<typeof askQuestion>[0];

beforeEach(() => {
	callMock.mockResolvedValue({
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

		expect(callMock).toHaveBeenCalledWith(
			'ask_question',
			input,
			'test-key',
			DeepwikiMcpEndpointOutputSchemas.askQuestion,
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

		expect(callMock).toHaveBeenCalledWith(
			'read_wiki_contents',
			input,
			'test-key',
			DeepwikiMcpEndpointOutputSchemas.readWikiContents,
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

		expect(callMock).toHaveBeenCalledWith(
			'read_wiki_structure',
			input,
			'test-key',
			DeepwikiMcpEndpointOutputSchemas.readWikiStructure,
		);
		expect(logMock).toHaveBeenCalledWith(
			context,
			'deepwikimcp.read_wiki_structure',
			input,
			'completed',
		);
	});
});
