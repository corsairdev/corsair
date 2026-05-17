import 'dotenv/config';
import { makeCloudflareRequest } from './client';
import type {
	DnsGetResponse,
	DnsListResponse,
	RulesetsGetResponse,
	RulesetsListResponse,
	WorkerRoutesGetResponse,
	WorkerRoutesListResponse,
	WorkersGetResponse,
	WorkersListResponse,
	ZonesGetResponse,
	ZonesListResponse,
} from './endpoints/types';
import { CloudflareEndpointOutputSchemas } from './endpoints/types';

const TEST_API_TOKEN = process.env.CLOUDFLARE_API_TOKEN;
const ZONE_ID_OVERRIDE = process.env.CLOUDFLARE_ZONE_ID;
const ACCOUNT_ID_OVERRIDE = process.env.CLOUDFLARE_ACCOUNT_ID;
const SCRIPT_NAME_OVERRIDE = process.env.CLOUDFLARE_SCRIPT_NAME;

function requireToken(): string {
	if (!TEST_API_TOKEN?.trim()) {
		throw new Error(
			'Set CLOUDFLARE_API_TOKEN in packages/cloudflare/.env (see .env.example)',
		);
	}
	return TEST_API_TOKEN;
}

function accountIdFromZone(
	zone: ZonesListResponse[number],
): string | undefined {
	const account = zone.account;
	if (account && typeof account === 'object' && 'id' in account) {
		return String(account.id);
	}
	return undefined;
}

/** When the account has no zones, resolve account id via Account Settings Read. */
async function resolveAccountId(token: string): Promise<string | undefined> {
	const accounts = await makeCloudflareRequest<Array<{ id: string }>>(
		'/accounts',
		token,
		{
			method: 'GET',
			query: { per_page: 1 },
		},
	);
	return accounts[0]?.id;
}

