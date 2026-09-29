import { logEventFromContext } from 'corsair/core';
import type { CodeInterpreterEndpoints } from '..';
import { makeCodeInterpreterRequest } from '../client';
import type { CodeInterpreterEndpointOutputs } from './types';

export const downloadFile: CodeInterpreterEndpoints['downloadFile'] = async (
	ctx,
	input,
) => {
	const response = await makeCodeInterpreterRequest<
		CodeInterpreterEndpointOutputs['downloadFile']
	>(`files/${encodeURIComponent(input.file_id)}`, ctx.key, { method: 'GET' });

	await logEventFromContext(
		ctx,
		'codeinterpreter.file.download',
		{ file_id: input.file_id },
		'completed',
	);
	return response;
};
