import { SalesflareEndpointInputSchemas } from './endpoints/types';
import { salesflare, salesflareEndpointSchemas } from './index';
import { SalesflareSchema } from './schema';

jest.mock('./client', () => ({
	makeSalesflareRequest: jest.fn(),
}));

import { makeSalesflareRequest } from './client';

// unknown: zod v4 field internals are read to derive type-appropriate
// boundary values; stricter typing would couple the tests to zod internals.
type ZodField = { isOptional: () => boolean; _zod: { def: { type: string } } };

function requiredKeys(schema: { shape: Record<string, ZodField> }): string[] {
	return Object.keys(schema.shape).filter(
		// unknown: zod v4 field records are read structurally; optional chaining
		// guards the indexed access under noUncheckedIndexedAccess.
		(key) => schema.shape[key]?.isOptional() === false,
	);
}

function buildValidInput(schema: {
	shape: Record<string, ZodField>;
}): Record<string, unknown> {
	// Minimal valid input: only required fields get values. Optional fields
	// stay absent — placeholder strings would violate enum and array
	// contracts and test nothing about the required-field boundary.
	const input: Record<string, unknown> = {};
	for (const [key, field] of Object.entries(schema.shape)) {
		if (field.isOptional()) continue;
		const type = field._zod.def.type;
		input[key] =
			type === 'number' ? 1 : type === 'boolean' ? true : 'test-' + key;
	}
	return input;
}

describe('Salesflare schema', () => {
	it('declares a semver version', () => {
		expect(SalesflareSchema.version).toBeDefined();
		expect(SalesflareSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof SalesflareSchema.entities).toBe('object');
		expect(SalesflareSchema.entities).not.toBeNull();
	});

	it('registers the full current Salesflare operation catalog', () => {
		expect(
			Object.keys(salesflareEndpointSchemas).length,
		).toBeGreaterThanOrEqual(71);
	});

	it('provides executable input and output contracts for every operation', () => {
		for (const schemas of Object.values(salesflareEndpointSchemas)) {
			expect(typeof schemas.input.safeParse).toBe('function');
			expect(typeof schemas.output.safeParse).toBe('function');
		}
	});

	it('keeps every registered endpoint behind a schema boundary', () => {
		const plugin = salesflare({ key: 'secret' });
		const paths: string[] = [];
		// unknown: the walk covers heterogeneous tree levels (functions and
		// group objects) before any Zod parsing, so a single stricter type
		// cannot describe both shapes.
		const visit = (value: unknown, prefix: string[] = []) => {
			if (typeof value === 'function') {
				paths.push(prefix.join('.'));
				return;
			}
			if (value && typeof value === 'object') {
				for (const [key, child] of Object.entries(value)) {
					visit(child, [...prefix, key]);
				}
			}
		};

		visit(plugin.endpoints);
		expect(paths).toHaveLength(Object.keys(salesflareEndpointSchemas).length);
		for (const path of paths) {
			expect(
				salesflareEndpointSchemas[
					path as keyof typeof salesflareEndpointSchemas
				],
			).toBeDefined();
		}
	});

	it('requires required fields at the schema boundary for every operation', () => {
		for (const [, rawSchema] of Object.entries(
			SalesflareEndpointInputSchemas,
		)) {
			// unknown: zod v4 schema objects are accessed structurally to derive
			// the required-field table; stricter typing would couple the test to
			// zod internals.
			const schema = rawSchema as unknown as {
				shape: Record<string, ZodField>;
				safeParse: (value: unknown) => { success: boolean };
			};
			const required = requiredKeys(schema);
			if (!required.length) continue;
			expect(schema.safeParse({}).success).toBe(false);
			expect(schema.safeParse(buildValidInput(schema)).success).toBe(true);
		}
	});

	it('rejects unsafe path identifiers at the endpoint boundary', async () => {
		const plugin = salesflare({ key: 'secret' });
		const ctx = {
			key: 'secret',
			options: {},
			$getAccountId: jest.fn().mockResolvedValue('account-1'),
		} as never;
		const unsafe = '../users';
		await expect(
			(
				plugin.endpoints as unknown as {
					accounts: {
						retrieveAccount: (ctx: unknown, input: unknown) => Promise<unknown>;
					};
				}
			).accounts.retrieveAccount(ctx, { accountId: unsafe }),
		).rejects.toThrow('Invalid Salesflare account_id');
		await expect(
			(
				plugin.endpoints as unknown as {
					tasks: {
						deleteTask: (ctx: unknown, input: unknown) => Promise<unknown>;
					};
				}
			).tasks.deleteTask(ctx, { id: '.' }),
		).rejects.toThrow('Invalid Salesflare id');
	});

	// Per the plugin endpoint-test rule, this table-driven traversal invokes
	// every registered operation and asserts one request plus response parsing.
	it('exercises every registered operation through its public boundary', async () => {
		const request = jest.mocked(makeSalesflareRequest);
		request.mockClear();
		const plugin = salesflare({ key: 'secret' });
		const ctx = {
			key: 'secret',
			options: {},
			$getAccountId: jest.fn().mockResolvedValue('account-1'),
		} as never;
		// Real-shaped Salesflare records, chosen independently of the output
		// schemas so a contract that rejects genuine payloads or strips
		// documented fields fails here instead of in production.
		const outputCandidates = [
			{
				data: [
					{
						id: 'rec-1',
						name: 'Real record',
						createdAt: 1700000000000,
						updatedAt: 1700000000001,
					},
				],
			},
			{
				id: 'rec-1',
				name: 'Real record',
				createdAt: 1700000000000,
				updatedAt: 1700000000001,
			},
			[],
			{},
			undefined,
		];
		let invokedOperations = 0;
		// unknown: the walk covers functions and group objects across the
		// plugin tree; the endpoint contract only exists after the group path
		// is joined, so a single stricter type cannot describe both shapes.
		const visit = async (value: unknown, prefix: string[] = []) => {
			if (typeof value === 'function') {
				invokedOperations += 1;
				const path = prefix.join('.') as keyof typeof salesflareEndpointSchemas;
				const contract = salesflareEndpointSchemas[path];
				if (!contract) throw new Error(`Missing contract for ${path}`);
				if (!contract.input || !contract.output) {
					throw new Error(`Missing input or output contract for ${path}`);
				}
				// unknown: zod v4 schema objects are read structurally to build a
				// valid input; stricter typing would couple the test to zod.
				const shape = (
					contract.input as unknown as {
						shape: Record<string, ZodField>;
					}
				).shape;
				const input: Record<string, unknown> = {};
				for (const [key, field] of Object.entries(shape)) {
					if (field.isOptional()) continue;
					const type = field._zod.def.type;
					input[key] =
						type === 'number' ? 1 : type === 'boolean' ? true : 'test-' + key;
				}
				const output = outputCandidates.find(
					(candidate) => contract.output.safeParse(candidate).success,
				);
				request.mockResolvedValue(output);
				const result = await (
					value as (context: unknown, args: unknown) => Promise<unknown>
				)(ctx, input);
				if (output !== undefined) {
					expect(result).toEqual(output);
				}
				return;
			}
			if (value && typeof value === 'object') {
				for (const [key, child] of Object.entries(value)) {
					await visit(child, [...prefix, key]);
				}
			}
		};

		await visit(plugin.endpoints);
		expect(invokedOperations).toBe(
			Object.keys(salesflareEndpointSchemas).length,
		);
		expect(request).toHaveBeenCalledTimes(invokedOperations);
	});
});
