import { zepEndpointMeta } from './endpoints/catalog';
import {
	ZepManifestSchema,
	zepDefinitions,
	zepManifest,
	zepOperations,
} from './endpoints/manifest';
import {
	getZepInputSchema,
	getZepOutputSchema,
} from './endpoints/openapi-schema';
import { ZEP_OPERATION_IDS } from './endpoints/operation-types';

const ids = zepOperations.map((operation) => operation.id);
const OPERATION_COUNT = 205;

describe('zep-manifest.json', () => {
	it('matches the manifest schema', () => {
		expect(
			ZepManifestSchema.safeParse(zepManifest).error?.issues ?? [],
		).toEqual([]);
	});

	it(`has ${OPERATION_COUNT} operations, one per id and route`, () => {
		expect(ids).toHaveLength(OPERATION_COUNT);
		expect(new Set(ids).size).toBe(OPERATION_COUNT);
		expect([...ZEP_OPERATION_IDS].sort()).toEqual([...ids].sort());
		const routes = new Set(zepOperations.map((o) => `${o.method} ${o.path}`));
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
					!(inner in zepDefinitions)
				) {
					missing.add(inner);
				}
				visit(inner);
			}
		};
		visit(zepManifest);
		expect([...missing]).toEqual([]);
	});

	it('marks every path parameter required', () => {
		const loose: string[] = [];
		for (const operation of zepOperations) {
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
				getZepInputSchema(id);
				getZepOutputSchema(id);
			} catch (error) {
				failed.push(`${id}: ${(error as Error).message}`);
			}
		}
		expect(failed).toEqual([]);
	});

	it('requires path parameters and refuses unknown keys on body-less routes', () => {
		const operation = zepOperations.find(
			(o) => o.request === 'none' && /\{\w+\}/.test(o.path),
		);
		if (!operation) return;
		const schema = getZepInputSchema(operation.id);
		expect(schema.safeParse({}).success).toBe(false);
		expect(schema.safeParse({ __not_a_field__: 1 }).success).toBe(false);
	});

	it('parses JSON responses leniently: unknown fields pass', () => {
		const failed: string[] = [];
		for (const operation of zepOperations) {
			if (operation.response !== 'json') continue;
			const output = operation.output ?? {};
			const resolved =
				typeof output.$ref === 'string'
					? (zepDefinitions[output.$ref] ?? {})
					: output;
			if (resolved.type !== 'object' || !resolved.properties) continue;
			const parsed = getZepOutputSchema(operation.id).safeParse({
				__added_later__: { nested: true },
			});
			if (!parsed.success) failed.push(operation.id);
		}
		expect(failed).toEqual([]);
	});
});

describe('risk levels (R8)', () => {
	it('marks every DELETE destructive', () => {
		const wrong = zepOperations
			.filter((o) => o.method === 'DELETE')
			.filter(
				(o) =>
					zepEndpointMeta[o.id as keyof typeof zepEndpointMeta].riskLevel !==
					'destructive',
			)
			.map((o) => o.id);
		expect(wrong).toEqual([]);
	});

	it('marks every GET read', () => {
		const wrong = zepOperations
			.filter((o) => o.method === 'GET')
			.filter(
				(o) =>
					zepEndpointMeta[o.id as keyof typeof zepEndpointMeta].riskLevel !==
					'read',
			)
			.map((o) => o.id);
		expect(wrong).toEqual([]);
	});

	it('gives every operation a description', () => {
		const missing = ids.filter(
			(id) =>
				(zepEndpointMeta[id as keyof typeof zepEndpointMeta].description ?? '')
					.length < 20,
		);
		expect(missing).toEqual([]);
	});
});
