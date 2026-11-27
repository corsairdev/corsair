// Live suite against a real Modal workspace. Needs MODAL_TOKEN_ID and
// MODAL_TOKEN_SECRET (optional MODAL_LIVE_ENVIRONMENT). It creates one small
// sandbox (0.125 CPU, 128 MiB, 2 minute timeout), a Secret, a Volume, a Queue
// and a Dict with a run-specific name, and deletes all of them at the end.
// Optional MODAL_LIVE_APP + MODAL_LIVE_FUNCTION name a deployed function to call.
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
	queue: `${run}-queue`,
	dict: `${run}-dict`,
};
let sandboxId: string | undefined;
let snapshotImageId: string | undefined;

describeLive('modal live', () => {
	jest.setTimeout(240_000);

	afterAll(async () => {
		const cleanup: [string, Record<string, unknown>][] = [];
		if (sandboxId) cleanup.push(['sandboxes.terminate', { sandboxId }]);
		if (snapshotImageId) {
			cleanup.push(['images.delete', { imageId: snapshotImageId }]);
		}
		cleanup.push(
			['secrets.delete', { name: names.secret, allowMissing: true }],
			['volumes.delete', { name: names.volume, allowMissing: true }],
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
		await call('dicts.clear', { name: names.dict });
		await expect(call('dicts.len', { name: names.dict })).resolves.toEqual({
			length: 0,
		});
	});

	it('functions', async () => {
		const liveApp = process.env.MODAL_LIVE_APP;
		const liveFunction = process.env.MODAL_LIVE_FUNCTION;
		if (!liveApp || !liveFunction) {
			await expectStatus(
				'functions.get',
				{ appName, name: 'does_not_exist' },
				404,
			);
			return;
		}
		const target = { appName: liveApp, name: liveFunction };
		await call('functions.get', target);
		await call('functions.info', target);
		const result = await call<{ status: string }>('functions.call', {
			...target,
			args: [3],
		});
		expect(result.status).toBe('completed');
		const spawned = await call<{ functionCallId: string }>('functions.spawn', {
			...target,
			args: [4],
		});
		await call('functionCalls.get', {
			functionCallId: spawned.functionCallId,
			waitMs: 60_000,
		});
		await call('functions.currentStats', target);
		await call('functions.stats', target);
		await call('functions.logs', { ...target, entries: 10 });
	});

	it('errors', async () => {
		await expectStatus(
			'sandboxes.get',
			{ sandboxId: 'sb-doesnotexist000000000' },
			404,
		);
		await expectStatus('volumes.get', { name: `${run}-missing` }, 404);
		await expectStatus('dicts.len', { name: `${run}-missing` }, 404);
		await expectStatus('queues.len', { name: `${run}-missing` }, 404);
	});
});
