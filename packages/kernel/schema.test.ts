import { kernelEndpointSchemas } from './endpoints/catalog';
import {
	KernelManifestSchema,
	kernelDefinitions,
	kernelManifest,
	kernelOperations,
} from './endpoints/manifest';
import {
	getKernelInputSchema,
	getKernelOutputSchema,
} from './endpoints/openapi-schema';
import { KERNEL_OPERATION_IDS } from './endpoints/operation-types';
import {
	KernelEndpointInputSchemas,
	KernelEndpointOutputSchemas,
} from './endpoints/types';
import { KernelSchema } from './schema';

const ids = kernelOperations.map((operation) => operation.id);

describe('kernel-manifest.json', () => {
	it('matches the manifest schema', () => {
		expect(
			KernelManifestSchema.safeParse(kernelManifest).error?.issues ?? [],
		).toEqual([]);
	});

	it('has 200 operations, one per id, matching the generated types', () => {
		expect(ids).toHaveLength(200);
		expect(new Set(ids).size).toBe(200);
		expect([...KERNEL_OPERATION_IDS].sort()).toEqual([...ids].sort());
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
					!(inner in kernelDefinitions)
				) {
					missing.add(inner);
				}
				visit(inner);
			}
		};
		visit(kernelManifest);
		expect([...missing]).toEqual([]);
	});

	it('names the y coordinate y, not the "true" the published spec has', () => {
		const text = JSON.stringify(kernelManifest);
		expect(text).not.toContain('"true":');
		expect(text).not.toMatch(/"required":\[[^\]]*true/);
	});

	it('leaves out the routes the README lists', () => {
		const routes = kernelOperations.map(
			(operation) => `${operation.method} ${operation.path}`,
		);
		for (const route of [
			'POST /mpp/browsers',
			'GET /vault/card-captures/current',
			'POST /vault/card-ingest/{payment_method_id}',
			'GET /projects',
			'GET /invocations/{id}/events',
			'GET /auth/connections/{id}/events',
			'GET /browsers/{id_or_name}/logs/stream',
		]) {
			expect(routes).not.toContain(route);
		}
	});
});

describe('zod schemas', () => {
	it.each(ids)('%s builds its input and output schemas', (id) => {
		expect(getKernelInputSchema(id)).toBeDefined();
		expect(getKernelOutputSchema(id)).toBeDefined();
		expect(
			kernelEndpointSchemas[id as keyof typeof kernelEndpointSchemas].input,
		).toBe(getKernelInputSchema(id));
	});

	it('exposes a schema for every id through the exported records', () => {
		expect(Object.keys(KernelEndpointInputSchemas).sort()).toEqual(
			[...ids].sort(),
		);
		expect(Object.keys(KernelEndpointOutputSchemas).sort()).toEqual(
			[...ids].sort(),
		);
	});

	it("types a pool browser's memory as a string, not an object", () => {
		const schema = getKernelInputSchema('browserPools.create');
		expect(schema.safeParse({ size: 1, memory: '2GiB' }).success).toBe(true);
		expect(schema.safeParse({ size: 1, memory: { size: 2 } }).success).toBe(
			false,
		);
	});

	it('takes a file as a URL, {url}, {base64} or a Blob', () => {
		const schema = getKernelInputSchema('extensions.upload');
		for (const file of [
			'https://example.com/ext.zip',
			{ url: 'https://example.com/ext.zip' },
			{ base64: 'UEsFBg==', filename: 'ext.zip' },
			new Blob(['x']),
		]) {
			expect(schema.safeParse({ file }).success).toBe(true);
		}
		expect(schema.safeParse({ file: 42 }).success).toBe(false);
	});

	it('takes either vault item shape in an upsert body', () => {
		const schema = getKernelInputSchema('vaults.items.upsert');
		expect(
			schema.safeParse({
				id_or_name: 'v',
				key: 'k',
				type: 'wallet',
				spec: { provider: 'kernel' },
			}).success,
		).toBe(true);
		expect(schema.safeParse({ id_or_name: 'v', key: 'k' }).success).toBe(false);
	});
});

describe('Kernel schema', () => {
	it('stores no entities', () => {
		expect(KernelSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
		expect(KernelSchema.entities).toEqual({});
	});
});
