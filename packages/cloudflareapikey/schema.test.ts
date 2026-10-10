import { CloudflareApiKeySchema } from './schema';

describe('CloudflareApiKey schema', () => {
	it('declares a semver version', () => {
		expect(CloudflareApiKeySchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares labeled entities from the Cloudflare API', () => {
		expect(Object.keys(CloudflareApiKeySchema.entities).sort()).toEqual([
			'dnsRecords',
			'dnssec',
			'lockdowns',
			'r2Objects',
			'rulesets',
			'zones',
		]);
	});
});
