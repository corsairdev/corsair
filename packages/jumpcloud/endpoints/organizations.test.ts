import type { JumpCloudContext } from '../index';
import { organizationsGet, organizationsList } from './organizations';

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

describe('organizations family (mocked JumpCloud transport)', () => {
	it('organizations.list calls API v1 GET /organizations with pagination query', async () => {
		fetchMock.mockImplementationOnce(() =>
			Promise.resolve(
				jsonResponse({
					results: [{ _id: 'org-1', displayName: 'Main Org' }],
					totalCount: 1,
				}),
			),
		);

		const result = await organizationsList(mockCtx, { limit: 10, skip: 20 });

		expect(fetchMock).toHaveBeenCalledTimes(1);
		const [url, init] = fetchMock.mock.calls[0]!;
		expect(String(url)).toBe(
			'https://console.jumpcloud.com/api/organizations?limit=10&skip=20',
		);
		expect(init).toMatchObject({ method: 'GET' });
		expect(init?.headers).toMatchObject({ 'x-api-key': 'jc-test-key' });
		expect(result).toEqual({
			results: [{ _id: 'org-1', displayName: 'Main Org' }],
			totalCount: 1,
		});
	});

	it('organizations.get calls API v1 GET /organizations/{id}', async () => {
		fetchMock.mockImplementationOnce(() =>
			Promise.resolve(jsonResponse({ _id: 'org-1', displayName: 'Main Org' })),
		);

		const result = await organizationsGet(mockCtx, { id: 'org-1' });

		expect(fetchMock).toHaveBeenCalledTimes(1);
		const [url, init] = fetchMock.mock.calls[0]!;
		expect(String(url)).toBe(
			'https://console.jumpcloud.com/api/organizations/org-1',
		);
		expect(init).toMatchObject({ method: 'GET' });
		expect(result).toEqual({ _id: 'org-1', displayName: 'Main Org' });
	});
});
