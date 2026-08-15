import type {
	AuthTypes,
	BindEndpoints,
	CorsairEndpoint,
	CorsairErrorHandler,
	CorsairPlugin,
	CorsairPluginContext,
	KeyBuilderContext,
	PickAuth,
	PluginAuthConfig,
	PluginPermissionsConfig,
	RequiredPluginEndpointMeta,
	RequiredPluginEndpointSchemas,
} from 'corsair/core';
import {
	Auth,
	Challenges,
	Chat,
	Content,
	Exports,
	Groups,
	Tags,
	Tasks,
	User,
	Webhooks,
} from './endpoints';
import type {
	HabiticaEndpointInputs,
	HabiticaEndpointOutputs,
} from './endpoints/types';
import {
	HabiticaEndpointInputSchemas,
	HabiticaEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { HabiticaSchema } from './schema';

export type HabiticaPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	/**
	 * The account's Habitica user id, sent as `x-api-user`.
	 *
	 * Habitica's credential has two halves and both are checked: a valid token
	 * paired with a different account's id is answered 401 `There is no account
	 * that uses those credentials.` So this is a second credential, not a
	 * routing hint the token implies.
	 *
	 * When omitted the plugin falls back to the stored `user_id` key. There is
	 * deliberately no discovery step - unlike Harvest, which can ask which
	 * accounts a token reaches, every authenticated Habitica route already needs
	 * the user id, so no route exists that could discover it.
	 */
	userId?: string;
	hooks?: InternalHabiticaPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof habiticaEndpointsNested>;
};

/**
 * Habitica authenticates with an API token plus the account's user id.
 *
 * The user id is declared as an account-scoped key so it can be stored
 * alongside the token rather than having to be passed on every call.
 */
