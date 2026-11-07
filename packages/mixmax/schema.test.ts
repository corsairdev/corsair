import { mixmax, mixmaxEndpointSchemas } from './index';
import { MixmaxSchema } from './schema';

jest.mock('./client', () => ({
	...jest.requireActual('./client'),
	makeMixmaxRequest: jest.fn(),
}));

import { makeMixmaxRequest } from './client';

const request = jest.mocked(makeMixmaxRequest);

type Leaf = [
	operation: string,
	handler: (ctx: unknown, input: unknown) => Promise<unknown>,
];

// unknown: the walk covers heterogeneous tree levels (functions and group
// objects) before any Zod parsing, so a single stricter type cannot describe
// both shapes.
const flattenLeaves = (tree: object, prefix = ''): Leaf[] =>
	Object.entries(tree).flatMap(([name, value]): Leaf[] => {
		const path = prefix ? `${prefix}.${name}` : name;
		if (typeof value === 'function') return [[path, value]];
		if (value && typeof value === 'object')
			return flattenLeaves(value as object, path);
		return [];
	});

// The handlers under test read only `key` from the runtime context and log
// through logEventFromContext, which needs $getAccountId; every other
// context service is untouched by these code paths.
const ctx = {
	key: 'mixmax_test_key',
	$getAccountId: async () => 'account-1',
} as never;

// unknown: zod v4 field internals are read structurally to derive
// type-appropriate fixture values; stricter typing would couple the test to
// zod internals, and every access is guarded because wrapper types differ.
type ZodField = {
	isOptional?: () => boolean;
	safeParse: (value: unknown) => { success: boolean };
	_zod: {
		def: {
			type: string;
			innerType?: ZodField;
			element?: ZodField;
			shape?: Record<string, ZodField>;
			options?: ZodField[];
			values?: unknown[];
			entrytype?: ZodField;
		};
	};
};

// Builds a minimal fixture that satisfies the schema: cheap scalars first,
// then the required fields of an object shape, then the first workable union
// branch. Returns undefined when nothing applies (valid for z.undefined
// output contracts of 204/no-body operations).
function buildOutputFixture(schema: ZodField, depth = 0): unknown {
	if (depth > 8) return undefined;
	for (const candidate of [undefined, {}, [], 1, true]) {
		if (schema.safeParse(candidate).success) return candidate;
	}
	const def = schema._zod.def;
	if (def.innerType) return buildOutputFixture(def.innerType, depth + 1);
	if (def.type === 'string') return 'mixmax-test';
	if (def.type === 'literal') return def.values?.[0];
	if (def.type === 'enum' || def.type === 'record') return 'mixmax-test';
	if (def.shape) {
		const fixture: Record<string, unknown> = {};
		for (const [key, field] of Object.entries(def.shape)) {
			if (field.isOptional?.()) continue;
			fixture[key] = buildOutputFixture(field, depth + 1);
		}
		return fixture;
	}
	if (def.type === 'array') return [];
	if (def.options) {
		for (const option of def.options) {
			const fixture = buildOutputFixture(option, depth + 1);
			if (schema.safeParse(fixture).success) return fixture;
		}
	}
	return undefined;
}

describe('Mixmax schema', () => {
	it('declares a semver version', () => {
		expect(MixmaxSchema.version).toBeDefined();
		expect(MixmaxSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof MixmaxSchema.entities).toBe('object');
		expect(MixmaxSchema.entities).not.toBeNull();
	});

	it('provides executable input and output contracts for every operation', () => {
		for (const [operation, schemas] of Object.entries(mixmaxEndpointSchemas)) {
			expect(typeof schemas.input.safeParse).toBe('function');
			expect(typeof schemas.output.safeParse).toBe('function');
			expect(operation.length).toBeGreaterThan(0);
		}
	});

	it('registers the full current Mixmax operation catalog', () => {
		// Part 1 of the current provider inventory: 135 live operations in the
		// official reference, implemented across three parts (44 + 41 + 47).
		// Tightened to the exact count as each part lands.
		expect(Object.keys(mixmaxEndpointSchemas).length).toBeGreaterThanOrEqual(
			44,
		);
	});

	// The factory always builds the validated endpoint tree, so the endpoints
	// accessor is defined on every plugin instance.
	const endpoints = mixmax({ key: 'mixmax_test_key' }).endpoints!;

	it('keeps every registered endpoint behind a schema boundary', async () => {
		const leaves = flattenLeaves(endpoints as object);
		expect(leaves.length).toBe(Object.keys(mixmaxEndpointSchemas).length);

		for (const [operation, handler] of leaves) {
			const schemas =
				mixmaxEndpointSchemas[operation as keyof typeof mixmaxEndpointSchemas];
			expect(schemas).toBeDefined();
			if (!schemas) continue;

			request.mockReset();
			// A mock response that already satisfies the operation's output
			// contract, so the wrapper's output parse observes a legal value.
			// unknown: the fixture builder reads zod v4 internals structurally;
			// the narrowest possible assertion bridges the concrete zod schema
			// to that structural view without weakening production types.
			const mockResponse = buildOutputFixture(
				schemas.output as unknown as ZodField,
			);
			if (!schemas.output.safeParse(mockResponse).success) {
				throw new Error(
					`output schema of ${operation} rejects every generated fixture`,
				);
			}
			request.mockResolvedValue(mockResponse);

			const acceptsEmpty = schemas.input.safeParse({}).success;

			// unknown: an invalid empty payload must be rejected by the input
			// schema before the transport mock is reached; an all-optional
			// operation may legitimately proceed with `{}`.
			const call = handler(ctx, {});
			if (acceptsEmpty) {
				await call;
				expect(request).toHaveBeenCalledTimes(1);
			} else {
				await expect(call).rejects.toThrow();
				expect(request).not.toHaveBeenCalled();
			}
		}
	});
});
