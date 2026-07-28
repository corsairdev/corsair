import type {
	CorsairWebhookMatcher,
	RawWebhookRequest,
	WebhookRequest,
} from 'corsair/core';
import { z } from 'zod';
import { verifyCloudinaryNotificationSignature } from '../client';
import { CloudinaryResourceSchema } from '../endpoints/schemas';

const NotificationBaseSchema = z.object({
	notification_type: z.string(),
	request_id: z.string().optional(),
	signature_key: z.string().optional(),
});

export const CloudinaryUploadNotificationSchema = NotificationBaseSchema.extend(
	{
		notification_type: z.literal('upload'),
		asset_id: z.string().optional(),
		public_id: z.string(),
		resource_type: z.string().optional(),
		type: z.string().optional(),
		format: z.string().optional(),
		version: z.number().optional(),
		url: z.string().optional(),
		secure_url: z.string().optional(),
		width: z.number().optional(),
		height: z.number().optional(),
		bytes: z.number().optional(),
		tags: z.array(z.string()).optional(),
	},
).passthrough();

export const CloudinaryEagerNotificationSchema = NotificationBaseSchema.extend({
	notification_type: z.literal('eager'),
	eager: z.array(z.record(z.string(), z.unknown())).optional(),
	batch_id: z.string().optional(),
	asset_id: z.string().optional(),
	public_id: z.string().optional(),
}).passthrough();

export const CloudinaryDeleteNotificationSchema = NotificationBaseSchema.extend(
	{
		notification_type: z.literal('delete'),
		asset_id: z.string().optional(),
		public_id: z.string().optional(),
	},
).passthrough();

export const CloudinaryRenameNotificationSchema = NotificationBaseSchema.extend(
	{
		notification_type: z.literal('rename'),
		from_public_id: z.string().optional(),
		to_public_id: z.string().optional(),
		asset_id: z.string().optional(),
	},
).passthrough();

export const CloudinaryResourceTagsChangedSchema =
	NotificationBaseSchema.extend({
		notification_type: z.literal('resource_tags_changed'),
		public_id: z.string().optional(),
		asset_id: z.string().optional(),
		tags: z.array(z.string()).optional(),
	}).passthrough();

export const CloudinaryResourceContextChangedSchema =
	NotificationBaseSchema.extend({
		notification_type: z.literal('resource_context_changed'),
		public_id: z.string().optional(),
		asset_id: z.string().optional(),
		context: z.record(z.string(), z.unknown()).optional(),
	}).passthrough();

export const CloudinaryResourceMetadataChangedSchema =
	NotificationBaseSchema.extend({
		notification_type: z.literal('resource_metadata_changed'),
		public_id: z.string().optional(),
		asset_id: z.string().optional(),
		metadata: z.record(z.string(), z.unknown()).optional(),
	}).passthrough();

export const CloudinaryCreateFolderNotificationSchema =
	NotificationBaseSchema.extend({
		notification_type: z.literal('create_folder'),
		folder: z
			.object({
				path: z.string().optional(),
				name: z.string().optional(),
			})
			.optional(),
	}).passthrough();

export const CloudinaryDeleteFolderNotificationSchema =
	NotificationBaseSchema.extend({
		notification_type: z.literal('delete_folder'),
		folder: z
			.object({
				path: z.string().optional(),
				name: z.string().optional(),
			})
			.optional(),
	}).passthrough();

export const CloudinaryMoveNotificationSchema = NotificationBaseSchema.extend({
	notification_type: z.literal('move'),
	public_id: z.string().optional(),
	asset_id: z.string().optional(),
	asset_folder: z.string().optional(),
}).passthrough();

export const CloudinaryExplodeNotificationSchema =
	NotificationBaseSchema.extend({
		notification_type: z.literal('explode'),
		public_id: z.string().optional(),
		asset_id: z.string().optional(),
	}).passthrough();

export const CloudinaryAccessControlChangedSchema =
	NotificationBaseSchema.extend({
		notification_type: z.literal('access_control_changed'),
		public_id: z.string().optional(),
		asset_id: z.string().optional(),
	}).passthrough();

export const CloudinaryRelatedAssetsNotificationSchema =
	NotificationBaseSchema.extend({
		notification_type: z.literal('related_assets'),
		asset_id: z.string().optional(),
		public_id: z.string().optional(),
	}).passthrough();

