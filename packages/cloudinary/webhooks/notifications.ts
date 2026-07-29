import type { CorsairWebhook } from 'corsair/core';
import { logEventFromContext } from 'corsair/core';
import type { z } from 'zod';
import type { CloudinaryContext } from '../plugin-types';
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
	createCloudinaryMatch,
	verifyCloudinaryWebhookSignature,
} from './types';

type UploadEvent = z.infer<typeof CloudinaryUploadNotificationSchema>;
type EagerEvent = z.infer<typeof CloudinaryEagerNotificationSchema>;
type DeleteEvent = z.infer<typeof CloudinaryDeleteNotificationSchema>;
type RenameEvent = z.infer<typeof CloudinaryRenameNotificationSchema>;
type ResourceTagsChangedEvent = z.infer<
	typeof CloudinaryResourceTagsChangedSchema
>;
type ResourceContextChangedEvent = z.infer<
	typeof CloudinaryResourceContextChangedSchema
>;
type ResourceMetadataChangedEvent = z.infer<
	typeof CloudinaryResourceMetadataChangedSchema
>;
type CreateFolderEvent = z.infer<
	typeof CloudinaryCreateFolderNotificationSchema
>;
type DeleteFolderEvent = z.infer<
	typeof CloudinaryDeleteFolderNotificationSchema
>;
type MoveEvent = z.infer<typeof CloudinaryMoveNotificationSchema>;
type ExplodeEvent = z.infer<typeof CloudinaryExplodeNotificationSchema>;
type AccessControlChangedEvent = z.infer<
	typeof CloudinaryAccessControlChangedSchema
>;
type RelatedAssetsEvent = z.infer<
	typeof CloudinaryRelatedAssetsNotificationSchema
>;

function folderEntityId(event: Record<string, unknown>): string | undefined {
	const folder = event.folder;
	if (folder && typeof folder === 'object' && !Array.isArray(folder)) {
		const record = folder as Record<string, unknown>;
		if (typeof record.path === 'string' && record.path) {
			return record.path;
		}
		if (typeof record.name === 'string' && record.name) {
			return record.name;
		}
	}
	return undefined;
}

async function handleNotification<T extends Record<string, unknown>>(
	ctx: CloudinaryContext,
	request: Parameters<CorsairWebhook<CloudinaryContext, T, T>['handler']>[1],
	logKey: string,
	schema: {
		safeParse: (
			value: unknown,
		) => { success: true; data: T } | { success: false };
	},
	options?: {
		syncResource?: 'upsert' | 'delete';
		syncFolder?: 'upsert' | 'delete';
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

	const parsed = schema.safeParse(request.payload);
	if (!parsed.success) {
		return {
			success: false as const,
			statusCode: 400,
			error: 'Invalid webhook payload',
		};
	}

	const event = parsed.data;
	await logEventFromContext(ctx, logKey, { ...event }, 'completed');

	const assetId =
		typeof event.asset_id === 'string' && event.asset_id
			? event.asset_id
			: undefined;
	const publicId =
		typeof event.public_id === 'string' && event.public_id
			? event.public_id
			: undefined;
	// Prefer immutable asset_id for cache keys; public_id is a fallback only.
	const entityId = assetId ?? publicId;

	if (entityId && options?.syncResource === 'upsert' && ctx.db.resources) {
		await ctx.db.resources.upsertByEntityId(entityId, {
			...event,
			asset_id: assetId ?? entityId,
			public_id: publicId ?? entityId,
		});
	}

	if (options?.syncResource === 'delete' && ctx.db.resources) {
		if (assetId) {
			await ctx.db.resources.deleteByEntityId(assetId);
		} else if (publicId) {
			// Uploads are cached by asset_id when present; delete notifications
			// sometimes only send public_id. Best-effort delete by that key.
			await ctx.db.resources.deleteByEntityId(publicId);
		}
	}

	const folderId = folderEntityId(event);
	if (folderId && options?.syncFolder === 'upsert' && ctx.db.folders) {
		await ctx.db.folders.upsertByEntityId(folderId, {
			...event,
			name: folderId.split('/').pop() ?? folderId,
			path: folderId,
		});
	}

	if (options?.syncFolder === 'delete' && folderId && ctx.db.folders) {
		await ctx.db.folders.deleteByEntityId(folderId);
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
				CloudinaryUploadNotificationSchema,
				{ syncResource: 'upsert' },
			),
	} satisfies CorsairWebhook<CloudinaryContext, UploadEvent, UploadEvent>,
};

export const EagerWebhooks = {
	eager: {
		match: createCloudinaryMatch('eager'),
		handler: async (ctx, request) =>
			handleNotification<EagerEvent>(
				ctx,
				request,
				'cloudinary.webhook.eager',
				CloudinaryEagerNotificationSchema,
			),
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
				CloudinaryDeleteNotificationSchema,
				{ syncResource: 'delete' },
			),
	} satisfies CorsairWebhook<CloudinaryContext, DeleteEvent, DeleteEvent>,
};

export const RenameWebhooks = {
	rename: {
		match: createCloudinaryMatch('rename'),
		handler: async (ctx, request) =>
			handleNotification<RenameEvent>(
				ctx,
				request,
				'cloudinary.webhook.rename',
				CloudinaryRenameNotificationSchema,
				{ syncResource: 'upsert' },
			),
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
				CloudinaryResourceTagsChangedSchema,
				{ syncResource: 'upsert' },
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
				CloudinaryResourceContextChangedSchema,
				{ syncResource: 'upsert' },
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
				CloudinaryResourceMetadataChangedSchema,
				{ syncResource: 'upsert' },
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
				CloudinaryCreateFolderNotificationSchema,
				{ syncFolder: 'upsert' },
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
				CloudinaryDeleteFolderNotificationSchema,
				{ syncFolder: 'delete' },
			),
	} satisfies CorsairWebhook<
		CloudinaryContext,
		DeleteFolderEvent,
		DeleteFolderEvent
	>,
	move: {
		match: createCloudinaryMatch('move'),
		handler: async (ctx, request) =>
			handleNotification<MoveEvent>(
				ctx,
				request,
				'cloudinary.webhook.move',
				CloudinaryMoveNotificationSchema,
				{ syncResource: 'upsert' },
			),
	} satisfies CorsairWebhook<CloudinaryContext, MoveEvent, MoveEvent>,
};

export const OtherWebhooks = {
	explode: {
		match: createCloudinaryMatch('explode'),
		handler: async (ctx, request) =>
			handleNotification<ExplodeEvent>(
				ctx,
				request,
				'cloudinary.webhook.explode',
				CloudinaryExplodeNotificationSchema,
			),
	} satisfies CorsairWebhook<CloudinaryContext, ExplodeEvent, ExplodeEvent>,
	accessControlChanged: {
		match: createCloudinaryMatch('access_control_changed'),
		handler: async (ctx, request) =>
			handleNotification<AccessControlChangedEvent>(
				ctx,
				request,
				'cloudinary.webhook.accessControlChanged',
				CloudinaryAccessControlChangedSchema,
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
				CloudinaryRelatedAssetsNotificationSchema,
			),
	} satisfies CorsairWebhook<
		CloudinaryContext,
		RelatedAssetsEvent,
		RelatedAssetsEvent
	>,
};
