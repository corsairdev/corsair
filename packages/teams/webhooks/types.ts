import type { CorsairWebhookMatcher, RawWebhookRequest } from 'corsair/core';
import { z } from 'zod';

// ── Graph API Notification Schemas ────────────────────────────────────────────

export const TeamsResourceDataSchema = z
	.object({
		'@odata.type': z.string().optional(),
		'@odata.id': z.string().optional(),
		'@odata.etag': z.string().optional(),
		id: z.string(),
	})
	.passthrough();

export const TeamsNotificationSchema = z.object({
	subscriptionId: z.string(),
	subscriptionExpirationDateTime: z.string().optional(),
	clientState: z.string().optional(),
	changeType: z.enum(['created', 'updated', 'deleted']),
	resource: z.string(),
	tenantId: z.string().optional(),
	resourceData: TeamsResourceDataSchema.optional(),
});

export const TeamsWebhookNotificationPayloadSchema = z.object({
	value: z.array(TeamsNotificationSchema),
});

export type TeamsNotification = z.infer<typeof TeamsNotificationSchema>;
export type TeamsWebhookNotificationPayload = z.infer<
	typeof TeamsWebhookNotificationPayloadSchema
>;

// ── Channel Message Event ─────────────────────────────────────────────────────

export const TeamsChannelMessageEventSchema = z.object({
	subscriptionId: z.string(),
	changeType: z.enum(['created', 'updated', 'deleted']),
	resource: z.string(),
	tenantId: z.string().optional(),
	clientState: z.string().optional(),
	resourceData: z
		.object({
			'@odata.type': z.literal('#Microsoft.Graph.chatMessage').optional(),
			'@odata.id': z.string().optional(),
			id: z.string(),
		})
		.passthrough()
		.optional(),
});
export type TeamsChannelMessageEvent = z.infer<
	typeof TeamsChannelMessageEventSchema
>;

// ── Chat Message Event ────────────────────────────────────────────────────────

export const TeamsChatMessageEventSchema = z.object({
	subscriptionId: z.string(),
	changeType: z.enum(['created', 'updated', 'deleted']),
	resource: z.string(),
	tenantId: z.string().optional(),
	clientState: z.string().optional(),
	resourceData: z
		.object({
			'@odata.type': z.literal('#Microsoft.Graph.chatMessage').optional(),
			'@odata.id': z.string().optional(),
			id: z.string(),
		})
		.passthrough()
		.optional(),
});
export type TeamsChatMessageEvent = z.infer<typeof TeamsChatMessageEventSchema>;

// ── Channel Created Event ─────────────────────────────────────────────────────

export const TeamsChannelCreatedEventSchema = z.object({
	subscriptionId: z.string(),
	changeType: z.enum(['created', 'updated', 'deleted']),
	resource: z.string(),
	tenantId: z.string().optional(),
	clientState: z.string().optional(),
	resourceData: z
		.object({
			'@odata.type': z.literal('#Microsoft.Graph.channel').optional(),
			'@odata.id': z.string().optional(),
			id: z.string(),
		})
		.passthrough()
		.optional(),
});
export type TeamsChannelCreatedEvent = z.infer<
	typeof TeamsChannelCreatedEventSchema
>;

// ── Membership Changed Event ──────────────────────────────────────────────────

export const TeamsMembershipChangedEventSchema = z.object({
	subscriptionId: z.string(),
	changeType: z.enum(['created', 'updated', 'deleted']),
	resource: z.string(),
	tenantId: z.string().optional(),
	clientState: z.string().optional(),
	resourceData: z
		.object({
			'@odata.type': z
				.literal('#Microsoft.Graph.aadUserConversationMember')
				.optional(),
			'@odata.id': z.string().optional(),
			id: z.string(),
		})
		.passthrough()
		.optional(),
});
export type TeamsMembershipChangedEvent = z.infer<
	typeof TeamsMembershipChangedEventSchema
>;

// ── Webhook Payload Wrapper ───────────────────────────────────────────────────

export type TeamsWebhookPayload<TEvent> = {
	value: TEvent[];
};

// ── Webhook Outputs Map ───────────────────────────────────────────────────────

export type TeamsWebhookOutputs = {
	channelMessage: TeamsChannelMessageEvent;
	chatMessage: TeamsChatMessageEvent;
	channelCreated: TeamsChannelCreatedEvent;
	membershipChanged: TeamsMembershipChangedEvent;
};

// ── Match Helpers ─────────────────────────────────────────────────────────────

// body arrives as an opaque value from the raw HTTP request; unknown forces callers to narrow before use
function parseBody(body: unknown): unknown {
	if (typeof body === 'string') {
		try {
			return JSON.parse(body);
		} catch {
			return {};
		}
	}
	return body ?? {};
}

/**
 * Extracts the ID from a Microsoft Graph OData path segment.
 * e.g. "teams('bffe3fd3-...')" → "bffe3fd3-..."
 * Falls back to the raw segment if it doesn't match the OData pattern.
 */
export function extractODataId(segment: string): string {
	const match = segment.match(/\('([^']+)'\)/);
	return match?.[1] ?? segment;
}

export function createTeamsNotificationMatch(
	resourcePattern: RegExp,
	odataType?: string,
): CorsairWebhookMatcher {
	return (request: RawWebhookRequest) => {
		// parseBody returns unknown; cast to access top-level keys before array validation below
		const parsed = parseBody(request.body) as Record<string, unknown>;
		const value = parsed['value'];
		if (!Array.isArray(value)) {
			return false;
		}
		// Array elements from parsed JSON are unknown until individually type-narrowed
		return value.some((n: unknown) => {
			if (!n || typeof n !== 'object') return false;
			// Safe after the null + typeof object guard above
			const notification = n as Record<string, unknown>;
			const resource =
				typeof notification['resource'] === 'string'
					? notification['resource']
					: '';
			if (!resourcePattern.test(resource)) return false;
			if (odataType === undefined) return true;
			const resourceData = notification['resourceData'];
			if (!resourceData || typeof resourceData !== 'object') return false;
			// Safe after the null + typeof object guard above
			return (
				(resourceData as Record<string, unknown>)['@odata.type'] === odataType
			);
		});
	};
}

// ── Client State Validation ───────────────────────────────────────────────────

export function verifyTeamsClientState(
	payload: TeamsWebhookPayload<TeamsNotification>,
	expectedClientState: string,
): { valid: boolean; error?: string } {
	if (!expectedClientState) {
		return { valid: false, error: 'clientState is required' };
	}
	const allMatch = payload.value.every(
		(n) => n.clientState === expectedClientState,
	);
	if (!allMatch) {
		return { valid: false, error: 'clientState mismatch' };
	}
	return { valid: true };
}

// ── Payload Schemas for Index ─────────────────────────────────────────────────

export const TeamsChannelMessagePayloadSchema = z.object({
	value: z.array(TeamsChannelMessageEventSchema),
});

export const TeamsChatMessagePayloadSchema = z.object({
	value: z.array(TeamsChatMessageEventSchema),
});

export const TeamsChannelCreatedPayloadSchema = z.object({
	value: z.array(TeamsChannelCreatedEventSchema),
});

export const TeamsMembershipChangedPayloadSchema = z.object({
	value: z.array(TeamsMembershipChangedEventSchema),
});
