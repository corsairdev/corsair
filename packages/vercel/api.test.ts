import 'dotenv/config';
import { createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { vercel } from './index';

// Live run against the real Vercel API. Needs a Vercel access token and a
// team to create throwaway resources in; everything it creates (a project,
// its deployments, env vars, domain, alias, webhook) is deleted at the end.
// CI skips files named api.test.ts.
const token = process.env.VERCEL_API_TOKEN;
const teamId = process.env.VERCEL_TEST_TEAM_ID;
const live = Boolean(token && teamId);
if (!live) {
	console.warn(
		'[vercel api.test] skipped: set VERCEL_API_TOKEN and VERCEL_TEST_TEAM_ID to run the live suite.',
	);
}
const describeLive = live ? describe : describe.skip;

jest.setTimeout(240_000);

async function setup() {
	const testDb = createTestDatabase();
	await createIntegrationAndAccount(testDb.db, 'vercel', 'default');
	const corsair = createCorsair({
		plugins: [vercel()],
		database: testDb.db,
		kek: 'test-kek-12345678901234567890123456789012',
	});
	await corsair.vercel.keys.issue_new_dek();
	await corsair.vercel.keys.set_api_key(token as string);
	// The team is saved on the connection, the way an OAuth install saves it.
	const keys = corsair.vercel.keys as unknown as {
		set_team_id: (value: string) => Promise<void>;
	};
	await keys.set_team_id(teamId as string);
	return { corsair, testDb };
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

describeLive('Vercel live', () => {
	let ctx: Awaited<ReturnType<typeof setup>>;
	let api: Awaited<ReturnType<typeof setup>>['corsair']['vercel']['api'];
	const name = `corsair-live-${Date.now().toString(36)}`;
	let projectId: string | undefined;
	let deploymentId: string | undefined;
	let previewId: string | undefined;
	let webhookId: string | undefined;

	beforeAll(async () => {
		ctx = await setup();
		api = ctx.corsair.vercel.api;
	});

	afterAll(async () => {
		// Clean up whatever exists, even when a step failed. Every attempt runs;
		// a resource that's already gone (404) is fine, any other failure fails
		// the run so nothing is left behind unnoticed.
		const failures: string[] = [];
		const attempt = async (label: string, run: () => Promise<unknown>) => {
			try {
				await run();
			} catch (error) {
				const status = (error as { status?: number }).status;
				if (status !== 404) failures.push(`${label}: ${status ?? error}`);
			}
		};
		if (webhookId) {
			const id = webhookId;
			await attempt('delete webhook', () => api.webhooks.deleteWebhook({ id }));
		}
		if (projectId) {
			const idOrName = projectId;
			await attempt('delete project', () =>
				api.projects.deleteProject({ idOrName }),
			);
		}
		ctx?.testDb.cleanup();
		if (failures.length > 0) {
			throw new Error(`Live cleanup failed: ${failures.join('; ')}`);
		}
	});

	// Deploying without a tracked project would let Vercel create one from
	// the name that the cleanup doesn't know about.
	function trackedProject(): string {
		if (!projectId)
			throw new Error('No test project: the project step failed.');
		return projectId;
	}

	it('reads the user and the connected team', async () => {
		const me = await api.user.getUser({});
		expect(me.user.id).toBeTruthy();

		const teams = await api.teams.getTeams({ limit: 20 });
		expect(teams.teams.some((team) => team.id === teamId)).toBe(true);

		const team = await api.teams.getTeam({});
		expect(team.id).toBe(teamId);

		const members = await api.teams.getTeamMembers({ limit: 5 });
		expect(members.members.length).toBeGreaterThan(0);
	});

	it('lists projects, domains, deployments, aliases, webhooks and Edge Configs', async () => {
		const projects = await api.projects.getProjects({ limit: 5 });
		expect(Array.isArray(projects.projects)).toBe(true);

		const domains = await api.domains.getDomains({ limit: 5 });
		expect(Array.isArray(domains.domains)).toBe(true);

		const deployments = await api.deployments.getDeployments({ limit: 5 });
		expect(Array.isArray(deployments.deployments)).toBe(true);

		const aliases = await api.aliases.getAliases({ limit: 5 });
		expect(Array.isArray(aliases.aliases)).toBe(true);

		await expect(api.webhooks.getWebhooks({})).resolves.toBeDefined();
		await expect(api.edgeConfig.getEdgeConfigs({})).resolves.toBeDefined();
	});

	it('creates, reads and updates a project', async () => {
		const created = await api.projects.createProject({ name, framework: null });
		projectId = created.id;
		expect(created.name).toBe(name);

		const read = await api.projects.getProject({ idOrName: name });
		expect(read.id).toBe(projectId);

		const updated = await api.projects.updateProject({
			idOrName: created.id,
			devCommand: 'echo corsair-live',
		});
		expect(updated.devCommand).toBe('echo corsair-live');

		const members = await api.projects.getProjectMembers({
			idOrName: created.id,
		});
		expect(members).toBeDefined();
	});

	it('creates, reads (decrypted), updates and deletes an env var', async () => {
		const idOrName = projectId as string;
		const created = await api.envs.createEnvVariable({
			idOrName,
			key: 'CORSAIR_LIVE_TEST',
			value: 'live-value-1',
			type: 'encrypted',
			target: ['preview', 'development'],
		});
		const createdEnv = Array.isArray(created.created)
			? created.created[0]
			: created.created;
		const envId = (createdEnv as { id?: string } | undefined)?.id;
		expect(envId).toBeTruthy();

		const list = await api.envs.getEnvVariables({ idOrName });
		expect(list.envs?.some((env) => env.key === 'CORSAIR_LIVE_TEST')).toBe(
			true,
		);

		const decrypted = await api.envs.getEnvVariable({
			idOrName,
			id: envId as string,
		});
		expect(decrypted.value).toBe('live-value-1');

		await api.envs.updateEnvVariable({
			idOrName,
			id: envId as string,
			value: 'live-value-2',
		});
		const reread = await api.envs.getEnvVariable({
			idOrName,
			id: envId as string,
		});
		expect(reread.value).toBe('live-value-2');

		const removed = await api.envs.deleteEnvVariable({
			idOrName,
			id: envId as string,
		});
		expect(removed.deleted).toBe(true);
		expect(JSON.stringify(removed)).not.toContain('live-value-2');
	});

	async function waitReady(id: string) {
		let state: string | null | undefined;
		for (let i = 0; i < 40; i++) {
			state = (await api.deployments.getDeployment({ idOrUrl: id })).readyState;
			if (state === 'READY' || state === 'ERROR' || state === 'CANCELED') break;
			await sleep(3000);
		}
		return state;
	}

	it('deploys inline files (the first deployment becomes production)', async () => {
		const created = await api.deployments.createDeployment({
			name,
			project: trackedProject(),
			files: [
				{ file: 'index.html', data: '<!doctype html><h1>corsair live 1</h1>' },
			],
			projectSettings: { framework: null },
		});
		deploymentId = created.id;
		expect(deploymentId).toMatch(/^dpl_/);
		expect(await waitReady(created.id)).toBe('READY');

		const files = await api.deployments.getDeploymentFiles({
			deploymentId: created.id,
		});
		expect(files.length).toBeGreaterThan(0);

		const list = await api.deployments.getDeployments({ projectId, limit: 5 });
		expect(list.deployments.some((d) => d.uid === created.id)).toBe(true);
	});

	it('builds a preview and reads its build logs', async () => {
		const created = await api.deployments.createDeployment({
			name,
			project: trackedProject(),
			files: [
				{ file: 'index.html', data: '<!doctype html><h1>corsair live 2</h1>' },
			],
			projectSettings: {
				framework: null,
				buildCommand: 'mkdir -p out && cp index.html out/',
				outputDirectory: 'out',
			},
		});
		previewId = created.id;
		expect(await waitReady(created.id)).toBe('READY');

		const events = await api.deployments.getDeploymentEvents({
			idOrUrl: created.id,
			limit: 100,
		});
		expect(events.length).toBeGreaterThan(0);
	});

	it('cancels a deployment while it builds', async () => {
		const created = await api.deployments.createDeployment({
			name,
			project: trackedProject(),
			files: [{ file: 'index.html', data: '<!doctype html><h1>slow</h1>' }],
			projectSettings: {
				framework: null,
				buildCommand: 'sleep 120 && mkdir -p out && cp index.html out/',
				outputDirectory: 'out',
			},
		});
		// Give it a moment to start, then stop it.
		await sleep(5000);
		const canceled = await api.deployments.cancelDeployment({
			deploymentId: created.id,
		});
		expect(canceled.readyState).toBe('CANCELED');
		expect(await waitReady(created.id)).toBe('CANCELED');
	});

	it('assigns, reads and deletes an alias', async () => {
		const alias = `${name}-alias.vercel.app`;
		const assigned = await api.aliases.assignAlias({
			deploymentId: previewId as string,
			alias,
		});
		expect(assigned.alias).toBe(alias);

		const forDeployment = await api.aliases.getDeploymentAliases({
			deploymentId: previewId as string,
		});
		expect(forDeployment.aliases.some((a) => a.alias === alias)).toBe(true);

		const read = await api.aliases.getAlias({ idOrAlias: alias });
		expect(read.alias).toBe(alias);

		const removed = await api.aliases.deleteAlias({
			aliasId: assigned.uid as string,
		});
		expect(removed).toBeDefined();
	});

	it('adds, verifies and removes a project domain', async () => {
		const idOrName = projectId as string;
		const domain = `${name}-domain.vercel.app`;
		const added = await api.domains.addProjectDomain({
			idOrName,
			name: domain,
		});
		expect(added.name).toBe(domain);

		const list = await api.domains.getProjectDomains({ idOrName });
		expect(list.domains.some((d) => d.name === domain)).toBe(true);

		const read = await api.domains.getProjectDomain({ idOrName, domain });
		expect(read.name).toBe(domain);

		const verified = await api.domains.verifyProjectDomain({
			idOrName,
			domain,
		});
		expect(verified.name).toBe(domain);

		await expect(
			api.domains.removeProjectDomain({ idOrName, domain }),
		).resolves.toBeDefined();
	});

	// Up to one readiness wait (120 s) and three production waits (80 s each).
	it('promotes an earlier production deployment, rolls back, then pauses and unpauses', async () => {
		const id = trackedProject();
		const first = deploymentId as string;
		// Promote and rollback run in the background; wait for the job to
		// finish and production to point at the deployment.
		const waitForProduction = async (want: string) => {
			for (let i = 0; i < 40; i++) {
				const project = await api.projects.getProject({
					idOrName: id,
					rollbackInfo: true,
				});
				const targets = project.targets as {
					production?: { id?: string };
				} | null;
				const job = project.lastAliasRequest?.jobStatus;
				const settled = !job || job === 'succeeded';
				if (settled && targets?.production?.id === want) return true;
				await sleep(2000);
			}
			return false;
		};

		// A second production deployment takes over; the first becomes an
		// earlier production deployment that can be promoted back.
		const second = await api.deployments.createDeployment({
			name,
			project: id,
			target: 'production',
			files: [
				{ file: 'index.html', data: '<!doctype html><h1>corsair live 3</h1>' },
			],
			projectSettings: { framework: null },
		});
		expect(await waitReady(second.id)).toBe('READY');
		expect(await waitForProduction(second.id)).toBe(true);

		await expect(
			api.projects.promoteDeployment({ projectId: id, deploymentId: first }),
		).resolves.toMatchObject({ requested: true });
		expect(await waitForProduction(first)).toBe(true);

		await expect(
			api.projects.rollbackDeployment({
				projectId: id,
				deploymentId: second.id,
				description: 'corsair live test',
			}),
		).resolves.toMatchObject({ requested: true });
		expect(await waitForProduction(second.id)).toBe(true);

		await expect(api.projects.pauseProject({ projectId: id })).resolves.toEqual(
			{
				projectId: id,
				paused: true,
			},
		);
		await expect(
			api.projects.unpauseProject({ projectId: id }),
		).resolves.toEqual({ projectId: id, paused: false });
	}, 480_000);

	it('creates, reads and deletes a webhook', async () => {
		const created = await api.webhooks.createWebhook({
			url: 'https://example.com/corsair-live-test',
			events: ['deployment.created'],
			projectIds: [projectId as string],
		});
		webhookId = created.id;
		expect(created.secret).toBeTruthy();

		const read = await api.webhooks.getWebhook({ id: created.id });
		expect(read.id).toBe(created.id);

		await expect(
			api.webhooks.deleteWebhook({ id: created.id }),
		).resolves.toMatchObject({ deleted: true });
		webhookId = undefined;
	});

	it('deletes the deployment and the project', async () => {
		await expect(
			api.deployments.deleteDeployment({ deploymentId: previewId as string }),
		).resolves.toBeDefined();
		await expect(
			api.projects.deleteProject({ idOrName: projectId as string }),
		).resolves.toEqual({ deleted: true, idOrName: projectId });
		projectId = undefined;
	});
});
