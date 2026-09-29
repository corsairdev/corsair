import { logEventFromContext } from 'corsair/core';
import type { CodeInterpreterEndpoints } from '..';
import { makeCodeInterpreterUpload } from '../client';
import type { CodeInterpreterEndpointOutputs } from './types';

export const uploadFile: CodeInterpreterEndpoints['uploadFile'] = async (
	ctx,
	input,
) => {
	const response = await makeCodeInterpreterUpload<
		CodeInterpreterEndpointOutputs['uploadFile']
	>(
		ctx.key,
		{
			filename: input.filename,
			content: input.content,
			mimeType: input.mime_type,
		},
		{
			sessionId: input.session_id,
			baseUrl: ctx.options.baseUrl,
		},
	);

	await logEventFromContext(
		ctx,
		'codeinterpreter.file.upload',
		{ filename: input.filename },
		'completed',
	);
	return response;
};
