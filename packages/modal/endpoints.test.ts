import { ApiError } from 'corsair/http';
import { setModalSdkLoader } from './client';
import { encodeDictKey } from './codec';
import {
	modalEndpointMeta,
	modalEndpointSchemas,
	modalEndpointsNested,
	modalOperations,
} from './endpoints';
import { operationKey } from './endpoints/shared';
import type { FakeSdk } from './tests/fake-sdk';
import { createFakeSdk } from './tests/fake-sdk';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn(async () => null),
}));

const actualSdk = jest.requireActual('modal');

let fake: FakeSdk;

beforeEach(() => {
	fake = createFakeSdk(actualSdk);
	setModalSdkLoader(async () => fake.sdk);
});

afterAll(() => setModalSdkLoader(undefined));

function ctx(options: Record<string, unknown> = {}) {
	return {
		key: 'as-test-secret',
		options,
		keys: { get_token_id: async () => 'ak-test-id' },
		$getAccountId: async () => 'account-1',
	};
}

type Endpoint = (ctx: unknown, input: unknown) => Promise<unknown>;

function endpoint(key: string): Endpoint {
	const [group, name] = key.split('.') as [string, string];
	const tree = modalEndpointsNested as unknown as Record<
		string,
		Record<string, Endpoint>
	>;
	const fn = tree[group]?.[name];
	if (!fn) throw new Error(`no endpoint ${key}`);
	return fn;
}

function run(key: string, input: unknown, options?: Record<string, unknown>) {
	return endpoint(key)(ctx(options), input);
}

const LOGS = [
	{
		message: 'hello\n',
		source: 'stdout',
		timestamp: '2026-11-27T10:00:00.000Z',
		objectId: 'sb-1',
	},
];

type Case = {
	input: unknown;
	check: (output: unknown, fake: FakeSdk) => void | Promise<void>;
	setup?: (fake: FakeSdk) => void;
};

const fnTarget = { appName: 'my-app', name: 'square' };

