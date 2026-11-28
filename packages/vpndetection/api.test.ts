import { ApiError } from 'corsair/http';
import { makeVpndetectionRequest } from './client';
import type { VpndetectionContext } from './context';
import {
	Account,
	ApiKeys,
	Databases,
	Entitlement,
	Ip,
	Organization,
} from './endpoints';
import { LookupIpResponseSchema } from './endpoints/types';

// Lookups need no key, so the keyless part is opt-in rather than keyed.
// VPNDETECTION_API_KEY (a free key is enough) adds the keyed routes.
const LIVE = process.env.VPNDETECTION_LIVE === '1';
const KEY = process.env.VPNDETECTION_API_KEY ?? '';
const describeLive = LIVE ? describe : describe.skip;
const describeKeyed = LIVE && KEY ? describe : describe.skip;

if (!LIVE) {
	console.warn(
		'VPNDETECTION_LIVE is not 1; the live VPNDetection suite is skipped',
	);
} else if (!KEY) {
	console.warn(
		'VPNDETECTION_API_KEY is not set; the keyed VPNDetection routes are skipped',
	);
}

function context(key: string): VpndetectionContext {
	return { key } as unknown as VpndetectionContext;
}

async function statusOf(promise: Promise<unknown>): Promise<number> {
	try {
		await promise;
		return 200;
	} catch (error) {
		if (error instanceof ApiError) return error.status;
		throw error;
	}
}

describeLive('VPNDetection live', () => {
	it('flags a Mullvad exit as a VPN', async () => {
		const body = await makeVpndetectionRequest<unknown>(KEY, '185.65.135.230');
		const parsed = LookupIpResponseSchema.parse(body);
		expect(parsed.is_vpn).toBe(true);
		expect(parsed.location?.country).toBe('SE');
	});

	it('flags a Tor relay', async () => {
		const body = await makeVpndetectionRequest<unknown>(KEY, '185.220.101.1');
		expect(LookupIpResponseSchema.parse(body).is_tor).toBe(true);
	});

	it('names the relay provider for iCloud Private Relay', async () => {
		const body = await makeVpndetectionRequest<unknown>(KEY, '172.224.226.1');
		const parsed = LookupIpResponseSchema.parse(body);
		expect(parsed.is_relay).toBe(true);
		expect(parsed.relay?.provider_name).toBe('Apple iCloud Private Relay');
	});

	it('reads an IPv6 address', async () => {
		const body = await makeVpndetectionRequest<unknown>(
			KEY,
			'2a03:1b20:3:f011::a01f',
		);
		expect(LookupIpResponseSchema.parse(body).is_vpn).toBe(true);
	});

	it('ip.lookup without ip answers for the caller', async () => {
		const result = await Ip.lookup(context(KEY), {});
		expect(typeof result.ip).toBe('string');
	});

	it('ip.lookup passes a user agent', async () => {
		const result = await Ip.lookup(context(KEY), {
			ip: '66.249.66.1',
			userAgent:
				'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
		});
		expect(result.ip).toBe('66.249.66.1');
	});
});

describeKeyed('VPNDetection live, keyed', () => {
	const ctx = context(KEY);

	it('ip.batch answers a batch of one on the free plan', async () => {
		const result = await Ip.batch(ctx, { ips: ['185.65.135.230'] });
		expect(result.results['185.65.135.230']?.is_vpn).toBe(true);
	});

	it('ip.batch of two needs a paid plan (402 on the free plan)', async () => {
		const status = await statusOf(
			Ip.batch(ctx, { ips: ['185.65.135.230', '185.220.101.1'] }),
		);
		expect([200, 402]).toContain(status);
	});

	it('entitlement.get reads the plan and usage', async () => {
		const result = await Entitlement.get(ctx, {});
		expect(result.plan.key).toBeTruthy();
		expect(typeof result.usage.requests).toBe('number');
	});

	it('databases list, metadata, checksum, download and history', async () => {
		const list = await Databases.list(ctx, {});
		expect(list.databases.length).toBeGreaterThan(0);
		const licensed = list.databases.find((db) => db.standing === 'licensed');
		const version = licensed?.versions?.[0];
		expect(version?.id).toBeTruthy();
		const id = version!.id;

		const metadata = await Databases.metadata(ctx, { id });
		expect(metadata.id).toBe(id);

		const checksum = await Databases.checksum(ctx, { id, format: 'csvgz' });
		expect(checksum.checksums.sha256).toMatch(/^[0-9a-f]{64}$/);

		const download = await Databases.download(ctx, { id, format: 'csvgz' });
		expect(download.url).toMatch(/^https:\/\//);

		const history = await Databases.downloads(ctx, { limit: 5 });
		expect(Array.isArray(history.downloads)).toBe(true);
	});

	it('databases.download of an unlicensed database is refused (403)', async () => {
		const list = await Databases.list(ctx, {});
		const version = list.databases.find((db) => db.standing === 'unlicensed')
			?.versions?.[0];
		if (!version) {
			console.warn(
				'Every database is licensed to this key; skipping the 403 check',
			);
			return;
		}
		const format = version.formats?.some((f) => f.format === 'mmdb')
			? 'mmdb'
			: 'csvgz';
		const status = await statusOf(
			Databases.download(ctx, { id: version.id, format }),
		);
		expect(status).toBe(403);
	});

	// The /api/v1/iam routes need an OAuth scope an API key does not carry:
	// with a key they answer 403 FORBIDDEN, with a token the documented shape.
	it.each([
		['account.identity', () => Account.identity(ctx, {})],
		['organization.get', () => Organization.get(ctx, {})],
		['organization.listMembers', () => Organization.listMembers(ctx, {})],
		['apiKeys.list', () => ApiKeys.list(ctx, {})],
	])('%s answers 200 with a token or 403 with a key', async (_, run) => {
		expect([200, 403]).toContain(await statusOf(run()));
	});

	it('apiKeys create/rotate/reveal/revoke are refused for an API key', async () => {
		const unknownId = '00000000-0000-0000-0000-000000000000';
		// With an OAuth token holding apikeys.manage the create succeeds: the
		// new key is revoked at once so no run leaves a live credential.
		const created = await ApiKeys.create(ctx, {
			name: 'corsair-live-check',
		}).catch((error: unknown) => error);
		if (created instanceof ApiError) {
			expect(created.status).toBe(403);
		} else {
			const { id } = created as { id: string };
			await ApiKeys.revoke(ctx, { id });
		}
		for (const run of [ApiKeys.rotate, ApiKeys.reveal, ApiKeys.revoke]) {
			expect([403, 404]).toContain(await statusOf(run(ctx, { id: unknownId })));
		}
	});
});
