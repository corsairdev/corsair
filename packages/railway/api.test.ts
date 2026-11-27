import { createCorsair } from 'corsair/core';
import { railway } from './index';

/**
 * Live run against a Railway account (the trial is enough):
 *
 *   RAILWAY_API_TOKEN=<account token> npx jest api.test.ts
 *
 * Skipped unless RAILWAY_API_TOKEN is set (CI never runs files named
 * api.test.ts). It reads the user, regions and templates, creates a
 * throwaway project with a shared variable and a second environment, and
 * deletes the project at the end. Nothing is deployed.
 */
const token = process.env.RAILWAY_API_TOKEN;
const describeIfLive = token ? describe : describe.skip;
if (!token) {
	console.warn(
		'Skipping Railway live run: set RAILWAY_API_TOKEN (an account token).',
	);
}

const STAMP = Date.now().toString(36);

describeIfLive('railway live', () => {
	const corsair = createCorsair({
		plugins: [railway({ key: token, permissions: { mode: 'open' } })],
	});
	const api = corsair.railway.api;
	let projectId = '';

	afterAll(async () => {
		if (projectId) await api.projects.delete({ id: projectId });
	});

	it('reads the user, regions and a template', async () => {
		const me = await api.me.get({});
		expect(me.id).toBeTruthy();
		expect((me.workspaces ?? []).length).toBeGreaterThan(0);
		const regions = await api.regions.list({});
		expect(regions.length).toBeGreaterThan(0);
		const template = await api.templates.get({ code: 'postgres' });
		expect(template.code).toBe('postgres');
	});

	it('creates a project, a variable and an environment, then cleans up', async () => {
		const me = await api.me.get({});
		const workspaceId = String(me.workspaces?.[0]?.id);
		const project = await api.projects.create({
			input: { name: `corsair-live-${STAMP}`, workspaceId },
		});
		projectId = String(project.id);
		const environments = await api.environments.list({ projectId });
		const environmentId = String(environments.items?.[0]?.id);
		expect(environments.items?.[0]?.name).toBe('production');

		await api.variables.upsert({
			input: { projectId, environmentId, name: 'CORSAIR', value: 'yes' },
		});
		const variables = await api.variables.list({ projectId, environmentId });
		expect(variables).toMatchObject({ CORSAIR: 'yes' });

		const staging = await api.environments.create({
			input: { projectId, name: 'staging' },
		});
		expect(staging.name).toBe('staging');
		await expect(
			api.environments.delete({ id: String(staging.id) }),
		).resolves.toBe(true);

		const page = await api.projects.list({ first: 10, workspaceId });
		expect((page.items ?? []).map((item) => item.id)).toContain(projectId);
	});
});
