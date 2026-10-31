import {
	DnsfilterEndpointInputSchemas,
	DnsfilterEndpointOutputSchemas,
} from './endpoints/types';
import { DnsfilterSchema } from './schema';

describe('Dnsfilter schema', () => {
	it('declares a semver version', () => {
		expect(DnsfilterSchema.version).toBeDefined();
		expect(DnsfilterSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof DnsfilterSchema.entities).toBe('object');
		expect(DnsfilterSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(DnsfilterSchema.entities))).toBe(true);
		for (const entity of Object.values(DnsfilterSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

describe('Dnsfilter endpoint schemas', () => {
	it('requires an organization for the user agents CSV download', () => {
		const schema = DnsfilterEndpointInputSchemas.csvExportsUserAgentsCsv;

		expect(schema.safeParse({ organization_id: 7 }).success).toBe(true);
		expect(
			schema.safeParse({ organization_id: 7, include_suborgs: true }).success,
		).toBe(true);
		expect(schema.safeParse({}).success).toBe(false);
		expect(schema.safeParse({ organization_id: '7' }).success).toBe(false);
	});

	it('accepts raw CSV text as the download response', () => {
		const schema = DnsfilterEndpointOutputSchemas.csvExportsUserAgentsCsv;

		expect(schema.safeParse('hostname,status\nlaptop-1,active').success).toBe(
			true,
		);
		expect(schema.safeParse({ data: 'csv' }).success).toBe(false);
	});

	it('requires the CyberSight report window and a known report type', () => {
		const schema = DnsfilterEndpointInputSchemas.csvExportsCyberSightCreate;

		expect(
			schema.safeParse({
				report_type: 'top_websites',
				start_at: '2026-01-01T00:00:00Z',
				end_at: '2026-01-31T00:00:00Z',
			}).success,
		).toBe(true);
		expect(schema.safeParse({ report_type: 'top_websites' }).success).toBe(
			false,
		);
		expect(
			schema.safeParse({
				report_type: 'not_a_report',
				start_at: '2026-01-01T00:00:00Z',
				end_at: '2026-01-31T00:00:00Z',
			}).success,
		).toBe(false);
	});

	it('parses both CyberSight poll shapes', () => {
		const schema = DnsfilterEndpointOutputSchemas.csvExportsCyberSightGet;

		expect(
			schema.safeParse({
				data: { uuid: 'export-1', url: 'https://example.com/a.csv' },
			}).success,
		).toBe(true);
		expect(
			schema.safeParse({
				data: { export: { uuid: 'export-1', status: 'processing' } },
			}).success,
		).toBe(true);
	});

	it('parses both unblock request export shapes', () => {
		const schema = DnsfilterEndpointOutputSchemas.csvExportsUnblockRequestsGet;

		expect(
			schema.safeParse({
				export: {
					uuid: 'export-2',
					tab: 'active',
					row_count: 10,
					truncated: false,
				},
			}).success,
		).toBe(true);
		expect(
			schema.safeParse({ export: { uuid: 'export-2', status: 'processing' } })
				.success,
		).toBe(true);
	});

	it('keeps the create bodies optional where the API allows an empty body', () => {
		expect(
			DnsfilterEndpointInputSchemas.csvExportsUnblockRequestsCreate.safeParse(
				{},
			).success,
		).toBe(true);
		expect(
			DnsfilterEndpointInputSchemas.csvExportsUserAgentCreate.safeParse({})
				.success,
		).toBe(true);
	});
});
