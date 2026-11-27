import { writeFileSync } from 'node:fs';
import { createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { instaboxOperations } from './endpoints/manifest';
import { instabox } from './index';

/**
 * Live run against an InstaBox workspace. Skipped unless INSTABOX_API_KEY is
 * set (CI never runs files named api.test.ts):
 *
 *   INSTABOX_API_KEY=ibk_... npx jest api.test.ts
 *
 * Reads every GET that takes no arguments and every org read, then runs one
 * free-plan machine end to end (exec, files, history, metrics, snapshot,
 * stop, delete) and a webhook endpoint pointed at example.com. Everything
 * created is deleted at the end, even when a step fails. The free plan allows
 * one machine; a run uses a few minutes of it.
 *
 * Never run here: billing, checkout and top-ups, invites, support replies,
 * feedback and key changes. INSTABOX_LIVE_REPORT=<file> writes each step's
 * outcome as JSON.
 */
const key = process.env.INSTABOX_API_KEY;
const describeIfKey = key ? describe : describe.skip;
if (!key) console.warn('Skipping InstaBox live run: set INSTABOX_API_KEY.');

const NAME = `corsair-test-${Date.now()}`;

const NO_ARGUMENT_READS = instaboxOperations
	.filter(
		(op) =>
			op.method === 'GET' &&
			((op.input.required as string[] | undefined) ?? []).length === 0,
	)
	.map((op) => op.id);

async function createClient() {
	const testDb = createTestDatabase();
	await createIntegrationAndAccount(testDb.db, 'instabox', 'default');
	const corsair = createCorsair({
		plugins: [instabox({ key })],
		database: testDb.db,
		kek: process.env.CORSAIR_KEK ?? '0123456789abcdef0123456789abcdef',
	});
	return { corsair, testDb };
}

// `unknown` because a step's result is any parsed response.
type Step = { id: string; ok: boolean; note?: string };

// `unknown` because the value is any parsed response.
function field(value: unknown, ...path: string[]): string {
	let current = value;
	for (const name of path) {
		current =
			typeof current === 'object' && current !== null
				? (current as Record<string, unknown>)[name]
				: undefined;
	}
	if (typeof current !== 'string' && typeof current !== 'number') {
		throw new Error(`response has no ${path.join('.')}`);
	}
	return String(current);
}

const sleep = (ms: number) => new Promise((done) => setTimeout(done, ms));

describeIfKey('instabox live', () => {
	jest.setTimeout(900_000);

	let client: Awaited<ReturnType<typeof createClient>> | undefined;
	// `unknown` because each operation takes its own input.
	type AnyOp = (input: unknown) => Promise<unknown>;
	const op = (id: string): AnyOp => {
		// `unknown` because the walk goes through nested groups of endpoints.
		let node: unknown = (client as NonNullable<typeof client>).corsair.instabox
			.api;
		for (const part of id.split('.')) {
			node = (node as Record<string, unknown>)[part];
		}
		return node as AnyOp;
	};
	const steps: Step[] = [];
	const cleanups: Array<{ what: string; run: () => Promise<unknown> }> = [];
	const cleanup = (what: string, run: () => Promise<unknown>) =>
		cleanups.push({ what, run });

	// `unknown` because each operation takes and returns its own shapes.
	async function step(id: string, input: unknown = {}): Promise<unknown> {
		try {
			const value = await op(id)(input);
			steps.push({ id, ok: true });
			return value;
		} catch (error) {
			steps.push({
				id,
				ok: false,
				note: (error as Error).message.slice(0, 200),
			});
			return undefined;
		}
	}

	/** Waits until the operation is done (or failed). */
	async function settle(operation: unknown) {
		if (!operation) return;
		const id = field(operation, 'id');
		for (let i = 0; i < 60; i++) {
			const current = await op('operations.get')({ id });
			const state = field(current, 'status');
			if (state !== 'pending' && state !== 'running') return;
			await sleep(3000);
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
				if (!/InstaBox 404/.test((error as Error).message)) {
					left.push(`${item.what}: ${(error as Error).message}`);
				}
			}
		}
		await client?.testDb.cleanup?.();
		if (left.length > 0) {
			console.warn(`InstaBox records left behind:\n${left.join('\n')}`);
		}
		const report = process.env.INSTABOX_LIVE_REPORT;
		if (report) writeFileSync(report, JSON.stringify(steps, null, 2));
		const failed = steps.filter((s) => !s.ok);
		console.log(
			`InstaBox live: ${steps.length - failed.length}/${steps.length} ok\n${failed
				.map((s) => `  ${s.id}: ${s.note}`)
				.join('\n')}`,
		);
	});

	it('reads every GET that takes no arguments, and the workspace', async () => {
		for (const id of NO_ARGUMENT_READS) await step(id);
		const orgs = await step('orgs.list');
		const list = Array.isArray(orgs)
			? orgs
			: ((orgs as { orgs?: unknown[] } | undefined)?.orgs ?? []);
		const orgId = field(list[0], 'id');
		for (const id of [
			'orgs.get',
			'orgs.members.list',
			'orgs.secrets.list',
			'orgs.webhooks.list',
			'orgs.exports.list',
			'orgs.github.jobs.list',
			'orgs.github.stats',
		]) {
			await step(id, { id: orgId });
		}
		const hook = await step('orgs.webhooks.create', {
			id: orgId,
			url: 'https://example.com/corsair-plugin-test/instabox',
			events: ['sandbox.error'],
			enabled: false,
		});
		if (hook) {
			const webhookId = field(hook, 'id');
			cleanup('webhook', () =>
				op('orgs.webhooks.delete')({ id: orgId, webhookId }),
			);
			await step('orgs.webhooks.get', { id: orgId, webhookId });
			await step('orgs.webhooks.update', {
				id: orgId,
				webhookId,
				events: ['sandbox.error', 'sandbox.stopped'],
			});
			await step('orgs.webhooks.deliveries.list', { id: orgId, webhookId });
			await step('orgs.webhooks.delete', { id: orgId, webhookId });
		}
	});

	it('runs a machine end to end', async () => {
		const created = await step('machines.create', {
			name: NAME,
			templateId: 'agent-browser',
		});
		const id = field(created, 'machineId');
		cleanup('machine', () => op('machines.delete')({ id }));
		await settle(created);
		await step('machines.get', { id });
		await step('machines.exec', {
			id,
			cmd: 'uname -sr && nproc',
			timeoutSeconds: 60,
		});
		await step('machines.exec', { id, argv: ['printf', '%s|', 'a b', '$X'] });
		await step('machines.files.write', {
			id,
			path: '/data/home/corsair.txt',
			content: 'hello from Corsair',
		});
		await step('machines.files.read', { id, path: '/data/home' });
		await step('machines.files.download', {
			id,
			path: '/data/home/corsair.txt',
		});
		await step('machines.history.list', { id });
		await step('machines.processes', { id });
		await step('machines.disk', { id });
		await step('machines.metrics', { id });
		await step('machines.logs', { id });
		await step('machines.usage', { id });
		await step('machines.connectionInfo', { id });
		await step('machines.ports.list', { id });
		await step('machines.secrets.get', { id });
		await settle(await step('machines.suspend', { id }));
		await settle(await step('machines.resume', { id }));
		await settle(await step('machines.stop', { id }));
		await settle(await step('machines.delete', { id }));
	});
});
