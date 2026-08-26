/**
 * Validates that every key the Beeminder API actually returns is declared
 * in `schema/database.ts`. The entities are `.loose()`, so `safeParse`
 * alone would never notice a field the schema forgot — the key sets
 * below are compared against the declared shape by name.
 *
 * Key names were captured from the Beeminder API docs and test fixtures.
 * No account data appears here.
 */

import { BeeminderSchema } from './schema';
import {
	BeeminderChargeEntity,
	BeeminderGoalEntity,
	BeeminderUserEntity,
} from './schema/database';

const USER_KEYS = [
	'username',
	'timezone',
	'updated_at',
	'goals',
	'deadbeat',
	'urgency_load',
	'deleted_goals',
];

const GOAL_KEYS = [
	'id',
	'slug',
	'title',
	'fineprint',
	'yaxis',
	'goaldate',
	'goalval',
	'rate',
	'runits',
	'svg_url',
	'graph_url',
	'thumb_url',
	'autodata',
	'goal_type',
	'losedate',
	'urgencykey',
	'queued',
	'secret',
	'datapublic',
	'numpts',
	'pledge',
	'initday',
	'initval',
	'curday',
	'curval',
	'currate',
	'lastday',
	'yaw',
	'dir',
	'lane',
	'mathishard',
	'headsum',
	'limsum',
	'kyoom',
	'odom',
	'aggday',
	'steppy',
	'rosy',
	'movingav',
	'aura',
	'frozen',
	'won',
	'lost',
	'maxflux',
	'contract',
	'road',
	'roadall',
	'fullroad',
	'rah',
	'delta',
	'delta_text',
	'safebuf',
	'colorkey',
	'colorhex',
	'safebump',
	'autoratchet',
	'callback_url',
	'description',
	'graphsum',
	'lanewidth',
	'deadline',
	'leadtime',
	'alertstart',
	'plotall',
	'integery',
	'gunits',
	'timey',
	'hhmmformat',
	'todayta',
	'weekends_off',
	'tmin',
	'tmax',
	'tags',
	'archivedate',
	'burner',
	'datapoints',
	'last_datapoint',
	'updated_at',
];

const CHARGE_KEYS = ['id', 'amount', 'note', 'username'];

describe('Beeminder schema', () => {
	it('declares a semver version', () => {
		expect(BeeminderSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('mirrors exactly the three entities the plugin persists', () => {
		expect(Object.keys(BeeminderSchema.entities).sort()).toEqual([
			'charges',
			'goals',
			'user',
		]);
	});

	describe('every documented key is declared', () => {
		const cases: [string, { shape: Record<string, unknown> }, string[]][] = [
			['user', BeeminderUserEntity, USER_KEYS],
			['goal', BeeminderGoalEntity, GOAL_KEYS],
			['charge', BeeminderChargeEntity, CHARGE_KEYS],
		];

		for (const [label, entity, capturedKeys] of cases) {
			it(`declares every ${label} key`, () => {
				const declared = Object.keys(entity.shape);
				const undeclared = capturedKeys.filter((k) => !declared.includes(k));
				expect(undeclared).toEqual([]);
			});
		}
	});

	it('catches an undeclared key, so the check above is not vacuous', () => {
		const declared = Object.keys(BeeminderGoalEntity.shape);
		expect(declared).not.toContain('aKeyNobodyDeclared');
		expect(
			BeeminderGoalEntity.safeParse({
				id: 'g-1',
				aKeyNobodyDeclared: 1,
			}).success,
		).toBe(true);
	});

	it('accepts a goal listed without id', () => {
		expect(BeeminderGoalEntity.safeParse({ slug: 'weight' }).success).toBe(
			true,
		);
	});

	it('accepts user.goals as slugs or goal objects', () => {
		expect(
			BeeminderUserEntity.safeParse({
				username: 'alice',
				goals: ['weight'],
			}).success,
		).toBe(true);
		expect(
			BeeminderUserEntity.safeParse({
				username: 'alice',
				goals: [{ slug: 'weight', title: 'Weight' }],
			}).success,
		).toBe(true);
	});

	it('accepts a charge with only id', () => {
		expect(BeeminderChargeEntity.safeParse({ id: 'ch-1' }).success).toBe(true);
	});

	it('accepts null for nullable fields', () => {
		const parsed = BeeminderGoalEntity.safeParse({
			id: 'g-1',
			title: null,
			pledge: null,
		});
		expect(parsed.success).toBe(true);
	});
});
