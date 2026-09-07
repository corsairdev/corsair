// Mocked transport coverage intentionally runs in Corsair's normal CI lane.
import { list as listChecks } from './endpoints/checks';
import { list, listIps, listIpv4, listIpv6 } from './endpoints/nodes';

const fetchMock = jest.spyOn(globalThis, 'fetch');
const ctx = {
	key: 'updown-test-key',
	options: {},
	$getAccountId: async () => 'test-account',
} as never;

function json(body: unknown): Response {
	return new Response(JSON.stringify(body), {
		status: 200,
		headers: { 'Content-Type': 'application/json' },
	});
}

describe('Updown.io API operations', () => {
	beforeEach(() => {
		fetchMock.mockReset();
		fetchMock.mockImplementation(async (input) => {
			const url = String(input);
			if (url.endsWith('/checks'))
				return json([
					{
						token: 'ngg8',
						url: 'https://updown.io',
						type: 'https',
						last_status: 200,
						uptime: 100,
						down: false,
						down_since: null,
						up_since: '2026-09-07T10:00:00Z',
						error: null,
						period: 60,
						apdex_t: 0.5,
						enabled: true,
						published: true,
						disabled_locations: [],
						recipients: [],
						last_check_at: null,
						next_check_at: null,
						created_at: '2026-09-01T10:00:00Z',
					},
				]);
			if (url.endsWith('/nodes'))
				return json({
					tok: {
						ip: '45.76.104.117',
						ip6: '2001:db8::1',
						city: 'Tokyo',
						country: 'Japan',
						country_code: 'jp',
						lat: 35.58,
						lng: 139.74,
					},
				});
			if (url.endsWith('/ipv4')) return json(['45.76.104.117']);
			if (url.endsWith('/ipv6')) return json(['2001:db8::1']);
			return json(['45.76.104.117', '2001:db8::1']);
		});
	});
	afterAll(() => fetchMock.mockRestore());

	it('calls and validates all five catalog operations', async () => {
		const checks = await listChecks(ctx, {});
		const nodes = await list(ctx, {});
		const ips = await listIps(ctx, {});
		const ipv4 = await listIpv4(ctx, {});
		const ipv6 = await listIpv6(ctx, {});
		expect(checks[0]?.token).toBe('ngg8');
		expect(nodes.tok?.city).toBe('Tokyo');
		expect(ips).toHaveLength(2);
		expect(ipv4[0]).toBe('45.76.104.117');
		expect(ipv6[0]).toBe('2001:db8::1');
		expect(fetchMock).toHaveBeenCalledTimes(5);
		const calls = fetchMock.mock.calls.map(([input]) => String(input));
		expect(calls).toEqual([
			'https://updown.io/api/checks',
			'https://updown.io/api/nodes',
			'https://updown.io/api/nodes/ips',
			'https://updown.io/api/nodes/ipv4',
			'https://updown.io/api/nodes/ipv6',
		]);
		for (const [, init] of fetchMock.mock.calls)
			expect(new Headers(init?.headers).get('X-API-KEY')).toBe(
				'updown-test-key',
			);
	});
});
