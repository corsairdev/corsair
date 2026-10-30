/**
 * Exercises all 71 endpoint wrappers: the HTTP method and path each one
 * builds, the cache writes they perform, and what reaches the event log.
 * Network access is mocked, so this runs in CI.
 */
import { logEventFromContext } from 'corsair/core';
import {
	Allowlist,
	Analytics,
	Auth,
	Denylist,
	Logs,
	ParentalControl,
	Privacy,
	Profiles,
	Rewrites,
	Security,
	Settings,
	Setup,
} from './endpoints';
import { nextDNSEndpointSchemas } from './index';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn(async () => undefined),
}));

const mockLogEvent = logEventFromContext as jest.MockedFunction<
	typeof logEventFromContext
>;

type Store = { upsertByEntityId: jest.Mock; deleteByEntityId: jest.Mock };

function makeStore(): Store {
	return {
		upsertByEntityId: jest.fn(async () => undefined),
		deleteByEntityId: jest.fn(async () => true),
	};
}

type Ctx = Parameters<typeof Profiles.list>[0];

function makeCtx() {
	const db = { profiles: makeStore() };
	// Cast, not a claim that this satisfies the real Ctx shape: only the
	// fields every endpoint under test actually reads (`key`, `db`) are built.
	const ctx = { key: 'test-nextdns-key', db } as unknown as Ctx;
	return { ctx, db };
}

let lastUrl = '';
let lastMethod = '';
let lastBody: unknown;

/**
 * A single fixture serves every operation below. NextDNS wraps every
 * response as `{data: X}` where `X` is either an array (list endpoints) or
 * a single object (get/create/update endpoints) depending on the route.
 * Since a JS array is also an object, `data` itself is built as "an array
 * with extra properties" - satisfying both `result.data.map()`/`?? []`
 * (list endpoints) and `result.data.id`/`.name`/etc. (single-object
 * endpoints) from the same fixture, the same trick this repo's College
 * Football Data plugin uses for its own dual-shape responses.
 */
const item = {
	id: 'test-id',
	name: 'Test Profile',
	fingerprint: 'fp123',
	role: 'owner',
	active: true,
	content: '127.0.0.1',
	type: 'A',
	enabled: true,
	servers: ['1.1.1.1'],
	ip: null,
	ddns: null,
	updateToken: 'secret-token',
};
const dataPayload = Object.assign([item], item);
const RESPONSE_BODY = { data: dataPayload };

type Call = { url: string; method: string; body: unknown };
let calls: Call[] = [];

beforeEach(() => {
	mockLogEvent.mockClear();
	calls = [];
	lastUrl = '';
	lastMethod = '';
	lastBody = undefined;
	// `url` is `unknown` rather than `RequestInfo | URL`; see client.test.ts.
	global.fetch = (async (url: unknown, init?: RequestInit) => {
		lastUrl = String(url);
		lastMethod = init?.method ?? 'GET';
		lastBody = init?.body ? JSON.parse(init.body as string) : undefined;
		calls.push({ url: lastUrl, method: lastMethod, body: lastBody });
		return {
			ok: true,
			status: 200,
			statusText: 'OK',
			url: String(url),
			headers: new Headers({ 'Content-Type': 'application/json' }),
			json: async () => RESPONSE_BODY,
			text: async () => JSON.stringify(RESPONSE_BODY),
		};
	}) as unknown as typeof global.fetch;
});

const P = 'p1'; // shared test profile id

