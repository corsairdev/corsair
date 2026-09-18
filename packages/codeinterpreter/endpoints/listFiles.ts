import { logEventFromContext } from 'corsair/core';
import type { CodeInterpreterEndpoints } from '..';
import type { CodeInterpreterEndpointOutputs } from './types';
import { makeCodeInterpreterRequest } from '../client';

export const listFiles: CodeInterpreterEndpoints['listFiles'] = async (ctx, input) => {
	const query = input.session_id ? `?session_id=${encodeURIComponent(input.session_id)}` : '';
	const response = await makeCodeInterpreterRequest<CodeInterpreterEndpointOutputs['listFiles']>(
		`files${query}`,
		ctx.key,
		{ method: 'GET' },
	);

	await logEventFromContext(ctx, 'codeinterpreter.file.list', { ...input }, 'completed');
	return response;
};
