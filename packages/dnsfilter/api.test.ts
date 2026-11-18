import { dnsfilter } from './index';

// Live checks against the real API. They run only when a key is provided:
// DNSFILTER_API_KEY=<key> npx jest api.test.ts
// Every operation here is a GET that the default organization of any account
// (an empty trial included) can answer. Each call goes through the plugin's
// endpoint function, so a response that stops matching its output schema
// fails the test. Ids for detail reads come from the list responses.
const LIVE_KEY = process.env.DNSFILTER_API_KEY ?? '';
const describeLive = LIVE_KEY.length > 0 ? describe : describe.skip;

jest.setTimeout(30_000);

// Inputs and outputs differ per operation and the suite drives them by name,
// so both stay `unknown` here.
type Operation = (ctx: unknown, input: unknown) => Promise<unknown>;

// Safe: the plugin's nested endpoint map is exactly group -> name -> handler.
const operations = dnsfilter().endpoints as unknown as Record<
	string,
	Record<string, Operation>
>;

// Only the context fields the endpoints touch; local sync goes nowhere.
const noopTable = {
	findByEntityId: async () => null,
	upsertByEntityId: async () => undefined,
	deleteByEntityId: async () => true,
};
const ctx = {
	key: LIVE_KEY,
	$getAccountId: async () => 'live',
	database: undefined,
	db: new Proxy({}, { get: () => noopTable }),
};

// Stay under two requests a second.
let lastCallAt = 0;
async function call(path: string, input: unknown = {}): Promise<unknown> {
	const wait = lastCallAt + 550 - Date.now();
	if (wait > 0) await new Promise((resolve) => setTimeout(resolve, wait));
	lastCallAt = Date.now();
	const [group, name] = path.split('.') as [string, string];
	const operation = operations[group]?.[name];
	if (!operation) throw new Error(`unknown operation ${path}`);
	return operation(ctx, input);
}

// List responses are JSON:API pages (or `{ data }` for v2); read the first id.
function firstId(response: unknown): number {
	const data = (response as { data?: unknown } | undefined)?.data;
	const row = Array.isArray(data) ? data[0] : undefined;
	const id = Number((row as { id?: unknown } | undefined)?.id);
	if (!Number.isInteger(id) || id <= 0) {
		throw new Error('expected the list to return at least one row');
	}
	return id;
}

const NO_ARGUMENT_READS = [
	'agentLocalUsers.list',
	'agentLocalUsers.listAll',
	'agentLocalUsersV2.counts',
	'apiKeys.list',
	'applicationCategories.list',
	'applications.list',
	'applications.listAll',
	'blockPages.list',
	'blockPages.listAll',
	'categories.list',
	'categories.listAll',
	'currentUserUiSettings.get',
	'currentUsers.get',
	'dashboards.available',
	'dashboards.list',
	'dashboards.owned',
	'dictionary.qpMethods',
	'dictionaryV2.aiApplications',
	'dictionaryV2.cyberSightActivityTypes',
	'dictionaryV2.vpnSettingsStateTypes',
	'domains.bulkLookup',
	'ipAddresses.list',
	'ipAddresses.listAll',
	'ipAddresses.myip',
	'macAddresses.list',
	'macAddresses.listAll',
	'networkSubnets.listAll',
	'networks.geo',
	'networks.list',
	'networks.listAll',
	'organizations.list',
	'organizations.listAll',
	'organizations.settings',
	'policies.list',
	'policies.listAll',
	'policyIps.list',
	'scheduledPolicies.list',
	'scheduledPolicies.listAll',
	'scheduledReportsV2.list',
	'trafficReports.qps',
	'trafficReports.queryLogs',
	'trafficReports.topAgents',
	'trafficReports.topApplicationCategories',
	'trafficReports.topCategories',
	'trafficReports.topCollections',
	'trafficReports.topDomains',
	'trafficReports.topNetworks',
	'trafficReports.topOrganizationsRequests',
	'trafficReports.topUsers',
	'trafficReports.totalApplicationsAgentsStats',
	'trafficReports.totalApplicationsCollectionsStats',
	'trafficReports.totalApplicationsNetworksStats',
	'trafficReports.totalApplicationsStats',
	'trafficReports.totalApplicationsUsersStats',
	'trafficReports.totalCategories',
	'trafficReports.totalCategoriesOrganizations',
	'trafficReports.totalCategoryStats',
	'trafficReports.totalDeployments',
	'trafficReports.totalDomainStats',
	'trafficReports.totalDomains',
	'trafficReports.totalDomainsOrganizations',
	'trafficReports.totalDomainsUsers',
	'trafficReports.totalOrganizationsRequests',
	'trafficReports.totalOrganizationsStats',
	'trafficReports.totalRequests',
	'trafficReports.totalRequestsAgents',
	'trafficReports.totalRequestsCollections',
	'trafficReports.totalRequestsOrganizations',
	'trafficReports.totalRequestsUsers',
	'trafficReports.totalRoamingClients',
	'trafficReports.totalThreats',
	'trafficReports.totalThreatsOrganizations',
	'trafficReports.totalThreatsUsers',
	'unblockRequests.counts',
	'unblockRequests.list',
	'unblockRequests.pendingCount',
	'userAgentBulkDeletes.counts',
	'userAgentBulkUpdates.counts',
	'userAgentReleases.list',
	'userAgentReleases.relay',
	'userAgents.counts',
	'userAgents.list',
	'userAgents.listAll',
	'userAgents.tags',
	'users.list',
	'users.listAll',
];

