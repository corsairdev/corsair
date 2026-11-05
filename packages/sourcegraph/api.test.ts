import { AuthMissingError, logEventFromContext } from 'corsair/core';
import { ApiError, request } from 'corsair/http';
import {
	resolveInstanceUrl,
	SOURCEGRAPH_DEFAULT_INSTANCE,
	SOURCEGRAPH_GRAPHQL_PATH,
	SourcegraphAPIError,
	SourcegraphRateLimitError,
	sourcegraphGraphql,
	unwrapGraphqlData,
} from './client';
import {
	compareCommits,
	getCommitDetails,
	getFileContents,
	list,
	listFiles,
	listLanguages,
} from './endpoints/repository';
import { checkSettingsEditPermission } from './endpoints/site';
import {
	SourcegraphEndpointInputSchemas,
	SourcegraphEndpointOutputSchemas,
} from './endpoints/types';
import { getCurrent } from './endpoints/user';
import { errorHandlers } from './error-handlers';
import { sourcegraph } from './index';

jest.mock('corsair/core', () => {
	class AuthMissingError extends Error {
		constructor(plugin: string, authType: string) {
			super(`Missing ${authType} for ${plugin}`);
			this.name = 'AuthMissingError';
		}
	}
	return {
		AuthMissingError,
		logEventFromContext: jest.fn(),
	};
});

jest.mock('corsair/http', () => {
	const actual = jest.requireActual('corsair/http');
	return {
		...actual,
		request: jest.fn(),
	};
});

const mockRequest = request as jest.MockedFunction<typeof request>;

beforeEach(() => {
	mockRequest.mockReset();
	jest.mocked(logEventFromContext).mockReset();
});

const ctx = {
	key: 'sgp_test',
	options: { instanceUrl: undefined },
	$getAccountId: async () => 'test-account',
} as never;

function lastBody() {
	expect(mockRequest).toHaveBeenCalled();
	const [, options] = mockRequest.mock.calls[0] ?? [];
	expect(options?.url).toBe(SOURCEGRAPH_GRAPHQL_PATH);
	expect(options?.method).toBe('POST');
	return options?.body as {
		query: string;
		variables?: Record<string, unknown>;
	};
}

describe('Sourcegraph plugin', () => {
	it('registers api_key auth and 8 endpoints', () => {
		const plugin = sourcegraph();
		expect(plugin.id).toBe('sourcegraph');
		expect(plugin.authConfig?.api_key?.account).toEqual(['one']);
		expect(plugin.webhooks).toBeUndefined();
		expect(Object.keys(plugin.endpointSchemas ?? {})).toHaveLength(8);
	});

	it('returns an explicit key from keyBuilder', async () => {
		const plugin = sourcegraph({ key: 'explicit-key' });
		await expect(
			plugin.keyBuilder?.(
				{
					authType: 'api_key',
					keys: { get_api_key: async () => 'stored' },
				} as never,
				'endpoint',
			),
		).resolves.toBe('explicit-key');
	});

	it('throws AuthMissingError when no key is stored', async () => {
		const plugin = sourcegraph();
		await expect(
			plugin.keyBuilder?.(
				{
					authType: 'api_key',
					keys: { get_api_key: async () => undefined },
				} as never,
				'endpoint',
			),
		).rejects.toThrow(AuthMissingError);
	});
});

describe('client', () => {
	it('strips trailing slash and graphql path from instance URL', () => {
		expect(resolveInstanceUrl()).toBe(SOURCEGRAPH_DEFAULT_INSTANCE);
		expect(resolveInstanceUrl('https://sg.example.com/')).toBe(
			'https://sg.example.com',
		);
		expect(resolveInstanceUrl('https://sg.example.com/.api/graphql')).toBe(
			'https://sg.example.com',
		);
		expect(
			resolveInstanceUrl('https://sg.example.com/.api/graphql?trace=1'),
		).toBe('https://sg.example.com');
		expect(
			resolveInstanceUrl('https://sg.example.com/.api/graphql#console'),
		).toBe('https://sg.example.com');
	});

	it('rejects non-HTTPS instance URLs before any request', async () => {
		expect(() => resolveInstanceUrl('http://sg.example.com')).toThrow(
			SourcegraphAPIError,
		);
		await expect(
			sourcegraphGraphql(
				'sgp_x',
				'query { currentUser { username } }',
				undefined,
				'http://sg.example.com',
			),
		).rejects.toThrow(SourcegraphAPIError);
		expect(mockRequest).not.toHaveBeenCalled();
	});

	it('unwraps GraphQL data and surfaces GraphQL errors', () => {
		expect(unwrapGraphqlData({ data: { ok: true } })).toEqual({ ok: true });
		expect(() =>
			unwrapGraphqlData({ errors: [{ message: 'not found' }] }),
		).toThrow(SourcegraphAPIError);
	});

	it('sends Authorization token and no Bearer TOKEN', async () => {
		mockRequest.mockResolvedValue({ data: { currentUser: { username: 'a' } } });
		await sourcegraphGraphql('sgp_x', 'query { currentUser { username } }');
		const [config] = mockRequest.mock.calls[0] ?? [];
		expect(
			(config?.HEADERS as Record<string, string> | undefined)?.Authorization,
		).toBe('token sgp_x');
		expect(config?.TOKEN).toBeUndefined();
		expect(config?.BASE).toBe(SOURCEGRAPH_DEFAULT_INSTANCE);
	});
});

