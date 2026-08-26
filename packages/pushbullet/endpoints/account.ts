import { logEventFromContext } from 'corsair/core';
import { makePushbulletRequest } from '../client';
import type { PushbulletEndpoints } from '../index';
import type { PushbulletEndpointOutputs } from './types';

/** The account the access token belongs to. */
export const me: PushbulletEndpoints['usersMe'] = async (ctx, input) => {
	const result = await makePushbulletRequest<
		PushbulletEndpointOutputs['usersMe']
	>('users/me', ctx.key, { method: 'GET' });

	await logEventFromContext(
		ctx,
		'pushbullet.users.me',
		{ ...input },
		'completed',
	);
	return result;
};

/**
 * Reserves an upload slot, returning a short-lived `upload_url` to POST the
 * bytes to and a permanent `file_url` to reference in a file push. Pushbullet
 * splits this into two steps so file bytes never transit its API host; the
 * caller performs the second step against the returned URL.
 */
export const uploadRequest: PushbulletEndpoints['filesUploadRequest'] = async (
	ctx,
	input,
) => {
	const result = await makePushbulletRequest<
		PushbulletEndpointOutputs['filesUploadRequest']
	>('upload-request', ctx.key, { method: 'POST', body: input });

	await logEventFromContext(
		ctx,
		'pushbullet.files.uploadRequest',
		{ ...input },
		'completed',
	);
	return result;
};
