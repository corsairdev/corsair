import { z } from 'zod';

/**
 * Locally persisted Habitica entities.
 *
 * Habitica's surface splits into three kinds of data, and only the first is
 * worth mirroring.
 *
 * **Mirrored.** Tags, tasks, challenges, groups and webhooks are addressable by
 * a stable id and are the lookup nearly every other operation needs - scoring a
 * task, tagging one, adding one to a challenge and inviting to a group all
 * start from an id that has to come from somewhere. Mirroring matters more here
 * than on most integrations because Habitica allows only **30 requests per
 * minute per user**, so a lookup served locally is a request that does not have
 * to be spent.
 *
 * **Not mirrored - it is the account holder's personal data.** The user
 * document, the inbox and group chat carry profile text, private messages and,
 * in `auth.local.email`, the account holder's email address. None of it is
 * copied into local storage, and none of it is written to an audit payload.
 *
 * **Not mirrored - it is not row-shaped.** The content catalogue is a single
 * 2.65 MB document of static game definitions rather than a collection of
 * records. It is a strong caching candidate and a poor entity: there is no id
 * to key rows by, and storing it would mean one row that is really a file.
 *
 * A caveat that applies to tasks specifically, stated because a mirror that
 * quietly lies is worse than no mirror: `value`, `history`, `counterUp`,
 * `counterDown`, `streak` and `completed` change every time a task is scored.
 * The mirrored copy is a snapshot of those fields at fetch time, not a live
 * figure. The stable parts - id, type, text, notes, tags, priority - are what
 * the mirror is for.
 *
 * Field names match the API's own JSON keys. Every field except the primary key
 * is nullable and optional, and every object is `.loose()`: Habitica returns a
 * different key set per task type, omits fields an account has never used, and
 * adds fields as the game gains features.
 *
 * Shapes captured live on 2026-08-15 from a real account; `schema.test.ts`
 * asserts every captured key is declared here.
 * Official: https://habitica.com/apidoc/
 */

/** Habitica omits unset fields more often than it nulls them; allow both. */
const S = z.string().nullable().optional();
const N = z.number().nullable().optional();
const B = z.boolean().nullable().optional();

/**
 * Ids are UUID strings.
 *
 * Every entity carries the same id under two keys: Mongo's `_id` and a mirrored
 * `id`. They held identical values on every object observed. `id` is the
 * primary key here because it is the one the API's own path parameters are
 * named after, and `_id` is kept so a caller comparing against a raw response
 * is not surprised by its absence.
 */
const Id = z.string();

/**
 * One entry of a task's checklist.
 * Captured from `POST /tasks/:taskId/checklist`.
 */
export const HabiticaChecklistItem = z
	.object({
		id: S,
		text: S,
		completed: B,
	})
	.loose();
export type HabiticaChecklistItem = z.infer<typeof HabiticaChecklistItem>;

/**
 * A scheduled reminder attached to a task.
 *
 * Declared structurally rather than as `unknown` because the key set is stable,
 * but left loose: reminders gained fields when Habitica added time-zone
 * handling, and will again.
 */
export const HabiticaReminder = z
	.object({
		id: S,
		startDate: S,
		time: S,
	})
	.loose();
export type HabiticaReminder = z.infer<typeof HabiticaReminder>;

/**
 * One dated point in a task's value history.
 *
 * Habits and dailies accumulate these on every score. `date` is a millisecond
 * epoch number, not an ISO string - unlike `createdAt` and `updatedAt` on the
 * same object, which are ISO strings. That inconsistency is the API's, and it
 * is the reason this field is typed as a number rather than coerced to a date.
 */
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

/**
 * A task: habit, daily, todo or reward.
 *
 * One entity covers all four types because the API returns them from one
 * collection, `GET /tasks/user`, discriminated by `type`. The key sets differ
 * substantially - captured live, a habit carries `up`/`down`/`counterUp`/
 * `counterDown`/`frequency`/`history`, a daily adds `repeat`/`everyX`/`streak`/
 * `isDue`/`nextDue`/`startDate`/`daysOfMonth`/`weeksOfMonth`/`yesterDaily`, a
 * todo adds `checklist`/`completed`, and a reward carries none of them. Every
 * type-specific field is therefore optional here, and a field being absent is
 * information about the task's type rather than a gap in the data.
 *
 * `date` and `dateCompleted` are declared but were not observed live: the
 * account held no todo with a due date. They are documented by Habitica and the
 * schema is loose, so their absence from the capture is not evidence against
 * them.
 */
