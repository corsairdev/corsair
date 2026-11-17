import type { JumpCloudContext } from '../index';
import { applicationsGet, applicationsList } from './applications';

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

describe('applications family (mocked JumpCloud transport)', () => {
	it('applications.list calls API v1 GET /applications with pagination query', async () => {
		fetchMock.mockImplementationOnce(() =>
			Promise.resolve(
				jsonResponse({
					results: [{ _id: 'app-1', name: 'Okta SAML' }],
					totalCount: 1,
				}),
			),
		);

		const result = await applicationsList(mockCtx, { limit: 10, skip: 0 });

		expect(fetchMock).toHaveBeenCalledTimes(1);
		const [url, init] = fetchMock.mock.calls[0]!;
		expect(String(url)).toBe(
			'https://console.jumpcloud.com/api/applications?limit=10&skip=0',
		);
		expect(init).toMatchObject({ method: 'GET' });
		expect(init?.headers).toMatchObject({ 'x-api-key': 'jc-test-key' });
		expect(result).toEqual({
			results: [{ _id: 'app-1', name: 'Okta SAML' }],
			totalCount: 1,
		});
	});

	it('applications.get calls API v1 GET /applications/{id}', async () => {
		fetchMock.mockImplementationOnce(() =>
			Promise.resolve(
				jsonResponse({
					_id: 'app-1',
					name: 'Okta SAML',
					ssoUrl: 'https://sso.example.com/okta',
					config: {},
				}),
			),
		);

		const result = await applicationsGet(mockCtx, { id: 'app-1' });

		expect(fetchMock).toHaveBeenCalledTimes(1);
		const [url, init] = fetchMock.mock.calls[0]!;
		expect(String(url)).toBe(
			'https://console.jumpcloud.com/api/applications/app-1',
		);
		expect(init).toMatchObject({ method: 'GET' });
		expect(result).toEqual({
			_id: 'app-1',
			name: 'Okta SAML',
			ssoUrl: 'https://sso.example.com/okta',
			config: {},
		});
	});
});
