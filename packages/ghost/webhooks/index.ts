import { createHmac, timingSafeEqual } from 'node:crypto';
import type {
	CorsairWebhook,
	RawWebhookRequest,
	WebhookRequest,
} from 'corsair/core';
import { z } from 'zod';
import type { GhostContext } from '../index';

// Ghost posts an event to every webhook made with webhooks.create (or a custom
// integration's webhooks in Ghost Admin). Each delivery carries
// X-Ghost-Signature: `sha256=<hex>, t=<ms>`, an HMAC-SHA256 with the webhook's
// secret over the raw body followed by the timestamp (checked on real
// deliveries from Ghost 6.79, 11-28). The event name is not a header: Ghost
// 6.45 and later put it in the body's `event` field, next to
// `{ <resource>: { current, previous } }`. Older releases send no name, so for
// them the webhook's target URL carries it: `https://.../hook?event=post.published`.

const RESOURCE_EVENTS = [
	'added',
	'deleted',
	'edited',
	'published',
	'published.edited',
	'unpublished',
	'scheduled',
	'unscheduled',
	'rescheduled',
	'tag.attached',
	'tag.detached',
] as const;

export const GhostWebhookEventTypeSchema = z.enum([
	'site.changed',
	...RESOURCE_EVENTS.map((e) => `post.${e}` as const),
	...RESOURCE_EVENTS.map((e) => `page.${e}` as const),
	'tag.added',
	'tag.edited',
	'tag.deleted',
	'member.added',
	'member.edited',
	'member.deleted',
] as [string, ...string[]]);
export type GhostWebhookEventType = z.infer<typeof GhostWebhookEventTypeSchema>;

/** A resource as Ghost sends it: the documented fields stay typed, the rest pass through. */
const ResourceSchema = z
	.object({
		id: z.string().nullish(),
		uuid: z.string().nullish(),
		title: z.string().nullish(),
		name: z.string().nullish(),
		slug: z.string().nullish(),
		email: z.string().nullish(),
		status: z.string().nullish(),
		url: z.string().nullish(),
		created_at: z.string().nullish(),
		updated_at: z.string().nullish(),
		published_at: z.string().nullish(),
	})
	.passthrough();

const ChangeSchema = z
	.object({
		current: ResourceSchema.or(z.object({}).passthrough()).describe(
			'The resource after the event (empty on a delete).',
		),
		previous: z
			.object({})
			.passthrough()
			.describe(
				'The fields that changed, with their old values (empty on an add).',
			),
	})
	.passthrough();

function eventSchema(event: GhostWebhookEventType) {
	const key = event.split('.')[0] as
		| 'post'
		| 'page'
		| 'tag'
		| 'member'
		| 'site';
	const base = z
		.object({
			event: z
				.literal(event)
				.optional()
				.describe(
					'The event name (Ghost 6.45 and later; older releases leave it out).',
				),
		})
		.passthrough();
	return key === 'site'
		? base
		: base.extend({
				[key]: ChangeSchema.describe(`The ${key} before and after.`),
			});
}

/** How far the signature timestamp may be from now. */
const TOLERANCE_MS = 300_000;

function header(
	headers: WebhookRequest<unknown>['headers'],
	name: string,
): string | undefined {
	const value = Object.entries(headers).find(
		([key]) => key.toLowerCase() === name,
	)?.[1];
	return Array.isArray(value) ? value[0] : value;
}

// `unknown` because the body is the raw request body, a string or parsed JSON.
function bodyEvent(body: unknown): string | undefined {
	let parsed = body;
	if (typeof body === 'string') {
		try {
			parsed = JSON.parse(body);
		} catch {
			return undefined;
		}
	}
	const event =
		typeof parsed === 'object' && parsed !== null
			? (parsed as Record<string, unknown>).event
			: undefined;
	return typeof event === 'string' ? event : undefined;
}

/**
 * The event a Ghost-signed request carries: the body's `event` field (Ghost
 * 6.45+), else the `event` query value of the target URL the webhook was
 * created with (older releases).
 */
export function ghostEventName(
	request: RawWebhookRequest,
): GhostWebhookEventType | undefined {
	if (!header(request.headers, 'x-ghost-signature')) return undefined;
	const fromQuery = request.query?.event;
	const parsed = GhostWebhookEventTypeSchema.safeParse(
		bodyEvent(request.body) ??
			(Array.isArray(fromQuery) ? fromQuery[0] : fromQuery),
	);
	return parsed.success ? parsed.data : undefined;
}

