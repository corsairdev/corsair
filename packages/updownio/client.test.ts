// Mocked transport coverage intentionally runs in Corsair's normal CI lane.
import { UpdownIOAPIError } from './client';
import { list as listChecks } from './endpoints/checks';
import { list, listIps, listIpv4, listIpv6 } from './endpoints/nodes';
import { errorHandlers } from './error-handlers';

const fetchMock = jest.spyOn(globalThis, 'fetch');

/** A context with a connected key, as the account-scoped routes require. */
const ctx = {
	key: 'updown-test-key',
	options: {},
	$getAccountId: async () => 'test-account',
} as never;

/** A context with no key — valid for the public node routes. */
const publicCtx = {
	key: '',
	options: {},
	$getAccountId: async () => 'test-account',
} as never;

function json(body: unknown, status = 200): Response {
	return new Response(JSON.stringify(body), {
		status,
		headers: { 'Content-Type': 'application/json' },
	});
}

/** A check as shown in the official example response. */
const exampleCheck = {
	token: 'ngg8',
	url: 'https://updown.io',
	type: 'https',
	alias: '',
	last_status: 200,
	uptime: 100,
	down: false,
	down_since: null,
	up_since: '2023-12-23T09:06:51Z',
	error: null,
	period: 15,
	apdex_t: 0.5,
	string_match: '',
	enabled: true,
	published: true,
	disabled_locations: [],
	recipients: ['email:1246848337'],
	last_check_at: '2021-12-17T05:00:01Z',
	next_check_at: '2021-12-17T05:00:16Z',
	created_at: '2012-09-22T13:29:44Z',
	mute_until: null,
	favicon_url: 'https://updown.io/favicon.png',
	custom_headers: {},
	http_verb: 'GET/HEAD',
	http_body: '',
	ssl: {
		tested_at: '2021-12-17T04:58:04Z',
		expires_at: '2022-02-21T15:57:36Z',
		valid: true,
		error: null,
	},
	domain: {
		tested_at: '2021-12-17T12:00:00Z',
		expires_at: '2024-01-15T23:59:59Z',
		remaining_days: 758,
		source: 'RDAP',
	},
};

const exampleNodes = {
	tok: {
		ip: '45.76.104.117',
		ip6: '2001:19f0:7001:45a::1',
		city: 'Tokyo',
		country: 'Japan',
		country_code: 'jp',
		lat: 35.5833,
		lng: 139.7483,
	},
};

beforeEach(() => {
	fetchMock.mockReset();
});

afterAll(() => fetchMock.mockRestore());

function requestedUrl(): string {
	return String(fetchMock.mock.calls[0]?.[0]);
}

function requestedHeaders(): Headers {
	return new Headers(fetchMock.mock.calls[0]?.[1]?.headers);
}

