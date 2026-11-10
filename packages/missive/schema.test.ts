import { missiveEndpoints } from './endpoints';
import {
	MissiveEndpointInputSchemas,
	MissiveEndpointOutputSchemas,
} from './endpoints/types';
import { MISSIVE_OPERATIONS } from './operations';
import { MissiveSchema } from './schema';

function endpointKeys(tree: object, prefix = ''): string[] {
	return Object.entries(tree).flatMap(([key, value]) => {
		const path = prefix ? `${prefix}.${key}` : key;
		if (typeof value === 'function') return [path];
		if (value && typeof value === 'object') return endpointKeys(value, path);
		return [];
	});
}

describe('Missive schema', () => {
	it('declares a semver version', () => {
		expect(MissiveSchema.version).toBeDefined();
		expect(MissiveSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof MissiveSchema.entities).toBe('object');
		expect(MissiveSchema.entities).not.toBeNull();
	});

	it('registers all Part 1 operations exactly once with matching schemas', () => {
		const keys = MISSIVE_OPERATIONS.map(({ key }) => key);
		expect(keys).toHaveLength(42);
		expect(new Set(keys).size).toBe(keys.length);
		expect(
			new Set(MISSIVE_OPERATIONS.map(({ method, path }) => `${method} ${path}`))
				.size,
		).toBe(42);
		expect(endpointKeys(missiveEndpoints).sort()).toEqual(keys.sort());
		expect(Object.keys(MissiveEndpointInputSchemas).sort()).toEqual(
			keys.slice().sort(),
		);
		expect(Object.keys(MissiveEndpointOutputSchemas)).toEqual(
			Object.keys(MissiveEndpointInputSchemas),
		);
	});

	it('gives every operation a real sentence description', () => {
		for (const operation of MISSIVE_OPERATIONS) {
			expect(operation.description.length).toBeGreaterThan(20);
			expect(operation.description).not.toBe(operation.key);
		}
	});
});
