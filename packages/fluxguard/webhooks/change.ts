import type { CorsairWebhook } from 'corsair/core';
import { logEventFromContext } from 'corsair/core';
import type { FluxguardContext } from '..';
import type { FluxguardChangeEvent } from './types';
import {
	FluxguardChangeEventSchema,
	matchFluxguardWebhook,
	verifyFluxguardSignature,
} from './types';

export const changeDetected: CorsairWebhook<
	FluxguardContext,
	FluxguardChangeEvent,
	FluxguardChangeEvent
> = {
	match: matchFluxguardWebhook,

	handler: async (ctx, request) => {
		const verification = verifyFluxguardSignature(request, ctx.key);
		if (!verification.valid) {
			return {
				success: false,
				statusCode: 401,
				error: verification.error ?? 'Fluxguard webhook verification failed',
			};
		}

		const parsed = FluxguardChangeEventSchema.safeParse(request.payload);
		if (!parsed.success) {
			return {
				success: false,
				statusCode: 400,
				error: 'Invalid Fluxguard change payload',
			};
		}

		const event = parsed.data;
		await logEventFromContext(
			ctx,
			'fluxguard.webhook.changeDetected',
			{
				siteId: event.site?.id ?? undefined,
				sessionId: event.session?.id ?? undefined,
				pageId: event.page?.id ?? undefined,
				url: event.url ?? undefined,
				aiFlagged: event.aiFlagged ?? undefined,
			},
			'completed',
		);

		return { success: true, data: event };
	},
};
