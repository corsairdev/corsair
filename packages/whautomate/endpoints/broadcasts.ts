import { logEventFromContext } from 'corsair/core';
import { makeWhautomateRequest, resolveApiHost } from '../client';
import type { WhautomateEndpoints } from '../index';
import type { WhautomateEndpointOutputs } from './types';
import { WhautomateEndpointOutputSchemas } from './types';

export const getBroadcasts: WhautomateEndpoints['getBroadcasts'] = async (
	ctx,
	input,
) => {
	const query: Record<string, string | number | boolean | undefined> = {};
	if (input.page !== undefined) query.page = input.page;
	if (input.limit !== undefined) query.limit = input.limit;
	if (input.startDate !== undefined) query.startDate = input.startDate;
	if (input.endDate !== undefined) query.endDate = input.endDate;
	if (input.status !== undefined) query.status = input.status;

	const result = await makeWhautomateRequest<
		WhautomateEndpointOutputs['getBroadcasts']
	>(
		await resolveApiHost(ctx),
		ctx.key,
		'/broadcasts',
		WhautomateEndpointOutputSchemas.getBroadcasts,
		{
			method: 'GET',
			query,
		},
	);

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
	>(
		await resolveApiHost(ctx),
		ctx.key,
		`/broadcasts/${input.id}`,
		WhautomateEndpointOutputSchemas.getBroadcastById,
		{
			method: 'GET',
		},
	);

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
