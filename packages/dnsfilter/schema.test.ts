import { z } from 'zod';
import {
	DnsfilterEndpointInputSchemas,
	DnsfilterEndpointOutputSchemas,
} from './endpoints/types';
import { dnsfilterAuthConfig } from './index';
import { DnsfilterSchema } from './schema';

describe('Dnsfilter auth config', () => {
	it('needs only the API key to connect', () => {
		// Core treats every extra account field as required, so an unused one
		// would leave a connection "partial" until it is filled in.
		expect(dnsfilterAuthConfig.api_key.account).toEqual([]);
	});
});

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

// JSON Schema nodes are arbitrary nested JSON, so the walker takes `unknown`
// and narrows with typeof checks.
function isOpenString(node: unknown): boolean {
	if (typeof node !== 'object' || node === null || Array.isArray(node)) {
		return false;
	}
	// Safe: the guard above leaves a non-null, non-array object.
	const record = node as Record<string, unknown>;
	return (
		record.type === 'string' && !('enum' in record) && !('const' in record)
	);
}

// Collects paths of enum/const nodes that have no plain-string sibling branch,
// i.e. response values the API could not extend without failing the parse.
function strictEnumPaths(node: unknown, path: string, out: string[]): void {
	if (Array.isArray(node)) {
		node.forEach((entry, index) => {
			strictEnumPaths(entry, `${path}[${index}]`, out);
		});
		return;
	}
	if (typeof node !== 'object' || node === null) return;
	// Safe: the guards above leave a non-null, non-array object.
	const record = node as Record<string, unknown>;
	const anyOf = Array.isArray(record.anyOf) ? record.anyOf : [];
	const open = anyOf.some(isOpenString);
	if ('enum' in record || 'const' in record) out.push(path);
	for (const [key, value] of Object.entries(record)) {
		if (key !== 'anyOf' || !open) {
			strictEnumPaths(value, `${path}.${key}`, out);
			continue;
		}
		// An open enum: the enum branch is allowed beside the plain string.
		for (const branch of anyOf) {
			const isEnumBranch =
				typeof branch === 'object' && branch !== null && 'enum' in branch;
			if (!isEnumBranch) strictEnumPaths(branch, `${path}.anyOf`, out);
		}
	}
}

describe('Dnsfilter response enums', () => {
	it('never rejects a value the API adds to a response enum', () => {
		const strict: string[] = [];
		for (const [key, schema] of Object.entries(
			DnsfilterEndpointOutputSchemas,
		)) {
			strictEnumPaths(
				z.toJSONSchema(schema, { unrepresentable: 'any' }),
				key,
				strict,
			);
		}
		expect(strict).toEqual([]);
	});

	it('keeps unknown response values instead of failing the read', () => {
		const parsed =
			DnsfilterEndpointOutputSchemas.userAgentReleasesList.safeParse({
				user_agent_releases: [{ agent_type: 'linux', architecture: 'arm64' }],
			});

		expect(parsed.success).toBe(true);
		expect(parsed.data?.user_agent_releases?.[0]).toEqual({
			agent_type: 'linux',
			architecture: 'arm64',
		});
	});

	it('keeps request enums strict', () => {
		expect(
			DnsfilterEndpointInputSchemas.unblockRequestsDecision.safeParse({
				id: 'req-1',
				decision: 'maybe',
			}).success,
		).toBe(false);
		expect(
			DnsfilterEndpointInputSchemas.scheduledReportsCreate.safeParse({
				scheduled_report: { frequency: 'hourly' },
			}).success,
		).toBe(false);
	});
});
