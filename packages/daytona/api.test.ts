import { writeFileSync } from 'node:fs';
import { createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { daytonaOperations } from './endpoints/manifest';
import { daytona } from './index';

/**
 * Live run against a Daytona organization. Skipped unless DAYTONA_API_KEY is
 * set (CI never runs files named api.test.ts):
 *
 *   DAYTONA_API_KEY=... npx jest api.test.ts
 *
 * Reads every main-API GET that takes no arguments, the key's organization
 * (usage, members, audit log, analytics) and a secret round trip, then runs
 * one small sandbox end to end: toolbox info, a command, code, files (upload,
 * list, search, download, delete), a git clone, a process session, logs and
 * metrics, then stop and delete.
 * Everything created is deleted at the end, even when a step fails. A run
 * uses a few cents of the free credit at most.
 *
 * Never run here: invites, key creation, region and identity provider
 * changes, registry and runner changes, and git pushes.
 * DAYTONA_LIVE_REPORT=<file> writes each step's outcome as JSON.
 */
const key = process.env.DAYTONA_API_KEY;
const describeIfKey = key ? describe : describe.skip;
if (!key) console.warn('Skipping Daytona live run: set DAYTONA_API_KEY.');

const NAME = `corsair-test-${Date.now()}`;

const NO_ARGUMENT_READS = daytonaOperations
	.filter(
		(op) =>
			op.method === 'GET' &&
			op.plane === undefined &&
			((op.input.required as string[] | undefined) ?? []).length === 0,
	)
	.map((op) => op.id);

async function createClient() {
	const testDb = createTestDatabase();
	await createIntegrationAndAccount(testDb.db, 'daytona', 'default');
	const corsair = createCorsair({
		plugins: [daytona({ key })],
		database: testDb.db,
		kek: process.env.CORSAIR_KEK ?? '0123456789abcdef0123456789abcdef',
	});
	return { corsair, testDb };
}

type Step = { id: string; ok: boolean; expected?: boolean; note?: string };

// `unknown` because the value is any parsed response.
function field(value: unknown, name: string): string {
	const found =
		typeof value === 'object' && value !== null
			? (value as Record<string, unknown>)[name]
			: undefined;
	if (typeof found !== 'string' && typeof found !== 'number') {
		throw new Error(`response has no ${name}`);
	}
	return String(found);
}

const sleep = (ms: number) => new Promise((done) => setTimeout(done, ms));

describeIfKey('daytona live', () => {
	jest.setTimeout(900_000);

	let client: Awaited<ReturnType<typeof createClient>> | undefined;
	// `unknown` because each operation takes its own input.
	type AnyOp = (input: unknown) => Promise<unknown>;
	const op = (id: string): AnyOp => {
		// `unknown` because the walk goes through nested groups of endpoints.
		let node: unknown = (client as NonNullable<typeof client>).corsair.daytona
			.api;
		for (const part of id.split('.')) {
			node = (node as Record<string, unknown>)[part];
		}
		return node as AnyOp;
	};
	const steps: Step[] = [];
	const cleanups: Array<{ what: string; run: () => Promise<unknown> }> = [];

	// `unknown` because each operation takes and returns its own shapes.
	// `expected` is the error a step must answer with (a route Daytona Cloud
	// does not serve, say); that error counts as a pass.
	async function step(
		id: string,
		input: unknown = {},
		expected?: RegExp,
	): Promise<unknown> {
		try {
			const value = await op(id)(input);
			steps.push({ id, ok: !expected, note: expected && 'no error' });
			return value;
		} catch (error) {
			const note = (error as Error).message.slice(0, 200);
			const ok = expected?.test(note) ?? false;
			steps.push({ id, ok, expected: ok, note });
			return undefined;
		}
	}

	/** Polls the sandbox until `done` says its state is reached. */
	async function waitFor(id: string, done: (state: string) => boolean) {
		for (let i = 0; i < 60; i++) {
			try {
				const current = await op('sandboxes.get')({ sandboxIdOrName: id });
				if (done(field(current, 'state'))) return;
			} catch (error) {
				if (/Daytona 404/.test((error as Error).message)) return;
				throw error;
			}
			await sleep(3000);
		}
	}

	beforeAll(async () => {
		client = await createClient();
	});

	afterAll(async () => {
		const left: string[] = [];
		for (const item of cleanups.reverse()) {
			// A sandbox still stopping answers 409 to a delete: try again for a
			// minute before reporting it left behind.
			for (let attempt = 0; ; attempt++) {
				try {
					await item.run();
					break;
				} catch (error) {
					const message = (error as Error).message;
					if (/Daytona 404/.test(message)) break;
					if (/Daytona 409/.test(message) && attempt < 20) {
						await sleep(3000);
						continue;
					}
					left.push(`${item.what}: ${message}`);
					break;
				}
			}
		}
		await client?.testDb.cleanup?.();
		if (left.length > 0) {
			console.warn(`Daytona records left behind:\n${left.join('\n')}`);
		}
		const report = process.env.DAYTONA_LIVE_REPORT;
		if (report) writeFileSync(report, JSON.stringify(steps, null, 2));
		const failed = steps.filter((s) => !s.ok);
		const expectedErrors = steps.filter((s) => s.expected).length;
		console.log(
			`Daytona live: ${steps.length - failed.length}/${steps.length} ok (${expectedErrors} expected errors)\n${failed
				.map((s) => `  ${s.id}: ${s.note}`)
				.join('\n')}`,
		);
		// After cleanup and the report, so a failed step fails the run.
		if (failed.length > 0 || left.length > 0) {
			throw new Error(
				`${failed.length} Daytona live steps failed, ${left.length} records left`,
			);
		}
	});

	// Daytona Cloud (v0.235.0) answers these no-argument reads with an error a
	// plain API key always gets: runner and warm-pool lists exist only on a
	// self-hosted Daytona, key management needs an organization setting, and
	// readiness is for Daytona's own probes.
	const CLOUD_ERRORS: Record<string, RegExp> = {
		'runners.list': /Daytona 404: Cannot GET/,
		'warmPools.list': /Daytona 404: Cannot GET/,
		'apiKeys.list': /Daytona 403: Managing API keys with an API key/,
		'health.ready': /Daytona 403: Invalid authentication context/,
	};

	let organizationId = '';
	const DAY = 24 * 60 * 60 * 1000;
	const window = () => ({
		from: new Date(Date.now() - 7 * DAY).toISOString(),
		to: new Date().toISOString(),
	});

	it('reads every GET that takes no arguments, and the organization', async () => {
		for (const id of NO_ARGUMENT_READS) await step(id, {}, CLOUD_ERRORS[id]);
		const current = await step('apiKeys.getCurrent');
		organizationId = field(current, 'organizationId');
		for (const id of [
			'organizations.getUsageOverview',
			'organizations.listMembers',
			'organizations.getGpuCapacity',
			'organizations.listAvailableSandboxClasses',
			'audit.getOrganizationLogs',
		]) {
			await step(id, { organizationId });
		}
		await step(
			'webhooks.getInitializationStatus',
			{ organizationId },
			/Daytona 404: Webhook initialization status not found/,
		);
		for (const id of [
			'analytics.usage.aggregated',
			'analytics.usage.bySandbox',
			'analytics.usage.chart',
		]) {
			await step(id, { organizationId, ...window() });
		}
		const secret = await step('secrets.create', {
			name: `CORSAIR_TEST_${Date.now()}`,
			value: 'x',
			description: 'Corsair plugin live test, deleted at the end',
		});
		if (secret) {
			const secretId = field(secret, 'id');
			cleanups.push({
				what: 'secret',
				run: () => op('secrets.delete')({ secretId }),
			});
			await step('secrets.get', { secretId });
			await step('secrets.update', { secretId, value: 'y' });
			await step('secrets.delete', { secretId });
		}
	});

	it('runs a sandbox end to end', async () => {
		const created = await step('sandboxes.create', {
			name: NAME,
			autoStopInterval: 15,
			labels: { corsair: 'plugin-test' },
		});
		const id = field(created, 'id');
		cleanups.push({
			what: 'sandbox',
			run: () => op('sandboxes.delete')({ sandboxIdOrName: id }),
		});
		await waitFor(id, (state) => state === 'started');
		await step('sandboxes.get', { sandboxIdOrName: id });
		await step('sandboxes.replaceLabels', {
			sandboxIdOrName: id,
			labels: { corsair: 'updated' },
		});
		await step('sandboxes.setAutostopInterval', {
			sandboxIdOrName: id,
			interval: 10,
		});
		await step('sandboxes.getToolboxProxyUrl', { sandboxId: id });
		await step('sandboxes.getPortPreviewUrl', {
			sandboxIdOrName: id,
			port: 3000,
		});
		await step('toolbox.info.getVersion', { sandbox_id: id });
		await step('toolbox.info.getUserHomeDir', { sandbox_id: id });
		await step('toolbox.info.getWorkDir', { sandbox_id: id });
		await step('toolbox.process.executeCommand', {
			sandbox_id: id,
			command: 'uname -sr',
			timeout: 30,
		});
		await step('toolbox.process.codeRun', {
			sandbox_id: id,
			language: 'python',
			code: 'print(6 * 7)',
		});
		await step('toolbox.files.upload', {
			sandbox_id: id,
			path: '/home/daytona/corsair.txt',
			file: { base64: 'aGVsbG8gZnJvbSBDb3JzYWly', filename: 'corsair.txt' },
		});
		await step('toolbox.files.list', { sandbox_id: id, path: '/home/daytona' });
		await step('toolbox.files.search', {
			sandbox_id: id,
			path: '/home/daytona',
			pattern: '*.txt',
		});
		await step('toolbox.files.download', {
			sandbox_id: id,
			path: '/home/daytona/corsair.txt',
		});
		await step('toolbox.files.delete', {
			sandbox_id: id,
			path: '/home/daytona/corsair.txt',
		});
		const repo = '/home/daytona/hello';
		await step('toolbox.git.cloneRepository', {
			sandbox_id: id,
			url: 'https://github.com/octocat/Hello-World.git',
			path: repo,
		});
		await step('toolbox.git.getStatus', { sandbox_id: id, path: repo });
		await step('toolbox.git.listBranches', { sandbox_id: id, path: repo });
		await step('toolbox.git.getCommitHistory', { sandbox_id: id, path: repo });
		await step('toolbox.git.createBranch', {
			sandbox_id: id,
			path: repo,
			name: 'corsair-test',
		});
		await step('toolbox.process.createSession', {
			sandbox_id: id,
			sessionId: 'corsair',
		});
		const ran = await step('toolbox.process.sessionExecuteCommand', {
			sandbox_id: id,
			sessionId: 'corsair',
			command: 'echo session-ok',
		});
		const commandId = (ran as { cmdId?: string } | undefined)?.cmdId;
		if (commandId) {
			await step('toolbox.process.getSessionCommand', {
				sandbox_id: id,
				sessionId: 'corsair',
				commandId,
			});
			await step('toolbox.process.getSessionCommandLogs', {
				sandbox_id: id,
				sessionId: 'corsair',
				commandId,
			});
		}
		await step('toolbox.process.getSession', {
			sandbox_id: id,
			sessionId: 'corsair',
		});
		await step('toolbox.process.listSessions', { sandbox_id: id });
		await step('toolbox.process.deleteSession', {
			sandbox_id: id,
			sessionId: 'corsair',
		});
		await step('toolbox.ports.get', { sandbox_id: id });
		await step('toolbox.system.getSystemMetrics', { sandbox_id: id });
		// Cloud serves sandbox telemetry from the Analytics API only.
		const analyticsOnly =
			/Daytona 403: Telemetry endpoints are disabled when Analytics API is configured/;
		await step(
			'sandboxes.getLogs',
			{ sandboxId: id, ...window() },
			analyticsOnly,
		);
		await step(
			'sandboxes.getMetrics',
			{ sandboxId: id, ...window() },
			analyticsOnly,
		);
		for (const telemetry of [
			'analytics.telemetry.logs',
			'analytics.telemetry.metrics',
			'analytics.telemetry.traces',
		]) {
			await step(telemetry, { organizationId, sandboxId: id, ...window() });
		}
		await step('analytics.usage.sandbox', {
			organizationId,
			sandboxId: id,
			...window(),
		});
		await step('sandboxes.stop', { sandboxIdOrName: id });
		// Delete answers 409 "Sandbox state change in progress" until the stop
		// is done.
		await waitFor(id, (state) => state === 'stopped');
		await step('sandboxes.delete', { sandboxIdOrName: id });
		await waitFor(id, (state) => state === 'destroyed');
	});
});