describeLive('DNSFilter live API: reads without arguments', () => {
	it.each(NO_ARGUMENT_READS)('%s', async (path) => {
		await expect(call(path)).resolves.toBeDefined();
	});

	it('keeps the release versions the OpenAPI document omits', async () => {
		const result = (await call('userAgentReleases.list')) as {
			user_agent_releases?: { version?: unknown }[];
		};
		const releases = result.user_agent_releases ?? [];

		expect(releases.length).toBeGreaterThan(0);
		expect(releases.every((r) => typeof r.version === 'string')).toBe(true);
	});

	it('keeps the pagination links of a list page', async () => {
		const result = (await call('networks.list')) as {
			links?: { self?: unknown; first?: unknown; last?: unknown };
		};

		expect(typeof result.links?.first).toBe('string');
		expect(typeof result.links?.last).toBe('string');
	});
});

describeLive('DNSFilter live API: reads that need ids or arguments', () => {
	const ids = {
		organization: 0,
		user: 0,
		policy: 0,
		network: 0,
		apiKey: 0,
		category: 0,
		applicationCategory: 0,
		application: 0,
		policyIp: 0,
		scheduledReport: 0,
	};

	beforeAll(async () => {
		ids.organization = firstId(await call('organizations.list'));
		ids.user = firstId(await call('users.list'));
		ids.policy = firstId(await call('policies.list'));
		ids.network = firstId(await call('networks.list'));
		ids.apiKey = firstId(await call('apiKeys.list'));
		ids.category = firstId(await call('categories.list'));
		ids.applicationCategory = firstId(await call('applicationCategories.list'));
		ids.application = firstId(await call('applications.list'));
		ids.policyIp = firstId(await call('policyIps.list'));
		ids.scheduledReport = firstId(await call('scheduledReportsV2.list'));
	}, 60_000);

	// Some realtime reports reject windows longer than 20 minutes.
	const window = () => {
		const to = new Date();
		const from = new Date(to.getTime() - 15 * 60 * 1000);
		const iso = (d: Date) => `${d.toISOString().slice(0, 19)}Z`;
		return { from: iso(from), to: iso(to) };
	};
	const days = () => {
		const to = new Date();
		const from = new Date(to.getTime() - 30 * 24 * 60 * 60 * 1000);
		return {
			from: from.toISOString().slice(0, 10),
			to: to.toISOString().slice(0, 10),
		};
	};

	// Inputs are built lazily because the ids are only known after beforeAll.
	const cases: [string, () => unknown][] = [
		['organizations.get', () => ({ id: ids.organization })],
		['users.get', () => ({ id: ids.user })],
		['policies.get', () => ({ id: ids.policy })],
		['policies.getPermissiveMode', () => ({ id: ids.policy })],
		[
			'policies.application',
			() => ({
				application_id: ids.application,
				organization_id: ids.organization,
			}),
		],
		['networks.get', () => ({ id: ids.network })],
		['networks.msp', () => ({ organization_id: ids.organization })],
		['networks.mspAll', () => ({ organization_id: ids.organization })],
		['networkSubnets.list', () => ({ id: ids.network })],
		['networkLanIps.list', () => ({ id: ids.network })],
		['apiKeys.get', () => ({ id: ids.apiKey })],
		['categories.get', () => ({ id: ids.category })],
		['applicationCategories.get', () => ({ id: ids.applicationCategory })],
		['applications.get', () => ({ id: ids.application })],
		['policyIps.get', () => ({ id: ids.policyIp })],
		['scheduledReports.list', () => ({ organization_id: ids.organization })],
		['scheduledReports.get', () => ({ id: ids.scheduledReport })],
		['scheduledReportsV2.get', () => ({ id: ids.scheduledReport })],
		['organizationUsers.list', () => ({ organization_id: ids.organization })],
		[
			'organizationUsers.get',
			() => ({ organization_id: ids.organization, id: ids.user }),
		],
		['billings.get', () => ({ organization_id: ids.organization })],
		['billings.addressShow', () => ({ organization_id: ids.organization })],
		['invoices.list', () => ({ organization_id: ids.organization })],
		[
			'enterpriseConnections.list',
			() => ({ organization_id: ids.organization }),
		],
		['userAgents.uninstallPin', () => ({ organization_id: ids.organization })],
		['csvExports.userAgentsCsv', () => ({ organization_id: ids.organization })],
		['metrics.organizationUsage', () => ({ id: ids.organization, ...days() })],
		[
			'metrics.organizationUsageDetailed',
			() => ({ id: ids.organization, ...days() }),
		],
		[
			'domainNotes.get',
			() => ({ resource: 'policies', id: ids.policy, domain: 'example.com' }),
		],
		['domains.userLookup', () => ({ fqdn: 'example.com' })],
		[
			'ipAddresses.verify',
			() => ({
				ip_address: {
					address: '203.0.113.10',
					organization_id: ids.organization,
					network_id: ids.network,
				},
			}),
		],
		['trafficReports.totalRequestsGeo', () => ({ limit: 10 })],
		['trafficReports.qpsActiveOrganizations', window],
		['trafficReports.qpsActiveAgents', window],
		['trafficReports.totalClientStats', window],
	];

	it.each(cases)('%s', async (path, input) => {
		await expect(call(path, input())).resolves.toBeDefined();
	});
});
