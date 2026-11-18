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

describe('makeGithubRequest request body casing', () => {
	beforeEach(() => {
		mockRequest.mockReset();
		mockRequest.mockResolvedValue({});
	});

	it('converts release options while preserving existing snake_case keys', async () => {
		await makeGithubRequest('/repos/o/r/releases', 'token', {
			method: 'POST',
			body: {
				tag_name: 'v1.0.0',
				target_commitish: 'main',
				generateReleaseNotes: true,
				draft: false,
			},
		});

		expect(mockRequest).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({
				method: 'POST',
				body: {
					tag_name: 'v1.0.0',
					target_commitish: 'main',
					generate_release_notes: true,
					draft: false,
				},
			}),
		);
	});

	it('converts review options and nested multiline comments without mutating input', async () => {
		const body = {
			commitId: 'abc123',
			event: 'COMMENT',
			comments: [
				{
					path: 'src/index.ts',
					body: 'Please check this range.',
					line: 12,
					side: 'RIGHT',
					startLine: 10,
					startSide: 'RIGHT',
				},
			],
		};
		const original = structuredClone(body);

		await makeGithubRequest('/repos/o/r/pulls/1/reviews', 'token', {
			method: 'POST',
			body,
		});

		expect(mockRequest).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({
				body: {
					commit_id: 'abc123',
					event: 'COMMENT',
					comments: [
						{
							path: 'src/index.ts',
							body: 'Please check this range.',
							line: 12,
							side: 'RIGHT',
							start_line: 10,
							start_side: 'RIGHT',
						},
					],
				},
			}),
		);
		expect(body).toEqual(original);
	});

	it.each(['POST', 'PUT', 'PATCH'] as const)(
		'converts %s bodies and preserves false, zero, null, and arrays',
		async (method) => {
			await makeGithubRequest('/test', 'token', {
				method,
				body: {
					isEnabled: false,
					itemCount: 0,
					optionalValue: null,
					nestedItems: [{ displayName: 'KeepThisValue' }],
				},
			});

			expect(mockRequest).toHaveBeenCalledWith(
				expect.anything(),
				expect.objectContaining({
					method,
					body: {
						is_enabled: false,
						item_count: 0,
						optional_value: null,
						nested_items: [{ display_name: 'KeepThisValue' }],
					},
				}),
			);
		},
	);

	it('keeps an omitted write body undefined', async () => {
		await makeGithubRequest('/test', 'token', { method: 'POST' });

		expect(mockRequest).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({ body: undefined }),
		);
	});
});