/** [registry path, invocation, expected method, expected path substring] */
const OPERATIONS: [string, (ctx: Ctx) => Promise<unknown>, string, string][] = [
	['profiles.list', (c) => Profiles.list(c, {}), 'GET', '/profiles'],
	[
		'profiles.get',
		(c) => Profiles.get(c, { profileId: P }),
		'GET',
		`/profiles/${P}`,
	],
	[
		'profiles.create',
		(c) => Profiles.create(c, { name: 'New' }),
		'POST',
		'/profiles',
	],
	[
		'profiles.update',
		(c) => Profiles.update(c, { profileId: P, name: 'Renamed' }),
		'PATCH',
		`/profiles/${P}`,
	],
	[
		'profiles.delete',
		(c) => Profiles.deleteProfile(c, { profileId: P }),
		'DELETE',
		`/profiles/${P}`,
	],
	[
		'profiles.rename',
		(c) => Profiles.rename(c, { profileId: P, name: 'Renamed' }),
		'PATCH',
		`/profiles/${P}`,
	],

	[
		'settings.get',
		(c) => Settings.get(c, { profileId: P }),
		'GET',
		`/profiles/${P}/settings`,
	],
	[
		'settings.update',
		(c) => Settings.update(c, { profileId: P, web3: false }),
		'PATCH',
		`/profiles/${P}/settings`,
	],
	[
		'settings.getBlockPage',
		(c) => Settings.getBlockPage(c, { profileId: P }),
		'GET',
		`/profiles/${P}/settings/blockPage`,
	],
	[
		'settings.updateBlockPage',
		(c) => Settings.updateBlockPage(c, { profileId: P, enabled: true }),
		'PATCH',
		`/profiles/${P}/settings/blockPage`,
	],
	[
		'settings.getLogs',
		(c) => Settings.getLogs(c, { profileId: P }),
		'GET',
		`/profiles/${P}/settings/logs`,
	],
	[
		'settings.updateLogs',
		(c) => Settings.updateLogs(c, { profileId: P, retention: 604800 }),
		'PATCH',
		`/profiles/${P}/settings/logs`,
	],
	[
		'settings.getPerformance',
		(c) => Settings.getPerformance(c, { profileId: P }),
		'GET',
		`/profiles/${P}/settings/performance`,
	],
	[
		'settings.updatePerformance',
		(c) => Settings.updatePerformance(c, { profileId: P, ecs: true }),
		'PATCH',
		`/profiles/${P}/settings/performance`,
	],
	[
		'settings.logClientIps',
		(c) => Settings.logClientIps(c, { profileId: P, enabled: true }),
		'PATCH',
		`/profiles/${P}/settings/logs`,
	],
	[
		'settings.logDomains',
		(c) => Settings.logDomains(c, { profileId: P, enabled: true }),
		'PATCH',
		`/profiles/${P}/settings/logs`,
	],

	[
		'security.get',
		(c) => Security.get(c, { profileId: P }),
		'GET',
		`/profiles/${P}/security`,
	],
	[
		'security.update',
		(c) => Security.update(c, { profileId: P, dga: true }),
		'PATCH',
		`/profiles/${P}/security`,
	],
	[
		'security.getTlds',
		(c) => Security.getTlds(c, { profileId: P }),
		'GET',
		`/profiles/${P}/security/tlds`,
	],
	[
		'security.addBlockedTld',
		(c) => Security.addBlockedTld(c, { profileId: P, id: 'tk' }),
		'POST',
		`/profiles/${P}/security/tlds`,
	],
	[
		'security.removeBlockedTld',
		(c) => Security.removeBlockedTld(c, { profileId: P, id: 'tk' }),
		'DELETE',
		`/profiles/${P}/security/tlds/tk`,
	],
	[
		'security.replaceTlds',
		(c) => Security.replaceTlds(c, { profileId: P, tlds: ['tk', 'cf'] }),
		'PUT',
		`/profiles/${P}/security/tlds`,
	],

	[
		'privacy.get',
		(c) => Privacy.get(c, { profileId: P }),
		'GET',
		`/profiles/${P}/privacy`,
	],
	[
		'privacy.update',
		(c) => Privacy.update(c, { profileId: P, allowAffiliate: false }),
		'PATCH',
		`/profiles/${P}/privacy`,
	],
	[
		'privacy.addBlocklist',
		(c) => Privacy.addBlocklist(c, { profileId: P, id: 'oisd' }),
		'POST',
		`/profiles/${P}/privacy/blocklists`,
	],
	[
		'privacy.deleteBlocklist',
		(c) => Privacy.deleteBlocklist(c, { profileId: P, id: 'oisd' }),
		'DELETE',
		`/profiles/${P}/privacy/blocklists/oisd`,
	],
	[
		'privacy.replaceBlocklists',
		(c) => Privacy.replaceBlocklists(c, { profileId: P, ids: ['oisd'] }),
		'PUT',
		`/profiles/${P}/privacy/blocklists`,
	],
	[
		'privacy.addNative',
		(c) => Privacy.addNative(c, { profileId: P, id: 'apple' }),
		'POST',
		`/profiles/${P}/privacy/natives`,
	],
	[
		'privacy.deleteNative',
		(c) => Privacy.deleteNative(c, { profileId: P, id: 'apple' }),
		'DELETE',
		`/profiles/${P}/privacy/natives/apple`,
	],
	[
		'privacy.replaceNatives',
		(c) => Privacy.replaceNatives(c, { profileId: P, ids: ['apple'] }),
		'PUT',
		`/profiles/${P}/privacy/natives`,
	],

	[
		'parentalControl.get',
		(c) => ParentalControl.get(c, { profileId: P }),
		'GET',
		`/profiles/${P}/parentalControl`,
	],
	[
		'parentalControl.update',
		(c) => ParentalControl.update(c, { profileId: P, safeSearch: true }),
		'PATCH',
		`/profiles/${P}/parentalControl`,
	],
	[
		'parentalControl.getCategories',
		(c) => ParentalControl.getCategories(c, { profileId: P }),
		'GET',
		`/profiles/${P}/parentalControl/categories`,
	],
	[
		'parentalControl.addCategory',
		(c) =>
			ParentalControl.addCategory(c, {
				profileId: P,
				id: 'porn',
				active: true,
			}),
		'POST',
		`/profiles/${P}/parentalControl/categories`,
	],
	[
		'parentalControl.deleteCategory',
		(c) => ParentalControl.deleteCategory(c, { profileId: P, id: 'porn' }),
		'DELETE',
		`/profiles/${P}/parentalControl/categories/porn`,
	],
	[
		'parentalControl.updateCategory',
		(c) =>
			ParentalControl.updateCategory(c, {
				profileId: P,
				id: 'gambling',
				active: false,
			}),
		'PATCH',
		`/profiles/${P}/parentalControl/categories/gambling`,
	],
	[
		'parentalControl.replaceCategories',
		(c) =>
			ParentalControl.replaceCategories(c, {
				profileId: P,
				categories: [{ id: 'porn', active: true }],
			}),
		'PUT',
		`/profiles/${P}/parentalControl/categories`,
	],
	[
		'parentalControl.getServices',
		(c) => ParentalControl.getServices(c, { profileId: P }),
		'GET',
		`/profiles/${P}/parentalControl/services`,
	],
	[
		'parentalControl.addService',
		(c) =>
			ParentalControl.addService(c, {
				profileId: P,
				id: 'tiktok',
				active: true,
			}),
		'POST',
		`/profiles/${P}/parentalControl/services`,
	],
	[
		'parentalControl.deleteService',
		(c) => ParentalControl.deleteService(c, { profileId: P, id: 'tiktok' }),
		'DELETE',
		`/profiles/${P}/parentalControl/services/tiktok`,
	],
	[
		'parentalControl.updateService',
		(c) =>
			ParentalControl.updateService(c, {
				profileId: P,
				id: 'tiktok',
				active: false,
			}),
		'PATCH',
		`/profiles/${P}/parentalControl/services/tiktok`,
	],
	[
		'parentalControl.replaceServices',
		(c) =>
			ParentalControl.replaceServices(c, {
				profileId: P,
				services: [{ id: 'tiktok', active: true }],
			}),
		'PUT',
		`/profiles/${P}/parentalControl/services`,
	],

	[
		'denylist.list',
		(c) => Denylist.list(c, { profileId: P }),
		'GET',
		`/profiles/${P}/denylist`,
	],
	[
		'denylist.add',
		(c) => Denylist.add(c, { profileId: P, id: 'bad.com' }),
		'POST',
		`/profiles/${P}/denylist`,
	],
	[
		'denylist.remove',
		(c) => Denylist.remove(c, { profileId: P, id: 'bad.com' }),
		'DELETE',
		`/profiles/${P}/denylist/bad.com`,
	],
	[
		'denylist.update',
		(c) => Denylist.update(c, { profileId: P, id: 'bad.com', active: false }),
		'PATCH',
		`/profiles/${P}/denylist/bad.com`,
	],
	[
		'denylist.replace',
		(c) => Denylist.replace(c, { profileId: P, domains: [{ id: 'bad.com' }] }),
		'PUT',
		`/profiles/${P}/denylist`,
	],

	[
		'allowlist.get',
		(c) => Allowlist.get(c, { profileId: P }),
		'GET',
		`/profiles/${P}/allowlist`,
	],
	[
		'allowlist.add',
		(c) => Allowlist.add(c, { profileId: P, id: 'good.com' }),
		'POST',
		`/profiles/${P}/allowlist`,
	],
	[
		'allowlist.delete',
		(c) => Allowlist.deleteEntry(c, { profileId: P, id: 'good.com' }),
		'DELETE',
		`/profiles/${P}/allowlist/good.com`,
	],
	[
		'allowlist.update',
		(c) => Allowlist.update(c, { profileId: P, id: 'good.com', active: true }),
		'PATCH',
		`/profiles/${P}/allowlist/good.com`,
	],
	[
		'allowlist.replace',
		(c) =>
			Allowlist.replace(c, { profileId: P, domains: [{ id: 'good.com' }] }),
		'PUT',
		`/profiles/${P}/allowlist`,
	],

	[
		'rewrites.get',
		(c) => Rewrites.get(c, { profileId: P }),
		'GET',
		`/profiles/${P}/rewrites`,
	],
	[
		'rewrites.add',
		(c) =>
			Rewrites.add(c, { profileId: P, name: 'a.local', content: '127.0.0.1' }),
		'POST',
		`/profiles/${P}/rewrites`,
	],
	[
		'rewrites.delete',
		(c) => Rewrites.deleteRewrite(c, { profileId: P, id: 'rw1' }),
		'DELETE',
		`/profiles/${P}/rewrites/rw1`,
	],

	[
		'analytics.status',
		(c) => Analytics.status(c, { profileId: P }),
		'GET',
		`/profiles/${P}/analytics/status`,
	],
	[
		'analytics.domains',
		(c) => Analytics.domains(c, { profileId: P }),
		'GET',
		`/profiles/${P}/analytics/domains`,
	],
	[
		'analytics.reasons',
		(c) => Analytics.reasons(c, { profileId: P }),
		'GET',
		`/profiles/${P}/analytics/reasons`,
	],
	[
		'analytics.ips',
		(c) => Analytics.ips(c, { profileId: P }),
		'GET',
		`/profiles/${P}/analytics/ips`,
	],
	[
		'analytics.devices',
		(c) => Analytics.devices(c, { profileId: P }),
		'GET',
		`/profiles/${P}/analytics/devices`,
	],
	[
		'analytics.protocols',
		(c) => Analytics.protocols(c, { profileId: P }),
		'GET',
		`/profiles/${P}/analytics/protocols`,
	],
	[
		'analytics.queryTypes',
		(c) => Analytics.queryTypes(c, { profileId: P }),
		'GET',
		`/profiles/${P}/analytics/queryTypes`,
	],
	[
		'analytics.ipVersions',
		(c) => Analytics.ipVersions(c, { profileId: P }),
		'GET',
		`/profiles/${P}/analytics/ipVersions`,
	],
	[
		'analytics.dnssec',
		(c) => Analytics.dnssec(c, { profileId: P }),
		'GET',
		`/profiles/${P}/analytics/dnssec`,
	],
	[
		'analytics.encryption',
		(c) => Analytics.encryption(c, { profileId: P }),
		'GET',
		`/profiles/${P}/analytics/encryption`,
	],
	[
		'analytics.destinations',
		(c) => Analytics.destinations(c, { profileId: P, type: 'countries' }),
		'GET',
		`/profiles/${P}/analytics/destinations`,
	],

	[
		'logs.get',
		(c) => Logs.get(c, { profileId: P }),
		'GET',
		`/profiles/${P}/logs`,
	],
	[
		'logs.download',
		(c) => Logs.download(c, { profileId: P }),
		'GET',
		`/profiles/${P}/logs/download`,
	],
	[
		'logs.clear',
		(c) => Logs.clear(c, { profileId: P }),
		'DELETE',
		`/profiles/${P}/logs`,
	],

	[
		'setup.updateLinkedIp',
		(c) => Setup.updateLinkedIp(c, { profileId: P }),
		'PATCH',
		`/profiles/${P}/setup/linkedip`,
	],

	['auth.login', (c) => Auth.login(c, {}), 'GET', '/profiles'],
];

