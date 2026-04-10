import type { CorsairWebhookMatcher, RawWebhookRequest } from 'corsair/core';
import { z } from 'zod';

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

export type OnedriveWebhookPayload = z.infer<
	typeof OnedriveWebhookPayloadSchema
>;
export type OnedriveNotification = z.infer<typeof OnedriveNotificationSchema>;

export const OnedriveValidationPayloadSchema = z.object({
	validationToken: z.string(),
});
export type OnedriveValidationPayload = z.infer<
	typeof OnedriveValidationPayloadSchema
>;

// any/unknown for body since raw webhook body is untyped before parsing
function parseBody(body: unknown): unknown {
	if (typeof body !== 'string') return body;
	try {
		return JSON.parse(body);
	} catch {
		return null;
	}
}

function isOnedriveResource(resource: unknown): boolean {
	if (typeof resource !== 'string') return false;
	const normalized = resource.toLowerCase();
	return (
		normalized.includes('/drive') ||
		normalized.includes('/drives') ||
		normalized.includes('/me/drive') ||
		normalized.includes('/users/') ||
		normalized.includes('/groups/') ||
		normalized.includes('/sites/')
	);
}

function isOnedriveNotificationShape(notification: unknown): boolean {
	if (!notification || typeof notification !== 'object') return false;
	const record = notification as Record<string, unknown>;
	return (
		typeof record.subscriptionId === 'string' &&
		record.subscriptionId.trim().length > 0 &&
		typeof record.changeType === 'string' &&
		record.changeType.trim().length > 0 &&
		isOnedriveResource(record.resource)
	);
}

function parseOnedriveNotifications(
	body: unknown,
): Record<string, unknown>[] | null {
	const parsed = parseBody(body);
	if (!parsed || typeof parsed !== 'object') return null;
	const value = (parsed as Record<string, unknown>).value;
	if (!Array.isArray(value) || value.length === 0) return null;
	const notifications = value.filter(
		(item): item is Record<string, unknown> =>
			!!item && typeof item === 'object',
	);
	if (notifications.length === 0) return null;
	return notifications;
}

export function createOnedriveMatch(
	changeType?: string,
): CorsairWebhookMatcher {
	return (request: RawWebhookRequest) => {
		const notifications = parseOnedriveNotifications(request.body);
		if (!notifications) return false;
		const onedriveNotifications = notifications.filter(
			isOnedriveNotificationShape,
		);
		if (onedriveNotifications.length === 0) return false;
		if (!changeType) return true;
		return onedriveNotifications.some(
			(notification) => notification.changeType === changeType,
		);
	};
}

export function createOnedriveValidationMatch(): CorsairWebhookMatcher {
	return (request: RawWebhookRequest) => {
		if (extractOnedriveValidationToken(request)) return true;
		const acceptHeader = request.headers['accept'] || '';
		if (
			typeof acceptHeader === 'string' &&
			acceptHeader.includes('text/plain')
		) {
			const parsed = parseBody(request.body);
			if (
				!parsed ||
				(typeof parsed === 'object' && Object.keys(parsed).length === 0)
			) {
				return true;
			}
		}
		return false;
	};
}

export function extractOnedriveValidationToken(
	request:
		| RawWebhookRequest
		| {
				payload?: unknown;
				headers?: Record<string, string | string[] | undefined>;
		  },
): string | null {
	const headers = request.headers || {};
	const candidates = [
		headers.validationtoken,
		headers['validation-token'],
		headers['ms-validation-token'],
	];
	for (const candidate of candidates) {
		if (typeof candidate === 'string' && candidate.trim()) {
			return decodeURIComponent(candidate.trim());
		}
		if (
			Array.isArray(candidate) &&
			typeof candidate[0] === 'string' &&
			candidate[0].trim()
		) {
			return decodeURIComponent(candidate[0].trim());
		}
	}

	const pathLikeHeaderKeys = [
		'x-forwarded-uri',
		'x-original-uri',
		'x-rewrite-url',
		'x-envoy-original-path',
		'referer',
	];
	for (const key of pathLikeHeaderKeys) {
		const headerValue = headers[key];
		const asString = Array.isArray(headerValue) ? headerValue[0] : headerValue;
		if (!asString || typeof asString !== 'string') continue;
		try {
			const fullUrl = asString.startsWith('http')
				? new URL(asString)
				: new URL(
						`https://example.invalid${asString.startsWith('/') ? asString : `/${asString}`}`,
					);
			const queryToken = fullUrl.searchParams.get('validationToken');
			if (queryToken && queryToken.trim()) return queryToken.trim();
		} catch {}
	}

	const bodySource =
		'payload' in request
			? request.payload
			: 'body' in request
				? request.body
				: undefined;
	const parsed = parseBody(bodySource);
	if (!parsed || typeof parsed !== 'object') return null;
	const token = (parsed as Record<string, unknown>).validationToken;
	if (typeof token === 'string' && token.trim()) return token.trim();

	return null;
}

export function verifyOnedriveClientState(
	notification: { clientState?: string | null },
	expectedClientState: string,
): { valid: boolean; error?: string } {
	if (!notification.clientState) {
		return { valid: false, error: 'Missing clientState in notification' };
	}
	const isValid = notification.clientState === expectedClientState;
	return {
		valid: isValid,
		error: isValid ? undefined : 'clientState mismatch',
	};
}

export type OnedriveWebhookOutputs = {
	validation: OnedriveValidationPayload;
	driveNotification: OnedriveWebhookPayload;
};
