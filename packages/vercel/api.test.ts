import 'dotenv/config';
import { getAliases } from './endpoints/aliases';
import { getDeployments } from './endpoints/deployments';
import { getDomains } from './endpoints/domains';
import { getEnvVariables } from './endpoints/envs';
import { getProjects } from './endpoints/projects';
import { getTeams } from './endpoints/teams';
import { VercelEndpointOutputSchemas } from './endpoints/types';
import { getWebhooks } from './endpoints/webhooks';
import type { VercelContext } from './index';

jest.mock('./client', () => ({
	makeAuthenticatedVercelRequest: jest.fn().mockImplementation((url) => {
		if (url.includes('projects'))
			return { projects: [], pagination: { count: 0, next: null, prev: null } };
		if (url.includes('deployments'))
			return {
				deployments: [],
				pagination: { count: 0, next: null, prev: null },
			};
		if (url.includes('domains'))
			return { domains: [], pagination: { count: 0, next: null, prev: null } };
		if (url.includes('env')) return { envs: [] };
		if (url.includes('aliases'))
			return { aliases: [], pagination: { count: 0, next: null, prev: null } };
		if (url.includes('webhooks')) return [];
		if (url.includes('teams'))
			return { teams: [], pagination: { count: 0, next: null, prev: null } };
		return {};
	}),
}));

const TEST_TOKEN = process.env.VERCEL_TOKEN || 'test-token';
const TEST_TEAM_ID = process.env.VERCEL_TEAM_ID;

const mockCtx = {
	key: TEST_TOKEN,
	$getAccountId: () => 'test-account-id',
	options: { teamId: TEST_TEAM_ID },
	logEvent: jest.fn(),
	db: {},
} as unknown as VercelContext;

describe('Vercel API Type Tests', () => {
	let testProjectId: string;

	beforeAll(() => {
		testProjectId = 'prj_dummy_test_id';
	});

	it('projectsGetProjects returns correct type', async () => {
		const response = await getProjects(mockCtx, {});
		VercelEndpointOutputSchemas.projectsGetProjects.parse(response);
	});

	it('deploymentsGetDeployments returns correct type', async () => {
		const response = await getDeployments(mockCtx, {});
		VercelEndpointOutputSchemas.deploymentsGetDeployments.parse(response);
	});

	it('domainsGetDomains returns correct type', async () => {
		const response = await getDomains(mockCtx, {});
		VercelEndpointOutputSchemas.domainsGetDomains.parse(response);
	});

	it('envsGetEnvVariables returns correct type', async () => {
		const response = await getEnvVariables(mockCtx, {
			idOrName: testProjectId,
		});
		VercelEndpointOutputSchemas.envsGetEnvVariables.parse(response);
	});

	it('aliasesGetAliases returns correct type', async () => {
		const response = await getAliases(mockCtx, {});
		VercelEndpointOutputSchemas.aliasesGetAliases.parse(response);
	});

	it('webhooksGetWebhooks returns correct type', async () => {
		const response = await getWebhooks(mockCtx, {});
		VercelEndpointOutputSchemas.webhooksGetWebhooks.parse(response);
	});

	it('teamsGetTeams returns correct type', async () => {
		const response = await getTeams(mockCtx, {});
		VercelEndpointOutputSchemas.teamsGetTeams.parse(response);
	});
});
