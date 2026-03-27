import { z } from 'zod';
import type { CorsairWebhookMatcher, RawWebhookRequest } from '../../../core';

export const OnedriveNotificationSchema = z.object({
	subscriptionId: z.string(),
	changeType: z.string(),
	clientState: z.string().optional(),
	resource: z.string().optional(),
	// any/unknown for resourceData since Microsoft Graph resource data shape varies by resource type
	resourceData: z.record(z.unknown()).optional(),
	tenantId: z.string().optional(),
	subscriptionExpirationDateTime: z.string().optional(),
});

export const OnedriveWebhookPayloadSchema = z.object({
	value: z.array(OnedriveNotificationSchema),
});

export type OnedriveWebhookPayload = z.infer<typeof OnedriveWebhookPayloadSchema>;
export type OnedriveNotification = z.infer<typeof OnedriveNotificationSchema>;

// any/unknown for body since raw webhook body is untyped before parsing
function parseBody(body: unknown): unknown {
	if (typeof body !== 'string') return body;
	try {
		return JSON.parse(body);
	} catch {
		return null;
	}
}

export function createOnedriveMatch(changeType?: string): CorsairWebhookMatcher {
	return (request: RawWebhookRequest) => {
		// any/unknown cast: raw webhook body is untyped before parsing
		const parsed = parseBody(request.body);
		if (!parsed || typeof parsed !== 'object') return false;
		const body = parsed as Record<string, unknown>;
		const value = body.value;
		if (!Array.isArray(value) || value.length === 0) return false;
		if (!changeType) return true;
		// any/unknown for notification items from raw parsed JSON
		return value.some((n: unknown) => {
			if (!n || typeof n !== 'object') return false;
			const notification = n as Record<string, unknown>;
			return notification.changeType === changeType;
		});
	};
}

export function verifyOnedriveClientState(
	notification: { clientState?: string | null },
	expectedClientState: string,
): { valid: boolean; error?: string } {
	if (!notification.clientState) {
		return { valid: false, error: 'Missing clientState in notification' };
	}
	const isValid = notification.clientState === expectedClientState;
	return { valid: isValid, error: isValid ? undefined : 'clientState mismatch' };
}

export type OnedriveWebhookOutputs = {
	driveNotification: OnedriveWebhookPayload;
};
