import { YandexSchema } from './schema';

describe('Yandex schema', () => {
	it('declares a semver version', () => {
		expect(YandexSchema.version).toBeDefined();
		expect(YandexSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof YandexSchema.entities).toBe('object');
		expect(YandexSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(YandexSchema.entities))).toBe(true);
		for (const entity of Object.values(YandexSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});

	it('caches nothing, since a translation is per request', () => {
		// Each call translates the text it is given, and nothing about a previous
		// translation is worth keeping.
		expect(Object.keys(YandexSchema.entities)).toHaveLength(0);
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
