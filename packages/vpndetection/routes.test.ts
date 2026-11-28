import { logEventFromContext } from 'corsair/core';
import { ApiError, request } from 'corsair/http';
import type { VpndetectionContext } from './context';
import {
	Account,
	ApiKeys,
	Databases,
	Entitlement,
	Ip,
	Organization,
} from './endpoints';

jest.mock('corsair/core', () => {
	const actual = jest.requireActual('corsair/core');
	return {
		...actual,
		logEventFromContext: jest.fn().mockResolvedValue(undefined),
	};
});

jest.mock('corsair/http', () => {
	const actual = jest.requireActual('corsair/http');
	return { ...actual, request: jest.fn() };
});

const mockRequest = jest.mocked(request);
const mockLog = jest.mocked(logEventFromContext);

function context(key = 'test-key', upsert?: jest.Mock): VpndetectionContext {
	return {
		key,
		db: upsert ? { lookups: { upsertByEntityId: upsert } } : undefined,
	} as unknown as VpndetectionContext;
}

function lastCall() {
	const call = mockRequest.mock.calls.at(-1);
	return { config: call?.[0], options: call?.[1] };
}

// Live answers, 2026-11-28 (free key, trial), trimmed.
const ENTITLEMENT = {
	org_id: '779e752c-1773-48b6-a440-84d1976defae',
	apikey: { id: 'bb6f4ec5', expires: null, allowed_cidrs: [] },
	plan: { key: 'free', name: 'Unlimited', tier: 'free' },
	usage: {
		requests: 0,
		quota: 100000,
		hard_limit: null,
		window_start: '2026-11-28T09:09:58Z',
		window_end: '2026-12-05T09:09:58Z',
	},
};

const DATABASES = {
	databases: [
		{
			base: 'tor_ip',
			name: 'Tor IP',
			summary: 'Tor node IP addresses.',
			license_type: null,
			starts: null,
			expires: null,
			renews_at: null,
			notice_due_at: null,
			in_term: true,
			standing: 'licensed',
			open: true,
			versions: [
				{
					id: 'tor_ip_v1',
					version: 1,
					formats: [
						{ format: 'csvgz', bytes: 52011 },
						{ format: 'mmdb', bytes: 80113 },
					],
				},
			],
		},
	],
};

const CHECKSUM = {
	id: 'tor_ip_v1',
	format: 'csvgz',
	checksums: {
		md5: '99ea4d124e8328e78fe3462a9fb2726a',
		sha1: '37932768a776ff43a47e348bf0fe79fab361bc3d',
		sha256: 'd556cc4882d27b3fa82bcdb714306bef59aa8fff38ed3eda34bafd7ddaa5cbdd',
		sha512: '5951cb5c',
	},
};

const DOWNLOADS = {
	downloads: [
		{
			dataset_id: 'relay_ip_v1',
			format: 'csvgz',
			outcome: 'ok',
			sample: false,
			open: true,
			bytes: 1252795,
			http_status: 302,
			apikey_id: 'bb6f4ec5',
			client_ip: '203.0.113.7',
			user_agent: 'node',
			created: '2026-11-28T09:15:25.770Z',
		},
	],
};

beforeEach(() => {
	jest.clearAllMocks();
});

describe('ip.batch', () => {
	it('posts the addresses and user agents, and saves each answer', async () => {
		mockRequest.mockResolvedValue({
			results: {
				'185.65.135.230': { ip: '185.65.135.230', is_vpn: true },
			},
			errors: { 'not-an-ip': { status: 400, error: 'not an address' } },
		});
		const upsert = jest.fn().mockResolvedValue(undefined);

		const result = await Ip.batch(context('test-key', upsert), {
			ips: ['185.65.135.230', 'not-an-ip'],
			userAgents: { '185.65.135.230': 'curl/8' },
		});

		expect(lastCall().options).toMatchObject({
			method: 'POST',
			url: '/batch',
			body: {
				ips: ['185.65.135.230', 'not-an-ip'],
				user_agents: { '185.65.135.230': 'curl/8' },
			},
			mediaType: 'application/json',
		});
		expect(lastCall().config?.TOKEN).toBe('test-key');
		expect(result.errors['not-an-ip']?.status).toBe(400);
		expect(upsert).toHaveBeenCalledTimes(1);
		expect(upsert.mock.calls[0]?.[0]).toBe('185.65.135.230');
		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'vpndetection.ip.batch',
			{ requested: 2, answered: 1, failed: 1 },
			'completed',
		);
	});

	it('refuses an empty batch and one over 1000 before any request', async () => {
		await expect(Ip.batch(context(), { ips: [] })).rejects.toThrow();
		const tooMany = Array.from(
			{ length: 1001 },
			(_, i) => `10.0.${i >> 8}.${i & 255}`,
		);
		await expect(Ip.batch(context(), { ips: tooMany })).rejects.toThrow();
		expect(mockRequest).not.toHaveBeenCalled();
	});

	it('lets the 402 for a free plan through as ApiError', async () => {
		const error = new ApiError(
			{ method: 'POST', url: '/batch' },
			{
				url: 'https://api.vpndetection.io/batch',
				ok: false,
				status: 402,
				statusText: 'Payment Required',
				body: { error: 'POST /batch needs a paid plan' },
			},
			'Payment Required',
		);
		mockRequest.mockRejectedValue(error);
		await expect(
			Ip.batch(context(), { ips: ['1.1.1.1', '8.8.8.8'] }),
		).rejects.toBe(error);
	});
});

