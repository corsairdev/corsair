import { nutshellEndpoints } from './endpoints';
import { NUTSHELL_OPERATIONS } from './operations';
import { NutshellSchema } from './schema';

function endpointKeys(tree: object, prefix = ''): string[] {
	return Object.entries(tree).flatMap(([key, value]) => {
		const path = prefix ? `${prefix}.${key}` : key;
		if (typeof value === 'function') return [path];
		if (value && typeof value === 'object') return endpointKeys(value, path);
		return [];
	});
}

describe('Nutshell schema', () => {
	it('declares a semver version', () => {
		expect(NutshellSchema.version).toBeDefined();
		expect(NutshellSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares no entities, because no endpoint writes local rows', () => {
		expect(NutshellSchema.entities).toEqual({});
	});

	it('registers all 114 current documented REST operations exactly once', () => {
		const keys = NUTSHELL_OPERATIONS.map(({ key }) => key);
		expect(keys).toHaveLength(114);
		expect(new Set(keys).size).toBe(keys.length);
		expect(
			new Set(
				NUTSHELL_OPERATIONS.map(({ method, path }) => `${method} ${path}`),
			).size,
		).toBe(114);
		expect(endpointKeys(nutshellEndpoints).sort()).toEqual(keys.sort());
		expect(
			NUTSHELL_OPERATIONS.every(
				(operation) => Reflect.get(operation, 'deprecated') !== true,
			),
		).toBe(true);
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
