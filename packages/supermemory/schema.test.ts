import { supermemoryEndpointMeta } from './endpoints/catalog';
import {
	SupermemoryManifestSchema,
	supermemoryDefinitions,
	supermemoryManifest,
	supermemoryOperations,
} from './endpoints/manifest';
import {
	getSupermemoryInputSchema,
	getSupermemoryOutputSchema,
} from './endpoints/openapi-schema';
import { SUPERMEMORY_OPERATION_IDS } from './endpoints/operation-types';

const ids = supermemoryOperations.map((operation) => operation.id);
const OPERATION_COUNT = 74;

describe('supermemory-manifest.json', () => {
	it('matches the manifest schema', () => {
		expect(
			SupermemoryManifestSchema.safeParse(supermemoryManifest).error?.issues ??
				[],
		).toEqual([]);
	});

	it(`has ${OPERATION_COUNT} operations, one per id and route`, () => {
		expect(ids).toHaveLength(OPERATION_COUNT);
		expect(new Set(ids).size).toBe(OPERATION_COUNT);
		expect([...SUPERMEMORY_OPERATION_IDS].sort()).toEqual([...ids].sort());
		const routes = new Set(
			supermemoryOperations.map((o) => `${o.method} ${o.path}`),
		);
		expect(routes.size).toBe(OPERATION_COUNT);
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
					!(inner in supermemoryDefinitions)
				) {
					missing.add(inner);
				}
				visit(inner);
			}
		};
		visit(supermemoryManifest);
		expect([...missing]).toEqual([]);
	});

	it('marks every path parameter required', () => {
		const loose: string[] = [];
		for (const operation of supermemoryOperations) {
			const properties = (operation.input.properties ?? {}) as Record<
				string,
				// `unknown` because property schemas are raw JSON Schema documents.
				Record<string, unknown>
			>;
			const required = new Set(
				(operation.input.required as string[] | undefined) ?? [],
			);
			for (const [name, schema] of Object.entries(properties)) {
				if (schema['x-corsair-in'] === 'path' && !required.has(name)) {
					loose.push(`${operation.id}.${name}`);
				}
			}
			for (const match of operation.path.matchAll(/\{(\w+)\}/g)) {
				const wire = match[1];
				const declared = Object.entries(properties).some(
					([name, schema]) =>
						schema['x-corsair-in'] === 'path' &&
						(schema['x-corsair-name'] ?? name) === wire,
				);
				if (!declared) loose.push(`${operation.id}: {${wire}} undeclared`);
			}
		}
		expect(loose).toEqual([]);
	});
});

describe('schemas', () => {
	it('builds every input and output schema', () => {
		const failed: string[] = [];
		for (const id of ids) {
			try {
				getSupermemoryInputSchema(id);
				getSupermemoryOutputSchema(id);
			} catch (error) {
				failed.push(`${id}: ${(error as Error).message}`);
			}
		}
		expect(failed).toEqual([]);
	});

	it('requires path parameters and refuses unknown keys on body-less routes', () => {
		const operation = supermemoryOperations.find(
			(o) => o.request === 'none' && /\{\w+\}/.test(o.path),
		);
		if (!operation) return;
		const schema = getSupermemoryInputSchema(operation.id);
		expect(schema.safeParse({}).success).toBe(false);
		expect(schema.safeParse({ __not_a_field__: 1 }).success).toBe(false);
	});

	it('parses JSON responses leniently: unknown fields pass', () => {
		const failed: string[] = [];
		for (const operation of supermemoryOperations) {
			if (operation.response !== 'json') continue;
			const output = operation.output ?? {};
			const resolved =
				typeof output.$ref === 'string'
					? (supermemoryDefinitions[output.$ref] ?? {})
					: output;
			if (resolved.type !== 'object' || !resolved.properties) continue;
			const parsed = getSupermemoryOutputSchema(operation.id).safeParse({
				__added_later__: { nested: true },
			});
			if (!parsed.success) failed.push(operation.id);
		}
		expect(failed).toEqual([]);
	});
});

describe('risk levels (R8)', () => {
	it('marks every DELETE destructive', () => {
		const wrong = supermemoryOperations
			.filter((o) => o.method === 'DELETE')
			.filter(
				(o) =>
					supermemoryEndpointMeta[o.id as keyof typeof supermemoryEndpointMeta]
						.riskLevel !== 'destructive',
			)
			.map((o) => o.id);
		expect(wrong).toEqual([]);
	});

	it('marks every GET read', () => {
		const wrong = supermemoryOperations
			.filter((o) => o.method === 'GET')
			.filter(
				(o) =>
					supermemoryEndpointMeta[o.id as keyof typeof supermemoryEndpointMeta]
						.riskLevel !== 'read',
			)
			.map((o) => o.id);
		expect(wrong).toEqual([]);
	});

	it('gives every operation a description', () => {
		const missing = ids.filter(
			(id) =>
				(
					supermemoryEndpointMeta[id as keyof typeof supermemoryEndpointMeta]
						.description ?? ''
				).length < 20,
		);
		expect(missing).toEqual([]);
	});
});
