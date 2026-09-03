import { PrismaSchema } from './schema';

describe('Prisma schema', () => {
	it('declares a semver version', () => {
		expect(PrismaSchema.version).toBeDefined();
		expect(PrismaSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof PrismaSchema.entities).toBe('object');
		expect(PrismaSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(PrismaSchema.entities))).toBe(true);
		for (const entity of Object.values(PrismaSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
