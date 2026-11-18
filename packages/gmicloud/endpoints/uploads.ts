import { logEventFromContext } from 'corsair/core';
import type { GmicloudEndpoints } from '..';
import { makeGmicloudRequest } from '../client';
import {
	GmicloudEndpointInputSchemas,
	GmicloudEndpointOutputSchemas,
} from './types';

export const createUrl: GmicloudEndpoints['uploadsCreateUrl'] = async (
	ctx,
	input,
) => {
	const body = GmicloudEndpointInputSchemas.uploadsCreateUrl.parse(input);
	const result = GmicloudEndpointOutputSchemas.uploadsCreateUrl.parse(
		await makeGmicloudRequest(ctx, {
			api: 'console',
			method: 'POST',
			url: 'v1/ie/requestqueue/apikey/upload-url',
			body,
		}),
	);
	await logEventFromContext(
		ctx,
		'gmicloud.uploads.createUrl',
		{ fileType: body.file_type },
		'completed',
	);
	return result;
};
