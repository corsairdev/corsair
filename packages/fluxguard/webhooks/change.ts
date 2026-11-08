import type { CorsairWebhook } from 'corsair/core';
import { logEventFromContext } from 'corsair/core';
import type { FluxguardContext } from '..';
import type { FluxguardChangeEvent } from './types';
import {
	FluxguardChangeEventSchema,
	matchFluxguardWebhook,
	verifyFluxguardSignature,
} from './types';

/**
 * A rejected delivery throws instead of returning `success: false`.
 * `processWebhook` reads only `returnToSender`, `responseHeaders` and (on a
 * throw) the error message, then answers `{ success: true }` regardless. So a
 * returned `statusCode: 401` never reaches the HTTP handler, and a forged
 * delivery would be acknowledged as accepted. Throwing is the only path that
 * makes `processWebhook` report `success: false`, which is what `fal` does for
 * the same reason.
 */
export const changeDetected: CorsairWebhook<
	FluxguardContext,
	FluxguardChangeEvent,
	FluxguardChangeEvent
> = {
	match: matchFluxguardWebhook,

	handler: async (ctx, request) => {
		const verification = verifyFluxguardSignature(request, ctx.key);
		if (!verification.valid) {
			throw new Error(
				verification.error ?? 'Fluxguard webhook verification failed',
			);
		}

		const parsed = FluxguardChangeEventSchema.safeParse(request.payload);
		if (!parsed.success) {
			throw new Error('Invalid Fluxguard change payload');
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