describe('checks.list', () => {
	it('GETs /api/checks with the API key header', async () => {
		fetchMock.mockResolvedValue(json([exampleCheck]));

		const checks = await listChecks(ctx, {});

		expect(requestedUrl()).toBe('https://updown.io/api/checks');
		expect(requestedHeaders().get('X-API-KEY')).toBe('updown-test-key');
		expect(checks[0]?.token).toBe('ngg8');
	});

	it('parses the full documented check, including ssl and domain', async () => {
		fetchMock.mockResolvedValue(json([exampleCheck]));

		const [check] = await listChecks(ctx, {});

		expect(check?.ssl?.valid).toBe(true);
		expect(check?.domain?.remaining_days).toBe(758);
		expect(check?.http_verb).toBe('GET/HEAD');
		expect(check?.favicon_url).toBe('https://updown.io/favicon.png');
	});

	it('accepts a pulse check, which carries no url or status', async () => {
		fetchMock.mockResolvedValue(
			json([{ token: 'pulse1', type: 'pulse', last_status: null }]),
		);

		const [check] = await listChecks(ctx, {});

		expect(check).toMatchObject({ token: 'pulse1', type: 'pulse' });
	});

	it('fails closed when no key is connected', async () => {
		await expect(listChecks(publicCtx, {})).rejects.toThrow(
			'Updown.io API key is required',
		);
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('rejects unknown input fields', async () => {
		await expect(
			listChecks(ctx, { unexpected: true } as never),
		).rejects.toThrow();
	});
});

describe('nodes endpoints', () => {
	it('nodes.list GETs /api/nodes and keys nodes by location', async () => {
		fetchMock.mockResolvedValue(json(exampleNodes));

		const nodes = await list(publicCtx, {});

		expect(requestedUrl()).toBe('https://updown.io/api/nodes');
		expect(nodes.tok?.city).toBe('Tokyo');
		expect(nodes.tok?.lat).toBeCloseTo(35.5833);
	});

	it('nodes.listIps GETs /api/nodes/ips', async () => {
		fetchMock.mockResolvedValue(json(['45.32.74.41', '2001:19f0:6001:2c6::1']));

		const ips = await listIps(publicCtx, {});

		expect(requestedUrl()).toBe('https://updown.io/api/nodes/ips');
		expect(ips).toHaveLength(2);
	});

	it('nodes.listIpv4 GETs /api/nodes/ipv4', async () => {
		fetchMock.mockResolvedValue(json(['45.32.74.41']));

		const ipv4 = await listIpv4(publicCtx, {});

		expect(requestedUrl()).toBe('https://updown.io/api/nodes/ipv4');
		expect(ipv4[0]).toBe('45.32.74.41');
	});

	it('nodes.listIpv6 GETs /api/nodes/ipv6', async () => {
		fetchMock.mockResolvedValue(json(['2001:19f0:6001:2c6::1']));

		const ipv6 = await listIpv6(publicCtx, {});

		expect(requestedUrl()).toBe('https://updown.io/api/nodes/ipv6');
		expect(ipv6[0]).toBe('2001:19f0:6001:2c6::1');
	});

	it('omits the key header entirely on the public routes', async () => {
		fetchMock.mockResolvedValue(json(exampleNodes));

		await list(publicCtx, {});

		expect(requestedHeaders().has('X-API-KEY')).toBe(false);
	});

	it('still sends the key on public routes when one is connected', async () => {
		fetchMock.mockResolvedValue(json(exampleNodes));

		await list(ctx, {});

		expect(requestedHeaders().get('X-API-KEY')).toBe('updown-test-key');
	});
});

describe('error handling', () => {
	it('wraps a failed response as UpdownIOAPIError carrying the status', async () => {
		fetchMock.mockResolvedValue(json({ error: 'Unauthorized' }, 401));

		await expect(listChecks(ctx, {})).rejects.toBeInstanceOf(UpdownIOAPIError);
	});

	it('surfaces the message from updown.io error bodies', async () => {
		fetchMock.mockResolvedValue(json({ error: 'Invalid API key' }, 401));

		await expect(listChecks(ctx, {})).rejects.toThrow(/Invalid API key/);
	});

	it('classifies a 401 as an auth error once wrapped', async () => {
		const wrapped = new UpdownIOAPIError('Invalid API key');
		(wrapped as { status?: number }).status = 401;

		expect(errorHandlers.AUTH_ERROR.match(wrapped)).toBe(true);
	});

	it('classifies a 429 as a rate-limit error once wrapped', async () => {
		const wrapped = new UpdownIOAPIError('Too many requests');
		(wrapped as { status?: number }).status = 429;

		expect(errorHandlers.RATE_LIMIT_ERROR.match(wrapped)).toBe(true);
		await expect(
			errorHandlers.RATE_LIMIT_ERROR.handler(wrapped),
		).resolves.toMatchObject({ maxRetries: 0 });
	});

	it('treats a missing key as an auth error', () => {
		expect(
			errorHandlers.AUTH_ERROR.match(
				new UpdownIOAPIError('Updown.io API key is required'),
			),
		).toBe(true);
	});

	it('does not retry by default', async () => {
		await expect(errorHandlers.DEFAULT.handler()).resolves.toEqual({
			maxRetries: 0,
		});
	});
});
