import { makeE2bRequest } from './client';
import { e2bOperationRoutes } from './endpoints/routes';
import {
	E2bEndpointInputSchemas,
	E2bEndpointOutputSchemas,
} from './endpoints/types';

// Route-specific fixture values stay unknown until each operation's schema parses them.
const INPUT_FIXTURES: Record<string, unknown> = {
	'sandboxes.create': {
		headers: {
			idempotencyKey: 'test',
		},
		body: {
			templateID: 'test',
		},
	},
	'sandboxes.list': {
		query: {
			metadata: 'test',
			state: ['running'],
			order: 'desc',
			startedAfter: '2026-01-01T00:00:00Z',
			template: 'test',
			nextToken: 'test',
			limit: 100,
		},
	},
	'sandboxes.listMetrics': {
		query: {
			sandbox_ids: ['test'],
		},
	},
	'sandboxes.getLogs': {
		path: {
			sandboxID: 'test',
		},
		query: {
			cursor: 0,
			limit: 1000,
			direction: 'forward',
			level: 'test',
			search: 'test',
		},
	},
	'sandboxes.get': {
		path: {
			sandboxID: 'test',
		},
	},
	'sandboxes.kill': {
		path: {
			sandboxID: 'test',
		},
	},
	'sandboxes.getMetrics': {
		path: {
			sandboxID: 'test',
		},
		query: {
			start: 0,
			end: 0,
		},
	},
	'sandboxes.pause': {
		path: {
			sandboxID: 'test',
		},
		body: {},
	},
	'sandboxes.fork': {
		path: {
			sandboxID: 'test',
		},
		body: {},
	},
	'sandboxes.connect': {
		path: {
			sandboxID: 'test',
		},
		body: {},
	},
	'sandboxes.setTimeout': {
		path: {
			sandboxID: 'test',
		},
		body: {
			timeout: 0,
		},
	},
	'sandboxes.updateNetwork': {
		path: {
			sandboxID: 'test',
		},
		body: {},
	},
	'sandboxes.refresh': {
		path: {
			sandboxID: 'test',
		},
		body: {},
	},
	'sandboxes.createSnapshot': {
		path: {
			sandboxID: 'test',
		},
		headers: {
			idempotencyKey: 'test',
		},
		body: {},
	},
	'sandboxes.listSnapshots': {
		query: {
			sandboxID: 'test',
			name: 'test',
			limit: 100,
			nextToken: 'test',
		},
	},
	'templates.create': {
		headers: {
			idempotencyKey: 'test',
		},
		body: {},
	},
	'templates.list': {
		query: {
			teamID: 'test',
			nextToken: 'test',
			limit: 100,
		},
	},
	'templates.getBuildUploadLink': {
		path: {
			templateID: 'test',
			hash: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
		},
	},
	'templates.listDefault': {},
	'templates.get': {
		path: {
			templateID: 'test',
		},
		query: {
			nextToken: 'test',
			limit: 100,
		},
	},
	'templates.delete': {
		path: {
			templateID: 'test',
		},
	},
	'templates.startBuild': {
		path: {
			templateID: 'test',
			buildID: 'test',
		},
		headers: {
			idempotencyKey: 'test',
		},
		body: {},
	},
	'templates.update': {
		path: {
			templateID: 'test',
		},
		body: {},
	},
	'templates.getBuildStatus': {
		path: {
			templateID: 'test',
			buildID: 'test',
		},
		query: {
			logsOffset: 0,
			limit: 100,
			level: 'test',
		},
	},
	'templates.getBuildLogs': {
		path: {
			templateID: 'test',
			buildID: 'test',
		},
		query: {
			cursor: 0,
			limit: 100,
			direction: 'forward',
			level: 'test',
			source: 'temporary',
		},
	},
	'templates.getByAlias': {
		path: {
			alias: 'test',
		},
	},
	'tags.assign': {
		body: {
			target: 'test',
			tags: ['test'],
		},
	},
	'tags.delete': {
		body: {
			name: 'test',
			tags: ['test'],
		},
	},
	'tags.list': {
		path: {
			templateID: 'test',
		},
	},
	'tags.listGroups': {
		path: {
			templateID: 'test',
		},
		query: {
			assignmentLimit: 6,
			tagsLimit: 25,
			tagsCursor: 'test',
			search: 'test',
			sort: 'latest_desc',
		},
	},
	'tags.count': {
		path: {
			templateID: 'test',
		},
	},
	'tags.exists': {
		path: {
			templateID: 'test',
		},
		query: {
			tag: 'test',
		},
	},
	'tags.listAssignments': {
		path: {
			templateID: 'test',
			tag: 'test',
		},
		query: {
			cursor: 'test',
			limit: 50,
		},
	},
	'volumes.list': {},
	'volumes.create': {
		body: {
			name: 'test',
		},
	},
	'volumes.get': {
		path: {
			volumeID: 'test',
		},
	},
	'volumes.delete': {
		path: {
			volumeID: 'test',
		},
	},
	'envd.health': {
		headers: {
			e2bSandboxId: 'test',
			e2bSandboxPort: 49983,
		},
	},
	'envd.metrics': {
		headers: {
			e2bSandboxId: 'test',
			e2bSandboxPort: 49983,
			e2bAccessToken: 'test-sandbox-access-token',
		},
	},
	'envd.getEnvironmentVariables': {
		headers: {
			e2bSandboxId: 'test',
			e2bSandboxPort: 49983,
			e2bAccessToken: 'test-sandbox-access-token',
		},
	},
	'filesystem.createWatcher': {
		headers: {
			e2bSandboxId: 'test',
			e2bSandboxPort: 49983,
			connectTimeoutMs: 1,
			e2bAccessToken: 'test-sandbox-access-token',
		},
		body: { path: '/tmp', recursive: true, includeEntry: true },
	},
	'filesystem.getWatcherEvents': {
		headers: {
			e2bSandboxId: 'test',
			e2bSandboxPort: 49983,
			connectTimeoutMs: 1,
			e2bAccessToken: 'test-sandbox-access-token',
		},
		body: { watcherId: 'watcher-test' },
	},
	'filesystem.listDir': {
		headers: {
			e2bSandboxId: 'test',
			e2bSandboxPort: 49983,
			connectTimeoutMs: 1,
			e2bAccessToken: 'test-sandbox-access-token',
		},
		body: { path: '/tmp', depth: 2 },
	},
	'filesystem.createDir': {
		headers: {
			e2bSandboxId: 'test',
			e2bSandboxPort: 49983,
			connectTimeoutMs: 1,
			e2bAccessToken: 'test-sandbox-access-token',
		},
		body: { path: '/tmp/corsair-e2b' },
	},
	'filesystem.move': {
		headers: {
			e2bSandboxId: 'test',
			e2bSandboxPort: 49983,
			connectTimeoutMs: 1,
			e2bAccessToken: 'test-sandbox-access-token',
		},
		body: {
			source: '/tmp/source.txt',
			destination: '/tmp/destination.txt',
		},
	},
	'filesystem.remove': {
		headers: {
			e2bSandboxId: 'test',
			e2bSandboxPort: 49983,
			connectTimeoutMs: 1,
			e2bAccessToken: 'test-sandbox-access-token',
		},
		body: { path: '/tmp/obsolete.txt' },
	},
	'filesystem.removeWatcher': {
		headers: {
			e2bSandboxId: 'test',
			e2bSandboxPort: 49983,
			connectTimeoutMs: 1,
			e2bAccessToken: 'test-sandbox-access-token',
		},
		body: { watcherId: 'watcher-test' },
	},
	'filesystem.stat': {
		headers: {
			e2bSandboxId: 'test',
			e2bSandboxPort: 49983,
			connectTimeoutMs: 1,
			e2bAccessToken: 'test-sandbox-access-token',
		},
		body: { path: '/tmp/corsair-e2b' },
	},
	'process.closeStdin': {
		headers: {
			e2bSandboxId: 'test',
			e2bSandboxPort: 49983,
			connectTimeoutMs: 1,
			e2bAccessToken: 'test-sandbox-access-token',
		},
		body: { process: { pid: 101 } },
	},
	'process.list': {
		headers: {
			e2bSandboxId: 'test',
			e2bSandboxPort: 49983,
			connectTimeoutMs: 1,
			e2bAccessToken: 'test-sandbox-access-token',
		},
		body: {},
	},
	'process.sendInput': {
		headers: {
			e2bSandboxId: 'test',
			e2bSandboxPort: 49983,
			connectTimeoutMs: 1,
			e2bAccessToken: 'test-sandbox-access-token',
		},
		body: { process: { pid: 101 }, input: { stdin: 'aGVsbG8=' } },
	},
	'process.sendSignal': {
		headers: {
			e2bSandboxId: 'test',
			e2bSandboxPort: 49983,
			connectTimeoutMs: 1,
			e2bAccessToken: 'test-sandbox-access-token',
		},
		body: { process: { pid: 101 }, signal: 'SIGNAL_SIGTERM' },
	},
	'process.update': {
		headers: {
			e2bSandboxId: 'test',
			e2bSandboxPort: 49983,
			connectTimeoutMs: 1,
			e2bAccessToken: 'test-sandbox-access-token',
		},
		body: { process: { tag: 'agent' }, pty: { size: { cols: 80, rows: 24 } } },
	},
	'teams.getMetrics': {
		path: {
			teamID: 'test',
		},
		query: {
			start: 0,
			end: 0,
		},
	},
	'teams.getMaxMetrics': {
		path: {
			teamID: 'test',
		},
		query: {
			start: 0,
			end: 0,
			metric: 'concurrent_sandboxes',
		},
	},
	'secrets.list': {
		query: {
			nextToken: 'test',
			limit: 100,
		},
	},
	'secrets.create': {
		body: {
			name: 'test',
			value: 'test',
		},
	},
	'secrets.get': {
		path: {
			secretID: 'test',
		},
	},
	'secrets.update': {
		path: {
			secretID: 'test',
		},
		body: {
			value: 'test',
		},
	},
	'secrets.delete': {
		path: {
			secretID: 'test',
		},
	},
	'events.listBySandbox': {
		path: {
			sandboxID: 'test',
		},
		query: {
			offset: 0,
			limit: 10,
			orderAsc: false,
			types: ['test'],
		},
	},
	'events.list': {
		query: {
			offset: 0,
			limit: 10,
			orderAsc: false,
			types: ['test'],
		},
	},
};
// Provider response fixtures vary by route and are validated against output schemas below.
const OUTPUT_FIXTURES: Record<string, unknown> = {
	'sandboxes.create': {
		templateID: 'test',
		sandboxID: 'test',
		clientID: 'test',
		envdVersion: 'test',
	},
	'sandboxes.list': {
		items: [
			{
				templateID: 'template-test',
				sandboxID: 'sandbox-test',
				clientID: 'client-test',
				startedAt: '2026-01-01T00:00:00Z',
				cpuCount: 1,
				memoryMB: 128,
				diskSizeMB: 0,
				endAt: '2026-01-01T00:05:00Z',
				state: 'running',
				envdVersion: 'test',
			},
		],
		nextToken: 'next-page',
		totalRunning: 1,
	},
	'sandboxes.listMetrics': {
		sandboxes: {},
	},
	'sandboxes.getLogs': {
		logs: [],
	},
	'sandboxes.get': {
		templateID: 'test',
		sandboxID: 'test',
		clientID: 'test',
		startedAt: '2026-01-01T00:00:00Z',
		cpuCount: 1,
		memoryMB: 128,
		diskSizeMB: 0,
		endAt: '2026-01-01T00:00:00Z',
		state: 'running',
		envdVersion: 'test',
	},
	'sandboxes.getMetrics': [
		{
			timestamp: '2026-01-01T00:00:00Z',
			timestampUnix: 1,
			cpuCount: 1,
			cpuUsedPct: 1,
			memUsed: 1,
			memTotal: 1,
			memCache: 1,
			diskUsed: 1,
			diskTotal: 1,
		},
	],
	'sandboxes.fork': [{}],
	'sandboxes.connect': {
		templateID: 'test',
		sandboxID: 'test',
		clientID: 'test',
		envdVersion: 'test',
	},
	'sandboxes.createSnapshot': {
		snapshotID: 'test',
		names: ['test'],
	},
	'sandboxes.listSnapshots': {
		items: [
			{ snapshotID: 'snapshot-test', names: ['team/snapshot-test:default'] },
		],
		nextToken: 'next-page',
	},
	'templates.create': {
		templateID: 'test',
		buildID: 'test',
		public: false,
		aliases: ['test'],
		names: ['test'],
		tags: ['test'],
	},
	'templates.list': {
		items: [
			{
				templateID: 'test',
				buildID: 'test',
				cpuCount: 1,
				memoryMB: 128,
				diskSizeMB: 0,
				public: false,
				createdAt: '2026-01-01T00:00:00Z',
				updatedAt: '2026-01-01T00:00:00Z',
				createdBy: {
					id: '00000000-0000-4000-8000-000000000001',
					email: null,
				},
				lastSpawnedAt: '2026-01-01T00:00:00Z',
				spawnCount: 1,
				buildCount: 1,
				envdVersion: 'test',
				aliases: ['test'],
				names: ['test'],
				buildStatus: 'building',
			},
		],
		nextToken: 'next-page',
	},
	'templates.getBuildUploadLink': {
		present: false,
	},
	'templates.listDefault': [
		{
			templateID: 'test',
			buildID: 'test',
			cpuCount: 1,
			memoryMB: 128,
			diskSizeMB: 0,
			public: false,
			createdAt: '2026-01-01T00:00:00Z',
			updatedAt: '2026-01-01T00:00:00Z',
			createdBy: {
				id: '00000000-0000-4000-8000-000000000001',
				email: null,
			},
			lastSpawnedAt: '2026-01-01T00:00:00Z',
			spawnCount: 1,
			buildCount: 1,
			envdVersion: 'test',
			aliases: ['test'],
			names: ['test'],
			buildStatus: 'building',
		},
	],
	'templates.get': {
		templateID: 'test',
		buildID: 'test',
		cpuCount: 1,
		memoryMB: 128,
		diskSizeMB: 0,
		public: false,
		createdAt: '2026-01-01T00:00:00Z',
		updatedAt: '2026-01-01T00:00:00Z',
		createdBy: {
			id: '00000000-0000-4000-8000-000000000001',
			email: null,
		},
		lastSpawnedAt: '2026-01-01T00:00:00Z',
		spawnCount: 1,
		buildCount: 1,
		envdVersion: 'test',
		aliases: ['test'],
		names: ['test'],
		buildStatus: 'building',
		builds: [
			{
				buildID: '00000000-0000-4000-8000-000000000001',
				status: 'building',
				createdAt: '2026-01-01T00:00:00Z',
				updatedAt: '2026-01-01T00:00:00Z',
				cpuCount: 1,
				memoryMB: 128,
			},
		],
		nextToken: 'next-page',
	},
	'templates.update': {
		names: ['test'],
	},
	'templates.getBuildStatus': {
		templateID: 'test',
		buildID: 'test',
		status: 'building',
		logs: [],
		logEntries: [],
	},
	'templates.getBuildLogs': {
		logs: [],
	},
	'templates.getByAlias': {
		templateID: 'test',
		public: false,
	},
	'tags.assign': {
		tags: ['test'],
		buildID: '00000000-0000-4000-8000-000000000001',
	},
	'tags.list': [
		{
			tag: 'test',
			buildID: '00000000-0000-4000-8000-000000000001',
			createdAt: '2026-01-01T00:00:00Z',
		},
	],
	'tags.listGroups': {
		tags: [
			{
				tag: 'test',
				assignments: [
					{
						assignmentId: '00000000-0000-4000-8000-000000000001',
						buildId: '00000000-0000-4000-8000-000000000001',
						assignedAt: '2026-01-01T00:00:00Z',
						buildCreatedAt: '2026-01-01T00:00:00Z',
						buildFinishedAt: '2026-01-01T00:00:00Z',
					},
				],
				hasMore: false,
			},
		],
		nextCursor: 'test',
	},
	'tags.count': {
		total: 1,
	},
	'tags.exists': {
		exists: false,
		normalizedTag: 'test',
	},
	'tags.listAssignments': {
		data: [
			{
				assignmentId: '00000000-0000-4000-8000-000000000001',
				buildId: '00000000-0000-4000-8000-000000000001',
				assignedAt: '2026-01-01T00:00:00Z',
				buildCreatedAt: '2026-01-01T00:00:00Z',
				buildFinishedAt: '2026-01-01T00:00:00Z',
			},
		],
		nextCursor: 'test',
	},
	'volumes.list': [
		{
			volumeID: 'test',
			name: 'test',
		},
	],
	'volumes.create': {
		volumeID: 'test',
		name: 'test',
		token: 'test',
	},
	'volumes.get': {
		volumeID: 'test',
		name: 'test',
		token: 'test',
	},
	'envd.metrics': {},
	'envd.getEnvironmentVariables': {},
	'filesystem.createWatcher': { watcherId: 'watcher-test' },
	'filesystem.getWatcherEvents': {
		events: [
			{
				name: 'report.txt',
				type: 'EVENT_TYPE_CREATE',
				entry: {
					name: 'report.txt',
					type: 'FILE_TYPE_FILE',
					path: '/tmp/report.txt',
					size: '9007199254740993',
					mode: 420,
					permissions: 'rw-r--r--',
					owner: 'user',
					group: 'user',
					modifiedTime: '2026-01-01T00:00:00Z',
					metadata: { source: 'agent' },
					isSymlink: false,
				},
			},
		],
	},
	'filesystem.listDir': {
		entries: [
			{
				name: 'report.txt',
				type: 'FILE_TYPE_FILE',
				path: '/tmp/report.txt',
				size: 12,
				mode: 420,
				permissions: 'rw-r--r--',
				owner: 'user',
				group: 'user',
				modifiedTime: '2026-01-01T00:00:00Z',
				metadata: { source: 'agent' },
				isSymlink: false,
			},
		],
	},
	'filesystem.createDir': {
		entry: {
			name: 'corsair-e2b',
			type: 'FILE_TYPE_DIRECTORY',
			path: '/tmp/corsair-e2b',
			mode: 493,
			permissions: 'rwxr-xr-x',
			owner: 'user',
			group: 'user',
			modifiedTime: '2026-01-01T00:00:00Z',
			isSymlink: false,
		},
	},
	'filesystem.move': {
		entry: {
			name: 'destination.txt',
			type: 'FILE_TYPE_FILE',
			path: '/tmp/destination.txt',
			size: 12,
			mode: 420,
			permissions: 'rw-r--r--',
			owner: 'user',
			group: 'user',
			modifiedTime: '2026-01-01T00:00:00Z',
			isSymlink: false,
		},
	},
	'filesystem.remove': {},
	'filesystem.removeWatcher': {},
	'filesystem.stat': {
		entry: {
			name: 'report.txt',
			type: 'FILE_TYPE_FILE',
			path: '/tmp/report.txt',
			size: 12,
			mode: 420,
			permissions: 'rw-r--r--',
			owner: 'user',
			group: 'user',
			modifiedTime: '2026-01-01T00:00:00Z',
			metadata: { source: 'agent' },
			isSymlink: false,
		},
	},
	'process.closeStdin': {},
	'process.list': {
		processes: [
			{
				config: {
					cmd: 'python',
					args: ['-c', 'print(1)'],
					envs: { MODE: 'test' },
					cwd: '/home/user',
				},
				pid: 101,
				tag: 'agent',
			},
		],
	},
	'process.sendInput': {},
	'process.sendSignal': {},
	'process.update': {},
	'teams.getMetrics': [
		{
			timestamp: '2026-01-01T00:00:00Z',
			timestampUnix: 1,
			concurrentSandboxes: 1,
			sandboxStartRate: 1,
		},
	],
	'teams.getMaxMetrics': {
		timestamp: '2026-01-01T00:00:00Z',
		timestampUnix: 1,
		value: 1,
	},
	'secrets.list': {
		items: [
			{
				secretID: 'secret-test',
				name: 'test',
				currentVersion: 1,
				metadata: {},
				createdAt: '2026-01-01T00:00:00Z',
				updatedAt: '2026-01-01T00:00:00Z',
			},
		],
		nextToken: 'next-page',
	},
	'secrets.create': {
		secretID: 'test',
		name: 'test',
		currentVersion: 1,
		metadata: {},
		createdAt: '2026-01-01T00:00:00Z',
		updatedAt: '2026-01-01T00:00:00Z',
	},
	'secrets.get': {
		secretID: 'test',
		name: 'test',
		currentVersion: 1,
		metadata: {},
		createdAt: '2026-01-01T00:00:00Z',
		updatedAt: '2026-01-01T00:00:00Z',
	},
	'secrets.update': {
		secretID: 'test',
		name: 'test',
		currentVersion: 1,
		metadata: {},
		createdAt: '2026-01-01T00:00:00Z',
		updatedAt: '2026-01-01T00:00:00Z',
	},
	'events.listBySandbox': [
		{
			id: '00000000-0000-4000-8000-000000000001',
			version: 'test',
			type: 'test',
			timestamp: '2026-01-01T00:00:00Z',
			sandboxId: 'test',
			sandboxExecutionId: 'test',
			sandboxTemplateId: 'test',
			sandboxBuildId: 'test',
			sandboxTeamId: '00000000-0000-4000-8000-000000000001',
		},
	],
	'events.list': [
		{
			id: '00000000-0000-4000-8000-000000000001',
			version: 'test',
			type: 'test',
			timestamp: '2026-01-01T00:00:00Z',
			sandboxId: 'test',
			sandboxExecutionId: 'test',
			sandboxTemplateId: 'test',
			sandboxBuildId: 'test',
			sandboxTeamId: '00000000-0000-4000-8000-000000000001',
		},
	],
};

