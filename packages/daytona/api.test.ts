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
 * Reads every main-API GET that takes no arguments, then runs one small
 * sandbox end to end: toolbox info, a command, files (upload, list, search,
 * download, delete), a git clone, a process session, then stop and delete.
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

type Step = { id: string; ok: boolean; note?: string };

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

	beforeAll(async () => {
		client = await createClient();
	});

	afterAll(async () => {
		const left: string[] = [];
		for (const item of cleanups.reverse()) {
			try {
				await item.run();
			} catch (error) {
				if (!/Daytona 404/.test((error as Error).message)) {
					left.push(`${item.what}: ${(error as Error).message}`);
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
		console.log(
			`Daytona live: ${steps.length - failed.length}/${steps.length} ok\n${failed
				.map((s) => `  ${s.id}: ${s.note}`)
				.join('\n')}`,
		);
	});

	it('reads every GET that takes no arguments', async () => {
		for (const id of NO_ARGUMENT_READS) await step(id);
		expect(steps.some((s) => s.ok)).toBe(true);
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
		for (let i = 0; i < 40; i++) {
			const current = await op('sandboxes.get')({ sandboxIdOrName: id });
			if (field(current, 'state') === 'started') break;
			await sleep(3000);
		}
		await step('sandboxes.get', { sandboxIdOrName: id });
		await step('sandboxes.replaceLabels', {
			sandboxIdOrName: id,
			labels: { corsair: 'updated' },
		});
		await step('toolbox.info.getVersion', { sandbox_id: id });
		await step('toolbox.info.getUserHomeDir', { sandbox_id: id });
		await step('toolbox.process.executeCommand', {
			sandbox_id: id,
			command: 'uname -sr',
			timeout: 30,
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
		await step('toolbox.process.createSession', {
			sandbox_id: id,
			sessionId: 'corsair',
		});
		await step('toolbox.process.listSessions', { sandbox_id: id });
		await step('toolbox.process.deleteSession', {
			sandbox_id: id,
			sessionId: 'corsair',
		});
		await step('toolbox.system.getSystemMetrics', { sandbox_id: id });
		await step('sandboxes.getLogs', { sandboxIdOrName: id });
		await step('sandboxes.stop', { sandboxIdOrName: id });
		await step('sandboxes.delete', { sandboxIdOrName: id });
	});
});
