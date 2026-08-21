import { logEventFromContext } from 'corsair/core';
import type { BoloformsEndpoints } from '..';
import { makeBoloformsRequest } from '../client';
import { BoloformsEndpointOutputSchemas } from './types';

/**
 * List documents in a workspace.
 * API: GET /signature/get-documents
 * Docs: https://bolosign-developer-docs.readme.io/reference/get_get-documents-1
 * Auth: x-api-key + workspaceid header
 */
export const list: BoloformsEndpoints['getDocumentsList'] = async (
	ctx,
	input,
) => {
	const { workspaceId, ...query } = input;

	const rawResponse = await makeBoloformsRequest(
		'signature/get-documents',
		ctx.key,
		workspaceId,
		{
			method: 'GET',
			query,
		},
	);

	const response =
		BoloformsEndpointOutputSchemas.getDocumentsList.parse(rawResponse);

	await logEventFromContext(
		ctx,
		'boloforms.documents.list',
		{ ...input },
		'completed',
	);
	return response;
};
