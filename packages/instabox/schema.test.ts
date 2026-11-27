import {
	instaboxEndpointMeta,
	instaboxEndpointSchemas,
} from './endpoints/catalog';
import {
	InstaboxManifestSchema,
	instaboxManifest,
	instaboxOperations,
} from './endpoints/manifest';
import {
	getInstaboxInputSchema,
	getInstaboxOutputSchema,
	instaboxInputFields,
} from './endpoints/openapi-schema';
import { INSTABOX_OPERATION_IDS } from './endpoints/operation-types';

const ids = instaboxOperations.map((operation) => operation.id);

function operation(id: string) {
	const found = instaboxOperations.find((o) => o.id === id);
	if (!found) throw new Error(`no operation ${id}`);
	return found;
}

describe('instabox-manifest.json', () => {
	it('matches the manifest schema', () => {
		expect(
			InstaboxManifestSchema.safeParse(instaboxManifest).error?.issues ?? [],
		).toEqual([]);
	});

	it('has 129 operations, one per id and route', () => {
		expect(ids).toHaveLength(129);
		expect(new Set(ids).size).toBe(129);
		expect([...INSTABOX_OPERATION_IDS].sort()).toEqual([...ids].sort());
		const routes = new Set(
			instaboxOperations.map((o) => `${o.method} ${o.path}`),
		);
		expect(routes.size).toBe(129);
	});

	it('covers the groups of the public API', () => {
		const groups = new Set(ids.map((id) => id.split('.')[0]));
		for (const group of [
			'machines',
			'snapshots',
			'exports',
			'operations',
			'orgs',
			'keys',
			'vault',
			'usage',
			'templates',
			'ports',
			'gpuQueue',
			'sessions',
			'support',
			'me',
		]) {
			expect(groups.has(group)).toBe(true);
		}
	});

	it('sends lifecycle keys and delete confirmations as headers', () => {
		const fields = (id: string) =>
			Object.fromEntries(instaboxInputFields(id).map((f) => [f.name, f]));
		expect(fields('machines.create').idempotency_key).toEqual(
			expect.objectContaining({ in: 'header', generated: true }),
		);
		expect(fields('machines.delete').confirm_delete).toEqual(
			expect.objectContaining({ in: 'header', defaultFrom: 'id' }),
		);
		expect(operation('machines.files.write').request).toBe('raw');
		expect(operation('exports.download').response).toBe('file');
	});
});

describe('schemas', () => {
	it('builds every input and output schema', () => {
		for (const id of ids) {
			expect(() => getInstaboxInputSchema(id)).not.toThrow();
			expect(() => getInstaboxOutputSchema(id)).not.toThrow();
		}
	});

	it('gives every operation lazy schemas and meta in the catalog', () => {
		expect(Object.keys(instaboxEndpointSchemas).sort()).toEqual(
			[...ids].sort(),
		);
		expect(Object.keys(instaboxEndpointMeta).sort()).toEqual([...ids].sort());
		for (const id of ids) {
			const meta =
				instaboxEndpointMeta[id as keyof typeof instaboxEndpointMeta];
			expect(['read', 'write', 'destructive']).toContain(meta.riskLevel);
			expect(meta.description.length).toBeGreaterThan(5);
		}
	});

	it('keeps outputs lenient: unknown fields pass and documented ones may be missing', () => {
		const out = getInstaboxOutputSchema('machines.get').parse({
			id: 'm_1',
			newField: 1,
		}) as Record<string, unknown>;
		expect(out.newField).toBe(1);
	});

	it('keeps inputs strict on documented limits', () => {
		const exec = getInstaboxInputSchema('machines.exec');
		expect(
			exec.safeParse({ id: 'm_k3m7q2abx5wr4hj6zpcnfa2etd', cmd: 'ls' }).success,
		).toBe(true);
		expect(
			exec.safeParse({ id: 'm_k3m7q2abx5wr4hj6zpcnfa2etd', argv: [] }).success,
		).toBe(false);
		expect(exec.safeParse({ id: 'M_BAD!', cmd: 'ls' }).success).toBe(false);
	});
});

describe('risk levels', () => {
	const risk = (id: string) =>
		instaboxEndpointMeta[id as keyof typeof instaboxEndpointMeta].riskLevel;

	it('marks spending, sending and deleting destructive', () => {
		for (const id of [
			'machines.create',
			'machines.start',
			'machines.fork',
			'machines.exec',
			'orgs.billing.topup',
			'orgs.invites.create',
			'machines.delete',
			'snapshots.delete',
		]) {
			expect([id, risk(id)]).toEqual([id, 'destructive']);
		}
	});

	it('keeps reads read and plain changes write', () => {
		for (const id of [
			'machines.list',
			'machines.files.download',
			'usage.get',
		]) {
			expect([id, risk(id)]).toEqual([id, 'read']);
		}
		for (const id of ['machines.update', 'orgs.secrets.set']) {
			expect([id, risk(id)]).toEqual([id, 'write']);
		}
	});
});
