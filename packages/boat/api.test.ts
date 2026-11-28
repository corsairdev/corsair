import { generateKeyPairSync, randomUUID } from 'node:crypto';
import { writeFileSync } from 'node:fs';
import type { Server } from 'node:http';
import { createServer } from 'node:http';
import { createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { boatOperations } from './endpoints/manifest';
import { boat } from './index';
import type { BoatWebhookEventType } from './webhooks';
import { boatWebhooksNested } from './webhooks';

/**
 * Live run against a Boat account. Skipped unless BOAT_API_KEY is set (CI
 * never runs files named api.test.ts):
 *
 *   BOAT_API_KEY=boat_... npx jest api.test.ts
 *
 * BOAT_API_KEY should be a personal account key (account settings answer 403
 * to an organization key). Optional:
 * - BOAT_ORG_API_KEY: an organization key; checks what it may and may not do.
 * - BOAT_WEBHOOK_URL + BOAT_WEBHOOK_PORT: a public HTTPS URL (a tunnel) that
 *   forwards to this port. The run registers it as a webhook and checks the
 *   signature of every delivery with the plugin's webhook handlers.
 * - BOAT_LIVE_REPORT=<file>: each step's outcome as JSON.
 *
 * One small sandbox runs end to end (commands, files, ports, desktop,
 * network, SSH key, usage, stop, snapshots, saved snapshots and shares, a
 * fork, a resume), next to round trips of API keys, webhooks, telemetry,
 * credential profiles and environments. At most one sandbox of the run is
 * active at a time. Everything created is deleted at the end, even when a
 * step fails.
 *
 * Never run here: prompting or steering an agent with a connected model key
 * (that spends the account's model usage; the prompt goes to Mistral, which
 * has no key on the test account, and fails in the harness), turning the AI
 * proxy on (it bills per day), renaming an organization or switching the
 * active wallet, and CI repository settings.
 */
const key = process.env.BOAT_API_KEY;
const orgKey = process.env.BOAT_ORG_API_KEY;
const webhookUrl = process.env.BOAT_WEBHOOK_URL;
const webhookPort = Number(process.env.BOAT_WEBHOOK_PORT ?? 0);
const describeIfKey = key ? describe : describe.skip;
if (!key) console.warn('Skipping Boat live run: set BOAT_API_KEY.');

const STAMP = Date.now().toString(36);
const NAME = `corsair-test-${STAMP}`;

const NO_ARGUMENT_READS = boatOperations
	.filter(
		(op) =>
			op.method === 'GET' &&
			((op.input.required as string[] | undefined) ?? []).length === 0,
	)
	.map((op) => op.id);

async function createClient(apiKey: string) {
	const testDb = createTestDatabase();
	await createIntegrationAndAccount(testDb.db, 'boat', 'default');
	const corsair = createCorsair({
		plugins: [boat({ key: apiKey })],
		database: testDb.db,
		kek: process.env.CORSAIR_KEK ?? '0123456789abcdef0123456789abcdef',
	});
	return { corsair, testDb };
}

type Step = {
	id: string;
	ok: boolean;
	expected?: boolean;
	key?: 'org';
	note?: string;
};

// `unknown` because the value is any parsed response.
function pick(value: unknown, ...path: string[]): unknown {
	let node = value;
	for (const part of path) {
		node =
			typeof node === 'object' && node !== null
				? (node as Record<string, unknown>)[part]
				: undefined;
	}
	return node;
}

// `unknown` because the value is any parsed response.
function text(value: unknown, ...path: string[]): string {
	const found = pick(value, ...path);
	if (typeof found !== 'string' && typeof found !== 'number') {
		throw new Error(`response has no ${path.join('.')}`);
	}
	return String(found);
}

const sleep = (ms: number) => new Promise((done) => setTimeout(done, ms));

/** An OpenSSH ed25519 public key line, built from Node's raw key. */
function sshPublicKey(): string {
	const { publicKey } = generateKeyPairSync('ed25519');
	const raw = publicKey.export({ format: 'der', type: 'spki' }).subarray(-32);
	const part = (bytes: Buffer) => {
		const length = Buffer.alloc(4);
		length.writeUInt32BE(bytes.length);
		return Buffer.concat([length, bytes]);
	};
	const blob = Buffer.concat([part(Buffer.from('ssh-ed25519')), part(raw)]);
	return `ssh-ed25519 ${blob.toString('base64')} corsair-live-test`;
}

type Delivery = {
	event: string;
	headers: Record<string, string>;
	rawBody: string;
};

describeIfKey('boat live', () => {
	jest.setTimeout(1_800_000);

	let main: Awaited<ReturnType<typeof createClient>> | undefined;
	let org: Awaited<ReturnType<typeof createClient>> | undefined;
	// `unknown` because each operation takes its own input.
	type AnyOp = (input: unknown) => Promise<unknown>;
	const op = (id: string, which: 'main' | 'org' = 'main'): AnyOp => {
		const client = which === 'org' ? org : main;
		// `unknown` because the walk goes through nested groups of endpoints.
		let node: unknown = (client as NonNullable<typeof client>).corsair.boat.api;
		for (const part of id.split('.')) {
			node = (node as Record<string, unknown>)[part];
		}
		return node as AnyOp;
	};
	const steps: Step[] = [];
	const cleanups: Array<{ what: string; run: () => Promise<unknown> }> = [];
	const deliveries: Delivery[] = [];
	let server: Server | undefined;
	let webhookSecret = '';
	let webhookId = '';

	/**
	 * One call. `expected` is the error the step must answer with (a route
	 * the key may not use, a state Boat refuses); that error counts as a pass.
	 * `either` accepts success or that error (a call whose answer depends on
	 * the account, such as sharing a personal sandbox).
	 */
	async function step(
		id: string,
		input: unknown = {},
		expected?: RegExp,
		options: { which?: 'main' | 'org'; either?: boolean } = {},
	): Promise<unknown> {
		const which = options.which ?? 'main';
		try {
			const value = await op(id, which)(input);
			steps.push({
				id,
				ok: !expected || options.either === true,
				...(which === 'org' ? { key: 'org' as const } : {}),
				...(expected ? { note: 'no error' } : {}),
			});
			return value;
		} catch (error) {
			const note = (error as Error).message.slice(0, 240);
			const ok = expected?.test(note) ?? false;
			steps.push({
				id,
				ok,
				expected: ok,
				...(which === 'org' ? { key: 'org' as const } : {}),
				note,
			});
			return undefined;
		}
	}

	/** Polls a sandbox until its state is one of `states`; returns the state. */
	async function waitFor(id: string, states: string[], tries = 90) {
		let state = '';
		for (let i = 0; i < tries; i++) {
			try {
				state = text(
					await op('sandboxes.get')({ sandboxId: id }),
					'sandbox',
					'state',
				);
			} catch (error) {
				if (/Boat 404/.test((error as Error).message)) return 'gone';
				throw error;
			}
			if (states.includes(state)) return state;
			await sleep(3000);
		}
		return state;
	}

	const READY = ['ready', 'idle', 'running'];

	/**
	 * A command right after a fork or resume: Boat answers 502
	 * sandbox_restoring while the machine mounts its files (the command did not
	 * run) and asks for a retry after 1-3 s.
	 */
	async function runRestoring(sandboxId: string, command: string) {
		for (let attempt = 0; attempt < 20; attempt++) {
			try {
				const value = await op('sandboxes.commands.run')({
					sandboxId,
					command,
				});
				steps.push({
					id: 'sandboxes.commands.run',
					ok: true,
					...(attempt > 0
						? { note: `after ${attempt} sandbox_restoring answers` }
						: {}),
				});
				return value;
			} catch (error) {
				const message = (error as Error).message;
				if (/Boat 502: sandbox_restoring/.test(message)) {
					await sleep(2000);
					continue;
				}
				steps.push({
					id: 'sandboxes.commands.run',
					ok: false,
					note: message.slice(0, 240),
				});
				return undefined;
			}
		}
		steps.push({
			id: 'sandboxes.commands.run',
			ok: false,
			note: 'still restoring',
		});
		return undefined;
	}

	beforeAll(async () => {
		main = await createClient(key as string);
		if (orgKey) org = await createClient(orgKey);
		if (webhookUrl && webhookPort) {
			server = createServer((request, response) => {
				const chunks: Buffer[] = [];
				request.on('data', (chunk: Buffer) => chunks.push(chunk));
				request.on('end', () => {
					const headers: Record<string, string> = {};
					for (const [name, value] of Object.entries(request.headers)) {
						if (typeof value === 'string') headers[name] = value;
					}
					deliveries.push({
						event: headers['x-ascii-event'] ?? '',
						headers,
						rawBody: Buffer.concat(chunks).toString('utf8'),
					});
					response.writeHead(204).end();
				});
			});
			await new Promise<void>((done) => server?.listen(webhookPort, done));
		}
	});

	afterAll(async () => {
		const left: string[] = [];
		for (const item of cleanups.reverse()) {
			// A sandbox still starting or stopping answers 409: try again for a
			// minute and a half before reporting it left behind.
			for (let attempt = 0; ; attempt++) {
				try {
					await item.run();
					break;
				} catch (error) {
					const message = (error as Error).message;
					if (/Boat 404/.test(message)) break;
					if (/Boat 409/.test(message) && attempt < 30) {
						await sleep(3000);
						continue;
					}
					left.push(`${item.what}: ${message}`);
					break;
				}
			}
		}
		await new Promise((done) =>
			server ? server.close(done) : done(undefined),
		);
		await main?.testDb.cleanup?.();
		await org?.testDb.cleanup?.();
		if (left.length > 0) {
			console.warn(`Boat records left behind:\n${left.join('\n')}`);
		}
		const report = process.env.BOAT_LIVE_REPORT;
		if (report) {
			writeFileSync(
				report,
				JSON.stringify(
					{ steps, webhooks: deliveries.map((d) => d.event), left },
					null,
					2,
				),
			);
		}
		const failed = steps.filter((s) => !s.ok);
		const expectedErrors = steps.filter((s) => s.expected).length;
		const distinct = new Set(steps.map((s) => s.id)).size;
		console.log(
			`Boat live: ${steps.length - failed.length}/${steps.length} ok (${expectedErrors} expected errors, ${distinct} operations)\n${failed
				.map((s) => `  ${s.id}${s.key ? ' [org key]' : ''}: ${s.note}`)
				.join('\n')}`,
		);
		// After cleanup and the report, so a failed step fails the run.
		if (failed.length > 0 || left.length > 0) {
			throw new Error(
				`${failed.length} Boat live steps failed, ${left.length} records left`,
			);
		}
	});

	it('reads every GET that takes no arguments', async () => {
		for (const id of NO_ARGUMENT_READS) await step(id);
	});

	it('an organization key works on sandboxes but not on account settings', async () => {
		if (!org) return;
		for (const id of [
			'account.getLimits',
			'orgs.list',
			'environments.list',
			'sandboxes.list',
			'snapshots.list',
			'savedSnapshots.list',
		]) {
			await step(id, {}, undefined, { which: 'org' });
		}
		const forbidden = /Boat 403: An organization API key/;
		for (const id of [
			'account.getCallerAddress',
			'account.getDataRetention',
			'apiKeys.list',
			'webhooks.list',
			'telemetry.get',
			'ci.getOverview',
			'credentialProfiles.list',
			'aiProxy.get',
			'aiProxy.getUsage',
			'secrets.get',
			'repos.list',
		]) {
			await step(id, {}, forbidden, { which: 'org' });
		}
		// The organization has no plan or wallet on the trial: a start is refused
		// (and a refused start costs nothing). Should it ever start, delete it.
		const created = await step(
			'sandboxes.create',
			{ type: 'small', ttlSeconds: 300, name: `${NAME}-org` },
			/Boat 40[23]/,
			{ which: 'org' },
		);
		const stray = pick(created, 'sandbox', 'id');
		if (typeof stray === 'string') {
			cleanups.push({
				what: `org sandbox ${stray}`,
				run: () =>
					op('sandboxes.delete', 'org')({ sandboxId: stray, confirm: stray }),
			});
		}
	});

	it('creates, uses, rotates and revokes a scoped API key', async () => {
		const created = await step('apiKeys.createScoped', {
			name: `${NAME}-key`,
			ttl: '1h',
			preset: 'read-only',
		});
		const id = pick(created, 'apiKey', 'id');
		if (typeof id !== 'string') return;
		cleanups.push({
			what: `API key ${id}`,
			run: () => op('apiKeys.revoke')({ apiKeyId: id }),
		});
		await step('apiKeys.getUsage', { apiKeyId: id });
		await step('apiKeys.rotate', { apiKeyId: id });
		await step('apiKeys.revoke', { apiKeyId: id });
	});

	it('registers a webhook, edits it and rotates its secret', async () => {
		const created = await step('webhooks.create', {
			name: `${NAME}-hook`,
			url: webhookUrl ?? 'https://example.com/corsair-boat-live-test',
			events: [
				'sandbox.ready',
				'sandbox.error',
				'sandbox.archived',
				'sandbox.hydrated',
				'sandbox.degraded',
				'sandbox.recovered',
			],
		});
		const id = pick(created, 'webhook', 'id');
		if (typeof id !== 'string') return;
		webhookId = id;
		cleanups.push({
			what: `webhook ${id}`,
			run: () => op('webhooks.delete')({ webhookId: id }),
		});
		await step('webhooks.get', { webhookId: id });
		await step('webhooks.update', { webhookId: id, name: `${NAME}-hook-2` });
		const rotated = await step('webhooks.rotateSecret', { webhookId: id });
		webhookSecret = String(
			pick(rotated, 'secret') ?? pick(created, 'secret') ?? '',
		);
	});

	it('sends the AI proxy and data-retention switches the value they have', async () => {
		// Both are off on the test account; sending off again changes nothing
		// (and the proxy bills only while on). Skipped when either is on.
		const proxy = await step('aiProxy.get');
		if (pick(proxy, 'enabled') === false) {
			await step('aiProxy.update', { enabled: false });
		}
		const retention = await step('account.getDataRetention');
		if (pick(retention, 'enabled') === false) {
			// Boat documents that API keys are refused here.
			await step(
				'account.updateDataRetention',
				{ enabled: false },
				/Boat 403/,
				{
					either: true,
				},
			);
		}
	});

	it('sets and removes an OpenTelemetry export when none is set', async () => {
		const current = await step('telemetry.get');
		if (pick(current, 'telemetry') !== null) return;
		await step('telemetry.set', {
			endpoint: 'https://example.com',
			headers: { 'x-corsair-test': 'yes' },
		});
		await step('telemetry.get');
		await step('telemetry.delete');
	});

	it('round-trips a credential profile with test values', async () => {
		const created = await step('credentialProfiles.create', {
			name: `${NAME}-profile`,
		});
		const profile = pick(created, 'profile', 'id');
		if (typeof profile !== 'string') return;
		cleanups.push({
			what: `credential profile ${profile}`,
			run: () => op('credentialProfiles.delete')({ profile }),
		});
		await step('credentialProfiles.update', {
			profile,
			name: `${NAME}-profile-2`,
		});
		const credential = 'openrouter-api-key';
		await step('credentialProfiles.setKey', {
			profile,
			credential,
			value: 'sk-or-v1-corsair-live-test-not-a-real-key-0001',
		});
		await step('credentialProfiles.accounts.add', {
			profile,
			credential,
			value: 'sk-or-v1-corsair-live-test-not-a-real-key-0002',
		});
		const listed = await step('credentialProfiles.accounts.list', {
			profile,
			credential,
		});
		const accounts = pick(listed, 'accounts');
		const ids = Array.isArray(accounts)
			? accounts
					.map((a) => pick(a, 'id') ?? pick(a, 'account'))
					.filter((a): a is string => typeof a === 'string')
			: [];
		const active = Array.isArray(accounts)
			? accounts.find((a) => pick(a, 'active') === true)
			: undefined;
		const other = ids.find(
			(a) => a !== (pick(active, 'id') ?? pick(active, 'account')),
		);
		if (other) {
			await step('credentialProfiles.accounts.switch', {
				profile,
				credential,
				account: other,
			});
			const spare = ids.find((a) => a !== other);
			if (spare) {
				await step('credentialProfiles.accounts.delete', {
					profile,
					credential,
					account: spare,
				});
			}
		}
		await step('credentialProfiles.deleteKey', { profile, credential });
		await step('credentialProfiles.customApis.set', {
			profile,
			name: 'CORSAIR_TEST_KEY',
			value: 'corsair-live-test-value',
			baseUrl: 'https://api.example.com',
		});
		await step('credentialProfiles.customApis.delete', {
			profile,
			name: 'CORSAIR_TEST_KEY',
		});
		await step('credentialProfiles.delete', { profile });
	});

	it('round-trips an environment, and rewrites the secrets setup as it is', async () => {
		const created = await step('environments.create', { name: `${NAME}-env` });
		const environments = pick(created, 'environments');
		const environment = Array.isArray(environments)
			? environments.find((e) => pick(e, 'name') === `${NAME}-env`)
			: undefined;
		const environmentId = pick(environment, 'id');
		if (typeof environmentId === 'string') {
			cleanups.push({
				what: `environment ${environmentId}`,
				run: () => op('environments.delete')({ environmentId }),
			});
			await step('environments.setVar', {
				environmentId,
				key: 'CORSAIR_TEST',
				value: 'live',
			});
			await step('environments.setSecretFile', {
				environmentId,
				path: '.corsair-test.env',
				contents: 'CORSAIR_TEST=live\n',
			});
			await step('environments.update', {
				environmentId,
				name: `${NAME}-env-2`,
			});
			await step('environments.upgradeSandboxes', { environmentId });
			await step('environments.deleteVar', {
				environmentId,
				key: 'CORSAIR_TEST',
			});
			await step('environments.deleteSecretFile', {
				environmentId,
				path: '.corsair-test.env',
			});
			// No GitHub app is installed on the test account.
			await step(
				'environments.addRepo',
				{ environmentId, repositoryId: '1' },
				/Boat 4\d\d/,
			);
			await step(
				'environments.deleteRepo',
				{ environmentId, repositoryId: '1' },
				/Boat 4\d\d/,
				{ either: true },
			);
			await step('environments.delete', { environmentId });
		}
		const secrets = await step('secrets.get');
		if (secrets) {
			await step('secrets.update', {
				envContents: pick(secrets, 'envContents') ?? '',
				secretFiles: pick(secrets, 'secretFiles') ?? [],
			});
		}
	});

	it('reads CI and repository routes without changing them', async () => {
		await step('ci.connectGithub', {});
		// No GitHub app is installed: there is no repository to select.
		await step('repos.select', { repositoryId: '1' }, /Boat 4\d\d/);
		await step(
			'ci.setPublicRepos',
			{
				account: 'corsair-live-test-no-such-account',
				allow: false,
				dryRun: true,
			},
			/Boat 4\d\d/,
		);
		await step('ci.getJob', { jobId: 'job_corsairlivetest' }, /Boat 4\d\d/);
		await step('ci.getJobLog', { jobId: 'job_corsairlivetest' }, /Boat 4\d\d/);
		await step(
			'deletionOperations.get',
			{ operationId: 'bdop_0123456789abcdef0123456789abcdef' },
			/Boat 404/,
		);
	});

	let sandboxId = '';

	it('runs one small sandbox end to end', async () => {
		const created = await step('sandboxes.create', {
			type: 'small',
			ttlSeconds: 1800,
			name: NAME,
			labels: { corsair: 'live-test' },
			noEnv: true,
			idempotencyKey: randomUUID(),
		});
		const id = pick(created, 'sandbox', 'id');
		if (typeof id !== 'string') return;
		sandboxId = id;
		cleanups.push({
			what: `sandbox ${id}`,
			run: () => op('sandboxes.delete')({ sandboxId: id, confirm: id }),
		});
		const state = await waitFor(id, READY);
		steps.push({ id: 'sandboxes.get', ok: READY.includes(state), note: state });
		await step('sandboxes.list', { label: ['corsair=live-test'], limit: 5 });
		await step('sandboxes.update', {
			sandboxId: id,
			labels: { corsair: 'live-test', step: 'updated' },
		});

		// Commands
		const ran = await step('sandboxes.commands.run', {
			sandboxId: id,
			command: 'echo hello from boat && uname -s',
			timeoutSeconds: 60,
		});
		if (!String(pick(ran, 'stdout') ?? '').includes('hello from boat')) {
			steps.push({
				id: 'sandboxes.commands.run',
				ok: false,
				note: 'stdout missing',
			});
		}
		const detached = await step('sandboxes.commands.run', {
			sandboxId: id,
			command: 'for i in 1 2 3; do echo tick $i; sleep 1; done',
			detached: true,
		});
		const processId = pick(detached, 'processId');
		if (typeof processId === 'number') {
			await step('sandboxes.commands.attach', { sandboxId: id, processId });
			await step('sandboxes.commands.getStatus', { sandboxId: id, processId });
		}
		const long = await step('sandboxes.commands.run', {
			sandboxId: id,
			command: 'sleep 300',
			detached: true,
		});
		const longId = pick(long, 'processId');
		await step('sandboxes.listProcesses', { sandboxId: id });
		if (typeof longId === 'number') {
			await step('sandboxes.commands.stop', {
				sandboxId: id,
				processId: longId,
			});
		}
		const history = await step('sandboxes.commands.listHistory', {
			sandboxId: id,
			limit: 10,
		});
		const first = pick(history, 'commands');
		const commandId = Array.isArray(first)
			? (pick(first[first.length - 1], 'id') ??
				pick(first[first.length - 1], 'commandId'))
			: pick(ran, 'commandId');
		if (typeof commandId === 'string') {
			await step('sandboxes.commands.get', { sandboxId: id, commandId });
			await step('sandboxes.commands.getLogs', { sandboxId: id, commandId });
		}

		// Files
		await step('sandboxes.files.createFolder', {
			sandboxId: id,
			path: 'corsair',
		});
		await step('sandboxes.files.write', {
			sandboxId: id,
			path: 'corsair/hello.txt',
			content: 'hello boat\n',
		});
		await step('sandboxes.files.write', {
			sandboxId: id,
			path: 'keep.txt',
			content: 'kept across stop and resume\n',
		});
		await step('sandboxes.files.read', {
			sandboxId: id,
			path: 'corsair/hello.txt',
		});
		await step('sandboxes.files.getInfo', {
			sandboxId: id,
			path: 'corsair/hello.txt',
		});
		await step('sandboxes.files.list', { sandboxId: id, path: 'corsair' });
		await step('sandboxes.files.search', {
			sandboxId: id,
			path: 'corsair',
			pattern: 'hello',
		});
		await step('sandboxes.files.find', {
			sandboxId: id,
			path: 'corsair',
			pattern: 'boat',
		});
		await step('sandboxes.files.setPermissions', {
			sandboxId: id,
			path: 'corsair/hello.txt',
			mode: '600',
		});
		await step('sandboxes.files.move', {
			sandboxId: id,
			source: 'corsair/hello.txt',
			destination: 'corsair/moved.txt',
		});
		await step('sandboxes.files.replace', {
			sandboxId: id,
			paths: ['corsair/moved.txt'],
			pattern: 'boat',
			newValue: 'Boat',
		});
		await step('sandboxes.files.createDownloadUrl', {
			sandboxId: id,
			path: 'corsair/moved.txt',
			ttlSeconds: 60,
		});
		await step('sandboxes.files.createUploadUrl', {
			sandboxId: id,
			path: 'corsair/upload.txt',
			ttlSeconds: 60,
		});
		await step('sandboxes.downloadArtifact', {
			sandboxId: id,
			path: '/home/user/corsair/moved.txt',
		});
		await step('sandboxes.files.delete', {
			sandboxId: id,
			path: 'corsair',
			recursive: true,
		});

		// Access, network and usage
		await step('sandboxes.hostPort', {
			sandboxId: id,
			port: 8080,
			title: 'corsair test',
		});
		await step('sandboxes.getDesktopUrl', { sandboxId: id });
		await step('sandboxes.getNetworkPolicy', {
			sandboxId: id,
			include: ['inboundAllow', 'access'],
		});
		await step('sandboxes.setNetworkPolicy', { sandboxId: id, mode: 'open' });
		await step('sandboxes.setNetworkPolicy', {
			sandboxId: id,
			mode: 'environment',
		});
		await step('sandboxes.addSshKey', { sandboxId: id, key: sshPublicKey() });
		await step('sandboxes.getUsage', { sandboxId: id });
		await step('sandboxes.getAiUsage', { sandboxId: id });
		await step('sandboxes.setAiAccess', { sandboxId: id, blocked: true });
		await step('sandboxes.setAiAccess', { sandboxId: id, blocked: false });
		// A personal sandbox has no organization to share with.
		await step('sandboxes.share', { sandboxId: id }, /Boat 4\d\d/, {
			either: true,
		});
		await step('sandboxes.unshare', { sandboxId: id }, /Boat 4\d\d/, {
			either: true,
		});

		// Integrated agents: read-only, plus a prompt to a provider with no key.
		await step('sandboxes.agent.listConversations', { sandboxId: id });
		await step('sandboxes.agent.listEvents', { sandboxId: id, limit: 5 });
		// Mistral has no key or sign-in on the test account, so nothing can bill
		// a model: Boat queues the run and the harness fails without one.
		const prompted = await step(
			'sandboxes.agent.prompt',
			{ sandboxId: id, provider: 'mistral', prompt: 'Say hi.', new: true },
			/Boat 409/,
			{ either: true },
		);
		const promptId =
			pick(prompted, 'promptId') ??
			pick(prompted, 'promptRun', 'id') ??
			pick(prompted, 'id');
		const conversation = pick(prompted, 'conversationId');
		if (typeof promptId === 'string') {
			await sleep(10_000);
			const run = await step('sandboxes.agent.getPrompt', {
				sandboxId: id,
				promptId,
			});
			steps.push({
				id: 'prompt run outcome',
				ok: true,
				note: JSON.stringify({
					status: pick(run, 'promptRun', 'status'),
					error: pick(run, 'promptRun', 'error'),
				}).slice(0, 200),
			});
		} else {
			await step(
				'sandboxes.agent.getPrompt',
				{ sandboxId: id, promptId: 'prompt_corsairlivetest' },
				/Boat 404/,
			);
		}
		await step('sandboxes.agent.listEvents', { sandboxId: id, limit: 20 });
		await step(
			'sandboxes.agent.steer',
			{
				sandboxId: id,
				message: 'Stop here.',
				...(typeof conversation === 'string' ? { conversation } : {}),
			},
			/Boat 4\d\d/,
			{ either: true },
		);
		await step('sandboxes.agent.interrupt', { sandboxId: id });
		await step('sandboxes.recover', { sandboxId: id }, /Boat 409/);

		// Stop, then the snapshots it leaves.
		const stopped = await step('sandboxes.stop', { sandboxId: id });
		const stopId = pick(stopped, 'operation', 'id') ?? pick(stopped, 'id');
		if (typeof stopId === 'string') {
			await step('sandboxes.getStop', { sandboxId: id, stopId });
		}
		const archived = await waitFor(id, ['archived'], 120);
		steps.push({
			id: 'sandboxes.get',
			ok: archived === 'archived',
			note: archived,
		});
		await step('sandboxes.snapshots.list', { sandboxId: id });
		const latest = await step('sandboxes.snapshots.getLatest', {
			sandboxId: id,
		});
		const snapshotId = pick(latest, 'snapshot', 'id');
		if (typeof snapshotId === 'string') {
			await step('snapshots.getTree', { snapshotId });
			await step(
				'snapshots.getFile',
				{ snapshotId, path: 'keep.txt' },
				/Boat 4\d\d/,
				{
					either: true,
				},
			);
			await step('snapshots.getDownload', { snapshotId });
		}

		// Saved snapshots (and their older named-snapshot routes) need a paid
		// plan: the trial refuses the save, so the share routes have nothing to
		// act on and run against a name that does not exist.
		const trialOnly =
			/Boat 403: Saved snapshots are not available during the free trial/;
		const saved = `${NAME}-saved`;
		const made = await step(
			'savedSnapshots.save',
			{ sandboxId: id, name: saved },
			trialOnly,
		);
		if (made) {
			cleanups.push({
				what: `saved snapshot ${saved}`,
				run: () => op('savedSnapshots.delete')({ name: saved }),
			});
		}
		await step('savedSnapshots.list', { namePrefix: NAME });
		await step('savedSnapshots.get', { name: saved }, /Boat 404/);
		await step('savedSnapshots.shares.list', { name: saved }, /Boat 404/);
		await step('savedSnapshots.shares.create', { name: saved }, /Boat 404/);
		await step(
			'savedSnapshots.shares.revoke',
			{ name: saved, shareId: 'share_corsairlivetest' },
			/Boat 404/,
		);
		await step('savedSnapshots.delete', { name: saved }, /Boat 404/);
		const named = await step(
			'namedSnapshots.save',
			{ sandboxId: id, name: `${NAME}-named` },
			trialOnly,
		);
		if (named) {
			cleanups.push({
				what: 'named snapshot',
				run: () => op('namedSnapshots.delete')({ name: `${NAME}-named` }),
			});
		}
		await step('namedSnapshots.get', { name: `${NAME}-named` }, /Boat 404/);
		await step('namedSnapshots.delete', { name: `${NAME}-named` }, /Boat 404/);

		// A fork of the stopped sandbox: the only active one while it lives.
		const fork = await step('sandboxes.fork', {
			sandboxId: id,
			type: 'small',
			ttlSeconds: 600,
			noEnv: true,
			idempotencyKey: randomUUID(),
		});
		const forkId = pick(fork, 'sandbox', 'id') ?? pick(fork, 'id');
		if (typeof forkId === 'string' && forkId !== id) {
			cleanups.push({
				what: `fork ${forkId}`,
				run: () =>
					op('sandboxes.delete')({ sandboxId: forkId, confirm: forkId }),
			});
			const forkState = await waitFor(forkId, READY);
			const read = await runRestoring(forkId, 'cat keep.txt');
			steps.push({
				id: 'sandboxes.fork',
				ok:
					READY.includes(forkState) &&
					String(pick(read, 'stdout')).includes('kept'),
				note: forkState,
			});
			const removed = await step('sandboxes.delete', {
				sandboxId: forkId,
				confirm: forkId,
			});
			const operationId = pick(removed, 'operation', 'id');
			if (typeof operationId === 'string') {
				await step('deletionOperations.get', { operationId });
			}
			await waitFor(forkId, ['deleted', 'gone'], 40);
		}

		// Resume the original and read the file kept on its disk.
		await step('sandboxes.resume', { sandboxId: id, ttlSeconds: 600 });
		const resumed = await waitFor(id, READY);
		const kept = await runRestoring(id, 'cat keep.txt');
		steps.push({
			id: 'sandboxes.resume',
			ok:
				READY.includes(resumed) &&
				String(pick(kept, 'stdout')).includes('kept'),
			note: resumed,
		});
		if (typeof snapshotId === 'string') {
			await step(
				'snapshots.delete',
				{ snapshotId, confirm: snapshotId },
				/Boat 4\d\d/,
				{
					either: true,
				},
			);
		}
		await step(
			'sandboxes.snapshots.deleteAll',
			{ sandboxId: id, confirm: id },
			/Boat 4\d\d/,
			{
				either: true,
			},
		);
		await step('sandboxes.delete', { sandboxId: id, confirm: id });
	});

	it('verifies every webhook delivery with the plugin', async () => {
		if (!server || !webhookSecret) return;
		// Deliveries can trail the state change by a few seconds.
		await sleep(15_000);
		const ctx = { key: webhookSecret } as never;
		for (const delivery of deliveries) {
			const event = delivery.event.replace(/^sandbox\./, '') as
				| 'ready'
				| 'error'
				| 'archived'
				| 'hydrated'
				| 'degraded'
				| 'recovered';
			const hook = boatWebhooksNested.sandboxes[event];
			const request = {
				headers: delivery.headers,
				body: JSON.parse(delivery.rawBody),
				rawBody: delivery.rawBody,
			} as never;
			const matched = hook?.match(request) === true;
			const result = matched ? await hook.handler(ctx, request) : undefined;
			steps.push({
				id: `webhook ${delivery.event as BoatWebhookEventType}`,
				ok: matched && (result as { success?: boolean })?.success === true,
				note: matched ? JSON.stringify(result).slice(0, 120) : 'no match',
			});
		}
		steps.push({
			id: 'webhook deliveries',
			ok: deliveries.length > 0,
			note: `${deliveries.length} received`,
		});
	});

	it('deletes the webhook', async () => {
		if (webhookId) await step('webhooks.delete', { webhookId });
	});
});
