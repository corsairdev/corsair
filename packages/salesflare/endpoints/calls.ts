import { logEventFromContext } from 'corsair/core';
import type { SalesflareEndpoints } from '..';
import { makeSalesflareRequest } from '../client';
import { salesflarePathParameter } from './path';
import type { SalesflareEndpointOutputs } from './types';

export const createCall: SalesflareEndpoints['createCall'] = async (
	ctx,
	input,
) => {
	const response = await makeSalesflareRequest<
		SalesflareEndpointOutputs['createCall']
	>(ctx, '/calls', { method: 'POST', body: input });
	await logEventFromContext(
		ctx,
		'salesflare.calls.createCall',
		input,
		'completed',
	);
	return response;
};

export const updateCall: SalesflareEndpoints['updateCall'] = async (
	ctx,
	input,
) => {
	const { meetingId, ...body } = input;
	const response = await makeSalesflareRequest<
		SalesflareEndpointOutputs['updateCall']
	>(
		ctx,
		salesflarePathParameter(
			'/calls/{meeting_id}',
			'meeting_id',
			input.meetingId,
		),
		{ method: 'PUT', body: body },
	);
	await logEventFromContext(
		ctx,
		'salesflare.calls.updateCall',
		input,
		'completed',
	);
	return response;
};