describe('ip.lookup', () => {
	it('sends the user agent as user_agent', async () => {
		mockRequest.mockResolvedValue({ ip: '66.249.66.1', is_vpn: false });
		await Ip.lookup(context(), { ip: '66.249.66.1', userAgent: 'Googlebot' });
		expect(lastCall().options?.query).toEqual({ user_agent: 'Googlebot' });
	});
});

describe('databases', () => {
	it('list reads /api/v1/database/list', async () => {
		mockRequest.mockResolvedValue(DATABASES);
		const result = await Databases.list(context(), {});
		expect(lastCall().options).toMatchObject({
			method: 'GET',
			url: '/api/v1/database/list',
		});
		expect(result.databases[0]?.versions?.[0]?.id).toBe('tor_ip_v1');
	});

	it('metadata and checksum pass id and format in the query', async () => {
		mockRequest.mockResolvedValueOnce({
			id: 'tor_ip_v1',
			update_freq: 'daily',
			schema: { csvgz: [] },
		});
		await Databases.metadata(context(), { id: 'tor_ip_v1' });
		expect(lastCall().options).toMatchObject({
			url: '/api/v1/database/metadata',
			query: { id: 'tor_ip_v1' },
		});

		mockRequest.mockResolvedValueOnce(CHECKSUM);
		const checksum = await Databases.checksum(context(), {
			id: 'tor_ip_v1',
			format: 'csvgz',
		});
		expect(lastCall().options).toMatchObject({
			url: '/api/v1/database/checksum',
			query: { id: 'tor_ip_v1', format: 'csvgz' },
		});
		expect(checksum.checksums.sha256).toHaveLength(64);
	});

	it('refuses a format other than csvgz or mmdb', async () => {
		await expect(
			Databases.checksum(context(), {
				id: 'tor_ip_v1',
				format: 'zip' as 'csvgz',
			}),
		).rejects.toThrow();
		expect(mockRequest).not.toHaveBeenCalled();
	});

	it('downloads lists recent attempts with a limit', async () => {
		mockRequest.mockResolvedValue(DOWNLOADS);
		const result = await Databases.downloads(context(), { limit: 5 });
		expect(lastCall().options).toMatchObject({
			url: '/api/v1/database/downloads',
			query: { limit: 5 },
		});
		expect(result.downloads[0]?.outcome).toBe('ok');
	});

	describe('download', () => {
		const realFetch = global.fetch;
		afterEach(() => {
			global.fetch = realFetch;
		});

		it('returns the redirect target without following it', async () => {
			const fetchMock = jest.fn().mockResolvedValue(
				new Response(null, {
					status: 302,
					headers: { location: 'https://s3.example/tor_ip_v1.csv.gz?sig=1' },
				}),
			);
			global.fetch = fetchMock as unknown as typeof fetch;

			const result = await Databases.download(context('test-key'), {
				id: 'tor_ip_v1',
				format: 'csvgz',
				build: '20261128.abc',
			});

			expect(result.url).toBe('https://s3.example/tor_ip_v1.csv.gz?sig=1');
			const [url, init] = fetchMock.mock.calls[0] as [URL, RequestInit];
			expect(url.toString()).toBe(
				'https://api.vpndetection.io/api/v1/database/download?id=tor_ip_v1&format=csvgz&build=20261128.abc',
			);
			expect(init.redirect).toBe('manual');
			expect((init.headers as Record<string, string>).Authorization).toBe(
				'Bearer test-key',
			);
			// The signed link stays out of the log.
			expect(mockLog).toHaveBeenCalledWith(
				expect.anything(),
				'vpndetection.databases.download',
				{ id: 'tor_ip_v1', format: 'csvgz' },
				'completed',
			);
		});

		it('turns a refusal into core ApiError with the rc body', async () => {
			global.fetch = jest.fn().mockResolvedValue(
				new Response(JSON.stringify({ rc: 'NOT_LICENSED' }), {
					status: 403,
					headers: { 'content-type': 'application/json' },
				}),
			) as unknown as typeof fetch;

			const error = await Databases.download(context(), {
				id: 'vpn_ip_v1',
				format: 'mmdb',
			}).catch((e: unknown) => e);

			expect(error).toBeInstanceOf(ApiError);
			expect((error as ApiError).status).toBe(403);
			expect((error as ApiError).body).toEqual({ rc: 'NOT_LICENSED' });
		});

		it('carries Retry-After on a 429', async () => {
			global.fetch = jest
				.fn()
				.mockResolvedValue(
					new Response('{}', { status: 429, headers: { 'retry-after': '7' } }),
				) as unknown as typeof fetch;

			const error = (await Databases.download(context(), {
				id: 'tor_ip_v1',
				format: 'csvgz',
			}).catch((e: unknown) => e)) as ApiError;

			expect(error.status).toBe(429);
			expect(error.retryAfter).toBe(7);
		});
	});
});

