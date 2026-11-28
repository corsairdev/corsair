import { createHmac, timingSafeEqual } from 'node:crypto';
import type {
	CorsairWebhook,
	RawWebhookRequest,
	WebhookRequest,
} from 'corsair/core';
import { z } from 'zod';
import type { DiscourseContext } from '../index';

// A Discourse forum posts events to the webhooks set up under Admin > API >
// Webhooks. Each delivery carries X-Discourse-Event-Type (topic, post, user...),
// X-Discourse-Event (topic_created...), X-Discourse-Event-Id (a counter per
// webhook, for dropping repeats), X-Discourse-Instance and
// X-Discourse-Event-Signature: `sha256=<hex>`, an HMAC-SHA256 of the raw body
// with the webhook's secret (checked on real deliveries from Discourse
// 2026.12, 11-28). The body is `{ <type>: { ...the record } }`. There is no
// timestamp to bound replays: drop repeats by event id.

export const DiscourseWebhookEventSchema = z.enum([
	'category_created',
	'category_destroyed',
	'category_updated',
	'group_created',
	'group_destroyed',
	'group_updated',
	'notification_created',
	'ping',
	'post_created',
	'post_destroyed',
	'post_edited',
	'post_liked',
	'post_recovered',
	'reviewable_created',
	'reviewable_updated',
	'tag_created',
	'tag_destroyed',
	'tag_updated',
	'topic_created',
	'topic_destroyed',
	'topic_edited',
	'topic_recovered',
	'topic_revised',
	'topic_status_updated',
	'user_added_to_group',
	'user_anonymized',
	'user_approved',
	'user_badge_granted',
	'user_badge_revoked',
	'user_confirmed_email',
	'user_created',
	'user_destroyed',
	'user_logged_in',
	'user_logged_out',
	'user_promoted',
	'user_suspended',
	'user_unsuspended',
	'user_updated',
] as [string, ...string[]]);
export type DiscourseWebhookEventName = z.infer<
	typeof DiscourseWebhookEventSchema
>;

/** The record Discourse sends: the common fields stay typed, the rest pass through. */
const RecordSchema = z
	.object({
		id: z.number().nullish(),
		username: z.string().nullish(),
		name: z.string().nullish(),
		title: z.string().nullish(),
		slug: z.string().nullish(),
		topic_id: z.number().nullish(),
		post_number: z.number().nullish(),
		raw: z.string().nullish(),
		created_at: z.string().nullish(),
		updated_at: z.string().nullish(),
	})
	.passthrough();

function eventSchema(key: string) {
	return key === 'ping'
		? z.object({ ping: z.string().nullish() }).passthrough()
		: z
				.object({
					[key]: RecordSchema.describe(
						`The ${key.replace('_', ' ')} as Discourse serializes it.`,
					),
				})
				.passthrough();
}

export type DiscourseWebhookEvent = {
	[key: string]: unknown;
};

function header(
	headers: WebhookRequest<unknown>['headers'],
	name: string,
): string | undefined {
	const value = Object.entries(headers).find(
		([key]) => key.toLowerCase() === name,
	)?.[1];
	return Array.isArray(value) ? value[0] : value;
}

/**
 * Discourse sends some events under names of their own that its webhook
 * settings group together (app/models/web_hook.rb): `topic_<status>_status_updated`
 * (closed, archived, visible, pinned...) and the reviewable score and
 * transition events. They map to one handler each.
 */
export function canonicalEvent(name: string | undefined): string | undefined {
	if (!name) return name;
	if (/^topic_\w+_status_updated$/.test(name)) return 'topic_status_updated';
	if (
		name === 'reviewable_score_updated' ||
		name === 'reviewable_transitioned_to'
	) {
		return 'reviewable_updated';
	}
	return name;
}

/** The event a Discourse-signed request carries, from X-Discourse-Event. */
export function discourseEventName(
	request: RawWebhookRequest,
): DiscourseWebhookEventName | undefined {
	if (!header(request.headers, 'x-discourse-event-signature')) return undefined;
	const parsed = DiscourseWebhookEventSchema.safeParse(
		canonicalEvent(header(request.headers, 'x-discourse-event')),
	);
	return parsed.success ? parsed.data : undefined;
}

export function matchDiscourseWebhook(request: RawWebhookRequest): boolean {
	return discourseEventName(request) !== undefined;
}

/**
 * Discourse's scheme: `X-Discourse-Event-Signature: sha256=<hex>`, the hex
 * being HMAC-SHA256(secret, rawBody). Compared in constant time.
 */
export function verifyDiscourseSignature(
	request: WebhookRequest<unknown>,
	secret: string,
): boolean {
	const signature = header(request.headers, 'x-discourse-event-signature');
	if (!signature || !request.rawBody || !secret.trim()) return false;
	const supplied = signature.trim().replace(/^sha256=/, '');
	if (!/^[a-f0-9]{64}$/i.test(supplied)) return false;
	const expected = createHmac('sha256', secret)
		.update(request.rawBody)
		.digest();
	return timingSafeEqual(Buffer.from(supplied, 'hex'), expected);
}

