import { z } from 'zod';
import {
	HabiticaChallengeEntity,
	HabiticaChecklistItem,
	HabiticaGroupEntity,
	HabiticaTagEntity,
	HabiticaTaskEntity,
	HabiticaWebhookEntity,
} from '../schema/database';

/**
 * Input and output schemas for every Habitica operation.
 *
 * Output schemas reuse the entity definitions in `schema/database.ts` rather
 * than restating them, so the persisted shape and the returned shape cannot
 * drift apart.
 *
 * Outputs are the **unwrapped** payload. Habitica returns
 * `{"success":true,"data":...}` on every `/api/v3` route; `unwrap()` in
 * `shared.ts` strips that envelope, so the schemas here describe `data` itself.
 */

const S = z.string().nullable().optional();
const N = z.number().nullable().optional();
const B = z.boolean().nullable().optional();

/**
 * A response whose body is an object this plugin does not model field by field.
 *
 * Used where the payload is genuinely open-ended - the game content catalogue,
 * the shops, world state, the user document - and pinning a shape would mean
 * inventing a contract Habitica has not made. `.loose()` everywhere else covers
 * unexpected *additions*; this covers payloads that are unexpected all the way
 * down.
 */
const OpaqueObject = z.record(z.string(), z.unknown());

/** An operation that returns nothing meaningful - Habitica sends `data: {}`. */
const EmptyResult = z.record(z.string(), z.unknown());

/* -------------------------------------------------------------------------- */
/*                                   Tasks                                    */
/* -------------------------------------------------------------------------- */

/** The four task types, which decide which fields a task carries. */
const TaskType = z.enum(['habit', 'daily', 'todo', 'reward']);

/**
 * The task-type filter accepted by `GET /tasks/user`.
 *
 * These are the **plural** forms plus two completed-task views, which is not
 * the same vocabulary as {@link TaskType}. Habitica rejects an unrecognised
 * value with a 400 rather than ignoring it - verified live with
 * `?type=notAType` - so this enum matches a real server-side check rather than
 * merely documenting intent.
 */
const TaskListFilter = z.enum([
	'habits',
	'dailys',
	'todos',
	'rewards',
	'completedTodos',
	'_allCompletedTodos',
]);

const ChecklistItemInput = z.object({
	text: z.string(),
	completed: z.boolean().optional(),
});

const TasksCreateInputSchema = z.object({
	text: z.string(),
	type: TaskType,
	notes: z.string().optional(),
	/** Tag ids, not tag names. */
	tags: z.array(z.string()).optional(),
	/** 0.1 trivial, 1 easy, 1.5 medium, 2 hard. */
	priority: z.number().optional(),
	attribute: z.enum(['str', 'int', 'con', 'per']).optional(),
	checklist: z.array(ChecklistItemInput).optional(),
	collapseChecklist: z.boolean().optional(),
	/** Habits: whether the + and - buttons are enabled. */
	up: z.boolean().optional(),
	down: z.boolean().optional(),
	/** Todos: the due date, as an ISO date string. */
	date: z.string().optional(),
	/** Dailies: scheduling. */
	frequency: z.enum(['daily', 'weekly', 'monthly', 'yearly']).optional(),
	repeat: OpaqueObject.optional(),
	everyX: z.number().optional(),
	startDate: z.string().optional(),
	/** Rewards: the gold cost. */
	value: z.number().optional(),
	/** Rewards and reminders. */
	reminders: z.array(OpaqueObject).optional(),
});
export type TasksCreateInput = z.infer<typeof TasksCreateInputSchema>;

const TasksListInputSchema = z.object({
	type: TaskListFilter.optional(),
	/** Official: date used to compute `nextDue` on each returned daily. */
	dueDate: z.string().optional(),
});
export type TasksListInput = z.infer<typeof TasksListInputSchema>;

const TasksGetInputSchema = z.object({
	/**
	 * Any task id: a personal task or a challenge task.
	 *
	 * This is the operation the catalog calls `HABITICA_GET_CHALLENGE_TASK` and
	 * displays as "Get Task by ID". The description is the specification - it
	 * says the operation works for any task "whether it belongs to a challenge
	 * or is a personal user task" - so it maps to `GET /tasks/:taskId`. Mapping
	 * it by its id would have pointed it at a challenge route and left
	 * `/tasks/:taskId` unimplemented.
	 */
	taskId: z.string(),
});
export type TasksGetInput = z.infer<typeof TasksGetInputSchema>;

const TasksUpdateInputSchema = z.object({
	taskId: z.string(),
	text: z.string().optional(),
	notes: z.string().optional(),
	tags: z.array(z.string()).optional(),
	priority: z.number().optional(),
	attribute: z.enum(['str', 'int', 'con', 'per']).optional(),
	collapseChecklist: z.boolean().optional(),
	checklist: z.array(ChecklistItemInput).optional(),
	up: z.boolean().optional(),
	down: z.boolean().optional(),
	date: z.string().optional(),
	frequency: z.enum(['daily', 'weekly', 'monthly', 'yearly']).optional(),
	repeat: OpaqueObject.optional(),
	everyX: z.number().optional(),
	startDate: z.string().optional(),
	value: z.number().optional(),
	reminders: z.array(OpaqueObject).optional(),
});
export type TasksUpdateInput = z.infer<typeof TasksUpdateInputSchema>;

const TasksDeleteInputSchema = z.object({ taskId: z.string() });
export type TasksDeleteInput = z.infer<typeof TasksDeleteInputSchema>;