const CASES: Record<string, Case> = {
	'apps.get': {
		input: { name: 'my-app' },
		check: (out, f) => {
			expect(f.callsTo('apps.fromName')[0]).toEqual([
				'my-app',
				{ createIfMissing: false },
			]);
			expect(out).toEqual({
				appId: 'ap-1',
				name: 'my-app',
				environmentName: 'main',
			});
		},
	},
	'apps.create': {
		input: { name: 'my-app' },
		check: (_out, f) =>
			expect(f.callsTo('apps.fromName')[0]).toEqual([
				'my-app',
				{ createIfMissing: true },
			]),
	},
	'apps.list': {
		input: {},
		check: (out, f) => {
			expect(f.callsTo('environments.fromContext')).toHaveLength(1);
			expect(out).toEqual({
				apps: [{ appId: 'ap-1', name: 'my-app', environmentName: 'main' }],
				truncated: false,
			});
		},
	},
	'apps.info': {
		input: { name: 'my-app' },
		check: (out, f) => {
			expect(f.callsTo('app.info')[0]).toEqual([{ refresh: true }]);
			expect(out).toMatchObject({
				appId: 'ap-1',
				lifecycle: { state: 'deployed', createdAt: '2026-11-01T00:00:00.000Z' },
				functions: { square: 'fu-1' },
			});
		},
	},
	'apps.stats': {
		input: { name: 'my-app', since: '2026-11-27T09:00:00Z' },
		check: (out, f) => {
			const [params] = f.callsTo('app.stats')[0] as [{ since: Date }];
			expect(params.since.toISOString()).toBe('2026-11-27T09:00:00.000Z');
			expect(out).toMatchObject({
				sandboxes: { total: 2, finished: 1, live: 1 },
				deploymentCount: 3,
			});
		},
	},
	'apps.sandboxStats': {
		input: {
			name: 'my-app',
			since: '2026-11-26T00:00:00Z',
			groupByTags: ['team'],
		},
		check: (out, f) => {
			const [params] = f.callsTo('app.sandboxes.stats')[0] as [
				{ groupByTags: string[] },
			];
			expect(params.groupByTags).toEqual(['team']);
			expect(out).toEqual({
				groups: [
					{
						tags: { team: 'a' },
						cost: '0.0100',
						costByResource: { CPU: '0.0100' },
					},
				],
			});
		},
	},
	'apps.stop': {
		input: { name: 'my-app' },
		check: (out, f) => {
			expect(f.callsTo('app.stop')).toHaveLength(1);
			expect(out).toEqual({ ok: true });
		},
	},
	'environments.get': {
		input: { name: 'dev' },
		check: (out, f) => {
			expect(f.callsTo('environments.fromName')[0]).toEqual(['dev']);
			expect(out).toEqual({ environmentId: 'en-1', name: 'main' });
		},
	},
	'environments.getDefault': {
		input: {},
		check: (_out, f) =>
			expect(f.callsTo('environments.fromContext')).toHaveLength(1),
	},
	'environments.list': {
		input: {},
		check: (out) =>
			expect(out).toEqual({
				environments: [{ environmentId: 'en-1', name: 'main' }],
				truncated: false,
			}),
	},
	'environments.create': {
		input: { name: 'dev', restricted: true },
		check: (_out, f) =>
			expect(f.callsTo('environments.objects.create')[0]).toEqual([
				'dev',
				{ restricted: true, defaultRole: undefined },
			]),
	},
	'environments.delete': {
		input: { name: 'dev' },
		check: (_out, f) =>
			expect(f.callsTo('environments.objects.delete')[0]).toEqual(['dev']),
	},
	'sandboxes.create': {
		input: {
			image: {
				registry: 'alpine:3.21',
				dockerfileCommands: ['RUN apk add curl'],
			},
			command: ['sleep', '60'],
			cpu: 0.25,
			memoryMiB: 256,
			timeoutMs: 60_000,
			secrets: ['openai'],
			volumes: { '/data': { name: 'data', readOnly: true } },
			encryptedPorts: [8080],
			readinessProbe: { tcpPort: 8080 },
			tags: { run: 'test' },
		},
		check: (out, f) => {
			expect(f.callsTo('apps.fromName')[0]).toEqual([
				'corsair-sandboxes',
				{ createIfMissing: true },
			]);
			expect(f.callsTo('images.fromRegistry')[0]).toEqual([
				'alpine:3.21',
				undefined,
			]);
			expect(f.callsTo('image.dockerfileCommands')[0]?.[0]).toEqual([
				'RUN apk add curl',
			]);
			expect(f.callsTo('volume.withMountOptions')[0]).toEqual([
				{ readOnly: true, subPath: undefined },
			]);
			const [, , params] = f.callsTo('sandboxes.create')[0] as [
				unknown,
				unknown,
				Record<string, unknown>,
			];
			expect(params).toMatchObject({
				command: ['sleep', '60'],
				cpu: 0.25,
				memoryMiB: 256,
				timeoutMs: 60_000,
				encryptedPorts: [8080],
				tags: { run: 'test' },
			});
			expect(params.secrets).toEqual([{ secretId: 'st-1', name: 'openai' }]);
			expect(params.readinessProbe).toBeInstanceOf(actualSdk.Probe);
			expect(out).toEqual({
				sandboxId: 'sb-1',
				appId: 'ap-1',
				tunnels: [
					{
						port: 8080,
						host: 'abc.modal.host',
						url: 'https://abc.modal.host',
						tlsPort: 443,
						unencryptedHost: 'r.modal.host',
						unencryptedPort: 40001,
					},
				],
			});
		},
	},
	'sandboxes.get': {
		input: { sandboxId: 'sb-1' },
		check: (out) =>
			expect(out).toEqual({ sandboxId: 'sb-1', running: true, exitCode: null }),
	},
	'sandboxes.getByName': {
		input: { appName: 'my-app', name: 'worker', backend: 'v2' },
		check: (_out, f) =>
			expect(f.callsTo('sandboxes.experimentalFromName')[0]).toEqual([
				'my-app',
				'worker',
				{ includeTerminated: undefined },
			]),
	},
	'sandboxes.list': {
		input: { appName: 'my-app', tags: { run: 'test' } },
		check: (out, f) => {
			expect(f.callsTo('sandboxes.list')[0]).toEqual([
				{ appId: 'ap-1', tags: { run: 'test' } },
			]);
			expect(out).toEqual({
				sandboxes: [{ sandboxId: 'sb-1' }],
				truncated: false,
			});
		},
	},
	'sandboxes.exec': {
		input: {
			sandboxId: 'sb-1',
			command: ['cat'],
			stdin: 'hi',
			timeoutMs: 5000,
		},
		check: (out, f) => {
			const [command, params] = f.callsTo('sandbox.exec')[0] as [
				string[],
				Record<string, unknown>,
			];
			expect(command).toEqual(['cat']);
			expect(params).toMatchObject({
				mode: 'text',
				stdout: 'pipe',
				stderr: 'pipe',
				timeoutMs: 5000,
			});
			expect(out).toEqual({
				exitCode: 0,
				stdout: 'out\n',
				stderr: 'err\n',
				stdoutTruncated: false,
				stderrTruncated: false,
			});
		},
	},
	'sandboxes.terminate': {
		input: { sandboxId: 'sb-1', wait: true },
		check: (out) => expect(out).toEqual({ terminated: true, exitCode: 137 }),
	},
	'sandboxes.wait': {
		input: { sandboxId: 'sb-1', timeoutMs: 1000 },
		check: (out) =>
			expect(out).toEqual({ sandboxId: 'sb-1', running: false, exitCode: 0 }),
	},
	'sandboxes.waitUntilReady': {
		input: { sandboxId: 'sb-1', timeoutMs: 2000 },
		check: (out, f) => {
			expect(f.callsTo('sandbox.waitUntilReady')[0]).toEqual([2000]);
			expect(out).toEqual({ ready: true });
		},
	},
	'sandboxes.tunnels': {
		input: { sandboxId: 'sb-1' },
		check: (out) =>
			expect(out).toMatchObject({
				tunnels: [{ port: 8080, url: 'https://abc.modal.host' }],
			}),
	},
	'sandboxes.getTags': {
		input: { sandboxId: 'sb-1' },
		check: (out) => expect(out).toEqual({ tags: { team: 'corsair' } }),
	},
	'sandboxes.setTags': {
		input: { sandboxId: 'sb-1', tags: { a: 'b' } },
		check: (_out, f) =>
			expect(f.callsTo('sandbox.setTags')[0]).toEqual([{ a: 'b' }]),
	},
	'sandboxes.setName': {
		input: { sandboxId: 'sb-1', name: 'worker' },
		check: (_out, f) =>
			expect(f.callsTo('sandbox.experimentalSetName')[0]).toEqual(['worker']),
	},
	'sandboxes.createConnectToken': {
		input: { sandboxId: 'sb-1', port: 3000 },
		check: (out, f) => {
			expect(f.callsTo('sandbox.createConnectToken')[0]).toEqual([
				{ port: 3000, userMetadata: undefined },
			]);
			expect(out).toEqual({ url: 'https://sb-1.modal.run', token: 'tok' });
		},
	},
	'sandboxes.snapshotFilesystem': {
		input: { sandboxId: 'sb-1', ttlMs: null },
		check: (out, f) => {
			expect(f.callsTo('sandbox.snapshotFilesystem')[0]).toEqual([
				{ timeoutMs: undefined, ttlMs: null },
			]);
			expect(out).toEqual({ imageId: 'im-1' });
		},
	},
	'sandboxes.snapshotDirectory': {
		input: { sandboxId: 'sb-1', path: '/work' },
		check: (_out, f) =>
			expect(f.callsTo('sandbox.snapshotDirectory')[0]?.[0]).toBe('/work'),
	},
	'sandboxes.snapshotMemory': {
		input: { sandboxId: 'sb-1' },
		check: (out) => expect(out).toEqual({ snapshotId: 'sn-1' }),
	},
	'sandboxes.restoreSnapshot': {
		input: { snapshotId: 'sn-1', name: null },
		check: (out, f) => {
			expect(f.callsTo('sandboxes.experimentalFromSnapshot')[0]).toEqual([
				{ snapshotId: 'sn-1' },
				{ name: null },
			]);
			expect(out).toEqual({ sandboxId: 'sb-1' });
		},
	},
	'sandboxes.getExitSnapshot': {
		input: { sandboxId: 'sb-1', timeoutMs: 0 },
		check: (out, f) => {
			expect(f.callsTo('sandbox.experimentalGetExitSnapshot')[0]).toEqual([
				{ timeoutMs: 0 },
			]);
			expect(out).toEqual({ imageId: 'im-1' });
		},
	},
	'sandboxes.mountImage': {
		input: { sandboxId: 'sb-1', path: '/mnt', imageId: 'im-1' },
		check: (_out, f) => {
			expect(f.callsTo('images.fromId')[0]).toEqual(['im-1']);
			expect(f.callsTo('sandbox.mountImage')[0]?.[0]).toBe('/mnt');
		},
	},
	'sandboxes.unmountImage': {
		input: { sandboxId: 'sb-1', path: '/mnt' },
		check: (_out, f) =>
			expect(f.callsTo('sandbox.unmountImage')[0]).toEqual(['/mnt']),
	},
	'sandboxes.updateNetworkPolicy': {
		input: {
			sandboxId: 'sb-1',
			outboundCidrAllowlist: [],
			outboundDomainAllowlist: ['pypi.org'],
		},
		check: (_out, f) =>
			expect(f.callsTo('sandbox.updateNetworkPolicy')[0]).toEqual([
				{ outboundCidrAllowlist: [], outboundDomainAllowlist: ['pypi.org'] },
			]),
	},
	'sandboxes.reloadVolumes': {
		input: { sandboxId: 'sb-1' },
		check: (_out, f) =>
			expect(f.callsTo('sandbox.reloadVolumes')).toHaveLength(1),
	},
	'sandboxes.pause': {
		input: { sandboxId: 'sb-1' },
		check: (_out, f) =>
			expect(f.callsTo('sandbox.experimentalPause')).toHaveLength(1),
	},
	'sandboxes.resume': {
		input: { sandboxId: 'sb-1' },
		check: (_out, f) =>
			expect(f.callsTo('sandbox.experimentalResume')).toHaveLength(1),
	},
	'sandboxes.logs': {
		input: { sandboxId: 'sb-1', entries: 10 },
		check: (out, f) => {
			expect(f.callsTo('sandbox.logs.tail')[0]).toEqual([
				{ entries: 10, source: undefined },
			]);
			expect(out).toEqual({ entries: LOGS });
		},
	},
	'sandboxes.fetchLogs': {
		input: {
			sandboxId: 'sb-1',
			since: '2026-11-27T09:00:00Z',
			searchText: 'x',
		},
		check: (out, f) => {
			const [params] = f.callsTo('sandbox.logs.fetch')[0] as [
				{ since: Date; searchText: string },
			];
			expect(params.since).toBeInstanceOf(Date);
			expect(params.searchText).toBe('x');
			expect(out).toEqual({ entries: LOGS });
		},
	},
	'files.read': {
		input: { sandboxId: 'sb-1', path: '/tmp/a.txt', encoding: 'base64' },
		check: (out) =>
			expect(out).toEqual({
				path: '/tmp/a.txt',
				encoding: 'base64',
				content: Buffer.from('hello').toString('base64'),
				size: 5,
			}),
	},
	'files.write': {
		input: { sandboxId: 'sb-1', path: '/tmp/a.txt', content: 'hé' },
		check: (out, f) => {
			const [bytes, path] = f.callsTo('fs.writeBytes')[0] as [
				Uint8Array,
				string,
			];
			expect(Buffer.from(bytes).toString('utf8')).toBe('hé');
			expect(path).toBe('/tmp/a.txt');
			expect(out).toEqual({ path: '/tmp/a.txt', bytesWritten: 3 });
		},
	},
	'files.list': {
		input: { sandboxId: 'sb-1', path: '/tmp' },
		check: (out) =>
			expect(out).toMatchObject({ entries: [{ name: 'a.txt', type: 'file' }] }),
	},
	'files.stat': {
		input: { sandboxId: 'sb-1', path: '/tmp/a.txt' },
		check: (out) =>
			expect(out).toMatchObject({ path: '/tmp/a.txt', size: 5, owner: 'root' }),
	},
	'files.makeDirectory': {
		input: { sandboxId: 'sb-1', path: '/tmp/x/y', createParents: true },
		check: (_out, f) =>
			expect(f.callsTo('fs.makeDirectory')[0]).toEqual([
				'/tmp/x/y',
				{ createParents: true },
			]),
	},
	'files.remove': {
		input: { sandboxId: 'sb-1', path: '/tmp/x', recursive: true },
		check: (_out, f) =>
			expect(f.callsTo('fs.remove')[0]).toEqual([
				'/tmp/x',
				{ recursive: true },
			]),
	},
	'images.build': {
		input: {
			image: {
				registry: 'my.ecr/app:1',
				registryType: 'aws_ecr',
				registrySecret: 'aws',
			},
		},
		check: (out, f) => {
			expect(f.callsTo('images.fromAwsEcr')[0]?.[0]).toBe('my.ecr/app:1');
			expect(f.callsTo('image.build')).toHaveLength(1);
			expect(out).toEqual({ imageId: 'im-1' });
		},
	},
	'images.get': {
		input: { imageId: 'im-1' },
		check: (out) => expect(out).toEqual({ imageId: 'im-1' }),
	},
	'images.getByName': {
		input: { name: 'base' },
		check: (_out, f) =>
			expect(f.callsTo('images.fromName')[0]).toEqual(['base']),
	},
	'images.publish': {
		input: { imageId: 'im-1', name: 'base' },
		check: (_out, f) => expect(f.callsTo('image.publish')[0]).toEqual(['base']),
	},
	'images.delete': {
		input: { imageId: 'im-1' },
		check: (_out, f) => expect(f.callsTo('images.delete')[0]).toEqual(['im-1']),
	},
	'functions.get': {
		input: fnTarget,
		check: (out, f) => {
			expect(f.callsTo('functions.fromName')[0]).toEqual([
				'my-app',
				'square',
				{ version: undefined },
			]);
			expect(out).toEqual({
				functionId: 'fu-1',
				webUrl: 'https://x.modal.run',
			});
		},
	},
	'functions.info': {
		input: { functionId: 'fu-1' },
		check: (out, f) => {
			expect(f.callsTo('functions.fromId')[0]).toEqual(['fu-1']);
			expect(out).toMatchObject({
				cpu: 1,
				volumes: { '/data': { volumeId: 'vo-1', readOnly: false } },
			});
		},
	},
	'functions.call': {
		input: {
			...fnTarget,
			args: [4],
			kwargs: { verbose: true },
			options: { gpu: 'T4', secrets: ['hf'] },
			waitMs: 1000,
		},
		check: (out, f) => {
			const [options] = f.callsTo('function.withOptions')[0] as [
				Record<string, unknown>,
			];
			expect(options.gpu).toBe('T4');
			expect(options.secrets).toEqual([{ secretId: 'st-1', name: 'hf' }]);
			expect(f.callsTo('function.instance')).toHaveLength(1);
			expect(f.callsTo('boundFunction.spawn')[0]).toEqual([
				[4],
				{ verbose: true },
			]);
			expect(f.callsTo('function.spawn')).toHaveLength(0);
			expect(f.callsTo('functionCall.get')[0]).toEqual([{ timeoutMs: 1000 }]);
			expect(out).toEqual({
				functionCallId: 'fc-1',
				status: 'completed',
				result: { answer: 42 },
			});
		},
	},
	'functions.spawn': {
		input: { functionId: 'fu-1', args: [1], options: { timeoutMs: 5000 } },
		check: (out, f) => {
			const [options] = f.callsTo('function.withOptions')[0] as [
				Record<string, unknown>,
			];
			expect(options.timeoutMs).toBe(5000);
			expect(f.callsTo('function.instance')).toHaveLength(1);
			expect(f.callsTo('boundFunction.spawn')[0]).toEqual([[1], {}]);
			expect(f.callsTo('function.spawn')).toHaveLength(0);
			expect(out).toEqual({ functionCallId: 'fc-1' });
		},
	},
	'functions.stats': {
		input: { functionId: 'fu-1', allVariants: true },
		check: (out) =>
			expect(out).toMatchObject({
				since: '1970-01-01T00:00:00.000Z',
				inputSuccessCount: 1,
			}),
	},
	'functions.currentStats': {
		input: { functionId: 'fu-1' },
		check: (out) => expect(out).toEqual({ backlog: 0, numTotalRunners: 1 }),
	},
	'functions.updateAutoscaler': {
		input: { functionId: 'fu-1', minContainers: 0, maxContainers: 2 },
		check: (out) =>
			expect(out).toMatchObject({ minContainers: 0, maxContainers: 2 }),
	},
	'functions.logs': {
		input: { functionId: 'fu-1', entries: 5, source: 'stderr' },
		check: (out, f) => {
			expect(f.callsTo('function.logs.tail')[0]).toEqual([
				{ entries: 5, source: 'stderr' },
			]);
			expect(out).toEqual({ entries: LOGS });
		},
	},
	'functions.fetchLogs': {
		input: { functionId: 'fu-1', since: '2026-11-27T00:00:00Z' },
		check: (out) => expect(out).toEqual({ entries: LOGS }),
	},
	'functions.metrics': {
		input: { functionId: 'fu-1', groups: ['container'] },
		check: (out) =>
			expect(out).toMatchObject({ objectId: 'fu-1', bucketSizeSecs: 60 }),
	},
	'functions.metricsSchema': {
		input: { functionId: 'fu-1' },
		check: (out) => expect(out).toHaveProperty('container'),
	},
	'classes.call': {
		input: {
			appName: 'my-app',
			className: 'Model',
			method: 'predict',
			parameters: { size: 'small' },
			args: ['hi'],
			waitMs: 0,
		},
		check: (out, f) => {
			expect(f.callsTo('cls.fromName')[0]).toEqual([
				'my-app',
				'Model',
				{ version: undefined },
			]);
			expect(f.callsTo('cls.instance')[0]).toEqual([{ size: 'small' }]);
			expect(f.callsTo('clsInstance.method')[0]).toEqual(['predict']);
			expect(out).toMatchObject({
				functionCallId: 'fc-1',
				status: 'completed',
			});
		},
	},
	'classes.spawn': {
		input: { appName: 'my-app', className: 'Model', method: 'predict' },
		check: (out) => expect(out).toEqual({ functionCallId: 'fc-1' }),
	},
	'functionCalls.get': {
		input: { functionCallId: 'fc-1' },
		setup: (f) =>
			f.setResult('functionCall.get', () => {
				throw new actualSdk.TimeoutError('Timeout exceeded: 0ms');
			}),
		check: (out, f) => {
			expect(f.callsTo('functionCall.get')[0]).toEqual([{ timeoutMs: 0 }]);
			expect(out).toEqual({ functionCallId: 'fc-1', status: 'pending' });
		},
	},
	'functionCalls.cancel': {
		input: { functionCallId: 'fc-1', terminateContainers: true },
		check: (_out, f) =>
			expect(f.callsTo('functionCall.cancel')[0]).toEqual([
				{ terminateContainers: true },
			]),
	},
	'functionCalls.logs': {
		input: { functionCallId: 'fc-1' },
		check: (out) => expect(out).toEqual({ entries: LOGS }),
	},
	'volumes.get': {
		input: { name: 'data' },
		check: (out) => expect(out).toEqual({ volumeId: 'vo-1', name: 'data' }),
	},
	'volumes.create': {
		input: { name: 'data', version: 2 },
		check: (_out, f) =>
			expect(f.callsTo('volumes.fromName')[0]).toEqual([
				'data',
				{ createIfMissing: true, version: 2 },
			]),
	},
	'volumes.list': {
		input: { environment: 'dev' },
		check: (out, f) => {
			expect(f.callsTo('rpc.volumeList')[0]).toEqual([
				{
					environmentName: 'dev',
					pagination: { maxObjects: 100, createdBefore: 0 },
				},
			]);
			expect(out).toEqual({
				volumes: [
					{
						volumeId: 'vo-1',
						name: 'data',
						createdAt: '2026-09-21T14:13:20.000Z',
						createdBy: 'pranay',
						version: 2,
					},
				],
			});
		},
	},
	'volumes.delete': {
		input: { name: 'data', allowMissing: true },
		check: (_out, f) =>
			expect(f.callsTo('volumes.delete')[0]).toEqual([
				'data',
				{ allowMissing: true },
			]),
	},
	'volumes.listFiles': {
		input: { name: 'data', path: '/', recursive: true },
		check: (out, f) => {
			expect(f.callsTo('rpc.volumeListFiles2')[0]).toEqual([
				{ volumeId: 'vo-1', path: '/', recursive: true, maxEntries: 1001 },
			]);
			expect(f.callsTo('rpc.volumeListFiles')).toHaveLength(0);
			expect(out).toEqual({
				entries: [
					{
						path: 'a.txt',
						type: 'file',
						size: 5,
						mtime: '2026-09-21T14:13:20.000Z',
					},
				],
				truncated: false,
			});
		},
	},
	'volumes.removeFile': {
		input: { name: 'data', path: 'a.txt' },
		setup: (f) =>
			f.setResult('rpc.volumeGetOrCreate', () => ({
				volumeId: 'vo-1',
				version: 1,
				metadata: { version: 1 },
			})),
		check: (_out, f) => {
			expect(f.callsTo('rpc.volumeRemoveFile')[0]).toEqual([
				{ volumeId: 'vo-1', path: 'a.txt', recursive: false },
			]);
			expect(f.callsTo('rpc.volumeRemoveFile2')).toHaveLength(0);
		},
	},
	'secrets.get': {
		input: { name: 'openai', requiredKeys: ['OPENAI_API_KEY'] },
		check: (out, f) => {
			expect(f.callsTo('secrets.fromName')[0]).toEqual([
				'openai',
				{ requiredKeys: ['OPENAI_API_KEY'] },
			]);
			expect(out).toEqual({ secretId: 'st-1', name: 'openai' });
		},
	},
	'secrets.list': {
		input: {},
		check: (out) =>
			expect(out).toEqual({
				secrets: [
					{
						secretId: 'st-1',
						name: 'openai',
						keys: ['OPENAI_API_KEY'],
						createdAt: '2026-09-21T14:13:20.000Z',
					},
				],
			}),
	},
	'secrets.create': {
		input: { name: 'svc', values: { TOKEN: 'v' }, overwrite: true },
		check: (out, f) => {
			expect(f.callsTo('rpc.secretGetOrCreate')[0]).toEqual([
				{
					deploymentName: 'svc',
					environmentName: '',
					objectCreationType: 3,
					envDict: { TOKEN: 'v' },
				},
			]);
			expect(out).toEqual({ secretId: 'st-2', name: 'svc' });
		},
	},
	'secrets.delete': {
		input: { name: 'svc' },
		check: (_out, f) =>
			expect(f.callsTo('secrets.delete')[0]).toEqual([
				'svc',
				{ allowMissing: undefined },
			]),
	},
	'queues.create': {
		input: { name: 'jobs' },
		check: (out, f) => {
			expect(f.callsTo('queues.fromName')[0]).toEqual([
				'jobs',
				{ createIfMissing: true },
			]);
			expect(out).toEqual({ queueId: 'qu-1', name: 'jobs' });
		},
	},
	'queues.list': {
		input: {},
		check: (out) =>
			expect(out).toMatchObject({
				queues: [{ queueId: 'qu-1', name: 'jobs', totalSize: 2 }],
			}),
	},
	'queues.delete': {
		input: { name: 'jobs' },
		check: (_out, f) => expect(f.callsTo('queues.delete')[0]?.[0]).toBe('jobs'),
	},
	'queues.put': {
		input: { name: 'jobs', values: [{ a: 1 }, 'b'], partition: 'p1' },
		check: (out, f) => {
			const [request] = f.callsTo('rpc.queuePut')[0] as [
				{ queueId: string; values: Uint8Array[]; partitionKey: Uint8Array },
			];
			expect(request).toMatchObject({
				queueId: 'qu-1',
				partitionTtlSeconds: 86_400,
			});
			expect(Buffer.from(request.partitionKey).toString()).toBe('p1');
			// CPython: pickle.dumps({'a': 1}, 4) and pickle.dumps('b', 4)
			expect(request.values.map((v) => Buffer.from(v).toString('hex'))).toEqual(
				[
					'8004950a000000000000007d948c0161944b01732e',
					'80049505000000000000008c0162942e',
				],
			);
			expect(out).toEqual({ count: 2 });
		},
	},
	'queues.get': {
		input: { name: 'jobs', count: 2 },
		check: (out, f) => {
			expect(f.callsTo('rpc.queueGet')[0]).toEqual([
				{
					queueId: 'qu-1',
					partitionKey: new Uint8Array(),
					timeout: 0,
					nValues: 2,
				},
			]);
			expect(out).toEqual({ values: [{ job: 1 }] });
		},
	},
	'queues.peek': {
		input: { name: 'jobs', limit: 1 },
		check: (out) => expect(out).toEqual({ values: [1], truncated: true }),
	},
	'queues.len': {
		input: { name: 'jobs', total: true },
		check: (out) => expect(out).toEqual({ length: 2 }),
	},
	'queues.clear': {
		input: { name: 'jobs', all: true },
		check: (_out, f) =>
			expect(f.callsTo('queue.clear')[0]).toEqual([
				{ partition: undefined, all: true },
			]),
	},
	'dicts.create': {
		input: { name: 'cache' },
		check: (out, f) => {
			expect(f.callsTo('rpc.dictGetOrCreate')[0]).toEqual([
				{ deploymentName: 'cache', environmentName: '', objectCreationType: 1 },
			]);
			expect(out).toEqual({ dictId: 'di-1', name: 'cache' });
		},
	},
	'dicts.list': {
		input: {},
		check: (out) =>
			expect(out).toMatchObject({ dicts: [{ dictId: 'di-1', name: 'cache' }] }),
	},
	'dicts.delete': {
		input: { name: 'cache' },
		check: (_out, f) => {
			expect(f.callsTo('rpc.dictGetOrCreate')[0]?.[0]).toMatchObject({
				objectCreationType: 0,
			});
			expect(f.callsTo('rpc.dictDelete')[0]).toEqual([{ dictId: 'di-1' }]);
		},
	},
	'dicts.get': {
		input: { name: 'cache', key: 'user:1' },
		setup: (f) =>
			f.setResult('rpc.dictGet', () => ({
				found: true,
				// pickle.dumps({'n': 1}, protocol=4) from CPython
				value: Buffer.from('8004950a000000000000007d948c016e944b01732e', 'hex'),
			})),
		check: (out, f) => {
			const [request] = f.callsTo('rpc.dictGet')[0] as [{ key: Uint8Array }];
			expect(Buffer.from(request.key)).toEqual(
				Buffer.from(encodeDictKey('user:1')),
			);
			expect(out).toEqual({ found: true, value: { n: 1 } });
		},
	},
	'dicts.put': {
		input: { name: 'cache', key: 7, value: [1, 'a'], skipIfExists: true },
		check: (out, f) => {
			const [request] = f.callsTo('rpc.dictUpdate')[0] as [
				{
					updates: { key: Uint8Array; value: Uint8Array }[];
					ifNotExists: boolean;
				},
			];
			expect(request.ifNotExists).toBe(true);
			expect(Buffer.from(request.updates[0]?.key ?? []).toString('hex')).toBe(
				'80044b072e',
			);
			expect(out).toEqual({ created: true });
		},
	},
	'dicts.update': {
		input: {
			name: 'cache',
			entries: [
				{ key: 'a', value: 1 },
				{ key: 'b', value: null },
			],
		},
		check: (out, f) => {
			const [request] = f.callsTo('rpc.dictUpdate')[0] as [
				{ updates: unknown[] },
			];
			expect(request.updates).toHaveLength(2);
			expect(out).toEqual({ count: 2 });
		},
	},
	'dicts.pop': {
		input: { name: 'cache', key: 'gone' },
		check: (out) => expect(out).toEqual({ found: false }),
	},
	'dicts.contains': {
		input: { name: 'cache', key: true },
		check: (out) => expect(out).toEqual({ found: true }),
	},
	'dicts.len': {
		input: { name: 'cache' },
		check: (out) => expect(out).toEqual({ length: 3 }),
	},
	'dicts.items': {
		input: { name: 'cache' },
		setup: (f) =>
			f.setResult('rpc.dictContents', () => [
				{
					// CPython pickles of 'abc' and 1.5
					key: Buffer.from('80049507000000000000008c03616263942e', 'hex'),
					value: Buffer.from(
						'8004950a00000000000000473ff80000000000002e',
						'hex',
					),
				},
			]),
		check: (out) =>
			expect(out).toEqual({
				entries: [{ key: 'abc', value: 1.5 }],
				truncated: false,
			}),
	},
	'dicts.clear': {
		input: { name: 'cache' },
		check: (_out, f) =>
			expect(f.callsTo('rpc.dictClear')[0]).toEqual([{ dictId: 'di-1' }]),
	},
	'proxies.get': {
		input: { name: 'static-ip' },
		check: (out) => expect(out).toEqual({ proxyId: 'pr-1' }),
	},
};

