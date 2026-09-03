import { logEventFromContext } from 'corsair/core';
import type { PostmanEndpoints } from '..';
import { makePostmanRequest } from '../client';
import type { PostmanEndpointOutputs } from './types';

export const importOpenapi: PostmanEndpoints['toolsImportOpenapi'] = async (
	ctx,
	input,
) => {
	const response = await makePostmanRequest<
		PostmanEndpointOutputs['toolsImportOpenapi']
	>('/import/openapi', ctx.key, {
		method: 'POST',
		query: {
			workspace: input.workspace,
		},
		body: input.body,
	});

	await logEventFromContext(
		ctx,
		'postman.tools.importOpenapi',
		{ workspace: input.workspace },
		'completed',
	);
	return response;
};