const TasksScoreInputSchema = z.object({
	taskId: z.string(),
	/**
	 * `up` completes a todo or daily, records a positive habit, or buys a
	 * reward; `down` reverses the first two and records a negative habit.
	 */
	direction: z.enum(['up', 'down']),
});
export type TasksScoreInput = z.infer<typeof TasksScoreInputSchema>;

const TasksMoveInputSchema = z.object({
	taskId: z.string(),
	/**
	 * The target index: `0` is the top and `-1` is the bottom.
	 *
	 * A completed todo cannot be moved - Habitica answers 400 `Can't move a
	 * completed todo.` Observed live rather than documented, so a failure here
	 * is a precondition rather than a malformed request.
	 */
	position: z.number(),
});
export type TasksMoveInput = z.infer<typeof TasksMoveInputSchema>;

const TasksUpdateChecklistItemInputSchema = z.object({
	taskId: z.string(),
	itemId: z.string(),
	text: z.string(),
});
export type TasksUpdateChecklistItemInput = z.infer<
	typeof TasksUpdateChecklistItemInputSchema
>;

const TasksDeleteChecklistItemInputSchema = z.object({
	taskId: z.string(),
	itemId: z.string(),
});
export type TasksDeleteChecklistItemInput = z.infer<
	typeof TasksDeleteChecklistItemInputSchema
>;

const TasksAddTagInputSchema = z.object({
	taskId: z.string(),
	tagId: z.string(),
});
export type TasksAddTagInput = z.infer<typeof TasksAddTagInputSchema>;

const TasksCreateChallengeTaskInputSchema = z.object({
	challengeId: z.string(),
	text: z.string(),
	type: TaskType,
	notes: z.string().optional(),
	priority: z.number().optional(),
	attribute: z.enum(['str', 'int', 'con', 'per']).optional(),
	checklist: z.array(ChecklistItemInput).optional(),
	up: z.boolean().optional(),
	down: z.boolean().optional(),
	date: z.string().optional(),
	value: z.number().optional(),
});
export type TasksCreateChallengeTaskInput = z.infer<
	typeof TasksCreateChallengeTaskInputSchema
>;

const ChallengeTaskListFilter = z.enum([
	'habits',
	'dailys',
	'todos',
	'rewards',
]);

const TasksListChallengeTasksInputSchema = z.object({
	challengeId: z.string(),
	/** Official GET /tasks/challenge/:id — no completedTodos filter. */
	type: ChallengeTaskListFilter.optional(),
});
export type TasksListChallengeTasksInput = z.infer<
	typeof TasksListChallengeTasksInputSchema
>;

const TasksUnlinkAllInputSchema = z.object({
	challengeId: z.string(),
	/** `keep-all` leaves the tasks on each member; `remove-all` deletes them. */
	keep: z.enum(['keep-all', 'remove-all']).optional(),
});
export type TasksUnlinkAllInput = z.infer<typeof TasksUnlinkAllInputSchema>;

/**
 * What scoring a task returns.
 *
 * Not the task - the **user's stats after the score**, plus `delta` (how far the
 * task's value moved) and `_tmp`, which carries anything the score happened to
 * trigger: an item drop, quest progress, a level-up. `_tmp` is genuinely
 * occasional, so it is optional rather than assumed.
 */
const TasksScoreResponseSchema = z
	.object({
		delta: N,
		_tmp: OpaqueObject.nullable().optional(),
		hp: N,
		mp: N,
		exp: N,
		gp: N,
		lvl: N,
		class: S,
		points: N,
		str: N,
		con: N,
		int: N,
		per: N,
		buffs: OpaqueObject.nullable().optional(),
		training: OpaqueObject.nullable().optional(),
	})
	.loose();

/**
 * What moving a task returns: the reordered id list for that task's type, not
 * the task itself.
 */
const TasksMoveResponseSchema = z.array(z.string());

/* -------------------------------------------------------------------------- */
/*                                    Tags                                    */
/* -------------------------------------------------------------------------- */

const TagsCreateInputSchema = z.object({ name: z.string() });
export type TagsCreateInput = z.infer<typeof TagsCreateInputSchema>;

const TagsListInputSchema = z.object({});
export type TagsListInput = z.infer<typeof TagsListInputSchema>;

const TagsUpdateInputSchema = z.object({
	tagId: z.string(),
	name: z.string(),
});
export type TagsUpdateInput = z.infer<typeof TagsUpdateInputSchema>;

const TagsDeleteInputSchema = z.object({ tagId: z.string() });
export type TagsDeleteInput = z.infer<typeof TagsDeleteInputSchema>;

/* -------------------------------------------------------------------------- */
/*                                 Challenges                                 */
/* -------------------------------------------------------------------------- */

const ChallengesCreateInputSchema = z.object({
	/** The group the challenge runs in. */
	groupId: z.string(),
	name: z.string(),
	/** The short tag-like name applied to the challenge's tasks. */
	shortName: z.string(),
	summary: z.string().optional(),
	description: z.string().optional(),
	/** Gems awarded to the winner. Defaults to 0. */
	prize: z.number().optional(),
});
export type ChallengesCreateInput = z.infer<typeof ChallengesCreateInputSchema>;

const ChallengesGetInputSchema = z.object({ challengeId: z.string() });
export type ChallengesGetInput = z.infer<typeof ChallengesGetInputSchema>;

const ChallengesCloneInputSchema = z.object({ challengeId: z.string() });
export type ChallengesCloneInput = z.infer<typeof ChallengesCloneInputSchema>;

const ChallengesDeleteInputSchema = z.object({ challengeId: z.string() });
export type ChallengesDeleteInput = z.infer<typeof ChallengesDeleteInputSchema>;

