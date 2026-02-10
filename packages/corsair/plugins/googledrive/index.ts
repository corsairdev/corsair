import type {
	BindEndpoints,
	BindWebhooks,
	CorsairEndpoint,
	CorsairPlugin,
	CorsairPluginContext,
	CorsairWebhook,
	KeyBuilderContext,
} from '../../core';
import type { AuthTypes, PickAuth } from '../../core/constants';
import { getValidAccessToken } from './client';
import type { GoogleDriveEndpointOutputs } from './endpoints';
import {
	FilesEndpoints,
	FoldersEndpoints,
	SearchEndpoints,
	SharedDrivesEndpoints,
} from './endpoints';
import { GoogleDriveSchema } from './schema';
import type {
	FileChangedEvent,
	FolderChangedEvent,
	GoogleDriveWebhookOutputs,
	GoogleDriveWebhookPayload,
} from './webhooks';
import { ChangeWebhooks } from './webhooks';

export type GoogleDriveContext = CorsairPluginContext<
	typeof GoogleDriveSchema,
	GoogleDrivePluginOptions
>;

type GoogleDriveEndpoint<
	K extends keyof GoogleDriveEndpointOutputs,
	Input,
> = CorsairEndpoint<GoogleDriveContext, Input, GoogleDriveEndpointOutputs[K]>;

