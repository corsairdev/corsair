import { logEventFromContext } from 'corsair/core';
import type { CodeInterpreterEndpoints } from '..';
import { makeCodeInterpreterRequest } from '../client';
import type { CodeInterpreterEndpointOutputs } from './types';

export const deleteFile: CodeInterpreterEndpoints['deleteFile'] = async (
	ctx,
	input,
) => {
	const response = await makeCodeInterpreterRequest<
		CodeInterpreterEndpointOutputs['deleteFile']
	>('files', ctx.key, {
		method: 'DELETE',
		query: {
			file_id: input.file_id,
			session_id: input.session_id,
		},
		baseUrl: ctx.options.baseUrl,
	});

	await logEventFromContext(
		ctx,
		'codeinterpreter.file.delete',
		{ file_id: input.file_id },
		'completed',
	);
	return response;
};
