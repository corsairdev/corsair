import { logEventFromContext } from 'corsair/core';
import type { WhautomateHandler } from '../client';
import { makeWhautomateRequest, resolveApiHost } from '../client';

import type {
	WhautomateEndpointInputs,
	WhautomateEndpointOutputs,
} from './types';
import { WhautomateEndpointOutputSchemas } from './types';

export const getSegments: WhautomateHandler<
	WhautomateEndpointInputs['getSegments'],
	WhautomateEndpointOutputs['getSegments']
> = async (ctx, input) => {
	const query: Record<string, string | number | boolean | undefined> = {};
	if (input.page !== undefined) query.page = input.page;
	if (input.limit !== undefined) query.limit = input.limit;
	if (input.name !== undefined) query.name = input.name;

	const result = await makeWhautomateRequest<
		WhautomateEndpointOutputs['getSegments']
	>(
		await resolveApiHost(ctx),
		ctx.key,
		'/segments',
		WhautomateEndpointOutputSchemas.getSegments,
		{
			method: 'GET',
			query,
		},
	);

	await logEventFromContext(
		ctx,
		'whautomate.segments.list',
		{ ...input },
		'completed',
	);
	return result;
};

export const deleteSegment: WhautomateHandler<
	WhautomateEndpointInputs['deleteSegment'],
	WhautomateEndpointOutputs['deleteSegment']
> = async (ctx, input) => {
	const result = await makeWhautomateRequest<
		WhautomateEndpointOutputs['deleteSegment']
	>(
		await resolveApiHost(ctx),
		ctx.key,
		`/segments/${input.id}`,
		WhautomateEndpointOutputSchemas.deleteSegment,
		{
			method: 'DELETE',
		},
	);

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
