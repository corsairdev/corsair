import { logEventFromContext } from 'corsair/core';
import type { BoloformsEndpoints } from '..';
import { makeBoloformsRequest } from '../client';
import type { BoloformsEndpointOutputs } from './types';

export const get: BoloformsEndpoints['getDocumentsList'] = async (
	ctx,
	input,
) => {
	const { workspaceId, ...query } = input;

	const response = await makeBoloformsRequest<
		BoloformsEndpointOutputs['getDocumentsList']
	>('signature/get-documents', ctx.key, workspaceId, { method: 'GET', query });

	await logEventFromContext(
		ctx,
		'boloforms.get_documents_list',
		{ ...input },
		'completed',
	);
	return response;
};
