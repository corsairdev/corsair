import { makeAbuseIPDBRequest } from './client';
import type {
	CheckBlockResponse,
	CheckIpResponse,
	ClearAddressResponse,
	GetReportsResponse,
	ReportIpResponse,
} from './endpoints/types';
import { AbuseIPDBEndpointOutputSchemas } from './endpoints/types';

// Live API tests — skipped unless ABUSEIPDB_API_KEY is set in the
// environment (see the root .env.example). They hit the real AbuseIPDB API
// and prove the endpoint output schemas accept the shapes the provider
// actually returns.
const ABUSEIPDB_API_KEY = process.env.ABUSEIPDB_API_KEY;

// The write tests (report, clear-address) mutate a real AbuseIPDB account —
// `clear-address` deletes every report filed against the test IP — so they
// additionally require ABUSEIPDB_WRITE_ENABLED=true. Read-only tests only
// need the API key.
const ABUSEIPDB_WRITE_ENABLED = process.env.ABUSEIPDB_WRITE_ENABLED === 'true';

// A public, stable IP frequently reported to AbuseIPDB (a Tencent Cloud
// datacenter address) used as the shared fixture across tests.
const TEST_IP = '118.25.6.39';

const describeOrSkip = ABUSEIPDB_API_KEY ? describe : describe.skip;

describeOrSkip('AbuseIPDB API Type Tests', () => {
	it('check returns correct type', async () => {
		const response = await makeAbuseIPDBRequest<{ data: CheckIpResponse }>(
			'check',
			ABUSEIPDB_API_KEY!,
			{ query: { ipAddress: TEST_IP } },
		);

		const parsed = AbuseIPDBEndpointOutputSchemas.checkIp.parse(response.data);
		expect(parsed.ipAddress).toBe(TEST_IP);
		expect(typeof parsed.abuseConfidenceScore).toBe('number');
	});

	it('check returns correct type with verbose reports', async () => {
		const response = await makeAbuseIPDBRequest<{ data: CheckIpResponse }>(
			'check',
			ABUSEIPDB_API_KEY!,
			{ query: { ipAddress: TEST_IP, verbose: '' } },
		);

		const parsed = AbuseIPDBEndpointOutputSchemas.checkIp.parse(response.data);
		expect(parsed.ipAddress).toBe(TEST_IP);
		expect(Array.isArray(parsed.reports)).toBe(true);
	});

	it('reports returns correct pagination shape', async () => {
		const response = await makeAbuseIPDBRequest<{
			data: GetReportsResponse;
		}>('reports', ABUSEIPDB_API_KEY!, {
			query: { ipAddress: TEST_IP },
		});

		const parsed = AbuseIPDBEndpointOutputSchemas.getReports.parse(
			response.data,
		);
		expect(Array.isArray(parsed.results)).toBe(true);
	});

	it('blacklist returns correct type', async () => {
		const response = await makeAbuseIPDBRequest<{
			meta: { generatedAt: string };
			data: Array<{
				ipAddress: string;
				abuseConfidenceScore: number;
				lastReportedAt?: string | null;
				countryCode?: string | null;
			}>;
		}>('blacklist', ABUSEIPDB_API_KEY!, {
			query: { confidenceMinimum: 90, limit: 5 },
		});

		const parsed = AbuseIPDBEndpointOutputSchemas.getBlacklist.parse({
			generatedAt: response.meta.generatedAt,
			entries: response.data,
		});
		expect(parsed.entries.length).toBeGreaterThan(0);
	});

	it('check-block returns correct type', async () => {
		const response = await makeAbuseIPDBRequest<{ data: CheckBlockResponse }>(
			'check-block',
			ABUSEIPDB_API_KEY!,
			{ query: { network: `${TEST_IP}/24` } },
		);

		const parsed = AbuseIPDBEndpointOutputSchemas.checkBlock.parse(
			response.data,
		);
		expect(parsed.networkAddress).toBeTruthy();
		expect(Array.isArray(parsed.reportedAddress)).toBe(true);
	});
});

// Write operations mutate a real AbuseIPDB account (clear-address deletes
// every report filed against the IP), so they only run when explicitly
// opted in via ABUSEIPDB_WRITE_ENABLED=true.
const describeWriteOrSkip =
	ABUSEIPDB_API_KEY && ABUSEIPDB_WRITE_ENABLED ? describe : describe.skip;

describeWriteOrSkip('AbuseIPDB API write tests', () => {
	it('report accepts a report for a well-known test IP', async () => {
		const response = await makeAbuseIPDBRequest<{ data: ReportIpResponse }>(
			'report',
			ABUSEIPDB_API_KEY!,
			{
				method: 'POST',
				formBody: {
					ip: TEST_IP,
					categories: '18,21',
					comment: 'Automated test report from the Corsair plugin test suite',
				},
			},
		);

		const parsed = AbuseIPDBEndpointOutputSchemas.reportIp.parse(response.data);
		expect(parsed.ipAddress).toBe(TEST_IP);
	});

	it('clear-address deletes all reports for the IP and returns the count', async () => {
		const response = await makeAbuseIPDBRequest<{
			data: ClearAddressResponse;
		}>('clear-address', ABUSEIPDB_API_KEY!, {
			method: 'DELETE',
			query: { ipAddress: TEST_IP },
		});

		const parsed = AbuseIPDBEndpointOutputSchemas.clearAddress.parse(
			response.data,
		);
		expect(typeof parsed.numReportsDeleted).toBe('number');
	});
});
