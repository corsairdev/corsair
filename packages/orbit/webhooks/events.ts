import { createHash } from 'node:crypto';
import type { WebhookRequest } from 'corsair/core';
import { logEventFromContext } from 'corsair/core';
import type { OrbitContext } from '../index';
import { verifyOrbitSignature } from './verify';

const DELIVERY_TTL_MS = 24 * 60 * 60 * 1000;

type Seal = { state: 'running' | 'done'; at: number };

const deliveries = new Map<string, Seal>();

type DeliveryPayload = {
	id?: string;
	type?: string;
	created?: string;
	test?: boolean;
};

function headerValue(
	headers: Record<string, string | string[] | undefined>,
	name: string,
): string {
	const value = headers[name] ?? headers[name.toLowerCase()];
	if (Array.isArray(value)) return value[0] ?? '';
	return value ?? '';
}

function ownerKey(secret: string | undefined): string {
	if (!secret) return 'hub';
	return createHash('sha256').update(secret).digest('hex');
}

function deliveryKey(secret: string | undefined, eventId: string): string {
	return `${ownerKey(secret)}:${eventId}`;
}

function prune(now: number) {
	for (const [key, seal] of deliveries) {
		if (now - seal.at > DELIVERY_TTL_MS) deliveries.delete(key);
	}
}

export function resetOrbitDeliveries(): void {
	deliveries.clear();
}

export function completeOrbitDelivery(
	secret: string | undefined,
	eventId: string,
): void {
	if (!eventId) return;
	deliveries.set(deliveryKey(secret, eventId), {
		state: 'done',
		at: Date.now(),
	});
}

export function releaseOrbitDelivery(
	secret: string | undefined,
	eventId: string,
): void {
	if (!eventId) return;
	deliveries.delete(deliveryKey(secret, eventId));
}

function signedEventId(
	headers: Record<string, string | string[] | undefined>,
	payload: DeliveryPayload,
): { id: string } | { error: string } {
	const header = headerValue(headers, 'x-orbit-webhook-event-id');
	const signed = payload.id ?? '';
	if (!signed) return { error: 'missing signed event id' };
	if (header && header !== signed) {
		return { error: 'event id header does not match the signed payload' };
	}
	return { id: signed };
}

export async function handleOrbitDelivery(
	ctx: OrbitContext,
	request: WebhookRequest<DeliveryPayload>,
): Promise<{
	success: boolean;
	statusCode?: number;
	error?: string;
	data?: { eventId: string };
}> {
	if (!request.hubVerified) {
		if (!ctx.key) {
			return {
				success: false,
				statusCode: 401,
				error: 'missing webhook secret',
			};
		}
		if (!request.rawBody) {
			return { success: false, statusCode: 400, error: 'missing raw body' };
		}
		const valid = verifyOrbitSignature(
			ctx.key,
			request.headers,
			request.rawBody,
		);
		if (!valid) {
			return { success: false, statusCode: 401, error: 'invalid signature' };
		}
	}
	const identity = signedEventId(request.headers, request.payload);
	if ('error' in identity) {
		return { success: false, statusCode: 401, error: identity.error };
	}
	const now = Date.now();
	prune(now);
	const key = deliveryKey(ctx.key, identity.id);
	const current = deliveries.get(key);
	if (current?.state === 'done') {
		return { success: false, statusCode: 200, error: 'duplicate delivery' };
	}
	if (current?.state === 'running') {
		return { success: false, statusCode: 503, error: 'delivery in progress' };
	}
	deliveries.set(key, { state: 'running', at: now });
	try {
		await logEventFromContext(
			ctx,
			'webhooks.delivery',
			{
				eventId: identity.id,
				type: request.payload.type ?? '',
				test: request.payload.test ? 'true' : 'false',
			},
			'completed',
		);
	} catch (error) {
		deliveries.delete(key);
		throw error;
	}
	return { success: true, data: { eventId: identity.id } };
}