describe('Cloudflare API Type Tests', () => {
	let zoneId: string | undefined = ZONE_ID_OVERRIDE;
	let accountId: string | undefined = ACCOUNT_ID_OVERRIDE;

	describe('zones', () => {
		it('zonesList returns correct type', async () => {
			const token = requireToken();
			const result = await makeCloudflareRequest<ZonesListResponse>(
				'/zones',
				token,
				{
					method: 'GET',
					query: { per_page: 5 },
				},
			);

			if (result.length > 0) {
				zoneId ??= result[0]?.id;
				accountId ??= result[0] ? accountIdFromZone(result[0]) : undefined;
			} else {
				accountId ??= await resolveAccountId(token);
			}

			CloudflareEndpointOutputSchemas.zonesList.parse(result);
		});

		it('zonesGet returns correct type', async () => {
			const token = requireToken();
			if (!zoneId) {
				const list = await makeCloudflareRequest<ZonesListResponse>(
					'/zones',
					token,
					{
						method: 'GET',
						query: { per_page: 1 },
					},
				);
				zoneId = list[0]?.id;
			}
			if (!zoneId) {
				console.warn('No zones on account — skipping zonesGet');
				return;
			}

			const result = await makeCloudflareRequest<ZonesGetResponse>(
				`/zones/${zoneId}`,
				token,
				{ method: 'GET' },
			);

			accountId ??= accountIdFromZone(result);
			CloudflareEndpointOutputSchemas.zonesGet.parse(result);
		});
	});

	describe('dns', () => {
		it('dnsList returns correct type', async () => {
			const token = requireToken();
			if (!zoneId) {
				console.warn('No zone_id — skipping dnsList');
				return;
			}

			const result = await makeCloudflareRequest<DnsListResponse>(
				`/zones/${zoneId}/dns_records`,
				token,
				{ method: 'GET', query: { per_page: 5 } },
			);

			CloudflareEndpointOutputSchemas.dnsList.parse(result);
		});

		it('dnsGet returns correct type', async () => {
			const token = requireToken();
			if (!zoneId) {
				console.warn('No zone_id — skipping dnsGet');
				return;
			}

			const list = await makeCloudflareRequest<DnsListResponse>(
				`/zones/${zoneId}/dns_records`,
				token,
				{ method: 'GET', query: { per_page: 1 } },
			);
			const recordId = list[0]?.id;
			if (!recordId) {
				console.warn('No DNS records in zone — skipping dnsGet');
				return;
			}

			const result = await makeCloudflareRequest<DnsGetResponse>(
				`/zones/${zoneId}/dns_records/${recordId}`,
				token,
				{ method: 'GET' },
			);

			CloudflareEndpointOutputSchemas.dnsGet.parse(result);
		});
	});

	describe('workers.scripts', () => {
		it('workersList returns correct type', async () => {
			const token = requireToken();
			if (!accountId) {
				console.warn('No account_id — skipping workersList');
				return;
			}

			const result = await makeCloudflareRequest<WorkersListResponse>(
				`/accounts/${accountId}/workers/scripts`,
				token,
				{ method: 'GET' },
			);

			CloudflareEndpointOutputSchemas.workersList.parse(result);
		});

		it('workersGet returns script source as string', async () => {
			const token = requireToken();
			if (!accountId) {
				console.warn('No account_id — skipping workersGet');
				return;
			}

			const list = await makeCloudflareRequest<WorkersListResponse>(
				`/accounts/${accountId}/workers/scripts`,
				token,
				{ method: 'GET' },
			);
			const scriptName = SCRIPT_NAME_OVERRIDE ?? list[0]?.id;
			if (!scriptName) {
				console.warn(
					'No Workers scripts — set CLOUDFLARE_SCRIPT_NAME or upload a script to test workersGet',
				);
				return;
			}

			const result = await makeCloudflareRequest<WorkersGetResponse>(
				`/accounts/${accountId}/workers/scripts/${scriptName}`,
				token,
				{ method: 'GET' },
			);

			expect(typeof result).toBe('string');
			CloudflareEndpointOutputSchemas.workersGet.parse(result);
		});
	});

	describe('workers.routes', () => {
		it('workerRoutesList returns correct type', async () => {
			const token = requireToken();
			if (!zoneId) {
				console.warn('No zone_id — skipping workerRoutesList');
				return;
			}

			const result = await makeCloudflareRequest<WorkerRoutesListResponse>(
				`/zones/${zoneId}/workers/routes`,
				token,
				{ method: 'GET' },
			);

			CloudflareEndpointOutputSchemas.workerRoutesList.parse(result);
		});

		it('workerRoutesGet returns correct type', async () => {
			const token = requireToken();
			if (!zoneId) {
				console.warn('No zone_id — skipping workerRoutesGet');
				return;
			}

			const list = await makeCloudflareRequest<WorkerRoutesListResponse>(
				`/zones/${zoneId}/workers/routes`,
				token,
				{ method: 'GET' },
			);
			const routeId = list[0]?.id;
			if (!routeId) {
				console.warn('No Workers routes — skipping workerRoutesGet');
				return;
			}

			const result = await makeCloudflareRequest<WorkerRoutesGetResponse>(
				`/zones/${zoneId}/workers/routes/${routeId}`,
				token,
				{ method: 'GET' },
			);

			CloudflareEndpointOutputSchemas.workerRoutesGet.parse(result);
		});
	});

	describe('rulesets', () => {
		it('rulesetsList returns correct type', async () => {
			const token = requireToken();
			if (!zoneId) {
				console.warn('No zone_id — skipping rulesetsList');
				return;
			}

			const result = await makeCloudflareRequest<RulesetsListResponse>(
				`/zones/${zoneId}/rulesets`,
				token,
				{ method: 'GET' },
			);

			CloudflareEndpointOutputSchemas.rulesetsList.parse(result);
		});

		it('rulesetsGet returns correct type', async () => {
			const token = requireToken();
			if (!zoneId) {
				console.warn('No zone_id — skipping rulesetsGet');
				return;
			}

			const list = await makeCloudflareRequest<RulesetsListResponse>(
				`/zones/${zoneId}/rulesets`,
				token,
				{ method: 'GET' },
			);
			const rulesetId = list[0]?.id;
			if (!rulesetId) {
				console.warn('No rulesets in zone — skipping rulesetsGet');
				return;
			}

			const result = await makeCloudflareRequest<RulesetsGetResponse>(
				`/zones/${zoneId}/rulesets/${rulesetId}`,
				token,
				{ method: 'GET' },
			);

			CloudflareEndpointOutputSchemas.rulesetsGet.parse(result);
		});
	});
});