const ChallengesJoinInputSchema = z.object({ challengeId: z.string() });
export type ChallengesJoinInput = z.infer<typeof ChallengesJoinInputSchema>;

const ChallengesLeaveInputSchema = z.object({
	challengeId: z.string(),
	/** Whether the challenge's tasks stay on the account after leaving. */
	keep: z.enum(['keep-all', 'remove-all']).optional(),
});
export type ChallengesLeaveInput = z.infer<typeof ChallengesLeaveInputSchema>;

const ChallengesListByGroupInputSchema = z.object({
	groupId: z.string(),
});
export type ChallengesListByGroupInput = z.infer<
	typeof ChallengesListByGroupInputSchema
>;

const ChallengesListForUserInputSchema = z.object({
	/**
	 * Required, and zero-indexed.
	 *
	 * `GET /challenges/user` answers 400 without it - the server validates
	 * `page` with `notEmpty().isInt({min:0})`, confirmed live. It is therefore
	 * not optional here, even though most list operations default their paging.
	 */
	page: z.number(),
	member: z.boolean().optional(),
	owned: z.enum(['owned', 'not_owned']).optional(),
	search: z.string().optional(),
});
export type ChallengesListForUserInput = z.infer<
	typeof ChallengesListForUserInputSchema
>;

const ChallengesExportCsvInputSchema = z.object({ challengeId: z.string() });
export type ChallengesExportCsvInput = z.infer<
	typeof ChallengesExportCsvInputSchema
>;

/**
 * A CSV export, returned as text rather than parsed.
 *
 * The plugin does not parse it into rows: the column set is Habitica's and
 * changes with the challenge's tasks, so parsing would invent a schema that the
 * next challenge breaks. The caller gets the document and its declared content
 * type.
 */
const TextDocumentResponseSchema = z.object({
	body: z.string(),
	contentType: z.string(),
});

/* -------------------------------------------------------------------------- */
/*                                   Groups                                   */
/* -------------------------------------------------------------------------- */

/**
 * Group types accepted when creating one.
 *
 * The catalog states that guilds were removed in August 2023 and only `party`
 * works, while the catalog's own `GET_GROUPS`, `GET_GROUP` and `DELETE_GROUP`
 * entries all describe guild behaviour. Both cannot be current. `guild` is
 * accepted here because the API still exposes it and rejecting it in the plugin
 * would be this integration inventing a restriction; if Habitica refuses it,
 * the caller gets Habitica's own error rather than a guess.
 */
const GroupType = z.enum(['party', 'guild']);

const GroupsCreateInputSchema = z.object({
	name: z.string(),
	type: GroupType,
	privacy: z.enum(['private', 'public']).optional(),
	description: z.string().optional(),
	summary: z.string().optional(),
});
export type GroupsCreateInput = z.infer<typeof GroupsCreateInputSchema>;

const GroupsListInputSchema = z.object({
	/**
	 * Which groups to list, as a comma-separated set of
	 * `party`, `guilds`, `privateGuilds`, `publicGuilds`, `tavern`.
	 */
	type: z.string(),
	paginate: z.boolean().optional(),
	page: z.number().optional(),
});
export type GroupsListInput = z.infer<typeof GroupsListInputSchema>;

const GroupsGetInputSchema = z.object({
	/** A group UUID, or the aliases `party` and `habitrpg` (the Tavern). */
	groupId: z.string(),
});
export type GroupsGetInput = z.infer<typeof GroupsGetInputSchema>;

/** `GET_PARTY` and `GET_GROUPS_HABITRPG` fix the group id, so they take none. */
const GroupsGetFixedInputSchema = z.object({});
export type GroupsGetFixedInput = z.infer<typeof GroupsGetFixedInputSchema>;

const GroupsUpdateInputSchema = z.object({
	groupId: z.string(),
	name: z.string().optional(),
	description: z.string().optional(),
	summary: z.string().optional(),
	privacy: z.enum(['private', 'public']).optional(),
	leader: z.string().optional(),
});
export type GroupsUpdateInput = z.infer<typeof GroupsUpdateInputSchema>;

const GroupsLeaveInputSchema = z.object({
	groupId: z.string(),
	/** Whether challenge tasks from the group's challenges are kept. */
	keep: z.enum(['keep-all', 'remove-all']).optional(),
	/** Whether the user's own challenges in the group are kept. */
	keepChallenges: z
		.enum(['remain-in-challenges', 'leave-challenges'])
		.optional(),
});
export type GroupsLeaveInput = z.infer<typeof GroupsLeaveInputSchema>;

const GroupsListMembersInputSchema = z.object({
	groupId: z.string(),
	lastId: z.string().optional(),
	limit: z.number().max(60).optional(),
	includeAllPublicFields: z.boolean().optional(),
});
export type GroupsListMembersInput = z.infer<
	typeof GroupsListMembersInputSchema
>;

const GroupsInviteInputSchema = z.object({
	groupId: z.string(),
	/** Invite by user UUID. */
	uuids: z.array(z.string()).optional(),
	/** Invite by email. Each entry is `{ name?, email }`. */
	emails: z.array(OpaqueObject).optional(),
	/** Invite by username. */
	usernames: z.array(z.string()).optional(),
});
export type GroupsInviteInput = z.infer<typeof GroupsInviteInputSchema>;

const GroupsRemoveMemberInputSchema = z.object({
	groupId: z.string(),
	memberId: z.string(),
	message: z.string().optional(),
});
export type GroupsRemoveMemberInput = z.infer<
	typeof GroupsRemoveMemberInputSchema
>;

