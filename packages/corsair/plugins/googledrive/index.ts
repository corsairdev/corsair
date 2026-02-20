import type {
	BindEndpoints,
	BindWebhooks,
	CorsairEndpoint,
	CorsairPlugin,
	CorsairPluginContext,
	CorsairWebhook,
	KeyBuilderContext,
	RawWebhookRequest,
} from '../../core';
import type { AuthTypes, PickAuth } from '../../core/constants';
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
import { GoogleDriveSchema } from './schema';
import type {
	GoogleDriveWebhookEvent,
	GoogleDriveWebhookOutputs,
	GoogleDriveWebhookPayload,
} from './webhooks';
import { ChangeWebhooks } from './webhooks';
import type { PubSubNotification } from './webhooks/types';
import { decodePubSubMessage } from './webhooks/types';

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

const googleDriveWebhooksNested = {
	driveChanged: ChangeWebhooks.driveChanged,
} as const;

export type GoogleDrivePluginOptions = {
	authType?: PickAuth<'oauth_2'>;
	key?: string;
	hooks?: InternalGoogleDrivePlugin['hooks'];
	webhookHooks?: InternalGoogleDrivePlugin['webhookHooks'];
};

export type GoogleDriveKeyBuilderContext =
	KeyBuilderContext<GoogleDrivePluginOptions>;

const defaultAuthType = 'oauth_2' as const;

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
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: googleDriveEndpointsNested,
		webhooks: googleDriveWebhooksNested,
		keyBuilder: async (ctx: GoogleDriveKeyBuilderContext) => {
			if (options.key) {
				return options.key;
			}

			if (ctx.authType === 'oauth_2') {
				const accessToken = await ctx.keys.get_access_token();
				const refreshToken = await ctx.keys.get_refresh_token();

				if (!accessToken || !refreshToken) {
					throw new Error('No access token or refresh token');
				}

				const res = await ctx.keys.get_integration_credentials();

				if (!res.client_id || !res.client_secret) {
					throw new Error('No client id or client secret');
				}

				const key = await getValidAccessToken({
					accessToken,
					refreshToken,
					clientId: res.client_id,
					clientSecret: res.client_secret,
				});

				return key;
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

			return !!decoded.resourceUri && decoded.resourceUri.includes('drive')
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
