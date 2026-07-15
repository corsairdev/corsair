import type { CorsairWebhookMatcher, RawWebhookRequest } from 'corsair/core';
import { z } from 'zod';
import type { DocumentStructure } from '../client';
import type { Document } from '../types';

// ─────────────────────────────────────────────────────────────────────────────
// Schemas
// ─────────────────────────────────────────────────────────────────────────────

export const PubSubMessageSchema = z.object({
	data: z.string().optional(),
	attributes: z.record(z.string(), z.string()).optional(),
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

// Google Docs has no native push, so triggers ride on a Drive watch channel.
// The decoded push is therefore a standard Drive push notification.
export const GoogleDocsPushNotificationSchema = z.object({
	kind: z.string().optional(),
	id: z.string().optional(),
	resourceId: z.string().optional(),
	resourceUri: z.string().optional(),
	resourceState: z.string().optional(),
	changed: z.string().optional(),
	expiration: z.string().optional(),
});
export type GoogleDocsPushNotification = z.infer<
	typeof GoogleDocsPushNotificationSchema
>;

// The 10 listed triggers fan out from one change push. Each is a `type` on the
// emitted event, gated through ctx.options.webhookEvents (see changes.ts).
export const GoogleDocsEventNameSchema = z.enum([
	'documentCreated',
	'documentAdded',
	'documentUpdated',
	'documentDeleted',
	'documentStructureChanged',
	'keywordDetected',
	'documentWordCountThreshold',
	'documentPlaceholderFilled',
	'documentSearchUpdate',
	'folderCreated',
]);
export type GoogleDocsEventName = z.infer<typeof GoogleDocsEventNameSchema>;

const StructureSummarySchema = z.object({
	headers: z.number(),
	footers: z.number(),
	footnotes: z.number(),
	tables: z.number(),
	images: z.number(),
	positionedObjects: z.number(),
	namedRanges: z.number(),
});

export const DocsChangedEventSchema = z.object({
	type: GoogleDocsEventNameSchema,
	documentId: z.string().optional(),
	title: z.string().optional(),
	changeType: z.enum(['created', 'updated', 'deleted', 'trashed']).optional(),
	// predicate-specific context (keyword hit, threshold met, placeholder gone, query match)
	matchedValue: z.string().optional(),
	wordCount: z.number().optional(),
	structure: StructureSummarySchema.optional(),
	document: z.custom<Document>().optional(),
});
export type DocsChangedEvent = z.infer<typeof DocsChangedEventSchema>;
export type StructureSummary = DocumentStructure;

export type GoogleDocsWebhookPayload<TEvent = unknown> =
	PubSubNotification<TEvent>;

export type GoogleDocsWebhookOutputs = {
	docChanged: DocsChangedEvent;
};

// ─────────────────────────────────────────────────────────────────────────────
// Utilities
// ─────────────────────────────────────────────────────────────────────────────

export function decodePubSubMessage(data: string): GoogleDocsPushNotification {
	const decodedData = Buffer.from(data, 'base64').toString('utf-8');
	return JSON.parse(decodedData);
}

export function createGoogleDocsWebhookMatcher(
	_eventType: 'docChanged',
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
