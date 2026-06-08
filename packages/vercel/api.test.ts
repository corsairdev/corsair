import 'dotenv/config';
import { logEventFromContext } from 'corsair/core';
import { getAliases } from './endpoints/aliases';
import { getDeployments } from './endpoints/deployments';
import { getDomains, getProjectDomains } from './endpoints/domains';
import { createEnvVariable, getEnvVariables } from './endpoints/envs';
import { getProjects } from './endpoints/projects';
import { getTeams } from './endpoints/teams';
import { VercelEndpointOutputSchemas } from './endpoints/types';
import { getWebhooks } from './endpoints/webhooks';
import type { VercelContext } from './index';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn(),
}));

jest.mock('./client', () => ({
	makeAuthenticatedVercelRequest: jest.fn().mockImplementation((url) => {
		if (url.includes('projects') && url.includes('domains')) {
			return {
				domains: [
					{
						name: 'example.com',
						apexName: 'example.com',
						projectId: 'prj_123',
						redirect: null,
						redirectStatusCode: null,
						gitBranch: null,
						updatedAt: 1,
						createdAt: 1,
						verified: true,
					},
				],
				pagination: { count: 1, next: null, prev: null },
			};
		}
		if (url.includes('projects'))
			return { projects: [], pagination: { count: 0, next: null, prev: null } };
		if (url.includes('deployments'))
			return {
				deployments: [],
				pagination: { count: 0, next: null, prev: null },
			};
		if (url.includes('domains'))
			return {
				domains: [
					{
						id: 'dmn_unique_id',
						name: 'example.com',
						createdAt: 1,
						boughtAt: null,
						expiresAt: null,
						transferredAt: null,
						verified: true,
						nameservers: [],
						intendedNameservers: [],
					},
				],
				pagination: { count: 1, next: null, prev: null },
			};
		if (url.includes('/v10/projects') && url.includes('/env')) {
			return {
				id: 'env_123',
				key: 'API_KEY',
				value: 'secret-value',
				type: 'secret',
				target: ['production'],
				gitBranch: null,
				createdAt: 1,
				updatedAt: 1,
			};
		}
		if (url.includes('/env')) return { envs: [] };
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

describe('Vercel endpoint behavior', () => {
	const mockedLogEventFromContext = logEventFromContext as jest.MockedFunction<
		typeof logEventFromContext
	>;

	beforeEach(() => {
		mockedLogEventFromContext.mockClear();
	});

	it('createEnvVariable excludes value from the event log', async () => {
		await createEnvVariable(mockCtx, {
			idOrName: 'prj_dummy_test_id',
			key: 'API_KEY',
			value: 'super-secret-value',
			type: 'secret',
			target: ['production'],
		});

		expect(mockedLogEventFromContext).toHaveBeenCalledWith(
			mockCtx,
			'vercel.envs.createEnvVariable',
			expect.not.objectContaining({ value: 'super-secret-value' }),
			'completed',
		);
		expect(mockedLogEventFromContext.mock.calls[0]?.[2]).toMatchObject({
			idOrName: 'prj_dummy_test_id',
			key: 'API_KEY',
			type: 'secret',
			target: ['production'],
		});
	});

	it('getDomains and getProjectDomains upsert domains by name', async () => {
		const upsertedEntityIds: string[] = [];
		const ctxWithDb = {
			...mockCtx,
			db: {
				domains: {
					upsertByEntityId: jest.fn(
						async (entityId: string, data: Record<string, unknown>) => {
							upsertedEntityIds.push(entityId);
							return data;
						},
					),
				},
			},
		} as unknown as VercelContext;

		await getDomains(ctxWithDb, {});
		await getProjectDomains(ctxWithDb, { idOrName: 'prj_123' });

		expect(upsertedEntityIds).toEqual(['example.com', 'example.com']);
	});
});