describe('official GraphQL mapping', () => {
	it('checks site settings edit permission', async () => {
		mockRequest.mockResolvedValue({
			data: {
				site: { id: 'site', viewerCanAdminister: false, canReloadSite: false },
				currentUser: { siteAdmin: false, viewerCanAdminister: true },
			},
		});
		const result = await checkSettingsEditPermission(ctx, {});
		expect(result.canEditSiteSettings).toBe(false);
		expect(lastBody().query).toContain('viewerCanAdminister');
	});

	it('gets the current user', async () => {
		mockRequest.mockResolvedValue({
			data: { currentUser: { id: 'u', username: 'alice' } },
		});
		const result = await getCurrent(ctx, {});
		expect(result.currentUser?.username).toBe('alice');
		expect(lastBody().query).toContain('currentUser');
	});

	it('lists repositories with cursor pagination', async () => {
		mockRequest.mockResolvedValue({
			data: {
				repositories: {
					nodes: [{ name: 'github.com/sourcegraph/sourcegraph' }],
					pageInfo: { hasNextPage: false, endCursor: null },
				},
			},
		});
		await list(ctx, { first: 3, after: 'cursor' });
		expect(lastBody().variables).toEqual({ first: 3, after: 'cursor' });
		expect(lastBody().query).toContain('repositories');
	});

	it('compares commits', async () => {
		mockRequest.mockResolvedValue({
			data: {
				repository: {
					comparison: {
						fileDiffs: { nodes: [{ newPath: 'README.md' }] },
					},
				},
			},
		});
		await compareCommits(ctx, {
			repo: 'github.com/sourcegraph/sourcegraph',
			base: 'HEAD~1',
			head: 'HEAD',
		});
		expect(lastBody().variables).toMatchObject({
			repo: 'github.com/sourcegraph/sourcegraph',
			base: 'HEAD~1',
			head: 'HEAD',
			first: 100,
		});
	});

	it('gets default-branch file contents', async () => {
		mockRequest.mockResolvedValue({
			data: {
				repository: {
					commit: {
						file: { path: 'README.md', content: '# hi', binary: false },
					},
				},
			},
		});
		await getFileContents(ctx, {
			repo_name: 'github.com/sourcegraph/sourcegraph',
			file_path: 'README.md',
		});
		expect(lastBody().variables).toEqual({
			repo: 'github.com/sourcegraph/sourcegraph',
			path: 'README.md',
		});
		expect(lastBody().query).toContain('file(path: $path)');
	});

	it('gets commit details', async () => {
		mockRequest.mockResolvedValue({
			data: {
				repository: {
					commit: { oid: 'abc', subject: 'fix' },
				},
			},
		});
		await getCommitDetails(ctx, {
			repo: 'github.com/sourcegraph/sourcegraph',
			rev: 'HEAD',
		});
		expect(lastBody().variables).toEqual({
			repo: 'github.com/sourcegraph/sourcegraph',
			rev: 'HEAD',
		});
	});

	it('lists repository files recursively by default', async () => {
		mockRequest.mockResolvedValue({
			data: {
				repository: {
					commit: {
						tree: {
							entries: [{ path: 'README.md', isDirectory: false }],
						},
					},
				},
			},
		});
		await listFiles(ctx, { repo_name: 'github.com/sourcegraph/sourcegraph' });
		expect(lastBody().variables).toEqual({
			repo: 'github.com/sourcegraph/sourcegraph',
			rev: 'HEAD',
			path: '',
			recursive: true,
		});
	});

	it('lists repository languages', async () => {
		mockRequest.mockResolvedValue({
			data: {
				repository: {
					name: 'github.com/sourcegraph/sourcegraph',
					language: 'Go',
					commit: { languages: ['Go', 'TypeScript'] },
				},
			},
		});
		await listLanguages(ctx, {
			repoName: 'github.com/sourcegraph/sourcegraph',
		});
		expect(lastBody().variables).toEqual({
			repo: 'github.com/sourcegraph/sourcegraph',
		});
	});
});

describe('zod schemas', () => {
	it('requires list pagination bounds', () => {
		expect(() =>
			SourcegraphEndpointInputSchemas.listRepositories.parse({ first: 0 }),
		).toThrow();
		expect(
			SourcegraphEndpointInputSchemas.listRepositories.parse({ first: 10 }),
		).toEqual({ first: 10 });
	});

	it('parses a current-user payload', () => {
		expect(
			SourcegraphEndpointOutputSchemas.getCurrentUser.parse({
				currentUser: { username: 'alice' },
			}).currentUser?.username,
		).toBe('alice');
	});
});

describe('error handlers', () => {
	it('retries 429', async () => {
		const error = new SourcegraphRateLimitError('slow', 1000);
		expect(errorHandlers.RATE_LIMIT_ERROR.match(error)).toBe(true);
		await expect(
			errorHandlers.RATE_LIMIT_ERROR.handler(error),
		).resolves.toEqual({ maxRetries: 5, headersRetryAfterMs: 1000 });
	});

	it('does not retry 401', async () => {
		const error = new ApiError(
			{ method: 'POST', url: '/.api/graphql' },
			{
				url: 'https://sourcegraph.com/.api/graphql',
				ok: false,
				status: 401,
				statusText: 'Unauthorized',
				body: { message: 'unauthorized' },
			},
			'unauthorized',
		);
		expect(errorHandlers.AUTH_ERROR.match(error)).toBe(true);
		await expect(errorHandlers.AUTH_ERROR.handler(error)).resolves.toEqual({
			maxRetries: 0,
		});
	});
});