describe('operation routing', () => {
	for (const [name, invoke, method, pathSubstring] of OPERATIONS) {
		it(`${name} issues ${method} ${pathSubstring}`, async () => {
			const { ctx } = makeCtx();
			await invoke(ctx);

			// The *first* request an operation makes, not the last: nine
			// sub-resource updates (security/privacy/parentalControl/settings)
			// confirmed live to return `204` with no body follow their `PATCH`
			// with a `GET` to hand the caller the resulting state, so `calls`
			// can have two entries for those operations.
			expect(calls[0]?.method).toBe(method);
			expect(calls[0]?.url).toContain(pathSubstring);
		});
	}
});

describe('operation coverage', () => {
	it('exercises every operation the plugin registers', () => {
		const registered = new Set(Object.keys(nextDNSEndpointSchemas));
		const exercised = new Set(OPERATIONS.map(([name]) => name));

		expect(registered.size).toBe(71);
		expect([...registered].sort()).toEqual([...exercised].sort());
	});
});

describe('analytics.destinations type parameter', () => {
	/**
	 * Confirmed live: omitting `type` 400s with
	 * `{"errors":[{"code":"required","source":{"parameter":"type"}}]}` -
	 * unlike every other one of the 11 analytics categories, this one has a
	 * required extra parameter.
	 */
	it('rejects a request with no type', () => {
		const result = nextDNSEndpointSchemas[
			'analytics.destinations'
		].input.safeParse({ profileId: P });
		expect(result.success).toBe(false);
	});

	it('rejects a type outside the confirmed enum', () => {
		const result = nextDNSEndpointSchemas[
			'analytics.destinations'
		].input.safeParse({ profileId: P, type: 'bogus' });
		expect(result.success).toBe(false);
	});

	it('accepts both confirmed valid type values', () => {
		for (const type of ['countries', 'gafam']) {
			const result = nextDNSEndpointSchemas[
				'analytics.destinations'
			].input.safeParse({ profileId: P, type });
			expect(result.success).toBe(true);
		}
	});

	it('sends type as a query parameter', async () => {
		const { ctx } = makeCtx();
		await Analytics.destinations(ctx, { profileId: P, type: 'gafam' });

		expect(lastUrl).toContain('type=gafam');
	});
});

