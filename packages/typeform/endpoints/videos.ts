import { logEventFromContext } from 'corsair/core';
import type { TypeformEndpoints } from '..';
import { makeTypeformRequest } from '../client';
import type { TypeformEndpointOutputs } from './types';

export const upload: TypeformEndpoints['videosUpload'] = async (ctx, input) => {
	const response = await makeTypeformRequest<
		TypeformEndpointOutputs['videosUpload']
	>(
		`/forms/${input.form_id}/videos/${input.field_id}/${input.language}`,
		ctx.key,
		{
			method: 'POST',
			body: {},
		},
	);

	await logEventFromContext(
		ctx,
		'typeform.videos.upload',
		{
			form_id: input.form_id,
			field_id: input.field_id,
			language: input.language,
		},
		'completed',
	);

	return response;
};
