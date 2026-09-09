import { logEventFromContext } from 'corsair/core';
import type { CodeInterpreterEndpoints } from '..';
import type { CodeInterpreterEndpointOutputs } from './types';
import { makeCodeInterpreterRequest } from '../client';

export const deleteFile: CodeInterpreterEndpoints['deleteFile'] = async (ctx, input) => {
	const response = await makeCodeInterpreterRequest<CodeInterpreterEndpointOutputs['deleteFile']>(
		'files',
		ctx.key,
		{
			method: 'DELETE',
			body: input,
		},
	);

	await logEventFromContext(ctx, 'codeinterpreter.file.delete', { file_id: input.file_id }, 'completed');
	return response;
};
