import { deployHQOperations } from './endpoints/openapi-operations';
import { runDeployHQOperation } from './endpoints/runtime';

// Trimmed responses from a live DeployHQ account (11-13), with personal values replaced.
// The OpenAPI examples omit these keys and nulls, so strict response schemas rejected them.

const mockedFetch = jest.spyOn(globalThis, 'fetch');
const credentials = {
	accountSubdomain: 'demo-account',
	username: 'agent@example.com',
	apiKey: 'deployhq-test-key',
};

beforeEach(() => {
	mockedFetch.mockReset();
});

afterAll(() => {
	mockedFetch.mockRestore();
});

const profile = {
	first_name: 'Test',
	last_name: 'User',
	email_address: 'agent@example.com',
	time_zone: null,
	id: 942411,
	identifier: 'f3c0a1d2-0000-4000-8000-000000000000',
	account_administrator: true,
	activated: true,
	can_manage_users: true,
	can_manage_billing: true,
	can_create_projects: true,
	can_manage_agents: true,
	all_projects_allowed: false,
	account: {
		name: 'Corsair Plugin Test',
		permalink: 'demo-account',
		time_zone: 'London',
		package: 'free',
		trialling: true,
		suspended: false,
		project_count: 0,
		project_limit: 10,
		users_allowed: true,
		ai_features_disabled: false,
		beta_features: false,
		static_hosting_eligible: false,
		managed_vps_eligible: false,
	},
};

const ipRanges = {
	shared: { ipv4: ['185.22.211.30'], ipv6: [] },
	zones: {
		uk: { name: 'UK Zone', ipv4: ['185.22.211.36'], ipv6: [] },
		eu_west: { name: 'EU West Zone', ipv4: ['203.0.113.10'], ipv6: [] },
		us_east: { name: 'US East Zone', ipv4: ['203.0.113.20'], ipv6: [] },
		us_west: { name: 'US West Zone', ipv4: ['203.0.113.30'], ipv6: [] },
	},
	network_agent: { ipv4: ['203.0.113.40'], ipv6: [] },
	all_ipv4: ['185.22.211.30'],
	all_ipv6: [],
	ports: [{ protocol: 'SSH', description: 'Port 22' }],
};

const languageVersions = {
	dotnet: ['8.0'],
	go: ['1.22'],
	java: ['21'],
	node: ['20', '22'],
	php: ['8.3'],
	python3: ['3.12'],
	ruby: ['3.3'],
	python2: ['2.7'],
};

const globalServer = {
	id: 1676055,
	identifier: '95127984-0000-4000-8000-000000000000',
	name: 'corsair-plugin-test',
	protocol_type: 'ssh',
	server_path: '',
	last_revision: null,
	preferred_branch: null,
	branch: null,
	notify_email: null,
	server_group_identifier: null,
	auto_deploy: false,
	environment: null,
	enabled: true,
	agent: null,
	atomic: null,
	atomic_strategy: 'copy_release',
	atomic_retention: 3,
	use_compression: false,
	use_accelerated_transfer: false,
	use_parallel_upload: false,
	root_path: null,
	position: 1,
	created_at: '2026-11-13T16:54:20Z',
	updated_at: '2026-11-13T16:54:20Z',
	connection_checked_at: null,
	connection_error_message: null,
	hostname: 'deploy.example.com',
	username: 'deploy',
	use_ssh_keys: true,
	port: 22,
	host_key: null,
};

function json(value: object): Response {
	return new Response(JSON.stringify(value), {
		status: 200,
		headers: { 'Content-Type': 'application/json' },
	});
}

describe('DeployHQ live response shapes', () => {
	it.each([
		['profile.getProfile', {}, profile],
		['ipRanges.listIpRanges', {}, ipRanges],
		['languageVersions.listLanguageVersions', {}, languageVersions],
		['globalServers.getGlobalServer', { id: 'srv' }, globalServer],
	] as const)('%s accepts the live response', async (key, input, body) => {
		mockedFetch.mockResolvedValueOnce(json(body));
		await expect(
			runDeployHQOperation(key, input, credentials),
		).resolves.toMatchObject(body);
	});

	it('treats the 204 from deleting a project environment variable as success', async () => {
		mockedFetch.mockResolvedValueOnce(new Response(null, { status: 204 }));
		await expect(
			runDeployHQOperation(
				'environmentVariables.deleteProjectEnvironmentVariable',
				{ project_id: 'demo', id: '6450' },
				credentials,
			),
		).resolves.toBeUndefined();
	});

	it('sends the documented per-protocol server connection fields', async () => {
		mockedFetch.mockResolvedValueOnce(json(globalServer));
		const server = {
			name: 'corsair-plugin-test',
			protocol_type: 'ssh',
			hostname: 'deploy.example.com',
			username: 'deploy',
			port: 22,
			use_ssh_keys: true,
		};
		await runDeployHQOperation(
			'servers.createProjectServer',
			{ project_id: 'demo', body: { server } },
			credentials,
		);
		const init = mockedFetch.mock.calls[0]?.[1];
		expect(JSON.parse(String(init?.body))).toEqual({ server });
		expect(
			deployHQOperations[
				'globalServers.createGlobalServer'
			].inputSchema.safeParse({ body: { server } }).success,
		).toBe(true);
	});
});
