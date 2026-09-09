import { logEventFromContext } from 'corsair/core';
import type { CodeInterpreterEndpoints } from '..';
import type { CodeInterpreterEndpointOutputs } from './types';
import { makeCodeInterpreterRequest } from '../client';

export const get: CodeInterpreterEndpoints['exampleGet'] = async (ctx, input) => {
	const response = await makeCodeInterpreterRequest<CodeInterpreterEndpointOutputs['exampleGet']>(
		`example/${input.id}`,
		ctx.key,
		{ method: 'GET' },
	);

	await logEventFromContext(ctx, 'codeinterpreter.example.get', { ...input }, 'completed');
	return response;
};
