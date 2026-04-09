import type {
	BindEndpoints,
	BindWebhooks,
	CorsairEndpoint,
	CorsairPlugin,
	CorsairPluginContext,
	CorsairWebhook,
	KeyBuilderContext,
	PickAuth,
	PluginPermissionsConfig,
	RawWebhookRequest,
	RequiredPluginEndpointMeta,
} from 'corsair/core';
import { getValidAccessToken } from './client';
import type {
	GoogleDriveEndpointInputs,
	GoogleDriveEndpointOutputs,
} from './endpoints';
import {
	FilesEndpoints,
	FoldersEndpoints,
	SearchEndpoints,
	SharedDrivesEndpoints,
} from './endpoints';
import {
	GoogleDriveEndpointInputSchemas,
	GoogleDriveEndpointOutputSchemas,
} from './endpoints/types';
import { GoogleDriveSchema } from './schema';
import type {
	GoogleDriveWebhookEvent,
	GoogleDriveWebhookOutputs,
	GoogleDriveWebhookPayload,
} from './webhooks';
import { ChangeWebhooks } from './webhooks';
import type { PubSubNotification } from './webhooks/types';
import {
	DriveChangedEventSchema,
	decodePubSubMessage,
	PubSubNotificationSchema,
} from './webhooks/types';

export type GoogleDriveContext = CorsairPluginContext<
	typeof GoogleDriveSchema,
	GoogleDrivePluginOptions
>;

type GoogleDriveEndpoint<K extends keyof GoogleDriveEndpointOutputs> =
	CorsairEndpoint<
		GoogleDriveContext,
		GoogleDriveEndpointInputs[K],
		GoogleDriveEndpointOutputs[K]
	>;

export type GoogleDriveEndpoints = {
	filesList: GoogleDriveEndpoint<'filesList'>;
	filesGet: GoogleDriveEndpoint<'filesGet'>;
	filesCreateFromText: GoogleDriveEndpoint<'filesCreateFromText'>;
	filesUpload: GoogleDriveEndpoint<'filesUpload'>;
	filesUpdate: GoogleDriveEndpoint<'filesUpdate'>;
	filesDelete: GoogleDriveEndpoint<'filesDelete'>;
	filesCopy: GoogleDriveEndpoint<'filesCopy'>;
	filesMove: GoogleDriveEndpoint<'filesMove'>;
	filesDownload: GoogleDriveEndpoint<'filesDownload'>;
	filesShare: GoogleDriveEndpoint<'filesShare'>;
	foldersCreate: GoogleDriveEndpoint<'foldersCreate'>;
	foldersGet: GoogleDriveEndpoint<'foldersGet'>;
	foldersList: GoogleDriveEndpoint<'foldersList'>;
	foldersDelete: GoogleDriveEndpoint<'foldersDelete'>;
	foldersShare: GoogleDriveEndpoint<'foldersShare'>;
	sharedDrivesCreate: GoogleDriveEndpoint<'sharedDrivesCreate'>;
	sharedDrivesGet: GoogleDriveEndpoint<'sharedDrivesGet'>;
	sharedDrivesList: GoogleDriveEndpoint<'sharedDrivesList'>;
	sharedDrivesUpdate: GoogleDriveEndpoint<'sharedDrivesUpdate'>;
	sharedDrivesDelete: GoogleDriveEndpoint<'sharedDrivesDelete'>;
	searchFilesAndFolders: GoogleDriveEndpoint<'searchFilesAndFolders'>;
};

export type GoogleDriveBoundEndpoints = BindEndpoints<
	typeof googleDriveEndpointsNested
>;

type GoogleDriveWebhook<
	K extends keyof GoogleDriveWebhookOutputs,
	TEvent,
> = CorsairWebhook<
	GoogleDriveContext,
	GoogleDriveWebhookPayload<TEvent>,
	GoogleDriveWebhookOutputs[K]
>;

export type GoogleDriveWebhooks = {
	driveChanged: GoogleDriveWebhook<'driveChanged', GoogleDriveWebhookEvent>;
};

