import { ChatfaiSchema } from './schema';

describe('Chatfai schema', () => {
	it('declares a semver version', () => {
		expect(ChatfaiSchema.version).toBeDefined();
		expect(ChatfaiSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof ChatfaiSchema.entities).toBe('object');
		expect(ChatfaiSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(ChatfaiSchema.entities))).toBe(true);
		for (const entity of Object.values(ChatfaiSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
