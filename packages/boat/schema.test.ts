import { boatEndpointMeta } from './endpoints/catalog';
import {
	BoatManifestSchema,
	boatDefinitions,
	boatManifest,
	boatOperations,
} from './endpoints/manifest';
import {
	getBoatInputSchema,
	getBoatOutputSchema,
} from './endpoints/openapi-schema';
import { BOAT_OPERATION_IDS } from './endpoints/operation-types';

const ids = boatOperations.map((operation) => operation.id);
const OPERATION_COUNT = 125;

describe('boat-manifest.json', () => {
	it('matches the manifest schema', () => {
		expect(
			BoatManifestSchema.safeParse(boatManifest).error?.issues ?? [],
		).toEqual([]);
	});

	it(`has ${OPERATION_COUNT} operations, one per id and route`, () => {
		expect(ids).toHaveLength(OPERATION_COUNT);
		expect(new Set(ids).size).toBe(OPERATION_COUNT);
		expect([...BOAT_OPERATION_IDS].sort()).toEqual([...ids].sort());
		const routes = new Set(boatOperations.map((o) => `${o.method} ${o.path}`));
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
					!(inner in boatDefinitions)
				) {
					missing.add(inner);
				}
				visit(inner);
			}
		};
		visit(boatManifest);
		expect([...missing]).toEqual([]);
	});

	it('marks every path parameter required', () => {
		const loose: string[] = [];
		for (const operation of boatOperations) {
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
				getBoatInputSchema(id);
				getBoatOutputSchema(id);
			} catch (error) {
				failed.push(`${id}: ${(error as Error).message}`);
			}
		}
		expect(failed).toEqual([]);
	});

	it('requires path parameters and refuses unknown keys on body-less routes', () => {
		// A route whose only required fields are plain-string path values.
		const operation = boatOperations.find((o) => {
			if (o.request !== 'none' || !/\{\w+\}/.test(o.path)) return false;
			const properties = (o.input.properties ?? {}) as Record<
				string,
				Record<string, unknown>
			>;
			return ((o.input.required ?? []) as string[]).every((name) => {
				const field = properties[name];
				return (
					field?.['x-corsair-in'] === 'path' &&
					field.type === 'string' &&
					!field.format &&
					!field.pattern &&
					!field.enum
				);
			});
		});
		if (!operation) return;
		const schema = getBoatInputSchema(operation.id);
		const valid = Object.fromEntries(
			((operation.input.required ?? []) as string[]).map((name) => [
				name,
				'value-1',
			]),
		);
		expect(schema.safeParse({}).success).toBe(false);
		expect(schema.safeParse(valid).success).toBe(true);
		const withUnknown = schema.safeParse({ ...valid, __not_a_field__: 1 });
		expect(withUnknown.success).toBe(false);
		expect(JSON.stringify(withUnknown.error?.issues)).toContain(
			'unrecognized_keys',
		);
	});

	it('parses JSON responses leniently: unknown fields pass', () => {
		const failed: string[] = [];
		for (const operation of boatOperations) {
			if (operation.response !== 'json') continue;
			const output = operation.output ?? {};
			const resolved =
				typeof output.$ref === 'string'
					? (boatDefinitions[output.$ref] ?? {})
					: output;
			if (resolved.type !== 'object' || !resolved.properties) continue;
			const parsed = getBoatOutputSchema(operation.id).safeParse({
				__added_later__: { nested: true },
			});
			if (!parsed.success) failed.push(operation.id);
		}
		expect(failed).toEqual([]);
	});
});

describe('risk levels (R8)', () => {
	it('marks every DELETE destructive', () => {
		const wrong = boatOperations
			.filter((o) => o.method === 'DELETE')
			.filter(
				(o) =>
					boatEndpointMeta[o.id as keyof typeof boatEndpointMeta].riskLevel !==
					'destructive',
			)
			.map((o) => o.id);
		expect(wrong).toEqual([]);
	});

	it('marks every GET read', () => {
		const wrong = boatOperations
			.filter((o) => o.method === 'GET')
			.filter(
				(o) =>
					boatEndpointMeta[o.id as keyof typeof boatEndpointMeta].riskLevel !==
					'read',
			)
			.map((o) => o.id);
		expect(wrong).toEqual([]);
	});

	it('gives every operation a description', () => {
		const missing = ids.filter(
			(id) =>
				(
					boatEndpointMeta[id as keyof typeof boatEndpointMeta].description ??
					''
				).length < 20,
		);
		expect(missing).toEqual([]);
	});
});