export type GoogleDriveBoundWebhooks = BindWebhooks<
	typeof googleDriveWebhooksNested
>;

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

export const googledriveEndpointSchemas = {
	'files.list': {
		input: GoogleDriveEndpointInputSchemas.filesList,
		output: GoogleDriveEndpointOutputSchemas.filesList,
	},
	'files.get': {
		input: GoogleDriveEndpointInputSchemas.filesGet,
		output: GoogleDriveEndpointOutputSchemas.filesGet,
	},
	'files.createFromText': {
		input: GoogleDriveEndpointInputSchemas.filesCreateFromText,
		output: GoogleDriveEndpointOutputSchemas.filesCreateFromText,
	},
	'files.upload': {
		input: GoogleDriveEndpointInputSchemas.filesUpload,
		output: GoogleDriveEndpointOutputSchemas.filesUpload,
	},
	'files.update': {
		input: GoogleDriveEndpointInputSchemas.filesUpdate,
		output: GoogleDriveEndpointOutputSchemas.filesUpdate,
	},
	'files.delete': {
		input: GoogleDriveEndpointInputSchemas.filesDelete,
		output: GoogleDriveEndpointOutputSchemas.filesDelete,
	},
	'files.copy': {
		input: GoogleDriveEndpointInputSchemas.filesCopy,
		output: GoogleDriveEndpointOutputSchemas.filesCopy,
	},
	'files.move': {
		input: GoogleDriveEndpointInputSchemas.filesMove,
		output: GoogleDriveEndpointOutputSchemas.filesMove,
	},
	'files.download': {
		input: GoogleDriveEndpointInputSchemas.filesDownload,
		output: GoogleDriveEndpointOutputSchemas.filesDownload,
	},
	'files.share': {
		input: GoogleDriveEndpointInputSchemas.filesShare,
		output: GoogleDriveEndpointOutputSchemas.filesShare,
	},
	'folders.create': {
		input: GoogleDriveEndpointInputSchemas.foldersCreate,
		output: GoogleDriveEndpointOutputSchemas.foldersCreate,
	},
	'folders.get': {
		input: GoogleDriveEndpointInputSchemas.foldersGet,
		output: GoogleDriveEndpointOutputSchemas.foldersGet,
	},
	'folders.list': {
		input: GoogleDriveEndpointInputSchemas.foldersList,
		output: GoogleDriveEndpointOutputSchemas.foldersList,
	},
	'folders.delete': {
		input: GoogleDriveEndpointInputSchemas.foldersDelete,
		output: GoogleDriveEndpointOutputSchemas.foldersDelete,
	},
	'folders.share': {
		input: GoogleDriveEndpointInputSchemas.foldersShare,
		output: GoogleDriveEndpointOutputSchemas.foldersShare,
	},
	'sharedDrives.create': {
		input: GoogleDriveEndpointInputSchemas.sharedDrivesCreate,
		output: GoogleDriveEndpointOutputSchemas.sharedDrivesCreate,
	},
	'sharedDrives.get': {
		input: GoogleDriveEndpointInputSchemas.sharedDrivesGet,
		output: GoogleDriveEndpointOutputSchemas.sharedDrivesGet,
	},
	'sharedDrives.list': {
		input: GoogleDriveEndpointInputSchemas.sharedDrivesList,
		output: GoogleDriveEndpointOutputSchemas.sharedDrivesList,
	},
	'sharedDrives.update': {
		input: GoogleDriveEndpointInputSchemas.sharedDrivesUpdate,
		output: GoogleDriveEndpointOutputSchemas.sharedDrivesUpdate,
	},
	'sharedDrives.delete': {
		input: GoogleDriveEndpointInputSchemas.sharedDrivesDelete,
		output: GoogleDriveEndpointOutputSchemas.sharedDrivesDelete,
	},
	'search.filesAndFolders': {
		input: GoogleDriveEndpointInputSchemas.searchFilesAndFolders,
		output: GoogleDriveEndpointOutputSchemas.searchFilesAndFolders,
	},
} as const;