describe('modal endpoints', () => {
	const keys = modalOperations.map(operationKey);

	it('has 95 operations with unique keys, one handler, meta and schema each', () => {
		expect(keys).toHaveLength(95);
		expect(new Set(keys).size).toBe(keys.length);
		for (const key of keys) {
			expect(typeof endpoint(key)).toBe('function');
			expect(
				modalEndpointMeta[key as keyof typeof modalEndpointMeta],
			).toBeDefined();
			expect(modalEndpointSchemas[key]).toBeDefined();
		}
		expect(Object.keys(modalEndpointMeta).sort()).toEqual([...keys].sort());
	});

	it('has a test case for every operation', () => {
		expect(Object.keys(CASES).sort()).toEqual([...keys].sort());
	});

	it.each(Object.entries(CASES))('%s', async (key, testCase) => {
		testCase.setup?.(fake);
		const output = await run(key, testCase.input);
		await testCase.check(output, fake);
		// one client per call, closed afterwards, from the account's credentials
		expect(fake.clients).toHaveLength(1);
		expect(fake.clients[0]?.closed).toBe(true);
		expect(fake.clients[0]?.params).toMatchObject({
			tokenId: 'ak-test-id',
			tokenSecret: 'as-test-secret',
		});
	});
});

describe('credentials and environment', () => {
	it('uses the account token id and secret, and clears the host environment', async () => {
		await run('apps.get', { name: 'my-app' });
		const client = fake.clients[0];
		expect(client?.params).toEqual({
			tokenId: 'ak-test-id',
			tokenSecret: 'as-test-secret',
			environment: undefined,
			logLevel: 'warn',
		});
		// the fake starts with environment "host-env", as MODAL_ENVIRONMENT would
		expect(client?.profile.environment).toBeUndefined();
	});

	it('prefers the input environment over the plugin option', async () => {
		await run('volumes.list', { environment: 'dev' }, { environment: 'prod' });
		expect(fake.clients[0]?.params.environment).toBe('dev');
		await run('volumes.list', {}, { environment: 'prod' });
		expect(fake.clients[1]?.params.environment).toBe('prod');
	});

	it('uses the tokenId option before the stored token_id', async () => {
		await run('apps.get', { name: 'x' }, { tokenId: 'ak-option' });
		expect(fake.clients[0]?.params.tokenId).toBe('ak-option');
	});

	it('fails without a token id', async () => {
		const noId = { ...ctx(), keys: { get_token_id: async () => null } };
		await expect(endpoint('apps.get')(noId, { name: 'x' })).rejects.toThrow(
			/api_key/,
		);
		expect(fake.clients).toHaveLength(0);
	});
});

