import { logEventFromContext } from 'corsair/core';
import type { SalesflareEndpoints } from '..';
import { makeSalesflareRequest } from '../client';
import { salesflarePathParameter } from './path';
import type { SalesflareEndpointOutputs } from './types';

export const retrieveMeeting: SalesflareEndpoints['retrieveMeeting'] = async (
	ctx,
	input,
) => {
	const response = await makeSalesflareRequest<
		SalesflareEndpointOutputs['retrieveMeeting']
	>(
		ctx,
		salesflarePathParameter(
			'/meetings/{meeting_id}',
			'meeting_id',
			input.meetingId,
		),
		{ method: 'GET' },
	);
	await logEventFromContext(
		ctx,
		'salesflare.meetings.retrieveMeeting',
		input,
		'completed',
	);
	return response;
};

export const updateMeeting: SalesflareEndpoints['updateMeeting'] = async (
	ctx,
	input,
) => {
	const { meetingId, ...body } = input;
	const response = await makeSalesflareRequest<
		SalesflareEndpointOutputs['updateMeeting']
	>(
		ctx,
		salesflarePathParameter(
			'/meetings/{meeting_id}',
			'meeting_id',
			input.meetingId,
		),
		{ method: 'PUT', body: body },
	);
	await logEventFromContext(
		ctx,
		'salesflare.meetings.updateMeeting',
		input,
		'completed',
	);
	return response;
};

export const deleteMeeting: SalesflareEndpoints['deleteMeeting'] = async (
	ctx,
	input,
) => {
	const response = await makeSalesflareRequest<
		SalesflareEndpointOutputs['deleteMeeting']
	>(
		ctx,
		salesflarePathParameter(
			'/meetings/{meeting_id}',
			'meeting_id',
			input.meetingId,
		),
		{ method: 'DELETE' },
	);
	await logEventFromContext(
		ctx,
		'salesflare.meetings.deleteMeeting',
		input,
		'completed',
	);
	return response;
};

export const createMeeting: SalesflareEndpoints['createMeeting'] = async (
	ctx,
	input,
) => {
	const response = await makeSalesflareRequest<
		SalesflareEndpointOutputs['createMeeting']
	>(ctx, '/meetings', { method: 'POST', body: input });
	await logEventFromContext(
		ctx,
		'salesflare.meetings.createMeeting',
		input,
		'completed',
	);
	return response;
};