const googleDriveWebhooksNested = {
	driveChanged: ChangeWebhooks.driveChanged,
} as const;

export type GoogleDrivePluginOptions = {
	authType?: PickAuth<'oauth_2'>;
	key?: string;
	hooks?: InternalGoogleDrivePlugin['hooks'];
	webhookHooks?: InternalGoogleDrivePlugin['webhookHooks'];
	/**
	 * Permission configuration for the Google Drive plugin.
	 * Controls what the AI agent is allowed to do.
	 * Overrides use dot-notation paths from the Google Drive endpoint tree — invalid paths are type errors.
	 */
	permissions?: PluginPermissionsConfig<typeof googleDriveEndpointsNested>;
};

export type GoogleDriveKeyBuilderContext =
	KeyBuilderContext<GoogleDrivePluginOptions>;

const googledriveWebhookSchemas = {
	driveChanged: {
		description:
			'A file or folder in Google Drive was created, updated, or deleted',
		payload: PubSubNotificationSchema,
		response: DriveChangedEventSchema,
	},
} as const;

const defaultAuthType = 'oauth_2' as const;

/**
 * Risk-level metadata for each Google Drive endpoint.
 * Used by the MCP server permission system to decide allow / deny / require_approval.
 */
const googleDriveEndpointMeta = {
	'files.list': {
		riskLevel: 'read',
		description: 'List files in Google Drive',
	},
	'files.get': {
		riskLevel: 'read',
		description: 'Get metadata for a specific file',
	},
	'files.createFromText': {
		riskLevel: 'write',
		description: 'Create a new Drive file from text content',
	},
	'files.upload': {
		riskLevel: 'write',
		description: 'Upload a file to Google Drive',
	},
	'files.update': {
		riskLevel: 'write',
		description: 'Update the content or metadata of a file',
	},
	'files.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Permanently delete a file [DESTRUCTIVE · IRREVERSIBLE]',
	},
	'files.copy': {
		riskLevel: 'write',
		description: 'Copy a file in Google Drive',
	},
	'files.move': {
		riskLevel: 'write',
		description: 'Move a file to a different folder',
	},
	'files.download': {
		riskLevel: 'read',
		description: 'Download the content of a file',
	},
	'files.share': {
		riskLevel: 'write',
		description: 'Share a file by granting permissions to users',
	},
	'folders.create': { riskLevel: 'write', description: 'Create a new folder' },
	'folders.get': {
		riskLevel: 'read',
		description: 'Get metadata for a specific folder',
	},
	'folders.list': {
		riskLevel: 'read',
		description: 'List folders in Google Drive',
	},
	'folders.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Permanently delete a folder and its contents [DESTRUCTIVE · IRREVERSIBLE]',
	},
	'folders.share': {
		riskLevel: 'write',
		description: 'Share a folder by granting permissions to users',
	},
	'sharedDrives.create': {
		riskLevel: 'write',
		description: 'Create a new shared drive',
	},
	'sharedDrives.get': {
		riskLevel: 'read',
		description: 'Get info about a shared drive',
	},
	'sharedDrives.list': { riskLevel: 'read', description: 'List shared drives' },
	'sharedDrives.update': {
		riskLevel: 'write',
		description: 'Update a shared drive',
	},
	'sharedDrives.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Permanently delete a shared drive [DESTRUCTIVE · IRREVERSIBLE]',
	},
	'search.filesAndFolders': {
		riskLevel: 'read',
		description: 'Search for files and folders in Google Drive',
	},
} satisfies RequiredPluginEndpointMeta<typeof googleDriveEndpointsNested>;

export type BaseGoogleDrivePlugin<T extends GoogleDrivePluginOptions> =
	CorsairPlugin<
		'googledrive',
		typeof GoogleDriveSchema,
		typeof googleDriveEndpointsNested,
		typeof googleDriveWebhooksNested,
		T,
		typeof defaultAuthType
	>;

export type InternalGoogleDrivePlugin =
	BaseGoogleDrivePlugin<GoogleDrivePluginOptions>;

