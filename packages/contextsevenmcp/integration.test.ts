import { ContextSevenMcp } from './endpoints';
import {
	ContextSevenMcpEndpointInputSchemas,
	ContextSevenMcpEndpointOutputSchemas,
} from './endpoints/types';
import type { ContextSevenMcpContext } from './index';

jest.mock('corsair/http', () => ({
	request: jest.fn(),
	ApiError: class extends Error {
		constructor(
			request: unknown,
			response: {
				url: string;
				status: number;
				statusText: string;
				body: unknown;
			},
			message: string,
		) {
			super(message);
			this.name = 'ApiError';
		}
	},
}));

jest.mock('corsair/core', () => {
	const actual = jest.requireActual('corsair/core') as Record<string, unknown>;
	return {
		...actual,
		logEventFromContext: jest.fn(),
	};
});

import { request } from 'corsair/http';

const mockRequest = jest.mocked(request);
const mockCtx = { key: 'ctx7sk-test' } as never as ContextSevenMcpContext;

const searchFixture = {
	results: [
		{
			id: '/vercel/next.js',
			title: 'Next.js',
			description: 'The React Framework',
		},
	],
	searchFilterApplied: false,
};

const contextFixture = {
	codeSnippets: [
		{
			codeTitle: 'Middleware',
			codeDescription: 'Auth check',
			codeLanguage: 'typescript',
			codeTokens: 12,
			codeId: 'https://example.com/middleware',
			pageTitle: 'Middleware',
			codeList: [
				{ language: 'typescript', code: 'export function middleware() {}' },
			],
		},
	],
	infoSnippets: [
		{
			pageId: 'https://example.com/middleware',
			content: 'Middleware runs before a request completes.',
			contentTokens: 8,
		},
	],
};

beforeEach(() => {
	mockRequest.mockReset();
});

describe('Context7 endpoints (mocked)', () => {
	it('library.search posts to /v2/libs/search and validates output', async () => {
		mockRequest.mockResolvedValueOnce(searchFixture);

		const result = await ContextSevenMcp.librarySearch(mockCtx, {
			libraryName: 'nextjs',
			query: 'app router',
		});

		const call = mockRequest.mock.calls[0];
		expect(call?.[0]).toMatchObject({ BASE: 'https://context7.com/api' });
		expect(call?.[1]).toMatchObject({
			method: 'GET',
			url: '/v2/libs/search',
			query: {
				libraryName: 'nextjs',
				query: 'app router',
			},
		});
		const validated =
			ContextSevenMcpEndpointOutputSchemas.librarySearch.parse(result);
		expect(validated.results[0]?.id).toBe('/vercel/next.js');
		expect(validated.searchFilterApplied).toBe(false);
	});

	it('context.get requests json context and validates output', async () => {
		mockRequest.mockResolvedValueOnce(contextFixture);

		const result = await ContextSevenMcp.contextGet(mockCtx, {
			libraryId: '/vercel/next.js',
			query: 'How do I use middleware?',
		});

		expect(mockRequest.mock.calls[0]?.[1]).toMatchObject({
			method: 'GET',
			url: '/v2/context',
			query: {
				libraryId: '/vercel/next.js',
				query: 'How do I use middleware?',
				type: 'json',
			},
		});
		const validated =
			ContextSevenMcpEndpointOutputSchemas.contextGet.parse(result);
		expect(validated.codeSnippets[0]?.codeTitle).toBe('Middleware');
		expect(validated.infoSnippets[0]?.contentTokens).toBe(8);
	});

	it('rejects search and context input missing required fields', () => {
		expect(() =>
			ContextSevenMcpEndpointInputSchemas.librarySearch.parse({}),
		).toThrow();
		expect(() =>
			ContextSevenMcpEndpointInputSchemas.contextGet.parse({
				libraryId: '/vercel/next.js',
			}),
		).toThrow();
	});

	it('throws when the API omits required output fields', async () => {
		mockRequest.mockResolvedValueOnce({});
		await expect(
			ContextSevenMcp.librarySearch(mockCtx, {
				libraryName: 'react',
				query: 'state',
			}),
		).rejects.toThrow();
	});
});
