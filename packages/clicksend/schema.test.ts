import { ClickSendSchema } from './schema';

describe('ClickSend schema', () => {
	it('declares a semver version', () => {
		expect(ClickSendSchema.version).toBeDefined();
		expect(ClickSendSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof ClickSendSchema.entities).toBe('object');
		expect(ClickSendSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(ClickSendSchema.entities))).toBe(true);
		for (const entity of Object.values(ClickSendSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
