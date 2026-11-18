import { logEventFromContext } from 'corsair/core';
import type { CodeInterpreterEndpoints } from '..';
import { makeCodeInterpreterDownload } from '../client';

export const downloadFile: CodeInterpreterEndpoints['downloadFile'] = async (
	ctx,
	input,
) => {
	const path = `files/${encodeURIComponent(input.file_id)}`;
	const query = input.session_id
		? `?session_id=${encodeURIComponent(input.session_id)}`
		: '';
	const { base64, contentType, filename } = await makeCodeInterpreterDownload(
		`${path}${query}`,
		ctx.key,
		{ baseUrl: ctx.options.baseUrl },
	);

	const response = {
		file_id: input.file_id,
		filename,
		content: base64,
		mime_type: contentType,
	};

	await logEventFromContext(
		ctx,
		'codeinterpreter.file.download',
		{ file_id: input.file_id },
		'completed',
	);
	return response;
};