const PAGINATED_ROUTE_IDS = new Set([
	'sandboxes.list',
	'sandboxes.listSnapshots',
	'templates.list',
	'templates.get',
	'secrets.list',
]);
const PAGINATED_LIST_ROUTE_IDS = new Set([
	'sandboxes.list',
	'sandboxes.listSnapshots',
	'templates.list',
	'secrets.list',
]);

// Test fixtures are untrusted JSON values until narrowed for assertions.
function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function requestHeaders(init: RequestInit | undefined): Headers {
	return new Headers(init?.headers);
}

// Route fixture input is unknown because each operation has a distinct schema.
function expectedPath(
	route: (typeof e2bOperationRoutes)[keyof typeof e2bOperationRoutes],
	input: unknown,
): string {
	const fields = isRecord(input) ? input : {};
	const path = isRecord(fields.path) ? fields.path : {};
	return route.path.replace(/\{([^}]+)\}/g, (_match, name: string) =>
		encodeURIComponent(String(path[name])),
	);
}

// Route fixture input is unknown because each operation has a distinct schema.
function expectedQueryEntries(
	route: (typeof e2bOperationRoutes)[keyof typeof e2bOperationRoutes],
	input: unknown,
): Array<[string, string]> {
	const fields = isRecord(input) ? input : {};
	const query = isRecord(fields.query) ? fields.query : {};
	return Object.entries(query).flatMap(
		([name, value]): Array<[string, string]> => {
			if (value === undefined) return [];
			const style = route.queryStyle.find((item) => item.name === name);
			if (Array.isArray(value)) {
				if (style?.explode === false) {
					return [[name, value.map((part) => String(part)).join(',')]];
				}
				return value.map((part) => [name, String(part)]);
			}
			return [[name, String(value)]];
		},
	);
}

