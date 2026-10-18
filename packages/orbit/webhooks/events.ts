import type { WebhookRequest } from 'corsair/core';
import { logEventFromContext } from 'corsair/core';
import type { OrbitContext } from '../index';
import { verifyOrbitSignature } from './verify';

const seen = new Map<string, number>();

export const OrbitDelivery = {
	id: '',
	type: '',
	created: '',
};

function eventId(
	headers: Record<string, string | string[] | undefined>,
	payload: { id?: string },
): string {
	const header = headers['x-orbit-webhook-event-id'];
	const value = Array.isArray(header) ? header[0] : header;
	return value || payload.id || '';
}

export async function handleOrbitDelivery(
	ctx: OrbitContext,
	request: WebhookRequest<{
		id?: string;
		type?: string;
		created?: string;
		test?: boolean;
	}>,
): Promise<{ success: boolean; statusCode?: number; error?: string }> {
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
	const id = eventId(request.headers, request.payload);
	const seal = `${ctx.key ?? 'hub'}:${id}`;
	if (id && seen.has(seal)) {
		return { success: false, statusCode: 200, error: 'duplicate delivery' };
	}
	if (id) seen.set(seal, Date.now());
	await logEventFromContext(
		ctx,
		'webhooks.delivery',
		{
			eventId: id,
			type: request.payload.type ?? '',
			test: request.payload.test ? 'true' : 'false',
		},
		'completed',
	);
	return { success: true };
}