describe('entitlement and account', () => {
	it('entitlement.get reads the plan and logs no ids', async () => {
		mockRequest.mockResolvedValue(ENTITLEMENT);
		const result = await Entitlement.get(context(), {});
		expect(lastCall().options?.url).toBe('/api/v1/entitlement');
		expect(result.plan.name).toBe('Unlimited');
		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'vpndetection.entitlement.get',
			{ plan: 'free', requests: 0 },
			'completed',
		);
	});

	it.each([
		[() => Account.identity(context(), {}), '/api/v1/iam/identity'],
		[() => Organization.get(context(), {}), '/api/v1/iam/org'],
		[() => Organization.listMembers(context(), {}), '/api/v1/iam/org/members'],
		[() => ApiKeys.list(context(), {}), '/api/v1/iam/apikeys'],
	])('reads %#: %s', async (run, url) => {
		mockRequest.mockResolvedValue({ rc: 'SUCCESS', keys: [] });
		await run();
		expect(lastCall().options).toMatchObject({ method: 'GET', url });
		expect(lastCall().config?.TOKEN).toBe('test-key');
	});

	it('passes the 403 FORBIDDEN a plain key gets through unchanged', async () => {
		const error = new ApiError(
			{ method: 'GET', url: '/api/v1/iam/identity' },
			{
				url: 'https://api.vpndetection.io/api/v1/iam/identity',
				ok: false,
				status: 403,
				statusText: 'Forbidden',
				body: { rc: 'FORBIDDEN' },
			},
			'Forbidden',
		);
		mockRequest.mockRejectedValue(error);
		await expect(Account.identity(context(), {})).rejects.toBe(error);
	});
});

describe('apiKeys', () => {
	it('create posts name and allowed_scopes and logs only the id', async () => {
		mockRequest.mockResolvedValue({
			rc: 'SUCCESS',
			id: 'k1',
			name: 'ci',
			key: 'mk_secret',
			allowed_scopes: ['ip.lookup'],
		});
		const result = await ApiKeys.create(context(), {
			name: 'ci',
			allowedScopes: ['ip.lookup'],
		});
		expect(lastCall().options).toMatchObject({
			method: 'POST',
			url: '/api/v1/iam/apikeys',
			body: { name: 'ci', allowed_scopes: ['ip.lookup'] },
		});
		expect(result.key).toBe('mk_secret');
		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'vpndetection.apiKeys.create',
			{ id: 'k1' },
			'completed',
		);
	});

	it.each([
		['rotate', ApiKeys.rotate, { rc: 'SUCCESS', id: 'k1', key: 'mk_new' }],
		['revoke', ApiKeys.revoke, { rc: 'SUCCESS' }],
		['reveal', ApiKeys.reveal, { rc: 'SUCCESS', key: 'mk_secret' }],
	] as const)('%s posts to /apikeys/{id}/%s', async (action, run, answer) => {
		mockRequest.mockResolvedValue(answer);
		await run(context(), { id: 'k1' });
		expect(lastCall().options).toMatchObject({
			method: 'POST',
			url: `/api/v1/iam/apikeys/{id}/${action}`,
			path: { id: 'k1' },
		});
	});

	it('refuses a scope the API does not issue to keys', async () => {
		await expect(
			ApiKeys.create(context(), {
				name: 'x',
				allowedScopes: ['apikeys.manage' as 'ip.lookup'],
			}),
		).rejects.toThrow();
		expect(mockRequest).not.toHaveBeenCalled();
	});
});
