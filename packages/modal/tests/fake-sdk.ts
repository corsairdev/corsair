// A stand-in for the `modal` SDK: the real SDK's classes that never touch the
// network (Queue for pickling, Probe, errors), and recorded fakes for
// every service and handle the plugin calls.
import type { ModalSdkModule } from '../client';

type Call = { method: string; args: unknown[] };

export type FakeSdk = {
	sdk: ModalSdkModule;
	calls: Call[];
	clients: FakeClient[];
	callsTo(method: string): unknown[][];
	/** Override one fake method's result by its recorded name. */
	setResult(method: string, impl: (...args: unknown[]) => unknown): void;
};

type FakeClient = {
	params: Record<string, unknown>;
	profile: { environment?: string };
	closed: boolean;
};

function textStream(text: string): ReadableStream<string> {
	return new ReadableStream<string>({
		start(controller) {
			if (text) controller.enqueue(text);
			controller.close();
		},
	});
}

async function* generate<T>(items: T[]): AsyncGenerator<T> {
	for (const item of items) yield item;
}

export function createFakeSdk(actual: ModalSdkModule): FakeSdk {
	const calls: Call[] = [];
	const clients: FakeClient[] = [];
	const overrides = new Map<string, (...args: unknown[]) => unknown>();

	const rec =
		(method: string, impl: (...args: unknown[]) => unknown = () => undefined) =>
		(...args: unknown[]) => {
			calls.push({ method, args });
			const fn = overrides.get(method) ?? impl;
			return fn(...args);
		};
	const recAsync =
		(method: string, impl: (...args: unknown[]) => unknown = () => undefined) =>
		async (...args: unknown[]) =>
			rec(method, impl)(...args);
	const recGen =
		(method: string, items: () => unknown[]) =>
		(...args: unknown[]) => {
			calls.push({ method, args });
			const fn = overrides.get(method);
			return generate(fn ? (fn(...args) as unknown[]) : items());
		};

	const logEntry = {
		message: 'hello\n',
		source: 'stdout',
		timestamp: new Date('2026-11-27T10:00:00Z'),
		objectId: 'sb-1',
	};
	const logs = (prefix: string) => ({
		tail: recGen(`${prefix}.logs.tail`, () => [logEntry]),
		fetch: recGen(`${prefix}.logs.fetch`, () => [logEntry]),
	});

	const image: Record<string, unknown> = {
		imageId: 'im-1',
		dockerfileCommands: rec('image.dockerfileCommands', () => image),
		build: recAsync('image.build', () => image),
		publish: recAsync('image.publish'),
	};

	const fileInfo = {
		name: 'a.txt',
		path: '/tmp/a.txt',
		type: 'file',
		size: 5,
		mode: 0o644,
		permissions: 'rw-r--r--',
		owner: 'root',
		group: 'root',
		modifiedTime: 1_790_000_000,
		symlinkTarget: null,
	};

	const makeProcess = () => {
		const written: string[] = [];
		return {
			written,
			stdin: new WritableStream<string>({
				write(chunk) {
					written.push(chunk);
				},
			}),
			stdout: textStream('out\n'),
			stderr: textStream('err\n'),
			wait: async () => 0,
		};
	};

	const sandbox = {
		sandboxId: 'sb-1',
		poll: recAsync('sandbox.poll', () => null),
		exec: recAsync('sandbox.exec', () => makeProcess()),
		terminate: recAsync('sandbox.terminate', (params) =>
			(params as { wait?: boolean } | undefined)?.wait ? 137 : undefined,
		),
		wait: recAsync('sandbox.wait', () => 0),
		waitUntilReady: recAsync('sandbox.waitUntilReady'),
		tunnels: recAsync('sandbox.tunnels', () => ({
			8080: {
				host: 'abc.modal.host',
				port: 443,
				unencryptedHost: 'r.modal.host',
				unencryptedPort: 40001,
				url: 'https://abc.modal.host',
			},
		})),
		getTags: recAsync('sandbox.getTags', () => ({ team: 'corsair' })),
		setTags: recAsync('sandbox.setTags'),
		experimentalSetName: recAsync('sandbox.experimentalSetName'),
		createConnectToken: recAsync('sandbox.createConnectToken', () => ({
			url: 'https://sb-1.modal.run',
			token: 'tok',
		})),
		snapshotFilesystem: recAsync('sandbox.snapshotFilesystem', () => image),
		snapshotDirectory: recAsync('sandbox.snapshotDirectory', () => image),
		experimentalSnapshot: recAsync('sandbox.experimentalSnapshot', () => ({
			snapshotId: 'sn-1',
		})),
		experimentalGetExitSnapshot: recAsync(
			'sandbox.experimentalGetExitSnapshot',
			() => image,
		),
		mountImage: recAsync('sandbox.mountImage'),
		unmountImage: recAsync('sandbox.unmountImage'),
		updateNetworkPolicy: recAsync('sandbox.updateNetworkPolicy'),
		reloadVolumes: recAsync('sandbox.reloadVolumes'),
		experimentalPause: recAsync('sandbox.experimentalPause'),
		experimentalResume: recAsync('sandbox.experimentalResume'),
		logs: logs('sandbox'),
		filesystem: {
			stat: recAsync('fs.stat', () => fileInfo),
			readBytes: recAsync('fs.readBytes', () =>
				new TextEncoder().encode('hello'),
			),
			writeBytes: recAsync('fs.writeBytes'),
			listFiles: recAsync('fs.listFiles', () => [fileInfo]),
			makeDirectory: recAsync('fs.makeDirectory'),
			remove: recAsync('fs.remove'),
		},
	};

	const app = {
		appId: 'ap-1',
		name: 'my-app',
		environmentName: 'main',
		info: recAsync('app.info', () => ({
			appId: 'ap-1',
			description: 'my app',
			lifecycle: {
				state: 'deployed',
				version: 3,
				createdAt: new Date('2026-11-01T00:00:00Z'),
				createdBy: 'pranay',
			},
			functions: { square: 'fu-1' },
			servers: {},
		})),
		stats: recAsync('app.stats', () => ({
			since: new Date('2026-11-27T09:00:00Z'),
			until: new Date('2026-11-27T10:00:00Z'),
			functions: { total: {}, byName: {} },
			servers: { total: {}, byName: {} },
			sandboxes: { total: 2, finished: 1, live: 1 },
			lifecycle: { state: 'deployed', createdAt: new Date(0), createdBy: 'x' },
			deploymentCount: 3,
		})),
		stop: recAsync('app.stop'),
		sandboxes: {
			stats: recGen('app.sandboxes.stats', () => [
				{
					tags: { team: 'a' },
					cost: '0.0100',
					costByResource: { CPU: '0.0100' },
				},
			]),
		},
	};

	const environment = {
		environmentId: 'en-1',
		name: 'main',
		apps: { list: recGen('environment.apps.list', () => [app]) },
	};

	const functionCall = {
		functionCallId: 'fc-1',
		get: recAsync('functionCall.get', () => ({ answer: 42 })),
		cancel: recAsync('functionCall.cancel'),
		logs: logs('functionCall'),
	};

	const fn: Record<string, unknown> = {
		functionId: 'fu-1',
		getWebUrl: recAsync('function.getWebUrl', () => 'https://x.modal.run'),
		info: recAsync('function.info', () => ({
			cpu: 1,
			gpus: [],
			imageId: 'im-1',
			timeoutSecs: 300,
			volumes: new Map([['/data', { volumeId: 'vo-1', readOnly: false }]]),
		})),
		spawn: recAsync('function.spawn', () => functionCall),
		stats: recAsync('function.stats', () => ({
			since: new Date(0),
			until: new Date(1000),
			inputSuccessCount: 1,
		})),
		getCurrentStats: recAsync('function.getCurrentStats', () => ({
			backlog: 0,
			numTotalRunners: 1,
		})),
		updateAutoscaler: recAsync('function.updateAutoscaler', (params) => params),
		logs: logs('function'),
		metrics: {
			export: recAsync('function.metrics.export', () => ({
				objectId: 'fu-1',
				since: new Date(0),
				until: new Date(1000),
				bucketSizeSecs: 60,
				pointCount: 0,
				series: {},
			})),
			schema: recAsync('function.metrics.schema', () => ({
				container: { name: 'container', definitions: [] },
			})),
		},
	};
	// Like the SDK: withOptions records overrides, instance() returns the bound
	// variant (its own id), and only the variant's spawn runs with them.
	const boundFn: Record<string, unknown> = {
		...fn,
		functionId: 'fu-bound',
		spawn: recAsync('boundFunction.spawn', () => functionCall),
	};
	fn.withOptions = rec('function.withOptions', () => ({
		...fn,
		instance: recAsync('function.instance', () => boundFn),
	}));

	const cls: Record<string, unknown> = {
		withOptions: rec('cls.withOptions', () => cls),
		instance: recAsync('cls.instance', () => ({
			method: rec('clsInstance.method', () => fn),
		})),
	};

	const queue = {
		queueId: 'qu-1',
		len: recAsync('queue.len', () => 2),
		clear: recAsync('queue.clear'),
	};

	const volume: Record<string, unknown> = {
		volumeId: 'vo-1',
		name: 'data',
		withMountOptions: rec('volume.withMountOptions', () => volume),
	};

	const fileEntry = { path: 'a.txt', type: 1, mtime: 1_790_000_000, size: 5 };

	class FakeModalClient {
		params: Record<string, unknown>;
		profile: { environment?: string };
		closed = false;
		constructor(params: Record<string, unknown>) {
			this.params = params;
			// What the real SDK does when the host has MODAL_ENVIRONMENT set.
			this.profile = {
				environment: (params.environment as string) ?? 'host-env',
			};
			clients.push(this);
		}
		environmentName(env?: string) {
			return env || this.profile.environment || '';
		}
		close() {
			this.closed = true;
		}
		apps = { fromName: recAsync('apps.fromName', () => app) };
		environments = {
			fromName: recAsync('environments.fromName', () => environment),
			fromContext: recAsync('environments.fromContext', () => environment),
			objects: {
				create: recAsync('environments.objects.create'),
				list: recGen('environments.objects.list', () => [environment]),
				delete: recAsync('environments.objects.delete'),
			},
		};
		sandboxes = {
			create: recAsync('sandboxes.create', () => sandbox),
			experimentalCreate: recAsync(
				'sandboxes.experimentalCreate',
				() => sandbox,
			),
			fromId: recAsync('sandboxes.fromId', () => sandbox),
			fromName: recAsync('sandboxes.fromName', () => sandbox),
			experimentalFromName: recAsync(
				'sandboxes.experimentalFromName',
				() => sandbox,
			),
			experimentalFromSnapshot: recAsync(
				'sandboxes.experimentalFromSnapshot',
				() => sandbox,
			),
			list: recGen('sandboxes.list', () => [sandbox]),
			experimentalList: recGen('sandboxes.experimentalList', () => [sandbox]),
		};
		sandboxSnapshots = {
			fromId: recAsync('sandboxSnapshots.fromId', (id) => ({ snapshotId: id })),
		};
		images = {
			fromId: recAsync('images.fromId', () => image),
			fromName: recAsync('images.fromName', () => image),
			fromRegistry: rec('images.fromRegistry', () => image),
			fromAwsEcr: rec('images.fromAwsEcr', () => image),
			fromGcpArtifactRegistry: rec(
				'images.fromGcpArtifactRegistry',
				() => image,
			),
			delete: recAsync('images.delete'),
		};
		secrets = {
			fromName: recAsync('secrets.fromName', (name) => ({
				secretId: 'st-1',
				name,
			})),
			fromObject: recAsync('secrets.fromObject', () => ({ secretId: '' })),
			delete: recAsync('secrets.delete'),
		};
		volumes = {
			fromName: recAsync('volumes.fromName', () => volume),
			delete: recAsync('volumes.delete'),
		};
		proxies = {
			fromName: recAsync('proxies.fromName', () => ({ proxyId: 'pr-1' })),
		};
		cloudBucketMounts = {
			create: rec('cloudBucketMounts.create', (bucketName) => ({ bucketName })),
		};
		functions = {
			fromId: recAsync('functions.fromId', () => fn),
			fromName: recAsync('functions.fromName', () => fn),
		};
		cls = { fromName: recAsync('cls.fromName', () => cls) };
		functionCalls = {
			fromId: recAsync('functionCalls.fromId', () => functionCall),
		};
		queues = {
			fromName: recAsync('queues.fromName', () => queue),
			delete: recAsync('queues.delete'),
		};
		cpClient = {
			volumeGetOrCreate: recAsync('rpc.volumeGetOrCreate', () => ({
				volumeId: 'vo-1',
				version: 0,
				metadata: { version: 2, name: 'data' },
			})),
			volumeList: recAsync('rpc.volumeList', () => ({
				items: [
					{
						label: 'data',
						volumeId: 'vo-1',
						createdAt: 1_790_000_000,
						metadata: { version: 2, creationInfo: { createdBy: 'pranay' } },
					},
				],
			})),
			volumeListFiles: recGen('rpc.volumeListFiles', () => [
				{ entries: [fileEntry] },
			]),
			volumeListFiles2: recGen('rpc.volumeListFiles2', () => [
				{ entries: [fileEntry] },
			]),
			volumeRemoveFile: recAsync('rpc.volumeRemoveFile'),
			volumeRemoveFile2: recAsync('rpc.volumeRemoveFile2'),
			secretList: recAsync('rpc.secretList', () => ({
				items: [
					{
						label: 'openai',
						secretId: 'st-1',
						createdAt: 1_790_000_000,
						lastUsedAt: 0,
						metadata: { keys: ['OPENAI_API_KEY'] },
					},
				],
			})),
			secretGetOrCreate: recAsync('rpc.secretGetOrCreate', () => ({
				secretId: 'st-2',
			})),
			queueList: recAsync('rpc.queueList', () => ({
				queues: [
					{
						name: 'jobs',
						queueId: 'qu-1',
						createdAt: 1_790_000_000,
						numPartitions: 1,
						totalSize: 2,
					},
				],
			})),
			// pickle.dumps({'job': 1}, 4), 1 and 2
			queuePut: recAsync('rpc.queuePut'),
			queueGet: recAsync('rpc.queueGet', () => ({
				values: [
					Buffer.from('8004950c000000000000007d948c036a6f62944b01732e', 'hex'),
				],
			})),
			queueNextItems: recAsync('rpc.queueNextItems', () => ({
				items: [
					{ entryId: 'e1', value: Buffer.from('80044b012e', 'hex') },
					{ entryId: 'e2', value: Buffer.from('80044b022e', 'hex') },
				],
			})),
			dictGetOrCreate: recAsync('rpc.dictGetOrCreate', () => ({
				dictId: 'di-1',
			})),
			dictList: recAsync('rpc.dictList', () => ({
				dicts: [{ name: 'cache', dictId: 'di-1', createdAt: 1_790_000_000 }],
			})),
			dictDelete: recAsync('rpc.dictDelete'),
			dictGet: recAsync('rpc.dictGet', () => ({ found: false })),
			dictUpdate: recAsync('rpc.dictUpdate', () => ({ created: true })),
			dictPop: recAsync('rpc.dictPop', () => ({ found: false })),
			dictContains: recAsync('rpc.dictContains', () => ({ found: true })),
			dictLen: recAsync('rpc.dictLen', () => ({ len: 3 })),
			dictContents: recGen('rpc.dictContents', () => []),
			dictClear: recAsync('rpc.dictClear'),
		};
	}

	const sdk = {
		...actual,
		ModalClient: FakeModalClient,
	} as unknown as ModalSdkModule;

	return {
		sdk,
		calls,
		clients: clients as FakeClient[],
		callsTo: (method) =>
			calls.filter((call) => call.method === method).map((call) => call.args),
		setResult: (method, impl) => {
			overrides.set(method, impl);
		},
	};
}
