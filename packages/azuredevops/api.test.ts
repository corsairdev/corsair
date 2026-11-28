import { writeFileSync } from 'node:fs';
import { createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { azuredevops } from './index';

/**
 * Live run against an Azure DevOps organization. Skipped unless the PAT, the
 * organization and a project are set (CI never runs files named api.test.ts):
 *
 *   AZURE_DEVOPS_PAT=... AZURE_DEVOPS_ORG=fabrikam AZURE_DEVOPS_PROJECT=Sandbox npx jest api.test.ts
 *
 * Use a throwaway project and a PAT with Code (read & write), Work Items
 * (read & write) and Project and Team (read). The run reads the profile,
 * projects, teams and repositories, then creates a Git repository and a work
 * item, edits and queries them, and deletes both. It queues nothing and adds
 * no users. Optional: AZURE_DEVOPS_LIVE_REPORT=<file> writes each step as JSON.
 */
const key = process.env.AZURE_DEVOPS_PAT;
const organization = process.env.AZURE_DEVOPS_ORG;
const project = process.env.AZURE_DEVOPS_PROJECT;
const describeIfKey = key && organization && project ? describe : describe.skip;
if (!key || !organization || !project) {
	console.warn(
		'Skipping Azure DevOps live run: set AZURE_DEVOPS_PAT, AZURE_DEVOPS_ORG and AZURE_DEVOPS_PROJECT.',
	);
}

const STAMP = Date.now().toString(36);
type Step = { id: string; ok: boolean; expected?: boolean; note?: string };

// `unknown` because the value is any parsed response.
function pick(value: unknown, ...path: (string | number)[]): unknown {
	let node = value;
	for (const part of path) {
		node =
			typeof node === 'object' && node !== null
				? (node as Record<string | number, unknown>)[part]
				: undefined;
	}
	return node;
}

describeIfKey('azure devops live', () => {
	jest.setTimeout(600_000);
	let client: Awaited<ReturnType<typeof createClient>> | undefined;
	// `unknown` because each operation takes its own input.
	type AnyOp = (input: unknown) => Promise<unknown>;
	const op = (id: string): AnyOp => {
		// `unknown` because the walk goes through nested groups of endpoints.
		let node: unknown = (client as NonNullable<typeof client>).corsair
			.azuredevops.api;
		for (const part of id.split('.'))
			node = (node as Record<string, unknown>)[part];
		return node as AnyOp;
	};
	const steps: Step[] = [];
	const cleanups: Array<{ what: string; run: () => Promise<unknown> }> = [];

	async function createClient() {
		const testDb = createTestDatabase();
		await createIntegrationAndAccount(testDb.db, 'azuredevops', 'default');
		const corsair = createCorsair({
			plugins: [azuredevops({ key, organization })],
			database: testDb.db,
			kek: process.env.CORSAIR_KEK ?? '0123456789abcdef0123456789abcdef',
		});
		return { corsair, testDb };
	}

	async function step(
		id: string,
		input: unknown = {},
		expected?: RegExp,
	): Promise<unknown> {
		try {
			const value = await op(id)(input);
			steps.push({
				id,
				ok: !expected,
				...(expected ? { note: 'no error' } : {}),
			});
			return value;
		} catch (error) {
			const note = (error as Error).message.slice(0, 240);
			const ok = expected?.test(note) ?? false;
			steps.push({ id, ok, expected: ok, note });
			return undefined;
		}
	}

	beforeAll(async () => {
		client = await createClient();
	});

	afterAll(async () => {
		const left: string[] = [];
		for (const item of cleanups.reverse()) {
			try {
				await item.run();
			} catch (error) {
				const message = (error as Error).message;
				if (!/Azure DevOps 404/.test(message))
					left.push(`${item.what}: ${message}`);
			}
		}
		await client?.testDb.cleanup?.();
		const report = process.env.AZURE_DEVOPS_LIVE_REPORT;
		if (report) writeFileSync(report, JSON.stringify({ steps, left }, null, 2));
		const failed = steps.filter((s) => !s.ok);
		console.log(
			`Azure DevOps live: ${steps.length - failed.length}/${steps.length} ok\n${failed.map((s) => `  ${s.id}: ${s.note}`).join('\n')}`,
		);
		if (failed.length > 0 || left.length > 0) {
			throw new Error(
				`${failed.length} Azure DevOps live steps failed, ${left.length} records left`,
			);
		}
	});

	it('reads the profile, projects, teams and repositories', async () => {
		await step('profile.profiles.get', { id: 'me' });
		await step('core.projects.list', { $top: 5 });
		await step('core.projects.get', { projectId: project });
		await step('core.teams.getAllTeams', { $top: 5 });
		await step('git.repositories.list', { project });
		await step('status.health.get', {});
	});

	it('creates, edits, queries and deletes a work item', async () => {
		const item = await step('wit.workItems.create', {
			project,
			type: 'Task',
			body: [
				{
					op: 'add',
					path: '/fields/System.Title',
					value: `Corsair live ${STAMP}`,
				},
			],
		});
		const id = pick(item, 'id');
		if (typeof id !== 'number') return;
		cleanups.push({
			what: 'work item',
			run: () => op('wit.workItems.delete')({ project, id, destroy: true }),
		});
		await step('wit.workItems.getWorkItem', { project, id });
		await step('wit.workItems.update', {
			project,
			id,
			body: [
				{
					op: 'add',
					path: '/fields/System.Description',
					value: 'Edited by the Corsair live run.',
				},
			],
		});
		await step('wit.wiql.queryByWiql', {
			project,
			team: `${project} Team`,
			query: `Select [System.Id] From WorkItems Where [System.Title] = 'Corsair live ${STAMP}'`,
		});
		await step('wit.workItems.delete', { project, id, destroy: true });
	});

	it('creates and deletes a Git repository', async () => {
		const repo = await step('git.repositories.create', {
			project,
			name: `corsair-live-${STAMP}`,
		});
		const repositoryId = pick(repo, 'id');
		if (typeof repositoryId !== 'string') return;
		cleanups.push({
			what: 'repository',
			run: () => op('git.repositories.delete')({ project, repositoryId }),
		});
		await step('git.repositories.getRepository', { project, repositoryId });
		await step('git.repositories.delete', { project, repositoryId });
	});
});
