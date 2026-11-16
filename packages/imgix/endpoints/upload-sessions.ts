import { logEventFromContext } from 'corsair/core';
import type { ImgixEndpoints } from '..';
import { makeImgixRequest } from '../client';
import { ImgixEndpointInputSchemas, ImgixEndpointOutputSchemas } from './types';

function encodePath(originPath: string): string {
	return originPath
		.split('/')
		.map((part) => encodeURIComponent(part))
		.join('/');
}

export const create: ImgixEndpoints['uploadSessions.create'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		ImgixEndpointInputSchemas['uploadSessions.create'].parse(input);

	const response = await makeImgixRequest(ctx.key, {
		method: 'POST',
		path: `sources/${encodeURIComponent(parsedInput.source_id)}/upload-sessions/${encodePath(parsedInput.origin_path)}`,
	});

	const parsed =
		ImgixEndpointOutputSchemas['uploadSessions.create'].parse(response);

	await logEventFromContext(
		ctx,
		'imgix.uploadSessions.create',
		{ source_id: parsedInput.source_id, session_id: parsed.data.id },
		'completed',
	);

	return parsed;
};

export const getStatus: ImgixEndpoints['uploadSessions.getStatus'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		ImgixEndpointInputSchemas['uploadSessions.getStatus'].parse(input);

	const response = await makeImgixRequest(ctx.key, {
		method: 'GET',
		path: `sources/${encodeURIComponent(parsedInput.source_id)}/upload-sessions/status/${encodeURIComponent(parsedInput.session_id)}`,
	});

	const parsed =
		ImgixEndpointOutputSchemas['uploadSessions.getStatus'].parse(response);

	await logEventFromContext(
		ctx,
		'imgix.uploadSessions.getStatus',
		{ source_id: parsedInput.source_id, session_id: parsed.data.id },
		'completed',
	);

	return parsed;
};

export const close: ImgixEndpoints['uploadSessions.close'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		ImgixEndpointInputSchemas['uploadSessions.close'].parse(input);

	const response = await makeImgixRequest(ctx.key, {
		method: 'POST',
		path: `sources/${encodeURIComponent(parsedInput.source_id)}/upload-sessions/${encodeURIComponent(parsedInput.session_id)}`,
	});

	const parsed =
		ImgixEndpointOutputSchemas['uploadSessions.close'].parse(response);

	await logEventFromContext(
		ctx,
		'imgix.uploadSessions.close',
		{ source_id: parsedInput.source_id, session_id: parsedInput.session_id },
		'completed',
	);

	return parsed;
};

export const cancel: ImgixEndpoints['uploadSessions.cancel'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		ImgixEndpointInputSchemas['uploadSessions.cancel'].parse(input);

	const response = await makeImgixRequest(ctx.key, {
		method: 'DELETE',
		path: `sources/${encodeURIComponent(parsedInput.source_id)}/upload-sessions/cancel/${encodeURIComponent(parsedInput.session_id)}`,
	});

	const parsed =
		ImgixEndpointOutputSchemas['uploadSessions.cancel'].parse(response);

	await logEventFromContext(
		ctx,
		'imgix.uploadSessions.cancel',
		{ source_id: parsedInput.source_id, session_id: parsedInput.session_id },
		'completed',
	);

	return parsed;
};
