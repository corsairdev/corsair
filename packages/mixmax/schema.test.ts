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
			// If none of these simple envelopes parses, the output schema is
			// over-restrictive and this test fails by design.
			const outputCandidates = [
				undefined,
				{},
				{ _id: 'mixmax-test' },
				{ results: [] },
				{ recipients: [] },
				[],
			];
			// findIndex, not find: a valid `undefined` envelope (204/no-body
			// operations) is indistinguishable from "no candidate matched".
			const validOutputIndex = outputCandidates.findIndex(
				(candidate) => schemas.output.safeParse(candidate).success,
			);
			expect(validOutputIndex).toBeGreaterThanOrEqual(0);
			request.mockResolvedValue(
				// unknown: the candidate list is heterogeneous (undefined,
				// objects, arrays), which no single narrower type can express.
				outputCandidates[validOutputIndex],
			);

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
