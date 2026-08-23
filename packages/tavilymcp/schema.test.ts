import { TavilyMcpSchema } from './schema';

describe('TavilyMcp schema', () => {
	it('declares a semver version', () => {
		expect(TavilyMcpSchema.version).toBeDefined();
		expect(TavilyMcpSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof TavilyMcpSchema.entities).toBe('object');
		expect(TavilyMcpSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(TavilyMcpSchema.entities))).toBe(true);
		for (const entity of Object.values(TavilyMcpSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});
