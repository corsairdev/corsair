import { createCorsair } from 'corsair/core';
import { RenderAPIError } from './client';
import { render } from './index';

// Live checks against the real Render API, skipped unless RENDER_API_KEY is
// set (CI skips *api.test.ts files). A free Hobby workspace is enough: the
// reads need no resources, and the write round-trip only creates env groups,
// a project and an environment, which are free and deleted before the test
// ends. Calls are paced to stay under two requests a second.
const apiKey = process.env.RENDER_API_KEY;
const describeLive = apiKey ? describe : describe.skip;

const api = createCorsair({ plugins: [render({ key: apiKey ?? 'unset' })] })
	.render.api;
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
const paced = async <T>(call: () => Promise<T>): Promise<T> => {
	await sleep(600);
	return call();
};

jest.setTimeout(180_000);

describeLive('Render live API', () => {
	let ownerId = '';

	beforeAll(async () => {
		const owners = await paced(() => api.owners.list({}));
		const first = owners[0]?.owner;
		ownerId =
			first && typeof first === 'object' && 'id' in first
				? String(first.id)
				: '';
		expect(ownerId).toMatch(/^(tea|usr)-/);
	});

	it('reads the user, workspace and notification settings', async () => {
		expect(await paced(() => api.user.get({}))).toEqual(
			expect.objectContaining({ id: expect.stringMatching(/^usr-/) }),
		);
		expect(await paced(() => api.owners.retrieve({ id: ownerId }))).toEqual(
			expect.objectContaining({
				id: ownerId,
				type: expect.stringMatching(/^(user|team)$/),
			}),
		);
		expect(
			Array.isArray(await paced(() => api.owners.members({ id: ownerId }))),
		).toBe(true);
		expect(
			await paced(() => api.notifications.retrieveOwnerSettings({ ownerId })),
		).toEqual(expect.objectContaining({ ownerId }));
	});

	it.each([
		['services.list', () => api.services.list({})],
		['projects.list', () => api.projects.list({})],
		['services.envGroups.list', () => api.services.envGroups.list({})],
		['postgres.list', () => api.postgres.list({})],
		['keyValue.list', () => api.keyValue.list({})],
		['registryCredentials.list', () => api.registryCredentials.list({})],
		['blueprints.list', () => api.blueprints.list({})],
		['buildSources.list', () => api.buildSources.list({})],
		['disks.list', () => api.disks.list({})],
		['maintenance.list', () => api.maintenance.list({})],
		['workflows.taskRuns.list', () => api.workflows.taskRuns.list({})],
		// These four answer null when empty; the plugin returns [].
		['workflows.tasks.list', () => api.workflows.tasks.list({})],
		['workflows.list', () => api.workflows.list({})],
		['workflows.versions.list', () => api.workflows.versions.list({})],
		['logs.resourceStreams', () => api.logs.resourceStreams({})],
		['webhooks.list', () => api.webhooks.list({})],
		['notifications.listOverrides', () => api.notifications.listOverrides({})],
	] as const)('%s returns a list', async (_name, call) => {
		expect(Array.isArray(await paced(call))).toBe(true);
	});

	it('lists dedicated IPs for the workspace', async () => {
		expect(
			Array.isArray(await paced(() => api.dedicatedIps.list({ ownerId }))),
		).toBe(true);
	});

	it('keeps Render’s reason when a plan does not include a feature', async () => {
		// Audit logs need an Organization or Enterprise plan; metrics export
		// needs a paid workspace. Either works on such plans, or fails with
		// Render's explanation in the error message.
		for (const call of [
			() => api.owners.auditLogs({ id: ownerId }),
			() => api.metrics.retrieveOwnerStream({ ownerId }),
		]) {
			// unknown: the two calls return different types, and the outcome is
			// either that value (paid plan) or the rejection; narrowed below.
			const error = await paced<unknown>(call).catch(
				// unknown: a rejected promise can carry any value.
				(caught: unknown) => caught,
			);
			if (!(error instanceof Error)) continue;
			if (!(error instanceof RenderAPIError)) throw error;
			expect(error.status).toBe(400);
			expect(error.message).toMatch(/not available/);
		}
	});

	it('round-trips env groups, a project and an environment, then deletes them', async () => {
		const prefix = `corsair-live-${Date.now()}`;
		const envGroups: string[] = [];
		const projects: string[] = [];
		// unknown: create operations return provider-defined records (typed as
		// a loose record-or-list); only the id is read, after a runtime check.
		const idOf = (created: unknown): string =>
			created && typeof created === 'object' && 'id' in created
				? String(created.id)
				: '';
		try {
			for (const suffix of ['a', 'b']) {
				const group = await paced(() =>
					api.services.envGroups.create({
						name: `${prefix}-${suffix}`,
						ownerId,
						envVars: [{ key: 'CORSAIR_LIVE', value: 'one' }],
					}),
				);
				envGroups.push(idOf(group));
			}
			const [a = '', b = ''] = envGroups;

			// name is style=form, explode=false: two names go as `name=x,y`.
			const both = await paced(() =>
				api.services.envGroups.list({
					name: [`${prefix}-a`, `${prefix}-b`],
				}),
			);
			expect(both).toHaveLength(2);

			const variable = { envGroupId: a, envVarKey: 'CORSAIR_LIVE' };
			expect(
				await paced(() => api.services.envGroups.envVars.retrieve(variable)),
			).toEqual({ key: 'CORSAIR_LIVE', value: 'one' });
			await paced(() =>
				api.services.envGroups.envVars.upsert({ ...variable, value: 'two' }),
			);
			expect(
				await paced(() => api.services.envGroups.envVars.retrieve(variable)),
			).toEqual({ key: 'CORSAIR_LIVE', value: 'two' });

			const file = { envGroupId: a, secretFileName: 'corsair-live.txt' };
			await paced(() =>
				api.services.envGroups.secretFiles.upsert({
					...file,
					content: 'hello',
				}),
			);
			expect(
				await paced(() => api.services.envGroups.secretFiles.retrieve(file)),
			).toEqual({ name: 'corsair-live.txt', content: 'hello' });
			await paced(() => api.services.envGroups.secretFiles.delete(file));

			expect(
				await paced(() =>
					api.services.envGroups.update({
						id: a,
						name: `${prefix}-a-renamed`,
					}),
				),
			).toEqual(expect.objectContaining({ name: `${prefix}-a-renamed` }));

			const project = await paced(() =>
				api.projects.create({
					name: `${prefix}-project`,
					ownerId,
					environments: [{ name: 'production' }],
				}),
			);
			const projectId = idOf(project);
			projects.push(projectId);
			expect(
				await paced(() => api.services.environments.list({ projectId })),
			).toHaveLength(1);
			const stagingId = idOf(
				await paced(() =>
					api.services.environments.create({ name: 'staging', projectId }),
				),
			);
			await paced(() =>
				api.services.environments.addResources({
					environmentId: stagingId,
					resourceIds: [b],
				}),
			);
			expect(
				await paced(() => api.services.envGroups.retrieve({ id: b })),
			).toEqual(expect.objectContaining({ environmentId: stagingId }));
			// DELETE with the resourceIds query (the review bot's P1).
			await paced(() =>
				api.services.environments.removeResources({
					environmentId: stagingId,
					resourceIds: [b],
				}),
			);
			expect(
				await paced(() => api.services.envGroups.retrieve({ id: b })),
			).not.toHaveProperty('environmentId');
			await paced(() => api.services.environments.delete({ id: stagingId }));
		} finally {
			for (const id of envGroups) {
				await paced(() => api.services.envGroups.delete({ id })).catch(
					() => undefined,
				);
			}
			for (const id of projects) {
				await paced(() => api.projects.delete({ id })).catch(() => undefined);
			}
		}

		const leftover = await paced(() =>
			api.services.envGroups.list({
				name: [`${prefix}-a-renamed`, `${prefix}-b`],
			}),
		);
		expect(leftover).toEqual([]);
	});
});
