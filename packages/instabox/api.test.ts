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
 * Reads every GET that takes no arguments and every org read, runs a webhook
 * endpoint pointed at example.com, then runs one free-plan machine end to end
 * (exec, files, history, metrics, desktop, ports, SSH tokens, snapshot,
 * suspend, stop, start). Everything created is deleted at the end, even when
 * a step fails. The free plan allows one machine: set
 * INSTABOX_MACHINE_ID=m_... to run on a machine you already have (it is left
 * running and keeps its files). A personal org's key has no workspace:admin,
 * so the admin routes must answer 403 missing_scope there.
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
type Step = { id: string; ok: boolean; expected?: boolean; note?: string };

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
	// `expected` is the error a step must answer with (a plan limit, say);
	// that error counts as a pass.
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

	/** Waits until the operation is done (or failed). */
	async function settle(operation: unknown) {
		if (!operation) return;
		const id = field(operation, 'id');
		for (let i = 0; i < 60; i++) {
			const current = await op('operations.get')({ id });
			const state = field(current, 'state');
			if (state !== 'queued' && state !== 'running') return;
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
		const expectedErrors = steps.filter((s) => s.expected).length;
		console.log(
			`InstaBox live: ${steps.length - failed.length}/${steps.length} ok (${expectedErrors} expected errors)\n${failed
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
		const personal =
			(list[0] as { personal?: boolean } | undefined)?.personal === true;
		const adminOnly = personal ? /InstaBox 403: missing_scope/ : undefined;
		await step('orgs.invites.list', { id: orgId }, adminOnly);
		await step('orgs.inviteCode.get', { id: orgId }, adminOnly);
		if (personal) {
			await step(
				'orgs.secrets.set',
				{
					id: orgId,
					name: 'CORSAIR_TEST',
					value: 'x',
					delivery: 'env',
				},
				adminOnly,
			);
		}
		const hook = await step('orgs.webhooks.create', {
			id: orgId,
			url: 'https://example.com/corsair-plugin-test/instabox',
			events: ['sandbox.error'],
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
			await step('orgs.webhooks.test', { id: orgId, webhookId });
			await step('orgs.webhooks.rotate', { id: orgId, webhookId });
			await sleep(3000);
			const deliveries = await step('orgs.webhooks.deliveries.list', {
				id: orgId,
				webhookId,
			});
			const delivery = ((
				deliveries as { deliveries?: Array<{ id: string }> } | undefined
			)?.deliveries ?? [])[0];
			if (delivery) {
				await step('orgs.webhooks.deliveries.retry', {
					id: orgId,
					webhookId,
					deliveryId: delivery.id,
				});
			}
			await step('orgs.webhooks.delete', { id: orgId, webhookId });
		}
	});

	it('runs a machine end to end', async () => {
		// The free plan holds one machine. With INSTABOX_MACHINE_ID set, the run
		// uses that machine, checks that a second create is refused with the
		// plan's quota error, and leaves the machine running as it found it.
		const existing = process.env.INSTABOX_MACHINE_ID;
		let id: string;
		if (existing) {
			id = existing;
			await step(
				'machines.create',
				{ name: NAME, templateId: 'agent-browser' },
				/InstaBox 429: quota_exceeded/,
			);
		} else {
			const created = await step('machines.create', {
				name: NAME,
				templateId: 'agent-browser',
			});
			id = field(created, 'machineId');
			cleanup('machine', () => op('machines.delete')({ id }));
			await settle(created);
		}
		const machine = await step('machines.get', { id });
		if (field(machine, 'state') !== 'running') {
			await settle(await step('machines.start', { id }));
		}
		const dir = `/data/home/${NAME}`;
		const run = await step('machines.exec', {
			id,
			cmd: `uname -sr && nproc && mkdir -p ${dir}`,
			timeoutSeconds: 60,
		});
		await step('machines.exec', { id, argv: ['printf', '%s|', 'a b', '$X'] });
		await step('machines.files.write', {
			id,
			path: `${dir}/corsair.txt`,
			content: 'hello from Corsair',
		});
		await step('machines.files.read', { id, path: dir });
		await step('machines.files.download', { id, path: `${dir}/corsair.txt` });
		await step('machines.files.createUploadUrl', {
			id,
			path: `${dir}/upload.txt`,
			expiresInSeconds: 60,
		});
		const history = await step('machines.history.list', { id });
		const execs =
			(history as { executions?: unknown[]; items?: unknown[] } | undefined)
				?.executions ??
			(history as { items?: unknown[] } | undefined)?.items ??
			(Array.isArray(history) ? history : []);
		const execId = run
			? ((run as { execId?: string; id?: string }).execId ??
				(run as { id?: string }).id)
			: undefined;
		const firstExec =
			execId ??
			(execs[0] as { id?: string; execId?: string } | undefined)?.execId ??
			(execs[0] as { id?: string } | undefined)?.id;
		if (firstExec) {
			await step('machines.history.get', { id, execId: firstExec });
		}
		await step('machines.processes', { id });
		await step('machines.disk', { id });
		await step('machines.metrics', { id });
		await step('machines.logs', { id });
		await step('machines.usage', { id });
		await step('machines.connectionInfo', { id });
		await step('machines.secrets.get', { id });
		await step('machines.vault.get', { id });
		await step('machines.createAccess', { id, kind: 'terminal' });
		await step('machines.desktop.get', { id, action: 'status' });
		const link = await step('machines.desktop.createLink', {
			id,
			ttlSeconds: 60,
			viewOnly: true,
		});
		if (link) await step('machines.desktop.revokeLinks', { id });

		await step('machines.update', {
			id,
			metadata: { corsair_test: NAME },
		});
		await step('machines.update', { id, metadata: {} });

		await step('machines.activityLeases.renew', {
			id,
			leaseID: NAME,
			ttlSeconds: 60,
		});
		await step('machines.activityLeases.release', { id, leaseID: NAME });

		const port = await step('machines.ports.create', {
			id,
			port: 8080,
			access: 'private',
			name: 'corsair-test',
		});
		if (port) {
			cleanup('port', () => op('machines.ports.delete')({ id, port: 8080 }));
			await step('machines.ports.list', { id });
			await step('machines.ports.delete', { id, port: 8080 });
		}

		const token = await step('machines.ssh.createToken', {
			id,
			name: NAME,
			ttlSeconds: 300,
		});
		await step('machines.ssh.listTokens', { id });
		if (token) {
			const tokenID =
				(token as { id?: string; tokenId?: string }).id ??
				(token as { token?: { id?: string } }).token?.id;
			if (tokenID) {
				cleanup('ssh token', () =>
					op('machines.ssh.revokeToken')({ id, tokenID }),
				);
				await step('machines.ssh.revokeToken', { id, tokenID });
			}
		}

		// A live snapshot answers with the snapshot itself (202, status
		// pending), not an operation: wait on the snapshot.
		const snapshot = await step('machines.createSnapshot', {
			id,
			name: NAME,
			description: 'Corsair plugin live test, deleted at the end',
		});
		if (snapshot) {
			const snapId = field(snapshot, 'id');
			cleanup('snapshot', () => op('snapshots.delete')({ id: snapId }));
			for (let i = 0; i < 100; i++) {
				const current = await op('snapshots.get')({ id: snapId });
				if (field(current, 'status') !== 'pending') break;
				await sleep(3000);
			}
			await step('snapshots.list');
			await step('snapshots.get', { id: snapId });
			// Snapshot files reads the root disk only; /data answers
			// 400 data_disk_not_browsable.
			await step('snapshots.files.list', { id: snapId, path: '/etc' });
			await step('snapshots.delete', { id: snapId });
		}

		await step('machines.exec', { id, argv: ['rm', '-rf', dir] });
		await settle(await step('machines.suspend', { id }));
		await settle(await step('machines.resume', { id }));
		await settle(await step('machines.stop', { id }));
		await settle(await step('machines.start', { id }));
		if (!existing) await settle(await step('machines.delete', { id }));
	});
});
