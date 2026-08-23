import { logEventFromContext } from 'corsair/core';
import type { BannerbearEndpoints } from '..';
import { makeBannerbearRequest } from '../client';
import type { BannerbearEndpointOutputs } from './types';

export const joinPdfs: BannerbearEndpoints['joinPdfs'] = async (ctx, input) => {
	const response = await makeBannerbearRequest<
		BannerbearEndpointOutputs['joinPdfs']
	>('/v5/tools/create_pdf', ctx.key, {
		method: 'POST',
		body: {
			urls: input.urls,
			metadata: input.metadata,
		},
	});
	await logEventFromContext(
		ctx,
		'bannerbear.tools.create_pdf',
		{ ...input },
		'completed',
	);
	return response;
};
