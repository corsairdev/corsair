import type { CorsairWebhookMatcher, RawWebhookRequest } from 'corsair/core';
import crypto from 'crypto';
import { z } from 'zod';

// unknown: body may arrive as a raw string (from HTTP) or a pre-parsed object depending on the framework
function parseBody(body: unknown): unknown {
	return typeof body === 'string' ? JSON.parse(body) : body;
}

// ── Shared sub-schemas ────────────────────────────────────────────────────────

export const BoxUserMiniSchema = z.object({
	type: z.string().optional(),
	id: z.string().optional(),
	name: z.string().optional(),
	login: z.string().optional(),
});

export const BoxWebhookMiniSchema = z.object({
	type: z.literal('webhook'),
	id: z.string(),
});

export const BoxFileMiniSchema = z
	.object({
		type: z.literal('file'),
		id: z.string(),
		sequence_id: z.string().nullable().optional(),
		etag: z.string().optional(),
		sha1: z.string().optional(),
		name: z.string().optional(),
	})
	.passthrough();

export const BoxFolderMiniSchema = z
	.object({
		type: z.literal('folder'),
		id: z.string(),
		sequence_id: z.string().nullable().optional(),
		etag: z.string().optional(),
		name: z.string().optional(),
	})
	.passthrough();

export const BoxCollaborationMiniSchema = z
	.object({
		type: z.literal('collaboration'),
		id: z.string(),
		role: z.string().optional(),
		status: z.string().optional(),
	})
	.passthrough();

export const BoxCommentMiniSchema = z
	.object({
		type: z.literal('comment'),
		id: z.string(),
		message: z.string().optional(),
		created_at: z.string().optional(),
		// unknown: Box webhook comment.item can reference a file, folder, or task — no fixed schema
		item: z.record(z.unknown()).optional(),
		created_by: BoxUserMiniSchema.optional(),
	})
	.passthrough();

export const BoxMetadataInstanceMiniSchema = z
	.object({
		type: z.literal('metadata_instance'),
		id: z.string().optional(),
		scope: z.string().optional(),
		template_key: z.string().optional(),
	})
	.passthrough();

export const BoxSharedLinkMiniSchema = z
	.object({
		type: z.string().optional(),
		id: z.string().optional(),
		shared_link: z
			.object({
				url: z.string().optional(),
				access: z.string().optional(),
			})
			.optional(),
	})
	.passthrough();

// ── Webhook payload envelope ──────────────────────────────────────────────────

export const BoxWebhookPayloadSchema = z.object({
	type: z.literal('webhook_event'),
	id: z.string(),
	created_at: z.string(),
	trigger: z.string(),
	webhook: BoxWebhookMiniSchema,
	created_by: BoxUserMiniSchema,
	// source varies by trigger type; typed as passthrough record
	// any/unknown here because Box sends different source shapes per trigger
	source: z.record(z.unknown()),
	additional_info: z.record(z.unknown()).optional(),
});

export type BoxWebhookPayload = z.infer<typeof BoxWebhookPayloadSchema>;

// ── Per-trigger payload schemas ───────────────────────────────────────────────

const withTrigger = (trigger: string) =>
	BoxWebhookPayloadSchema.extend({ trigger: z.literal(trigger) });

export const CollaborationAcceptedPayloadSchema = withTrigger(
	'COLLABORATION.ACCEPTED',
);
export const CollaborationCreatedPayloadSchema = withTrigger(
	'COLLABORATION.CREATED',
);
export const CollaborationRejectedPayloadSchema = withTrigger(
	'COLLABORATION.REJECTED',
);
export const CollaborationRemovedPayloadSchema = withTrigger(
	'COLLABORATION.REMOVED',
);
export const CollaborationUpdatedPayloadSchema = withTrigger(
	'COLLABORATION.UPDATED',
);

export const CommentCreatedPayloadSchema = withTrigger('COMMENT.CREATED');
export const CommentDeletedPayloadSchema = withTrigger('COMMENT.DELETED');
export const CommentUpdatedPayloadSchema = withTrigger('COMMENT.UPDATED');

export const FileCopiedPayloadSchema = withTrigger('FILE.COPIED');
export const FileDeletedPayloadSchema = withTrigger('FILE.DELETED');
export const FileDownloadedPayloadSchema = withTrigger('FILE.DOWNLOADED');
export const FileLockedPayloadSchema = withTrigger('FILE.LOCKED');
export const FileMovedPayloadSchema = withTrigger('FILE.MOVED');
export const FilePreviewedPayloadSchema = withTrigger('FILE.PREVIEWED');
export const FileRenamedPayloadSchema = withTrigger('FILE.RENAMED');
export const FileRestoredPayloadSchema = withTrigger('FILE.RESTORED');
export const FileTrashedPayloadSchema = withTrigger('FILE.TRASHED');
export const FileUnlockedPayloadSchema = withTrigger('FILE.UNLOCKED');
export const FileUploadedPayloadSchema = withTrigger('FILE.UPLOADED');

