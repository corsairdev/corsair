import { logEventFromContext } from 'corsair/core';
import {
	makeWebvizioRequest,
	unwrapWebvizioList,
	WEBVIZIO_WEBHOOK_API_BASE,
} from '../client';
import type { WebvizioContext, WebvizioEndpoints } from '../index';
import { WebvizioEndpointOutputSchemas } from './types';

export const list: WebvizioEndpoints['webhooksList'] = async (
	ctx: WebvizioContext,
	input,
) => {
	const result = await makeWebvizioRequest<unknown>('/webhook', ctx.key, {
		baseUrl: WEBVIZIO_WEBHOOK_API_BASE,
		method: 'GET',
	});
	const parsed = WebvizioEndpointOutputSchemas.webhooksList.parse(
		unwrapWebvizioList(result),
	);

	try {
		await Promise.all(
			parsed.map((hook) =>
				ctx.db.webhooks.upsertByEntityId(String(hook.id), {
					id: hook.id,
					url: hook.url,
					event: hook.event,
				}),
			),
		);
	} catch (error) {
		console.warn('[webvizio] Failed to cache webhooks:', error);
	}

	await logEventFromContext(ctx, 'webvizio.webhooks.list', input, 'completed');

	return parsed;
};
