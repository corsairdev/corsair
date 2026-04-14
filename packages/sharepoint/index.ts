import type {
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
} from 'corsair/core';
import { getValidSharepointAccessToken } from './client';
import {
	ContentTypes,
	Drive,
	Files,
	Folders,
	Items,
	Lists,
	Permissions,
	RecycleBin,
	Search,
	Social,
	Users,
	Web,
	WebhookSubscriptions,
} from './endpoints';
import type {
	SharepointEndpointInputs,
	SharepointEndpointOutputs,
} from './endpoints/types';
import {
	SharepointEndpointInputSchemas,
	SharepointEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { SharepointSchema } from './schema';
import { ListWebhooks } from './webhooks';
import type {
	SharepointListChangedPayload,
	SharepointWebhookOutputs,
} from './webhooks/types';
import {
	ListChangedEventSchema,
	SharepointListChangedPayloadSchema,
} from './webhooks/types';

// ─────────────────────────────────────────────────────────────────────────────
// Auth config — must be declared before SharepointContext so typeof resolves
// correctly through circular imports (endpoint files import SharepointEndpoints
// which depends on SharepointContext which depends on typeof sharepointAuthConfig)
// ─────────────────────────────────────────────────────────────────────────────

const defaultAuthType = 'oauth_2' as const;

export const sharepointAuthConfig = {
	oauth_2: {
		// site_id is the Graph API site identifier e.g. "tenant.sharepoint.com:/sites/MySite"
		account: ['site_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type SharepointPluginOptions = {
	authType?: PickAuth<'oauth_2'>;
	siteId?: string;
	key?: string;
	webhookClientState?: string;
	hooks?: InternalSharepointPlugin['hooks'];
	webhookHooks?: InternalSharepointPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof sharepointEndpointsNested>;
};

export type SharepointContext = CorsairPluginContext<
	typeof SharepointSchema,
	SharepointPluginOptions,
	undefined,
	typeof sharepointAuthConfig
>;

export type SharepointKeyBuilderContext = KeyBuilderContext<
	SharepointPluginOptions,
	typeof sharepointAuthConfig
>;

// ─────────────────────────────────────────────────────────────────────────────
// Endpoint / webhook helper types — declared after SharepointContext so that
// when endpoint files import SharepointEndpoints the context type is fully known
// ─────────────────────────────────────────────────────────────────────────────

type SharepointEndpoint<
	K extends keyof SharepointEndpointOutputs,
	Input,
> = CorsairEndpoint<SharepointContext, Input, SharepointEndpointOutputs[K]>;

type SharepointWebhook<
	K extends keyof SharepointWebhookOutputs,
	TPayload,
> = CorsairWebhook<SharepointContext, TPayload, SharepointWebhookOutputs[K]>;

export type SharepointBoundEndpoints = BindEndpoints<
	typeof sharepointEndpointsNested
>;
export type SharepointBoundWebhooks = BindWebhooks<SharepointWebhooks>;

export type SharepointEndpoints = {
	listsListAll: SharepointEndpoint<
		'listsListAll',
		SharepointEndpointInputs['listsListAll']
	>;
	listsGetByTitle: SharepointEndpoint<
		'listsGetByTitle',
		SharepointEndpointInputs['listsGetByTitle']
	>;
	listsGetByGuid: SharepointEndpoint<
		'listsGetByGuid',
		SharepointEndpointInputs['listsGetByGuid']
	>;
	listsCreate: SharepointEndpoint<
		'listsCreate',
		SharepointEndpointInputs['listsCreate']
	>;
	listsUpdate: SharepointEndpoint<
		'listsUpdate',
		SharepointEndpointInputs['listsUpdate']
	>;
	listsDelete: SharepointEndpoint<
		'listsDelete',
		SharepointEndpointInputs['listsDelete']
	>;
	listsDeleteByTitle: SharepointEndpoint<
		'listsDeleteByTitle',
		SharepointEndpointInputs['listsDeleteByTitle']
	>;
	listsListColumns: SharepointEndpoint<
		'listsListColumns',
		SharepointEndpointInputs['listsListColumns']
	>;
	listsGetChanges: SharepointEndpoint<
		'listsGetChanges',
		SharepointEndpointInputs['listsGetChanges']
	>;
	listsRenderDataAsStream: SharepointEndpoint<
		'listsRenderDataAsStream',
		SharepointEndpointInputs['listsRenderDataAsStream']
	>;
	itemsList: SharepointEndpoint<
		'itemsList',
		SharepointEndpointInputs['itemsList']
	>;
	itemsListByGuid: SharepointEndpoint<
		'itemsListByGuid',
		SharepointEndpointInputs['itemsListByGuid']
	>;
	itemsGet: SharepointEndpoint<
		'itemsGet',
		SharepointEndpointInputs['itemsGet']
	>;
	itemsCreate: SharepointEndpoint<
		'itemsCreate',
		SharepointEndpointInputs['itemsCreate']
	>;
	itemsCreateByGuid: SharepointEndpoint<
		'itemsCreateByGuid',
		SharepointEndpointInputs['itemsCreateByGuid']
	>;
	itemsCreateInFolder: SharepointEndpoint<
		'itemsCreateInFolder',
		SharepointEndpointInputs['itemsCreateInFolder']
	>;
	itemsUpdate: SharepointEndpoint<
		'itemsUpdate',
		SharepointEndpointInputs['itemsUpdate']
	>;
	itemsDelete: SharepointEndpoint<
		'itemsDelete',
		SharepointEndpointInputs['itemsDelete']
	>;
	itemsRecycle: SharepointEndpoint<
		'itemsRecycle',
		SharepointEndpointInputs['itemsRecycle']
	>;
	itemsGetVersion: SharepointEndpoint<
		'itemsGetVersion',
		SharepointEndpointInputs['itemsGetVersion']
	>;
	itemsGetEtag: SharepointEndpoint<
		'itemsGetEtag',
		SharepointEndpointInputs['itemsGetEtag']
	>;
	itemsAddAttachment: SharepointEndpoint<
		'itemsAddAttachment',
		SharepointEndpointInputs['itemsAddAttachment']
	>;
	itemsGetAttachmentContent: SharepointEndpoint<
		'itemsGetAttachmentContent',
		SharepointEndpointInputs['itemsGetAttachmentContent']
	>;
	itemsListAttachments: SharepointEndpoint<
		'itemsListAttachments',
		SharepointEndpointInputs['itemsListAttachments']
	>;
	filesUpload: SharepointEndpoint<
		'filesUpload',
		SharepointEndpointInputs['filesUpload']
	>;
	filesDownload: SharepointEndpoint<
		'filesDownload',
		SharepointEndpointInputs['filesDownload']
	>;
	filesListInFolder: SharepointEndpoint<
		'filesListInFolder',
		SharepointEndpointInputs['filesListInFolder']
	>;
	filesRecycle: SharepointEndpoint<
		'filesRecycle',
		SharepointEndpointInputs['filesRecycle']
	>;
	filesCheckIn: SharepointEndpoint<
		'filesCheckIn',
		SharepointEndpointInputs['filesCheckIn']
	>;
	filesCheckOut: SharepointEndpoint<
		'filesCheckOut',
		SharepointEndpointInputs['filesCheckOut']
	>;
	filesUndoCheckout: SharepointEndpoint<
		'filesUndoCheckout',
		SharepointEndpointInputs['filesUndoCheckout']
	>;
	filesGet: SharepointEndpoint<
		'filesGet',
		SharepointEndpointInputs['filesGet']
	>;
	foldersCreate: SharepointEndpoint<
		'foldersCreate',
		SharepointEndpointInputs['foldersCreate']
	>;
	foldersGet: SharepointEndpoint<
		'foldersGet',
		SharepointEndpointInputs['foldersGet']
	>;
	foldersGetAll: SharepointEndpoint<
		'foldersGetAll',
		SharepointEndpointInputs['foldersGetAll']
	>;
	foldersListSubfolders: SharepointEndpoint<
		'foldersListSubfolders',
		SharepointEndpointInputs['foldersListSubfolders']
	>;
	foldersDelete: SharepointEndpoint<
		'foldersDelete',
		SharepointEndpointInputs['foldersDelete']
	>;
	foldersRename: SharepointEndpoint<
		'foldersRename',
		SharepointEndpointInputs['foldersRename']
	>;
	usersGetCurrent: SharepointEndpoint<
		'usersGetCurrent',
		SharepointEndpointInputs['usersGetCurrent']
	>;
	usersCreate: SharepointEndpoint<
		'usersCreate',
		SharepointEndpointInputs['usersCreate']
	>;
	usersFind: SharepointEndpoint<
		'usersFind',
		SharepointEndpointInputs['usersFind']
	>;
	usersRemove: SharepointEndpoint<
		'usersRemove',
		SharepointEndpointInputs['usersRemove']
	>;
	usersEnsure: SharepointEndpoint<
		'usersEnsure',
		SharepointEndpointInputs['usersEnsure']
	>;
	usersListSite: SharepointEndpoint<
		'usersListSite',
		SharepointEndpointInputs['usersListSite']
	>;
	usersListGroups: SharepointEndpoint<
		'usersListGroups',
		SharepointEndpointInputs['usersListGroups']
	>;
	usersGetGroupUsers: SharepointEndpoint<
		'usersGetGroupUsers',
		SharepointEndpointInputs['usersGetGroupUsers']
	>;
	usersGetGroupUsersById: SharepointEndpoint<
		'usersGetGroupUsersById',
		SharepointEndpointInputs['usersGetGroupUsersById']
	>;
	usersGetEffectivePermissions: SharepointEndpoint<
		'usersGetEffectivePermissions',
		SharepointEndpointInputs['usersGetEffectivePermissions']
	>;
	searchQuery: SharepointEndpoint<
		'searchQuery',
		SharepointEndpointInputs['searchQuery']
	>;
	searchSuggest: SharepointEndpoint<
		'searchSuggest',
		SharepointEndpointInputs['searchSuggest']
	>;
	contentTypesGet: SharepointEndpoint<
		'contentTypesGet',
		SharepointEndpointInputs['contentTypesGet']
	>;
	contentTypesGetAll: SharepointEndpoint<
		'contentTypesGetAll',
		SharepointEndpointInputs['contentTypesGetAll']
	>;
	contentTypesGetForList: SharepointEndpoint<
		'contentTypesGetForList',
		SharepointEndpointInputs['contentTypesGetForList']
	>;
	contentTypesGetById: SharepointEndpoint<
		'contentTypesGetById',
		SharepointEndpointInputs['contentTypesGetById']
	>;
	contentTypesCreate: SharepointEndpoint<
		'contentTypesCreate',
		SharepointEndpointInputs['contentTypesCreate']
	>;
	contentTypesUpdate: SharepointEndpoint<
		'contentTypesUpdate',
		SharepointEndpointInputs['contentTypesUpdate']
	>;
	contentTypesAddFieldLink: SharepointEndpoint<
		'contentTypesAddFieldLink',
		SharepointEndpointInputs['contentTypesAddFieldLink']
	>;
	contentTypesCreateListField: SharepointEndpoint<
		'contentTypesCreateListField',
		SharepointEndpointInputs['contentTypesCreateListField']
	>;
	permissionsAddRoleToItem: SharepointEndpoint<
		'permissionsAddRoleToItem',
		SharepointEndpointInputs['permissionsAddRoleToItem']
	>;
	permissionsAddRoleToList: SharepointEndpoint<
		'permissionsAddRoleToList',
		SharepointEndpointInputs['permissionsAddRoleToList']
	>;
	permissionsBreakInheritanceOnItem: SharepointEndpoint<
		'permissionsBreakInheritanceOnItem',
		SharepointEndpointInputs['permissionsBreakInheritanceOnItem']
	>;
	permissionsBreakInheritanceOnList: SharepointEndpoint<
		'permissionsBreakInheritanceOnList',
		SharepointEndpointInputs['permissionsBreakInheritanceOnList']
	>;
	permissionsGetRoleDefinitions: SharepointEndpoint<
		'permissionsGetRoleDefinitions',
		SharepointEndpointInputs['permissionsGetRoleDefinitions']
	>;
	webGetInfo: SharepointEndpoint<
		'webGetInfo',
		SharepointEndpointInputs['webGetInfo']
	>;
	webGetSiteCollectionInfo: SharepointEndpoint<
		'webGetSiteCollectionInfo',
		SharepointEndpointInputs['webGetSiteCollectionInfo']
	>;
	webGetSitePage: SharepointEndpoint<
		'webGetSitePage',
		SharepointEndpointInputs['webGetSitePage']
	>;
	webCreateSubsite: SharepointEndpoint<
		'webCreateSubsite',
		SharepointEndpointInputs['webCreateSubsite']
	>;
	webUpdateSite: SharepointEndpoint<
		'webUpdateSite',
		SharepointEndpointInputs['webUpdateSite']
	>;
	webGetContextInfo: SharepointEndpoint<
		'webGetContextInfo',
		SharepointEndpointInputs['webGetContextInfo']
	>;
	webGetDriveItemByPath: SharepointEndpoint<
		'webGetDriveItemByPath',
		SharepointEndpointInputs['webGetDriveItemByPath']
	>;
	webLogEvent: SharepointEndpoint<
		'webLogEvent',
		SharepointEndpointInputs['webLogEvent']
	>;
	recycleBinList: SharepointEndpoint<
		'recycleBinList',
		SharepointEndpointInputs['recycleBinList']
	>;
	recycleBinRestore: SharepointEndpoint<
		'recycleBinRestore',
		SharepointEndpointInputs['recycleBinRestore']
	>;
	recycleBinDeletePermanent: SharepointEndpoint<
		'recycleBinDeletePermanent',
		SharepointEndpointInputs['recycleBinDeletePermanent']
	>;
	driveGetAnalytics: SharepointEndpoint<
		'driveGetAnalytics',
		SharepointEndpointInputs['driveGetAnalytics']
	>;
	driveListRecentItems: SharepointEndpoint<
		'driveListRecentItems',
		SharepointEndpointInputs['driveListRecentItems']
	>;
	driveRestoreVersion: SharepointEndpoint<
		'driveRestoreVersion',
		SharepointEndpointInputs['driveRestoreVersion']
	>;
	driveDeleteVersion: SharepointEndpoint<
		'driveDeleteVersion',
		SharepointEndpointInputs['driveDeleteVersion']
	>;
	driveCreateSharingLink: SharepointEndpoint<
		'driveCreateSharingLink',
		SharepointEndpointInputs['driveCreateSharingLink']
	>;
	driveUpdateItem: SharepointEndpoint<
		'driveUpdateItem',
		SharepointEndpointInputs['driveUpdateItem']
	>;
	socialFollow: SharepointEndpoint<
		'socialFollow',
		SharepointEndpointInputs['socialFollow']
	>;
	socialIsFollowed: SharepointEndpoint<
		'socialIsFollowed',
		SharepointEndpointInputs['socialIsFollowed']
	>;
	socialGetFollowed: SharepointEndpoint<
		'socialGetFollowed',
		SharepointEndpointInputs['socialGetFollowed']
	>;
	socialGetFollowers: SharepointEndpoint<
		'socialGetFollowers',
		SharepointEndpointInputs['socialGetFollowers']
	>;
	webhookSubscriptionsGet: SharepointEndpoint<
		'webhookSubscriptionsGet',
		SharepointEndpointInputs['webhookSubscriptionsGet']
	>;
	webhookSubscriptionsGetAll: SharepointEndpoint<
		'webhookSubscriptionsGetAll',
		SharepointEndpointInputs['webhookSubscriptionsGetAll']
	>;
};

export type SharepointWebhooks = {
	listChanged: SharepointWebhook<'listChanged', SharepointListChangedPayload>;
};

// ─────────────────────────────────────────────────────────────────────────────
// Endpoint / webhook runtime trees
// ─────────────────────────────────────────────────────────────────────────────

const sharepointEndpointsNested = {
	lists: {
		listAll: Lists.listAll,
		getByTitle: Lists.getByTitle,
		getByGuid: Lists.getByGuid,
		create: Lists.create,
		update: Lists.update,
		delete: Lists.delete,
		deleteByTitle: Lists.deleteByTitle,
		listColumns: Lists.listColumns,
		getChanges: Lists.getChanges,
		renderDataAsStream: Lists.renderDataAsStream,
	},
	items: {
		list: Items.list,
		listByGuid: Items.listByGuid,
		get: Items.get,
		create: Items.create,
		createByGuid: Items.createByGuid,
		createInFolder: Items.createInFolder,
		update: Items.update,
		delete: Items.delete,
		recycle: Items.recycle,
		getVersion: Items.getVersion,
		getEtag: Items.getEtag,
		addAttachment: Items.addAttachment,
		getAttachmentContent: Items.getAttachmentContent,
		listAttachments: Items.listAttachments,
	},
	files: {
		upload: Files.upload,
		download: Files.download,
		listInFolder: Files.listInFolder,
		recycle: Files.recycle,
		checkIn: Files.checkIn,
		checkOut: Files.checkOut,
		undoCheckout: Files.undoCheckout,
		get: Files.get,
	},
	folders: {
		create: Folders.create,
		get: Folders.get,
		getAll: Folders.getAll,
		listSubfolders: Folders.listSubfolders,
		delete: Folders.delete,
		rename: Folders.rename,
	},
	users: {
		getCurrent: Users.getCurrent,
		create: Users.create,
		find: Users.find,
		remove: Users.remove,
		ensure: Users.ensure,
		listSite: Users.listSite,
		listGroups: Users.listGroups,
		getGroupUsers: Users.getGroupUsers,
		getGroupUsersById: Users.getGroupUsersById,
		getEffectivePermissions: Users.getEffectivePermissions,
	},
	search: {
		query: Search.query,
		suggest: Search.suggest,
	},
	contentTypes: {
		get: ContentTypes.get,
		getAll: ContentTypes.getAll,
		getForList: ContentTypes.getForList,
		getById: ContentTypes.getById,
		create: ContentTypes.create,
		update: ContentTypes.update,
		addFieldLink: ContentTypes.addFieldLink,
		createListField: ContentTypes.createListField,
	},
	permissions: {
		addRoleToItem: Permissions.addRoleToItem,
		addRoleToList: Permissions.addRoleToList,
		breakInheritanceOnItem: Permissions.breakInheritanceOnItem,
		breakInheritanceOnList: Permissions.breakInheritanceOnList,
		getRoleDefinitions: Permissions.getRoleDefinitions,
	},
	web: {
		getInfo: Web.getInfo,
		getSiteCollectionInfo: Web.getSiteCollectionInfo,
		getSitePage: Web.getSitePage,
		createSubsite: Web.createSubsite,
		updateSite: Web.updateSite,
		getContextInfo: Web.getContextInfo,
		getDriveItemByPath: Web.getDriveItemByPath,
		logEvent: Web.logEvent,
	},
	recycleBin: {
		list: RecycleBin.list,
		restore: RecycleBin.restore,
		deletePermanent: RecycleBin.deletePermanent,
	},
	drive: {
		getAnalytics: Drive.getAnalytics,
		listRecentItems: Drive.listRecentItems,
		restoreVersion: Drive.restoreVersion,
		deleteVersion: Drive.deleteVersion,
		createSharingLink: Drive.createSharingLink,
		updateItem: Drive.updateItem,
	},
	social: {
		follow: Social.follow,
		isFollowed: Social.isFollowed,
		getFollowed: Social.getFollowed,
		getFollowers: Social.getFollowers,
	},
	webhookSubscriptions: {
		get: WebhookSubscriptions.get,
		getAll: WebhookSubscriptions.getAll,
	},
} as const;

const sharepointWebhooksNested = {
	lists: {
		listChanged: ListWebhooks.listChanged,
	},
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// Endpoint schemas and meta
// ─────────────────────────────────────────────────────────────────────────────

export const sharepointEndpointSchemas = {
	'lists.listAll': {
		input: SharepointEndpointInputSchemas.listsListAll,
		output: SharepointEndpointOutputSchemas.listsListAll,
	},
	'lists.getByTitle': {
		input: SharepointEndpointInputSchemas.listsGetByTitle,
		output: SharepointEndpointOutputSchemas.listsGetByTitle,
	},
	'lists.getByGuid': {
		input: SharepointEndpointInputSchemas.listsGetByGuid,
		output: SharepointEndpointOutputSchemas.listsGetByGuid,
	},
	'lists.create': {
		input: SharepointEndpointInputSchemas.listsCreate,
		output: SharepointEndpointOutputSchemas.listsCreate,
	},
	'lists.update': {
		input: SharepointEndpointInputSchemas.listsUpdate,
		output: SharepointEndpointOutputSchemas.listsUpdate,
	},
	'lists.delete': {
		input: SharepointEndpointInputSchemas.listsDelete,
		output: SharepointEndpointOutputSchemas.listsDelete,
	},
	'lists.deleteByTitle': {
		input: SharepointEndpointInputSchemas.listsDeleteByTitle,
		output: SharepointEndpointOutputSchemas.listsDeleteByTitle,
	},
	'lists.listColumns': {
		input: SharepointEndpointInputSchemas.listsListColumns,
		output: SharepointEndpointOutputSchemas.listsListColumns,
	},
	'lists.getChanges': {
		input: SharepointEndpointInputSchemas.listsGetChanges,
		output: SharepointEndpointOutputSchemas.listsGetChanges,
	},
	'lists.renderDataAsStream': {
		input: SharepointEndpointInputSchemas.listsRenderDataAsStream,
		output: SharepointEndpointOutputSchemas.listsRenderDataAsStream,
	},
	'items.list': {
		input: SharepointEndpointInputSchemas.itemsList,
		output: SharepointEndpointOutputSchemas.itemsList,
	},
	'items.listByGuid': {
		input: SharepointEndpointInputSchemas.itemsListByGuid,
		output: SharepointEndpointOutputSchemas.itemsListByGuid,
	},
	'items.get': {
		input: SharepointEndpointInputSchemas.itemsGet,
		output: SharepointEndpointOutputSchemas.itemsGet,
	},
	'items.create': {
		input: SharepointEndpointInputSchemas.itemsCreate,
		output: SharepointEndpointOutputSchemas.itemsCreate,
	},
	'items.createByGuid': {
		input: SharepointEndpointInputSchemas.itemsCreateByGuid,
		output: SharepointEndpointOutputSchemas.itemsCreateByGuid,
	},
	'items.createInFolder': {
		input: SharepointEndpointInputSchemas.itemsCreateInFolder,
		output: SharepointEndpointOutputSchemas.itemsCreateInFolder,
	},
	'items.update': {
		input: SharepointEndpointInputSchemas.itemsUpdate,
		output: SharepointEndpointOutputSchemas.itemsUpdate,
	},
	'items.delete': {
		input: SharepointEndpointInputSchemas.itemsDelete,
		output: SharepointEndpointOutputSchemas.itemsDelete,
	},
	'items.recycle': {
		input: SharepointEndpointInputSchemas.itemsRecycle,
		output: SharepointEndpointOutputSchemas.itemsRecycle,
	},
	'items.getVersion': {
		input: SharepointEndpointInputSchemas.itemsGetVersion,
		output: SharepointEndpointOutputSchemas.itemsGetVersion,
	},
	'items.getEtag': {
		input: SharepointEndpointInputSchemas.itemsGetEtag,
		output: SharepointEndpointOutputSchemas.itemsGetEtag,
	},
	'items.addAttachment': {
		input: SharepointEndpointInputSchemas.itemsAddAttachment,
		output: SharepointEndpointOutputSchemas.itemsAddAttachment,
	},
	'items.getAttachmentContent': {
		input: SharepointEndpointInputSchemas.itemsGetAttachmentContent,
		output: SharepointEndpointOutputSchemas.itemsGetAttachmentContent,
	},
	'items.listAttachments': {
		input: SharepointEndpointInputSchemas.itemsListAttachments,
		output: SharepointEndpointOutputSchemas.itemsListAttachments,
	},
	'files.upload': {
		input: SharepointEndpointInputSchemas.filesUpload,
		output: SharepointEndpointOutputSchemas.filesUpload,
	},
	'files.download': {
		input: SharepointEndpointInputSchemas.filesDownload,
		output: SharepointEndpointOutputSchemas.filesDownload,
	},
	'files.listInFolder': {
		input: SharepointEndpointInputSchemas.filesListInFolder,
		output: SharepointEndpointOutputSchemas.filesListInFolder,
	},
	'files.recycle': {
		input: SharepointEndpointInputSchemas.filesRecycle,
		output: SharepointEndpointOutputSchemas.filesRecycle,
	},
	'files.checkIn': {
		input: SharepointEndpointInputSchemas.filesCheckIn,
		output: SharepointEndpointOutputSchemas.filesCheckIn,
	},
	'files.checkOut': {
		input: SharepointEndpointInputSchemas.filesCheckOut,
		output: SharepointEndpointOutputSchemas.filesCheckOut,
	},
	'files.undoCheckout': {
		input: SharepointEndpointInputSchemas.filesUndoCheckout,
		output: SharepointEndpointOutputSchemas.filesUndoCheckout,
	},
	'files.get': {
		input: SharepointEndpointInputSchemas.filesGet,
		output: SharepointEndpointOutputSchemas.filesGet,
	},
	'folders.create': {
		input: SharepointEndpointInputSchemas.foldersCreate,
		output: SharepointEndpointOutputSchemas.foldersCreate,
	},
	'folders.get': {
		input: SharepointEndpointInputSchemas.foldersGet,
		output: SharepointEndpointOutputSchemas.foldersGet,
	},
	'folders.getAll': {
		input: SharepointEndpointInputSchemas.foldersGetAll,
		output: SharepointEndpointOutputSchemas.foldersGetAll,
	},
	'folders.listSubfolders': {
		input: SharepointEndpointInputSchemas.foldersListSubfolders,
		output: SharepointEndpointOutputSchemas.foldersListSubfolders,
	},
	'folders.delete': {
		input: SharepointEndpointInputSchemas.foldersDelete,
		output: SharepointEndpointOutputSchemas.foldersDelete,
	},
	'folders.rename': {
		input: SharepointEndpointInputSchemas.foldersRename,
		output: SharepointEndpointOutputSchemas.foldersRename,
	},
	'users.getCurrent': {
		input: SharepointEndpointInputSchemas.usersGetCurrent,
		output: SharepointEndpointOutputSchemas.usersGetCurrent,
	},
	'users.create': {
		input: SharepointEndpointInputSchemas.usersCreate,
		output: SharepointEndpointOutputSchemas.usersCreate,
	},
	'users.find': {
		input: SharepointEndpointInputSchemas.usersFind,
		output: SharepointEndpointOutputSchemas.usersFind,
	},
	'users.remove': {
		input: SharepointEndpointInputSchemas.usersRemove,
		output: SharepointEndpointOutputSchemas.usersRemove,
	},
	'users.ensure': {
		input: SharepointEndpointInputSchemas.usersEnsure,
		output: SharepointEndpointOutputSchemas.usersEnsure,
	},
	'users.listSite': {
		input: SharepointEndpointInputSchemas.usersListSite,
		output: SharepointEndpointOutputSchemas.usersListSite,
	},
	'users.listGroups': {
		input: SharepointEndpointInputSchemas.usersListGroups,
		output: SharepointEndpointOutputSchemas.usersListGroups,
	},
	'users.getGroupUsers': {
		input: SharepointEndpointInputSchemas.usersGetGroupUsers,
		output: SharepointEndpointOutputSchemas.usersGetGroupUsers,
	},
	'users.getGroupUsersById': {
		input: SharepointEndpointInputSchemas.usersGetGroupUsersById,
		output: SharepointEndpointOutputSchemas.usersGetGroupUsersById,
	},
	'users.getEffectivePermissions': {
		input: SharepointEndpointInputSchemas.usersGetEffectivePermissions,
		output: SharepointEndpointOutputSchemas.usersGetEffectivePermissions,
	},
	'search.query': {
		input: SharepointEndpointInputSchemas.searchQuery,
		output: SharepointEndpointOutputSchemas.searchQuery,
	},
	'search.suggest': {
		input: SharepointEndpointInputSchemas.searchSuggest,
		output: SharepointEndpointOutputSchemas.searchSuggest,
	},
	'contentTypes.get': {
		input: SharepointEndpointInputSchemas.contentTypesGet,
		output: SharepointEndpointOutputSchemas.contentTypesGet,
	},
	'contentTypes.getAll': {
		input: SharepointEndpointInputSchemas.contentTypesGetAll,
		output: SharepointEndpointOutputSchemas.contentTypesGetAll,
	},
	'contentTypes.getForList': {
		input: SharepointEndpointInputSchemas.contentTypesGetForList,
		output: SharepointEndpointOutputSchemas.contentTypesGetForList,
	},
	'contentTypes.getById': {
		input: SharepointEndpointInputSchemas.contentTypesGetById,
		output: SharepointEndpointOutputSchemas.contentTypesGetById,
	},
	'contentTypes.create': {
		input: SharepointEndpointInputSchemas.contentTypesCreate,
		output: SharepointEndpointOutputSchemas.contentTypesCreate,
	},
	'contentTypes.update': {
		input: SharepointEndpointInputSchemas.contentTypesUpdate,
		output: SharepointEndpointOutputSchemas.contentTypesUpdate,
	},
	'contentTypes.addFieldLink': {
		input: SharepointEndpointInputSchemas.contentTypesAddFieldLink,
		output: SharepointEndpointOutputSchemas.contentTypesAddFieldLink,
	},
	'contentTypes.createListField': {
		input: SharepointEndpointInputSchemas.contentTypesCreateListField,
		output: SharepointEndpointOutputSchemas.contentTypesCreateListField,
	},
	'permissions.addRoleToItem': {
		input: SharepointEndpointInputSchemas.permissionsAddRoleToItem,
		output: SharepointEndpointOutputSchemas.permissionsAddRoleToItem,
	},
	'permissions.addRoleToList': {
		input: SharepointEndpointInputSchemas.permissionsAddRoleToList,
		output: SharepointEndpointOutputSchemas.permissionsAddRoleToList,
	},
	'permissions.breakInheritanceOnItem': {
		input: SharepointEndpointInputSchemas.permissionsBreakInheritanceOnItem,
		output: SharepointEndpointOutputSchemas.permissionsBreakInheritanceOnItem,
	},
	'permissions.breakInheritanceOnList': {
		input: SharepointEndpointInputSchemas.permissionsBreakInheritanceOnList,
		output: SharepointEndpointOutputSchemas.permissionsBreakInheritanceOnList,
	},
	'permissions.getRoleDefinitions': {
		input: SharepointEndpointInputSchemas.permissionsGetRoleDefinitions,
		output: SharepointEndpointOutputSchemas.permissionsGetRoleDefinitions,
	},
	'web.getInfo': {
		input: SharepointEndpointInputSchemas.webGetInfo,
		output: SharepointEndpointOutputSchemas.webGetInfo,
	},
	'web.getSiteCollectionInfo': {
		input: SharepointEndpointInputSchemas.webGetSiteCollectionInfo,
		output: SharepointEndpointOutputSchemas.webGetSiteCollectionInfo,
	},
	'web.getSitePage': {
		input: SharepointEndpointInputSchemas.webGetSitePage,
		output: SharepointEndpointOutputSchemas.webGetSitePage,
	},
	'web.createSubsite': {
		input: SharepointEndpointInputSchemas.webCreateSubsite,
		output: SharepointEndpointOutputSchemas.webCreateSubsite,
	},
	'web.updateSite': {
		input: SharepointEndpointInputSchemas.webUpdateSite,
		output: SharepointEndpointOutputSchemas.webUpdateSite,
	},
	'web.getContextInfo': {
		input: SharepointEndpointInputSchemas.webGetContextInfo,
		output: SharepointEndpointOutputSchemas.webGetContextInfo,
	},
	'web.getDriveItemByPath': {
		input: SharepointEndpointInputSchemas.webGetDriveItemByPath,
		output: SharepointEndpointOutputSchemas.webGetDriveItemByPath,
	},
	'web.logEvent': {
		input: SharepointEndpointInputSchemas.webLogEvent,
		output: SharepointEndpointOutputSchemas.webLogEvent,
	},
	'recycleBin.list': {
		input: SharepointEndpointInputSchemas.recycleBinList,
		output: SharepointEndpointOutputSchemas.recycleBinList,
	},
	'recycleBin.restore': {
		input: SharepointEndpointInputSchemas.recycleBinRestore,
		output: SharepointEndpointOutputSchemas.recycleBinRestore,
	},
	'recycleBin.deletePermanent': {
		input: SharepointEndpointInputSchemas.recycleBinDeletePermanent,
		output: SharepointEndpointOutputSchemas.recycleBinDeletePermanent,
	},
	'drive.getAnalytics': {
		input: SharepointEndpointInputSchemas.driveGetAnalytics,
		output: SharepointEndpointOutputSchemas.driveGetAnalytics,
	},
	'drive.listRecentItems': {
		input: SharepointEndpointInputSchemas.driveListRecentItems,
		output: SharepointEndpointOutputSchemas.driveListRecentItems,
	},
	'drive.restoreVersion': {
		input: SharepointEndpointInputSchemas.driveRestoreVersion,
		output: SharepointEndpointOutputSchemas.driveRestoreVersion,
	},
	'drive.deleteVersion': {
		input: SharepointEndpointInputSchemas.driveDeleteVersion,
		output: SharepointEndpointOutputSchemas.driveDeleteVersion,
	},
	'drive.createSharingLink': {
		input: SharepointEndpointInputSchemas.driveCreateSharingLink,
		output: SharepointEndpointOutputSchemas.driveCreateSharingLink,
	},
	'drive.updateItem': {
		input: SharepointEndpointInputSchemas.driveUpdateItem,
		output: SharepointEndpointOutputSchemas.driveUpdateItem,
	},
	'social.follow': {
		input: SharepointEndpointInputSchemas.socialFollow,
		output: SharepointEndpointOutputSchemas.socialFollow,
	},
	'social.isFollowed': {
		input: SharepointEndpointInputSchemas.socialIsFollowed,
		output: SharepointEndpointOutputSchemas.socialIsFollowed,
	},
	'social.getFollowed': {
		input: SharepointEndpointInputSchemas.socialGetFollowed,
		output: SharepointEndpointOutputSchemas.socialGetFollowed,
	},
	'social.getFollowers': {
		input: SharepointEndpointInputSchemas.socialGetFollowers,
		output: SharepointEndpointOutputSchemas.socialGetFollowers,
	},
	'webhookSubscriptions.get': {
		input: SharepointEndpointInputSchemas.webhookSubscriptionsGet,
		output: SharepointEndpointOutputSchemas.webhookSubscriptionsGet,
	},
	'webhookSubscriptions.getAll': {
		input: SharepointEndpointInputSchemas.webhookSubscriptionsGetAll,
		output: SharepointEndpointOutputSchemas.webhookSubscriptionsGetAll,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof sharepointEndpointsNested
>;

const sharepointEndpointMeta = {
	'lists.listAll': {
		riskLevel: 'read',
		description: 'List all SharePoint lists in the site',
	},
	'lists.getByTitle': {
		riskLevel: 'read',
		description: 'Get a SharePoint list by title',
	},
	'lists.getByGuid': {
		riskLevel: 'read',
		description: 'Get a SharePoint list by GUID',
	},
	'lists.create': {
		riskLevel: 'write',
		description: 'Create a new SharePoint list',
	},
	'lists.update': {
		riskLevel: 'write',
		description: 'Update an existing SharePoint list',
	},
	'lists.delete': {
		riskLevel: 'destructive',
		description: 'Delete a SharePoint list by GUID [DESTRUCTIVE]',
	},
	'lists.deleteByTitle': {
		riskLevel: 'destructive',
		description: 'Delete a SharePoint list by title [DESTRUCTIVE]',
	},
	'lists.listColumns': {
		riskLevel: 'read',
		description: 'List all columns (fields) in a SharePoint list',
	},
	'lists.getChanges': {
		riskLevel: 'read',
		description: 'Get change log entries for a SharePoint list',
	},
	'lists.renderDataAsStream': {
		riskLevel: 'read',
		description: 'Render list data as a pageable stream',
	},
	'items.list': {
		riskLevel: 'read',
		description: 'List items in a SharePoint list',
	},
	'items.listByGuid': {
		riskLevel: 'read',
		description: 'List items in a SharePoint list by GUID',
	},
	'items.get': {
		riskLevel: 'read',
		description: 'Get a SharePoint list item by ID',
	},
	'items.create': {
		riskLevel: 'write',
		description: 'Create a new SharePoint list item',
	},
	'items.createByGuid': {
		riskLevel: 'write',
		description: 'Create a new item in a SharePoint list by GUID',
	},
	'items.createInFolder': {
		riskLevel: 'write',
		description: 'Create a new list item inside a specific folder',
	},
	'items.update': {
		riskLevel: 'write',
		description: 'Update an existing SharePoint list item',
	},
	'items.delete': {
		riskLevel: 'destructive',
		description: 'Permanently delete a SharePoint list item [DESTRUCTIVE]',
	},
	'items.recycle': {
		riskLevel: 'write',
		description: 'Move a SharePoint list item to the recycle bin',
	},
	'items.getVersion': {
		riskLevel: 'read',
		description: 'Get a specific version of a SharePoint list item',
	},
	'items.getEtag': {
		riskLevel: 'read',
		description: 'Get the ETag for a SharePoint list item',
	},
	'items.addAttachment': {
		riskLevel: 'write',
		description: 'Add a file attachment to a SharePoint list item',
	},
	'items.getAttachmentContent': {
		riskLevel: 'read',
		description: 'Download the content of a list item attachment',
	},
	'items.listAttachments': {
		riskLevel: 'read',
		description: 'List all attachments for a SharePoint list item',
	},
	'files.upload': {
		riskLevel: 'write',
		description: 'Upload a file to a SharePoint document library folder',
	},
	'files.download': {
		riskLevel: 'read',
		description: 'Download a file by its server-relative URL',
	},
	'files.listInFolder': {
		riskLevel: 'read',
		description: 'List all files in a SharePoint folder',
	},
	'files.recycle': {
		riskLevel: 'write',
		description: 'Move a SharePoint file to the recycle bin',
	},
	'files.checkIn': {
		riskLevel: 'write',
		description: 'Check in a SharePoint file to publish changes',
	},
	'files.checkOut': {
		riskLevel: 'write',
		description: 'Check out a SharePoint file for exclusive editing',
	},
	'files.undoCheckout': {
		riskLevel: 'write',
		description: 'Undo a checked-out SharePoint file',
	},
	'files.get': {
		riskLevel: 'read',
		description: 'Get metadata of a SharePoint file by server-relative URL',
	},
	'folders.create': {
		riskLevel: 'write',
		description: 'Create a new SharePoint folder',
	},
	'folders.get': {
		riskLevel: 'read',
		description: 'Get a SharePoint folder by server-relative URL',
	},
	'folders.getAll': {
		riskLevel: 'read',
		description: 'Get all SharePoint folders in a list or location',
	},
	'folders.listSubfolders': {
		riskLevel: 'read',
		description: 'List subfolders inside a SharePoint folder',
	},
	'folders.delete': {
		riskLevel: 'destructive',
		description:
			'Delete a SharePoint folder and all its contents [DESTRUCTIVE]',
	},
	'folders.rename': {
		riskLevel: 'write',
		description: 'Rename a SharePoint folder',
	},
	'users.getCurrent': {
		riskLevel: 'read',
		description: 'Get the currently authenticated SharePoint user',
	},
	'users.create': {
		riskLevel: 'write',
		description: 'Add an Azure AD user to the SharePoint site',
	},
	'users.find': {
		riskLevel: 'read',
		description: 'Find SharePoint users by name or email',
	},
	'users.remove': {
		riskLevel: 'destructive',
		description: 'Remove a user from the SharePoint site [DESTRUCTIVE]',
	},
	'users.ensure': {
		riskLevel: 'write',
		description: 'Ensure a user exists in SharePoint (create if not present)',
	},
	'users.listSite': {
		riskLevel: 'read',
		description: 'List all users in the SharePoint site',
	},
	'users.listGroups': {
		riskLevel: 'read',
		description: 'List all site groups',
	},
	'users.getGroupUsers': {
		riskLevel: 'read',
		description: 'Get users belonging to a SharePoint site group by name',
	},
	'users.getGroupUsersById': {
		riskLevel: 'read',
		description: 'Get users belonging to a SharePoint site group by ID',
	},
	'users.getEffectivePermissions': {
		riskLevel: 'read',
		description: 'Get the effective permissions of a user on the web',
	},
	'search.query': {
		riskLevel: 'read',
		description: 'Execute a full-text search query against SharePoint',
	},
	'search.suggest': {
		riskLevel: 'read',
		description: 'Get query suggestions from SharePoint search',
	},
	'contentTypes.get': {
		riskLevel: 'read',
		description: 'Get a SharePoint content type by ID',
	},
	'contentTypes.getAll': {
		riskLevel: 'read',
		description: 'Get all content types defined on the site',
	},
	'contentTypes.getForList': {
		riskLevel: 'read',
		description: 'Get content types available for a specific list',
	},
	'contentTypes.getById': {
		riskLevel: 'read',
		description: 'Get a content type from a list by its ID',
	},
	'contentTypes.create': {
		riskLevel: 'write',
		description: 'Create a new SharePoint content type',
	},
	'contentTypes.update': {
		riskLevel: 'write',
		description: 'Update an existing SharePoint content type',
	},
	'contentTypes.addFieldLink': {
		riskLevel: 'write',
		description: 'Add a field link to a list content type',
	},
	'contentTypes.createListField': {
		riskLevel: 'write',
		description: 'Create a new field (column) on a SharePoint list',
	},
	'permissions.addRoleToItem': {
		riskLevel: 'write',
		description: 'Grant a role assignment to a user on a list item',
	},
	'permissions.addRoleToList': {
		riskLevel: 'write',
		description: 'Grant a role assignment to a user on a SharePoint list',
	},
	'permissions.breakInheritanceOnItem': {
		riskLevel: 'write',
		description: 'Break permission inheritance on a list item',
	},
	'permissions.breakInheritanceOnList': {
		riskLevel: 'write',
		description: 'Break permission inheritance on a SharePoint list',
	},
	'permissions.getRoleDefinitions': {
		riskLevel: 'read',
		description: 'Get all role definitions (permission levels) in the site',
	},
	'web.getInfo': {
		riskLevel: 'read',
		description: 'Get information about the current SharePoint web/site',
	},
	'web.getSiteCollectionInfo': {
		riskLevel: 'read',
		description: 'Get information about the SharePoint site collection',
	},
	'web.getSitePage': {
		riskLevel: 'read',
		description: 'Get the content of a SharePoint modern site page',
	},
	'web.createSubsite': {
		riskLevel: 'write',
		description: 'Create a new SharePoint subsite',
	},
	'web.updateSite': {
		riskLevel: 'write',
		description: 'Update SharePoint site title or description',
	},
	'web.getContextInfo': {
		riskLevel: 'read',
		description: 'Get SharePoint context info including form digest token',
	},
	'web.getDriveItemByPath': {
		riskLevel: 'read',
		description: 'Get a drive item by its path using Microsoft Graph',
	},
	'web.logEvent': {
		riskLevel: 'write',
		description: 'Log a custom event to the SharePoint ULS log',
	},
	'recycleBin.list': {
		riskLevel: 'read',
		description: 'List items in the SharePoint recycle bin',
	},
	'recycleBin.restore': {
		riskLevel: 'write',
		description: 'Restore an item from the SharePoint recycle bin',
	},
	'recycleBin.deletePermanent': {
		riskLevel: 'destructive',
		description:
			'Permanently delete an item from the recycle bin [DESTRUCTIVE]',
	},
	'drive.getAnalytics': {
		riskLevel: 'read',
		description: 'Get analytics for a SharePoint drive item via Graph API',
	},
	'drive.listRecentItems': {
		riskLevel: 'read',
		description: 'List recently accessed drive items via Graph API',
	},
	'drive.restoreVersion': {
		riskLevel: 'write',
		description: 'Restore a previous version of a drive item via Graph API',
	},
	'drive.deleteVersion': {
		riskLevel: 'destructive',
		description: 'Delete a specific version of a drive item [DESTRUCTIVE]',
	},
	'drive.createSharingLink': {
		riskLevel: 'write',
		description: 'Create a sharing link for a drive item via Graph API',
	},
	'drive.updateItem': {
		riskLevel: 'write',
		description: 'Update a drive item (rename, move) via Graph API',
	},
	'social.follow': {
		riskLevel: 'write',
		description: 'Follow a SharePoint actor (person, document, site, tag)',
	},
	'social.isFollowed': {
		riskLevel: 'read',
		description: 'Check if the current user is following an actor',
	},
	'social.getFollowed': {
		riskLevel: 'read',
		description: 'Get entities followed by the current user',
	},
	'social.getFollowers': {
		riskLevel: 'read',
		description: 'Get followers of the current user',
	},
	'webhookSubscriptions.get': {
		riskLevel: 'read',
		description: 'Get a specific SharePoint webhook subscription',
	},
	'webhookSubscriptions.getAll': {
		riskLevel: 'read',
		description: 'Get all webhook subscriptions for a SharePoint list',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof sharepointEndpointsNested
>;

const sharepointWebhookSchemas = {
	'lists.listChanged': {
		description: 'A SharePoint list item was created, updated, or deleted',
		payload: SharepointListChangedPayloadSchema,
		response: ListChangedEventSchema,
	},
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// Plugin type and factory
// ─────────────────────────────────────────────────────────────────────────────

export type BaseSharepointPlugin<T extends SharepointPluginOptions> =
	CorsairPlugin<
		'sharepoint',
		typeof SharepointSchema,
		typeof sharepointEndpointsNested,
		typeof sharepointWebhooksNested,
		T,
		typeof defaultAuthType,
		typeof sharepointAuthConfig
	>;

export type InternalSharepointPlugin =
	BaseSharepointPlugin<SharepointPluginOptions>;

export type ExternalSharepointPlugin<T extends SharepointPluginOptions> =
	BaseSharepointPlugin<T>;

export function sharepoint<const T extends SharepointPluginOptions>(
	incomingOptions: SharepointPluginOptions & T = {} as SharepointPluginOptions &
		T,
): ExternalSharepointPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'sharepoint',
		schema: SharepointSchema,
		options,
		authConfig: sharepointAuthConfig,
		oauthConfig: {
			providerName: 'Microsoft',
			authUrl: 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize',
			tokenUrl: 'https://login.microsoftonline.com/common/oauth2/v2.0/token',
			scopes: [
				'offline_access',
				'Sites.Read.All',
				'Sites.ReadWrite.All',
				'Sites.Manage.All',
				'Sites.FullControl.All'
			],
		},
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: sharepointEndpointsNested,
		webhooks: sharepointWebhooksNested,
		endpointMeta: sharepointEndpointMeta,
		endpointSchemas: sharepointEndpointSchemas,
		webhookSchemas: sharepointWebhookSchemas,
		pluginWebhookMatcher: (request) => {
			const headers = request.headers;
			// SharePoint webhook notifications are identified by their JSON body structure
			// containing a "value" array of notification objects
			const contentType = Array.isArray(headers['content-type'])
				? headers['content-type'][0]
				: headers['content-type'];
			return (
				typeof contentType === 'string' &&
				contentType.includes('application/json')
			);
		},
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: SharepointKeyBuilderContext, source) => {
			if (source === 'webhook' && options.webhookClientState) {
				return options.webhookClientState;
			}

			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (ctx.authType === 'oauth_2') {
				const [accessToken, expiresAt, refreshToken] = await Promise.all([
					ctx.keys.get_access_token(),
					ctx.keys.get_expires_at(),
					ctx.keys.get_refresh_token(),
				]);

				if (!refreshToken) {
					throw new Error(
						'[corsair:sharepoint] No refresh token found. Run `corsair auth --plugin=sharepoint` to re-authenticate.',
					);
				}

				const creds = await ctx.keys.get_integration_credentials();

				if (!creds.client_id || !creds.client_secret) {
					throw new Error(
						'[corsair:sharepoint] Missing client_id or client_secret. Run `corsair setup --sharepoint` to configure credentials.',
					);
				}

				let result: Awaited<ReturnType<typeof getValidSharepointAccessToken>>;
				try {
					result = await getValidSharepointAccessToken({
						accessToken,
						expiresAt,
						refreshToken,
						clientId: creds.client_id,
						clientSecret: creds.client_secret,
					});
				} catch (error) {
					throw new Error(
						`[corsair:sharepoint] Failed to obtain valid access token: ${error instanceof Error ? error.message : String(error)}`,
					);
				}

				if (result.refreshed) {
					try {
						await ctx.keys.set_access_token(result.accessToken);
						await ctx.keys.set_expires_at(String(result.expiresAt));
						// Microsoft issues a new refresh token on each refresh — persist it
						if (result.newRefreshToken) {
							await ctx.keys.set_refresh_token(result.newRefreshToken);
						}
					} catch (error) {
						throw new Error(
							`[corsair:sharepoint] Token was refreshed but failed to persist new credentials: ${error instanceof Error ? error.message : String(error)}`,
						);
					}
				}

				// Expose a force-refresh function so endpoints can retry on 401
				// without waiting for expires_at to lapse
				(ctx as Record<string, unknown>)._refreshAuth = async () => {
					const freshResult = await getValidSharepointAccessToken({
						accessToken: null,
						expiresAt: null,
						refreshToken,
						clientId: creds.client_id!,
						clientSecret: creds.client_secret!,
						forceRefresh: true,
					});
					await ctx.keys.set_access_token(freshResult.accessToken);
					await ctx.keys.set_expires_at(String(freshResult.expiresAt));
					if (freshResult.newRefreshToken) {
						await ctx.keys.set_refresh_token(freshResult.newRefreshToken);
					}
					return freshResult.accessToken;
				};

				return result.accessToken;
			}

			return '';
		},
	} satisfies InternalSharepointPlugin;
}

// ─────────────────────────────────────────────────────────────────────────────
// Webhook Type Exports
// ─────────────────────────────────────────────────────────────────────────────

export type {
	ListChangedEvent,
	SharepointListChangedPayload,
	SharepointWebhookNotification,
	SharepointWebhookOutputs,
} from './webhooks/types';

export { createSharepointMatch } from './webhooks/types';
