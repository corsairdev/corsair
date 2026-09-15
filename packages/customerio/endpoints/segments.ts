import { logEventFromContext } from 'corsair/core';
import type { CustomerioEndpoints } from '..';
import { makeAppRequest } from '../client';
import type { CustomerioEndpointOutputs } from './types';

// GET /v1/segments
// Docs: https://docs.customer.io/integrations/api/app/tag/segments/listSegments/
export const getSegments: CustomerioEndpoints['getSegments'] = async (
	ctx,
	input,
) => {
	const response = await makeAppRequest<
		CustomerioEndpointOutputs['getSegments']
	>('/v1/segments', ctx.key, { method: 'GET', region: ctx.options.region });
	await logEventFromContext(
		ctx,
		'customerio.segments.getSegments',
		{ ...input },
		'completed',
	);
	return response;
};

// GET /v1/segments/{segment_id}
// Docs: https://docs.customer.io/integrations/api/app/tag/segments/getSegment/
export const getSegmentDetails: CustomerioEndpoints['getSegmentDetails'] =
	async (ctx, input) => {
		const response = await makeAppRequest<
			CustomerioEndpointOutputs['getSegmentDetails']
		>(`/v1/segments/${encodeURIComponent(String(input.segment_id))}`, ctx.key, {
			method: 'GET',
			region: ctx.options.region,
		});
		await logEventFromContext(
			ctx,
			'customerio.segments.getSegmentDetails',
			{ ...input },
			'completed',
		);
		return response;
	};

// GET /v1/segments/{segment_id}/membership
// Docs: https://docs.customer.io/integrations/api/app/tag/segments/getSegmentMembership/
export const getSegmentMembership: CustomerioEndpoints['getSegmentMembership'] =
	async (ctx, input) => {
		const response = await makeAppRequest<
			CustomerioEndpointOutputs['getSegmentMembership']
		>(
			`/v1/segments/${encodeURIComponent(String(input.segment_id))}/membership`,
			ctx.key,
			{
				method: 'GET',
				region: ctx.options.region,
				query: {
					limit: input.limit,
					start: input.start,
				},
			},
		);
		await logEventFromContext(
			ctx,
			'customerio.segments.getSegmentMembership',
			{ ...input },
			'completed',
		);
		return response;
	};
