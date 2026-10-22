import type { WebhookRequest, WebhookResponse } from 'corsair/core';
import { logEventFromContext } from 'corsair/core';
import type { z } from 'zod';
import type { CodaContext } from '..';
import type { CodaAuditBatch, CodaEventFilter } from './types';
import { codaHandshakeResponse, verifyCodaWebhookSignature } from './types';

export async function receiveCodaEvents<TEvent extends z.ZodType<object>>(
	ctx: CodaContext,
	request: WebhookRequest<CodaAuditBatch>,
	filter: CodaEventFilter,
	eventSchema: TEvent,
	eventName: string,
): Promise<WebhookResponse<{ events: z.infer<TEvent>[] }>> {
	const handshake = codaHandshakeResponse<{ events: z.infer<TEvent>[] }>(
		request,
	);
	if (handshake) return handshake;

	const verification = verifyCodaWebhookSignature(request, ctx.key);
	if (!verification.valid) {
		return { success: false, statusCode: 401, error: verification.error };
	}

	const matched = request.payload.events.filter(filter);
	const events = matched.map((event) => eventSchema.parse(event));

	await logEventFromContext(
		ctx,
		eventName,
		{ eventIds: matched.map((event) => event.eventId) },
		'completed',
	);

	return { success: true, data: { events } };
}
