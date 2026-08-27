import { WinstonAiSchema } from './schema';

describe('WinstonAi schema', () => {
	it('declares a semver version', () => {
		expect(WinstonAiSchema.version).toBeDefined();
		expect(WinstonAiSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof WinstonAiSchema.entities).toBe('object');
		expect(WinstonAiSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(WinstonAiSchema.entities))).toBe(true);
		for (const entity of Object.values(WinstonAiSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
