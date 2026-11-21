// Live Kernel API tests. Excluded from the default run by
// `testPathIgnorePatterns` in jest.config.cjs; run them with:
//
//   KERNEL_API_KEY=sk_... pnpm test:live
//
// They start real browsers, which bill per second while active: two headless
// browsers and one headful one for about a minute in all (well under $0.01).
// Every resource is named `corsair-plugin-test-…` and deleted in afterAll,
// and the last test checks none is left. Calls go through createCorsair, so
// the plugin's error handlers and core's retries apply as in production.
import { crc32 } from 'node:zlib';
import { createCorsair } from 'corsair/core';
import { kernel } from './index';

const key = process.env.KERNEL_API_KEY?.trim() ?? '';
const hasKey = key.length > 0;
if (!hasKey) {
	console.warn(
		'[kernel] live API tests skipped: set KERNEL_API_KEY to enable them.',
	);
}
const live = hasKey ? describe : describe.skip;

const PREFIX = 'corsair-plugin-test-';
const RUN = `${PREFIX}${Date.now().toString(36)}`;

/** A zip holding the given files, stored without compression. */
function zipOf(files: Record<string, string>): Buffer {
	const local: Buffer[] = [];
	const central: Buffer[] = [];
	let offset = 0;
	for (const [name, text] of Object.entries(files)) {
		const data = Buffer.from(text);
		const fileName = Buffer.from(name);
		const crc = crc32(data);
		const header = Buffer.alloc(30);
		header.writeUInt32LE(0x04034b50, 0);
		header.writeUInt16LE(20, 4);
		header.writeUInt32LE(crc, 14);
		header.writeUInt32LE(data.length, 18);
		header.writeUInt32LE(data.length, 22);
		header.writeUInt16LE(fileName.length, 26);
		local.push(header, fileName, data);
		const entry = Buffer.alloc(46);
		entry.writeUInt32LE(0x02014b50, 0);
		entry.writeUInt16LE(20, 4);
		entry.writeUInt16LE(20, 6);
		entry.writeUInt32LE(crc, 16);
		entry.writeUInt32LE(data.length, 20);
		entry.writeUInt32LE(data.length, 24);
		entry.writeUInt16LE(fileName.length, 28);
		entry.writeUInt32LE(offset, 42);
		central.push(entry, fileName);
		offset += header.length + fileName.length + data.length;
	}
	const directory = Buffer.concat(central);
	const end = Buffer.alloc(22);
	end.writeUInt32LE(0x06054b50, 0);
	end.writeUInt16LE(Object.keys(files).length, 8);
	end.writeUInt16LE(Object.keys(files).length, 10);
	end.writeUInt32LE(directory.length, 12);
	end.writeUInt32LE(offset, 16);
	return Buffer.concat([...local, directory, end]);
}

/** Ops this file ran against the live API, for the PR's evidence. */
const ran = new Set<string>();

