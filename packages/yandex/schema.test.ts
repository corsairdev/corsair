import { YandexEndpointInputSchemas } from './endpoints/types';
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

describe('folderId descriptions', () => {
	it.each(['translate', 'detectLanguages', 'listLanguages'] as const)(
		'%s says a user-account IAM token always needs folderId',
		(operation) => {
			// Yandex requires folder_id on every call made with a user account's IAM
			// token, however many folders the account reaches. Saying it was only
			// needed for several folders told single-folder users to drop it.
			const description =
				YandexEndpointInputSchemas[operation].shape.folderId.description ?? '';
			expect(description).toMatch(/user account/i);
			expect(description).not.toMatch(/several/i);
		},
	);
});
