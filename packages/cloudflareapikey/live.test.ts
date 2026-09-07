import { CloudflareApiKeyAPIError } from './api-error';
import {
	cacheGetRegionalTieredCache,
	dnsCreate,
	dnsDelete,
	dnsList,
	dnsOverwrite,
	dnssecDelete,
	dnssecUpdate,
	ipsGet,
	lockdownsCreate,
	lockdownsGet,
	lockdownsUpdate,
	rulesetsCreate,
	rulesetsCreateRule,
	rulesetsDelete,
	rulesetsDeleteRule,
	rulesetsGet,
	rulesetsGetEntrypointVersion,
	rulesetsUpdate,
	rulesetsUpdateRule,
	s3Upload,
	zonesDelete,
	zonesGet,
	zonesList,
	zonesRerunActivationCheck,
	zonesUpdate,
} from './endpoints';
import { CloudflareApiKeyEndpointOutputSchemas } from './endpoints/types';
import type { CloudflareApiKeyContext } from './index';

jest.setTimeout(120000);

const TOKEN = process.env.CLOUDFLARE_API_TOKEN?.trim();
const ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID?.trim();
const live = TOKEN ? describe : describe.skip;
const MISSING = '00000000000000000000000000000000';
const MANAGED_RULESET = '77454fe2d30c4220b5701f6fdfb893ba';

const ctx = {
	key: TOKEN ?? '',
	db: {},
	$getAccountId: async () => ACCOUNT_ID,
} as unknown as CloudflareApiKeyContext;

async function expectCloudflareError(
	fn: () => Promise<unknown>,
): Promise<CloudflareApiKeyAPIError> {
	try {
		await fn();
		throw new Error('expected Cloudflare API error');
	} catch (error) {
		expect(error).toBeInstanceOf(CloudflareApiKeyAPIError);
		return error as CloudflareApiKeyAPIError;
	}
}