export const HabiticaTaskEntity = z
	.object({
		/** Primary key. Same value as `_id`. */
		id: Id,
		/** Mongo's id for the same record. */
		_id: S,
		/** One of `habit`, `daily`, `todo`, `reward`. */
		type: S,
		/** The task title. */
		text: S,
		notes: S,
		/** Tag ids applied to this task, not tag objects. */
		tags: z.array(z.string()).nullable().optional(),
		/**
		 * The task's accumulated worth, which drives its colour in the UI.
		 * Changes on every score - see the caveat at the top of this file.
		 */
		value: N,
		/** 0.1 trivial, 1 easy, 1.5 medium, 2 hard. */
		priority: N,
		/** `str`, `int`, `con` or `per`. */
		attribute: S,
		/** Set when the task belongs to a challenge. */
		challenge: z.record(z.string(), z.unknown()).nullable().optional(),
		/** Set when the task belongs to a group. */
		group: z.record(z.string(), z.unknown()).nullable().optional(),
		byHabitica: B,
		userId: S,
		createdAt: S,
		updatedAt: S,

		/** Habits only. */
		up: B,
		down: B,
		counterUp: N,
		counterDown: N,
		/** Habits and dailies: `daily`, `weekly`, `monthly`, `yearly`. */
		frequency: S,
		history: z.array(HabiticaTaskHistoryEntry).nullable().optional(),

		/** Dailies and todos. */
		checklist: z.array(HabiticaChecklistItem).nullable().optional(),
		collapseChecklist: B,
		completed: B,
		reminders: z.array(HabiticaReminder).nullable().optional(),

		/** Dailies only. */
		streak: N,
		repeat: z.record(z.string(), z.unknown()).nullable().optional(),
		everyX: N,
		startDate: S,
		daysOfMonth: z.array(z.number()).nullable().optional(),
		weeksOfMonth: z.array(z.number()).nullable().optional(),
		isDue: B,
		nextDue: z.array(z.string()).nullable().optional(),
		yesterDaily: B,

		/** Todos only. Documented; not present in the live capture. */
		date: S,
		dateCompleted: S,

		/**
		 * A user-chosen short name usable in place of the id on task routes.
		 *
		 * Declared from the model definition (`GET /models/todo/paths` reports
		 * `alias: String`) rather than from a capture - no task on the
		 * development account had one set.
		 */
		alias: S,
	})
	.loose();
export type HabiticaTaskEntity = z.infer<typeof HabiticaTaskEntity>;

/**
 * A tag.
 *
 * The narrowest entity in the API: `GET /tags` returned objects with exactly
 * `id` and `name` on the account used for development, which has no
 * challenge-owned tags.
 *
 * `challenge` and `group` are declared from the model definition rather than
 * from a capture - `GET /models/tag/paths` reports the full set as
 * `{id: String, name: String, challenge: Boolean, group: String}`. A tag
 * created by joining a challenge carries them.
 */
export const HabiticaTagEntity = z
	.object({
		id: Id,
		name: S,
		/** True when the tag was created by joining a challenge. */
		challenge: B,
		/** The group id, for a tag that belongs to one. */
		group: S,
	})
	.loose();
export type HabiticaTagEntity = z.infer<typeof HabiticaTagEntity>;

/**
 * The group a challenge belongs to, as embedded in a challenge.
 *
 * A reduced projection of a group - not the full entity - so it is declared
 * separately rather than reusing {@link HabiticaGroupEntity}, which would imply
 * fields the embedded copy does not carry.
 */
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

/**
 * A challenge's leader, as embedded in a challenge.
 *
 * Deliberately **not** modelled field by field. The embedded object carries
 * `auth` and `profile` sub-objects belonging to another user, and enumerating
 * them here would invite copying someone else's account details into local
 * storage. The id is what the operations need; the rest is admitted by the
 * loose record but never named or relied upon.
 */
export const HabiticaChallengeLeaderRef = z
	.object({
		id: S,
		_id: S,
	})
	.loose();
export type HabiticaChallengeLeaderRef = z.infer<
	typeof HabiticaChallengeLeaderRef
>;

/**
 * A challenge.
 * Captured from `GET /challenges/user?page=0`.
 */
