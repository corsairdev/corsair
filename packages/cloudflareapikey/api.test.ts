import { logEventFromContext } from 'corsair/core';
import { makeCloudflareApiKeyRequest } from './client';
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
import type { CloudflareApiKeyContext } from './index';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn(),
}));

jest.mock('./client', () => ({
	makeCloudflareApiKeyRequest: jest.fn(),
}));

const request = makeCloudflareApiKeyRequest as jest.MockedFunction<
	typeof makeCloudflareApiKeyRequest
>;

const ctx = { key: 'token', db: {} } as CloudflareApiKeyContext;

beforeEach(() => {
	request.mockReset();
	request.mockResolvedValue({ id: 'ok' });
	(logEventFromContext as jest.Mock).mockResolvedValue(undefined);
});

describe('Cloudflare API key endpoints', () => {
	it('zones.list GET /zones', async () => {
		request.mockResolvedValue([{ id: 'z1', name: 'example.com' }]);
		await zonesList(ctx, { per_page: 5 });
		expect(request).toHaveBeenCalledWith('/zones', 'token', {
			method: 'GET',
			query: { per_page: 5 },
		});
	});

	it('zones.get GET /zones/:id', async () => {
		await zonesGet(ctx, { zone_id: 'z1' });
		expect(request).toHaveBeenCalledWith('/zones/z1', 'token', {
			method: 'GET',
		});
	});

	it('zones.update PATCH /zones/:id', async () => {
		await zonesUpdate(ctx, { zone_id: 'z1', paused: true });
		expect(request).toHaveBeenCalledWith('/zones/z1', 'token', {
			method: 'PATCH',
			body: { paused: true },
		});
	});

	it('zones.delete DELETE /zones/:id', async () => {
		await zonesDelete(ctx, { zone_id: 'z1' });
		expect(request).toHaveBeenCalledWith('/zones/z1', 'token', {
			method: 'DELETE',
		});
	});

	it('zones.rerunActivationCheck PUT /zones/:id/activation_check', async () => {
		await zonesRerunActivationCheck(ctx, { zone_id: 'z1' });
		expect(request).toHaveBeenCalledWith(
			'/zones/z1/activation_check',
			'token',
			{
				method: 'PUT',
				body: {},
			},
		);
	});

	it('dns.list GET /zones/:id/dns_records', async () => {
		request.mockResolvedValue([]);
		await dnsList(ctx, { zone_id: 'z1', type: 'A', per_page: 20 });
		expect(request).toHaveBeenCalledWith('/zones/z1/dns_records', 'token', {
			method: 'GET',
			query: { type: 'A', per_page: 20 },
		});
	});

	it('dns.create POST /zones/:id/dns_records', async () => {
		await dnsCreate(ctx, {
			zone_id: 'z1',
			type: 'TXT',
			name: 'example.com',
			content: 'v=test',
		});
		expect(request).toHaveBeenCalledWith('/zones/z1/dns_records', 'token', {
			method: 'POST',
			body: { type: 'TXT', name: 'example.com', content: 'v=test' },
		});
	});

	it('dns.overwrite PUT /zones/:id/dns_records/:record', async () => {
		await dnsOverwrite(ctx, {
			zone_id: 'z1',
			dns_record_id: 'r1',
			type: 'TXT',
			name: 'example.com',
			content: 'v=next',
		});
		expect(request).toHaveBeenCalledWith('/zones/z1/dns_records/r1', 'token', {
			method: 'PUT',
			body: { type: 'TXT', name: 'example.com', content: 'v=next' },
		});
	});

	it('dns.delete DELETE /zones/:id/dns_records/:record', async () => {
		await dnsDelete(ctx, { zone_id: 'z1', dns_record_id: 'r1' });
		expect(request).toHaveBeenCalledWith('/zones/z1/dns_records/r1', 'token', {
			method: 'DELETE',
		});
	});

	it('dnssec.update PATCH /zones/:id/dnssec', async () => {
		await dnssecUpdate(ctx, { zone_id: 'z1', status: 'disabled' });
		expect(request).toHaveBeenCalledWith('/zones/z1/dnssec', 'token', {
			method: 'PATCH',
			body: { status: 'disabled' },
		});
	});

	it('dnssec.delete DELETE /zones/:id/dnssec', async () => {
		await dnssecDelete(ctx, { zone_id: 'z1' });
		expect(request).toHaveBeenCalledWith('/zones/z1/dnssec', 'token', {
			method: 'DELETE',
		});
	});

	it('lockdowns.create POST /zones/:id/firewall/lockdowns', async () => {
		await lockdownsCreate(ctx, {
			zone_id: 'z1',
			urls: ['api.example.com/*'],
			configurations: [{ target: 'ip', value: '192.0.2.1' }],
		});
		expect(request).toHaveBeenCalledWith(
			'/zones/z1/firewall/lockdowns',
			'token',
			{
				method: 'POST',
				body: {
					urls: ['api.example.com/*'],
					configurations: [{ target: 'ip', value: '192.0.2.1' }],
				},
			},
		);
	});

	it('lockdowns.get GET /zones/:id/firewall/lockdowns/:lockdown', async () => {
		await lockdownsGet(ctx, { zone_id: 'z1', lockdown_id: 'l1' });
		expect(request).toHaveBeenCalledWith(
			'/zones/z1/firewall/lockdowns/l1',
			'token',
			{ method: 'GET' },
		);
	});

	it('lockdowns.update PUT /zones/:id/firewall/lockdowns/:lockdown', async () => {
		await lockdownsUpdate(ctx, {
			zone_id: 'z1',
			lockdown_id: 'l1',
			paused: true,
		});
		expect(request).toHaveBeenCalledWith(
			'/zones/z1/firewall/lockdowns/l1',
			'token',
			{ method: 'PUT', body: { paused: true } },
		);
	});

	it('rulesets.get uses zone scope', async () => {
		await rulesetsGet(ctx, { zone_id: 'z1', ruleset_id: 'rs1' });
		expect(request).toHaveBeenCalledWith('/zones/z1/rulesets/rs1', 'token', {
			method: 'GET',
		});
	});

	it('rulesets.create uses account scope', async () => {
		await rulesetsCreate(ctx, {
			account_id: 'a1',
			name: 'custom',
			kind: 'custom',
			phase: 'http_request_firewall_custom',
		});
		expect(request).toHaveBeenCalledWith('/accounts/a1/rulesets', 'token', {
			method: 'POST',
			body: {
				name: 'custom',
				kind: 'custom',
				phase: 'http_request_firewall_custom',
			},
		});
	});

	it('rulesets.update PUT includes all remaining rules', async () => {
		await rulesetsUpdate(ctx, {
			zone_id: 'z1',
			ruleset_id: 'rs1',
			rules: [{ action: 'block', expression: 'true' }],
		});
		expect(request).toHaveBeenCalledWith('/zones/z1/rulesets/rs1', 'token', {
			method: 'PUT',
			body: { rules: [{ action: 'block', expression: 'true' }] },
		});
	});

	it('rulesets.delete DELETE /scope/rulesets/:id', async () => {
		request.mockResolvedValue(null);
		await rulesetsDelete(ctx, { zone_id: 'z1', ruleset_id: 'rs1' });
		expect(request).toHaveBeenCalledWith('/zones/z1/rulesets/rs1', 'token', {
			method: 'DELETE',
		});
	});

	it('rulesets.createRule POST /scope/rulesets/:id/rules', async () => {
		await rulesetsCreateRule(ctx, {
			zone_id: 'z1',
			ruleset_id: 'rs1',
			action: 'block',
			expression: 'ip.src eq 1.1.1.1',
		});
		expect(request).toHaveBeenCalledWith(
			'/zones/z1/rulesets/rs1/rules',
			'token',
			{
				method: 'POST',
				body: { action: 'block', expression: 'ip.src eq 1.1.1.1' },
			},
		);
	});

	it('rulesets.updateRule PATCH /scope/rulesets/:id/rules/:rule', async () => {
		await rulesetsUpdateRule(ctx, {
			account_id: 'a1',
			ruleset_id: 'rs1',
			rule_id: 'rl1',
			enabled: false,
		});
		expect(request).toHaveBeenCalledWith(
			'/accounts/a1/rulesets/rs1/rules/rl1',
			'token',
			{ method: 'PATCH', body: { enabled: false } },
		);
	});

	it('rulesets.deleteRule DELETE /scope/rulesets/:id/rules/:rule', async () => {
		await rulesetsDeleteRule(ctx, {
			zone_id: 'z1',
			ruleset_id: 'rs1',
			rule_id: 'rl1',
		});
		expect(request).toHaveBeenCalledWith(
			'/zones/z1/rulesets/rs1/rules/rl1',
			'token',
			{ method: 'DELETE' },
		);
	});

	it('rulesets.getEntrypointVersion GET phase entrypoint version', async () => {
		await rulesetsGetEntrypointVersion(ctx, {
			zone_id: 'z1',
			ruleset_phase: 'http_request_firewall_custom',
			ruleset_version: '2',
		});
		expect(request).toHaveBeenCalledWith(
			'/zones/z1/rulesets/phases/http_request_firewall_custom/entrypoint/versions/2',
			'token',
			{ method: 'GET' },
		);
	});

	it('cache.getRegionalTieredCache GET /zones/:id/cache/regional_tiered_cache', async () => {
		await cacheGetRegionalTieredCache(ctx, { zone_id: 'z1' });
		expect(request).toHaveBeenCalledWith(
			'/zones/z1/cache/regional_tiered_cache',
			'token',
			{ method: 'GET' },
		);
	});

	it('ips.get GET /ips', async () => {
		request.mockResolvedValue({ ipv4_cidrs: [], ipv6_cidrs: [] });
		await ipsGet(ctx, { networks: 'jdcloud' });
		expect(request).toHaveBeenCalledWith('/ips', 'token', {
			method: 'GET',
			query: { networks: 'jdcloud' },
		});
	});

	it('s3.upload PUT /accounts/:id/r2/buckets/:bucket/objects/:key', async () => {
		await s3Upload(ctx, {
			account_id: 'a1',
			bucket_name: 'bucket',
			object_key: 'file.txt',
			content: 'hello',
			content_type: 'text/plain',
		});
		expect(request).toHaveBeenCalledWith(
			'/accounts/a1/r2/buckets/bucket/objects/file.txt',
			'token',
			{
				method: 'PUT',
				rawBody: 'hello',
				mediaType: 'text/plain',
			},
		);
	});

	it('s3.upload rejects object keys that escape the R2 object route', async () => {
		await expect(
			s3Upload(ctx, {
				account_id: 'a1',
				bucket_name: 'bucket',
				object_key: '../../../../../zones/z1/activation_check',
				content: 'hello',
			}),
		).rejects.toThrow('Invalid R2 object key');
		expect(request).not.toHaveBeenCalled();
	});
});
