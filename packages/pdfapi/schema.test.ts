import {
	PdfApiEndpointInputSchemas,
	PdfApiEndpointOutputSchemas,
} from './endpoints/types';
import { pdfApiEndpointSchemas, pdfapi } from './index';
import { PdfApiSchema } from './schema';

jest.mock('./client', () => ({
	makePdfApiRequest: jest.fn(),
}));

import { makePdfApiRequest } from './client';

// unknown: zod v4 field internals are read to derive type-appropriate
// boundary values; stricter typing would couple the tests to zod internals.
type ZodField = {
	isOptional: () => boolean;
	_zod: {
		def: {
			type: string;
			element?: ZodField;
			entries?: Record<string, string>;
			shape?: Record<string, ZodField>;
		};
	};
};

function scalarFor(field: ZodField, key: string): unknown {
	const type = field._zod.def.type;
	if (type === 'number') {
		return 1;
	}
	if (type === 'boolean') {
		return true;
	}
	if (type === 'enum') {
		// unknown: zod v4 enum defs store the allowed members in entries; the
		// first documented member satisfies the contract.
		const entries = field._zod.def.entries;
		return entries ? Object.values(entries)[0] : 'test-' + key;
	}
	if (type === 'array') {
		// unknown: zod v4 array element defs are read structurally to build a
		// type-appropriate scalar; stricter typing would couple the test to
		// zod internals.
		const element = field._zod.def.element;
		return [element ? scalarFor(element, key) : 'test-' + key];
	}
	if (type === 'record') {
		return {};
	}
	if (type === 'object') {
		// unknown: zod v4 object defs are read structurally to build a
		// shape-valid nested input.
		const inner = field._zod.def.shape ?? {};
		const out: Record<string, unknown> = {};
		for (const [k, f] of Object.entries(inner)) {
			if (f.isOptional()) continue;
			out[k] = scalarFor(f, k);
		}
		return out;
	}
	return 'test-' + key;
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
		input[key] = scalarFor(field, key);
	}
	return input;
}

describe('PdfApi schema', () => {
	it('declares a semver version', () => {
		expect(PdfApiSchema.version).toBeDefined();
		expect(PdfApiSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof PdfApiSchema.entities).toBe('object');
		expect(PdfApiSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(PdfApiSchema.entities))).toBe(true);
	});

	it('registers the full current PdfApi operation catalog', () => {
		expect(Object.keys(pdfApiEndpointSchemas).length).toBeGreaterThanOrEqual(4);
	});

	it('provides executable input and output contracts for every operation', () => {
		for (const schemas of Object.values(pdfApiEndpointSchemas)) {
			expect(typeof schemas.input.safeParse).toBe('function');
			expect(typeof schemas.output.safeParse).toBe('function');
		}
	});

	it('requires required fields at the schema boundary for every operation', () => {
		for (const [, rawSchema] of Object.entries(PdfApiEndpointInputSchemas)) {
			// unknown: zod v4 schema objects are accessed structurally to derive
			// the required-field table; stricter typing would couple the test to
			// zod internals.
			const schema = rawSchema as unknown as {
				shape: Record<string, ZodField>;
				safeParse: (value: unknown) => { success: boolean };
			};
			const required = Object.keys(schema.shape).filter(
				// unknown: zod v4 field records are read structurally; optional
				// chaining guards the indexed access under noUncheckedIndexedAccess.
				(key) => schema.shape[key]?.isOptional() === false,
			);
			if (!required.length) continue;
			expect(schema.safeParse({}).success).toBe(false);
			expect(schema.safeParse(buildValidInput(schema)).success).toBe(true);
		}
	});

	// Per the plugin endpoint-test rule, this table-driven traversal invokes
	// every registered operation through its schema boundary with fixed
	// provider-shaped response mocks.
	it('exercises every registered operation through its public boundary', async () => {
		const request = jest.mocked(makePdfApiRequest);
		request.mockClear();
		const plugin = pdfapi({ key: 'secret' });
		// never: the fixture provides exactly the context fields these
		// handlers read (key, options, $getAccountId); omitted runtime
		// services are not exercised by this plugin endpoints.
		const ctx = {
			key: 'secret',
			options: {},
			$getAccountId: jest.fn().mockResolvedValue('account-1'),
		} as never;
		// unknown: spec-derived mocks, one per operation, keyed by operation path.
		const fixedOutputs: Record<string, unknown> = {
			'templates.listTemplates': [
				{
					id: 'tpl-1',
					name: 'Invoice Template',
					created_at: '2023-04-15T10:30:00Z',
				},
			],
			'templates.retrieveTemplate': {
				id: 'tpl-1',
				name: 'Invoice Template',
				variables: [],
			},
			'templates.renderTemplate': { status: 200, data: 'base64-pdf' },
			'templates.mergeTemplates': { status: 200, data: 'base64-merged' },
		};
		let invokedOperations = 0;
		// unknown: the walk covers functions and group objects across the
		// plugin tree; the contract resolves only after the path joins.
		const visit = async (value: unknown, prefix: string[] = []) => {
			if (typeof value === 'function') {
				invokedOperations += 1;
				const path = prefix.join('.') as keyof typeof pdfApiEndpointSchemas;
				const contract = pdfApiEndpointSchemas[path];
				if (!contract) throw new Error(`Missing contract for ${path}`);
				if (!contract.input || !contract.output) {
					throw new Error(`Missing input or output contract for ${path}`);
				}
				// unknown: zod v4 schema objects are read structurally to build a
				// valid input; stricter typing would couple the test to zod.
				const input = buildValidInput(
					contract.input as unknown as {
						shape: Record<string, ZodField>;
					},
				);
				if (!(path in fixedOutputs)) {
					throw new Error(
						'No fixed provider-shaped response registered for ' + String(path),
					);
				}
				const output = fixedOutputs[path];
				request.mockResolvedValue(output);
				const result =
					await // unknown: walked leaf invoked at the boundary under test
					(value as (context: unknown, args: unknown) => Promise<unknown>)(
						ctx,
						input,
					);
				expect(result).toEqual(output);
				return;
			}
			if (value && typeof value === 'object') {
				for (const [key, child] of Object.entries(value)) {
					await visit(child, [...prefix, key]);
				}
			}
		};

		await visit(plugin.endpoints);
		expect(invokedOperations).toBe(Object.keys(pdfApiEndpointSchemas).length);
		expect(request).toHaveBeenCalledTimes(invokedOperations);
	});

	it('rejects malformed render envelopes at the output boundary', () => {
		// unknown: zod v4 schema objects are exercised structurally through
		// safeParse; stricter typing would couple the test to zod internals.
		const parse = (schema: unknown, value: unknown): { success: boolean } =>
			(schema as { safeParse: (v: unknown) => { success: boolean } }).safeParse(
				value,
			);
		const renderOutput = PdfApiEndpointOutputSchemas.renderTemplate;
		expect(parse(renderOutput, { data: 42 }).success).toBe(false);
		expect(parse(renderOutput, { url: 42 }).success).toBe(false);
		expect(
			parse(renderOutput, { status: 200, data: 'base64-pdf' }).success,
		).toBe(true);
		expect(parse(renderOutput, { status: 200, url: 'https://x' }).success).toBe(
			true,
		);
	});
});