describe('inputs and errors', () => {
	it('rejects an image spec with two sources', async () => {
		await expect(
			run('sandboxes.create', { image: { registry: 'a', imageId: 'im-1' } }),
		).rejects.toThrow(/exactly one/);
	});

	it('rejects a function target that is neither an id nor app and name', async () => {
		await expect(run('functions.get', { appName: 'only' })).rejects.toThrow(
			/functionId/,
		);
	});

	it('maps a gRPC NOT_FOUND from a raw call to a 404 ApiError', async () => {
		fake.setResult('rpc.dictGetOrCreate', () => {
			throw Object.assign(new Error('/DictGetOrCreate NOT_FOUND'), {
				code: 5,
				details: "Dict 'nope' not found",
			});
		});
		const error = (await run('dicts.len', { name: 'nope' }).catch(
			(e: unknown) => e,
		)) as ApiError;
		expect(error).toBeInstanceOf(ApiError);
		expect(error.status).toBe(404);
		expect(fake.clients[0]?.closed).toBe(true);
	});

	it('maps SDK errors by class', async () => {
		fake.setResult('sandboxes.fromId', () => {
			throw new actualSdk.ResourceExhaustedError('capacity');
		});
		const error = (await run('sandboxes.get', { sandboxId: 'sb-9' }).catch(
			(e: unknown) => e,
		)) as ApiError;
		expect(error).toBeInstanceOf(ApiError);
		expect(error.status).toBe(429);
		expect(error.message).toContain('sandboxes.get');
	});

	it('returns the sandbox id when its tunnels are not ready after create', async () => {
		fake.setResult('sandbox.tunnels', () => {
			throw new actualSdk.SandboxTimeoutError();
		});
		const out = await run('sandboxes.create', {
			image: { registry: 'alpine:3.21' },
			encryptedPorts: [8080],
		});
		expect(out).toMatchObject({ sandboxId: 'sb-1', appId: expect.any(String) });
		expect((out as { tunnels?: unknown }).tunnels).toBeUndefined();
		expect((out as { tunnelsError?: string }).tunnelsError).toContain(
			'SandboxTimeoutError',
		);
		expect(fake.callsTo('sandbox.terminate')).toHaveLength(0);
	});

	it('spawns a function directly when no options are given', async () => {
		await run('functions.spawn', { functionId: 'fu-1', args: [2] });
		expect(fake.callsTo('function.spawn')[0]).toEqual([[2], {}]);
		expect(fake.callsTo('function.withOptions')).toHaveLength(0);
	});

	it('returns an empty list when a queue stays empty', async () => {
		fake.setResult('rpc.queueGet', () => ({ values: [] }));
		await expect(run('queues.get', { name: 'jobs' })).resolves.toEqual({
			values: [],
		});
		expect(fake.callsTo('rpc.queueGet')).toHaveLength(1);
	});

	it('caps exec output at maxOutputBytes', async () => {
		fake.setResult('sandbox.exec', () => ({
			stdin: new WritableStream<string>(),
			stdout: new ReadableStream<string>({
				start(controller) {
					controller.enqueue('abcdef');
					controller.enqueue('ghij');
					controller.close();
				},
			}),
			stderr: new ReadableStream<string>({
				start(controller) {
					controller.close();
				},
			}),
			wait: async () => 1,
		}));
		await expect(
			run('sandboxes.exec', {
				sandboxId: 'sb-1',
				command: ['x'],
				maxOutputBytes: 4,
			}),
		).resolves.toEqual({
			exitCode: 1,
			stdout: 'abcd',
			stderr: '',
			stdoutTruncated: true,
			stderrTruncated: false,
		});
	});

	it('refuses to read a file over maxBytes', async () => {
		await expect(
			run('files.read', { sandboxId: 'sb-1', path: '/big', maxBytes: 2 }),
		).rejects.toThrow(/maxBytes/);
	});
});