live('Cloudflare live API', () => {
	it('Get Cloudflare IP Addresses', async () => {
		const result = await ipsGet(ctx, {});
		CloudflareApiKeyEndpointOutputSchemas.ipsGet.parse(result);
		expect(result.ipv4_cidrs?.length ?? 0).toBeGreaterThan(0);
	});

	it('List Cloudflare Zones', async () => {
		const result = await zonesList(ctx, { per_page: 5 });
		CloudflareApiKeyEndpointOutputSchemas.zonesList.parse(result);
		expect(Array.isArray(result)).toBe(true);
	});

	it('Get Zone Details', async () => {
		const error = await expectCloudflareError(() =>
			zonesGet(ctx, { zone_id: MISSING }),
		);
		expect(error.message.length).toBeGreaterThan(0);
	});

	it('Update Cloudflare Zone', async () => {
		await expectCloudflareError(() =>
			zonesUpdate(ctx, { zone_id: MISSING, paused: false }),
		);
	});

	it('Rerun Zone Activation Check', async () => {
		await expectCloudflareError(() =>
			zonesRerunActivationCheck(ctx, { zone_id: MISSING }),
		);
	});

	it('Delete a zone', async () => {
		await expectCloudflareError(() => zonesDelete(ctx, { zone_id: MISSING }));
	});

	it('List DNS Records', async () => {
		await expectCloudflareError(() =>
			dnsList(ctx, { zone_id: MISSING, per_page: 5 }),
		);
	});

	it('Create DNS Record', async () => {
		await expectCloudflareError(() =>
			dnsCreate(ctx, {
				zone_id: MISSING,
				type: 'TXT',
				name: 'example.com',
				content: 'corsair-live',
			}),
		);
	});

	it('Overwrite DNS Record', async () => {
		await expectCloudflareError(() =>
			dnsOverwrite(ctx, {
				zone_id: MISSING,
				dns_record_id: MISSING,
				type: 'TXT',
				name: 'example.com',
				content: 'corsair-live',
			}),
		);
	});

	it('Delete DNS Record', async () => {
		await expectCloudflareError(() =>
			dnsDelete(ctx, { zone_id: MISSING, dns_record_id: MISSING }),
		);
	});

	it('Update DNSSEC Status', async () => {
		await expectCloudflareError(() =>
			dnssecUpdate(ctx, { zone_id: MISSING, status: 'disabled' }),
		);
	});

	it('Delete DNSSEC', async () => {
		await expectCloudflareError(() => dnssecDelete(ctx, { zone_id: MISSING }));
	});

	it('Create Zone Lockdown Rule', async () => {
		await expectCloudflareError(() =>
			lockdownsCreate(ctx, {
				zone_id: MISSING,
				urls: ['example.com/corsair-live'],
				configurations: [{ target: 'ip', value: '192.0.2.1' }],
			}),
		);
	});

	it('Get Lockdown Rule', async () => {
		await expectCloudflareError(() =>
			lockdownsGet(ctx, { zone_id: MISSING, lockdown_id: MISSING }),
		);
	});

	it('Update Lockdown Rule', async () => {
		await expectCloudflareError(() =>
			lockdownsUpdate(ctx, {
				zone_id: MISSING,
				lockdown_id: MISSING,
				paused: true,
			}),
		);
	});

	it('Get Ruleset', async () => {
		if (!ACCOUNT_ID) throw new Error('Set CLOUDFLARE_ACCOUNT_ID');
		const result = await rulesetsGet(ctx, {
			account_id: ACCOUNT_ID,
			ruleset_id: MANAGED_RULESET,
		});
		CloudflareApiKeyEndpointOutputSchemas.rulesetsGet.parse(result);
		expect(result.id).toBe(MANAGED_RULESET);
	});

	it('Create Ruleset', async () => {
		if (!ACCOUNT_ID) throw new Error('Set CLOUDFLARE_ACCOUNT_ID');
		await expectCloudflareError(() =>
			rulesetsCreate(ctx, {
				account_id: ACCOUNT_ID,
				name: 'corsair-live',
				kind: 'custom',
				phase: 'http_request_firewall_custom',
			}),
		);
	});

	it('Update Ruleset', async () => {
		if (!ACCOUNT_ID) throw new Error('Set CLOUDFLARE_ACCOUNT_ID');
		await expectCloudflareError(() =>
			rulesetsUpdate(ctx, {
				account_id: ACCOUNT_ID,
				ruleset_id: MANAGED_RULESET,
				rules: [],
			}),
		);
	});

	it('Create Rule in Ruleset', async () => {
		if (!ACCOUNT_ID) throw new Error('Set CLOUDFLARE_ACCOUNT_ID');
		await expectCloudflareError(() =>
			rulesetsCreateRule(ctx, {
				account_id: ACCOUNT_ID,
				ruleset_id: MANAGED_RULESET,
				action: 'log',
				expression: 'true',
			}),
		);
	});

	it('Update Rule in Ruleset', async () => {
		if (!ACCOUNT_ID) throw new Error('Set CLOUDFLARE_ACCOUNT_ID');
		await expectCloudflareError(() =>
			rulesetsUpdateRule(ctx, {
				account_id: ACCOUNT_ID,
				ruleset_id: MANAGED_RULESET,
				rule_id: MISSING,
				enabled: false,
			}),
		);
	});

	it('Delete Rule from Ruleset', async () => {
		if (!ACCOUNT_ID) throw new Error('Set CLOUDFLARE_ACCOUNT_ID');
		await expectCloudflareError(() =>
			rulesetsDeleteRule(ctx, {
				account_id: ACCOUNT_ID,
				ruleset_id: MANAGED_RULESET,
				rule_id: MISSING,
			}),
		);
	});

	it('Get Entrypoint Ruleset Version', async () => {
		if (!ACCOUNT_ID) throw new Error('Set CLOUDFLARE_ACCOUNT_ID');
		await expectCloudflareError(() =>
			rulesetsGetEntrypointVersion(ctx, {
				account_id: ACCOUNT_ID,
				ruleset_phase: 'http_request_firewall_managed',
				ruleset_version: '74',
			}),
		);
	});

	it('Delete Ruleset', async () => {
		await expectCloudflareError(() =>
			rulesetsDelete(ctx, { account_id: ACCOUNT_ID, ruleset_id: MISSING }),
		);
	});

	it('Get Regional Tiered Cache', async () => {
		await expectCloudflareError(() =>
			cacheGetRegionalTieredCache(ctx, { zone_id: MISSING }),
		);
	});

	it('Upload File to S3', async () => {
		if (!ACCOUNT_ID) throw new Error('Set CLOUDFLARE_ACCOUNT_ID');
		const error = await expectCloudflareError(() =>
			s3Upload(ctx, {
				account_id: ACCOUNT_ID,
				bucket_name: 'corsair-live',
				object_key: 'corsair-live.txt',
				content: 'corsair-live',
			}),
		);
		expect(error.message.toLowerCase()).toContain('r2');
	});
});