function webhookFor(
	name: DiscourseWebhookEventName,
	key: string,
): CorsairWebhook<
	DiscourseContext,
	DiscourseWebhookEvent,
	DiscourseWebhookEvent
> {
	const schema = eventSchema(key);
	return {
		match: (request) => discourseEventName(request) === name,
		handler: async (ctx, request) => {
			if (
				request.hubVerified !== true &&
				!verifyDiscourseSignature(request, ctx.key)
			) {
				return {
					success: false,
					statusCode: 401,
					error: 'Invalid webhook signature',
				};
			}
			// Parse the verified bytes, not a separately parsed payload.
			try {
				if (!request.rawBody) throw new Error('Missing raw body');
				return {
					success: true,
					data: schema.parse(
						JSON.parse(request.rawBody),
					) as DiscourseWebhookEvent,
				};
			} catch {
				return {
					success: false,
					statusCode: 400,
					error: 'Invalid webhook payload',
				};
			}
		},
	};
}

export const discourseWebhooksNested = {
	topics: {
		created: webhookFor('topic_created', 'topic'),
		revised: webhookFor('topic_revised', 'topic'),
		statusUpdated: webhookFor('topic_status_updated', 'topic'),
		edited: webhookFor('topic_edited', 'topic'),
		destroyed: webhookFor('topic_destroyed', 'topic'),
		recovered: webhookFor('topic_recovered', 'topic'),
	},
	posts: {
		created: webhookFor('post_created', 'post'),
		edited: webhookFor('post_edited', 'post'),
		destroyed: webhookFor('post_destroyed', 'post'),
		recovered: webhookFor('post_recovered', 'post'),
	},
	users: {
		created: webhookFor('user_created', 'user'),
		loggedIn: webhookFor('user_logged_in', 'user'),
		loggedOut: webhookFor('user_logged_out', 'user'),
		confirmedEmail: webhookFor('user_confirmed_email', 'user'),
		anonymized: webhookFor('user_anonymized', 'user'),
		approved: webhookFor('user_approved', 'user'),
		updated: webhookFor('user_updated', 'user'),
		destroyed: webhookFor('user_destroyed', 'user'),
		suspended: webhookFor('user_suspended', 'user'),
		unsuspended: webhookFor('user_unsuspended', 'user'),
		addedToGroup: webhookFor('user_added_to_group', 'group_user'),
		promoted: webhookFor('user_promoted', 'user_promoted'),
	},
	groups: {
		created: webhookFor('group_created', 'group'),
		updated: webhookFor('group_updated', 'group'),
		destroyed: webhookFor('group_destroyed', 'group'),
	},
	categories: {
		created: webhookFor('category_created', 'category'),
		updated: webhookFor('category_updated', 'category'),
		destroyed: webhookFor('category_destroyed', 'category'),
	},
	tags: {
		created: webhookFor('tag_created', 'tag'),
		updated: webhookFor('tag_updated', 'tag'),
		destroyed: webhookFor('tag_destroyed', 'tag'),
	},
	reviewables: {
		created: webhookFor('reviewable_created', 'reviewable'),
		updated: webhookFor('reviewable_updated', 'reviewable'),
	},
	notifications: {
		created: webhookFor('notification_created', 'notification'),
	},
	badges: {
		granted: webhookFor('user_badge_granted', 'user_badge'),
		revoked: webhookFor('user_badge_revoked', 'user_badge'),
	},
	likes: {
		liked: webhookFor('post_liked', 'like'),
	},
	ping: {
		ping: webhookFor('ping', 'ping'),
	},
} as const;