/**
 * Confirmed live: `PATCH` on these nine sub-resources returns `204` with
 * no body (unlike `setup/linkedip`, which returns the updated resource
 * directly). Each must follow up with a `GET` on the same path to return
 * real data to the caller instead of `undefined`.
 */
describe('204-no-body sub-resource updates follow up with a GET', () => {
	const GET_AFTER_PATCH_OPERATIONS: [string, (ctx: Ctx) => Promise<unknown>][] =
		[
			['security.update', (c) => Security.update(c, { profileId: P })],
			['privacy.update', (c) => Privacy.update(c, { profileId: P })],
			[
				'parentalControl.update',
				(c) => ParentalControl.update(c, { profileId: P }),
			],
			['settings.update', (c) => Settings.update(c, { profileId: P })],
			[
				'settings.updateBlockPage',
				(c) => Settings.updateBlockPage(c, { profileId: P, enabled: true }),
			],
			[
				'settings.updateLogs',
				(c) => Settings.updateLogs(c, { profileId: P, retention: 604800 }),
			],
			[
				'settings.updatePerformance',
				(c) => Settings.updatePerformance(c, { profileId: P, ecs: true }),
			],
			[
				'settings.logClientIps',
				(c) => Settings.logClientIps(c, { profileId: P, enabled: true }),
			],
			[
				'settings.logDomains',
				(c) => Settings.logDomains(c, { profileId: P, enabled: true }),
			],
		];

	for (const [name, invoke] of GET_AFTER_PATCH_OPERATIONS) {
		it(`${name} issues a PATCH then a GET on the same resource, and returns the GET's data (not the PATCH's)`, async () => {
			const { ctx } = makeCtx();
			// A genuinely empty `204` on the `PATCH` (matching every live-tested
			// sub-resource update in this catalog), so this test can't pass
			// just because the mock always hands back parseable data
			// regardless of method - it has to actually reach the follow-up
			// `GET` for a result.
			global.fetch = (async (url: unknown, init?: RequestInit) => {
				const method = init?.method ?? 'GET';
				lastUrl = String(url);
				lastMethod = method;
				lastBody = init?.body ? JSON.parse(init.body as string) : undefined;
				calls.push({ url: lastUrl, method, body: lastBody });

				if (method === 'PATCH') {
					return {
						ok: true,
						status: 204,
						statusText: 'No Content',
						url: String(url),
						headers: new Headers(),
						json: async () => {
							throw new SyntaxError('Unexpected end of JSON input');
						},
						text: async () => '',
					};
				}
				return {
					ok: true,
					status: 200,
					statusText: 'OK',
					url: String(url),
					headers: new Headers({ 'Content-Type': 'application/json' }),
					json: async () => RESPONSE_BODY,
					text: async () => JSON.stringify(RESPONSE_BODY),
				};
			}) as unknown as typeof global.fetch;

			const result = await invoke(ctx);

			expect(calls.length).toBe(2);
			expect(calls[0]?.method).toBe('PATCH');
			expect(calls[1]?.method).toBe('GET');
			expect(calls[1]?.url).toBe(calls[0]?.url);
			// Proves the returned value came from the GET, not a (nonexistent)
			// PATCH body: every RESPONSE_BODY-derived field is present.
			expect(result).toMatchObject({ id: 'test-id', name: 'Test Profile' });
		});
	}
});

