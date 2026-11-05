import { z } from 'zod';

/**
 * Toggl ships a Webhooks API (https://api.track.toggl.com/webhooks/api/v1) with
 * HMAC-signed payloads, but this plugin does not register any webhook handlers
 * yet — the OSS catalog lists zero triggers for Toggl.
 *
 * The payload envelope is kept here so that adding subscriptions later is an
 * additive change rather than a restructure.
 */
export const TogglWebhookPayloadSchema = z.object({
	event_id: z.string().optional(),
	creator_id: z.number().optional(),
	metadata: z.record(z.string(), z.unknown()).optional(),
	payload: z.unknown().optional(),
	subscription_id: z.number().optional(),
	timestamp: z.string().optional(),
});

export type TogglWebhookPayload = z.infer<typeof TogglWebhookPayloadSchema>;

/** No webhook handlers are registered yet. */
export type TogglWebhookOutputs = Record<string, never>;
