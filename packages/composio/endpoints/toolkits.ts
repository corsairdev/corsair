import { logEventFromContext } from 'corsair/core';
import { makeComposioRequest } from '../client';
import type { ComposioEndpoints } from '../index';
import { ComposioEndpointOutputSchemas } from './types';

export const list: ComposioEndpoints['toolkitsList'] = async (ctx, input) => {
	const response = await makeComposioRequest(
		'/toolkits',
		ctx.key,
		ComposioEndpointOutputSchemas.toolkitsList,
		{ query: input },
	);
	if (ctx.db.toolkits) {
		for (const toolkit of response.items) {
			try {
				await ctx.db.toolkits.upsertByEntityId(toolkit.slug, {
					...toolkit,
					id: toolkit.slug,
				});
			} catch (error) {
				console.warn(
					`[composio] failed to save toolkit ${toolkit.slug}:`,
					error,
				);
			}
		}
	}
	await logEventFromContext(ctx, 'composio.toolkits.list', input, 'completed');
	return response;
};