export const HabiticaChallengeEntity = z
	.object({
		id: Id,
		_id: S,
		name: S,
		/** The short tag-like name challenge tasks are labelled with. */
		shortName: S,
		summary: S,
		description: S,
		/** True for challenges run by Habitica itself. */
		official: B,
		/** Gems awarded to the winner. */
		prize: N,
		memberCount: N,
		leader: HabiticaChallengeLeaderRef.nullable().optional(),
		group: HabiticaChallengeGroupRef.nullable().optional(),
		tasksOrder: z.record(z.string(), z.unknown()).nullable().optional(),
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

/**
 * A group: a party, a guild, or the Tavern.
 *
 * `chat` is declared but deliberately typed as an opaque array rather than
 * modelled. Chat messages are other people's words attached to their user ids;
 * they are not something this plugin should encourage copying into local
 * storage, and no operation in the catalog needs their internal structure.
 *
 * Captured from `GET /groups/habitrpg` - the Tavern - because the account under
 * test belonged to no party or guild. The Tavern is a real group and returns
 * the full entity shape.
 */
export const HabiticaGroupEntity = z
	.object({
		id: Id,
		_id: S,
		name: S,
		/** `party`, `guild` or `habitrpg` for the Tavern. */
		type: S,
		/** `private` or `public`. */
		privacy: S,
		summary: S,
		description: S,
		/** The leader's user id. */
		leader: z
			.union([z.string(), z.record(z.string(), z.unknown())])
			.nullable()
			.optional(),
		memberCount: N,
		challengeCount: N,
		/** Gems held by the group. */
		balance: N,
		managers: z.record(z.string(), z.unknown()).nullable().optional(),
		categories: z
			.array(z.record(z.string(), z.unknown()))
			.nullable()
			.optional(),
		quest: z.record(z.string(), z.unknown()).nullable().optional(),
		leaderOnly: z.record(z.string(), z.unknown()).nullable().optional(),
		tasksOrder: z.record(z.string(), z.unknown()).nullable().optional(),
		purchased: z.record(z.string(), z.unknown()).nullable().optional(),
		/**
		 * An object, despite the name reading like a flag.
		 *
		 * Declared from the live response rather than from the name: it was first
		 * written here as a boolean and the live suite rejected the Tavern
		 * because of it.
		 */
		cron: z.record(z.string(), z.unknown()).nullable().optional(),
		/**
		 * A string, not the object the surrounding fields would suggest - caught
		 * by the same live parse.
		 *
		 * Both this and `cron` were only ever observed on the Tavern, the one
		 * group the development account belonged to, so a union is used where a
		 * party or guild might differ.
		 */
		archive: z
			.union([z.string(), z.record(z.string(), z.unknown())])
			.nullable()
			.optional(),

		/**
		 * Declared from the model definition rather than from a capture - the
		 * Tavern returned none of these. `GET /models/group/paths` gives the
		 * types.
		 */
		bannedWordsAllowed: B,
		chatLimitCount: N,
		logo: S,
		leaderMessage: S,
		chat: z.array(z.unknown()).nullable().optional(),
	})
	.loose();
export type HabiticaGroupEntity = z.infer<typeof HabiticaGroupEntity>;

/**
 * Which task events a `taskActivity` webhook fires on.
 * Captured from `POST /user/webhook`.
 */
export const HabiticaWebhookOptions = z
	.object({
		created: B,
		updated: B,
		deleted: B,
		scored: B,
		checklistScored: B,
	})
	.loose();
export type HabiticaWebhookOptions = z.infer<typeof HabiticaWebhookOptions>;

/**
 * A webhook the user has registered with Habitica.
 *
 * These are the user's **outbound** webhooks - Habitica calling a URL of their
 * choosing. They are not Corsair webhooks and this plugin registers no webhook
 * handlers; the catalog lists them as ordinary operations, and that is how they
 * are implemented. `failures` is Habitica's own delivery-failure counter, which
 * is why these are worth mirroring: it is the only health signal available.
 */
export const HabiticaWebhookEntity = z
	.object({
		id: Id,
		/** `taskActivity`, `groupChatReceived`, `userActivity`, `questActivity`. */
		type: S,
		label: S,
		url: S,
		enabled: B,
		/** Consecutive delivery failures. Habitica disables a webhook at 10. */
		failures: N,
		options: HabiticaWebhookOptions.nullable().optional(),
		createdAt: S,
		updatedAt: S,
	})
	.loose();
export type HabiticaWebhookEntity = z.infer<typeof HabiticaWebhookEntity>;
