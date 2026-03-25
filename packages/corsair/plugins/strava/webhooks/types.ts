import { z } from 'zod';
import type { CorsairWebhookMatcher, RawWebhookRequest } from '../../../core';

export const StravaWebhookPayloadSchema = z.object({
	object_type: z.enum(['activity', 'athlete']),
	aspect_type: z.enum(['create', 'update', 'delete']),
	event_time: z.number(),
	object_id: z.number(),
	owner_id: z.number(),
	subscription_id: z.number(),
	// Strava updates field varies by event type and contains arbitrary key/value pairs
	updates: z.record(z.unknown()),
});

export const ActivityCreateEventSchema = StravaWebhookPayloadSchema.extend({
	object_type: z.literal('activity'),
	aspect_type: z.literal('create'),
});

export const ActivityUpdateEventSchema = StravaWebhookPayloadSchema.extend({
	object_type: z.literal('activity'),
	aspect_type: z.literal('update'),
});

export const ActivityDeleteEventSchema = StravaWebhookPayloadSchema.extend({
	object_type: z.literal('activity'),
	aspect_type: z.literal('delete'),
});

export const AthleteUpdateEventSchema = StravaWebhookPayloadSchema.extend({
	object_type: z.literal('athlete'),
	aspect_type: z.literal('update'),
});

export interface StravaWebhookPayload {
	object_type: 'activity' | 'athlete';
	aspect_type: 'create' | 'update' | 'delete';
	event_time: number;
	object_id: number;
	owner_id: number;
	subscription_id: number;
	// Strava updates field varies by event type and contains arbitrary key/value pairs
	updates: Record<string, unknown>;
}

export interface ActivityCreateEvent extends StravaWebhookPayload {
	object_type: 'activity';
	aspect_type: 'create';
}

export interface ActivityUpdateEvent extends StravaWebhookPayload {
	object_type: 'activity';
	aspect_type: 'update';
}

export interface ActivityDeleteEvent extends StravaWebhookPayload {
	object_type: 'activity';
	aspect_type: 'delete';
}

export interface AthleteUpdateEvent extends StravaWebhookPayload {
	object_type: 'athlete';
	aspect_type: 'update';
}

export type StravaWebhookOutputs = {
	activityCreate: ActivityCreateEvent;
	activityUpdate: ActivityUpdateEvent;
	activityDelete: ActivityDeleteEvent;
	athleteUpdate: AthleteUpdateEvent;
};

export function createStravaMatch(
	objectType: string,
	aspectType: string,
): CorsairWebhookMatcher {
	return (request: RawWebhookRequest) => {
		// request.body arrives as string or parsed object; cast to StravaWebhookPayload for field access
		const body =
			typeof request.body === 'string'
				? (JSON.parse(request.body) as StravaWebhookPayload)
				: (request.body as StravaWebhookPayload);
		return body.object_type === objectType && body.aspect_type === aspectType;
	};
}

export function verifyStravaWebhookSignature(): { valid: boolean } {
	// Strava does not sign event payloads with HMAC — the verify_token is only
	// used at subscription creation time, not on individual event deliveries.
	return { valid: true };
}
