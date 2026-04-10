import type {
	CorsairWebhookMatcher,
	RawWebhookRequest,
	WebhookRequest,
} from 'corsair/core';
import { verifyHmacSignature } from 'corsair/http';
import { z } from 'zod';

// ── Real Dropbox Webhook Payload ──────────────────────────────────────────────
//
// Dropbox sends a single notification format for ALL file system changes
// (file added, deleted, moved, folder created, etc.). The payload only tells
// you WHICH accounts changed — you must poll files/list_folder/continue
// to discover what actually changed.
//
// Real payload from ngrok:
// {
//   "delta":       { "users": [2126824979] },
//   "list_folder": { "accounts": ["dbid:AABD0_QRzall4oenQBjpsxfnxw9bUEzzTa4"] }
// }

export const DropboxChangeNotificationSchema = z
	.object({
		delta: z
			.object({
				users: z.array(z.number()),
			})
			.optional(),
		list_folder: z
			.object({
				accounts: z.array(z.string()),
			})
			.optional(),
	})
	.passthrough();

export type DropboxChangeNotification = z.infer<
	typeof DropboxChangeNotificationSchema
>;

// ── Webhook Output Types ──────────────────────────────────────────────────────
//
// All Dropbox webhook handlers share the same underlying notification payload.
// Different handler names represent semantic subscriptions — they all respond
// to the same event type since Dropbox does not differentiate in the payload.

export type DropboxFileSystemChangedEvent = DropboxChangeNotification;

export const DropboxFileSystemChangedEventSchema =
	DropboxChangeNotificationSchema;

export type DropboxWebhookOutputs = {
	fileSystemChanged: DropboxFileSystemChangedEvent;
};

export type DropboxWebhookPayload = DropboxChangeNotification;

// ── Utilities ─────────────────────────────────────────────────────────────────

// unknown used because this receives raw webhook bodies of any type before parsing/validation
function parseBody(body: unknown): unknown {
	return typeof body === 'string' ? JSON.parse(body) : body;
}

/**
 * Serialize a value using Python's json.dumps() default format, which is what
 * Dropbox uses to sign webhook payloads. Unlike JS JSON.stringify, Python adds
 * a space after each ":" and "," separator, e.g.:
 *   {"delta": {"users": [123]}, "list_folder": {"accounts": ["dbid:..."]}}
 *
 * The framework re-serializes the parsed body via JSON.stringify (compact, no
 * spaces) before passing rawBody to handlers, so we must reconstruct the exact
 * bytes Dropbox signed to verify the HMAC.
 */
function dropboxJsonSerialize(value: unknown): string {
	if (Array.isArray(value)) {
		return '[' + value.map(dropboxJsonSerialize).join(', ') + ']';
	}
	if (value !== null && typeof value === 'object') {
		// any cast needed because Object.entries requires Record<string, unknown>
		const pairs = Object.entries(value as Record<string, unknown>).map(
			([k, v]) => JSON.stringify(k) + ': ' + dropboxJsonSerialize(v),
		);
		return '{' + pairs.join(', ') + '}';
	}
	return JSON.stringify(value);
}

export function verifyDropboxWebhookSignature(
	request: WebhookRequest<unknown>,
	appSecret?: string,
): { valid: boolean; error?: string } {
	if (!appSecret) {
		return { valid: false, error: 'Missing webhook app secret' };
	}

	const headers = request.headers;
	const signature = Array.isArray(headers['x-dropbox-signature'])
		? headers['x-dropbox-signature'][0]
		: headers['x-dropbox-signature'];

	if (!signature) {
		return { valid: false, error: 'Missing x-dropbox-signature header' };
	}

	// Re-serialize the parsed payload in Dropbox's format (Python json.dumps
	// style) so the HMAC is computed over the same bytes Dropbox signed.
	// Using request.payload (already parsed) avoids any encoding ambiguity.
	const bodyToSign = dropboxJsonSerialize(request.payload);
	const isValid = verifyHmacSignature(
		bodyToSign,
		appSecret,
		signature,
		'sha256',
	);
	if (!isValid) {
		return { valid: false, error: 'Invalid signature' };
	}

	return { valid: true };
}

/**
 * Creates a matcher for Dropbox webhook notifications.
 *
 * Dropbox sends a single notification format for ALL changes (files and folders).
 * The payload always contains `list_folder.accounts` and/or `delta.users`.
 * The `_eventTag` parameter is accepted for API consistency but not used for
 * matching — all Dropbox notifications look identical.
 */
export function createDropboxEventMatch(
	_eventTag: string,
): CorsairWebhookMatcher {
	return (request: RawWebhookRequest) => {
		// any cast needed because request.body is an untyped raw webhook payload
		const parsedBody = parseBody(request.body) as Record<string, unknown>;

		// A valid Dropbox change notification always has list_folder or delta
		const hasListFolder =
			parsedBody.list_folder !== null &&
			parsedBody.list_folder !== undefined &&
			typeof parsedBody.list_folder === 'object';

		const hasDelta =
			parsedBody.delta !== null &&
			parsedBody.delta !== undefined &&
			typeof parsedBody.delta === 'object';

		return hasListFolder || hasDelta;
	};
}
