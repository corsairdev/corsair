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