const GroupsInviteToQuestInputSchema = z.object({
	groupId: z.string(),
	/** The quest scroll's content key. The account must own the scroll. */
	questKey: z.string(),
});
export type GroupsInviteToQuestInput = z.infer<
	typeof GroupsInviteToQuestInputSchema
>;

/**
 * A group member.
 *
 * Deliberately shallow. Members are other people; the operations need their ids
 * and display names to be useful, and enumerating the rest of a member document
 * here would encourage copying strangers' profile data around. `.loose()` lets
 * the full response through to a caller that asked for
 * `includeAllPublicFields` without this plugin naming those fields.
 */
const GroupMemberSchema = z
	.object({
		id: S,
		_id: S,
		/** The @handle. */
		auth: OpaqueObject.nullable().optional(),
		profile: OpaqueObject.nullable().optional(),
	})
	.loose();

/* -------------------------------------------------------------------------- */
/*                                    Chat                                    */
/* -------------------------------------------------------------------------- */

const ChatListInputSchema = z.object({
	/** Defaults to the caller's party. */
	groupId: z.string().optional(),
});
export type ChatListInput = z.infer<typeof ChatListInputSchema>;

const ChatDeleteMessageInputSchema = z.object({
	groupId: z.string(),
	chatId: z.string(),
	previousMsg: z.string().optional(),
});
export type ChatDeleteMessageInput = z.infer<
	typeof ChatDeleteMessageInputSchema
>;

const ChatMarkSeenInputSchema = z.object({
	/** `party` for the caller's party, `habitrpg` for the Tavern, or a UUID. */
	groupId: z.string(),
});
export type ChatMarkSeenInput = z.infer<typeof ChatMarkSeenInputSchema>;

/**
 * A chat message.
 *
 * Modelled only as far as the ids and timestamps. The message body and its
 * author's display name are other people's words and identity; they pass
 * through to the caller under `.loose()` but are not named as fields this
 * plugin depends on, and they are never mirrored or logged.
 */
const ChatMessageSchema = z
	.object({
		id: S,
		_id: S,
		timestamp: z.union([z.string(), z.number()]).nullable().optional(),
	})
	.loose();

/* -------------------------------------------------------------------------- */
/*                                    User                                    */
/* -------------------------------------------------------------------------- */

const UserGetInputSchema = z.object({
	/**
	 * A comma-separated projection, e.g. `stats,items`.
	 *
	 * Worth using: the full user document is large and carries the account
	 * holder's email address under `auth.local.email`. Narrowing the request is
	 * the cheapest way to avoid handling data the caller did not ask for.
	 */
	userFields: z.string().optional(),
});
export type UserGetInput = z.infer<typeof UserGetInputSchema>;

const UserUpdateInputSchema = z.object({
	/**
	 * Fields to set, keyed by **dot path** - `profile.name`,
	 * `preferences.language`. Some paths are protected and are rejected;
	 * `stats.class` is the documented example.
	 */
	updates: z.record(z.string(), z.unknown()),
});
export type UserUpdateInput = z.infer<typeof UserUpdateInputSchema>;

const UserResetInputSchema = z.object({});
export type UserResetInput = z.infer<typeof UserResetInputSchema>;

const UserEquipInputSchema = z.object({
	/** Which slot group: gear in use, costume, pet, mount, or background. */
	type: z.enum(['equipped', 'costume', 'pet', 'mount', 'background']),
	/** The item's content key. */
	key: z.string(),
});
export type UserEquipInput = z.infer<typeof UserEquipInputSchema>;

const UserReadCardInputSchema = z.object({
	cardType: z.enum(['birthday', 'greeting', 'nye', 'thankyou', 'valentine']),
});
export type UserReadCardInput = z.infer<typeof UserReadCardInputSchema>;

const UserMovePinnedItemInputSchema = z.object({
	/** The pinned item's dotted path. */
	path: z.string(),
	/** Target index; `0` is the top and `-1` the bottom. */
	position: z.number(),
});
export type UserMovePinnedItemInput = z.infer<
	typeof UserMovePinnedItemInputSchema
>;

const UserDeleteMessageInputSchema = z.object({ id: z.string() });
export type UserDeleteMessageInput = z.infer<
	typeof UserDeleteMessageInputSchema
>;

const UserAddPushDeviceInputSchema = z.object({
	/** The device registration id issued by the push service. */
	regId: z.string(),
	type: z.enum(['android', 'ios']),
});
export type UserAddPushDeviceInput = z.infer<
	typeof UserAddPushDeviceInputSchema
>;

const UserDeletePushDeviceInputSchema = z.object({ regId: z.string() });
export type UserDeletePushDeviceInput = z.infer<
	typeof UserDeletePushDeviceInputSchema
>;

const UserMarkNotificationSeenInputSchema = z.object({
	notificationId: z.string(),
});
export type UserMarkNotificationSeenInput = z.infer<
	typeof UserMarkNotificationSeenInputSchema
>;

const UserMarkNotificationsSeenInputSchema = z.object({
	notificationIds: z.array(z.string()).optional(),
});
export type UserMarkNotificationsSeenInput = z.infer<
	typeof UserMarkNotificationsSeenInputSchema
>;

/* -------------------------------------------------------------------------- */
/*                                    Auth                                    */
/* -------------------------------------------------------------------------- */

/**
 * The three operations whose inputs are credentials.
 *
 * These do not use the plugin's own credential - they mint one. Everything
 * about how they are handled is stricter as a result: the inputs are never
 * mirrored, never included in an error, and the audit record says only that an
 * attempt happened (see `credentialAuditPayload` in `logging.ts`).
 */
