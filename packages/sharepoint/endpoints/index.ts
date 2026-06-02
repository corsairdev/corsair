import {
	addFieldLink as contentTypesAddFieldLink,
	create as contentTypesCreate,
	createListField as contentTypesCreateListField,
	get as contentTypesGet,
	getAll as contentTypesGetAll,
	getById as contentTypesGetById,
	getForList as contentTypesGetForList,
	update as contentTypesUpdate,
} from './content-types';
import {
	createSharingLink as driveCreateSharingLink,
	deleteVersion as driveDeleteVersion,
	getAnalytics as driveGetAnalytics,
	listRecentItems as driveListRecentItems,
	restoreVersion as driveRestoreVersion,
	updateItem as driveUpdateItem,
} from './drive';
import {
	checkIn as filesCheckIn,
	checkOut as filesCheckOut,
	download as filesDownload,
	getFile as filesGet,
	listInFolder as filesListInFolder,
	recycle as filesRecycle,
	undoCheckout as filesUndoCheckout,
	upload as filesUpload,
} from './files';
import {
	create as foldersCreate,
	deleteFolder as foldersDelete,
	get as foldersGet,
	getAll as foldersGetAll,
	listSubfolders as foldersListSubfolders,
	rename as foldersRename,
} from './folders';
import {
	addAttachment as itemsAddAttachment,
	create as itemsCreate,
	createByGuid as itemsCreateByGuid,
	createInFolder as itemsCreateInFolder,
	deleteItem as itemsDelete,
	get as itemsGet,
	getAttachmentContent as itemsGetAttachmentContent,
	getEtag as itemsGetEtag,
	getVersion as itemsGetVersion,
	list as itemsList,
	listAttachments as itemsListAttachments,
	listByGuid as itemsListByGuid,
	recycle as itemsRecycle,
	update as itemsUpdate,
} from './items';
import {
	create as listsCreate,
	deleteList as listsDelete,
	deleteByTitle as listsDeleteByTitle,
	getByGuid as listsGetByGuid,
	getByTitle as listsGetByTitle,
	getChanges as listsGetChanges,
	listAll as listsListAll,
	listColumns as listsListColumns,
	renderDataAsStream as listsRenderDataAsStream,
	update as listsUpdate,
} from './lists';
import {
	addRoleToItem as permissionsAddRoleToItem,
	addRoleToList as permissionsAddRoleToList,
	breakInheritanceOnItem as permissionsBreakInheritanceOnItem,
	breakInheritanceOnList as permissionsBreakInheritanceOnList,
	getRoleDefinitions as permissionsGetRoleDefinitions,
} from './permissions';
import {
	deletePermanent as recycleBinDeletePermanent,
	list as recycleBinList,
	restore as recycleBinRestore,
} from './recycle-bin';
import { query as searchQuery, suggest as searchSuggest } from './search';
import {
	follow as socialFollow,
	getFollowed as socialGetFollowed,
	getFollowers as socialGetFollowers,
	isFollowed as socialIsFollowed,
} from './social';
import {
	create as usersCreate,
	ensure as usersEnsure,
	find as usersFind,
	getCurrent as usersGetCurrent,
	getEffectivePermissions as usersGetEffectivePermissions,
	getGroupUsers as usersGetGroupUsers,
	getGroupUsersById as usersGetGroupUsersById,
	listGroups as usersListGroups,
	listSite as usersListSite,
	remove as usersRemove,
} from './users';
import {
	createSubsite as webCreateSubsite,
	getContextInfo as webGetContextInfo,
	getDriveItemByPath as webGetDriveItemByPath,
	getInfo as webGetInfo,
	getSiteCollectionInfo as webGetSiteCollectionInfo,
	getSitePage as webGetSitePage,
	logEvent as webLogEvent,
	updateSite as webUpdateSite,
} from './web';
import {
	get as webhookSubscriptionsGet,
	getAll as webhookSubscriptionsGetAll,
} from './webhook-subscriptions';