export function matchGhostWebhook(request: RawWebhookRequest): boolean {
	return ghostEventName(request) !== undefined;
}

/**
 * Ghost's scheme: `X-Ghost-Signature: sha256=<hex>, t=<ms>`, the hex being
 * HMAC-SHA256(secret, rawBody + t). Compared in constant time; a timestamp
 * more than five minutes off is refused.
 */
export function verifyGhostSignature(
	request: WebhookRequest<unknown>,
	secret: string,
	now: number = Date.now(),
): boolean {
	const signature = header(request.headers, 'x-ghost-signature');
	if (!signature || !request.rawBody || !secret.trim()) return false;
	const parts = Object.fromEntries(
		signature.split(',').map((part) => {
			const [k, ...v] = part.trim().split('=');
			return [k, v.join('=')];
		}),
	);
	const supplied = parts.sha256;
	const timestamp = parts.t;
	if (!supplied || !/^[a-f0-9]{64}$/i.test(supplied)) return false;
	if (!timestamp || !/^\d+$/.test(timestamp)) return false;
	if (Math.abs(now - Number(timestamp)) > TOLERANCE_MS) return false;
	const expected = createHmac('sha256', secret)
		.update(`${request.rawBody}${timestamp}`)
		.digest();
	return timingSafeEqual(Buffer.from(supplied, 'hex'), expected);
}