const AuthRegisterInputSchema = z.object({
	username: z.string(),
	email: z.string(),
	password: z.string(),
	confirmPassword: z.string(),
});
export type AuthRegisterInput = z.infer<typeof AuthRegisterInputSchema>;

const AuthLoginInputSchema = z.object({
	/** Either the username or the email address. */
	username: z.string(),
	password: z.string(),
});
export type AuthLoginInput = z.infer<typeof AuthLoginInputSchema>;

const AuthSocialInputSchema = z.object({
	network: z.enum(['facebook', 'google', 'apple']),
	/** The OAuth credential obtained from the provider. */
	authResponse: OpaqueObject,
});
export type AuthSocialInput = z.infer<typeof AuthSocialInputSchema>;

/**
 * What an authentication call returns: a freshly minted credential pair.
 *
 * `apiToken` is a live secret. It is returned to the caller, which is the whole
 * point of the operation, but it must not be logged, mirrored or included in an
 * error message anywhere in this plugin.
 */
const AuthResponseSchema = z
	.object({
		id: S,
		apiToken: S,
		newUser: B,
		username: S,
	})
	.loose();

/* -------------------------------------------------------------------------- */
/*                                  Webhooks                                  */
/* -------------------------------------------------------------------------- */

/**
 * Webhook operations cover create, list and enable only.
 *
 * The API also has `PUT` (general update) and `DELETE`, and the catalog lists
 * neither. That asymmetry is matched rather than corrected: the catalog defines
 * the surface, and adding siblings it does not list would put this plugin out
 * of step with every other consumer of the same catalog.
 */
const WebhooksCreateInputSchema = z.object({
	url: z.string(),
	label: z.string().optional(),
	enabled: z.boolean().optional(),
	type: z
		.enum([
			'taskActivity',
			'groupChatReceived',
			'userActivity',
			'questActivity',
		])
		.optional(),
	options: OpaqueObject.optional(),
});
export type WebhooksCreateInput = z.infer<typeof WebhooksCreateInputSchema>;

const WebhooksListInputSchema = z.object({});
export type WebhooksListInput = z.infer<typeof WebhooksListInputSchema>;

const WebhooksSubscribeInputSchema = z.object({
	/**
	 * The webhook to enable.
	 *
	 * The catalog calls this "Subscribe Webhook" and its own description states
	 * it is implemented as an update that sets `enabled=true`, so it maps to
	 * `PUT /user/webhook/:id`. There is no separate subscribe route.
	 */
	id: z.string(),
});
export type WebhooksSubscribeInput = z.infer<
	typeof WebhooksSubscribeInputSchema
>;

/* -------------------------------------------------------------------------- */
/*                          Content and world state                           */
/* -------------------------------------------------------------------------- */

const ContentGetInputSchema = z.object({
	/** Two-letter language code for the localised text. Defaults to English. */
	language: z.string().optional(),
});
export type ContentGetInput = z.infer<typeof ContentGetInputSchema>;

const ContentGetByTypeInputSchema = z.object({
	/**
	 * Comma-separated content keys.
	 *
	 * **This parameter EXCLUDES what you name; it does not select it.** Verified
	 * live on 2026-08-15 by comparing key sets, not status codes: the unfiltered
	 * response carries 56 top-level keys, `filter=quests` carries 55, and the
	 * one key missing is `quests`. The server's own helper calls this argument
	 * `removedKeys`.
	 *
	 * The catalog describes the opposite - "filtered by a specific category
	 * type" - so a caller following the catalog receives everything **except**
	 * what they asked for, with a 200 and no indication anything is wrong. The
	 * name is kept as the API spells it, and the behaviour is documented here
	 * rather than silently inverted, because reversing it in the plugin would
	 * make this integration disagree with every other Habitica client.
	 *
	 * An unrecognised key is ignored silently - `filter=notARealContentKey`
	 * returns the full 56 keys - so a typo costs the caller nothing here, but
	 * also warns them of nothing.
	 */
	filter: z.string().optional(),
	language: z.string().optional(),
});
export type ContentGetByTypeInput = z.infer<typeof ContentGetByTypeInputSchema>;

const StatusInputSchema = z.object({});
export type StatusInput = z.infer<typeof StatusInputSchema>;

const WorldStateInputSchema = z.object({});
export type WorldStateInput = z.infer<typeof WorldStateInputSchema>;

const ModelPathsInputSchema = z.object({
	/**
	 * Which model to describe.
	 *
	 * Enumerated by asking the API rather than taken from the catalog, which
	 * lists "user, group, challenge, tag, or task". `task` is **not** valid and
	 * returns 400; the four task types are addressed individually instead.
	 */
	model: z.enum([
		'user',
		'tag',
		'challenge',
		'group',
		'habit',
		'daily',
		'todo',
		'reward',
	]),
});
export type ModelPathsInput = z.infer<typeof ModelPathsInputSchema>;

const NewsInputSchema = z.object({});
export type NewsInput = z.infer<typeof NewsInputSchema>;

const NewsDismissInputSchema = z.object({});
export type NewsDismissInput = z.infer<typeof NewsDismissInputSchema>;

const ShopInputSchema = z.object({
	language: z.string().optional(),
});
export type ShopInput = z.infer<typeof ShopInputSchema>;

const ValidateCouponInputSchema = z.object({ code: z.string() });
export type ValidateCouponInput = z.infer<typeof ValidateCouponInputSchema>;

/* -------------------------------------------------------------------------- */
/*                                  Exports                                   */
/* -------------------------------------------------------------------------- */

const ExportInputSchema = z.object({});
export type ExportInput = z.infer<typeof ExportInputSchema>;

