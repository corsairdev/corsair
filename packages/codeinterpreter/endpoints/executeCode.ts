import { logEventFromContext } from 'corsair/core';
import type { CodeInterpreterEndpoints } from '..';
import { makeCodeInterpreterRequest } from '../client';
import type { CodeInterpreterEndpointOutputs } from './types';

export const executeCode: CodeInterpreterEndpoints['executeCode'] = async (
	ctx,
	input,
) => {
	const response = await makeCodeInterpreterRequest<
		CodeInterpreterEndpointOutputs['executeCode']
	>('exec', ctx.key, {
		method: 'POST',
		body: input,
	});

	await logEventFromContext(
		ctx,
		'codeinterpreter.code.execute',
		{ language: input.language, session_id: input.session_id },
		'completed',
	);
	return response;
};
