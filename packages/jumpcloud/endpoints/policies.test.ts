import type { JumpCloudContext } from '../index';
import {
	policiesCreate,
	policiesDelete,
	policiesGet,
	policiesList,
	policiesListStatuses,
	policiesUpdate,
} from './policies';

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

describe('policies family (mocked JumpCloud transport)', () => {
	it('policies.list calls API v2 GET /policies with pagination query', async () => {
		fetchMock.mockImplementationOnce(() =>
			Promise.resolve(
				jsonResponse([
					{
						id: 'p1',
						name: 'Require MFA for admins',
						template: { id: 'tpl-1' },
					},
				]),
			),
		);

		const result = await policiesList(mockCtx, { limit: 25, skip: 50 });

		expect(fetchMock).toHaveBeenCalledTimes(1);
		const [url, init] = fetchMock.mock.calls[0]!;
		expect(String(url)).toBe(
			'https://console.jumpcloud.com/api/v2/policies?limit=25&skip=50',
		);
		expect(init).toMatchObject({ method: 'GET' });
		expect(init?.headers).toMatchObject({ 'x-api-key': 'jc-test-key' });

		expect(result).toEqual([
			{ id: 'p1', name: 'Require MFA for admins', template: { id: 'tpl-1' } },
		]);
	});

	it('policies.create posts the policy body to API v2 /policies', async () => {
		fetchMock.mockImplementationOnce(() =>
			Promise.resolve(
				jsonResponse({ id: 'p1', name: 'Require MFA for admins' }),
			),
		);

		const result = await policiesCreate(mockCtx, {
			body: {
				name: 'Require MFA for admins',
				template: { id: 'tpl-1' },
				notes: 'Security baseline',
			},
		});

		expect(fetchMock).toHaveBeenCalledTimes(1);
		const [url, init] = fetchMock.mock.calls[0]!;
		expect(String(url)).toBe('https://console.jumpcloud.com/api/v2/policies');
		expect(init).toMatchObject({ method: 'POST' });
		expect(init?.headers).toMatchObject({
			'x-api-key': 'jc-test-key',
			'Content-Type': 'application/json',
		});
		expect(JSON.parse(String(init?.body) ?? '{}')).toEqual({
			name: 'Require MFA for admins',
			template: { id: 'tpl-1' },
			notes: 'Security baseline',
		});

		expect(result).toEqual({ id: 'p1', name: 'Require MFA for admins' });
	});

	it('policies.get targets the API v2 policies id template path', async () => {
		fetchMock.mockImplementationOnce(() =>
			Promise.resolve(
				jsonResponse({ id: 'p1', name: 'Require MFA for admins' }),
			),
		);

		const result = await policiesGet(mockCtx, { id: 'p1' });

		expect(fetchMock).toHaveBeenCalledTimes(1);
		const [url, init] = fetchMock.mock.calls[0]!;
		expect(String(url)).toBe(
			'https://console.jumpcloud.com/api/v2/policies/p1',
		);
		expect(init).toMatchObject({ method: 'GET' });
		expect(init?.headers).toMatchObject({ 'x-api-key': 'jc-test-key' });

		expect(result).toEqual({ id: 'p1', name: 'Require MFA for admins' });
	});

	it('policies.update puts the policy body to the API v2 policies id template path', async () => {
		fetchMock.mockImplementationOnce(() =>
			Promise.resolve(
				jsonResponse({ id: 'p1', name: 'Require MFA for admins (v2)' }),
			),
		);

		const result = await policiesUpdate(mockCtx, {
			id: 'p1',
			body: {
				name: 'Require MFA for admins (v2)',
				notes: 'Tightened baseline',
			},
		});

		const [url, init] = fetchMock.mock.calls[0]!;
		expect(String(url)).toBe(
			'https://console.jumpcloud.com/api/v2/policies/p1',
		);
		expect(init).toMatchObject({ method: 'PUT' });
		expect(init?.headers).toMatchObject({ 'Content-Type': 'application/json' });
		expect(JSON.parse(String(init?.body) ?? '{}')).toEqual({
			name: 'Require MFA for admins (v2)',
			notes: 'Tightened baseline',
		});

		expect(result).toEqual({ id: 'p1', name: 'Require MFA for admins (v2)' });
	});

	it('policies.delete issues DELETE against the API v2 policies id template path', async () => {
		fetchMock.mockImplementationOnce(() =>
			Promise.resolve(new Response(null, { status: 200 })),
		);

		const result = await policiesDelete(mockCtx, { id: 'p1' });

		const [url, init] = fetchMock.mock.calls[0]!;
		expect(String(url)).toBe(
			'https://console.jumpcloud.com/api/v2/policies/p1',
		);
		expect(init).toMatchObject({ method: 'DELETE' });
		expect(init?.body).toBeUndefined();

		expect(result).toBeUndefined();
	});

	it('policies.listStatuses calls API v2 GET on the policy statuses path with pagination query', async () => {
		fetchMock.mockImplementationOnce(() =>
			Promise.resolve(
				jsonResponse([
					{
						id: 'pr1',
						policyID: 'p1',
						systemID: 's1',
						state: 'success',
						success: true,
					},
				]),
			),
		);

		const result = await policiesListStatuses(mockCtx, {
			policy_id: 'p1',
			limit: 10,
			skip: 20,
		});

		const [url, init] = fetchMock.mock.calls[0]!;
		expect(String(url)).toBe(
			'https://console.jumpcloud.com/api/v2/policies/p1/policystatuses?limit=10&skip=20',
		);
		expect(init).toMatchObject({ method: 'GET' });

		expect(result).toEqual([
			{
				id: 'pr1',
				policyID: 'p1',
				systemID: 's1',
				state: 'success',
				success: true,
			},
		]);
	});
});
