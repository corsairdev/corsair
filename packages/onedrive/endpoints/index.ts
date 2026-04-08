import {
	get,
	updateMetadata,
	deleteItem,
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
	listActivities as listItemActivities,
} from './items';
import {
	get as getDrive,
	getGroup,
	list as listDrives,
	getRoot,
	getSpecialFolder,
	getQuota,
	getRecentItems,
	getSharedItems,
	listActivities as listDriveActivities,
	listChanges,
	listBundles,
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
} from './permissions';
import {
	getSite,
	getSitePage,
	getListItems,
	listSiteLists,
	listSiteColumns,
	listSiteSubsites,
	listListItemsDelta,
	listSiteItemsDelta,
} from './sharepoint';
import {
	list as listSubscriptions,
} from './subscriptions';

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
