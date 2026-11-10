import type {
	CorsairWebhook,
	CorsairWebhookMatcher,
	RawWebhookRequest,
} from 'corsair/core';
import { logEventFromContext } from 'corsair/core';
import { z } from 'zod';
import type { EventbriteContext } from '..';

/**
 * A delivery is not the changed object. Eventbrite POSTs a notification:
 *
 * ```json
 * {
 *   "api_url": "https://www.eventbriteapi.com/v3/orders/1234567890/",
 *   "config": {
 *     "action": "order.placed",
 *     "endpoint_url": "https://myapp.com/webhook",
 *     "user_id": "1234567890",
 *     "webhook_id": "9876543"
 *   }
 * }
 * ```
 *
 * `api_url` addresses the object on the v3 API and `config.action` names what
 * happened, so the handler reads that URL back with the tenant's own token
 * before anything downstream can see the object.
 * (https://www.eventbrite.com/platform/docs/webhooks)
 */
export const EventbriteWebhookPayloadSchema = z
	.object({
		api_url: z
			.string()
			.min(1)
			.describe('Absolute v3 API URL of the object that changed.'),
		config: z
			.object({
				/** e.g. `order.placed`. Absent on the dashboard's test delivery. */
				action: z.string().nullish(),
				endpoint_url: z.string().nullish(),
				/** The organization id, so deliveries route to one tenant. */
				user_id: z.string().nullish(),
				webhook_id: z.string().nullish(),
			})
			.loose()
			.nullish(),
	})
	.loose();

export type EventbriteWebhookPayload = z.infer<
	typeof EventbriteWebhookPayloadSchema
>;

export type EventbriteWebhookOutputs = {
	/** One entry per delivery; the payload is the notification, not the object. */
	notification: EventbriteWebhookPayload & {
		action: string | null;
		organizationId: string | null;
	};
};

/**
 * Eventbrite signs neither the delivery nor lets a webhook carry a caller-chosen
 * header (`POST /organizations/{id}/webhooks/` accepts only `endpoint_url`,
 * `actions` and `event_id`), so there is nothing to verify against a secret.
 * Provenance rests on the unguessable ingress URL plus reading `api_url` back
 * with the tenant's token.
 */
export function actionOf(payload: EventbriteWebhookPayload): string | null {
	const action = payload.config?.action;
	return typeof action === 'string' && action.length > 0 ? action : null;
}

export function organizationIdOf(
	payload: EventbriteWebhookPayload,
): string | null {
	const userId = payload.config?.user_id;
	return typeof userId === 'string' && userId.length > 0 ? userId : null;
}

/** True for a body shaped like an Eventbrite notification. */
export function isEventbriteNotification(request: RawWebhookRequest): boolean {
	const body = request.body;
	const record =
		typeof body === 'object' && body !== null && !Array.isArray(body)
			? // unknown: the body is untyped until a plugin claims the delivery;
				// this only asks whether one known key is a string.
				(body as Record<string, unknown>)
			: undefined;
	return typeof record?.api_url === 'string';
}

export const notificationMatch: CorsairWebhookMatcher =
	isEventbriteNotification;

/**
 * The notification carries no object, so the handler logs the action and the
 * addresses a follow-up read needs, then returns the derived fields. It does
 * not call `api_url` itself: the endpoint layer owns credentialed reads, and a
 * delivery must not start fetching on its own.
 */
export const notification: CorsairWebhook<
	EventbriteContext,
	EventbriteWebhookPayload,
	EventbriteWebhookOutputs['notification']
> = {
	match: notificationMatch,
	handler: async (ctx, request) => {
		const parsed = EventbriteWebhookPayloadSchema.safeParse(request.payload);
		if (!parsed.success) {
			// Throwing, not returning `success: false`: processWebhook rewrites a
			// returned refusal to a successful delivery (packages/corsair/webhooks).
			throw new Error(
				'Invalid Eventbrite webhook notification: expected `api_url` and an optional `config` object',
			);
		}

		const action = actionOf(parsed.data);
		const organizationId = organizationIdOf(parsed.data);

		await logEventFromContext(
			ctx,
			'eventbrite.webhook.notification',
			{
				action: action ?? undefined,
				organizationId: organizationId ?? undefined,
				apiUrl: parsed.data.api_url,
			},
			'completed',
		);

		return {
			success: true,
			data: { ...parsed.data, action, organizationId },
		};
	},
};
