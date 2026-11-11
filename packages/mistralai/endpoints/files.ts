import type { MistralAiEndpoints } from '../index';
import { callMistralAi, decodeBase64 } from './shared';
import {
	MistralAiEndpointInputSchemas,
	MistralAiEndpointOutputSchemas,
} from './types';

export const list: MistralAiEndpoints['filesList'] = async (ctx, rawInput) => {
	const input = MistralAiEndpointInputSchemas.filesList.parse(rawInput ?? {});
	return callMistralAi(ctx, '/v1/files', {
		query: input,
		output: MistralAiEndpointOutputSchemas.filesList,
		event: 'files.list',
		logged: { page: input.page, purpose: input.purpose },
	});
};

export const upload: MistralAiEndpoints['filesUpload'] = async (
	ctx,
	rawInput,
) => {
	const input = MistralAiEndpointInputSchemas.filesUpload.parse(rawInput);
	const bytes = decodeBase64(input.content_base64, 'content_base64');

	const formData = new FormData();
	formData.append('file', new Blob([bytes]), input.filename);
	if (input.purpose) formData.append('purpose', input.purpose);
	if (input.visibility) formData.append('visibility', input.visibility);
	if (input.expiry !== undefined) {
		formData.append('expiry', String(input.expiry));
	}

	return callMistralAi(ctx, '/v1/files', {
		method: 'POST',
		formData,
		output: MistralAiEndpointOutputSchemas.filesUpload,
		event: 'files.upload',
		logged: {
			filename: input.filename,
			purpose: input.purpose,
			bytes: bytes.length,
		},
	});
};

export const get: MistralAiEndpoints['filesGet'] = async (ctx, rawInput) => {
	const input = MistralAiEndpointInputSchemas.filesGet.parse(rawInput);
	return callMistralAi(ctx, '/v1/files/{file_id}', {
		path: { file_id: input.file_id },
		output: MistralAiEndpointOutputSchemas.filesGet,
		event: 'files.get',
		logged: { file_id: input.file_id },
	});
};

export const remove: MistralAiEndpoints['filesDelete'] = async (
	ctx,
	rawInput,
) => {
	const input = MistralAiEndpointInputSchemas.filesDelete.parse(rawInput);
	return callMistralAi(ctx, '/v1/files/{file_id}', {
		method: 'DELETE',
		path: { file_id: input.file_id },
		output: MistralAiEndpointOutputSchemas.filesDelete,
		event: 'files.delete',
		logged: { file_id: input.file_id },
	});
};

export const getSignedUrl: MistralAiEndpoints['filesGetSignedUrl'] = async (
	ctx,
	rawInput,
) => {
	const input = MistralAiEndpointInputSchemas.filesGetSignedUrl.parse(rawInput);
	return callMistralAi(ctx, '/v1/files/{file_id}/url', {
		path: { file_id: input.file_id },
		query: { expiry: input.expiry },
		output: MistralAiEndpointOutputSchemas.filesGetSignedUrl,
		event: 'files.getSignedUrl',
		logged: { file_id: input.file_id },
	});
};
