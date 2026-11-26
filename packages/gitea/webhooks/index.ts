import { createHmac, timingSafeEqual } from 'node:crypto';
import type {
	CorsairWebhook,
	RawWebhookRequest,
	WebhookRequest,
} from 'corsair/core';
import { getHeader, logEventFromContext } from 'corsair/core';
import {
	getGiteaWebhookPayloadSchema,
	giteaWebhookFor,
} from '../endpoints/openapi-schema';
import type { GiteaWebhookPayloads } from '../endpoints/operation-types';
import type { GiteaContext } from '../index';

/**
 * Gitea signs a delivery when its webhook has a secret (webhooks.create with
 * `type: 'gitea'` and `config.secret`):
 *
 *   X-Gitea-Signature: <hex HMAC-SHA256 of the raw body, keyed by the secret>
 *
 * The same digest also goes out as `X-Hub-Signature-256: sha256=<hex>`, and
 * Forgejo sends `X-Forgejo-Signature` next to `X-Gitea-Signature`. Checked
 * against real deliveries from Gitea 28.4 (live 11-27).
 * https://docs.gitea.com/usage/webhooks
 */
function safeEqual(left: string, right: string): boolean {
	const a = Buffer.from(left);
	const b = Buffer.from(right);
	return a.length === b.length && timingSafeEqual(a, b);
}

export type GiteaWebhookVerification =
	| { valid: true }
	| { valid: false; error: string };

export function verifyGiteaWebhook(
	// `unknown` payload: the signature covers the raw body, so verification never reads the parsed payload.
	request: WebhookRequest<unknown>,
	secret: string | undefined,
): GiteaWebhookVerification {
	if (request.hubVerified) return { valid: true };
	if (!secret) {
		return {
			valid: false,
			error:
				'No Gitea webhook secret is set (plugin option webhookSecret or keys.set_webhook_signature)',
		};
	}
	if (request.rawBody === undefined) {
		return { valid: false, error: 'Missing raw body' };
	}
	const hub = getHeader(request.headers, 'x-hub-signature-256');
	const signature =
		getHeader(request.headers, 'x-gitea-signature') ||
		getHeader(request.headers, 'x-forgejo-signature') ||
		(hub?.startsWith('sha256=') ? hub.slice('sha256='.length) : undefined);
	if (!signature) {
		// Gitea leaves the signature empty for a webhook without a secret.
		return { valid: false, error: 'Missing Gitea signature header' };
	}
	const expected = createHmac('sha256', secret)
		.update(request.rawBody)
		.digest('hex');
	return safeEqual(signature.trim().toLowerCase(), expected)
		? { valid: true }
		: { valid: false, error: 'Invalid Gitea webhook signature' };
}

export type GiteaWebhookId = keyof GiteaWebhookPayloads;

const WEBHOOK_IDS = [
	'fork',
	'issueComment',
	'issues',
	'package',
	'pullRequest',
	'pullRequestReview',
	'push',
	'refCreated',
	'refDeleted',
	'release',
	'repository',
	'status',
	'wiki',
	'workflowJob',
	'workflowRun',
] as const satisfies readonly GiteaWebhookId[];

/**
 * The delivery's event type: X-Gitea-Event-Type (`issue_label`,
 * `pull_request_sync`), else X-Gitea-Event / X-Forgejo-Event (older
 * versions send only the category). Gitea also sends X-GitHub-Event, so
 * GitHub's header alone never counts as a Gitea delivery.
 */
export function giteaEventTypeOf(
	request: Pick<RawWebhookRequest, 'headers'>,
): string | undefined {
	return (
		getHeader(request.headers, 'x-gitea-event-type') ||
		getHeader(request.headers, 'x-forgejo-event-type') ||
		getHeader(request.headers, 'x-gitea-event') ||
		getHeader(request.headers, 'x-forgejo-event') ||
		undefined
	);
}

