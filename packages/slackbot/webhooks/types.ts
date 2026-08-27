import type {
	CorsairWebhookMatcher,
	RawWebhookRequest,
	WebhookRequest,
} from 'corsair/core';
import { verifySlackSignature } from 'corsair/http';
import { z } from 'zod';

// ─────────────────────────────────────────────────────────────────────────────
// Events API payloads
//
// Slack wraps every subscribed event in an `event_callback` envelope carrying
// the workspace id; the inner `event` holds the payload proper. The one
// exception is `url_verification`, which arrives bare during endpoint setup.
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Slack reports where a message was posted through `channel_type`, which is the
 * only thing distinguishing a DM from a group DM from a private channel.
 */
export const ChannelTypeSchema = z.enum(['channel', 'group', 'im', 'mpim']);
export type SlackChannelType = z.infer<typeof ChannelTypeSchema>;

export const MessageEventSchema = z
	.object({
		type: z.literal('message'),
		subtype: z.string().optional(),
		channel: z.string(),
		channel_type: ChannelTypeSchema.optional(),
		user: z.string().optional(),
		bot_id: z.string().optional(),
		app_id: z.string().optional(),
		bot_profile: z.record(z.string(), z.unknown()).optional(),
		text: z.string().optional(),
		ts: z.string(),
		thread_ts: z.string().optional(),
		parent_user_id: z.string().optional(),
		team: z.string().optional(),
		event_ts: z.string().optional(),
		blocks: z.array(z.record(z.string(), z.unknown())).optional(),
		files: z.array(z.record(z.string(), z.unknown())).optional(),
	})
	.loose();

export const ChannelCreatedEventSchema = z
	.object({
		type: z.literal('channel_created'),
		channel: z
			.object({
				id: z.string(),
				name: z.string().optional(),
				created: z.number().optional(),
				creator: z.string().optional(),
				is_channel: z.boolean().optional(),
				is_private: z.boolean().optional(),
			})
			.loose(),
		event_ts: z.string().optional(),
	})
	.loose();

const ReactionItemSchema = z
	.object({
		type: z.string(),
		channel: z.string().optional(),
		ts: z.string().optional(),
		file: z.string().optional(),
	})
	.loose();

export const ReactionAddedEventSchema = z
	.object({
		type: z.literal('reaction_added'),
		user: z.string(),
		reaction: z.string(),
		item_user: z.string().optional(),
		item: ReactionItemSchema,
		event_ts: z.string().optional(),
	})
	.loose();

export const ReactionRemovedEventSchema = z
	.object({
		type: z.literal('reaction_removed'),
		user: z.string(),
		reaction: z.string(),
		item_user: z.string().optional(),
		item: ReactionItemSchema,
		event_ts: z.string().optional(),
	})
	.loose();

export const UrlVerificationSchema = z
	.object({
		type: z.literal('url_verification'),
		token: z.string().optional(),
		challenge: z.string(),
	})
	.loose();

export type MessageEvent = z.infer<typeof MessageEventSchema>;
export type ChannelCreatedEvent = z.infer<typeof ChannelCreatedEventSchema>;
export type ReactionAddedEvent = z.infer<typeof ReactionAddedEventSchema>;
export type ReactionRemovedEvent = z.infer<typeof ReactionRemovedEventSchema>;
export type UrlVerificationEvent = z.infer<typeof UrlVerificationSchema>;

export const ChallengeResponseSchema = z.object({
	type: z.literal('url_verification'),
	challenge: z.string(),
});

export type SlackbotWebhookOutputs = {
	botMessage: MessageEvent;
	channelCreated: ChannelCreatedEvent;
	directMessage: MessageEvent;
	message: MessageEvent;
	groupDirectMessage: MessageEvent;
	privateChannelMessage: MessageEvent;
	reactionAdded: ReactionAddedEvent;
	reactionRemoved: ReactionRemovedEvent;
	threadReply: MessageEvent;
	challenge: z.infer<typeof ChallengeResponseSchema>;
};

// ─────────────────────────────────────────────────────────────────────────────
// Matching
// ─────────────────────────────────────────────────────────────────────────────

