import {
	createCipheriv,
	createHmac,
	createPublicKey,
	diffieHellman,
	generateKeyPairSync,
} from 'node:crypto';
import { writeFileSync } from 'node:fs';
import { createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { browserbase } from './index';

/**
 * Live run against a free Browserbase project. Skipped unless
 * BROWSERBASE_API_KEY is set (CI never runs files named api.test.ts).
 *
 *   BROWSERBASE_API_KEY=... npx jest api.test.ts
 *   (BROWSERBASE_LIVE_REPORT=<file> also writes one line per operation)
 *
 * Every step goes through createCorsair, so a pass means Browserbase answered
 * 2xx and the body matched the operation's output schema. Uses about a minute
 * of browser time: one session, released at the end of its step. Labels, a
 * context, a navigation policy, a webhook, a secret, an extension, a
 * certificate and an agent are made and deleted; cleanup runs even when a
 * step fails. Agent runs and function invocations are left out: they spend
 * model tokens or need deployed code.
 */
const key = process.env.BROWSERBASE_API_KEY;
const describeIfKey = key ? describe : describe.skip;
if (!key)
	console.warn('Skipping Browserbase live run: set BROWSERBASE_API_KEY.');

// `unknown` because each operation answers its own shape; steps read fields by name.
type Json = Record<string, unknown>;
const RUN = `corsair-live-${Date.now()}`;
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
/** Browserbase lists come back as a bare array or a `{ data: [...] }` page. */
const rows = (value: unknown): Json[] =>
	Array.isArray(value)
		? (value as Json[])
		: (((value as Json | undefined)?.data as Json[] | undefined) ?? []);

/** An empty Manifest V3 extension, zipped. */
const EXTENSION_ZIP =
	'UEsDBBQAAAAIAFpre12pcgwRWgAAAG0AAAANAAAAbWFuaWZlc3QuanNvbqtWyk3My0xLLS6JL0stKs7Mz1OyUjDWUVDKS8xNBTKVnPOLihMzixRyMstSFYpK85SAcgiVSoZ6BiCRlNTi5KLMghKoqGtuQUmlQgnQVIXUipLUPJBqPaVaAFBLAQIUAxQAAAAIAFpre12pcgwRWgAAAG0AAAANAAAAAAAAAAAAAACAAQAAAABtYW5pZmVzdC5qc29uUEsFBgAAAAABAAEAOwAAAIUAAAAAAA==';
/** A throwaway self-signed CA certificate (PEM, two-day validity, key discarded). */
const CA_PEM =
	'LS0tLS1CRUdJTiBDRVJUSUZJQ0FURS0tLS0tCk1JSUJtakNDQVVHZ0F3SUJBZ0lVUWVwSWp1a3FLaXZESTlURExBbXZuNlV3ZGxrd0NnWUlLb1pJemowRUF3SXcKSXpFaE1COEdBMVVFQXd3WVEyOXljMkZwY2lCc2FYWmxJSEoxYmlCMFpYTjBJRU5CTUI0WERUSTJNVEV5TnpBMwpOVFkxTTFvWERUSTJNVEV5T1RBM05UWTFNMW93SXpFaE1COEdBMVVFQXd3WVEyOXljMkZwY2lCc2FYWmxJSEoxCmJpQjBaWE4wSUVOQk1Ga3dFd1lIS29aSXpqMENBUVlJS29aSXpqMERBUWNEUWdBRTJpTGxEZjlXOW1hcXJiZjQKVm9WRlk5cW9ORUhONk9Zb0gxZWVLVUxqMCt1M1VUV0p4RjZzZmQyMkt5Z3Y4ZkpKWjVWREdBdjcrMlJzLzhpWApqNzdGTjZOVE1GRXdIUVlEVlIwT0JCWUVGRGZJOG9wajVuZXVQd0tiWWhVT3pzblM2c2ppTUI4R0ExVWRJd1FZCk1CYUFGRGZJOG9wajVuZXVQd0tiWWhVT3pzblM2c2ppTUE4R0ExVWRFd0VCL3dRRk1BTUJBZjh3Q2dZSUtvWkkKemowRUF3SURSd0F3UkFJZ0hDSU5lT1VBRlBVU29xc0VBU28vaEJCVHkyNVI2d1J3dkxLZjNqcUVYbTBDSUMwVApYNitVcjhxdGN1VXJGRUlDVmYxSkFTSldreFg2K0NWZ2Q4R3plNVNMCi0tLS0tRU5EIENFUlRJRklDQVRFLS0tLS0K';

/**
 * Seals a secret the way Browserbase asks: HPKE base mode (RFC 9180) with
 * DHKEM(X25519, HKDF-SHA256), HKDF-SHA256 and AES-256-GCM, empty info and
 * AAD, sent as base64(enc || ciphertext).
 */
function sealSecret(publicKeyBase64: string, plaintext: string): string {
	const hmac = (k: Buffer, data: Buffer) =>
		createHmac('sha256', k).update(data).digest();
	const i2osp = (n: number, len: number) => {
		const out = Buffer.alloc(len);
		out.writeUIntBE(n, 0, len);
		return out;
	};
	const expand = (prk: Buffer, info: Buffer, length: number) => {
		let t = Buffer.alloc(0);
		let okm = Buffer.alloc(0);
		for (let i = 1; okm.length < length; i++) {
			t = hmac(prk, Buffer.concat([t, info, Buffer.from([i])]));
			okm = Buffer.concat([okm, t]);
		}
		return okm.subarray(0, length);
	};
	const v1 = Buffer.from('HPKE-v1');
	const labeledExtract = (
		suite: Buffer,
		salt: Buffer,
		label: string,
		ikm: Buffer,
	) => hmac(salt, Buffer.concat([v1, suite, Buffer.from(label), ikm]));
	const labeledExpand = (
		suite: Buffer,
		prk: Buffer,
		label: string,
		info: Buffer,
		length: number,
	) =>
		expand(
			prk,
			Buffer.concat([i2osp(length, 2), v1, suite, Buffer.from(label), info]),
			length,
		);
	const empty = Buffer.alloc(0);
	const recipient = Buffer.from(publicKeyBase64, 'base64');
	const peer = createPublicKey({
		key: { kty: 'OKP', crv: 'X25519', x: recipient.toString('base64url') },
		format: 'jwk',
	});
	const ephemeral = generateKeyPairSync('x25519');
	const enc = Buffer.from(
		String(ephemeral.publicKey.export({ format: 'jwk' }).x),
		'base64url',
	);
	const dh = diffieHellman({
		privateKey: ephemeral.privateKey,
		publicKey: peer,
	});
	const kemSuite = Buffer.concat([Buffer.from('KEM'), i2osp(0x0020, 2)]);
	const eaePrk = labeledExtract(kemSuite, empty, 'eae_prk', dh);
	const shared = labeledExpand(
		kemSuite,
		eaePrk,
		'shared_secret',
		Buffer.concat([enc, recipient]),
		32,
	);
	const suite = Buffer.concat([
		Buffer.from('HPKE'),
		i2osp(0x0020, 2),
		i2osp(0x0001, 2),
		i2osp(0x0002, 2),
	]);
	const context = Buffer.concat([
		Buffer.from([0x00]),
		labeledExtract(suite, empty, 'psk_id_hash', empty),
		labeledExtract(suite, empty, 'info_hash', empty),
	]);
	const secret = labeledExtract(suite, shared, 'secret', empty);
	const aesKey = labeledExpand(suite, secret, 'key', context, 32);
	const nonce = labeledExpand(suite, secret, 'base_nonce', context, 12);
	const cipher = createCipheriv('aes-256-gcm', aesKey, nonce);
	const ciphertext = Buffer.concat([
		cipher.update(plaintext, 'utf8'),
		cipher.final(),
		cipher.getAuthTag(),
	]);
	return Buffer.concat([enc, ciphertext]).toString('base64');
}

/** Opens one page in the session over CDP (Node's own WebSocket), so it has a replay. */
async function openPage(connectUrl: string, url: string): Promise<boolean> {
	return await new Promise<boolean>((resolve) => {
		const socket = new WebSocket(connectUrl);
		const done = (ok: boolean) => {
			try {
				socket.close();
			} catch {
				/* already closed */
			}
			resolve(ok);
		};
		const timer = setTimeout(() => done(false), 30_000);
		socket.addEventListener('open', () => {
			socket.send(
				JSON.stringify({
					id: 1,
					method: 'Target.createTarget',
					params: { url },
				}),
			);
		});
		socket.addEventListener('message', (event) => {
			const message = JSON.parse(String(event.data)) as {
				id?: number;
				error?: unknown;
			};
			if (message.id === 1) {
				clearTimeout(timer);
				setTimeout(() => done(!message.error), 6_000);
			}
		});
		socket.addEventListener('error', () => {
			clearTimeout(timer);
			done(false);
		});
	});
}

async function createClient() {
	const testDb = createTestDatabase();
	await createIntegrationAndAccount(testDb.db, 'browserbase', 'default');
	const corsair = createCorsair({
		plugins: [browserbase({ key })],
		database: testDb.db,
		kek: process.env.CORSAIR_KEK ?? '0123456789abcdef0123456789abcdef',
	});
	return { corsair, testDb };
}

describeIfKey('browserbase live', () => {
	jest.setTimeout(300_000);
	let client: Awaited<ReturnType<typeof createClient>> | undefined;
	const report: Array<{ op: string; ok: boolean; note: string }> = [];
	const made: Record<string, string | undefined> = {};

	const call = async (op: string, args: Json = {}): Promise<Json> => {
		// `unknown` because the walk goes through the generated API object by name.
		let fn: unknown = (client as NonNullable<typeof client>).corsair.browserbase
			.api;
		for (const part of op.split('.')) {
			fn = (fn as Record<string, unknown>)[part];
		}
		return (await (fn as (input: Json) => Promise<unknown>)(args)) as Json;
	};
	/** Runs one operation and records it; a failure is recorded, not thrown. */
	const step = async (
		op: string,
		args: Json = {},
		note: (out: Json) => string = () => 'ok',
	): Promise<Json | undefined> => {
		try {
			const out = await call(op, args);
			report.push({ op, ok: true, note: note(out) });
			return out;
		} catch (error) {
			report.push({ op, ok: false, note: (error as Error).message });
			return undefined;
		}
	};
	/** An operation Browserbase refuses for a reason outside the plugin (plan, nothing to act on). */
	const refused = async (op: string, args: Json, status: RegExp) => {
		try {
			await call(op, args);
			report.push({ op, ok: true, note: 'ok (expected a refusal)' });
		} catch (error) {
			const message = (error as Error).message;
			report.push({
				op,
				ok: status.test(message),
				note: `refused as expected: ${message}`,
			});
		}
	};

	beforeAll(async () => {
		client = await createClient();
	});

	afterAll(async () => {
		if (client) {
			const undo: Array<[string, Json]> = [];
			if (made.session) {
				undo.push([
					'sessions.update',
					{ id: made.session, status: 'REQUEST_RELEASE' },
				]);
			}
			if (made.label) undo.push(['labels.delete', { labelId: made.label }]);
			if (made.context) undo.push(['contexts.delete', { id: made.context }]);
			if (made.policy)
				undo.push(['navigationPolicies.delete', { id: made.policy }]);
			if (made.webhook) undo.push(['webhooks.delete', { id: made.webhook }]);
			if (made.secret) undo.push(['secrets.delete', { id: made.secret }]);
			if (made.extension)
				undo.push(['extensions.delete', { id: made.extension }]);
			if (made.certificate)
				undo.push(['certificates.delete', { id: made.certificate }]);
			if (made.agent) undo.push(['agents.delete', { agentId: made.agent }]);
			for (const [op, args] of undo) {
				await call(op, args).catch((error) =>
					console.warn(`cleanup ${op}: ${(error as Error).message}`),
				);
			}
			await client.testDb.cleanup?.();
		}
		const file = process.env.BROWSERBASE_LIVE_REPORT;
		if (file) writeFileSync(file, JSON.stringify(report, null, 2));
		const passed = report.filter((r) => r.ok).length;
		console.log(
			`browserbase live: ${passed}/${report.length} steps ok\n${report
				.map((r) => `${r.ok ? 'ok  ' : 'FAIL'} ${r.op}: ${r.note}`)
				.join('\n')}`,
		);
	});

	it('projects, usage and lists', async () => {
		const projects = await step('projects.list');
		made.project = String(rows(projects)[0]?.id);
		await step('projects.get', { id: made.project });
		await step('projects.usage', { id: made.project });
		await step('sessions.list', {});
		await step('labels.list', {});
		await step('navigationPolicies.list');
		await step('webhooks.list', {});
		await step('secrets.list', {});
		await step('certificates.list');
		await step('functions.list', {});
		await step('functions.builds.list', {});
		await step('agents.list', {});
		await step('agents.runs.list', {});
	});

	it('fetch and search', async () => {
		await step('fetch.page', { url: 'https://example.com' });
		await step('fetch.page', {
			url: 'https://example.com',
			format: 'markdown',
		});
		await step('search.web', {
			query: 'Browserbase headless browser',
			numResults: 3,
		});
	});

	it('labels, context, navigation policy and webhook', async () => {
		const label = await step('labels.create', { name: RUN });
		if (label) {
			made.label = String(label.id);
			await step('labels.update', {
				labelId: made.label,
				name: `${RUN}-renamed`,
			});
			made.labelName = `${RUN}-renamed`;
		}
		const context = await step('contexts.create', { projectId: made.project });
		if (context) {
			made.context = String(context.id);
			await step('contexts.get', { id: made.context });
		}
		const policy = await step('navigationPolicies.create', { name: RUN });
		if (policy) {
			made.policy = String(policy.id);
			await step('navigationPolicies.get', { id: made.policy });
			await step('navigationPolicies.update', {
				id: made.policy,
				description: 'corsair live run',
			});
		}
		const webhook = await step('webhooks.create', {
			endpoint: 'https://example.com/corsair-live-webhook',
			eventTypes: ['functions.invocations.completed'],
		});
		if (webhook) {
			made.webhook = String(webhook.id);
			await step('webhooks.get', { id: made.webhook });
			await step('webhooks.update', {
				id: made.webhook,
				eventTypes: [
					'functions.invocations.completed',
					'functions.invocations.failed',
				],
			});
			await step('webhooks.rotateSecret', {
				id: made.webhook,
				revokeImmediately: true,
			});
			await step('webhooks.delete', { id: made.webhook });
			made.webhook = undefined;
		}
	});

	it('secret (sealed with HPKE), extension, certificate and agent', async () => {
		const keypair = await step('secrets.keypair');
		if (keypair?.publicKey && keypair.id) {
			const secret = await step('secrets.create', {
				secretKey: `CORSAIR_LIVE_${Date.now()}`,
				sealedSecretValue: sealSecret(
					String(keypair.publicKey),
					'not-a-real-secret',
				),
				keypairId: keypair.id,
			});
			if (secret) {
				made.secret = String(secret.id);
				await step('secrets.get', { id: made.secret });
				await step('secrets.update', {
					id: made.secret,
					sealedSecretValue: sealSecret(
						String(keypair.publicKey),
						'still-not-real',
					),
					keypairId: keypair.id,
				});
				await step('secrets.delete', { id: made.secret });
				made.secret = undefined;
			}
		}
		const extension = await step('extensions.upload', {
			file: {
				base64: EXTENSION_ZIP,
				filename: 'corsair-live.zip',
				contentType: 'application/zip',
			},
		});
		if (extension) {
			made.extension = String(extension.id);
			await step('extensions.get', { id: made.extension });
		}
		const certificate = await step('certificates.upload', {
			file: {
				base64: CA_PEM,
				filename: 'corsair-live-ca.pem',
				contentType: 'application/x-pem-file',
			},
		});
		if (certificate) {
			made.certificate = String(certificate.id);
			await step('certificates.get', { id: made.certificate });
			await step('certificates.delete', { id: made.certificate });
			made.certificate = undefined;
		}
		const agent = await step('agents.create', {
			name: RUN,
			systemPrompt: 'You are a test agent. Never run.',
		});
		if (agent) {
			made.agent = String(agent.agentId);
			await step('agents.get', { agentId: made.agent });
			await step('agents.update', {
				agentId: made.agent,
				name: `${RUN}-renamed`,
			});
			await step('agents.delete', { agentId: made.agent });
			made.agent = undefined;
		}
	});

	it('a session, start to release', async () => {
		const session = await step('sessions.create', {
			projectId: made.project,
			timeout: 120,
			...(made.context
				? { browserSettings: { context: { id: made.context, persist: false } } }
				: {}),
		});
		if (!session) return;
		made.session = String(session.id);
		const s = { id: made.session };
		await step('sessions.get', { ...s, includeLabels: true });
		await step('sessions.debug', s);
		if (made.label)
			await step('sessions.setLabels', {
				...s,
				labels: [String(made.labelName)],
			});
		await step('sessions.uploadFile', {
			...s,
			file: {
				base64: Buffer.from('corsair live run').toString('base64'),
				filename: 'note.txt',
				contentType: 'text/plain',
			},
		});
		if (session.connectUrl) {
			const opened = await openPage(
				String(session.connectUrl),
				'https://example.com',
			);
			report.push({
				op: '(cdp) Target.createTarget',
				ok: opened,
				note: opened ? 'opened example.com' : 'no page',
			});
		}
		await step('downloads.list', { sessionId: made.session });
		await step('sessions.update', { ...s, status: 'REQUEST_RELEASE' });
		made.session = undefined;
		await sleep(15_000);
		await step('sessions.logs', s);
		await step('sessions.recordingDownloads.create', s);
		await step('sessions.recordingDownloads.list', s);
		const replays = await step('sessions.replays.get', s);
		const pageId = rows((replays as Json | undefined)?.pages ?? replays)[0]
			?.pageId;
		if (pageId) {
			await step(
				'sessions.replays.page',
				{ ...s, pageId },
				(out) => `${String(out.contentType)}, ${String(out.byteLength)} bytes`,
			);
		}
	});

	it('deletes what it made', async () => {
		if (made.extension) {
			await step('extensions.delete', { id: made.extension });
			made.extension = undefined;
		}
		if (made.policy) {
			await step('navigationPolicies.delete', { id: made.policy });
			made.policy = undefined;
		}
		if (made.context) {
			await step('contexts.delete', { id: made.context });
			made.context = undefined;
		}
		if (made.label) {
			await step('labels.delete', { labelId: made.label });
			made.label = undefined;
		}
		expect(report.filter((r) => !r.ok)).toEqual([]);
	});
});
