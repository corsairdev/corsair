import { TicketmasterSchema } from './schema';

describe('Ticketmaster schema', () => {
	it('declares a semver version', () => {
		expect(TicketmasterSchema.version).toBeDefined();
		expect(TicketmasterSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map, not an array', () => {
		expect(typeof TicketmasterSchema.entities).toBe('object');
		expect(TicketmasterSchema.entities).not.toBeNull();
		// `Object.keys()` is always an array, so asserting on it proved nothing:
		// check the map itself, so an array cannot pass as the entity map.
		expect(Array.isArray(TicketmasterSchema.entities)).toBe(false);
		for (const entity of Object.values(TicketmasterSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
