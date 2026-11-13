import { logEventFromContext } from 'corsair/core';
import type { GigasheetEndpoints } from '..';
import { makeGigasheetRequest } from '../client';
import {
	GigasheetEndpointInputSchemas,
	GigasheetEndpointOutputSchemas,
	type UploadDirectResponse,
	type UploadFromUrlResponse,
} from './types';

export const fromUrl: GigasheetEndpoints['upload.fromUrl'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		GigasheetEndpointInputSchemas['upload.fromUrl'].parse(input);
	const response = await makeGigasheetRequest<UploadFromUrlResponse>(
		'/upload/url',
		ctx.key,
		{
			method: 'POST',
			// `unknown` because payload is dynamically shaped JSON validated by Zod above.
			body: parsedInput as unknown as Record<string, unknown>,
		},
	);

	const parsed =
		GigasheetEndpointOutputSchemas['upload.fromUrl'].parse(response);

	await logEventFromContext(
		ctx,
		'gigasheet.upload.fromUrl',
		{ handle: parsed.Handle },
		'completed',
	);

	return parsed;
};

export const direct: GigasheetEndpoints['upload.direct'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		GigasheetEndpointInputSchemas['upload.direct'].parse(input);
	const response = await makeGigasheetRequest<UploadDirectResponse>(
		'/upload/direct',
		ctx.key,
		{
			method: 'POST',
			// `unknown` because payload is dynamically shaped JSON validated by Zod above.
			body: parsedInput as unknown as Record<string, unknown>,
		},
	);

	const parsed =
		GigasheetEndpointOutputSchemas['upload.direct'].parse(response);

	await logEventFromContext(
		ctx,
		'gigasheet.upload.direct',
		{ handle: parsed.Handle },
		'completed',
	);

	return parsed;
};

export const Upload = {
	fromUrl,
	direct,
};