export const Lists = {
	listAll: listsListAll,
	getByTitle: listsGetByTitle,
	getByGuid: listsGetByGuid,
	create: listsCreate,
	update: listsUpdate,
	delete: listsDelete,
	deleteByTitle: listsDeleteByTitle,
	listColumns: listsListColumns,
	getChanges: listsGetChanges,
	renderDataAsStream: listsRenderDataAsStream,
};

export const Items = {
	list: itemsList,
	listByGuid: itemsListByGuid,
	get: itemsGet,
	create: itemsCreate,
	createByGuid: itemsCreateByGuid,
	createInFolder: itemsCreateInFolder,
	update: itemsUpdate,
	delete: itemsDelete,
	recycle: itemsRecycle,
	getVersion: itemsGetVersion,
	getEtag: itemsGetEtag,
	addAttachment: itemsAddAttachment,
	getAttachmentContent: itemsGetAttachmentContent,
	listAttachments: itemsListAttachments,
};

export const Files = {
	upload: filesUpload,
	download: filesDownload,
	listInFolder: filesListInFolder,
	recycle: filesRecycle,
	checkIn: filesCheckIn,
	checkOut: filesCheckOut,
	undoCheckout: filesUndoCheckout,
	get: filesGet,
};

export const Folders = {
	create: foldersCreate,
	get: foldersGet,
	getAll: foldersGetAll,
	listSubfolders: foldersListSubfolders,
	delete: foldersDelete,
	rename: foldersRename,
};

export const Users = {
	getCurrent: usersGetCurrent,
	create: usersCreate,
	find: usersFind,
	remove: usersRemove,
	ensure: usersEnsure,
	listSite: usersListSite,
	listGroups: usersListGroups,
	getGroupUsers: usersGetGroupUsers,
	getGroupUsersById: usersGetGroupUsersById,
	getEffectivePermissions: usersGetEffectivePermissions,
};

export const Search = {
	query: searchQuery,
	suggest: searchSuggest,
};

export const ContentTypes = {
	get: contentTypesGet,
	getAll: contentTypesGetAll,
	getForList: contentTypesGetForList,
	getById: contentTypesGetById,
	create: contentTypesCreate,
	update: contentTypesUpdate,
	addFieldLink: contentTypesAddFieldLink,
	createListField: contentTypesCreateListField,
};

export const Permissions = {
	addRoleToItem: permissionsAddRoleToItem,
	addRoleToList: permissionsAddRoleToList,
	breakInheritanceOnItem: permissionsBreakInheritanceOnItem,
	breakInheritanceOnList: permissionsBreakInheritanceOnList,
	getRoleDefinitions: permissionsGetRoleDefinitions,
};

export const Web = {
	getInfo: webGetInfo,
	getSiteCollectionInfo: webGetSiteCollectionInfo,
	getSitePage: webGetSitePage,
	createSubsite: webCreateSubsite,
	updateSite: webUpdateSite,
	getContextInfo: webGetContextInfo,
	getDriveItemByPath: webGetDriveItemByPath,
	logEvent: webLogEvent,
};

export const RecycleBin = {
	list: recycleBinList,
	restore: recycleBinRestore,
	deletePermanent: recycleBinDeletePermanent,
};

export const Drive = {
	getAnalytics: driveGetAnalytics,
	listRecentItems: driveListRecentItems,
	restoreVersion: driveRestoreVersion,
	deleteVersion: driveDeleteVersion,
	createSharingLink: driveCreateSharingLink,
	updateItem: driveUpdateItem,
};

export const Social = {
	follow: socialFollow,
	isFollowed: socialIsFollowed,
	getFollowed: socialGetFollowed,
	getFollowers: socialGetFollowers,
};

export const WebhookSubscriptions = {
	get: webhookSubscriptionsGet,
	getAll: webhookSubscriptionsGetAll,
};

export * from './types';
