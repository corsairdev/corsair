import { logEventFromContext } from 'corsair/core';
import type { UploadcareEndpoints } from '..';

export const mirror: UploadcareEndpoints['imageMirror'] = async (
	ctx,
	input,
) => {
	const url = `https://ucarecdn.com/${input.uuid}/-/mirror/`;
	await logEventFromContext(ctx, 'uploadcare.cdn.mirror', input, 'completed');
	return { url };
};

export const rotate: UploadcareEndpoints['rotateImage'] = async (
	ctx,
	input,
) => {
	const url = `https://ucarecdn.com/${input.uuid}/-/rotate/${input.degrees}/`;
	await logEventFromContext(ctx, 'uploadcare.cdn.rotate', input, 'completed');
	return { url };
};