describe('logs.download', () => {
	it('returns the raw CSV text, not a JSON-wrapped url', async () => {
		global.fetch = (async () => ({
			ok: true,
			status: 200,
			statusText: 'OK',
			url: 'https://api.nextdns.io/profiles/p1/logs/download',
			headers: new Headers({ 'Content-Type': 'text/csv; charset=utf-8' }),
			json: async () => {
				throw new Error('should not be parsed as JSON');
			},
			text: async () => 'timestamp,domain\n2026-01-01,example.com\n',
		})) as unknown as typeof global.fetch;

		const { ctx } = makeCtx();
		const result = await Logs.download(ctx, { profileId: P });

		expect(typeof result).toBe('string');
		expect(result).toContain('timestamp,domain');
	});
});

describe('auth.login', () => {
	it('verifies the API key via GET /profiles rather than email/password', async () => {
		const { ctx } = makeCtx();
		const result = await Auth.login(ctx, {});

		expect(lastMethod).toBe('GET');
		expect(lastUrl).toContain('/profiles');
		expect(lastUrl).not.toContain('/accounts/@login');
		expect(result.valid).toBe(true);
		expect(result.profileCount).toBe(1);
	});
});

describe('settings.logClientIps / settings.logDomains polarity', () => {
	// Checks `calls[0]` (the `PATCH`), not the last call: both operations
	// follow their `PATCH` with a `GET` (see "operation routing" above).
	it('logClientIps(enabled: true) sends drop.ip: false', async () => {
		const { ctx } = makeCtx();
		await Settings.logClientIps(ctx, { profileId: P, enabled: true });

		expect(calls[0]?.body).toEqual({ drop: { ip: false } });
	});

	it('logClientIps(enabled: false) sends drop.ip: true', async () => {
		const { ctx } = makeCtx();
		await Settings.logClientIps(ctx, { profileId: P, enabled: false });

		expect(calls[0]?.body).toEqual({ drop: { ip: true } });
	});

	it('logDomains(enabled: true) sends drop.domain: false', async () => {
		const { ctx } = makeCtx();
		await Settings.logDomains(ctx, { profileId: P, enabled: true });

		expect(calls[0]?.body).toEqual({ drop: { domain: false } });
	});

	it('logDomains(enabled: false) sends drop.domain: true', async () => {
		const { ctx } = makeCtx();
		await Settings.logDomains(ctx, { profileId: P, enabled: false });

		expect(calls[0]?.body).toEqual({ drop: { domain: true } });
	});
});

