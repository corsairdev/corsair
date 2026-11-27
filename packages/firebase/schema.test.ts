import {
	firebaseEndpointMeta,
	firebaseEndpointSchemas,
} from './endpoints/catalog';
import {
	FirebaseManifestSchema,
	firebaseApis,
	firebaseDefinitions,
	firebaseManifest,
	firebaseOperations,
} from './endpoints/manifest';
import {
	getFirebaseInputSchema,
	getFirebaseOutputSchema,
} from './endpoints/openapi-schema';
import { FIREBASE_OPERATION_IDS } from './endpoints/operation-types';

const ids = firebaseOperations.map((operation) => operation.id);

function operation(id: string) {
	const found = firebaseOperations.find((o) => o.id === id);
	if (!found) throw new Error(`no operation ${id}`);
	return found;
}

const risk = (id: string) =>
	firebaseEndpointMeta[id as keyof typeof firebaseEndpointMeta].riskLevel;

describe('firebase-manifest.json', () => {
	it('matches the manifest schema', () => {
		expect(
			FirebaseManifestSchema.safeParse(firebaseManifest).error?.issues ?? [],
		).toEqual([]);
	});

	it('has 405 operations over 13 APIs plus the Realtime Database', () => {
		expect(ids).toHaveLength(405);
		expect(new Set(ids).size).toBe(405);
		expect([...FIREBASE_OPERATION_IDS].sort()).toEqual([...ids].sort());
		expect(Object.keys(firebaseApis).sort()).toEqual([
			'fcm_v1',
			'firebase_v1beta1',
			'firebaseappcheck_v1',
			'firebaseappdistribution_v1',
			'firebasedatabase_v1beta',
			'firebasehosting_v1beta1',
			'firebaseremoteconfig_v1',
			'firebaserules_v1',
			'firebasestorage_v1beta',
			'firestore_v1',
			'identitytoolkit_v1',
			'identitytoolkit_v2',
			'rtdb',
			'storage_v1',
		]);
		for (const op of firebaseOperations) {
			expect(firebaseApis[op.api]).toBeDefined();
		}
	});

	it('leaves out the streaming RPCs and the hosting aliases', () => {
		const paths = firebaseOperations.map((o) => `${o.method} ${o.path}`);
		expect(paths).not.toContain('POST v1/{+database}/documents:listen');
		expect(paths).not.toContain('POST v1/{+database}/documents:write');
		expect(
			ids.filter((id) => id.startsWith('hosting.projects.sites.versions')),
		).toEqual([]);
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
					!(inner in firebaseDefinitions)
				) {
					missing.add(inner);
				}
				visit(inner);
			}
		};
		visit(firebaseManifest);
		expect([...missing]).toEqual([]);
	});

	it('maps routes to the right kinds', () => {
		expect(operation('storage.objects.insert').uploadPath).toBe(
			'/upload/storage/v1/b/{bucket}/o',
		);
		expect(operation('storage.objects.download')).toMatchObject({
			response: 'file',
			forcedQuery: { alt: 'media' },
		});
		expect(operation('firestore.databases.documents.delete').response).toBe(
			'empty',
		);
		// Streamed over REST as a JSON array (live on the emulator 11-27).
		expect(
			operation('firestore.databases.documents.runQuery').output,
		).toMatchObject({
			type: 'array',
		});
		expect(operation('management.projects.list').paged).toBe(true);
		expect(operation('database.get').api).toBe('rtdb');
		const props = operation('firestore.databases.documents.get').input
			.properties as Record<string, Record<string, unknown>>;
		expect(props.name?.['x-corsair-slashes']).toBe(true);
		// Discovery patterns stay documentation, not validation.
		expect(props.name?.pattern).toBeUndefined();
		expect(props.name?.['x-corsair-pattern']).toBeDefined();
	});
});

describe('catalog', () => {
	it('has meta and schemas for every operation', () => {
		expect(Object.keys(firebaseEndpointMeta).sort()).toEqual([...ids].sort());
		expect(Object.keys(firebaseEndpointSchemas).sort()).toEqual(
			[...ids].sort(),
		);
		for (const meta of Object.values(firebaseEndpointMeta)) {
			expect(meta.description.length).toBeGreaterThan(5);
		}
	});

	it('builds every input and output schema', () => {
		for (const id of ids) {
			expect(getFirebaseInputSchema(id)).toBeDefined();
			expect(getFirebaseOutputSchema(id)).toBeDefined();
		}
	});

	it('rates reads, writes and destructive calls (R8)', () => {
		for (const id of [
			'firestore.databases.documents.get',
			'firestore.databases.documents.runQuery',
			'auth.projects.accounts.lookup',
			'database.get',
			'rules.projects.test',
		]) {
			expect([id, risk(id)]).toEqual([id, 'read']);
		}
		for (const id of [
			'firestore.databases.documents.createDocument',
			'firestore.databases.documents.patch',
			'database.update',
			'database.push',
			'storage.objects.insert',
		]) {
			expect([id, risk(id)]).toEqual([id, 'write']);
		}
		for (const id of [
			'firestore.databases.documents.delete',
			'firestore.databases.importDocuments',
			'messaging.messages.send',
			'auth.projects.accounts.sendOobCode',
			'remoteConfig.projects.updateRemoteConfig',
			'hosting.sites.releases.create',
			'database.set',
			'database.rules.set',
			'management.projects.addFirebase',
			'appDistribution.apps.releases.distribute',
		]) {
			expect([id, risk(id)]).toEqual([id, 'destructive']);
		}
		expect(
			firebaseOperations
				.filter((o) => o.method === 'DELETE')
				.filter((o) => risk(o.id) !== 'destructive')
				.map((o) => o.id),
		).toEqual([]);
	});

	it('takes the required fields and refuses a wrong type or enum', () => {
		const get = getFirebaseInputSchema('firestore.databases.documents.get');
		expect(get.safeParse({}).success).toBe(false);
		expect(
			get.safeParse({ name: 'projects/p/databases/(default)/documents/a/b' })
				.success,
		).toBe(true);
		const send = getFirebaseInputSchema('auth.projects.accounts.sendOobCode');
		expect(
			send.safeParse({ targetProjectId: 'p', requestType: 'NOT_A_TYPE' })
				.success,
		).toBe(false);
		const dbGet = getFirebaseInputSchema('database.get');
		expect(dbGet.safeParse({ path: 'a' }).success).toBe(false);
		expect(
			dbGet.safeParse({ databaseUrl: 'https://x.firebaseio.com', extra: 1 })
				.success,
		).toBe(false);
	});

	it('parses responses leniently: unknown fields kept, missing ones fine', () => {
		const out = getFirebaseOutputSchema('management.projects.get').parse({
			projectId: 'demo',
			brandNew: { x: 1 },
		}) as Record<string, unknown>;
		expect(out.brandNew).toEqual({ x: 1 });
		expect(
			getFirebaseOutputSchema('management.projects.get').safeParse({
				projectId: 5,
			}).success,
		).toBe(false);
	});
});
