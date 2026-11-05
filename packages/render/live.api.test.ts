import { RenderAPIError } from './client';
import { render } from './index';

// Live checks against the real Render API, skipped unless RENDER_API_KEY is
// set (CI skips *api.test.ts files). A free Hobby workspace is enough: the
// reads need no resources, and the write round-trip only creates env groups,
// a project and an environment, which are free and deleted before the test
// ends. Calls are paced to stay under two requests a second.
const apiKey = process.env.RENDER_API_KEY;
const describeLive = apiKey ? describe : describe.skip;

const plugin = render({ key: apiKey ?? 'unset' });
// The bound tree is typed per operation; the live checks call through a
// loose view so one paced helper can run any operation.
// unknown: each operation validates its own input and output.
type Call = (ctx: never, input: unknown) => Promise<unknown>;
const ctx = { key: apiKey, $getAccountId: async () => 'live' } as never;
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const op = (path: string): Call => {
	const found = path
		.split('.')
		.reduce<unknown>(
			(node, name) =>
				node && typeof node === 'object' ? Reflect.get(node, name) : undefined,
			plugin.endpoints,
		);
	if (typeof found !== 'function') throw new Error(`no operation ${path}`);
	return found as Call;
};
const live = async <T>(path: string, input: unknown = {}): Promise<T> => {
	await sleep(600);
	return (await op(path)(ctx, input)) as T;
};

jest.setTimeout(180_000);

describeLive('Render live API', () => {
	let ownerId = '';

	beforeAll(async () => {
		const owners = await live<{ owner: { id: string } }[]>('owners.list');
		ownerId = owners[0]?.owner.id ?? '';
		expect(ownerId).toMatch(/^(tea|usr)-/);
	});

	it('reads the user, workspace and notification settings', async () => {
		expect(await live('user.get')).toEqual(
			expect.objectContaining({ id: expect.any(String) }),
		);
		expect(await live('owners.retrieve', { id: ownerId })).toEqual(
			expect.objectContaining({ id: ownerId, type: expect.any(String) }),
		);
		expect(Array.isArray(await live('owners.members', { id: ownerId }))).toBe(
			true,
		);
		expect(
			await live('notifications.retrieveOwnerSettings', { ownerId }),
		).toEqual(expect.objectContaining({ ownerId }));
	});

	it.each([
		['services.list', {}],
		['projects.list', {}],
		['services.envGroups.list', {}],
		['postgres.list', {}],
		['keyValue.list', {}],
		['registryCredentials.list', {}],
		['blueprints.list', {}],
		['buildSources.list', {}],
		['automation.listDisks', {}],
		['automation.listMaintenance', {}],
		['automation.listTaskRuns', {}],
		// These four answer null when empty; the plugin returns [].
		['automation.listTasks', {}],
		['automation.listWorkflows', {}],
		['automation.listWorkflowVersions', {}],
		['logs.resourceStreams', {}],
		['automation.listWebhooks', {}],
		['notifications.listOverrides', {}],
	])('%s returns a list', async (path, input) => {
		expect(Array.isArray(await live(path, input))).toBe(true);
	});

	it('lists dedicated IPs for the workspace', async () => {
		expect(Array.isArray(await live('dedicatedIps.list', { ownerId }))).toBe(
			true,
		);
	});

	it('keeps Render’s reason when a plan does not include a feature', async () => {
		// Audit logs need an Organization or Enterprise plan; metrics export
		// needs a paid workspace. Either works on such plans, or fails with
		// Render's explanation in the error message.
		for (const [path, input] of [
			['owners.auditLogs', { id: ownerId }],
			['metrics.retrieveOwnerStream', { ownerId }],
		] as const) {
			try {
				await live(path, input);
			} catch (error) {
				expect(error).toBeInstanceOf(RenderAPIError);
				expect((error as RenderAPIError).status).toBe(400);
				expect((error as Error).message).toMatch(/not available/);
			}
		}
	});

	it('round-trips env groups, a project and an environment, then deletes them', async () => {
		const prefix = `corsair-live-${Date.now()}`;
		const envGroups: string[] = [];
		const projects: string[] = [];
		try {
			for (const suffix of ['a', 'b']) {
				const group = await live<{ id: string }>('services.envGroups.create', {
					name: `${prefix}-${suffix}`,
					ownerId,
					envVars: [{ key: 'CORSAIR_LIVE', value: 'one' }],
				});
				envGroups.push(group.id);
			}
			const [a = '', b = ''] = envGroups;

			// name is style=form, explode=false: two names go as `name=x,y`.
			const both = await live<unknown[]>('services.envGroups.list', {
				name: [`${prefix}-a`, `${prefix}-b`],
			});
			expect(both).toHaveLength(2);

			const variable = { envGroupId: a, envVarKey: 'CORSAIR_LIVE' };
			expect(
				await live('services.envGroups.envVars.retrieve', variable),
			).toEqual({ key: 'CORSAIR_LIVE', value: 'one' });
			await live('services.envGroups.envVars.upsert', {
				...variable,
				value: 'two',
			});
			expect(
				await live('services.envGroups.envVars.retrieve', variable),
			).toEqual({ key: 'CORSAIR_LIVE', value: 'two' });

			const file = { envGroupId: a, secretFileName: 'corsair-live.txt' };
			await live('services.envGroups.secretFiles.upsert', {
				...file,
				content: 'hello',
			});
			expect(
				await live('services.envGroups.secretFiles.retrieve', file),
			).toEqual({ name: 'corsair-live.txt', content: 'hello' });
			await live('services.envGroups.secretFiles.delete', file);

			expect(
				await live('services.envGroups.update', {
					id: a,
					name: `${prefix}-a-renamed`,
				}),
			).toEqual(expect.objectContaining({ name: `${prefix}-a-renamed` }));

			const project = await live<{ id: string }>('projects.create', {
				name: `${prefix}-project`,
				ownerId,
				environments: [{ name: 'production' }],
			});
			projects.push(project.id);
			expect(
				await live('services.environments.list', { projectId: project.id }),
			).toHaveLength(1);
			const staging = await live<{ id: string }>(
				'services.environments.create',
				{ name: 'staging', projectId: project.id },
			);
			await live('services.environments.addResources', {
				environmentId: staging.id,
				resourceIds: [b],
			});
			expect(await live('services.envGroups.retrieve', { id: b })).toEqual(
				expect.objectContaining({ environmentId: staging.id }),
			);
			// DELETE with the resourceIds query (the review bot's P1).
			await live('services.environments.removeResources', {
				environmentId: staging.id,
				resourceIds: [b],
			});
			expect(
				await live<{ environmentId?: string }>('services.envGroups.retrieve', {
					id: b,
				}),
			).not.toHaveProperty('environmentId');
			await live('services.environments.delete', { id: staging.id });
		} finally {
			for (const id of envGroups) {
				await live('services.envGroups.delete', { id }).catch(() => undefined);
			}
			for (const id of projects) {
				await live('projects.delete', { id }).catch(() => undefined);
			}
		}

		const leftover = await live<{ name: string }[]>('services.envGroups.list', {
			name: [`${prefix}-a-renamed`, `${prefix}-b`],
		});
		expect(leftover).toEqual([]);
	});
});