describe('caching', () => {
	it('mirrors a profile on list and get', async () => {
		const { ctx, db } = makeCtx();

		await Profiles.list(ctx, {});
		await Profiles.get(ctx, { profileId: P });

		expect(db.profiles.upsertByEntityId).toHaveBeenCalledTimes(2);
	});

	/**
	 * `update`/`rename` don't fetch the profile back, so a cached `name`
	 * would go stale after a rename; `delete` removes the profile entirely.
	 * Both evict rather than try to keep the cache fresh - same "delete
	 * doesn't evict" bug class this repo's Mailtrap plugin had for contacts.
	 */
	it('evicts the cached profile on update, rename and delete', async () => {
		const { ctx, db } = makeCtx();

		await Profiles.update(ctx, { profileId: P, name: 'Renamed' });
		await Profiles.rename(ctx, { profileId: P, name: 'Renamed Again' });
		await Profiles.deleteProfile(ctx, { profileId: P });

		expect(db.profiles.deleteByEntityId).toHaveBeenCalledTimes(3);
		expect(db.profiles.deleteByEntityId).toHaveBeenCalledWith(P);
	});
});

describe('event log', () => {
	it('keeps a rewrite target out of the payload', async () => {
		const { ctx } = makeCtx();
		await Rewrites.add(ctx, {
			profileId: P,
			name: 'a.local',
			content: '127.0.0.1',
		});

		const payload = mockLogEvent.mock.calls[0]?.[2] as Record<string, unknown>;
		expect(payload).not.toHaveProperty('content');
	});

	it('keeps a profile name out of the payload', async () => {
		const { ctx } = makeCtx();
		await Profiles.update(ctx, { profileId: P, name: 'My Home Profile' });

		const payload = mockLogEvent.mock.calls[0]?.[2] as Record<string, unknown>;
		expect(payload).not.toHaveProperty('name');
	});

	it('never logs the linked-IP update token', async () => {
		const { ctx } = makeCtx();
		await Setup.updateLinkedIp(ctx, { profileId: P });

		const payload = mockLogEvent.mock.calls[0]?.[2] as Record<string, unknown>;
		expect(JSON.stringify(payload)).not.toContain('secret-token');
	});

	it('logs the profileId identifier for a filtered read', async () => {
		const { ctx } = makeCtx();
		await Denylist.list(ctx, { profileId: P });

		const payload = mockLogEvent.mock.calls[0]?.[2] as Record<string, unknown>;
		expect(payload).toEqual({ profileId: P });
	});
});

