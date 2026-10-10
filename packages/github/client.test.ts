import { request } from 'corsair/http';
import { makeGithubRequest } from './client';

jest.mock('corsair/http', () => ({ request: jest.fn() }));

const mockRequest = request as unknown as jest.Mock;

// ENG-34: GitHub's REST API returns snake_case, but the plugin's response
// types and DB schemas are camelCase. Without conversion, camelCase field
// access (issue.htmlUrl, pr.createdAt) is undefined at runtime.
describe('makeGithubRequest response casing (ENG-34)', () => {
	beforeEach(() => mockRequest.mockReset());

	it('converts snake_case REST fields to camelCase, including nested objects', async () => {
		mockRequest.mockResolvedValueOnce({
			id: 1,
			node_id: 'I_abc',
			html_url: 'https://github.com/o/r/issues/1',
			created_at: '2026-01-01T00:00:00Z',
			user: { id: 2, login: 'octocat', avatar_url: 'https://a/2' },
		});

		const result = await makeGithubRequest<Record<string, unknown>>(
			'/repos/o/r/issues/1',
			'token',
		);

		expect(result.htmlUrl).toBe('https://github.com/o/r/issues/1');
		expect(result.nodeId).toBe('I_abc');
		expect(result.createdAt).toBe('2026-01-01T00:00:00Z');
		expect((result.user as Record<string, unknown>).avatarUrl).toBe(
			'https://a/2',
		);
		expect(result.html_url).toBeUndefined();
	});

	it('converts snake_case fields inside array (list) responses', async () => {
		mockRequest.mockResolvedValueOnce([
			{ id: 1, full_name: 'o/r', html_url: 'https://github.com/o/r' },
		]);

		const result = await makeGithubRequest<Record<string, unknown>[]>(
			'/user/repos',
			'token',
		);

		expect(result[0]!.fullName).toBe('o/r');
		expect(result[0]!.htmlUrl).toBe('https://github.com/o/r');
	});

	it('converts camelCase query params to snake_case for GitHub REST', async () => {
		mockRequest.mockResolvedValueOnce([]);

		await makeGithubRequest<unknown[]>('/repos/o/r/issues/comments', 'token', {
			query: { perPage: 100, page: 2, state: 'all' },
		});

		expect(mockRequest.mock.calls[0]?.[1]?.query).toEqual({
			per_page: 100,
			page: 2,
			state: 'all',
		});
	});

	// #1867: list endpoints were sending ?perPage=1 which GitHub silently
	// drops (only per_page is honored), so pagination looked ignored.
	it('sends perPage as per_page so list pagination is honored (#1867)', async () => {
		mockRequest.mockResolvedValueOnce([{ id: 1 }]);

		await makeGithubRequest<unknown[]>('/repos/o/r/issues', 'token', {
			query: { perPage: 1, page: 1, state: 'all' },
		});

		const sentQuery = mockRequest.mock.calls[0]?.[1]?.query;
		expect(sentQuery).toEqual({ per_page: 1, page: 1, state: 'all' });
		expect(sentQuery).not.toHaveProperty('perPage');
	});

	it('converts other camelCase list params and drops undefined values', async () => {
		mockRequest.mockResolvedValueOnce([]);

		await makeGithubRequest<unknown[]>('/repos/o/r/actions/runs', 'token', {
			query: {
				perPage: 10,
				excludePullRequests: true,
				checkSuiteId: 42,
				headSha: 'abc123',
				sort: undefined,
			},
		});

		expect(mockRequest.mock.calls[0]?.[1]?.query).toEqual({
			per_page: 10,
			exclude_pull_requests: true,
			check_suite_id: 42,
			head_sha: 'abc123',
		});
	});

	it('camelCases search envelope fields and the nested pull_request marker', async () => {
		mockRequest.mockResolvedValueOnce({
			total_count: 1,
			incomplete_results: false,
			items: [
				{
					id: 10,
					html_url: 'https://github.com/o/r/issues/10',
					pull_request: {
						html_url: 'https://github.com/o/r/pull/10',
						merged_at: null,
					},
				},
			],
		});

		const result = await makeGithubRequest<Record<string, unknown>>(
			'/search/issues',
			'token',
		);

		expect(result.totalCount).toBe(1);
		expect(result.incompleteResults).toBe(false);
		const items = result.items as Record<string, unknown>[];
		const marker = items[0]!.pullRequest as Record<string, unknown>;
		expect(marker.htmlUrl).toBe('https://github.com/o/r/pull/10');
	});
});