export type ExternalGoogleDrivePlugin<T extends GoogleDrivePluginOptions> =
	BaseGoogleDrivePlugin<T>;

export function googledrive<const T extends GoogleDrivePluginOptions>(
	incomingOptions: GoogleDrivePluginOptions &
		T = {} as GoogleDrivePluginOptions & T,
): ExternalGoogleDrivePlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'googledrive',
		schema: GoogleDriveSchema,
		options: options,
		oauthConfig: {
			providerName: 'Google',
			authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
			tokenUrl: 'https://oauth2.googleapis.com/token',
			scopes: ['https://www.googleapis.com/auth/drive'],
			authParams: { access_type: 'offline', prompt: 'consent' },
		},
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: googleDriveEndpointsNested,
		webhooks: googleDriveWebhooksNested,
		endpointMeta: googleDriveEndpointMeta,
		endpointSchemas: googledriveEndpointSchemas,
		webhookSchemas: googledriveWebhookSchemas,
		keyBuilder: async (ctx: GoogleDriveKeyBuilderContext) => {
			if (options.key) {
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
						'[corsair:googledrive] No refresh token. Cannot get access token.',
					);
				}

				const res = await ctx.keys.get_integration_credentials();

				if (!res.client_id || !res.client_secret) {
					throw new Error(
						'[corsair:googledrive] No client id or client secret',
					);
				}

				try {
					const result = await getValidAccessToken({
						accessToken,
						expiresAt,
						refreshToken,
						clientId: res.client_id,
						clientSecret: res.client_secret,
					});

					if (result.refreshed) {
						await Promise.all([
							ctx.keys.set_access_token(result.accessToken),
							ctx.keys.set_expires_at(String(result.expiresAt)),
						]);
					}

					(ctx as Record<string, unknown>)._refreshAuth = async () => {
						const freshResult = await getValidAccessToken({
							accessToken: null,
							expiresAt: null,
							refreshToken,
							clientId: res.client_id!,
							clientSecret: res.client_secret!,
							forceRefresh: true,
						});
						await ctx.keys.set_access_token(freshResult.accessToken);
						await ctx.keys.set_expires_at(String(freshResult.expiresAt));
						return freshResult.accessToken;
					};

					return result.accessToken;
				} catch (error) {
					throw new Error(
						`[corsair:googledrive] Failed to get valid access token: ${error instanceof Error ? error.message : String(error)}`,
					);
				}
			}

			return '';
		},
		pluginWebhookMatcher: (request: RawWebhookRequest) => {
			const headers = request.headers;
			const isFromGoogle =
				headers.from === 'noreply@google.com' ||
				(typeof headers['user-agent'] === 'string' &&
					headers['user-agent'].includes('APIs-Google'));

			if (!isFromGoogle) return false;

			const body = request.body as PubSubNotification;
			if (!body?.message?.data) return false;

			try {
				const decoded = decodePubSubMessage(body.message.data);

				return !!decoded.resourceUri && decoded.resourceUri.includes('drive');
			} catch {
				return false;
			}
		},
	} satisfies InternalGoogleDrivePlugin;
}

// ─────────────────────────────────────────────────────────────────────────────
// Webhook Type Exports
// ─────────────────────────────────────────────────────────────────────────────

export type {
	DriveChangedEvent,
	GoogleDriveEventName,
	GoogleDrivePushNotification,
	GoogleDriveWebhookEvent,
	GoogleDriveWebhookOutputs,
	GoogleDriveWebhookPayload,
	PubSubMessage,
	PubSubNotification,
} from './webhooks';
export {
	createGoogleDriveWebhookMatcher,
	decodePubSubMessage,
} from './webhooks/types';

// ─────────────────────────────────────────────────────────────────────────────
// Endpoint Type Exports
// ─────────────────────────────────────────────────────────────────────────────

export type {
	GoogleDriveEndpointInputs,
	GoogleDriveEndpointOutputs,
} from './endpoints/types';

export type * from './types';
