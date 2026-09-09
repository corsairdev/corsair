import { logEventFromContext } from 'corsair/core';
import type { EchtpostEndpoints } from '..';
import { makeEchtpostRequest } from '../client';
import {
	EchtpostEndpointInputSchemas,
	EchtpostEndpointOutputSchemas,
} from './types';

export const createCardFromTemplate: EchtpostEndpoints['createCardFromTemplate'] =
	async (ctx, input) => {
		const validatedInput =
			EchtpostEndpointInputSchemas.createCardFromTemplate.parse(input);
		const raw = await makeEchtpostRequest<unknown>(
			'cards/from_template',
			ctx.key,
			{
				method: 'POST',
				body: validatedInput as Record<string, unknown>,
			},
		);
		const response =
			EchtpostEndpointOutputSchemas.createCardFromTemplate.parse(raw);
		try {
			await logEventFromContext(
				ctx,
				'echtpost.cards.createFromTemplate',
				{ template_id: validatedInput.template_id },
				'completed',
			);
		} catch {
			/* best effort */
		}
		return response;
	};
