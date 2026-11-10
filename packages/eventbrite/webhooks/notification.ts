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
 * happened. The handler passes the notification on and does not fetch the
 * object; a caller reads `api_url` back with the tenant's own token.
 * (https://www.eventbrite.com/platform/docs/webhooks)
 */
export const EventbriteWebhookPayloadSchema = z
	.object({
		api_url: z
			.string()
			.min(1)
			.refine(isEventbriteApiUrl, {
				message: '`api_url` must be an https URL on eventbriteapi.com',
			})
			.describe(
				'Absolute v3 API URL of the object that changed, always on eventbriteapi.com.',
			),
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
 * `actions` and `event_id`), so there is nothing to verify against a secret
 * and a delivery cannot be proven to come from Eventbrite. The receiving URL
 * has to stay private.
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

/**
 * True when `api_url` is an https URL on Eventbrite's API host. Deliveries are
 * unsigned and callers are told to read `api_url` back with the tenant's
 * token, so a forged body naming another host must never be handed to them:
 * that read would send the token to whoever forged it.
 */
export function isEventbriteApiUrl(value: string): boolean {
	let url: URL;
	try {
		url = new URL(value);
	} catch {
		return false;
	}
	return (
		url.protocol === 'https:' &&
		(url.hostname === 'eventbriteapi.com' ||
			url.hostname.endsWith('.eventbriteapi.com'))
	);
}

/**
 * True for a body shaped like an Eventbrite notification. A string `api_url`
 * alone is not enough: other providers send that key too, and this plugin
 * would claim their deliveries.
 */
export function isEventbriteNotification(request: RawWebhookRequest): boolean {
	const body = request.body;
	const record =
		typeof body === 'object' && body !== null && !Array.isArray(body)
			? // unknown: the body is untyped until a plugin claims the delivery;
				// this only asks whether one known key is a string.
				(body as Record<string, unknown>)
			: undefined;
	return (
		typeof record?.api_url === 'string' && isEventbriteApiUrl(record.api_url)
	);
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
				'Invalid Eventbrite webhook notification: expected an `api_url` on eventbriteapi.com and an optional `config` object',
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
