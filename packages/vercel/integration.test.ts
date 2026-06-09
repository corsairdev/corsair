import 'dotenv/config';
import { createCorsair } from 'corsair/core';
import { createCorsairOrm } from 'corsair/orm';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { vercel } from './index';

async function createVercelClient() {
	const accessToken = process.env.VERCEL_TOKEN;

	if (!accessToken) {
		return null;
	}

	const testDb = createTestDatabase();
	await createIntegrationAndAccount(testDb.db, 'vercel', 'default');

	const corsair = createCorsair({
		plugins: [
			vercel({
				authType: 'api_key',
				key: accessToken,
			}),
		],
		database: testDb.db,
		kek: process.env.CORSAIR_KEK || 'test-kek-12345678901234567890123456789012',
	});

	await corsair.vercel.keys.issue_new_dek();
	await corsair.vercel.keys.set_api_key(accessToken);

	return { corsair, testDb };
}

const hasToken = !!process.env.VERCEL_TOKEN;
const describeOrSkip = hasToken ? describe : describe.skip;

describeOrSkip('Vercel plugin integration', () => {
	it('projects endpoints interact with API and DB', async () => {
		const setup = await createVercelClient();
		const { corsair, testDb } = setup!;

		const getInput = {};
		const projects = await corsair.vercel.api.projects.getProjects(getInput);
		expect(projects).toBeDefined();

		const orm = createCorsairOrm(testDb.database);
		const events = await orm.events.findMany({
			where: { event_type: 'vercel.projects.getProjects' },
		});
		expect(events.length).toBeGreaterThan(0);

		const eventPayload =
			typeof events[events.length - 1]!.payload === 'string'
				? JSON.parse(events[events.length - 1]!.payload as unknown as string)
				: events[events.length - 1]!.payload;
		expect(eventPayload).toMatchObject(getInput);

		testDb.cleanup();
	});

	it('deployments endpoints interact with API and DB', async () => {
		const setup = await createVercelClient();
		const { corsair, testDb } = setup!;

		const getInput = {};
		const deployments =
			await corsair.vercel.api.deployments.getDeployments(getInput);
		expect(deployments).toBeDefined();

		const orm = createCorsairOrm(testDb.database);
		const events = await orm.events.findMany({
			where: { event_type: 'vercel.deployments.getDeployments' },
		});
		expect(events.length).toBeGreaterThan(0);

		testDb.cleanup();
	});

	it('domains endpoints interact with API and DB', async () => {
		const setup = await createVercelClient();
		const { corsair, testDb } = setup!;

		const getInput = {};
		const domains = await corsair.vercel.api.domains.getDomains(getInput);
		expect(domains).toBeDefined();

		const orm = createCorsairOrm(testDb.database);
		const events = await orm.events.findMany({
			where: { event_type: 'vercel.domains.getDomains' },
		});
		expect(events.length).toBeGreaterThan(0);

		testDb.cleanup();
	});

	it('envs endpoints interact with API and DB', async () => {
		const setup = await createVercelClient();
		const { corsair, testDb } = setup!;

		const projectsData = await corsair.vercel.api.projects.getProjects({});
		const validProjectId = projectsData.projects?.[0]?.id;

		if (!validProjectId) {
			console.warn(
				'Skipping envs test: No projects exist in this Vercel account.',
			);
			testDb.cleanup();
			return;
		}

		const getInput = { idOrName: validProjectId };
		const envs = await corsair.vercel.api.envs.getEnvVariables(getInput);
		expect(envs).toBeDefined();

		const orm = createCorsairOrm(testDb.database);
		const events = await orm.events.findMany({
			where: { event_type: 'vercel.envs.getEnvVariables' },
		});
		expect(events.length).toBeGreaterThan(0);

		testDb.cleanup();
	});

	it('aliases endpoints interact with API and DB', async () => {
		const setup = await createVercelClient();
		const { corsair, testDb } = setup!;

		const getInput = {};
		const aliases = await corsair.vercel.api.aliases.getAliases(getInput);
		expect(aliases).toBeDefined();

		const orm = createCorsairOrm(testDb.database);
		const events = await orm.events.findMany({
			where: { event_type: 'vercel.aliases.getAliases' },
		});
		expect(events.length).toBeGreaterThan(0);

		testDb.cleanup();
	});

	it('webhooks endpoints interact with API and DB', async () => {
		const setup = await createVercelClient();
		const { corsair, testDb } = setup!;

		const getInput = {};
		const webhooks = await corsair.vercel.api.webhooks.getWebhooks(getInput);
		expect(webhooks).toBeDefined();

		const orm = createCorsairOrm(testDb.database);
		const events = await orm.events.findMany({
			where: { event_type: 'vercel.webhooks.getWebhooks' },
		});
		expect(events.length).toBeGreaterThan(0);

		testDb.cleanup();
	});

	it('teams endpoints interact with API and DB', async () => {
		const setup = await createVercelClient();
		const { corsair, testDb } = setup!;

		const getInput = {};
		const teams = await corsair.vercel.api.teams.getTeams(getInput);
		expect(teams).toBeDefined();

		const orm = createCorsairOrm(testDb.database);
		const events = await orm.events.findMany({
			where: { event_type: 'vercel.teams.getTeams' },
		});
		expect(events.length).toBeGreaterThan(0);

		testDb.cleanup();
	});
});
