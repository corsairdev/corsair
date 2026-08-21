/**
 * Asserts that every key Habitica actually returned is declared in
 * `schema/database.ts`.
 *
 * This matters more here than it looks, because every entity is `.loose()`: a
 * response with an undeclared key parses cleanly, so `safeParse` alone would
 * never notice a field the schema forgot. The key sets below are therefore
 * compared against the declared shape by name.
 *
 * The key **names** were captured live on 2026-08-15. No values from that
 * account appear here - every fixture in this package is fictional, and the
 * account used for development holds the operator's real email address.
 */

import { HabiticaSchema } from './schema';
import {
	HabiticaChallengeEntity,
	HabiticaChecklistItem,
	HabiticaGroupEntity,
	HabiticaTagEntity,
	HabiticaTaskEntity,
	HabiticaWebhookEntity,
} from './schema/database';

/**
 * The union of keys across all four task types.
 *
 * A single task never carries all of these: a habit has `up`/`down`/`history`,
 * a daily has `repeat`/`streak`/`isDue`, a todo has `checklist`/`completed`,
 * and a reward has none of them. The union is what the schema has to cover.
 */
const TASK_KEYS = [
	'_id',
	'attribute',
	'byHabitica',
	'challenge',
	'checklist',
	'collapseChecklist',
	'completed',
	'counterDown',
	'counterUp',
	'createdAt',
	'daysOfMonth',
	'down',
	'everyX',
	'frequency',
	'group',
	'history',
	'id',
	'isDue',
	'nextDue',
	'notes',
	'priority',
	'reminders',
	'repeat',
	'startDate',
	'streak',
	'tags',
	'text',
	'type',
	'up',
	'updatedAt',
	'userId',
	'value',
	'weeksOfMonth',
	'yesterDaily',
];

const TAG_KEYS = ['id', 'name'];

const CHALLENGE_KEYS = [
	'_id',
	'categories',
	'createdAt',
	'description',
	'flagCount',
	'flags',
	'group',
	'id',
	'leader',
	'memberCount',
	'name',
	'official',
	'prize',
	'shortName',
	'summary',
	'tasksOrder',
	'updatedAt',
];

/** Captured from the Tavern, the one group the test account belonged to. */
const GROUP_KEYS = [
	'_id',
	'archive',
	'balance',
	'categories',
	'challengeCount',
	'chat',
	'cron',
	'id',
	'leader',
	'leaderOnly',
	'managers',
	'memberCount',
	'name',
	'privacy',
	'purchased',
	'quest',
	'summary',
	'tasksOrder',
	'type',
];

const WEBHOOK_KEYS = [
	'createdAt',
	'enabled',
	'failures',
	'id',
	'label',
	'options',
	'type',
	'updatedAt',
	'url',
];

const CHECKLIST_ITEM_KEYS = ['completed', 'id', 'text'];

describe('Habitica schema', () => {
	it('declares a semver version', () => {
		expect(HabiticaSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('mirrors exactly the five entities the plugin persists', () => {
		expect(Object.keys(HabiticaSchema.entities).sort()).toEqual([
			'challenges',
			'groups',
			'tags',
			'tasks',
			'webhooks',
		]);
	});

	describe('every live-captured key is declared', () => {
		const cases: [string, { shape: Record<string, unknown> }, string[]][] = [
			['task', HabiticaTaskEntity, TASK_KEYS],
			['tag', HabiticaTagEntity, TAG_KEYS],
			['challenge', HabiticaChallengeEntity, CHALLENGE_KEYS],
			['group', HabiticaGroupEntity, GROUP_KEYS],
			['webhook', HabiticaWebhookEntity, WEBHOOK_KEYS],
			['checklist item', HabiticaChecklistItem, CHECKLIST_ITEM_KEYS],
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
		// The entities are loose, so this is what a missing declaration looks
		// like: parsing succeeds while the key is absent from the shape.
		const declared = Object.keys(HabiticaTagEntity.shape);
		expect(declared).not.toContain('aKeyNobodyDeclared');
		expect(
			HabiticaTagEntity.safeParse({ id: 'tag-1', aKeyNobodyDeclared: 1 })
				.success,
		).toBe(true);
	});

	it('requires only the primary key', () => {
		// Habitica omits fields an account has never used, so anything beyond the
		// id has to be optional or ordinary reads would fail to parse.
		expect(HabiticaTaskEntity.safeParse({ id: 'task-1' }).success).toBe(true);
		expect(HabiticaTagEntity.safeParse({ id: 'tag-1' }).success).toBe(true);
		expect(
			HabiticaChallengeEntity.safeParse({ id: 'challenge-1' }).success,
		).toBe(true);
		expect(HabiticaGroupEntity.safeParse({ id: 'group-1' }).success).toBe(true);
		expect(HabiticaWebhookEntity.safeParse({ id: 'webhook-1' }).success).toBe(
			true,
		);
	});

	it('rejects a record with no id at all', () => {
		expect(HabiticaTaskEntity.safeParse({ text: 'no id here' }).success).toBe(
			false,
		);
	});

	it('accepts null for fields Habitica nulls rather than omits', () => {
		const parsed = HabiticaTaskEntity.safeParse({
			id: 'task-1',
			notes: null,
			value: null,
			checklist: null,
			completed: null,
		});
		expect(parsed.success).toBe(true);
	});

	it('keeps a task history entry date as a number, not a coerced date', () => {
		// `history[].date` is a millisecond epoch number while `createdAt` on the
		// same object is an ISO string. Coercing one and not the other is the
		// kind of thing that silently produces Invalid Date.
		const parsed = HabiticaTaskEntity.parse({
			id: 'task-1',
			history: [{ date: 1_755_000_000_000, value: 1.5 }],
		});
		expect(typeof parsed.history?.[0]?.date).toBe('number');
	});
});