/**
 * The user-data export.
 *
 * Returned to the caller as parsed JSON, and **never mirrored, never logged and
 * never used as a test fixture**: this document contains the account holder's
 * email address under `auth.local.email`, along with their whole task and
 * message history.
 */
const ExportUserDataResponseSchema = OpaqueObject;

/* -------------------------------------------------------------------------- */
/*                                  Registry                                  */
/* -------------------------------------------------------------------------- */

export type HabiticaEndpointInputs = {
	tasksCreate: TasksCreateInput;
	tasksList: TasksListInput;
	tasksGet: TasksGetInput;
	tasksUpdate: TasksUpdateInput;
	tasksDelete: TasksDeleteInput;
	tasksScore: TasksScoreInput;
	tasksMove: TasksMoveInput;
	tasksUpdateChecklistItem: TasksUpdateChecklistItemInput;
	tasksDeleteChecklistItem: TasksDeleteChecklistItemInput;
	tasksAddTag: TasksAddTagInput;
	tasksCreateChallengeTask: TasksCreateChallengeTaskInput;
	tasksListChallengeTasks: TasksListChallengeTasksInput;
	tasksUnlinkAllChallengeTasks: TasksUnlinkAllInput;

	tagsCreate: TagsCreateInput;
	tagsList: TagsListInput;
	tagsUpdate: TagsUpdateInput;
	tagsDelete: TagsDeleteInput;

	challengesCreate: ChallengesCreateInput;
	challengesGet: ChallengesGetInput;
	challengesClone: ChallengesCloneInput;
	challengesDelete: ChallengesDeleteInput;
	challengesJoin: ChallengesJoinInput;
	challengesLeave: ChallengesLeaveInput;
	challengesListByGroup: ChallengesListByGroupInput;
	challengesListForUser: ChallengesListForUserInput;
	challengesExportCsv: ChallengesExportCsvInput;

	groupsCreate: GroupsCreateInput;
	groupsList: GroupsListInput;
	groupsGet: GroupsGetInput;
	groupsGetParty: GroupsGetFixedInput;
	groupsGetTavern: GroupsGetFixedInput;
	groupsUpdate: GroupsUpdateInput;
	groupsLeave: GroupsLeaveInput;
	groupsListMembers: GroupsListMembersInput;
	groupsInvite: GroupsInviteInput;
	groupsRemoveMember: GroupsRemoveMemberInput;
	groupsInviteToQuest: GroupsInviteToQuestInput;

	chatList: ChatListInput;
	chatDeleteMessage: ChatDeleteMessageInput;
	chatMarkSeen: ChatMarkSeenInput;

	userGet: UserGetInput;
	userUpdate: UserUpdateInput;
	userReset: UserResetInput;
	userEquip: UserEquipInput;
	userReadCard: UserReadCardInput;
	userMovePinnedItem: UserMovePinnedItemInput;
	userDeleteMessage: UserDeleteMessageInput;
	userAddPushDevice: UserAddPushDeviceInput;
	userDeletePushDevice: UserDeletePushDeviceInput;
	userMarkNotificationSeen: UserMarkNotificationSeenInput;
	userMarkNotificationsSeen: UserMarkNotificationsSeenInput;

	authRegister: AuthRegisterInput;
	authLogin: AuthLoginInput;
	authSocial: AuthSocialInput;

	webhooksCreate: WebhooksCreateInput;
	webhooksList: WebhooksListInput;
	webhooksSubscribe: WebhooksSubscribeInput;

	contentGet: ContentGetInput;
	contentGetByType: ContentGetByTypeInput;
	status: StatusInput;
	worldState: WorldStateInput;
	modelPaths: ModelPathsInput;
	newsGet: NewsInput;
	newsDismiss: NewsDismissInput;
	shopsMarketGear: ShopInput;
	shopsTimeTravelers: ShopInput;
	validateCoupon: ValidateCouponInput;

	exportUserData: ExportInput;
	exportHistoryCsv: ExportInput;
	exportInboxHtml: ExportInput;
};

