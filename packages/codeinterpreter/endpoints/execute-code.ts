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
		body: {
			code: input.code,
			// Provider wire names (code.librechat.ai/docs, "Execute code
			// with specified language and parameters"): `lang` + `entity_id`.
			// The endpoint schema keeps the ergonomic `language` /
			// `session_id` aliases and maps them here.
			lang: input.language ?? 'py',
			...(input.session_id ? { entity_id: input.session_id } : {}),
			...(input.args ? { args: input.args } : {}),
			...(input.files ? { files: input.files } : {}),
		},
		baseUrl: ctx.options.baseUrl,
	});

	await logEventFromContext(
		ctx,
		'codeinterpreter.code.execute',
		{ language: input.language, session_id: input.session_id },
		'completed',
	);
	return response;
};
