import { z } from 'zod';

/**
 * Field names match official JSON keys.
 * https://apidoc.habitica.com/
 * GET /api/v3/models/:model/paths
 */

const S = z.string().nullable().optional();
const N = z.number().nullable().optional();
const B = z.boolean().nullable().optional();
const Id = z.string();

export const HabiticaChecklistItem = z
	.object({
		id: S,
		text: S,
		completed: B,
		linkId: S,
	})
	.loose();
export type HabiticaChecklistItem = z.infer<typeof HabiticaChecklistItem>;

export const HabiticaReminder = z
	.object({
		id: S,
		startDate: S,
		time: S,
	})
	.loose();
export type HabiticaReminder = z.infer<typeof HabiticaReminder>;

export const HabiticaTaskHistoryEntry = z
	.object({
		date: N,
		value: N,
		scoredUp: N,
		scoredDown: N,
		isDue: B,
		completed: B,
	})
	.loose();
export type HabiticaTaskHistoryEntry = z.infer<typeof HabiticaTaskHistoryEntry>;

export const HabiticaTaskChallenge = z
	.object({
		shortName: S,
		id: S,
		taskId: S,
		broken: S,
		winner: S,
	})
	.loose();
export type HabiticaTaskChallenge = z.infer<typeof HabiticaTaskChallenge>;

export const HabiticaTaskGroup = z
	.object({
		id: S,
		assignedDate: S,
		assigningUsername: S,
		assignedUsers: z.array(z.string()).nullable().optional(),
		assignedUsersDetail: z
			.record(z.string(), z.unknown())
			.nullable()
			.optional(),
		taskId: S,
		managerNotes: S,
		completedBy: z
			.object({
				userId: S,
				date: S,
			})
			.loose()
			.nullable()
			.optional(),
		approval: z
			.object({
				required: B,
				approved: B,
				requested: B,
			})
			.loose()
			.nullable()
			.optional(),
	})
	.loose();
export type HabiticaTaskGroup = z.infer<typeof HabiticaTaskGroup>;

export const HabiticaDailyRepeat = z
	.object({
		m: B,
		t: B,
		w: B,
		th: B,
		f: B,
		s: B,
		su: B,
	})
	.loose();
export type HabiticaDailyRepeat = z.infer<typeof HabiticaDailyRepeat>;

export const HabiticaTaskEntity = z
	.object({
		id: Id,
		_id: S,
		type: S,
		text: S,
		notes: S,
		alias: S,
		tags: z.array(z.string()).nullable().optional(),
		value: N,
		priority: N,
		attribute: S,
		userId: S,
		challenge: HabiticaTaskChallenge.nullable().optional(),
		group: HabiticaTaskGroup.nullable().optional(),
		reminders: z.array(HabiticaReminder).nullable().optional(),
		byHabitica: B,
		createdAt: S,
		updatedAt: S,
		up: B,
		down: B,
		counterUp: N,
		counterDown: N,
		frequency: S,
		history: z.array(HabiticaTaskHistoryEntry).nullable().optional(),
		checklist: z.array(HabiticaChecklistItem).nullable().optional(),
		collapseChecklist: B,
		completed: B,
		streak: N,
		repeat: HabiticaDailyRepeat.nullable().optional(),
		everyX: N,
		startDate: S,
		daysOfMonth: z.array(z.number()).nullable().optional(),
		weeksOfMonth: z.array(z.number()).nullable().optional(),
		isDue: B,
		nextDue: z.array(z.string()).nullable().optional(),
		yesterDaily: B,
		date: S,
		dateCompleted: S,
	})
	.loose();
export type HabiticaTaskEntity = z.infer<typeof HabiticaTaskEntity>;

export const HabiticaTagEntity = z
	.object({
		id: Id,
		name: S,
		challenge: B,
		group: S,
	})
	.loose();
export type HabiticaTagEntity = z.infer<typeof HabiticaTagEntity>;

export const HabiticaChallengeGroupRef = z
	.object({
		id: S,
		_id: S,
		name: S,
		type: S,
		privacy: S,
		summary: S,
		leader: S,
		categories: z
			.array(z.record(z.string(), z.unknown()))
			.nullable()
			.optional(),
	})
	.loose();
export type HabiticaChallengeGroupRef = z.infer<
	typeof HabiticaChallengeGroupRef
>;