export const FolderCopiedPayloadSchema = withTrigger('FOLDER.COPIED');
export const FolderCreatedPayloadSchema = withTrigger('FOLDER.CREATED');
export const FolderDeletedPayloadSchema = withTrigger('FOLDER.DELETED');
export const FolderDownloadedPayloadSchema = withTrigger('FOLDER.DOWNLOADED');
export const FolderMovedPayloadSchema = withTrigger('FOLDER.MOVED');
export const FolderRenamedPayloadSchema = withTrigger('FOLDER.RENAMED');
export const FolderRestoredPayloadSchema = withTrigger('FOLDER.RESTORED');
export const FolderTrashedPayloadSchema = withTrigger('FOLDER.TRASHED');

export const MetadataInstanceCreatedPayloadSchema = withTrigger(
	'METADATA_INSTANCE.CREATED',
);
export const MetadataInstanceDeletedPayloadSchema = withTrigger(
	'METADATA_INSTANCE.DELETED',
);
export const MetadataInstanceUpdatedPayloadSchema = withTrigger(
	'METADATA_INSTANCE.UPDATED',
);

export const SharedLinkCreatedPayloadSchema = withTrigger(
	'SHARED_LINK.CREATED',
);
export const SharedLinkDeletedPayloadSchema = withTrigger(
	'SHARED_LINK.DELETED',
);
export const SharedLinkUpdatedPayloadSchema = withTrigger(
	'SHARED_LINK.UPDATED',
);

// ── Event types ───────────────────────────────────────────────────────────────

export type CollaborationAcceptedEvent = z.infer<
	typeof CollaborationAcceptedPayloadSchema
>;
export type CollaborationCreatedEvent = z.infer<
	typeof CollaborationCreatedPayloadSchema
>;
export type CollaborationRejectedEvent = z.infer<
	typeof CollaborationRejectedPayloadSchema
>;
export type CollaborationRemovedEvent = z.infer<
	typeof CollaborationRemovedPayloadSchema
>;
export type CollaborationUpdatedEvent = z.infer<
	typeof CollaborationUpdatedPayloadSchema
>;
export type CommentCreatedEvent = z.infer<typeof CommentCreatedPayloadSchema>;
export type CommentDeletedEvent = z.infer<typeof CommentDeletedPayloadSchema>;
export type CommentUpdatedEvent = z.infer<typeof CommentUpdatedPayloadSchema>;
export type FileCopiedEvent = z.infer<typeof FileCopiedPayloadSchema>;
export type FileDeletedEvent = z.infer<typeof FileDeletedPayloadSchema>;
export type FileDownloadedEvent = z.infer<typeof FileDownloadedPayloadSchema>;
export type FileLockedEvent = z.infer<typeof FileLockedPayloadSchema>;
export type FileMovedEvent = z.infer<typeof FileMovedPayloadSchema>;
export type FilePreviewedEvent = z.infer<typeof FilePreviewedPayloadSchema>;
export type FileRenamedEvent = z.infer<typeof FileRenamedPayloadSchema>;
export type FileRestoredEvent = z.infer<typeof FileRestoredPayloadSchema>;
export type FileTrashedEvent = z.infer<typeof FileTrashedPayloadSchema>;
export type FileUnlockedEvent = z.infer<typeof FileUnlockedPayloadSchema>;
export type FileUploadedEvent = z.infer<typeof FileUploadedPayloadSchema>;
export type FolderCopiedEvent = z.infer<typeof FolderCopiedPayloadSchema>;
export type FolderCreatedEvent = z.infer<typeof FolderCreatedPayloadSchema>;
export type FolderDeletedEvent = z.infer<typeof FolderDeletedPayloadSchema>;
export type FolderDownloadedEvent = z.infer<
	typeof FolderDownloadedPayloadSchema
>;
export type FolderMovedEvent = z.infer<typeof FolderMovedPayloadSchema>;
export type FolderRenamedEvent = z.infer<typeof FolderRenamedPayloadSchema>;
export type FolderRestoredEvent = z.infer<typeof FolderRestoredPayloadSchema>;
export type FolderTrashedEvent = z.infer<typeof FolderTrashedPayloadSchema>;
export type MetadataInstanceCreatedEvent = z.infer<
	typeof MetadataInstanceCreatedPayloadSchema
>;
export type MetadataInstanceDeletedEvent = z.infer<
	typeof MetadataInstanceDeletedPayloadSchema
