import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { makeEsputnikRequest } from './client';
import { EsputnikEndpointOutputSchemas } from './endpoints/types';
import type { EsputnikContext } from './index';
import { esputnik } from './index';
import { operationFixtures as fixtures } from './test-fixtures';

jest.mock('./client', () => ({ makeEsputnikRequest: jest.fn() }));

const request = jest.mocked(makeEsputnikRequest);
const wrappedEndpoints = esputnik().endpoints as unknown as Record<
	string,
	unknown
>;
// Endpoint handlers only read the API key from context; the schema wrapper
// does not require the remaining runtime fields.
const context = { key: 'test-api-key' } as unknown as EsputnikContext;

// Provider request bodies are schema-validated before transport, so the
// contract test treats extension fields as opaque values.
type ExpectedContract = {
	path: string;
	options: {
		method?: string;
		accept?: string;
		query?: Record<string, string | number | boolean | undefined>;
		body?: Record<string, unknown>;
	};
};

const expectedContracts = JSON.parse(
	readFileSync(join(__dirname, 'request-contracts.json'), 'utf8'),
) as Record<string, ExpectedContract>;

// The endpoint tree mixes nested groups and handlers, so traversal needs
// unknown until the function leaf check narrows each value.
function operationNames(tree: Record<string, unknown>, prefix = ''): string[] {
	return Object.entries(tree).flatMap(([name, value]) => {
		const operation = prefix ? `${prefix}.${name}` : name;
		if (typeof value === 'function') return [operation];
		return operationNames(value as Record<string, unknown>, operation);
	});
}

// The wrapper validates responses after transport, so mock a value accepted
// by each operation's output schema instead of a generic undefined.
function validOutput(operation: string): unknown {
	const schema =
		EsputnikEndpointOutputSchemas[
			operation as keyof typeof EsputnikEndpointOutputSchemas
		];
	for (const candidate of [
		undefined,
		'ok',
		[],
		{},
		{ id: 1 },
		{ active: true },
		{ results: [] },
	]) {
		if (schema.safeParse(candidate).success) return candidate;
	}
	throw new Error(`No valid response fixture for ${operation}`);
}

describe('eSputnik request contracts', () => {
	let response: unknown;

	beforeEach(() => {
		response = undefined;
		request.mockImplementation(async () => response);
	});

	afterEach(() => jest.clearAllMocks());

	it('matches the registered operation set', () => {
		expect(Object.keys(expectedContracts).sort()).toEqual(
			operationNames(wrappedEndpoints).sort(),
		);
	});

	it('sends the documented method, route, query, and body for every operation', async () => {
		for (const operation of operationNames(wrappedEndpoints)) {
			const name = operation.split('.').pop() as string;
			const expected = expectedContracts[operation];
			const input = fixtures[name] ?? {};
			const endpoint = operation
				.split('.')
				.reduce<unknown>(
					(tree, part) => (tree as Record<string, unknown>)[part],
					wrappedEndpoints,
				);
			if (!expected)
				throw new Error(`Missing expected contract for ${operation}`);
			if (typeof endpoint !== 'function')
				throw new Error(`Missing endpoint ${operation}`);

			response = validOutput(name);
			const callsBefore = request.mock.calls.length;
			await endpoint(context, input);
			expect(request.mock.calls).toHaveLength(callsBefore + 1);

			const [path, key, options] = request.mock.calls.at(-1) ?? [];
			expect({ operation, path }).toEqual({
				operation,
				path: expected.path,
			});
			expect(key).toBe('test-api-key');
			expect({ operation, options }).toEqual({
				operation,
				options: expected.options,
			});
		}

		expect(request).toHaveBeenCalledTimes(108);
	});
});