function parseBody(body: unknown): Record<string, unknown> | null {
	if (typeof body === 'string') {
		try {
			const parsed: unknown = JSON.parse(body);
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

/** Unwraps the `event_callback` envelope, returning the inner event. */
function readEvent(request: RawWebhookRequest): Record<string, unknown> | null {
	const body = parseBody(request.body);
	if (!body || body.type !== 'event_callback') return null;
	const event = body.event;
	return event !== null && typeof event === 'object' && !Array.isArray(event)
		? (event as Record<string, unknown>)
		: null;
}

function isBotMessage(event: Record<string, unknown>): boolean {
	return typeof event.bot_id === 'string' || event.subtype === 'bot_message';
}

/**
 * A thread reply carries a `thread_ts` pointing at an earlier message. The
 * thread parent itself also carries `thread_ts` — equal to its own `ts` — so
 * the two must be compared rather than merely checking for presence.
 */
function isThreadReply(event: Record<string, unknown>): boolean {
	const threadTs = event.thread_ts;
	return typeof threadTs === 'string' && threadTs !== event.ts;
}

const SYSTEM_MESSAGE_SUBTYPES = new Set([
	'bot_add',
	'bot_remove',
	'channel_archive',
	'channel_join',
	'channel_leave',
	'channel_name',
	'channel_posting_permissions',
	'channel_purpose',
	'channel_topic',
	'channel_unarchive',
	'ekm_access_denied',
	'group_archive',
	'group_join',
	'group_leave',
	'group_name',
	'group_purpose',
	'group_topic',
	'group_unarchive',
	'message_changed',
	'message_deleted',
	'message_replied',
	'pinned_item',
	'unpinned_item',
]);

function isSystemMessage(event: Record<string, unknown>): boolean {
	const subtype = event.subtype;
	return typeof subtype === 'string' && SYSTEM_MESSAGE_SUBTYPES.has(subtype);
}

/**
 * Builds a matcher for a `message` event narrowed to one surface.
 *
 * The six message triggers partition the space rather than overlapping: bot
 * messages and thread replies are claimed by their own triggers first, so a bot
 * posting in a public channel fires `botMessage` alone and a human replying in
 * a thread fires `threadReply` alone. Without that, a single Slack event would
 * fan out to three handlers and an automation would act on it repeatedly.
 */
function createMessageMatch(
	channelType: SlackChannelType,
): CorsairWebhookMatcher {
	return (request: RawWebhookRequest) => {
		const event = readEvent(request);
		if (!event || event.type !== 'message') return false;
		if (isBotMessage(event) || isThreadReply(event) || isSystemMessage(event)) {
			return false;
		}
		return event.channel_type === channelType;
	};
}

/** Any message posted by a bot or app, on any surface. */
export const matchBotMessage: CorsairWebhookMatcher = (request) => {
	const event = readEvent(request);
	if (!event || event.type !== 'message') return false;
	if (isSystemMessage(event)) return false;
	return isBotMessage(event);
};

/** Any human reply inside a thread, on any surface. */
export const matchThreadReply: CorsairWebhookMatcher = (request) => {
	const event = readEvent(request);
	if (!event || event.type !== 'message') return false;
	if (isBotMessage(event) || isSystemMessage(event)) return false;
	return isThreadReply(event);
};

export const matchMessage = createMessageMatch('channel');
export const matchDirectMessage = createMessageMatch('im');
export const matchGroupDirectMessage = createMessageMatch('mpim');
export const matchPrivateChannelMessage = createMessageMatch('group');

/** Matches a non-message event by its `event.type`. */
export function createSlackbotEventMatch(
	eventType: string,
): CorsairWebhookMatcher {
	return (request: RawWebhookRequest) => {
		const event = readEvent(request);
		return event?.type === eventType;
	};
}

/** The bare handshake Slack sends when an Events API URL is first saved. */
export const matchUrlVerification: CorsairWebhookMatcher = (request) => {
	const body = parseBody(request.body);
	return body?.type === 'url_verification';
};

// ─────────────────────────────────────────────────────────────────────────────
// Signature verification
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Verifies `X-Slack-Signature` over the raw request body.
 *
 * The signature covers the exact bytes Slack sent, so this must run against
 * `rawBody`; re-serialising the parsed payload would change key order and
 * whitespace and invalidate every request. `verifySlackSignature` also enforces
 * the timestamp freshness window that makes captured requests non-replayable.
 */
export function verifySlackbotWebhookSignature(
	request: WebhookRequest,
	signingSecret?: string,
): { valid: boolean; error?: string } {
	if (request.hubVerified === true) {
		return { valid: true };
	}
	if (!signingSecret) {
		return { valid: false, error: 'Missing Slack signing secret' };
	}

	const rawBody = request.rawBody;
	if (!rawBody) {
		return {
			valid: false,
			error: 'Missing raw body for signature verification',
		};
	}

	const headers = request.headers;
	const signature = Array.isArray(headers['x-slack-signature'])
		? headers['x-slack-signature'][0]
		: headers['x-slack-signature'];
	const timestamp = Array.isArray(headers['x-slack-request-timestamp'])
		? headers['x-slack-request-timestamp'][0]
		: headers['x-slack-request-timestamp'];

	if (!signature || !timestamp) {
		return {
			valid: false,
			error: 'Missing x-slack-signature or x-slack-request-timestamp header',
		};
	}

	if (!verifySlackSignature(rawBody, signingSecret, timestamp, signature)) {
		return { valid: false, error: 'Invalid signature' };
	}

	return { valid: true };
}
