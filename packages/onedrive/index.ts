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
	RequiredPluginWebhookSchemas,
} from 'corsair/core';
import { getValidAccessToken } from './client';
import {
	Drive,
	Files,
	Items,
	Permissions,
	SharePoint,
	Subscriptions,
} from './endpoints';
import type {
	OnedriveEndpointInputs,
	OnedriveEndpointOutputs,
} from './endpoints/types';
import {
	OnedriveEndpointInputSchemas,
	OnedriveEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { OnedriveSchema } from './schema';
import { DriveWebhooks } from './webhooks';
import type {
	OnedriveValidationPayload,
	OnedriveWebhookOutputs,
	OnedriveWebhookPayload,
} from './webhooks/types';
import {
	createOnedriveMatch,
	createOnedriveValidationMatch,
	OnedriveNotificationSchema,
	OnedriveValidationPayloadSchema,
	OnedriveWebhookPayloadSchema,
} from './webhooks/types';

export type OnedrivePluginOptions = {
	authType?: PickAuth<'oauth_2'>;
	key?: string;
	hooks?: InternalOnedrivePlugin['hooks'];
	webhookHooks?: InternalOnedrivePlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof onedriveEndpointsNested>;
	webhookSecret?: string;
};

export type OnedriveContext = CorsairPluginContext<
	typeof OnedriveSchema,
	OnedrivePluginOptions
>;

export type OnedriveKeyBuilderContext =
	KeyBuilderContext<OnedrivePluginOptions>;

export type OnedriveBoundEndpoints = BindEndpoints<
	typeof onedriveEndpointsNested
>;

type OnedriveEndpoint<K extends keyof OnedriveEndpointOutputs> =
	CorsairEndpoint<
		OnedriveContext,
		OnedriveEndpointInputs[K],
		OnedriveEndpointOutputs[K]
	>;

export type OnedriveEndpoints = {
	// Items
	itemsGet: OnedriveEndpoint<'itemsGet'>;
	itemsUpdateMetadata: OnedriveEndpoint<'itemsUpdateMetadata'>;
	itemsDelete: OnedriveEndpoint<'itemsDelete'>;
	itemsDeletePermanently: OnedriveEndpoint<'itemsDeletePermanently'>;
	itemsCopy: OnedriveEndpoint<'itemsCopy'>;
	itemsMove: OnedriveEndpoint<'itemsMove'>;
	itemsRestore: OnedriveEndpoint<'itemsRestore'>;
	itemsSearch: OnedriveEndpoint<'itemsSearch'>;
	itemsCheckin: OnedriveEndpoint<'itemsCheckin'>;
	itemsCheckout: OnedriveEndpoint<'itemsCheckout'>;
	itemsDiscardCheckout: OnedriveEndpoint<'itemsDiscardCheckout'>;
	itemsFollow: OnedriveEndpoint<'itemsFollow'>;
	itemsUnfollow: OnedriveEndpoint<'itemsUnfollow'>;
	itemsGetFollowed: OnedriveEndpoint<'itemsGetFollowed'>;
	itemsGetVersions: OnedriveEndpoint<'itemsGetVersions'>;
	itemsGetThumbnails: OnedriveEndpoint<'itemsGetThumbnails'>;
	itemsDownload: OnedriveEndpoint<'itemsDownload'>;
	itemsDownloadByPath: OnedriveEndpoint<'itemsDownloadByPath'>;
	itemsDownloadAsFormat: OnedriveEndpoint<'itemsDownloadAsFormat'>;
	itemsDownloadVersion: OnedriveEndpoint<'itemsDownloadVersion'>;
	itemsUpdateContent: OnedriveEndpoint<'itemsUpdateContent'>;
	itemsPreview: OnedriveEndpoint<'itemsPreview'>;
	itemsGetDriveItemBySharingUrl: OnedriveEndpoint<'itemsGetDriveItemBySharingUrl'>;
	itemsListFolderChildren: OnedriveEndpoint<'itemsListFolderChildren'>;
	itemsListActivities: OnedriveEndpoint<'itemsListActivities'>;
	// Drive
	driveGet: OnedriveEndpoint<'driveGet'>;
	driveGetGroup: OnedriveEndpoint<'driveGetGroup'>;
	driveList: OnedriveEndpoint<'driveList'>;
	driveGetRoot: OnedriveEndpoint<'driveGetRoot'>;
	driveGetSpecialFolder: OnedriveEndpoint<'driveGetSpecialFolder'>;
	driveGetQuota: OnedriveEndpoint<'driveGetQuota'>;
	driveGetRecentItems: OnedriveEndpoint<'driveGetRecentItems'>;
	driveGetSharedItems: OnedriveEndpoint<'driveGetSharedItems'>;
	driveListActivities: OnedriveEndpoint<'driveListActivities'>;
	driveListChanges: OnedriveEndpoint<'driveListChanges'>;
	driveListBundles: OnedriveEndpoint<'driveListBundles'>;
	// Files
	filesCreateFolder: OnedriveEndpoint<'filesCreateFolder'>;
	filesCreateTextFile: OnedriveEndpoint<'filesCreateTextFile'>;
	filesFindFile: OnedriveEndpoint<'filesFindFile'>;
	filesFindFolder: OnedriveEndpoint<'filesFindFolder'>;
	filesList: OnedriveEndpoint<'filesList'>;
	filesUpload: OnedriveEndpoint<'filesUpload'>;
	// Permissions
	permissionsGetForItem: OnedriveEndpoint<'permissionsGetForItem'>;
	permissionsCreateForItem: OnedriveEndpoint<'permissionsCreateForItem'>;
	permissionsUpdateForItem: OnedriveEndpoint<'permissionsUpdateForItem'>;
	permissionsDeleteFromItem: OnedriveEndpoint<'permissionsDeleteFromItem'>;
	permissionsInviteUser: OnedriveEndpoint<'permissionsInviteUser'>;
	permissionsCreateLink: OnedriveEndpoint<'permissionsCreateLink'>;
	permissionsListSharePermissions: OnedriveEndpoint<'permissionsListSharePermissions'>;
	permissionsDeleteSharePermission: OnedriveEndpoint<'permissionsDeleteSharePermission'>;
	permissionsGrantSharePermission: OnedriveEndpoint<'permissionsGrantSharePermission'>;
	permissionsGetShare: OnedriveEndpoint<'permissionsGetShare'>;
	// SharePoint
	sharepointGetSite: OnedriveEndpoint<'sharepointGetSite'>;
	sharepointGetSitePage: OnedriveEndpoint<'sharepointGetSitePage'>;
	sharepointGetListItems: OnedriveEndpoint<'sharepointGetListItems'>;
	sharepointListSiteLists: OnedriveEndpoint<'sharepointListSiteLists'>;
	sharepointListSiteColumns: OnedriveEndpoint<'sharepointListSiteColumns'>;
	sharepointListSiteSubsites: OnedriveEndpoint<'sharepointListSiteSubsites'>;
	sharepointListListItemsDelta: OnedriveEndpoint<'sharepointListListItemsDelta'>;
	sharepointListSiteItemsDelta: OnedriveEndpoint<'sharepointListSiteItemsDelta'>;
	// Subscriptions
	subscriptionsList: OnedriveEndpoint<'subscriptionsList'>;
};

type OnedriveWebhook<
	K extends keyof OnedriveWebhookOutputs,
	TPayload,
> = CorsairWebhook<OnedriveContext, TPayload, OnedriveWebhookOutputs[K]>;

export type OnedriveWebhooks = {
	validation: OnedriveWebhook<'validation', OnedriveValidationPayload>;
	driveNotification: OnedriveWebhook<
		'driveNotification',
		OnedriveWebhookPayload
	>;
};

export type OnedriveBoundWebhooks = BindWebhooks<OnedriveWebhooks>;

const onedriveEndpointsNested = {
	items: {
		get: Items.get,
		updateMetadata: Items.updateMetadata,
		delete: Items.delete,
		deletePermanently: Items.deletePermanently,
		copy: Items.copy,
		move: Items.move,
		restore: Items.restore,
		search: Items.search,
		checkin: Items.checkin,
		checkout: Items.checkout,
		discardCheckout: Items.discardCheckout,
		follow: Items.follow,
		unfollow: Items.unfollow,
		getFollowed: Items.getFollowed,
		getVersions: Items.getVersions,
		getThumbnails: Items.getThumbnails,
		download: Items.download,
		downloadByPath: Items.downloadByPath,
		downloadAsFormat: Items.downloadAsFormat,
		downloadVersion: Items.downloadVersion,
		updateContent: Items.updateContent,
		preview: Items.preview,
		getDriveItemBySharingUrl: Items.getDriveItemBySharingUrl,
		listFolderChildren: Items.listFolderChildren,
		listActivities: Items.listActivities,
	},
	drive: {
		get: Drive.get,
		getGroup: Drive.getGroup,
		list: Drive.list,
		getRoot: Drive.getRoot,
		getSpecialFolder: Drive.getSpecialFolder,
		getQuota: Drive.getQuota,
		getRecentItems: Drive.getRecentItems,
		getSharedItems: Drive.getSharedItems,
		listActivities: Drive.listActivities,
		listChanges: Drive.listChanges,
		listBundles: Drive.listBundles,
	},
	files: {
		createFolder: Files.createFolder,
		createTextFile: Files.createTextFile,
		findFile: Files.findFile,
		findFolder: Files.findFolder,
		list: Files.list,
		upload: Files.upload,
	},
	permissions: {
		getForItem: Permissions.getForItem,
		createForItem: Permissions.createForItem,
		updateForItem: Permissions.updateForItem,
		deleteFromItem: Permissions.deleteFromItem,
		inviteUser: Permissions.inviteUser,
		createLink: Permissions.createLink,
		listSharePermissions: Permissions.listSharePermissions,
		deleteSharePermission: Permissions.deleteSharePermission,
		grantSharePermission: Permissions.grantSharePermission,
		getShare: Permissions.getShare,
	},
	sharepoint: {
		getSite: SharePoint.getSite,
		getSitePage: SharePoint.getSitePage,
		getListItems: SharePoint.getListItems,
		listSiteLists: SharePoint.listSiteLists,
		listSiteColumns: SharePoint.listSiteColumns,
		listSiteSubsites: SharePoint.listSiteSubsites,
		listListItemsDelta: SharePoint.listListItemsDelta,
		listSiteItemsDelta: SharePoint.listSiteItemsDelta,
	},
	subscriptions: {
		list: Subscriptions.list,
	},
} as const;

const onedriveWebhooksNested = {
	drive: {
		validation: DriveWebhooks.validation,
		driveNotification: DriveWebhooks.driveNotification,
	},
} as const;

export const onedriveEndpointSchemas = {
	// Items
	'items.get': {
		input: OnedriveEndpointInputSchemas.itemsGet,
		output: OnedriveEndpointOutputSchemas.itemsGet,
	},
	'items.updateMetadata': {
		input: OnedriveEndpointInputSchemas.itemsUpdateMetadata,
		output: OnedriveEndpointOutputSchemas.itemsUpdateMetadata,
	},
	'items.delete': {
		input: OnedriveEndpointInputSchemas.itemsDelete,
		output: OnedriveEndpointOutputSchemas.itemsDelete,
	},
	'items.deletePermanently': {
		input: OnedriveEndpointInputSchemas.itemsDeletePermanently,
		output: OnedriveEndpointOutputSchemas.itemsDeletePermanently,
	},
	'items.copy': {
		input: OnedriveEndpointInputSchemas.itemsCopy,
		output: OnedriveEndpointOutputSchemas.itemsCopy,
	},
	'items.move': {
		input: OnedriveEndpointInputSchemas.itemsMove,
		output: OnedriveEndpointOutputSchemas.itemsMove,
	},
	'items.restore': {
		input: OnedriveEndpointInputSchemas.itemsRestore,
		output: OnedriveEndpointOutputSchemas.itemsRestore,
	},
	'items.search': {
		input: OnedriveEndpointInputSchemas.itemsSearch,
		output: OnedriveEndpointOutputSchemas.itemsSearch,
	},
	'items.checkin': {
		input: OnedriveEndpointInputSchemas.itemsCheckin,
		output: OnedriveEndpointOutputSchemas.itemsCheckin,
	},
	'items.checkout': {
		input: OnedriveEndpointInputSchemas.itemsCheckout,
		output: OnedriveEndpointOutputSchemas.itemsCheckout,
	},
	'items.discardCheckout': {
		input: OnedriveEndpointInputSchemas.itemsDiscardCheckout,
		output: OnedriveEndpointOutputSchemas.itemsDiscardCheckout,
	},
	'items.follow': {
		input: OnedriveEndpointInputSchemas.itemsFollow,
		output: OnedriveEndpointOutputSchemas.itemsFollow,
	},
	'items.unfollow': {
		input: OnedriveEndpointInputSchemas.itemsUnfollow,
		output: OnedriveEndpointOutputSchemas.itemsUnfollow,
	},
	'items.getFollowed': {
		input: OnedriveEndpointInputSchemas.itemsGetFollowed,
		output: OnedriveEndpointOutputSchemas.itemsGetFollowed,
	},
	'items.getVersions': {
		input: OnedriveEndpointInputSchemas.itemsGetVersions,
		output: OnedriveEndpointOutputSchemas.itemsGetVersions,
	},
	'items.getThumbnails': {
		input: OnedriveEndpointInputSchemas.itemsGetThumbnails,
		output: OnedriveEndpointOutputSchemas.itemsGetThumbnails,
	},
	'items.download': {
		input: OnedriveEndpointInputSchemas.itemsDownload,
		output: OnedriveEndpointOutputSchemas.itemsDownload,
	},
	'items.downloadByPath': {
		input: OnedriveEndpointInputSchemas.itemsDownloadByPath,
		output: OnedriveEndpointOutputSchemas.itemsDownloadByPath,
	},
	'items.downloadAsFormat': {
		input: OnedriveEndpointInputSchemas.itemsDownloadAsFormat,
		output: OnedriveEndpointOutputSchemas.itemsDownloadAsFormat,
	},
	'items.downloadVersion': {
		input: OnedriveEndpointInputSchemas.itemsDownloadVersion,
		output: OnedriveEndpointOutputSchemas.itemsDownloadVersion,
	},
	'items.updateContent': {
		input: OnedriveEndpointInputSchemas.itemsUpdateContent,
		output: OnedriveEndpointOutputSchemas.itemsUpdateContent,
	},
	'items.preview': {
		input: OnedriveEndpointInputSchemas.itemsPreview,
		output: OnedriveEndpointOutputSchemas.itemsPreview,
	},
	'items.getDriveItemBySharingUrl': {
		input: OnedriveEndpointInputSchemas.itemsGetDriveItemBySharingUrl,
		output: OnedriveEndpointOutputSchemas.itemsGetDriveItemBySharingUrl,
	},
	'items.listFolderChildren': {
		input: OnedriveEndpointInputSchemas.itemsListFolderChildren,
		output: OnedriveEndpointOutputSchemas.itemsListFolderChildren,
	},
	'items.listActivities': {
		input: OnedriveEndpointInputSchemas.itemsListActivities,
		output: OnedriveEndpointOutputSchemas.itemsListActivities,
	},
	// Drive
	'drive.get': {
		input: OnedriveEndpointInputSchemas.driveGet,
		output: OnedriveEndpointOutputSchemas.driveGet,
	},
	'drive.getGroup': {
		input: OnedriveEndpointInputSchemas.driveGetGroup,
		output: OnedriveEndpointOutputSchemas.driveGetGroup,
	},
	'drive.list': {
		input: OnedriveEndpointInputSchemas.driveList,
		output: OnedriveEndpointOutputSchemas.driveList,
	},
	'drive.getRoot': {
		input: OnedriveEndpointInputSchemas.driveGetRoot,
		output: OnedriveEndpointOutputSchemas.driveGetRoot,
	},
	'drive.getSpecialFolder': {
		input: OnedriveEndpointInputSchemas.driveGetSpecialFolder,
		output: OnedriveEndpointOutputSchemas.driveGetSpecialFolder,
	},
	'drive.getQuota': {
		input: OnedriveEndpointInputSchemas.driveGetQuota,
		output: OnedriveEndpointOutputSchemas.driveGetQuota,
	},
	'drive.getRecentItems': {
		input: OnedriveEndpointInputSchemas.driveGetRecentItems,
		output: OnedriveEndpointOutputSchemas.driveGetRecentItems,
	},
	'drive.getSharedItems': {
		input: OnedriveEndpointInputSchemas.driveGetSharedItems,
		output: OnedriveEndpointOutputSchemas.driveGetSharedItems,
	},
	'drive.listActivities': {
		input: OnedriveEndpointInputSchemas.driveListActivities,
		output: OnedriveEndpointOutputSchemas.driveListActivities,
	},
	'drive.listChanges': {
		input: OnedriveEndpointInputSchemas.driveListChanges,
		output: OnedriveEndpointOutputSchemas.driveListChanges,
	},
	'drive.listBundles': {
		input: OnedriveEndpointInputSchemas.driveListBundles,
		output: OnedriveEndpointOutputSchemas.driveListBundles,
	},
	// Files
	'files.createFolder': {
		input: OnedriveEndpointInputSchemas.filesCreateFolder,
		output: OnedriveEndpointOutputSchemas.filesCreateFolder,
	},
	'files.createTextFile': {
		input: OnedriveEndpointInputSchemas.filesCreateTextFile,
		output: OnedriveEndpointOutputSchemas.filesCreateTextFile,
	},
	'files.findFile': {
		input: OnedriveEndpointInputSchemas.filesFindFile,
		output: OnedriveEndpointOutputSchemas.filesFindFile,
	},
	'files.findFolder': {
		input: OnedriveEndpointInputSchemas.filesFindFolder,
		output: OnedriveEndpointOutputSchemas.filesFindFolder,
	},
	'files.list': {
		input: OnedriveEndpointInputSchemas.filesList,
		output: OnedriveEndpointOutputSchemas.filesList,
	},
	'files.upload': {
		input: OnedriveEndpointInputSchemas.filesUpload,
		output: OnedriveEndpointOutputSchemas.filesUpload,
	},
	// Permissions
	'permissions.getForItem': {
		input: OnedriveEndpointInputSchemas.permissionsGetForItem,
		output: OnedriveEndpointOutputSchemas.permissionsGetForItem,
	},
	'permissions.createForItem': {
		input: OnedriveEndpointInputSchemas.permissionsCreateForItem,
		output: OnedriveEndpointOutputSchemas.permissionsCreateForItem,
	},
	'permissions.updateForItem': {
		input: OnedriveEndpointInputSchemas.permissionsUpdateForItem,
		output: OnedriveEndpointOutputSchemas.permissionsUpdateForItem,
	},
	'permissions.deleteFromItem': {
		input: OnedriveEndpointInputSchemas.permissionsDeleteFromItem,
		output: OnedriveEndpointOutputSchemas.permissionsDeleteFromItem,
	},
	'permissions.inviteUser': {
		input: OnedriveEndpointInputSchemas.permissionsInviteUser,
		output: OnedriveEndpointOutputSchemas.permissionsInviteUser,
	},
	'permissions.createLink': {
		input: OnedriveEndpointInputSchemas.permissionsCreateLink,
		output: OnedriveEndpointOutputSchemas.permissionsCreateLink,
	},
	'permissions.listSharePermissions': {
		input: OnedriveEndpointInputSchemas.permissionsListSharePermissions,
		output: OnedriveEndpointOutputSchemas.permissionsListSharePermissions,
	},
	'permissions.deleteSharePermission': {
		input: OnedriveEndpointInputSchemas.permissionsDeleteSharePermission,
		output: OnedriveEndpointOutputSchemas.permissionsDeleteSharePermission,
	},
	'permissions.grantSharePermission': {
		input: OnedriveEndpointInputSchemas.permissionsGrantSharePermission,
		output: OnedriveEndpointOutputSchemas.permissionsGrantSharePermission,
	},
	'permissions.getShare': {
		input: OnedriveEndpointInputSchemas.permissionsGetShare,
		output: OnedriveEndpointOutputSchemas.permissionsGetShare,
	},
	// SharePoint
	'sharepoint.getSite': {
		input: OnedriveEndpointInputSchemas.sharepointGetSite,
		output: OnedriveEndpointOutputSchemas.sharepointGetSite,
	},
	'sharepoint.getSitePage': {
		input: OnedriveEndpointInputSchemas.sharepointGetSitePage,
		output: OnedriveEndpointOutputSchemas.sharepointGetSitePage,
	},
	'sharepoint.getListItems': {
		input: OnedriveEndpointInputSchemas.sharepointGetListItems,
		output: OnedriveEndpointOutputSchemas.sharepointGetListItems,
	},
	'sharepoint.listSiteLists': {
		input: OnedriveEndpointInputSchemas.sharepointListSiteLists,
		output: OnedriveEndpointOutputSchemas.sharepointListSiteLists,
	},
	'sharepoint.listSiteColumns': {
		input: OnedriveEndpointInputSchemas.sharepointListSiteColumns,
		output: OnedriveEndpointOutputSchemas.sharepointListSiteColumns,
	},
	'sharepoint.listSiteSubsites': {
		input: OnedriveEndpointInputSchemas.sharepointListSiteSubsites,
		output: OnedriveEndpointOutputSchemas.sharepointListSiteSubsites,
	},
	'sharepoint.listListItemsDelta': {
		input: OnedriveEndpointInputSchemas.sharepointListListItemsDelta,
		output: OnedriveEndpointOutputSchemas.sharepointListListItemsDelta,
	},
	'sharepoint.listSiteItemsDelta': {
		input: OnedriveEndpointInputSchemas.sharepointListSiteItemsDelta,
		output: OnedriveEndpointOutputSchemas.sharepointListSiteItemsDelta,
	},
	// Subscriptions
	'subscriptions.list': {
		input: OnedriveEndpointInputSchemas.subscriptionsList,
		output: OnedriveEndpointOutputSchemas.subscriptionsList,
	},
} satisfies RequiredPluginEndpointSchemas<typeof onedriveEndpointsNested>;

const onedriveWebhookSchemas = {
	'drive.validation': {
		description: 'Microsoft Graph OneDrive webhook validation handshake',
		payload: OnedriveValidationPayloadSchema,
		response: OnedriveValidationPayloadSchema,
	},
	'drive.driveNotification': {
		description:
			'Microsoft Graph drive change notification — item created, updated, or deleted',
		payload: OnedriveWebhookPayloadSchema,
		response: OnedriveNotificationSchema,
	},
} satisfies RequiredPluginWebhookSchemas<typeof onedriveWebhooksNested>;

const onedriveEndpointMeta = {
	// Items
	'items.get': { riskLevel: 'read', description: 'Get a drive item by ID' },
	'items.updateMetadata': {
		riskLevel: 'write',
		description: 'Update metadata for a drive item',
	},
	'items.delete': {
		riskLevel: 'destructive',
		description: 'Delete a drive item [DESTRUCTIVE]',
	},
	'items.deletePermanently': {
		riskLevel: 'destructive',
		description: 'Permanently delete a drive item [DESTRUCTIVE]',
	},
	'items.copy': { riskLevel: 'write', description: 'Copy a drive item' },
	'items.move': {
		riskLevel: 'write',
		description: 'Move a drive item to a new location',
	},
	'items.restore': {
		riskLevel: 'write',
		description: 'Restore a deleted drive item',
	},
	'items.search': { riskLevel: 'read', description: 'Search for drive items' },
	'items.checkin': {
		riskLevel: 'write',
		description: 'Check in a checked-out drive item',
	},
	'items.checkout': {
		riskLevel: 'write',
		description: 'Check out a drive item for editing',
	},
	'items.discardCheckout': {
		riskLevel: 'write',
		description: 'Discard the checkout of a drive item',
	},
	'items.follow': { riskLevel: 'write', description: 'Follow a drive item' },
	'items.unfollow': {
		riskLevel: 'write',
		description: 'Unfollow a drive item',
	},
	'items.getFollowed': {
		riskLevel: 'read',
		description: 'Get a followed drive item',
	},
	'items.getVersions': {
		riskLevel: 'read',
		description: 'Get versions of a drive item',
	},
	'items.getThumbnails': {
		riskLevel: 'read',
		description: 'Get thumbnails for a drive item',
	},
	'items.download': { riskLevel: 'read', description: 'Download a file' },
	'items.downloadByPath': {
		riskLevel: 'read',
		description: 'Download a file by path',
	},
	'items.downloadAsFormat': {
		riskLevel: 'read',
		description: 'Download a file converted to a different format',
	},
	'items.downloadVersion': {
		riskLevel: 'read',
		description: 'Download a specific version of a file',
	},
	'items.updateContent': {
		riskLevel: 'write',
		description: 'Update the content of a file',
	},
	'items.preview': {
		riskLevel: 'read',
		description: 'Get a preview URL for a drive item',
	},
	'items.getDriveItemBySharingUrl': {
		riskLevel: 'read',
		description: 'Get a drive item by sharing URL',
	},
	'items.listFolderChildren': {
		riskLevel: 'read',
		description: 'List children of a folder',
	},
	'items.listActivities': {
		riskLevel: 'read',
		description: 'List activities on a drive item',
	},
	// Drive
	'drive.get': { riskLevel: 'read', description: 'Get a drive by ID' },
	'drive.getGroup': { riskLevel: 'read', description: "Get a group's drive" },
	'drive.list': { riskLevel: 'read', description: 'List available drives' },
	'drive.getRoot': {
		riskLevel: 'read',
		description: "Get the root folder of the user's drive",
	},
	'drive.getSpecialFolder': {
		riskLevel: 'read',
		description: 'Get a special folder (documents, photos, cameraroll)',
	},
	'drive.getQuota': {
		riskLevel: 'read',
		description: "Get the user's drive and quota information",
	},
	'drive.getRecentItems': {
		riskLevel: 'read',
		description: 'Get recently accessed drive items',
	},
	'drive.getSharedItems': {
		riskLevel: 'read',
		description: 'Get items shared with the user',
	},
	'drive.listActivities': {
		riskLevel: 'read',
		description: 'List activities across the drive',
	},
	'drive.listChanges': {
		riskLevel: 'read',
		description: 'List changes to drive items using delta',
	},
	'drive.listBundles': {
		riskLevel: 'read',
		description: 'List bundles in a drive',
	},
	// Files
	'files.createFolder': {
		riskLevel: 'write',
		description: 'Create a new folder',
	},
	'files.createTextFile': {
		riskLevel: 'write',
		description: 'Create a new text file with content',
	},
	'files.findFile': { riskLevel: 'read', description: 'Find a file by name' },
	'files.findFolder': {
		riskLevel: 'read',
		description: 'Find a folder by name',
	},
	'files.list': {
		riskLevel: 'read',
		description: 'List files in the root drive',
	},
	'files.upload': {
		riskLevel: 'write',
		description: 'Upload a file to OneDrive',
	},
	// Permissions
	'permissions.getForItem': {
		riskLevel: 'read',
		description: 'Get permissions for a drive item',
	},
	'permissions.createForItem': {
		riskLevel: 'write',
		description: 'Create a permission for a drive item',
	},
	'permissions.updateForItem': {
		riskLevel: 'write',
		description: 'Update a permission on a drive item',
	},
	'permissions.deleteFromItem': {
		riskLevel: 'destructive',
		description: 'Delete a permission from a drive item [DESTRUCTIVE]',
	},
	'permissions.inviteUser': {
		riskLevel: 'write',
		description: 'Invite a user to access a drive item',
	},
	'permissions.createLink': {
		riskLevel: 'write',
		description: 'Create a sharing link for a drive item',
	},
	'permissions.listSharePermissions': {
		riskLevel: 'read',
		description: 'List permissions on a shared drive item',
	},
	'permissions.deleteSharePermission': {
		riskLevel: 'destructive',
		description: 'Delete a share permission [DESTRUCTIVE]',
	},
	'permissions.grantSharePermission': {
		riskLevel: 'write',
		description: 'Grant a permission on a shared item',
	},
	'permissions.getShare': {
		riskLevel: 'read',
		description: 'Get a shared item by share ID or encoded URL',
	},
	// SharePoint
	'sharepoint.getSite': {
		riskLevel: 'read',
		description: 'Get a SharePoint site by ID',
	},
	'sharepoint.getSitePage': {
		riskLevel: 'read',
		description: 'Get a page from a SharePoint site',
	},
	'sharepoint.getListItems': {
		riskLevel: 'read',
		description: 'Get items from a SharePoint list',
	},
	'sharepoint.listSiteLists': {
		riskLevel: 'read',
		description: 'List all lists in a SharePoint site',
	},
	'sharepoint.listSiteColumns': {
		riskLevel: 'read',
		description: 'List site columns in a SharePoint site',
	},
	'sharepoint.listSiteSubsites': {
		riskLevel: 'read',
		description: 'List subsites of a SharePoint site',
	},
	'sharepoint.listListItemsDelta': {
		riskLevel: 'read',
		description: 'List changes to SharePoint list items using delta',
	},
	'sharepoint.listSiteItemsDelta': {
		riskLevel: 'read',
		description: 'List changes to all drive items in a site using delta',
	},
	// Subscriptions
	'subscriptions.list': {
		riskLevel: 'read',
		description: 'List all active subscriptions',
	},
} satisfies RequiredPluginEndpointMeta<typeof onedriveEndpointsNested>;

const defaultAuthType = 'oauth_2' as const;

export const onedriveAuthConfig = {
	oauth_2: {
		account: ['one'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseOnedrivePlugin<PluginOptions extends OnedrivePluginOptions> =
	CorsairPlugin<
		'onedrive',
		typeof OnedriveSchema,
		typeof onedriveEndpointsNested,
		typeof onedriveWebhooksNested,
		PluginOptions,
		typeof defaultAuthType
	>;

export type InternalOnedrivePlugin = BaseOnedrivePlugin<OnedrivePluginOptions>;

export type ExternalOnedrivePlugin<
	PluginOptions extends OnedrivePluginOptions,
> = BaseOnedrivePlugin<PluginOptions>;

export function onedrive<const PluginOptions extends OnedrivePluginOptions>(
	incomingOptions: OnedrivePluginOptions &
		PluginOptions = {} as OnedrivePluginOptions & PluginOptions,
): ExternalOnedrivePlugin<PluginOptions> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'onedrive',
		schema: OnedriveSchema,
		options: options,
		authConfig: onedriveAuthConfig,
		oauthConfig: {
			providerName: 'Microsoft',
			authUrl: 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize',
			tokenUrl: 'https://login.microsoftonline.com/common/oauth2/v2.0/token',
			scopes: [
				'offline_access',
				'User.Read',
				'Files.ReadWrite.All',
				'Sites.Read.All',
				'Subscription.Read.All',
			],
		},
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: onedriveEndpointsNested,
		webhooks: onedriveWebhooksNested,
		endpointMeta: onedriveEndpointMeta,
		endpointSchemas: onedriveEndpointSchemas,
		webhookSchemas: onedriveWebhookSchemas,
		pluginWebhookMatcher: (request) => {
			if (createOnedriveValidationMatch()(request)) {
				return true;
			}
			return createOnedriveMatch()(request);
		},
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: OnedriveKeyBuilderContext, source) => {
			if (source === 'webhook' && options.webhookSecret) {
				return options.webhookSecret;
			}

			if (source === 'webhook') {
				const res = await ctx.keys.get_webhook_signature();
				if (!res) return '';
				return res;
			}

			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (ctx.authType === 'oauth_2') {
				const [accessToken, expiresAt, refreshToken, integrationCreds] =
					await Promise.all([
						ctx.keys.get_access_token(),
						ctx.keys.get_expires_at?.(),
						ctx.keys.get_refresh_token?.(),
						ctx.keys.get_integration_credentials?.(),
					]);

				if (
					!refreshToken ||
					!integrationCreds?.client_id ||
					!integrationCreds?.client_secret
				) {
					if (!accessToken) {
						return '';
					}
					return accessToken;
				}

				const result = await getValidAccessToken({
					accessToken,
					expiresAt: expiresAt ?? null,
					refreshToken,
					clientId: integrationCreds.client_id,
					clientSecret: integrationCreds.client_secret,
				});

				if (result.refreshed) {
					await Promise.all([
						ctx.keys.set_access_token?.(result.accessToken),
						ctx.keys.set_expires_at?.(String(result.expiresAt)),
					]);
				}

				return result.accessToken;
			}

			return '';
		},
	} satisfies InternalOnedrivePlugin;
}

// ─────────────────────────────────────────────────────────────────────────────
// Webhook Type Exports
// ─────────────────────────────────────────────────────────────────────────────

export type {
	OnedriveNotification,
	OnedriveValidationPayload,
	OnedriveWebhookOutputs,
	OnedriveWebhookPayload,
} from './webhooks/types';

export {
	createOnedriveMatch,
	createOnedriveValidationMatch,
	OnedriveNotificationSchema,
	OnedriveValidationPayloadSchema,
	OnedriveWebhookPayloadSchema,
	verifyOnedriveClientState,
} from './webhooks/types';

// ─────────────────────────────────────────────────────────────────────────────
// Endpoint Type Exports
// ─────────────────────────────────────────────────────────────────────────────

export type {
	DriveGetGroupInput,
	DriveGetGroupResponse,
	// Drive
	DriveGetInput,
	DriveGetQuotaInput,
	DriveGetQuotaResponse,
	DriveGetRecentItemsInput,
	DriveGetRecentItemsResponse,
	DriveGetResponse,
	DriveGetRootInput,
	DriveGetRootResponse,
	DriveGetSharedItemsInput,
	DriveGetSharedItemsResponse,
	DriveGetSpecialFolderInput,
	DriveGetSpecialFolderResponse,
	DriveListActivitiesInput,
	DriveListActivitiesResponse,
	DriveListBundlesInput,
	DriveListBundlesResponse,
	DriveListChangesInput,
	DriveListChangesResponse,
	DriveListInput,
	DriveListResponse,
	// Files
	FilesCreateFolderInput,
	FilesCreateFolderResponse,
	FilesCreateTextFileInput,
	FilesCreateTextFileResponse,
	FilesFindFileInput,
	FilesFindFileResponse,
	FilesFindFolderInput,
	FilesFindFolderResponse,
	FilesListInput,
	FilesListResponse,
	FilesUploadInput,
	FilesUploadResponse,
	ItemsCheckinInput,
	ItemsCheckinResponse,
	ItemsCheckoutInput,
	ItemsCheckoutResponse,
	ItemsCopyInput,
	ItemsCopyResponse,
	ItemsDeleteInput,
	ItemsDeletePermanentlyInput,
	ItemsDeletePermanentlyResponse,
	ItemsDeleteResponse,
	ItemsDiscardCheckoutInput,
	ItemsDiscardCheckoutResponse,
	ItemsDownloadAsFormatInput,
	ItemsDownloadAsFormatResponse,
	ItemsDownloadByPathInput,
	ItemsDownloadByPathResponse,
	ItemsDownloadInput,
	ItemsDownloadResponse,
	ItemsDownloadVersionInput,
	ItemsDownloadVersionResponse,
	ItemsFollowInput,
	ItemsFollowResponse,
	ItemsGetDriveItemBySharingUrlInput,
	ItemsGetDriveItemBySharingUrlResponse,
	ItemsGetFollowedInput,
	ItemsGetFollowedResponse,
	// Items
	ItemsGetInput,
	ItemsGetResponse,
	ItemsGetThumbnailsInput,
	ItemsGetThumbnailsResponse,
	ItemsGetVersionsInput,
	ItemsGetVersionsResponse,
	ItemsListActivitiesInput,
	ItemsListActivitiesResponse,
	ItemsListFolderChildrenInput,
	ItemsListFolderChildrenResponse,
	ItemsMoveInput,
	ItemsMoveResponse,
	ItemsPreviewInput,
	ItemsPreviewResponse,
	ItemsRestoreInput,
	ItemsRestoreResponse,
	ItemsSearchInput,
	ItemsSearchResponse,
	ItemsUnfollowInput,
	ItemsUnfollowResponse,
	ItemsUpdateContentInput,
	ItemsUpdateContentResponse,
	ItemsUpdateMetadataInput,
	ItemsUpdateMetadataResponse,
	OnedriveEndpointInputs,
	OnedriveEndpointOutputs,
	PermissionsCreateForItemInput,
	PermissionsCreateForItemResponse,
	PermissionsCreateLinkInput,
	PermissionsCreateLinkResponse,
	PermissionsDeleteFromItemInput,
	PermissionsDeleteFromItemResponse,
	PermissionsDeleteSharePermissionInput,
	PermissionsDeleteSharePermissionResponse,
	// Permissions
	PermissionsGetForItemInput,
	PermissionsGetForItemResponse,
	PermissionsGetShareInput,
	PermissionsGetShareResponse,
	PermissionsGrantSharePermissionInput,
	PermissionsGrantSharePermissionResponse,
	PermissionsInviteUserInput,
	PermissionsInviteUserResponse,
	PermissionsListSharePermissionsInput,
	PermissionsListSharePermissionsResponse,
	PermissionsUpdateForItemInput,
	PermissionsUpdateForItemResponse,
	SharepointGetListItemsInput,
	SharepointGetListItemsResponse,
	// SharePoint
	SharepointGetSiteInput,
	SharepointGetSitePageInput,
	SharepointGetSitePageResponse,
	SharepointGetSiteResponse,
	SharepointListListItemsDeltaInput,
	SharepointListListItemsDeltaResponse,
	SharepointListSiteColumnsInput,
	SharepointListSiteColumnsResponse,
	SharepointListSiteItemsDeltaInput,
	SharepointListSiteItemsDeltaResponse,
	SharepointListSiteListsInput,
	SharepointListSiteListsResponse,
	SharepointListSiteSubsitesInput,
	SharepointListSiteSubsitesResponse,
	// Subscriptions
	SubscriptionsListInput,
	SubscriptionsListResponse,
} from './endpoints/types';