export const HabiticaChallengeLeaderRef = z
	.object({
		id: S,
		_id: S,
	})
	.loose();
export type HabiticaChallengeLeaderRef = z.infer<
	typeof HabiticaChallengeLeaderRef
>;

export const HabiticaTasksOrder = z
	.object({
		habits: z.array(z.string()).nullable().optional(),
		dailys: z.array(z.string()).nullable().optional(),
		todos: z.array(z.string()).nullable().optional(),
		rewards: z.array(z.string()).nullable().optional(),
	})
	.loose();
export type HabiticaTasksOrder = z.infer<typeof HabiticaTasksOrder>;

export const HabiticaChallengeEntity = z
	.object({
		id: Id,
		_id: S,
		name: S,
		shortName: S,
		summary: S,
		description: S,
		official: B,
		prize: N,
		memberCount: N,
		leader: HabiticaChallengeLeaderRef.nullable().optional(),
		group: HabiticaChallengeGroupRef.nullable().optional(),
		tasksOrder: HabiticaTasksOrder.nullable().optional(),
		categories: z
			.array(z.record(z.string(), z.unknown()))
			.nullable()
			.optional(),
		flags: z.record(z.string(), z.unknown()).nullable().optional(),
		flagCount: N,
		createdAt: S,
		updatedAt: S,
	})
	.loose();
export type HabiticaChallengeEntity = z.infer<typeof HabiticaChallengeEntity>;

export const HabiticaGroupLeaderOnly = z
	.object({
		challenges: B,
		getGems: B,
	})
	.loose();
export type HabiticaGroupLeaderOnly = z.infer<typeof HabiticaGroupLeaderOnly>;

export const HabiticaGroupQuest = z
	.object({
		key: S,
		active: B,
		leader: S,
		progress: z
			.object({
				hp: N,
				collect: z.record(z.string(), z.unknown()).nullable().optional(),
				rage: N,
			})
			.loose()
			.nullable()
			.optional(),
		members: z.record(z.string(), z.unknown()).nullable().optional(),
		extra: z.record(z.string(), z.unknown()).nullable().optional(),
	})
	.loose();
export type HabiticaGroupQuest = z.infer<typeof HabiticaGroupQuest>;

export const HabiticaGroupEntity = z
	.object({
		id: Id,
		_id: S,
		name: S,
		type: S,
		privacy: S,
		summary: S,
		description: S,
		leader: z
			.union([z.string(), z.record(z.string(), z.unknown())])
			.nullable()
			.optional(),
		memberCount: N,
		challengeCount: N,
		balance: N,
		managers: z.record(z.string(), z.unknown()).nullable().optional(),
		categories: z
			.array(z.record(z.string(), z.unknown()))
			.nullable()
			.optional(),
		quest: HabiticaGroupQuest.nullable().optional(),
		leaderOnly: HabiticaGroupLeaderOnly.nullable().optional(),
		tasksOrder: HabiticaTasksOrder.nullable().optional(),
		purchased: z.record(z.string(), z.unknown()).nullable().optional(),
		cron: z.object({ lastProcessed: S }).loose().nullable().optional(),
		bannedWordsAllowed: B,
		chatLimitCount: N,
		logo: S,
		leaderMessage: S,
		chat: z.array(z.unknown()).nullable().optional(),
		archive: z
			.union([z.string(), z.record(z.string(), z.unknown())])
			.nullable()
			.optional(),
	})
	.loose();
export type HabiticaGroupEntity = z.infer<typeof HabiticaGroupEntity>;

export const HabiticaWebhookOptions = z
	.object({
		created: B,
		updated: B,
		deleted: B,
		scored: B,
		checklistScored: B,
		groupId: S,
		petHatched: B,
		mountRaised: B,
		leveledUp: B,
		questStarted: B,
		questFinished: B,
		questInvited: B,
	})
	.loose();
export type HabiticaWebhookOptions = z.infer<typeof HabiticaWebhookOptions>;

export const HabiticaWebhookEntity = z
	.object({
		id: Id,
		type: S,
		label: S,
		url: S,
		enabled: B,
		failures: N,
		lastFailureAt: S,
		options: HabiticaWebhookOptions.nullable().optional(),
		createdAt: S,
		updatedAt: S,
	})
	.loose();
export type HabiticaWebhookEntity = z.infer<typeof HabiticaWebhookEntity>;