export const discourseWebhookSchemas = {
	'topics.created': {
		description: 'A topic was created (topic_created).',
		payload: eventSchema('topic'),
		response: eventSchema('topic'),
	},
	'topics.statusUpdated': {
		description:
			'A topic was closed, archived, pinned, unlisted or had another status change (topic_<status>_status_updated).',
		payload: eventSchema('topic'),
		response: eventSchema('topic'),
	},
	'topics.revised': {
		description: 'A topic got a new revision (topic_revised).',
		payload: eventSchema('topic'),
		response: eventSchema('topic'),
	},
	'topics.edited': {
		description: 'A topic was edited (topic_edited).',
		payload: eventSchema('topic'),
		response: eventSchema('topic'),
	},
	'topics.destroyed': {
		description: 'A topic was deleted (topic_destroyed).',
		payload: eventSchema('topic'),
		response: eventSchema('topic'),
	},
	'topics.recovered': {
		description: 'A topic was restored (topic_recovered).',
		payload: eventSchema('topic'),
		response: eventSchema('topic'),
	},
	'posts.created': {
		description: 'A post was created (post_created).',
		payload: eventSchema('post'),
		response: eventSchema('post'),
	},
	'posts.edited': {
		description: 'A post was edited (post_edited).',
		payload: eventSchema('post'),
		response: eventSchema('post'),
	},
	'posts.destroyed': {
		description: 'A post was deleted (post_destroyed).',
		payload: eventSchema('post'),
		response: eventSchema('post'),
	},
	'posts.recovered': {
		description: 'A post was restored (post_recovered).',
		payload: eventSchema('post'),
		response: eventSchema('post'),
	},
	'users.created': {
		description: 'A user was created (user_created).',
		payload: eventSchema('user'),
		response: eventSchema('user'),
	},
	'users.loggedIn': {
		description: 'A user signed in (user_logged_in).',
		payload: eventSchema('user'),
		response: eventSchema('user'),
	},
	'users.loggedOut': {
		description: 'A user signed out (user_logged_out).',
		payload: eventSchema('user'),
		response: eventSchema('user'),
	},
	'users.confirmedEmail': {
		description: 'A user confirmed their email (user_confirmed_email).',
		payload: eventSchema('user'),
		response: eventSchema('user'),
	},
	'users.anonymized': {
		description: 'A user was anonymized (user_anonymized).',
		payload: eventSchema('user'),
		response: eventSchema('user'),
	},
	'users.approved': {
		description: 'A user was approved (user_approved).',
		payload: eventSchema('user'),
		response: eventSchema('user'),
	},
	'users.updated': {
		description: 'A user was updated (user_updated).',
		payload: eventSchema('user'),
		response: eventSchema('user'),
	},
	'users.destroyed': {
		description: 'A user was deleted (user_destroyed).',
		payload: eventSchema('user'),
		response: eventSchema('user'),
	},
	'users.suspended': {
		description: 'A user was suspended (user_suspended).',
		payload: eventSchema('user'),
		response: eventSchema('user'),
	},
	'users.unsuspended': {
		description: 'A user was unsuspended (user_unsuspended).',
		payload: eventSchema('user'),
		response: eventSchema('user'),
	},
	'users.addedToGroup': {
		description: 'A user was added to a group (user_added_to_group).',
		payload: eventSchema('group_user'),
		response: eventSchema('group_user'),
	},
	'users.promoted': {
		description: 'A user moved up a trust level (user_promoted).',
		payload: eventSchema('user_promoted'),
		response: eventSchema('user_promoted'),
	},
	'groups.created': {
		description: 'A group was created (group_created).',
		payload: eventSchema('group'),
		response: eventSchema('group'),
	},
	'groups.updated': {
		description: 'A group was updated (group_updated).',
		payload: eventSchema('group'),
		response: eventSchema('group'),
	},
	'groups.destroyed': {
		description: 'A group was deleted (group_destroyed).',
		payload: eventSchema('group'),
		response: eventSchema('group'),
	},
	'categories.created': {
		description: 'A category was created (category_created).',
		payload: eventSchema('category'),
		response: eventSchema('category'),
	},
	'categories.updated': {
		description: 'A category was updated (category_updated).',
		payload: eventSchema('category'),
		response: eventSchema('category'),
	},
	'categories.destroyed': {
		description: 'A category was deleted (category_destroyed).',
		payload: eventSchema('category'),
		response: eventSchema('category'),
	},
	'tags.created': {
		description: 'A tag was created (tag_created).',
		payload: eventSchema('tag'),
		response: eventSchema('tag'),
	},
	'tags.updated': {
		description: 'A tag was updated (tag_updated).',
		payload: eventSchema('tag'),
		response: eventSchema('tag'),
	},
	'tags.destroyed': {
		description: 'A tag was deleted (tag_destroyed).',
		payload: eventSchema('tag'),
		response: eventSchema('tag'),
	},
	'reviewables.created': {
		description: 'A reviewable was created (reviewable_created).',
		payload: eventSchema('reviewable'),
		response: eventSchema('reviewable'),
	},
	'reviewables.updated': {
		description:
			'A review queue item changed score or status (reviewable_score_updated, reviewable_transitioned_to).',
		payload: eventSchema('reviewable'),
		response: eventSchema('reviewable'),
	},
	'notifications.created': {
		description: 'A notification was created (notification_created).',
		payload: eventSchema('notification'),
		response: eventSchema('notification'),
	},
	'badges.granted': {
		description: 'A user badge was granted (user_badge_granted).',
		payload: eventSchema('user_badge'),
		response: eventSchema('user_badge'),
	},
	'badges.revoked': {
		description: 'A user badge was revoked (user_badge_revoked).',
		payload: eventSchema('user_badge'),
		response: eventSchema('user_badge'),
	},
	'likes.liked': {
		description: 'A like was liked (post_liked).',
		payload: eventSchema('like'),
		response: eventSchema('like'),
	},
	'ping.ping': {
		description:
			'The test delivery Discourse sends from the webhook settings page (ping).',
		payload: eventSchema('ping'),
		response: eventSchema('ping'),
	},
} as const;
