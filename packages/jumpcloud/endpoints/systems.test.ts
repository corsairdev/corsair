import type { JumpCloudContext } from '../index';
import {
	systemsDelete,
	systemsGet,
	systemsList,
	systemsListAssociations,
	systemsListPolicyStatuses,
	systemsListUsers,
} from './systems';

jest.mock('corsair/core', () => {
	// unknown: core's export surface is intentionally opaque to plugin
	// tests; the record cast only preserves requireActual while stubbing
	// the event logger.
	const actual = jest.requireActual('corsair/core') as Record<string, unknown>;
	return {
		...actual,
		logEventFromContext: jest.fn(),
	};
});

// The shared HTTP boundary of this plugin is the client's fetch transport.
const fetchMock = jest.fn<
	Promise<Response>,
	Parameters<typeof globalThis.fetch>
>();

// unknown: fixtures intentionally cover every family's documented response
// shapes; the endpoint output schemas, not this helper, enforce the contract.
function jsonResponse(
	body: unknown,
	headers: Record<string, string> = {},
	status = 200,
): Response {
	return new Response(JSON.stringify(body), {
		status,
		headers: { 'content-type': 'application/json', ...headers },
	});
}

const mockCtx = { key: 'jc-test-key' } as never as JumpCloudContext;

beforeEach(() => {
	fetchMock.mockReset();
	globalThis.fetch = fetchMock as typeof globalThis.fetch;
});

describe('systems family (mocked JumpCloud transport)', () => {
	it('systems.list calls API v1 GET /systems with pagination query', async () => {
		fetchMock.mockImplementationOnce(() =>
			Promise.resolve(
				jsonResponse({
					results: [{ _id: 'sys-1', hostname: 'web-01' }],
					totalCount: 1,
				}),
			),
		);

		const result = await systemsList(mockCtx, { limit: 25, skip: 50 });

		expect(fetchMock).toHaveBeenCalledTimes(1);
		const [url, init] = fetchMock.mock.calls[0]!;
		expect(String(url)).toBe(
			'https://console.jumpcloud.com/api/systems?limit=25&skip=50',
		);
		expect(init).toMatchObject({ method: 'GET' });
		expect(init?.headers).toMatchObject({ 'x-api-key': 'jc-test-key' });
		expect(result).toEqual({
			results: [{ _id: 'sys-1', hostname: 'web-01' }],
			totalCount: 1,
		});
	});

	it('systems.get calls API v1 GET /systems/{id}', async () => {
		fetchMock.mockImplementationOnce(() =>
			Promise.resolve(
				jsonResponse({ _id: 'sys-123', hostname: 'web-01', active: true }),
			),
		);

		const result = await systemsGet(mockCtx, { id: 'sys-123' });

		expect(fetchMock).toHaveBeenCalledTimes(1);
		const [url, init] = fetchMock.mock.calls[0]!;
		expect(String(url)).toBe(
			'https://console.jumpcloud.com/api/systems/sys-123',
		);
		expect(init).toMatchObject({ method: 'GET' });
		expect(result).toEqual({
			_id: 'sys-123',
			hostname: 'web-01',
			active: true,
		});
	});

	it('systems.delete calls API v1 DELETE /systems/{id}', async () => {
		fetchMock.mockImplementationOnce(() =>
			Promise.resolve(jsonResponse({ _id: 'sys-123' })),
		);

		const result = await systemsDelete(mockCtx, { id: 'sys-123' });

		expect(fetchMock).toHaveBeenCalledTimes(1);
		const [url, init] = fetchMock.mock.calls[0]!;
		expect(String(url)).toBe(
			'https://console.jumpcloud.com/api/systems/sys-123',
		);
		expect(init).toMatchObject({ method: 'DELETE' });
		expect(result).toEqual({ _id: 'sys-123' });
	});

	it('systems.listUsers calls API v2 GET /systems/{system_id}/users with pagination query', async () => {
		fetchMock.mockImplementationOnce(() =>
			Promise.resolve(jsonResponse([{ id: 'u-1', paths: [], type: 'user' }])),
		);

		const result = await systemsListUsers(mockCtx, {
			system_id: 'sys-123',
			limit: 10,
			skip: 20,
		});

		expect(fetchMock).toHaveBeenCalledTimes(1);
		const [url, init] = fetchMock.mock.calls[0]!;
		expect(String(url)).toBe(
			'https://console.jumpcloud.com/api/v2/systems/sys-123/users?limit=10&skip=20',
		);
		expect(init).toMatchObject({ method: 'GET' });
		expect(result).toEqual([{ id: 'u-1', paths: [], type: 'user' }]);
	});

	it('systems.listPolicyStatuses calls API v2 GET /systems/{system_id}/policystatuses', async () => {
		fetchMock.mockImplementationOnce(() =>
			Promise.resolve(
				jsonResponse([
					{ id: 'ps-1', policyID: 'pol-1', state: 'success', success: true },
				]),
			),
		);

		const result = await systemsListPolicyStatuses(mockCtx, {
			system_id: 'sys-123',
			limit: 5,
		});

		expect(fetchMock).toHaveBeenCalledTimes(1);
		const [url, init] = fetchMock.mock.calls[0]!;
		expect(String(url)).toBe(
			'https://console.jumpcloud.com/api/v2/systems/sys-123/policystatuses?limit=5',
		);
		expect(init).toMatchObject({ method: 'GET' });
		expect(result).toEqual([
			{ id: 'ps-1', policyID: 'pol-1', state: 'success', success: true },
		]);
	});

	it('systems.listAssociations calls API v2 GET /systems/{system_id}/associations with target filter', async () => {
		fetchMock.mockImplementationOnce(() =>
			Promise.resolve(
				jsonResponse([
					{
						from: { fromType: 'system', fromId: 'sys-123' },
						to: { toType: 'user', toId: 'u-1' },
					},
				]),
			),
		);

		const result = await systemsListAssociations(mockCtx, {
			system_id: 'sys-123',
			targets: ['user'],
			limit: 10,
			skip: 20,
		});

		expect(fetchMock).toHaveBeenCalledTimes(1);
		const [url, init] = fetchMock.mock.calls[0]!;
		expect(String(url)).toBe(
			'https://console.jumpcloud.com/api/v2/systems/sys-123/associations?targets=user&limit=10&skip=20',
		);
		expect(init).toMatchObject({ method: 'GET' });
		expect(result).toEqual([
			{
				from: { fromType: 'system', fromId: 'sys-123' },
				to: { toType: 'user', toId: 'u-1' },
			},
		]);
	});
});
