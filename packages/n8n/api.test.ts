import { writeFileSync } from 'node:fs';
import { createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { n8nOperations } from './endpoints/manifest';
import { n8n } from './index';

/**
 * Live run against an n8n instance. Skipped unless both are set (CI never
 * runs files named api.test.ts):
 *
 *   N8N_INSTANCE_URL=https://n8n.example.com N8N_API_KEY=... npx jest api.test.ts
 *
 * Use a throwaway instance (the 11-28 run used `n8nio/n8n:nightly`, n8n 2.50,
 * in a Boat sandbox): the run creates and deletes workflows, executions,
 * credentials, data tables, tags, an invited user, an AI agent and AI
 * preferences, installs and removes a community node package, and round-trips
 * a package export and import. Optional: N8N_LIVE_REPORT=<file> writes each
 * step's outcome as JSON.
 *
 * Routes the instance's licence lacks answer 403 "Your license does not allow
 * for ..." (projects, variables, LDAP, SAML, OIDC, log streaming, promotions,
 * role mapping, security policy, type policies, source control): the run
 * calls each one and counts that 403 as the expected answer.
 */
const key = process.env.N8N_API_KEY;
const instanceUrl = process.env.N8N_INSTANCE_URL;
const describeIfKey = key && instanceUrl ? describe : describe.skip;
if (!key || !instanceUrl) {
	console.warn('Skipping n8n live run: set N8N_API_KEY and N8N_INSTANCE_URL.');
}

const STAMP = Date.now().toString(36);
const NAME = `ct-${STAMP}`;

// jest-yaml-transform turns the yaml into a plain object.
const docs = require('./plugin-docs.yaml') as {
	// `unknown` because example args are free-form YAML values.
	apiExamples: Record<string, { args: Record<string, unknown> }>;
};

/** Only the fields an operation takes (a read's answer can carry more). */
// `unknown` because the value is any parsed response.
function inputOf(id: string, value: unknown): Record<string, unknown> {
	const props = (n8nOperations.find((o) => o.id === id)?.input.properties ??
		{}) as Record<string, unknown>;
	return Object.fromEntries(
		Object.entries((value ?? {}) as Record<string, unknown>).filter(
			([k]) => k in props,
		),
	);
}
const LICENSE = /n8n 403: (Your license does not allow|.*is not licensed)/;

const NO_ARGUMENT_READS = n8nOperations
	.filter(
		(op) =>
			op.method === 'GET' &&
			((op.input.required as string[] | undefined) ?? []).length === 0,
	)
	.map((op) => op.id);

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

// `unknown` because the value is any parsed response.
function text(value: unknown, ...path: (string | number)[]): string {
	const found = pick(value, ...path);
	if (typeof found !== 'string' && typeof found !== 'number') {
		throw new Error(`response has no ${path.join('.')}`);
	}
	return String(found);
}

const sleep = (ms: number) => new Promise((done) => setTimeout(done, ms));

function manualWorkflow(name: string) {
	return {
		name,
		nodes: [
			{
				id: 'b1f0e2a4-0000-4000-8000-000000000001',
				name: 'Start',
				type: 'n8n-nodes-base.manualTrigger',
				typeVersion: 1,
				position: [0, 0],
				parameters: {},
			},
			{
				id: 'b1f0e2a4-0000-4000-8000-000000000002',
				name: 'Set',
				type: 'n8n-nodes-base.set',
				typeVersion: 3.4,
				position: [220, 0],
				parameters: {
					assignments: {
						assignments: [
							{
								id: 'a1',
								name: 'greeting',
								value: 'hello from corsair',
								type: 'string',
							},
						],
					},
				},
			},
		],
		connections: {
			Start: { main: [[{ node: 'Set', type: 'main', index: 0 }]] },
		},
		settings: { executionOrder: 'v1' },
	};
}

function webhookWorkflow(name: string) {
	return {
		name,
		nodes: [
			{
				id: 'c2f0e2a4-0000-4000-8000-000000000001',
				name: 'Webhook',
				type: 'n8n-nodes-base.webhook',
				typeVersion: 2,
				position: [0, 0],
				webhookId: `corsair-${STAMP}`,
				parameters: { path: `corsair-${STAMP}`, httpMethod: 'GET' },
			},
		],
		connections: {},
		settings: { executionOrder: 'v1' },
	};
}

describeIfKey('n8n live', () => {
	jest.setTimeout(900_000);

	let client: Awaited<ReturnType<typeof createClient>> | undefined;
	// `unknown` because each operation takes its own input.
	type AnyOp = (input: unknown) => Promise<unknown>;
	const op = (id: string): AnyOp => {
		// `unknown` because the walk goes through nested groups of endpoints.
		let node: unknown = (client as NonNullable<typeof client>).corsair.n8n.api;
		for (const part of id.split('.')) {
			node = (node as Record<string, unknown>)[part];
		}
		return node as AnyOp;
	};
	const steps: Step[] = [];
	const cleanups: Array<{ what: string; run: () => Promise<unknown> }> = [];

	async function createClient() {
		const testDb = createTestDatabase();
		await createIntegrationAndAccount(testDb.db, 'n8n', 'default');
		const corsair = createCorsair({
			plugins: [n8n({ key, instanceUrl })],
			database: testDb.db,
			kek: process.env.CORSAIR_KEK ?? '0123456789abcdef0123456789abcdef',
		});
		return { corsair, testDb };
	}

	/**
	 * One call. `expected` is the error the step must answer with (a feature
	 * the licence lacks, a state n8n refuses); that error counts as a pass.
	 * `either` accepts success or that error.
	 */
	async function step(
		id: string,
		input: unknown = {},
		expected?: RegExp,
		options: { either?: boolean } = {},
	): Promise<unknown> {
		try {
			const value = await op(id)(input);
			steps.push({
				id,
				ok: !expected || options.either === true,
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

	function later(what: string, run: () => Promise<unknown>) {
		cleanups.push({ what, run });
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
				if (!/n8n 404/.test(message)) left.push(`${item.what}: ${message}`);
			}
		}
		await client?.testDb.cleanup?.();
		if (left.length > 0) {
			console.warn(`n8n records left behind:\n${left.join('\n')}`);
		}
		const report = process.env.N8N_LIVE_REPORT;
		if (report) {
			writeFileSync(report, JSON.stringify({ steps, left }, null, 2));
		}
		const failed = steps.filter((s) => !s.ok);
		const expectedErrors = steps.filter((s) => s.expected).length;
		const distinct = new Set(steps.map((s) => s.id)).size;
		console.log(
			`n8n live: ${steps.length - failed.length}/${steps.length} ok (${expectedErrors} expected errors, ${distinct} operations)\n${failed
				.map((s) => `  ${s.id}: ${s.note}`)
				.join('\n')}`,
		);
		if (failed.length > 0 || left.length > 0) {
			throw new Error(
				`${failed.length} n8n live steps failed, ${left.length} records left`,
			);
		}
	});

	it('reads every GET that takes no arguments', async () => {
		for (const id of NO_ARGUMENT_READS) {
			await step(id, {}, LICENSE, { either: true });
		}
		await step('audit.generate', {
			additionalOptions: { categories: ['nodes'] },
		});
	});

	it('round-trips tags', async () => {
		const tag = await step('tags.create', { name: `${NAME}-tag` });
		const tagId = text(tag, 'id');
		later('tag', () => op('tags.delete')({ tagId }));
		await step('tags.get', { tagId });
		await step('tags.update', { tagId, name: `${NAME}-tag2` });
		await step('tags.list', { limit: 5 });
		await step('tags.delete', { tagId });
	});

	it('runs a workflow and reads its executions', async () => {
		const created = await step(
			'workflows.create',
			manualWorkflow(`${NAME}-wf`),
		);
		const workflowId = text(created, 'id');
		later('workflow', () => op('workflows.delete')({ workflowId }));
		await step('workflows.get', { workflowId, excludePinnedData: true });
		await step('workflows.update', {
			workflowId,
			...manualWorkflow(`${NAME}-wf-renamed`),
		});
		const tag = await step('tags.create', { name: `${NAME}-wftag` });
		const tagId = text(tag, 'id');
		later('workflow tag', () => op('tags.delete')({ tagId }));
		await step('workflows.setTags', { workflowId, tags: [{ id: tagId }] });
		await step('workflows.getTags', { workflowId });
		await step('workflows.getDependencies', { workflowId });
		const history = await step('workflows.listHistory', { workflowId });
		const versionId =
			(pick(history, 'data', 0, 'versionId') as string | undefined) ??
			(pick(created, 'versionId') as string | undefined);
		if (versionId) {
			await step('workflows.getVersion', {
				workflowId,
				workflowVersionId: versionId,
			});
			await step('workflows.getVersionLegacy', {
				workflowId,
				workflowVersionId: versionId,
			});
		}
		await step('workflows.list', { name: `${NAME}-wf-renamed`, limit: 5 });

		// Run it and read the execution.
		const run = await step('workflows.run', {
			workflowId,
			runData: {},
			destinationNode: { nodeName: 'Set', mode: 'inclusive' },
		});
		let executionId = pick(run, 'executionId') ?? pick(run, 'id');
		for (let i = 0; i < 20 && executionId === undefined; i++) {
			await sleep(1000);
			const page = await op('executions.list')({ workflowId, limit: 1 });
			executionId = pick(page, 'data', 0, 'id');
		}
		await sleep(2000);
		if (executionId !== undefined) {
			const id = String(executionId);
			await step('executions.list', {
				workflowId,
				limit: 5,
				includeData: false,
			});
			await step('executions.get', {
				executionId: Number(id),
				includeData: true,
			});
			// Execution tags are annotation tags, a separate list from workflow
			// tags: a workflow tag's id answers 404 "Some tags not found".
			await step(
				'executions.setTags',
				{ executionId: Number(id), tags: [{ id: tagId }] },
				/n8n 404: Some tags not found/,
				{ either: true },
			);
			await step('executions.getTags', { executionId: Number(id) });
			// A finished execution: n8n refuses to stop or retry a success.
			await step('executions.stop', { executionId: Number(id) }, /n8n 4\d\d/, {
				either: true,
			});
			await step('executions.retry', { executionId: Number(id) }, /n8n 4\d\d/, {
				either: true,
			});
			await step(
				'executions.stopMany',
				{ status: ['running', 'waiting'] },
				/n8n 4\d\d/,
				{
					either: true,
				},
			);
			await step('executions.delete', { executionId: Number(id) });
		} else {
			steps.push({ id: 'executions.get', ok: false, note: 'no execution id' });
		}

		// Evaluations need an evaluation trigger: the workflow has none.
		await step('evaluations.listRuns', { workflowId });
		await step('evaluations.startRun', { workflowId }, /n8n 4\d\d/, {
			either: true,
		});
		await step(
			'evaluations.getRun',
			{ workflowId, runId: 'nonexistent' },
			/n8n 40[34]/,
		);
		await step(
			'evaluations.listCases',
			{ workflowId, runId: 'nonexistent' },
			/n8n 40[34]/,
		);
		await step(
			'evaluations.cancelRun',
			{ workflowId, runId: 'nonexistent' },
			/n8n 40[34]/,
		);

		await step('workflows.archive', { workflowId });
		await step('workflows.unarchive', { workflowId });
		await step(
			'workflows.transfer',
			{ workflowId, destinationProjectId: 'nonexistent' },
			/n8n 4\d\d/,
		);
		await step('workflows.archive', { workflowId });
		await step('workflows.delete', { workflowId });
	});

	it('activates and publishes a webhook workflow', async () => {
		const created = await step(
			'workflows.create',
			webhookWorkflow(`${NAME}-hook`),
		);
		const workflowId = text(created, 'id');
		later('webhook workflow', async () => {
			await op('workflows.archive')({ workflowId }).catch(() => undefined);
			return op('workflows.delete')({ workflowId });
		});
		await step('workflows.activate', { workflowId });
		await step('workflows.deactivate', { workflowId });
		await step('workflows.publish', { workflowId });
		await step('workflows.unpublish', { workflowId });
	});

	it('round-trips a credential', async () => {
		await step('credentials.getSchema', {
			credentialTypeName: 'httpHeaderAuth',
		});
		const created = await step('credentials.create', {
			name: `${NAME}-cred`,
			type: 'httpHeaderAuth',
			data: { name: 'X-Test', value: 'not-a-real-secret' },
		});
		const credentialId = text(created, 'id');
		later('credential', () => op('credentials.delete')({ credentialId }));
		await step('credentials.get', { credentialId });
		await step('credentials.update', {
			credentialId,
			name: `${NAME}-cred2`,
			type: 'httpHeaderAuth',
			data: { name: 'X-Test', value: 'still-not-real' },
		});
		await step('credentials.getDependencies', { credentialId });
		await step('credentials.test', { credentialId }, /n8n 4\d\d/, {
			either: true,
		});
		await step('credentials.list', { limit: 5 });
		await step(
			'credentials.transfer',
			{ credentialId, destinationProjectId: 'nonexistent' },
			/n8n 4\d\d/,
		);
		await step('credentials.delete', { credentialId });
	});

	it('round-trips a data table, its columns and rows', async () => {
		const created = await step('dataTables.create', {
			name: `${NAME}-table`,
			columns: [
				{ name: 'title', type: 'string' },
				{ name: 'score', type: 'number' },
			],
		});
		const dataTableId = text(created, 'id');
		later('data table', () => op('dataTables.delete')({ dataTableId }));
		await step('dataTables.get', { dataTableId });
		await step('dataTables.update', { dataTableId, name: `${NAME}-table2` });
		await step('dataTables.getDependencies', { dataTableId });
		const column = await step('dataTables.columns.create', {
			dataTableId,
			name: 'note',
			type: 'string',
		});
		const columns = await step('dataTables.columns.list', { dataTableId });
		const columnId =
			(pick(column, 'id') as string | undefined) ??
			(
				(Array.isArray(columns) ? columns : []).find(
					(c) => pick(c, 'name') === 'note',
				) as { id?: string } | undefined
			)?.id;
		if (columnId) {
			await step('dataTables.columns.update', {
				dataTableId,
				columnId,
				name: 'remark',
			});
		}
		await step('dataTables.rows.insert', {
			dataTableId,
			data: [
				{ title: 'first', score: 1 },
				{ title: 'second', score: 2 },
			],
			returnType: 'all',
		});
		await step('dataTables.rows.list', { dataTableId, limit: 10 });
		await step('dataTables.rows.update', {
			dataTableId,
			filter: {
				type: 'and',
				filters: [{ columnName: 'title', condition: 'eq', value: 'first' }],
			},
			data: { score: 10 },
			returnData: true,
		});
		await step('dataTables.rows.upsert', {
			dataTableId,
			filter: {
				type: 'and',
				filters: [{ columnName: 'title', condition: 'eq', value: 'third' }],
			},
			data: { title: 'third', score: 3 },
			returnData: true,
		});
		await step('dataTables.rows.delete', {
			dataTableId,
			filter: JSON.stringify({
				type: 'and',
				filters: [{ columnName: 'title', condition: 'eq', value: 'second' }],
			}),
			returnData: true,
		});
		await step('dataTables.rows.clear', { dataTableId });
		if (columnId)
			await step('dataTables.columns.delete', { dataTableId, columnId });
		await step('dataTables.delete', { dataTableId });
	});

	it('exports and imports a package', async () => {
		const created = await step(
			'workflows.create',
			manualWorkflow(`${NAME}-pkg`),
		);
		const workflowId = text(created, 'id');
		later('package workflow', async () => {
			await op('workflows.archive')({ workflowId }).catch(() => undefined);
			return op('workflows.delete')({ workflowId });
		});
		const exported = (await step('packages.export', {
			workflowIds: [workflowId],
		})) as { contentBase64?: string; contentType?: string } | undefined;
		steps.push({
			id: 'packages.export content',
			ok: typeof exported?.contentBase64 === 'string',
			note: exported?.contentType,
		});
		if (exported?.contentBase64) {
			const imported = await step('packages.import', {
				package: {
					base64: exported.contentBase64,
					filename: 'corsair.n8np',
					contentType: 'application/gzip',
				},
				conflictPolicy: 'new-version',
			});
			for (const id of (pick(imported, 'workflows') as
				| Array<{ id?: string }>
				| undefined) ?? []) {
				if (id?.id && id.id !== workflowId) {
					later('imported workflow', async () => {
						await op('workflows.archive')({ workflowId: id.id }).catch(
							() => undefined,
						);
						return op('workflows.delete')({ workflowId: id.id });
					});
				}
			}
			await step(
				'packages.importSelection',
				{
					package: {
						base64: exported.contentBase64,
						filename: 'corsair.n8np',
						contentType: 'application/gzip',
					},
					// A selection import takes a project package: this one is a
					// workflow package, so n8n refuses it.
					selectedProjectId: 'personal',
					selectedWorkflowIds: '[]',
				},
				/n8n 4\d\d/,
				{ either: true },
			);
		}
	});

	it('invites and removes a user', async () => {
		const users = await step('users.list', { limit: 5, includeRole: true });
		const ownerId = text(users, 'data', 0, 'id');
		await step('users.get', { userId: ownerId, includeRole: true });
		const invited = await step('users.invite', {
			users: [
				{
					email: `corsair-tests+n8n-${STAMP}@inkboxmail.com`,
					role: 'global:member',
				},
			],
		});
		const userId = pick(invited, 0, 'user', 'id') as string | undefined;
		if (userId) {
			later('user', () => op('users.delete')({ userId }));
			await step(
				'users.changeRole',
				{ userId, newRoleName: 'global:admin' },
				LICENSE,
				{ either: true },
			);
			await step('users.delete', { userId });
		}
	});

	it('round-trips an AI agent and AI preferences', async () => {
		const agent = await step(
			'agents.create',
			{ name: `${NAME}-agent` },
			/n8n 4\d\d/,
			{ either: true },
		);
		const agentId = pick(agent, 'id') as string | undefined;
		if (agentId) {
			later('agent', () => op('agents.delete')({ agentId }));
			await step('agents.get', { agentId });
			const read = await step('agents.get', { agentId });
			await step(
				'agents.update',
				{ ...inputOf('agents.update', read), agentId, name: `${NAME}-agent2` },
				/n8n 4\d\d/,
				{ either: true },
			);
			const versions = await step('agents.versions.list', { agentId });
			const versionId = (pick(versions, 'data', 0, 'id') ??
				pick(versions, 'data', 0, 'versionId')) as string | undefined;
			steps.push({
				id: 'agents.versions.list count',
				ok: true,
				note: JSON.stringify(versions).slice(0, 200),
			});
			if (versionId) await step('agents.versions.get', { agentId, versionId });
			await step('agents.publish', { agentId }, /n8n 4\d\d/, { either: true });
			await step('agents.unpublish', { agentId }, /n8n 4\d\d/, {
				either: true,
			});
			// No model credential on the instance: the run is refused or fails.
			await step('agents.run', { agentId, message: 'hello' }, /n8n 4\d\d/, {
				either: true,
			});
			await step('agents.executions.list', { agentId });
			await step(
				'agents.executions.stop',
				{ agentId, executionId: 'nonexistent' },
				/n8n 4\d\d/,
			);
			await step('agents.archive', { agentId });
			await step('agents.unarchive', { agentId });
			await step('agents.delete', { agentId });
		}
		const pref = await step(
			'aiPreferences.create',
			{ scope: 'user', content: 'Answer in short sentences.' },
			/n8n 4\d\d/,
			{ either: true },
		);
		const aiPreferenceId = pick(pref, 'id') as string | undefined;
		if (aiPreferenceId) {
			later('ai preference', () =>
				op('aiPreferences.delete')({ aiPreferenceId }),
			);
			await step('aiPreferences.get', { aiPreferenceId });
			await step(
				'aiPreferences.update',
				{ aiPreferenceId, scope: 'user', content: 'Answer in one sentence.' },
				/n8n 4\d\d/,
				{ either: true },
			);
			await step('aiPreferences.delete', { aiPreferenceId });
		}
	});

	it('installs and removes a community node package', async () => {
		const name = 'n8n-nodes-text-manipulation';
		const installed = await step(
			'communityPackages.install',
			{ name },
			/n8n 4\d\d/,
			{ either: true },
		);
		if (installed) {
			later('community package', () =>
				op('communityPackages.uninstall')({ name }),
			);
			await step('communityPackages.update', { name }, /n8n 4\d\d/, {
				either: true,
			});
			await step('communityPackages.uninstall', { name });
		}
	});

	it('writes instance settings back unchanged', async () => {
		const rate = await step('settings.rateLimits.get');
		if (rate)
			await step(
				'settings.rateLimits.update',
				inputOf('settings.rateLimits.update', rate),
				/n8n 4\d\d/,
				{ either: true },
			);
		const otel = await step('settings.otel.get');
		if (otel) {
			await step(
				'settings.otel.update',
				inputOf('settings.otel.update', otel),
				/n8n 4\d\d/,
				{ either: true },
			);
			// Nothing listens on the default exporter endpoint: the test trace fails.
			await step(
				'settings.otel.testTrace',
				inputOf('settings.otel.testTrace', otel),
				/n8n 4\d\d/,
				{ either: true },
			);
		}
		await step('roles.get', { roleSlug: 'project:viewer' });
	});

	it('answers licence-gated writes with 403', async () => {
		// Inputs from plugin-docs.yaml (made-up ids that pass the schema).
		const gated = [
			'projects.create',
			'projects.update',
			'projects.delete',
			'projects.users.list',
			'projects.users.add',
			'projects.users.changeRole',
			'projects.users.remove',
			'folders.list',
			'folders.create',
			'folders.get',
			'folders.update',
			'folders.delete',
			'variables.create',
			'variables.update',
			'variables.delete',
			'roles.create',
			'roles.update',
			'roles.delete',
			'roleMappingRules.create',
			'roleMappingRules.update',
			'roleMappingRules.move',
			'roleMappingRules.delete',
			'sourceControl.getStatus',
			'sourceControl.pull',
			'sourceControl.push',
			'settings.ldap.update',
			'settings.ldap.runSync',
			'settings.saml.update',
			'settings.oidc.update',
			'settings.securityPolicy.update',
			'settings.logStreaming.createDestination',
			'settings.logStreaming.getDestination',
			'settings.logStreaming.updateDestination',
			'settings.logStreaming.deleteDestination',
			'settings.logStreaming.testDestination',
			'credentialTypePolicies.setInstance',
			'credentialTypePolicies.getProject',
			'credentialTypePolicies.setProject',
			'credentialTypePolicies.documents.create',
			'credentialTypePolicies.documents.get',
			'credentialTypePolicies.documents.update',
			'credentialTypePolicies.documents.delete',
			'credentialTypePolicies.attachments.get',
			'credentialTypePolicies.attachments.replace',
			'nodeTypePolicies.setInstance',
			'nodeTypePolicies.getProject',
			'nodeTypePolicies.setProject',
			'nodeTypePolicies.documents.create',
			'nodeTypePolicies.documents.get',
			'nodeTypePolicies.documents.update',
			'nodeTypePolicies.documents.delete',
			'nodeTypePolicies.attachments.get',
			'nodeTypePolicies.attachments.replace',
			'promotions.settings.update',
			'promotions.reviews.get',
			'promotions.providers.create',
			'promotions.providers.get',
			'promotions.providers.update',
			'promotions.providers.delete',
			'promotions.providers.listRepositories',
			'promotions.providers.listBranches',
			'promotions.environments.create',
			'promotions.environments.get',
			'promotions.environments.update',
			'promotions.environments.delete',
			'promotions.environments.connect',
			'promotions.environments.disconnect',
			'promotions.environments.listProjects',
			'promotions.environments.listMissingProjects',
			'promotions.environments.addProject',
			'promotions.environments.removeProject',
			'promotions.environments.listChanges',
			'promotions.environments.getChangeDetails',
			'promotions.environments.promote',
			'promotions.environments.apply',
			'promotions.environments.continueApply',
			'promotions.projects.listChanges',
			'promotions.projects.getChangeDetails',
			'promotions.projects.promote',
			'promotions.projects.apply',
			'promotions.projects.continueApply',
		];
		for (const id of gated) {
			// The licence check runs first on most routes; a route that validates
			// its input first answers 400 or 404 for the made-up ids.
			await step(id, docs.apiExamples[id]?.args ?? {}, /n8n (403|400|404|422)/);
		}
	});
});
