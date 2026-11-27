import {
	mongodbatlasEndpointMeta,
	mongodbatlasEndpointSchemas,
} from './endpoints/catalog';
import {
	MongoDBAtlasManifestSchema,
	mongodbatlasDefinitions,
	mongodbatlasManifest,
	mongodbatlasOperations,
} from './endpoints/manifest';
import {
	getMongoDBAtlasInputSchema,
	getMongoDBAtlasOutputSchema,
} from './endpoints/openapi-schema';
import { MONGODBATLAS_OPERATION_IDS } from './endpoints/operation-types';

const ids = mongodbatlasOperations.map((operation) => operation.id);

function operation(id: string) {
	const found = mongodbatlasOperations.find((o) => o.id === id);
	if (!found) throw new Error(`no operation ${id}`);
	return found;
}

const risk = (id: string) =>
	mongodbatlasEndpointMeta[id as keyof typeof mongodbatlasEndpointMeta]
		.riskLevel;

describe('mongodbatlas-manifest.json', () => {
	it('matches the manifest schema', () => {
		expect(
			MongoDBAtlasManifestSchema.safeParse(mongodbatlasManifest).error
				?.issues ?? [],
		).toEqual([]);
	});

	it('has 489 operations, one per id and route', () => {
		expect(ids).toHaveLength(489);
		expect(new Set(ids).size).toBe(489);
		expect([...MONGODBATLAS_OPERATION_IDS].sort()).toEqual([...ids].sort());
		const routes = new Set(
			mongodbatlasOperations.map((o) => `${o.method} ${o.path}`),
		);
		expect(routes.size).toBe(489);
		expect(mongodbatlasManifest.version).toBe('2.0');
	});

	it('pins every operation to one versioned media type', () => {
		for (const op of mongodbatlasOperations) {
			expect(op.accept).toBe(
				`application/vnd.atlas.${op.version}+${op.response === 'file' ? op.accept.split('+')[1] : 'json'}`,
			);
		}
		expect(operation('clusters.listClusters').version).toBe('2024-08-05');
	});

	it('resolves every schema reference', () => {
		const missing = new Set<string>();
		// `unknown` because the walk covers raw JSON Schema documents.
		const visit = (value: unknown) => {
			if (Array.isArray(value)) return value.forEach(visit);
			if (typeof value !== 'object' || value === null) return;
			for (const [key, inner] of Object.entries(value)) {
				if (
					key === '$ref' &&
					typeof inner === 'string' &&
					!(inner in mongodbatlasDefinitions)
				) {
					missing.add(inner);
				}
				visit(inner);
			}
		};
		visit(mongodbatlasManifest);
		expect([...missing]).toEqual([]);
	});

	it('maps routes to the right kinds', () => {
		expect(operation('clusters.deleteCluster').response).toBe('empty');
		expect(operation('monitoringAndLogs.downloadClusterLog').response).toBe(
			'file',
		);
		expect(operation('invoices.getInvoiceCsv').response).toBe('file');
		expect(operation('clusters.listClusters').paged).toBe(true);
		const props = operation('projectIpAccessList.createAccessListEntry').input
			.properties as Record<string, Record<string, unknown>>;
		expect(props.body?.['x-corsair-in']).toBe('bodyRoot');
		const user = operation('databaseUsers.createDatabaseUser').input
			.properties as Record<string, Record<string, unknown>>;
		expect(user.groupId).toMatchObject({
			'x-corsair-in': 'path',
			'x-corsair-body': true,
		});
	});
});

describe('catalog', () => {
	it('has meta and schemas for every operation', () => {
		expect(Object.keys(mongodbatlasEndpointMeta).sort()).toEqual(
			[...ids].sort(),
		);
		expect(Object.keys(mongodbatlasEndpointSchemas).sort()).toEqual(
			[...ids].sort(),
		);
		for (const meta of Object.values(mongodbatlasEndpointMeta)) {
			expect(meta.description.length).toBeGreaterThan(5);
		}
	});

	it('builds every input and output schema', () => {
		for (const id of ids) {
			expect(getMongoDBAtlasInputSchema(id)).toBeDefined();
			expect(getMongoDBAtlasOutputSchema(id)).toBeDefined();
		}
	});

	it('rates reads, writes and destructive calls (R8)', () => {
		for (const id of ['clusters.listClusters', 'clusters.getCluster']) {
			expect([id, risk(id)]).toEqual([id, 'read']);
		}
		for (const id of ['projectIpAccessList.createAccessListEntry']) {
			expect([id, risk(id)]).toEqual([id, 'write']);
		}
		for (const id of [
			'clusters.deleteCluster',
			'clusters.createCluster',
			'clusters.updateCluster',
			'databaseUsers.deleteDatabaseUser',
		]) {
			expect([id, risk(id)]).toEqual([id, 'destructive']);
		}
		expect(
			mongodbatlasOperations
				.filter((o) => o.method === 'DELETE')
				.filter((o) => risk(o.id) !== 'destructive')
				.map((o) => o.id),
		).toEqual([]);
		expect(
			mongodbatlasOperations
				.filter((o) => o.method === 'GET')
				.filter((o) => risk(o.id) !== 'read')
				.map((o) => o.id),
		).toEqual([]);
	});

	it('takes the required fields and refuses a malformed id or enum', () => {
		const get = getMongoDBAtlasInputSchema('clusters.getCluster');
		expect(get.safeParse({ groupId: '5f43e7f0a1b2c3d4e5f60718' }).success).toBe(
			false,
		);
		expect(
			get.safeParse({
				groupId: '5f43e7f0a1b2c3d4e5f60718',
				clusterName: 'Cluster0',
			}).success,
		).toBe(true);
		expect(
			get.safeParse({ groupId: 'nope', clusterName: 'Cluster0' }).success,
		).toBe(false);
	});

	it('parses responses leniently: unknown fields kept, missing ones fine', () => {
		const out = getMongoDBAtlasOutputSchema('clusters.getCluster').parse({
			name: 'Cluster0',
			brandNew: { x: 1 },
		}) as Record<string, unknown>;
		expect(out.brandNew).toEqual({ x: 1 });
		expect(
			getMongoDBAtlasOutputSchema('clusters.getCluster').safeParse({
				name: 5,
			}).success,
		).toBe(false);
	});
});
