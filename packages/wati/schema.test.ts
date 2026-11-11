import { WatiSchema } from './schema';

describe('WATI schema', () => {
	it('declares a semver version', () => {
		expect(WatiSchema.version).toBeDefined();
		expect(WatiSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof WatiSchema.entities).toBe('object');
		expect(WatiSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(WatiSchema.entities))).toBe(true);
		for (const entity of Object.values(WatiSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});

	it('caches nothing, since a conversation changes with every message', () => {
		// An unread count, a status and a last message all move as the thread
		// does, so a stored copy would go stale within a conversation turn.
		expect(Object.keys(WatiSchema.entities)).toHaveLength(0);
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