/** Which webhook handles an event type (`issue_label` → `issues`). */
export function webhookIdFor(eventType: string): GiteaWebhookId | undefined {
	return WEBHOOK_IDS.find((id) =>
		giteaWebhookFor(id).eventTypes.includes(eventType),
	);
}

/** Any Gitea event this plugin handles (used as the plugin's webhook matcher). */
export function isGiteaDelivery(request: RawWebhookRequest): boolean {
	const eventType = giteaEventTypeOf(request);
	return eventType !== undefined && webhookIdFor(eventType) !== undefined;
}

export type GiteaWebhook<Id extends GiteaWebhookId> = CorsairWebhook<
	GiteaContext,
	GiteaWebhookPayloads[Id],
	GiteaWebhookPayloads[Id]
>;

/**
 * One webhook per kind of Gitea event. It matches its event types, checks
 * the signature with the webhook's secret, and returns the delivery parsed
 * leniently against Gitea's payload structs. X-Gitea-Delivery stays the same
 * when Gitea redelivers: use it to skip a delivery already handled.
 */
function giteaWebhook<Id extends GiteaWebhookId>(id: Id): GiteaWebhook<Id> {
	return {
		match: (request) => {
			const eventType = giteaEventTypeOf(request);
			return eventType !== undefined && webhookIdFor(eventType) === id;
		},
		handler: async (ctx, request) => {
			const verification = verifyGiteaWebhook(request, ctx.key);
			if (!verification.valid) {
				return { success: false, statusCode: 401, error: verification.error };
			}
			const parsed = getGiteaWebhookPayloadSchema(id).safeParse(
				request.payload,
			);
			if (!parsed.success) {
				// Paths only: the payload holds code, issue text and user details.
				const where = parsed.error.issues
					.slice(0, 3)
					.map((issue) => issue.path.join('.') || 'payload')
					.join(', ');
				return {
					success: false,
					statusCode: 400,
					error: `Gitea ${id} payload did not match its documented schema (${where})`,
				};
			}
			const event = parsed.data as GiteaWebhookPayloads[Id];
			await logEventFromContext(
				ctx,
				`gitea.webhook.${id}`,
				// The event type and delivery id only: the payload holds private content.
				{
					eventType: giteaEventTypeOf(request),
					deliveryId:
						getHeader(request.headers, 'x-gitea-delivery') ||
						getHeader(request.headers, 'x-forgejo-delivery'),
				},
				'completed',
			);
			return { success: true, data: event };
		},
	};
}

export const giteaWebhooksNested = {
	fork: giteaWebhook('fork'),
	issueComment: giteaWebhook('issueComment'),
	issues: giteaWebhook('issues'),
	package: giteaWebhook('package'),
	pullRequest: giteaWebhook('pullRequest'),
	pullRequestReview: giteaWebhook('pullRequestReview'),
	push: giteaWebhook('push'),
	refCreated: giteaWebhook('refCreated'),
	refDeleted: giteaWebhook('refDeleted'),
	release: giteaWebhook('release'),
	repository: giteaWebhook('repository'),
	status: giteaWebhook('status'),
	wiki: giteaWebhook('wiki'),
	workflowJob: giteaWebhook('workflowJob'),
	workflowRun: giteaWebhook('workflowRun'),
} as const;

function describe(id: GiteaWebhookId): string {
	const webhook = giteaWebhookFor(id);
	return `${webhook.summary} (X-Gitea-Event-Type ${webhook.eventTypes.join(', ')})`;
}

/** Schemas are getters, so a payload schema is built only when something reads it. */
function webhookSchemaEntry(id: GiteaWebhookId) {
	return {
		description: describe(id),
		get payload() {
			return getGiteaWebhookPayloadSchema(id);
		},
		get response() {
			return getGiteaWebhookPayloadSchema(id);
		},
	};
}

export const giteaWebhookSchemas = Object.fromEntries(
	WEBHOOK_IDS.map((id) => [id, webhookSchemaEntry(id)]),
) as { [Id in GiteaWebhookId]: ReturnType<typeof webhookSchemaEntry> };
