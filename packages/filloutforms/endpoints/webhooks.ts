import { logEventFromContext } from 'corsair/core';
import { makeFilloutRequest } from '../client';
import type { FilloutFormsEndpoints } from '../index';
import type { FilloutFormsEndpointOutputs } from './types';

export const createWebhook: FilloutFormsEndpoints['createDatabaseWebhook'] =
	async (ctx, input) => {
		const response = await makeFilloutRequest<
			FilloutFormsEndpointOutputs['createDatabaseWebhook']
		>('webhook/create', ctx.key, {
			method: 'POST',
			body: {
				formId: input.formId,
				url: input.url,
			},
		});

		await logEventFromContext(
			ctx,
			'filloutforms.webhooks.create',
			{ ...input },
			'completed',
		);
		return response;
	};

export const removeFormWebhook: FilloutFormsEndpoints['removeFormWebhook'] =
	async (ctx, input) => {
		const response = await makeFilloutRequest<
			FilloutFormsEndpointOutputs['removeFormWebhook']
		>('webhook/delete', ctx.key, {
			method: 'POST',
			body: {
				webhookId: input.webhookId,
			},
		});

		await logEventFromContext(
			ctx,
			'filloutforms.webhooks.remove',
			{ ...input },
			'completed',
		);
		return response ?? {};
	};