live('Kernel live API', () => {
	jest.setTimeout(5 * 60_000);
	const api = createCorsair({ plugins: [kernel({ key })] }).kernel.api;
	const created = {
		browsers: new Set<string>(),
		profiles: new Set<string>(),
		credentials: new Set<string>(),
		vaults: new Set<string>(),
		extensions: new Set<string>(),
	};
	let browserId = '';

	afterAll(async () => {
		for (const id of created.browsers) {
			await api.browsers.delete({ id_or_name: id }).catch(() => undefined);
		}
		for (const name of created.profiles) {
			await api.profiles.delete({ id_or_name: name }).catch(() => undefined);
		}
		for (const name of created.credentials) {
			await api.credentials.delete({ id_or_name: name }).catch(() => undefined);
		}
		for (const name of created.vaults) {
			await api.vaults.delete({ id_or_name: name }).catch(() => undefined);
		}
		for (const name of created.extensions) {
			await api.extensions.delete({ id_or_name: name }).catch(() => undefined);
		}
		console.log(
			`[kernel] live ops run (${ran.size}): ${[...ran].sort().join(', ')}`,
		);
	});

	it('reads one list or get per tag', async () => {
		// `unknown` because each entry is a different operation with its own output type; the test only checks that the call settles.
		const calls: Array<[string, () => Promise<unknown>]> = [
			['apiKeys.list', () => api.apiKeys.list({ limit: 1 })],
			['apps.list', () => api.apps.list({ limit: 1 })],
			[
				'auditLogs.list',
				() =>
					api.auditLogs.list({
						start: new Date(Date.now() - 3_600_000).toISOString(),
						end: new Date().toISOString(),
						limit: 1,
					}),
			],
			[
				'auditLogs.exportDestinations.list',
				() => api.auditLogs.exportDestinations.list({ limit: 1 }),
			],
			['auth.connections.list', () => api.auth.connections.list({ limit: 2 })],
			['auth.context.get', () => api.auth.context.get({})],
			['browserPools.list', () => api.browserPools.list({ limit: 1 })],
			['browsers.list', () => api.browsers.list({ limit: 5 })],
			['configRegistry.list', () => api.configRegistry.list({ limit: 1 })],
			[
				'configRegistry.analyses.list',
				() => api.configRegistry.analyses.list({ limit: 1 }),
			],
			[
				'configRegistry.lookup',
				() => api.configRegistry.lookup({ url: 'https://example.com' }),
			],
			[
				'credentialProviders.list',
				() => api.credentialProviders.list({ limit: 2 }),
			],
			['credentials.list', () => api.credentials.list({ limit: 1 })],
			['deployments.list', () => api.deployments.list({ limit: 1 })],
			['extensions.list', () => api.extensions.list({ limit: 1 })],
			['invocations.list', () => api.invocations.list({ limit: 1 })],
			[
				'organization.entitlements.get',
				() => api.organization.entitlements.get({}),
			],
			['organization.limits.get', () => api.organization.limits.get({})],
			['profiles.list', () => api.profiles.list({ limit: 2 })],
			['projects.list', () => api.projects.list({ limit: 2 })],
			['proxies.list', () => api.proxies.list({ limit: 1 })],
			['proxyIPs.list', () => api.proxyIPs.list({ limit: 1 })],
			['search.providers.list', () => api.search.providers.list({})],
			['tasks.list', () => api.tasks.list({ limit: 1 })],
			[
				'telemetry.destinations.list',
				() => api.telemetry.destinations.list({ limit: 1 }),
			],
			[
				'vaultProviderConfigs.list',
				() => api.vaultProviderConfigs.list({ limit: 1 }),
			],
			['vaults.list', () => api.vaults.list({ limit: 1 })],
		];
		const failures: string[] = [];
		for (const [id, call] of calls) {
			try {
				const result = await call();
				expect(result).toBeDefined();
				ran.add(id);
			} catch (error) {
				// A plan without the feature answers 403; that is Kernel, not the plugin.
				const status = (error as { status?: number }).status;
				const message = (error as Error).message;
				if (
					status === 403 ||
					status === 402 ||
					(status === 404 && /_disabled\)/.test(message))
				) {
					console.warn(`[kernel] ${id}: not on this plan (${status})`);
					ran.add(`${id} (${status})`);
					continue;
				}
				failures.push(`${id}: ${(error as Error).message}`);
			}
		}
		expect(failures).toEqual([]);

		const profiles = await api.profiles.list({ limit: 1 });
		expect(Array.isArray(profiles.items)).toBe(true);
		expect(typeof profiles.has_more).toBe('boolean');
		if (profiles.has_more) {
			expect(profiles.next_offset).toBe(1);
			const next = await api.profiles.list({ limit: 1, offset: 1 });
			expect(next.items.length).toBeGreaterThan(0);
		}
		const connections = await api.auth.connections.list({ limit: 1 });
		const connection = connections.items[0];
		if (connection?.id) {
			const got = await api.auth.connections.get({ id: connection.id });
			expect(got.id).toBe(connection.id);
			ran.add('auth.connections.get');
			const timeline = await api.auth.connections.timeline({
				id: connection.id,
				limit: 2,
			});
			expect(Array.isArray(timeline.items)).toBe(true);
			ran.add('auth.connections.timeline');
		}
	});

	it('runs a headless browser end to end', async () => {
		const browser = await api.browsers.create({
			headless: true,
			timeout_seconds: 120,
			name: `${RUN}-main`,
			tags: { purpose: 'corsair-plugin-test' },
		});
		ran.add('browsers.create');
		expect(browser.session_id).toEqual(expect.any(String));
		browserId = browser.session_id ?? '';
		created.browsers.add(browserId);
		expect(browser.headless).toBe(true);

		const got = await api.browsers.get({ id_or_name: browserId });
		expect(got.session_id).toBe(browserId);
		ran.add('browsers.get');

		const run = await api.browsers.playwright.execute({
			id_or_name: browserId,
			code: "await page.goto('https://example.com'); return await page.title();",
			timeout_sec: 60,
		});
		ran.add('browsers.playwright.execute');
		expect(run.success).toBe(true);
		expect(run.result).toBe('Example Domain');

		const executors = await api.browsers.playwright.executors.list({
			id_or_name: browserId,
		});
		expect(executors).toBeDefined();
		ran.add('browsers.playwright.executors.list');

		const shot = await api.browsers.computer.captureScreenshot({
			id_or_name: browserId,
		});
		ran.add('browsers.computer.captureScreenshot');
		expect(shot.contentType).toBe('image/png');
		expect(shot.filename).toBe('screenshot.png');
		expect(shot.byteLength).toBeGreaterThan(1000);
		if (shot.contentBase64) {
			const png = Buffer.from(shot.contentBase64, 'base64');
			expect(png.subarray(1, 4).toString('latin1')).toBe('PNG');
			expect(png.byteLength).toBe(shot.byteLength);
		} else {
			expect(shot.contentOmitted).toBe('over_limit');
		}

		const tools = await api.browsers.webmcp.listTools({
			id_or_name: browserId,
		});
		ran.add('browsers.webmcp.listTools');
		expect(Array.isArray(tools.tools)).toBe(true);

		const position = await api.browsers.computer.getMousePosition({
			id_or_name: browserId,
		});
		ran.add('browsers.computer.getMousePosition');
		expect(typeof position.x).toBe('number');
		expect(typeof position.y).toBe('number');

		const moved = await api.browsers.computer.moveMouse({
			id_or_name: browserId,
			x: 120,
			y: 80,
		});
		expect(moved).toEqual({ success: true });
		ran.add('browsers.computer.moveMouse');

		const batch = await api.browsers.computer.batch({
			id_or_name: browserId,
			actions: [
				{ type: 'move_mouse', move_mouse: { x: 200, y: 150 } },
				{ type: 'sleep', sleep: { duration_ms: 50 } },
			],
		});
		expect(batch).toEqual({ success: true });
		ran.add('browsers.computer.batch');

		const updated = await api.browsers.update({
			id_or_name: browserId,
			tags: { purpose: 'corsair-plugin-test', step: 'updated' },
		});
		expect(updated.tags?.step).toBe('updated');
		ran.add('browsers.update');

		const exec = await api.browsers.process.exec({
			id_or_name: browserId,
			command: 'echo',
			args: ['corsair'],
			timeout_sec: 20,
		});
		ran.add('browsers.process.exec');
		expect(exec.exit_code).toBe(0);
		expect(
			Buffer.from(exec.stdout_b64 ?? '', 'base64')
				.toString()
				.trim(),
		).toBe('corsair');

		const dir = `/tmp/${RUN}`;
		await api.browsers.fs.createDirectory({ id_or_name: browserId, path: dir });
		ran.add('browsers.fs.createDirectory');
		await api.browsers.fs.writeFile({
			id_or_name: browserId,
			path: `${dir}/hello.txt`,
			file: { base64: Buffer.from('hello from corsair').toString('base64') },
		});
		ran.add('browsers.fs.writeFile');
		await api.browsers.fs.upload({
			id_or_name: browserId,
			files: [
				{
					dest_path: `${dir}/data.json`,
					file: {
						base64: Buffer.from('{"ok":true}').toString('base64'),
						filename: 'data.json',
						contentType: 'application/json',
					},
				},
				// A bare URL is downloaded and sent as the file, not as its text.
				{ dest_path: `${dir}/example.html`, file: 'https://example.com/' },
			],
		});
		ran.add('browsers.fs.upload');
		const listing = await api.browsers.fs.listFiles({
			id_or_name: browserId,
			path: dir,
		});
		ran.add('browsers.fs.listFiles');
		expect(listing.map((entry) => entry.name).sort()).toEqual([
			'data.json',
			'example.html',
			'hello.txt',
		]);
		const page = await api.browsers.fs.fileInfo({
			id_or_name: browserId,
			path: `${dir}/example.html`,
		});
		// The page's HTML (about 1 KB), not the 20 characters of its URL.
		expect(page.size_bytes ?? 0).toBeGreaterThan(200);
		const info = await api.browsers.fs.fileInfo({
			id_or_name: browserId,
			path: `${dir}/hello.txt`,
		});
		ran.add('browsers.fs.fileInfo');
		expect(info.size_bytes).toBe(18);
		const read = await api.browsers.fs.readFile({
			id_or_name: browserId,
			path: `${dir}/hello.txt`,
		});
		ran.add('browsers.fs.readFile');
		expect(read.filename).toBe('hello.txt');
		expect(
			read.text ?? Buffer.from(read.contentBase64 ?? '', 'base64').toString(),
		).toBe('hello from corsair');
		const zip = await api.browsers.fs.downloadDirZip({
			id_or_name: browserId,
			path: dir,
		});
		ran.add('browsers.fs.downloadDirZip');
		expect(zip.byteLength).toBeGreaterThan(100);
		await api.browsers.fs.move({
			id_or_name: browserId,
			src_path: `${dir}/data.json`,
			dest_path: `${dir}/moved.json`,
		});
		ran.add('browsers.fs.move');
		await api.browsers.fs.deleteFile({
			id_or_name: browserId,
			path: `${dir}/moved.json`,
		});
		ran.add('browsers.fs.deleteFile');
		await api.browsers.fs.deleteDirectory({ id_or_name: browserId, path: dir });
		ran.add('browsers.fs.deleteDirectory');

		const curl = await api.browsers.curl({
			id_or_name: browserId,
			url: 'https://example.com',
			timeout_ms: 20_000,
		});
		ran.add('browsers.curl');
		expect(curl.status).toBe(200);

		const events = await api.browsers.telemetry.events({
			id_or_name: browserId,
			limit: 5,
		});
		ran.add('browsers.telemetry.events');
		expect(Array.isArray(events.items)).toBe(true);

		// Keyboard, mouse and clipboard.
		await api.browsers.computer.clickMouse({
			id_or_name: browserId,
			x: 10,
			y: 10,
		});
		ran.add('browsers.computer.clickMouse');
		await api.browsers.computer.typeText({
			id_or_name: browserId,
			text: 'corsair',
		});
		ran.add('browsers.computer.typeText');
		await api.browsers.computer.pressKey({
			id_or_name: browserId,
			keys: ['Escape'],
		});
		ran.add('browsers.computer.pressKey');
		await api.browsers.computer.scroll({
			id_or_name: browserId,
			x: 100,
			y: 100,
			delta_y: 2,
		});
		ran.add('browsers.computer.scroll');
		await api.browsers.computer.dragMouse({
			id_or_name: browserId,
			path: [
				[50, 50],
				[60, 60],
			],
		});
		ran.add('browsers.computer.dragMouse');
		await api.browsers.computer.setCursorVisibility({
			id_or_name: browserId,
			hidden: false,
		});
		ran.add('browsers.computer.setCursorVisibility');
		await api.browsers.computer.writeClipboard({
			id_or_name: browserId,
			text: 'corsair clipboard',
		});
		ran.add('browsers.computer.writeClipboard');
		const clipboard = await api.browsers.computer.readClipboard({
			id_or_name: browserId,
		});
		ran.add('browsers.computer.readClipboard');
		expect(clipboard.text).toBe('corsair clipboard');

		// The REPL keeps state between calls.
		const repl = await api.browsers.repl({
			id_or_name: browserId,
			code: 'globalThis.corsairCount = 41; repl.write(String(globalThis.corsairCount + 1));',
		});
		ran.add('browsers.repl');
		expect(repl.success).toBe(true);

		// A spawned process: status, stdin, kill.
		const spawned = await api.browsers.process.spawn({
			id_or_name: browserId,
			command: 'cat',
		});
		ran.add('browsers.process.spawn');
		const processId = spawned.process_id ?? '';
		expect(processId).not.toBe('');
		await api.browsers.process.stdin({
			id_or_name: browserId,
			process_id: processId,
			data_b64: Buffer.from('hi\n').toString('base64'),
		});
		ran.add('browsers.process.stdin');
		const status = await api.browsers.process.status({
			id_or_name: browserId,
			process_id: processId,
		});
		ran.add('browsers.process.status');
		expect(status.state).toBeDefined();
		await api.browsers.process.kill({
			id_or_name: browserId,
			process_id: processId,
			signal: 'KILL',
		});
		ran.add('browsers.process.kill');

		// Custom WebMCP tools and the Playwright executor list.
		const customTools = await api.browsers.webmcp.customTools.list({
			id_or_name: browserId,
		});
		ran.add('browsers.webmcp.customTools.list');
		expect(customTools).toBeDefined();
		await api.browsers.playwright.execute({
			id_or_name: browserId,
			code: 'return 1;',
			executor: 'corsair-test',
		});
		await api.browsers.playwright.executors.delete({
			id_or_name: browserId,
			name: 'corsair-test',
		});
		ran.add('browsers.playwright.executors.delete');

		// Extensions: upload a tiny unpacked extension, load it into the browser, read it back.
		const extensionZip = zipOf({
			'manifest.json': JSON.stringify({
				manifest_version: 3,
				name: 'Corsair plugin test',
				version: '1.0.0',
			}),
		});
		const extensionName = `${RUN}-ext`;
		const extension = await api.extensions.upload({
			name: extensionName,
			file: {
				base64: extensionZip.toString('base64'),
				filename: 'extension.zip',
				contentType: 'application/zip',
			},
		});
		created.extensions.add(extensionName);
		ran.add('extensions.upload');
		expect(extension.name).toBe(extensionName);
		const extensionMeta = await api.extensions.get({
			id_or_name: extensionName,
		});
		ran.add('extensions.get');
		expect(extensionMeta.name).toBe(extensionName);
		const extensionFile = await api.extensions.download({
			id_or_name: extensionName,
		});
		ran.add('extensions.download');
		expect(extensionFile.byteLength).toBeGreaterThan(0);
		await api.browsers.loadExtensions({
			id_or_name: browserId,
			extensions: [
				{
					name: `${RUN}-adhoc`,
					zip_file: {
						base64: extensionZip.toString('base64'),
						filename: 'ext.zip',
					},
				},
			],
		});
		ran.add('browsers.loadExtensions');
		await api.extensions.delete({ id_or_name: extensionName });
		created.extensions.delete(extensionName);
		ran.add('extensions.delete');

		const deleted = await api.browsers.delete({ id_or_name: browserId });
		ran.add('browsers.delete');
		expect(deleted).toEqual({ success: true });
		created.browsers.delete(browserId);
	});

	it('creates a live view link for a headful browser', async () => {
		const browser = await api.browsers.create({
			headless: false,
			timeout_seconds: 60,
			name: `${RUN}-headful`,
		});
		const id = browser.session_id ?? '';
		created.browsers.add(id);
		const view = await api.browsers.liveView.create({
			id_or_name: id,
			scope: 'read',
			ttl_seconds: 60,
		});
		ran.add('browsers.liveView.create');
		// The URL is full read access to the browser: checked, never printed.
		expect(/^https:\/\//.test(view.url ?? '')).toBe(true);
		expect(view.scope).toBe('read');

		// Replays need a headful browser.
		const replay = await api.browsers.replays.start({ id_or_name: id });
		ran.add('browsers.replays.start');
		expect(replay.replay_id).toEqual(expect.any(String));
		await api.browsers.playwright.execute({
			id_or_name: id,
			code: "await page.goto('https://example.com'); await page.waitForTimeout(1500); return true;",
		});
		await api.browsers.replays.stop({
			id_or_name: id,
			replay_id: replay.replay_id ?? '',
		});
		ran.add('browsers.replays.stop');
		const replays = await api.browsers.replays.list({ id_or_name: id });
		ran.add('browsers.replays.list');
		expect(replays.map((r) => r.replay_id)).toContain(replay.replay_id);
		let video:
			| Awaited<ReturnType<typeof api.browsers.replays.download>>
			| undefined;
		for (let attempt = 0; attempt < 10 && !video; attempt++) {
			try {
				video = await api.browsers.replays.download({
					id_or_name: id,
					replay_id: replay.replay_id ?? '',
				});
			} catch (error) {
				if (!/still preparing/.test((error as Error).message)) throw error;
				await new Promise((done) => setTimeout(done, 2000));
			}
		}
		ran.add('browsers.replays.download');
		expect(video?.contentType).toBe('video/mp4');
		expect(video?.filename).toBe(`replay-${replay.replay_id}.mp4`);
		expect(video?.byteLength).toBeGreaterThan(1000);
		await api.browsers.delete({ id_or_name: id });
		created.browsers.delete(id);
	});

	it('saves a profile from a browser and deletes both', async () => {
		const name = `${RUN}-profile`;
		const profile = await api.profiles.create({ name });
		created.profiles.add(name);
		ran.add('profiles.create');
		expect(profile.name).toBe(name);

		const browser = await api.browsers.create({
			headless: true,
			timeout_seconds: 60,
			name: `${RUN}-profiled`,
			profile: { name, save_changes: true },
		});
		const id = browser.session_id ?? '';
		created.browsers.add(id);
		expect(browser.profile?.name).toBe(name);
		await api.browsers.playwright.execute({
			id_or_name: id,
			code: "await page.goto('https://example.com'); await page.evaluate(() => localStorage.setItem('corsair', '1')); return true;",
		});
		const saved = await api.browsers.saveProfile({ id_or_name: id, name });
		ran.add('browsers.saveProfile');
		expect(saved.name).toBe(name);
		await api.browsers.delete({ id_or_name: id });
		created.browsers.delete(id);

		const got = await api.profiles.get({ id_or_name: name });
		ran.add('profiles.get');
		expect(got.name).toBe(name);
		let archive: Awaited<ReturnType<typeof api.profiles.download>> | undefined;
		for (let attempt = 0; attempt < 10 && !archive; attempt++) {
			try {
				archive = await api.profiles.download({ id_or_name: name });
			} catch (error) {
				if (!/still preparing/.test((error as Error).message)) throw error;
				await new Promise((done) => setTimeout(done, 2000));
			}
		}
		ran.add('profiles.download');
		expect(archive?.filename).toBe(`profile-${name}.tar.zst`);
		expect(archive?.byteLength).toBeGreaterThan(0);
		const renamed = `${name}-2`;
		await api.profiles.update({ id_or_name: name, name: renamed });
		ran.add('profiles.update');
		created.profiles.delete(name);
		created.profiles.add(renamed);

		const removed = await api.profiles.delete({ id_or_name: renamed });
		ran.add('profiles.delete');
		expect(removed).toEqual({ success: true });
		created.profiles.delete(renamed);
	});

	it('creates, reads and deletes a credential and a vault', async () => {
		const name = `${RUN}-cred`;
		const credential = await api.credentials.create({
			name,
			domain: 'example.com',
			values: { username: 'corsair-test', password: 'not-a-real-password' },
			totp_secret: 'JBSWY3DPEHPK3PXP',
		});
		created.credentials.add(name);
		ran.add('credentials.create');
		expect(credential.name).toBe(name);
		const got = await api.credentials.get({ id_or_name: name });
		ran.add('credentials.get');
		expect(got.domain).toBe('example.com');
		await api.credentials.update({
			id_or_name: name,
			values: { username: 'corsair-test-2' },
		});
		ran.add('credentials.update');
		const totp = await api.credentials.totpCode({ id_or_name: name });
		ran.add('credentials.totpCode');
		expect(totp.code).toMatch(/^\d{6}$/);
		const removed = await api.credentials.delete({ id_or_name: name });
		ran.add('credentials.delete');
		expect(removed).toEqual({ success: true });
		created.credentials.delete(name);

		const vaultName = `${RUN}-vault`;
		const vault = await api.vaults.upsert({ name: vaultName });
		created.vaults.add(vaultName);
		ran.add('vaults.upsert');
		expect(vault.name).toBe(vaultName);
		const vaultGot = await api.vaults.get({ id_or_name: vaultName });
		ran.add('vaults.get');
		expect(vaultGot.name).toBe(vaultName);
		const items = await api.vaults.items.list({ id_or_name: vaultName });
		ran.add('vaults.items.list');
		expect(Array.isArray(items)).toBe(true);
		await api.vaults.delete({ id_or_name: vaultName });
		ran.add('vaults.delete');
		created.vaults.delete(vaultName);
	});

	it('leaves no test browser or profile behind', async () => {
		// Names only: a browser object carries its CDP URL, which must never reach a log.
		const browsers = await api.browsers.list({ limit: 100 });
		expect(
			browsers.items
				.map((b) => b.name ?? '')
				.filter((name) => name.startsWith(PREFIX)),
		).toEqual([]);
		const profiles = await api.profiles.list({ limit: 100, query: PREFIX });
		expect(
			profiles.items
				.map((p) => p.name ?? '')
				.filter((name) => name.startsWith(PREFIX)),
		).toEqual([]);
	});
});
