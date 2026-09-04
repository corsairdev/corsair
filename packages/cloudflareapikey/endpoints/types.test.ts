import {
	CloudflareApiKeyEndpointInputSchemas,
	CloudflareApiKeyEndpointOutputSchemas,
} from './types';

describe('Cloudflare API-key endpoint contracts', () => {
	it.each([
		['zonesGet', CloudflareApiKeyEndpointInputSchemas.zonesGet],
		['dnsGet', CloudflareApiKeyEndpointInputSchemas.dnsGet],
		['workersList', CloudflareApiKeyEndpointInputSchemas.workersList],
		['workerRoutesGet', CloudflareApiKeyEndpointInputSchemas.workerRoutesGet],
		['rulesetsGet', CloudflareApiKeyEndpointInputSchemas.rulesetsGet],
	])('requires identifiers for %s', (_name, schema) => {
		expect(schema.safeParse({}).success).toBe(false);
	});

	it('rejects wrong field types for Worker uploads', () => {
		const result = CloudflareApiKeyEndpointInputSchemas.workersUpload.safeParse({
			account_id: 'account-1',
			script_name: 'worker',
			script_content: 42,
		});
		expect(result.success).toBe(false);
	});

	it('accepts a valid DNS record input', () => {
		const result = CloudflareApiKeyEndpointInputSchemas.dnsCreate.safeParse({
			zone_id: 'zone-1',
			type: 'A',
			name: 'example.com',
			content: '192.0.2.1',
		});
		expect(result.success).toBe(true);
	});

	it('defines output schemas for all registered operations', () => {
		expect(Object.keys(CloudflareApiKeyEndpointOutputSchemas)).toHaveLength(24);
	});
});
