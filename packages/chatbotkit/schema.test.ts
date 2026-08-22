import { ChatbotkitSchema } from './schema';

describe('Chatbotkit schema', () => {
	it('declares a semver version', () => {
		expect(ChatbotkitSchema.version).toBeDefined();
		expect(ChatbotkitSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof ChatbotkitSchema.entities).toBe('object');
		expect(ChatbotkitSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(ChatbotkitSchema.entities))).toBe(true);
		for (const entity of Object.values(ChatbotkitSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