describe('E2B REST operation coverage', () => {
	const routes = Object.values(e2bOperationRoutes);
	const originalFetch = globalThis.fetch;
	let calls: Array<{ url: string; init?: RequestInit }>;

	beforeEach(() => {
		calls = [];
	});

	afterEach(() => {
		globalThis.fetch = originalFetch;
	});

	it('keeps route, input schema, and output schema registries exhaustive', () => {
		const routeIds = Object.keys(e2bOperationRoutes).sort();
		expect(routeIds).toHaveLength(62);
		expect(Object.keys(E2bEndpointInputSchemas).sort()).toEqual(routeIds);
		expect(Object.keys(E2bEndpointOutputSchemas).sort()).toEqual(routeIds);
	});

	it.each(routes)(
		'$id sends the documented host, path, method, query, body, and auth headers',
		async (route) => {
			const input = INPUT_FIXTURES[route.id];
			const hasResponseBody = Object.prototype.hasOwnProperty.call(
				OUTPUT_FIXTURES,
				route.id,
			);
			const responseBody = OUTPUT_FIXTURES[route.id];
			globalThis.fetch = async (url, init) => {
				calls.push({ url: String(url), init });
				const isPaginated = PAGINATED_ROUTE_IDS.has(route.id);
				const paginatedFixture =
					isPaginated && isRecord(responseBody) ? responseBody : {};
				let providerBody = responseBody;
				if (PAGINATED_LIST_ROUTE_IDS.has(route.id)) {
					providerBody = paginatedFixture.items;
				} else if (route.id === 'templates.get' && isRecord(responseBody)) {
					providerBody = Object.fromEntries(
						Object.entries(responseBody).filter(
							([name]) => name !== 'nextToken',
						),
					);
				}
				const responseHeaders: Record<string, string> = {
					'Content-Type': 'application/json',
				};
				if (typeof paginatedFixture.nextToken === 'string') {
					responseHeaders['X-Next-Token'] = paginatedFixture.nextToken;
				}
				if (typeof paginatedFixture.totalRunning === 'number') {
					responseHeaders['X-Total-Running'] = String(
						paginatedFixture.totalRunning,
					);
				}
				return hasResponseBody
					? new Response(JSON.stringify(providerBody), {
							status: 200,
							headers: responseHeaders,
						})
					: new Response(null, { status: 204 });
			};

			const result = await makeE2bRequest(
				route,
				route.auth === 'apiKey' ? 'test-api-key' : undefined,
				input,
			);
			expect(route.output.parse(result)).toEqual(responseBody);
			expect(calls).toHaveLength(1);
			const call = calls[0];
			expect(call).toBeDefined();
			if (!call) throw new Error('Expected the request to reach the transport');
			const url = new URL(call.url);
			expect(url.hostname).toBe(
				route.host === 'api' ? 'api.e2b.app' : 'sandbox.e2b.app',
			);
			expect(url.pathname).toBe(expectedPath(route, input));
			expect(call?.init?.method).toBe(route.method);
			expect(Array.from(url.searchParams.entries())).toEqual(
				expectedQueryEntries(route, input),
			);

			const headers = requestHeaders(call?.init);
			if (route.auth === 'apiKey') {
				expect(headers.get('X-API-Key')).toBe('test-api-key');
				expect(headers.get('Authorization')).toBeNull();
			} else {
				expect(headers.get('X-API-Key')).toBeNull();
			}
			if (route.auth === 'sandboxAccessToken') {
				expect(headers.get('X-Access-Token')).toBe('test-sandbox-access-token');
			}
			if (route.host === 'sandbox') {
				expect(headers.get('E2b-Sandbox-Id')).toBe('test');
				expect(headers.get('E2b-Sandbox-Port')).toBe('49983');
			}
			if (route.connectProtocol) {
				expect(headers.get('Connect-Protocol-Version')).toBe('1');
			}

			const fields = isRecord(input) ? input : {};
			if (Object.prototype.hasOwnProperty.call(fields, 'body')) {
				expect(JSON.parse(String(call?.init?.body))).toEqual(fields.body);
			} else {
				expect(call?.init?.body).toBeUndefined();
			}
		},
	);

	it.each(routes)(
		'$id rejects undocumented top-level inputs before network I/O',
		async (route) => {
			globalThis.fetch = async (url, init) => {
				calls.push({ url: String(url), init });
				return new Response('{}', {
					status: 200,
					headers: { 'Content-Type': 'application/json' },
				});
			};
			const fixture = INPUT_FIXTURES[route.id];
			const input = isRecord(fixture)
				? { ...fixture, undocumented: true }
				: { undocumented: true };
			await expect(
				makeE2bRequest(
					route,
					route.auth === 'apiKey' ? 'test-api-key' : undefined,
					input,
				),
			).rejects.toThrow();
			expect(calls).toHaveLength(0);
		},
	);
});
