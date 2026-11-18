// Mocked transport coverage intentionally runs in Corsair's normal CI lane.
import { UpdownIOAPIError } from './client';
import { list as listChecks } from './endpoints/checks';
import { list, listIps, listIpv4, listIpv6 } from './endpoints/nodes';
import { errorHandlers } from './error-handlers';

const fetchMock = jest.spyOn(globalThis, 'fetch');

/** Every member of the entity client, as a jest.fn, so the mock satisfies the real type. */
function makeEntityClient() {
	return {
		findByEntityId: jest.fn(),
		existsByEntityId: jest.fn(),
		findIdByEntityId: jest.fn(),
		findById: jest.fn(),
		findManyByEntityIds: jest.fn(),
		list: jest.fn(),
		search: jest.fn(),
		upsertByEntityId: jest.fn(),
		deleteById: jest.fn(),
		deleteByEntityId: jest.fn(),
		count: jest.fn(),
	};
}

const db = {
	checks: makeEntityClient(),
	nodes: makeEntityClient(),
};

type Ctx = Parameters<typeof listChecks>[0];

/** Builds a context for the given key; the account-scoped routes need a connected key. */
function makeCtx(key: string): Ctx {
	return {
		key,
		options: {},
		db,
		endpoints: {},
		$getAccountId: async () => 'test-account',
		keys: {
			get_dek: async () => '',
			get_api_key: async () => key,
			set_api_key: async () => {},
			get_webhook_signature: async () => null,
			set_webhook_signature: async () => {},
			issue_new_dek: async () => '',
		},
	};
}

const ctx = makeCtx('updown-test-key');
/** A context with no key, valid for the public node routes. */
const publicCtx = makeCtx('');

// Safe: the value is only passed to JSON.stringify, which accepts anything.
// A narrower type is not practical because tests send many different response shapes.
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
		cert: {
			subject: 'updown.io',
			subject_org: '',
			san: ['pulse.updown.io', 'www.updown.io'],
			issuer: 'YE1',
			issuer_org: "Let's Encrypt",
			from: '2026-08-22T13:03:54Z',
			to: '2026-11-20T13:03:53Z',
			algorithm: 'ECDSA with SHA-384',
		},
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
	db.checks.upsertByEntityId.mockReset();
	db.nodes.upsertByEntityId.mockReset();
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
		expect(fetchMock.mock.calls[0]?.[1]).toMatchObject({
			method: 'GET',
			redirect: 'error',
		});
		expect(requestedHeaders().get('X-API-KEY')).toBe('updown-test-key');
		expect(checks[0]?.token).toBe('ngg8');
	});

	it('parses the full documented check, including ssl and domain', async () => {
		fetchMock.mockResolvedValue(json([exampleCheck]));

		const [check] = await listChecks(ctx, {});

		expect(check?.ssl?.valid).toBe(true);
		expect(check?.ssl?.cert?.issuer_org).toBe("Let's Encrypt");
		expect(check?.domain?.remaining_days).toBe(758);
		expect(check?.http_verb).toBe('GET/HEAD');
		expect(check?.favicon_url).toBe('https://updown.io/favicon.png');
	});

	it('stores each check in the database keyed by token', async () => {
		fetchMock.mockResolvedValue(json([exampleCheck]));

		await listChecks(ctx, {});

		expect(db.checks.upsertByEntityId).toHaveBeenCalledTimes(1);
		expect(db.checks.upsertByEntityId).toHaveBeenCalledWith(
			'ngg8',
			expect.objectContaining({ token: 'ngg8', url: 'https://updown.io' }),
		);
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
			'auth-missing:updownio:api_key',
		);
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('rejects unknown input fields', async () => {
		// Reflect.apply sends input the declared type forbids, to prove the strict schema rejects it at runtime.
		await expect(
			Reflect.apply(listChecks, undefined, [ctx, { unexpected: true }]),
		).rejects.toThrow();
	});

	it('rejects cross-origin redirects when an API key is sent', async () => {
		fetchMock.mockResolvedValue(
			new Response(null, {
				status: 302,
				headers: { Location: 'https://evil.example/steal' },
			}),
		);

		await expect(listChecks(ctx, {})).rejects.toThrow(/redirect/i);
	});

	it('rejects https-to-http redirects when an API key is sent', async () => {
		fetchMock.mockResolvedValue(
			new Response(null, {
				status: 301,
				headers: { Location: 'http://updown.io/api/checks' },
			}),
		);

		await expect(listChecks(ctx, {})).rejects.toThrow(/redirect/i);
	});
});

describe('nodes endpoints', () => {
	it('nodes.list GETs /api/nodes and keys nodes by location', async () => {
		fetchMock.mockResolvedValue(json(exampleNodes));

		const nodes = await list(publicCtx, {});

		expect(requestedUrl()).toBe('https://updown.io/api/nodes');
		expect(nodes.tok?.city).toBe('Tokyo');
		expect(nodes.tok?.lat).toBeCloseTo(35.5833);
		expect(db.nodes.upsertByEntityId).toHaveBeenCalledWith(
			'tok',
			expect.objectContaining({ city: 'Tokyo', ip: '45.76.104.117' }),
		);
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
		const wrapped = new UpdownIOAPIError('Invalid API key', { status: 401 });

		expect(errorHandlers.AUTH_ERROR.match(wrapped)).toBe(true);
	});

	it('retries a 429 and honors the Retry-After header', async () => {
		fetchMock.mockResolvedValue(
			new Response(JSON.stringify({ error: 'Rate limited' }), {
				status: 429,
				headers: { 'Content-Type': 'application/json', 'Retry-After': '7' },
			}),
		);

		const error = await listChecks(ctx, {}).then(
			() => {
				throw new Error('expected listChecks to reject');
			},
			(e: Error) => e,
		);

		expect(errorHandlers.RATE_LIMIT_ERROR.match(error)).toBe(true);
		await expect(
			errorHandlers.RATE_LIMIT_ERROR.handler(error),
		).resolves.toEqual({
			maxRetries: 3,
			headersRetryAfterMs: 7000,
			retryStrategy: 'exponential_backoff',
		});
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
