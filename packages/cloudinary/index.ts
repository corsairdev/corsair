import type {
	AuthTypes,
	BindEndpoints,
	BindWebhooks,
	CorsairEndpoint,
	CorsairErrorHandler,
	CorsairPlugin,
	KeyBuilderContext,
	PluginPermissionsConfig,
	RawWebhookRequest,
	RequiredPluginEndpointMeta,
} from 'corsair/core';
import { AuthMissingError } from 'corsair/core';
import {
	cloudinaryEndpointSchemas,
	cloudinaryEndpointsNested,
	cloudinaryEndpointMeta as generatedCloudinaryEndpointMeta,
} from './endpoints/plugin';
import type {
	CloudinaryEndpointInputs,
	CloudinaryEndpointOutputs,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import type {
	CloudinaryContext,
	CloudinaryPluginOptionsBase,
} from './plugin-types';
import { cloudinaryAuthConfig } from './plugin-types';
import { CloudinarySchema } from './schema';
import {
	DeleteWebhooks,
	EagerWebhooks,
	FolderWebhooks,
	OtherWebhooks,
	RenameWebhooks,
	ResourceWebhooks,
	UploadWebhooks,
} from './webhooks';
import { resolveCloudinaryOAuthWebhookTenantLink } from './webhooks/oauth-tenant-link';
import { matchCloudinaryTenantWebhook } from './webhooks/tenant-matcher';
import {
	CloudinaryAccessControlChangedSchema,
	CloudinaryCreateFolderNotificationSchema,
	CloudinaryDeleteFolderNotificationSchema,
	CloudinaryDeleteNotificationSchema,
	CloudinaryEagerNotificationSchema,
	CloudinaryExplodeNotificationSchema,
	CloudinaryMoveNotificationSchema,
	CloudinaryRelatedAssetsNotificationSchema,
	CloudinaryRenameNotificationSchema,
	CloudinaryResourceContextChangedSchema,
	CloudinaryResourceMetadataChangedSchema,
	CloudinaryResourceTagsChangedSchema,
	CloudinaryUploadNotificationSchema,
} from './webhooks/types';

export const cloudinaryEndpointMeta =
	generatedCloudinaryEndpointMeta satisfies RequiredPluginEndpointMeta<
		typeof cloudinaryEndpointsNested
	>;

export type CloudinaryPluginOptions = CloudinaryPluginOptionsBase & {
	hooks?: InternalCloudinaryPlugin['hooks'];
	webhookHooks?: InternalCloudinaryPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof cloudinaryEndpointsNested>;
};

export { cloudinaryAuthConfig } from './auth-config';
export { CloudinaryAPIError } from './client';

export { errorHandlers } from './error-handlers';
export type { CloudinaryContext } from './plugin-types';
export type {
	CloudinaryDeleteNotification,
	CloudinaryEagerNotification,
	CloudinaryRenameNotification,
	CloudinaryUploadNotification,
	CloudinaryWebhookOutputs,
	CloudinaryWebhookPayload,
} from './webhooks/types';
export {
	createCloudinaryMatch,
	verifyCloudinaryWebhookSignature,
} from './webhooks/types';

export type CloudinaryKeyBuilderContext = KeyBuilderContext<
	CloudinaryPluginOptions,
	typeof cloudinaryAuthConfig
>;

export type CloudinaryBoundEndpoints = BindEndpoints<
	typeof cloudinaryEndpointsNested
>;
export type CloudinaryBoundWebhooks = BindWebhooks<
	typeof cloudinaryWebhooksNested
>;

type CloudinaryEndpoint<K extends keyof CloudinaryEndpointOutputs> =
	CorsairEndpoint<
		CloudinaryContext,
		CloudinaryEndpointInputs[K],
		CloudinaryEndpointOutputs[K]
	>;

export type CloudinaryEndpoints = {
	[K in keyof CloudinaryEndpointOutputs]: CloudinaryEndpoint<K>;
};

const cloudinaryWebhooksNested = {
	upload: UploadWebhooks,
	eager: EagerWebhooks,
	delete: DeleteWebhooks,
	rename: RenameWebhooks,
	resource: ResourceWebhooks,
	folder: FolderWebhooks,
	other: OtherWebhooks,
} as const;

const cloudinaryWebhookSchemas = {
	'upload.upload': {
		description: 'Notification when an upload completes',
		payload: CloudinaryUploadNotificationSchema,
		response: CloudinaryUploadNotificationSchema,
	},
	'eager.eager': {
		description: 'Notification when eager transformations complete',
		payload: CloudinaryEagerNotificationSchema,
		response: CloudinaryEagerNotificationSchema,
	},
	'delete.delete': {
		description: 'Notification when an asset is deleted',
		payload: CloudinaryDeleteNotificationSchema,
		response: CloudinaryDeleteNotificationSchema,
	},
	'rename.rename': {
		description: 'Notification when an asset is renamed',
		payload: CloudinaryRenameNotificationSchema,
		response: CloudinaryRenameNotificationSchema,
	},
	'resource.resourceTagsChanged': {
		description: 'Notification when resource tags change',
		payload: CloudinaryResourceTagsChangedSchema,
		response: CloudinaryResourceTagsChangedSchema,
	},
	'resource.resourceContextChanged': {
		description: 'Notification when resource context metadata changes',
		payload: CloudinaryResourceContextChangedSchema,
		response: CloudinaryResourceContextChangedSchema,
	},
	'resource.resourceMetadataChanged': {
		description: 'Notification when structured metadata changes',
		payload: CloudinaryResourceMetadataChangedSchema,
		response: CloudinaryResourceMetadataChangedSchema,
	},
	'folder.createFolder': {
		description: 'Notification when a folder is created',
		payload: CloudinaryCreateFolderNotificationSchema,
		response: CloudinaryCreateFolderNotificationSchema,
	},
	'folder.deleteFolder': {
		description: 'Notification when a folder is deleted',
		payload: CloudinaryDeleteFolderNotificationSchema,
		response: CloudinaryDeleteFolderNotificationSchema,
	},
	'folder.move': {
		description: 'Notification when an asset is moved between folders',
		payload: CloudinaryMoveNotificationSchema,
		response: CloudinaryMoveNotificationSchema,
	},
	'other.explode': {
		description: 'Notification when explode processing completes',
		payload: CloudinaryExplodeNotificationSchema,
		response: CloudinaryExplodeNotificationSchema,
	},
	'other.accessControlChanged': {
		description: 'Notification when asset access control changes',
		payload: CloudinaryAccessControlChangedSchema,
		response: CloudinaryAccessControlChangedSchema,
	},
	'other.relatedAssets': {
		description: 'Notification when related assets change',
		payload: CloudinaryRelatedAssetsNotificationSchema,
		response: CloudinaryRelatedAssetsNotificationSchema,
	},
} as const;

const defaultAuthType: AuthTypes = 'api_key' as const;

export type BaseCloudinaryPlugin<T extends CloudinaryPluginOptions> =
	CorsairPlugin<
		'cloudinary',
		typeof CloudinarySchema,
		typeof cloudinaryEndpointsNested,
		typeof cloudinaryWebhooksNested,
		T,
		typeof defaultAuthType,
		typeof cloudinaryAuthConfig
	>;

export type InternalCloudinaryPlugin =
	BaseCloudinaryPlugin<CloudinaryPluginOptions>;

export type ExternalCloudinaryPlugin<T extends CloudinaryPluginOptions> =
	BaseCloudinaryPlugin<T>;

export function cloudinary<const T extends CloudinaryPluginOptions>(
	incomingOptions: CloudinaryPluginOptions & T = {} as CloudinaryPluginOptions &
		T,
): ExternalCloudinaryPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};

	return {
		id: 'cloudinary',
		authConfig: cloudinaryAuthConfig,
		schema: CloudinarySchema,
		options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: cloudinaryEndpointsNested,
		webhooks: cloudinaryWebhooksNested,
		endpointMeta: cloudinaryEndpointMeta,
		endpointSchemas: cloudinaryEndpointSchemas,
		webhookSchemas: cloudinaryWebhookSchemas,
		pluginWebhookMatcher: (request: RawWebhookRequest) => {
			const headers = request.headers;
			const hasSignature =
				'x-cld-signature' in headers || 'X-Cld-Signature' in headers;
			const hasTimestamp =
				'x-cld-timestamp' in headers || 'X-Cld-Timestamp' in headers;
			return hasSignature && hasTimestamp;
		},
		pluginTenantWebhookMatcher: matchCloudinaryTenantWebhook,
		oauthWebhookTenantLinkResolver: resolveCloudinaryOAuthWebhookTenantLink,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: CloudinaryKeyBuilderContext, source) => {
			// Cloudinary signs notifications with the API secret. webhookSecret /
			// webhook_signature are optional overrides for that same secret value.
			if (source === 'webhook' && options.webhookSecret) {
				return options.webhookSecret;
			}

			if (source === 'webhook') {
				const webhookSecret = await ctx.keys.get_webhook_signature();
				if (webhookSecret) return webhookSecret;
				const apiSecret = await ctx.keys.get_api_secret();
				if (!apiSecret) {
					throw new AuthMissingError('cloudinary', 'api_key');
				}
				return apiSecret;
			}

			if (source === 'endpoint') {
				const apiKey =
					options.credentials?.apiKey ??
					options.key ??
					(await ctx.keys.get_api_key());
				const apiSecret =
					options.credentials?.apiSecret ??
					options.apiSecret ??
					(await ctx.keys.get_api_secret());
				if (!apiKey || !apiSecret) {
					throw new AuthMissingError('cloudinary', 'api_key');
				}
				return `${apiKey}:${apiSecret}`;
			}

			throw new AuthMissingError('cloudinary', ctx.authType);
		},
	} satisfies InternalCloudinaryPlugin;
}

export type {
	CloudinaryEndpointInputs,
	CloudinaryEndpointOutputs,
} from './endpoints/types';

export { cloudinaryEndpointsNested, cloudinaryEndpointSchemas };

export { parseCloudinaryCredentials, signCloudinaryParams } from './client';
