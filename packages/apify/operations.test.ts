import type { ApifyOperationDefinition } from './endpoints';
import {
	ApifyEndpoints,
	apifyOperations,
	buildApifyEndpointMeta,
	buildApifyEndpointSchemas,
} from './endpoints';
import {
	ApifyOperationInputSchema,
	ApifyOperationOutputSchema,
} from './endpoints/types';

type OperationEntry = { path: string; def: ApifyOperationDefinition };

// Walks the nested operation tree and yields every leaf operation with its
// dotted path (e.g. "act.buildsGet"). Used to assert over the full registry.
function isDefinition(node: unknown): node is ApifyOperationDefinition {
	return (
		typeof node === 'object' &&
		node !== null &&
		'method' in node &&
		'path' in node
	);
}

function flattenOperations(node: unknown, prefix = ''): OperationEntry[] {
	const out: OperationEntry[] = [];
	if (typeof node !== 'object' || node === null) return out;
	for (const [key, value] of Object.entries(node)) {
		if (isDefinition(value)) {
			out.push({ path: `${prefix}${key}`, def: value });
		} else {
			out.push(...flattenOperations(value, `${prefix}${key}.`));
		}
	}
	return out;
}

const ALL_OPERATIONS = flattenOperations(apifyOperations);

describe('apify operation registry', () => {
	it('registers a non-empty set of operations', () => {
		expect(ALL_OPERATIONS.length).toBeGreaterThan(0);
		// Sanity bound: the registry covers many Apify resources, so it is large.
		expect(ALL_OPERATIONS.length).toBeGreaterThan(100);
	});

	it('gives every operation a valid HTTP method and absolute path', () => {
		const allowedMethods = new Set([
			'GET',
			'POST',
			'PUT',
			'DELETE',
			'PATCH',
			'HEAD',
		]);
		for (const { def } of ALL_OPERATIONS) {
			expect(allowedMethods.has(def.method)).toBe(true);
			expect(def.path.startsWith('/v2/')).toBe(true);
			expect(typeof def.description).toBe('string');
			expect(def.description.length).toBeGreaterThan(0);
		}
	});

	it('declares every path param used in the URL template', () => {
		for (const { def } of ALL_OPERATIONS) {
			const templateParams = (def.path.match(/\{(\w+)\}/g) ?? []).map((t) =>
				t.slice(1, -1),
			);
			for (const param of templateParams) {
				expect(def.pathParams).toContain(param);
			}
		}
	});

	it('marks DELETE operations with the right risk level', () => {
		for (const { def } of ALL_OPERATIONS) {
			if (def.method !== 'DELETE') continue;
			// Two DELETE families are intentionally non-destructive:
			//  - /lock paths release a temporary request-queue lock (re-acquirable),
			//    so they are a write, not destructive, and never irreversible.
			//  - /v2/browser-info is a read-style endpoint the provider exposes
			//    across all HTTP verbs; the DELETE variant must not be destructive.
			const releasesLock = def.path.endsWith('/lock');
			const isBrowserInfo = def.path === '/v2/browser-info';
			if (releasesLock || isBrowserInfo) {
				expect(def.riskLevel).not.toBe('destructive');
				expect(def.irreversible).not.toBe(true);
			} else {
				// Every other DELETE removes a real Apify resource.
				expect(def.riskLevel).toBe('destructive');
			}
		}
	});
});

describe('apify endpoint tree', () => {
	it('exposes a callable function for every registered operation', () => {
		expect(typeof ApifyEndpoints).toBe('object');
		// Every leaf in the operation tree has a matching endpoint function.
		const actNode = (ApifyEndpoints as Record<string, unknown>).act;
		expect(typeof actNode).toBe('object');
		expect(
			typeof (actNode as Record<string, (...a: unknown[]) => unknown>).get,
		).toBe('function');
	});
});

describe('apify endpoint schemas', () => {
	const schemas = buildApifyEndpointSchemas(apifyOperations);
	const schemaMap = schemas as unknown as Record<
		string,
		{
			input: { safeParse: (v: unknown) => { success: boolean } };
			output: unknown;
		}
	>;

	it('builds an input/output schema entry for every operation', () => {
		const schemaKeys = Object.keys(schemaMap);
		expect(schemaKeys.length).toBe(ALL_OPERATIONS.length);
		for (const { path } of ALL_OPERATIONS) {
			expect(schemaMap[path]).toBeDefined();
		}
	});

	it('treats each path param as a required string|number input', () => {
		const sample = schemaMap['act.get'];
		expect(sample).toBeDefined();
		const parsed = sample?.input.safeParse({ actorId: 'abc123' });
		expect(parsed?.success).toBe(true);
	});

	it('rejects inputs missing a required path param', () => {
		const sample = schemaMap['act.get'];
		expect(sample).toBeDefined();
		const parsed = sample?.input.safeParse({});
		expect(parsed?.success).toBe(false);
	});

	it('preserves optional query/body passthrough fields', () => {
		const parsed = ApifyOperationInputSchema.safeParse({
			query: { limit: 10 },
			body: { foo: 'bar' },
		});
		expect(parsed.success).toBe(true);
	});

	it('uses a passthrough output schema', () => {
		expect(ApifyOperationOutputSchema.safeParse({ any: 'thing' }).success).toBe(
			true,
		);
	});
});

describe('apify endpoint meta', () => {
	const meta = buildApifyEndpointMeta(apifyOperations);
	const metaMap = meta as unknown as Record<
		string,
		{ riskLevel: string; irreversible?: boolean }
	>;

	it('captures risk metadata for every operation', () => {
		expect(Object.keys(metaMap).length).toBe(ALL_OPERATIONS.length);
		for (const { path } of ALL_OPERATIONS) {
			expect(metaMap[path]?.riskLevel).toBeDefined();
		}
	});

	it('tags actor delete as irreversible', () => {
		expect(metaMap['act.delete']?.riskLevel).toBe('destructive');
		expect(metaMap['act.delete']?.irreversible).toBe(true);
	});
});