function webhookFor(
	name: GhostWebhookEventType,
): CorsairWebhook<GhostContext, GhostWebhookEvent, GhostWebhookEvent> {
	const schema = eventSchema(name);
	return {
		match: (request) => ghostEventName(request) === name,
		handler: async (ctx, request) => {
			if (
				request.hubVerified !== true &&
				!verifyGhostSignature(request, ctx.key)
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
					data: schema.parse(JSON.parse(request.rawBody)) as GhostWebhookEvent,
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

export type GhostWebhookEvent = {
	event?: GhostWebhookEventType;
	post?: z.infer<typeof ChangeSchema>;
	page?: z.infer<typeof ChangeSchema>;
	tag?: z.infer<typeof ChangeSchema>;
	member?: z.infer<typeof ChangeSchema>;
	[key: string]: unknown;
};

export const ghostWebhooksNested = {
	site: {
		changed: webhookFor('site.changed'),
	},
	posts: {
		added: webhookFor('post.added'),
		deleted: webhookFor('post.deleted'),
		edited: webhookFor('post.edited'),
		published: webhookFor('post.published'),
		publishedEdited: webhookFor('post.published.edited'),
		unpublished: webhookFor('post.unpublished'),
		scheduled: webhookFor('post.scheduled'),
		unscheduled: webhookFor('post.unscheduled'),
		rescheduled: webhookFor('post.rescheduled'),
		tagAttached: webhookFor('post.tag.attached'),
		tagDetached: webhookFor('post.tag.detached'),
	},
	pages: {
		added: webhookFor('page.added'),
		deleted: webhookFor('page.deleted'),
		edited: webhookFor('page.edited'),
		published: webhookFor('page.published'),
		publishedEdited: webhookFor('page.published.edited'),
		unpublished: webhookFor('page.unpublished'),
		scheduled: webhookFor('page.scheduled'),
		unscheduled: webhookFor('page.unscheduled'),
		rescheduled: webhookFor('page.rescheduled'),
		tagAttached: webhookFor('page.tag.attached'),
		tagDetached: webhookFor('page.tag.detached'),
	},
	tags: {
		added: webhookFor('tag.added'),
		edited: webhookFor('tag.edited'),
		deleted: webhookFor('tag.deleted'),
	},
	members: {
		added: webhookFor('member.added'),
		edited: webhookFor('member.edited'),
		deleted: webhookFor('member.deleted'),
	},
} as const;

export const ghostWebhookSchemas = {
	'site.changed': {
		description: 'Any content on the site changed (site.changed).',
		payload: eventSchema('site.changed'),
		response: eventSchema('site.changed'),
	},
	'posts.added': {
		description: 'A post was created (post.added).',
		payload: eventSchema('post.added'),
		response: eventSchema('post.added'),
	},
	'posts.deleted': {
		description: 'A post was deleted (post.deleted).',
		payload: eventSchema('post.deleted'),
		response: eventSchema('post.deleted'),
	},
	'posts.edited': {
		description: 'A post was edited (post.edited).',
		payload: eventSchema('post.edited'),
		response: eventSchema('post.edited'),
	},
	'posts.published': {
		description: 'A post was published (post.published).',
		payload: eventSchema('post.published'),
		response: eventSchema('post.published'),
	},
	'posts.publishedEdited': {
		description:
			'A post was edited after it was published (post.published.edited).',
		payload: eventSchema('post.published.edited'),
		response: eventSchema('post.published.edited'),
	},
	'posts.unpublished': {
		description: 'A post went back to draft (post.unpublished).',
		payload: eventSchema('post.unpublished'),
		response: eventSchema('post.unpublished'),
	},
	'posts.scheduled': {
		description: 'A post was scheduled (post.scheduled).',
		payload: eventSchema('post.scheduled'),
		response: eventSchema('post.scheduled'),
	},
	'posts.unscheduled': {
		description: 'A post was unscheduled (post.unscheduled).',
		payload: eventSchema('post.unscheduled'),
		response: eventSchema('post.unscheduled'),
	},
	'posts.rescheduled': {
		description: 'A post was rescheduled (post.rescheduled).',
		payload: eventSchema('post.rescheduled'),
		response: eventSchema('post.rescheduled'),
	},
	'posts.tagAttached': {
		description: 'A post got a tag (post.tag.attached).',
		payload: eventSchema('post.tag.attached'),
		response: eventSchema('post.tag.attached'),
	},
	'posts.tagDetached': {
		description: 'A post lost a tag (post.tag.detached).',
		payload: eventSchema('post.tag.detached'),
		response: eventSchema('post.tag.detached'),
	},
	'pages.added': {
		description: 'A page was created (page.added).',
		payload: eventSchema('page.added'),
		response: eventSchema('page.added'),
	},
	'pages.deleted': {
		description: 'A page was deleted (page.deleted).',
		payload: eventSchema('page.deleted'),
		response: eventSchema('page.deleted'),
	},
	'pages.edited': {
		description: 'A page was edited (page.edited).',
		payload: eventSchema('page.edited'),
		response: eventSchema('page.edited'),
	},
	'pages.published': {
		description: 'A page was published (page.published).',
		payload: eventSchema('page.published'),
		response: eventSchema('page.published'),
	},
	'pages.publishedEdited': {
		description:
			'A page was edited after it was published (page.published.edited).',
		payload: eventSchema('page.published.edited'),
		response: eventSchema('page.published.edited'),
	},
	'pages.unpublished': {
		description: 'A page went back to draft (page.unpublished).',
		payload: eventSchema('page.unpublished'),
		response: eventSchema('page.unpublished'),
	},
	'pages.scheduled': {
		description: 'A page was scheduled (page.scheduled).',
		payload: eventSchema('page.scheduled'),
		response: eventSchema('page.scheduled'),
	},
	'pages.unscheduled': {
		description: 'A page was unscheduled (page.unscheduled).',
		payload: eventSchema('page.unscheduled'),
		response: eventSchema('page.unscheduled'),
	},
	'pages.rescheduled': {
		description: 'A page was rescheduled (page.rescheduled).',
		payload: eventSchema('page.rescheduled'),
		response: eventSchema('page.rescheduled'),
	},
	'pages.tagAttached': {
		description: 'A page got a tag (page.tag.attached).',
		payload: eventSchema('page.tag.attached'),
		response: eventSchema('page.tag.attached'),
	},
	'pages.tagDetached': {
		description: 'A page lost a tag (page.tag.detached).',
		payload: eventSchema('page.tag.detached'),
		response: eventSchema('page.tag.detached'),
	},
	'tags.added': {
		description: 'A tag was created (tag.added).',
		payload: eventSchema('tag.added'),
		response: eventSchema('tag.added'),
	},
	'tags.edited': {
		description: 'A tag was edited (tag.edited).',
		payload: eventSchema('tag.edited'),
		response: eventSchema('tag.edited'),
	},
	'tags.deleted': {
		description: 'A tag was deleted (tag.deleted).',
		payload: eventSchema('tag.deleted'),
		response: eventSchema('tag.deleted'),
	},
	'members.added': {
		description: 'A member was created (member.added).',
		payload: eventSchema('member.added'),
		response: eventSchema('member.added'),
	},
	'members.edited': {
		description: 'A member was edited (member.edited).',
		payload: eventSchema('member.edited'),
		response: eventSchema('member.edited'),
	},
	'members.deleted': {
		description: 'A member was deleted (member.deleted).',
		payload: eventSchema('member.deleted'),
		response: eventSchema('member.deleted'),
	},
} as const;
