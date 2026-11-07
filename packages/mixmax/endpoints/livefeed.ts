import { logEventFromContext } from 'corsair/core';
import { makeMixmaxRequest } from '../client';
import type { MixmaxEndpoints } from '../index';
import type { MixmaxEndpointOutputs } from './types';

export const livefeedList: MixmaxEndpoints['livefeedList'] = async (
	ctx,
	input,
) => {
	const result = await makeMixmaxRequest<MixmaxEndpointOutputs['livefeedList']>(
		ctx,
		'/v1/livefeed',
		{
			method: 'GET',
			query: {
				query: input.query,
				timezone: input.timezone,
				limit: input.limit,
				offset: input.offset,
				next: input.next,
				previous: input.previous,
				stats: input.stats,
				showOnlySyncedToMixmax: input.showOnlySyncedToMixmax,
				// Passed through as an array; the shared transport serializes
				// arrays as repeated query keys (messageIds=a&messageIds=b),
				// matching the parameter's form/explode style.
				messageIds: input.messageIds,
			},
		},
	);

	await logEventFromContext(
		ctx,
		'mixmax.livefeed.list',
		{ ...input },
		'completed',
	);
	return result;
};

export const livefeedEvents: MixmaxEndpoints['livefeedEvents'] = async (
	ctx,
	input,
) => {
	const result = await makeMixmaxRequest<
		MixmaxEndpointOutputs['livefeedEvents']
	>(ctx, '/v1/livefeed/events', {
		method: 'GET',
		query: {
			messageId: input.messageId,
			wasSentViaMixmax: input.wasSentViaMixmax,
			contactEmail: input.contactEmail,
			includeGroupMembers: input.includeGroupMembers,
			includeTeammates: input.includeTeammates,
			limit: input.limit,
			next: input.next,
		},
	});

	await logEventFromContext(
		ctx,
		'mixmax.livefeed.events',
		{ ...input },
		'completed',
	);
	return result;
};