export type HabiticaEndpointOutputs = {
	tasksCreate: z.infer<typeof HabiticaTaskEntity>;
	tasksList: z.infer<typeof HabiticaTaskEntity>[];
	tasksGet: z.infer<typeof HabiticaTaskEntity>;
	tasksUpdate: z.infer<typeof HabiticaTaskEntity>;
	tasksDelete: z.infer<typeof EmptyResult>;
	tasksScore: z.infer<typeof TasksScoreResponseSchema>;
	tasksMove: z.infer<typeof TasksMoveResponseSchema>;
	tasksUpdateChecklistItem: z.infer<typeof HabiticaTaskEntity>;
	tasksDeleteChecklistItem: z.infer<typeof HabiticaTaskEntity>;
	tasksAddTag: z.infer<typeof HabiticaTaskEntity>;
	tasksCreateChallengeTask: z.infer<typeof HabiticaTaskEntity>[];
	tasksListChallengeTasks: z.infer<typeof HabiticaTaskEntity>[];
	tasksUnlinkAllChallengeTasks: z.infer<typeof EmptyResult>;

	tagsCreate: z.infer<typeof HabiticaTagEntity>;
	tagsList: z.infer<typeof HabiticaTagEntity>[];
	tagsUpdate: z.infer<typeof HabiticaTagEntity>;
	tagsDelete: z.infer<typeof EmptyResult>;

	challengesCreate: z.infer<typeof HabiticaChallengeEntity>;
	challengesGet: z.infer<typeof HabiticaChallengeEntity>;
	challengesClone: z.infer<typeof HabiticaChallengeEntity>;
	challengesDelete: z.infer<typeof EmptyResult>;
	challengesJoin: z.infer<typeof HabiticaChallengeEntity>;
	challengesLeave: z.infer<typeof EmptyResult>;
	challengesListByGroup: z.infer<typeof HabiticaChallengeEntity>[];
	challengesListForUser: z.infer<typeof HabiticaChallengeEntity>[];
	challengesExportCsv: z.infer<typeof TextDocumentResponseSchema>;

	groupsCreate: z.infer<typeof HabiticaGroupEntity>;
	groupsList: z.infer<typeof HabiticaGroupEntity>[];
	groupsGet: z.infer<typeof HabiticaGroupEntity>;
	groupsGetParty: z.infer<typeof HabiticaGroupEntity>;
	groupsGetTavern: z.infer<typeof HabiticaGroupEntity>;
	groupsUpdate: z.infer<typeof HabiticaGroupEntity>;
	groupsLeave: z.infer<typeof EmptyResult>;
	groupsListMembers: z.infer<typeof GroupMemberSchema>[];
	groupsInvite: z.infer<typeof OpaqueObject>[];
	groupsRemoveMember: z.infer<typeof EmptyResult>;
	groupsInviteToQuest: z.infer<typeof OpaqueObject>;

	chatList: z.infer<typeof ChatMessageSchema>[];
	chatDeleteMessage: z.infer<typeof OpaqueObject>;
	chatMarkSeen: z.infer<typeof EmptyResult>;

	userGet: z.infer<typeof OpaqueObject>;
	userUpdate: z.infer<typeof OpaqueObject>;
	userReset: z.infer<typeof OpaqueObject>;
	userEquip: z.infer<typeof OpaqueObject>;
	userReadCard: z.infer<typeof OpaqueObject>;
	userMovePinnedItem: z.infer<typeof OpaqueObject>;
	userDeleteMessage: z.infer<typeof OpaqueObject>;
	userAddPushDevice: z.infer<typeof OpaqueObject>[];
	userDeletePushDevice: z.infer<typeof OpaqueObject>[];
	userMarkNotificationSeen: z.infer<typeof OpaqueObject>;
	userMarkNotificationsSeen: z.infer<typeof OpaqueObject>;

	authRegister: z.infer<typeof AuthResponseSchema>;
	authLogin: z.infer<typeof AuthResponseSchema>;
	authSocial: z.infer<typeof AuthResponseSchema>;

	webhooksCreate: z.infer<typeof HabiticaWebhookEntity>;
	webhooksList: z.infer<typeof HabiticaWebhookEntity>[];
	webhooksSubscribe: z.infer<typeof HabiticaWebhookEntity>;

	contentGet: z.infer<typeof OpaqueObject>;
	contentGetByType: z.infer<typeof OpaqueObject>;
	status: z.infer<typeof OpaqueObject>;
	worldState: z.infer<typeof OpaqueObject>;
	modelPaths: z.infer<typeof OpaqueObject>;
	newsGet: z.infer<typeof OpaqueObject>;
	newsDismiss: z.infer<typeof EmptyResult>;
	shopsMarketGear: z.infer<typeof OpaqueObject>;
	shopsTimeTravelers: z.infer<typeof OpaqueObject>;
	validateCoupon: z.infer<typeof OpaqueObject>;

	exportUserData: z.infer<typeof ExportUserDataResponseSchema>;
	exportHistoryCsv: z.infer<typeof TextDocumentResponseSchema>;
	exportInboxHtml: z.infer<typeof TextDocumentResponseSchema>;
};

export const HabiticaEndpointInputSchemas = {
	tasksCreate: TasksCreateInputSchema,
	tasksList: TasksListInputSchema,
	tasksGet: TasksGetInputSchema,
	tasksUpdate: TasksUpdateInputSchema,
	tasksDelete: TasksDeleteInputSchema,
	tasksScore: TasksScoreInputSchema,
	tasksMove: TasksMoveInputSchema,
	tasksUpdateChecklistItem: TasksUpdateChecklistItemInputSchema,
	tasksDeleteChecklistItem: TasksDeleteChecklistItemInputSchema,
	tasksAddTag: TasksAddTagInputSchema,
	tasksCreateChallengeTask: TasksCreateChallengeTaskInputSchema,
	tasksListChallengeTasks: TasksListChallengeTasksInputSchema,
	tasksUnlinkAllChallengeTasks: TasksUnlinkAllInputSchema,

	tagsCreate: TagsCreateInputSchema,
	tagsList: TagsListInputSchema,
	tagsUpdate: TagsUpdateInputSchema,
	tagsDelete: TagsDeleteInputSchema,

	challengesCreate: ChallengesCreateInputSchema,
	challengesGet: ChallengesGetInputSchema,
	challengesClone: ChallengesCloneInputSchema,
	challengesDelete: ChallengesDeleteInputSchema,
	challengesJoin: ChallengesJoinInputSchema,
	challengesLeave: ChallengesLeaveInputSchema,
	challengesListByGroup: ChallengesListByGroupInputSchema,
	challengesListForUser: ChallengesListForUserInputSchema,
	challengesExportCsv: ChallengesExportCsvInputSchema,

	groupsCreate: GroupsCreateInputSchema,
	groupsList: GroupsListInputSchema,
	groupsGet: GroupsGetInputSchema,
	groupsGetParty: GroupsGetFixedInputSchema,
	groupsGetTavern: GroupsGetFixedInputSchema,
	groupsUpdate: GroupsUpdateInputSchema,
	groupsLeave: GroupsLeaveInputSchema,
	groupsListMembers: GroupsListMembersInputSchema,
	groupsInvite: GroupsInviteInputSchema,
	groupsRemoveMember: GroupsRemoveMemberInputSchema,
	groupsInviteToQuest: GroupsInviteToQuestInputSchema,

	chatList: ChatListInputSchema,
	chatDeleteMessage: ChatDeleteMessageInputSchema,
	chatMarkSeen: ChatMarkSeenInputSchema,

	userGet: UserGetInputSchema,
	userUpdate: UserUpdateInputSchema,
	userReset: UserResetInputSchema,
	userEquip: UserEquipInputSchema,
	userReadCard: UserReadCardInputSchema,
	userMovePinnedItem: UserMovePinnedItemInputSchema,
	userDeleteMessage: UserDeleteMessageInputSchema,
	userAddPushDevice: UserAddPushDeviceInputSchema,
	userDeletePushDevice: UserDeletePushDeviceInputSchema,
	userMarkNotificationSeen: UserMarkNotificationSeenInputSchema,
	userMarkNotificationsSeen: UserMarkNotificationsSeenInputSchema,

	authRegister: AuthRegisterInputSchema,
	authLogin: AuthLoginInputSchema,
	authSocial: AuthSocialInputSchema,

	webhooksCreate: WebhooksCreateInputSchema,
	webhooksList: WebhooksListInputSchema,
	webhooksSubscribe: WebhooksSubscribeInputSchema,

	contentGet: ContentGetInputSchema,
	contentGetByType: ContentGetByTypeInputSchema,
	status: StatusInputSchema,
	worldState: WorldStateInputSchema,
	modelPaths: ModelPathsInputSchema,
	newsGet: NewsInputSchema,
	newsDismiss: NewsDismissInputSchema,
	shopsMarketGear: ShopInputSchema,
	shopsTimeTravelers: ShopInputSchema,
	validateCoupon: ValidateCouponInputSchema,

	exportUserData: ExportInputSchema,
	exportHistoryCsv: ExportInputSchema,
	exportInboxHtml: ExportInputSchema,
} as const;

