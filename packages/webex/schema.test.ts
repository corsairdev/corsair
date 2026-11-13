import { WebexSchema } from './schema';

describe('Webex schema', () => {
	it('declares a semver version', () => {
		expect(WebexSchema.version).toBeDefined();
		expect(WebexSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof WebexSchema.entities).toBe('object');
		expect(WebexSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(WebexSchema.entities))).toBe(true);
		for (const entity of Object.values(WebexSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});

	it('caches nothing, since a space changes with every message', () => {
		// A room's lastActivity, a message list and a membership all move as
		// people talk, so a stored copy would be wrong within a conversation.
		expect(Object.keys(WebexSchema.entities)).toHaveLength(0);
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