>;
export type MetadataInstanceUpdatedEvent = z.infer<
	typeof MetadataInstanceUpdatedPayloadSchema
>;
export type SharedLinkCreatedEvent = z.infer<
	typeof SharedLinkCreatedPayloadSchema
>;
export type SharedLinkDeletedEvent = z.infer<
	typeof SharedLinkDeletedPayloadSchema
>;
export type SharedLinkUpdatedEvent = z.infer<
	typeof SharedLinkUpdatedPayloadSchema
>;

// ── Webhook output map ────────────────────────────────────────────────────────

export type BoxWebhookOutputs = {
	collaborationAccepted: CollaborationAcceptedEvent;
	collaborationCreated: CollaborationCreatedEvent;
	collaborationRejected: CollaborationRejectedEvent;
	collaborationRemoved: CollaborationRemovedEvent;
	collaborationUpdated: CollaborationUpdatedEvent;
	commentCreated: CommentCreatedEvent;
	commentDeleted: CommentDeletedEvent;
	commentUpdated: CommentUpdatedEvent;
	fileCopied: FileCopiedEvent;
	fileDeleted: FileDeletedEvent;
	fileDownloaded: FileDownloadedEvent;
	fileLocked: FileLockedEvent;
	fileMoved: FileMovedEvent;
	filePreviewed: FilePreviewedEvent;
	fileRenamed: FileRenamedEvent;
	fileRestored: FileRestoredEvent;
	fileTrashed: FileTrashedEvent;
	fileUnlocked: FileUnlockedEvent;
	fileUploaded: FileUploadedEvent;
	folderCopied: FolderCopiedEvent;
	folderCreated: FolderCreatedEvent;
	folderDeleted: FolderDeletedEvent;
	folderDownloaded: FolderDownloadedEvent;
	folderMoved: FolderMovedEvent;
	folderRenamed: FolderRenamedEvent;
	folderRestored: FolderRestoredEvent;
	folderTrashed: FolderTrashedEvent;
	metadataInstanceCreated: MetadataInstanceCreatedEvent;
	metadataInstanceDeleted: MetadataInstanceDeletedEvent;
	metadataInstanceUpdated: MetadataInstanceUpdatedEvent;
	sharedLinkCreated: SharedLinkCreatedEvent;
	sharedLinkDeleted: SharedLinkDeletedEvent;
	sharedLinkUpdated: SharedLinkUpdatedEvent;
};

// ── Matcher helper ────────────────────────────────────────────────────────────

export function createBoxMatch(trigger: string): CorsairWebhookMatcher {
	return (request: RawWebhookRequest) => {
		// any: raw body must be cast to read trigger field before schema parse
		const parsed = parseBody(request.body) as Record<string, unknown>;
		return parsed?.trigger === trigger;
	};
}

// ── Signature verification ────────────────────────────────────────────────────

export function verifyBoxWebhookSignature(
	request: {
		payload: BoxWebhookPayload;
		headers: Record<string, string | string[] | undefined>;
		rawBody?: string;
	},
	secret: string,
): { valid: boolean; error?: string } {
	// Box sends single-value strings for these headers
	const rawSig = request.headers['box-signature-primary'];
	const rawTimestamp = request.headers['box-delivery-timestamp'];

	const signature = Array.isArray(rawSig) ? rawSig[0] : rawSig;
	const timestamp = Array.isArray(rawTimestamp)
		? rawTimestamp[0]
		: rawTimestamp;

	if (!signature) {
		return { valid: false, error: 'Missing box-signature-primary header' };
	}

	if (!timestamp) {
		return { valid: false, error: 'Missing box-delivery-timestamp header' };
	}

	if (!secret) {
		return { valid: false, error: 'Missing webhook secret' };
	}

	const deliveredAt = new Date(timestamp).getTime();
	const now = Date.now();
	const FIVE_MINUTES_MS = 5 * 60 * 1000;
	if (Math.abs(now - deliveredAt) > FIVE_MINUTES_MS) {
		return {
			valid: false,
			error: 'Webhook timestamp is too old or too far in the future',
		};
	}
	// Box signature: HMAC-SHA256( delivery_timestamp + raw_body, key ) encoded as base64
	const body = request.rawBody ?? JSON.stringify(request.payload);
	const data = timestamp + body;

	const expectedSignature = crypto
		.createHmac('sha256', secret)
		.update(data)
		.digest('base64');

	let isValid = false;
	try {
		isValid = crypto.timingSafeEqual(
			Buffer.from(signature),
			Buffer.from(expectedSignature),
		);
	} catch {
		return { valid: false, error: 'Signature comparison failed' };
	}

	return {
		valid: isValid,
		error: isValid ? undefined : 'Invalid signature',
	};
}
