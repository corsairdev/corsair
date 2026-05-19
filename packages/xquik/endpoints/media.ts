import { logEventFromContext } from 'corsair/core';
import { makeXquikRequest } from '../client';
import type { XquikEndpoints } from '../index';
import { baseUrlFromOptions } from './helpers';
import type { XquikEndpointOutputs } from './types';

export const uploadFromUrl: XquikEndpoints['mediaUploadFromUrl'] = async (
	ctx,
	input,
) => {
	const response = await makeXquikRequest<
		XquikEndpointOutputs['mediaUploadFromUrl']
	>('/x/media', ctx.key, {
		baseUrl: baseUrlFromOptions(ctx.options),
		body: input,
		method: 'POST',
	});

	await logEventFromContext(
		ctx,
		'xquik.media.uploadFromUrl',
		{ account: input.account },
		'completed',
	);

	return response;
};

export const download: XquikEndpoints['mediaDownload'] = async (ctx, input) => {
	const response = await makeXquikRequest<
		XquikEndpointOutputs['mediaDownload']
	>('/x/media/download', ctx.key, {
		baseUrl: baseUrlFromOptions(ctx.options),
		body: input,
		method: 'POST',
	});

	await logEventFromContext(
		ctx,
		'xquik.media.download',
		{ bulk: input.tweetIds !== undefined },
		'completed',
	);

	return response;
};
