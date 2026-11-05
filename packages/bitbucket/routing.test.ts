import { request } from 'corsair/http';
import { buildBitbucketWireRequest } from './endpoints/factory';
import { bitbucketOperationCatalog } from './endpoints/operations';
import { BitbucketEndpointInputSchemas } from './endpoints/types';
import { bitbucket } from './index';

jest.mock('corsair/http', () => {
	const actual = jest.requireActual('corsair/http');
	return { ...actual, request: jest.fn() };
});
const mockRequest = request as jest.MockedFunction<typeof request>;
type Endpoint = (ctx: unknown, input: unknown) => Promise<unknown>;
function context() {
	return {
		key: 'test-access-token',
		options: {},
		db: {},
		database: undefined,
		$getAccountId: jest.fn().mockResolvedValue('test-account'),
	};
}
describe('Bitbucket routing coverage', () => {
	const plugin = bitbucket({ key: 'test-access-token' });
	const groups = plugin.endpoints as unknown as Record<
		string,
		Record<string, Endpoint>
	>;
	beforeEach(() => mockRequest.mockReset());
	it('registers exactly 104 unique supplied operations', () => {
		expect(bitbucketOperationCatalog).toHaveLength(104);
		expect(new Set(bitbucketOperationCatalog.map((row) => row.code)).size).toBe(
			104,
		);
		expect(new Set(bitbucketOperationCatalog.map((row) => row.path)).size).toBe(
			104,
		);
	});
	it.each(bitbucketOperationCatalog)(
		'$code validates and dispatches $httpMethod $apiPath',
		async (operation) => {
			const parsed = BitbucketEndpointInputSchemas[operation.key].parse(
				operation.exampleInput,
			);
			const wire = buildBitbucketWireRequest(operation, parsed);
			expect(wire.url).not.toMatch(/[{}]/);
			expect(wire.url).not.toContain('undefined');
			expect(wire.method).toBe(operation.httpMethod);
			expect(wire.retrySafe).toBe(operation.riskLevel === 'read');
			mockRequest.mockResolvedValueOnce(
				operation.responseKind === 'empty'
					? undefined
					: operation.exampleOutput,
			);
			const endpoint = groups[operation.group]?.[operation.key];
			expect(typeof endpoint).toBe('function');
			await endpoint?.(context(), parsed);
			expect(mockRequest).toHaveBeenCalledTimes(1);
			const [config, requestOptions, transport] =
				mockRequest.mock.calls[0] ?? [];
			expect(config?.HEADERS).toMatchObject({
				Authorization: 'Bearer test-access-token',
			});
			expect(requestOptions?.method).toBe(operation.httpMethod);
			expect(requestOptions?.url).toBe(wire.url);
			expect(transport?.rateLimitConfig?.maxRetries).toBe(
				operation.riskLevel === 'read' ? 3 : 0,
			);
		},
	);
	it('filters project repositories by the requested project key', () => {
		const operation = bitbucketOperationCatalog.find(
			(row) => row.code === 'BITBUCKET_GET_PROJECTS_REPOS',
		);
		expect(operation).toBeDefined();
		const wire = buildBitbucketWireRequest(operation!, {
			workspace: 'team',
			project_key: 'PROJ',
		});
		expect(wire.query).toMatchObject({ q: 'project.key="PROJ"' });
	});
	it('marks every DELETE that permanently removes data as destructive and irreversible', () => {
		const byRisk = (level: string) =>
			bitbucketOperationCatalog
				.filter((row) => row.riskLevel === level)
				.map((row) => row.code)
				.sort();
		expect(byRisk('destructive')).toEqual([
			'BITBUCKET_DELETE_COMMIT_COMMENT',
			'BITBUCKET_DELETE_ISSUE',
			'BITBUCKET_DELETE_REPOSITORIES_COMMIT_REPORTS_ANNOTATIONS',
			'BITBUCKET_DELETE_REPOSITORY',
			'BITBUCKET_DELETE_USER_PIPELINE_VARIABLE',
		]);
		// Every destructive operation is a DELETE, and the only DELETE that is not
		// destructive is unwatching a snippet, which removes no data.
		expect(
			bitbucketOperationCatalog
				.filter((row) => row.riskLevel === 'destructive')
				.every((row) => row.httpMethod === 'DELETE'),
		).toBe(true);
		expect(
			bitbucketOperationCatalog
				.filter(
					(row) =>
						row.httpMethod === 'DELETE' && row.riskLevel !== 'destructive',
				)
				.map((row) => row.code),
		).toEqual(['BITBUCKET_DELETE_SNIPPETS_WATCH']);
	});
	it('forwards page and pagelen on list endpoints', () => {
		const operation = bitbucketOperationCatalog.find(
			(row) => row.code === 'BITBUCKET_LIST_PULL_REQUESTS',
		);
		expect(operation).toBeDefined();
		const wire = buildBitbucketWireRequest(operation!, {
			workspace: 'team',
			repo_slug: 'repository',
			page: 2,
			pagelen: 50,
		});
		expect(wire.query).toMatchObject({ page: 2, pagelen: 50 });
	});
	it('requires title and source.branch.name to create a pull request', () => {
		const parse = BitbucketEndpointInputSchemas.createPullRequest.safeParse;
		expect(
			parse({
				workspace: 'team',
				repo_slug: 'repository',
			}).success,
		).toBe(false);
		expect(
			parse({
				workspace: 'team',
				repo_slug: 'repository',
				body: { title: 'Fix' },
			}).success,
		).toBe(false);
		expect(
			parse({
				workspace: 'team',
				repo_slug: 'repository',
				body: {
					title: 'Fix pagination',
					source: { branch: { name: 'feature' } },
				},
			}).success,
		).toBe(true);
	});
	it('requires title to create an issue and name plus target.hash to create a branch', () => {
		expect(
			BitbucketEndpointInputSchemas.createIssue.safeParse({
				workspace: 'team',
				repo_slug: 'repository',
				body: {},
			}).success,
		).toBe(false);
		expect(
			BitbucketEndpointInputSchemas.createIssue.safeParse({
				workspace: 'team',
				repo_slug: 'repository',
				body: { title: 'Cannot clone' },
			}).success,
		).toBe(true);
		expect(
			BitbucketEndpointInputSchemas.createBranch.safeParse({
				workspace: 'team',
				repo_slug: 'repository',
				body: { name: 'feature' },
			}).success,
		).toBe(false);
		expect(
			BitbucketEndpointInputSchemas.createBranch.safeParse({
				workspace: 'team',
				repo_slug: 'repository',
				body: { name: 'feature', target: { hash: 'abc123' } },
			}).success,
		).toBe(true);
	});
	it('forwards the request body for operations that accept one', () => {
		const operation = bitbucketOperationCatalog.find(
			(row) => row.code === 'BITBUCKET_UPDATE_ISSUE',
		);
		expect(operation).toBeDefined();
		const parsed = BitbucketEndpointInputSchemas.updateIssue.parse({
			workspace: 'team',
			repo_slug: 'repository',
			issue_id: 1,
			body: { title: 'Updated issue title' },
		});
		const wire = buildBitbucketWireRequest(operation!, parsed);
		expect(wire.body).toEqual({ title: 'Updated issue title' });
	});
	describe('updateIssue body contract', () => {
		const parse = (body: unknown) =>
			BitbucketEndpointInputSchemas.updateIssue.safeParse({
				workspace: 'team',
				repo_slug: 'repository',
				issue_id: 1,
				body,
			});
		it('rejects a body that updates nothing', () => {
			for (const body of [
				{},
				{ unknown_attribute: 'value' },
				{ title: undefined },
			]) {
				const result = parse(body);
				expect(result.success).toBe(false);
				expect(result.error?.issues[0]?.message).toContain(
					'at least one issue attribute',
				);
			}
		});
		it('rejects a missing body outright', () => {
			expect(parse(undefined).success).toBe(false);
		});
		it('accepts every documented attribute on its own', () => {
			const bodies: Record<string, unknown>[] = [
				{ title: 'New title' },
				{ content: { raw: 'Updated description' } },
				{ state: 'resolved' },
				{ kind: 'bug' },
				{ priority: 'critical' },
				{ assignee: { uuid: '{some-uuid}' } },
				{ assignee: null },
				{ milestone: { name: '1.0' } },
				{ component: { name: 'api' } },
				{ version: { name: '2.1' } },
			];
			for (const body of bodies) expect(parse(body).success).toBe(true);
		});
		it('keeps unrecognized keys once a known attribute is present', () => {
			const result = parse({ state: 'closed', future_field: 'kept' });
			expect(result.success).toBe(true);
			expect(result.data?.body).toEqual({
				state: 'closed',
				future_field: 'kept',
			});
		});
		it('rejects attribute values Bitbucket does not accept', () => {
			expect(parse({ title: '' }).success).toBe(false);
			expect(parse({ state: 'Resolved' }).success).toBe(false);
			expect(parse({ kind: 'defect' }).success).toBe(false);
			expect(parse({ priority: 'urgent' }).success).toBe(false);
			expect(parse({ content: 'raw text' }).success).toBe(false);
		});
	});
	it('rejects dot segments in path parameters and only spans segments for refs and file paths', () => {
		const browse = bitbucketOperationCatalog.find(
			(row) => row.code === 'BITBUCKET_BROWSE_REPOSITORY_PATH',
		);
		expect(browse).toBeDefined();
		expect(() =>
			buildBitbucketWireRequest(browse!, {
				workspace: 'team',
				repo_slug: 'repository',
				commit: 'main',
				path: '../../../user',
			}),
		).toThrow(/must not contain/);
		const wire = buildBitbucketWireRequest(browse!, {
			workspace: 'team/other',
			repo_slug: 'repository',
			commit: 'feature/login',
			path: 'src/index.ts',
		});
		expect(wire.url).toBe(
			'/repositories/team%2Fother/repository/src/feature/login/src/index.ts',
		);
	});
});
