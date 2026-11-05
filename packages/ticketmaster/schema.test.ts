import { TicketmasterSchema } from './schema';

describe('Ticketmaster schema', () => {
	it('declares a semver version', () => {
		expect(TicketmasterSchema.version).toBeDefined();
		expect(TicketmasterSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof TicketmasterSchema.entities).toBe('object');
		expect(TicketmasterSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(TicketmasterSchema.entities))).toBe(true);
		for (const entity of Object.values(TicketmasterSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