export const HabiticaEndpointOutputSchemas = {
	tasksCreate: HabiticaTaskEntity,
	tasksList: z.array(HabiticaTaskEntity),
	tasksGet: HabiticaTaskEntity,
	tasksUpdate: HabiticaTaskEntity,
	tasksDelete: EmptyResult,
	tasksScore: TasksScoreResponseSchema,
	tasksMove: TasksMoveResponseSchema,
	tasksUpdateChecklistItem: HabiticaTaskEntity,
	tasksDeleteChecklistItem: HabiticaTaskEntity,
	tasksAddTag: HabiticaTaskEntity,
	tasksCreateChallengeTask: z.array(HabiticaTaskEntity),
	tasksListChallengeTasks: z.array(HabiticaTaskEntity),
	tasksUnlinkAllChallengeTasks: EmptyResult,

	tagsCreate: HabiticaTagEntity,
	tagsList: z.array(HabiticaTagEntity),
	tagsUpdate: HabiticaTagEntity,
	tagsDelete: EmptyResult,

	challengesCreate: HabiticaChallengeEntity,
	challengesGet: HabiticaChallengeEntity,
	challengesClone: HabiticaChallengeEntity,
	challengesDelete: EmptyResult,
	challengesJoin: HabiticaChallengeEntity,
	challengesLeave: EmptyResult,
	challengesListByGroup: z.array(HabiticaChallengeEntity),
	challengesListForUser: z.array(HabiticaChallengeEntity),
	challengesExportCsv: TextDocumentResponseSchema,

	groupsCreate: HabiticaGroupEntity,
	groupsList: z.array(HabiticaGroupEntity),
	groupsGet: HabiticaGroupEntity,
	groupsGetParty: HabiticaGroupEntity,
	groupsGetTavern: HabiticaGroupEntity,
	groupsUpdate: HabiticaGroupEntity,
	groupsLeave: EmptyResult,
	groupsListMembers: z.array(GroupMemberSchema),
	groupsInvite: z.array(OpaqueObject),
	groupsRemoveMember: EmptyResult,
	groupsInviteToQuest: OpaqueObject,

	chatList: z.array(ChatMessageSchema),
	chatDeleteMessage: OpaqueObject,
	chatMarkSeen: EmptyResult,

	userGet: OpaqueObject,
	userUpdate: OpaqueObject,
	userReset: OpaqueObject,
	userEquip: OpaqueObject,
	userReadCard: OpaqueObject,
	userMovePinnedItem: OpaqueObject,
	userDeleteMessage: OpaqueObject,
	userAddPushDevice: z.array(OpaqueObject),
	userDeletePushDevice: z.array(OpaqueObject),
	userMarkNotificationSeen: OpaqueObject,
	userMarkNotificationsSeen: OpaqueObject,

	authRegister: AuthResponseSchema,
	authLogin: AuthResponseSchema,
	authSocial: AuthResponseSchema,

	webhooksCreate: HabiticaWebhookEntity,
	webhooksList: z.array(HabiticaWebhookEntity),
	webhooksSubscribe: HabiticaWebhookEntity,

	contentGet: OpaqueObject,
	contentGetByType: OpaqueObject,
	status: OpaqueObject,
	worldState: OpaqueObject,
	modelPaths: OpaqueObject,
	newsGet: OpaqueObject,
	newsDismiss: EmptyResult,
	shopsMarketGear: OpaqueObject,
	shopsTimeTravelers: OpaqueObject,
	validateCoupon: OpaqueObject,

	exportUserData: ExportUserDataResponseSchema,
	exportHistoryCsv: TextDocumentResponseSchema,
	exportInboxHtml: TextDocumentResponseSchema,
} as const;

export { HabiticaChecklistItem };
