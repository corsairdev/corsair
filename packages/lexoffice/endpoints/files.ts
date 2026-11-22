import { logEventFromContext } from 'corsair/core';
import type { BinaryResponse } from 'corsair/http';
import type { LexofficeEndpoints } from '..';
import { makeLexofficeRequest, toLexofficeFileResponse } from '../client';
import {
	LexofficeEndpointInputSchemas,
	LexofficeEndpointOutputSchemas,
} from './types';

export const upload: LexofficeEndpoints['filesUpload'] = async (ctx, input) => {
	const parsedInput = LexofficeEndpointInputSchemas.filesUpload.parse(input);
	const file = new File(
		[Buffer.from(parsedInput.file, 'base64')],
		parsedInput.fileName,
		{ type: parsedInput.contentType },
	);
	const response = await makeLexofficeRequest<{
		id: string;
		voucherId: string;
	}>('/files', ctx.key, {
		method: 'POST',
		formData: { file, type: 'voucher' },
	});
	const parsed = LexofficeEndpointOutputSchemas.filesUpload.parse(response);
	await logEventFromContext(
		ctx,
		'lexoffice.files.upload',
		{ fileId: parsed.id, voucherId: parsed.voucherId },
		'completed',
	);
	return parsed;
};

export const download: LexofficeEndpoints['filesDownload'] = async (
	ctx,
	input,
) => {
	const parsedInput = LexofficeEndpointInputSchemas.filesDownload.parse(input);
	const response = await makeLexofficeRequest<BinaryResponse>(
		`/files/${encodeURIComponent(parsedInput.id)}`,
		ctx.key,
		{
			method: 'GET',
			headers: { Accept: parsedInput.accept ?? '*/*' },
			responseType: 'binary',
		},
	);
	const parsed = LexofficeEndpointOutputSchemas.filesDownload.parse(
		toLexofficeFileResponse(response),
	);
	await logEventFromContext(
		ctx,
		'lexoffice.files.download',
		{ fileId: parsedInput.id, sizeBytes: parsed.sizeBytes },
		'completed',
	);
	return parsed;
};
