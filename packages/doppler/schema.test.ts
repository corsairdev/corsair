/**
 * Asserts every official and live-captured key is declared in `schema/database.ts`.
 *
 * Every entity is `.loose()`, so a response with an undeclared key parses
 * cleanly - `safeParse` alone would never notice a field the schema forgot.
 * The key sets below are compared by name, captured live on 2026-08-16 from
 * a real account. No values from that account appear here - every fixture in
 * this package is fictional.
 */

import { DopplerSchema } from './schema';
import {
	DopplerConfigEntity,
	DopplerEnvironmentEntity,
	DopplerProjectEntity,
	DopplerWebhookEntity,
	DopplerWorkplaceEntity,
} from './schema/database';

const PROJECT_KEYS = ['id', 'slug', 'name', 'description', 'created_at'];
const ENVIRONMENT_KEYS = [
	'id',
	'slug',
	'name',
	'project',
	'initial_fetch_at',
	'created_at',
	'personal_configs',
];
const CONFIG_KEYS = [
	'name',
	'slug',
	'project',
	'environment',
	'root',
	'inheritable',
	'inheriting',
	'inherits',
	'inheritedBy',
	'locked',
	'initial_fetch_at',
	'last_fetch_at',
	'created_at',
];
/** All camelCase, confirmed live - unlike almost every other entity in this API. */
const WEBHOOK_KEYS = [
	'id',
	'name',
	'url',
	'enabled',
	'hasSecret',
	'authentication',
	'enabledConfigs',
	'canManage',
];
const WORKPLACE_KEYS = ['id', 'name', 'billing_email', 'security_email'];

describe('Doppler schema', () => {
	it('declares a semver version', () => {
		expect(DopplerSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('mirrors exactly the entities this plugin persists', () => {
		expect(Object.keys(DopplerSchema.entities).sort()).toEqual(
			['projects', 'environments', 'configs', 'webhooks', 'workplace'].sort(),
		);
	});

	describe('every official/live key is declared', () => {
		const cases: [string, { shape: Record<string, unknown> }, string[]][] = [
			['project', DopplerProjectEntity, PROJECT_KEYS],
			['environment', DopplerEnvironmentEntity, ENVIRONMENT_KEYS],
			['config', DopplerConfigEntity, CONFIG_KEYS],
			['webhook', DopplerWebhookEntity, WEBHOOK_KEYS],
			['workplace', DopplerWorkplaceEntity, WORKPLACE_KEYS],
		];

		for (const [label, entity, capturedKeys] of cases) {
			it(`declares every ${label} key`, () => {
				const declared = Object.keys(entity.shape);
				const undeclared = capturedKeys.filter((k) => !declared.includes(k));
				expect(undeclared).toEqual([]);
			});
		}
	});

	it('the every-key-declared filter itself would catch a missing declaration - proven by planting one', () => {
		// The exact comparison the "every live-captured key is declared" block
		// above runs, applied to a deliberately fabricated "captured" key that
		// was never added to the entity. If this assertion ever passed with an
		// empty array, the comparison logic itself would be broken and the
		// suite above would be silently vacuous.
		const declared = Object.keys(DopplerProjectEntity.shape);
		const fabricatedCapturedKeys = [...PROJECT_KEYS, 'aKeyNobodyDeclared'];
		const undeclared = fabricatedCapturedKeys.filter(
			(k) => !declared.includes(k),
		);
		expect(undeclared).toEqual(['aKeyNobodyDeclared']);
	});

	it('an undeclared key does not fail schema parsing either, since every entity is .loose()', () => {
		expect(
			DopplerProjectEntity.safeParse({ id: 'project-1', aKeyNobodyDeclared: 1 })
				.success,
		).toBe(true);
	});

	it('requires only the primary key', () => {
		expect(DopplerProjectEntity.safeParse({ id: 'project-1' }).success).toBe(
			true,
		);
		expect(DopplerEnvironmentEntity.safeParse({ id: 'dev' }).success).toBe(
			true,
		);
		expect(DopplerConfigEntity.safeParse({ name: 'dev' }).success).toBe(true);
		expect(DopplerWebhookEntity.safeParse({ id: 'webhook-1' }).success).toBe(
			true,
		);
		expect(
			DopplerWorkplaceEntity.safeParse({ id: 'workplace-1' }).success,
		).toBe(true);
	});

	it('rejects a record with no primary key at all', () => {
		expect(DopplerProjectEntity.safeParse({ name: 'no id here' }).success).toBe(
			false,
		);
		expect(DopplerConfigEntity.safeParse({ project: 'demo' }).success).toBe(
			false,
		);
	});

	it('accepts null for fields Doppler omits rather than always populates', () => {
		const parsed = DopplerEnvironmentEntity.safeParse({
			id: 'dev',
			initial_fetch_at: null,
			personal_configs: null,
		});
		expect(parsed.success).toBe(true);
	});

	/**
	 * `secrets` and `serviceTokens` are deliberately absent - see
	 * `schema/database.ts`'s header comment. Pinned here so a future edit
	 * cannot silently add either without touching this test.
	 */
	it('never declares a secrets or serviceTokens entity', () => {
		expect(Object.keys(DopplerSchema.entities)).not.toContain('secrets');
		expect(Object.keys(DopplerSchema.entities)).not.toContain('serviceTokens');
	});
});
