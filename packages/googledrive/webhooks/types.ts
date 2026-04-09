import type { CorsairWebhookMatcher, RawWebhookRequest } from 'corsair/core';
import { z } from 'zod';
import type { Change, File } from '../types';

// ─────────────────────────────────────────────────────────────────────────────
// Schemas
// ─────────────────────────────────────────────────────────────────────────────

export const PubSubMessageSchema = z.object({
	data: z.string().optional(),
	attributes: z.record(z.string()).optional(),
	messageId: z.string().optional(),
	publishTime: z.string().optional(),
});
export type PubSubMessage = z.infer<typeof PubSubMessageSchema>;

export const PubSubNotificationSchema = z.object({
	message: PubSubMessageSchema.optional(),
	subscription: z.string().optional(),
	event: z.unknown().optional(),
});
export type PubSubNotification<TEvent = unknown> = Omit<
	z.infer<typeof PubSubNotificationSchema>,
	'event'
> & { event?: TEvent };

export const GoogleDrivePushNotificationSchema = z.object({
	kind: z.string().optional(),
	id: z.string().optional(),
	resourceId: z.string().optional(),
	resourceUri: z.string().optional(),
	resourceState: z.string().optional(),
	changed: z.string().optional(),
	expiration: z.string().optional(),
});
export type GoogleDrivePushNotification = z.infer<
	typeof GoogleDrivePushNotificationSchema
>;

// z.custom<T>() is used for File and Change types imported from ../types to
// avoid duplicating those large schemas here. Provides correct TypeScript types
// with no-op runtime validation.

const ChangeTypeSchema = z.enum([
	'created',
	'updated',
	'deleted',
	'trashed',
	'untrashed',
]);
export type ChangeType = z.infer<typeof ChangeTypeSchema>;

export const DriveChangedEventSchema = z.object({
	type: z.enum(['fileChanged', 'folderChanged']),
	fileId: z.string().optional(),
	folderId: z.string().optional(),
	changeType: ChangeTypeSchema,
	file: z.custom<File>().optional(),
	folder: z.custom<File>().optional(),
	filePath: z.string().optional(),
	change: z.custom<Change>().optional(),
	binaryData: z.string().nullable().optional(),
	allFiles: z.array(
		z.object({
			file: z.custom<File>(),
			filePath: z.string(),
			change: z.custom<Change>(),
			changeType: ChangeTypeSchema,
			binaryData: z.string().nullable().optional(),
		}),
	),
	allFolders: z.array(
		z.object({
			folder: z.custom<File>(),
			filePath: z.string(),
			change: z.custom<Change>(),
			changeType: ChangeTypeSchema,
		}),
	),
});
export type DriveChangedEvent = z.infer<typeof DriveChangedEventSchema>;

export type GoogleDriveWebhookEvent = DriveChangedEvent;

export type GoogleDriveEventName = 'driveChanged';

export interface GoogleDriveEventMap {
	driveChanged: DriveChangedEvent;
}

export type GoogleDriveWebhookPayload<TEvent = unknown> =
	PubSubNotification<TEvent>;

export type GoogleDriveWebhookOutputs = {
	driveChanged: DriveChangedEvent;
};

// ─────────────────────────────────────────────────────────────────────────────
// Utilities
// ─────────────────────────────────────────────────────────────────────────────

export function decodePubSubMessage(data: string): GoogleDrivePushNotification {
	const decodedData = Buffer.from(data, 'base64').toString('utf-8');
	return JSON.parse(decodedData);
}

export function createGoogleDriveWebhookMatcher(
	eventType: GoogleDriveEventName,
): CorsairWebhookMatcher {
	return (request: RawWebhookRequest) => {
		const body = request.body as PubSubNotification;
		if (!body.message?.data) {
			return false;
		}

		try {
			const pushNotification = decodePubSubMessage(body.message.data!);
			return (
				!!pushNotification.resourceId &&
				!!pushNotification.resourceUri &&
				pushNotification.resourceUri.includes('/drive/')
			);
		} catch {
			return false;
		}
	};
}
