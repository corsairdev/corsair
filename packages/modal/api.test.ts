// Live suite against a real Modal workspace. Needs MODAL_TOKEN_ID and
// MODAL_TOKEN_SECRET (optional MODAL_LIVE_ENVIRONMENT). Everything it makes
// has a run-specific name and is deleted at the end: a few short sandboxes
// (0.125 CPU, 128 MiB, 2 minute timeout, alpine), two Volumes, a Secret, a
// Queue, a Dict, an environment and a small built Image.
// MODAL_LIVE_APP=corsair-live-fn (deploy tests/live_app.py first) also runs
// the functions, classes and functionCalls steps.
import { modalEndpointsNested } from './endpoints';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn(async () => null),
}));

const tokenId = process.env.MODAL_TOKEN_ID;
const tokenSecret = process.env.MODAL_TOKEN_SECRET;
const hasCredentials = Boolean(tokenId && tokenSecret);
if (!hasCredentials) {
	console.warn(
		'[modal] skipping live tests: set MODAL_TOKEN_ID and MODAL_TOKEN_SECRET',
	);
}
const describeLive = hasCredentials ? describe : describe.skip;

type Endpoint = (ctx: unknown, input: unknown) => Promise<unknown>;
const tree = modalEndpointsNested as unknown as Record<
	string,
	Record<string, Endpoint>
>;

const ctx = {
	key: tokenSecret,
	options: {
		tokenId,
		environment: process.env.MODAL_LIVE_ENVIRONMENT || undefined,
	},
	keys: { get_token_id: async () => tokenId },
	$getAccountId: async () => 'live',
};

const results: { op: string; ok: boolean; note?: string }[] = [];

async function call<T = Record<string, unknown>>(
	op: string,
	input: Record<string, unknown> = {},
): Promise<T> {
	const [group, name] = op.split('.') as [string, string];
	const fn = tree[group]?.[name];
	if (!fn) throw new Error(`no op ${op}`);
	try {
		const out = (await fn(ctx, input)) as T;
		results.push({ op, ok: true });
		return out;
	} catch (error) {
		results.push({
			op,
			ok: false,
			note: (error as Error).message.slice(0, 160),
		});
		throw error;
	}
}

async function expectStatus(
	op: string,
	input: Record<string, unknown>,
	status: number,
) {
	const [group, name] = op.split('.') as [string, string];
	const error = (await tree[group]?.[name]?.(ctx, input).catch((e) => e)) as {
		status?: number;
		message?: string;
	};
	results.push({
		op,
		ok: error?.status === status,
		note: `expected ${status}, got ${error?.status}: ${error?.message?.slice(0, 120)}`,
	});
	expect(error?.status).toBe(status);
}

const run = `corsair-live-${Date.now().toString(36)}`;
const appName = run;
const names = {
	secret: `${run}-secret`,
	volume: `${run}-vol`,
	volumeV1: `${run}-vol1`,
	queue: `${run}-queue`,
	dict: `${run}-dict`,
	environment: `${run}-env`,
	image: `${run}-img`,
};
let sandboxId: string | undefined;
let snapshotImageId: string | undefined;
let builtImageId: string | undefined;
// Sandboxes and images later steps make; afterAll removes any left over.
const extraSandboxes = new Set<string>();
const extraImages = new Set<string>();

// One shell command's stdout in a running sandbox.
async function sh(id: string, script: string): Promise<string> {
	const out = await call<{ stdout: string }>('sandboxes.exec', {
		sandboxId: id,
		command: ['sh', '-c', script],
	});
	return out.stdout;
}

async function createExtraSandbox(input: Record<string, unknown>) {
	const created = await call<{ sandboxId: string; tunnels?: unknown[] }>(
		'sandboxes.create',
		{
			appName,
			image: { registry: 'alpine:3.21' },
			cpu: 0.125,
			memoryMiB: 128,
			timeoutMs: 120_000,
			...input,
		},
	);
	extraSandboxes.add(created.sandboxId);
	return created;
}

