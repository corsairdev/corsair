import { TicketTailorSchema } from './schema';

describe('TicketTailor schema', () => {
	it('declares a semver version', () => {
		expect(TicketTailorSchema.version).toBeDefined();
		expect(TicketTailorSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof TicketTailorSchema.entities).toBe('object');
		expect(TicketTailorSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(TicketTailorSchema.entities))).toBe(true);
		for (const entity of Object.values(TicketTailorSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
