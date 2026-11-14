import type { JumpCloudContext } from '../index';
import { searchSystems, searchSystemUsers } from './search';

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

describe('search family (mocked JumpCloud transport)', () => {
	it('search.systemUsers calls API v1 POST /search/systemusers forwarding query params and the search body', async () => {
		fetchMock.mockImplementationOnce(() =>
			Promise.resolve(
				jsonResponse({
					results: [{ _id: 'u-1', username: 'asmith' }],
					totalCount: 1,
				}),
			),
		);

		const result = await searchSystemUsers(mockCtx, {
			limit: 5,
			body: {
				filter: [{ field: 'lastname', operator: '$eq', value: 'Smith' }],
			},
		});

		expect(fetchMock).toHaveBeenCalledTimes(1);
		const [url, init] = fetchMock.mock.calls[0]!;
		expect(String(url)).toBe(
			'https://console.jumpcloud.com/api/search/systemusers?limit=5',
		);
		expect(init).toMatchObject({ method: 'POST' });
		expect(init?.headers).toMatchObject({
			'x-api-key': 'jc-test-key',
			'Content-Type': 'application/json',
		});
		// The handler forwards the documented search body (filter/andLogic/limit/
		// skip/sort/fields) as the JSON request body, verbatim from the input.
		expect(JSON.parse(String(init?.body) ?? '{}')).toEqual({
			filter: [{ field: 'lastname', operator: '$eq', value: 'Smith' }],
		});
		expect(result).toEqual({
			results: [{ _id: 'u-1', username: 'asmith' }],
			totalCount: 1,
		});
	});

	it('search.systems calls API v1 POST /search/systems forwarding query params and the search body', async () => {
		fetchMock.mockImplementationOnce(() =>
			Promise.resolve(
				jsonResponse({
					results: [{ _id: 'sys-1', hostname: 'web-01' }],
					totalCount: 1,
				}),
			),
		);

		const result = await searchSystems(mockCtx, {
			fields: 'hostname',
			limit: 10,
			skip: 0,
			body: {
				filter: [{ field: 'os', operator: '$eq', value: 'Ubuntu' }],
			},
		});

		expect(fetchMock).toHaveBeenCalledTimes(1);
		const [url, init] = fetchMock.mock.calls[0]!;
		expect(String(url)).toBe(
			'https://console.jumpcloud.com/api/search/systems?fields=hostname&limit=10&skip=0',
		);
		expect(init).toMatchObject({ method: 'POST' });
		// The handler forwards the documented search body as the JSON request
		// body while still accepting query-level fields/limit/skip/filter.
		expect(JSON.parse(String(init?.body) ?? '{}')).toEqual({
			filter: [{ field: 'os', operator: '$eq', value: 'Ubuntu' }],
		});
		expect(init?.headers).toMatchObject({
			'Content-Type': 'application/json',
		});
		expect(result).toEqual({
			results: [{ _id: 'sys-1', hostname: 'web-01' }],
			totalCount: 1,
		});
	});
});
