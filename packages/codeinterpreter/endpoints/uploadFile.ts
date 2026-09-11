import { logEventFromContext } from 'corsair/core';
import type { CodeInterpreterEndpoints } from '..';
import type { CodeInterpreterEndpointOutputs } from './types';
import { makeCodeInterpreterUpload } from '../client';

export const uploadFile: CodeInterpreterEndpoints['uploadFile'] = async (ctx, input) => {
	const response = await makeCodeInterpreterUpload<CodeInterpreterEndpointOutputs['uploadFile']>(
		ctx.key,
		{
			filename: input.filename,
			content: input.content,
			mimeType: input.mime_type,
		},
		{
			sessionId: input.session_id,
		},
	);

	await logEventFromContext(ctx, 'codeinterpreter.file.upload', { filename: input.filename }, 'completed');
	return response;
};