export const CloudinaryWebhookPayloadSchema = z.discriminatedUnion(
	'notification_type',
	[
		CloudinaryUploadNotificationSchema,
		CloudinaryEagerNotificationSchema,
		CloudinaryDeleteNotificationSchema,
		CloudinaryRenameNotificationSchema,
		CloudinaryResourceTagsChangedSchema,
		CloudinaryResourceContextChangedSchema,
		CloudinaryResourceMetadataChangedSchema,
		CloudinaryCreateFolderNotificationSchema,
		CloudinaryDeleteFolderNotificationSchema,
		CloudinaryMoveNotificationSchema,
		CloudinaryExplodeNotificationSchema,
		CloudinaryAccessControlChangedSchema,
		CloudinaryRelatedAssetsNotificationSchema,
	],
);

export type CloudinaryWebhookPayload = z.infer<
	typeof CloudinaryWebhookPayloadSchema
>;
export type CloudinaryUploadNotification = z.infer<
	typeof CloudinaryUploadNotificationSchema
>;
export type CloudinaryEagerNotification = z.infer<
	typeof CloudinaryEagerNotificationSchema
>;
export type CloudinaryDeleteNotification = z.infer<
	typeof CloudinaryDeleteNotificationSchema
>;
export type CloudinaryRenameNotification = z.infer<
	typeof CloudinaryRenameNotificationSchema
>;

export type CloudinaryWebhookOutputs = {
	upload: CloudinaryUploadNotification;
	eager: CloudinaryEagerNotification;
	delete: CloudinaryDeleteNotification;
	rename: CloudinaryRenameNotification;
	resourceTagsChanged: z.infer<typeof CloudinaryResourceTagsChangedSchema>;
	resourceContextChanged: z.infer<
		typeof CloudinaryResourceContextChangedSchema
	>;
	resourceMetadataChanged: z.infer<
		typeof CloudinaryResourceMetadataChangedSchema
	>;
	createFolder: z.infer<typeof CloudinaryCreateFolderNotificationSchema>;
	deleteFolder: z.infer<typeof CloudinaryDeleteFolderNotificationSchema>;
	move: z.infer<typeof CloudinaryMoveNotificationSchema>;
	explode: z.infer<typeof CloudinaryExplodeNotificationSchema>;
	accessControlChanged: z.infer<typeof CloudinaryAccessControlChangedSchema>;
	relatedAssets: z.infer<typeof CloudinaryRelatedAssetsNotificationSchema>;
};

function parseBody(body: unknown): Record<string, unknown> | null {
	if (typeof body === 'string') {
		try {
			const parsed = JSON.parse(body);
			return parsed !== null &&
				typeof parsed === 'object' &&
				!Array.isArray(parsed)
				? (parsed as Record<string, unknown>)
				: null;
		} catch {
			return null;
		}
	}
	return body !== null && typeof body === 'object' && !Array.isArray(body)
		? (body as Record<string, unknown>)
		: null;
}

export function createCloudinaryMatch(
	notificationType: string,
): CorsairWebhookMatcher {
	return (request: RawWebhookRequest) => {
		const parsedBody = parseBody(request.body);
		return (
			parsedBody !== null && parsedBody.notification_type === notificationType
		);
	};
}

export function verifyCloudinaryWebhookSignature(
	request: WebhookRequest<Record<string, unknown>>,
	secret: string,
): { valid: boolean; error?: string } {
	if (!secret) {
		return { valid: false, error: 'No webhook secret configured' };
	}

	const headers = request.headers;
	const signature = headers['x-cld-signature'] ?? headers['X-Cld-Signature'];
	const timestamp = headers['x-cld-timestamp'] ?? headers['X-Cld-Timestamp'];

	if (!signature || !timestamp) {
		return { valid: false, error: 'Missing Cloudinary signature headers' };
	}

	// Signature is over the exact request body bytes. Re-serializing JSON
	// changes whitespace/key order and fails verification.
	if (typeof request.rawBody !== 'string') {
		return {
			valid: false,
			error: 'Missing raw webhook body required for signature verification',
		};
	}

	const valid = verifyCloudinaryNotificationSignature(
		request.rawBody,
		String(timestamp),
		String(signature),
		secret,
	);

	return valid
		? { valid: true }
		: { valid: false, error: 'Invalid Cloudinary webhook signature' };
}

export { CloudinaryResourceSchema };