export const habiticaAuthConfig = {
	api_key: {
		account: ['user_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type HabiticaContext = CorsairPluginContext<
	typeof HabiticaSchema,
	HabiticaPluginOptions,
	undefined,
	typeof habiticaAuthConfig
>;

export type HabiticaKeyBuilderContext =
	KeyBuilderContext<HabiticaPluginOptions>;

export type HabiticaBoundEndpoints = BindEndpoints<
	typeof habiticaEndpointsNested
>;

type HabiticaEndpoint<K extends keyof HabiticaEndpointOutputs> =
	CorsairEndpoint<
		HabiticaContext,
		HabiticaEndpointInputs[K],
		HabiticaEndpointOutputs[K]
	>;

export type HabiticaEndpoints = {
	tasksCreate: HabiticaEndpoint<'tasksCreate'>;
	tasksList: HabiticaEndpoint<'tasksList'>;
	tasksGet: HabiticaEndpoint<'tasksGet'>;
	tasksUpdate: HabiticaEndpoint<'tasksUpdate'>;
	tasksDelete: HabiticaEndpoint<'tasksDelete'>;
	tasksScore: HabiticaEndpoint<'tasksScore'>;
	tasksMove: HabiticaEndpoint<'tasksMove'>;
	tasksUpdateChecklistItem: HabiticaEndpoint<'tasksUpdateChecklistItem'>;
	tasksDeleteChecklistItem: HabiticaEndpoint<'tasksDeleteChecklistItem'>;
	tasksAddTag: HabiticaEndpoint<'tasksAddTag'>;
	tasksCreateChallengeTask: HabiticaEndpoint<'tasksCreateChallengeTask'>;
	tasksListChallengeTasks: HabiticaEndpoint<'tasksListChallengeTasks'>;
	tasksUnlinkAllChallengeTasks: HabiticaEndpoint<'tasksUnlinkAllChallengeTasks'>;

	tagsCreate: HabiticaEndpoint<'tagsCreate'>;
	tagsList: HabiticaEndpoint<'tagsList'>;
	tagsUpdate: HabiticaEndpoint<'tagsUpdate'>;
	tagsDelete: HabiticaEndpoint<'tagsDelete'>;

	challengesCreate: HabiticaEndpoint<'challengesCreate'>;
	challengesGet: HabiticaEndpoint<'challengesGet'>;
	challengesClone: HabiticaEndpoint<'challengesClone'>;
	challengesDelete: HabiticaEndpoint<'challengesDelete'>;
	challengesJoin: HabiticaEndpoint<'challengesJoin'>;
	challengesLeave: HabiticaEndpoint<'challengesLeave'>;
	challengesListByGroup: HabiticaEndpoint<'challengesListByGroup'>;
	challengesListForUser: HabiticaEndpoint<'challengesListForUser'>;
	challengesExportCsv: HabiticaEndpoint<'challengesExportCsv'>;

	groupsCreate: HabiticaEndpoint<'groupsCreate'>;
	groupsList: HabiticaEndpoint<'groupsList'>;
	groupsGet: HabiticaEndpoint<'groupsGet'>;
	groupsGetParty: HabiticaEndpoint<'groupsGetParty'>;
	groupsGetTavern: HabiticaEndpoint<'groupsGetTavern'>;
	groupsUpdate: HabiticaEndpoint<'groupsUpdate'>;
	groupsLeave: HabiticaEndpoint<'groupsLeave'>;
	groupsListMembers: HabiticaEndpoint<'groupsListMembers'>;
	groupsInvite: HabiticaEndpoint<'groupsInvite'>;
	groupsRemoveMember: HabiticaEndpoint<'groupsRemoveMember'>;
	groupsInviteToQuest: HabiticaEndpoint<'groupsInviteToQuest'>;

	chatList: HabiticaEndpoint<'chatList'>;
	chatDeleteMessage: HabiticaEndpoint<'chatDeleteMessage'>;
	chatMarkSeen: HabiticaEndpoint<'chatMarkSeen'>;

	userGet: HabiticaEndpoint<'userGet'>;
	userUpdate: HabiticaEndpoint<'userUpdate'>;
	userReset: HabiticaEndpoint<'userReset'>;
	userEquip: HabiticaEndpoint<'userEquip'>;
	userReadCard: HabiticaEndpoint<'userReadCard'>;
	userMovePinnedItem: HabiticaEndpoint<'userMovePinnedItem'>;
	userDeleteMessage: HabiticaEndpoint<'userDeleteMessage'>;
	userAddPushDevice: HabiticaEndpoint<'userAddPushDevice'>;
	userDeletePushDevice: HabiticaEndpoint<'userDeletePushDevice'>;
	userMarkNotificationSeen: HabiticaEndpoint<'userMarkNotificationSeen'>;
	userMarkNotificationsSeen: HabiticaEndpoint<'userMarkNotificationsSeen'>;

	authRegister: HabiticaEndpoint<'authRegister'>;
	authLogin: HabiticaEndpoint<'authLogin'>;
	authSocial: HabiticaEndpoint<'authSocial'>;

	webhooksCreate: HabiticaEndpoint<'webhooksCreate'>;
	webhooksList: HabiticaEndpoint<'webhooksList'>;
	webhooksSubscribe: HabiticaEndpoint<'webhooksSubscribe'>;

	contentGet: HabiticaEndpoint<'contentGet'>;
	contentGetByType: HabiticaEndpoint<'contentGetByType'>;
	status: HabiticaEndpoint<'status'>;
	worldState: HabiticaEndpoint<'worldState'>;
	modelPaths: HabiticaEndpoint<'modelPaths'>;
	newsGet: HabiticaEndpoint<'newsGet'>;
	newsDismiss: HabiticaEndpoint<'newsDismiss'>;
	shopsMarketGear: HabiticaEndpoint<'shopsMarketGear'>;
	shopsTimeTravelers: HabiticaEndpoint<'shopsTimeTravelers'>;
	validateCoupon: HabiticaEndpoint<'validateCoupon'>;

	exportUserData: HabiticaEndpoint<'exportUserData'>;
	exportHistoryCsv: HabiticaEndpoint<'exportHistoryCsv'>;
	exportInboxHtml: HabiticaEndpoint<'exportInboxHtml'>;
};

const habiticaEndpointsNested = {
	tasks: {
		create: Tasks.create,
		list: Tasks.list,
		get: Tasks.get,
		update: Tasks.update,
		delete: Tasks.remove,
		score: Tasks.score,
		move: Tasks.move,
		updateChecklistItem: Tasks.updateChecklistItem,
		deleteChecklistItem: Tasks.deleteChecklistItem,
		addTag: Tasks.addTag,
		createChallengeTask: Tasks.createChallengeTask,
		listChallengeTasks: Tasks.listChallengeTasks,
		unlinkAllChallengeTasks: Tasks.unlinkAllChallengeTasks,
	},
	tags: {
		create: Tags.create,
		list: Tags.list,
		update: Tags.update,
		delete: Tags.remove,
	},
	challenges: {
		create: Challenges.create,
		get: Challenges.get,
		clone: Challenges.clone,
		delete: Challenges.remove,
		join: Challenges.join,
		leave: Challenges.leave,
		listByGroup: Challenges.listByGroup,
		listForUser: Challenges.listForUser,
		exportCsv: Challenges.exportCsv,
	},
	groups: {
		create: Groups.create,
		list: Groups.list,
		get: Groups.get,
		getParty: Groups.getParty,
		getTavern: Groups.getTavern,
		update: Groups.update,
		leave: Groups.leave,
		listMembers: Groups.listMembers,
		invite: Groups.invite,
		removeMember: Groups.removeMember,
		inviteToQuest: Groups.inviteToQuest,
	},
	chat: {
		list: Chat.list,
		deleteMessage: Chat.deleteMessage,
		markSeen: Chat.markSeen,
	},
	user: {
		get: User.get,
		update: User.update,
		reset: User.reset,
		equip: User.equip,
		readCard: User.readCard,
		movePinnedItem: User.movePinnedItem,
		deleteMessage: User.deleteMessage,
		addPushDevice: User.addPushDevice,
		deletePushDevice: User.deletePushDevice,
		markNotificationSeen: User.markNotificationSeen,
		markNotificationsSeen: User.markNotificationsSeen,
	},
	auth: {
		register: Auth.register,
		login: Auth.login,
		social: Auth.social,
	},
	webhooks: {
		create: Webhooks.create,
		list: Webhooks.list,
		subscribe: Webhooks.subscribe,
	},
	content: {
		get: Content.get,
		getByType: Content.getByType,
		status: Content.status,
		worldState: Content.worldState,
		modelPaths: Content.modelPaths,
		news: Content.news,
		dismissNews: Content.dismissNews,
		marketGear: Content.marketGear,
		timeTravelers: Content.timeTravelers,
		validateCoupon: Content.validateCoupon,
	},
	exports: {
		userData: Exports.userData,
		history: Exports.history,
		inbox: Exports.inbox,
	},
} as const;

export const habiticaEndpointSchemas = {
	'tasks.create': {
		input: HabiticaEndpointInputSchemas.tasksCreate,
		output: HabiticaEndpointOutputSchemas.tasksCreate,
	},
	'tasks.list': {
		input: HabiticaEndpointInputSchemas.tasksList,
		output: HabiticaEndpointOutputSchemas.tasksList,
	},
	'tasks.get': {
		input: HabiticaEndpointInputSchemas.tasksGet,
		output: HabiticaEndpointOutputSchemas.tasksGet,
	},
	'tasks.update': {
		input: HabiticaEndpointInputSchemas.tasksUpdate,
		output: HabiticaEndpointOutputSchemas.tasksUpdate,
	},
	'tasks.delete': {
		input: HabiticaEndpointInputSchemas.tasksDelete,
		output: HabiticaEndpointOutputSchemas.tasksDelete,
	},
	'tasks.score': {
		input: HabiticaEndpointInputSchemas.tasksScore,
		output: HabiticaEndpointOutputSchemas.tasksScore,
	},
	'tasks.move': {
		input: HabiticaEndpointInputSchemas.tasksMove,
		output: HabiticaEndpointOutputSchemas.tasksMove,
	},
	'tasks.updateChecklistItem': {
		input: HabiticaEndpointInputSchemas.tasksUpdateChecklistItem,
		output: HabiticaEndpointOutputSchemas.tasksUpdateChecklistItem,
	},
	'tasks.deleteChecklistItem': {
		input: HabiticaEndpointInputSchemas.tasksDeleteChecklistItem,
		output: HabiticaEndpointOutputSchemas.tasksDeleteChecklistItem,
	},
	'tasks.addTag': {
		input: HabiticaEndpointInputSchemas.tasksAddTag,
		output: HabiticaEndpointOutputSchemas.tasksAddTag,
	},
	'tasks.createChallengeTask': {
		input: HabiticaEndpointInputSchemas.tasksCreateChallengeTask,
		output: HabiticaEndpointOutputSchemas.tasksCreateChallengeTask,
	},
	'tasks.listChallengeTasks': {
		input: HabiticaEndpointInputSchemas.tasksListChallengeTasks,
		output: HabiticaEndpointOutputSchemas.tasksListChallengeTasks,
	},
	'tasks.unlinkAllChallengeTasks': {
		input: HabiticaEndpointInputSchemas.tasksUnlinkAllChallengeTasks,
		output: HabiticaEndpointOutputSchemas.tasksUnlinkAllChallengeTasks,
	},

	'tags.create': {
		input: HabiticaEndpointInputSchemas.tagsCreate,
		output: HabiticaEndpointOutputSchemas.tagsCreate,
	},
	'tags.list': {
		input: HabiticaEndpointInputSchemas.tagsList,
		output: HabiticaEndpointOutputSchemas.tagsList,
	},
	'tags.update': {
		input: HabiticaEndpointInputSchemas.tagsUpdate,
		output: HabiticaEndpointOutputSchemas.tagsUpdate,
	},
	'tags.delete': {
		input: HabiticaEndpointInputSchemas.tagsDelete,
		output: HabiticaEndpointOutputSchemas.tagsDelete,
	},

	'challenges.create': {
		input: HabiticaEndpointInputSchemas.challengesCreate,
		output: HabiticaEndpointOutputSchemas.challengesCreate,
	},
	'challenges.get': {
		input: HabiticaEndpointInputSchemas.challengesGet,
		output: HabiticaEndpointOutputSchemas.challengesGet,
	},
	'challenges.clone': {
		input: HabiticaEndpointInputSchemas.challengesClone,
		output: HabiticaEndpointOutputSchemas.challengesClone,
	},
	'challenges.delete': {
		input: HabiticaEndpointInputSchemas.challengesDelete,
		output: HabiticaEndpointOutputSchemas.challengesDelete,
	},
	'challenges.join': {
		input: HabiticaEndpointInputSchemas.challengesJoin,
		output: HabiticaEndpointOutputSchemas.challengesJoin,
	},
	'challenges.leave': {
		input: HabiticaEndpointInputSchemas.challengesLeave,
		output: HabiticaEndpointOutputSchemas.challengesLeave,
	},
	'challenges.listByGroup': {
		input: HabiticaEndpointInputSchemas.challengesListByGroup,
		output: HabiticaEndpointOutputSchemas.challengesListByGroup,
	},
	'challenges.listForUser': {
		input: HabiticaEndpointInputSchemas.challengesListForUser,
		output: HabiticaEndpointOutputSchemas.challengesListForUser,
	},
	'challenges.exportCsv': {
		input: HabiticaEndpointInputSchemas.challengesExportCsv,
		output: HabiticaEndpointOutputSchemas.challengesExportCsv,
	},

	'groups.create': {
		input: HabiticaEndpointInputSchemas.groupsCreate,
		output: HabiticaEndpointOutputSchemas.groupsCreate,
	},
	'groups.list': {
		input: HabiticaEndpointInputSchemas.groupsList,
		output: HabiticaEndpointOutputSchemas.groupsList,
	},
	'groups.get': {
		input: HabiticaEndpointInputSchemas.groupsGet,
		output: HabiticaEndpointOutputSchemas.groupsGet,
	},
	'groups.getParty': {
		input: HabiticaEndpointInputSchemas.groupsGetParty,
		output: HabiticaEndpointOutputSchemas.groupsGetParty,
	},
	'groups.getTavern': {
		input: HabiticaEndpointInputSchemas.groupsGetTavern,
		output: HabiticaEndpointOutputSchemas.groupsGetTavern,
	},
	'groups.update': {
		input: HabiticaEndpointInputSchemas.groupsUpdate,
		output: HabiticaEndpointOutputSchemas.groupsUpdate,
	},
	'groups.leave': {
		input: HabiticaEndpointInputSchemas.groupsLeave,
		output: HabiticaEndpointOutputSchemas.groupsLeave,
	},
	'groups.listMembers': {
		input: HabiticaEndpointInputSchemas.groupsListMembers,
		output: HabiticaEndpointOutputSchemas.groupsListMembers,
	},
	'groups.invite': {
		input: HabiticaEndpointInputSchemas.groupsInvite,
		output: HabiticaEndpointOutputSchemas.groupsInvite,
	},
	'groups.removeMember': {
		input: HabiticaEndpointInputSchemas.groupsRemoveMember,
		output: HabiticaEndpointOutputSchemas.groupsRemoveMember,
	},
	'groups.inviteToQuest': {
		input: HabiticaEndpointInputSchemas.groupsInviteToQuest,
		output: HabiticaEndpointOutputSchemas.groupsInviteToQuest,
	},

	'chat.list': {
		input: HabiticaEndpointInputSchemas.chatList,
		output: HabiticaEndpointOutputSchemas.chatList,
	},
	'chat.deleteMessage': {
		input: HabiticaEndpointInputSchemas.chatDeleteMessage,
		output: HabiticaEndpointOutputSchemas.chatDeleteMessage,
	},
	'chat.markSeen': {
		input: HabiticaEndpointInputSchemas.chatMarkSeen,
		output: HabiticaEndpointOutputSchemas.chatMarkSeen,
	},

	'user.get': {
		input: HabiticaEndpointInputSchemas.userGet,
		output: HabiticaEndpointOutputSchemas.userGet,
	},
	'user.update': {
		input: HabiticaEndpointInputSchemas.userUpdate,
		output: HabiticaEndpointOutputSchemas.userUpdate,
	},
	'user.reset': {
		input: HabiticaEndpointInputSchemas.userReset,
		output: HabiticaEndpointOutputSchemas.userReset,
	},
	'user.equip': {
		input: HabiticaEndpointInputSchemas.userEquip,
		output: HabiticaEndpointOutputSchemas.userEquip,
	},
	'user.readCard': {
		input: HabiticaEndpointInputSchemas.userReadCard,
		output: HabiticaEndpointOutputSchemas.userReadCard,
	},
	'user.movePinnedItem': {
		input: HabiticaEndpointInputSchemas.userMovePinnedItem,
		output: HabiticaEndpointOutputSchemas.userMovePinnedItem,
	},
	'user.deleteMessage': {
		input: HabiticaEndpointInputSchemas.userDeleteMessage,
		output: HabiticaEndpointOutputSchemas.userDeleteMessage,
	},
	'user.addPushDevice': {
		input: HabiticaEndpointInputSchemas.userAddPushDevice,
		output: HabiticaEndpointOutputSchemas.userAddPushDevice,
	},
	'user.deletePushDevice': {
		input: HabiticaEndpointInputSchemas.userDeletePushDevice,
		output: HabiticaEndpointOutputSchemas.userDeletePushDevice,
	},
	'user.markNotificationSeen': {
		input: HabiticaEndpointInputSchemas.userMarkNotificationSeen,
		output: HabiticaEndpointOutputSchemas.userMarkNotificationSeen,
	},
	'user.markNotificationsSeen': {
		input: HabiticaEndpointInputSchemas.userMarkNotificationsSeen,
		output: HabiticaEndpointOutputSchemas.userMarkNotificationsSeen,
	},

	'auth.register': {
		input: HabiticaEndpointInputSchemas.authRegister,
		output: HabiticaEndpointOutputSchemas.authRegister,
	},
	'auth.login': {
		input: HabiticaEndpointInputSchemas.authLogin,
		output: HabiticaEndpointOutputSchemas.authLogin,
	},
	'auth.social': {
		input: HabiticaEndpointInputSchemas.authSocial,
		output: HabiticaEndpointOutputSchemas.authSocial,
	},

	'webhooks.create': {
		input: HabiticaEndpointInputSchemas.webhooksCreate,
		output: HabiticaEndpointOutputSchemas.webhooksCreate,
	},
	'webhooks.list': {
		input: HabiticaEndpointInputSchemas.webhooksList,
		output: HabiticaEndpointOutputSchemas.webhooksList,
	},
	'webhooks.subscribe': {
		input: HabiticaEndpointInputSchemas.webhooksSubscribe,
		output: HabiticaEndpointOutputSchemas.webhooksSubscribe,
	},

	'content.get': {
		input: HabiticaEndpointInputSchemas.contentGet,
		output: HabiticaEndpointOutputSchemas.contentGet,
	},
	'content.getByType': {
		input: HabiticaEndpointInputSchemas.contentGetByType,
		output: HabiticaEndpointOutputSchemas.contentGetByType,
	},
	'content.status': {
		input: HabiticaEndpointInputSchemas.status,
		output: HabiticaEndpointOutputSchemas.status,
	},
	'content.worldState': {
		input: HabiticaEndpointInputSchemas.worldState,
		output: HabiticaEndpointOutputSchemas.worldState,
	},
	'content.modelPaths': {
		input: HabiticaEndpointInputSchemas.modelPaths,
		output: HabiticaEndpointOutputSchemas.modelPaths,
	},
	'content.news': {
		input: HabiticaEndpointInputSchemas.newsGet,
		output: HabiticaEndpointOutputSchemas.newsGet,
	},
	'content.dismissNews': {
		input: HabiticaEndpointInputSchemas.newsDismiss,
		output: HabiticaEndpointOutputSchemas.newsDismiss,
	},
	'content.marketGear': {
		input: HabiticaEndpointInputSchemas.shopsMarketGear,
		output: HabiticaEndpointOutputSchemas.shopsMarketGear,
	},
	'content.timeTravelers': {
		input: HabiticaEndpointInputSchemas.shopsTimeTravelers,
		output: HabiticaEndpointOutputSchemas.shopsTimeTravelers,
	},
	'content.validateCoupon': {
		input: HabiticaEndpointInputSchemas.validateCoupon,
		output: HabiticaEndpointOutputSchemas.validateCoupon,
	},

	'exports.userData': {
		input: HabiticaEndpointInputSchemas.exportUserData,
		output: HabiticaEndpointOutputSchemas.exportUserData,
	},
	'exports.history': {
		input: HabiticaEndpointInputSchemas.exportHistoryCsv,
		output: HabiticaEndpointOutputSchemas.exportHistoryCsv,
	},
	'exports.inbox': {
		input: HabiticaEndpointInputSchemas.exportInboxHtml,
		output: HabiticaEndpointOutputSchemas.exportInboxHtml,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof habiticaEndpointsNested
>;

// `satisfies` rather than an annotation: `const x: AuthTypes = 'api_key'`
// widens the inferred type to the whole union, so `typeof defaultAuthType`
// would reach `BaseHabiticaPlugin` as `AuthTypes` instead of `'api_key'`.
const defaultAuthType = 'api_key' as const satisfies AuthTypes;

/**
 * Risk levels.
 *
 * `read` for anything that only fetches. `write` for anything that changes
 * state and can be undone or repeated without loss. `destructive` is reserved
 * for the three operations that remove data Habitica cannot restore - it
 * hard-deletes, with no soft-delete flag and no trash - plus the account reset.
 *
 * `tasks.score` is `write` rather than `read` despite looking like a read of
 * stats: it is the one operation whose replay changes the outcome rather than
 * repeating it, since scoring twice scores twice.
 */
export const habiticaEndpointMeta = {
	'tasks.create': {
		riskLevel: 'write',
		description: 'Create a habit, daily, todo or reward',
	},
	'tasks.list': { riskLevel: 'read', description: "List the account's tasks" },
	'tasks.get': { riskLevel: 'read', description: 'Retrieve any task by id' },
	'tasks.update': { riskLevel: 'write', description: 'Update a task' },
	'tasks.delete': {
		riskLevel: 'destructive',
		description: 'Permanently delete a task',
	},
	'tasks.score': { riskLevel: 'write', description: 'Score a task up or down' },
	'tasks.move': {
		riskLevel: 'write',
		description: 'Move a task to a position in its list',
	},
	'tasks.updateChecklistItem': {
		riskLevel: 'write',
		description: "Update a checklist item's text",
	},
	'tasks.deleteChecklistItem': {
		riskLevel: 'write',
		description: 'Remove a checklist item from a task',
	},
	'tasks.addTag': {
		riskLevel: 'write',
		description: 'Apply an existing tag to a task',
	},
	'tasks.createChallengeTask': {
		riskLevel: 'write',
		description: 'Add a task to a challenge',
	},
	'tasks.listChallengeTasks': {
		riskLevel: 'read',
		description: "List a challenge's tasks",
	},
	'tasks.unlinkAllChallengeTasks': {
		riskLevel: 'destructive',
		description:
			"Unlink every task of a challenge, optionally deleting members' copies",
	},

	'tags.create': { riskLevel: 'write', description: 'Create a tag' },
	'tags.list': {
		riskLevel: 'read',
		description: 'List every tag on the account',
	},
	'tags.update': { riskLevel: 'write', description: 'Rename a tag' },
	'tags.delete': {
		riskLevel: 'destructive',
		description: 'Permanently delete a tag',
	},

	'challenges.create': {
		riskLevel: 'write',
		description: 'Create a challenge in a group',
	},
	'challenges.get': { riskLevel: 'read', description: 'Retrieve a challenge' },
	'challenges.clone': {
		riskLevel: 'write',
		description: 'Duplicate a challenge',
	},
	'challenges.delete': {
		riskLevel: 'destructive',
		description: 'Permanently delete a challenge and its tasks',
	},
	'challenges.join': { riskLevel: 'write', description: 'Join a challenge' },
	'challenges.leave': { riskLevel: 'write', description: 'Leave a challenge' },
	'challenges.listByGroup': {
		riskLevel: 'read',
		description: "List a group's challenges",
	},
	'challenges.listForUser': {
		riskLevel: 'read',
		description: 'List the challenges the account takes part in',
	},
	'challenges.exportCsv': {
		riskLevel: 'read',
		description: 'Export a challenge as CSV',
	},

	'groups.create': {
		riskLevel: 'write',
		description: 'Create a party or guild',
	},
	'groups.list': { riskLevel: 'read', description: 'List groups by type' },
	'groups.get': { riskLevel: 'read', description: 'Retrieve a group by id' },
	'groups.getParty': {
		riskLevel: 'read',
		description: "Retrieve the account's party",
	},
	'groups.getTavern': { riskLevel: 'read', description: 'Retrieve the Tavern' },
	'groups.update': {
		riskLevel: 'write',
		description: "Update a group's properties",
	},
	'groups.leave': { riskLevel: 'write', description: 'Leave a group' },
	'groups.listMembers': {
		riskLevel: 'read',
		description: "List a group's members",
	},
	'groups.invite': {
		riskLevel: 'write',
		description: 'Invite people to a group',
	},
	'groups.removeMember': {
		riskLevel: 'write',
		description: 'Remove a member from the party',
	},
	'groups.inviteToQuest': {
		riskLevel: 'write',
		description: 'Invite the party to a quest',
	},

	'chat.list': {
		riskLevel: 'read',
		description: "Read a group's chat messages",
	},
	'chat.deleteMessage': {
		riskLevel: 'destructive',
		description: 'Permanently delete a chat message',
	},
	'chat.markSeen': {
		riskLevel: 'write',
		description: "Mark a group's chat as read",
	},

	'user.get': {
		riskLevel: 'read',
		description: "Read the account's user document",
	},
	'user.update': {
		riskLevel: 'write',
		description: 'Update user fields by dot path',
	},
	'user.reset': {
		riskLevel: 'destructive',
		description:
			'Reset the account, deleting every task and returning to level 1',
	},
	'user.equip': {
		riskLevel: 'write',
		description: 'Equip or unequip gear, a pet, a mount or a costume',
	},
	'user.readCard': {
		riskLevel: 'write',
		description: 'Mark a received card as read',
	},
	'user.movePinnedItem': {
		riskLevel: 'write',
		description: 'Reorder a pinned reward',
	},
	'user.deleteMessage': {
		riskLevel: 'destructive',
		description: 'Permanently delete an inbox message',
	},
	'user.addPushDevice': {
		riskLevel: 'write',
		description: 'Register a push-notification device',
	},
	'user.deletePushDevice': {
		riskLevel: 'write',
		description: 'Unregister a push-notification device',
	},
	'user.markNotificationSeen': {
		riskLevel: 'write',
		description: 'Mark one notification as seen',
	},
	'user.markNotificationsSeen': {
		riskLevel: 'write',
		description: 'Mark several notifications as seen',
	},

	'auth.register': {
		riskLevel: 'write',
		description: 'Register a new Habitica account and mint its credential',
	},
	'auth.login': {
		riskLevel: 'read',
		description: 'Exchange a password for an API token',
	},
	'auth.social': {
		riskLevel: 'read',
		description: 'Authenticate through a social provider',
	},

	'webhooks.create': {
		riskLevel: 'write',
		description: 'Register an outbound webhook',
	},
	'webhooks.list': {
		riskLevel: 'read',
		description: "List the account's outbound webhooks",
	},
	'webhooks.subscribe': {
		riskLevel: 'write',
		description: 'Enable an existing webhook',
	},

	'content.get': {
		riskLevel: 'read',
		description: 'Fetch the whole game content catalogue',
	},
	'content.getByType': {
		riskLevel: 'read',
		description: 'Fetch the content catalogue with named categories EXCLUDED',
	},
	'content.status': {
		riskLevel: 'read',
		description: 'Check that the Habitica API is up',
	},
	'content.worldState': {
		riskLevel: 'read',
		description: 'Read world events and the world boss',
	},
	'content.modelPaths': {
		riskLevel: 'read',
		description: "List a model's field paths and types",
	},
	'content.news': {
		riskLevel: 'read',
		description: 'Read the latest Bailey announcement',
	},
	'content.dismissNews': {
		riskLevel: 'write',
		description: 'Dismiss the current announcement',
	},
	'content.marketGear': {
		riskLevel: 'read',
		description: 'List gear for sale in the market',
	},
	'content.timeTravelers': {
		riskLevel: 'read',
		description: 'List the Time Travellers shop stock',
	},
	'content.validateCoupon': {
		riskLevel: 'read',
		description: 'Check whether a coupon code is valid',
	},

	'exports.userData': {
		riskLevel: 'read',
		description:
			'Export the whole account as JSON (contains the account email)',
	},
	'exports.history': {
		riskLevel: 'read',
		description: 'Export task history as CSV',
	},
	'exports.inbox': {
		riskLevel: 'read',
		description: 'Export the inbox as HTML',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof habiticaEndpointsNested>;

export type BaseHabiticaPlugin<T extends HabiticaPluginOptions> = CorsairPlugin<
	'habitica',
	typeof HabiticaSchema,
	typeof habiticaEndpointsNested,
	Record<string, never>,
	T,
	typeof defaultAuthType
>;

export type InternalHabiticaPlugin = BaseHabiticaPlugin<HabiticaPluginOptions>;

export type ExternalHabiticaPlugin<T extends HabiticaPluginOptions> =
	BaseHabiticaPlugin<T>;

/**
 * The Habitica plugin.
 *
 * **No webhooks.** The catalog lists no triggers for Habitica, and the three
 * webhook operations it does list are the user's own outbound webhooks -
 * Habitica calling a URL of their choosing - not events delivered to Corsair.
 * So this plugin registers no webhook handlers, no matcher and no tenant
 * resolver, and the scaffold's webhook files were removed rather than left as
 * empty stubs that would imply a surface that does not exist.
 */
export function habitica<const T extends HabiticaPluginOptions>(
	incomingOptions: HabiticaPluginOptions & T = {} as HabiticaPluginOptions & T,
): ExternalHabiticaPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'habitica',
		authConfig: habiticaAuthConfig,
		schema: HabiticaSchema,
		options: options,
		hooks: options.hooks,
		endpoints: habiticaEndpointsNested,
		webhooks: {},
		endpointMeta: habiticaEndpointMeta,
		endpointSchemas: habiticaEndpointSchemas,
		webhookSchemas: {},
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: HabiticaKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				return res ?? '';
			}

			return '';
		},
	} satisfies InternalHabiticaPlugin;
}

export type {
	HabiticaEndpointInputs,
	HabiticaEndpointOutputs,
} from './endpoints/types';
