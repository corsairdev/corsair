import {
	get as getDrive,
	getGroup,
	getQuota,
	getRecentItems,
	getRoot,
	getSharedItems,
	getSpecialFolder,
	listBundles,
	listChanges,
	listActivities as listDriveActivities,
	list as listDrives,
} from './drive';
import {
	createFolder,
	createTextFile,
	findFile,
	findFolder,
	list as listFiles,
	upload,
} from './files';
import {
	checkin,
	checkout,
	copy,
	deleteItem,
	deletePermanently,
	discardCheckout,
	download,
	downloadAsFormat,
	downloadByPath,
	downloadVersion,
	follow,
	get,
	getDriveItemBySharingUrl,
	getFollowed,
	getThumbnails,
	getVersions,
	listFolderChildren,
	listActivities as listItemActivities,
	move,
	preview,
	restore,
	search,
	unfollow,
	updateContent,
	updateMetadata,
} from './items';
import {
	createForItem,
	createLink,
	deleteFromItem,
	deleteSharePermission,
	getForItem,
	getShare,
	grantSharePermission,
	inviteUser,
	listSharePermissions,
	updateForItem,
} from './permissions';
import {
	getListItems,
	getSite,
	getSitePage,
	listListItemsDelta,
	listSiteColumns,
	listSiteItemsDelta,
	listSiteLists,
	listSiteSubsites,
} from './sharepoint';
import { list as listSubscriptions } from './subscriptions';

export const Items = {
	get,
	updateMetadata,
	delete: deleteItem,
	deletePermanently,
	copy,
	move,
	restore,
	search,
	checkin,
	checkout,
	discardCheckout,
	follow,
	unfollow,
	getFollowed,
	getVersions,
	getThumbnails,
	download,
	downloadByPath,
	downloadAsFormat,
	downloadVersion,
	updateContent,
	preview,
	getDriveItemBySharingUrl,
	listFolderChildren,
	listActivities: listItemActivities,
};

export const Drive = {
	get: getDrive,
	getGroup,
	list: listDrives,
	getRoot,
	getSpecialFolder,
	getQuota,
	getRecentItems,
	getSharedItems,
	listActivities: listDriveActivities,
	listChanges,
	listBundles,
};

export const Files = {
	createFolder,
	createTextFile,
	findFile,
	findFolder,
	list: listFiles,
	upload,
};

export const Permissions = {
	getForItem,
	createForItem,
	updateForItem,
	deleteFromItem,
	inviteUser,
	createLink,
	listSharePermissions,
	deleteSharePermission,
	grantSharePermission,
	getShare,
};

export const SharePoint = {
	getSite,
	getSitePage,
	getListItems,
	listSiteLists,
	listSiteColumns,
	listSiteSubsites,
	listListItemsDelta,
	listSiteItemsDelta,
};

export const Subscriptions = {
	list: listSubscriptions,
};

export * from './types';
