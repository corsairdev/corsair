import { writeFileSync } from 'node:fs';
import { createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { steel } from './index';

/**
 * Live run against a Steel account. Skipped unless STEEL_API_KEY is set (CI
 * never runs files named api.test.ts).
 *
 *   STEEL_API_KEY=... npx jest api.test.ts
 *   (STEEL_LIVE_REPORT=<file> also writes one line per operation)
 *
 * Spends a few cents of wallet credit: one browser session of about a minute
 * plus a scrape, a screenshot and a PDF of example.com. Everything it makes
 * (session, profile, files, vault, credential, extension) is released or
 * deleted at the end, even when a step fails.
 *
 * Never run here: apiKeys.create (mints a key the API can't delete),
 * extensions.deleteAll (it has no scope, so it would remove every extension),
 * secretConnections.create (needs a 1Password or Vault token), and the paid
 * CAPTCHA solvers (they need a verified account).
 */
const key = process.env.STEEL_API_KEY;
const describeIfKey = key ? describe : describe.skip;
if (!key) console.warn('Skipping Steel live run: set STEEL_API_KEY.');

// `unknown` because each operation answers its own shape; steps read fields by name.
type Json = Record<string, unknown>;
const RUN = `corsair-live-${Date.now()}`;
const TEXT = (text: string, filename: string) => ({
	base64: Buffer.from(text).toString('base64'),
	filename,
	contentType: 'text/plain',
});

/** A Chrome extension with only a manifest: the smallest zip Steel accepts. */
function extensionZip(): {
	base64: string;
	filename: string;
	contentType: string;
} {
	const manifest = Buffer.from(
		JSON.stringify({
			manifest_version: 3,
			name: 'corsair-live',
			version: '1.0',
		}),
	);
	const name = Buffer.from('manifest.json');
	const crc = crc32(manifest);
	const local = Buffer.alloc(30);
	local.writeUInt32LE(0x04034b50, 0);
	local.writeUInt16LE(20, 4);
	local.writeUInt32LE(crc, 14);
	local.writeUInt32LE(manifest.length, 18);
	local.writeUInt32LE(manifest.length, 22);
	local.writeUInt16LE(name.length, 26);
	const central = Buffer.alloc(46);
	central.writeUInt32LE(0x02014b50, 0);
	central.writeUInt16LE(20, 4);
	central.writeUInt16LE(20, 6);
	central.writeUInt32LE(crc, 16);
	central.writeUInt32LE(manifest.length, 20);
	central.writeUInt32LE(manifest.length, 24);
	central.writeUInt16LE(name.length, 28);
	const end = Buffer.alloc(22);
	const offset = local.length + name.length + manifest.length;
	end.writeUInt32LE(0x06054b50, 0);
	end.writeUInt16LE(1, 8);
	end.writeUInt16LE(1, 10);
	end.writeUInt32LE(central.length + name.length, 12);
	end.writeUInt32LE(offset, 16);
	const zip = Buffer.concat([local, name, manifest, central, name, end]);
	return {
		base64: zip.toString('base64'),
		filename: 'corsair-live.zip',
		contentType: 'application/zip',
	};
}

function crc32(bytes: Buffer): number {
	let crc = 0xffffffff;
	for (const byte of bytes) {
		crc ^= byte;
		for (let k = 0; k < 8; k++) crc = (crc >>> 1) ^ (0xedb88320 & -(crc & 1));
	}
	return (crc ^ 0xffffffff) >>> 0;
}

async function createClient() {
	const testDb = createTestDatabase();
	await createIntegrationAndAccount(testDb.db, 'steel', 'default');
	const corsair = createCorsair({
		plugins: [steel({ key })],
		database: testDb.db,
		kek: process.env.CORSAIR_KEK ?? '0123456789abcdef0123456789abcdef',
	});
	return { corsair, testDb };
}

describeIfKey('steel live', () => {
	jest.setTimeout(240_000);
	let client: Awaited<ReturnType<typeof createClient>> | undefined;
	const report: Array<{ op: string; ok: boolean; note: string }> = [];
	const made: Record<string, string> = {};

	const call = async (op: string, args: Json = {}): Promise<Json> => {
		// `unknown` because the walk goes through the generated API object by name.
		let fn: unknown = (client as NonNullable<typeof client>).corsair.steel.api;
		for (const part of op.split('.')) {
			fn = (fn as Record<string, unknown>)[part];
		}
		return (await (fn as (input: Json) => Promise<unknown>)(args)) as Json;
	};
	const step = async (
		op: string,
		args: Json,
		note: (out: Json) => string = () => 'ok',
	): Promise<Json> => {
		try {
			const out = await call(op, args);
			report.push({ op, ok: true, note: note(out) });
			return out;
		} catch (error) {
			report.push({ op, ok: false, note: (error as Error).message });
			throw error;
		}
	};
	/** An operation Steel may refuse for a reason outside the plugin (plan, no recording yet). */
	const maybe = async (op: string, args: Json, refusal: RegExp) => {
		try {
			const out = await call(op, args);
			report.push({ op, ok: true, note: 'ok' });
			return out;
		} catch (error) {
			const message = (error as Error).message;
			report.push({ op, ok: refusal.test(message), note: message });
			expect(message).toMatch(refusal);
			return undefined;
		}
	};

	beforeAll(async () => {
		client = await createClient();
	});

	afterAll(async () => {
		if (client) {
			const undo: Array<[string, Json]> = [];
			if (made.session) undo.push(['sessions.release', { id: made.session }]);
			if (made.profile) undo.push(['profiles.delete', { id: made.profile }]);
			if (made.vault) undo.push(['vaults.delete', { id: made.vault }]);
			if (made.extension) {
				undo.push(['extensions.delete', { extensionId: made.extension }]);
			}
			undo.push(['credentials.delete', { origin: 'https://example.com' }]);
			undo.push(['files.delete', { path: `${RUN}/notes.txt` }]);
			for (const [op, args] of undo) {
				await call(op, args).catch(() => undefined);
			}
			await client.testDb.cleanup?.();
		}
		const file = process.env.STEEL_LIVE_REPORT;
		if (file) writeFileSync(file, JSON.stringify(report, null, 1));
	});

	it.each([
		'auth.jwks',
		'projects.list',
		'sessions.list',
		'sessions.signalCatalog',
		'profiles.list',
		'credentials.list',
		'vaults.list',
		'extensions.list',
		'files.list',
		'secretConnections.list',
	])('%s', async (op) => {
		const out = await step(op, {});
		if (op === 'projects.list') {
			made.project = String((out.projects as Json[])[0]?.id);
		}
	});

	it('projects.get', async () => {
		await step('projects.get', { id: made.project }, (o) => String(o.name));
	});

	it('tools: scrape, screenshot, pdf', async () => {
		await step(
			'tools.scrape',
			{ url: 'https://example.com', format: ['markdown'] },
			(o) =>
				String((o.content as Json | undefined)?.markdown ?? '').slice(0, 40),
		);
		await step('tools.screenshot', { url: 'https://example.com' }, (o) =>
			String(o.url).slice(0, 60),
		);
		await step('tools.pdf', { url: 'https://example.com' }, (o) =>
			String(o.url).slice(0, 60),
		);
	});

	it('project files', async () => {
		await step('files.upload', {
			file: TEXT('Corsair live file', 'notes.txt'),
			path: `${RUN}/notes.txt`,
		});
		await step('files.list', {});
		const file = await step(
			'files.download',
			{ path: `${RUN}/notes.txt` },
			(o) => `${String(o.filename)} ${String(o.size ?? '')}`,
		);
		expect(file).toBeDefined();
		await step('files.delete', { path: `${RUN}/notes.txt` });
	});

	it('vaults and credentials', async () => {
		const vault = await step('vaults.create', {
			name: RUN.toLowerCase(),
			description: 'Corsair live run',
		});
		made.vault = String(vault.id);
		await step('vaults.get', { id: made.vault });
		await step('vaults.update', { id: made.vault, description: 'updated' });
		await step('credentials.create', {
			origin: 'https://example.com',
			label: RUN,
			value: { username: 'ada@example.com', password: 'not-a-real-password' },
		});
		await step('credentials.update', {
			origin: 'https://example.com',
			label: `${RUN}-updated`,
			value: { username: 'ada@example.com', password: 'still-not-real' },
		});
		const listed = await step('credentials.list', {}, (o) =>
			Object.keys((o.credentials as Json[] | undefined)?.[0] ?? {}).join(','),
		);
		const credential = (listed.credentials as Json[] | undefined)?.find(
			(c) => c.origin === 'https://example.com',
		);
		made.credential = String(credential?.id ?? '');
	});

	it('extensions', async () => {
		const ext = await step('extensions.upload', { file: extensionZip() }, (o) =>
			String(o.id),
		);
		made.extension = String(ext.id);
		await step('extensions.update', {
			extensionId: made.extension,
			file: extensionZip(),
		});
		await step(
			'extensions.download',
			{ extensionId: made.extension },
			(o) => `${String(o.filename)}`,
		);
	});

	it('a session, start to release', async () => {
		const session = await step(
			'sessions.create',
			{
				timeout: 120000,
				persistProfile: true,
				metadata: { run: RUN },
				blockAds: true,
			},
			(o) => `status ${String(o.status)}`,
		);
		made.session = String(session.id);
		made.profile = String(session.profileId ?? '');
		const id = made.session;
		await step('sessions.get', { id }, (o) => String(o.status));
		await step('sessions.liveDetails', { id });
		await step(
			'sessions.commands.run',
			{
				sessionId: id,
				commands: [
					{ command: 'navigate', url: 'https://example.com' },
					{ command: 'get', what: 'title' },
				],
			},
			(o) => JSON.stringify(o).slice(0, 100),
		);
		await step('sessions.commands.getExecution', {
			sessionId: id,
			executionId: 'x-1',
		});
		await maybe(
			'sessions.commands.cancelExecution',
			{ sessionId: id, executionId: 'x-1' },
			/4\d\d/,
		);
		await step(
			'sessions.computer',
			{ sessionId: id, action: 'take_screenshot' },
			(o) => Object.keys(o).join(','),
		);
		await step('sessions.metadata.update', { id, metadata: { step: 'two' } });
		await step('sessions.metadata.replace', {
			id,
			metadata: { run: RUN, step: 'three' },
		});
		await step('sessions.files.upload', {
			sessionId: id,
			file: TEXT('session file', 'in-browser.txt'),
			path: 'uploads/in-browser.txt',
		});
		await step('sessions.files.list', { sessionId: id });
		await step('sessions.files.download', {
			sessionId: id,
			path: 'uploads/in-browser.txt',
		});
		await step('sessions.files.downloadArchive', { sessionId: id });
		await step('sessions.files.delete', {
			sessionId: id,
			path: 'uploads/in-browser.txt',
		});
		await step('sessions.files.deleteAll', { sessionId: id });
		await step('sessions.credentials.list', { id });
		if (made.credential) {
			await maybe(
				'sessions.credentials.attach',
				{ id, credentialIds: [made.credential] },
				/4\d\d/,
			);
			await maybe(
				'sessions.credentials.replace',
				{ id, credentialIds: [made.credential] },
				/4\d\d/,
			);
			await maybe(
				'sessions.credentials.detach',
				{ id, credentialId: made.credential },
				/4\d\d/,
			);
		}
		await maybe(
			'sessions.credentials.detachVault',
			{ id, reference: RUN.toLowerCase() },
			/4\d\d/,
		);
		await step('sessions.captchas.status', { sessionId: id });
		await step('sessions.context', { id }, (o) => Object.keys(o).join(','));
		await step('sessions.events', { id });
		await step('sessions.logs', { id });
		await step('sessions.agentLogs', { id });
		await step('sessions.agentTraces', { id });
		await step('sessions.release', { id }, (o) => String(o.status));
		made.session = '';
		await step('sessions.cost', { id }, (o) => JSON.stringify(o).slice(0, 80));
		await maybe('sessions.hlsPlaylist', { id }, /4\d\d/);
		// Only this run's project: without projectId it ends every session the key reaches.
		await step('sessions.releaseAll', { projectId: made.project });
	});

	it('profile from the session, then cleanup', async () => {
		if (made.profile) {
			await maybe('profiles.get', { id: made.profile }, /404/);
			await maybe('profiles.delete', { id: made.profile }, /404/);
			made.profile = '';
		}
		await step('credentials.delete', { origin: 'https://example.com' });
		await step('extensions.delete', { extensionId: made.extension });
		made.extension = '';
		await step('vaults.delete', { id: made.vault });
		made.vault = '';
	});
});
