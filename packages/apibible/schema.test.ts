import { ApiBibleSchema } from './schema';

describe('ApiBible schema', () => {
	it('declares a semver version', () => {
		expect(ApiBibleSchema.version).toBeDefined();
		expect(ApiBibleSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares docs-labeled entities from API.Bible resources', () => {
		expect(Object.keys(ApiBibleSchema.entities).sort()).toEqual([
			'audioBibles',
			'audioChapters',
			'bibles',
			'books',
			'chapters',
			'passages',
			'sections',
			'verses',
		]);
		for (const entity of Object.values(ApiBibleSchema.entities)) {
			expect(entity).toBeDefined();
			expect(typeof entity.parse).toBe('function');
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
