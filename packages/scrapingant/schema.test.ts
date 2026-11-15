import { ScrapingAntSchema } from './schema';

describe('ScrapingAnt schema', () => {
	it('declares a semver version', () => {
		expect(ScrapingAntSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('stores nothing locally', () => {
		// Every operation reads a live page or the current credit balance;
		// nothing the plugin receives can be looked up again later, and a stored
		// copy of a page goes stale the moment it is written.
		expect(Array.isArray(ScrapingAntSchema.entities)).toBe(false);
		expect(ScrapingAntSchema.entities).toEqual({});
	});
});
