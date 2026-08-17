import { NextDNSSchema } from './schema';
import { NextDNSProfileEntity } from './schema/database';

describe('NextDNS schema', () => {
	it('declares a semver version', () => {
		expect(NextDNSSchema.version).toBeDefined();
		expect(NextDNSSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof NextDNSSchema.entities).toBe('object');
		expect(NextDNSSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(NextDNSSchema.entities))).toBe(true);
		for (const entity of Object.values(NextDNSSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});

	it('registers exactly the one reference-data entity', () => {
		expect(Object.keys(NextDNSSchema.entities)).toEqual(['profiles']);
	});
});

/**
 * Field list captured live 2026-08-17 against a real account's
 * `GET /profiles` response.
 */
const LIVE_PROFILE_KEYS = ['id', 'fingerprint', 'role', 'name'] as const;

describe('profile entity schema', () => {
	it('declares every observed field', () => {
		const declared = NextDNSProfileEntity.shape;
		for (const key of LIVE_PROFILE_KEYS) {
			expect(declared).toHaveProperty(key);
		}
	});

	it('parses a record carrying only its required fields', () => {
		const result = NextDNSProfileEntity.safeParse({
			id: 'abc123',
			name: 'Example',
		});
		expect(result.success).toBe(true);
	});

	it('preserves a field the provider adds later rather than dropping it', () => {
		const parsed = NextDNSProfileEntity.parse({
			id: 'abc123',
			name: 'Example',
			some_future_field: 'kept',
		});
		expect(parsed).toHaveProperty('some_future_field', 'kept');
	});

	it('rejects a profile with no id', () => {
		expect(NextDNSProfileEntity.safeParse({ name: 'Nameless' }).success).toBe(
			false,
		);
	});

	it('rejects a profile with no name', () => {
		expect(NextDNSProfileEntity.safeParse({ id: 'abc123' }).success).toBe(
			false,
		);
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
