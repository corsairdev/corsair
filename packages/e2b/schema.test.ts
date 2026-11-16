import { e2bOperationRoutes } from './endpoints/routes';
import {
	E2bEndpointInputSchemas,
	E2bEndpointOutputSchemas,
} from './endpoints/types';
import { e2bEndpointMeta } from './index';

describe('E2B operation schemas', () => {
	it('declares schemas for every registered route', () => {
		const routeIds = Object.keys(e2bOperationRoutes).sort();
		expect(Object.keys(E2bEndpointInputSchemas).sort()).toEqual(routeIds);
		expect(Object.keys(E2bEndpointOutputSchemas).sort()).toEqual(routeIds);
	});

	it('rejects undocumented top-level request fields', () => {
		for (const schema of Object.values(E2bEndpointInputSchemas)) {
			expect(schema.safeParse({ undocumented: true }).success).toBe(false);
		}
	});

	it('enforces required sandbox creation fields and list-state enums', () => {
		expect(
			E2bEndpointInputSchemas['sandboxes.create'].safeParse({ body: {} })
				.success,
		).toBe(false);
		expect(
			E2bEndpointInputSchemas['sandboxes.create'].safeParse({
				body: { templateID: 'template-test' },
			}).success,
		).toBe(true);
		expect(
			E2bEndpointInputSchemas['sandboxes.list'].safeParse({
				query: { state: ['deleted'] },
			}).success,
		).toBe(false);
	});

	it('validates secret names and rejects undocumented nested body fields', () => {
		expect(
			E2bEndpointInputSchemas['secrets.create'].safeParse({
				body: { name: 'not valid', value: 'sample-secret' },
			}).success,
		).toBe(false);
		expect(
			E2bEndpointInputSchemas['secrets.create'].safeParse({
				body: {
					name: 'sample_secret',
					value: 'sample-secret',
					undocumented: true,
				},
			}).success,
		).toBe(false);
	});

	it('validates base64 process input and int64 filesystem sizes', () => {
		const sandboxHeaders = {
			e2bSandboxId: 'sandbox-test',
			e2bSandboxPort: 49983,
			e2bAccessToken: 'sandbox-access-token',
		};
		expect(
			E2bEndpointInputSchemas['process.sendInput'].safeParse({
				headers: sandboxHeaders,
				body: { process: { pid: 101 }, input: { stdin: 'aGVsbG8=' } },
			}).success,
		).toBe(true);
		expect(
			E2bEndpointInputSchemas['process.sendInput'].safeParse({
				headers: sandboxHeaders,
				body: { process: { pid: 101 }, input: { stdin: 'hello' } },
			}).success,
		).toBe(false);
		expect(
			E2bEndpointOutputSchemas['filesystem.listDir'].safeParse({
				entries: [{ name: 'large.bin', size: '9007199254740993' }],
			}).success,
		).toBe(true);
	});

	it('validates representative response and no-content shapes', () => {
		expect(
			E2bEndpointOutputSchemas['sandboxes.list'].safeParse({
				items: [],
				nextToken: 'next-page',
				totalRunning: 1,
			}).success,
		).toBe(true);
		expect(
			E2bEndpointOutputSchemas['sandboxes.list'].safeParse([]).success,
		).toBe(false);
		expect(
			E2bEndpointOutputSchemas['sandboxes.kill'].safeParse(undefined).success,
		).toBe(true);
		expect(
			E2bEndpointOutputSchemas['sandboxes.kill'].safeParse({}).success,
		).toBe(false);
	});

	it('accepts fields and enum values envd adds in newer versions', () => {
		expect(
			E2bEndpointOutputSchemas['filesystem.listDir'].safeParse({
				entries: [
					{ name: 'a', type: 'FILE_TYPE_SOCKET', inode: 12, path: '/a' },
				],
			}).success,
		).toBe(true);
		expect(
			E2bEndpointOutputSchemas['process.list'].safeParse({
				processes: [{ pid: 1, config: { cmd: 'sh', user: 'root' }, extra: 1 }],
			}).success,
		).toBe(true);
		expect(
			E2bEndpointOutputSchemas['filesystem.remove'].safeParse({ removed: true })
				.success,
		).toBe(true);
	});

	it('marks billed, irreversible and deleting operations destructive', () => {
		// E2B bills compute per second while a sandbox runs, so starting,
		// resuming, forking or extending one spends money.
		const destructive = [
			'sandboxes.create',
			'sandboxes.fork',
			'sandboxes.connect',
			'sandboxes.setTimeout',
			'sandboxes.refresh',
			'sandboxes.kill',
			'templates.delete',
			'tags.delete',
			'volumes.delete',
			'secrets.delete',
			'filesystem.remove',
			'process.sendSignal',
		] as const;
		for (const id of destructive) {
			expect([id, e2bEndpointMeta[id].riskLevel]).toEqual([id, 'destructive']);
			expect([id, e2bOperationRoutes[id].riskLevel]).toEqual([
				id,
				'destructive',
			]);
		}
	});
});
