import type {
	AuthTypes,
	BindEndpoints,
	BindWebhooks,
	CorsairEndpoint,
	CorsairErrorHandler,
	CorsairPlugin,
	CorsairPluginContext,
	CorsairWebhook,
	KeyBuilderContext,
	PickAuth,
	PluginAuthConfig,
	PluginPermissionsConfig,
	RequiredPluginEndpointMeta,
	RequiredPluginEndpointSchemas,
	RequiredPluginWebhookSchemas,
} from 'corsair/core';
import { AuthMissingError } from 'corsair/core';
import {
	Accounts,
	ApiKeys,
	Auth,
	CalendarEvents,
	Calendars,
	Chats,
	Contacts,
	Drafts,
	Emails,
	Folders,
	Inboxes,
	LinkedIn,
	Messages,
	Posts,
	RelationRequests,
	SalesNavigator,
	Scopes,
	Users,
	WebhookEndpoints,
	WebhookEvents,
} from './endpoints';
import { unipileEndpointMeta as endpointMeta } from './endpoints/meta';
import type {
	UnipileEndpointInputs,
	UnipileEndpointOutputs,
} from './endpoints/types';
import {
	UnipileEndpointInputSchemas,
	UnipileEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';
import { UnipileSchema } from './schema';
import {
	AccountWebhooks,
	CalendarEventWebhooks,
	CalendarWebhooks,
	ChatWebhooks,
	EmailDraftWebhooks,
	EmailFolderWebhooks,
	EmailWebhooks,
	FollowerWebhooks,
	MessageWebhooks,
	matchUnipilePluginWebhook,
	matchUnipileTenantWebhook,
	RelationWebhooks,
	TrackingWebhooks,
} from './webhooks';
import type { UnipileWebhookOutputs } from './webhooks/types';
import {
	AccountAddEventSchema,
	AccountInitialSyncCompletedEventSchema,
	AccountInitialSyncFailedEventSchema,
	AccountInitialSyncRunningEventSchema,
	AccountLockedEventSchema,
	AccountReconnectEventSchema,
	AccountRemoveEventSchema,
	AccountStatusDegradedEventSchema,
	AccountStatusDisconnectedEventSchema,
	AccountStatusErroredEventSchema,
	AccountStatusPartialEventSchema,
	AccountStatusRunningEventSchema,
	AccountUnlockedEventSchema,
	CalendarCreateEventSchema,
	CalendarDeleteEventSchema,
	CalendarEventDeleteEventSchema,
	CalendarEventNewEventSchema,
	CalendarEventUpdateEventSchema,
	CalendarUpdateEventSchema,
	ChatDeleteEventSchema,
	ChatUpdateEventSchema,
	EmailBounceEventSchema,
	EmailDeleteEventSchema,
	EmailDraftDeleteEventSchema,
	EmailDraftNewEventSchema,
	EmailFolderCreateEventSchema,
	EmailFolderDeleteEventSchema,
	EmailFolderUpdateEventSchema,
	EmailNewEventSchema,
	FollowerNewEventSchema,
	MessageDeleteEventSchema,
	MessageNewEventSchema,
	MessageReactionDeleteEventSchema,
	MessageReactionNewEventSchema,
	MessageReceiptDeliveryEventSchema,
	MessageReceiptReadEventSchema,
	MessageUpdateEventSchema,
	RelationNewEventSchema,
	TrackingClickEventSchema,
	TrackingOpenEventSchema,
} from './webhooks/types';

export type UnipilePluginOptions = {
	authType?: PickAuth<'api_key'>;
	/** Unipile API key (sent as X-API-KEY). Overrides the stored key. */
	key?: string;
	/** Signing secret of the Unipile webhook endpoint that points at Corsair. */
	webhookSecret?: string;
	hooks?: InternalUnipilePlugin['hooks'];
	webhookHooks?: InternalUnipilePlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof unipileEndpointsNested>;
};

export type UnipileContext = CorsairPluginContext<
	typeof UnipileSchema,
	UnipilePluginOptions
>;

export type UnipileKeyBuilderContext = KeyBuilderContext<UnipilePluginOptions>;

export type UnipileBoundEndpoints = BindEndpoints<
	typeof unipileEndpointsNested
>;

type UnipileEndpoint<K extends keyof UnipileEndpointOutputs> = CorsairEndpoint<
	UnipileContext,
	UnipileEndpointInputs[K],
	UnipileEndpointOutputs[K]
>;

export type UnipileEndpoints = {
	[K in keyof UnipileEndpointOutputs]: UnipileEndpoint<K>;
};

export type UnipileWebhook<K extends keyof UnipileWebhookOutputs> =
	CorsairWebhook<
		UnipileContext,
		UnipileWebhookOutputs[K],
		UnipileWebhookOutputs[K]
	>;

export type UnipileWebhooks = {
	[K in keyof UnipileWebhookOutputs]: UnipileWebhook<K>;
};

export type UnipileBoundWebhooks = BindWebhooks<UnipileWebhooks>;

const unipileEndpointsNested = {
	accounts: {
		list: Accounts.list,
		get: Accounts.get,
		remove: Accounts.remove,
		createAuthLink: Accounts.createAuthLink,
		update: Accounts.update,
	},
	auth: {
		startIntent: Auth.startIntent,
		solveCheckpoint: Auth.solveCheckpoint,
		requestCheckpoint: Auth.requestCheckpoint,
		resendCheckpoint: Auth.resendCheckpoint,
	},
	users: {
		getProfile: Users.getProfile,
		visitProfile: Users.visitProfile,
		listRelations: Users.listRelations,
		getChat: Users.getChat,
		listReactions: Users.listReactions,
		listComments: Users.listComments,
		setPresence: Users.setPresence,
		getPresence: Users.getPresence,
		getPicture: Users.getPicture,
		updateProfile: Users.updateProfile,
		removeRelation: Users.removeRelation,
		listFollowers: Users.listFollowers,
		listFollowing: Users.listFollowing,
		follow: Users.follow,
		unfollow: Users.unfollow,
	},
	relationRequests: {
		list: RelationRequests.list,
		create: RelationRequests.create,
		cancel: RelationRequests.cancel,
		accept: RelationRequests.accept,
	},
	inboxes: {
		list: Inboxes.list,
		listChats: Inboxes.listChats,
		startChat: Inboxes.startChat,
	},
	chats: {
		list: Chats.list,
		get: Chats.get,
		start: Chats.start,
		update: Chats.update,
		delete: Chats.remove,
		getPicture: Chats.getPicture,
		listParticipants: Chats.listParticipants,
		addParticipant: Chats.addParticipant,
		removeParticipant: Chats.removeParticipant,
		setComposing: Chats.setComposing,
	},
	messages: {
		list: Messages.list,
		send: Messages.send,
		get: Messages.get,
		delete: Messages.remove,
		forward: Messages.forward,
		edit: Messages.edit,
		markRead: Messages.markRead,
		pin: Messages.pin,
		listReactions: Messages.listReactions,
		addReaction: Messages.addReaction,
		removeReaction: Messages.removeReaction,
		getAttachment: Messages.getAttachment,
	},
	contacts: {
		list: Contacts.list,
	},
	emails: {
		list: Emails.list,
		listInFolder: Emails.listInFolder,
		getThread: Emails.getThread,
		get: Emails.get,
		trash: Emails.trash,
		getAttachment: Emails.getAttachment,
		modify: Emails.modify,
		markRead: Emails.markRead,
		markUnread: Emails.markUnread,
		send: Emails.send,
		listSenders: Emails.listSenders,
	},
	drafts: {
		list: Drafts.list,
		create: Drafts.create,
		get: Drafts.get,
		update: Drafts.update,
		delete: Drafts.remove,
		send: Drafts.send,
	},
	folders: {
		list: Folders.list,
		create: Folders.create,
		get: Folders.get,
		update: Folders.update,
		delete: Folders.remove,
	},
	calendars: {
		list: Calendars.list,
		create: Calendars.create,
		get: Calendars.get,
		update: Calendars.update,
		delete: Calendars.remove,
	},
	calendarEvents: {
		list: CalendarEvents.list,
		create: CalendarEvents.create,
		get: CalendarEvents.get,
		update: CalendarEvents.update,
		delete: CalendarEvents.remove,
		respond: CalendarEvents.respond,
		cancel: CalendarEvents.cancel,
		restore: CalendarEvents.restore,
	},
	posts: {
		list: Posts.list,
		listReactions: Posts.listReactions,
		listComments: Posts.listComments,
		get: Posts.get,
		create: Posts.create,
		update: Posts.update,
		delete: Posts.remove,
		createStory: Posts.createStory,
		addReaction: Posts.addReaction,
		removeReaction: Posts.removeReaction,
		addComment: Posts.addComment,
		updateComment: Posts.updateComment,
		deleteComment: Posts.deleteComment,
		replyToComment: Posts.replyToComment,
		listCommentReplies: Posts.listCommentReplies,
		listCommentReactions: Posts.listCommentReactions,
		addCommentReaction: Posts.addCommentReaction,
		removeCommentReaction: Posts.removeCommentReaction,
	},
	linkedin: {
		getInmailCredits: LinkedIn.getInmailCredits,
		listContracts: LinkedIn.listContracts,
		selectContract: LinkedIn.selectContract,
		listProfileViews: LinkedIn.listProfileViews,
		getCompany: LinkedIn.getCompany,
		listManagedCompanyPages: LinkedIn.listManagedCompanyPages,
		inviteToFollowCompany: LinkedIn.inviteToFollowCompany,
		getCompanyFollowCredits: LinkedIn.getCompanyFollowCredits,
		endorseSkill: LinkedIn.endorseSkill,
		request: LinkedIn.request,
		getSearchParameters: LinkedIn.getSearchParameters,
		searchFromUrl: LinkedIn.searchFromUrl,
		searchPeople: LinkedIn.searchPeople,
		searchCompanies: LinkedIn.searchCompanies,
		searchPosts: LinkedIn.searchPosts,
		searchJobs: LinkedIn.searchJobs,
	},
	salesNavigator: {
		getSearchParameters: SalesNavigator.getSearchParameters,
		searchFromUrl: SalesNavigator.searchFromUrl,
		searchPeople: SalesNavigator.searchPeople,
		searchCompanies: SalesNavigator.searchCompanies,
		listLeadLists: SalesNavigator.listLeadLists,
		browseLeadList: SalesNavigator.browseLeadList,
		saveLead: SalesNavigator.saveLead,
		listAccountLists: SalesNavigator.listAccountLists,
		browseAccountList: SalesNavigator.browseAccountList,
		saveAccount: SalesNavigator.saveAccount,
	},
	scopes: {
		list: Scopes.list,
		create: Scopes.create,
		get: Scopes.get,
		update: Scopes.update,
		delete: Scopes.remove,
	},
	apiKeys: {
		list: ApiKeys.list,
		create: ApiKeys.create,
		delete: ApiKeys.remove,
	},
	webhookEndpoints: {
		list: WebhookEndpoints.list,
		get: WebhookEndpoints.get,
		create: WebhookEndpoints.create,
		update: WebhookEndpoints.update,
		delete: WebhookEndpoints.remove,
	},
	webhookEvents: {
		listDeliveries: WebhookEvents.listDeliveries,
		replay: WebhookEvents.replay,
	},
} as const;

const unipileWebhooksNested = {
	relations: RelationWebhooks,
	followers: FollowerWebhooks,
	messages: MessageWebhooks,
	chats: ChatWebhooks,
	accounts: AccountWebhooks,
	emails: EmailWebhooks,
	emailDrafts: EmailDraftWebhooks,
	emailFolders: EmailFolderWebhooks,
	calendars: CalendarWebhooks,
	calendarEvents: CalendarEventWebhooks,
	tracking: TrackingWebhooks,
} as const;

export const unipileEndpointSchemas = {
	'accounts.list': {
		input: UnipileEndpointInputSchemas.accountsList,
		output: UnipileEndpointOutputSchemas.accountsList,
	},
	'accounts.get': {
		input: UnipileEndpointInputSchemas.accountsGet,
		output: UnipileEndpointOutputSchemas.accountsGet,
	},
	'accounts.remove': {
		input: UnipileEndpointInputSchemas.accountsRemove,
		output: UnipileEndpointOutputSchemas.accountsRemove,
	},
	'accounts.createAuthLink': {
		input: UnipileEndpointInputSchemas.accountsCreateAuthLink,
		output: UnipileEndpointOutputSchemas.accountsCreateAuthLink,
	},
	'users.getProfile': {
		input: UnipileEndpointInputSchemas.usersGetProfile,
		output: UnipileEndpointOutputSchemas.usersGetProfile,
	},
	'users.visitProfile': {
		input: UnipileEndpointInputSchemas.usersVisitProfile,
		output: UnipileEndpointOutputSchemas.usersVisitProfile,
	},
	'users.listRelations': {
		input: UnipileEndpointInputSchemas.usersListRelations,
		output: UnipileEndpointOutputSchemas.usersListRelations,
	},
	'users.getChat': {
		input: UnipileEndpointInputSchemas.usersGetChat,
		output: UnipileEndpointOutputSchemas.usersGetChat,
	},
	'users.listReactions': {
		input: UnipileEndpointInputSchemas.usersListReactions,
		output: UnipileEndpointOutputSchemas.usersListReactions,
	},
	'users.listComments': {
		input: UnipileEndpointInputSchemas.usersListComments,
		output: UnipileEndpointOutputSchemas.usersListComments,
	},
	'relationRequests.list': {
		input: UnipileEndpointInputSchemas.relationRequestsList,
		output: UnipileEndpointOutputSchemas.relationRequestsList,
	},
	'relationRequests.create': {
		input: UnipileEndpointInputSchemas.relationRequestsCreate,
		output: UnipileEndpointOutputSchemas.relationRequestsCreate,
	},
	'relationRequests.cancel': {
		input: UnipileEndpointInputSchemas.relationRequestsCancel,
		output: UnipileEndpointOutputSchemas.relationRequestsCancel,
	},
	'relationRequests.accept': {
		input: UnipileEndpointInputSchemas.relationRequestsAccept,
		output: UnipileEndpointOutputSchemas.relationRequestsAccept,
	},
	'chats.list': {
		input: UnipileEndpointInputSchemas.chatsList,
		output: UnipileEndpointOutputSchemas.chatsList,
	},
	'chats.get': {
		input: UnipileEndpointInputSchemas.chatsGet,
		output: UnipileEndpointOutputSchemas.chatsGet,
	},
	'chats.start': {
		input: UnipileEndpointInputSchemas.chatsStart,
		output: UnipileEndpointOutputSchemas.chatsStart,
	},
	'messages.list': {
		input: UnipileEndpointInputSchemas.messagesList,
		output: UnipileEndpointOutputSchemas.messagesList,
	},
	'messages.send': {
		input: UnipileEndpointInputSchemas.messagesSend,
		output: UnipileEndpointOutputSchemas.messagesSend,
	},
	'posts.list': {
		input: UnipileEndpointInputSchemas.postsList,
		output: UnipileEndpointOutputSchemas.postsList,
	},
	'posts.listReactions': {
		input: UnipileEndpointInputSchemas.postsListReactions,
		output: UnipileEndpointOutputSchemas.postsListReactions,
	},
	'posts.listComments': {
		input: UnipileEndpointInputSchemas.postsListComments,
		output: UnipileEndpointOutputSchemas.postsListComments,
	},
	'webhookEndpoints.list': {
		input: UnipileEndpointInputSchemas.webhookEndpointsList,
		output: UnipileEndpointOutputSchemas.webhookEndpointsList,
	},
	'webhookEndpoints.get': {
		input: UnipileEndpointInputSchemas.webhookEndpointsGet,
		output: UnipileEndpointOutputSchemas.webhookEndpointsGet,
	},
	'webhookEndpoints.create': {
		input: UnipileEndpointInputSchemas.webhookEndpointsCreate,
		output: UnipileEndpointOutputSchemas.webhookEndpointsCreate,
	},
	'webhookEndpoints.update': {
		input: UnipileEndpointInputSchemas.webhookEndpointsUpdate,
		output: UnipileEndpointOutputSchemas.webhookEndpointsUpdate,
	},
	'webhookEndpoints.delete': {
		input: UnipileEndpointInputSchemas.webhookEndpointsDelete,
		output: UnipileEndpointOutputSchemas.webhookEndpointsDelete,
	},
	'inboxes.list': {
		input: UnipileEndpointInputSchemas.inboxesList,
		output: UnipileEndpointOutputSchemas.inboxesList,
	},
	'inboxes.listChats': {
		input: UnipileEndpointInputSchemas.inboxesListChats,
		output: UnipileEndpointOutputSchemas.inboxesListChats,
	},
	'inboxes.startChat': {
		input: UnipileEndpointInputSchemas.inboxesStartChat,
		output: UnipileEndpointOutputSchemas.inboxesStartChat,
	},
	'chats.update': {
		input: UnipileEndpointInputSchemas.chatsUpdate,
		output: UnipileEndpointOutputSchemas.chatsUpdate,
	},
	'chats.delete': {
		input: UnipileEndpointInputSchemas.chatsDelete,
		output: UnipileEndpointOutputSchemas.chatsDelete,
	},
	'chats.getPicture': {
		input: UnipileEndpointInputSchemas.chatsGetPicture,
		output: UnipileEndpointOutputSchemas.chatsGetPicture,
	},
	'chats.listParticipants': {
		input: UnipileEndpointInputSchemas.chatsListParticipants,
		output: UnipileEndpointOutputSchemas.chatsListParticipants,
	},
	'chats.addParticipant': {
		input: UnipileEndpointInputSchemas.chatsAddParticipant,
		output: UnipileEndpointOutputSchemas.chatsAddParticipant,
	},
	'chats.removeParticipant': {
		input: UnipileEndpointInputSchemas.chatsRemoveParticipant,
		output: UnipileEndpointOutputSchemas.chatsRemoveParticipant,
	},
	'chats.setComposing': {
		input: UnipileEndpointInputSchemas.chatsSetComposing,
		output: UnipileEndpointOutputSchemas.chatsSetComposing,
	},
	'messages.get': {
		input: UnipileEndpointInputSchemas.messagesGet,
		output: UnipileEndpointOutputSchemas.messagesGet,
	},
	'messages.delete': {
		input: UnipileEndpointInputSchemas.messagesDelete,
		output: UnipileEndpointOutputSchemas.messagesDelete,
	},
	'messages.forward': {
		input: UnipileEndpointInputSchemas.messagesForward,
		output: UnipileEndpointOutputSchemas.messagesForward,
	},
	'messages.edit': {
		input: UnipileEndpointInputSchemas.messagesEdit,
		output: UnipileEndpointOutputSchemas.messagesEdit,
	},
	'messages.markRead': {
		input: UnipileEndpointInputSchemas.messagesMarkRead,
		output: UnipileEndpointOutputSchemas.messagesMarkRead,
	},
	'messages.pin': {
		input: UnipileEndpointInputSchemas.messagesPin,
		output: UnipileEndpointOutputSchemas.messagesPin,
	},
	'messages.listReactions': {
		input: UnipileEndpointInputSchemas.messagesListReactions,
		output: UnipileEndpointOutputSchemas.messagesListReactions,
	},
	'messages.addReaction': {
		input: UnipileEndpointInputSchemas.messagesAddReaction,
		output: UnipileEndpointOutputSchemas.messagesAddReaction,
	},
	'messages.removeReaction': {
		input: UnipileEndpointInputSchemas.messagesRemoveReaction,
		output: UnipileEndpointOutputSchemas.messagesRemoveReaction,
	},
	'messages.getAttachment': {
		input: UnipileEndpointInputSchemas.messagesGetAttachment,
		output: UnipileEndpointOutputSchemas.messagesGetAttachment,
	},
	'contacts.list': {
		input: UnipileEndpointInputSchemas.contactsList,
		output: UnipileEndpointOutputSchemas.contactsList,
	},
	'users.setPresence': {
		input: UnipileEndpointInputSchemas.usersSetPresence,
		output: UnipileEndpointOutputSchemas.usersSetPresence,
	},
	'users.getPresence': {
		input: UnipileEndpointInputSchemas.usersGetPresence,
		output: UnipileEndpointOutputSchemas.usersGetPresence,
	},
	'users.getPicture': {
		input: UnipileEndpointInputSchemas.usersGetPicture,
		output: UnipileEndpointOutputSchemas.usersGetPicture,
	},
	'users.updateProfile': {
		input: UnipileEndpointInputSchemas.usersUpdateProfile,
		output: UnipileEndpointOutputSchemas.usersUpdateProfile,
	},
	'users.removeRelation': {
		input: UnipileEndpointInputSchemas.usersRemoveRelation,
		output: UnipileEndpointOutputSchemas.usersRemoveRelation,
	},
	'users.listFollowers': {
		input: UnipileEndpointInputSchemas.usersListFollowers,
		output: UnipileEndpointOutputSchemas.usersListFollowers,
	},
	'users.listFollowing': {
		input: UnipileEndpointInputSchemas.usersListFollowing,
		output: UnipileEndpointOutputSchemas.usersListFollowing,
	},
	'users.follow': {
		input: UnipileEndpointInputSchemas.usersFollow,
		output: UnipileEndpointOutputSchemas.usersFollow,
	},
	'users.unfollow': {
		input: UnipileEndpointInputSchemas.usersUnfollow,
		output: UnipileEndpointOutputSchemas.usersUnfollow,
	},
	'emails.list': {
		input: UnipileEndpointInputSchemas.emailsList,
		output: UnipileEndpointOutputSchemas.emailsList,
	},
	'emails.listInFolder': {
		input: UnipileEndpointInputSchemas.emailsListInFolder,
		output: UnipileEndpointOutputSchemas.emailsListInFolder,
	},
	'emails.getThread': {
		input: UnipileEndpointInputSchemas.emailsGetThread,
		output: UnipileEndpointOutputSchemas.emailsGetThread,
	},
	'emails.get': {
		input: UnipileEndpointInputSchemas.emailsGet,
		output: UnipileEndpointOutputSchemas.emailsGet,
	},
	'emails.trash': {
		input: UnipileEndpointInputSchemas.emailsTrash,
		output: UnipileEndpointOutputSchemas.emailsTrash,
	},
	'emails.getAttachment': {
		input: UnipileEndpointInputSchemas.emailsGetAttachment,
		output: UnipileEndpointOutputSchemas.emailsGetAttachment,
	},
	'emails.modify': {
		input: UnipileEndpointInputSchemas.emailsModify,
		output: UnipileEndpointOutputSchemas.emailsModify,
	},
	'emails.markRead': {
		input: UnipileEndpointInputSchemas.emailsMarkRead,
		output: UnipileEndpointOutputSchemas.emailsMarkRead,
	},
	'emails.markUnread': {
		input: UnipileEndpointInputSchemas.emailsMarkUnread,
		output: UnipileEndpointOutputSchemas.emailsMarkUnread,
	},
	'emails.send': {
		input: UnipileEndpointInputSchemas.emailsSend,
		output: UnipileEndpointOutputSchemas.emailsSend,
	},
	'emails.listSenders': {
		input: UnipileEndpointInputSchemas.emailsListSenders,
		output: UnipileEndpointOutputSchemas.emailsListSenders,
	},
	'drafts.list': {
		input: UnipileEndpointInputSchemas.draftsList,
		output: UnipileEndpointOutputSchemas.draftsList,
	},
	'drafts.create': {
		input: UnipileEndpointInputSchemas.draftsCreate,
		output: UnipileEndpointOutputSchemas.draftsCreate,
	},
	'drafts.get': {
		input: UnipileEndpointInputSchemas.draftsGet,
		output: UnipileEndpointOutputSchemas.draftsGet,
	},
	'drafts.update': {
		input: UnipileEndpointInputSchemas.draftsUpdate,
		output: UnipileEndpointOutputSchemas.draftsUpdate,
	},
	'drafts.delete': {
		input: UnipileEndpointInputSchemas.draftsDelete,
		output: UnipileEndpointOutputSchemas.draftsDelete,
	},
	'drafts.send': {
		input: UnipileEndpointInputSchemas.draftsSend,
		output: UnipileEndpointOutputSchemas.draftsSend,
	},
	'folders.list': {
		input: UnipileEndpointInputSchemas.foldersList,
		output: UnipileEndpointOutputSchemas.foldersList,
	},
	'folders.create': {
		input: UnipileEndpointInputSchemas.foldersCreate,
		output: UnipileEndpointOutputSchemas.foldersCreate,
	},
	'folders.get': {
		input: UnipileEndpointInputSchemas.foldersGet,
		output: UnipileEndpointOutputSchemas.foldersGet,
	},
	'folders.update': {
		input: UnipileEndpointInputSchemas.foldersUpdate,
		output: UnipileEndpointOutputSchemas.foldersUpdate,
	},
	'folders.delete': {
		input: UnipileEndpointInputSchemas.foldersDelete,
		output: UnipileEndpointOutputSchemas.foldersDelete,
	},
	'calendars.list': {
		input: UnipileEndpointInputSchemas.calendarsList,
		output: UnipileEndpointOutputSchemas.calendarsList,
	},
	'calendars.create': {
		input: UnipileEndpointInputSchemas.calendarsCreate,
		output: UnipileEndpointOutputSchemas.calendarsCreate,
	},
	'calendars.get': {
		input: UnipileEndpointInputSchemas.calendarsGet,
		output: UnipileEndpointOutputSchemas.calendarsGet,
	},
	'calendars.update': {
		input: UnipileEndpointInputSchemas.calendarsUpdate,
		output: UnipileEndpointOutputSchemas.calendarsUpdate,
	},
	'calendars.delete': {
		input: UnipileEndpointInputSchemas.calendarsDelete,
		output: UnipileEndpointOutputSchemas.calendarsDelete,
	},
	'calendarEvents.list': {
		input: UnipileEndpointInputSchemas.calendarEventsList,
		output: UnipileEndpointOutputSchemas.calendarEventsList,
	},
	'calendarEvents.create': {
		input: UnipileEndpointInputSchemas.calendarEventsCreate,
		output: UnipileEndpointOutputSchemas.calendarEventsCreate,
	},
	'calendarEvents.get': {
		input: UnipileEndpointInputSchemas.calendarEventsGet,
		output: UnipileEndpointOutputSchemas.calendarEventsGet,
	},
	'calendarEvents.update': {
		input: UnipileEndpointInputSchemas.calendarEventsUpdate,
		output: UnipileEndpointOutputSchemas.calendarEventsUpdate,
	},
	'calendarEvents.delete': {
		input: UnipileEndpointInputSchemas.calendarEventsDelete,
		output: UnipileEndpointOutputSchemas.calendarEventsDelete,
	},
	'calendarEvents.respond': {
		input: UnipileEndpointInputSchemas.calendarEventsRespond,
		output: UnipileEndpointOutputSchemas.calendarEventsRespond,
	},
	'calendarEvents.cancel': {
		input: UnipileEndpointInputSchemas.calendarEventsCancel,
		output: UnipileEndpointOutputSchemas.calendarEventsCancel,
	},
	'calendarEvents.restore': {
		input: UnipileEndpointInputSchemas.calendarEventsRestore,
		output: UnipileEndpointOutputSchemas.calendarEventsRestore,
	},
	'posts.get': {
		input: UnipileEndpointInputSchemas.postsGet,
		output: UnipileEndpointOutputSchemas.postsGet,
	},
	'posts.create': {
		input: UnipileEndpointInputSchemas.postsCreate,
		output: UnipileEndpointOutputSchemas.postsCreate,
	},
	'posts.update': {
		input: UnipileEndpointInputSchemas.postsUpdate,
		output: UnipileEndpointOutputSchemas.postsUpdate,
	},
	'posts.delete': {
		input: UnipileEndpointInputSchemas.postsDelete,
		output: UnipileEndpointOutputSchemas.postsDelete,
	},
	'posts.createStory': {
		input: UnipileEndpointInputSchemas.postsCreateStory,
		output: UnipileEndpointOutputSchemas.postsCreateStory,
	},
	'posts.addReaction': {
		input: UnipileEndpointInputSchemas.postsAddReaction,
		output: UnipileEndpointOutputSchemas.postsAddReaction,
	},
	'posts.removeReaction': {
		input: UnipileEndpointInputSchemas.postsRemoveReaction,
		output: UnipileEndpointOutputSchemas.postsRemoveReaction,
	},
	'posts.addComment': {
		input: UnipileEndpointInputSchemas.postsAddComment,
		output: UnipileEndpointOutputSchemas.postsAddComment,
	},
	'posts.updateComment': {
		input: UnipileEndpointInputSchemas.postsUpdateComment,
		output: UnipileEndpointOutputSchemas.postsUpdateComment,
	},
	'posts.deleteComment': {
		input: UnipileEndpointInputSchemas.postsDeleteComment,
		output: UnipileEndpointOutputSchemas.postsDeleteComment,
	},
	'posts.replyToComment': {
		input: UnipileEndpointInputSchemas.postsReplyToComment,
		output: UnipileEndpointOutputSchemas.postsReplyToComment,
	},
	'posts.listCommentReplies': {
		input: UnipileEndpointInputSchemas.postsListCommentReplies,
		output: UnipileEndpointOutputSchemas.postsListCommentReplies,
	},
	'posts.listCommentReactions': {
		input: UnipileEndpointInputSchemas.postsListCommentReactions,
		output: UnipileEndpointOutputSchemas.postsListCommentReactions,
	},
	'posts.addCommentReaction': {
		input: UnipileEndpointInputSchemas.postsAddCommentReaction,
		output: UnipileEndpointOutputSchemas.postsAddCommentReaction,
	},
	'posts.removeCommentReaction': {
		input: UnipileEndpointInputSchemas.postsRemoveCommentReaction,
		output: UnipileEndpointOutputSchemas.postsRemoveCommentReaction,
	},
	'linkedin.getInmailCredits': {
		input: UnipileEndpointInputSchemas.linkedinGetInmailCredits,
		output: UnipileEndpointOutputSchemas.linkedinGetInmailCredits,
	},
	'linkedin.listContracts': {
		input: UnipileEndpointInputSchemas.linkedinListContracts,
		output: UnipileEndpointOutputSchemas.linkedinListContracts,
	},
	'linkedin.selectContract': {
		input: UnipileEndpointInputSchemas.linkedinSelectContract,
		output: UnipileEndpointOutputSchemas.linkedinSelectContract,
	},
	'linkedin.listProfileViews': {
		input: UnipileEndpointInputSchemas.linkedinListProfileViews,
		output: UnipileEndpointOutputSchemas.linkedinListProfileViews,
	},
	'linkedin.getCompany': {
		input: UnipileEndpointInputSchemas.linkedinGetCompany,
		output: UnipileEndpointOutputSchemas.linkedinGetCompany,
	},
	'linkedin.listManagedCompanyPages': {
		input: UnipileEndpointInputSchemas.linkedinListManagedCompanyPages,
		output: UnipileEndpointOutputSchemas.linkedinListManagedCompanyPages,
	},
	'linkedin.inviteToFollowCompany': {
		input: UnipileEndpointInputSchemas.linkedinInviteToFollowCompany,
		output: UnipileEndpointOutputSchemas.linkedinInviteToFollowCompany,
	},
	'linkedin.getCompanyFollowCredits': {
		input: UnipileEndpointInputSchemas.linkedinGetCompanyFollowCredits,
		output: UnipileEndpointOutputSchemas.linkedinGetCompanyFollowCredits,
	},
	'linkedin.endorseSkill': {
		input: UnipileEndpointInputSchemas.linkedinEndorseSkill,
		output: UnipileEndpointOutputSchemas.linkedinEndorseSkill,
	},
	'linkedin.request': {
		input: UnipileEndpointInputSchemas.linkedinRequest,
		output: UnipileEndpointOutputSchemas.linkedinRequest,
	},
	'linkedin.getSearchParameters': {
		input: UnipileEndpointInputSchemas.linkedinGetSearchParameters,
		output: UnipileEndpointOutputSchemas.linkedinGetSearchParameters,
	},
	'linkedin.searchFromUrl': {
		input: UnipileEndpointInputSchemas.linkedinSearchFromUrl,
		output: UnipileEndpointOutputSchemas.linkedinSearchFromUrl,
	},
	'linkedin.searchPeople': {
		input: UnipileEndpointInputSchemas.linkedinSearchPeople,
		output: UnipileEndpointOutputSchemas.linkedinSearchPeople,
	},
	'linkedin.searchCompanies': {
		input: UnipileEndpointInputSchemas.linkedinSearchCompanies,
		output: UnipileEndpointOutputSchemas.linkedinSearchCompanies,
	},
	'linkedin.searchPosts': {
		input: UnipileEndpointInputSchemas.linkedinSearchPosts,
		output: UnipileEndpointOutputSchemas.linkedinSearchPosts,
	},
	'linkedin.searchJobs': {
		input: UnipileEndpointInputSchemas.linkedinSearchJobs,
		output: UnipileEndpointOutputSchemas.linkedinSearchJobs,
	},
	'salesNavigator.getSearchParameters': {
		input: UnipileEndpointInputSchemas.salesNavigatorGetSearchParameters,
		output: UnipileEndpointOutputSchemas.salesNavigatorGetSearchParameters,
	},
	'salesNavigator.searchFromUrl': {
		input: UnipileEndpointInputSchemas.salesNavigatorSearchFromUrl,
		output: UnipileEndpointOutputSchemas.salesNavigatorSearchFromUrl,
	},
	'salesNavigator.searchPeople': {
		input: UnipileEndpointInputSchemas.salesNavigatorSearchPeople,
		output: UnipileEndpointOutputSchemas.salesNavigatorSearchPeople,
	},
	'salesNavigator.searchCompanies': {
		input: UnipileEndpointInputSchemas.salesNavigatorSearchCompanies,
		output: UnipileEndpointOutputSchemas.salesNavigatorSearchCompanies,
	},
	'salesNavigator.listLeadLists': {
		input: UnipileEndpointInputSchemas.salesNavigatorListLeadLists,
		output: UnipileEndpointOutputSchemas.salesNavigatorListLeadLists,
	},
	'salesNavigator.browseLeadList': {
		input: UnipileEndpointInputSchemas.salesNavigatorBrowseLeadList,
		output: UnipileEndpointOutputSchemas.salesNavigatorBrowseLeadList,
	},
	'salesNavigator.saveLead': {
		input: UnipileEndpointInputSchemas.salesNavigatorSaveLead,
		output: UnipileEndpointOutputSchemas.salesNavigatorSaveLead,
	},
	'salesNavigator.listAccountLists': {
		input: UnipileEndpointInputSchemas.salesNavigatorListAccountLists,
		output: UnipileEndpointOutputSchemas.salesNavigatorListAccountLists,
	},
	'salesNavigator.browseAccountList': {
		input: UnipileEndpointInputSchemas.salesNavigatorBrowseAccountList,
		output: UnipileEndpointOutputSchemas.salesNavigatorBrowseAccountList,
	},
	'salesNavigator.saveAccount': {
		input: UnipileEndpointInputSchemas.salesNavigatorSaveAccount,
		output: UnipileEndpointOutputSchemas.salesNavigatorSaveAccount,
	},
	'accounts.update': {
		input: UnipileEndpointInputSchemas.accountsUpdate,
		output: UnipileEndpointOutputSchemas.accountsUpdate,
	},
	'auth.startIntent': {
		input: UnipileEndpointInputSchemas.authStartIntent,
		output: UnipileEndpointOutputSchemas.authStartIntent,
	},
	'auth.solveCheckpoint': {
		input: UnipileEndpointInputSchemas.authSolveCheckpoint,
		output: UnipileEndpointOutputSchemas.authSolveCheckpoint,
	},
	'auth.requestCheckpoint': {
		input: UnipileEndpointInputSchemas.authRequestCheckpoint,
		output: UnipileEndpointOutputSchemas.authRequestCheckpoint,
	},
	'auth.resendCheckpoint': {
		input: UnipileEndpointInputSchemas.authResendCheckpoint,
		output: UnipileEndpointOutputSchemas.authResendCheckpoint,
	},
	'scopes.list': {
		input: UnipileEndpointInputSchemas.scopesList,
		output: UnipileEndpointOutputSchemas.scopesList,
	},
	'scopes.create': {
		input: UnipileEndpointInputSchemas.scopesCreate,
		output: UnipileEndpointOutputSchemas.scopesCreate,
	},
	'scopes.get': {
		input: UnipileEndpointInputSchemas.scopesGet,
		output: UnipileEndpointOutputSchemas.scopesGet,
	},
	'scopes.update': {
		input: UnipileEndpointInputSchemas.scopesUpdate,
		output: UnipileEndpointOutputSchemas.scopesUpdate,
	},
	'scopes.delete': {
		input: UnipileEndpointInputSchemas.scopesDelete,
		output: UnipileEndpointOutputSchemas.scopesDelete,
	},
	'apiKeys.list': {
		input: UnipileEndpointInputSchemas.apiKeysList,
		output: UnipileEndpointOutputSchemas.apiKeysList,
	},
	'apiKeys.create': {
		input: UnipileEndpointInputSchemas.apiKeysCreate,
		output: UnipileEndpointOutputSchemas.apiKeysCreate,
	},
	'apiKeys.delete': {
		input: UnipileEndpointInputSchemas.apiKeysDelete,
		output: UnipileEndpointOutputSchemas.apiKeysDelete,
	},
	'webhookEvents.listDeliveries': {
		input: UnipileEndpointInputSchemas.webhookEventsListDeliveries,
		output: UnipileEndpointOutputSchemas.webhookEventsListDeliveries,
	},
	'webhookEvents.replay': {
		input: UnipileEndpointInputSchemas.webhookEventsReplay,
		output: UnipileEndpointOutputSchemas.webhookEventsReplay,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof unipileEndpointsNested
>;

const unipileWebhookSchemas = {
	'relations.new': {
		description:
			'A new 1st-degree relation, usually an accepted invitation (LinkedIn can report it up to 6 hours late)',
		payload: RelationNewEventSchema,
		response: RelationNewEventSchema,
	},
	'messages.new': {
		description:
			'A message was received or sent in a chat (check payload.is_sender)',
		payload: MessageNewEventSchema,
		response: MessageNewEventSchema,
	},
	'messages.receiptRead': {
		description: 'Someone read a message the account sent',
		payload: MessageReceiptReadEventSchema,
		response: MessageReceiptReadEventSchema,
	},
	'accounts.statusRunning': {
		description: 'An account (or one of its products) is working again',
		payload: AccountStatusRunningEventSchema,
		response: AccountStatusRunningEventSchema,
	},
	'accounts.statusPartial': {
		description:
			'A multi-product account has one product running and another needing sign-in',
		payload: AccountStatusPartialEventSchema,
		response: AccountStatusPartialEventSchema,
	},
	'accounts.statusDegraded': {
		description:
			'A multi-product account has one product running and another interrupted',
		payload: AccountStatusDegradedEventSchema,
		response: AccountStatusDegradedEventSchema,
	},
	'accounts.statusErrored': {
		description:
			'An account is interrupted by a Unipile, proxy or provider problem',
		payload: AccountStatusErroredEventSchema,
		response: AccountStatusErroredEventSchema,
	},
	'accounts.statusDisconnected': {
		description:
			'An account needs signing in again; send a reconnect link from accounts.createAuthLink',
		payload: AccountStatusDisconnectedEventSchema,
		response: AccountStatusDisconnectedEventSchema,
	},
	'accounts.add': {
		description:
			'A new account was connected and is ready; payload.state is the createAuthLink state',
		payload: AccountAddEventSchema,
		response: AccountAddEventSchema,
	},
	'accounts.reconnect': {
		description: 'An existing account was signed in again or reconfigured',
		payload: AccountReconnectEventSchema,
		response: AccountReconnectEventSchema,
	},
	'accounts.remove': {
		description: 'An account was removed from Unipile',
		payload: AccountRemoveEventSchema,
		response: AccountRemoveEventSchema,
	},
	'accounts.locked': {
		description: 'API access to an account was locked',
		payload: AccountLockedEventSchema,
		response: AccountLockedEventSchema,
	},
	'accounts.unlocked': {
		description: 'API access to an account was restored',
		payload: AccountUnlockedEventSchema,
		response: AccountUnlockedEventSchema,
	},
	'emails.new': {
		description:
			'An email was added to a folder: received, sent, or moved in (check folder_id). Gmail, Outlook and IMAP can report it up to 10 seconds late',
		payload: EmailNewEventSchema,
		response: EmailNewEventSchema,
	},
	'emails.bounce': {
		description:
			'A bounce notice arrived for an email the account sent (sent instead of email.new)',
		payload: EmailBounceEventSchema,
		response: EmailBounceEventSchema,
	},
	'emails.delete': {
		description: 'An email left a folder: deleted, trashed or moved elsewhere',
		payload: EmailDeleteEventSchema,
		response: EmailDeleteEventSchema,
	},
	'emailDrafts.new': {
		description: 'An email draft was created',
		payload: EmailDraftNewEventSchema,
		response: EmailDraftNewEventSchema,
	},
	'emailDrafts.delete': {
		description: 'An email draft was deleted',
		payload: EmailDraftDeleteEventSchema,
		response: EmailDraftDeleteEventSchema,
	},
	'emailFolders.create': {
		description: 'An email folder or label was created',
		payload: EmailFolderCreateEventSchema,
		response: EmailFolderCreateEventSchema,
	},
	'emailFolders.update': {
		description: 'An email folder or label was changed',
		payload: EmailFolderUpdateEventSchema,
		response: EmailFolderUpdateEventSchema,
	},
	'emailFolders.delete': {
		description: 'An email folder or label was deleted',
		payload: EmailFolderDeleteEventSchema,
		response: EmailFolderDeleteEventSchema,
	},
	'calendars.create': {
		description: 'A calendar was created',
		payload: CalendarCreateEventSchema,
		response: CalendarCreateEventSchema,
	},
	'calendars.update': {
		description: 'A calendar was changed',
		payload: CalendarUpdateEventSchema,
		response: CalendarUpdateEventSchema,
	},
	'calendars.delete': {
		description: 'A calendar was deleted',
		payload: CalendarDeleteEventSchema,
		response: CalendarDeleteEventSchema,
	},
	'calendarEvents.new': {
		description:
			'A calendar event was created or the account was invited (Google and Outlook can report it up to 60 seconds late)',
		payload: CalendarEventNewEventSchema,
		response: CalendarEventNewEventSchema,
	},
	'calendarEvents.update': {
		description: 'A calendar event was changed',
		payload: CalendarEventUpdateEventSchema,
		response: CalendarEventUpdateEventSchema,
	},
	'calendarEvents.delete': {
		description: 'A calendar event was deleted',
		payload: CalendarEventDeleteEventSchema,
		response: CalendarEventDeleteEventSchema,
	},
	'chats.update': {
		description:
			'A chat changed: folders, unread count, archive state, participants or name',
		payload: ChatUpdateEventSchema,
		response: ChatUpdateEventSchema,
	},
	'chats.delete': {
		description: 'A chat was deleted',
		payload: ChatDeleteEventSchema,
		response: ChatDeleteEventSchema,
	},
	'messages.update': {
		description: 'A message was edited',
		payload: MessageUpdateEventSchema,
		response: MessageUpdateEventSchema,
	},
	'messages.delete': {
		description: 'A message was deleted',
		payload: MessageDeleteEventSchema,
		response: MessageDeleteEventSchema,
	},
	'messages.receiptDelivery': {
		description:
			'A sent message was delivered to someone (can fire once per member in group chats)',
		payload: MessageReceiptDeliveryEventSchema,
		response: MessageReceiptDeliveryEventSchema,
	},
	'messages.reactionNew': {
		description: 'Someone reacted to a message',
		payload: MessageReactionNewEventSchema,
		response: MessageReactionNewEventSchema,
	},
	'messages.reactionDelete': {
		description: 'A reaction was removed from a message',
		payload: MessageReactionDeleteEventSchema,
		response: MessageReactionDeleteEventSchema,
	},
	'followers.new': {
		description:
			'Someone started following the account owner (LinkedIn can report it up to 6 hours late)',
		payload: FollowerNewEventSchema,
		response: FollowerNewEventSchema,
	},
	'tracking.open': {
		description: 'Someone opened an email sent with open tracking',
		payload: TrackingOpenEventSchema,
		response: TrackingOpenEventSchema,
	},
	'tracking.click': {
		description: 'Someone clicked a tracked link in an email',
		payload: TrackingClickEventSchema,
		response: TrackingClickEventSchema,
	},
	'accounts.initialSyncRunning': {
		description: 'The first sync of a newly connected account started',
		payload: AccountInitialSyncRunningEventSchema,
		response: AccountInitialSyncRunningEventSchema,
	},
	'accounts.initialSyncCompleted': {
		description: 'The first sync finished and all history is available',
		payload: AccountInitialSyncCompletedEventSchema,
		response: AccountInitialSyncCompletedEventSchema,
	},
	'accounts.initialSyncFailed': {
		description: 'The first sync stopped with an error',
		payload: AccountInitialSyncFailedEventSchema,
		response: AccountInitialSyncFailedEventSchema,
	},
} as const satisfies RequiredPluginWebhookSchemas<typeof unipileWebhooksNested>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const unipileEndpointMeta = endpointMeta satisfies RequiredPluginEndpointMeta<
	typeof unipileEndpointsNested
>;

// Unipile events carry the application ID (app_…) that owns the API key.
export const unipileAuthConfig = {
	api_key: {
		account: ['application_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseUnipilePlugin<T extends UnipilePluginOptions> = CorsairPlugin<
	'unipile',
	typeof UnipileSchema,
	typeof unipileEndpointsNested,
	typeof unipileWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalUnipilePlugin = BaseUnipilePlugin<UnipilePluginOptions>;

export type ExternalUnipilePlugin<T extends UnipilePluginOptions> =
	BaseUnipilePlugin<T>;

export function unipile<const T extends UnipilePluginOptions>(
	incomingOptions: UnipilePluginOptions & T = {} as UnipilePluginOptions & T,
): ExternalUnipilePlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'unipile',
		authConfig: unipileAuthConfig,
		schema: UnipileSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: unipileEndpointsNested,
		webhooks: unipileWebhooksNested,
		endpointMeta: unipileEndpointMeta,
		endpointSchemas: unipileEndpointSchemas,
		webhookSchemas: unipileWebhookSchemas,
		pluginWebhookMatcher: matchUnipilePluginWebhook,
		pluginTenantWebhookMatcher: matchUnipileTenantWebhook,
		errorHandlers: mergeErrorHandlers(errorHandlers, options.errorHandlers),
		keyBuilder: async (ctx: UnipileKeyBuilderContext, source) => {
			if (source === 'webhook') {
				if (options.webhookSecret) return options.webhookSecret;
				// An empty secret makes signature verification fail closed.
				return (await ctx.keys.get_webhook_signature()) ?? '';
			}

			if (options.key) return options.key;

			if (ctx.authType === 'api_key') {
				const key = await ctx.keys.get_api_key();
				if (key) return key;
			}

			throw new AuthMissingError('unipile', ctx.authType ?? 'api_key');
		},
	} satisfies InternalUnipilePlugin;
}

export { UnipileAPIError } from './client';
export type {
	AccountsCreateAuthLinkInput,
	ChatsStartInput,
	MessagesSendInput,
	RelationRequestsCreateInput,
	UnipileAccount,
	UnipileChat,
	UnipileCreatedWebhookEndpoint,
	UnipileEndpointInputs,
	UnipileEndpointOutputs,
	UnipileMessage,
	UnipileOperation,
	UnipilePost,
	UnipileRelationRequest,
	UnipileUser,
	UnipileUserProfile,
	UnipileUserRelation,
	UnipileWebhookEndpoint,
	UnipileWebhookEventType,
} from './endpoints/types';
export {
	isLinkedInLimitError,
	MAX_RETRY_AFTER_MS,
	RETRY_SAFE_OPERATIONS,
} from './error-handlers';
export type {
	AccountAddEvent,
	AccountLockedEvent,
	AccountReconnectEvent,
	AccountRemoveEvent,
	AccountStatusDegradedEvent,
	AccountStatusDisconnectedEvent,
	AccountStatusErroredEvent,
	AccountStatusPartialEvent,
	AccountStatusRunningEvent,
	AccountUnlockedEvent,
	MessageNewEvent,
	MessageReceiptReadEvent,
	RelationNewEvent,
	UnipileWebhookOutputs,
} from './webhooks/types';
export {
	signUnipilePayload,
	verifyUnipileWebhookSignature,
} from './webhooks/types';
