import { makeStackExchangeRequest, STACKEXCHANGE_API_BASE } from './client';
import { ROUTE_GROUPS } from './endpoints/routes';

const response = () =>
	new Response(
		JSON.stringify({ items: [], has_more: false, quota_remaining: 9000 }),
		{
			status: 200,
			headers: { 'Content-Type': 'application/json' },
		},
	);

describe('documented route inventory dispatch', () => {
	afterEach(() => jest.restoreAllMocks());

	it('dispatches every catalogued method to its fixed v2.3 route', async () => {
		const fetchMock = jest
			.spyOn(globalThis, 'fetch')
			.mockImplementation(async () => response());
		const expectedRequests: Array<{ path: string; method: string }> = [];

		for (const group of ['siteRead', 'siteWrite', 'networkRead'] as const) {
			const routes = ROUTE_GROUPS[group];
			for (const route of routes) {
				const pathParams = Object.fromEntries(
					[...route.path.matchAll(/\{([^}]+)\}/g)].map((match) => [
						match[1],
						'17',
					]),
				);
				await makeStackExchangeRequest(
					group,
					route.id,
					route.scope === 'none' ? undefined : 'oauth-token',
					route.scope === 'none' ? 'api_key' : 'oauth_2',
					{
						...(route.site ? { site: 'stackoverflow' } : {}),
						...(Object.keys(pathParams).length > 0 ? { pathParams } : {}),
					},
				);
				expectedRequests.push({
					path: `${STACKEXCHANGE_API_BASE}/${route.path.replace(/\{[^}]+\}/g, '17')}`,
					method: route.method,
				});
			}
		}

		expect(fetchMock).toHaveBeenCalledTimes(expectedRequests.length);
		for (const [index, [input, init]] of fetchMock.mock.calls.entries()) {
			const expected = expectedRequests[index];
			expect(expected).toBeDefined();
			if (!expected) throw new Error('Expected a request ledger entry');
			expect(new URL(String(input)).pathname).toBe(
				new URL(expected.path).pathname,
			);
			expect(init?.method).toBe(expected.method);
		}
		expect(expectedRequests.length).toBeGreaterThan(100);
	});

	it('keeps network paths site-free and formats writes as POST', async () => {
		const fetchMock = jest
			.spyOn(globalThis, 'fetch')
			.mockImplementation(async () => response());
		await makeStackExchangeRequest(
			'networkRead',
			'sites',
			undefined,
			'api_key',
			{},
		);
		await makeStackExchangeRequest(
			'networkRead',
			'create-filter',
			undefined,
			'api_key',
			{
				method: 'POST',
				parameters: { base: 'default', include: ['items', 'has_more'] },
			},
		);
		const read = fetchMock.mock.calls.at(0);
		const write = fetchMock.mock.calls.at(1);
		expect(read).toBeDefined();
		expect(write).toBeDefined();
		if (!read || !write) throw new Error('Expected both network requests');
		expect(String(read[0])).toBe(`${STACKEXCHANGE_API_BASE}/sites`);
		expect(read[1]?.method).toBe('GET');
		expect(String(write[0])).toBe(`${STACKEXCHANGE_API_BASE}/filters/create`);
		expect(write[1]?.method).toBe('POST');
	});
});
