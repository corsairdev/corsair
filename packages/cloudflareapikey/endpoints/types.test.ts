import {
	CloudflareApiKeyEndpointInputSchemas,
	CloudflareApiKeyEndpointOutputSchemas,
} from './types';

describe('Cloudflare API-key endpoint contracts', () => {
	it('requires zone_id for zone detail ops', () => {
		expect(
			CloudflareApiKeyEndpointInputSchemas.zonesGet.safeParse({}).success,
		).toBe(false);
		expect(
			CloudflareApiKeyEndpointInputSchemas.zonesGet.safeParse({
				zone_id: 'z1',
			}).success,
		).toBe(true);
	});

	it('rejects zone updates that send more than one mutable field', () => {
		expect(
			CloudflareApiKeyEndpointInputSchemas.zonesUpdate.safeParse({
				zone_id: 'z1',
				paused: true,
				type: 'full',
			}).success,
		).toBe(false);
		expect(
			CloudflareApiKeyEndpointInputSchemas.zonesUpdate.safeParse({
				zone_id: 'z1',
				paused: true,
			}).success,
		).toBe(true);
	});

	it('requires DNS create type, name, and content', () => {
		expect(
			CloudflareApiKeyEndpointInputSchemas.dnsCreate.safeParse({
				zone_id: 'z1',
			}).success,
		).toBe(false);
		expect(
			CloudflareApiKeyEndpointInputSchemas.dnsCreate.safeParse({
				zone_id: 'z1',
				type: 'A',
				name: 'example.com',
				content: '192.0.2.1',
			}).success,
		).toBe(true);
	});

	it('requires overwrite DNS record identifiers and replacement fields', () => {
		expect(
			CloudflareApiKeyEndpointInputSchemas.dnsOverwrite.safeParse({
				zone_id: 'z1',
				dns_record_id: 'r1',
			}).success,
		).toBe(false);
	});

	it('requires exactly one ruleset scope', () => {
		expect(
			CloudflareApiKeyEndpointInputSchemas.rulesetsGet.safeParse({
				ruleset_id: 'rs1',
			}).success,
		).toBe(false);
		expect(
			CloudflareApiKeyEndpointInputSchemas.rulesetsGet.safeParse({
				zone_id: 'z1',
				account_id: 'a1',
				ruleset_id: 'rs1',
			}).success,
		).toBe(false);
		expect(
			CloudflareApiKeyEndpointInputSchemas.rulesetsGet.safeParse({
				zone_id: 'z1',
				ruleset_id: 'rs1',
			}).success,
		).toBe(true);
	});

	it('requires lockdown urls and configurations', () => {
		expect(
			CloudflareApiKeyEndpointInputSchemas.lockdownsCreate.safeParse({
				zone_id: 'z1',
				urls: [],
				configurations: [],
			}).success,
		).toBe(false);
	});

	it('requires account, bucket, object key, and content for S3 upload', () => {
		expect(
			CloudflareApiKeyEndpointInputSchemas.s3Upload.safeParse({
				account_id: 'a1',
				bucket_name: 'bucket',
			}).success,
		).toBe(false);
		expect(
			CloudflareApiKeyEndpointInputSchemas.s3Upload.safeParse({
				account_id: 'a1',
				bucket_name: 'bucket',
				object_key: 'file.txt',
				content: 'hello',
			}).success,
		).toBe(true);
	});

	it('requires exactly one ruleset rule position selector', () => {
		expect(
			CloudflareApiKeyEndpointInputSchemas.rulesetsCreateRule.safeParse({
				zone_id: 'z1',
				ruleset_id: 'rs1',
				action: 'block',
				expression: 'true',
				position: {},
			}).success,
		).toBe(false);
		expect(
			CloudflareApiKeyEndpointInputSchemas.rulesetsCreateRule.safeParse({
				zone_id: 'z1',
				ruleset_id: 'rs1',
				action: 'block',
				expression: 'true',
				position: { before: 'rule_1', after: 'rule_2' },
			}).success,
		).toBe(false);
		expect(
			CloudflareApiKeyEndpointInputSchemas.rulesetsCreateRule.safeParse({
				zone_id: 'z1',
				ruleset_id: 'rs1',
				action: 'block',
				expression: 'true',
				position: { index: 0 },
			}).success,
		).toBe(false);
		expect(
			CloudflareApiKeyEndpointInputSchemas.rulesetsCreateRule.safeParse({
				zone_id: 'z1',
				ruleset_id: 'rs1',
				action: 'block',
				expression: 'true',
				position: { index: 1 },
			}).success,
		).toBe(true);
	});

	it('treats dnssecDelete as a string result', () => {
		expect(
			CloudflareApiKeyEndpointOutputSchemas.dnssecDelete.safeParse('').success,
		).toBe(true);
		expect(
			CloudflareApiKeyEndpointOutputSchemas.dnssecDelete.safeParse({
				status: 'disabled',
			}).success,
		).toBe(false);
	});

	it('defines output schemas for every operation', () => {
		expect(Object.keys(CloudflareApiKeyEndpointOutputSchemas)).toHaveLength(25);
		expect(Object.keys(CloudflareApiKeyEndpointInputSchemas)).toHaveLength(25);
	});
});
