import {
	daytonaEndpointMeta,
	daytonaEndpointSchemas,
} from './endpoints/catalog';
import {
	DaytonaManifestSchema,
	daytonaManifest,
	daytonaOperations,
} from './endpoints/manifest';
import {
	daytonaInputFields,
	getDaytonaInputSchema,
	getDaytonaOutputSchema,
} from './endpoints/openapi-schema';
import { DAYTONA_OPERATION_IDS } from './endpoints/operation-types';

const ids = daytonaOperations.map((operation) => operation.id);

function operation(id: string) {
	const found = daytonaOperations.find((o) => o.id === id);
	if (!found) throw new Error(`no operation ${id}`);
	return found;
}

describe('daytona-manifest.json', () => {
	it('matches the manifest schema', () => {
		expect(
			DaytonaManifestSchema.safeParse(daytonaManifest).error?.issues ?? [],
		).toEqual([]);
	});

	it('has 215 operations, one per id and route', () => {
		expect(ids).toHaveLength(215);
		expect(new Set(ids).size).toBe(215);
		expect([...DAYTONA_OPERATION_IDS].sort()).toEqual([...ids].sort());
		const routes = new Set(
			daytonaOperations.map((o) => `${o.method} ${o.path}`),
		);
		expect(routes.size).toBe(215);
	});

	it('covers the groups of the public API', () => {
		const groups = new Set(
			ids.flatMap((id) => [
				id.split('.')[0],
				id.split('.').slice(0, 2).join('.'),
			]),
		);
		for (const group of [
			'sandboxes',
			'snapshots',
			'volumes',
			'dockerRegistries',
			'secrets',
			'organizations',
			'apiKeys',
			'warmPools',
			'audit',
			'webhooks',
			'toolbox.files',
			'toolbox.process',
			'toolbox.git',
			'toolbox.lsp',
			'toolbox.interpreter',
			'toolbox.computerUse',
			'analytics.usage',
			'analytics.telemetry',
		]) {
			expect([group, groups.has(group)]).toEqual([group, true]);
		}
	});

	it('marks the toolbox and analytics routes and takes the sandbox they go to', () => {
		const toolbox = daytonaOperations.filter((o) => o.plane === 'toolbox');
		expect(toolbox.length).toBeGreaterThan(90);
		for (const o of toolbox) {
			expect(o.id.startsWith('toolbox.')).toBe(true);
			expect(
				daytonaInputFields(o.id).find((f) => f.name === 'sandbox_id')?.in,
			).toBe('sandbox');
		}
		expect(
			daytonaOperations.filter((o) => o.plane === 'analytics').map((o) => o.id),
		).toHaveLength(8);
	});
});

describe('schemas', () => {
	it('builds every input and output schema', () => {
		for (const id of ids) {
			expect(() => getDaytonaInputSchema(id)).not.toThrow();
			expect(() => getDaytonaOutputSchema(id)).not.toThrow();
		}
	});

	it('gives every operation lazy schemas and meta in the catalog', () => {
		expect(Object.keys(daytonaEndpointSchemas).sort()).toEqual([...ids].sort());
		expect(Object.keys(daytonaEndpointMeta).sort()).toEqual([...ids].sort());
		for (const id of ids) {
			const meta = daytonaEndpointMeta[id as keyof typeof daytonaEndpointMeta];
			expect(['read', 'write', 'destructive']).toContain(meta.riskLevel);
			expect(meta.description.length).toBeGreaterThan(5);
		}
	});

	it('keeps outputs lenient: unknown fields pass and documented ones may be missing', () => {
		const out = getDaytonaOutputSchema('sandboxes.get').parse({
			id: 's_1',
			newField: 1,
		}) as Record<string, unknown>;
		expect(out.newField).toBe(1);
	});

	it('keeps inputs strict on required fields', () => {
		const exec = getDaytonaInputSchema('toolbox.process.executeCommand');
		expect(exec.safeParse({ sandbox_id: 's', command: 'ls' }).success).toBe(
			true,
		);
		expect(exec.safeParse({ sandbox_id: 's' }).success).toBe(false);
		expect(exec.safeParse({ command: 'ls' }).success).toBe(false);
	});
});

describe('risk levels', () => {
	const risk = (id: string) =>
		daytonaEndpointMeta[id as keyof typeof daytonaEndpointMeta].riskLevel;

	it('marks spending, sending and deleting destructive', () => {
		for (const id of [
			'sandboxes.create',
			'sandboxes.start',
			'sandboxes.fork',
			'toolbox.process.executeCommand',
			'toolbox.git.pushChanges',
			'organizations.regenerateProxyApiKey',
			'sandboxes.delete',
			'volumes.delete',
		]) {
			expect([id, risk(id)]).toEqual([id, 'destructive']);
		}
	});

	it('keeps reads read and plain changes write', () => {
		for (const id of [
			'sandboxes.list',
			'toolbox.files.download',
			'toolbox.files.search',
		]) {
			expect([id, risk(id)]).toEqual([id, 'read']);
		}
		for (const id of ['sandboxes.replaceLabels', 'secrets.update']) {
			expect([id, risk(id)]).toEqual([id, 'write']);
		}
	});
});