export type GoogleDriveEndpoints = {
	filesList: GoogleDriveEndpoint<
		'filesList',
		{
			q?: string;
			pageSize?: number;
			pageToken?: string;
			spaces?: string;
			corpora?: string;
			driveId?: string;
			includeItemsFromAllDrives?: boolean;
			includePermissionsForView?: string;
			orderBy?: string;
			supportsAllDrives?: boolean;
			supportsTeamDrives?: boolean;
			teamDriveId?: string;
		}
	>;
	filesGet: GoogleDriveEndpoint<
		'filesGet',
		{
			fileId: string;
			acknowledgeAbuse?: boolean;
			supportsAllDrives?: boolean;
			supportsTeamDrives?: boolean;
			includePermissionsForView?: string;
		}
	>;
	filesCreateFromText: GoogleDriveEndpoint<
		'filesCreateFromText',
		{
			name: string;
			content: string;
			mimeType?: string;
			parents?: string[];
			description?: string;
		}
	>;
	filesUpload: GoogleDriveEndpoint<
		'filesUpload',
		{
			name: string;
			mimeType?: string;
			parents?: string[];
			description?: string;
		}
	>;
	filesUpdate: GoogleDriveEndpoint<
		'filesUpdate',
		{
			fileId: string;
			name?: string;
			description?: string;
			starred?: boolean;
			trashed?: boolean;
			parents?: string[];
			addParents?: string;
			removeParents?: string;
			properties?: Record<string, string>;
			appProperties?: Record<string, string>;
			supportsAllDrives?: boolean;
			supportsTeamDrives?: boolean;
		}
	>;
	filesDelete: GoogleDriveEndpoint<
		'filesDelete',
		{
			fileId: string;
			supportsAllDrives?: boolean;
			supportsTeamDrives?: boolean;
		}
	>;
	filesCopy: GoogleDriveEndpoint<
		'filesCopy',
		{
			fileId: string;
			name?: string;
			parents?: string[];
			supportsAllDrives?: boolean;
			supportsTeamDrives?: boolean;
		}
	>;
	filesMove: GoogleDriveEndpoint<
		'filesMove',
		{
			fileId: string;
			addParents?: string;
			removeParents?: string;
			supportsAllDrives?: boolean;
			supportsTeamDrives?: boolean;
		}
	>;
	filesDownload: GoogleDriveEndpoint<
		'filesDownload',
		{
			fileId: string;
			acknowledgeAbuse?: boolean;
		}
	>;
	filesShare: GoogleDriveEndpoint<
		'filesShare',
		{
			fileId: string;
			type?: 'user' | 'group' | 'domain' | 'anyone';
			role?: 'owner' | 'organizer' | 'fileOrganizer' | 'writer' | 'commenter' | 'reader';
			emailAddress?: string;
			domain?: string;
			allowFileDiscovery?: boolean;
			expirationTime?: string;
			sendNotificationEmail?: boolean;
			emailMessage?: string;
			supportsAllDrives?: boolean;
			supportsTeamDrives?: boolean;
			moveToNewOwnersRoot?: boolean;
			transferOwnership?: boolean;
		}
	>;
	foldersCreate: GoogleDriveEndpoint<
		'foldersCreate',
		{
			name: string;
			parents?: string[];
			description?: string;
		}
	>;
	foldersGet: GoogleDriveEndpoint<
		'foldersGet',
		{
			folderId: string;
			supportsAllDrives?: boolean;
			supportsTeamDrives?: boolean;
			includePermissionsForView?: string;
		}
	>;
	foldersList: GoogleDriveEndpoint<
		'foldersList',
		{
			q?: string;
			pageSize?: number;
			pageToken?: string;
			spaces?: string;
			corpora?: string;
			driveId?: string;
			includeItemsFromAllDrives?: boolean;
			includePermissionsForView?: string;
			orderBy?: string;
			supportsAllDrives?: boolean;
			supportsTeamDrives?: boolean;
			teamDriveId?: string;
		}
	>;
	foldersDelete: GoogleDriveEndpoint<
		'foldersDelete',
		{
			folderId: string;
			supportsAllDrives?: boolean;
			supportsTeamDrives?: boolean;
		}
	>;
	foldersShare: GoogleDriveEndpoint<
		'foldersShare',
		{
			folderId: string;
			type?: 'user' | 'group' | 'domain' | 'anyone';
			role?: 'owner' | 'organizer' | 'fileOrganizer' | 'writer' | 'commenter' | 'reader';
			emailAddress?: string;
			domain?: string;
			allowFileDiscovery?: boolean;
			expirationTime?: string;
			sendNotificationEmail?: boolean;
			emailMessage?: string;
			supportsAllDrives?: boolean;
			supportsTeamDrives?: boolean;
			moveToNewOwnersRoot?: boolean;
			transferOwnership?: boolean;
		}
	>;
	sharedDrivesCreate: GoogleDriveEndpoint<
		'sharedDrivesCreate',
		{
			name: string;
			requestId?: string;
			themeId?: string;
			colorRgb?: string;
			restrictions?: {
				adminManagedRestrictions?: boolean;
				copyRequiresWriterPermission?: boolean;
				domainUsersOnly?: boolean;
				driveMembersOnly?: boolean;
			};
		}
	>;
	sharedDrivesGet: GoogleDriveEndpoint<
		'sharedDrivesGet',
		{
			driveId: string;
			useDomainAdminAccess?: boolean;
		}
	>;
	sharedDrivesList: GoogleDriveEndpoint<
		'sharedDrivesList',
		{
			pageSize?: number;
			pageToken?: string;
			q?: string;
			useDomainAdminAccess?: boolean;
		}
	>;
	sharedDrivesUpdate: GoogleDriveEndpoint<
		'sharedDrivesUpdate',
		{
			driveId: string;
			name?: string;
			themeId?: string;
			colorRgb?: string;
			restrictions?: {
				adminManagedRestrictions?: boolean;
				copyRequiresWriterPermission?: boolean;
				domainUsersOnly?: boolean;
				driveMembersOnly?: boolean;
			};
			useDomainAdminAccess?: boolean;
		}
	>;
	sharedDrivesDelete: GoogleDriveEndpoint<
		'sharedDrivesDelete',
		{
			driveId: string;
		}
	>;
	searchFilesAndFolders: GoogleDriveEndpoint<
		'searchFilesAndFolders',
		{
			q: string;
			pageSize?: number;
			pageToken?: string;
			spaces?: string;
			corpora?: string;
			driveId?: string;
			includeItemsFromAllDrives?: boolean;
			includePermissionsForView?: string;
			orderBy?: string;
			supportsAllDrives?: boolean;
			supportsTeamDrives?: boolean;
			teamDriveId?: string;
		}
	>;
};

export type GoogleDriveBoundEndpoints = BindEndpoints<typeof googleDriveEndpointsNested>;

type GoogleDriveWebhook<K extends keyof GoogleDriveWebhookOutputs, TEvent> = CorsairWebhook<
	GoogleDriveContext,
	GoogleDriveWebhookPayload,
	GoogleDriveWebhookOutputs[K]
