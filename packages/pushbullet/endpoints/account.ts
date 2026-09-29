import { logEventFromContext } from 'corsair/core';
import { makePushbulletRequest } from '../client';
import type { PushbulletEndpoints } from '../index';
import type { PushbulletEndpointOutputs } from './types';
import {
	PushbulletEndpointInputSchemas,
	PushbulletEndpointOutputSchemas,
} from './types';

/** The account the access token belongs to. */
export const me: PushbulletEndpoints['usersMe'] = async (ctx, input) => {
	const parsed = PushbulletEndpointInputSchemas.usersMe.parse(input);
	const result = await makePushbulletRequest<
		PushbulletEndpointOutputs['usersMe']
	>('users/me', ctx.key, {
		method: 'GET',
		schema: PushbulletEndpointOutputSchemas.usersMe,
	});

	await logEventFromContext(
		ctx,
		'pushbullet.users.me',
		{ ...parsed },
		'completed',
	);
	return result;
};

export const uploadRequest: PushbulletEndpoints['filesUploadRequest'] = async (
	ctx,
	input,
) => {
	const parsed = PushbulletEndpointInputSchemas.filesUploadRequest.parse(input);
	const result = await makePushbulletRequest<
		PushbulletEndpointOutputs['filesUploadRequest']
	>('upload-request', ctx.key, {
		method: 'POST',
		body: { ...parsed },
		schema: PushbulletEndpointOutputSchemas.filesUploadRequest,
	});

	await logEventFromContext(
		ctx,
		'pushbullet.files.uploadRequest',
		{ ...parsed },
		'completed',
	);
	return result;
};
