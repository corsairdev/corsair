import { logEventFromContext } from 'corsair/core';
import type { CodeInterpreterEndpoints } from '..';
import type { CodeInterpreterEndpointOutputs } from './types';
import { makeCodeInterpreterRequest } from '../client';

export const executeCode: CodeInterpreterEndpoints['executeCode'] = async (ctx, input) => {
	const response = await makeCodeInterpreterRequest<CodeInterpreterEndpointOutputs['executeCode']>(
		'exec',
		ctx.key,
		{
			method: 'POST',
			body: input,
		},
	);

	await logEventFromContext(ctx, 'codeinterpreter.code.execute', { ...input }, 'completed');
	return response;
};
