import type {
	BindEndpoints,
	BindWebhooks,
	CorsairErrorHandler,
	CorsairPlugin,
	KeyBuilderContext,
	PluginPermissionsConfig,
} from 'corsair/core';
import type { AuthTypes } from 'corsair/core';
import { AuthMissingError } from 'corsair/core';

import { errorHandlers } from './error-handlers';
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
import { matchCloudinaryTenantWebhook } from './webhooks/tenant-matcher';
import { resolveCloudinaryOAuthWebhookTenantLink } from './webhooks/oauth-tenant-link';
import {
	cloudinaryAuthConfig,
	type CloudinaryPluginOptionsBase,
} from './plugin-types';
import {
	cloudinaryEndpointMeta,
	cloudinaryEndpointSchemas,
	cloudinaryEndpointsNested,
} from './endpoints/plugin';

export type CloudinaryPluginOptions = CloudinaryPluginOptionsBase & {
	hooks?: InternalCloudinaryPlugin['hooks'];
	webhookHooks?: InternalCloudinaryPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof cloudinaryEndpointsNested>;
};

export type { CloudinaryContext } from './plugin-types';
export { cloudinaryAuthConfig } from './auth-config';

export type CloudinaryKeyBuilderContext = KeyBuilderContext<
	CloudinaryPluginOptions,
	typeof cloudinaryAuthConfig
>;

export type CloudinaryBoundEndpoints = BindEndpoints<typeof cloudinaryEndpointsNested>;
export type CloudinaryBoundWebhooks = BindWebhooks<typeof cloudinaryWebhooksNested>;

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

export type BaseCloudinaryPlugin<T extends CloudinaryPluginOptions> = CorsairPlugin<
	'cloudinary',
	typeof CloudinarySchema,
	typeof cloudinaryEndpointsNested,
	typeof cloudinaryWebhooksNested,
	T,
	typeof defaultAuthType,
	typeof cloudinaryAuthConfig
>;

export type InternalCloudinaryPlugin = BaseCloudinaryPlugin<CloudinaryPluginOptions>;

export type ExternalCloudinaryPlugin<T extends CloudinaryPluginOptions> =
	BaseCloudinaryPlugin<T>;

export function cloudinary<const T extends CloudinaryPluginOptions>(
	incomingOptions: CloudinaryPluginOptions & T = {} as CloudinaryPluginOptions & T,
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
		pluginWebhookMatcher: (request) => {
			const headers = request.headers;
			return (
				'x-cld-signature' in headers ||
				'X-Cld-Signature' in headers ||
				'x-cld-timestamp' in headers ||
				'X-Cld-Timestamp' in headers
			);
		},
		pluginTenantWebhookMatcher: matchCloudinaryTenantWebhook,
		oauthWebhookTenantLinkResolver: resolveCloudinaryOAuthWebhookTenantLink,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: CloudinaryKeyBuilderContext, source) => {
			if (source === 'webhook' && options.webhookSecret) {
				return options.webhookSecret;
			}

			if (source === 'webhook') {
				const webhookSecret = await ctx.keys.get_webhook_signature();
				if (webhookSecret) return webhookSecret;
				const apiSecret = await ctx.keys.get_api_secret();
				return apiSecret ?? '';
			}

			if (source === 'endpoint' && options.key && options.apiSecret) {
				return `${options.key}:${options.apiSecret}`;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const apiKey = options.key ?? (await ctx.keys.get_api_key());
				const apiSecret =
					options.apiSecret ?? (await ctx.keys.get_api_secret());
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

export type { CloudinaryWebhookOutputs } from './webhooks/types';

export {
	cloudinaryEndpointsNested,
	cloudinaryEndpointSchemas,
	cloudinaryEndpointMeta,
};

export { parseCloudinaryCredentials, signCloudinaryParams } from './client';
