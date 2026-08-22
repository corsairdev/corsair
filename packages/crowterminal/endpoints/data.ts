import { logEventFromContext } from 'corsair/core';
import { makeCrowterminalRequest } from '../client';
import type { CrowterminalEndpoints } from '../index';
import type { CrowterminalEndpointOutputs } from './types';

export const ingest: CrowterminalEndpoints['dataIngest'] = async (
	ctx,
	input,
) => {
	const response = await makeCrowterminalRequest<
		CrowterminalEndpointOutputs['dataIngest']
	>('/api/agent/data/ingest', ctx.key, {
		method: 'POST',
		body: input,
	});

	await logEventFromContext(
		ctx,
		'crowterminal.data.ingest',
		{ ...input },
		'completed',
	);
	return response;
};
