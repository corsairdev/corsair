import { logEventFromContext } from 'corsair/core';
import type { DynapicturesEndpoints } from '..';
import { makeDynapicturesRequest } from '../client';
import type { DynapicturesEndpointOutputs } from './types';

export const unsubscribeWebhook: DynapicturesEndpoints['unsubscribeWebhook'] =
	async (ctx, input) => {
		await makeDynapicturesRequest('hooks', ctx.key, {
			method: 'DELETE',
			body: { id: input.id },
		});

		await logEventFromContext(
			ctx,
			'dynapictures.webhook.unsubscribe',
			{ ...input },
			'completed',
		);
		return { success: true };
	};
