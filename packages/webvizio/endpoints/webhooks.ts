import { logEventFromContext } from 'corsair/core';
import { makeWebvizioRequest, WEBVIZIO_WEBHOOK_API_BASE } from '../client';
import type { WebvizioEndpoints } from '../index';
import { WebvizioEndpointOutputSchemas } from './types';

export const list: WebvizioEndpoints['webhooksList'] = async (ctx, input) => {
	const result = await makeWebvizioRequest<unknown>('/webhook', ctx.key, {
		baseUrl: WEBVIZIO_WEBHOOK_API_BASE,
	});

	const parsed = WebvizioEndpointOutputSchemas.webhooksList.parse(result);

	await logEventFromContext(
		ctx,
		'webvizio.webhooks.list',
		{ ...input },
		'completed',
	);

	return parsed;
};
