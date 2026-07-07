import { logEventFromContext } from 'corsair/core';
import type { CorsairWebhook } from 'corsair/core';
import type { CloudinaryContext } from '../plugin-types';
import {
	createCloudinaryMatch,
	verifyCloudinaryWebhookSignature,
	type CloudinaryAccessControlChangedSchema,
	type CloudinaryCreateFolderNotificationSchema,
	type CloudinaryDeleteFolderNotificationSchema,
	type CloudinaryDeleteNotificationSchema,
	type CloudinaryEagerNotificationSchema,
	type CloudinaryExplodeNotificationSchema,
	type CloudinaryMoveNotificationSchema,
	type CloudinaryRelatedAssetsNotificationSchema,
	type CloudinaryRenameNotificationSchema,
	type CloudinaryResourceContextChangedSchema,
	type CloudinaryResourceMetadataChangedSchema,
	type CloudinaryResourceTagsChangedSchema,
	type CloudinaryUploadNotificationSchema,
} from './types';
import type { z } from 'zod';

type UploadEvent = z.infer<typeof CloudinaryUploadNotificationSchema>;
type EagerEvent = z.infer<typeof CloudinaryEagerNotificationSchema>;
type DeleteEvent = z.infer<typeof CloudinaryDeleteNotificationSchema>;
type RenameEvent = z.infer<typeof CloudinaryRenameNotificationSchema>;
type ResourceTagsChangedEvent = z.infer<typeof CloudinaryResourceTagsChangedSchema>;
type ResourceContextChangedEvent = z.infer<typeof CloudinaryResourceContextChangedSchema>;
type ResourceMetadataChangedEvent = z.infer<typeof CloudinaryResourceMetadataChangedSchema>;
type CreateFolderEvent = z.infer<typeof CloudinaryCreateFolderNotificationSchema>;
type DeleteFolderEvent = z.infer<typeof CloudinaryDeleteFolderNotificationSchema>;
type MoveEvent = z.infer<typeof CloudinaryMoveNotificationSchema>;
type ExplodeEvent = z.infer<typeof CloudinaryExplodeNotificationSchema>;
type AccessControlChangedEvent = z.infer<typeof CloudinaryAccessControlChangedSchema>;
type RelatedAssetsEvent = z.infer<typeof CloudinaryRelatedAssetsNotificationSchema>;

async function handleNotification<T extends Record<string, unknown>>(
	ctx: CloudinaryContext,
	request: Parameters<CorsairWebhook<CloudinaryContext, T, T>['handler']>[1],
	logKey: string,
	options?: {
		syncResource?: 'upsert' | 'delete';
	},
) {
	const verification = verifyCloudinaryWebhookSignature(request, ctx.key);
	if (!verification.valid) {
		return {
			success: false as const,
			statusCode: 401,
			error: verification.error || 'Signature verification failed',
		};
	}

	const event = request.payload;
	await logEventFromContext(ctx, logKey, { ...event }, 'completed');

	const entityId =
		(typeof event.asset_id === 'string' && event.asset_id) ||
		(typeof event.public_id === 'string' && event.public_id) ||
		undefined;

	if (entityId && options?.syncResource === 'upsert' && ctx.db.resources) {
		await ctx.db.resources.upsertByEntityId(entityId, {
			...event,
			asset_id: entityId,
			public_id:
				typeof event.public_id === 'string' ? event.public_id : entityId,
		});
	}

	if (entityId && options?.syncResource === 'delete' && ctx.db.resources) {
		await ctx.db.resources.deleteByEntityId(entityId);
	}

	return {
		success: true as const,
		corsairEntityId: entityId,
		data: event,
	};
}

export const UploadWebhooks = {
	upload: {
		match: createCloudinaryMatch('upload'),
		handler: async (ctx, request) =>
			handleNotification<UploadEvent>(
				ctx,
				request,
				'cloudinary.webhook.upload',
				{ syncResource: 'upsert' },
			),
	} satisfies CorsairWebhook<CloudinaryContext, UploadEvent, UploadEvent>,
};

export const EagerWebhooks = {
	eager: {
		match: createCloudinaryMatch('eager'),
		handler: async (ctx, request) =>
			handleNotification<EagerEvent>(ctx, request, 'cloudinary.webhook.eager'),
	} satisfies CorsairWebhook<CloudinaryContext, EagerEvent, EagerEvent>,
};

