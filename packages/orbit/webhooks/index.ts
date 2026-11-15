import type { RawWebhookRequest } from 'corsair/core';
import type { OrbitContext } from '../index';
import { handleOrbitDelivery } from './events';

function hasSignature(request: RawWebhookRequest): boolean {
	const headers = request.headers;
	return (
		'x-orbit-webhook-signature' in headers ||
		'X-Orbit-Webhook-Signature' in headers
	);
}

export const OrbitWebhooks = {
	delivery: {
		match: hasSignature,
		handler: (
			ctx: OrbitContext,
			request: Parameters<typeof handleOrbitDelivery>[1],
		) => handleOrbitDelivery(ctx, request),
	},
};
