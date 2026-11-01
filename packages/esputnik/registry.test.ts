import { esputnikEndpointSchemas, esputnikEndpointsNested } from './index';

// Recursive traversal intentionally uses unknown because endpoint groups mix
// nested objects and callable leaves; every leaf is checked before use.
type EndpointTree = Record<string, unknown>;

function operationNames(tree: EndpointTree, prefix = ''): string[] {
	return Object.entries(tree).flatMap(([name, value]) => {
		const operation = prefix ? `${prefix}.${name}` : name;
		if (typeof value === 'function') return [operation];
		return operationNames(value as EndpointTree, operation);
	});
}

describe('eSputnik endpoint registry', () => {
	it('registers all 110 operations with schema contracts', () => {
		const operations = operationNames(esputnikEndpointsNested).sort();
		const schemaOperations = Object.keys(esputnikEndpointSchemas).sort();

		expect(operations).toHaveLength(110);
		expect(schemaOperations).toEqual(operations);
	});

	it('exposes callable handlers for every registered operation', () => {
		for (const operation of operationNames(esputnikEndpointsNested)) {
			const leaf = operation
				.split('.')
				.reduce<unknown>(
					(tree, name) => (tree as Record<string, unknown>)[name],
					esputnikEndpointsNested,
				);
			expect(typeof leaf).toBe('function');
		}
	});
});
