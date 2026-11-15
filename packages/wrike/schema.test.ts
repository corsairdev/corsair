import { WrikeSchema } from './schema';

describe('Wrike schema', () => {
	it('declares a semver version', () => {
		expect(WrikeSchema.version).toBeDefined();
		expect(WrikeSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof WrikeSchema.entities).toBe('object');
		expect(WrikeSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(WrikeSchema.entities))).toBe(true);
		for (const entity of Object.values(WrikeSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});

	it('caches nothing, since a task changes as work progresses', () => {
		// A task moves through statuses, gains assignees and accumulates time
		// logs, so a stored copy would disagree with the board.
		expect(Object.keys(WrikeSchema.entities)).toHaveLength(0);
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