describe('risk levels', () => {
	const destructive = Object.entries(modalEndpointMeta)
		.filter(([, meta]) => meta.riskLevel === 'destructive')
		.map(([key]) => key)
		.sort();

	it('marks everything that starts compute, runs code or deletes as destructive', () => {
		expect(destructive).toEqual(
			[
				'apps.stop',
				'classes.call',
				'classes.spawn',
				'dicts.clear',
				'dicts.delete',
				'environments.delete',
				'files.remove',
				'functionCalls.cancel',
				'functions.call',
				'functions.spawn',
				'functions.updateAutoscaler',
				'images.build',
				'images.delete',
				'queues.clear',
				'queues.delete',
				'sandboxes.create',
				'sandboxes.exec',
				'sandboxes.restoreSnapshot',
				'sandboxes.resume',
				'sandboxes.terminate',
				'secrets.delete',
				'volumes.delete',
				'volumes.removeFile',
			].sort(),
		);
	});

	it('keeps lookups, lists, logs and stats as reads', () => {
		for (const [key, meta] of Object.entries(modalEndpointMeta)) {
			const name = key.split('.')[1] ?? '';
			if (
				/^(get|list|info|stats|logs|fetchLogs|len|contains|items|peek|tunnels|metrics)/.test(
					name,
				)
			) {
				if (key === 'queues.get') continue; // removes items
				expect([key, meta.riskLevel]).toEqual([key, 'read']);
			}
		}
	});
});