describeLive('modal live', () => {
	jest.setTimeout(240_000);

	afterAll(async () => {
		const cleanup: [string, Record<string, unknown>][] = [];
		if (sandboxId) cleanup.push(['sandboxes.terminate', { sandboxId }]);
		for (const id of extraSandboxes) {
			cleanup.push(['sandboxes.terminate', { sandboxId: id }]);
		}
		for (const imageId of [snapshotImageId, builtImageId, ...extraImages]) {
			if (imageId) cleanup.push(['images.delete', { imageId }]);
		}
		cleanup.push(
			['secrets.delete', { name: names.secret, allowMissing: true }],
			['volumes.delete', { name: names.volume, allowMissing: true }],
			['volumes.delete', { name: names.volumeV1, allowMissing: true }],
			['queues.delete', { name: names.queue, allowMissing: true }],
			['dicts.delete', { name: names.dict, allowMissing: true }],
			['apps.stop', { name: appName }],
		);
		for (const [op, input] of cleanup) {
			await call(op, input).catch(() => undefined);
		}
		const passed = results.filter((r) => r.ok).length;
		console.log(
			`[modal live] ${passed}/${results.length} calls as expected\n${results
				.map(
					(r) =>
						`${r.ok ? 'ok  ' : 'FAIL'} ${r.op}${r.note ? ` - ${r.note}` : ''}`,
				)
				.join('\n')}`,
		);
	});

	it('environments', async () => {
		const env = await call<{ name: string }>('environments.getDefault');
		expect(env.name).toBeTruthy();
		const list = await call<{ environments: { name: string }[] }>(
			'environments.list',
		);
		expect(list.environments.map((e) => e.name)).toContain(env.name);
		await call('environments.get', { name: env.name });

		await call('environments.create', { name: names.environment });
		await expect(
			call('environments.get', { name: names.environment }),
		).resolves.toMatchObject({ name: names.environment });
		await call('environments.delete', { name: names.environment });
		await expectStatus('environments.get', { name: names.environment }, 404);
	});

	it('apps', async () => {
		await expectStatus('apps.get', { name: appName }, 404);
		const app = await call<{ appId: string }>('apps.create', { name: appName });
		expect(app.appId).toMatch(/^ap-/);
		await expect(call('apps.get', { name: appName })).resolves.toMatchObject({
			appId: app.appId,
		});
		await call('apps.info', { name: appName });
		await call('apps.list', { limit: 50 });
		await call('apps.stats', { name: appName });
	});

	it('secrets', async () => {
		const created = await call<{ secretId: string }>('secrets.create', {
			name: names.secret,
			values: { CORSAIR_LIVE: 'from-secret' },
		});
		expect(created.secretId).toMatch(/^st-/);
		await expectStatus(
			'secrets.create',
			{ name: names.secret, values: { CORSAIR_LIVE: 'x' } },
			409,
		);
		await call('secrets.get', {
			name: names.secret,
			requiredKeys: ['CORSAIR_LIVE'],
		});
		const list = await call<{ secrets: { name: string; keys?: string[] }[] }>(
			'secrets.list',
			{ limit: 200 },
		);
		expect(list.secrets.map((s) => s.name)).toContain(names.secret);
	});

	it('volumes', async () => {
		const volume = await call<{ volumeId: string }>('volumes.create', {
			name: names.volume,
			version: 2,
		});
		expect(volume.volumeId).toMatch(/^vo-/);
		await call('volumes.get', { name: names.volume });
		const list = await call<{ volumes: { name: string }[] }>('volumes.list', {
			limit: 200,
		});
		expect(list.volumes.map((v) => v.name)).toContain(names.volume);
		await call('volumes.listFiles', { name: names.volume });
	});

	it('sandbox: create, exec, files, tags, snapshot, logs, terminate', async () => {
		const created = await call<{ sandboxId: string }>('sandboxes.create', {
			appName,
			image: { registry: 'alpine:3.21' },
			cpu: 0.125,
			memoryMiB: 128,
			timeoutMs: 120_000,
			secrets: [names.secret],
			volumes: { '/data': { name: names.volume } },
			tags: { corsair: run },
			command: ['sh', '-c', 'echo booted; sleep 110'],
		});
		sandboxId = created.sandboxId;
		expect(sandboxId).toMatch(/^sb-/);

		await call('sandboxes.waitUntilReady', { sandboxId, timeoutMs: 60_000 });
		await expect(call('sandboxes.get', { sandboxId })).resolves.toMatchObject({
			running: true,
		});
		const listed = await call<{ sandboxes: { sandboxId: string }[] }>(
			'sandboxes.list',
			{ appName, tags: { corsair: run } },
		);
		expect(listed.sandboxes.map((s) => s.sandboxId)).toContain(sandboxId);

		const exec = await call<{ exitCode: number; stdout: string }>(
			'sandboxes.exec',
			{
				sandboxId,
				command: [
					'sh',
					'-c',
					'echo "$CORSAIR_LIVE"; cat; echo oops >&2; exit 3',
				],
				stdin: 'piped-in',
			},
		);
		expect(exec).toMatchObject({
			exitCode: 3,
			stdout: 'from-secret\npiped-in',
			stderr: 'oops\n',
		});

		await call('files.makeDirectory', {
			sandboxId,
			path: '/tmp/corsair/a',
			createParents: true,
		});
		await call('files.write', {
			sandboxId,
			path: '/tmp/corsair/a/hello.txt',
			content: 'héllo',
		});
		await expect(
			call('files.read', { sandboxId, path: '/tmp/corsair/a/hello.txt' }),
		).resolves.toMatchObject({ content: 'héllo', size: 6 });
		await call('files.write', {
			sandboxId,
			path: '/tmp/corsair/bin',
			content: Buffer.from([0, 255, 1]).toString('base64'),
			encoding: 'base64',
		});
		await expect(
			call('files.read', {
				sandboxId,
				path: '/tmp/corsair/bin',
				encoding: 'base64',
			}),
		).resolves.toMatchObject({ content: 'AP8B' });
		await expect(
			call('files.stat', { sandboxId, path: '/tmp/corsair/a/hello.txt' }),
		).resolves.toMatchObject({ type: 'file', size: 6 });
		const files = await call<{ entries: { name: string }[] }>('files.list', {
			sandboxId,
			path: '/tmp/corsair',
		});
		expect(files.entries.map((e) => e.name).sort()).toEqual(['a', 'bin']);
		await call('files.remove', {
			sandboxId,
			path: '/tmp/corsair/a',
			recursive: true,
		});
		await expectStatus(
			'files.read',
			{ sandboxId, path: '/tmp/corsair/a/hello.txt' },
			404,
		);

		await call('sandboxes.exec', {
			sandboxId,
			command: ['sh', '-c', 'echo vol > /data/live.txt && sync'],
		});
		await call('sandboxes.reloadVolumes', { sandboxId });

		await call('sandboxes.setTags', {
			sandboxId,
			tags: { corsair: run, step: 'tags' },
		});
		await expect(call('sandboxes.getTags', { sandboxId })).resolves.toEqual({
			tags: { corsair: run, step: 'tags' },
		});

		const snapshot = await call<{ imageId: string }>(
			'sandboxes.snapshotFilesystem',
			{ sandboxId, ttlMs: 3_600_000 },
		);
		snapshotImageId = snapshot.imageId;
		expect(snapshotImageId).toMatch(/^im-/);
		await call('images.get', { imageId: snapshotImageId });

		await call('sandboxes.logs', { sandboxId, entries: 20 });

		await call('sandboxes.terminate', { sandboxId });
		const after = await call<{ running: boolean }>('sandboxes.wait', {
			sandboxId,
			timeoutMs: 60_000,
		});
		expect(after.running).toBe(false);
		sandboxId = undefined;

		await call('images.delete', { imageId: snapshotImageId });
		snapshotImageId = undefined;
		await call('apps.sandboxStats', {
			name: appName,
			since: new Date(
				Math.floor(Date.now() / 3_600_000) * 3_600_000 - 3_600_000,
			).toISOString(),
		});
	});

	it('volume files written by the sandbox', async () => {
		const files = await call<{ entries: { path: string }[] }>(
			'volumes.listFiles',
			{ name: names.volume, path: '/' },
		);
		expect(files.entries.map((e) => e.path.replace(/^\//, ''))).toContain(
			'live.txt',
		);
		await call('volumes.removeFile', { name: names.volume, path: 'live.txt' });
	});

	it('queues', async () => {
		await call('queues.create', { name: names.queue });
		await call('queues.put', {
			name: names.queue,
			values: [{ a: 1 }, 'two', 3],
		});
		await expect(call('queues.len', { name: names.queue })).resolves.toEqual({
			length: 3,
		});
		await expect(
			call('queues.peek', { name: names.queue, limit: 10 }),
		).resolves.toEqual({ values: [{ a: 1 }, 'two', 3], truncated: false });
		await expect(
			call('queues.get', { name: names.queue, count: 2 }),
		).resolves.toEqual({ values: [{ a: 1 }, 'two'] });
		const list = await call<{ queues: { name: string }[] }>('queues.list', {
			limit: 200,
		});
		expect(list.queues.map((q) => q.name)).toContain(names.queue);
		await call('queues.clear', { name: names.queue, all: true });
		await expect(
			call('queues.get', { name: names.queue, timeoutMs: 0 }),
		).resolves.toEqual({ values: [] });

		// Integers beyond 32 bits and bytes keep their value (the SDK's own
		// pickler truncates the former).
		const wide = [1_732_700_000_000, -(2 ** 40), { $bytes: 'AP8=' }];
		await call('queues.put', { name: names.queue, values: wide });
		await expect(
			call('queues.get', { name: names.queue, count: 3 }),
		).resolves.toEqual({ values: wide });
	});

	it('dicts', async () => {
		await call('dicts.create', { name: names.dict });
		await expect(
			call('dicts.put', { name: names.dict, key: 'user:1', value: { n: 1 } }),
		).resolves.toEqual({ created: true });
		await expect(
			call('dicts.put', {
				name: names.dict,
				key: 'user:1',
				value: 2,
				skipIfExists: true,
			}),
		).resolves.toEqual({ created: false });
		await call('dicts.update', {
			name: names.dict,
			entries: [
				{ key: 7, value: [1, 'a'] },
				{ key: 'flag', value: true },
			],
		});
		await expect(
			call('dicts.get', { name: names.dict, key: 'user:1' }),
		).resolves.toEqual({ found: true, value: { n: 1 } });
		await expect(
			call('dicts.contains', { name: names.dict, key: 7 }),
		).resolves.toEqual({ found: true });
		await expect(call('dicts.len', { name: names.dict })).resolves.toEqual({
			length: 3,
		});
		const items = await call<{ entries: { key: unknown }[] }>('dicts.items', {
			name: names.dict,
		});
		expect(items.entries.map((e) => e.key).sort()).toEqual(
			[7, 'flag', 'user:1'].sort(),
		);
		await expect(
			call('dicts.pop', { name: names.dict, key: 'flag' }),
		).resolves.toEqual({ found: true, value: true });
		const list = await call<{ dicts: { name: string }[] }>('dicts.list', {
			limit: 200,
		});
		expect(list.dicts.map((d) => d.name)).toContain(names.dict);
		const wide = {
			ts: 1_732_700_000_000,
			n: -(2 ** 40),
			b: { $bytes: 'AP8=' },
		};
		await call('dicts.put', { name: names.dict, key: 2 ** 40, value: wide });
		await expect(
			call('dicts.get', { name: names.dict, key: 2 ** 40 }),
		).resolves.toEqual({ found: true, value: wide });
		await call('dicts.clear', { name: names.dict });
		await expect(call('dicts.len', { name: names.dict })).resolves.toEqual({
			length: 0,
		});
	});

	it('functions, classes and function calls', async () => {
		const liveApp = process.env.MODAL_LIVE_APP;
		if (!liveApp) {
			await expectStatus(
				'functions.get',
				{ appName, name: 'does_not_exist' },
				404,
			);
			return;
		}
		const target = { appName: liveApp, name: 'square' };
		await expect(call('functions.get', target)).resolves.toMatchObject({
			functionId: expect.stringMatching(/^fu-/),
		});
		await expect(call('functions.info', target)).resolves.toMatchObject({
			cpu: 0.125,
			memoryMiB: 128,
		});
		await expect(
			call('functions.call', { ...target, args: [3] }),
		).resolves.toMatchObject({ status: 'completed', result: 9 });
		await expect(
			call('functions.call', { ...target, kwargs: { x: 5 } }),
		).resolves.toMatchObject({ status: 'completed', result: 25 });
		const spawned = await call<{ functionCallId: string }>('functions.spawn', {
			...target,
			args: [4],
		});
		await expect(
			call('functionCalls.get', {
				functionCallId: spawned.functionCallId,
				waitMs: 60_000,
			}),
		).resolves.toMatchObject({ status: 'completed', result: 16 });
		await call('functionCalls.logs', {
			functionCallId: spawned.functionCallId,
			entries: 10,
		});

		// A call still running after waitMs comes back pending; cancel it.
		const slow = { appName: liveApp, name: 'slow' };
		await expect(
			call('functions.call', { ...slow, args: [20], waitMs: 1000 }),
		).resolves.toMatchObject({ status: 'pending' });
		const longCall = await call<{ functionCallId: string }>('functions.spawn', {
			...slow,
			args: [30],
		});
		await call('functionCalls.cancel', {
			functionCallId: longCall.functionCallId,
			terminateContainers: true,
		});
		// Cancelling is asynchronous: the call reads "pending" until Modal
		// records it, then functionCalls.get fails with a RemoteError (502).
		let cancelled: { status?: number; message?: string } | undefined;
		for (let i = 0; i < 10 && !cancelled; i++) {
			cancelled = await tree.functionCalls
				?.get?.(ctx, {
					functionCallId: longCall.functionCallId,
					waitMs: 2000,
				})
				.then(
					() => undefined,
					(e: { status?: number; message?: string }) => e,
				);
		}
		results.push({
			op: 'functionCalls.get (cancelled)',
			ok: cancelled?.status === 502,
			note: `got ${cancelled?.status}: ${cancelled?.message?.slice(0, 100)}`,
		});
		expect(cancelled?.status).toBe(502);

		await call('functions.currentStats', target);
		await call('functions.stats', target);
		await call('functions.logs', { ...target, entries: 10 });
		const hourAgo = new Date(Date.now() - 3_600_000).toISOString();
		await call('functions.fetchLogs', { ...target, since: hourAgo });
		await call('functions.metricsSchema', target);
		await call('functions.metrics', { ...target, since: hourAgo });
		await expect(
			call('functions.updateAutoscaler', {
				...target,
				maxContainers: 1,
				scaledownWindowMs: 2000,
			}),
		).resolves.toMatchObject({ maxContainers: 1, scaledownWindowMs: 2000 });

		const greeter = { appName: liveApp, className: 'Greeter', method: 'greet' };
		await expect(
			call('classes.call', { ...greeter, args: ['corsair'] }),
		).resolves.toMatchObject({ status: 'completed', result: 'hello corsair' });
		await expect(
			call('classes.call', {
				...greeter,
				parameters: { greeting: 'hi' },
				kwargs: { name: 'ops' },
			}),
		).resolves.toMatchObject({ result: 'hi ops' });
		const classCall = await call<{ functionCallId: string }>('classes.spawn', {
			...greeter,
			args: ['spawned'],
		});
		await expect(
			call('functionCalls.get', {
				functionCallId: classCall.functionCallId,
				waitMs: 60_000,
			}),
		).resolves.toMatchObject({ result: 'hello spawned' });
	});

	it('images: build, publish, look up by name', async () => {
		await expectStatus('images.getByName', { name: names.image }, 404);
		const built = await call<{ imageId: string }>('images.build', {
			appName,
			image: {
				registry: 'alpine:3.21',
				dockerfileCommands: [
					'RUN apk add --no-cache busybox-extras && mkdir -p /www && echo hi > /www/index.html',
				],
			},
		});
		builtImageId = built.imageId;
		expect(builtImageId).toMatch(/^im-/);
		await call('images.publish', { imageId: builtImageId, name: names.image });
		await expect(
			call('images.getByName', { name: names.image }),
		).resolves.toEqual({ imageId: builtImageId });
	});

	it('sandbox: ports, connect tokens, directory snapshots, network policy', async () => {
		expect(builtImageId).toBeTruthy();
		const name = `${run}-web`;
		const web = await createExtraSandbox({
			name,
			image: { publishedName: names.image },
			encryptedPorts: [8080],
			// Starting open with explicit allow-all lists is what lets
			// updateNetworkPolicy restrict it later.
			outboundCidrAllowlist: ['0.0.0.0/0'],
			outboundDomainAllowlist: ['*'],
			command: ['busybox-extras', 'httpd', '-f', '-p', '8080', '-h', '/www'],
		});
		const id = web.sandboxId;
		expect(web.tunnels).toHaveLength(1);
		await call('sandboxes.waitUntilReady', {
			sandboxId: id,
			timeoutMs: 60_000,
		});
		await expect(
			call('sandboxes.getByName', { appName, name }),
		).resolves.toMatchObject({ sandboxId: id, running: true });

		const { tunnels } = await call<{ tunnels: { url: string }[] }>(
			'sandboxes.tunnels',
			{ sandboxId: id },
		);
		const page = await fetch(tunnels[0]?.url ?? '');
		expect([page.status, (await page.text()).trim()]).toEqual([200, 'hi']);
		const connect = await call<{ url: string; token: string }>(
			'sandboxes.createConnectToken',
			{ sandboxId: id, port: 8080 },
		);
		const viaToken = await fetch(connect.url, {
			headers: { Authorization: `Bearer ${connect.token}` },
		});
		expect(viaToken.status).toBe(200);

		await sh(id, 'mkdir -p /snap && echo snapped > /snap/f.txt');
		const dir = await call<{ imageId: string }>('sandboxes.snapshotDirectory', {
			sandboxId: id,
			path: '/snap',
			ttlMs: 3_600_000,
		});
		extraImages.add(dir.imageId);
		await call('sandboxes.mountImage', {
			sandboxId: id,
			path: '/mnt/snap',
			imageId: dir.imageId,
		});
		expect(await sh(id, 'cat /mnt/snap/f.txt')).toBe('snapped\n');
		await call('sandboxes.unmountImage', { sandboxId: id, path: '/mnt/snap' });
		await call('sandboxes.mountImage', { sandboxId: id, path: '/mnt/empty' });

		const probe =
			'for h in example.com modal.com; do wget -q -T 5 -O /dev/null https://$h && echo $h-ok || echo $h-blocked; done';
		expect(await sh(id, probe)).toBe('example.com-ok\nmodal.com-ok\n');
		await call('sandboxes.updateNetworkPolicy', {
			sandboxId: id,
			outboundCidrAllowlist: [],
			outboundDomainAllowlist: ['example.com'],
		});
		expect(await sh(id, probe)).toBe('example.com-ok\nmodal.com-blocked\n');
		await call('sandboxes.fetchLogs', {
			sandboxId: id,
			since: new Date(Date.now() - 600_000).toISOString(),
		});

		await call('sandboxes.terminate', { sandboxId: id });
		await call('images.delete', { imageId: dir.imageId });
		extraImages.delete(dir.imageId);
	});

	it('sandbox: memory snapshot and restore', async () => {
		const source = await createExtraSandbox({
			enableMemorySnapshot: true,
			command: ['sleep', '110'],
		});
		const id = source.sandboxId;
		await call('sandboxes.waitUntilReady', {
			sandboxId: id,
			timeoutMs: 60_000,
		});
		await sh(id, 'echo in-memory-snapshot > /tmp/m.txt');
		const { snapshotId } = await call<{ snapshotId: string }>(
			'sandboxes.snapshotMemory',
			{ sandboxId: id },
		);
		expect(snapshotId).toMatch(/^sn-/);
		// Taking the snapshot stops the sandbox.
		await expect(
			call('sandboxes.get', { sandboxId: id }),
		).resolves.toMatchObject({ running: false });
		const restored = await call<{ sandboxId: string }>(
			'sandboxes.restoreSnapshot',
			{ snapshotId, name: null },
		);
		extraSandboxes.add(restored.sandboxId);
		await expect(
			call('sandboxes.get', { sandboxId: restored.sandboxId }),
		).resolves.toMatchObject({ running: true });
		expect(await sh(restored.sandboxId, 'cat /tmp/m.txt')).toBe(
			'in-memory-snapshot\n',
		);
		await call('sandboxes.terminate', { sandboxId: restored.sandboxId });
		await call('sandboxes.terminate', { sandboxId: id });
	});

	it('sandbox: exit snapshot, v1 volume files', async () => {
		await call('volumes.create', { name: names.volumeV1, version: 1 });
		const job = await createExtraSandbox({
			enableExitSnapshot: true,
			timeoutMs: 60_000,
			volumes: { '/data': { name: names.volumeV1 } },
			command: [
				'sh',
				'-c',
				'echo v1 > /data/v1.txt && sync && echo done > /done.txt',
			],
		});
		await expect(
			call('sandboxes.wait', { sandboxId: job.sandboxId, timeoutMs: 60_000 }),
		).resolves.toMatchObject({ running: false, exitCode: 0 });
		const exit = await call<{ imageId: string }>('sandboxes.getExitSnapshot', {
			sandboxId: job.sandboxId,
		});
		expect(exit.imageId).toMatch(/^im-/);
		await call('images.delete', { imageId: exit.imageId });

		const files = await call<{ entries: { path: string }[] }>(
			'volumes.listFiles',
			{ name: names.volumeV1 },
		);
		expect(files.entries.map((e) => e.path)).toEqual(['v1.txt']);
		await call('volumes.removeFile', { name: names.volumeV1, path: 'v1.txt' });
		await expect(
			call('volumes.listFiles', { name: names.volumeV1 }),
		).resolves.toMatchObject({ entries: [] });
		await call('volumes.delete', { name: names.volumeV1 });
	});

	it('sandbox: V2 backend names, persistent sandboxes', async () => {
		const v2 = await createExtraSandbox({
			backend: 'v2',
			command: ['sleep', '110'],
		});
		await call('sandboxes.waitUntilReady', {
			sandboxId: v2.sandboxId,
			timeoutMs: 60_000,
		});
		await call('sandboxes.setName', {
			sandboxId: v2.sandboxId,
			name: `${run}-v2`,
		});
		await expect(
			call('sandboxes.getByName', {
				appName,
				name: `${run}-v2`,
				backend: 'v2',
			}),
		).resolves.toMatchObject({ sandboxId: v2.sandboxId, running: true });
		await call('sandboxes.terminate', { sandboxId: v2.sandboxId });

		// Persistent sandboxes (pause/resume) are not on every workspace yet.
		const persistent = await tree.sandboxes
			?.create?.(ctx, {
				appName,
				backend: 'v2',
				persistent: true,
				image: { registry: 'alpine:3.21' },
				cpu: 0.125,
				memoryMiB: 128,
				command: ['sleep', '110'],
			})
			.catch((e: { status?: number; message?: string }) => e);
		const refused = (persistent as { status?: number }).status === 403;
		results.push({
			op: 'sandboxes.create (persistent)',
			ok: true,
			note: refused
				? `403 on this workspace: ${(persistent as { message?: string }).message?.slice(0, 100)}`
				: 'created',
		});
		if (refused) return;
		const pid = (persistent as { sandboxId: string }).sandboxId;
		extraSandboxes.add(pid);
		await call('sandboxes.waitUntilReady', {
			sandboxId: pid,
			timeoutMs: 60_000,
		});
		await call('sandboxes.pause', { sandboxId: pid });
		await call('sandboxes.resume', { sandboxId: pid });
		expect(await sh(pid, 'echo resumed')).toBe('resumed\n');
		await call('sandboxes.terminate', { sandboxId: pid });
	});

	it('errors', async () => {
		// A malformed id is a 400; a well-formed one that does not exist a 404.
		await expectStatus(
			'sandboxes.get',
			{ sandboxId: 'sb-doesnotexist000000000' },
			400,
		);
		await expectStatus(
			'sandboxes.get',
			{ sandboxId: 'sb-0000000000000000000000' },
			404,
		);
		await expectStatus('proxies.get', { name: `${run}-proxy` }, 404);
		await expectStatus('volumes.get', { name: `${run}-missing` }, 404);
		await expectStatus('dicts.len', { name: `${run}-missing` }, 404);
		await expectStatus('queues.len', { name: `${run}-missing` }, 404);
	});
});
