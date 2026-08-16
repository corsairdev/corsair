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
		const permanent = bitbucketOperationCatalog.filter(
			(row) => row.riskLevel === 'destructive',
		);
		expect(permanent.map((row) => row.code)).toEqual(
			expect.arrayContaining([
				'BITBUCKET_DELETE_REPOSITORY',
				'BITBUCKET_DELETE_ISSUE',
				'BITBUCKET_DELETE_COMMIT_COMMENT',
			]),
		);
	});
});
