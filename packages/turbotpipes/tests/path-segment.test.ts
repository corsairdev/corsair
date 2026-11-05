import { request } from 'corsair/http';
import { pathSegment } from '../client';
import {
	ConnectionsEndpoints,
	OrgsEndpoints,
	TenantsEndpoints,
	WorkspacesEndpoints,
} from '../endpoints';

jest.mock('corsair/http', () => ({
	...jest.requireActual('corsair/http'),
	request: jest.fn(),
}));

const mockRequest = request as jest.MockedFunction<typeof request>;

// any: stub plugin context for unit tests. Real contexts are built by the
// Corsair runtime; these tests only need the key, so the factory is untyped.
const createMockContext = (): any => ({
	key: 'tpt_test',
	authType: 'api_key',
	$getAccountId: jest.fn().mockResolvedValue('acc_1'),
});

const lastUrl = () => mockRequest.mock.calls.at(-1)?.[1].url;

describe('pathSegment', () => {
	it('rejects empty values, dot segments and path separators', () => {
		for (const bad of ['', '.', '..', '../../../../acme', 'a/b', 'a\\b']) {
			expect(() => pathSegment(bad)).toThrow(/path segment/);
		}
	});

	it('encodes reserved characters in an otherwise valid segment', () => {
		expect(pathSegment('a?b#c')).toBe('a%3Fb%23c');
		expect(pathSegment('%2e%2e')).toBe('%252e%252e');
		expect(pathSegment('...')).toBe('...');
		expect(pathSegment('bob')).toBe('bob');
		expect(pathSegment(42)).toBe('42');
	});
});

describe('handlers check caller values before building the URL', () => {
	beforeEach(() => {
		jest.clearAllMocks();
		mockRequest.mockResolvedValue({ id: 'p_1' });
	});

	it('permission_id "../../../../acme" throws before any request', async () => {
		await expect(
			ConnectionsEndpoints.deleteOrgConnectionPermission(createMockContext(), {
				org_handle: 'acme',
				connection_handle: 'aws',
				permission_id: '../../../../acme',
			}),
		).rejects.toThrow(/path segment/);
		expect(mockRequest).not.toHaveBeenCalled();
	});

	it('a handle that would add path segments throws before any request', async () => {
		await expect(
			OrgsEndpoints.deleteOrg(createMockContext(), {
				org_handle: 'acme/workspace/main',
			}),
		).rejects.toThrow(/path segment/);
		await expect(
			ConnectionsEndpoints.getOrgConnectionPermission(createMockContext(), {
				org_handle: 'acme',
				connection_handle: '..',
			}),
		).rejects.toThrow(/path segment/);
		expect(mockRequest).not.toHaveBeenCalled();
	});

	it('valid values are encoded into the expected route', async () => {
		await ConnectionsEndpoints.deleteOrgConnectionPermission(
			createMockContext(),
			{
				org_handle: 'acme',
				connection_handle: 'aws',
				permission_id: 'p?1',
			},
		);
		expect(lastUrl()).toBe('org/acme/connection/aws/permission/p%3F1');
	});

	it('the process log path segments are checked too', async () => {
		await expect(
			WorkspacesEndpoints.getUserWorkspaceProcessLog(createMockContext(), {
				user_handle: 'bob',
				workspace_handle: '..',
				process_id: 'p_1',
				log_file: 'process',
				content_type: 'jsonl',
			}),
		).rejects.toThrow(/path segment/);
	});

	it('avatar lookups check and encode the handle', async () => {
		const fetchSpy = jest.spyOn(globalThis, 'fetch').mockResolvedValue({
			status: 307,
			headers: { get: () => 'https://pipes.turbot.com/images/a.png' },
		} as unknown as Response);
		await TenantsEndpoints.getTenantAvatar(createMockContext(), {
			tenant_handle: 'a b',
		});
		expect(String(fetchSpy.mock.calls[0]?.[0])).toBe(
			'https://pipes.turbot.com/api/v1/tenant/a%20b/avatar',
		);
		await expect(
			TenantsEndpoints.getTenantAvatar(createMockContext(), {
				tenant_handle: '../user/bob',
			}),
		).rejects.toThrow(/path segment/);
		expect(fetchSpy).toHaveBeenCalledTimes(1);
		fetchSpy.mockRestore();
	});
});