describe('settings.updateLogs retention', () => {
	/**
	 * Confirmed live: `0` and `-1` both 400 with
	 * `{"errors":[{"code":"enum","source":{"pointer":"/retention"}}]}` -
	 * `retention` is a fixed set of seven values (seconds), not a free-form
	 * number.
	 */
	it('rejects a retention value outside the confirmed enum', () => {
		const result = nextDNSEndpointSchemas[
			'settings.updateLogs'
		].input.safeParse({ profileId: P, retention: 100 });
		expect(result.success).toBe(false);
	});

	it('accepts every confirmed valid retention value', () => {
		for (const seconds of [
			3600, 86400, 604800, 2592000, 7776000, 15552000, 31536000,
		]) {
			const result = nextDNSEndpointSchemas[
				'settings.updateLogs'
			].input.safeParse({ profileId: P, retention: seconds });
			expect(result.success).toBe(true);
		}
	});
});

/**
 * Confirmed live during the verification round: both fields are real,
 * accepted request bodies the original implementation was missing -
 * `profiles.update`'s own catalog example shows a `denylist` field, and
 * `privacy.update`'s description explicitly names `blocklists`/`natives`.
 */
describe('profiles.update and privacy.update accept list fields', () => {
	it('profiles.update sends denylist/allowlist/rewrites when provided', async () => {
		const { ctx } = makeCtx();
		await Profiles.update(ctx, {
			profileId: P,
			denylist: [{ id: 'malware.com', active: true }],
			allowlist: [{ id: 'good.com' }],
			rewrites: [{ name: 'a.local', content: '127.0.0.1' }],
		});

		expect(lastBody).toMatchObject({
			denylist: [{ id: 'malware.com', active: true }],
			allowlist: [{ id: 'good.com' }],
			rewrites: [{ name: 'a.local', content: '127.0.0.1' }],
		});
	});

	it('privacy.update sends blocklists/natives when provided', async () => {
		const { ctx } = makeCtx();
		await Privacy.update(ctx, {
			profileId: P,
			blocklists: [{ id: 'nextdns-recommended' }],
			natives: [{ id: 'apple' }],
		});

		expect(calls[0]?.body).toMatchObject({
			blocklists: [{ id: 'nextdns-recommended' }],
			natives: [{ id: 'apple' }],
		});
	});
});
