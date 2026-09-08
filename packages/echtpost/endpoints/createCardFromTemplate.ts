import { logEventFromContext } from 'corsair/core';
import type { EchtpostEndpoints } from '..';
import { makeEchtpostRequest } from '../client';
import type { EchtpostEndpointOutputs } from './types';

export const createCardFromTemplate: EchtpostEndpoints['createCardFromTemplate'] =
	async (ctx, input) => {
		const response = await makeEchtpostRequest<
			EchtpostEndpointOutputs['createCardFromTemplate']
		>('cards/from_template', ctx.key, {
			method: 'POST',
			body: input as Record<string, unknown>,
		});
		await logEventFromContext(
			ctx,
			'echtpost.cards.createFromTemplate',
			{ template_id: input.template_id },
			'completed',
		);
		return response;
	};
