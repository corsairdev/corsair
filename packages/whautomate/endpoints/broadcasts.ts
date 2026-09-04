import { logEventFromContext } from 'corsair/core';
import { makeWhautomateRequest } from '../client';
import type { WhautomateEndpoints } from '../index';
import type { WhautomateEndpointOutputs } from './types';

export const getBroadcasts: WhautomateEndpoints['getBroadcasts'] = async (
	ctx,
	input,
) => {
	const query: Record<string, string | number | boolean | undefined> = {};
	if (input.page) query.page = input.page;
	if (input.limit) query.limit = input.limit;
	if (input.startDate) query.startDate = input.startDate;
	if (input.endDate) query.endDate = input.endDate;
	if (input.status) query.status = input.status;

	const result = await makeWhautomateRequest<
		WhautomateEndpointOutputs['getBroadcasts']
	>(ctx.options.apiHost!, ctx.key, '/broadcasts', {
		method: 'GET',
		query,
	});

	await logEventFromContext(
		ctx,
		'whautomate.broadcasts.list',
		{ ...input },
		'completed',
	);
	return result;
};

export const getBroadcastById: WhautomateEndpoints['getBroadcastById'] = async (
	ctx,
	input,
) => {
	const result = await makeWhautomateRequest<
		WhautomateEndpointOutputs['getBroadcastById']
	>(ctx.options.apiHost!, ctx.key, `/broadcasts/${input.id}`, {
		method: 'GET',
	});

	await logEventFromContext(
		ctx,
		'whautomate.broadcasts.get',
		{ ...input },
		'completed',
	);
	return result;
};

export const Broadcasts = {
	getBroadcasts,
	getBroadcastById,
};
