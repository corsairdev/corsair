/**
 * Guards the persisted entity schemas against the two ways they go wrong:
 * dropping a field Botpress actually returns, and requiring a field Botpress
 * sometimes omits.
 *
 * `workspace` and `bot` key lists were captured from live responses
 * (2026-08-16: `GET /v1/admin/workspaces`, `POST /v1/admin/bots`).
 * `integration` was not created live in this pass — its list comes from
 * `CreateIntegrationResponse` in `@botpress/client` v2.2.0's bundled type
 * declarations instead, noted explicitly because it carries less confidence
 * than a live capture.
 */

import { BotpressSchema } from './schema';
import {
	BotpressBotEntity,
	BotpressIntegrationEntity,
	BotpressWorkspaceEntity,
} from './schema/database';

describe('Botpress schema', () => {
	it('declares a semver version', () => {
		expect(BotpressSchema.version).toBeDefined();
		expect(BotpressSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof BotpressSchema.entities).toBe('object');
		expect(BotpressSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(BotpressSchema.entities))).toBe(true);
		for (const entity of Object.values(BotpressSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});

	it('registers exactly the workspace, bot and integration entities', () => {
		expect(Object.keys(BotpressSchema.entities).sort()).toEqual([
			'bots',
			'integrations',
			'workspaces',
		]);
	});
});

const LIVE_KEYS = {
	workspaces: [
		'id',
		'name',
		'ownerId',
		'createdAt',
		'updatedAt',
		'blocked',
		'plan',
		'billingVersion',
		'spendingLimit',
		'botCount',
		'about',
		'profilePicture',
		'contactEmail',
		'website',
		'isPublic',
		'activeTrialId',
	],
	bots: [
		'id',
		'name',
		'createdAt',
		'updatedAt',
		'createdBy',
		'dev',
		'alwaysAlive',
		'status',
		'type',
		'tags',
	],
	integrations: [
		'id',
		'name',
		'version',
		'title',
		'description',
		'createdAt',
		'updatedAt',
		'visibility',
		'url',
		'iconUrl',
		'readmeUrl',
	],
} as const;

const ENTITIES = {
	workspaces: BotpressWorkspaceEntity,
	bots: BotpressBotEntity,
	integrations: BotpressIntegrationEntity,
} as const;

describe('entity schemas declare every observed field', () => {
	for (const [name, schema] of Object.entries(ENTITIES)) {
		it(`${name} declares all ${LIVE_KEYS[name as keyof typeof LIVE_KEYS].length} keys`, () => {
			const declared = schema.shape;
			for (const key of LIVE_KEYS[name as keyof typeof LIVE_KEYS]) {
				expect(declared).toHaveProperty(key);
			}
		});
	}
});

describe('entity schemas require only what the live API always sends', () => {
	/**
	 * Every field beyond the ones below is optional: Botpress omits or
	 * defaults fields depending on plan and lifecycle state — a
	 * community-plan workspace has no `activeTrialId`, a bot mid-creation has
	 * an empty `signingSecret`. A schema that required more than these would
	 * reject those valid rows outright, which is the failure mode that
	 * matters: a rejected row is a lost row.
	 *
	 * `workspaces` and `integrations` require more than just their primary
	 * key (`name`, and `name`+`version`) because the live API guarantees
	 * those fields are always present, not because this schema chose to
	 * require them beyond what is observed. `bots` requires only `id`.
	 */
	const minimal = {
		workspaces: { id: 'wkspace_1', name: 'W' },
		bots: { id: 'bot_1' },
		integrations: { id: 'int_1', name: 'n', version: '1.0.0' },
	} as const;

	for (const [name, schema] of Object.entries(ENTITIES)) {
		it(`${name} parses a record carrying only its required fields`, () => {
			const result = schema.safeParse(minimal[name as keyof typeof minimal]);
			expect(result.success).toBe(true);
		});
	}
});

describe('entity schemas keep unknown fields', () => {
	it('preserves a field Botpress adds later rather than dropping it', () => {
		const parsed = BotpressWorkspaceEntity.parse({
			id: 'wkspace_1',
			name: 'Example',
			some_future_field: 'kept',
		});

		expect(parsed).toHaveProperty('some_future_field', 'kept');
	});
});

describe('entity schemas reject a record with no key', () => {
	it('rejects a workspace with no id', () => {
		expect(
			BotpressWorkspaceEntity.safeParse({ name: 'Nameless' }).success,
		).toBe(false);
	});

	it('rejects a bot with no id', () => {
		expect(BotpressBotEntity.safeParse({ name: 'Nameless' }).success).toBe(
			false,
		);
	});

	it('rejects an integration with no id', () => {
		expect(
			BotpressIntegrationEntity.safeParse({ name: 'n', version: '1.0.0' })
				.success,
		).toBe(false);
	});
});