export const DeleteWebhooks = {
	delete: {
		match: createCloudinaryMatch('delete'),
		handler: async (ctx, request) =>
			handleNotification<DeleteEvent>(
				ctx,
				request,
				'cloudinary.webhook.delete',
				{ syncResource: 'delete' },
			),
	} satisfies CorsairWebhook<CloudinaryContext, DeleteEvent, DeleteEvent>,
};

export const RenameWebhooks = {
	rename: {
		match: createCloudinaryMatch('rename'),
		handler: async (ctx, request) =>
			handleNotification<RenameEvent>(ctx, request, 'cloudinary.webhook.rename'),
	} satisfies CorsairWebhook<CloudinaryContext, RenameEvent, RenameEvent>,
};

export const ResourceWebhooks = {
	resourceTagsChanged: {
		match: createCloudinaryMatch('resource_tags_changed'),
		handler: async (ctx, request) =>
			handleNotification<ResourceTagsChangedEvent>(
				ctx,
				request,
				'cloudinary.webhook.resourceTagsChanged',
			),
	} satisfies CorsairWebhook<
		CloudinaryContext,
		ResourceTagsChangedEvent,
		ResourceTagsChangedEvent
	>,
	resourceContextChanged: {
		match: createCloudinaryMatch('resource_context_changed'),
		handler: async (ctx, request) =>
			handleNotification<ResourceContextChangedEvent>(
				ctx,
				request,
				'cloudinary.webhook.resourceContextChanged',
			),
	} satisfies CorsairWebhook<
		CloudinaryContext,
		ResourceContextChangedEvent,
		ResourceContextChangedEvent
	>,
	resourceMetadataChanged: {
		match: createCloudinaryMatch('resource_metadata_changed'),
		handler: async (ctx, request) =>
			handleNotification<ResourceMetadataChangedEvent>(
				ctx,
				request,
				'cloudinary.webhook.resourceMetadataChanged',
			),
	} satisfies CorsairWebhook<
		CloudinaryContext,
		ResourceMetadataChangedEvent,
		ResourceMetadataChangedEvent
	>,
};

export const FolderWebhooks = {
	createFolder: {
		match: createCloudinaryMatch('create_folder'),
		handler: async (ctx, request) =>
			handleNotification<CreateFolderEvent>(
				ctx,
				request,
				'cloudinary.webhook.createFolder',
			),
	} satisfies CorsairWebhook<
		CloudinaryContext,
		CreateFolderEvent,
		CreateFolderEvent
	>,
	deleteFolder: {
		match: createCloudinaryMatch('delete_folder'),
		handler: async (ctx, request) =>
			handleNotification<DeleteFolderEvent>(
				ctx,
				request,
				'cloudinary.webhook.deleteFolder',
			),
	} satisfies CorsairWebhook<
		CloudinaryContext,
		DeleteFolderEvent,
		DeleteFolderEvent
	>,
	move: {
		match: createCloudinaryMatch('move'),
		handler: async (ctx, request) =>
			handleNotification<MoveEvent>(ctx, request, 'cloudinary.webhook.move'),
	} satisfies CorsairWebhook<CloudinaryContext, MoveEvent, MoveEvent>,
};

export const OtherWebhooks = {
	explode: {
		match: createCloudinaryMatch('explode'),
		handler: async (ctx, request) =>
			handleNotification<ExplodeEvent>(ctx, request, 'cloudinary.webhook.explode'),
	} satisfies CorsairWebhook<CloudinaryContext, ExplodeEvent, ExplodeEvent>,
	accessControlChanged: {
		match: createCloudinaryMatch('access_control_changed'),
		handler: async (ctx, request) =>
			handleNotification<AccessControlChangedEvent>(
				ctx,
				request,
				'cloudinary.webhook.accessControlChanged',
			),
	} satisfies CorsairWebhook<
		CloudinaryContext,
		AccessControlChangedEvent,
		AccessControlChangedEvent
	>,
	relatedAssets: {
		match: createCloudinaryMatch('related_assets'),
		handler: async (ctx, request) =>
			handleNotification<RelatedAssetsEvent>(
				ctx,
				request,
				'cloudinary.webhook.relatedAssets',
			),
	} satisfies CorsairWebhook<
		CloudinaryContext,
		RelatedAssetsEvent,
		RelatedAssetsEvent
	>,
};