>;

export type GoogleDriveWebhooks = {
	fileChanged: GoogleDriveWebhook<'fileChanged', FileChangedEvent>;
	folderChanged: GoogleDriveWebhook<'folderChanged', FolderChangedEvent>;
};

export type GoogleDriveBoundWebhooks = BindWebhooks<typeof googleDriveWebhooksNested>;

const googleDriveEndpointsNested = {
	files: {
		list: FilesEndpoints.list,
		get: FilesEndpoints.get,
		createFromText: FilesEndpoints.createFromText,
		upload: FilesEndpoints.upload,
		update: FilesEndpoints.update,
		delete: FilesEndpoints.delete,
		copy: FilesEndpoints.copy,
		move: FilesEndpoints.move,
		download: FilesEndpoints.download,
		share: FilesEndpoints.share,
	},
	folders: {
		create: FoldersEndpoints.create,
		get: FoldersEndpoints.get,
		list: FoldersEndpoints.list,
		delete: FoldersEndpoints.delete,
		share: FoldersEndpoints.share,
	},
	sharedDrives: {
		create: SharedDrivesEndpoints.create,
		get: SharedDrivesEndpoints.get,
		list: SharedDrivesEndpoints.list,
		update: SharedDrivesEndpoints.update,
		delete: SharedDrivesEndpoints.delete,
	},
	search: {
		filesAndFolders: SearchEndpoints.filesAndFolders,
	},
} as const;

const googleDriveWebhooksNested = {
	fileChanged: ChangeWebhooks.fileChanged,
	folderChanged: ChangeWebhooks.folderChanged,
} as unknown as {
	fileChanged: GoogleDriveWebhooks['fileChanged'];
	folderChanged: GoogleDriveWebhooks['folderChanged'];
};

export type GoogleDrivePluginOptions = {
	authType?: PickAuth<'oauth_2'>;
	key?: string;
	hooks?: InternalGoogleDrivePlugin['hooks'];
	webhookHooks?: InternalGoogleDrivePlugin['webhookHooks'];
};

export type GoogleDriveKeyBuilderContext = KeyBuilderContext<GoogleDrivePluginOptions>;

const defaultAuthType: AuthTypes = 'oauth_2';

export type BaseGoogleDrivePlugin<T extends GoogleDrivePluginOptions> = CorsairPlugin<
	'googledrive',
	typeof GoogleDriveSchema,
	typeof googleDriveEndpointsNested,
	typeof googleDriveWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalGoogleDrivePlugin = BaseGoogleDrivePlugin<GoogleDrivePluginOptions>;

export type ExternalGoogleDrivePlugin<T extends GoogleDrivePluginOptions> =
	BaseGoogleDrivePlugin<T>;

export function googledrive<const T extends GoogleDrivePluginOptions>(
	incomingOptions: GoogleDrivePluginOptions & T = {} as GoogleDrivePluginOptions & T,
): ExternalGoogleDrivePlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'googledrive',
		schema: GoogleDriveSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: googleDriveEndpointsNested,
		webhooks: googleDriveWebhooksNested,
		keyBuilder: async (ctx: GoogleDriveKeyBuilderContext) => {
			if (options.key) {
				return options.key;
			}

			if (ctx.authType === 'oauth_2') {
				const accessToken = await ctx.keys.getAccessToken();
				const refreshToken = await ctx.keys.getRefreshToken();

				if (!accessToken || !refreshToken) {
					return '';
				}

				const res = await ctx.keys.getIntegrationCredentials();

				if (!res.clientId || !res.clientSecret) {
					return '';
				}

				const key = await getValidAccessToken({
					accessToken,
					refreshToken,
					clientId: res.clientId,
					clientSecret: res.clientSecret,
				});

				return key;
			}

			return '';
		},
		pluginWebhookMatcher: (
			request: import('../../core/webhooks').RawWebhookRequest,
		) => {
			const body = request.body as Record<string, unknown>;
			return (body?.message as Record<string, unknown>)?.data !== undefined;
		},
	} satisfies InternalGoogleDrivePlugin;
}
