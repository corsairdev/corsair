import { logEventFromContext } from 'corsair/core';
import { makeWhautomateRequest } from '../client';
import type { WhautomateEndpoints } from '../index';
import type { WhautomateEndpointOutputs } from './types';

export const getSegments: WhautomateEndpoints['getSegments'] = async (
	ctx,
	input,
) => {
	const query: Record<string, string | number | boolean | undefined> = {};
	if (input.page) query.page = input.page;
	if (input.limit) query.limit = input.limit;
	if (input.name) query.name = input.name;

	const result = await makeWhautomateRequest<
		WhautomateEndpointOutputs['getSegments']
	>(ctx.options.apiHost!, ctx.key, '/segments', {
		method: 'GET',
		query,
	});

	await logEventFromContext(
		ctx,
		'whautomate.segments.list',
		{ ...input },
		'completed',
	);
	return result;
};

export const deleteSegment: WhautomateEndpoints['deleteSegment'] = async (
	ctx,
	input,
) => {
	const result = await makeWhautomateRequest<
		WhautomateEndpointOutputs['deleteSegment']
	>(ctx.options.apiHost!, ctx.key, `/segments/${input.id}`, {
		method: 'DELETE',
	});

	await logEventFromContext(
		ctx,
		'whautomate.segments.delete',
		{ ...input },
		'completed',
	);
	return result;
};

export const Segments = {
	getSegments,
	deleteSegment,
};
